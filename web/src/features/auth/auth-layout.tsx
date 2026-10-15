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
import { useTranslation } from 'react-i18next'

import { Logo } from '@/assets/logo'
import { Skeleton } from '@/components/ui/skeleton'
import { useSystemConfig } from '@/hooks/use-system-config'
import { DEFAULT_LOGO, DEFAULT_SYSTEM_NAME } from '@/lib/constants'

type AuthLayoutProps = {
  children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  const { t } = useTranslation()
  const { systemName, logo, loading } = useSystemConfig()
  const displayName = systemName || DEFAULT_SYSTEM_NAME
  const isDefaultLogo = !logo || logo === DEFAULT_LOGO

  let logoBadge: React.ReactNode = (
    <img
      src={logo}
      alt={t('Logo')}
      className='h-8 w-8 rounded-full object-cover'
    />
  )
  if (loading) {
    logoBadge = <Skeleton className='absolute inset-0 rounded-full' />
  } else if (isDefaultLogo) {
    logoBadge = <Logo className='text-foreground size-7' />
  }

  return (
    <div className='relative grid h-svh max-w-none'>
      <Link
        to='/'
        className='absolute top-5 left-5 z-10 flex items-center gap-3 transition-opacity hover:opacity-80 sm:top-8 sm:left-8'
      >
        <div className='relative flex h-8 w-8 items-center justify-center'>
          {logoBadge}
        </div>
        {loading ? (
          <Skeleton className='h-6 w-24' />
        ) : (
          <div className='flex flex-col leading-none'>
            <span className='font-serif text-base font-normal tracking-[0.18em]'>
              {displayName}
            </span>
            <span className='text-muted-foreground/70 mt-1 font-mono text-[9.5px] tracking-[0.06em]'>
              api.mihouo.com
            </span>
          </div>
        )}
      </Link>
      <div className='container flex items-center pt-16 sm:pt-0'>
        <div className='mx-auto flex w-full flex-col justify-center space-y-2 px-4 py-8 sm:w-[480px] sm:p-8'>
          {children}
        </div>
      </div>
    </div>
  )
}
