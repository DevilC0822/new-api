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
import { ArrowRight, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { HeroTerminalDemo } from '../hero-terminal-demo'

interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

interface HeroLiveModelSpec {
  id: string
  name: string
  protocol: string
  ttft: string
  officialPrice: string
  mihouoPrice: string
  savingBadge: string
  cacheHitRate: string
  highlight: string
}

const HERO_LIVE_MODELS: HeroLiveModelSpec[] = [
  {
    id: 'claude-opus-5-5',
    name: 'Claude Opus 5.5',
    protocol: 'Anthropic /v1/messages',
    ttft: '11 ms',
    officialPrice: '$4.00 / M',
    mihouoPrice: '$0.20 / M',
    savingBadge: '缓存立省 95%',
    cacheHitRate: '94.8%',
    highlight: '1M 原生上下文 · 常驻自适应深度思考',
  },
  {
    id: 'gpt-6-astra',
    name: 'GPT-6 Astra / Sol',
    protocol: 'OpenAI /v1/responses',
    ttft: '13 ms',
    officialPrice: '$2.00 / M',
    mihouoPrice: '$0.10 / M',
    savingBadge: '缓存立省 95%',
    cacheHitRate: '93.5%',
    highlight: '1.05M 上下文 · 异步工具调用与 Ultrafast',
  },
  {
    id: 'gemini-4-argon',
    name: 'Gemini 4 Argon',
    protocol: 'Google /v1beta & OpenAI',
    ttft: '14 ms',
    officialPrice: '$4.00 / M',
    mihouoPrice: '$0.20 / M',
    savingBadge: '缓存立省 95%',
    cacheHitRate: '92.4%',
    highlight: '1M 统一多模态窗口 · 千万行代码库解耦',
  },
  {
    id: 'deepseek-v4-pro',
    name: 'DeepSeek V4 Pro',
    protocol: 'Messages & Responses',
    ttft: '15 ms',
    officialPrice: '$1.32 / M',
    mihouoPrice: '$0.022 / M',
    savingBadge: '缓存立省 97%',
    cacheHitRate: '96.2%',
    highlight: '1.6T 稀疏 MoE · 384K 输出与闲时半价',
  },
]

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const [activeModelIdx, setActiveModelIdx] = useState(0)
  const activeSpec = HERO_LIVE_MODELS[activeModelIdx]

  return (
    <section className='relative z-10 overflow-hidden pt-24 pb-10 md:pt-28 md:pb-12'>
      <div className='mx-auto max-w-[1280px] px-6 md:px-12'>
        <div className='grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-8'>
          {/* Left Column: Poetic Porcelain Headline + Eye-Catching Live Telemetry & Cache Savings Showcase */}
          <div className='flex flex-col justify-between text-left lg:col-span-6'>
            <div>
              {/* Architectural Eyebrow */}
              <div
                className='landing-animate-fade-up text-muted-foreground mb-4 inline-flex items-center gap-2.5 text-xs tracking-[0.14em] opacity-0'
                style={{ animationDelay: '20ms' }}
              >
                <span className='bg-foreground/35 inline-block h-px w-5' />
                <span>{t('AI Application Infrastructure Foundation')}</span>
              </div>

              {/* Signature 9+9 Character Poetic Serif Headline */}
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

              {/* Concise 2-Line Subtitle */}
              <p
                className='landing-animate-fade-up mt-4 max-w-[500px] text-[14.5px] leading-[1.72] font-normal whitespace-pre-line text-[#3F3F3C] opacity-0 dark:text-zinc-300'
                style={{ animationDelay: '110ms' }}
              >
                {t(
                  'Access a vast selection of models via a standard, unified API protocol. Power AI applications, manage digital assets, and connect the Future.'
                )}
              </p>
            </div>

            {/* Eye-Catching Porcelain Live Telemetry & Cache-Saving Console Card */}
            <div
              className='landing-animate-fade-up mt-7 w-full overflow-hidden rounded-[20px] border border-white bg-white shadow-[0_22px_46px_-12px_rgba(20,20,18,0.08),0_4px_12px_rgba(20,20,18,0.025)] opacity-0 dark:border-white/15 dark:bg-zinc-900'
              style={{ animationDelay: '160ms' }}
            >
              {/* Top Chamber: Model Switcher Tabs + Live Pulse */}
              <div className='border-b border-black/[0.05] bg-[#FAF9F5] px-5 py-3 dark:border-white/10 dark:bg-zinc-800/50'>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <div className='flex items-center gap-2'>
                    <span className='relative flex size-2'>
                      <span className='bg-foreground/40 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
                      <span className='bg-foreground relative inline-flex size-2 rounded-full' />
                    </span>
                    <span className='font-mono text-[11px] font-medium text-[#52524E] dark:text-zinc-300'>
                      实时专线路由与缓存精算
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
                        {m.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Middle Chamber: Live Cost-Saving Comparison & Latency Telemetry */}
              <div className='px-6 py-4.5'>
                <div className='flex items-baseline justify-between gap-4'>
                  <div>
                    <div className='flex items-center gap-2'>
                      <span className='font-serif text-[18px] text-[#141413] dark:text-white'>
                        {activeSpec.name}
                      </span>
                      <span className='rounded-full border border-black/10 bg-[#F6F5F0] px-2.5 py-0.5 font-mono text-[10.5px] font-medium text-[#141413] dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200'>
                        {activeSpec.savingBadge}
                      </span>
                    </div>
                    <p className='mt-0.5 text-[12px] text-[#71716C] dark:text-zinc-400'>
                      {activeSpec.highlight}
                    </p>
                  </div>

                  <div className='text-right'>
                    <div className='font-mono text-[11px] text-[#71716C] line-through'>
                      官方 {activeSpec.officialPrice}
                    </div>
                    <div className='font-serif text-[20px] leading-tight text-[#141413] dark:text-white'>
                      {activeSpec.mihouoPrice}{' '}
                      <span className='font-sans text-[11px] font-normal text-[#71716C]'>
                        缓存命中
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Cache Hit & TTFT Bar */}
                <div className='mt-3.5'>
                  <div className='mb-1.5 flex items-center justify-between font-mono text-[11px] text-[#52524E] dark:text-zinc-400'>
                    <span>
                      多轮代码库前缀缓存命中率{' '}
                      <strong className='text-[#141413] dark:text-white'>
                        {activeSpec.cacheHitRate}
                      </strong>
                    </span>
                    <span>
                      首字响应{' '}
                      <strong className='text-[#141413] dark:text-white'>
                        {activeSpec.ttft}
                      </strong>
                    </span>
                  </div>
                  <div className='h-1.5 w-full overflow-hidden rounded-full bg-[#EFECE6] dark:bg-zinc-800'>
                    <div
                      className='h-full rounded-full bg-gradient-to-r from-[#141413] via-[#52524E] to-[#9A7B56] transition-all duration-500 dark:from-white dark:to-amber-200'
                      style={{ width: activeSpec.cacheHitRate }}
                    />
                  </div>
                </div>
              </div>

              {/* Lower Chamber: Direct Action Buttons */}
              <div className='flex flex-wrap items-center justify-between gap-2 border-t border-black/[0.05] bg-[#F6F5F0] px-6 py-3 dark:border-white/10 dark:bg-zinc-800/60'>
                <div className='flex items-center gap-2 text-[12px] text-[#52524E] dark:text-zinc-300'>
                  <Sparkles className='size-3.5 text-[#8C7051]' />
                  <span>即开即用 · 一枚密钥通调全栈旗舰</span>
                </div>

                <div className='flex items-center gap-2'>
                  <a
                    href='#client-integration-hub'
                    className='text-[#52524E] hover:text-[#141413] dark:text-zinc-400 dark:hover:text-white px-2.5 py-1 text-[11.5px] font-medium transition-colors'
                  >
                    接入指南
                  </a>
                  <Link
                    to={props.isAuthenticated ? '/dashboard' : '/sign-up'}
                    className='bg-[#141413] text-white hover:bg-[#272725] dark:bg-white dark:text-[#141413] inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11.5px] font-medium transition-all'
                  >
                    <span>
                      {props.isAuthenticated ? '进入控制台' : '获取密钥'}
                    </span>
                    <ArrowRight className='size-3' />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Real-Time 3D Optical Glass Pyramid Canvas & Aligned Telemetry */}
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
