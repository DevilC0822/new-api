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
import { Check, Code2, Copy } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

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
  activeProtocolId: DocsProtocolSpec['id']
  onProtocolChange: (protocolId: DocsProtocolSpec['id']) => void
}

export function ApiReferenceSection(props: ApiReferenceSectionProps) {
  const { t } = useTranslation()
  const { copyToClipboard } = useCopyToClipboard()
  const [activeLang, setActiveLang] = useState<DocsCodeLang>('curl')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

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
      className='scroll-mt-24 rounded-[24px] border border-[#0F172A]/[0.08] bg-white p-6 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] md:p-8 dark:border-white/10 dark:bg-zinc-900'
    >
      {/* Section Header */}
      <div className='flex items-baseline gap-2.5 border-b border-[#0F172A]/[0.07] pb-4 dark:border-white/10'>
        <span className='rounded-md bg-blue-600/10 px-2 py-0.5 font-mono text-[12px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'>
          03
        </span>
        <h2 className='text-[20px] font-bold tracking-[-0.02em] text-[#0F172A] md:text-[22px] dark:text-white'>
          {t('API Reference')}
        </h2>
      </div>

      {/* Protocol Switcher + SDK Language Tabs */}
      <div className='mt-5 flex flex-wrap items-center justify-between gap-3'>
        <Tabs
          value={activeSpec.id}
          onValueChange={(val) =>
            props.onProtocolChange(val as DocsProtocolSpec['id'])
          }
        >
          <TabsList className='h-auto flex-wrap gap-1 rounded-xl border border-[#0F172A]/[0.06] bg-[#F1F5F9] p-1 dark:border-white/10 dark:bg-zinc-800/80'>
            {DOCS_PROTOCOL_SPECS.map((spec) => (
              <TabsTrigger
                key={spec.id}
                value={spec.id}
                className='rounded-lg px-3 py-1.5 text-xs font-semibold'
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
          <TabsList className='h-8 rounded-lg border border-[#0F172A]/[0.06] bg-[#F1F5F9] p-0.5 dark:border-white/10 dark:bg-zinc-800/80'>
            {DOCS_CODE_LANGS.map((lang) => (
              <TabsTrigger
                key={lang.id}
                value={lang.id}
                className='h-7 rounded-md px-2.5 font-mono text-[11.5px] font-semibold'
              >
                {lang.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* Compact Endpoint Strip */}
      <div className='mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#0F172A]/[0.08] bg-[#F8FAFC] px-4 py-3 dark:border-white/10 dark:bg-zinc-950/60'>
        <div className='flex min-w-0 flex-wrap items-center gap-2.5'>
          <Badge
            variant='default'
            className='rounded-md bg-blue-600 px-2 py-0.5 font-mono text-[11px] text-white'
          >
            {activeSpec.method}
          </Badge>
          <code className='truncate font-mono text-[13px] font-bold text-[#0F172A] dark:text-white'>
            {fullEndpointUrl}
          </code>
          <span className='hidden font-mono text-[11px] text-[#64748B] sm:inline dark:text-zinc-400'>
            · {t('Auth')}: {activeSpec.authHeader}
          </span>
        </div>

        <button
          type='button'
          onClick={() => handleCopy('endpoint-url', fullEndpointUrl)}
          className='inline-flex items-center gap-1 rounded-lg border border-[#0F172A]/12 bg-white px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0F172A] transition-colors hover:bg-[#0F172A] hover:text-white dark:border-white/15 dark:bg-zinc-800 dark:text-white dark:hover:bg-white dark:hover:text-[#0F172A]'
        >
          {copiedKey === 'endpoint-url' ? (
            <>
              <Check className='size-3 text-emerald-500' />
              <span>{t('Copied')}</span>
            </>
          ) : (
            <>
              <Copy className='size-3' />
              <span>{t('Copy Endpoint')}</span>
            </>
          )}
        </button>
      </div>

      {/* Request & Response Dual Code Panels */}
      <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12'>
        <div className='flex flex-col overflow-hidden rounded-[15px] border border-[#0F172A]/[0.08] bg-[#F8FAFC] lg:col-span-7 dark:border-white/10 dark:bg-zinc-950'>
          <div className='flex items-center justify-between border-b border-[#0F172A]/[0.07] bg-white px-4 py-2.5 dark:border-white/10 dark:bg-zinc-900'>
            <div className='flex items-center gap-2 font-mono text-[11.5px] font-semibold text-[#0F172A] dark:text-zinc-200'>
              <Code2 className='size-3.5 text-blue-600 dark:text-sky-400' />
              <span>{t('Request Example')}</span>
            </div>
            <button
              type='button'
              onClick={() => handleCopy('req-sample', requestSampleCode)}
              className='inline-flex items-center gap-1 rounded-md border border-[#0F172A]/10 bg-[#F8FAFC] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0F172A] transition-colors hover:bg-[#0F172A] hover:text-white dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-white dark:hover:text-[#0F172A]'
            >
              {copiedKey === 'req-sample' ? (
                <>
                  <Check className='size-3 text-emerald-500' />
                  <span>{t('Copied')}</span>
                </>
              ) : (
                <>
                  <Copy className='size-3' />
                  <span>{t('Copy Code')}</span>
                </>
              )}
            </button>
          </div>
          <pre className='flex-1 overflow-x-auto p-4 font-mono text-[11.5px] leading-[1.68] text-[#1E293B] dark:text-sky-200'>
            <code>{requestSampleCode}</code>
          </pre>
        </div>

        <div className='flex flex-col overflow-hidden rounded-[15px] border border-[#0F172A]/[0.08] bg-[#F8FAFC] lg:col-span-5 dark:border-white/10 dark:bg-zinc-950'>
          <div className='flex items-center justify-between border-b border-[#0F172A]/[0.07] bg-white px-4 py-2.5 dark:border-white/10 dark:bg-zinc-900'>
            <span className='font-mono text-[11.5px] font-semibold text-[#475569] dark:text-zinc-400'>
              {t('Response Example')}
            </span>
            <button
              type='button'
              onClick={() =>
                handleCopy('resp-sample', activeSpec.sampleResponse)
              }
              className='inline-flex items-center gap-1 rounded-md border border-[#0F172A]/10 bg-[#F8FAFC] px-2.5 py-0.5 font-mono text-[11px] font-semibold text-[#0F172A] transition-colors hover:bg-[#0F172A] hover:text-white dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-white dark:hover:text-[#0F172A]'
            >
              {copiedKey === 'resp-sample' ? (
                <>
                  <Check className='size-3 text-emerald-500' />
                  <span>{t('Copied')}</span>
                </>
              ) : (
                <>
                  <Copy className='size-3' />
                  <span>{t('Copy JSON')}</span>
                </>
              )}
            </button>
          </div>
          <pre className='flex-1 overflow-x-auto p-4 font-mono text-[11px] leading-[1.65] text-[#334155] dark:text-zinc-300'>
            <code>{activeSpec.sampleResponse}</code>
          </pre>
        </div>
      </div>

      {/* Request Parameters Table */}
      <div className='mt-5'>
        <StaticDataTable
          className={tableStyles.sectionContainer}
          headerRowClassName={tableStyles.mutedHeaderRow}
          data={activeSpec.parameters}
          getRowKey={(param) => param.name}
          getRowClassName={() => 'hover:bg-muted/20'}
          columns={[
            {
              id: 'name',
              header: t('Parameter'),
              className: 'h-9 w-44',
              cellClassName: tableStyles.topCell,
              cell: (param) => (
                <div className='flex items-center gap-1.5'>
                  <code className='font-mono text-[12.5px] font-bold text-[#0F172A] dark:text-white'>
                    {param.name}
                  </code>
                  {param.required && (
                    <Badge
                      variant='outline'
                      className='h-5 border-rose-500/40 px-1.5 text-[10.5px] text-rose-600 dark:text-rose-400'
                    >
                      {t('Required')}
                    </Badge>
                  )}
                </div>
              ),
            },
            {
              id: 'type',
              header: t('Type'),
              className: 'h-9 w-36',
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
                    <code className='font-mono text-[11px] text-[#64748B] dark:text-zinc-400'>
                      = {param.defaultValue}
                    </code>
                  )}
                </div>
              ),
            },
            {
              id: 'description',
              header: t('Description'),
              className: 'h-9',
              cellClassName: tableStyles.topMutedCell,
              cell: (param) => (
                <span className='text-[12.5px] leading-[1.6] text-[#64748B] dark:text-zinc-400'>
                  {t(param.description)}
                </span>
              ),
            },
          ]}
        />
      </div>
    </section>
  )
}
