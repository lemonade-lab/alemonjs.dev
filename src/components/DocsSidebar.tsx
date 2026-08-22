import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'

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

        <nav className="p-4 lg:p-6 space-y-2">
          {navigation.map((item, index) => {
            // 如果是分类（有 items）
            if (isCategory(item)) {
              const isCollapsed =
                collapsedSections[item.id!] ?? item.collapsed ?? true

              return (
                <div key={item.id || index}>
                  <button
                    onClick={() => toggleSection(item.id!, isCollapsed)}
                    className="flex items-center justify-between w-full px-3 text-sm font-bold text-[var(--text)] uppercase tracking-wider mb-3 hover:bg-[var(--surface-muted)] transition-all duration-200 group"
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
                    <div className="space-y-4 mb-4">
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
                            <div key={subItem.id}>
                              <button
                                onClick={() =>
                                  toggleSection(subCategoryId, isSubCollapsed)
                                }
                                className="flex items-center justify-between w-full pl-6 pr-3 text-xs font-semibold text-[var(--text-muted)] mb-2 hover:text-[var(--text)] transition-colors"
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
                                <ul className="space-y-1 pl-2">
                                  {subItem.items.map(docItem => (
                                    <li key={docItem.path}>
                                      <Link
                                        to={docItem.path}
                                        onClick={onClose}
                                        data-active={
                                          location.pathname === docItem.path
                                        }
                                        className={`block pl-6 pr-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                          location.pathname === docItem.path
                                            ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold'
                                            : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]'
                                        }`}
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
                                  onClick={onClose}
                                  data-active={
                                    location.pathname === subItem.path
                                  }
                                  className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                    location.pathname === subItem.path
                                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold'
                                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]'
                                  }`}
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
                  onClick={onClose}
                  data-active={location.pathname === item.path}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-[var(--accent)] text-[var(--accent-contrast)] font-semibold'
                      : 'text-[var(--text-muted)] hover:bg-[var(--surface-muted)] hover:text-[var(--text)]'
                  }`}
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
