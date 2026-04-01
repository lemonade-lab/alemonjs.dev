---
label: '响应事件'
sidebar_position: 1
---

# 响应响应事件

## `useEvent`

安全的读取event

```ts
import { useEvent } from 'alemonjs'
export default (_, next) => {
  const [event] = useEvent({
    selects: ['message.create'],
    regular: /hello/ // 可选，正则匹配
  })
  // 匹配结果为布尔值
  if (!event.match.selects || !event.match.regular) {
    next()
    return
  }
  // 匹配成功，通过 event.current 访问事件对象
  // 通过 event.value 访问原始数据
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
