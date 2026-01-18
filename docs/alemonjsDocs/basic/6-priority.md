---
label: '优先级'
sidebar_position: 6
---

# 优先级

:::info

如何让匹配的执行顺序更明确

:::

## 执行优先级

框架对于res和mw的收集，完全依靠目录&文件的顺序，

也就是说，所见的层级结构，就是匹配的优先级。

比如 `response/1/res.ts` 的优先级比 `response/2/res.ts` 高

因为在 `response`目录下，1 > 2，目录名为1的文件排在了目录名为2的前面。

在框架里，支持使用 `res.*.ts` 和 `mw.*.ts` 命名，

因此 `response/1/res.1.ts` 的优先级比 `response/1/res.2.ts` 高

因为在 `response/1`目录下，1 > 2，文件名为res.1的文件排在了文件名为res.2的前面。

## 应用优先级

依赖于 配置文件

```yaml title="alemon.config.yaml"
apps:
  - 'alemonjs-openai'
  - 'alemonjs-game'
```

应用的优先级 `alemonjs-openai` 比 `alemonjs-game` 高
