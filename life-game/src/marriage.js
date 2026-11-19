/* ===== 연애 · 결혼: 통계청 흐름에 맞춘 해마다의 확률 ===== */
// 참고: 2023년 평균 초혼 연령 남 34.0세 · 여 31.5세, 50세까지 결혼 경험 약 65~70% (젊은 세대일수록 낮아지는 추세)
function meetBase(S){ const a=S.age+(S.gender==='F'?2:-1); return a<22?.03: a<26?.07: a<30?.12: a<35?.14: a<40?.09: a<45?.05: a<50?.03:0; }
function marryBase(S){ const a=S.age+(S.gender==='F'?2:-1); return a<28?.05: a<31?.16: a<34?.3: a<38?.32: a<42?.2: a<46?.12: .06; }
const _sy5 = scheduleYear;
scheduleYear = function(S){
  _sy5(S);
  if(S.dead || S.age<20 || S.age>52 || S.f.has('기혼')) return;
  const factor=clamp(.55+S.s.매/220+S.s.인/320+S.s.행/450,.5,1.45);
  const extra=[];
  if(S.f.has('연애중')){
    S.loveYears=(S.loveYears||0)+1;
    if(R()<.2) extra.push('breakup');
    else if(S.loveYears>=1 && R()<marryBase(S)*(1+.12*(S.loveYears-1))) extra.push('marry');
  } else if(R()<meetBase(S)*factor) extra.push('meet_someone');
  extra.forEach(id=>S.sched.push({m:ri(2,11), d:{kind:'ev', id, forced:true}}));
  S.sched.sort((a,b)=>a.m-b.m);
};
const MEET_WHERE = ['동호회 등산 모임에서','친구 결혼식 뒤풀이에서','회사 옆 부서 사람과','소개팅 앱으로','대학 동기 모임에서 다시','친구의 친구 소개로','같은 헬스장에서','봉사 활동에서'];
EVENTS.push(
{id:'meet_someone', a:[20,52], manual:true, t:S=>`${pick(MEET_WHERE.filter(w=>S.job||!w.includes('회사')).filter(w=>S.major||!w.includes('대학')))} 마음이 맞는 사람을 만났다. 연락이 자꾸 기다려진다.`, c:[
  {l:'만나본다', run:S=>{ S.f.add('연애중'); S.loveYears=0; add(S,{행:6}); hl(S,`${S.age}세, 새로운 인연`); return '세 번째 만남에서 사귀기로 했다.'; }}]},
{id:'breakup', a:[18,55], manual:true, if:S=>S.f.has('연애중') && !S.f.has('기혼'), t:'요즘 연락이 뜸하다. 결국 이별을 말하는 날이 왔다.', c:[
  {l:'받아들인다', run:S=>{ S.f.delete('연애중'); S.loveYears=0; add(S,{멘:-8, 행:-5}); return '한 달 동안 그 사람이 좋아하던 노래를 못 들었다.'; }}]},
);
EVMAP.meet_someone=EVENTS.find(e=>e.id==='meet_someone'); EVMAP.breakup=EVENTS.find(e=>e.id==='breakup');
// 결혼 이야기는 거절해도 다시 나온다
(function(){ const m=EVMAP.marry; if(!m) return; m.rep=true; const r=m.c[0].run; m.c[0].run=S=>{ const t=r(S); S.marryAge=S.age; S.loveYears=0; return t; };
  // 기존 무작위 등장은 줄이고, 해마다의 확률로만 주로 나오게
  m.w=0.15; })();
['blind_date','matseon','office_love','cc','hs_love','love_letter'].forEach(id=>{ const e=EVMAP[id]; if(!e) return; const w=e.w; e.w=S=>(typeof w==='function'?w(S):(w??1))*.25; });
// 이직하면 새 회사
(function(){ const h=EVMAP.headhunt; if(!h) return; const r=h.c[0].run; h.c[0].run=S=>{ const t=r(S); if(S.job){ S.job.co=undefined; attachCo(S); return t+` 새 회사는 ${S.job.co}.`; } return t; }; })();
