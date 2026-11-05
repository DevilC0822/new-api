package service

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/logger"
	"github.com/QuantumNous/new-api/model"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/relaykit/types"
	"github.com/QuantumNous/new-api/setting/model_setting"
	"github.com/QuantumNous/new-api/setting/operation_setting"

	"github.com/shopspring/decimal"

	"github.com/gin-gonic/gin"
)

const (
	ViolationFeeCodePrefix     = "violation_fee."
	CSAMViolationMarker        = "Failed check: SAFETY_CHECK_TYPE"
	ContentViolatesUsageMarker = "Content violates usage guidelines"
	// OutputBlockedByContentFilterMarker is the message some upstreams return
	// when Claude output is blocked by the content filtering policy. Aggregation
	// platforms charge a violation fee for it.
	OutputBlockedByContentFilterMarker = "Output blocked by content filtering policy"
	// sensitiveContentDetectedMarker matches the content-moderation rejection
	// code family (InputTextSensitiveContentDetected,
	// OutputImageSensitiveContentDetected, SensitiveContentDetected, ...).
	sensitiveContentDetectedMarker = "sensitivecontentdetected"
	// cyberPolicyMarker is the OpenAI cyber policy block error code.
	cyberPolicyMarker = "cyber_policy"
	// Upstream end-user restriction error codes: the requesting end user is
	// already rate-limited or paused upstream, so retries cannot succeed.
	upstreamRestrictionCodeRequestBlocked    = "request_blocked"
	upstreamRestrictionCodeModelDenylisted   = "model_denylisted"
	upstreamRestrictionCodeAccountRestricted = "account_restricted"
	upstreamRestrictionCodeRateLimited       = "rate_limit_exceeded"
)

func IsViolationFeeCode(code types.ErrorCode) bool {
	return strings.HasPrefix(string(code), ViolationFeeCodePrefix)
}

func HasCSAMViolationMarker(err *types.NewAPIError) bool {
	if err == nil {
		return false
	}
	if strings.Contains(err.Error(), CSAMViolationMarker) || strings.Contains(err.Error(), ContentViolatesUsageMarker) {
		return true
	}
	msg := err.ToOpenAIError().Message
	return strings.Contains(msg, CSAMViolationMarker) || strings.Contains(err.Error(), ContentViolatesUsageMarker)
}

// upstreamPolicyViolationMarker reports the upstream policy-violation signal
// carried by the error, if any. countsTowardLimit distinguishes violations
// that also count toward per-user escalation limits (content moderation
// rejections) from fee-only signals (cyber policy block, output filter).
func upstreamPolicyViolationMarker(err *types.NewAPIError) (marker string, countsTowardLimit bool) {
	if err == nil {
		return "", false
	}
	code := string(err.GetErrorCode())
	switch {
	case strings.EqualFold(code, cyberPolicyMarker):
		return cyberPolicyMarker, false
	case strings.Contains(strings.ToLower(code), sensitiveContentDetectedMarker):
		return code, true
	}
	msg := strings.ToLower(err.ToOpenAIError().Message)
	if strings.Contains(msg, strings.ToLower(OutputBlockedByContentFilterMarker)) {
		return OutputBlockedByContentFilterMarker, false
	}
	return "", false
}

func HasUpstreamPolicyViolationMarker(err *types.NewAPIError) bool {
	marker, _ := upstreamPolicyViolationMarker(err)
	return marker != ""
}

// IsUpstreamEndUserRestriction reports whether the upstream rejected the
// request because the end user (or the account) is already restricted there.
// Retrying such requests cannot succeed and only adds upstream pressure.
func IsUpstreamEndUserRestriction(err *types.NewAPIError) bool {
	if err == nil {
		return false
	}
	code := string(err.GetErrorCode())
	switch {
	case strings.EqualFold(code, upstreamRestrictionCodeRequestBlocked),
		strings.EqualFold(code, upstreamRestrictionCodeModelDenylisted),
		strings.EqualFold(code, upstreamRestrictionCodeAccountRestricted):
		return true
	case strings.EqualFold(code, upstreamRestrictionCodeRateLimited) &&
		err.StatusCode == http.StatusTooManyRequests &&
		operation_setting.GetPolicySetting().EndUserIDHeaderEnabled:
		// With the end-user header enabled, an upstream rate limit targets this
		// end user specifically, so another attempt still fails.
		return true
	}
	return false
}

