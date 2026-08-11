---
title: MCP
description: 配置 stdio 或本机 HTTP MCP，并限制项目目录和写入操作。
sidebar_position: 2
---

# MCP

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
