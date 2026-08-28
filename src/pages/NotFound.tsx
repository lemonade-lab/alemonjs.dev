import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[var(--canvas)] px-6 text-center text-[var(--text)]">
      <div>
        <p className="text-sm font-semibold tracking-[0.2em] text-[var(--text-muted)]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-bold">页面不存在</h1>
        <p className="mt-3 text-[var(--text-muted)]">
          这个地址可能已经移动或被删除。
        </p>
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
