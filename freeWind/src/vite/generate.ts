import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

interface Author {
  name: string
  title?: string
  url?: string
  image_url?: string
  email?: string
  socials?: {
    [key: string]: string
  }
}

interface AuthorsData {
  [key: string]: Author
}

interface DocMetadata {
  title?: string
  description?: string
  sidebar_position?: number
  sidebar_label?: string | undefined
  slug?: string
  tags?: string[]
  product?: string
  authors?: string | string[]
  date?: string
  hide_title?: boolean
  hide_table_of_contents?: boolean
  redirect_to?: string
  version?: string
  locale?: string
  updatedAt?: string
  [key: string]: unknown
}

interface DocRoute {
  path: string
  filePath: string
  metadata: DocMetadata
  content: string
}

interface RouteManifestEntry {
  id: string
  type: 'doc' | 'blog'
  path: string
  filePath: string
  title?: string
  description?: string
  date?: string
  version?: string
  locale?: string
  updatedAt?: string
  redirectTo?: string
  metadata: DocMetadata
}

const SITE_URL = 'https://alemonjs.dev'

interface HeadingNode {
  id: string
  title: string
  level: number
  content: string
}

interface SearchIndexEntry {
  id: string
  type: 'doc' | 'blog'
  title: string
  sectionTitle?: string
  titles: string[]
  path: string
  excerpt: string
  text: string
  tags: string[]
  date?: string
}

