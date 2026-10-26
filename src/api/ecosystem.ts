import { ECOSYSTEM_API_BASE_URL } from '@/config/ecosystem'
import type {
  EcosystemCollection,
  EcosystemResource,
  EcosystemResult
} from './ecosystem.d'

export const ecosystemCollections: Record<string, EcosystemCollection> = {
  '/docs/environment': {
    title: '连接平台',
    types: 'connector',
    description: '查找连接聊天平台和协议服务的适配器。'
  },
  '/docs/apps': {
    title: 'JS插件',
    types: 'js-plugin',
    description: '发现机器人功能、游戏、AI 和生态桥接插件。',
    guide: {
      href: '/docs/alemonjsDocs/modules/models',
      label: '模块化应用开发'
    }
  },
  '/docs/apps-module': {
    title: 'JS模块',
    types: 'js-module',
    description: '查找数据、通讯、生图和开发工具库。'
  },
  '/docs/apps-x': {
    title: 'X插件',
    types: 'x-plugin',
    description: '扩展 ALemonX 工作台的系统管理能力。',
    guide: {
      href: '/docs/alemonx/develop/system-plugins',
      label: '系统插件开发'
    }
  },
  '/docs/open': {
    title: '开源生态',
    types: 'skill,dev-tool',
    description: '探索 AI Skill 与开发部署工具。'
  }
}

function object(value: unknown): Record<string, unknown> {
  if (typeof value !== 'object' || value === null || Array.isArray(value))
    throw new Error('无效的资源响应')
  return value as Record<string, unknown>
}

function text(value: unknown): string {
  if (typeof value !== 'string') throw new Error('无效的资源字段')
  return value
}

function safeURL(value: unknown, optional = false): string {
  const raw = text(value)
  if (optional && raw === '') return ''
  const url = new URL(raw)
  if (url.protocol !== 'https:' && url.protocol !== 'http:')
    throw new Error('无效的资源链接')
  return url.href
}

function resource(value: unknown): EcosystemResource {
  const data = object(value)
  return {
    id: text(data.id),
    type: text(data.type),
    name: text(data.name),
    description: text(data.description),
    sourceCategory: text(data.sourceCategory),
    repositoryUrl: safeURL(data.repositoryUrl),
    packageUrl: safeURL(data.packageUrl, true),
    legacyNotice: text(data.legacyNotice)
  }
}

export async function fetchEcosystem(
  types: string,
  q: string,
  page: number,
  signal: AbortSignal
): Promise<EcosystemResult> {
  const params = new URLSearchParams({
    type: types,
    q,
    page: String(page),
    pageSize: '20'
  })
  const response = await fetch(
    `${ECOSYSTEM_API_BASE_URL}/v1/resources?${params}`,
    { signal, credentials: 'omit' }
  )
  if (!response.ok) throw new Error('资源接口暂时不可用')
  const result = object(await response.json())
  if (
    !Array.isArray(result.data) ||
    !Number.isInteger(result.total) ||
    Number(result.total) < 0 ||
    result.page !== page ||
    result.pageSize !== 20
  ) {
    throw new Error('无效的资源分页响应')
  }
  const data = result.data.map(resource)
  if (
    data.length > 20 ||
    data.some(item => !types.split(',').includes(item.type))
  )
    throw new Error('无效的资源分类响应')
  return { data, total: Number(result.total), page, pageSize: 20 }
}
