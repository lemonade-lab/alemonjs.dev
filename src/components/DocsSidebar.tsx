import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

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

export default function DocsSidebar({
  isOpen = true,
  onClose
}: DocsSidebarProps) {
  const location = useLocation()
  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({})
  const [navigation, setNavigation] = useState<NavSection[]>([])

  // 加载侧边栏配置
  useEffect(() => {
    import('../config/sidebar.json')
      .then(data => {
        setNavigation(data.default || data)
      })
      .catch(() => {
        console.warn('无法加载侧边栏配置')
      })
  }, [])

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

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
        className={`
        fixed lg:sticky top-16 left-0 z-40 w-64 
        h-[calc(100vh-4rem)] lg:h-auto
        border-r border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900
        overflow-y-auto shadow-xl lg:shadow-none
        transition-all duration-300 ease-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end border-b dark:border-gray-700">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
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
                collapsedSections[item.id!] ?? item.collapsed ?? false

              return (
                <div key={item.id || index}>
                  <button
                    onClick={() => toggleSection(item.id!)}
                    className="flex items-center justify-between w-full px-3 text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 group"
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
                          const isSubCollapsed =
                            collapsedSections[subCategoryId] ??
                            subItem.collapsed ??
                            false

                          return (
                            <div key={subItem.id}>
                              <button
                                onClick={() => toggleSection(subCategoryId)}
                                className="flex items-center justify-between w-full pl-6 pr-3 text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
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
                                        className={`block pl-6 pr-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                          location.pathname === docItem.path
                                            ? 'bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white shadow-md shadow-blue-500/30 dark:shadow-blue-900/50 font-semibold'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm'
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
                                  className={`block px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                                    location.pathname === subItem.path
                                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white shadow-md shadow-blue-500/30 dark:shadow-blue-900/50 font-semibold'
                                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm'
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
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-600 dark:to-indigo-700 text-white shadow-md shadow-blue-500/30 dark:shadow-blue-900/50 font-semibold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 dark:hover:from-blue-900/20 dark:hover:to-indigo-900/20 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-sm'
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
