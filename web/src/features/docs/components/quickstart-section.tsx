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
  Check,
  Copy,
  Cpu,
  KeyRound,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useState } from 'react'

import {
  StaticDataTable,
  staticDataTableClassNames as tableStyles,
} from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

import { BASE_URL_MATRIX } from '../constants'
import type { DocsSectionId } from '../types'

interface QuickstartSectionProps {
  gatewayOrigin: string
  visibleSectionIds: Set<DocsSectionId>
  isAuthenticated: boolean
}

const ARCHITECTURE_PILLARS = [
  {
    icon: Cpu,
    tag: 'Messages ⇄ Responses ⇄ v1beta',
    title: '原生多协议无损直通',
    description:
      '同时暴露 Anthropic /v1/messages、OpenAI /v1/responses 与 /v1/chat/completions、Google /v1beta 原生端点，完整保留扩展思考、工具调用与前缀缓存控制。',
  },
  {
    icon: Zap,
    tag: '< 1.8ms 网关流式开销',
    title: '智能专线路由与热备切换',
    description:
      '零缓冲 SSE 字节流透传；当上游出现 429 速率限制或 529 节点过载时，网关在首包发出前毫秒级自动重路由至健康热备通道。',
  },
  {
    icon: ShieldCheck,
    tag: '0 数据留存 · 缓存立省 95%',
    title: '澄明计量与零数据留存',
    description:
      '严格执行零数据留存策略（Zero-Data Retention），不落盘任何代码或提示词正文；每一次调用的输入、缓存读取与思考 Token 均实时可审计。',
  },
]

