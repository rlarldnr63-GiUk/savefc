/* ===== 타고난 재능 · 시간 총량 · 미래 투자 ===== */
const TRAITS = [
  {k:'체격', type:'선천', reveal:0}, {k:'외모', type:'선천', reveal:0},
  {k:'두뇌', type:'선천', reveal:7}, {k:'운동신경', type:'선천', reveal:7},
  {k:'예술감각', type:'혼합', reveal:7},
  {k:'손재주', type:'후천', unlock:5}, {k:'말솜씨', type:'후천', unlock:5}, {k:'외국어', type:'후천', unlock:8},
  {k:'코딩', type:'후천', unlock:12}, {k:'리더십', type:'후천', unlock:14}, {k:'재테크', type:'후천', unlock:20},
];
const TALENTS = TRAITS.map(t=>t.k);
const INNATE = TRAITS.filter(t=>t.type!=='후천').map(t=>t.k);
const TRAIT = {}; TRAITS.forEach(t=>TRAIT[t.k]=t);
const TAL_DESC = {두뇌:'공부 효율', 체격:'체력·건강', 운동신경:'운동선수의 길', 예술감각:'예술가·디자이너의 길', 외모:'배우·모델의 길', 손재주:'셰프·기술자의 길', 말솜씨:'영업·크리에이터의 길', 외국어:'대기업·해외', 코딩:'개발자의 길', 리더십:'승진', 재테크:'투자 수익'};
const TAL_JOB = {운동신경:'운동선수', 체격:'운동선수', 예술감각:'디자이너·예술가', 외모:'배우·모델', 손재주:'셰프', 말솜씨:'영업직', 코딩:'개발자'};
// 실제 능력: 선천은 타고난 값이 대부분(연습은 +25까지), 혼합은 반반, 후천은 노력이 대부분
function ability(S,t){ if(!S||!S.tal) return 0; const tv=S.tal[t]??0, sk=(S.skill&&S.skill[t])||0, ty=TRAIT[t]?.type;
  if(ty==='선천') return clamp(tv+Math.min(25,sk*.4),0,100);
  if(ty==='혼합') return clamp(tv*.55+sk*.65,0,100);
  return clamp(tv*.3+sk,0,100); }
function traitVisible(S,t){ const T=TRAIT[t]; if(T.type==='후천') return S.age>=T.unlock; return T.reveal===0 || S.f.has('재능발견'); }
Object.assign(JOBS, {
  '운동선수':{sal:6000, hon:3, kind:'선수'}, '디자이너·예술가':{sal:3200, hon:2, kind:'자영'}, '배우·모델':{sal:2600, hon:2, kind:'자영'},
  '셰프':{sal:3600, hon:1, kind:'현장'}, '기술자':{sal:4200, hon:1, kind:'현장'}, '영업직':{sal:4500, hon:1, kind:'사무'}, '코치·지도자':{sal:4000, hon:3, kind:'사무'},
});

/* 출생 시 재능 */
const _newGame = newGame;
newGame = function(name, mode){
  const s=_newGame(name, mode);
  const T={};
  INNATE.forEach(t=>T[t]=clamp(Math.round(50+gauss()*13),15,85));
  TRAITS.filter(x=>x.type==='후천').forEach(x=>T[x.k]=ri(0,30));   // 후천: 약간의 성향만
  const star=pick(INNATE); T[star]=clamp(T[star]+ri(22,32),70,99);
  if(R()<.08){ const s2=pick(INNATE.filter(x=>x!==star)); T[s2]=clamp(T[s2]+ri(18,26),65,95); }
  S.tal=T; S.star=star; S.skill={}; TALENTS.forEach(t=>S.skill[t]=0);
  S.focus=star; S.talent=clamp(.78+T.두뇌/220,.8,1.25);
  S.s.매=clamp(S.s.매+(T.외모-50)*.4,5,95); S.s.체=clamp(S.s.체+(T.체격-50)*.3,5,95);
  S.ptMods=[]; S.inv=0;
  return s;
};

