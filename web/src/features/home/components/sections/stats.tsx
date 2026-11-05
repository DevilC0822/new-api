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
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'

interface EngineeringPillar {
  id: string
  title: string
  // Technical endpoint list rendered verbatim in mono, not translated.
  endpoints?: string
  points: string[]
}

const ENGINEERING_PILLARS: EngineeringPillar[] = [
  {
    id: 'protocols',
    title: 'Native Support for Both Anthropic and OpenAI Protocols',
    endpoints: '/v1/messages · /v1/responses · /v1/chat/completions',
    points: [
      'Full support for Extended Thinking, Prompt Caching, and Tool Use',
    ],
  },
  {
    id: 'metering',
    title: 'Multi-Dimensional Token Metering & Real-Time Tracing',
    points: [
      'Input (p), cache read (cr), cache creation (cc), and output (c) metered per request',
      'First-token latency and throughput recorded on every call',
    ],
  },
  {
    id: 'governance',
    title: 'Memory Streaming & Team Token Governance',
    points: [
      'In-memory streaming passthrough, no persistent prompt logging by default',
      'Independent quota caps and expiration dates for members and CI pipelines',
      'Fine-grained authorization by client IP range and accessible model lists',
    ],
  },
]

export function Stats() {
  const { t } = useTranslation()

  return (
    <section
      id='architecture'
      className='relative z-10 border-t border-[#0F172A]/[0.08] py-20 dark:border-white/10'
    >
      <div className='mx-auto max-w-[1220px] px-6'>
        {/* Section Header */}
        <AnimateInView className='mb-11 text-center'>
          <h2 className='mx-auto max-w-[720px] text-[clamp(1.75rem,2.6vw,2.35rem)] leading-[1.25] font-bold tracking-[-0.025em] text-balance text-[#0F172A] dark:text-white'>
            {t('Engineered for High-Frequency Coding & Development Teams')}
          </h2>
        </AnimateInView>

        {/* 3-Column Engineering Pillars */}
        <div className='grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3'>
          {ENGINEERING_PILLARS.map((pillar, idx) => (
            <AnimateInView
              key={pillar.id}
              animation='fade-up'
              delay={idx * 60}
              className='flex flex-col gap-4 rounded-[24px] border border-[#0F172A]/[0.08] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-7 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] transition-all duration-250 hover:-translate-y-0.5 hover:border-blue-600/20 dark:border-white/10 dark:bg-zinc-900 dark:bg-none'
            >
              <h3 className='text-[19px] font-bold tracking-[-0.02em] text-[#0F172A] dark:text-white'>
                {t(pillar.title)}
              </h3>

              {pillar.endpoints && (
                <div className='rounded-lg border border-[#0F172A]/[0.06] bg-[#F8FAFC] px-3 py-2 font-mono text-[11.5px] font-semibold text-[#334155] dark:border-white/10 dark:bg-zinc-800/60 dark:text-zinc-300'>
                  {pillar.endpoints}
                </div>
              )}

              <ul className='flex flex-col gap-2.5'>
                {pillar.points.map((point) => (
                  <li
                    key={point}
                    className='flex items-start gap-2.5 text-[13.5px] leading-[1.6] text-[#64748B] dark:text-zinc-400'
                  >
                    <span
                      aria-hidden='true'
                      className='mt-[7px] size-1.5 shrink-0 rounded-full bg-blue-600 dark:bg-blue-400'
                    />
                    <span>{t(point)}</span>
                  </li>
                ))}
              </ul>
            </AnimateInView>
          ))}
        </div>
      </div>
    </section>
  )
}
