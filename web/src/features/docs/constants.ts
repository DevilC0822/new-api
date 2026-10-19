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

import type {
  BaseUrlMatrixItem,
  DocsCacheTierItem,
  DocsCategoryMeta,
  DocsClientGuideItem,
  DocsCodeLang,
  DocsFaqItem,
  DocsProtocolSpec,
  DocsSectionMeta,
  DocsStatusCodeItem,
} from './types'

export const DOCS_SECTIONS: DocsSectionMeta[] = [
  {
    id: 'overview',
    categoryId: 'getting-started',
    number: '01',
    title: '平台架构与核心优势',
    subtitle: '一枚密钥通调 Anthropic、OpenAI 与 Google 原生协议栈',
    keywords: [
      '架构',
      'overview',
      'gateway',
      'mihouo',
      '弥火',
      '双栈',
      '路由',
      '零留存',
    ],
  },
  {
    id: 'quickstart',
    categoryId: 'getting-started',
    number: '02',
    title: '三步极速接入',
    subtitle: '从创建 API 令牌到完成首条流式推理请求的完整闭环',
    keywords: [
      '快速开始',
      'quickstart',
      'api key',
      '令牌',
      '密钥',
      '测试',
      'curl',
    ],
  },
  {
    id: 'base-url-matrix',
    categoryId: 'getting-started',
    number: '03',
    title: 'Base URL 与协议路径对照',
    subtitle: '根域名与 /v1 基准路径的适配规则，彻底避免 /v1/v1 拼接错误',
    keywords: [
      'base url',
      'baseurl',
      'v1',
      'messages',
      'responses',
      'chat',
      'completions',
      '路径',
    ],
  },
  {
    id: 'client-workbench',
    categoryId: 'client-guides',
    number: '04',
    title: '客户端与 IDE 深度接入',
    subtitle:
      'Claude Code、Codex CLI、opencode、Cursor、Windsurf、Cline 与 VS Code 专属配置',
    keywords: [
      'claude code',
      'codex',
      'opencode',
      'cursor',
      'windsurf',
      'cline',
      'vscode',
      '客户端',
      'settings.json',
      'config.toml',
    ],
  },
  {
    id: 'protocol-workbench',
    categoryId: 'api-reference',
    number: '05',
    title: '多协议 API 接口参考',
    subtitle:
      'Anthropic Messages、OpenAI Responses / Chat 与 Gemini 原生接口多语言代码与参数字典',
    keywords: [
      'api',
      'messages',
      'responses',
      'chat',
      'gemini',
      'models',
      'python',
      'typescript',
      'sdk',
      '参数',
      'stream',
      'thinking',
    ],
  },
  {
    id: 'prompt-caching',
    categoryId: 'billing-and-ops',
    number: '06',
    title: '上下文缓存与透明计费',
    subtitle: '多轮代码库前缀缓存命中折扣（最高立省 97%）与 Token 审计公式',
    keywords: [
      '缓存',
      'cache',
      'prompt caching',
      '计费',
      'billing',
      'token',
      '折扣',
      '倍率',
    ],
  },
  {
    id: 'status-codes',
    categoryId: 'billing-and-ops',
    number: '07',
    title: '状态码参考与热备容灾',
    subtitle: '200 / 401 / 429 / 529 状态码语义及网关毫秒级自动通道切换机制',
    keywords: [
      '状态码',
      'status',
      '200',
      '400',
      '401',
      '403',
      '429',
      '500',
      '529',
      '报错',
      '容灾',
      '重试',
    ],
  },
  {
    id: 'faq',
    categoryId: 'billing-and-ops',
    number: '08',
    title: '常见问题解答 (FAQ)',
    subtitle: '高频配置排障、令牌权限隔离、并发限流与多模态调用答疑',
    keywords: ['faq', '常见问题', '排障', '报错', '流式', '额度', '分组'],
  },
]

export const DOCS_CATEGORIES: DocsCategoryMeta[] = [
  {
    id: 'getting-started',
    label: '快速开始',
    badge: 'Onboarding',
    sections: ['overview', 'quickstart', 'base-url-matrix'],
  },
  {
    id: 'client-guides',
    label: '客户端与 IDE 接入',
    badge: '6 Tools',
    sections: ['client-workbench'],
  },
  {
    id: 'api-reference',
    label: '多协议 API 参考',
    badge: '5 Endpoints',
    sections: ['protocol-workbench'],
  },
  {
    id: 'billing-and-ops',
    label: '计费、缓存与容灾',
    badge: 'Operations',
    sections: ['prompt-caching', 'status-codes', 'faq'],
  },
]

export const DOCS_CODE_LANGS: Array<{ id: DocsCodeLang; label: string }> = [
  { id: 'curl', label: 'cURL' },
  { id: 'python', label: 'Python' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'javascript', label: 'JavaScript' },
]

