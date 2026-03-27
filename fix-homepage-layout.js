const fs = require('fs');

/** -------------
 * UPDATE ROOT PAGE
 * ------------- */
let rootPage = fs.readFileSync('app/page.tsx', 'utf-8');

// 1. Overall height to exactly viewport, removing scroll
rootPage = rootPage.replace('min-h-screen overflow-hidden', 'h-[100dvh] w-full overflow-hidden');
rootPage = rootPage.replace('min-h-screen w-full max-w-[1580px] flex-col px-6 py-6 sm:px-8 lg:px-12', 'h-full w-full max-w-[1580px] flex-col px-6 py-4 sm:px-8 xl:px-12');

// Make header flex-none
rootPage = rootPage.replace('className="flex items-start justify-between gap-4"', 'className="flex flex-none items-start justify-between gap-4"');

// Reduce main grid padding to avoid overflow
rootPage = rootPage.replace('grid flex-1 gap-8 py-8 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] lg:items-center lg:py-4', 'grid min-h-0 flex-1 items-center gap-8 py-4 lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)] xl:gap-16');

// Refactor Left Section: Add artistic styles & make buttons beautiful & explicit language
const oldRootSection1 = `<motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex max-w-[40rem] flex-col justify-end pb-4 lg:pb-10"
          >
            <p className="text-[11px] uppercase tracking-[0.34em] text-[#7f89b4]">Editorial preface</p>
            <h1 className="mt-6 max-w-[13ch] text-[4.25rem] font-serif leading-[0.88] tracking-[-0.1em] text-[#1b1714] sm:text-[5.15rem] xl:text-[6.35rem]">
              Before a gesture crosses a border, it enters another life.
            </h1>
            <p className="mt-8 max-w-[32rem] text-[1.04rem] leading-9 text-[#646c79]">
              Choose a language edition and enter an AI editorial workflow built around culture, tact, relationship, and arrival.
            </p>

            <div className="mt-10 grid gap-4 border-t border-black/10 pt-5 md:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">What this is</p>
                <p className="mt-3 text-[1.12rem] font-serif leading-8 text-[#1b1714]">
                  An AI gifting editor that reads what a present means before it is sent.
                </p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">What you receive</p>
                <p className="mt-3 text-[1rem] leading-8 text-[#646c79]">
                  An AI-authored report on cultural fit, wording, packaging, alternatives, and the right way for a gesture to land.
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-4">
              <motion.button
                type="button"
                onClick={() => router.push('/zh')}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.985 }}
                className="group flex w-full items-center justify-between border-t border-black/10 py-5 text-left"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">进入中文语境</p>
                  <p className="mt-2 text-[1.58rem] font-serif text-[#1b1714]">Continue in 中文</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#6478c8] transition duration-500 group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                type="button"
                onClick={() => router.push('/en')}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.985 }}
                className="group flex w-full items-center justify-between border-t border-black/10 py-5 text-left"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]">Enter the English edition</p>
                  <p className="mt-2 text-[1.58rem] font-serif text-[#1b1714]">Enter in English</p>
                </div>
                <ArrowRight className="h-5 w-5 text-[#6478c8] transition duration-500 group-hover:translate-x-1" />
              </motion.button>
            </div>
          </motion.section>`;

