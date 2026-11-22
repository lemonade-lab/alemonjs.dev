---
title: QQ Bot 接入
description: 安装 QQ 官方机器人适配器，配置 AppID、AppSecret 或扫码授权。
sidebar_position: 7
---

# QQ Bot 接入

以下示例使用 `alemonjs@2.1.124` 和 `@alemonjs/qq-bot@2.1.46`。在项目目录运行 `alemonc platform add qq-bot` 安装并注册适配器。

## 登录与凭据

默认 WebSocket 模式支持使用已保存的 AppID 和 AppSecret，也支持扫码授权。手动配置时在 `alemon.config.yaml` 使用完整凭据对。

```yaml title="alemon.config.yaml"
login: qq-bot
qq-bot:
  app_id: 'YOUR_APP_ID'
  secret: 'YOUR_APP_SECRET'
```

适配器合并 `qq-bot` 和 `'@alemonjs/qq-bot'` 两个配置节。同名字段以包名配置节为准。已有多个账号时使用适配器的 `bots` 配置。Webhook 方式需要手动配置完整凭据及接收地址。[QQ Bot 快速开始](https://github.com/lemonade-lab/alemonjs/blob/3b582bf5abfc5af1397274f8d47f5661b4b8be3a/packages/qq-bot/GETTING_STARTED.md)

### 扫码登录

1. 使用默认 WebSocket 模式启动项目。没有完整的单机器人凭据且没有 `bots` 项时，适配器通过 CBP 发出二维码。
2. 用有机器人管理权限的手机 QQ 扫码并确认授权。扫码授权会重置 AppSecret，同一机器人在其他部署上的旧密钥也会失效。
3. 授权完成后，适配器把凭据写入 `alemon.config.yaml` 的 `qq-bot` 节，然后继续连接。授权超时、取消或写入失败时，本次连接会跳过。凭据写入失败时，检查实际配置文件路径和写权限。

如果已扫码成功却再次出现二维码，检查启动目录、`CFG_PATH` 以及两个配置节的覆盖关系。适配器在有效配置完全未提供账号字段和 `bots` 项时，会从原始配置文件恢复已保存的完整凭据对。显式配置了 AppID 或 AppSecret 中任一项时，应一并补全另一项。

接入后发送项目中的一条已知指令。开发 QQ 专用回复时，参阅[QQ 消息与交互](/docs/alemonjsDocs/advanced/qq-messages)。
