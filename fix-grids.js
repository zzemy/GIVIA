const fs = require('fs');
const file = 'components/gifting/home/sections/step-analysis.tsx';
let content = fs.readFileSync(file, 'utf8');

// The first grid under Scene index (sceneTemplateOptions.map) should be cols-3
// The second grid under Delivery options (deliverySettingOptions.map) should be cols-3
// The grid with SelectFields should be cols-2
// The grid with Reading lenses (multimodal, etc) should be cols-2 (or 4? 4 items. Let's make it 4!)

// Just manually set them:
// 1. Scene Index: 6 items -> grid-cols-2 or 3. It's already 3.
// 2. SelectField: find it and ensure it's grid-cols-2
content = content.replace(/<div className="mt-1.5 grid gap-1.5 md:grid-cols-3">\s*<SelectField/g, '<div className="mt-1.5 grid gap-1.5 md:grid-cols-2">\n              <SelectField');

// 3. Reading lenses: 4 items. It used to be md:grid-cols-2. Let's make it cols-4 to take 1 row! or cols-2 is fine if we need space. It took 2 rows. If we make it cols-4, it takes 1 row and saves space! But text is long. Let's leave cols-2 as is? Wait, my previous global replace changed it to cols-3. Let's make it cols-2.
// Find the lenses mapping:
content = content.replace(/className="mt-2 grid gap-1\.5 md:grid-cols-3">\s*\{\[\s*\{\s*key: 'multimodal'/m, 'className="mt-2 grid gap-1.5 md:grid-cols-2">\n                {[\n                  { key: \'multimodal\'');

// Let's also hide the AI checkpoint texts entirely on small screens, or shorten them.
// "Editor's handoff" description is useless. Let's delete it.
content = content.replace(/<p className="mt-0.5 text-\[10px\] leading-tight text-\[#5f584f\]">\s*\{isZh\s*\?\s*'当人物和场景都写清后，下一步不再是补字段，而是让系统正式开始做文化判断、表达推演和替代方向整理。'\s*:\s*'Once both person and scene are legible, the next move is no longer adding fields but letting the system perform cultural judgment and scenario refinement\.'\}\s*<\/p>/g, '');

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed grids and deleted handoff text");
