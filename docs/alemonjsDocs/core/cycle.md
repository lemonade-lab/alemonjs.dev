---
label: '生命周期'
sidebar_position: 6
---

# 生命周期

:::info

框架现在建议把运行时理解成三条主线：**应用阶段**、**事件阶段**、**HTTP 服务阶段**。

:::

## 应用阶段

### `onCreated()`

应用刚创建时触发。适合放：

- 轻量初始化
- 读取静态配置
- 建立不依赖路由索引的准备逻辑

不建议把明显阻塞启动的重逻辑直接塞在模块顶层，应该尽量收进生命周期回调。

### `onMounted(store)`

兼容旧写法的初始化钩子。它发生在索引建立完成后、应用进入 `ready` 前。

适合做：

- 数据库连接
- 缓存准备
- 外部依赖初始化
- 基于 `store.response`、`store.middleware` 的准备工作

新项目仍然可以用它，但更推荐把“正式进入可服务状态前的最后检查”放到 `onReady`。

### `onReady(store)`

推荐的新钩子。发生在 `onMounted` 之后、运行时状态进入 `ready` 之前。

如果这里抛错，应用不会进入 `ready`。

适合做：

- 最终依赖校验
- 输出 ready 日志
- 启动依赖应用已可服务的后台逻辑

### `onDispose(error)`

推荐的新销毁钩子。适合统一清理：

- 关闭数据库连接
- 停止轮询
- 释放本地资源
- 落盘临时状态

### `unMounted(error)`

兼容旧写法的卸载钩子。新代码更推荐统一使用 `onDispose`。

## 事件阶段

### `onEventStart({ event, name })`

事件刚进入主处理链时触发。它更适合做**通知、埋点和 trace**，而不是承担复杂业务逻辑。

适合做：

- 入口日志
- trace 注入
- 轻量上下文准备

### `onEventError({ event, error, appName, phase })`

事件处理期间，某个已归属到应用的错误被捕获后触发。

当前 `phase` 可能包括：

- `middleware`
- `response`
- `subscribe`
- `route`

只有显式返回 `'continue'` 时，框架才会继续当前事件链；其它返回值都会终止默认后续流程。

### `onEventFinished({ event, name, reason, duration, hasSendAttempted, hasSendSucceeded, lastSendError })`

事件生命周期结束时触发。适合做：

- 总耗时统计
- 审计日志
- fallback 判断
- 发送结果判断
- 统一收口埋点

当前 `reason` 可能包括：

- `filtered`
- `completed`
- `consumed`
- `error`

### 事件期回调可直接使用 Hook

`onEventStart`、`onEventError`、`onEventFinished` 都处在事件上下文链中，因此可以直接使用：

- `useEvent()`
- `useMessage()`
- `useRoute()`

通常不需要再手动把 `event` 一层层往下传。

## HTTP 服务阶段

### `onHttpError({ ctx, error, appName, path, method, kind })`

应用的 HTTP 能力处理出错时触发。当前 `kind` 可能包括：

- `api`
- `web`
- `koa-router`

如果显式返回 `'handled'`，表示你已经自己写好了响应，框架不会再补默认 500。

## 运行时状态观察

### `onRuntimeStatusChange({ appName, previousStatus, status, error })`

应用运行时状态变化通知。适合：

- 调试面板
- 生命周期日志
- 监控采集
- 开发期观察状态流转

当前状态主要包括：

- `discovered`
- `loading`
- `ready`
- `failed`
- `disposed`

## 哪些回调可以改变默认流程

当前只有两类回调允许显式改变框架默认行为：

- `onEventError(...)`
  - 返回 `'continue'`：继续当前事件链
  - 其它返回值：终止当前事件链
- `onHttpError(...)`
  - 返回 `'handled'`：表示你已经自行处理了 HTTP 响应

其它回调都应理解为**生命周期通知**，而不是新的中间件系统。

## 推荐写法

```ts title="src/index.ts"
import {
  defineChildren,
  useEvent,
  useMessage,
  useRoute,
  Format,
  logger
} from 'alemonjs'

export default defineChildren({
  onCreated() {
    // 创建阶段
  },
  async onMounted(store) {
    // 初始化阶段
  },
  async onReady(store) {
    // 即将进入 ready
  },
  async onEventStart({ name }) {
    const [event] = useEvent()
    logger.debug(`${name}: ${event.UserId}`)
  },
  async onEventError({ phase }) {
    if (phase === 'subscribe') {
      return 'continue'
    }
  },
  async onEventFinished({ reason, duration }) {
    logger.info(`${reason} ${duration}ms`)
  },
  async onHttpError({ ctx, appName, kind }) {
    ctx.status = 500
    ctx.body = {
      code: 500,
      message: `${appName} ${kind} error`
    }
    return 'handled'
  },
  async onRuntimeStatusChange({ appName, previousStatus, status }) {
    logger.info(`${appName}: ${previousStatus ?? 'none'} -> ${status}`)
  },
  async onDispose(error) {
    // 统一清理
  },
  async unMounted(error) {
    // 兼容旧写法
  }
})
```
