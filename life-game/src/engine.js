/* ===== 엔진 ===== */
const R = Math.random;
const ri = (a,b)=>a+Math.floor(R()*(b-a+1));
const pick = a=>a[Math.floor(R()*a.length)];
const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
function gauss(){ let u=1-R(), v=R(); return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v); }
function phi(z){ const t=1/(1+.2316419*Math.abs(z)); const d=.3989423*Math.exp(-z*z/2); const p=d*t*(.3193815+t*(-.3565638+t*(1.781478+t*(-1.821256+t*1.330274)))); return z>0?1-p:p; }
function wpick(items, wf){ let tot=0; const ws=items.map(it=>{const w=Math.max(0,wf(it)); tot+=w; return w;}); if(tot<=0) return null; let r=R()*tot; for(let i=0;i<items.length;i++){ r-=ws[i]; if(r<0) return items[i]; } return items[items.length-1]; }
function won(m){ m=Math.round(m); const neg=m<0; m=Math.abs(m); let s; if(m>=10000){ const e=m/10000; s=(e>=100?Math.round(e):Math.round(e*10)/10).toLocaleString('ko-KR')+'억'; } else s=m.toLocaleString('ko-KR')+'만원'; return (neg?'-':'')+s; }

const SK = {학:'학력',체:'체력',멘:'멘탈',행:'행복',인:'인맥',매:'매력'};
const HID = ['risk','par','hon','spec','eng','kid'];
var S = null;

function add(S,e){
  for(const k in e){ const v=e[k];
    if(SK[k]) S.s[k]=clamp(S.s[k]+v,0,100);
    else if(k==='돈') S.money+=v;
    else if(HID.includes(k)) S.h[k]=k==='hon'?Math.max(0,S.h[k]+v):clamp(S.h[k]+v,0,100);
    else if(k==='f') [].concat(v).forEach(x=>S.f.add(x));
    else if(k==='uf') [].concat(v).forEach(x=>S.f.delete(x));
    else if(k==='title') S.titles.add(v);
    else if(k==='hl') hl(S,v);
  }
}
function hl(S,t){ S.hlist.push({age:S.age, year:S.year, t}); }
function log(S,t,kind){ if(t) S.log.push({age:S.age, year:S.year, t, kind:kind||''}); }
function evById(id){ return {kind:'ev', id}; }
const EVMAP = {}; EVENTS.forEach(e=>EVMAP[e.id]=e);
function killNow(S,cause,text){ S.dead=true; S.cause=cause; S.deathText=text; return text; }
function tierBonus(S){ return ({S:.25,A:.15,B:.08,C:.03,D:0,E:-.03})[S.tier] ?? -.05; }
function kidsInSchool(S){ return S.kidBirth.some(b=>{const a=S.age-b; return a>=7&&a<=18;}); }
function haveKids(S,n){
  S.kids+=n; for(let i=0;i<n;i++) S.kidBirth.push(S.age+1+i*2);
  add(S,{f:['자녀결정','출산'], 행:10, 체:-4, kid:5});
  if(S.year>=2022) add(S,{돈:200*n});
  hl(S, n===1?`${S.age+1}세, 첫 아이 출산`:`아이 ${n}명의 부모가 됐다`);
  return n===1 ? '아이가 태어났다. 3.2kg. 세상에서 제일 작은 손이었다.' : '두 아이의 부모가 됐다. 집이 시끄럽고, 따뜻해졌다.';
}
function regionPrice(S){ return S.region.name.startsWith('서울') ? 100000 : S.region.name.startsWith('경기') ? 60000 : 40000; }
function buyHouse(S, yeong){
  let price;
  if(yeong){ price = Math.max(regionPrice(S), S.money*3); S.f.add('영끌'); }
  else { price = Math.round(S.money*2); }
  const loan = Math.max(0, price - S.money);
  S.house = {val:price, loan, bought:price, by:S.year};
  S.money = 0; add(S,{행:8});
  hl(S, `${S.age}세, 내 집 마련 (${won(price)})`);
  return yeong ? `대출 ${won(loan)}을 끼고 ${won(price)}짜리 집을 샀다. 등기부등본에 내 이름이 찍혔다.` : `${won(price)}짜리 작은 집을 샀다. 크진 않지만 이사 걱정은 끝났다.`;
}
function covid(S){
  const a=S.age;
  if(a>=7&&a<=18){ add(S,{학:-3, 인:-5, 행:-2}); S.titles.add('코로나 학년'); return '온라인 개학. 카메라를 끄고 잠옷 바람으로 수업을 들었다. 친구 얼굴을 1년 동안 화면으로만 봤다.'; }
  if(S.studying){ add(S,{인:-6, 행:-4}); S.titles.add('코로나 학번'); return '새내기 OT도, MT도 없었다. 동기 얼굴을 졸업 때 처음 봤다.'; }
  if(S.job&&S.job.kind==='자영'){ add(S,{돈:-2500, 멘:-12}); return '가게 매출이 70% 줄었다. 대출로 버텼다.'; }
  if(S.job&&S.job.kind==='사무'){ add(S,{행:3}); return '재택근무가 시작됐다. 회의 중에 바지를 안 입은 건 비밀이다.'; }
  if(!S.job&&a>=23&&a<=32){ add(S,{멘:-6}); return '하반기 공채가 줄줄이 취소됐다.'; }
  if(a>=65){ add(S,{체:-3, 행:-3}); return '경로당이 문을 닫았다. 하루가 길어졌다.'; }
  return '마스크 없이 외출하던 날들이 그리워졌다.';
}

