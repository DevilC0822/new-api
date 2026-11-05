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
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ShieldCheck } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { getPricing } from '@/features/pricing/api'
import { ModelDiscountBadge } from '@/features/pricing/components/model-discount-badge'
import {
  getDynamicDisplayGroupRatio,
  getDynamicPricingSummary,
} from '@/features/pricing/lib/dynamic-price'
import { getGroupDiscountPercent } from '@/features/pricing/lib/model-helpers'
import type { PricingModel } from '@/features/pricing/types'

interface PriceRow {
  model: PricingModel
  official: { input: string; output: string }
  site: { input: string; output: string }
  percent: number | null
  isTimePricing: boolean
}

function primaryPrices(
  model: PricingModel,
  groupRatioMultiplier: number
): { input: string; output: string } | null {
  const summary = getDynamicPricingSummary(model, {
    tokenUnit: 'M',
    groupRatioMultiplier,
  })
  if (!summary) return null
  const pick = (field: string) =>
    summary.primaryEntries.find((entry) => entry.field === field)?.formatted
  const input = pick('inputPrice')
  const output = pick('outputPrice')
  if (!input || !output) return null
  return { input, output }
}

export function PriceCompare() {
  const { t } = useTranslation()
  const { data, isLoading } = useQuery({
    queryKey: ['pricing'],
    queryFn: getPricing,
  })

  const rows = useMemo<PriceRow[]>(() => {
    if (!data?.data) return []
    const merged = data.data.map((model) => ({
      ...model,
      group_ratio: data.group_ratio,
    }))
    const withPrices: PriceRow[] = []
    for (const model of merged) {
      const official = primaryPrices(model, 1)
      const site = primaryPrices(model, getDynamicDisplayGroupRatio(model))
      if (!official || !site) continue
      const summary = getDynamicPricingSummary(model, { tokenUnit: 'M' })
      withPrices.push({
        model,
        official,
        site,
        percent: getGroupDiscountPercent(model),
        isTimePricing: !!summary?.isTimePricing,
      })
    }
    // Biggest discount first — the strongest hook leads the table.
    withPrices.sort((a, b) => (b.percent ?? 0) - (a.percent ?? 0))
    return withPrices
  }, [data])

  if (isLoading) {
    return (
      <section className='relative z-10 border-t border-[#0F172A]/[0.08] py-20 dark:border-white/10'>
        <div className='mx-auto max-w-[1220px] px-6'>
          <div className='bg-muted/40 h-40 animate-pulse rounded-[24px]' />
        </div>
      </section>
    )
  }

  if (rows.length === 0) return null

  return (
    <section className='relative z-10 border-t border-[#0F172A]/[0.08] py-20 dark:border-white/10'>
      <div className='mx-auto max-w-[1220px] px-6'>
        <AnimateInView className='mb-10 text-center'>
          <h2 className='text-[clamp(1.85rem,3vw,2.6rem)] leading-[1.18] font-extrabold tracking-[-0.03em] text-[#0F172A] dark:text-white'>
            {t('Official Price vs Our Price')}
          </h2>
          <div className='mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-emerald-600/25 bg-emerald-500/[0.07] px-4 py-2 text-[13px] font-semibold text-emerald-700 dark:text-emerald-400'>
            <ShieldCheck aria-hidden className='size-4 shrink-0' />
            <span>
              {t(
                'All models come from official plans — 100% genuine, never watered down'
              )}
            </span>
          </div>
        </AnimateInView>

        <div className='overflow-x-auto rounded-[24px] border border-[#0F172A]/[0.08] bg-white shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-zinc-900'>
          <table className='w-full min-w-[640px] border-collapse text-sm'>
            <thead>
              <tr className='border-b border-[#0F172A]/[0.07] bg-[#F8FAFC]/80 font-mono text-[11px] font-bold tracking-[0.08em] text-[#64748B] uppercase dark:border-white/10 dark:bg-zinc-950/60 dark:text-zinc-400'>
                <th className='px-5 py-3.5 text-left'>{t('Model')}</th>
                <th className='px-5 py-3.5 text-right'>
                  {t('Official / 1M tokens')}
                </th>
                <th className='px-5 py-3.5 text-right'>
                  {t('Ours / 1M tokens')}
                </th>
                <th className='px-5 py-3.5 text-right'>{t('Discount')}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr
                  key={row.model.model_name}
                  className='group border-b border-[#0F172A]/[0.05] transition-colors last:border-b-0 hover:bg-[#F8FAFC] dark:border-white/[0.06] dark:hover:bg-zinc-800/40'
                >
                  <td className='px-5 py-3.5'>
                    <Link
                      to='/pricing/$modelId'
                      params={{ modelId: row.model.model_name }}
                      className='font-mono text-[13px] font-semibold text-[#0F172A] group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'
                    >
                      {row.model.model_name}
                    </Link>
                  </td>
                  <td className='px-5 py-3.5 text-right font-mono text-[12.5px] text-[#94A3B8] line-through dark:text-slate-500'>
                    {row.official.input} / {row.official.output}
                  </td>
                  <td className='px-5 py-3.5 text-right font-mono text-[13px] font-bold text-[#0F172A] dark:text-white'>
                    {row.site.input} / {row.site.output}
                  </td>
                  <td className='px-5 py-3.5 text-right'>
                    {row.percent != null ? (
                      <ModelDiscountBadge percent={row.percent} />
                    ) : (
                      <span className='text-muted-foreground text-xs'>—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {rows.some((row) => row.isTimePricing) && (
          <p className='text-muted-foreground mt-3 text-xs'>
            {t(
              'Peak/off-peak models show the price of the current billing window.'
            )}
          </p>
        )}
      </div>
    </section>
  )
}
