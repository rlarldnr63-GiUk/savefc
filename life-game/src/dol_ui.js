/* ===== 돌잡이 애니메이션 (일러스트 버전) =====
   - 이모지 없이 한 화풍으로 직접 그린다: 벽·병풍·돌상·가족·아기·물건
   - 연출 원칙: 감속 곡선, 기어갈 때 몸이 눌렸다 늘어나는 탄력, 잡기 전 웅크림(예비 동작),
     카메라가 아기를 따라가며 마지막에 줌인, 뒤쪽 가족은 흐리게(깊이감), 잡는 순간 반짝임·가벼운 흔들림 */
const DOL_PAL = {wall1:'#f4e7cf', wall2:'#ead7b5', floor1:'#c99a66', floor2:'#bb8b58', ink:'#3a2a1c', red:'#b8322a', red2:'#8f231d', gold:'#e2b34a', skin:'#f6d5bb', hair:'#3b2a20'};
function dolRR(g,x,y,w,h,r){ g.beginPath(); g.moveTo(x+r,y); g.arcTo(x+w,y,x+w,y+h,r); g.arcTo(x+w,y+h,x,y+h,r); g.arcTo(x,y+h,x,y,r); g.arcTo(x,y,x+w,y,r); g.closePath(); }
function dolItem(g,k,x,y,s){
  g.save(); g.translate(x,y); g.lineCap='round'; g.lineJoin='round';
  g.fillStyle='rgba(60,30,10,.18)'; g.beginPath(); g.ellipse(0,s*.42,s*.42,s*.1,0,0,6.28); g.fill();
  const o=DOL_PAL.ink; g.strokeStyle=o; g.lineWidth=Math.max(1.2,s*.05);
  if(k==='연필'){ g.rotate(-.5); g.fillStyle='#f2c230'; g.fillRect(-s*.09,-s*.38,s*.18,s*.58); g.strokeRect(-s*.09,-s*.38,s*.18,s*.58); g.fillStyle='#f3d9b5'; g.beginPath(); g.moveTo(-s*.09,s*.2); g.lineTo(s*.09,s*.2); g.lineTo(0,s*.38); g.closePath(); g.fill(); g.stroke(); g.fillStyle=o; g.beginPath(); g.moveTo(-s*.03,s*.31); g.lineTo(s*.03,s*.31); g.lineTo(0,s*.38); g.fill(); g.fillStyle='#e88a9a'; g.fillRect(-s*.09,-s*.46,s*.18,s*.08); g.strokeRect(-s*.09,-s*.46,s*.18,s*.08); }
  else if(k==='청진기'){ g.strokeStyle='#4a5560'; g.lineWidth=s*.07; g.beginPath(); g.moveTo(-s*.22,-s*.36); g.quadraticCurveTo(-s*.3,s*.05,0,s*.08); g.quadraticCurveTo(s*.3,s*.05,s*.22,-s*.36); g.stroke(); g.beginPath(); g.moveTo(0,s*.08); g.quadraticCurveTo(s*.05,s*.22,s*.18,s*.24); g.stroke(); g.fillStyle='#c9d3db'; g.beginPath(); g.arc(s*.24,s*.24,s*.11,0,6.28); g.fill(); g.lineWidth=Math.max(1.2,s*.04); g.strokeStyle=o; g.stroke(); }
  else if(k==='마우스'){ g.strokeStyle='#5a5a5a'; g.lineWidth=s*.035; g.beginPath(); g.moveTo(0,-s*.2); g.bezierCurveTo(0,-s*.45,s*.3,-s*.3,s*.35,-s*.45); g.stroke(); g.fillStyle='#f0f0f0'; g.strokeStyle=o; g.lineWidth=Math.max(1.2,s*.05); dolRR(g,-s*.17,-s*.22,s*.34,s*.5,s*.16); g.fill(); g.stroke(); g.beginPath(); g.moveTo(0,-s*.22); g.lineTo(0,-s*.02); g.stroke(); }
  else if(k==='공'){ g.fillStyle='#fff'; g.beginPath(); g.arc(0,0,s*.3,0,6.28); g.fill(); g.stroke(); g.fillStyle=o; const pent=(cx,cy,r)=>{ g.beginPath(); for(let i=0;i<5;i++){ const a=-1.57+i*1.2566; g.lineTo(cx+Math.cos(a)*r, cy+Math.sin(a)*r); } g.closePath(); g.fill(); }; pent(0,0,s*.1); [[0,-1],[.95,-.3],[.6,.8],[-.6,.8],[-.95,-.3]].forEach(([a,b])=>{ g.save(); g.beginPath(); g.arc(0,0,s*.3,0,6.28); g.clip(); pent(a*s*.28,b*s*.28,s*.08); g.restore(); }); }
  else if(k==='붓'){ g.rotate(.55); g.fillStyle='#b07a42'; g.fillRect(-s*.05,-s*.45,s*.1,s*.55); g.strokeRect(-s*.05,-s*.45,s*.1,s*.55); g.fillStyle='#d8c9a8'; g.fillRect(-s*.07,s*.08,s*.14,s*.06); g.fillStyle='#2b2422'; g.beginPath(); g.moveTo(-s*.08,s*.14); g.quadraticCurveTo(-s*.08,s*.36,0,s*.46); g.quadraticCurveTo(s*.08,s*.36,s*.08,s*.14); g.closePath(); g.fill(); }
  else if(k==='마이크'){ g.rotate(-.35); g.fillStyle='#3d3f45'; dolRR(g,-s*.07,-s*.02,s*.14,s*.46,s*.05); g.fill(); g.stroke(); g.fillStyle='#b9bec6'; g.beginPath(); g.arc(0,-s*.17,s*.17,0,6.28); g.fill(); g.stroke(); g.strokeStyle='rgba(0,0,0,.35)'; g.lineWidth=1; for(let i=-2;i<=2;i++){ g.beginPath(); g.moveTo(i*s*.06,-s*.32); g.lineTo(i*s*.06,-s*.02); g.stroke(); } }
  else if(k==='실'){ g.fillStyle='#d9b88a'; g.fillRect(-s*.2,-s*.3,s*.4,s*.07); g.fillRect(-s*.2,s*.2,s*.4,s*.07); g.strokeRect(-s*.2,-s*.3,s*.4,s*.07); g.strokeRect(-s*.2,s*.2,s*.4,s*.07); g.fillStyle='#f5f1e6'; g.fillRect(-s*.15,-s*.23,s*.3,s*.43); g.strokeStyle='rgba(120,100,80,.5)'; g.lineWidth=1; for(let i=0;i<7;i++){ g.beginPath(); g.moveTo(-s*.15,-s*.2+i*s*.06); g.lineTo(s*.15,-s*.17+i*s*.06); g.stroke(); } g.strokeStyle='#f5f1e6'; g.lineWidth=s*.03; g.beginPath(); g.moveTo(s*.15,s*.1); g.quadraticCurveTo(s*.4,s*.2,s*.3,s*.36); g.stroke(); }
  else if(k==='돈'){ for(let i=2;i>=0;i--){ g.save(); g.translate(i*s*.05,-i*s*.05); g.rotate(-.12+i*.06); g.fillStyle=i?'#b9d4a0':'#cfe3b6'; dolRR(g,-s*.34,-s*.18,s*.68,s*.36,s*.04); g.fill(); g.strokeStyle='#4f6b3a'; g.lineWidth=Math.max(1,s*.035); g.stroke(); if(!i){ g.strokeStyle='#6f8c58'; g.beginPath(); g.arc(0,0,s*.1,0,6.28); g.stroke(); } g.restore(); } }
  g.restore();
}
function dolBaby(g,x,y,s,ph,mode,hold,squash){
  const P=DOL_PAL; g.save(); g.translate(x,y);
  g.fillStyle='rgba(60,30,10,.2)'; g.beginPath(); g.ellipse(0,s*.3,s*.36,s*.09,0,0,6.28); g.fill();
  g.scale(1+squash*.5, 1-squash);
  const stripes=['#e2473f','#f2c14e','#4fae6a','#3f86c9','#9a5bb8'];
  const sleeve=(x0,y0,x1,y1,w)=>{ const n=5; for(let i=0;i<n;i++){ g.strokeStyle=stripes[i]; g.lineWidth=w; g.beginPath(); g.moveTo(x0+(x1-x0)*i/n,y0+(y1-y0)*i/n); g.lineTo(x0+(x1-x0)*(i+1)/n,y0+(y1-y0)*(i+1)/n); g.stroke(); } };
  g.lineCap='round';
  if(mode==='crawl'){
    const a=Math.sin(ph), b=Math.sin(ph+Math.PI);
    g.fillStyle='#fdf6ea'; g.strokeStyle=P.ink; g.lineWidth=Math.max(1,s*.02);
    [[-1,a],[1,b]].forEach(([sd,v])=>{ g.beginPath(); g.ellipse(sd*s*.17, s*.2+v*s*.03, s*.08, s*.11, 0,0,6.28); g.fill(); g.stroke(); });
    g.fillStyle='#fbf3e6'; g.beginPath(); g.ellipse(0,0,s*.27,s*.25,0,0,6.28); g.fill(); g.stroke();
    g.fillStyle='#e2473f'; g.beginPath(); g.ellipse(0,s*.12,s*.27,s*.12,0,0,Math.PI); g.fill();
    [[-1,b],[1,a]].forEach(([sd,v])=>sleeve(sd*s*.18,-s*.08, sd*s*.24, -s*.3+v*s*.06, s*.11));
    [[-1,b],[1,a]].forEach(([sd,v])=>{ g.fillStyle=P.skin; g.beginPath(); g.arc(sd*s*.25,-s*.33+v*s*.06,s*.055,0,6.28); g.fill(); });
    g.fillStyle=P.hair; g.beginPath(); g.arc(0,-s*.3,s*.19,0,6.28); g.fill();
    g.fillStyle='#2f3a8f'; g.beginPath(); g.arc(0,-s*.33,s*.19,Math.PI*1.05,Math.PI*1.95); g.fill();
    g.fillStyle=P.gold; g.fillRect(-s*.17,-s*.36,s*.34,s*.04);
    g.strokeStyle='#e2473f'; g.lineWidth=s*.035; g.beginPath(); g.moveTo(-s*.06,-s*.18); g.quadraticCurveTo(-s*.1,-s*.05,-s*.04,s*.05); g.moveTo(s*.06,-s*.18); g.quadraticCurveTo(s*.1,-s*.05,s*.04,s*.05); g.stroke();
  } else {
    g.strokeStyle=P.ink; g.lineWidth=Math.max(1,s*.02);
    g.fillStyle='#fdf6ea'; [-1,1].forEach(sd=>{ g.beginPath(); g.ellipse(sd*s*.16,s*.22,s*.12,s*.07,0,0,6.28); g.fill(); g.stroke(); });
    g.fillStyle='#e2473f'; g.beginPath(); g.moveTo(-s*.26,s*.22); g.quadraticCurveTo(0,s*.3,s*.26,s*.22); g.lineTo(s*.2,-s*.02); g.lineTo(-s*.2,-s*.02); g.closePath(); g.fill(); g.stroke();
    g.fillStyle='#fbf3e6'; g.beginPath(); g.moveTo(-s*.2,-s*.02); g.lineTo(s*.2,-s*.02); g.lineTo(s*.15,-s*.2); g.lineTo(-s*.15,-s*.2); g.closePath(); g.fill(); g.stroke();
    const up=hold; sleeve(-s*.15,-s*.15,-s*.28,s*.05,s*.1); sleeve(s*.15,-s*.15, s*(.18+.1*up), -s*(.2+.32*up), s*.1);
    g.fillStyle=P.skin; g.beginPath(); g.arc(-s*.28,s*.06,s*.055,0,6.28); g.fill(); g.beginPath(); g.arc(s*(.18+.1*up),-s*(.22+.32*up),s*.06,0,6.28); g.fill();
    g.strokeStyle=P.ink; g.lineWidth=Math.max(1,s*.02);
    g.fillStyle=P.skin; g.beginPath(); g.arc(0,-s*.36,s*.2,0,6.28); g.fill(); g.stroke();
    g.fillStyle=P.hair; g.beginPath(); g.arc(0,-s*.5,s*.05,0,6.28); g.fill();
    g.fillStyle='#2f3a8f'; g.beginPath(); g.arc(0,-s*.43,s*.2,Math.PI*1.12,Math.PI*1.88); g.closePath(); g.fill(); g.fillStyle=P.gold; g.fillRect(-s*.16,-s*.5,s*.32,s*.03);
    g.strokeStyle=P.ink; g.lineWidth=Math.max(1.2,s*.025);
    [-1,1].forEach(sd=>{ g.beginPath(); g.arc(sd*s*.075,-s*.34,s*.035,Math.PI*1.1,Math.PI*1.9); g.stroke(); });
    g.beginPath(); g.arc(0,-s*.29,s*.05,Math.PI*.15,Math.PI*.85); g.stroke();
    g.fillStyle='rgba(242,140,130,.55)'; [-1,1].forEach(sd=>{ g.beginPath(); g.ellipse(sd*s*.12,-s*.3,s*.035,s*.022,0,0,6.28); g.fill(); });
  }
  g.restore();
}
function dolPerson(g,x,y,s,col,clap,old){
  const P=DOL_PAL; g.save(); g.translate(x,y);
  g.fillStyle=col; dolRR(g,-s*.3,-s*.1,s*.6,s*.62,s*.18); g.fill();
  g.fillStyle='rgba(255,255,255,.55)'; g.beginPath(); g.moveTo(-s*.1,-s*.1); g.lineTo(0,s*.12); g.lineTo(s*.1,-s*.1); g.closePath(); g.fill();
  g.fillStyle=P.skin; g.beginPath(); g.arc(0,-s*.3,s*.19,0,6.28); g.fill();
  g.fillStyle=old?'#cfcac2':P.hair; g.beginPath(); g.arc(0,-s*.36,s*.19,Math.PI*1.05,Math.PI*1.95); g.fill(); if(old){ g.beginPath(); g.arc(0,-s*.5,s*.07,0,6.28); g.fill(); }
  g.strokeStyle=P.ink; g.lineWidth=Math.max(1,s*.025); [-1,1].forEach(sd=>{ g.beginPath(); g.arc(sd*s*.07,-s*.3,s*.03,Math.PI*1.1,Math.PI*1.9); g.stroke(); });
  g.beginPath(); g.arc(0,-s*.24,s*.05,Math.PI*.1,Math.PI*.9); g.stroke();
  const hx=s*(.05+.07*clap); g.fillStyle=P.skin; g.beginPath(); g.arc(-hx,s*.08,s*.06,0,6.28); g.arc(hx,s*.08,s*.06,0,6.28); g.fill();
  g.restore();
}
function playDol(S, itemK, lucky, done){
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(reduce){ done(); return; }
  const P=DOL_PAL;
  const ov=document.createElement('div'); ov.className='funeral dolov';
  ov.innerHTML=`<canvas></canvas><div class="dol-cap" id="dolcap"></div><button class="btn ghost f-skip" id="dskip">건너뛰기</button>`;
  document.body.appendChild(ov);
  const cv=ov.querySelector('canvas'), dpr=Math.min(2,window.devicePixelRatio||1);
  const W=window.innerWidth, H=window.innerHeight; cv.width=W*dpr; cv.height=H*dpr; cv.style.width=W+'px'; cv.style.height=H+'px';
  const g=cv.getContext('2d');
  const M=Math.min(W,H), port=W<H;
  const wallB=H*(port?.4:.42), runY=H*(port?.56:.6), reachY=runY+M*.1, y0=H*(port?.95:.97);
  const order=[...DOL].sort(()=>R()-.5);
  const rx0=W*.08, rx1=W*.92, iS=Math.min((rx1-rx0)/order.length*.78, M*.11);
  const items=order.map((x,i)=>({...x, x:rx0+(rx1-rx0)*(i+.5)/order.length, y:runY}));
  const target=items.find(x=>x.k===itemK), ti=items.indexOf(target);
  // 사다리타기 경로
  const K=6, colsI=[ti]; for(let k=0;k<K;k++){ const c=colsI[0]; let nc; do{ nc=c+(R()<.5?-1:1)*(R()<.7?1:2); }while(nc<0||nc>=items.length||nc===c); colsI.unshift(nc); }
  const lv=k=>y0+(reachY-y0)*k/(K+1);
  const pts=[{x:items[colsI[0]].x,y:y0}]; for(let k=0;k<K;k++){ pts.push({x:items[colsI[k]].x,y:lv(k+1)}); pts.push({x:items[colsI[k+1]].x,y:lv(k+1)}); } pts.push({x:target.x,y:reachY});
  const segs=[]; let len=0; for(let i=1;i<pts.length;i++){ const d=Math.hypot(pts[i].x-pts[i-1].x,pts[i].y-pts[i-1].y); segs.push(d); len+=d; }
  const MOVE=5.4, PAUSE=.22, sp=len/(MOVE-PAUSE*segs.length);
  const path=[{...pts[0],t:0}]; let tt=0; for(let i=1;i<pts.length;i++){ tt+=PAUSE; path.push({...pts[i-1],t:tt}); tt+=segs[i-1]/sp; path.push({...pts[i],t:tt}); }
  const T0=.9, tArr=T0+tt, tCrouch=tArr+.45, tLift=tCrouch+.55, tEnd=tLift+(lucky?4.0:3.2);
  const easeIO=k=>k<.5?4*k*k*k:1-Math.pow(-2*k+2,3)/2, easeOut=k=>1-Math.pow(1-k,3), lerp=(a,b,k)=>a+(b-a)*k;
  const babyAt=t=>{ const u=t-T0; if(u<=0) return {x:path[0].x,y:path[0].y,mv:0}; for(let i=1;i<path.length;i++){ if(u<=path[i].t){ const a=path[i-1], b=path[i]; if(a.x===b.x&&a.y===b.y) return {x:a.x,y:a.y,mv:0}; const k=easeIO((u-a.t)/(b.t-a.t)); return {x:lerp(a.x,b.x,k),y:lerp(a.y,b.y,k),mv:Math.sin(k*Math.PI)}; } } const l=path[path.length-1]; return {x:l.x,y:l.y,mv:0}; };
  const fam=[{x:W*.12,c:'#9fb7d6',old:true},{x:W*.27,c:'#e7b7c3',old:true},{x:W*.73,c:'#b5d3b2',old:false},{x:W*.88,c:'#f0d08e',old:false}];
  const bubbles=[['이쪽이야!',0],['연필 잡아~',1],['돈! 돈!',2],['까꿍!',3],['옳지옳지',0],['공 잡자!',3]];
  const conf=[]; for(let i=0;i<(lucky?160:40);i++) conf.push({x:R()*W, y:-R()*H*.6, vy:80+R()*140, vx:(R()-.5)*70, r:R()*6.28, vr:(R()-.5)*6, c:['#e2b34a','#e2473f','#3f86c9','#4fae6a','#ffffff'][i%5]});
  const spark=[]; let shake=0, capShown=false; const trail=[];
  const cam={x:W/2,y:H*.62,z:1}; let start=null, prev=null, raf=null, finished=false;
  const finish=()=>{ if(finished) return; finished=true; cancelAnimationFrame(raf); ov.classList.add('out'); setTimeout(()=>{ ov.remove(); done(); },450); };
  ov.querySelector('#dskip').addEventListener('click',finish);
  const bubble=(x,y,txt,a)=>{ g.save(); g.globalAlpha=a; g.font=`700 ${M*.032}px "Noto Sans KR",sans-serif`; const w=g.measureText(txt).width+M*.04, h=M*.055; const bx=x-w/2, by=y-h; g.fillStyle='#fffdf8'; dolRR(g,bx,by,w,h,h*.45); g.fill(); g.strokeStyle='rgba(58,42,28,.25)'; g.lineWidth=1; g.stroke(); g.beginPath(); g.moveTo(x-6,by+h-1); g.lineTo(x,by+h+8); g.lineTo(x+6,by+h-1); g.fill(); g.fillStyle=P.ink; g.textAlign='center'; g.textBaseline='middle'; g.fillText(txt,x,by+h/2+1); g.restore(); };
  const tick=ts=>{
    if(start==null){ start=ts; prev=ts; } const t=(ts-start)/1000, dt=Math.min(.05,(ts-prev)/1000); prev=ts;
    const b=babyAt(t);
    // 카메라: 아기를 부드럽게 따라가고, 잡을 때 줌인
    const zT = t<tArr? 1.06 : lerp(1.06, port?1.5:1.35, easeOut(clamp((t-tArr)/1.2,0,1)));
    const tx=lerp(W/2,b.x,t<tArr?.35:.8), ty=t<tArr? lerp(H*.62,b.y-H*.05,.5) : lerp(H*.62,(b.y+runY)/2-H*.06,.9);
    const f=Math.min(1,dt*3); cam.x+=(tx-cam.x)*f; cam.y+=(ty-cam.y)*f; cam.z+=(zT-cam.z)*Math.min(1,dt*2.5);
    shake*=Math.pow(.02,dt); const sx=(R()-.5)*shake, sy=(R()-.5)*shake;
    g.setTransform(dpr,0,0,dpr,0,0); g.fillStyle=P.wall1; g.fillRect(0,0,W,H);
    g.translate(W/2+sx,H/2+sy); g.scale(cam.z,cam.z); g.translate(-cam.x,-cam.y);
    const X0=-W*.5, X1=W*1.5;
    const wg=g.createLinearGradient(0,0,0,wallB); wg.addColorStop(0,P.wall1); wg.addColorStop(1,P.wall2); g.fillStyle=wg; g.fillRect(X0,-H,X1-X0,wallB+H);
    g.fillStyle='rgba(255,248,225,.35)'; g.beginPath(); g.moveTo(W*.78,0); g.lineTo(W*.95,0); g.lineTo(W*.75,H); g.lineTo(W*.45,H); g.closePath(); g.fill();
    // 병풍 (수묵 산수)
    const pw=Math.min(W*.86,M*1.25), px=W/2-pw/2, py=H*.07, ph=wallB-H*.12;
    for(let i=0;i<6;i++){ const x=px+i*pw/6; g.fillStyle=i%2?'#f6ead2':'#fbf2df'; g.fillRect(x,py,pw/6,ph); g.strokeStyle='#7a4f2a'; g.lineWidth=2; g.strokeRect(x,py,pw/6,ph);
      g.strokeStyle='rgba(70,60,50,.45)'; g.lineWidth=1.5; g.beginPath(); g.moveTo(x+pw/6*.1,py+ph*.75); g.quadraticCurveTo(x+pw/6*.35,py+ph*(.35+(i%3)*.08),x+pw/6*.55,py+ph*.6); g.quadraticCurveTo(x+pw/6*.75,py+ph*.45,x+pw/6*.92,py+ph*.72); g.stroke();
      if(i%2===0){ g.fillStyle='rgba(200,90,90,.35)'; g.beginPath(); g.arc(x+pw/6*.7,py+ph*.22,pw/6*.08,0,6.28); g.fill(); } }
    const bw=Math.min(W*.7,M*.9), bh=M*.075; g.fillStyle=P.red; dolRR(g,W/2-bw/2,py-bh*.4,bw,bh,6); g.fill(); g.fillStyle='#fff3d6'; g.font=`700 ${M*.04}px "Noto Serif KR","Noto Sans KR",serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(`${S.name} 첫 돌 축하해`, W/2, py-bh*.4+bh/2+1);
    // 마루
    for(let y=wallB,i=0;y<H*1.5;y+=M*.055,i++){ g.fillStyle=i%2?P.floor2:P.floor1; g.fillRect(X0,y,X1-X0,M*.055); g.fillStyle='rgba(0,0,0,.05)'; g.fillRect(X0,y,X1-X0,1); }
    g.fillStyle='rgba(0,0,0,.12)'; g.fillRect(X0,wallB,X1-X0,6);
    // 가족 (뒤쪽, 흐리게)
    const cheer=t>=tLift;
    g.save(); if('filter' in g) g.filter='blur(1.6px)';
    fam.forEach((fm,i)=>{ const clap=cheer? Math.abs(Math.sin(t*9+i)) : (Math.sin(t*2+i)*.5+.5)*.3; dolPerson(g,fm.x,wallB+M*.02-(cheer?Math.abs(Math.sin(t*6+i))*M*.015:0),M*.17,fm.c,clap,fm.old); });
    g.restore();
    // 돌상
    const tw=Math.min(W*.46,M*.62), tx0=W/2-tw/2, ty0=wallB-M*.02, th=M*.1;
    g.fillStyle='rgba(0,0,0,.18)'; g.beginPath(); g.ellipse(W/2,ty0+th+M*.03,tw*.55,M*.03,0,0,6.28); g.fill();
    g.fillStyle='#7a3b1f'; g.fillRect(tx0+tw*.06,ty0+th*.6,tw*.05,th*.75); g.fillRect(tx0+tw*.89,ty0+th*.6,tw*.05,th*.75);
    g.fillStyle=P.red; g.fillRect(tx0,ty0,tw,th*.7); g.fillStyle=P.red2; g.fillRect(tx0,ty0+th*.55,tw,th*.15); g.fillStyle=P.gold; g.fillRect(tx0,ty0+th*.62,tw,th*.04);
    [[.18,'#f5f0e6'],[.35,'#f3c7cf'],[.65,'#cfe3b6'],[.82,'#f5f0e6']].forEach(([fx,c])=>{ for(let k=0;k<3;k++){ g.fillStyle=c; dolRR(g,tx0+tw*fx-tw*.06,ty0-k*M*.018-M*.02,tw*.12,M*.018,3); g.fill(); g.strokeStyle='rgba(0,0,0,.12)'; g.lineWidth=1; g.stroke(); } });
    g.fillStyle='#d9483b'; g.beginPath(); g.arc(W/2-tw*.05,ty0-M*.015,M*.02,0,6.28); g.arc(W/2+tw*.05,ty0-M*.015,M*.02,0,6.28); g.fill();
    // 비단 깔개 + 물건
    g.fillStyle='rgba(0,0,0,.12)'; dolRR(g,rx0-M*.02,runY-iS*.55+5,rx1-rx0+M*.04,iS*1.25,10); g.fill();
    g.fillStyle='#d4413a'; dolRR(g,rx0-M*.02,runY-iS*.55,rx1-rx0+M*.04,iS*1.25,10); g.fill(); g.strokeStyle=P.gold; g.lineWidth=2; dolRR(g,rx0-M*.01,runY-iS*.5,rx1-rx0+M*.02,iS*1.15,8); g.stroke();
    items.forEach(x=>{ if(x===target && t>=tCrouch) return; const near=Math.abs(b.x-x.x)<iS*.6 && t>T0 && t<tArr+.1; const lift=near? Math.abs(Math.sin(t*7))*iS*.08 : 0;
      dolItem(g,x.k,x.x,x.y-lift,iS*(near?1.12:1)); g.fillStyle='rgba(255,243,214,.95)'; g.font=`600 ${Math.max(9,iS*.24)}px "Noto Sans KR",sans-serif`; g.textAlign='center'; g.textBaseline='middle'; g.fillText(x.k,x.x,runY+iS*.56); });
    // 발자국
    if(t>T0 && t<tArr && b.mv>.2 && (!trail.length || Math.hypot(trail[trail.length-1].x-b.x,trail[trail.length-1].y-b.y)>M*.03)) trail.push({x:b.x,y:b.y,t});
    trail.forEach(p=>{ const a=clamp(1-(t-p.t)/3,0,1)*.25; g.fillStyle=`rgba(90,55,25,${a})`; g.beginPath(); g.ellipse(p.x,p.y+M*.04,M*.012,M*.007,0,0,6.28); g.fill(); });
    // 아기
    const bs=M*.2;
    if(t<tArr){ dolBaby(g,b.x,b.y,bs,t*9,'crawl',0,b.mv*.06*Math.sin(t*16)); }
    else if(t<tCrouch){ const k=(t-tArr)/(tCrouch-tArr); dolBaby(g,b.x,b.y,bs,0,'crawl',0,.12*Math.sin(k*Math.PI*.5)); }
    else { const k=easeOut(clamp((t-tCrouch)/(tLift-tCrouch),0,1)), over=t<tLift+.25&&t>=tLift? -Math.sin(clamp((t-tLift)/.25,0,1)*Math.PI)*.06 : 0;
      dolBaby(g,b.x,b.y,bs,0,'sit',k,over);
      const hx=b.x+bs*(.18+.1*k), hy=b.y-bs*(.22+.32*k);
      if(t>=tLift){ g.save(); g.globalAlpha=.55; const rg=g.createRadialGradient(hx,hy-iS*.3,2,hx,hy-iS*.3,iS*1.6); rg.addColorStop(0,lucky?'rgba(255,214,90,.95)':'rgba(255,255,255,.9)'); rg.addColorStop(1,'rgba(255,255,255,0)'); g.fillStyle=rg; g.beginPath(); g.arc(hx,hy-iS*.3,iS*1.6,0,6.28); g.fill(); g.restore();
        if(lucky){ g.save(); g.translate(hx,hy-iS*.3); g.rotate(t*.6); g.fillStyle='rgba(255,220,120,.25)'; for(let i=0;i<12;i++){ g.rotate(Math.PI/6); g.beginPath(); g.moveTo(0,0); g.lineTo(iS*3,-iS*.25); g.lineTo(iS*3,iS*.25); g.closePath(); g.fill(); } g.restore(); } }
      dolItem(g,target.k,hx,hy-iS*.35*k,iS*(1+.25*k));
      if(t>=tLift && !spark.length){ shake=lucky?10:5; for(let i=0;i<26;i++){ const a=R()*6.28, v=(.6+R())*M*.35; spark.push({x:hx,y:hy-iS*.3,vx:Math.cos(a)*v,vy:Math.sin(a)*v,life:1}); } }
    }
    spark.forEach(p=>{ p.x+=p.vx*dt; p.y+=p.vy*dt; p.vy+=M*.6*dt; p.life-=dt*1.3; if(p.life<=0) return; g.save(); g.globalAlpha=p.life; g.translate(p.x,p.y); g.rotate(t*4); g.fillStyle=lucky?'#f3c64d':'#ffffff'; g.beginPath(); for(let i=0;i<4;i++){ g.rotate(Math.PI/2); g.lineTo(0,-M*.016); g.lineTo(M*.004,-M*.004); } g.fill(); g.restore(); });
    // 말풍선
    if(t>T0+.3 && t<tArr){ const idx=Math.floor((t-T0)/1.1)%bubbles.length, [txt,fi]=bubbles[idx], ph2=((t-T0)%1.1)/1.1; const a=ph2<.15?ph2/.15:ph2>.85?(1-ph2)/.15:1; bubble(fam[fi].x, wallB-M*.13-a*4, txt, a); }
    if(cheer){ fam.forEach((fm,i)=>{ if(i%2===0) bubble(fm.x, wallB-M*.13, ['와아~!','박수!','최고!','잘했다!'][i], clamp((t-tLift)/.3,0,1)); }); }
    // 화면 효과
    g.setTransform(dpr,0,0,dpr,0,0);
    const vg=g.createRadialGradient(W/2,H/2,M*.35,W/2,H/2,Math.max(W,H)*.75); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(60,30,10,.28)'); g.fillStyle=vg; g.fillRect(0,0,W,H);
    if(cheer){ conf.forEach(p=>{ p.y+=p.vy*dt; p.x+=p.vx*dt+Math.sin(t*3+p.r)*.4; p.r+=p.vr*dt; g.save(); g.translate(p.x,p.y); g.rotate(p.r); g.fillStyle=p.c; g.fillRect(-5,-2.5,10,5); g.restore(); }); }
    if(lucky && t>=tLift && t<tLift+.3){ g.fillStyle=`rgba(255,235,160,${.55*(1-(t-tLift)/.3)})`; g.fillRect(0,0,W,H); }
    if(!capShown && t>=tLift+.5){ capShown=true; const cap=ov.querySelector('#dolcap');
      cap.innerHTML=`${lucky?'<div class="dol-luck">운명의 돌잡이!</div>':''}<div class="dol-spoon">${target.spoon}</div><b>${target.k}</b><small>${Object.entries(target.tr).map(([k2,v])=>`${k2} +${Math.round(v*(lucky?1.8:1))}`).join(' · ')}${lucky?' · 꿈과 같은 쪽!':''}</small>`; cap.classList.add('on'); }
    const fin=clamp(1-t/.7,0,1); if(fin>0){ g.fillStyle=`rgba(20,12,6,${fin})`; g.fillRect(0,0,W,H); }
    if(t<tEnd && !finished) raf=requestAnimationFrame(tick); else finish();
  };
  raf=requestAnimationFrame(tick);
}
