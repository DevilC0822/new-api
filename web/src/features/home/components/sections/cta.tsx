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
import { ArrowRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { Logo } from '@/assets/logo'
import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'
import { useSystemConfig } from '@/hooks/use-system-config'
import { DEFAULT_SYSTEM_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

export interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()
  const { systemName } = useSystemConfig()
  const displayName = systemName || DEFAULT_SYSTEM_NAME

  return (
    <section className={cn('relative z-10 pt-5 pb-16', props.className)}>
      <div className='mx-auto max-w-[1220px] px-6'>
        <AnimateInView
          animation='scale-in'
          className='relative overflow-hidden rounded-[30px] border border-[#0F172A]/[0.08] bg-[radial-gradient(ellipse_65%_70%_at_50%_0%,rgba(37,99,235,0.08),transparent_70%),linear-gradient(180deg,#FFFFFF_0%,#F8FAFC_100%)] px-8 py-14 text-center shadow-[0_24px_60px_-24px_rgba(15,23,42,0.06),inset_0_1px_0_#FFFFFF] dark:border-white/10 dark:bg-zinc-900 dark:bg-none'
        >
          {/* Subtle Architectural Grid Backdrop */}
          <div
            aria-hidden='true'
            className='pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(15,23,42,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.03)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,black_20%,transparent_85%)] bg-[size:40px_40px] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]'
          />

          <div className='relative z-10 flex flex-col items-center'>
            {/* Floating Optical Brand Emblem */}
            <div className='mb-4 flex size-13 items-center justify-center rounded-[16px] border border-white/20 bg-[#0B0F19] shadow-[0_14px_30px_-8px_rgba(37,99,235,0.35),inset_0_1px_0_rgba(255,255,255,0.2)]'>
              <Logo className='size-7.5' />
            </div>

            <h2 className='mb-3 text-[clamp(1.75rem,2.6vw,2.35rem)] leading-[1.2] font-extrabold tracking-[-0.025em] text-[#0F172A] dark:text-white'>
              {t('Start Using {{name}} Today', { name: displayName })}
            </h2>
            <p className='mx-auto mb-7 max-w-[520px] text-[15px] leading-[1.68] text-[#64748B] dark:text-zinc-400'>
              {t('Alipay top-up · Pay-as-you-go · No minimum spend')}
            </p>

            <div className='flex flex-wrap items-center justify-center gap-3'>
              <Button
                className='group h-11 rounded-full border border-[#0F172A] bg-[#0F172A] px-8 text-[14px] font-semibold text-white shadow-[0_8px_20px_-4px_rgba(15,23,42,0.22)] transition-all hover:-translate-y-px hover:bg-[#1E293B] dark:border-white dark:bg-white dark:text-[#0F172A]'
                render={
                  <Link
                    to={props.isAuthenticated ? '/dashboard' : '/sign-up'}
                  />
                }
              >
                <span>
                  {props.isAuthenticated ? t('Go to Dashboard') : t('Sign up')}
                </span>
                <ArrowRight className='ml-1.5 size-4 transition-transform duration-200 group-hover:translate-x-0.5' />
              </Button>
            </div>
          </div>
        </AnimateInView>
      </div>
    </section>
  )
}
