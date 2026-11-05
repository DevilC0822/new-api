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
import { ArrowRight, KeyRound, Layers } from 'lucide-react'
import { useTranslation } from 'react-i18next'

interface DocsHeroProps {
  isAuthenticated: boolean
}

export function DocsHero(props: DocsHeroProps) {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 border-b border-[#0F172A]/[0.08] pt-24 pb-8 md:pt-28 md:pb-10 dark:border-white/10'>
      <div className='mx-auto flex max-w-[1280px] flex-col justify-between gap-6 px-6 md:flex-row md:items-end md:px-10'>
        <div>
          <h1 className='text-[clamp(1.75rem,2.8vw,2.35rem)] leading-[1.18] font-extrabold tracking-[-0.03em] text-[#0F172A] dark:text-white'>
            {t('Integration Docs')}
          </h1>

          <p className='mt-2 max-w-xl text-[14px] leading-[1.65] text-[#64748B] dark:text-zinc-400'>
            {t(
              'Standard dual-protocol compatibility for Anthropic and OpenAI. Configure your gateway endpoint and API key to call directly from CLI, IDE, and official SDKs.'
            )}
          </p>
        </div>

        <div className='flex flex-wrap items-center gap-2.5'>
          <Link
            to='/pricing'
            className='inline-flex items-center gap-1.5 rounded-full border border-[#0F172A]/12 bg-white px-4 py-2 text-[12.5px] font-semibold text-[#0F172A] shadow-2xs transition-colors hover:border-blue-600/35 hover:text-blue-600 dark:border-white/15 dark:bg-zinc-900 dark:text-white dark:hover:border-blue-400/40 dark:hover:text-blue-400'
          >
            <Layers className='size-3.5 text-blue-600 dark:text-blue-400' />
            <span>{t('Browse Model Square')}</span>
          </Link>

          <Link
            to={props.isAuthenticated ? '/keys' : '/sign-in'}
            className='inline-flex items-center gap-1.5 rounded-full bg-[#0F172A] px-4 py-2 text-[12.5px] font-semibold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-[#0F172A]'
          >
            <KeyRound className='size-3.5' />
            <span>
              {props.isAuthenticated ? t('Manage API Keys') : t('Get API Key')}
            </span>
            <ArrowRight className='size-3.5' />
          </Link>
        </div>
      </div>
    </section>
  )
}
