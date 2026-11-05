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

import { AnimateInView } from '@/components/animate-in-view'
import { CopyButton } from '@/components/copy-button'
import { Button } from '@/components/ui/button'
import { DEFAULT_GATEWAY_ORIGIN } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface OnboardingStepItem {
  num: string
  title: string
  topBarClass: string
}

const ONBOARDING_STEPS: OnboardingStepItem[] = [
  {
    num: '01',
    title: 'Create an API Key',
    topBarClass: 'from-blue-600 to-indigo-500',
  },
  {
    num: '02',
    title: 'Configure Endpoint or Import',
    topBarClass: 'from-cyan-500 to-blue-600',
  },
  {
    num: '03',
    title: 'Start Calling & Monitor Logs',
    topBarClass: 'from-emerald-500 to-teal-500',
  },
]

interface QuickstartSnippetItem {
  id: string
  label: string
  code: string
}

const QUICKSTART_SNIPPETS: QuickstartSnippetItem[] = [
  {
    id: 'claude-code',
    label: 'Claude Code Terminal',
    code: `export ANTHROPIC_BASE_URL="${DEFAULT_GATEWAY_ORIGIN}"
export ANTHROPIC_AUTH_TOKEN="sk-your-api-key"
claude --model claude-opus-5-5`,
  },
  {
    id: 'codex-cli',
    label: 'Codex CLI',
    code: `export OPENAI_BASE_URL="${DEFAULT_GATEWAY_ORIGIN}/v1"
export OPENAI_API_KEY="sk-your-api-key"
codex --model gpt-6-astra`,
  },
  {
    id: 'anthropic-sdk',
    label: 'Anthropic SDK',
    code: `import Anthropic from '@anthropic-ai/sdk';
const client = new Anthropic({ baseURL: '${DEFAULT_GATEWAY_ORIGIN}', apiKey: process.env.API_KEY });
const msg = await client.messages.create({ model: 'claude-opus-5-5', max_tokens: 4096, messages: [{ role: 'user', content: 'Hello' }] });`,
  },
  {
    id: 'openai-sdk',
    label: 'OpenAI SDK',
    code: `import OpenAI from 'openai';
const client = new OpenAI({ baseURL: '${DEFAULT_GATEWAY_ORIGIN}/v1', apiKey: process.env.API_KEY });
const res = await client.chat.completions.create({ model: 'deepseek-v4-pro', messages: [{ role: 'user', content: 'Hello' }] });`,
  },
]

