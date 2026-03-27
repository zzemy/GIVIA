import React from 'react'
import { render, screen } from '@testing-library/react'
import RootPage from './page'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

describe('Root editorial routing page', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('renders the editorial routing hero', () => {
    render(<RootPage />)

    expect(screen.getByRole('heading', { level: 1, name: /before a gesture[\s\S]*crosses a border[\s\S]*it enters another life/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue in 中文/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enter in english/i })).toBeInTheDocument()
  })

  it('keeps both language routes available without auto redirecting', () => {
    render(<RootPage />)
    expect(pushMock).not.toHaveBeenCalled()
  })
})