func WrapAsViolationFeeGrokCSAM(err *types.NewAPIError) *types.NewAPIError {
	if err == nil {
		return nil
	}
	oai := err.ToOpenAIError()
	oai.Type = string(types.ErrorCodeViolationFeeGrokCSAM)
	oai.Code = string(types.ErrorCodeViolationFeeGrokCSAM)
	return types.WithOpenAIError(oai, err.StatusCode, types.ErrOptionWithSkipRetry())
}

// wrapAsUpstreamPolicyViolation rewrites the error to the stable violation-fee
// code with skip-retry, so the request is never replayed (each replay would be
// charged by the upstream again).
func wrapAsUpstreamPolicyViolation(err *types.NewAPIError) *types.NewAPIError {
	if err == nil {
		return nil
	}
	oai := err.ToOpenAIError()
	oai.Type = string(types.ErrorCodeViolationFeeUpstream)
	oai.Code = string(types.ErrorCodeViolationFeeUpstream)
	return types.WithOpenAIError(oai, err.StatusCode, types.ErrOptionWithSkipRetry())
}

// NormalizeViolationFeeError ensures:
// - if the CSAM marker is present, error.code is set to a stable violation-fee code and skip-retry is enabled.
// - if the error matches an upstream policy-violation signal that counts toward escalation limits, error.code is set to a stable violation-fee code and skip-retry is enabled.
// - fee-only policy-violation signals keep their upstream code but gain skip-retry.
// - if error.code already has the violation-fee prefix, skip-retry is enabled.
// - upstream end-user restriction errors gain skip-retry without changing their code.
//
// It must be called before retry decision logic.
func NormalizeViolationFeeError(err *types.NewAPIError) *types.NewAPIError {
	if err == nil {
		return nil
	}

	if HasCSAMViolationMarker(err) {
		return WrapAsViolationFeeGrokCSAM(err)
	}

	if marker, countsTowardLimit := upstreamPolicyViolationMarker(err); marker != "" {
		if countsTowardLimit {
			return wrapAsUpstreamPolicyViolation(err)
		}
		oai := err.ToOpenAIError()
		return types.WithOpenAIError(oai, err.StatusCode, types.ErrOptionWithSkipRetry())
	}

	if IsViolationFeeCode(err.GetErrorCode()) {
		oai := err.ToOpenAIError()
		return types.WithOpenAIError(oai, err.StatusCode, types.ErrOptionWithSkipRetry())
	}

	if IsUpstreamEndUserRestriction(err) {
		oai := err.ToOpenAIError()
		return types.WithOpenAIError(oai, err.StatusCode, types.ErrOptionWithSkipRetry())
	}

	return err
}

func shouldChargeViolationFee(err *types.NewAPIError) bool {
	if err == nil {
		return false
	}
	if err.GetErrorCode() == types.ErrorCodeViolationFeeGrokCSAM {
		return true
	}
	if err.GetErrorCode() == types.ErrorCodeViolationFeeUpstream {
		return true
	}
	// In case some callers didn't normalize, keep a safety net.
	return HasCSAMViolationMarker(err) || HasUpstreamPolicyViolationMarker(err)
}

func calcViolationFeeQuota(amount, groupRatio float64) int {
	if amount <= 0 {
		return 0
	}
	if groupRatio <= 0 {
		return 0
	}
	quota := common.QuotaFromDecimal(decimal.NewFromFloat(amount).
		Mul(decimal.NewFromFloat(common.QuotaPerUnit)).
		Mul(decimal.NewFromFloat(groupRatio)).
		Round(0))
	if quota <= 0 {
		return 0
	}
	return quota
}

