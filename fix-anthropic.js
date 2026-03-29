const fs = require('fs');
const path = 'lib/analysis/llm-risk-enhancement.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(/async function requestAnthropicCompletion[\s\S]*$/, '');

fs.writeFileSync(path, code);
console.log('Removed Anthropic function.');
