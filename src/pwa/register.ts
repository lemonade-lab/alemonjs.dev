import { registerSW } from 'virtual:pwa-register'

const UPDATE_INTERVAL = 5 * 60 * 1000
const NEED_REFRESH_EVENT = 'vite-pwa:need-refresh'
const OFFLINE_READY_EVENT = 'vite-pwa:offline-ready'

export function registerPWA() {
  let cleanupCheck: (() => void) | undefined

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      window.dispatchEvent(new Event(NEED_REFRESH_EVENT))
    },
    onOfflineReady() {
      window.dispatchEvent(new Event(OFFLINE_READY_EVENT))
    },
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return

      const checkForUpdate = () => {
        if (document.visibilityState === 'visible' && navigator.onLine) {
          void registration.update()
        }
      }

      void registration.update()

      const timer = window.setInterval(checkForUpdate, UPDATE_INTERVAL)
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          checkForUpdate()
        }
      }
      const handleOnline = () => {
        checkForUpdate()
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      window.addEventListener('online', handleOnline)

      cleanupCheck = () => {
        window.clearInterval(timer)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
        window.removeEventListener('online', handleOnline)
      }
    }
  })

  return {
    updateSW,
    cleanup() {
      cleanupCheck?.()
    }
  }
}

export { NEED_REFRESH_EVENT, OFFLINE_READY_EVENT }
