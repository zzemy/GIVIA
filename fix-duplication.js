const fs = require('fs');
const file = 'components/gifting/home/utils/home-page-helpers.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /if \(analysis\.warning\) \{\n    reasons\.push\(analysis\.warning\)\n  \}/g,
  `// Warning is already displayed in summaryBody directly in UI`
);

fs.writeFileSync(file, code);
