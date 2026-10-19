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

import { useQuery } from '@tanstack/react-query'
import { Link } from '@tanstack/react-router'
import {
  Activity,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Cpu,
  Flame,
  GitBranch,
  Globe,
  Layers,
  Lock,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { PublicLayout } from '@/components/layout'
import { Footer } from '@/components/layout/components/footer'
import { PageTransition } from '@/components/page-transition'
import { RichContent } from '@/components/rich-content'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useStatus } from '@/hooks/use-status'
import { DEFAULT_GATEWAY_ORIGIN } from '@/lib/constants'
import { isHttpUrl, isLikelyHtml } from '@/lib/content-format'
import { requireServerSuccess } from '@/lib/server-error-message'
import { useAuthStore } from '@/stores/auth-store'

import { getAboutContent } from './api'

interface EngineeringPillar {
  num: string
  tag: string
  title: string
  subtitle: string
  description: string
  metrics: string[]
}

const ENGINEERING_PILLARS: EngineeringPillar[] = [
  {
    num: '01',
    tag: 'Protocol Isomorphism',
    title: '多协议原生无损同构',
    subtitle: '拒绝有损转译，完整保留各厂商底层能力',
    description:
      '在同一网关地址下原生承载 Anthropic /v1/messages、OpenAI /v1/responses、/v1/chat/completions 与 Google Gemini /v1beta。无需额外转换插件即可直连 Claude Code、Codex CLI、Cursor 与官方 SDK。',
    metrics: [
      '保留 Extended Thinking 思维链签名',
      '支持 Prompt Caching 精确分段传递',
      '全双工 Tool Use 与结构化 JSON 输出',
    ],
  },
  {
    num: '02',
    tag: 'Resilient Mesh Routing',
    title: '毫秒级智能选路与热备自愈',
    subtitle: '跨区域多活集群，自动规避单点限流与过载',
    description:
      '网关实时采集全球上游渠道的首字响应时间（TTFT）、吞吐速率与错误率。当单一节点触发 429 速率限制或 529 算力过载时，调度引擎在流式建立前自动完成同池热备节点无感切换。',
    metrics: [
      '首字流式透传损耗 < 1.8 ms',
      '99.98% 跨区域高可用 SLA 保障',
      '支持会话级前缀缓存亲和调度',
    ],
  },
  {
    num: '03',
    tag: 'Transparent Ledger',
    title: '原子级澄明计量与账单审计',
    subtitle: '每一枚 Token 的来龙去脉均清晰可查',
    description:
      '告别黑盒扣费。结算引擎严格依据上游官方返回的 usage 快照，将常规输入、缓存创建（1.25×）、缓存命中读取（0.1×）、推理思考链与常规输出独立分列，支持按令牌与模型维度实时审计。',
    metrics: [
      '缓存读取命中享 0.1×（立省 90%）',
      '预扣冻结与流结束后精确多退少补',
      '微美元级实时消耗明细与导出',
    ],
  },
]

interface LifecycleStage {
  step: string
  latency: string
  title: string
  protocolNote: string
  description: string
}

const LIFECYCLE_STAGES: LifecycleStage[] = [
  {
    step: 'STAGE 01',
    latency: '~0.3 ms',
    title: '边缘鉴权与细粒度策略预检',
    protocolNote: 'Bearer / x-api-key / x-goog-api-key',
    description:
      '在边缘节点完成 sk- 令牌签名校验、IP 白名单匹配、可用模型白名单过滤以及令牌剩余额度并发预检，拦截非法或超限调用。',
  },
  {
    step: 'STAGE 02',
    latency: '~0.5 ms',
    title: '协议特征解析与缓存亲和选路',
    protocolNote: 'Messages ⇄ Responses ⇄ Gemini Native',
    description:
      '识别请求协议栈与模型标识，结合实时渠道健康度权重与上下文前缀特征，优先路由至具备高缓存命中率的低延迟专线节点。',
  },
  {
    step: 'STAGE 03',
    latency: '< 1.0 ms',
    title: '零缓冲 SSE 字节级流式直通',
    protocolNote: 'Zero-Buffer Chunked Passthrough',
    description:
      '建立上游 TLS 1.3 长连接，不做全量响应驻留或阻塞拼接；实时透传 thinking_delta、tool_use 与文本流，保障终端与 IDE 丝滑交互。',
  },
  {
    step: 'STAGE 04',
    latency: 'Async',
    title: '异步精准结算与脱敏审计落库',
    protocolNote: 'Atomic Quota Settlement',
    description:
      '流式传输完成后异步解析官方 usage 结构体，按实际缓存命中率结算并退还预扣差额，仅记录 Token 数量与耗时等脱敏元数据。',
  },
]

