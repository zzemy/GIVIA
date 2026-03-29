const fs = require('fs');
const file = 'lib/ai/prompts/analysis.ts';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(
  /'你是跨文化礼物选择专家，需要提供语义级别的风险解释和个性化缓解建议。最重要的是：如果没有生硬的文化禁忌，请从收礼人的身份关系、日常体面度和实用性出发进行“得体心理学”分析，绝不要无中生有地生搬硬套鬼神禁忌。'/,
  `'你是世界顶级的社会心理学家与跨文化礼赠顾问。你需要提供极其专业、富有洞察力、充满人情味并且详尽入微的“得体心理学”分析，深入收礼人内心。不要简短，要详细阐述、极具说服力。'`
);

code = code.replace(
  /'semanticExplanation：从文化心理学或身份得体角度解释目前的综合评分由来（不要硬扯禁忌，关注人际关系的恰当性），2-3 句。'/,
  `'semanticExplanation：从文化心理学或身份得体角度极其详尽地解释评分由来，深度剖析人际关系与社会潜规则，字数必须充足丰富。'`
);

code = code.replace(
  /'personalizedMitigation：给出针对该收礼人和场景的具体缓解建议。'/,
  `'personalizedMitigation：提供极度细节的具体降级、缓解与补救策略（包含包装、动作、时机等极具体的微操），必须充满人情味。'`
);

code = code.replace(
  /'alternativeFraming：说明如何通过语言或包装重新诠释礼物。'/,
  `'alternativeFraming：说明如何通过极为高情商的叙事语言或极具巧思的包装设计重新赋予礼物正面的意义，并提供一套完整的话术模板。'`
);

code = code.replace(
  /'culturalContext：简要说明当地文化中的历史或社会背景。'/,
  `'culturalContext：深度补充当地社会文化、阶层审美或人际交往的隐含规则背景，字数要详实丰富。'`
);

fs.writeFileSync(file, code);
