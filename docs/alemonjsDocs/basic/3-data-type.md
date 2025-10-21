---
sidebar_position: 3
---

# 消息格式

:::info

一些常用的消息格式说明

:::

> 可能存在部分平台不支持一些个性效果，实际以对应平台的要求为准

> 如果想更定制化发送消息，请了解对应平台包client接口说明

import BubblePreview from '@site/src/components/BubblePreview';

### Text

```ts title="src/response/**/*/res.ts"
import { Text, useMessage } from 'alemonjs'
const selects = onSelects(['message.create'])
export default onResponse(selects, event => {
  // 创建
  const [message] = useMessage(event)
  message.send(
    format(
      Text('这个'),
      Text('标题', { style: 'bold' }),
      Text('被加粗了')
    )
  )
  message.send(
    format(Text('这个'), Text('标题'), Text('没有变化'))
  )
  message.send(
    format(
      Text(`// 我的代码块 \nconst Send = useSend(event)`, {
        style: 'block'
      })
    )
  )
})
```

<BubblePreview codeKey="text" />

### Image

```ts title="src/response/**/*/res.ts"
import { useMessage, Image } from 'alemonjs'
import jpgURL from '@src/assets/test.jpeg'
import { readFileSync } from 'node:fs'
const selects = onSelects(['message.create'])
export default onResponse(selects, event => {
  const [message] = useMessage(event)
  const { url, file } = Image
  // file
  message.send(format(file(jpgURL)))
  // url
  message.send(format(url('https://xxx.com/yyy.png')))
  // buffer
  const img = readFileSync(jpgURL)
  message.send(format(Image(img)))
})
```

### Mention

```ts title="response/**/*/res.ts"
import { useMessage, Text, Mention } from 'alemonjs'
const selects = onSelects(['message.create'])
export default onResponse(selects, event => {
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
})
```

<BubblePreview codeKey="mention" />

### Button

```ts
import { BT, useMessage } from 'alemonjs'
const selects = onSelects(['message.create'])
const response = onResponse(selects, event => {
  const [message] = useMessage(event)

  const { group, row } = BT

  // 一行多个
  message.send(
    format(
      group(
        row(
          BT('开始', '/开始游戏'),
          BT('结束', '/结束游戏')
        )
      )
    )
  )

  // 多行多个
  message.send(
    format(
      group(
        row(
          BT('开始', '/开始游戏'),
          BT('结束', '/结束游戏')
        ),
        row(
          BT('退出', '/退出游戏'),
          BT('注销', '/注销账户')
        )
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
})
export default response
```

<BubblePreview codeKey="button" minHeight="22rem" />

### MarkDown

```ts
import { MD, useMessage } from 'alemonjs'
const selects = onSelects(['message.create'])
const response = onResponse(selects, event => {
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
  message.send(
    format(template('template_id', { title: '你好' }))
  )
})
export default response
```

<BubblePreview codeKey="md" minHeight="45rem" />

### Ark

:::warning

实验性功能

:::

```ts title="response/**/*/res.ts"
import { Ark, useMessage } from 'alemonjs'
const selects = onSelects(['message.create'])
export default onResponse(selects, event => {
  const [message] = useMessage(event)

  const { Card, BigCard } = Ark

  // 普通卡片
  message.send(
    format(
      Card({
        decs: '你是谁',
        title: '收你来啦',
        prompt: '通知信息！！',
        metadecs: '阿柠檬2正式版发送',
        cover:
          'https://pub.idqqimg.com/pc/misc/files/20190820/2f4e70ae3355ece23d161cf5334d4fc1jzjfmtep.png',
        link: '',
        subtitle: '赞赞赞'
      })
    )
  )

  // 大图卡片
  message.send(
    format(
      BigCard({
        title: '收你来啦',
        prompt: '通知信息！！',
        cover:
          'https://pub.idqqimg.com/pc/misc/files/20190820/2f4e70ae3355ece23d161cf5334d4fc1jzjfmtep.png',
        link: '',
        subtitle: '赞赞赞'
      })
    )
  )

  const { listTip, list, listContent, listItem } = Ark

  // 列表
  message.send(
    format(
      list(
        listTip({
          desc: '状态扭转',
          prompt: '状态扭转'
        }),
        listContent(
          listItem('需求标题：UI问题解决'),
          listItem('点击下列动作直接扭转状态到：'),
          listItem({
            title: '状态1',
            link: 'https://alemonjs.com?status=1'
          }),
          listItem({
            title: '状态2',
            link: 'https://alemonjs.com?status=2'
          }),
          listItem('请关注')
        )
      )
    )
  )
})
```
