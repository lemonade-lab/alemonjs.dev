import React from 'react'
import { Tabs } from 'antd'

type Key = 'editor' | 'preview'

export interface MobileTabsProps {
  activeKey: Key
  onChange: (key: Key) => void
  className?: string
}

const MobileTabs: React.FC<MobileTabsProps> = ({
  activeKey,
  onChange,
  className
}) => {
  return (
    <div
      className={`md:hidden flex border-b border-slate-200 dark:border-slate-800 ${className || ''}`}
    >
      <Tabs
        activeKey={activeKey}
        onChange={k => onChange(k as Key)}
        className="w-full m-0"
        items={[
          { key: 'editor', label: '编辑' },
          { key: 'preview', label: '预览' }
        ]}
        centered
      />
    </div>
  )
}

export default MobileTabs
