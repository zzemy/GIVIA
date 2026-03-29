const fs = require('fs');
const path = 'lib/analysis/llm-risk-enhancement.ts';
let code = fs.readFileSync(path, 'utf8');

// Add import
if (!code.includes("import { requestDashScopeCompletion }")) {
  code = code.replace(
    /import \{ buildRiskEnhancementPrompt \} from '@\/lib\/ai\/prompts\/analysis'/,
    "import { buildRiskEnhancementPrompt } from '@/lib/ai/prompts/analysis'\nimport { requestDashScopeCompletion } from '@/lib/ai/adapters/dashscope'"
  );
}

// Replace Anthropic logic with DashScope
const llmFunc = `async function callLLMForRiskEnhancement(prompt: string, locale: P0Locale): Promise<string | null> {
  try {
    void locale

    const apiKey = process.env.ALIYUN_DASHSCOPE_API_KEY
    if (!apiKey) {
      console.warn('[LLM] ALIYUN_DASHSCOPE_API_KEY is missing')
      return null
    }

    const completion = await requestDashScopeCompletion({
      apiKey,
      baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
      model: 'qwen-max',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      networkErrorPrefix: '[network error]',
      providerErrorPrefix: '[provider error]',
      temperature: 0.7,
      responseFormat: { type: 'json_object' }
    })

    if (!completion.ok) {
      console.warn('[LLM]', completion.error)
      return null
    }

    return completion.content
  } catch (error) {
    console.warn('[LLM] Request failed:', error)
    return null
  }
}`;

code = code.replace(/async function callLLMForRiskEnhancement[\s\S]*?async function requestAnthropicCompletion/, llmFunc + "\n\nasync function requestAnthropicCompletion");

// Remove requestAnthropicCompletion entirely without touching text below it
code = code.replace(/async function requestAnthropicCompletion[\s\S]*?function parseEnhancementResponse/, "function parseEnhancementResponse");

// Fix mergeLLMEnhancement
code = code.replace(
  /if \(!llmEnhancement \|\| llmEnhancement\.confidence < 0\.5\) \{/,
  "if (!llmEnhancement) {"
);

// Fix warning mapping
code = code.replace(
  /warning:\s+llmEnhancement\.semanticExplanation\s+\|\s+ruleResult\.warning,/m,
  "warning:\n      (llmEnhancement.culturalContext && llmEnhancement.semanticExplanation)\n        ? `${llmEnhancement.culturalContext}\\n\\n${llmEnhancement.semanticExplanation}`\n        : (llmEnhancement.semanticExplanation || ruleResult.warning),"
);

// Fix rescueReason
code = code.replace(
  /semanticSignals:\s+\[\s*\.\.\.\(ruleResult\.semanticSignals\s*\|\|\s*\[\]\),\s*llmEnhancement\.culturalContext\s*\]\.filter\(Boolean\)/g,
  "semanticSignals: [...(ruleResult.semanticSignals || [])].filter(Boolean)"
);

fs.writeFileSync(path, code);
console.log('Fixed stuff.');
