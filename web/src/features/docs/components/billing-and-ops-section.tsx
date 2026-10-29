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

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Badge } from '@/components/ui/badge'

import { DOCS_FAQ_ITEMS, DOCS_STATUS_CODES } from '../constants'

export function BillingAndOpsSection() {
  const { t } = useTranslation()

  return (
    <section
      id='status-codes'
      className='scroll-mt-24 rounded-[24px] border border-[#0F172A]/[0.08] bg-white p-6 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] md:p-8 dark:border-white/10 dark:bg-zinc-900'
    >
      {/* Section Header */}
      <div className='flex items-baseline gap-2.5 border-b border-[#0F172A]/[0.07] pb-4 dark:border-white/10'>
        <span className='rounded-md bg-blue-600/10 px-2 py-0.5 font-mono text-[12px] font-bold text-blue-600 dark:bg-blue-500/20 dark:text-blue-400'>
          04
        </span>
        <h2 className='text-[20px] font-bold tracking-[-0.02em] text-[#0F172A] md:text-[22px] dark:text-white'>
          {t('Status Codes & Troubleshooting')}
        </h2>
      </div>

      {/* Compact 4-Card Status Grid */}
      <div className='mt-5 grid grid-cols-1 gap-3.5 md:grid-cols-2'>
        {DOCS_STATUS_CODES.map((item) => (
          <div
            key={item.code}
            className='rounded-[16px] border border-[#0F172A]/[0.07] bg-[#F8FAFC] p-4 dark:border-white/10 dark:bg-zinc-950/60'
          >
            <div className='flex items-center gap-2'>
              <Badge variant={item.severity} className='font-mono'>
                {item.code}
              </Badge>
              <span className='text-[13.5px] font-bold text-[#0F172A] dark:text-white'>
                {t(item.title)}
              </span>
            </div>
            <p className='mt-2 text-[12px] leading-[1.6] text-[#64748B] dark:text-zinc-400'>
              {t(item.description)}
            </p>
          </div>
        ))}
      </div>

      {/* Compact Troubleshooting FAQ Accordion */}
      <div className='mt-6 border-t border-[#0F172A]/[0.07] pt-5 dark:border-white/10'>
        <h3 className='mb-2 text-[15px] font-bold text-[#0F172A] dark:text-white'>
          {t('Frequently Asked Questions')}
        </h3>

        <Accordion defaultValue={[DOCS_FAQ_ITEMS[0].id]}>
          {DOCS_FAQ_ITEMS.map((faq) => (
            <AccordionItem
              key={faq.id}
              value={faq.id}
              className='border-[#0F172A]/[0.07] py-0.5 dark:border-white/10'
            >
              <AccordionTrigger className='py-3 text-left text-[13.5px] font-bold text-[#0F172A] hover:no-underline dark:text-white'>
                {t(faq.question)}
              </AccordionTrigger>
              <AccordionContent className='pb-3.5 text-[12.5px] leading-[1.68] text-[#64748B] dark:text-zinc-400'>
                {t(faq.answer)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
