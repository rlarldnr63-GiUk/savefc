/* ===== 보정 (2026-11): 자산 출처 기록 · 직업 쏠림 · 웹툰 연봉 ===== */

// 1) 자산이 어디서 왔는지 기록한다: 월급 저축 / 투자 수익 / 상속 / 횡재 / 큰 지출
function srcOf(S){ return S.src || (S.src={save:0, inv:0, inherit:0, luck:0, loss:0}); }
const _ytT = yearTick;
yearTick = function(S,ms){
  if(S.job && S.job.sal>0) srcOf(S).save += S.job.sal*.13;
  _ytT(S,ms);
};
const _mtT = monthTick;
monthTick = function(S){
  const g0=S.invGain||0; _mtT(S);
  const g1=S.invGain||0; if(g1>=g0) srcOf(S).inv += g1-g0;   // 연초 초기화된 달은 건너뛴다
};
const _parB = MS.parents.build;
MS.parents.build = function(S,d){ const b=S.money; const r=_parB(S,d); srcOf(S).inherit += S.money-b+0; return r; };
const _rcT = resolveCard;
resolveCard = function(S,d,i){
  const b=S.money+(S.inv||0); const t=_rcT(S,d,i);
  const dd=S.money+(S.inv||0)-b;
  if(d.kind==='ev' || d.kind==='news'){ if(dd>=3000) srcOf(S).luck+=dd; else if(dd<=-3000 && !(d.id==='buy_house')) srcOf(S).loss+=dd; }
  return t;
};
// 엔딩에서 쓰는 요약: [이름, 금액] 목록과 가장 큰 출처
function assetSources(S, total){
  const s=srcOf(S), house=S.house? (S.house.val-(S.house.bought||S.house.val)) : 0;
  const L=[['월급 저축',s.save],['투자 수익',s.inv],['상속',s.inherit],['집값 상승',house],['뜻밖의 돈',s.luck]].filter(x=>Math.abs(x[1])>=100);
  const known=L.reduce((a,x)=>a+x[1],0)+s.loss;
  const spend=total-known;   // 생활비·대출 이자·사건 지출 등 나머지
  if(s.loss<=-100) L.push(['큰 지출·손실',s.loss]);
  if(Math.abs(spend)>=100) L.push([spend<0?'생활비·이자 등':'기타',spend]);
  const top=L.filter(x=>x[1]>0).sort((a,b)=>b[1]-a[1])[0];
  return {list:L, top: top? top[0] : null};
}

// 2) 진로 목록: 붙을 확률 × 직업의 매력(위신)으로 정렬 → 사회복지사·웹툰만 맨 위에 오지 않게
const _toT = trackOptions;
trackOptions = function(S){
  const L=_toT(S).filter(t=> t!=='웹툰 작가' || ab(S,'예술감각')>=50);
  const sc=t=> clamp(estP(S,t),0,.85) * (.45 + (PRESTIGE[t]??4)/10);
  return L.sort((a,b)=>sc(b)-sc(a));
};
if(JOBCAT['웹툰 작가']){ JOBCAT['웹툰 작가'].p = S=>(ab(S,'예술감각')-45)/70; JOBCAT['웹툰 작가'].show = S=>ab(S,'예술감각')>=50; }

// 3) 자영업형 직업도 경력이 쌓이면 수입이 오른다 (웹툰 2,400만원 50년 고정 문제)
const _sgT = salGrowth;
salGrowth = function(S){
  const j=S.job; if(!j) return 1;
  if(j.kind==='자영' && S.age<50){
    if(j.name==='웹툰 작가'||j.name==='크리에이터'||j.name==='배우·모델') return j.sal<9000? 1.035 : 1.0;
    return 1.015;
  }
  if(j.name==='사회복지사' || j.name==='요양보호사') return S.age<55? 1.012 : 1;   // 처우가 크게 오르지 않는 직군
  return _sgT(S);
};

// 4) 상속: 출생 분위별 부모 순자산(통계청 가계금융복지조사 2024 순자산 10분위 평균 근사)
//    → 노후에 쓰고 남은 만큼 → 상속세(일괄공제 5억, 10~50% 누진) → 형제 수로 나눈다
//    재벌가(0.1%)는 상속재산 100억 초과 피상속인 비율(국세청 상속세 결정 현황, 사망자의 약 0.1%)에 맞춘다
const PARENT_NET = [0, 800, 4000, 9000, 15000, 22000, 30000, 40000, 55000, 80000, 170000]; // 만원, 1~10분위
function inheritTax(v){ const t=v-50000; if(t<=0) return 0;
  return t<=10000? t*.1 : t<=50000? t*.2-1000 : t<=100000? t*.3-6000 : t<=300000? t*.4-16000 : t*.5-46000; }
function inheritAmount(S){
  let estate;
  if(S.rich) estate = Math.round(150000*Math.exp(gauss()*.8));       // 재벌가: 중간값 150억, 수십억~수천억
  else {
    const w=clamp(Math.round(S.wealth0||S.wealth),1,10);
    estate = PARENT_NET[w]*Math.exp(gauss()*.45)*(.55+R()*.35);      // 노후 생활비·간병비로 일부를 쓰고 남은 재산
    if(w<=2 && R()<.5) estate=0;                                     // 남길 재산이 없는 경우
  }
  estate=Math.max(0,Math.round(estate));
  const tax=Math.round(inheritTax(estate)); S._inhTax = tax>0? Math.round(tax/(S.siblings+1)) : 0;
  return Math.round((estate-tax)/(S.siblings+1));
}
