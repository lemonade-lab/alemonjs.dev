---
sidebar_position: 1
---

# 简介

:::tip ALemonJS

[ALemonJS](https://github.com/lemonade-lab/alemonjs) ( 发音为 /əˈlemən/ ) 基于 JavaScript 所构建的聊天平台机器人开发框架

:::

The framework describes the operations to be performed by different events by defining response functions.

import Image from '@site/src/components/Image';
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
  <TabItem value="0" label="res.tsx" default>

```tsx title="Basic Example of Sending Messages"
import React from 'react'
import { Text, useSend } from 'alemonjs/jsx'
const selects = onSelects(['message.create'])
export default onResponse(selects, event => {
  const Send = useSend(event)
  Send(<Text>hello</Text>)
})
```

  </TabItem>
  <TabItem value="1" label="res.ts">
 
 
```ts title="Basic Example of Sending Messages" 
import { Text, useSend } from 'alemonjs'
const selects = onSelects(['message.create'])
export default onResponse(selects, event => {
  const Send = useSend(event)
  Send(Text('hello'))
})
```

  </TabItem>
</Tabs>

<Image src={require('@site/static/img/model.png')} />
