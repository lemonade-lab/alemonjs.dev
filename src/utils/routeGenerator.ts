import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface DocMeta {
  title?: string
  description?: string
  sidebar_position?: number
  slug?: string
  tags?: string[]
  authors?: string | string[]
  date?: string
  [key: string]: unknown
}

export interface DocInfo {
  path: string
  filePath: string
  meta: DocMeta
  content: string
}

/**
 * 扫描目录获取所有 markdown/mdx 文件
 */
export function scanDirectory(dir: string, baseDir: string = dir): DocInfo[] {
  const files: DocInfo[] = []

  if (!fs.existsSync(dir)) {
    return files
  }

  const items = fs.readdirSync(dir)

  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)

    if (stat.isDirectory()) {
      // 递归扫描子目录
      files.push(...scanDirectory(fullPath, baseDir))
    } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
      // 读取文件内容和元数据
      const fileContent = fs.readFileSync(fullPath, 'utf-8')
      const { data, content } = matter(fileContent)

      // 生成路径
      const relativePath = path.relative(baseDir, fullPath)
      const urlPath = relativePath
        .replace(/\\/g, '/')
        .replace(/\.(md|mdx)$/, '')
        .replace(/\/index$/, '')

      files.push({
        path: '/' + urlPath,
        filePath: fullPath,
        meta: data as DocMeta,
        content
      })
    }
  }

  return files
}

/**
 * 生成路由配置
 */
export function generateRoutes(docsDir: string, blogDir: string) {
  const docs = scanDirectory(docsDir)
  const blogs = scanDirectory(blogDir)

  // 按 sidebar_position 排序文档
  docs.sort((a, b) => {
    const posA = a.meta.sidebar_position ?? 999
    const posB = b.meta.sidebar_position ?? 999
    return posA - posB
  })

  // 按日期排序博客
  blogs.sort((a, b) => {
    const dateA = a.meta.date ? new Date(a.meta.date).getTime() : 0
    const dateB = b.meta.date ? new Date(b.meta.date).getTime() : 0
    return dateB - dateA
  })

  return { docs, blogs }
}
