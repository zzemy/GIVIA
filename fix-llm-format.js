const fs = require('fs');
const path = 'lib/analysis/llm-risk-enhancement.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /temperature: 0\.7,\n    \}\)/,
  "temperature: 0.7,\n      responseFormat: { type: 'json_object' }\n    })"
);

fs.writeFileSync(path, code);
console.log('Fixed JSON format.');
