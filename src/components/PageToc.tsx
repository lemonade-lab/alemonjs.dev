import { useEffect, useRef, useState } from 'react'

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
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState('')
  const navRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const container = document.getElementById('doc-content')
    if (!container) return

    const build = () => {
      const nodes = container.querySelectorAll('h1,h2,h3,h4')
      const next: TocItem[] = []
      nodes.forEach(node => {
        const el = node as HTMLElement
        const text = el.innerText || el.textContent || ''
        let id = el.id
        if (!id) {
          id = slugify(text)
          el.id = id
        }
        const level = Number(el.tagName.replace('H', '')) || 1
        next.push({ id, text: text.trim(), level })
      })
      setItems(next)
    }

    build()

    const mo = new MutationObserver(build)
    mo.observe(container, { childList: true, subtree: true })
    return () => mo.disconnect()
  }, [])

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
      <div className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
        目录
      </div>
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
