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

### 路由匹配模式

每个路由项可配置三种匹配模式，按性能从高到低排列：

| 模式     | 字段      | 性能 | 说明                             |
| -------- | --------- | ---- | -------------------------------- |
| 精确匹配 | `exact`   | O(1) | 文本完全相等才匹配               |
| 前缀匹配 | `prefix`  | O(n) | 文本以指定前缀开头               |
| 正则匹配 | `regular` | 较慢 | 正则表达式匹配（内部有缓存优化） |

```ts
defineRouter([
  { exact: '/help', handler: lazy(() => import('./help')) },
  { prefix: '/', handler: lazy(() => import('./command')) },
  { regular: /^(#|\/)?hello$/, handler: lazy(() => import('./hello')) }
])
```

### 事件类型过滤

通过 `selects` 字段限制路由仅响应特定事件类型：

```ts
defineRouter([
  {
    selects: ['message.create', 'private.message.create'],
    regular: /^\/签到$/,
    handler: lazy(() => import('./signin'))
  }
])
```

### lazy

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

## 注册到应用

### responseRouter

```ts title="src/index.ts"
export default defineChildren({
  register() {
    return {
      // const responseRouter = defineRouter([])
      responseRouter
    }
  },
  onCreated() {
    logger.info(`[测试机器人启动]`)
  }
})
```

### middlewareRouter

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

### register 返回值

`register()` 可返回以下字段：

| 字段               | 类型                               | 说明             |
| ------------------ | ---------------------------------- | ---------------- |
| `responseRouter`   | `ReturnType<DefineRouterFunc>`     | 响应路由（推荐） |
| `middlewareRouter` | `ReturnType<DefineRouterFunc>`     | 中间件路由       |
| `response`         | `ReturnType<DefineResponseFunc>`   | 响应体（旧方式） |
| `middleware`       | `ReturnType<defineMiddlewareFunc>` | 中间件（旧方式） |
