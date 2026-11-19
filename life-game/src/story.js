/* ===== 내 시점의 재능 발견 · 연말 결산 이유 ===== */

/* --- 재능은 숫자 대신 말로 --- */
function tierWord(t){ const T=TRAIT[t], v=ability(S,t);
  if(T.type==='후천') return v>=80?'달인':v>=60?'능숙하다':v>=40?'제법 한다':v>=20?'초보':v>=5?'막 시작했다':'아직 해본 적 없다';
  if(t==='외모') return v>=85?'눈에 확 띈다':v>=70?'호감형이다':v>=50?'평범하다':'수수한 편이다';
  if(t==='체격') return v>=85?'지치지 않는다':v>=70?'튼튼하다':v>=50?'평범하다':v>=35?'약한 편이다':'금방 지친다';
  return v>=85?'타고났다':v>=70?'남들보다 낫다':v>=50?'평범하다':v>=35?'조금 서툴다':'많이 서툴다'; }
function isRevealed(S,t){ return (S.revealed||[]).includes(t); }
traitVisible = function(S,t){ const T=TRAIT[t]; if(T.type==='후천') return S.age>=T.unlock; return isRevealed(S,t) || S.age>=13; };
function revealTrait(S,t){
  S.revealed=S.revealed||[]; if(!S.revealed.includes(t)) S.revealed.push(t);
  if(!S.f.has('재능발견')){ S.f.add('재능발견'); S.focus=t; }
  else if((S.tal[t]||0)>(S.tal[S.focus]||0) && TRAIT[S.focus].type!=='후천') S.focus=t;
  if(t===S.star) hl(S,`${S.age}세, ${({운동신경:'운동장에서',두뇌:'수학 시간에',예술감각:'미술 시간에',체격:'오래달리기에서',외모:'카메라 앞에서'})[t]||''} 나도 몰랐던 나를 발견했다`);
}
// 같은 장면이라도 타고난 정도에 따라 결과 문장이 다르다
function byLevel(S,t,hi,mid,lo){ const v=S.tal[t]; return v>=75?hi: v>=48?mid: lo; }

/* 7살 재능 발견 카드는 없애고, 장면으로 대신한다 */
const _sy2 = scheduleYear;
scheduleYear = function(S){ S.f.add('talentfind_done'); _sy2(S); S.sched=S.sched.filter(x=>!(x.d.kind==='ms'&&x.d.name==='talentfind')); S.led={}; };

