---
title: QQ Bot 接入
description: 配置 QQ 官方机器人、扫码登录，并发送 QQ Markdown 与指令按钮。
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

## Markdown 内联指令按钮

机器人需要具备对应会话的 Markdown 权限。使用原始标题和指令文本构造按钮。适配器会为输入型按钮编码，为自动发送按钮转义属性。

```ts
import { Format, useMessage } from 'alemonjs'

const [message] = useMessage()
const markdown = Format.createMarkdown()
  .addText('每日任务')
  .addButton('签到', { data: '/修仙 签到', autoEnter: true })

await message.send({ format: Format.create().addMarkdown(markdown) })
```

| 会话                                    | 点击结果                                                                           |
| --------------------------------------- | ---------------------------------------------------------------------------------- |
| C2C 私聊且 `autoEnter: true`            | 生成 `qqbot-cmd-enter`，点击自动发送。标签只携带经过属性转义的 `text`。            |
| 群聊、频道，或未请求自动发送的 C2C 私聊 | 生成 `qqbot-cmd-input`，点击将指令填入输入框。`text` 和 `show` 分别进行 URL 编码。 |

`qqbot-cmd-input` 的指令在编码前最多保留 80 个 UTF-16 单元，截断会保留完整的代理对。此限制适用于内联指令，独立按钮键盘的 `action.enter` 按键盘协议处理。使用 `addMarkdownOriginal()` 或原始 Markdown 内容手写标签时，由应用负责编码和会话兼容。没有 Markdown 权限时，可用 `markdownToText: true` 转为纯文本。

### QQ 专用 Markdown 语法

`@alemonjs/qq-bot/markdown` 导出 `QQMarkdown`。用 `addContent()` 插入任务列表、公式或文字效果，按目标 QQ 客户端验证显示。

```ts
import { Format } from 'alemonjs'
import { QQMarkdown } from '@alemonjs/qq-bot/markdown'

const markdown = Format.createMarkdown()
  .addContent(QQMarkdown.taskList({ text: '完成签到', checked: true }))
  .addContent(QQMarkdown.math(String.raw`\frac{a}{b}`, { block: true }))
  .addContent(QQMarkdown.color('提示', 'red'))
```

其他方法包括 `underline()`、`ruby()`、`boxed()` 和 `cancel()`。多平台应用可为其他平台准备普通 Markdown 或文本。[QQ 专用语法参考](https://github.com/lemonade-lab/alemonjs/blob/3b582bf5abfc5af1397274f8d47f5661b4b8be3a/packages/qq-bot/MARKDOWN_EXTENSIONS.md)

## 事件与图片素材

通过 [QQ 原始事件](/docs/alemonjsDocs/core/message-type) 处理尚未映射的推送。需要上传、查询和复用 Markdown 图片时，参见 [图片与平台素材](/docs/alemonjsDocs/advanced/media)。

## 群聊提及与指令面板

使用 `Format.create().addMention('everyone')` 可在群聊或文字子频道构造全体提及。平台会校验机器人权限和发送次数，群聊需要机器人具备管理员权限。C2C 私聊没有群全体提及。发送失败时查看平台返回的原因，避免重复发送公告。[QQ 消息格式及权限参考](https://github.com/lemonade-lab/alemonjs/blob/3b582bf5abfc5af1397274f8d47f5661b4b8be3a/packages/qq-bot/MESSAGES.md)

`usePanel()` 支持 `group`、`c2c`、`channel` 和 `direct`。其中 `direct` 表示频道私信，对应 QQ 的 `dm`。频道和频道私信只接受 `audience: 'all'`。

```ts
import { usePanel } from 'alemonjs'

const [panel] = usePanel({ Platform: 'qq-bot', BotId: 'YOUR_APP_ID' })
await panel.create({
  scope: 'direct',
  audience: 'all',
  panel: { items: [{ type: 'command', name: '帮助' }] }
})
await panel.list({ scope: 'channel' })
```