/* 시간 총량: 학생 때 가장 많다 */
function ptBase(a){ return a<4?6 : a<7?8 : a<13?12 : a<19?14 : a<30?12 : a<50?10 : a<65?9 : a<80?7 : 6; }
function ptMods(S){ return (S.ptMods||[]).filter(m=>m.until>=S.age); }
function ptTotal(S){ return Math.max(3, ptBase(S.age) + ptMods(S).reduce((s,m)=>s+m.v,0)); }
function addPt(S,v,years,why){ S.ptMods=S.ptMods||[]; if(S.ptMods.some(m=>m.why===why && m.until>=S.age)) return; S.ptMods.push({v, until:S.age+years-1, why}); }
const _add = add;
add = function(S,e){ if(e && e.pt){ const [v,y,w]=e.pt; addPt(S,v,y,w); e={...e}; delete e.pt; } _add(S,e); };

/* 활동 */
const ACTS2 = ['study','invest','talent','exercise','rest','fun','social','style','work','family'];
const _actInfo = actInfo;
function actInfo2(S,k){
  const a=S.age;
  if(k==='invest'){
    if(a<13) return {label:'독서', eff:{}, hint:'공부 효율↑ (평생)', min:0, ok:a>=4, future:true};
    if(a<19) return {label:'진로 준비', eff:{spec:1.5}, hint:'스펙↑ 특기↑', min:0, ok:true, future:true};
    if(S.studying) return {label:'자격증·스펙', eff:{spec:2.2, 돈:-10}, hint:'스펙↑↑ 돈↓', min:0, ok:true, future:true};
    return {label:'저축·투자', eff:{}, hint:'투자 계좌로 적립 (복리)', min:0, ok:true, future:true};
  }
  if(k==='talent'){
    if(S.focus && !traitVisible(S,S.focus)) S.focus=S.star;
    const f=S.focus, known=S.f.has('재능발견');
    return {label: known?`특기 연습: ${f}`:'이것저것 해보기', eff:{}, hint: known?`${f}↑ → ${TAL_DESC[f]}`:'아직 재능을 모른다', min:0, ok:a>=5, future:true};
  }
  return _actInfo(S,k);
}
acts = function(S){ return ACTS2.map(k=>({k, ...actInfo2(S,k)})).filter(x=>x.ok); };

