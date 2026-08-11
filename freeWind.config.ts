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
          to: '/docs/install',
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
          label: 'GitHub',
          href: 'https://github.com/lemonade-lab/alemonx'
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
          title: '创建项目',
          items: [
            {
              label: '快速开始',
              to: '/docs/alemonx/getting-started/quick-start'
            },
            {
              label: '项目管理',
              to: '/docs/alemonx/use/projects/create-or-import'
            }
          ]
        },
        {
          title: '相关工具',
          items: [
            {
              label: 'AlemonJS',
              to: '/docs/alemonjsDocs/getting-started/overview'
            },
            {
              label: '插件与扩展',
              to: '/docs/alemonx/ecosystem/plugins'
            },
            {
              label: '开源仓库',
              to: '/docs/alemonx/ecosystem/open-source'
            }
          ]
        },
        {
          title: '下载与更新',
          items: [
            {
              label: '版本更新',
              to: '/blog'
            },
            {
              label: 'ALemonX Releases',
              href: 'https://github.com/lemonade-lab/alemonx/releases'
            },
            {
              label: '社区讨论',
              href: 'https://github.com/lemonade-lab/alemonx/discussions'
            }
          ]
        }
      ],
      copyright: `Released under the MIT License. <br/> Copyright © 2024-present Lemonade-Lab & ALemonX Contributors </span> <br> ${link}`
    }
  }
})
