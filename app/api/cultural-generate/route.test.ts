/** @jest-environment node */

import { POST } from './route'

const originalEnv = process.env

describe('cultural-generate route adapter integration', () => {
  beforeEach(() => {
    jest.resetModules()
    jest.restoreAllMocks()
    process.env = { ...originalEnv }
    process.env.ALIYUN_DASHSCOPE_API_KEY = 'test-key'
    process.env.ALIYUN_DASHSCOPE_TEXT_MODEL = 'qwen-plus-latest'
    process.env.ALIYUN_DASHSCOPE_BASE_URL = 'https://dashscope.aliyuncs.com/compatible-mode/v1'
  })

  afterAll(() => {
    process.env = originalEnv
  })

  it('returns normalized network error from adapter', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('socket hang up'))

    const request = new Request('http://localhost/api/cultural-generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        country: 'Japan',
        language: 'zh',
        recognition: {
          itemKey: 'gift',
          itemZh: '礼物',
          itemEn: 'Gift',
          category: 'General',
          confidence: 0.9,
        },
      }),
    })

    const response = await POST(request)
    const body = (await response.json()) as { error?: string }

    expect(response.status).toBe(502)
    expect(body.error).toBe('aliyun generation network error: socket hang up')
  })
})
