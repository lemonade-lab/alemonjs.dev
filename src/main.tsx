import '@/assets/css/index.scss'
import 'highlight.js/styles/github.css'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { MDXProvider } from '@mdx-js/react'
import { App as AntdApp } from 'antd'
import ThemeProvider from '@/contexts/ThemeContext'
import MDXComponents from '@/components/MDXComponents'
import PwaUpdatePrompt from '@/components/PwaUpdatePrompt'
import router from '@/router'
import Loading from '@/Loading'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AntdApp>
        <MDXProvider components={MDXComponents}>
          <PwaUpdatePrompt />
          <Suspense fallback={<Loading />}>
            <RouterProvider router={router} />
          </Suspense>
        </MDXProvider>
      </AntdApp>
    </ThemeProvider>
  </StrictMode>
)
