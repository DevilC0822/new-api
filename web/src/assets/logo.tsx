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
import { useId, type SVGProps } from 'react'

import { cn } from '@/lib/utils'

export function Logo(props: SVGProps<SVGSVGElement>) {
  const { className, ...rest } = props
  const uid = useId().replaceAll(':', '')
  const mainGradId = `mihouo-flame-main-${uid}`
  const wingGradId = `mihouo-flame-wing-${uid}`

  return (
    <svg
      id='newapi-logo'
      viewBox='0 0 64 64'
      xmlns='http://www.w3.org/2000/svg'
      height='36'
      width='36'
      fill='none'
      className={cn('size-9', className)}
      {...rest}
    >
      <title>MIHOUO · 觅火</title>
      <defs>
        <linearGradient
          id={mainGradId}
          x1='16'
          y1='56'
          x2='48'
          y2='8'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0%' stopColor='#1E40AF' />
          <stop offset='50%' stopColor='#2563EB' />
          <stop offset='100%' stopColor='#06B6D4' />
        </linearGradient>
        <linearGradient
          id={wingGradId}
          x1='12'
          y1='50'
          x2='34'
          y2='16'
          gradientUnits='userSpaceOnUse'
        >
          <stop offset='0%' stopColor='#3B82F6' />
          <stop offset='100%' stopColor='#38BDF8' />
        </linearGradient>
      </defs>
      <path
        d='M35.5 6C35.5 6 53 21.8 53 38.2C53 50.2 43.6 58 32 58C20.4 58 11 50.2 11 38.2C11 28.5 17.2 20.5 23.8 15.4C22.8 21.6 25.8 26 30.2 27.6C27.4 19.4 30.5 11.5 35.5 6Z'
        fill={`url(#${mainGradId})`}
      />
      <path
        d='M23.8 15.4C17.2 20.5 11 28.5 11 38.2C11 47.2 17.2 54.5 26 57.2C20.6 52.6 18.8 44.8 21.8 36.8C24 31.4 27.6 28.8 30.2 27.6C25.8 26 22.8 21.6 23.8 15.4Z'
        fill={`url(#${wingGradId})`}
        opacity='0.9'
      />
      <path
        d='M32 27C33.7 34.4 35.8 36.5 43.2 38.2C35.8 39.9 33.7 42 32 49.4C30.3 42 28.2 39.9 20.8 38.2C28.2 36.5 30.3 34.4 32 27Z'
        fill='#FFFFFF'
      />
    </svg>
  )
}
