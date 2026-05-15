import { useLayoutEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import BlogSidebar from '@/components/BlogSidebar'
import BlogMeta from '@/components/BlogMeta'
import BlogPagination from '@/components/BlogPagination'
import Footer from '@/components/Footer'

export default function BlogLayout() {
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  useLayoutEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0)
    }

    const rafId = window.requestAnimationFrame(() => {
      if (!location.hash) {
        window.scrollTo(0, 0)
        return
      }

      const target = document.getElementById(location.hash.slice(1))
      if (!target) return

      const top = target.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'auto' })
    })

    return () => window.cancelAnimationFrame(rafId)
  }, [location.pathname, location.hash])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />
      {/* Fixed sidebar */}
      <BlogSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* Main content with margin to account for fixed sidebar */}
      <main className="pt-16 lg:ml-64">
        {/* Mobile sidebar toggle button */}
        <div className="lg:hidden sticky top-16 z-20 bg-white dark:bg-gray-900 border-b dark:border-gray-700 px-4 py-3">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            <span className="text-sm font-medium">发布日志</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* 博客元信息 - 约定式注册 */}
          <BlogMeta />

          <article className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none">
            <Outlet />
          </article>
          <BlogPagination />
        </div>
      </main>
      <footer className="lg:ml-64">
        <Footer />
      </footer>
    </div>
  )
}
