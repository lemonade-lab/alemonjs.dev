---
label: '接口路由'
sidebar_position: 7
---

# 接口路由

:::tip

框架基于KOA约定了接口路由

:::

默认地址 http://localhost:17117/app

## index

`/app/`

访问对应 根目录下的 index.html 文件

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

## api

`/app/api/hello`

根据文件路径 转为 接口路由

```ts title="src/route/api/hello.ts"
import { Context } from 'koa'

// GET
export const GET = (ctx: Context, next) => {
  ctx.status = 200
  ctx.body = {
    message: 'hello word !'
  }
}

// POST
export const POST = (ctx: Context, next) => {
  ctx.status = 200
  ctx.body = {
    message: 'hello word !'
  }
}

// DELETE
// PUT
```

## root

如果想更改资源访问的跟目录，可在 package.josn 中配置

```json
{
  "alemonjs": {
    "web": {
      "root": "dist"
    }
  }
}
```

如果你的应用计划支持包管理，需新增 package 引用

[详细请阅读 点击阅读 开放模块](../open/7-models.md)

```json
{
  "exports": {
    "./package": "./package.json"
  }
}
```

## 路径

html 内的路径（包括接口），请使用相对路径，而非绝对路径。

同时，推荐使用哈希路由进行路由导航

下面以 vite 打包配置为例

```ts title="vite.config.ts"
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'url'
import react from '@vitejs/plugin-react'
const NODE_ENV = process.env.NODE_ENV === 'development'
export default defineConfig({
  // 打包时，资源路径增加 ./
  base: NODE_ENV ? '/' : './',
  server: {
    proxy: {
      // 接口： 转发 /api 请求到 17117/api/api
      '/api': {
        target: 'http://localhost:17117/app/api/',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    rollupOptions: {
      output: {
        // 如果 打包文件到 dist 目录，对应 pkg.alemonjs.web.root 可更为 dist
        dir: '../dist'
      }
    }
  }
})
```

接口调用，以 axios 为例

```ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
const instance = axios.create({
  // 请求接口基于 ./api
  baseURL: './api'
  // 如此，访问 /app/api 才能对应   /app + ./api
})
/**
 *
 * @param config
 * @returns
 */
export const request = (config: AxiosRequestConfig): Promise<AxiosResponse> => {
  return new Promise<AxiosResponse>((resolve, reject) => {
    instance(config)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}
```
