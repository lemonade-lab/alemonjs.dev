---
title: MCP 配置
description: 配置 stdio 或本机 HTTP MCP，并限制项目目录和写入操作。
sidebar_position: 2
---

# MCP 配置

本机 AI 客户端通过 MCP 调用工作台的项目管理、运行、Git、发布和诊断工具。可用目录与写入操作由服务端限制。

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

客户端连接 `http://127.0.0.1:17391/mcp`，使用 `Authorization: Bearer <MCP_TOKEN>` 请求头。

## 目录与操作权限

- 用 `MCP_ALLOWED_ROOTS` 限制可管理的项目目录。
- 修改项目、安装依赖或发布前，先检查预检结果并取得确认。调用示例见 [MCP 工具](/docs/alemonx/reference/mcp-tools)。
- HTTP 服务监听回环地址，访问凭据保存在客户端的密钥配置中。
