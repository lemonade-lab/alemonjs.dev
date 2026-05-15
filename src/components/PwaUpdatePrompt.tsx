import { useEffect, useRef } from 'react'
import { Button, message, notification } from 'antd'
import {
  NEED_REFRESH_EVENT,
  OFFLINE_READY_EVENT,
  registerPWA
} from '@/pwa/register'

export default function PwaUpdatePrompt() {
  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return
    initializedRef.current = true

    let hasPendingRefresh = false

    const handleNeedRefresh = () => {
      if (hasPendingRefresh) return
      hasPendingRefresh = true

      notification.info({
        key: 'pwa-update',
        message: '发现新版本',
        description: '已检测到站点更新。立即刷新可加载最新内容。',
        placement: 'bottomRight',
        duration: 0,
        btn: (
          <div className="flex items-center gap-2">
            <Button
              size="small"
              onClick={() => {
                notification.destroy('pwa-update')
                hasPendingRefresh = false
              }}
            >
              稍后
            </Button>
            <Button
              size="small"
              type="primary"
              onClick={async () => {
                notification.destroy('pwa-update')
                message.loading({
                  content: '正在更新到新版本…',
                  key: 'pwa-updating',
                  duration: 0
                })
                await pwa.updateSW(true)
              }}
            >
              立即刷新
            </Button>
          </div>
        )
      })
    }

    const handleOfflineReady = () => {
      message.success({
        content: '离线缓存已就绪，后续访问会更快。',
        key: 'pwa-offline-ready',
        duration: 2
      })
    }

    const handleControllerChange = () => {
      message.success({
        content: '已更新到最新版本，页面即将刷新。',
        key: 'pwa-updating',
        duration: 1.5
      })
      window.location.reload()
    }

    const pwa = registerPWA()
    window.addEventListener(NEED_REFRESH_EVENT, handleNeedRefresh)
    window.addEventListener(OFFLINE_READY_EVENT, handleOfflineReady)
    navigator.serviceWorker?.addEventListener(
      'controllerchange',
      handleControllerChange
    )

    return () => {
      notification.destroy('pwa-update')
      pwa.cleanup()
      window.removeEventListener(NEED_REFRESH_EVENT, handleNeedRefresh)
      window.removeEventListener(OFFLINE_READY_EVENT, handleOfflineReady)
      navigator.serviceWorker?.removeEventListener(
        'controllerchange',
        handleControllerChange
      )
    }
  }, [])

  return null
}
