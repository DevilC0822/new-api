package model

import (
	"fmt"

	"github.com/QuantumNous/new-api/common"
	"gorm.io/gorm"
)

type RankingQuotaTotal struct {
	ModelName   string `json:"model_name"`
	TotalTokens int64  `json:"total_tokens"`
}

type RankingQuotaBucket struct {
	ModelName string `json:"model_name"`
	Bucket    int64  `json:"bucket"`
	Tokens    int64  `json:"tokens"`
}

// rankingTokensExpr 汇总总 token 口径：计费 token 加缓存读/写 token。
// Anthropic 语义渠道的 prompt_tokens 不含缓存读写，编码客户缓存命中率极高，
// 只算 token_used 会严重低估真实吞吐。
const rankingTokensExpr = "coalesce(sum(token_used), 0) + coalesce(sum(cache_read_tokens), 0) + coalesce(sum(cache_creation_tokens), 0)"

func GetRankingQuotaTotals(startTime int64, endTime int64) ([]RankingQuotaTotal, error) {
	var rows []RankingQuotaTotal
	query := DB.Table("quota_data").
		Select("model_name, " + rankingTokensExpr + " as total_tokens").
		Where("model_name <> ''").
		Group("model_name").
		Having(rankingTokensExpr + " > 0").
		Order("total_tokens DESC")
	query = applyRankingQuotaTimeRange(query, startTime, endTime)
	err := query.Find(&rows).Error
	return rows, err
}

func GetRankingQuotaBuckets(startTime int64, endTime int64, bucketSize int64) ([]RankingQuotaBucket, error) {
	if bucketSize <= 0 {
		bucketSize = 3600
	}
	bucketExpr := rankingBucketExpr(bucketSize)
	var rows []RankingQuotaBucket
	query := DB.Table("quota_data").
		Select(fmt.Sprintf("model_name, %s as bucket, %s as tokens", bucketExpr, rankingTokensExpr)).
		Where("model_name <> ''").
		Group(fmt.Sprintf("model_name, %s", bucketExpr)).
		Having(rankingTokensExpr + " > 0").
		Order("bucket ASC")
	query = applyRankingQuotaTimeRange(query, startTime, endTime)
	err := query.Find(&rows).Error
	return rows, err
}

func rankingBucketExpr(bucketSize int64) string {
	if common.UsingMainDatabase(common.DatabaseTypeMySQL) {
		return fmt.Sprintf("FLOOR(created_at / %d) * %d", bucketSize, bucketSize)
	}
	return fmt.Sprintf("(created_at / %d) * %d", bucketSize, bucketSize)
}

func applyRankingQuotaTimeRange(query *gorm.DB, startTime int64, endTime int64) *gorm.DB {
	if startTime > 0 {
		query = query.Where("created_at >= ?", startTime)
	}
	if endTime > 0 {
		query = query.Where("created_at <= ?", endTime)
	}
	return query
}
