/* ===== 다양한 직군 ===== */
Object.assign(JOBS, {
  '경찰관':{sal:3300, hon:4, kind:'공공'}, '소방관':{sal:3300, hon:5, kind:'공공'}, '직업군인':{sal:3200, hon:3, kind:'공공'},
  '승무원':{sal:4200, hon:2, kind:'사무'}, '파일럿':{sal:9000, hon:4, kind:'전문'}, '사회복지사':{sal:2900, hon:4, kind:'공공'},
  '미용사':{sal:2800, hon:1, kind:'자영'}, '웹툰 작가':{sal:2400, hon:2, kind:'자영'}, '프로게이머':{sal:5000, hon:2, kind:'선수'},
  '보험설계사':{sal:3200, hon:1, kind:'사무'}, '공인중개사':{sal:4200, hon:1, kind:'자영'}, '택배 기사':{sal:4000, hon:1, kind:'현장'},
  '연구원':{sal:5500, hon:3, kind:'사무'}, '귀농':{sal:2000, hon:1, kind:'자영'}, '요양보호사':{sal:2600, hon:3, kind:'현장'},
});
const ab=(S,t)=>ability(S,t);
// show: 지원할 수 있는지 · p: 합격 확률 · prep: 준비 설명
const JOBCAT = {
  '경찰관':{show:S=>S.age<=40, p:S=>.1+S.s.체/600+S.s.학/900+S.attempts*.04, prep:'체력 시험 + 필기'},
  '소방관':{show:S=>S.age<=40, p:S=>.08+S.s.체/450+S.attempts*.04, prep:'체력이 가장 중요'},
  '직업군인':{show:S=>S.age<=30, p:S=>.4+S.s.체/400, prep:'부사관·장교 지원'},
  '승무원':{show:S=>S.age<=32 && ab(S,'외모')>=55, p:S=>(ab(S,'외모')-50)/80+Math.max(S.h.eng,ab(S,'외국어'))/250, prep:'외모 · 외국어 · 서비스 면접'},
  '파일럿':{show:S=>S.age<=35 && S.s.학>=50, p:S=>.05+(S.s.학-50)/200+(ab(S,'체격')-50)/200+S.h.eng/400, prep:'비행교육 1억 원 · 신체검사', cost:10000},
  '사회복지사':{show:S=>true, p:S=>.55+S.s.인/400, prep:'자격증 + 공고'},
  '미용사':{show:S=>ab(S,'손재주')>=15, p:S=>(ab(S,'손재주')+5)/60, prep:'미용 학원 + 국가자격'},
  '웹툰 작가':{show:S=>ab(S,'예술감각')>=40, p:S=>(ab(S,'예술감각')-35)/70, prep:'플랫폼 도전 연재', hire:S=>{ if(R()<.12+ab(S,'예술감각')/1000){ S.job={name:'웹툰 작가', sal:16000, hon:3, kind:'자영'}; S.titles.add('인기 웹툰 작가'); return '연재 3개월 만에 실시간 1위! 드라마 판권 계약까지 들어왔다.'; } S.job={name:'웹툰 작가', ...JOBS['웹툰 작가']}; return '정식 연재 계약! 마감에 쫓기는 삶이 시작됐다.'; }},
  '프로게이머':{show:S=>S.age<=24 && (S.f.has('게임중독')||ab(S,'운동신경')>=65), p:S=>(ab(S,'운동신경')-55)/45+(S.f.has('게임중독')?.1:0), prep:'랭킹 상위 · 입단 테스트', hire:S=>{ S.job={name:'프로게이머', ...JOBS['프로게이머']}; S.titles.add('프로게이머'); return '입단 테스트 합격! 숙소에서 하루 14시간 연습한다.'; }},
  '보험설계사':{show:S=>true, p:S=>.7, prep:'바로 시작', hire:S=>{ S.job={name:'보험설계사', sal:Math.round(2400+ab(S,'말솜씨')*40+S.s.인*15), hon:1, kind:'사무'}; return `위촉됐다. 첫 달 고객은 엄마였다. 연봉은 실력대로 ${won(S.job.sal)}.`; }},
  '공인중개사':{show:S=>S.age>=24, p:S=>.12+S.s.학/500+S.attempts*.05, prep:'1·2차 시험'},
  '택배 기사':{show:S=>true, p:S=>.9, prep:'바로 시작 · 체력 필요'},
  '연구원':{show:S=>S.major==='공대' && S.s.학>=60, p:S=>.25+(S.s.학-60)/150+(S.f.has('대학원')?.2:0), prep:'석사 우대'},
  '귀농':{show:S=>S.age>=45, p:S=>.85, prep:'시골로 이사'},
  '요양보호사':{show:S=>S.age>=40, p:S=>.85, prep:'자격증 3주'},
};
// 기존 직군의 대략적인 합격 감
function estP(S,t){
  if(JOBCAT[t]) return clamp(JOBCAT[t].p(S),0,1);
  return ({대기업:.12+tierBonus(S)*1.6+S.h.spec/250, 공무원:.15+S.s.학/1000, 교사:.2+S.s.학/600, 간호사:.9, 개발자:.2+ab(S,'코딩')/150+tierBonus(S),
    중소기업:.88, 생산직:.6, 운동선수:(ab(S,'운동신경')-70)/28, '배우·모델':(ab(S,'외모')-70)/30, '디자이너·예술가':(ab(S,'예술감각')-45)/45,
    셰프:(ab(S,'손재주')-15)/45, 기술자:(ab(S,'손재주')-15)/45, 영업직:.3+ab(S,'말솜씨')/120, 크리에이터:.12+(ab(S,'말솜씨')+ab(S,'외모')-90)/250, 아이돌:.06})[t] ?? .3;
}
function trackOptions(S){
  const o=[];
  if(S.f.has('졸업')) o.push('대기업');
  o.push('공무원');
  if(S.major==='사범대') o.push('교사'); if(S.major==='간호학과') o.push('간호사');
  if(S.major==='공대'||ab(S,'코딩')>=25||S.f.has('코딩관심')) o.push('개발자');
  if(ab(S,'운동신경')>=77) o.push('운동선수'); if(ab(S,'외모')>=77) o.push('배우·모델');
  if(ab(S,'예술감각')>=50) o.push('디자이너·예술가'); if(ab(S,'손재주')>=28){ o.push('셰프'); o.push('기술자'); }
  if(ab(S,'말솜씨')>=20) o.push('영업직');
  if(S.f.has('연습생')) o.push('아이돌'); if(S.f.has('크리에이터꿈')||ab(S,'말솜씨')>=50) o.push('크리에이터');
  Object.keys(JOBCAT).forEach(t=>{ if(JOBCAT[t].show(S)) o.push(t); });
  o.push('중소기업'); if(!S.f.has('졸업')) o.push('생산직');
  const uniq=[...new Set(o)];
  return uniq.sort((a,b)=>estP(S,b)*(a==='중소기업'||a==='택배 기사'||a==='보험설계사'?1:1.6)-estP(S,a)*(b==='중소기업'||b==='택배 기사'||b==='보험설계사'?1:1.6)+0);
}
const PREP = {대기업:'서류·인적성·면접', 공무원:'1년에 한 번 시험', 교사:'임용고시', 간호사:'면허 + 병원 지원', 개발자:'코딩 테스트', 중소기업:'바로 입사', 생산직:'공장 지원',
  운동선수:'입단 테스트', '배우·모델':'오디션', '디자이너·예술가':'포트폴리오', 셰프:'주방 막내부터', 기술자:'자격증 + 현장', 영업직:'말솜씨가 무기', 크리에이터:'채널 개설', 아이돌:'데뷔조'};
