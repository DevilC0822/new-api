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
import { describe, expect, test } from 'vitest'

import { DEFAULT_GATEWAY_ORIGIN } from '@/lib/constants'

import { Features } from '../components/sections/features'
import { Hero } from '../components/sections/hero'
import { HowItWorks } from '../components/sections/how-it-works'
import { Stats } from '../components/sections/stats'

async function renderWithRouter(ui: React.ReactNode) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const root = createRootRoute({ component: Outlet })
  const indexRoute = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: () => <div>{ui}</div>,
  })
  const router = createRouter({
    routeTree: root.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  await router.load()
  return render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
}

describe('Homepage sections (confirmed MIHOUO · 觅火 design)', () => {
  test('renders 3-step quickstart cards with gateway origin and interactive snippets', async () => {
    await renderWithRouter(<HowItWorks />)

    expect(screen.getByText('Create an API Key')).toBeInTheDocument()
    expect(screen.getByText('Configure Endpoint or Import')).toBeInTheDocument()
    expect(screen.getByText('Start Calling & Monitor Logs')).toBeInTheDocument()
    // The gateway origin is user-visible inside the copyable snippet code
    expect(
      screen.getAllByText((content) => content.includes(DEFAULT_GATEWAY_ORIGIN))
        .length
    ).toBeGreaterThan(0)

    // Step numbers render once (badge only); no duplicate STEP labels or
    // decorative KV footer labels from the earlier design
    expect(screen.queryByText('STEP 01')).not.toBeInTheDocument()
    expect(screen.queryByText('Credential Format')).not.toBeInTheDocument()

    const codexBtn = screen.getByRole('button', { name: 'Codex CLI' })
    fireEvent.click(codexBtn)
    expect(screen.getByText(/codex --model gpt-6-astra/)).toBeInTheDocument()
  })

  test('renders engineering pillars with endpoint list and governance facts', async () => {
    await renderWithRouter(<Stats />)

    expect(
      screen.getByText('Multi-Dimensional Token Metering & Real-Time Tracing')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Memory Streaming & Team Token Governance')
    ).toBeInTheDocument()
    expect(
      screen.getByText('/v1/messages · /v1/responses · /v1/chat/completions')
    ).toBeInTheDocument()
    // The teaser paragraph that previewed the three pillars was removed
    expect(
      screen.queryByText(
        'From dual-protocol passthrough and granular token metering to privacy governance, built for production standards.'
      )
    ).not.toBeInTheDocument()
  })

  test('renders the smart routing convergence stage and updates the active route rule when hovering vendor clusters', async () => {
    await renderWithRouter(<Features />)

    expect(
      screen.getByText('Flagship Power from Top Providers, Unified in One Key')
    ).toBeInTheDocument()
    expect(screen.getByText('Claude Code')).toBeInTheDocument()
    expect(screen.getByText('Codex CLI & Cursor')).toBeInTheDocument()
    expect(screen.getByText('Anthropic & OpenAI SDK')).toBeInTheDocument()

    expect(
      screen.getByText('Auto routing -> Anthropic channel')
    ).toBeInTheDocument()

    const deepseekCluster = screen.getByText('DeepSeek').closest('a')
    if (!deepseekCluster) {
      throw new Error('Expected DeepSeek cluster link')
    }
    fireEvent.mouseEnter(deepseekCluster)
    expect(
      screen.getByText('Auto routing -> DeepSeek channel')
    ).toBeInTheDocument()

    const glmCluster = screen.getByText('Zhipu GLM').closest('a')
    if (!glmCluster) {
      throw new Error('Expected GLM cluster link')
    }
    fireEvent.mouseEnter(glmCluster)
    expect(
      screen.getByText('Auto routing -> Zhipu GLM channel')
    ).toBeInTheDocument()

    expect(screen.getByText(/Opus 5\.5 · Sonnet 5\.5/)).toBeInTheDocument()
    expect(screen.getByText(/GPT-6 Astra · GPT-6\.1 Sol/)).toBeInTheDocument()
    expect(screen.getByText(/DeepSeek V4 Pro/)).toBeInTheDocument()
    expect(screen.getByText(/Kimi K3\.1 Pro/)).toBeInTheDocument()

    // No stale hardcoded model-count slogan or per-cluster count chips
    expect(
      screen.queryByText('12 Flagship Models Online')
    ).not.toBeInTheDocument()
    expect(screen.queryByText('4 Models')).not.toBeInTheDocument()
  })

  test('switches active hero deck card when clicking left model chips or background cards', async () => {
    await renderWithRouter(<Hero isAuthenticated={false} />)

    const opusTab = screen.getByRole('tab', { name: 'Claude Opus 5.5' })
    const astraTab = screen.getByRole('tab', { name: 'GPT-6 Astra' })
    const kimiTab = screen.getByRole('tab', { name: 'Kimi K3.1 Pro' })

    expect(opusTab).toHaveAttribute('aria-selected', 'true')
    expect(
      screen.getByRole('region', { name: 'Claude Opus 5.5' })
    ).toBeInTheDocument()

    fireEvent.click(astraTab)
    expect(astraTab).toHaveAttribute('aria-selected', 'true')
    expect(
      screen.getByRole('region', { name: 'GPT-6 Astra' })
    ).toBeInTheDocument()

    fireEvent.click(kimiTab)
    expect(kimiTab).toHaveAttribute('aria-selected', 'true')
    expect(
      screen.getByRole('region', { name: 'Kimi K3.1 Pro' })
    ).toBeInTheDocument()
  })
})
