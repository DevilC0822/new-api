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

import { Check, Code2, Copy, Sigma } from 'lucide-react'
import { useState } from 'react'

import {
  StaticDataTable,
  staticDataTableClassNames as tableStyles,
} from '@/components/data-table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

import { DOCS_CODE_LANGS, DOCS_PROTOCOL_SPECS } from '../constants'
import type { DocsCodeLang, DocsProtocolSpec } from '../types'

interface ApiReferenceSectionProps {
  gatewayOrigin: string
  visible: boolean
  activeProtocolId: DocsProtocolSpec['id']
  onProtocolChange: (protocolId: DocsProtocolSpec['id']) => void
}

export function ApiReferenceSection(props: ApiReferenceSectionProps) {
  const { copyToClipboard } = useCopyToClipboard()
  const [activeLang, setActiveLang] = useState<DocsCodeLang>('curl')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  if (!props.visible) {
    return null
  }

  const activeSpec =
    DOCS_PROTOCOL_SPECS.find((p) => p.id === props.activeProtocolId) ??
    DOCS_PROTOCOL_SPECS[0]

  const fullEndpointUrl = `${props.gatewayOrigin}${activeSpec.endpointPath}`
  const requestSampleCode = activeSpec.buildSampleCode(
    activeLang,
    props.gatewayOrigin
  )

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1800)
    }
  }

  return (
    <section
      id='protocol-workbench'
      className='bg-card scroll-mt-24 rounded-[22px] border border-white p-6 shadow-[0_22px_48px_-14px_rgba(20,20,18,0.06)] md:p-8 dark:border-white/10'
    >
      {/* Section Header */}
      <div className='border-border/80 flex flex-wrap items-baseline justify-between gap-2 border-b pb-4'>
        <div className='flex items-baseline gap-2.5'>
          <span className='text-muted-foreground font-serif text-lg tabular-nums'>
            05
          </span>
          <h2 className='font-serif text-xl font-normal tracking-tight md:text-2xl'>
            多协议 API 接口参考
          </h2>
        </div>
        <span className='text-muted-foreground font-mono text-[11px]'>
          MULTI-PROTOCOL API REFERENCE
        </span>
      </div>

      {/* Protocol Switcher Tabs */}
      <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
        <Tabs
          value={activeSpec.id}
          onValueChange={(val) =>
            props.onProtocolChange(val as DocsProtocolSpec['id'])
          }
        >
          <TabsList className='h-auto flex-wrap gap-1 rounded-xl bg-[#F6F5F0] p-1 dark:bg-zinc-800/80'>
            {DOCS_PROTOCOL_SPECS.map((spec) => (
              <TabsTrigger
                key={spec.id}
                value={spec.id}
                className='rounded-lg px-3 py-1.5 text-xs font-medium'
              >
                {spec.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <Tabs
          value={activeLang}
          onValueChange={(val) => setActiveLang(val as DocsCodeLang)}
        >
          <TabsList className='h-8 rounded-lg bg-[#F6F5F0] p-0.5 dark:bg-zinc-800/80'>
            {DOCS_CODE_LANGS.map((lang) => (
              <TabsTrigger
                key={lang.id}
                value={lang.id}
                className='h-7 rounded-md px-2.5 font-mono text-[11.5px]'
              >
                {lang.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Active Endpoint Summary Strip */}
      <div className='border-border mt-4 rounded-[16px] border bg-[#F8F7F3] p-4 dark:bg-zinc-900/60'>
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex min-w-0 flex-wrap items-center gap-2.5'>
            <Badge
              variant='default'
              className='rounded-md px-2.5 py-0.5 font-mono text-[11px]'
            >
              {activeSpec.method}
            </Badge>
            <code className='text-foreground truncate font-mono text-[13px] font-semibold'>
              {fullEndpointUrl}
            </code>
          </div>
          <button
            type='button'
            onClick={() => handleCopy('endpoint-url', fullEndpointUrl)}
            className='border-border bg-card text-foreground hover:bg-foreground hover:text-background inline-flex items-center gap-1.5 rounded-full border px-3 py-1 font-mono text-[11px] font-medium transition-colors'
          >
            {copiedKey === 'endpoint-url' ? (
              <>
                <Check className='size-3' />
                <span>已复制端点</span>
              </>
            ) : (
              <>
                <Copy className='size-3' />
                <span>复制端点 URL</span>
              </>
            )}
          </button>
        </div>

        <p className='text-muted-foreground mt-2.5 text-[12.5px] leading-[1.65]'>
          {activeSpec.summary}
        </p>

        <div className='border-border/70 mt-3 flex flex-wrap items-center justify-between gap-2 border-t pt-2.5 font-mono text-[11px]'>
          <span className='text-muted-foreground'>
            鉴权请求头：
            <strong className='text-foreground font-medium'>
              {activeSpec.authHeader}
            </strong>
          </span>
          <div className='flex flex-wrap items-center gap-1.5'>
            <span className='text-muted-foreground'>代表模型：</span>
            {activeSpec.recommendedModels.map((model) => (
              <span
                key={model}
                className='border-border bg-card text-foreground rounded-md border px-2 py-0.5 text-[10.5px]'
              >
                {model}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Request & Response Dual Code Panels */}
      <div className='mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12'>
        {/* Request Sample Panel (7 cols) */}
        <div className='border-border flex flex-col overflow-hidden rounded-[15px] border bg-[#161615] text-[#F4F3EE] lg:col-span-7'>
          <div className='flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5'>
            <div className='flex items-center gap-2 font-mono text-[11px] text-zinc-300'>
              <Code2 className='size-3.5 text-amber-200/80' />
              <span>
                请求示例 · {activeSpec.label} ({activeLang.toUpperCase()})
              </span>
            </div>
            <button
              type='button'
              onClick={() => handleCopy('req-sample', requestSampleCode)}
              className='inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-200 transition-colors hover:bg-white/15'
            >
              {copiedKey === 'req-sample' ? (
                <>
                  <Check className='size-3' />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className='size-3' />
                  <span>复制代码</span>
                </>
              )}
            </button>
          </div>
          <pre className='flex-1 overflow-x-auto p-4 font-mono text-[11.5px] leading-[1.68] text-zinc-100'>
            <code>{requestSampleCode}</code>
          </pre>
        </div>

        {/* Response JSON Panel (5 cols) */}
        <div className='border-border flex flex-col overflow-hidden rounded-[15px] border bg-[#1B1B19] text-[#F4F3EE] lg:col-span-5'>
          <div className='flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2.5'>
            <span className='font-mono text-[11px] text-zinc-400'>
              响应结构示例 (200 OK JSON)
            </span>
            <button
              type='button'
              onClick={() =>
                handleCopy('resp-sample', activeSpec.sampleResponse)
              }
              className='inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2.5 py-0.5 font-mono text-[11px] text-zinc-200 transition-colors hover:bg-white/15'
            >
              {copiedKey === 'resp-sample' ? (
                <>
                  <Check className='size-3' />
                  <span>已复制</span>
                </>
              ) : (
                <>
                  <Copy className='size-3' />
                  <span>复制 JSON</span>
                </>
              )}
            </button>
          </div>
          <pre className='flex-1 overflow-x-auto p-4 font-mono text-[11px] leading-[1.65] text-zinc-300'>
            <code>{activeSpec.sampleResponse}</code>
          </pre>
        </div>
      </div>

      {/* Request Parameters Table */}
      <div className='mt-6'>
        <h3 className='text-foreground mb-3 flex items-center gap-1.5 text-[14px] font-semibold'>
          <Sigma className='text-muted-foreground size-4' />
          <span>{activeSpec.label} 核心请求参数</span>
        </h3>

        <StaticDataTable
          className={tableStyles.sectionContainer}
          headerRowClassName={tableStyles.mutedHeaderRow}
          data={activeSpec.parameters}
          getRowKey={(param) => param.name}
          getRowClassName={() => 'hover:bg-muted/20'}
          columns={[
            {
              id: 'name',
              header: '参数名',
              className: 'h-9 w-48',
              cellClassName: tableStyles.topCell,
              cell: (param) => (
                <div className='flex items-center gap-1.5'>
                  <code className='font-mono text-[12.5px] font-semibold'>
                    {param.name}
                  </code>
                  {param.required && (
                    <Badge
                      variant='outline'
                      className='h-5 border-rose-500/40 px-1.5 text-[10.5px] text-rose-600 dark:text-rose-400'
                    >
                      必填
                    </Badge>
                  )}
                </div>
              ),
            },
            {
              id: 'type',
              header: '类型 / 默认值',
              className: 'h-9 w-40',
              cellClassName: tableStyles.topCell,
              cell: (param) => (
                <div className='flex flex-wrap items-center gap-1.5'>
                  <Badge
                    variant='secondary'
                    className='h-5 rounded px-2 font-mono text-[11px] font-normal'
                  >
                    {param.type}
                  </Badge>
                  {param.defaultValue && (
                    <code className='text-muted-foreground font-mono text-[11px]'>
                      = {param.defaultValue}
                    </code>
                  )}
                </div>
              ),
            },
            {
              id: 'description',
              header: '参数说明',
              className: 'h-9',
              cellClassName: tableStyles.topMutedCell,
              cell: (param) => (
                <span className='text-[12.5px] leading-[1.6]'>
                  {param.description}
                </span>
              ),
            },
          ]}
        />
      </div>
    </section>
  )
}
