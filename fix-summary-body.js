const fs = require('fs');
const path = 'components/gifting/home/sections/results-section.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /<p className="text-\[1\.05rem\] leading-\[1\.8\] text-\[#1c1a17\] font-medium">\s*\{summaryBody\}\s*<\/p>/g,
  `{summaryBody.split('\\n').filter(Boolean).map((paragraph, idx) => (
                      <p key={idx} className="text-[1.05rem] leading-[1.8] text-[#1c1a17] font-medium mb-4 last:mb-0">
                        {paragraph}
                      </p>
                    ))}`
);

fs.writeFileSync(path, code);
console.log('Fixed summaryBody rendering.');
