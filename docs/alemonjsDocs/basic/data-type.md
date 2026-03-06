---
label: '消息格式'
sidebar_position: 5
---

# 消息格式

:::info

一些常用的消息格式说明

:::

> 可能存在部分平台不支持一些个性效果，实际以对应平台的要求为准

> 如果想更定制化发送消息，请了解对应平台包client接口说明

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

  // 情况1 能完全按顺序渲染
  // 情况2 不支持图文，大概率会整个全部文本后发送，再接着发送
  // 情况3 仅支持 文本再图片，大概率会整个全部文本后跟随渲染图片
  // ⚠️大部分平台是不支持机器人发送多图的

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

这是一个不推荐使用的消息格式，用于不考虑兼容性，直接最大可能的写md

`)
```
