const fs = require('fs');
let content = fs.readFileSync('app/[locale]/page.tsx', 'utf8');

// The h1 already has the ternary, let's not break it.
// Replace simple class names: class="... font-serif ..." -> className={`... ${isZh ? 'font-display-zh' : 'font-serif'} ...`}

content = content.replace(
  'className="mt-2 text-[2.8rem] font-serif tracking-[-0.08em] text-[#1b1714]"',
  'className={`mt-2 text-[2.8rem] tracking-[-0.08em] text-[#1b1714] ${isZh ? \\'font-display-zh\\' : \\'font-serif\\'}`}'
);

content = content.replace(
  'className="mt-3 text-[1.4rem] font-serif leading-snug drop-shadow-sm"',
  'className={`mt-3 text-[1.4rem] leading-snug drop-shadow-sm ${isZh ? \\'font-display-zh\\' : \\'font-serif\\'}`}'
);

content = content.replace(
  'className="max-w-[15rem] text-[1.12rem] font-serif leading-tight text-white drop-shadow-sm"',
  'className={`max-w-[15rem] text-[1.12rem] leading-tight text-white drop-shadow-sm ${isZh ? \\'font-display-zh\\' : \\'font-serif\\'}`}'
);

content = content.replace(
  'className="max-w-[15rem] text-[1.12rem] font-serif leading-tight text-white drop-shadow-sm"',
  'className={`max-w-[15rem] text-[1.12rem] leading-tight text-white drop-shadow-sm ${isZh ? \\'font-display-zh\\' : \\'font-serif\\'}`}'
);

fs.writeFileSync('app/[locale]/page.tsx', content);
