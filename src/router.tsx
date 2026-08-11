import { lazy } from 'react'
import { createBrowserRouter, Navigate } from 'react-router-dom'
import DocsLayout from '@/layouts/DocsLayout'
import BlogLayout from '@/layouts/BlogLayout'

const Home = lazy(() => import('@/pages/Home/App'))
const BlogList = lazy(() => import('@/pages/BlogList'))

// 自动生成的文档导入
const Doc0 = lazy(() => import('../docs/alemonjsDocs/advanced/config.md'))
const Doc1 = lazy(() => import('../docs/alemonjsDocs/advanced/schedule.md'))
const Doc2 = lazy(() => import('../docs/alemonjsDocs/advanced/utils.md'))
const Doc3 = lazy(() => import('../docs/alemonjsDocs/core/cycle.md'))
const Doc4 = lazy(() => import('../docs/alemonjsDocs/core/data-type.md'))
const Doc5 = lazy(() => import('../docs/alemonjsDocs/core/hook.mdx'))
const Doc6 = lazy(() => import('../docs/alemonjsDocs/core/message-type.md'))
const Doc7 = lazy(() => import('../docs/alemonjsDocs/core/middleware.md'))
const Doc8 = lazy(() => import('../docs/alemonjsDocs/core/response.md'))
const Doc9 = lazy(() => import('../docs/alemonjsDocs/core/router-sdl.md'))
const Doc10 = lazy(() => import('../docs/alemonjsDocs/core/router.md'))
const Doc11 = lazy(
  () => import('../docs/alemonjsDocs/getting-started/config.md')
)
const Doc12 = lazy(
  () => import('../docs/alemonjsDocs/getting-started/intro.md')
)
const Doc13 = lazy(
  () => import('../docs/alemonjsDocs/getting-started/quick-start.mdx')
)
const Doc14 = lazy(() => import('../docs/alemonjsDocs/http/route-mw.md'))
const Doc15 = lazy(() => import('../docs/alemonjsDocs/http/route.md'))
const Doc16 = lazy(() => import('../docs/alemonjsDocs/modules/class.md'))
const Doc17 = lazy(() => import('../docs/alemonjsDocs/modules/desktop.md'))
const Doc18 = lazy(() => import('../docs/alemonjsDocs/modules/models.md'))
const Doc19 = lazy(() => import('../docs/alemonjsDocs/modules/platforms.md'))
const Doc20 = lazy(() => import('../docs/alemonx/develop/system-plugins.md'))
const Doc21 = lazy(() => import('../docs/alemonx/develop/webview.md'))
const Doc22 = lazy(
  () => import('../docs/alemonx/getting-started/quick-start.mdx')
)
const Doc23 = lazy(() => import('../docs/alemonx/reference/cli.md'))
const Doc24 = lazy(() => import('../docs/alemonx/reference/mcp.md'))
const Doc25 = lazy(() => import('../docs/alemonx/reference/plugin-manifest.md'))
const Doc26 = lazy(() => import('../docs/alemonx/use/agent/collaboration.md'))
const Doc27 = lazy(() => import('../docs/alemonx/use/agent/mcp.md'))
const Doc28 = lazy(
  () => import('../docs/alemonx/use/extensions/plugins-and-webview.md')
)
const Doc29 = lazy(
  () => import('../docs/alemonx/use/operations/access-and-safety.md')
)
const Doc30 = lazy(
  () => import('../docs/alemonx/use/operations/ai-operations.md')
)
const Doc31 = lazy(
  () => import('../docs/alemonx/use/projects/create-or-import.md')
)
const Doc32 = lazy(
  () => import('../docs/alemonx/use/runtime/run-and-monitor.md')
)
const Doc33 = lazy(() => import('../docs/apps-x.md'))
const Doc34 = lazy(() => import('../docs/apps.md'))
const Doc35 = lazy(() => import('../docs/environment.md'))
const Doc36 = lazy(() => import('../docs/install.mdx'))
const Doc37 = lazy(() => import('../docs/open.md'))

