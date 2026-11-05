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
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { cn } from '@/lib/utils'

interface ProtocolPreviewItem {
  id: string
  endpoint: string
  protocolBadge: string
  payloadLine1: string
  payloadLine2: string
  featureLine: string
}

const PROTOCOL_PREVIEWS: ProtocolPreviewItem[] = [
  {
    id: 'messages',
    endpoint: '/v1/messages',
    protocolBadge: 'Anthropic Native Protocol',
    payloadLine1: 'POST /v1/messages · anthropic-version: 2023-06-01',
    payloadLine2:
      '{"thinking":{"type":"enabled","budget_tokens":8192},"cache_control":{"type":"ephemeral"}}',
    featureLine:
      'Full support for Extended Thinking, Prompt Caching, and Tool Use',
  },
  {
    id: 'responses',
    endpoint: '/v1/responses',
    protocolBadge: 'OpenAI Responses Protocol',
    payloadLine1: 'POST /v1/responses · SSE Stream',
    payloadLine2:
      '{"reasoning":{"effort":"high","summary":"auto"},"tools":[{"type":"function"}]}',
    featureLine:
      'Full support for reasoning controls, structured outputs, and multi-step tool orchestration',
  },
  {
    id: 'chat',
    endpoint: '/v1/chat/completions',
    protocolBadge: 'OpenAI Compatible Protocol',
    payloadLine1: 'POST /v1/chat/completions · SSE Stream',
    payloadLine2:
      '{"stream":true,"stream_options":{"include_usage":true},"response_format":{"type":"json_object"}}',
    featureLine:
      'Seamless compatibility with open-source frameworks, agent workflows, and existing codebases',
  },
]

const TELEMETRY_METRICS = [
  { code: 'p', name: 'Input tokens', share: 16, color: 'bg-sky-500' },
  { code: 'cr', name: 'Cache read', share: 68, color: 'bg-blue-600' },
  {
    code: 'cc / c',
    name: 'Cache creation & output',
    share: 16,
    color: 'bg-indigo-500',
  },
] as const

const SECURITY_POLICIES = [
  {
    title: 'Zero Payload Storage',
    sub: 'In-memory streaming passthrough, no persistent prompt logging by default',
    badge: '0 BODY LOG',
  },
  {
    title: 'Sub-token Quota & Expiry',
    sub: 'Independent quota caps and expiration dates for members and CI pipelines',
    badge: 'QUOTA CAP',
  },
  {
    title: 'IP & Model Access Control',
    sub: 'Fine-grained authorization by client IP range and accessible model lists',
    badge: 'ACL GUARD',
  },
] as const

