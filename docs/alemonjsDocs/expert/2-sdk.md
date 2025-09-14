---
sidebar_position: 2
---

# 个性化

:::tip

如何有效的为某一平台定制不同的逻辑

:::

非所有的平台都能描述完所有的功能

因此，你需要根据不同的平台来进行调整

## useClient

这是一个用来映射平台接口类的函数

```ts title="src/response/**/*/res.ts"
import {
  platform as qqbot,
  useClient
} from '@alemonjs/qq-bot'
const selects = onSelects(['message.create'])
export default onResponse(selects, event => {
  if (event.platform === qqbot) {
    const [client, value] = useClient(event)
    // 使用原生api和数据
  }
})
```

注意`platform`和`useClient`被约定为必须拥有的导出
