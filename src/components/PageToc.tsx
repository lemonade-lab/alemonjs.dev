import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface TocItem {
  id: string
  text: string
  level: number
}

function slugify(text = '') {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function PageToc() {
  const location = useLocation()
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const container = document.getElementById('doc-content')
    if (!container) return

    const build = () => {
      const nodes = container.querySelectorAll('h1,h2,h3,h4')
      const next: TocItem[] = []
      const usedIds = new Map<string, number>()

      nodes.forEach((node, index) => {
        const el = node as HTMLElement
        const text = el.innerText || el.textContent || ''
        const baseId = el.id || slugify(text) || `heading-${index + 1}`
        const occurrence = (usedIds.get(baseId) || 0) + 1
        usedIds.set(baseId, occurrence)
        const id = occurrence === 1 ? baseId : `${baseId}-${occurrence}`

        // Markdown can contain同名标题。确保每个标题都有唯一锚点，
        // 否则目录链接和滚动高亮会指向同一个元素。
        if (el.id !== id) el.id = id

        const level = Number(el.tagName.replace('H', '')) || 1
        next.push({ id, text: text.trim(), level })
      })
      setItems(next)
    }

    // 路由切换时先清空旧页面的目录，避免 Suspense 切换期间残留旧标题。
    setItems([])
    const frameId = window.requestAnimationFrame(build)

    const mo = new MutationObserver(build)
    mo.observe(container, { childList: true, subtree: true })
    return () => {
      window.cancelAnimationFrame(frameId)
      mo.disconnect()
    }
  }, [location.pathname])

  useEffect(() => {
    if (!items.length) return

    const updateActiveHeading = () => {
      const headings = items
        .map(item => document.getElementById(item.id))
        .filter(Boolean) as HTMLElement[]

      if (!headings.length) return

      const offsetTop = 120
      let current = headings[0]

      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= offsetTop) {
          current = heading
        } else {
          break
        }
      }

      setActiveId(current.id)
    }

    updateActiveHeading()
    window.addEventListener('scroll', updateActiveHeading, { passive: true })
    window.addEventListener('resize', updateActiveHeading)

    return () => {
      window.removeEventListener('scroll', updateActiveHeading)
      window.removeEventListener('resize', updateActiveHeading)
    }
  }, [items])

  useEffect(() => {
    const activeLink = navRef.current?.querySelector(
      '[data-active="true"]'
    ) as HTMLElement | null

    activeLink?.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: 'smooth'
    })
  }, [activeId])

  if (!items.length) return null

  return (
    <nav ref={navRef} className="toc hidden xl:block px-4 py-6">
      <ul className="space-y-1">
        {items.map(item => {
          const isActive = item.id === activeId

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={e => {
                  e.preventDefault()
                  const el = document.getElementById(item.id)
                  if (el)
                    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                data-active={isActive}
                aria-current={isActive ? 'location' : undefined}
                className={`toc-link block text-sm ${isActive ? 'toc-link-active' : ''}`}
                style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
              >
                {item.text}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
