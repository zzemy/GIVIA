const fs = require('fs');
const file = 'app/api/analysis/run/route.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\} catch \{\n\s*\/\/ Local rules remain as the guaranteed fallback when AI generation is unavailable\.\n\s*\}/,
  `} catch (e) {
      console.error("[Analysis Run] AI Enhancement fetch failed:", e);
      // Local rules remain as the guaranteed fallback when AI generation is unavailable.
    }`
);

fs.writeFileSync(file, code);
