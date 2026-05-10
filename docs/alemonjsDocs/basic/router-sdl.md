---
label: '路由DSL'
sidebar_position: 7
---

# 路由DSL

试验性！

将复杂的配置转为链式，同时规范化指令风格和加强匹配速度

## 最小示例

```ts
import { Router } from '@src/router-map/main'

const app = Router.create({
  events: ['message.create', 'private.message.create']
})

app.res({}, () => import('@src/response/resMaintenance'))

const xiuxian = app.group(
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
  () => import('@src/response/mwBan'),
  () => import('@src/response/mw')
)

xiuxian.use('我', () => import('@src/response/message/me/res'))
xiuxian.use(['帮助', '修仙帮助', 'help'], () => import('@src/response/help'))

export default app.define
```

---

## 一眼看懂

这套路由只用 4 个东西：

1. `Router.create(...)`
   建路由容器，给顶层 `res` 默认事件/平台。

2. `app.res(...)`
   注册顶层前置逻辑。

3. `group(...)`
   建一组共享中间件、共享输入规则的命令组。

4. `use(...)`
   注册具体命令。

---

## 什么时候用 `app.res`

`app.res(...)` 只放顶层前置逻辑。

适合放：

- 维护模式
- 新手引导
- select 转义
- 其他“消息一进来就要先检查”的逻辑

### 写法 1：懒加载

```ts
app.res({}, () => import('@src/response/resGuide'))
```

### 写法 2：直接写函数

```ts
app.res({}, async (e, next) => {
  await next()
})
```

### 注意

顶层 `res` 往后放行要用：

```ts
next()
```

不要指望：

```ts
return true
```

---

## 什么时候用 `group`

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
const xiuxian = app.group(
  {
    events: ['message.create', 'private.message.create']
  },
  () => import('@src/response/mwBan'),
  () => import('@src/response/mw')
)
```

### 嵌套写法

```ts
const captcha = xiuxian.group(
  {
    fallback: {
      suggest: false
    }
  },
  () => import('@src/response/mwCaptcha')
)
```

---

## 什么时候用 `use`

`use(...)` 注册具体命令。

### 1. 单条命令

```ts
xiuxian.use('我', () => import('@src/response/message/me/res'))
```

### 2. 多个命令共用同一个实现

```ts
xiuxian.use(['帮助', '修仙帮助', 'help'], () => import('@src/response/help'))
```

### 3. 带参数规则

```ts
xiuxian.use(
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
xiuxian.use(
  [
    { path: '学习功法', schema: skillSchema },
    { path: '隐藏功法', schema: hideSchema }
  ],
  () => import('@src/response/skillBook/res')
)
```

---

## key 怎么写

### 内部 key 一律不带前缀

正确：

```ts
xiuxian.use('签到', ...);
xiuxian.use('任务设置', ...);
```

不要写：

```ts
xiuxian.use('/签到', ...);
xiuxian.use('/任务设置', ...);
```

前缀由 `routeText` 处理，不属于 key。

---

## `routeText` 怎么配

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

## `keyPolicy` 怎么配

控制命中时按几词取 key。

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

一般命令组保持 `2` 就行。

---

## `schema` 怎么用

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

## fallback 怎么配

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

## duplicateKey 怎么配

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

## redispatch 怎么配

当某个 importer 改写了 `MessageText`，是否允许重新分发。

```ts
redispatch: {
  maxDepth: 3
}
```

典型场景：

- 任务系统把 `/任务 签到` 翻译成真实命令，再继续走后续路由

---
