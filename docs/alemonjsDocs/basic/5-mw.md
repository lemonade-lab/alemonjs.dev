---
sidebar_position: 5
---

# 中间件

:::info

主要分为局部中间件和全局中间件，可对指定事件类型的event进行修改并向下传递

:::

## 局部中间件

其主要遵循 响应体的 分组设计，共用一个 next

当想要让指定目录下的所有响应都必须经过指定的局部中间件时，只需要在对应的目录定义`mw.ts`文件

```ts title="src/response/mw.ts"
const selects = onSelects(['message.create'])
const response$1 = onResponse(selects, (event, next) => {
  console.log('step 1')
  // 允许在同组响应中，继续后续的函数
  return true
})
export default response$1
```

```ts title="src/response/res.ts"
const selects = onSelects(['message.create'])

const response$2 = onResponse(selects, (event, next) => {
  console.log('step 2')
})

export default response$2
```

最终执行 res 的打印顺序为 `step1`、`step2`

如果 response$1 不进行`return` `true`，其结果只有 `step1`

## 全局中间件

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
