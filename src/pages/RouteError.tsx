import { Link, useRouteError } from 'react-router-dom'

export default function RouteError() {
  const error = useRouteError()
  const message = error instanceof Error ? error.message : '内容加载失败'

  return (
    <main className="grid min-h-screen place-items-center bg-[var(--canvas)] px-6 text-center text-[var(--text)]">
      <div className="max-w-xl">
        <p className="text-sm font-semibold tracking-[0.2em] text-[var(--text-muted)]">
          ERROR
        </p>
        <h1 className="mt-3 text-3xl font-bold">页面加载失败</h1>
        <p className="mt-3 break-words text-[var(--text-muted)]">{message}</p>
        <Link
          to="/"
          className="mt-6 inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)]"
        >
          返回首页
        </Link>
      </div>
    </main>
  )
}