function chanceWord(p){ return p>=.6?'해볼 만하다':p>=.3?'도전해볼 만하다':p>=.12?'쉽지 않다':'아주 어렵다'; }
MS.track.build = function(S,d){
  d=d||{}; const all=trackOptions(S), page=d.page||0, per=3;
  const list=all.slice(page*per, page*per+per);
  const ch=list.map(t=>({l:`${t} · ${JOBCAT[t]?.prep||PREP[t]||''} (${chanceWord(clamp(estP(S,t),0,1))})`, run:S=>{
    S.track=t; S.attempts=0;
    const c=JOBCAT[t]?.cost; if(c){ add(S,{돈:-c}); }
    if(t==='귀농'){ S.f.add('귀농'); }
    S.queue.unshift({kind:'ms', name:'hunt'}); return `${t}. 준비를 시작했다.`; }}));
  if(all.length>per) ch.push({l:'다른 길 보기', run:S=>{ S.queue.unshift({kind:'ms', name:'track', page:(page+1)%Math.ceil(all.length/per)}); return ''; }});
  return {title:'진로 결정', text:`무엇을 하며 먹고살까? (${page+1}/${Math.ceil(all.length/per)})\n도전할 수 있는 길이 ${all.length}가지 있다.`, choices:ch};
};
MAJOR.add('career_change');
