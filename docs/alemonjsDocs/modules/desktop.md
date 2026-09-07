---
label: '扩展'
sidebar_position: 7
---

# 扩展

:::info

如何开发扩展并推送到npmjs
:::

## 如何识别的

```shell title="大致的目录结构"
node_modules/                 // Node.js 依赖包
 ├── pkg-name                 // 相关模块
 │      ├── lib/              // 工程目录
 │      │    └── index.js     // 入口文件
 │      └── package.json      // 工程配置文件
```

会读取`node_modules/pkg-name/package.json`

解析并得到`main`

以入口文件的目录为工程目录

## 服务端

### 服务端配置

```json title="package.json"
{
  "name": "@alemonjs/test", // * 包名
  "version": "0.0.1", // * 版本号
  "author": {
    "name": "ningmengchongshui",
    "email": "ningmengchongshui@gmail.com",
    "url": "https://github.com/ningmengchongshui"
  },
  "type": "module", // * 仅支持esm
  "main": "lib/index.js", // * 包入口
  "scripts": {
    "build": "npx lvy build"
  },
  "exports": {
    ".": "./lib/index.js", // * 包入口
    "./package": "./package.json" // * 包配置信息
  },
  "keywords": ["alemonjs"], // *
  "publishConfig": {
    "registry": "https://registry.npmjs.org", // *
    "access": "public" // *
  },
  "alemonjs": {
    // 应用服务器相关配置
    "web": {
      // html服务根目录。即 dist/index.html
      "root": "dist"
    }
  }
  // 要发布模块，请确保没有以下内容。
  // "private": true,
  // "workspaces": ["packages/*"]
}
```
