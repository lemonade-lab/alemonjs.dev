---
title: 事件上下文
description: 使用有状态上下文实现多轮对话、分步表单和临时交互流程。
sidebar_position: 4
---

# 事件上下文

事件上下文用于处理需要跨越多条消息的业务流程。它会按事件和作用域找到当前活动的上下文，将后续事件交给对应的处理器，并保存流程状态。

典型场景包括：

- 多轮对话
- 登录、注册和绑定流程
- 等待验证码或用户确认
- 分步骤表单
- 菜单和临时交互会话

## `createContext`

`createContext` 创建一个上下文定义。上下文的处理器不是立即执行，而是在对应的上下文被打开后，等待后续事件触发。

```ts
import {
  createContext,
  configureContext,
  defineChildren,
  useMessage,
  Format
} from 'alemonjs'

const registerContext = createContext({
  name: 'register',
  events: ['message.create', 'private.message.create'],
  scope: ['UserId'],
  expiresIn: '5m',
  initialState: () => ({
    step: 'email',
    email: ''
  }),
  handlers: {
    email(event, state, action) {
      state.email = event.MessageText
      state.step = 'confirm'

      const [message] = useMessage(event)
      message.send({
        format: Format.create().addText(
          `收到邮箱 ${state.email}，请输入 confirm 确认`
        )
      })

      // 打开下一步处理器
      registerContext.confirm()
    },
    confirm(event, state, action) {
      const [message] = useMessage(event)

      if (event.MessageText === 'confirm') {
        message.send({ format: Format.create().addText('注册完成') })
        action.close()
        return
      }

      message.send({
        format: Format.create().addText('请输入 confirm，或输入 cancel 退出')
      })
    }
  }
})

export default defineChildren({
  register: () => ({
    responseContent: configureContext({
      contexts: {
        register: registerContext
      }
    })
  })
})
```

上下文 action 的处理器名会成为打开下一步的动作，例如 `registerContext.confirm()`。上下文动作只能在事件处理流程中调用。

## 配置项

| 配置           | 说明                                           |
| -------------- | ---------------------------------------------- |
| `name`         | 上下文名称，必须唯一                           |
| `events`       | 可以进入该上下文的事件类型                     |
| `scope`        | 上下文隔离字段，例如 `UserId`、`ChannelId`     |
| `initialState` | 每个上下文实例的初始状态，也可以是函数         |
| `handlers`     | 每一步的事件处理器                             |
| `expiresIn`    | 过期时间，例如 `5000` 或 `'5m'`                |
| `conflict`     | 同一作用域重复打开时使用 `replace` 或 `reject` |
| `onError`      | Handler 出错时使用 `close` 或 `keep`           |

### 作用域隔离

```ts
scope: ['UserId', 'ChannelId']
```

这表示每个用户在每个频道中拥有独立的上下文。没有提供作用域字段的事件不会匹配该上下文。

### `ContextAction`

Handler 的第三个参数用于控制当前上下文：

```ts
handlers: {
  step(event, state, action) {
    if (event.MessageText === 'cancel') {
      action.close()
      return
    }

    // 当前事件处理后继续进入普通路由
    action.pass()
  }
}
```

- `action.payload`：打开当前上下文时传入的数据
- `action.signal`：上下文被关闭、替换、过期或卸载时触发的取消信号
- `action.close()`：当前事件处理结束后关闭上下文
- `action.pass()`：保留上下文，同时让当前事件继续进入普通路由

## 注册阶段

上下文可以注册在两个阶段：

```ts
return {
  middlewareContent: configureContext({
    contexts: { register: registerContext }
  }),
  responseContent: configureContext({ contexts: { register: registerContext } })
}
```

- `middlewareContent`：在中间件路由前处理；
- `responseContent`：在响应路由前处理。

同一个上下文不能同时注册到两个阶段。

## 与 `useSubscribe` 的区别

`useSubscribe` 是事件订阅工具，适合临时监听事件；事件上下文则是带状态、作用域和生命周期的交互流程。

如果业务包含“输入第一步、等待第二步、确认后结束”这样的流程，推荐使用事件上下文。简单的事件监听、一次性观察或需要挂载 / 卸载周期回调时，继续使用 `useSubscribe`。

上下文状态默认保存在内存中，进程重启后不会保留。需要长期保存的数据仍应写入数据库。
