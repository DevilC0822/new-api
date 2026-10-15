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

import { useTheme } from '@/context/theme-provider'
import { cn } from '@/lib/utils'

interface HeroTerminalDemoProps {
  className?: string
  activeIndex: number
  onActiveIndexChange: (index: number) => void
}

interface PrismRouteNode {
  id: string
  labelKey: string
  protocol: string
  latency: string
  metricKey: string
  topPercent: number
  targetY: number
}

const PRISM_NODES: PrismRouteNode[] = [
  {
    id: 'claude-opus-5-5',
    labelKey: 'Claude Opus 5.5',
    protocol: 'POST /v1/messages',
    latency: '11ms TTFT',
    metricKey: '1M 上下文 · 自适应深度思考',
    topPercent: 18,
    targetY: 61,
  },
  {
    id: 'gpt-6-astra-sol',
    labelKey: 'GPT-6 Astra / Sol',
    protocol: 'POST /v1/responses',
    latency: '13ms TTFT',
    metricKey: '1.05M 上下文 · 异步工具调用',
    topPercent: 38,
    targetY: 129,
  },
  {
    id: 'gemini-4-argon',
    labelKey: 'Gemini 4 Argon',
    protocol: 'POST /v1beta',
    latency: '14ms TTFT',
    metricKey: '1M 多模态上下文 · 跨仓库分析',
    topPercent: 58,
    targetY: 197,
  },
  {
    id: 'deepseek-v4-pro',
    labelKey: 'DeepSeek V4 Pro',
    protocol: 'CACHE HIT // -97%',
    latency: '缓存立减 97%',
    metricKey: '1M 上下文 · 384K 输出 · 闲时半价',
    topPercent: 78,
    targetY: 265,
  },
]

