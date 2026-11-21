/* ===== 키 · 몸무게 · 현실 연봉 · 주식 시장 · 미래 확률 사건 · 사회 인식 점수 ===== */
DATA_SRC.push(
  ['키', '성인 평균 남 약 173~174cm · 여 약 160~161cm (20대 초반 남 174.2, 여 160.9)', '사이즈코리아·국가기술표준원 인체치수조사 인용'],
  ['비만', '성인 비만(BMI 25↑) 37.2% · 남 45.6% · 여 27.8% (2023)', '국민건강영양조사 (국가지표체계)'],
  ['초봉', '300인 이상 대졸 정규직 초임 5,001만원 · 전체 평균 3,675만원 (2023)', '한국경영자총협회 분석'],
  ['근로자 소득', '월평균 363만원 · 대기업 593만원 · 중소기업 298만원 (2023)', '통계청 임금근로일자리 소득 인용'],
  ['자산 순위', '가구 순자산 평균 4.5억 · 상위 10% 약 10억 · 상위 1% 33억 · 상위 0.1% 86.7억 (2024)', '통계청 가계금융복지조사 · NH투자증권 100세시대연구소'],
  ['주가', '코스피 연도별 수익률(근사) · 2025년 +75.6% (4,214.17 마감)', '한국거래소 종가 인용 보도'],
  ['인생 가치관', '한국인이 꼽은 삶의 의미 1위 물질적 풍요 19% · 건강 17% · 가족 16% (17개국 중 유일하게 물질 1위)', 'Pew Research Center 2021'],
);

/* --- 1) 현실 연봉: 초봉 조정 + 직종별 실질 상승률 --- */
Object.assign(JOBS['대기업'],{sal:5000}); Object.assign(JOBS['중견기업'],{sal:3600}); Object.assign(JOBS['중소기업'],{sal:2900});
Object.assign(JOBS['생산직'],{sal:3300}); Object.assign(JOBS['공무원'],{sal:2900}); Object.assign(JOBS['교사'],{sal:3300});
Object.assign(JOBS['간호사'],{sal:3700}); Object.assign(JOBS['개발자'],{sal:4200}); Object.assign(JOBS['배달 라이더'],{sal:2800}); Object.assign(JOBS['알바'],{sal:1600});
function salGrowth(S){
  const j=S.job, a=S.age; if(!j) return 1;
  if(a>=50) return j.kind==='현장'? .99 : 1;
  const g = j.name==='대기업'?.03 : j.kind==='공공'?.023 : j.kind==='전문'?.025 : j.kind==='사무'?.015 : j.kind==='현장'?.01 : 0;
  return 1+g;
}

/* --- 2) 키 · 몸무게 --- */
const GROW = {M:[.29,.44,.5,.555,.59,.63,.67,.705,.735,.765,.795,.83,.87,.915,.955,.98,.99,.997,1], F:[.31,.47,.54,.6,.64,.68,.72,.76,.795,.83,.87,.91,.95,.975,.99,.997,1]};
function adultHeight(S){ return S.htBase + clamp(S.htAdj||0,-4,4); }
function heightNow(S){ const g=GROW[S.gender]; const a=S.age; const f=a<g.length? g[Math.max(0,a)] : 1; return adultHeight(S)*f - (a>60? (a-60)*.12 : 0); }
function baseBMI(S){ const a=S.age, m=S.gender==='M';
  if(a<2) return 17; if(a<6) return 15.8; if(a<10) return 16.6+(a-6)*.35; if(a<19) return 18+(a-10)*.5;
  return m? 22.9 + Math.min(1.7,(a-19)*.08) - (a>65?(a-65)*.05:0) : 21.3 + Math.min(2.2,Math.max(0,a-28)*.1); }
