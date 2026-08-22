---
title: X0.2.19
description: 基础可用
authors: ningmengchongshui
tags: [alemonx]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---

# 机器人的本地工作台

> 在一个本地工作台中创建、运行、管理和扩展 AlemonJS 机器人；也可以让 AI Agent 在你的确认下协助维护项目。

## 目录布局

```text
dist/                     前端构建产物（构建时嵌入 alx 二进制，不参与运行期布局）
resources/                运行期资源（构建时嵌入 alx 二进制）
├── templates/            项目模板源（bot/、dev/）
└── packages/             内置工具包（Yarn 嵌入；PM2 等按需用 Yarn 安装）
plugins/                  系统插件目录 (拖入插件即可自动加载)
workspace/                统一工作区（默认 <运行目录>/workspace）
├── templates/            项目模板（首次启动从内嵌模板物化，可编辑）
├── packages/             工具目录（Yarn 物化副本；PM2 首次使用安装到这里，位置固定）
└── bots/                 新建机器人的默认落点
```

## 脚本安装

### Windows

在 PowerShell 执行：

```powershell
irm https://raw.githubusercontent.com/lemonade-lab/alemonx/main/scripts/install.ps1 | iex
```

### Linux

在终端执行：

```sh
curl -fsSL https://raw.githubusercontent.com/lemonade-lab/alemonx/main/scripts/install.sh | sh
```

### macOS

在终端执行：

```sh
curl -fsSL https://raw.githubusercontent.com/lemonade-lab/alemonx/main/scripts/install.sh | sh
```

### FreeBSD

在终端执行：

```sh
curl -fsSL https://raw.githubusercontent.com/lemonade-lab/alemonx/main/scripts/install.sh | sh
```

## 手动安装

如需手动下载，可从 [GitHub Releases](https://github.com/lemonade-lab/alemonx/releases) 选择对应系统的压缩包：

| 系统                            | 下载文件                        |
| ------------------------------- | ------------------------------- |
| Windows x64                     | `alx-windows-amd64.zip`         |
| Windows ARM64                   | `alx-windows-arm64.zip`         |
| Windows 32 位                   | `alx-windows-386.zip`           |
| macOS Apple Silicon             | `alx-darwin-arm64.zip`          |
| macOS Intel                     | `alx-darwin-amd64.zip`          |
| Linux x64                       | `alx-linux-amd64.zip`           |
| Linux ARM64                     | `alx-linux-arm64.zip`           |
| Linux ARMv7                     | `alx-linux-armv7.zip`           |
| Linux 32 位 x86                 | `alx-linux-386.zip`             |
| Linux ppc64le / s390x / riscv64 | 对应的 `alx-linux-<架构>.zip`   |
| FreeBSD x64 / ARM64             | 对应的 `alx-freebsd-<架构>.zip` |

国内下载较慢时，可在 GitHub 地址前加镜像前缀，例如 `https://ghfast.top/https://github.com/lemonade-lab/alemonx/releases/latest`。

下载得到的ZIP压缩包解压可得执行包，

### Windows

> 遇到权限问题可尝试超级管理员启动

Windows 直接运行 `alx.exe`。

### macOS / Linux / FreeBSD

> 务必进行授权再启动

```bash
chmod +x alx
./alx
```

## Docker

任意目录创建 docker-compose.yml 并保存以下内容

```yml
services:
  alx:
    image: ccr.ccs.tencentyun.com/ningmengchongshui/alemonx:latest
    container_name: alx
    restart: unless-stopped
    ports:
      - '17390:17390'
    environment:
      TZ: Asia/Shanghai
      HOME: /data
      XDG_CONFIG_HOME: /data/config
      XDG_CACHE_HOME: /data/cache
      ALX_DEPLOYMENT: production
      ALX_OPS_STORAGE: sqlite
      ALX_CONTAINER: '1'
      ALX_WORKSPACE: /app/workspace
      ALEMONJS_SETUP_ROOTS: /app/workspace
      ALX_PRIVILEGED_MODE: disabled
    volumes:
      - ./data:/data
      - ./workspace:/app/workspace
    healthcheck:
      test: ['CMD-SHELL', 'curl -fsS http://127.0.0.1:17390/healthz >/dev/null']
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
```

在终端中执行：

```bash
docker compose up -d
```

更多操作请自行搜索docker相关内容
