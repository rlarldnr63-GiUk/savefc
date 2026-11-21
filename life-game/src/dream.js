/* ===== 장래희망: 태어날 때 · 10살 · 20살에 고른다 =====
   같은 꿈을 오래 품을수록(최대 3번) 관련 재능이 자라고, 그 직업이 되기 쉬워진다. */
const DREAMS = [
  {k:'의사',        e:'🩺', jobs:['의사'],               tr:['두뇌']},
  {k:'선생님',      e:'🍎', jobs:['교사'],               tr:['말솜씨','두뇌']},
  {k:'공무원',      e:'🏛️', jobs:['공무원'],             tr:['두뇌']},
  {k:'대기업 직장인', e:'🏢', jobs:['대기업'],             tr:['외국어','리더십']},
  {k:'개발자',      e:'💻', jobs:['개발자'],             tr:['코딩']},
  {k:'운동선수',    e:'⚽', jobs:['운동선수'],           tr:['운동신경','체격']},
  {k:'연예인',      e:'🎤', jobs:['배우·모델','아이돌'],  tr:['외모','말솜씨']},
  {k:'유튜버',      e:'📹', jobs:['크리에이터'],         tr:['말솜씨','외모']},
  {k:'웹툰·예술가', e:'🎨', jobs:['웹툰 작가','디자이너·예술가'], tr:['예술감각']},
  {k:'셰프',        e:'🍳', jobs:['셰프'],               tr:['손재주']},
  {k:'파일럿·승무원', e:'✈️', jobs:['파일럿','승무원'],   tr:['외국어','체격']},
  {k:'경찰·소방관', e:'🚒', jobs:['경찰관','소방관'],     tr:['체격','운동신경']},
  {k:'간호사',      e:'💉', jobs:['간호사'],             tr:['말솜씨']},
  {k:'사장님',      e:'💼', jobs:['창업'],               tr:['말솜씨','리더십','재테크']},
  {k:'과학자',      e:'🔬', jobs:['연구원'],             tr:['두뇌','코딩']},
  {k:'프로게이머',  e:'🎮', jobs:['프로게이머'],         tr:['운동신경']},
];
const DREAM = {}; DREAMS.forEach(d=>DREAM[d.k]=d);
const DREAM_AGES = [0,10,20];
function dreamNow(S){ return S.dream? DREAM[S.dream] : null; }
function dreamPower(S){ if(!S.dream) return 0; return (S.dreams||[]).filter(x=>x.k===S.dream).length; }   // 1~3
function isDreamJob(S,t){ const d=dreamNow(S); return !!(d && d.jobs.includes(t)); }

// 창업(사장님) 진로: 대박 아니면 쪽박
JOBS['자영업']=JOBS['자영업']||{sal:3500, hon:2, kind:'자영'};
JOBCAT['창업'] = {show:S=>S.age>=20 && isDreamJob(S,'창업'), p:S=>.35+ab(S,'말솜씨')/250+ab(S,'리더십')/300, prep:'모아둔 돈으로 내 가게·회사', cost:2000,
  hire:S=>{ const r=R(); const sal = r<.12? ri(12000,40000) : r<.55? ri(3500,7000) : ri(1500,3000);
    S.job={name:'자영업', sal, hon:r<.12?4:2, kind:'자영'}; if(r<.12){ S.titles.add('성공한 사장님'); return `창업 대성공! 매장이 세 개로 늘었다. 올해 수입 ${won(sal)}.`; }
    return r<.55? '가게를 열었다. 단골이 하나둘 생긴다.' : '가게를 열었다. 손님이 생각보다 적다. 그래도 내 가게다.'; }};
PRESTIGE['창업']=6;

// 1) 고르는 장면
MS.dream = {build:(S,d)=>{
  const a=S.age, cur=dreamNow(S);
  const text = a===0 ? `아기 ${S.name}. 이 아이는 커서 무엇이 되고 싶어 할까?\n\n같은 꿈을 10살·20살에도 고르면 관련 재능이 더 자라고, 그 직업이 되기 훨씬 쉬워진다.`
    : a===10 ? `초등학교 3학년. 선생님이 장래희망을 적어 내라고 한다.${cur?`\n\n태어날 때 꿈: ${cur.e} ${cur.k}. 그대로 적으면 꿈이 더 단단해진다.`:''}`
    : `스무 살. 이제 진짜 하고 싶은 일을 정할 때다.${cur?`\n\n지금까지의 꿈: ${(S.dreams||[]).map(x=>DREAM[x.k].e+' '+x.k).join(' → ')}`:''}`;
  return {title: a===0?'첫 번째 꿈':a===10?'장래희망 발표':'진짜 하고 싶은 일', text, grid:true,
    choices: DREAMS.map(dr=>({l:`${dr.e} ${dr.k}${cur&&cur.k===dr.k?' ★':''}`, run:S=>pickDream(S,dr.k)}))};
}};
function pickDream(S,k){
  const keep = S.dream===k; S.dream=k; (S.dreams=S.dreams||[]).push({age:S.age, k});
  const p=dreamPower(S), dr=DREAM[k];
  if(dr.jobs.includes('의사')) S.f.add('의대도전'); else if(S.age===20) S.f.delete('의대도전');
  if(dr.jobs.includes('아이돌') && S.age>=10) S.f.add('연습생');
  if(dr.jobs.includes('크리에이터')) S.f.add('크리에이터꿈');
  if(dr.jobs.includes('개발자')) S.f.add('코딩관심');
  hl(S, `${S.age}세, 장래희망: ${dr.e} ${k}`);
  if(S.age===0) return `${dr.e} ${k}. 부모님이 돌잔치 날 그 이야기를 꺼내며 웃었다.`;
  if(keep) return `${dr.e} ${k}. 꿈이 ${p}번째 이어졌다. ${dr.tr.join('·')} 쪽이 눈에 띄게 늘고 있다.`;
  return `${dr.e} ${k}(으)로 꿈을 바꿨다. 새로 시작하는 꿈은 아직 약하다.`;
}
const _syD = scheduleYear;
scheduleYear = function(S){
  _syD(S);
  if(S.dead) return;
  S.dreamAsked=S.dreamAsked||{};
  if(DREAM_AGES.includes(S.age) && !S.dreamAsked[S.age]){ S.dreamAsked[S.age]=1; S.sched.push({m:S.age===0?2:3, d:{kind:'ms', name:'dream'}}); S.sched.sort((a,b)=>a.m-b.m); }
};
MAJOR.add('dream');