const _ng6 = newGame;
newGame = function(n,m){
  const r=_ng6(n,m);
  const zG = (((S.tal&&S.tal.체격)??50)-50)/13, z = .5*zG + .87*gauss();
  S.htBase = (S.gender==='M'?172.9:159.6) + z*(S.gender==='M'?5.8:5.3) + (S.wealth-5.5)*.25;
  S.htAdj = 0; S.bmi = baseBMI(S) + gauss()*.6; S.bmiNoise = gauss()*2.3;
  return r;
};
function bmiTarget(S){
  const A=S.alloc||{}, p=k=>A[k]||0, sc=10/Math.max(6,ptTotal(S));
  let t = baseBMI(S) + S.bmiNoise;
  if(S.age>=7){ t += -p('exercise')*sc*.45 + p('fun')*sc*.08 + (S.s.멘<35?.8:0) + (S.f.has('과로')?.9:0) + (S.job&&S.job.kind==='사무'?.4:0) + (S.f.has('흡연')?-.3:0); }
  if(S.gender==='F' && S.wealth<=3 && S.age>=30) t+=.6;   // 여성 비만율은 저소득층에서 높다
  return clamp(t,15,38);
}
function bmiWord(b,a){ if(a<19) return b<15.5?'마른 편':b>23?'통통한 편':'보통'; return b<18.5?'저체중':b<23?'정상':b<25?'비만 전단계':b<30?'비만':'고도비만'; }
const _mt8 = monthTick;
monthTick = function(S){
  _mt8(S);
  if(S.htBase==null) return;
  const A=S.alloc||{};
  if(S.age<18){ S.htAdj += (((A.rest||0)-2)*.06 + ((A.exercise||0)-1)*.05 + (S.wealth-5.5)*.01 - (S.f.has('흡연')?.08:0))/12; }
  const tg=bmiTarget(S); S.bmi += (tg-S.bmi)*.05 + gauss()*.06;
  // 외모 · 건강에 주는 영향
  if(S.age>=15){ const d=Math.abs(S.bmi-21.5); S.s.매 += (-Math.max(0,d-2)*.02); if(S.gender==='M') S.s.매 += (heightNow(S)-173)*.0015; }
};
function weightNow(S){ const h=heightNow(S)/100; return S.bmi*h*h; }
// 체중이 사망 위험에 영향
const _yt3 = yearTick;
yearTick = function(S,ms){ const b=S.bmi||22; if(S.age>=30){ if(b>=30) S.s.체-=1.2; else if(b>=25) S.s.체-=.4; else if(b<18.5) S.s.체-=.5; } _yt3(S,ms); };

/* --- 3) 주식 시장 (코스피 근사) --- */
const KOSPI = {1990:-23.5,1991:-12.2,1992:11,1993:27.7,1994:18.6,1995:-14.1,1996:-26.2,1997:-42.2,1998:49.5,1999:82.8,2000:-50.9,2001:37.5,2002:-9.5,2003:29.2,2004:10.5,2005:54,2006:4,2007:32.3,2008:-40.7,2009:49.7,2010:21.9,2011:-11,2012:9.4,2013:.7,2014:-4.8,2015:2.4,2016:3.3,2017:21.8,2018:-17.3,2019:7.7,2020:30.8,2021:3.6,2022:-24.9,2023:18.7,2024:-9.6,2025:75.6};
function mktYear(S,y){ S.mkt=S.mkt||{}; if(S.mkt[y]==null){ S.mkt[y] = KOSPI[y]!=null? KOSPI[y] : clamp(3+gauss()*18,-45,60); if(S.shockStock&&S.shockStock[y]) S.mkt[y]+=S.shockStock[y]; } return S.mkt[y]; }
function kospiLevel(S){ let L=2399.49; if(S.year>=2025){ for(let y=2025;y<S.year;y++) L*=1+mktYear(S,y)/100; } else { for(let y=2024;y>=S.year;y--) L/=1+(KOSPI[y]||0)/100; } return L; }
const INV_STYLE = {예금:'예금 (연 2.5%, 안전)', 주식:'주식 (코스피 따라감)', 코인:'코인 (대박 아니면 쪽박)'};
const _mt9 = monthTick;
monthTick = function(S){
  const before=S.inv||0;
  _mt9(S);
  if(!(S.inv>0)) return;
  // talent.js의 기본 복리를 되돌리고, 고른 투자 방식대로 굴린다
  const style=S.invStyle||'주식', sk=ability(S,'재테크');
  const base=S.inv; const raw = base;  // 이번 달 적립분 포함
  let r;
  if(style==='예금') r=.025/12;
  else if(style==='코인') r=(gauss()*.28)/Math.sqrt(12) + (R()<.002? 1.2: 0) - (R()<.004? .6:0);
  else r=(mktYear(S,S.year)/100)/12 + gauss()*.02 + sk/20000;
  S.inv = Math.max(0, raw*(1+r));
  S.invGain=(S.invGain||0)+(S.inv-raw);
};

