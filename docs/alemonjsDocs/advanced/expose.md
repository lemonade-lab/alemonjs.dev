---
title: Expose 插件能力
description: 注册和调用同一运行实例中的插件能力，配置数据契约、授权和后台调用。
sidebar_position: 7
---

# Expose 插件能力

Expose 让同一个 AlemonJS 运行实例中的应用按协议、提供者和动作调用彼此的能力。下面的示例使用 AlemonJS 2.1.124。聊天指令仍从 [路由 DSL](/docs/alemonjsDocs/core/router-sdl) 进入，两种入口可以调用同一个业务函数。

## 注册能力

在名为 `counter-plugin` 的应用入口 `src/index.ts` 中创建 Expose 实例，并在 `defineChildren()` 的 `register()` 中返回它。动作的输入和输出契约会在运行时校验。

```ts title="src/index.ts"
import { defineChildren, Expose } from 'alemonjs'

const expose = Expose.create().provide({
  name: 'example.counter',
  version: '1',
  description: '读取计数',
  actions: {
    read: Expose.action<null, { count: number }>({
      description: '返回当前计数',
      effect: 'read',
      inputSchema: { type: 'null' },
      outputSchema: {
        type: 'object',
        properties: { count: { type: 'integer', minimum: 0 } },
        required: ['count'],
        additionalProperties: false
      },
      authorize: (_input, context) => context.callerApp === 'report-plugin',
      handler: () => ({ count: 0 })
    })
  }
})

export default defineChildren({
  register() {
    return { expose }
  }
})
```

`name` 是协议名。调用方还要指定框架登记的提供者名称，因为同一个协议可以由多个应用提供。`version` 是提供者声明的契约版本，由调用方核对。

契约使用 JSON Schema 子集，支持对象、数组、字符串、数值、布尔值及空值。对象需要显式声明 `additionalProperties: false`。对象字段用 `properties` 和 `required` 定义，数组使用 `items`、`minItems` 和 `maxItems`，字符串可用 `enum`、`minLength` 和 `maxLength`，数值可用 `minimum` 和 `maximum`。当前校验器会拒绝未支持的关键字，例如 `$ref`、`pattern` 和组合类型。其他边界见 [完整接口参考](https://github.com/lemonade-lab/alemonjs/blob/3b582bf5abfc5af1397274f8d47f5661b4b8be3a/packages/alemonjs/docs/expose.md#契约范围)。

## 发现和调用能力

`schema()` 返回各提供者的契约描述。先确认目标应用已经加载，再从 `report-plugin` 的生命周期或事件处理函数中调用。示例中的 `authorize` 只允许该应用调用。

```ts
import { Expose } from 'alemonjs'

const client = Expose.create()
const result = await client.call(
  'example.counter',
  'counter-plugin',
  'read',
  null,
  {
    timeoutMs: 5000
  }
)

if (result.ok) {
  console.info(result.data)
} else {
  console.warn(result.error.code, result.error.outcome)
}
```

- `call()` 返回 Promise，要求动作同时声明输入和输出契约。成功结果的 `data` 通过了提供者的输出校验，其 TypeScript 类型为 `unknown`，调用方按选定的契约解析。
- 失败结果的 `outcome: 'not_started'` 表示处理函数尚未执行。`'unknown'` 表示函数已经开始，业务结果需要向提供方确认。对有副作用的动作，按业务操作 ID 查询结果或做幂等处理。
- `timeoutMs` 和 `signal` 用于取消等待并通知处理函数。处理函数可将 `context.signal` 传给支持取消的下游；已经提交的操作仍需按业务规则处理。
- 卸载或重载提供者时，旧句柄失效，执行中的调用会收到取消信号。旧动作仍可使用 `invoke()`，其同步返回值、Promise 和异常形式沿用旧接口。

## 调用身份与后台任务

`authorize` 和 `handler` 都能读取调用上下文。框架从所属应用推导 `context.callerApp`。嵌套调用以直接发起调用的提供者作为调用方。执行涉及玩家数据或资产的动作时，还需要在提供方校验玩家、渠道和请求的操作权限。

在应用生命周期或事件处理函数内创建 `createBackgroundRunner()`，后续调用返回的函数时会保留应用身份，并清除原聊天事件、事件链和父 Expose 调用上下文。

```ts
import { createBackgroundRunner, Expose } from 'alemonjs'

// 在 report-plugin 的生命周期或事件处理函数内创建。
const readCounter = createBackgroundRunner(() =>
  Expose.create().call('example.counter', 'counter-plugin', 'read', null)
)

// 在后台任务执行时调用。
const result = await readCounter()
```

创建后台回调需要已有的应用上下文，所属运行实例销毁后调用会报错。任务调度和持久化由应用负责。需要代表玩家执行操作时，应把经过校验的授权范围和操作标识作为显式参数传入。

## 监听动作结果

`watch()` 监听成功执行的动作。结构化动作通过输出校验后才发送通知，声明 `effect: 'read'` 的动作跳过通知。调用 `watch()` 返回的函数可取消订阅。声明 `effect: 'write'` 或 `'unknown'` 的成功动作会发出通知。应用上下文内注册的监听器随应用卸载清理，应用上下文外注册的监听器由调用方取消。监听事件可能包含动作输入，应按业务的数据范围决定记录哪些字段。
