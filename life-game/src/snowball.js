/* ===== 스노우볼: 체력 · 멘탈 · 행복 · 인맥이 미래로 굴러간다 ===== */

// 멘탈 = 회복탄력성: 나쁜 일의 피해가 줄거나 커진다
function resil(S){ return clamp(1.3 - S.s.멘*.006, .7, 1.3); }
const _add5 = add;
add = function(S,e){
  if(e && S && S.s && S._src){ const r=resil(S); if(Math.abs(r-1)>.05){ e={...e}; for(const k of Object.keys(SK)) if(e[k]<0) e[k]=e[k]*r; } }
  _add5(S,e);
};
// 시험 · 면접: 멘탈과 인맥(추천)이 합격률에 붙는다
function snowHunt(S){ let b=(S.s.멘-50)/400 + S.s.인/700; if(S.f.has('추천')){ b+=.15; S.f.delete('추천'); } return b; }

// 체력 = 건강 저금 · 활력 / 행복 = 의욕 / 인맥 = 노년의 외로움
const _st2 = statTargets;
statTargets = function(S,A){
  const T=_st2(S,A);
  if(S.age>40) T.체 = clamp(T.체 + Math.min(18, S.hbank||0), 5, 98);
  const motiv=.8+S.s.행/250;                         // 행복 50 → 1.0, 90 → 1.16, 20 → .88
  T.학 = clamp(18 + (T.학-18)*motiv, 5, 98);
  if(S.age>=65 && S.s.인<30) T.행 = clamp(T.행-8, 5, 98);
  return T;
};
const _mt4 = monthTick;
monthTick = function(S){
  const f=S.focus, b=S.skill&&f?S.skill[f]:0, b말=S.skill?.말솜씨||0, b리=S.skill?.리더십||0;
  _mt4(S);
  const A=S.alloc||{};
  if(S.age<40) S.hbank=(S.hbank||0)+(A.exercise||0)*.11/12;                  // 젊을 때 운동한 만큼 저금
  if(f && S.skill){ const d=S.skill[f]-b; if(d>0) S.skill[f]=Math.min(100,S.skill[f]+d*(.8+S.s.행/250-1)); }   // 행복할수록 잘 는다
  if(S.skill){ const k=.7+S.s.인/100-1; S.skill.말솜씨=Math.min(100,S.skill.말솜씨+(S.skill.말솜씨-b말)*k); S.skill.리더십=Math.min(100,S.skill.리더십+(S.skill.리더십-b리)*k); }
  if(S.s.멘<30) S.h.risk=Math.min(100,S.h.risk+.25);
};
// 해마다: 체력이 넘치면 시간 +1, 늘 피곤하면 -1
const _sy3 = scheduleYear;
scheduleYear = function(S){
  S.ptMods=(S.ptMods||[]).filter(m=>!(m.why==='체력이 넘친다'||m.why==='늘 피곤하다'));
  if(S.age>=7){ if(S.s.체>=70) S.ptMods.push({v:1, until:S.age, why:'체력이 넘친다'}); else if(S.s.체<30) S.ptMods.push({v:-1, until:S.age, why:'늘 피곤하다'}); }
  _sy3(S);
};
// 결산 이유에 스노우볼 표시
const _ds = driftSrc;
driftSrc = function(S,k,v,A){ if(k==='체' && v>0 && S.age>40 && (S.hbank||0)>3) return '젊을 때 쌓은 건강'; if(k==='행' && v<0 && S.age>=65 && S.s.인<30) return '외로움'; return _ds(S,k,v,A); };
// 행복할수록 연애가 잘 된다
['blind_date','matseon','office_love'].forEach(id=>{ const e=EVMAP[id]; if(!e) return; const w=e.w; e.w=S=>(typeof w==='function'?w(S):(w??1))*(.6+S.s.행/100); });

