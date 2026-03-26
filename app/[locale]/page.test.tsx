import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from './page'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'zh' }),
  useRouter: () => ({
    push: pushMock,
  }),
}))

jest.mock('framer-motion', () => ({
  motion: new Proxy(
    {},
    {
      get: () =>
        ({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) =>
          React.createElement('div', props, children),
    },
  ),
}))

describe('Localized homepage', () => {
  it('renders the editorial homepage hero and CTA set', () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /不是送出[\s\S]*一件礼物[\s\S]*而是送达[\s\S]*一种分寸/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /进入体验/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /开始礼赠编辑/i })).toBeInTheDocument()
    expect(screen.getByText(/高端品牌感，不应该来自装饰/i)).toBeInTheDocument()
  })

  it('renders language switch button', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Français' })).not.toBeInTheDocument()
  })
})
