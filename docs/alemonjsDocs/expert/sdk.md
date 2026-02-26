---
label: '个性化'
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
import { API, platform } from '@alemonjs/qq-bot'
import { useClient } from 'alemonjs'
export default event => {
  // 得到qq-bot平台的个人信息
  if (event.Platform === platform) {
    // 调用
    const [client] = useClient(event, API)
    // 直接调用对应平台接口规范
    client.usersMe()
  }
}
```

注意`platform`和`API`被约定为必须拥有的导出
