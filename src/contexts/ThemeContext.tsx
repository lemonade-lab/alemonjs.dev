import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'light'
    // 从 localStorage 读取主题，或使用系统偏好
    try {
      const savedTheme = window.localStorage.getItem('theme')
      if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    } catch {
      // The browser can disable storage independently of theme support.
    }

    // 检测系统主题偏好
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    // 应用主题到 document
    if (typeof document === 'undefined') return
    const root = document.documentElement
    root.classList.remove('light', 'dark')
    root.classList.add(theme)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#1b1916' : '#f3f1ec')

    // 保存到 localStorage
    try {
      window.localStorage.setItem('theme', theme)
    } catch {
      // The current theme remains available for this visit.
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
