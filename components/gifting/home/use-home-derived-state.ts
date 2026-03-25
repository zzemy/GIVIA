import { useMemo } from 'react'
import { getImpactCards } from '@/components/gifting/home/impact-cards'
import {
  buildMustSendAdvice,
  buildRiskReasons,
  getRiskActionMeta,
} from '@/components/gifting/home/page-helpers'
import type {
  AnalysisResult,
  AudienceGroup,
  EnhancedAnalysisState,
  EnhancementSettings,
  Locale,
} from '@/components/gifting/home/types'
import { type StoredAnalysisRecord } from '@/lib/p0-storage'
import {
  AGE_BAND_OPTIONS,
  BUDGET_RANGE_OPTIONS,
  FORMALITY_OPTIONS,
  GENDER_OPTIONS,
  OCCUPATION_OPTIONS,
  RELATIONSHIP_OPTIONS,
  SCENE_TEMPLATES,
  getSceneTemplate,
} from '@/lib/p0-config'

interface UseHomeDerivedStateParams {
  analysis: AnalysisResult | null
  analysisEnhancements: EnhancedAnalysisState | null
  analysisEnhancementSettings: EnhancementSettings
  locale: Locale
  isZh: boolean
  targetGroup: AudienceGroup
  customAudienceGroup: string
  sceneTemplate: string
  ageBand: string
  occupation: string
  relationship: string
  budgetRange: string
  formality: string
  favoriteRecommendationIds: string[]
  historyRecords: StoredAnalysisRecord[]
}

