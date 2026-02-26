---
label: '中间件'
sidebar_position: 6
---

# 中间件

:::info

主要分为局部中间件和全局中间件，可对指定事件类型的event进行修改并向下传递

:::

## 局部中间件

其主要遵循 响应体的 分组设计，共用一个 next

```ts title="src/response/mw.ts"
export default (event, next) => {
  console.log('step 1')
  // 允许在同组响应中，继续后续的函数
  return true
}$1
```

```ts title="src/response/res.ts"
export default (event, next) => {
  console.log('step 2')
}$2
```

最终执行 res 的打印顺序为 `step1`、`step2`

如果 response$1 不进行`return` `true`，其结果只有 `step1`

## 全局中间件

### `onMiddleware`

```ts title="src/middleware/**/*/mw.ts"
export default (event, next) => {
  // 新增字段
  event['user_id'] = event.UserId

  // 常用于兼容其他框架或增强event功能

  // 继续下一个中间件
  next()
}
```
