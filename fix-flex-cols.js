const fs = require('fs');
const file = 'components/gifting/home/sections/step-analysis.tsx';
let content = fs.readFileSync(file, 'utf8');

// Left column 
content = content.replace(/className="relative flex min-h-\[18rem\] flex-col border-b border-\[rgba\(74,63,51,0\.1\)\]/g, 
  'className="relative flex flex-1 xl:flex-[1.04] min-w-0 min-h-[18rem] flex-col border-b border-[rgba(74,63,51,0.1)]');

// Right column
// Search for <div className="relative flex min-h-0 flex-col px-5 py-4 sm:px-6 sm:py-4 xl:px-7 xl:py-5">
content = content.replace(/<div className="relative flex min-h-0 flex-col px-5 py-4 sm:px-6 sm:py-4 xl:px-7 xl:py-5">/g, 
  '<div className="relative flex flex-1 xl:flex-[0.96] min-w-[24rem] min-h-0 flex-col px-5 py-4 sm:px-6 sm:py-4 xl:px-7 xl:py-5">');

fs.writeFileSync(file, content, 'utf8');
console.log("Flex columns updated");
