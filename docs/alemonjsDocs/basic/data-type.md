---
label: '数据格式'
sidebar_position: 5
---

# 数据格式

使用相同的 API 构建消息内容，由各平台包负责将其转换为平台原生格式。

消息发送的返回值为 `ClientAPIMessageResult[]`，即 `[res1, res2, ...]`。数组中的每一项对应一次实际的平台 API 调用。

**核心原则：**

- **不支持的数据格式，一律逐步降级到 Text。**
- **媒体消息无法向后合并时，优先发送媒体，再发后续内容。**
- **Markdown 与 Text 互相转换**：平台支持哪个，就合并到哪个格式发送，始终只产出一条消息。

### Text

```ts title="src/response/**/*/res.ts"
import { useMessage, Format } from 'alemonjs'
export default event => {
  // 创建
  const [message] = useMessage(event)
  const format = Format.create().addText('hello').addText(' ').addText('word')
  message.send({ format })
}
```

### Image

```ts title="src/response/**/*/res.ts"
import { useMessage, Format } from 'alemonjs'
import JPEG_PATH from '@src/assets/test.jpeg'
import { readFileSync } from 'node:fs'

export default event => {
  const [message] = useMessage(event)

  // 支持 Buffer、base64://、https://、file://
  message.send({
    format: Format.create().addImage(JPEG_PATH)
  })
}
```

### Image&Text

💡 不推荐使用的操作

```ts
import { useMessage, Format } from 'alemonjs'
import JPEG_PATH from '@src/assets/test.jpeg'

export default event => {
  const [message] = useMessage(event)

  const format = Format.create().addText('hello word').addImage(JPEG_PATH)

  message.send({ format: format })
}
```

### Mention&Text

```ts title="response/**/*/res.ts"
import { useMessage, Text, Mention, Format } from 'alemonjs'
export default event => {
  const [message] = useMessage(event)
  // 发送多种类型的消息

  message.send({
    format: Format.create()
      .addText('hello ')
      .addMention(event.UserId)
      .addText(', How are things going?')
  })

  // @ all
  message.send({
    format: Format.create().addMention()
  })

  // @ channel
  message.send({
    format: Format.create().addMention(event.ChannelId, {
      belong: 'channel'
    })
  })
}
```

### Audio

```ts title="src/response/**/*/res.ts"
import { useMessage, Format } from 'alemonjs'
import MP3_PATH from '@src/assets/test.mp3'

export default event => {
  const [message] = useMessage(event)

  // 支持 base64://、https://、file://
  message.send({
    format: Format.create().addAudio(MP3_PATH)
  })
}
```

### Video

```ts title="src/response/**/*/res.ts"
import { useMessage, Format } from 'alemonjs'
import MP4_PATH from '@src/assets/test.mp4'

export default event => {
  const [message] = useMessage(event)

  // 支持 base64://、https://、file://
  message.send({
    format: Format.create().addVideo(MP3_PATH)
  })
}
```

### Attachment

💡 即File，为避免和js全局对象冲突，用Attachment代替

```ts title="src/response/**/*/res.ts"
import { useMessage, Format } from 'alemonjs'
import DOCS_PATH from '@src/assets/test.docs'

export default event => {
  const [message] = useMessage(event)

  // 支持 base64://、https://、file://
  message.send({
    format: Format.create().addAttachment(DOCS_PATH)
  })
}
```

### ButtonGroup

⚠️ 框架把按钮视为一组5\*5的排列，超过将不确保有效发送或渲染

```ts
import { useMessage, Format } from 'alemonjs'

export default event => {
  const [message] = useMessage(event)

  // 一行多个
  message.send({
    format: Format.create().addButtonGroup(
      Format.createButtonGroup()
        .addRow()
        .addButton('开始', '/开始游戏')
        .addButton('结束', '/结束游戏')
    )
  })

  // 多行多个
  message.send({
    format: Format.create().addButtonGroup(
      Format.createButtonGroup()
        .addRow()
        .addButton('开始', '/开始游戏')
        .addButton('结束', '/结束游戏')
        .addRow()
        .addButton('退出', '/退出游戏')
        .addButton('注销', '/注销账户')
    )
  })

  // 更多类型
  message.send({
    format: Format.create().addButtonGroup(
      Format.createButtonGroup()
        // link
        .addRow()
        .addButton('访问文档', 'https://alemonjs.com/', { type: 'link' })
        // call
        .addRow()
        .addButton('是否同意', '/同意', { type: 'call' })
        // 自动发送 + 显示子频道list + 禁用提示
        .addRow()
        .addButton('哈哈', '/哈哈', {
          autoEnter: false,
          showList: true,
          toolTip: '不支持'
        })
    )
  })
}
```

- absorb

```ts
const format = Format.create()
const bt = Format.createButtonGroup()
const bt2 = Format.createButtonGroup()

// 吸收bt2的按钮
bt.absorb(bt2)

format.addButtonGroup(md)
```

