---
sidebar_position: 2
show_giscus: 1
---

# 快速开始

:::tip

本文默认你已经了解并熟悉NodeJS编程，

如果你对NodeJS的部署和配置不熟悉，

同时也对JavaScript主流的打包工具不熟悉，

请前往[https://lvyjs.dev](https://lvyjs.dev/)了解

:::

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## 初始化

<Tabs>
  <TabItem value="0" label="npmjs" default>
   
```sh title="文档统一采用yarn依赖工具"
npm install yarn -g 
```

  </TabItem>

  <TabItem value="1" label="npmmirror">
 
```sh title="文档统一采用yarn依赖工具"
npm install yarn -g --registry=https://registry.npmmirror.com
```

```sh
npm init -y
yarn add alemonjs --registry=https://registry.npmmirror.com
```

  </TabItem>
</Tabs>

## 运行示例

```js title="index.js"
import { start } from 'alemonjs'
start()
```

```js title="lib/index.js"
export default defineChildren({
  onCreated() {
    logger.info('启动应用')
  }
})
```

```json title="package.json"
{
  // 确保文件拥有以下内容
  "main": "lib/index.js", // 入口文件
  "type": "module",
  "scripts": {
    "app": "node index.js" // 启动脚本
  }
}
```

- 启动

```sh
yarn app
```

## 测试平台

- 方式1: 下载vscode并使用ALemonTestOne扩展

[`Visual Studio Code`](https://code.visualstudio.com/)

[`ALemonTestOne`](https://marketplace.visualstudio.com/items?itemName=lemonadex.alemonjs-testone)

- 方式2: 打开访问在线模式

[htts://alemonjs.com/testone/](https://alemonjs.com/testone/)

```sh
yarn app
```

## 配置文件

```yaml title="alemon.config.yaml"
port: 17117 # 端口，快捷参数 --port
input: 'lib/index.js' # 入口地址，快捷参数 --input
# login: 'discord' # 选择登录的平台，快捷参数 --login
# 可连接 另一个 alemonjs 服务，并全量接收消息
# url: 'ws://127.0.0.1:17117' # 连接URL，快捷参数 --url
# 不全量接收消息（用于分流处理，需确保连接端拥有相同的处理能力）
# is_full_receive: false
# 加载模块, 具体见文档后续内容
# apps:
#  - 'alemonjs-openai'
# 模块配置, 约定。模块对应的配置名，应是模块名。
# alemonjs-openai
#   baseURL: 'https://api.deepseek.com'
#   apiKey: ''
#   model: 'deepseek-chat'
```

- 框架服务端口约定 [17100-17299]

> 17117: 框架默认端口

> 17187: WEB面板默认端口

- 框架应用端口约定 [18100-18999]

## 环境变量

```ts
namespace NodeJS {
  interface ProcessEnv {
    login?: string
    platform?: string
    port?: string
    // development 模式下。可查看 logger.debug 记录
    NODE_ENV?: 'development' | 'production'
  }
}
```

## 对TS的支持

推荐 使用lvyjs开发构建工具，以支持ts环境

请前往[https://lvyjs.dev](https://lvyjs.dev/)了解
