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
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Logo } from '@/assets/logo'
import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'
import { useSystemConfig } from '@/hooks/use-system-config'
import { DEFAULT_SYSTEM_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export interface FeaturesProps {
  className?: string
}

interface ClientEntryNode {
  id: string
  name: string
  protocol: string
  desc: string
  accent: string
  yPos: number
}

interface VendorClusterItem {
  id: string
  vendor: string
  modelsSummary: string
  modelCount: string
  capabilityTag: string
  routeRule: string
  accent: string
  softBg: string
  borderActive: string
  yPos: number
}

interface StreamModelChip {
  id: string
  title: string
  modelId: string
  capability: string
  accent: string
}

const CLIENT_ENTRY_NODES: ClientEntryNode[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    protocol: '/v1/messages',
    desc: 'Native terminal agent integration',
    accent: '#EA580C',
    yPos: 54,
  },
  {
    id: 'codex-cursor',
    name: 'Codex CLI & Cursor',
    protocol: '/v1/responses',
    desc: 'IDE and CLI coding workflows',
    accent: '#2563EB',
    yPos: 138,
  },
  {
    id: 'cherry-switch',
    name: 'Cherry Studio / CC Switch',
    protocol: 'One-click import',
    desc: 'Zero-configuration desktop setup',
    accent: '#0891B2',
    yPos: 222,
  },
  {
    id: 'official-sdk',
    name: 'Anthropic & OpenAI SDK',
    protocol: 'Dual-protocol adaptive',
    desc: 'Seamless migration by changing Base URL',
    accent: '#6366F1',
    yPos: 306,
  },
]

const VENDOR_CLUSTERS: VendorClusterItem[] = [
  {
    id: 'anthropic',
    vendor: 'Anthropic Claude',
    modelsSummary: 'Opus 5.5 · Sonnet 5.5 · Fable 5.1 · Haiku 5.5',
    modelCount: '4 Models',
    capabilityTag: 'Deep thinking · Flagship coding',
    routeRule: 'Auto routing -> Anthropic channel',
    accent: '#EA580C',
    softBg: 'rgba(234, 88, 12, 0.08)',
    borderActive: 'rgba(234, 88, 12, 0.45)',
    yPos: 36,
  },
  {
    id: 'openai',
    vendor: 'OpenAI GPT',
    modelsSummary: 'GPT-6 Astra · GPT-6.1 Sol · GPT-6 Luna',
    modelCount: '3 Models',
    capabilityTag: 'Multimodal · Complex reasoning',
    routeRule: 'Auto routing -> OpenAI channel',
    accent: '#10B981',
    softBg: 'rgba(16, 185, 129, 0.08)',
    borderActive: 'rgba(16, 185, 129, 0.45)',
    yPos: 108,
  },
  {
    id: 'deepseek',
    vendor: 'DeepSeek',
    modelsSummary: 'DeepSeek V4 Pro · DeepSeek V4.1 Flash',
    modelCount: '2 Models',
    capabilityTag: 'Chain of thought · Fast generation',
    routeRule: 'Auto routing -> DeepSeek channel',
    accent: '#2563EB',
    softBg: 'rgba(37, 99, 235, 0.08)',
    borderActive: 'rgba(37, 99, 235, 0.45)',
    yPos: 180,
  },
  {
    id: 'glm',
    vendor: 'Zhipu GLM',
    modelsSummary: 'GLM-5.3 · GLM-5.3 Flash',
    modelCount: '2 Models',
    capabilityTag: 'Full-stack engineering · Tool use',
    routeRule: 'Auto routing -> Zhipu GLM channel',
    accent: '#6366F1',
    softBg: 'rgba(99, 102, 241, 0.08)',
    borderActive: 'rgba(99, 102, 241, 0.45)',
    yPos: 252,
  },
  {
    id: 'kimi',
    vendor: 'Moonshot Kimi',
    modelsSummary: 'Kimi K3.1 Pro (Long Context)',
    modelCount: 'Long reasoning',
    capabilityTag: 'Million context · Deep retrieval',
    routeRule: 'Auto routing -> Moonshot Kimi channel',
    accent: '#0891B2',
    softBg: 'rgba(8, 145, 178, 0.08)',
    borderActive: 'rgba(8, 145, 178, 0.45)',
    yPos: 324,
  },
]