// 自动生成的博客导入
const Blog19 = lazy(() => import('../blog/2026/04/11/schedule-api.md'))
const Blog18 = lazy(() => import('../blog/2026/04/01/v2.1.52.md'))
const Blog17 = lazy(() => import('../blog/2026/02/28/v2.1.43.md'))
const Blog16 = lazy(() => import('../blog/2026/02/26/v2.1.22.md'))
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
        element: (
          <Navigate to="/docs/alemonx/getting-started/quick-start" replace />
        )
      },
      {
        path: 'alemonjsDocs/advanced/config',
        element: <Doc0 />
      },
      {
        path: 'alemonjsDocs/advanced/schedule',
        element: <Doc1 />
      },
      {
        path: 'alemonjsDocs/advanced/utils',
        element: <Doc2 />
      },
      {
        path: 'alemonjsDocs/core/cycle',
        element: <Doc3 />
      },
      {
        path: 'alemonjsDocs/core/data-type',
        element: <Doc4 />
      },
      {
        path: 'alemonjsDocs/core/hook',
        element: <Doc5 />
      },
      {
        path: 'alemonjsDocs/core/message-type',
        element: <Doc6 />
      },
      {
        path: 'alemonjsDocs/core/middleware',
        element: <Doc7 />
      },
      {
        path: 'alemonjsDocs/core/response',
        element: <Doc8 />
      },
      {
        path: 'alemonjsDocs/core/router-sdl',
        element: <Doc9 />
      },
      {
        path: 'alemonjsDocs/core/router',
        element: <Doc10 />
      },
      {
        path: 'alemonjsDocs/getting-started/config',
        element: <Doc11 />
      },
      {
        path: 'alemonjsDocs/getting-started/intro',
        element: <Doc12 />
      },
      {
        path: 'alemonjsDocs/getting-started/quick-start',
        element: <Doc13 />
      },
      {
        path: 'alemonjsDocs/http/route-mw',
        element: <Doc14 />
      },
      {
        path: 'alemonjsDocs/http/route',
        element: <Doc15 />
      },
      {
        path: 'alemonjsDocs/modules/class',
        element: <Doc16 />
      },
      {
        path: 'alemonjsDocs/modules/desktop',
        element: <Doc17 />
      },
      {
        path: 'alemonjsDocs/modules/models',
        element: <Doc18 />
      },
      {
        path: 'alemonjsDocs/modules/platforms',
        element: <Doc19 />
      },
      {
        path: 'alemonx/develop/system-plugins',
        element: <Doc20 />
      },
      {
        path: 'alemonx/develop/webview',
        element: <Doc21 />
      },
      {
        path: 'alemonx/getting-started/quick-start',
        element: <Doc22 />
      },
      {
        path: 'alemonx/reference/cli',
        element: <Doc23 />
      },
      {
        path: 'alemonx/reference/mcp',
        element: <Doc24 />
      },
      {
        path: 'alemonx/reference/plugin-manifest',
        element: <Doc25 />
      },
      {
        path: 'alemonx/use/agent/collaboration',
        element: <Doc26 />
      },
      {
        path: 'alemonx/use/agent/mcp',
        element: <Doc27 />
      },
      {
        path: 'alemonx/use/extensions/plugins-and-webview',
        element: <Doc28 />
      },
      {
        path: 'alemonx/use/operations/access-and-safety',
        element: <Doc29 />
      },
      {
        path: 'alemonx/use/operations/ai-operations',
        element: <Doc30 />
      },
      {
        path: 'alemonx/use/projects/create-or-import',
        element: <Doc31 />
      },
      {
        path: 'alemonx/use/runtime/run-and-monitor',
        element: <Doc32 />
      },
      {
        path: 'apps-x',
        element: <Doc33 />
      },
      {
        path: 'apps',
        element: <Doc34 />
      },
      {
        path: 'environment',
        element: <Doc35 />
      },
      {
        path: 'install',
        element: <Doc36 />
      },
      {
        path: 'open',
        element: <Doc37 />
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
        path: '2026/04/11/schedule-api',
        element: <Blog19 />
      },
      {
        path: '2026/04/01/v2.1.52',
        element: <Blog18 />
      },
      {
        path: '2026/02/28/v2.1.43',
        element: <Blog17 />
      },
      {
        path: '2026/02/26/v2.1.22',
        element: <Blog16 />
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
