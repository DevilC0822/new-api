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
import { useTranslation } from 'react-i18next'

import { StatusBadge } from '@/components/status-badge'

interface ModelDiscountBadgeProps {
  percent: number
}

export function ModelDiscountBadge(props: ModelDiscountBadgeProps) {
  const { t } = useTranslation()
  // Chinese-style discount: the fraction of the official price paid, ×10
  // (0.2 → 2折). Other locales keep the percent-off form via {{percent}}.
  const zhe = (100 - props.percent) / 10
  const zheLabel = Number.isInteger(zhe) ? String(zhe) : zhe.toFixed(1)
  return (
    <StatusBadge
      label={t('{{percent}}% off', { percent: props.percent, zhe: zheLabel })}
      variant='danger'
      copyable={false}
      title={t('{{percent}}% below the official price', {
        percent: props.percent,
        zhe: zheLabel,
      })}
    />
  )
}
