'use client'

import { Brain, Globe2, ShieldCheck, ShoppingBag, Zap } from 'lucide-react'
import type { ReactNode } from 'react'

export interface ImpactCard {
  id: string
  icon: ReactNode
  badge: string
  title: string
  desc: string
  metric: string
  chips: string[]
  skin: string
  glow: string
}

export function getImpactCards(isZh: boolean): ImpactCard[] {
  return isZh
    ? [
        {
          id: 'risk-first',
          icon: <ShieldCheck size={18} />,
          badge: 'RISK INTELLIGENCE',
          title: '先看风险再出手',
          desc: '把高敏感语义、颜色禁忌、数字禁忌做成可视化层叠洞察，第一眼就知道哪里会踩雷。',
          metric: '128+ 风险语义样本',
          chips: ['颜色禁忌', '语义联想', '数字避雷'],
          skin: 'from-[#19344f] via-[#153149] to-[#10263e]',
          glow: 'from-cyan-300/45 via-sky-300/20 to-transparent',
        },
        {
          id: 'audience-tuned',
          icon: <Brain size={18} />,
          badge: 'CONTEXT ENGINE',
          title: '面向真实收礼人画像',
          desc: '同样是礼物，给客户、同事、长辈的语气和包装逻辑完全不同，系统会按对象重排建议优先级。',
          metric: '3 层画像上下文联动',
          chips: ['对象语气', '场景正式度', '预算层级'],
          skin: 'from-[#1d2f53] via-[#1b2b4a] to-[#15223d]',
          glow: 'from-emerald-300/40 via-cyan-300/15 to-transparent',
        },
        {
          id: 'delivery-ready',
          icon: <ShoppingBag size={18} />,
          badge: 'DELIVERY READY',
          title: '建议可直接落地交付',
          desc: '不是抽象建议，而是可执行的包装色、材质、贺卡语句组合，拿到就能直接用在实际赠礼流程。',
          metric: '1 次输出覆盖全流程',
          chips: ['包装方向', '贺卡文案', '替代方案'],
          skin: 'from-[#202f57] via-[#1a2f4e] to-[#132842]',
          glow: 'from-amber-300/40 via-cyan-300/18 to-transparent',
        },
        {
          id: 'execution-timing',
          icon: <Zap size={18} />,
          badge: 'EXECUTION TIMING',
          title: '时机与表达同样关键',
          desc: '同一礼物在不同节日、不同商务阶段的体感差异很大，建议会同步给出更稳妥的送礼窗口与表达方式。',
          metric: '节日与场景双维建议',
          chips: ['送礼时机', '表达分寸', '场景匹配'],
          skin: 'from-[#1f345d] via-[#1c2f53] to-[#152744]',
          glow: 'from-sky-300/35 via-cyan-300/16 to-transparent',
        },
        {
          id: 'global-tone',
          icon: <Globe2 size={18} />,
          badge: 'GLOBAL EXPRESSION',
          title: '跨文化表达有温度',
          desc: '在尊重本地文化边界的前提下，保留品牌风格，让“专业感”和“人情味”同时在线。',
          metric: '5 大区域文化语境',
          chips: ['品牌一致性', '本地化表达', '文化边界'],
          skin: 'from-[#24335d] via-[#1b3553] to-[#152a46]',
          glow: 'from-violet-300/35 via-cyan-300/14 to-transparent',
        },
      ]
    : [
        {
          id: 'risk-first',
          icon: <ShieldCheck size={18} />,
          badge: 'RISK INTELLIGENCE',
          title: 'See risk before you send',
          desc: 'Surface semantic, color, and number sensitivities as layered visual signals so risky choices stand out instantly.',
          metric: '128+ semantic risk patterns',
          chips: ['Color taboo', 'Semantic cues', 'Number risk'],
          skin: 'from-[#19344f] via-[#153149] to-[#10263e]',
          glow: 'from-cyan-300/45 via-sky-300/20 to-transparent',
        },
        {
          id: 'audience-tuned',
          icon: <Brain size={18} />,
          badge: 'CONTEXT ENGINE',
          title: 'Tune to real recipient context',
          desc: 'Client, colleague, or family requires different tone and packaging logic. The system reprioritizes recommendations by profile.',
          metric: '3-layer audience context',
          chips: ['Tone strategy', 'Formality level', 'Budget tier'],
          skin: 'from-[#1d2f53] via-[#1b2b4a] to-[#15223d]',
          glow: 'from-emerald-300/40 via-cyan-300/15 to-transparent',
        },
        {
          id: 'delivery-ready',
          icon: <ShoppingBag size={18} />,
          badge: 'DELIVERY READY',
          title: 'Advice that ships immediately',
          desc: 'Outputs are execution-ready combinations of packaging palette, material direction, and card wording for real delivery workflows.',
          metric: 'One output, full workflow',
          chips: ['Packaging direction', 'Card copy', 'Rescue option'],
          skin: 'from-[#202f57] via-[#1a2f4e] to-[#132842]',
          glow: 'from-amber-300/40 via-cyan-300/18 to-transparent',
        },
        {
          id: 'execution-timing',
          icon: <Zap size={18} />,
          badge: 'EXECUTION TIMING',
          title: 'Timing matters as much as the gift',
          desc: 'The same item can land very differently by occasion or relationship stage, so guidance includes safer timing and delivery tone.',
          metric: 'Holiday + context timing guide',
          chips: ['Send timing', 'Delivery tone', 'Occasion fit'],
          skin: 'from-[#1f345d] via-[#1c2f53] to-[#152744]',
          glow: 'from-sky-300/35 via-cyan-300/16 to-transparent',
        },
        {
          id: 'global-tone',
          icon: <Globe2 size={18} />,
          badge: 'GLOBAL EXPRESSION',
          title: 'Premium tone across cultures',
          desc: 'Keep brand consistency while adapting to local cultural boundaries so professional intent still feels warm and human.',
          metric: '5 regional cultural contexts',
          chips: ['Brand consistency', 'Local expression', 'Cultural boundary'],
          skin: 'from-[#24335d] via-[#1b3553] to-[#152a46]',
          glow: 'from-violet-300/35 via-cyan-300/14 to-transparent',
        },
      ]
}
