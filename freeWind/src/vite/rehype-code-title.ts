import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root, Element } from 'hast'

/**
 * rehype 插件：从代码块的 meta 字符串中提取 title 属性并包装结构
 * 必须在 rehype-highlight 之后运行
 */
const rehypeCodeTitle: Plugin<[], Root> = () => {
  return tree => {
    visit(tree, 'element', (node: Element, index, parent) => {
      if (node.tagName !== 'pre' || !parent || typeof index !== 'number') return

      const codeElement = node.children.find(
        (child): child is Element =>
          child.type === 'element' && child.tagName === 'code'
      )

      if (!codeElement || !codeElement.data) return

      // 从 code 元素的 data.meta 中提取 title
      const meta = (codeElement.data.meta as string) || ''
      const titleMatch = meta.match(/title="([^"]+)"/)

      if (!titleMatch || !titleMatch[1]) return

      const title = titleMatch[1]

      // 创建包装结构
      const wrapper: Element = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['code-block-with-title']
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: {
              className: ['code-block-header']
            },
            children: [{ type: 'text', value: title }]
          },
          node
        ]
      }

      // 替换原节点
      parent.children[index] = wrapper
    })
  }
}

export default rehypeCodeTitle