function slugify(text = '') {
  return text
    .toLowerCase()
    .trim()
    .replace(/<[^>]+>/g, '')
    .replace(/`+/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function stripMarkdown(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/~~~[\s\S]*?~~~/g, ' ')
    .replace(/:::[a-zA-Z0-9_-]*/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^>\s?/gm, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\|/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\{[^}]+\}/g, ' ')
    .replace(/[*_~]/g, '')
    .replace(/\r/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toExcerpt(text: string, maxLength = 120) {
  const normalized = stripMarkdown(text)
  if (normalized.length <= maxLength) return normalized
  return `${normalized.slice(0, maxLength).trim()}...`
}

function extractHeadings(content: string): HeadingNode[] {
  const sanitized = content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
  const lines = sanitized.split('\n')
  const sections: Array<{
    level: number
    title: string
    id: string
    lines: string[]
  }> = []
  let current: (typeof sections)[number] | null = null

  for (const line of lines) {
    const headingMatch = line.match(/^(#{1,4})\s+(.+?)\s*$/)
    if (headingMatch) {
      current = {
        level: headingMatch[1].length,
        title: stripMarkdown(headingMatch[2]),
        id: slugify(headingMatch[2]),
        lines: []
      }
      sections.push(current)
      continue
    }

    current?.lines.push(line)
  }

  return sections
    .map(section => ({
      id: section.id,
      title: section.title,
      level: section.level,
      content: stripMarkdown(section.lines.join('\n'))
    }))
    .filter(section => section.title)
}

interface CategoryConfig {
  label?: string
  position?: number
  link?: {
    type: string
    id?: string
  }
  collapsed?: boolean
}

/**
 * 读取目录配置
 */
function readCategoryConfig(dirPath: string): CategoryConfig | null {
  const configPath = path.join(dirPath, '_category_.json')
  if (fs.existsSync(configPath)) {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'))
  }
  return null
}

/**
 * 扫描目录获取所有文档
 */
function scanDocs(docsDir: string, baseDir: string = docsDir): DocRoute[] {
  const routes: DocRoute[] = []

  if (!fs.existsSync(docsDir)) {
    return routes
  }

  const items = fs.readdirSync(docsDir)

  for (const item of items) {
    const fullPath = path.join(docsDir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      routes.push(...scanDocs(fullPath, baseDir))
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      const fileContent = fs.readFileSync(fullPath, 'utf-8')
      const { data, content } = matter(fileContent)

      const relativePath = path.relative(baseDir, fullPath)
      const urlPath = relativePath
        .replace(/\\/g, '/')
        .replace(/\.(md|mdx)$/, '')
        .replace(/\/index$/, '')

      routes.push({
        path: urlPath,
        filePath: relativePath.replace(/\\/g, '/'),
        metadata: data as DocMetadata,
        content
      })
    }
  }

  return routes
}

/**
 * 扫描博客
 */
function scanBlog(blogDir: string, baseDir: string = blogDir): DocRoute[] {
  const routes: DocRoute[] = []

  if (!fs.existsSync(blogDir)) {
    return routes
  }

  const items = fs.readdirSync(blogDir)

  for (const item of items) {
    if (item === 'authors.yml') continue

    const fullPath = path.join(blogDir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      routes.push(...scanBlog(fullPath, baseDir))
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      const fileContent = fs.readFileSync(fullPath, 'utf-8')
      const { data, content } = matter(fileContent)

      const relativePath = path.relative(baseDir, fullPath)
      const urlPath = relativePath
        .replace(/\\/g, '/')
        .replace(/\.(md|mdx)$/, '')

      // 尝试从路径中提取日期 (格式: releases/YYYY/MM/DD/...)
      let date = data.date
      if (!date) {
        const dateMatch = relativePath.match(/(\d{4})\/(\d{2})\/(\d{2})/)
        if (dateMatch) {
          date = `${dateMatch[1]}-${dateMatch[2]}-${dateMatch[3]}`
        }
      }

      routes.push({
        path: urlPath,
        filePath: relativePath.replace(/\\/g, '/'),
        metadata: { ...data, date } as DocMetadata,
        content
      })
    }
  }

  // 按日期排序博客
  routes.sort((a, b) => {
    const dateA = a.metadata.date ? new Date(a.metadata.date).getTime() : 0
    const dateB = b.metadata.date ? new Date(b.metadata.date).getTime() : 0
    return dateB - dateA
  })

  return routes
}

function generateSearchIndex(
  docsRoutes: DocRoute[],
  blogRoutes: DocRoute[]
): SearchIndexEntry[] {
  const createEntries = (
    routes: DocRoute[],
    type: 'doc' | 'blog',
    basePath: string
  ) =>
    routes
      .filter(route => typeof route.metadata.redirect_to !== 'string')
      .flatMap((route, index) => {
        const headings = extractHeadings(route.content)
        const title = String(
          route.metadata.title ||
            route.metadata.sidebar_label ||
            route.metadata.label ||
            headings[0]?.title ||
            route.path
        )
        const tags = Array.isArray(route.metadata.tags)
          ? route.metadata.tags.map(tag => String(tag))
          : []
        if (type === 'blog') {
          const product = String(route.metadata.product || '')
          if (!tags.includes(product)) tags.push(product)
        }
        const pagePath = `${basePath}/${route.path}`
        const fullText = stripMarkdown(route.content)
        const entries: SearchIndexEntry[] = [
          {
            id: `${type}-page-${index}`,
            type,
            title,
            titles: [title],
            path: pagePath,
            excerpt: toExcerpt(
              route.metadata.description?.toString() || fullText
            ),
            text: fullText,
            tags,
            date: route.metadata.date?.toString()
          }
        ]

        headings.forEach((heading, headingIndex) => {
          entries.push({
            id: `${type}-section-${index}-${headingIndex}`,
            type,
            title,
            sectionTitle: heading.title,
            titles: [title, heading.title],
            path: `${pagePath}#${heading.id}`,
            excerpt: toExcerpt(heading.content || fullText),
            text: heading.content || fullText,
            tags,
            date: route.metadata.date?.toString()
          })
        })

        return entries
      })

  return [
    ...createEntries(docsRoutes, 'doc', '/docs'),
    ...createEntries(blogRoutes, 'blog', '/blog')
  ]
}

/**
 * 生成运行时路由所需的轻量 Manifest。
 * 组件本身不放入 JSON，而是在 router.tsx 中通过 import.meta.glob 索引。
 */
