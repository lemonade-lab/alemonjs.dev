---
title: 终端工具
description: 安装并使用 alemonc 管理配置、平台、运行和发布。
sidebar_position: 5
---

# 终端工具

`alemonc` 是 ALemonJS 项目的命令行工具，用于配置管理、平台管理、运行、版本更新和发布。

## 安装

### 在项目中安装

推荐将 `alemonjs` 安装到项目开发依赖中：

```bash
npm install --save-dev alemonjs
```

安装后可以直接使用项目内的命令：

```bash
npx alemonc --help
```

也可以使用当前包管理器对应的执行方式：

```bash
yarn alemonc --help
pnpm exec alemonc --help
```

### 全局安装

如果希望在任意目录直接输入 `alemonc`：

```bash
npm install --global alemonjs
alemonc --help
```

## 基本使用

在包含 `package.json` 和 `alemon.config.yaml` 的项目目录中运行命令。

### 配置管理

```bash
alemonc add apps alemonjs-xianyu alemonjs-openai
alemonc remove apps alemonjs-openai
alemonc set login qq
alemonc set discord.token 123456
alemonc get discord.token
alemonc del discord
```

`set` 支持使用点号访问嵌套配置。配置命令会直接修改项目中的 `alemon.config.yaml`。

### 运行项目

```bash
alemonc run [script]
alemonc start
```

`run` 执行 `package.json` 中指定的脚本；`start` 读取 `package.json` 的 `main` 入口启动项目。

### 平台管理与登录

```bash
alemonc platform add discord
alemonc platform list
alemonc platform remove discord

alemonc login discord
alemonc login qq-bot
alemonc login onebot
```

`platform add` 会安装并注册对应的 `@alemonjs/<name>` 平台包；`login` 通过交互式提示把平台凭证保存到 `alemon.config.yaml`。

### 项目信息与版本更新

```bash
alemonc info
alemonc version update
```

`info` 输出 Node.js、项目、依赖、配置摘要和包管理器信息；`version update` 检查并更新项目中的 `alemonjs` 与 `@alemonjs/*` 依赖。

### 分支管理

```bash
alemonc branch feature-name
```

命令会根据当天日期创建并切换到 `dev-YYYYMMDD-feature-name` 分支，不会覆盖已存在的分支。

### 发布

发布前确保工作区干净，并先使用预演确认构建产物：

```bash
alemonc publish --dry-run
alemonc publish patch
alemonc publish prepatch --preid beta
alemonc publish v1.0.33-rc.0
```

`publish` 默认先执行 `npm run build`，再构建并发布当前包。主分支默认发布到 `release` 并创建版本标签；其他分支发布到对应的 `-release` 产物分支，不自动创建标签。`--dry-run` 不会推送分支或创建标签。

查看全部参数：

```bash
alemonc --help
alemonc publish --help
```
