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
export interface HeroDeckModel {
  id: string
  name: string
  dotColor: string
  ctx: string
  desc: string
  thinking: string
  output: string
  cache: string
  off: string
  our: string
  accent: string
  color: string
  savingPct: string
  glow: string
}

export const HERO_DECK_MODELS: HeroDeckModel[] = [
  {
    id: 'claude-opus-5-5',
    name: 'Claude Opus 5.5',
    dotColor: '#2563EB',
    ctx: 'claude-opus-5-5',
    desc: 'Ideal for architecture design, complex concurrency troubleshooting, and deep multi-step reasoning.',
    thinking: '● Default route group: Claude 80% off (Ratio 0.2)',
    output:
      'Input $0.80/M (orig. $4.00) · Output $4.00/M (orig. $20.00) · Cache read $0.04/M',
    cache: '$0.04/M',
    off: '$4.00/M',
    our: '$0.80/M',
    accent: 'linear-gradient(90deg, #2563EB, #0891B2)',
    color: '#2563EB',
    savingPct: '80%',
    glow: 'radial-gradient(circle, rgba(37, 99, 235, 0.18) 0%, rgba(8, 145, 178, 0.10) 45%, transparent 72%)',
  },
  {
    id: 'gpt-6-astra',
    name: 'GPT-6 Astra',
    dotColor: '#059669',
    ctx: 'gpt-6-astra',
    desc: 'Supports OpenAI Responses API and Codex CLI, ideal for algorithms, cross-file refactoring, and code review.',
    thinking: '● Default route group: GPT 93% off (Ratio 0.07)',
    output:
      'Tier <=272K: Input $0.70/M (orig. $10.00) · Output $3.50/M (orig. $50.00) · Cache read $0.07/M',
    cache: '$0.07/M',
    off: '$10.00/M',
    our: '$0.70/M',
    accent: 'linear-gradient(90deg, #059669, #0891B2)',
    color: '#059669',
    savingPct: '93%',
    glow: 'radial-gradient(circle, rgba(5, 150, 105, 0.16) 0%, rgba(37, 99, 235, 0.10) 45%, transparent 72%)',
  },
  {
    id: 'deepseek-flash',
    name: 'DeepSeek V4.1 Flash',
    dotColor: '#0891B2',
    ctx: 'deepseek-flash',
    desc: 'Fast responses with automatic off-peak discounts, ideal for high-frequency agent loops.',
    thinking:
      '● Default route group: DeepSeek 25% off (Ratio 0.75 · Off-peak 50% off)',
    output:
      'Off-peak input $0.1125/M (peak $0.225/M) · Off-peak output $0.45/M · Off-peak cache read $0.00225/M',
    cache: '$0.00225/M',
    off: '$0.15/M',
    our: '$0.1125/M',
    accent: 'linear-gradient(90deg, #0891B2, #2563EB)',
    color: '#0891B2',
    savingPct: '62%',
    glow: 'radial-gradient(circle, rgba(8, 145, 178, 0.18) 0%, rgba(37, 99, 235, 0.11) 45%, transparent 72%)',
  },
  {
    id: 'glm-5.3',
    name: 'GLM-5.3',
    dotColor: '#6366F1',
    ctx: 'glm-5.3',
    desc: 'Optimized for full-stack engineering workflows and tool use, with free context caching.',
    thinking: '● Default route group: GLM 80% off (Ratio 0.2 · cc=0)',
    output:
      'Input $0.28/M (orig. $1.40) · Output $0.88/M (orig. $4.40) · Cache read $0.052/M',
    cache: '$0.052/M',
    off: '$1.40/M',
    our: '$0.28/M',
    accent: 'linear-gradient(90deg, #6366F1, #2563EB)',
    color: '#6366F1',
    savingPct: '80%',
    glow: 'radial-gradient(circle, rgba(99, 102, 241, 0.17) 0%, rgba(37, 99, 235, 0.10) 45%, transparent 72%)',
  },
  {
    id: 'kimi-k3',
    name: 'Kimi K3.1 Pro',
    dotColor: '#D97706',
    ctx: 'kimi-k3',
    desc: 'Excels at long technical documentation, synthesis across materials, and codebase comprehension.',
    thinking: '● Default route group: Kimi 65% off (Ratio 0.35)',
    output:
      'Input $1.05/M (orig. $3.00) · Output $5.25/M (orig. $15.00) · Cache read $0.105/M',
    cache: '$0.105/M',
    off: '$3.00/M',
    our: '$1.05/M',
    accent: 'linear-gradient(90deg, #D97706, #F59E0B)',
    color: '#D97706',
    savingPct: '65%',
    glow: 'radial-gradient(circle, rgba(217, 119, 6, 0.16) 0%, rgba(37, 99, 235, 0.10) 45%, transparent 72%)',
  },
]
