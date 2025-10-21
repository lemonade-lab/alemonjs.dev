import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor from './MonacoEditor'
import classnames from 'classnames'
import { useEffectTheme } from '../core/theme'
import MessageBubble from './Bubble/MessageBubble'
import type { DataEnums } from 'alemonjs'
import * as Alemon from 'alemonjs'
import { CodeMap } from './Bubble/mock'
import MobileTabs from './Bubble/MobileTabs'
const BubblePreview: React.FC = ({
  codeKey,
  minHeight
}: {
  codeKey?: string
  minHeight?: number
}) => {
  const [code, setCode] = useState<string>(
    CodeMap[codeKey] ?? CodeMap['default']
  )
  const [items, setItems] = useState<DataEnums[][] | null>(
    null
  )
  const [error, setError] = useState<string | null>(null)
  const previewRef = useRef<HTMLDivElement | null>(null)
  const [mobileView, setMobileView] = useState<
    'editor' | 'preview'
  >('editor')

  // 让容器跟随 docusaurus 的 data-theme 切换 dark 类
  useEffectTheme('data-theme', 'alemon-bubble-preview')

  // 同步 Monaco 主题
  const [editorTheme, setEditorTheme] = useState<
    'vs' | 'vs-dark'
  >('vs')

  useEffect(() => {
    if (typeof document === 'undefined') return
    const updateTheme = () => {
      const t =
        document.documentElement.getAttribute('data-theme')
      setEditorTheme(t === 'dark' ? 'vs-dark' : 'vs')
    }
    updateTheme()
    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    })
    return () => observer.disconnect()
  }, [])

  // 滚动到底部
  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.scrollTop =
        previewRef.current.scrollHeight
    }
  }, [items, error])

  // 初始运行
  useEffect(() => {
    runAlemonJSCode()
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        runAlemonJSCode()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () =>
      window.removeEventListener('keydown', onKeyDown)
  }, [code])

  function runAlemonJSCode() {
    setError(null)
    try {
      const userCode = code.trim()

      // 移除 import/export 相关的声明
      const processedCode = userCode
        .replace(
          /import\s+{[^}]*}\s+from\s+['"]alemonjs['"];?/g,
          ''
        )
        .replace(/export\s+default\s+App;?/g, '')

      // 将 alemonjs 包的导出作为执行上下文注入
      const context = { ...Alemon, console }

      const argNames = Object.keys(context)
      const argValues = Object.values(context)

      const fullCode = `
                "use strict";
                ${processedCode}
                return App();
            `

      const AppFunc = new Function(
        ...argNames,
        fullCode
      ) as (...args: any[]) => any
      const result = AppFunc(...argValues)

      // 兼容两种返回：DataEnums[]（单条气泡）或 DataEnums[][]（多条气泡）
      if (!Array.isArray(result)) {
        throw new Error(
          'App 必须返回 format(...) 的结果（DataEnums[] 或 DataEnums[][]）'
        )
      }

      let bubbles: DataEnums[][] = []
      if (result.length === 0) {
        bubbles = []
      } else if (Array.isArray(result[0])) {
        // 多条气泡
        bubbles = (result as any[]).filter(
          Array.isArray
        ) as DataEnums[][]
      } else if (
        typeof (result as any)[0] === 'object' &&
        (result as any)[0] &&
        'type' in (result as any)[0]
      ) {
        // 单条气泡
        bubbles = [result as DataEnums[]]
      } else {
        throw new Error(
          '无法识别返回的数据结构，请返回 format(...) 的结果（DataEnums[] 或 DataEnums[][]）'
        )
      }

      setItems(bubbles)
      if (bubbles.length === 0) {
        setError('代码执行成功，但返回了空结果')
      }
    } catch (err: any) {
      console.error('AlemonJS 代码执行错误:', err)
      setItems(null)
      setError(err?.message || String(err))
    }
  }

  return (
    <div id="alemon-bubble-preview" className="font-sans ">
      {/* 固定整体卡片高度，移动端较小，桌面适中；内部使用 flex 填充 */}
      <div
        className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden flex flex-col min-h-[18rem]"
        style={{
          minHeight: minHeight
        }}
      >
        {/* Header */}
        <div className="h-14 bg-slate-900 text-white px-4 md:px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-semibold">Edit</span>
            <span className="text-xs opacity-80">
              format
            </span>
          </div>
          <button
            onClick={runAlemonJSCode}
            className="border border-cyan-400/60 text-cyan-300 hover:bg-cyan-500/10 font-medium py-1.5 px-3 rounded-md"
          >
            运行
          </button>
        </div>

        {/* 移动端切换 */}
        <MobileTabs
          activeKey={mobileView}
          onChange={k => setMobileView(k)}
        />

        {/* 内容区 */}
        <div className="flex-1 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200 dark:divide-slate-800">
          {/* 编辑器 */}
          <div
            className={classnames(
              'flex-1 md:basis-1/2 flex flex-col min-w-0',
              { 'hidden md:flex': mobileView === 'preview' }
            )}
          >
            <MonacoEditor
              value={code}
              language="typescript"
              width="100%"
              height="100%"
              theme={editorTheme}
              disabled={false}
              onChange={val => setCode(val || '')}
              onSave={runAlemonJSCode}
              options={{
                fontSize: 14,
                wordWrap: 'on',
                automaticLayout: true
              }}
            />
          </div>

          {/* 预览 */}
          <div
            className={classnames(
              'flex-1 md:basis-1/2 flex flex-col min-w-0',
              { 'hidden md:flex': mobileView === 'editor' }
            )}
          >
            <div
              id="preview"
              ref={previewRef}
              className="flex-1 p-4 overflow-y-auto bg-[#f8f9fa] dark:bg-slate-900 flex flex-col"
            >
              {error ? (
                <>
                  <div className="bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 p-4 rounded-md border-l-4 border-red-600 dark:border-red-700 font-mono text-sm">
                    <strong className="mr-2">
                      执行错误:
                    </strong>
                    {error}
                  </div>

                  <pre className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-md p-4 font-mono text-sm whitespace-pre-wrap dark:text-slate-100">
                    {CodeMap['tip']}
                  </pre>
                </>
              ) : items && items.length > 0 ? (
                items.map((bubble, idx) => (
                  <div
                    key={idx}
                    className={classnames(
                      'max-w-[85%] mb-3',
                      { 'self-start': true }
                    )}
                  >
                    <MessageBubble
                      data={bubble}
                      createAt={Date.now()}
                    />
                  </div>
                ))
              ) : (
                <div className="max-w-[85%] mb-2 self-start">
                  <div className="p-4 rounded-xl shadow bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 border border-gray-200 dark:border-slate-700 rounded-bl-sm">
                    <div className="whitespace-pre-wrap">
                      请点击"运行代码"查看 AlemonJS
                      格式的消息渲染效果
                    </div>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-slate-400 mt-1">
                    等待运行代码...
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BubblePreview