export function HowItWorks() {
  const { t } = useTranslation()
  const [activeSnippetIdx, setActiveSnippetIdx] = useState(0)
  const activeSnippet =
    QUICKSTART_SNIPPETS[activeSnippetIdx] ?? QUICKSTART_SNIPPETS[0]

  return (
    <section
      id='onboarding'
      className='relative z-10 border-t border-[#0F172A]/[0.08] py-20 dark:border-white/10'
    >
      <div className='mx-auto max-w-[1220px] px-6'>
        {/* Section Header */}
        <AnimateInView className='mb-11 flex flex-col justify-between gap-6 md:flex-row md:items-end'>
          <div>
            <h2 className='text-[clamp(1.75rem,2.6vw,2.35rem)] leading-[1.22] font-bold tracking-[-0.025em] text-balance text-[#0F172A] dark:text-white'>
              {t('Get Started in 3 Simple Steps, Zero Code Changes')}
            </h2>
          </div>

          <Button
            variant='outline'
            className='group h-10 rounded-full border border-[#0F172A]/14 bg-white px-5 text-[13px] font-semibold text-[#0F172A] shadow-[0_2px_6px_rgba(15,23,42,0.03)] transition-all hover:border-[#0F172A]/25 hover:bg-[#F8FAFC] dark:border-white/20 dark:bg-zinc-900 dark:text-zinc-100'
            render={<Link to='/docs' />}
          >
            <span>{t('View Documentation')}</span>
            <ArrowRight className='ml-1.5 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
        </AnimateInView>

        {/* 3-Step Equal-Height Grid */}
        <div className='grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3'>
          {ONBOARDING_STEPS.map((step, idx) => (
            <AnimateInView
              key={step.num}
              animation='fade-up'
              delay={idx * 60}
              className='group relative overflow-hidden rounded-[24px] border border-[#0F172A]/[0.08] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-7 shadow-[0_12px_32px_-18px_rgba(15,23,42,0.04)] transition-all duration-250 hover:-translate-y-0.5 hover:border-blue-600/25 dark:border-white/10 dark:bg-zinc-900 dark:bg-none'
            >
              {/* Top Optical Accent Line */}
              <div
                aria-hidden='true'
                className={cn(
                  'absolute inset-x-0 top-0 h-1 bg-gradient-to-r opacity-85 transition-opacity group-hover:opacity-100',
                  step.topBarClass
                )}
              />

              <div className='mb-4.5 flex size-[34px] items-center justify-center rounded-[10px] border border-blue-600/16 bg-blue-600/[0.08] font-mono text-[13px] font-bold text-blue-600 dark:border-blue-400/25 dark:bg-blue-500/15 dark:text-blue-400'>
                {step.num}
              </div>

              <h3 className='mb-2 text-[19px] font-bold tracking-[-0.02em] text-[#0F172A] dark:text-white'>
                {t(step.title)}
              </h3>

              {step.num === '01' && (
                <p className='text-[13.5px] leading-[1.68] text-[#64748B] dark:text-zinc-400'>
                  {t(
                    'Sign up and generate an API key in the console. One key works across all providers, with customizable quota limits and model access scopes.'
                  )}
                </p>
              )}
              {step.num === '02' && (
                <p className='text-[13.5px] leading-[1.68] text-[#64748B] dark:text-zinc-400'>
                  {t(
                    'Set the gateway endpoint in Claude Code or Codex CLI, or import directly into Cherry Studio and CC Switch.'
                  )}
                </p>
              )}
              {step.num === '03' && (
                <p className='text-[13.5px] leading-[1.68] text-[#64748B] dark:text-zinc-400'>
                  {t(
                    'Make requests directly with target model identifiers. Review response latency, throughput, and status logs in the console anytime.'
                  )}
                </p>
              )}
            </AnimateInView>
          ))}
        </div>

        {/* Interactive Multi-Environment Quickstart Command Bar (Theme-Adaptive) */}
        <AnimateInView
          animation='fade-up'
          delay={180}
          className='mt-6 overflow-hidden rounded-[22px] border border-[#0F172A]/[0.08] bg-white text-[#0F172A] shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-zinc-900 dark:text-slate-100'
        >
          <div className='flex flex-wrap items-center justify-between gap-3 border-b border-[#0F172A]/[0.07] bg-[#F8FAFC] px-5 py-3 dark:border-white/10 dark:bg-zinc-950/60'>
            <div className='flex flex-wrap items-center gap-1 rounded-lg border border-[#0F172A]/[0.06] bg-[#F1F5F9] p-1 dark:border-white/10 dark:bg-white/[0.05]'>
              {QUICKSTART_SNIPPETS.map((snippet, idx) => {
                const isActive = idx === activeSnippetIdx
                return (
                  <button
                    key={snippet.id}
                    type='button'
                    onClick={() => setActiveSnippetIdx(idx)}
                    className={cn(
                      'rounded-md px-2.5 py-1 font-mono text-[11.5px] font-semibold transition-all duration-150',
                      isActive
                        ? 'bg-white text-[#0F172A] shadow-xs dark:bg-blue-600 dark:text-white'
                        : 'text-[#64748B] hover:text-[#0F172A] dark:text-slate-400 dark:hover:text-white'
                    )}
                  >
                    {t(snippet.label)}
                  </button>
                )
              })}
            </div>

            <CopyButton
              value={activeSnippet.code}
              variant='outline'
              size='sm'
              className='h-7 gap-1.5 rounded-lg border-[#0F172A]/12 bg-white px-2.5 text-[11.5px] font-semibold text-[#0F172A] hover:bg-[#F1F5F9] dark:border-white/15 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/10'
              iconClassName='size-3.5'
            >
              <span>{t('Copy code')}</span>
            </CopyButton>
          </div>

          <pre className='overflow-x-auto bg-white px-5 py-4 font-mono text-[12.5px] leading-[1.7] text-[#1E293B] dark:bg-zinc-900 dark:text-sky-200'>
            <code>{activeSnippet.code}</code>
          </pre>
        </AnimateInView>
      </div>
    </section>
  )
}
