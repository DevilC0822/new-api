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

import { About } from '@/features/about'
import { useAuthStore } from '@/stores/auth-store'
import { useSystemConfigStore } from '@/stores/system-config-store'

import { Docs } from '../index'

async function renderPublicPage(
  initialPath: '/docs' | '/about' = '/docs',
  statusData?: Record<string, unknown>
) {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  if (statusData) {
    client.setQueryData(['status'], statusData)
  }
  client.setQueryData(['about-content'], {
    success: true,
    message: '',
    data: '',
  })

  const root = createRootRoute({ component: Outlet })
  const docsRoute = createRoute({
    getParentRoute: () => root,
    path: '/docs',
    component: () => <Docs />,
  })
  const aboutRoute = createRoute({
    getParentRoute: () => root,
    path: '/about',
    component: () => <About />,
  })
  const router = createRouter({
    routeTree: root.addChildren([docsRoute, aboutRoute]),
    history: createMemoryHistory({ initialEntries: [initialPath] }),
  })
  await router.load()

  return render(
    <QueryClientProvider client={client}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

async function renderDocsPage(statusData?: Record<string, unknown>) {
  return renderPublicPage('/docs', statusData)
}

afterEach(() => {
  useAuthStore.getState().auth.setUser(null)
})

describe('Docs page behavior and interactive workbenches', () => {
  it('renders the streamlined docs header, dual Base URLs, single model example, and 4 focused sections', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderDocsPage()

    expect(
      screen.getByRole('heading', { name: 'Integration Docs' })
    ).toBeInTheDocument()
    // The decorative DEVELOPER DOCUMENTATION eyebrow above the H1 was removed
    expect(
      screen.queryByText('DEVELOPER DOCUMENTATION')
    ).not.toBeInTheDocument()
    expect(
      screen.getAllByText('https://api.mihouo.com').length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByText('https://api.mihouo.com/v1').length
    ).toBeGreaterThan(0)
    expect(
      screen.getByRole('heading', { name: 'Quickstart' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Client Configuration' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'API Reference' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Status Codes & Troubleshooting' })
    ).toBeInTheDocument()
  })

  it('switches client configuration and toggles between environment variables and config file when user selects Codex CLI', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderDocsPage()

    const codexTab = screen.getByRole('tab', { name: /Codex CLI/ })
    fireEvent.click(codexTab)

    expect(codexTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByText(/codex --model gpt-6-astra/)).toBeInTheDocument()

    const configFileBtn = screen.getByRole('button', {
      name: 'Config File',
    })
    fireEvent.click(configFileBtn)

    expect(screen.getByText('~/.codex/config.toml')).toBeInTheDocument()
    expect(screen.getByText(/wire_api = "responses"/)).toBeInTheDocument()
  })

  it('updates endpoint URL, code sample, and parameter table when user switches API protocol and language', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderDocsPage()

    const responsesTab = screen.getByRole('tab', { name: 'OpenAI Responses' })
    fireEvent.click(responsesTab)

    const pythonTab = screen.getByRole('tab', { name: 'Python' })
    fireEvent.click(pythonTab)

    expect(screen.getByText(/client\.responses\.create/)).toBeInTheDocument()
    expect(screen.getByText('reasoning')).toBeInTheDocument()
  })

  it('always keeps the Docs navigation link internal to /docs without opening a new tab', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderDocsPage({
      docs_link: 'http://localhost:5174/docs',
      header_nav_modules: JSON.stringify({ docs: true }),
    })

    const docsLinks = screen.getAllByRole('link', { name: 'Docs' })
    for (const link of docsLinks) {
      expect(link).toHaveAttribute('href', '/docs')
      expect(link).not.toHaveAttribute('target', '_blank')
    }
  })

  it('renders the MIHOUO About showcase page with core engineering tenets and open-source attribution', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderPublicPage('/about')

    expect(
      screen.getByRole('heading', {
        name: /Passing the Torch: Resilient AI Gateway Infrastructure/,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: 'Core Engineering Principles' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', {
        name: 'Open Source Ecosystem & Attribution',
      })
    ).toBeInTheDocument()
    // AGPL attribution links to the upstream project are preserved
    expect(
      screen.getByText('github.com/QuantumNous/new-api')
    ).toBeInTheDocument()
    // The pseudo-metric strip and ABOUT eyebrow badge were removed
    expect(screen.queryByText('Minimal Latency')).not.toBeInTheDocument()
    expect(screen.queryByText('Zero Retention')).not.toBeInTheDocument()
  })
})
