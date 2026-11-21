/* ===== 직업마다 다른 인생 (2026-11) =====
   1) 같은 이벤트 반복 제한: 한 번 본 이벤트는 몇 년 쉬었다 나온다
   2) 회사 이벤트(팀장님·회식·야근·승진)는 회사원에게만
   3) 직업마다 고유 이벤트 묶음 — 수입이 출렁이고, 직업다운 갈림길이 나온다
   4) 프리랜서·예체능·자영업은 해마다 수입이 크게 오르내린다 (회사원은 거의 일정) */

// 1) 반복 제한
const EV_COOLDOWN = {exercise:6, health_check:5, friday6:5, overwork:4, hoesik:5, yearend_tax:6, promotion:4, wedding_guest:4, blind_date:3, buy_house:4};
const _rcJL = resolveCard;
resolveCard = function(S,d,i){ if(d.kind==='ev'){ S.evLast=S.evLast||{}; S.evLast[d.id]=S.age; } return _rcJL(S,d,i); };
EVENTS.forEach(e=>{ if(!e.rep) return; const f=e.if; e.if=S=>(!f||f(S)) && !(S.evLast && S.evLast[e.id]!=null && S.age-S.evLast[e.id]<(EV_COOLDOWN[e.id]??3)); });

// 2) 회사원 전용
const NON_OFFICE = ['크리에이터','배우·모델','웹툰 작가','운동선수','프로게이머','자영업','배달 라이더','택배 기사','미용사','셰프','디자이너·예술가','귀농','알바','코치·지도자','공인중개사','보험설계사','요양보호사'];
function isOffice(S){ return !!S.job && !NON_OFFICE.includes(S.job.name); }
['friday6','hoesik','overwork','promotion','weekend_kakao','office_love','headhunt','yearend_tax','quit_travel','side_job'].forEach(id=>{ const e=EVMAP[id]; if(!e) return; const f=e.if; e.if=S=>(!f||f(S)) && isOffice(S); });

// 4) 수입 변동: 해마다 운이 다르다
const JOB_VOL = {'크리에이터':[.45,.25], '배우·모델':[.55,.3], '웹툰 작가':[.35,.18], '운동선수':[.2,.12], '프로게이머':[.3,.15], '자영업':[.35,.15], '디자이너·예술가':[.3,.12],
  '보험설계사':[.3,.1], '공인중개사':[.4,.12], '영업직':[.2,.06], '배달 라이더':[.2,.05], '택배 기사':[.12,.04], '미용사':[.15,.05], '셰프':[.12,.05], '귀농':[.35,.08]};
const _ytJL = yearTick;
yearTick = function(S,ms){
  const j=S.job, v=j && JOB_VOL[j.name];
  if(!v){ _ytJL(S,ms); return; }
  const [luck, walk]=v, base=j.sal, f=Math.exp(gauss()*luck - luck*luck/2);
  j.sal=base*f; _ytJL(S,ms);
  if(S.job===j){ const grown=j.sal/(base*f); const typ=(JOBS[j.name]&&JOBS[j.name].sal)||3000; let nb=base*grown*Math.exp(gauss()*walk - walk*walk/2); nb*=Math.pow(typ/nb,.12); j.sal=clamp(nb, 600, JOB_CAP[j.name]||30000); S.lastYearInc=Math.round(base*f);
    if(f>1.7) ms.push({kind:'info', title:'대박 난 한 해', text:`올해 수입 ${won(base*f)}. 평소의 ${f.toFixed(1)}배를 벌었다.`});
    else if(f<.55) ms.push({kind:'info', title:'보릿고개', text:`올해 수입 ${won(base*f)}. 평소의 절반도 안 된다. 통장 잔고만 본다.`}); }
};

