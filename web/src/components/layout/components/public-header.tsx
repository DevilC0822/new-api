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
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Logo } from '@/assets/logo'
import { Dialog } from '@/components/dialog'
import { LanguageSwitcher } from '@/components/language-switcher'
import { NotificationPopover } from '@/components/notification-popover'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useNotifications } from '@/hooks/use-notifications'
import { useSystemConfig } from '@/hooks/use-system-config'
import { useTopNavLinks } from '@/hooks/use-top-nav-links'
import { DEFAULT_LOGO, DEFAULT_SYSTEM_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth-store'

import { defaultTopNavLinks } from '../config/top-nav.config'
import type { TopNavLink } from '../types'
import { HeaderLogo } from './header-logo'

const AUTH_PROMPT_SECONDS = 5

type AuthPromptTarget = {
  title: string
  href: string
}

export interface PublicHeaderProps {
  navLinks?: TopNavLink[]
  mobileLinks?: TopNavLink[]
  navContent?: React.ReactNode
  showThemeSwitch?: boolean
  showLanguageSwitcher?: boolean
  logo?: React.ReactNode
  siteName?: string
  homeUrl?: string
  leftContent?: React.ReactNode
  rightContent?: React.ReactNode
  showNavigation?: boolean
  showAuthButtons?: boolean
  showNotifications?: boolean
  className?: string
}

export function PublicHeader(props: PublicHeaderProps) {
  const {
    navLinks = defaultTopNavLinks,
    showThemeSwitch = true,
    showLanguageSwitcher = true,
    logo: customLogo,
    siteName: customSiteName,
    homeUrl = '/',
    showAuthButtons = true,
    showNotifications = true,
  } = props

  const { t } = useTranslation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [authPromptTarget, setAuthPromptTarget] =
    useState<AuthPromptTarget | null>(null)
  const [authPromptSecondsLeft, setAuthPromptSecondsLeft] =
    useState(AUTH_PROMPT_SECONDS)
  const { auth } = useAuthStore()
  const {
    systemName,
    logo: systemLogo,
    loading,
    logoLoaded,
  } = useSystemConfig()
  const dynamicLinks = useTopNavLinks()
  const notifications = useNotifications()
  const routerState = useRouterState()
  const pathname = routerState.location.pathname

  const user = auth.user
  const isAuthenticated = !!user
  const rawSiteName = (
    customSiteName ||
    systemName ||
    DEFAULT_SYSTEM_NAME
  ).replaceAll('弥火', '觅火')
  const isDefaultBrand =
    rawSiteName === 'New API' ||
    rawSiteName === DEFAULT_SYSTEM_NAME ||
    rawSiteName.toUpperCase().startsWith('MIHOUO')
  const links = dynamicLinks.length > 0 ? dynamicLinks : navLinks

  let logoContent: ReactNode =
    !systemLogo || systemLogo === DEFAULT_LOGO ? (
      <Logo className='size-7' />
    ) : (
      <HeaderLogo
        src={systemLogo}
        loading={loading}
        logoLoaded={logoLoaded}
        className='size-full rounded-lg object-contain'
      />
    )
  if (customLogo) logoContent = customLogo
  if (loading) logoContent = <Skeleton className='size-full rounded-lg' />

  // The "Go to Dashboard" CTA is redundant when the nav already links to the
  // console (non-home pages); keep it on the landing anchor nav and always
  // show the "Sign in" entry for guests.
  const hasConsoleNavLink = links.some((link) => link.href === '/dashboard')
  const showAuthCta = !isAuthenticated || !hasConsoleNavLink

  let authContent = showAuthCta ? (
    <Link
      to={isAuthenticated ? '/dashboard' : '/sign-in'}
      className='inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full border border-[#0F172A] bg-[#0F172A] px-4 text-[12.5px] font-semibold whitespace-nowrap text-white shadow-[0_6px_16px_-4px_rgba(15,23,42,0.22)] transition-all duration-200 hover:-translate-y-px hover:bg-[#1E293B] dark:border-white dark:bg-white dark:text-[#0F172A]'
    >
      <span>{isAuthenticated ? t('Go to Dashboard') : t('Sign in')}</span>
      <ArrowRight className='size-3.5' />
    </Link>
  ) : null
  if (isAuthenticated) {
    authContent = (
      <div className='flex items-center gap-2.5'>
        {authContent}
        <ProfileDropdown />
      </div>
    )
  }
  if (loading) authContent = <Skeleton className='h-9 w-28 rounded-full' />

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  useEffect(() => {
    if (!authPromptTarget) return

    const intervalId = window.setInterval(() => {
      setAuthPromptSecondsLeft((seconds) => Math.max(seconds - 1, 0))
    }, 1000)

    const timeoutId = window.setTimeout(() => {
      const redirect = authPromptTarget.href
      setAuthPromptTarget(null)
      navigate({ to: '/sign-in', search: { redirect } })
    }, AUTH_PROMPT_SECONDS * 1000)

    return () => {
      window.clearInterval(intervalId)
      window.clearTimeout(timeoutId)
    }
  }, [authPromptTarget, navigate])

  const closeAuthPrompt = useCallback(() => {
    setAuthPromptTarget(null)
    setAuthPromptSecondsLeft(AUTH_PROMPT_SECONDS)
  }, [])

  const navigateToSignIn = useCallback(() => {
    const redirect = authPromptTarget?.href || '/'
    setAuthPromptTarget(null)
    navigate({ to: '/sign-in', search: { redirect } })
  }, [authPromptTarget?.href, navigate])

  const handleNavLinkClick = useCallback(
    (
      event: React.MouseEvent<HTMLAnchorElement>,
      link: TopNavLink,
      closeMobile = false
    ) => {
      if (link.disabled) {
        event.preventDefault()
        return
      }

      if (link.requiresAuth) {
        event.preventDefault()
        if (closeMobile) {
          setMobileOpen(false)
        }
        setAuthPromptSecondsLeft(AUTH_PROMPT_SECONDS)
        setAuthPromptTarget({
          title: t(link.title),
          href: link.href,
        })
        return
      }

      if (closeMobile) {
        setMobileOpen(false)
      }
    },
    [t]
  )

  let brandContent: ReactNode = (
    <span
      className='max-w-48 truncate text-[14px] font-bold tracking-wide text-[#0F172A] dark:text-zinc-100'
      title={rawSiteName}
    >
      {rawSiteName}
    </span>
  )
  if (loading) {
    brandContent = <Skeleton className='h-5 w-28' />
  } else if (isDefaultBrand) {
    brandContent = (
      <div className='flex items-center gap-2 leading-none'>
        <span className='text-[13.5px] font-bold tracking-[0.14em] text-[#0F172A] dark:text-zinc-100'>
          MIHOUO
        </span>
        <span className='h-3 w-px bg-[#0F172A]/18 dark:bg-white/20' />
        <span className='text-[13.5px] font-semibold tracking-[0.04em] text-[#334155] dark:text-zinc-300'>
          觅火
        </span>
      </div>
    )
  }

  return (
    <>
      <header className='pointer-events-none fixed inset-x-0 top-0 z-50'>
        <div
          className={cn(
            'pointer-events-auto mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
            scrolled ? 'max-w-[68rem] px-4 pt-3' : 'max-w-[1180px] px-4 pt-4'
          )}
        >
          <nav
            className={cn(
              'flex h-14 items-center justify-between gap-4 rounded-full border border-[#0F172A]/[0.08] bg-white/85 pr-3 pl-5 shadow-[0_12px_32px_-12px_rgba(15,23,42,0.06),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] dark:border-white/10 dark:bg-zinc-900/85 dark:shadow-[0_12px_32px_-12px_rgba(0,0,0,0.45)]'
            )}
          >
            {/* Brand Lockup: Pure Flame Glyph + MIHOUO · 觅火 */}
            <div
              className={cn(
                '@container/system-brand flex min-w-0 items-center gap-2.5'
              )}
            >
              <Link
                to={homeUrl}
                className={cn(
                  'group flex min-w-0 items-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                  scrolled ? 'gap-0' : 'gap-2.5'
                )}
              >
                <div className='flex size-8 shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105'>
                  {logoContent}
                </div>
                <div
                  className={cn(
                    'flex min-w-0 items-center overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    scrolled ? 'max-w-0 opacity-0' : 'max-w-60 opacity-100'
                  )}
                >
                  {brandContent}
                </div>
              </Link>
            </div>

            {/* Desktop nav */}
            <div className='hidden min-w-0 items-center gap-1 lg:flex'>
              {links.map((link) => {
                const isActive = pathname === link.href
                const isAnchor = link.href.startsWith('#')
                if (link.external || isAnchor) {
                  return (
                    <a
                      key={`${link.title}:${link.href}`}
                      href={link.href}
                      title={t(link.title)}
                      target={isAnchor ? undefined : '_blank'}
                      rel={isAnchor ? undefined : 'noopener noreferrer'}
                      aria-disabled={link.disabled}
                      tabIndex={link.disabled ? -1 : undefined}
                      onClick={(event) => handleNavLinkClick(event, link)}
                      className={cn(
                        'min-w-0 truncate rounded-full px-3.5 py-1.5 text-[13.5px] font-medium text-[#64748B] transition-colors duration-200 hover:bg-[#0F172A]/[0.04] hover:text-[#0F172A] dark:text-zinc-300 dark:hover:bg-white/5 dark:hover:text-white',
                        link.disabled && 'pointer-events-none opacity-50'
                      )}
                    >
                      {t(link.title)}
                    </a>
                  )
                }
                return (
                  <Link
                    key={`${link.title}:${link.href}`}
                    to={link.href}
                    title={t(link.title)}
                    disabled={link.disabled}
                    onClick={(event) => handleNavLinkClick(event, link)}
                    className={cn(
                      'min-w-0 truncate rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-colors duration-200 hover:bg-[#0F172A]/[0.04]',
                      isActive
                        ? 'font-semibold text-[#0F172A] dark:text-white'
                        : 'text-[#64748B] hover:text-[#0F172A] dark:text-zinc-300 dark:hover:text-white',
                      link.disabled && 'pointer-events-none opacity-50'
                    )}
                  >
                    {t(link.title)}
                  </Link>
                )
              })}
            </div>

            {/* Desktop right actions */}
            <div className='hidden shrink-0 items-center gap-2 lg:flex'>
              {showLanguageSwitcher && <LanguageSwitcher />}
              {showThemeSwitch && <ThemeSwitch />}
              {showNotifications && isAuthenticated && (
                <NotificationPopover
                  open={notifications.popoverOpen}
                  onOpenChange={notifications.setPopoverOpen}
                  unreadCount={notifications.unreadCount}
                  activeTab={notifications.activeTab}
                  onTabChange={notifications.setActiveTab}
                  notice={notifications.notice}
                  announcements={notifications.announcements}
                  loading={notifications.loading}
                />
              )}

              {showAuthButtons && <div className='shrink-0'>{authContent}</div>}
            </div>

            {/* Mobile: compact actions + hamburger */}
            <div className='flex shrink-0 items-center gap-2 lg:hidden'>
              {showThemeSwitch && <ThemeSwitch />}
              {showAuthButtons && !loading && isAuthenticated && (
                <ProfileDropdown />
              )}
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='size-9'
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={t('Toggle navigation menu')}
              >
                <div className='relative size-4'>
                  <span
                    className={cn(
                      'absolute inset-x-0 block h-[1.5px] origin-center rounded-full bg-current transition-all duration-300',
                      mobileOpen ? 'top-[7px] rotate-45' : 'top-[3px]'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute inset-x-0 top-[7px] block h-[1.5px] rounded-full bg-current transition-all duration-300',
                      mobileOpen ? 'scale-x-0 opacity-0' : 'opacity-100'
                    )}
                  />
                  <span
                    className={cn(
                      'absolute inset-x-0 block h-[1.5px] origin-center rounded-full bg-current transition-all duration-300',
                      mobileOpen ? 'top-[7px] -rotate-45' : 'top-[11px]'
                    )}
                  />
                </div>
              </Button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile full-screen overlay */}
      <div
        className={cn(
          'bg-background/98 fixed inset-0 z-40 backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:pointer-events-none lg:hidden',
          mobileOpen
            ? 'pointer-events-auto opacity-100'
            : 'pointer-events-none opacity-0'
        )}
      >
        <div className='flex h-full flex-col justify-between px-8 pt-20 pb-10'>
          <nav className='flex flex-col gap-1'>
            {links.map((link, i) => {
              const isActive = pathname === link.href
              const linkClassName = cn(
                'flex items-center gap-3 py-3 text-base font-medium tracking-tight transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
                mobileOpen
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-4 opacity-0',
                isActive ? 'text-foreground' : 'text-muted-foreground',
                link.disabled && 'pointer-events-none opacity-50'
              )
              const transitionStyle = {
                transitionDelay: mobileOpen ? `${100 + i * 50}ms` : '0ms',
              }
              const isAnchor = link.href.startsWith('#')
              if (link.external || isAnchor) {
                return (
                  <a
                    key={`${link.title}:${link.href}`}
                    href={link.href}
                    target={isAnchor ? undefined : '_blank'}
                    rel={isAnchor ? undefined : 'noopener noreferrer'}
                    aria-disabled={link.disabled}
                    tabIndex={link.disabled ? -1 : undefined}
                    onClick={(event) => handleNavLinkClick(event, link, true)}
                    className={linkClassName}
                    style={transitionStyle}
                  >
                    {t(link.title)}
                  </a>
                )
              }
              return (
                <Link
                  key={`${link.title}:${link.href}`}
                  to={link.href}
                  disabled={link.disabled}
                  onClick={(event) => handleNavLinkClick(event, link, true)}
                  className={linkClassName}
                  style={transitionStyle}
                >
                  {t(link.title)}
                </Link>
              )
            })}
          </nav>

          <div
            className={cn(
              'flex flex-col gap-3 transition-all duration-500',
              mobileOpen
                ? 'translate-y-0 opacity-100'
                : 'translate-y-4 opacity-0'
            )}
            style={{ transitionDelay: mobileOpen ? '250ms' : '0ms' }}
          >
            {showAuthButtons && showAuthCta && (
              <Link
                to={isAuthenticated ? '/dashboard' : '/sign-in'}
                onClick={() => setMobileOpen(false)}
                className='bg-foreground text-background inline-flex h-10 items-center justify-center rounded-full text-sm font-medium whitespace-nowrap transition-opacity hover:opacity-90 active:opacity-80'
              >
                {isAuthenticated ? t('Go to Dashboard') : t('Sign in')}
              </Link>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={!!authPromptTarget}
        onOpenChange={(open) => {
          if (!open) {
            closeAuthPrompt()
          }
        }}
        title={t('Sign in required')}
        description={t('Please sign in to view {{module}}.', {
          module: authPromptTarget?.title || '',
        })}
        contentClassName='sm:max-w-md'
        contentHeight='auto'
        footer={
          <>
            <Button variant='outline' onClick={closeAuthPrompt}>
              {t('Cancel')}
            </Button>
            <Button onClick={navigateToSignIn}>{t('Sign in now')}</Button>
          </>
        }
      >
        <div className='bg-muted/40 text-muted-foreground rounded-lg px-3 py-2 text-sm'>
          {t('Redirecting to sign in in {{seconds}} seconds.', {
            seconds: authPromptSecondsLeft,
          })}
        </div>
      </Dialog>
    </>
  )
}
