---
title: 机器人配置
description: 在桌面版用表单调整机器人运行参数，并切换到 YAML 查看保存结果。
sidebar_position: 2
---

# 机器人配置

## 用表单改参数

选中机器人，点右侧 **配置** → **表单** → **常规运行**。这里能看到运行端口、应用端口、入口文件和登录连接。修改后自动保存。

[![机器人配置页框出了配置入口和运行端口，示例运行端口为 48173](/images/alemonx-desktop-guide/config-form.webp)](/images/alemonx-desktop-guide/config-form.webp)

## 查看 YAML

点 **文本**。在 `alemon.config.yaml` 中可以看到刚才的运行端口对应 `port`。

[![文本编辑页中显示 port: 48173，文本切换按钮已框出](/images/alemonx-desktop-guide/config-yaml.webp)](/images/alemonx-desktop-guide/config-yaml.webp)

[运行配置字段](/docs/alemonjsDocs/getting-started/config) · [连接平台](/docs/alemonjsDocs/getting-started/connect-platform)
