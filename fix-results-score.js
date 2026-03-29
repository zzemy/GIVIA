const fs = require('fs');

const file = 'components/gifting/home/sections/results-section.tsx';
let content = fs.readFileSync(file, 'utf8');

// The original UI has:
// <div>
//   <p className="font-mono text-[10px] uppercase tracking-wider text-[#9aa3b2] mb-1">{isZh ? '综合风险评级' : 'RISK LEVEL'}</p>
//   <p className={\`text-sm font-bold font-mono uppercase \${analysis.riskLevel === 'High' ? 'text-red-500' : analysis.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-600'}\`}>
//     {analysis.riskLevel}
//   </p>
// </div>

content = content.replace(
  /\{isZh \? '综合风险评级' : 'RISK LEVEL'\\}<\/p>\n\s*<p className=\{\`text-sm font-bold font-mono uppercase \\\$\{.*?\}\`\}>\n\s*\{analysis\.riskLevel\}\n\s*<\/p>/,
  `{isZh ? '量化风险评定' : 'QUANTIFIED RISK'}</p>
             <div className="flex items-baseline gap-2">
               <span className={\`text-sm font-bold font-mono \${analysis.riskLevel === 'High' ? 'text-red-500' : analysis.riskLevel === 'Medium' ? 'text-amber-500' : 'text-emerald-600'}\`}>
                 {analysis.riskScore || 0}<span className="text-[10px] text-[#9aa3b2]">/100</span>
               </span>
               <span className={\`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded \${analysis.riskLevel === 'High' ? 'bg-red-50 text-red-600' : analysis.riskLevel === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}\`}>
                 {analysis.riskLevel}
               </span>
             </div>`
);

// We also need to add more detail to the reason of "no hard taboos" to give more information
// Let's modify the empty rule state:
content = content.replace(
  /\{isZh \? '此物未显式触发本地禁止条规，核心在于表达形式。' : 'No hard local rules broken\. Focus is on expression\.'\}/,
  `{isZh ? '此物未显式触发不可逾越的地方法规或硬性禁忌。当前风险分数主要来源于该对象、关系与场景下的得体度与心理预期落差，核心需通过包装与文案来提升仪式感。' : 'No hard local rules broken. Risk score primarily reflects etiquette alignment based on the relationship and occasion. Focus is on reframing through packaging and tone.'}`
)

fs.writeFileSync(file, content, 'utf8');
console.log('Fixed results styling for score');
