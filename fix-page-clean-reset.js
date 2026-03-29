const fs = require('fs');
const file = 'app/[locale]/gifting/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /<ResultsSection \{\.\.\.resultsProps\} \/>/g,
  `<ResultsSection {...resultsProps} onReset={() => {
                  setCurrentStep(1)
                  if (!isDevPreview) {
                    router.push(\`/\${routeLocale}/gifting\`)
                  }
                  resultsProps.onReset()
                }} />`
);

fs.writeFileSync(file, code);