recommendAlloc = function(S){
  const a=S.age, A={};
  if(a<4) Object.assign(A,{study:1, exercise:1, rest:2, fun:2});
  else if(S.armyLeft>0) Object.assign(A,{work:6, exercise:2, rest:2, invest:1});
  else if(a<7) Object.assign(A,{study:2, exercise:2, rest:2, fun:2});
  else if(a<=18) Object.assign(A,{study:5, invest:2, talent:2, exercise:1, rest:2, fun:1, social:1});
  else if(S.studying) Object.assign(A,{study:3, invest:2, talent:1, social:2, rest:2, fun:1, work:1});
  else if(S.job) Object.assign(A,{work:5, invest:2, rest:2, fun:1, family:1, exercise:1});
  else if(S.retired) Object.assign(A,{rest:2, exercise:2, fun:2, social:1});
  else Object.assign(A,{study:3, invest:2, talent:2, rest:2, work:2, fun:1});
  return fixAlloc(S,A);
};
fixAlloc = function(S,A){
  const list=acts(S), T=ptTotal(S), out={}; let tot=0;
  list.forEach(x=>{ out[x.k]=Math.max(x.min, A[x.k]||0); tot+=out[x.k]; });
  const order=['rest','fun','exercise','social','study','invest','talent','style','family','work'].filter(k=>out[k]!=null);
  let g=0;
  while(tot>T && g++<200){ let moved=false; for(const k of order){ const mn=list.find(x=>x.k===k).min; if(tot>T && out[k]>mn){ out[k]--; tot--; moved=true; } } if(!moved) break; }
  g=0; while(tot<T && g++<200){ out[order[g%order.length]]++; tot++; }
  return out;
};
statTargets = function(S,A){
  const p=k=>A[k]||0, a=S.age, T=S.tal||{}, tal=k=>(T[k]??50)-50;
  const busy=p('study')+p('work')+p('invest'), over = busy>=Math.ceil(ptTotal(S)*.75)?1:0;
  const sc = 10/Math.max(6,ptTotal(S));   // 칸이 많을수록 한 칸의 비중은 작다
  return {
    학: clamp(18 + p('study')*sc*(a<26||S.studying?11:7)*S.talent + (S.f.has('학군지')?4:0), 5, 98),
    체: clamp(60 + tal('체격')*.3 + p('exercise')*sc*7*(.8+(T.운동신경??50)/250) + p('rest')*sc*2 - over*10 - Math.max(0,a-40)*.9 - (S.f.has('지병')?12:0), 5, 98),
    멘: clamp(38 + p('rest')*sc*7 + p('fun')*sc*2 + p('family')*sc*2 - over*12 - (p('work')*sc>=6?6:0), 5, 98),
    행: clamp(34 + p('fun')*sc*7 + p('social')*sc*3 + p('family')*sc*3 + (p('talent')*sc*(['예술감각','운동신경'].includes(S.focus)?2:1)) - Math.max(0,p('study')*sc-4)*4 - p('invest')*sc*1 - over*6, 5, 98),
    인: clamp(22 + tal('말솜씨')*.2 + p('social')*sc*10 + p('work')*sc*1.5 + (a<19?6:0), 5, 98),
    매: clamp(28 + tal('외모')*.4 + p('style')*sc*10 + p('exercise')*sc*2, 5, 98),
  };
};
monthTick = function(S){
  S.alloc=S.alloc||recommendAlloc(S);
  const A=S.alloc, T=statTargets(S,A);
  for(const k in T) S.s[k] += (T[k]-S.s[k])*.035;
  // 쌓이는 값
  const e={}; acts(S).forEach(x=>{ const p=A[x.k]||0; for(const k in x.eff){ if(!SK[k]) e[k]=(e[k]||0)+x.eff[k]*p; } });
  const m={}; for(const k in e) m[k]=e[k]/12; _add(S,m);
  // 미래 투자
  const iv=A.invest||0, a=S.age;
  if(a<13) S.talent=Math.min(1.35, S.talent + iv*.004/12);
  else if(a<19 && S.f.has('재능발견')) S.skill[S.focus]=Math.min(100,(S.skill[S.focus]||0)+iv*.5/12);
  else if(a>=19 && !S.studying){ const amt=iv*(S.job? S.job.sal*.02 : 40)/12; if(S.money>amt || S.job){ S.money-=amt; S.inv=(S.inv||0)+amt; } }
  if(S.inv>0 && typeof INV_STYLE==='undefined') S.inv *= 1 + (.04 + ability(S,'재테크')/1500 + gauss()*.1)/12;
  if(S.money<0 && S.inv>0){ const t=Math.min(S.inv,-S.money); S.inv-=t; S.money+=t; }
  // 특기 연습
  const tp=A.talent||0;
  if(tp && S.f.has('재능발견')){ const t=S.focus, ty=TRAIT[t].type;
    const rate = ty==='선천'? 1.2*(S.tal[t]/50) : ty==='혼합'? 1.6*(.5+S.tal[t]/100) : 2.4*(1+S.tal[t]/100);
    S.skill[t]=Math.min(100,(S.skill[t]||0) + tp*rate/12); if(t==='외국어') S.h.eng=Math.max(S.h.eng, S.skill[t]); }
  // 생활 속에서 저절로 느는 후천 능력
  const grow=(t,v)=>{ if(S.age>=TRAIT[t].unlock) S.skill[t]=Math.min(100,(S.skill[t]||0)+v/12); };
  grow('말솜씨', (A.social||0)*.9 + (A.family||0)*.2 + (S.job&&S.job.name==='영업직'?(A.work||0)*.4:0));
  grow('손재주', (A.fun||0)*.35 + (S.job&&S.job.kind==='현장'?(A.work||0)*.5:0));
  grow('리더십', S.age>=14?((A.social||0)+(A.work||0))*.12:0);
  grow('재테크', S.age>=20?(A.invest||0)*.35:0);
  if(S.age>=13&&S.age<19) { grow('외국어',(A.invest||0)*.3); grow('코딩', S.f.has('코딩관심')?(A.invest||0)*.3:0); }
  S.skill.외국어=Math.max(S.skill.외국어||0, S.h.eng*.8);
  // 상황에 따른 시간 변화
  if(S.studying && !S.f.has('대학pt')){ S.f.add('대학pt'); addPt(S,1,4,'자유로운 대학 생활'); }
  if(S.f.has('지병')) addPt(S,-1,99,'지병');
  if(S.f.has('출산') && !S.f.has('육아pt')){ S.f.add('육아pt'); addPt(S,-2,4,'육아'); }
};

