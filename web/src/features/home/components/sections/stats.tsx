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
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { useTheme } from '@/context/theme-provider'

function ProceduralPillarCanvas({ mode }: { mode: 1 | 2 | 3 }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let frameId = 0
    const start = performance.now()
    const isDark = resolvedTheme === 'dark'

    const render = (now: number) => {
      const t = (now - start) / 1000
      const dpr = Math.min(window.devicePixelRatio || 2, 2)
      const W = 380
      const H = 96
      if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
        canvas.width = W * dpr
        canvas.height = H * dpr
      }

      ctx.save()
      ctx.scale(dpr, dpr)
      ctx.clearRect(0, 0, W, H)

      if (mode === 1) {
        // 01 智识选路: 26-Strand 3D Silk Aurora Wave with Pearl Halo Nodes
        const strands = 26
        for (let i = 0; i < strands; i++) {
          const depth = i / (strands - 1)
          ctx.beginPath()
          for (let x = 0; x <= W; x += 4) {
            const nx = x / W
            const env = Math.sin(nx * Math.PI)
            const y =
              H * 0.52 +
              Math.sin(nx * 5.2 - t * 1.35 + i * 0.16) * 20 * env +
              Math.cos(nx * 2.8 + t * 0.85 - i * 0.22) * 9 * env +
              (depth - 0.5) * 14 * (1 - env * 0.45)
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          const alpha = 0.05 + (1 - Math.abs(depth - 0.5) * 1.6) * 0.34
          if (i % 6 === 0) {
            ctx.strokeStyle = isDark
              ? `rgba(255, 255, 255, ${alpha * 1.5})`
              : `rgba(255, 255, 255, ${alpha * 2.1})`
            ctx.lineWidth = 1.25
          } else {
            ctx.strokeStyle = isDark
              ? `rgba(220, 226, 236, ${alpha})`
              : `rgba(20, 20, 19, ${alpha})`
            ctx.lineWidth = 0.72
          }
          ctx.stroke()
        }

        const nodePositions = [0.24, 0.52, 0.78]
        nodePositions.forEach((nx, idx) => {
          const x = nx * W
          const i = 6 + idx * 6
          const depth = i / (strands - 1)
          const env = Math.sin(nx * Math.PI)
          const y =
            H * 0.52 +
            Math.sin(nx * 5.2 - t * 1.35 + i * 0.16) * 20 * env +
            Math.cos(nx * 2.8 + t * 0.85 - i * 0.22) * 9 * env +
            (depth - 0.5) * 14 * (1 - env * 0.45)

          const halo = ctx.createRadialGradient(x, y, 0, x, y, 8)
          halo.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
          halo.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = halo
          ctx.beginPath()
          ctx.arc(x, y, 8, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = isDark ? '#ffffff' : '#141413'
          ctx.beginPath()
          ctx.arc(x, y, 2.0, 0, Math.PI * 2)
          ctx.fill()
        })
      } else if (mode === 2) {
        // 02 双栈归一: 3D Dual-Helix Interweaving Silk Ribbon + Central Porcelain Convergence Lens
        const strandsPerStream = 12
        const cx = W * 0.5
        const cy = H * 0.52

        // Subtle ambient glow at the central convergence nexus
        const nexusAura = ctx.createRadialGradient(cx, cy, 2, cx, cy, 42)
        nexusAura.addColorStop(
          0,
          isDark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.92)'
        )
        nexusAura.addColorStop(
          0.5,
          isDark ? 'rgba(180,145,105,0.10)' : 'rgba(226,214,198,0.38)'
        )
        nexusAura.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.fillStyle = nexusAura
        ctx.beginPath()
        ctx.arc(cx, cy, 42, 0, Math.PI * 2)
        ctx.fill()

        // Draw Stream A (Graphite Ink — Anthropic Messages) & Stream B (Warm Bronze/Pearl — OpenAI Responses) braiding into one
        for (let stream = 0; stream < 2; stream++) {
          const sign = stream === 0 ? 1 : -1
          for (let i = 0; i < strandsPerStream; i++) {
            const frac = i / (strandsPerStream - 1) - 0.5
            ctx.beginPath()
            for (let x = 0; x <= W; x += 4) {
              const nx = x / W
              const env = Math.sin(nx * Math.PI)
              // Smoothly converges at nx = 0.5 (the optical lens) and braids with phase offset
              const pinch = Math.abs(nx - 0.5) * 2
              const helix =
                sign *
                Math.sin(nx * Math.PI * 2.2 - t * 1.25 + frac * 0.55) *
                21 *
                env
              const spread =
                frac * (14 * (0.28 + 0.72 * Math.pow(pinch, 0.85)))
              const harmonic =
                Math.cos(nx * Math.PI * 4.0 + t * 0.9 + stream * 1.4) *
                2.5 *
                env
              const y = cy + helix + spread + harmonic
              if (x === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }

            const baseAlpha = 0.08 + (1 - Math.abs(frac) * 1.5) * 0.34
            if (i === Math.floor(strandsPerStream / 2)) {
              let leadStroke: string
              if (stream === 0) {
                leadStroke = isDark
                  ? 'rgba(255,255,255,0.78)'
                  : 'rgba(20,20,19,0.72)'
              } else {
                leadStroke = isDark
                  ? 'rgba(230,195,150,0.78)'
                  : 'rgba(154,118,78,0.72)'
              }
              ctx.strokeStyle = leadStroke
              ctx.lineWidth = 1.25
            } else if (i % 4 === 0) {
              ctx.strokeStyle = `rgba(255, 255, 255, ${baseAlpha * 1.9})`
              ctx.lineWidth = 1.05
            } else {
              let strandStroke: string
              if (stream === 0) {
                strandStroke = isDark
                  ? `rgba(220,226,236,${baseAlpha})`
                  : `rgba(20,20,19,${baseAlpha})`
              } else {
                strandStroke = isDark
                  ? `rgba(215,185,148,${baseAlpha})`
                  : `rgba(148,112,72,${baseAlpha * 0.95})`
              }
              ctx.strokeStyle = strandStroke
              ctx.lineWidth = 0.72
            }
            ctx.stroke()
          }
        }

        // Central Vertical Optical Crystal Ring at x = 0.5
        ctx.save()
        ctx.strokeStyle = isDark
          ? 'rgba(255,255,255,0.45)'
          : 'rgba(255,255,255,0.92)'
        ctx.lineWidth = 1.6
        ctx.beginPath()
        ctx.ellipse(cx, cy, 8, 25, 0, 0, Math.PI * 2)
        ctx.stroke()

        ctx.strokeStyle = isDark
          ? 'rgba(255,255,255,0.22)'
          : 'rgba(20,20,19,0.22)'
        ctx.lineWidth = 0.85
        ctx.beginPath()
        ctx.ellipse(cx, cy, 15, 32, 0, 0, Math.PI * 2)
        ctx.stroke()
        ctx.restore()

        // Flowing photon pearls along the two braided streams + central nexus pearl
        const pearls = [
          { nx: 0.22, stream: 0 },
          { nx: 0.22, stream: 1 },
          { nx: 0.5, stream: 0 },
          { nx: 0.78, stream: 0 },
          { nx: 0.78, stream: 1 },
        ]
        pearls.forEach((p, idx) => {
          const x = p.nx * W
          const sign = p.stream === 0 ? 1 : -1
          const env = Math.sin(p.nx * Math.PI)
          const y =
            idx === 2
              ? cy
              : cy +
                sign * Math.sin(p.nx * Math.PI * 2.2 - t * 1.25) * 21 * env +
                Math.cos(p.nx * Math.PI * 4.0 + t * 0.9 + p.stream * 1.4) *
                  2.5 *
                  env

          const r = idx === 2 ? 9 : 6
          const glow = ctx.createRadialGradient(x, y, 0, x, y, r)
          glow.addColorStop(0, 'rgba(255,255,255,0.98)')
          glow.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fill()

          let pearlFill = '#8C6B48'
          if (p.stream !== 1 || idx === 2) {
            pearlFill = isDark ? '#ffffff' : '#141413'
          }
          ctx.fillStyle = pearlFill
          ctx.beginPath()
          ctx.arc(x, y, idx === 2 ? 2.5 : 1.85, 0, Math.PI * 2)
          ctx.fill()
        })
      } else {
        // 03 澄明计量: 22-Strand Sculptural Harmonic Wave Field
        const lines = 22
        for (let i = 0; i < lines; i++) {
          const ratio = i / (lines - 1)
          const spread = (ratio - 0.5) * 44
          ctx.beginPath()
          for (let x = 0; x <= W; x += 4) {
            const nx = x / W
            const pinch = 1 - Math.sin(nx * Math.PI) * 0.58
            const wave =
              Math.sin(nx * Math.PI * 2.4 - t * 1.15 + ratio * 1.9) * 12 +
              Math.cos(nx * Math.PI * 1.2 + t * 0.75) * 4
            const y =
              H * 0.52 + spread * pinch + wave * (1 - Math.abs(ratio - 0.5))
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          const alpha = 0.05 + (1 - Math.abs(ratio - 0.5) * 1.7) * 0.36
          if (i === Math.floor(lines / 2)) {
            const g = ctx.createLinearGradient(0, 0, W, 0)
            g.addColorStop(
              0,
              isDark ? 'rgba(255,255,255,0.1)' : 'rgba(20,20,19,0.15)'
            )
            g.addColorStop(
              0.5,
              isDark ? 'rgba(255,235,205,0.75)' : 'rgba(180,140,96,0.55)'
            )
            g.addColorStop(
              1,
              isDark ? 'rgba(255,255,255,0.1)' : 'rgba(20,20,19,0.15)'
            )
            ctx.strokeStyle = g
            ctx.lineWidth = 1.3
          } else if (i % 5 === 0) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 1.9})`
            ctx.lineWidth = 1.05
          } else {
            ctx.strokeStyle = isDark
              ? `rgba(220, 226, 236, ${alpha})`
              : `rgba(20, 20, 19, ${alpha})`
            ctx.lineWidth = 0.72
          }
          ctx.stroke()
        }
      }

      ctx.restore()
      frameId = window.requestAnimationFrame(render)
    }

    frameId = window.requestAnimationFrame(render)
    return () => window.cancelAnimationFrame(frameId)
  }, [mode, resolvedTheme])

  return (
    <canvas
      ref={canvasRef}
      className='pointer-events-none h-[96px] w-full'
      aria-hidden='true'
    />
  )
}

export function Stats() {
  const { t } = useTranslation()

  const pillars = [
    {
      num: '01',
      mode: 1 as const,
      title: t('Intelligent Routing'),
      headline: t('Sub-millisecond adaptive model routing.'),
      desc: t(
        'Dynamic path optimization routing your code tasks to optimal models in real-time with microsecond latency.'
      ),
    },
    {
      num: '02',
      mode: 2 as const,
      title: t('Agentic Synthesis'),
      headline: t('Autonomous agent orchestration.'),
      desc: t(
        'High-context, multi-step code synthesis and execution environments with robust sandboxing.'
      ),
    },
    {
      num: '03',
      mode: 3 as const,
      title: t('Absolute Integrity'),
      headline: t('Guaranteed security and privacy.'),
      desc: t(
        'Strict enterprise-grade security protocols, zero-data retention pathways, and absolute reliability.'
      ),
    },
  ]

  const telemetryItems = [
    {
      value: '< 1.8 ms',
      label: t('Optical Stream Overhead'),
      detail: t('Zero-buffer SSE passthrough for uninterrupted coding sessions'),
    },
    {
      value: '99.98%',
      label: t('Multi-Region Failover SLA'),
      detail: t('Silent sub-second rerouting on upstream rate limits'),
    },
    {
      value: '-95%',
      label: t('Prompt Cache Precision'),
      detail: t('Native cache token accounting for iterative agent loops'),
    },
    {
      value: '0 留存',
      label: t('Ledger Granularity'),
      detail: t('Auditable per-request input, output, and thinking token logs'),
    },
  ]

  return (
    <section id='architecture' className='relative z-10 py-10 md:py-14'>
      <div className='mx-auto max-w-[1280px] px-6 md:px-12'>
        {/* Top Hairline & 3-Column Equal-Height Architectural Triptych */}
        <div className='border-border border-t pt-10'>
          <div className='grid grid-cols-1 items-stretch gap-10 md:grid-cols-3 md:gap-11'>
            {pillars.map((pillar, idx) => (
              <AnimateInView
                key={pillar.num}
                delay={idx * 80}
                animation='fade-up'
                className='flex h-full flex-col'
              >
                <div>
                  <div className='flex items-baseline gap-2.5'>
                    <span className='text-muted-foreground font-serif text-[20px] font-normal tabular-nums'>
                      {pillar.num}
                    </span>
                    <h2 className='text-foreground font-serif text-[20px] font-normal tracking-tight'>
                      {pillar.title}
                    </h2>
                  </div>

                  {/* Real-Time Fluid Mathematical Wave / Dual-Helix Braided Canvas */}
                  <div className='my-4 w-full overflow-hidden'>
                    <ProceduralPillarCanvas mode={pillar.mode} />
                  </div>
                </div>

                <div>
                  <h3 className='text-foreground mb-1 text-[14px] font-semibold tracking-tight'>
                    {pillar.headline}
                  </h3>
                  <p className='text-muted-foreground text-[13px] leading-[1.6]'>
                    {pillar.desc}
                  </p>
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>

        {/* Strictly Aligned 4-Column Porcelain Telemetry Bar */}
        <div className='border-border mt-12 grid grid-cols-2 border-y md:grid-cols-4'>
          {telemetryItems.map((item, idx) => (
            <div
              key={item.label}
              className={`flex flex-col justify-between py-7 ${
                idx !== 0 ? 'md:border-border md:border-l md:pl-8' : ''
              } ${idx !== telemetryItems.length - 1 ? 'md:pr-6' : ''}`}
            >
              <div>
                <div className='text-foreground font-serif text-2xl font-normal tracking-tight tabular-nums md:text-[28px]'>
                  {item.value}
                </div>
                <div className='text-foreground mt-2 text-[13.5px] font-semibold'>
                  {item.label}
                </div>
              </div>
              <p className='text-muted-foreground mt-1 text-[12px] leading-relaxed'>
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
