import classNames from 'classnames'
import { useInView } from 'react-intersection-observer'
import img1 from '@/assets/img/web/info.png'
import img2 from '@/assets/img/dt/cat.png'
import img3 from '@/assets/img/dt/home.png'
import { Image } from 'antd'

const items = [
  {
    url: img1,
    title: 'WEB面板',
    docs: '可视化操作面板',
    position: 'right',
    link: 'https://github.com/lemonade-lab/alemongo'
  },
  {
    url: img2,
    title: '测试环境',
    docs: '不必登录平台即可测试代码',
    position: 'left',
    link: 'https://marketplace.visualstudio.com/items?itemName=lemonadex.alemonjs-testone'
  },
  {
    url: img3,
    title: '桌面启动',
    docs: '立即安装立即启动机器人',
    position: 'right',
    link: 'https://github.com/lemonade-lab/alemondesk'
  }
]

const Session = ({ item }) => {
  const [view, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  })
  return (
    <div
      ref={view}
      onClick={() => {
        window.open(item.link, '_blank')
      }}
      className={classNames(
        `flex flex-col md:flex-row cursor-pointer gap-4 sm:gap-6 lg:gap-8 px-4 py-6 rounded-2xl   transition-all duration-500 hover:-translate-y-2 border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-600`,
        {
          'md:flex-row-reverse': item.position === 'left'
        },
        'animate__animated  duration-[1000ms]',
        {
          'animate__fadeInLeft opacity-100': item.position === 'left' && inView,
          'animate__fadeInRight opacity-100':
            item.position === 'right' && inView,
          'opacity-0': !inView
        }
      )}
    >
      <div onClick={e => e.stopPropagation()}>
        <Image
          classNames={{
            root: 'w-[40rem]'
          }}
          className="w-full md:w-[40rem] rounded-2xl border border-gray-200 dark:border-gray-700 transition-all duration-500"
          src={item.url}
        />
      </div>
      <div className="flex flex-col gap-3 items-center justify-center py-4 md:py-0">
        <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent">
          {item.title}
        </div>
        <div className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
          {item.docs}
        </div>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <main className="flex justify-around py-6 sm:py-8">
      <div className="container max-w-7xl mx-auto">
        <div className="flex flex-col items-center w-full gap-6 sm:gap-8 lg:gap-10 py-6 sm:py-8">
          {items.map((item, index) => (
            <div key={index} className="w-full">
              <Session item={item} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
