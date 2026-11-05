package service

import (
	"net/http"
	"testing"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/constant"
	"github.com/QuantumNous/new-api/model"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/relaykit/types"
	"github.com/QuantumNous/new-api/setting/model_setting"
	"github.com/QuantumNous/new-api/setting/operation_setting"

	"github.com/gin-gonic/gin"
	"github.com/glebarez/sqlite"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func withPolicySetting(t *testing.T, mutate func(*operation_setting.PolicySetting)) {
	t.Helper()
	settings := operation_setting.GetPolicySetting()
	previous := *settings
	mutate(settings)
	t.Cleanup(func() { *settings = previous })
}

func withGrokSetting(t *testing.T, mutate func(*model_setting.GrokSettings)) {
	t.Helper()
	settings := model_setting.GetGrokSettings()
	previous := *settings
	mutate(settings)
	t.Cleanup(func() { *settings = previous })
}

func upstreamPolicyError(code, message string, statusCode int) *types.NewAPIError {
	return types.WithOpenAIError(types.OpenAIError{
		Message: message,
		Type:    "upstream_error",
		Code:    code,
	}, statusCode)
}

func TestUpstreamPolicyViolationMarker(t *testing.T) {
	for _, tc := range []struct {
		name                string
		code                string
		message             string
		wantMarker          string
		wantCountsTowardHit bool
	}{
		{name: "input text moderation code counts", code: "InputTextSensitiveContentDetected", message: "blocked", wantMarker: "InputTextSensitiveContentDetected", wantCountsTowardHit: true},
		{name: "output image moderation code counts", code: "OutputImageSensitiveContentDetected", message: "blocked", wantMarker: "OutputImageSensitiveContentDetected", wantCountsTowardHit: true},
		{name: "generic moderation code counts", code: "SensitiveContentDetected", message: "blocked", wantMarker: "SensitiveContentDetected", wantCountsTowardHit: true},
		{name: "cyber policy is fee only", code: "cyber_policy", message: "blocked", wantMarker: "cyber_policy"},
		{name: "output filter message is fee only", code: "invalid_request_error", message: "Output blocked by content filtering policy", wantMarker: OutputBlockedByContentFilterMarker},
		{name: "ordinary error is not a violation", code: "context_length_exceeded", message: "too long"},
		{name: "nil error is not a violation"},
	} {
		t.Run(tc.name, func(t *testing.T) {
			var err *types.NewAPIError
			if tc.name != "nil error is not a violation" {
				err = upstreamPolicyError(tc.code, tc.message, http.StatusBadRequest)
			}
			marker, counts := upstreamPolicyViolationMarker(err)
			assert.Equal(t, tc.wantMarker, marker)
			assert.Equal(t, tc.wantCountsTowardHit, counts)
		})
	}
}

func TestNormalizeViolationFeeErrorForPolicySignals(t *testing.T) {
	t.Run("moderation code becomes stable fee code and skips retry", func(t *testing.T) {
		normalized := NormalizeViolationFeeError(upstreamPolicyError("InputTextSensitiveContentDetected", "blocked", http.StatusBadRequest))
		require.NotNil(t, normalized)
		assert.Equal(t, types.ErrorCodeViolationFeeUpstream, normalized.GetErrorCode())
		assert.True(t, types.IsSkipRetryError(normalized))
	})

	t.Run("cyber policy keeps upstream code but skips retry", func(t *testing.T) {
		normalized := NormalizeViolationFeeError(upstreamPolicyError("cyber_policy", "blocked", http.StatusBadRequest))
		require.NotNil(t, normalized)
		assert.Equal(t, types.ErrorCode("cyber_policy"), normalized.GetErrorCode())
		assert.True(t, types.IsSkipRetryError(normalized))
	})

	t.Run("end user restriction errors skip retry without changing code", func(t *testing.T) {
		for _, code := range []string{"request_blocked", "model_denylisted", "account_restricted"} {
			normalized := NormalizeViolationFeeError(upstreamPolicyError(code, "restricted", http.StatusForbidden))
			require.NotNil(t, normalized)
			assert.Equal(t, types.ErrorCode(code), normalized.GetErrorCode())
			assert.True(t, types.IsSkipRetryError(normalized), code)
		}
	})

	t.Run("rate limit only skips retry when the end user header is enabled", func(t *testing.T) {
		rateLimited := upstreamPolicyError("rate_limit_exceeded", "slow down", http.StatusTooManyRequests)

		withPolicySetting(t, func(s *operation_setting.PolicySetting) { s.EndUserIDHeaderEnabled = false })
		assert.False(t, types.IsSkipRetryError(NormalizeViolationFeeError(rateLimited)))

		withPolicySetting(t, func(s *operation_setting.PolicySetting) { s.EndUserIDHeaderEnabled = true })
		assert.True(t, types.IsSkipRetryError(NormalizeViolationFeeError(rateLimited)))
	})

	t.Run("already normalized fee code keeps skip retry", func(t *testing.T) {
		normalized := NormalizeViolationFeeError(upstreamPolicyError(string(types.ErrorCodeViolationFeeUpstream), "blocked", http.StatusBadRequest))
		require.NotNil(t, normalized)
		assert.Equal(t, types.ErrorCodeViolationFeeUpstream, normalized.GetErrorCode())
		assert.True(t, types.IsSkipRetryError(normalized))
	})

	t.Run("ordinary errors pass through untouched", func(t *testing.T) {
		original := upstreamPolicyError("server_error", "boom", http.StatusInternalServerError)
		assert.Same(t, original, NormalizeViolationFeeError(original))
	})
}

func TestCalcFlatViolationFeeQuota(t *testing.T) {
	assert.Equal(t, 50000, calcFlatViolationFeeQuota(0.1))
	assert.Equal(t, 500000, calcFlatViolationFeeQuota(1))
	assert.Zero(t, calcFlatViolationFeeQuota(0))
	assert.Zero(t, calcFlatViolationFeeQuota(-0.1))
}

func setupViolationFeeTestDB(t *testing.T) {
	t.Helper()
	previousDB := model.DB
	database, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	require.NoError(t, err)
	sqlDB, err := database.DB()
	require.NoError(t, err)
	sqlDB.SetMaxOpenConns(1)
	t.Cleanup(func() { require.NoError(t, sqlDB.Close()) })
	require.NoError(t, database.AutoMigrate(&model.User{}, &model.Channel{}, &model.Ability{}, &model.Log{}, &model.Token{}, &model.UserSession{}))
	model.DB = database
	previousLogDB := model.LOG_DB
	model.LOG_DB = database
	t.Cleanup(func() {
		model.DB = previousDB
		model.LOG_DB = previousLogDB
	})
	common.SetMainDatabaseType(common.DatabaseTypeSQLite)
	common.RedisEnabled = false
	common.LogConsumeEnabled = true
	t.Cleanup(func() { common.LogConsumeEnabled = false })
	resetPolicyViolationCounters()
}

func setUserQuota(t *testing.T, userId int, quota int) {
	t.Helper()
	require.NoError(t, model.DB.Model(&model.User{}).Where("id = ?", userId).Update("quota", quota).Error)
}

func newViolationFeeRelayInfo(userId int) *relaycommon.RelayInfo {
	return &relaycommon.RelayInfo{
		UserId:          userId,
		IsPlayground:    true,
		OriginModelName: "test-model",
		UsingGroup:      "default",
		StartTime:       time.Now(),
	}
}

func TestChargeViolationFeeIfNeededChargesUpstreamPolicyFee(t *testing.T) {
	setupViolationFeeTestDB(t)
	user := &model.User{Username: "policy-fee-user", Role: common.RoleCommonUser, Status: common.UserStatusEnabled}
	require.NoError(t, user.Insert(0))
	setUserQuota(t, user.Id, 100000)
	channel := &model.Channel{Name: "policy-fee-channel", Key: "k", Type: 1, Status: common.ChannelStatusEnabled, Group: "default", Models: "test-model"}
	require.NoError(t, channel.Insert())

	withPolicySetting(t, func(s *operation_setting.PolicySetting) {
		s.ViolationFeeEnabled = true
		s.ViolationFeeUSD = 0.1
		s.AutoRestrictEnabled = false
	})
	withGrokSetting(t, func(s *model_setting.GrokSettings) { s.ViolationDeductionEnabled = false })

	c, _ := gin.CreateTestContext(nil)
	relayInfo := newViolationFeeRelayInfo(user.Id)
	relayInfo.ChannelMeta = &relaycommon.ChannelMeta{ChannelId: channel.Id}

	t.Run("moderation rejection is charged flat without group discount", func(t *testing.T) {
		charged := ChargeViolationFeeIfNeeded(c, relayInfo, upstreamPolicyError("InputTextSensitiveContentDetected", "blocked", http.StatusBadRequest))
		assert.True(t, charged)
		updated, err := model.GetUserById(user.Id, false)
		require.NoError(t, err)
		assert.Equal(t, 100000-50000, updated.Quota)
		assert.Equal(t, 50000, updated.UsedQuota)
	})

	t.Run("already normalized fee code charges the same amount", func(t *testing.T) {
		normalized := NormalizeViolationFeeError(upstreamPolicyError("SensitiveContentDetected", "blocked", http.StatusBadRequest))
		assert.True(t, ChargeViolationFeeIfNeeded(c, relayInfo, normalized))
		updated, err := model.GetUserById(user.Id, false)
		require.NoError(t, err)
		assert.Equal(t, 100000-100000, updated.Quota)
	})

	t.Run("fee log carries violation metadata", func(t *testing.T) {
		var logs []model.Log
		require.NoError(t, model.DB.Where("user_id = ? AND type = ?", user.Id, model.LogTypeConsume).Find(&logs).Error)
		require.Len(t, logs, 2)
	})

	t.Run("disabled policy fee does not charge", func(t *testing.T) {
		withPolicySetting(t, func(s *operation_setting.PolicySetting) { s.ViolationFeeEnabled = false })
		user2 := &model.User{Username: "policy-fee-user-2", Role: common.RoleCommonUser, Status: common.UserStatusEnabled}
		require.NoError(t, user2.Insert(0))
		setUserQuota(t, user2.Id, 100000)
		info2 := newViolationFeeRelayInfo(user2.Id)
		info2.ChannelMeta = &relaycommon.ChannelMeta{ChannelId: channel.Id}
		assert.False(t, ChargeViolationFeeIfNeeded(c, info2, upstreamPolicyError("cyber_policy", "blocked", http.StatusBadRequest)))
		updated, err := model.GetUserById(user2.Id, false)
		require.NoError(t, err)
		assert.Equal(t, 100000, updated.Quota)
	})
}

func TestChargeRefusalViolationFeeIfNeeded(t *testing.T) {
	setupViolationFeeTestDB(t)
	user := &model.User{Username: "refusal-fee-user", Role: common.RoleCommonUser, Status: common.UserStatusEnabled}
	require.NoError(t, user.Insert(0))
	setUserQuota(t, user.Id, 60000)
	channel := &model.Channel{Name: "refusal-fee-channel", Key: "k", Type: 1, Status: common.ChannelStatusEnabled, Group: "default", Models: "test-model"}
	require.NoError(t, channel.Insert())

	withPolicySetting(t, func(s *operation_setting.PolicySetting) {
		s.ViolationFeeEnabled = true
		s.ViolationFeeUSD = 0.1
		s.AutoRestrictEnabled = false
	})

	c, _ := gin.CreateTestContext(nil)
	relayInfo := newViolationFeeRelayInfo(user.Id)
	relayInfo.ChannelMeta = &relaycommon.ChannelMeta{ChannelId: channel.Id}

	for _, reason := range []string{"openai_finish_reason=content_filter", "claude_stop_reason=refusal"} {
		common.SetContextKey(c, constant.ContextKeyAdminRejectReason, reason)
		assert.True(t, ChargeRefusalViolationFeeIfNeeded(c, relayInfo), reason)
	}
	updated, err := model.GetUserById(user.Id, false)
	require.NoError(t, err)
	assert.Equal(t, 60000-2*50000, updated.Quota)

	common.SetContextKey(c, constant.ContextKeyAdminRejectReason, "gemini_block_reason=SAFETY")
	assert.False(t, ChargeRefusalViolationFeeIfNeeded(c, relayInfo))
	common.SetContextKey(c, constant.ContextKeyAdminRejectReason, "")
	assert.False(t, ChargeRefusalViolationFeeIfNeeded(c, relayInfo))
}

func TestEnforcePolicyViolationLimitDisablesUser(t *testing.T) {
	setupViolationFeeTestDB(t)
	user := &model.User{Username: "restrict-me", Role: common.RoleCommonUser, Status: common.UserStatusEnabled, Quota: 1000000}
	require.NoError(t, user.Insert(0))
	admin := &model.User{Username: "restrict-admin", Role: common.RoleAdminUser, Status: common.UserStatusEnabled, Quota: 1000000}
	require.NoError(t, admin.Insert(0))

	withPolicySetting(t, func(s *operation_setting.PolicySetting) {
		s.AutoRestrictEnabled = true
		s.ViolationThreshold = 3
		s.ViolationWindowMinutes = 60
	})

	c, _ := gin.CreateTestContext(nil)
	relayInfo := newViolationFeeRelayInfo(user.Id)

	EnforcePolicyViolationLimit(c, relayInfo)
	EnforcePolicyViolationLimit(c, relayInfo)
	stillEnabled, err := model.GetUserById(user.Id, false)
	require.NoError(t, err)
	assert.Equal(t, common.UserStatusEnabled, stillEnabled.Status)

	EnforcePolicyViolationLimit(c, relayInfo)
	disabled, err := model.GetUserById(user.Id, false)
	require.NoError(t, err)
	assert.Equal(t, common.UserStatusDisabled, disabled.Status)

	t.Run("admin accounts are never auto disabled", func(t *testing.T) {
		adminInfo := newViolationFeeRelayInfo(admin.Id)
		for range 5 {
			EnforcePolicyViolationLimit(c, adminInfo)
		}
		unchanged, err := model.GetUserById(admin.Id, false)
		require.NoError(t, err)
		assert.Equal(t, common.UserStatusEnabled, unchanged.Status)
	})

	t.Run("already disabled user stays disabled without error", func(t *testing.T) {
		require.NoError(t, DisableUserForPolicyViolation(user.Id))
	})

	t.Run("disabled auto restriction keeps counting harmless", func(t *testing.T) {
		withPolicySetting(t, func(s *operation_setting.PolicySetting) { s.AutoRestrictEnabled = false })
		EnforcePolicyViolationLimit(c, relayInfo)
	})
}
