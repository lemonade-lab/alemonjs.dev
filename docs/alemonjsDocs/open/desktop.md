---
label: '扩展'
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
 │      │    └── index.js     // 入口文件
 │      └── package.json      // 工程配置文件
```

会读取`node_modules/pkg-name/package.json`

解析并得到`main`

以入口文件的目录为工程目录

## 服务端

### 配置

```json title="package.json"
{
  "name": "@alemonjs/test", // * 包名
  "version": "0.0.1", // * 版本号
  "author": {
    "name": "ningmengchongshui",
    "email": "ningmengchongshui@gmail.com",
    "url": "https://github.com/ningmengchongshui"
  },
  "type": "module", // * 仅支持esm
  "main": "lib/index.js", // * 包入口
  "scripts": {
    "build": "npx lvy build"
  },
  "export": {
    ".": "./lib/index.js", // * 包入口
    "./package": "./package.json" // * 包配置信息
  },
  "keywords": ["alemonjs"], // *
  "publishConfig": {
    "registry": "https://registry.npmjs.org", // *
    "access": "public" // *
  },
  "alemonjs": {
    // 应用服务器相关配置
    "web": {
      // html服务根目录。即 dist/index.html
      "root": "dist"
    }
  }
  // 要发布模块，请确保没有以下内容。
  // "private": true,
  // "workspaces": ["packages/*"]
}
```

## 桌面端

### 配置

```json title="package.json"
{
  "export": {
    "./desktop": "./lib/desktop.js" // * 桌面扩展入口脚本，固定导出
  },
  "alemonjs": {
    // 应用服务器相关配置
    "web": {
      // html服务根目录。即 dist/index.html
      "root": "dist"
    },
    // 桌面相关配置
    "desktop": {
      "logo": "public/logo.png",
      // "logo": "antd.OpenAIOutlined",
      "command": [
        {
          "name": "test",
          "icon": "public/logo.png",
          "command": "open.test" // 发送指令
        }
      ],
      "sidebars": [
        {
          "command": "open.test"
        }
      ],
      "menus": [
        {
          "command": "open.test"
        }
      ]
    }
  }
}
```

```ts
type Desktop = {
  // 应用基础LOGO
  // 支持antd图标，如 antd.OpenAIOutlined
  // https://ant.design/components/icon-cn
  logo: string
  // 指令输入框 - 窗体上方的指令输入框
  command: CommandItem[]
  // 侧边栏应用 - webview 里的 侧边栏
  sidebars: CommandItem[]
  // 菜单按钮 - 窗体的左侧导航栏
  menus: CommandItem[]
  // 控件按钮 - 窗体上方，指令输入框的两侧的控件按钮
  controls: ControlItem[]
}

type CommandItem = {
  name: string // 必要的command名
  icon: string // 图标（可选） 支持antd图标
  command: string // 要执行的指令
}

type ControlItem = {
  position: 'left' | 'right' // 位置。macos默认右边，windows/linux默认左边。
  icon: string // 图标 支持antd图标
  command: string // 要执行的指令
}
```

### 指令

注意command有2类约定前缀

#### `view.`

`view.home` 前往首页

`view.git-exp-manage` git扩展管理

`view.npm-exp-manage` npm扩展管理

`view.webview` 应用中心

`view.settings` 设置

`view.settings.about` 设置-关于

`view.settings.theme` 设置-主题

`view.settings.files` 设置-文件

`view.settings.notice` 设置-更新日志

#### `app.`

`app.open.devtools` 打开开发者工具

### 周期

```js title="desktop.js"
// 被激活的时候。
export const activate = context => {}
```

```ts title="desktop.ts"
// ts
import { Context } from '@alemonjs/process'
export const activate = (context: Context) => {}
```

### 通知推送

```js title="desktop.js"
export const activate = context => {
  context.notification('扩展加载')
}
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
  const sidebarWebView = context.createSidebarWebView(context)
  // 监听指定指令的执行
  context.onCommand('open.test', () => {
    const dir = join(__dirname, 'assets', 'index.html')
    // 确保路径存在
    const html = readFileSync(dir, 'utf-8')
    // 立即渲染 webview
    sidebarWebView.loadWebView(html)
  })
}
```

### 从webview到app

- 发送消息

```js title="index.js"
const API = createDesktopAPI()
API.postMessage({
  type: 'pong',
  data: ''
})
```

- 接收消息

```js title="desktop.js"
export const activate = context => {
  // 创建一个 webview。
  const sidebarWebView = context.createSidebarWebView(context)
  // 监听 webview 的消息。
  sidebarWebView.onMessage(data => {
    // { type: 'pong',data: ''}
  })
}
```

### 从app到webview

- 发送消息

```js title="desktop.js"
export const activate = context => {
  // 创建一个 webview。
  const sidebarWebView = context.createSidebarWebView(context)
  // 发送消息到webview。
  sidebarWebView.postMessage({
    type: 'ping',
    data: ''
  })
}
```

- 接收消息

```js title="index.js"
const API = createDesktopAPI()

API.onMessage(data => {
  //  {  type: 'ping', data: '' }
})
```

### 主题

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

> 推荐使用 `@alemonjs/react-ui` ，是一组自带主题的库

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
