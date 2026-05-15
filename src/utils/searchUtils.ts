import MiniSearch from 'minisearch'
import searchIndexData from '@/config/search-index.json'

interface SearchDocument {
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

type SearchHit = SearchDocument & { score: number }

export interface SearchResult {
  title: string
  path: string
  type: 'doc' | 'blog'
  excerpt: string
  date?: string
  sectionTitle?: string
  breadcrumb: string[]
}

const searchDocuments = searchIndexData as SearchDocument[]

const miniSearch = new MiniSearch<SearchDocument>({
  fields: ['title', 'sectionTitle', 'titles', 'text', 'excerpt', 'tags'],
  storeFields: [
    'title',
    'sectionTitle',
    'titles',
    'path',
    'type',
    'excerpt',
    'date',
    'text',
    'tags'
  ],
  searchOptions: {
    boost: {
      title: 8,
      sectionTitle: 5,
      titles: 4,
      tags: 3,
      excerpt: 2,
      text: 1
    },
    prefix: term => term.length >= 2,
    fuzzy: term => (term.length >= 4 ? 0.2 : false)
  }
})

miniSearch.addAll(searchDocuments)

function normalizeQuery(query: string) {
  return query.trim().replace(/\s+/g, ' ')
}

function extractSnippet(text: string, query: string, maxLength = 100) {
  if (!text) return ''

  const normalizedText = text.replace(/\s+/g, ' ').trim()
  const normalizedQuery = normalizeQuery(query).toLowerCase()

  if (!normalizedQuery) {
    return normalizedText.slice(0, maxLength)
  }

  const index = normalizedText.toLowerCase().indexOf(normalizedQuery)
  if (index === -1) {
    return normalizedText.slice(0, maxLength)
  }

  const start = Math.max(0, index - 24)
  const end = Math.min(
    normalizedText.length,
    index + normalizedQuery.length + 48
  )
  const prefix = start > 0 ? '...' : ''
  const suffix = end < normalizedText.length ? '...' : ''

  return `${prefix}${normalizedText.slice(start, end).trim()}${suffix}`
}

export function searchContent(query: string, limit = 10): SearchResult[] {
  const normalizedQuery = normalizeQuery(query)
  if (!normalizedQuery) return []

  const terms = normalizedQuery.split(' ').filter(Boolean)
  const joinedTerms = terms.join(' ')
  const searchQueries = Array.from(new Set([joinedTerms, ...terms]))

  const merged = new Map<string, SearchHit>()

  for (const currentQuery of searchQueries) {
    const results = miniSearch.search(currentQuery, {
      combineWith: 'AND'
    })

    results.forEach(result => {
      const hit: SearchHit = {
        id: result.id,
        type: result.type,
        title: result.title,
        sectionTitle: result.sectionTitle,
        titles: result.titles,
        path: result.path,
        excerpt: result.excerpt,
        text: result.text,
        tags: result.tags,
        date: result.date,
        score: result.score
      }
      const existing = merged.get(hit.path)
      const next = {
        ...hit,
        score: (existing?.score || 0) + hit.score
      }
      if (!existing || next.score > existing.score) {
        merged.set(hit.path, next)
      }
    })
  }

  return Array.from(merged.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => ({
      title: item.title,
      path: item.path,
      type: item.type,
      excerpt: extractSnippet(item.text || item.excerpt, normalizedQuery),
      date: item.date,
      sectionTitle: item.sectionTitle,
      breadcrumb: item.sectionTitle
        ? [item.title, item.sectionTitle]
        : [item.title]
    }))
}

export function highlightSegments(text: string, query: string) {
  const normalizedQuery = normalizeQuery(query)
  if (!normalizedQuery) {
    return [{ text, match: false }]
  }

  const escaped = normalizedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'ig')
  const segments: Array<{ text: string; match: boolean }> = []
  let lastIndex = 0

  for (const match of text.matchAll(regex)) {
    const index = match.index ?? 0
    if (index > lastIndex) {
      segments.push({ text: text.slice(lastIndex, index), match: false })
    }
    segments.push({ text: match[0], match: true })
    lastIndex = index + match[0].length
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), match: false })
  }

  return segments.length ? segments : [{ text, match: false }]
}
