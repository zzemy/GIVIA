const fs = require('fs');
let content = fs.readFileSync('app/[locale]/page.tsx', 'utf8');

// 1. Header Animation
content = content.replace(
  /initial=\{\{ opacity: 0, filter: 'blur\(8px\)' \}\}\s*animate=\{\{ opacity: 1, filter: 'blur\(0px\)' \}\}\s*transition=\{\{ duration: 1.2, ease: \[0.22, 1, 0.36, 1\] \}\}/,
  "initial={{ opacity: 0, y: -8 }}\n          animate={{ opacity: 1, y: 0 }}\n          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}"
);

// 2. Left Section Animation
content = content.replace(
  /initial=\{\{ opacity: 0, y: 40, filter: 'blur\(10px\)' \}\}\s*animate=\{\{ opacity: 1, y: 0, filter: 'blur\(0px\)' \}\}\s*transition=\{\{ duration: 1.4, delay: 0.15, ease: \[0.22, 1, 0.36, 1\] \}\}/,
  "initial={{ opacity: 0, y: 16 }}\n            animate={{ opacity: 1, y: 0 }}\n            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}"
);

// 3. Grid Container Stagger
content = content.replace(
  /transition: \{ staggerChildren: 0.25, delayChildren: 0.35 \}/,
  "transition: { staggerChildren: 0.1, delayChildren: 0.1 }"
);

// 4. Grid Articles (Cards) Animation
content = content.replaceAll(
  /hidden: \{ opacity: 0, y: 50, filter: 'blur\(12px\)' \},\s*show: \{ opacity: 1, y: 0, filter: 'blur\(0px\)', transition: \{ duration: 1.4, ease: \[0.22, 1, 0.36, 1\] \} \}/g,
  "hidden: { opacity: 0, y: 16 },\n                show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } }"
);

fs.writeFileSync('app/[locale]/page.tsx', content);
