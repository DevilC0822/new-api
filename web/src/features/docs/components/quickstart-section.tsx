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
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'

import { BASE_URL_CARDS, DOCS_EXAMPLE_MODEL } from '../constants'

interface QuickstartSectionProps {
  gatewayOrigin: string
}

export function QuickstartSection(props: QuickstartSectionProps) {
  const { t } = useTranslation()
  const { copyToClipboard } = useCopyToClipboard()
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const handleCopy = async (key: string, text: string) => {
    const ok = await copyToClipboard(text)
    if (ok) {
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 1800)
    }
  }

  const quickCurlCommand = `curl ${props.gatewayOrigin}/v1/messages \\
  -H "x-api-key: $MIHOUO_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "${DOCS_EXAMPLE_MODEL.modelId}",
    "max_tokens": 1024,
    "messages": [{ "role": "user", "content": "Hello" }]
  }'`

  return (
    <section
      id='base-url-matrix'
      className='scroll-mt-24 rounded-[24px] border border-[#0F172A]/[0.08] bg-white p-6 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] md:p-8 dark:border-white/10 dark:bg-zinc-900'
    >
      {/* Section Header */}
      <div className='flex items-baseline gap-2.5 border-b border-[#0F172A]/[0.07] pb-4 dark:border-white/10'>
        <span className='rounded-md bg-blue-600/10 px-2 py-0.5 font-mono text-[12px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'>
          01
        </span>
        <h2 className='text-[20px] font-bold tracking-[-0.02em] text-[#0F172A] md:text-[22px] dark:text-white'>
          {t('Quickstart')}
        </h2>
      </div>

      {/* Dual Base URL Cards */}
      <div className='mt-5 grid grid-cols-1 gap-4 md:grid-cols-2'>
        {BASE_URL_CARDS.map((card) => {
          const fullUrl = `${props.gatewayOrigin}${card.baseUrlSuffix}`
          const copyId = `url-${card.id}`
          const isCopied = copiedKey === copyId

          return (
            <div
              key={card.id}
              className='flex flex-col justify-between rounded-[18px] border border-[#0F172A]/[0.08] bg-[#F8FAFC] p-5 dark:border-white/10 dark:bg-zinc-950/60'
            >
              <div>
                <div className='flex flex-wrap items-center justify-between gap-2'>
                  <span className='text-[15px] font-bold text-[#0F172A] dark:text-white'>
                    {t(card.title)}
                  </span>
                  <span className='rounded-md border border-blue-600/20 bg-blue-600/[0.06] px-2 py-0.5 font-mono text-[10.5px] font-semibold text-blue-600 dark:border-blue-400/25 dark:bg-blue-500/15 dark:text-blue-400'>
                    {t(card.protocolBadge)}
                  </span>
                </div>

                {/* Copyable URL Box */}
                <div className='mt-3 flex items-center justify-between gap-2 rounded-xl border border-[#0F172A]/[0.08] bg-white px-3.5 py-2.5 dark:border-white/10 dark:bg-zinc-900'>
                  <code className='truncate font-mono text-[13px] font-bold text-[#0F172A] dark:text-white'>
                    {fullUrl}
                  </code>
                  <button
                    type='button'
                    onClick={() => handleCopy(copyId, fullUrl)}
                    className='inline-flex shrink-0 items-center gap-1 rounded-lg border border-[#0F172A]/10 bg-[#F8FAFC] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0F172A] transition-colors hover:bg-[#0F172A] hover:text-white dark:border-white/15 dark:bg-zinc-800 dark:text-white dark:hover:bg-white dark:hover:text-[#0F172A]'
                  >
                    {isCopied ? (
                      <>
                        <Check className='size-3 text-emerald-500' />
                        <span>{t('Copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className='size-3' />
                        <span>{t('Copy')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className='mt-3 space-y-1 text-[12px] text-[#64748B] dark:text-zinc-400'>
                <div className='font-medium text-[#334155] dark:text-zinc-300'>
                  {t('Applies to')}: {card.clients}
                </div>
                <div>{t(card.ruleNote)}</div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Single Model Example & Quick Test */}
      <div className='mt-5 overflow-hidden rounded-[18px] border border-[#0F172A]/[0.08] bg-[#F8FAFC] dark:border-white/10 dark:bg-zinc-950'>
        <div className='flex flex-wrap items-center justify-between gap-3 border-b border-[#0F172A]/[0.07] bg-white px-5 py-3 dark:border-white/10 dark:bg-zinc-900'>
          <div className='flex flex-wrap items-center gap-2.5'>
            <span className='text-[13.5px] font-bold text-[#0F172A] dark:text-white'>
              {t('Example Request')}
            </span>
            <span className='text-[12px] text-[#64748B] dark:text-zinc-400'>
              {t('Using')}
            </span>
            <button
              type='button'
              onClick={() =>
                handleCopy('example-model', DOCS_EXAMPLE_MODEL.modelId)
              }
              className='inline-flex items-center gap-1.5 rounded-md border border-[#0F172A]/10 bg-[#F8FAFC] px-2 py-0.5 font-mono text-[11.5px] font-semibold text-blue-600 transition-colors hover:border-blue-600/35 dark:border-white/10 dark:bg-zinc-800 dark:text-blue-400'
            >
              <span>{DOCS_EXAMPLE_MODEL.modelId}</span>
              {copiedKey === 'example-model' ? (
                <Check className='size-3 text-emerald-500' />
              ) : (
                <Copy className='size-3 text-[#64748B]' />
              )}
            </button>
            <span className='text-[12px] text-[#64748B] dark:text-zinc-400'>
              {t('as an example, one token accesses all models by identifier')}
            </span>
          </div>

          <div className='flex items-center gap-3'>
            <Link
              to='/pricing'
              className='inline-flex items-center gap-1 text-[12px] font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400'
            >
              <span>{t('View all models in Model Hub')}</span>
              <ArrowUpRight className='size-3.5' />
            </Link>

            <button
              type='button'
              onClick={() => handleCopy('quick-curl', quickCurlCommand)}
              className='inline-flex items-center gap-1 rounded-md border border-[#0F172A]/10 bg-[#F8FAFC] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0F172A] transition-colors hover:bg-[#0F172A] hover:text-white dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-white dark:hover:text-[#0F172A]'
            >
              {copiedKey === 'quick-curl' ? (
                <>
                  <Check className='size-3 text-emerald-500' />
                  <span>{t('Command Copied')}</span>
                </>
              ) : (
                <>
                  <Copy className='size-3' />
                  <span>{t('Copy cURL')}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <pre className='overflow-x-auto p-4 font-mono text-[12px] leading-[1.68] text-[#1E293B] dark:text-sky-200'>
          <code>{quickCurlCommand}</code>
        </pre>
      </div>
    </section>
  )
}