/* --- 4) 미래 확률 사건 (2026년 이후) --- */
const WORLD = [
  {k:'bank', p:.025, h:'[가상] 글로벌 은행 연쇄 파산 · 금융위기', fx:S=>{ S.shockStock=S.shockStock||{}; S.shockStock[S.year]=(S.shockStock[S.year]||0)-35; if(S.house) S.house.val*=.85; let t='주가가 반 토막 나고 집값도 흔들린다.'; if(S.job&&S.job.kind!=='공공'&&R()<.15){ S.job=null; S.track=null; add(S,{멘:-10}); t+=' 회사가 문을 닫아 일자리를 잃었다.'; } else add(S,{멘:-4}); return t; }},
  {k:'estate', p:.02, h:'[가상] 부동산 대폭락', fx:S=>{ if(S.house){ const l=S.house.val*.25; S.house.val-=l; add(S,{멘:-8}); return `집값이 25% 떨어졌다. 내 집도 ${won(l)} 내려앉았다.`; } add(S,{행:2}); return '집 없는 나는 오히려 기회가 생겼다는 생각이 들었다.'; }},
  {k:'pandemic', p:.015, h:'[가상] 신종 감염병 대유행', fx:S=>covid(S)},
  {k:'quake', p:.005, h:'[가상] 규모 6.8 대지진', fx:S=>{ if(R()<.05){ add(S,{체:-15, 돈:-500}); return '건물이 무너졌다. 다리를 크게 다쳤다.'; } if(S.house) S.house.val*=.95; add(S,{멘:-5}); return '밤새 땅이 흔들렸다. 다행히 가족은 무사했다.'; }},
  {k:'volcano_sign', p:.003, h:'[가상] 백두산 분화 징조 · 화산성 지진 증가', fx:S=>{ S.volcano=S.year; add(S,{멘:-3}); return '뉴스마다 백두산 이야기다. 대피 가방을 싸두었다.'; }},
  {k:'volcano', p:0, h:'[가상] 백두산 분화 · 화산재로 하늘길 마비', fx:S=>{ S.shockStock=S.shockStock||{}; S.shockStock[S.year]=(S.shockStock[S.year]||0)-12; add(S,{체:-4, 멘:-6}); return '하늘이 잿빛이 됐다. 마스크를 쓰고 출근했고, 비행기는 한 달 동안 뜨지 않았다.'; }},
  {k:'tension', p:.03, h:'[가상] 남북 긴장 고조 · 군사 도발', fx:S=>{ S.shockStock=S.shockStock||{}; S.shockStock[S.year]=(S.shockStock[S.year]||0)-6; add(S,{멘:-2}); return '하루 종일 속보가 떴다. 며칠 뒤 잠잠해졌다.'; }},
  {k:'war', p:.0003, h:'[가상] 한반도 전쟁 발발', fx:S=>{ S.shockStock=S.shockStock||{}; S.shockStock[S.year]=(S.shockStock[S.year]||0)-45; if(S.house) S.house.val*=.6; add(S,{멘:-25, 행:-20, 체:-8}); hl(S,`${S.age}세, 전쟁을 겪었다`); S.titles.add('전쟁을 겪은 세대'); if(R()<.03*DEATH_MULT) return killNow(S,'전쟁','포성이 그치지 않던 밤이었다.'); return '모든 것이 멈췄다. 피난길에서 몇 달을 보냈다. 살아남았다.'; }},
  {k:'unify', p:.0008, h:'[가상] 남북 통일 합의', fx:S=>{ S.shockStock=S.shockStock||{}; S.shockStock[S.year]=(S.shockStock[S.year]||0)+20; add(S,{행:6}); S.titles.add('통일 세대'); return '광화문에 사람들이 모여 울었다. 세금이 오른다는 뉴스도 같이 나왔다.'; }},
  {k:'ai', p:.03, h:'[가상] AI 대전환 · 산업 지도가 바뀌다', fx:S=>{ S.shockStock=S.shockStock||{}; S.shockStock[S.year]=(S.shockStock[S.year]||0)+15; if(S.job&&S.job.kind==='사무'&&R()<.12){ S.job=null; S.track=null; add(S,{멘:-10}); return 'AI가 내 업무를 대신하게 됐다. 권고사직을 받았다.'; } add(S,{spec:2}); return '회사에 AI 동료가 생겼다. 일하는 방식이 바뀌었다.'; }},
  {k:'climate', p:.04, h:'[가상] 기록적 폭우 · 폭염', fx:S=>{ if(R()<.1){ add(S,{돈:-800, 멘:-6}); return '집이 침수됐다. 가구를 다 버려야 했다.'; } add(S,{체:-2}); return '여름이 한 달 더 길어진 것 같다.'; }},
];
const _sy8 = scheduleYear;
scheduleYear = function(S){
  _sy8(S);
  if(S.dead || S.year<2026) return;
  const happened=[];
  WORLD.forEach(w=>{ let p=w.p; if(w.k==='volcano' && S.volcano && S.year-S.volcano<=3) p=.08; if(p && R()<p) happened.push(w.k); });
  happened.slice(0,2).forEach(k=>{ S.sched.push({m:ri(1,12), d:{kind:'ms', name:'world', k}}); });
  S.sched.sort((a,b)=>a.m-b.m);
  S.invYearStart=S.inv||0; S.invGain=0;
};
MS.world = {build:(S,d)=>{ const w=WORLD.find(x=>x.k===d.k); const t=w.fx(S)||''; S.worldLog=S.worldLog||[]; S.worldLog.push({y:S.year, a:S.age, h:w.h.replace('[가상] ','')}); return {title:w.h.replace('[가상] ','[가상 미래] '), text:t, choices:[]}; }};
// 국민연금 기금 고갈 전망 (2055년 이후 연금 감액 위험)
const _yt4 = yearTick;
yearTick = function(S,ms){ _yt4(S,ms); if(S.year===2056 && S.pension && !S.f.has('연금개혁')){ S.f.add('연금개혁'); if(R()<.5){ S.pension*=.8; ms.push({kind:'info', title:'[가상 미래] 국민연금 기금 고갈', text:'연금 수령액이 20% 줄었다. 아껴 써야 한다.'}); } } };

