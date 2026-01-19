import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface BlogPost {
  title: string
  description?: string
  date: string
  path: string
  tags?: string[]
  authors?: string | string[]
}

const blogData = () => import('@/config/blog.json')

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [selectedTag, setSelectedTag] = useState<string | null>(null)

  useEffect(() => {
    // 动态导入博客配置
    blogData()
      .then(data => {
        setPosts(data.default || data)
      })
      .catch(() => {
        console.warn('无法加载博客配置')
      })
  }, [])

  // 获取所有标签
  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags || []))
  ).sort()

  // 过滤文章
  const filteredPosts = selectedTag
    ? posts.filter(post => post.tags?.includes(selectedTag))
    : posts

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 标签过滤 */}
      {allTags.length > 0 && (
        <div className="mb-6 sm:mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedTag(null)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
              selectedTag === null
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md'
            }`}
          >
            全部
          </button>
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                selectedTag === tag
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 hover:shadow-md'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {/* 文章列表 */}
      <div className="space-y-4 sm:space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              暂无博客文章
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              运行{' '}
              <code className="px-2 py-1 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 rounded">
                yarn generate
              </code>{' '}
              生成博客列表
            </p>
          </div>
        ) : (
          filteredPosts.map(post => (
            <article
              key={post.path}
              className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl dark:shadow-gray-900/50 dark:hover:shadow-blue-900/30 transition-all duration-300 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600 hover:-translate-y-1 group"
            >
              <Link to={post.path}>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-indigo-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-300">
                  {post.title}
                </h2>
              </Link>

              <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString('zh-CN', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {post.authors && (
                  <>
                    <span className="hidden sm:inline">·</span>
                    <span className="truncate">
                      {Array.isArray(post.authors)
                        ? post.authors.join(', ')
                        : post.authors}
                    </span>
                  </>
                )}
              </div>

              {post.description && (
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
                  {post.description}
                </p>
              )}

              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      onClick={e => {
                        e.preventDefault()
                        setSelectedTag(tag)
                      }}
                      className="px-2 sm:px-3 py-1 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium cursor-pointer hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50 transition-all duration-200 hover:shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))
        )}
      </div>
    </div>
  )
}
