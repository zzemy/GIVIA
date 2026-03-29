const fs = require('fs');
const file = 'components/gifting/home/sections/results-section.tsx';
let d = fs.readFileSync(file, 'utf8');

d = d.replace(
  /const openingRecommendation =\s+topRecommendation\s+\?\s+isZh\s+\?\s+topRecommendation\.nameZh\s+:\s+topRecommendation\.nameEn\s+:\s+analysis\.rescueItem \|\| \(isZh \? '继续细化当前礼物' : 'Refine the current gift further'\)/g,
  `const openingRecommendation = analysis.rescueItem || (topRecommendation ? (isZh ? topRecommendation.nameZh : topRecommendation.nameEn) : (isZh ? '继续细化当前礼物' : 'Refine the current gift further'))`
);

d = d.replace(
  /const openingRecommendationReason =\s+topRecommendation \? \(isZh \? topRecommendation\.reasonZh : topRecommendation\.reasonEn\) : analysis\.rescueReason/g,
  `const openingRecommendationReason = analysis.rescueReason || (topRecommendation ? (isZh ? topRecommendation.reasonZh : topRecommendation.reasonEn) : undefined)`
);

fs.writeFileSync(file, d);
