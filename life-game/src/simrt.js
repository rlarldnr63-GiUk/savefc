const fs=require('fs');
(0,eval)(['data_core.js','events2.js','extra.js','news.js','engine.js','flow.js','realtime.js','talent.js','story.js','snowball.js','jobs2.js','fixes.js','mbti.js','names.js','marriage.js','reflect.js','socdata.js','life2.js','rare.js','income.js','news_live.js'].map(f=>fs.readFileSync(__dirname+'/'+f,'utf8')).join('\n')+`
const o=simulateRT(+process.argv[2]||500); const c=o.cards.sort((a,b)=>a-b), a=o.ages.sort((x,y)=>x-y);
console.log('errors',o.errors.length,o.errors[0]||''); console.log('age median',a[a.length>>1],'cards p10/50/90',c[c.length*.1|0],c[c.length>>1],c[c.length*.9|0]); console.log(JSON.stringify(o.endings));`);
