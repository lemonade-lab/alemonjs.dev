---
title: 开发概览
description: 从第一个指令进入事件、消息、服务和扩展开发。
sidebar_position: 0
---

# 开发概览

先完成一条指令的接收和回复，再按开发任务查阅接口。

## 入门顺序

[创建项目](/docs/alemonjsDocs/getting-started/install) → [编写指令](/docs/alemonjsDocs/getting-started/quick-start) → [连接平台](/docs/alemonjsDocs/getting-started/connect-platform)。

[运行配置](/docs/alemonjsDocs/getting-started/config) 解释运行时填写的配置；[配置接口](/docs/alemonjsDocs/advanced/config) 解释开发代码如何使用配置。

## 按开发任务查阅

| 任务                   | 文档                                                                                            |
| ---------------------- | ----------------------------------------------------------------------------------------------- |
| 读取事件并控制后续处理 | [事件处理](/docs/alemonjsDocs/core/response)                                                    |
| 处理多轮对话和分步输入 | [事件上下文](/docs/alemonjsDocs/core/context)                                                   |
| 为指令选择处理函数     | [路由匹配](/docs/alemonjsDocs/core/router)、[路由 DSL](/docs/alemonjsDocs/core/router-sdl)      |
| 发送消息和处理交互     | [Hooks](/docs/alemonjsDocs/core/hook)、[消息格式](/docs/alemonjsDocs/core/data-type)            |
| 选择监听哪些事件       | [事件类型](/docs/alemonjsDocs/core/message-type)                                                |
| 拦截处理与管理执行阶段 | [中间件](/docs/alemonjsDocs/core/middleware)、[生命周期](/docs/alemonjsDocs/core/cycle)         |
| 提供 HTTP 接口         | [接口路由](/docs/alemonjsDocs/http/route)、[路由中间件](/docs/alemonjsDocs/http/route-mw)       |
| 添加周期性任务         | [定时任务](/docs/alemonjsDocs/advanced/schedule)                                                |
| 加载模块和配置扩展包   | [模块加载](/docs/alemonjsDocs/modules/models)、[扩展包配置](/docs/alemonjsDocs/modules/desktop) |
| 接入新聊天平台         | [平台适配](/docs/alemonjsDocs/modules/platforms)                                                |
| 查全局对象和辅助函数   | [全局实例](/docs/alemonjsDocs/modules/class)、[工具函数](/docs/alemonjsDocs/advanced/utils)     |

## 命令行与排错

`alemonc` 管理框架项目的配置、平台、运行和发布，见 [机器人命令行](/docs/alemonjsDocs/getting-started/terminal-tools)。工作台命令 `alx` 的说明见 [工作台命令行](/docs/alemonx/reference/cli)。

启动失败或消息不回复时，进入 [常见问题](/docs/help/overview)。