function drawFluidOpticalPrism(
  canvas: HTMLCanvasElement,
  timeSec: number,
  activeIdx: number,
  pointer: { x: number; y: number },
  isDark: boolean
) {
  const dpr = Math.min(window.devicePixelRatio || 2, 2)
  const W = 640
  const H = 340
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width = W * dpr
    canvas.height = H * dpr
  }
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  ctx.save()
  ctx.scale(dpr, dpr)
  ctx.clearRect(0, 0, W, H)

  // Smooth organic levitation & damped cursor parallax
  const floatY = Math.sin(timeSec * 1.15) * 4.5 + pointer.y * 6
  const swayX = Math.cos(timeSec * 0.85) * 3.5 + pointer.x * 9

  // 1. Pearlescent Ambient Aura behind the Crystal
  const aura = ctx.createRadialGradient(
    244,
    166 + floatY * 0.5,
    12,
    244,
    166,
    205
  )
  if (isDark) {
    aura.addColorStop(0, 'rgba(255, 255, 255, 0.14)')
    aura.addColorStop(0.5, 'rgba(148, 163, 184, 0.06)')
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)')
  } else {
    aura.addColorStop(0, 'rgba(255, 255, 255, 0.94)')
    aura.addColorStop(0.45, 'rgba(232, 238, 246, 0.48)')
    aura.addColorStop(0.75, 'rgba(246, 236, 224, 0.24)')
    aura.addColorStop(1, 'rgba(243, 242, 237, 0)')
  }
  ctx.fillStyle = aura
  ctx.beginPath()
  ctx.arc(244, 166, 205, 0, Math.PI * 2)
  ctx.fill()

  // Outer Crystal Pyramid Vertices
  const apex = { x: 244 + swayX * 0.65, y: 24 + floatY }
  const baseL = { x: 80 - swayX * 0.3, y: 246 + floatY * 0.7 }
  const baseC = { x: 262 + swayX * 0.4, y: 304 + floatY * 0.9 }
  const baseR = { x: 406 + swayX * 0.3, y: 230 + floatY * 0.65 }
  const baseBack = { x: 224 - swayX * 0.2, y: 178 + floatY * 0.5 }

  // 2. Breathing Studio Floor Shadow & Caustic Light Ring
  ctx.save()
  const shadowScale = 1 - floatY * 0.012
  const floorShadow = ctx.createRadialGradient(
    258,
    284,
    12,
    264,
    288,
    185 * shadowScale
  )
  if (isDark) {
    floorShadow.addColorStop(0, 'rgba(0, 0, 0, 0.55)')
    floorShadow.addColorStop(0.5, 'rgba(0, 0, 0, 0.22)')
    floorShadow.addColorStop(1, 'rgba(0, 0, 0, 0)')
  } else {
    floorShadow.addColorStop(0, 'rgba(24, 26, 23, 0.18)')
    floorShadow.addColorStop(0.48, 'rgba(24, 26, 23, 0.07)')
    floorShadow.addColorStop(1, 'rgba(24, 26, 23, 0)')
  }
  ctx.fillStyle = floorShadow
  ctx.beginPath()
  ctx.ellipse(
    264,
    288,
    185 * shadowScale,
    40 * shadowScale,
    -0.04,
    0,
    Math.PI * 2
  )
  ctx.fill()

  // Subtle breathing caustic light ring on the floor
  ctx.strokeStyle = isDark
    ? 'rgba(255, 255, 255, 0.16)'
    : 'rgba(255, 255, 255, 0.72)'
  ctx.lineWidth = 1.15
  ctx.beginPath()
  ctx.ellipse(
    256,
    278,
    114 * shadowScale,
    21 * shadowScale,
    -0.04,
    0,
    Math.PI * 2
  )
  ctx.stroke()
  ctx.restore()

  // 3. Back Half of 3D Orbital Gyroscope Ring (behind the crystal)
  const ringCx = 246 + swayX * 0.25
  const ringCy = 172 + floatY * 0.75
  ctx.save()
  ctx.translate(ringCx, ringCy)
  ctx.rotate(-0.22 + Math.sin(timeSec * 0.5) * 0.03)
  ctx.strokeStyle = isDark
    ? 'rgba(255, 255, 255, 0.14)'
    : 'rgba(24, 24, 27, 0.12)'
  ctx.lineWidth = 0.9
  ctx.beginPath()
  ctx.ellipse(0, 0, 178, 42, 0, Math.PI, Math.PI * 2)
  ctx.stroke()
  ctx.restore()

  // 4. Multi-Strand Silk Incoming Light Stream (Left -> Entry Point)
  const entryPt = { x: 164 + swayX * 0.2, y: 132 + floatY * 0.8 }
  const exitPt = { x: 302 + swayX * 0.3, y: 160 + floatY * 0.75 }

  for (let s = -2; s <= 2; s++) {
    const isMain = s === 0
    ctx.beginPath()
    ctx.moveTo(4, 96 + s * 3.2)
    ctx.bezierCurveTo(
      62,
      102 + Math.sin(timeSec * 1.5 + s) * 5.5,
      116,
      124 - Math.cos(timeSec * 1.3 + s) * 4,
      entryPt.x,
      entryPt.y + s * 1.2
    )
    if (isMain) {
      const g = ctx.createLinearGradient(4, 96, entryPt.x, entryPt.y)
      g.addColorStop(0, isDark ? 'rgba(255,255,255,0)' : 'rgba(24, 24, 27, 0)')
      g.addColorStop(
        0.35,
        isDark ? 'rgba(255,255,255,0.35)' : 'rgba(24, 24, 27, 0.35)'
      )
      g.addColorStop(
        1,
        isDark ? 'rgba(255,255,255,0.85)' : 'rgba(24, 24, 27, 0.75)'
      )
      ctx.strokeStyle = g
      ctx.lineWidth = 1.3
    } else {
      ctx.strokeStyle = isDark
        ? `rgba(255, 255, 255, ${0.22 - Math.abs(s) * 0.06})`
        : `rgba(255, 255, 255, ${0.75 - Math.abs(s) * 0.22})`
      ctx.lineWidth = 1.6
    }
    ctx.stroke()
  }

  // 5. Rear Subsurface Facets & Inner Suspended Luminous Octahedron Core
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(apex.x, apex.y)
  ctx.lineTo(baseL.x, baseL.y)
  ctx.lineTo(baseBack.x, baseBack.y)
  ctx.closePath()
  const rearL = ctx.createLinearGradient(apex.x, apex.y, baseL.x, baseL.y)
  if (isDark) {
    rearL.addColorStop(0, 'rgba(70, 78, 92, 0.48)')
    rearL.addColorStop(1, 'rgba(32, 36, 46, 0.65)')
  } else {
    rearL.addColorStop(0, 'rgba(220, 226, 234, 0.52)')
    rearL.addColorStop(1, 'rgba(144, 152, 164, 0.56)')
  }
  ctx.fillStyle = rearL
  ctx.fill()

  ctx.beginPath()
  ctx.moveTo(apex.x, apex.y)
  ctx.lineTo(baseBack.x, baseBack.y)
  ctx.lineTo(baseR.x, baseR.y)
  ctx.closePath()
  const rearR = ctx.createLinearGradient(apex.x, apex.y, baseR.x, baseR.y)
  if (isDark) {
    rearR.addColorStop(0, 'rgba(90, 98, 114, 0.48)')
    rearR.addColorStop(1, 'rgba(42, 48, 58, 0.58)')
  } else {
    rearR.addColorStop(0, 'rgba(244, 246, 250, 0.65)')
    rearR.addColorStop(1, 'rgba(176, 184, 194, 0.50)')
  }
  ctx.fillStyle = rearR
  ctx.fill()

  // Inner suspended counter-floating diamond core
  const coreY = -Math.sin(timeSec * 1.45) * 3.8
  const cTop = { x: 244 + swayX * 0.35, y: 84 + floatY + coreY }
  const cBot = { x: 252 + swayX * 0.25, y: 244 + floatY + coreY }
  const cLeft = { x: 172, y: 186 + floatY + coreY * 0.7 }
  const cRight = { x: 318, y: 178 + floatY + coreY * 0.7 }
  const cMid = { x: 250 + swayX * 0.3, y: 196 + floatY + coreY * 0.8 }

  const coreGrad = ctx.createLinearGradient(cTop.x, cTop.y, cBot.x, cBot.y)
  if (isDark) {
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.42)')
    coreGrad.addColorStop(0.5, 'rgba(190, 210, 235, 0.22)')
    coreGrad.addColorStop(1, 'rgba(255, 255, 255, 0.06)')
  } else {
    coreGrad.addColorStop(0, 'rgba(255, 255, 255, 0.90)')
    coreGrad.addColorStop(0.5, 'rgba(232, 240, 250, 0.58)')
    coreGrad.addColorStop(1, 'rgba(248, 236, 224, 0.28)')
  }
  ctx.fillStyle = coreGrad
  ctx.beginPath()
  ctx.moveTo(cTop.x, cTop.y)
  ctx.lineTo(cLeft.x, cLeft.y)
  ctx.lineTo(cBot.x, cBot.y)
  ctx.lineTo(cRight.x, cRight.y)
  ctx.closePath()
  ctx.fill()

  ctx.strokeStyle = isDark
    ? 'rgba(255, 255, 255, 0.38)'
    : 'rgba(255, 255, 255, 0.85)'
  ctx.lineWidth = 0.85
  ctx.beginPath()
  ctx.moveTo(cTop.x, cTop.y)
  ctx.lineTo(cMid.x, cMid.y)
  ctx.lineTo(cBot.x, cBot.y)
  ctx.moveTo(cLeft.x, cLeft.y)
  ctx.lineTo(cMid.x, cMid.y)
  ctx.lineTo(cRight.x, cRight.y)
  ctx.stroke()

  // Internal base grid lines inside crystal
  ctx.strokeStyle = isDark
    ? 'rgba(255, 255, 255, 0.16)'
    : 'rgba(255, 255, 255, 0.65)'
  ctx.lineWidth = 0.8
  for (let i = 1; i <= 5; i++) {
    const t = i / 6
    const lx = baseL.x + (baseC.x - baseL.x) * t
    const ly = baseL.y + (baseC.y - baseL.y) * t
    const rx = baseBack.x + (baseR.x - baseBack.x) * t
    const ry = baseBack.y + (baseR.y - baseBack.y) * t
    ctx.beginPath()
    ctx.moveTo(lx, ly)
    ctx.lineTo(rx, ry)
    ctx.stroke()
  }
  ctx.restore()

  // 6. Front Left Smoked Quartz Facet
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(apex.x, apex.y)
  ctx.lineTo(baseL.x, baseL.y)
  ctx.lineTo(baseC.x, baseC.y)
  ctx.closePath()
  const frontL = ctx.createLinearGradient(apex.x, apex.y, baseL.x, baseC.y)
  if (isDark) {
    frontL.addColorStop(0, 'rgba(130, 140, 158, 0.68)')
    frontL.addColorStop(0.55, 'rgba(65, 72, 86, 0.78)')
    frontL.addColorStop(1, 'rgba(38, 44, 54, 0.86)')
  } else {
    frontL.addColorStop(0, 'rgba(244, 247, 252, 0.90)')
    frontL.addColorStop(0.45, 'rgba(182, 190, 200, 0.76)')
    frontL.addColorStop(1, 'rgba(128, 136, 146, 0.84)')
  }
  ctx.fillStyle = frontL
  ctx.fill()
  ctx.restore()

  // 7. Front Right Pearl Porcelain Facet
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(apex.x, apex.y)
  ctx.lineTo(baseC.x, baseC.y)
  ctx.lineTo(baseR.x, baseR.y)
  ctx.closePath()
  const frontR = ctx.createLinearGradient(apex.x, apex.y, baseR.x, baseC.y)
  if (isDark) {
    frontR.addColorStop(0, 'rgba(240, 244, 250, 0.72)')
    frontR.addColorStop(0.55, 'rgba(148, 158, 175, 0.65)')
    frontR.addColorStop(1, 'rgba(82, 90, 105, 0.72)')
  } else {
    frontR.addColorStop(0, 'rgba(255, 255, 255, 0.97)')
    frontR.addColorStop(0.52, 'rgba(240, 244, 249, 0.86)')
    frontR.addColorStop(1, 'rgba(202, 209, 218, 0.82)')
  }
  ctx.fillStyle = frontR
  ctx.fill()
  ctx.restore()

  // 8. Internal Curved Caustic Refraction Bridge (EntryPt -> ExitPt)
  ctx.save()
  const internalGlow = ctx.createLinearGradient(
    entryPt.x,
    entryPt.y,
    exitPt.x,
    exitPt.y
  )
  internalGlow.addColorStop(0, 'rgba(255, 255, 255, 0.98)')
  internalGlow.addColorStop(0.5, 'rgba(235, 244, 255, 0.88)')
  internalGlow.addColorStop(1, 'rgba(255, 244, 232, 0.96)')
  ctx.fillStyle = internalGlow
  ctx.beginPath()
  ctx.moveTo(entryPt.x, entryPt.y - 2)
  ctx.quadraticCurveTo(
    236,
    136 + Math.sin(timeSec * 1.6) * 4,
    exitPt.x,
    exitPt.y - 10
  )
  ctx.lineTo(exitPt.x, exitPt.y + 12)
  ctx.quadraticCurveTo(
    236,
    158 + Math.sin(timeSec * 1.6) * 4,
    entryPt.x,
    entryPt.y + 3
  )
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  // 9. Specular Ridge Highlights & Precision Bevels
  ctx.save()
  ctx.strokeStyle = isDark
    ? 'rgba(255, 255, 255, 0.55)'
    : 'rgba(255, 255, 255, 0.95)'
  ctx.lineWidth = 1.4
  ctx.beginPath()
  ctx.moveTo(apex.x, apex.y)
  ctx.lineTo(baseL.x, baseL.y)
  ctx.lineTo(baseC.x, baseC.y)
  ctx.lineTo(baseR.x, baseR.y)
  ctx.closePath()
  ctx.stroke()

  const ridgeGrad = ctx.createLinearGradient(apex.x, apex.y, baseC.x, baseC.y)
  ridgeGrad.addColorStop(0, '#FFFFFF')
  ridgeGrad.addColorStop(0.6, 'rgba(255, 255, 255, 0.95)')
  ridgeGrad.addColorStop(1, 'rgba(255, 255, 255, 0.50)')
  ctx.strokeStyle = ridgeGrad
  ctx.lineWidth = 2.3
  ctx.beginPath()
  ctx.moveTo(apex.x, apex.y)
  ctx.lineTo(baseC.x, baseC.y)
  ctx.stroke()
  ctx.restore()

  // 10. Front Half of 3D Orbital Gyroscope Ring + Orbiting Pearl
  ctx.save()
  ctx.translate(ringCx, ringCy)
  ctx.rotate(-0.22 + Math.sin(timeSec * 0.5) * 0.03)
  const frontRingGrad = ctx.createLinearGradient(-178, 0, 178, 0)
  if (isDark) {
    frontRingGrad.addColorStop(0, 'rgba(255, 255, 255, 0.12)')
    frontRingGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.55)')
    frontRingGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)')
  } else {
    frontRingGrad.addColorStop(0, 'rgba(24, 24, 27, 0.08)')
    frontRingGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.95)')
    frontRingGrad.addColorStop(0.75, 'rgba(24, 24, 27, 0.32)')
    frontRingGrad.addColorStop(1, 'rgba(24, 24, 27, 0.08)')
  }
  ctx.strokeStyle = frontRingGrad
  ctx.lineWidth = 1.35
  ctx.beginPath()
  ctx.ellipse(0, 0, 178, 42, 0, 0, Math.PI)
  ctx.stroke()

  const orbitAngle = (timeSec * 0.65) % (Math.PI * 2)
  const ox = Math.cos(orbitAngle) * 178
  const oy = Math.sin(orbitAngle) * 42
  if (Math.sin(orbitAngle) >= -0.15) {
    const orbGlow = ctx.createRadialGradient(ox, oy, 0, ox, oy, 8)
    orbGlow.addColorStop(0, 'rgba(255, 255, 255, 1)')
    orbGlow.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = orbGlow
    ctx.beginPath()
    ctx.arc(ox, oy, 8, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = isDark ? '#ffffff' : '#141413'
    ctx.beginPath()
    ctx.arc(ox, oy, 2.2, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.restore()

  // 11. Curved Iridescent Caustic Fan & S-Curve Cubic Bézier Outgoing Ribbons
  const targetX = 486
  ctx.save()
  const fanGrad = ctx.createLinearGradient(exitPt.x, exitPt.y, targetX, exitPt.y)
  if (isDark) {
    fanGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)')
    fanGrad.addColorStop(0.5, 'rgba(186, 208, 240, 0.08)')
    fanGrad.addColorStop(1, 'rgba(0, 0, 0, 0)')
  } else {
    fanGrad.addColorStop(0, 'rgba(255, 255, 255, 0.85)')
    fanGrad.addColorStop(0.45, 'rgba(232, 240, 252, 0.42)')
    fanGrad.addColorStop(0.8, 'rgba(248, 236, 224, 0.18)')
    fanGrad.addColorStop(1, 'rgba(243, 242, 237, 0)')
  }
  ctx.fillStyle = fanGrad
  ctx.beginPath()
  ctx.moveTo(exitPt.x, exitPt.y - 8)
  ctx.bezierCurveTo(
    368,
    exitPt.y - 34,
    420,
    PRISM_NODES[0].targetY,
    targetX,
    PRISM_NODES[0].targetY
  )
  ctx.lineTo(targetX, PRISM_NODES[3].targetY)
  ctx.bezierCurveTo(
    420,
    PRISM_NODES[3].targetY,
    368,
    exitPt.y + 34,
    exitPt.x,
    exitPt.y + 8
  )
  ctx.closePath()
  ctx.fill()
  ctx.restore()

  PRISM_NODES.forEach((node, idx) => {
    const isAct = idx === activeIdx
    const ty = node.targetY
    const cp1x = exitPt.x + 68
    const cp1y =
      exitPt.y + (ty - exitPt.y) * 0.16 + Math.sin(timeSec * 1.4 + idx) * 3.5
    const cp2x = targetX - 68
    const cp2y = ty - (ty - exitPt.y) * 0.08 + Math.cos(timeSec * 1.2 + idx) * 2.5

    // Soft outer ribbon glow
    let ribbonStroke: string
    if (isDark) {
      ribbonStroke = isAct
        ? 'rgba(255, 255, 255, 0.25)'
        : 'rgba(255, 255, 255, 0.08)'
    } else {
      ribbonStroke = isAct
        ? 'rgba(255, 255, 255, 0.92)'
        : 'rgba(255, 255, 255, 0.55)'
    }
    ctx.strokeStyle = ribbonStroke
    ctx.lineWidth = isAct ? 4.2 : 2.4
    ctx.beginPath()
    ctx.moveTo(exitPt.x, exitPt.y)
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, ty)
    ctx.stroke()

    // Core precision optical filament
    const rg = ctx.createLinearGradient(exitPt.x, exitPt.y, targetX, ty)
    if (isDark) {
      rg.addColorStop(
        0,
        isAct ? 'rgba(255,255,255,0.95)' : 'rgba(200,200,200,0.45)'
      )
      rg.addColorStop(
        1,
        isAct ? 'rgba(255,255,255,0.65)' : 'rgba(200,200,200,0.22)'
      )
    } else {
      rg.addColorStop(
        0,
        isAct ? 'rgba(20, 20, 19, 0.82)' : 'rgba(60, 62, 58, 0.42)'
      )
      rg.addColorStop(
        1,
        isAct ? 'rgba(20, 20, 19, 0.48)' : 'rgba(60, 62, 58, 0.18)'
      )
    }
    ctx.strokeStyle = rg
    ctx.lineWidth = isAct ? 1.35 : 0.9
    ctx.beginPath()
    ctx.moveTo(exitPt.x, exitPt.y)
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, targetX, ty)
    ctx.stroke()

    // Flowing photon pearl along the Bézier curve
    const u = (timeSec * 0.48 + idx * 0.25) % 1
    const u1 = 1 - u
    const bx =
      u1 * u1 * u1 * exitPt.x +
      3 * u1 * u1 * u * cp1x +
      3 * u1 * u * u * cp2x +
      u * u * u * targetX
    const by =
      u1 * u1 * u1 * exitPt.y +
      3 * u1 * u1 * u * cp1y +
      3 * u1 * u * u * cp2y +
      u * u * u * ty

    const pg = ctx.createRadialGradient(bx, by, 0, bx, by, isAct ? 7 : 5)
    pg.addColorStop(0, 'rgba(255, 255, 255, 1)')
    pg.addColorStop(0.5, 'rgba(255, 255, 255, 0.5)')
    pg.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = pg
    ctx.beginPath()
    ctx.arc(bx, by, isAct ? 7 : 5, 0, Math.PI * 2)
    ctx.fill()

    let dotFill = '#ffffff'
    if (!isDark) {
      dotFill = isAct ? '#141413' : 'rgba(20, 20, 19, 0.55)'
    }
    ctx.fillStyle = dotFill
    ctx.beginPath()
    ctx.arc(bx, by, isAct ? 2.0 : 1.4, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.restore()
}

export function HeroTerminalDemo({
  className,
  activeIndex,
  onActiveIndexChange,
}: HeroTerminalDemoProps) {
  const { t } = useTranslation()
  const { resolvedTheme } = useTheme()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const targetPointerRef = useRef({ x: 0, y: 0 })
  const smoothPointerRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let frameId = 0
    const start = performance.now()
    const isDark = resolvedTheme === 'dark'

    const renderLoop = (now: number) => {
      const elapsed = (now - start) / 1000
      // Smooth spring damping on pointer parallax
      smoothPointerRef.current.x +=
        (targetPointerRef.current.x - smoothPointerRef.current.x) * 0.08
      smoothPointerRef.current.y +=
        (targetPointerRef.current.y - smoothPointerRef.current.y) * 0.08

      drawFluidOpticalPrism(
        canvas,
        elapsed,
        activeIndex,
        smoothPointerRef.current,
        isDark
      )
      frameId = window.requestAnimationFrame(renderLoop)
    }

    frameId = window.requestAnimationFrame(renderLoop)
    return () => window.cancelAnimationFrame(frameId)
  }, [activeIndex, resolvedTheme])

  const activeNode = PRISM_NODES[activeIndex]

  return (
    <div
      className={cn(
        'relative flex w-full max-w-[640px] flex-col justify-between select-none',
        className
      )}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        targetPointerRef.current = {
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        }
      }}
      onMouseLeave={() => {
        targetPointerRef.current = { x: 0, y: 0 }
      }}
    >
      {/* Real-Time Fluid 3D Optical Glass Pyramid & Orbital Gyroscope Stage */}
      <div className='relative h-[320px] w-full sm:h-[340px]'>
        <canvas
          ref={canvasRef}
          aria-label={t('Optical Stream Prism')}
          className='pointer-events-none h-full w-full'
        />

        {/* 4 Porcelain Pill Nodes for the 2026 Frontier Models */}
        {PRISM_NODES.map((node, idx) => {
          const isActive = idx === activeIndex
          return (
            <button
              key={node.id}
              type='button'
              onClick={() => onActiveIndexChange(idx)}
              style={{ top: `${node.topPercent}%` }}
              className={cn(
                'absolute right-0 min-w-[156px] -translate-y-1/2 rounded-full border px-4.5 py-2 text-left text-[12.5px] font-medium whitespace-nowrap transition-all duration-300',
                isActive
                  ? 'border-white bg-white text-[#141413] scale-[1.03] shadow-[0_12px_28px_-6px_rgba(20,20,18,0.12),0_2px_8px_rgba(20,20,18,0.05)] dark:border-white/25 dark:bg-zinc-900 dark:text-zinc-100'
                  : 'border-white/90 bg-white/92 text-[#27272A] shadow-[0_8px_20px_-6px_rgba(20,20,18,0.07),0_2px_5px_rgba(20,20,18,0.03)] hover:-translate-y-[53%] hover:bg-white dark:border-white/15 dark:bg-zinc-900/80 dark:text-zinc-300'
              )}
            >
              <span className='flex items-center justify-between gap-2.5'>
                <span>{t(node.labelKey)}</span>
                <span
                  className={cn(
                    'size-1.5 rounded-full transition-colors',
                    isActive
                      ? 'bg-[#141413] dark:bg-white'
                      : 'bg-black/20 dark:bg-white/20'
                  )}
                />
              </span>
            </button>
          )
        })}
      </div>

      {/* Bottom Aligned Telemetry Caption Bar */}
      <div className='border-border/80 flex flex-wrap items-center justify-between gap-2 border-t pt-3 text-xs'>
        <div className='flex items-center gap-2'>
          <span className='bg-foreground inline-block size-1.5 rounded-full' />
          <span className='text-foreground font-medium'>
            {t(activeNode.labelKey)}
          </span>
          <span className='text-muted-foreground/50'>·</span>
          <span className='text-muted-foreground font-mono text-[11px]'>
            {activeNode.protocol}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-muted-foreground'>
            {t(activeNode.metricKey)}
          </span>
          <span className='border-border bg-card text-foreground rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-medium'>
            {activeNode.latency}
          </span>
        </div>
      </div>
    </div>
  )
}
