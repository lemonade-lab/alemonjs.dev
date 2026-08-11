import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { Link } from 'react-router-dom'
import alemonJSImage from '@/assets/img/alemon.png'
import testOneImage from '@/assets/img/dt/cat.png'
import alemonDeskImage from '@/assets/img/dt/home.png'
import alemonGoImage from '@/assets/img/web/info.png'

const capabilities = [
  ['01', '创建或导入', '选择模板，导入本地目录，或克隆 Git 仓库。'],
  ['02', '运行与查看', '运行终端命令；使用 PM2、Git 和日志管理进程。'],
  ['03', '创建并批准任务', '填写目标，审阅 Agent 计划，批准后查看验证结果。']
]

const products = [
  {
    name: 'AlemonJS',
    type: '机器人开发框架',
    description: '创建机器人项目，配置路由、事件、消息和平台适配。',
    image: alemonJSImage,
    imageClass: 'object-contain p-12 sm:p-16',
    link: '/docs/alemonjsDocs/getting-started/overview',
    action: '进入开发文档'
  },
  {
    name: 'ALemonJS TestOne',
    type: '测试工具',
    description: '在 VS Code 中运行测试，查看机器人消息和交互结果。',
    image: testOneImage,
    imageClass: 'object-cover',
    link: 'https://marketplace.visualstudio.com/items?itemName=lemonadex.alemonjs-testone',
    action: '查看扩展'
  },
  {
    name: 'AlemonDesk',
    type: '历史桌面产品',
    description: '下载旧版桌面端，继续使用已有的 AlemonDesk 项目。',
    image: alemonDeskImage,
    imageClass: 'object-cover',
    link: 'https://github.com/lemonade-lab/alemondesk/releases',
    action: '查看旧版'
  },
  {
    name: 'AlemonGo',
    type: '历史 Web 面板',
    description: '下载旧版 Web 管理面板，继续管理已有的机器人群。',
    image: alemonGoImage,
    imageClass: 'object-cover',
    link: 'https://github.com/lemonade-lab/alemongo/releases',
    action: '查看旧版'
  }
]

function ProductLink({ product }: { product: (typeof products)[number] }) {
  const className =
    'inline-flex rounded-full bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-black/75 dark:bg-white dark:text-black dark:hover:bg-white/80'
  if (product.link.startsWith('/'))
    return (
      <Link className={className} to={product.link}>
        {product.action}
      </Link>
    )
  return (
    <a
      className={className}
      href={product.link}
      target="_blank"
      rel="noreferrer"
    >
      {product.action}
    </a>
  )
}

export default function HomePage() {
  const [active, setActive] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const product = products[active]
  const previous = () =>
    setActive(index => (index - 1 + products.length) % products.length)
  const next = () => setActive(index => (index + 1) % products.length)
  const onKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      previous()
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      next()
    }
  }
  const onTouchStart = (event: TouchEvent<HTMLElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
  }
  const onTouchEnd = (event: TouchEvent<HTMLElement>) => {
    const startX = touchStartX.current
    const endX = event.changedTouches[0]?.clientX
    touchStartX.current = null
    if (startX === null || endX === undefined || Math.abs(endX - startX) < 48)
      return
    if (endX < startX) next()
    else previous()
  }

  return (
    <main className="space-y-24 pb-4 sm:space-y-32">
      <section aria-labelledby="capabilities-title">
        <p className="text-sm font-medium tracking-[0.18em] text-slate-500">
          主要操作
        </p>
        <h2
          id="capabilities-title"
          className="mt-4 max-w-3xl text-4xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-6xl"
        >
          项目、运行与任务，
          <br className="hidden sm:block" />
          在一个工作台操作。
        </h2>
        <div className="mt-12 grid border-t border-slate-200 dark:border-slate-800 md:grid-cols-3">
          {capabilities.map(([number, title, detail]) => (
            <article
              key={number}
              className="border-b border-slate-200 py-7 pr-8 dark:border-slate-800 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0"
            >
              <p className="text-sm text-slate-500">{number}</p>
              <h3 className="mt-8 text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">
                {title}
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600 dark:text-slate-300">
                {detail}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="ecosystem-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-medium tracking-[0.18em] text-slate-500">
              生态产品
            </p>
            <h2
              id="ecosystem-title"
              className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-6xl"
            >
              打开生态产品。
            </h2>
          </div>
          <Link
            className="text-sm font-semibold text-slate-950 underline underline-offset-4 dark:text-white"
            to="/docs/alemonx/ecosystem/overview"
          >
            查看生态
          </Link>
        </div>
        <div
          className="grid overflow-hidden rounded-[2rem] bg-[#e9e9e6] outline-none dark:bg-[#1c1c1c] lg:grid-cols-[0.92fr_1.08fr]"
          aria-roledescription="carousel"
          aria-label="ALemonX 生态产品。可使用左右方向键或触摸滑动切换。"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex min-h-[360px] flex-col justify-between p-7 sm:p-10">
            <div aria-live="polite">
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {product.type}
              </p>
              <h3 className="mt-4 text-4xl font-semibold tracking-[-0.05em] text-slate-950 dark:text-white sm:text-5xl">
                {product.name}
              </h3>
              <p className="mt-5 max-w-md text-lg leading-8 text-slate-600 dark:text-slate-300">
                {product.description}
              </p>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <ProductLink product={product} />
              <button
                className="rounded-full border border-black/15 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
                type="button"
                onClick={previous}
                aria-label="查看上一个生态产品"
              >
                ←
              </button>
              <button
                className="rounded-full border border-black/15 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-black/5 dark:border-white/15 dark:text-white dark:hover:bg-white/10"
                type="button"
                onClick={next}
                aria-label="查看下一个生态产品"
              >
                →
              </button>
              <div
                className="ml-1 flex gap-2"
                role="tablist"
                aria-label="选择生态产品"
              >
                {products.map((item, index) => (
                  <button
                    key={item.name}
                    type="button"
                    role="tab"
                    aria-selected={active === index}
                    aria-label={`查看 ${item.name}`}
                    onClick={() => setActive(index)}
                    className={`h-2.5 rounded-full transition-all ${active === index ? 'w-7 bg-black dark:bg-white' : 'w-2.5 bg-black/25 hover:bg-black/50 dark:bg-white/30 dark:hover:bg-white/60'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden bg-white/60 dark:bg-black/20">
            <img
              src={product.image}
              alt={`${product.name} 产品界面`}
              className={`absolute inset-0 h-full w-full ${product.imageClass}`}
            />
          </div>
        </div>
      </section>
    </main>
  )
}
