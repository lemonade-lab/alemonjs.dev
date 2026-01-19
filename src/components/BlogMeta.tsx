import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import BlogAuthor from './BlogAuthor'

const blogData = () => import('@/config/blog.json')

interface BlogPost {
  title: string
  description?: string
  date: string
  path: string
  tags?: string[]
  authors?: string | string[]
}

/**
 * 博客元信息组件 - 显示日期、作者等信息
 * 约定式注册：自动根据当前路由匹配博客文章信息
 */
export default function BlogMeta() {
  const location = useLocation()
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    // 查找当前路径对应的博客文章
    blogData().then(data => {
      const currentPost = data.find(p => p.path === location.pathname)
      setPost(currentPost || null)
    })
  }, [location.pathname])

  if (!post) {
    return null
  }

  return (
    <div className="not-prose mb-8 pb-8 border-b border-gray-200 dark:border-gray-700">
      {/* 标题 */}
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        {post.title}
      </h1>

      {/* 日期和标签 */}
      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <time dateTime={post.date} className="flex items-center">
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {new Date(post.date).toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </time>

        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {post.tags.map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-md text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 描述 */}
      {post.description && (
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
          {post.description}
        </p>
      )}

      {/* 作者信息 */}
      {post.authors && <BlogAuthor authorId={post.authors} />}
    </div>
  )
}
