const fs = require('fs');
const file = 'app/api/cultural-generate/route.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /\} catch \(error\) \{/g,
  `} catch (error) {\n    fs.appendFileSync('/tmp/next-debug.log', "--> ERROR THROWN:\\n" + (error.stack || error) + "\\n");`
);

fs.writeFileSync(file, code);
