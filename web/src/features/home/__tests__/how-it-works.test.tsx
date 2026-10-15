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
import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { HowItWorks } from '../components/sections/how-it-works'

describe('HowItWorks status hint strip', () => {
  test('renders each gateway status hint with its code, title and description', () => {
    render(<HowItWorks />)

    const hints = [
      {
        code: '200 OK',
        title: '连接正常',
        description: '已直连上游模型',
      },
      {
        code: '401 Auth',
        title: '鉴权失败',
        description: '请检查密钥或 Base URL 格式',
      },
      {
        code: '429 / 529',
        title: '并发超限',
        description: '上游繁忙，自动切换热备通道',
      },
    ]

    for (const hint of hints) {
      expect(screen.getByText(hint.code)).toBeInTheDocument()
      expect(screen.getByText(hint.title)).toBeInTheDocument()
      expect(screen.getByText(hint.description)).toBeInTheDocument()
    }
  })
})
