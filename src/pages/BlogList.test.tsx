import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import BlogList from './BlogList'
import BlogSidebar from '@/components/BlogSidebar'
import BlogPagination from '@/components/BlogPagination'
import BlogMeta from '@/components/BlogMeta'

beforeAll(() => {
  Element.prototype.scrollIntoView = vi.fn()
})

describe('framework-first blog', () => {
  it('shows framework posts by default and opens workbench posts only from the secondary link', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <BlogList />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: '框架更新' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'V2.1.109' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'X0.2.19' })).toBeNull()
    await user.click(screen.getByRole('link', { name: '工作台文章' }))
    expect(screen.getByRole('link', { name: 'X0.2.19' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: 'V2.1.109' })).toBeNull()
    await user.click(screen.getByRole('link', { name: '返回框架更新' }))
    expect(screen.getByRole('link', { name: 'V2.1.109' })).toBeTruthy()
  })

  it('keeps the sidebar and adjacent articles in the framework when dates overlap', () => {
    render(
      <MemoryRouter initialEntries={['/blog/2026/08/31/v2.1.97']}>
        <BlogSidebar />
        <BlogPagination />
      </MemoryRouter>
    )
    const sidebar = screen.getByRole('navigation', { name: '博客目录' })
    expect(within(sidebar).queryByRole('link', { name: /X0.2.19/ })).toBeNull()
    expect(
      screen.getByRole('link', { name: /下一篇.*V2.1.57/ }).getAttribute('href')
    ).toBe('/blog/2026/04/11/schedule-api')
  })

  it('identifies a directly opened workbench article and does not link to framework neighbors', () => {
    render(
      <MemoryRouter initialEntries={['/blog/2026/08/22/alemonx-push']}>
        <BlogMeta />
        <BlogSidebar />
        <BlogPagination />
      </MemoryRouter>
    )
    expect(screen.getByRole('heading', { name: 'X0.2.19' })).toBeTruthy()
    expect(screen.queryByRole('link', { name: /V2.1.97/ })).toBeNull()
    expect(screen.queryByRole('link', { name: /下一篇/ })).toBeNull()
  })
})
