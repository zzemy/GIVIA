const fs = require('fs');
const file = 'components/gifting/home/sections/step-analysis.tsx';
let content = fs.readFileSync(file, 'utf8');

// ==== Left Column (Expand Occasion note and Arrival note) ====

// Occasion Note label container
content = content.replace(/<label className="mt-1 block">\s*<span className="text-\[10px\] uppercase tracking-\[0\.15em\] text-\[#978f84\]">\{isZh \? 'Occasion note' : 'Occasion note'\}<\/span>\s*<textarea/g, 
`<label className="mt-2 flex flex-1 flex-col">
              <span className="mb-2 text-[10px] uppercase tracking-[0.15em] text-[#978f84]">{isZh ? 'Occasion note' : 'Occasion note'}</span>
              <textarea`);
// It might not match exactly, let's use a simpler replace or regex.

content = content.replace(/<label className="mt-1 block">/g, '<label className="mt-3 flex flex-1 flex-col">');
content = content.replace(/className="\$\{fieldClassName\} min-h-\[3\.2rem\] resize-none overflow-hidden"/g, 'className={`${fieldClassName} flex-1 min-h-[3.2rem] mt-1 resize-none overflow-hidden`}');

// ==== Right Column ====
content = content.replace(/<div className="mt-2 rounded-\[1rem\] border/g, '<div className="mt-4 flex flex-1 flex-col rounded-[1rem] border');
// Right column grid 
// Left right paddings: make it xl:py-4 again so it pokes out less uncomfortably. 
content = content.replace(/xl:py-2.5/g, 'xl:py-5');
content = content.replace(/sm:py-2.5/g, 'sm:py-4');
content = content.replace(/px-5 py-2/g, 'px-5 py-4');
content = content.replace(/gap-1.5 md:grid-cols-3/g, 'gap-2 mt-3 md:grid-cols-3');

// Increase text sizes slightly again since we have infinite space now due to flex-grow.
content = content.replace(/text-\[1.4rem\]/g, 'text-[1.55rem]');
content = content.replace(/sm:text-\[1.6rem\]/g, 'sm:text-[1.85rem]');
content = content.replace(/text-\[1.3rem\]/g, 'text-[1.4rem]');
content = content.replace(/sm:text-\[1.5rem\]/g, 'sm:text-[1.65rem]');

// Right column "Reading Lenses" should stick to bottom of its column
content = content.replace(/<div className="mt-2 rounded-\[1rem\] border border-\[rgba\(74,63,51,0.08\)\] bg-\[rgba\(255,255,255,0.54\)\] p-3">\s*<div className="flex items-center justify-between gap-2">/g, 
  '<div className="mt-4 rounded-[1rem] border border-[rgba(74,63,51,0.08)] bg-[rgba(255,255,255,0.54)] p-3">\n                <div className="flex items-center justify-between gap-2">');

fs.writeFileSync(file, content, 'utf8');
console.log("Flex applied");
