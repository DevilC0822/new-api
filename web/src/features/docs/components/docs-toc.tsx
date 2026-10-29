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
import { ArrowRight, Check, Copy, ListTree, Terminal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

import { DOCS_SECTIONS } from '../constants'
import type { DocsSectionId } from '../types'

interface DocsTocProps {
  activeSectionId: DocsSectionId
  visibleSectionIds: Set<DocsSectionId>
  gatewayOrigin: string
  isAuthenticated: boolean
  onSelectSection: (sectionId: DocsSectionId) => void
}

export function DocsToc(props: DocsTocProps) {
  const { t } = useTranslation()
  const { copyToClipboard } = useCopyToClipboard()
  const [copiedProbe, setCopiedProbe] = useState(false)

  const probeCommand = `curl ${props.gatewayOrigin}/v1/models \\\n  -H "Authorization: Bearer $API_KEY"`

  const handleCopyProbe = async () => {
    const ok = await copyToClipboard(probeCommand)
    if (ok) {
      setCopiedProbe(true)
      window.setTimeout(() => setCopiedProbe(false), 1800)
    }
  }

  return (
    <aside
      aria-label={t('Table of Contents')}
      className='hidden xl:col-span-2 xl:block'
    >
      <div className='sticky top-24 space-y-5'>
        {/* On This Page TOC */}
        <div className='border-border bg-card/85 rounded-[18px] border p-4 shadow-[0_12px_28px_-12px_rgba(20,20,18,0.04)]'>
          <div className='border-border/70 mb-3 flex items-center gap-2 border-b pb-2.5'>
            <ListTree className='text-muted-foreground size-3.5' />
            <span className='text-foreground text-[11.5px] font-semibold tracking-[0.06em]'>
              {t('On This Page')}
            </span>
          </div>

          <ul className='border-border/80 space-y-1 border-l pl-3'>
            {DOCS_SECTIONS.map((section) => {
              const isActive = props.activeSectionId === section.id
              const isVisible = props.visibleSectionIds.has(section.id)

              return (
                <li key={section.id}>
                  <button
                    type='button'
                    onClick={() => props.onSelectSection(section.id)}
                    className={cn(
                      'block w-full truncate py-1 text-left text-[12px] transition-colors',
                      isActive
                        ? 'text-foreground font-semibold'
                        : 'text-muted-foreground hover:text-foreground',
                      !isVisible && 'opacity-40'
                    )}
                    title={t(section.title)}
                  >
                    <span className='mr-1.5 font-mono text-[10px] opacity-70'>
                      {section.number}
                    </span>
                    <span>{t(section.title)}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Quick cURL Connectivity Probe Card */}
        <div className='border-border overflow-hidden rounded-[18px] border bg-[#161615] p-4 text-[#F4F3EE]'>
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-1.5 font-mono text-[11px] text-zinc-300'>
              <Terminal className='size-3.5 text-amber-200/80' />
              <span>{t('Connectivity Probe')}</span>
            </div>
            <button
              type='button'
              onClick={handleCopyProbe}
              className='inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-zinc-200 transition-colors hover:bg-white/15'
            >
              {copiedProbe ? (
                <>
                  <Check className='size-2.5' />
                  <span>{t('Copied')}</span>
                </>
              ) : (
                <>
                  <Copy className='size-2.5' />
                  <span>{t('Copy')}</span>
                </>
              )}
            </button>
          </div>
          <pre className='mt-2.5 overflow-x-auto font-mono text-[10.5px] leading-[1.6] text-zinc-300'>
            <code>{probeCommand}</code>
          </pre>
          <p className='mt-2 text-[10.5px] leading-[1.5] text-zinc-400'>
            {t(
              'Returning a models JSON list indicates your key and direct connection are working.'
            )}
          </p>
        </div>

        {/* Quick Action CTA */}
        <div className='bg-card rounded-[18px] border border-white p-4 shadow-[0_12px_28px_-12px_rgba(20,20,18,0.05)] dark:border-white/10'>
          <div className='font-serif text-[14px] text-[#141413] dark:text-white'>
            {t('Start Coding Now')}
          </div>
          <p className='text-muted-foreground mt-1 text-[11.5px] leading-[1.55]'>
            {t(
              'Create sub-tokens, configure model permissions, and connect to Claude Code and Codex in minutes.'
            )}
          </p>
          <Link
            to={props.isAuthenticated ? '/keys' : '/sign-up'}
            className='mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-[#141413] px-3.5 py-2 text-[12px] font-medium text-white transition-colors hover:bg-[#272725] dark:bg-white dark:text-[#141413]'
          >
            <span>
              {props.isAuthenticated
                ? t('Go to Key Management')
                : t('Sign Up for Free')}
            </span>
            <ArrowRight className='size-3' />
          </Link>
        </div>
      </div>
    </aside>
  )
}
