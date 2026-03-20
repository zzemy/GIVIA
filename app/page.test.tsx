import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import RootPage from './page'

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}))

describe('Root redirect page', () => {
  beforeEach(() => {
    pushMock.mockClear()
  })

  it('renders loading state', () => {
    render(<RootPage />)
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument()
  })

  it('redirects to /zh on mount', async () => {
    render(<RootPage />)

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/zh')
    })
  })
})