export function useHomeDerivedState({
  analysis,
  analysisEnhancements,
  analysisEnhancementSettings,
  locale,
  isZh,
  targetGroup,
  customAudienceGroup,
  sceneTemplate,
  ageBand,
  occupation,
  relationship,
  budgetRange,
  formality,
  favoriteRecommendationIds,
  historyRecords,
}: UseHomeDerivedStateParams) {
  const riskReasons = useMemo(() => (analysis ? buildRiskReasons(analysis, locale) : []), [analysis, locale])
  const mustSendAdvice = useMemo(() => (analysis ? buildMustSendAdvice(analysis, locale) : []), [analysis, locale])

  const audienceOptions = useMemo(
    () =>
      isZh
        ? [
            { value: 'peer' as const, label: '同学 / 同事' },
            { value: 'client' as const, label: '客户 / 合作方' },
            { value: 'leader' as const, label: '上级 / 导师' },
            { value: 'family' as const, label: '家人 / 伴侣' },
            { value: 'elder' as const, label: '长辈' },
            { value: 'other' as const, label: '其他（自定义）' },
          ]
        : [
            { value: 'peer' as const, label: 'Peer / Colleague' },
            { value: 'client' as const, label: 'Client / Partner' },
            { value: 'leader' as const, label: 'Leader / Mentor' },
            { value: 'family' as const, label: 'Family / Partner' },
            { value: 'elder' as const, label: 'Elder' },
            { value: 'other' as const, label: 'Other (custom)' },
          ],
    [isZh],
  )

  const selectedAudienceLabel = useMemo(
    () =>
      targetGroup === 'other'
        ? customAudienceGroup.trim() || (isZh ? '其他（待填写）' : 'Other (pending)')
        : audienceOptions.find(option => option.value === targetGroup)?.label ?? targetGroup,
    [audienceOptions, customAudienceGroup, isZh, targetGroup],
  )

  const activeSceneTemplate = useMemo(() => getSceneTemplate(sceneTemplate), [sceneTemplate])
  const sceneTemplateOptions = useMemo(
    () =>
      SCENE_TEMPLATES.map(template => ({
        value: template.code,
        label: isZh ? template.nameZh : template.nameEn,
        hint: isZh ? template.promptZh : template.promptEn,
      })),
    [isZh],
  )
  const ageBandOptions = useMemo(
    () => AGE_BAND_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const genderOptions = useMemo(
    () => GENDER_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const occupationOptions = useMemo(
    () => OCCUPATION_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const relationshipOptions = useMemo(
    () => RELATIONSHIP_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const budgetOptions = useMemo(
    () => BUDGET_RANGE_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )
  const formalityOptions = useMemo(
    () => FORMALITY_OPTIONS.map(option => ({ value: option.value, label: isZh ? option.labelZh : option.labelEn })),
    [isZh],
  )

  const ageBandLabel = ageBandOptions.find(option => option.value === ageBand)?.label ?? ageBand
  const occupationLabel = occupationOptions.find(option => option.value === occupation)?.label ?? occupation
  const relationshipLabel = relationshipOptions.find(option => option.value === relationship)?.label ?? relationship
  const budgetLabel = budgetOptions.find(option => option.value === budgetRange)?.label ?? budgetRange
  const formalityLabel = formalityOptions.find(option => option.value === formality)?.label ?? formality

  const templateAudienceLabel =
    audienceOptions.find(option => option.value === activeSceneTemplate?.audienceGroup)?.label ??
    activeSceneTemplate?.audienceGroup ??
    ''
  const templateBudgetLabel =
    budgetOptions.find(option => option.value === activeSceneTemplate?.defaultBudgetRange)?.label ??
    activeSceneTemplate?.defaultBudgetRange ??
    ''
  const templateFormalityLabel =
    formalityOptions.find(option => option.value === activeSceneTemplate?.defaultFormality)?.label ??
    activeSceneTemplate?.defaultFormality ??
    ''

  const templateHasAudienceOverride = Boolean(activeSceneTemplate && selectedAudienceLabel !== templateAudienceLabel)
  const templateHasBudgetOverride = Boolean(activeSceneTemplate && budgetLabel !== templateBudgetLabel)
  const templateHasFormalityOverride = Boolean(activeSceneTemplate && formalityLabel !== templateFormalityLabel)

  const advancedAudienceFacts = useMemo(
    () =>
      [
        isZh ? `年龄 ${ageBandLabel}` : `Age ${ageBandLabel}`,
        isZh ? `职业 ${occupationLabel}` : `Occupation ${occupationLabel}`,
        isZh ? `关系 ${relationshipLabel}` : `Relationship ${relationshipLabel}`,
        isZh ? `预算 ${budgetLabel}` : `Budget ${budgetLabel}`,
        isZh ? `正式度 ${formalityLabel}` : `Formality ${formalityLabel}`,
      ],
    [ageBandLabel, budgetLabel, formalityLabel, isZh, occupationLabel, relationshipLabel],
  )

  const favoriteGiftChecklist = useMemo(() => {
    const latestById = new Map<string, { id: string; name: string; category: string }>()

    for (const record of historyRecords) {
      for (const item of record.recommendations) {
        if (!latestById.has(item.id)) {
          latestById.set(item.id, item)
        }
      }
    }

    return favoriteRecommendationIds
      .map(id => latestById.get(id))
      .filter((item): item is { id: string; name: string; category: string } => Boolean(item))
  }, [favoriteRecommendationIds, historyRecords])

  const enhancementOriginOptions = useMemo(
    () => [
      { value: 'CN', label: isZh ? '中国大陆发货' : 'Ship from China' },
      { value: 'US', label: isZh ? '美国发货' : 'Ship from United States' },
      { value: 'JP', label: isZh ? '日本发货' : 'Ship from Japan' },
    ],
    [isZh],
  )

  const hasEnabledAnalysisEnhancement = useMemo(
    () => Object.values(analysisEnhancementSettings).some(Boolean),
    [analysisEnhancementSettings],
  )
  const hasAnalysisEnhancementResults = useMemo(
    () =>
      Boolean(
        analysisEnhancements?.p1?.multimodalResults ||
          (analysisEnhancements?.p1?.collaborativeResults?.length ?? 0) > 0 ||
          analysisEnhancements?.p1?.logisticsEstimate ||
          (analysisEnhancements?.p1?.packingRecommendations?.general.length ?? 0) > 0 ||
          (analysisEnhancements?.p2?.wideDeepResults?.length ?? 0) > 0 ||
          (analysisEnhancements?.p2?.culturalImpactScores &&
            Object.keys(analysisEnhancements.p2.culturalImpactScores).length > 0) ||
          analysisEnhancements?.localizedOutput?.formattedRecommendations,
      ),
    [analysisEnhancements],
  )
  const riskActionMeta = useMemo(() => (analysis ? getRiskActionMeta(analysis.riskLevel, locale) : null), [analysis, locale])
  const impactCards = useMemo(() => getImpactCards(isZh), [isZh])

  return {
    riskReasons,
    mustSendAdvice,
    audienceOptions,
    selectedAudienceLabel,
    activeSceneTemplate,
    sceneTemplateOptions,
    ageBandOptions,
    genderOptions,
    occupationOptions,
    relationshipOptions,
    budgetOptions,
    formalityOptions,
    ageBandLabel,
    occupationLabel,
    relationshipLabel,
    budgetLabel,
    formalityLabel,
    templateAudienceLabel,
    templateBudgetLabel,
    templateFormalityLabel,
    templateHasAudienceOverride,
    templateHasBudgetOverride,
    templateHasFormalityOverride,
    advancedAudienceFacts,
    favoriteGiftChecklist,
    enhancementOriginOptions,
    hasEnabledAnalysisEnhancement,
    hasAnalysisEnhancementResults,
    riskActionMeta,
    impactCards,
  }
}
