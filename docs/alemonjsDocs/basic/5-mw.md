---
sidebar_position: 5
---

# 中间件

:::info

对指定事件类型的event进行修改并向下传递

:::

### `onMiddleware`

```ts title="src/middleware/**/*/mw.ts"
const selects = onSelects(['message.create'])
// 仅限 # 和 / 开头的消息才执行该中间件
// export const regular = /^(#|\/)/
// OnMiddleware((事件体,控制体)=>消息体,消息类型)
export default onMiddleware(selects, (event, next) => {
  // 新增字段
  event['user_id'] = event.UserId

  // 常用于兼容其他框架或增强event功能
  next()
})
```

:::info 事件周期顺序

subscribe(create) >

middleware >

subscribe(observer/mount) >

response >

subscribe(unmount)

不执行next()表示结束后续匹配。

:::

## `Next(Bool)`

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
