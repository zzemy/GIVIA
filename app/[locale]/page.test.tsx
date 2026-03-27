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
        name: /智连全球文化[\s\S]*礼赠每一份心意/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Enter the editorial|开始这次礼赠编辑/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /开始这次礼赠编辑/i })).toBeInTheDocument()
    expect(screen.getByText(/礼智极意/i)).toBeInTheDocument()
  })

  it('renders language switch button', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Français' })).not.toBeInTheDocument()
  })
})
