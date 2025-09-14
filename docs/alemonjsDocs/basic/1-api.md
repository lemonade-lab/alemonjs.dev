---
sidebar_position: 1
---

# 响应

:::info

定义响应函数

:::

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## `onResponse`

通过定义响应函数来描述不同类型的事件将要执行的内容

```ts title="src/response/**/*/res.ts"
// 选择事件类型
const selects = onSelects(['message.create'])
// 定义响应函数
export default onResponse(selects, (event, next) => {
  // 前往下一个响应,不执行则响应到此处后，立即停止。
  next()
})
```

:::info

在`response`目录中新建任意名文件夹和res.ts文件，框架会在启动后记录文件索引

:::

### 匹配

```ts title="src/response/**/*/res.ts"
// 不匹配该正则，自动进行next
export const regular = /^(#|\/)?hello$/
const selects = onSelects(['message.create'])
export default onResponse(selects, event => {
  // your code
})
```

```ts title="src/response/**/*/res.ts"
import { Regular } from 'alemonjs/utils'

// 如果想要同时匹配多个正则
const regular$1 = /^(#|\/)?hello$/
const regular$2 = /^(#|\/)?word$/

export const regular = Regular.or(regular$1, regular$2)

const selects = onSelects(['message.create'])

export default onResponse(selects, event => {
  if (regular$1.test(event.MessageText)) {
    //
  } else if (regular$2.test(event.MessageText)) {
    //
  }
})
```

### 分组

> 共用一个 next

```ts
const selects = onSelects(['message.create'])

const response$1 = onResponse(selects, (event, next) => {
  console.log('step 1')
  // 允许在同组响应中，继续后续的函数
  return true
})

const response$2 = onResponse(selects, (event, next) => {
  console.log('step 2')
  return {
    // 允许分组，等同于 return true
    allowGrouping: true
  }
})

const response$3 = onResponse(selects, (event, next) => {
  console.log('step 3')
})

export default onResponse(selects, [
  response$1.current,
  response$2.current,
  response$3.current
])
```

### 调用

> 可以return任意对象，除了约定的值需要注意之外

```ts
const selects = onSelects(['message.create'])

const response$1 = onResponse(selects, (event, next) => {
  return {
    id: 0
  }
})

const response = onResponse(selects, (event, next) => {
  const res = response$1.current(event, next)
  console.log('获得指定res的id', res.id)
})

export default response
```
