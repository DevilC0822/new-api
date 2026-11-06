package model

import (
	"errors"
	"strconv"

	"github.com/QuantumNous/new-api/common"
	"github.com/QuantumNous/new-api/logger"

	"gorm.io/gorm"
)

type Redemption struct {
	Id           int            `json:"id"`
	UserId       int            `json:"user_id"`
	Key          string         `json:"key" gorm:"type:char(32);uniqueIndex"`
	Status       int            `json:"status" gorm:"default:1"`
	Name         string         `json:"name" gorm:"index"`
	Quota        int            `json:"quota" gorm:"default:100"`
	CreatedTime  int64          `json:"created_time" gorm:"bigint"`
	RedeemedTime int64          `json:"redeemed_time" gorm:"bigint"`
	Count        int            `json:"count" gorm:"-:all"` // only for api request
	UsedUserId   int            `json:"used_user_id"`
	DeletedAt    gorm.DeletedAt `gorm:"index"`
	ExpiredTime  int64          `json:"expired_time" gorm:"bigint"` // 过期时间，0 表示不过期
	// PlanId > 0 表示订阅兑换码（兑换后开通该套餐）；0 表示额度兑换码
	PlanId int `json:"plan_id" gorm:"default:0"`
}

// RedeemResult 是兑换结果：PlanTitle 非空表示订阅码兑换成功，Quota 仅对额度码有效。
type RedeemResult struct {
	Quota     int    `json:"quota"`
	PlanId    int    `json:"plan_id"`
	PlanTitle string `json:"plan_title"`
}

