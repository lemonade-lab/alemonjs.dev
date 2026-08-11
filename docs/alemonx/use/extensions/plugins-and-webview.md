---
title: 插件与 WebView
description: 为机器人项目配置侧栏入口和静态 WebView 页面。
sidebar_position: 1
---

# 插件与 WebView

在机器人项目的 `packages/` 或声明依赖中添加插件，再注册侧栏入口和静态 WebView 页面。

- `alemonjs.web.root`：声明包含 `index.html` 的静态页面目录。
- `desktop.sidebars`：声明至少一个侧栏入口。
- `window.__alxWebview`：获取插件上下文、消息桥接和 `./api/` 请求代理。

打开 WebView 不会启动机器人。页面调用机器人 API 前，先处理 API 不可用的状态。
