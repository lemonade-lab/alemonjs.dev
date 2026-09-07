---
title: 系统插件开发
description: 了解 ALemonX 系统插件的边界、目录结构、通讯协议、宿主能力与安全机制。
sidebar_position: 1
---

# 系统插件开发

系统插件是运行在 ALemonX 工作台中的扩展单元，用于为工作台增加全局的本机管理能力，例如网络检查、防火墙管理、Docker 管理、系统服务控制和硬件信息展示。

## 运行模型

一个系统插件由 Web 面板和可选执行器组成：

```text
系统面板页（Web）
        │  POST /api/v1/setup/plugins/<id>/actions
        ▼
ALemonX 宿主（alx）
  身份校验、权限确认、任务互斥、进度、审计
        │  stdin / stdout / stderr
        ▼
执行器（独立进程）
  真正执行网络、系统、Docker 等本机操作
```

宿主不会在“发现插件”时执行插件代码。列出、渲染、启用和停用插件只读取清单和静态页面；只有用户调用动作时，宿主才会启动对应执行器。

每个变更动作都会启动一次独立进程。这样可以让动作结束后释放资源，也可以把执行器崩溃限制在单次任务中。

## 插件结构

```text
my-status/
├── alx.json              # 插件清单，必填
├── web/
│   └── index.html        # 系统面板页，必填
├── runner/
│   └── main.mjs          # 执行器，可选
├── dist/                 # 发布包中的平台文件，可选
└── .alx-install.json     # 宿主生成，禁止手工维护
```

插件的用户数据不要写入代码目录。宿主会注入 `ALX_PLUGIN_STORE`，插件应将数据库、登录态、下载缓存和可恢复配置保存到该目录。

插件发现位置按优先级排列：

1. `<workspace>/plugins/`：用户安装插件的目录；
2. 程序提供的 `plugins/`：随程序安装的插件；
3. 用户配置目录中的旧版 `alx/plugins/`：仅用于兼容发现。

同一个 `id` 只使用优先级最高的插件。插件目录和 `alx.json` 支持热更新，通常不需要重启工作台。

## 最小插件

### `alx.json`

```json
{
  "id": "my-status",
  "name": "系统状态",
  "version": "1.0.0",
  "runtime": "node",
  "entry": {
    "darwin-arm64": "runner/main.mjs",
    "linux-amd64": "runner/main.mjs",
    "windows-amd64": "runner/main.mjs"
  },
  "web": { "root": "web" },
  "navigation": {
    "label": "系统状态",
    "icon": "activity",
    "order": 10
  }
}
```

`id` 必须匹配 `^[a-z][a-z0-9-]{1,63}$`。`entry` 和 `web.root` 必须位于插件目录内，不能使用绝对路径、`..` 或符号链接逃逸。

### 执行器

执行器从标准输入读取一个 JSON 请求，并且只向标准输出写入一个 JSON 响应。日志应写到标准错误：

```js
import process from 'node:process'

try {
  const input = JSON.parse(await new Response(process.stdin).text())

  if (input.protocol !== 'alx/v1' || input.method !== 'run') {
    throw new Error('不支持的 ALX 插件协议')
  }
  if (input.action !== 'check') {
    throw new Error('未知操作')
  }

  process.stdout.write(
    JSON.stringify({
      output: '✓ 检查完成。',
      data: { ok: true }
    })
  )
} catch (error) {
  process.stdout.write(
    JSON.stringify({
      error: String(error?.message || error)
    })
  )
}
```

## 通讯协议

宿主启动执行器后，通过 stdin 发送：

```json
{
  "protocol": "alx/v1",
  "method": "run",
  "action": "network-check",
  "params": { "host": "example.com" },
  "confirm": false
}
```

执行器必须向 stdout 输出唯一一个 JSON 对象：

```json
{
  "output": "✓ 网络检查完成。",
  "data": { "latency": 42 }
}
```

失败时仍然输出合法 JSON，并设置 `error`：

```json
{
  "output": "已完成检查。",
  "error": "需要管理员权限"
}
```

stdout 中不能混入调试文本，否则宿主无法解析响应。需要实时反馈时，可以向 stderr 输出进度帧：

```text
@alx-progress {"stage":"checking","percent":50,"message":"正在检查…"}
```

### 任务生命周期

普通变更动作是异步任务：

```text
POST /api/v1/setup/plugins/my-status/actions
        ↓ 202 Accepted
GET /api/v1/robot/tasks
        ↓
running → completed / failed
```

同一个插件同一时间只能执行一个变更动作。重复提交相同动作会复用现有任务，冲突动作返回 `409`。

只读状态可以在清单中声明 `statusActions`，通过状态接口读取。此类请求不创建任务，并会被宿主短暂合并缓存，适合面板轮询。

## 清单能力

| 字段                   | 作用                                     |
| ---------------------- | ---------------------------------------- |
| `web`                  | 声明系统面板静态页面                     |
| `services`             | 声明需要由宿主代理的本地回环服务         |
| `statusActions`        | 声明无参数、只读、适合快速轮询的动作     |
| `uploads`              | 声明浏览器上传文件和大小上限             |
| `media`                | 声明由执行器生成的二维码、截图等媒体数据 |
| `privilegedOperations` | 声明需要管理员授权的动作                 |
| `development`          | 声明源码开发会话中的 runner、前端和服务  |