/* --- 5) 엔딩: 자산 순위 · 사회 인식 점수 --- */
const ASSET_PCT = [[-5000,99],[0,92],[500,85],[2000,72],[6000,60],[18000,50],[36000,30],[55000,20],[105000,10],[200000,4],[330000,1],[867000,.1]];  // [순자산(만원), 상위%]
function assetTop(v){ const P=ASSET_PCT; if(v<=P[0][0]) return 99.9; for(let i=1;i<P.length;i++){ if(v<=P[i][0]){ const [x0,y0]=P[i-1],[x1,y1]=P[i]; const lx=v=>Math.sign(v)*Math.log10(1+Math.abs(v)); const f=(lx(v)-lx(x0))/(lx(x1)-lx(x0)); return y0+(y1-y0)*f; } } return .05; }
const PRESTIGE = {의사:10,변호사:10,파일럿:8,교사:7,공무원:7,대기업:7,연구원:7,소방관:7,운동선수:7,개발자:6,경찰관:6,간호사:6,'배우·모델':6,'코치·지도자':5,중견기업:5,승무원:5,'웹툰 작가':5,'디자이너·예술가':5,셰프:5,사회복지사:5,크리에이터:5,프로게이머:5,직업군인:5,기술자:4,영업직:4,공인중개사:4,중소기업:3,생산직:3,보험설계사:3,자영업:3,요양보호사:3,귀농:3,'택배 기사':2,'배달 라이더':2,알바:1};
function socialScore(S,e){
  const top=assetTop(e.asset);
  const econ = 30*clamp((100-top)/100,0,1)**.8;
  const health = 20*clamp((S.age-45)/42,0,1);
  const fam = (S.f.has('기혼')||S.f.has('이혼')?8:0) - (S.f.has('이혼')?3:0) + Math.min(S.kids,2)*3 + (S.kids? 6*clamp(S.h.kid/100,0,1) : 3*clamp(S.h.par/100,0,1));
  const jobs=(S.jobHist||[]).map(j=>PRESTIGE[j.name]??3); const best=jobs.length?Math.max(...jobs):0;
  const tierP=({S:5,A:4,B:3,C:2,D:1.5,E:1})[S.tier]||(S.f.has('자퇴')?0:.5);
  const status = clamp(best,0,10)+tierP;
  const happy = 10*clamp(e.avgH/100,0,1)*1.3;
  const honor = 5*clamp(e.honor/40,0,1);
  const parts=[['경제력',econ,30],['건강·수명',health,20],['가족',clamp(fam,0,20),20],['사회적 지위',status,15],['행복',clamp(happy,0,10),10],['명예·평판',honor,5]];
  const total=Math.round(parts.reduce((s,p)=>s+p[1],0));
  const grade = total>=85?'모두가 부러워한 인생': total>=70?'남부럽지 않은 인생': total>=55?'평범하게 잘 산 인생': total>=40?'고단했지만 버틴 인생':'힘겨웠던 인생';
  return {total, grade, parts, top:Math.round(top*10)/10};
}

// 연말 결산: 투자 수익 · 몸무게 변화
const _sh2 = settlementHtml;
settlementHtml = function(S){
  let h=_sh2(S);
  const g=S.invGain||0;
  if(Math.abs(g)>=10) h+=`<div class="srow"><span class="d ${g>0?'up':'down'}">투자 ${g>0?'+':''}${won(g)}</span><span class="why">${esc(INV_STYLE[S.invStyle||'주식'].split(' (')[0])} · 코스피 ${mktYear(S,S.year)>0?'+':''}${Math.round(mktYear(S,S.year))}%</span></div>`;
  if(S.wYearStart!=null && S.age>=15){ const dw=weightNow(S)-S.wYearStart; if(Math.abs(dw)>=1) h+=`<div class="srow"><span class="d ${dw>0?'down':'up'}">몸무게 ${dw>0?'+':''}${dw.toFixed(1)}kg</span><span class="why">${dw>0?((S.alloc&&S.alloc.exercise)?'회식·스트레스':'운동 부족'):'운동·생활 습관'}</span></div>`; }
  return h;
};
const _sy9 = scheduleYear;
scheduleYear = function(S){ _sy9(S); if(S.htBase!=null) S.wYearStart=weightNow(S); };
