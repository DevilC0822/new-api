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
import { useCallback, useEffect, useMemo, useState } from 'react'

import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { PageTransition } from '@/components/page-transition'
import { useStatus } from '@/hooks/use-status'
import { DEFAULT_GATEWAY_ORIGIN } from '@/lib/constants'
import { useAuthStore } from '@/stores/auth-store'

import {
  ApiReferenceSection,
  BillingAndOpsSection,
  ClientGuidesSection,
  DocsHero,
  DocsSidebar,
  QuickstartSection,
} from './components'
import { DOCS_SECTIONS } from './constants'
import type { DocsProtocolSpec, DocsSectionId } from './types'

export function Docs() {
  const { status } = useStatus()
  const user = useAuthStore((s) => s.auth.user)
  const isAuthenticated = Boolean(user)

  const [activeSectionId, setActiveSectionId] =
    useState<DocsSectionId>('base-url-matrix')
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

  const handleJumpToSection = useCallback((sectionId: DocsSectionId) => {
    setActiveSectionId(sectionId)

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
      <PageTransition className='min-h-svh bg-[#FBFBFD] text-[#0F172A] dark:bg-zinc-950 dark:text-zinc-100'>
        <DocsHero isAuthenticated={isAuthenticated} />

        <div className='mx-auto max-w-[1280px] px-6 py-10 md:px-10 md:py-12'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
            <DocsSidebar
              activeSectionId={activeSectionId}
              onSelectSection={handleJumpToSection}
            />

            <main className='min-w-0 space-y-8 lg:col-span-9'>
              <QuickstartSection gatewayOrigin={gatewayOrigin} />

              <ClientGuidesSection gatewayOrigin={gatewayOrigin} />

              <ApiReferenceSection
                gatewayOrigin={gatewayOrigin}
                activeProtocolId={activeProtocolId}
                onProtocolChange={setActiveProtocolId}
              />

              <BillingAndOpsSection />
            </main>
          </div>
        </div>

        <Footer slim />
      </PageTransition>
    </PublicLayout>
  )
}
