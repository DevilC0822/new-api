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
import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import { ArrowRight, BookOpen, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { PageTransition } from '@/components/page-transition'
import { RichContent } from '@/components/rich-content'
import { Button } from '@/components/ui/button'
import { useSystemConfig } from '@/hooks/use-system-config'
import { DEFAULT_SYSTEM_NAME } from '@/lib/constants'
import { isHttpUrl, isLikelyHtml } from '@/lib/content-format'
import { requireServerSuccess } from '@/lib/server-error-message'
import { useAuthStore } from '@/stores/auth-store'

import { getAboutContent } from './api'

interface EngineeringPillar {
  title: string
  description: string
}

const ENGINEERING_PILLARS: EngineeringPillar[] = [
  {
    title: 'Native Dual-Protocol Fidelity',
    description:
      'Native handling for Anthropic /v1/messages and OpenAI-compatible formats. Full support for extended thinking, prompt caching segments, and multi-tool calls without lossy conversion.',
  },
  {
    title: 'Intelligent Routing & Failover',
    description:
      'Monitors upstream channel latency and health status in real time. Automatically retries alternate standby channels upon rate limits or upstream errors before streaming begins.',
  },
  {
    title: 'Transparent Billing & Zero Retention',
    description:
      'Settled accurately according to official usage tokens, with prompt cache read discounts passed through. Stateless streaming directly through memory with zero prompt persistence.',
  },
]

function MihouoAboutShowcase() {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()
  const rawName = systemName || DEFAULT_SYSTEM_NAME
  const displayName = (
    rawName === 'New API' ? DEFAULT_SYSTEM_NAME : rawName
  ).replaceAll('弥火', '觅火')

  const user = useAuthStore((s) => s.auth.user)
  const isAuthenticated = Boolean(user)

  const primaryCtaPath = isAuthenticated ? '/keys' : '/sign-up'
  const primaryCtaLabel = isAuthenticated
    ? t('Manage API Keys')
    : t('Get API Key')

  return (
    <div className='min-h-svh bg-[#FBFBFD] text-[#0F172A] dark:bg-zinc-950 dark:text-zinc-100'>
      {/* Hero: Manifesto & Core Metric Strip */}
      <section className='relative border-b border-[#0F172A]/[0.08] pt-24 pb-12 md:pt-28 md:pb-16 dark:border-white/10'>
        <div className='mx-auto max-w-[1280px] px-6 md:px-10'>
          <div className='max-w-4xl'>
            <h1 className='text-[clamp(2.1rem,3.8vw,3.2rem)] leading-[1.18] font-extrabold tracking-[-0.03em] text-balance text-[#0F172A] dark:text-white'>
              {t('Passing the Torch: Resilient AI Gateway Infrastructure')}
            </h1>

            <p className='mt-4 text-[14.5px] leading-[1.8] text-[#64748B] dark:text-zinc-300'>
              {t(
                '"As fuel is consumed, the fire is passed on, knowing no end." — {{name}} is dedicated to removing engineering friction in multi-model coordination and cross-regional routing. We unify mainstream global models behind standardized dual-protocol gateways with minimal latency, transparent billing, and zero prompt retention.',
                { name: displayName }
              )}
            </p>

            <div className='mt-7 flex flex-wrap items-center gap-3'>
              <Button
                className='h-10 rounded-full bg-[#0F172A] px-6 text-[13px] font-semibold text-white hover:opacity-90 dark:bg-white dark:text-[#0F172A]'
                render={<Link to={primaryCtaPath} />}
              >
                <span>{primaryCtaLabel}</span>
                <ArrowRight className='ml-1.5 size-3.5' />
              </Button>

              <Button
                variant='outline'
                className='h-10 rounded-full border-[#0F172A]/12 bg-white px-5 text-[13px] font-semibold text-[#0F172A] hover:border-blue-600/35 hover:text-blue-600 dark:border-white/15 dark:bg-zinc-900 dark:text-white dark:hover:border-blue-400/40 dark:hover:text-blue-400'
                render={<Link to='/docs' />}
              >
                <BookOpen className='mr-1.5 size-3.5 text-blue-600 dark:text-blue-400' />
                <span>{t('Documentation')}</span>
              </Button>

              <Button
                variant='outline'
                className='h-10 rounded-full border-[#0F172A]/12 bg-white px-5 text-[13px] font-semibold text-[#0F172A] hover:border-blue-600/35 hover:text-blue-600 dark:border-white/15 dark:bg-zinc-900 dark:text-white dark:hover:border-blue-400/40 dark:hover:text-blue-400'
                render={<Link to='/pricing' />}
              >
                <Layers className='mr-1.5 size-3.5 text-cyan-600 dark:text-cyan-400' />
                <span>{t('Browse Model Square')}</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: Three Engineering Pillars */}
      <section className='py-12 md:py-16'>
        <div className='mx-auto max-w-[1280px] px-6 md:px-10'>
          <div className='mb-8'>
            <h2 className='text-[22px] font-bold tracking-tight text-[#0F172A] md:text-[26px] dark:text-white'>
              {t('Core Engineering Principles')}
            </h2>
          </div>

          <div className='grid grid-cols-1 gap-5 md:grid-cols-3'>
            {ENGINEERING_PILLARS.map((pillar, idx) => (
              <AnimateInView
                key={pillar.title}
                delay={idx * 60}
                animation='fade-up'
                className='rounded-[20px] border border-[#0F172A]/[0.08] bg-white p-6 shadow-[0_12px_28px_-14px_rgba(15,23,42,0.05)] dark:border-white/10 dark:bg-zinc-900'
              >
                <h3 className='text-[17px] font-bold text-[#0F172A] dark:text-white'>
                  {t(pillar.title)}
                </h3>
                <p className='mt-2.5 text-[13px] leading-[1.7] text-[#64748B] dark:text-zinc-400'>
                  {t(pillar.description)}
                </p>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Section 02: Open Source Attribution & License */}
      <section className='border-t border-[#0F172A]/[0.08] py-12 md:py-16 dark:border-white/10'>
        <div className='mx-auto max-w-[1280px] px-6 md:px-10'>
          <div className='rounded-[22px] border border-[#0F172A]/[0.08] bg-white p-6 shadow-[0_14px_34px_-16px_rgba(15,23,42,0.05)] md:p-8 dark:border-white/10 dark:bg-zinc-900'>
            <div className='max-w-2xl'>
              <h3 className='text-[20px] font-bold text-[#0F172A] dark:text-white'>
                {t('Open Source Ecosystem & Attribution')}
              </h3>
              <p className='mt-2 text-[13px] leading-[1.7] text-[#64748B] dark:text-zinc-400'>
                {t(
                  '{{name}} architecture builds upon excellent open-source AI gateway engineering practices, licensed under AGPL v3.0, providing developers with a standardized and verifiable dual-protocol experience.',
                  { name: displayName }
                )}
              </p>

              <div className='mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-[#64748B] dark:text-zinc-400'>
                <div>
                  {t('Repository:')}{' '}
                  <a
                    href='https://github.com/QuantumNous/new-api'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-blue-600 underline-offset-4 hover:underline dark:text-blue-400'
                  >
                    github.com/QuantumNous/new-api
                  </a>
                </div>
                <span>·</span>
                <div>
                  {t('License:')}{' '}
                  <a
                    href='https://github.com/QuantumNous/new-api/blob/main/LICENSE'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-blue-600 underline-offset-4 hover:underline dark:text-blue-400'
                  >
                    AGPL v3.0 License
                  </a>
                </div>
                <span>·</span>
                <div>
                  {t('Foundational Tribute:')}{' '}
                  <a
                    href='https://github.com/songquanpeng/one-api'
                    target='_blank'
                    rel='noopener noreferrer'
                    className='font-semibold text-[#0F172A] hover:underline dark:text-white'
                  >
                    One API
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer slim />
    </div>
  )
}

export function About() {
  const { t } = useTranslation()
  const { data } = useQuery({
    queryKey: ['about-content'],
    queryFn: async () => requireServerSuccess(await getAboutContent()),
  })

  const rawContent = data?.data?.trim() ?? ''
  const hasContent = rawContent.length > 0
  const isUrl = hasContent && isHttpUrl(rawContent)
  const contentIsHtml = hasContent && isLikelyHtml(rawContent)

  if (!hasContent) {
    return (
      <PublicLayout showMainContainer={false}>
        <PageTransition>
          <MihouoAboutShowcase />
        </PageTransition>
      </PublicLayout>
    )
  }

  if (isUrl) {
    return (
      <PublicLayout showMainContainer={false}>
        <PageTransition>
          <iframe
            src={rawContent}
            className='h-[calc(100vh-3.5rem)] w-full border-0'
            title={t('About')}
            sandbox='allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts'
          />
        </PageTransition>
      </PublicLayout>
    )
  }

  if (contentIsHtml) {
    return (
      <PublicLayout showMainContainer={false}>
        <PageTransition>
          <RichContent
            mode='html'
            htmlVariant='isolated'
            content={rawContent}
            className='prose-neutral dark:prose-invert max-w-none'
          />
        </PageTransition>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <PageTransition className='mx-auto max-w-6xl px-4 py-8'>
        <RichContent
          mode='markdown'
          content={rawContent}
          className='prose-neutral dark:prose-invert max-w-none'
        />
      </PageTransition>
    </PublicLayout>
  )
}
