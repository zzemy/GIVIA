const fs = require('fs');
const file = 'app/api/analysis/run/route.ts';
let code = fs.readFileSync(file, 'utf8');

const target = `      if (aiResponse.ok) {
        const aiPayload = (await aiResponse.json()) as {
          analysis?: AIAnalysisOverlay
          source?: string
        }

        const validatedOverlay = buildValidatedAIOverlay(analysis, aiPayload.analysis)

        if (validatedOverlay) {
          mergedAnalysis = {
            ...analysis,
            ...validatedOverlay,
          }
          source = aiPayload.source === 'aliyun-dashscope' ? 'hybrid-ai-rules' : source
        }
      }
    } catch {
      // Local rules remain as the guaranteed fallback when AI generation is unavailable.
    }`;

const replacement = `      if (aiResponse.ok) {
        const aiPayload = (await aiResponse.json()) as {
          analysis?: AIAnalysisOverlay
          source?: string
        }

        const validatedOverlay = buildValidatedAIOverlay(analysis, aiPayload.analysis)

        if (validatedOverlay) {
          mergedAnalysis = {
            ...analysis,
            ...validatedOverlay,
          }
          source = aiPayload.source === 'aliyun-dashscope' ? 'hybrid-ai-rules' : source
        } else {
          console.error("[Analysis Run] AI Overlay validatiion failed");
        }
      } else {
        console.error("[Analysis Run] AI Overlay fetch NOT OK:", aiResponse.status, await aiResponse.text());
      }
    } catch (e) {
      console.error("[Analysis Run] AI Enhancement try-catch hit:", e);
      // Local rules remain as the guaranteed fallback when AI generation is unavailable.
    }`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
