import type { CulturalAnalysis } from '@/lib/analysis/cultural-analyzer'
import type { LLMEnhancedRiskResult } from '@/lib/analysis/llm-risk-enhancement'
import { ANALYSIS_SCHEMA, RISK_ENHANCEMENT_SCHEMA } from '@/lib/ai/schemas/analysis-schema'
import { VISION_MODEL_OUTPUT_SCHEMA } from '@/lib/ai/schemas/vision-schema'

type PrimitiveSchema = {
  type: 'string' | 'number' | 'boolean'
  maxLength?: number
  min?: number
  max?: number
  integer?: boolean
  enum?: readonly string[]
}

type ArraySchema = {
  type: 'array'
  maxItems?: number
  item: SchemaNode
}

type ObjectSchema = {
  type?: 'object'
  allowExtra?: boolean
  fields: Record<string, SchemaNode>
}

type SchemaNode = PrimitiveSchema | ArraySchema | ObjectSchema

interface ValidationSuccess<T> {
  ok: true
  value: T
}

interface ValidationFailure {
  ok: false
  errors: string[]
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure

export interface VisionModelOutput {
  label: string
  description: string
  confidence: number
  synonyms: string[]
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isObjectSchema(schema: SchemaNode): schema is ObjectSchema {
  return 'fields' in schema
}

function validateNode(
  value: unknown,
  schema: SchemaNode,
  path: string,
  errors: string[],
): void {
  if ('type' in schema && schema.type === 'string') {
    if (typeof value !== 'string') {
      errors.push(`${path} must be a string`)
      return
    }

    if (schema.maxLength && value.length > schema.maxLength) {
      errors.push(`${path} exceeds max length ${schema.maxLength}`)
    }

    if (schema.enum && !schema.enum.includes(value)) {
      errors.push(`${path} must be one of ${schema.enum.join(', ')}`)
    }

    return
  }

  if ('type' in schema && schema.type === 'number') {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      errors.push(`${path} must be a number`)
      return
    }

    if (schema.integer && !Number.isInteger(value)) {
      errors.push(`${path} must be an integer`)
    }

    if (typeof schema.min === 'number' && value < schema.min) {
      errors.push(`${path} must be >= ${schema.min}`)
    }

    if (typeof schema.max === 'number' && value > schema.max) {
      errors.push(`${path} must be <= ${schema.max}`)
    }

    return
  }

  if ('type' in schema && schema.type === 'boolean') {
    if (typeof value !== 'boolean') {
      errors.push(`${path} must be a boolean`)
    }

    return
  }

  if ('type' in schema && schema.type === 'array') {
    if (!Array.isArray(value)) {
      errors.push(`${path} must be an array`)
      return
    }

    if (schema.maxItems && value.length > schema.maxItems) {
      errors.push(`${path} exceeds max items ${schema.maxItems}`)
    }

    value.forEach((item, index) => {
      validateNode(item, schema.item, `${path}[${index}]`, errors)
    })
    return
  }

  if (!isObjectSchema(schema)) {
    errors.push(`${path} has unsupported schema configuration`)
    return
  }

  if (!isPlainRecord(value)) {
    errors.push(`${path} must be an object`)
    return
  }

  const allowedKeys = Object.keys(schema.fields)

  for (const key of allowedKeys) {
    if (!(key in value)) {
      errors.push(`${path}.${key} is required`)
      continue
    }

    validateNode(value[key], schema.fields[key], `${path}.${key}`, errors)
  }

  if (schema.allowExtra === false) {
    const extraKeys = Object.keys(value).filter(key => !allowedKeys.includes(key))
    if (extraKeys.length > 0) {
      errors.push(`${path} has unexpected keys: ${extraKeys.join(', ')}`)
    }
  }
}

function validateWithSchema<T>(value: unknown, schema: ObjectSchema): ValidationResult<T> {
  const errors: string[] = []
  validateNode(value, schema, 'output', errors)

  if (errors.length > 0) {
    return {
      ok: false,
      errors,
    }
  }

  return {
    ok: true,
    value: value as T,
  }
}

export function validateVisionModelOutput(value: unknown): ValidationResult<VisionModelOutput> {
  return validateWithSchema<VisionModelOutput>(value, VISION_MODEL_OUTPUT_SCHEMA)
}

export function validateAnalysisOutput(value: unknown): ValidationResult<CulturalAnalysis> {
  return validateWithSchema<CulturalAnalysis>(value, ANALYSIS_SCHEMA)
}

export function validateRiskEnhancementOutput(
  value: unknown,
): ValidationResult<LLMEnhancedRiskResult> {
  return validateWithSchema<LLMEnhancedRiskResult>(value, RISK_ENHANCEMENT_SCHEMA)
}
