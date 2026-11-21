/* ===== 스타의 삶: 배우·크리에이터는 성공하기 어렵지만, 뜨면 인생이 바뀐다 =====
   - 연 수입 1.5억 이상이 되면 '스타'가 된다 (같은 직업 중 소수)
   - 스타는 수입 상한이 훨씬 높고, 버는 만큼 쓰고, 그래도 돈이 쌓인다
   - 슈퍼카·펜트하우스·건물주·해외 팬미팅, 그리고 열애설·불륜 스캔들·세무조사 같은 사건이 따라온다 */
const CELEB_JOBS = ['배우·모델','크리에이터'];
function isCeleb(S){ return !!S.job && CELEB_JOBS.includes(S.job.name) && S.job.sal>=15000; }
Object.assign(JOB_CAP, {'배우·모델':300000, '크리에이터':200000});

// 스타가 되는 순간
const _mtCel = monthTick;
monthTick = function(S){
  _mtCel(S);
  if(isCeleb(S) && !S.f.has('스타')){ S.f.add('스타'); S.titles.add('스타'); add(S,{행:10, 인:10, 매:8, hon:6});
    hl(S, `${S.age}세, ${S.job.name==='크리에이터'?'구독자 100만, 이름만 대면 아는 크리에이터':'광고판에 얼굴이 걸리는 스타'}가 됐다`);
    S.queue.push({kind:'info', title:'스타의 삶이 시작됐다', text:'길을 걸으면 사람들이 휴대폰을 든다. 통장에 찍히는 숫자의 자릿수가 바뀌었다. 대신 사생활은 사라졌다.'}); }
};
// 스타의 돈: 많이 벌고, 많이 쓰고, 그래도 쌓인다 · 건물 임대료
const _ytCel = yearTick;
yearTick = function(S,ms){
  _ytCel(S,ms);
  if(isCeleb(S)){ const inc=S.lastYearInc||S.job.sal; S.money += inc*.45; S.money -= Math.min(inc*.15, 50000); }
  if(S.bldg){ S.bldg*=1+(.03+gauss()*.04); S.money += S.bldg*.025; }
};

