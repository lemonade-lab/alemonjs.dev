---
sidebar_position: 4
show_giscus: 1
label: '脚手架工具'
---

# 脚手架工具

## 安装

```sh
npm i alemonjs -g
```

## 日常

```bash
# 把本地alemonjs相关包立即拉到最新
alemonc upgrade
# 弹出基础信息
alemonc info
```

## 配置管理

```bash
# 查看帮助
npx alemonc -h

# 添加模块
alemonc add apps alemonjs-openai alemonjs-xianyu

# 移除模块
alemonc remove apps alemonjs-openai

# 设置配置项
alemonc set login qq
alemonc set discord.token your-token

# 删除配置项
alemonc del discord

# 获取配置项
alemonc get login
```

## 发布版本

> 插件仓库使用。
>
> 可按npm方式配置 .npmignore、package.json、README.md 等。
>
> 把发布到npm的库以git仓库的形式进行管理

```bash
alemonc publish
```

> 默认自动打tab，以v0.0.1 开始，指定可如下进行

```bash
alemonc publish 0.2.0
```
