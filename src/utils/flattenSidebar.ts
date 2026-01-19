interface SidebarItem {
  title?: string
  path?: string
  items?: SidebarItem[]
  position?: number
}

export interface FlattenedDoc {
  path: string
  title: string
}

/**
 * 扁平化侧边栏配置，将嵌套结构转换为有序列表
 */
export function flattenSidebar(sidebar: SidebarItem[]): FlattenedDoc[] {
  const result: FlattenedDoc[] = []

  function traverse(items: SidebarItem[]) {
    // 按 position 排序
    const sorted = [...items].sort(
      (a, b) => (a.position || 0) - (b.position || 0)
    )

    for (const item of sorted) {
      if (item.path && item.title) {
        result.push({ path: item.path, title: item.title })
      }
      if (item.items) {
        traverse(item.items)
      }
    }
  }

  traverse(sidebar)
  return result
}

interface BlogItem {
  title: string
  path: string
  date: string
}

/**
 * 扁平化博客配置
 */
export function flattenBlog(blog: BlogItem[]): FlattenedDoc[] {
  return blog.map(item => ({
    path: item.path,
    title: item.title
  }))
}
