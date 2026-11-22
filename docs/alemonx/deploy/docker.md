---
title: Docker 部署工作台
description: 用 Docker Compose 启动工作台并保留配置与项目目录。
sidebar_position: 1
---

# Docker 部署工作台

## 准备 Compose 文件

在部署目录创建 `docker-compose.yml`。示例把服务绑定到宿主机回环地址。

```yaml
services:
  alx:
    image: ${ALX_IMAGE:-ccr.ccs.tencentyun.com/ningmengchongshui/alemonx}
    container_name: ${ALX_CONTAINER_NAME:-alx}
    restart: unless-stopped
    ports:
      - '127.0.0.1:${ALX_PORT:-17390}:17390'
    environment:
      TZ: ${TZ:-Asia/Shanghai}
      HOME: /root
      XDG_CONFIG_HOME: /root/config
      XDG_CACHE_HOME: /root/cache
      ALX_DEPLOYMENT: ${ALX_DEPLOYMENT:-production}
      ALX_OPS_STORAGE: sqlite
      ALX_CONTAINER: '1'
      ALX_WORKSPACE: /app/workspace
      ALEMONJS_SETUP_ROOTS: /app/workspace
      ALX_PRIVILEGED_MODE: ${ALX_PRIVILEGED_MODE:-enabled}
      ALX_PLUGIN_GITHUB_API_MIRROR: ${ALX_PLUGIN_GITHUB_API_MIRROR:-}
      ALX_PLUGIN_DOWNLOAD_MIRRORS: ${ALX_PLUGIN_DOWNLOAD_MIRRORS:-}
      ALX_SNOWLUMA_ENABLED: ${ALX_SNOWLUMA_ENABLED:-0}
    volumes:
      - ./data:/root
      - ./workspace:/app/workspace
    shm_size: '1gb'
    healthcheck:
      test: ['CMD-SHELL', 'curl -fsS http://127.0.0.1:17390/healthz >/dev/null']
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 20s
```

| 宿主机设置    | 用途                           |
| ------------- | ------------------------------ |
| `ALX_PORT`    | 对外端口，默认 `17390`。       |
| `./data`      | 工作台的配置、缓存和本地状态。 |
| `./workspace` | 项目、模板、工具和系统插件。   |

## 启动与检查

```bash
docker compose up -d
docker compose ps
docker compose logs --tail 100 alx
```

容器通过健康检查后，打开 `http://127.0.0.1:17390`，使用改过的端口时替换地址中的端口。需要跨机器访问时，先配置认证，再通过受控入口转发。工作台打开后可按[创建与导入](/docs/alemonx/use/projects/create-or-import)添加项目。

更多服务和可选配置见 [AlemonX 的 Compose 文件](https://github.com/lemonade-lab/alemonx/blob/main/docker-compose.yml)。
