'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'
import { HomeHeroSection } from '@/components/gifting/home/home-hero-section'
import { WorkflowProgress } from '@/components/gifting/workflow-progress'
import { StepGiftInput } from '@/components/gifting/home/step-gift-input'
import { StepAnalysis } from '@/components/gifting/home/step-analysis'
import { StepCountry } from '@/components/gifting/home/step-country'
import { ResultsSection } from '@/components/gifting/home/results-section'
import {
  WorkflowSupportAssistantPanel,
  WorkflowSupportHistoryPanels,
} from '@/components/gifting/home/workflow-support-panels'
import {
  beautifyDescriptionText,
  parseRecognitionPayload,
  type ParsedRecognitionPayload,
} from '@/components/gifting/home/recognition-helpers'
import {
  normalizeAnalysisResult,
  normalizeAnalysisEnhancements,
  budgetRangeToAmount,
  normalizeEnhancementCountryCode,
  formatCurrencyAmount,
} from '@/components/gifting/home/page-helpers'
import { useHomeDerivedState } from '@/components/gifting/home/use-home-derived-state'
import { getCountryName } from '@/lib/countries'
import { withBasePath } from '@/lib/asset-path'
import { getSceneTemplate } from '@/lib/p0-config'
import {
  loadAnalysisHistory,
  loadFavoriteRecommendationIds,
  saveAnalysisRecord,
  toggleFavoriteRecommendation,
  type StoredAnalysisRecord,
} from '@/lib/p0-storage'
import zhMessages from '@/messages/zh.json'
import enMessages from '@/messages/en.json'
import jaMessages from '@/messages/ja.json'
import frMessages from '@/messages/fr.json'
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


