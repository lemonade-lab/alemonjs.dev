import { useMemo } from 'react'
import { getAuthors } from '@/utils/parseAuthors'

interface BlogAuthorProps {
  authorId: string | string[]
  showBio?: boolean
}

export default function BlogAuthor({
  authorId,
  showBio = true
}: BlogAuthorProps) {
  const authors = useMemo(() => {
    return getAuthors(authorId)
  }, [authorId])

  if (authors.length === 0) {
    return null
  }

  return (
    <div className="my-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-start gap-4">
        {authors.length === 1 && authors[0].image_url ? (
          <img
            src={authors[0].image_url}
            alt={authors[0].name}
            className="w-16 h-16 rounded-full border-2 border-blue-500 dark:border-blue-400 flex-shrink-0"
          />
        ) : null}

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            {authors.map((author, index) => (
              <div key={author.name} className="flex items-center">
                {authors.length > 1 && author.image_url && (
                  <img
                    src={author.image_url}
                    alt={author.name}
                    className="w-8 h-8 rounded-full border border-blue-400 dark:border-blue-500 mr-2"
                  />
                )}
                <div>
                  {author.url ? (
                    <a
                      href={author.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      {author.name}
                    </a>
                  ) : (
                    <span className="font-semibold text-gray-900 dark:text-gray-100">
                      {author.name}
                    </span>
                  )}
                  {showBio && author.title && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {author.title}
                    </p>
                  )}
                </div>
                {index < authors.length - 1 && (
                  <span className="mx-2 text-gray-400">·</span>
                )}
              </div>
            ))}
          </div>

          {showBio && authors.length === 1 && authors[0].socials && (
            <div className="flex gap-3 mt-3">
              {authors[0].socials.github && (
                <a
                  href={`https://github.com/${authors[0].socials.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  title="GitHub"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </a>
              )}
              {authors[0].socials.twitter && (
                <a
                  href={`https://twitter.com/${authors[0].socials.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  title="Twitter"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              )}
              {authors[0].email && (
                <a
                  href={`mailto:${authors[0].email}`}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                  title="Email"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
