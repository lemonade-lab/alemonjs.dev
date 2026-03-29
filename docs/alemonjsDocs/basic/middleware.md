---
label: '中间件'
sidebar_position: 6
---

# 中间件

:::info

主要分为局部中间件和全局中间件，可对指定事件类型的 event 进行修改并向下传递

:::

## 局部中间件

在 `defineRouter` 中通过分组实现。handler 返回 `true` 则允许继续执行 children 中的后续响应

```ts title="src/response/mw.ts"
export default (event, next) => {
  console.log('step 1')
  // 返回 true 允许 children 中的后续函数执行
  return true
}
```

```ts title="src/response/res.ts"
export default (event, next) => {
  console.log('step 2')
}
```

最终执行 res 的打印顺序为 `step1`、`step2`

如果中间件不 `return true`，其结果只有 `step1`

## 全局中间件

### `onMiddleware`

使用 `onMiddleware` 定义全局中间件，需指定事件类型

```ts title="src/middleware/**/*/mw.ts"
import { onMiddleware } from 'alemonjs'
export default onMiddleware('message.create', (event, next) => {
  // 新增字段
  event['user_id'] = event.UserId

  // 常用于兼容其他框架或增强 event 功能

  // 继续下一个中间件
  next()
})
```