export function Stats() {
  const { t } = useTranslation()
  const [activeProtocolIdx, setActiveProtocolIdx] = useState(0)
  const activeProtocol =
    PROTOCOL_PREVIEWS[activeProtocolIdx] ?? PROTOCOL_PREVIEWS[0]

  return (
    <section
      id='architecture'
      className='relative z-10 border-t border-[#0F172A]/[0.08] py-20 dark:border-white/10'
    >
      <div className='mx-auto max-w-[1220px] px-6'>
        {/* Section Header */}
        <AnimateInView className='mb-11 flex flex-col justify-between gap-6 md:flex-row md:items-end'>
          <div className='max-w-[720px]'>
            <div className='mb-2.5 inline-flex items-center gap-2 font-mono text-[11.5px] font-semibold tracking-[0.06em] text-blue-600 uppercase dark:text-blue-400'>
              ARCHITECTURE &amp; GOVERNANCE
            </div>
            <h2 className='text-[clamp(1.75rem,2.6vw,2.35rem)] leading-[1.25] font-bold tracking-[-0.025em] text-balance text-[#0F172A] dark:text-white'>
              {t('Engineered for High-Frequency Coding & Development Teams')}
            </h2>
          </div>
          <p className='max-w-[420px] shrink-0 text-[14px] leading-[1.68] text-[#64748B] dark:text-zinc-400'>
            {t(
              'From dual-protocol passthrough and granular token metering to privacy governance, built for production standards.'
            )}
          </p>
        </AnimateInView>

        {/* Clean 3-Column Engineering Pillars (No Redundant Pricing) */}
        <div className='grid grid-cols-1 items-stretch gap-5 lg:grid-cols-3'>
          {/* Pillar 1: Protocol Fidelity */}
          <AnimateInView
            animation='fade-up'
            className='flex flex-col justify-between gap-6 rounded-[24px] border border-[#0F172A]/[0.08] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-7 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] transition-all duration-250 hover:-translate-y-0.5 hover:border-blue-600/20 dark:border-white/10 dark:bg-zinc-900 dark:bg-none'
          >
            <div>
              <div className='mb-1.5 font-mono text-[11px] font-semibold tracking-[0.08em] text-blue-600 uppercase dark:text-blue-400'>
                01 · PROTOCOL FIDELITY
              </div>
              <h3 className='mb-2 text-[19px] font-bold tracking-[-0.02em] text-[#0F172A] dark:text-white'>
                {t('Native Support for Both Anthropic and OpenAI Protocols')}
              </h3>
              <p className='text-[13.5px] leading-[1.68] text-[#64748B] dark:text-zinc-400'>
                {t(
                  'All models support /v1/messages, /v1/responses, and /v1/chat/completions, preserving extended thinking, context caching, and tool call schemas.'
                )}
              </p>
            </div>

            <div className='flex flex-col gap-2.5 rounded-[16px] border border-[#0F172A]/[0.08] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.02)] dark:border-white/10 dark:bg-zinc-800/60'>
              <div className='flex items-center justify-between border-b border-[#0F172A]/[0.06] pb-2 font-mono text-[11px] dark:border-white/10'>
                <span className='font-semibold text-[#0F172A] dark:text-white'>
                  {t(activeProtocol.protocolBadge)}
                </span>
                <span className='rounded bg-blue-500/10 px-2 py-0.5 text-[10.5px] font-semibold text-blue-600 dark:text-blue-400'>
                  SSE Stream
                </span>
              </div>

              <div className='flex flex-wrap gap-1.5'>
                {PROTOCOL_PREVIEWS.map((item, idx) => {
                  const isActive = idx === activeProtocolIdx
                  return (
                    <button
                      key={item.id}
                      type='button'
                      onClick={() => setActiveProtocolIdx(idx)}
                      className={cn(
                        'rounded-md border px-2.5 py-1 font-mono text-[11px] font-semibold transition-all duration-150',
                        isActive
                          ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-xs dark:border-white dark:bg-white dark:text-[#0F172A]'
                          : 'border-[#0F172A]/[0.08] bg-[#F8FAFC] text-[#475569] hover:text-[#0F172A] dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300'
                      )}
                    >
                      {item.endpoint}
                    </button>
                  )
                })}
              </div>

              <div className='rounded-xl border border-[#0F172A]/[0.06] bg-[#F8FAFC] p-3 font-mono text-[11px] text-[#334155] dark:border-white/10 dark:bg-zinc-950 dark:text-slate-200'>
                <div className='truncate text-[#64748B] dark:text-slate-400'>
                  {activeProtocol.payloadLine1}
                </div>
                <div className='mt-1 truncate text-blue-600 dark:text-sky-300'>
                  {activeProtocol.payloadLine2}
                </div>
                <div className='mt-2 border-t border-[#0F172A]/[0.06] pt-1.5 text-[10.5px] leading-[1.4] font-semibold text-emerald-600 dark:border-white/10 dark:text-emerald-400'>
                  ● {t(activeProtocol.featureLine)}
                </div>
              </div>
            </div>
          </AnimateInView>

          {/* Pillar 2: Granular Telemetry & Audit */}
          <AnimateInView
            animation='fade-up'
            delay={60}
            className='flex flex-col justify-between gap-6 rounded-[24px] border border-[#0F172A]/[0.08] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-7 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] transition-all duration-250 hover:-translate-y-0.5 hover:border-blue-600/20 dark:border-white/10 dark:bg-zinc-900 dark:bg-none'
          >
            <div>
              <div className='mb-1.5 font-mono text-[11px] font-semibold tracking-[0.08em] text-blue-600 uppercase dark:text-blue-400'>
                02 · GRANULAR TELEMETRY
              </div>
              <h3 className='mb-2 text-[19px] font-bold tracking-[-0.02em] text-[#0F172A] dark:text-white'>
                {t('Multi-Dimensional Token Metering & Real-Time Tracing')}
              </h3>
              <p className='text-[13.5px] leading-[1.68] text-[#64748B] dark:text-zinc-400'>
                {t(
                  'Each request independently tracks input (p), cache read (cr), cache creation (cc/cc1h), and output (c), with first-token latency and throughput metrics.'
                )}
              </p>
            </div>

            <div className='flex flex-col gap-3 rounded-[16px] border border-[#0F172A]/[0.08] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.02)] dark:border-white/10 dark:bg-zinc-800/60'>
              <div className='flex items-center justify-between border-b border-[#0F172A]/[0.06] pb-2 font-mono text-[11px] dark:border-white/10'>
                <span className='font-semibold text-[#0F172A] dark:text-white'>
                  {t('Real-time Request Log Snapshot')}
                </span>
                <span className='shrink-0 rounded bg-emerald-500/10 px-2 py-0.5 text-[10.5px] font-semibold text-emerald-600 dark:text-emerald-400'>
                  SSE
                </span>
              </div>

              <div>
                <div className='mb-2 flex h-2 gap-0.5 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700'>
                  {TELEMETRY_METRICS.map((m) => (
                    <div
                      key={m.code}
                      className={m.color}
                      style={{ width: `${m.share}%` }}
                    />
                  ))}
                </div>
                <div className='grid grid-cols-3 gap-1.5'>
                  {TELEMETRY_METRICS.map((m) => (
                    <div
                      key={m.code}
                      className='rounded-lg bg-[#F8FAFC] px-2.5 py-1.5 font-mono dark:bg-zinc-900/70'
                    >
                      <div className='text-[10.5px] font-bold text-[#0F172A] dark:text-white'>
                        {m.code}
                      </div>
                      <div className='truncate text-[10px] text-[#64748B] dark:text-zinc-400'>
                        {t(m.name)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex items-center justify-between border-t border-[#0F172A]/[0.06] pt-2 font-mono text-[10.5px] text-[#64748B] dark:border-white/10 dark:text-zinc-400'>
                <span className='flex items-center gap-1.5'>
                  <span className='size-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)]' />
                  <span>status: 200 OK · SSE</span>
                </span>
              </div>
            </div>
          </AnimateInView>

          {/* Pillar 3: Zero Retention & Team Governance */}
          <AnimateInView
            animation='fade-up'
            delay={120}
            className='flex flex-col justify-between gap-6 rounded-[24px] border border-[#0F172A]/[0.08] bg-[linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] p-7 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] transition-all duration-250 hover:-translate-y-0.5 hover:border-blue-600/20 dark:border-white/10 dark:bg-zinc-900 dark:bg-none'
          >
            <div>
              <div className='mb-1.5 font-mono text-[11px] font-semibold tracking-[0.08em] text-blue-600 uppercase dark:text-blue-400'>
                03 · PRIVACY &amp; GOVERNANCE
              </div>
              <h3 className='mb-2 text-[19px] font-bold tracking-[-0.02em] text-[#0F172A] dark:text-white'>
                {t('Memory Streaming & Team Token Governance')}
              </h3>
              <p className='text-[13.5px] leading-[1.68] text-[#64748B] dark:text-zinc-400'>
                {t(
                  'The gateway logs metering metadata only and never stores your prompt payloads or code content; supports restricted sub-tokens for teams or CI environments.'
                )}
              </p>
            </div>

            <div className='flex flex-col gap-2 rounded-[16px] border border-[#0F172A]/[0.08] bg-white p-3.5 shadow-[0_2px_10px_rgba(15,23,42,0.02)] dark:border-white/10 dark:bg-zinc-800/60'>
              {SECURITY_POLICIES.map((policy) => (
                <div
                  key={policy.title}
                  className='flex items-start justify-between gap-2.5 rounded-lg bg-[#F8FAFC] px-3 py-2.5 dark:bg-zinc-900/70'
                >
                  <div className='min-w-0 flex-1'>
                    <div className='text-[12.5px] font-bold text-[#0F172A] dark:text-white'>
                      {t(policy.title)}
                    </div>
                    <div className='mt-0.5 text-[11px] leading-[1.45] text-[#64748B] dark:text-zinc-400'>
                      {t(policy.sub)}
                    </div>
                  </div>
                  <span className='shrink-0 rounded bg-white px-2 py-0.5 font-mono text-[9.5px] font-bold text-[#334155] shadow-2xs dark:bg-zinc-800 dark:text-zinc-300'>
                    {policy.badge}
                  </span>
                </div>
              ))}
            </div>
          </AnimateInView>
        </div>
      </div>
    </section>
  )
}
