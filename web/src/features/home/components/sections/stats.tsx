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

function ProceduralPillarCanvas(props: { mode: 1 | 2 | 3 }) {
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

      const cy = H * 0.52

      if (props.mode === 1) {
        // 01 智识选路: 1-to-3 Multi-Route Topology (Active Optimal Route + 2 Standby Failover Lanes)
        const sampleLaneY = (
          nx: number,
          laneOffset: number,
          strandOffset: number
        ) => {
          let splitEnv = 0
          if (nx > 0.12 && nx < 0.88) {
            const u = (nx - 0.12) / 0.76
            splitEnv = Math.pow(Math.sin(u * Math.PI), 1.35)
          }
          const pulse = Math.sin(nx * Math.PI * 3.0 - t * 1.8) * 1.4 * splitEnv
          return (
            cy +
            laneOffset * splitEnv +
            strandOffset * (0.35 + 0.65 * splitEnv) +
            pulse
          )
        }

        const standbyLanes = [0, 22]
        standbyLanes.forEach((laneOffset) => {
          for (let s = -1; s <= 1; s++) {
            ctx.beginPath()
            for (let x = 0; x <= W; x += 4) {
              const nx = x / W
              const y = sampleLaneY(nx, laneOffset, s * 2.2)
              if (x === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            ctx.strokeStyle = isDark
              ? `rgba(220, 226, 236, ${s === 0 ? 0.22 : 0.09})`
              : `rgba(20, 20, 19, ${s === 0 ? 0.18 : 0.07})`
            ctx.lineWidth = s === 0 ? 0.9 : 0.65
            if (laneOffset > 0 && s === 0) {
              ctx.setLineDash([3, 3])
            }
            ctx.stroke()
            ctx.setLineDash([])
          }
        })

        const activeStrands = 9
        const leadIdx = Math.floor(activeStrands / 2)
        for (let i = 0; i < activeStrands; i++) {
          const frac = (i - leadIdx) / leadIdx
          ctx.beginPath()
          for (let x = 0; x <= W; x += 4) {
            const nx = x / W
            const y = sampleLaneY(nx, -22, frac * 5.5)
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
          }
          const alpha = 0.14 + (1 - Math.abs(frac)) * 0.42
          if (i === leadIdx) {
            ctx.strokeStyle = isDark
              ? 'rgba(255, 255, 255, 0.88)'
              : 'rgba(20, 20, 19, 0.82)'
            ctx.lineWidth = 1.35
          } else {
            ctx.strokeStyle = isDark
              ? `rgba(220, 226, 236, ${alpha * 0.7})`
              : `rgba(20, 20, 19, ${alpha * 0.65})`
            ctx.lineWidth = 0.75
          }
          ctx.stroke()
        }

        const routeNodes = [
          { nx: 0.14, lane: -22, active: true },
          { nx: 0.5, lane: -22, active: true },
          { nx: 0.5, lane: 0, active: false },
          { nx: 0.5, lane: 22, active: false },
          { nx: 0.86, lane: -22, active: true },
        ]
        routeNodes.forEach((node) => {
          const x = node.nx * W
          const y = sampleLaneY(node.nx, node.lane, 0)
          if (node.active) {
            const halo = ctx.createRadialGradient(x, y, 0, x, y, 8)
            halo.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
            halo.addColorStop(1, 'rgba(255, 255, 255, 0)')
            ctx.fillStyle = halo
            ctx.beginPath()
            ctx.arc(x, y, 8, 0, Math.PI * 2)
            ctx.fill()

            ctx.fillStyle = isDark ? '#ffffff' : '#141413'
            ctx.beginPath()
            ctx.arc(x, y, 2.1, 0, Math.PI * 2)
            ctx.fill()
          } else {
            ctx.fillStyle = isDark
              ? 'rgba(255, 255, 255, 0.32)'
              : 'rgba(20, 20, 19, 0.28)'
            ctx.beginPath()
            ctx.arc(x, y, 1.6, 0, Math.PI * 2)
            ctx.fill()
          }
        })
      } else if (props.mode === 2) {
        // 02 双栈归一: 2-to-1 Protocol Convergence (Two Separate Left Streams -> Central Gateway Lens -> Single Unified Right Stream)
        const strandsPerStream = 9
        const cx = W * 0.5

        const sampleDualToSingleY = (
          nx: number,
          stream: number,
          frac: number
        ) => {
          const sign = stream === 0 ? -1 : 1
          if (nx <= 0.5) {
            const u = nx / 0.5
            const sep = 0.5 * (1 + Math.cos(u * Math.PI))
            const branchOffset = sign * 21 * sep
            const branchSpread = frac * (7.5 * sep + 1.2 * (1 - sep))
            const ripple =
              Math.sin(u * Math.PI) *
              Math.sin(nx * Math.PI * 4.0 - t * 1.8 + stream * 1.2) *
              1.8
            return cy + branchOffset + branchSpread + ripple
          }

          const v = (nx - 0.5) / 0.5
          const fadeIn = Math.sin(v * Math.PI)
          const microBraiding =
            sign * Math.sin(v * Math.PI * 2.5 - t * 2.2) * 2.4 * fadeIn
          const unifiedSpread = frac * 3.2 * (0.45 + 0.55 * (1 - v * 0.4))
          return cy + microBraiding + unifiedSpread
        }

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

        const leadIndex = Math.floor(strandsPerStream / 2)
        for (let stream = 0; stream < 2; stream++) {
          for (let i = 0; i < strandsPerStream; i++) {
            const frac = i === leadIndex ? 0 : (i - leadIndex) / leadIndex
            ctx.beginPath()
            for (let x = 0; x <= W; x += 4) {
              const nx = x / W
              const y = sampleDualToSingleY(nx, stream, frac * 0.5)
              if (x === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }

            const baseAlpha = 0.1 + (1 - Math.abs(frac) * 0.75) * 0.32
            if (i === leadIndex) {
              let leadStroke: string
              if (stream === 0) {
                leadStroke = isDark
                  ? 'rgba(255,255,255,0.82)'
                  : 'rgba(20,20,19,0.78)'
              } else {
                leadStroke = isDark
                  ? 'rgba(230,195,150,0.82)'
                  : 'rgba(154,118,78,0.78)'
              }
              ctx.strokeStyle = leadStroke
              ctx.lineWidth = 1.3
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

        const pearls = [
          { nx: 0.18, stream: 0, isCenter: false },
          { nx: 0.18, stream: 1, isCenter: false },
          { nx: 0.5, stream: 0, isCenter: true },
          { nx: 0.72, stream: 0, isCenter: false },
          { nx: 0.86, stream: 1, isCenter: false },
        ]
        pearls.forEach((p) => {
          const x = p.nx * W
          const y = p.isCenter ? cy : sampleDualToSingleY(p.nx, p.stream, 0)

          const r = p.isCenter ? 9 : 6
          const glow = ctx.createRadialGradient(x, y, 0, x, y, r)
          glow.addColorStop(0, 'rgba(255,255,255,0.98)')
          glow.addColorStop(1, 'rgba(255,255,255,0)')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(x, y, r, 0, Math.PI * 2)
          ctx.fill()

          let pearlFill = '#8C6B48'
          if (p.stream !== 1 || p.isCenter) {
            pearlFill = isDark ? '#ffffff' : '#141413'
          }
          ctx.fillStyle = pearlFill
          ctx.beginPath()
          ctx.arc(x, y, p.isCenter ? 2.6 : 1.9, 0, Math.PI * 2)
          ctx.fill()
        })
      } else {
        // 03 澄明计量: 3-Layer Stratified Token Ledger (Input / Thinking / 95% Cache Hit) + Precision Calibration Ticks
        const tickCount = 19
        for (let i = 1; i < tickCount; i++) {
          const tx = (i / tickCount) * W
          const isMajor = i % 3 === 0
          const halfH = isMajor ? 28 : 16
          ctx.strokeStyle = isDark
            ? `rgba(255, 255, 255, ${isMajor ? 0.12 : 0.05})`
            : `rgba(20, 20, 19, ${isMajor ? 0.1 : 0.045})`
          ctx.lineWidth = 0.75
          ctx.beginPath()
          ctx.moveTo(tx, cy - halfH)
          ctx.lineTo(tx, cy + halfH)
          ctx.stroke()
        }

        const ledgerBands = [
          { baseOffset: -17, amp: 2.2, phase: 0, isAccent: false },
          { baseOffset: 0, amp: 2.8, phase: 1.4, isAccent: true },
          { baseOffset: 17, amp: 2.2, phase: 2.8, isAccent: false },
        ]

        const sampleBandY = (
          nx: number,
          bandIdx: number,
          subOffset: number
        ) => {
          const band = ledgerBands[bandIdx]
          const env = Math.sin(nx * Math.PI)
          const wave =
            Math.sin(nx * Math.PI * 3.0 - t * 1.4 + band.phase) * band.amp * env
          return cy + band.baseOffset + wave + subOffset * env
        }

        ledgerBands.forEach((band, bandIdx) => {
          for (let s = -2; s <= 2; s++) {
            const isLead = s === 0
            ctx.beginPath()
            for (let x = 0; x <= W; x += 4) {
              const nx = x / W
              const y = sampleBandY(nx, bandIdx, s * 1.35)
              if (x === 0) ctx.moveTo(x, y)
              else ctx.lineTo(x, y)
            }
            if (isLead) {
              if (band.isAccent) {
                ctx.strokeStyle = isDark
                  ? 'rgba(230, 195, 150, 0.82)'
                  : 'rgba(154, 118, 78, 0.78)'
              } else {
                ctx.strokeStyle = isDark
                  ? 'rgba(255, 255, 255, 0.72)'
                  : 'rgba(20, 20, 19, 0.68)'
              }
              ctx.lineWidth = 1.2
            } else {
              const alpha = 0.18 - Math.abs(s) * 0.05
              if (band.isAccent) {
                ctx.strokeStyle = isDark
                  ? `rgba(215, 185, 148, ${alpha})`
                  : `rgba(148, 112, 72, ${alpha})`
              } else {
                ctx.strokeStyle = isDark
                  ? `rgba(220, 226, 236, ${alpha})`
                  : `rgba(20, 20, 19, ${alpha})`
              }
              ctx.lineWidth = 0.68
            }
            ctx.stroke()
          }
        })

        const checkpoints = [
          { nx: 0.25, bandIdx: 0 },
          { nx: 0.5, bandIdx: 1 },
          { nx: 0.75, bandIdx: 2 },
        ]
        checkpoints.forEach((cp) => {
          const x = cp.nx * W
          const y = sampleBandY(cp.nx, cp.bandIdx, 0)
          const glow = ctx.createRadialGradient(x, y, 0, x, y, 6)
          glow.addColorStop(0, 'rgba(255, 255, 255, 0.95)')
          glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
          ctx.fillStyle = glow
          ctx.beginPath()
          ctx.arc(x, y, 6, 0, Math.PI * 2)
          ctx.fill()

          let cpColor = '#141413'
          if (cp.bandIdx === 1) {
            cpColor = '#8C6B48'
          } else if (isDark) {
            cpColor = '#ffffff'
          }
          ctx.fillStyle = cpColor
          ctx.beginPath()
          ctx.arc(x, y, 2.0, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      ctx.restore()
      frameId = window.requestAnimationFrame(render)
    }

    frameId = window.requestAnimationFrame(render)
    return () => window.cancelAnimationFrame(frameId)
  }, [props.mode, resolvedTheme])

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
      desc: t(
        'Dynamic path selection based on real-time TTFT and upstream health keeps every coding instruction responsive.'
      ),
    },
    {
      num: '02',
      mode: 2 as const,
      title: t('Agentic Synthesis'),
      desc: t(
        'One api.mihouo.com endpoint unifies Anthropic, OpenAI, and Google protocols for multi-step repository synthesis.'
      ),
    },
    {
      num: '03',
      mode: 3 as const,
      title: t('Absolute Integrity'),
      desc: t(
        'Strict zero-retention passthrough with micro-token accounting across input, reasoning, and prompt cache hits.'
      ),
    },
  ]

  const telemetryItems = [
    {
      value: '< 1.8 ms',
      label: t('Optical Stream Overhead'),
    },
    {
      value: '99.98%',
      label: t('Multi-Region Failover SLA'),
    },
    {
      value: '-95%',
      label: t('Prompt Cache Precision'),
    },
    {
      value: '0 留存',
      label: t('Ledger Granularity'),
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
                className='flex h-full flex-col justify-between'
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

                <p className='text-muted-foreground text-[13px] leading-[1.6]'>
                  {pillar.desc}
                </p>
              </AnimateInView>
            ))}
          </div>
        </div>

        {/* Strictly Aligned 4-Column Porcelain Telemetry Bar */}
        <div className='border-border mt-10 grid grid-cols-2 border-y md:grid-cols-4'>
          {telemetryItems.map((item, idx) => (
            <div
              key={item.label}
              className={`flex flex-col justify-between py-5 ${
                idx !== 0 ? 'md:border-border md:border-l md:pl-8' : ''
              } ${idx !== telemetryItems.length - 1 ? 'md:pr-6' : ''}`}
            >
              <div className='text-foreground font-serif text-2xl font-normal tracking-tight tabular-nums md:text-[28px]'>
                {item.value}
              </div>
              <div className='text-muted-foreground mt-1.5 text-[13px] font-medium'>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
