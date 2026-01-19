---
label: '匹配路由'
sidebar_position: 2
---

# 匹配路由

## defineResponse

```ts title="src/router.ts"
import { lazy } from 'alemonjs'
export default defineResponse([
  {
    // 用户验证中间件。这是局部的，仅对 children 下的响应规则生效
    handler: lazy(() => import('@src/response/mw')),
    children: [
      {
        // 匹配正则
        regular: /^(!|！|\/|#|＃)?我的信息/,
        handler: lazy(() => import('@src/response/user-message/base/res'))
      }
    ]
  }
])
```

```ts title="src/index.ts"
import response from './router.js'
export default defineChildren({
  // 注册
  register() {
    return {
      // 注册响应体
      response
    }
  },
  onCreated() {
    logger.info(`[测试机器人启动]`)
  }
})
```

- lazy

这是一个懒加载工具函数。你可以移除，直接对响应文件进行引用

```ts title="src/router.ts"
import check from '@src/response/mw'
import myMessage from '@src/response/user-message/base/res'
export default defineResponse([
  {
    handler: async () => check,
    children: [
      {
        regular: /^(!|！|\/|#|＃)?我的信息/,
        handler: async () => myMessage
      }
    ]
  }
])
```

## defineMiddleware

```ts title="src/router-mw.ts"
import { lazy } from 'alemonjs'
export default defineMiddleware([
  {
    handler: lazy(() => import('./middleware/mw'))
  }
])
```

```ts title="src/index.ts"
import middleware from './router-mw.js'
export default defineChildren({
  // 注册
  register() {
    return {
      middleware
    }
  },
  onCreated() {
    logger.info(`[测试机器人启动]`)
  }
})
```
