import React, { useEffect, useRef, useState } from 'react'
import MonacoEditor from './MonacoEditor'
import type {
  AlemonJSButton,
  RenderItem
} from './BubbleTypes'
import {
  defaultCode as curDefaultCode,
  mockAlemonJS,
  tipCode
} from './mock'
import classnames from 'classnames'
import { useEffectTheme } from '../core/theme'

const BubblePreview: React.FC = ({
  defaultCode
}: {
  defaultCode?: string
}) => {
  const [code, setCode] = useState<string>(
    defaultCode ?? curDefaultCode
  )
  const [items, setItems] = useState<RenderItem[] | null>(
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

      const context = {
        format: mockAlemonJS.format,
        Text: mockAlemonJS.Text,
        BT: mockAlemonJS.BT,
        console
      }

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

      if (result && Array.isArray(result)) {
        setItems(result as RenderItem[])
        if ((result as RenderItem[]).length === 0) {
          setError('代码执行成功，但返回了空数组')
          setItems([])
        }
      } else {
        throw new Error('App 必须返回 format() 的结果数组')
      }
    } catch (err: any) {
      console.error('AlemonJS 代码执行错误:', err)
      setItems(null)
      setError(err?.message || String(err))
    }
  }

  const handleButtonClick = (button: AlemonJSButton) => {
    alert(
      `按钮被点击: ${button.text}\n动作: ${button.action}`
    )
  }

  return (
    <div id="alemon-bubble-preview" className="font-sans ">
      {/* 固定整体卡片高度，移动端较小，桌面适中；内部使用 flex 填充 */}
      <div className="max-w-7xl mx-auto bg-white dark:bg-slate-900 rounded-xl shadow-lg overflow-hidden flex flex-col h-[65vh] md:h-[70vh] min-h-[22rem]">
        {/* Header */}
        <div className="h-14 bg-slate-900 text-white px-4 md:px-5 py-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="font-semibold">
              Edit(试用)
            </span>
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
        <div className="md:hidden flex border-b border-slate-200 dark:border-slate-800">
          <button
            className={classnames('flex-1 py-2 text-sm', {
              'text-slate-900 dark:text-slate-100 border-b-2 border-cyan-500 font-medium':
                mobileView === 'editor',
              'text-slate-500 dark:text-slate-400':
                mobileView !== 'editor'
            })}
            onClick={() => setMobileView('editor')}
          >
            编辑
          </button>
          <button
            className={classnames('flex-1 py-2 text-sm', {
              'text-slate-900 dark:text-slate-100 border-b-2 border-cyan-500 font-medium':
                mobileView === 'preview',
              'text-slate-500 dark:text-slate-400':
                mobileView !== 'preview'
            })}
            onClick={() => setMobileView('preview')}
          >
            预览
          </button>
        </div>

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
                    {tipCode}
                  </pre>
                </>
              ) : items && items.length > 0 ? (
                items.map((item, idx) => {
                  if (!item) return null
                  const roleClass = (item as any).role
                    ? (item as any).role
                    : 'assistant'
                  if (item.type === 'text') {
                    return (
                      <div
                        key={idx}
                        className={classnames(
                          'max-w-[85%] flex flex-col',
                          {
                            'self-end':
                              roleClass === 'user',
                            'self-start':
                              roleClass !== 'user'
                          }
                        )}
                      >
                        <div
                          className={classnames(
                            'p-3.5 rounded-2xl shadow-sm',
                            {
                              'bg-slate-900 text-white border border-slate-800 rounded-br-sm':
                                roleClass === 'user',
                              'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm':
                                roleClass !== 'user'
                            }
                          )}
                        >
                          <div className="whitespace-pre-wrap leading-6 text-[15px]">
                            {item.content}
                          </div>
                        </div>
                      </div>
                    )
                  } else if (item.type === 'buttons') {
                    const buttonClass = classnames(
                      'inline-flex items-center px-3.5 py-1.5 rounded-full text-sm shadow-sm focus:outline-none',
                      {
                        'border border-cyan-400/40 bg-transparent text-cyan-300 hover:bg-cyan-500/10 focus:ring-2 focus:ring-cyan-500/40':
                          roleClass === 'user',
                        'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-slate-300':
                          roleClass !== 'user'
                      }
                    )
                    return (
                      <div
                        key={idx}
                        className={classnames(
                          'max-w-[85%] flex flex-col',
                          {
                            'self-end':
                              roleClass === 'user',
                            'self-start':
                              roleClass !== 'user'
                          }
                        )}
                      >
                        <div
                          className={classnames(
                            'p-3.5 rounded-2xl shadow-sm',
                            {
                              'bg-slate-900 text-white border border-slate-800 rounded-br-sm':
                                roleClass === 'user',
                              'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm':
                                roleClass !== 'user'
                            }
                          )}
                        >
                          <div className="flex flex-wrap gap-1.5">
                            {item.buttons.map((btn, i) => (
                              <button
                                key={i}
                                className={buttonClass}
                                onClick={() =>
                                  handleButtonClick(btn)
                                }
                              >
                                {btn.text}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  } else if (item.type === 'bubble') {
                    const rows =
                      item.rows && item.rows.length
                        ? item.rows
                        : item.buttons
                          ? [item.buttons]
                          : []
                    const totalButtons = rows.reduce(
                      (acc, r) => acc + r.length,
                      0
                    )
                    const hasButtons = totalButtons > 0
                    const buttonClass = classnames(
                      'inline-flex items-center px-3.5 py-1.5 rounded-full text-sm shadow-sm focus:outline-none',
                      {
                        'border border-cyan-400/40 bg-transparent text-cyan-300 hover:bg-cyan-500/10 focus:ring-2 focus:ring-cyan-500/40':
                          roleClass === 'user',
                        'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus:ring-2 focus:ring-slate-300':
                          roleClass !== 'user'
                      }
                    )
                    return (
                      <div
                        key={idx}
                        className={classnames(
                          'max-w-[85%] flex flex-col',
                          {
                            'self-end':
                              roleClass === 'user',
                            'self-start':
                              roleClass !== 'user'
                          }
                        )}
                      >
                        <div
                          className={classnames(
                            'p-3.5 rounded-2xl shadow-sm',
                            {
                              'bg-slate-900 text-white border border-slate-800 rounded-br-sm':
                                roleClass === 'user',
                              'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-bl-sm':
                                roleClass !== 'user'
                            }
                          )}
                        >
                          {item.content ? (
                            <div className="whitespace-pre-wrap leading-6 text-[15px]">
                              {item.content}
                            </div>
                          ) : null}
                          {hasButtons ? (
                            <div className="flex flex-col gap-1.5 mt-2">
                              {rows.map((rowBtns, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="flex flex-wrap gap-1.5"
                                >
                                  {rowBtns.map((btn, i) => (
                                    <button
                                      key={`${rIdx}-${i}`}
                                      className={
                                        buttonClass
                                      }
                                      onClick={() =>
                                        handleButtonClick(
                                          btn
                                        )
                                      }
                                    >
                                      {btn.text}
                                    </button>
                                  ))}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    )
                  }
                  return null
                })
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
