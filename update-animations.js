const fs = require('fs');
let content = fs.readFileSync('app/[locale]/page.tsx', 'utf8');

// 1. Header Animation
const oldHeaderAnim = `initial={{ opacity: 0, y: -16 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}`;
const newHeaderAnim = `initial={{ opacity: 0, filter: 'blur(8px)' }}\n          animate={{ opacity: 1, filter: 'blur(0px)' }}\n          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}`;
content = content.replace(oldHeaderAnim, newHeaderAnim);

// 2. Left Section Animation
const oldLeftAnim = `initial={{ opacity: 0, y: 24 }}\n            animate={{ opacity: 1, y: 0 }}\n            transition={{ duration: 0.95, delay: 0.06, ease: [0.16, 1, 0.3, 1] }}`;
const newLeftAnim = `initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}\n            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}\n            transition={{ duration: 1.4, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}`;
content = content.replace(oldLeftAnim, newLeftAnim);

// 3. Grid Container Stagger
const oldStagger = `transition: { staggerChildren: 0.2, delayChildren: 0.15 }`;
const newStagger = `transition: { staggerChildren: 0.25, delayChildren: 0.35 }`;
content = content.replace(oldStagger, newStagger);

// 4. Grid Articles (Cards) Animation
const oldCardAnim = `hidden: { opacity: 0, y: 30, scale: 0.96 },\n                show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }`;
const newCardAnim = `hidden: { opacity: 0, y: 50, filter: 'blur(12px)' },\n                show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.4, ease: [0.22, 1, 0.36, 1] } }`;
content = content.replaceAll(oldCardAnim, newCardAnim);

fs.writeFileSync('app/[locale]/page.tsx', content);
