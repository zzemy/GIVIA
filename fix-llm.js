const fs = require('fs');
const path = 'lib/analysis/llm-risk-enhancement.ts';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes("import { requestDashScopeCompletion }")) {
  code = code.replace(
    /import { buildRiskEnhancementPrompt } from '@\/lib\/ai\/prompts\/analysis'/,
    "import { buildRiskEnhancementPrompt } from '@/lib/ai/prompts/analysis'\nimport { requestDashScopeCompletion } from '@/lib/ai/adapters/dashscope'"
  );
}

const llmFunc = `async function callLLMForRiskEnhancement(prompt: string, locale: P0Locale): Promise<string | null> {
  try {
    void locale

    // Try to use DashScope API
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

code = code.replace(/async function callLLMForRiskEnhancement\([\s\S]*?async function requestAnthropicCompletion/, llmFunc + "\n\nasync function requestAnthropicCompletion");

fs.writeFileSync(path, code);
console.log('Done fixing LLM call.');
