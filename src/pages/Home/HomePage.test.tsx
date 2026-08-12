import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('lets visitors select ecosystem products from the fixed dot navigation', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )

    expect(screen.getByText('ALemonJS')).toBeTruthy()
    expect(
      screen
        .getByRole('tab', { name: '查看 ALemonJS' })
        .getAttribute('aria-selected')
    ).toBe('true')

    await user.click(screen.getByRole('tab', { name: '查看 ALemonJS TestOne' }))

    expect(screen.getByText('ALemonJS TestOne')).toBeTruthy()
    expect(
      screen
        .getByRole('tab', { name: '查看 ALemonJS TestOne' })
        .getAttribute('aria-selected')
    ).toBe('true')
  })

  it('includes the mobile product in the ecosystem carousel', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )

    expect(screen.getByRole('tab', { name: '查看 ALemonApp' })).toBeTruthy()
  })

  it('uses the direct APK download for ALemonApp', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )

    await user.click(screen.getByRole('tab', { name: '查看 ALemonApp' }))

    expect(
      screen.getByRole('link', { name: /下载移动端/ }).getAttribute('href')
    ).toBe('https://download.alemonjs.com/application/alemonapp/app.apk')
  })

  it('supports keyboard navigation for the image carousel', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )

    await user.click(screen.getByLabelText(/ALemonX 生态产品/))
    await user.keyboard('{ArrowRight}')

    expect(screen.getByText('ALemonJS TestOne')).toBeTruthy()
  })
})
