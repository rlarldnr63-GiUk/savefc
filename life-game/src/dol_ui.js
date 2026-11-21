/* ===== 돌잡이 애니메이션: 아기가 돌상 앞을 기어 다니다 하나를 잡는다 ===== */
function playDol(S, itemK, lucky, done){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){ done(); return; }
  const it=DOLM[itemK];
  const ov=document.createElement('div'); ov.className='funeral dolov';
  ov.innerHTML=`<canvas></canvas><div class="dol-cap" id="dolcap"></div><button class="btn ghost f-skip" id="dskip">건너뛰기</button>`;
  document.body.appendChild(ov);
  const cv=ov.querySelector('canvas'), dpr=Math.min(2,window.devicePixelRatio||1);
  const W=window.innerWidth, H=window.innerHeight; cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+'px'; cv.style.height=H+'px';
  const g=cv.getContext('2d'); g.scale(dpr,dpr);
  const M=Math.min(W,H), EM='"Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",serif';
  // 돌상과 물건 배치
  const tw=Math.min(W*.92, M*1.15), tx=W/2-tw/2, ty=H*.44, th=H*.1;
  const order=[...DOL].sort(()=>R()-.5);
  const items=order.map((x,i)=>({...x, x:tx+tw*(i+.5)/order.length, y:ty+th*.35+(i%2)*th*.25}));
  const target=items.find(x=>x.k===itemK);
  const decoys=items.filter(x=>x.k!==itemK).sort(()=>R()-.5).slice(0,2);
  const reachY=ty+th+M*.09;
  const path=[{x:W/2,y:H*.95,t:0},{x:decoys[0].x,y:reachY,t:1.6},{x:decoys[0].x,y:reachY,t:2.2},{x:decoys[1].x,y:reachY,t:3.3},{x:decoys[1].x,y:reachY,t:3.9},{x:target.x,y:reachY,t:5.0}];
  const T0=.6, tGrab=T0+5.0, tEnd=tGrab+(lucky?4.2:3.4);
  const fam=['👵','👴','👩','👨','🧑','👧'];
  const shouts=['이쪽이야!','연필 잡아!','돈 잡아라!','까꿍!','공 잡자~','마이크!'];
  const conf=[]; if(lucky) for(let i=0;i<140;i++) conf.push({x:R()*W, y:-R()*H, vy:60+R()*120, vx:(R()-.5)*60, r:R()*6.28, c:['#e8b44a','#d94f4f','#4f8bd9','#5bb86b','#ffffff'][i%5]});
  let start=null, raf=null, finished=false, capShown=false;
  const finish=()=>{ if(finished) return; finished=true; cancelAnimationFrame(raf); ov.classList.add('out'); setTimeout(()=>{ ov.remove(); done(); },450); };
  ov.querySelector('#dskip').addEventListener('click',finish);
  const lerp=(a,b,k)=>a+(b-a)*k, ease=k=>k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;
  const babyAt=t=>{ const u=t-T0; if(u<=0) return {...path[0], moving:false}; for(let i=1;i<path.length;i++){ if(u<=path[i].t){ const a=path[i-1], b=path[i], k=ease((u-a.t)/(b.t-a.t)); return {x:lerp(a.x,b.x,k), y:lerp(a.y,b.y,k), moving:a.x!==b.x||a.y!==b.y}; } } return {...path[path.length-1], moving:false}; };
  const emoji=(ch,x,y,size,rot=0,alpha=1)=>{ g.save(); g.globalAlpha=alpha; g.translate(x,y); g.rotate(rot); g.font=`${size}px ${EM}`; g.textAlign='center'; g.textBaseline='middle'; g.fillStyle='#000'; g.fillText(ch,0,0); g.restore(); };
  const tick=ts=>{
    if(start==null) start=ts; const t=(ts-start)/1000;
    // 방
    const bg=g.createLinearGradient(0,0,0,H); bg.addColorStop(0,'#f6e6c8'); bg.addColorStop(.55,'#efd6ac'); bg.addColorStop(.56,'#c9a170'); bg.addColorStop(1,'#b88d5e'); g.fillStyle=bg; g.fillRect(0,0,W,H);
    // 병풍
    const sw=Math.min(W*.9,M*1.2), sx=W/2-sw/2; for(let i=0;i<6;i++){ g.fillStyle=i%2?'#f3e3c0':'#f8ecd2'; g.fillRect(sx+i*sw/6,H*.06,sw/6,H*.3); g.strokeStyle='#8a5a2b'; g.lineWidth=2; g.strokeRect(sx+i*sw/6,H*.06,sw/6,H*.3); emoji(['🌸','🦢','🌕','🏔️','🌲','🦌'][i], sx+(i+.5)*sw/6, H*.17, M*.06, 0, .55); }
    // 현수막
    g.fillStyle='#c0392b'; g.fillRect(W/2-M*.32,H*.07,M*.64,M*.08); g.fillStyle='#fff3d6'; g.font=`700 ${M*.045}px "Noto Serif KR","Noto Sans KR",serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(`${S.name} 첫 돌 축하해`, W/2, H*.07+M*.04);
    // 가족
    fam.forEach((f,i)=>{ const fx=W*(.12+i*.152), fy=H*.33+Math.sin(t*3+i)*2; emoji(f,fx,fy,M*.085); if(t<tGrab && t>T0+.4 && Math.floor((t*1.2+i*.7))%3===0){ g.font=`600 ${M*.03}px "Noto Sans KR",sans-serif`; const s=shouts[i], w=g.measureText(s).width+12; g.fillStyle='rgba(255,255,255,.92)'; g.fillRect(fx-w/2,fy-M*.1,w,M*.045); g.fillStyle='#333'; g.fillText(s,fx,fy-M*.077); } });
    // 돌상
    g.fillStyle='#8e2a22'; g.fillRect(tx,ty,tw,th); g.fillStyle='#b8352a'; g.fillRect(tx,ty,tw,th*.25); g.fillStyle='#e0b04a'; g.fillRect(tx,ty+th*.92,tw,th*.08);
    g.fillStyle='#6d1f19'; g.fillRect(tx+tw*.04,ty+th,tw*.05,th*.7); g.fillRect(tx+tw*.91,ty+th,tw*.05,th*.7);
    // 떡·과일
    emoji('🍡',tx+tw*.06,ty-M*.02,M*.05); emoji('🍎',tx+tw*.94,ty-M*.02,M*.05);
    // 물건
    items.forEach(x=>{ if(x===target && t>=tGrab) return; const near=Math.abs(babyAt(t).x-x.x)<M*.05 && t>T0; emoji(x.e, x.x, x.y + (near?-Math.abs(Math.sin(t*8))*4:0), M*.07*(near?1.15:1)); g.font=`600 ${M*.026}px "Noto Sans KR",sans-serif`; g.fillStyle='#fff3d6'; g.fillText(x.k, x.x, ty+th*.86); });
    // 아기 (색동 저고리)
    const b=babyAt(t), bob=b.moving? Math.sin(t*14)*M*.012 : 0, bs=M*.13;
    g.save(); g.translate(b.x,b.y+bob); const cols=['#e74c3c','#f1c40f','#2ecc71','#3498db','#9b59b6']; cols.forEach((c,i)=>{ g.fillStyle=c; g.fillRect(-bs*.36+i*bs*.144, bs*.12, bs*.144, bs*.34); }); g.restore();
    emoji('👶', b.x, b.y+bob, bs);
    // 잡은 물건
    if(t>=tGrab){ const k=clamp((t-tGrab)/.8,0,1), e=1-Math.pow(1-k,3);
      const gx=b.x, gy=lerp(target.y, b.y-bs*.95, e);
      const glow=g.createRadialGradient(gx,gy,2,gx,gy,M*.16); glow.addColorStop(0, lucky?'rgba(255,215,90,.9)':'rgba(255,255,255,.8)'); glow.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=glow; g.beginPath(); g.arc(gx,gy,M*.16,0,6.28); g.fill();
      emoji(target.e, gx, gy, M*(.08+.05*e), Math.sin(t*6)*.15*e);
      if(lucky && t-tGrab<.35){ g.fillStyle=`rgba(255,230,140,${.6*(1-(t-tGrab)/.35)})`; g.fillRect(0,0,W,H); }
      if(!capShown && k>=1){ capShown=true; const cap=ov.querySelector('#dolcap');
        cap.innerHTML=`${lucky?'<div class="dol-luck">운명의 돌잡이!</div>':''}<b>${target.e} ${target.k}</b><span>${target.spoon}를 물었다</span><small>${Object.entries(target.tr).map(([tt,v])=>`${tt} +${Math.round(v*(lucky?1.8:1))}`).join(' · ')}${lucky?' · 꿈과 같은 쪽!':''}</small>`; cap.classList.add('on'); }
    }
    // 꽃가루
    if(lucky && t>=tGrab){ const dt=1/60; conf.forEach(p=>{ p.y+=p.vy*dt; p.x+=p.vx*dt; p.r+=.1; g.save(); g.translate(p.x,p.y); g.rotate(p.r); g.fillStyle=p.c; g.fillRect(-4,-2,8,4); g.restore(); }); }
    const fin=clamp(1-t/.6,0,1); if(fin>0){ g.fillStyle=`rgba(0,0,0,${fin})`; g.fillRect(0,0,W,H); }
    if(t<tEnd && !finished) raf=requestAnimationFrame(tick); else finish();
  };
  raf=requestAnimationFrame(tick);
}
