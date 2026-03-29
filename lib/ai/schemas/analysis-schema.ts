export const ANALYSIS_RISK_LEVELS = ['Low', 'Medium', 'High'] as const

export const ANALYSIS_SCHEMA = {
  allowExtra: false,
  fields: {
    country: {
      type: 'string',
      maxLength: 64,
      enum: ['Japan', 'France', 'United Kingdom', 'United States', 'Saudi Arabia'] as const,
    },
    recognition: {
      type: 'object',
      allowExtra: false,
      fields: {
        itemKey: { type: 'string', maxLength: 64 },
        itemZh: { type: 'string', maxLength: 80 },
        itemEn: { type: 'string', maxLength: 80 },
        category: { type: 'string', maxLength: 48 },
        confidence: { type: 'number', min: 0, max: 1 },
      },
    },
    score: {
      type: 'object',
      allowExtra: false,
      fields: {
        phonetic: { type: 'number', min: 0, max: 100, integer: true },
        symbol: { type: 'number', min: 0, max: 100, integer: true },
        color: { type: 'number', min: 0, max: 100, integer: true },
      },
    },
    fitScore: { type: 'number', min: 0, max: 100, integer: true },
    riskLevel: {
      type: 'string',
      enum: ANALYSIS_RISK_LEVELS,
      maxLength: 16,
    },
    isTaboo: { type: 'boolean' },
    warning: { type: 'string', maxLength: 2500 },
    rescueItem: { type: 'string', maxLength: 800 },
    rescueReason: { type: 'string', maxLength: 2500 },
    semanticSignals: {
      type: 'array',
      maxItems: 8,
      item: { type: 'string', maxLength: 80 },
    },
    packaging: {
      type: 'object',
      allowExtra: false,
      fields: {
        style: { type: 'string', maxLength: 800 },
        colors: { type: 'string', maxLength: 800 },
        materials: { type: 'string', maxLength: 800 },
        avoid: { type: 'string', maxLength: 800 },
      },
    },
    card: {
      type: 'object',
      allowExtra: false,
      fields: {
        tone: { type: 'string', maxLength: 800 },
        opener: { type: 'string', maxLength: 800 },
        body: { type: 'string', maxLength: 2500 },
        closing: { type: 'string', maxLength: 800 },
      },
    },
  },
} as const

export const RISK_ENHANCEMENT_SCHEMA = {
  allowExtra: false,
  fields: {
    semanticExplanation: { type: 'string', maxLength: 2500 },
    personalizedMitigation: { type: 'string', maxLength: 2500 },
    alternativeFraming: { type: 'string', maxLength: 2500 },
    culturalContext: { type: 'string', maxLength: 2500 },
    confidence: { type: 'number', min: 0, max: 1 },
  },
} as const
