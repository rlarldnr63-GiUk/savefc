/* ===== 질문의 한 장면: 장소 배경 + 등장인물(나 포함) + 소품, 매번 다른 시간·날씨·행인 ===== */
function meEmoji(S){ const a=S.age, f=S.gender==='F'; return a<3?'👶': a<13?(f?'👧':'👦'): a<19?(f?'👧':'👦'): a<60?(f?'👩':'👨'):(f?'👵':'👴'); }
function partnerEmoji(S){ const f=S.gender==='F'; return S.age<60?(f?'👨':'👩'):(f?'👴':'👵'); }
function momEmoji(S){ return S.age<45?'👩':'👵'; } function dadEmoji(S){ return S.age<45?'👨':'👴'; }
// 배경: 0~1 좌표계, g/W/H/env를 받아 그린다
const BG = {
  classroom(g,W,H,e){ wall(g,W,H,e.dark?'#2b3140':'#efe6d2'); g.fillStyle=e.dark?'#1e3a2c':'#2f5d46'; g.fillRect(W*.08,H*.1,W*.6,H*.42); g.strokeStyle='#8a6a3a'; g.lineWidth=3; g.strokeRect(W*.08,H*.1,W*.6,H*.42);
    g.fillStyle='#fff8'; g.font=`${H*.09}px sans-serif`; g.fillText(e.board||'x² + 2x = ?',W*.14,H*.32); floor(g,W,H,'#b8946a'); for(let i=0;i<3;i++) desk(g,W*(.15+i*.28),H*.78,W*.18); clockWall(g,W*.82,H*.2,H*.09,e.t); },
  exam(g,W,H,e){ wall(g,W,H,'#e8e4da'); floor(g,W,H,'#c9b08a'); for(let r=0;r<2;r++) for(let i=0;i<4;i++) desk(g,W*(.06+i*.24),H*(.62+r*.2),W*.15); clockWall(g,W*.5,H*.18,H*.11,e.t,true); g.fillStyle='#333'; g.font=`${H*.07}px sans-serif`; g.fillText('대학수학능력시험',W*.06,H*.12); },
  home(g,W,H,e){ wall(g,W,H,e.dark?'#2a2420':'#f3e3cc'); windowBox(g,W*.7,H*.15,W*.2,H*.3,e); floor(g,W,H,'#9c7650'); g.fillStyle='#7a5536'; g.fillRect(W*.25,H*.66,W*.4,H*.06); g.fillRect(W*.28,H*.72,W*.02,H*.18); g.fillRect(W*.6,H*.72,W*.02,H*.18); if(e.dark){ lamp(g,W*.45,H*.08,e.t); } },
  room(g,W,H,e){ wall(g,W,H,e.dark?'#232634':'#dfe8f2'); windowBox(g,W*.08,H*.15,W*.22,H*.32,e); floor(g,W,H,'#a88763'); g.fillStyle='#5b77a8'; g.fillRect(W*.55,H*.66,W*.38,H*.14); g.fillStyle='#eee'; g.fillRect(W*.57,H*.6,W*.1,H*.07); },
  pcbang(g,W,H,e){ g.fillStyle='#14161f'; g.fillRect(0,0,W,H); for(let i=0;i<5;i++){ const x=W*(.04+i*.2); g.fillStyle='#222838'; g.fillRect(x,H*.55,W*.17,H*.25); g.fillStyle=`hsl(${(e.hue+i*40)%360},70%,${45+10*Math.sin(e.t*3+i)}%)`; g.fillRect(x+W*.02,H*.3,W*.13,H*.2); } g.fillStyle='#ff4d6d'; g.font=`bold ${H*.1}px sans-serif`; g.fillText('PC',W*.86,H*.15); },
  field(g,W,H,e){ sky(g,W,H,e); g.fillStyle='#4f9a4a'; g.fillRect(0,H*.6,W,H*.4); g.strokeStyle='#fff'; g.lineWidth=2; g.strokeRect(W*.78,H*.4,W*.18,H*.24); for(let k=0;k<5;k++){ g.beginPath(); g.moveTo(W*(.78+k*.045),H*.4); g.lineTo(W*(.78+k*.045),H*.64); g.stroke(); } school(g,W*.02,H*.25,W*.3,H*.35); },
  street(g,W,H,e){ sky(g,W,H,e); city(g,W,H,e,.55); g.fillStyle='#555'; g.fillRect(0,H*.78,W,H*.22); g.fillStyle='#bbb'; g.fillRect(0,H*.76,W,H*.03); },
  road(g,W,H,e){ sky(g,W,H,{...e,dark:true}); city(g,W,H,{...e,dark:true},.5); g.fillStyle='#2a2d34'; g.fillRect(0,H*.62,W,H*.38); for(let k=0;k<6;k++){ const x=((k*W/5 - e.t*W*.6)%(W+40)+W+40)%(W+40)-20; g.fillStyle='#ffd54a'; g.fillRect(x,H*.8,W*.08,H*.02); } trafficLight(g,W*.88,H*.2,H,e.t); },
  office(g,W,H,e){ wall(g,W,H,e.dark?'#1e2230':'#e9edf2'); windowBox(g,W*.05,H*.08,W*.9,H*.36,{...e,city:true}); floor(g,W,H,'#8f98a6'); for(let i=0;i<3;i++){ const x=W*(.08+i*.32); g.fillStyle='#d9d2c5'; g.fillRect(x,H*.66,W*.24,H*.05); g.fillStyle='#333'; g.fillRect(x+W*.07,H*.52,W*.1,H*.14); g.fillStyle=`hsl(${200+i*20},60%,60%)`; g.fillRect(x+W*.08,H*.54,W*.08,H*.1); } },
  interview(g,W,H,e){ wall(g,W,H,'#e6e1d6'); floor(g,W,H,'#7c6a58'); g.fillStyle='#3d4a5c'; g.fillRect(W*.05,H*.5,W*.58,H*.1); g.fillStyle='#222'; g.font=`${H*.07}px sans-serif`; g.fillText('면 접 실',W*.72,H*.15); },
  subway(g,W,H,e){ g.fillStyle='#c8d3dc'; g.fillRect(0,0,W,H); g.fillStyle='#8aa'; g.fillRect(0,H*.08,W,H*.04); for(let i=0;i<4;i++){ g.fillStyle='#223'; g.fillRect(W*(.05+i*.25),H*.18,W*.18,H*.22); const k=(e.t*.8+i)%1; g.fillStyle='#556'; g.fillRect(W*(.05+i*.25)+W*.18*k,H*.2,W*.02,H*.18); } g.fillStyle='#9aa'; g.fillRect(0,H*.82,W,H*.18); g.fillStyle='#2d8a4e'; g.fillRect(0,H*.45,W,H*.03); },
  hospital(g,W,H,e){ wall(g,W,H,'#eef4f6'); floor(g,W,H,'#b9c6cc'); g.fillStyle='#fff'; g.fillRect(W*.3,H*.58,W*.5,H*.14); g.fillStyle='#cfe'; g.fillRect(W*.3,H*.52,W*.14,H*.08); g.fillStyle='#e33'; g.fillRect(W*.86,H*.1,W*.02,H*.1); g.fillRect(W*.83,H*.135,W*.08,H*.03); monitorBeep(g,W*.12,H*.3,W*.14,H*.14,e.t); },
  cafe(g,W,H,e){ wall(g,W,H,e.dark?'#3a2a20':'#f0dcc0'); windowBox(g,W*.6,H*.1,W*.32,H*.36,e); floor(g,W,H,'#6e4b30'); g.fillStyle='#4a3020'; g.fillRect(W*.2,H*.66,W*.36,H*.05); g.fillRect(W*.37,H*.71,W*.02,H*.18); for(let i=0;i<4;i++){ g.fillStyle=`hsla(45,100%,70%,${.5+.3*Math.sin(e.t*2+i)})`; g.beginPath(); g.arc(W*(.1+i*.15),H*.12,H*.025,0,6.28); g.fill(); } },
  hall(g,W,H,e){ wall(g,W,H,'#fbeef0'); floor(g,W,H,'#e9d6c6'); g.strokeStyle='#d99'; g.lineWidth=H*.03; g.beginPath(); g.arc(W*.5,H*.75,W*.28,Math.PI,0); g.stroke(); },
  apart(g,W,H,e){ sky(g,W,H,e); for(let i=0;i<5;i++){ const x=W*(.02+i*.2), h=H*(.45+((i*37+e.hue)%30)/100); g.fillStyle=e.dark?'#3a4050':'#d5d9e0'; g.fillRect(x,H-h,W*.16,h); for(let yy=H-h+8; yy<H-6; yy+=10) for(let xx=x+5; xx<x+W*.16-6; xx+=9){ g.fillStyle=e.dark&&((xx+yy+i)%3)?'#ffd96a':'#9fb3c8'; g.fillRect(xx,yy,4,5); } } g.fillStyle='#777'; g.fillRect(0,H*.9,W,H*.1); },
  army(g,W,H,e){ sky(g,W,H,e); g.fillStyle='#5a6b45'; g.fillRect(0,H*.65,W,H*.35); g.fillStyle='#4d5b3a'; g.beginPath(); g.moveTo(W*.6,H*.65); g.lineTo(W*.75,H*.38); g.lineTo(W*.9,H*.65); g.fill(); g.fillStyle='#ccc'; g.fillRect(W*.15,H*.22,W*.006,H*.43); g.fillStyle='#e33'; g.fillRect(W*.156,H*.22,W*.08,H*.06); },
  hill(g,W,H,e){ g.fillStyle='#0f1430'; g.fillRect(0,0,W,H); (e.stars||[]).forEach(s=>{ g.fillStyle=`rgba(255,255,255,${.3+.6*Math.abs(Math.sin(e.t+s.a))})`; g.fillRect(s.x*W,s.y*H*.6,2,2); }); g.fillStyle='#1d2a24'; g.beginPath(); g.ellipse(W*.5,H*1.05,W*.7,H*.35,0,0,6.28); g.fill(); g.fillStyle='#ffe9a8'; g.beginPath(); g.arc(W*.85,H*.18,H*.07,0,6.28); g.fill(); },
  gate(g,W,H,e){ sky(g,W,H,e); school(g,W*.25,H*.15,W*.5,H*.5); g.fillStyle='#888'; g.fillRect(0,H*.78,W,H*.22); },
  crossroads(g,W,H,e){ sky(g,W,H,e); g.fillStyle='#7a9a5a'; g.fillRect(0,H*.6,W,H*.4); g.fillStyle='#c9b48c'; g.beginPath(); g.moveTo(W*.45,H); g.lineTo(W*.5,H*.6); g.lineTo(W*.55,H); g.fill(); g.beginPath(); g.moveTo(W*.5,H*.62); g.lineTo(0,H*.7); g.lineTo(0,H*.76); g.fill(); g.beginPath(); g.moveTo(W*.5,H*.62); g.lineTo(W,H*.7); g.lineTo(W,H*.76); g.fill(); g.fillStyle='#7a5536'; g.fillRect(W*.495,H*.3,W*.012,H*.34); },
};
function wall(g,W,H,c){ g.fillStyle=c; g.fillRect(0,0,W,H); }
function floor(g,W,H,c){ g.fillStyle=c; g.fillRect(0,H*.82,W,H*.18); }
function desk(g,x,y,w){ g.fillStyle='#a87b4f'; g.fillRect(x,y,w,w*.12); g.fillRect(x+w*.08,y+w*.12,w*.06,w*.3); g.fillRect(x+w*.86,y+w*.12,w*.06,w*.3); }
function clockWall(g,x,y,r,t,big){ g.fillStyle='#fff'; g.beginPath(); g.arc(x,y,r,0,6.28); g.fill(); g.strokeStyle='#333'; g.lineWidth=2; g.stroke(); g.beginPath(); g.moveTo(x,y); g.lineTo(x+r*.8*Math.cos(t*(big?1.5:1)-1.57),y+r*.8*Math.sin(t*(big?1.5:1)-1.57)); g.stroke(); g.beginPath(); g.moveTo(x,y); g.lineTo(x+r*.5*Math.cos(t*.1),y+r*.5*Math.sin(t*.1)); g.stroke(); }
function windowBox(g,x,y,w,h,e){ g.fillStyle=e.dark?'#0e1530':e.skyTop||'#9ccbf0'; g.fillRect(x,y,w,h); if(e.city) city(g,0,0,e,0,{x,y,w,h}); if(e.dark){ g.fillStyle='#ffe9a8'; g.beginPath(); g.arc(x+w*.75,y+h*.3,h*.1,0,6.28); g.fill(); } g.strokeStyle='#fff'; g.lineWidth=3; g.strokeRect(x,y,w,h); g.beginPath(); g.moveTo(x+w/2,y); g.lineTo(x+w/2,y+h); g.stroke(); }
function lamp(g,x,y,t){ g.strokeStyle='#555'; g.beginPath(); g.moveTo(x,0); g.lineTo(x,y); g.stroke(); g.fillStyle=`rgba(255,220,140,${.6+.15*Math.sin(t*7)})`; g.beginPath(); g.arc(x,y+6,8,0,6.28); g.fill(); }
function sky(g,W,H,e){ const gr=g.createLinearGradient(0,0,0,H); gr.addColorStop(0,e.skyTop); gr.addColorStop(1,e.skyBot); g.fillStyle=gr; g.fillRect(0,0,W,H); if(e.dark){ (e.stars||[]).forEach(s=>{ g.fillStyle='rgba(255,255,255,.7)'; g.fillRect(s.x*W,s.y*H*.4,1.5,1.5); }); } }
function city(g,W,H,e,base,box){ const X=box?box.x:0, Y=box?box.y:0, BW=box?box.w:W, BH=box?box.h:H*base; let x=0,i=0; while(x<BW){ const bw=BW*(.08+((i*13+e.hue)%10)/100), bh=BH*(.35+((i*29+e.hue)%50)/100); g.fillStyle=e.dark?'#252b3a':'#7d8798'; g.fillRect(X+x,Y+BH-bh+(box?0:0)+(box?0:H*0),bw-2,bh); if(e.dark){ for(let yy=Y+BH-bh+4; yy<Y+BH-4; yy+=7) for(let xx=X+x+3; xx<X+x+bw-5; xx+=6) if((xx*3+yy+i)%4===0){ g.fillStyle='#ffd96a'; g.fillRect(xx,yy,2,3);} } x+=bw; i++; } }
function school(g,x,y,w,h){ g.fillStyle='#e8d6b0'; g.fillRect(x,y+h*.25,w,h*.75); g.fillStyle='#b5523b'; g.fillRect(x-w*.03,y+h*.15,w*1.06,h*.12); g.fillStyle='#fff'; g.beginPath(); g.arc(x+w/2,y+h*.38,h*.08,0,6.28); g.fill(); for(let r=0;r<2;r++) for(let c=0;c<4;c++){ g.fillStyle='#8fb7d6'; g.fillRect(x+w*(.08+c*.23),y+h*(.55+r*.2),w*.14,h*.12); } }
function trafficLight(g,x,y,H,t){ g.fillStyle='#222'; g.fillRect(x,y,H*.1,H*.28); const on=Math.floor(t*.7)%3; ['#f33','#fc3','#3c6'].forEach((c,i)=>{ g.fillStyle=i===on?c:'#444'; g.beginPath(); g.arc(x+H*.05,y+H*(.05+i*.09),H*.03,0,6.28); g.fill(); }); }
function monitorBeep(g,x,y,w,h,t){ g.fillStyle='#123'; g.fillRect(x,y,w,h); g.strokeStyle='#3f6'; g.lineWidth=1.5; g.beginPath(); for(let i=0;i<=w;i+=2){ const k=((i/w)+t*.5)%1; const yy=y+h/2-(k>.45&&k<.5?h*.35:k>.5&&k<.53?-h*.25:0); i?g.lineTo(x+i,yy):g.moveTo(x+i,yy); } g.stroke(); }

