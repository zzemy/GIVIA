'use client'

import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, ArrowRight, ChevronDown, Globe2, Search, Sparkles } from 'lucide-react'
import { COUNTRIES, COUNTRIES_BY_REGION, POPULAR_COUNTRIES, getCountryName } from '@/lib/countries'
import type { AudienceGroup, Locale, SelectOption } from '@/components/gifting/home/types'

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
}

type SceneKey = 'destination' | 'relation' | 'profile' | 'tact' | 'summary'

const inputClassName =
  'mt-3 w-full rounded-[1.1rem] border border-[rgba(74,63,51,0.08)] bg-[rgba(255,255,255,0.94)] px-4 py-3 text-[14px] leading-6 text-[#201a16] transition placeholder:text-[#9a9287] focus:border-[rgba(62,118,93,0.22)] focus:bg-white focus:outline-none focus:ring-0'

const sheetClassName =
  'overflow-hidden rounded-[1.8rem] border border-[rgba(74,63,51,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,246,239,0.84))] shadow-[inset_0_1px_0_rgba(255,255,255,0.48)]'

const relationDefaults: Record<AudienceGroup, string> = {
  peer: 'friend',
  client: 'partner',
  leader: 'mentor',
  family: 'family',
  elder: 'family',
  other: 'friend',
}

function buildCheckpoint({
  isZh,
  selectedCountry,
  targetGroup,
  customAudienceGroup,
  targetProfile,
  budgetRange,
}: {
  isZh: boolean
  selectedCountry: string
  targetGroup: AudienceGroup
  customAudienceGroup: string
  targetProfile: string
  budgetRange: string
}) {
  if (!selectedCountry) {
    return {
      title: isZh ? '这页还没有真正落地。' : 'This page has not landed yet.',
      note: isZh ? '先把文化落点定下来，我才知道接下来的人物分寸要往哪里收。' : 'Set the cultural destination first so the recipient tone can settle properly.',
    }
  }

  if (targetGroup === 'other' && !customAudienceGroup.trim()) {
    return {
      title: isZh ? '这段关系还差一句精确称呼。' : 'This relationship still needs a precise name.',
      note: isZh ? '只要补一句他在你生活里究竟是什么位置，这页就会立刻更准。' : 'One short line about the role they actually hold in your life will sharpen the whole page.',
    }
  }

  if (!targetProfile.trim()) {
    return {
      title: isZh ? '现在已经像一页克制的初稿。' : 'This already reads like a restrained first draft.',
      note: isZh ? '如果你愿意，再补一句只有你知道的隐情，我会把它写得更像真实的人。' : 'If you add one detail only you know, the page will read more like a real person.',
    }
  }

  if (budgetRange === 'high') {
    return {
      title: isZh ? '这份礼物已经开始带重量。' : 'This gift is beginning to carry weight.',
      note: isZh ? '下一章最重要的，不再是谁，而是它该怎样抵达，才不会压过关系眼下能承受的分寸。' : 'The next chapter is no longer about who they are, but how the gesture should arrive without outweighing the relationship.',
    }
  }

  return {
    title: isZh ? '这页人物已经可以定稿。' : 'This recipient page is ready to lock.',
    note: isZh ? '下一章开始排场，不再写人。' : 'The next chapter begins staging the arrival, not rewriting the person.',
  }
}

