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
  "type": "module" // esm
}
```

- 启动

```sh
node index.js
```

## 测试平台

- 方式1: 下载vscode并使用ALemonTestOne扩展

[`Visual Studio Code`](https://code.visualstudio.com/)

[`ALemonTestOne`](https://marketplace.visualstudio.com/items?itemName=lemonadex.alemonjs-testone)

- 方式2: 打开访问在线模式

[https://alemonjs.com/testone/](https://alemonjs.com/testone/)

```sh
yarn app
```

## 配置文件

> 以下配置都是可选的

```yaml title="alemon.config.yaml"
# 常规配置
port: 17117 # 端口，快捷参数 --port
input: 'lib/index.js' # 入口地址，快捷参数 --input
login: 'discord' # 选择登录的平台，快捷参数 --login
url: 'ws://127.0.0.1:17117' # 连接阿柠檬服务URL，快捷参数 --url
is_full_receive: false # 不全量接收消息（用于分流处理）
# 禁用设置
disabled_text_regular: '/闭关' # 设置正则，若匹配则禁用
disabled_selects: # 禁用事件。若匹配则禁用
  'private.message.create': true # 禁用私聊
disabled_user_id:
  '1715713638': true # 若匹配则禁用
disabled_user_key:
  '123456': true # 多匹配则禁用
# 重定向：把指定的文本，转为指定的内容 （禁用规则比重定向优先）
redirect_text_regular: '^#' # 识别前缀 #
redirect_text_target: '/' # 替换为 /
# 映射规则
mapping_text:
  - regular: '/开始游戏'
    target: '/踏入仙途'
# ismaster 设置
master_id:
  '1715713638': true
master_key:
  '123456': true
# bot 设置
bot_id:
  '1715713638': true # 把指定 id 视为 isBot
bot_key:
  '123456': true # 把指定bot kye 视为 isBot
# 处理器
processor:
  repeated_event_time: 60000 # 过滤掉 1分钟内出现相同 MessageId 的 event
  repeated_user_time: 1000 # 过滤掉 1秒内出现相同UserId 的 event
# 加载子模块 (支持 array 写法)
apps:
  'alemonjs-openai': true
# 模块配置, 约定。
# 模块对应的配置名，应是模块名。
alemonjs-openai:
  baseURL: 'https://api.deepseek.com'
  apiKey: ''
  model: 'deepseek-chat'
```

- 框架服务端口约定 [17100-17299]

> 17117: 框架默认端口

> 17187: WEB面板默认端口

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
