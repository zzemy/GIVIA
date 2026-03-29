const fs = require('fs');

const file = 'lib/ai/prompts/analysis.ts';
let content = fs.readFileSync(file, 'utf8');

// In buildRiskEnhancementPrompt, improve instructions:
content = content.replace(
  /'你是跨文化礼物选择专家，需要提供语义级别的风险解释和个性化缓解建议。'/,
  "'你是跨文化礼物选择专家，需要提供语义级别的风险解释和个性化缓解建议。最重要的是：如果没有生硬的文化禁忌，请从收礼人的身份关系、日常体面度和实用性出发进行“得体心理学”分析，绝不要无中生有地生搬硬套鬼神禁忌。'"
);

content = content.replace(
  /'You are a cross-cultural gifting expert who provides semantic-level risk explanation and personalized mitigation\.'/,
  "'You are a cross-cultural gifting expert. If there are no severe cultural taboos, do not invent or force pseudo-taboos. Instead, analyze the psychological appropriateness, etiquette, relationship depth, and utility of the gift.'"
);

content = content.replace(
  /'semanticExplanation：从文化心理学角度解释风险，2-3 句。'/,
  "'semanticExplanation：从文化心理学或身份得体角度解释目前的综合评分由来（不要硬扯禁忌，关注人际关系的恰当性），2-3 句。'"
);

// We need to inject the language preference to buildRiskEnhancementPrompt as well to enforce NO Chinese in english mode, NO English in zh mode.
// It is already using `isZh` to output instructions in the respective language, which usually bounds the LLM. 
// However, the rule explicitly:
content = content.replace(
  /isZh \? '必须只输出 JSON，不要输出额外解释。' : 'Reply with JSON only and no extra explanation\.',/,
  `isZh ? '必须只输出 JSON，不要输出额外解释。返回的所有文案必须是纯中文。' : 'Reply with JSON only and no extra explanation. ALL returned text must be strictly in English.',`
);

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed buildRiskEnhancementPrompt');
