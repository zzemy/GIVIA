const fs = require('fs');
const file = 'components/gifting/home/sections/results-section.tsx';
let d = fs.readFileSync(file, 'utf8');
d = d.replace(/"\{analysis\.greetingCard\.opener\}/g, '&quot;{analysis.greetingCard.opener}');
d = d.replace(/\{analysis\.greetingCard\.closing\}"/g, '{analysis.greetingCard.closing}&quot;');
fs.writeFileSync(file, d);
