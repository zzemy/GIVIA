'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, ArrowRight, Check, Sparkles } from 'lucide-react'
import Image from 'next/image'
import { getCountryName } from '@/lib/countries'
import type { AudienceGroup, Locale, SelectOption } from '@/components/gifting/home/types'
import {
  buildCheckpoint,
  buildSummaryParagraphs,
  getInitialSceneIndex,
  getUnlockedSceneIndex,
  relationDefaults,
  stagePhotography,
  type SceneKey,
} from '@/components/gifting/home/sections/step-country-copy'
import { ChoicePills, InlineCountrySelector, inputClassName, PromptSheet } from '@/components/gifting/home/sections/step-country-parts'

export interface StepCountryProps {
  locale: Locale
  selectedCountry: string
  selectedAudienceLabel: string
  budgetLabel: string
  formalityLabel: string
  targetGroup: AudienceGroup
  customAudienceGroup: string
  targetProfile: string
  ageBand: string
  ageBandOptions: SelectOption[]
  occupation: string
  occupationOptions: SelectOption[]
  ageBandLabel: string
  occupationLabel: string
  budgetRange: string
  formality: string
  onSelectedCountryChange: (value: string) => void
  onTargetGroupChange: (value: AudienceGroup) => void
  onCustomAudienceGroupChange: (value: string) => void
  onTargetProfileChange: (value: string) => void
  onAgeBandChange: (value: string) => void
  onOccupationChange: (value: string) => void
  onRelationshipChange: (value: string) => void
  onBudgetRangeChange: (value: string) => void
  onFormalityChange: (value: string) => void
  canContinue: boolean
  onBack: () => void
  onContinue: () => void
  devPreview?: boolean
}

