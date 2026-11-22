import { Link, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import sidebar from '@/config/sidebar.json'
import SiteIcon from './SiteIcon'
import '../assets/css/sidebar.css'

interface NavPage {
  title: string
  path: string
}

interface NavGroup {
  id: string
  label: string
  collapsed?: boolean
  items: (NavPage | NavGroup)[]
}

const navigation: (NavPage | NavGroup)[] = sidebar

function containsPage(item: NavPage | NavGroup, path: string): boolean {
  return 'items' in item
    ? item.items.some(child => containsPage(child, path))
    : item.path === path
}

export default function DocsSidebar({
  onNavigate
}: {
  onNavigate?: () => void
}) {
  const { pathname } = useLocation()
  const path = pathname.replace(/\/$/, '')
  const navRef = useRef<HTMLElement>(null)
  const [overrides, setOverrides] = useState<
    Record<string, { path: string; open: boolean }>
  >({})

  useEffect(() => {
    const section = navRef.current?.parentElement
    const active = navRef.current?.querySelector('[aria-current="page"]')
    if (!section || !active || section.scrollHeight <= section.clientHeight)
      return
    const rect = active.getBoundingClientRect()
    const frame = section.getBoundingClientRect()
    if (rect.top < frame.top || rect.bottom > frame.bottom) {
      section.scrollTop += rect.top - frame.top - section.clientHeight / 3
    }
  }, [path])

  function renderItem(item: NavPage | NavGroup, depth = 0, parent = '') {
    if ('path' in item) {
      const active = path === item.path
      return (
        <li key={item.path}>
          <Link
            className="docs-navigation-link"
            to={item.path}
            onClick={onNavigate}
            data-active={active}
            aria-current={active ? 'page' : undefined}
          >
            {item.path === '/docs/intro' ? '文档总览' : item.title}
          </Link>
        </li>
      )
    }

    const key = `${parent}/${item.id}`
    const active = containsPage(item, path)
    const choice = overrides[key]
    const open =
      choice && (!active || choice.path === path)
        ? choice.open
        : active || !item.collapsed
    return (
      <li
        key={key}
        className={
          depth === 0 ? 'docs-navigation-section' : 'docs-navigation-category'
        }
      >
        <button
          type="button"
          className={
            depth === 0
              ? 'docs-navigation-heading'
              : 'docs-navigation-subheading'
          }
          aria-expanded={open}
          onClick={() =>
            setOverrides(previous => ({
              ...previous,
              [key]: { path, open: !open }
            }))
          }
        >
          <span>{item.label}</span>
          <SiteIcon name="chevron" />
        </button>
        {open && (
          <ul className="docs-navigation-children">
            {item.items.map(child => renderItem(child, depth + 1, key))}
          </ul>
        )}
      </li>
    )
  }

  return (
    <nav ref={navRef} aria-label="文档导航" className="docs-navigation">
      <ul>{navigation.map(item => renderItem(item))}</ul>
    </nav>
  )
}