export const BASE_URL_MATRIX: BaseUrlMatrixItem[] = [
  {
    id: 'anthropic-messages',
    protocolName: 'Anthropic Messages 原生协议',
    method: 'POST',
    endpointPath: '/v1/messages',
    recommendedBaseUrlSuffix: '',
    authHeader: 'x-api-key 或 Authorization: Bearer',
    supportedClients: 'Claude Code、Claude Desktop、@anthropic-ai/sdk',
    note: 'Claude Code 与 Anthropic SDK 会自动追加 /v1/messages，Base URL 请直接填写根域名。',
  },
  {
    id: 'openai-responses',
    protocolName: 'OpenAI Responses 智能体协议',
    method: 'POST',
    endpointPath: '/v1/responses',
    recommendedBaseUrlSuffix: '/v1',
    authHeader: 'Authorization: Bearer <API_KEY>',
    supportedClients: 'OpenAI Codex CLI、openai Python/TS SDK',
    note: '支持 reasoning.effort、内建工具调用与多轮状态续接，Base URL 需包含 /v1。',
  },
  {
    id: 'openai-chat',
    protocolName: 'OpenAI Chat Completions 通用协议',
    method: 'POST',
    endpointPath: '/v1/chat/completions',
    recommendedBaseUrlSuffix: '/v1',
    authHeader: 'Authorization: Bearer <API_KEY>',
    supportedClients: 'Cursor、Windsurf、Cline、opencode、Cherry Studio',
    note: '全生态兼容性最广的标准对话协议，绝大多数第三方 AI 客户端均填写含 /v1 的地址。',
  },
  {
    id: 'google-gemini',
    protocolName: 'Google Gemini 原生协议',
    method: 'POST',
    endpointPath: '/v1beta/models/{model}:generateContent',
    recommendedBaseUrlSuffix: '',
    authHeader: 'x-goog-api-key 或 ?key=<API_KEY>',
    supportedClients: 'Google GenAI SDK、Gemini CLI',
    note: '完整支持长窗口多模态输入、原生思维链 (thinkingConfig) 与流式 streamGenerateContent。',
  },
  {
    id: 'models-discovery',
    protocolName: '模型列表与元数据发现',
    method: 'GET',
    endpointPath: '/v1/models',
    recommendedBaseUrlSuffix: '/v1',
    authHeader: 'Authorization: Bearer <API_KEY>',
    supportedClients: '所有支持拉取模型列表的 IDE 与客户端',
    note: '返回当前令牌分组有权调用的全部在线模型 ID，常用于连通性自检与客户端自动补全。',
  },
]

