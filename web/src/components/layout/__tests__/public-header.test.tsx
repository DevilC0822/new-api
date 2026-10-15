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
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'
import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { useAuthStore } from '@/stores/auth-store'
import { useSystemConfigStore } from '@/stores/system-config-store'

import { PublicHeader } from '../components/public-header'

async function renderHeader(path = '/pricing') {
  const client = new QueryClient()
  const root = createRootRoute({ component: Outlet })
  const route = createRoute({
    getParentRoute: () => root,
    path,
    component: () => <PublicHeader />,
  })
  const router = createRouter({
    routeTree: root.addChildren([route]),
    history: createMemoryHistory({ initialEntries: [path] }),
  })
  await router.load()
  return render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

function scrollPageTo(y: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    writable: true,
    value: y,
  })
  fireEvent.scroll(window)
}

afterEach(() => {
  scrollPageTo(0)
  useAuthStore.getState().auth.setUser(null)
})

describe('PublicHeader scrolled layout', () => {
  it('collapses the brand lockup when scrolled so nav items keep full width', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderHeader()

    const lockup = screen
      .getByText('api.mihouo.com')
      .closest('div[class*="overflow-hidden"]')
    expect(lockup).not.toBeNull()
    expect(lockup).not.toHaveClass('max-w-0')

    scrollPageTo(100)
    expect(lockup).toHaveClass('max-w-0')
    expect(lockup).toHaveClass('opacity-0')
  })

  it('keeps the sign-in CTA on a single line', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderHeader()

    // Desktop header and mobile drawer each render the CTA
    for (const cta of screen.getAllByRole('link', { name: 'Sign in' })) {
      expect(cta).toHaveClass('whitespace-nowrap')
    }
  })

  it('omits the dashboard CTA when the nav already links to the console', async () => {
    useSystemConfigStore.setState({ loading: false })
    useAuthStore.getState().auth.setUser({ id: 1, username: 'tester', role: 1 })

    await renderHeader('/pricing')

    expect(
      screen.queryByRole('link', { name: 'Go to Dashboard' })
    ).not.toBeInTheDocument()
    // The nav itself still provides the console entry
    expect(screen.getAllByRole('link', { name: 'Console' })).not.toHaveLength(0)
  })

  it('keeps the dashboard CTA on the landing nav where no console link exists', async () => {
    useSystemConfigStore.setState({ loading: false })
    useAuthStore.getState().auth.setUser({ id: 1, username: 'tester', role: 1 })

    await renderHeader('/')

    expect(
      screen.getAllByRole('link', { name: 'Go to Dashboard' })
    ).not.toHaveLength(0)
  })
})
