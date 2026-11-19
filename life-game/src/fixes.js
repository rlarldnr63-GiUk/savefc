/* ===== 인과관계 정리 ===== */

// 1) 사건이 실제로 일어나는 순간에도 조건이 맞는지 다시 확인한다 (같은 해에 직업을 잃었는데 팀장 호출이 오는 일 방지)
function stillValid(S,d){
  if(d.kind==='ev'){ const e=EVMAP[d.id]; if(!e) return false; if(S.age<e.a[0]||S.age>e.a[1]) return d.forced||false;
    if(e.if && !e.if(S)) return false; if(typeof e.w==='function' && e.w(S)<=0 && !d.forced) return false; if(S.armyLeft>0 ? e.tag!=='army' : e.tag==='army') return false; return true; }
  if(d.kind==='news'){ const n=NEWS[d.idx]; return !n.if || n.if(S); }
  return true;
}

// 2) 나이에 맞는 매달 문장
const MONTH_BABY = {1:'설날. 한복을 입혀놓으니 다들 사진을 찍었다.',2:'아직 춥다. 집 안에서 기어 다녔다.',3:'봄. 유모차를 타고 동네를 돌았다.',4:'벚꽃 아래서 엄마 품에 안겨 사진을 찍었다.',5:'어린이날. 선물 포장지가 더 좋았다.',6:'이유식을 반은 먹고 반은 던졌다.',7:'장마. 창밖 빗소리를 들으며 잠들었다.',8:'더운 여름. 대야 물놀이.',9:'추석. 친척들이 돌아가며 안아줬다.',10:'가을 산책. 낙엽을 집어 먹으려 했다.',11:'감기에 걸려 소아과에 다녀왔다.',12:'첫 크리스마스(또는 몇 번째 크리스마스). 트리 불빛을 한참 봤다.'};
const MONTH_KIDS = {1:'설날. 세뱃돈을 엄마가 “맡아준다”며 가져갔다.',2:'어린이집(유치원) 방학. 하루 종일 만화를 봤다.',3:'새 반에 올라갔다. 선생님이 바뀌었다.',4:'벚꽃 소풍. 도시락은 김밥.',5:'어린이날! 놀이공원은 사람 반 줄 반.',6:'여름이 시작됐다. 수박이 달다.',7:'장마. 장화를 신고 물웅덩이를 밟았다.',8:'여름휴가. 할머니 댁, 계곡, 모기.',9:'추석. 송편을 만들다 반죽만 먹었다.',10:'가을 운동회. 엄마 아빠가 응원 왔다.',11:'첫눈이 왔다.',12:'크리스마스. 산타 선물을 기다린다.'};
const MONTH_DROPOUT = {1:'친구들은 학원에 가고, 나는 알바를 간다.',3:'친구들은 새 학기. 나는 아니다.',5:'검정고시 문제집을 폈다 덮었다.',7:'낮에 PC방이 한산하다.',9:'친구들 수시 얘기가 단톡방에 올라온다.',11:'수능 날. 나도 시험장에 갈 수 있을까.',12:'한 해가 이렇게 지나갔다.'};
const MONTH_UNI = {1:'방학. 토익 학원과 알바 사이.',2:'수강신청 전쟁.',3:'개강. 과 단톡방이 다시 시끄러워졌다.',4:'중간고사. 도서관 자리 맡기.',5:'축제. 주점에서 밤을 새웠다.',6:'기말고사. 레포트 마감이 세 개.',7:'여름방학. 대외활동 지원서를 썼다.',8:'계절학기. 한 학기를 3주에 몰아서.',9:'2학기 개강.',10:'중간고사. 시험 기간에만 도서관이 붐빈다.',11:'공채 시즌. 선배들이 정장을 입고 다닌다.',12:'종강! 그리고 다시 방학.'};
function adultLine(S,m){
  const pAlive=!S.f.has('부모별세'), job=!!S.job;
  const L={1:'새해 계획을 세웠다. 헬스장 등록.',2:job?'연말정산 서류를 챙겼다.':'채용 공고를 훑었다.',3:'봄. 미세먼지 경보가 떴다.',4:'벚꽃 시즌. 여의도는 사람으로 꽉 찼다.',
    5:pAlive?'가정의 달. 어버이날 용돈이 나갔다.':'어버이날. 부모님 사진 앞에 카네이션을 놓았다.',6:job?'상반기 마감. 야근이 늘었다.':'더위가 시작됐다.',7:job?'장마. 출근길 신발이 젖었다.':'장마. 창밖만 봤다.',
    8:'여름휴가. 바다는 사람 반 물 반.',9:pAlive?'추석 준비. 고속도로가 막힌다.':'추석. 성묘를 다녀왔다.',10:'가을. 단풍 구경을 계획만 했다.',11:pAlive?'김장철. 본가에서 김치를 받아 왔다.':'김장철. 올해는 김치를 사 먹었다.',12:job?'송년회 시즌. 간이 쉴 틈이 없다.':'한 해가 또 갔다.'};
  return L[m];
}
function oldLine(S,m){
  const kids=S.kids>0, gk=S.f.has('손주');
  const L={1:kids?'설날. 자식들이 올지 전화를 기다린다.':'설날. 조용한 명절.',2:'아직 춥다. 무릎이 쑤신다.',3:'봄볕에 공원 벤치에 앉았다.',4:'꽃구경을 다녀왔다.',5:kids?'어버이날. 카네이션이 왔다.':'어버이날. 경로당에서 카네이션을 달아줬다.',6:'텃밭에 상추를 심었다.',7:'장마. 관절이 먼저 안다.',8:'폭염. 경로당 에어컨 아래 모였다.',9:gk?'추석. 손주들 키가 또 컸다.':kids?'추석. 자식들이 다녀갔다.':'추석. 동네 경로당에서 송편을 나눠 먹었다.',10:'단풍놀이 관광버스.',11:'김장을 했다. 이번엔 조금만.',12:'한 해가 또 갔다.'};
  return L[m];
}
monthLine = function(S,m){
  const a=S.age;
  if(S.armyLeft>0) return ['혹한기 훈련.','행군 40km.','PX에서 냉동식품.','유격 훈련.','휴가 D-30.','부대 체육대회.','장마철 제초 작업.','훈련 없는 주말.','추석 당직.','진지 공사.','첫눈 제설 작업.','연말 전투휴무.'][m-1];
  if(a<3) return MONTH_BABY[m];
  if(a<7) return MONTH_KIDS[m];
  if(a<19 && S.f.has('자퇴') && a>=15) return MONTH_DROPOUT[m]||null;
  if(a<13) return MONTH_LINE.child[m];
  if(a<19) return MONTH_LINE.teen[m];
  if(S.studying) return MONTH_UNI[m];
  if(a<65) return adultLine(S,m);
  return oldLine(S,m);
};

