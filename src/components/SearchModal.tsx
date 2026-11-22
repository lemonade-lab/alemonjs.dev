import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import SiteIcon from './SiteIcon'
import {
  highlightSegments,
  searchContent,
  SearchResult
} from '@/utils/searchUtils'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // 搜索
  useEffect(() => {
    let cancelled = false

    if (!query.trim()) {
      setResults([])
      setSelectedIndex(0)
      return () => {
        cancelled = true
      }
    }

    searchContent(query, 10).then(searchResults => {
      if (cancelled) return
      setResults(searchResults)
      setSelectedIndex(0)
    })

    return () => {
      cancelled = true
    }
  }, [query])

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    dialog?.showModal()
    inputRef.current?.focus()
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      dialog?.close()
      document.body.style.overflow = overflow
    }
  }, [isOpen])

  useEffect(() => {
    resultsRef.current
      ?.querySelector('[data-selected="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  const handleSelect = (result: SearchResult) => {
    navigate(result.path)
    onClose()
    setQuery('')
  }

  const renderHighlighted = (text: string) =>
    highlightSegments(text, query).map((segment, index) =>
      segment.match ? (
        <mark
          key={`${segment.text}-${index}`}
          className="bg-[var(--accent-soft)] px-0.5 text-inherit"
        >
          {segment.text}
        </mark>
      ) : (
        <span key={`${segment.text}-${index}`}>{segment.text}</span>
      )
    )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || e.isComposing) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev =>
            Math.min(prev + 1, Math.max(0, results.length - 1))
          )
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          if (e.target !== inputRef.current) return
          e.preventDefault()
          if (results[selectedIndex]) {
            const selected = results[selectedIndex]
            navigate(selected.path)
            onClose()
            setQuery('')
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, onClose, navigate])

  if (!isOpen) return null

  return createPortal(
    <dialog
      ref={dialogRef}
      className="site-search"
      aria-label="搜索文档和博客"
      onKeyDown={event => {
        if (event.key === 'Escape' && !event.nativeEvent.isComposing) {
          event.preventDefault()
          onClose()
        }
      }}
      onCancel={event => {
        event.preventDefault()
        onClose()
      }}
      onClick={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="site-search-body">
        <div className="site-search-row">
          <SiteIcon name="search" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={event => setQuery(event.target.value)}
            aria-label="搜索关键词"
            placeholder="搜索文档和博客"
          />
          <button
            type="button"
            className="site-icon-button"
            onClick={onClose}
            aria-label="关闭搜索"
          >
            <SiteIcon name="close" />
          </button>
        </div>

        {/* 搜索结果 */}
        <div className="site-search-results" ref={resultsRef}>
          {query && results.length === 0 && (
            <div className="px-6 py-12 text-center text-[var(--text-muted)]">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-lg font-medium">未找到相关结果</p>
              <p className="text-sm mt-1">试试其他关键词</p>
            </div>
          )}

          {!query && (
            <div className="px-6 py-12 text-center text-[var(--text-muted)]">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <p className="text-lg font-medium">搜索文档和博客</p>
              <p className="text-sm mt-1">输入关键词开始搜索</p>
            </div>
          )}

          {results.map((result, index) => (
            <button
              key={result.path}
              onClick={() => handleSelect(result)}
              onMouseEnter={() => setSelectedIndex(index)}
              data-selected={index === selectedIndex}
              className={`w-full px-5 py-3 text-left transition-colors ${
                index === selectedIndex
                  ? 'bg-[var(--accent-soft)]'
                  : 'hover:bg-[var(--surface-hover)]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        result.type === 'doc'
                          ? 'bg-[var(--surface-input)] text-[var(--text)]'
                          : 'bg-[var(--surface-rail)] text-[var(--text)]'
                      }`}
                    >
                      {result.type === 'doc' ? '文档' : '博客'}
                    </span>
                    {result.date && (
                      <span className="text-xs text-[var(--text-muted)]">
                        {new Date(result.date).toLocaleDateString('zh-CN')}
                      </span>
                    )}
                  </div>
                  {result.sectionTitle && (
                    <p className="mb-1 text-xs text-[var(--text-muted)]">
                      {result.breadcrumb.join(' / ')}
                    </p>
                  )}
                  <h3 className="font-medium text-[var(--text)] mb-1">
                    {renderHighlighted(result.title)}
                  </h3>
                  {result.sectionTitle && (
                    <p className="mb-1 text-sm text-[var(--accent-text)]">
                      {renderHighlighted(result.sectionTitle)}
                    </p>
                  )}
                  {result.excerpt && (
                    <p className="text-sm text-[var(--text-muted)] line-clamp-2">
                      {renderHighlighted(result.excerpt)}
                    </p>
                  )}
                </div>
                {index === selectedIndex && (
                  <svg
                    className="h-5 w-5 text-[var(--accent-text)] ml-4 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* 快捷键提示 */}
        <div className="site-search-footer">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-[var(--surface-input)] rounded">
                  ↑↓
                </kbd>
                导航
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-[var(--surface-input)] rounded">
                  Enter
                </kbd>
                选择
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-2 py-1 bg-[var(--surface-input)] rounded">
                  Esc
                </kbd>
                关闭
              </span>
            </div>
          </div>
        </div>
      </div>
    </dialog>,
    document.body
  )
}
