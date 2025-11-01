import { themes as prismThemes } from 'prism-react-renderer'
import type { Config } from '@docusaurus/types'
import type * as Preset from '@docusaurus/preset-classic'
import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin'

/**
 *
 * @param config
 * @returns
 */
const defineConfig = (config: Config) => config

const number = '津ICP备2023004480号'
const link = `<a  href="https://beian.miit.gov.cn/" target="_blank">${number}</a>`

export default defineConfig({
  title: 'ALemonJS',
  tagline:
    '阿柠檬，基于 JavaScript 所构建的聊天平台机器人开发框架',
  url: 'https://alemonjs.com',
  baseUrl: '/',
  organizationName: 'lemonade-lab',
  projectName: 'alemonjs-docs',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  i18n: {
    defaultLocale: 'zh-CN',
    // locales: ['zh-CN', 'en'],
    locales: ['zh-CN'],
    localeConfigs: {
      'zh-CN': {
        label: '简体中文',
        // direction: 'ltr',
        htmlLang: 'zh-CN',
        path: './zh-CN/'
        // ... other locales you want to support
      }
      // 'en': {
      //   label: 'English',
      //   direction: 'ltr',
      //   htmlLang: 'en-US',
      //   path: './en/'
      // }
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl:
            'https://github.com/lemonade-lab/alemonjs-docs'
        },
        theme: {
          customCss: './src/css/custom.css'
        }
      } satisfies Preset.Options
    ]
  ],
  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    navbar: {
      // title: 'ALemonJS',
      logo: {
        alt: 'ALemonJS Logo',
        src: 'img/alemon.png'
      },
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
        }, // or position: 'right'
        {
          position: 'right',
          label: '编辑',
          href: 'https://github.com/lemonade-lab/alemonjs-docs/blob/main/docs/intro.md'
        }
        // {
        //   position: 'right',
        //   type: 'localeDropdown'
        // }
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
              href: 'https://lvyjs.dev'
            },
            {
              label: '群聊',
              href: 'https://qm.qq.com/q/aZYMNqUQc'
            },
            {
              label: '评论',
              href: 'https://github.com/lemonade-lab/alemonjs-docs/discussions'
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
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula
    }
  } satisfies Preset.ThemeConfig,
  themes: [
    [
      require.resolve(
        '@easyops-cn/docusaurus-search-local'
      ),
      /** @type {import("@easyops-cn/docusaurus-search-local").PluginOptions} */
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        hashed: true,
        // language: ['en', 'zh'],
        language: ['zh'],
        searchResultLimits: 10,
        searchResultContextMaxLength: 50
      }
    ]
  ],
  stylesheets: [],
  plugins: [
    // function monacoPlugin(context, options) {
    //   return {
    //     name: 'monaco-editor-plugin',
    //     configureWebpack(config, isServer, utils) {
    //       // 只在客户端构建时添加 Monaco Editor
    //       if (!isServer) {
    //         return {
    //           plugins: [
    //             new MonacoWebpackPlugin({
    //               languages: [
    //                 'javascript',
    //                 'typescript',
    //                 'json',
    //                 'markdown'
    //               ]
    //             })
    //           ]
    //         }
    //       }
    //       // 服务端渲染时返回空配置
    //       return {}
    //     }
    //   }
    // }
  ]
})
