const fs = require('fs');
const file = 'components/gifting/home/sections/step-analysis.tsx';
let content = fs.readFileSync(file, 'utf8');

// Right Column AI draft text needs more space to breathe
content = content.replace(/text-\[11px\] leading-relaxed/g, 'flex-1 text-[13px] leading-relaxed');

// Ensure Reading lenses card isn't trying to stretch, just stays at bottom
// Actually the previous replace was: 
// '<div className="mt-4 flex flex-1 flex-col rounded-[1rem] border'
// But there were MULTIPLE dividers using that same class! Let's check how many there are.
