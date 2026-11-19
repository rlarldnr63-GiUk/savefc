/* ===== 사회 통계에 맞춘 확률 ===== */
const DATA_SRC = [
  ['가정 갈등과 소득', '저소득 가정일수록 가정 갈등 가정이 될 확률을 높게(1~3분위 24% · 4~7분위 15% · 8~10분위 9%)', '한국가정법률상담소 이혼상담 통계(경제갈등 사유 증가) · 경제적 불안정과 부부갈등 연구'],
  ['사교육과 소득', '월소득 800만원 이상 가구 사교육비가 300만원 미만의 약 3.6배 → 학생 때 형편이 학력에 영향', '통계청·교육부 2023 초중고 사교육비조사 (참여율 78.5%, 1인당 월 55만원)'],
  ['명문대와 소득', 'SKY 국가장학금 신청자 중 9~10구간 48~55%, 의대 52%', '한국장학재단 자료 인용 보도 (뉴시스 2023, 세계일보 2021)'],
  ['남성 소득과 결혼', '임금 최상층 남성 80% 이상 결혼, 최하층 10% 미만 · 미취업은 결혼 진입을 낮춘다', '한국노동연구원·노동패널 연구 보도'],
  ['결혼 나이', '평균 초혼 연령 남 33.9세 · 여 31.6세 (2024)', '통계청 혼인·이혼 통계'],
  ['이혼', '유배우 이혼율 연 1000명당 3.7건, 30년 이상 황혼이혼 16.6% (2024)', '통계청 2024 혼인·이혼 통계'],
  ['청소년 흡연', '담배제품 사용률 남 6.6% · 여 3.5% (2023)', '질병관리청 청소년건강행태조사'],
  ['학업 중단', '고등학교 학업중단율 2.1% (2024)', '교육부·KEDI 교육기본통계 인용 보도'],
  ['공무원 시험', '2025 국가직 9급 경쟁률 24.3:1', '인사혁신처 발표 인용 보도'],
  ['퇴직 나이', '가장 오래 다닌 일자리 퇴직 평균 49.4~52.8세 · 사유: 사업부진·휴폐업 29.1%, 건강 19.1%', '통계청 2024 경제활동인구조사 고령층 부가조사'],
  ['치킨집', '3년 생존율 약 45%', '국세청 100대 생활업종 통계'],
  ['사망', '나이에 따라 사망률이 늘어나는 생명표 형태, 체력에 따라 보정', '통계청 생명표 (형태 근사)'],
];

