'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import {
  beautifyDescriptionText,
  parseRecognitionPayload,
  type ParsedRecognitionPayload,
} from '@/components/gifting/home/utils/recognition-helpers'
import {
  budgetRangeToAmount,
  formatCurrencyAmount,
  normalizeAnalysisEnhancements,
  normalizeAnalysisResult,
  normalizeEnhancementCountryCode,
} from '@/components/gifting/home/utils/home-page-helpers'
import { useHomeDerivedState } from '@/components/gifting/home/hooks/use-home-derived-state'
import type {
  AnalysisResult,
  AssistantCurrency,
  AudienceGroup,
  EnhancedAnalysisState,
  EnhancementSettings,
  Locale,
  LogisticsAssistantResult,
  RecognitionResult,
  RecognitionSource,
} from '@/components/gifting/home/types'
import { getCountryName } from '@/lib/countries'
import { withBasePath } from '@/lib/asset-path'
import { getSceneTemplate } from '@/lib/config/gifting-config'
import {
  loadAnalysisHistory,
  loadFavoriteRecommendationIds,
  saveAnalysisRecord,
  toggleFavoriteRecommendation,
  type StoredAnalysisRecord,
} from '@/lib/storage/analysis-storage'
import zhMessages from '@/messages/zh.json'
import enMessages from '@/messages/en.json'
import jaMessages from '@/messages/ja.json'
import frMessages from '@/messages/fr.json'