// calcFlatViolationFeeQuota converts a USD fee to quota without any group
// ratio multiplier: the upstream charges the full amount regardless of the
// user's discounted group, so discounting the pass-through fee would lose money.
func calcFlatViolationFeeQuota(amount float64) int {
	if amount <= 0 {
		return 0
	}
	quota := common.QuotaFromDecimal(decimal.NewFromFloat(amount).
		Mul(decimal.NewFromFloat(common.QuotaPerUnit)).
		Round(0))
	if quota <= 0 {
		return 0
	}
	return quota
}

// ChargeViolationFeeIfNeeded charges an additional fee after the normal flow finishes (including refund).
// It uses Grok fee settings as the fee policy.
func ChargeViolationFeeIfNeeded(ctx *gin.Context, relayInfo *relaycommon.RelayInfo, apiErr *types.NewAPIError) bool {
	if ctx == nil || relayInfo == nil || apiErr == nil {
		return false
	}
	//if relayInfo.IsPlayground {
	//	return false
	//}
	if apiErr.GetErrorCode() == types.ErrorCodeViolationFeeUpstream {
		charged := chargeUpstreamPolicyViolationFee(ctx, relayInfo, apiErr, "")
		EnforcePolicyViolationLimit(ctx, relayInfo)
		return charged
	}
	if marker, _ := upstreamPolicyViolationMarker(apiErr); marker != "" {
		// Fee-only signals (cyber_policy, output filter block): charged but not
		// counted toward the per-user escalation limit.
		return chargeUpstreamPolicyViolationFee(ctx, relayInfo, apiErr, marker)
	}
	if !shouldChargeViolationFee(apiErr) {
		return false
	}

	settings := model_setting.GetGrokSettings()
	if settings == nil || !settings.ViolationDeductionEnabled {
		return false
	}

	groupRatio := relayInfo.PriceData.GroupRatioInfo.GroupRatio
	feeQuota := calcViolationFeeQuota(settings.ViolationDeductionAmount, groupRatio)
	if feeQuota <= 0 {
		return false
	}

	if err := PostConsumeQuota(relayInfo, feeQuota, 0, true); err != nil {
		logger.LogError(ctx, common.LogText("failed to charge violation fee: %s", err.Error()))
		return false
	}

	model.UpdateUserUsedQuotaAndRequestCount(relayInfo.UserId, feeQuota)
	model.UpdateChannelUsedQuota(relayInfo.ChannelId, feeQuota)

	oai := apiErr.ToOpenAIError(common.UpstreamAddresses(ctx)...)

	other := model.NewLogOther()
	other.MergePublic(map[string]any{
		"violation_fee":        true,
		"violation_fee_code":   string(types.ErrorCodeViolationFeeGrokCSAM),
		"fee_quota":            feeQuota,
		"base_amount":          settings.ViolationDeductionAmount,
		"group_ratio":          groupRatio,
		"status_code":          apiErr.StatusCode,
		"upstream_error_type":  oai.Type,
		"upstream_error_code":  fmt.Sprintf("%v", oai.Code),
		"violation_fee_marker": CSAMViolationMarker,
	})

	recordViolationFeeConsumeLog(ctx, relayInfo, feeQuota, other)

	return true
}

// chargeUpstreamPolicyViolationFee charges the configured policy violation fee
// for an upstream policy-violation error. It returns false when the policy fee
// is disabled or the amount resolves to zero.
func chargeUpstreamPolicyViolationFee(ctx *gin.Context, relayInfo *relaycommon.RelayInfo, apiErr *types.NewAPIError, marker string) bool {
	settings := operation_setting.GetPolicySetting()
	if !settings.ViolationFeeEnabled {
		return false
	}
	feeQuota := calcFlatViolationFeeQuota(settings.ViolationFeeUSD)
	if feeQuota <= 0 {
		return false
	}

	if err := PostConsumeQuota(relayInfo, feeQuota, 0, true); err != nil {
		logger.LogError(ctx, common.LogText("failed to charge policy violation fee: %s", err.Error()))
		return false
	}

	model.UpdateUserUsedQuotaAndRequestCount(relayInfo.UserId, feeQuota)
	model.UpdateChannelUsedQuota(relayInfo.ChannelId, feeQuota)

	if marker == "" {
		// The error was already normalized to the stable fee code; recover the
		// matched signal for the log from the upstream code/message.
		marker, _ = upstreamPolicyViolationMarker(apiErr)
	}
	oai := apiErr.ToOpenAIError(common.UpstreamAddresses(ctx)...)
	other := model.NewLogOther()
	other.MergePublic(map[string]any{
		"violation_fee":        true,
		"violation_fee_code":   string(types.ErrorCodeViolationFeeUpstream),
		"fee_quota":            feeQuota,
		"base_amount":          settings.ViolationFeeUSD,
		"status_code":          apiErr.StatusCode,
		"upstream_error_type":  oai.Type,
		"upstream_error_code":  fmt.Sprintf("%v", oai.Code),
		"violation_fee_marker": marker,
	})
	recordViolationFeeConsumeLog(ctx, relayInfo, feeQuota, other)

	return true
}

