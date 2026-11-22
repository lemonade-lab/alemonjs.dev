import { Link, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { getBlogProject, getProjectPosts, blogProjectNames } from '@/utils/blog'
import SiteIcon from './SiteIcon'
import '../assets/css/sidebar.css'

export default function BlogSidebar({
  onNavigate
}: {
  onNavigate?: () => void
}) {
  const { pathname, search } = useLocation()
  const project = getBlogProject(pathname, search)
  const [closed, setClosed] = useState<Record<string, boolean>>({})
  const grouped = useMemo(() => {
    const groups = new Map<string, ReturnType<typeof getProjectPosts>>()
    for (const post of getProjectPosts(project)) {
      const year = post.date.slice(0, 4)
      const posts = groups.get(year)
      if (posts) posts.push(post)
      else groups.set(year, [post])
    }
    return [...groups].sort(([left], [right]) => right.localeCompare(left))
  }, [project])
  const otherProject = project === 'framework' ? 'workbench' : 'framework'

  return (
    <nav aria-label="博客目录" className="docs-navigation">
      <div className="docs-blog-projects">
        {[project, otherProject].map(item => (
          <Link
            className="docs-navigation-link"
            key={item}
            to={item === 'framework' ? '/blog' : '/blog?project=workbench'}
            onClick={onNavigate}
            aria-current={item === project ? 'true' : undefined}
          >
            {blogProjectNames[item]}
          </Link>
        ))}
      </div>
      <ul>
        {grouped.map(([year, posts]) => {
          const key = `${project}/${year}`
          const active = posts.some(post => post.path === pathname)
          const isClosed = !active && closed[key]
          return (
            <li key={key} className="docs-navigation-section">
              <button
                type="button"
                className="docs-navigation-heading"
                aria-expanded={!isClosed}
                onClick={() =>
                  setClosed(previous => ({ ...previous, [key]: !isClosed }))
                }
              >
                <span>{year}</span>
                <SiteIcon name="chevron" />
              </button>
              {!isClosed && (
                <ul className="docs-navigation-children">
                  {posts.map(post => (
                    <li key={post.path}>
                      <Link
                        className="docs-navigation-link docs-blog-link"
                        to={post.path}
                        onClick={onNavigate}
                        aria-current={
                          pathname === post.path ? 'page' : undefined
                        }
                      >
                        <span>{post.title}</span>
                        <time dateTime={post.date}>
                          {post.date.slice(5, 10)}
                        </time>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
