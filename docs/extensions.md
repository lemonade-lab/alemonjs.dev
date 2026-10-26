---
title: 开发入口
description: 按机器人指令、平台适配、系统插件和应用页面选择开发文档。
sidebar_position: 4
---

# 开发入口

先确定要扩展的对象，再选择对应接口。机器人插件与工作台系统插件属于不同的运行环境。

| 你要实现的能力               | 扩展对象               | 开始阅读                                                                                        |
| ---------------------------- | ---------------------- | ----------------------------------------------------------------------------------------------- |
| 聊天指令与业务功能           | 机器人                 | [编写指令](/docs/alemonjsDocs/getting-started/quick-start)                                      |
| 组织可复用机器人功能包       | 机器人框架模块与扩展包 | [模块加载](/docs/alemonjsDocs/modules/models)、[扩展包配置](/docs/alemonjsDocs/modules/desktop) |
| 接入尚未支持的聊天平台       | 平台适配器             | [平台适配](/docs/alemonjsDocs/modules/platforms)                                                |
| 给工作台增加本机管理能力     | 工作台系统插件         | [系统插件开发](/docs/alemonx/develop/system-plugins)                                            |
| 为机器人插件提供应用页面     | 机器人应用页           | [机器人应用页](/docs/alemonx/develop/webview)                                                   |
| 从本机 AI 客户端操作工作台   | 工作台 MCP             | [MCP 配置](/docs/alemonx/reference/mcp)、[MCP 工具](/docs/alemonx/reference/mcp-tools)          |
| 在机器人项目中提供 HTTP 接口 | 机器人框架 HTTP 服务   | [接口路由](/docs/alemonjsDocs/http/route)                                                       |

## 先使用已有能力

只想安装插件或连接现成平台时，先查 [生态资源](https://open.alemonjs.com) 与 [连接平台](/docs/alemonjsDocs/getting-started/connect-platform)。这些任务不要求自己实现扩展。

## 开发与参考的分工

开发指南负责说明最小实现、注册方式与验证步骤；参考文档负责字段和接口细节。系统插件的字段见 [插件配置](/docs/alemonx/reference/plugin-manifest)，机器人在工作台中的构建约定见 [构建规范](/docs/alemonx/develop/build)。
