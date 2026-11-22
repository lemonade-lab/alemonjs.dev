import { Link, Outlet, useLocation } from 'react-router-dom'
import BlogSidebar from '@/components/BlogSidebar'
import BlogMeta from '@/components/BlogMeta'
import BlogPagination from '@/components/BlogPagination'
import Footer from '@/components/Footer'
import PageToc from '@/components/PageToc'
import RouteMeta from '@/components/RouteMeta'
import SiteFrame from './SiteFrame'

export default function BlogLayout() {
  const { pathname } = useLocation()
  const index = pathname.replace(/\/$/, '') === '/blog'

  return (
    <SiteFrame
      navigation={onNavigate => <BlogSidebar onNavigate={onNavigate} />}
      navigationTitle="博客目录"
      toc={
        index ? undefined : onNavigate => <PageToc onNavigate={onNavigate} />
      }
    >
      <RouteMeta />
      <main className="reading-main">
        {index ? (
          <Outlet />
        ) : (
          <>
            <nav className="reader-breadcrumb" aria-label="当前位置">
              <Link to="/blog">博客</Link>
            </nav>
            <BlogMeta />
            <article id="doc-content" className="prose reader-prose">
              <Outlet />
            </article>
            <BlogPagination />
          </>
        )}
      </main>
      <Footer />
    </SiteFrame>
  )
}
