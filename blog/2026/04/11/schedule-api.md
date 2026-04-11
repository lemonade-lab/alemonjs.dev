---
title: V2.1.57
description: 框架定时任务
authors: ningmengchongshui
tags: [更新]
image: https://i.imgur.com/mErPwqL.png
hide_table_of_contents: false
---

# 定时任务 API

新增框架统一管理的定时任务系统，替代原生 `setInterval` / `setTimeout`，插件卸载时自动清理。

## 新增 API

### `setInterval` / `setTimeout`

替代原生同名函数，由框架统一管理生命周期。

```ts
import { setInterval, setTimeout, clearInterval, clearTimeout } from 'alemonjs'

const id1 = setInterval(() => console.log('tick'), 5000)
const id2 = setTimeout(() => console.log('once'), 10000)

clearInterval(id1)
clearTimeout(id2)
```

### `setCron`

基于 [cron](https://www.npmjs.com/package/cron) 库的 cron 表达式定时任务。

```ts
import { setCron } from 'alemonjs'

// 每天早上 8 点
setCron('0 8 * * *', () => {
  console.log('good morning')
})
```

### `pauseSchedule` / `resumeSchedule`

支持暂停和恢复已注册的定时任务。

```ts
import { setInterval, pauseSchedule, resumeSchedule } from 'alemonjs'

const id = setInterval(() => console.log('working'), 3000)
pauseSchedule(id)
resumeSchedule(id)
```

### `listSchedule`

查看当前所有定时任务状态。

```ts
import { listSchedule } from 'alemonjs'
const tasks = listSchedule()
```
