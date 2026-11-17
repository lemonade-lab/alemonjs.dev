---
title: 路由 DSL
description: 使用链式 API 配置指令分组、前缀和参数。
sidebar_position: 7
---

# 路由 DSL

通过链式 API 配置指令分组、前缀、参数和匹配失败时的提示。

## 最小示例

```ts
import { Router } from 'alemonjs'

const router = Router.create({
  events: ['message.create', 'private.message.create']
})

router.res({}, () => import('@src/response/resMaintenance'))

const app = router.group(
  {
    routeText: {
      prefixes: ['/', '#', '＃', '!', '！'],
      stripPrefix: true,
      allowBare: true
    },
    keyPolicy: {
      maxWords: 2
    }
  },
  () => import('@src/response/mw')
)

app.use(['帮助', 'help'], () => import('@src/response/help'))

export default router.define
```

---

## 基本结构

基本结构包含四个方法：

1. `Router.create(...)`
   创建路由容器，设置顶层 `res` 的默认事件和平台。

2. `router.res(...)`
   注册顶层前置逻辑。

3. `group(...)`
   创建共享中间件和输入规则的指令组。

4. `use(...)`
   注册具体命令。

---

## 前置处理

`router.res(...)` 只放顶层前置逻辑。

适合放：

- 维护模式
- 新手引导
- select 转义
- 其他“消息一进来就要先检查”的逻辑

### 懒加载

```ts
router.res({}, () => import('@src/response/resGuide'))
```

### 注意

顶层 `res` 往后放行要用：

```ts
next()
```

以下返回值不能代替 `next()`：

```ts
return true
```

---

## 指令分组

`group(...)` 表示“这一组命令共享同一套规则”。

适合放：

- 共享中间件
- 输入前缀规则
- key 提取规则
- fallback 提示策略
- redispatch 深度
- duplicateKey 策略

### 基本写法

```ts
const app = router.group(
  {
    events: ['message.create', 'private.message.create']
  },
  () => import('@src/response/mwBan'),
  () => import('@src/response/mw')
)
```

### 嵌套写法

```ts
const captcha = router.group(
  {
    fallback: {
      suggest: false
    }
  },
  () => import('@src/response/mwCaptcha')
)
```

---

## 注册指令

`use(...)` 注册具体命令。

### 1. 单条命令

```ts
app.use('我', () => import('@src/response/message/me/res'))
```

### 2. 多个命令共用同一个实现

```ts
app.use(['帮助', '修仙帮助', 'help'], () => import('@src/response/help'))
```

### 3. 带参数规则

```ts
app.use(
  {
    path: '任务设置',
    schema: {
      usage: '/任务设置 <槽位> <步骤> <内容>',
      args: [
        { name: 'slot', rules: [{ type: 'number', min: 1 }] },
        { name: 'step', rules: [{ type: 'number', min: 1 }] },
        { name: 'content', rules: [{ type: 'rest' }] }
      ]
    }
  },
  () => import('@src/response/task/settings/res')
)
```

### 4. 多条配置化命令共用一个实现

```ts
app.use(
  [
    { path: '学习功法', schema: skillSchema },
    { path: '隐藏功法', schema: hideSchema }
  ],
  () => import('@src/response/skillBook/res')
)
```

---

## 指令名称

### 内部 key 一律不带前缀

正确：

```ts
app.use('签到', ...);
app.use('任务设置', ...);
```

不要写：

```ts
app.use('/签到', ...);
app.use('/任务设置', ...);
```

前缀由 `routeText` 处理，不属于 key。

---

## 输入前缀

`routeText` 用来处理输入前缀，不改原始 `MessageText`，只影响路由命中。

### 常见写法

```ts
routeText: {
  prefixes: ['/', '#', '＃', '!', '！'],
  stripPrefix: true,
  allowBare: true
}
```

含义：

- 允许这些前缀
- 匹配时去掉前缀
- 不带前缀也能匹配

### 前缀与指令间的空白

从 AlemonJS 2.1.124 起，`space` 默认是 `false`。例如前缀为 `/修仙` 时，带前缀的输入应写作 `/修仙签到`。设为 `true` 后需要用空格或 Tab 分隔，例如 `/修仙 签到`。升级前依赖这种分隔写法的应用应显式设置 `space: true`。`byPlatform` 可以覆盖该值，`allowBare` 独立控制无前缀输入。

### 按平台单独配置

```ts
routeText: {
  prefixes: ['/', '#'],
  stripPrefix: true,
  allowBare: true,
  byPlatform: {
    [discordPlatform]: {
      prefixes: ['/'],
      stripPrefix: true,
      allowBare: false
    }
  }
}
```

这表示：

- 默认支持 `/` 和 `#`
- Discord 只允许 `/`

---

## 指令词数

设置指令名称匹配的最大词数。

```ts
keyPolicy: {
  maxWords: 2
}
```

支持：

- `1`
  只按第一个词取 key
- `2`
  优先前两个词，再退回一个词

需要匹配双词指令时使用 `2`。

---

## 参数解析

业务通过 `useEvent()` 读取时，应使用 `event.current.__route` 访问这段上下文。

命中后，路由层会自动把参数挂到：

- `e.__route.rawArgs`
- `e.__route.parsedArgs`
- `e.__route.params`

推荐业务代码直接读：

```ts
e.__route.params
```

不要再自己拆：

```ts
e.MessageText
```

### 示例

```ts
const { slot, step, content } = e.__route.params
```

---

## 未匹配提示

当用户输入没命中时，是否提示“更接近哪个指令”。

```ts
fallback: {
  suggest: true,
  maxDistance: 2,
  minInputLength: 2,
  allowPrefixMatch: true
}
```

常见用法：

- 想完全关闭提示：

```ts
fallback: {
  suggest: false
}
```

---

## 重名指令

同一事件下，重复注册同一个 key 时怎么处理。

```ts
duplicateKey: 'warn'
```

支持：

- `ignore`
- `warn`
- `throw`

推荐：

- 开发期用 `warn` 或 `throw`

---

## 重新分发

当某个 importer 改写了 `MessageText`，是否允许重新分发。

```ts
redispatch: {
  maxDepth: 3
}
```

例如任务处理器把 `/任务 签到` 改写成目标命令并调用 `next()`，框架会按目标路由的事件、平台、前缀和参数条件重新匹配。应用启用了强制前缀时，改写后的 `MessageText` 仍应带完整前缀。

`maxDepth` 是入口允许的重新分发次数，默认 3，设为 0 时只执行当前处理器。每跳消耗一次，后续分组只能收紧剩余次数。

---

## 应用级指令前缀

使用 `apps.<包名>.command` 可统一覆盖应用 Router、分组与 `res` 的文本前缀规则。命令需要配置的完整前缀。

```yaml title="alemon.config.yaml"
apps:
  '@example/business':
    command:
      prefix: /修仙
      space: true
      format:
        enabled: true
        match: '^[/#＃!！]\s*'
        replacement: ''
```

开启 `format.enabled` 后，发送时会转换匹配配置的指令按钮。示例把 `/签到` 和 `#签到` 转成 `/修仙 签到`。`match` 必须是有效的正则表达式，匹配要从指令开头开始。要保留某个按钮自己的指令，可设置 `commandTarget: false`。要使用另一个应用的转换配置，可把 `commandTarget` 设为目标包名。转换适用于按钮组和结构化 Markdown 的指令按钮，链接按钮、回调按钮和普通说明文字沿用原有内容。框架在消息副本上转换，同一个按钮构建结果可以重复发送。
