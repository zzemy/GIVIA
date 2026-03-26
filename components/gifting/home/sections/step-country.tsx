'use client'

import type { SceneTemplate } from '@/lib/types/gifting-types'
import { CountryStepAudienceCard } from '@/components/gifting/home/cards/country-step-audience-card'
import { CountryStepProfileCard } from '@/components/gifting/home/cards/country-step-profile-card'
import { CountryStepSceneCard } from '@/components/gifting/home/cards/country-step-scene-card'
import { CountryStepSelectionCard } from '@/components/gifting/home/cards/country-step-selection-card'
import { CountryStepSummaryCard } from '@/components/gifting/home/cards/country-step-summary-card'
import { homeSurface } from '@/components/gifting/home/home-design-tokens'
import type {
  AudienceGroup,
  Locale,
  RecognitionResult,
  SceneTemplateOption,
  SelectOption,
} from '@/components/gifting/home/types'

export interface StepCountryProps {
  locale: Locale
  t: (path: string) => string
  apiLanguage: 'zh' | 'en'
  selectedCountry: string
  recognition: RecognitionResult | null
  hasGiftInput: boolean
  selectedFile: File | null
  activeSceneTemplate: SceneTemplate | null
  sceneTemplate: string
  sceneTemplateOptions: SceneTemplateOption[]
  selectedAudienceLabel: string
  budgetLabel: string
  formalityLabel: string
  templateHasAudienceOverride: boolean
  templateHasBudgetOverride: boolean
  templateHasFormalityOverride: boolean
  audienceOptions: SelectOption[]
  targetGroup: AudienceGroup
  customAudienceGroup: string
  occasion: string
  targetProfile: string
  profileFieldClassName: string
  profileLabelClassName: string
  profileControlClassName: string
  ageBand: string
  ageBandOptions: SelectOption[]
  gender: string
  genderOptions: SelectOption[]
  occupation: string
  occupationOptions: SelectOption[]
  relationship: string
  relationshipOptions: SelectOption[]
  budgetRange: string
  budgetOptions: SelectOption[]
  formality: string
  formalityOptions: SelectOption[]
  onSelectedCountryChange: (value: string) => void
  onSceneTemplateChange: (value: string) => void
  onTargetGroupChange: (value: AudienceGroup) => void
  onCustomAudienceGroupChange: (value: string) => void
  onOccasionChange: (value: string) => void
  onTargetProfileChange: (value: string) => void
  onAgeBandChange: (value: string) => void
  onGenderChange: (value: string) => void
  onOccupationChange: (value: string) => void
  onRelationshipChange: (value: string) => void
  onBudgetRangeChange: (value: string) => void
  onFormalityChange: (value: string) => void
}

