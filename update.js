const fs = require('fs');
let content = fs.readFileSync('app/[locale]/page.tsx', 'utf8');

// replace meeting URL
content = content.replace(
  /'https:\/\/images\.pexels\.com\/photos\/7937690\/.*?\.jpeg\?.*?'/,
  "'https://images.pexels.com/photos/5950153/pexels-photo-5950153.jpeg?cs=srgb&dl=pexels-dmitry-zvolskiy-5950153.jpg&fm=jpg'"
);

// replace h1 className
content = content.replace(
  'className="mt-6 text-[3.6rem] font-serif leading-[1.05] tracking-[-0.04em] text-[#1b1714] sm:text-[4.6rem] xl:text-[5.2rem]"',
  'className={`mt-6 text-[3.6rem] leading-[1.05] tracking-[-0.04em] text-[#1b1714] sm:text-[4.6rem] xl:text-[5.2rem] ${isZh ? \\'font-display-zh\\' : \\'font-serif\\'}`}'
);

content = content.replace(
  /<span>在跨越国界.*?</s,
  `<span>礼智</span>`
);

fs.writeFileSync('app/[locale]/page.tsx', content);