/* ---------- 출생 ---------- */
const REGIONS = [
  {name:'서울 강남구', w:3, wealth:2.5, edu:1}, {name:'서울 노원구', w:5, wealth:.5}, {name:'서울 관악구', w:5, wealth:0}, {name:'서울 마포구', w:5, wealth:1},
  {name:'경기 수원시', w:7, wealth:.5}, {name:'경기 성남시 분당구', w:4, wealth:1.5}, {name:'경기 부천시', w:6, wealth:0}, {name:'경기 화성시', w:5, wealth:.5}, {name:'경기 의정부시', w:4, wealth:-.5},
  {name:'인천 남동구', w:5, wealth:-.3}, {name:'부산 해운대구', w:5, wealth:.5}, {name:'부산 사하구', w:4, wealth:-1}, {name:'대구 수성구', w:4, wealth:1}, {name:'대구 달서구', w:4, wealth:-.5},
  {name:'광주 북구', w:4, wealth:-.5}, {name:'대전 유성구', w:4, wealth:.5}, {name:'울산 남구', w:3, wealth:.8},
  {name:'충북 청주시', w:4, wealth:-.3}, {name:'전북 전주시', w:3, wealth:-.8}, {name:'경남 창원시', w:4, wealth:0}, {name:'강원 원주시', w:2, wealth:-.8},
  {name:'경북 안동시', w:2, wealth:-1.2}, {name:'전남 해남군', w:1.5, wealth:-1.8}, {name:'제주 제주시', w:2, wealth:-.3},
];
const SURN = ['김','이','박','최','정','강','조','윤','장','임','한','오','서','신','권'];
const NAMES = { M90:['지훈','성민','현우','동현','준호','민수','상현','재민'], M00:['민준','현우','지훈','준서','도윤','건우','승민','지호'],
                F90:['지은','수진','유진','민지','지현','혜진','은지','소영'], F00:['서연','민서','지민','서현','수빈','하은','예은','지우'] };
function randName(g,y){ return pick(SURN)+pick(NAMES[g+(y<2000?'90':'00')]); }

function newGame(name, mode){
  const birthYear = ri(1990,2010);
  const gender = R()<.512?'M':'F';
  const region = wpick(REGIONS, r=>r.w);
  let wealth = clamp(Math.round(5.5 + region.wealth + gauss()*2.1),1,10);
  const rich = R()<.001; if(rich) wealth=11;
  const fr=R(); const family = fr<.4?'화목':fr<.85?'보통':'갈등';
  const sr=R(); const siblings = sr<.3?0:sr<.82?1:2;
  const impulsive = R(), talent = clamp(.85+R()*.3+(wealth>=8?.04:0),.8,1.25), luck=R();
  const st = {학:clamp(22+wealth*2+ri(-6,8),5,60), 체:ri(45,70), 멘:ri(50,65)+(family==='화목'?5:family==='갈등'?-8:0), 행:ri(55,70)+(family==='갈등'?-8:0), 인:ri(35,50), 매:ri(30,60)};
  S = { name: name||randName(gender,birthYear), gender, birthYear, year:birthYear, age:0, region, wealth, wealth0:wealth, rich, family, siblings, impulsive, talent, luck,
    s:st, money:0, h:{risk: Math.round((family==='갈등'?15:family==='보통'?5:0)+impulsive*15+(wealth<=2?5:0)), par:family==='화목'?70:family==='보통'?55:35, hon:0, spec:0, eng:wealth>=8?10:0, kid:50},
    f:new Set(), titles:new Set(), seen:new Set(), hlist:[], log:[], queue:[],
    job:null, track:null, attempts:0, studying:false, studyLeft:0, major:null, tier:null, retry:0, suneungAge:18,
    armyLeft:0, kids:0, kidBirth:[], house:null, retired:false, pension:0, parentDeathAge: ri(48,66),
    dead:false, cause:null, happySum:0, happyN:0, turn:0, mode:mode||'normal' };
  S.f.add('생존');
  S.queue.push({kind:'ms', name:'birth'});
  S.queue.push(...pickRegular(S, nEvents(S)));
  hl(S, `${birthYear}년, ${region.name}에서 태어났다`);
  return S;
}

/* ---------- 해마다 ---------- */
const CAUSES = [[15,['소아암','불의의 사고']],[35,['교통사고','불의의 사고','급성 심장마비']],[60,['암','심근경색','뇌출혈','교통사고']],[80,['암','심장 질환','뇌졸중','폐렴']],[999,['노환','폐렴','심장 질환']]];
function baseQ(a){ if(a<=1) return .0025; if(a<15) return .0001; return .00003*Math.exp(.095*a); }

