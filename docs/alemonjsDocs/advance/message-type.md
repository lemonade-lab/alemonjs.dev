---
label: '事件类型'
sidebar_position: 5
---

# 事件类型

命名规则：`{scope?}.{resource}.{action}`

- **无前缀**：公域事件（群/频道/服务器内发生）
- **`private.` 前缀**：私域事件（私聊/好友/一对一场景）

## 事件总览

```ts
type Events = {
  // ── 消息事件 ──
  'message.create': PublicEventMessageCreate
  'message.update': PublicEventMessageUpdate
  'message.delete': PublicEventMessageDelete
  'message.reaction.add': PublicEventMessageReactionAdd
  'message.reaction.remove': PublicEventMessageReactionRemove
  'message.pin': PublicEventMessagePin

  // ── 交互事件 ──
  'interaction.create': PublicEventInteractionCreate

  // ── 频道事件 ──
  'channel.create': PublicEventChannelCreate
  'channel.delete': PublicEventChannelDelete
  'channel.update': PublicEventChannelUpdate

  // ── 服务器事件 ──
  'guild.join': PublicEventGuildJoin
  'guild.exit': PublicEventGuildExit
  'guild.update': PublicEventGuildUpdate

  // ── 成员事件 ──
  'member.add': PublicEventMemberAdd
  'member.remove': PublicEventMemberRemove
  'member.ban': PublicEventMemberBan
  'member.unban': PublicEventMemberUnban
  'member.update': PublicEventMemberUpdate

  // ── 通知事件 ──
  'notice.create': PublicEventNoticeCreate

  // ── 私域消息事件 ──
  'private.message.create': PrivateEventMessageCreate
  'private.message.update': PrivateEventMessageUpdate
  'private.message.delete': PrivateEventMessageDelete

  // ── 私域交互事件 ──
  'private.interaction.create': PrivateEventInteractionCreate

  // ── 私域关系事件 ──
  'private.friend.add': PrivateEventRequestFriendAdd
  'private.friend.remove': PrivateEventRequestFriendRemove
  'private.guild.add': PrivateEventRequestGuildAdd

  // ── 私域通知事件 ──
  'private.notice.create': PrivateEventNoticeCreate
}
```

## 基础字段

所有事件都由以下基础类型组合而成。理解它们是理解每个事件字段的前提。

### Platform — 平台信息

每个事件都必定包含的字段。

| 字段       | 类型     | 必填 | 说明                                             |
| ---------- | -------- | ---- | ------------------------------------------------ |
| `Platform` | `string` | ✅   | 平台标识，如 `'onebot'`、`'discord'`、`'kook'`   |
| `BotId`    | `string` | ❌   | 当前机器人的用户 ID                              |
| `value`    | `any`    | ✅   | 原始协议数据，用于 `useValue()` 获取平台特有字段 |

### Guild — 服务器/群

公域事件中标识消息所在的服务器或群。

| 字段      | 类型     | 说明                           |
| --------- | -------- | ------------------------------ |
| `GuildId` | `string` | 服务器/群 ID                   |
| `SpaceId` | `string` | 空间 ID，通常与 `GuildId` 相同 |

### Channel — 子频道

公域事件中标识具体的聊天频道。对于不支持子频道的平台（如 QQ 群），`ChannelId` 等于 `GuildId`。

| 字段        | 类型     | 说明      |
| ----------- | -------- | --------- |
| `ChannelId` | `string` | 子频道 ID |

### User — 用户信息

标识触发事件的用户。

| 字段         | 类型      | 必填 | 说明                                                         |
| ------------ | --------- | ---- | ------------------------------------------------------------ |
| `UserId`     | `string`  | ✅   | 用户在平台上的原始 ID                                        |
| `UserKey`    | `string`  | ✅   | 跨平台唯一标识，由 `${Platform}:${UserId}` 哈希生成          |
| `UserName`   | `string`  | ❌   | 用户昵称                                                     |
| `UserAvatar` | `string`  | ❌   | 头像地址，支持 `https://`、`http://`、`base64://`、`file://` |
| `IsMaster`   | `boolean` | ✅   | 是否为机器人主人（在配置中设定）                             |
| `IsBot`      | `boolean` | ✅   | 是否为机器人用户                                             |

