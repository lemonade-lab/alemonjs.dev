---
label: '实例对象'
sidebar_position: 3
---

# 实例对象

:::tip

内部开放的，对全局有影响的实例对象

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
const stateList = new StateSubscribe('create', 'message.create')
const callback = () => {
  //
}
stateList.on(callback) // onState
stateList.un(callback) // unState
const stateSubscribe = stateList.value
```

```ts
import { State } from 'alemonjs'
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
