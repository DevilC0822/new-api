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

import { cn } from '@/lib/utils'

import { HERO_DECK_MODELS } from '../constants'

interface SlotTarget {
  x: number
  y: number
  scale: number
  rot: number
  opacity: number
  zIndex: number
}

const SLOT_TARGETS: SlotTarget[] = [
  { x: -10, y: 12, scale: 1, rot: -1.1, opacity: 1, zIndex: 50 },
  { x: 26, y: -18, scale: 0.94, rot: 4.6, opacity: 0.92, zIndex: 40 },
  { x: -28, y: -26, scale: 0.89, rot: -5.8, opacity: 0.78, zIndex: 30 },
  { x: 42, y: -42, scale: 0.84, rot: 8.5, opacity: 0.56, zIndex: 20 },
  { x: -12, y: -50, scale: 0.79, rot: -3.4, opacity: 0.36, zIndex: 10 },
]

interface CardPhysicsState {
  x: number
  y: number
  scale: number
  rot: number
  opacity: number
  vx: number
  vy: number
  vs: number
  vr: number
  vo: number
}

export interface HeroTerminalDemoProps {
  className?: string
  activeIndex: number
  onActiveIndexChange: (index: number) => void
}

export function HeroTerminalDemo(props: HeroTerminalDemoProps) {
  const { t } = useTranslation()
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const activeIdxRef = useRef<number>(props.activeIndex)
  const hoveredIdxRef = useRef<number>(-1)
  const physicsStatesRef = useRef<CardPhysicsState[]>(
    HERO_DECK_MODELS.map((_, idx) => {
      const target = SLOT_TARGETS[idx]
      return {
        x: target.x,
        y: target.y,
        scale: target.scale,
        rot: target.rot,
        opacity: target.opacity,
        vx: 0,
        vy: 0,
        vs: 0,
        vr: 0,
        vo: 0,
      }
    })
  )

  useEffect(() => {
    activeIdxRef.current = props.activeIndex
    const total = HERO_DECK_MODELS.length
    for (let i = 0; i < total; i++) {
      const slot = (i - props.activeIndex + total) % total
      const el = cardRefs.current[i]
      if (el) {
        el.style.zIndex = String(SLOT_TARGETS[slot].zIndex)
      }
    }
  }, [props.activeIndex])

  useEffect(() => {
    let ptrX = 0
    let ptrY = 0
    const onPointerMove = (e: PointerEvent) => {
      ptrX = (e.clientX / window.innerWidth - 0.5) * 2
      ptrY = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })

    let frameId = 0
    let lastTime = performance.now()
    const total = HERO_DECK_MODELS.length

    const stepSpringPhysics = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.032)
      lastTime = now

      const stiffness = 175
      const damping = 21
      const currentActive = activeIdxRef.current
      const currentHovered = hoveredIdxRef.current

      for (let i = 0; i < total; i++) {
        const st = physicsStatesRef.current[i]
        const el = cardRefs.current[i]
        if (!st || !el) continue

        const slot = (i - currentActive + total) % total
        const base = SLOT_TARGETS[slot]

        let hoverNudgeX = 0
        let hoverNudgeY = 0
        let hoverRot = 0
        if (i === currentHovered && slot !== 0) {
          hoverNudgeX = base.x > 0 ? 12 : -12
          hoverNudgeY = -10
          hoverRot = base.rot > 0 ? 1.5 : -1.5
        }

        const depthFactor = slot === 0 ? 1 : (5 - slot) * 0.25
        const tx = base.x + hoverNudgeX + ptrX * 6 * depthFactor
        const ty = base.y + hoverNudgeY + ptrY * 4 * depthFactor
        const ts = base.scale
        const tr = base.rot + hoverRot
        const to = base.opacity

        st.vx += ((tx - st.x) * stiffness - st.vx * damping) * dt
        st.vy += ((ty - st.y) * stiffness - st.vy * damping) * dt
        st.vs += ((ts - st.scale) * stiffness - st.vs * damping) * dt
        st.vr += ((tr - st.rot) * stiffness - st.vr * damping) * dt
        st.vo += ((to - st.opacity) * stiffness - st.vo * damping) * dt

        st.x += st.vx * dt
        st.y += st.vy * dt
        st.scale += st.vs * dt
        st.rot += st.vr * dt
        st.opacity = Math.max(0, Math.min(1, st.opacity + st.vo * dt))

        el.style.transform = `translate3d(${st.x.toFixed(2)}px, ${st.y.toFixed(2)}px, 0) scale(${st.scale.toFixed(4)}) rotate(${st.rot.toFixed(2)}deg)`
        el.style.opacity = st.opacity.toFixed(3)
      }

      frameId = window.requestAnimationFrame(stepSpringPhysics)
    }

    frameId = window.requestAnimationFrame(stepSpringPhysics)
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      window.cancelAnimationFrame(frameId)
    }
  }, [])

  const activeModel = HERO_DECK_MODELS[props.activeIndex] || HERO_DECK_MODELS[0]

  return (
    <div
      className={cn(
        'relative flex min-h-[460px] w-full items-center justify-center select-none',
        props.className
      )}
    >
      {/* Dynamic Aurora Glow */}
      <div
        className='pointer-events-none absolute h-[430px] w-[430px] rounded-full blur-[44px] transition-all duration-500'
        style={{ background: activeModel.glow }}
        aria-hidden='true'
      />

      {/* 5-Card Spring Fanned Stack */}
      <div
        className='relative h-[410px] w-full max-w-[468px]'
        aria-live='polite'
      >
        {HERO_DECK_MODELS.map((m, idx) => {
          const isFront = idx === props.activeIndex
          const initialSlot =
            (idx - props.activeIndex + HERO_DECK_MODELS.length) %
            HERO_DECK_MODELS.length
          const initialTarget = SLOT_TARGETS[initialSlot]

          return (
            <div
              key={m.id}
              ref={(el) => {
                cardRefs.current[idx] = el
              }}
              role='region'
              aria-label={m.name}
              aria-hidden={!isFront}
              onMouseEnter={() => {
                hoveredIdxRef.current = idx
              }}
              onMouseLeave={() => {
                if (hoveredIdxRef.current === idx) {
                  hoveredIdxRef.current = -1
                }
              }}
              onClick={() => {
                if (idx !== props.activeIndex) {
                  props.onActiveIndexChange(idx)
                }
              }}
              style={{
                zIndex: initialTarget.zIndex,
                transform: `translate3d(${initialTarget.x}px, ${initialTarget.y}px, 0) scale(${initialTarget.scale}) rotate(${initialTarget.rot}deg)`,
                opacity: initialTarget.opacity,
              }}
              className={cn(
                'absolute inset-x-0 top-5 overflow-hidden rounded-[24px] bg-white p-[26px_28px] transition-shadow duration-300 will-change-[transform,opacity] dark:bg-zinc-900',
                isFront
                  ? 'cursor-default border border-[#0F172A]/10 shadow-[0_28px_60px_-16px_rgba(15,23,42,0.13),0_8px_20px_-6px_rgba(15,23,42,0.05),inset_0_1px_0_#FFFFFF] dark:border-white/15'
                  : 'cursor-pointer border border-[#0F172A]/[0.08] shadow-[0_14px_30px_-12px_rgba(15,23,42,0.07),0_3px_8px_rgba(15,23,42,0.03)] dark:border-white/10'
              )}
            >
              {/* Top Accent Bar */}
              <div
                className='absolute inset-x-0 top-0 h-1'
                style={{ background: m.accent }}
              />

              {/* Card Top Meta */}
              <div className='mb-3 flex flex-wrap items-center justify-between gap-x-2 gap-y-1'>
                <span
                  className='truncate font-mono text-[11px] font-semibold tracking-[0.04em]'
                  style={{ color: m.color }}
                >
                  {t(m.proto)}
                </span>
                <span className='shrink-0 rounded-full border border-emerald-600/15 bg-emerald-50 px-2 py-0.5 font-mono text-[10.5px] font-semibold whitespace-nowrap text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'>
                  {t(m.badge)}
                </span>
              </div>

              {/* Model Title & ID */}
              <div className='mb-2 flex items-baseline justify-between gap-2.5'>
                <div className='text-[25px] leading-[1.2] font-bold tracking-[-0.025em] text-[#0F172A] dark:text-white'>
                  {m.name}
                </div>
                <span className='font-mono text-[12px] text-[#64748B] dark:text-zinc-400'>
                  {m.ctx}
                </span>
              </div>

              {/* Description */}
              <p className='mb-4 text-[13.5px] leading-[1.6] text-[#64748B] dark:text-zinc-400'>
                {t(m.desc)}
              </p>

              {/* Group Routing & Tiered Pricing Box */}
              <div className='mb-4 rounded-[14px] border border-[#0F172A]/[0.06] bg-[#F8FAFC] p-3.5 dark:border-white/10 dark:bg-zinc-800/60'>
                <div
                  className='mb-1 font-mono text-[11.5px] font-semibold'
                  style={{ color: m.color }}
                >
                  {t(m.thinking)}
                </div>
                <div className='text-[12.5px] leading-[1.55] text-[#334155] dark:text-zinc-300'>
                  {t(m.output)}
                </div>
                <div className='mt-2.5 h-1 overflow-hidden rounded-full bg-slate-200 dark:bg-zinc-700'>
                  <div
                    className='h-full rounded-full'
                    style={{ width: m.savingPct, background: m.accent }}
                  />
                </div>
              </div>

              {/* Footer 3-Column Price Summary */}
              <div className='grid grid-cols-3 gap-2.5 border-t border-[#0F172A]/[0.08] pt-3.5 dark:border-white/10'>
                <div className='flex flex-col justify-between'>
                  <div className='min-h-[32px] text-[10.5px] leading-[1.35] text-[#64748B] dark:text-zinc-400'>
                    {t('Cached read rate')}
                  </div>
                  <div className='mt-0.5 font-mono text-[16px] font-bold tracking-[-0.02em] text-emerald-600 dark:text-emerald-400'>
                    {m.cache}
                  </div>
                </div>
                <div className='flex flex-col justify-between'>
                  <div className='min-h-[32px] text-[10.5px] leading-[1.35] text-[#64748B] dark:text-zinc-400'>
                    {t('Official list price')}
                  </div>
                  <div className='mt-0.5 font-mono text-[15px] font-bold tracking-[-0.02em] text-[#94A3B8] line-through'>
                    {m.off}
                  </div>
                </div>
                <div className='flex flex-col justify-between text-right'>
                  <div className='min-h-[32px] text-[10.5px] leading-[1.35] text-[#64748B] dark:text-zinc-400'>
                    {t('Platform rate')}
                  </div>
                  <div
                    className='mt-0.5 font-mono text-[18px] font-bold tracking-[-0.02em]'
                    style={{ color: m.color }}
                  >
                    {m.our}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
