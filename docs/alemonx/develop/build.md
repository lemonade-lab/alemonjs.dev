---
title: 机器人构建规范
description: 了解 ALemonX 如何识别机器人构建入口、bundle 输出和嵌套前端项目。
sidebar_position: 5
---

# 机器人构建规范

ALemonX 发布机器人前会在隔离的 Git worktree 中执行构建。构建配置的目标是生成可以被工作台运行和发布的入口文件，而不是把所有源码强行打包成单个文件。

## 构建入口优先级

ALemonX 按以下顺序选择构建入口：

```text
package.json 的 alemonjs.build
        ↓
package.json 的 scripts.bundle
        ↓
lvy build
```

推荐在 `package.json` 中明确声明一个 `bundle` 脚本：

```json
{
  "scripts": {
    "bundle": "lvy build",
    "start": "node lib/index.js"
  },
  "alemonjs": {
    "build": "bundle"
  }
}
```

`alemonjs.build` 的值是 `package.json` 中已有的脚本名，工作台会使用项目自己的包管理器执行它。没有更高优先级入口时，标准项目回退到 `lvy build`。

## 推荐产物

```text
project/
├── src/                  # 源码
├── lib/                  # 构建后的机器人入口
├── package.json
└── alemon.config.yaml
```

构建后的入口必须能够由 Node.js 直接启动，并且不能依赖开发服务器或只存在于开发机的绝对路径。需要构建独立前端时，可以使用：

```json
{
  "scripts": {
    "bundle": "yarn --cwd frontend build && lvy build"
  },
  "alemonjs": { "build": "bundle" }
}
```

嵌套前端目录必须位于项目根目录内，并且包含自己的 `package.json`。

## 前端与图片组件

如果机器人包含 WebView 或 JSXP 图片组件，应分别声明前端构建和机器人构建入口。前端页面输出到声明的 `web.root`，并使用相对资源路径；图片组件应在构建阶段完成需要的资源处理。

## 发布前检查

```bash
npm run build
npm run start
```

确认构建没有写入项目外部目录，入口可以独立启动，依赖已记录在 `package.json`，并且 WebView 的 `index.html` 和资源都存在。

构建失败时，先查看任务报告和完整日志，再检查 Node.js、包管理器、构建脚本、入口路径和依赖版本。更多发布操作见[运行与交付](/docs/alemonx/use/runtime/run-and-monitor)。
