---
title: WebView
description: 在机器人插件中注册侧栏页面，并使用消息桥和 API 代理。
sidebar_position: 3
---

# WebView

在机器人插件 `package.json` 中声明静态页面目录和侧栏入口：

```json
{
  "alemonjs": {
    "web": { "root": "dist" },
    "desktop": { "sidebars": [{ "name": "示例插件" }] }
  }
}
```

`dist` 必须包含 `index.html`，并使用相对资源路径。

## 页面通信

```ts
window.__alxWebview.context
window.__alxWebview.postMessage(value)
window.__alxWebview.onMessage(listener)
window.__alxWebview.request('./api/example', options)
```

`request` 只接受 `./api/` 路径。页面打开时不会启动机器人；调用机器人 API 前处理机器人未运行的状态。
