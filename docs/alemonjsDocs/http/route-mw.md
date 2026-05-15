---
label: '路由中间件'
sidebar_position: 8
---

# 路由中间件

:::tip

当前推荐把 HTTP 中间件直接挂到 `koaRouter` 上管理，而不是依赖隐式目录约定。

:::

## 基础写法

```ts title="src/index.ts"
import KoaRouter from 'koa-router'
import { defineChildren } from 'alemonjs'

const router = new KoaRouter({ prefix: '/demo' })

router.use(async (ctx, next) => {
  ctx.state.requestId = crypto.randomUUID()
  await next()
})

router.get('/ping', ctx => {
  ctx.body = {
    code: 200,
    requestId: ctx.state.requestId,
    message: 'pong'
  }
})

export default defineChildren({
  register() {
    return {
      koaRouter: router
    }
  }
})
```

## 解析 Body

可以直接使用 Koa 生态中间件，例如 `koa-bodyparser`：

```ts title="src/index.ts"
import KoaRouter from 'koa-router'
import bodyParser from 'koa-bodyparser'
import { defineChildren } from 'alemonjs'

const router = new KoaRouter({ prefix: '/demo' })

router.use(bodyParser())

router.post('/echo', ctx => {
  ctx.body = {
    code: 200,
    data: ctx.request.body
  }
})

export default defineChildren({
  register() {
    return {
      koaRouter: router
    }
  }
})
```

## 按前缀拆分

如果一个应用里有多组 HTTP 能力，建议拆成多个 router：

```ts
const apiRouter = new KoaRouter({ prefix: '/api' })
const adminRouter = new KoaRouter({ prefix: '/admin' })

adminRouter.use(async (ctx, next) => {
  // 管理侧鉴权
  await next()
})

export default defineChildren({
  register() {
    return {
      koaRouter: [apiRouter, adminRouter]
    }
  }
})
```

## 推荐理解

- 中间件跟着显式注册的 `koaRouter` 走
- 权限、审计、Body 解析都尽量显式挂载
- 不依赖隐式目录规则，边界会更清楚
