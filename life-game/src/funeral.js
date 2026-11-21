/* ===== 장례식 장면: 화환이 양옆으로 들어오고, 가운데 영정에 웃는 얼굴이 떠오른다 ===== */
function wreathSenders(S,e){
  const L=[];
  const wed=S.f.has('기혼')&&!S.f.has('이혼'); const fam = S.kids? '자녀 일동' : (wed?'배우자':null);
  if(fam) L.push(fam);
  if(wed && S.kids) L.push('배우자');
  const cos=[...new Set((S.jobHist||[]).map(j=>j.co).filter(Boolean))];
  cos.filter(c=>!/개인 채널|귀농/.test(c)).forEach(c=>{ const nm=c.replace(/\s*\(.*?\)/g,''); L.push(/(청|본부|학교|부사관|복지관|요양원|사무소)$/.test(nm)? `${nm} 동료 일동` : `${nm} 임직원 일동`); });
  if(S.uni) L.push(`${S.uni} 동문회`);
  L.push(`${S.region.name.split(' ').slice(-1)[0]} ${pick(['휘람','겸솔','벼리','온담'])}고 동창회`);
  if(S.f.has('전우')) L.push('훈련소 동기 전우회');
  if(S.f.has('운동부')) L.push('학창 시절 운동부 동기');
  if(S.f.has('의리')) L.push('평생의 친구');
  if(S.titles.has('대통령 표창')) L.push('대통령실');
  if(S.h.hon>=25) L.push(`${S.region.name.split(' ').slice(-1)[0]}청장`);
  if(S.h.hon>=40) L.push('국회의원 사무실');
  if(S.s.인>=55) L.push('등산 동호회 일동');
  if(S.s.인>=70) L.push('동네 친구들');
  if(S.f.has('손주')) L.push('손주들');
  // 화환 수: 직장·학교·관계·명예·인맥이 많을수록 늘어난다
  const want = clamp(Math.round(1 + cos.length*1.5 + (S.uni?1:0) + S.kids + (S.f.has('기혼')?1:0) + S.s.인/18 + S.h.hon/10 + (e.mourners||0)/60), 1, 22);
  const extra=[...(cos.length?['옛 동료 일동','거래처 일동']:[]),'이웃 주민 일동','사촌 형제 일동',...(wed?[S.gender==='M'?'처가 일동':'시댁 일동']:[]),'교우회 일동',...(cos.length?['협력업체 대표']:[]),'조기축구회','동네 경로당'];
  let k=0; while(L.length<want && k<extra.length){ L.push(extra[k]); k++; }
  return L.slice(0,want);
}
function drawWreath(g,x,y,s,label,t){
  // 받침대
  g.strokeStyle='#7a6a55'; g.lineWidth=Math.max(1.5,s*.04); g.beginPath(); g.moveTo(x,y+s*.45); g.lineTo(x-s*.28,y+s*1.25); g.moveTo(x,y+s*.45); g.lineTo(x+s*.28,y+s*1.25); g.moveTo(x,y+s*.45); g.lineTo(x,y+s*1.25); g.stroke();
  // 국화 고리
  for(let i=0;i<22;i++){ const a=i/22*6.283, r=s*.42; g.fillStyle=i%5===0?'#f6e7a6':'#fbfbf7'; g.beginPath(); g.arc(x+Math.cos(a)*r, y+Math.sin(a)*r, s*.11, 0, 6.28); g.fill(); g.strokeStyle='rgba(0,0,0,.08)'; g.lineWidth=1; g.stroke(); }
  g.fillStyle='#2f6b3a'; g.beginPath(); g.arc(x,y,s*.27,0,6.28); g.fill();
  // 리본
  g.fillStyle='#f4f1e8'; g.fillRect(x-s*.07,y+s*.1,s*.14,s*.95); g.fillStyle='#222';
  g.save(); g.translate(x,y+s*.18); g.font=`${Math.max(7,s*.1)}px "Noto Sans KR",sans-serif`; g.textAlign='center';
  const txt=('근조 '+label).slice(0,14); for(let i=0;i<txt.length;i++) g.fillText(txt[i],0,i*Math.max(7,s*.1)*1.05); g.restore();
}
function drawPortrait(g,cx,cy,w,S,smile){
  // 단정한 영정 사진: 정장/한복 차림, 나이에 맞는 머리색, 미소가 서서히 번진다
  const f=S.gender==='F', old=S.age>=60, mid=S.age>=45;
  const hair=old?'#cfcac2':mid?'#4a4440':'#1e1a18', skin='#f1d3b8';
  const r=w*.2;
  g.fillStyle='#d9d3c6'; g.fillRect(cx-w/2,cy-w*.65,w,w*1.3);
  const bg=g.createRadialGradient(cx,cy-w*.1,w*.1,cx,cy,w*.8); bg.addColorStop(0,'#eeeae0'); bg.addColorStop(1,'#bdb6a8'); g.fillStyle=bg; g.fillRect(cx-w/2,cy-w*.65,w,w*1.3);
  // 어깨
  g.fillStyle=f?'#3a3540':'#22252b'; g.beginPath(); g.ellipse(cx,cy+w*.55,w*.42,w*.3,0,Math.PI,0); g.fill();
  if(!f){ g.fillStyle='#fff'; g.beginPath(); g.moveTo(cx-w*.08,cy+w*.27); g.lineTo(cx,cy+w*.42); g.lineTo(cx+w*.08,cy+w*.27); g.fill(); g.fillStyle='#5a1f24'; g.beginPath(); g.moveTo(cx-w*.02,cy+w*.3); g.lineTo(cx,cy+w*.45); g.lineTo(cx+w*.02,cy+w*.3); g.fill(); }
  else { g.fillStyle='#f4f1ea'; g.beginPath(); g.moveTo(cx-w*.1,cy+w*.27); g.lineTo(cx,cy+w*.38); g.lineTo(cx+w*.1,cy+w*.27); g.fill(); }
  // 목
  g.fillStyle=skin; g.fillRect(cx-r*.35,cy+r*.7,r*.7,r*.6);
  // 머리 뒤 (여성은 길게)
  g.fillStyle=hair; if(f){ g.beginPath(); g.ellipse(cx,cy+r*.2,r*1.18,r*1.35,0,0,6.28); g.fill(); }
  // 얼굴
  g.fillStyle=skin; g.beginPath(); g.ellipse(cx,cy,r*.92,r*1.08,0,0,6.28); g.fill();
  // 앞머리
  g.fillStyle=hair; g.beginPath(); g.ellipse(cx,cy-r*.68,r*.98,r*.5,0,Math.PI,0); g.fill();
  if(!f){ g.fillRect(cx-r*.95,cy-r*.7,r*.18,r*.5); g.fillRect(cx+r*.77,cy-r*.7,r*.18,r*.5); }
  // 볼
  g.fillStyle=`rgba(230,140,130,${.35*smile})`; g.beginPath(); g.arc(cx-r*.5,cy+r*.3,r*.16,0,6.28); g.arc(cx+r*.5,cy+r*.3,r*.16,0,6.28); g.fill();
  // 눈: 웃을수록 반달
  g.strokeStyle='#2a2420'; g.lineWidth=Math.max(1.5,r*.07); g.lineCap='round';
  [-1,1].forEach(sd=>{ const ex=cx+sd*r*.36, ey=cy-r*.05; g.beginPath(); g.arc(ex,ey+r*.06*smile,r*.13,Math.PI*(1+.15*smile),Math.PI*(2-.15*smile)); if(smile<.5){ g.moveTo(ex+r*.05,ey); g.arc(ex,ey,r*.05,0,6.28); } g.stroke(); });
  if(old){ g.lineWidth=1; g.strokeStyle='rgba(120,90,70,.4)'; [-1,1].forEach(sd=>{ g.beginPath(); g.moveTo(cx+sd*r*.55,cy-r*.05); g.lineTo(cx+sd*r*.66,cy+r*.02); g.stroke(); }); }
  // 입: 미소
  g.strokeStyle='#8a3a34'; g.lineWidth=Math.max(1.5,r*.07);
  g.beginPath(); g.arc(cx,cy+r*.3,r*(.18+.14*smile),Math.PI*(.15),Math.PI*(.85)); g.stroke();
}
function playFuneral(S,e,done){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const senders=wreathSenders(S,e); S.wreaths=senders;
  if(reduce){ done(); return; }
  const n=senders.length;
  // 화환이 많을수록 복도가 길어지고, 천천히 걸어 들어간다
  const Tw=clamp(3.2+n*.42, 4.5, 13), Tend=Tw+3.2;
  const ov=document.createElement('div'); ov.className='funeral';
  ov.innerHTML=`<canvas id="fcv"></canvas><div class="f-cap" style="animation-delay:${Tw.toFixed(1)}s"><b>故 ${esc(S.name)}</b><span>${S.birthYear} – ${S.birthYear+S.age} · 향년 ${S.age}세</span><span>화환 ${n}개 · 조문객 ${e.mourners}명</span></div><button class="btn ghost f-skip" id="fskip">건너뛰기</button>`;
  document.body.appendChild(ov);
  const cv=ov.querySelector('#fcv'), dpr=Math.min(2,window.devicePixelRatio||1);
  const W=window.innerWidth, H=window.innerHeight; cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+'px'; cv.style.height=H+'px';
  const g=cv.getContext('2d'); g.scale(dpr,dpr);
  // 3D 복도 (단위: m)  X=좌우, Y=높이, Z=앞으로
  const XC=W<H?1.45:1.9, EYE=1.6, CEIL=3.0, DZ=1.25, Z0=3;
  const pairs=Math.ceil(n/2), ZW=Z0+(pairs-1)*DZ+1.0, lastZ=ZW-1.0;
  const F=Math.min(W,H)*.95;
  const camStart=-1.2, camEnd=ZW-(W<H?4.2:3.9);
  // 가족·가까운 사람 화환이 영정 가까이에 선다
  const wr=senders.map((lab,i)=>({lab, side:i%2===0?-1:1, z:lastZ-Math.floor(i/2)*DZ}));
  let start=null, raf=null, finished=false;
  const finish=()=>{ if(finished) return; finished=true; cancelAnimationFrame(raf); ov.classList.add('out'); setTimeout(()=>{ ov.remove(); done(); },500); };
  ov.querySelector('#fskip').addEventListener('click',finish);
  const ease=x=>x<.5?2*x*x:1-Math.pow(-2*x+2,2)/2;
  const tick=ts=>{
    if(start==null) start=ts; const t=(ts-start)/1000;
    const w=clamp(t/Tw,0,1), cam=camStart+(camEnd-camStart)*ease(w);
    const walking=w>0&&w<1, bob=walking?Math.sin(t*7.5)*3.2*Math.sin(w*Math.PI):0, sway=walking?Math.sin(t*3.75)*2*Math.sin(w*Math.PI):0;
    const HY=H*.46+bob, CX=W/2+sway;
    const P=(x,y,z)=>{ const d=Math.max(.05,z-cam), k=F/d; return [CX+x*k, HY+(EYE-y)*k, k]; };
    const near=cam+.25;
    // 바닥·벽·천장
    g.fillStyle='#14120f'; g.fillRect(0,0,W,H);
    const quad=(pts,col)=>{ g.fillStyle=col; g.beginPath(); pts.forEach((q,i)=>i?g.lineTo(q[0],q[1]):g.moveTo(q[0],q[1])); g.closePath(); g.fill(); };
    quad([P(-XC,0,near),P(XC,0,near),P(XC,0,ZW),P(-XC,0,ZW)],'#4a4238');
    quad([P(-XC,CEIL,near),P(XC,CEIL,near),P(XC,CEIL,ZW),P(-XC,CEIL,ZW)],'#26231f');
    quad([P(-XC,0,near),P(-XC,CEIL,near),P(-XC,CEIL,ZW),P(-XC,0,ZW)],'#5b5246');
    quad([P(XC,0,near),P(XC,CEIL,near),P(XC,CEIL,ZW),P(XC,0,ZW)],'#5b5246');
    // 바닥 줄눈·벽 몰딩 (걷는 느낌)
    g.strokeStyle='rgba(0,0,0,.25)'; g.lineWidth=1;
    for(let z=Math.ceil(near);z<ZW;z+=1){ const a=P(-XC,0,z), b=P(XC,0,z); g.beginPath(); g.moveTo(a[0],a[1]); g.lineTo(b[0],b[1]); g.stroke(); }
    [[-XC,.9],[XC,.9]].forEach(([x,y])=>{ const a=P(x,y,near), b=P(x,y,ZW); g.strokeStyle='rgba(255,240,210,.12)'; g.beginPath(); g.moveTo(a[0],a[1]); g.lineTo(b[0],b[1]); g.stroke(); });
    // 천장 조명
    for(let z=1;z<ZW;z+=2.2){ if(z<cam+1.4) continue; const a=P(-.35,CEIL,z), b=P(.35,CEIL,z+.5); g.fillStyle='rgba(255,236,200,.75)'; g.fillRect(a[0],a[1],b[0]-a[0],Math.max(1,b[1]-a[1])); }
    // 정면 벽 · 제단 · 영정
    const wl=P(-XC,CEIL,ZW), wr2=P(XC,0,ZW); g.fillStyle='#e8e2d4'; g.fillRect(wl[0],wl[1],wr2[0]-wl[0],wr2[1]-wl[1]);
    const glow=g.createRadialGradient(CX,P(0,1.7,ZW)[1],2,CX,P(0,1.7,ZW)[1],(wr2[0]-wl[0])*.6); glow.addColorStop(0,'rgba(255,250,235,.6)'); glow.addColorStop(1,'rgba(255,250,235,0)'); g.fillStyle=glow; g.fillRect(wl[0],wl[1],wr2[0]-wl[0],wr2[1]-wl[1]);
    const k=P(0,0,ZW)[2];
    const fw=.66*k, fh=fw*1.3, fc=P(0,1.75,ZW-.05), fx=fc[0]-fw/2, fy=fc[1]-fh/2;
    // 제단 꽃장식
    const AW=W<H?.72:1.0; const al=P(-AW,1.05,ZW-.3), ar=P(AW,0,ZW-.3); g.fillStyle='#d8d0bc'; g.fillRect(al[0],al[1],ar[0]-al[0],ar[1]-al[1]);
    const fl=P(-1.05,1.12,ZW-.32)[2]; for(let i=0;i<15;i++){ const q=P(-AW+i*2*AW/14,1.1,ZW-.32); g.fillStyle=i%4===0?'#f6e7a6':'#fbfbf7'; g.beginPath(); g.arc(q[0],q[1],.08*fl,0,6.28); g.fill(); }
    for(let i=0;i<3;i++){ const q=P(-.12+i*.12,1.1,ZW-.5), q2=P(-.12+i*.12,1.3,ZW-.5); g.strokeStyle='#8a6a3a'; g.lineWidth=Math.max(1,.012*q[2]); g.beginPath(); g.moveTo(q[0],q[1]); g.lineTo(q2[0],q2[1]); g.stroke(); for(let j=0;j<4;j++){ g.fillStyle=`rgba(225,225,225,${.22-j*.05})`; g.beginPath(); g.arc(q2[0]+Math.sin(t*2+j+i)*.03*q[2], q2[1]-(j*.12+((t*.25)%.12))*q[2], (.02+j*.012)*q[2],0,6.28); g.fill(); } }
    g.fillStyle='#111'; g.fillRect(fx-fw*.05,fy-fw*.05,fw*1.1,fh+fw*.1); g.fillStyle='#f3efe6'; g.fillRect(fx,fy,fw,fh);
    const fa=clamp((w-.55)/.35,0,1);  // 가까이 갈수록 사진이 또렷해진다
    g.save(); g.beginPath(); g.rect(fx,fy,fw,fh); g.clip(); g.globalAlpha=fa; drawPortrait(g,fc[0],fc[1]+fh*.02,fw,S,clamp((t-Tw+.3)/1.6,0,1)); g.restore();
    const rb=fw*.08, rl=fw*.38, o=fw*.05; g.strokeStyle='#0b0b0b'; g.lineWidth=rb; g.lineCap='butt';
    g.beginPath(); g.moveTo(fx-o,fy-o+rl); g.lineTo(fx-o+rl,fy-o); g.moveTo(fx+fw+o,fy-o+rl); g.lineTo(fx+fw+o-rl,fy-o); g.stroke();
    // 화환: 먼 것부터 그린다
    const tags=[];
    wr.filter(r=>r.z>near).sort((a,b)=>b.z-a.z).forEach(r=>{ const q=P(r.side*(XC-.36),1.0,r.z); const sz=.62*q[2]; drawWreath(g,q[0],q[1],sz,r.lab,t); tags.push([q[0],q[1],sz,r.lab]); });
    // 리본 글씨는 작아서 안 보이므로, 가까운 화환마다 가로 이름표를 띄운다
    tags.forEach(([x,y,sz,lab])=>{ const a=clamp((sz-38)/40,0,1)*clamp((Math.min(W,H)*1.1-sz)/(Math.min(W,H)*.4),0,1); if(a<=0) return;
      const fs=clamp(sz*.15,11,17); g.save(); g.globalAlpha=a; g.font=`600 ${fs}px "Noto Sans KR",sans-serif`; g.textAlign='center'; g.textBaseline='middle';
      const txt='근조 · '+lab, tw=g.measureText(txt).width, ty=y+sz*.66, bw=tw+fs*1.1, bh=fs*1.7;
      const tx=clamp(x, bw/2+4, W-bw/2-4);
      g.fillStyle='rgba(20,18,15,.82)'; g.beginPath(); if(g.roundRect) g.roundRect(tx-bw/2,ty-bh/2,bw,bh,6); else g.rect(tx-bw/2,ty-bh/2,bw,bh); g.fill();
      g.strokeStyle='rgba(255,240,210,.35)'; g.lineWidth=1; g.stroke(); g.fillStyle='#f5efe2'; g.fillText(txt,tx,ty+1); g.restore(); });
    // 비네트 + 입장 페이드
    const vg=g.createRadialGradient(W/2,H/2,Math.min(W,H)*.3,W/2,H/2,Math.max(W,H)*.75); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(0,0,0,.55)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
    const fin=clamp(1-t/1.1,0,1); if(fin>0){ g.fillStyle=`rgba(0,0,0,${fin})`; g.fillRect(0,0,W,H); }
    if(t<Tend && !finished) raf=requestAnimationFrame(tick); else finish();
  };
  raf=requestAnimationFrame(tick);
}