function yearTick(S, ms){
  S.age++; S.year=S.birthYear+S.age;
  S.happySum+=S.s.행; S.happyN++;
  // 노화 · 회귀
  if(S.age>=40) add(S,{체:-1}); if(S.age>=65) add(S,{체:-1.5});
  S.s.멘 += (52-S.s.멘)*.07; S.s.행 += (50-S.s.행)*.09;
  // 비행 감소 (청소년기 한정형 vs 생애지속형)
  if(S.age>=19){ const persist = S.f.has('비행또래') && S.family==='갈등' && (S.f.has('가출')||S.f.has('보호관찰')); S.h.risk *= persist?.96:.86; }
  // 군 복무
  if(S.armyLeft>0){ S.armyLeft--; if(S.armyLeft===0){ S.f.add('군필'); S.f.delete('복무중'); ms.push({kind:'ms', name:'discharge'}); } }
  else if(S.studying){ S.studyLeft--; if(S.studyLeft<=0){ S.studying=false; S.f.add('졸업'); ms.push({kind:'ms', name:'grad'}); } }
  // 돈
  if(S.job){ S.money += S.job.sal*.13; S.job.sal*=(typeof salGrowth==='function'? salGrowth(S) : (S.age<55?1.03:1)); S.h.hon += (S.job.hon||0)*.12; }
  else if(S.retired){ S.money += (S.age>=65?S.pension:S.pension*.5) - (S.money<0?1000:1600); }
  else if(S.age>=24 && !S.studying && S.armyLeft===0){ S.money -= S.wealth>=8?150:500; }
  S.kidBirth.forEach(b=>{ const a=S.age-b; if(a>=0&&a<22) S.money-=800; });
  if(S.house){ S.house.val *= 1+(S.year>=2017&&S.year<=2021?.07:S.year===2022||S.year===2023?-.06:.01)+gauss()*.02; if(S.house.loan>0){ const pay=Math.min(S.house.loan,1800); S.house.loan-=pay; S.money-=pay+S.house.loan*.035; } }
  if(S.money>0) S.money*=1.005;
  // 퇴직
  if(S.job){ const lim = (S.job.kind==='선수'?36 : S.job.kind==='자영'?70 : S.job.kind==='공공'?62 : 60) + (S.f.has('정년연장')?5:0); if(S.age>=lim) ms.push({kind:'ms', name:'retire'}); }
  // 부모님
  if(!S.f.has('부모별세') && S.age>=S.parentDeathAge){ S.f.add('부모별세'); ms.push({kind:'ms', name:'parents'}); }
  // 사망 판정
  let q = baseQ(S.age) * clamp(1+(50-S.s.체)/40,.6,2.8) * DEATH_MULT;
  if(S.f.has('지병')) q*=1.8;
  let extra=null;
  if(S.f.has('오토바이') && S.age<60 && R()<.0025*DEATH_MULT) extra=['오토바이 사고','빗길 교차로였다.'];
  if(S.f.has('과로') && S.age>=35 && S.s.체<30 && R()<.004*DEATH_MULT) extra=['과로사','책상 위에 결재 서류가 쌓여 있었다.'];
  if(extra){ killNow(S,extra[0],extra[1]); return; }
  if(R()<q){ const list=CAUSES.find(c=>S.age<c[0])[1]; killNow(S,pick(list),''); }
}

/* ---------- 턴 진행 ---------- */
function nEvents(S){ const a=S.age; if(S.mode==='short') return 1; if(S.mode==='long') return a<=45?(a<=25&&R()<.4?3:2):1; return a<=30?2:1; }
function pickRegular(S,n){
  const a=S.age, out=[];
  let pool = EVENTS.filter(e=>!e.manual && a>=e.a[0] && a<=e.a[1] && (e.rep||!S.seen.has(e.id)) && (!e.if||e.if(S)) && (S.armyLeft>0 ? e.tag==='army' : e.tag!=='army'));
  for(let i=0;i<n;i++){ const ev=wpick(pool, e=>typeof e.w==='function'?e.w(S):(e.w??1)); if(!ev) break; out.push({kind:'ev', id:ev.id}); pool=pool.filter(e=>e!==ev); }
  return out;
}
function advance(S){
  S.turn++;
  const step = S.mode==='short' ? (S.age<25?1:S.age<60?2:3) : S.mode==='long' ? 1 : (S.age<65?1:2);
  const ms=[], news=[];
  for(let i=0;i<step;i++){
    yearTick(S, ms);
    if(S.dead){ S.queue=[{kind:'death'}]; return; }
    NEWS.forEach((n,idx)=>{ if(n.y===S.year && S.age>=n.a[0] && S.age<=n.a[1] && (!n.if||n.if(S))) news.push(idx); });
  }
  const q=[];
  q.push(...ms);
  news.sort((a,b)=>(NEWS[b].c?1:0)-(NEWS[a].c?1:0)).slice(0,2).sort((a,b)=>a-b).forEach(idx=>q.push({kind:'news', idx}));
  // 나이별 고정 단계
  const a=S.age;
  if(a===7) q.push({kind:'info', title:'초등학교 입학', text:`${S.year}년 3월. 몸보다 큰 책가방을 메고 ${S.region.name.split(' ')[1]||''} 어느 초등학교에 입학했다.`});
  if(a===13) q.push({kind:'info', title:'중학교 입학', text:'교복이 두 치수 크다. 엄마는 “금방 큰다”고 했다.'});
  if(a===15) q.push({kind:'ms', name:'highschool'});
  if(a===S.suneungAge && a>=18 && a<=22 && !S.studying && !S.job && (!S.f.has('자퇴')||S.f.has('검정고시')) && !S.f.has('수능포기')) q.push({kind:'ms', name:'suneung'});
  if(S.gender==='M' && !S.f.has('군필') && !S.f.has('면제') && S.armyLeft===0 && a>=20 && a<=28 && (a>=21 || S.studying || S.f.has('졸업') || S.job || S.track)) q.push({kind:'ms', name:'army'});
  if(S.armyLeft===0 && !S.job && !S.studying && !S.retired && a>=19 && a<=60 && (a>S.suneungAge || S.f.has('수능포기'))){
    if(!S.track) q.push({kind:'ms', name:'track'}); else q.push({kind:'ms', name:'hunt'});
  }
  // 일반 이벤트
  q.push(...pickRegular(S, nEvents(S)));
  if(!q.length) q.push({kind:'info', title:'평범한 한 해', text:pick(['특별한 일 없이 한 해가 지나갔다.','그럭저럭 무난한 해였다.','달력이 금방 넘어갔다.'])});
  S.queue.push(...q);
}

