import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import DocsSidebar from './DocsSidebar'
import sidebar from '../config/sidebar.json'
import manifest from '../config/route-manifest.json'

type Item = { path?: string; position?: number; items?: Item[] }
const pages = (items: Item[]): Item[] =>
  items.flatMap(item => (item.items ? pages(item.items) : [item]))

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

describe('documentation navigation', () => {
  it('keeps every published document reachable, including category overview pages', () => {
    const paths = pages(sidebar).map(item => item.path)
    for (const entry of manifest.filter(
      item => item.type === 'doc' && !('redirectTo' in item && item.redirectTo)
    )) {
      expect(paths, entry.path).toContain(entry.path)
    }
    const framework = sidebar.find(
      item => 'id' in item && item.id === 'alemonjsDocs'
    )
    expect(
      framework && 'items' in framework && framework.items?.[0]
    ).toMatchObject({
      path: '/docs/alemonjsDocs/overview',
      position: 0
    })
  })

  it('opens the active branch on a direct visit and still allows manual collapse', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/docs/alemonjsDocs/core/router']}>
        <DocsSidebar />
      </MemoryRouter>
    )
    const link = await screen.findByRole('link', { name: '路由匹配' })
    expect(link.getAttribute('data-active')).toBe('true')
    await user.click(screen.getByRole('button', { name: '消息处理' }))
    await waitFor(() =>
      expect(screen.queryByRole('link', { name: '路由匹配' })).toBeNull()
    )
  })
})