function buildSummaryParagraphs({
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
}: {
  isZh: boolean
  countryName: string
  selectedAudienceLabel: string
  customAudienceGroup: string
  targetGroup: AudienceGroup
  ageBandLabel: string
  occupationLabel: string
  budgetLabel: string
  formalityLabel: string
  targetProfile: string
}) {
  if (isZh) {
    const relationText = targetGroup === 'other' && customAudienceGroup.trim() ? customAudienceGroup.trim() : selectedAudienceLabel

    return [
      countryName
        ? `我会先把这份礼物理解为：它将进入 ${countryName} 的接收语境，因此所有分寸都要先经过那里的礼数与阅读习惯。`
        : '这份礼物的文化落点还没有完全写定，所以这页人物暂时只能停在半成稿。',
      `收礼人这一侧，我会先把他写成与你属于 ${relationText} 的人，轮廓更接近 ${ageBandLabel}、${occupationLabel}。`,
      `礼物进入这段关系时，不宜太轻浮，也不宜过分用力，所以我会把当前分寸先收在 ${budgetLabel} 与 ${formalityLabel} 之间。`,
      targetProfile.trim()
        ? `真正把这页写活的，是你补进来的那句细节：${targetProfile.trim()}`
        : '你没有额外补充隐情，所以我会先保留一版较克制的人物写法，把判断留给下一章的送达编排。',
    ]
  }

  const relationText = targetGroup === 'other' && customAudienceGroup.trim() ? customAudienceGroup.trim() : selectedAudienceLabel

  return [
    countryName
      ? `I will frame this gift as something that enters the reception culture of ${countryName}, so every later judgment is filtered through that etiquette.`
      : 'The cultural destination is still only half written, so this recipient page remains provisional.',
    `On the recipient side, I will draft this person as someone closer to ${relationText}, with a profile nearer to ${ageBandLabel} and ${occupationLabel}.`,
    `The gesture should feel neither flippant nor overcommitted, so I will hold its register somewhere between ${budgetLabel} and ${formalityLabel}.`,
    targetProfile.trim()
      ? `The line that truly sharpens the page is the one you added: ${targetProfile.trim()}`
      : 'Because no private detail was added, I will keep this page restrained and let the arrival chapter carry more of the judgment.',
  ]
}

function getInitialSceneIndex({
  selectedCountry,
  targetGroup,
  customAudienceGroup,
  canContinue,
}: {
  selectedCountry: string
  targetGroup: AudienceGroup
  customAudienceGroup: string
  canContinue: boolean
}) {
  const relationReady = targetGroup !== 'other' || customAudienceGroup.trim().length > 0

  if (canContinue) {
    return 4
  }

  if (selectedCountry && relationReady) {
    return 3
  }

  if (selectedCountry) {
    return 1
  }

  return 0
}

