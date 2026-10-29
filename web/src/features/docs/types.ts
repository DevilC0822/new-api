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
export type DocsSectionId =
  | 'base-url-matrix'
  | 'client-workbench'
  | 'protocol-workbench'
  | 'status-codes'

export interface DocsSectionMeta {
  id: DocsSectionId
  number: string
  title: string
  subtitle: string
}

export interface BaseUrlEndpointCard {
  id: 'anthropic' | 'openai'
  title: string
  protocolBadge: string
  baseUrlSuffix: string
  authHeader: string
  clients: string
  ruleNote: string
}

export interface DocsClientGuideItem {
  id: string
  name: string
  tag: string
  protocol: string
  exampleModel: string
  baseUrlSuffix: string
  baseUrlNote: string
  envTitle: string
  buildEnvCode: (gatewayOrigin: string) => string
  configTitle: string
  buildConfigCode: (gatewayOrigin: string) => string
}

export type DocsCodeLang = 'curl' | 'python' | 'typescript'

export interface ProtocolParamItem {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description: string
}

export interface DocsProtocolSpec {
  id: 'messages' | 'responses' | 'chat'
  label: string
  badge: string
  method: 'POST'
  endpointPath: string
  authHeader: string
  buildSampleCode: (lang: DocsCodeLang, gatewayOrigin: string) => string
  sampleResponse: string
  parameters: ProtocolParamItem[]
}

export interface DocsStatusCodeItem {
  code: string
  title: string
  severity: 'warning' | 'destructive'
  description: string
}

export interface DocsFaqItem {
  id: string
  question: string
  answer: string
}
