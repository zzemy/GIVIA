import RootPage from './page'

const redirectMock = jest.fn()

jest.mock('next/navigation', () => ({
  redirect: (path: string) => redirectMock(path),
}))

describe('Root page', () => {
  beforeEach(() => {
    redirectMock.mockClear()
  })

  it('redirects to the Chinese landing page', () => {
    RootPage()

    expect(redirectMock).toHaveBeenCalledWith('/zh')
  })
})
