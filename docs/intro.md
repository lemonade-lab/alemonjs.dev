---
sidebar_position: 1
label: '简介'
---

# 简介

:::tip

[ALemonJS](https://github.com/lemonade-lab/alemonjs) ( 发音为 /əˈlemən/ ) 基于 JavaScript 所构建的聊天平台机器人开发框架

:::

在本文中，描述ALemonJS 都称为“框架”。

框架主要通过定义响应函数来描述不同类型的事件将要执行的内容。

```ts title="Hello Word!"
import { useMessage, Format } from 'alemonjs'
// 最简例
export default e => {
  // 使用发送函数
  const [message] = useMessage(e)
  const format = Format.create().addText('hello word')
  message.send({ format })
}
```
