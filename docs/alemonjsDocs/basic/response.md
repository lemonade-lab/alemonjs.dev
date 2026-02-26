---
label: '响应'
sidebar_position: 1
---

# 响应

:::info

定义响应函数

:::

## `createEvent`

创建event，验证event是否符合预期

```ts
import { createEvent } from 'alemonjs'
// 参数 e 事件数据包，next 流程控制器
export default (e, next) => {
  // 创建事件
  const event = createEvent({
    event: e,
    selects: ['message.create'],
    // 以下配置可选
    regular: /hello/, // 不设置，默认为false
    prefix: '/', // 不设置，默认为false
    exact: '/hello' // 不设置，默认为false
  })
  // 事件不匹配。或...
  if (!event.selects || !event.regular || !event.prefix || !event.exact) {
    next()
    return
  }
}
```
