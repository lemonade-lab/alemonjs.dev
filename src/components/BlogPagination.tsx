import { Link, useLocation } from 'react-router-dom'
import blogData from '@/config/blog.json'
import { flattenBlog } from '@/utils/flattenSidebar'

export default function BlogPagination() {
  const location = useLocation()
  const blogs = flattenBlog(blogData)

  const currentIndex = blogs.findIndex(blog => blog.path === location.pathname)

  if (currentIndex === -1) {
    return null
  }

  const prevBlog = currentIndex > 0 ? blogs[currentIndex - 1] : null
  const nextBlog =
    currentIndex < blogs.length - 1 ? blogs[currentIndex + 1] : null

  if (!prevBlog && !nextBlog) {
    return null
  }

  return (
    <nav className="flex justify-between items-center gap-4 pt-8 mt-8 border-t border-gray-200 dark:border-gray-700">
      <div className="flex-1">
        {prevBlog ? (
          <Link
            to={prevBlog.path}
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
              上一篇
            </span>
            <span className="text-blue-600 dark:text-blue-400 group-hover:underline font-medium">
              {prevBlog.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>

      <div className="flex-1 text-right">
        {nextBlog ? (
          <Link
            to={nextBlog.path}
            className="group flex flex-col items-end hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-lg transition-colors"
          >
            <span className="text-sm text-gray-500 dark:text-gray-400 mb-1 flex items-center">
              下一篇
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
              {nextBlog.title}
            </span>
          </Link>
        ) : (
          <div />
        )}
      </div>
    </nav>
  )
}
