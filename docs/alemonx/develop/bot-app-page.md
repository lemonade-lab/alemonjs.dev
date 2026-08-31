---
title: 机器人应用页
description: 为机器人插件提供静态应用页面，并通过受限 API 与机器人通信。
sidebar_position: 4
---

# 机器人应用页

机器人应用页是随机器人项目发布的前端页面，适合制作控制面板、数据展示页和机器人专属交互界面。它与系统插件面板不同，只能访问当前机器人提供的能力。

## 注册页面

在机器人插件的 `package.json` 中声明：

```json
{
  "alemonjs": {
    "web": { "root": "dist" },
    "desktop": {
      "sidebars": [{ "name": "示例插件" }]
    }
  }
}
```

`dist` 必须包含 `index.html`，页面资源使用相对路径。

## 页面通信

页面打开后可以使用宿主注入的 `window.__alxWebview`：

```ts
const context = window.__alxWebview.context
window.__alxWebview.postMessage({ type: 'ready' })

const unsubscribe = window.__alxWebview.onMessage(message => {
  console.log(message)
})

const response = await window.__alxWebview.request('./api/status', {
  method: 'GET'
})
```

`request` 只允许 `./api/` 路径。它由 ALemonX 代理到当前机器人，不是任意网络请求。

## 生命周期与隔离

- 页面打开不会自动启动机器人；
- 调用 API 前必须处理机器人未运行或已退出的状态；
- 页面只能访问当前机器人 API，不能访问系统插件 API；
- 不要把 Token、密码或敏感配置写入前端代码；
- 页面关闭后应移除消息监听器，避免重复订阅。

系统级能力应使用[系统插件](/docs/alemonx/develop/system-plugins)，由 `ALXHost` 和宿主授权机制提供。
