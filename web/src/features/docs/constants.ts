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
  BaseUrlEndpointCard,
  DocsClientGuideItem,
  DocsCodeLang,
  DocsFaqItem,
  DocsProtocolSpec,
  DocsSectionMeta,
  DocsStatusCodeItem,
} from './types'

export const DOCS_SECTIONS: DocsSectionMeta[] = [
  {
    id: 'base-url-matrix',
    number: '01',
    title: 'Quickstart',
    subtitle: 'Dual-protocol endpoints and request examples',
  },
  {
    id: 'client-workbench',
    number: '02',
    title: 'Client Configuration',
    subtitle: 'Configuration for popular CLIs, IDEs, and desktop clients',
  },
  {
    id: 'protocol-workbench',
    number: '03',
    title: 'API Reference',
    subtitle: 'Request examples and parameters for dual protocols',
  },
  {
    id: 'status-codes',
    number: '04',
    title: 'Status Codes & Troubleshooting',
    subtitle: 'Common error status codes and frequently asked questions',
  },
]

export const DOCS_CODE_LANGS: Array<{ id: DocsCodeLang; label: string }> = [
  { id: 'curl', label: 'cURL' },
  { id: 'python', label: 'Python' },
  { id: 'typescript', label: 'TypeScript' },
]

export const BASE_URL_CARDS: BaseUrlEndpointCard[] = [
  {
    id: 'anthropic',
    title: 'Anthropic Native Protocol',
    protocolBadge: 'POST /v1/messages',
    baseUrlSuffix: '',
    authHeader: 'x-api-key: $API_KEY',
    clients: 'Claude Code · Claude Desktop · @anthropic-ai/sdk',
    ruleNote:
      'The client automatically appends /v1/messages; provide the root gateway URL.',
  },
  {
    id: 'openai',
    title: 'OpenAI Compatible Protocol',
    protocolBadge: 'POST /v1/responses · /v1/chat/completions',
    baseUrlSuffix: '/v1',
    authHeader: 'Authorization: Bearer $API_KEY',
    clients:
      'Codex CLI · Cursor · Windsurf · Cline · Cherry Studio · OpenAI SDK',
    ruleNote:
      'The client uses /v1 as the base path; provide the URL with the /v1 suffix.',
  },
]

export const DOCS_EXAMPLE_MODEL = {
  modelId: 'claude-opus-5-5',
  displayName: 'Claude Opus 5.5',
}

