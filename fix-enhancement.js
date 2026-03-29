const fs = require('fs');
const path = 'lib/analysis/llm-risk-enhancement.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /warning:\s+llmEnhancement\.enhancedWarning\s+\|\|\s+ruleResult\.warning,/g, 
  "warning:\n      (llmEnhancement.culturalContext && llmEnhancement.enhancedWarning)\n        ? `${llmEnhancement.culturalContext}\\n\\n${llmEnhancement.enhancedWarning}`\n        : (llmEnhancement.enhancedWarning || ruleResult.warning),"
);

code = code.replace(
  /semanticSignals:\s+\[\s*\.\.\.\(ruleResult\.semanticSignals\s*\|\|\s*\[\]\),\s*llmEnhancement\.culturalContext\s*\]\.filter\(Boolean\)/g,
  "semanticSignals: [...(ruleResult.semanticSignals || [])].filter(Boolean)"
);

fs.writeFileSync(path, code);
console.log('Fixed enhancement mapping.');
