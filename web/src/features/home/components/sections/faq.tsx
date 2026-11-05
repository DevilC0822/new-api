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

import { AnimateInView } from '@/components/animate-in-view'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const FAQ_KEYS = [
  {
    q: 'Are the models genuine official APIs? Is anything watered down?',
    a: 'Every model comes from official vendor plans and hits the genuine official endpoints — no quantized substitutes, no model swapping, no capability degradation. You can verify tier and quality in your own usage logs.',
  },
  {
    q: 'Can I connect from mainland China without a proxy?',
    a: 'Yes — the gateway is directly reachable from mainland China. No proxy or VPN is needed.',
  },
  {
    q: 'How do I pay?',
    a: 'Alipay is currently supported. Billing is pay-as-you-go: top up anytime, and your balance is deducted per request by actual usage.',
  },
  {
    q: 'Is it compatible with official SDKs and tools like Claude Code?',
    a: 'Yes — the gateway natively speaks both the Anthropic and OpenAI protocols. Point the Base URL of Claude Code, Codex CLI, Cursor, or the official SDKs at us and you are done.',
  },
  {
    q: 'Do you store my prompts or code?',
    a: 'No. For your privacy, prompts and code are never stored: requests are streamed through in memory and only metering metadata (tokens, latency, model) is recorded.',
  },
] as const

export function FAQ() {
  const { t } = useTranslation()

  return (
    <section className='relative z-10 border-t border-[#0F172A]/[0.08] py-20 dark:border-white/10'>
      <div className='mx-auto max-w-[760px] px-6'>
        <AnimateInView className='mb-9 text-center'>
          <div className='mb-2.5 inline-flex items-center gap-2 font-mono text-[11.5px] font-semibold tracking-[0.14em] text-blue-600 uppercase dark:text-blue-400'>
            FAQ
          </div>
          <h2 className='text-[clamp(1.75rem,2.6vw,2.35rem)] leading-[1.2] font-extrabold tracking-[-0.025em] text-[#0F172A] dark:text-white'>
            {t('Frequently Asked Questions')}
          </h2>
        </AnimateInView>

        <Accordion className='rounded-[24px] border border-[#0F172A]/[0.08] bg-white px-5 shadow-[0_14px_34px_-18px_rgba(15,23,42,0.05)] sm:px-6 dark:border-white/10 dark:bg-zinc-900'>
          {FAQ_KEYS.map((item, idx) => (
            <AccordionItem key={item.q} value={`faq-${idx}`}>
              <AccordionTrigger className='text-start text-[14.5px] font-semibold hover:no-underline'>
                {t(item.q)}
              </AccordionTrigger>
              <AccordionContent className='text-[13.5px] leading-[1.7] text-[#64748B] dark:text-zinc-400'>
                {t(item.a)}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
