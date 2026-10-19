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
import { Terminal } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AnimateInView } from '@/components/animate-in-view'
import { CopyButton } from '@/components/copy-button'
import { DEFAULT_GATEWAY_ORIGIN } from '@/lib/constants'
import { cn } from '@/lib/utils'

interface ClientGuideItem {
  id: string
  name: string
  subtitle: string
  tag: string
  protocol: string
  recommendedModel: string
  baseUrl: string
  baseUrlNote: string
  authHeader: string
  envTitle: string
  envCode: string
  configTitle: string
  configCode: string
}

const CLIENT_GUIDES: ClientGuideItem[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    subtitle: 'Anthropic 官方终端编码工具 · 支持环境变量与配置文件接入',
    tag: '主力推荐',
    protocol: 'POST /v1/messages',
    recommendedModel: 'claude-opus-5-5 · claude-sonnet-5-5',
    baseUrl: DEFAULT_GATEWAY_ORIGIN,
    baseUrlNote:
      'Claude Code 会自动拼接 /v1/messages，ANTHROPIC_BASE_URL 请直接填写根域名，无需附加 /v1。',
    authHeader: 'x-api-key / ANTHROPIC_AUTH_TOKEN',
    envTitle: '终端环境变量（即开即用）',
    envCode: `export ANTHROPIC_BASE_URL="${DEFAULT_GATEWAY_ORIGIN}"
export ANTHROPIC_AUTH_TOKEN="sk-mihouo-your-api-key"
claude --model claude-opus-5-5`,
    configTitle: '配置文件（~/.claude/settings.json）',
    configCode: `{
  "env": {
    "ANTHROPIC_BASE_URL": "${DEFAULT_GATEWAY_ORIGIN}",
    "ANTHROPIC_AUTH_TOKEN": "sk-mihouo-your-api-key",
    "ANTHROPIC_MODEL": "claude-opus-5-5",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-5-5"
  }
}`,
  },
  {
    id: 'codex-cli',
    name: 'Codex CLI',
    subtitle: 'OpenAI 官方终端智能体工具',
    tag: '原生支持',
    protocol: 'POST /v1/responses',
    recommendedModel: 'gpt-6-astra · gpt-6.1-sol',
    baseUrl: `${DEFAULT_GATEWAY_ORIGIN}/v1`,
    baseUrlNote:
      'OpenAI Codex CLI 与 Responses SDK 均以 /v1 作为基准路径，支持在会话中配置 reasoning.effort。',
    authHeader: 'Authorization: Bearer YOUR_API_KEY',
    envTitle: '终端环境变量（快速启动）',
    envCode: `export OPENAI_BASE_URL="${DEFAULT_GATEWAY_ORIGIN}/v1"
export OPENAI_API_KEY="sk-mihouo-your-api-key"
codex --model gpt-6-astra`,
    configTitle: '配置文件（~/.codex/config.toml）',
    configCode: `model = "gpt-6-astra"
model_provider = "mihouo"
model_reasoning_effort = "high"

[model_providers.mihouo]
name = "MIHOUO Optical Gateway"
base_url = "${DEFAULT_GATEWAY_ORIGIN}/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"`,
  },
  {
    id: 'opencode',
    name: 'opencode',
    subtitle: '开源终端多模型编码工具',
    tag: '多模型切换',
    protocol: 'Messages & Responses',
    recommendedModel: 'claude-opus-5-5 · glm-5.3',
    baseUrl: `${DEFAULT_GATEWAY_ORIGIN}/v1`,
    baseUrlNote:
      'opencode 支持配置多个模型列表，共用同一个 API Key 即可切换 Claude Opus 5.5、GPT-6 Astra 与 GLM-5.3。',
    authHeader: 'Authorization: Bearer / x-api-key',
    envTitle: '终端启动命令',
    envCode: `export OPENAI_BASE_URL="${DEFAULT_GATEWAY_ORIGIN}/v1"
export OPENAI_API_KEY="sk-mihouo-your-api-key"
opencode --model claude-opus-5-5`,
    configTitle: '配置文件（~/.config/opencode/opencode.json）',
    configCode: `{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "mihouo": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "MIHOUO Gateway",
      "options": {
        "baseURL": "${DEFAULT_GATEWAY_ORIGIN}/v1",
        "apiKey": "{env:OPENAI_API_KEY}"
      },
      "models": {
        "claude-opus-5-5": { "name": "Claude Opus 5.5 (1M)" },
        "gpt-6-astra": { "name": "GPT-6 Astra (1.05M)" },
        "glm-5.3": { "name": "GLM-5.3" },
        "deepseek-v4-pro": { "name": "DeepSeek V4 Pro" }
      }
    }
  }
}`,
  },
  {
    id: 'claude-desktop',
    name: 'Claude Desktop / VS Code',
    subtitle: '桌面端与 VS Code 扩展配置',
    tag: 'IDE 插件',
    protocol: 'POST /v1/messages',
    recommendedModel: 'claude-opus-5-5 · claude-fable-5-1',
    baseUrl: DEFAULT_GATEWAY_ORIGIN,
    baseUrlNote:
      'VS Code 与 JetBrains 插件默认不读取终端 Shell 变量，需在 settings.json 中配置 environmentVariables 并关闭登录弹窗。',
    authHeader: 'x-api-key: YOUR_API_KEY',
    envTitle: 'VS Code 扩展设置（.vscode/settings.json）',
    envCode: `{
  "claudeCode.disableLoginPrompt": true,
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_BASE_URL", "value": "${DEFAULT_GATEWAY_ORIGIN}" },
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "sk-mihouo-your-api-key" }
  ]
}`,
    configTitle: '客户端配置文件（~/.claude/config.json）',
    configCode: `{
  "primaryApiKey": "sk-mihouo-your-api-key",
  "customApiUrl": "${DEFAULT_GATEWAY_ORIGIN}",
  "defaultModel": "claude-opus-5-5",
  "hasCompletedOnboarding": true
}`,
  },
  {
    id: 'cursor-windsurf',
    name: 'Cursor / Windsurf / Cline',
    subtitle: 'AI 编辑器自定义 Base URL',
    tag: '编辑器',
    protocol: 'POST /v1/chat/completions',
    recommendedModel: 'claude-opus-5-5 · gpt-6.1-sol · deepseek-v4-pro',
    baseUrl: `${DEFAULT_GATEWAY_ORIGIN}/v1`,
    baseUrlNote:
      '在 Cursor Settings → Models 或 Cline 设置中开启 Override OpenAI Base URL，填入下方含 /v1 的地址即可调用全部模型。',
    authHeader: 'Authorization: Bearer YOUR_API_KEY',
    envTitle: 'Cursor / Windsurf 界面配置参数',
    envCode: `OpenAI API Key  : sk-mihouo-your-api-key
Override Base URL: ${DEFAULT_GATEWAY_ORIGIN}/v1
Custom Models   : claude-opus-5-5, gpt-6-astra, gpt-6.1-sol, glm-5.3, deepseek-v4-pro`,
    configTitle: 'Cline / Roo Code 配置文件（settings.json）',
    configCode: `{
  "cline.apiProvider": "openai",
  "cline.openAiBaseUrl": "${DEFAULT_GATEWAY_ORIGIN}/v1",
  "cline.openAiApiKey": "sk-mihouo-your-api-key",
  "cline.openAiModelId": "claude-opus-5-5",
  "cline.openAiStreamingEnabled": true
}`,
  },
  {
    id: 'standard-sdk',
    name: 'cURL / Python & TS SDK',
    subtitle: 'OpenAI 与 Anthropic 标准 SDK',
    tag: '官方 SDK',
    protocol: 'OpenAI & Anthropic SDK',
    recommendedModel: '支持平台全部已上线模型',
    baseUrl: `${DEFAULT_GATEWAY_ORIGIN}/v1`,
    baseUrlNote:
      '无论项目使用官方 openai 还是 @anthropic-ai/sdk，均无需安装额外封装库，替换 base_url 与 api_key 即可直接调用。',
    authHeader: 'Bearer / x-api-key 双模鉴权',
    envTitle: 'Python 官方 SDK（OpenAI Responses / Chat）',
    envCode: `from openai import OpenAI

client = OpenAI(
    base_url="${DEFAULT_GATEWAY_ORIGIN}/v1",
    api_key="sk-mihouo-your-api-key",
)

resp = client.responses.create(
    model="gpt-6-astra",
    reasoning={"effort": "high"},
    input="Design a lock-free ring buffer in Rust",
)`,
    configTitle: 'TypeScript 官方 SDK（Anthropic Messages）',
    configCode: `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: '${DEFAULT_GATEWAY_ORIGIN}',
  apiKey: process.env.MIHOUO_API_KEY,
});

const msg = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 4096,
  messages: [{ role: 'user', content: 'Optimize WebGL shader pipeline' }],
});`,
  },
]

