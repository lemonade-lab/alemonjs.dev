export type AlemonJSText = {
  type: 'Text'
  content: string
}

export type AlemonJSButton = {
  type: 'Button'
  text: string
  action: string
}

export type AlemonJSButtonRow = {
  type: 'ButtonRow'
  buttons: AlemonJSButton[]
}

export type AlemonJSButtonGroup = {
  type: 'ButtonGroup'
  rows: AlemonJSButtonRow[]
}

export type RenderItem =
  | { type: 'text'; content: string; role?: string }
  | {
      type: 'buttons'
      buttons: AlemonJSButton[]
      role?: string
    }
  | {
      type: 'bubble'
      content?: string
      buttons?: AlemonJSButton[]
      rows?: AlemonJSButton[][]
      role?: string
    }