// 2) 꿈이 재능을 키운다: 같은 꿈 1번 +5, 2번 +10, 3번 +16 (관련 재능에만)
const _abD = ability;
ability = function(S,t){ const v=_abD(S,t); const d=dreamNow(S); if(!d || !d.tr.includes(t)) return v; return v + [0,5,10,16,20][Math.min(4,dreamPower(S))]; };

// 3) 진로: 꿈 직업은 조건이 모자라도 목록 맨 위에 뜬다 (★표시)
const _toD = trackOptions;
trackOptions = function(S){
  let L=_toD(S); const d=dreamNow(S); if(!d) return L;
  const pin=d.jobs.filter(t=>t!=='의사' && (JOBCAT[t]? (t==='창업'||S.age<=40) : true));
  return [...pin, ...L.filter(t=>!pin.includes(t))];
};
const _tbD = MS.track.build;
MS.track.build = function(S,d){ const r=_tbD(S,d); r.choices.forEach(c=>{ const t=(c.l.split(' · ')[0]||'').trim(); if(isDreamJob(S,t)) c.l='★ 꿈 · '+c.l; }); return r; };
// 합격 확률: 꿈 직업이면 +12%p, 같은 꿈을 품은 횟수마다 +10%p
const dreamBonus = S=> isDreamJob(S,S.track)? .04 + .12*dreamPower(S) : 0;
const _shD = snowHunt;
snowHunt = function(S){ return _shD(S) + dreamBonus(S); };
const _epD = estP;
estP = function(S,t){ const b = isDreamJob(S,t)? .04+.12*dreamPower(S) : 0; return _epD(S,t)+b; };

// 4) 꿈을 이루면
const _mtD = monthTick;
monthTick = function(S){
  _mtD(S);
  if(S.job && S.dream && !S.f.has('꿈이룸') && isDreamJob(S,S.job.name==='자영업'?'창업':S.job.name)){
    S.f.add('꿈이룸'); S.titles.add('꿈을 이룬 사람'); add(S,{행:10, 멘:6});
    hl(S, `${S.age}세, 어릴 적 꿈 ${DREAM[S.dream].e} ${S.dream}을(를) 이뤘다`);
  }
};
function dreamSummary(S){
  const L=(S.dreams||[]); if(!L.length) return '';
  return L.map(x=>`${x.age}세 ${DREAM[x.k].e} ${x.k}`).join(' → ') + (S.f.has('꿈이룸')? ' · 꿈을 이뤘다' : ' · 다른 길을 걸었다');
}

// 5) 대학 원서: 꿈과 이어지는 과에 ★ · 의사가 꿈이면 오래 품을수록 의대 문이 넓어진다
const DREAM_MAJOR = {의사:'의대', 선생님:'사범대', 간호사:'간호학과', 개발자:'공대', 과학자:'공대', '대기업 직장인':'상경계'};
const _cbD = MS.college.build;
MS.college.build = function(S,d){
  const r=_cbD(S,d); const dr=S.dream, p=dreamPower(S), want=DREAM_MAJOR[dr];
  if(dr==='의사' && !r.choices.some(c=>/의대/.test(c.l))){
    const okTier = S.tier==='S' || (S.tier==='A' && p>=1) || (S.tier==='B' && p>=2) || (S.tier==='C' && p>=3);
    if(okTier) r.choices.unshift({l:'의대 (6년)', run:S=>{ S.major='의대'; S.studying=true; S.studyLeft=6; add(S,{f:'대학생', 행:8, risk:-6}); S.uni=pickUni(S); hl(S,`${S.uni} 의대 입학`); return `${S.uni} 의대에 붙었다. 어릴 때부터 꾼 꿈에 한 걸음 다가섰다.`; }});
  }
  if(want) r.choices.forEach(c=>{ if(c.l.startsWith(want==='공대'?'공대':want==='상경계'?'경영':want==='사범대'?'교대':want)) c.l='★ 꿈 · '+c.l; });
  return r;
};