EVENTS.push(
{id:'find_sport', a:[8,13], w:4, t:'점심시간. 운동장에서 선배들이 부른다. “야, 한 명 모자란데 같이 찰래?”', c:[
  {l:'같이 찬다', run:S=>{ revealTrait(S,'운동신경'); S.skill.운동신경+=4; add(S,{체:3, 인:3});
    return byLevel(S,'운동신경','공이 발에 붙는 느낌이었다. 혼자 두 골을 넣었다. 선배들이 “너 몇 반이야?” 하고 물었다. 그날부터 점심시간마다 나를 찾으러 왔다.','숨이 턱까지 찼지만 패스 몇 번이 이어졌다. 재밌었다. 내일도 하자고 했다.','공이 자꾸 엉뚱한 데로 갔다. 헛발질에 다들 웃었다. 그래도 끝까지 뛰었다.'); }},
  {l:'골대 뒤에서 구경한다', run:S=>{ revealTrait(S,'운동신경'); return byLevel(S,'운동신경','보기만 하는데도 다음에 공이 어디로 갈지 보였다. 다리가 근질거렸다.','구경하다 공 하나를 주워 던져줬다. “고맙다!”','공이 날아와서 피하다 넘어졌다.'); }},
  {l:'교실에서 책을 읽는다', e:{학:1}, t:'창밖에서 함성이 들렸다. 나는 책장을 넘겼다.'}]},
{id:'find_brain', a:[7,11], w:4, t:'수학 시간. 선생님이 칠판에 어려운 문제를 적었다. “이거 풀어볼 사람?” 교실이 조용하다.', c:[
  {l:'손을 든다', run:S=>{ revealTrait(S,'두뇌'); add(S,{매:1});
    return byLevel(S,'두뇌','칠판 앞에 서니 답이 그냥 보였다. 선생님이 “어떻게 생각했어?” 하고 물었다. 반 애들이 수군거렸다.','한참 끙끙대다 반쯤 풀었다. 선생님이 나머지를 같이 풀어줬다.','분필을 들고 멍하니 서 있었다. 귀가 빨개졌다.'); }},
  {l:'공책에 혼자 풀어본다', run:S=>{ revealTrait(S,'두뇌'); return byLevel(S,'두뇌','선생님이 정답을 쓰기 전에 이미 다 풀었다. 아무한테도 말 안 했다.','반쯤 풀다 막혔다. 정답을 보고 “아!” 했다.','무슨 말인지 하나도 모르겠다. 공책에 낙서만 했다.'); }},
  {l:'짝꿍 눈치를 본다', e:{인:1}, t:'짝꿍도 나를 보고 있었다.'}]},
{id:'find_art', a:[6,11], w:4, t:'미술 시간. 자유 주제로 그림을 그리란다. 도화지가 하얗다.', c:[
  {l:'정성껏 그린다', run:S=>{ revealTrait(S,'예술감각'); S.skill.예술감각+=4;
    return byLevel(S,'예술감각','색을 섞는데 손이 멈추지 않았다. 선생님이 내 그림을 교실 뒤에 붙이고 교내 대회에 나가보라고 했다.','나쁘지 않았다. 집에 가져가니 냉장고에 붙었다.','사람을 그렸는데 감자처럼 나왔다. 짝꿍이 웃었다.'); }},
  {l:'만화 캐릭터를 따라 그린다', run:S=>{ revealTrait(S,'예술감각'); add(S,{인:2}); return byLevel(S,'예술감각','반 애들이 줄을 서서 자기 것도 그려달라고 했다.','그럭저럭 닮았다.','눈이 짝짝이가 됐다.'); }},
  {l:'대충 칠하고 논다', e:{행:2}, t:'종이 울리기 전에 끝냈다.'}]},
{id:'find_body', a:[8,12], w:3, t:'체육 시간 오래달리기. 운동장 다섯 바퀴.', c:[
  {l:'끝까지 뛴다', run:S=>{ revealTrait(S,'체격'); add(S,{체:2}); return byLevel(S,'체격','세 바퀴째에도 숨이 고르다. 1등으로 들어왔는데 다리가 아직 남았다.','중간쯤 들어왔다. 옆구리가 결렸다.','두 바퀴째에 옆구리를 잡고 걸었다.'); }},
  {l:'친구랑 수다 떨며 걷는다', e:{인:2}, t:'꼴찌로 들어왔다. 둘이 웃었다.'}]},
{id:'find_looks', a:[9,14], w:2.5, t:'반 단체 사진 찍는 날. 사진사 아저씨가 “자, 웃어요~” 한다.', c:[
  {l:'활짝 웃는다', run:S=>{ revealTrait(S,'외모'); return byLevel(S,'외모','사진이 나오자 다른 반 애들까지 “얘 누구야?” 하고 물었다. 졸업앨범 사진이 학교 홈페이지에 걸렸다.','무난하게 나왔다. 엄마가 지갑에 넣고 다닌다.','눈을 감은 채 찍혔다. 다시 찍어도 또 감았다.'); }},
  {l:'어색하게 서 있는다', run:S=>{ revealTrait(S,'외모'); return '사진 속 나는 굳어 있었다.'; }}]},
// 후천 능력: 해볼 기회가 생긴다
{id:'try_hands', a:[8,12], w:2.5, t:'과학 시간 숙제: 고무동력기 만들기. 아빠가 대신 만들어주겠다고 한다.', c:[
  {l:'내가 직접 만든다', run:S=>{ S.skill.손재주+=6; return S.tal.손재주>=20?'날개를 세 번 다시 붙였다. 운동장 끝까지 날아갔다. 손으로 뭔가 만드는 게 재밌다.':'풀이 손에 다 묻었다. 그래도 내 손으로 만들었다.'; }},
  {l:'아빠한테 맡긴다', e:{par:2}, t:'아빠 비행기가 반에서 제일 멀리 날았다. 내 이름표가 붙어 있었다.'}]},
{id:'try_speech', a:[9,13], w:2.5, t:'반 대표로 발표할 사람을 뽑는다. 선생님 눈이 나한테 멈췄다.', c:[
  {l:'해본다', run:S=>{ S.skill.말솜씨+=6; add(S,{매:1}); return S.tal.말솜씨>=20?'떨렸지만 말이 술술 나왔다. 질문에도 대답했다. 박수가 길었다.':'첫 문장에서 목소리가 떨렸다. 끝까지는 했다.'; }},
  {l:'다른 친구를 추천한다', e:{}, t:'추천받은 친구가 나를 째려봤다.'}]},
{id:'try_english', a:[10,15], w:2, t:'길에서 외국인이 지도를 들고 두리번거린다. 눈이 마주쳤다.', c:[
  {l:'“Can I help you?”', run:S=>{ S.skill.외국어+=5; S.h.eng+=4; return S.h.eng>=20?'손짓 발짓 섞어 지하철역까지 데려다줬다. “Thank you!” 기분이 좋았다.':'“Uh… go… straight?” 손가락으로 방향만 가리켰다. 다행히 통했다.'; }},
  {l:'모른 척 지나간다', e:{}, t:'집에 와서 하고 싶었던 말이 생각났다.'}]},
{id:'try_code', a:[12,16], w:2, t:'방과후 코딩 수업 신청서가 나왔다. 게임을 직접 만든다고 한다.', c:[
  {l:'신청한다', run:S=>{ S.skill.코딩+=8; S.f.add('코딩관심'); return '캐릭터가 화면에서 처음 움직인 순간 소리를 질렀다.'; }},
  {l:'관심 없다', e:{}, t:'그 시간에 축구를 했다.'}]},
{id:'try_lead', a:[15,18], w:2, t:'조별 과제 조장을 뽑는다. 다들 눈을 피한다.', c:[
  {l:'내가 할게', run:S=>{ S.skill.리더십+=7; add(S,{인:2, 멘:-1}); return '역할을 나누고 마감일을 정했다. 생각보다 다들 잘 따라왔다.'; }},
  {l:'눈을 피한다', e:{}, t:'가위바위보로 정했다. 내가 걸렸다… 는 꿈을 꿨다.'}]},
{id:'try_money', a:[20,28], w:2, t:'첫 통장에 돈이 조금 모였다. 친구가 주식 앱을 깔아보라고 한다.', c:[
  {l:'공부부터 하고 조금 넣는다', run:S=>{ S.skill.재테크+=8; return '경제 뉴스를 읽기 시작했다. 처음으로 “금리”가 뭔지 알았다.'; }},
  {l:'적금만 든다', run:S=>{ S.skill.재테크+=3; return '안전한 게 최고다.'; }}]},
);
['find_sport','find_brain','find_art','find_body','find_looks','try_hands','try_speech','try_english','try_code','try_lead','try_money'].forEach(id=>{ EVMAP[id]=EVENTS.find(e=>e.id===id); });
['find_sport','find_brain','find_art'].forEach(id=>MAJOR.add(id));   // 이 장면들은 멈춰서 직접 고른다