function ChoicePills({
  options,
  value,
  onChange,
  columns = 'grid-cols-2',
}: {
  options: SelectOption[]
  value: string
  onChange: (value: string) => void
  columns?: string
}) {
  return (
    <div className={`mt-4 grid gap-2 ${columns}`}>
      {options.map(option => {
        const active = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`min-w-0 rounded-full border px-4 py-2.5 text-left text-[11px] uppercase tracking-[0.16em] transition ${
              active
                ? 'border-transparent bg-[#ebf4ef] text-[#235543] shadow-[0_14px_26px_-22px_rgba(44,109,85,0.45)]'
                : 'border-[rgba(74,63,51,0.08)] bg-white/92 text-[#6f675d] hover:border-[rgba(74,63,51,0.16)] hover:text-[#201915]'
            }`}
          >
            <span className="block truncate">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}

function InlineCountrySelector({
  locale,
  value,
  onChange,
}: {
  locale: Locale
  value: string
  onChange: (value: string) => void
}) {
  const isZh = locale === 'zh'
  const [isOpen, setIsOpen] = React.useState(!value)
  const [searchTerm, setSearchTerm] = React.useState('')

  const selectedCountry = COUNTRIES.find(country => country.code === value)
  const popularCountryCodes = React.useMemo(() => new Set(POPULAR_COUNTRIES.map(country => country.code)), [])

  const filteredCountries = React.useMemo(() => {
    if (!searchTerm.trim()) {
      return null
    }

    const term = searchTerm.toLowerCase()

    return COUNTRIES.filter(country => {
      const name = isZh ? country.nameZh : country.nameEn
      return name.toLowerCase().includes(term) || country.code.toLowerCase().includes(term)
    })
  }, [isZh, searchTerm])

  const regionLabels = isZh
    ? {
        asia: '亚洲',
        europe: '欧洲',
        americas: '美洲',
        africa: '非洲',
        oceania: '大洋洲',
      }
    : {
        asia: 'Asia',
        europe: 'Europe',
        americas: 'Americas',
        africa: 'Africa',
        oceania: 'Oceania',
      }

  const handleSelect = (countryCode: string) => {
    onChange(countryCode)
    setSearchTerm('')
    setIsOpen(false)
  }

  const renderCountryButton = (country: (typeof COUNTRIES)[number]) => {
    const active = country.code === value

    return (
      <button
        key={country.code}
        type="button"
        onClick={() => handleSelect(country.code)}
        className={`group flex w-full items-center justify-between gap-4 border-t border-[rgba(74,63,51,0.08)] py-3 text-left transition first:border-t-0 ${
          active ? 'text-[#201915]' : 'text-[#5f584f] hover:text-[#201915]'
        }`}
      >
        <div className="min-w-0">
          <p className="truncate text-[0.98rem]">{isZh ? country.nameZh : country.nameEn}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{country.code}</p>
        </div>
        <span className={`text-[10px] uppercase tracking-[0.2em] transition ${active ? 'text-[#2d8a69]' : 'text-transparent group-hover:text-[#98a2b3]'}`}>
          {isZh ? '已选' : 'Selected'}
        </span>
      </button>
    )
  }

  return (
    <div className="mt-4 overflow-hidden rounded-[1.45rem] border border-[rgba(74,63,51,0.09)] bg-white/78">
      <button
        type="button"
        onClick={() => setIsOpen(open => !open)}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/72"
      >
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '目的地' : 'Destination'}</p>
          <p className={`mt-2 truncate text-[1.08rem] ${selectedCountry ? 'text-[#1b1714]' : 'text-[#6d756c]'}`}>
            {selectedCountry ? (isZh ? selectedCountry.nameZh : selectedCountry.nameEn) : isZh ? '选择礼物将在何处被理解' : 'Choose where the gesture will be read'}
          </p>
        </div>
        <ChevronDown size={18} className={`shrink-0 text-[#98a2b3] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-[rgba(74,63,51,0.08)]"
          >
            <div className="px-4 py-4">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '文化目的地' : 'Cultural destination'}</p>
              <p className="mt-3 max-w-[30rem] text-[1.16rem] leading-tight text-[#1f1915]">
                {isZh ? '选择这份心意将被怎样的文化语境所理解。' : 'Choose the cultural context in which this gesture will be interpreted.'}
              </p>

              <div className="relative mt-5 border-b border-[rgba(74,63,51,0.08)] pb-3">
                <Search size={16} className="absolute left-0 top-1 text-[#98a2b3]" />
                <input
                  type="text"
                  placeholder={isZh ? '搜索国家或地区代码' : 'Search country or code'}
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  className="w-full bg-transparent pl-7 text-sm text-[#1b1714] placeholder:text-[#98a2b3] focus:outline-none"
                />
              </div>

              <div className="country-selector-scroll mt-4 max-h-[16.5rem] overflow-y-auto pr-1">
                {filteredCountries ? (
                  filteredCountries.length > 0 ? (
                    <section>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '搜索结果' : 'Search results'}</p>
                      <div className="mt-3">{filteredCountries.map(country => renderCountryButton(country))}</div>
                    </section>
                  ) : (
                    <div className="py-8 text-center text-sm text-[#6d756c]">{isZh ? '没有找到匹配的国家。' : 'No country matched the current search.'}</div>
                  )
                ) : (
                  <div className="space-y-6">
                    <section>
                      <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? '常用目的地' : 'Common routes'}</p>
                      <div className="mt-3 grid gap-x-6 md:grid-cols-2">
                        {POPULAR_COUNTRIES.map(country => renderCountryButton(country))}
                      </div>
                    </section>

                    {(Object.keys(COUNTRIES_BY_REGION) as Array<keyof typeof COUNTRIES_BY_REGION>).map(region => {
                      const regionalCountries = COUNTRIES_BY_REGION[region].filter(country => !popularCountryCodes.has(country.code))

                      if (regionalCountries.length === 0) {
                        return null
                      }

                      return (
                        <section key={region}>
                          <p className="text-[10px] uppercase tracking-[0.22em] text-[#98a2b3]">{regionLabels[region] || region}</p>
                          <div className="mt-3 grid gap-x-6 md:grid-cols-2">{regionalCountries.map(country => renderCountryButton(country))}</div>
                        </section>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function StepCountry(props: StepCountryProps) {
  const {
    locale,
    selectedCountry,
    selectedAudienceLabel,
    targetGroup,
    customAudienceGroup,
    targetProfile,
    ageBand,
    ageBandOptions,
    occupation,
    occupationOptions,
    ageBandLabel,
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
  } = props

  const isZh = locale === 'zh'
  const displayClassName = isZh ? 'font-display-zh' : 'font-serif'
  const countryName = getCountryName(selectedCountry, locale)
  const relationReady = targetGroup !== 'other' || customAudienceGroup.trim().length > 0

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

  const checkpoint = buildCheckpoint({
    isZh,
    selectedCountry,
    targetGroup,
    customAudienceGroup,
    targetProfile,
    budgetRange,
  })

  const scenes = [
    {
      key: 'destination' as SceneKey,
      stepLabel: isZh ? '第一幕' : 'Scene 01',
      railLabel: isZh ? '文化落点' : 'Frame',
      title: isZh ? '先告诉我，这份礼物会在哪个国家被理解。' : 'Tell me first where this gift will be interpreted.',
      intro: isZh
        ? '礼物不会先进入场景，它会先进入一种文化阅读。国家一旦写定，我才能知道接下来的分寸往哪里收。'
        : 'A gift does not enter a scene first. It enters a cultural reading. Once the country is fixed, the tone can settle.',
      hint: isZh ? '先把文化落点写定。' : 'Set the cultural destination first.',
      cta: isZh ? '继续写这段关系' : 'Continue to relationship',
      canProceed: Boolean(selectedCountry),
    },
    {
      key: 'relation' as SceneKey,
      stepLabel: isZh ? '第二幕' : 'Scene 02',
      railLabel: isZh ? '关系距离' : 'Relation',
      title: isZh ? '再告诉我，这个人对你是谁。' : 'Now tell me who this person is to you.',
      intro: isZh
        ? '我不是在给用户打标签。我只是需要知道，这份礼物应该离对方多近，才能显得自然。'
        : 'I am not assigning a label. I only need to know how near this gift may stand to the person.',
      hint: isZh ? '把关系距离拨准。' : 'Set the relationship distance.',
      cta: isZh ? '继续写人物轮廓' : 'Continue to profile',
      canProceed: relationReady,
    },
    {
      key: 'profile' as SceneKey,
      stepLabel: isZh ? '第三幕' : 'Scene 03',
      railLabel: isZh ? '人物轮廓' : 'Silhouette',
      title: isZh ? '接着让我把这个人的轮廓写清。' : 'Let me sharpen the silhouette of this person.',
      intro: isZh
        ? '这里不需要履历表。只要让我知道，他更像处在怎样的年龄感和身份感里。'
        : 'This does not need a biography. I only need the age feeling and social role that frame the person.',
      hint: isZh ? '让人物不再只是抽象称呼。' : 'Make the person feel less abstract.',
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
      hint: isZh ? '补上这份礼物的分寸感。' : 'Set the tact of the gesture.',
      cta: isZh ? '查看 AI 人物定稿' : 'View AI summary',
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
      hint: isZh ? '确认后进入 Step 3 排场。' : 'Confirm to enter Step 3.',
      cta: isZh ? '确认这页侧写，进入 Step 3' : 'Confirm and enter Step 3',
      canProceed: canContinue,
    },
  ]

  const currentScene = scenes[sceneIndex]
  const chapterNotes = isZh
    ? ['礼物先抵达一个人，再进入场景。', '你只校正当前这一幕，AI 负责把整页人物写完整。']
    : ['A gift reaches a person before it reaches a scene.', 'You revise only the current scene while the AI keeps the page whole.']

  const stagePhotography: Record<SceneKey, { src: string; position: string }> = {
    destination: {
      src: 'https://images.unsplash.com/photo-1524492449090-1abe1e5f4f7d?auto=format&fit=crop&w=1600&q=80',
      position: 'center 46%',
    },
    relation: {
      src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80',
      position: 'center 36%',
    },
    profile: {
      src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1600&q=80',
      position: 'center 28%',
    },
    tact: {
      src: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
      position: 'center 36%',
    },
    summary: {
      src: 'https://images.unsplash.com/photo-1524492449090-1abe1e5f4f7d?auto=format&fit=crop&w=1600&q=80',
      position: 'center 46%',
    },
  }

  const stageLead =
    currentScene.key === 'destination'
      ? isZh
        ? '先写文化落点。'
        : 'Write the cultural frame first.'
      : currentScene.key === 'relation'
        ? isZh
          ? '再写关系距离。'
          : 'Then set the relationship distance.'
        : currentScene.key === 'profile'
          ? isZh
            ? '然后让人物站出来。'
            : 'Then let the person stand up.'
          : currentScene.key === 'tact'
            ? isZh
              ? '最后收礼物的分寸。'
              : 'Finally settle the tact.'
            : isZh
              ? '这一页人物已经成稿。'
              : 'This recipient page is now drafted.'

  const stageMoments = [
    countryName
      ? isZh
        ? `${countryName} 会先决定这份礼物被怎样理解。`
        : `${countryName} sets the first cultural reading of the gift.`
      : isZh
        ? '文化落点还没有写定。'
        : 'The cultural frame is not fixed yet.',
    relationReady
      ? isZh
        ? `这份心意会先落向 ${targetGroup === 'other' ? customAudienceGroup.trim() : selectedAudienceLabel} 这段关系。`
        : `The gesture first lands inside a ${targetGroup === 'other' ? customAudienceGroup.trim() : selectedAudienceLabel} relationship.`
      : isZh
        ? '关系距离还在等待你校正。'
        : 'The relationship distance is still waiting for your revision.',
    sceneIndex >= 2
      ? isZh
        ? `人物轮廓先收在 ${ageBandLabel}、${occupationLabel} 这一侧。`
        : `The person currently reads closer to ${ageBandLabel} and ${occupationLabel}.`
      : isZh
        ? '人物轮廓还没有完全站住。'
        : 'The recipient silhouette has not settled yet.',
    sceneIndex >= 3
      ? isZh
        ? `礼物进入关系的力道，暂时落在 ${budgetLabel} 与 ${formalityLabel} 之间。`
        : `The gesture currently sits between ${budgetLabel} and ${formalityLabel}.`
      : isZh
        ? '礼物进入关系的分寸还未收口。'
        : 'The tact of the gesture is not closed yet.',
  ]

  const stageDetail = targetProfile.trim()
    ? isZh
      ? `“${targetProfile.trim()}”`
      : `"${targetProfile.trim()}"`
    : isZh
      ? '这一页还缺一句只有你知道的隐情。'
      : 'This page still lacks the one private detail only you know.'

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
        <div className="max-w-[42rem]">
          <div className={sheetClassName}>
            <div className="px-5 py-5 sm:px-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#9a9287]">{isZh ? 'AI 起笔' : 'AI opening line'}</p>
              <p className="mt-3 text-[15px] leading-8 text-[#352d27]">
                {isZh
                  ? '我会先按礼物将抵达的国家去理解它，因为同一份礼物，换一处礼数与阅读习惯，含义就会完全不同。'
                  : 'I will read the gift through the country where it lands, because the same object changes meaning under a different etiquette.'}
              </p>
            </div>

            <div className="border-t border-[rgba(74,63,51,0.08)] px-5 py-5 sm:px-6">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f1ec] text-[#2c6d55]">
                  <Globe2 className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
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
              </div>
            </div>
          </div>
        </div>
      )
    }

    if (currentScene.key === 'relation') {
      return (
        <div className="max-w-[42rem]">
          <div className={sheetClassName}>
            <div className="px-5 py-5 sm:px-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#9a9287]">{isZh ? 'AI 起笔' : 'AI opening line'}</p>
              <p className="mt-3 text-[15px] leading-8 text-[#352d27]">
                {isZh
                  ? '先别把他写成“用户”或者“收礼对象”。我更想知道的是，你们之间究竟隔着怎样的距离。'
                  : 'Do not reduce this person to a recipient. I need to know the distance that stands between you.'}
              </p>
            </div>

            <div className="border-t border-[rgba(74,63,51,0.08)] px-5 py-5 sm:px-6">
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
                    ? `好，我会先把你们写成 ${targetGroup === 'other' ? customAudienceGroup.trim() : selectedAudienceLabel} 这样的一段关系。`
                    : `Good. I will draft this as a ${targetGroup === 'other' ? customAudienceGroup.trim() : selectedAudienceLabel} relationship.`
                  : isZh
                    ? '如果这段关系比常见称呼更细，给我一句你自己的定义。'
                    : 'If the relationship is more specific than the usual labels, give it to me in your own words.'}
              </p>
            </div>
          </div>
        </div>
      )
    }

    if (currentScene.key === 'profile') {
      return (
        <div className="max-w-[44rem]">
          <div className={sheetClassName}>
            <div className="px-5 py-5 sm:px-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#9a9287]">{isZh ? 'AI 起笔' : 'AI opening line'}</p>
              <p className="mt-3 text-[15px] leading-8 text-[#352d27]">
                {isZh
                  ? '我只需要一个大致轮廓。让他从抽象称呼里站出来，但不要写成一份履历表。'
                  : 'I only need a silhouette. Enough for the person to stand up, not enough to become a biography.'}
              </p>
            </div>

            <div className="grid border-t border-[rgba(74,63,51,0.08)] sm:grid-cols-2">
              <div className="px-5 py-5 sm:px-6">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '年龄感' : 'Age sense'}</p>
                <ChoicePills options={conciseAgeOptions} value={ageBand} onChange={onAgeBandChange} columns="grid-cols-2" />
              </div>

              <div className="border-t border-[rgba(74,63,51,0.08)] px-5 py-5 sm:border-t-0 sm:border-l sm:px-6">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '身份感' : 'Role sense'}</p>
                <ChoicePills options={occupationFallback} value={occupation} onChange={onOccupationChange} columns="grid-cols-2" />
              </div>
            </div>

            <div className="border-t border-[rgba(74,63,51,0.08)] px-5 py-4 sm:px-6">
              <p className="text-[13px] leading-6 text-[#6a6258]">
                {isZh
                  ? `按现在这版，我会先把他写成更接近 ${ageBandLabel}、${occupationLabel} 的人。`
                  : `At the moment, I would write this person closer to ${ageBandLabel} and ${occupationLabel}.`}
              </p>
            </div>
          </div>
        </div>
      )
    }

    if (currentScene.key === 'tact') {
      return (
        <div className="max-w-[44rem]">
          <div className={sheetClassName}>
            <div className="px-5 py-5 sm:px-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#9a9287]">{isZh ? 'AI 起笔' : 'AI opening line'}</p>
              <p className="mt-3 text-[15px] leading-8 text-[#352d27]">
                {isZh
                  ? '同样的礼物，力道不同，关系感就完全不同。你只要告诉我它该轻一点、稳一点，还是郑重一点。'
                  : 'The same gift can read very differently depending on force. Tell me only whether it should feel lighter, steadier, or more solemn.'}
              </p>
            </div>

            <div className="border-t border-[rgba(74,63,51,0.08)] px-5 py-5 sm:px-6">
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

            <div className="border-t border-[rgba(74,63,51,0.08)] px-5 py-5 sm:px-6">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '只有你知道的一句' : 'One private line'}</p>
              <textarea
                value={targetProfile}
                onChange={event => onTargetProfileChange(event.target.value)}
                rows={3}
                placeholder={
                  isZh
                    ? '如果还有一句只有你知道的话，就写在这里。比如：他更看重体面，不喜欢太私人，或最近需要被轻拿轻放。'
                    : 'If there is one private detail only you know, write it here. For example: they value dignity, dislike overt intimacy, or need to be handled lightly right now.'
                }
                className={`${inputClassName} min-h-[6rem] resize-none overflow-hidden`}
              />
              <p className="mt-4 text-[13px] leading-6 text-[#6a6258]">
                {isZh
                  ? `好，我会先把礼物进入关系的分寸收在 ${budgetLabel} 与 ${formalityLabel} 这一侧。`
                  : `Good. I will hold the gesture on the ${budgetLabel} / ${formalityLabel} side of the register.`}
              </p>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(16rem,0.92fr)]">
        <div className="overflow-hidden rounded-[1.9rem] border border-[rgba(74,63,51,0.08)] bg-[linear-gradient(180deg,rgba(244,249,246,0.92),rgba(255,255,255,0.9))] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]">
          <div className="px-6 py-6">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#336f59]" />
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#7d8f88]">{isZh ? 'AI 人物定稿' : 'AI recipient draft'}</p>
            </div>

            <div className="mt-4 space-y-3">
              {summaryParagraphs.map(line => (
                <p key={line} className="text-[14px] leading-7 text-[#403731]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[1.8rem] border border-[rgba(74,63,51,0.08)] bg-white/82">
          <div className="px-5 py-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#7d8797]">{isZh ? 'AI checkpoint' : 'AI checkpoint'}</p>
            <p className="mt-2 text-[14px] leading-6 text-[#201a16]">{checkpoint.title}</p>
            <div className="mt-3 flex items-start gap-2 text-[12px] leading-6 text-[#5a544b]">
              <AlertCircle className="mt-1 h-3.5 w-3.5 shrink-0 text-[#3f7a65]" />
              <span>{checkpoint.note}</span>
            </div>
          </div>

          <div className="border-t border-[rgba(74,63,51,0.08)] px-5 py-5">
            <p className="text-[10px] uppercase tracking-[0.22em] text-[#978f84]">{isZh ? '带入下一章' : 'Carry into next chapter'}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {[countryName || (isZh ? '目的地待定' : 'Destination pending'), selectedAudienceLabel, ageBandLabel, occupationLabel, budgetLabel, formalityLabel].map(item => (
                <span key={item} className="rounded-full border border-[rgba(74,63,51,0.08)] bg-[#f8f6f2] px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[#6a6258]">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="h-full w-full">
      <div className="relative flex h-full min-h-0 flex-col overflow-visible rounded-[2.35rem] border border-[rgba(74,63,51,0.12)] bg-[linear-gradient(160deg,rgba(255,252,247,0.94),rgba(246,241,234,0.9))] shadow-[0_32px_86px_-62px_rgba(36,24,18,0.16)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(153,198,183,0.18),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(204,181,150,0.18),transparent_26%)]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.56),transparent)]" />

        <div className="relative grid min-h-0 flex-1 xl:grid-cols-[minmax(21rem,0.84fr)_minmax(0,1.16fr)]">
          <div className="relative flex min-h-[15rem] flex-col justify-between overflow-hidden border-b border-[rgba(74,63,51,0.1)] px-5 py-5 sm:px-6 sm:py-6 xl:min-h-0 xl:border-r xl:border-b-0 xl:px-7 xl:py-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-[#8f877b]">{isZh ? 'Recipient stage' : 'Recipient stage'}</p>
                <p className={`mt-3 max-w-[22rem] text-[1.55rem] leading-[1.04] tracking-[-0.04em] text-[#201915] sm:text-[1.9rem] ${displayClassName}`}>
                  {isZh ? '让收礼人先从语境里浮现' : 'Let the recipient emerge before the scene does.'}
                </p>
              </div>
              <div className="text-right text-[10px] uppercase tracking-[0.22em] text-[#9a9287]">
                <p>02</p>
                <p className="mt-2">{isZh ? '人物定稿' : 'Recipient draft'}</p>
              </div>
            </div>

            <div
              className="relative mt-5 flex-1 overflow-hidden rounded-[2rem] border border-[rgba(74,63,51,0.12)] bg-[rgba(92,72,54,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]"
              style={{
                backgroundImage: `linear-gradient(180deg, rgba(255,252,247,0.04) 0%, rgba(77,54,39,0.12) 30%, rgba(16,12,10,0.56) 100%), url(${currentPhoto.src})`,
                backgroundSize: 'cover',
                backgroundPosition: currentPhoto.position,
              }}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_14%,rgba(255,244,225,0.18),transparent_30%),radial-gradient(circle_at_78%_20%,rgba(255,255,255,0.08),transparent_26%)] mix-blend-screen" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_36%,rgba(21,15,11,0.2)_100%)]" />
              <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(180deg,rgba(19,14,11,0),rgba(19,14,11,0.82))]" />

              <div className="relative flex h-full flex-col justify-between p-6 text-white sm:p-7">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-white/66">{currentScene.stepLabel}</p>
                  <p className={`mt-4 max-w-[18rem] text-[1.72rem] leading-[1.08] text-white sm:text-[2rem] ${displayClassName}`}>{stageLead}</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    {stageMoments.map(line => (
                      <p key={line} className="max-w-[26rem] text-sm leading-7 text-white/86">
                        {line}
                      </p>
                    ))}
                  </div>

                  <div className="rounded-[1.4rem] border border-white/14 bg-white/8 p-4 backdrop-blur-sm">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">{isZh ? 'AI 已写下的暗线' : 'AI private note'}</p>
                    <p className="mt-2 text-[13px] leading-6 text-white/86">{stageDetail}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {scenes.map((scene, index) => {
                      const active = index === sceneIndex
                      const reached = index < sceneIndex

                      return (
                        <span
                          key={scene.key}
                          className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.16em] ${
                            active
                              ? 'bg-white text-[#201915]'
                              : reached
                                ? 'border border-white/24 bg-white/10 text-white/88'
                                : 'border border-white/14 bg-transparent text-white/52'
                          }`}
                        >
                          {scene.railLabel}
                        </span>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-end justify-between gap-4 border-t border-[rgba(74,63,51,0.1)] pt-4">
              <div className="space-y-2">
                {chapterNotes.map(line => (
                  <p key={line} className="text-sm leading-7 text-[#70685f]">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-col px-5 py-5 sm:px-6 sm:py-6 xl:px-7 xl:py-7">
            <div className="max-w-[42rem]">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#8f877b]">{isZh ? 'Current prompt' : 'Current prompt'}</p>
              <h2 className={`mt-3 max-w-[34rem] text-[1.82rem] leading-[1] tracking-[-0.05em] text-[#221c17] sm:text-[2.12rem] ${displayClassName}`}>
                {currentScene.title}
              </h2>
              <p className="mt-3 max-w-[38rem] text-[0.96rem] leading-7 text-[#70675f]">{currentScene.intro}</p>
            </div>

            <div className="relative mt-6 min-h-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene.key}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="flex h-full flex-col"
                >
                  <div className="flex-1">{renderSceneContent()}</div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        <div className="relative border-t border-[rgba(74,63,51,0.1)] bg-[linear-gradient(90deg,rgba(240,247,244,0.88),rgba(250,245,238,0.88))] px-5 py-3.5 sm:px-7 sm:py-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="max-w-[48rem]">
              <p className="text-[10px] uppercase tracking-[0.22em] text-[#7d8797]">{isZh ? 'AI checkpoint' : 'AI checkpoint'}</p>
              <p className={`mt-2 text-[1.14rem] leading-tight text-[#201a16] ${displayClassName}`}>{checkpoint.title}</p>
              <p className="mt-1.5 text-sm leading-6 text-[#69645f]">{checkpoint.note}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <button
                type="button"
                onClick={handleSceneBack}
                className="inline-flex items-center gap-2 rounded-full border border-[rgba(74,63,51,0.1)] bg-white/78 px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#5c5a55] transition hover:-translate-y-0.5 hover:shadow-[0_18px_44px_-30px_rgba(36,24,18,0.18)]"
              >
                <ArrowLeft className="h-4 w-4" />
                {sceneIndex === 0 ? (isZh ? '返回上一步' : 'Back') : isZh ? '回到上一幕' : 'Previous scene'}
              </button>

              <div className="flex flex-col items-start xl:items-end">
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-[#8f877b]">{currentScene.hint}</p>
                <button
                  type="button"
                  onClick={handleSceneContinue}
                  disabled={!currentScene.canProceed}
                  className="inline-flex items-center gap-2 rounded-full bg-[#24201b] px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#17130f] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                >
                  {currentScene.cta}
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
