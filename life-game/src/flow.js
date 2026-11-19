/* ===== 흐름 규칙: 큰 갈림길에서만 멈춘다 ===== */
const MAJOR = new Set([
  // 일탈의 갈림길 (떡밥 · 예방)
  'parents_fight','pc_bang_hyung','mom_asks','talk_back','scooter','runaway','dropout','geomjeong','gang_fight',
  // 진로 · 학업
  'hs_track',
  // 독립 · 사랑 · 가족
  'indep','marry','kids_plan','baby_career','dad_leave','late_divorce',
  // 돈 · 집 · 일
  'buy_house','headhunt','burnout','quit_travel','honorary_retire','chicken','delivery_bike','coin_allin','drunk_drive','speeding_call',
  // 부모 · 노년 · 위기
  'parents_care','crisis','jeonse_scam',
]);
NEWS.forEach(n=>{ if(/비트코인|폭등/.test(n.h)) n.decide=true; });
// 생각 남기기 (80억분의 1의 5·15·30·50·70세 질문 오마주)
const THINK_AGES = [5,15,30,50,70];
const THINK_Q = {5:'다섯 살. 세상이 어떻게 보이나요?',15:'열다섯 살. 지금까지의 인생은 어땠나요?',30:'서른 살. 생각했던 서른과 비슷한가요?',50:'쉰 살. 인생의 반을 넘었습니다. 어떤가요?',70:'일흔 살. 돌아보면 어떤 인생이었나요?'};
const THINK_OPT = ['행복하다','그럭저럭 괜찮다','힘들다','후회가 많다'];
const THINK_STAT = {
  5:S=>`한국 아이의 약 ${S.wealth>=7?'30':'70'}%가 비슷한 형편에서 자랍니다. 당신은 ${S.region.name}의 소득 ${S.rich?'최상위':S.wealth+'분위'} 가정에서 자라고 있습니다.`,
  15:S=>`한국 중학생의 약 7~8할이 사교육을 받습니다. 지금 당신의 학력은 ${Math.round(S.s.학)}, 행복은 ${Math.round(S.s.행)}입니다.`,
  30:S=>`한국의 30세 중 결혼한 사람은 절반이 안 됩니다. 당신은 ${S.f.has('기혼')?'결혼했습니다':'아직 미혼입니다'}. 직업: ${S.job?S.job.name:'없음'}.`,
  50:S=>`한국 50대의 평균 순자산은 약 4~5억 원입니다. 당신은 ${won(S.money+(S.house?S.house.val-S.house.loan:0))}입니다.`,
  70:S=>`한국인의 기대수명은 약 83세입니다. 당신의 체력은 ${Math.round(S.s.체)}입니다.`,
};
function isDecision(d, card){
  if(d.kind==='ev') return MAJOR.has(d.id) && card.choices.some(c=>c.ok);
  if(d.kind==='news') return !!NEWS[d.idx].decide && card.choices.some(c=>c.ok);
  if(d.kind==='ms') return card.choices.length>0;
  if(d.kind==='think') return true;
  return false;
}
// 캐릭터가 알아서 고르기: 일탈 수치가 높으면 위험한 쪽으로 기운다
function autoIndex(S, d, card){
  const idx=card.choices.map((c,i)=>c.ok?i:-1).filter(i=>i>=0);
  if(!idx.length) return -1;
  if(d.kind!=='ev') return pick(idx);
  const ev=EVMAP[d.id];
  return wpick(idx, i=>{ const e=ev.c[i].e||{}; return (e.risk>0? 1+S.h.risk/25 : e.risk<0? 1+(100-S.h.risk)/60 : 1.2); });
}

// 위험한 유혹은 평생 한 번만 묻는다 · 갈림길 선택지는 최대 3개
['drunk_drive','coin_allin','headhunt'].forEach(id=>{ if(EVMAP[id]){ EVMAP[id].rep=false; } });
if(EVMAP.speeding_call) EVMAP.speeding_call.w=S=>S.f.has('오토바이')?.8:0;
if(EVMAP.buy_house) { const w=EVMAP.buy_house.w; EVMAP.buy_house.w=S=>w(S)*.6; }
EVENTS.forEach(e=>{ if(MAJOR.has(e.id) && e.c.length>3) e.c=e.c.slice(0,3); });
