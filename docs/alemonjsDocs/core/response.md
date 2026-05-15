---
label: '响应事件'
sidebar_position: 1
---

# 响应事件

## `useEvent`

安全的读取 event 和 next

```ts
import { useEvent } from 'alemonjs'
export default () => {
  const [event, next] = useEvent({
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

## 执行周期

中间件之前 subscribe(create) >

中间件时 middleware >

中间件之后/响应之前 subscribe(mount) >

响应时 response >

响应之后 subscribe(unmount)

不执行next()表示结束后续匹配。

### `Next(Bool)`

```ts
import { useEvent } from 'alemonjs'
export default () => {
  const [_, next] = useEvent({})
  // 当前周期中进行
  next()
  // 下一个周期中进行
  next(true)
  // 下下个周期中进行
  next(true, true)
  // 以此类推
}
```