export default function Home() {
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const routeLocale: Locale =
    params?.locale === 'zh' || params?.locale === 'en' || params?.locale === 'ja' || params?.locale === 'fr'
      ? params.locale
      : 'zh'
  const [locale, setLocale] = React.useState<Locale>(routeLocale)
  const apiLanguage: 'zh' | 'en' = locale === 'zh' ? 'zh' : 'en'

  React.useEffect(() => {
    setLocale(routeLocale)
  }, [routeLocale])

  React.useEffect(() => {
    setHistoryRecords(loadAnalysisHistory())
    setFavoriteRecommendationIds(loadFavoriteRecommendationIds())
  }, [])

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
    [locale]
  )

  // Workflow state
  const [recognition, setRecognition] = useState<RecognitionResult | null>(null)
  const [recognitionSource, setRecognitionSource] = useState<RecognitionSource | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
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

  // Loading state
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [error, setError] = useState<string>('')

  // File input
  const fileInputRef = useRef<HTMLInputElement>(null)
  const workflowRef = useRef<HTMLDivElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const [giftName, setGiftName] = useState('')
  const [giftDescription, setGiftDescription] = useState('')
  const [visionDescription, setVisionDescription] = useState('')
  const giftDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const visionDescriptionRef = useRef<HTMLTextAreaElement>(null)
  const [visionLabel, setVisionLabel] = useState('')
  const [recognitionRawLabels, setRecognitionRawLabels] = useState<string[]>([])
  const [showGiftInputsAfterImageRecognition, setShowGiftInputsAfterImageRecognition] = useState(false)
  const [showAdvancedAudienceFields, setShowAdvancedAudienceFields] = useState(false)
  const [activeImpactCard, setActiveImpactCard] = useState(0)
  const [isImpactPaused, setIsImpactPaused] = useState(false)
  const [recognizingElapsedSeconds, setRecognizingElapsedSeconds] = useState(0)
  const [analyzingElapsedSeconds, setAnalyzingElapsedSeconds] = useState(0)

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
    if (!element) {
      return
    }

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
    advancedAudienceFacts,
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
    if (index === activeImpactCard) {
      return
    }

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
    if (isImpactPaused) {
      return
    }

    const timer = window.setInterval(() => {
      setActiveImpactCard(prev => (prev + 1) % impactCards.length)
    }, 4600)

    return () => window.clearInterval(timer)
  }, [impactCards.length, isImpactPaused])

  const handleEnterFlow = () => {
    workflowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }


  // Workflow progress
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
    reader.onload = e => {
      setImagePreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

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

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSceneTemplateChange = (nextScene: string) => {
    const template = getSceneTemplate(nextScene)
    setSceneTemplate(nextScene)

    if (template) {
      setTargetGroup(template.audienceGroup as AudienceGroup)
      if (template.audienceGroup !== 'other') {
        setCustomAudienceGroup('')
      }
      setBudgetRange(template.defaultBudgetRange)
      setFormality(template.defaultFormality)
      setOccasion(template.defaultOccasion)
    }

    setAnalysis(null)
  }

  const handleBeautifyGiftDescription = () => {
    const polished = beautifyDescriptionText(giftDescription, isZh)

    if (!polished || polished === giftDescription.trim()) {
      return
    }

    setGiftDescription(polished)
    setAnalysis(null)
  }

  const handleBeautifyVisionDescription = () => {
    const polished = beautifyDescriptionText(visionDescription, isZh)

    if (polished === visionDescription.trim()) {
      return
    }

    setVisionDescription(polished)
    setAnalysis(null)
  }

  const applyRecognitionPayload = (payload: ParsedRecognitionPayload) => {
    const polishedDescription = beautifyDescriptionText(payload.description, isZh)

    setRecognition(payload.recognition)
    setRecognitionSource(payload.source)
    if (!giftDescription.trim() && polishedDescription) {
      setGiftDescription(polishedDescription)
    }
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
      if (selectedFile) {
        setShowGiftInputsAfterImageRecognition(false)
      }
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
          if (!hasGiftInput) {
            throw imageError
          }
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
    setShowAdvancedAudienceFields(false)
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

  return (
    <div className={`relative min-h-screen overflow-x-hidden bg-[#061225] text-white ${isZh ? 'font-sans-zh' : ''}`}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(34,211,238,0.14),transparent_36%),radial-gradient(circle_at_84%_22%,rgba(45,212,191,0.12),transparent_34%),radial-gradient(circle_at_50%_84%,rgba(14,165,233,0.08),transparent_44%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-size:1320px_auto,980px_auto] [background-position:center_6%,center_94%] [background-repeat:no-repeat,no-repeat]"
        style={{
          backgroundImage: `url('${withBasePath('/brand/world-map.svg')}'),url('${withBasePath('/brand/world-map.svg')}')`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-12 [background-image:repeating-linear-gradient(90deg,rgba(148,163,184,0.11)_0_1px,transparent_1px_58px),repeating-linear-gradient(0deg,rgba(148,163,184,0.08)_0_1px,transparent_1px_52px)]" />

      <main className="relative mx-auto max-w-[1480px] px-5 py-12 xl:px-8">
        <HomeHeroSection
          locale={locale}
          isZh={isZh}
          apiLanguage={apiLanguage}
          t={t}
          onLanguageSwitch={handleLanguageSwitch}
          onEnterFlow={handleEnterFlow}
          impactCards={impactCards}
          activeImpactCard={activeImpactCard}
          onShiftImpactCard={shiftImpactCard}
          onJumpImpactCard={jumpImpactCard}
          getImpactCardOffset={getImpactCardOffset}
          onImpactPauseChange={setIsImpactPaused}
        />

        {/* Workflow progress */}
        <div ref={workflowRef} className="mb-12 rounded-2xl">
          <WorkflowProgress steps={workflowSteps} />
        </div>

        {/* Three-step workflow panels */}
        <div className="mb-8 grid gap-4 sm:gap-6 lg:mb-10 xl:grid-cols-12 xl:items-stretch">
          <div className="grid content-start gap-4 sm:gap-6 xl:col-span-5 xl:auto-rows-max">
          <StepGiftInput
            locale={locale}
            recognition={recognition}
            recognitionSource={recognitionSource}
            imagePreview={imagePreview}
            selectedFile={selectedFile}
            fileInputRef={fileInputRef}
            shouldHideGiftInputs={shouldHideGiftInputs}
            giftName={giftName}
            giftDescription={giftDescription}
            giftDescriptionRef={giftDescriptionRef}
            visionLabel={visionLabel}
            visionDescription={visionDescription}
            visionDescriptionRef={visionDescriptionRef}
            canRecognize={canRecognize}
            isRecognizing={isRecognizing}
            isTextOnlyRecognition={isTextOnlyRecognition}
            recognizingElapsedSeconds={recognizingElapsedSeconds}
            onFileSelect={handleFileSelect}
            onClearSelectedImage={clearSelectedImage}
            onToggleTextEditor={() => setShowGiftInputsAfterImageRecognition(prev => !prev)}
            onGiftNameChange={value => {
              setGiftName(value)
              setAnalysis(null)
            }}
            onGiftDescriptionChange={value => {
              setGiftDescription(value)
              setAnalysis(null)
            }}
            onVisionLabelChange={value => {
              setVisionLabel(value)
              setAnalysis(null)
            }}
            onVisionDescriptionChange={value => {
              setVisionDescription(value)
              setAnalysis(null)
            }}
            onBeautifyGiftDescription={handleBeautifyGiftDescription}
            onBeautifyVisionDescription={handleBeautifyVisionDescription}
            onRecognize={handleRecognize}
            autoResizeTextarea={autoResizeTextarea}
          />

          <StepAnalysis
            locale={locale}
            t={t}
            selectedCountry={selectedCountry}
            recognition={recognition}
            hasGiftInput={hasGiftInput}
            selectedFile={selectedFile}
            selectedAudienceLabel={selectedAudienceLabel}
            activeSceneTemplate={activeSceneTemplate}
            hasEnabledAnalysisEnhancement={hasEnabledAnalysisEnhancement}
            analysisEnhancementSettings={analysisEnhancementSettings}
            enhancementOriginCountry={enhancementOriginCountry}
            enhancementOriginOptions={enhancementOriginOptions}
            canAnalyze={canAnalyze}
            hasAnalysis={Boolean(analysis)}
            isAnalyzing={isAnalyzing}
            analyzingElapsedSeconds={analyzingElapsedSeconds}
            isAudienceReady={isAudienceReady}
            giftName={giftName}
            onEnhancementSettingChange={(key, checked) =>
              setAnalysisEnhancementSettings(current => ({
                ...current,
                [key]: checked,
              }))
            }
            onEnhancementOriginCountryChange={setEnhancementOriginCountry}
            onAnalyze={handleAnalyze}
          />

          <WorkflowSupportHistoryPanels
            locale={locale}
            historyRecords={historyRecords}
            favoriteGiftChecklist={favoriteGiftChecklist}
          />
          </div>

          <div className="grid content-start gap-4 sm:gap-6 xl:col-span-7 xl:auto-rows-max">
          <StepCountry
            locale={locale}
            t={t}
            apiLanguage={apiLanguage}
            selectedCountry={selectedCountry}
            recognition={recognition}
            hasGiftInput={hasGiftInput}
            selectedFile={selectedFile}
            activeSceneTemplate={activeSceneTemplate}
            sceneTemplate={sceneTemplate}
            sceneTemplateOptions={sceneTemplateOptions}
            selectedAudienceLabel={selectedAudienceLabel}
            budgetLabel={budgetLabel}
            formalityLabel={formalityLabel}
            templateHasAudienceOverride={templateHasAudienceOverride}
            templateHasBudgetOverride={templateHasBudgetOverride}
            templateHasFormalityOverride={templateHasFormalityOverride}
            audienceOptions={audienceOptions}
            targetGroup={targetGroup}
            customAudienceGroup={customAudienceGroup}
            occasion={occasion}
            targetProfile={targetProfile}
            profileFieldClassName={profileFieldClassName}
            profileLabelClassName={profileLabelClassName}
            profileControlClassName={profileControlClassName}
            showAdvancedAudienceFields={showAdvancedAudienceFields}
            advancedAudienceFacts={advancedAudienceFacts}
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
            relationshipLabel={relationshipLabel}
            occupationLabel={occupationLabel}
            onSelectedCountryChange={value => {
              setSelectedCountry(value)
              setAnalysis(null)
            }}
            onSceneTemplateChange={handleSceneTemplateChange}
            onTargetGroupChange={value => {
              setTargetGroup(value)
              if (value !== 'other') {
                setCustomAudienceGroup('')
              }
              setAnalysis(null)
            }}
            onCustomAudienceGroupChange={value => {
              setCustomAudienceGroup(value)
              setAnalysis(null)
            }}
            onOccasionChange={value => {
              setOccasion(value)
              setAnalysis(null)
            }}
            onTargetProfileChange={value => {
              setTargetProfile(value)
              setAnalysis(null)
            }}
            onToggleAdvancedAudienceFields={() => setShowAdvancedAudienceFields(prev => !prev)}
            onAgeBandChange={value => {
              setAgeBand(value)
              setAnalysis(null)
            }}
            onGenderChange={value => {
              setGender(value)
              setAnalysis(null)
            }}
            onOccupationChange={value => {
              setOccupation(value)
              setAnalysis(null)
            }}
            onRelationshipChange={value => {
              setRelationship(value)
              setAnalysis(null)
            }}
            onBudgetRangeChange={value => {
              setBudgetRange(value)
              setAnalysis(null)
            }}
            onFormalityChange={value => {
              setFormality(value)
              setAnalysis(null)
            }}
          />

          <WorkflowSupportAssistantPanel
          locale={locale}
          assistantAmountInput={assistantAmountInput}
          assistantCurrency={assistantCurrency}
          assistantWeightInput={assistantWeightInput}
          assistantDeclaredValueInput={assistantDeclaredValueInput}
          assistantResult={assistantResult}
          assistantError={assistantError}
          isAssistantLoading={isAssistantLoading}
          onAssistantAmountChange={setAssistantAmountInput}
          onAssistantCurrencyChange={setAssistantCurrency}
          onAssistantWeightChange={setAssistantWeightInput}
          onAssistantDeclaredValueChange={setAssistantDeclaredValueInput}
          onRunLogisticsAssistant={handleRunLogisticsAssistant}
        />

          </div>
        </div>

        {/* Loading indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-8 text-center"
            >
              <div className="h-2 w-full max-w-md mx-auto rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full w-1/3 rounded-full bg-gradient-to-r from-cyan-300 via-sky-300 to-cyan-100"
                  animate={{ x: ['-120%', '320%'] }}
                  transition={{ duration: 1.15, ease: 'linear', repeat: Infinity }}
                />
              </div>
              <p className="mt-3 text-sm text-cyan-100/80">
                {isLoadingRecognition
                  ? locale === 'zh'
                    ? `正在识别礼物信息，请稍候...（已等待 ${recognizingElapsedSeconds}s）`
                    : `Recognizing gift information... (${recognizingElapsedSeconds}s)`
                  : locale === 'zh'
                    ? `正在生成文化分析，网络波动时可能稍有延迟...（已等待 ${analyzingElapsedSeconds}s）`
                    : `Generating cultural analysis... (${analyzingElapsedSeconds}s)`}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {isLoadingRecognition
                  ? locale === 'zh'
                    ? recognizingElapsedSeconds >= 12
                      ? '等待时间较长：模型可能返回非结构化内容，系统会自动兜底处理。'
                      : '通常需要 3-12 秒。'
                    : recognizingElapsedSeconds >= 12
                      ? 'Longer wait detected: fallback handling may be triggered for non-structured output.'
                      : 'Typical wait is 3-12 seconds.'
                  : locale === 'zh'
                    ? analyzingElapsedSeconds >= 20
                      ? '等待时间较长：请保持页面不关闭，分析仍在继续。'
                      : '通常需要 20-25 秒。'
                    : analyzingElapsedSeconds >= 20
                      ? 'Longer wait detected: keep this page open while analysis continues.'
                      : 'Typical wait is 20-25 seconds.'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-8 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
            >
              <AlertTriangle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results section */}
        <AnimatePresence>
          {analysis && (
            <ResultsSection
              analysis={analysis}
              analysisEnhancements={analysisEnhancements}
              analysisSource={analysisSource}
              locale={locale}
              t={t}
              selectedCountry={selectedCountry}
              selectedAudienceLabel={selectedAudienceLabel}
              sceneLabel={activeSceneTemplate ? (isZh ? activeSceneTemplate.nameZh : activeSceneTemplate.nameEn) : sceneTemplate}
              visionDescription={visionDescription}
              giftDescription={giftDescription}
              targetProfile={targetProfile}
              hasAnalysisEnhancementResults={hasAnalysisEnhancementResults}
              favoriteRecommendationIds={favoriteRecommendationIds}
              riskReasons={riskReasons}
              mustSendAdvice={mustSendAdvice}
              riskActionMeta={riskActionMeta}
              formatCurrencyAmount={formatCurrencyAmount}
              onReset={handleReset}
              onToggleFavoriteRecommendation={handleToggleFavoriteRecommendation}
            />
          )}
        </AnimatePresence>

      </main>
    </div>
  )
}