function generateRouteManifest(
  docsRoutes: DocRoute[],
  blogRoutes: DocRoute[]
): RouteManifestEntry[] {
  const createEntries = (
    routes: DocRoute[],
    type: 'doc' | 'blog',
    basePath: string
  ): RouteManifestEntry[] =>
    routes.map(route => ({
      id: `${type}:${route.filePath}`,
      type,
      path: `${basePath}/${route.path}`.replace(/\/+/g, '/'),
      filePath: route.filePath,
      title:
        route.metadata.title ||
        route.metadata.sidebar_label ||
        (typeof route.metadata.label === 'string'
          ? route.metadata.label
          : undefined),
      description: route.metadata.description || toExcerpt(route.content),
      date: route.metadata.date,
      version:
        typeof route.metadata.version === 'string'
          ? route.metadata.version
          : undefined,
      locale:
        typeof route.metadata.locale === 'string'
          ? route.metadata.locale
          : undefined,
      updatedAt:
        typeof route.metadata.updatedAt === 'string'
          ? route.metadata.updatedAt
          : undefined,
      redirectTo: route.metadata.redirect_to,
      metadata: route.metadata
    }))

  return [
    ...createEntries(docsRoutes, 'doc', '/docs'),
    ...createEntries(blogRoutes, 'blog', '/blog')
  ]
}

function validateRoutes(entries: RouteManifestEntry[]) {
  const seen = new Map<string, string>()
  const knownPaths = new Set(entries.map(entry => entry.path))
  knownPaths.add('/')
  knownPaths.add('/docs')
  knownPaths.add('/blog')
  const strict = process.env.CONTENT_STRICT === '1'
  const problems: string[] = []
  const ids = new Set<string>()

  for (const entry of entries) {
    if (ids.has(entry.id)) problems.push(`Manifest id 重复: ${entry.id}`)
    ids.add(entry.id)
    const previous = seen.get(entry.path)
    if (previous) {
      problems.push(
        `路由冲突: ${entry.path} (${previous} 与 ${entry.filePath})`
      )
      continue
    }

    seen.set(entry.path, entry.filePath)

    const sourceFile = path.join(
      process.cwd(),
      entry.type === 'doc' ? 'docs' : 'blog',
      entry.filePath
    )
    if (!fs.existsSync(sourceFile)) {
      problems.push(`Manifest 文件不存在或无法匹配 glob: ${entry.filePath}`)
    }

    if (!entry.metadata.title && !entry.metadata.label) {
      console.warn(`⚠️  缺少标题: ${entry.filePath}`)
    }

    if (
      entry.metadata.sidebar_position !== undefined &&
      typeof entry.metadata.sidebar_position !== 'number'
    ) {
      problems.push(`sidebar_position 必须是数字: ${entry.filePath}`)
    }

    if (entry.date && Number.isNaN(new Date(entry.date).getTime())) {
      problems.push(`date 不是有效日期: ${entry.filePath}`)
    }

    if (
      entry.metadata.authors !== undefined &&
      typeof entry.metadata.authors !== 'string' &&
      !Array.isArray(entry.metadata.authors)
    ) {
      problems.push(`authors 必须是字符串或数组: ${entry.filePath}`)
    }

    if (
      entry.metadata.version !== undefined &&
      typeof entry.metadata.version !== 'string'
    ) {
      problems.push(`version 必须是字符串: ${entry.filePath}`)
    }
    if (
      entry.metadata.locale !== undefined &&
      typeof entry.metadata.locale !== 'string'
    ) {
      problems.push(`locale 必须是字符串: ${entry.filePath}`)
    }
    if (
      entry.metadata.updatedAt !== undefined &&
      (typeof entry.metadata.updatedAt !== 'string' ||
        Number.isNaN(new Date(entry.metadata.updatedAt).getTime()))
    ) {
      problems.push(`updatedAt 必须是有效日期: ${entry.filePath}`)
    }

    if (entry.redirectTo && !entry.redirectTo.startsWith('/')) {
      problems.push(`redirect_to 必须使用站内绝对路径: ${entry.filePath}`)
    } else if (entry.redirectTo) {
      const target = entry.redirectTo.split('#')[0]
      if (!knownPaths.has(target)) {
        problems.push(`redirect_to 目标不存在: ${entry.filePath} -> ${target}`)
      }
    }
  }

  if (problems.length && strict) {
    throw new Error(`内容校验失败:\n- ${problems.join('\n- ')}`)
  }

  problems.forEach(problem => console.warn(`⚠️  ${problem}`))
}

