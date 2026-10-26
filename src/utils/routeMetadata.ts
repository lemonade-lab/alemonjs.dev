import routeManifest from '../config/route-manifest.json'

export interface RouteMetadata {
  title: string
  description: string
  canonical: string
  image: string
  robots: string
  type: 'WebSite' | 'TechArticle' | 'BlogPosting'
  entry?: (typeof routeManifest)[number]
}

const siteUrl = 'https://alemonjs.dev'
const siteTitle = 'ALemonX'
const siteDescription = '创建项目、运行命令、管理进程和 Agent 任务。'

export function getRouteMetadata(pathname: string): RouteMetadata {
  const entry = routeManifest.find(item => item.path === pathname)
  const title =
    entry?.title ||
    entry?.metadata?.title ||
    entry?.metadata?.label ||
    (pathname === '/blog' ? '博客' : siteTitle)
  const description =
    entry?.description ||
    entry?.metadata?.description ||
    (pathname === '/blog' ? '机器人框架更新与开发文章。' : siteDescription)
  const image = entry?.metadata?.image
    ? new URL(String(entry.metadata.image), siteUrl).href
    : `${siteUrl}/og.png`

  return {
    title: String(title),
    description: String(description),
    canonical: `${siteUrl}${pathname === '/' ? '/' : pathname}`,
    image,
    robots:
      (entry?.metadata as Record<string, unknown> | undefined)?.noindex === true
        ? 'noindex,nofollow'
        : 'index,follow',
    type:
      entry?.type === 'blog'
        ? 'BlogPosting'
        : entry?.type === 'doc'
          ? 'TechArticle'
          : 'WebSite',
    entry
  }
}

export { siteTitle, siteDescription, siteUrl }