export const DOCS_CLIENT_GUIDES: DocsClientGuideItem[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    subtitle: 'Anthropic 官方终端编码智能体 · 原生支持多文件重构与扩展思考',
    tag: '主力推荐',
    protocol: 'POST /v1/messages',
    recommendedModel: 'claude-opus-5-5 · claude-sonnet-5-5',
    baseUrlSuffix: '',
    baseUrlNote:
      'Claude Code 会自动在 ANTHROPIC_BASE_URL 后拼接 /v1/messages，请直接填写网关根域名，切勿附加 /v1。',
    authHeader: 'x-api-key / ANTHROPIC_AUTH_TOKEN',
    envTitle: '终端环境变量（即开即用）',
    buildEnvCode: (origin) =>
      `export ANTHROPIC_BASE_URL="${origin}"
export ANTHROPIC_AUTH_TOKEN="sk-mihouo-your-api-key"
export ANTHROPIC_MODEL="claude-opus-5-5"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="claude-haiku-5-5"
claude`,
    configTitle: '持久化配置文件（~/.claude/settings.json）',
    buildConfigCode: (origin) =>
      `{
  "env": {
    "ANTHROPIC_BASE_URL": "${origin}",
    "ANTHROPIC_AUTH_TOKEN": "sk-mihouo-your-api-key",
    "ANTHROPIC_MODEL": "claude-opus-5-5",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-5-5"
  }
}`,
    verifyTitle: '验证 Anthropic Messages 协议连通性',
    buildVerifyCode: (origin) =>
      `curl ${origin}/v1/messages \\
  -H "x-api-key: sk-mihouo-your-api-key" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-opus-5-5",
    "max_tokens": 1024,
    "messages": [{ "role": "user", "content": "Hello from Claude Code" }]
  }'`,
    highlights: [
      '自动启用 Prompt Caching 前缀缓存，多轮代码库检索最高立减 95%',
      '完整透传 thinking 扩展思考块与多工具并发调用 (tool_use)',
      '建议将 ANTHROPIC_DEFAULT_HAIKU_MODEL 设为轻量模型以加速后台索引与摘要',
    ],
  },
  {
    id: 'codex-cli',
    name: 'Codex CLI',
    subtitle: 'OpenAI 官方终端智能体工具 · 原生对接 /v1/responses 协议',
    tag: '原生支持',
    protocol: 'POST /v1/responses',
    recommendedModel: 'gpt-6-astra · gpt-6.1-sol',
    baseUrlSuffix: '/v1',
    baseUrlNote:
      'OpenAI Codex CLI 与 Responses SDK 均以 /v1 作为基准路径，支持在会话中动态调节 reasoning.effort。',
    authHeader: 'Authorization: Bearer <API_KEY>',
    envTitle: '终端环境变量（快速启动）',
    buildEnvCode: (origin) =>
      `export OPENAI_BASE_URL="${origin}/v1"
export OPENAI_API_KEY="sk-mihouo-your-api-key"
codex --model gpt-6-astra`,
    configTitle: '持久化配置文件（~/.codex/config.toml）',
    buildConfigCode: (origin) =>
      `model = "gpt-6-astra"
model_provider = "mihouo"
model_reasoning_effort = "high"

[model_providers.mihouo]
name = "MIHOUO Optical Gateway"
base_url = "${origin}/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"`,
    verifyTitle: '验证 OpenAI Responses 协议连通性',
    buildVerifyCode: (origin) =>
      `curl ${origin}/v1/responses \\
  -H "Authorization: Bearer sk-mihouo-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-6-astra",
    "reasoning": { "effort": "high" },
    "input": "Refactor the authentication middleware"
  }'`,
    highlights: [
      'wire_api 设为 "responses" 即可开启原生推理链与补丁执行循环',
      '支持 1.05M 超长上下文窗口与 cached_tokens 自动折扣结算',
      '可通过 model_reasoning_effort 灵活切换 low / medium / high 思考强度',
    ],
  },
  {
    id: 'opencode',
    name: 'opencode',
    subtitle: '开源终端多模型编码工作台 · 单一配置切换全栈旗舰模型',
    tag: '多模型切换',
    protocol: 'Messages & Responses',
    recommendedModel: 'claude-opus-5-5 · gemini-4-argon · gpt-6-astra',
    baseUrlSuffix: '/v1',
    baseUrlNote:
      'opencode 支持在一个 Provider 下声明多个跨厂商模型，共用同一枚 API Key 即可随时在会话中热切换。',
    authHeader: 'Authorization: Bearer <API_KEY>',
    envTitle: '终端环境变量启动',
    buildEnvCode: (origin) =>
      `export OPENAI_BASE_URL="${origin}/v1"
export OPENAI_API_KEY="sk-mihouo-your-api-key"
opencode --model claude-opus-5-5`,
    configTitle: '全局配置文件（~/.config/opencode/opencode.json）',
    buildConfigCode: (origin) =>
      `{
  "$schema": "https://opencode.ai/config.json",
  "provider": {
    "mihouo": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "MIHOUO Gateway",
      "options": {
        "baseURL": "${origin}/v1",
        "apiKey": "{env:OPENAI_API_KEY}"
      },
      "models": {
        "claude-opus-5-5": { "name": "Claude Opus 5.5 (1M)" },
        "gpt-6-astra": { "name": "GPT-6 Astra (1.05M)" },
        "gemini-4-argon": { "name": "Gemini 4 Argon (1M)" },
        "deepseek-v4-pro": { "name": "DeepSeek V4 Pro" }
      }
    }
  }
}`,
    verifyTitle: '验证多模型兼容接口连通性',
    buildVerifyCode: (origin) =>
      `curl ${origin}/v1/chat/completions \\
  -H "Authorization: Bearer sk-mihouo-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gemini-4-argon",
    "messages": [{ "role": "user", "content": "Analyze repository architecture" }]
  }'`,
    highlights: [
      '通过 @ai-sdk/openai-compatible 一键桥接 Claude、GPT、Gemini 与 DeepSeek',
      '支持利用 {env:OPENAI_API_KEY} 引用环境变量，避免在仓库配置中硬编码密钥',
      '流式 Tool Call 与增量 Token 统计完全对齐原生体验',
    ],
  },
  {
    id: 'claude-desktop',
    name: 'Claude Desktop / VS Code',
    subtitle: 'VS Code 与 JetBrains 官方扩展配置 · 免 OAuth 登录直连网关',
    tag: 'IDE 插件',
    protocol: 'POST /v1/messages',
    recommendedModel: 'claude-opus-5-5 · claude-fable-5-1',
    baseUrlSuffix: '',
    baseUrlNote:
      'VS Code 与 JetBrains 插件进程默认不读取交互式 Shell 的 ~/.zshrc 变量，需在 IDE 设置文件中显式注入环境变量。',
    authHeader: 'x-api-key: <API_KEY>',
    envTitle: 'VS Code 扩展设置（.vscode/settings.json）',
    buildEnvCode: (origin) =>
      `{
  "claudeCode.disableLoginPrompt": true,
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_BASE_URL", "value": "${origin}" },
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "sk-mihouo-your-api-key" }
  ]
}`,
    configTitle: '客户端引导配置（~/.claude/config.json）',
    buildConfigCode: (origin) =>
      `{
  "primaryApiKey": "sk-mihouo-your-api-key",
  "customApiUrl": "${origin}",
  "defaultModel": "claude-opus-5-5",
  "hasCompletedOnboarding": true
}`,
    verifyTitle: '验证 SSE 流式输出连通性',
    buildVerifyCode: (origin) =>
      `curl -N ${origin}/v1/messages \\
  -H "x-api-key: sk-mihouo-your-api-key" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-opus-5-5",
    "stream": true,
    "max_tokens": 512,
    "messages": [{ "role": "user", "content": "Stream test" }]
  }'`,
    highlights: [
      '开启 claudeCode.disableLoginPrompt 即可跳过官方账号跳转直接进入编码会话',
      '零缓冲 SSE 流式透传，IDE 侧边栏补全与 Diff 预览无顿挫感',
      '工作区级 .vscode/settings.json 可针对不同项目绑定独立分组令牌',
    ],
  },
  {
    id: 'cursor-windsurf',
    name: 'Cursor / Windsurf / Cline',
    subtitle: '主流 AI IDE 与自主 Agent 插件自定义 Base URL 配置',
    tag: '编辑器',
    protocol: 'POST /v1/chat/completions',
    recommendedModel: 'claude-opus-5-5 · gpt-6.1-sol · deepseek-v4-pro',
    baseUrlSuffix: '/v1',
    baseUrlNote:
      '在 Cursor Settings → Models 或 Cline / Roo Code 设置中开启 OpenAI Compatible，填入含 /v1 的网关地址。',
    authHeader: 'Authorization: Bearer <API_KEY>',
    envTitle: 'Cursor / Windsurf 面板参数配置',
    buildEnvCode: (origin) =>
      `OpenAI API Key   : sk-mihouo-your-api-key
Override Base URL: ${origin}/v1
Custom Models    : claude-opus-5-5, gpt-6-astra, gpt-6.1-sol, gemini-4-argon, deepseek-v4-pro`,
    configTitle: 'Cline / Roo Code 配置文件（settings.json）',
    buildConfigCode: (origin) =>
      `{
  "cline.apiProvider": "openai",
  "cline.openAiBaseUrl": "${origin}/v1",
  "cline.openAiApiKey": "sk-mihouo-your-api-key",
  "cline.openAiModelId": "claude-opus-5-5",
  "cline.openAiStreamingEnabled": true
}`,
    verifyTitle: '验证模型列表拉取接口 (/v1/models)',
    buildVerifyCode: (origin) =>
      `curl ${origin}/v1/models \\
  -H "Authorization: Bearer sk-mihouo-your-api-key"`,
    highlights: [
      'Cline 与 Roo Code 选择 OpenAI Compatible 后同样支持长上下文文件读写工具链',
      '支持通过 /v1/models 接口一键同步平台已启用的全部模型列表',
      '遇到上游限流时网关自动毫秒级切换热备节点，保障长任务不中断',
    ],
  },
  {
    id: 'standard-sdk',
    name: 'Python & TypeScript SDK',
    subtitle: '官方 openai 与 @anthropic-ai/sdk 零改动原生接入',
    tag: '官方 SDK',
    protocol: 'OpenAI & Anthropic SDK',
    recommendedModel: '支持平台全部已上线模型',
    baseUrlSuffix: '/v1',
    baseUrlNote:
      'OpenAI SDK 的 base_url 需填写 /v1 后缀；Anthropic SDK 的 baseURL 请填写不含 /v1 的根域名。',
    authHeader: 'Bearer / x-api-key 双模鉴权',
    envTitle: 'Python 官方 SDK（OpenAI Responses / Chat）',
    buildEnvCode: (origin) =>
      `from openai import OpenAI

client = OpenAI(
    base_url="${origin}/v1",
    api_key="sk-mihouo-your-api-key",
)

resp = client.responses.create(
    model="gpt-6-astra",
    reasoning={"effort": "high"},
    input="Design a lock-free ring buffer in Rust",
)
print(resp.output_text)`,
    configTitle: 'TypeScript 官方 SDK（Anthropic Messages）',
    buildConfigCode: (origin) =>
      `import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: '${origin}',
  apiKey: process.env.MIHOUO_API_KEY,
});

const msg = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 4096,
  messages: [{ role: 'user', content: 'Optimize WebGL shader pipeline' }],
});`,
    verifyTitle: '验证标准 JSON 对话补全接口',
    buildVerifyCode: (origin) =>
      `curl ${origin}/v1/chat/completions \\
  -H "Authorization: Bearer sk-mihouo-your-api-key" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v4-pro",
    "messages": [{ "role": "user", "content": "Hello from MIHOUO" }]
  }'`,
    highlights: [
      '100% 兼容官方 SDK 类型定义、异步客户端 (AsyncOpenAI / AsyncAnthropic) 与流式迭代器',
      '无需引入任何第三方包装库，仅替换初始化时的 base_url 与 api_key 即可上线生产',
      '支持自定义超时、幂等重试及请求级 Extra Headers 透传',
    ],
  },
]

