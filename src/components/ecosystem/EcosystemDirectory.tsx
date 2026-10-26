import { useEffect, useState } from 'react'
import { fetchEcosystem } from '@/api/ecosystem'
import type {
  EcosystemDirectoryProps,
  EcosystemResult
} from '@/api/ecosystem.d'
import { ECOSYSTEM_URL } from '@/config/ecosystem'

export default function EcosystemDirectory({
  collection,
  fallback
}: EcosystemDirectoryProps) {
  const [criteria, setCriteria] = useState({ q: '', page: 1, attempt: 0 })
  const [searchInput, setSearchInput] = useState('')
  const [result, setResult] = useState<EcosystemResult | null>(null)
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )

  useEffect(() => {
    const controller = new AbortController()
    let active = true
    const timer = window.setTimeout(() => controller.abort(), 10000)
    setStatus('loading')
    fetchEcosystem(
      collection.types,
      criteria.q,
      criteria.page,
      controller.signal
    )
      .then(data => {
        if (active) {
          setResult(data)
          setStatus('success')
        }
      })
      .catch(() => {
        if (active) setStatus('error')
      })
      .finally(() => window.clearTimeout(timer))
    return () => {
      active = false
      controller.abort()
      window.clearTimeout(timer)
    }
  }, [collection.types, criteria])

  const platform = new URL(ECOSYSTEM_URL)
  platform.searchParams.set('type', collection.types)
  if (criteria.q) platform.searchParams.set('q', criteria.q)
  const buttonClass =
    'rounded-lg border border-[var(--line)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-[var(--text)] hover:bg-[var(--surface-muted)] disabled:cursor-not-allowed disabled:opacity-40'

  if (!result || status === 'error') {
    return (
      <>
        <div className="not-prose mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 text-sm">
          <p
            role={status === 'error' ? 'alert' : 'status'}
            className="m-0 flex-1 text-[var(--text-muted)]"
          >
            {status === 'error'
              ? '最新资源暂时无法加载，以下为官网收录目录。'
              : '正在更新资源目录…'}
          </p>
          {status === 'error' && (
            <button
              className={buttonClass}
              onClick={() =>
                setCriteria(value => ({ ...value, attempt: value.attempt + 1 }))
              }
            >
              重试
            </button>
          )}
          <a href={platform.href} className="font-medium text-[var(--accent)]">
            前往生态平台 ↗
          </a>
        </div>
        {fallback}
      </>
    )
  }

  const groups = Array.from(
    new Set(result.data.map(item => item.sourceCategory))
  )
  const pages = Math.max(1, Math.ceil(result.total / result.pageSize))

  return (
    <section aria-busy={status === 'loading'}>
      <h1>{collection.title}</h1>
      <p>{collection.description}</p>
      {collection.guide && (
        <p>
          <a href={collection.guide.href}>{collection.guide.label}</a>
        </p>
      )}
      <div className="not-prose mb-6 flex flex-wrap items-center gap-4 text-sm">
        <span role="status" className="text-[var(--text-muted)]">
          {status === 'loading' ? '正在更新资源…' : `共 ${result.total} 个资源`}
        </span>
        <a href={platform.href} className="font-medium text-[var(--accent)]">
          前往生态平台 ↗
        </a>
      </div>
      <form
        className="not-prose my-6 flex gap-2"
        onSubmit={event => {
          event.preventDefault()
          setCriteria({ q: searchInput.trim(), page: 1, attempt: 0 })
        }}
      >
        <label htmlFor="ecosystem-search" className="sr-only">
          搜索当前分类资源
        </label>
        <input
          id="ecosystem-search"
          type="search"
          maxLength={200}
          placeholder="搜索当前分类资源"
          value={searchInput}
          onChange={event => setSearchInput(event.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm text-[var(--text)]"
        />
        <button
          className={buttonClass}
          type="submit"
          disabled={status === 'loading'}
        >
          搜索
        </button>
      </form>
      {result.data.length === 0 && <p>没有找到符合条件的资源。</p>}
      {groups.map(group => (
        <section key={group}>
          <h2>{group}</h2>
          {collection.types === 'connector' && group === '第三方' && (
            <blockquote>
              <p>第三方协议可能存在风险，请谨慎使用。</p>
            </blockquote>
          )}
          <ul className="not-prose space-y-3 sm:hidden">
            {result.data
              .filter(item => item.sourceCategory === group)
              .map(item => (
                <li
                  key={item.id}
                  className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4"
                >
                  <a
                    className="break-words text-sm font-semibold text-[var(--text)]"
                    href={`${ECOSYSTEM_URL}/resources/${encodeURIComponent(item.id)}`}
                  >
                    {item.name}
                  </a>
                  <p className="mt-2 text-sm leading-6 text-[var(--text-muted)]">
                    {item.description}
                  </p>
                  <div className="mt-3 flex gap-4 text-sm font-medium text-[var(--accent)]">
                    <a href={item.repositoryUrl}>项目仓库 ↗</a>
                    {item.packageUrl && <a href={item.packageUrl}>npm 包 ↗</a>}
                  </div>
                </li>
              ))}
          </ul>
          <div className="hidden overflow-x-auto sm:block">
            <table>
              <thead>
                <tr>
                  <th>项目</th>
                  <th>说明</th>
                  <th>来源</th>
                </tr>
              </thead>
              <tbody>
                {result.data
                  .filter(item => item.sourceCategory === group)
                  .map(item => (
                    <tr key={item.id}>
                      <td className="break-all">
                        <a
                          href={`${ECOSYSTEM_URL}/resources/${encodeURIComponent(item.id)}`}
                        >
                          {item.name}
                        </a>
                      </td>
                      <td>{item.description}</td>
                      <td>
                        <a href={item.repositoryUrl}>仓库</a>
                        {item.packageUrl && (
                          <>
                            {' '}
                            · <a href={item.packageUrl}>npm</a>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
      {result.total > result.pageSize && (
        <nav
          aria-label="生态资源分页"
          className="not-prose mt-6 flex items-center justify-between gap-3 text-sm"
        >
          <button
            className={buttonClass}
            disabled={criteria.page <= 1 || status === 'loading'}
            onClick={() =>
              setCriteria(value => ({ ...value, page: value.page - 1 }))
            }
          >
            上一页
          </button>
          <span>
            第 {result.page} / {pages} 页
          </span>
          <button
            className={buttonClass}
            disabled={criteria.page >= pages || status === 'loading'}
            onClick={() =>
              setCriteria(value => ({ ...value, page: value.page + 1 }))
            }
          >
            下一页
          </button>
        </nav>
      )}
    </section>
  )
}
