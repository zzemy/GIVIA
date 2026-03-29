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
      {/* 顶部控制栏 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between px-2">
        <div className="max-w-[60rem]">
          <div className="flex items-center gap-2 mb-3">
             <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse" />
             <p className="font-mono text-[10px] uppercase tracking-widest text-[#69707d]">{isZh ? '系统决策终稿生成完毕' : 'DECISION DOSSIER GENERATED'}</p>
          </div>
          <h2 className="text-[2.2rem] font-serif leading-[1.1] tracking-[-0.03em] text-[#1d1a17] md:text-[2.6rem]">
            {summaryTitle}
          </h2>
        </div>
        <Button
          onClick={onReset}
          className="rounded-full border border-black/8 bg-white/82 px-5 py-3 text-[#495161] shadow-sm transition hover:-translate-y-0.5"
        >
          <RotateCcw size={14} className="mr-2" />
          {isZh ? '新的一局' : 'New Session'}
        </Button>
      </div>

      {/* 主体报告滚动区 - 抛弃悬浮轻柔感，走向“硬核计算与数据报告”的结构 */}
      <div className="min-h-0 flex-1 overflow-y-auto rounded-[1.5rem] border border-[#e2ddd5] bg-white shadow-sm flex flex-col">
        
        {/* 输入追溯区 (Input Trace) - 让用户知道AI不是瞎编的，是基于这些条件算的 */}
        <div className="border-b border-[#e2ddd5] bg-[#faf9f7] px-6 py-5 sm:px-10 flex flex-wrap gap-x-12 gap-y-4">
           <div>
             <p className="font-mono text-[10px] uppercase tracking-wider text-[#9aa3b2] mb-1">{isZh ? '目标区域 & 对象' : 'TARGET & AUDIENCE'}</p>
             <p className="text-sm text-[#1c1a17] font-medium">{countryLabel} · {selectedAudienceLabel} · {sceneLabel}</p>
           </div>
           {giftDescription && (
             <div>
               <p className="font-mono text-[10px] uppercase tracking-wider text-[#9aa3b2] mb-1">{isZh ? '当前识别礼物' : 'DETECTED OBJECT'}</p>
               <p className="text-sm text-[#1c1a17] font-medium">{giftDescription}</p>
             </div>
           )}
           <div>
             <p className="font-mono text-[10px] uppercase tracking-wider text-[#9aa3b2] mb-1">{isZh ? '风险评级' : 'RISK LEVEL'}</p>
             <p className={\`text-sm font-bold font-mono uppercase \${analysis.riskLevel === 'High' ? 'text-red-500' : analysis.riskLevel === 'Medium' ? 'text-amber-500' : 'text-green-500'}\`}>
               {analysis.riskLevel}
             </p>
           </div>
           <div>
             <p className="font-mono text-[10px] uppercase tracking-wider text-[#9aa3b2] mb-1">{isZh ? '文化契合度' : 'FIT SCORE'}</p>
             <p className="text-sm text-[#1c1a17] font-mono font-medium">{analysis.fitScore} / 100</p>
           </div>
        </div>

        {/* 核心推理区 (AI Reasoning Engine) */}
        <div className="px-6 py-8 sm:px-10 lg:py-12 border-b border-[#e2ddd5]">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-widest text-[#1c1a17] border-b border-black pb-2 inline-block mb-6">
                {isZh ? '1. 文化冲突与拦截' : '01. CULTURAL INTERCEPTION'}
              </p>
              <p className="text-sm leading-[1.8] text-[#5f6672]">
                {summaryBody}
              </p>
              {semanticLines.length > 0 && (
                <div className="mt-6 p-4 bg-[#f4f3f0] rounded-lg border border-[#e8e5df]">
                  <p className="font-mono text-[9px] uppercase tracking-widest text-[#9aa3b2] mb-2">{isZh ? '检出语义特征' : 'EXTRACTED SEMANTICS'}</p>
                  <p className="text-xs font-mono text-[#4a505a] leading-relaxed">{semanticLines.join(' / ')}</p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#9aa3b2] mb-2">{isZh ? '触发的在地文化规则' : 'TRIGGERED LOCAL RULES'}</p>
              {analysis.matchedRules.length > 0 ? (
                analysis.matchedRules.map((rule, idx) => (
                  <div key={rule.id || idx} className="grid sm:grid-cols-[auto_1fr] gap-4 p-5 rounded-xl border border-red-500/20 bg-red-50/50">
                    <div className="flex flex-col items-center justify-center bg-white border border-red-200 rounded-lg w-12 h-12 flex-shrink-0">
                       <span className="font-mono text-red-500 font-bold">R{idx+1}</span>
                    </div>
                    <div>
                      <h5 className="text-sm font-bold text-[#1c1a17] flex items-center gap-2">
                        {rule.ruleType}
                        <span className="px-2 py-0.5 rounded uppercase font-mono text-[9px] bg-red-100 text-red-600">Matched</span>
                      </h5>
                      <p className="mt-1 text-sm text-[#4a505a] leading-relaxed">{rule.explanation}</p>
                      <p className="mt-2 text-xs font-medium text-red-800 flex gap-2">
                        <span className="opacity-50">↳</span> {rule.suggestion}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-5 rounded-xl border border-green-500/20 bg-green-50/50 flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-sm text-green-800">{isZh ? '该礼物未触发当地主要负面习俗。' : 'No major local negative customs triggered.'}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 策略修正区 (Strategy & Mitigation) */}
        <div className="px-6 py-8 sm:px-10 lg:py-12 border-b border-[#e2ddd5] bg-[#faf9f7]">
          <p className="font-mono text-[11px] uppercase tracking-widest text-[#1c1a17] border-b border-black pb-2 inline-block mb-8">
             {isZh ? '2. 表达与包装矫正' : '02. EXPRESSION & PACKAGING CORRECTION'}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="bg-white p-6 rounded-xl border border-[#e2ddd5] shadow-sm">
                <p className="font-mono text-[10px] text-[#9aa3b2] uppercase mb-4">{isZh ? '包装视觉规范' : 'PACKAGING GUIDELINES'}</p>
                <div className="flex gap-2 mb-3">
                   {analysis.packaging.colors.map(color => (
                      <span key={color} className="text-xs px-2 py-1 bg-[#1c1a17] text-white rounded font-mono">{color}</span>
                   ))}
                </div>
                <p className="text-sm text-[#5f6672] leading-relaxed">
                   {isZh ? '推荐风格：' : 'Recommended Style: '} <strong>{analysis.packaging.style}</strong>
                </p>
             </div>
             
             <div className="bg-white p-6 rounded-xl border border-[#e2ddd5] shadow-sm md:col-span-2 lg:col-span-2">
                <p className="font-mono text-[10px] text-[#9aa3b2] uppercase mb-4">{isZh ? '话术与卡片撰写 (重点)' : 'VERBAL & CARD TONE (CRITICAL)'}</p>
                <p className="text-sm font-medium text-[#1c1a17] mb-2">{isZh ? '语气基调：' : 'Tone set: '} {analysis.greetingCard.tone}</p>
                <div className="mt-4 border-l-2 border-indigo-400 pl-4 py-1">
                   <p className="text-[0.95rem] text-[#1c1a17] italic text-justify leading-relaxed">
                     "{analysis.greetingCard.opener} {analysis.greetingCard.body} {analysis.greetingCard.closing}"
                   </p>
                </div>
             </div>
          </div>
        </div>

        {/* 补充信息 / 高级图层 */}
        {(additionalLayers.length > 0 || mustSendAdvice.length > 0) && (
          <div className="px-6 py-6 sm:px-10 border-b border-[#e2ddd5] bg-white grid lg:grid-cols-2 gap-8">
            {mustSendAdvice.length > 0 && (
              <div>
                 <p className="font-mono text-[10px] text-amber-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                   ⚠️ {isZh ? '硬送降级方案 (如不可替换)' : 'FALLBACK IF UNCHANGEABLE'}
                 </p>
                 <ul className="list-disc list-inside space-y-2 pl-2 text-sm text-[#4a505a]">
                   {mustSendAdvice.map(line => <li key={line}>{line}</li>)}
                 </ul>
              </div>
            )}
            {additionalLayers.length > 0 && (
              <div>
                 <p className="font-mono text-[10px] text-[#9aa3b2] uppercase tracking-widest mb-3">
                   {isZh ? '模型补充数据源' : 'ENRICHMENT DATA LAYERS'}
                 </p>
                 <div className="space-y-3">
                   {additionalLayers.map(layer => (
                     <div key={layer.title} className="text-xs bg-[#faf9f7] p-3 rounded border border-[#e8e5df]">
                       <span className="font-bold text-[#1c1a17] mr-2">{layer.title}:</span>
                       <span className="text-[#5f6672]">{layer.body}</span>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </div>
        )}

        {/* 智能重排替代方案 (AI Calibrated Alternatives) */}
        {analysis.recommendations.length > 0 && (
          <div className="px-6 py-10 sm:px-10 lg:py-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-[#1c1a17] border-b border-black pb-2 inline-block mb-3">
                  {isZh ? '3. 经过模型重排的替代选项' : '03. MODEL-CALIBRATED ALTERNATIVES'}
                </p>
                <p className="text-sm text-[#69707d] max-w-2xl mt-4">
                  {isZh 
                    ? '以下推荐已脱离宽泛商品库，通过[深度协同过滤]和[文化分寸校准]重新打分排序。它们在此语境下的安全度或惊喜感远超原定计划。' 
                    : 'These options are re-ranked via deep collaborative filtering and cultural tact analysis. They offer significantly higher safety or delight in this specific context.'}
                </p>
              </div>
            </div>

            <div className="grid gap-4">
              {analysis.recommendations.map((rec, i) => {
                 const isFav = favoriteRecommendationIds.includes(rec.id)
                 return (
                   <div key={rec.id} className={\`relative grid lg:grid-cols-[1fr_2fr_5fr_auto] gap-6 p-5 sm:p-6 rounded-2xl border transition-all duration-300 \${isFav ? 'border-indigo-500 bg-indigo-50/30' : 'border-[#e2ddd5] bg-white hover:border-black/30 hover:shadow-md'}\`}>
                     
                     {/* Rank Score */}
                     <div className="flex flex-col justify-center items-start lg:border-r border-[#e2ddd5] pr-4">
                        <span className="font-mono text-[10px] text-[#9aa3b2] mb-1">{isZh ? '推荐序位' : 'RANK'}</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-serif text-[#1c1a17]">#{i + 1}</span>
                        </div>
                     </div>

                     {/* Info */}
                     <div className="flex flex-col justify-center">
                        <span className="font-mono text-[9px] uppercase tracking-wider text-indigo-500 mb-1">{isZh ? rec.categoryZh : rec.category}</span>
                        <h4 className="text-[1.1rem] font-bold text-[#1c1a17]">{isZh ? rec.nameZh : rec.nameEn}</h4>
                     </div>

                     {/* AI Reason */}
                     <div className="flex flex-col justify-center text-sm leading-relaxed text-[#4a505a]">
                        <p><strong>{isZh ? '推荐理由：' : 'Reason: '}</strong> {isZh ? rec.reasonZh : rec.reasonEn}</p>
                        <p className="mt-2 text-indigo-700/80 text-xs">
                          <span className="font-mono font-semibold uppercase text-indigo-600 mr-2">[AI TACT]</span>
                          {isZh ? rec.tactZh : rec.tactEn}
                        </p>
                     </div>

                     {/* Action */}
                     <div className="flex items-center justify-end">
                        <Button
                          variant="ghost"
                          onClick={() => onToggleFavoriteRecommendation(rec.id)}
                          className={\`font-mono text-xs h-10 px-4 rounded-xl transition-colors \${isFav ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-[#f4f3f0] text-[#1c1a17] hover:bg-black hover:text-white'}\`}
                        >
                          {isFav ? (isZh ? '已存入' : 'SAVED') : (isZh ? '+ 存入提案' : '+ SAVE')}
                        </Button>
                     </div>

                   </div>
                 )
              })}
            </div>
          </div>
        )}

      </div>
    </motion.section>
  )
}
`;

fs.writeFileSync(file, headerVars + newRender, 'utf8');
console.log('Trust computational UI injected via node.');
