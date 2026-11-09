(function(){
'use strict';
const KEY='writ100_v1';
let S={ans:{},plan:{},cards:{},drafts:{},mock:{}};
try{const r=localStorage.getItem(KEY); if(r) S=Object.assign(S,JSON.parse(r));}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}

const COURSES=window.COURSES||{};
const CQ=[]; Object.values(COURSES).forEach(c=>{c.qs.forEach(q=>{q.c=c.id;CQ.push(q);}); (c.extra||[]).forEach(q=>{q.c=c.id;q.mockOnly=true;CQ.push(q);});});
const ALL=[...window.BANK,...window.MOCK_EXTRA,...CQ];
const BYID={}; ALL.forEach(q=>BYID[q.id]=q);
const AUTO=t=>['mc','order','match','gap','fill'].includes(t);
const norm=s=>String(s||'').toLowerCase().replace(/[’']/g,"'").replace(/[.,!?;:"“”()]/g,' ').replace(/\b(a|an|the|to)\b/g,' ').replace(/[-–]/g,' ').replace(/\s+/g,' ').trim();
function fillOk(v,acc){const u=norm(v); if(!u) return false; return acc.some(a=>{const n=norm(a); return u===n||(n.length>3&&u.includes(n)&&u.length<=n.length+14);});}
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const app=$('#app');
const UNAMES={1:'Unit 1 · Paragraphs',2:'Unit 2 · Instructions',3:'Unit 3 · Recount'};

// ---------------- ANALYZER ----------------
const STOP=new Set('the a an and or but so to of in on at for with from by is are was were be been it its they them their there this these that those i my me we our you your he she his her not do did does can could will would should must have has had very also then first next after finally some many more most than when what which who where how into about just only too as if because while all any each every other another one two three such out up down over again before back time students student people'.split(' '));
const RX={
 major:/^(first(ly| of all)?|second(ly)?|third(ly)?|also|in addition|moreover|furthermore|another|finally|to begin with|besides|lastly)\b/i,
 example:/\b(for example|for instance|to illustrate|to give an example|such as)\b/i,
 concl:/^(in conclusion|to conclude|in short|to sum up|overall|for these reasons|for all these reasons|that is why|all in all|in summary|therefore|in brief)\b/i,
 ref:/\b(it|they|them|there|this|these|its|their|he|she|his|her)\b/i,
 tsWords:/\b(advantages?|benefits?|beneficial|reasons?|good|great|excellent|perfect|convenient|comfortable|useful|important|helpful|popular|enjoyable|ideal|best|favourite|favorite|pleasant|several|many|ways?|helps?|harmful|problems?|disadvantages?|qualit(y|ies)|features?|characteristics|effects?|types?|kinds?|wonderful|interesting|healthy|healthier|lively|practical|quiet|recommend|worth)\b/i,
 steps:/\b(steps?|easy|simple|simply|follow|instructions?|methods?|ways?|planning|plan|preparation|techniques?|guide|carefully)\b/i,
 seq:/^(first(ly)?|second(ly)?|third|next|then|after that|afterwards|finally|in the next step|now|lastly|to begin with|after this)\b/i,
 warn:/\b(make sure|be careful|remember to|remember not to|do not|don['’]t|never|don['’]t forget|do not forget|be sure)\b/i,
 modal:/\byou (should|must|have to|need to|can|could|will)\b/i,
 detail:/(\d|\bsuch as\b|\bminutes?\b|\bseconds?\b|\bhours?\b|\bcm\b|\bkg\b|\bml\b|teaspoons?|\bbutton\b|\bclick\b|\bpage\b|\bscreen\b|\bfolder\b|\bfile\b|\bleft\b|\bright\b|\btop\b|\bbottom\b|next to|inside|on the|in the|into)/i,
 result:/\b(ready|in this way|now|will|done|successfully|on its way|safe|clean|finished|result)\b/i,
 time:/\b(last|yesterday|ago|one (day|morning|evening|afternoon|night)|on my|in (19|20)\d\d|this morning|that (morning|day|evening)|when i was|during|on (monday|tuesday|wednesday|thursday|friday|saturday|sunday)|summer|winter|spring|autumn|semester|weekend|holiday|first day|month|week|year|night)\b/i,
 who:/\b(i|we|my)\b/i,
 where:/\b(at|in|on|near|around|inside|to)\s+(the|a|an|my|our|his|her|their|campus|home|school|university|work|[A-ZÇĞİÖŞÜ])/,
 tm:/^(first|at first|then|next|after that|afterwards|a few (minutes|seconds|hours) later|suddenly|just then|finally|in the end|later|when|that morning|halfway|one day|one morning|soon|after (a while|class|lunch|the)|before|meanwhile|at \d)/i,
 tmAny:/\b(first|at first|then|next|after that|afterwards|a few (minutes|seconds|hours) later|suddenly|just then|finally|in the end|later)\b/i,
 present:/\b(am|is|are)\b/i,
 presentI:/\b(i|we) (go|run|wake|feel|see|arrive|check|walk|take|get|have|find|think|want|look|try|start|decide|realise|realize|open|close|leave|come|eat|drink|buy|say|tell|meet|lose|forget|know|hear|sit|stand|cook|play|watch|study)\b/i,
 didPast:/\bdid(n['’]t| not) (\w+ed|went|saw|found|felt|took|left|came|got|had|made|ran|knew|thought|bought|brought|ate|drank|woke|forgot|lost|heard|said|told|gave|wrote|spoke)\b/i,
 wasPast:/\b(was|were) (went|saw|did|came|ran|took|got|left|found|had|made|felt|thought)\b/i,
 show:/(heart|hands?|face|voice|eyes|legs|palms|shaking|beating|sweat|smil|tears|cold|loud|smell|quiet|silent|noise|dark|bright|turned red|stomach|breath|shoulders|could see|could hear|could not stop|couldn['’]t stop|laugh|shout|scream|jump|trembl|cry|cried|freez|warm|hot|wet|soaked)/i,
 tell:/\bI (was|felt) (very |so |really |a bit |quite )?(nervous|scared|happy|sad|worried|tired|excited|angry|embarrassed|afraid|bad|good|stressed)\b/i,
 reo:/(looking back|in the end|overall|i felt|i learned|i learnt|it was|now i|from then on|next time|i still|that day|i will never|lesson|never forget|unforgettable|worth it|i realised|i realized|proud|enjoyed)/i,
 irregular:/\b(was|were|went|saw|felt|found|ran|left|took|came|got|had|made|bought|thought|told|began|ate|drank|woke|forgot|lost|put|cut|sat|stood|heard|said|gave|knew|brought|caught|fell|rang|wrote|spoke|broke|chose|met|spent|sent|understood|won|kept|slept|could|did|became|held|swam|drove|flew|rode|taught|felt)\b/i
};
function sentences(t){
  const x=t.replace(/\s+/g,' ').trim(); if(!x) return [];
  const m=x.match(/[^.!?]+[.!?]+["”’')]*\s*|[^.!?]+$/g)||[];
  return m.map(s=>s.trim()).filter(s=>s.replace(/[^A-Za-z]/g,'').length>1);
}
function words(s){return (s.toLowerCase().match(/[a-zçğıöşü']+/g)||[]);}
function content(s){return words(s).filter(w=>w.length>3&&!STOP.has(w));}
function overlap(a,b){const A=new Set(content(a)),B=new Set(content(b)); if(!A.size||!B.size) return 0; let n=0; A.forEach(w=>{if(B.has(w))n++}); return n/Math.min(A.size,B.size);}
function strip(s){return s.replace(/^["“'(]+/,'').replace(RX.seq,'').replace(/^\s*,?\s*/,'');}
const PRON=/^(i|you|we|he|she|they|it|the|a|an|my|your|this|that|these|there|in|now|our|his|her|their|its|when|if|because|as|after|before|while|all|some|many|people|students)\b/i;
function noQuotes(s){return s.replace(/["“][^"”]*["”]/g,'');}

function analyze(text,mode,q){
  const R=[]; const ok=m=>R.push({k:'ok',m}), wn=m=>R.push({k:'warn',m}), no=m=>R.push({k:'no',m});
  const t=(text||'').trim(); if(!t) return R;
  const S_=sentences(t), n=S_.length;
  const isPara=/^para-/.test(mode)&&mode!=='para-instr-short';
  // ortak kontroller
  if(isPara){
    const rng=mode==='para-recount'?[6,8]:[7,9];
    if(n>=rng[0]&&n<=rng[1]) ok(`${n} cümle (hedef ${rng[0]}–${rng[1]}).`);
    else if(n>=rng[0]-1&&n<=rng[1]+1) wn(`${n} cümle. Hedef ${rng[0]}–${rng[1]}, sorudaki sayıya uy.`);
    else no(`${n} cümle. Hedef ${rng[0]}–${rng[1]}! Cümle sayısı puan kalemi.`);
    if(/\n\s*\S/.test(t.trim())) wn('Metinde satır atlama var. Sınavda TEK paragraf yaz, alt satıra geçme.');
  } else ok(`${n} cümle algılandı.`);
  const lowStart=S_.filter(s=>{const c=s.replace(/^["“'(\d.\s]+/,'').charAt(0); return c && c!==c.toUpperCase();});
  if(lowStart.length) no(`Küçük harfle başlayan cümle: "${esc(lowStart[0].slice(0,40))}…"`);
  if(mode!=='free'&&!/[.!?]["”’')]*$/.test(t)) no('Son cümle nokta ile bitmiyor.');
  if(/(^|\s)i(\s|'|’|$)/.test(t)) no('"i" küçük yazılmış, her zaman büyük "I" yaz.');
  const frag=S_.find(s=>/^(because|although|while|since)\b/i.test(s)&&!/,/.test(s));
  if(frag) no(`Fragment olabilir: "${esc(frag.slice(0,45))}…" Because/Although ile başlayan cümle tek başına tam cümle değildir.`);

  const first=S_[0]||'', last=S_[n-1]||'';
  if(mode==='para-idea'){
    if(/\?$/.test(first)) no('Topic sentence soru olamaz.');
    else if(RX.tsWords.test(first)) ok('Topic sentence\'ta controlling idea kelimesi var.');
    else wn('Topic sentence\'ta controlling idea net mi? (advantages / benefits / a good place to… / reasons)');
    if(RX.major.test(first)) wn('İlk cümle "First/In addition…" ile başlıyor. İlk cümle topic sentence olmalı.');
    const mid=S_.slice(1,-1), maj=mid.filter(s=>RX.major.test(s)).length;
    if(maj>=3) ok(`${maj} major detail sinyali var (First / In addition / Finally…).`);
    else if(maj===2) wn('2 major sinyali var. Görev genelde 3 major detail istiyor.');
    else no('Major detail sinyali az. First, / In addition, / Finally, kullan.');
    if(mid.some(s=>RX.example.test(s))) ok('Örnek sinyali var (For example / For instance / such as).');
    else wn('Minor detail için "For example, / For instance," kullanmadın. En az bir tane ekle.');
    const sig=S_.filter(s=>RX.major.test(s)||RX.concl.test(s)||/^(for example|for instance)/i.test(s)).length;
    if(n>4&&sig>=n) wn('Her cümle signalling word ile başlıyor, bu mekanik görünür. Minor cümlelerin bazılarında kullanma.');
    if(RX.concl.test(last)) ok('Concluding signal var.'); else no('Son cümle concluding signal ile başlamıyor (In conclusion / For these reasons / To sum up / Overall…).');
    if(n>1&&overlap(first,last)>0.8) no('Concluding sentence topic sentence\'a çok benziyor. Kelimeleri ve yapıyı değiştir.');
    if(/\b(also|another|in addition|for example|for instance)\b/i.test(last)) wn('Son cümlede yeni fikir/örnek sinyali var. Concluding sentence yeni bilgi vermez.');
  }
  if(mode==='para-instr'||mode==='para-instr-short'){
    if(mode==='para-instr'){
      if(RX.steps.test(first)&&!RX.seq.test(first)) ok('Topic sentence görevi tanıtıp adımların geleceğini söylüyor.');
      else no('Topic sentence görevi + "steps" fikrini içermeli: "You can … in a few simple steps." / "… is easy if you follow these steps."');
      if(/^(writing|making|using)\s[^.]*\.$/i.test(first)&&words(first).length<5) no('Topic sentence tam cümle değil (ör. "Writing a lab report.").');
    }
    const body=mode==='para-instr'?S_.slice(1):S_;
    const modals=body.filter(s=>RX.modal.test(noQuotes(s)));
    if(modals.length) no(`Adımlarda "you should / you must / you can…" var: "${esc(modals[0].slice(0,45))}…". Base verb ile başla (Open… / Add…).`);
    else ok('Adımlarda "you should/must" yok.');
    const imp=body.filter(s=>!PRON.test(strip(s))).length;
    if(imp>=3) ok(`${imp} cümle imperative görünüyor.`); else wn('Imperative cümle az görünüyor. Adımları fiille başlat (Open, Add, Check…).');
    const sq=body.filter(s=>RX.seq.test(s));
    if(sq.length>=3) ok(`${sq.length} sequence word var.`); else no('Sequence word az (First, Next, Then, After that, Finally).');
    const iF=S_.findIndex(s=>/^finally\b/i.test(s)), iFi=S_.findIndex(s=>/^first\b/i.test(s));
    if(iF>-1&&iFi>-1&&iF<iFi) no('"Finally" "First"ten önce geliyor, sıra mantıksız.');
    if(mode==='para-instr'){
      if(S_.some(s=>RX.warn.test(s))) ok('Warning/check var.'); else no('Warning/check yok! (Make sure… / Be careful… / Do not… / Remember to…)');
      if(body.some(s=>RX.detail.test(s))) ok('Faydalı detay var gibi (where / how much / which button).'); else wn('Useful detail ekle: how much, how long, where, which button.');
      const lastStrip=strip(last);
      if(RX.seq.test(last)&&!/^now\b/i.test(last)) no('Son cümle "Finally/Then…" ile başlıyor, yani bu bir adım. Ondan sonra bir RESULT cümlesi ekle.');
      else if(!PRON.test(lastStrip)&&!/^(now|in this way|your|this)/i.test(last)) no('Son cümle yeni bir adım gibi görünüyor. Sonucu göster: "Your … is now ready." / "In this way, …"');
      else if(RX.result.test(last)) ok('Son cümle sonucu gösteriyor.');
      else wn('Son cümle sonucu gösteriyor mu? (… is now ready / In this way, …)');
    }
  }
  if(mode==='para-recount'){
    if(RX.time.test(first)) ok('Orientation: WHEN var.'); else no('Orientation\'da WHEN yok (Last Saturday / Two weeks ago / One day…).');
    if(RX.who.test(first)) ok('Orientation: WHO var.'); else no('Orientation\'da WHO yok (I / my friend and I).');
    if(RX.where.test(first)) ok('Orientation: WHERE var gibi.'); else wn('Orientation\'da WHERE belirgin değil (at / in + yer).');
    const tms=S_.slice(1).filter(s=>RX.tm.test(s)||/\bsuddenly\b/i.test(s)).length;
    if(tms>=3) ok(`${tms} time marker var.`); else no('Time marker az. Her olayın başına bir tane koy (First, Then, A few minutes later, Suddenly, Finally…).');
    const prs=S_.filter(s=>{const x=noQuotes(s); return RX.present.test(x)||RX.presentI.test(x)||/\b(do not|don['’]t|does|doesn['’]t)\b/i.test(x);});
    if(prs.length) wn(`Present tense olabilir: "${esc(prs[0].slice(0,50))}…". Recount PAST SIMPLE ile yazılır (am/is → was, go → went). Reorientation'daki "now I always…" kabul edilir.`);
    const dp=S_.find(s=>RX.didPast.test(s)); if(dp) no(`"did not + V2" hatası: "${esc(dp.slice(0,45))}…" (did not + base verb: did not find).`);
    const wp=S_.find(s=>RX.wasPast.test(s)); if(wp) no(`"was + V2" hatası: "${esc(wp.slice(0,45))}…"`);
    const past=(t.match(/\b\w+ed\b/gi)||[]).length+(t.match(new RegExp(RX.irregular.source,'gi'))||[]).length;
    if(past>=5) ok('Past simple fiiller kullanılmış.'); else wn('Past simple fiil az görünüyor.');
    if(RX.show.test(t)) ok('Sensory/feeling detail var gibi (show, don\'t tell).'); else no('Sensory/feeling detail yok! "My hands were shaking…" gibi gösteren bir cümle ekle.');
    if(RX.tell.test(t)&&!RX.show.test(t)) wn('Duyguyu sadece söylüyorsun ("I was nervous"). Detayla göster.');
    if(/^(then|next|after that|a few)/i.test(last)) no('Son cümle yeni bir olay gibi. Reorientation duygu/yorum/ders olmalı.');
    else if(RX.reo.test(last)) ok('Reorientation duygu/yorum/ders veriyor.');
    else wn('Son cümle reorientation mı? (Looking back, … / In the end, I felt … / That day, I learned …)');
    if(/\byou\b/i.test(noQuotes(t))) wn('"you" kullanmışsın. Recount\'ta I/my ile tutarlı ol.');
  }
  if(mode==='ts'||mode==='ts-instr'){
    if(n>1) wn('Tek cümle istenir.');
    if(/\?$/.test(first)) no('Topic sentence soru olamaz.');
    if(words(first).length<5) no('Çok kısa. Başlık değil tam cümle yaz (özne + fiil + controlling idea).');
    if(mode==='ts'){ if(RX.tsWords.test(first)) ok('Controlling idea kelimesi var.'); else wn('Controlling idea net değil (benefits / advantages / a good place to… / reasons).'); }
    else { if(RX.steps.test(first)) ok('Steps/instructions fikri var.'); else no('"in a few simple steps / easy if you follow these steps" gibi bir ifade ekle.');
      if(!PRON.test(first)&&!/^(\w+ing)\b/i.test(first)) wn('Topic sentence imperative olmamalı; görevi tanıtmalı.'); }
  }
  if(mode==='orient'){
    if(RX.time.test(t)) ok('WHEN var.'); else no('WHEN eksik.');
    if(RX.who.test(t)||/\b(friends|roommate|classmates|sister|brother|family|sylvia)\b/i.test(t)) ok('WHO var.'); else no('WHO eksik.');
    if(RX.where.test(t)) ok('WHERE var gibi.'); else no('WHERE eksik (at / in + yer).');
    if(RX.present.test(t)||RX.presentI.test(t)) no('Past simple kullan (had / got / missed…).'); else if(/\b\w+ed\b/i.test(t)||RX.irregular.test(t)) ok('Past simple fiil var.');
  }
  if(mode==='concl'||mode==='reo'){
    if(mode==='concl'){ if(RX.concl.test(first)) ok('Concluding signal ile başlıyor.'); else no('Concluding signal ile başla (In conclusion, / To sum up, / Overall, / For these reasons,).');
      const m=(q&&q.info||'').match(/TS:\s*([^|<]+)/); if(m&&overlap(m[1],t)>0.8) no('Topic sentence\'ın neredeyse kopyası. Kelimeleri değiştir.');
      if(/\b(also|another|for example)\b/i.test(t)) wn('Yeni bilgi/örnek ekleme.'); }
    else { if(/^(then|next|after that|a few)/i.test(t)) no('Yeni olay gibi başlıyor.'); if(RX.reo.test(t)) ok('Duygu/yorum/ders ifadesi var.'); else wn('Final feeling / comment / lesson ifadesi kullan.'); }
  }
  if(mode==='warn'){ if(RX.warn.test(t)) ok('Warning ifadesi var.'); else no('Make sure / Be careful / Remember to / Do not / Don\'t forget to ile yaz.'); }
  if(mode==='show'){ if(RX.show.test(t)) ok('Gösteren detay var.'); else no('Vücut tepkisi / duyusal detay ekle (hands shaking, heart beating fast, couldn\'t stop smiling…).');
    if(RX.tell.test(t)) wn('Hâlâ "I was …" diye duyguyu söylüyorsun. Sadece göstermeyi dene.'); }
  if(mode==='imp'){ const md=S_.filter(s=>RX.modal.test(s)); if(md.length) no('"you should / must / need to" kaldır.'); else ok('Modal yok.');
    const bad=S_.filter(s=>{const x=s.replace(/^(warning\s*\/?\s*check:|warning:)/i,'').trim(); return PRON.test(strip(x))&&!RX.warn.test(x);});
    if(bad.length) wn(`Fiille başlamayan cümle: "${esc(bad[0].slice(0,40))}…"`); else ok('Cümleler fiille başlıyor.'); }
  if(mode==='past'){ const prs=S_.filter(s=>RX.present.test(noQuotes(s))||RX.presentI.test(noQuotes(s))); if(prs.length) no(`Present tense: "${esc(prs[0].slice(0,40))}…"`); else ok('Present tense hatası görünmüyor.');
    const dp=S_.find(s=>RX.didPast.test(s)); if(dp) no('did not + V2 hatası (did not + base verb olmalı).');
    if(q&&/time markers?/i.test(q.q)){ const c=S_.filter(s=>RX.tm.test(s)).length; if(c>=2) ok(`${c} time marker.`); else no('En az 2 time marker kullan.'); } }
  if(mode==='res'){ if(!PRON.test(strip(first))&&!/^(now|in this way|your)/i.test(first)) no('Yeni adım gibi görünüyor. Sonucu yaz.'); else ok('Sonuç cümlesi.'); }
  // tekrar kontrolü (paragraflar)
  if(isPara){
    const freq={}; content(t).forEach(w=>freq[w]=(freq[w]||0)+1);
    const rep=Object.entries(freq).filter(([w,c])=>c>=5).sort((a,b)=>b[1]-a[1]);
    if(rep.length) wn(`"${rep[0][0]}" ${rep[0][1]} kez geçiyor. Reference word kullan (it / they / there / this).`);
    if(mode==='para-idea'){ if(S_.slice(1).some(s=>RX.ref.test(s))) ok('Reference word kullanılmış.'); else wn('Reference word (it / they / them / there) yok gibi.'); }
  }
  return R;
}
window.analyze=analyze;

// ---------------- RENDER QUESTION ----------------
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function gapOk(ans,want){return (Array.isArray(want)?want:[want]).some(w=>w.toLowerCase()===String(ans||'').toLowerCase());}

function renderQ(q,opts){
  opts=opts||{}; const exam=!!opts.exam; const box=document.createElement('div'); box.className='q';
  box.dataset.id=q.id;
  const st=S.ans[q.id];
  const badge=st?(st.ok===true?'<span class="b ok">✓</span>':st.ok===false?'<span class="b no">✗</span>':'<span class="b mid">✎</span>'):'';
  box.innerHTML=`<div class="qh"><span class="chip u${q.u}">U${q.u}</span><span class="chip">${esc(q.topic)}</span>${badge}</div><div class="qq">${q.q}</div>${q.info?`<div class="info">${q.info}</div>`:''}<div class="qb"></div><div class="fb"></div>`;
  const body=$('.qb',box), fb=$('.fb',box);
  let check;
  if(q.t==='mc'){
    let sel=null;
    body.innerHTML=q.opts.map((o,i)=>`<button class="opt" data-i="${i}"><span class="ol">${'ABCDEFG'[i]}</span><span>${String(o).startsWith('<img')?o:esc(o)}</span></button>`).join('')+(q.src?`<div class="muted small">📄 ${esc(q.src)}</div>`:'');
    body.querySelectorAll('.opt').forEach(b=>b.onclick=()=>{ if(box.dataset.done) return; sel=+b.dataset.i; body.querySelectorAll('.opt').forEach(x=>x.classList.toggle('sel',x===b)); if(!exam) check(); });
    check=()=>{ if(sel===null) return null; box.dataset.done=1; const good=sel===q.a; body.querySelectorAll('.opt').forEach((x,i)=>{x.classList.toggle('right',i===q.a); x.classList.toggle('wrong',i===sel&&!good);}); return fin(good); };
  } else if(q.t==='order'){
    const items=shuffle(q.items.map((x,i)=>({x,i}))); let picked=[];
    const draw=()=>{ body.innerHTML=`<p class="muted small">Doğru sırayla dokun. Yanlış dokunduysan "Sıfırla"ya bas.</p>`+items.map(o=>{const k=picked.indexOf(o.i); return `<button class="opt ord ${k>-1?'sel':''}" data-i="${o.i}"><span class="ol">${k>-1?k+1:'·'}</span><span>${esc(o.x)}</span></button>`;}).join('')+`<div class="row"><button class="btn ghost sm rst">Sıfırla</button>${exam?'':'<button class="btn sm chk">Kontrol et</button>'}</div>`;
      body.querySelectorAll('.ord').forEach(b=>b.onclick=()=>{ if(box.dataset.done) return; const i=+b.dataset.i; if(picked.includes(i)) return; picked.push(i); draw(); if(exam) saveTmp(); });
      $('.rst',body).onclick=()=>{ if(box.dataset.done) return; picked=[]; draw(); };
      const c=$('.chk',body); if(c) c.onclick=()=>{ if(picked.length<items.length){toast('Hepsini sırala');return;} check(); };
    };
    const saveTmp=()=>{};
    draw();
    check=()=>{ if(picked.length<items.length) return null; box.dataset.done=1; const good=picked.every((v,k)=>v===k);
      body.querySelectorAll('.ord').forEach(b=>{const i=+b.dataset.i,k=picked.indexOf(i); b.classList.add(k===i?'right':'wrong');});
      return fin(good, '<b>Doğru sıra:</b><ol>'+q.items.map(x=>`<li>${esc(x)}</li>`).join('')+'</ol>'); };
  } else if(q.t==='match'){
    body.innerHTML=q.left.map((l,i)=>`<div class="mrow"><div class="ml">${i+1}. ${esc(l)}</div><select data-i="${i}"><option value="">— seç —</option>${q.right.map((r,j)=>`<option value="${j}">${String.fromCharCode(97+j)}. ${esc(r)}</option>`).join('')}</select></div>`).join('')+(exam?'':'<button class="btn sm chk">Kontrol et</button>');
    const c=$('.chk',body); if(c) c.onclick=()=>check()===null&&toast('Hepsini eşleştir');
    check=()=>{ const v=[...body.querySelectorAll('select')].map(s=>s.value); if(v.some(x=>x==='')) return null; box.dataset.done=1;
      let good=true; body.querySelectorAll('select').forEach((s,i)=>{const r=+s.value===q.a[i]; if(!r) good=false; s.classList.add(r?'right':'wrong'); s.disabled=true;});
      return fin(good,'<b>Cevap:</b> '+q.a.map((j,i)=>`${i+1}–${String.fromCharCode(97+j)}`).join(', ')); };
  } else if(q.t==='gap'){
    let k=0; const html=esc(q.text).replace(/\{(\d+)\}/g,(m,d)=>`<select class="gs" data-i="${d}"><option value="">(${+d+1}) ▾</option>${q.bank.map(b=>`<option>${esc(b)}</option>`).join('')}</select>`);
    body.innerHTML=`<div class="bank">${q.bank.map(b=>`<span>${esc(b)}</span>`).join('')}</div><p class="gaptext">${html}</p>`+(exam?'':'<button class="btn sm chk">Kontrol et</button>');
    const c=$('.chk',body); if(c) c.onclick=()=>check()===null&&toast('Tüm boşlukları doldur');
    check=()=>{ const ss=[...body.querySelectorAll('.gs')]; if(ss.some(s=>!s.value)) return null; box.dataset.done=1; let good=true;
      ss.forEach(s=>{const r=gapOk(s.value,q.a[+s.dataset.i]); if(!r) good=false; s.classList.add(r?'right':'wrong'); s.disabled=true;});
      return fin(good,'<b>Cevap:</b> '+q.a.map((a,i)=>`(${i+1}) ${Array.isArray(a)?a.join(' / '):a}`).join(' · ')); };
  } else if(q.t==='fill'){
    const sel=!!q.opts;
    body.innerHTML=q.items.map((it,i)=>`<div class="fi" data-i="${i}"><div class="fp">${i+1}. ${it.p.includes('<')?it.p:esc(it.p)}</div>${sel?`<select class="fs"><option value="">— seç —</option>${q.opts.map(o=>`<option>${esc(o)}</option>`).join('')}</select>`:`<input class="fin" type="text" autocapitalize="off" autocomplete="off" spellcheck="false" placeholder="cevabını yaz…">`}<div class="fa"></div></div>`).join('')+(exam?'':'<div class="row"><button class="btn sm chk">Kontrol et</button><button class="btn ghost sm shw">Cevapları göster</button></div>');
    const c=$('.chk',body); if(c) c.onclick=()=>check();
    const sh=$('.shw',body); if(sh) sh.onclick=()=>{ body.querySelectorAll('.fi').forEach((d,i)=>{$('.fa',d).innerHTML=`<span class="ans">→ ${esc(q.items[i].a[0])}</span>`;}); };
    let res=[];
    const score=()=>{const k=res.filter(Boolean).length; const good=k===res.length; S.ans[q.id]={ok:good,score:k/res.length}; save(); const r=$('.res',fb); if(r){r.className='res '+(good?'ok':'no'); r.textContent=`${k}/${res.length} doğru`;} if(opts.onChange) opts.onChange();};
    check=()=>{ box.dataset.done=1; res=[];
      body.querySelectorAll('.fi').forEach((d,i)=>{const it=q.items[i]; const inp=$('input,select',d); const v=inp.value; const ok=sel?it.a.includes(v):fillOk(v,it.a); res[i]=ok; inp.classList.add(ok?'right':'wrong'); inp.disabled=true;
        $('.fa',d).innerHTML=ok?`<span class="ok">✓</span>${it.a.length>1&&!sel?` <span class="muted small">(${esc(it.a.slice(0,3).join(' / '))})</span>`:''}`:`<span class="ans">→ ${esc(it.a[0])}</span>${it.a.length>1&&!sel?` <span class="muted small">(${esc(it.a.slice(1,3).join(' / '))})</span>`:''}${!sel&&v.trim()?' <button class="mini acc">✓ doğru sayılsın</button>':''}`;
        const ab=$('.acc',d); if(ab) ab.onclick=()=>{res[i]=true; inp.classList.remove('wrong'); inp.classList.add('right'); ab.remove(); score();}; });
      const k=res.filter(Boolean).length;
      fb.innerHTML=`<div class="res ${k===res.length?'ok':'no'}">${k}/${res.length} doğru</div>${q.ex?`<div class="exp">💡 ${q.ex}</div>`:''}`;
      score(); return k===res.length; };
  } else if(q.t==='write'){
    const draft=(S.drafts[q.id]||'');
    body.innerHTML=`<textarea rows="${/^para|parts|major/.test(q.mode)?9:3}" placeholder="Cevabını buraya yaz… (İngilizce)" autocapitalize="sentences" spellcheck="true">${esc(draft)}</textarea><div class="cnt"></div>${exam?'':`<div class="row"><button class="btn sm chk">${q.mode==='none'?'Model cevabı göster':'Analiz et + modeli göster'}</button></div>`}`;
    const ta=$('textarea',body), cnt=$('.cnt',body);
    const upd=()=>{const n=sentences(ta.value).length, w=words(ta.value).length; cnt.textContent=`${n} cümle · ${w} kelime`; S.drafts[q.id]=ta.value; save();};
    ta.oninput=upd; upd();
    const c=$('.chk',body); if(c) c.onclick=()=>check();
    check=()=>{ box.dataset.done=1; const res=q.mode==='none'?[]:analyze(ta.value,q.mode,q);
      const prev=(S.ans[q.id]&&S.ans[q.id].checks)||[];
      fb.innerHTML=`${q.mode==='none'?(ta.value.trim()?'':'<div class="ar warn">! Önce kendin yaz, sonra modelle karşılaştır.</div>'):ta.value.trim()?`<div class="an"><b>🔍 Otomatik analiz</b> <span class="muted small">(yardımcıdır; son karar checklist'te)</span>${res.map(r=>`<div class="ar ${r.k}">${r.k==='ok'?'✓':r.k==='warn'?'!':'✗'} ${r.m}</div>`).join('')}</div>`:'<div class="ar warn">! Bir şey yazmadın. Önce kendin dene, sonra modele bak.</div>'}
        <div class="model"><b>📝 Model cevap</b>${q.model.map(m=>`<div class="mtxt">${esc(m).replace(/\n/g,'<br>')}</div>`).join('<div class="or">ya da</div>')}</div>
        <div class="cl"><b>✅ Kendini puanla</b> <span class="muted small">(hocanın checklist'i)</span>${q.check.map((c,i)=>`<label><input type="checkbox" data-i="${i}" ${prev[i]?'checked':''}> ${esc(c)}</label>`).join('')}<div class="score"></div></div>`;
      const boxes=[...fb.querySelectorAll('.cl input')], sc=$('.score',fb);
      const rs=()=>{const v=boxes.map(b=>b.checked), k=v.filter(Boolean).length; sc.textContent=`${k}/${v.length} madde`; S.ans[q.id]={ok:k===v.length?true:'mid',checks:v,score:k/v.length}; save(); if(opts.onChange) opts.onChange();};
      boxes.forEach(b=>b.onchange=rs); if(!S.ans[q.id]) {S.ans[q.id]={ok:'mid',checks:boxes.map(()=>false),score:0}; save();} sc.textContent=`${boxes.filter(b=>b.checked).length}/${boxes.length} madde`;
      return 'write'; };
  }
  function fin(good,extra){
    fb.innerHTML=`<div class="res ${good?'ok':'no'}">${good?'✓ Doğru':'✗ Yanlış'}</div>${extra?`<div class="ex">${extra}</div>`:''}${q.ex?`<div class="exp">💡 ${q.ex}</div>`:''}`;
    S.ans[q.id]={ok:good}; save(); if(opts.onChange) opts.onChange(); return good; }
  box._check=()=>check();
  return box;
}

// ---------------- VIEWS ----------------
function stats(u){ const qs=window.BANK.filter(q=>!u||q.u===u); const done=qs.filter(q=>S.ans[q.id]); const good=qs.filter(q=>S.ans[q.id]&&S.ans[q.id].ok===true); return {total:qs.length,done:done.length,good:good.length}; }
function bar(p){return `<div class="bar"><i style="width:${Math.round(p*100)}%"></i></div>`;}

const V={};
function cstats(c){const qs=COURSES[c].qs; const done=qs.filter(q=>S.ans[q.id]); const good=qs.filter(q=>S.ans[q.id]&&S.ans[q.id].ok===true); return {total:qs.length,done:done.length,good:good.length};}
V.home=()=>{ const w=stats();
  return `<section class="hero"><div class="kicker">AGÜ SFL · SINAV HAZIRLIK</div><h1>Sınavlarına hazırlan</h1><p>Her ders için konu özeti, hocanın soru tarzında alıştırmalar ve PA denemeleri.</p></section>
  <a class="course" href="#w"><span class="ci">✍️</span><div><b>Writing 100</b><small>Paragraph · Instructions · Personal Recount</small>${bar(w.total?w.good/w.total:0)}</div><span class="go">›</span></a>
  ${Object.values(COURSES).map(c=>{const s=cstats(c.id);return `<a class="course ${c.id}" href="#c/${c.id}"><span class="ci">${c.icon}</span><div><b>${c.name}</b><small>${c.sub} · ${s.good}/${s.total} doğru</small>${bar(s.total?s.good/s.total:0)}</div><span class="go">›</span></a>`}).join('')}
  <div class="tip"><b>Nasıl çalışmalı?</b> Her ders için şu sırayı izle: 1) <b>🎯 Sınav taktiği</b> notunu oku. 2) Konu özetlerini oku. 3) Alıştırmaları çöz (yanlışlar kırmızı görünür, tekrar çöz). 4) <b>PA (resmi) denemeyi</b> süre tutarak çöz. 5) Deneme B/C ile kendini test et. 6) Sabah son tekrar kartlarına bak.</div>
  <a class="ucard" href="#files"><div><b>📂 Tüm ders materyalleri</b><small>Sunumlar, PA'lar, haritalar</small></div></a>
  <p class="foot muted small">iPhone: Safari → Paylaş → Ana Ekrana Ekle · Android: Chrome → ⋮ → Ana ekrana ekle. İlerlemen bu cihazda saklanır.</p>`;
};
V.w=()=>{
  const all=stats(); const pd=PLAN.filter(p=>S.plan[p.id]).length;
  return `<section class="hero"><div class="kicker">WRITING 100 · AGÜ SFL</div><h1>Sınav Hazırlık</h1><p>Unit 1 Paragraphs · Unit 2 Instructions · Unit 3 Personal Recount</p>
  <div class="stat"><div><b>${all.good}</b><span>doğru</span></div><div><b>${all.done}/${all.total}</b><span>çözülen</span></div><div><b>${pd}/${PLAN.length}</b><span>plan</span></div></div></section>
  <div class="grid2">
   <a class="tile" href="#strateji"><span>🎯</span><b>Strateji</b><small>Hoca nasıl puanlıyor?</small></a>
   <a class="tile" href="#lab"><span>✍️</span><b>Paragraf Lab</b><small>Yaz, analiz et</small></a>
   <a class="tile" href="#mocks"><span>📝</span><b>Denemeler</b><small>Revizyon + Deneme B</small></a>
   <a class="tile" href="#cards"><span>🃏</span><b>Son Tekrar</b><small>Sabah kartları</small></a>
  </div>
  <h2 class="sec">Ünite ilerlemesi</h2>
  ${[1,2,3].map(u=>{const s=stats(u);return `<a class="ucard u${u}" href="#ex${u}"><div><b>${UNAMES[u]}</b><small>${s.good} doğru · ${s.done}/${s.total} çözüldü</small></div>${bar(s.total?s.good/s.total:0)}</a>`}).join('')}
  <h2 class="sec">Bu geceki plan <small class="muted">(işaretle)</small></h2>
  <div class="plan">${PLAN.map(p=>`<div class="pl ${S.plan[p.id]?'done':''}"><label><input type="checkbox" data-p="${p.id}" ${S.plan[p.id]?'checked':''}><span><b>${p.title}</b> <em>${p.time}</em><br><small>${p.desc}</small></span></label>${p.go?`<a href="#${p.go}" class="go">›</a>`:''}</div>`).join('')}</div>
  <h2 class="sec">Ders materyalleri</h2><a class="ucard" href="#files"><div><b>📂 Sunumlar ve revizyon kâğıtları</b><small>Orijinal dosyaları indir / aç</small></div></a>
  <div class="grid2"><a class="tile" href="#topics"><span>📚</span><b>Konular</b><small>Özet + şablon</small></a><a class="tile" href="#practice"><span>✏️</span><b>Alıştırma</b><small>151 soru</small></a></div>`;
};
V.w.after=()=>{ app.querySelectorAll('[data-p]').forEach(c=>c.onchange=()=>{S.plan[c.dataset.p]=c.checked; save(); c.closest('.pl').classList.toggle('done',c.checked);}); };

V.topics=()=>`<h1 class="pt">Konular</h1>
 <a class="ucard big" href="#strateji"><div><b>🎯 Sınav Stratejisi</b><small>Format, altın kurallar, hocanın kırmızı kalemi, şablon seçimi</small></div></a>
 ${[1,2,3].map(u=>`<a class="ucard big u${u}" href="#u${u}"><div><b>${UNAMES[u]}</b><small>Özet · kurallar · şablon · model paragraflar · checklist</small></div></a>`).join('')}
 <a class="ucard big" href="#files"><div><b>📂 Orijinal dosyalar</b><small>3 sunum + 3 revizyon kâğıdı</small></div></a>`;

function noteView(k){return ()=>`<div class="note">${NOTES[k]}</div><div class="row center">${k.startsWith('u')?`<a class="btn" href="#ex${k[1]}">Bu ünitenin alıştırmaları →</a>`:'<a class="btn" href="#topics">Konulara dön</a>'}</div>`;}
V.strateji=noteView('strateji'); V.u1=noteView('u1'); V.u2=noteView('u2'); V.u3=noteView('u3');

V.practice=()=>`<h1 class="pt">Alıştırmalar</h1>${[1,2,3].map(u=>{const s=stats(u);return `<a class="ucard big u${u}" href="#ex${u}"><div><b>${UNAMES[u]}</b><small>${s.total} soru · ${s.good} doğru</small></div>${bar(s.total?s.good/s.total:0)}</a>`}).join('')}
 <a class="ucard big" href="#quiz"><div><b>⚡ Hızlı karışık test</b><small>3 üniteden rastgele 15 otomatik puanlanan soru</small></div></a>
 <a class="ucard big" href="#wrong"><div><b>🔁 Yanlışlarım</b><small>Yanlış yaptığın soruları tekrar çöz</small></div></a>`;

let filt={};
function exView(u){return ()=>{
  const qs=window.BANK.filter(q=>q.u===u); const topics=[...new Set(qs.map(q=>q.topic))];
  const f=filt[u]||'all';
  return `<h1 class="pt">${UNAMES[u]}</h1><div class="chips">${['all',...topics].map(t=>`<button class="fchip ${f===t?'on':''}" data-t="${esc(t)}">${t==='all'?'Hepsi':esc(t)}</button>`).join('')}</div><div id="ql"></div>
  <div class="row center"><a class="btn ghost" href="#u${u}">← Ünite özeti</a><button class="btn ghost" id="reset">Bu üniteyi sıfırla</button></div>`;
};}
function exAfter(u){return ()=>{
  const f=filt[u]||'all'; const ql=$('#ql'); window.BANK.filter(q=>q.u===u&&(f==='all'||q.topic===f)).forEach(q=>ql.appendChild(renderQ(q)));
  app.querySelectorAll('.fchip').forEach(b=>b.onclick=()=>{filt[u]=b.dataset.t; route();});
  $('#reset').onclick=()=>{ if(!confirm('Bu ünitedeki cevapların silinsin mi?')) return; window.BANK.filter(q=>q.u===u).forEach(q=>{delete S.ans[q.id]; delete S.drafts[q.id];}); save(); route(); };
};}
V.ex1=exView(1); V.ex1.after=exAfter(1); V.ex2=exView(2); V.ex2.after=exAfter(2); V.ex3=exView(3); V.ex3.after=exAfter(3);

V.wrong=()=>`<h1 class="pt">Yanlışlarım</h1><div id="ql"></div>`;
V.wrong.after=()=>{ const ql=$('#ql'); const w=ALL.filter(q=>S.ans[q.id]&&(S.ans[q.id].ok===false||(q.t==='write'&&S.ans[q.id].ok==='mid')));
  if(!w.length){ ql.innerHTML='<p class="empty">Yanlış yok 🎉 Önce alıştırma çöz.</p>'; return; }
  w.forEach(q=>{ delete S.ans[q.id]; ql.appendChild(renderQ(q)); }); save(); };

V.quiz=()=>`<h1 class="pt">Hızlı karışık test</h1><p class="muted">15 soru. Hepsini cevapla, sonra "Bitir"e bas.</p><div id="ql"></div><div class="row center"><button class="btn" id="fin">Bitir ve puanla</button><a class="btn ghost" href="#quiz" onclick="setTimeout(()=>location.reload(),10)">Yeni test</a></div><div id="qres"></div>`;
V.quiz.after=()=>{ const pool=shuffle(ALL.filter(q=>!q.c&&AUTO(q.t))).slice(0,15); const ql=$('#ql'); const boxes=pool.map(q=>{const b=renderQ(q,{exam:true}); ql.appendChild(b); return b;});
  $('#fin').onclick=()=>{ let g=0,emp=0; boxes.forEach(b=>{const r=b._check(); if(r===true) g++; if(r===null) emp++;}); $('#qres').innerHTML=`<div class="big-score">${g}/15 <small>${emp?`(${emp} boş)`:''}</small></div>`; $('#qres').scrollIntoView({behavior:'smooth'}); }; };

V.mocks=()=>`<h1 class="pt">Deneme Sınavları</h1><p class="muted">Revizyon kâğıtları hocanın sınav formatının birebir aynısı. Önce bunları çöz, sonra Deneme B'ye geç. Deneme modunda cevaplar <b>"Sınavı bitir"</b>e basınca görünür.</p>
 ${MOCKS.map(m=>{const r=S.mock[m.id];return `<a class="ucard big u${m.u}" href="#mock/${m.id}"><div><b>${m.title}</b><small>${m.sub}${r?` · son puan: %${r}`:''}</small></div></a>`}).join('')}`;

function mockHTML(m,note){ if(!m) return '<p>Bulunamadı</p>';
  return `<h1 class="pt">${m.title}</h1><div class="timer" id="tm">⏱ 00:00</div><p class="muted small">${note}</p>
  ${m.parts.map((p,i)=>`<h2 class="sec">${esc(p.t)}</h2><div class="part" data-p="${i}"></div>`).join('')}
  <div class="row center"><button class="btn" id="fin">Sınavı bitir ve puanla</button></div><div id="mres"></div>`; }
V.mock=(id)=>mockHTML(MOCKS.find(x=>x.id===id),'Gerçek sınav gibi çöz: önce kısa sorular, sonra paragraf. Yazma sorularında analiz ve model "Sınavı bitir"den sonra açılır. Sonra checklist ile kendini puanla.');
V.mock.after=(id)=>mockRun(MOCKS.find(x=>x.id===id),id);
function mockRun(m,id){ if(!m) return; const boxes=[];
  m.parts.forEach((p,i)=>{const el=app.querySelector(`.part[data-p="${i}"]`); p.ids.forEach(qid=>{const q=BYID[qid]; if(!q) return; const b=renderQ(q,{exam:true,onChange:()=>score(false)}); b._q=q; el.appendChild(b); boxes.push(b);});});
  const t0=Date.now(); const iv=setInterval(()=>{const e=$('#tm'); if(!e){clearInterval(iv);return;} const s=Math.floor((Date.now()-t0)/1000); e.textContent=`⏱ ${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;},1000);
  let finished=false;
  function score(scroll){ if(!finished) return; let pts=0,max=0,autoG=0,autoN=0; boxes.forEach(b=>{const q=b._q; max++; const a=S.ans[q.id]; if(AUTO(q.t)){autoN++; if(a&&a.ok===true){pts++;autoG++;}} else if(a&&a.score!=null) pts+=a.score;});
    const pc=Math.round(pts/max*100); S.mock[id]=pc; save();
    $('#mres').innerHTML=`<div class="big-score">%${pc}<small>Otomatik: ${autoG}/${autoN} · Yazma: checklist işaretledikçe güncellenir</small></div>`; if(scroll) $('#mres').scrollIntoView({behavior:'smooth'}); }
  $('#fin').onclick=()=>{ if(finished) return; finished=true; clearInterval(iv); boxes.forEach(b=>b._check()); $('#fin').textContent='Puanlandı ✓'; score(true); toast('Yazma sorularında checklist\'i işaretle, puan güncellenir'); };
}

V.lab=()=>{ const ty=S.labType||'para-idea'; const T={'para-idea':'Unit 1 · Paragraph (7–9)','para-instr':'Unit 2 · Instructions (7–9)','para-recount':'Unit 3 · Recount (6–8)'};
  const tpl={'para-idea':'TS (topic + controlling idea) → First, MAJOR → For example, MINOR → In addition, MAJOR → MINOR → Finally, MAJOR → MINOR → For these reasons, CONCLUSION (new words, no new idea)','para-instr':'TS (You can … in a few simple steps.) → First, VERB + detail → Next, VERB → Then, VERB → Make sure / Be careful … → After that, VERB → Finally, VERB → Your … is now ready.','para-recount':'ORIENTATION (When, who + past verb + what + where) → First, EVENT → Then, EVENT → SHOWING DETAIL (heart, hands…) → Suddenly/After that, EVENT → Finally/In the end, EVENT → Looking back, FEELING/COMMENT/LESSON'};
  return `<h1 class="pt">Paragraf Laboratuvarı</h1><p class="muted">İstediğin konuda paragraf yaz, analizör hocanın checklist'ine göre kontrol etsin.</p>
  <div class="chips">${Object.keys(T).map(k=>`<button class="fchip ${k===ty?'on':''}" data-k="${k}">${T[k]}</button>`).join('')}</div>
  <div class="tpl small">${tpl[ty]}</div>
  <input id="ltitle" placeholder="Başlık (ör. A Good Place to Relax on Campus)" value="${esc(S.drafts['lab-title-'+ty]||'')}">
  <textarea id="ltxt" rows="12" placeholder="Paragrafını yaz…">${esc(S.drafts['lab-'+ty]||'')}</textarea><div class="cnt" id="lcnt"></div>
  <div class="row"><button class="btn" id="lan">Analiz et</button><button class="btn ghost" id="lclr">Temizle</button></div><div id="lres"></div>
  <h2 class="sec">Checklist</h2><div class="note">${(NOTES[{'para-idea':'u1','para-instr':'u2','para-recount':'u3'}[ty]].match(/<ul class="check">[\s\S]*?<\/ul>/)||[''])[0]}</div>`; };
V.lab.after=()=>{ const ty=S.labType||'para-idea'; const ta=$('#ltxt'), c=$('#lcnt');
  const upd=()=>{c.textContent=`${sentences(ta.value).length} cümle · ${words(ta.value).length} kelime`; S.drafts['lab-'+ty]=ta.value; save();}; ta.oninput=upd; upd();
  $('#ltitle').oninput=e=>{S.drafts['lab-title-'+ty]=e.target.value; save();};
  app.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{S.labType=b.dataset.k; save(); route();});
  $('#lan').onclick=()=>{ const r=analyze(ta.value,ty); $('#lres').innerHTML=`<div class="an">${r.map(x=>`<div class="ar ${x.k}">${x.k==='ok'?'✓':x.k==='warn'?'!':'✗'} ${x.m}</div>`).join('')||'Bir şey yaz.'}</div>`; };
  $('#lclr').onclick=()=>{ if(confirm('Silinsin mi?')){ta.value='';upd();} }; };

let ci=0, flip=false, deck=null, deckKey='w';
V.cards=(cid)=>{ const CARDS=cid?COURSES[cid].cards:window.CARDS; const key=cid||'w'; if(!deck||deckKey!==key){deck=CARDS.map((c,i)=>i);ci=0;flip=false;deckKey=key;} const KP=cid?cid+':':''; const c=CARDS[deck[ci%deck.length]]; const known=deck.filter(k=>S.cards[KP+k]).length;
  return `<h1 class="pt">Son Tekrar Kartları</h1><p class="muted small">${ci%deck.length+1}/${deck.length} · bildiklerin: ${known}</p>
  <div class="card ${flip?'flip':''}" id="cd"><div class="cf">${esc(c.f)}</div>${flip?`<div class="cb">${esc(c.b)}</div>`:'<div class="tap">Cevap için dokun</div>'}</div>
  <div class="row center"><button class="btn ghost" id="cp">‹ Önceki</button><button class="btn ghost" id="cs">Karıştır</button><button class="btn" id="cn">Sonraki ›</button></div>
  <div class="row center"><button class="btn sm ${S.cards[KP+deck[ci%deck.length]]?'':'ghost'}" id="ck">${S.cards[KP+deck[ci%deck.length]]?'✓ Biliyorum':'Biliyorum olarak işaretle'}</button></div>
  <h2 class="sec">Tüm kartlar (liste)</h2><div class="clist">${CARDS.map(c=>`<details><summary>${esc(c.f)}</summary><p>${esc(c.b)}</p></details>`).join('')}</div>`; };
V.cards.after=(cid)=>{ const KP=cid?cid+':':''; $('#cd').onclick=()=>{flip=!flip; route();}; $('#cn').onclick=()=>{ci++;flip=false;route();}; $('#cp').onclick=()=>{ci=(ci-1+deck.length)%deck.length;flip=false;route();};
  $('#cs').onclick=()=>{deck=shuffle(deck);ci=0;flip=false;route();}; $('#ck').onclick=()=>{const k=KP+deck[ci%deck.length]; S.cards[k]=!S.cards[k]; save(); route();}; };

// ---------------- COURSES (LTL, ETRAV) ----------------
V.c=(cid,sub,arg)=>{ const c=COURSES[cid]; if(!c) return '<p>Bulunamadı</p>';
  if(sub==='n'){ const n=c.notes.find(x=>x.id===arg); return `<div class="note">${n?n.html:''}</div><div class="row center"><a class="btn" href="#c/${cid}">← ${c.short} ana sayfa</a></div>`; }
  if(sub==='ex'){ const u=+arg; const qs=c.qs.filter(q=>q.u===u); const s=qs.filter(q=>S.ans[q.id]&&S.ans[q.id].ok===true).length;
    return `<h1 class="pt">${c.icon} ${esc(c.units[u])}</h1><p class="muted small">${qs.length} soru · ${s} tam doğru. Önce kendin yaz, sonra "Kontrol et". Yazım farkı varsa "✓ doğru sayılsın"a bas.</p><div id="ql"></div><div class="row center"><a class="btn ghost" href="#c/${cid}">← ${c.short}</a><button class="btn ghost" id="reset">Sıfırla</button></div>`; }
  if(sub==='mock') return mockHTML(c.mocks.find(x=>x.id===arg),'Gerçek sınav gibi çöz. Cevaplar "Sınavı bitir"e basınca kontrol edilir. Yazma sorularında modeli okuyup kendini checklist ile puanla.');
  if(sub==='cards') return V.cards(cid);
  if(sub==='quiz') return `<h1 class="pt">${c.icon} Rastgele deneme</h1><p class="muted small">${c.quiz} karışık soru. Hepsini işaretle, sonra "Bitir ve puanla"ya bas.</p><div id="ql"></div><div class="row center"><button class="btn" id="fin">Bitir ve puanla</button><button class="btn ghost" id="again">Yeni deneme</button></div><div id="qres"></div>`;
  const s=cstats(cid);
  return `<section class="hero ${cid}"><div class="kicker">${c.short}</div><h1>${c.icon} ${c.name}</h1><p>${c.sub}</p><div class="stat"><div><b>${s.good}</b><span>tam doğru</span></div><div><b>${s.done}/${s.total}</b><span>çözülen</span></div><div><b>${c.mocks.length}</b><span>deneme</span></div></div></section>
  <h2 class="sec">📖 Konu özeti</h2>${c.notes.map(n=>`<a class="ucard" href="#c/${cid}/n/${n.id}"><div><b>${n.title}</b></div></a>`).join('')}
  <h2 class="sec">✏️ Alıştırmalar (PA tarzı)</h2>${Object.entries(c.units).map(([u,t])=>{const qs=c.qs.filter(q=>q.u===+u); const g=qs.filter(q=>S.ans[q.id]&&S.ans[q.id].ok===true).length; return `<a class="ucard" href="#c/${cid}/ex/${u}"><div><b>${esc(t)}</b><small>${qs.length} soru · ${g} doğru</small></div>${bar(qs.length?g/qs.length:0)}</a>`}).join('')}
  ${c.quiz?`<h2 class="sec">🎲 Rastgele deneme</h2><a class="ucard big" href="#c/${cid}/quiz"><div><b>${c.quiz} soruluk karışık test</b><small>Bütün sorulardan rastgele, sonunda puan</small></div></a>`:''}
  ${c.mocks.length?`<h2 class="sec">📝 Deneme sınavları</h2>${c.mocks.map(m=>{const r=S.mock[m.id];return `<a class="ucard big" href="#c/${cid}/mock/${m.id}"><div><b>${m.title}</b><small>${m.sub}${r!=null?` · son puan: %${r}`:''}</small></div></a>`}).join('')}`:''}
  ${c.cards.length?`<h2 class="sec">🃏 Son tekrar</h2><a class="ucard" href="#c/${cid}/cards"><div><b>Kartlar</b><small>${c.cards.length} kart, sabah için</small></div></a>`:''}`; };
V.c.after=(cid,sub,arg)=>{ const c=COURSES[cid]; if(!c) return;
  if(sub==='ex'){ const u=+arg; const ql=$('#ql'); c.qs.filter(q=>q.u===u).forEach(q=>ql.appendChild(renderQ(q)));
    $('#reset').onclick=()=>{ if(!confirm('Bu bölümdeki cevapların silinsin mi?')) return; c.qs.filter(q=>q.u===u).forEach(q=>{delete S.ans[q.id]; delete S.drafts[q.id];}); save(); route(); }; }
  if(sub==='mock') mockRun(c.mocks.find(x=>x.id===arg),arg);
  if(sub==='cards') V.cards.after(cid);
  if(sub==='quiz'){ const pool=shuffle(c.qs.filter(q=>AUTO(q.t))).slice(0,c.quiz); const ql=$('#ql'); const boxes=pool.map(q=>{const b=renderQ(q,{exam:true}); ql.appendChild(b); return b;});
    $('#again').onclick=()=>route();
    $('#fin').onclick=()=>{ let g=0,emp=0; boxes.forEach(b=>{const r=b._check(); if(r===true) g++; if(r===null) emp++;}); $('#qres').innerHTML=`<div class="big-score">${g}/${pool.length}<small>%${Math.round(g/pool.length*100)} · ${emp?emp+' boş':'hepsi cevaplandı'}</small></div>`; $('#qres').scrollIntoView({behavior:'smooth'}); }; } };

V.files=()=>`<h1 class="pt">Ders Materyalleri</h1><p class="muted">iPhone'da dosyaya dokununca önizleme açılır. Arkadaşına bu sayfanın linkini gönderebilirsin.</p>
 <h2 class="sec">Sunumlar (sınav konuları)</h2>
 <a class="file" href="files/Unit1-From-Sentences-to-Paragraphs.pptx" download><span>📊</span><div><b>Unit 1. From Sentences to Paragraphs</b><small>PowerPoint · 3,8 MB</small></div></a>
 <a class="file" href="files/Unit2-Writing-Instructions.pptx" download><span>📊</span><div><b>Unit 2. Writing Instructions</b><small>PowerPoint · 7,6 MB</small></div></a>
 <a class="file" href="files/Unit3-Personal-Recount.pptx" download><span>📊</span><div><b>Unit 3. Personal Recount</b><small>PowerPoint · 3,3 MB</small></div></a>
 <h2 class="sec">Revizyon kâğıtları (hocanın değerlendirme mantığı)</h2>
 <a class="file" href="files/Unit1-Revision.docx" download><span>📄</span><div><b>Unit 1. Revision</b><small>Word</small></div></a>
 <a class="file" href="files/Unit2-Revision.docx" download><span>📄</span><div><b>Unit 2. Revision</b><small>Word · fotokopi diyagramı içinde</small></div></a>
 <a class="file" href="files/Unit3-Revision.docx" download><span>📄</span><div><b>Unit 3. Revision</b><small>Word</small></div></a>
 <p class="muted small">Revizyon kâğıtlarının çözümlü hâli: Denemeler → Revision 1/2/3.</p>
 <h2 class="sec">🧠 Learning to Learn</h2>
 <a class="file" href="files/LTL-booklet.pdf"><span>📕</span><div><b>LTL ders kitapçığı (Unit 1–5)</b><small>PDF · 12 MB</small></div></a>
 <a class="file" href="files/LTL-midterm-answer-key.pdf"><span>✅</span><div><b>LTL Practice Exam: Answer Key</b><small>PDF</small></div></a>
 <a class="file" href="files/LTL-summary-table.pdf"><span>📋</span><div><b>LTL Summary Table</b><small>PDF</small></div></a>
 <h2 class="sec">✈️ E-Travel</h2>
 <a class="file" href="files/ETRAV-midterm-PA.docx" download><span>📄</span><div><b>ETRAV Midterm PA</b><small>Word</small></div></a>
 <a class="file" href="files/istanbul-map.png"><span>🗺️</span><div><b>İstanbul raylı sistem haritası (PA)</b><small>Resim</small></div></a>
 <a class="file" href="files/directions-map.pdf"><span>🧭</span><div><b>Yol tarifi haritası (Lesson 11)</b><small>PDF</small></div></a>
 <p class="muted small">ETRAV ders kitapçıkları çok büyük (100–150 MB) olduğu için siteye konmadı. Tüm içerikleri ETRAV bölümündeki konu özetlerinde.</p>`;

// ---------------- ROUTER ----------------
const TABS=[['home','🏠','Ana'],['w','✍️','Writing'],['c/ltl','🧠','LTL'],['c/etrav','✈️','ETRAV'],['c/isg','🦺','İSG']];
const TABOF={w:'w',topics:'w',practice:'w',mocks:'w',cards:'w',strateji:'w',u1:'w',u2:'w',u3:'w',ex1:'w',ex2:'w',ex3:'w',quiz:'w',wrong:'w',mock:'w',lab:'w',files:'home'};
function route(){
  const h=(location.hash||'#home').slice(1); const parts=h.split('/'); const name=parts[0], args=parts.slice(1); const v=V[name]||V.home;
  const keep=window._lastRoute===h; const y=window.scrollY;
  app.innerHTML=v(...args); if(v.after) v.after(...args);
  window.scrollTo(0,keep?y:0); window._lastRoute=h;
  const tab=name==='c'?'c/'+args[0]:(TABOF[name]||name); document.querySelectorAll('#tabs a').forEach(a=>a.classList.toggle('on',a.dataset.t===tab));
  $('#back').style.visibility=name==='home'?'hidden':'visible';
}
$('#tabs').innerHTML=TABS.map(([k,i,l])=>`<a href="#${k}" data-t="${k}"><span>${i}</span>${l}</a>`).join('');
$('#back').onclick=()=>history.length>1?history.back():(location.hash='#home');
window.addEventListener('hashchange',route); route();

let tt; function toast(m){const e=$('#toast'); e.textContent=m; e.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>e.classList.remove('show'),2200);}
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));
})();
