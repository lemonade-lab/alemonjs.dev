---
title: Docker 部署
description: 使用 Docker 部署 ALemonX，并正确持久化工作区、配置和插件数据。
sidebar_position: 3
---

# Docker 部署

ALemonX 的 Docker 镜像包含工作台、Node.js、Git、SSH 和运行所需的基础工具，可以管理挂载到容器内 `/app/workspace` 的 AlemonJS 项目。

## 快速部署

```bash
mkdir alx-docker && cd alx-docker
curl -fsSLO https://raw.githubusercontent.com/lemonade-lab/alemonx/main/scripts/docker-install.sh
sh docker-install.sh up
```

首次启动后打开 `http://localhost:17390`，按引导创建管理员账户。

也可以手动执行：

```bash
docker compose up -d
docker compose logs -f alx
```

## 数据目录

```text
./data/       # 账户、配置、SQLite、下载缓存
./workspace/  # 模板、工具、机器人项目、系统插件和插件数据
```

容器内对应 `/app/workspace`。工作台会把“当前目录”项目保存到可写工作区，避免项目写入容器临时层。

## 安全边界

- 不要把容器改为 `privileged`；
- 不要挂载 `/var/run/docker.sock`；
- 对外访问前先启用认证并配置防火墙；
- 只挂载必要的 `data` 和 `workspace` 目录；
- 备份时同时备份两个目录。

## 更新与停止

```bash
sh docker-install.sh pull
sh docker-install.sh restart
```

不要在容器内执行 `alx update`。容器更新应替换镜像，而不是修改只读镜像层。

`docker compose down` 不会删除 `data` 和 `workspace`；只有手动删除这两个目录才会清除数据。

## Docker 中使用 MCP

```bash
docker compose exec -T alx /app/alx mcp
```

可使用 `MCP_ALLOWED_ROOTS=/app/workspace` 限制 MCP 可管理的项目目录。
