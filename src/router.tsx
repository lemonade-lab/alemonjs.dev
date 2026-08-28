import { type ComponentType } from 'react'
import {
  createBrowserRouter,
  Navigate,
  redirect,
  type RouteObject
} from 'react-router-dom'
import DocsLayout from '@/layouts/DocsLayout'
import BlogLayout from '@/layouts/BlogLayout'
import NotFound from '@/pages/NotFound'
import RouteError from '@/pages/RouteError'
import rawRouteManifest from '@/config/route-manifest.json'

import Home from '@/pages/Home/App'
import BlogList from '@/pages/BlogList'

// Vite 在构建期将匹配到的 Markdown/MDX 文件编译成模块索引。
const docModules = import.meta.glob('../docs/**/*.{md,mdx}')
const blogModules = import.meta.glob('../blog/**/*.{md,mdx}')

interface RouteEntry {
  id: string
  type: 'doc' | 'blog'
  path: string
  filePath: string
  title?: string
  description?: string
  date?: string
  version?: string
  locale?: string
  updatedAt?: string
  redirectTo?: string
  metadata: Record<string, unknown>
}

const routeManifest = rawRouteManifest as RouteEntry[]

function getContentModule(entry: RouteEntry) {
  const modules = entry.type === 'doc' ? docModules : blogModules
  const prefix = entry.type === 'doc' ? '../docs/' : '../blog/'
  const loader = modules[prefix + entry.filePath]

  if (!loader) {
    throw new Error('找不到内容模块: ' + prefix + entry.filePath)
  }

  return loader as () => Promise<{ default: ComponentType }>
}

function createContentRoute(entry: RouteEntry) {
  const routePath = entry.path.replace(/^\/(docs|blog)\//, '')

  if (entry.redirectTo?.startsWith('/')) {
    return {
      path: routePath,
      loader: () => redirect(entry.redirectTo!)
    }
  }

  return {
    path: routePath,
    lazy: async () => ({
      Component: (await getContentModule(entry)()).default
    })
  }
}

export const routes = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/docs',
    element: <DocsLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: (
          <Navigate to="/docs/alemonx/getting-started/quick-start" replace />
        )
      },
      ...routeManifest
        .filter(entry => entry.type === 'doc')
        .map(createContentRoute)
    ]
  },
  {
    path: '/blog',
    element: <BlogLayout />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: <BlogList />
      },
      ...routeManifest
        .filter(entry => entry.type === 'blog')
        .map(createContentRoute)
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
] satisfies RouteObject[]

export function createAppRouter() {
  return createBrowserRouter(routes)
}

export { routeManifest }
