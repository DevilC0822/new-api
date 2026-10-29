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
import { Compass } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { DOCS_SECTIONS } from '../constants'
import type { DocsSectionId } from '../types'

interface DocsSidebarProps {
  activeSectionId: DocsSectionId
  onSelectSection: (sectionId: DocsSectionId) => void
}

export function DocsSidebar(props: DocsSidebarProps) {
  const { t } = useTranslation()

  return (
    <>
      {/* Mobile / Tablet Horizontal Quick Navigation Strip */}
      <nav
        aria-label={t('Quick switch docs section')}
        className='no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-1 lg:hidden'
      >
        {DOCS_SECTIONS.map((section) => {
          const isActive = props.activeSectionId === section.id
          return (
            <button
              key={section.id}
              type='button'
              onClick={() => props.onSelectSection(section.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-semibold transition-all',
                isActive
                  ? 'border-[#0F172A] bg-[#0F172A] text-white dark:border-white dark:bg-white dark:text-[#0F172A]'
                  : 'border-[#0F172A]/[0.08] bg-white text-[#64748B] hover:text-[#0F172A] dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-400'
              )}
            >
              <span className='font-mono text-[10.5px] opacity-75'>
                {section.number}
              </span>
              <span>{t(section.title)}</span>
            </button>
          )
        })}
      </nav>

      {/* Desktop Left Sticky Navigation Sidebar */}
      <aside
        aria-label={t('Docs navigation')}
        className='hidden lg:col-span-3 lg:block'
      >
        <div className='sticky top-24 overflow-hidden rounded-[22px] border border-[#0F172A]/[0.08] bg-white p-4 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-zinc-900'>
          <div className='mb-3 flex items-center gap-2 border-b border-[#0F172A]/[0.07] px-2 pb-3 dark:border-white/10'>
            <Compass className='size-3.5 text-blue-600 dark:text-blue-400' />
            <span className='text-[12.5px] font-bold tracking-[0.04em] text-[#0F172A] dark:text-white'>
              {t('Table of Contents')}
            </span>
          </div>

          <ul className='space-y-1'>
            {DOCS_SECTIONS.map((section) => {
              const isActive = props.activeSectionId === section.id
              return (
                <li key={section.id}>
                  <button
                    type='button'
                    onClick={() => props.onSelectSection(section.id)}
                    className={cn(
                      'group flex w-full flex-col rounded-[14px] px-3 py-2.5 text-left transition-all duration-150',
                      isActive
                        ? 'bg-[#0F172A] text-white shadow-xs dark:bg-white dark:text-[#0F172A]'
                        : 'text-[#475569] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                    )}
                  >
                    <div className='flex w-full items-center justify-between gap-2'>
                      <span className='flex items-center gap-2 text-[13px] font-bold'>
                        <span
                          className={cn(
                            'font-mono text-[10.5px]',
                            isActive
                              ? 'text-sky-300 dark:text-blue-600'
                              : 'text-[#94A3B8]'
                          )}
                        >
                          {section.number}
                        </span>
                        <span>{t(section.title)}</span>
                      </span>
                      <span
                        className={cn(
                          'size-1.5 shrink-0 rounded-full transition-opacity',
                          isActive
                            ? 'bg-sky-400 opacity-100 dark:bg-blue-600'
                            : 'bg-[#0F172A]/30 opacity-0 group-hover:opacity-60'
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        'mt-0.5 pl-6 text-[11px]',
                        isActive
                          ? 'text-zinc-300 dark:text-zinc-600'
                          : 'text-[#94A3B8]'
                      )}
                    >
                      {t(section.subtitle)}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </aside>
    </>
  )
}
