import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Translate from '@docusaurus/Translate'
import TextReveal from '@site/src/components/TextReveal'
import React from 'react'
export default function HeaderPage(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className="flex flex-col items-center justify-center pt-12 relative">
      <img
        className="w-64 md:w-80 lg:w-96"
        src="img/alemon.png"
        alt={siteConfig.title}
      />
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <p className="text-sm md:text-xl xl:text-2xl mb-4">
          <TextReveal text="基于 JavaScript 所构建的聊天平台机器人开发框架" />
        </p>
        <div className="flex justify-center my-4">
          <a
            className="hidden sm:block bg-blue-500 text-white rounded-md px-4 py-2 mx-2 hover:bg-blue-600 transition"
            // href="#desktop"
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
            className="hidden sm:block bg-blue-500 text-white rounded-md px-4 py-2 mx-2 hover:bg-blue-600 transition"
            // href="#alemongo"
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
            className="bg-white text-blue-500 border border-blue-500 rounded-md px-4 py-2 mx-2 hover:bg-gray-200 transition"
            to="docs/intro"
          >
            <Translate> 🚀快速开始</Translate>
          </Link>
        </div>
      </div>
    </header>
  )
}
