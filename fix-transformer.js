const fs = require('fs');

const file = 'lib/ai/transformers/vision-recognition.ts';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /itemZh: containsChinese\(compact\) \? compact : categoryLabel\.zh,/,
  "itemZh: containsChinese(compact) ? compact : (categoryLabel.zh === '礼物对象' ? compact : categoryLabel.zh),"
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed transformer in vision-recognition.ts');
