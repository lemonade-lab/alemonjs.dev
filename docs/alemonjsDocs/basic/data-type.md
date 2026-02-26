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
import { Text, useMessage } from 'alemonjs'
export default event => {
  // 创建
  const [message] = useMessage(event)
  message.send(
    format(Text('这个'), Text('标题', { style: 'bold' }), Text('被加粗了'))
  )
  message.send(format(Text('这个'), Text('标题'), Text('没有变化')))
  message.send(
    format(
      Text(`// 我的代码块 \nconst Send = useSend(event)`, {
        style: 'block'
      })
    )
  )
}
```

### Image

```ts title="src/response/**/*/res.ts"
import { useMessage, Image } from 'alemonjs'
import jpgURL from '@src/assets/test.jpeg'
import { readFileSync } from 'node:fs'
export default event => {
  const [message] = useMessage(event)
  const { url, file } = Image
  // file
  message.send(format(file(jpgURL)))
  // url
  message.send(format(url('https://xxx.com/yyy.png')))
  // buffer
  const img = readFileSync(jpgURL)
  message.send(format(Image(img)))
}
```

### Mention

```ts title="response/**/*/res.ts"
import { useMessage, Text, Mention } from 'alemonjs'
export default event => {
  const [message] = useMessage(event)
  // 发送多种类型的消息
  message.send(
    format(
      Text('Hello '),
      Mention(event.UserId),
      Text(', How are things going?')
    )
  )
  // @ 所有人
  message.send(format(Mention()))
  // @ channel
  message.send(
    format(
      Mention(event.ChannelId, {
        belong: 'channel'
      })
    )
  )
}
```

### Button

```ts
import { BT, useMessage } from 'alemonjs'
export default event => {
  const [message] = useMessage(event)

  const { group, row } = BT

  // 一行多个
  message.send(
    format(group(row(BT('开始', '/开始游戏'), BT('结束', '/结束游戏'))))
  )

  // 多行多个
  message.send(
    format(
      group(
        row(BT('开始', '/开始游戏'), BT('结束', '/结束游戏')),
        row(BT('退出', '/退出游戏'), BT('注销', '/注销账户'))
      )
    )
  )

  // 更多类型
  message.send(
    format(
      group(
        // link
        row(
          BT('访问文档', 'https://alemonjs.com/', {
            type: 'link'
          })
        ),
        row(
          BT('是否同意', '/同意', {
            type: 'call'
          })
        ),
        // 自动发送 + 显示字频道list + 禁用提示
        row(
          BT('哈哈', '/哈哈', {
            autoEnter: false,
            showList: true,
            toolTip: '不支持'
          })
        )
      )
    )
  )

  const { template } = BT

  // 使用申请好的模板（特定平台下使用）
  message.send(format(template('template_id')))

  // 向申请的模板注入参数
  message.send(format(template('template_id')))
}
```

### MarkDown

```ts
import { MD, useMessage } from 'alemonjs'
export default event => {
  const [message] = useMessage(event)

  const {
    text,
    title,
    bold,
    italicStar,
    strikethrough,
    link,
    image,
    list,
    listItem,
    blockquote,
    divider,
    newline
  } = MD

  message.send(
    format(
      MD(
        // 标题
        title('标题！！'),
        // 副标题
        subtitle('子标题'),
        text('普通文本'),
        // 加粗
        bold('加粗'),
        // 斜体
        italic('斜体'),
        // 星号斜体
        italicStar('星号斜体'),
        // 删除线
        strikethrough('删除线'),
        // 链接
        link('链接', 'https://www.baidu.com'),
        // 图片
        image('https://www.baidu.com/img/bd_logo1.png', {
          width: 100,
          height: 100
        }),
        // 有序列表
        list(
          listItem(1, '有序列表'),
          listItem(2, '有序列表'),
          listItem(3, '有序列表'),
          listItem(4, '有序列表')
        ),
        // 无序列表
        list(
          listItem('无序列表'),
          listItem('无序列表'),
          listItem('无序列表'),
          listItem('无序列表'),
          listItem('无序列表')
        ),
        // 块引用
        blockquote('块引用'),
        // 水平分割线
        divider(),
        // 换行
        newline(),
        // 换多行
        newline(true)
      )
    )
  )

  const { template } = MD

  // 向申请的模板注入参数
  message.send(format(template('template_id', { title: '你好' })))
}
```
