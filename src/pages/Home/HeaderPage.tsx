import { Link } from 'react-router-dom'

const workbench = '/images/alemonx-workbench.png'

export default function HeaderPage() {
  return (
    <header className="overflow-hidden rounded-[2rem] bg-[#10100f] px-6 pb-0 pt-12 text-white sm:px-10 sm:pt-16 lg:px-16 lg:pt-20">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-sm font-medium tracking-[0.22em] text-white/60">
          ALemonX
        </p>
        <h1 className="mx-auto mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl lg:text-6xl">
          管理机器人项目，
          <br />让 Agent 参与维护。
        </h1>
        <p className="mx-auto mt-7 max-w-xl text-base leading-7 text-white/65 sm:text-lg">
          创建或导入项目，运行服务和查看日志；为修复、开发与检查创建任务并批准操作。
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
        <img
          src={workbench}
          alt="ALemonX 工作台"
          className="relative block w-full rounded-t-2xl border border-b-0 border-white/15 shadow-[0_-18px_70px_rgba(0,0,0,0.45)]"
        />
      </div>
    </header>
  )
}
