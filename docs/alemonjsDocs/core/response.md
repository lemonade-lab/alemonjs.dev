---
title: 事件处理
description: 读取当前事件，并使用 next 控制后续处理。
sidebar_position: 1
---

# 事件处理

## `useEvent`

读取当前事件和 `next` 回调。

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

`subscribe(create)` → `middleware` → `subscribe(mount)` → `response` → `subscribe(unmount)`。

在事件处理器中调用 `next()` 继续匹配，省略该调用会结束后续匹配。

### `next()`

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
