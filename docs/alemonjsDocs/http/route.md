---
label: '接口路由'
sidebar_position: 7
---

# 接口路由

:::tip

HTTP 服务现在已经纳入运行时生命周期。新项目更推荐显式注册 `koaRouter`，而不是继续依赖 `route/api` 目录检索。

:::

默认地址仍然基于 `http://localhost:17117/app`。

## 当前支持的 HTTP 能力

- 主应用：`/app/*`
- 插件应用：`/apps/:app/*`
- `defineChildren().register()` 直接返回的 `koaRouter`

这些能力现在都受到运行时状态控制，而不再是“文件存在就能访问”。

## 生命周期规则

### 只有 `ready` 才真正提供服务

如果应用当前状态是：

- `discovered`
- `loading`
- `failed`
- `disposed`

那么对应 HTTP 能力不会真正放行。

### 插件必须先进入 `apps` 管理

如果某个插件没有出现在 `alemon.config.yaml` 的 `apps` 配置中，那么：

- 不会进入运行时管理
- 不应该通过 `/apps/:app/*` 暴露服务

### 当前常见响应语义

- 未注册 / 未启用：`404`
- 初始化中：`503`
- 初始化失败：`500`
- 已卸载：`410`

## 1. 显式注册 `koaRouter`（推荐）

```ts title="src/index.ts"
import KoaRouter from 'koa-router'
import { defineChildren } from 'alemonjs'

const router = new KoaRouter({ prefix: '/demo' })

router.get('/ping', ctx => {
  ctx.body = {
    code: 200,
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

推荐它的原因很直接：

- 路由方法、前缀、入口都由代码显式声明
- 更容易做审计、权限和安全评审
- 不依赖目录扫描去推断服务边界
- 更符合“我主动注册了哪些 HTTP 能力”这个开发者心智

## 2. 文件式 `route/api`（兼容保留，不再主推）

主应用或插件应用仍然可以通过 `route/api/*` 提供 API。

例如：

```text
src/
  route/
    api/
      hello.ts
```

```ts title="src/route/api/hello.ts"
import { Context } from 'koa'

export const GET = (ctx: Context) => {
  ctx.status = 200
  ctx.body = {
    message: 'hello word !'
  }
}
```

这套写法仍然可用，但现在更适合：

- 维护旧项目
- 快速原型
- 已经重度依赖目录约定的场景

不再主推它作为长期主写法，原因不是“不能用”，而是：

- 目录检索式 API 更容易产生误暴露
- 边界更多依赖文件结构，而不是代码显式声明
- 对安全审查和服务治理不如显式注册直观

## index

`/app/`

会优先访问当前应用公开的 web 根目录，例如其中的 `index.html`。

```html
<!doctype html>
<html lang="en" id="__alemonjs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>AlemonJS</title>
  </head>
  <body>
    <div id="root">hello word !</div>
  </body>
</html>
```

## package

如果想更改静态资源访问的根目录，可在 `package.json` 中配置：

```json
{
  "alemonjs": {
    "web": {
      "root": "dist"
    }
  }
}
```

如果你的应用计划支持包管理，需新增 package 引用：

```json
{
  "exports": {
    "./package": "./package.json"
  }
}
```

## 路径

HTML 内的路径（包括接口），请使用相对路径，而非绝对路径。

同时，推荐使用哈希路由进行前端路由导航。

## 安全

框架内置了路径安全防护：

- **路径遍历防护**：所有 `/app/*` 和 `/apps/:app/*` 路由的文件路径都会经过安全校验，`../` 等遍历尝试会返回 **403**
- **包名校验**：`/apps/:app/*` 会校验应用名是否为合法 npm 包名，非法名称返回 **400**

:::warning

文件式 `route/api` 基于目录映射，请不要把敏感文件混放到 `route/` 目录中。对认证、授权和更细粒度的治理，优先通过显式注册的路由和中间件完成。

:::

## `onHttpError`

如果 API、静态资源或纯 `koa-router` 在处理过程中抛错，会触发：

```ts
onHttpError({ ctx, error, appName, path, method, kind })
```

如果返回：

```ts
return 'handled'
```

则表示你已经自己处理好了 HTTP 响应，框架不会再补默认 500。

## 当前推荐理解

- **新项目优先使用 `koaRouter` 显式注册**
- `route/api` 保留兼容，不再作为主推荐写法
- 两者都会进入同一套生命周期边界，但安全性与边界清晰度上，显式注册更好
