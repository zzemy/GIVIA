const fs = require('fs');
const file = 'components/gifting/home/sections/step-analysis.tsx';
let content = fs.readFileSync(file, 'utf8');

// Title section
content = content.replace(/text-\[1\.62rem\]/g, 'text-[1.4rem]');
content = content.replace(/sm:text-\[1\.95rem\]/g, 'sm:text-[1.6rem]');
content = content.replace(/text-\[1.86rem\]/g, 'text-[1.3rem]');
content = content.replace(/sm:text-\[2.08rem\]/g, 'sm:text-[1.5rem]');

// Spacings between elements
content = content.replace(/mt-3/g, 'mt-2'); 

// Button Texts
content = content.replace(/text-sm leading-6/g, 'text-[12px] leading-tight');
content = content.replace(/text-xs leading-6/g, 'text-[11px] leading-tight');
content = content.replace(/px-3 py-2/g, 'px-3 py-1.5');
content = content.replace(/rounded-\[1.35rem\]/g, 'rounded-[1rem]');

// Text Areas
content = content.replace(/min-h-\[4rem\]/g, 'min-h-[3.2rem]');

// AI Arrival draft
content = content.replace(/text-sm leading-7/g, 'text-[13px] leading-5');
content = content.replace(/mt-4 flex flex-wrap/g, 'mt-2 flex flex-wrap');

// Reading lenses box
content = content.replace(/rounded-\[1.5rem\]/g, 'rounded-[1rem]');
content = content.replace(/p-4/g, 'p-3');
content = content.replace(/h-8 w-8/g, 'h-6 w-6');

// Bottom Bar text
content = content.replace(/text-sm leading-6 text-\[#5a544b\]/g, 'text-[12px] leading-4 text-[#5a544b]');
content = content.replace(/mt-1 text-\[13px\] leading-5 leading-7/g, 'mt-1 text-[11px] leading-4');
content = content.replace(/mt-1 text-\[13px\] leading-5/g, 'mt-1 text-[11px] leading-4'); // clean up trailing leading-7 if any
content = content.replace(/px-4 py-2 sm:px-7/g, 'px-4 py-1.5 sm:px-7');

fs.writeFileSync(file, content, 'utf8');
console.log("Compression complete");
