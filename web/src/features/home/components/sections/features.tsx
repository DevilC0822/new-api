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
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'

interface FeaturesProps {
  className?: string
}

export function Features(_props: FeaturesProps) {
  const { t } = useTranslation()

  const curatedModels = [
    {
      id: 'claude-opus-5-5',
      name: 'Claude Opus 5.5 / Fable 5.1',
      modelId: 'claude-opus-5-5 · claude-fable-5-1 · claude-sonnet-5-5',
      badge: 'Anthropic /v1/messages',
      context: '1,000K (1M)',
      cache: '最高立减 95%',
      ttft: '~11 ms',
    },
    {
      id: 'gpt-6-astra-sol',
      name: 'GPT-6 Astra / GPT-6.1 Sol',
      modelId: 'gpt-6-astra · gpt-6.1-sol · gpt-6-luna',
      badge: 'OpenAI /v1/responses',
      context: '1,050K (1.05M)',
      cache: '最高立减 95%',
      ttft: '~13 ms',
    },
    {
      id: 'glm-5.3',
      name: 'GLM-5.3',
      modelId: 'glm-5.3',
      badge: 'OpenAI /v1/chat/completions',
      context: '200K',
      cache: '最高立减 95%',
      ttft: '~14 ms',
    },
    {
      id: 'deepseek-v4-pro',
      name: 'DeepSeek V4 Pro / V4.1 Flash',
      modelId: 'deepseek-v4-pro · deepseek-flash',
      badge: '兼容 Anthropic & Responses',
      context: '1,000K / 384K 输出',
      cache: '命中立减 97%',
      ttft: '~15 ms',
    },
  ]

  const modelRows = [curatedModels.slice(0, 2), curatedModels.slice(2, 4)]

  return (
    <section id='models-section' className='relative z-10 py-14 md:py-20'>
      <div className='mx-auto max-w-[1280px] px-6 md:px-12'>
        {/* Section Header — Strictly Aligned Left & Right Axes */}
        <AnimateInView className='mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end'>
          <div>
            <div className='text-muted-foreground mb-2.5 inline-flex items-center gap-2.5 text-xs tracking-[0.14em]'>
              <span className='bg-foreground/35 inline-block h-px w-5' />
              <span>{t('Core Features')}</span>
            </div>
            <h2 className='font-serif text-2xl leading-tight font-normal tracking-tight md:text-[34px]'>
              {t('Built for developers,')}
              <span className='text-muted-foreground'>
                {t('designed for scale')}
              </span>
            </h2>
          </div>

          <Link
            to='/pricing'
            className='text-foreground hover:text-muted-foreground group inline-flex items-center gap-1.5 border-b border-current pb-1 text-[13px] font-medium transition-colors'
          >
            <span>{t('View Pricing')}</span>
            <ArrowRight className='size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Link>
        </AnimateInView>

        {/* 2x2 Curated Frontier Coding Model Matrix */}
        <AnimateInView animation='fade-up'>
          <div className='border-border bg-card overflow-hidden rounded-[20px] border shadow-[0_22px_48px_-14px_rgba(20,20,18,0.06)]'>
            {modelRows.map((row, rowIdx) => (
              <div
                key={row[0].id}
                className={
                  rowIdx === 0
                    ? 'divide-border grid grid-cols-1 divide-y md:grid-cols-2 md:divide-x md:divide-y-0'
                    : 'border-border divide-border grid grid-cols-1 divide-y border-t md:grid-cols-2 md:divide-x md:divide-y-0'
                }
              >
                {row.map((item) => (
                  <div
                    key={item.id}
                    className='flex h-full flex-col justify-between p-6 md:p-7'
                  >
                    <div>
                      <div className='mb-1.5 flex items-center justify-between gap-3'>
                        <h3 className='text-foreground font-serif text-lg font-normal tracking-tight whitespace-nowrap md:text-[20px]'>
                          {item.name}
                        </h3>
                        <span className='border-border bg-background text-muted-foreground shrink-0 rounded-full border px-3 py-0.5 font-mono text-[11px] whitespace-nowrap'>
                          {item.badge}
                        </span>
                      </div>
                      <div className='text-muted-foreground/75 font-mono text-[11.5px]'>
                        {item.modelId}
                      </div>
                    </div>

                    <div className='border-border/80 mt-5 grid grid-cols-3 gap-4 border-t pt-4'>
                      <div>
                        <div className='text-muted-foreground text-[11px]'>
                          上下文窗口
                        </div>
                        <div className='text-foreground mt-0.5 font-mono text-xs font-semibold'>
                          {item.context}
                        </div>
                      </div>
                      <div>
                        <div className='text-muted-foreground text-[11px]'>
                          缓存读取折扣
                        </div>
                        <div className='text-foreground mt-0.5 font-mono text-xs font-semibold'>
                          {item.cache}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='text-muted-foreground text-[11px]'>
                          首字响应
                        </div>
                        <div className='text-foreground mt-0.5 font-mono text-xs font-semibold'>
                          {item.ttft}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </AnimateInView>
      </div>
    </section>
  )
}
