import type {
  DashScopeCompletionRequest,
  NormalizedModelCompletionResult,
} from '@/lib/ai/adapters/types'

type ProviderErrorPayload = {
  error?: {
    message?: string
    code?: string
  }
}

type DashScopeMessageContent =
  | string
  | Array<{
      type?: string
      text?: string
    }>

type DashScopeResponse = {
  choices?: Array<{
    message?: {
      content?: DashScopeMessageContent
    }
  }>
}

function contentToString(content: DashScopeMessageContent | undefined): string {
  if (typeof content === 'string') {
    return content
  }

  if (!Array.isArray(content)) {
    return ''
  }

  return content
    .map(part => (typeof part?.text === 'string' ? part.text : ''))
    .join('\n')
    .trim()
}

async function readProviderError(response: Response): Promise<string> {
  const raw = await response.text()

  try {
    const parsed = JSON.parse(raw) as ProviderErrorPayload
    const message = parsed.error?.message?.trim()
    const code = parsed.error?.code?.trim()

    if (message && code) {
      return `${code}: ${message}`
    }

    if (message) {
      return message
    }
  } catch {
    if (raw.trim()) {
      return raw.slice(0, 500)
    }
  }

  return `provider request failed with status ${response.status}`
}

export async function requestDashScopeCompletion(
  input: DashScopeCompletionRequest,
): Promise<NormalizedModelCompletionResult> {
  const {
    apiKey,
    baseUrl,
    model,
    messages,
    temperature,
    maxTokens,
    responseFormat,
    networkErrorPrefix,
    providerErrorPrefix,
  } = input

  let response: Response

  try {
    response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        ...(typeof temperature === 'number' ? { temperature } : {}),
        ...(typeof maxTokens === 'number' ? { max_tokens: maxTokens } : {}),
        messages,
        ...(responseFormat ? { response_format: responseFormat } : {}),
      }),
    })
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error && error.message
          ? `${networkErrorPrefix}: ${error.message}`
          : networkErrorPrefix,
    }
  }

  if (!response.ok) {
    const providerError = await readProviderError(response)
    return {
      ok: false,
      error: `${providerErrorPrefix}: ${providerError}`,
    }
  }

  const payload = (await response.json()) as DashScopeResponse
  const content = contentToString(payload.choices?.[0]?.message?.content)

  if (!content.trim()) {
    return {
      ok: false,
      error: 'empty model output',
    }
  }

  return {
    ok: true,
    content,
  }
}

