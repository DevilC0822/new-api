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

import { AnimateInView } from '@/components/animate-in-view'
import { Button } from '@/components/ui/button'

interface CTAProps {
  className?: string
  isAuthenticated?: boolean
}

export function CTA(props: CTAProps) {
  const { t } = useTranslation()

  if (props.isAuthenticated) {
    return null
  }

  return (
    <section className='relative z-10 py-14 md:py-20'>
      <div className='mx-auto max-w-[1280px] px-6 md:px-12'>
        <AnimateInView
          className='border-white bg-card rounded-[24px] border px-6 py-14 text-center shadow-[0_24px_54px_-14px_rgba(20,20,18,0.06)] md:px-16 md:py-20 dark:border-white/10'
          animation='scale-in'
        >
          <p className='text-muted-foreground mb-3.5 text-xs tracking-[0.18em]'>
            MIHOUO · API.MIHOUO.COM
          </p>
          <h2 className='font-serif text-2xl leading-[1.2] font-normal tracking-tight md:text-4xl'>
            {t('Ready to simplify')}
            <br />
            <span className='text-muted-foreground'>
              {t('your AI integration?')}
            </span>
          </h2>
          <p className='text-muted-foreground mx-auto mt-4 max-w-lg text-[14.5px] leading-[1.7]'>
            {t(
              'Deploy your own gateway and start routing requests through your configured upstream services.'
            )}
          </p>
          <div className='mt-8 flex flex-wrap items-center justify-center gap-3.5'>
            <Button
              className='group h-11 rounded-full px-7 text-sm font-medium'
              render={<Link to='/sign-up' />}
            >
              {t('Get Started')}
              <ArrowRight className='ml-1.5 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
            </Button>
            <Button
              variant='outline'
              className='border-border hover:border-foreground/40 hover:bg-muted/40 h-11 rounded-full px-6 text-sm font-medium'
              render={<Link to='/pricing' />}
            >
              {t('查看模型费率')}
            </Button>
          </div>
        </AnimateInView>
      </div>
    </section>
  )
}
