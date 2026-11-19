/* ===== 설명 말풍선: 지금 수치로 계산한 미래 영향 ===== */
const pct = v => (v >= 0 ? '+' : '') + Math.round(v * 100) + '%p';
const mul = v => '×' + v.toFixed(2);
function suneungTop(S) { const z = (S.s.학 * S.talent - 64) / 10 / 1.1; return Math.max(.1, Math.min(99.9, (1 - phi(z)) * 100)); }
const STAT_INFO = {
  학: S => {
    const L = [];
    if (S.age < 19) { const t = suneungTop(S); L.push(`지금 실력이면 수능 전국 상위 약 <b>${t.toFixed(t < 10 ? 1 : 0)}%</b>`); L.push('SKY급 상위 1.5% · 인서울 15% · 지방거점 35%'); }
    else L.push(`공무원 합격률 ${pct(S.s.학 / 1000)} · 교사 임용 ${pct(S.s.학 / 600)}`);
    L.push('40 아래로 떨어져도 바로 벌은 없지만 진학·시험 문턱이 높아진다');
    return L;
  },
  체: S => {
    const m = clamp(1 + (50 - S.s.체) / 40, .6, 2.8);
    return [`올해 사망 위험 <b>${mul(m)}</b> (50 기준 1.00)`, `70 이상이면 시간 +1칸 · 30 미만이면 -1칸`, `25 미만이면 번아웃 위험 · 40세 전에 운동한 만큼 노화가 늦어진다 (저금 ${Math.round(S.hbank || 0)})`];
  },
  멘: S => {
    const r = resil(S);
    return [`나쁜 일의 피해 <b>${mul(r)}</b> (멘탈 높을수록 덜 다친다)`, `시험·면접 합격률 ${pct((S.s.멘 - 50) / 400)}`, `30 미만이면 일탈 위험이 해마다 오르고, 15 미만이면 위기가 온다`];
  },
  행: S => {
    const e = .8 + S.s.행 / 250;
    return [`공부·연습 효율 <b>${mul(e)}</b>`, `연애가 시작될 확률 ${mul(.6 + S.s.행 / 100)}`, '평생 평균 행복이 엔딩 점수의 20%'];
  },
  인: S => {
    const L = [`취업 합격률 ${pct(S.s.인 / 700)} · 승진(라인) ${pct(S.s.인 / 300)}`, `인연을 만날 확률 ${mul(clamp(.55 + S.s.매 / 220 + S.s.인 / 320 + S.s.행 / 450, .5, 1.45))}`];
    L.push(S.s.인 >= 55 ? '55 이상: 실직하면 친구들이 추천해준다 (+15%p)' : '55 이상이면 실직할 때 친구 추천(+15%p)이 생긴다');
    L.push('65세 이후 30 미만이면 외로움으로 행복이 깎인다');
    return L;
  },
  매: S => [`인연을 만날 확률 ${mul(clamp(.55 + S.s.매 / 220 + S.s.인 / 320 + S.s.행 / 450, .5, 1.45))}`, '소개팅·맞선이 잘 될 확률이 오른다', '면접 첫인상 · 일부 선택지 조건(매력 50~65)'],
};
function statTip(k) { return `<b>${SK[k]} ${Math.round(S.s[k])}</b><ul>${STAT_INFO[k](S).map(x => `<li>${x}</li>`).join('')}</ul>`; }
function actTip(k) {
  const list = acts(S), x = list.find(a => a.k === k); if (!x) return '';
  const A0 = { ...S.alloc }, A1 = { ...A0, [k]: (A0[k] || 0) + 1 };
  const T0 = statTargets(S, A0), T1 = statTargets(S, A1);
  const parts = [];
  for (const s of Object.keys(SK)) { const d = T1[s] - T0[s]; if (Math.abs(d) >= .5) parts.push(`${SK[s]} ${d > 0 ? '+' : ''}${Math.round(d)}`); }
  const L = [];
  if (parts.length) L.push(`1칸 늘리면 몇 년에 걸쳐 <b>${parts.join(' · ')}</b>까지 간다`);
  if (k === 'invest') {
    if (S.age < 13) L.push(`1칸당 평생 공부 효율 +0.4%/년 (지금 ${mul(S.talent)})`);
    else if (S.age < 19) L.push('스펙 +1.5/년 · 특기 실력 +0.5/년');
    else if (S.studying) L.push('스펙 +2.2/년 · 돈 -10만원/년');
    else L.push(`1칸당 한 해 ${won(S.job ? S.job.sal * .02 : 40)} 적립 · 굴리는 방식(예금·주식·코인)에 따라 수익이 다르다`);
    L.push('당장은 행복이 조금 준다');
  }
  if (k === 'talent' && S.f.has('재능발견')) {
    const t = S.focus, ty = TRAIT[t].type, rate = ty === '선천' ? 1.2 * (S.tal[t] / 50) : ty === '혼합' ? 1.6 * (.5 + S.tal[t] / 100) : 2.4 * (1 + S.tal[t] / 100);
    L.push(`1칸당 ${t} 실력 약 +${(rate * (.8 + S.s.행 / 250)).toFixed(1)}/년 (${ty}${ty === '선천' ? ', 한계 있음' : ''})`);
    if (TAL_JOB[t]) L.push(`쌓이면 ${TAL_JOB[t]}의 길이 열린다`);
  }
  if (k === 'work') L.push(S.job ? `스펙 +1/년 · 근무 칸 ${x.min}칸은 줄일 수 없다` : '1칸당 한 해 약 120만원 · 체력·학력이 조금 준다');
  if (k === 'exercise' && S.age < 40) L.push('40세 전 운동은 "건강 저금"이 되어 노후 체력을 지켜준다');
  if (k === 'social') L.push('말솜씨·리더십도 함께 자란다 · 외향(E) 쪽으로 성격이 기운다');
  if (k === 'rest') L.push('내향(I) 쪽으로 성격이 기운다');
  if (k === 'fun') L.push('즉흥(P) 쪽으로 성격이 기운다');
  if (k === 'family') L.push(S.kids ? '자녀와의 관계 +1.5/년 → 노후·제사에 반영' : '부모님과의 관계가 좋아진다');
  if (x.min) L.push(`${x.lock} ${x.min}칸 고정`);
  if (!L.length) L.push('이 칸은 지금 큰 변화가 없다');
  return `<b>${esc(x.label)} · 지금 ${S.alloc[k] || 0}칸</b><ul>${L.map(v => `<li>${v}</li>`).join('')}</ul>`;
}
let tipEl = null, tipFor = null, tipBy = null;
function showTip(target, html) {
  if (!tipEl) { tipEl = document.createElement('div'); tipEl.className = 'tip'; tipEl.setAttribute('role', 'tooltip'); document.body.appendChild(tipEl); }
  tipEl.innerHTML = html; tipEl.hidden = false; tipFor = target; tipY = window.scrollY;
  const r = target.getBoundingClientRect(), tw = Math.min(280, window.innerWidth - 24);
  tipEl.style.width = tw + 'px';
  let left = Math.max(12, Math.min(window.innerWidth - tw - 12, r.left));
  tipEl.style.left = left + 'px';
  const below = r.bottom + 6, h = tipEl.offsetHeight;
  tipEl.style.top = (below + h < window.innerHeight - 8 ? below : Math.max(8, r.top - h - 6)) + 'px';
}
function hideTip() { if (tipEl) tipEl.hidden = true; tipFor = null; }
function bodyTip(){ const b=S.bmi, h=heightNow(S), w=weightNow(S); return `<b>키 ${h.toFixed(1)}cm · 몸무게 ${w.toFixed(1)}kg · BMI ${b.toFixed(1)}</b><ul><li>${S.age<18?'자라는 중: 잠(휴식)·운동을 늘리면 최종 키가 최대 ±4cm 달라진다':'성인 평균 키 남 약 174cm · 여 약 161cm'}</li><li>BMI 25 이상(비만)이면 해마다 체력이 깎이고, 30 이상이면 더 크게 깎인다</li><li>운동 칸 1칸당 BMI 약 -0.45 · 스트레스·과로·사무직은 살이 찌기 쉽다</li><li>한국 성인 비만율 37% (남 46% · 여 28%)</li></ul>`; }
function tipHtmlFor(el) { if (el.dataset.tipBody) return bodyTip(); if (el.dataset.tipStat) return statTip(el.dataset.tipStat); if (el.dataset.tipAct) return actTip(el.dataset.tipAct); return ''; }
document.addEventListener('click', e => {
  if (e.target.closest('select,button')) return;
  const el = e.target.closest('[data-tip-stat],[data-tip-act],[data-tip-body]');
  if (el) { const key = el.dataset.tipStat || el.dataset.tipAct || 'body'; if (tipFor === key && tipEl && !tipEl.hidden && tipBy === 'click') return hideTip(); showTip(el, tipHtmlFor(el)); tipFor = key; tipBy = 'click'; return; }
  if (!e.target.closest('.tip')) hideTip();
});
document.addEventListener('mouseover', e => {
  if (!matchMedia('(hover: hover)').matches) return;
  const el = e.target.closest('[data-tip-stat],[data-tip-act],[data-tip-body]');
  if (el) { const key = el.dataset.tipStat || el.dataset.tipAct || 'body'; if (tipFor === key && tipEl && !tipEl.hidden) return; showTip(el, tipHtmlFor(el)); tipFor = key; tipBy = 'hover'; }
});
document.addEventListener('mouseout', e => { if (!matchMedia('(hover: hover)').matches || tipBy === 'click') return; if (e.target.closest('[data-tip-stat],[data-tip-act],[data-tip-body]') && !(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('[data-tip-stat],[data-tip-act],[data-tip-body],.tip'))) hideTip(); });
let tipY = 0;
window.addEventListener('scroll', () => { if (tipEl && !tipEl.hidden && Math.abs(window.scrollY - tipY) > 80) hideTip(); }, { passive: true });
