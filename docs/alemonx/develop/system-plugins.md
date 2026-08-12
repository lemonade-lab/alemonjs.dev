---
title: 系统插件
description: 使用 alx.json、Web 页面和执行器扩展本机管理功能。
sidebar_position: 2
---

# 系统插件

系统插件用于网络检查、系统服务或防火墙等本机管理操作。机器人命令、机器人配置页和 WebView 放在机器人插件中，不放在系统插件中。

## 创建目录

```text
plugins/
  my-status/
    alx.json
    web/index.html
    runner/main.mjs
```

## 声明清单

`alx.json` 必须包含 `id`、`name`、`version`、`entry` 与 `web.root`。`id` 使用小写字母、数字和连字符；`web.root` 指向插件目录内的静态页面目录。

## 执行动作

页面向 `POST /api/v1/setup/plugins/<id>/actions` 发送 `action`、`confirm` 与 `params`。执行器从标准输入读取一个 JSON 请求，并只向标准输出写入一个 JSON 响应。