export function useHomePageController(routeLocale: Locale) {
  const router = useRouter()
  const [locale, setLocale] = React.useState<Locale>(routeLocale)
  const apiLanguage: 'zh' | 'en' = locale === 'zh' ? 'zh' : 'en'

  React.useEffect(() => {
    setLocale(routeLocale)
  }, [routeLocale])

  const t = React.useCallback(
    (path: string): string => {
      const source =
        locale === 'zh'
          ? zhMessages
          : locale === 'ja'
            ? jaMessages
            : locale === 'fr'
              ? frMessages
              : enMessages
      const value = path.split('.').reduce<unknown>((acc, key) => {
        if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
          return (acc as Record<string, unknown>)[key]
        }
        return path
      }, source as unknown)

      return typeof value === 'string' ? value : path
    },
    [locale],
  )

  const [recognition, setRecognition] = useState<RecognitionResult | null>(null)
  const [recognitionSource, setRecognitionSource] = useState<RecognitionSource | null>(null)
  const [selectedCountry, setSelectedCountry] = useState('')
  const [targetGroup, setTargetGroup] = useState<AudienceGroup>('peer')
  const [customAudienceGroup, setCustomAudienceGroup] = useState('')
  const [sceneTemplate, setSceneTemplate] = useState('birthday')
  const [ageBand, setAgeBand] = useState('adult')
  const [gender, setGender] = useState('neutral')
  const [occupation, setOccupation] = useState('office')
  const [relationship, setRelationship] = useState('friend')
  const [budgetRange, setBudgetRange] = useState('medium')
  const [formality, setFormality] = useState('semi-formal')
  const [occasion, setOccasion] = useState('')
  const [targetProfile, setTargetProfile] = useState('')
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [analysisEnhancements, setAnalysisEnhancements] = useState<EnhancedAnalysisState | null>(null)
  const [analysisSource, setAnalysisSource] = useState('')
  const [historyRecords, setHistoryRecords] = useState<StoredAnalysisRecord[]>([])
  const [favoriteRecommendationIds, setFavoriteRecommendationIds] = useState<string[]>([])
  const [assistantCurrency, setAssistantCurrency] = useState<AssistantCurrency>('USD')
  const [assistantAmountInput, setAssistantAmountInput] = useState('120')
  const [assistantWeightInput, setAssistantWeightInput] = useState('1')
  const [assistantDeclaredValueInput, setAssistantDeclaredValueInput] = useState('120')
  const [assistantResult, setAssistantResult] = useState<LogisticsAssistantResult | null>(null)
  const [assistantError, setAssistantError] = useState('')
  const [isAssistantLoading, setIsAssistantLoading] = useState(false)
  const [analysisEnhancementSettings, setAnalysisEnhancementSettings] = useState<EnhancementSettings>({
    multimodal: true,
    collaborativeFiltering: true,
    logistics: true,
    wideDeep: true,
    knowledgeGraph: true,
  })
  const [enhancementOriginCountry, setEnhancementOriginCountry] = useState('CN')
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const workflowRef = useRef<HTMLDivElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState('')
  const [giftName, setGiftName] = useState('')
  const [giftDescription, setGiftDescription] = useState('')
  const [visionDescription, setVisionDescription] = useState('')
  const giftDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const visionDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const [visionLabel, setVisionLabel] = useState('')
  const [recognitionRawLabels, setRecognitionRawLabels] = useState<string[]>([])
  const [showGiftInputsAfterImageRecognition, setShowGiftInputsAfterImageRecognition] = useState(false)
  const [activeImpactCard, setActiveImpactCard] = useState(0)
  const [isImpactPaused, setIsImpactPaused] = useState(false)
  const [recognizingElapsedSeconds, setRecognizingElapsedSeconds] = useState(0)
  const [analyzingElapsedSeconds, setAnalyzingElapsedSeconds] = useState(0)

  React.useEffect(() => {
    setHistoryRecords(loadAnalysisHistory())
    setFavoriteRecommendationIds(loadFavoriteRecommendationIds())
  }, [])

  const isLoading = isRecognizing || isAnalyzing
  const isLoadingRecognition = isRecognizing
  const isZh = locale === 'zh'
  const hasGiftInput = Boolean(giftName.trim() || giftDescription.trim())
  const canRecognize = Boolean(selectedFile || hasGiftInput)
  const isAudienceReady = targetGroup !== 'other' || customAudienceGroup.trim().length > 0
  const canAnalyze = Boolean(selectedCountry && (recognition || hasGiftInput || selectedFile) && isAudienceReady)
  const isTextOnlyRecognition = Boolean(hasGiftInput && !selectedFile)
  const shouldHideGiftInputs = Boolean(selectedFile && recognition && !showGiftInputsAfterImageRecognition)

  const autoResizeTextarea = (element: HTMLTextAreaElement | null) => {
    if (!element) return
    element.style.height = 'auto'
    element.style.height = `${Math.max(element.scrollHeight, 72)}px`
  }

  React.useEffect(() => {
    if (!isRecognizing) {
      setRecognizingElapsedSeconds(0)
      return
    }
    const startTime = Date.now()
    const timer = window.setInterval(() => {
      setRecognizingElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isRecognizing])

  React.useEffect(() => {
    if (!isAnalyzing) {
      setAnalyzingElapsedSeconds(0)
      return
    }
    const startTime = Date.now()
    const timer = window.setInterval(() => {
      setAnalyzingElapsedSeconds(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isAnalyzing])

  React.useEffect(() => {
    autoResizeTextarea(giftDescriptionRef.current)
  }, [giftDescription, shouldHideGiftInputs])

  React.useEffect(() => {
    autoResizeTextarea(visionDescriptionRef.current)
  }, [visionDescription, recognition])

  const {
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
    occupationLabel,
    relationshipLabel,
    budgetLabel,
    formalityLabel,
    templateHasAudienceOverride,
    templateHasBudgetOverride,
    templateHasFormalityOverride,
    favoriteGiftChecklist,
    enhancementOriginOptions,
    hasEnabledAnalysisEnhancement,
    hasAnalysisEnhancementResults,
    riskActionMeta,
    impactCards,
  } = useHomeDerivedState({
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
  })

  const profileFieldClassName =
    'rounded-2xl border border-cyan-200/14 bg-[#10253f]/62 p-4 shadow-[inset_0_1px_0_rgba(148,163,184,0.05)]'
  const profileLabelClassName = 'text-[11px] uppercase tracking-[0.14em] text-slate-400'
  const profileControlClassName =
    'mt-3 w-full rounded-xl border border-cyan-200/18 bg-[#0b1c31] px-3 py-3 text-sm text-slate-100 transition focus:border-cyan-200/45 focus:outline-none'

  const shiftImpactCard = (delta: 1 | -1) => {
    setActiveImpactCard(prev => (prev + delta + impactCards.length) % impactCards.length)
  }

  const jumpImpactCard = (index: number) => {
    if (index === activeImpactCard) return
    setActiveImpactCard(index)
  }

  const getImpactCardOffset = (index: number) => {
    const total = impactCards.length
    const half = Math.floor(total / 2)
    return ((index - activeImpactCard + total + half) % total) - half
  }

  React.useEffect(() => {
    setActiveImpactCard(0)
  }, [locale])

  React.useEffect(() => {
    if (isImpactPaused) return
    const timer = window.setInterval(() => {
      setActiveImpactCard(prev => (prev + 1) % impactCards.length)
    }, 4600)
    return () => window.clearInterval(timer)
  }, [impactCards.length, isImpactPaused])

  const handleEnterFlow = () => {
    workflowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const workflowSteps = [
    {
      id: 1,
      label: t('workflow.steps.recognize'),
      icon: <Image src={withBasePath('/brand/step-vision.svg')} alt="vision" width={22} height={22} />,
      status: (recognition || hasGiftInput ? 'completed' : 'current') as 'completed' | 'current' | 'pending',
    },
    {
      id: 2,
      label: t('workflow.steps.country'),
      icon: <Image src={withBasePath('/brand/step-country.svg')} alt="country" width={22} height={22} />,
      status: (selectedCountry ? 'completed' : recognition || hasGiftInput ? 'current' : 'pending') as
        | 'completed'
        | 'current'
        | 'pending',
    },
    {
      id: 3,
      label: t('workflow.steps.analyze'),
      icon: <Image src={withBasePath('/brand/step-analysis.svg')} alt="analysis" width={22} height={22} />,
      status: (analysis ? 'completed' : selectedCountry ? 'current' : 'pending') as 'completed' | 'current' | 'pending',
    },
  ]

  const clearSelectedImage = () => {
    setSelectedFile(null)
    setImagePreview('')
    setRecognition(null)
    setRecognitionSource(null)
    setVisionDescription('')
    setVisionLabel('')
    setRecognitionRawLabels([])
    setShowGiftInputsAfterImageRecognition(false)
    setAnalysis(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setRecognition(null)
    setRecognitionSource(null)
    setVisionDescription('')
    setVisionLabel('')
    setRecognitionRawLabels([])
    setShowGiftInputsAfterImageRecognition(false)
    setAnalysis(null)
    const reader = new FileReader()
    reader.onload = e => setImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleSceneTemplateChange = (nextScene: string) => {
    const template = getSceneTemplate(nextScene)
    setSceneTemplate(nextScene)
    if (template) {
      setTargetGroup(template.audienceGroup as AudienceGroup)
      if (template.audienceGroup !== 'other') setCustomAudienceGroup('')
      setBudgetRange(template.defaultBudgetRange)
      setFormality(template.defaultFormality)
      setOccasion(template.defaultOccasion)
    }
    setAnalysis(null)
  }

  const handleBeautifyGiftDescription = () => {
    const polished = beautifyDescriptionText(giftDescription, isZh)
    if (!polished || polished === giftDescription.trim()) return
    setGiftDescription(polished)
    setAnalysis(null)
  }

  const handleBeautifyVisionDescription = () => {
    const polished = beautifyDescriptionText(visionDescription, isZh)
    if (polished === visionDescription.trim()) return
    setVisionDescription(polished)
    setAnalysis(null)
  }

  const applyRecognitionPayload = (payload: ParsedRecognitionPayload) => {
    const polishedDescription = beautifyDescriptionText(payload.description, isZh)
    setRecognition(payload.recognition)
    setRecognitionSource(payload.source)
    if (!giftDescription.trim() && polishedDescription) setGiftDescription(polishedDescription)
    setVisionDescription(polishedDescription)
    setVisionLabel(payload.detectedLabel)
    setRecognitionRawLabels(payload.rawLabels)
    if (!giftName.trim()) {
      setGiftName(isZh ? payload.recognition.itemZh : payload.recognition.itemEn)
    }
  }

  const recognizeByText = async (): Promise<ParsedRecognitionPayload> => {
    const text = [giftName.trim(), giftDescription.trim()].filter(Boolean).join(' ').trim()
    const response = await fetch('/api/vision-recognize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        name: giftName.trim(),
        description: giftDescription.trim(),
        language: apiLanguage,
      }),
    })
    return parseRecognitionPayload(response, isZh)
  }

  const recognizeByImage = async (): Promise<ParsedRecognitionPayload> => {
    if (!selectedFile) {
      throw new Error(isZh ? '请先上传礼物图片' : 'Please upload a gift image first')
    }
    const formData = new FormData()
    formData.append('image', selectedFile)
    formData.append('language', apiLanguage)
    const response = await fetch('/api/vision-recognize', {
      method: 'POST',
      body: formData,
    })
    return parseRecognitionPayload(response, isZh)
  }

  const handleRecognize = async () => {
    if (!selectedFile && !hasGiftInput) {
      setError(isZh ? '请上传图片或输入礼物名称后再识别' : 'Upload an image or enter gift info first')
      return
    }
    setIsRecognizing(true)
    setError('')
    try {
      const payload = selectedFile ? await recognizeByImage() : await recognizeByText()
      applyRecognitionPayload(payload)
      if (selectedFile) setShowGiftInputsAfterImageRecognition(false)
      setAnalysis(null)
    } catch (err) {
      setError((err as Error).message || t('errors.recognitionFailed'))
    } finally {
      setIsRecognizing(false)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedCountry) {
      setError(isZh ? '请先选择目标国家' : 'Please select a target country first')
      return
    }
    if (!recognition && !hasGiftInput && !selectedFile) {
      setError(isZh ? '请先上传图片或输入礼物信息' : 'Upload an image or enter gift info first')
      return
    }

    setIsAnalyzing(true)
    setError('')
    setAnalysisEnhancements(null)

    try {
      let recognitionForAnalysis = recognition
      let recognitionDescription = visionDescription
      let detectedLabel = visionLabel
      let rawLabels = recognitionRawLabels
      let source = recognitionSource

      if (!recognitionForAnalysis && selectedFile) {
        try {
          const imageRecognition = await recognizeByImage()
          applyRecognitionPayload(imageRecognition)
          recognitionForAnalysis = imageRecognition.recognition
          recognitionDescription = imageRecognition.description
          detectedLabel = imageRecognition.detectedLabel
          rawLabels = imageRecognition.rawLabels
          source = imageRecognition.source
        } catch (imageError) {
          if (!hasGiftInput) throw imageError
        }
      }

      if (!recognitionForAnalysis && hasGiftInput) {
        const textRecognition = await recognizeByText()
        applyRecognitionPayload(textRecognition)
        recognitionForAnalysis = textRecognition.recognition
        recognitionDescription = textRecognition.description
        detectedLabel = textRecognition.detectedLabel
        rawLabels = textRecognition.rawLabels
        source = textRecognition.source
      }

      const polishedGiftDescription = beautifyDescriptionText(giftDescription, isZh)
      const polishedVisionDescription = beautifyDescriptionText(recognitionDescription, isZh)
      const mergedDescription = polishedVisionDescription || polishedGiftDescription

      if (giftDescription.trim() !== polishedGiftDescription && polishedGiftDescription) {
        setGiftDescription(polishedGiftDescription)
      }
      if (visionDescription.trim() !== polishedVisionDescription) {
        setVisionDescription(polishedVisionDescription)
      }

      const response = await fetch('/api/analysis/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          countryCode: normalizeEnhancementCountryCode(selectedCountry),
          recognition: recognitionForAnalysis,
          giftContext: {
            name: giftName.trim(),
            description: mergedDescription,
            visionDescription: polishedVisionDescription,
            visionLabel: detectedLabel,
            source,
            rawLabels,
          },
          country: getCountryName(selectedCountry, 'en'),
          audience: {
            group: targetGroup === 'other' ? customAudienceGroup.trim() || 'other' : targetGroup,
            customGroup: customAudienceGroup.trim(),
            sceneTemplate,
            ageBand,
            gender,
            occupation,
            relationship,
            occasion: occasion.trim(),
            purpose: getSceneTemplate(sceneTemplate)?.defaultPurpose ?? '',
            budgetRange,
            formality,
            notes: targetProfile.trim(),
          },
          locale: apiLanguage,
          enhancements: hasEnabledAnalysisEnhancement
            ? {
                multimodal: analysisEnhancementSettings.multimodal,
                collaborativeFiltering: analysisEnhancementSettings.collaborativeFiltering,
                logistics: analysisEnhancementSettings.logistics,
                wideDeep: analysisEnhancementSettings.wideDeep,
                knowledgeGraph: analysisEnhancementSettings.knowledgeGraph,
                shippingCountry: enhancementOriginCountry,
                budget: budgetRangeToAmount(budgetRange),
              }
            : undefined,
        }),
      })

      const data = await response.json().catch(() => ({ error: t('errors.analysisFailed') }))
      if (!response.ok) {
        throw new Error(typeof data.error === 'string' ? data.error : t('errors.analysisFailed'))
      }
      if (typeof data.source !== 'string' || !data.source.trim()) {
        throw new Error(typeof data.error === 'string' ? data.error : t('errors.analysisFailed'))
      }

      const normalizedAnalysis = normalizeAnalysisResult(data.analysis)
      setAnalysis(normalizedAnalysis)
      setAnalysisEnhancements(normalizeAnalysisEnhancements(data.enhancements))
      setAnalysisSource(typeof data.source === 'string' ? data.source : '')

      const record: StoredAnalysisRecord = {
        id: `${Date.now()}`,
        createdAt: new Date().toISOString(),
        locale,
        countryCode: selectedCountry,
        countryName: getCountryName(selectedCountry, locale),
        giftName: giftName.trim() || normalizedAnalysis.giftProfile.displayName || (locale === 'zh' ? '未命名礼物' : 'Unnamed gift'),
        riskScore: normalizedAnalysis.riskScore,
        riskLevel: normalizedAnalysis.riskLevel,
        audienceLabel: selectedAudienceLabel,
        recommendations: normalizedAnalysis.recommendations.map(item => ({
          id: item.id,
          name: locale === 'zh' ? item.nameZh : item.nameEn,
          category: item.category,
        })),
      }
      saveAnalysisRecord(record)
      setHistoryRecords(loadAnalysisHistory())
    } catch (err) {
      setError((err as Error).message || t('errors.analysisFailed'))
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleReset = () => {
    setRecognition(null)
    setRecognitionSource(null)
    setSelectedCountry('')
    setTargetGroup('peer')
    setCustomAudienceGroup('')
    setSceneTemplate('birthday')
    setAgeBand('adult')
    setGender('neutral')
    setOccupation('office')
    setRelationship('friend')
    setBudgetRange('medium')
    setFormality('semi-formal')
    setOccasion('')
    setTargetProfile('')
    setAnalysis(null)
    setAnalysisEnhancements(null)
    setAnalysisSource('')
    setSelectedFile(null)
    setImagePreview('')
    setGiftName('')
    setGiftDescription('')
    setVisionDescription('')
    setVisionLabel('')
    setRecognitionRawLabels([])
    setShowGiftInputsAfterImageRecognition(false)
    setAssistantResult(null)
    setAssistantError('')
    setError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleLanguageSwitch = (newLocale: Locale) => {
    setLocale(newLocale)
    router.push(`/${newLocale}`)
  }

  const handleToggleFavoriteRecommendation = (id: string) => {
    setFavoriteRecommendationIds(toggleFavoriteRecommendation(id))
  }

  const handleRunLogisticsAssistant = async () => {
    if (!selectedCountry) {
      setAssistantError(isZh ? '请先选择目标国家后再估算物流。' : 'Select a target country before estimating shipping.')
      return
    }
    const amount = Number.parseFloat(assistantAmountInput)
    const weight = Number.parseFloat(assistantWeightInput)
    const declared = Number.parseFloat(assistantDeclaredValueInput)
    if (!Number.isFinite(amount) || amount <= 0) {
      setAssistantError(isZh ? '请输入有效的礼物价格。' : 'Please enter a valid gift price.')
      return
    }

    setIsAssistantLoading(true)
    setAssistantError('')

    try {
      const response = await fetch('/api/logistics-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          fromCurrency: assistantCurrency,
          targetCurrencies: ['USD', 'CNY', 'EUR', 'JPY', 'GBP'],
          destinationCountry: getCountryName(selectedCountry, 'en'),
          weightKg: Number.isFinite(weight) ? weight : 1,
          declaredValue: Number.isFinite(declared) ? declared : amount,
        }),
      })

      const data = (await response.json().catch(() => null)) as LogisticsAssistantResult | { error?: string } | null
      if (!response.ok || !data || !('shippingQuotes' in data)) {
        const fallbackMessage = isZh ? '物流助手请求失败，请稍后重试。' : 'Failed to load logistics assistant data.'
        throw new Error(data && 'error' in data && typeof data.error === 'string' ? data.error : fallbackMessage)
      }
      setAssistantResult(data)
    } catch (assistantRequestError) {
      setAssistantError((assistantRequestError as Error).message)
    } finally {
      setIsAssistantLoading(false)
    }
  }

  const clearAnalysisOnChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => (value: T) => {
    setter(value)
    setAnalysis(null)
  }

  return {
    locale,
    isZh,
    t,
    workflowRef,
    workflowSteps,
    heroProps: {
      locale,
      isZh,
      apiLanguage,
      t,
      onLanguageSwitch: handleLanguageSwitch,
      onEnterFlow: handleEnterFlow,
      impactCards,
      activeImpactCard,
      onShiftImpactCard: shiftImpactCard,
      onJumpImpactCard: jumpImpactCard,
      getImpactCardOffset,
      onImpactPauseChange: setIsImpactPaused,
    },
    workflowPanelsProps: {
      workflowRef,
      workflowSteps,
      giftInputProps: {
        locale,
        recognition,
        recognitionSource,
        imagePreview,
        selectedFile,
        fileInputRef,
        shouldHideGiftInputs,
        giftName,
        giftDescription,
        giftDescriptionRef,
        visionLabel,
        visionDescription,
        visionDescriptionRef,
        canRecognize,
        isRecognizing,
        isTextOnlyRecognition,
        recognizingElapsedSeconds,
        onFileSelect: handleFileSelect,
        onClearSelectedImage: clearSelectedImage,
        onToggleTextEditor: () => setShowGiftInputsAfterImageRecognition(prev => !prev),
        onGiftNameChange: clearAnalysisOnChange(setGiftName),
        onGiftDescriptionChange: clearAnalysisOnChange(setGiftDescription),
        onVisionLabelChange: clearAnalysisOnChange(setVisionLabel),
        onVisionDescriptionChange: clearAnalysisOnChange(setVisionDescription),
        onBeautifyGiftDescription: handleBeautifyGiftDescription,
        onBeautifyVisionDescription: handleBeautifyVisionDescription,
        onRecognize: handleRecognize,
        autoResizeTextarea,
      },
      analysisProps: {
        locale,
        t,
        selectedCountry,
        recognition,
        hasGiftInput,
        selectedFile,
        selectedAudienceLabel,
        activeSceneTemplate,
        hasEnabledAnalysisEnhancement,
        analysisEnhancementSettings,
        enhancementOriginCountry,
        enhancementOriginOptions,
        canAnalyze,
        hasAnalysis: Boolean(analysis),
        isAnalyzing,
        analyzingElapsedSeconds,
        isAudienceReady,
        giftName,
        onEnhancementSettingChange: (key: keyof EnhancementSettings, checked: boolean) =>
          setAnalysisEnhancementSettings(current => ({
            ...current,
            [key]: checked,
          })),
        onEnhancementOriginCountryChange: setEnhancementOriginCountry,
        onAnalyze: handleAnalyze,
      },
      countryProps: {
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
        relationshipLabel,
        occupationLabel,
        onSelectedCountryChange: clearAnalysisOnChange(setSelectedCountry),
        onSceneTemplateChange: handleSceneTemplateChange,
        onTargetGroupChange: (value: AudienceGroup) => {
          setTargetGroup(value)
          if (value !== 'other') setCustomAudienceGroup('')
          setAnalysis(null)
        },
        onCustomAudienceGroupChange: clearAnalysisOnChange(setCustomAudienceGroup),
        onOccasionChange: clearAnalysisOnChange(setOccasion),
        onTargetProfileChange: clearAnalysisOnChange(setTargetProfile),
        onAgeBandChange: clearAnalysisOnChange(setAgeBand),
        onGenderChange: clearAnalysisOnChange(setGender),
        onOccupationChange: clearAnalysisOnChange(setOccupation),
        onRelationshipChange: clearAnalysisOnChange(setRelationship),
        onBudgetRangeChange: clearAnalysisOnChange(setBudgetRange),
        onFormalityChange: clearAnalysisOnChange(setFormality),
      },
      assistantProps: {
        locale,
        assistantAmountInput,
        assistantCurrency,
        assistantWeightInput,
        assistantDeclaredValueInput,
        assistantResult,
        assistantError,
        isAssistantLoading,
        onAssistantAmountChange: setAssistantAmountInput,
        onAssistantCurrencyChange: setAssistantCurrency,
        onAssistantWeightChange: setAssistantWeightInput,
        onAssistantDeclaredValueChange: setAssistantDeclaredValueInput,
        onRunLogisticsAssistant: handleRunLogisticsAssistant,
      },
      historyProps: {
        locale,
        historyRecords,
        favoriteGiftChecklist,
      },
    },
    feedbackProps: {
      isLoading,
      isLoadingRecognition,
      locale,
      recognizingElapsedSeconds,
      analyzingElapsedSeconds,
      error,
    },
    resultsProps: analysis
      ? {
          analysis,
          analysisEnhancements,
          analysisSource,
          locale,
          t,
          selectedCountry,
          selectedAudienceLabel,
          sceneLabel: activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : sceneTemplate,
          visionDescription,
          giftDescription,
          targetProfile,
          hasAnalysisEnhancementResults,
          favoriteRecommendationIds,
          riskReasons,
          mustSendAdvice,
          riskActionMeta,
          formatCurrencyAmount,
          onReset: handleReset,
          onToggleFavoriteRecommendation: handleToggleFavoriteRecommendation,
        }
      : null,
  }
}
