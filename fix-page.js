const fs = require('fs');
let content = fs.readFileSync('app/[locale]/gifting/page.tsx', 'utf8');

// replace the grid layout to become a single centered column
content = content.replace(/xl:grid-cols-\[minmax\(0,1\.14fr\)_18\.5rem\]/g, 'flex justify-center max-w-4xl mx-auto w-full');

// Regex might fail if it's too complex, better to just use replace with string matching or simpler regex
content = content.replace(/\{currentAiCompanion \? \([\s\S]*?<EditorialAiAside[\s\S]*?\/>\s*\)\s*:\s*null\}/g, '');

content = content.replace(
  /<StepGiftInput\s+\{\.\.\.giftInputProps\}\s+\/>/,
  `<StepGiftInput {...giftInputProps} />\n                  <div className="mt-8 flex justify-end w-full"><button onClick={() => setCurrentStep(2)} disabled={!canAdvanceFromStep1} className="bg-indigo-600 text-white px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-3">{isZh ? '下一步：配置场景' : 'Next: Configure Scene'} <ArrowRight className="w-5 h-5"/></button></div>`
);

content = content.replace(
  /<StepCountry\s+\{\.\.\.countryProps\}\s+\/>/,
  `<StepCountry {...countryProps} />\n                  <div className="mt-8 flex justify-between w-full"><button onClick={() => setCurrentStep(1)} className="bg-white border border-[#E5E0D8] text-[#5C5A55] px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg flex items-center gap-3"><ArrowLeft className="w-5 h-5"/> {isZh ? '返回上一步' : 'Back'}</button><button onClick={() => setCurrentStep(3)} disabled={!canAdvanceFromStep2} className="bg-emerald-600 text-white px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center gap-3">{isZh ? '下一步：检查参数' : 'Next: Confirm Settings'} <ArrowRight className="w-5 h-5"/></button></div>`
);

content = content.replace(
  /<StepAnalysis\s+\{\.\.\.analysisProps\}\s+\/>/,
  `<StepAnalysis {...analysisProps} />\n                  <div className="mt-8 flex justify-between w-full"><button onClick={() => setCurrentStep(2)} className="bg-white border border-[#E5E0D8] text-[#5C5A55] px-10 py-5 rounded-full font-medium transition hover:-translate-y-1 hover:shadow-lg flex items-center gap-3"><ArrowLeft className="w-5 h-5"/> {isZh ? '返回上一步' : 'Back'}</button></div>`
);

fs.writeFileSync('app/[locale]/gifting/page.tsx', content);
