/* ===== 돈이 있으면 할 수 있는 것: 사치품·부동산 =====
   - 현금이 충분하면 '내 재산' 칸에서 바로 살 수 있다 (아파트는 40%만 있으면 대출)
   - 가진 물건은 평생 효과가 있다 (능력치 목표치↑), 대신 유지비가 들고 값이 오르내린다
   - 팔면 그때 값으로 현금이 된다
   + 멈춤 예산: 사건이 늘어도 '멈춰서 고르는' 횟수는 예전처럼 1년 평균 0.42번 */
const SHOP = [
  {k:'watch',  n:'명품 시계',      e:'⌚', price:3000,   up:0,    dep:-.02, fx:{매:4, 인:2},       d:'매력·인맥이 조금 오른다. 값은 잘 안 떨어진다.'},
  {k:'art',    n:'미술품',         e:'🖼️', price:8000,   up:50,   dep:'art', fx:{멘:3, 행:2},       d:'마음이 편해진다. 값은 운에 따라 크게 오르내린다.'},
  {k:'golf',   n:'골프 회원권',    e:'⛳', price:15000,  up:600,  dep:.01, fx:{인:6, 체:2},       d:'접대와 모임이 생긴다. 인맥이 크게 오른다.'},
  {k:'car',    n:'스포츠카',       e:'🏎️', price:20000,  up:1200, dep:.15, fx:{행:5, 매:5},       d:'행복·매력이 오른다. 해마다 값이 15% 떨어진다.'},
  {k:'villa',  n:'바닷가 별장',    e:'🏡', price:40000,  up:900,  dep:-.02, fx:{멘:5, 행:4, 체:2}, d:'주말마다 쉰다. 멘탈·행복이 오른다.'},
  {k:'yacht',  n:'요트',           e:'⛵', price:50000,  up:3500, dep:.08, fx:{인:7, 행:6, 매:3}, d:'요트 파티로 인맥이 넓어진다. 유지비가 무겁다.'},
  {k:'seoul',  n:'서울 아파트',    e:'🏢', price:120000, up:0,    house:true, fx:{행:3},          d:'40%만 있으면 대출로 산다. 집값이 오르면 자산도 오른다.'},
  {k:'gangnam',n:'강남 아파트',    e:'🏙️', price:300000, up:0,    house:true, fx:{행:4, 인:3},    d:'40%만 있으면 대출로 산다. 상위 1%의 주소.'},
];
const SHOPM={}; SHOP.forEach(x=>SHOPM[x.k]=x);
function shopNeed(it){ return it.house? Math.round(it.price*.4) : it.price; }
function canBuy(S,it){ if(!S||S.dead||S.age<20) return false; if(it.house) return !(S.house && S.house.tag===it.k) && S.money + (S.house? S.house.val-S.house.loan : 0) >= shopNeed(it); return !(S.items&&S.items[it.k]) && S.money>=shopNeed(it); }
function buyItem(S,k){
  const it=SHOPM[k]; if(!canBuy(S,it)) return false;
  if(it.house){ if(S.house){ S.money += S.house.val - S.house.loan; } const cash=Math.min(S.money, it.price); S.money-=cash; S.house={val:it.price, loan:it.price-cash, bought:it.price, by:S.year, tag:it.k}; S.f.add('내집');
    hl(S,`${S.age}세, ${it.n} 입성 (${won(it.price)})`); }
  else { S.money-=it.price; S.items=S.items||{}; S.items[k]={v:it.price, by:S.year}; hl(S,`${S.age}세, ${it.n}을(를) 샀다`); }
  add(S,{행:3}); return true;
}
function sellItem(S,k){ const o=S.items&&S.items[k]; if(!o) return false; S.money+=Math.round(o.v*.95); delete S.items[k]; add(S,{행:-2}); return true; }
function itemsValue(S){ let v=0; for(const k in (S.items||{})) v+=S.items[k].v; return v; }
// 평생 효과 · 유지비 · 값 변동
const _stShop = statTargets;
statTargets = function(S,A){ const T=_stShop(S,A); const owned=Object.keys(S.items||{}).concat(S.house&&S.house.tag?[S.house.tag]:[]);
  owned.forEach(k=>{ const fx=SHOPM[k]&&SHOPM[k].fx; if(fx) for(const s in fx) if(T[s]!=null) T[s]=clamp(T[s]+fx[s],5,98); }); return T; };
const _ytShop = yearTick;
yearTick = function(S,ms){
  _ytShop(S,ms);
  for(const k in (S.items||{})){ const it=SHOPM[k], o=S.items[k]; S.money-=it.up;
    o.v = it.dep==='art'? o.v*Math.exp(gauss()*.3) : o.v*(1-it.dep);
    if(S.money<-3000 && R()<.5){ sellItem(S,k); ms.push({kind:'info', title:'급매', text:`돈이 모자라 ${it.n}을(를) 팔았다.`}); } }
  if(S.house && S.house.tag==='gangnam') S.house.val*=1.015;   // 강남은 조금 더 오른다
};
// 엔딩 자산에 포함
const _endShop = ending;
ending = function(S){ const e=_endShop(S); e.asset += itemsValue(S); return e; };
// 캐릭터가 알아서 살 때: 넉넉하면 가끔 지른다 (돈의 1/3 이하일 때만)
const _ytShop2 = yearTick;
yearTick = function(S,ms){ _ytShop2(S,ms);
  if(S.dead || S.age<25 || S.customShop) return;
  const opts=SHOP.filter(it=>canBuy(S,it) && shopNeed(it)*3 <= S.money + (it.house&&S.house? S.house.val-S.house.loan:0) && (!it.house || !S.house || SHOPM[it.k].price > S.house.val*1.3));
  if(opts.length && R()<.25){ const it=pick(opts); if(buyItem(S,it.k)) ms.push({kind:'info', title:`${it.e} ${it.n}`, text:`통장을 보다가 질렀다. ${it.d}`}); }
};

// ===== 멈춤 예산 =====
const DEC_RATE = .29;
const DEC_KEEP = new Set(['dream','dol','track','college','suneung','hunt','army','highschool','retire','birth']);
const _isdBud = isDecision;
isDecision = function(d,card){
  const r=_isdBud(d,card); if(!r || !S) return r;
  if(d.kind==='ms' && DEC_KEEP.has(d.name)) return r;
  if(d.kind==='think') return r;
  if(d._budget!=null) return d._budget;
  S.decTok = S.decTok==null? 1 : S.decTok;
  d._budget = S.decTok>=1; if(d._budget) S.decTok-=1; return d._budget;
};
const _ytBud = yearTick;
yearTick = function(S,ms){ _ytBud(S,ms); S.decTok=Math.min(4,(S.decTok==null?2:S.decTok)+DEC_RATE); };
