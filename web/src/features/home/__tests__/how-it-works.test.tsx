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
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { DEFAULT_GATEWAY_ORIGIN } from '@/lib/constants'

import { HowItWorks } from '../components/sections/how-it-works'

describe('HowItWorks client integration workbench', () => {
  test('selects Claude Code by default and switches active client and Base URL when another tab is clicked', () => {
    render(<HowItWorks />)

    const claudeTab = screen.getByRole('tab', { name: /Claude Code/i })
    const codexTab = screen.getByRole('tab', { name: /Codex CLI/i })

    expect(claudeTab).toHaveAttribute('aria-selected', 'true')
    expect(codexTab).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText(DEFAULT_GATEWAY_ORIGIN)).toBeInTheDocument()

    fireEvent.click(codexTab)

    expect(codexTab).toHaveAttribute('aria-selected', 'true')
    expect(claudeTab).toHaveAttribute('aria-selected', 'false')
    expect(screen.getByText(`${DEFAULT_GATEWAY_ORIGIN}/v1`)).toBeInTheDocument()
    expect(screen.getByText(/codex --model gpt-6-astra/)).toBeInTheDocument()
  })

  test('toggles between environment variable snippet and configuration file snippet', () => {
    render(<HowItWorks />)

    expect(
      screen.getByText(/claude --model claude-opus-5-5/)
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: '方式 B · 配置文件' }))

    expect(
      screen.getByText('配置文件（~/.claude/settings.json）')
    ).toBeInTheDocument()
    expect(
      screen.getByText(/"ANTHROPIC_DEFAULT_HAIKU_MODEL"/)
    ).toBeInTheDocument()
  })
})