/* ===== 떡밥 심기: 어린 시절 선택에 표시를 남긴다 ===== */
(function(){
  const plant=(id,i,flag)=>{ const e=EVMAP[id]; if(e&&e.c[i]){ const c=e.c[i]; c.e={...(c.e||{}), f:[].concat(c.e&&c.e.f||[], flag)}; } };
  plant('first_salary',0,'내복'); plant('camp_fire',0,'캠프눈물'); plant('try_hands',1,'아빠비행기'); plant('sns_cringe',0,'흑역사');
  plant('mom_asks',0,'엄마에게털어놓음'); plant('club_offer',0,'운동부'); plant('sports_injury',0,'무릎부상'); plant('broken_leg',0,'다리골절');
  NEWS.forEach(n=>{ if(n.y===2002&&n.c) n.c[0].e={...n.c[0].e, f:'길거리응원'}; if(n.y===2003&&n.c) n.c[0].e={...n.c[0].e, f:'싸이월드'}; });
  const sc=EVMAP.scooter; if(sc){ const r=sc.c[1].run; sc.c[1].run=S=>{ const t=r(S); if(/철심|합의금|입원/.test(t)) S.f.add('무릎부상'); return t; }; const r0=sc.c[0].run; sc.c[0].run=S=>{ const t=r0(S); if(/철심/.test(t)) S.f.add('무릎부상'); return t; }; }
  const tb=EVMAP.talk_back; if(tb) tb.c[0].e={...tb.c[0].e, f:[].concat(tb.c[0].e.f||[],'대든학생')};
})();
function parentsMemory(S){
  const m=[];
  if(S.f.has('내복')) m.push('장롱 깊은 곳에서 첫 월급으로 사드린 빨간 내복이 나왔다. 한 번도 안 입고 아껴두셨다.');
  if(S.f.has('아빠비행기')) m.push('아빠 책상 서랍에서 그때 그 고무동력기가 나왔다. 내 이름표가 아직 붙어 있었다.');
  if(S.f.has('캠프눈물')) m.push('엄마 지갑 속에 수련회 때 내가 쓴 편지가 접혀 있었다.');
  if(S.f.has('가출') && !S.f.has('화해')) m.push('끝내 하지 못한 말이 목에 걸렸다.');
  if(S.f.has('엄마에게털어놓음')) m.push('“네 편이야.” 어릴 적 그 목소리가 들리는 것 같았다.');
  if(m.length){ add(S,{멘:-3}); S.f.add('추억회수'); }
  return m.join(' ');
}

