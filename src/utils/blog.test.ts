import { describe, expect, it } from 'vitest'
import { getProjectPosts } from './blog'
import manifest from '@/config/route-manifest.json'
import searchIndex from '@/config/search-index.json'

describe('V2.0.0 release consolidation', () => {
  it('lists the formal release once and excludes prerelease articles from navigation and search', () => {
    const posts = getProjectPosts('framework')
    expect(posts.filter(post => post.title === 'V2.0.0 正式发布')).toHaveLength(
      1
    )
    expect(posts.some(post => post.title.includes('2.0.0-rc.'))).toBe(false)
    expect(searchIndex.some(entry => entry.path.includes('2.0.0-rc.'))).toBe(
      false
    )
  })

  it('preserves all ten prerelease URLs as redirects to the formal release', () => {
    const oldEntries = manifest.filter(
      entry => entry.type === 'blog' && entry.path.includes('2.0.0-rc.')
    )
    expect(oldEntries).toHaveLength(10)
    for (const entry of oldEntries) {
      expect(entry.redirectTo).toBe('/blog/2025/03/14/v2.0.0')
    }
  })
})
