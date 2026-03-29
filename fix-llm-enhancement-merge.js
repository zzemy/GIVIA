const fs = require('fs');

const file = 'lib/analysis/llm-risk-enhancement.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /semanticSignals: \[\n\s*\.\.\.ruleResult\.semanticSignals,\n\s*llmEnhancement\.culturalContext,\n\s*\]\.filter\(Boolean\),/,
  `semanticSignals: {
      ...ruleResult.semanticSignals,
      tags: [
        ...(ruleResult.semanticSignals?.tags || []),
        llmEnhancement.culturalContext // we put the rich cultural psychological context here so it displays nicely
      ].filter(Boolean),
    },`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed semanticSignals merge in llm-risk-enhancement.ts');
