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
