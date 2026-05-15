---
label: '中间件路由'
sidebar_position: 7
---

# 中间件路由

:::tip

你将了解如何配置中间件，更有效的管理你的服务

:::

## 中间件定义

为/api/路由下的所有接口加中间件

`/app/api/_middleware`

```ts title="src/route/api/_middleware.ts"
const myCombinedMiddleware = () => {
  return async (ctx, next) => {
    // 你自己的逻辑
    ctx.state.myCustomThing = 'xxx'

    // 继续走后面的中间件
    await next()
  }
}

export default myCombinedMiddleware
```

为某路由下加中间件，只需要新增 \_middleware.ts 文件

## 解析Body

可以直接使用 koa 生态，加载中间件

`/app/api/_middleware`

```ts title="src/route/api/_middleware.ts"
import bodyParser from 'koa-bodyparser'
export default bodyParser()
```
