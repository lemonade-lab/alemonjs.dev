---
label: '模块加载'
sidebar_position: 7
---

# 模块加载

:::info

将本地仓库配置为工作区依赖，再通过 `apps` 加载。
:::

## 加载本地模块

将模块仓库克隆到 `packages` 目录：

```sh
git clone --depth=1  [git-url] ./packages/[pkg-name]
git clone --depth=1  [git-url2] ./packages/[pkg-name2]
git clone --depth=1  [git-url3] ./packages/[pkg-name3]
```

在 `package.json` 中声明工作区：

```json title="package.json"
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

重新安装依赖：

```sh
yarn install
```

在 `alemon.config.yaml` 的 `apps` 中启用模块：

```yaml title="alemon.config.yaml"
# 加载模块, 具体见文档后续内容
apps:
  - 'pkg-name'
# 模块配置, 约定。模块对应的配置名，应是模块名。
# pkg-name:
#   token: '假设该包需要设置token才能使用'
```

## 运行时加载、重载与卸载

从 AlemonJS 2.1.124 起，可在机器人应用进程内传入已安装的包名。热重载及卸载后重新挂载需要 Node.js 22.15 或更高版本，以及 ESM 应用包。

```ts
import { loadAppPackage, reloadAppPackage, unloadAppPackage } from 'alemonjs'

await loadAppPackage('@example/business')
await reloadAppPackage('@example/business') // 先完成构建并将产物写入磁盘
await unloadAppPackage('@example/business')
```

三个调用分别演示加载、更新和卸载，在需要时单独调用。它们即时生效，进程重启时仍按 [`apps` 配置](/docs/alemonjsDocs/getting-started/config) 加载。重复加载已就绪的包会返回当前应用。启动时设置 `enabled: false` 的包可手动加载。

同一个包的加载、重载与卸载按调用顺序执行。每次成功挂载后，框架按当前 `apps.order` 更新应用的事件处理顺序。主应用始终在最前，随后是配置中的应用。同序号按声明顺序处理，未列入 `apps` 的包排在后面，按首次挂载顺序排列。

卸载时，框架移除应用登记的响应、中间件、HTTP 路由、定时任务、订阅、交互上下文和 Expose 注册，并等待销毁回调完成。在 [`onDispose`](/docs/alemonjsDocs/core/cycle) 中关闭应用自行创建的连接和定时器。

重载会重新导入包内代码，外部依赖继续使用进程中的模块实例。已开始的请求可以继续，新事件要等新版完成 `onReady` 才能进入此应用。初始化失败时调用会抛错，应用进入 `failed` 状态，修复构建产物后可再次加载。