export function HowItWorks() {
  const { t } = useTranslation()
  const [activeClientId, setActiveClientId] = useState<string>('claude-code')
  const [configTab, setConfigTab] = useState<'env' | 'config'>('env')

  const activeClient =
    CLIENT_GUIDES.find((c) => c.id === activeClientId) || CLIENT_GUIDES[0]
  const activeCode =
    configTab === 'env' ? activeClient.envCode : activeClient.configCode

  return (
    <section
      id='client-integration-hub'
      className='border-border relative z-10 border-t py-14 md:py-20'
    >
      <div className='mx-auto max-w-[1280px] px-6 md:px-12'>
        {/* Section Header */}
        <AnimateInView className='mb-10 flex flex-col justify-between gap-4 md:mb-12 md:flex-row md:items-end'>
          <div>
            <div className='text-muted-foreground mb-2.5 inline-flex items-center gap-2.5 text-xs tracking-[0.14em]'>
              <span className='bg-foreground/35 inline-block h-px w-5' />
              <span>{t('How It Works')}</span>
            </div>
            <h2 className='font-serif text-2xl font-normal tracking-tight md:text-[34px]'>
              {t('Three steps to get started')}
            </h2>
          </div>
          <p className='text-muted-foreground max-w-md text-[13.5px] leading-[1.65]'>
            点击左侧客户端切换专属配置
          </p>
        </AnimateInView>

        {/* Split Client Integration Hub (Left Sidebar Switcher + Right Configuration Workbench) */}
        <AnimateInView animation='fade-up'>
          <div className='border-border bg-card overflow-hidden rounded-[22px] border shadow-[0_24px_52px_-14px_rgba(20,20,18,0.065)]'>
            <div className='grid grid-cols-1 lg:grid-cols-12'>
              {/* Left Column: Client Switcher Sidebar (4 cols) */}
              <div className='border-border flex flex-col border-b bg-[#F8F7F3] p-5 md:p-6 lg:col-span-4 lg:border-r lg:border-b-0 dark:bg-zinc-900/65'>
                <div className='border-border/80 mb-3.5 flex items-center justify-between border-b pb-3'>
                  <div className='flex items-center gap-2'>
                    <Terminal className='text-foreground size-3.5' />
                    <span className='text-foreground text-xs font-semibold tracking-[0.08em]'>
                      选择客户端
                    </span>
                  </div>
                  <span className='text-muted-foreground font-mono text-[11px]'>
                    6 种常用工具
                  </span>
                </div>

                <div
                  className='space-y-1.5'
                  role='tablist'
                  aria-label='接入客户端列表'
                >
                  {CLIENT_GUIDES.map((client) => {
                    const isSelected = client.id === activeClient.id
                    return (
                      <button
                        key={client.id}
                        type='button'
                        role='tab'
                        aria-selected={isSelected}
                        onClick={() => setActiveClientId(client.id)}
                        className={cn(
                          'group flex w-full items-center justify-between gap-2 rounded-[14px] border px-4 py-3 text-left transition-all duration-200',
                          isSelected
                            ? 'border-white bg-white text-[#141413] shadow-[0_10px_24px_-8px_rgba(20,20,18,0.09),0_2px_6px_rgba(20,20,18,0.03)] dark:border-white/20 dark:bg-zinc-800 dark:text-white'
                            : 'border-transparent bg-transparent text-[#52524E] hover:border-black/5 hover:bg-white/60 hover:text-[#141413] dark:text-zinc-400 dark:hover:bg-zinc-800/40 dark:hover:text-zinc-100'
                        )}
                      >
                        <span className='flex items-center gap-2 text-[13.5px] font-semibold tracking-tight'>
                          <span
                            className={cn(
                              'size-1.5 rounded-full transition-colors',
                              isSelected
                                ? 'bg-[#141413] dark:bg-white'
                                : 'bg-black/20 dark:bg-white/20'
                            )}
                          />
                          <span>{client.name}</span>
                        </span>
                        <span
                          className={cn(
                            'rounded-full px-2 py-0.5 font-mono text-[10px] transition-colors',
                            isSelected
                              ? 'bg-[#141413] text-white dark:bg-white dark:text-[#141413]'
                              : 'bg-black/[0.04] text-[#71717A] dark:bg-white/10 dark:text-zinc-400'
                          )}
                        >
                          {client.tag}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Right Column: Streamlined Client Configuration Workbench (8 cols) */}
              <div className='flex min-w-0 flex-col justify-between p-6 md:p-8 lg:col-span-8'>
                <div>
                  {/* Client Top Header */}
                  <div className='border-border/80 flex flex-wrap items-start justify-between gap-4 border-b pb-4'>
                    <div>
                      <h3 className='text-foreground font-serif text-xl font-normal tracking-tight md:text-2xl'>
                        {activeClient.name}
                      </h3>
                      <p className='text-muted-foreground mt-1 text-[13px]'>
                        {activeClient.subtitle}
                      </p>
                    </div>

                    <div className='flex flex-col items-start gap-1.5 sm:items-end'>
                      <span className='border-border bg-background text-foreground rounded-full border px-3 py-1 font-mono text-[11px] font-medium'>
                        {activeClient.protocol}
                      </span>
                      <span className='text-muted-foreground font-mono text-[11px]'>
                        推荐：{activeClient.recommendedModel}
                      </span>
                    </div>
                  </div>

                  {/* Base URL Bar */}
                  <div className='mt-5'>
                    <div className='border-border flex flex-col justify-between gap-3 rounded-[14px] border bg-[#F8F7F3] px-4 py-3 sm:flex-row sm:items-center dark:bg-zinc-900/60'>
                      <div className='min-w-0'>
                        <div className='text-muted-foreground flex items-center gap-2 text-[11px]'>
                          <span>Base URL</span>
                          <span>·</span>
                          <span className='font-mono'>
                            {activeClient.authHeader}
                          </span>
                        </div>
                        <code className='text-foreground mt-0.5 block truncate font-mono text-[13.5px] font-semibold'>
                          {activeClient.baseUrl}
                        </code>
                      </div>
                      <CopyButton
                        value={activeClient.baseUrl}
                        variant='outline'
                        size='sm'
                        aria-label='复制 Base URL'
                        className='rounded-full px-3.5 font-mono text-[11.5px]'
                      >
                        <span>复制 Base URL</span>
                      </CopyButton>
                    </div>
                    <p className='text-muted-foreground mt-2 text-[12px] leading-[1.6]'>
                      {activeClient.baseUrlNote}
                    </p>
                  </div>

                  {/* Client Configuration Code Block */}
                  <div className='mt-5'>
                    <div className='mb-2.5 flex flex-wrap items-center justify-between gap-2'>
                      <span className='text-foreground text-[13.5px] font-semibold'>
                        配置示例
                      </span>

                      <div className='border-border inline-flex rounded-full border bg-[#F6F5F0] p-0.5 dark:bg-zinc-800'>
                        <button
                          type='button'
                          onClick={() => setConfigTab('env')}
                          className={cn(
                            'rounded-full px-3 py-1 text-[11.5px] font-medium transition-all',
                            configTab === 'env'
                              ? 'bg-white text-[#141413] shadow-xs dark:bg-zinc-900 dark:text-white'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          方式 A · 环境变量
                        </button>
                        <button
                          type='button'
                          onClick={() => setConfigTab('config')}
                          className={cn(
                            'rounded-full px-3 py-1 text-[11.5px] font-medium transition-all',
                            configTab === 'config'
                              ? 'bg-white text-[#141413] shadow-xs dark:bg-zinc-900 dark:text-white'
                              : 'text-muted-foreground hover:text-foreground'
                          )}
                        >
                          方式 B · 配置文件
                        </button>
                      </div>
                    </div>

                    <div className='border-border overflow-hidden rounded-[14px] border bg-[#161615] text-[#F4F3EE]'>
                      <div className='flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-2'>
                        <span className='font-mono text-[11.5px] text-zinc-400'>
                          {configTab === 'env'
                            ? activeClient.envTitle
                            : activeClient.configTitle}
                        </span>
                        <CopyButton
                          value={activeCode}
                          variant='ghost'
                          size='sm'
                          aria-label='复制配置'
                          className='h-6.5 rounded-full border border-white/15 bg-white/5 px-2.5 font-mono text-[11px] text-zinc-200 hover:bg-white/15 hover:text-white'
                        >
                          <span>复制配置</span>
                        </CopyButton>
                      </div>
                      <pre className='overflow-x-auto p-4 font-mono text-[12px] leading-[1.7] text-zinc-100'>
                        <code>{activeCode}</code>
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AnimateInView>
      </div>
    </section>
  )
}
