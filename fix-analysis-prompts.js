const fs = require('fs');

const file = 'lib/ai/prompts/analysis.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /function getOutputLanguageConstraint\(language: PromptLanguage\): string \{[^}]+\}/,
  `function getOutputLanguageConstraint(language: PromptLanguage, countryName: string): string {
  if (language === 'en') {
    return \`All text must be in English. EXCEPTION: The 'card' (Greeting Card) content MUST be written in the native language spoken in \${countryName} (e.g. if country is Japan, write the card in Japanese).\`
  }

  return \`除 'card' (贺卡) 之外的所有文案必须使用简体中文。例外：'card' 内部的文案必须使用 \${countryName} 当地的母语（例如：如果是日本则必须用日语写贺卡，法国用法语，英国用英语等）。\`
}`
);

content = content.replace(
  /getOutputLanguageConstraint\(language\),/,
  `getOutputLanguageConstraint(language, country.nameZh),`
);

content = content.replace(
  /'若存在文化禁忌，isTaboo 必须 true，并写清风险语义。',/,
  "'若存在文化禁忌，isTaboo 必须 true，并写清风险语义。如果没有严重的文化禁忌，绝不要生搬硬套或硬扯禁忌！请将分析重点转移到：礼物是否符合两人的【关系深度】、是否适合该【场景场合】。',"
);

// We should also make the risk level more precise or explain how score is used.
content = content.replace(
  /'score 为 phonetic\/symbol\/color 0-100 的整数。',/,
  "'score 为 phonetic/symbol/color 0-100 的整数。请严格根据送礼的不得体程度打分，如果没有禁忌但稍微不太合适，可以给 30-50 分，不要都给 0。',"
)

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed prompts for card language and taboo forcing');
