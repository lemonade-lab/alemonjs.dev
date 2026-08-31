---
sidebar_position: 1
label: '简介'
description: 'ALemonX 官方文档总览：了解工作台、机器人项目、ALemonJS 框架与系统插件之间的关系。'
---

# ALemonX 简介

ALemonX 是面向开发者的本地机器人工作台。它把项目创建、环境检查、运行调试、任务协作、插件扩展和发布运维放在同一套工作流中，让一个机器人项目从“能启动”走到“可开发、可维护、可交付”。

如果你刚接触这个生态，可以先记住四个概念：

| 概念           | 作用                                                                        |
| -------------- | --------------------------------------------------------------------------- |
| **ALemonX**    | 管理机器人项目全生命周期的工作台与本地服务，命令行入口为 `alx`。            |
| **ALemonJS**   | 用 JavaScript/TypeScript 编写聊天平台机器人的开发框架。                     |
| **机器人项目** | 使用 ALemonJS 编写的业务代码、配置、资源与运行环境。                        |
| **系统插件**   | 扩展 ALemonX 工作台能力的插件，例如接入外部工具、提供管理页面或自动化任务。 |

```text
ALemonX 工作台
├── 机器人项目（由 ALemonJS 驱动）
├── 运行、调试、发布与运维
├── Agent / MCP 协作能力
└── 系统插件与 WebView 扩展
```

## ALemonX 能解决什么问题

传统的机器人开发通常需要开发者分别维护命令行、依赖、环境变量、进程管理、日志、测试工具和发布流程。ALemonX 将这些环节串成一个可观察、可操作的本地工作台：

- 创建或导入 JavaScript/TypeScript 机器人项目，并检查运行环境与依赖。
- 在开发、前端预览和 PM2 等运行模式之间切换，集中查看日志与服务状态。
- 通过测试中心、LiveChat 和机器人应用页面验证交互，而不必每次都手动拼装测试环境。
- 为修复、开发、检查和发布创建任务；涉及写入、执行或高权限操作时，保留明确的确认边界。
- 使用 Agent 与 MCP 连接本地工具，辅助完成项目检查、问题定位和重复性操作。
- 通过系统插件、WebView 和本地服务，将工作台扩展为适合团队或组织的开发平台。

## 从一个机器人项目开始

推荐按下面的顺序阅读和使用：

1. [安装 ALemonX](/docs/alemonx/getting-started/install)，准备命令行与本地运行环境。
2. [快速开始](/docs/alemonx/getting-started/quick-start)，创建或导入第一个项目。
3. [创建与导入项目](/docs/alemonx/use/projects/create-or-import)，了解项目目录、依赖和环境变量。
4. [运行与监控](/docs/alemonx/use/runtime/run-and-monitor)，启动服务并查看日志、状态和端口。
5. 使用 [Agent 协作](/docs/alemonx/use/agent/collaboration) 或 [MCP](/docs/alemonx/use/agent/mcp) 辅助开发。
6. 准备交付时，查看 [Docker 部署](/docs/alemonx/use/operations/docker)、[故障排查](/docs/alemonx/use/operations/troubleshooting) 和发布相关文档。

## 如果你要开发扩展

ALemonX 的扩展能力有不同边界，选择正确的入口可以避免把业务逻辑和工作台逻辑混在一起：

| 目标                               | 推荐入口                                                            |
| ---------------------------------- | ------------------------------------------------------------------- |
| 响应消息、事件和机器人业务         | [ALemonJS 快速开始](/docs/alemonjsDocs/getting-started/quick-start) |
| 为工作台增加工具、页面或自动化能力 | [系统插件开发](/docs/alemonx/develop/system-plugins)                |
| 为插件提供可交互的管理界面         | [WebView 开发](/docs/alemonx/develop/webview)                       |
| 开发机器人的可视化应用页面         | [机器人应用页面](/docs/alemonx/develop/bot-app-page)                |
| 构建、打包和发布扩展               | [构建与发布](/docs/alemonx/develop/build)                           |
| 查看插件字段和兼容性约束           | [插件清单参考](/docs/alemonx/reference/plugin-manifest)             |

### 系统插件与机器人插件的区别

机器人插件运行在机器人项目内部，主要负责业务功能和平台事件响应；系统插件运行在 ALemonX 工作台侧，主要负责工具集成、管理界面、项目操作和开发流程扩展。系统插件可以通过受控协议访问宿主能力，但不能默认获得任意文件、命令或网络权限。

这种分层让业务代码保持独立，也让工作台的高权限能力可以被审计、确认和限制。开发系统插件前，建议先阅读[权限与安全](/docs/alemonx/use/operations/access-and-safety)。

## 安全与可控性

ALemonX 将“查看信息”和“改变系统状态”视为不同级别的操作。读取项目、查看日志通常可以直接完成；写入文件、安装依赖、执行命令、启动服务或进行发布等动作，应在明确的任务上下文中执行，并根据权限要求获得确认。

开发者需要重点关注：

- 插件只声明并使用实际需要的能力。
- 高权限操作有清晰的名称、参数和调用来源。
- 本地服务、上传文件和外部连接设置合理的范围与认证。
- 失败任务保留足够的日志和上下文，便于复现与排查。

## ALemonJS：机器人开发框架

[ALemonJS](https://github.com/lemonade-lab/alemonjs) 是基于 JavaScript/TypeScript 的聊天平台机器人开发框架。它通过 Hook 和响应函数描述事件发生时要执行的逻辑，并提供消息格式、上下文、组件和平台适配等能力。

下面是一个最小的消息响应示例：

```ts title="hello.ts"
import { Format, useMessage } from 'alemonjs'

export default () => {
  const [message] = useMessage()
  const format = Format.create().addText('hello world')

  message.send({ format })
}
```

继续学习框架本身，请从 [ALemonJS 快速开始](/docs/alemonjsDocs/getting-started/quick-start) 进入，再阅读 [Hook](/docs/alemonjsDocs/core/hook)、[上下文](/docs/alemonjsDocs/core/context) 和[平台适配](/docs/alemonjsDocs/modules/platforms)。

## 文档地图

- **使用 ALemonX**：安装、项目、运行、Agent、扩展和运维。
- **开发 ALemonX**：系统插件、WebView、机器人应用页面以及构建发布。
- **参考**：[`alx` CLI](/docs/alemonx/reference/cli)、[MCP](/docs/alemonx/reference/mcp) 和[插件清单](/docs/alemonx/reference/plugin-manifest)。
- **开发机器人**：从 [ALemonJS 快速开始](/docs/alemonjsDocs/getting-started/quick-start) 进入框架文档。

遇到问题时，先查看[故障排查](/docs/alemonx/use/operations/troubleshooting)；如果问题涉及权限或 Agent 行为，再阅读[权限与安全](/docs/alemonx/use/operations/access-and-safety)。
