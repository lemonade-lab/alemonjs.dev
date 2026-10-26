import { Link, useLocation } from 'react-router-dom'
import { getBlogProject, getProjectPosts, blogProjectNames } from '@/utils/blog'

export default function BlogList() {
  const location = useLocation()
  const project = getBlogProject(location.pathname, location.search)
  const posts = getProjectPosts(project)

  return (
    <div className="not-prose py-4 sm:py-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--text)]">博客</h1>
        <h2 className="mt-3 text-lg font-semibold text-[var(--text)]">
          {blogProjectNames[project]}
        </h2>
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          {project === 'framework'
            ? '版本变化、接口调整与迁移说明。'
            : '工作台发布与使用介绍。'}
        </p>
      </header>
      <div className="space-y-5">
        {posts.length === 0 && (
          <p className="text-[var(--text-muted)]">暂无文章</p>
        )}
        {posts.map(post => (
          <article
            key={post.path}
            className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6"
          >
            <h3 className="text-xl font-semibold text-[var(--text)]">
              <Link to={post.path} className="hover:underline">
                {post.title}
              </Link>
            </h3>
            <time
              dateTime={post.date}
              className="mt-2 block text-sm text-[var(--text-muted)]"
            >
              {post.date}
            </time>
            {post.description && (
              <p className="mt-3 text-[var(--text-muted)]">
                {post.description}
              </p>
            )}
          </article>
        ))}
      </div>
      <footer className="mt-10 border-t border-[var(--line)] pt-5 text-sm">
        <Link
          to={project === 'framework' ? '/blog?project=workbench' : '/blog'}
          className="text-[var(--text-muted)] hover:underline"
        >
          {project === 'framework' ? '工作台文章' : '返回框架更新'}
        </Link>
      </footer>
    </div>
  )
}
