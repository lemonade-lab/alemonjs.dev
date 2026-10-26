---
title: 全局实例
description: 访问日志、响应、中间件、订阅状态和应用实例。
sidebar_position: 3
---

# 全局实例

:::tip

以下实例用于访问日志、路由索引、订阅状态和应用。

:::

```ts
import { Logger, logger as log } from 'alemonjs'
const logger = new Logger().value // 同 logger as log
```

```ts
import { Response } from 'alemonjs'
// 内部所有的res索引
const res = new Response().value
```

```ts
import { Middleware } from 'alemonjs'
// 内部所有的mws索引
const res = new Middleware().value
```

```ts
import { SubscribeList } from 'alemonjs'
// 所有的 create + message.create 订阅
// 即 onSubscribe
const subscribeList = new SubscribeList('create', 'message.create').value
// const subscribeList = new SubscribeList('mount', 'message.create').value
// const subscribeList = new SubscribeList('unmount', 'message.create').value
```

```ts
import { StateSubscribe } from 'alemonjs'
const stateList = new StateSubscribe('main:res:name')
const callback = (value: boolean) => {
  //
}
stateList.on(callback) // 订阅状态变更
stateList.un(callback) // 取消订阅
const stateSubscribe = stateList.value
```

```ts
import { State } from 'alemonjs'
// @deprecated 废弃。指令管理可直接配置禁用正则
// 即 useState
const stateList = new State('main:res:name') // new State('main:apps:name')
stateList.value = true // 设置为 true
stateList.value = false // 设置为 false
```

```ts
import { ChildrenApp } from 'alemonjs'
// 默认 main。
// 得到内部res、mw、周期等
const app = new ChildrenApp('main')?.value
```
