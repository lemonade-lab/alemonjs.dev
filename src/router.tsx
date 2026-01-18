import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import DocsLayout from '@/layouts/DocsLayout'
import BlogLayout from '@/layouts/BlogLayout'

const Home = lazy(() => import('@/pages/Home/App'))
const BlogList = lazy(() => import('@/pages/BlogList'))

// 自动生成的文档导入
const Doc0 = lazy(
  () => import('../docs/alemonjsDocs/advance/5-message-type.md')
)
const Doc1 = lazy(() => import('../docs/alemonjsDocs/advance/6-config.md'))
const Doc2 = lazy(() => import('../docs/alemonjsDocs/advance/7-route.md'))
const Doc3 = lazy(() => import('../docs/alemonjsDocs/advance/8-route-mw.md'))
const Doc4 = lazy(() => import('../docs/alemonjsDocs/advance/9-utils.md'))
const Doc5 = lazy(() => import('../docs/alemonjsDocs/basic/1-api.md'))
const Doc6 = lazy(() => import('../docs/alemonjsDocs/basic/2-hook.mdx'))
const Doc7 = lazy(() => import('../docs/alemonjsDocs/basic/3-data-type.md'))
const Doc8 = lazy(() => import('../docs/alemonjsDocs/basic/4-send.md'))
const Doc9 = lazy(() => import('../docs/alemonjsDocs/basic/5-mw.md'))
const Doc10 = lazy(() => import('../docs/alemonjsDocs/basic/6-priority.md'))
const Doc11 = lazy(() => import('../docs/alemonjsDocs/basic/7-main.md'))
const Doc12 = lazy(() => import('../docs/alemonjsDocs/expert/1-route.md'))
const Doc13 = lazy(() => import('../docs/alemonjsDocs/expert/2-sdk.md'))
const Doc14 = lazy(() => import('../docs/alemonjsDocs/expert/3-class.md'))
const Doc15 = lazy(() => import('../docs/alemonjsDocs/expert/3-platforms.md'))
const Doc16 = lazy(() => import('../docs/alemonjsDocs/open/7-models.md'))
const Doc17 = lazy(() => import('../docs/alemonjsDocs/open/8-desktop.md'))
const Doc18 = lazy(() => import('../docs/apps.md'))
const Doc19 = lazy(() => import('../docs/environment.md'))
const Doc20 = lazy(() => import('../docs/intro.md'))
const Doc21 = lazy(() => import('../docs/start.mdx'))

