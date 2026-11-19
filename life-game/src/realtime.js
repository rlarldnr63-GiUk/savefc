/* ===== 실시간 진행: 1년 계획 · 월 단위 시계 ===== */
const NEWS_MONTH = {1997:12, 2002:6, 2008:9, 2010:11, 2015:6, 2016:3, 2020:3, 2022:12, 2024:12, 2005:3, 2012:7, 2017:11, 2018:7, 2021:5, 2023:4, 2025:2};
NEWS.forEach(n=>{ if(n.m==null && NEWS_MONTH[n.y]!=null) n.m = NEWS_MONTH[n.y]; });
if(/2016.*촛불/.test('')){}
NEWS.forEach(n=>{ if(n.h.includes('촛불')) n.m=11; if(n.h.includes('포켓몬')) n.m=7; if(n.h.includes('롱패딩')) n.m=11; if(n.h.includes('최저임금')) n.m=7; if(n.h.includes('강남스타일')) n.m=9; });

nEvents = function(S){ const a=S.age; if(a<=18) return 3; if(a<=35) return R()<.4?3:2; if(a<=65) return 2; return R()<.5?2:1; };

const ACT_KEYS = ['study','exercise','rest','fun','social','style','work','family'];
const SNAME = {...SK, 돈:'돈', spec:'스펙', par:'부모님과의 관계', kid:'자녀와의 관계', risk:'일탈'};
function actInfo(S,k){
  const a=S.age, student = a>=7 && a<=18 && !S.f.has('자퇴') && S.armyLeft===0;
  const kids = S.kids>0, married = S.f.has('기혼');
  switch(k){
    case 'study': return {label: a<7?'배우기 놀이': a<19?'공부': S.studying?'전공 공부':'자기계발', eff: (a<19||S.studying)?{학:1.3*S.talent, 행:-.3}:{학:.5, spec:1.5, 행:-.2, 돈:-10}, min: student?3:(S.studying?2:0), lock: student?'학교 수업':(S.studying?'수업':''), ok:true};
    case 'exercise': return {label: a<7?'뛰어놀기':'운동', eff:{체:1.6, 멘:.3}, min:0, ok:true};
    case 'rest': return {label:'휴식·잠', eff:{멘:1.3, 체:.4}, min:0, ok:true};
    case 'fun': return {label: a<13?'놀기':'취미·놀기', eff:{행:1.6, 학:-.2}, min:0, ok:true};
    case 'social': return {label: a<13?'친구랑 놀기': a<25?'친구':'모임·인맥', eff:{인:1.5, 행:.4, ...(a>=19?{돈:-10}:{})}, min:0, ok:a>=3};
    case 'style': return {label:'꾸미기', eff:{매:1.4, 돈:a>=19?-20:-2}, min:0, ok:a>=12};
    case 'work': {
      if(S.armyLeft>0) return {label:'군 복무', eff:{체:.6, 멘:-.3}, min:6, lock:'복무', ok:true};
      if(S.job) return {label:`일 (${S.job.name})`, eff:{spec:1, 멘:-.4, 체:-.2, 돈:Math.round(S.job.sal*.015)}, min:S.job.kind==='자영'?5:4, lock:'근무', ok:true};
      return {label:'알바', eff:{돈:120, 체:-.4, 학:-.15}, min:0, ok:a>=15 && !S.retired || (S.retired && a<75)};
    }
    case 'family': return {label: a<19?'가족과 시간':'가족', eff: a<19?{par:1.2, 행:.5}:{kid:kids?1.5:0, par:.8, 행:.6, 멘:.3}, min:0, ok: a<19 || married || kids};
  }
}
function acts(S){ return ACT_KEYS.map(k=>({k, ...actInfo(S,k)})).filter(x=>x.ok); }
function recommendAlloc(S){
  const a=S.age, A={};
  if(a<4){ const rich=S.wealth>=8; Object.assign(A,{study:rich?3:1, exercise:2, rest:3, fun:3-(rich?2:0), family:1}); A.fun=Math.max(A.fun,1); }
  else if(S.armyLeft>0) Object.assign(A,{work:6, exercise:2, rest:2});
  else if(a<=18) Object.assign(A,{study:4, exercise:1, rest:2, fun:2, social:1});
  else if(S.studying) Object.assign(A,{study:3, social:2, rest:2, fun:1, work:1, style:1});
  else if(S.job) Object.assign(A,{work:5, rest:2, fun:1, exercise:1, family:1});
  else if(S.retired) Object.assign(A,{rest:3, exercise:3, fun:2, social:2});
  else Object.assign(A,{study:4, rest:2, work:2, fun:1, social:1});
  return fixAlloc(S,A);
}
function fixAlloc(S,A){
  const list=acts(S), out={}; let tot=0;
  list.forEach(x=>{ out[x.k]=Math.max(x.min, A[x.k]||0); tot+=out[x.k]; });
  // 합계 10으로 맞추기
  const order=['rest','fun','exercise','social','study','style','family','work'].filter(k=>out[k]!=null);
  let guard=0;
  while(tot>10 && guard++<50){ for(const k of order){ const mn=list.find(x=>x.k===k).min; if(tot>10 && out[k]>mn){ out[k]--; tot--; } } }
  while(tot<10 && guard++<100){ out[order[guard%order.length]]++; tot++; }
  return out;
}
function allocEffects(S,A){
  const tot={};
  acts(S).forEach(x=>{ const p=A[x.k]||0; for(const k in x.eff){ tot[k]=(tot[k]||0)+x.eff[k]*p; } });
  if((A.study||0)+(A.work||0)>=8){ tot.체=(tot.체||0)-4; tot.멘=(tot.멘||0)-4; }
  return tot;
}
function statTargets(S,A){
  const p=k=>A[k]||0, a=S.age, over=(p('study')+p('work')>=8)?1:0;
  return {
    학: clamp(18 + p('study')*(a<26||S.studying?11:7)*S.talent + (S.f.has('학군지')?4:0), 5, 98),
    체: clamp(62 + p('exercise')*7 + p('rest')*2 - over*10 - Math.max(0,a-40)*.9 - (S.f.has('지병')?12:0), 5, 98),
    멘: clamp(38 + p('rest')*7 + p('fun')*2 + p('family')*2 - over*12 - (p('work')>=6?6:0), 5, 98),
    행: clamp(34 + p('fun')*7 + p('social')*3 + p('family')*3 - Math.max(0,p('study')-4)*4 - over*6, 5, 98),
    인: clamp(22 + p('social')*10 + p('work')*1.5 + (a<19?6:0), 5, 98),
    매: clamp(28 + p('style')*10 + p('exercise')*2, 5, 98),
  };
}
function allocExtras(S,A){ // 쌓이는 값: 돈 · 스펙 · 관계
  const tot={}; acts(S).forEach(x=>{ const pt=A[x.k]||0; for(const k in x.eff){ if(!SK[k]) tot[k]=(tot[k]||0)+x.eff[k]*pt; } }); return tot;
}
function monthTick(S){
  const A=S.alloc||recommendAlloc(S), T=statTargets(S,A);
  for(const k in T) S.s[k] += (T[k]-S.s[k])*.035;
  const e=allocExtras(S,A), m={}; for(const k in e) m[k]=e[k]/12; add(S,m);
}
const MS_MONTH = {birth:1, highschool:2, suneung:11, grad:2, track:3, retire:12};
function scheduleYear(S){
  const items = S.queue.splice(0);
  const used=new Set(); const sched=[];
  const free=()=>{ for(let t=0;t<30;t++){ const m=ri(1,12); if(!used.has(m)){ used.add(m); return m; } } return ri(1,12); };
  items.forEach(d=>{
    let m;
    if(d.kind==='death') m=ri(1,12);
    else if(d.kind==='ms') m = MS_MONTH[d.name] ?? free();
    else if(d.kind==='news') m = NEWS[d.idx].m ?? free();
    else if(d.kind==='info') m = /입학/.test(d.title)?3:free();
    else m=free();
    used.add(m); sched.push({m, d});
  });
  if(sched.some(x=>x.d.kind==='death')){ const dm=sched.find(x=>x.d.kind==='death').m; for(const x of sched) if(x.d.kind!=='death' && x.m>dm) x.m=dm; }
  sched.sort((a,b)=>a.m-b.m || (a.d.kind==='death')-(b.d.kind==='death'));
  if(THINK_AGES.includes(S.age) && !S.dead && !sched.some(x=>x.d.kind==='death')) sched.push({m:6, d:{kind:'think'}});
  sched.sort((a,b)=>a.m-b.m);
  S.sched=sched; S.month=0; S.monthDone=0;
  S.yearStart={...S.s, 돈:S.money, year:S.year, age:S.age};
}
const MONTH_LINE = {
  child:{1:'설날. 세뱃돈을 엄마가 “맡아준다”며 가져갔다.',2:'봄방학. 하루 종일 만화를 봤다.',3:'새 학기. 새 짝꿍이 생겼다.',4:'벚꽃이 폈다. 소풍 도시락은 김밥.',5:'어린이날! 놀이공원은 사람 반 줄 반.',6:'여름이 시작됐다. 수박이 달다.',7:'장마. 우산을 또 잃어버렸다.',8:'여름방학. 할머니 댁, 계곡, 모기.',9:'2학기. 방학 숙제를 벼락치기로 끝냈다.',10:'운동회와 가을 소풍.',11:'첫눈이 왔다.',12:'크리스마스. 산타 선물을 기다린다.'},
  teen:{1:'겨울방학. 학원 특강 시간표가 빼곡하다.',2:'새 학년 반 배정 발표. 친구들과 갈렸다.',3:'새 학기. 첫 모의고사 날짜가 잡혔다.',4:'중간고사 2주 전. 독서실 자리를 잡았다.',5:'중간고사 끝! 노래방으로.',6:'기말고사 준비. 에어컨 앞자리 쟁탈전.',7:'방학식. 하지만 방학은 학원의 시작.',8:'여름방학 보충수업. 매미 소리가 시끄럽다.',9:'2학기. 수시 이야기가 들린다.',10:'중간고사. 단풍은 창밖에만.',11:'수능 날이다. 후배들이 응원하러 간다.',12:'기말고사가 끝났다. 겨울이 왔다.'},
  adult:{1:'새해 계획을 세웠다. 헬스장 등록.',2:'연말정산 서류를 챙겼다.',3:'봄. 미세먼지 경보가 떴다.',4:'벚꽃 시즌. 여의도는 사람으로 꽉 찼다.',5:'가정의 달. 어버이날 용돈이 나갔다.',6:'상반기 마감. 야근이 늘었다.',7:'장마. 출근길 신발이 젖었다.',8:'여름휴가. 바다는 사람 반 물 반.',9:'추석 준비. 고속도로가 막힌다.',10:'가을. 단풍 구경을 계획만 했다.',11:'김장철. 본가에서 김치를 받아 왔다.',12:'송년회 시즌. 간이 쉴 틈이 없다.'},
  old:{1:'설날. 자식들이 올지 전화를 기다린다.',2:'아직 춥다. 무릎이 쑤신다.',3:'봄볕에 공원 벤치에 앉았다.',4:'꽃구경을 다녀왔다.',5:'어버이날. 카네이션이 왔다(또는 오지 않았다).',6:'텃밭에 상추를 심었다.',7:'장마. 관절이 먼저 안다.',8:'폭염. 경로당 에어컨 아래 모였다.',9:'추석. 손주들 키가 또 컸다.',10:'단풍놀이 관광버스.',11:'김장을 했다. 이번엔 조금만.',12:'한 해가 또 갔다.'},
};
function monthLine(S,m){ const a=S.age; const t=a<13?'child':a<19?'teen':a<65?'adult':'old'; if(S.armyLeft>0) return ['혹한기 훈련.','행군 40km.','PX에서 냉동식품.','유격 훈련.','휴가 D-30.','부대 체육대회.','장마철 제초 작업.','훈련 없는 주말.','추석 당직.','진지 공사.','첫눈 제설 작업.','연말 전투휴무.'][m-1]; return MONTH_LINE[t][m]; }

