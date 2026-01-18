import { Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface BlogPost {
  title: string
  description: string
  date: string
  path: string
  tags: string[]
  authors: string
}

interface BlogSidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

interface GroupedBlogs {
  [year: string]: BlogPost[]
}

const blogJSON = () => import('../config/blog.json')

export default function BlogSidebar({
  isOpen = true,
  onClose
}: BlogSidebarProps) {
  const location = useLocation()
  const [collapsedYears, setCollapsedYears] = useState<Record<string, boolean>>(
    {}
  )
  const [groupedBlogs, setGroupedBlogs] = useState<GroupedBlogs>({})

  // 加载博客配置
  useEffect(() => {
    blogJSON()
      .then(data => {
        const blogData = data.default || data
        // 按年份分组
        const grouped = blogData.reduce((acc: GroupedBlogs, blog: BlogPost) => {
          const year = blog.date.substring(0, 4)
          if (!acc[year]) {
            acc[year] = []
          }
          acc[year].push(blog)
          return acc
        }, {})

        setGroupedBlogs(grouped)
      })
      .catch(() => {
        console.warn('无法加载博客配置')
      })
  }, [])

  const toggleYear = (year: string) => {
    setCollapsedYears(prev => ({
      ...prev,
      [year]: !prev[year]
    }))
  }

  // 按年份降序排序
  const sortedYears = Object.keys(groupedBlogs).sort(
    (a, b) => parseInt(b) - parseInt(a)
  )

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
        border-r border-gray-200/60 dark:border-gray-700/60 bg-gradient-to-b from-white via-gray-50/50 to-white dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900
        overflow-y-auto  shadow-xl lg:shadow-none
        transition-all duration-300 ease-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        {/* Mobile close button */}
        <div className="lg:hidden flex justify-end p-4 border-b dark:border-gray-700">
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
          <div className="mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider px-3">
              发布日志
            </h2>
          </div>

          {sortedYears.map(year => {
            const yearBlogs = groupedBlogs[year]
            const isCollapsed = collapsedYears[year]
            const isAnyActive = yearBlogs.some(
              blog => location.pathname === blog.path
            )

            return (
              <div key={year} className="mb-2">
                {/* 年份标题 */}
                <button
                  onClick={() => toggleYear(year)}
                  className={`
                    w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                    text-sm font-semibold transition-all duration-200
                    ${
                      isAnyActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/60'
                    }
                  `}
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {year}
                  </span>
                  <svg
                    className={`h-4 w-4 transition-transform duration-200 ${
                      isCollapsed ? '-rotate-90' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* 博客列表 */}
                {!isCollapsed && (
                  <div className="ml-3 mt-1 space-y-0.5 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
                    {yearBlogs.map(blog => {
                      const isActive = location.pathname === blog.path

                      return (
                        <Link
                          key={blog.path}
                          to={blog.path}
                          onClick={onClose}
                          className={`
                            block px-3 py-2 rounded-md text-sm transition-all duration-200
                            ${
                              isActive
                                ? 'text-blue-600 dark:text-blue-400 bg-blue-50/80 dark:bg-blue-900/20 font-medium shadow-sm border-l-2 border-blue-500 -ml-[2px] pl-[10px]'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-gray-800/40'
                            }
                          `}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className={isActive ? 'font-medium' : ''}>
                              {blog.title}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-500">
                              {new Date(blog.date).toLocaleDateString('zh-CN', {
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </nav>
      </aside>
    </>
  )
}
