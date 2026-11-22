---
title: 应用离线测试
description: 用 alemonjs/testing 验证事件处理、路由、消息节点与框架计时器。
sidebar_position: 11
---

# 应用离线测试

`alemonjs/testing` 从 AlemonJS 2.1.112 起提供离线测试实例，可执行真实路由、Hook 和消息构造。平台动作由测试实例接管，因此无需启动机器人或准备平台账号。数据库和业务 HTTP 请求应由项目自行替换或注入测试依赖。

想在桌面聊天窗口手动发送指令，见[本地测试](/docs/alemonx/use/runtime/local-test)。安装 `tsx` 后可用 Node.js 22 的内置测试工具执行 TypeScript 测试。

```sh
yarn add -D tsx
node --import tsx --test test/*.test.ts
```

```ts
import assert from 'node:assert/strict'
import { test } from 'node:test'
import { Format, Router, useMessage } from 'alemonjs'
import { createTestApp } from 'alemonjs/testing'

test('指令回复到原群', async t => {
  const app = createTestApp()
  t.after(() => app.dispose())

  const router = Router.create({ events: ['message.create'] })
  router.res({ regular: /^\/hello$/ }, async () => async () => {
    const [message] = useMessage()
    await message.send({ format: Format.create().addText('你好') })
  })
  await app.mount({ responseRouter: router.define })

  const result = await app.dispatch(
    app.events.groupMessage({ text: '/hello', groupId: 'group-1' })
  )
  assert.equal(result.messages.length, 1)
  assert.equal(result.messages[0].text, '你好')
  assert.equal(result.messages[0].target?.targetId, 'group-1')
})
```

## 选择测试入口

- `runHandler(handler, event)` 直接执行一个处理器，适合验证分支和回复。需要验证实际匹配、中间件、去重或会话状态时，使用 `mount()` 与 `dispatch()`。
- `app.actions.on(name, handler)` 模拟框架动作，`app.apis.on(name, handler)` 模拟平台原生 API。模拟函数返回 `Result[]`。发送动作默认模拟成功，其他未模拟的动作或 API 会报错。
- `result.messages` 记录所有消息发送尝试。用 `result.actions[message.actionIndex].results` 或 `.error` 核实结果，用 `nodes` 断言 Markdown 或按钮结构。实际显示效果仍需平台验证。
- `app.clock.advance(ms)` 推进实例内的框架计时器，可验证 Context 超时。业务的原生定时器或第三方时钟需要单独注入。测试完成后等待 `dispose()`，释放应用和测试实例。

[事件工厂、失败断言与虚拟时钟参考](https://github.com/lemonade-lab/alemonjs/blob/3b582bf5abfc5af1397274f8d47f5661b4b8be3a/packages/alemonjs/docs/testing.md)