/* ---------- 고정 단계(마일스톤) ---------- */
function birthEra(y){ if(y<=1992) return '거리에는 서태지와 아이들 노래가 흘러나왔다.'; if(y<=1996) return '아빠는 삐삐를 차고 다녔고, 집에는 비디오테이프가 쌓여 있었다.'; if(y<=1998) return '나라 경제가 흔들리던 해였다. 어른들 얼굴에 그늘이 졌다.'; if(y<=2001) return '새천년이 열렸다. 집에 처음으로 인터넷이 들어왔다.'; if(y<=2004) return '온 나라가 월드컵의 여운에 젖어 있었다.'; if(y<=2007) return '엄마는 싸이월드에 내 사진을 매일 올렸다.'; return '아빠는 첫 스마트폰으로 내 사진을 수백 장 찍었다.'; }
const TIERNAME = {S:'최상위권 대학 (가칭 서울 S대)', A:'상위권 대학', B:'인서울 대학', C:'수도권·지방거점 국립대', D:'지방 사립대', E:'전문대'};
const MS = {
 birth:{build:(S)=>({title:'출생', text:`${S.birthYear}년, ${S.region.name}의 ${S.wealth>=8?'대학병원 특실':S.wealth>=4?'동네 산부인과':'작은 병원'}에서 ${S.gender==='M'?'아들':'딸'}로 태어났다. 3.${ri(0,9)}kg.\n\n${birthEra(S.birthYear)}\n\n집안 형편: 소득 ${S.rich?'최상위 (재벌가)':S.wealth+'분위'} · 가정 분위기: ${S.family} · 형제: ${S.siblings===0?'외동':S.siblings+'명'}\n\n이름은 ${S.name}. 태어날 곳은 고를 수 없었다.`, choices:[]})},
 highschool:{build:(S)=>({title:'고등학교 진학', text:'중3 겨울. 어느 고등학교에 갈까?', choices:[
   {l:'특목고·자사고 도전', need:S=>S.s.학>=60, needT:'학력 60 이상', run:S=>{ if(R()<(S.s.학-55)/40){ add(S,{학:5, 인:3, f:'특목고'}); hl(S,'특목고 합격'); return '합격! 교복 마이에 학교 로고가 박혀 있다.'; } add(S,{멘:-6, f:'일반고'}); return '불합격. 일반고로 간다. 엄마가 더 속상해했다.'; }},
   {l:'동네 일반고', run:S=>{ add(S,{f:'일반고', 행:2}); return '중학교 친구 절반이 같은 학교다.'; }},
   {l:'특성화고 (취업반)', run:S=>{ add(S,{f:'특성화고', spec:6, 학:-3, risk:-4}); return '자격증 공부를 시작했다. 졸업하면 바로 취업할 수 있다.'; }}]})},
 suneung:{build:(S,d)=>{
   if(!d.cached){
     let cond=(S.f.has('불면')?-.35:0)+(S.s.멘<30?-.4:0)+(S.luck-.5)*.3+(S.f.has('정시')?.1:0)+(S.retry>0?.15:0);
     const z=(S.s.학*S.talent-64)/13 + gauss()*.45 + cond;
     const top=clamp((1-phi(z))*100,.05,99.9);
     const tier= top<=1.5?'S': top<=5?'A': top<=15?'B': top<=35?'C': top<=70?'D':'E';
     const cut=[4,11,23,40,60,77,89,96];
     const g=['국어','수학','영어','탐구'].map(s=>{ const p=clamp((1-phi(z+gauss()*.5))*100,.01,99.99); let k=cut.findIndex(c=>p<=c); k=k<0?9:k+1; return `${s} ${k}`; });
     d.cached=true; d.top=Math.round(top*10)/10; d.tier=tier; d.g=g;
     S.f.delete('불면');
     let note='';
     if(S.year===2017){ note='\n\n포항 지진으로 수능이 일주일 연기됐다. 버린 문제집을 다시 주워 왔다.'; S.titles.add('수능 연기 세대'); }
     if(S.year===2020){ note='\n\n코로나로 수능이 12월 3일로 미뤄졌다. 투명 칸막이 너머로 시험지를 넘겼다.'; }
     d.note=note;
     hl(S,`수능 전국 상위 ${d.top}% → ${TIERNAME[tier]}`);
   }
   const ch=[{l:'원서를 쓴다', run:S=>{ S.tier=d.tier; S.queue.unshift({kind:'ms', name:'college'}); return `${TIERNAME[d.tier]}에 지원할 수 있다.`; }}];
   if(S.retry<3 && d.tier!=='S') ch.push({l:'재수한다', run:S=>{ S.retry++; S.suneungAge=S.age+1; add(S,{멘:-12, 행:-6, 학:ri(3,9)}); if(S.retry>=3) S.titles.add('N수의 신'); return S.retry===1?'재수 학원 종합반에 등록했다. 아침 7시 셔틀버스.':`${S.retry+1}수 시작. 친구들은 벌써 군대에 갔다.`; }});
   ch.push({l:'대학 안 가고 일을 시작한다', run:S=>{ S.tier=null; S.f.add('수능포기'); return '사회로 바로 나가기로 했다.'; }});
   return {title:`${S.year+1}학년도 대학수학능력시험`, text:`${S.year}년 11월. 성적표를 받았다.\n\n${d.g.join(' · ')}등급\n전국 상위 ${d.top}%${d.note}`, choices:ch, big:`상위 ${d.top}%`};
 }},
 college:{build:(S)=>{
   const t=S.tier; const opt=[];
   const go=(major,years,label)=>({l:label, run:S=>{ S.major=major; S.studying=true; S.studyLeft=years; add(S,{f:'대학생', 행:6, risk:-6}); hl(S,`${TIERNAME[S.tier]} ${major} 입학`); return `${TIERNAME[S.tier]} ${major}에 입학했다. 과잠을 샀다.`; }});
   if(t==='S' && (S.s.학>=80||S.f.has('의대도전'))) opt.push(go('의대',6,'의대 (6년)'));
   if(t!=='E') opt.push(go('공대',4,'공대 (컴퓨터·기계)'));
   if(t==='S'||t==='A') opt.push(go('상경계',4,'경영·경제'));
   if(t==='A'||t==='B') opt.push(go('사범대',4,'교대·사범대'));
   if(t==='B'||t==='C'||t==='D') opt.push(go('간호학과',4,'간호학과'));
   if(t==='C'||t==='D') opt.push(go('인문계',4,'인문·사회'));
   if(t==='E') { opt.push(go('전문대',2,'전문대 (2년)')); }
   return {title:'대학 원서', text:`${TIERNAME[t]}. 어느 과에 지원할까?`, choices:opt.slice(0,4)};
 }},
 army:{build:(S)=>{
   if(R()<.05 && !S.f.has('신검')){ S.f.add('신검'); S.f.add('면제'); return {title:'신체검사', text:'신체검사에서 5급 판정. 병역이 면제됐다.', choices:[]}; }
   S.f.add('신검');
   const enlist=(months,label,extra)=>({l:label, ...extra, run:S=>{ S.armyLeft=months>=20?2:2; S.f.add('복무중'); add(S,{체:5, risk:-8}); hl(S,`${S.age}세, ${label} 입대`); return `${S.year}년 입대. 머리를 밀었다. 거울 속 내가 낯설다.`; }});
   const ch=[enlist(18,'육군 현역 (18개월)'), enlist(21,'공군 (21개월)',{need:S=>S.s.학>=45, needT:'학력 45 이상'})];
   ch.push({l:'카투사 지원 (추첨)', need:S=>S.h.eng>=25||S.s.학>=70, needT:'영어 실력 또는 학력 70 이상', run:S=>{ S.armyLeft=2; S.f.add('복무중'); if(R()<.15){ add(S,{eng:15, 행:5}); S.titles.add('카투사 로또'); hl(S,'카투사 당첨'); return '추첨 당첨! 주말엔 외박이 나온다.'; } add(S,{체:5}); hl(S,'육군 입대'); return '추첨 탈락. 육군으로 간다.'; }});
   if(S.f.has('특성화고')||(S.job&&S.job.kind==='현장')) ch.push({l:'산업기능요원', run:S=>{ S.f.add('군필'); if(!S.job) S.job={name:'중소기업', ...JOBS['중소기업']}; add(S,{spec:4}); return '공장에서 3년 일하며 복무를 대신했다.'; }});
   return {title:'입영 통지서', text:`${S.year}년. 병무청에서 입영 통지서가 날아왔다.`, choices:ch};
 }},
 discharge:{build:(S)=>{ add(S,{멘:5, risk:-8}); return {title:'전역', text:`${S.year}년, 전역했다. 부대 정문을 나서며 뒤를 돌아보지 않았다. 이제 예비군 1년차다.`, choices:[]}; }},
 grad:{build:(S)=>{
   if(S.major==='의대'){ if(R()<.95){ S.job={name:'의사', ...JOBS['의사'], sal:7000}; S.track='의사'; add(S,{hon:5}); hl(S,'의사 국가고시 합격'); S.titles.add('의대 갔다'); return {title:'의사 국가고시', text:'의사 면허를 땄다. 전공의 생활이 시작된다. 주 80시간.', choices:[]}; } }
   return {title:'졸업', text:`${S.year}년 2월, 졸업. 학사모를 던졌다. 이제 진짜 사회다.`, choices:[]};
 }},
 track:{build:(S)=>{
   const c=[];
   const set=(t,label,extra)=>({l:label, ...extra, run:S=>{ S.track=t; S.attempts=0; S.queue.unshift({kind:'ms', name:'hunt'}); return `${label}. 준비를 시작했다.`; }});
   if(S.f.has('졸업')) c.push(set('대기업','대기업 공채 준비'));
   c.push(set('공무원','공무원 시험 (노량진행)'));
   if(S.major==='사범대') c.push(set('교사','임용고시'));
   if(S.major==='간호학과') c.push(set('간호사','간호사 취업'));
   if(S.major==='공대' || S.f.has('코딩관심')) c.push(set('개발자','개발자 취업'));
   if(S.f.has('연습생')) c.push(set('아이돌','데뷔 준비'));
   if(S.f.has('크리에이터꿈')) c.push(set('크리에이터','유튜브 시작'));
   c.push(set('중소기업','일단 아무 데나 입사'));
   if(!S.f.has('졸업')) c.push(set('생산직','공장 생산직'));
   return {title:'진로 결정', text:'무엇을 하며 먹고살까?', choices:c.slice(0,5)};
 }},
 hunt:{build:(S,d)=>{
   if(!S.track || S.job) return {title:'구직', text:'다시 진로를 고민한다.', choices:[]};
   if(!d.cached){
     const t=S.track; S.attempts++; let p=0, job=t;
     if(typeof JOBCAT!=='undefined' && JOBCAT[t]) p=JOBCAT[t].p(S);
     else if(t==='대기업') p=.12+tierBonus(S)*1.6+S.h.spec/250+(S.f.has('인턴')?.1:0)+S.h.eng/600+ability(S,'외국어')/400-((S.year===2020||S.year===2021)?.05:0);
     else if(t==='공무원') p=.04+S.s.학/1200+S.attempts*.035;
     else if(t==='교사') p=.18+S.s.학/600;
     else if(t==='간호사') p=.9;
     else if(t==='개발자') p=.2+S.h.spec/250+(S.f.has('코딩관심')?.08:0)+tierBonus(S)+ability(S,'코딩')/150;
     else if(t==='중소기업') p=.88;
     else if(t==='생산직') p=.6;
     else if(t==='배달') p=1;
     else if(t==='아이돌') p=.06;
     else if(t==='크리에이터') p=.12+(ability(S,'말솜씨')+ability(S,'외모')-90)/250;
     else if(t==='운동선수') p=(ability(S,'운동신경')-70)/28+(ability(S,'체격')-60)/120;
     else if(t==='디자이너·예술가') p=(ability(S,'예술감각')-45)/45;
     else if(t==='배우·모델') p=(ability(S,'외모')-70)/30;
     else if(t==='셰프'||t==='기술자') p=(ability(S,'손재주')-15)/45;
     else if(t==='영업직') p=.3+ability(S,'말솜씨')/120;
     if(typeof snowHunt==='function') p+=snowHunt(S);
     d.ok = R()<clamp(p,.02,.92);
     if(d.ok){
       if(t==='아이돌'){ S.job={name:'크리에이터', sal:15000, hon:3, kind:'자영'}; S.titles.add('아이돌 데뷔'); d.txt='데뷔 성공! 음악방송 1위 앵콜 무대에서 울었다.'; }
       else if(t==='배우·모델'){ if(R()<.15){ S.job={name:'배우·모델', sal:18000, hon:3, kind:'자영'}; S.titles.add('스타 탄생'); d.txt='오디션 합격! 첫 드라마가 대박 났다. 길에서 사람들이 알아본다.'; } else { S.job={name:'배우·모델', sal:2600, hon:1, kind:'자영'}; d.txt='단역과 광고 모델로 데뷔했다. 이름은 몰라도 얼굴은 TV에 나온다.'; } }
       else if(t==='운동선수'){ S.job={name:'운동선수', ...JOBS['운동선수'], sal:Math.round(3000+ability(S,'운동신경')*50)}; S.titles.add('프로 데뷔'); d.txt=`프로 입단! 연봉 ${won(S.job.sal)}. 유니폼에 내 이름이 박혔다.`; }
       else if(t==='크리에이터'){ if(R()<.12){ S.job={name:'크리에이터', sal:20000, hon:2, kind:'자영'}; S.titles.add('유튜브 100만'); d.txt='영상 하나가 터졌다. 구독자 100만! 골드버튼이 집으로 왔다.'; } else { S.job={name:'크리에이터', sal:2600, hon:0, kind:'자영'}; d.txt='구독자 3만. 밥은 먹고 산다.'; } }
       else if(typeof JOBCAT!=='undefined' && JOBCAT[t] && JOBCAT[t].hire){ d.txt=JOBCAT[t].hire(S); }
       else { const base=JOBS[t]||JOBS['중소기업']; S.job={name:t, ...base, sal:Math.round(base.sal*(.9+R()*.2))}; d.txt=`합격! ${t}에 들어갔다. 연봉 ${won(S.job.sal)}.`; }
       hl(S,`${S.age}세, ${S.job.name} 취업`); add(S,{행:8, 멘:6, risk:-10});
       d.title='합격';
     } else {
       add(S,{멘:-6});
       d.title=`${t} 도전 ${S.attempts}년차`;
       d.txt = t==='공무원'?`불합격. 커트라인에서 ${ri(1,6)}점 모자랐다.`: t==='아이돌'?'데뷔조에서 밀렸다.':'서류 탈락 메일이 쌓였다. “귀하의 역량은 뛰어나나…”';
     }
   }
   if(d.ok) return {title:d.title, text:d.txt, choices:[]};
   const ch=[{l:'한 번 더 도전', run:S=>{ add(S,{멘:-3}); return '이번엔 될 거다.'; }}];
   if(S.track!=='중소기업') ch.push({l:'눈높이를 낮춰 중소기업', run:S=>{ S.track='중소기업'; S.queue.unshift({kind:'ms', name:'hunt'}); return '채용 공고를 다시 봤다.'; }});
   ch.push({l:'진로를 바꾼다', run:S=>{ S.track=null; return '처음부터 다시 생각하기로 했다.'; }});
   if(S.age>=35) return {title:d.title, text:d.txt+'\n\n나이 제한이 다가온다.', choices:[{l:'아는 사람 소개로 취업', run:S=>{ S.job={name:'중소기업', ...JOBS['중소기업']}; hl(S,`${S.age}세, 지인 소개로 중소기업 취업`); return '삼촌 친구 회사에 들어갔다.'; }}]};
   return {title:d.title, text:d.txt, choices:ch};
 }},
 retire:{build:(S)=>{ const j=S.job; if(!j) return {title:'은퇴 생활', text:'출근하지 않는 아침에 익숙해졌다.', choices:[]};
   if(j.kind==='선수'){ S.job={name:'코치·지도자', ...JOBS['코치·지도자']}; S.h.hon+=6; hl(S,`${S.age}세, 선수 은퇴 후 코치로`); return {title:'선수 은퇴', text:`${S.year}년, 선수 생활을 마쳤다. 은퇴식에서 팬들이 이름을 불러줬다. 이제 후배들을 가르친다.`, choices:[]}; } S.pension = j.kind==='공공'?2600 : j.sal>6000?1800 : 1200; S.h.hon+=j.hon*2; S.retired=true; S.job=null; hl(S,`${S.age}세, ${j.name} 정년퇴직`); return {title:'퇴직', text:`${S.year}년, ${j.name} 생활을 마쳤다. 송별회에서 받은 꽃다발이 무거웠다.`, choices:[]}; }},
 parents:{build:(S)=>{ const memo=(typeof parentsMemory==='function')?parentsMemory(S):''; const inh = (typeof inheritAmount==='function')? inheritAmount(S) : Math.round(S.wealth*S.wealth*220/(S.siblings+1)); add(S,{돈:inh, 멘:-12, 행:-6}); hl(S,`${S.age}세, 부모님을 떠나보냈다`); return {title:'부모님 별세', text:`${S.year}년, 부모님이 세상을 떠나셨다. 장례식장에서 처음으로 부모님 친구분들 얼굴을 봤다.${memo?'\n\n'+memo:''}\n\n상속: ${inh>0?won(inh):'없음'}${S._inhTax?` (상속세 ${won(S._inhTax)} 납부 후)`:''}`, choices:[]}; }},
};