const STREAM_ROW_TOP: StreamModelChip[] = [
  {
    id: 'claude-opus-5-5',
    title: 'Claude Opus 5.5',
    modelId: 'claude-opus-5-5',
    capability: 'Architectural refactoring · Deep thinking',
    accent: '#EA580C',
  },
  {
    id: 'gpt-6-astra',
    title: 'GPT-6 Astra',
    modelId: 'gpt-6-astra',
    capability: 'Multimodal reasoning · Complex planning',
    accent: '#10B981',
  },
  {
    id: 'deepseek-flash',
    title: 'DeepSeek V4.1 Flash',
    modelId: 'deepseek-flash',
    capability: 'Low latency · High-concurrency streaming',
    accent: '#2563EB',
  },
  {
    id: 'glm-5.3',
    title: 'GLM-5.3',
    modelId: 'glm-5.3',
    capability: 'Full-stack code generation · Native tool use',
    accent: '#6366F1',
  },
  {
    id: 'kimi-k3',
    title: 'Kimi K3.1 Pro',
    modelId: 'kimi-k3',
    capability: 'Repository-scale retrieval · Cross-file analysis',
    accent: '#0891B2',
  },
  {
    id: 'claude-sonnet-5-5',
    title: 'Claude Sonnet 5.5',
    modelId: 'claude-sonnet-5-5',
    capability: 'Daily coding workhorse · Balanced low latency',
    accent: '#EA580C',
  },
]

const STREAM_ROW_BOTTOM: StreamModelChip[] = [
  {
    id: 'gpt-6.1-sol',
    title: 'GPT-6.1 Sol',
    modelId: 'gpt-6.1-sol',
    capability: 'Structured output · Agent orchestration',
    accent: '#10B981',
  },
  {
    id: 'deepseek-v4-pro',
    title: 'DeepSeek V4 Pro',
    modelId: 'deepseek-v4-pro',
    capability: 'Math & algorithms · Deep chain-of-thought',
    accent: '#2563EB',
  },
  {
    id: 'claude-fable-5-1',
    title: 'Claude Fable 5.1',
    modelId: 'claude-fable-5-1',
    capability: 'In-depth writing · Complex semantics',
    accent: '#EA580C',
  },
  {
    id: 'glm-5.3-flash',
    title: 'GLM-5.3 Flash',
    modelId: 'glm-5.3-flash',
    capability: 'Lightweight real-time chat · Batch tasks',
    accent: '#6366F1',
  },
  {
    id: 'claude-haiku-5-5',
    title: 'Claude Haiku 5.5',
    modelId: 'claude-haiku-5-5',
    capability: 'Fast code completion · Real-time extraction',
    accent: '#EA580C',
  },
  {
    id: 'gpt-6-luna',
    title: 'GPT-6 Luna',
    modelId: 'gpt-6-luna',
    capability: 'High-throughput automation · Lightweight reasoning',
    accent: '#10B981',
  },
]

