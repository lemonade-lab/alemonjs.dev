---
label: '匹配路由'
sidebar_position: 2
---

# 匹配路由

## defineRouter

```ts title="src/router.ts"
import { lazy, defineRouter } from 'alemonjs'
// 1、确定优先级，检查从数组index=0开始，依次检查 children。直到发现 children 为 undefined
// 2、可统一对要匹配的 后续index及其children进行处理
// 3、通过配置更明确的匹配规则，提高执行效率
// 4、利用懒加载提高初次加载速度
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