export const DOCS_CLIENT_GUIDES: DocsClientGuideItem[] = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    tag: 'Recommended CLI',
    protocol: 'POST /v1/messages',
    exampleModel: 'claude-opus-5-5',
    baseUrlSuffix: '',
    baseUrlNote:
      'Claude Code automatically appends /v1/messages to ANTHROPIC_BASE_URL; please provide the root domain.',
    envTitle: 'Terminal Environment Variables',
    buildEnvCode: (origin) =>
      `export ANTHROPIC_BASE_URL="${origin}"
export ANTHROPIC_AUTH_TOKEN="sk-your-api-key"
export ANTHROPIC_MODEL="claude-opus-5-5"
export ANTHROPIC_DEFAULT_HAIKU_MODEL="claude-haiku-5-5"
claude`,
    configTitle: '~/.claude/settings.json',
    buildConfigCode: (origin) =>
      `{
  "env": {
    "ANTHROPIC_BASE_URL": "${origin}",
    "ANTHROPIC_AUTH_TOKEN": "sk-your-api-key",
    "ANTHROPIC_MODEL": "claude-opus-5-5",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "claude-haiku-5-5"
  }
}`,
  },
  {
    id: 'codex-cli',
    name: 'Codex CLI',
    tag: 'Responses',
    protocol: 'POST /v1/responses',
    exampleModel: 'gpt-6-astra',
    baseUrlSuffix: '/v1',
    baseUrlNote:
      'Codex CLI uses /v1 as the base path. Set wire_api to responses to enable native reasoning chains.',
    envTitle: 'Terminal Environment Variables',
    buildEnvCode: (origin) =>
      `export OPENAI_BASE_URL="${origin}/v1"
export OPENAI_API_KEY="sk-your-api-key"
codex --model gpt-6-astra`,
    configTitle: '~/.codex/config.toml',
    buildConfigCode: (origin) =>
      `model = "gpt-6-astra"
model_provider = "gateway"
model_reasoning_effort = "high"

[model_providers.gateway]
name = "Unified Gateway"
base_url = "${origin}/v1"
env_key = "OPENAI_API_KEY"
wire_api = "responses"`,
  },
  {
    id: 'cursor-windsurf',
    name: 'Cursor / Windsurf / Cline',
    tag: 'AI IDE',
    protocol: 'POST /v1/chat/completions',
    exampleModel: 'claude-opus-5-5',
    baseUrlSuffix: '/v1',
    baseUrlNote:
      'Enable OpenAI Compatible in IDE settings, enter the gateway URL with /v1 and your custom model ID.',
    envTitle: 'Cursor / Windsurf Parameters',
    buildEnvCode: (origin) =>
      `OpenAI API Key   : sk-your-api-key
Override Base URL: ${origin}/v1
Custom Model ID  : claude-opus-5-5`,
    configTitle: 'Cline / Roo Code settings.json',
    buildConfigCode: (origin) =>
      `{
  "cline.apiProvider": "openai",
  "cline.openAiBaseUrl": "${origin}/v1",
  "cline.openAiApiKey": "sk-your-api-key",
  "cline.openAiModelId": "claude-opus-5-5"
}`,
  },
  {
    id: 'claude-desktop',
    name: 'Claude Desktop / VS Code',
    tag: 'IDE Extension',
    protocol: 'POST /v1/messages',
    exampleModel: 'claude-opus-5-5',
    baseUrlSuffix: '',
    baseUrlNote:
      'VS Code extension processes do not read shell environment variables by default; inject them in settings.json and disable login prompts.',
    envTitle: '.vscode/settings.json',
    buildEnvCode: (origin) =>
      `{
  "claudeCode.disableLoginPrompt": true,
  "claudeCode.environmentVariables": [
    { "name": "ANTHROPIC_BASE_URL", "value": "${origin}" },
    { "name": "ANTHROPIC_AUTH_TOKEN", "value": "sk-your-api-key" }
  ]
}`,
    configTitle: '~/.claude/config.json',
    buildConfigCode: (origin) =>
      `{
  "primaryApiKey": "sk-your-api-key",
  "customApiUrl": "${origin}",
  "defaultModel": "claude-opus-5-5",
  "hasCompletedOnboarding": true
}`,
  },
  {
    id: 'cherry-ccswitch',
    name: 'Cherry Studio / CC Switch',
    tag: 'Desktop',
    protocol: 'Anthropic & OpenAI',
    exampleModel: 'claude-opus-5-5',
    baseUrlSuffix: '/v1',
    baseUrlNote:
      'Supports one-click import from the API Tokens page; when configuring manually, enter the URL with /v1.',
    envTitle: 'Cherry Studio Manual Configuration',
    buildEnvCode: (origin) =>
      `Provider Type: OpenAI Compatible
Base URL     : ${origin}/v1
API Key      : sk-your-api-key
Sample Model : claude-opus-5-5`,
    configTitle: 'CC Switch Import JSON',
    buildConfigCode: (origin) =>
      `{
  "name": "Gateway",
  "baseUrl": "${origin}",
  "apiKey": "sk-your-api-key",
  "models": ["claude-opus-5-5"]
}`,
  },
]