export function StepCountry({
  locale,
  t,
  apiLanguage,
  selectedCountry,
  recognition,
  hasGiftInput,
  selectedFile,
  activeSceneTemplate,
  sceneTemplate,
  sceneTemplateOptions,
  selectedAudienceLabel,
  budgetLabel,
  formalityLabel,
  templateHasAudienceOverride,
  templateHasBudgetOverride,
  templateHasFormalityOverride,
  audienceOptions,
  targetGroup,
  customAudienceGroup,
  occasion,
  targetProfile,
  profileFieldClassName,
  profileLabelClassName,
  profileControlClassName,
  ageBand,
  ageBandOptions,
  gender,
  genderOptions,
  occupation,
  occupationOptions,
  relationship,
  relationshipOptions,
  budgetRange,
  budgetOptions,
  formality,
  formalityOptions,
  onSelectedCountryChange,
  onSceneTemplateChange,
  onTargetGroupChange,
  onCustomAudienceGroupChange,
  onOccasionChange,
  onTargetProfileChange,
  onAgeBandChange,
  onGenderChange,
  onOccupationChange,
  onRelationshipChange,
  onBudgetRangeChange,
  onFormalityChange,
}: StepCountryProps) {
  const cardBaseClassName =
    `${homeSurface.inset} p-4 shadow-[0_14px_36px_rgba(3,12,28,0.22)] transition-all duration-300 hover:border-white/14 sm:p-6`

  return (
    <div className={`grid gap-4 rounded-[1.75rem] p-4 sm:gap-6 sm:p-5 ${homeSurface.secondary}`}>
      <CountryStepSelectionCard
        locale={locale}
        apiLanguage={apiLanguage}
        selectedCountry={selectedCountry}
        title={t('country.title')}
        description={t('country.description')}
        cardBaseClassName={cardBaseClassName}
        onSelectedCountryChange={onSelectedCountryChange}
      />

      <div className="grid gap-4 xl:grid-cols-2 xl:items-stretch">
        <CountryStepSceneCard
          locale={locale}
          activeSceneTemplate={activeSceneTemplate}
          sceneTemplate={sceneTemplate}
          sceneTemplateOptions={sceneTemplateOptions}
          selectedAudienceLabel={selectedAudienceLabel}
          budgetLabel={budgetLabel}
          formalityLabel={formalityLabel}
          templateHasAudienceOverride={templateHasAudienceOverride}
          templateHasBudgetOverride={templateHasBudgetOverride}
          templateHasFormalityOverride={templateHasFormalityOverride}
          cardBaseClassName={cardBaseClassName}
          onSceneTemplateChange={onSceneTemplateChange}
        />

        <CountryStepAudienceCard
          locale={locale}
          selectedAudienceLabel={selectedAudienceLabel}
          audienceOptions={audienceOptions}
          targetGroup={targetGroup}
          customAudienceGroup={customAudienceGroup}
          occasion={occasion}
          targetProfile={targetProfile}
          profileFieldClassName={profileFieldClassName}
          profileLabelClassName={profileLabelClassName}
          profileControlClassName={profileControlClassName}
          cardBaseClassName={cardBaseClassName}
          onTargetGroupChange={onTargetGroupChange}
          onCustomAudienceGroupChange={onCustomAudienceGroupChange}
          onOccasionChange={onOccasionChange}
          onTargetProfileChange={onTargetProfileChange}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-2 xl:items-stretch">
        <CountryStepProfileCard
          locale={locale}
          ageBand={ageBand}
          ageBandOptions={ageBandOptions}
          gender={gender}
          genderOptions={genderOptions}
          occupation={occupation}
          occupationOptions={occupationOptions}
          relationship={relationship}
          relationshipOptions={relationshipOptions}
          budgetRange={budgetRange}
          budgetOptions={budgetOptions}
          formality={formality}
          formalityOptions={formalityOptions}
          profileFieldClassName={profileFieldClassName}
          profileControlClassName={profileControlClassName}
          cardBaseClassName={cardBaseClassName}
          onAgeBandChange={onAgeBandChange}
          onGenderChange={onGenderChange}
          onOccupationChange={onOccupationChange}
          onRelationshipChange={onRelationshipChange}
          onBudgetRangeChange={onBudgetRangeChange}
          onFormalityChange={onFormalityChange}
        />

        <CountryStepSummaryCard
          locale={locale}
          selectedCountry={selectedCountry}
          activeSceneTemplate={activeSceneTemplate}
          sceneTemplate={sceneTemplate}
          selectedAudienceLabel={selectedAudienceLabel}
          budgetLabel={budgetLabel}
          formalityLabel={formalityLabel}
          ageBand={ageBand}
          ageBandOptions={ageBandOptions}
          occupation={occupation}
          occupationOptions={occupationOptions}
          relationship={relationship}
          relationshipOptions={relationshipOptions}
          budgetRange={budgetRange}
          budgetOptions={budgetOptions}
          formality={formality}
          formalityOptions={formalityOptions}
          occasion={occasion}
          targetProfile={targetProfile}
          recognitionReady={Boolean(recognition || hasGiftInput || selectedFile)}
          needsCustomAudience={targetGroup === 'other' && !customAudienceGroup.trim()}
        />
      </div>
    </div>
  )
}
