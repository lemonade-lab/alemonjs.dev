import { Link, useLocation } from 'react-router-dom'
import sidebarData from '@/config/sidebar.json'
import { flattenSidebar } from '@/utils/flattenSidebar'

export default function DocPagination() {
  const location = useLocation()
  const docs = flattenSidebar(sidebarData)

  const currentIndex = docs.findIndex(doc => doc.path === location.pathname)

  if (currentIndex === -1) {
    return null
  }

  const prevDoc = currentIndex > 0 ? docs[currentIndex - 1] : null
  const nextDoc = currentIndex < docs.length - 1 ? docs[currentIndex + 1] : null

  if (!prevDoc && !nextDoc) {
    return null
  }

  return (
    <nav className="flex justify-between items-center gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        {prevDoc ? (
          <Link
            to={prevDoc.path}
            className="group flex flex-col hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg transition-colors"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              上一页
            </span>
            <span className="text-blue-600 dark:text-blue-400 group-hover:underline font-medium">
              {prevDoc.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div className="flex-1 text-right">
        {nextDoc ? (
          <Link
            to={nextDoc.path}
            className="group flex flex-col items-end hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg transition-colors"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
              下一页
              <svg
                className="w-4 h-4 ml-1"
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
            </span>
            <span className="text-blue-600 dark:text-blue-400 group-hover:underline font-medium">
              {nextDoc.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