// 自动生成的博客导入
const Blog14 = lazy(() => import('../blog/2026/01/08/v2.1.12.md'))
const Blog13 = lazy(() => import('../blog/2025/05/30/v2.1.0.md'))
const Blog12 = lazy(() => import('../blog/2025/05/13/v2.0.16.md'))
const Blog11 = lazy(() => import('../blog/2025/03/26/v2.0.4.md'))
const Blog10 = lazy(() => import('../blog/2025/03/14/v2.0.0.md'))
const Blog9 = lazy(() => import('../blog/2025/02/12/v2.0.0-rc.94.md'))
const Blog8 = lazy(() => import('../blog/2025/01/09/v2.0.0-rc.88.md'))
const Blog7 = lazy(() => import('../blog/2025/01/07/v2.0.0-rc.84.md'))
const Blog6 = lazy(() => import('../blog/2025/01/02/v2.0.0-rc.81.md'))
const Blog5 = lazy(() => import('../blog/2024/12/31/2.0.0-rc.78.md'))
const Blog4 = lazy(() => import('../blog/2024/12/28/2.0.0-rc.76.md'))
const Blog3 = lazy(() => import('../blog/2024/12/24/2.0.0-rc.74.md'))
const Blog2 = lazy(() => import('../blog/2024/11/18/2.0.0-rc.54.md'))
const Blog1 = lazy(() => import('../blog/2024/11/09/2.0.0-rc.44.md'))
const Blog0 = lazy(() => import('../blog/2024/10/09/2.0.0-rc.33.md'))

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/docs',
    element: <DocsLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/docs/intro" replace />
      },
      {
        path: 'alemonjsDocs/advance/5-message-type',
        element: <Doc0 />
      },
      {
        path: 'alemonjsDocs/advance/6-config',
        element: <Doc1 />
      },
      {
        path: 'alemonjsDocs/advance/7-route',
        element: <Doc2 />
      },
      {
        path: 'alemonjsDocs/advance/8-route-mw',
        element: <Doc3 />
      },
      {
        path: 'alemonjsDocs/advance/9-utils',
        element: <Doc4 />
      },
      {
        path: 'alemonjsDocs/basic/1-api',
        element: <Doc5 />
      },
      {
        path: 'alemonjsDocs/basic/2-hook',
        element: <Doc6 />
      },
      {
        path: 'alemonjsDocs/basic/3-data-type',
        element: <Doc7 />
      },
      {
        path: 'alemonjsDocs/basic/4-send',
        element: <Doc8 />
      },
      {
        path: 'alemonjsDocs/basic/5-mw',
        element: <Doc9 />
      },
      {
        path: 'alemonjsDocs/basic/6-priority',
        element: <Doc10 />
      },
      {
        path: 'alemonjsDocs/basic/7-main',
        element: <Doc11 />
      },
      {
        path: 'alemonjsDocs/expert/1-route',
        element: <Doc12 />
      },
      {
        path: 'alemonjsDocs/expert/2-sdk',
        element: <Doc13 />
      },
      {
        path: 'alemonjsDocs/expert/3-class',
        element: <Doc14 />
      },
      {
        path: 'alemonjsDocs/expert/3-platforms',
        element: <Doc15 />
      },
      {
        path: 'alemonjsDocs/open/7-models',
        element: <Doc16 />
      },
      {
        path: 'alemonjsDocs/open/8-desktop',
        element: <Doc17 />
      },
      {
        path: 'apps',
        element: <Doc18 />
      },
      {
        path: 'environment',
        element: <Doc19 />
      },
      {
        path: 'intro',
        element: <Doc20 />
      },
      {
        path: 'start',
        element: <Doc21 />
      }
    ]
  },
  {
    path: '/blog',
    element: <BlogLayout />,
    children: [
      {
        index: true,
        element: <BlogList />
      },
      {
        path: '2026/01/08/v2.1.12',
        element: <Blog14 />
      },
      {
        path: '2025/05/30/v2.1.0',
        element: <Blog13 />
      },
      {
        path: '2025/05/13/v2.0.16',
        element: <Blog12 />
      },
      {
        path: '2025/03/26/v2.0.4',
        element: <Blog11 />
      },
      {
        path: '2025/03/14/v2.0.0',
        element: <Blog10 />
      },
      {
        path: '2025/02/12/v2.0.0-rc.94',
        element: <Blog9 />
      },
      {
        path: '2025/01/09/v2.0.0-rc.88',
        element: <Blog8 />
      },
      {
        path: '2025/01/07/v2.0.0-rc.84',
        element: <Blog7 />
      },
      {
        path: '2025/01/02/v2.0.0-rc.81',
        element: <Blog6 />
      },
      {
        path: '2024/12/31/2.0.0-rc.78',
        element: <Blog5 />
      },
      {
        path: '2024/12/28/2.0.0-rc.76',
        element: <Blog4 />
      },
      {
        path: '2024/12/24/2.0.0-rc.74',
        element: <Blog3 />
      },
      {
        path: '2024/11/18/2.0.0-rc.54',
        element: <Blog2 />
      },
      {
        path: '2024/11/09/2.0.0-rc.44',
        element: <Blog1 />
      },
      {
        path: '2024/10/09/2.0.0-rc.33',
        element: <Blog0 />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
])

export default router