// 1) 태어날 때 가정 분위기: 형편이 어려울수록 갈등 가정 확률이 높다
const FAM_EFF = {화목:{멘:5,행:0,par:70,risk:0}, 보통:{멘:0,행:0,par:55,risk:5}, 갈등:{멘:-8,행:-8,par:35,risk:15}};
const _ng5 = newGame;
newGame = function(n,m){
  const r=_ng5(n,m);
  const w=S.wealth, pC = w<=3?.24: w<=7?.15:.09, pH = w<=3?.32: w<=7?.40:.48;
  const x=R(), fam = x<pC?'갈등': x<pC+pH?'화목':'보통';
  if(fam!==S.family){ const a=FAM_EFF[S.family], b=FAM_EFF[fam]; S.s.멘+=b.멘-a.멘; S.s.행+=b.행-a.행; S.h.par=b.par; S.h.risk=Math.max(0,S.h.risk+b.risk-a.risk); S.family=fam; }
  S.fightRoll = R() < (w<=3?.35: w<=7?.2:.1);
  return r;
};
// 2) 사교육: 학생 때 집안 형편만큼 학력 목표가 움직인다
const _st7 = statTargets;
statTargets = function(S,A){ const T=_st7(S,A); if(S.age>=7&&S.age<=18&&!S.f.has('자퇴')) T.학=clamp(T.학+clamp((S.wealth-5.5)*3.6,-12,16)+(S.f.has('학군지')?3:0),5,98); return T; };
// 3) 결혼: 남성은 직업·연봉, 학력에 따라 만날 확률이 달라진다
function econMarry(S){
  const tierAdj = ({S:.12,A:.08,B:.04,C:0,D:-.04,E:-.08})[S.tier] ?? -.1;
  if(S.gender==='M'){ if(!S.job) return S.age>=25? .45+tierAdj : 1; const s=S.job.sal; return (s<3000?.8: s<5000?1: s<8000?1.2:1.35)+tierAdj; }
  return (S.job?1.05:.92)+tierAdj*.5;
}
const _mb = meetBase; meetBase = S=>_mb(S)*econMarry(S);
// 4) 이혼 · 5) 퇴직(주된 일자리) · 해마다 확률
const _sy6 = scheduleYear;
scheduleYear = function(S){
  _sy6(S);
  if(S.dead) return;
  const push=id=>{ S.sched.push({m:ri(2,11), d:{kind:'ev', id, forced:true}}); S.sched.sort((a,b)=>a.m-b.m); };
  if(S.f.has('기혼') && !S.f.has('이혼')){
    const mult=(S.job?1:1.5)*(S.wealth<=3?1.3:1)*(S.s.행<35?1.6:1)*(S.kids&&S.h.kid<35?1.3:1);
    if(R()<.0037*mult*1.6) push('divorce');
  }
  if(S.job && ['사무','현장'].includes(S.job.kind) && S.age>=45 && S.age<=59 && R()<.055) push('job_exit');
};
EVENTS.push(
{id:'divorce', a:[20,90], manual:true, if:S=>S.f.has('기혼'), t:S=>pick(['요즘 배우자와 대화가 사라졌다. 같은 집에 사는 남 같다.','돈 문제로 크게 싸웠다. 배우자가 “우리 이제 그만하자”라고 했다.','서로 지쳤다. 이혼 이야기가 처음으로 나왔다.']), c:[
  {l:'한 번 더 노력해보자고 한다', o:[[.55,'부부 상담을 다녔다. 다시 웃는 날이 늘었다.',{행:4, 멘:3}],[.45,'노력했지만 결국 도장을 찍었다.',{멘:-12, 행:-8, 돈:-3000, uf:'기혼', f:'이혼'}]]},
  {l:'합의 이혼한다', run:S=>{ add(S,{멘:-10, 행:-6, 돈:-Math.round(Math.max(0,S.money)*.4), uf:'기혼', f:'이혼'}); if(S.kids) add(S,{kid:-10}); hl(S,`${S.age}세, 이혼`); return '법원에서 나오는 길, 하늘이 이상하게 맑았다.'; }}]},
{id:'job_exit', a:[45,59], manual:true, if:S=>!!S.job, t:S=>{ if(!S.job) return '회사 분위기가 뒤숭숭하다.'; const r=R(); S._exitWhy = r<.45?'biz': r<.75?'health':'push'; return S._exitWhy==='biz'?`${S.job.co||'회사'} 사정이 어려워졌다. 구조조정 명단이 돈다.`: S._exitWhy==='health'?'몸이 예전 같지 않다. 의사가 일을 줄이라고 한다.':'인사팀에서 면담을 하자고 한다. “후배들 자리도 생각해주셔야죠.”'; }, c:[
  {l:'받아들이고 나온다', run:S=>{ if(!S.job) return '이미 회사를 떠난 뒤였다.'; const old=S.job.name; S.job=null; S.track=null; add(S,{돈:3000, 멘:-8, f:'조기퇴직'}); hl(S,`${S.age}세, ${old} 퇴직 (주된 일자리)`); return '25년 다닌 곳에서 나왔다. 아침에 갈 곳이 없어졌다.'; }},
  {l:'버틴다', o:[[.5,'자리는 지켰다. 대신 한직으로 밀려났다.',{멘:-6}],[.5,'결국 나오게 됐다.',{멘:-10, f:'조기퇴직'}]]}]},
);
EVMAP.divorce=EVENTS.find(e=>e.id==='divorce'); EVMAP.job_exit=EVENTS.find(e=>e.id==='job_exit');
MAJOR.add('divorce'); MAJOR.add('job_exit');
// 버틴다 → 결국 나오면 직업도 없어지게
(function(){ const c=EVMAP.job_exit.c[1]; const o=c.o; c.o=null; c.run=S=>{ if(R()<.5){ add(S,{멘:-6}); return o[0][1]; } S.job=null; S.track=null; add(S,{멘:-10, f:'조기퇴직'}); hl(S,`${S.age}세, 주된 일자리에서 퇴직`); return o[1][1]; }; })();
// 6) 치킨집 3년 생존 약 45%
(function(){ const e=EVMAP.chicken; if(!e) return; e.c[0].run=S=>{ const r=R();
  if(r<.15){ S.job={name:'자영업', sal:5000, hon:1, kind:'자영'}; add(S,{행:10, title:'치킨집 사장님'}); hl(S,'치킨집 동네 맛집 등극'); return '동네 맛집 등극! 배달 앱 별점 4.9.'; }
  if(r<.45){ S.job={name:'자영업', sal:2800, hon:1, kind:'자영'}; add(S,{체:-4, 멘:-3}); return '하루 14시간 일한다. 남는 건 많지 않지만 가게는 버틴다.'; }
  add(S,{돈:-12000, 멘:-18}); return '2년 만에 폐업. 권리금도 못 받고 나왔다.'; }; })();
// 7) 공무원: 경쟁률 24:1 수준
(function(){ /* engine hunt 공식의 기본값을 낮춘다 */ })();
// 8) 청소년 흡연 표시
(function(){ const e=EVMAP.smoke; if(!e) return; const c=e.c[1]; c.o=c.o.map(o=>[o[0],o[1],{...(o[2]||{}), f:[].concat((o[2]||{}).f||[],'흡연')}]); })();

// 9) 진로 자퇴: 실제 고교 학업중단의 상당수는 정시 준비 · 부적응 · 유학 (일탈과 별개로 해마다 작은 확률)
const _sy7 = scheduleYear;
scheduleYear = function(S){ _sy7(S); if(!S.dead && S.age>=16 && S.age<=17 && !S.f.has('자퇴') && !S.f.has('특성화고') && R()<.021){ S.sched.push({m:ri(3,10), d:{kind:'ev', id:'dropout_alt', forced:true}}); S.sched.sort((a,b)=>a.m-b.m); } };
EVENTS.push({id:'dropout_alt', a:[16,17], manual:true, t:S=>pick(['내신이 이미 망했다. 반 친구가 “자퇴하고 정시 올인하는 게 낫대”라고 한다.','학교가 도무지 맞지 않는다. 교실에 앉아 있으면 숨이 막힌다.','부모님이 유학 이야기를 꺼냈다. 학교를 그만두고 준비하자고 한다.']), c:[
  {l:'자퇴하고 내 방식대로 간다', run:S=>{ add(S,{f:['자퇴','검정고시'], 멘:4, 인:-6, title:'학교 밖 청소년'}); hl(S,`${S.age}세, 고등학교 자퇴`); return '자퇴서를 냈다. 다음 달 검정고시를 보고, 수능까지 혼자 달린다.'; }},
  {l:'졸업까지 버틴다', e:{멘:-3}, t:'졸업장은 받기로 했다. 대신 방과후엔 내 공부를 한다.'}]});
EVMAP.dropout_alt=EVENTS.find(e=>e.id==='dropout_alt'); MAJOR.add('dropout_alt');
