import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode
} from 'react'
import { Link, useLocation } from 'react-router-dom'
import config from '@free-wind/config'
import { useTheme } from '@/contexts/ThemeContext'
import SearchModal from '@/components/SearchModal'
import SiteIcon, { type IconName } from '@/components/SiteIcon'

const siteIcons: Record<string, IconName> = {
  文档: 'docs',
  工作台: 'workbench',
  机器人: 'bot',
  问题排查: 'help',
  博客: 'blog',
  生态资源: 'eco',
  工作台下载: 'download',
  工作台源码: 'source'
}

const sections = [
  { label: '工作台', prefix: '/docs/alemonx' },
  { label: '机器人', prefix: '/docs/alemonjsDocs' },
  { label: '问题排查', prefix: '/docs/help' },
  { label: '博客', prefix: '/blog' },
  { label: '文档', prefix: '/docs' }
]

function SiteRail({ openSearch }: { openSearch: () => void }) {
  const { pathname } = useLocation()
  const { theme, toggleTheme } = useTheme()
  const activeSection = sections.find(
    ({ prefix }) => pathname === prefix || pathname.startsWith(prefix + '/')
  )?.label
  const { navbar } = config.themeConfig
  const themeLabel = theme === 'light' ? '切换到暗色模式' : '切换到亮色模式'

  return (
    <div className="site-rail">
      <Link
        to="/"
        className="site-rail-brand"
        aria-label={`${navbar.title} 首页`}
        title={`${navbar.title} 首页`}
      >
        {navbar.logo ? (
          <img src={navbar.logo.src} alt="" width={38} height={38} />
        ) : (
          'X'
        )}
      </Link>
      <nav className="site-rail-links" aria-label="站点导航">
        {navbar.items.map(item => {
          const icon = <SiteIcon name={siteIcons[item.label] ?? 'docs'} />
          if ('href' in item && item.href) {
            return (
              <a
                key={item.label}
                href={item.href}
                target="_blank"
                rel="noreferrer"
                className="site-rail-link"
                title={item.label}
              >
                {icon}
                <span>
                  {item.label === '工作台下载'
                    ? '下载'
                    : item.label === '工作台源码'
                      ? '源码'
                      : item.label}
                </span>
              </a>
            )
          }
          if ('to' in item && item.to) {
            const current = activeSection === item.label
            return (
              <Link
                key={item.label}
                to={item.to.startsWith('/') ? item.to : `/${item.to}`}
                className="site-rail-link"
                aria-current={
                  current ? (pathname === item.to ? 'page' : 'true') : undefined
                }
                title={item.label}
              >
                {icon}
                <span>{item.label}</span>
              </Link>
            )
          }
          return null
        })}
      </nav>
      <div className="site-rail-utilities">
        <button
          type="button"
          className="site-rail-link"
          onClick={openSearch}
          aria-keyshortcuts="Control+k Meta+k"
        >
          <SiteIcon name="search" />
          <span>搜索</span>
        </button>
        <button
          type="button"
          className="site-rail-link"
          onClick={toggleTheme}
          aria-label={themeLabel}
          title={themeLabel}
        >
          <SiteIcon name={theme === 'light' ? 'moon' : 'sun'} />
          <span>{theme === 'light' ? '深色' : '浅色'}</span>
        </button>
      </div>
    </div>
  )
}

function NavigationSheet({
  title,
  children,
  onClose
}: {
  title: string
  children: ReactNode
  onClose: () => void
}) {
  const dialog = useRef<HTMLDialogElement>(null)

  useLayoutEffect(() => {
    const element = dialog.current
    element?.showModal()
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      element?.close()
      document.body.style.overflow = previousOverflow
    }
  }, [])

  return (
    <dialog
      ref={dialog}
      className="site-navigation-sheet"
      aria-label={title}
      onCancel={event => {
        event.preventDefault()
        onClose()
      }}
      onClick={event => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="site-navigation-sheet-inner">
        <header className="site-navigation-sheet-header">
          <strong>{title}</strong>
          <button
            type="button"
            className="site-icon-button"
            aria-label="关闭导航面板"
            onClick={onClose}
          >
            <SiteIcon name="close" />
          </button>
        </header>
        {children}
      </div>
    </dialog>
  )
}

