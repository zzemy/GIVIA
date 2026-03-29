const fs = require('fs');
const file = 'components/gifting/home/sections/step-analysis.tsx';
let content = fs.readFileSync(file, 'utf8');

// The main grid columns: lower their vertical padding
content = content.replace(/xl:py-4/g, 'xl:py-2.5');
content = content.replace(/sm:py-4/g, 'sm:py-2.5');
content = content.replace(/px-5 py-3/g, 'px-5 py-2');

// Textarea labels (Occasion note, Arrival note)
content = content.replace(/mt-2 block/g, 'mt-1 block');

// Remove redundant descriptors under headings if they take too much space?
// No, just make them smaller.
content = content.replace(/text-\[11px\] uppercase tracking-\[0\.28em\]/g, 'text-[10px] uppercase tracking-[0.2em]');
content = content.replace(/text-\[11px\] uppercase tracking-\[0\.18em\]/g, 'text-[10px] uppercase tracking-[0.15em]');

// Subtitle texts
content = content.replace(/mt-1 text-sm leading-6/g, 'mt-0.5 text-[11px] leading-4');

// The AI check lists
content = content.replace(/space-y-1/g, 'space-y-0');

fs.writeFileSync(file, content, 'utf8');
console.log("Super compress complete");
