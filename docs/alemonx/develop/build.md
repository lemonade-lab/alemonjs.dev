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
package.json 的 alemonjs.build 声明 script
        ↓
package.json 的 scripts.bundle
        ↓
package.json 的 scripts.build
        ↓
npx lvy build
```

推荐在 `package.json` 中明确声明一个 `bundle` 脚本：

```json
{
  "scripts": {
    "bundle": "lvy build",
    "start": "node lib/index.js"
  },
  "alemonjs": {
    # 对应 scripts.bundle，可改为scripts中的其他脚本
    "build": "bundle"
  }
}
```

## 推荐产物

> 请注意构建完成后，确定最终产物

```text
project/
├── src/                  # 源码
├── lib/                  # 构建后的机器人入口
├── package.json
└── alemon.config.yaml
```

```json
{
  "scripts": {
    "bundle": "yarn --cwd frontend build && lvy build"
  },
  "alemonjs": { "build": "bundle" }
}
```

嵌套前端目录必须位于项目根目录内，并且包含自己的 `package.json`。
