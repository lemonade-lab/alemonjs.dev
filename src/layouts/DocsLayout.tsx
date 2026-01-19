import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import DocsSidebar from '@/components/DocsSidebar'
import DocPagination from '@/components/DocPagination'
import Footer from '@/components/Footer'

export default function DocsLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <Navbar />
      <div className="flex flex-1 relative pt-16">
        <DocsSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 w-full lg:ml-0">
          {/* Mobile sidebar toggle button */}
          <div className="lg:hidden sticky top-0 z-20 bg-white dark:bg-gray-900 border-b dark:border-gray-700 px-4 py-3">
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
            <article className="prose prose-sm sm:prose-base lg:prose-lg prose-slate max-w-none">
              <Outlet />
            </article>
            <DocPagination />
          </div>
        </main>
      </div>
      <Footer />
    </div>
  )
}
