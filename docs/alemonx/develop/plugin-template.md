---
title: 官方插件模板与可运行示例
description: 使用最小 Node.js 系统插件模板创建一个可发现、可运行、可调试的 ALemonX 插件。
sidebar_position: 1
---

# 官方插件模板与可运行示例

下面的示例是一个最小、可运行的系统插件：页面点击按钮后调用 runner，runner 通过 `alx/v1` 从 stdin 读取请求，并向 stdout 返回唯一 JSON。它不申请特权能力，适合作为新插件的起点。

## 目录

```text
my-status/
├── alx.json
├── web/index.html
└── runner/main.mjs
```

## `alx.json`

```json
{
  "id": "my-status",
  "name": "示例状态",
  "version": "0.1.0",
  "runtime": "node",
  "entry": {
    "darwin-arm64": "runner/main.mjs",
    "linux-amd64": "runner/main.mjs",
    "linux-arm64": "runner/main.mjs",
    "windows-amd64": "runner/main.mjs",
    "windows-arm64": "runner/main.mjs"
  },
  "web": { "root": "web" },
  "navigation": { "label": "示例状态", "icon": "circle", "order": 20 }
}
```

## `runner/main.mjs`

```js
import process from 'node:process'

const input = JSON.parse(await new Response(process.stdin).text())
let result

try {
  if (input.protocol !== 'alx/v1' || input.method !== 'run') {
    throw new Error('不支持的 ALX 协议')
  }
  if (input.action !== 'check') throw new Error('未知操作')
  result = { output: '✓ ALemonX 插件运行正常。', data: { ok: true } }
} catch (error) {
  result = { error: String(error.message || error) }
}

process.stdout.write(JSON.stringify(result))
```

## `web/index.html`

```html
<!doctype html>
<meta charset="utf-8" />
<title>示例状态</title>
<button id="check">检查插件</button>
<pre id="output">尚未检查</pre>
<script>
  const output = document.querySelector('#output')
  document.querySelector('#check').onclick = async () => {
    output.textContent = '检查中…'
    const response = await fetch('/api/v1/setup/plugins/my-status/actions', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'check', params: {}, confirm: false })
    })
    const task = await response.json()
    output.textContent = JSON.stringify(task, null, 2)
  }
</script>
```

## 本地运行

源码开发时，将插件目录放在 ALemonX 仓库根目录的 `plugins/` 下；正式安装目标是 `<workspace>/plugins/`。启动 `alx` 后，工作台会自动发现目录。动作请求是异步任务，页面应根据返回的任务 ID 查询最终结果；生产插件还应展示 `running`、`completed` 和 `failed`。

## 继续扩展

需要宿主能力时，先在清单中声明最小范围，再阅读[系统插件开发](/docs/alemonx/develop/system-plugins)中的协议、服务、上传、特权操作与审计章节。不要向 stdout 写日志；日志写 stderr，stdout 必须始终是唯一合法 JSON。
