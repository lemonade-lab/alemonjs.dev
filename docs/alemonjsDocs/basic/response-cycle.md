---
label: '执行周期'
sidebar_position: 4
---

# 执行周期

中间件之前 subscribe(create) >

中间件时 middleware >

中间件之后/响应之前 subscribe(observer/mount) >

响应时 response >

响应之后 subscribe(unmount)

不执行next()表示结束后续匹配。

### `Next(Bool)`

```ts
const current = async (event, next) => {
  // 当前周期中进行
  next()
  // 下一个周期中进行
  next(true)
  // 下下个周期中进行
  next(true, true)
  // 以此类推
}
```
