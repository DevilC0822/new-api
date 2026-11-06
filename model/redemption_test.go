package model

import (
	"sync"
	"testing"

	"github.com/QuantumNous/new-api/common"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/gorm"
)

func TestSearchRedemptionsFiltersAndPaginates(t *testing.T) {
	require.NoError(t, DB.AutoMigrate(&Redemption{}))
	require.NoError(t, DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Unscoped().Delete(&Redemption{}).Error)
	t.Cleanup(func() {
		require.NoError(t, DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Unscoped().Delete(&Redemption{}).Error)
	})

	now := common.GetTimestamp()
	redemptions := []Redemption{
		{Id: 1, Name: "alpha-active", Key: "00000000000000000000000000000001", Status: common.RedemptionCodeStatusEnabled, ExpiredTime: 0},
		{Id: 2, Name: "alpha-future", Key: "00000000000000000000000000000002", Status: common.RedemptionCodeStatusEnabled, ExpiredTime: now + 3600},
		{Id: 3, Name: "alpha-expired", Key: "00000000000000000000000000000003", Status: common.RedemptionCodeStatusEnabled, ExpiredTime: now - 10},
		{Id: 4, Name: "beta-disabled", Key: "00000000000000000000000000000004", Status: common.RedemptionCodeStatusDisabled, ExpiredTime: 0},
		{Id: 5, Name: "beta-used", Key: "00000000000000000000000000000005", Status: common.RedemptionCodeStatusUsed, ExpiredTime: 0},
	}
	require.NoError(t, DB.Create(&redemptions).Error)

	tests := []struct {
		name      string
		keyword   string
		status    string
		startIdx  int
		num       int
		wantTotal int64
		wantIds   []int
	}{
		{
			name:      "no filters returns all rows",
			num:       10,
			wantTotal: 5,
			wantIds:   []int{5, 4, 3, 2, 1},
		},
		{
			name:      "keyword filters by name prefix",
			keyword:   "alpha",
			num:       10,
			wantTotal: 3,
			wantIds:   []int{3, 2, 1},
		},
		{
			name:      "enabled status excludes expired rows",
			status:    "1",
			num:       10,
			wantTotal: 2,
			wantIds:   []int{2, 1},
		},
		{
			name:      "expired status returns enabled expired rows",
			status:    "expired",
			num:       10,
			wantTotal: 1,
			wantIds:   []int{3},
		},
		{
			name:      "disabled status",
			status:    "2",
			num:       10,
			wantTotal: 1,
			wantIds:   []int{4},
		},
		{
			name:      "used status",
			status:    "3",
			num:       10,
			wantTotal: 1,
			wantIds:   []int{5},
		},
		{
			name:      "pagination keeps unpaged total",
			startIdx:  1,
			num:       2,
			wantTotal: 5,
			wantIds:   []int{4, 3},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			rows, total, err := SearchRedemptions(tt.keyword, tt.status, tt.startIdx, tt.num)
			require.NoError(t, err)
			assert.Equal(t, tt.wantTotal, total)
			gotIds := make([]int, 0, len(rows))
			for _, row := range rows {
				gotIds = append(gotIds, row.Id)
			}
			assert.Equal(t, tt.wantIds, gotIds)
		})
	}
}

func setupRedeemFixture(t *testing.T, quota int) (userId int, key string) {
	t.Helper()
	require.NoError(t, DB.AutoMigrate(&Redemption{}))
	require.NoError(t, DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Unscoped().Delete(&Redemption{}).Error)
	t.Cleanup(func() {
		require.NoError(t, DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Unscoped().Delete(&Redemption{}).Error)
		DB.Exec("DELETE FROM users")
		DB.Exec("DELETE FROM logs")
	})

	user := &User{Username: "redeem-user", Password: "password", Status: common.UserStatusEnabled, Quota: 0}
	require.NoError(t, DB.Create(user).Error)

	key = "10000000000000000000000000000001"
	redemption := &Redemption{
		Name:        "redeem-test",
		Key:         key,
		Status:      common.RedemptionCodeStatusEnabled,
		Quota:       quota,
		CreatedTime: common.GetTimestamp(),
	}
	require.NoError(t, DB.Create(redemption).Error)
	return user.Id, key
}

func TestRedeemCreditsQuotaExactlyOnce(t *testing.T) {
	userId, key := setupRedeemFixture(t, 500)

	result, err := Redeem(key, userId)
	require.NoError(t, err)
	assert.Equal(t, 500, result.Quota)
	assert.Equal(t, 0, result.PlanId)
	assert.Empty(t, result.PlanTitle)

	var user User
	require.NoError(t, DB.First(&user, "id = ?", userId).Error)
	assert.Equal(t, 500, user.Quota)

	var redemption Redemption
	require.NoError(t, DB.First(&redemption, "name = ?", "redeem-test").Error)
	assert.Equal(t, common.RedemptionCodeStatusUsed, redemption.Status)
	assert.Equal(t, userId, redemption.UsedUserId)

	// Redeeming the same code again must fail and must not credit quota.
	_, err = Redeem(key, userId)
	require.Error(t, err)
	require.NoError(t, DB.First(&user, "id = ?", userId).Error)
	assert.Equal(t, 500, user.Quota)
}

