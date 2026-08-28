import { renderToString } from 'react-dom/server'
import {
  createStaticHandler,
  createStaticRouter,
  StaticRouterProvider
} from 'react-router-dom'
import AppProviders from '@/AppProviders'
import { routes } from '@/router'

const staticHandler = createStaticHandler(routes)

export async function renderPath(pathname: string) {
  const url = `https://alemonjs.dev${pathname}`
  const context = await staticHandler.query(new Request(url))

  if (context instanceof Response) {
    return {
      html: '',
      status: context.status,
      redirect: context.headers.get('Location')
    }
  }

  const router = createStaticRouter(staticHandler.dataRoutes, context)
  const html = renderToString(
    <AppProviders>
      <StaticRouterProvider router={router} context={context} hydrate={false} />
    </AppProviders>
  )

  return { html, status: context.statusCode || 200 }
}
