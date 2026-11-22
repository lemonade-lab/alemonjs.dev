import { Link, Outlet, useLocation } from 'react-router-dom'
import DocsSidebar from '@/components/DocsSidebar'
import DocPagination from '@/components/DocPagination'
import Footer from '@/components/Footer'
import PageToc from '@/components/PageToc'
import RouteMeta from '@/components/RouteMeta'
import SiteFrame from './SiteFrame'

const sections = [
  {
    prefix: '/docs/alemonx/',
    href: '/docs/alemonx/getting-started/quick-start',
    label: 'ALemonX 工作台'
  },
  {
    prefix: '/docs/alemonjsDocs/',
    href: '/docs/alemonjsDocs/overview',
    label: 'ALemonJS 机器人'
  },
  { prefix: '/docs/help/', href: '/docs/help/overview', label: '问题排查' }
]

export default function DocsLayout() {
  const { pathname } = useLocation()
  const section = sections.find(item => pathname.startsWith(item.prefix))

  return (
    <SiteFrame
      navigation={onNavigate => <DocsSidebar onNavigate={onNavigate} />}
      navigationTitle="文档导航"
      toc={onNavigate => <PageToc onNavigate={onNavigate} />}
    >
      <RouteMeta />
      <main className="reading-main">
        <nav className="reader-breadcrumb" aria-label="当前位置">
          {section ? (
            <>
              <Link to="/docs/intro">文档</Link>
              <span aria-hidden="true">/</span>
              <Link to={section.href}>{section.label}</Link>
            </>
          ) : (
            <span>文档</span>
          )}
        </nav>
        <article id="doc-content" className="prose reader-prose">
          <Outlet />
        </article>
        <DocPagination />
      </main>
      <Footer />
    </SiteFrame>
  )
}
