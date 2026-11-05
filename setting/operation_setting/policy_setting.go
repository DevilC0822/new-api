package operation_setting

import "github.com/QuantumNous/new-api/setting/config"

// PolicySetting 收敛上游聚合平台“内容安全违规”相关的站点级策略：
// 违规费转嫁、终端用户标识头、以及按用户维度的自动限制。
type PolicySetting struct {
	// ViolationFeeEnabled 命中上游违规信号（审核拒绝码、content_filter / refusal 拒答等）时，向终端用户加收一笔违规费
	ViolationFeeEnabled bool `json:"violation_fee_enabled"`
	// ViolationFeeUSD 每次违规收取的美元金额。上游按全额扣费，因此不乘分组倍率，按原价转嫁
	ViolationFeeUSD float64 `json:"violation_fee_usd"`
	// EndUserIDHeaderEnabled 向上游发送终端用户标识头（固定 X-End-User-Id），供上游按最终用户限流/封禁
	EndUserIDHeaderEnabled bool `json:"end_user_id_header_enabled"`
	// AutoRestrictEnabled 窗口内违规次数达到阈值后自动禁用该用户，保护站点上游 key
	AutoRestrictEnabled bool `json:"auto_restrict_enabled"`
	// ViolationThreshold 自动限制的违规次数阈值
	ViolationThreshold int `json:"violation_threshold"`
	// ViolationWindowMinutes 违规计数的窗口长度（分钟）
	ViolationWindowMinutes int `json:"violation_window_minutes"`
}

// 默认全部关闭：违规费与自动禁用属于惩罚性行为，由站点管理员显式开启。
var defaultPolicySetting = PolicySetting{
	ViolationFeeEnabled:    false,
	ViolationFeeUSD:        0.1,
	EndUserIDHeaderEnabled: false,
	AutoRestrictEnabled:    false,
	ViolationThreshold:     5,
	ViolationWindowMinutes: 60,
}

var policySetting = defaultPolicySetting

func init() {
	config.GlobalConfig.Register("policy", &policySetting)
}

func GetPolicySetting() *PolicySetting {
	return &policySetting
}
