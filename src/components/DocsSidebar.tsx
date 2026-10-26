import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import '../assets/css/sidebar.css'

interface NavItem {
  title: string
  path: string
  position?: number
}

interface SubCategory {
  id: string
  label: string
  position: number
  collapsed?: boolean
  items: NavItem[]
}

interface NavSection {
  id?: string
  label?: string
  title?: string
  path?: string
  position: number
  collapsed?: boolean
  items?: (NavItem | SubCategory)[]
}

interface DocsSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

// 类型守卫函数 - 判断是否为分类（有 items 数组）
function isCategory(item: NavSection): boolean {
  return 'items' in item && Array.isArray(item.items)
}

// 类型守卫函数 - 判断是否为子分类
function isSubCategory(item: NavItem | SubCategory): item is SubCategory {
  return 'items' in item && Array.isArray(item.items)
}

const sidebarData = () => import('../config/sidebar.json')

export default function DocsSidebar({
  isOpen = true,
  onClose
}: DocsSidebarProps) {
  const location = useLocation()
  const sidebarRef = useRef<HTMLElement | null>(null)
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({})
  const [navigation, setNavigation] = useState<NavSection[]>([])

  // 加载侧边栏配置
  useEffect(() => {
    sidebarData()
      .then(data => {
        setNavigation(data.default || data)
      })
      .catch(() => {
        console.warn('无法加载侧边栏配置')
      })
  }, [])

  useEffect(() => {
    const activeSections: Record<string, boolean> = {}
    for (const section of navigation) {
      for (const item of section.items ?? []) {
        if (isSubCategory(item)) {
          if (item.items.some(page => page.path === location.pathname)) {
            activeSections[section.id!] = false
            activeSections[`${section.id}-${item.id}`] = false
          }
        } else if (item.path === location.pathname) {
          activeSections[section.id!] = false
        }
      }
    }
    setCollapsedSections(previous => ({ ...previous, ...activeSections }))
  }, [location.pathname, navigation])

  const toggleSection = (section: string, isCollapsed: boolean) => {
    setCollapsedSections(prev => ({
      ...prev,
      // 首次点击时沿用配置中的初始状态，而不是对 undefined 取反。
      [section]: !(prev[section] ?? isCollapsed)
    }))
  }

  useEffect(() => {
    const activeItem = sidebarRef.current?.querySelector(
      '[data-active="true"]'
    ) as HTMLElement | null

    activeItem?.scrollIntoView({
      block: 'center',
      inline: 'nearest',
      behavior: 'smooth'
    })
  }, [location.pathname, navigation, isOpen, collapsedSections])

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 dark:bg-black/70 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
        fixed top-16 left-0 z-40 w-64
        h-[calc(100vh-4rem)]
        border-r border-[var(--line)] bg-[var(--canvas)] text-[var(--text)]
        overflow-y-auto shadow-xl lg:shadow-none
        transition-all duration-300 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end border-b border-[var(--line)]">
          <button
            onClick={onClose}
            aria-label="关闭文档导航"
            className="p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav aria-label="文档导航" className="docs-navigation">
          {navigation.map((item, index) => {
            // 如果是分类（有 items）
            if (isCategory(item)) {
              const isCollapsed =
                collapsedSections[item.id!] ?? item.collapsed ?? true

              return (
                <div key={item.id || index} className="docs-navigation-section">
                  <button
                    onClick={() => toggleSection(item.id!, isCollapsed)}
                    aria-expanded={!isCollapsed}
                    className="docs-navigation-heading"
                  >
                    {item.label}
                    <svg
                      className={`w-4 h-4 transition-transform ${isCollapsed ? '' : 'rotate-90'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {!isCollapsed && (
                    <div className="docs-navigation-children">
                      {item.items!.map((subItem, subIndex) => {
                        // 检查是否为子分类
                        if (isSubCategory(subItem)) {
                          const subCategoryId = `${item.id}-${subItem.id}`
                          const isSubCollapsed = (collapsedSections[
                            subCategoryId
                          ] ??
                            subItem.collapsed ??
                            true) as boolean

                          return (
                            <div
                              key={subItem.id}
                              className="docs-navigation-category"
                            >
                              <button
                                onClick={() =>
                                  toggleSection(subCategoryId, isSubCollapsed)
                                }
                                aria-expanded={!isSubCollapsed}
                                className="docs-navigation-subheading"
                              >
                                {subItem.label}
                                <svg
                                  className={`w-3 h-3 transition-transform ${isSubCollapsed ? '' : 'rotate-90'}`}
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M9 5l7 7-7 7"
                                  />
                                </svg>
                              </button>
                              {!isSubCollapsed && (
                                <ul className="docs-navigation-pages">
                                  {subItem.items.map(docItem => (
                                    <li key={docItem.path}>
                                      <Link
                                        to={docItem.path}
                                        aria-current={
                                          location.pathname === docItem.path
                                            ? 'page'
                                            : undefined
                                        }
                                        onClick={onClose}
                                        data-active={
                                          location.pathname === docItem.path
                                        }
                                        className="docs-navigation-link"
                                      >
                                        {docItem.title}
                                      </Link>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )
                        } else {
                          // 普通链接
                          return (
                            <ul key={subIndex} className="space-y-1">
                              <li>
                                <Link
                                  to={subItem.path}
                                  aria-current={
                                    location.pathname === subItem.path
                                      ? 'page'
                                      : undefined
                                  }
                                  onClick={onClose}
                                  data-active={
                                    location.pathname === subItem.path
                                  }
                                  className="docs-navigation-link"
                                >
                                  {subItem.title}
                                </Link>
                              </li>
                            </ul>
                          )
                        }
                      })}
                    </div>
                  )}
                </div>
              )
            } else {
              // 一级文档链接
              return (
                <Link
                  key={item.path || index}
                  to={item.path!}
                  aria-current={
                    location.pathname === item.path ? 'page' : undefined
                  }
                  onClick={onClose}
                  data-active={location.pathname === item.path}
                  className="docs-navigation-link"
                >
                  {item.title}
                </Link>
              )
            }
          })}
        </nav>
      </aside>
    </>
  )
}