func GetAllRedemptions(startIdx int, num int) (redemptions []*Redemption, total int64, err error) {
	// 开始事务
	tx := DB.Begin()
	if tx.Error != nil {
		return nil, 0, tx.Error
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// 获取总数
	err = tx.Model(&Redemption{}).Count(&total).Error
	if err != nil {
		tx.Rollback()
		return nil, 0, err
	}

	// 获取分页数据
	err = tx.Order("id desc").Limit(num).Offset(startIdx).Find(&redemptions).Error
	if err != nil {
		tx.Rollback()
		return nil, 0, err
	}

	// 提交事务
	if err = tx.Commit().Error; err != nil {
		return nil, 0, err
	}

	return redemptions, total, nil
}

func SearchRedemptions(keyword string, status string, startIdx int, num int) (redemptions []*Redemption, total int64, err error) {
	tx := DB.Begin()
	if tx.Error != nil {
		return nil, 0, tx.Error
	}
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	query := tx.Model(&Redemption{})

	if keyword != "" {
		if id, err := strconv.Atoi(keyword); err == nil {
			query = query.Where("id = ? OR name LIKE ?", id, keyword+"%")
		} else {
			query = query.Where("name LIKE ?", keyword+"%")
		}
	}

	if status != "" {
		now := common.GetTimestamp()
		switch status {
		case "expired":
			query = query.Where(
				"status = ? AND expired_time != 0 AND expired_time < ?",
				common.RedemptionCodeStatusEnabled,
				now,
			)
		case strconv.Itoa(common.RedemptionCodeStatusEnabled):
			query = query.Where(
				"status = ? AND (expired_time = 0 OR expired_time >= ?)",
				common.RedemptionCodeStatusEnabled,
				now,
			)
		case strconv.Itoa(common.RedemptionCodeStatusDisabled):
			query = query.Where("status = ?", common.RedemptionCodeStatusDisabled)
		case strconv.Itoa(common.RedemptionCodeStatusUsed):
			query = query.Where("status = ?", common.RedemptionCodeStatusUsed)
		}
	}

	// Get total count
	err = query.Count(&total).Error
	if err != nil {
		tx.Rollback()
		return nil, 0, err
	}

	// Get paginated data
	err = query.Order("id desc").Limit(num).Offset(startIdx).Find(&redemptions).Error
	if err != nil {
		tx.Rollback()
		return nil, 0, err
	}

	if err = tx.Commit().Error; err != nil {
		return nil, 0, err
	}

	return redemptions, total, nil
}

func GetRedemptionById(id int) (*Redemption, error) {
	if id == 0 {
		return nil, common.NewMessage("ID is empty")
	}
	redemption := Redemption{Id: id}
	var err error = nil
	err = DB.First(&redemption, "id = ?", id).Error
	return &redemption, err
}

func Redeem(key string, userId int) (*RedeemResult, error) {
	if key == "" {
		return nil, errors.New("redemption code not provided")
	}
	if userId == 0 {
		return nil, errors.New("invalid user id")
	}
	redemption := &Redemption{}

	keyCol := "`key`"
	if common.UsingMainDatabase(common.DatabaseTypePostgreSQL) {
		keyCol = `"key"`
	}
	common.RandomSleep()
	var subscription *UserSubscription
	var planTitle string
	err := DB.Transaction(func(tx *gorm.DB) error {
		err := lockForUpdate(tx).Where(keyCol+" = ?", key).First(redemption).Error
		if err != nil {
			return errors.New("invalid redemption code")
		}
		if redemption.Status != common.RedemptionCodeStatusEnabled {
			return errors.New("redemption code already used")
		}
		if redemption.ExpiredTime != 0 && redemption.ExpiredTime < common.GetTimestamp() {
			return errors.New("redemption code expired")
		}
		// Compare-and-swap on status: only the transaction that flips
		// enabled -> used may credit quota, so a concurrent redeem of the
		// same code loses here even without a row lock (e.g. on SQLite).
		result := tx.Model(&Redemption{}).
			Where("id = ? AND status = ?", redemption.Id, common.RedemptionCodeStatusEnabled).
			Updates(map[string]any{
				"redeemed_time": common.GetTimestamp(),
				"status":        common.RedemptionCodeStatusUsed,
				"used_user_id":  userId,
			})
		if result.Error != nil {
			return result.Error
		}
		if result.RowsAffected == 0 {
			return errors.New("redemption code already used")
		}
		if redemption.PlanId > 0 {
			// 与 CompleteSubscriptionOrder 一致：先锁用户行，使购买次数检查按用户串行。
			var userRow User
			if err := lockForUpdate(tx).Select("id").Where("id = ?", userId).First(&userRow).Error; err != nil {
				return err
			}
			// 已发出的码视为承诺：套餐禁用仍可兑换，仅套餐被删除时拒绝。
			plan, err := getSubscriptionPlanByIdTx(tx, redemption.PlanId)
			if errors.Is(err, gorm.ErrRecordNotFound) {
				return common.NewMessage("Subscription plan for this code no longer exists")
			}
			if err != nil {
				return err
			}
			subscription, err = CreateUserSubscriptionFromPlanTx(tx, userId, plan, "redemption")
			if err != nil {
				return err
			}
			planTitle = plan.Title
			return nil
		}
		return creditTopUpQuota(tx, userId, redemption.Quota, nil)
	})
	if err != nil {
		common.SysError(common.LogText("redemption failed: %s", err.Error()))
		// 额度码维持全量兜底（既有契约，防枚举）；订阅码的套餐业务错误
		// （套餐不存在/购买上限）透传——此时码已验证有效，不泄露码状态。
		var apiMsg *common.Message
		if redemption.PlanId > 0 && errors.As(err, &apiMsg) {
			return nil, apiMsg
		}
		return nil, ErrRedeemFailed
	}
	if subscription != nil {
		if subscription.PrevUserGroup != "" {
			refreshSubscriptionUserGroupCache(userId, common.LogText("subscription redemption"))
		}
		RecordLog(userId, LogTypeTopup, common.NewMessage("Subscription activated with redemption code, plan: {{plan}}", map[string]any{"plan": planTitle}))
		return &RedeemResult{PlanId: redemption.PlanId, PlanTitle: planTitle}, nil
	}
	syncCreditUserQuotaCache(userId, redemption.Quota, common.LogText("redemption"))
	RecordLog(userId, LogTypeTopup, common.NewMessage("Topped up {{quota}} with a redemption code, code ID {{id}}", map[string]any{"quota": logger.FormatQuota(redemption.Quota), "id": redemption.Id}))
	return &RedeemResult{Quota: redemption.Quota}, nil
}

func (redemption *Redemption) Insert() error {
	if redemption.PlanId > 0 {
		if redemption.Quota != 0 {
			return errors.New("subscription redemption code must have zero quota")
		}
		// quota 列带 default:100，struct Create 会忽略零值，改用 map 显式写 0
		return DB.Model(&Redemption{}).Create(map[string]any{
			"user_id":      redemption.UserId,
			"name":         redemption.Name,
			"key":          redemption.Key,
			"quota":        0,
			"created_time": redemption.CreatedTime,
			"expired_time": redemption.ExpiredTime,
			"plan_id":      redemption.PlanId,
		}).Error
	}
	if redemption.Quota <= 0 {
		return errors.New("redemption quota must be positive")
	}
	if err := common.ValidateWalletQuota(redemption.Quota); err != nil {
		return err
	}
	return DB.Create(redemption).Error
}

func (redemption *Redemption) SelectUpdate() error {
	// This can update zero values
	return DB.Model(redemption).Select("redeemed_time", "status").Updates(redemption).Error
}

// Update Make sure your token's fields is completed, because this will update non-zero values
func (redemption *Redemption) Update() error {
	if redemption.PlanId > 0 {
		if redemption.Quota != 0 {
			return errors.New("subscription redemption code must have zero quota")
		}
	} else {
		if redemption.Quota <= 0 {
			return errors.New("redemption quota must be positive")
		}
		if err := common.ValidateWalletQuota(redemption.Quota); err != nil {
			return err
		}
	}
	var err error
	err = DB.Model(redemption).Select("name", "status", "quota", "redeemed_time", "expired_time").Updates(redemption).Error
	return err
}

func (redemption *Redemption) Delete() error {
	var err error
	err = DB.Delete(redemption).Error
	return err
}

func DeleteRedemptionById(id int) (err error) {
	if id == 0 {
		return common.NewMessage("ID is empty")
	}
	redemption := Redemption{Id: id}
	err = DB.Where(redemption).First(&redemption).Error
	if err != nil {
		return err
	}
	return redemption.Delete()
}

func DeleteInvalidRedemptions() (int64, error) {
	now := common.GetTimestamp()
	result := DB.Where("status IN ? OR (status = ? AND expired_time != 0 AND expired_time < ?)", []int{common.RedemptionCodeStatusUsed, common.RedemptionCodeStatusDisabled}, common.RedemptionCodeStatusEnabled, now).Delete(&Redemption{})
	return result.RowsAffected, result.Error
}

// BatchDeleteRedemptions soft-deletes the selected codes in one statement.
func BatchDeleteRedemptions(ids []int) (int64, error) {
	if len(ids) == 0 || len(ids) > 1000 {
		return 0, errors.New("select between 1 and 1000 redemption codes")
	}
	for _, id := range ids {
		if id <= 0 {
			return 0, errors.New("redemption IDs must be positive")
		}
	}
	result := DB.Where("id IN ?", ids).Delete(&Redemption{})
	return result.RowsAffected, result.Error
}
