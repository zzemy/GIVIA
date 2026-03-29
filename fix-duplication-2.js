const fs = require('fs');
const file = 'components/gifting/home/utils/home-page-helpers.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /if \(analysis\.rescueReason\) \{\n\s*tips\.push\([^)]+\)\n\s*\}/g,
  `// rescueReason is rendered in openingRecommendationReason directly`
);

fs.writeFileSync(file, code);