/* 장면 정의: [이모지, x, y, 크기(H 비율), 움직임] · 'ME' 'MOM' 'DAD' 'PARTNER'는 지금 상황에 맞게 바뀐다 */
const SC = {
  parents_fight:{bg:'home', night:true, a:[['DAD',.3,.7,.3,'shake'],['MOM',.5,.7,.3,'shake'],['💢',.4,.32,.14,'pulse'],['🚪',.86,.72,.32,''],['ME',.84,.74,.18,'peek']]},
  pc_bang_hyung:{bg:'pcbang', a:[['ME',.22,.82,.24,'bob'],['🧑',.62,.8,.26,'bob'],['🧑',.78,.8,.26,'bob2'],['💬',.7,.4,.14,'float']]},
  mom_asks:{bg:'room', night:true, a:[['ME',.68,.62,.22,'bob'],['MOM',.25,.74,.28,'lean'],['❓',.33,.36,.12,'float']]},
  talk_back:{bg:'classroom', board:'조용히 해!', a:[['🧑‍🏫',.72,.72,.3,'shake'],['ME',.3,.8,.24,'shake'],['💢',.36,.5,.12,'pulse'],['👀',.12,.84,.12,'']]},
  scooter:{bg:'road', a:[['🛵',.45,.78,.3,'ride'],['ME',.5,.62,.18,'ride'],['🧑',.4,.62,.18,'ride']]},
  runaway:{bg:'street', night:true, a:[['🏠',.18,.7,.3,''],['ME',.6,.8,.24,'walk'],['🎒',.66,.78,.1,'walk'],['🌙',.85,.18,.14,'']]},
  dropout:{bg:'classroom', board:'자퇴서', a:[['ME',.4,.8,.24,''],['📄',.55,.7,.12,'pulse'],['MOM',.75,.78,.26,'lean']]},
  geomjeong:{bg:'exam', a:[['ME',.5,.68,.22,'bob'],['✏️',.58,.66,.1,'write']]},
  gang_fight:{bg:'street', night:true, a:[['ME',.25,.82,.24,'shake'],['🧑',.13,.82,.22,'shake'],['🧑',.7,.82,.22,'shake'],['🧑',.82,.82,.22,'shake'],['⚡',.48,.6,.14,'pulse']]},
  hs_track:{bg:'crossroads', a:[['ME',.5,.86,.22,'bob'],['📚',.12,.55,.14,'float'],['📝',.5,.22,.14,'float'],['🎯',.88,.55,.14,'float']]},
  indep:{bg:'apart', a:[['ME',.45,.86,.22,'walk'],['📦',.58,.86,.13,'walk'],['🔑',.3,.5,.12,'float']]},
  marry:{bg:'cafe', night:true, a:[['ME',.28,.72,.24,'bob'],['PARTNER',.62,.72,.24,'bob2'],['💍',.45,.55,.1,'pulse'],['❤️',.45,.3,.1,'float']]},
  kids_plan:{bg:'home', a:[['ME',.3,.72,.24,'bob'],['PARTNER',.55,.72,.24,'bob2'],['🍼',.8,.6,.12,'float'],['💭',.45,.3,.14,'float']]},
  baby_career:{bg:'home', a:[['ME',.35,.74,.24,'bob'],['👶',.6,.7,.16,'bob2'],['💼',.82,.6,.12,'float']]},
  dad_leave:{bg:'office', a:[['ME',.35,.74,.24,'bob'],['🧑‍💼',.7,.74,.24,'shake'],['👶',.5,.36,.12,'float']]},
  late_divorce:{bg:'home', a:[['ME',.3,.62,.24,''],['PARTNER',.62,.62,.24,''],['📄',.46,.6,.1,'pulse']]},
  buy_house:{bg:'apart', a:[['ME',.3,.86,.22,'bob'],['💰',.42,.84,.12,'bob2'],['📈',.7,.3,.14,'float']]},
  headhunt:{bg:'office', a:[['ME',.42,.62,.22,'bob'],['📱',.55,.6,.1,'ring'],['✨',.7,.3,.1,'float']]},
  burnout:{bg:'subway', a:[['ME',.45,.7,.28,'sway'],['😵‍💫',.47,.36,.12,'pulse'],['🧑',.2,.72,.24,'sway'],['🧑',.75,.72,.24,'sway']]},
  quit_travel:{bg:'office', a:[['ME',.3,.62,.22,'bob'],['✈️',.6,.2,.12,'fly'],['🗼',.8,.35,.14,'']]},
  honorary_retire:{bg:'office', a:[['ME',.4,.66,.24,''],['📦',.55,.66,.12,''],['🌇',.8,.25,.14,'']]},
  chicken:{bg:'street', a:[['ME',.3,.84,.24,'bob'],['🍗',.62,.52,.16,'pulse'],['🏪',.62,.76,.26,'']]},
  delivery_bike:{bg:'road', a:[['🛵',.4,.8,.3,'ride'],['ME',.42,.64,.18,'ride'],['📦',.33,.68,.1,'ride']]},
  speeding_call:{bg:'road', a:[['🛵',.3,.8,.3,'ride'],['ME',.32,.64,.18,'ride'],['⏰',.6,.3,.12,'pulse']]},
  coin_allin:{bg:'room', night:true, a:[['ME',.45,.72,.24,'bob'],['📱',.55,.62,.1,'ring'],['📈',.25,.3,.12,'float'],['🪙',.7,.3,.1,'fall']]},
  drunk_drive:{bg:'street', night:true, a:[['ME',.3,.84,.24,'sway'],['🚗',.62,.84,.26,''],['🔑',.42,.62,.08,'pulse'],['🍺',.15,.5,.1,'float']]},
  parents_care:{bg:'hospital', a:[['DADOLD',.45,.6,.2,'breath'],['ME',.75,.74,.24,'bob']]},
  crisis:{bg:'room', night:true, rain:true, a:[['ME',.7,.7,.22,'breath'],['🌧️',.2,.2,.14,'']]},
  jeonse_scam:{bg:'apart', a:[['ME',.4,.86,.22,'shake'],['📄',.55,.6,.12,'pulse'],['☎️',.25,.6,.1,'ring']]},
  find_sport:{bg:'field', a:[['🧒',.6,.76,.22,'wave'],['🧒',.74,.76,.22,'wave2'],['⚽',.4,.6,.1,'ball'],['ME',.2,.8,.24,'bob']]},
  find_brain:{bg:'classroom', board:'(x+3)(x-2)=?', a:[['🧑‍🏫',.6,.72,.3,'point'],['ME',.25,.84,.22,'bob'],['❓',.35,.55,.1,'float']]},
  find_art:{bg:'classroom', board:'자유 주제', a:[['🎨',.6,.7,.16,'bob2'],['🖼️',.78,.62,.18,''],['ME',.35,.82,.24,'bob']]},
  pay_uiri:{bg:'cafe', a:[['ME',.3,.72,.24,'bob'],['📱',.42,.62,.1,'ring'],['🧑‍💼',.7,.72,.24,'bob2']]},
  pay_jeonu:{bg:'cafe', a:[['ME',.3,.72,.24,'bob'],['🧑‍💼',.65,.72,.24,'bob2'],['📊',.48,.4,.12,'float']]},
  pay_teacher:{bg:'cafe', night:true, a:[['ME',.3,.72,.24,'bob'],['👴',.65,.72,.24,''],['🍻',.48,.55,.1,'pulse']]},
  pay_runaway:{bg:'home', night:true, a:[['DADOLD',.3,.72,.26,''],['ME',.65,.72,.24,''],['🍶',.47,.62,.1,'pulse']]},
  pay_network:{bg:'cafe', a:[['ME',.3,.72,.24,'bob'],['📱',.42,.6,.1,'ring'],['🤝',.65,.4,.12,'float']]},
  career_change:{bg:'subway', a:[['ME',.45,.7,.28,'sway'],['💭',.6,.3,.16,'float'],['🧑',.15,.72,.24,'sway']]},
  ms_highschool:{bg:'gate', a:[['ME',.5,.88,.22,'bob'],['🏫',.18,.5,.12,'float'],['🏛️',.82,.5,.12,'float']]},
  ms_suneung:{bg:'exam', a:[['ME',.5,.66,.22,'bob'],['✏️',.58,.64,.09,'write'],['📝',.3,.6,.1,'']]},
  ms_college:{bg:'room', night:true, a:[['ME',.45,.7,.24,'bob'],['💻',.6,.64,.12,''],['🎓',.25,.3,.14,'float']]},
  ms_army:{bg:'home', a:[['ME',.6,.74,.24,'shake'],['✉️',.42,.6,.12,'pulse'],['MOM',.25,.74,.26,'lean']]},
  ms_dol:{bg:'home', a:[['👶',.5,.72,.2,'bob'],['✏️',.2,.5,.09,'float'],['⚽',.35,.42,.09,'float'],['🎤',.65,.42,.09,'float'],['💴',.8,.5,.09,'float'],['MOM',.12,.74,.24,'lean'],['DAD',.88,.74,.24,'lean']]},
  ms_dream:{bg:'room', a:[['ME',.5,.78,.24,'bob'],['💭',.66,.4,.14,'float'],['🩺',.16,.28,.1,'float'],['⚽',.34,.18,.1,'float'],['🎤',.84,.24,.1,'float'],['💻',.9,.5,.1,'float'],['🎨',.1,.55,.1,'float']]},
  ms_track:{bg:'crossroads', a:[['ME',.5,.88,.22,'bob'],['🏢',.12,.5,.12,'float'],['🏛️',.3,.25,.12,'float'],['🏥',.7,.25,.12,'float'],['🎨',.88,.5,.12,'float']]},
  ms_hunt:{bg:'interview', a:[['🧑‍💼',.15,.45,.2,'nod'],['🧑‍💼',.33,.45,.2,'nod2'],['🧑‍💼',.51,.45,.2,'nod'],['ME',.78,.78,.26,'shake']]},
  ms_talentfind:{bg:'classroom', a:[['🧑‍🏫',.7,.72,.3,''],['ME',.3,.82,.24,'bob']]},
  news:{bg:'room', a:[['ME',.3,.74,.24,'bob'],['📺',.68,.55,.24,'pulse']]},
  think:{bg:'hill', a:[['ME',.5,.78,.22,'breath']]},
};
function sceneSpec(p){
  if(p.think) return SC.think;
  const d=p.d;
  if(d.kind==='ev' && SC[d.id]) return SC[d.id];
  if(d.kind==='ms' && SC['ms_'+d.name]) return SC['ms_'+d.name];
  if(d.kind==='news') return {...SC.news, news:p.card.headline};
  const k=sceneKind(p); const map={school:'classroom',hearts:'cafe',money:'apart',army:'army',city:'office',home:'home',road:'road',ball:'field',paint:'classroom',rain:'room',news:'room'};
  return {bg:map[k]||pick(['street','home','cafe','apart']), a:[['ME',.45,.8,.24,'bob']]};
}
function resolveActor(S,e){ return e==='ME'?meEmoji(S): e==='MOM'?momEmoji(S): e==='DAD'?dadEmoji(S): e==='DADOLD'?(S.gender==='F'?'👴':'👴'): e==='PARTNER'?partnerEmoji(S): e; }
function animOff(an,t,k){ switch(an){
  case 'bob': return [0,Math.sin(t*2+k)*.012,0]; case 'bob2': return [0,Math.sin(t*2.3+1+k)*.012,0];
  case 'shake': return [Math.sin(t*22+k)*.006,0,Math.sin(t*11)*.05]; case 'pulse': { const s=1+.12*Math.sin(t*5); return [0,0,0,s]; }
  case 'float': return [Math.sin(t+k)*.01,Math.sin(t*1.5+k)*.03,0]; case 'walk': return [((t*.05)%.3)-.15,Math.abs(Math.sin(t*6))*-.01,0];
  case 'ride': return [Math.sin(t*1.5)*.02,Math.sin(t*20)*.004,0]; case 'peek': return [Math.sin(t*.8)*.02,0,0];
  case 'lean': return [0,0,Math.sin(t*1.2)*.06]; case 'sway': return [Math.sin(t*1.5+k)*.008,0,Math.sin(t*1.5+k)*.05];
  case 'ring': return [Math.sin(t*40)*.004,0,Math.sin(t*40)*.15]; case 'fly': return [((t*.12)%1.3)-.6,Math.sin(t)*.02,0];
  case 'fall': return [0,((t*.3)%1)*.5-.2,t]; case 'write': return [Math.sin(t*8)*.01,Math.sin(t*16)*.004,.2];
  case 'wave': return [0,0,Math.sin(t*6)*.2]; case 'wave2': return [0,0,Math.sin(t*6+1)*.2];
  case 'point': return [0,0,Math.sin(t*3)*.08]; case 'nod': return [0,Math.abs(Math.sin(t*2))*.01,0]; case 'nod2': return [0,Math.abs(Math.sin(t*2+1))*.01,0];
  case 'breath': { const s=1+.03*Math.sin(t*1.6); return [0,0,0,s]; }
  case 'ball': return [Math.sin(t*1.7)*.18, -Math.abs(Math.sin(t*3.2))*.3,t*4];
  default: return [0,0,0]; } }
