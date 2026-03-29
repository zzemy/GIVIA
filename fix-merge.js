const fs = require('fs');
const path = 'lib/analysis/llm-risk-enhancement.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /if \(!llmEnhancement \|\| llmEnhancement\.confidence < 0\.5\) \{/,
  "if (!llmEnhancement) {"
);

fs.writeFileSync(path, code);
console.log('Fixed confidence check.');
