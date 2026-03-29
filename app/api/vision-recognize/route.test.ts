/** @jest-environment node */

import { POST } from './route'

const originalEnv = process.env

describe('vision-recognize route adapter integration', () => {
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

  it('returns normalized provider error from adapter for text recognition', async () => {
    const fetchMock = jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ error: { code: 'InvalidKey', message: 'bad key' } }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      }),
    )

    const request = new Request('http://localhost/api/vision-recognize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'A luxury pen set for business gifting',
        language: 'en',
      }),
    })

    const response = await POST(request)
    const body = (await response.json()) as { error?: string }

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(response.status).toBe(502)
    expect(body.error).toBe('aliyun text recognition request failed: InvalidKey: bad key')
  })

  it('parses array-form provider content through the adapter', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          choices: [
            {
              message: {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify({
                      label: 'ceramic mug',
                      description: 'A ceramic mug for daily drinks.',
                      confidence: 0.82,
                      synonyms: ['coffee cup'],
                    }),
                  },
                ],
              },
            },
          ],
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    )

    const request = new Request('http://localhost/api/vision-recognize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'a ceramic mug gift',
        language: 'en',
      }),
    })

    const response = await POST(request)
    const body = (await response.json()) as {
      source: string
      detectedLabel: string
      recognition: { itemEn: string; confidence: number }
      rawLabels?: string[]
    }

    expect(response.status).toBe(200)
    expect(body.source).toBe('aliyun-dashscope-text')
    expect(body.detectedLabel).toBe('ceramic mug')
    expect(body.recognition.itemEn).toBe('Ceramic Mug')
    expect(body.recognition.confidence).toBeCloseTo(0.82)
    expect(body.rawLabels).toContain('ceramic mug')
  })
})
