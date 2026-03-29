const fs = require('fs');
const file = 'components/gifting/home/sections/step-analysis.tsx';
let content = fs.readFileSync(file, 'utf8');

const target = `<div className="mt-2 flex flex-wrap items-center gap-3">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(36,32,27,0.12)] bg-transparent px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-[#24201b] transition hover:-translate-y-0.5 hover:bg-[rgba(36,32,27,0.04)]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {isZh ? '返回上一步' : 'Back'}
                    </button>
                  )}
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(36,32,27,0.12)] bg-transparent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#24201b] transition hover:-translate-y-0.5 hover:bg-[rgba(36,32,27,0.04)]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {isZh ? '返回上一步' : 'Back'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onAnalyze}
                    disabled={!canAnalyze || isAnalyzing}
                    className="inline-flex items-center gap-2 rounded-full bg-[#24201b] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#17130f] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <Wand2 className="h-4 w-4" />
                    {isAnalyzing ? (isZh ? \`开始推演 \${analyzingElapsedSeconds}s\` : \`Composing \${analyzingElapsedSeconds}s\`) : isZh ? '开始文化推演' : 'Begin cultural judgment'}
                  </button>
                </div>
              </div>`;

const replacement = `<div className="mt-2 flex flex-wrap items-center gap-3">
                  {onBack && (
                    <button
                      type="button"
                      onClick={onBack}
                      className="inline-flex items-center gap-2 rounded-full border border-[rgba(36,32,27,0.12)] bg-transparent px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-[#24201b] transition hover:-translate-y-0.5 hover:bg-[rgba(36,32,27,0.04)]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {isZh ? '返回上一步' : 'Back'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={onAnalyze}
                    disabled={!canAnalyze || isAnalyzing}
                    className="inline-flex items-center gap-2 rounded-full bg-[#24201b] px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5 hover:bg-[#17130f] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                  >
                    <Wand2 className="h-4 w-4" />
                    {isAnalyzing ? (isZh ? \`开始推演 \${analyzingElapsedSeconds}s\` : \`Composing \${analyzingElapsedSeconds}s\`) : isZh ? '开始文化推演' : 'Begin cultural judgment'}
                  </button>
                </div>`;

if (content.includes(target)) {
  content = content.replace(target, replacement);
  fs.writeFileSync(file, content, 'utf8');
  console.log("Success replacing exact duplicate html block.");
} else {
  console.log("Could not find the block. I will use regex.");
}
