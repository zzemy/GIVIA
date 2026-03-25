export type ModelMessageRole = 'system' | 'user' | 'assistant'

export interface ModelMessage {
  role: ModelMessageRole
  content: unknown
}

export interface DashScopeCompletionRequest {
  apiKey: string
  baseUrl: string
  model: string
  messages: ModelMessage[]
  temperature?: number
  maxTokens?: number
  responseFormat?: {
    type: 'json_object'
  }
  networkErrorPrefix: string
  providerErrorPrefix: string
}

export type NormalizedModelCompletionResult =
  | {
      ok: true
      content: string
    }
  | {
      ok: false
      error: string
    }

