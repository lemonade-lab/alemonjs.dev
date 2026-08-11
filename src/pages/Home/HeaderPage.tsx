import { Link } from 'react-router-dom'

const workbench = '/images/alemonx-workbench.png'

export default function HeaderPage() {
  return (
    <header className="overflow-hidden rounded-[2rem] bg-[#0a0a0a] px-6 pb-0 pt-12 text-white sm:px-10 sm:pt-16 lg:px-16 lg:pt-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-medium tracking-[0.22em] text-white/60">
          ALemonX
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-5xl font-semibold tracking-[-0.06em] sm:text-7xl lg:text-8xl">
          在本机创建、运行
          <br />
          和管理项目。
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
          导入代码库，运行命令并查看日志；创建任务后审阅和批准 Agent 操作。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a
            className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-white/85"
            href="https://github.com/lemonade-lab/alemonx/releases"
            target="_blank"
            rel="noreferrer"
          >
            下载 ALemonX
          </a>
          <Link
            className="rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            to="/docs/alemonx/getting-started/quick-start"
          >
            快速开始
          </Link>
        </div>
      </div>
      <div className="relative mx-auto mt-14 max-w-6xl sm:mt-16">
        <div className="pointer-events-none absolute inset-x-[12%] -top-10 h-24 bg-blue-500/30 blur-3xl" />
        <img
          src={workbench}
          alt="ALemonX 工作台"
          className="relative block w-full rounded-t-2xl border border-b-0 border-white/15 shadow-[0_-18px_70px_rgba(59,130,246,0.2)]"
        />
      </div>
    </header>
  )
}