func TestRedeemRejectsWalletOverflow(t *testing.T) {
	userId, key := setupRedeemFixture(t, 11)
	require.NoError(t, DB.Model(&User{}).Where("id = ?", userId).Update("quota", common.MaxWalletQuota-10).Error)

	_, err := Redeem(key, userId)
	require.ErrorIs(t, err, ErrRedeemFailed)

	var user User
	require.NoError(t, DB.First(&user, "id = ?", userId).Error)
	assert.Equal(t, common.MaxWalletQuota-10, user.Quota)

	var redemption Redemption
	require.NoError(t, DB.First(&redemption, "key = ?", key).Error)
	assert.Equal(t, common.RedemptionCodeStatusEnabled, redemption.Status)
}

func TestRedemptionQuotaRejectsWalletOverflow(t *testing.T) {
	setupRedeemFixture(t, 500)

	redemption := &Redemption{
		Name:        "overflow-redemption",
		Key:         "10000000000000000000000000000002",
		Status:      common.RedemptionCodeStatusEnabled,
		Quota:       common.MaxWalletQuota + 1,
		CreatedTime: common.GetTimestamp(),
	}
	require.Error(t, redemption.Insert())
}

// Exactly one of several concurrent redeems of the same code may win, and
// quota must be credited exactly once.
func TestRedeemConcurrentSingleSuccess(t *testing.T) {
	userId, key := setupRedeemFixture(t, 300)

	const goroutines = 5
	successes := make([]bool, goroutines)
	var wg sync.WaitGroup
	wg.Add(goroutines)
	for i := range goroutines {
		go func(idx int) {
			defer wg.Done()
			if _, err := Redeem(key, userId); err == nil {
				successes[idx] = true
			}
		}(i)
	}
	wg.Wait()

	successCount := 0
	for _, ok := range successes {
		if ok {
			successCount++
		}
	}
	assert.Equal(t, 1, successCount, "exactly one concurrent redeem should succeed")

	var user User
	require.NoError(t, DB.First(&user, "id = ?", userId).Error)
	assert.Equal(t, 300, user.Quota, "quota must be credited exactly once")
}

func setupSubscriptionRedeemFixture(t *testing.T, plan *SubscriptionPlan) (userId int, key string) {
	t.Helper()
	require.NoError(t, DB.AutoMigrate(&Redemption{}))
	require.NoError(t, DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Unscoped().Delete(&Redemption{}).Error)
	t.Cleanup(func() {
		require.NoError(t, DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Unscoped().Delete(&Redemption{}).Error)
		DB.Exec("DELETE FROM users")
		DB.Exec("DELETE FROM logs")
		DB.Exec("DELETE FROM subscription_plans")
		DB.Exec("DELETE FROM user_subscriptions")
		InvalidateSubscriptionPlanCache(plan.Id)
	})
	// 包级套餐缓存可能残留其它测试的同 id 快照
	InvalidateSubscriptionPlanCache(plan.Id)

	user := &User{Username: "redeem-sub-user", Password: "password", Status: common.UserStatusEnabled, Quota: 0}
	require.NoError(t, DB.Create(user).Error)
	require.NoError(t, DB.Create(plan).Error)

	key = "20000000000000000000000000000001"
	redemption := &Redemption{
		Name:        "redeem-sub-test",
		Key:         key,
		Status:      common.RedemptionCodeStatusEnabled,
		Quota:       0,
		CreatedTime: common.GetTimestamp(),
		PlanId:      plan.Id,
	}
	require.NoError(t, DB.Create(redemption).Error)
	return user.Id, key
}

func TestRedeemSubscriptionCodeActivatesPlan(t *testing.T) {
	plan := &SubscriptionPlan{
		Id:            9201,
		Title:         "Trial Pro",
		DurationUnit:  SubscriptionDurationDay,
		DurationValue: 3,
		TotalAmount:   2000,
		AllowedGroups: "vip,trial",
	}
	userId, key := setupSubscriptionRedeemFixture(t, plan)

	result, err := Redeem(key, userId)
	require.NoError(t, err)
	assert.Equal(t, plan.Id, result.PlanId)
	assert.Equal(t, "Trial Pro", result.PlanTitle)
	assert.Equal(t, 0, result.Quota)

	var sub UserSubscription
	require.NoError(t, DB.Where("user_id = ?", userId).First(&sub).Error)
	assert.Equal(t, plan.Id, sub.PlanId)
	assert.Equal(t, "redemption", sub.Source)
	assert.Equal(t, int64(2000), sub.AmountTotal)
	assert.Equal(t, int64(0), sub.AmountUsed)
	assert.Equal(t, "active", sub.Status)
	assert.Equal(t, "vip,trial", sub.AllowedGroups)
	assert.Greater(t, sub.EndTime, sub.StartTime)

	var user User
	require.NoError(t, DB.First(&user, "id = ?", userId).Error)
	assert.Equal(t, 0, user.Quota, "subscription redemption must not credit wallet quota")

	var redemption Redemption
	require.NoError(t, DB.First(&redemption, "key = ?", key).Error)
	assert.Equal(t, common.RedemptionCodeStatusUsed, redemption.Status)
	assert.Equal(t, userId, redemption.UsedUserId)

	// 重复兑换同一码必须失败
	_, err = Redeem(key, userId)
	require.ErrorIs(t, err, ErrRedeemFailed)
}