function ModelStreamCapsule(props: { item: StreamModelChip }) {
  const { item } = props
  const { t } = useTranslation()
  return (
    <Link
      to='/pricing'
      className='group mr-3.5 inline-flex shrink-0 items-center gap-3 rounded-full border border-[#0F172A]/[0.08] bg-white/95 py-2 pr-4 pl-3.5 shadow-[0_4px_14px_-4px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-600/30 hover:shadow-[0_10px_22px_-6px_rgba(37,99,235,0.12)] dark:border-white/10 dark:bg-zinc-900/90'
    >
      <span
        className='size-2 shrink-0 rounded-full'
        style={{
          background: item.accent,
          boxShadow: `0 0 8px ${item.accent}88`,
        }}
      />
      <div className='flex items-baseline gap-2'>
        <span className='text-[13px] font-bold text-[#0F172A] group-hover:text-blue-600 dark:text-white dark:group-hover:text-blue-400'>
          {item.title}
        </span>
        <span className='hidden font-mono text-[11px] text-[#94A3B8] sm:inline'>
          {item.modelId}
        </span>
      </div>
      <span className='rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[11px] font-medium text-[#475569] dark:bg-zinc-800 dark:text-zinc-300'>
        {t(item.capability)}
      </span>
    </Link>
  )
}

