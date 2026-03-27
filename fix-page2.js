const fs = require('fs');
let content = fs.readFileSync('app/[locale]/gifting/page.tsx', 'utf8');
content = content.replace(/xl:grid-cols-\[minmax\([^)]+\)_[^\]]+\]/g, 'flex justify-center max-w-4xl mx-auto w-full');
// also change the layout from grid to simple block
content = content.replace(/className=\"grid h-full min-h-0 gap-6 flex justify-center max-w-4xl mx-auto w-full\"/g, 'className="flex flex-col h-full min-h-0 gap-6 max-w-4xl mx-auto w-full"');
content = content.replace(/className=\"grid h-full min-h-0 gap-5 flex justify-center max-w-4xl mx-auto w-full\"/g, 'className="flex flex-col h-full min-h-0 gap-5 max-w-4xl mx-auto w-full"');
fs.writeFileSync('app/[locale]/gifting/page.tsx', content);