function validateInternalLinks(
  routes: DocRoute[],
  entries: RouteManifestEntry[]
) {
  const knownPaths = new Set(entries.map(entry => entry.path))
  knownPaths.add('/')
  knownPaths.add('/docs')
  knownPaths.add('/blog')
  const strict = process.env.CONTENT_STRICT === '1'
  const problems: string[] = []
  const linkPattern = /\]\((\/[^)\s]+)(?:#[^)\s]+)?\)/g

  routes.forEach(route => {
    const headingIds = new Set<string>()
    for (const heading of extractHeadings(route.content)) {
      if (headingIds.has(heading.id)) {
        problems.push(`${route.filePath} 存在重复 heading ID: ${heading.id}`)
      }
      headingIds.add(heading.id)
    }

    for (const match of route.content.matchAll(linkPattern)) {
      const target = match[1].split(/[?#]/)[0]
      if (!knownPaths.has(target)) {
        problems.push(`${route.filePath} -> ${target}`)
      }
    }
  })

  if (problems.length) {
    const message = `发现 ${problems.length} 个内部链接不存在:\n- ${problems.join('\n- ')}`
    if (strict) throw new Error(message)
    console.warn(`⚠️  ${message}`)
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function generateSitemap(entries: RouteManifestEntry[]) {
  const urls = entries
    .filter(entry => !entry.redirectTo && entry.metadata.noindex !== true)
    .map(entry => {
      const lastmod = entry.date
        ? `\n    <lastmod>${escapeXml(entry.date)}</lastmod>`
        : ''
      return `  <url>\n    <loc>${escapeXml(`${SITE_URL}${entry.path}`)}</loc>${lastmod}\n  </url>`
    })

  urls.unshift(`  <url>\n    <loc>${SITE_URL}/</loc>\n  </url>`)

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`
}

function generateRss(entries: RouteManifestEntry[]) {
  const items = entries
    .filter(entry => entry.type === 'blog' && !entry.redirectTo)
    .slice(0, 20)
    .map(entry => {
      const title = entry.title || entry.path
      const description = entry.description || ''
      const pubDate = entry.date ? new Date(entry.date).toUTCString() : ''
      return `    <item>\n      <title>${escapeXml(title)}</title>\n      <link>${escapeXml(`${SITE_URL}${entry.path}`)}</link>\n      <guid isPermaLink="true">${escapeXml(`${SITE_URL}${entry.path}`)}</guid>\n      <description>${escapeXml(description)}</description>${pubDate ? `\n      <pubDate>${escapeXml(pubDate)}</pubDate>` : ''}\n    </item>`
    })

  return `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0">\n  <channel>\n    <title>ALemonX 更新</title>\n    <link>${SITE_URL}/blog</link>\n    <description>ALemonX 产品更新与开发日志</description>\n${items.join('\n')}\n  </channel>\n</rss>\n`
}

/**
 * 生成侧边栏配置 - 支持多层级分类
 */
function generateSidebarConfig(docsRoutes: DocRoute[], docsDir: string) {
  type SidebarDocument = {
    title: string
    path: string
    position: number
  }

  interface SubCategory {
    id: string
    label: string
    position: number
    collapsed?: boolean
    items: SidebarDocument[]
  }

  type SidebarCategory = {
    id: string
    label: string
    position: number
    collapsed?: boolean
    items?: Array<SidebarDocument | SubCategory>
    subCategories?: Record<string, SubCategory>
  }

  const rootItems: SidebarDocument[] = []

  const categories: Record<string, SidebarCategory> = {}

  // 分组文档
  docsRoutes.forEach(route => {
    if (typeof route.metadata.redirect_to === 'string') return

    const parts = route.path.split('/')

    if (parts.length === 1) {
      // 一级文档（docs/ 下的直接文件）
      rootItems.push({
        title: (route.metadata.sidebar_label ||
          route.metadata.label ||
          route.metadata.title ||
          parts[0]) as string,
        path: `/docs/${route.path}`,
        position: route.metadata.sidebar_position || 999
      })
    } else {
      // 二级及以上（目录下的文件）
      const mainCategory = parts[0]

      // 初始化主分类
      if (!categories[mainCategory]) {
        const categoryDir = path.join(docsDir, mainCategory)
        const categoryConfig = readCategoryConfig(categoryDir)

        categories[mainCategory] = {
          id: mainCategory,
          label: categoryConfig?.label || mainCategory,
          position: categoryConfig?.position ?? 999,
          collapsed: categoryConfig?.collapsed,
          subCategories: {} as Record<string, SubCategory>
        }
      }

      if (parts.length === 2) {
        // 主分类下的直接文件（二级）
        if (!categories[mainCategory].items) {
          categories[mainCategory].items = []
        }
        categories[mainCategory].items!.push({
          title: (route.metadata.sidebar_label ||
            route.metadata.label ||
            route.metadata.title ||
            parts[1]) as string,
          path: `/docs/${route.path}`,
          position: route.metadata.sidebar_position || 999
        })
      } else {
        // 子分类下的文件（三级）
        const subCategory = parts[1]
        const subCats = categories[mainCategory].subCategories!

        if (!subCats[subCategory]) {
          const subCategoryDir = path.join(docsDir, mainCategory, subCategory)
          const subCategoryConfig = readCategoryConfig(subCategoryDir)

          subCats[subCategory] = {
            id: subCategory,
            label: subCategoryConfig?.label || subCategory,
            position: subCategoryConfig?.position ?? 999,
            collapsed: subCategoryConfig?.collapsed,
            items: []
          }
        }

        subCats[subCategory].items.push({
          title: (route.metadata.sidebar_label ||
            route.metadata.label ||
            route.metadata.title ||
            parts[parts.length - 1]) as string,
          path: `/docs/${route.path}`,
          position: route.metadata.sidebar_position || 999
        })
      }
    }
  })

  // 按 position 排序一级文档
  rootItems.sort((a, b) => a.position - b.position)

  // 处理分类
  const result: Array<Omit<SidebarCategory, 'subCategories'>> = []

  // 处理主分类
  Object.values(categories).forEach(category => {
    // 转换子分类为数组
    if (
      category.subCategories &&
      Object.keys(category.subCategories).length > 0
    ) {
      const subCats = Object.values(category.subCategories) as SubCategory[]
      // 按 position 排序子分类
      subCats.sort((a, b) => a.position - b.position)
      // 排序每个子分类的文档
      subCats.forEach(subCat => {
        subCat.items.sort((a, b) => a.position - b.position)
      })
      category.items = subCats
    } else if (category.items) {
      // 排序主分类的文档
      category.items.sort((a, b) => a.position - b.position)
    }

    category.subCategories = undefined
    result.push(category)
  })

  // 合并一级文档和分类，一起排序
  const allItems = [...rootItems, ...result]
  allItems.sort((a, b) => a.position - b.position)

  return allItems
}

/** * 解析 YAML 格式的作者配置
 */
function parseAuthorsYaml(text: string): AuthorsData {
  const authors: AuthorsData = {}
  const lines = text.split('\n')
  let currentAuthor: string | null = null
  let currentSection: string | null = null

  for (const line of lines) {
    if (!line.trim() || line.trim().startsWith('#')) continue

    // 检测作者名（顶级键，不缩进）
    if (line.match(/^[a-zA-Z0-9_-]+:/)) {
      currentAuthor = line.split(':')[0].trim()
      authors[currentAuthor] = { name: currentAuthor }
      currentSection = null
      continue
    }

    if (!currentAuthor) continue

    const indent = line.search(/\S/)
    const trimmed = line.trim()

    if (indent === 2) {
      if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':')
        const value = valueParts.join(':').trim()

        if (key === 'socials') {
          currentSection = 'socials'
          authors[currentAuthor].socials = {}
        } else if (value) {
          const normalizedKey = key === 'namne' ? 'name' : key
          switch (normalizedKey) {
            case 'name':
              authors[currentAuthor].name = value
              break
            case 'title':
              authors[currentAuthor].title = value
              break
            case 'url':
              authors[currentAuthor].url = value
              break
            case 'image_url':
              authors[currentAuthor].image_url = value
              break
            case 'email':
              authors[currentAuthor].email = value
              break
          }
        }
      }
    } else if (indent === 4 && currentSection === 'socials') {
      if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':')
        const value = valueParts.join(':').trim()
        const author = authors[currentAuthor]
        if (value && author && author.socials) {
          author.socials[key] = value
        }
      }
    }
  }

  return authors
}

