const fs = require('fs');
const file = 'app/api/cultural-generate/route.ts';
let code = fs.readFileSync(file, 'utf8');

code = `import * as fs from 'fs';\n` + code;

code = code.replace(
  /console.log\("(.*?)", (.*?)\);/g,
  `fs.appendFileSync('/tmp/next-debug.log', "$1 " + $2 + "\\n");`
);

code = code.replace(
  /console.log\("(.*?)"\);/g,
  `fs.appendFileSync('/tmp/next-debug.log', "$1\\n");`
);

fs.writeFileSync(file, code);
