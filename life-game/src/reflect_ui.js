// 장면 그림도 순간에 맞게
Object.assign(SC, {
  think_suneung:{bg:'exam', a:[['ME',.5,.7,.24,'breath'],['📄',.62,.62,.1,'pulse']]},
  think_job:{bg:'street', a:[['ME',.45,.86,.24,'walk'],['💼',.53,.82,.1,'walk']]},
  think_marry:{bg:'hall', a:[['ME',.4,.8,.26,'bob'],['PARTNER',.6,.8,.26,'bob2'],['💐',.5,.5,.12,'float']]},
  think_baby:{bg:'hospital', a:[['ME',.55,.76,.26,'breath'],['👶',.45,.6,.14,'breath']]},
  think_parents:{bg:'home', night:true, a:[['ME',.5,.74,.24,'breath'],['🖼️',.75,.4,.14,''],['🕯️',.3,.62,.1,'pulse']]},
  think_retire:{bg:'subway', a:[['ME',.5,.72,.28,'sway'],['🌇',.2,.28,.12,'']]},
  think_sick:{bg:'hospital', a:[['ME',.45,.6,.2,'breath']]},
});
SC.think.night=true;
const _ss = sceneSpec;
sceneSpec = function(p){ if(p.think && p.d && p.d.mk && SC['think_'+p.d.mk]) return SC['think_'+p.d.mk]; return _ss(p); };


Object.assign(SC, {
  cousin_compare:{bg:'home', a:[['👩',.25,.72,.28,'lean'],['🧒',.12,.76,.2,''],['ME',.62,.76,.22,'shake'],['MOM',.82,.72,.26,'bob'],['🏆',.25,.36,.1,'float']]},
  sibling_favor:{bg:'home', a:[['MOM',.35,.72,.28,'bob'],['🧒',.5,.74,.18,'bob2'],['ME',.82,.76,.22,'peek']]},
  money_stress:{bg:'home', night:true, a:[['MOM',.4,.72,.28,'breath'],['🧾',.55,.62,.1,'pulse'],['🧮',.3,.62,.1,''],['ME',.84,.76,.22,'peek']]},
});
