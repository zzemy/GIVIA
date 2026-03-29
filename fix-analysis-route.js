const fs = require('fs');
const file = 'app/api/analysis/run/route.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /const country = sanitizeTextValue\(body\.country, \{ maxLength: 64 \}\)/,
  `const country = sanitizeTextValue(body.country, { maxLength: 64 });\n    const resolvedCountryName = getCountryName(body.countryCode || '', 'en') !== (body.countryCode || '') ? getCountryName(body.countryCode || '', 'en') : country;`
);

code = code.replace(
  /country: country \|\| countryCode \|\| 'Unknown',/,
  `country: resolvedCountryName || country || countryCode || 'Unknown',`
);

// wait, I need to make sure getCountryName is imported in route.ts!
