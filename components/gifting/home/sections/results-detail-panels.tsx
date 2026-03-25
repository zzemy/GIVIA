'use client'

import { motion } from 'framer-motion'
import { InfoTooltip } from '@/components/ui/info-tooltip'
import { cn } from '@/lib/utils'
import type { AnalysisResult, Locale } from '@/components/gifting/home/types'

interface RiskActionMeta {
  title: string
  tooltip: string
  panelClassName: string
  textClassName: string
}

interface ResultsDetailPanelsProps {
  analysis: AnalysisResult
  locale: Locale
  t: (path: string) => string
  riskReasons: string[]
  mustSendAdvice: string[]
  riskActionMeta: RiskActionMeta | null
}

export function ResultsDetailPanels({
  analysis,
  locale,
  t,
  riskReasons,
  mustSendAdvice,
  riskActionMeta,
}: ResultsDetailPanelsProps) {
  const isZh = locale === 'zh'

  return (
    <>
      {analysis.matchedRules.length > 0 && (
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-amber-400/20 bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold">{isZh ? '命中的文化规则' : 'Matched Cultural Rules'}</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {analysis.matchedRules.map(rule => (
              <div key={rule.id} className="rounded-xl border border-amber-300/20 bg-[#11263c]/80 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs uppercase tracking-[0.14em] text-amber-200/80">{rule.ruleType}</span>
                  <span className="rounded-full border border-amber-300/30 bg-amber-500/10 px-2 py-1 text-[11px] text-amber-100">
                    +{rule.riskScore}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-200">{rule.explanation}</p>
                {rule.suggestion && <p className="mt-2 text-xs leading-5 text-slate-400">{rule.suggestion}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-fuchsia-400/20 bg-white/5 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{isZh ? '综合风险分' : 'Risk Score'}</h3>
            <span className="rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-xs text-fuchsia-200">0-100</span>
          </div>
          <div className="mt-4 text-5xl font-bold text-fuchsia-200">{analysis.riskScore}</div>
          <div className="mt-3 h-2 rounded-full bg-slate-700/80">
            <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-rose-300" style={{ width: `${analysis.riskScore}%` }} />
          </div>
          <p className="mt-3 text-sm text-slate-300">
            {analysis.riskScore >= 72
              ? isZh
                ? '当前礼物存在明显文化误读风险，建议优先考虑替代方案。'
                : 'This gift shows significant cultural risk. Prefer a replacement option first.'
              : analysis.riskScore >= 40
                ? isZh
                  ? '存在一定文化风险，建议配合包装和表达方式降风险。'
                  : 'There is moderate cultural risk. Use packaging and wording to reduce it.'
                : isZh
                  ? '当前礼物整体较稳妥，可继续优化包装与话术。'
                  : 'The gift is relatively safe. Focus on polishing packaging and messaging.'}
          </p>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="rounded-2xl border border-cyan-500/20 bg-white/5 p-6 backdrop-blur-sm">
          <h3 className="text-xl font-bold">{isZh ? '结构化识别画像' : 'Structured gift profile'}</h3>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.giftProfile.semanticTags.length > 0 ? (
              analysis.giftProfile.semanticTags.map(tag => (
                <span key={tag} className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100">
                  {tag}
                </span>
              ))
            ) : (
              <p className="text-sm text-slate-300">{isZh ? '当前未提取到更多结构化标签。' : 'No additional structured tags were extracted.'}</p>
            )}
          </div>
          <div className="mt-4 grid gap-2 text-xs text-slate-300 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-600/50 bg-slate-800/50 px-3 py-2">{isZh ? '类别' : 'Category'}: {analysis.giftProfile.category || '-'}</div>
            <div className="rounded-lg border border-slate-600/50 bg-slate-800/50 px-3 py-2">
              {isZh ? '颜色' : 'Colors'}: {analysis.giftProfile.colors.join(isZh ? '、' : ', ') || '-'}
            </div>
            <div className="rounded-lg border border-slate-600/50 bg-slate-800/50 px-3 py-2">
              {isZh ? '材质' : 'Materials'}: {analysis.giftProfile.materials.join(isZh ? '、' : ', ') || '-'}
            </div>
            <div className="rounded-lg border border-slate-600/50 bg-slate-800/50 px-3 py-2">
              {isZh ? '风格' : 'Styles'}: {analysis.giftProfile.styles.join(isZh ? '、' : ', ') || '-'}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{t('results.culturalFit')}</h3>
              <InfoTooltip content={t('tooltip.culturalFit')} />
            </div>
          </div>
          <div className="mb-4">
            <div className="bg-gradient-to-r from-cyan-400 via-sky-400 to-cyan-300 bg-clip-text text-5xl font-bold text-transparent">
              {analysis.fitScore}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-700">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300 transition-all" style={{ width: `${analysis.fitScore}%` }} />
            </div>
          </div>
          <p className="text-sm text-gray-400">
            {analysis.fitScore >= 75
              ? isZh
                ? '优秀的文化契合度'
                : 'Excellent cultural fit'
              : analysis.fitScore >= 50
                ? isZh
                  ? '良好的文化契合度'
                  : 'Good cultural fit'
                : isZh
                  ? '需要谨慎选择'
                  : 'Needs careful consideration'}
          </p>
          <p className="mt-3 text-xs text-slate-400">
            {isZh
              ? '评分依据：谐音语义 + 象征寓意 + 色彩习俗（等权重）'
              : 'Score basis: phonetic cues + symbolic meaning + color conventions (equal weight)'}
          </p>

          <div className="mt-4 space-y-3">
            {[
              { label: isZh ? '谐音语义' : 'Phonetic', value: analysis.scoreBreakdown.phonetic },
              { label: isZh ? '象征寓意' : 'Symbolic', value: analysis.scoreBreakdown.symbol },
              { label: isZh ? '色彩习俗' : 'Color', value: analysis.scoreBreakdown.color },
            ].map(metric => (
              <div key={metric.label}>
                <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
                  <span>{metric.label}</span>
                  <span>{metric.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-slate-700/80">
                  <div className="h-full rounded-full bg-cyan-300/80" style={{ width: `${metric.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold">{t('results.riskLevel')}</h3>
              <InfoTooltip content={t('tooltip.riskLevel')} />
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-3 font-semibold ${
              analysis.riskLevel === 'Low'
                ? 'border border-green-500/50 bg-green-500/20 text-green-300'
                : analysis.riskLevel === 'Medium'
                  ? 'border border-yellow-500/50 bg-yellow-500/20 text-yellow-300'
                  : 'border border-red-500/50 bg-red-500/20 text-red-300'
            }`}
          >
            {analysis.riskLevel === 'Low' ? '✓' : analysis.riskLevel === 'Medium' ? '⚠' : '✕'}
            <span>{analysis.riskLevel === 'Low' ? t('results.low') : analysis.riskLevel === 'Medium' ? t('results.medium') : t('results.high')}</span>
          </div>

          <div className="mt-4 rounded-lg border border-slate-600/70 bg-slate-800/60 p-3">
            <p className="text-sm text-slate-200">
              {analysis.warning ||
                (isZh
                  ? '当前未返回明确风险说明，建议结合语义信号与禁忌元素谨慎判断。'
                  : 'No explicit warning was returned, so review semantic signals and taboo elements carefully.')}
            </p>
          </div>

          {analysis.isTaboo && (
            <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
              <p className="text-sm text-red-200">
                {isZh ? '⚠️ 已触发禁忌风险，不建议直接赠送原方案。' : '⚠️ Taboo-level risk detected. Direct gifting is not recommended.'}
              </p>
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-xl font-bold">
              {analysis.riskLevel === 'Low'
                ? isZh
                  ? '还需要注意什么'
                  : 'What to keep an eye on'
                : isZh
                  ? '为什么有风险'
                  : 'Why this is risky'}
            </h3>
            <InfoTooltip
              content={
                analysis.riskLevel === 'Low'
                  ? isZh
                    ? '即使整体风险较低，也会列出仍需注意的表达或包装细节。'
                    : 'Even with low overall risk, this section surfaces details still worth watching.'
                  : isZh
                    ? '这里会列出风险触发点，告诉你问题来自哪里。'
                    : 'This section lists concrete triggers behind the current risk level.'
              }
            />
          </div>

          <div className="space-y-2">
            {riskReasons.length > 0 ? (
              riskReasons.map(reason => (
                <div key={reason} className="rounded-lg border border-slate-600/70 bg-slate-800/60 px-3 py-2 text-sm text-slate-200">
                  {reason}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-300">{isZh ? '当前暂无明确风险触发点。' : 'No specific risk trigger was returned.'}</p>
            )}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-xl font-bold">{riskActionMeta?.title}</h3>
            <InfoTooltip content={riskActionMeta?.tooltip ?? ''} />
          </div>

          <div className="space-y-2">
            {mustSendAdvice.map(tip => (
              <div
                key={tip}
                className={cn(
                  'rounded-lg px-3 py-2 text-sm',
                  riskActionMeta?.panelClassName ?? 'border-cyan-500/30 bg-cyan-500/10',
                  riskActionMeta?.textClassName ?? 'text-cyan-100',
                )}
              >
                {tip}
              </div>
            ))}
          </div>

          {analysis.riskLevel !== 'Low' && (analysis.rescueItem || analysis.rescueReason) && (
            <div className="mt-4 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
              {analysis.rescueItem && (
                <p className="text-sm text-emerald-200">
                  {isZh ? '更稳妥的替代礼物：' : 'Safer replacement: '}
                  {analysis.rescueItem}
                </p>
              )}
              {analysis.rescueReason && (
                <p className="mt-1 text-xs text-emerald-100/90">
                  {isZh ? '替代理由：' : 'Why it helps: '}
                  {analysis.rescueReason}
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-xl font-bold">{t('results.packaging')}</h3>
            <InfoTooltip content={t('tooltip.packaging')} />
          </div>

          <div className="space-y-3">
            {analysis.packaging.style && (
              <div>
                <p className="mb-2 text-sm font-semibold text-cyan-300">{isZh ? '包装风格' : 'Style'}</p>
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{analysis.packaging.style}</div>
              </div>
            )}

            {analysis.packaging.colors.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-cyan-300">{t('results.colors')}</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.packaging.colors.map((color, idx) => (
                    <div key={idx} className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-3 py-1 text-sm text-cyan-200">
                      {color}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analysis.packaging.materials && (
              <div>
                <p className="mb-2 text-sm font-semibold text-cyan-300">{isZh ? '材质建议' : 'Materials'}</p>
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{analysis.packaging.materials}</div>
              </div>
            )}

            {analysis.packaging.avoid.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-semibold text-red-300">{isZh ? '避免元素' : 'Avoid'}</p>
                <div className="flex flex-wrap gap-2">
                  {analysis.packaging.avoid.map((avoidItem, idx) => (
                    <div key={idx} className="rounded-full border border-red-500/35 bg-red-500/15 px-3 py-1 text-sm text-red-200">
                      {avoidItem}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
          <div className="mb-4 flex items-center gap-2">
            <h3 className="text-xl font-bold">{t('results.greetingCard')}</h3>
            <InfoTooltip content={t('tooltip.greetingCard')} />
          </div>

          <div className="space-y-3">
            {analysis.greetingCard.tone && (
              <div>
                <p className="mb-2 text-sm font-semibold text-cyan-300">{isZh ? '语气建议' : 'Tone'}</p>
                <div className="rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-2 text-sm text-cyan-100">{analysis.greetingCard.tone}</div>
              </div>
            )}

            <div className="space-y-1 rounded-lg border border-cyan-500/30 bg-cyan-500/10 p-4">
              {analysis.greetingCard.opener && <p className="text-sm text-cyan-100">{analysis.greetingCard.opener}</p>}
              {analysis.greetingCard.body && <p className="text-sm text-cyan-100">{analysis.greetingCard.body}</p>}
              {analysis.greetingCard.closing && <p className="text-sm text-cyan-100">{analysis.greetingCard.closing}</p>}
              {!analysis.greetingCard.opener && !analysis.greetingCard.body && !analysis.greetingCard.closing && (
                <p className="text-sm text-cyan-100/80">{isZh ? '当前未返回完整贺卡文案。' : 'No full card copy was returned.'}</p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div whileHover={{ y: -4, scale: 1.01 }} className="bg-white/5 border border-cyan-500/20 rounded-2xl p-6 backdrop-blur-sm">
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-xl font-bold">{t('results.semanticSignals')}</h3>
          <InfoTooltip content={t('tooltip.semanticSignals')} />
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {analysis.semanticSignals.tags.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-cyan-300">{isZh ? '风险标签' : 'Risk tags'}</p>
              <div className="flex flex-wrap gap-2">
                {analysis.semanticSignals.tags.map((tag, idx) => (
                  <div key={idx} className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-3 py-1 text-sm text-cyan-200">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.semanticSignals.flowers.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-cyan-300">{t('results.flowers')}</p>
              <div className="flex flex-wrap gap-2">
                {analysis.semanticSignals.flowers.map((flower, idx) => (
                  <div key={idx} className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-3 py-1 text-sm text-cyan-200">
                    {flower}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.semanticSignals.numbers.length > 0 && (
            <div>
              <p className="mb-2 text-sm font-semibold text-cyan-300">{t('results.numbers')}</p>
              <div className="flex flex-wrap gap-2">
                {analysis.semanticSignals.numbers.map((num, idx) => (
                  <div key={idx} className="rounded-full border border-cyan-500/30 bg-cyan-500/20 px-3 py-1 text-sm text-cyan-200">
                    {num}
                  </div>
                ))}
              </div>
            </div>
          )}

          {analysis.semanticSignals.tags.length === 0 &&
            analysis.semanticSignals.flowers.length === 0 &&
            analysis.semanticSignals.numbers.length === 0 && (
              <p className="text-sm text-slate-300">{isZh ? '当前未返回可解析语义信号。' : 'No semantic signals were returned.'}</p>
            )}
        </div>
      </motion.div>
    </>
  )
}
