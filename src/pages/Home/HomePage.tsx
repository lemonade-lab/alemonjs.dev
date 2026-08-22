import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react'
import { Link } from 'react-router-dom'
import alemonJSImage from '@/assets/img/alemon.png'
import testOneImage from '@/assets/img/dt/cat.png'
// import alemonDeskImage from '@/assets/img/dt/home.png'
// import alemonGoImage from '@/assets/img/web/info.png'
import alemonAppImage from '@/assets/img/web/phone.png'

const features = [
  {
    eyebrow: '01 · 项目',
    title: '创建、导入和查看机器人项目。',
    description:
      '选择模板、导入本地目录，或克隆 Git 仓库。项目页显示目录、Git 状态、连接、插件和可执行操作。',
    action: '查看项目操作',
    link: '/docs/alemonx/use/projects/create-or-import',
    image: '/images/alemonx-workbench.png',
    imageAlt: 'ALemonX 项目工作台与 Agent 任务输入区'
  },
  {
    eyebrow: '02 · 运行',
    title: '检查端口、依赖和进程，再启动服务。',
    description:
      '在运行页检查机器人端口和测试端口，升级或重装依赖，启动前台调试或 PM2 后台服务，并直接查看状态与日志。',
    action: '查看运行操作',
    link: '/docs/alemonx/use/runtime/run-and-monitor',
    image: '/images/alemonx-control.png',
    imageAlt: 'ALemonX 运行页显示端口检查、依赖和前后台运行操作'
  },
  {
    eyebrow: '03 · Agent',
    title: '创建任务，批准修改，检查验证结果。',
    description:
      '输入修复、实现或检查目标。先阅读 Agent 计划，再批准写入操作；任务页保留事件、验证输出、报告和恢复信息。',
    action: '查看 Agent 操作',
    link: '/docs/alemonx/use/agent/collaboration',
    image: '/images/alemonx-fix.png',
    imageAlt: 'ALemonX 运维页显示任务、维护和紧急停止操作'
  },
  {
    eyebrow: '04 · 测试',
    title: '在连接平台前，先发送和检查机器人消息。',
    description:
      '使用 ALemonJS TestOne 打开本地测试环境，发送指令、查看消息格式和事件日志；不必先登录真实聊天平台。',
    action: '打开测试工具',
    link: 'https://marketplace.visualstudio.com/items?itemName=lemonadex.alemonjs-testone',
    image: '/images/alemonx-testone.png',
    imageAlt: 'ALemonJS TestOne 本地机器人消息测试界面'
  },
  {
    eyebrow: '05 · 扩展',
    title: '安装、启用和开发系统插件。',
    description:
      '在插件页查看已发现的系统插件，启用网络、连接和本机管理能力；开发插件时配置 alx.json、Web 页面和执行器。',
    action: '查看插件开发',
    link: '/docs/alemonx/develop/system-plugins',
    image: '/images/system-plugin.png',
    imageAlt: 'ALemonX 系统插件列表与启用操作'
  }
]

const products = [
  {
    name: 'ALemonAPP',
    type: '移动端项目',
    description: '安装APP=启动机器人，人手一只机器人不在话下',
    image: alemonAppImage,
    imageClass: 'object-contain bg-[#f5f6fa] p-3 sm:p-5',
    link: 'https://download.alemonjs.com/application/alemonapp/app.apk',
    action: '下载移动端'
  },
  {
    name: 'ALemonJS',
    type: '机器人开发框架',
    description: '创建机器人项目，配置路由、事件、消息和平台适配。',
    image: alemonJSImage,
    imageClass: 'object-contain p-12 sm:p-16',
    link: '/docs/alemonjsDocs/getting-started/quick-start',
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
  }
]

