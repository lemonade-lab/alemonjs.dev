---
label: '接口路由'
sidebar_position: 7
---

# 接口路由

默认地址 `http://localhost:17117/app`。

## 当前支持的 HTTP 能力

- 主应用公开 HTTP 服务
- 插件应用公开 HTTP 服务
- `defineChildren().register()` 直接返回的 `koaRouter`

这些能力现在都受到运行时状态控制

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
- 不应该暴露 HTTP 服务

### 当前常见响应语义

- 未注册 / 未启用：`404`
- 初始化中：`503`
- 初始化失败：`500`
- 已卸载：`410`

## 注册路由

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

推荐它的原因很直接：

- 路由方法、前缀、入口都由代码显式声明
- 更容易做审计、权限和安全评审
- 更容易做统一中间件和权限控制
- 更符合“我主动注册了哪些 HTTP 能力”这个开发者心智

## 静态资源

`/app/` 会优先访问当前应用公开的 web 根目录，例如其中的 `index.html`。

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

同时，推荐使用哈希路由进行前端路由导航。确保兼容性

## 安全

框架内置了路径安全防护：

- **路径遍历防护**：公开 HTTP 路由的文件路径都会经过安全校验，`../` 等遍历尝试会返回 **403**
- **包名校验**：插件应用名会经过合法 npm 包名校验，非法名称返回 **400**

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
