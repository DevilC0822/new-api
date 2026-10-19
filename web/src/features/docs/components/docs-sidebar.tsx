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
import { ArrowUpRight, Compass, KeyRound, Layers, Terminal } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { cn } from '@/lib/utils'

import { DOCS_CATEGORIES, DOCS_SECTIONS } from '../constants'
import type { DocsSectionId, DocsSectionMeta } from '../types'

interface DocsSidebarProps {
  activeSectionId: DocsSectionId
  visibleSectionIds: Set<DocsSectionId>
  onSelectSection: (sectionId: DocsSectionId) => void
}

const SECTION_MAP = new Map<DocsSectionId, DocsSectionMeta>(
  DOCS_SECTIONS.map((s) => [s.id, s])
)

export function DocsSidebar(props: DocsSidebarProps) {
  const { t } = useTranslation()

  return (
    <>
      {/* Mobile / Tablet Horizontal Quick Navigation Strip */}
      <nav
        aria-label='文档章节快速切换'
        className='no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto pb-1 lg:hidden'
      >
        {DOCS_SECTIONS.map((section) => {
          const isActive = props.activeSectionId === section.id
          const isVisible = props.visibleSectionIds.has(section.id)
          return (
            <button
              key={section.id}
              type='button'
              onClick={() => props.onSelectSection(section.id)}
              className={cn(
                'inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12.5px] font-medium transition-all',
                isActive
                  ? 'border-[#141413] bg-[#141413] text-white dark:border-white dark:bg-white dark:text-[#141413]'
                  : 'border-border bg-card text-muted-foreground hover:text-foreground',
                !isVisible && 'opacity-45'
              )}
            >
              <span className='font-mono text-[10.5px] opacity-75'>
                {section.number}
              </span>
              <span>{section.title}</span>
            </button>
          )
        })}
      </nav>

      {/* Desktop Left Sticky Category Navigation Sidebar */}
      <aside
        aria-label='文档分类导航'
        className='hidden lg:col-span-3 lg:block'
      >
        <div className='sticky top-24 space-y-5'>
          <div className='bg-card overflow-hidden rounded-[20px] border border-white p-5 shadow-[0_18px_40px_-14px_rgba(20,20,18,0.055)] dark:border-white/10'>
            <div className='border-border/80 mb-4 flex items-center justify-between border-b pb-3'>
              <div className='flex items-center gap-2'>
                <Compass className='text-foreground size-3.5' />
                <span className='text-foreground text-xs font-semibold tracking-[0.08em]'>
                  文档目录导航
                </span>
              </div>
              <span className='text-muted-foreground font-mono text-[10.5px]'>
                v2026.10
              </span>
            </div>

            <div className='space-y-5'>
              {DOCS_CATEGORIES.map((category) => (
                <div key={category.id}>
                  <div className='mb-2 flex items-center justify-between px-2'>
                    <span className='text-muted-foreground text-[11px] font-semibold tracking-[0.06em] uppercase'>
                      {category.label}
                    </span>
                    <span className='text-muted-foreground/70 font-mono text-[10px]'>
                      {category.badge}
                    </span>
                  </div>

                  <ul className='space-y-1'>
                    {category.sections.map((sectionId) => {
                      const section = SECTION_MAP.get(sectionId)
                      if (!section) return null
                      const isActive = props.activeSectionId === section.id
                      const isVisible = props.visibleSectionIds.has(section.id)

                      return (
                        <li key={section.id}>
                          <button
                            type='button'
                            onClick={() => props.onSelectSection(section.id)}
                            className={cn(
                              'group flex w-full items-center justify-between gap-2 rounded-[11px] px-3 py-2 text-left text-[13px] transition-all duration-150',
                              isActive
                                ? 'bg-[#141413] font-medium text-white shadow-xs dark:bg-white dark:text-[#141413]'
                                : 'text-[#52524E] hover:bg-[#F8F7F3] hover:text-[#141413] dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100',
                              !isVisible && 'opacity-45'
                            )}
                          >
                            <span className='flex min-w-0 items-center gap-2'>
                              <span
                                className={cn(
                                  'font-mono text-[10.5px]',
                                  isActive
                                    ? 'text-white/75 dark:text-[#141413]/70'
                                    : 'text-muted-foreground'
                                )}
                              >
                                {section.number}
                              </span>
                              <span className='truncate'>{section.title}</span>
                            </span>
                            <span
                              className={cn(
                                'size-1.5 shrink-0 rounded-full transition-opacity',
                                isActive
                                  ? 'bg-white opacity-100 dark:bg-[#141413]'
                                  : 'bg-foreground/30 opacity-0 group-hover:opacity-60'
                              )}
                            />
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Console Shortcuts Card */}
          <div className='border-border rounded-[18px] border bg-[#F8F7F3] p-4 dark:bg-zinc-900/70'>
            <div className='text-foreground mb-2.5 text-xs font-semibold tracking-wide'>
              控制台快捷入口
            </div>
            <div className='space-y-1.5'>
              <Link
                to='/keys'
                className='border-border/70 bg-card hover:border-foreground/30 flex items-center justify-between rounded-[11px] border px-3 py-2 text-[12.5px] font-medium transition-colors'
              >
                <span className='flex items-center gap-2'>
                  <KeyRound className='text-muted-foreground size-3.5' />
                  <span>{t('API Keys')}</span>
                </span>
                <ArrowUpRight className='text-muted-foreground size-3.5' />
              </Link>
              <Link
                to='/pricing'
                className='border-border/70 bg-card hover:border-foreground/30 flex items-center justify-between rounded-[11px] border px-3 py-2 text-[12.5px] font-medium transition-colors'
              >
                <span className='flex items-center gap-2'>
                  <Layers className='text-muted-foreground size-3.5' />
                  <span>{t('Model Square')}</span>
                </span>
                <ArrowUpRight className='text-muted-foreground size-3.5' />
              </Link>
              <Link
                to='/playground'
                className='border-border/70 bg-card hover:border-foreground/30 flex items-center justify-between rounded-[11px] border px-3 py-2 text-[12.5px] font-medium transition-colors'
              >
                <span className='flex items-center gap-2'>
                  <Terminal className='text-muted-foreground size-3.5' />
                  <span>{t('Playground')}</span>
                </span>
                <ArrowUpRight className='text-muted-foreground size-3.5' />
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
