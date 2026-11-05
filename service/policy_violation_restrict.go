package service

import (
	"context"
	"fmt"
	"sync"
	"time"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/logger"
	"github.com/QuantumNous/new-api/model"
	relaycommon "github.com/QuantumNous/new-api/relay/common"
	"github.com/QuantumNous/new-api/setting/operation_setting"

	"github.com/gin-gonic/gin"
)

// policyViolationCounterKeyPrefix is the Redis key prefix for the per-user
// violation counter buckets: policy_violation_count:<user_id>:<bucket>.
const policyViolationCounterKeyPrefix = "policy_violation_count"

// policyViolationBuckets is the in-memory fallback used when Redis is
// disabled (single-instance deployments). Each user maps fixed time buckets
// to violation counts; stale buckets are pruned on touch.
var policyViolationBuckets = struct {
	sync.Mutex
	counts map[int]map[int64]int
}{counts: map[int]map[int64]int{}}

// countPolicyViolation records one violation for the user and returns the
// number of violations recorded in the current fixed window.
func countPolicyViolation(userId int, window time.Duration) int {
	if window <= 0 {
		window = time.Hour
	}
	now := time.Now().Unix()
	bucket := now / int64(window.Seconds())
	if common.RedisEnabled {
		if count, err := countPolicyViolationRedis(userId, bucket, window); err == nil {
			return count
		} else {
			common.SysError(common.LogText("failed to count policy violation in redis: %s", err.Error()))
		}
	}
	return countPolicyViolationMemory(userId, bucket, window)
}

func countPolicyViolationRedis(userId int, bucket int64, window time.Duration) (int, error) {
	key := fmt.Sprintf("%s:%d:%d", policyViolationCounterKeyPrefix, userId, bucket)
	ctx := context.Background()
	pipe := common.RDB.TxPipeline()
	incr := pipe.IncrBy(ctx, key, 1)
	// The bucket key only needs to outlive its window; doubling keeps the key
	// queryable shortly after the window closes and lets Redis evict it.
	pipe.Expire(ctx, key, 2*window)
	if _, err := pipe.Exec(ctx); err != nil {
		return 0, err
	}
	return int(incr.Val()), nil
}

func countPolicyViolationMemory(userId int, bucket int64, window time.Duration) int {
	policyViolationBuckets.Lock()
	defer policyViolationBuckets.Unlock()
	buckets := policyViolationBuckets.counts[userId]
	if buckets == nil {
		buckets = map[int64]int{}
		policyViolationBuckets.counts[userId] = buckets
	}
	// Prune buckets that can no longer receive hits.
	for b := range buckets {
		if b < bucket {
			delete(buckets, b)
		}
	}
	buckets[bucket]++
	return buckets[bucket]
}

// resetPolicyViolationCounters clears all in-memory counters; test helper.
func resetPolicyViolationCounters() {
	policyViolationBuckets.Lock()
	defer policyViolationBuckets.Unlock()
	policyViolationBuckets.counts = map[int]map[int64]int{}
}

// EnforcePolicyViolationLimit counts one policy violation for the requesting
// user and automatically disables the account once the configured threshold
// is reached inside the window. This stops runaway agents before the upstream
// escalates from per-end-user restrictions to account-wide ones.
func EnforcePolicyViolationLimit(ctx *gin.Context, relayInfo *relaycommon.RelayInfo) {
	if ctx == nil || relayInfo == nil {
		return
	}
	settings := operation_setting.GetPolicySetting()
	if !settings.AutoRestrictEnabled || relayInfo.UserId <= 0 {
		return
	}
	threshold := settings.ViolationThreshold
	if threshold <= 0 {
		return
	}
	window := time.Duration(settings.ViolationWindowMinutes) * time.Minute
	count := countPolicyViolation(relayInfo.UserId, window)
	if count < threshold {
		return
	}
	if err := DisableUserForPolicyViolation(relayInfo.UserId); err != nil {
		logger.LogError(ctx, common.LogText("failed to disable user %d after %d policy violations: %s", relayInfo.UserId, count, err.Error()))
	}
}

// DisableUserForPolicyViolation disables a regular user account after
// repeated upstream policy violations. Admin and root accounts are never
// auto-disabled; re-disabling an already-disabled user is a no-op.
func DisableUserForPolicyViolation(userId int) error {
	user, err := model.GetUserById(userId, false)
	if err != nil {
		return err
	}
	if user.Role >= common.RoleAdminUser {
		common.SysError(common.LogText("policy violation limit reached for admin user %d; skipping automatic disable", userId))
		return nil
	}
	if user.Status == common.UserStatusDisabled {
		return nil
	}
	user.Status = common.UserStatusDisabled
	if err := user.Update(false); err != nil {
		return err
	}
	if err := model.InvalidateUserTokensCache(userId); err != nil {
		common.SysError(common.LogText("failed to invalidate tokens cache for user %d: %s", userId, err.Error()))
	}
	common.SysError(common.LogText("user %d disabled automatically after repeated upstream policy violations", userId))
	return nil
}
