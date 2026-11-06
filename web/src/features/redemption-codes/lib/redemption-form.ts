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
import type { TFunction } from 'i18next'
import { z } from 'zod'

import { parseQuotaFromDollars, quotaUnitsToEditableAmount } from '@/lib/format'

import {
  REDEMPTION_VALIDATION,
  getRedemptionFormErrorMessages,
} from '../constants'
import type { RedemptionFormData, Redemption } from '../types'

// ============================================================================
// Form Schema (use getRedemptionFormSchema(t) in components for i18n messages)
// ============================================================================

export function getRedemptionFormSchema(t: TFunction) {
  const msg = getRedemptionFormErrorMessages(t)
  return z
    .object({
      name: z
        .string()
        .min(REDEMPTION_VALIDATION.NAME_MIN_LENGTH, msg.NAME_LENGTH_INVALID)
        .max(REDEMPTION_VALIDATION.NAME_MAX_LENGTH, msg.NAME_LENGTH_INVALID),
      code_type: z.enum(['quota', 'subscription']),
      plan_id: z.number(),
      quota_dollars: z.number().min(0, t('Quota must be a positive number')),
      expired_time: z.date().nullable(),
      count: z
        .number()
        .min(REDEMPTION_VALIDATION.COUNT_MIN, msg.COUNT_INVALID)
        .max(REDEMPTION_VALIDATION.COUNT_MAX, msg.COUNT_INVALID)
        .optional(),
    })
    .superRefine((data, ctx) => {
      if (data.code_type === 'subscription') {
        if (!data.plan_id || data.plan_id <= 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['plan_id'],
            message: t('Please select a subscription plan'),
          })
        }
      } else if (data.quota_dollars <= 0) {
        ctx.addIssue({
          code: 'custom',
          path: ['quota_dollars'],
          message: t('Quota must be a positive number'),
        })
      }
    })
}

export type RedemptionFormValues = {
  name: string
  code_type: 'quota' | 'subscription'
  plan_id: number
  quota_dollars: number
  expired_time: Date | null
  count?: number
}

// ============================================================================
// Form Defaults
// ============================================================================

export const REDEMPTION_FORM_DEFAULT_VALUES: RedemptionFormValues = {
  name: '',
  code_type: 'quota',
  plan_id: 0,
  quota_dollars: 10,
  expired_time: null,
  count: 1,
}

// ============================================================================
// Form Data Transformation
// ============================================================================

/**
 * Transform form data to API payload
 */
export function transformFormDataToPayload(
  data: RedemptionFormValues
): RedemptionFormData {
  const isSubscription = data.code_type === 'subscription'
  return {
    name: data.name,
    quota: isSubscription ? 0 : parseQuotaFromDollars(data.quota_dollars),
    expired_time: data.expired_time
      ? Math.floor(data.expired_time.getTime() / 1000)
      : 0,
    count: data.count || 1,
    plan_id: isSubscription ? data.plan_id : 0,
  }
}

/**
 * Transform redemption data to form defaults
 */
export function transformRedemptionToFormDefaults(
  redemption: Redemption
): RedemptionFormValues {
  const isSubscription = redemption.plan_id > 0
  return {
    name: redemption.name,
    code_type: isSubscription ? 'subscription' : 'quota',
    plan_id: redemption.plan_id,
    quota_dollars: isSubscription ? 0 : quotaUnitsToEditableAmount(redemption.quota),
    expired_time:
      redemption.expired_time > 0
        ? new Date(redemption.expired_time * 1000)
        : null,
    count: 1,
  }
}
