import { defineConfig } from '@free-wind/core'

const number = '津ICP备2023004480号'
const link = `<a  href="https://beian.miit.gov.cn/" target="_blank">${number}</a>`

export default defineConfig({
  themeConfig: {
    navbar: {
      logo: {
        alt: 'ALemonJS Logo',
        src: 'me.png'
      },
      title: 'ALemonJS',
      items: [
        {
          position: 'left',
          label: '文档',
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar'
        },
        {
          to: 'blog',
          label: '博客',
          position: 'left'
        },
        {
          position: 'right',
          label: '编辑',
          href: 'https://github.com/lemonade-lab/alemonjs.dev/blob/main/docs/intro.md'
        },
        {
          position: 'right',
          label: 'GitHub',
          href: 'https://github.com/lemonade-lab/alemonjs'
        }
      ]
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '教程',
          items: [
            {
              label: '简介',
              to: '/docs/intro'
            },
            {
              label: '开始',
              to: '/docs/start'
            }
          ]
        },
        {
          title: '社区',
          items: [
            {
              label: 'lvyjs',
              href: 'https://lemonade-lab.github.io/lvyjs.dev/'
            },
            {
              label: '群聊',
              href: 'https://qm.qq.com/q/aZYMNqUQc'
            },
            {
              label: '评论',
              href: 'https://github.com/lemonade-lab/alemonjs.dev/discussions'
            }
          ]
        },
        {
          title: '更多',
          items: [
            {
              label: 'alemonjs',
              href: 'https://github.com/lemonade-lab/alemonjs'
            },
            {
              label: 'vscode-extend',
              href: 'https://marketplace.visualstudio.com/items?itemName=lemonadex.alemonjs-testone'
            },
            {
              label: 'desktop',
              href: 'https://github.com/lemonade-lab/alemondesk'
            },
            {
              label: 'alemongo',
              href: 'https://github.com/lemonade-lab/alemongo'
            }
          ]
        }
      ],
      copyright: `Released under the MIT License. (dev) <br/> Copyright © 2024-present Lemonade-Lab & ALemonJS Contributors </span> <br> ${link}`
    }
  }
})
