---
label: '模块'
sidebar_position: 7
---

# 模块

:::info

如果进行模块化和模块化处理仓库
:::

## 本地模块化

> 安装仓库到`packages`目录下

```sh
git clone --depth=1  [git-url] ./packages/[pkg-name]
git clone --depth=1  [git-url2] ./packages/[pkg-name2]
git clone --depth=1  [git-url3] ./packages/[pkg-name3]
```

> 把packages目录下的本地模块都视为模块依赖

```json title="package.json"
{
  "private": true,
  "workspaces": ["packages/*"]
}
```

> 重新安装依赖

```sh
yarn install
```

> 框架配置设置`apps`

```yaml title="alemon.config.yaml"
# 加载模块, 具体见文档后续内容
apps:
  - 'pkg-name'
# 模块配置, 约定。模块对应的配置名，应是模块名。
# pkg-name:
#   token: '假设该包需要设置token才能使用'
```