/* 일정: 7살 재능 발견 */
const _scheduleYear = scheduleYear;
scheduleYear = function(S){
  if(S.age===7 && !S.f.has('재능발견')) S.queue.push({kind:'ms', name:'talentfind'});
  _scheduleYear(S);
  S.sched.forEach(x=>{ if(x.d.kind==='ms'&&x.d.name==='talentfind') x.m=5; }); S.sched.sort((a,b)=>a.m-b.m);
};
MS.talentfind={build:(S)=>{
  const top=[...INNATE].sort((a,b)=>S.tal[b]-S.tal[a]);
  const who={운동신경:'체육 선생님', 체격:'태권도 관장님', 예술감각:'미술 선생님', 외모:'길 가던 사람들', 손재주:'방과후 과학 선생님', 말솜씨:'담임 선생님', 두뇌:'담임 선생님'}[S.star];
  const line={운동신경:'“얘는 운동을 타고났어요. 달리기 폼이 달라요.”', 체격:'“체격이 정말 좋네요. 지구력이 남달라요.”', 예술감각:'“색을 쓰는 감각이 남달라요.”', 외모:'“아이가 어쩜 이렇게 예뻐요(잘생겼어요)? 모델 시켜도 되겠어요.”', 손재주:'“손이 정말 야무져요. 만드는 걸 다 해내요.”', 말솜씨:'“말을 정말 조리 있게 잘해요. 발표 대장이에요.”', 두뇌:'“이해가 정말 빨라요. 한 번 들으면 다 알아요.”'}[S.star];
  return {title:'재능 발견', text:`초등학교 1학년 봄. ${who}이 엄마에게 말했다.\n${line}\n\n타고난 재능(선천): ${top.slice(0,3).map(t=>`${t} ${S.tal[t]}`).join(' · ')}\n손재주·말솜씨·외국어 같은 능력은 타고나는 게 아니라 이제부터 키우는 것이다.`, choices:[
    {l:`${S.star}을(를) 키운다`, run:S=>{ S.f.add('재능발견'); S.focus=S.star; addPt(S,1,3,'좋아하는 걸 찾은 설렘'); hl(S,`7세, ${S.star}에 재능을 발견했다`); return `그날부터 ${S.star} 연습이 시간 계획에 들어갔다.`; }},
    {l:`${top[1]===S.star?top[0]:top[1]}도 해본다`, run:S=>{ S.f.add('재능발견'); S.focus=top[1]===S.star?top[0]:top[1]; return '두 번째 재능을 먼저 키워보기로 했다.'; }},
    {l:'공부가 먼저다', run:S=>{ S.f.add('재능발견'); S.focus=S.star; add(S,{학:3}); return '재능은 나중에. 일단 학원부터.'; }}]};
}};
// 재능으로 여는 진로
const _trackBuild = MS.track.build;
MS.track.build = function(S){
  const r=_trackBuild(S);
  const cand=[['운동선수',ability(S,'운동신경')>=77],['배우·모델',ability(S,'외모')>=77],['디자이너·예술가',ability(S,'예술감각')>=50],['셰프',ability(S,'손재주')>=28],['기술자',ability(S,'손재주')>=28],['영업직',ability(S,'말솜씨')>=20]];
  const tracks=cand.filter(x=>x[1]).map(x=>x[0]).sort(()=>R()-.5);
  const extra=tracks.slice(0,2).map(t=>({l:`${t}의 길`, run:S=>{ S.track=t; S.attempts=0; S.queue.unshift({kind:'ms', name:'hunt'}); return `${t}을(를) 목표로 도전을 시작했다.`; }}));
  r.choices=[...extra, ...r.choices].slice(0,4);
  return r;
};
// 사건으로 시간 늘고 줄기
EVENTS.push(
{id:'life_book', a:[12,45], w:.6, t:'우연히 집어 든 책 한 권이 마음을 흔들었다. 밤새 다 읽었다.', c:[{l:'인생 책이다', e:{멘:5, pt:[1,3,'인생 책을 만난 의욕']}, t:'한동안 하루가 길게 느껴졌다. 뭐든 해낼 수 있을 것 같았다.'}]},
{id:'mentor', a:[10,30], if:S=>S.f.has('재능발견') && (S.skill[S.focus]||0)>=20, w:1.2, t:S=>`${S.focus}에 재능을 알아본 선생님(코치)이 따로 가르쳐주겠다고 한다.`, c:[
  {l:'배운다', run:S=>{ S.skill[S.focus]=Math.min(100,S.skill[S.focus]+12); addPt(S,1,2,'스승을 만난 열정'); hl(S,`${S.age}세, ${S.focus}의 스승을 만났다`); return '실력이 눈에 띄게 늘었다. 연습이 즐거워졌다.'; }},
  {l:'시간이 없다', e:{}, t:'정중히 거절했다.'}]},
{id:'sports_injury', a:[12,40], if:S=>(S.alloc&&(S.alloc.exercise||0)+(S.focus==='운동신경'||S.focus==='체격'?(S.alloc.talent||0):0))>=4, w:1, t:'연습 중 무릎에서 “뚝” 소리가 났다. 십자인대 부상.', c:[
  {l:'수술하고 재활한다', e:{체:-10, 돈:-300, pt:[-2,1,'부상 재활']}, t:'6개월 재활. 다시 뛸 수 있게 됐다.'}]},
{id:'broken_leg', a:[8,60], w:.25, t:'계단에서 미끄러져 다리가 부러졌다.', c:[{l:'깁스를 한다', e:{체:-6, pt:[-2,1,'다리 골절']}, t:'두 달 동안 목발을 짚었다. 하고 싶은 걸 많이 못 했다.'}]},
);
EVMAP.life_book=EVENTS.find(e=>e.id==='life_book'); EVMAP.mentor=EVENTS.find(e=>e.id==='mentor'); EVMAP.sports_injury=EVENTS.find(e=>e.id==='sports_injury'); EVMAP.broken_leg=EVENTS.find(e=>e.id==='broken_leg');
// 간병 · 번아웃 · 손주 돌봄은 시간을 빼앗는다
(function(){ const pc=EVMAP.parents_care; if(pc){ pc.c[0].e={...pc.c[0].e, pt:[-2,3,'부모님 간병']}; }
  const bo=EVMAP.burnout; if(bo){ bo.c[1].e={...bo.c[1].e, pt:[-2,1,'번아웃']}; }
  const gk=EVMAP.grandkid; if(gk){ gk.c[0].e={...gk.c[0].e, pt:[-1,3,'손주 돌봄']}; } })();
