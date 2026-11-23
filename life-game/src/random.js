/* ===== 랜덤성 강화 =====
   1) 같은 선택이라도 결과의 크기가 매번 다르다 (능력치 변화 0.4~2배)
   2) 결과에 가끔 '뜻밖의 반전'이 붙는다 (약 18%)
   3) 인생마다 어떤 일이 잦은지가 다르다 (이벤트별 가중치를 인생마다 새로 뽑음)
   4) 나이와 상관없이 터지는 일상 돌발 사건 */

// 3) 인생마다 이벤트 빈도가 다르다
const _ngRnd = newGame;
newGame = function(name, mode){ const r=_ngRnd(name,mode); S.evW={}; EVENTS.forEach(e=>{ S.evW[e.id]=Math.exp(gauss()*.75); }); return r; };
EVENTS.forEach(e=>{ if(e.manual) return; const w0=e.w; e.w=S=>((typeof w0==='function'? w0(S) : (w0??1)))*((S.evW&&S.evW[e.id])||1); });

// 1)+2) 결과의 크기와 반전
const TWISTS = [
  {t:'돌아오는 길에 산 복권이 5등에 당첨됐다.', e:{돈:5, 행:2}},
  {t:'그날 지하철에서 휴대폰을 잃어버렸다.', e:{돈:-80, 멘:-3}},
  {t:'우연히 들어간 식당에서 10년 전 친구를 만났다.', e:{인:5, 행:3}},
  {t:'다음 날 독감에 걸려 일주일을 앓았다.', e:{체:-5}},
  {t:'그 이야기를 들은 이웃이 김치를 한 통 갖다줬다.', e:{행:3, 인:2}},
  {t:'주차해 둔 차에 누가 긁고 도망갔다.', e:{돈:-60, 멘:-3}},
  {t:'중고로 내놓은 물건이 생각보다 비싸게 팔렸다.', e:{돈:40, 행:2}},
  {t:'그 주에 본 영화 한 편이 이상하게 오래 남았다.', e:{멘:4}},
  {t:'택배 상자를 뜯다 손을 베었다. 별일 아닌데 서러웠다.', e:{멘:-2}},
  {t:'길고양이 한 마리가 집 앞에 자리를 잡았다. 이름을 지어줬다.', e:{행:4}},
  {t:'건강검진에서 생각보다 결과가 좋았다.', e:{체:3, 멘:3}},
  {t:'누가 내 SNS 글을 퍼가서 작게 화제가 됐다.', e:{인:4, 매:2}},
  {t:'보이스피싱 문자를 눌러버렸다. 다행히 큰 피해는 없었다.', e:{돈:-30, 멘:-4}},
  {t:'오랜만에 꿈자리가 좋았다. 이유 없이 기분이 좋은 한 주였다.', e:{행:3}},
  {t:'층간소음 때문에 한 달 내내 잠을 설쳤다.', e:{멘:-5, 체:-2}},
  {t:'회사(학교) 근처에 단골 국밥집이 생겼다.', e:{행:2, 체:1}},
];
const STAT_KEYS=['학','체','멘','행','인','매'];
const _rcRnd = resolveCard;
resolveCard = function(S,d,i){
  const before = d.kind==='ev' ? STAT_KEYS.map(k=>S.s[k]) : null;
  let txt=_rcRnd(S,d,i);
  if(d.kind!=='ev' || S.dead || S.age<3) return txt;
  // 크기 흔들기: 같은 선택도 크게 혹은 작게
  const m=clamp(Math.exp(gauss()*.45-.1),.4,2);
  STAT_KEYS.forEach((k,j)=>{ const dv=S.s[k]-before[j]; if(Math.abs(dv)>.01) S.s[k]=clamp(before[j]+dv*m,0,100); });
  // 반전
  if(R()<.18){ const good=TWISTS.filter(x=>Object.values(x.e).reduce((a,b)=>a+b,0)>0), bad=TWISTS.filter(x=>!good.includes(x)); const tw=pick(R()<.6?good:bad); add(S,tw.e); txt=(txt?txt+'\n':'')+'그런데… '+tw.t; }
  return txt;
};

