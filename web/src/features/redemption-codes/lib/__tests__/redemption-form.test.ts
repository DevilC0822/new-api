/*
Copyright (C) 2023-2026 QuantumNous

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program. If not, see <https://www.gnu.org/licenses/>.

For commercial licensing, please contact support@quantumnous.com
*/
import { describe, expect, test, vi } from 'vitest'

import { quotaUnitsToEditableAmount } from '@/lib/format'

import {
  getRedemptionFormSchema,
  transformFormDataToPayload,
  transformRedemptionToFormDefaults,
  type RedemptionFormValues,
} from '../redemption-form'

const t = vi.fn((key: string) => key) as unknown as Parameters<
  typeof getRedemptionFormSchema
>[0]

const baseValues: RedemptionFormValues = {
  name: 'promo',
  code_type: 'quota',
  plan_id: 0,
  quota_dollars: 10,
  expired_time: null,
  count: 2,
}

describe('redemption form schema', () => {
  test('rejects a subscription code without a selected plan', () => {
    const result = getRedemptionFormSchema(t).safeParse({
      ...baseValues,
      code_type: 'subscription',
      quota_dollars: 0,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('plan_id')
    }
  })

  test('accepts a subscription code with a plan selected', () => {
    const result = getRedemptionFormSchema(t).safeParse({
      ...baseValues,
      code_type: 'subscription',
      plan_id: 7,
      quota_dollars: 0,
    })
    expect(result.success).toBe(true)
  })

  test('rejects a quota code with zero quota', () => {
    const result = getRedemptionFormSchema(t).safeParse({
      ...baseValues,
      quota_dollars: 0,
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('quota_dollars')
    }
  })
})

describe('transformFormDataToPayload', () => {
  test('subscription codes submit zero quota and the plan id', () => {
    const payload = transformFormDataToPayload({
      ...baseValues,
      code_type: 'subscription',
      plan_id: 9,
      quota_dollars: 10,
    })
    expect(payload.quota).toBe(0)
    expect(payload.plan_id).toBe(9)
  })

  test('quota codes submit the parsed quota without a plan', () => {
    const payload = transformFormDataToPayload({
      ...baseValues,
      code_type: 'quota',
      quota_dollars: 2,
    })
    expect(payload.plan_id).toBe(0)
    expect(payload.quota).toBeGreaterThan(0)
  })
})

describe('transformRedemptionToFormDefaults', () => {
  test('derives the subscription type from plan_id', () => {
    const values = transformRedemptionToFormDefaults({
      id: 1,
      user_id: 1,
      name: 'promo',
      key: 'k',
      status: 1,
      quota: 0,
      created_time: 1,
      redeemed_time: 0,
      expired_time: 0,
      used_user_id: 0,
      plan_id: 5,
    })
    expect(values.code_type).toBe('subscription')
    expect(values.plan_id).toBe(5)
    expect(values.quota_dollars).toBe(0)
  })

  test('quota codes keep their editable amount', () => {
    const quota = 500000
    const values = transformRedemptionToFormDefaults({
      id: 2,
      user_id: 1,
      name: 'promo',
      key: 'k',
      status: 1,
      quota,
      created_time: 1,
      redeemed_time: 0,
      expired_time: 0,
      used_user_id: 0,
      plan_id: 0,
    })
    expect(values.code_type).toBe('quota')
    expect(values.quota_dollars).toBe(quotaUnitsToEditableAmount(quota))
  })
})