export const DOCS_PROTOCOL_SPECS: DocsProtocolSpec[] = [
  {
    id: 'messages',
    label: 'Anthropic Messages',
    badge: 'POST /v1/messages',
    method: 'POST',
    endpointPath: '/v1/messages',
    summary:
      'Anthropic 原生消息协议，完整支持扩展思考 (thinking)、前缀缓存控制 (cache_control)、视觉多模态与并行工具调用。',
    authHeader: 'x-api-key: $MIHOUO_API_KEY, anthropic-version: 2023-06-01',
    recommendedModels: [
      'claude-opus-5-5',
      'claude-sonnet-5-5',
      'claude-fable-5-1',
      'claude-haiku-5-5',
    ],
    buildSampleCode: (lang, origin) => {
      if (lang === 'curl') {
        return `curl ${origin}/v1/messages \\
  -H "x-api-key: $MIHOUO_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-opus-5-5",
    "max_tokens": 4096,
    "thinking": {
      "type": "enabled",
      "budget_tokens": 2048
    },
    "messages": [
      {
        "role": "user",
        "content": "Design a zero-copy SSE parser in Go with backpressure support."
      }
    ]
  }'`
      }
      if (lang === 'python') {
        return `import os
import anthropic

client = anthropic.Anthropic(
    base_url="${origin}",
    api_key=os.environ["MIHOUO_API_KEY"],
)

message = client.messages.create(
    model="claude-opus-5-5",
    max_tokens=4096,
    thinking={"type": "enabled", "budget_tokens": 2048},
    messages=[
        {
            "role": "user",
            "content": "Design a zero-copy SSE parser in Go with backpressure support.",
        }
    ],
)

for block in message.content:
    if block.type == "text":
        print(block.text)`
      }
      if (lang === 'typescript') {
        return `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  baseURL: '${origin}',
  apiKey: process.env.MIHOUO_API_KEY,
})

const response = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 4096,
  thinking: { type: 'enabled', budget_tokens: 2048 },
  messages: [
    {
      role: 'user',
      content: 'Design a zero-copy SSE parser in Go with backpressure support.',
    },
  ],
})

console.log(response.content)`
      }
      return `const response = await fetch('${origin}/v1/messages', {
  method: 'POST',
  headers: {
    'x-api-key': process.env.MIHOUO_API_KEY,
    'anthropic-version': '2023-06-01',
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    model: 'claude-opus-5-5',
    max_tokens: 4096,
    messages: [
      {
        role: 'user',
        content: 'Design a zero-copy SSE parser in Go with backpressure support.',
      },
    ],
  }),
})

const data = await response.json()
console.log(data.content)`
    },
    sampleResponse: `{
  "id": "msg_01MihouoOptical99281",
  "type": "message",
  "role": "assistant",
  "model": "claude-opus-5-5",
  "content": [
    {
      "type": "thinking",
      "thinking": "Analyzing bufio.Scanner vs custom ring-buffer slicing for SSE..."
    },
    {
      "type": "text",
      "text": "Here is a production-ready, zero-allocation SSE stream parser in Go..."
    }
  ],
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 42,
    "cache_creation_input_tokens": 0,
    "cache_read_input_tokens": 18400,
    "output_tokens": 618
  }
}`,
    parameters: [
      {
        name: 'model',
        type: 'string',
        required: true,
        description:
          '目标模型标识符，例如 claude-opus-5-5 或 claude-sonnet-5-5。',
      },
      {
        name: 'messages',
        type: 'array',
        required: true,
        description:
          '对话消息数组，支持文本、图像 base64、tool_use、tool_result 及 cache_control 断点。',
      },
      {
        name: 'max_tokens',
        type: 'integer',
        required: true,
        defaultValue: '4096',
        description: '单次响应允许生成的最大 Token 数量（含 thinking 预算）。',
      },
      {
        name: 'thinking',
        type: 'object',
        required: false,
        description:
          '配置 { "type": "enabled", "budget_tokens": 2048 } 开启原生深度思考块。',
      },
      {
        name: 'system',
        type: 'string | array',
        required: false,
        description:
          '系统提示词，支持传入带 cache_control: { "type": "ephemeral" } 的内容块数组。',
      },
      {
        name: 'stream',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description:
          '设为 true 时通过 Server-Sent Events (SSE) 实时推送 message_start 与 content_block_delta。',
      },
    ],
  },
  {
    id: 'responses',
    label: 'OpenAI Responses',
    badge: 'POST /v1/responses',
    method: 'POST',
    endpointPath: '/v1/responses',
    summary:
      'OpenAI 新一代 Agentic Responses 协议，专为 Codex CLI、深度推理链 (reasoning.effort) 与结构化工具协同设计。',
    authHeader: 'Authorization: Bearer $MIHOUO_API_KEY',
    recommendedModels: ['gpt-6-astra', 'gpt-6.1-sol', 'gpt-6-luna'],
    buildSampleCode: (lang, origin) => {
      if (lang === 'curl') {
        return `curl ${origin}/v1/responses \\
  -H "Authorization: Bearer $MIHOUO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-6-astra",
    "reasoning": { "effort": "high", "summary": "auto" },
    "input": "Audit this SQL transaction for phantom reads under REPEATABLE READ."
  }'`
      }
      if (lang === 'python') {
        return `import os
from openai import OpenAI

client = OpenAI(
    base_url="${origin}/v1",
    api_key=os.environ["MIHOUO_API_KEY"],
)

response = client.responses.create(
    model="gpt-6-astra",
    reasoning={"effort": "high", "summary": "auto"},
    input="Audit this SQL transaction for phantom reads under REPEATABLE READ.",
)

print(response.output_text)`
      }
      if (lang === 'typescript') {
        return `import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: '${origin}/v1',
  apiKey: process.env.MIHOUO_API_KEY,
})

const response = await client.responses.create({
  model: 'gpt-6-astra',
  reasoning: { effort: 'high', summary: 'auto' },
  input: 'Audit this SQL transaction for phantom reads under REPEATABLE READ.',
})

console.log(response.output_text)`
      }
      return `const response = await fetch('${origin}/v1/responses', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${process.env.MIHOUO_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'gpt-6-astra',
    reasoning: { effort: 'high' },
    input: 'Audit this SQL transaction for phantom reads under REPEATABLE READ.',
  }),
})

const data = await response.json()
console.log(data.output)`
    },
    sampleResponse: `{
  "id": "resp_01MihouoAstra88412",
  "object": "response",
  "model": "gpt-6-astra",
  "status": "completed",
  "output": [
    {
      "type": "reasoning",
      "summary": [
        {
          "type": "summary_text",
          "text": "Evaluating MVCC snapshot isolation vs gap locks in InnoDB and PostgreSQL..."
        }
      ]
    },
    {
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Under PostgreSQL SSI vs MySQL InnoDB next-key locking, here is the lock matrix..."
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 1280,
    "input_tokens_details": { "cached_tokens": 1152 },
    "output_tokens": 540,
    "output_tokens_details": { "reasoning_tokens": 310 },
    "total_tokens": 1820
  }
}`,
    parameters: [
      {
        name: 'model',
        type: 'string',
        required: true,
        description: '目标推理模型，例如 gpt-6-astra 或 gpt-6.1-sol。',
      },
      {
        name: 'input',
        type: 'string | array',
        required: true,
        description: '用户输入文本或多模态消息条目数组。',
      },
      {
        name: 'reasoning',
        type: 'object',
        required: false,
        description:
          '推理深度控制，支持 effort ("low" | "medium" | "high") 与 summary ("auto" | "detailed")。',
      },
      {
        name: 'instructions',
        type: 'string',
        required: false,
        description:
          '系统级指令上下文（等效于 developer / system 角色提示词）。',
      },
      {
        name: 'max_output_tokens',
        type: 'integer',
        required: false,
        description: '限制生成的最大输出 Token 数（含推理 Token）。',
      },
      {
        name: 'stream',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: '启用流式语义事件推送（如 response.output_text.delta）。',
      },
    ],
  },
  {
    id: 'chat',
    label: 'OpenAI Chat Completions',
    badge: 'POST /v1/chat/completions',
    method: 'POST',
    endpointPath: '/v1/chat/completions',
    summary:
      '行业标准通用对话接口，可将任意已上线模型（Claude、GPT、Gemini、DeepSeek、Qwen）统一映射为标准 OpenAI 格式。',
    authHeader: 'Authorization: Bearer $MIHOUO_API_KEY',
    recommendedModels: [
      'deepseek-v4-pro',
      'claude-opus-5-5',
      'gpt-6-astra',
      'gemini-4-argon',
    ],
    buildSampleCode: (lang, origin) => {
      if (lang === 'curl') {
        return `curl ${origin}/v1/chat/completions \\
  -H "Authorization: Bearer $MIHOUO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v4-pro",
    "temperature": 0.2,
    "stream": true,
    "messages": [
      { "role": "system", "content": "You are a principal distributed systems architect." },
      { "role": "user", "content": "Compare Raft ReadIndex vs LeaseRead latency." }
    ]
  }'`
      }
      if (lang === 'python') {
        return `import os
from openai import OpenAI

client = OpenAI(
    base_url="${origin}/v1",
    api_key=os.environ["MIHOUO_API_KEY"],
)

completion = client.chat.completions.create(
    model="deepseek-v4-pro",
    temperature=0.2,
    messages=[
        {"role": "system", "content": "You are a principal distributed systems architect."},
        {"role": "user", "content": "Compare Raft ReadIndex vs LeaseRead latency."},
    ],
)

print(completion.choices[0].message.content)`
      }
      if (lang === 'typescript') {
        return `import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: '${origin}/v1',
  apiKey: process.env.MIHOUO_API_KEY,
})

const completion = await client.chat.completions.create({
  model: 'deepseek-v4-pro',
  temperature: 0.2,
  messages: [
    { role: 'system', content: 'You are a principal distributed systems architect.' },
    { role: 'user', content: 'Compare Raft ReadIndex vs LeaseRead latency.' },
  ],
})

console.log(completion.choices[0]?.message.content)`
      }
      return `const response = await fetch('${origin}/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: \`Bearer \${process.env.MIHOUO_API_KEY}\`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek-v4-pro',
    temperature: 0.2,
    messages: [
      { role: 'system', content: 'You are a principal distributed systems architect.' },
      { role: 'user', content: 'Compare Raft ReadIndex vs LeaseRead latency.' },
    ],
  }),
})

const data = await response.json()
console.log(data.choices[0].message.content)`
    },
    sampleResponse: `{
  "id": "chatcmpl-mihouo773910",
  "object": "chat.completion",
  "created": 1792380000,
  "model": "deepseek-v4-pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "ReadIndex requires a quorum heartbeat round-trip to confirm leadership, whereas LeaseRead..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 64,
    "completion_tokens": 412,
    "total_tokens": 476,
    "prompt_tokens_details": { "cached_tokens": 0 }
  }
}`,
    parameters: [
      {
        name: 'model',
        type: 'string',
        required: true,
        description: '支持平台全量对话与推理模型 ID。',
      },
      {
        name: 'messages',
        type: 'array',
        required: true,
        description:
          '包含 system / developer / user / assistant / tool 角色的消息数组。',
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        defaultValue: '1.0',
        description:
          '采样温度 (0.0 ~ 2.0)，代码生成与严谨分析建议设为 0.1 ~ 0.3。',
      },
      {
        name: 'tools',
        type: 'array',
        required: false,
        description:
          'JSON Schema 格式的函数工具定义列表，支持并行 Function Calling。',
      },
      {
        name: 'response_format',
        type: 'object',
        required: false,
        description:
          '支持 { "type": "json_object" } 或 { "type": "json_schema" } 强约束结构化输出。',
      },
      {
        name: 'stream_options',
        type: 'object',
        required: false,
        description:
          '流式模式下传入 { "include_usage": true } 可在末尾 chunk 获取精确 Token 账单。',
      },
    ],
  },
  {
    id: 'gemini',
    label: 'Google Gemini Native',
    badge: 'POST /v1beta/models/{model}:generateContent',
    method: 'POST',
    endpointPath: '/v1beta/models/gemini-4-argon:generateContent',
    summary:
      'Google Gemini /v1beta 原生协议，支持 1M 超长多模态上下文、thinkingConfig 思维预算及原生代码库解耦。',
    authHeader: 'x-goog-api-key: $MIHOUO_API_KEY 或 URL ?key=',
    recommendedModels: ['gemini-4-argon', 'gemini-3.8-flash'],
    buildSampleCode: (lang, origin) => {
      if (lang === 'curl') {
        return `curl "${origin}/v1beta/models/gemini-4-argon:generateContent" \\
  -H "x-goog-api-key: $MIHOUO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Synthesize a dependency graph for a multi-crate Rust workspace." }
        ]
      }
    ],
    "generationConfig": {
      "temperature": 0.2,
      "thinkingConfig": { "thinkingBudget": 2048 }
    }
  }'`
      }
      if (lang === 'python') {
        return `import os
import requests

url = "${origin}/v1beta/models/gemini-4-argon:generateContent"
headers = {
    "x-goog-api-key": os.environ["MIHOUO_API_KEY"],
    "Content-Type": "application/json",
}
payload = {
    "contents": [
        {
            "role": "user",
            "parts": [{"text": "Synthesize a dependency graph for a multi-crate Rust workspace."}],
        }
    ],
    "generationConfig": {
        "temperature": 0.2,
        "thinkingConfig": {"thinkingBudget": 2048},
    },
}

resp = requests.post(url, headers=headers, json=payload, timeout=60)
print(resp.json()["candidates"][0]["content"]["parts"][0]["text"])`
      }
      if (lang === 'typescript') {
        return `const response = await fetch(
  '${origin}/v1beta/models/gemini-4-argon:generateContent',
  {
    method: 'POST',
    headers: {
      'x-goog-api-key': process.env.MIHOUO_API_KEY ?? '',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Synthesize a dependency graph for a multi-crate Rust workspace.' }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 2048 },
      },
    }),
  }
)

const data = await response.json()
console.log(data.candidates?.[0]?.content?.parts?.[0]?.text)`
      }
      return `const response = await fetch(
  '${origin}/v1beta/models/gemini-4-argon:generateContent',
  {
    method: 'POST',
    headers: {
      'x-goog-api-key': process.env.MIHOUO_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: 'Synthesize a dependency graph for a multi-crate Rust workspace.' }],
        },
      ],
    }),
  }
)

const data = await response.json()
console.log(data.candidates[0].content.parts[0].text)`
    },
    sampleResponse: `{
  "candidates": [
    {
      "content": {
        "role": "model",
        "parts": [
          {
            "text": "Below is the topological crate dependency order and feature flag isolation plan..."
          }
        ]
      },
      "finishReason": "STOP"
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 38,
    "cachedContentTokenCount": 0,
    "candidatesTokenCount": 490,
    "thoughtsTokenCount": 612,
    "totalTokenCount": 1140
  }
}`,
    parameters: [
      {
        name: 'contents',
        type: 'array',
        required: true,
        description:
          '多轮对话内容数组，每个元素包含 role ("user" | "model") 与 parts 列表。',
      },
      {
        name: 'systemInstruction',
        type: 'object',
        required: false,
        description:
          '系统级指令对象，格式为 { "parts": [{ "text": "..." }] }。',
      },
      {
        name: 'generationConfig',
        type: 'object',
        required: false,
        description:
          '控制 temperature、maxOutputTokens、responseMimeType 与 thinkingConfig。',
      },
      {
        name: 'tools',
        type: 'array',
        required: false,
        description: '支持 functionDeclarations 函数声明与原生工具调用。',
      },
    ],
  },
  {
    id: 'models',
    label: 'Models Discovery',
    badge: 'GET /v1/models',
    method: 'GET',
    endpointPath: '/v1/models',
    summary:
      '查询当前 API 令牌分组下所有可用模型的实时列表，常用于客户端连通性校验与 IDE 模型下拉菜单自动同步。',
    authHeader: 'Authorization: Bearer $MIHOUO_API_KEY',
    recommendedModels: ['claude-opus-5-5', 'gpt-6-astra', 'gemini-4-argon'],
    buildSampleCode: (lang, origin) => {
      if (lang === 'curl') {
        return `curl ${origin}/v1/models \\
  -H "Authorization: Bearer $MIHOUO_API_KEY"`
      }
      if (lang === 'python') {
        return `import os
from openai import OpenAI

client = OpenAI(
    base_url="${origin}/v1",
    api_key=os.environ["MIHOUO_API_KEY"],
)

models = client.models.list()
for m in models.data[:10]:
    print(m.id)`
      }
      if (lang === 'typescript') {
        return `import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: '${origin}/v1',
  apiKey: process.env.MIHOUO_API_KEY,
})

const list = await client.models.list()
console.log(list.data.map((m) => m.id))`
      }
      return `const response = await fetch('${origin}/v1/models', {
  headers: {
    Authorization: \`Bearer \${process.env.MIHOUO_API_KEY}\`,
  },
})

const { data } = await response.json()
console.log(data.map((m) => m.id))`
    },
    sampleResponse: `{
  "object": "list",
  "data": [
    {
      "id": "claude-opus-5-5",
      "object": "model",
      "created": 1790000000,
      "owned_by": "anthropic"
    },
    {
      "id": "gpt-6-astra",
      "object": "model",
      "created": 1790000000,
      "owned_by": "openai"
    },
    {
      "id": "gemini-4-argon",
      "object": "model",
      "created": 1790000000,
      "owned_by": "google"
    },
    {
      "id": "deepseek-v4-pro",
      "object": "model",
      "created": 1790000000,
      "owned_by": "deepseek"
    }
  ]
}`,
    parameters: [
      {
        name: 'Authorization',
        type: 'header',
        required: true,
        description:
          '传入 Bearer <API_KEY>，返回结果会自动按该令牌所属分组及模型白名单过滤。',
      },
    ],
  },
]

