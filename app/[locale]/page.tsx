'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'

type EditorialFrame = {
  eyebrow: string
  title: string
  copy: string
  image: string
  align?: 'top' | 'bottom'
}

export default function Home() {
  const params = useParams<{ locale?: string }>()
  const router = useRouter()
  const isZh = params?.locale !== 'en'
  const locale = isZh ? 'zh' : 'en'

  const photographyFrames: EditorialFrame[] = [
    {
      eyebrow: isZh ? 'Relationship first' : 'Relationship first',
      title: isZh ? '先判断这份礼物是否适合这段关系。' : 'Decide whether the gift suits the relationship before you send it.',
      copy: isZh ? '不同亲疏、身份与场合，需要完全不同的表达分寸。' : 'Different distances, roles, and occasions require very different levels of tact.',
      image:
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=80',
      align: 'bottom',
    },
    {
      eyebrow: isZh ? 'Cultural reading' : 'Cultural reading',
      title: isZh ? '提前识别可能的误读、禁忌与文化摩擦。' : 'Spot possible misreadings, taboos, and cultural friction early.',
      copy: isZh ? '让礼物进入真实文化语境，而不是停留在自己的想象里。' : 'Place the gift inside a real cultural context instead of your own assumptions.',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      align: 'top',
    },
    {
      eyebrow: isZh ? 'Better delivery' : 'Better delivery',
      title: isZh ? '最后给你的，不只是结论，而是更稳妥的送达方式。' : 'What you receive is not only a verdict, but a safer way to deliver the gesture.',
      copy: isZh ? '包括替代建议、包装方向与表达语气，让心意落地得更自然。' : 'Including alternatives, packaging direction, and message tone so the gesture lands more naturally.',
      image:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
      align: 'bottom',
    },
  ]

  const editorialValues = [
    {
      label: isZh ? '你会得到' : 'What you get',
      value: isZh ? '一份更得体的礼赠判断' : 'A more tactful gifting judgment',
    },
    {
      label: isZh ? '它会帮你避免' : 'What it helps you avoid',
      value: isZh ? '文化误读、关系失分与表达失准' : 'Cultural misreading, social awkwardness, and the wrong tone',
    },
    {
      label: isZh ? '最后交付' : 'Final output',
      value: isZh ? '可执行的礼赠建议、替代方向与表达方式' : 'Actionable recommendations, alternatives, and better wording',
    },
  ]

  const editorialBullets = isZh
    ? ['判断这份礼物在目标国家是否得体', '识别潜在禁忌与文化摩擦', '给出更稳妥的替代方案与表达建议']
    : ['Judge whether the gift feels appropriate in the target culture', 'Identify likely taboos and cultural friction', 'Offer safer alternatives and better wording']

  return (
    <div className={`home-editorial-shell relative min-h-screen overflow-hidden ${isZh ? 'font-sans-zh' : ''}`}>
      <div className="pointer-events-none absolute inset-0">
        <HomeBackground />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1440px] flex-col px-6 pb-10 pt-6 sm:px-8 lg:px-12">
        <header className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <span className="text-[2.2rem] font-serif font-semibold tracking-[-0.07em] text-[#231f1a]">Givia</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#566fd1]" />
            <span className="hidden text-[11px] uppercase tracking-[0.28em] text-[#98a2b3] md:inline-block">
              {isZh ? 'Editorial gifting intelligence' : 'Editorial gifting intelligence'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => router.push(`/${isZh ? 'en' : 'zh'}`)}
              className="rounded-full border border-black/6 bg-white/56 px-4 py-2 text-sm uppercase tracking-[0.18em] text-[#7e8593] transition hover:bg-white/80 hover:text-[#1f2d3d]"
            >
              {isZh ? 'EN' : '中文'}
            </button>
            <button
              type="button"
              onClick={() => router.push(`/${locale}/gifting`)}
              className="rounded-full bg-[#191814] px-6 py-3 text-sm font-medium text-white shadow-[0_18px_40px_-24px_rgba(0,0,0,0.42)] transition hover:-translate-y-0.5 hover:bg-[#24221e]"
            >
              {isZh ? '进入体验' : 'Enter the experience'}
            </button>
          </div>
        </header>

        <main className="flex flex-1 items-center py-8 lg:py-12">
          <div className="grid w-full gap-10 lg:grid-cols-[minmax(0,0.86fr)_minmax(0,1.14fr)] lg:gap-12">
            <motion.section
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col justify-between"
            >
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#6d82d8]/14 bg-white/68 px-4 py-2 text-sm text-[#566fd1] shadow-[0_12px_30px_-26px_rgba(86,111,209,0.52)] backdrop-blur-xl">
                  <Sparkles className="h-4 w-4" />
                  {isZh ? '帮你把礼物送对，而不只是送出去' : 'Help the gift arrive well, not merely arrive'}
                </div>

                <h1
                  className={`mt-8 max-w-[11ch] text-[4rem] leading-[0.9] tracking-[-0.075em] text-[#1d1915] sm:text-[5rem] xl:text-[6.4rem] ${
                    isZh ? 'font-display-zh font-semibold' : 'font-serif font-semibold'
                  }`}
                >
                  {isZh ? (
                    <>
                      <span className="block">先判断这份礼物</span>
                      <span className="block text-[#566fd1]">该不该送，</span>
                      <span className="block">再决定如何</span>
                      <span className="block">把心意送好。</span>
                    </>
                  ) : (
                    <>
                      <span className="block">Know whether the gift</span>
                      <span className="block text-[#566fd1]">should be sent,</span>
                      <span className="block">before deciding</span>
                      <span className="block">how to send it well.</span>
                    </>
                  )}
                </h1>

                <p className="mt-8 max-w-[34rem] text-lg font-light leading-9 text-[#69707d]">
                  {isZh
                    ? 'Givia 帮你在送出之前先看清三件事：这份礼物在目标国家会不会被误读、它是否适合这段关系、以及怎样表达会更得体。'
                    : 'Givia helps you see three things before you send anything: whether the gift may be misread, whether it fits the relationship, and how to express it with better tact.'}
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/gifting`)}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5b72d1] via-[#4e63bb] to-[#4455a6] px-8 py-4 text-base font-medium text-white shadow-[0_22px_44px_-24px_rgba(91,114,209,0.56)] transition hover:-translate-y-1"
                  >
                    {isZh ? '开始判断这份礼物' : 'Evaluate this gift now'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <div className="rounded-full border border-black/6 bg-white/54 px-5 py-3 text-sm text-[#69707d] backdrop-blur-xl">
                    {isZh ? '物件 → 语境 → 判断 → 提案' : 'Object → Context → Judgment → Proposal'}
                  </div>
                </div>
              </div>

              <div className="mt-12 grid gap-3 sm:grid-cols-3">
                {editorialValues.map(item => (
                  <div
                    key={item.label}
                    className="rounded-[1.65rem] border border-white/80 bg-white/58 px-5 py-5 shadow-[0_18px_38px_-28px_rgba(15,23,42,0.18)] backdrop-blur-xl"
                  >
                    <p className="text-[11px] uppercase tracking-[0.22em] text-[#98a2b3]">{item.label}</p>
                    <p className="mt-3 text-sm leading-7 text-[#31343c]">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <div className="absolute -left-10 top-10 hidden h-48 w-48 rounded-full bg-[#dfe7fe] blur-3xl lg:block" />
              <div className="absolute -right-6 bottom-14 hidden h-56 w-56 rounded-full bg-[#f5ddcc] blur-3xl lg:block" />

              <div className="relative overflow-hidden rounded-[3rem] border border-white/90 bg-[linear-gradient(145deg,rgba(255,255,255,0.88),rgba(248,243,236,0.74))] p-5 shadow-[0_42px_96px_-52px_rgba(15,23,42,0.36)] backdrop-blur-2xl lg:p-6">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,0.84fr)_minmax(0,1.16fr)]">
                  <div className="rounded-[2.35rem] border border-black/6 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(250,246,240,0.92))] p-6 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.16)]">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">
                      {isZh ? '为什么先判断再送出' : 'Why evaluate before sending'}
                    </p>
                    <p className="mt-5 text-[2.25rem] font-serif leading-[1.05] tracking-[-0.05em] text-[#1d1915]">
                      {isZh ? '跨文化送礼真正难的，不是挑到贵的东西，而是避免误读、拿捏关系，并把心意送到对方舒服的位置。' : 'The hard part of cross-cultural gifting is rarely picking something expensive; it is avoiding misreading, respecting the relationship, and placing the gesture where it feels right.'}
                    </p>
                    <div className="mt-8 space-y-3">
                      {editorialBullets.map(item => (
                        <div
                          key={item}
                          className="rounded-full border border-black/6 bg-white/68 px-4 py-3 text-sm text-[#4b5563]"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid min-h-[39rem] grid-cols-[0.92fr_1.08fr] gap-4">
                    <div className="grid gap-4">
                      {photographyFrames.slice(0, 2).map(frame => (
                        <article
                          key={frame.title}
                          className={`relative overflow-hidden rounded-[2.2rem] border border-white/90 shadow-[0_24px_54px_-34px_rgba(15,23,42,0.24)] ${
                            frame.align === 'top' ? 'min-h-[14rem]' : 'min-h-[18rem]'
                          }`}
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-95"
                        style={{ backgroundImage: `url(${frame.image})`, backgroundSize: 'cover' }}
                          />
                          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.18),rgba(26,24,21,0.54))]" />
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_16%,rgba(255,255,255,0.34),transparent_28%)] mix-blend-screen" />
                          <div className="relative flex h-full flex-col justify-end p-5">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-white/72">{frame.eyebrow}</p>
                            <h3 className="mt-2 text-[1.55rem] font-serif leading-tight text-white">{frame.title}</h3>
                            <p className="mt-3 max-w-xs text-sm leading-7 text-white/78">{frame.copy}</p>
                          </div>
                        </article>
                      ))}
                    </div>

                    <article className="relative overflow-hidden rounded-[2.55rem] border border-white/90 shadow-[0_28px_60px_-36px_rgba(15,23,42,0.26)]">
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,#f7f3ec_0%,#ece4da_100%)]" />
                      <div
                        className="absolute inset-0 bg-center bg-no-repeat opacity-[0.98]"
                        style={{ backgroundImage: `url(${photographyFrames[2].image})`, backgroundSize: 'cover' }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(24,22,19,0.44))]" />
                      <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/16 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/84 backdrop-blur-md">
                        {isZh ? 'Before you decide' : 'Before you decide'}
                      </div>
                      <div className="relative flex h-full min-h-[39rem] flex-col justify-between p-6">
                        <div className="flex justify-end">
                          <div className="max-w-[14rem] rounded-[1.7rem] border border-white/28 bg-white/14 p-4 text-right backdrop-blur-xl">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/68">
                              {isZh ? 'Soft luxury' : 'Soft luxury'}
                            </p>
                            <p className="mt-3 text-sm leading-7 text-white/82">
                              {isZh ? '克制的留白，配合叙事型摄影与柔和光影。' : 'Restrained whitespace, narrative photography, and a quieter light.'}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/12 px-4 py-2 text-xs text-white/84 backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5" />
                            {isZh ? '为跨文化送礼而设计' : 'Built for cross-cultural gifting'}
                          </div>
                          <div className="rounded-[2rem] border border-white/24 bg-white/14 p-5 backdrop-blur-xl">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                              {isZh ? '你最终会知道' : 'What you will know'}
                            </p>
                            <p className="mt-3 text-[1.75rem] font-serif leading-tight text-white">
                              {isZh ? '这份礼物能不能送、哪里容易出问题、还有什么更稳妥的方向。' : 'Whether the gift should be sent, where it may go wrong, and what safer direction you can take instead.'}
                            </p>
                            <p className="mt-4 text-sm leading-7 text-white/78">
                              {isZh
                                ? '你会先得到一层更完整的判断：礼物本身、目标文化、关系场景与表达方式，哪一环最值得调整。'
                                : 'You get a fuller judgment first: the object itself, the destination culture, the relationship setting, and which part of the expression deserves adjustment.'}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>
        </main>
      </div>
    </div>
  )
}
