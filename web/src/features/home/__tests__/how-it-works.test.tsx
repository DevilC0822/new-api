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
  test('renders 3-step quickstart cards with aligned single-line scope pills and gateway origin', async () => {
    await renderWithRouter(<HowItWorks />)

    expect(screen.getByText('Create an API Key')).toBeInTheDocument()
    expect(screen.getByText('Configure Endpoint or Import')).toBeInTheDocument()
    expect(screen.getByText('Start Calling & Monitor Logs')).toBeInTheDocument()
    expect(screen.getAllByText(DEFAULT_GATEWAY_ORIGIN).length).toBeGreaterThan(
      0
    )
    expect(screen.getByText('Anthropic Protocol')).toBeInTheDocument()
    expect(screen.getByText('OpenAI Protocol')).toBeInTheDocument()
    expect(screen.getByText('One-Click Import')).toBeInTheDocument()

    const codexBtn = screen.getByRole('button', { name: 'Codex CLI' })
    fireEvent.click(codexBtn)
    expect(screen.getByText(/codex --model gpt-6-astra/)).toBeInTheDocument()
  })

  test('switches protocol endpoints interactively in Stats engineering pillars', async () => {
    await renderWithRouter(<Stats />)

    expect(screen.getByText('Anthropic Native Protocol')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: '/v1/responses' }))
    expect(screen.getByText('OpenAI Responses Protocol')).toBeInTheDocument()
    expect(
      screen.getByText('Multi-Dimensional Token Metering & Real-Time Tracing')
    ).toBeInTheDocument()
    expect(
      screen.getByText('Memory Streaming & Team Token Governance')
    ).toBeInTheDocument()
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

    expect(screen.getAllByText('Claude Opus 5.5').length).toBeGreaterThan(0)
    expect(screen.getAllByText('GPT-6 Astra').length).toBeGreaterThan(0)
    expect(screen.getAllByText('DeepSeek V4.1 Flash').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Kimi K3.1 Pro').length).toBeGreaterThan(0)
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
