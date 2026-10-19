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
  it('renders the porcelain docs header, default gateway origin, and core sections when loaded', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderDocsPage()

    expect(
      screen.getByRole('heading', { name: /MIHOUO 统一网关技术手册/ })
    ).toBeInTheDocument()
    expect(
      screen.getAllByText('https://api.mihouo.com').length
    ).toBeGreaterThan(0)
    expect(
      screen.getByRole('heading', { name: '平台架构与核心优势' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '客户端与 IDE 深度接入指南' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '多协议 API 接口参考' })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '状态码参考与热备容灾' })
    ).toBeInTheDocument()
  })

  it('switches client configuration and toggles between environment variables and config file when user selects Codex CLI', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderDocsPage()

    const codexTab = screen.getByRole('tab', { name: /Codex CLI/ })
    fireEvent.click(codexTab)

    expect(codexTab).toHaveAttribute('aria-selected', 'true')
    expect(
      screen.getByRole('heading', { name: /配置 Codex CLI/ })
    ).toBeInTheDocument()
    expect(screen.getByText(/codex --model gpt-6-astra/)).toBeInTheDocument()

    const configFileBtn = screen.getByRole('button', {
      name: '方式 B · 配置文件',
    })
    fireEvent.click(configFileBtn)

    expect(
      screen.getByText('持久化配置文件（~/.codex/config.toml）')
    ).toBeInTheDocument()
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
    expect(screen.getByText('max_output_tokens')).toBeInTheDocument()
  })

  it('filters sections by search keyword and restores all sections when reset button is clicked', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderDocsPage()

    const searchInput = screen.getByRole('searchbox', {
      name: '搜索文档内容',
    })
    fireEvent.change(searchInput, {
      target: { value: 'nonexistent-keyword-xyz' },
    })

    expect(
      screen.getByRole('heading', { name: '未找到匹配的文档章节' })
    ).toBeInTheDocument()

    const resetBtn = screen.getByRole('button', {
      name: '重置搜索并查看全部章节',
    })
    fireEvent.click(resetBtn)

    expect(
      screen.getByRole('heading', { name: '平台架构与核心优势' })
    ).toBeInTheDocument()
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

  it('renders the MIHOUO About showcase page and switches architecture inspector tabs', async () => {
    useSystemConfigStore.setState({ loading: false })
    await renderPublicPage('/about')

    expect(
      screen.getByRole('heading', { name: /如火传薪，为下一代智能工程/ })
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: '三大核心工程准则' })
    ).toBeInTheDocument()

    const securityTab = screen.getByRole('tab', {
      name: /零留存隐私与安全治理/,
    })
    fireEvent.click(securityTab)

    expect(
      screen.getByRole('heading', { name: '零载荷数据留存承诺' })
    ).toBeInTheDocument()
  })
})
