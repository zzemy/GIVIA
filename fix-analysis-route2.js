const fs = require('fs');
const file = 'app/api/analysis/run/route.ts';
let code = fs.readFileSync(file, 'utf8');

if (!code.includes('getCountryName')) {
  code = code.replace(
    /import \{ getCountryName \} from '@\/lib\/countries'/,
    ''
  ); // remove if exists
  code = `import { getCountryName } from '@/lib/countries'\n` + code;
}

code = code.replace(
  /const countryCode = sanitizeTextValue\(body\.countryCode, \{ maxLength: 16 \}\)/,
  `const countryCode = sanitizeTextValue(body.countryCode, { maxLength: 16 });\n    const resolvedCountryName = getCountryName(countryCode || '', 'en') !== (countryCode || '') ? getCountryName(countryCode || '', 'en') : country;`
);

code = code.replace(
  /country: country \|\| countryCode \|\| 'Unknown',/g,
  `country: resolvedCountryName || country || countryCode || 'Unknown',`
);

fs.writeFileSync(file, code);
