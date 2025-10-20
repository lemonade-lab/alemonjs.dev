import type {
  AlemonJSText,
  AlemonJSButton,
  AlemonJSButtonRow,
  AlemonJSButtonGroup,
  RenderItem
} from './BubbleTypes'

export const defaultCode = `import { format, Text} from 'alemonjs';

const App = () => {
    return format(
        Text("Hello Word!")
    )
}

export default App;`

export const tipCode = `// 正确格式示例：
import { format, Text} from 'alemonjs';

const App = () => {
    return format(
        Text("Hello Word!")
    )
}

export default App;`

export const mockAlemonJS = {
  format: (
    ...elements: Array<
      | AlemonJSText
      | AlemonJSButton
      | AlemonJSButtonRow
      | AlemonJSButtonGroup
    >
  ) => {
    // 将所有 Text 和 Button/ButtonRow 合并为一个气泡
    let mergedText = ''
    const rows: AlemonJSButton[][] = []
    let currentRow: AlemonJSButton[] = []

    const flushCurrentRow = () => {
      if (currentRow.length) {
        rows.push(currentRow)
        currentRow = []
      }
    }

    elements.forEach(element => {
      if (!element) return
      if ((element as AlemonJSText).type === 'Text') {
        mergedText += (element as AlemonJSText).content
      } else if (
        (element as AlemonJSButtonRow).type === 'ButtonRow'
      ) {
        flushCurrentRow()
        rows.push([
          ...(element as AlemonJSButtonRow).buttons
        ])
      } else if (
        (element as AlemonJSButtonGroup).type ===
        'ButtonGroup'
      ) {
        flushCurrentRow()
        ;(element as AlemonJSButtonGroup).rows.forEach(
          r => {
            rows.push([...(r.buttons || [])])
          }
        )
      } else if (
        (element as AlemonJSButton).type === 'Button'
      ) {
        currentRow.push(element as AlemonJSButton)
      }
    })

    flushCurrentRow()

    const bubble: RenderItem = {
      type: 'bubble',
      content: mergedText.trim() || undefined,
      rows: rows.length ? rows : undefined,
      role: 'assistant'
    }

    // 兼容：如未形成行但有孤立按钮，放入单行
    if (!bubble.rows || bubble.rows.length === 0) {
      // 无行无文本，返回空
      if (!bubble.content) return []
    }
    return [bubble]
  },

  Text: (content: string): AlemonJSText => {
    return {
      type: 'Text',
      content
    }
  },

  BT: Object.assign(
    ((text: string, action?: string) => {
      return {
        type: 'Button',
        text,
        action: action || `action:${text}`
      } as AlemonJSButton
    }) as any,
    {
      row: (...buttons: AlemonJSButton[]) => {
        return {
          type: 'ButtonRow',
          buttons
        } as AlemonJSButtonRow
      },
      group: (...rows: AlemonJSButtonRow[]) => {
        return {
          type: 'ButtonGroup',
          rows
        } as AlemonJSButtonGroup
      }
    }
  )
}