const newRootSection1 = `<motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col justify-center min-h-0 lg:pb-8"
          >
            <div className="xl:pl-4">
              <p className="inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-[#7f89b4]">
                <span className="h-[1px] w-6 bg-[#7f89b4]/50" />
                Editorial preface
              </p>
              <h1 className="mt-6 text-[3.6rem] font-serif leading-[0.92] tracking-[-0.08em] text-[#1b1714] sm:text-[4.8rem] xl:text-[5.4rem]">
                Before a <em className="pr-1.5 font-light italic text-[#7282c6]">gesture</em><br />
                crosses a border,<br />
                it enters <span className="relative inline-block"><span className="relative z-10">another</span><span className="absolute bottom-2 left-0 -z-10 h-3.5 w-full rounded-full bg-[#e1e7f5]" /></span> life.
              </h1>
              <p className="mt-6 max-w-[32rem] text-[1rem] leading-relaxed text-[#646c79]">
                Choose a language edition and enter an AI editorial workflow built around culture, tact, relationship, and arrival.
              </p>

              <div className="mt-8 grid gap-4 border-t border-black/10 pt-4 md:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#98a2b3]">What this is</p>
                  <p className="mt-2 text-[1rem] font-serif leading-snug text-[#1b1714]">
                    An AI gifting editor that reads what a gesture means.
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[#98a2b3]">What you receive</p>
                  <p className="mt-2 text-[0.9rem] leading-snug text-[#646c79]">
                    A structured report on cultural fit, wording, packaging, and arrival.
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-[1fr_0.8fr] gap-4 border-t border-black/10 pt-6">
                <motion.button
                  type="button"
                  onClick={() => router.push('/zh')}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group relative flex flex-col items-start justify-between overflow-hidden rounded-[1.5rem] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-500 hover:shadow-[0_8px_40px_rgba(100,120,200,0.12)] border border-[#E5E0D8]"
                >
                  <div className="absolute top-0 left-0 w-1 h-full bg-[#7282c6] bg-opacity-0 transition-opacity duration-300 group-hover:bg-opacity-100" />
                  <div className="flex w-full items-center justify-between">
                    <p className="text-[10px] font-medium tracking-[0.28em] text-[#8e95a2] uppercase">ZH Edition</p>
                    <ArrowRight className="h-4 w-4 text-[#8e95a2] transition duration-500 group-hover:translate-x-1 group-hover:text-[#7282c6]" />
                  </div>
                  <p className="mt-3 text-[1.4rem] font-medium font-sans tracking-[0.1em] text-[#1b1714]">开启中文体验</p>
                </motion.button>

                <motion.button
                  type="button"
                  onClick={() => router.push('/en')}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="group flex flex-col items-start justify-between rounded-[1.5rem] bg-transparent p-5 transition-all duration-500 hover:bg-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.04)] border border-transparent hover:border-[#E5E0D8]"
                >
                  <div className="flex w-full items-center justify-between">
                    <p className="text-[10px] font-medium tracking-[0.28em] text-[#8e95a2] uppercase">EN Edition</p>
                    <ArrowRight className="h-4 w-4 text-[#8e95a2] transition duration-500 group-hover:translate-x-1 group-hover:text-[#1b1714]" />
                  </div>
                  <p className="mt-3 text-[1.3rem] font-serif tracking-wide text-[#1b1714]">Enter English</p>
                </motion.button>
              </div>
            </div>
          </motion.section>`;

if(rootPage.includes(oldRootSection1)) {
    rootPage = rootPage.replace(oldRootSection1, newRootSection1);
}

// Right section min/max height restriction to avoid scroll
const oldRootSection2 = `className="grid min-h-[34rem] gap-4 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:grid-rows-[minmax(0,1fr)_minmax(0,0.82fr)]"`;
const newRootSection2 = `className="grid h-[85%] max-h-[44rem] min-h-[22rem] gap-3 pb-2 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,0.96fr)] lg:grid-rows-[minmax(0,1fr)_minmax(0,0.82fr)]"`;
rootPage = rootPage.replace(oldRootSection2, newRootSection2);

fs.writeFileSync('app/page.tsx', rootPage);

/** ----------------
 * UPDATE LOCALE PAGE
 * ---------------- */
let localePage = fs.readFileSync('app/[locale]/page.tsx', 'utf-8');

localePage = localePage.replace('min-h-screen overflow-hidden', 'h-[100dvh] w-full overflow-hidden');
localePage = localePage.replace('min-h-screen w-full max-w-[1580px] flex-col px-6 py-6 sm:px-8 lg:px-12', 'h-full w-full max-w-[1580px] flex-col px-6 py-4 sm:px-8 xl:px-12');
localePage = localePage.replace('className="flex items-start justify-between gap-4"', 'className="flex flex-none items-start justify-between gap-4"');
localePage = localePage.replace('grid flex-1 gap-8 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:items-center lg:py-4', 'grid min-h-0 flex-1 items-center gap-8 py-4 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] xl:gap-12');

