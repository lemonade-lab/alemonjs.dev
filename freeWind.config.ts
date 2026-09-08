import { defineConfig } from '@free-wind/core'

const number = '津ICP备2023004480号'
const link = `<a  href="https://beian.miit.gov.cn/" target="_blank">${number}</a>`

export default defineConfig({
  themeConfig: {
    navbar: {
      logo: {
        alt: 'ALemonX Logo',
        src: 'me.png'
      },
      title: 'ALemonX',
      items: [
        {
          to: '/docs/intro',
          label: '文档',
          position: 'left'
        },
        {
          to: 'blog',
          label: '更新',
          position: 'left'
        },
        {
          position: 'right',
          label: '源码',
          href: 'https://github.com/lemonade-lab/alemonx'
        },
        {
          position: 'right',
          label: '框架',
          href: 'https://github.com/lemonade-lab/alemonjs'
        },
        {
          position: 'right',
          label: '下载',
          href: 'https://github.com/lemonade-lab/alemonx/releases'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '了解',
          items: [
            {
              label: '如何安装',
              to: '/docs/alemonx/getting-started/install'
            },
            {
              label: 'X系统插件',
              to: '/docs/apps-x'
            },
            {
              label: '加入社区',
              to: 'https://qm.qq.com/q/AIiSecyPlK'
            }
          ]
        },
        {
          title: '相关工具',
          items: [
            {
              label: '机器人框架',
              to: '/docs/alemonjsDocs/getting-started/install'
            },
            {
              label: '机器人插件',
              to: '/docs/apps'
            },
            {
              label: '机器人模块',
              to: '/docs/apps-module'
            },
            {
              label: '机器人平台',
              to: '/docs/environment'
            }
          ]
        },
        {
          title: '下载与更新',
          items: [
            {
              label: 'X版本更新',
              to: '/blog'
            },
            {
              label: 'X发布列表',
              href: 'https://github.com/lemonade-lab/alemonx/releases'
            },
            {
              label: 'X社区讨论',
              href: 'https://github.com/lemonade-lab/alemonx/discussions'
            }
          ]
        }
      ],
      copyright: `Released under the MIT License. <br/> Copyright © 2024-present Lemonade-Lab & ALemonX Contributors </span> <br> ${link}`
    }
  }
})
