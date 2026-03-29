const fs = require('fs');
const file = 'components/gifting/home/sections/step-analysis.tsx';
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/<div className="mt-1\.5 grid gap-1\.5 md:grid-cols-3">\n\s*<SelectField/g, '<div className="mt-1.5 grid gap-1.5 md:grid-cols-2">\n              <SelectField');
// Because of the sed inserted line, I need to clean it up better.