export const DOCS_PROTOCOL_SPECS: DocsProtocolSpec[] = [
  {
    id: 'messages',
    label: 'Anthropic Messages',
    badge: 'POST /v1/messages',
    method: 'POST',
    endpointPath: '/v1/messages',
    authHeader: 'x-api-key: $MIHOUO_API_KEY, anthropic-version: 2023-06-01',
    buildSampleCode: (lang, origin) => {
      if (lang === 'curl') {
        return `curl ${origin}/v1/messages \\
  -H "x-api-key: $MIHOUO_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '{
    "model": "claude-opus-5-5",
    "max_tokens": 4096,
    "thinking": { "type": "enabled", "budget_tokens": 2048 },
    "messages": [
      { "role": "user", "content": "Design a zero-copy SSE parser in Go." }
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
    messages=[{"role": "user", "content": "Design a zero-copy SSE parser in Go."}],
)
print(message.content)`
      }
      return `import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  baseURL: '${origin}',
  apiKey: process.env.MIHOUO_API_KEY,
})

const response = await client.messages.create({
  model: 'claude-opus-5-5',
  max_tokens: 4096,
  thinking: { type: 'enabled', budget_tokens: 2048 },
  messages: [{ role: 'user', content: 'Design a zero-copy SSE parser in Go.' }],
})
console.log(response.content)`
    },
    sampleResponse: `{
  "id": "msg_01MihouoOptical99281",
  "type": "message",
  "role": "assistant",
  "model": "claude-opus-5-5",
  "content": [
    {
      "type": "thinking",
      "thinking": "Analyzing ring-buffer slicing for SSE..."
    },
    {
      "type": "text",
      "text": "Here is a zero-allocation SSE stream parser in Go..."
    }
  ],
  "stop_reason": "end_turn",
  "usage": {
    "input_tokens": 42,
    "cache_read_input_tokens": 18400,
    "output_tokens": 618
  }
}`,
    parameters: [
      {
        name: 'model',
        type: 'string',
        required: true,
        description: 'Model identifier, e.g. claude-opus-5-5.',
      },
      {
        name: 'messages',
        type: 'array',
        required: true,
        description:
          'List of messages supporting text, images, tool_use, and cache_control.',
      },
      {
        name: 'max_tokens',
        type: 'integer',
        required: true,
        defaultValue: '4096',
        description: 'Maximum tokens allowed in a single response generation.',
      },
      {
        name: 'thinking',
        type: 'object',
        required: false,
        description:
          'Set { "type": "enabled", "budget_tokens": 2048 } to enable extended thinking.',
      },
      {
        name: 'stream',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Set to true to enable SSE streaming responses.',
      },
    ],
  },
  {
    id: 'responses',
    label: 'OpenAI Responses',
    badge: 'POST /v1/responses',
    method: 'POST',
    endpointPath: '/v1/responses',
    authHeader: 'Authorization: Bearer $MIHOUO_API_KEY',
    buildSampleCode: (lang, origin) => {
      if (lang === 'curl') {
        return `curl ${origin}/v1/responses \\
  -H "Authorization: Bearer $MIHOUO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-6-astra",
    "reasoning": { "effort": "high" },
    "input": "Audit this SQL transaction for phantom reads."
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
    reasoning={"effort": "high"},
    input="Audit this SQL transaction for phantom reads.",
)
print(response.output_text)`
      }
      return `import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: '${origin}/v1',
  apiKey: process.env.MIHOUO_API_KEY,
})

const response = await client.responses.create({
  model: 'gpt-6-astra',
  reasoning: { effort: 'high' },
  input: 'Audit this SQL transaction for phantom reads.',
})
console.log(response.output_text)`
    },
    sampleResponse: `{
  "id": "resp_01MihouoAstra88412",
  "object": "response",
  "model": "gpt-6-astra",
  "status": "completed",
  "output": [
    {
      "type": "message",
      "role": "assistant",
      "content": [
        {
          "type": "output_text",
          "text": "Under PostgreSQL SSI vs MySQL InnoDB next-key locking..."
        }
      ]
    }
  ],
  "usage": {
    "input_tokens": 1280,
    "output_tokens": 540,
    "total_tokens": 1820
  }
}`,
    parameters: [
      {
        name: 'model',
        type: 'string',
        required: true,
        description: 'Model identifier, e.g. gpt-6-astra.',
      },
      {
        name: 'input',
        type: 'string | array',
        required: true,
        description: 'Input prompt string or multimodal message array.',
      },
      {
        name: 'reasoning',
        type: 'object',
        required: false,
        description:
          'Reasoning effort configuration, e.g. effort: "low" | "medium" | "high".',
      },
      {
        name: 'stream',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Enables streaming semantic events.',
      },
    ],
  },
  {
    id: 'chat',
    label: 'OpenAI Chat',
    badge: 'POST /v1/chat/completions',
    method: 'POST',
    endpointPath: '/v1/chat/completions',
    authHeader: 'Authorization: Bearer $MIHOUO_API_KEY',
    buildSampleCode: (lang, origin) => {
      if (lang === 'curl') {
        return `curl ${origin}/v1/chat/completions \\
  -H "Authorization: Bearer $MIHOUO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "deepseek-v4-pro",
    "stream": true,
    "messages": [
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
    messages=[{"role": "user", "content": "Compare Raft ReadIndex vs LeaseRead latency."}],
)
print(completion.choices[0].message.content)`
      }
      return `import OpenAI from 'openai'

const client = new OpenAI({
  baseURL: '${origin}/v1',
  apiKey: process.env.MIHOUO_API_KEY,
})

const completion = await client.chat.completions.create({
  model: 'deepseek-v4-pro',
  messages: [{ role: 'user', content: 'Compare Raft ReadIndex vs LeaseRead latency.' }],
})
console.log(completion.choices[0]?.message.content)`
    },
    sampleResponse: `{
  "id": "chatcmpl-mihouo773910",
  "object": "chat.completion",
  "model": "deepseek-v4-pro",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "ReadIndex requires a quorum heartbeat round-trip..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 64,
    "completion_tokens": 412,
    "total_tokens": 476
  }
}`,
    parameters: [
      {
        name: 'model',
        type: 'string',
        required: true,
        description: 'Model identifier, e.g. deepseek-v4-pro.',
      },
      {
        name: 'messages',
        type: 'array',
        required: true,
        description:
          'Array of messages containing system, user, assistant, and tool roles.',
      },
      {
        name: 'temperature',
        type: 'number',
        required: false,
        defaultValue: '1.0',
        description:
          'Sampling temperature; recommended 0.1 to 0.3 for code generation.',
      },
      {
        name: 'stream',
        type: 'boolean',
        required: false,
        defaultValue: 'false',
        description: 'Set to true to enable SSE streaming responses.',
      },
    ],
  },
]

