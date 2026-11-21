/* ===== MBTI 성격: 기질에서 시작해 선택과 생활로 바뀐다 ===== */
const MBTI_NAME = {INTJ:'용의주도한 전략가',INTP:'논리적인 사색가',ENTJ:'대담한 통솔자',ENTP:'뜨거운 논쟁가',INFJ:'선의의 옹호자',INFP:'열정적인 중재자',ENFJ:'정의로운 리더',ENFP:'재기발랄한 활동가',
  ISTJ:'청렴결백한 원칙주의자',ISFJ:'용감한 수호자',ESTJ:'엄격한 관리자',ESFJ:'사교적인 외교관',ISTP:'만능 재주꾼',ISFP:'호기심 많은 예술가',ESTP:'모험을 즐기는 사업가',ESFP:'자유로운 영혼의 연예인'};
// 축 점수: 높을수록 E · N · F · P
const MB_KW = {
  E:/같이|친구|나간다|간다|모임|사귄다|발표|손을 든다|해본다|응원|광장|축가|조장|내가 할게|맨 앞|탬버린|장기자랑|먼저 다가|말을 건다|초대/,
  I:/혼자|조용히|책|방에|일찍 잔다|집에서|구경|눈치|모른 척|공책|이어폰|인강|독서실|메모장|비공개/,
  N:/그린다|상상|새 길|도전|만화|여행|유럽|창업|떠난다|코딩|꿈|유튜브|웹툰|워킹홀리데이|이것저것|오디션|혼자 풀어|다른 길|궁금|대안학교|진로를 바꾼다|해외/,
  S:/예금|적금|안정|현실|그대로|평소대로|익숙|김에 싸서|무리 없는|중고|경차|바로 취업|일단 입사|대중교통/,
  T:/소송|협상|연봉|라인|실적|계산|이직|합리|오퍼|증명서|따져|이름 빼고|단톡방에서 압박|세무사|솔직하게|정중히|거절|주식|투자한다|선생님께 알린다|“아빠 닮았겠지/,
  F:/사과|안아|편을 들|울는|운다|위로|고마|용서|털어놓|편지|양보|화해|저도요|마음만|기저귀|기다린다|도와/,
  J:/계획|공부|오답|미리|준비|저축|꼬박꼬박|끝까지|정성껏|등록|학원|보증보험|등기부|스터디|영수증/,
  P:/한 판만|논다|그냥|대충|빠진다|담 넘|째고|플렉스|몰빵|나중에|미룬다|조퇴|PC방|즉흥|드러눕/,
};
const MB_AX = [['E','I'],['N','S'],['F','T'],['P','J']];
function mbType(S){ const m=S.mb; if(!m) return '----'; return (m.E>=50?'E':'I')+(m.N>=50?'N':'S')+(m.F>=50?'F':'T')+(m.P>=50?'P':'J'); }
function mbShift(S, text, w){
  if(!S.mb || !text) return;
  for(const [hi,lo] of MB_AX){ if(MB_KW[hi].test(text)) S.mb[hi]=clamp(S.mb[hi]+w,3,97); if(MB_KW[lo].test(text)) S.mb[hi]=clamp(S.mb[hi]-w,3,97); }
}
// 이름 대신 쓰는 축 키: mb.E, mb.N, mb.F, mb.P (반대쪽은 100-값)
const _ng3 = newGame;
newGame = function(name, mode){
  const r=_ng3(name, mode);
  const T=S.tal||{};
  S.mb={ E:clamp(50+gauss()*16+(S.impulsive-.5)*16+(S.siblings>0?4:-2),8,92),
         N:clamp(50+gauss()*13+((T.예술감각||50)-50)*.35,8,92),
         F:clamp(50+gauss()*15+(S.family==='화목'?5:S.family==='갈등'?-4:0),8,92),
         P:clamp(50+gauss()*13+(S.impulsive-.5)*28,8,92) };
  S.mb0={...S.mb}; S.mbHist=[]; S.mbLast=null;
  return r;
};
// 생활(시간 배분)이 성격을 천천히 바꾼다
const _mt6 = monthTick;
monthTick = function(S){
  _mt6(S);
  if(!S.mb || S.age<4) return;
  const A=S.alloc||{}, p=k=>A[k]||0, k=1/12, tot=Math.max(6,ptTotal(S));
  const d={ E:(p('social')+p('style')*.5-p('rest')*.5-p('study')*.2)/tot*6,
            N:((['예술감각','코딩','말솜씨','외모'].includes(S.focus)?p('talent'):0) + p('fun')*.3 + p('study')*.05 - p('work')*.2 - p('invest')*.2)/tot*5,
            F:(p('family')+p('social')*.3-p('invest')*.4-p('study')*.3)/tot*5,
            P:(p('fun')+p('social')*.2+p('talent')*.2-p('study')*.3-p('invest')*.4)/tot*6 };
  // 타고난 기질(mb0)로 되돌아가려는 힘이 있어, 생활이 성격을 조금씩만 바꾼다
  const base=S.mb0||{E:50,N:50,F:50,P:50};
  for(const a in d) S.mb[a]=clamp(S.mb[a]+(d[a]*.5-(S.mb[a]-base[a])*.06)*k,3,97);
};
// 선택이 성격을 바꾼다 (직접 고른 갈림길은 크게, 알아서 한 일은 조금)
const _rc = resolveCard;
resolveCard = function(S,d,i){
  let label='';
  try{ if(d.kind==='ev'&&i>=0) label=EVMAP[d.id].c[i].l; else if(d.kind==='news'&&i>=0&&NEWS[d.idx].c) label=NEWS[d.idx].c[i].l; else if(d.kind==='ms'&&d._m&&i>=0&&d._m.choices[i]) label=d._m.choices[i].l; }catch(e){}
  const txt=_rc(S,d,i);
  if(S.age>=4) mbShift(S, label+' '+(txt||''), S._decide?5:1.6);
  return txt;
};
// 캐릭터가 알아서 할 때는 성격대로 고른다
const _ai = autoIndex;
autoIndex = function(S,d,card){
  const idx=card.choices.map((c,i)=>c.ok?i:-1).filter(i=>i>=0);
  if(!idx.length || !S.mb || S.age<5) return _ai(S,d,card);
  const t=mbType(S);
  return wpick(idx, i=>{ const l=card.choices[i].l; let w=1; for(const ch of t){ if(MB_KW[ch].test(l)) w*=1.7; }
    if(d.kind==='ev'){ const e=EVMAP[d.id].c[i].e||{}; if(e.risk>0) w*=1+S.h.risk/40; } return w; });
};
// 성격이 생활에 주는 영향
const _st6 = statTargets;
statTargets = function(S,A){
  const T=_st6(S,A); if(!S.mb||S.age<7) return T;
  const m=S.mb;
  T.인=clamp(T.인+(m.E-50)*.1,5,98); T.멘=clamp(T.멘+(50-m.E)*.04+(m.P-50)*.03,5,98);
  T.행=clamp(T.행+(m.P-50)*.04+(m.F-50)*.03,5,98); T.학=clamp(T.학+(50-m.P)*.05+(50-m.F)*.03,5,98);
  return T;
};
// 해마다 성격 확인 (경계에서 왔다 갔다 하지 않도록 여유를 둔다)
function mbStable(S){
  const m=S.mb, prev=S.mbLast||mbType(S); let out='';
  MB_AX.forEach(([hi,lo],k)=>{ const cur=prev[k], v=m[hi]; out += cur===hi ? (v<45?lo:hi) : (v>55?hi:lo); });
  return out;
}
const _sy4 = scheduleYear;
scheduleYear = function(S){
  _sy4(S);
  if(!S.mb || S.age<7) return;
  const t=mbStable(S);
  if(!S.mbLast){ S.mbLast=t; S.mbHist.push({age:S.age,t}); S.mbNews=`요즘 나는 이런 사람인 것 같다: ${t} · ${MBTI_NAME[t]}`; }
  else if(t!==S.mbLast){ S.mbNews=`요즘 성격이 달라졌다: ${S.mbLast} → ${t} · ${MBTI_NAME[t]}`; S.mbLast=t; S.mbHist.push({age:S.age,t}); hl(S,`${S.age}세, 성격이 ${t}(으)로 바뀌었다`); }
};
const MB_LABEL = {E:'외향',I:'내향',N:'직관',S:'감각',F:'감정',T:'사고',P:'인식',J:'판단'};
