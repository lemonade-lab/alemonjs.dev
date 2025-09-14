---
sidebar_position: 2
---

# 接口

:::info

捕获事件后可进行的

:::

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `useMessage`

> 在响应事件（如消息被创建）时，发送消息。

```ts title="src/response/**/*/res.ts"
import { Text, useMessage } from 'alemonjs'
const selects = onSelects(['message.create'])
export default onResponse(selects, (event, next) => {
  // 创建
  const [message] = useMessage(event)
  message.send(format(Text('hello word !')))
})
```

```ts title="src/response/**/*/res.ts"
import { Text } from 'alemonjs'
const selects = onSelects(['message.create'])
export default onResponse(selects, () => {
  return {
    // 即将要发送的数据
    data: format(Text('hello word !'))
  }
})
```

> 需要注意的是。虽然参数支持任何数量的forma参数。

> 但send会对数据保持单一消息原则。

> 即，不能合并在一起的数据，只会发送最近的一个。

> 如：多个Image。只会发送第一张。而多个Text则会合并。Image+Text会一起发送。（受限于平台）

> 如果想自由发送图片和文字,并配合按钮使用。需要使用 Markdown。

## `useMention`

> 解析得到被提及的数据

```ts title="response/**/*/res.ts"
import { useMention } from 'alemonjs'
const selects = onSelects(['message.create'])
export default onResponse(selects, async (event, next) => {
  const [mention] = useMention(event)
  // 查找用户类型的 @ 提及，且不是 bot
  const user = await mention.findOne()
  if (!user) {
    return // 未找到用户Id
  }

  console.log('User:', user)

  // 处理被AT的用户...
})
```

## `useSubscribe`

> 订阅模式，在某个事件周期中进行观察

> ! 不可以在 回调中调用 subscribe.cancel(sub)

<Tabs>
  <TabItem value="0" label="V2.1+" default>

```ts title="response/**/*/res.ts"
import { Text, useMessage, useSubscribe } from 'alemonjs'
export const regular = /^(#|\/)?login$/
const selects = onSelects([
  'message.create',
  'private.message.create'
])
export default onResponse(selects, event => {
  const [message] = useMessage(event)
  const [subscribe] = useSubscribe(event, selects)

  message.send(format(Text('请输入密码'), Text('123456')))

  // 订阅 res 挂载之前的
  const sub = subscribe.mount(
    (event, next) => {
      // 创建
      const [message] = useMessage(event)
      // 获取文本
      const text = event.MessageText
      // 检查
      if (text === '123456') {
        message.send(format(Text('密码正确')))
        clearTimeout(timeout)
      } else if (text == '/close') {
        message.send(format(Text('取消登录')))
        clearTimeout(timeout)
      } else {
        message.send(format(Text('密码不正确')))
        // 继续
        next()
      }
      // 回调内不可调用 subscribe.cancel(sub)
    },
    ['UserId']
  )

  const timeout = setTimeout(() => {
    // 取消订阅
    subscribe.cancel(sub)
    // 发送消息
    message.send(format(Text('登录超时')))
  }, 1000 * 10)
})
```

```ts title="response/**/*/res.ts"
import { useSubscribe } from 'alemonjs'

const selects = onSelects(['message.create'])

const res$1 = onResponse(selects, (event, next) => {
  // 创建
})

const res$2 = onResponse(selects, (event, next) => {
  // 响应之前
})

const res$3 = onResponse(selects, (event, next) => {
  // 响应之后
})

export default onResponse(selects, (event, next) => {
  const [subscribe] = useSubscribe(event, selects)
  subscribe.create(res$1.current, [])
  subscribe.mount(res$2.current, [])
  subscribe.unmount(res$3.current, [])
})
```

```ts title="middleware/**/*/res.ts"
import { Text, useMessage, useSubscribe } from 'alemonjs'
export const regular = /^(#|\/)?login$/
const selects = onSelects([
  'message.create',
  'private.message.create'
])
export default onResponse(selects, event => {
  const [message] = useMessage(event)
  const [subscribe] = useSubscribe(event, selects)

  message.send(format(Text('请输入密码'), Text('123456')))

  // 订阅 res 挂载之前的
  const sub = subscribe.mount(
    (event, next) => {
      // 创建
      const [message] = useMessage(event)
      // 获取文本
      const text = event.MessageText
      // 检查
      if (text === '123456') {
        message.send(format(Text('密码正确')))
        clearTimeout(timeout)
      } else if (text == '/close') {
        message.send(format(Text('取消登录')))
        clearTimeout(timeout)
      } else {
        message.send(format(Text('密码不正确')))
        // 继续
        next()
      }
    },
    ['UserId']
  )

  const timeout = setTimeout(() => {
    // 取消订阅
    subscribe.cancel(sub)
    // 发送消息
    message.send(format(Text('登录超时')))
  }, 1000 * 10)
})
```

  </TabItem>
  <TabItem value="1" label="V2.0+" >

```ts title="response/**/*/res.ts"
// [创建之后，响应之前，响应之后]
const [create, monut, unmonut] = useSubscribe(event, <select event type>)
create(Res.current, [])
monut(Res.current, []) // const monut = useObserver(event, <select event type>)
unmonut(Res.current, [])
```

  </TabItem>
</Tabs>

## `useState`

:::warning

已废弃

:::

> 声明res/mw的状态,可用于管理是否启用

> 命名规则 子应用名:response:文件夹1:文件夹2...

> 如默认main为： main:response:login

> 响应文件夹由`apps（旧版本）`命名为`response`

<Tabs>
  <TabItem value="0" label="停用" default>

```ts title="response/**/*/res.ts"
import { Text, useMessage, useState } from 'alemonjs'
import { createRequire } from 'module'
export const regular = /^(#|\/)?close:/
const selects = onSelects([
  'message.create',
  'private.message.create'
])
const requre = createRequire(import.meta.url)
const pkg = requre('../../../package.json') as {
  name: string
}
export default onResponse(selects, (event, next) => {
  if (!event.IsMaster) {
    return
  }
  const name = event.MessageText.replace(regular, '')
  if (!new RegExp(`^${pkg.name}:`).test(name)) {
    return
  }
  const [state, setState] = useState(name)
  if (!state) {
    next()
    return
  }
  setState(false)
  const [message] = useMessage(event)
  message.send(format(Text('关闭成功')))
  return
})
```

  </TabItem>

  <TabItem value="1" label="启用" >

```ts title="response/**/*/res.ts"
import { Text, useMessage, useState } from 'alemonjs'
import { createRequire } from 'module'
export const regular = /^(#|\/)?open:/
const selects = onSelects([
  'message.create',
  'private.message.create'
])
const requre = createRequire(import.meta.url)
const pkg = requre('../../../../package.json') as {
  name: string
}
export default onResponse(selects, (event, next) => {
  if (!event.IsMaster) {
    return
  }
  const name = event.MessageText.replace(regular, '')
  if (!new RegExp(`^${pkg.name}:`).test(name)) {
    return
  }
  const [state, setState] = useState(name)
  if (state) {
    next()
    return
  }
  setState(true)
  const [message] = useMessage(event)
  message.send(format(Text('开启成功')))
  return
})
```

  </TabItem>

</Tabs>

> 可以在任意地方订阅状态的更改。

```ts title="response/**/*/res.ts"
import { onState, unState } from 'alemonjs'

const key = 'main:response:login'

const state = (val: boolean) => {
  // 订阅 key 的状态变化
}

onState(key, state)
unState(key, state)
```
