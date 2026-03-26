import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from './page'

/* eslint-disable @next/next/no-img-element */

const pushMock = jest.fn()

jest.mock('next/navigation', () => ({
  useParams: () => ({ locale: 'zh' }),
  useRouter: () => ({
    push: pushMock,
  }),
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    priority,
    fill,
    ...props
  }: {
    src: string
    alt: string
    priority?: boolean
    fill?: boolean
    [key: string]: unknown
  }) => {
    void priority
    void fill
    return <img src={src} alt={alt} {...props} />
  },
}))

describe('Localized gifting page', () => {
  it('renders the premium advisor hero with primary and secondary actions', () => {
    render(<Home />)

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: /让每一份礼物\s*都能跨文化被理解/i,
      }),
    ).toBeInTheDocument()
    expect(screen.getByAltText(/GIVIA/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /立即进入分析流程/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /查看流程|了解流程|see how it works/i })).toBeInTheDocument()
    expect(screen.getByText(/引导式流程/i)).toBeInTheDocument()
  })

  it('renders language switch buttons', () => {
    render(<Home />)

    expect(screen.getByRole('button', { name: '中文' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'English' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '日本語' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Français' })).not.toBeInTheDocument()
  })

  it('renders global country selector', () => {
    render(<Home />)

    expect(screen.getByText(/第二步：选择目标国家/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /选择目标国家/i })).toBeInTheDocument()
  })



  it('renders the guided concierge workflow in the intended order', () => {
    render(<Home />)

    const giftStep = screen.getByRole('heading', {
      level: 2,
      name: /第一步：上传图片或输入礼物|step 1: upload image or type the gift/i,
    })
    const countryStep = screen.getByRole('heading', {
      level: 2,
      name: /第二步：选择目标国家|step 2: select target country/i,
    })
    const analysisStep = screen.getByRole('heading', {
      level: 2,
      name: /第三步：获取文化分析|第三步：AI 文化分析|step 3: get cultural analysis|step 3: ai cultural analysis/i,
    })

    expect(giftStep.compareDocumentPosition(countryStep) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(countryStep.compareDocumentPosition(analysisStep) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
  })
  it('renders enhanced analysis module controls', () => {
    render(<Home />)

    expect(screen.getByText(/高级判断补充项/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /展开高级设置/i })).toBeInTheDocument()
  })
})