// 3) 직업별 이벤트
const JOB_CAP = {'크리에이터':60000,'배우·모델':80000,'웹툰 작가':40000,'운동선수':60000,'프로게이머':30000,'자영업':50000,'의사':40000,'디자이너·예술가':20000,'개발자':25000};
const salX=(S,m)=>{ if(S.job) S.job.sal=Math.round(clamp(S.job.sal*m,600,JOB_CAP[S.job.name]||30000)); };
const jobIs=(...n)=>S=>!!S.job && n.includes(S.job.name);
const JOB_EVENTS = [
 // 크리에이터
 {id:'cr_viral', a:[19,60], if:jobIs('크리에이터'), w:2, t:'아무 생각 없이 올린 영상이 알고리즘을 탔다. 하룻밤 새 조회수 300만.', c:[
  {l:'후속 영상을 몰아서 찍는다', run:S=>{ salX(S,1.7); add(S,{멘:-5, 체:-3, 행:6}); hl(S,`${S.age}세, 영상 하나가 터졌다`); return '일주일에 영상 다섯 개. 구독자가 두 배가 됐다. 대신 잠은 4시간.'; }},
  {l:'평소 속도를 지킨다', run:S=>{ salX(S,1.2); add(S,{멘:3}); return '반짝 인기는 금방 식었다. 그래도 남은 구독자가 꽤 된다.'; }}]},
 {id:'cr_algo', a:[19,60], if:jobIs('크리에이터'), w:2, t:'플랫폼 알고리즘이 바뀌었다. 같은 영상인데 조회수가 반 토막이다.', c:[
  {l:'숏폼으로 갈아탄다', run:S=>{ if(R()<.5){ salX(S,1.5); add(S,{행:5}); return '15초짜리 영상이 터졌다. 새 판에서 다시 올라섰다.'; } salX(S,.75); add(S,{멘:-5}); return '숏폼은 내 스타일이 아니었다. 기존 구독자마저 떠났다.'; }},
  {l:'하던 대로 버틴다', run:S=>{ salX(S,.7); add(S,{멘:-4}); return '수익이 30% 줄었다. 그래도 진짜 팬들은 남았다.'; }}]},
 {id:'cr_ad', a:[20,60], if:jobIs('크리에이터'), w:2, t:'광고 문의 메일. 건당 1,500만 원. 그런데 평소에 안 쓰는 제품이다.', c:[
  {l:'받는다', run:S=>{ add(S,{돈:1500}); if(R()<.3){ salX(S,.6); add(S,{hon:-4, 멘:-8}); hl(S,`${S.age}세, 뒷광고 논란`); return '“내돈내산 아니었네?” 댓글이 쏟아졌다. 구독 취소가 줄을 이었다.'; } return '광고비로 새 장비를 샀다. 아무도 눈치채지 못했다.'; }},
  {l:'거절한다', run:S=>{ add(S,{hon:2, 인:2}); salX(S,1.05); return '“이 채널은 광고를 가려서 받는다”는 댓글이 고정됐다.'; }}]},
 {id:'cr_fire', a:[20,60], if:jobIs('크리에이터'), w:2, t:'7년 전 영상 하나가 다시 퍼졌다. 댓글창이 불타고 있다.', c:[
  {l:'바로 사과 영상을 올린다', run:S=>{ salX(S,.8); add(S,{멘:-6}); return '회색 티셔츠를 입고 고개를 숙였다. 한 달 뒤 조용해졌다.'; }},
  {l:'라이브로 해명한다', run:S=>{ if(R()<.45){ salX(S,1.3); add(S,{인:3}); return '오해가 풀렸다. 오히려 “솔직해서 좋다”며 구독자가 늘었다.'; } salX(S,.45); add(S,{멘:-12, hon:-3}); hl(S,`${S.age}세, 해명 방송이 역풍을 맞았다`); return '말을 할수록 꼬였다. 광고가 전부 끊겼다.'; }}]},
 {id:'cr_burn', a:[24,60], if:jobIs('크리에이터'), w:2, t:'3년째 주 3회 업로드. 카메라 빨간 불만 보면 숨이 막힌다.', c:[
  {l:'휴식 공지를 올린다', run:S=>{ salX(S,.6); add(S,{멘:12, 행:6}); return '석 달 쉬었다. 돌아오니 구독자 절반이 남아 있었다. 그걸로 됐다.'; }},
  {l:'그냥 계속 찍는다', run:S=>{ add(S,{멘:-10, 체:-5}); salX(S,1.05); return '조회수는 지켰다. 대신 웃는 얼굴이 점점 어색해졌다.'; }}]},
 // 배우·모델
 {id:'ac_audition', a:[20,55], if:S=>jobIs('배우·모델')(S) && !S.titles.has('주연 배우'), w:3, t:'드라마 주연 오디션 최종 3인에 올랐다. 감독이 즉흥 연기를 시킨다.', c:[
  {l:'대본을 버리고 내 식대로', run:S=>{ const p=.25+ability(S,'말솜씨')/300+ability(S,'외모')/400; if(R()<p){ salX(S,3); add(S,{행:12, hon:5}); S.titles.add('주연 배우'); hl(S,`${S.age}세, 드라마 주연을 따냈다`); return '합격! 첫 촬영 날 대기실 문에 내 이름이 붙어 있었다.'; } add(S,{멘:-6}); return '“신선했어요. 이번엔 아니지만.” 또 떨어졌다.'; }},
  {l:'연습한 대로 정확하게', run:S=>{ if(R()<.25){ salX(S,2); add(S,{행:8}); return '조연이지만 비중 있는 역할을 받았다.'; } add(S,{멘:-4}); return '무난했다. 무난해서 떨어졌다.'; }}]},
 {id:'ac_dry', a:[22,60], if:S=>jobIs('배우·모델')(S) && S.job.sal<6000, w:2, t:'1년째 캐스팅 연락이 없다. 통장이 바닥을 보인다.', c:[
  {l:'카페 알바를 병행한다', run:S=>{ add(S,{돈:1200, 행:-4, 체:-3}); return '앞치마를 두르고 손님을 맞았다. “혹시… 그 광고에 나온 분?”'; }},
  {l:'연기 학원 강사를 한다', run:S=>{ add(S,{돈:1800, 인:3}); salX(S,1.1); return '가르치다 보니 내 연기도 늘었다.'; }}]},
 {id:'ac_hit', a:[22,60], if:jobIs('배우·모델'), w:1.5, t:'단역으로 나온 드라마가 해외에서 대박이 났다. 내 장면이 밈이 됐다.', c:[
  {l:'예능에 나간다', run:S=>{ salX(S,2.2); add(S,{인:6, 행:6}); return '“그 짤의 주인공” 타이틀로 섭외가 쏟아졌다.'; }},
  {l:'연기로만 승부한다', run:S=>{ salX(S,1.4); add(S,{hon:3}); return '다음 작품 오디션에서 감독이 나를 알아봤다.'; }}]},
 // 웹툰 작가
 {id:'wt_rank', a:[20,60], if:jobIs('웹툰 작가'), w:3, t:'연재 중인 웹툰이 요일 1위를 찍었다. 플랫폼에서 계약 연장을 제안한다.', c:[
  {l:'고료를 올려 달라고 한다', run:S=>{ if(R()<.6){ salX(S,1.8); return '협상 성공. 어시스턴트를 두 명 뽑았다.'; } salX(S,1.1); add(S,{멘:-3}); return '“다른 작가님들과 형평성이…” 조금만 올랐다.'; }},
  {l:'드라마 판권을 노린다', run:S=>{ if(R()<.3){ add(S,{돈:8000, hon:4}); S.titles.add('드라마 원작자'); hl(S,`${S.age}세, 내 웹툰이 드라마가 됐다`); return '판권 계약! 첫 방송 날 엔딩 크레딧에 내 이름이 떴다.'; } return '여러 곳에서 연락이 왔지만 결국 무산됐다.'; }}]},
 {id:'wt_hiatus', a:[22,60], if:jobIs('웹툰 작가'), w:2, t:'마감 3년째. 손목이 시큰거리고 그림이 안 그려진다.', c:[
  {l:'휴재 공지를 낸다', run:S=>{ salX(S,.5); add(S,{체:8, 멘:8}); return '“작가님 푹 쉬고 오세요” 댓글 3천 개. 눈물이 났다.'; }},
  {l:'진통제 먹고 버틴다', run:S=>{ add(S,{체:-8, 멘:-6}); salX(S,1.05); return '마감은 지켰다. 대신 병원 다니는 게 일이 됐다.'; }}]},
 // 운동선수
 {id:'sp_fa', a:[24,36], if:jobIs('운동선수'), w:3, t:'FA 자격을 얻었다. 우리 팀과 라이벌 팀이 동시에 제안했다.', c:[
  {l:'돈 많이 주는 라이벌 팀', run:S=>{ salX(S,2.2); add(S,{인:-3, hon:2}); hl(S,`${S.age}세, FA 대박 계약`); return '대형 계약. 첫 원정 경기에서 옛 팬들이 야유했다.'; }},
  {l:'의리로 남는다', run:S=>{ salX(S,1.3); add(S,{hon:5, 행:5}); return '팬들이 “원클럽맨”이라 불러줬다.'; }}]},
 {id:'sp_injury', a:[20,36], if:jobIs('운동선수','프로게이머'), w:2, t:S=>S.job.name==='프로게이머'?'손목이 저리다. 의사가 건초염이라고 한다. 시즌이 코앞이다.':'경기 중 무릎에서 소리가 났다. 십자인대 파열.', c:[
  {l:'수술하고 1년 재활', run:S=>{ salX(S,.5); add(S,{체:-6, 멘:-6}); if(R()<.6){ return '1년 뒤 복귀전. 관중석에서 박수가 터졌다.'; } return '예전 기량이 돌아오지 않는다. 벤치에 앉는 날이 늘었다.'; }},
  {l:'주사 맞고 그냥 뛴다', run:S=>{ if(R()<.5){ salX(S,1.2); return '버텼다. 시즌 MVP 후보에 올랐다.'; } salX(S,.35); add(S,{체:-15}); hl(S,`${S.age}세, 부상 악화`); return '부상이 커졌다. 선수 생활이 끝날 수도 있다는 말을 들었다.'; }}]},
 {id:'sp_national', a:[20,34], if:S=>jobIs('운동선수')(S) && ability(S,'운동신경')>=70 && !S.titles.has('국가대표'), w:1.5, t:'국가대표 명단에 내 이름이 있다.', c:[
  {l:'태극마크를 단다', run:S=>{ add(S,{hon:8, 행:10}); salX(S,1.4); S.titles.add('국가대표'); hl(S,`${S.age}세, 국가대표 발탁`); return '애국가가 울릴 때 눈물이 났다. 부모님이 TV 앞에서 울었다.'; }}]},
 // 프로게이머
 {id:'pg_final', a:[18,28], if:S=>jobIs('프로게이머')(S) && !S.titles.has('월드 챔피언'), w:3, t:'월드 챔피언십 결승. 마지막 세트, 마지막 한타.', c:[
  {l:'과감하게 이니시', run:S=>{ if(R()<.45){ salX(S,2.5); add(S,{hon:8, 행:12}); S.titles.add('월드 챔피언'); hl(S,`${S.age}세, 월드 챔피언`); return '이겼다! 트로피에 내 닉네임이 새겨졌다.'; } add(S,{멘:-10}); return '한 박자 빨랐다. 준우승. 대기실에서 한참을 울었다.'; }},
  {l:'침착하게 받아친다', run:S=>{ if(R()<.35){ salX(S,2.2); add(S,{hon:6}); S.titles.add('월드 챔피언'); return '받아치고 역전! 해설진이 소리를 질렀다.'; } add(S,{멘:-7}); salX(S,1.2); return '준우승. 그래도 연봉 재계약은 잘 됐다.'; }}]},
 {id:'pg_patch', a:[18,28], if:jobIs('프로게이머'), w:2, t:'패치 노트에 내 주력 캐릭터가 하향됐다.', c:[
  {l:'새 캐릭터를 밤새 연습', run:S=>{ add(S,{체:-5}); if(R()<.55){ salX(S,1.3); return '새 메타에 가장 먼저 적응했다.'; } salX(S,.7); return '손에 안 익는다. 2군으로 내려갔다.'; }},
  {l:'은퇴하고 스트리머로', run:S=>{ S.job={name:'크리에이터', sal:Math.round(S.job.sal*.8), hon:2, kind:'자영', co:'개인 방송'}; add(S,{행:5}); hl(S,`${S.age}세, 은퇴 후 스트리머로`); return '첫 방송 시청자 2만 명. 프로 시절 팬들이 따라왔다.'; }}]},
 // 자영업 (사장님)
 {id:'sb_tv', a:[25,70], if:jobIs('자영업'), w:2, t:'맛집 프로그램 작가가 촬영하고 싶다고 연락했다.', c:[
  {l:'촬영한다', run:S=>{ if(R()<.6){ salX(S,2); add(S,{행:6}); hl(S,`${S.age}세, 가게가 TV에 나왔다`); return '방송 다음 날부터 줄이 섰다. 재료가 오후 2시에 떨어졌다.'; } salX(S,.9); add(S,{멘:-5}); return '편집이 이상하게 됐다. “불친절한 사장님”으로 나왔다.'; }},
  {l:'거절한다', run:S=>{ add(S,{멘:2}); return '단골들이 “여긴 우리만 알자”며 웃었다.'; }}]},
 {id:'sb_rent', a:[25,70], if:jobIs('자영업'), w:2, t:'건물주가 임대료를 40% 올리겠다고 한다.', c:[
  {l:'올려준다', run:S=>{ salX(S,.7); add(S,{멘:-6}); return '남는 게 없다. 그래도 자리 잡은 가게를 버릴 수 없었다.'; }},
  {l:'골목 안쪽으로 이전', run:S=>{ add(S,{돈:-1500}); if(R()<.5){ salX(S,1.1); return '단골들이 따라왔다. 오히려 월세가 줄었다.'; } salX(S,.6); return '손님이 반으로 줄었다.'; }}]},
 {id:'sb_second', a:[28,65], if:S=>jobIs('자영업')(S) && S.money>3000, w:1.5, t:'장사가 잘 된다. 2호점을 내자는 제안이 들어왔다.', c:[
  {l:'2호점을 낸다', run:S=>{ add(S,{돈:-4000}); if(R()<.45){ salX(S,1.9); S.titles.add('성공한 사장님'); return '2호점도 대박. 이제 직원이 열 명이다.'; } salX(S,.65); add(S,{멘:-10}); hl(S,`${S.age}세, 2호점이 망했다`); return '2호점이 1호점까지 갉아먹었다. 1년 만에 정리했다.'; }},
  {l:'지금 가게에 집중', run:S=>{ salX(S,1.05); add(S,{행:3}); return '욕심을 버리니 저녁에 아이 얼굴을 볼 수 있었다.'; }}]},
 // 배달·택배
 {id:'dl_rain', a:[19,65], if:jobIs('배달 라이더','택배 기사'), w:2, t:'폭우 경보. 오늘은 할증이 두 배다.', c:[
  {l:'나간다', run:S=>{ if(R()<.08*DEATH_MULT/2){ add(S,{체:-20, 돈:-300}); hl(S,`${S.age}세, 빗길에 미끄러졌다`); return '빗길에 미끄러졌다. 한 달을 쉬었다.'; } add(S,{돈:120, 체:-3}); return '하루에 평소 사흘 치를 벌었다. 신발 속까지 젖었다.'; }},
  {l:'오늘은 쉰다', run:S=>{ add(S,{체:3, 행:2}); return '창밖 빗소리를 들으며 라면을 끓였다.'; }}]},
 {id:'dl_fee', a:[19,65], if:jobIs('배달 라이더','택배 기사'), w:2, t:'플랫폼이 건당 수수료를 바꿨다. 같은 일을 해도 덜 받는다.', c:[
  {l:'라이더 노조 집회에 나간다', run:S=>{ add(S,{인:4}); if(R()<.4){ salX(S,1.1); return '수수료 일부가 원래대로 돌아왔다.'; } return '뉴스에 잠깐 나왔다. 바뀐 건 없었다.'; }},
  {l:'콜을 더 뛴다', run:S=>{ add(S,{체:-6}); return '하루 12시간. 수입은 겨우 맞췄다.'; }}]},
 // 의사·간호사
 {id:'md_er', a:[26,65], if:jobIs('의사','간호사'), w:2, t:'응급실 새벽 3시. 교통사고 환자 셋이 동시에 들어왔다.', c:[
  {l:'끝까지 남아 처치한다', run:S=>{ add(S,{hon:4, 체:-6, 멘:-3}); return '셋 다 살았다. 퇴근길 해가 떠 있었다. 이 맛에 버틴다.'; }},
  {l:'교대 시간에 맞춰 넘긴다', run:S=>{ add(S,{체:2}); return '인수인계를 꼼꼼히 했다. 나도 사람이다.'; }}]},
 {id:'md_open', a:[35,60], if:jobIs('의사'), w:1.5, t:'선배가 같이 개원하자고 한다. 대출 10억.', c:[
  {l:'개원한다', run:S=>{ add(S,{돈:-5000}); if(R()<.6){ salX(S,1.8); return '동네에서 “친절한 선생님”으로 소문났다.'; } salX(S,.8); add(S,{멘:-8}); return '근처에 대형 병원이 생겼다. 대출 이자가 무겁다.'; }},
  {l:'봉직의로 남는다', run:S=>{ add(S,{멘:3}); return '월급쟁이 의사. 주말이 있는 삶을 골랐다.'; }}]},
 // 교사
 {id:'tc_parent', a:[24,62], if:jobIs('교사'), w:2, t:'밤 11시, 학부모에게서 장문의 카톡이 왔다.', c:[
  {l:'정중하게 답장한다', run:S=>{ add(S,{멘:-4}); return '새벽 1시까지 답장을 고쳐 썼다.'; }},
  {l:'내일 학교에서 이야기하자고 한다', run:S=>{ if(R()<.3){ add(S,{멘:-10}); return '교육청 민원이 들어왔다. 한 달이 지옥 같았다.'; } add(S,{멘:2}); return '다음 날 만나니 생각보다 괜찮은 분이었다.'; }}]},
 {id:'tc_letter', a:[35,65], if:jobIs('교사'), w:1.5, t:'10년 전 제자가 결혼식 청첩장과 편지를 보냈다. “선생님 덕분에 버텼어요.”', c:[
  {l:'결혼식에 간다', run:S=>{ add(S,{행:10, hon:3}); return '신부 입장보다 내가 먼저 울었다.'; }}]},
 // 공무원·경찰·소방
 {id:'pb_hero', a:[24,60], if:jobIs('소방관','경찰관'), w:2, t:S=>S.job.name==='소방관'?'화재 현장. 2층에 아이가 남아 있다는 무전이 들어왔다.':'잠복 3일째. 용의자가 골목으로 들어간다.', c:[
  {l:'뛰어든다', run:S=>{ if(R()<.03*DEATH_MULT) return killNow(S, S.job.name==='소방관'?'화재 진압 중 순직':'공무 중 순직', '누군가를 지키려 했다.'); add(S,{hon:8, 체:-6}); S.titles.add('대통령 표창'); hl(S,`${S.age}세, 현장에서 사람을 구했다`); return '해냈다. 다음 달 표창장을 받았다.'; }},
  {l:'지원을 기다린다', run:S=>{ add(S,{멘:-3}); return '규정대로 했다. 다행히 지원팀이 금방 왔다.'; }}]},
 {id:'pb_minwon', a:[24,60], if:jobIs('공무원'), w:2, t:'같은 민원인이 오늘로 열두 번째 찾아왔다.', c:[
  {l:'끝까지 들어준다', run:S=>{ add(S,{멘:-4, hon:2}); return '두 시간을 들었다. 마지막에 그분이 귤을 놓고 갔다.'; }},
  {l:'팀장님께 넘긴다', run:S=>{ add(S,{멘:2}); return '팀장님이 한숨을 쉬며 일어났다.'; }}]},
 // 개발자
 {id:'dv_outage', a:[22,60], if:jobIs('개발자'), w:2, t:'새벽 4시, 서비스 장애 알림이 울린다. 내가 배포한 코드다.', c:[
  {l:'바로 롤백하고 원인 분석', run:S=>{ add(S,{체:-3, hon:2}); return '30분 만에 복구. 아침 회의에서 장애 보고서를 발표했다.'; }},
  {l:'잠결에 핫픽스', run:S=>{ if(R()<.4){ add(S,{멘:-8}); salX(S,.95); return '핫픽스가 장애를 더 키웠다. 다음 날 아무도 눈을 안 마주쳤다.'; } add(S,{행:3}); return '고쳤다. 다시 잠들었다.'; }}]},
 {id:'dv_side', a:[24,55], if:jobIs('개발자'), w:1.5, t:'주말에 만든 사이드 프로젝트 앱이 앱스토어 순위에 올랐다.', c:[
  {l:'퇴사하고 창업', run:S=>{ if(R()<.3){ S.job={name:'자영업', sal:ri(12000,40000), hon:4, kind:'자영', co:'스타트업 대표'}; S.titles.add('성공한 사장님'); hl(S,`${S.age}세, 창업 성공`); return '투자를 받았다. 이제 내가 대표다.'; } S.job=null; S.track=null; add(S,{돈:-3000, 멘:-8}); return '2년 만에 서비스를 접었다. 다시 이력서를 쓴다.'; }},
  {l:'회사 다니며 키운다', run:S=>{ add(S,{돈:600, 체:-3}); return '광고 수익으로 매달 치킨값이 들어온다.'; }}]},
 // 셰프·미용사
 {id:'cf_own', a:[28,60], if:jobIs('셰프','미용사'), w:1.5, t:S=>S.job.name==='셰프'?'단골이 “이 실력이면 네 가게 내라”며 투자하겠다고 한다.':'원장님이 은퇴하면서 가게를 넘겨주겠다고 한다.', c:[
  {l:'내 가게를 연다', run:S=>{ add(S,{돈:-2500}); S.job={name:'자영업', sal:Math.round(S.job.sal*(R()<.5?1.6:.8)), hon:2, kind:'자영', co:S.job.name==='셰프'?'내 이름 건 식당':'내 미용실'}; hl(S,`${S.age}세, 내 가게를 열었다`); return '간판에 내 이름을 걸었다.'; }},
  {l:'지금이 좋다', run:S=>{ add(S,{멘:2}); return '사장은 사장대로 힘들다. 월급이 마음 편하다.'; }}]},
];
JOB_EVENTS.forEach(e=>{ e.rep=true; EVENTS.push(e); EVMAP[e.id]=e; });
// 직업 이벤트는 몇 년 간격으로만 (같은 이벤트 4년, 큰 갈림길은 멈춰서 묻는다)
const JOB_EV_IDS=new Set(JOB_EVENTS.map(e=>e.id));
JOB_EVENTS.forEach(e=>{ const f=e.if; e.if=S=>f(S) && !(S.evLast && S.evLast[e.id]!=null && S.age-S.evLast[e.id]<8) && !(S.lastJobEv!=null && S.age-S.lastJobEv<2); MAJOR.add(e.id); });
const _rcJL2 = resolveCard;
resolveCard = function(S,d,i){ if(d.kind==='ev' && JOB_EV_IDS.has(d.id)) S.lastJobEv=S.age; return _rcJL2(S,d,i); };

// 5) 인생마다 다른 일상: 흔한 생활 이벤트 중 40%는 이번 인생에선 아예 일어나지 않는다
const EV_CORE = new Set(['marry','meet_someone','breakup','parents_care','buy_house','blind_date','divorce','job_exit','career_change','dropout_alt','first_salary','doljabi']);
Object.assign(EV_COOLDOWN, {exercise:9, health_check:8, overwork:6, friday6:6, hoesik:6, yearend_tax:8});
const _ngJL = newGame;
newGame = function(name, mode){
  const r=_ngJL(name, mode);
  S.evOff={}; EVENTS.forEach(e=>{ if(!e.manual && !EV_CORE.has(e.id) && !JOB_EVENTS.includes(e) && R()<.4) S.evOff[e.id]=1; });
  return r;
};
EVENTS.forEach(e=>{ if(e.manual || EV_CORE.has(e.id) || JOB_EVENTS.includes(e)) return; const f=e.if; e.if=S=>!(S.evOff && S.evOff[e.id]) && (!f||f(S)); });
