const fs = require('fs');
const file = 'app/api/cultural-generate/route.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /export async function POST\(request: Request\) \{/g,
  `export async function POST(request: Request) {\n  console.log("--> API CALLED: /api/cultural-generate");`
);

code = code.replace(
  /return NextResponse\.json\(\s*\{\s*error: (.*?)\s*\},/g,
  `console.log("--> API ERROR RESULT:", $1);\n      return NextResponse.json({ error: $1 },`
);

code = code.replace(
  /const response = await generateDashscopeCompleton/g,
  `console.log("--> CALLING DASHSCOPE...");\n    const response = await generateDashscopeCompleton`
);

code = code.replace(
  /status: 500/g,
  `status: 500, errorDetails: 'see console'`
);

fs.writeFileSync(file, code);
