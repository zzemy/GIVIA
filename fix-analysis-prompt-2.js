const fs = require('fs');
const file = 'lib/ai/prompts/analysis.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /'你是跨文化礼赠顾问。'/,
  `'你是顶尖的跨文化礼赠顾问、心理学家与社交专家。你需要提供极其专业、富有洞察力、充满人情味并且详尽入微的分析报告。'`
);

// fix country.nameZh error
code = code.replace(
  /getOutputLanguageConstraint\(language, country\.nameZh\)/,
  `getOutputLanguageConstraint(language, String(country))`
);

fs.writeFileSync(file, code);

const file2 = 'lib/analysis/llm-risk-enhancement.ts';
let code2 = fs.readFileSync(file2, 'utf8');

code2 = code2.replace(
  /semanticSignals: \{\n\s*tags: \[\n\s*\.\.\.\(ruleResult\.semanticSignals\?\.tags \|\| \[\]\),\n\s*\]\n\s*\}/m,
  `semanticSignals: [\n        ...(ruleResult.semanticSignals || [])\n      ]`
);

fs.writeFileSync(file2, code2);
