const fs = require('fs');
let content = fs.readFileSync('app/[locale]/page.tsx', 'utf8');

// replace meeting URL with a nice gift box image
content = content.replace(
  /'https:\/\/images\.unsplash\.com\/photo-1606836591695-4d58a73eba1e\?q=80&w=2971&auto=format&fit=crop'/,
  "'https://images.unsplash.com/photo-1608755728617-aefab37d2edd?q=80&w=2000&auto=format&fit=crop'"
);

// replace H1 to fix wrapping
const oldH1 = `{isZh ? (
                  <span className="flex flex-col gap-2 relative">
                    <span>
                      在跨越国界<em className="font-light italic text-[#7282c6] px-2 opacity-90">之前</em>，
                    </span>
                    <span className="relative inline-block self-start mt-2">
                      <span className="relative z-10">让心意得体着陆</span>
                      <span className="absolute bottom-2 left-0 -z-10 h-4 w-full rounded-[4px] bg-[#e1e7f5]" />
                    </span>
                  </span>
                ) : (`;

const newH1 = `{isZh ? (
                  <>
                    <span className="inline-block whitespace-nowrap">
                      在跨越国界<em className="font-light italic text-[#7282c6] px-1.5 opacity-90">之前</em>，
                    </span>
                    <br />
                    <span className="relative inline-block mt-2">
                      <span className="relative z-10">让心意得体着陆</span>
                      <span className="absolute bottom-2 left-0 -z-10 h-4 w-full rounded-sm bg-[#e1e7f5]" />
                    </span>
                  </>
                ) : (`;

content = content.replace(oldH1, newH1);

fs.writeFileSync('app/[locale]/page.tsx', content);
