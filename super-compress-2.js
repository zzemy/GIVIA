const fs = require('fs');
const file = 'components/gifting/home/sections/step-analysis.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/className="mt-1 text-\[11px\] leading-4 text-\[#5f584f\]"/g, 'className="mt-0.5 text-[10px] leading-tight text-[#5f584f]"');
content = content.replace(/gap-3/g, 'gap-2');
content = content.replace(/gap-2 md:grid-cols-2/g, 'gap-1.5 md:grid-cols-2');
content = content.replace(/mt-2 grid/g, 'mt-1.5 grid');

fs.writeFileSync(file, content, 'utf8');
console.log("Super compress 2 complete");
