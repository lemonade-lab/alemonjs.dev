import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

interface Heading {
  id: string
  text: string
  level: number
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default function PageToc({ onNavigate }: { onNavigate?: () => void }) {
  const { pathname, search } = useLocation()
  const [items, setItems] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState('')
  const nav = useRef<HTMLElement>(null)

  useEffect(() => {
    const container = document.getElementById('doc-content')
    if (!container) return

    const build = () => {
      const used = new Set<string>()
      const headings = [
        ...container.querySelectorAll<HTMLHeadingElement>('h2,h3,h4')
      ].map((heading, index) => {
        const text = (heading.textContent ?? '').trim()
        const base = heading.id || slugify(text) || `heading-${index + 1}`
        let id = base
        for (let suffix = 2; used.has(id); suffix += 1) id = `${base}-${suffix}`
        used.add(id)
        heading.id = id
        return { id, text, level: Number(heading.tagName.slice(1)) }
      })
      setItems(headings)
    }

    build()
    const observer = new MutationObserver(build)
    observer.observe(container, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    if (!items.length) return
    let frame = 0
    const update = () => {
      const offset =
        (document.querySelector('.site-compact-header')?.getBoundingClientRect()
          .height ?? 0) + 54
      const atEnd =
        window.scrollY > 0 &&
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 2
      let current = items[0].id
      for (const item of items) {
        if (
          (document.getElementById(item.id)?.getBoundingClientRect().top ??
            Infinity) <= offset ||
          atEnd
        )
          current = item.id
        else break
      }
      setActiveId(current)
    }
    const schedule = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [items])

  useLayoutEffect(() => {
    const root = nav.current
    const item = root?.querySelector('[aria-current="location"]')
    if (!root || !item || root.scrollHeight <= root.clientHeight) return
    const row = item.getBoundingClientRect()
    const box = root.getBoundingClientRect()
    if (row.top < box.top || row.bottom > box.bottom)
      root.scrollTop += row.top - box.top - box.height / 3
  }, [activeId])

  return (
    <nav className="site-toc" aria-label="本页目录" ref={nav}>
      {items.length > 0 && !onNavigate && (
        <p className="site-toc-title">本页目录</p>
      )}
      {items.length > 0 ? (
        <ul>
          {items.map(item => (
            <li key={item.id} data-level={item.level}>
              <Link
                to={{
                  pathname,
                  search,
                  hash: `#${encodeURIComponent(item.id)}`
                }}
                aria-current={item.id === activeId ? 'location' : undefined}
                onClick={onNavigate}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      ) : onNavigate ? (
        <p className="site-toc-empty">本页无分节标题</p>
      ) : null}
    </nav>
  )
}
