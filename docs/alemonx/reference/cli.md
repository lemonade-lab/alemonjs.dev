---
title: CLI
description: 使用 alx 启动工作台、管理服务、插件、认证和发布。
sidebar_position: 1
---

# CLI

| 命令                                         | 操作                  |
| -------------------------------------------- | --------------------- |
| `alx [serve] --port 17390`                   | 启动工作台。          |
| `alx open`                                   | 打开工作台地址。      |
| `alx install` / `start` / `stop` / `restart` | 管理后台服务。        |
| `alx status`                                 | 查看后台服务状态。    |
| `alx update`                                 | 检查并更新 alx。      |
| `alx plugin list`                            | 列出系统插件。        |
| `alx auth status`                            | 查看本机认证状态。    |
| `alx mcp`                                    | 启动 stdio MCP 服务。 |

使用 `alx --cwd /项目目录 npm publish` 发布 npm 包；使用 `alx --cwd /项目目录 git publish --yes` 创建 GitHub Release 标签。
