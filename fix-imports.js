const fs = require('fs');
const path = 'lib/analysis/llm-risk-enhancement.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /import type \{ ModelMessage, NormalizedModelCompletionResult \} from '@\/lib\/ai\/adapters\/types'\n/,
  ""
);

fs.writeFileSync(path, code);
console.log('Fixed imports.');