// 3) 아기 · 미취학은 학력 · 인맥 · 매력이 '떨어지지' 않는다 (배우는 중이지 잊는 나이가 아니다)
const _st5 = statTargets;
statTargets = function(S,A){
  const T=_st5(S,A);
  if(S.age<7){ T.학=Math.max(T.학, S.s.학); T.인=Math.max(T.인, S.s.인); T.매=Math.max(T.매, S.s.매); T.행=Math.max(T.행, 50); }
  return T;
};
const _ds2 = driftSrc;
driftSrc = function(S,k,v,A){
  const a=S.age, p=x=>A[x]||0;
  if(a<7){
    if(v>0) return ({학:'그림책·배우기 놀이', 체:'뛰어놀기', 멘:'푹 자기', 행:'놀이', 인:'어린이집 친구', 매:'무럭무럭'})[k]||'자라는 중';
    return ({체:'잔병치레', 멘:'떼쓰기·낯가림', 행:'심심함'})[k]||'자라는 중';
  }
  if(a<13 && v<0){
    if(k==='인') return '친구와 놀 시간 부족'; if(k==='학') return p('study')<=3?'숙제만 하고 놀았다':'배운 걸 잊음';
    if(k==='멘') return p('study')>=6?'학원에 지침':'쉴 시간 부족';
  }
  if(a>=65 && k==='학' && v<0) return '깜빡깜빡';
  return _ds2(S,k,v,A);
};

