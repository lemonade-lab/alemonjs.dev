---
label: '周期'
sidebar_position: 6
---

# 周期

:::info

在不同的时间段处理合适的回调

:::

```ts title="src/index.ts"
export default defineChildren({
  // 创建时
  onCreated() {
    /**
     * 尽量避免直接把耗时，且阻塞运行的内容直接放在脚本内。
     * 尽可能的把可能造成程序停止的操作放置在此处
     */
  },
  // 建立res和mw索引之后
  onMounted({ response, middleware }) {
    // 模块索引识别完成时。也就是 onCreated 执行完之后。
  },
  // onCreated 和 onMounted 出现意外后
  unMounted() {
    // 意外卸载
  }
})
```
