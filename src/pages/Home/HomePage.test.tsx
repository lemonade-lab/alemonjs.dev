import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import HomePage from './HomePage'

describe('HomePage', () => {
  it('lets visitors manually browse ecosystem products', async () => {
    const user = userEvent.setup()

    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    )

    expect(screen.getByText('AlemonJS')).toBeTruthy()
    expect(
      screen
        .getByRole('tab', { name: '查看 AlemonJS' })
        .getAttribute('aria-selected')
    ).toBe('true')

    await user.click(screen.getByRole('button', { name: '查看下一个生态产品' }))

    expect(screen.getByText('ALemonJS TestOne')).toBeTruthy()
    expect(
      screen
        .getByRole('tab', { name: '查看 ALemonJS TestOne' })
        .getAttribute('aria-selected')
    ).toBe('true')
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
