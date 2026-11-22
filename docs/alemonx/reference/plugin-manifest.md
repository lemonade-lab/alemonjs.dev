---
title: 系统插件清单
description: 配置 alx.json 中的执行器、页面、导航和授权字段。
sidebar_position: 3
---

# 系统插件清单

`alx.json` 最大 64 KiB，必须是普通文件。`id` 匹配 `^[a-z][a-z0-9-]{1,63}$`。

| 字段                    | 用途                                             |
| ----------------------- | ------------------------------------------------ |
| `id`、`name`、`version` | 标识与显示名称。                                 |
| `runtime`、`entry`      | 选择 `binary`、`node`、`go` 或 `python` 执行器。 |
| `web.root`              | 指向含 `index.html` 的页面目录。                 |
| `navigation`            | 设置侧栏名称、图标和顺序。                       |
| `privilegedOperations`  | 声明需要系统管理员授权的动作和授权方式。         |

`entry` 与 `web.root` 必须位于插件目录内，不能使用绝对路径、`..` 或符号链接。

执行器映射示例：

```json
{
  "runtime": "python",
  "entry": {
    "linux-amd64": "runner/main.py"
  },
  "web": { "root": "web" }
}
```

## 面板与宿主能力

| 字段                   | 作用                                     |
| ---------------------- | ---------------------------------------- |
| `web`、`navigation`    | 声明系统面板静态页面                     |
| `services`             | 声明需要由宿主代理的本地回环服务         |
| `statusActions`        | 声明无参数、只读、适合快速轮询的动作     |
| `uploads`              | 声明浏览器上传文件和大小上限             |
| `media`                | 声明由执行器生成的二维码、截图等媒体数据 |
| `privilegedOperations` | 声明需要管理员授权的动作                 |
| `development`          | 声明源码开发会话中的 runner、前端和服务  |

系统插件的完整运行模型、stdin / stdout 协议、`ALXHost`、上传、本地服务和审计流程见[系统插件开发](/docs/alemonx/develop/system-plugins)。
