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

import { Link } from '@tanstack/react-router'
import { ArrowRight, Coins, HelpCircle, ShieldAlert } from 'lucide-react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

import {
  DOCS_CACHE_TIERS,
  DOCS_FAQ_ITEMS,
  DOCS_STATUS_CODES,
} from '../constants'
import type { DocsSectionId } from '../types'

interface BillingAndOpsSectionProps {
  visibleSectionIds: Set<DocsSectionId>
}

export function BillingAndOpsSection(props: BillingAndOpsSectionProps) {
  const showCaching = props.visibleSectionIds.has('prompt-caching')
  const showStatusCodes = props.visibleSectionIds.has('status-codes')
  const showFaq = props.visibleSectionIds.has('faq')

  if (!showCaching && !showStatusCodes && !showFaq) {
    return null
  }

  return (
    <div className='space-y-8'>
      {/* 06 Prompt Caching & Billing Section */}
      {showCaching && (
        <section
          id='prompt-caching'
          className='bg-card scroll-mt-24 rounded-[22px] border border-white p-6 shadow-[0_22px_48px_-14px_rgba(20,20,18,0.06)] md:p-8 dark:border-white/10'
        >
          <div className='border-border/80 flex flex-wrap items-baseline justify-between gap-2 border-b pb-4'>
            <div className='flex items-baseline gap-2.5'>
              <span className='text-muted-foreground font-serif text-lg tabular-nums'>
                06
              </span>
              <h2 className='font-serif text-xl font-normal tracking-tight md:text-2xl'>
                上下文缓存与透明计费
              </h2>
            </div>
            <span className='text-muted-foreground font-mono text-[11px]'>
              PROMPT CACHING &amp; TOKEN LEDGER
            </span>
          </div>

          {/* Transparent Billing Formula Banner */}
          <div className='border-border mt-5 rounded-[16px] border bg-[#F8F7F3] p-5 dark:bg-zinc-900/60'>
            <div className='flex flex-wrap items-center justify-between gap-2'>
              <div className='flex items-center gap-2'>
                <Coins className='size-4 text-[#8C7051]' />
                <span className='text-foreground text-[13.5px] font-semibold'>
                  网关实时精算公式（精确至单次请求）
                </span>
              </div>
              <Link
                to='/pricing'
                className='text-foreground hover:text-muted-foreground inline-flex items-center gap-1 font-mono text-[11.5px] font-medium transition-colors'
              >
                <span>查看全量模型实时单价</span>
                <ArrowRight className='size-3' />
              </Link>
            </div>

            <div className='border-border/80 bg-card mt-3 overflow-x-auto rounded-xl border px-4 py-3 font-mono text-[12px] leading-[1.7]'>
              <span className='text-foreground font-semibold'>
                单次请求扣费
              </span>{' '}
              ={' '}
              <span className='text-muted-foreground'>
                (未缓存输入 × 输入单价 + 缓存命中 × 缓存折扣价 + 缓存创建 ×
                写入单价 + [输出 + 思考 Token] × 输出单价)
              </span>{' '}
              × <span className='text-foreground font-semibold'>分组倍率</span>
            </div>

            <p className='text-muted-foreground mt-2.5 text-[12px] leading-[1.6]'>
              注：按次计费模型（如图像生成或固定费率任务）直接按单次调用价格 ×
              分组倍率结算。所有消费记录均可在控制台「使用日志」中核对缓存命中数与耗时。
            </p>
          </div>

          {/* 3-Column Cache Tier Cards */}
          <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-3'>
            {DOCS_CACHE_TIERS.map((tier) => (
              <div
                key={tier.id}
                className='border-border/80 flex flex-col justify-between rounded-[16px] border bg-[#F8F7F3] p-5 dark:bg-zinc-900/60'
              >
                <div>
                  <div className='flex items-center justify-between gap-2'>
                    <span className='border-border bg-card text-foreground rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-medium'>
                      {tier.protocol}
                    </span>
                    <span className='text-success font-mono text-[11px] font-semibold'>
                      {tier.readDiscount}
                    </span>
                  </div>
                  <h3 className='text-foreground mt-3 font-serif text-[16px] font-normal'>
                    {tier.modelFamily}
                  </h3>
                  <p className='text-muted-foreground mt-2 text-[12px] leading-[1.65]'>
                    {tier.description}
                  </p>
                </div>

                <div className='border-border/70 mt-4 space-y-1 border-t pt-3 font-mono text-[11px]'>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>缓存写入：</span>
                    <span className='text-foreground'>
                      {tier.writeMultiplier}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-muted-foreground'>保活周期：</span>
                    <span className='text-foreground'>{tier.ttl}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 07 Status Codes & Automatic Failover Section */}
      {showStatusCodes && (
        <section
          id='status-codes'
          className='bg-card scroll-mt-24 rounded-[22px] border border-white p-6 shadow-[0_22px_48px_-14px_rgba(20,20,18,0.06)] md:p-8 dark:border-white/10'
        >
          <div className='border-border/80 flex flex-wrap items-baseline justify-between gap-2 border-b pb-4'>
            <div className='flex items-baseline gap-2.5'>
              <span className='text-muted-foreground font-serif text-lg tabular-nums'>
                07
              </span>
              <h2 className='font-serif text-xl font-normal tracking-tight md:text-2xl'>
                状态码参考与热备容灾
              </h2>
            </div>
            <span className='text-muted-foreground font-mono text-[11px]'>
              STATUS CODES &amp; AUTO-FAILOVER
            </span>
          </div>

          <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2'>
            {DOCS_STATUS_CODES.map((item) => (
              <div
                key={item.code}
                className='border-border/80 flex flex-col justify-between rounded-[16px] border bg-[#F8F7F3] p-4.5 dark:bg-zinc-900/60'
              >
                <div>
                  <div className='flex items-center justify-between gap-2'>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant={item.severity}
                        className={cn('font-mono', item.badgeClassName)}
                      >
                        {item.code}
                      </Badge>
                      <span className='text-foreground text-[13.5px] font-semibold'>
                        {item.title}
                      </span>
                    </div>
                    <ShieldAlert className='text-muted-foreground/60 size-3.5 shrink-0' />
                  </div>

                  <p className='text-muted-foreground mt-2.5 text-[12px] leading-[1.6]'>
                    <strong className='text-foreground font-medium'>
                      网关行为：
                    </strong>
                    {item.gatewayBehavior}
                  </p>
                </div>

                <div className='border-border/70 text-muted-foreground mt-3 border-t pt-2.5 text-[11.5px] leading-[1.55]'>
                  <strong className='text-foreground font-medium'>
                    排查建议：
                  </strong>
                  {item.resolution}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 08 FAQ Accordion Section */}
      {showFaq && (
        <section
          id='faq'
          className='bg-card scroll-mt-24 rounded-[22px] border border-white p-6 shadow-[0_22px_48px_-14px_rgba(20,20,18,0.06)] md:p-8 dark:border-white/10'
        >
          <div className='border-border/80 flex flex-wrap items-baseline justify-between gap-2 border-b pb-4'>
            <div className='flex items-baseline gap-2.5'>
              <span className='text-muted-foreground font-serif text-lg tabular-nums'>
                08
              </span>
              <h2 className='font-serif text-xl font-normal tracking-tight md:text-2xl'>
                常见问题解答 (FAQ)
              </h2>
            </div>
            <span className='text-muted-foreground font-mono text-[11px]'>
              FREQUENTLY ASKED QUESTIONS
            </span>
          </div>

          <div className='mt-4'>
            <Accordion defaultValue={[DOCS_FAQ_ITEMS[0].id]}>
              {DOCS_FAQ_ITEMS.map((faq) => (
                <AccordionItem
                  key={faq.id}
                  value={faq.id}
                  className='border-border/70 py-1'
                >
                  <AccordionTrigger className='py-3.5 text-[14px] font-semibold hover:no-underline'>
                    <div className='flex flex-wrap items-center gap-2.5 pr-4 text-left'>
                      <HelpCircle className='text-muted-foreground size-4 shrink-0' />
                      <span>{faq.question}</span>
                      <span className='border-border bg-muted/60 text-muted-foreground rounded-full border px-2 py-0.5 font-mono text-[10.5px] font-normal'>
                        {faq.category}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='text-muted-foreground pb-4 pl-6.5 text-[13px] leading-[1.7]'>
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}
    </div>
  )
}
