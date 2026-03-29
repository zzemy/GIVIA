const fs = require('fs');
const file = 'app/api/analysis/run/route.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /if \(aiResponse\.ok\) \{/,
  `if (aiResponse.ok) {
        console.log("[Analysis Run] AI Overlay fetch OK!");`
);

code = code.replace(
  /\} catch \{\n\s*\/\/ Local rules remain/,
  `} else { console.error("[Analysis Run] AI Overlay fetch Failed:", aiResponse.status, await aiResponse.text()); }
    } catch (e) {
      console.error("[Analysis Run] AI Enhancement try catch failed:", e);
      // Local rules remain`
);

fs.writeFileSync(file, code);
