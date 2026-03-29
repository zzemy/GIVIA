const fs = require('fs');
const file = 'app/[locale]/gifting/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /React\.useEffect\(\(\) => \{\n    if \(\!isDevPreview\) \{\n      return\n    \}\n\n    const nextHref = \`\/\$\{routeLocale\}\/gifting\?dev=1\&step=\$\{currentStep\}\`/g,
  `React.useEffect(() => {
    if (!isDevPreview && currentStep === 5 && !resultsProps) {
      setCurrentStep(1)
    }
  }, [isDevPreview, currentStep, resultsProps])

  React.useEffect(() => {
    if (!isDevPreview) {
      return
    }

    const nextHref = \`/\${routeLocale}/gifting?dev=1&step=\${currentStep}\``
);

fs.writeFileSync(file, code);
