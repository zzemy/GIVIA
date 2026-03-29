const fs = require('fs');
const file = 'app/api/analysis/run/route.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /if \(aiResponse\.ok\) \{/,
  `if (aiResponse.ok) {
        console.log("[Analysis Run] AI Overlay fetch OK!");`
);

code = code.replace(
  /\} catch \(e\) \{/,
  `} else {
        console.error("[Analysis Run] AI Overlay fetch NOT OK:", aiResponse.status, await aiResponse.text());
      }
    } catch (e) {`
);

fs.writeFileSync(file, code);
