/* ===== 생각 남기기: 나이가 아니라 인생의 순간에 ===== */
THINK_AGES.length = 0;   // 5·15·30·50·70세 고정 질문 없앰
const MOMENTS = [
  {re:/^수능 전국/, k:'suneung', q:'성적표를 받아 든 지금, 어떤 기분인가요?', o:['후련하다','아쉽다','한 번 더 하고 싶다','아무 생각이 없다']},
  {re:/취업|입사|데뷔|면허|코치로/, k:'job', q:'첫 출근 날 아침. 거울 앞에서 무슨 생각이 드나요?', o:['설렌다','긴장된다','이게 맞나 싶다','드디어 돈을 번다'], once:true},
  {re:/결혼$/, k:'marry', q:'결혼식이 끝났다. 하객들이 돌아간 텅 빈 식장에서, 지금 마음은?', o:['행복하다','실감이 안 난다','책임감이 무겁다','부모님 생각이 난다']},
  {re:/첫 아이|부모가 됐다/, k:'baby', q:'아이를 처음 안았다. 무슨 생각이 드나요?', o:['눈물이 난다','잘 키울 수 있을까','우리 엄마도 이랬을까','그냥 신기하다']},
  {re:/부모님을 떠나보냈다/, k:'parents', q:'장례식이 끝나고 집에 돌아왔다. 지금 어떤가요?', o:['보고 싶다','후회가 남는다','감사하다','아직 실감이 안 난다']},
  {re:/퇴직/, k:'retire', q:'마지막 퇴근길. 지하철 창밖을 보며 무슨 생각을 하나요?', o:['홀가분하다','허전하다','아직 일하고 싶다','이제 내 시간이다']},
  {re:/사고|이상 소견|진단|부상/, k:'sick', q:'병원 침대에 누워 천장을 본다. 무슨 생각이 드나요?', o:['살아서 다행이다','무섭다','그동안 너무 바빴다','가족 얼굴이 떠오른다']},
];
const _hl2 = hl;
hl = function(S,t){
  _hl2(S,t);
  if(S.dead || (S.thinkN||0)>=5 || S.age<10 || S.thinkYear===S.year) return;
  const m=MOMENTS.find(x=>x.re.test(t)); if(!m) return;
  S.thinkDone=S.thinkDone||[]; if(m.once && S.thinkDone.includes(m.k)) return;
  S.thinkDone.push(m.k); S.thinkN=(S.thinkN||0)+1; S.thinkYear=S.year;
  S.queue.push({kind:'think', mk:m.k});
};
function thinkSpec(d){ return MOMENTS.find(x=>x.k===d.mk) || {q:'지금 인생은 어떤가요?', o:THINK_OPT}; }
/* ===== 집안마다 다른 어린 시절 떡밥 ===== */
const _ng4 = newGame;
newGame = function(n,m){ const r=_ng4(n,m); S.fightRoll=R()<.25; return r; };
(function(){ const e=EVMAP.parents_fight; if(!e) return; e.if=S=>S.family==='갈등' || (S.family==='보통' && S.fightRoll); e.w=S=>S.family==='갈등'?3:1.5; })();
EVENTS.push(
{id:'cousin_compare', a:[9,14], if:S=>S.family!=='갈등', w:1.2, t:'명절. 큰엄마가 큰 소리로 말한다. “우리 애는 이번에 전교 1등 했잖아~ 너는 몇 등이니?”', c:[
  {l:'“저는 제 속도대로 가요.”', e:{멘:4, 매:2}, t:'큰엄마가 머쓱해했다. 엄마가 몰래 엄지를 들었다.'},
  {l:'이를 악물고 공부한다', e:{학:5, 멘:-4, risk:2}, t:'그날 밤부터 독서실에 다녔다. 사촌 이름만 들어도 속이 쓰렸다.'},
  {l:'방에 들어가 문을 닫는다', e:{멘:-5, risk:5, par:-2}, t:'엄마가 “신경 쓰지 마”라고 했지만, 엄마 표정도 굳어 있었다.'}]},
{id:'sibling_favor', a:[8,14], if:S=>S.siblings>0, w:1.2, t:'오늘도 엄마는 동생 숙제만 봐준다. “너는 다 컸잖아.”', c:[
  {l:'“나도 아직 애야!” 서운함을 말한다', e:{par:4, 멘:3}, t:'엄마가 놀란 얼굴로 나를 안아줬다. 그 주말엔 나랑만 영화를 봤다.'},
  {l:'동생 숙제를 같이 봐준다', e:{par:3, 인:2, 학:1}, t:'동생이 “형(언니)이 최고”라고 했다. 조금 뿌듯했다.'},
  {l:'말없이 PC방에 간다', e:{risk:6, 행:2}, t:'집에 오니 아무도 내가 없었던 걸 몰랐다.'}]},
{id:'money_stress', a:[8,14], if:S=>S.wealth<=4, w:1.3, t:'식탁 위에 고지서가 쌓여 있다. 엄마가 계산기를 두드리며 한숨을 쉰다.', c:[
  {l:'학원을 끊겠다고 말한다', e:{par:6, 학:-2, 멘:2}, t:'엄마가 한참 아무 말도 못 했다. “미안해.” 그 말이 오래 남았다.'},
  {l:'모른 척 방에 들어간다', e:{멘:-3, risk:3}, t:'방문 너머로 한숨 소리가 계속 들렸다.'},
  {l:'용돈을 아껴 저금통에 넣는다', e:{par:4, 돈:5}, t:'저금통이 꽉 찼을 때 엄마 생일 선물을 샀다.'}]},
);
['cousin_compare','sibling_favor','money_stress'].forEach(id=>{ EVMAP[id]=EVENTS.find(e=>e.id===id); MAJOR.add(id); });

/* 재능 발견 장면: 모두에게 흐르듯 지나가고, 내가 타고난 쪽에서만 멈춰서 고른다 */
const FIND_T = {find_sport:'운동신경', find_brain:'두뇌', find_art:'예술감각'};
Object.keys(FIND_T).forEach(id=>{ MAJOR.delete(id); if(EVMAP[id]) EVMAP[id].w=1.6; });
const _isDec = isDecision;
isDecision = function(d,card){
  if(d.kind==='ev' && FIND_T[d.id]){ const t=FIND_T[d.id]; return (S.star===t || (S.tal&&S.tal[t]>=68)) && card.choices.some(c=>c.ok); }
  return _isDec(d,card);
};
