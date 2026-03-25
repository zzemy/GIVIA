/**
 * P2: B2B API Capabilities
 * REST/GraphQL endpoints for enterprise gift recommendation service
 * 
 * Features:
 * - Bulk recommendation API
 * - Webhook integration for business events
 * - Custom branding and white-labeling
 * - Usage analytics and reporting
 * - Rate limiting and API key management
 */

import type { P0Locale, RecommendationItem } from '@/lib/p0-types'

export type ApiAuthType = 'api-key' | 'oauth2' | 'jwt'

export interface ApiKey {
  keyId: string
  secretKey: string
  created: number
  expires: number
  rateLimit: number // requests per minute
  allowedEndpoints: string[]
  status: 'active' | 'revoked' | 'expired'
}

export interface B2BClient {
  clientId: string
  clientName: string
  industry: string
  country: string
  apiKey: ApiKey
  webhookUrl?: string
  customBrandConfig?: {
    logoUrl?: string
    primaryColor?: string
    companySiteName?: string
  }
}

export interface BulkRecommendationRequest {
  clientId: string
  recipientProfiles: Array<{
    id: string
    group: string
    occasion: string
    country: string
    budget?: number
  }>
  options?: {
    topK?: number
    excludeGiftIds?: string[]
    locale?: P0Locale
    includeRiskAnalysis?: boolean
    includeLogistics?: boolean
  }
}

export interface BulkRecommendationResponse {
  requestId: string
  timestamp: number
  results: Array<{
    recipientId: string
    recommendations: RecommendationItem[]
    processingTimeMs: number
  }>
  summary: {
    totalProcessed: number
    successCount: number
    failureCount: number
    averageProcessingTimeMs: number
  }
}

export interface WebhookEvent {
  eventId: string
  eventType: 'recommendation_requested' | 'gift_purchased' | 'recommendation_feedback'
  timestamp: number
  clientId: string
  data: Record<string, unknown>
}

export interface ApiUsageMetrics {
  clientId: string
  period: { start: number; end: number }
  requestCount: number
  successRate: number
  averageLatencyMs: number
  topEndpoints: Array<{ endpoint: string; count: number }>
  costEstimate: number // Monthly cost in USD
}

export interface WhiteLabel {
  clientId: string
  customDomain?: string
  customLogo?: string
  colorScheme?: {
    primary: string
    secondary: string
    accent: string
  }
  copyFontSize?: Record<'heading' | 'body' | 'small', number>
}

/**
 * Create API key for B2B client
 */
export function generateApiKey(clientId: string, expiresInDays: number = 365): ApiKey {
  const keyId = `sk_${clientId}_${Date.now()}`
  const secretKey = generateSecretKey()

  return {
    keyId,
    secretKey,
    created: Date.now(),
    expires: Date.now() + expiresInDays * 24 * 60 * 60 * 1000,
    rateLimit: 1000, // Default: 1000 requests/min
    allowedEndpoints: ['/api/b2b/bulk-recommend', '/api/b2b/analytics'],
    status: 'active',
  }
}

/**
 * Generate secure random secret key
 */
function generateSecretKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Validate API key (in production, check against database)
 */
export function validateApiKey(keyId: string, secretKey: string): { valid: boolean; error?: string } {
  // In production: verify against database
  if (!keyId || !secretKey) {
    return { valid: false, error: 'Missing API credentials' }
  }

  if (keyId.length < 10 || secretKey.length < 32) {
    return { valid: false, error: 'Invalid key format' }
  }

  return { valid: true }
}

/**
 * Check rate limit for API client
 */
export function checkRateLimit(
  clientId: string,
  keyId: string,
  requestsInWindow: number,
  limitPerMinute: number = 1000,
): { allowed: boolean; remaining: number; resetAt: number } {
  const allowed = requestsInWindow < limitPerMinute
  const remaining = Math.max(0, limitPerMinute - requestsInWindow - 1)
  const resetAt = Date.now() + 60 * 1000 // Reset in 1 minute

  return { allowed, remaining, resetAt }
}

/**
 * Process bulk recommendation request
 */
export function processBulkRecommendation(
  request: BulkRecommendationRequest,
  _mockGetRecommendations?: (
    profile: BulkRecommendationRequest['recipientProfiles'][0],
  ) => RecommendationItem[],
): BulkRecommendationResponse {
  const results: BulkRecommendationResponse['results'] = []

  let successCount = 0
  let failureCount = 0
  const processingTimes: number[] = []

  for (const profile of request.recipientProfiles) {
    const profileStartTime = Date.now()

    try {
      // Mock: in production, call actual recommendation engine
      const recommendations = _mockGetRecommendations
        ? _mockGetRecommendations(profile)
        : ([
          {
            id: 'mock-gift-1',
            category: 'luxury',
            score: 95,
            reasonEn: 'Top recommendation',
            reasonZh: '최고 추천',
          },
        ] as unknown as RecommendationItem[])

      results.push({
        recipientId: profile.id,
        recommendations: recommendations.slice(0, request.options?.topK || 3),
        processingTimeMs: Date.now() - profileStartTime,
      })

      successCount++
      processingTimes.push(Date.now() - profileStartTime)
    } catch (_error) {
      failureCount++
      results.push({
        recipientId: profile.id,
        recommendations: [],
        processingTimeMs: Date.now() - profileStartTime,
      })
    }
  }

  const averageProcessingTimeMs = processingTimes.length > 0
    ? processingTimes.reduce((a, b) => a + b, 0) / processingTimes.length
    : 0

  return {
    requestId: `bulk_${Date.now()}`,
    timestamp: Date.now(),
    results,
    summary: {
      totalProcessed: request.recipientProfiles.length,
      successCount,
      failureCount,
      averageProcessingTimeMs,
    },
  }
}