export const DOCS_STATUS_CODES: DocsStatusCodeItem[] = [
  {
    code: '400 Bad Request',
    title: 'Parameter or Path Formatting Error',
    severity: 'warning',
    description:
      'Often caused by duplicate path segments (e.g. /v1/v1) or missing required parameters. Ensure Anthropic clients use the root domain and OpenAI clients use /v1.',
  },
  {
    code: '401 Unauthorized',
    title: 'Authentication Failed',
    severity: 'warning',
    description:
      'Check that your API key starts with sk-, has no extra spaces, and is active in the console API Tokens page.',
  },
  {
    code: '403 Forbidden',
    title: 'Group Permission or Insufficient Quota',
    severity: 'warning',
    description:
      'The token lacks authorization for the target model, the IP is not allowlisted, or remaining quota is insufficient. We recommend keeping the default auto group.',
  },
  {
    code: '429 / 5xx',
    title: 'Rate Limiting & Automatic Failover',
    severity: 'destructive',
    description:
      'When upstream nodes are busy, the gateway automatically switches to healthy standby channels; billing is strictly based on valid token usage responses.',
  },
]

export const DOCS_FAQ_ITEMS: DocsFaqItem[] = [
  {
    id: 'faq-baseurl-v1',
    question:
      'When should Base URL include /v1, and when should it be omitted?',
    answer:
      'Anthropic tools (Claude Code, Claude Desktop, @anthropic-ai/sdk) automatically append /v1/messages, so provide the root URL. OpenAI tools (Codex CLI, Cursor, Cline, Cherry Studio, OpenAI SDK) require the /v1 suffix.',
  },
  {
    id: 'faq-auto-group',
    question:
      'Do I need multiple API tokens for models from different providers?',
    answer:
      'No. A single token with the default auto group can access all available models using the model parameter, and the gateway routes requests automatically.',
  },
  {
    id: 'faq-token-security',
    question: 'How can teams isolate budgets and permissions across projects?',
    answer:
      'Create separate sub-tokens for each project on the API Tokens page, each with its own quota cap, expiration date, model allowlist, and client IP allowlist.',
  },
]
