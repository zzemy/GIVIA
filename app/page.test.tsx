import React from 'react'
import { act, render, screen } from '@testing-library/react'
import RootPage from './page'

const replaceMock = jest.fn()

jest.useFakeTimers()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: replaceMock,
  }),
}))

describe('Root editorial routing page', () => {
  beforeEach(() => {
    replaceMock.mockClear()
  })

  it('renders the editorial routing hero', () => {
    render(<RootPage />)

    expect(screen.getByRole('heading', { level: 1, name: /before a gesture[\s\S]*crosses a border[\s\S]*it enters another life/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /中文进入/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /enter in english/i })).toBeInTheDocument()
  })

  it('redirects to /zh after the transition delay', () => {
    render(<RootPage />)

    act(() => {
      jest.advanceTimersByTime(1800)
    })

    expect(replaceMock).toHaveBeenCalledWith('/zh')
  })
})
