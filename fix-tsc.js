const fs = require('fs');
const path = 'components/gifting/home/sections/results-section.tsx';
let code = fs.readFileSync(path, 'utf8');

// Replace all occurrences of these lines
const linesToRemove = [
  '  void analysisSource\n',
  '  void hasAnalysisEnhancementResults\n',
  '  void favoriteRecommendationIds\n',
  '  void riskActionMeta\n',
  '  void onToggleFavoriteRecommendation\n',
  '  void reportPhotography\n',
  '  void contextParagraph\n',
  '  void adviceLines\n',
  '  void conclusionCards\n',
  '  void analysisSource',
  '  void hasAnalysisEnhancementResults',
  '  void favoriteRecommendationIds',
  '  void riskActionMeta',
  '  void onToggleFavoriteRecommendation',
  '  void reportPhotography',
  '  void contextParagraph',
  '  void adviceLines',
  '  void conclusionCards',
];

linesToRemove.forEach(line => {
  code = code.split(line).join('');
});

// Insert before the LAST return inside the component, replacing `<section id="results"`
code = code.replace(/return \(\s+<section id="results"/, `
  void analysisSource
  void hasAnalysisEnhancementResults
  void favoriteRecommendationIds
  void riskActionMeta
  void onToggleFavoriteRecommendation
  void reportPhotography
  void contextParagraph
  void adviceLines
  void conclusionCards

  return (
    <section id="results"`);

fs.writeFileSync(path, code);
