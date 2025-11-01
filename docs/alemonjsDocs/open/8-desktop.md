---
sidebar_position: 7
---

# 扩展

:::info

如何开发扩展并推送到npmjs
:::

## 如何识别的

```shell title="大致的目录结构"
node_modules/                 // Node.js 依赖包
 ├── pkg-name                 // 相关模块
 │      ├── lib/              // 工程目录
 │      │    ├── response/        // 应用
 │      │    ├── middleware/  // 中间件
 │      │    └── index.js     // 入口文件
 │      └── package.json      // 工程配置文件
```

会读取`node_modules/pkg-name/package.json`

解析并得到`main`

以入口文件的目录为工程目录

## 配置

```json title="package.json"
{
  // 官方 @alemonjs/XXX
  // 三方 alemonjs-XXX
  "name": "@alemonjs/test", // *
  "version": "0.0.1", // *
  "author": {
    "name": "ningmengchongshui",
    "email": "ningmengchongshui@gmail.com",
    "url": "https://github.com/ningmengchongshui"
  },
  "type": "module", // *
  "main": "lib/index.js", // *
  "scripts": {
    "build": "npx lvy build"
  },
  "export": {
    ".": "./lib/index.js", // *
    "./package": "./package.json" // *
  },
  "keywords": ["alemonjs"], // *
  "publishConfig": {
    "registry": "https://registry.npmjs.org", // *
    "access": "public" // *
  },
  "alemonjs": {
    // alemonjs 相关配置，依赖于 package 导出进行读取
  }
  // 要发布模块，请确保没有以下内容。
  // "private": true,
  // "workspaces": ["packages/*"]
}
```

## 桌面

### 配置

```json title="package.json"
{
  "export": {
    "./desktop": "./lib/desktop.js" // 桌面扩展入口脚本
  },
  "alemonjs": {
    "desktop": {
      // 图标（可选）
      // 支持antd图标，如 antd.OpenAIOutlined
      // https://ant.design/components/icon-cn
      "logo": "public/logo.png",
      // 指令输入框
      "command": [
        {
          "name": "test",
          // 图标（可选）支持antd图标
          "icon": "public/logo.png",
          "command": "open.test" // 发送指令
        }
      ],
      // 侧边栏
      "sidebars": [
        {
          // 无图标则显示
          "name": "test",
          // 图标（可选） 支持antd图标
          "icon": "public/logo.png",
          "command": "open.test" // 发送指令
        }
      ],
      // 平台（拥有此配置将无法被添加至config.value.apps）
      "platform": [
        {
          "name": "test" // --login test
        }
      ]
    }
  }
}
```

### 周期

```js title="package.js"
// 被激活的时候。
export const activate = context => {}
```

### 渲染

```js title="desktop.js"
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
// 当前目录
const __dirname = dirname(fileURLToPath(import.meta.url))
export const activate = context => {
  // 创建一个 webview。
  const sidebarWebView =
    context.createSidebarWebView(context)
  // 当命令被触发的时候。
  context.onCommand('open.test', () => {
    const dir = join(__dirname, 'assets', 'index.html')
    // 确保路径存在
    const html = readFileSync(dir, 'utf-8')
    // 立即渲染 webview
    sidebarWebView.loadWebView(html)
  })
}
```

- 接收消息

```js title="desktop.js"
export const activate = context => {
  // 创建一个 webview。
  const sidebarWebView =
    context.createSidebarWebView(context)
  // 监听 webview 的消息。
  sidebarWebView.onMessage(data => {
    // { type: 'pong',data: ''}
  })
}
```

- 发送消息

```js title="desktop.js"
export const activate = context => {
  // 创建一个 webview。
  const sidebarWebView =
    context.createSidebarWebView(context)
  // 发送消息到webview。
  sidebarWebView.postMessage({
    type: 'ping',
    data: ''
  })
}
```

- 主题变量

```css
:root {
  --alemonjs-primary-bg: #3498db;
  /* 
    内置一套以--alemonjs开头的主题变量，
    更多变量请在桌面的主题配置中查看。
  */
}
```

### 脚本

- 发送消息

```js title="index.js"
const API = createDesktopAPI()

API.postMessage({
  type: 'pong',
  data: ''
})
```

- 接收消息

```js title="index.js"
const API = createDesktopAPI()

API.onMessage(data => {
  //  {  type: 'ping', data: '' }
})
```

### 资源路径

```js title="desktop.js"
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
// 当前目录
const __dirname = dirname(fileURLToPath(import.meta.url))
export const activate = context => {
  // 创建 webview 路径
  const styleUri = context.createExtensionDir(
    join(__dirname, 'assets', 'index.css')
  )
  const scriptUri = context.createExtensionDir(
    join(__dirname, 'assets', 'index.js')
  )
  // 可替换 html 内部资源，确保正确加载
}
```

### 通知推送

```js title="desktop.js"
export const activate = context => {
  context.notification('扩展加载')
}
```
