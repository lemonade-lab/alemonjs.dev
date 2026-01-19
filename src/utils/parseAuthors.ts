import authorsData from '@/config/authors.json'

export interface Author {
  name: string
  title?: string
  url?: string
  image_url?: string
  email?: string
  socials?: {
    github?: string
    twitter?: string
    [key: string]: string | undefined
  }
}

export interface AuthorsData {
  [key: string]: Author
}

/**
 * 获取所有作者数据
 */
export function getAllAuthors(): AuthorsData {
  return authorsData as AuthorsData
}

/**
 * 根据作者 ID 或名称获取作者信息
 */
export function getAuthor(authorId: string): Author | null {
  const authors = authorsData as AuthorsData
  return authors[authorId] || null
}

/**
 * 获取多个作者信息
 */
export function getAuthors(authorIds: string | string[]): Author[] {
  const ids = Array.isArray(authorIds) ? authorIds : [authorIds]
  return ids.map(id => getAuthor(id)).filter((a): a is Author => a !== null)
}