/* ---------- 카드 만들기 · 고르기 ---------- */
function stageOf(a){ return a<7?'영유아':a<13?`초등 ${a-6}학년`:a<16?`중${a-12}`:a<19?`고${a-15}`:a<30?'청년':a<50?'장년':a<65?'중년':'노년'; }

function buildCard(S, d){
  if(d.kind==='ev'){ const ev=EVMAP[d.id]; return {kind:'ev', kicker:'생활기록', text: typeof ev.t==='function'?ev.t(S):ev.t, choices:ev.c.map(c=>({l:c.l, ok:!c.need||c.need(S), needT:c.needT}))}; }
  if(d.kind==='news'){ const n=NEWS[d.idx];
    if(!d.cached){ d.extra = n.run?n.run(S):''; if(n.e && !n.c) add(S,n.e); d.cached=true; }
    const body=[d.extra, n.t].filter(Boolean).join('\n\n');
    return {kind:'news', kicker:`${n.y}년 뉴스${n.future?' · 가상 시나리오':''}`, headline:n.h, text:body, choices:(n.c||[]).map(c=>({l:c.l, ok:!c.need||c.need(S), needT:c.needT}))}; }
  if(d.kind==='ms'){ if(d.static) return {kind:'ms', kicker:d.static.title, title:d.static.title, text:d.static.text, choices:[]};
    const m=MS[d.name].build(S,d); d._m=m; if(!m.choices.length) d.static={title:m.title, text:m.text}; return {kind:'ms', kicker:m.title, title:m.title, text:m.text, big:m.big, grid:m.grid, choices:m.choices.map(c=>({l:c.l, ok:!c.need||c.need(S), needT:c.needT}))}; }
  if(d.kind==='info') return {kind:'info', kicker:d.title, title:d.title, text:d.text, choices:[]};
  return {kind:'death', choices:[]};
}
function resolveCard(S, d, i){
  let txt='';
  if(d.kind==='ev'){ const ev=EVMAP[d.id]; S.seen.add(ev.id); const c=ev.c[i];
    if(c.e) add(S,c.e);
    if(c.o){ let r=R(); for(const o of c.o){ r-=o[0]; if(r<0||o===c.o[c.o.length-1]){ add(S,o[2]||{}); txt=o[1]; break; } } }
    else if(c.run) txt=c.run(S); else txt=c.t||'';
    log(S, txt||c.l);
  } else if(d.kind==='news'){ const n=NEWS[d.idx];
    if(i>=0 && n.c){ const c=n.c[i]; if(c.e) add(S,c.e); txt = c.run?c.run(S):(c.t||''); }
    log(S, n.h.replace(/^\[[^\]]+\]\s*/,'')+' → '+((txt||d.extra||n.t||'').split(/\.\s/)[0].replace(/\.$/,''))+'.', 'news');
  } else if(d.kind==='ms'){ const m=d.static?{...d.static, choices:[]}:(d._m||MS[d.name].build(S,d));
    if(i>=0 && m.choices[i]) txt=m.choices[i].run(S);
    log(S, (m.title?m.title+': ':'')+(txt||m.text.split('\n')[0]));
  } else if(d.kind==='info'){ log(S, d.title); }
  return txt;
}

