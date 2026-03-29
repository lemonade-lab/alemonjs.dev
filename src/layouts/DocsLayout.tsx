import { useState, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import DocsSidebar from '@/components/DocsSidebar'
import DocPagination from '@/components/DocPagination'
import Footer from '@/components/Footer'
import PageToc from '@/components/PageToc'

export default function DocsLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />
      {/* Fixed sidebar */}
      <DocsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      {/* Fixed right TOC */}
      <aside className="hidden xl:fixed xl:block xl:top-16 xl:bottom-0 xl:right-0 xl:w-64 xl:overflow-y-auto xl:z-10">
        <PageToc />
      </aside>
      {/* Main content with margins to account for fixed sidebars */}
      <main className="pt-16 lg:ml-64 xl:mr-64">
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
            <span className="text-sm font-medium">目录</span>
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <article
            id="doc-content"
            className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none"
          >
            <Outlet />
          </article>
          <DocPagination />
        </div>
      </main>
      <footer className="lg:ml-64 xl:mr-64">
        <Footer />
      </footer>
    </div>
  )
}

// Scroll to top on route change within docs
export function DocsLayoutWrapper() {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  return <DocsLayout />
}
