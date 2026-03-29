---
label: '响应'
sidebar_position: 1
---

# 响应

:::info

定义响应函数，处理不同类型的事件

:::

## `onResponse`

推荐的响应定义方式，通过 `onResponse` 绑定事件类型与处理函数

```ts title="src/response/**/*/res.ts"
import { onResponse, useMessage, Format } from 'alemonjs'
export default onResponse('message.create', (event, next) => {
  const [message] = useMessage(event)
  const format = Format.create().addText('hello word')
  message.send({ format })
})
```

支持同时监听多个事件类型：

```ts
import { onResponse, useMessage, Format } from 'alemonjs'
export default onResponse(
  ['message.create', 'private.message.create'],
  (event, next) => {
    const [message] = useMessage(event)
    message.send({ format: Format.create().addText('收到消息') })
  }
)
```

## `createEvent`

在不使用 `onResponse` 的场景下，可用 `createEvent` 手动验证事件是否符合预期

```ts
import { createEvent } from 'alemonjs'
export default (e, next) => {
  const event = createEvent({
    event: e,
    selects: ['message.create'],
    regular: /hello/, // 可选，正则匹配
    prefix: '/', // 可选，前缀匹配
    exact: '/hello' // 可选，精确匹配
  })
  // 匹配结果为布尔值
  if (!event.selects || !event.regular) {
    next()
    return
  }
  // 匹配成功，处理事件...
}
```