### Message — 消息标识

标识一条具体的消息。

| 字段        | 类型     | 必填 | 说明                            |
| ----------- | -------- | ---- | ------------------------------- |
| `MessageId` | `string` | ✅   | 消息唯一 ID                     |
| `ReplyId`   | `string` | ❌   | 当消息为回复时，被回复消息的 ID |

### MessageText — 文本内容

仅消息创建和交互创建事件携带。

| 字段          | 类型     | 说明             |
| ------------- | -------- | ---------------- |
| `MessageText` | `string` | 消息的纯文本内容 |

### MessageMedia — 媒体内容

仅消息创建事件携带。

| 字段           | 类型                 | 说明                 |
| -------------- | -------------------- | -------------------- |
| `MessageMedia` | `MessageMediaItem[]` | 媒体附件列表（可选） |

每个 `MessageMediaItem` 包含：

| 字段       | 类型                                                                  | 说明               |
| ---------- | --------------------------------------------------------------------- | ------------------ |
| `Type`     | `'image' \| 'audio' \| 'video' \| 'file' \| 'sticker' \| 'animation'` | 媒体类型           |
| `Url`      | `string`                                                              | 媒体资源 URL       |
| `FileId`   | `string`                                                              | 平台返回的文件标识 |
| `FileName` | `string`                                                              | 文件名             |
| `FileSize` | `number`                                                              | 文件大小（字节）   |
| `MimeType` | `string`                                                              | MIME 类型          |

### MessageOpen — 开放标识

仅消息创建和交互创建事件携带。

| 字段     | 类型     | 说明                                    |
| -------- | -------- | --------------------------------------- |
| `OpenId` | `string` | 平台开放 ID，部分平台需要此字段进行回复 |

### AutoFields — 框架自动注入

以下字段由框架自动填充，适配器无需手动设置，开发者可以直接读取。

| 字段       | 类型     | 说明                           |
| ---------- | -------- | ------------------------------ |
| `CreateAt` | `number` | 事件创建时间戳（`Date.now()`） |
| `DeviceId` | `string` | 来源设备编号                   |

### Expansion — 扩展字段

所有事件都包含 `[key: string]: any` 索引签名，允许适配器通过 `_tag` 等自定义字段携带平台特有信息。

---

## 公域事件

### message.create

**群/频道新消息**。这是最常用的事件，用户在群或频道中发送消息时触发。

组成：`platform` + `Guild` + `Channel` + `Message` + `User` + `MessageText` + `MessageMedia` + `MessageOpen`

### message.update

**群/频道消息编辑**。用户编辑已发送的消息时触发。

组成：`platform` + `Guild` + `Channel` + `Message` + `User`

> 不是所有平台都支持消息编辑事件。

### message.delete

**群/频道消息撤回**。消息被撤回或删除时触发。

组成：`platform` + `Guild` + `Channel` + `Message`

> 通常只有 `MessageId` 可用，不携带消息内容和用户信息。

### message.reaction.add

**表态/表情回应添加**。用户对消息添加表情回应时触发。

组成：`platform` + `Guild` + `Channel` + `Message`

### message.reaction.remove

**表态/表情回应移除**。用户移除已有的表情回应时触发。

组成：`platform` + `Guild` + `Channel` + `Message`

### message.pin

**消息置顶**。消息被置顶或取消置顶时触发。

组成：`platform` + `Guild` + `Channel` + `Message`

---

### interaction.create

**公域交互事件**。用户点击按钮、提交表单、使用斜杠命令等交互组件时触发。

组成：`platform` + `Guild` + `Channel` + `Message` + `User` + `MessageText` + `MessageOpen`