const _startAbstract = startScene;
startScene = function(p){
  stopScene();
  const cv=document.getElementById('scene'); if(!cv) return;
  const spec=sceneSpec(p);
  const dpr=Math.min(2,window.devicePixelRatio||1), W=cv.clientWidth||340, H=cv.clientHeight||150;
  cv.width=W*dpr; cv.height=H*dpr; const g=cv.getContext('2d'); g.scale(dpr,dpr);
  const R0=Math.random, m=S.monthDone||6;
  // 매번 다른 변주: 시간대 · 날씨 · 행인 · 위치 흔들림
  const tod = spec.night? 'night' : pick(['morning','day','day','sunset','night']);
  const SKY={morning:['#ffd9b0','#bfe3ff'],day:['#7cc0f2','#d6eeff'],sunset:['#ff9a6b','#ffd8a8'],night:['#0d1430','#26355f']};
  const env={dark:tod==='night', skyTop:SKY[tod][0], skyBot:SKY[tod][1], hue:Math.floor(R0()*360), board:spec.board, stars:Array.from({length:40},()=>({x:R0(),y:R0(),a:R0()*6}))};
  const outdoor0=['street','road','field','apart','army','gate','crossroads','hill'].includes(spec.bg);
  const weather = spec.rain? 'rain' : !outdoor0? null : (m<=2||m===12)&&R0()<.6? 'snow' : (m>=3&&m<=4)&&R0()<.6? 'petal' : m===7&&R0()<.6? 'rain' : null;
  const outdoor=['street','road','field','apart','army','gate','crossroads','hill'].includes(spec.bg);
  const parts=Array.from({length:weather?40:0},()=>({x:R0(),y:R0(),v:.3+R0()*.7}));
  const conf=Array.from({length:spec.fx==='confetti'?60:0},()=>({x:R0(),y:R0(),v:.5+R0(),h:Math.floor(R0()*360)}));
  const jit=spec.a.map(()=>[(R0()-.5)*.04,(R0()-.5)*.02]);
  const extras = outdoor && !spec.night && R0()<.7 ? Array.from({length:1+Math.floor(R0()*3)},()=>({e:pick(['🚶','🚶‍♀️','🧍','🐕','🚲']), x:R0(), y:.86+R0()*.06, v:(R0()<.5?-1:1)*(.02+R0()*.04)})) : [];
  const actors=spec.a.map(([e,x,y,s,an],i)=>({e:resolveActor(S,e), x:x+jit[i][0], y:y+jit[i][1], s, an, me:e==='ME'}));
  const tick=tm=>{
    const t=tm/1000;
    g.clearRect(0,0,W,H);
    if(spec.fx==='shake'){ g.save(); g.translate(Math.sin(t*41)*3.5, Math.cos(t*33)*2.5); }
    (BG[spec.bg]||BG.street)(g,W,H,{...env,t});
    extras.forEach(x=>{ x.x+=x.v/60; if(x.x>1.1) x.x=-.1; if(x.x<-.1) x.x=1.1; g.font=`${H*.14}px serif`; g.textAlign='center'; g.fillStyle='#000'; g.globalAlpha=.85; g.fillText(x.e, x.x*W, x.y*H); g.globalAlpha=1; });
    actors.forEach((a,k)=>{
      const [dx,dy,rot,sc]=animOff(a.an,t,k), fs=H*a.s*(sc||1);
      const X=(a.x+dx)*W, Y=(a.y+dy)*H;
      if(a.me){ g.fillStyle='rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(X,Y+fs*.05,fs*.42,fs*.1,0,0,6.28); g.fill(); }
      g.save(); g.translate(X,Y); g.rotate(rot||0); g.fillStyle='#000'; g.globalAlpha=1; g.font=`${fs}px "Noto Color Emoji","Apple Color Emoji","Segoe UI Emoji",serif`; g.textAlign='center'; g.textBaseline='bottom'; g.fillText(a.e,0,0); g.restore();
      if(a.me){ g.font=`bold ${Math.max(10,H*.07)}px sans-serif`; g.textAlign='center'; g.textBaseline='alphabetic'; g.fillStyle=env.dark?'#fff':'#1a2132'; g.fillText('나', X, Y-fs-2); }
    });
    if(weather){ parts.forEach(q=>{ q.y+=q.v*(weather==='rain'?.03:.006); q.x+=weather==='petal'?Math.sin(t+q.v*9)*.002:weather==='rain'?-.004:Math.sin(t+q.v*5)*.001; if(q.y>1){ q.y=-.05; q.x=R0(); }
      if(weather==='rain'){ g.strokeStyle='rgba(200,220,255,.6)'; g.lineWidth=1; g.beginPath(); g.moveTo(q.x*W,q.y*H); g.lineTo(q.x*W-3,q.y*H+8); g.stroke(); }
      else { g.fillStyle=weather==='snow'?'rgba(255,255,255,.9)':'rgba(255,170,200,.85)'; g.beginPath(); g.arc(q.x*W,q.y*H,weather==='snow'?2:2.5,0,6.28); g.fill(); } }); }
    if(spec.fx==='shake') g.restore();
    if(spec.fx==='flash'){ const fa=Math.max(0,Math.sin(t*2.6))**14; if(fa>.01){ g.fillStyle=`rgba(255,255,240,${fa*.85})`; g.fillRect(0,0,W,H); } }
    if(spec.fx==='confetti'){ conf.forEach(c=>{ c.y+=c.v*.006; c.x+=Math.sin(t*3+c.v*7)*.002; if(c.y>1.05){ c.y=-.05; c.x=R0(); } g.save(); g.translate(c.x*W,c.y*H); g.rotate(t*4+c.v*9); g.fillStyle=`hsl(${c.h},85%,60%)`; g.fillRect(-3,-1.5,6,3); g.restore(); }); }
    if(spec.news){ g.fillStyle='rgba(180,40,40,.92)'; g.fillRect(0,H*.88,W,H*.12); g.fillStyle='#fff'; g.font=`bold ${H*.07}px sans-serif`; g.textAlign='left'; g.textBaseline='middle'; const msg='속보 · '+spec.news+'   '; const mw=g.measureText(msg).width; let x=-((t*50)%mw); while(x<W){ g.fillText(msg,x,H*.94); x+=mw; } }
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches && document.getElementById('scene')===cv) sceneRAF=requestAnimationFrame(tick);
  };
  sceneRAF=requestAnimationFrame(tick);
};