/**
 * Queue webhook delivery for async delivery
 */
export function queueWebhookEvent(
  clientId: string,
  event: Omit<WebhookEvent, 'eventId' | 'clientId' | 'timestamp'>,
  webhookUrl: string,
): { queued: boolean; eventId: string } {
  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // In production: queue to message broker (SQS, RabbitMQ, etc.)
  const fullEvent: WebhookEvent = {
    eventId,
    clientId,
    timestamp: Date.now(),
    ...event,
  }

  // Simulate async delivery
  console.log(`[Webhook] Queued for delivery to ${webhookUrl}:`, fullEvent)

  return { queued: true, eventId }
}

/**
 * Calculate API usage metrics for a client
 */
export function calculateUsageMetrics(
  clientId: string,
  startTime: number,
  endTime: number,
  requestLog: Array<{ endpoint: string; success: boolean; latencyMs: number }> = [],
): ApiUsageMetrics {
  const successCount = requestLog.filter(r => r.success).length
  const totalCount = requestLog.length
  const successRate = totalCount > 0 ? successCount / totalCount : 0

  const averageLatencyMs = totalCount > 0 ? requestLog.reduce((sum, r) => sum + r.latencyMs, 0) / totalCount : 0

  // Count by endpoint
  const endpointCounts: Record<string, number> = {}
  for (const req of requestLog) {
    endpointCounts[req.endpoint] = (endpointCounts[req.endpoint] || 0) + 1
  }

  const topEndpoints = Object.entries(endpointCounts)
    .map(([endpoint, count]) => ({ endpoint, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)

  // Pricing: $0.01 per 100 successful requests
  const costEstimate = (successCount / 100) * 0.01

  return {
    clientId,
    period: { start: startTime, end: endTime },
    requestCount: totalCount,
    successRate,
    averageLatencyMs,
    topEndpoints,
    costEstimate,
  }
}

/**
 * Apply white-label configuration
 */
export function applyWhiteLabel(whiteLabel: WhiteLabel): {
  customCss: string
  metadata: Record<string, string>
} {
  const customCss = `
    :root {
      ${whiteLabel.colorScheme ? `
        --color-primary: ${whiteLabel.colorScheme.primary};
        --color-secondary: ${whiteLabel.colorScheme.secondary};
        --color-accent: ${whiteLabel.colorScheme.accent};
      ` : ''}
      ${whiteLabel.copyFontSize ? `
        --font-size-heading: ${whiteLabel.copyFontSize.heading}px;
        --font-size-body: ${whiteLabel.copyFontSize.body}px;
        --font-size-small: ${whiteLabel.copyFontSize.small}px;
      ` : ''}
    }

    ${whiteLabel.customLogo ? `.logo { background-image: url(${whiteLabel.customLogo}); }` : ''}

    ${whiteLabel.customDomain ? `/* Custom domain: ${whiteLabel.customDomain} */` : ''}
  `

  return {
    customCss,
    metadata: {
      clientId: whiteLabel.clientId,
      customDomain: whiteLabel.customDomain || 'default',
      branding: 'applied',
    },
  }
}

/**
 * Generate API documentation
 */
export function generateApiDocumentation(locale: P0Locale = 'en'): string {
  const docs = {
    en: `# B2B Gift Recommendation API

## Overview
RESTful API for bulk gift recommendations, analytics, and white-labeling.

## Authentication
All requests require an API key header:
\`\`\`
Authorization: Bearer <api-key>
\`\`\`

## Endpoints

### 1. Bulk Recommendations
POST /api/b2b/bulk-recommend
- Submit up to 100 recipient profiles
- Get top-K recommendations for each
- Support async processing with webhooks

### 2. Analytics
GET /api/b2b/analytics?period=monthly
- Usage metrics and cost estimates
- Endpoint statistics
- Success rates and latencies

### 3. White-label Configuration
PUT /api/b2b/branding
- Custom domain setup
- Logo and color scheme
- Font sizing

## Rate Limiting
- Default: 1000 requests/minute
- Contact sales for higher limits

## Pricing
- $0.01 per 100 successful recommendations
- Bulk discounts available
- No setup fees
`,
    zh: `# B2B 礼品推荐 API

## 概述
用于批量礼品推荐、分析和白标的 RESTful API。

## 认证
所有请求需要 API 密钥头：
\`\`\`
Authorization: Bearer <api-key>
\`\`\`

## 端点

### 1. 批量推荐
POST /api/b2b/bulk-recommend
- 提交最多 100 个收件人档案
- 获取每个的前 K 项推荐
- 支持通过 Webhook 的异步处理

### 2. 分析
GET /api/b2b/analytics?period=monthly
- 使用情况指标和成本估计
- 端点统计
- 成功率和延迟

### 3. 白标配置
PUT /api/b2b/branding
- 自定义域名设置
- 徽标和配色方案
- 字体大小

## 速率限制
- 默认：1000 个请求/分钟
- 联系销售获得更高限制

## 定价
- 每 100 个成功推荐 0.01 美元
- 可获得批量折扣
- 无设置费
`,
  }

  return docs[locale] || docs.en
}
