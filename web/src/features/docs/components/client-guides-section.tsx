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
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

import { DOCS_CLIENT_GUIDES } from '../constants'

interface ClientGuidesSectionProps {
  gatewayOrigin: string
}

export function ClientGuidesSection(props: ClientGuidesSectionProps) {
  const { t } = useTranslation()
  const { copyToClipboard } = useCopyToClipboard()
  const [activeClientId, setActiveClientId] = useState<string>('claude-code')
  const [configTab, setConfigTab] = useState<'env' | 'config'>('env')
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const activeClient =
    DOCS_CLIENT_GUIDES.find((c) => c.id === activeClientId) ??
    DOCS_CLIENT_GUIDES[0]

  const clientBaseUrl = `${props.gatewayOrigin}${activeClient.baseUrlSuffix}`
  const activeConfigCode =
    configTab === 'env'
      ? activeClient.buildEnvCode(props.gatewayOrigin)
      : activeClient.buildConfigCode(props.gatewayOrigin)
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
      className='scroll-mt-24 rounded-[24px] border border-[#0F172A]/[0.08] bg-white p-6 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] md:p-8 dark:border-white/10 dark:bg-zinc-900'
    >
      {/* Section Header */}
      <div className='flex items-baseline gap-2.5 border-b border-[#0F172A]/[0.07] pb-4 dark:border-white/10'>
        <span className='rounded-md bg-blue-600/10 px-2 py-0.5 font-mono text-[12px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'>
          02
        </span>
        <h2 className='text-[20px] font-bold tracking-[-0.02em] text-[#0F172A] md:text-[22px] dark:text-white'>
          {t('Client Configuration')}
        </h2>
      </div>

      {/* Horizontal Client Tabs */}
      <div
        className='mt-5 flex flex-wrap gap-2'
        role='tablist'
        aria-label={t('Client configuration list')}
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
                'inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-[13px] font-bold transition-all',
                isSelected
                  ? 'border-blue-600/35 bg-blue-600/[0.06] text-blue-600 shadow-2xs dark:border-blue-400/40 dark:bg-blue-500/15 dark:text-blue-400'
                  : 'border-[#0F172A]/[0.08] bg-[#F8FAFC] text-[#475569] hover:border-[#0F172A]/15 hover:text-[#0F172A] dark:border-white/10 dark:bg-zinc-950/60 dark:text-zinc-400 dark:hover:text-white'
              )}
            >
              <span>{client.name}</span>
              <span
                className={cn(
                  'rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold',
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-[#E2E8F0]/80 text-[#64748B] dark:bg-zinc-800 dark:text-zinc-400'
                )}
              >
                {t(client.tag)}
              </span>
            </button>
          )
        })}
      </div>

      {/* Compact Client Summary Strip */}
      <div className='mt-4 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#0F172A]/[0.07] bg-[#F8FAFC] px-4 py-3 dark:border-white/10 dark:bg-zinc-950/60'>
        <div className='min-w-0 space-y-0.5'>
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-[12px] font-semibold text-[#64748B] dark:text-zinc-400'>
              {t('Endpoint URL')}:
            </span>
            <code className='font-mono text-[12.5px] font-bold text-[#0F172A] dark:text-white'>
              {clientBaseUrl}
            </code>
            <button
              type='button'
              onClick={() => handleCopy('client-baseurl', clientBaseUrl)}
              className='inline-flex items-center gap-1 rounded border border-[#0F172A]/10 bg-white px-2 py-0.5 font-mono text-[10.5px] font-semibold text-[#334155] transition-colors hover:bg-[#0F172A] hover:text-white dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-white dark:hover:text-[#0F172A]'
            >
              {copiedKey === 'client-baseurl' ? (
                <>
                  <Check className='size-2.5 text-emerald-500' />
                  <span>{t('Copied')}</span>
                </>
              ) : (
                <>
                  <Copy className='size-2.5' />
                  <span>{t('Copy URL')}</span>
                </>
              )}
            </button>
          </div>
          <p className='text-[12px] text-[#64748B] dark:text-zinc-400'>
            {t(activeClient.baseUrlNote)}
          </p>
        </div>

        {/* Env vs Config File Switcher */}
        <div className='inline-flex shrink-0 rounded-lg border border-[#0F172A]/[0.08] bg-white p-0.5 dark:border-white/10 dark:bg-zinc-900'>
          <button
            type='button'
            onClick={() => setConfigTab('env')}
            className={cn(
              'rounded-md px-3 py-1 text-[11.5px] font-semibold transition-all',
              configTab === 'env'
                ? 'bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A]'
                : 'text-[#64748B] hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-white'
            )}
          >
            {t('Environment Variables')}
          </button>
          <button
            type='button'
            onClick={() => setConfigTab('config')}
            className={cn(
              'rounded-md px-3 py-1 text-[11.5px] font-semibold transition-all',
              configTab === 'config'
                ? 'bg-[#0F172A] text-white dark:bg-white dark:text-[#0F172A]'
                : 'text-[#64748B] hover:text-[#0F172A] dark:text-zinc-400 dark:hover:text-white'
            )}
          >
            {t('Config File')}
          </button>
        </div>
      </div>

      {/* Single Clean Config Code Panel */}
      <div className='mt-3 overflow-hidden rounded-[16px] border border-[#0F172A]/[0.08] bg-[#F8FAFC] dark:border-white/10 dark:bg-zinc-950'>
        <div className='flex items-center justify-between border-b border-[#0F172A]/[0.07] bg-white px-4 py-2.5 dark:border-white/10 dark:bg-zinc-900'>
          <span className='font-mono text-[11.5px] font-semibold text-[#475569] dark:text-zinc-300'>
            {t(activeConfigTitle)}
          </span>
          <button
            type='button'
            onClick={() => handleCopy('client-config', activeConfigCode)}
            className='inline-flex items-center gap-1 rounded-md border border-[#0F172A]/10 bg-[#F8FAFC] px-2.5 py-1 font-mono text-[11px] font-semibold text-[#0F172A] transition-colors hover:bg-[#0F172A] hover:text-white dark:border-white/15 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-white dark:hover:text-[#0F172A]'
          >
            {copiedKey === 'client-config' ? (
              <>
                <Check className='size-3 text-emerald-500' />
                <span>{t('Copied')}</span>
              </>
            ) : (
              <>
                <Copy className='size-3' />
                <span>{t('Copy Config')}</span>
              </>
            )}
          </button>
        </div>
        <pre className='overflow-x-auto p-4 font-mono text-[12px] leading-[1.68] text-[#1E293B] dark:text-sky-200'>
          <code>{activeConfigCode}</code>
        </pre>
      </div>
    </section>
  )
}
