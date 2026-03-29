import type { AudienceGroup } from '@/components/gifting/home/types'

export type SceneKey = 'destination' | 'relation' | 'profile' | 'tact' | 'summary'

export const relationDefaults: Record<AudienceGroup, string> = {
  peer: 'friend',
  client: 'partner',
  leader: 'mentor',
  family: 'family',
  elder: 'family',
  other: 'friend',
}

export const stagePhotography: Record<SceneKey, { src: string; position: string }> = {
  destination: {
    src: '/editorial/destination.jpg?v=2',
    position: 'center center',
  },
  relation: {
    src: '/editorial/relation.jpg?v=2',
    position: 'center center',
  },
  profile: {
    src: '/editorial/profile.jpg?v=2',
    position: 'center center',
  },
  tact: {
    src: '/editorial/tact.jpg?v=2',
    position: 'center center',
  },
  summary: {
    src: '/editorial/summary.jpg?v=2',
    position: 'center center',
  },
}

export function buildCheckpoint({
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
      title: isZh ? '先把礼物将落入的文化语境写定。' : 'Write the cultural destination first.',
      note: isZh ? '国家一旦确定，这一页的人物语气就会立刻收紧，不再像空白模板。' : 'Once the country is fixed, the tone stops feeling generic and starts reading like a real page.',
    }
  }

  if (targetGroup === 'other' && !customAudienceGroup.trim()) {
    return {
      title: isZh ? '这段关系还差你自己的命名。' : 'This relationship still needs your own wording.',
      note: isZh ? '只要补上一句更准确的称呼，人物距离感就会稳定下来。' : 'One precise label from you will stabilize the relational distance immediately.',
    }
  }

  if (!targetProfile.trim()) {
    return {
      title: isZh ? '人物已经站住，只差一句私人的暗线。' : 'The person is standing now, with one private line still missing.',
      note: isZh ? '如果你愿意补一句只有你知道的话，AI 的判断会更像“认识他”，而不是“猜他”。' : 'If you add one private detail, the AI can write with recognition instead of approximation.',
    }
  }

  if (budgetRange === 'high') {
    return {
      title: isZh ? '这份礼物已经开始带重量。' : 'The gift is beginning to carry weight.',
      note: isZh ? '进入 Step 3 后，重点会变成它该如何抵达，才不会压过关系本身。' : 'In Step 3, the question becomes how this gesture should arrive without outweighing the relationship itself.',
    }
  }

  return {
    title: isZh ? '这一页人物已经可以确认。' : 'This recipient page is ready to confirm.',
    note: isZh ? '下一步不再补字段，而是把这些线索交给 AI 去判断排场与送达方式。' : 'The next step no longer adds fields. It hands the signals to the AI for staging and delivery judgment.',
  }
}

export function buildSummaryParagraphs({
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
  const relationText = targetGroup === 'other' && customAudienceGroup.trim() ? customAudienceGroup.trim() : selectedAudienceLabel

  if (isZh) {
    return [
      countryName
        ? `我会先把这份礼物理解为：它将进入 ${countryName} 的接收语境，因此后续判断都要先经过当地礼数与阅读习惯。`
        : '国家还没有写定，所以这页人物只能先停留在一版预演稿里。',
      `收礼人这一侧，我会先把他写成与你属于 ${relationText} 的人，轮廓更接近 ${ageBandLabel}、${occupationLabel}。`,
      `进入关系时，礼物的力道暂时收在 ${budgetLabel} 与 ${formalityLabel} 之间，既不过分轻浮，也不过分压人。`,
      targetProfile.trim()
        ? `真正让这页变得具体的，是你补进来的那句暗线：${targetProfile.trim()}`
        : '你还没有补那句只属于你们之间的暗线，所以 AI 会先保留一版较克制的人物判断。',
    ]
  }

  return [
    countryName
      ? `I will frame this gift as something entering the reception culture of ${countryName}, so every later judgment passes through that etiquette first.`
      : 'The country is still unwritten, so this page remains a provisional rehearsal.',
    `On the recipient side, I will draft this person as someone closer to ${relationText}, with a silhouette nearer to ${ageBandLabel} and ${occupationLabel}.`,
    `For the gesture itself, the register currently stays between ${budgetLabel} and ${formalityLabel}, neither too light nor overly weighted.`,
    targetProfile.trim()
      ? `What makes the page specific is the private line you added: ${targetProfile.trim()}`
      : 'Because no private line was added yet, the AI keeps the current reading deliberately restrained.',
  ]
}

export function getInitialSceneIndex({
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

export function getUnlockedSceneIndex({
  selectedCountry,
  targetGroup,
  customAudienceGroup,
  canContinue,
  devPreview,
}: {
  selectedCountry: string
  targetGroup: AudienceGroup
  customAudienceGroup: string
  canContinue: boolean
  devPreview: boolean
}) {
  if (devPreview || canContinue) {
    return 4
  }

  const relationReady = targetGroup !== 'other' || customAudienceGroup.trim().length > 0

  if (selectedCountry && relationReady) {
    return 3
  }

  if (selectedCountry) {
    return 1
  }

  return 0
}