export function StepCountry({
  locale,
  selectedCountry,
  selectedAudienceLabel,
  targetGroup,
  customAudienceGroup,
  targetProfile,
  ageBand,
  ageBandOptions,
  ageBandLabel,
  occupation,
  occupationOptions,
  occupationLabel,
  budgetRange,
  budgetLabel,
  formality,
  formalityLabel,
  onSelectedCountryChange,
  onTargetGroupChange,
  onCustomAudienceGroupChange,
  onTargetProfileChange,
  onAgeBandChange,
  onOccupationChange,
  onRelationshipChange,
  onBudgetRangeChange,
  onFormalityChange,
  canContinue,
  onBack,
  onContinue,
  devPreview = false,
}: StepCountryProps) {
  const isZh = locale === 'zh'
  const displayClassName = isZh ? 'font-display-zh' : 'font-serif'
  const countryName = getCountryName(selectedCountry, locale)
  const relationReady = targetGroup !== 'other' || customAudienceGroup.trim().length > 0
  const relationText = targetGroup === 'other' && customAudienceGroup.trim() ? customAudienceGroup.trim() : selectedAudienceLabel

  const relationOptions: SelectOption[] = isZh
    ? [
        { value: 'peer', label: '朋友 / 同辈' },
        { value: 'client', label: '合作往来' },
        { value: 'leader', label: '尊敬前辈' },
        { value: 'family', label: '家人 / 亲近' },
        { value: 'elder', label: '长辈' },
        { value: 'other', label: '更复杂一些' },
      ]
    : [
        { value: 'peer', label: 'Peer / friend' },
        { value: 'client', label: 'Professional' },
        { value: 'leader', label: 'Respected senior' },
        { value: 'family', label: 'Family / close' },
        { value: 'elder', label: 'Elder' },
        { value: 'other', label: 'More nuanced' },
      ]

  const conciseAgeOptions = ageBandOptions.slice(0, 4)
  const conciseOccupationOptions = occupationOptions
    .filter(option => ['student', 'office', 'executive', 'family', 'teacher', 'creative', 'other'].includes(option.value))
    .slice(0, 4)
  const occupationFallback = conciseOccupationOptions.length > 0 ? conciseOccupationOptions : occupationOptions.slice(0, 4)

  const proportionOptions: SelectOption[] = isZh
    ? [
        { value: 'light', label: '轻一点' },
        { value: 'steady', label: '稳一点' },
        { value: 'solemn', label: '郑重一点' },
      ]
    : [
        { value: 'light', label: 'Lighter' },
        { value: 'steady', label: 'Steadier' },
        { value: 'solemn', label: 'More solemn' },
      ]

  const proportionValue =
    formality === 'formal' || budgetRange === 'high'
      ? 'solemn'
      : formality === 'casual' || budgetRange === 'low'
        ? 'light'
        : 'steady'

  const [sceneIndex, setSceneIndex] = React.useState(() =>
    getInitialSceneIndex({
      selectedCountry,
      targetGroup,
      customAudienceGroup,
      canContinue,
    }),
  )

  const unlockedSceneIndex = getUnlockedSceneIndex({
    selectedCountry,
    targetGroup,
    customAudienceGroup,
    canContinue,
    devPreview,
  })

  React.useEffect(() => {
    if (!devPreview && sceneIndex > unlockedSceneIndex) {
      setSceneIndex(unlockedSceneIndex)
    }
  }, [devPreview, sceneIndex, unlockedSceneIndex])

  const scenes = [
    {
      key: 'destination' as SceneKey,
      stepLabel: isZh ? '第一幕' : 'Scene 01',
      railLabel: isZh ? '文化落点' : 'Frame',
      title: isZh ? '先告诉我，这份礼物会在哪个国家被理解。' : 'Tell me first where this gift will be interpreted.',
      intro: isZh
        ? '礼物不会先进入场景，它会先进入一种文化阅读。国家一旦写定，我才能知道后面的分寸往哪里收。'
        : 'A gift does not enter a scene first. It enters a cultural reading. Once the country is fixed, the tone can settle.',
      stageLead: isZh ? '先写文化落点。' : 'Write the cultural frame first.',
      cta: isZh ? '继续写这段关系' : 'Continue to relationship',
      canProceed: devPreview || Boolean(selectedCountry),
    },
    {
      key: 'relation' as SceneKey,
      stepLabel: isZh ? '第二幕' : 'Scene 02',
      railLabel: isZh ? '关系距离' : 'Relation',
      title: isZh ? '再告诉我，这个人对你是谁。' : 'Now tell me who this person is to you.',
      intro: isZh
        ? '我不是在给用户打标签。我只是需要知道，这份礼物应该离对方多近，才能显得自然。'
        : 'I am not assigning a label. I only need to know how near this gift may stand to the person.',
      stageLead: isZh ? '再写关系距离。' : 'Set the relationship distance.',
      cta: isZh ? '继续写人物轮廓' : 'Continue to profile',
      canProceed: devPreview || relationReady,
    },
    {
      key: 'profile' as SceneKey,
      stepLabel: isZh ? '第三幕' : 'Scene 03',
      railLabel: isZh ? '人物轮廓' : 'Silhouette',
      title: isZh ? '接着让我把这个人的轮廓写清。' : 'Let me sharpen the silhouette of this person.',
      intro: isZh
        ? '这里不需要履历表。只要让我知道，他更像处在怎样的年龄感和身份感里。'
        : 'This does not need a biography. I only need the age feeling and social role that frame the person.',
      stageLead: isZh ? '然后让人物站出来。' : 'Let the person stand up.',
      cta: isZh ? '继续写礼物分寸' : 'Continue to tact',
      canProceed: true,
    },
    {
      key: 'tact' as SceneKey,
      stepLabel: isZh ? '第四幕' : 'Scene 04',
      railLabel: isZh ? '进入方式' : 'Tact',
      title: isZh ? '最后告诉我，这份礼物该用什么力道出现。' : 'Finally, tell me with what force the gift should appear.',
      intro: isZh
        ? '有些礼物适合轻轻带过，有些礼物不能太随意。再给我一句只有你知道的隐情，这页就能收束。'
        : 'Some gifts must arrive lightly, others cannot be casual. Give me one private detail and the page can close.',
      stageLead: isZh ? '最后收礼物的分寸。' : 'Set the tact of the gesture.',
      cta: isZh ? '查看 AI 定稿' : 'View AI draft',
      canProceed: true,
    },
    {
      key: 'summary' as SceneKey,
      stepLabel: isZh ? '终幕' : 'Final',
      railLabel: isZh ? '确认定稿' : 'Confirm',
      title: isZh ? '这是我为你整理好的人物定稿。' : 'This is the recipient page I have drafted for you.',
      intro: isZh
        ? '如果这页读起来已经像你心里的那个人，就在这里确认。下一章开始排场，不再重写人物。'
        : 'If this reads like the person you had in mind, confirm it here. The next chapter stages the arrival rather than rewriting the person.',
      stageLead: isZh ? '这一页人物已经成稿。' : 'This recipient page is drafted.',
      cta: isZh ? '确认这页人物，进入 Step 3' : 'Confirm and enter Step 3',
      canProceed: devPreview || canContinue,
    },
  ]

  const currentScene = scenes[sceneIndex]
  const checkpoint = buildCheckpoint({
    isZh,
    selectedCountry,
    targetGroup,
    customAudienceGroup,
    targetProfile,
    budgetRange,
  })
  const summaryParagraphs = buildSummaryParagraphs({
    isZh,
    countryName,
    selectedAudienceLabel,
    customAudienceGroup,
    targetGroup,
    ageBandLabel,
    occupationLabel,
    budgetLabel,
    formalityLabel,
    targetProfile,
  })

  const stageSnapshot = !selectedCountry
    ? isZh
      ? '我还在等你告诉我，这份礼物究竟会落进哪一种礼数里。'
      : 'I am still waiting to know which etiquette this gift will land inside.'
    : !relationReady
      ? isZh
        ? `文化落点已经定为 ${countryName}，但这段关系还没有被你真正命名。`
        : `The cultural frame is now ${countryName}, but the relationship still needs your own naming.`
      : !targetProfile.trim()
        ? isZh
          ? `我会先把这页写成一个更接近 ${relationText}、${ageBandLabel}、${occupationLabel} 的人。`
          : `For now, I will write this person closer to ${relationText}, ${ageBandLabel}, and ${occupationLabel}.`
        : isZh
          ? `我会记住这句暗线：“${targetProfile.trim()}”`
          : `I will carry this private line forward: "${targetProfile.trim()}"`

  const currentPhoto = stagePhotography[currentScene.key]

  const handleSceneBack = () => {
    if (sceneIndex === 0) {
      onBack()
      return
    }

    setSceneIndex(previous => Math.max(previous - 1, 0))
  }

  const handleSceneContinue = () => {
    if (currentScene.key === 'summary') {
      onContinue()
      return
    }

    if (!currentScene.canProceed) {
      return
    }

    setSceneIndex(previous => Math.min(previous + 1, scenes.length - 1))
  }

  const renderSceneContent = () => {
    if (currentScene.key === 'destination') {
      return (
        <PromptSheet label={isZh ? 'AI 起笔' : 'AI opening line'}>
          <p className="text-[15px] leading-8 text-[#352d27]">
            {isZh
              ? '我会先按礼物将抵达的国家去理解它，因为同一份礼物，换一处礼数与阅读习惯，含义就会完全不同。'
              : 'I will read the gift through the country where it lands, because the same object changes meaning under a different etiquette.'}
          </p>

          <div className="mt-4 border-t border-[rgba(74,63,51,0.08)] pt-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '文化落点' : 'Cultural frame'}</p>
            <p className="mt-1 text-[13px] leading-6 text-[#5f584f]">
              {countryName
                ? isZh
                  ? `${countryName} 已经写定。接下来我会按它的礼数与接收习惯继续往下写人。`
                  : `${countryName} is now fixed. I will continue the page through its etiquette and reception habits.`
                : isZh
                  ? '先把国家写定，我再继续写这页人物。'
                  : 'Set the country first, and I will continue the recipient page.'}
            </p>
            <InlineCountrySelector locale={locale} value={selectedCountry} onChange={onSelectedCountryChange} />
          </div>
        </PromptSheet>
      )
    }

    if (currentScene.key === 'relation') {
      return (
        <PromptSheet label={isZh ? 'AI 起笔' : 'AI opening line'}>
          <p className="text-[15px] leading-8 text-[#352d27]">
            {isZh
              ? '先别把他写成“用户”或者“收礼对象”。我更想知道的是，你们之间究竟隔着怎样的距离。'
              : 'Do not reduce this person to a recipient. I need to know the distance that stands between you.'}
          </p>

          <div className="mt-4 border-t border-[rgba(74,63,51,0.08)] pt-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '关系距离' : 'Relationship distance'}</p>
            <ChoicePills
              options={relationOptions}
              value={targetGroup}
              onChange={value => {
                const next = value as AudienceGroup
                onTargetGroupChange(next)
                onRelationshipChange(relationDefaults[next])
              }}
              columns="grid-cols-2 sm:grid-cols-3"
            />

            {targetGroup === 'other' ? (
              <input
                type="text"
                value={customAudienceGroup}
                onChange={event => onCustomAudienceGroupChange(event.target.value)}
                placeholder={isZh ? '例如：重要引荐人、研究搭档、寄宿家庭照顾者' : 'e.g. introducer, research partner, host-family caregiver'}
                className={inputClassName}
              />
            ) : null}

            <p className="mt-4 text-[13px] leading-6 text-[#6a6258]">
              {relationReady
                ? isZh
                  ? `好，我会先把你们写成 ${relationText} 这样的一段关系。`
                  : `Good. I will draft this as a ${relationText} relationship.`
                : isZh
                  ? '如果这段关系比常见称呼更细，给我一句你自己的定义。'
                  : 'If the relationship is more specific than the usual labels, give it to me in your own words.'}
            </p>
          </div>
        </PromptSheet>
      )
    }

    if (currentScene.key === 'profile') {
      return (
        <PromptSheet label={isZh ? 'AI 起笔' : 'AI opening line'}>
          <p className="text-[15px] leading-8 text-[#352d27]">
            {isZh
              ? '我只需要一个大致轮廓。让他从抽象称呼里站出来，但不要写成一份履历表。'
              : 'I only need a silhouette. Enough for the person to stand up, not enough to become a biography.'}
          </p>

          <div className="mt-6 grid gap-3 border-t border-[rgba(74,63,51,0.08)] pt-3 sm:grid-cols-2">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '年龄感' : 'Age sense'}</p>
              <ChoicePills options={conciseAgeOptions} value={ageBand} onChange={onAgeBandChange} columns="grid-cols-2" />
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '身份感' : 'Role sense'}</p>
              <ChoicePills options={occupationFallback} value={occupation} onChange={onOccupationChange} columns="grid-cols-2" />
            </div>
          </div>

          <p className="mt-4 border-t border-[rgba(74,63,51,0.08)] pt-4 text-[13px] leading-6 text-[#6a6258]">
            {isZh
              ? `按现在这版，我会先把他写成更接近 ${ageBandLabel}、${occupationLabel} 的人。`
              : `At the moment, I would write this person closer to ${ageBandLabel} and ${occupationLabel}.`}
          </p>
        </PromptSheet>
      )
    }

    if (currentScene.key === 'tact') {
      return (
        <PromptSheet label={isZh ? 'AI 起笔' : 'AI opening line'}>
          <p className="text-[15px] leading-8 text-[#352d27]">
            {isZh
              ? '同样的礼物，力道不同，关系感就完全不同。你只要告诉我它该轻一点、稳一点，还是郑重一点。'
              : 'The same gift can read very differently depending on force. Tell me only whether it should feel lighter, steadier, or more solemn.'}
          </p>

          <div className="mt-4 border-t border-[rgba(74,63,51,0.08)] pt-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '礼物进入关系的力道' : 'Gesture intensity'}</p>
            <ChoicePills
              options={proportionOptions}
              value={proportionValue}
              onChange={value => {
                if (value === 'light') {
                  onBudgetRangeChange('low')
                  onFormalityChange('casual')
                  return
                }

                if (value === 'solemn') {
                  onBudgetRangeChange('high')
                  onFormalityChange('formal')
                  return
                }

                onBudgetRangeChange('medium')
                onFormalityChange('semi-formal')
              }}
              columns="grid-cols-3"
            />
          </div>

          <div className="mt-4 border-t border-[rgba(74,63,51,0.08)] pt-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '只有你知道的一句' : 'One private line'}</p>
            <textarea
              value={targetProfile}
              onChange={event => onTargetProfileChange(event.target.value)}
              rows={3}
              placeholder={isZh ? '比如：他更看重体面，不喜欢太私人，或最近需要被轻拿轻放。' : 'For example: they value dignity, dislike overt intimacy, or need to be handled lightly right now.'}
              className={`${inputClassName} min-h-[5.5rem] resize-none overflow-hidden`}
            />
            <p className="mt-4 text-[13px] leading-6 text-[#6a6258]">
              {isZh
                ? `好，我会先把礼物进入关系的分寸收在 ${budgetLabel} 与 ${formalityLabel} 这一侧。`
                : `Good. I will hold the gesture on the ${budgetLabel} / ${formalityLabel} side of the register.`}
            </p>
          </div>
        </PromptSheet>
      )
    }

    return (
      <PromptSheet label={isZh ? 'AI 人物定稿' : 'AI recipient draft'}>
        <div className="space-y-3">
          {summaryParagraphs.map(line => (
            <p key={line} className="text-[14px] leading-7 text-[#403731]">
              {line}
            </p>
          ))}
        </div>

        <div className="mt-4 border-t border-[rgba(74,63,51,0.08)] pt-4">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '进入 Step 3 时，AI 会带走这些判断' : 'The AI carries these judgments into Step 3'}</p>
          <p className="mt-2 text-[13px] leading-6 text-[#6a6258]">
            {isZh
              ? '国家礼数、关系距离、人物轮廓与礼物力道都会直接进入下一章的排场判断。'
              : 'Country etiquette, relationship distance, recipient silhouette, and gesture force all move directly into the next chapter.'}
          </p>
        </div>
      </PromptSheet>
    )
  }

  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="flex min-h-0 w-full flex-1 flex-col">
      <div className="relative flex min-h-0 flex-1 flex-col overflow-visible rounded-[1.6rem] border border-[rgba(74,63,51,0.12)] bg-[linear-gradient(160deg,rgba(255,252,247,0.92),rgba(248,242,234,0.88))] shadow-[0_32px_86px_-62px_rgba(36,24,18,0.18)] sm:rounded-[2.35rem] xl:overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(120,152,139,0.15),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(214,185,155,0.18),transparent_28%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.58),transparent)]" />

        <div className="relative grid min-h-0 flex-1 xl:grid-cols-[minmax(20rem,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative hidden xl:block min-h-[15rem] overflow-hidden border-b border-[rgba(74,63,51,0.1)] xl:min-h-0 xl:border-r xl:border-b-0">
            <Image src={currentPhoto.src} alt="" fill unoptimized className="object-cover" style={{ objectPosition: currentPhoto.position }} />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,252,247,0.05),rgba(39,28,21,0.32)_36%,rgba(16,11,8,0.7))]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.24),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(255,235,214,0.18),transparent_26%)] mix-blend-screen" />

            <div className="relative flex h-full flex-col justify-between px-5 py-4 sm:px-6 sm:py-5 xl:px-7 xl:py-6">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.28em] text-white/68">{isZh ? 'Recipient stage' : 'Recipient stage'}</p>
                  <p className={`mt-2 max-w-[16rem] text-[1.5rem] leading-[1.05] tracking-[-0.04em] text-white sm:text-[1.7rem] ${displayClassName}`}>
                    {currentScene.stageLead}
                  </p>
                </div>
                <div className="text-right text-[10px] uppercase tracking-[0.22em] text-white/66">
                  <p>{String(sceneIndex + 1).padStart(2, '0')}</p>
                  <p className="mt-1">{currentScene.railLabel}</p>
                </div>
              </div>

              <div className="max-w-[24rem]">
                <p className="text-[13px] leading-6 text-white/84">{currentScene.intro}</p>
              </div>

              <div className="max-w-[25rem] rounded-[1.25rem] border border-white/14 bg-[rgba(18,13,10,0.24)] px-4 py-3 backdrop-blur-sm">
                <p className="text-[9px] uppercase tracking-[0.22em] text-white/62">{isZh ? 'AI 当前旁白' : 'Current AI aside'}</p>
                <p className="mt-2 text-[13px] leading-6 text-white/92">{stageSnapshot}</p>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-col px-4 py-4 sm:px-6 sm:py-5 xl:px-7 xl:py-5">
            <div className="flex flex-wrap items-center gap-1.5">
              {scenes.map((scene, index) => {
                const active = index === sceneIndex
                const available = devPreview || index <= unlockedSceneIndex

                return (
                  <button
                    key={scene.key}
                    type="button"
                    onClick={() => {
                      if (available) {
                        setSceneIndex(index)
                      }
                    }}
                    disabled={!available}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[9px] uppercase tracking-[0.18em] transition ${
                      active
                        ? 'border-transparent bg-[#201915] text-white'
                        : available
                          ? 'border-[rgba(74,63,51,0.08)] bg-white/86 text-[#6f675d] hover:border-[rgba(74,63,51,0.16)] hover:text-[#201915]'
                          : 'border-[rgba(74,63,51,0.06)] bg-white/58 text-[#b0a79b]'
                    }`}
                  >
                    {index < sceneIndex ? <Check className="h-3.5 w-3.5" /> : null}
                    <span>{scene.railLabel}</span>
                  </button>
                )
              })}

              {devPreview ? (
                <span className="rounded-full border border-[rgba(45,138,105,0.12)] bg-[#eef6f1] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-[#2d6d55]">
                  DEV PREVIEW
                </span>
              ) : null}
            </div>

            <div className="mt-4">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#8f877b]">{currentScene.stepLabel}</p>
              <h2 className={`mt-2 max-w-[38rem] text-[1.6rem] leading-[1.05] tracking-[-0.05em] text-[#221c17] sm:text-[1.8rem] ${displayClassName}`}>
                {currentScene.title}
              </h2>
              <p className="mt-2 text-[0.9rem] leading-6 text-[#70675f]">{currentScene.intro}</p>
            </div>

            <div className="mt-4 min-h-0 flex-1 overflow-y-auto pr-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene.key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-[46rem]"
                >
                  {renderSceneContent()}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-[rgba(74,63,51,0.08)] pt-3 text-[11px] leading-5 text-[#675f56]">
              <Sparkles className="h-3.5 w-3.5 shrink-0 text-[#2d8a69]" />
              <p>{isZh ? '你只校正当前这一幕，AI 负责把整页人物写完整。' : 'You only revise the current scene while the AI keeps the whole recipient page coherent.'}</p>
            </div>
          </div>
        </div>

        <div className="relative border-t border-[rgba(74,63,51,0.1)] bg-[rgba(255,252,247,0.72)] px-5 py-3 sm:px-6 xl:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#8f877b]">{isZh ? 'AI checkpoint' : 'AI checkpoint'}</p>
              <p className="mt-2 text-[15px] leading-7 text-[#1f1915]">{checkpoint.title}</p>
              <div className="mt-1 flex items-start gap-2 text-[13px] leading-6 text-[#5a544b]">
                <AlertCircle className="mt-1 h-3.5 w-3.5 shrink-0 text-[#3f7a65]" />
                <span className="max-w-[44rem]">{checkpoint.note}</span>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={handleSceneBack}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,63,51,0.12)] bg-white/82 px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] text-[#5c5a55] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-30px_rgba(36,24,18,0.18)]"
              >
                <ArrowLeft className="h-4 w-4" />
                {sceneIndex === 0 ? (isZh ? '返回上一步' : 'Back') : isZh ? '回到上一幕' : 'Previous scene'}
              </button>

              <button
                type="button"
                onClick={handleSceneContinue}
                disabled={!currentScene.canProceed}
                className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] uppercase tracking-[0.18em] transition ${
                  currentScene.canProceed
                    ? 'bg-[#2d8a69] text-white shadow-[0_20px_44px_-28px_rgba(45,138,105,0.54)] hover:-translate-y-0.5 hover:bg-[#247357]'
                    : 'cursor-not-allowed bg-[#d7d1c8] text-white/82'
                }`}
              >
                {currentScene.cta}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
