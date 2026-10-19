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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

interface HeroLiveModelSpec {
  id: string
  shortName: string
  name: string
  protocol: string
  ttft: string
  officialPrice: string
  mihouoPrice: string
  savingBadge: string
}

const HERO_LIVE_MODELS: HeroLiveModelSpec[] = [
  {
    id: 'claude-opus-5-5',
    shortName: 'Claude',
    name: 'Claude Opus 5.5',
    protocol: 'Anthropic /v1/messages',
    ttft: '11 ms',
    officialPrice: '$4.00 / M',
    mihouoPrice: '$0.80 / M',
    savingBadge: '官方 2 折',
  },
  {
    id: 'gpt-6-astra',
    shortName: 'GPT',
    name: 'GPT-6 Astra / Sol',
    protocol: 'OpenAI /v1/responses',
    ttft: '13 ms',
    officialPrice: '$10.00 / M',
    mihouoPrice: '$0.70 / M',
    savingBadge: '官方 0.7 折',
  },
  {
    id: 'glm-5.3',
    shortName: 'GLM',
    name: 'GLM-5.3',
    protocol: 'OpenAI /v1/chat/completions',
    ttft: '14 ms',
    officialPrice: '$1.40 / M',
    mihouoPrice: '$0.28 / M',
    savingBadge: '官方 2 折',
  },
  {
    id: 'deepseek-flash',
    shortName: 'DeepSeek',
    name: 'DeepSeek Flash',
    protocol: 'OpenAI /v1/chat/completions',
    ttft: '15 ms',
    officialPrice: '$0.30 / M',
    mihouoPrice: '$0.255 / M',
    savingBadge: '官方 8.5 折',
  },
]

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const [activeModelIdx, setActiveModelIdx] = useState(0)
  const activeSpec = HERO_LIVE_MODELS[activeModelIdx]

  return (
    <section
      className={cn(
        'relative z-10 overflow-hidden pt-24 pb-10 md:pt-28 md:pb-12',
        props.className
      )}
    >
      <div className='mx-auto max-w-[1280px] px-6 md:px-12'>
        <div className='grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-8'>
          {/* Left Column: Headline + Primary CTAs + Compact Model Pricing Switcher */}
          <div className='flex flex-col justify-between text-left lg:col-span-6'>
            <div>
              <div
                className='landing-animate-fade-up text-muted-foreground mb-4 inline-flex items-center gap-2.5 text-xs tracking-[0.14em] opacity-0'
                style={{ animationDelay: '20ms' }}
              >
                <span className='bg-foreground/35 inline-block h-px w-5' />
                <span>{t('AI Application Infrastructure Foundation')}</span>
              </div>

              <h1
                className='landing-animate-fade-up font-serif text-[clamp(2.35rem,3.9vw,3.35rem)] leading-[1.16] font-normal tracking-[-0.015em] text-[#141413] opacity-0 dark:text-[#F4F1EA]'
                style={{ animationDelay: '60ms' }}
              >
                {t('Unified API Gateway for')}
                <br />
                <span className='text-[#3F3F3C] dark:text-zinc-300'>
                  {t('Vast Range of AI Models')}
                </span>
              </h1>

              <p
                className='landing-animate-fade-up mt-4 max-w-[500px] text-[14.5px] leading-[1.72] font-normal whitespace-pre-line text-[#3F3F3C] opacity-0 dark:text-zinc-300'
                style={{ animationDelay: '110ms' }}
              >
                {t(
                  'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
                )}
              </p>

              <div
                className='landing-animate-fade-up mt-6 flex flex-wrap items-center gap-3 opacity-0'
                style={{ animationDelay: '140ms' }}
              >
                <Button
                  className='group h-10 rounded-full px-6 text-sm font-medium'
                  render={
                    <Link
                      to={props.isAuthenticated ? '/dashboard' : '/sign-up'}
                    />
                  }
                >
                  <span>
                    {props.isAuthenticated
                      ? t('Access Gateway')
                      : t('Get Started')}
                  </span>
                  <ArrowRight className='ml-1.5 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>
                <Button
                  variant='outline'
                  className='border-border hover:border-foreground/40 hover:bg-muted/40 h-10 rounded-full px-5 text-sm font-medium'
                  render={<a href='#client-integration-hub' />}
                >
                  {t('Explore SDK docs')}
                </Button>
              </div>
            </div>

            {/* Compact Model Rate & Protocol Card */}
            <div
              className='landing-animate-fade-up mt-7 w-full overflow-hidden rounded-[20px] border border-white bg-white opacity-0 shadow-[0_22px_46px_-12px_rgba(20,20,18,0.08),0_4px_12px_rgba(20,20,18,0.025)] dark:border-white/15 dark:bg-zinc-900'
              style={{ animationDelay: '180ms' }}
            >
              <div className='border-b border-black/[0.05] bg-[#FAF9F5] px-5 py-3 dark:border-white/10 dark:bg-zinc-800/50'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className='relative flex size-2'>
                      <span className='bg-foreground/40 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
                      <span className='bg-foreground relative inline-flex size-2 rounded-full' />
                    </span>
                    <span className='font-mono text-[11px] font-medium text-[#52524E] dark:text-zinc-300'>
                      {t('Claude Code & Codex Integration')}
                    </span>
                  </div>

                  <div className='flex items-center gap-1'>
                    {HERO_LIVE_MODELS.map((m, idx) => (
                      <button
                        key={m.id}
                        type='button'
                        onClick={() => setActiveModelIdx(idx)}
                        className={cn(
                          'rounded-full px-2.5 py-0.5 font-mono text-[11px] transition-all',
                          idx === activeModelIdx
                            ? 'bg-[#141413] font-medium text-white dark:bg-white dark:text-[#141413]'
                            : 'text-[#71716C] hover:bg-black/[0.04] hover:text-[#141413] dark:text-zinc-400'
                        )}
                      >
                        {m.shortName}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className='flex items-center justify-between gap-4 px-6 py-4'>
                <div>
                  <div className='flex items-center gap-2'>
                    <span className='font-serif text-[18px] text-[#141413] dark:text-white'>
                      {activeSpec.name}
                    </span>
                    <span className='rounded-full border border-black/10 bg-[#F6F5F0] px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-[#141413] dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200'>
                      {activeSpec.savingBadge}
                    </span>
                  </div>
                  <div className='mt-1 font-mono text-[11.5px] text-[#71716C] dark:text-zinc-400'>
                    {activeSpec.protocol} · {activeSpec.ttft} TTFT
                  </div>
                </div>

                <div className='text-right'>
                  <div className='font-mono text-[11px] text-[#71716C] line-through'>
                    官方 {activeSpec.officialPrice}
                  </div>
                  <div className='font-serif text-[20px] leading-tight text-[#141413] dark:text-white'>
                    {activeSpec.mihouoPrice}{' '}
                    <span className='font-sans text-[11px] font-normal text-[#71716C]'>
                      输入价
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time 3D Optical Glass Pyramid Canvas */}
          <div
            className='landing-animate-fade-up flex w-full items-stretch justify-center opacity-0 lg:col-span-6 lg:justify-end'
            style={{ animationDelay: '220ms' }}
          >
            <HeroTerminalDemo
              className='w-full'
              activeIndex={activeModelIdx}
              onActiveIndexChange={setActiveModelIdx}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