export const DOCS_CACHE_TIERS: DocsCacheTierItem[] = [
  {
    id: 'anthropic-cache',
    protocol: 'Anthropic /v1/messages',
    modelFamily: 'Claude Opus 5.5 / Sonnet 5.5 / Haiku 5.5',
    writeMultiplier: '1.25× 输入单价（或自动免写入费）',
    readDiscount: '0.05× ~ 0.10×（最高立减 95%）',
    ttl: '5 分钟滚动窗口（命中自动续期）',
    description:
      'Claude Code 会自动在系统提示词与代码库上下文末尾注入 cache_control 断点，多轮重构仅对增量对话计全价。',
  },
  {
    id: 'openai-cache',
    protocol: 'OpenAI /v1/responses & Chat',
    modelFamily: 'GPT-6 Astra / GPT-6.1 Sol / GPT-6 Luna',
    writeMultiplier: '1.00×（无额外缓存创建费）',
    readDiscount: '0.05× ~ 0.25×（最高立减 95%）',
    ttl: '5 ~ 60 分钟自动前缀路由',
    description:
      '输入超过 1,024 Tokens 时自动触发前缀哈希匹配，无需手动修改请求体即可在 usage.input_tokens_details.cached_tokens 查看命中量。',
  },
  {
    id: 'gemini-deepseek-cache',
    protocol: 'Google /v1beta & DeepSeek',
    modelFamily: 'Gemini 4 Argon / DeepSeek V4 Pro',
    writeMultiplier: '1.00×（隐式上下文缓存）',
    readDiscount: '最高立减 95% ~ 97%',
    ttl: '会话级动态保活',
    description:
      '网关智能亲和性路由会将同一 API Key 的连续会话固定至同一上游热节点，最大化多轮仓库级分析的缓存命中率。',
  },
]

