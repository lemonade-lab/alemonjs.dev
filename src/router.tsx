import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import DocsLayout from '@/layouts/DocsLayout'
import BlogLayout from '@/layouts/BlogLayout'

const Home = lazy(() => import('@/pages/Home/App'))
const BlogList = lazy(() => import('@/pages/BlogList'))

// 自动生成的文档导入
const Doc0 = lazy(() => import('../docs/alemonjsDocs/advance/config.md'))
const Doc1 = lazy(() => import('../docs/alemonjsDocs/advance/message-type.md'))
const Doc2 = lazy(() => import('../docs/alemonjsDocs/advance/route-mw.md'))
const Doc3 = lazy(() => import('../docs/alemonjsDocs/advance/route.md'))
const Doc4 = lazy(() => import('../docs/alemonjsDocs/advance/utils.md'))
const Doc5 = lazy(() => import('../docs/alemonjsDocs/basic/cycle.md'))
const Doc6 = lazy(() => import('../docs/alemonjsDocs/basic/data-type.md'))
const Doc7 = lazy(() => import('../docs/alemonjsDocs/basic/hook.mdx'))
const Doc8 = lazy(() => import('../docs/alemonjsDocs/basic/middleware.md'))
const Doc9 = lazy(() => import('../docs/alemonjsDocs/basic/priority.md'))
const Doc10 = lazy(() => import('../docs/alemonjsDocs/basic/response-cycle.md'))
const Doc11 = lazy(() => import('../docs/alemonjsDocs/basic/response.md'))
const Doc12 = lazy(() => import('../docs/alemonjsDocs/basic/route.md'))
const Doc13 = lazy(() => import('../docs/alemonjsDocs/basic/send.md'))
const Doc14 = lazy(() => import('../docs/alemonjsDocs/expert/class.md'))
const Doc15 = lazy(() => import('../docs/alemonjsDocs/expert/platforms.md'))
const Doc16 = lazy(() => import('../docs/alemonjsDocs/expert/sdk.md'))
const Doc17 = lazy(() => import('../docs/alemonjsDocs/open/desktop.md'))
const Doc18 = lazy(() => import('../docs/alemonjsDocs/open/models.md'))
const Doc19 = lazy(() => import('../docs/apps.md'))
const Doc20 = lazy(() => import('../docs/config.md'))
const Doc21 = lazy(() => import('../docs/environment.md'))
const Doc22 = lazy(() => import('../docs/intro.md'))
const Doc23 = lazy(() => import('../docs/start.mdx'))

// 自动生成的博客导入
const Blog15 = lazy(() => import('../blog/2026/01/22/v2.1.17.md'))
const Blog14 = lazy(() => import('../blog/2026/01/08/v2.1.15.md'))
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
        path: 'alemonjsDocs/advance/config',
        element: <Doc0 />
      },
      {
        path: 'alemonjsDocs/advance/message-type',
        element: <Doc1 />
      },
      {
        path: 'alemonjsDocs/advance/route-mw',
        element: <Doc2 />
      },
      {
        path: 'alemonjsDocs/advance/route',
        element: <Doc3 />
      },
      {
        path: 'alemonjsDocs/advance/utils',
        element: <Doc4 />
      },
      {
        path: 'alemonjsDocs/basic/cycle',
        element: <Doc5 />
      },
      {
        path: 'alemonjsDocs/basic/data-type',
        element: <Doc6 />
      },
      {
        path: 'alemonjsDocs/basic/hook',
        element: <Doc7 />
      },
      {
        path: 'alemonjsDocs/basic/middleware',
        element: <Doc8 />
      },
      {
        path: 'alemonjsDocs/basic/priority',
        element: <Doc9 />
      },
      {
        path: 'alemonjsDocs/basic/response-cycle',
        element: <Doc10 />
      },
      {
        path: 'alemonjsDocs/basic/response',
        element: <Doc11 />
      },
      {
        path: 'alemonjsDocs/basic/route',
        element: <Doc12 />
      },
      {
        path: 'alemonjsDocs/basic/send',
        element: <Doc13 />
      },
      {
        path: 'alemonjsDocs/expert/class',
        element: <Doc14 />
      },
      {
        path: 'alemonjsDocs/expert/platforms',
        element: <Doc15 />
      },
      {
        path: 'alemonjsDocs/expert/sdk',
        element: <Doc16 />
      },
      {
        path: 'alemonjsDocs/open/desktop',
        element: <Doc17 />
      },
      {
        path: 'alemonjsDocs/open/models',
        element: <Doc18 />
      },
      {
        path: 'apps',
        element: <Doc19 />
      },
      {
        path: 'config',
        element: <Doc20 />
      },
      {
        path: 'environment',
        element: <Doc21 />
      },
      {
        path: 'intro',
        element: <Doc22 />
      },
      {
        path: 'start',
        element: <Doc23 />
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
        path: '2026/01/22/v2.1.17',
        element: <Blog15 />
      },
      {
        path: '2026/01/08/v2.1.15',
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
