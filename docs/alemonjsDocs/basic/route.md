---
label: '匹配路由'
sidebar_position: 2
---

# 匹配路由

## defineRouter

- 确定优先级
- 利用中间件，统一处理一类响应

- 更早的确认是否执行，方便懒加载

```ts title="src/router.ts"
import { lazy, defineRouter } from 'alemonjs'
export default defineRouter([
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

- lazy

这是一个懒加载工具函数。你可以移除，直接对响应文件进行引用

```ts title="src/router.ts"
import check from '@src/response/mw'
import myMessage from '@src/response/user-message/base/res'
export default defineRouter([
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

## response

```ts title="src/index.ts"
export default defineChildren({
  // 注册
  register() {
    return {
      // 注册响应体
      // const responseRouter = defineRouter([])
      responseRouter
    }
  },
  onCreated() {
    logger.info(`[测试机器人启动]`)
  }
})
```

## middleware

```ts title="src/index.ts"
export default defineChildren({
  register() {
    return {
      // const middlewareRouter = defineRouter([])
      middlewareRouter
    }
  },
  onCreated() {
    logger.info(`[测试机器人启动]`)
  }
})
```
