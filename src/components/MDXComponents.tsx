// MDX 组件库 - 类似 Docusaurus 的主题组件
import {
  ReactNode,
  useState,
  Children,
  ReactElement,
  useRef,
  useId
} from 'react'
import BlogAuthor from './BlogAuthor'

// ============= Tabs 组件 =============
interface TabsProps {
  children: ReactNode
  defaultValue?: string
  groupId?: string
}

interface TabItemProps {
  value: string
  label: string
  children: ReactNode
  default?: boolean
}

export function Tabs({ children, defaultValue }: TabsProps) {
  const tabs = Children.toArray(children) as ReactElement<TabItemProps>[]
  const id = useId()
  const [activeTab, setActiveTab] = useState(
    defaultValue || tabs[0]?.props?.value
  )
  const selected = tabs.findIndex(tab => tab.props.value === activeTab)
  if (!tabs.length) return null
  const active = Math.max(0, selected)

  return (
    <div className="my-6 min-w-0">
      <div
        role="tablist"
        aria-label="示例选项"
        className="flex gap-1 overflow-x-auto p-1 rounded-lg bg-[var(--surface-raised)]"
      >
        {tabs.map((tab, index) => (
          <button
            type="button"
            key={tab.props.value}
            id={`${id}-${index}`}
            role="tab"
            aria-controls={`${id}-panel`}
            aria-selected={active === index}
            tabIndex={active === index ? 0 : -1}
            onClick={() => setActiveTab(tab.props.value)}
            onKeyDown={event => {
              const next = {
                ArrowLeft: (index - 1 + tabs.length) % tabs.length,
                ArrowRight: (index + 1) % tabs.length,
                Home: 0,
                End: tabs.length - 1
              }[event.key]
              if (next === undefined) return
              event.preventDefault()
              setActiveTab(tabs[next].props.value)
              document.getElementById(`${id}-${next}`)?.focus()
            }}
            className="shrink-0 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-[var(--text-muted)] hover:bg-[var(--surface-hover)] aria-selected:bg-[var(--accent-soft)] aria-selected:text-[var(--accent-text)]"
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div
        role="tabpanel"
        id={`${id}-panel`}
        aria-labelledby={`${id}-${active}`}
      >
        {tabs[active].props.children}
      </div>
    </div>
  )
}

export function TabItem({ children }: TabItemProps) {
  return <>{children}</>
}

// ============= Admonition (提示框) =============
interface AdmonitionProps {
  type?: 'note' | 'tip' | 'info' | 'warning' | 'danger' | 'caution'
  title?: string
  children: ReactNode
}

export function Admonition({
  type = 'note',
  title,
  children
}: AdmonitionProps) {
  const configs = {
    note: {
      icon: '📝',
      title: 'NOTE',
      className:
        'bg-[var(--surface-muted)] border-[var(--line)] text-[var(--text)]'
    },
    tip: {
      icon: '💡',
      title: 'TIP',
      className:
        'bg-green-50 dark:bg-green-900/30 border-green-500 dark:border-green-600 text-green-900 dark:text-green-300'
    },
    info: {
      icon: 'ℹ️',
      title: 'INFO',
      className:
        'bg-blue-50 dark:bg-blue-900/30 border-blue-500 dark:border-blue-600 text-blue-900 dark:text-blue-300'
    },
    warning: {
      icon: '⚠️',
      title: 'WARNING',
      className:
        'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-500 dark:border-yellow-600 text-yellow-900 dark:text-yellow-300'
    },
    danger: {
      icon: '🚨',
      title: 'DANGER',
      className:
        'bg-red-50 dark:bg-red-900/30 border-red-500 dark:border-red-600 text-red-900 dark:text-red-300'
    },
    caution: {
      icon: '⚡',
      title: 'CAUTION',
      className:
        'bg-orange-50 dark:bg-orange-900/30 border-orange-500 dark:border-orange-600 text-orange-900 dark:text-orange-300'
    }
  }

  const config = configs[type]

  return (
    <div className={`my-4 sm:my-6 p-3 sm:p-4 rounded-lg ${config.className}`}>
      <div className="flex items-center gap-2 font-semibold mb-2 text-xs sm:text-sm uppercase">
        <span className="text-base sm:text-lg" aria-hidden="true">
          {config.icon}
        </span>
        <span>{title || config.title}</span>
      </div>
      <div className="prose max-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
        {children}
      </div>
    </div>
  )
}

// ============= 细节/折叠 =============
interface DetailsProps {
  summary: string
  children: ReactNode
}

export function Details({ summary, children }: DetailsProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <details className="my-3 sm:my-4 border border-[var(--line)] rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
      <summary
        onClick={e => {
          e.preventDefault()
          setIsOpen(!isOpen)
        }}
        className="px-3 sm:px-4 py-2 sm:py-3 bg-[var(--surface-muted)] cursor-pointer hover:bg-[var(--surface)] transition-colors font-medium text-[var(--text)] select-none flex items-center justify-between text-sm sm:text-base"
      >
        <span className="flex-1 pr-2">{summary}</span>
        <svg
          className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </summary>
      {isOpen && (
        <div className="px-3 sm:px-4 py-2 sm:py-3 prose prose-sm max-w-none bg-[var(--surface)]">
          {children}
        </div>
      )}
    </details>
  )
}

// ============= 代码块（带复制按钮） =============
function CodeBlock({ children }: { children: ReactNode }) {
  const codeRef = useRef<HTMLPreElement>(null)
  const [status, setStatus] = useState('复制')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(codeRef.current?.textContent ?? '')
      setStatus('已复制')
    } catch {
      setStatus('复制失败')
    }
  }

  return (
    <div className="doc-code">
      <button
        type="button"
        className="doc-copy"
        onClick={handleCopy}
        aria-live="polite"
      >
        {status}
      </button>
      <pre ref={codeRef} tabIndex={0}>
        {children}
      </pre>
    </div>
  )
}

function Table({ children }: { children: ReactNode }) {
  return (
    <div className="doc-table" role="region" aria-label="表格" tabIndex={0}>
      <table>{children}</table>
    </div>
  )
}

// 导出为全局组件,可在 MDX 中直接使用
export default {
  Tabs,
  TabItem,
  Admonition,
  Details,
  BlogAuthor,
  pre: CodeBlock,
  table: Table,
  Note: (props: Omit<AdmonitionProps, 'type'>) => (
    <Admonition type="note" {...props} />
  ),
  Tip: (props: Omit<AdmonitionProps, 'type'>) => (
    <Admonition type="tip" {...props} />
  ),
  Info: (props: Omit<AdmonitionProps, 'type'>) => (
    <Admonition type="info" {...props} />
  ),
  Warning: (props: Omit<AdmonitionProps, 'type'>) => (
    <Admonition type="warning" {...props} />
  ),
  Danger: (props: Omit<AdmonitionProps, 'type'>) => (
    <Admonition type="danger" {...props} />
  ),
  Caution: (props: Omit<AdmonitionProps, 'type'>) => (
    <Admonition type="caution" {...props} />
  )
}
