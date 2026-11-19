/* ===== 소득 기록: 연봉 · 평생 연평균 소득 ===== */
function takeHomeRate(sal){ return sal<=2400?.09: sal<=4000?.12: sal<=6000?.15: sal<=10000?.2: .27; } // 4대보험+소득세 대략
function netMonthly(sal){ return sal*(1-takeHomeRate(sal))/12; }
const _ytInc = yearTick;
yearTick = function(S,ms){
  if(S.job && S.job.sal>0){ S.incSum=(S.incSum||0)+S.job.sal; S.incYears=(S.incYears||0)+1; S.incPeak=Math.max(S.incPeak||0,S.job.sal); }
  _ytInc(S,ms);
};
function avgIncome(S){ return S.incYears? S.incSum/S.incYears : 0; }
