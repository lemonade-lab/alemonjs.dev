import { useEffect, useState } from 'react'

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

  if (!items.length) return null

  return (
    <nav className="toc sticky top-24 hidden xl:block px-4">
      <div className="text-sm font-semibold mb-3 text-gray-700 dark:text-gray-300">
        目录
      </div>
      <ul className="space-y-1">
        {items.map(item => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={e => {
                e.preventDefault()
                const el = document.getElementById(item.id)
                if (el)
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="toc-link block text-sm"
              style={{ paddingLeft: `${(item.level - 1) * 12}px` }}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
