---
label: '定时任务'
sidebar_position: 10
---

# 定时任务

:::info

框架提供了替代原生 `setInterval` / `setTimeout` 的定时任务 API，由框架统一管理生命周期。插件卸载或热重载时，所有关联的定时任务会自动清理，避免内存泄漏。

:::

## 基础用法

### `setInterval`

替代原生 `setInterval`，注册周期性定时任务。

```ts title="src/index.ts"
import { setInterval, clearInterval } from 'alemonjs'

// 每 5 秒执行一次
const id = setInterval(() => {
  console.log('tick')
}, 5000)

// 手动取消
clearInterval(id)
```

### `setTimeout`

替代原生 `setTimeout`，注册一次性延迟任务。执行完成后自动清理。

```ts title="src/index.ts"
import { setTimeout, clearTimeout } from 'alemonjs'

// 10 秒后执行一次
const id = setTimeout(() => {
  console.log('done')
}, 10000)

// 提前取消
clearTimeout(id)
```

### `setCron`

注册 cron 表达式定时任务，基于 [cron](https://www.npmjs.com/package/cron) 库实现。

```ts title="src/index.ts"
import { setCron, clearInterval } from 'alemonjs'

// 每天早上 8 点执行
const id = setCron('0 8 * * *', () => {
  console.log('good morning')
})

// 取消 cron 任务
clearInterval(id)
```

**Cron 表达式格式** (5 位):

```
┌────────────── 分 (0-59)
│ ┌──────────── 时 (0-23)
│ │ ┌────────── 日 (1-31)
│ │ │ ┌──────── 月 (1-12)
│ │ │ │ ┌────── 周 (0-7, 0和7都是周日)
│ │ │ │ │
* * * * *
```

常用示例：

| 表达式        | 含义          |
| ------------- | ------------- |
| `* * * * *`   | 每分钟        |
| `0 * * * *`   | 每小时整点    |
| `0 8 * * *`   | 每天早上 8 点 |
| `0 0 * * 1`   | 每周一凌晨    |
| `0 0 1 * *`   | 每月 1 号凌晨 |
| `*/5 * * * *` | 每 5 分钟     |

## 暂停与恢复

```ts title="src/index.ts"
import { setInterval, pauseSchedule, resumeSchedule } from 'alemonjs'

const id = setInterval(() => {
  console.log('working')
}, 3000)

// 暂停
pauseSchedule(id)

// 恢复
resumeSchedule(id)
```

## 查看任务列表

```ts title="src/index.ts"
import { listSchedule } from 'alemonjs'

// 列出所有定时任务
const all = listSchedule()

// 按插件名过滤
const mine = listSchedule('my-plugin')
```

返回值包含 `id`、`type`、`status`、`ms`、`cron`、`appName`、`createdAt` 等字段。

## 自动清理

框架通过 `Error().stack` 自动识别调用者所属的插件目录。

- **插件内调用** — 任务自动关联到该插件。插件卸载时，所有关联任务自动取消。
- **插件外调用** — 任务归属为 `main`，不受单个插件卸载影响。

```ts title="src/index.ts"
import { defineChildren, setInterval } from 'alemonjs'

export default defineChildren({
  onCreated() {
    // 无需手动清理，插件卸载时框架自动取消
    setInterval(() => {
      console.log('auto cleanup on unload')
    }, 10000)
  }
})
```

## API 总览

| 函数                            | 说明                         |
| ------------------------------- | ---------------------------- |
| `setInterval(callback, ms)`     | 周期定时任务，返回任务 ID    |
| `setTimeout(callback, ms)`      | 一次性延迟任务，返回任务 ID  |
| `setCron(expression, callback)` | cron 表达式任务，返回任务 ID |
| `clearInterval(id)`             | 取消定时任务                 |
| `clearTimeout(id)`              | 取消定时任务                 |
| `pauseSchedule(id)`             | 暂停任务                     |
| `resumeSchedule(id)`            | 恢复任务                     |
| `listSchedule(appName?)`        | 列出任务                     |