// ChargeRefusalViolationFeeIfNeeded charges the policy violation fee for
// upstream refusals delivered with HTTP 200 (finish_reason=content_filter /
// stop_reason=refusal). Tokens for such responses are billed normally; this
// fee passes through the aggregator's per-violation charge. Refusals count
// toward the per-user escalation limit.
func ChargeRefusalViolationFeeIfNeeded(ctx *gin.Context, relayInfo *relaycommon.RelayInfo) bool {
	if ctx == nil || relayInfo == nil {
		return false
	}
	reason := common.GetContextKeyString(ctx, constant.ContextKeyAdminRejectReason)
	if !isPolicyRefusalReason(reason) {
		return false
	}
	settings := operation_setting.GetPolicySetting()
	if !settings.ViolationFeeEnabled {
		EnforcePolicyViolationLimit(ctx, relayInfo)
		return false
	}
	feeQuota := calcFlatViolationFeeQuota(settings.ViolationFeeUSD)
	if feeQuota <= 0 {
		EnforcePolicyViolationLimit(ctx, relayInfo)
		return false
	}

	if err := PostConsumeQuota(relayInfo, feeQuota, 0, true); err != nil {
		logger.LogError(ctx, common.LogText("failed to charge refusal violation fee: %s", err.Error()))
		EnforcePolicyViolationLimit(ctx, relayInfo)
		return false
	}

	model.UpdateUserUsedQuotaAndRequestCount(relayInfo.UserId, feeQuota)
	model.UpdateChannelUsedQuota(relayInfo.ChannelId, feeQuota)

	other := model.NewLogOther()
	other.MergePublic(map[string]any{
		"violation_fee":        true,
		"violation_fee_code":   string(types.ErrorCodeViolationFeeUpstream),
		"fee_quota":            feeQuota,
		"base_amount":          settings.ViolationFeeUSD,
		"violation_fee_marker": reason,
	})
	recordViolationFeeConsumeLog(ctx, relayInfo, feeQuota, other)

	EnforcePolicyViolationLimit(ctx, relayInfo)
	return true
}

func isPolicyRefusalReason(reason string) bool {
	return reason == "openai_finish_reason=content_filter" || reason == "claude_stop_reason=refusal"
}

func recordViolationFeeConsumeLog(ctx *gin.Context, relayInfo *relaycommon.RelayInfo, feeQuota int, other *model.LogOther) {
	useTimeSeconds := time.Now().Unix() - relayInfo.StartTime.Unix()
	tokenName := ctx.GetString("token_name")
	model.RecordConsumeLog(ctx, relayInfo.UserId, model.RecordConsumeLogParams{
		ChannelId:      relayInfo.ChannelId,
		ModelName:      relayInfo.OriginModelName,
		TokenName:      tokenName,
		Quota:          feeQuota,
		Content:        []*common.Message{common.NewMessage("Violation fee charged")},
		TokenId:        relayInfo.TokenId,
		UseTimeSeconds: int(useTimeSeconds),
		IsStream:       relayInfo.IsStream,
		Group:          relayInfo.UsingGroup,
		Other:          other,
	})
}
