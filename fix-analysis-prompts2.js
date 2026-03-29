const fs = require('fs');

const file = 'lib/ai/prompts/analysis.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /\}\n\n  return '所有文案用简体中文。'\n\}/,
  "}"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed syntax in analysis.ts');
