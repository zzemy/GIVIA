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

describe('Localized homepage', () => {
  it('renders the editorial homepage hero and CTA set', () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /让一份心意[\s\S]*以更得体的方式[\s\S]*进入另一种文化/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /switch to english/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /开始这次礼赠编辑/i })).toBeInTheDocument()
    expect(screen.getAllByText(/礼智极意/i).length).toBeGreaterThan(0)
  })

  it('renders language switch button', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: /switch to english/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Français' })).not.toBeInTheDocument()
  })
})