### MarkDown

```ts
import { useMessage, Format } from 'alemonjs'

export default event => {
  const [message] = useMessage(event)

  const format = Format.create()
  const md = Format.createMarkdown()

  md
    // @UserId
    .addMention('<event.UserId>')
    // 换行
    .addNewline()
    // Button，⚠️部分平台不支持
    .addButton('你好', { data: '/你好' })
    // 标题
    .addTitle('标题！！')
    // 副标题
    .addSubtitle('子标题')
    // 普通文本
    .addText('普通文本')
    // 加粗
    .addBold('加粗')
    // 斜体
    .addItalic('斜体')
    // 星号斜体
    .addItalicStar('星号斜体')
    // 删除线
    .addStrikethrough('删除线')
    // 链接
    .addLink('链接', 'https://www.baidu.com')
    // 图片
    .addImage('https://www.baidu.com/img/bd_logo1.png', {
      width: 100,
      height: 100
    })
    // 有序列表
    .addList(
      { index: 1, text: '有序列表' },
      { index: 2, text: '有序列表' },
      { index: 3, text: '有序列表' },
      { index: 4, text: '有序列表' }
    )
    // 无序列表
    .addList('无序列表', '无序列表', '无序列表', '无序列表', '无序列表')
    // 块引用 \n>XXX
    .addBlockquote('块引用')
    // \n\n 结束
    .addNewline(2)
    // 水平分割线
    .addDivider()

  format.addMarkdown(md)

  message.send({ format })
}
```

- absorb

```ts
const format = Format.create()
const md = Format.createMarkdown()

md.addText('hello')
md.addText(' ')

const md2 = Format.createMarkdown()
md2.addText('word')

// md对md2进行吸收
md.absorb(md2)

format.addMarkdown(md) // hello word
```

### MarkdownOriginal

```ts
import { Format } from 'alemonjs'

const format = Format.create()

format.addMarkdownOriginal(`

# 标题
## 子标题

这是一个不推荐使用的数据格式，用于不考虑兼容性，直接最大可能的写md

`)
```

## 三级优先级

消息中可能同时包含多种数据类型。平台包按照以下优先级从高到低处理：

```
优先级 1（媒体）  ──  Image / ImageURL / ImageFile / Audio / Video / Attachment
       ↓
优先级 2（富文本）──  Markdown / ButtonGroup / MarkdownOriginal
       ↓
优先级 3（基础）  ──  Text / Link / Mention
```

---

## 发送规则

### 高优先级优先发送

当存在优先级 1 的媒体内容时，**先发媒体**。如果平台支持图文合并（如 caption），则低优先级内容随媒体一起发出，只产出一次调用。如果不支持合并，则拆分为多次：先发媒体，再发后续内容。

### MD 与 Text 互为转换

Markdown 和 Text 是**同一层信息的两种表达**。调用发送时：

- 平台**支持 Markdown** → Text 内容合并进 Markdown，只发一条 `[res(md)]`
- 平台**不支持 Markdown** → Markdown 降级为纯文本，合并到 Text，只发一条 `[res(text)]`

**不论平台是否支持，MD 和 Text 不会分成两次 API 调用。它们必须合并为一个格式输出。**

### 不支持的格式逐步降级到 Text

任何平台不支持的数据类型，都会先尝试转为同优先级的替代格式，最终兜底到 Text：

```
ButtonGroup  →  降级为 "[按钮名1] [按钮名2]" 文本
Markdown     →  降级为 "【标题】\n内容..." 文本
Audio/Video  →  降级为 "[音频: url]" / "[视频: url]" 文本
Attachment   →  降级为 "[附件: url]" 文本
```

### 无高优先级内容时依次降级

如果消息中没有媒体，直接检查优先级 2；如果也没有，发送优先级 3 纯文本。全空则返回 `[]`。

---

## 发送流程

```
DataEnums[] 输入
    │
    ├─ 1. 提取优先级 1：Image / Audio / Video / Attachment
    │     有媒体？
    │     ├── 是 → 发送媒体消息
    │     │     ├── 支持图文合并 → 低优先级内容作为 caption → [res1]
    │     │     └── 不支持合并  → 先发媒体 [res1]，剩余内容继续向下 ↓
    │     └── 否 → 继续向下 ↓
    │
    ├─ 2. 合并优先级 2 + 3：MD / Buttons / Text / Link / Mention
    │     有 Markdown？
    │     ├── 支持 MD   → Text 合并进 MD → [res(md)]
    │     └── 不支持 MD → MD 降级为文本，合并到 Text → [res(text)]
    │     有 ButtonGroup？
    │     ├── 支持按钮   → 随 MD/Text 一起发送
    │     └── 不支持按钮 → 降级为文本，合并到内容中
    │
    ├─ 3. 仅有 Text / Link / Mention？
    │     └── 发送纯文本 → [res(text)]
    │
    └─ 4. 无内容 → []
```

---
