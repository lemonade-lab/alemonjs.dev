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
import { useMessage } from 'alemonjs'
export default event => {
  // 创建
  const [message] = useMessage(event)

 // ex 1
 message.send({
  format: Format.create().addText('标题', { style: 'bold' }), Text('被加粗了'))
 })

  // ex 2
 message.send({
  format: Format.create().addText('这个').addText('标题').addText('没有变化')
 })

  // ex 3
  message.send({
  format: Format.create().addText(`// 我的代码块 \nconst Send = useSend(event)`, {
        style: 'block'
      })
 })
```

### Image

```ts title="src/response/**/*/res.ts"
import { useMessage, Format } from 'alemonjs'
import jpgURL from '@src/assets/test.jpeg'
import { readFileSync } from 'node:fs'

export default event => {
  const [message] = useMessage(event)

  // file
  message.send({
    format: Format.create().addImageFile(jpgURL)
  })

  // url
  message.send({
    format: Format.create().addImageURL('https://xxx.com/yyy.png')
  })

  // buffer
  const img = readFileSync(jpgURL)
  message.send({
    format: Format.create().addImage(img)
  })
}
```

### Mention

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

### Button

```ts
import { useMessage, Format } from 'alemonjs'

export default event => {
  const [message] = useMessage(event)

  // 一行多个
  message.send({
    format: Format.create().addButtonGroup(
      Format.create()
        .createButtonGroup()
        .addRow()
        .addButton('开始', '/开始游戏')
        .addButton('结束', '/结束游戏')
    )
  })

  // 多行多个
  message.send({
    format: Format.create().addButtonGroup(
      Format.create()
        .createButtonGroup()
        .addRow()
        .addButton('开始', '/开始游戏')
        .addButton('结束', '/结束游戏')
        .addRow()
        .addButton('退出', '/退出游戏')
        .addButton('注销', '/注销账户')
    )
  })

  // 更多类型
  const format = Format.create()
  format.addButtonGroup(
    format
      .createButtonGroup()
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
  message.send({ format })
}
```

### MarkDown

```ts
import { useMessage, Format } from 'alemonjs'

export default event => {
  const [message] = useMessage(event)

  const format = Format.create()
  const md = format.createMarkdown()

  md
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
    // 块引用
    .addBlockquote('块引用')
    // 水平分割线
    .addDivider()
    // 换行
    .addNewline()
    // 换多行
    .addNewline(true)

  format.addMarkdown(md)

  message.send({ format })
}
```
