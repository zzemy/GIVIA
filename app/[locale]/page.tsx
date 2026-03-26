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
      eyebrow: isZh ? 'A first impression' : 'A first impression',
      title: isZh ? '同一份礼物，落进不同关系里，会变成不同的意思。' : 'The same gift can mean very different things in different relationships.',
      copy: isZh ? '亲疏、身份与场合，会决定它被读成贴心、越界，还是只是客气。' : 'Distance, role, and occasion decide whether it feels thoughtful, overfamiliar, or merely polite.',
      image:
        'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1400&q=80',
      align: 'bottom',
    },
    {
      eyebrow: isZh ? 'Another place, another reading' : 'Another place, another reading',
      title: isZh ? '跨过边界之后，礼物会被另一套文化经验重新解释。' : 'Once it crosses a border, the gift is interpreted by another cultural memory.',
      copy: isZh ? '问题不只在于送什么，更在于它在那里会联想到什么。' : 'The question is not only what you send, but what it may suggest there.',
      image:
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      align: 'top',
    },
    {
      eyebrow: isZh ? 'A better ending' : 'A better ending',
      title: isZh ? '最后留下来的，不只是结论，而是一种更成熟的送达方式。' : 'What remains in the end is not only a verdict, but a more mature way to let the gesture land.',
      copy: isZh ? '包括替代方向、包装建议与表达语气，让心意落地得更自然，也更被理解。' : 'Including alternatives, packaging direction, and message tone so the gesture lands more naturally—and is better understood.',
      image:
        'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1600&q=80',
      align: 'bottom',
    },
  ]

  const editorialValues = [
    {
      label: isZh ? '故事起点' : 'The beginning',
      value: isZh ? '先看见礼物将被怎样阅读' : 'See how the gift may be read before it arrives',
    },
    {
      label: isZh ? '故事张力' : 'The tension',
      value: isZh ? '避免文化误读、关系失分与表达失准' : 'Avoid cultural misreading, awkwardness, and the wrong tone',
    },
    {
      label: isZh ? '故事落点' : 'The ending',
      value: isZh ? '一份更稳妥的礼赠建议与表达方式' : 'A more tactful recommendation and expression',
    },
  ]

  const editorialBullets = isZh
    ? ['看见礼物将被如何阅读', '识别文化与关系中的隐性张力', '找到更自然的送达方式']
    : ['See how the gift may be read', 'Identify hidden cultural and relational tension', 'Find a more natural way for the gesture to land']

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
                  {isZh ? '每一份跨文化礼物，都会先被阅读，再被接收' : 'Every cross-cultural gift is read before it is received'}
                </div>

                <h1
                  className={`mt-8 max-w-[11ch] text-[4rem] leading-[0.9] tracking-[-0.075em] text-[#1d1915] sm:text-[5rem] xl:text-[6.4rem] ${
                    isZh ? 'font-display-zh font-semibold' : 'font-serif font-semibold'
                  }`}
                >
                  {isZh ? (
                    <>
                      <span className="block">有些礼物送出去，</span>
                      <span className="block text-[#566fd1]">是被珍重接住；</span>
                      <span className="block">有些礼物送出去，</span>
                      <span className="block">却会被误读。</span>
                    </>
                  ) : (
                    <>
                      <span className="block">Some gifts arrive</span>
                      <span className="block text-[#566fd1]">as warmth;</span>
                      <span className="block">some arrive</span>
                      <span className="block">as misunderstanding.</span>
                    </>
                  )}
                </h1>

                <p className="mt-8 max-w-[34rem] text-lg font-light leading-9 text-[#69707d]">
                  {isZh
                    ? '在跨文化关系里，礼物从来不是单独的一件物品。它会连同关系远近、场合气氛与文化联想一起，被对方完整地阅读。Givia 帮你先看见这场阅读。'
                    : 'In cross-cultural relationships, a gift is never just an object. It is read together with social distance, occasion, and cultural association. Givia helps you see that reading before the gesture leaves you.'}
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/gifting`)}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5b72d1] via-[#4e63bb] to-[#4455a6] px-8 py-4 text-base font-medium text-white shadow-[0_22px_44px_-24px_rgba(91,114,209,0.56)] transition hover:-translate-y-1"
                  >
                    {isZh ? '开始这段礼赠判断' : 'Begin the gifting story'}
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
                      {isZh ? '故事从误读开始被避免' : 'Where misunderstanding is prevented'}
                    </p>
                    <p className="mt-5 text-[2.25rem] font-serif leading-[1.05] tracking-[-0.05em] text-[#1d1915]">
                      {isZh ? '真正困难的，从来不是挑礼物本身，而是判断它会在另一个文化里，被读成亲近、体面、冒犯，还是疏离。' : 'The real difficulty is rarely choosing the object itself. It is judging whether it will be read as thoughtful, elegant, awkward, or intrusive in another culture.'}
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
                              {isZh ? '故事最后会落到这里' : 'Where the story arrives'}
                            </p>
                            <p className="mt-3 text-[1.75rem] font-serif leading-tight text-white">
                              {isZh ? '这份礼物是否合适，哪里可能失准，以及怎样让心意更自然地被接住。' : 'Whether the gift feels appropriate, where it may lose its balance, and how the gesture can be received more naturally.'}
                            </p>
                            <p className="mt-4 text-sm leading-7 text-white/78">
                              {isZh
                                ? '你会看到一条完整的叙事线：物件本身、目标文化、关系场景与表达语气，究竟是哪一环改变了礼物的意义。'
                                : 'You see the full narrative line: the object itself, the destination culture, the relationship setting, and which part of the expression changes the meaning of the gift.'}
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