export const DOCS_STATUS_CODES: DocsStatusCodeItem[] = [
  {
    code: '200 OK',
    httpStatus: '200',
    title: '直连成功 · 实时流式透传',
    severity: 'outline',
    badgeClassName: 'border-success/30 bg-success/10 text-success',
    gatewayBehavior:
      '零缓冲直通上游模型节点，实时结算输入、缓存命中与输出/思考 Token。',
    resolution:
      '连接正常，可在控制台「使用日志」中查看单次请求的详细耗时与缓存命中明细。',
  },
  {
    code: '400 Bad Request',
    httpStatus: '400',
    title: '请求参数或协议路径不匹配',
    severity: 'warning',
    gatewayBehavior:
      '请求体 JSON 格式有误、必填字段缺失（如 Anthropic 缺少 max_tokens）或路径拼接了 /v1/v1。',
    resolution:
      '核对上方「Base URL 与协议路径对照表」，确保 Claude Code 不带 /v1，而 OpenAI 客户端带 /v1。',
  },
  {
    code: '401 Unauthorized',
    httpStatus: '401',
    title: '令牌鉴权失败或已过期',
    severity: 'warning',
    gatewayBehavior: '网关拦截未授权请求，不产生任何额度扣费。',
    resolution:
      '检查 API Key 是否以 sk- 开头、是否包含多余空格，或在控制台「API 令牌」页面确认令牌未过期且未禁用。',
  },
  {
    code: '403 Forbidden',
    httpStatus: '403',
    title: '分组权限、模型白名单或额度不足',
    severity: 'warning',
    gatewayBehavior:
      '当前令牌未授权调用目标模型、请求来源 IP 不在令牌白名单内，或账户/令牌剩余额度不足。',
    resolution:
      '前往「令牌管理」检查该令牌绑定的分组（Group）与模型限制，或前往「钱包」确认余额充足。',
  },
  {
    code: '429 Too Many Requests',
    httpStatus: '429',
    title: '触发并发速率保护 (RPM / TPM)',
    severity: 'destructive',
    gatewayBehavior:
      '当上游通道繁忙时，网关会优先在内部自动切换备用通道；仅当所有热备池均达峰值或令牌自身限流时返回 429。',
    resolution:
      '客户端（如 Claude Code / Codex）自带指数退避重试，稍候数秒即可自动恢复。',
  },
  {
    code: '502 / 529 Failover',
    httpStatus: '502 / 529',
    title: '上游过载 · 毫秒级自动容灾切换',
    severity: 'destructive',
    gatewayBehavior:
      '检测到上游返回 502/503/529 时，网关在首包发出前会在 < 50ms 内静默重路由至跨区域健康专线。',
    resolution:
      '未产出有效响应的失败请求绝不扣费；若持续出现，可切换同级别备选模型（如 claude-sonnet-5-5）。',
  },
]

