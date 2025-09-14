---
sidebar_position: 9
---

# 工具函数

:::tip

框架内置了一些常用的方法，以减少开发成本

:::

## Regular

继承于`RegExp`的class

```ts title="index.ts"
import { Regular } from 'alemonjs/utils'

const regular$1 = /^(#|\/)?hello$/
const regular$2 = /^(#|\/)?word$/

const regular = Regular.or(regular$1, regular$2)
```

## getPublicIP

获取公网IP，如果有的话

> 基于 `public-ip`

```ts title="index.ts"
import { getPublicIP } from 'alemonjs/utils'

const regular = getPublicIP()
```

## Counter

计数器

## createQRCode

把指定内容转为二维码图片

## getBufferByURL

请求URL，并得到Buffer
