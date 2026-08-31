---
title: WebView
description: 在机器人插件中注册侧栏页面，并使用消息桥和 API 代理。
sidebar_position: 3
---

# WebView

ALemonX 中有三种相关但不同的页面机制：

| 页面         | 所属         | 能力                                          |
| ------------ | ------------ | --------------------------------------------- |
| 系统面板页   | 系统插件     | 同源托管，可使用 `ALXHost` 和声明过的特权能力 |
| 宿主 WebView | 系统插件打开 | 工作台管理的普通页面容器，不自动获得系统权限  |
| 机器人应用页 | 机器人插件   | 只能通过当前机器人的 `./api/*` 与机器人通信   |

本文只介绍机器人应用页。需要扩展 ALemonX 本身时，请阅读[系统插件开发](/docs/alemonx/develop/system-plugins)。

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

## 页面生命周期

机器人应用页是静态前端，不负责启动机器人进程。页面应该：

1. 加载时读取 `window.__alxWebview.context`；
2. 在请求前检查机器人是否运行；
3. 在卸载时移除 `onMessage` 监听；
4. 对 API 错误、机器人停止和权限不足提供可读反馈。

不要在页面中直接访问本机文件、系统命令或任意外部 URL。需要系统能力时，应通过机器人 API 或系统插件的受控接口完成。
