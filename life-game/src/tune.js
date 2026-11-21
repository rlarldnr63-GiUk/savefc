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
  return _sgT(S);
};
