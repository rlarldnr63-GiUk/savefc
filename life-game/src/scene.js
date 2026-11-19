/* ===== 갈림길 장면 애니메이션: 상황에 맞는 장면 + 매번 다른 변주 ===== */
let sceneRAF=null;
function stopScene(){ if(sceneRAF) cancelAnimationFrame(sceneRAF); sceneRAF=null; }
function sceneKind(p){
  if(p.think) return 'stars';
  const d=p.d, c=p.card, t=(c.text||'')+' '+(c.headline||'')+' '+(d.id||d.name||'');
  if(d.kind==='news') return 'news';
  const rules=[
    [/오토바이|스쿠터|음주|운전|신호|배달|scooter|drunk|speeding/,'road'],
    [/수능|원서|시험|모의고사|suneung|college|highschool|칠판|수학|공부|학원|선생님|담임|자퇴|검정고시|dropout|hs_track/,'school'],
    [/결혼|연애|사귀|고백|맞선|소개팅|인연|marry|matseon|love|이별/,'hearts'],
    [/집|영끌|청약|전세|코인|주식|투자|돈|대출|buy_house|coin|jeonse|창업|치킨|투자자/,'money'],
    [/입영|군대|훈련소|army|전역|병무청/,'army'],
    [/회사|팀장|이직|취업|진로|퇴사|track|hunt|headhunt|career|명예퇴직|승진|번아웃|burnout/,'city'],
    [/부모님|엄마|아빠|가족|아이|자녀|출산|육아|간병|parents|kids|baby|가출|runaway/,'home'],
    [/축구|운동|체육|달리기|sport|공을|선배들/,'ball'],
    [/그림|미술|도화지|art|물감/,'paint'],
    [/마음|우울|위기|crisis|숨이 막/,'rain'],
  ];
  for(const [re,k] of rules) if(re.test(t)) return k;
  return pick(['drift','orbit','waves']);
}
function cssVar(n){ return getComputedStyle(document.documentElement).getPropertyValue(n).trim()||'#2d4f9e'; }
function startScene(p){
  stopScene();
  const cv=document.getElementById('scene'); if(!cv) return;
  const dpr=Math.min(2,window.devicePixelRatio||1), W=cv.clientWidth||320, H=cv.clientHeight||110;
  cv.width=W*dpr; cv.height=H*dpr; const g=cv.getContext('2d'); g.scale(dpr,dpr);
  const kind=sceneKind(p), rnd=Math.random;
  const ink=cssVar('--ink'), blue=cssVar('--blue'), seal=cssVar('--seal'), soft=cssVar('--soft'), paper=cssVar('--paper'), news=cssVar('--news');
  const hue=Math.floor(rnd()*360), dir=rnd()<.5?1:-1, sp=.6+rnd()*.9, n=Math.floor(10+rnd()*22);
  const hsl=(h,s,l,a=1)=>`hsla(${(h+360)%360},${s}%,${l}%,${a})`;
  const dark=matchMedia('(prefers-color-scheme: dark)').matches && document.documentElement.dataset.theme!=='light' || document.documentElement.dataset.theme==='dark';
  const L=dark?62:48;
  const P=Array.from({length:n},()=>({x:rnd()*W,y:rnd()*H,r:2+rnd()*6,v:.3+rnd()*1.2,a:rnd()*6.28,h:hue+rnd()*60-30}));
  const S0={bx:W*.2, by:20, vx:(1.6+rnd()*1.4)*dir, vy:0, line:[H*.6], stars:P.map(q=>({...q, r:.6+rnd()*1.6})), win:Array.from({length:60},()=>rnd()<.4)};
  const tick=(t)=>{
    t=t/1000*sp;
    g.clearRect(0,0,W,H);
    g.fillStyle=soft; g.fillRect(0,0,W,H);
    switch(kind){
      case 'school': {
        g.fillStyle=hsl(150+hue%40-20,30,dark?22:30); g.fillRect(14,10,W-28,H-28);
        g.strokeStyle='rgba(255,255,255,.7)'; g.lineWidth=2; g.beginPath();
        const k=(t*.4)%1; for(let i=0;i<5;i++){ const y=26+i*14; g.moveTo(30,y); g.lineTo(30+(W-80)*Math.min(1,Math.max(0,k*5-i)),y+Math.sin(i+hue)*3); } g.stroke();
        P.forEach(q=>{ q.y+=q.v*.3; if(q.y>H-18){ q.y=12; q.x=rnd()*W; } g.fillStyle='rgba(255,255,255,.35)'; g.fillRect(q.x,q.y,1.5,1.5); });
        const cx=W-40, cy=30; g.fillStyle=paper; g.beginPath(); g.arc(cx,cy,14,0,6.28); g.fill(); g.strokeStyle=ink; g.lineWidth=1.5; g.stroke();
        g.beginPath(); g.moveTo(cx,cy); g.lineTo(cx+10*Math.cos(t*2-1.57),cy+10*Math.sin(t*2-1.57)); g.stroke();
        break; }
      case 'hearts': {
        P.forEach(q=>{ q.y-=q.v*.8; q.x+=Math.sin(t*2+q.a)*.4; if(q.y<-10){ q.y=H+10; q.x=rnd()*W; }
          const s=q.r*1.4; g.fillStyle=hsl(q.h%60+330,70,L+8,.75); g.beginPath(); g.moveTo(q.x,q.y+s*.3);
          g.bezierCurveTo(q.x,q.y,q.x-s,q.y,q.x-s,q.y+s*.3); g.bezierCurveTo(q.x-s,q.y+s*.8,q.x,q.y+s*1.1,q.x,q.y+s*1.4);
          g.bezierCurveTo(q.x,q.y+s*1.1,q.x+s,q.y+s*.8,q.x+s,q.y+s*.3); g.bezierCurveTo(q.x+s,q.y,q.x,q.y,q.x,q.y+s*.3); g.fill(); });
        break; }
      case 'money': {
        const ln=S0.line; if(ln.length<W/4) ln.push(Math.max(15,Math.min(H-10, ln[ln.length-1]+(rnd()-.5+(dir>0?-.08:.08))*10)));
        else { ln.shift(); ln.push(Math.max(15,Math.min(H-10, ln[ln.length-1]+(rnd()-.5)*10))); }
        g.strokeStyle=ln[ln.length-1]<ln[0]?seal:blue; g.lineWidth=2; g.beginPath(); ln.forEach((y,i)=>i?g.lineTo(i*4,y):g.moveTo(0,y)); g.stroke();
        P.slice(0,12).forEach(q=>{ q.y+=q.v*1.2; if(q.y>H+8){ q.y=-8; q.x=rnd()*W; } g.fillStyle=hsl(45,85,L+5); g.beginPath(); g.ellipse(q.x,q.y,6*Math.abs(Math.cos(t*3+q.a))+1,6,0,0,6.28); g.fill(); });
        break; }
      case 'city': {
        g.fillStyle=hsl(hue,25,dark?14:78); g.fillRect(0,0,W,H);
        let x=0, i=0; while(x<W){ const bw=24+((i*37+hue)%30), bh=30+((i*53+hue)%60); g.fillStyle=dark?'#232a38':'#3a4152'; g.fillRect(x,H-bh,bw-3,bh);
          for(let yy=H-bh+6; yy<H-6; yy+=9) for(let xx=x+4; xx<x+bw-8; xx+=7){ const on=S0.win[(xx*7+yy*3+i)%60] !== (Math.floor(t*1.5+xx+yy)%23===0); if(on){ g.fillStyle=hsl(48,90,70,.9); g.fillRect(xx,yy,3,4); } }
          x+=bw; i++; }
        g.fillStyle=hsl(50,90,85,.9); g.beginPath(); g.arc(W*(.15+.7*((t*.05)%1)), 18, 6, 0, 6.28); g.fill();
        break; }
      case 'army': {
        S0.stars.forEach(q=>{ g.fillStyle=`rgba(255,255,255,${.3+.5*Math.abs(Math.sin(t+q.a))})`; g.fillRect(q.x,q.y*.5,1.5,1.5); });
        g.fillStyle=dark?'#1d2a1f':'#4a5a3c'; g.fillRect(0,H-20,W,20);
        for(let k=0;k<6;k++){ const x=((k*55+t*30*dir)%(W+60)+W+60)%(W+60)-30, step=Math.sin(t*6+k)*3; g.fillStyle=ink; g.fillRect(x,H-46,8,20); g.beginPath(); g.arc(x+4,H-51,5,0,6.28); g.fill(); g.fillRect(x+1+step,H-26,3,8); g.fillRect(x+4-step,H-26,3,8); }
        break; }
      case 'home': {
        g.fillStyle=hsl(hue,40,dark?20:85); g.fillRect(0,0,W,H);
        const hx=W/2-35; g.fillStyle=hsl(hue+20,35,dark?40:62); g.fillRect(hx,H-50,70,42); g.fillStyle=seal; g.beginPath(); g.moveTo(hx-8,H-50); g.lineTo(W/2,H-82); g.lineTo(hx+78,H-50); g.fill();
        g.fillStyle=hsl(48,90,70); g.fillRect(hx+12,H-38,14,12); g.fillRect(hx+44,H-38,14,12); g.fillStyle=ink; g.fillRect(hx+30,H-30,10,22); g.fillRect(hx+50,H-78,8,16);
        P.slice(0,8).forEach((q,i)=>{ const k=(t*.3+i/8)%1; g.fillStyle=`rgba(180,180,190,${.6*(1-k)})`; g.beginPath(); g.arc(hx+54+Math.sin(k*6+i)*6*dir, H-80-k*60, 4+k*8, 0, 6.28); g.fill(); });
        break; }
      case 'road': {
        g.fillStyle=dark?'#14161c':'#2b2f38'; g.fillRect(0,0,W,H);
        for(let k=0;k<8;k++){ const y=((k*30+t*160)%(H+40))-20; g.fillStyle='rgba(255,255,255,.7)'; g.fillRect(W/2-3,y,6,16); }
        P.slice(0,10).forEach(q=>{ q.x-=q.v*6*dir; if(q.x<-20) q.x=W+20; if(q.x>W+20) q.x=-20; g.fillStyle=`rgba(255,240,180,${.25+.3*q.v/1.5})`; g.fillRect(q.x,q.y,22,2); });
        const flash=Math.sin(t*8)>0; g.fillStyle=flash?seal:hsl(45,90,60); g.beginPath(); g.arc(W-24,18,6,0,6.28); g.fill();
        break; }
      case 'ball': {
        g.fillStyle=hsl(110,35,dark?22:55); g.fillRect(0,H-16,W,16);
        S0.vy+=.35; S0.by+=S0.vy; S0.bx+=S0.vx; if(S0.by>H-26){ S0.by=H-26; S0.vy=-(6+rnd()*2.5); } if(S0.bx<10||S0.bx>W-10) S0.vx*=-1;
        g.fillStyle='#fff'; g.beginPath(); g.arc(S0.bx,S0.by,10,0,6.28); g.fill(); g.strokeStyle=ink; g.lineWidth=1.5; g.stroke();
        g.save(); g.translate(S0.bx,S0.by); g.rotate(S0.bx/10); g.fillStyle=ink; g.beginPath(); for(let k=0;k<5;k++){ const a=k*1.2566; g.lineTo(4*Math.cos(a),4*Math.sin(a)); } g.fill(); g.restore();
        g.fillStyle='rgba(0,0,0,.15)'; g.beginPath(); g.ellipse(S0.bx,H-14,10*(S0.by/H),3,0,0,6.28); g.fill();
        break; }
      case 'paint': {
        P.forEach((q,i)=>{ const r=q.r*3*(0.6+0.4*Math.sin(t+q.a)); g.fillStyle=hsl(q.h+i*25,70,L+10,.55); g.beginPath(); g.arc(q.x,q.y,r,0,6.28); g.fill(); q.x+=Math.cos(q.a+t*.3)*.3; q.y+=Math.sin(q.a+t*.3)*.3; });
        break; }
      case 'rain': {
        g.fillStyle=hsl(220,15,dark?16:70); g.fillRect(0,0,W,H);
        P.forEach(q=>{ q.y+=q.v*5; q.x-=1; if(q.y>H){ q.y=-10; q.x=rnd()*W+20; } g.strokeStyle='rgba(220,230,255,.6)'; g.lineWidth=1; g.beginPath(); g.moveTo(q.x,q.y); g.lineTo(q.x-3,q.y+10); g.stroke(); });
        g.fillStyle=hsl(48,90,70,.25+.15*Math.sin(t)); g.beginPath(); g.arc(W*.8,H*.25,14,0,6.28); g.fill();
        break; }
      case 'news': {
        g.fillStyle=dark?'#1b1a14':'#f1ead6'; g.fillRect(0,0,W,H);
        for(let k=0;k<160;k++){ g.fillStyle=`rgba(120,110,80,${rnd()*.15})`; g.fillRect(rnd()*W,rnd()*(H-26),2,2); }
        g.fillStyle=news; g.fillRect(0,H-26,W,26); g.fillStyle=paper; g.font='bold 12px sans-serif';
        const msg='속보 · 속보 · '+(p.card.headline||'뉴스')+' · '; const mw=g.measureText(msg).width; let x=-((t*60)%mw); while(x<W){ g.fillText(msg,x,H-9); x+=mw; }
        g.fillStyle=seal; g.beginPath(); g.arc(18,18,5+Math.sin(t*5),0,6.28); g.fill(); g.fillStyle=ink; g.font='bold 11px sans-serif'; g.fillText('LIVE',28,22);
        break; }
      case 'stars': {
        g.fillStyle=dark?'#0d1020':'#1c2240'; g.fillRect(0,0,W,H);
        const st=S0.stars; st.forEach(q=>{ g.fillStyle=`rgba(255,255,255,${.4+.6*Math.abs(Math.sin(t*.8+q.a))})`; g.beginPath(); g.arc(q.x,q.y,q.r,0,6.28); g.fill(); });
        const k=Math.min(st.length-1, Math.floor(t*.8)%st.length); g.strokeStyle='rgba(180,200,255,.35)'; g.beginPath(); for(let i=0;i<=k;i++) i?g.lineTo(st[i].x,st[i].y):g.moveTo(st[i].x,st[i].y); g.stroke();
        break; }
      case 'orbit': {
        P.forEach((q,i)=>{ const a=t*q.v*dir+q.a, rr=12+i*3; g.fillStyle=hsl(q.h,60,L+8,.8); g.beginPath(); g.arc(W/2+Math.cos(a)*rr*1.6,H/2+Math.sin(a)*rr*.6,q.r*.7,0,6.28); g.fill(); });
        break; }
      case 'waves': {
        for(let k=0;k<4;k++){ g.strokeStyle=hsl(hue+k*20,55,L+k*5,.7); g.lineWidth=2; g.beginPath(); for(let x=0;x<=W;x+=4){ const y=H/2+Math.sin(x/(30+k*8)+t*(1+k*.3)*dir)*(10+k*5); x?g.lineTo(x,y):g.moveTo(x,y); } g.stroke(); }
        break; }
      default: {
        P.forEach(q=>{ q.x+=Math.cos(q.a)*q.v; q.y+=Math.sin(q.a)*q.v; if(q.x<0||q.x>W) q.a=Math.PI-q.a; if(q.y<0||q.y>H) q.a=-q.a; g.fillStyle=hsl(q.h,60,L+8,.7); g.beginPath(); g.arc(q.x,q.y,q.r,0,6.28); g.fill(); });
      }
    }
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches && document.getElementById('scene')===cv) sceneRAF=requestAnimationFrame(tick);
  };
  sceneRAF=requestAnimationFrame(tick);
}
