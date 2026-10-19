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

import { Check, CheckCircle2, Copy, Terminal } from 'lucide-react'
import { useState } from 'react'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

import { DOCS_CLIENT_GUIDES } from '../constants'

interface ClientGuidesSectionProps {
  gatewayOrigin: string
  visible: boolean
}

export function ClientGuidesSection(props: ClientGuidesSectionProps) {
  const { copyToClipboard } = useCopyToClipboard()
  const [activeClientId, setActiveClientId] = useState<string>('claude-code')
  const [configTab, setConfigTab] = useState<'env' | 'config'>('env')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  if (!props.visible) {
    return null
  }

  const activeClient =
    DOCS_CLIENT_GUIDES.find((c) => c.id === activeClientId) ??
    DOCS_CLIENT_GUIDES[0]

  const clientBaseUrl = `${props.gatewayOrigin}${activeClient.baseUrlSuffix}`
  const envCode = activeClient.buildEnvCode(props.gatewayOrigin)
  const configCode = activeClient.buildConfigCode(props.gatewayOrigin)
  const verifyCode = activeClient.buildVerifyCode(props.gatewayOrigin)
  const activeConfigCode = configTab === 'env' ? envCode : configCode
  const activeConfigTitle =
    configTab === 'env' ? activeClient.envTitle : activeClient.configTitle

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1800)
    }
  }

  return (
    <section
      id='client-workbench'
      className='bg-card scroll-mt-24 overflow-hidden rounded-[22px] border border-white shadow-[0_22px_48px_-14px_rgba(20,20,18,0.06)] dark:border-white/10'
    >
      {/* Top Section Header */}
      <div className='border-border/80 flex flex-wrap items-baseline justify-between gap-2 border-b px-6 py-5 md:px-8'>
        <div className='flex items-baseline gap-2.5'>
          <span className='text-muted-foreground font-serif text-lg tabular-nums'>
            04
          </span>
          <h2 className='font-serif text-xl font-normal tracking-tight md:text-2xl'>
            客户端与 IDE 深度接入指南
          </h2>
        </div>
        <span className='text-muted-foreground font-mono text-[11px]'>
          CLIENT &amp; IDE INTEGRATION WORKBENCH
        </span>
      </div>

      {/* Split Client Selector + 3-Step Configuration Workbench */}
      <div className='grid grid-cols-1 md:grid-cols-12'>
        {/* Left: Client Switcher Column (4 cols) */}
        <div className='border-border flex flex-col justify-between border-b bg-[#F8F7F3] p-5 md:col-span-4 md:border-r md:border-b-0 dark:bg-zinc-900/65'>
          <div>
            <div className='border-border/80 mb-3 flex items-center justify-between border-b pb-2.5'>
              <div className='flex items-center gap-2'>
                <Terminal className='text-foreground size-3.5' />
                <span className='text-foreground text-xs font-semibold tracking-[0.06em]'>
                  选择开发工具
                </span>
              </div>
              <span className='text-muted-foreground font-mono text-[10.5px]'>
                6 款主流客户端
              </span>
            </div>

            <div
              className='space-y-1.5'
              role='tablist'
              aria-label='客户端配置切换列表'
            >
              {DOCS_CLIENT_GUIDES.map((client) => {
                const isSelected = client.id === activeClient.id
                return (
                  <button
                    key={client.id}
                    type='button'
                    role='tab'
                    aria-selected={isSelected}
                    onClick={() => setActiveClientId(client.id)}
                    className={cn(
                      'flex w-full flex-col rounded-[13px] border px-3.5 py-2.5 text-left transition-all duration-150',
                      isSelected
                        ? 'border-white bg-white text-[#141413] shadow-[0_8px_20px_-6px_rgba(20,20,18,0.08)] dark:border-white/20 dark:bg-zinc-800 dark:text-white'
                        : 'border-transparent bg-transparent text-[#52524E] hover:border-black/5 hover:bg-white/60 hover:text-[#141413] dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-100'
                    )}
                  >
                    <div className='flex w-full items-center justify-between gap-2'>
                      <span className='text-[13px] font-semibold tracking-tight'>
                        {client.name}
                      </span>
                      <span
                        className={cn(
                          'rounded-full px-2 py-0.5 font-mono text-[10px]',
                          isSelected
                            ? 'bg-[#141413] text-white dark:bg-white dark:text-[#141413]'
                            : 'bg-black/[0.04] text-[#71717A] dark:bg-white/10 dark:text-zinc-400'
                        )}
                      >
                        {client.tag}
                      </span>
                    </div>
                    <span className='text-muted-foreground mt-0.5 line-clamp-1 text-[11px]'>
                      {client.subtitle}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Client Key Highlights Box */}
          <div className='border-border/80 bg-card mt-5 rounded-[14px] border p-3.5'>
            <div className='text-foreground mb-2 text-[11.5px] font-semibold'>
              核心适配特性
            </div>
            <ul className='space-y-1.5'>
              {activeClient.highlights.map((item) => (
                <li
                  key={item}
                  className='text-muted-foreground flex items-start gap-1.5 text-[11px] leading-[1.5]'
                >
                  <CheckCircle2 className='text-success mt-0.5 size-3 shrink-0' />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Active Client Configuration Steps (8 cols) */}
        <div className='flex min-w-0 flex-col justify-between p-6 md:col-span-8 md:p-7'>
          <div>
            {/* Client Title & Protocol Badge */}
            <div className='border-border/80 flex flex-wrap items-start justify-between gap-3 border-b pb-4'>
              <div>
                <h3 className='text-foreground font-serif text-xl font-normal tracking-tight'>
                  配置 {activeClient.name}
                </h3>
                <p className='text-muted-foreground mt-1 text-[12.5px]'>
                  {activeClient.subtitle}
                </p>
              </div>
              <div className='flex flex-col items-start gap-1 sm:items-end'>
                <span className='border-border bg-background text-foreground rounded-full border px-3 py-0.5 font-mono text-[11px] font-medium'>
                  {activeClient.protocol}
                </span>
                <span className='text-muted-foreground font-mono text-[11px]'>
                  推荐模型：{activeClient.recommendedModel}
                </span>
              </div>
            </div>

            {/* Step 1: Base URL */}
            <div className='mt-5'>
              <div className='mb-2 flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <span className='bg-foreground text-background inline-flex size-5 items-center justify-center rounded-full font-mono text-[10.5px] font-semibold'>
                    01
                  </span>
                  <span className='text-foreground text-[13.5px] font-semibold'>
                    确认客户端专属 Base URL
                  </span>
                </div>
                <span className='text-muted-foreground font-mono text-[11px]'>
                  {activeClient.authHeader}
                </span>
              </div>

              <div className='border-border flex flex-col justify-between gap-3 rounded-[13px] border bg-[#F8F7F3] px-4 py-3 sm:flex-row sm:items-center dark:bg-zinc-900/60'>
                <div className='min-w-0'>
                  <div className='text-muted-foreground text-[11px]'>
                    {activeClient.name} Base URL
                  </div>
                  <code className='text-foreground mt-0.5 block truncate font-mono text-[13px] font-semibold'>
                    {clientBaseUrl}
                  </code>
                </div>
                <button
                  type='button'
                  onClick={() => handleCopy('client-baseurl', clientBaseUrl)}
                  className='border-border bg-card text-foreground hover:bg-foreground hover:text-background inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border px-3.5 py-1.5 font-mono text-[11px] font-medium transition-colors sm:self-center'
                >
                  {copiedKey === 'client-baseurl' ? (
                    <>
                      <Check className='size-3.5' />
                      <span>已复制 Base URL</span>
                    </>
                  ) : (
                    <>
                      <Copy className='size-3.5' />
                      <span>复制 Base URL</span>
                    </>
                  )}
                </button>
              </div>
              <p className='text-muted-foreground mt-1.5 text-[12px] leading-[1.6]'>
                {activeClient.baseUrlNote}
              </p>
            </div>

            {/* Step 2: Env / Config File Toggle */}
            <div className='mt-5'>
              <div className='mb-2 flex flex-wrap items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <span className='bg-foreground text-background inline-flex size-5 items-center justify-center rounded-full font-mono text-[10.5px] font-semibold'>
                    02
                  </span>
                  <span className='text-foreground text-[13.5px] font-semibold'>
                    写入环境变量或持久化配置文件
                  </span>
                </div>

                <div className='border-border inline-flex rounded-full border bg-[#F6F5F0] p-0.5 dark:bg-zinc-800'>
                  <button
                    type='button'
                    onClick={() => setConfigTab('env')}
                    className={cn(
                      'rounded-full px-3 py-1 text-[11px] font-medium transition-all',
                      configTab === 'env'
                        ? 'bg-white text-[#141413] shadow-xs dark:bg-zinc-900 dark:text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    方式 A · 环境变量
                  </button>
                  <button
                    type='button'
                    onClick={() => setConfigTab('config')}
                    className={cn(
                      'rounded-full px-3 py-1 text-[11px] font-medium transition-all',
                      configTab === 'config'
                        ? 'bg-white text-[#141413] shadow-xs dark:bg-zinc-900 dark:text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    方式 B · 配置文件
                  </button>
                </div>
              </div>

              <div className='border-border overflow-hidden rounded-[14px] border bg-[#161615] text-[#F4F3EE]'>
                <div className='flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2'>
                  <span className='font-mono text-[11px] text-zinc-400'>
                    {activeConfigTitle}
                  </span>
                  <button
                    type='button'
                    onClick={() =>
                      handleCopy('client-config', activeConfigCode)
                    }
                    className='inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-200 transition-colors hover:bg-white/15'
                  >
                    {copiedKey === 'client-config' ? (
                      <>
                        <Check className='size-3' />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className='size-3' />
                        <span>复制配置</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className='overflow-x-auto p-4 font-mono text-[12px] leading-[1.68] text-zinc-100'>
                  <code>{activeConfigCode}</code>
                </pre>
              </div>
            </div>

            {/* Step 3: Verification cURL */}
            <div className='mt-5'>
              <div className='mb-2 flex items-center justify-between gap-2'>
                <div className='flex items-center gap-2'>
                  <span className='bg-foreground text-background inline-flex size-5 items-center justify-center rounded-full font-mono text-[10.5px] font-semibold'>
                    03
                  </span>
                  <span className='text-foreground text-[13.5px] font-semibold'>
                    {activeClient.verifyTitle}
                  </span>
                </div>
                <span className='text-muted-foreground font-mono text-[11px]'>
                  返回 HTTP 200 即配置完成
                </span>
              </div>

              <div className='border-border overflow-hidden rounded-[13px] border bg-[#F8F7F3] dark:bg-zinc-900/60'>
                <div className='border-border/70 flex items-center justify-between border-b px-4 py-2'>
                  <span className='text-muted-foreground font-mono text-[11px]'>
                    终端一键测试命令
                  </span>
                  <button
                    type='button'
                    onClick={() => handleCopy('client-verify', verifyCode)}
                    className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-mono text-[11px] transition-colors'
                  >
                    {copiedKey === 'client-verify' ? (
                      <>
                        <Check className='size-3' />
                        <span>已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className='size-3' />
                        <span>复制 cURL</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className='text-foreground overflow-x-auto p-4 font-mono text-[11.5px] leading-[1.65]'>
                  <code>{verifyCode}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