interface SecurityGuardItem {
  badge: string
  title: string
  description: string
  highlight: string
}

const SECURITY_GUARDS: SecurityGuardItem[] = [
  {
    badge: 'ZERO RETENTION',
    title: '零载荷数据留存承诺',
    description:
      '默认关闭请求体（Prompt）与响应体（Completion）持久化存储。您的源代码、系统提示词与业务数据仅在网关内存缓冲区中完成流式转发即刻销毁，绝不落盘、绝不用于任何模型训练。',
    highlight: '0 业务载荷落盘 · 内存态流转即焚',
  },
  {
    badge: 'SCOPED TOKENS',
    title: '项目级凭证隔离与配额熔断',
    description:
      '支持为不同开发团队、CI/CD 流水线或单个 IDE 签发独立的 sk- 密钥。每枚密钥均可单独配置过期时间、IP 访问白名单、模型调用范围与最大消费额度上限。',
    highlight: '最小权限原则 · 单密钥独立限额',
  },
  {
    badge: 'IDENTITY & ACCESS',
    title: '企业级多因素认证与权限治理',
    description:
      '控制台全面支持 WebAuthn / Passkey 通行密钥、TOTP 双因素验证、OAuth / OIDC 企业单点登录，并内置基于 Casbin 的细粒度角色与接口访问控制。',
    highlight: 'Passkey + TOTP · OWASP ASVS 合规',
  },
  {
    badge: 'ENCRYPTED BACKBONE',
    title: '全链路加密传输与合规审计',
    description:
      '客户端至网关边缘强制启用 TLS 1.3 加密套件，网关至全球上游供应商采用高可靠加密专线连接；所有管理操作与认证事件均具备不可篡改的安全审计日志。',
    highlight: '端到端 TLS 1.3 · 脱敏审计日志',
  },
]

interface MeshMetricItem {
  region: string
  code: string
  ttft: string
  availability: string
  role: string
}

const MESH_REGIONS: MeshMetricItem[] = [
  {
    region: '亚太高速边缘集群 · 东京 / 新加坡',
    code: 'AP-NORTHEAST / AP-SOUTHEAST',
    ttft: '11 ~ 15 ms',
    availability: '99.99%',
    role: '主力低延迟接入与跨境专线汇聚节点',
  },
  {
    region: '北美核心算力走廊 · 弗吉尼亚 / 俄勒冈',
    code: 'US-EAST / US-WEST',
    ttft: '12 ~ 18 ms',
    availability: '99.98%',
    role: 'Anthropic & OpenAI 官方机房同地域直连节点',
  },
  {
    region: '欧洲合规网关节点 · 法兰克福',
    code: 'EU-CENTRAL',
    ttft: '14 ~ 21 ms',
    availability: '99.98%',
    role: '多区域跨洋灾备与高并发溢出承接集群',
  },
]

interface MilestoneItem {
  phase: string
  period: string
  title: string
  detail: string
}

const MILESTONES: MilestoneItem[] = [
  {
    phase: 'PHASE 01',
    period: 'Foundation',
    title: '多厂商统一网关底座构建',
    detail:
      '打通 40+ 主流大模型服务商的标准化接入、令牌管理、分组倍率与多数据库（SQLite / MySQL / PostgreSQL / ClickHouse）高并发账本体系。',
  },
  {
    phase: 'PHASE 02',
    period: 'Native Protocols',
    title: 'Anthropic Messages 与 OpenAI Responses 原生双栈',
    detail:
      '引入独立 relaykit 协议引擎与 tokenkit 计量模块，实现 Claude Code、Codex CLI、opencode 等终端 Agent 工具的零改造原生直连。',
  },
  {
    phase: 'PHASE 03',
    period: 'Cache & Multimodal',
    title: 'Prompt Caching 精算与异步多模态插件体系',
    detail:
      '支持五维 Token 拆分计费（缓存命中低至 0.1×）与基于 moejs 的异步视频/图像生成任务插件（Sora、Veo、Kling、Jimeng 等）。',
  },
  {
    phase: 'PHASE 04',
    period: 'MIHOUO Porcelain',
    title: '弥火 · 澄明工程美学与企业级可观测演进',
    detail:
      '全面焕新北欧暖白（Nordic Porcelain）设计语言、实时模型竞技排行榜、交互式技术文档中心与全链路零留存安全治理。',
  },
]

