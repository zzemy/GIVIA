const fs = require('fs');
const configPath = 'app/[locale]/gifting/page.tsx';
let content = fs.readFileSync(configPath, 'utf8');

const mainStart = content.indexOf('<main className="mt-5 min-h-0 flex-1');
const mainEnd = content.indexOf('</div>\n    </div>\n  )\n}') + 6;

const newMain = `<main className="mt-5 min-h-0 flex-1 overflow-hidden rounded-[3rem] border border-[#E5E0D8]/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,242,236,0.88))] px-5 py-5 shadow-[0_36px_88px_-58px_rgba(0,0,0,0.04)] sm:px-6 sm:py-6 xl:px-7 xl:py-7">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col h-full min-h-0 gap-6 max-w-4xl mx-auto w-full pt-10">
                <div className="min-h-0 overflow-y-auto w-full">
                  <StepGiftInput {...giftInputProps} />
                  <div className="mt-8 flex justify-end w-full pb-10">
                    <button onClick={() => setCurrentStep(2)} disabled={!canAdvanceFromStep1} className="bg-indigo-600 text-white px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-3">
                      {isZh ? '下一步：配置场景' : 'Next: Configure Scene'} <ArrowRight className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col h-full min-h-0 gap-6 max-w-4xl mx-auto w-full pt-10">
                <div className="min-h-0 overflow-y-auto w-full">
                  <StepCountry {...countryProps} />
                  <div className="mt-8 flex justify-between w-full pb-10">
                    <button onClick={() => setCurrentStep(1)} className="bg-white border border-[#E5E0D8] text-[#5C5A55] px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg flex items-center gap-3">
                      <ArrowLeft className="w-5 h-5"/> {isZh ? '返回上一步' : 'Back'}
                    </button>
                    <button onClick={() => setCurrentStep(3)} disabled={!canAdvanceFromStep2} className="bg-emerald-600 text-white px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-3">
                      {isZh ? '下一步：开始判断' : 'Next: AI Judgment'} <ArrowRight className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -18 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex flex-col h-full min-h-0 gap-6 max-w-4xl mx-auto w-full pt-10">
                <div className="min-h-0 overflow-y-auto w-full">
                  {feedbackProps.error && <div className="mb-6 rounded-[1.5rem] border border-rose-200 bg-rose-50/88 px-5 py-4 text-sm text-rose-700">{feedbackProps.error}</div>}
                  <StepAnalysis {...analysisProps} />
                  <div className="mt-8 flex justify-between w-full pb-10">
                    <button onClick={() => setCurrentStep(2)} className="bg-white border border-[#E5E0D8] text-[#5C5A55] px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg flex items-center gap-3">
                      <ArrowLeft className="w-5 h-5"/> {isZh ? '返回上一步' : 'Back'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.985 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.01 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="flex h-full items-center justify-center">
                <div className="w-full max-w-[66rem] overflow-hidden rounded-[3rem] border border-[#E5E0D8]/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.95),rgba(247,242,236,0.9))] shadow-[0_36px_86px_-52px_rgba(0,0,0,0.03)]">
                  <div className="grid gap-0 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
                    <div className="relative min-h-[24rem] overflow-hidden bg-[linear-gradient(180deg,rgba(123,88,185,0.08),rgba(40,38,34,0.44)),url(https://images.pexels.com/photos/10479673/pexels-photo-10479673.jpeg?cs=srgb&dl=pexels-jonathanborba-10479673.jpg&fm=jpg)] bg-cover bg-center">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_14%,rgba(255,255,255,0.24),transparent_30%)] mix-blend-screen" />
                      <div className="relative flex h-full flex-col justify-between p-7">
                        <p className="text-[11px] uppercase tracking-[0.22em] text-white/68">{isZh ? 'Editorial composition' : 'Editorial composition'}</p>
                        <p className="max-w-[16rem] text-[1.45rem] font-serif leading-tight text-white">
                          {isZh ? '系统正在把礼物、关系与文化分寸写成一份真正可送达的终稿。' : 'The system is writing object, relationship, and tact into a dossier that can actually be delivered.'}
                        </p>
                      </div>
                    </div>

                    <div className="p-8 sm:p-10">
                      <p className={\`text-[11px] uppercase tracking-[0.2em] \${currentContent.accentTextClassName}\`}>{isZh ? '稿件生成中' : 'Dossier in progress'}</p>
                      <h2 className="mt-4 text-[2.7rem] font-serif leading-[1.04] tracking-[-0.04em] text-[#1c1a17]">
                        {isZh ? '系统正在整理文化风险、表达方式与替代方向。' : 'The system is assembling risk, expression, and better alternatives.'}
                      </h2>
                      <p className="mt-4 max-w-xl text-lg leading-9 text-[#667085]">
                        {isZh
                          ? '礼物语义、国家礼仪、关系角色与包装语气正在被交叉校准，准备输出更稳妥、更得体的送达方案。'
                          : 'Gift semantics, etiquette, relationship roles, and packaging tone are being cross-calibrated to produce a more tactful and fitting route for the gesture.'}
                      </p>
                      <div className="mt-6 grid gap-3 sm:grid-cols-3">
                        {[
                          isZh ? '礼物语义' : 'Gift semantics',
                          isZh ? '文化分寸' : 'Cultural tact',
                          isZh ? '关系语境' : 'Relationship context',
                        ].map(item => (
                          <div key={item} className="border-t border-[#E5E0D8]/80 pt-4 text-sm text-[#475467]">
                            {item}
                          </div>
                        ))}
                      </div>
                      <p className="mt-6 text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">
                        {isZh ? '终稿不是只给结论，而是给出真正可执行的改写方式。' : 'The dossier will not stop at a verdict. It will explain how to rewrite the gesture.'}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}`;

content = content.substring(0, mainStart) + newMain;

fs.writeFileSync(configPath, content);
