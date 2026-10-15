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
import { Fragment, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Logo } from '@/assets/logo'
import { useStatus } from '@/hooks/use-status'
import { useSystemConfig } from '@/hooks/use-system-config'
import { DEFAULT_LOGO, DEFAULT_SYSTEM_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface FooterLink {
  text: string
  href: string
}

interface FooterColumnProps {
  title: string
  links: FooterLink[]
}

interface FooterProps {
  logo?: string
  name?: string
  columns?: FooterColumnProps[]
  copyright?: string
  className?: string
  slim?: boolean
}

function FooterLinkItem(props: { link: FooterLink }) {
  const { t } = useTranslation()
  const isExternal = props.link.href.startsWith('http')
  const label = t(props.link.text)

  if (isExternal) {
    return (
      <a
        href={props.link.href}
        target='_blank'
        rel='noopener noreferrer'
        className='text-muted-foreground hover:text-foreground text-[13px] transition-colors duration-200'
      >
        {label}
      </a>
    )
  }

  return (
    <Link
      to={props.link.href}
      className='text-muted-foreground hover:text-foreground text-[13px] transition-colors duration-200'
    >
      {label}
    </Link>
  )
}

function LegalLinks(props: { leadingSeparator?: boolean }) {
  const { t } = useTranslation()
  const { status } = useStatus()
  const items: { key: string; label: string; href: string }[] = []
  if (status?.user_agreement_enabled) {
    items.push({
      key: 'user-agreement',
      label: t('User Agreement'),
      href: '/user-agreement',
    })
  }
  if (status?.privacy_policy_enabled) {
    items.push({
      key: 'privacy-policy',
      label: t('Privacy Policy'),
      href: '/privacy-policy',
    })
  }
  if (items.length === 0) {
    return null
  }
  return (
    <>
      {items.map((item, index) => (
        <Fragment key={item.key}>
          {(props.leadingSeparator || index > 0) && (
            <span aria-hidden='true' className='text-muted-foreground/30'>
              ·
            </span>
          )}
          <Link
            to={item.href}
            className='hover:text-foreground transition-colors duration-200'
          >
            {item.label}
          </Link>
        </Fragment>
      ))}
    </>
  )
}

function ProjectAttribution(props: { currentYear: number; inline?: boolean }) {
  const { t } = useTranslation()
  const content = (
    <span className='text-muted-foreground font-mono text-[11.5px]'>
      {t('隐私承诺')}
    </span>
  )
  if (props.inline) {
    return content
  }
  return (
    <div className='text-muted-foreground text-center text-xs sm:text-right'>
      {content}
    </div>
  )
}

export function Footer(props: FooterProps) {
  const { t } = useTranslation()
  const { systemName, logo: systemLogo, footerHtml } = useSystemConfig()

  const displayLogo = systemLogo || props.logo || DEFAULT_LOGO
  const rawName = systemName || props.name || DEFAULT_SYSTEM_NAME
  const displayName = rawName === 'New API' ? DEFAULT_SYSTEM_NAME : rawName
  const currentYear = new Date().getFullYear()

  const fallbackColumns = useMemo<FooterColumnProps[]>(
    () => [
      {
        title: t('产品与服务'),
        links: [
          { text: t('Console'), href: '/dashboard' },
          { text: t('Model Square'), href: '/pricing' },
          { text: t('Playground'), href: '/playground' },
        ],
      },
      {
        title: t('常用客户端'),
        links: [
          { text: 'Claude Code 接入', href: '/dashboard' },
          { text: 'OpenAI Codex CLI', href: '/dashboard' },
          { text: t('API Keys'), href: '/keys' },
        ],
      },
      {
        title: t('支持与文档'),
        links: [
          {
            text: t('footer.columns.docs.links.quickStart'),
            href: 'https://docs.newapi.pro/getting-started/',
          },
          {
            text: t('footer.columns.docs.links.apiDocs'),
            href: 'https://docs.newapi.pro/api/',
          },
          { text: t('About'), href: '/about' },
        ],
      },
    ],
    [t]
  )

  const displayColumns = props.columns ?? fallbackColumns

  if (footerHtml) {
    return (
      <footer
        className={cn('border-border relative z-10 border-t', props.className)}
      >
        <div className='mx-auto w-full max-w-[1280px] px-6 py-6 md:px-12'>
          <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
            <div
              className='custom-footer text-muted-foreground min-w-0 text-center text-xs sm:text-left'
              dangerouslySetInnerHTML={{ __html: footerHtml }}
            />
            <div className='flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs'>
              <LegalLinks />
              <ProjectAttribution currentYear={currentYear} inline />
            </div>
          </div>
        </div>
      </footer>
    )
  }

  // 设计稿同款单行精简页脚（仅首页使用）
  if (props.slim) {
    return (
      <footer
        className={cn('border-border relative z-10 border-t', props.className)}
      >
        <div className='mx-auto flex w-full max-w-[1280px] flex-col items-center justify-between gap-3 px-6 py-8 sm:flex-row md:px-12'>
          <div className='text-muted-foreground text-[12.5px]'>
            &copy; {currentYear} {displayName} (api.mihouo.com) ·{' '}
            {props.copyright ?? t('footer.defaultCopyright')}
          </div>
          <div className='text-muted-foreground flex items-center gap-6 text-[12.5px]'>
            <a
              href='#client-integration-hub'
              className='hover:text-foreground transition-colors'
            >
              {t('接入指南')}
            </a>
            <a
              href='#models-section'
              className='hover:text-foreground transition-colors'
            >
              {t('模型费率')}
            </a>
            <a href='#' className='hover:text-foreground transition-colors'>
              {t('隐私承诺')}
            </a>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <footer
      className={cn('border-border relative z-10 border-t', props.className)}
    >
      <div className='mx-auto max-w-[1280px] px-6 py-12 md:px-12 md:py-16'>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-12 md:gap-8'>
          {/* Brand Column (6 cols) */}
          <div className='md:col-span-5'>
            <Link to='/' className='group inline-flex items-center gap-3'>
              {displayLogo === DEFAULT_LOGO ? (
                <Logo className='text-foreground size-8' />
              ) : (
                <img
                  src={displayLogo}
                  alt={displayName}
                  className='size-8 rounded-lg object-contain'
                />
              )}
              <div className='flex flex-col leading-none'>
                <span className='font-serif text-[16px] font-normal tracking-[0.2em]'>
                  {displayName}
                </span>
                <span className='text-muted-foreground mt-1 font-mono text-[10.5px]'>
                  api.mihouo.com
                </span>
              </div>
            </Link>
            <p className='text-muted-foreground mt-4 max-w-[320px] text-[13px] leading-[1.7]'>
              {t('Powerful API Management Platform')}
            </p>
          </div>

          {/* 3 Aligned Navigation Columns (7 cols) */}
          <div className='grid grid-cols-3 gap-8 md:col-span-7'>
            {displayColumns.map((column) => (
              <div key={column.title}>
                <p className='text-foreground mb-3.5 text-xs font-semibold tracking-wider'>
                  {column.title}
                </p>
                <ul className='space-y-2.5'>
                  {column.links.map((link) => (
                    <li key={link.text}>
                      <FooterLinkItem link={link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className='border-border/80 mt-10 flex flex-col items-center justify-between gap-3 border-t pt-6 sm:flex-row'>
          <div className='text-muted-foreground flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:justify-start'>
            <span>
              &copy; {currentYear} {displayName} (api.mihouo.com) ·{' '}
              {props.copyright ?? t('footer.defaultCopyright')}
            </span>
            <LegalLinks leadingSeparator />
          </div>
          <ProjectAttribution currentYear={currentYear} />
        </div>
      </div>
    </footer>
  )
}
