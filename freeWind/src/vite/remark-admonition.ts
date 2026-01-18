import { visit } from 'unist-util-visit'
import type { Root } from 'mdast'
import type { Node } from 'unist'

interface DirectiveNode extends Node {
  type: 'containerDirective' | 'leafDirective' | 'textDirective'
  name?: string
  attributes?: Record<string, string>
  label?: string
  data?: {
    hName?: string
    hProperties?: Record<string, unknown>
  }
}

export default function remarkAdmonition() {
  return (tree: Root) => {
    visit(tree, (node: Node) => {
      const directiveNode = node as DirectiveNode

      if (directiveNode.type === 'containerDirective') {
        const type = directiveNode.name?.toLowerCase()
        const validTypes = [
          'note',
          'tip',
          'info',
          'warning',
          'danger',
          'caution'
        ]

        if (type && validTypes.includes(type)) {
          const data = directiveNode.data || (directiveNode.data = {})

          const customTitle =
            directiveNode.attributes?.title || directiveNode.label || ''

          data.hName = 'Admonition'
          data.hProperties = {
            type,
            ...(customTitle && { title: customTitle })
          }
        }
      }
    })
  }
}