// 4) 일상 돌발 사건 (나이 무관, 결과도 운)
const WILD = [
 {id:'w_wallet', a:[8,85], w:2, t:'길에서 두툼한 지갑을 주웠다. 현금이 꽤 들어 있다.', c:[
  {l:'경찰서에 갖다준다', run:S=>{ if(R()<.35){ add(S,{돈:R()<.3?300:50, hon:2, 행:4}); return '주인이 사례금을 들고 찾아왔다. “요즘 이런 사람 없어요.”'; } add(S,{hon:1, 행:2}); return '연락은 없었다. 그래도 마음은 가벼웠다.'; }},
  {l:'현금만 챙긴다', run:S=>{ if(R()<.3){ add(S,{돈:-200, hon:-5, 멘:-8}); return 'CCTV에 찍혔다. 점유이탈물횡령으로 벌금을 냈다.'; } add(S,{돈:30, 멘:-3}); return '며칠 동안 그 지갑이 꿈에 나왔다.'; }}]},
 {id:'w_contest', a:[10,80], w:2, t:'마트 경품 추첨함에 응모권을 넣었다. 오늘 발표다.', c:[
  {l:'확인해본다', run:S=>{ const r=R(); if(r<.02){ add(S,{돈:3000, 행:10}); hl(S,`${S.age}세, 경품으로 자동차가 당첨됐다`); return '1등. 경차 한 대. 손이 떨려서 사인을 못 했다.'; } if(r<.2){ add(S,{돈:30, 행:3}); return '3등. 라면 한 박스.'; } return '꽝. 이럴 줄 알았다.'; }}]},
 {id:'w_secondhand', a:[16,80], w:2, t:'중고 거래 앱에 오래된 물건을 올렸더니 수집가가 연락했다.', c:[
  {l:'값을 세게 부른다', run:S=>{ if(R()<.3){ add(S,{돈:R()<.25?1500:300, 행:5}); return '알고 보니 희귀 한정판이었다. 부른 값 그대로 팔렸다.'; } add(S,{행:-1}); return '“생각해볼게요” 이후로 답장이 없다.'; }},
  {l:'적당히 판다', run:S=>{ add(S,{돈:50, 행:2}); return '깔끔한 거래. 매너 온도가 올랐다.'; }}]},
 {id:'w_rescue', a:[12,80], w:1.5, t:'한강 산책길, 물가에서 누군가 허우적거린다.', c:[
  {l:'구명튜브를 던지고 119에 신고', run:S=>{ add(S,{hon:4, 행:4}); return '구조대가 왔다. 뉴스 끝에 “시민의 침착한 신고 덕분”이라는 말이 나왔다.'; }},
  {l:'직접 뛰어든다', run:S=>{ if(R()<.01*DEATH_MULT) return killNow(S,'익수자 구조 중 사고','누군가를 구하려 했다.'); if(R()<.6){ add(S,{hon:8, 체:-5}); S.titles.add('시민 영웅'); hl(S,`${S.age}세, 물에 빠진 사람을 구했다`); return '구했다. 숨을 몰아쉬는데 박수 소리가 들렸다.'; } add(S,{체:-10, 멘:-6}); return '나도 휩쓸릴 뻔했다. 구조대가 둘 다 끌어냈다.'; }}]},
 {id:'w_neighbor', a:[20,85], w:2, t:'새로 이사 온 옆집 사람이 떡을 들고 인사를 왔다.', c:[
  {l:'차 한잔 하고 가라고 한다', run:S=>{ if(R()<.5){ add(S,{인:6, 행:4}); return '알고 보니 동갑. 그날 이후 가끔 같이 저녁을 먹는다.'; } add(S,{멘:-2}); return '세 시간 동안 다단계 설명을 들었다.'; }},
  {l:'감사 인사만', run:S=>{ add(S,{인:1}); return '현관문을 닫고 떡을 먹었다. 맛있었다.'; }}]},
 {id:'w_typo', a:[20,70], w:1.5, t:'이체하다 0을 하나 더 눌렀다. 모르는 사람에게 돈이 갔다.', c:[
  {l:'은행에 반환 신청', run:S=>{ if(R()<.7){ add(S,{멘:-3}); return '열흘 만에 돌려받았다. 그동안 잠을 못 잤다.'; } add(S,{돈:-500, 멘:-8}); return '상대가 연락을 안 받는다. 소송까지 가야 한다.'; }}]},
 {id:'w_trip', a:[15,80], w:2, t:'충동적으로 떠난 당일치기 여행. 갈림길이 나왔다.', c:[
  {l:'처음 보는 길로', run:S=>{ const r=R(); if(r<.4){ add(S,{행:8, 멘:4}); return '지도에 없는 작은 바다를 발견했다. 아무도 없었다.'; } if(r<.7){ add(S,{행:2}); return '평범한 시골길이었다. 그래도 좋았다.'; } add(S,{체:-3, 돈:-50}); return '길을 잃었다. 막차를 놓쳐 모텔에서 잤다.'; }},
  {l:'유명한 맛집으로', run:S=>{ add(S,{행:3, 돈:-5}); return '두 시간 줄 섰다. 맛은… 동네 집이 낫다.'; }}]},
 {id:'w_meteor', a:[8,85], w:1.5, t:'밤하늘에 유난히 밝은 별똥별이 떨어졌다.', c:[
  {l:'소원을 빈다', run:S=>{ if(R()<.15){ add(S,{행:6, 멘:6}); S.f.add('별똥별'); return '그해, 이상하게 일이 잘 풀렸다.'; } add(S,{행:2}); return '무슨 소원을 빌었는지는 비밀이다.'; }}]},
 {id:'w_scam', a:[25,85], w:1.5, t:'“엄마(아빠) 나 폰 고장 나서 친구 폰으로 연락해. 급하게 돈 좀…”', c:[
  {l:'보낸다', run:S=>{ add(S,{돈:-ri(100,600), 멘:-8}); return '메신저 피싱이었다. 경찰서에서 같은 피해자 셋을 만났다.'; }},
  {l:'전화로 확인한다', run:S=>{ add(S,{멘:2}); return '진짜 아이는 학교에서 수업 중이었다.'; }}]},
 {id:'w_talent', a:[30,80], w:2, t:'동네 문화센터 강좌를 하나 들어볼까?', c:[
  {l:'도예', run:S=>{ if(R()<.25){ add(S,{행:8}); S.titles.add('늦게 핀 재능'); return '강사가 “재능 있으시네요”라고 했다. 작은 전시회까지 열었다.'; } add(S,{행:3}); return '찌그러진 컵을 세 개 만들었다. 매일 쓴다.'; }},
  {l:'댄스', run:S=>{ if(R()<.2){ add(S,{체:5, 인:6, 매:4}); return '구청 대회에서 상을 받았다.'; } add(S,{체:3, 행:3}); return '박자를 못 맞췄지만 땀은 흘렸다.'; }}]},
];
WILD.forEach(e=>{ e.rep=true; EVENTS.push(e); EVMAP[e.id]=e; MAJOR.add(e.id); const f=e.if; e.if=S=>(!f||f(S)) && !(S.evLast && S.evLast[e.id]!=null) && R()<.07; e.w0=e.w; });   // 평생 한 번, 해마다 낮은 확률

// 5) 한 인생에서 같은 사건은 최대 3번 (결혼·연애처럼 이어지는 사건은 제외)
const EV_MULTI_OK = new Set(['meet_someone','breakup','marry','divorce']);
const _rcCap = resolveCard;
resolveCard = function(S,d,i){ if(d.kind==='ev'){ S.evCnt=S.evCnt||{}; S.evCnt[d.id]=(S.evCnt[d.id]||0)+1; } return _rcCap(S,d,i); };
EVENTS.forEach(e=>{ if(!e.rep || EV_MULTI_OK.has(e.id)) return; const f=e.if; e.if=S=>(!S.evCnt || (S.evCnt[e.id]||0)<3) && (!f||f(S)); });
