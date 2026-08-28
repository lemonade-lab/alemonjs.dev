import { MDXProvider } from '@mdx-js/react'
import { App as AntdApp } from 'antd'
import { ReactNode } from 'react'
import ThemeProvider from '@/contexts/ThemeContext'
import MDXComponents from '@/components/MDXComponents'

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AntdApp>
        <MDXProvider components={MDXComponents}>{children}</MDXProvider>
      </AntdApp>
    </ThemeProvider>
  )
}