/* ---------- 엔딩 ---------- */
function ending(S){
  const house = S.house ? S.house.val - S.house.loan : 0;
  const asset = S.money + house + (S.inv||0);
  const avgH = S.happyN? S.happySum/S.happyN : S.s.행;
  // 자녀 · 제사
  let kidsAlive = S.kids, rel=S.h.kid, attend=0, jesa, jesaT;
  if(S.kids===0){ jesa='없음'; jesaT = S.siblings>0 ? '제사를 지내줄 자손이 없다. 조카가 기일에 가끔 납골당을 찾는다.' : '기일을 기억하는 사람이 없다.'; }
  else {
    const per = 1 + (R()<.7?1:0) + (S.f.has('손주')?1.6:.6);
    attend = Math.max(1, Math.round(S.kids*per*clamp(rel/70,.2,1.3)));
    const late = S.birthYear+S.age>2060;
    if(rel>=70 && attend>=5){ jesa='정성 가득한 제사상'; jesaT=`기일마다 ${attend}명이 모여 홍동백서 4열 제사상을 차린다.${late?' 제사가 사라진 시대에 보기 드문 집안이다.':''}`; }
    else if(rel>=45){ jesa='간소한 추도식'; jesaT=`기일에 ${attend}명이 모여 사진 앞에 꽃을 두고 밥을 먹는다.`; }
    else { jesa='문자 한 통'; attend=Math.min(attend,1); jesaT='기일에 단톡방에 “오늘 아빠(엄마) 기일이네” 한 줄이 올라온다.'; }
  }
  const mourners = Math.round(S.s.인*1.6 + S.h.hon*4 + S.kids*18 + (S.job||S.retired?20:0) + ri(0,15));
  const honor = Math.round(S.h.hon);
  // 칭호
  const T=new Set(S.titles);
  if(S.age>=100) T.add('백세 인생'); if(S.age<30) T.add('너무 이른 이별');
  if(S.wealth0<=3 && (S.tier==='S'||(S.job&&['의사','변호사'].includes(S.job.name))||asset>=300000)) T.add('개천에서 용');
  if(S.rich) T.add('금수저');
  if(S.f.has('자퇴') && asset>=100000) T.add('학교 밖에서 성공');
  if(S.f.has('영끌') && S.house && S.house.val>S.house.bought*1.3) T.add('영끌 성공');
  if(S.kids>=3) T.add('다둥이');
  // 점수
  const sAsset = clamp((Math.log10(Math.max(asset,0)+1)-3)/2.7,0,1);
  const sLife = clamp((S.age-40)/50,0,1);
  const sFam = S.kids? clamp(Math.min(S.kids,3)/3*.5 + rel/100*.5,0,1) : .15;
  const sHon = clamp(honor/60,0,1);
  const sHap = avgH/100;
  const total = .3*sAsset+.15*sLife+.2*sFam+.15*sHon+.2*sHap;
  const top = clamp((1-phi((total-.45)/.13))*100,.1,99.9);
  // 엔딩 이름
  const succ = sAsset*.7+sHon*.3, hap = sHap*.7+sFam*.3;
  let title, sub;
  if(S.age<30){ title='너무 이른 이별'; sub='남은 사람들이 오래 기억했다.'; }
  else if(succ>=.45 && hap>=.42){ title='대한민국 1%의 여유'; sub='가진 것도, 곁에 있는 사람도 많았다.'; }
  else if(succ>=.45){ title='성공했지만 외로운'; sub='통장은 두둑했지만 저녁 식탁은 조용했다.'; }
  else if(hap>=.42){ title='소확행 장인'; sub='큰돈은 없었지만 잘 웃었다.'; }
  else { title='헬조선 생존자'; sub='끝까지 버텼다. 그것만으로도 대단했다.'; }
  // 유족의 한마디
  let quote;
  if(S.kids===0) quote = S.f.has('기혼')?'“당신이랑 둘이라서 좋았어.” (배우자)':'“좋은 친구였어.” (오랜 친구)';
  else if(rel>=70) quote = `“${S.gender==='M'?'아빠':'엄마'}가 해준 김치찌개가 아직 생각나요.” (자녀)`;
  else if(rel>=45) quote = `“${S.gender==='M'?'아빠':'엄마'}는 늘 바빴지만, 우리를 위해서였다는 걸 이제 알아요.” (자녀)`;
  else quote = '“솔직히… 잘 몰랐어요, 어떤 분이셨는지.” (자녀)';
  return {succ, hap, asset, house, avgH:Math.round(avgH), jesa, jesaT, attend, mourners, honor, titles:[...T], top:Math.round(top*10)/10, title, sub, quote};
}