export default function SiteFrame({
  children,
  navigation,
  navigationTitle,
  toc
}: {
  children: ReactNode
  navigation?: (onNavigate?: () => void) => ReactNode
  navigationTitle?: string
  toc?: (onNavigate?: () => void) => ReactNode
}) {
  const { pathname, hash, key } = useLocation()
  const [drawer, setDrawer] = useState<'navigation' | 'toc' | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const { title: siteTitle, logo } = config.themeConfig.navbar
  const closeDrawer = () => setDrawer(null)
  const openSearch = () => {
    setDrawer(null)
    setSearchOpen(true)
  }

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    const wide = window.matchMedia(
      drawer === 'toc' ? '(min-width: 1152px)' : '(min-width: 832px)'
    )
    const handleResize = () => {
      if (wide.matches) setDrawer(null)
    }
    wide.addEventListener('change', handleResize)
    return () => wide.removeEventListener('change', handleResize)
  }, [drawer])

  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return
    }

    let id = hash.slice(1)
    try {
      id = decodeURIComponent(id)
    } catch {
      /* Invalid escapes can be literal IDs. */
    }
    const goToAnchor = () => {
      const target = document.getElementById(id)
      target?.scrollIntoView({ block: 'start', behavior: 'instant' })
      return Boolean(target)
    }
    const observer = new MutationObserver(() => {
      if (goToAnchor()) observer.disconnect()
    })
    const frame = window.requestAnimationFrame(() => {
      if (!goToAnchor())
        observer.observe(
          document.getElementById('site-content') ?? document.body,
          {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['id']
          }
        )
    })
    return () => {
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [pathname, hash, key])

  const directory = navigation && (
    <div className="site-context">
      <div className="site-context-heading">{navigationTitle}</div>
      <div className="site-context-body">{navigation()}</div>
    </div>
  )

  return (
    <div
      className="site-frame"
      data-navigation={Boolean(navigation)}
      data-toc={Boolean(toc)}
    >
      <a className="site-skip-link" href="#site-content">
        跳到正文
      </a>
      <header className="site-compact-header">
        <button
          type="button"
          className="site-icon-button site-mobile-navigation"
          aria-label="打开站点导航"
          onClick={() => setDrawer('navigation')}
        >
          <SiteIcon name="menu" />
        </button>
        <Link to="/" className="site-compact-brand">
          {logo && <img src={logo.src} alt="" width={26} height={26} />}
          {siteTitle}
        </Link>
        <div className="site-compact-actions">
          <button
            type="button"
            className="site-icon-button"
            aria-label="搜索文档"
            onClick={openSearch}
          >
            <SiteIcon name="search" />
          </button>
          {toc && (
            <button
              type="button"
              className="site-icon-button"
              aria-label="打开本页目录"
              onClick={() => setDrawer('toc')}
            >
              <SiteIcon name="toc" />
            </button>
          )}
        </div>
      </header>
      <div className="site-desktop-navigation">
        <SiteRail openSearch={openSearch} />
        {directory}
      </div>
      <div id="site-content" tabIndex={-1} className="site-content">
        {children}
      </div>
      {toc && (
        <aside className="site-desktop-toc" aria-label="辅助侧栏">
          {toc()}
        </aside>
      )}
      {drawer === 'navigation' && (
        <NavigationSheet title="站点导航" onClose={closeDrawer}>
          <div
            className="site-sheet-navigation"
            data-directory={Boolean(navigation)}
            onClick={event => {
              if ((event.target as HTMLElement).closest('a')) closeDrawer()
            }}
          >
            <SiteRail openSearch={openSearch} />
            {navigation && (
              <div className="site-context">
                <div className="site-context-heading">{navigationTitle}</div>
                <div className="site-context-body">
                  {navigation(closeDrawer)}
                </div>
              </div>
            )}
          </div>
        </NavigationSheet>
      )}
      {drawer === 'toc' && toc && (
        <NavigationSheet title="本页目录" onClose={closeDrawer}>
          <div className="site-sheet-toc">{toc(closeDrawer)}</div>
        </NavigationSheet>
      )}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}