/**
 * 生成作者配置
 */
function generateAuthorsConfig(blogDir: string): AuthorsData {
  const authorsYmlPath = path.join(blogDir, 'authors.yml')

  if (!fs.existsSync(authorsYmlPath)) {
    console.warn('⚠️  未找到 blog/authors.yml 文件')
    return {}
  }

  const yamlContent = fs.readFileSync(authorsYmlPath, 'utf-8')
  return parseAuthorsYaml(yamlContent)
}

/**
 * 主函数
 */
function main() {
  const rootDir = path.resolve(process.cwd())
  const docsDir = path.join(rootDir, 'docs')
  const blogDir = path.join(rootDir, 'blog')
  const srcDir = path.join(rootDir, 'src')

  console.log('🔍 扫描文档和博客...')

  const docsRoutes = scanDocs(docsDir)
  const blogRoutes = scanBlog(blogDir)

  console.log(`📄 找到 ${docsRoutes.length} 个文档`)
  console.log(`📝 找到 ${blogRoutes.length} 个博客`)

  const routeManifest = generateRouteManifest(docsRoutes, blogRoutes)
  validateRoutes(routeManifest)
  validateInternalLinks([...docsRoutes, ...blogRoutes], routeManifest)
  fs.mkdirSync(path.join(srcDir, 'config'), { recursive: true })
  fs.writeFileSync(
    path.join(srcDir, 'config', 'route-manifest.json'),
    JSON.stringify(routeManifest, null, 2),
    'utf-8'
  )
  console.log('✅ 路由 Manifest 已生成: src/config/route-manifest.json')

  const publicDir = path.join(rootDir, 'public')
  fs.mkdirSync(publicDir, { recursive: true })
  fs.writeFileSync(
    path.join(publicDir, 'sitemap.xml'),
    generateSitemap(routeManifest),
    'utf-8'
  )
  fs.writeFileSync(
    path.join(publicDir, 'robots.txt'),
    `User-agent: *\nAllow: /\nSitemap: ${SITE_URL}/sitemap.xml\n`,
    'utf-8'
  )
  fs.writeFileSync(
    path.join(publicDir, 'rss.xml'),
    generateRss(routeManifest),
    'utf-8'
  )
  console.log('✅ sitemap.xml、robots.txt、rss.xml 已生成: public/')

  // 路由由 src/router.tsx 中的 Manifest + import.meta.glob 组合生成，
  // 这里不再改写应用源码，避免内容生成器与路由源码产生漂移。

  // 生成侧边栏配置
  const sidebarConfig = generateSidebarConfig(docsRoutes, docsDir)
  fs.writeFileSync(
    path.join(srcDir, 'config', 'sidebar.json'),
    JSON.stringify(sidebarConfig, null, 2),
    'utf-8'
  )
  console.log('✅ 侧边栏配置已生成: src/config/sidebar.json')

  // 生成博客元数据
  const blogMeta = blogRoutes.map(route => {
    const tags = Array.isArray(route.metadata.tags)
      ? route.metadata.tags.map(tag => String(tag))
      : []
    const product = String(route.metadata.product || '')
    if (!tags.includes(product)) tags.push(product)
    return {
      title: route.metadata.title,
      description: route.metadata.description,
      date: route.metadata.date,
      path: `/blog/${route.path}`,
      tags,
      authors: route.metadata.authors
    }
  })
  fs.mkdirSync(path.join(srcDir, 'config'), { recursive: true })
  fs.writeFileSync(
    path.join(srcDir, 'config', 'blog.json'),
    JSON.stringify(blogMeta, null, 2),
    'utf-8'
  )
  console.log('✅ 博客元数据已生成: src/config/blog.json')

  const searchIndex = generateSearchIndex(docsRoutes, blogRoutes)
  fs.writeFileSync(
    path.join(srcDir, 'config', 'search-index.json'),
    JSON.stringify(searchIndex, null, 2),
    'utf-8'
  )
  console.log('✅ 搜索索引已生成: src/config/search-index.json')

  // 生成作者配置
  const authorsConfig = generateAuthorsConfig(blogDir)
  fs.writeFileSync(
    path.join(srcDir, 'config', 'authors.json'),
    JSON.stringify(authorsConfig, null, 2),
    'utf-8'
  )
  console.log('✅ 作者配置已生成: src/config/authors.json')

  console.log('🎉 完成！')
}

main()
