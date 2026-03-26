'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { HomeBackground } from '@/components/gifting/home/sections/home-background'
import { withBasePath } from '@/lib/asset-path'

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

  const editorialFrames: EditorialFrame[] = [
    {
      eyebrow: isZh ? 'Cultural read' : 'Cultural read',
      title: isZh ? '礼物先被理解，关系才会被理解。' : 'The gift is read before the relationship is felt.',
      copy: isZh
        ? '把物件语义、送礼距离和文化秩序放进同一套编辑系统里。'
        : 'Object meaning, emotional distance, and cultural order are edited into one system.',
      image: withBasePath('/brand/gift-ceremony.svg'),
      align: 'bottom',
    },
    {
      eyebrow: isZh ? 'Human scene' : 'Human scene',
      title: isZh ? '不是地区标签，而是人如何接收一份心意。' : 'Not a geography tag, but how a person receives a gesture.',
      copy: isZh
        ? '把场景、关系和表达分寸重构成真正国际化的人文体验。'
        : 'Occasion, relationship, and tact are rebuilt into a genuinely international human experience.',
      image: withBasePath('/brand/scene-family.svg'),
      align: 'top',
    },
    {
      eyebrow: isZh ? 'Global protocol' : 'Global protocol',
      title: isZh ? '让送礼从避免出错，升级成高质量表达。' : 'Move gifting beyond avoiding mistakes into high-quality expression.',
      copy: isZh
        ? '从包装、问候语到替代方案，输出的是一份礼赠编辑稿。'
        : 'Packaging, greeting tone, and alternatives become one editorial gifting brief.',
      image: withBasePath('/brand/world-map.svg'),
      align: 'bottom',
    },
  ]

  const editorialValues = [
    {
      label: isZh ? 'Brand direction' : 'Brand direction',
      value: isZh ? 'Light Editorial High-End' : 'Light Editorial High-End',
    },
    {
      label: isZh ? 'Visual language' : 'Visual language',
      value: isZh ? 'Bright / Human / Soft Luxury' : 'Bright / Human / Soft Luxury',
    },
    {
      label: isZh ? 'Core method' : 'Core method',
      value: isZh ? 'Culture-first narrative system' : 'Culture-first narrative system',
    },
  ]

  const editorialBullets = isZh
    ? ['识别礼物的真实语义', '重建文化与关系语境', '输出可执行的礼赠编辑稿']
    : ['Read the gift precisely', 'Rebuild culture and relationship context', 'Return an actionable editorial brief']

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
                  {isZh ? '重新定义跨文化送礼体验' : 'A new language for global gifting'}
                </div>

                <h1
                  className={`mt-8 max-w-[11ch] text-[4rem] leading-[0.9] tracking-[-0.075em] text-[#1d1915] sm:text-[5rem] xl:text-[6.4rem] ${
                    isZh ? 'font-display-zh font-semibold' : 'font-serif font-semibold'
                  }`}
                >
                  {isZh ? (
                    <>
                      <span className="block">不是送出</span>
                      <span className="block text-[#566fd1]">一件礼物，</span>
                      <span className="block">而是送达</span>
                      <span className="block">一种分寸。</span>
                    </>
                  ) : (
                    <>
                      <span className="block">Not just</span>
                      <span className="block text-[#566fd1]">sending a gift,</span>
                      <span className="block">but delivering</span>
                      <span className="block">the right tact.</span>
                    </>
                  )}
                </h1>

                <p className="mt-8 max-w-[34rem] text-lg font-light leading-9 text-[#69707d]">
                  {isZh
                    ? 'Givia 不是传统推荐工具，而是一套面向国际关系、现代审美与人文表达的礼赠编辑系统。它先理解礼物，再理解关系，最后给出真正得体的送达方式。'
                    : 'Givia is not a conventional recommendation tool. It is an editorial gifting system for international relationships, modern taste, and human expression—reading the object, the relationship, and the safest way to make it land.'}
                </p>

                <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
                  <button
                    type="button"
                    onClick={() => router.push(`/${locale}/gifting`)}
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#5b72d1] via-[#4e63bb] to-[#4455a6] px-8 py-4 text-base font-medium text-white shadow-[0_22px_44px_-24px_rgba(91,114,209,0.56)] transition hover:-translate-y-1"
                  >
                    {isZh ? '开始礼赠编辑' : 'Start the editorial flow'}
                    <ArrowRight className="h-5 w-5" />
                  </button>
                  <div className="rounded-full border border-black/6 bg-white/54 px-5 py-3 text-sm text-[#69707d] backdrop-blur-xl">
                    {isZh ? '识别 → 语境 → 判断 → 提案' : 'Object → Context → Judgment → Proposal'}
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
                      {isZh ? 'Editorial statement' : 'Editorial statement'}
                    </p>
                    <p className="mt-5 text-[2.25rem] font-serif leading-[1.05] tracking-[-0.05em] text-[#1d1915]">
                      {isZh ? '高端品牌感，不应该来自装饰，而应该来自秩序、留白与叙事。' : 'High-end brand feeling should come from order, restraint, and narrative—not decoration.'}
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
                      {editorialFrames.slice(0, 2).map(frame => (
                        <article
                          key={frame.title}
                          className={`relative overflow-hidden rounded-[2.2rem] border border-white/90 shadow-[0_24px_54px_-34px_rgba(15,23,42,0.24)] ${
                            frame.align === 'top' ? 'min-h-[14rem]' : 'min-h-[18rem]'
                          }`}
                        >
                          <div
                            className="absolute inset-0 bg-cover bg-center opacity-95"
                            style={{ backgroundImage: `url(${frame.image})` }}
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
                        style={{ backgroundImage: `url(${editorialFrames[2].image})`, backgroundSize: '112% auto' }}
                      />
                      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(24,22,19,0.44))]" />
                      <div className="absolute left-5 top-5 rounded-full border border-white/30 bg-white/16 px-4 py-2 text-[11px] uppercase tracking-[0.24em] text-white/84 backdrop-blur-md">
                        {isZh ? 'Poster composition' : 'Poster composition'}
                      </div>
                      <div className="relative flex h-full min-h-[39rem] flex-col justify-between p-6">
                        <div className="flex justify-end">
                          <div className="max-w-[14rem] rounded-[1.7rem] border border-white/28 bg-white/14 p-4 text-right backdrop-blur-xl">
                            <p className="text-[11px] uppercase tracking-[0.2em] text-white/68">
                              {isZh ? 'Soft luxury' : 'Soft luxury'}
                            </p>
                            <p className="mt-3 text-sm leading-7 text-white/82">
                              {isZh ? '极简的留白，配合叙事型图像与柔和光影。' : 'Minimal whitespace paired with narrative imagery and soft light.'}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="inline-flex items-center gap-2 rounded-full border border-white/24 bg-white/12 px-4 py-2 text-xs text-white/84 backdrop-blur-md">
                            <Sparkles className="h-3.5 w-3.5" />
                            {isZh ? 'Magazine-grade brand system' : 'Magazine-grade brand system'}
                          </div>
                          <div className="rounded-[2rem] border border-white/24 bg-white/14 p-5 backdrop-blur-xl">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-white/70">
                              {isZh ? '品牌封面叙事' : 'Cover story'}
                            </p>
                            <p className="mt-3 text-[1.75rem] font-serif leading-tight text-white">
                              {isZh ? '先建立信任与审美，再让用户进入步骤。' : 'Build trust and taste first, then invite the user into the flow.'}
                            </p>
                            <p className="mt-4 text-sm leading-7 text-white/78">
                              {isZh
                                ? '首页不再展示笨重的功能堆叠，而是像一本高端杂志的封面页，先把品牌的立场说清楚。'
                                : 'The homepage no longer stacks utility cards. It behaves like the cover of a refined magazine, stating the brand position before the workflow begins.'}
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
