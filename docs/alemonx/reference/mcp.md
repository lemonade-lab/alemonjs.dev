---
title: MCP
description: 配置 stdio 或本机 HTTP MCP，并限制项目目录和写入操作。
sidebar_position: 2
---

# MCP

MCP 是 ALemonX 的控制面，不是直接暴露宿主 Shell。它把项目、运行、Git、发布和诊断能力作为带权限边界的工具提供给本机 AI 客户端。

## stdio

在 MCP 客户端中设置：

```text
command: alx
args: mcp
```

用 `MCP_ALLOWED_ROOTS` 限制可管理的目录。macOS 与 Linux 使用 `:` 分隔多个目录；Windows 使用 `;`。

## HTTP

```bash
MCP_TOKEN='随机值' alx --mcp-port 17391 mcp-http
```

客户端请求使用 `Bearer <MCP_TOKEN>`。HTTP 服务只监听本机地址。

## 写入

创建项目、写入文件、发布和 Git 操作必须传入 `confirm: true`。先读取计划或预检结果，再请求确认并执行写入。

## 选择连接方式

| 方式            | 适用场景                 | 特点                              |
| --------------- | ------------------------ | --------------------------------- |
| stdio           | 本机桌面 AI 客户端       | 不开放端口，推荐默认使用          |
| Streamable HTTP | 本机服务或容器中的客户端 | 仅监听回环地址，需要 Bearer Token |

## 安全边界

- 使用 `MCP_ALLOWED_ROOTS` 限制可管理的项目根目录；
- 修改文件、安装依赖、Git 写操作和发布都需要确认；
- 客户端不能绕过服务端确认策略；
- 不要把 Token 放入项目文件、任务提示词或日志；
- Docker 部署时只把 MCP 暴露给需要它的本机或受控网络。

标准工作流是：

```text
读取项目和诊断信息
→ 请求计划 / 预检
→ 用户确认
→ 执行写入或运行操作
→ 查看任务状态与验证输出
```
