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

import { HERO_DECK_MODELS } from '../../constants'
import { HeroTerminalDemo } from '../hero-terminal-demo'

export interface HeroProps {
  className?: string
  isAuthenticated?: boolean
}

export function Hero(props: HeroProps) {
  const { t } = useTranslation()
  const [activeModelIdx, setActiveModelIdx] = useState(0)

  return (
    <section
      id='top'
      className={cn(
        'relative z-10 overflow-hidden pt-28 pb-16 md:pt-32 md:pb-20',
        props.className
      )}
    >
      <div className='mx-auto max-w-[1220px] px-6'>
        <div className='grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14'>
          {/* Left Column */}
          <div className='min-w-0'>
            {/* Responsive Balanced Headline */}
            <h1 className='mb-5 text-[clamp(2.1rem,3.4vw,3.25rem)] leading-[1.18] font-bold tracking-[-0.03em] text-[#0F172A] dark:text-white'>
              <span className='block text-balance break-words'>
                {t('Built for Engineering & Production')}
              </span>
              <span className='block bg-[linear-gradient(125deg,#0F172A_0%,#2563EB_55%,#0891B2_100%)] bg-clip-text text-balance break-words text-transparent dark:bg-[linear-gradient(125deg,#FFFFFF_0%,#60A5FA_55%,#22D3EE_100%)]'>
                {t('Unified LLM Gateway')}
              </span>
            </h1>

            {/* Lead Copy */}
            <p className='mb-7 max-w-[540px] text-[15.5px] leading-[1.72] font-normal text-[#64748B] dark:text-zinc-300'>
              {t(
                'Single API key for flagship coding and reasoning models across top providers. Natively compatible with Anthropic and OpenAI protocols, connecting directly to Claude Code, Codex CLI, Cursor, and mainstream clients.'
              )}
            </p>

            {/* Primary & Secondary Actions */}
            <div className='mb-9 flex flex-wrap items-center gap-3'>
              <Button
                className='group h-10 rounded-full border border-[#0F172A] bg-[#0F172A] px-6 text-[13px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(15,23,42,0.2)] transition-all hover:-translate-y-px hover:bg-[#1E293B] dark:border-white dark:bg-white dark:text-[#0F172A]'
                render={
                  <Link
                    to={props.isAuthenticated ? '/dashboard' : '/sign-up'}
                  />
                }
              >
                <span>
                  {props.isAuthenticated
                    ? t('Go to Dashboard')
                    : t('Get started')}
                </span>
                <ArrowRight className='ml-1.5 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>

              <Button
                variant='outline'
                className='h-10 rounded-full border border-[#0F172A]/14 bg-white px-5 text-[13px] font-semibold text-[#0F172A] shadow-[0_2px_6px_rgba(15,23,42,0.03)] transition-all hover:border-[#0F172A]/25 hover:bg-[#F8FAFC] dark:border-white/20 dark:bg-zinc-900 dark:text-zinc-100'
                render={<a href='#models' />}
              >
                {t('Explore Model Matrix')}
              </Button>
            </div>

            {/* Interactive 5-Model Deck Selector */}
            <div className='border-t border-[#0F172A]/[0.08] pt-5 dark:border-white/10'>
              <div
                className='flex flex-wrap gap-2'
                role='tablist'
                aria-label={t('Model selector')}
              >
                {HERO_DECK_MODELS.map((m, idx) => {
                  const isActive = idx === activeModelIdx
                  return (
                    <button
                      key={m.id}
                      type='button'
                      role='tab'
                      aria-selected={isActive}
                      onClick={() => setActiveModelIdx(idx)}
                      className={cn(
                        'inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-[12px] font-medium transition-all duration-200',
                        isActive
                          ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-[0_6px_14px_-4px_rgba(15,23,42,0.2)] dark:border-white dark:bg-white dark:text-[#0F172A]'
                          : 'border-[#0F172A]/[0.08] bg-white text-[#64748B] hover:border-[#0F172A]/15 hover:text-[#0F172A] dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:text-white'
                      )}
                    >
                      <span
                        className='size-1.5 rounded-full'
                        style={{
                          background: isActive ? '#38BDF8' : m.dotColor,
                        }}
                      />
                      <span>{m.name}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column: 5-Card Spring Fanned Deck */}
          <HeroTerminalDemo
            className='w-full min-w-0'
            activeIndex={activeModelIdx}
            onActiveIndexChange={setActiveModelIdx}
          />
        </div>
      </div>
    </section>
  )
}
