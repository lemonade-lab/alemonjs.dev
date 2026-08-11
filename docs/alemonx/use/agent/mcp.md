---
title: MCP 接入
description: 在本机 Agent 客户端中配置 alx mcp 或 mcp-http。
sidebar_position: 2
---

# MCP 接入

## stdio

在 MCP 客户端中配置：

```text
command: alx
args: mcp
```

可通过 `MCP_ALLOWED_ROOTS` 限制可管理的项目根目录。

## Streamable HTTP

设置 `MCP_TOKEN` 后启动：

```bash
alx --mcp-port 17391 mcp-http
```

服务只监听本机回环地址，并要求 Bearer Token。所有修改型工具必须传入 `confirm: true`。