/* --- 연말 결산: 무엇 때문에 올랐고 깎였나 --- */
function led(S,k,v,src){ if(!v||!src) return; S.led=S.led||{}; const m=S.led[k]=S.led[k]||{}; m[src]=(m[src]||0)+v; }
const _add4 = add;
add = function(S,e){
  if(!S._src) return _add4(S,e);
  const b={...S.s, 돈:S.money}; _add4(S,e);
  for(const k of Object.keys(SK)) led(S,k,S.s[k]-b[k],S._src);
  led(S,'돈',S.money-b.돈,S._src);
};
const ACTNAME = k=>{ const x=acts(S).find(a=>a.k===k); return x?x.label.replace(/^특기 연습: /,'')+' 연습':k; };
function driftSrc(S,k,v,A){
  const p=x=>A[x]||0, L=x=>{ const a=acts(S).find(z=>z.k===x); return a?a.label:x; };
  const over=(p('study')+p('work')+p('invest'))>=Math.ceil(ptTotal(S)*.75);
  if(v>0) return ({학:`${L('study')} ${p('study')}칸`, 체:`${L('exercise')} ${p('exercise')}칸`, 멘:`${L('rest')} ${p('rest')}칸`, 행:`${L('fun')} ${p('fun')}칸`, 인:`${L('social')} ${p('social')}칸`, 매:`${p('style')?L('style')+' '+p('style')+'칸':'타고난 모습'}`})[k];
  if(k==='체') return S.age>40?'나이':over?'무리한 일정':S.f.has('지병')?'지병':'운동 부족';
  if(k==='멘') return over?'과로·공부 압박':'쉴 시간 부족';
  if(k==='행') return p('study')>5?'공부 압박':over?'바쁜 일상':'놀 시간 부족';
  if(k==='학') return p('study')?'배운 걸 잊음':'공부 안 함';
  if(k==='인') return '친구 만날 시간 부족';
  if(k==='매') return '관리 부족';
  return '시간 계획';
}
const _mt3 = monthTick;
monthTick = function(S){
  const b={...S.s}; _mt3(S); const A=S.alloc||{};
  for(const k of Object.keys(SK)){ const d=S.s[k]-b[k]; if(Math.abs(d)>1e-6) led(S,k,d,driftSrc(S,k,d,A)); }
};
// 연초 정산(월급·생활비·양육비·대출)도 이유를 남긴다
const _yt2 = yearTick;
yearTick = function(S,ms){
  const m0=S.money, b={...S.s}, job=S.job?{...S.job}:null, kids=S.kidBirth.filter(x=>{const a=S.age+1-x; return a>=0&&a<22;}).length, loan=S.house?S.house.loan:0, retired=S.retired, pension=S.pension;
  _yt2(S,ms);
  const fin={};
  if(job) fin['월급에서 저축']=job.sal*.13;
  else if(retired) fin['연금 - 생활비']=(S.age>=65?pension:pension*.5)-1600;
  else if(S.age>=24 && !S.studying && S.armyLeft===0) fin['생활비']=-(S.wealth>=8?150:500);
  if(kids) fin[`양육비 (${kids}명)`]=-800*kids;
  if(loan>0) fin['대출 상환·이자']=-(Math.min(loan,1800)+Math.max(0,loan-1800)*.035);
  const rest=(S.money-m0)-Object.values(fin).reduce((a,c)=>a+c,0); if(Math.abs(rest)>=1) fin['이자·기타']=rest;
  S.fin=fin; S.finStat={};
  for(const k of Object.keys(SK)){ const d=S.s[k]-b[k]; if(Math.abs(d)>.3) S.finStat[k]=d; }
};
function settlementHtml(S){
  const lines=[]; const ys=S.yearStart||{};
  const keys=[...Object.keys(SK),'돈'];
  for(const k of keys){
    const m={...(S.led&&S.led[k]||{})};
    if(k==='돈') for(const [s,v] of Object.entries(S.fin||{})) m[s]=(m[s]||0)+v;
    else if(S.finStat&&S.finStat[k]) m[k==='체'?'나이':'세월'] = (m[k==='체'?'나이':'세월']||0)+S.finStat[k];
    const tot=Object.values(m).reduce((a,c)=>a+c,0);
    if(k==='돈' ? Math.abs(tot)<10 : Math.abs(tot)<1.5) continue;
    const top=Object.entries(m).filter(([s,v])=>k==='돈'?Math.abs(v)>=10:Math.abs(v)>=.8).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).slice(0,3);
    const fmt=v=>k==='돈'? (v>0?'+':'')+won(v) : (v>0?'+':'')+Math.round(v);
    lines.push(`<div class="srow"><span class="d ${tot>0?'up':'down'}">${k==='돈'?'돈':SK[k]} ${fmt(tot)}</span><span class="why">${top.map(([s,v])=>`${esc(s)} ${fmt(v)}`).join(' · ')}</span></div>`);
  }
  return lines.join('');
}
