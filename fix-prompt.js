const fs = require('fs');

const file = 'lib/ai/prompts/vision.ts';
let content = fs.readFileSync(file, 'utf8');

// Change "label 使用英文通用名词" to "label 使用中文/英文（根据语言参数）通用名词"
// Actually, it's inside `isEnglish ? ... : 'label 使用英文通用名词...'` 
// so the false branch is for language === 'zh'. We should change it to '中文'.

content = content.replace(
  /'label 使用英文通用名词，synonyms 最多 3 项。'/,
  "'label 请使用最贴切的中文名称，synonyms 最多 3 项。'"
);

content = content.replace(
  /label 请使用最贴切的英文通用名词/g,
  "label 请给出具体的中文名称（而非大类名称）"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed prompts in vision.ts');
