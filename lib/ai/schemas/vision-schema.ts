export const VISION_MODEL_OUTPUT_SCHEMA = {
  allowExtra: false,
  fields: {
    label: { type: 'string', maxLength: 80 },
    description: { type: 'string', maxLength: 240 },
    confidence: { type: 'number', min: 0, max: 1 },
    synonyms: {
      type: 'array',
      maxItems: 3,
      item: { type: 'string', maxLength: 80 },
    },
  },
} as const
