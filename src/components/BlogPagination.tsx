import { Link, useLocation } from 'react-router-dom'
import { getBlogProject, getProjectPosts } from '@/utils/blog'
import { flattenBlog } from '@/utils/flattenSidebar'

export default function BlogPagination() {
  const { pathname } = useLocation()
  const posts = flattenBlog(getProjectPosts(getBlogProject(pathname)))
  const index = posts.findIndex(
    post => post.path === pathname.replace(/\/$/, '')
  )
  if (index < 0) return null

  const previous = posts[index - 1]
  const next = posts[index + 1]
  if (!previous && !next) return null

  return (
    <nav className="doc-pagination" aria-label="相邻文章">
      {previous && (
        <Link to={previous.path}>
          <small>← 上一篇</small>
          <strong>{previous.title}</strong>
        </Link>
      )}
      {next && (
        <Link to={next.path} className="next">
          <small>下一篇 →</small>
          <strong>{next.title}</strong>
        </Link>
      )}
    </nav>
  )
}
