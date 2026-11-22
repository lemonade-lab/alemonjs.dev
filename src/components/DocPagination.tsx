import { Link, useLocation } from 'react-router-dom'
import sidebar from '@/config/sidebar.json'
import { flattenSidebar } from '@/utils/flattenSidebar'

const pages = flattenSidebar(sidebar)

export default function DocPagination() {
  const { pathname } = useLocation()
  const index = pages.findIndex(
    page => page.path === pathname.replace(/\/$/, '')
  )
  if (index < 0) return null

  const previous = pages[index - 1]
  const next = pages[index + 1]
  if (!previous && !next) return null

  return (
    <nav className="doc-pagination" aria-label="相邻文档">
      {previous && (
        <Link to={previous.path}>
          <small>← 上一页</small>
          <strong>{previous.title}</strong>
        </Link>
      )}
      {next && (
        <Link className="next" to={next.path}>
          <small>下一页 →</small>
          <strong>{next.title}</strong>
        </Link>
      )}
    </nav>
  )
}
