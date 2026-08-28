import '@/assets/css/index.scss'
import { StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import AppProviders from '@/AppProviders'
import PwaUpdatePrompt from '@/components/PwaUpdatePrompt'
import { createAppRouter } from '@/router'
import Loading from '@/Loading'

const router = createAppRouter()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <PwaUpdatePrompt />
      <Suspense fallback={<Loading />}>
        <RouterProvider router={router} />
      </Suspense>
    </AppProviders>
  </StrictMode>
)
