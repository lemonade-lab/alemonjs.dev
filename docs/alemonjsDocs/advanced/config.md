---
title: 配置接口
description: 读取、保存配置，并监听配置项变化。
sidebar_position: 6
---

# 配置接口

:::info

读取框架配置

:::

```yaml title="alemon.config.yaml"
port: 17117 # 端口，快捷参数 --port
input: 'lib/index.js' # 入口地址，快捷参数 --input
```

### getConfigValue

```ts title="src/index.ts"
import { getConfigValue } from 'alemonjs'
const value = getConfigValue()
console.log('port', value.port) // port 17117
```

### getConfig

```ts title="src/index.ts"
import { getConfig } from 'alemonjs'
// 配置类
const config = getConfig()
// 包信息
console.log('alemonjs/package.json', config.package)
// 环境参数
console.log('alemonjs process.argv', config.argv)
// 自定义配置
console.log('alemon.config.yaml', config.value)

// 修改并保存为新配置
const val = config.value
val.apps.push('@alemonjs/db')
config.saveValue(val)
```

### onWatchConfigValue

```ts title="src/index.ts"
import { onWatchConfigValue } from 'alemonjs'
// 监听 配置变化
const unWatchConfigValue = onWatchConfigValue(value => {
  console.log('port', value.port) // port 17117
})
```

## 按包读取应用配置

`getAppConfigValue()` 读取当前应用的配置。`getAppConfig()` 还提供 `onWatch()`、`saveValue()`、`reload()` 和 `dispose()`。框架从调用文件向上查找带 `name` 的 `package.json`，以此名称读取 `alemon.config.yaml` 的同名顶层配置。

```yaml title="alemon.config.yaml"
'@example/business':
  greeting: '你好'
```

```ts
import { defineChildren, getAppConfig } from 'alemonjs'

const config = getAppConfig<{ greeting: string }>()

export default defineChildren({
  onReady() {
    console.info(config.value.greeting ?? '你好')
    config.onWatch(value => console.info(value.greeting ?? '你好'))
  },
  onDispose() {
    config.dispose()
  }
})
```

`saveValue()` 替换该应用的整段配置，其他配置项保留。`onWatch()` 只在该应用的配置变化时通知。调用包必须位于进程当前工作目录内。识别失败时返回空配置，并跳过保存。
