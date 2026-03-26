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
  it('renders the bright editorial hero and primary CTA', () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /让心意[\s\S]*跨越山海[\s\S]*毫无阻碍/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /开始体验/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /开启心意之旅/i })).toBeInTheDocument()
    expect(screen.getByText(/为全球关系编辑送礼语言/i)).toBeInTheDocument()
  })

  it('renders language switch buttons', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: 'EN' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Français' })).not.toBeInTheDocument()
  })
})
