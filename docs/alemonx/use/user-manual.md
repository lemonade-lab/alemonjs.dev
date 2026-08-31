---
title: 用户手册
description: 从安装、项目管理到运行、调试、发布和安全运维，完整了解 ALemonX。
sidebar_position: 1
---

# ALemonX 用户手册

本手册面向第一次使用 ALemonX 的开发者，目标是让你理解工作台的模型，而不是只记住几个按钮。

## 先建立正确的认识

ALemonX（命令行入口为 `alx`）是本地机器人工作台；ALemonJS 是机器人开发框架；机器人项目是运行在 Node.js 上的应用。工作台负责项目生命周期，框架负责事件、消息与平台适配。

```text
工作台：创建 → 检查 → 运行 → 调试 → 发布 → 运维
项目：   package.json + 源码 + 配置 + 依赖
框架：   ALemonJS + 平台适配 + 机器人插件
```

## 第一次运行

1. [安装 ALemonX](/docs/alemonx/getting-started/install)。
2. 运行 `alx`，打开终端显示的本地地址。
3. 在「开发」创建项目，或在「管理」导入已有项目目录。
4. 在「环境」确认 Node.js、Git 和包管理器可用。
5. 在「运行」选择开发模式启动机器人。
6. 使用测试中心或 LiveChat 验证交互，再按需切换到 PM2 持续运行。

## 工作区与项目目录

工作区集中保存模板、工具、机器人和系统插件，默认结构如下：

```text
workspace/
├── templates/       # 项目模板
├── packages/        # Yarn、PM2 等受管工具
├── bots/            # 新建机器人默认目录
├── plugins/         # 已安装系统插件
└── store/<plugin>/  # 插件持久数据
```

机器人根目录必须包含 `package.json`。平台账号、端口等运行配置通常位于 `alemon.config.yaml`，依赖和脚本位于 `package.json`。敏感信息不要提交到 Git；生产环境请使用工作台的认证和受限访问策略。

## 运行方式选择

| 模式 | 适用场景                     | 你应关注什么             |
| ---- | ---------------------------- | ------------------------ |
| 开发 | 修改代码、热更新、快速验证   | 终端输出、依赖和端口     |
| 前台 | 临时运行或排障               | 当前进程生命周期         |
| PM2  | 长期运行、异常拉起、开机恢复 | 日志、进程状态和保存清单 |

## 测试、发布与恢复

建议先在测试中心验证，再执行构建。发布前检查包名、版本、入口文件、依赖和构建产物；发布到 npm 或创建 Git Release 都属于外部副作用，应由用户在预检后明确确认。

遇到问题时按顺序检查：运行日志 → 环境检查 → 依赖安装 → 端口占用 → [故障排查](/docs/alemonx/use/operations/troubleshooting)。需要恢复时优先使用任务快照和 Git，而不是直接覆盖项目目录。

## AI 协作的基本原则

Agent 可以读取项目、形成计划、修改文件并运行受控验证。新的写任务默认停留在 `plan_pending`，你审阅计划后才能执行；单次写入、安装、运行和发布操作仍可能要求再次确认。重启后正在执行的任务会暂停，不会悄悄重放写操作。

详细机制见[Agent 任务状态机](/docs/alemonx/use/agent/task-lifecycle)、[权限与安全](/docs/alemonx/use/operations/access-and-safety)和 [MCP 工具参考](/docs/alemonx/reference/mcp-tools)。
