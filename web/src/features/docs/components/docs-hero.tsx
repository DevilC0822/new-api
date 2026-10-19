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
import {
  ArrowRight,
  BookOpen,
  Check,
  Copy,
  Search,
  Sparkles,
  X,
} from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

import type { DocsProtocolSpec, DocsSectionId } from '../types'

interface DocsHeroProps {
  gatewayOrigin: string
  searchQuery: string
  onSearchChange: (value: string) => void
  matchedSectionCount: number
  totalSectionCount: number
  isAuthenticated: boolean
  onSelectProtocol: (protocolId: DocsProtocolSpec['id']) => void
  onJumpToSection: (sectionId: DocsSectionId) => void
}

const HERO_PROTOCOL_PILLS: Array<{
  id: DocsProtocolSpec['id']
  label: string
  path: string
}> = [
  { id: 'messages', label: 'Anthropic', path: 'POST /v1/messages' },
  { id: 'responses', label: 'Responses', path: 'POST /v1/responses' },
  { id: 'chat', label: 'OpenAI Chat', path: 'POST /v1/chat/completions' },
  { id: 'gemini', label: 'Gemini', path: 'POST /v1beta' },
]

export function DocsHero(props: DocsHeroProps) {
  const { copyToClipboard } = useCopyToClipboard()
  const [copiedOrigin, setCopiedOrigin] = useState(false)

  const handleCopyOrigin = async () => {
    const ok = await copyToClipboard(props.gatewayOrigin)
    if (ok) {
      setCopiedOrigin(true)
      window.setTimeout(() => setCopiedOrigin(false), 1800)
    }
  }

  const handleProtocolClick = (protocolId: DocsProtocolSpec['id']) => {
    props.onSelectProtocol(protocolId)
    props.onJumpToSection('protocol-workbench')
  }

  return (
    <section className='border-border relative z-10 overflow-hidden border-b pt-24 pb-10 md:pt-28 md:pb-12'>
      <div className='mx-auto max-w-[1380px] px-6 md:px-10'>
        <div className='grid grid-cols-1 items-end gap-8 lg:grid-cols-12'>
          {/* Left: Eyebrow + Poetic Serif Title + Description */}
          <div className='lg:col-span-7'>
            <div className='text-muted-foreground mb-3.5 inline-flex items-center gap-2.5 text-xs tracking-[0.14em]'>
              <span className='bg-foreground/35 inline-block h-px w-5' />
              <span>DEVELOPER DOCUMENTATION · 开发者文档中心</span>
            </div>

            <h1 className='font-serif text-[clamp(2rem,3.5vw,3rem)] leading-[1.16] font-normal tracking-[-0.015em] text-[#141413] dark:text-[#F4F1EA]'>
              MIHOUO 统一网关技术手册
              <span className='mt-1 block text-[0.72em] text-[#52524E] dark:text-zinc-300'>
                标准双栈协议 · 极速客户端接入 · 澄明缓存计费
              </span>
            </h1>

            <p className='mt-4 max-w-2xl text-[14.5px] leading-[1.72] text-[#3F3F3C] dark:text-zinc-300'>
              无需安装私有 SDK 或修改业务代码，仅需替换 Base URL 与 API
              密钥，即可在 Claude Code、Codex CLI、Cursor
              及生产服务中直连全球旗舰大模型。
            </p>

            {/* Quick Protocol Jump Pills */}
            <div className='mt-5 flex flex-wrap items-center gap-2'>
              <span className='text-muted-foreground mr-1 font-mono text-[11px]'>
                原生协议直达：
              </span>
              {HERO_PROTOCOL_PILLS.map((pill) => (
                <button
                  key={pill.id}
                  type='button'
                  onClick={() => handleProtocolClick(pill.id)}
                  className='border-border bg-card/90 hover:border-foreground/35 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] transition-all hover:bg-white dark:hover:bg-zinc-800'
                >
                  <span className='text-foreground font-semibold'>
                    {pill.label}
                  </span>
                  <span className='text-muted-foreground'>{pill.path}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Right: Live Gateway Endpoint Card & Quick Search */}
          <div className='lg:col-span-5'>
            <div className='rounded-[20px] border border-white bg-white p-5 shadow-[0_20px_44px_-12px_rgba(20,20,18,0.07)] dark:border-white/15 dark:bg-zinc-900'>
              <div className='flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <span className='relative flex size-2'>
                    <span className='bg-success/50 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
                    <span className='bg-success relative inline-flex size-2 rounded-full' />
                  </span>
                  <span className='font-mono text-[11px] font-medium text-[#52524E] dark:text-zinc-300'>
                    网关根接入点 (Gateway Origin)
                  </span>
                </div>

                <Link
                  to={props.isAuthenticated ? '/keys' : '/sign-in'}
                  className='text-foreground hover:text-muted-foreground inline-flex items-center gap-1 font-mono text-[11.5px] font-medium transition-colors'
                >
                  <Sparkles className='size-3 text-[#8C7051]' />
                  <span>
                    {props.isAuthenticated ? '管理 API 令牌' : '获取 API 密钥'}
                  </span>
                  <ArrowRight className='size-3' />
                </Link>
              </div>

              {/* Copyable Gateway Origin Box */}
              <div className='border-border mt-3 flex items-center justify-between gap-3 rounded-[13px] border bg-[#F8F7F3] px-3.5 py-2.5 dark:bg-zinc-800/70'>
                <code className='text-foreground truncate font-mono text-[13.5px] font-semibold'>
                  {props.gatewayOrigin}
                </code>
                <button
                  type='button'
                  onClick={handleCopyOrigin}
                  className='border-border bg-card text-foreground hover:bg-foreground hover:text-background inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-medium transition-colors'
                >
                  {copiedOrigin ? (
                    <>
                      <Check className='size-3' />
                      <span>已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className='size-3' />
                      <span>复制地址</span>
                    </>
                  )}
                </button>
              </div>

              {/* Search Input for Docs */}
              <div className='mt-3.5'>
                <div className='relative'>
                  <Search
                    aria-hidden='true'
                    className='text-muted-foreground pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2'
                  />
                  <Input
                    type='search'
                    value={props.searchQuery}
                    onChange={(e) => props.onSearchChange(e.target.value)}
                    placeholder='搜索文档章节、客户端 (Claude Code / Cursor)、接口或状态码...'
                    aria-label='搜索文档内容'
                    className='border-border bg-[#F8F7F3] pr-9 pl-9 text-[13px] dark:bg-zinc-800/50'
                  />
                  {props.searchQuery.trim().length > 0 && (
                    <Button
                      type='button'
                      variant='ghost'
                      size='icon'
                      onClick={() => props.onSearchChange('')}
                      aria-label='清除文档搜索'
                      className='absolute top-1/2 right-1 size-7 -translate-y-1/2 rounded-full'
                    >
                      <X className='size-3.5' />
                    </Button>
                  )}
                </div>

                <div className='text-muted-foreground mt-2 flex items-center justify-between text-[11px]'>
                  <span className='inline-flex items-center gap-1'>
                    <BookOpen className='size-3' />
                    <span>
                      共 {props.totalSectionCount} 个核心章节 · 当前匹配{' '}
                      {props.matchedSectionCount} 项
                    </span>
                  </span>
                  <span className='font-mono'>
                    Anthropic &amp; OpenAI Dual-Stack
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
