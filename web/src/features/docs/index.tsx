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

import { SearchX } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'

import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { PageTransition } from '@/components/page-transition'
import { Button } from '@/components/ui/button'
import { useStatus } from '@/hooks/use-status'
import { DEFAULT_GATEWAY_ORIGIN } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'

import {
  ApiReferenceSection,
  BillingAndOpsSection,
  ClientGuidesSection,
  DocsHero,
  DocsSidebar,
  DocsToc,
  QuickstartSection,
} from './components'
import { DOCS_SECTIONS } from './constants'
import type { DocsProtocolSpec, DocsSectionId } from './types'

export function Docs() {
  const { status } = useStatus()
  const user = useAuthStore((s) => s.auth.user)
  const isAuthenticated = Boolean(user)

  const [searchQuery, setSearchQuery] = useState('')
  const [activeSectionId, setActiveSectionId] =
    useState<DocsSectionId>('overview')
  const [activeProtocolId, setActiveProtocolId] =
    useState<DocsProtocolSpec['id']>('messages')

  const gatewayOrigin = useMemo(() => {
    const statusRecord = status as Record<string, unknown> | null
    const nestedData = statusRecord?.data as Record<string, unknown> | undefined
    const candidate =
      statusRecord?.server_address ??
      statusRecord?.serverAddress ??
      nestedData?.server_address ??
      nestedData?.serverAddress
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim().replace(/\/+$/, '')
    }
    return DEFAULT_GATEWAY_ORIGIN
  }, [status])

  const visibleSectionIds = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      return new Set<DocsSectionId>(DOCS_SECTIONS.map((s) => s.id))
    }

    const matched = new Set<DocsSectionId>()
    for (const section of DOCS_SECTIONS) {
      const haystack = [section.title, section.subtitle, ...section.keywords]
        .join(' ')
        .toLowerCase()

      if (haystack.includes(query)) {
        matched.add(section.id)
      }
    }
    return matched
  }, [searchQuery])

  const handleJumpToSection = useCallback((sectionId: DocsSectionId) => {
    setActiveSectionId(sectionId)
    setSearchQuery((prev) => {
      if (!prev.trim()) return prev
      return ''
    })

    window.requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(`#${sectionId}`)
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    })
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const scrollOffset = 150
      let current: DocsSectionId | null = null

      for (const section of DOCS_SECTIONS) {
        const el = document.querySelector<HTMLElement>(`#${section.id}`)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= scrollOffset) {
          current = section.id
        }
      }

      if (current) {
        setActiveSectionId(current)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <PublicLayout showMainContainer={false}>
      <PageTransition className='min-h-svh bg-[#f3f2ed] dark:bg-zinc-950'>
        <DocsHero
          gatewayOrigin={gatewayOrigin}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          matchedSectionCount={visibleSectionIds.size}
          totalSectionCount={DOCS_SECTIONS.length}
          isAuthenticated={isAuthenticated}
          onSelectProtocol={setActiveProtocolId}
          onJumpToSection={handleJumpToSection}
        />

        <div className='mx-auto max-w-[1380px] px-6 py-10 md:px-10 md:py-14'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
            <DocsSidebar
              activeSectionId={activeSectionId}
              visibleSectionIds={visibleSectionIds}
              onSelectSection={handleJumpToSection}
            />

            <main className='min-w-0 space-y-8 lg:col-span-9 xl:col-span-7'>
              {visibleSectionIds.size === 0 ? (
                <div className='bg-card flex flex-col items-center justify-center rounded-[22px] border border-white px-6 py-16 text-center shadow-[0_20px_44px_-14px_rgba(20,20,18,0.06)] dark:border-white/10'>
                  <span className='border-border inline-flex size-12 items-center justify-center rounded-full border bg-[#F8F7F3] dark:bg-zinc-800'>
                    <SearchX className='text-muted-foreground size-5' />
                  </span>
                  <h2 className='mt-4 font-serif text-xl font-normal'>
                    未找到匹配的文档章节
                  </h2>
                  <p className='text-muted-foreground mt-1.5 max-w-md text-[13px] leading-[1.6]'>
                    没有找到与「{searchQuery.trim()}
                    」直接匹配的章节，请尝试搜索 Claude
                    Code、Codex、Responses、Base URL 或 429。
                  </p>
                  <Button
                    type='button'
                    variant='outline'
                    onClick={() => setSearchQuery('')}
                    className='mt-5 rounded-full px-5 text-xs'
                  >
                    重置搜索并查看全部章节
                  </Button>
                </div>
              ) : (
                <>
                  <QuickstartSection
                    gatewayOrigin={gatewayOrigin}
                    visibleSectionIds={visibleSectionIds}
                    isAuthenticated={isAuthenticated}
                  />

                  <ClientGuidesSection
                    gatewayOrigin={gatewayOrigin}
                    visible={visibleSectionIds.has('client-workbench')}
                  />

                  <ApiReferenceSection
                    gatewayOrigin={gatewayOrigin}
                    visible={visibleSectionIds.has('protocol-workbench')}
                    activeProtocolId={activeProtocolId}
                    onProtocolChange={setActiveProtocolId}
                  />

                  <BillingAndOpsSection visibleSectionIds={visibleSectionIds} />
                </>
              )}
            </main>

            <DocsToc
              activeSectionId={activeSectionId}
              visibleSectionIds={visibleSectionIds}
              gatewayOrigin={gatewayOrigin}
              isAuthenticated={isAuthenticated}
              onSelectSection={handleJumpToSection}
            />
          </div>
        </div>

        <Footer />
      </PageTransition>
    </PublicLayout>
  )
}
