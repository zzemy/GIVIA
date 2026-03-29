const fs = require('fs');
const file = 'components/gifting/home/sections/results-section.tsx';
let d = fs.readFileSync(file, 'utf8');

d = d.replace(
  '<div \n               className="h-full min-h-[24rem] bg-cover bg-center border-b lg:border-b-0 lg:border-r border-[#e2ddd5]"\n               style={{\n                 backgroundImage: \\`linear-gradient(180deg,rgba(18,15,13,0),rgba(18,15,13,0.05)),url(\\${reportPhotography.note})\\`,\n               }}\n             />',
  `<div 
               className="relative h-full min-h-[24rem] bg-cover bg-center border-b lg:border-b-0 lg:border-r border-[#e2ddd5]"
               style={{
                 backgroundImage: \\\`linear-gradient(180deg,rgba(18,15,13,0),rgba(18,15,13,0.12)),url(\\\${reportPhotography.note})\\\`,
               }}
             >
               <div className="absolute bottom-6 left-6 flex">
                 <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 text-[10px] uppercase tracking-widest text-[#1c1a17]">
                   {isZh ? '灵感视觉 · Visual Reference' : 'Visual Reference'}
                 </span>
               </div>
             </div>`
);

fs.writeFileSync(file, d);
