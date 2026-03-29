const fs = require('fs');
const path = 'lib/analysis/llm-risk-enhancement.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /warning:[\s\S]*?ruleResult\.warning,/m,
  "warning:\n      (llmEnhancement.culturalContext && llmEnhancement.semanticExplanation)\n        ? `${llmEnhancement.culturalContext}\\n\\n${llmEnhancement.semanticExplanation}`\n        : (llmEnhancement.semanticExplanation || ruleResult.warning),"
);

fs.writeFileSync(path, code);
console.log('Fixed enhancement mapping again.');