localePage = localePage.replace('className="flex max-w-[42rem] flex-col justify-end pb-6 lg:pb-10"', 'className="flex max-w-[42rem] flex-col justify-center min-h-0 lg:pb-8 xl:pl-4"');
localePage = localePage.replace('mt-8 max-w-[33rem] text-[1.04rem] leading-9 text-[#626a77]', 'mt-6 max-w-[33rem] text-[1.04rem] leading-8 text-[#626a77]');
localePage = localePage.replace('mt-10 grid gap-4 border-t border-black/10 pt-5 md:grid-cols-2', 'mt-8 grid gap-4 border-t border-black/10 pt-4 md:grid-cols-2');
localePage = localePage.replace('className="group mt-12 flex items-center justify-between border-t border-black/10 py-5 text-left"', 'className="group mt-8 flex items-center justify-between border-t border-black/10 pt-5 pb-2 text-left"');
localePage = localePage.replace('text-[11px] uppercase tracking-[0.24em] text-[#98a2b3]', 'text-[10px] uppercase tracking-[0.2em] text-[#98a2b3]');

// Fix H1 Artistic Feel in locale page
const oldLocaleH1 = `<h1
              className={\`mt-6 text-[4.2rem] leading-[0.88] tracking-[-0.1em] text-[#1a1715] sm:text-[5.2rem] xl:text-[6.55rem] \${
                isZh ? 'font-display-zh font-semibold' : 'font-serif'
              }\`}
            >
              {isZh ? (
                <>
                  <span className="block">让一份心意，</span>
                  <span className="block text-[#5f72c8]">以更得体的方式</span>
                  <span className="block">进入另一种文化。</span>
                </>
              ) : (
                <>
                  <span className="block">Let a gesture</span>
                  <span className="block text-[#5f72c8]">enter another culture</span>
                  <span className="block">with tact and grace.</span>
                </>
              )}
            </h1>`;

const newLocaleH1 = `<h1
              className={\`mt-6 text-[3.8rem] leading-[1] tracking-[-0.04em] text-[#1a1715] sm:text-[4.6rem] xl:text-[5.2rem] \${
                isZh ? 'font-display-zh font-semibold' : 'font-serif tracking-[-0.08em]'
              }\`}
            >
              {isZh ? (
                <>
                  <span className="block opacity-90">让一份<em className="font-serif italic text-[#7282c6] px-1 font-light">心意</em>，</span>
                  <span className="block relative inline-block my-1"><span className="relative z-10">以更得体的<em className="not-italic text-[#7282c6]">方式</em></span><span className="absolute bottom-3 left-0 -z-10 h-3.5 w-full rounded-full bg-[#edf1f8]" /></span>
                  <span className="block opacity-90">进入另一种文化。</span>
                </>
              ) : (
                <>
                  <span className="block">Let a <em className="italic font-light text-[#7282c6] pr-2">gesture</em></span>
                  <span className="block">enter another culture</span>
                  <span className="block relative inline-block"><span className="relative z-10">with tact & grace.</span><span className="absolute bottom-2.5 left-0 -z-10 h-3.5 w-[105%] rounded-full bg-[#edf1f8]" /></span>
                </>
              )}
            </h1>`;

if(localePage.includes(oldLocaleH1)) {
    localePage = localePage.replace(oldLocaleH1, newLocaleH1);
}

// Right section min/max constraints
const oldLocaleRight = `className="grid min-h-[34rem] gap-4 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:grid-rows-[minmax(0,1fr)_minmax(0,0.78fr)]"`;
const newLocaleRight = `className="grid h-[85%] max-h-[42rem] min-h-[22rem] gap-3 pb-2 lg:grid-cols-[minmax(0,1.06fr)_minmax(0,0.94fr)] lg:grid-rows-[minmax(0,1fr)_minmax(0,0.78fr)]"`;
localePage = localePage.replace(oldLocaleRight, newLocaleRight);

fs.writeFileSync('app/[locale]/page.tsx', localePage);
console.log('Done rewriting pages for layout and aesthetics.');
