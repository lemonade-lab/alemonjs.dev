---
title: ALemonX 文档总览
description: 面向用户、机器人开发者、系统插件开发者和运维人员的 ALemonX 文档入口。
sidebar_position: 0
---

# ALemonX 文档总览

ALemonX（命令行程序名为 `alx`）是 AlemonJS 机器人的本地工作台，负责创建、导入、运行、调试、发布和管理机器人项目，也提供 Agent、MCP 和系统插件能力。

## 先判断你的目标

| 你想做什么                 | 从这里开始                                                |
| -------------------------- | --------------------------------------------------------- |
| 第一次安装并运行工作台     | [如何安装](/docs/alemonx/getting-started/install)         |
| 创建或导入机器人项目       | [项目与配置](/docs/alemonx/use/projects/create-or-import) |
| 调试、持续运行和发布机器人 | [运行与交付](/docs/alemonx/use/runtime/run-and-monitor)   |
| 使用 Agent 修改或检查代码  | [Agent 协作](/docs/alemonx/use/agent/collaboration)       |
| 通过 MCP 连接 AI 客户端    | [MCP 接入](/docs/alemonx/use/agent/mcp)                   |
| 开发机器人插件页面         | [WebView](/docs/alemonx/develop/webview)                  |
| 开发工作台系统插件         | [系统插件开发](/docs/alemonx/develop/system-plugins)      |
| 部署到 Docker 或服务器     | [Docker 部署](/docs/alemonx/use/operations/docker)        |

## 三层产品模型

```text
ALemonX 工作台
├── 机器人项目      使用 AlemonJS 编写和运行机器人
├── 系统插件        扩展工作台本身的本机能力
└── Agent / MCP     在确认和权限边界内自动化项目操作
```

不要混淆三种页面：系统插件面板使用 `ALXHost`，机器人应用页使用 `window.__alxWebview`，宿主 WebView 是由工作台托管的普通页面容器。

## 推荐阅读顺序

1. [工作站开始](/docs/alemonx/getting-started/quick-start)；
2. [项目与配置](/docs/alemonx/use/projects/create-or-import)；
3. [运行与交付](/docs/alemonx/use/runtime/run-and-monitor)；
4. 按需阅读 [Agent 与自动化](/docs/alemonx/use/agent/collaboration)、[插件开发](/docs/alemonx/develop/system-plugins) 或 [运维文档](/docs/alemonx/use/operations/docker)。

## 文档约定

- “工作台”指运行中的 ALemonX 服务和浏览器界面；
- “机器人项目”指包含 `package.json` 的 AlemonJS 项目目录；
- “系统插件”指扩展 ALemonX 本身的插件；
- “机器人插件”指随机器人项目安装的插件；
- 涉及写入、发布、特权或远程操作时，文档会明确说明确认和权限要求。
