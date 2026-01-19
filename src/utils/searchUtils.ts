import sidebarData from '@/config/sidebar.json'
import blogData from '@/config/blog.json'

export interface SearchResult {
  title: string
  path: string
  type: 'doc' | 'blog'
  excerpt?: string
  date?: string
}

interface SidebarItem {
  title?: string
  path?: string
  items?: SidebarItem[]
}

/**
 * 扁平化文档结构，提取所有可搜索的文档
 */
function flattenDocs(items: SidebarItem[]): SearchResult[] {
  const results: SearchResult[] = []

  function traverse(items: SidebarItem[]) {
    for (const item of items) {
      if (item.path && item.title) {
        results.push({
          title: item.title,
          path: item.path,
          type: 'doc'
        })
      }
      if (item.items) {
        traverse(item.items)
      }
    }
  }

  traverse(items)
  return results
}

/**
 * 获取所有可搜索的内容
 */
export function getAllSearchableContent(): SearchResult[] {
  const docs = flattenDocs(sidebarData as SidebarItem[])

  interface BlogItem {
    title: string
    path: string
    description?: string
    date?: string
  }

  const blogs = (blogData as BlogItem[]).map(blog => ({
    title: blog.title,
    path: blog.path,
    type: 'blog' as const,
    excerpt: blog.description,
    date: blog.date
  }))

  return [...docs, ...blogs]
}

/**
 * 搜索内容
 * @param query 搜索关键词
 * @param limit 返回结果数量限制
 */
export function searchContent(query: string, limit = 10): SearchResult[] {
  if (!query.trim()) {
    return []
  }

  const allContent = getAllSearchableContent()
  const lowerQuery = query.toLowerCase().trim()

  // 计算匹配分数
  const scoredResults = allContent.map(item => {
    let score = 0
    const lowerTitle = item.title.toLowerCase()
    const lowerExcerpt = (item.excerpt || '').toLowerCase()

    // 完全匹配标题 - 最高分
    if (lowerTitle === lowerQuery) {
      score += 100
    }
    // 标题开头匹配
    else if (lowerTitle.startsWith(lowerQuery)) {
      score += 50
    }
    // 标题包含
    else if (lowerTitle.includes(lowerQuery)) {
      score += 30
    }

    // 描述包含
    if (lowerExcerpt.includes(lowerQuery)) {
      score += 10
    }

    // 拼音首字母匹配（简单实现）
    const queryChars = lowerQuery.split('')
    const titleChars = lowerTitle.split('')
    let matchCount = 0
    queryChars.forEach(char => {
      if (titleChars.includes(char)) {
        matchCount++
      }
    })
    if (matchCount > 0) {
      score += matchCount * 2
    }

    return { ...item, score }
  })

  // 过滤出有分数的结果并排序
  return scoredResults
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}

/**
 * 高亮搜索关键词
 */
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text

  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(
    regex,
    '<mark class="bg-yellow-200 dark:bg-yellow-600">$1</mark>'
  )
}
