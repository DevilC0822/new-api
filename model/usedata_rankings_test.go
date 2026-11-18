package model

import (
	"testing"

	"github.com/stretchr/testify/require"
)

func TestRankingQueriesCountCacheTokens(t *testing.T) {
	truncateTables(t)
	require.NoError(t, DB.Create(&QuotaData{UserID: 1, Username: "alice", ModelName: "gpt-a", CreatedAt: 1000, Count: 1, Quota: 10, TokenUsed: 40, CacheReadTokens: 1000, CacheCreationTokens: 30}).Error)
	require.NoError(t, DB.Create(&QuotaData{UserID: 1, Username: "alice", ModelName: "gpt-a", CreatedAt: 1100, Count: 1, Quota: 10, TokenUsed: 20, CacheReadTokens: 500}).Error)
	require.NoError(t, DB.Create(&QuotaData{UserID: 2, Username: "bob", ModelName: "gpt-b", CreatedAt: 1200, Count: 1, Quota: 10, TokenUsed: 7}).Error)

	totals, err := GetRankingQuotaTotals(0, 2000)
	require.NoError(t, err)
	require.Len(t, totals, 2)
	require.Equal(t, "gpt-a", totals[0].ModelName)
	// 40+20 token_used + 1500 cache read + 30 cache write
	require.Equal(t, int64(1590), totals[0].TotalTokens)
	require.Equal(t, "gpt-b", totals[1].ModelName)
	require.Equal(t, int64(7), totals[1].TotalTokens)

	buckets, err := GetRankingQuotaBuckets(0, 2000, 3600)
	require.NoError(t, err)
	require.Len(t, buckets, 2)
	byModel := map[string]int64{}
	for _, b := range buckets {
		byModel[b.ModelName] += b.Tokens
	}
	require.Equal(t, int64(1590), byModel["gpt-a"])
	require.Equal(t, int64(7), byModel["gpt-b"])
}
