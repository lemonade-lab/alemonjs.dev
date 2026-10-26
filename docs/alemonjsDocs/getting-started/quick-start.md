---
title: 编写指令
description: 在开发模板中注册 /hello 指令并验证回复。
sidebar_position: 3
---

# 编写指令

目标是让机器人收到 `/hello` 后回复 `Hello!`。示例使用开发模板中的应用入口、路由和响应函数。

## 1. 创建开发项目

先按 [创建项目](/docs/alemonjsDocs/getting-started/install) 创建项目并安装依赖。以下示例使用 TypeScript 模板中的 `src` 目录；已有项目请保留原来的入口和路由，将示例合并进去。

## 2. 编写响应

创建 `src/response/hello.ts`：

```ts
import { Format, useMessage } from 'alemonjs'

export default async () => {
  const [message] = useMessage()
  await message.send({ format: Format.create().addText('Hello!') })
}
```

`useMessage()` 在响应上下文中获取消息操作能力，`Format` 负责构造消息。更多写法见 [Hooks](/docs/alemonjsDocs/core/hook) 和 [消息格式](/docs/alemonjsDocs/core/data-type)。

## 3. 注册路由

在 `src/router.ts` 中定义或追加这条规则：

```ts
import { defineRouter, lazy } from 'alemonjs'

export default defineRouter([
  {
    regular: /^\/hello$/,
    handler: lazy(() => import('./response/hello'))
  }
])
```

在模板的应用入口 `src/index.ts` 中，通过 `register()` 返回 `responseRouter`：

```ts
import { defineChildren } from 'alemonjs'
import responseRouter from './router'

export default defineChildren({
  register() {
    return { responseRouter }
  }
})
```

已有入口中如果还有生命周期或其他注册项，保留它们。该文件是应用入口；框架启动入口与构建方式继续沿用模板的配置。路由细节见 [路由匹配](/docs/alemonjsDocs/core/router)。

## 4. 启动并发送消息

按模板 README 和 `package.json` 中的脚本启动项目，或使用工作台的 [运行与日志](/docs/alemonx/use/runtime/run-and-monitor)。运行编译产物的项目需先按模板脚本重新构建。

完成 [连接平台](/docs/alemonjsDocs/getting-started/connect-platform)，发送 `/hello`，预期收到 `Hello!`。

## 5. 验证与排错

依次确认：启动入口加载了应用、应用注册了路由、消息进入框架、输入匹配 `/hello`、发送操作成功。前置中间件若终止了分发，响应不会被执行，见 [事件处理](/docs/alemonjsDocs/core/response)。

仍然没有回复时，按 [消息排查](/docs/help/messages) 检查。成功后使用 [开发概览](/docs/alemonjsDocs/overview) 选择下一个主题。
