---
title: 常见问题
description: 按启动、平台连接、消息处理和插件问题选择排查路线。
sidebar_position: 0
---

# 常见问题

先判断故障发生在哪一层，再阅读对应说明。

| 现象                         | 检查入口                                                  |
| ---------------------------- | --------------------------------------------------------- |
| `alx` 无法启动、工作台打不开 | [启动排查](/docs/help/startup)                            |
| 项目导入或依赖安装失败       | [创建与导入](/docs/alemonx/use/projects/create-or-import) |
| 机器人启动后立即退出         | [启动排查](/docs/help/startup)                            |
| 平台连不上、消息不回复       | [消息排查](/docs/help/messages)                           |
| 系统插件未发现、动作失败     | [系统插件](/docs/alemonx/use/plugins)                     |
| 不知道该开发哪种插件         | [开发入口](/docs/extensions)                              |

## 工作台和机器人有什么区别

工作台管理本地项目、运行和任务；机器人框架负责事件、路由和消息处理。`alx` 用于工作台，`alemonc` 用于框架项目。命令不能互相替代。

## 配置应该看哪篇

运行前填写字段，看 [运行配置](/docs/alemonjsDocs/getting-started/config)；在代码里读取配置，看 [配置接口](/docs/alemonjsDocs/advanced/config)。平台与第三方插件的专有字段以各自说明为准。

## 反馈问题前准备什么

记录操作系统、工作台与框架版本、相关插件版本、复现步骤，以及第一处报错前后的日志。说明是工作台打不开、机器人没启动，还是某条指令失败。

分享配置时替换令牌、密码和账号敏感信息。携带上述信息到对应项目的 Issue 或社区反馈，可从 [工作台仓库](https://github.com/lemonade-lab/alemonx) 和 [机器人框架仓库](https://github.com/lemonade-lab/alemonjs) 进入。