// 4) 사건 조건 보완
(function(){
  const req=(id,f)=>{ const e=EVMAP[id]; if(!e) return; const o=e.if; e.if=S=>(!o||o(S)) && f(S); };
  req('sugang',S=>S.studying);
  ['su_100','mock_fail','school_trip','lunch_run','saeteuk','jasoseo','counsel','yaja','study_plan','hs_love'].forEach(id=>req(id,S=>!S.f.has('자퇴')));
  ['midterm_prep','baejeong','uniform','camp_fire'].forEach(id=>req(id,S=>!S.f.has('자퇴')));
  const bo=EVMAP.burnout; if(bo){ const w=bo.w; bo.w=S=>S.job?w(S):0; }
  ['friday6','hoesik','overwork','promotion','weekend_kakao','yearend_tax','side_job','office_love','first_salary','headhunt'].forEach(id=>req(id,S=>!!S.job));
  req('indep',S=>!S.f.has('부모별세')); req('matseon',S=>!S.f.has('부모별세')); req('pay_campfire',S=>!S.f.has('부모별세'));
  req('holiday_order',S=>!S.f.has('부모별세'));
  req('learn_kakao',S=>true);
  const lk=EVMAP.learn_kakao; if(lk) lk.t=S=>S.kids>0?'손주(자식) 사진을 카톡으로 보내고 싶은데 방법을 모르겠다.':'친구가 카톡으로 사진을 보냈는데 여는 법을 모르겠다.';
  const hr=EVMAP.honorary_retire; if(hr && hr.c[2]){ hr.c[2].run=S=>{ add(S,{돈:20000, f:'조기퇴직'}); S.job=null; S.retired=true; return S.f.has('기혼')?'위로금으로 창업 준비를 시작했다. 배우자는 반대했다.':'위로금으로 창업 준비를 시작했다. 주변에서 다 말렸다.'; }; }
  const mt=EVMAP.matseon; if(mt) mt.c[0].o=[[.5,'호텔 커피숍에서 만났다. 생각보다 대화가 잘 통했다.',{행:6, f:'연애중'}],[.5,'서로 부모님 얘기만 하다 끝났다.',{돈:-5}]];
  // 결혼율 현실화: 소개팅·맞선이 더 자주
  const bd=EVMAP.blind_date; if(bd){ const w=bd.w; bd.w=S=>w(S)*1.8; }
  if(mt){ const w=mt.w; mt.w=S=>(typeof w==='function'?w(S):w)*1.6; }
})();
// 5) 진로 카드: 쉬운 길(중소기업·택배·보험)은 항상 뒤로
const _to = trackOptions;
trackOptions = function(S){ const easy=['중소기업','택배 기사','보험설계사','생산직']; const all=_to(S); return all.filter(t=>!easy.includes(t)).concat(all.filter(t=>easy.includes(t))); };
// 6) 여러 번 떨어지면 조금씩 붙을 확률이 오른다 (경험)
const _sh = snowHunt;
snowHunt = function(S){ return _sh(S) + Math.min(.2, (S.attempts-1)*.04); };

(function(){ const g=EVMAP.grandma_country; if(g) g.t=S=>S.age<7?'여름, 시골 할머니 댁. 마당에 개울이 흐른다.':'여름방학, 시골 할머니 댁. 마당에 개울이 흐른다.'; })();
if(EVMAP.find_art) EVMAP.find_art.a=[7,11];
(function(){ const e=EVMAP.try_lead; if(e){ const o=e.if; e.if=S=>(!o||o(S)) && !S.f.has('자퇴'); } })();

// 학교 관련 뉴스는 재학생에게만
NEWS.forEach(n=>{ if(/학교|수학여행|휴교|놀토|주5일|학원/.test((n.t||'')+n.h)){ const o=n.if; n.if=S=>(!o||o(S)) && !S.f.has('자퇴') && S.age>=7; } });
