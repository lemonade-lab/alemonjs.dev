---
title: 图片与平台素材
description: 用结构化图片来源发送消息，或提前上传并复用 QQ Markdown 素材。
sidebar_position: 8
---

# 图片与平台素材

`Media.image()` 接受 `{ url }`、`{ filePath }` 或 `{ data, name }` 三种来源。每次只选一种。URL 支持 HTTP 和 HTTPS，文件路径需在适配器进程所在机器可读，`data` 为 Base64 字符串。

## 发送图片

在消息处理函数内，可把同一张图片放在普通消息或结构化 Markdown 中。构造消息时只保存来源，调用 `send()` 时才准备对应位置所需的资源。

```ts
import { Format, Media, useMessage } from 'alemonjs'

const [message] = useMessage()
const image = Media.image({ url: 'https://example.com/chart.png' })

await message.send(Format.create().addImage(image).value)

const markdown = Format.createMarkdown().addText('今日统计').addImage(image)
await message.send(Format.create().addMarkdown(markdown).value)
```

## 管理 QQ Markdown 素材

使用 `@alemonjs/qq-bot` 时，可提前上传并复用同一机器人的 Markdown 图片素材。普通消息图片使用 `usage: 'message'`，Markdown 图片使用 `usage: 'markdown'`。已上传的资源必须匹配用途、平台、机器人及资源记录的目标范围。

```ts
import { Format, ResultCode, useMedia, useMessage } from 'alemonjs'

const [media] = useMedia()
const [message] = useMessage()
const uploaded = await media.upload({
  type: 'image',
  filePath: '/absolute/path/chart.png',
  usage: 'markdown'
})

if (uploaded.code === ResultCode.Ok) {
  const markdown = Format.createMarkdown().addImage(uploaded.data)
  await message.send(Format.create().addMarkdown(markdown).value)
}
```

- 查看当前平台的能力时调用 `media.capabilities()`。QQ Markdown 素材可用 `media.list({ usage: 'markdown' })` 分页查询，确认无需继续复用后，可用 `media.delete(resource)` 删除。
- 调用 `upload()` 时省略 `usage` 会沿用旧上传接口并返回原有回执。要构建结构化图片节点，请给出用途并使用返回的资源对象。
- 适配器缺少 Markdown 素材支持、图片无法读取或资源归属不匹配时，发送可能在准备阶段失败。检查发送结果中的 `media?.stage` 和 `media?.resources`，后者保留已经准备成功的资源，便于发起重试。

## 检查准备或发送失败

对发送返回的每条结果检查 `code` 与 `media?.stage`。`stage: 'prepare'` 表示素材准备失败，此时框架会停止发送该消息。`stage: 'send'` 表示进入发送阶段。无结构化资源的旧消息结果仍可直接按 `code` 检查。

排除问题后，可复用 `media.resources` 中已准备成功、归属和用途匹配的素材。是否重发由应用决定，避免重复投递。

QQ Markdown 素材归当前机器人，可在事件外用 `useMedia({ Platform: 'qq-bot', BotId: 'YOUR_APP_ID' })` 管理。普通图片资源需要实际消息目标。平台配额、素材过期和外部删除都可能导致发送失败。检查 `media.capabilities()` 了解平台的大小、数量和管理操作支持。
