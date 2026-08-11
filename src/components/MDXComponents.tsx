// MDX 组件库 - 类似 Docusaurus 的主题组件
import { ReactNode, useState, Children, ReactElement, useRef } from 'react'
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
  const firstValue = tabs[0]?.props?.value || ''
  const [activeTab, setActiveTab] = useState(defaultValue || firstValue)

  return (
    <div className="my-6  rounded-xl overflow-hidden  ">
      <div className="flex flex-wrap overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.props.value}
            onClick={() => setActiveTab(tab.props.value)}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-all duration-200 whitespace-nowrap ${
              activeTab === tab.props.value
                ? 'bg-[var(--surface)] text-[var(--text)] border-b-2 border-[var(--accent)] shadow-sm'
                : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-muted)]'
            }`}
          >
            {tab.props.label}
          </button>
        ))}
      </div>
      <div className="p-1">
        {tabs.find(tab => tab.props.value === activeTab)?.props.children}
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
    <div
      className={`my-4 sm:my-6 p-3 sm:p-4 border-l-4 rounded-r-lg ${config.className} shadow-sm`}
    >
      <div className="flex items-center gap-2 font-semibold mb-2 text-xs sm:text-sm uppercase">
        <span className="text-base sm:text-lg">{config.icon}</span>
        <span>{title || config.title}</span>
      </div>
      <div className="prose pmax-w-none [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
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
function CodeBlock({ children }) {
  const codeRef = useRef<HTMLPreElement>(null)
  const handleCopy = async () => {
    try {
      const text = codeRef.current?.innerText || ''
      await navigator.clipboard.writeText(text)
    } catch (e) {
      console.error('复制失败', e)
    }
  }
  return (
    <div className="relative [&_div]:opacity-0 [&_div]:hover:opacity-100">
      <div className="absolute right-3 top-3   group-hover:opacity-100 transition-opacity duration-150">
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-2 px-2.5 py-1.5 bg-[var(--surface)] border border-[var(--line)] text-[var(--text)] text-xs rounded-md shadow-sm hover:bg-[var(--surface-muted)]"
        >
          复制
        </button>
      </div>
      <pre ref={codeRef}>{children}</pre>
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
