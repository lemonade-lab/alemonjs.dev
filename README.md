# A LemonX 官方文档站

![A LemonX](https://alemonjs.com/me.png)

A LemonJS 与 A LemonX 生态的官方文档站源码。这里集中维护框架文档、工作站文档、扩展能力说明、版本记录和相关开发资料。

在线访问：[alemonjs.com](https://alemonjs.com/)

## 项目定位

本仓库不是单纯的 Markdown 文件集合，而是一套可构建、可扩展、可自动部署的文档平台：

- 使用 React、TypeScript 和 Vite 构建站点
- 使用 Markdown / MDX 编写文档和博客
- 自动扫描文档并生成路由、侧边栏和搜索内容
- 支持代码高亮、提示框、PWA 和响应式布局
- 同时承载 A LemonJS 与 A LemonX 两套文档体系
- 内容合并后自动构建并发布到官方网站

## 文档体系

| 区域                                                                           | 内容                                    |
| ------------------------------------------------------------------------------ | --------------------------------------- |
| [A LemonJS 文档](https://alemonjs.com/docs/alemonjsDocs/getting-started/intro) | 路由、消息、响应、Hook、平台适配和模块  |
| [A LemonX 文档](https://alemonjs.com/docs/alemonx/getting-started/quick-start) | 项目管理、运行时、Agent、插件和 WebView |
| [扩展与应用](https://alemonjs.com/docs/apps)                                   | 插件、共同模块和工作站扩展              |
| [博客与更新](https://alemonjs.com/blog)                                        | 版本记录、技术文章和项目动态            |

## 技术栈

- React 19 + TypeScript
- Vite 7
- Markdown / MDX
- React Router
- Tailwind CSS
- Vitest、ESLint、Prettier
- PWA、Gzip / Brotli 静态资源压缩

## 仓库结构

```text
.
├── docs/                 # 文档内容
│   ├── alemonjsDocs/     # A LemonJS 框架文档
│   └── alemonx/          # A LemonX 工作站文档
├── blog/                 # 博客与版本更新
├── src/                  # 文档站前端
│   ├── components/       # 通用组件与 MDX 组件
│   ├── layouts/          # 页面布局
│   ├── pages/            # 首页、博客等页面
│   ├── utils/            # 搜索、路由和文档处理
│   └── router.tsx        # 自动生成的站点路由
├── freeWind/             # 文档扫描、构建和 MDX 扩展能力
├── public/               # 图标与静态资源
├── freeWind.config.ts    # 站点主题和导航配置
└── vite.config.ts        # 构建配置
```

## 本地开发

需要 Node.js 和 Yarn。安装依赖：

```bash
yarn install
```

启动开发服务器：

```bash
yarn dev
```

执行生产构建和本地预览：

```bash
yarn build:static
yarn preview
```

`yarn build:static` 会依次生成客户端资源、服务端渲染 bundle，以及首页、文档和博客的目录式 `index.html`。也可以拆开执行：

```bash
yarn check-content
yarn build:client
yarn build:server
yarn prerender
yarn validate-static
```

Nginx 建议优先返回真实文件或目录，再回退到 SPA 入口：

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

HTML 使用短缓存或 `no-cache`；带 hash 的 JS、CSS 和图片可使用长期 `immutable` 缓存；`sitemap.xml`、`rss.xml` 和 `robots.txt` 建议短缓存。

运行质量检查：

```bash
yarn lint
yarn test
yarn check-format
```

## 编辑文档

文档内容主要位于 `docs/`，博客内容位于 `blog/`。支持 `.md` 和 `.mdx` 文件，并通过 Front Matter 配置标题、描述和侧边栏顺序：

```md
---
title: 页面标题
description: 页面简介
sidebar_position: 1
---

# 页面标题
```

开发模式下修改文档即可查看结果。构建时，文档扫描器会根据目录和元数据生成对应的页面路由与导航结构。

## 贡献流程

欢迎参与文档建设：

1. 修正文档错误或补充内容；
2. 在本地运行开发服务器检查页面；
3. 执行 `yarn lint`、`yarn test` 和格式检查；
4. 提交 Pull Request，并在描述中说明修改范围。

合并后的内容会通过自动化流程构建并部署到 [alemonjs.com](https://alemonjs.com/)。通常在合并完成后数分钟内生效。

## 相关项目

- [A LemonJS](https://github.com/lemonade-lab/alemonjs)：聊天平台机器人开发框架
- [A LemonX](https://github.com/lemonade-lab/alemonx)：创建、运行和管理机器人项目的工作站

## 许可证

本项目使用 [MIT License](./LICENSE)。
