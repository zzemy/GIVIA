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

    // 响应式双布局：移动端与桌面端各渲染一份英雄区，JSDOM 下两者都存在
    expect(
      screen.getAllByRole('heading', {
        level: 1,
        name: /在\s*跨越国界\s*之前\s*让心意得体着陆/i,
      }).length,
    ).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /EN Edition/i })).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /定制礼赠纪要/i }).length).toBeGreaterThan(0)
    expect(screen.getAllByText(/礼智极意/i).length).toBeGreaterThan(0)
  })

  it('renders language switch button', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: /EN Edition/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Français' })).not.toBeInTheDocument()
  })
})
