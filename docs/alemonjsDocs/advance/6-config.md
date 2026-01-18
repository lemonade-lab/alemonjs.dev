---
label: '配置读取'
sidebar_position: 6
---

# 配置读取

:::info

读取框架配置

:::

```yaml title="alemon.config.yaml"
port: 17117 # 端口，快捷参数 --port
input: 'lib/index.js' # 入口地址，快捷参数 --input
```

使用例子

```ts title="src/index.ts"
import { getConfigValue } from 'alemonjs'
const value = getConfigValue()
console.log('port', value.port) // port 17117
```

更多调用

```ts title="src/index.ts"
import { getConfig, getConfigValue } from 'alemonjs'
const value = getConfigValue()
console.log('alemon.config.yaml', value)

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
