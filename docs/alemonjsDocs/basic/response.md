---
label: '响应'
sidebar_position: 1
---

# 响应

:::info

定义响应函数，处理不同类型的事件

:::

## `createEvent`

验证事件是否符合预期

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

## `onResponse`

通过 `onResponse` 绑定事件类型与处理函数

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
