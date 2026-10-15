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
import type { SVGProps } from 'react'

import { cn } from '@/lib/utils'

export function Logo({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      id='newapi-logo'
      viewBox='0 0 44 44'
      xmlns='http://www.w3.org/2000/svg'
      height='36'
      width='36'
      fill='none'
      stroke='currentColor'
      strokeWidth='0.85'
      strokeLinecap='round'
      strokeLinejoin='round'
      className={cn('size-9', className)}
      {...props}
    >
      <title>MIHOUO · 弥火</title>
      {/* Outer 3D polyhedron perimeter */}
      <polygon
        points='22,2.5 38.5,11.5 38.5,32.5 22,41.5 5.5,32.5 5.5,11.5'
        strokeWidth='0.95'
      />
      {/* Inner rotated octahedron star facets */}
      <polygon points='22,2.5 38.5,32.5 5.5,32.5' strokeOpacity='0.75' />
      <polygon points='5.5,11.5 38.5,11.5 22,41.5' strokeOpacity='0.75' />
      {/* Internal 3D equatorial ring vertices */}
      <polygon
        points='22,10 31.5,16.5 31.5,27.5 22,34 12.5,27.5 12.5,16.5'
        strokeOpacity='0.55'
      />
      {/* Fine internal diagonal struts */}
      <line x1='22' y1='2.5' x2='22' y2='41.5' strokeOpacity='0.5' />
      <line x1='5.5' y1='11.5' x2='38.5' y2='32.5' strokeOpacity='0.5' />
      <line x1='38.5' y1='11.5' x2='5.5' y2='32.5' strokeOpacity='0.5' />
      {/* Center focal vertex */}
      <circle cx='22' cy='22' r='1.3' fill='currentColor' />
    </svg>
  )
}