func TestRedeemSubscriptionCodeAllowsDisabledPlan(t *testing.T) {
	plan := &SubscriptionPlan{
		Id:            9202,
		Title:         "Disabled Plan",
		DurationUnit:  SubscriptionDurationDay,
		DurationValue: 1,
		TotalAmount:   100,
		Enabled:       false,
	}
	userId, key := setupSubscriptionRedeemFixture(t, plan)

	result, err := Redeem(key, userId)
	require.NoError(t, err)
	assert.Equal(t, "Disabled Plan", result.PlanTitle)

	var count int64
	require.NoError(t, DB.Model(&UserSubscription{}).Where("user_id = ?", userId).Count(&count).Error)
	assert.Equal(t, int64(1), count)
}

func TestRedeemSubscriptionCodeWithMissingPlanRollsBack(t *testing.T) {
	plan := &SubscriptionPlan{
		Id:            9203,
		Title:         "Vanishing Plan",
		DurationUnit:  SubscriptionDurationDay,
		DurationValue: 1,
	}
	userId, key := setupSubscriptionRedeemFixture(t, plan)
	require.NoError(t, DB.Unscoped().Where("id = ?", plan.Id).Delete(&SubscriptionPlan{}).Error)
	InvalidateSubscriptionPlanCache(plan.Id)

	result, err := Redeem(key, userId)
	require.Error(t, err)
	assert.Nil(t, result)
	var apiMsg *common.Message
	require.ErrorAs(t, err, &apiMsg)

	// 事务回滚：码保持可用，不产生订阅
	var redemption Redemption
	require.NoError(t, DB.First(&redemption, "key = ?", key).Error)
	assert.Equal(t, common.RedemptionCodeStatusEnabled, redemption.Status)
	var count int64
	require.NoError(t, DB.Model(&UserSubscription{}).Where("user_id = ?", userId).Count(&count).Error)
	assert.Equal(t, int64(0), count)
}

// 订阅码 quota 必须落库为 0：quota 列默认值是 100，普通 Create 会忽略零值。
func TestInsertSubscriptionRedemptionPersistsZeroQuota(t *testing.T) {
	require.NoError(t, DB.AutoMigrate(&Redemption{}))
	require.NoError(t, DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Unscoped().Delete(&Redemption{}).Error)
	t.Cleanup(func() {
		require.NoError(t, DB.Session(&gorm.Session{AllowGlobalUpdate: true}).Unscoped().Delete(&Redemption{}).Error)
	})

	redemption := &Redemption{
		Name:        "sub-zero-quota",
		Key:         "30000000000000000000000000000001",
		Status:      common.RedemptionCodeStatusEnabled,
		Quota:       0,
		CreatedTime: common.GetTimestamp(),
		PlanId:      77,
	}
	require.NoError(t, redemption.Insert())

	var stored Redemption
	require.NoError(t, DB.First(&stored, "key = ?", redemption.Key).Error)
	assert.Equal(t, 0, stored.Quota)
	assert.Equal(t, 77, stored.PlanId)
	assert.Equal(t, common.RedemptionCodeStatusEnabled, stored.Status)
}

func TestRedeemSubscriptionCodeRespectsPurchaseLimit(t *testing.T) {
	plan := &SubscriptionPlan{
		Id:                 9204,
		Title:              "Limited Plan",
		DurationUnit:       SubscriptionDurationDay,
		DurationValue:      1,
		MaxPurchasePerUser: 1,
	}
	userId, key := setupSubscriptionRedeemFixture(t, plan)
	require.NoError(t, DB.Create(&UserSubscription{
		UserId: userId, PlanId: plan.Id, Status: "active",
		StartTime: common.GetTimestamp(), EndTime: common.GetTimestamp() + 3600,
		Source: "order",
	}).Error)

	result, err := Redeem(key, userId)
	require.Error(t, err)
	assert.Nil(t, result)
	var apiMsg *common.Message
	require.ErrorAs(t, err, &apiMsg)

	var redemption Redemption
	require.NoError(t, DB.First(&redemption, "key = ?", key).Error)
	assert.Equal(t, common.RedemptionCodeStatusEnabled, redemption.Status)
	var count int64
	require.NoError(t, DB.Model(&UserSubscription{}).Where("user_id = ?", userId).Count(&count).Error)
	assert.Equal(t, int64(1), count)
}