/* ===== 떡밥 회수: 수십 년 뒤에 돌아오는 장면 ===== */
EVENTS.push(
{id:'pay_uiri', a:[28,48], if:S=>S.f.has('의리'), w:5, t:'모르는 번호. “나 기억나? 중학교 때… 네가 같이 밥 먹어줬던.” 그 친구가 지금 회사 대표가 됐다고 한다. “너 아니었으면 나 학교 못 다녔어. 우리 회사로 와줄래?”', c:[
  {l:'간다', run:S=>{ const s=clamp(S.job?S.job.sal*1.25:4500,4500,9000); S.job={name:'중견기업', sal:Math.round(s), hon:2, kind:'사무'}; S.track=null; add(S,{행:10, 인:6, hon:2}); hl(S,`${S.age}세, 중학교 때 편들어준 친구가 손을 내밀었다`); return '첫 출근 날, 대표실 액자에 중학교 졸업사진이 걸려 있었다.'; }},
  {l:'마음만 받는다', e:{행:8, 인:8, 멘:5}, t:'그날 밤 둘이서 소주를 마셨다. 그 친구가 울었다.'}]},
{id:'pay_jeonu', a:[35,58], if:S=>S.f.has('전우'), w:3, t:'훈련소 첫날 밤 울던 그 동기가 찾아왔다. 사업을 하는데 투자자가 필요하다고 한다.', c:[
  {l:'믿고 투자한다', need:S=>S.money+(S.inv||0)>=3000, needT:'여윳돈 3천만원', run:S=>{ if(R()<.55){ add(S,{돈:6000, 인:4}); hl(S,'전우의 사업이 대박 났다'); return '3년 뒤 회사가 상장했다. “너 덕분이다, 전우야.”'; } add(S,{돈:-3000, 인:2}); return '사업은 접었다. 그래도 우정은 남았다.'; }},
  {l:'응원만 한다', e:{인:3}, t:'개업식에 화환을 보냈다.'}]},
{id:'pay_teacher', a:[30,50], if:S=>S.f.has('대든학생'), w:4, t:'동창회에 그때 그 선생님이 오셨다. 내가 수업 시간에 대들었던 그분이다. 머리가 하얗게 셌다.', c:[
  {l:'먼저 다가가 사과한다', e:{멘:8, hon:1, 행:4}, t:'“나도 그때 말이 심했다. 잘 컸구나.” 선생님이 내 손을 오래 잡았다.'},
  {l:'모른 척한다', e:{멘:-3}, t:'집에 오는 길 내내 그 얼굴이 떠올랐다.'}]},
{id:'pay_runaway', a:[27,42], if:S=>S.f.has('가출') && !S.f.has('화해') && !S.f.has('부모별세'), w:4, t:'명절 밤. 아빠가 말없이 술 한 잔을 따라주며 말했다. “그때는… 내가 미안했다.”', c:[
  {l:'“저도요.”', e:{par:15, 멘:8, 행:5, f:'화해'}, t:'둘 다 눈이 빨개졌다. 다음 날 아침, 아빠가 처음으로 내 차까지 배웅했다.'},
  {l:'아직은 대답하지 못한다', e:{par:-2, 멘:-2}, t:'잔만 비웠다.'}]},
{id:'pay_cringe', a:[22,34], if:S=>S.f.has('흑역사'), w:3, t:'“○년 전 오늘” 알림이 떴다. 중학생 때 새벽에 올린 그 글이다. “세상은 나를 몰라준다…”', c:[{l:'이불을 찬다', e:{행:3}, t:'조용히 삭제했다. 친구가 이미 캡처해뒀다.'}]},
{id:'pay_2002', a:[23,45], if:S=>S.f.has('길거리응원') && S.year===2022, w:20, t:'카타르 월드컵 16강 새벽. 20년 전 시청 앞에서 같이 소리 지르던 친구에게서 카톡이 왔다. “그때 기억나?”', c:[{l:'“당연하지.”', e:{행:6, 인:3}, t:'새벽 2시, 둘이 영상통화로 같이 소리를 질렀다.'}]},
{id:'pay_cyworld', a:[25,45], if:S=>S.f.has('싸이월드') && S.year>=2022, w:3, t:'싸이월드 사진첩이 복구됐다는 소식. 로그인하니 미니홈피 BGM이 흘러나왔다.', c:[{l:'사진을 넘겨본다', e:{행:5, 인:2}, t:'얼짱 각도, 일촌평, 도토리. 웃다가 조금 울었다.'}]},
{id:'pay_campfire', a:[30,55], if:S=>S.f.has('캠프눈물') && !S.f.has('부모별세'), w:2, t:'엄마 생신. 엄마가 지갑에서 꼬깃꼬깃한 종이를 꺼냈다. 중학교 수련회 때 내가 쓴 편지다.', c:[{l:'다시 편지를 쓴다', e:{par:8, 행:5}, t:'20년 만에 두 번째 편지를 썼다. 엄마가 그것도 지갑에 넣었다.'}]},
{id:'pay_knee', a:[55,85], if:S=>S.f.has('무릎부상')||S.f.has('다리골절'), w:.5, t:'비 오는 날이면 그때 다친 다리가 먼저 안다. 쑤신다.', c:[{l:'파스를 붙인다', e:{체:-4}, t:'젊을 땐 몰랐다. 몸은 다 기억한다.'}]},
{id:'pay_sportsclub', a:[38,60], if:S=>S.f.has('운동부'), w:2, t:'중학교 운동부 동창들이 조기축구회를 만들었다. 일요일 아침 6시.', c:[
  {l:'나간다', e:{체:6, 인:6, 행:4}, t:'몸은 예전 같지 않지만 패스는 기억났다.'},
  {l:'잠이 더 좋다', e:{}, t:'단톡방 사진만 봤다.'}]},
{id:'pay_mentor', a:[35,60], if:S=>S.seen.has('mentor') && ability(S,S.focus)>=65, w:.5, t:S=>`${S.focus}을(를) 가르쳐주셨던 선생님의 부고가 왔다. 장례식장에서 선생님 가족이 말했다. “당신 얘기를 자주 하셨어요.”`, c:[
  {l:'이제 내가 누군가를 가르친다', e:{hon:4, 멘:3}, t:'그해부터 주말마다 아이들을 가르치기 시작했다.'}]},
{id:'pay_network', a:[28,55], if:S=>S.s.인>=65, w:1.5, t:'오랜 친구가 연락했다. “우리 쪽에 자리가 하나 났는데, 너 생각나더라.”', c:[
  {l:'옮긴다', run:S=>{ if(S.job){ S.job.sal=Math.round(S.job.sal*1.2); add(S,{행:5}); return '연봉이 20% 올랐다. 인맥이 일을 했다.'; } S.f.add('추천'); S.queue.unshift({kind:'ms', name:'track'}); return '친구의 추천서를 들고 다시 도전한다.'; }},
  {l:'지금 자리에 남는다', e:{인:2}, t:'고맙다고 밥을 샀다.'}]},
{id:'net_rescue', a:[25,58], if:S=>!S.job && !S.studying && !S.retired && S.s.인>=55 && S.track, w:3, t:'일을 구하고 있다는 소식에 친구들이 단톡방에 채용 공고를 쏟아냈다.', c:[{l:'고맙다', e:{멘:6, f:'추천'}, t:'다음 지원서에는 추천인이 생겼다.'}]},
{id:'lonely_old', a:[68,95], if:S=>S.s.인<30, w:2, t:'명절인데 전화가 한 통도 오지 않았다. 텔레비전 소리만 집 안을 채운다.', c:[
  {l:'복지관 프로그램에 나간다', e:{인:6, 행:3}, t:'처음엔 어색했는데 바둑 친구가 생겼다.'},
  {l:'그냥 지낸다', e:{행:-4}, t:'하루가 길다.'}]},
{id:'career_change', a:[30,52], if:S=>S.job && S.job.kind!=='선수', w:S=>S.s.행<45?.4:.08, t:'출근길 지하철. 이 일을 10년 더 할 수 있을까? 해보고 싶던 일이 떠오른다.', c:[
  {l:'새 길에 도전한다', run:S=>{ const old=S.job?S.job.name:'하던 일'; S.job=null; S.track=null; add(S,{행:6, 멘:-3, 돈:-300}); S.queue.unshift({kind:'ms', name:'track'}); hl(S,`${S.age}세, ${old}을(를) 그만두고 새 길에 도전`); return '사직서를 내는 손이 떨렸다. 그래도 가슴이 뛰었다.'; }},
  {l:'퇴근 후에 조금씩 준비한다', e:{체:-3, f:'추천', spec:4}, t:'밤마다 학원에 다녔다. 언젠가를 위해.'},
  {l:'지금 일에 집중한다', e:{멘:2}, t:'익숙한 게 나쁜 것만은 아니다.'}]},
);
['pay_uiri','pay_jeonu','pay_teacher','pay_runaway','pay_cringe','pay_2002','pay_cyworld','pay_campfire','pay_knee','pay_sportsclub','pay_mentor','pay_network','net_rescue','lonely_old','career_change'].forEach(id=>EVMAP[id]=EVENTS.find(e=>e.id===id));
['pay_uiri','pay_jeonu','pay_teacher','pay_runaway','pay_network','career_change'].forEach(id=>MAJOR.add(id));

if(EVMAP.sports_injury) EVMAP.sports_injury.w=.35;
if(EVMAP.mentor) EVMAP.mentor.w=.6;
// 해마다 등장 확률로 제한 (너무 흔하면 회수의 맛이 없다)
[['pay_knee',.03],['pay_mentor',.04],['career_change',.035],['pay_sportsclub',.05],['sports_injury',.03]].forEach(([id,p])=>{ const e=EVMAP[id]; if(!e) return; const f=e.if; e.if=S=>(!f||f(S)) && R()<p; });