const celEv = (id,a,cond,w,t,c)=>({id,a,if:S=>isCeleb(S)&&cond(S),w,t,c});
const CELEB_EVENTS = [
 celEv('cel_car',[20,65],S=>!S.f.has('슈퍼카'),3,'매니저가 슈퍼카 카탈로그를 내밀었다. “이제 이 정도는 타셔야죠.”',[
  {l:'4억짜리 이탈리아 차를 뽑는다', run:S=>{ add(S,{돈:-40000, 행:8, 매:5}); S.f.add('슈퍼카'); S.titles.add('슈퍼카 오너'); return '엔진 소리에 심장이 뛰었다. 다음 날 기사가 났다. “○○○, 4억 슈퍼카 플렉스”'; }},
  {l:'그냥 국산 세단', run:S=>{ add(S,{hon:2}); return '“검소한 스타” 기사가 났다. 광고 문의가 늘었다.'; }}]),
 celEv('cel_penthouse',[22,70],S=>S.money>150000 && !S.f.has('펜트하우스'),3,'한강이 내려다보이는 펜트하우스 매물. 50억.',[
  {l:'산다', run:S=>{ const v=500000, cash=Math.min(S.money,250000); add(S,{돈:-cash, 행:8}); S.house={val:v, loan:v-cash, bought:v, by:S.year}; S.f.add('펜트하우스'); S.titles.add('한강뷰 펜트하우스'); hl(S,`${S.age}세, 한강뷰 펜트하우스 입주`); return '거실 통유리 너머로 불꽃놀이가 보였다. 예능에서 집 공개 요청이 쏟아졌다.'; }},
  {l:'아직은 이르다', run:S=>{ add(S,{멘:2}); return '돈은 언제든 사라질 수 있다. 선배의 말을 떠올렸다.'; }}]),
 celEv('cel_building',[25,75],S=>S.money>300000 && !S.bldg,3,'부동산 컨설턴트가 연락했다. 성수동 꼬마빌딩, 30억.',[
  {l:'건물주가 된다', run:S=>{ add(S,{돈:-300000, 행:6}); S.bldg=300000; S.titles.add('건물주'); hl(S,`${S.age}세, 건물주가 됐다`); return '등기부등본에 내 이름이 찍혔다. 매달 월세가 들어온다.'; }},
  {l:'주식으로 굴린다', run:S=>{ S.inv=(S.inv||0)+150000; add(S,{돈:-150000}); return '증권사 VIP 라운지에 초대받았다.'; }}]),
 celEv('cel_affair',[25,65],S=>S.f.has('기혼') && !S.f.has('이혼'),2.5,S=>`${S.job.name==='크리에이터'?'합방 촬영':'드라마 촬영'}이 끝난 밤. 상대에게서 “한 잔 더 할래요?” 메시지가 왔다. 묘한 기류가 흐른다.`,[
  {l:'선을 넘는다', run:S=>{ if(R()<.55){ add(S,{행:4, 멘:-10}); S.f.add('비밀'); return '아무도 모른다. 아직은. 휴대폰 잠금 비밀번호를 바꿨다.'; }
    const pen=Math.round((S.lastYearInc||S.job.sal)*1.2); add(S,{돈:-pen, hon:-15, 행:-15, 멘:-20, 인:-10}); salX(S,.25); S.f.add('이혼'); S.f.delete('기혼'); S.titles.add('불륜 스캔들');
    hl(S,`${S.age}세, 불륜 스캔들로 모든 걸 잃었다`); return `새벽 6시, 연예 매체 단독 기사가 떴다. 사진 열두 장. 광고 위약금 ${won(pen)}. 배우자는 짐을 쌌다.`; }},
  {l:'정중하게 거절한다', run:S=>{ add(S,{hon:2, 행:2}); return '“다음에 단체로 봐요.” 집에 와서 배우자 얼굴을 오래 봤다.'; }}]),
 celEv('cel_secret',[26,70],S=>S.f.has('비밀') && !S.f.has('이혼'),3,'모르는 번호로 사진이 왔다. “얼마면 조용히 해드릴까요?”',[
  {l:'돈을 준다', run:S=>{ add(S,{돈:-30000, 멘:-15}); S.f.delete('비밀'); return '3억을 보냈다. 그날 밤 잠을 한숨도 못 잤다.'; }},
  {l:'먼저 공개하고 사과한다', run:S=>{ salX(S,.4); add(S,{hon:-10, 행:-12}); S.f.delete('비밀'); S.f.add('이혼'); S.f.delete('기혼'); S.titles.add('불륜 스캔들'); return '고개를 숙였다. 배우자는 말없이 도장을 찍었다.'; }}]),
 celEv('cel_dating',[20,50],S=>!S.f.has('기혼'),2.5,'디스패치가 열애설을 터뜨렸다. 같은 업계의 그 사람이다.',[
  {l:'“예쁘게 만나고 있습니다”', run:S=>{ if(R()<.6){ salX(S,1.15); add(S,{행:8}); return '팬들이 축하해줬다. 커플 화보 제안까지 들어왔다.'; } salX(S,.75); add(S,{멘:-8}); return '일부 팬덤이 등을 돌렸다. 앨범 판매량이 반 토막.'; }},
  {l:'“친한 동료일 뿐”', run:S=>{ add(S,{멘:-4}); return '석 달 뒤 둘이 같은 공항 사진에 찍혔다.'; }}]),
 celEv('cel_tax',[25,70],S=>true,1.5,'국세청 조사4국에서 세무조사를 나왔다. 가족 명의 법인이 문제라고 한다.',[
  {l:'추징금을 내고 사과문', run:S=>{ const p=Math.round((S.lastYearInc||S.job.sal)*.6); add(S,{돈:-p, hon:-5}); salX(S,.85); return `추징금 ${won(p)}. “세무 지식이 부족했다”는 사과문을 올렸다.`; }},
  {l:'행정소송으로 버틴다', run:S=>{ if(R()<.4){ add(S,{hon:2}); return '3년 소송 끝에 이겼다.'; } const p=Math.round((S.lastYearInc||S.job.sal)*1.1); add(S,{돈:-p, hon:-10}); salX(S,.6); return `패소. 가산세까지 ${won(p)}. 이미지가 크게 깎였다.`; }}]),
 celEv('cel_tour',[20,60],S=>true,2,'해외 팬미팅 투어 제안. 도쿄·방콕·LA 10개 도시.',[
  {l:'간다', run:S=>{ salX(S,1.35); add(S,{체:-6, 행:6, 인:5}); return '공항마다 플래카드가 걸려 있었다. 시차 때문에 몸이 남아나지 않았다.'; }},
  {l:'쉬고 싶다', run:S=>{ add(S,{체:5, 멘:6}); return '제주도에서 한 달을 숨어 지냈다.'; }}]),
 celEv('cel_mgmt',[24,60],S=>S.job.name==='배우·모델',2,'소속사 정산서가 이상하다. 10년 동안 받은 게 생각보다 적다.',[
  {l:'1인 기획사로 독립', run:S=>{ if(R()<.55){ salX(S,1.6); add(S,{행:5}); return '독립 첫해, 수입이 두 배 가까이 됐다.'; } salX(S,.6); add(S,{멘:-8}); return '소속사가 소송을 걸었다. 2년 동안 작품을 못 했다.'; }},
  {l:'재계약한다', run:S=>{ add(S,{멘:-3}); salX(S,1.1); return '조금 더 받는 조건으로 도장을 찍었다.'; }}]),
 celEv('cel_lux',[20,70],S=>true,2,'명품 브랜드에서 앰버서더 제안이 왔다. 파리 패션위크 초대장도 함께.',[
  {l:'파리로 간다', run:S=>{ add(S,{돈:20000, 매:6, 행:6}); S.titles.add('명품 앰버서더'); return '레드카펫 사진이 전 세계 SNS에 퍼졌다. 계약금 2억.'; }},
  {l:'거절한다', run:S=>{ return '나는 운동화가 편하다.'; }}]),
 celEv('cel_fall',[30,75],S=>true,1.5,'요즘 섭외가 뚝 끊겼다. 새로 뜬 후배들이 내 자리를 채운다.',[
  {l:'예능으로 이미지 변신', run:S=>{ if(R()<.5){ salX(S,1.3); return '“알고 보니 웃긴 사람” 이미지로 제2의 전성기가 왔다.'; } salX(S,.6); return '어색했다. 시청률도 낮았다.'; }},
  {l:'조용히 물러난다', run:S=>{ salX(S,.5); add(S,{멘:6, 행:3}); return '큰 집을 정리하고 시골로 내려갔다. 마당에 토마토를 심었다.'; }}]),
];
const CEL_CD={cel_tour:5, cel_dating:6, cel_affair:8, cel_tax:15};
CELEB_EVENTS.forEach(e=>{ e.rep=true; EVENTS.push(e); EVMAP[e.id]=e; JOB_EVENTS.push(e); JOB_EV_IDS.add(e.id); MAJOR.add(e.id);
  const f=e.if; e.if=S=>f(S) && !(S.evLast && S.evLast[e.id]!=null && S.age-S.evLast[e.id]<(CEL_CD[e.id]??99)) && !(S.lastJobEv!=null && S.age-S.lastJobEv<1); });
