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
import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import type { PricingData } from '@/features/pricing/types'
import { api } from '@/lib/api'
import {
  DEFAULT_CURRENCY_CONFIG,
  useSystemConfigStore,
} from '@/stores/system-config-store'

import { PriceCompare } from '../components/sections/price-compare'

function pricingFixture(): PricingData {
  return {
    success: true,
    group_ratio: { 'Claude-2折': 0.2, default: 1 },
    usable_group: {},
    vendors: [],
    supported_endpoint: {},
    auto_groups: [],
    data: [
      {
        id: 1,
        model_name: 'claude-opus-5-5',
        quota_type: 0,
        model_ratio: 1,
        completion_ratio: 1,
        enable_groups: ['Claude-2折'],
        billing_mode: 'tiered_expr',
        billing_expr: 'tier("standard", p * 4 + c * 20)',
      },
      {
        id: 2,
        model_name: 'plain-model',
        quota_type: 0,
        model_ratio: 1,
        completion_ratio: 1,
        enable_groups: ['default'],
      },
    ],
  } as unknown as PricingData
}

async function renderSection() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const root = createRootRoute({ component: Outlet })
  const indexRoute = createRoute({
    getParentRoute: () => root,
    path: '/',
    component: () => <PriceCompare />,
  })
  const router = createRouter({
    routeTree: root.addChildren([indexRoute]),
    history: createMemoryHistory({ initialEntries: ['/'] }),
  })
  await router.load()
  const view = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  )
  return { view, queryClient }
}

describe('homepage price comparison section', () => {
  it('shows official vs discounted prices, the discount tag and the genuine-models promise', async () => {
    useSystemConfigStore.getState().setConfig({
      currency: { ...DEFAULT_CURRENCY_CONFIG, quotaDisplayType: 'USD' },
    })
    const request = vi
      .spyOn(api, 'get')
      .mockResolvedValue({ data: pricingFixture() })

    await renderSection()

    await waitFor(() =>
      expect(screen.getByText('claude-opus-5-5')).toBeInTheDocument()
    )
    expect(request).toHaveBeenCalledWith('/api/pricing')

    // Official base prices ($4 / $20) and the discounted 2折 prices ($0.8 / $4)
    expect(screen.getByText('$4 / $20')).toBeInTheDocument()
    expect(screen.getByText('$0.8 / $4')).toBeInTheDocument()
    expect(screen.getByText('80% off')).toBeInTheDocument()
    expect(
      screen.getByText(
        'All models come from official plans — 100% genuine, never watered down'
      )
    ).toBeInTheDocument()
    // The decorative PRICING eyebrow above the H2 was removed
    expect(screen.queryByText('PRICING')).not.toBeInTheDocument()
    // Models without expression pricing are omitted from the table
    expect(screen.queryByText('plain-model')).not.toBeInTheDocument()
  })

  it('renders nothing when pricing data is unavailable', async () => {
    vi.spyOn(api, 'get').mockRejectedValue(new Error('down'))
    const { view, queryClient } = await renderSection()
    await waitFor(() =>
      expect(queryClient.getQueryState(['pricing'])?.status).toBe('error')
    )
    // Error state: the comparison headline never appears
    expect(
      screen.queryByText('Official Price vs Our Price')
    ).not.toBeInTheDocument()
    expect(view.container).toBeTruthy()
  })
})