function ActionLink({
  link,
  children,
  className = 'inline-flex items-center gap-2 text-sm font-semibold text-[var(--text)] underline underline-offset-4 decoration-[var(--text-muted)] hover:decoration-[var(--text)]'
}: {
  link: string
  children: string
  className?: string
}) {
  if (link.startsWith('/'))
    return (
      <Link className={className} to={link}>
        {children} <span aria-hidden="true">→</span>
      </Link>
    )
  return (
    <a className={className} href={link} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  )
}

function ProductLink({ product }: { product: (typeof products)[number] }) {
  return (
    <ActionLink
      link={product.link}
      className="inline-flex rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-contrast)] transition hover:opacity-80"
    >
      {product.action}
    </ActionLink>
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
    <main className="space-y-24 pb-4 sm:space-y-40">
      <section aria-labelledby="features-title">
        <p className="text-sm font-medium tracking-[0.18em] text-[var(--text-muted)]">
          ALemonX 工作台
        </p>
        <h2
          id="features-title"
          className="mt-4 max-w-4xl text-3xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-4xl"
        >
          用同一套界面完成机器人项目的日常操作。
        </h2>
      </section>

      <div className="space-y-20 sm:space-y-32">
        {features.map((feature, index) => (
          <section
            key={feature.title}
            className="grid items-center gap-8 lg:grid-cols-2 lg:gap-16"
            aria-labelledby={`feature-${index}`}
          >
            <div className={index % 2 === 0 ? 'lg:order-2' : ''}>
              <p className="text-sm font-medium tracking-[0.16em] text-[var(--text-muted)]">
                {feature.eyebrow}
              </p>
              <h3
                id={`feature-${index}`}
                className="mt-4 max-w-xl text-2xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-3xl"
              >
                {feature.title}
              </h3>
              <p className="mt-5 max-w-lg text-base leading-8 text-[var(--text-muted)] sm:text-lg">
                {feature.description}
              </p>
              <div className="mt-7">
                <ActionLink link={feature.link}>{feature.action}</ActionLink>
              </div>
            </div>
            <div
              className={`${index % 2 === 0 ? 'lg:order-1' : ''} overflow-hidden rounded-[1.5rem] border border-[var(--line)] bg-[#171716] shadow-[0_18px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_18px_40px_rgba(0,0,0,0.4)]`}
            >
              <img
                src={feature.image}
                alt={feature.imageAlt}
                className="block h-auto w-full"
                loading={index === 0 ? 'eager' : 'lazy'}
              />
            </div>
          </section>
        ))}
      </div>

      <section aria-labelledby="ecosystem-title">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-sm font-medium tracking-[0.18em] text-[var(--text-muted)]">
              相关工具
            </p>
            <h2
              id="ecosystem-title"
              className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-4xl"
            >
              打开已有产品。
            </h2>
          </div>
          <ActionLink link="/docs/alemonx/ecosystem/overview">
            查看生态
          </ActionLink>
        </div>
        <div
          className="grid overflow-hidden rounded-[2rem] border border-[var(--line)] bg-[var(--surface-muted)] outline-none lg:grid-cols-[0.92fr_1.08fr]"
          aria-roledescription="carousel"
          aria-label="ALemonX 生态产品。可使用左右方向键或触摸滑动切换。"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex min-h-[360px] flex-col justify-between p-7 sm:p-10">
            <div aria-live="polite">
              <p className="text-sm font-medium text-[var(--text-muted)]">
                {product.type}
              </p>
              <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-[var(--text)] sm:text-4xl">
                {product.name}
              </h3>
              <p className="mt-5 max-w-md text-lg leading-8 text-[var(--text-muted)]">
                {product.description}
              </p>
            </div>
            <div className="mt-10 flex items-center justify-between gap-4">
              <ProductLink product={product} />
              <div
                className="flex shrink-0 gap-2"
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
                    className={`h-2.5 rounded-full bg-[var(--text-muted)] transition-all ${active === index ? 'w-7 bg-[var(--accent)] opacity-100' : 'w-2.5 opacity-35 hover:opacity-65'}`}
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="relative min-h-[320px] overflow-hidden bg-[var(--surface)]">
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
