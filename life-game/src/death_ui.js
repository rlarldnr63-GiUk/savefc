/* ===== 마지막 순간: 사인별 짧은 장면 (돌잡이와 같은 일러스트 화풍) =====
   잔인한 묘사 없이, 조용히 끝나는 느낌으로. 끝나면 장례식장으로 이어진다. */
function deathKind(c){ c=c||'';
  if(/교통|오토바이|음주운전|배달/.test(c)) return 'road';
  if(/과로/.test(c)) return 'work';
  if(/급성 심장마비|심근경색|뇌출혈/.test(c)) return 'bench';
  if(/낙뢰|조난|항공기|선로|전쟁|불의의/.test(c)) return 'sky';
  return 'bed';
}
function playDeath(S, done){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){ done(); return; }
  const P=DOL_PAL, kind=deathKind(S.cause), old=S.age>=60, F=S.gender==='F';
  const ov=document.createElement('div'); ov.className='funeral deathov';
  ov.innerHTML=`<canvas></canvas><div class="death-cap" id="dcap"><b>${S.year}년 · ${S.age}세</b><span>${esc(S.cause||'노환')}</span></div><button class="btn ghost f-skip" id="dskip2">건너뛰기</button>`;
  document.body.appendChild(ov);
  const cv=ov.querySelector('canvas'), dpr=Math.min(2,window.devicePixelRatio||1);
  const W=window.innerWidth, H=window.innerHeight; cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+'px'; cv.style.height=H+'px';
  const g=cv.getContext('2d'); const M=Math.min(W,H);
  const hair=old?'#d6d1c8':P.hair, coat=F?'#7d6a8f':'#4b5a6b';
  const TOT=6.2; let start=null, raf=null, finished=false;
  const finish=()=>{ if(finished) return; finished=true; cancelAnimationFrame(raf); ov.classList.add('out'); setTimeout(()=>{ ov.remove(); done(); },500); };
  ov.querySelector('#dskip2').addEventListener('click',finish);
  const lerp=(a,b,k)=>a+(b-a)*k, ease=k=>1-Math.pow(1-k,3);
  const ink=(w)=>{ g.strokeStyle=P.ink; g.lineWidth=w||Math.max(1.2,M*.004); };
  // 누운 사람
  const lying=(x,y,s,breath,closed)=>{ g.fillStyle='#f3efe6'; dolRR(g,x-s*.9,y-s*.12,s*.55,s*.22,s*.08); g.fill(); ink(); g.stroke();
    g.fillStyle=P.skin; g.beginPath(); g.arc(x-s*.62,y-s*.14,s*.15,0,6.28); g.fill(); ink(); g.stroke();
    g.fillStyle=hair; g.beginPath(); g.arc(x-s*.66,y-s*.18,s*.15,Math.PI*.9,Math.PI*1.9); g.fill();
    ink(); g.beginPath(); if(closed){ g.arc(x-s*.57,y-s*.14,s*.03,Math.PI*.1,Math.PI*.9); } else { g.arc(x-s*.57,y-s*.15,s*.018,0,6.28); } g.stroke();
    g.fillStyle='#b9c9dc'; g.beginPath(); g.moveTo(x-s*.45,y-s*.05-breath*s*.02); g.quadraticCurveTo(x,y-s*.16-breath*s*.03,x+s*.75,y-s*.06); g.lineTo(x+s*.75,y+s*.14); g.lineTo(x-s*.45,y+s*.14); g.closePath(); g.fill(); ink(); g.stroke(); };
  const vignette=(a)=>{ const vg=g.createRadialGradient(W/2,H/2,M*.25,W/2,H/2,Math.max(W,H)*.75); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,`rgba(10,8,6,${a})`); g.fillStyle=vg; g.fillRect(0,0,W,H); };
  const tick=ts=>{
    if(start==null) start=ts; const t=(ts-start)/1000;
    g.setTransform(dpr,0,0,dpr,0,0);
    if(kind==='bed'){
      // 밤의 병실: 창밖 달, 심전도가 느려지다 멈춘다, 가족이 손을 잡고 있다
      g.fillStyle='#2b3347'; g.fillRect(0,0,W,H); g.fillStyle='#39425a'; g.fillRect(0,H*.62,W,H*.38);
      const wx=W*.62, wy=H*.12, ww=M*.42, wh=M*.34; g.fillStyle='#1b2236'; g.fillRect(wx,wy,ww,wh); g.fillStyle='#f4eccf'; g.beginPath(); g.arc(wx+ww*.7,wy+wh*.3,M*.045,0,6.28); g.fill(); ink(3); g.strokeRect(wx,wy,ww,wh); g.beginPath(); g.moveTo(wx+ww/2,wy); g.lineTo(wx+ww/2,wy+wh); g.stroke();
      g.fillStyle='rgba(244,236,207,.08)'; g.beginPath(); g.moveTo(wx,wy+wh); g.lineTo(wx+ww,wy+wh); g.lineTo(W*.5,H); g.lineTo(W*.1,H); g.closePath(); g.fill();
      // 침대
      const bs=Math.min(M*.62, W*.5), bx=W*.5+bs*.05, by=H*.66;
      g.fillStyle='#d9dde4'; dolRR(g,bx-bs*.95,by-bs*.05,bs*1.8,bs*.25,8); g.fill(); ink(); g.stroke(); g.fillStyle='#8c96a8'; g.fillRect(bx-bs*.9,by+bs*.2,bs*.04,bs*.22); g.fillRect(bx+bs*.8,by+bs*.2,bs*.04,bs*.22);
      const beat=Math.max(0,1-t/4.2); lying(bx,by,bs,Math.sin(t*2.2)*beat,t>3.6);
      // 가족 (흐리게, 손을 잡고)
      g.save(); if('filter' in g) g.filter='blur(1.2px)'; dolPerson(g,bx+bs*.15,by+bs*.12,M*.24,'#6f7c8f',0,!old,true); g.restore();
      // 심전도
      const mx=W*.1, my=H*.18, mw=M*.42, mh=M*.2; g.fillStyle='#111821'; dolRR(g,mx,my,mw,mh,8); g.fill(); ink(3); g.stroke();
      g.strokeStyle='#5fe08a'; g.lineWidth=2; g.beginPath(); for(let i=0;i<=80;i++){ const xx=mx+mw*.05+mw*.9*i/80; const ph=(i/80*3 - t*1.2*Math.max(.25,beat)); const f=ph-Math.floor(ph); const live=t<4.2; const spike=live && f>.45 && f<.55 ? Math.sin((f-.45)/.1*Math.PI)*mh*.32*Math.max(.3,beat) : 0; const yy=my+mh*.55-spike; i?g.lineTo(xx,yy):g.moveTo(xx,yy); } g.stroke();
      if(t>4.2){ g.fillStyle=`rgba(95,224,138,${.5+.5*Math.sin(t*6)})`; g.font=`700 ${M*.03}px "Noto Sans KR",sans-serif`; g.textAlign='center'; g.fillText('—', mx+mw*.9, my+mh*.25); }
      // 따뜻한 빛이 창으로 올라간다
      if(t>4.4){ const k=ease(clamp((t-4.4)/1.6,0,1)); const ox=lerp(bx-bs*.62,wx+ww*.7,k), oy=lerp(by-bs*.2,wy+wh*.3,k); const rg=g.createRadialGradient(ox,oy,1,ox,oy,M*.06); rg.addColorStop(0,`rgba(255,236,180,${.9*(1-k*.6)})`); rg.addColorStop(1,'rgba(255,236,180,0)'); g.fillStyle=rg; g.beginPath(); g.arc(ox,oy,M*.06,0,6.28); g.fill(); }
      vignette(.55);
    } else if(kind==='road'){
      // 밤길: 전조등이 다가오고, 하얗게 번쩍인 뒤 조용해진다
      g.fillStyle='#151a26'; g.fillRect(0,0,W,H); g.fillStyle='#232a38'; g.beginPath(); g.moveTo(W*.42,H*.38); g.lineTo(W*.58,H*.38); g.lineTo(W*1.1,H); g.lineTo(-W*.1,H); g.closePath(); g.fill();
      for(let i=0;i<8;i++){ const k=((i/8)+t*.5)%1, y=H*.38+(H*.62)*k*k, w=M*.006+k*M*.02; g.fillStyle='rgba(240,220,140,.6)'; g.fillRect(W/2-w/2,y,w,M*.01+k*M*.06); }
      for(let i=0;i<4;i++){ const k=((i/4)+t*.25)%1, y=H*.38+(H*.62)*k*k, x=W/2+(W*.08+W*.55*k*k)*(i%2?1:-1); g.fillStyle='#3a4254'; g.fillRect(x-2,y-M*.25*k,4,M*.25*k); g.fillStyle='rgba(255,220,150,.5)'; g.beginPath(); g.arc(x,y-M*.25*k,M*.02*k+1,0,6.28); g.fill(); }
      const hl=clamp((t-1)/2.2,0,1); if(t<3.4){ const lx=W*.62, ly=H*.42+hl*H*.15; const rg=g.createRadialGradient(lx,ly,2,lx,ly,M*(.05+hl*.6)); rg.addColorStop(0,'rgba(255,250,220,.95)'); rg.addColorStop(1,'rgba(255,250,220,0)'); g.fillStyle=rg; g.fillRect(0,0,W,H); }
      // 오토바이 뒷모습
      if(t<3.4){ const sx=W*.48, sy=H*.8; g.fillStyle='#222'; dolRR(g,sx-M*.025,sy-M*.02,M*.05,M*.12,M*.02); g.fill(); g.fillStyle='#c0392b'; g.fillRect(sx-M*.02,sy-M*.03,M*.04,M*.015); g.fillStyle=coat; dolRR(g,sx-M*.06,sy-M*.16,M*.12,M*.12,M*.04); g.fill(); ink(); g.stroke(); g.fillStyle='#e9e9e9'; g.beginPath(); g.arc(sx,sy-M*.19,M*.045,0,6.28); g.fill(); ink(); g.stroke(); }
      if(t>=3.4 && t<3.8){ g.fillStyle=`rgba(255,255,255,${1-(t-3.4)/.4})`; g.fillRect(0,0,W,H); }
      if(t>=3.8){ g.fillStyle='rgba(0,0,0,.35)'; g.fillRect(0,0,W,H); const k=clamp((t-3.8)/2,0,1); g.save(); g.translate(W*.56,H*.78); g.rotate(t*(6*(1-k))); ink(3); g.beginPath(); g.arc(0,0,M*.05,0,6.28); g.stroke(); for(let i=0;i<6;i++){ g.rotate(Math.PI/3); g.beginPath(); g.moveTo(0,0); g.lineTo(M*.05,0); g.stroke(); } g.restore(); }
      vignette(.6);
    } else if(kind==='work'){
      // 밤늦은 사무실: 모니터 불빛, 고개가 천천히 책상으로
      g.fillStyle='#1d2330'; g.fillRect(0,0,W,H); for(let i=0;i<6;i++){ g.fillStyle=`rgba(255,230,160,${(i%3?.15:.3)})`; g.fillRect(W*(.08+i*.15),H*.12,W*.04,H*.05); }
      g.fillStyle='#5b4632'; g.fillRect(W*.15,H*.62,W*.7,H*.05); ink(); g.strokeRect(W*.15,H*.62,W*.7,H*.05);
      const mx=W*.55, my=H*.4; g.fillStyle='#2a3140'; dolRR(g,mx-M*.16,my-M*.12,M*.32,M*.22,6); g.fill(); ink(); g.stroke(); g.fillStyle='#bfe0ff'; g.fillRect(mx-M*.14,my-M*.1,M*.28,M*.18); if(Math.floor(t*2)%2) { g.fillStyle='#2a3140'; g.fillRect(mx-M*.1,my+M*.05,M*.02,M*.01); }
      const glow=g.createRadialGradient(mx,my,5,mx,my,M*.6); glow.addColorStop(0,'rgba(170,210,255,.25)'); glow.addColorStop(1,'rgba(170,210,255,0)'); g.fillStyle=glow; g.fillRect(0,0,W,H);
      for(let i=0;i<5;i++){ g.fillStyle='#f4f1e8'; g.fillRect(W*.2+i*3,H*.6-i*M*.012,M*.14,M*.01); ink(1); g.strokeRect(W*.2+i*3,H*.6-i*M*.012,M*.14,M*.01); }
      const k=ease(clamp((t-1.5)/2.5,0,1)); g.save(); g.translate(W*.4,H*.62); g.fillStyle=coat; dolRR(g,-M*.1,-M*.2,M*.2,M*.22,M*.06); g.fill(); ink(); g.stroke();
      g.translate(0,-M*.22); g.rotate(k*1.1); g.fillStyle=P.skin; g.beginPath(); g.arc(M*.02,-M*.04*(1-k),M*.07,0,6.28); g.fill(); ink(); g.stroke(); g.fillStyle=hair; g.beginPath(); g.arc(M*.02,-M*.06*(1-k),M*.07,Math.PI*1.0,Math.PI*1.95); g.fill(); g.restore();
      g.fillStyle='#f4f1e8'; g.font=`600 ${M*.03}px "Noto Sans KR",sans-serif`; g.textAlign='center'; g.fillText(`${String(2+Math.floor(t)).padStart(2,'0')}:${String(Math.floor(t*7)%60).padStart(2,'0')} AM`, W*.82, H*.3);
      vignette(.6);
    } else if(kind==='bench'){
      // 해질녘 공원 벤치: 낙엽이 지고 눈이 감긴다
      const sk=g.createLinearGradient(0,0,0,H*.7); sk.addColorStop(0,'#f2b27a'); sk.addColorStop(1,'#f6dcb0'); g.fillStyle=sk; g.fillRect(0,0,W,H);
      const sunY=H*.42+t*H*.04; g.fillStyle='#ffdf9e'; g.beginPath(); g.arc(W*.7,sunY,M*.09,0,6.28); g.fill();
      g.fillStyle='#7aa36a'; g.fillRect(0,H*.62,W,H*.38); g.fillStyle='#6a9160'; g.beginPath(); g.ellipse(W*.15,H*.62,W*.3,M*.08,0,Math.PI,0); g.fill();
      g.fillStyle='#8a5a34'; g.fillRect(W*.32,H*.62,W*.36,M*.03); g.fillRect(W*.32,H*.55,W*.36,M*.03); g.fillRect(W*.34,H*.62,M*.02,M*.08); g.fillRect(W*.64,H*.62,M*.02,M*.08); ink(); g.strokeRect(W*.32,H*.55,W*.36,M*.03); g.strokeRect(W*.32,H*.62,W*.36,M*.03);
      const k=ease(clamp((t-2)/2.5,0,1)); g.save(); g.translate(W*.5,H*.61); g.rotate(k*.25); dolPerson(g,0,-M*.05,M*.26,coat,0,old); g.restore();
      for(let i=0;i<14;i++){ const lx=(i*97%100)/100*W + Math.sin(t*1.5+i)*M*.05, ly=((t*.12+i*.071)%1)*H; g.save(); g.translate(lx,ly); g.rotate(t*2+i); g.fillStyle=['#d9783b','#e9a23b','#b8562e'][i%3]; g.beginPath(); g.ellipse(0,0,M*.014,M*.007,0,0,6.28); g.fill(); g.restore(); }
      g.fillStyle=`rgba(30,20,40,${clamp((t-3)/3,0,.55)})`; g.fillRect(0,0,W,H);
      vignette(.45);
    } else {
      // 밤하늘: 별 하나가 밝게 빛났다가 떨어진다
      g.fillStyle='#0e1424'; g.fillRect(0,0,W,H);
      for(let i=0;i<90;i++){ const x=(i*137%1000)/1000*W, y=(i*71%1000)/1000*H*.8; g.fillStyle=`rgba(255,255,255,${.3+.4*Math.abs(Math.sin(t*1.5+i))})`; g.fillRect(x,y,1.6,1.6); }
      g.fillStyle='#1b2235'; g.beginPath(); g.moveTo(0,H*.8); g.quadraticCurveTo(W*.3,H*.65,W*.55,H*.78); g.quadraticCurveTo(W*.8,H*.68,W,H*.76); g.lineTo(W,H); g.lineTo(0,H); g.closePath(); g.fill();
      const k=clamp((t-2.2)/1.6,0,1), sx=W*.6-k*W*.35, sy=H*.25+k*H*.35, br=t<2.2? .6+.4*Math.sin(t*3) : 1-k;
      if(k>0){ g.strokeStyle=`rgba(255,240,200,${.6*(1-k)})`; g.lineWidth=2; g.beginPath(); g.moveTo(W*.6,H*.25); g.lineTo(sx,sy); g.stroke(); }
      const rg=g.createRadialGradient(sx,sy,1,sx,sy,M*.05); rg.addColorStop(0,`rgba(255,244,210,${br})`); rg.addColorStop(1,'rgba(255,244,210,0)'); g.fillStyle=rg; g.beginPath(); g.arc(sx,sy,M*.05,0,6.28); g.fill();
      vignette(.5);
    }
    // 끝: 천천히 어두워진다
    const fo=clamp((t-(TOT-1.4))/1.4,0,1); if(fo>0){ g.fillStyle=`rgba(0,0,0,${fo})`; g.fillRect(0,0,W,H); }
    const fi=clamp(1-t/.6,0,1); if(fi>0){ g.fillStyle=`rgba(0,0,0,${fi})`; g.fillRect(0,0,W,H); }
    if(t<TOT && !finished) raf=requestAnimationFrame(tick); else finish();
  };
  raf=requestAnimationFrame(tick);
}