/* ---------- 저장 ---------- */
function serialize(S){ if(!S) return null; return JSON.stringify({...S, f:[...S.f], titles:[...S.titles], seen:[...S.seen], queue:S.queue.map(d=>{const c={...d}; delete c._m; return c;})}); }
function deserialize(str){ const o=JSON.parse(str); o.f=new Set(o.f); o.titles=new Set(o.titles); o.seen=new Set(o.seen); return o; }

/* ---------- 자동 플레이 (밸런스 확인용) ---------- */
function simulate(n){
  const out={ages:[], causes:{}, tiers:{}, jobs:{}, errors:[], tops:[], titles:{}, endings:{}, kids:0, cards:[]};
  for(let k=0;k<n;k++){
    try{
      newGame(); let cards=0;
      while(!S.dead && cards<600){
        if(!S.queue.length) advance(S);
        const d=S.queue.shift(); if(d.kind==='death') break;
        const c=buildCard(S,d); cards++;
        const okIdx=c.choices.map((x,i)=>x.ok?i:-1).filter(i=>i>=0);
        resolveCard(S,d, okIdx.length?pick(okIdx):-1);
      }
      const e=ending(S);
      out.ages.push(S.age); out.causes[S.cause]=(out.causes[S.cause]||0)+1; out.tiers[S.tier||'-']=(out.tiers[S.tier||'-']||0)+1;
      const jn=(S.job&&S.job.name)||(S.retired?'은퇴':'무직'); out.jobs[jn]=(out.jobs[jn]||0)+1; out.tops.push(e.top); out.endings[e.title]=(out.endings[e.title]||0)+1; out.kids+=S.kids; out.cards.push(cards);
      e.titles.forEach(t=>out.titles[t]=(out.titles[t]||0)+1);
    }catch(err){ out.errors.push(String(err.stack||err)); }
  }
  return out;
}