export function Features(props: FeaturesProps) {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()
  const displayName = systemName || DEFAULT_SYSTEM_NAME
  const [activeVendorIdx, setActiveVendorIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = window.setInterval(() => {
      setActiveVendorIdx((prev) => (prev + 1) % VENDOR_CLUSTERS.length)
    }, 2800)
    return () => window.clearInterval(timer)
  }, [isPaused])

  const activeVendor = VENDOR_CLUSTERS[activeVendorIdx] ?? VENDOR_CLUSTERS[0]

  return (
    <section
      id='models'
      className={cn(
        'relative z-10 border-t border-[#0F172A]/[0.08] py-20 dark:border-white/10',
        props.className
      )}
    >
      <div className='mx-auto max-w-[1220px] px-6'>
        {/* Centered Section Header */}
        <AnimateInView className='mb-12 text-center'>
          <div className='mb-2.5 inline-flex items-center gap-2 font-mono text-[11.5px] font-semibold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-400'>
            UNIFIED MODEL ROUTER
          </div>
          <h2 className='text-[clamp(1.85rem,3vw,2.6rem)] leading-[1.18] font-extrabold tracking-[-0.03em] text-[#0F172A] dark:text-white'>
            {t('Flagship Power from Top Providers, Unified in One Key')}
          </h2>
          <p className='mx-auto mt-3.5 max-w-[650px] text-[15px] leading-[1.75] text-[#64748B] dark:text-zinc-400'>
            {t(
              'Eliminate multi-platform key management and protocol incompatibility. From terminal agents and desktop clients to backend services, requests route automatically to optimal model pools.'
            )}
          </p>
        </AnimateInView>

        {/* Main Dynamic Convergence & Smart Routing Stage */}
        <div
          className='relative overflow-hidden rounded-[30px] border border-[#0F172A]/[0.08] bg-[radial-gradient(ellipse_65%_55%_at_50%_42%,rgba(37,99,235,0.06)_0%,transparent_70%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] shadow-[0_24px_60px_-24px_rgba(15,23,42,0.07),inset_0_1px_0_#FFFFFF] dark:border-white/10 dark:bg-[radial-gradient(ellipse_65%_55%_at_50%_42%,rgba(37,99,235,0.12)_0%,transparent_70%),linear-gradient(180deg,#11131A_0%,#090B10_100%)]'
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Architectural Grid Backdrop */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.035)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_45%,black_25%,transparent_90%)] bg-[size:44px_44px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]'
          />

          {/* Top 3-Column Live Routing Topology */}
          <div className='relative z-10 grid grid-cols-1 items-center gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-0 lg:px-9 lg:py-10'>
            {/* Column 1 (Left): 4 Developer Client & Protocol Entry Nodes */}
            <div className='flex flex-col justify-between gap-3.5 lg:col-span-4 lg:pr-2'>
              <div className='mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 px-1'>
                <span className='font-mono text-[11px] font-bold tracking-[0.08em] text-[#64748B] uppercase dark:text-zinc-400'>
                  {t('01 · Clients & Request Entries')}
                </span>
                <span className='font-mono text-[11px] font-semibold text-blue-600 dark:text-blue-400'>
                  {t('Anthropic & OpenAI Dual Protocols')}
                </span>
              </div>

              {CLIENT_ENTRY_NODES.map((node) => (
                <div
                  key={node.id}
                  className='relative flex items-center justify-between gap-3 rounded-[16px] border border-[#0F172A]/[0.07] bg-white/95 px-4 py-3 shadow-[0_8px_20px_-10px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-zinc-900/90'
                >
                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center gap-2'>
                      <span
                        className='size-2 shrink-0 rounded-full'
                        style={{
                          background: node.accent,
                          boxShadow: `0 0 8px ${node.accent}`,
                        }}
                      />
                      <span className='truncate text-[13.5px] font-bold text-[#0F172A] dark:text-white'>
                        {node.name}
                      </span>
                    </div>
                    <div className='mt-0.5 truncate pl-4 text-[11.5px] text-[#64748B] dark:text-zinc-400'>
                      {t(node.desc)}
                    </div>
                  </div>
                  <span className='max-w-[130px] shrink-0 truncate rounded-md border border-[#0F172A]/[0.06] bg-[#F8FAFC] px-2 py-0.5 font-mono text-[11px] font-semibold text-[#334155] dark:border-white/10 dark:bg-zinc-800 dark:text-zinc-300'>
                    {node.protocol.startsWith('/')
                      ? node.protocol
                      : t(node.protocol)}
                  </span>
                </div>
              ))}
            </div>

            {/* Column 2 (Center): SVG Neural Fiber Conduits + MIHOUO Optical Reactor Hub */}
            <div className='relative flex h-[320px] flex-col items-center justify-center lg:col-span-4 lg:h-[360px]'>
              {/* Desktop SVG Fiber-Optic Conduits connecting Left (4 nodes) -> Center Hub -> Right (5 clusters) */}
              <svg
                viewBox='0 0 380 360'
                className='pointer-events-none absolute inset-0 hidden size-full lg:block'
                fill='none'
                aria-hidden='true'
              >
                {/* Left incoming fibers (x: 0 -> 190, y: node.yPos -> 180) */}
                {CLIENT_ENTRY_NODES.map((node, idx) => {
                  const pathD = `M 0 ${node.yPos} C 95 ${node.yPos}, 95 180, 190 180`
                  return (
                    <g key={`in-${node.id}`}>
                      <path
                        d={pathD}
                        stroke='currentColor'
                        className='text-slate-900/[0.09] dark:text-white/[0.1]'
                        strokeWidth='1.5'
                      />
                      <path
                        d={pathD}
                        stroke={node.accent}
                        strokeWidth='2'
                        strokeLinecap='round'
                        className='mihouo-beam-in'
                        style={{ animationDelay: `${idx * -0.65}s` }}
                      />
                    </g>
                  )
                })}

                {/* Right outgoing fibers (x: 190 -> 380, y: 180 -> cluster.yPos) */}
                {VENDOR_CLUSTERS.map((cluster, idx) => {
                  const isActive = idx === activeVendorIdx
                  const pathD = `M 190 180 C 285 180, 285 ${cluster.yPos}, 380 ${cluster.yPos}`
                  return (
                    <g key={`out-${cluster.id}`}>
                      <path
                        d={pathD}
                        stroke={isActive ? cluster.accent : 'currentColor'}
                        className={
                          isActive
                            ? ''
                            : 'text-slate-900/[0.09] dark:text-white/[0.1]'
                        }
                        strokeOpacity={isActive ? 0.38 : 1}
                        strokeWidth={isActive ? '2.2' : '1.5'}
                      />
                      <path
                        d={pathD}
                        stroke={cluster.accent}
                        strokeWidth={isActive ? '3' : '1.8'}
                        strokeOpacity={isActive ? 1 : 0.45}
                        strokeLinecap='round'
                        className='mihouo-beam-out'
                        style={{ animationDelay: `${idx * -0.45}s` }}
                      />
                    </g>
                  )
                })}
              </svg>

              {/* Ambient Glow Pillar Behind Core */}
              <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-y-6 left-1/2 w-px -translate-x-1/2 bg-[linear-gradient(to_bottom,transparent,#2563EB_25%,#06B6D4_50%,#6366F1_75%,transparent)] opacity-50'
              />
              <div
                aria-hidden='true'
                className='pointer-events-none absolute size-44 rounded-full blur-2xl transition-colors duration-500'
                style={{ background: `${activeVendor.accent}22` }}
              />

              {/* Expanding Radar Pulse Rings */}
              <div
                aria-hidden='true'
                className='mihouo-radar-ring pointer-events-none absolute size-28 rounded-[32px] border'
                style={{ borderColor: `${activeVendor.accent}44` }}
              />
              <div
                aria-hidden='true'
                className='mihouo-radar-ring-delayed pointer-events-none absolute size-28 rounded-[32px] border'
                style={{ borderColor: `${activeVendor.accent}33` }}
              />

              {/* Rotating Orbital Precision Ring */}
              <div
                aria-hidden='true'
                className='mihouo-orbit-spin pointer-events-none absolute size-36 rounded-full border border-dashed border-[#0F172A]/15 dark:border-white/15'
              />

              {/* Central Core Emblem */}
              <div
                className='relative z-20 flex size-24 items-center justify-center rounded-[28px] border border-white/20 bg-[#0B0F19] transition-shadow duration-500'
                style={{
                  boxShadow: `0 20px 50px -10px ${activeVendor.accent}66, 0 0 36px -6px ${activeVendor.accent}44, inset 0 1px 0 rgba(255,255,255,0.22)`,
                }}
              >
                <Logo className='size-13' />
              </div>

              {/* Brand Pill & Live Active Route Rule */}
              <div className='relative z-20 mt-3.5 flex flex-col items-center gap-1.5 text-center'>
                <div className='inline-flex items-center gap-1.5 rounded-full border border-[#0F172A]/12 bg-white px-3.5 py-1 text-[12.5px] font-bold tracking-[0.04em] text-[#0F172A] shadow-sm dark:border-white/15 dark:bg-zinc-900 dark:text-white'>
                  <span>{displayName}</span>
                  <span className='rounded bg-blue-600/10 px-1.5 py-px font-mono text-[10.5px] font-semibold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'>
                    auto
                  </span>
                </div>
                <div className='max-w-[340px] truncate rounded-full border border-[#0F172A]/[0.07] bg-white/90 px-3.5 py-1 font-mono text-[11px] font-semibold whitespace-nowrap text-[#334155] shadow-xs backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/90 dark:text-zinc-300'>
                  {t(activeVendor.routeRule)}
                </div>
              </div>
            </div>

            {/* Column 3 (Right): 5 Flagship Vendor Clusters */}
            <div className='flex flex-col justify-between gap-2.5 lg:col-span-4 lg:pl-2'>
              <div className='mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1 px-1'>
                <span className='font-mono text-[11px] font-bold tracking-[0.08em] text-[#64748B] uppercase dark:text-zinc-400'>
                  {t('02 · Flagship Model Pools (Hover to switch)')}
                </span>
                <span className='font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400'>
                  {t('12 Flagship Models Online')}
                </span>
              </div>

              {VENDOR_CLUSTERS.map((cluster, idx) => {
                const isActive = idx === activeVendorIdx
                return (
                  <Link
                    key={cluster.id}
                    to='/pricing'
                    onMouseEnter={() => setActiveVendorIdx(idx)}
                    className={cn(
                      'group relative flex items-center justify-between gap-3 rounded-[16px] border px-4 py-2.5 transition-all duration-250',
                      isActive
                        ? '-translate-x-0.5 bg-white shadow-[0_12px_28px_-10px_rgba(15,23,42,0.1)] dark:bg-zinc-900'
                        : 'border-[#0F172A]/[0.07] bg-white/80 hover:bg-white dark:border-white/10 dark:bg-zinc-900/60 dark:hover:bg-zinc-900'
                    )}
                    style={{
                      borderColor: isActive ? cluster.borderActive : undefined,
                    }}
                  >
                    <div className='min-w-0 flex-1'>
                      <div className='flex items-center gap-2'>
                        <span
                          className='size-2 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-125'
                          style={{
                            background: cluster.accent,
                            boxShadow: isActive
                              ? `0 0 10px ${cluster.accent}`
                              : 'none',
                          }}
                        />
                        <span className='truncate text-[13.5px] font-bold text-[#0F172A] dark:text-white'>
                          {cluster.vendor}
                        </span>
                        <span className='shrink-0 rounded-full bg-[#F1F5F9] px-2 py-px font-mono text-[10px] font-semibold text-[#64748B] dark:bg-zinc-800 dark:text-zinc-400'>
                          {t(cluster.modelCount)}
                        </span>
                      </div>
                      <div className='mt-0.5 truncate pl-4 font-mono text-[11px] text-[#64748B] dark:text-zinc-400'>
                        {cluster.modelsSummary}
                      </div>
                    </div>

                    <div className='shrink-0 text-right'>
                      <span
                        className='inline-block max-w-[140px] truncate rounded-full px-2.5 py-1 font-mono text-[10.5px] font-bold'
                        style={{
                          background: cluster.softBg,
                          color: cluster.accent,
                        }}
                      >
                        {t(cluster.capabilityTag)}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Bottom Dual-Track Infinite Live Model Stream (12 Real Models) */}
          <div className='relative z-10 border-t border-[#0F172A]/[0.07] bg-[#F8FAFC]/80 py-3 dark:border-white/10 dark:bg-zinc-950/60'>
            <div className='mihouo-marquee-track space-y-2 overflow-hidden [mask-image:linear-gradient(90deg,transparent_0%,black_7%,black_93%,transparent_100%)] py-1.5'>
              {/* Track 1: Scrolls Left */}
              <div className='mihouo-marquee-left flex w-max flex-nowrap py-0.5'>
                {(['a', 'b'] as const).map((copy) =>
                  STREAM_ROW_TOP.map((item) => (
                    <ModelStreamCapsule
                      key={`t1-${copy}-${item.id}`}
                      item={item}
                    />
                  ))
                )}
              </div>

              {/* Track 2: Scrolls Right */}
              <div className='mihouo-marquee-right flex w-max flex-nowrap py-0.5'>
                {(['a', 'b'] as const).map((copy) =>
                  STREAM_ROW_BOTTOM.map((item) => (
                    <ModelStreamCapsule
                      key={`t2-${copy}-${item.id}`}
                      item={item}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className='mt-8 flex flex-wrap items-center justify-center gap-3'>
          <Button
            variant='outline'
            className='h-10 rounded-full border border-[#0F172A]/14 bg-white px-5 text-[13px] font-semibold text-[#0F172A] shadow-[0_2px_6px_rgba(15,23,42,0.03)] transition-all hover:border-[#0F172A]/25 hover:bg-[#F8FAFC] dark:border-white/20 dark:bg-zinc-900 dark:text-zinc-100'
            render={<Link to='/rankings' />}
          >
            {t('View Model Rankings')}
          </Button>
          <Button
            className='group h-10 rounded-full border border-[#0F172A] bg-[#0F172A] px-6 text-[13px] font-semibold text-white shadow-[0_6px_16px_-4px_rgba(15,23,42,0.2)] transition-all hover:-translate-y-px hover:bg-[#1E293B] dark:border-white dark:bg-white dark:text-[#0F172A]'
            render={<Link to='/pricing' />}
          >
            <span>
              {t('View all 12 models and pricing rules in Model Square')}
            </span>
            <ArrowRight className='ml-1.5 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
          </Button>
        </div>
      </div>
    </section>
  )
}
