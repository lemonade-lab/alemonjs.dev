import { Link } from 'react-router-dom'
import homeLogo from '@/assets/img/alemon.png'

const Translate = (props: { children: React.ReactNode }) => (
  <>{props.children}</>
)

const TextReveal = (props: { text: string }) => <>{props.text}</>

export default function HeaderPage() {
  return (
    <header className="flex flex-col items-center justify-center pt-8 sm:pt-12 relative px-4">
      <img className="w-64 md:w-80 lg:w-96" />
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <img
          src={homeLogo}
          className="max-w-[280px] sm:max-w-80 w-full"
          alt="ALemonJS Logo"
        />
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-4 px-4">
          <TextReveal text="基于 JavaScript 所构建的聊天平台机器人开发框架" />
        </p>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 my-4 w-full px-4">
          <a
            className="bg-blue-500 dark:bg-blue-600 text-white rounded-md px-4 sm:px-6 py-2 sm:py-3 hover:bg-blue-600 dark:hover:bg-blue-700 transition text-sm sm:text-base flex-1 sm:flex-none min-w-[120px] text-center "
            onClick={() => {
              window.open(
                'https://github.com/lemonade-lab/alemondesk/releases',
                '_self'
              )
            }}
          >
            <Translate> ⚡️安装桌面</Translate>
          </a>
          <a
            className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white rounded-lg px-4 sm:px-6 py-2 sm:py-3 transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none min-w-[120px] text-center  hover:-translate-y-0.5"
            onClick={() => {
              window.open(
                'https://github.com/lemonade-lab/alemongo/releases',
                '_self'
              )
            }}
          >
            <Translate> 💡安装Web</Translate>
          </a>
          <Link
            className="bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-500 dark:border-blue-600 hover:border-blue-600 dark:hover:border-blue-500 rounded-lg px-4 sm:px-6 py-2 sm:py-3 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300 text-sm sm:text-base flex-1 sm:flex-none min-w-[120px] text-center font-semibold  hover:-translate-y-0.5"
            to="docs/intro"
          >
            <Translate> 🚀快速开始</Translate>
          </Link>
        </div>
      </div>
    </header>
  )
}