清单只是能力白名单，不是业务逻辑。动作名称和参数仍必须在执行器中自行校验，不能因为宿主接受了 `action` 就直接执行任意命令。

## 系统面板与 `ALXHost`

`web.root` 会被宿主以同源路径托管：

```text
/api/v1/setup/plugins/web/<id>/index.html
```

宿主会自动注入 `host-bridge.js`，页面可以使用 `window.ALXHost` 调用受控宿主能力：

```js
const info = await window.ALXHost.info('my-status')
const context = await window.ALXHost.context('my-status', ['robot', 'network'])
const paths = await window.ALXHost.finder.pick('my-status', 'runtime-directory')
await window.ALXHost.desktop.open('my-status', paths[0])
await window.ALXHost.notification.send('my-status', '检查完成')
```

常用能力包括：

- `context`：读取脱敏的机器人和网络上下文；
- `finder.pick`：请求宿主打开文件或目录选择器；
- `desktop.open`：请求系统打开路径或 URL；
- `clipboard`：读写系统剪贴板；
- `notification`：发送系统通知；
- `network.fetch`：受限的 GET / HEAD 网络请求；
- `webview.open`：打开由工作台管理的插件页面。

页面不能直接访问宿主文件系统、插件存储目录或管理员权限。需要读写文件时，应由页面调用一个受控 runner 动作。

## 本地服务与上传

### 本地服务

插件可以声明回环服务，宿主只代理清单中允许的服务：

```json
{
  "services": [
    {
      "id": "api",
      "host": "127.0.0.1",
      "port": 18080,
      "websocket": false
    }
  ]
}
```

面板通过以下路径访问：

```text
/api/v1/services/<plugin>/<service>/...
```

动态端口也必须由宿主代理，并且目标被强制限制为 `127.0.0.1`，不能借插件服务访问任意内网地址。

### 文件上传

文件上传使用专用的 `multipart/form-data` 接口，不要把文件内容塞进普通 JSON 参数：

```text
POST /api/v1/setup/plugins/<id>/upload
```

宿主会限制大小、暂存文件、清理文件名，并将暂存目录通过参数传给 runner。插件应校验文件类型、内容和目标路径，不能把浏览器传入的文件名直接拼接到系统路径。

## 特权操作与审计

需要 sudo、UAC、Polkit 或其他管理员能力的操作，必须在 `privilegedOperations` 中声明。典型流程是：

```text
面板请求 preflight
        ↓
宿主检查清单与当前系统授权模式
        ↓
用户确认或完成系统授权
        ↓
宿主启动 runnerAction
        ↓
记录审计结果
```

宿主负责授权、进程启动、进度转发和审计；插件负责动作语义、参数校验和平台细节。危险动作应该提供可读的计划说明和最小权限范围，不能把“执行任意 shell 命令”作为插件 API。

## 源码开发会话

开发阶段可以登记一个源码目录，由工作台管理前端开发服务、runner 和本地服务：

```json
{
  "development": {
    "entry": { "go": "runner/main.go" },
    "web": {
      "mode": "dev-server",
      "command": {
        "program": "pnpm",
        "args": ["dev", "--port", "${ALX_PLUGIN_DEV_PORT}"]
      },
      "healthPath": "/"
    }
  }
}
```

源码会话的启动、停止、重启、构建和日志均由工作台管理。开发 Web 服务仍然通过宿主同源代理访问，不能为了 HMR 而额外暴露任意公网端口。

## 发布与安装

发布插件时，应为每个平台准备对应的 runner 资产，并在 GitHub Release 中提供压缩包和校验信息。宿主安装时会：

1. 读取并校验 `alx.json`；
2. 检查插件 ID、路径和平台兼容性；
3. 解包到工作区插件目录；
4. 写入安装元数据；
5. 启用插件并提供系统面板。

旧目录插件会以兼容模式发现。迁移时宿主会复制到工作区并保留原目录，不应由插件自行删除旧数据。

## 安全开发规范

- 不要在 stdout 输出日志，只输出协议 JSON；
- 所有动作都使用白名单，不执行未经校验的命令和参数；
- 不要依赖浏览器传入的路径、文件名或 URL；
- 不要把密钥、数据库和缓存写入插件代码目录；
- 大文件使用上传通道或下载 Broker，不使用普通网络代理；
- 特权操作必须声明、预检、确认并产生审计记录；
- Web 页面只通过 `ALXHost` 获取宿主能力；
- 处理 `ALX_PLUGIN_INSTALL_MODE`，兼容 `development` 和 `legacy-local` 安装；
- 在不同系统和架构上分别测试 runner；
- 不要把系统插件和机器人插件的页面、配置、命令混在一起。

## 相关文档

- [插件清单](/docs/alemonx/reference/plugin-manifest)
- [WebView 与扩展页面](/docs/alemonx/develop/webview)
- [机器人应用页](/docs/alemonx/develop/webview)
- [源码项目开发文档](https://github.com/lemonade-lab/alemonx/blob/main/docs/plugin-development.md)
