import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '@/contexts/ThemeContext'
import SearchModal from './SearchModal'
import config from '@free-wind/config'

export default function Navbar() {
  const { navbar } = config.themeConfig
  const { theme, toggleTheme } = useTheme()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const navigationItemClass =
    'text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] hover:bg-[var(--surface-muted)] px-3 py-2 rounded-md'
  const mobileNavigationItemClass =
    'block px-3 py-2 rounded-md text-base font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]'

  // 键盘快捷键 Cmd/Ctrl + K 打开搜索
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsSearchOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-[var(--line)] bg-[var(--surface)] backdrop-blur-xl shadow-lg shadow-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            >
              {navbar.title === 'ALemonX' ? (
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 place-items-center rounded-lg bg-black text-sm font-semibold text-white dark:bg-white dark:text-black"
                >
                  X
                </span>
              ) : navbar.logo.src.match(/\.(svg|png|jpg|jpeg|gif)$/i) ? (
                <img
                  src={`/${navbar.logo.src}`}
                  alt={navbar.logo.alt}
                  className="h-8 w-8 object-contain"
                />
              ) : (
                <svg
                  className="h-8 w-8 text-blue-600 dark:text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              )}
              {navbar.title && (
                <span className="text-lg font-bold text-[var(--text)]">
                  {navbar.title}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {navbar.items.map((item, index) => {
              if ('href' in item && item.href) {
                return (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={navigationItemClass}
                  >
                    {item.label}
                  </a>
                )
              } else if ('to' in item && item.to) {
                return (
                  <Link
                    key={index}
                    to={item.to.startsWith('/') ? item.to : `/${item.to}`}
                    className={navigationItemClass}
                  >
                    {item.label}
                  </Link>
                )
              } else if ('type' in item && item.type === 'docSidebar') {
                return (
                  <Link
                    key={index}
                    to="/docs/alemonx/getting-started/quick-start"
                    className={navigationItemClass}
                  >
                    {item.label}
                  </Link>
                )
              }
              return null
            })}

            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--text)] hover:bg-[var(--surface-muted)] px-3 py-2 rounded-md border border-[var(--line)]"
              title="搜索 (⌘K)"
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="hidden lg:inline">搜索</span>
              <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-xs font-mono bg-[var(--surface-muted)] border border-[var(--line)] rounded">
                ⌘K
              </kbd>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="text-[var(--text-muted)] transition-colors hover:text-[var(--text)] hover:bg-[var(--surface-muted)] p-2 rounded-md"
              title={theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'}
            >
              {theme === 'light' ? (
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--accent)]"
            aria-expanded="false"
          >
            <span className="sr-only">打开主菜单</span>
            {isMobileMenuOpen ? (
              <svg
                className="block h-6 w-6"
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
            ) : (
              <svg
                className="block h-6 w-6"
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
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--line)] bg-[var(--surface)]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navbar.items.map((item, index) => {
              if ('href' in item && item.href) {
                return (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={mobileNavigationItemClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </a>
                )
              } else if ('to' in item && item.to) {
                return (
                  <Link
                    key={index}
                    to={item.to.startsWith('/') ? item.to : `/${item.to}`}
                    className={mobileNavigationItemClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              } else if ('type' in item && item.type === 'docSidebar') {
                return (
                  <Link
                    key={index}
                    to="/docs/alemonx/getting-started/quick-start"
                    className={mobileNavigationItemClass}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              }
              return null
            })}

            {/* Search button in mobile menu */}
            <button
              onClick={() => {
                setIsSearchOpen(true)
                setIsMobileMenuOpen(false)
              }}
              className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              搜索
            </button>

            {/* Theme toggle in mobile menu */}
            <button
              onClick={() => {
                toggleTheme()
                setIsMobileMenuOpen(false)
              }}
              className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]"
            >
              {theme === 'light' ? (
                <>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                    />
                  </svg>
                  暗色模式
                </>
              ) : (
                <>
                  <svg
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  亮色模式
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </nav>
  )
}
