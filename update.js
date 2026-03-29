const fs = require('fs');

const file = 'components/gifting/home/sections/results-section.tsx';
const content = fs.readFileSync(file, 'utf8');

const returnIndex = content.indexOf('  return (\n    <motion.section');
if (returnIndex === -1) {
  console.error("Could not find return statement");
  process.exit(1);
}

const headerVars = content.substring(0, returnIndex);

const newRender = `  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="flex min-h-0 flex-1 flex-col gap-6 overflow-hidden"
    >
      {/* 顶部标题区 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between px-2">
        <div className="max-w-[60rem]">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#9aa3b2]">{isZh ? 'AI 礼赠终稿' : 'AI gifting dossier'}</p>
          <h2 className="mt-3 text-[3rem] font-serif leading-[1.01] tracking-[-0.055em] text-[#1d1a17] md:text-[3.4rem]">
            {isZh
              ? '这里呈现的不是判断面板，而是一份关于这份心意该如何被重新写作的终稿。'
              : 'What appears here is not a judgment panel, but a final authored dossier on how the gesture should be rewritten.'}
          </h2>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-[#1c1a17]">{countryLabel}</span>
            <span className="text-black/20">/</span>
            <span className="text-sm tracking-wide text-[#69707d]">{selectedAudienceLabel}</span>
            <span className="text-black/20">/</span>
            <span className="text-sm tracking-wide text-[#69707d]">{sceneLabel}</span>
          </div>
        </div>

        <Button
          onClick={onReset}
          className="rounded-full border border-black/8 bg-white/82 px-5 py-3 text-[#495161] shadow-[0_16px_32px_-24px_rgba(15,23,42,0.14)] transition duration-500 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_24px_44px_-26px_rgba(15,23,42,0.18)]"
        >
          <RotateCcw size={16} />
          {isZh ? '开启下一份终稿' : 'Open a new dossier'}
        </Button>
      </div>

      {/* 主体滚动区 - 去掉外层的厚重圆角卡片，采用更干净直白的背景切割 */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-[2rem] border border-[#d6d1c9]/40 bg-[#fbfaf8] shadow-inner">
        {/* Head Image & Summary */}
        <section
          className="relative min-h-[36rem] flex flex-col justify-end"
          style={{
            backgroundImage: \`linear-gradient(180deg,rgba(18,15,13,0.1),rgba(18,15,13,0.88)),url(\${reportPhotography.lead})\`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(255,255,255,0.24),transparent_28%)] mix-blend-screen" />
          <div className="relative px-8 py-14 sm:px-12 xl:px-16 xl:py-16 text-white max-w-[56rem]">
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                {analysisSource === 'hybrid-ai-rules' ? (isZh ? 'AI 文化共读' : 'AI cultural reading') : isZh ? 'AI 在地判断' : 'AI local reading'}
              </span>
              {riskActionMeta && (
                <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.16em] text-white/90 backdrop-blur-md">
                  {riskActionMeta.title}
                </span>
              )}
            </div>

            <h3 className="text-[3.2rem] font-serif leading-[1.05] tracking-[-0.04em] text-white md:text-[4rem]">
              {summaryTitle}
            </h3>
            <p className="mt-8 max-w-[42rem] text-[1.1rem] leading-[1.8] text-white/80 font-light">{summaryBody}</p>
            <p className="mt-10 text-[11px] uppercase tracking-[0.24em] text-white/50">
              {isZh ? '这份终稿首先关心关系修辞、文化分寸与最后的送达方式。' : 'This dossier is guided first by relational language, cultural tact, and the final mode of arrival.'}
            </p>
          </div>
        </section>

        {/* Info Grid Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-[#e2ddd5] bg-white text-[#1c1a17]">
          {conclusionCards.map((card, i) => (
            <div key={card.label} className={\`p-6 sm:p-8 \${i !== 0 ? 'border-l border-[#e2ddd5]' : ''} \${i === 2 ? 'border-t md:border-t-0 border-[#e2ddd5]' : ''} \${i === 3 ? 'border-t md:border-t-0 border-[#e2ddd5]' : ''}\`}>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#98a2b3]">{card.label}</p>
              <p className="mt-3 text-[1.5rem] font-serif leading-none text-[#1d1a17]">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Editorial Content Layout */}
        <div className="px-8 py-16 sm:px-12 xl:px-16 xl:py-24">
          <div className="grid gap-16 xl:grid-cols-[1fr_2.5fr]">
            {/* Left Header */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? 'The Reading' : 'The Reading'}</p>
              <h4 className="mt-4 text-[2.2rem] font-serif leading-[1.08] tracking-[-0.03em] text-[#1c1a17] pr-4">
                {isZh ? '拆解与校准' : 'Deconstruction'}
              </h4>
            </div>

            {/* Right Flowing Text Content */}
            <div className="grid gap-12 sm:grid-cols-2 lg:gap-16">
              {/* Context Block */}
              <div>
                <p className="font-serif text-[1.4rem] leading-tight text-[#1c1a17]">{isZh ? '语境纪要' : 'Context memorandum'}</p>
                <div className="mt-6 space-y-5">
                  <p className="text-[0.95rem] leading-8 text-[#5f6672]">
                    {contextParagraph || (isZh ? '在此判断中，系统主要依据礼物本身及其可能触及的基础关系语境做出连结。' : 'No further background was provided, leaning mainly on the object itself.')}
                  </p>
                  {semanticLines.length > 0 && (
                    <div className="pt-4 space-y-2 border-t border-[#e2ddd5]">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-[#a1a8b6]">{isZh ? '语义线索' : 'Semantic signals'}</p>
                      <p className="text-[0.95rem] leading-[1.6] text-[#5f6672]">{semanticLines.join(' · ')}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Reasoning Block */}
              <div>
                <p className="font-serif text-[1.4rem] leading-tight text-[#1c1a17]">{isZh ? '结论推导' : 'Reasoning'}</p>
                <div className="mt-6 space-y-5 text-[0.95rem] leading-8 text-[#5f6672]">
                  {memoLines.map(line => (
                    <p key={line} className="border-b border-[#e2ddd5] pb-5 last:border-0 last:pb-0">{line}</p>
                  ))}
                </div>
                {analysis.matchedRules.length > 0 && (
                  <div className="mt-6 pt-5 space-y-3">
                    {analysis.matchedRules.slice(0, 3).map(rule => (
                      <div key={rule.id} className="text-[0.95rem] leading-7 text-[#878d96] flex gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1d1a17]/20 mt-2.5 flex-shrink-0" />
                        <span><strong className="font-medium text-[#1d1a17] font-serif pr-2">{rule.ruleType}</strong>{rule.suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* The Pivot & Rewrite Instruction - Feature Image Flow */}
        <section className="border-y border-[#e2ddd5] bg-white">
          <div className="grid lg:grid-cols-2 min-h-[40rem]">
             <div 
               className="h-full min-h-[24rem] bg-cover bg-center border-b lg:border-b-0 lg:border-r border-[#e2ddd5]"
               style={{
                 backgroundImage: \`linear-gradient(180deg,rgba(18,15,13,0),rgba(18,15,13,0.05)),url(\${reportPhotography.note})\`,
               }}
             />
             <div className="flex flex-col justify-center px-8 py-16 sm:px-12 xl:px-16">
                <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{isZh ? 'Direction' : 'Direction'}</p>
                <h3 className="mt-6 text-[2.6rem] font-serif leading-[1.06] tracking-[-0.04em] text-[#1c1a17]">
                  {openingRecommendation}
                </h3>
                <p className="mt-6 text-[1.05rem] leading-[1.8] text-[#5f6672]">
                  {openingRecommendationReason}
                </p>

                <div className="mt-12 pt-10 border-t border-[#e2ddd5] grid gap-8 sm:grid-cols-2">
                  <div>
                    <h5 className="font-serif text-[1.2rem] text-[#1c1a17]">{isZh ? '包装方向' : 'Packaging'}</h5>
                    <p className="mt-3 text-[0.95rem] leading-[1.7] text-[#69707d]">
                       {topRecommendation ? (isZh ? topRecommendation.packagingTipZh : topRecommendation.packagingTipEn) : analysis.packaging.colors.join(', ')}
                    </p>
                  </div>
                  <div>
                     <h5 className="font-serif text-[1.2rem] text-[#1c1a17]">{isZh ? '送达提醒' : 'Delivery'}</h5>
                     <p className="mt-3 text-[0.95rem] leading-[1.7] text-[#69707d]">
                       {topRecommendation ? (isZh ? topRecommendation.shippingNoteZh : topRecommendation.shippingNoteEn) : summaryBody}
                     </p>
                  </div>
                  <div className="sm:col-span-2">
                     <h5 className="font-serif text-[1.2rem] text-[#1c1a17]">{isZh ? '卡片语气' : 'Card tone'}</h5>
                     <p className="mt-3 text-[0.95rem] leading-[1.7] text-[#69707d] italic border-l-2 border-[#1c1a17] pl-4">
                       "{analysis.greetingCard.opener} {analysis.greetingCard.body} {analysis.greetingCard.closing}"
                     </p>
                  </div>
                </div>
             </div>
          </div>
        </section>

        {/* If Must Send Section */}
        {mustSendAdvice.length > 0 && (
          <section className="relative px-8 py-20 sm:px-12 xl:px-16 bg-[#fbfaf8] flex flex-col items-center justify-center min-h-[30rem] border-b border-[#e2ddd5]"
            style={{
               backgroundImage: \`linear-gradient(180deg,rgba(251,250,248,0.85),rgba(251,250,248,0.95)),url(\${reportPhotography.arrival})\`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
            }}
          >
            <div className="max-w-[42rem] text-center relative z-10">
              <p className="text-[11px] uppercase tracking-[0.22em] text-[#9aa3b2]">{isZh ? 'Last Resort' : 'Last Resort'}</p>
              <h3 className="mt-6 text-[2.6rem] font-serif leading-[1.1] tracking-[-0.03em] text-[#1c1a17]">
                 {isZh ? '如果这件礼物实在无法更换，请务必关注送达方式。' : 'If the object cannot be changed, rewrite the delivery together.'}
              </h3>
              <div className="mt-10 space-y-6 text-left relative before:absolute before:left-0 before:top-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-[#1c1a17]/20 before:to-transparent pl-8 ml-4">
                {adviceLines.map(line => (
                   <p key={line} className="text-[1.05rem] leading-8 text-[#4a505a]">{line}</p>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Alternative Recommendations Grid */}
        {analysis.recommendations.length > 0 && (
          <section className="px-8 py-20 sm:px-12 xl:px-16 xl:py-24 bg-white">
            <div className="max-w-[48rem]">
              <h3 className="text-[2.6rem] font-serif leading-[1.03] tracking-[-0.04em] text-[#1c1a17]">
                {isZh ? '如果要把这份心意改写得更克制、更高级、更妥帖。' : 'If the gesture were to be rewritten with greater restraint, tact, and elegance.'}
              </h3>
              <p className="mt-6 text-[1.1rem] leading-[1.7] text-[#69707d]">
                {isZh ? '下面这些方向不是简单的商品候选，而是更适合被写进这段关系的送达方式。' : 'These are not simple alternatives, but more fitting modes of arrival for this relationship.'}
              </p>
            </div>

            <div className="mt-16 border-t border-[#1c1a17]">
              {analysis.recommendations.map((rec, i) => {
                 const isFav = favoriteRecommendationIds.includes(rec.id)
                 return (
                   <div key={rec.id} className="group grid gap-6 xl:gap-12 xl:grid-cols-[1fr_2.5fr_1fr] py-10 border-b border-[#e2ddd5] hover:bg-[#faf9f7] transition-colors -mx-4 px-4 sm:-mx-8 sm:px-8">
                     <div className="flex flex-col justify-between items-start">
                        <span className="text-[11px] uppercase tracking-[0.16em] text-[#a1a8b6] mb-8 block">
                          0{i + 1}
                        </span>
                        <div className="w-full">
                           <p className="text-[0.65rem] uppercase tracking-[0.2em] text-[#9aa3b2]">{isZh ? rec.categoryZh : rec.category}</p>
                           <h4 className="mt-3 text-[1.75rem] font-serif leading-tight text-[#1c1a17] group-hover:text-black transition-colors">{isZh ? rec.nameZh : rec.nameEn}</h4>
                        </div>
                     </div>
                     <div className="flex flex-col justify-center max-w-[34rem]">
                        <p className="text-[1.05rem] leading-[1.7] text-[#1c1a17]">{isZh ? rec.reasonZh : rec.reasonEn}</p>
                        <p className="mt-4 text-[0.95rem] leading-[1.6] text-[#69707d]">{isZh ? rec.tactZh : rec.tactEn}</p>
                     </div>
                     <div className="flex items-end justify-end">
                        <Button
                          variant="ghost"
                          onClick={() => onToggleFavoriteRecommendation(rec.id)}
                          className={\`rounded-full border px-6 h-12 text-[0.8rem] tracking-widest transition-all \${isFav ? 'border-[#1c1a17] bg-[#1c1a17] text-white' : 'border-[#e2ddd5] bg-transparent text-[#1c1a17] hover:border-[#1c1a17]'}\`}
                        >
                          {isFav ? (isZh ? '已归档' : 'Archived') : (isZh ? '归档' : 'Archive')}
                        </Button>
                     </div>
                   </div>
                 )
              })}
            </div>
          </section>
        )}

        {/* Additional Technical Layers */}
        {additionalLayers.length > 0 && (
          <section className="px-8 py-16 sm:px-12 xl:px-16 border-t border-[#e2ddd5] bg-[#fdfdfc]">
             <p className="text-[11px] uppercase tracking-[0.24em] text-[#9aa3b2] mb-10">{isZh ? '附加图层' : 'Additional Layers'}</p>
             <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
               {additionalLayers.map(layer => (
                 <div key={layer.title} className="pr-4">
                   <h5 className="font-serif text-[1.3rem] text-[#1c1a17] mb-4">{layer.title}</h5>
                   <p className="text-[0.92rem] leading-[1.7] text-[#69707d]">{layer.body}</p>
                 </div>
               ))}
             </div>
          </section>
        )}
      </div>
    </motion.section>
  )
}
`;

fs.writeFileSync(file, headerVars + newRender, 'utf8');
console.log('Done rewrititng');