function MihouoAboutShowcase() {
  const { t } = useTranslation()
  const { status } = useStatus()
  const user = useAuthStore((s) => s.auth.user)
  const isAuthenticated = Boolean(user)
  const [activeInspectorTab, setActiveInspectorTab] = useState('lifecycle')
  const currentYear = new Date().getFullYear()

  const gatewayOrigin = useMemo(() => {
    const statusRecord = status as Record<string, unknown> | null
    const nestedData = statusRecord?.data as Record<string, unknown> | undefined
    const candidate =
      statusRecord?.server_address ??
      statusRecord?.serverAddress ??
      nestedData?.server_address ??
      nestedData?.serverAddress
    if (typeof candidate === 'string' && candidate.trim().length > 0) {
      return candidate.trim().replace(/\/+$/, '')
    }
    return DEFAULT_GATEWAY_ORIGIN
  }, [status])

  const primaryCtaPath = isAuthenticated ? '/dashboard' : '/sign-up'
  const primaryCtaLabel = isAuthenticated ? t('Console') : t('Get Started')

  return (
    <div className='min-h-svh bg-[#f3f2ed] text-[#141413] dark:bg-zinc-950 dark:text-[#F4F1EA]'>
      {/* Hero Section: Brand Manifesto & Infrastructure Identity Card */}
      <section className='border-border/80 relative overflow-hidden border-b pt-24 pb-12 md:pt-28 md:pb-16'>
        <div className='mx-auto max-w-[1280px] px-6 md:px-12'>
          <div className='grid grid-cols-1 items-stretch gap-10 lg:grid-cols-12 lg:gap-10'>
            {/* Left Column: Poetic Manifesto */}
            <div className='flex flex-col justify-between lg:col-span-7'>
              <div>
                <div className='text-muted-foreground mb-4 inline-flex items-center gap-2.5 text-xs tracking-[0.16em]'>
                  <span className='bg-foreground/35 inline-block h-px w-5' />
                  <span>ABOUT MIHOUO · 关于弥火智能基础设施</span>
                </div>

                <h1 className='font-serif text-[clamp(2.15rem,3.8vw,3.3rem)] leading-[1.16] font-normal tracking-[-0.015em]'>
                  如火传薪，为下一代智能工程
                  <br />
                  <span className='text-[#3F3F3C] dark:text-zinc-300'>
                    构筑澄明、无损的算力底座
                  </span>
                </h1>

                <p className='mt-5 max-w-[640px] text-[14.5px] leading-[1.8] text-[#3F3F3C] dark:text-zinc-300'>
                  「指穷于为薪，火传也，不知其尽也。」——{' '}
                  <strong className='font-medium text-[#141413] dark:text-white'>
                    MIHOUO · 弥火
                  </strong>{' '}
                  致力于消除多模型、多协议与跨区域算力调度之间的工程摩擦。我们将全球
                  40+ 顶尖大模型厂商收敛于单一、高可用的标准协议网关，让每一次
                  Agent 思考、代码重构与生产推理都兼具低延迟、透明计费与零数据留存保障。
                </p>

                {/* Philosophical Quote Callout */}
                <div className='mt-6 rounded-[18px] border border-black/[0.07] bg-white/75 px-5 py-4 shadow-[0_10px_28px_-12px_rgba(20,20,18,0.05)] dark:border-white/10 dark:bg-zinc-900/75'>
                  <div className='flex items-start gap-3'>
                    <span className='mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-[#141413] text-white dark:bg-white dark:text-[#141413]'>
                      <Flame className='size-3.5' />
                    </span>
                    <div>
                      <div className='font-serif text-[14.5px] font-normal text-[#141413] dark:text-white'>
                        “极简于外，精密于内 —— 让基础设施隐于无形，让创造力自由生长。”
                      </div>
                      <p className='text-muted-foreground mt-1 text-[12px] leading-relaxed'>
                        无需为不同模型维护多套 SDK、多份账单与复杂的重试逻辑；一枚{' '}
                        <code className='font-mono text-[#141413] dark:text-zinc-200'>
                          sk-
                        </code>{' '}
                        密钥即可驱动全栈开发工作流。
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className='mt-7 flex flex-wrap items-center gap-3'>
                <Button
                  className='group h-10 rounded-full bg-[#141413] px-6 text-[13px] font-medium text-white hover:bg-[#272725] dark:bg-white dark:text-[#141413]'
                  render={<Link to={primaryCtaPath} />}
                >
                  <span>{primaryCtaLabel}</span>
                  <ArrowRight className='ml-1.5 size-3.5 transition-transform duration-200 group-hover:translate-x-0.5' />
                </Button>

                <Button
                  variant='outline'
                  className='border-border hover:border-foreground/40 h-10 rounded-full bg-white/80 px-5 text-[13px] font-medium dark:bg-zinc-900/80'
                  render={<Link to='/docs' />}
                >
                  <BookOpen className='mr-1.5 size-3.5' />
                  <span>{t('Docs')}</span>
                </Button>

                <Button
                  variant='outline'
                  className='border-border hover:border-foreground/40 h-10 rounded-full bg-white/80 px-5 text-[13px] font-medium dark:bg-zinc-900/80'
                  render={<Link to='/pricing' />}
                >
                  <Layers className='mr-1.5 size-3.5' />
                  <span>{t('Model Square')}</span>
                </Button>
              </div>
            </div>

            {/* Right Column: MIHOUO Infrastructure Specification Card */}
            <div className='flex lg:col-span-5'>
              <div className='bg-card flex w-full flex-col justify-between overflow-hidden rounded-[22px] border border-white shadow-[0_24px_52px_-14px_rgba(20,20,18,0.08)] dark:border-white/10'>
                {/* Card Header */}
                <div className='border-border/70 flex items-center justify-between border-b bg-[#FAF9F5] px-6 py-4 dark:bg-zinc-900'>
                  <div className='flex items-center gap-2.5'>
                    <span className='relative flex size-2'>
                      <span className='bg-foreground/40 absolute inline-flex h-full w-full animate-ping rounded-full opacity-75' />
                      <span className='bg-foreground relative inline-flex size-2 rounded-full' />
                    </span>
                    <span className='font-mono text-[11px] font-semibold tracking-wider uppercase'>
                      MIHOUO INFRASTRUCTURE SPEC
                    </span>
                  </div>
                  <Badge
                    variant='outline'
                    className='rounded-full font-mono text-[10.5px]'
                  >
                    SLA 99.98%
                  </Badge>
                </div>

                {/* Card Body */}
                <div className='space-y-5 p-6'>
                  <div className='flex items-baseline justify-between gap-4'>
                    <div>
                      <div className='text-muted-foreground font-mono text-[11px] uppercase'>
                        Gateway Identity
                      </div>
                      <div className='mt-0.5 font-serif text-xl tracking-wide'>
                        MIHOUO · 弥火
                      </div>
                    </div>
                    <div className='text-right'>
                      <div className='text-muted-foreground font-mono text-[11px] uppercase'>
                        Primary Endpoint
                      </div>
                      <div className='mt-0.5 font-mono text-xs font-semibold'>
                        {gatewayOrigin}
                      </div>
                    </div>
                  </div>

                  {/* Native Protocol Matrix */}
                  <div className='rounded-2xl border border-black/[0.06] bg-[#F8F7F3] p-4 dark:border-white/10 dark:bg-zinc-900/70'>
                    <div className='text-muted-foreground mb-2.5 flex items-center justify-between font-mono text-[11px]'>
                      <span>原生直通协议栈</span>
                      <span>ZERO-LOSS RELAY</span>
                    </div>
                    <div className='grid grid-cols-2 gap-2 font-mono text-[11.5px]'>
                      <div className='rounded-lg bg-white px-2.5 py-1.5 dark:bg-zinc-800'>
                        POST /v1/messages
                      </div>
                      <div className='rounded-lg bg-white px-2.5 py-1.5 dark:bg-zinc-800'>
                        POST /v1/responses
                      </div>
                      <div className='rounded-lg bg-white px-2.5 py-1.5 dark:bg-zinc-800'>
                        POST /v1/chat/completions
                      </div>
                      <div className='rounded-lg bg-white px-2.5 py-1.5 dark:bg-zinc-800'>
                        POST /v1beta/models/*
                      </div>
                    </div>
                  </div>

                  {/* 2x2 Key Telemetry Grid */}
                  <div className='grid grid-cols-2 gap-3'>
                    <div className='border-border/70 rounded-xl border bg-white/70 p-3.5 dark:bg-zinc-900/50'>
                      <div className='font-serif text-xl tabular-nums'>
                        &lt; 1.8 ms
                      </div>
                      <div className='mt-0.5 text-[12px] font-medium'>
                        流式网关损耗
                      </div>
                      <div className='text-muted-foreground text-[11px]'>
                        零缓冲 SSE 字节透传
                      </div>
                    </div>
                    <div className='border-border/70 rounded-xl border bg-white/70 p-3.5 dark:bg-zinc-900/50'>
                      <div className='font-serif text-xl tabular-nums'>
                        40+ 厂商
                      </div>
                      <div className='mt-0.5 text-[12px] font-medium'>
                        全栈模型汇聚
                      </div>
                      <div className='text-muted-foreground text-[11px]'>
                        单一密钥跨生态调用
                      </div>
                    </div>
                    <div className='border-border/70 rounded-xl border bg-white/70 p-3.5 dark:bg-zinc-900/50'>
                      <div className='font-serif text-xl tabular-nums'>
                        0.1× 费率
                      </div>
                      <div className='mt-0.5 text-[12px] font-medium'>
                        缓存读取折扣
                      </div>
                      <div className='text-muted-foreground text-[11px]'>
                        最高立省 90% 输入成本
                      </div>
                    </div>
                    <div className='border-border/70 rounded-xl border bg-white/70 p-3.5 dark:bg-zinc-900/50'>
                      <div className='font-serif text-xl tabular-nums'>
                        0 载荷留存
                      </div>
                      <div className='mt-0.5 text-[12px] font-medium'>
                        隐私安全准则
                      </div>
                      <div className='text-muted-foreground text-[11px]'>
                        内存流转不落盘不训练
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className='border-border/70 flex items-center justify-between border-t bg-[#F6F5F0] px-6 py-3 text-[12px] dark:bg-zinc-900/80'>
                  <span className='text-muted-foreground flex items-center gap-1.5'>
                    <ShieldCheck className='size-3.5 text-[#8C7051]' />
                    <span>端到端 TLS 1.3 · 实时健康探针运行中</span>
                  </span>
                  <Link
                    to='/rankings'
                    className='font-medium underline-offset-4 hover:underline'
                  >
                    查看实时排行 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 01: Three Architectural Pillars */}
      <section className='py-14 md:py-18'>
        <div className='mx-auto max-w-[1280px] px-6 md:px-12'>
          <AnimateInView className='mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end'>
            <div>
              <div className='text-muted-foreground mb-2 inline-flex items-center gap-2 text-xs tracking-[0.14em]'>
                <span className='font-mono'>01 / ARCHITECTURAL PILLARS</span>
              </div>
              <h2 className='font-serif text-2xl font-normal tracking-tight md:text-3xl'>
                三大核心工程准则
              </h2>
            </div>
            <p className='text-muted-foreground max-w-md text-[13.5px] leading-relaxed'>
              从协议解析、跨区选路到底层账本结算，弥火的每一层组件均围绕高强度研发与生产负载而设计。
            </p>
          </AnimateInView>

          <div className='grid grid-cols-1 items-stretch gap-6 lg:grid-cols-3'>
            {ENGINEERING_PILLARS.map((pillar, idx) => (
              <AnimateInView
                key={pillar.num}
                delay={idx * 70}
                animation='fade-up'
                className='bg-card flex h-full flex-col justify-between rounded-[22px] border border-white p-7 shadow-[0_20px_44px_-14px_rgba(20,20,18,0.06)] dark:border-white/10'
              >
                <div>
                  <div className='border-border/70 mb-5 flex items-center justify-between border-b pb-3.5'>
                    <span className='text-muted-foreground font-serif text-xl tabular-nums'>
                      {pillar.num}
                    </span>
                    <span className='rounded-full border border-black/10 bg-[#F8F7F3] px-3 py-0.5 font-mono text-[11px] dark:border-white/10 dark:bg-zinc-800'>
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className='font-serif text-xl font-normal tracking-tight'>
                    {pillar.title}
                  </h3>
                  <div className='mt-1 text-[12.5px] font-medium text-[#8C7051] dark:text-amber-300/90'>
                    {pillar.subtitle}
                  </div>
                  <p className='text-muted-foreground mt-3.5 text-[13.5px] leading-[1.7]'>
                    {pillar.description}
                  </p>
                </div>

                <div className='border-border/70 mt-6 space-y-2 border-t pt-4'>
                  {pillar.metrics.map((metric) => (
                    <div
                      key={metric}
                      className='flex items-center gap-2 text-[12.5px]'
                    >
                      <CheckCircle2 className='size-3.5 shrink-0 text-[#8C7051]' />
                      <span>{metric}</span>
                    </div>
                  ))}
                </div>
              </AnimateInView>
            ))}
          </div>
        </div>
      </section>

      {/* Section 02: Interactive Architecture & Security Inspector */}
      <section className='border-border/80 border-t py-14 md:py-18'>
        <div className='mx-auto max-w-[1280px] px-6 md:px-12'>
          <div className='bg-card overflow-hidden rounded-[24px] border border-white p-6 shadow-[0_22px_50px_-14px_rgba(20,20,18,0.06)] md:p-10 dark:border-white/10'>
            <div className='mb-7 flex flex-col justify-between gap-4 border-b border-black/[0.06] pb-6 lg:flex-row lg:items-end dark:border-white/10'>
              <div>
                <div className='text-muted-foreground mb-2 inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em]'>
                  <Cpu className='size-3.5' />
                  <span>02 / DEEP ARCHITECTURE INSPECTOR</span>
                </div>
                <h2 className='font-serif text-2xl font-normal tracking-tight md:text-3xl'>
                  全链路技术架构与安全承诺透视
                </h2>
              </div>
              <p className='text-muted-foreground max-w-md text-[13px] leading-relaxed'>
                切换下方视图，了解一次请求在弥火网关内部的毫秒级流转过程、零留存隐私边界与全球多活节点拓扑。
              </p>
            </div>

            <Tabs
              value={activeInspectorTab}
              onValueChange={setActiveInspectorTab}
            >
              <TabsList className='h-auto w-full flex-wrap justify-start gap-1.5 rounded-2xl bg-[#F3F2ED] p-1.5 dark:bg-zinc-900'>
                <TabsTrigger
                  value='lifecycle'
                  className='rounded-xl px-4 py-2 text-[13px] font-medium data-[active]:bg-white data-[active]:shadow-xs dark:data-[active]:bg-zinc-800'
                >
                  <Zap className='mr-1.5 size-3.5' />
                  请求毫秒级生命周期
                </TabsTrigger>
                <TabsTrigger
                  value='security'
                  className='rounded-xl px-4 py-2 text-[13px] font-medium data-[active]:bg-white data-[active]:shadow-xs dark:data-[active]:bg-zinc-800'
                >
                  <Lock className='mr-1.5 size-3.5' />
                  零留存隐私与安全治理
                </TabsTrigger>
                <TabsTrigger
                  value='mesh'
                  className='rounded-xl px-4 py-2 text-[13px] font-medium data-[active]:bg-white data-[active]:shadow-xs dark:data-[active]:bg-zinc-800'
                >
                  <Globe className='mr-1.5 size-3.5' />
                  全球多活集群与容灾拓扑
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Request Lifecycle Pipeline */}
              <TabsContent value='lifecycle' className='mt-6 space-y-5'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4'>
                  {LIFECYCLE_STAGES.map((stage) => (
                    <div
                      key={stage.step}
                      className='border-border/80 flex flex-col justify-between rounded-2xl border bg-[#FAF9F5] p-5 dark:bg-zinc-900/60'
                    >
                      <div>
                        <div className='flex items-center justify-between gap-2'>
                          <span className='font-mono text-[11px] font-semibold tracking-wider text-[#8C7051]'>
                            {stage.step}
                          </span>
                          <Badge
                            variant='secondary'
                            className='font-mono text-[10.5px]'
                          >
                            {stage.latency}
                          </Badge>
                        </div>
                        <h3 className='mt-3 font-serif text-[17px] font-normal'>
                          {stage.title}
                        </h3>
                        <p className='text-muted-foreground mt-2 text-[12.5px] leading-[1.65]'>
                          {stage.description}
                        </p>
                      </div>

                      <div className='border-border/60 mt-4 border-t pt-3 font-mono text-[11px] text-[#52524E] dark:text-zinc-400'>
                        {stage.protocolNote}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Tab 2: Security & Zero-Retention Matrix */}
              <TabsContent value='security' className='mt-6'>
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  {SECURITY_GUARDS.map((item) => (
                    <div
                      key={item.badge}
                      className='border-border/80 flex flex-col justify-between rounded-2xl border bg-[#FAF9F5] p-6 dark:bg-zinc-900/60'
                    >
                      <div>
                        <div className='flex items-center justify-between gap-2'>
                          <span className='rounded-full border border-black/10 bg-white px-2.5 py-0.5 font-mono text-[10.5px] font-semibold dark:border-white/10 dark:bg-zinc-800'>
                            {item.badge}
                          </span>
                          <ShieldCheck className='size-4 text-[#8C7051]' />
                        </div>
                        <h3 className='mt-3 font-serif text-lg font-normal'>
                          {item.title}
                        </h3>
                        <p className='text-muted-foreground mt-2 text-[13px] leading-[1.7]'>
                          {item.description}
                        </p>
                      </div>

                      <div className='border-border/60 mt-4 flex items-center gap-2 border-t pt-3 font-mono text-[11.5px] font-medium'>
                        <Sparkles className='size-3.5 text-[#8C7051]' />
                        <span>{item.highlight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* Tab 3: Global Mesh & High-Availability SLA */}
              <TabsContent value='mesh' className='mt-6 space-y-4'>
                <div className='grid grid-cols-1 gap-4 lg:grid-cols-3'>
                  {MESH_REGIONS.map((item) => (
                    <div
                      key={item.code}
                      className='border-border/80 flex flex-col justify-between rounded-2xl border bg-[#FAF9F5] p-5 dark:bg-zinc-900/60'
                    >
                      <div>
                        <div className='flex items-center justify-between gap-2'>
                          <span className='font-mono text-[11px] font-semibold text-[#8C7051]'>
                            {item.code}
                          </span>
                          <span className='inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-emerald-700 dark:text-emerald-300'>
                            <Activity className='size-3' />
                            {item.availability}
                          </span>
                        </div>
                        <h3 className='mt-2.5 font-serif text-[17px] font-normal'>
                          {item.region}
                        </h3>
                        <p className='text-muted-foreground mt-1.5 text-[12.5px] leading-relaxed'>
                          {item.role}
                        </p>
                      </div>

                      <div className='border-border/60 mt-4 flex items-center justify-between border-t pt-3 font-mono text-xs'>
                        <span className='text-muted-foreground'>
                          边缘首包延迟 (TTFT)
                        </span>
                        <span className='font-semibold'>{item.ttft}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* Section 03: Evolution Roadmap & Open-Source Ecosystem Attribution */}
      <section className='border-border/80 border-t py-14 md:py-18'>
        <div className='mx-auto max-w-[1280px] px-6 md:px-12'>
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-12'>
            {/* Left 7 Columns: Evolution Roadmap */}
            <div className='bg-card rounded-[22px] border border-white p-7 shadow-[0_20px_44px_-14px_rgba(20,20,18,0.06)] lg:col-span-7 dark:border-white/10'>
              <div className='text-muted-foreground mb-2 inline-flex items-center gap-2 font-mono text-xs tracking-[0.14em]'>
                <GitBranch className='size-3.5' />
                <span>03 / EVOLUTION ROADMAP</span>
              </div>
              <h2 className='font-serif text-2xl font-normal tracking-tight'>
                弥火架构演进历程
              </h2>

              <div className='mt-6 space-y-4'>
                {MILESTONES.map((m) => (
                  <div
                    key={m.phase}
                    className='border-border/70 rounded-2xl border bg-[#FAF9F5] p-4.5 dark:bg-zinc-900/60'
                  >
                    <div className='flex flex-wrap items-center justify-between gap-2'>
                      <span className='font-mono text-[11px] font-semibold text-[#8C7051]'>
                        {m.phase} · {m.period}
                      </span>
                      <span className='font-serif text-[16px] font-normal'>
                        {m.title}
                      </span>
                    </div>
                    <p className='text-muted-foreground mt-2 text-[13px] leading-[1.65]'>
                      {m.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right 5 Columns: Quick Developer Portal & Open-Source Attribution */}
            <div className='flex flex-col justify-between gap-6 lg:col-span-5'>
              {/* Developer Experience Card */}
              <div className=' rounded-[22px] bg-[#141413] p-7 text-[#F4F1EA] shadow-[0_22px_48px_-14px_rgba(20,20,18,0.2)] dark:border dark:border-white/10 dark:bg-zinc-900'>
                <div className='flex items-center gap-2 font-mono text-[11px] tracking-wider text-zinc-400 uppercase'>
                  <Terminal className='size-3.5 text-amber-300' />
                  <span>READY FOR PRODUCTION</span>
                </div>
                <h3 className='mt-2.5 font-serif text-2xl font-normal text-white'>
                  30 秒完成终端与 IDE 接入
                </h3>
                <p className='mt-2.5 text-[13px] leading-[1.7] text-zinc-300'>
                  无论您使用 Claude Code、OpenAI Codex CLI、Cursor 还是标准
                  Python / TypeScript SDK，只需替换 Base URL 与 API Key
                  即可无缝切换至弥火网关。
                </p>

                <div className='mt-5 rounded-xl border border-white/10 bg-black/40 p-3.5 font-mono text-[11.5px] text-zinc-200'>
                  <div className='text-zinc-400'>
                    # 统一网关接入地址
                  </div>
                  <div className='mt-1 select-all text-emerald-300'>
                    export ANTHROPIC_BASE_URL=&quot;{gatewayOrigin}&quot;
                  </div>
                  <div className='mt-0.5 select-all text-amber-200'>
                    export OPENAI_BASE_URL=&quot;{gatewayOrigin}/v1&quot;
                  </div>
                </div>

                <div className='mt-6 flex flex-wrap items-center gap-3'>
                  <Link
                    to='/docs'
                    className='inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2 text-xs font-medium text-[#141413] transition-opacity hover:opacity-90'
                  >
                    <span>阅读完整接入文档</span>
                    <ArrowRight className='size-3.5' />
                  </Link>
                  <Link
                    to='/playground'
                    className='inline-flex items-center gap-1.5 rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-white/10'
                  >
                    <span>在线 {t('Playground')}</span>
                  </Link>
                </div>
              </div>

              {/* Open-Source Ecosystem & License Compliance Card */}
              <div className='bg-card rounded-[22px] border border-white p-6 shadow-[0_20px_44px_-14px_rgba(20,20,18,0.06)] dark:border-white/10'>
                <div className='font-mono text-[11px] font-semibold tracking-wider text-[#8C7051] uppercase'>
                  OPEN ECOSYSTEM & COMPLIANCE
                </div>
                <h3 className='mt-1.5 font-serif text-lg font-normal'>
                  开源技术生态与协议致敬
                </h3>
                <p className='text-muted-foreground mt-2 text-[12.5px] leading-[1.7]'>
                  弥火（MIHOUO）网关底层架构演进自开源社区优秀的 AI
                  网关工程实践，并持续向开发者提供标准化、可验证的协议兼容体验。
                </p>
                <div className='border-border/70 text-muted-foreground mt-4 space-y-1.5 border-t pt-3.5 text-[12px]'>
                  <div>
                    {t('New API Project Repository:')}{' '}
                    <a
                      href='https://github.com/QuantumNous/new-api'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-foreground font-medium underline-offset-4 hover:underline'
                    >
                      github.com/QuantumNous/new-api
                    </a>
                  </div>
                  <div>
                    <a
                      href='https://github.com/QuantumNous/new-api'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-foreground font-medium hover:underline'
                    >
                      {t('NewAPI')}
                    </a>{' '}
                    © {currentYear}{' '}
                    <a
                      href='https://github.com/QuantumNous'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-foreground font-medium hover:underline'
                    >
                      {t('QuantumNous')}
                    </a>{' '}
                    {t('| Based on')}{' '}
                    <a
                      href='https://github.com/songquanpeng/one-api'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-foreground font-medium hover:underline'
                    >
                      {t('One API')}
                    </a>{' '}
                    ·{' '}
                    <a
                      href='https://github.com/QuantumNous/new-api/blob/main/LICENSE'
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-foreground font-medium hover:underline'
                    >
                      {t('AGPL v3.0 License')}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export function About() {
  const { t } = useTranslation()
  const { data } = useQuery({
    queryKey: ['about-content'],
    queryFn: async () => requireServerSuccess(await getAboutContent()),
  })

  const rawContent = data?.data?.trim() ?? ''
  const hasContent = rawContent.length > 0
  const isUrl = hasContent && isHttpUrl(rawContent)
  const contentIsHtml = hasContent && isLikelyHtml(rawContent)

  if (!hasContent) {
    return (
      <PublicLayout showMainContainer={false}>
        <PageTransition>
          <MihouoAboutShowcase />
        </PageTransition>
      </PublicLayout>
    )
  }

  if (isUrl) {
    return (
      <PublicLayout showMainContainer={false}>
        <PageTransition>
          <iframe
            src={rawContent}
            className='h-[calc(100vh-3.5rem)] w-full border-0'
            title={t('About')}
            sandbox='allow-forms allow-popups allow-popups-to-escape-sandbox allow-scripts'
          />
        </PageTransition>
      </PublicLayout>
    )
  }

  if (contentIsHtml) {
    return (
      <PublicLayout showMainContainer={false}>
        <PageTransition>
          <RichContent
            mode='html'
            htmlVariant='isolated'
            content={rawContent}
            className='prose-neutral dark:prose-invert max-w-none'
          />
        </PageTransition>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <PageTransition className='mx-auto max-w-6xl px-4 py-8'>
        <RichContent
          mode='markdown'
          content={rawContent}
          className='prose-neutral dark:prose-invert max-w-none'
        />
      </PageTransition>
    </PublicLayout>
  )
}
