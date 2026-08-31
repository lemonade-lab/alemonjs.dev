---
title: CLI
description: 使用 alx 启动工作台、管理服务、插件、认证和发布。
sidebar_position: 1
---

# CLI

| 命令                                         | 操作                           |
| -------------------------------------------- | ------------------------------ |
| `alx [serve] --port 17390`                   | 启动工作台。                   |
| `alx open`                                   | 打开工作台地址。               |
| `alx install` / `start` / `stop` / `restart` | 管理后台服务。                 |
| `alx status`                                 | 查看后台服务状态。             |
| `alx health`                                 | 检查本机 HTTP 健康状态。       |
| `alx doctor`                                 | 汇总服务、健康和开发环境诊断。 |
| `alx logs`                                   | 查看后台服务日志。             |
| `alx update`                                 | 检查并更新 alx。               |
| `alx plugin list`                            | 列出系统插件。                 |
| `alx auth status`                            | 查看本机认证状态。             |
| `alx mcp`                                    | 启动 stdio MCP 服务。          |

使用 `alx --cwd /项目目录 npm publish` 发布 npm 包；使用 `alx --cwd /项目目录 git publish --yes` 创建 GitHub Release 标签。

## 监听与工作区

```bash
alx --port 17390
alx --host 127.0.0.1
alx --workspace /path/to/workspace
alx --redis-port 6380
alx --redis-off
```

当前默认监听 `0.0.0.0`，局域网访问前必须开启认证并配置防火墙；仅本机访问时显式使用 `--host 127.0.0.1`。

工作区包含模板、工具、机器人项目、系统插件和插件持久数据。系统插件安装到 `<workspace>/plugins`，插件数据默认位于 `<workspace>/store/<插件 ID>`。

## 后台服务

```bash
alx install --port 17390 --workspace /path/to/workspace
alx start
alx restart
alx stop
alx status
alx logs --lines 200 --follow
```

程序移动或工作区变化后，应重新执行 `alx install`，让后台服务使用当前程序和工作区。