function serializeRT(S){ if(!S) return null; return JSON.stringify({...S, f:[...S.f], titles:[...S.titles], seen:[...S.seen], queue:S.queue.map(d=>{const c={...d}; delete c._m; return c;}), sched:(S.sched||[]).map(x=>{const c={...x.d}; delete c._m; return {m:x.m, d:c};})}); }

/* 자동 플레이 (실시간 구조) */
function simulateRT(n){
  const out={ages:[], errors:[], endings:{}, cards:[]};
  for(let k=0;k<n;k++){
    try{
      newGame(); scheduleYear(S); let cards=0, yrs=0;
      const play=d=>{ if(d.kind==='death'){ S.dead=true; return; } if(d.kind==='think') return; if(typeof stillValid==='function' && !stillValid(S,d)) return; const c=buildCard(S,d); cards++; const ok=c.choices.map((x,i)=>x.ok?i:-1).filter(i=>i>=0); resolveCard(S,d, ok.length?pick(ok):-1); };
      while(!S.dead && yrs<130){
        const A={}; acts(S).forEach(x=>A[x.k]=ri(0,3)); S.alloc=fixAlloc(S,A);
        for(let m=1;m<=12 && !S.dead;m++){
          monthTick(S);
          while(S.sched.length && S.sched[0].m<=m && !S.dead){ play(S.sched.shift().d); while(S.queue.length && !S.dead) play(S.queue.shift()); }
        }
        if(S.dead) break;
        advance(S); scheduleYear(S); yrs++;
      }
      const e=ending(S); out.ages.push(S.age); out.endings[e.title]=(out.endings[e.title]||0)+1; out.cards.push(cards);
    }catch(err){ out.errors.push(String(err.stack||err)); }
  }
  return out;
}
