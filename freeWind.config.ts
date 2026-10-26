import { defineConfig } from '@free-wind/core'
import { ECOSYSTEM_URL } from './src/config/ecosystem'

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
          to: '/docs/alemonx/getting-started/quick-start',
          label: '工作台',
          position: 'left'
        },
        {
          to: '/docs/alemonjsDocs/overview',
          label: '机器人',
          position: 'left'
        },
        {
          to: '/docs/help/overview',
          label: '常见问题',
          position: 'left'
        },
        {
          to: 'blog',
          label: '博客',
          position: 'left'
        },
        {
          href: ECOSYSTEM_URL,
          label: '生态资源',
          position: 'left'
        },
        {
          position: 'right',
          label: '工作台下载',
          href: 'https://github.com/lemonade-lab/alemonx/releases'
        },
        {
          position: 'right',
          label: '工作台源码',
          href: 'https://github.com/lemonade-lab/alemonx'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '使用文档',
          items: [
            {
              label: '安装工作台',
              to: '/docs/alemonx/getting-started/install'
            },
            {
              label: '创建机器人',
              to: '/docs/alemonjsDocs/getting-started/install'
            },
            {
              label: '连接平台',
              to: '/docs/alemonjsDocs/getting-started/connect-platform'
            },
            { label: '常见问题', to: '/docs/help/overview' }
          ]
        },
        {
          title: '开发资源',
          items: [
            { label: '开发入口', to: '/docs/extensions' },
            { label: '生态资源', href: ECOSYSTEM_URL },
            {
              label: '机器人源码',
              href: 'https://github.com/lemonade-lab/alemonjs'
            }
          ]
        },
        {
          title: '版本与社区',
          items: [
            { label: '更新日志', to: '/blog' },
            {
              label: '工作台下载',
              href: 'https://github.com/lemonade-lab/alemonx/releases'
            },
            {
              label: '社区讨论',
              href: 'https://github.com/lemonade-lab/alemonx/discussions'
            },
            { label: '交流群', href: 'https://qm.qq.com/q/AIiSecyPlK' }
          ]
        }
      ],
      copyright: `Released under the MIT License. <br/> Copyright © 2024-present LemonadeX </span> <br> ${link}`
    }
  }
})
