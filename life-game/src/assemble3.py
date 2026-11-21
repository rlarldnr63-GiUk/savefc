import os
d=os.path.dirname(os.path.abspath(__file__))
js='\n'.join(open(os.path.join(d,f),encoding='utf-8').read() for f in ['data_core.js','events2.js','extra.js','news.js','engine.js','flow.js','realtime.js','talent.js','story.js','snowball.js','jobs2.js','fixes.js','mbti.js','names.js','marriage.js','reflect.js','socdata.js','life2.js','rare.js','income.js','tune.js','dream.js','dol.js','jobs_life.js','celeb.js','news_live.js'])
ui=open(os.path.join(d,'ui3.html'),encoding='utf-8').read().replace('/*GAME*/',js).replace('/*SCENE*/',open(os.path.join(d,'scene.js'),encoding='utf-8').read()+'\n'+open(os.path.join(d,'scene2.js'),encoding='utf-8').read()+'\n'+open(os.path.join(d,'reflect_ui.js'),encoding='utf-8').read()+'\n'+open(os.path.join(d,'rare_ui.js'),encoding='utf-8').read()+'\n'+open(os.path.join(d,'funeral.js'),encoding='utf-8').read()+'\n'+open(os.path.join(d,'dol_ui.js'),encoding='utf-8').read()+'\n'+open(os.path.join(d,'death_ui.js'),encoding='utf-8').read()).replace('/*TIPS*/',open(os.path.join(d,'tips.js'),encoding='utf-8').read())
open(os.path.join(d,'..','오천만분의일.html'),'w',encoding='utf-8').write(ui)
print('ok',len(ui))