export const DOCS_FAQ_ITEMS: DocsFaqItem[] = [
  {
    id: 'faq-baseurl-v1',
    category: '接入配置',
    question:
      '为什么有时候报错 404 Not Found，什么时候该加 /v1，什么时候不加？',
    answer:
      '取决于客户端内部如何拼接路径：Anthropic 官方工具（Claude Code、Claude Desktop、@anthropic-ai/sdk）会自动在 Base URL 后拼接 /v1/messages，因此只需填写根域名（如 https://api.mihouo.com）；而 OpenAI 生态工具（Codex CLI、Cursor、Windsurf、Cline、opencode、OpenAI SDK）只会拼接 /chat/completions 或 /responses，因此必须填写带 /v1 的地址（如 https://api.mihouo.com/v1）。',
  },
  {
    id: 'faq-claude-code-login',
    category: '客户端排障',
    question:
      '在 VS Code 中使用 Claude Code 扩展，为什么仍然弹出官方账号登录框？',
    answer:
      'VS Code 扩展宿主进程默认不会读取你在终端 ~/.zshrc 中 exports 的变量。请打开 VS Code 的 settings.json，将 "claudeCode.disableLoginPrompt" 设为 true，并在 "claudeCode.environmentVariables" 数组中显式配置 ANTHROPIC_BASE_URL 与 ANTHROPIC_AUTH_TOKEN，保存后重载窗口即可直接生效。',
  },
  {
    id: 'faq-prompt-caching',
    category: '计费与缓存',
    question: '如何开启 Prompt Caching 缓存立减？需要手动修改代码吗？',
    answer:
      '在 Claude Code、Codex CLI、Cursor 与 Cline 等主流工具中无需任何额外配置，客户端与 MIHOUO 网关会自动协商前缀缓存与会话亲和性路由。若您自行调用 Anthropic /v1/messages 接口，只需在长系统提示词或仓库上下文块中添加 cache_control: { "type": "ephemeral" }；调用 OpenAI /v1/responses 或 /v1/chat/completions 时，超过 1,024 Tokens 的相同前缀会自动触发缓存折扣。',
  },
  {
    id: 'faq-token-accounting',
    category: '计费与缓存',
    question:
      '模型深度思考（Thinking / Reasoning）产生的 Token 是如何计费和展示的？',
    answer:
      '遵循上游官方标准，模型在内部推理链（Anthropic thinking 块、OpenAI reasoning_tokens、Gemini thoughtsTokenCount）中生成的 Token 均按该模型的输出 Token（Completion Price）单价精算。您可以在控制台「使用日志」中清晰查看每一笔请求的输入 Token、缓存读取 Token、输出 Token 与思考 Token 分列明细。',
  },
  {
    id: 'faq-token-security',
    category: '安全与权限',
    question:
      '团队多人或多项目共用账号时，如何隔离不同环境的 API Key 权限与预算？',
    answer:
      '前往控制台「API 令牌」页面，您可以为每个项目或成员创建独立的子令牌，并分别配置：1) 可用额度上限与过期时间；2) 允许调用的模型白名单；3) 专属通道分组（Group）；4) 来源服务器 IP 白名单。任何子令牌泄露均可随时独立吊销，不影响其他业务线运行。',
  },
  {
    id: 'faq-data-privacy',
    category: '安全与权限',
    question: '通过网关转发的代码与提示词内容会被保存或用于模型训练吗？',
    answer:
      '绝不会。MIHOUO 采用零数据留存（Zero-Data Retention）流式转发架构：网关仅在内存中流式透传 SSE 数据块并记录脱敏后的 Token 数量、耗时与状态码用于账单核对，不会落盘存储您的代码片段、Prompt 正文或模型补全内容，更不会用于任何模型训练。',
  },
]
