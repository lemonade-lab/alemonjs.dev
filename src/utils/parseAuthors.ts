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
 * 解析 authors.yml 数据
 */
export async function loadAuthors(): Promise<AuthorsData> {
  try {
    const response = await fetch('/blog/authors.yml')
    const text = await response.text()
    return parseYaml(text)
  } catch (error) {
    console.error('Failed to load authors:', error)
    return {}
  }
}

/**
 * 简单的 YAML 解析器（仅支持基本结构）
 */
function parseYaml(text: string): AuthorsData {
  const authors: AuthorsData = {}
  const lines = text.split('\n')
  let currentAuthor: string | null = null
  let currentSection: string | null = null

  for (const line of lines) {
    // 跳过空行和注释
    if (!line.trim() || line.trim().startsWith('#')) continue

    // 检测作者名（顶级键，不缩进）
    if (line.match(/^[a-zA-Z0-9_-]+:/)) {
      currentAuthor = line.split(':')[0].trim()
      authors[currentAuthor] = { name: currentAuthor }
      currentSection = null
      continue
    }

    if (!currentAuthor) continue

    // 解析缩进的属性
    const indent = line.search(/\S/)
    const trimmed = line.trim()

    if (indent === 2) {
      // 二级属性
      if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':')
        const value = valueParts.join(':').trim()

        if (key === 'socials') {
          currentSection = 'socials'
          authors[currentAuthor].socials = {}
        } else if (value) {
          // 特殊处理 namne -> name 的拼写错误
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
      // socials 下的属性
      if (trimmed.includes(':')) {
        const [key, ...valueParts] = trimmed.split(':')
        const value = valueParts.join(':').trim()
        if (value && authors[currentAuthor].socials) {
          authors[currentAuthor].socials[key] = value
        }
      }
    }
  }

  return authors
}

/**
 * 根据作者 ID 或名称获取作者信息
 */
export function getAuthor(
  authors: AuthorsData,
  authorId: string
): Author | null {
  return authors[authorId] || null
}

/**
 * 获取多个作者信息
 */
export function getAuthors(
  authorsData: AuthorsData,
  authorIds: string | string[]
): Author[] {
  const ids = Array.isArray(authorIds) ? authorIds : [authorIds]
  return ids
    .map(id => getAuthor(authorsData, id))
    .filter((a): a is Author => a !== null)
}
