---
title: 消息排查
description: 沿平台连接、事件进入、路由匹配和消息发送逐步定位。
sidebar_position: 2
---

# 消息排查

## 1. 平台是否连接

查看适配器的连接和登录日志。核对平台要求的凭据、地址、端口与项目实际配置，见 [连接平台](/docs/alemonjsDocs/getting-started/connect-platform)。不要仅凭机器人进程存在判断账号已登录。

## 2. 消息是否进入框架

发送一条已知指令，检查入站事件。没有事件时先排查平台连接；有事件时核对事件类型与处理规则的 `selects`，见 [事件类型](/docs/alemonjsDocs/core/message-type)。

## 3. 路由是否命中

检查输入文本、前缀、正则以及加载的路由文件。使用路由 DSL 时，内部 key 与输入前缀分别配置，见 [路由 DSL](/docs/alemonjsDocs/core/router-sdl)。

同时检查前置中间件是否终止了分发，以及应用入口是否返回了 `responseRouter`。定位时可先使用 [编写指令](/docs/alemonjsDocs/getting-started/quick-start) 的简单指令缩小范围。

## 4. 是否发送成功

响应已执行但平台没有收到消息时，查看发送操作的错误。先尝试普通文本，再检查图片、Markdown 或交互消息的格式与平台支持情况，见 [Hooks](/docs/alemonjsDocs/core/hook)。

## 记录验证结果

记录测试消息、触发时间、对应入站日志、响应是否执行以及发送结果。反馈时附上版本与复现步骤，见 [常见问题](/docs/help/overview)。
