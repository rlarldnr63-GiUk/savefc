/* ===== 돌잡이: 첫 생일에 무엇을 잡느냐로 '수저'가 정해진다 =====
   잡은 물건 → 관련 재능이 평생 크게 오른다. 태어날 때 고른 꿈과 맞으면 '운명의 돌잡이' (보너스 1.8배 + 꿈 한 칸 더).
   돈(금수저)은 너무 쉬워지므로 잘 안 잡힌다. */
const DOL = [
  {k:'연필',   e:'✏️', spoon:'지능 수저',   tr:{두뇌:12},            st:{학:5},       w:1,   say:'“공부 잘하겠네!” 할머니가 박수를 쳤다.'},
  {k:'청진기', e:'🩺', spoon:'지능 수저',   tr:{두뇌:10, 말솜씨:4},   st:{학:4},       w:.8,  say:'“의사 선생님 나셨네!” 엄마가 그날 맘카페에 사진을 올렸다.'},
  {k:'마우스', e:'🖱️', spoon:'지능 수저',   tr:{코딩:14, 두뇌:4},     st:{학:3},       w:.8,  say:'“요즘 애들은 다르네.” 삼촌이 휴대폰으로 찍었다.'},
  {k:'공',     e:'⚽', spoon:'예체능 수저', tr:{운동신경:12, 체격:6}, st:{체:5},       w:1,   say:'공을 잡자마자 던졌다. 아빠가 “국가대표!”라고 외쳤다.'},
  {k:'붓',     e:'🖌️', spoon:'예체능 수저', tr:{예술감각:12, 손재주:6}, st:{행:4},     w:1,   say:'붓을 쥐고 상 위에 낙서를 했다. 다들 “화가 나셨네” 했다.'},
  {k:'마이크', e:'🎤', spoon:'인맥 수저',   tr:{말솜씨:12, 외모:4, 리더십:4}, st:{인:6, 매:3}, w:1, say:'마이크를 잡고 옹알이를 했다. 사회자가 “연예인 하겠네요!”'},
  {k:'실',     e:'🧵', spoon:'건강 수저',   tr:{체격:8},             st:{체:7, 멘:3}, w:.9,  say:'“오래오래 살겠네.” 증조할머니가 손을 꼭 잡았다.', long:true},
  {k:'돈',     e:'💴', spoon:'금수저',      tr:{재테크:10},          st:{},           w:.22, say:'지폐를 꽉 쥐고 놓지 않았다. 아빠가 제일 크게 웃었다.', money:3000},
];
const DOLM = {}; DOL.forEach(x=>DOLM[x.k]=x);
function dolMatch(S,item){ const d=(typeof dreamNow==='function')&&dreamNow(S); if(!d) return false;
  if(item.k==='돈') return d.k==='사장님';
  if(item.k==='청진기') return d.k==='의사'||d.k==='간호사';
  return Object.keys(item.tr).some(t=>d.tr.includes(t)); }
function dolMult(S){ return S.dolLucky? 1.8 : 1; }

// 정기 이벤트의 옛 돌잡이는 빼고, 1살 3월에 반드시 돌잔치를 연다
(function(){ const e=EVENTS.find(x=>x.id==='doljabi'); if(e) e.manual=true; })();
const _syDol = scheduleYear;
scheduleYear = function(S){
  _syDol(S);
  if(S.dead) return;
  if(S.age===1 && !S.f.has('돌잔치')){ S.f.add('돌잔치'); S.sched.push({m:3, d:{kind:'ms', name:'dol'}}); S.sched.sort((a,b)=>a.m-b.m); }
};
MS.dol = {build:(S,d)=>{
  if(!d.item) d.item = wpick(DOL, x=>x.w).k;
  const dr=(typeof dreamNow==='function')&&dreamNow(S);
  return {title:'돌잡이', text:`첫 생일. 돌상 위에 ${DOL.map(x=>x.e+' '+x.k).join(', ')}가 놓여 있다.\n\n무엇을 잡느냐로 평생 따라다닐 ‘수저’가 정해진다.${dr?`\n\n태어날 때 꿈은 ${dr.e} ${dr.k}. 관련된 걸 잡으면 운명의 돌잡이!`:''}`,
    choices:[{l:'아기를 돌상 앞에 내려놓는다', run:S=>applyDol(S,d.item)}]};
}};
MAJOR.add('dol');
function applyDol(S,k){
  const it=DOLM[k]; S.dol=k; S.dolLucky=dolMatch(S,it);
  S.f.add('돌잡이'+k); if(k==='돈') S.f.add('돌잡이돈'); if(k==='연필') S.f.add('돌잡이연필');
  if(it.money) add(S,{돈:it.money*(S.dolLucky?2:1)});
  add(S, Object.fromEntries(Object.entries(it.st).map(([s,v])=>[s,v*dolMult(S)])));
  if(S.dolLucky){ S.titles.add('운명의 돌잡이'); hl(S,`1세, 돌잡이에서 ${it.e} ${k}을(를) 잡았다 — 꿈과 같은 운명의 ${it.spoon}`); }
  else hl(S,`1세, 돌잡이에서 ${it.e} ${k}을(를) 잡았다 (${it.spoon})`);
  return `${it.e} ${k}! ${it.say}\n${it.spoon}를 물었다: ${Object.entries(it.tr).map(([t,v])=>`${t} +${Math.round(v*dolMult(S))}`).join(' · ')}${S.dolLucky?'\n태어날 때 꿈과 같은 쪽이다. 운명의 돌잡이!':''}`;
}
// 평생 효과 ①: 재능 보너스
const _abDol = ability;
ability = function(S,t){ const v=_abDol(S,t); if(!S||!S.dol) return v; const b=DOLM[S.dol].tr[t]; return b? Math.min(100, v+b*dolMult(S)) : v; };
// 평생 효과 ②: 능력치가 자라는 목표치가 높아진다
const _stDol = statTargets;
statTargets = function(S,A){ const T=_stDol(S,A); if(!S.dol||S.age<2) return T; const st=DOLM[S.dol].st;
  for(const k in st) if(T[k]!=null) T[k]=clamp(T[k]+st[k]*.8*dolMult(S),5,98); return T; };
// 평생 효과 ③: 실(장수)은 사망 확률을 낮춘다 · 운명의 돌잡이는 꿈 한 칸을 더 쳐준다
const _ytDol = yearTick;
yearTick = function(S,ms){
  if(S.dol==='실' && S.age>=40 && !S.dead){ const keep=R()<(S.dolLucky?.35:.22); if(keep){ const was=S.dead; _ytDol(S,ms); if(S.dead && !was && !/사고|전쟁|조난|낙뢰|납치/.test(S.cause||'')){ S.dead=false; S.cause=null; S.queue=S.queue.filter(q=>q.kind!=='death'); } return; } }
  _ytDol(S,ms);
};
if(typeof dreamPower==='function'){ const _dpDol=dreamPower; dreamPower=function(S){ const p=_dpDol(S); return p>0 && S.dolLucky && S.dol && dolMatch(S,DOLM[S.dol])? Math.min(4,p+1) : p; }; }
