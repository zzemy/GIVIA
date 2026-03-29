const fs = require('fs');
const path = 'lib/ai/schemas/analysis-schema.ts';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /type: 'string', maxLength: 80/g,
  "type: 'string', maxLength: 500"
);

fs.writeFileSync(path, code);
console.log('Fixed max length.');
