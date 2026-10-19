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

export type DocsCategoryId =
  | 'getting-started'
  | 'client-guides'
  | 'api-reference'
  | 'billing-and-ops'

export type DocsSectionId =
  | 'overview'
  | 'quickstart'
  | 'base-url-matrix'
  | 'client-workbench'
  | 'protocol-workbench'
  | 'prompt-caching'
  | 'status-codes'
  | 'faq'

export interface DocsSectionMeta {
  id: DocsSectionId
  categoryId: DocsCategoryId
  number: string
  title: string
  subtitle: string
  keywords: string[]
}

export interface DocsCategoryMeta {
  id: DocsCategoryId
  label: string
  badge: string
  sections: DocsSectionId[]
}

export interface BaseUrlMatrixItem {
  id: string
  protocolName: string
  method: 'POST' | 'GET'
  endpointPath: string
  recommendedBaseUrlSuffix: string
  authHeader: string
  supportedClients: string
  note: string
}

export interface DocsClientGuideItem {
  id: string
  name: string
  subtitle: string
  tag: string
  protocol: string
  recommendedModel: string
  baseUrlSuffix: string
  baseUrlNote: string
  authHeader: string
  envTitle: string
  buildEnvCode: (gatewayOrigin: string) => string
  configTitle: string
  buildConfigCode: (gatewayOrigin: string) => string
  verifyTitle: string
  buildVerifyCode: (gatewayOrigin: string) => string
  highlights: string[]
}

export type DocsCodeLang = 'curl' | 'python' | 'typescript' | 'javascript'

export interface ProtocolParamItem {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description: string
}

export interface DocsProtocolSpec {
  id: 'messages' | 'responses' | 'chat' | 'gemini' | 'models'
  label: string
  badge: string
  method: 'POST' | 'GET'
  endpointPath: string
  summary: string
  authHeader: string
  recommendedModels: string[]
  buildSampleCode: (lang: DocsCodeLang, gatewayOrigin: string) => string
  sampleResponse: string
  parameters: ProtocolParamItem[]
}

export interface DocsCacheTierItem {
  id: string
  protocol: string
  modelFamily: string
  writeMultiplier: string
  readDiscount: string
  ttl: string
  description: string
}

export interface DocsStatusCodeItem {
  code: string
  httpStatus: string
  title: string
  severity: 'outline' | 'warning' | 'destructive'
  badgeClassName?: string
  gatewayBehavior: string
  resolution: string
}

export interface DocsFaqItem {
  id: string
  question: string
  answer: string
  category: string
}
