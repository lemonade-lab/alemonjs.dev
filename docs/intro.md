---
sidebar_position: 1
label: '简介'
---

# 简介

:::tip

[ALemonJS](https://github.com/lemonade-lab/alemonjs) ( 发音为 /əˈlemən/ ) 基于 JavaScript 所构建的聊天平台机器人开发框架

:::

在本文中，描述 ALemonJS 都称为“框架”。

框架主要通过定义响应函数来描述不同类型的事件将要执行的内容。

```ts title="Hello Word!"
import { useMessage, Format } from 'alemonjs'

export default () => {
  const [message] = useMessage()
  const format = Format.create().addText('hello word')
  message.send({ format })
}
```

## 当前推荐理解

这轮升级的重点不是再加一层新的 handler 写法，而是把运行时边界补齐了：

- 应用阶段：`onCreated`、`onMounted`、`onReady`、`onDispose`
- 事件阶段：`onEventStart`、`onEventError`、`onEventFinished`
- HTTP 阶段：`onHttpError`
- 状态观察：`onRuntimeStatusChange`
- HTTP 服务现在也进入了运行时生命周期边界
- 事件统一字段补齐了 `IsPrivate`、`IsAtMe`、发送状态字段，以及 `useRoute()`

## 推荐继续阅读

- [生命周期](/docs/alemonjsDocs/core/cycle)
- [接口路由](/docs/alemonjsDocs/http/route)
- [事件类型](/docs/alemonjsDocs/core/message-type)

## 现在推荐的开发心智

- 应用初始化与销毁：优先围绕 `onReady` / `onDispose`
- 单次事件的开始、错误和收口：围绕事件回调处理
- HTTP 服务：新项目优先使用 `koaRouter` 显式注册
- 统一字段与路由上下文：优先读取 `IsPrivate`、`IsAtMe`、`useRoute()`，不要直接依赖内部字段