---

### channel.create

**子频道创建**。服务器中新建子频道时触发。

组成：`platform` + `Guild` + `Channel` + `Message`

> 仅支持频道层级结构的平台（如 Discord、Kook、QQ 频道）会触发此事件。

### channel.delete

**子频道删除**。服务器中删除子频道时触发。

组成：`platform` + `Guild` + `Channel` + `Message`

### channel.update

**子频道更新**。子频道名称、权限等属性变更时触发。

组成：`platform` + `Guild` + `Channel` + `Message`

---

### guild.join

**机器人加入服务器/群**。机器人被添加到新的服务器或群时触发。

组成：`platform` + `Guild` + `Channel` + `Message` + `User`

### guild.exit

**机器人退出服务器/群**。机器人被移出或主动退出服务器/群时触发。

组成：`platform` + `Guild` + `Channel` + `Message` + `User`

### guild.update

**服务器/群信息更新**。服务器名称、图标、设置等属性变更时触发。

组成：`platform` + `Guild` + `Channel` + `Message`

---

### member.add

**成员加入**。新用户加入服务器/群时触发。

组成：`platform` + `Guild` + `Channel` + `Message` + `User`

### member.remove

**成员离开**。用户离开或被踢出服务器/群时触发。

组成：`platform` + `Guild` + `Channel` + `Message` + `User`

### member.ban

**成员封禁/禁言**。成员被封禁或禁言时触发。

组成：`platform` + `Guild` + `Channel` + `Message` + `User`

### member.unban

**成员解封/解禁**。成员被解除封禁或禁言时触发。

组成：`platform` + `Guild` + `Channel` + `Message` + `User`

### member.update

**成员属性变更**。成员的角色、管理权限等属性发生变化时触发。

组成：`platform` + `Guild` + `Channel` + `Message` + `User`

> 典型场景：管理员设置/取消、角色变更。

---

### notice.create

**公域平台通知**。不属于消息、成员变动的其他平台级通知事件。

组成：`platform` + `Guild` + `Channel` + `Message` + `User`

> 典型场景：戳一戳、运气王、荣誉变更等平台特有的互动通知。可通过 `useValue()` 获取原始数据以区分具体通知类型。

---

## 私域事件

### private.message.create

**私聊新消息**。用户通过私聊/好友会话向机器人发送消息时触发。

组成：`platform` + `Message` + `User` + `MessageText` + `MessageMedia` + `MessageOpen`

> 与 `message.create` 的区别：不含 `Guild` 和 `Channel` 字段。

### private.message.update

**私聊消息编辑**。私聊中的消息被编辑时触发。

组成：`platform` + `Message` + `User`

### private.message.delete

**私聊消息撤回**。私聊中的消息被撤回时触发。

组成：`platform` + `Message`

---

### private.interaction.create

**私域交互事件**。私聊中用户与交互组件交互时触发。

组成：`platform` + `Message` + `User` + `MessageText` + `MessageOpen`

---

### private.friend.add

**好友添加**。收到好友申请或好友关系建立时触发。

组成：`platform` + `Message` + `User`

### private.friend.remove

**好友移除**。好友关系解除时触发。

组成：`platform` + `Message` + `User`

### private.guild.add

**入群/入服务器请求**。用户申请加入群或服务器时触发。

组成：`platform` + `Message` + `User`

---

### private.notice.create

**私域平台通知**。私聊场景下的平台特有通知事件。

组成：`platform` + `Message` + `User`

---

## 类型工具

```ts
// 携带消息体的事件集合（支持 Words 文本匹配的事件）
type EventsMessageCreate = Pick<
  Events,
  | 'message.create'
  | 'private.message.create'
  | 'interaction.create'
  | 'private.interaction.create'
>

// 所有事件名的联合类型
type EventKeys = keyof Events

// 所有事件类型的联合类型
type EventsEnum = Events[EventKeys]
```