export function QuickstartSection(props: QuickstartSectionProps) {
  const { copyToClipboard } = useCopyToClipboard()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1800)
    }
  }

  const showOverview = props.visibleSectionIds.has('overview')
  const showQuickstart = props.visibleSectionIds.has('quickstart')
  const showMatrix = props.visibleSectionIds.has('base-url-matrix')

  if (!showOverview && !showQuickstart && !showMatrix) {
    return null
  }

  const quickstartCurl = `curl ${props.gatewayOrigin}/v1/messages \\
  -H "x-api-key: sk-mihouo-your-api-key" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-opus-5-5",
    "max_tokens": 1024,
    "messages": [{ "role": "user", "content": "Hello from MIHOUO Gateway" }]
  }'`

  return (
    <div className='space-y-8'>
      {/* 01 Overview Section */}
      {showOverview && (
        <section
          id='overview'
          className='bg-card scroll-mt-24 rounded-[22px] border border-white p-6 shadow-[0_22px_48px_-14px_rgba(20,20,18,0.06)] md:p-8 dark:border-white/10'
        >
          <div className='border-border/80 flex flex-wrap items-baseline justify-between gap-2 border-b pb-4'>
            <div className='flex items-baseline gap-2.5'>
              <span className='text-muted-foreground font-serif text-lg tabular-nums'>
                01
              </span>
              <h2 className='font-serif text-xl font-normal tracking-tight md:text-2xl'>
                平台架构与核心优势
              </h2>
            </div>
            <span className='text-muted-foreground font-mono text-[11px]'>
              ARCHITECTURE &amp; GUARANTEES
            </span>
          </div>

          <p className='text-muted-foreground mt-4 text-[13.5px] leading-[1.7]'>
            MIHOUO（弥火）面向高频工程研发与智能体（Agentic
            Coding）工作流构建。通过统一的网关接入点与标准鉴权令牌，您可以将
            Claude Opus 5.5、GPT-6 Astra、Gemini 4 Argon 与 DeepSeek V4 Pro
            无缝接入任何终端 CLI、IDE 或生产微服务。
          </p>

          <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
            {ARCHITECTURE_PILLARS.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className='border-border/80 flex flex-col justify-between rounded-[16px] border bg-[#F8F7F3] p-5 dark:bg-zinc-900/60'
                >
                  <div>
                    <div className='mb-3 flex items-center justify-between gap-2'>
                      <span className='border-border bg-card inline-flex size-8 items-center justify-center rounded-lg border'>
                        <Icon className='text-foreground size-4' />
                      </span>
                      <span className='text-muted-foreground font-mono text-[10.5px]'>
                        {pillar.tag}
                      </span>
                    </div>
                    <h3 className='text-foreground text-[14.5px] font-semibold tracking-tight'>
                      {pillar.title}
                    </h3>
                    <p className='text-muted-foreground mt-1.5 text-[12.5px] leading-[1.65]'>
                      {pillar.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* 02 3-Step Quickstart Section */}
      {showQuickstart && (
        <section
          id='quickstart'
          className='bg-card scroll-mt-24 rounded-[22px] border border-white p-6 shadow-[0_22px_48px_-14px_rgba(20,20,18,0.06)] md:p-8 dark:border-white/10'
        >
          <div className='border-border/80 flex flex-wrap items-baseline justify-between gap-2 border-b pb-4'>
            <div className='flex items-baseline gap-2.5'>
              <span className='text-muted-foreground font-serif text-lg tabular-nums'>
                02
              </span>
              <h2 className='font-serif text-xl font-normal tracking-tight md:text-2xl'>
                三步极速接入
              </h2>
            </div>
            <span className='text-muted-foreground font-mono text-[11px]'>
              3-STEP QUICKSTART
            </span>
          </div>

          <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-3'>
            {/* Step 1 */}
            <div className='border-border/80 flex flex-col justify-between rounded-[16px] border bg-[#F8F7F3] p-5 dark:bg-zinc-900/60'>
              <div>
                <div className='flex items-center justify-between'>
                  <span className='bg-foreground text-background inline-flex size-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold'>
                    01
                  </span>
                  <span className='text-muted-foreground font-mono text-[11px]'>
                    sk-mihouo-***
                  </span>
                </div>
                <h3 className='text-foreground mt-3.5 text-[15px] font-semibold'>
                  创建 API 令牌
                </h3>
                <p className='text-muted-foreground mt-1.5 text-[12.5px] leading-[1.65]'>
                  登录控制台前往「API
                  令牌」页面，新建一枚密钥。可按需绑定分组、设置总额度上限或限定模型白名单。
                </p>
              </div>
              <div className='mt-4 pt-2'>
                <Link
                  to={props.isAuthenticated ? '/keys' : '/sign-in'}
                  className='text-foreground hover:text-muted-foreground inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-colors'
                >
                  <KeyRound className='size-3.5' />
                  <span>
                    {props.isAuthenticated ? '打开令牌管理' : '登录并获取令牌'}
                  </span>
                  <ArrowRight className='size-3.5' />
                </Link>
              </div>
            </div>

            {/* Step 2 */}
            <div className='border-border/80 flex flex-col justify-between rounded-[16px] border bg-[#F8F7F3] p-5 dark:bg-zinc-900/60'>
              <div>
                <div className='flex items-center justify-between'>
                  <span className='bg-foreground text-background inline-flex size-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold'>
                    02
                  </span>
                  <span className='text-muted-foreground font-mono text-[11px]'>
                    Base URL
                  </span>
                </div>
                <h3 className='text-foreground mt-3.5 text-[15px] font-semibold'>
                  替换客户端接入地址
                </h3>
                <p className='text-muted-foreground mt-1.5 text-[12.5px] leading-[1.65]'>
                  Anthropic 工具（如 Claude Code）直接填写根域名；OpenAI
                  生态工具（如 Codex、Cursor）填写带 /v1 后缀的地址。
                </p>
              </div>
              <div className='border-border/80 bg-card mt-4 flex items-center justify-between rounded-lg border px-3 py-1.5'>
                <code className='text-foreground truncate font-mono text-[11.5px]'>
                  {props.gatewayOrigin}
                </code>
                <button
                  type='button'
                  onClick={() =>
                    handleCopy('quickstart-origin', props.gatewayOrigin)
                  }
                  className='text-muted-foreground hover:text-foreground ml-2 shrink-0 font-mono text-[11px]'
                >
                  {copiedKey === 'quickstart-origin' ? '已复制' : '复制'}
                </button>
              </div>
            </div>

            {/* Step 3 */}
            <div className='border-border/80 flex flex-col justify-between rounded-[16px] border bg-[#F8F7F3] p-5 dark:bg-zinc-900/60'>
              <div>
                <div className='flex items-center justify-between'>
                  <span className='bg-foreground text-background inline-flex size-6 items-center justify-center rounded-full font-mono text-[11px] font-semibold'>
                    03
                  </span>
                  <span className='text-muted-foreground font-mono text-[11px]'>
                    HTTP 200 OK
                  </span>
                </div>
                <h3 className='text-foreground mt-3.5 text-[15px] font-semibold'>
                  发起调用与实时核账
                </h3>
                <p className='text-muted-foreground mt-1.5 text-[12.5px] leading-[1.65]'>
                  运行下方验证命令或在客户端发起对话，随后可在控制台「使用日志」中实时查看首字耗时与缓存折扣明细。
                </p>
              </div>
              <div className='mt-4 pt-2'>
                <Link
                  to='/pricing'
                  className='text-foreground hover:text-muted-foreground inline-flex items-center gap-1.5 text-[12.5px] font-semibold transition-colors'
                >
                  <span>浏览可用模型与实时费率</span>
                  <ArrowRight className='size-3.5' />
                </Link>
              </div>
            </div>
          </div>

          {/* First Request Verification Code Box */}
          <div className='border-border mt-6 overflow-hidden rounded-[16px] border bg-[#161615] text-[#F4F3EE]'>
            <div className='flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5'>
              <span className='font-mono text-[11.5px] text-zinc-400'>
                首条请求连通性验证（Anthropic /v1/messages）
              </span>
              <button
                type='button'
                onClick={() => handleCopy('quickstart-curl', quickstartCurl)}
                className='inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-3 py-0.5 font-mono text-[11px] text-zinc-200 transition-colors hover:bg-white/15'
              >
                {copiedKey === 'quickstart-curl' ? (
                  <>
                    <Check className='size-3' />
                    <span>已复制命令</span>
                  </>
                ) : (
                  <>
                    <Copy className='size-3' />
                    <span>复制 cURL</span>
                  </>
                )}
              </button>
            </div>
            <pre className='overflow-x-auto p-4 font-mono text-[12px] leading-[1.7] text-zinc-100'>
              <code>{quickstartCurl}</code>
            </pre>
          </div>
        </section>
      )}

      {/* 03 Base URL & Protocol Matrix Section */}
      {showMatrix && (
        <section
          id='base-url-matrix'
          className='bg-card scroll-mt-24 rounded-[22px] border border-white p-6 shadow-[0_22px_48px_-14px_rgba(20,20,18,0.06)] md:p-8 dark:border-white/10'
        >
          <div className='border-border/80 flex flex-wrap items-baseline justify-between gap-2 border-b pb-4'>
            <div className='flex items-baseline gap-2.5'>
              <span className='text-muted-foreground font-serif text-lg tabular-nums'>
                03
              </span>
              <h2 className='font-serif text-xl font-normal tracking-tight md:text-2xl'>
                Base URL 与协议路径对照
              </h2>
            </div>
            <span className='text-muted-foreground font-mono text-[11px]'>
              ENDPOINT &amp; BASE URL MATRIX
            </span>
          </div>

          <p className='text-muted-foreground mt-4 mb-5 text-[13.5px] leading-[1.7]'>
            不同 AI 客户端内部拼接路径的方式存在差异：Anthropic
            系列工具会自动追加 /v1/messages，而 OpenAI 系列工具则要求 Base URL
            中已包含 /v1。请参照下表复制对应客户端的准确地址：
          </p>

          <StaticDataTable
            className={tableStyles.sectionContainer}
            headerRowClassName={tableStyles.mutedHeaderRow}
            data={BASE_URL_MATRIX}
            getRowKey={(row) => row.id}
            getRowClassName={() => 'hover:bg-muted/20'}
            columns={[
              {
                id: 'protocol',
                header: '协议与请求路径',
                className: 'h-10 w-56',
                cellClassName: tableStyles.topCell,
                cell: (row) => (
                  <div className='space-y-1'>
                    <div className='text-foreground text-[13px] font-semibold'>
                      {row.protocolName}
                    </div>
                    <div className='flex items-center gap-1.5'>
                      <Badge
                        variant='secondary'
                        className='h-5 rounded px-1.5 font-mono text-[10px]'
                      >
                        {row.method}
                      </Badge>
                      <code className='text-muted-foreground font-mono text-[11.5px]'>
                        {row.endpointPath}
                      </code>
                    </div>
                  </div>
                ),
              },
              {
                id: 'baseUrl',
                header: '客户端填写的 Base URL',
                className: 'h-10 w-64',
                cellClassName: tableStyles.topCell,
                cell: (row) => {
                  const fullBaseUrl = `${props.gatewayOrigin}${row.recommendedBaseUrlSuffix}`
                  const copyId = `matrix-${row.id}`
                  return (
                    <div className='space-y-1'>
                      <div className='flex items-center gap-2'>
                        <code className='bg-muted text-foreground rounded px-2 py-0.5 font-mono text-[12px] font-semibold'>
                          {fullBaseUrl}
                        </code>
                        <button
                          type='button'
                          onClick={() => handleCopy(copyId, fullBaseUrl)}
                          className='text-muted-foreground hover:text-foreground inline-flex items-center gap-1 font-mono text-[11px] transition-colors'
                          aria-label={`复制 ${fullBaseUrl}`}
                        >
                          {copiedKey === copyId ? (
                            <Check className='text-success size-3.5' />
                          ) : (
                            <Copy className='size-3.5' />
                          )}
                        </button>
                      </div>
                      <div className='text-muted-foreground font-mono text-[11px]'>
                        {row.authHeader}
                      </div>
                    </div>
                  )
                },
              },
              {
                id: 'clients',
                header: '适用客户端与注意事项',
                className: 'h-10',
                cellClassName: tableStyles.topMutedCell,
                cell: (row) => (
                  <div className='space-y-1'>
                    <div className='text-foreground text-[12.5px] font-medium'>
                      {row.supportedClients}
                    </div>
                    <p className='text-muted-foreground text-[12px] leading-[1.6]'>
                      {row.note}
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </section>
      )}
    </div>
  )
}
