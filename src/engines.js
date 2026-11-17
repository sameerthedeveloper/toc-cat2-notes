/* ===== ENGINES (pure, testable) ===== */
/* ---- Propositional logic ---- */
function pTokens(s){
  const t=[];let i=0;
  while(i<s.length){const c=s[i];
    if(/\s/.test(c)){i++;continue;}
    if(s.startsWith('<->',i)||s.startsWith('<=>',i)){t.push('<->');i+=3;continue;}
    if(c==='↔'){t.push('<->');i++;continue;}
    if(s.startsWith('->',i)||s.startsWith('=>',i)){t.push('->');i+=2;continue;}
    if(c==='→'){t.push('->');i++;continue;}
    if('~!¬'.includes(c)){t.push('~');i++;continue;}
    if('&∧'.includes(c)){t.push('&');i++;continue;}
    if('|∨'.includes(c)){t.push('|');i++;continue;}
    if(c==='('||c===')'){t.push(c);i++;continue;}
    const m=/^[A-Za-z][A-Za-z0-9_]*/.exec(s.slice(i));
    if(m){t.push({v:m[0]});i+=m[0].length;continue;}
    throw new Error('Unexpected character "'+c+'"');
  }
  return t;
}
function pParse(s){
  const t=pTokens(s);let p=0;
  const peek=()=>t[p],eat=x=>{if(t[p]===x){p++;return true}return false};
  function iff(){let l=imp();while(eat('<->')){l={op:'iff',a:l,b:imp()};}return l;}
  function imp(){const l=or();if(eat('->'))return {op:'imp',a:l,b:imp()};return l;}
  function or(){let l=and();while(eat('|'))l={op:'or',a:l,b:and()};return l;}
  function and(){let l=not();while(eat('&'))l={op:'and',a:l,b:not()};return l;}
  function not(){if(eat('~'))return {op:'not',a:not()};return atom();}
  function atom(){const x=peek();
    if(x&&x.v){p++;return {op:'var',n:x.v};}
    if(eat('(')){const e=iff();if(!eat(')'))throw new Error('Missing )');return e;}
    throw new Error('Expected a variable or ( near token '+(p+1));}
  const r=iff();if(p<t.length)throw new Error('Unexpected token after formula');return r;
}
const SYM={and:'∧',or:'∨',imp:'→',iff:'↔'};
function pStr(n,top=true){
  if(n.op==='var')return n.n;
  if(n.op==='not')return '¬'+pStr(n.a,false);
  const s=pStr(n.a,false)+' '+SYM[n.op]+' '+pStr(n.b,false);
  return top?s:'('+s+')';
}
function pEval(n,e){
  switch(n.op){case 'var':return !!e[n.n];case 'not':return !pEval(n.a,e);case 'and':return pEval(n.a,e)&&pEval(n.b,e);
  case 'or':return pEval(n.a,e)||pEval(n.b,e);case 'imp':return !pEval(n.a,e)||pEval(n.b,e);case 'iff':return pEval(n.a,e)===pEval(n.b,e);}
}
function pVars(n,acc=[]){if(n.op==='var'){if(!acc.includes(n.n))acc.push(n.n);}else{pVars(n.a,acc);if(n.b)pVars(n.b,acc);}return acc;}
function pSubs(n,acc=[]){if(n.op==='var')return acc;pSubs(n.a,acc);if(n.b)pSubs(n.b,acc);const s=pStr(n,true);if(!acc.find(x=>x[0]===s))acc.push([s,n]);return acc;}
function truthTable(src){
  const ast=pParse(src),vars=pVars(ast);
  if(vars.length>6)throw new Error('Use at most 6 variables');
  const subs=pSubs(ast);const rows=[];
  for(let i=0;i<(1<<vars.length);i++){const env={};vars.forEach((v,k)=>env[v]=!!(i&(1<<(vars.length-1-k))));
    rows.push({vals:vars.map(v=>env[v]),res:subs.map(s=>pEval(s[1],env)),out:pEval(ast,env)});}
  const trues=rows.filter(r=>r.out).length;
  const kind=trues===rows.length?'Tautology (valid)':trues===0?'Contradiction (unsatisfiable)':'Contingency (satisfiable, not valid)';
  return {vars,subs:subs.map(s=>s[0]),rows,kind,str:pStr(ast)};
}
function entails(kbSrc,qSrc){
  const kb=kbSrc.split(';').map(s=>s.trim()).filter(Boolean).map(pParse),q=pParse(qSrc);
  const vars=[...new Set([...kb.flatMap(k=>pVars(k)),...pVars(q)])];
  if(vars.length>8)throw new Error('Use at most 8 variables');
  const models=[];let counter=null;
  for(let i=0;i<(1<<vars.length);i++){const env={};vars.forEach((v,k)=>env[v]=!!(i&(1<<(vars.length-1-k))));
    if(kb.every(k=>pEval(k,env))){const qv=pEval(q,env);models.push({env,qv});if(!qv&&!counter)counter=env;}}
  return {vars,kbStr:kb.map(k=>pStr(k)),qStr:pStr(q),models,entails:models.every(m=>m.qv),counter};
}
/* ---- Unification ---- */
function tParse(s){
  let i=0;const ws=()=>{while(i<s.length&&/\s/.test(s[i]))i++;};
  function term(){ws();const m=/^[A-Za-z_][A-Za-z0-9_]*/.exec(s.slice(i));if(!m)throw new Error('Expected a name at position '+(i+1));
    const n=m[0];i+=n.length;ws();
    if(s[i]==='('){i++;const args=[];ws();if(s[i]!==')'){for(;;){args.push(term());ws();if(s[i]===','){i++;continue;}break;}}
      if(s[i]!==')')throw new Error('Missing ) at position '+(i+1));i++;return {t:'f',n,args};}
    if(/[a-z]/.test(n[0]))return {t:'v',n};return {t:'f',n,args:[]};}
  const r=term();ws();if(i<s.length)throw new Error('Extra text at position '+(i+1));return r;
}
const tStr=t=>t.t==='v'?t.n:t.args.length?t.n+'('+t.args.map(tStr).join(', ')+')':t.n;
function tApply(t,th){if(t.t==='v')return th[t.n]?tApply(th[t.n],th):t;return {t:'f',n:t.n,args:t.args.map(a=>tApply(a,th))};}
function occurs(v,t,th){if(t.t==='v'){if(t.n===v)return true;return th[t.n]?occurs(v,th[t.n],th):false;}return t.args.some(a=>occurs(v,a,th));}
function unifyTerms(a,b){
  const log=[];const th={};
  function uni(x,y){
    if(x.t==='v'&&th[x.n]&&false){}
    const xs=tStr(tApply(x,th)),ys=tStr(tApply(y,th));
    if(xs===ys){log.push(`Unify(${xs}, ${ys}): already identical, no change.`);return true;}
    x=tApply(x,th);y=tApply(y,th);
    if(x.t==='v')return bind(x,y);
    if(y.t==='v')return bind(y,x);
    if(x.n!==y.n){log.push(`Unify(${tStr(x)}, ${tStr(y)}): different symbols ${x.n} and ${y.n}. FAIL.`);return false;}
    if(x.args.length!==y.args.length){log.push(`Unify(${tStr(x)}, ${tStr(y)}): ${x.n} has different number of arguments. FAIL.`);return false;}
    log.push(`Unify(${tStr(x)}, ${tStr(y)}): same symbol ${x.n}, unify arguments pairwise.`);
    for(let i=0;i<x.args.length;i++)if(!uni(x.args[i],y.args[i]))return false;
    return true;}
  function bind(v,t){
    if(occurs(v.n,t,th)){log.push(`Bind ${v.n} := ${tStr(t)}: ${v.n} occurs inside ${tStr(t)} (occurs check). FAIL.`);return false;}
    th[v.n]=t;log.push(`Bind ${v.n} := ${tStr(t)}. Substitution is now ${subStr(th)}.`);return true;}
  const ok=uni(a,b);
  const mgu={};if(ok)for(const k in th)mgu[k]=tApply(th[k],th);
  return {ok,log,mgu,result:ok?tStr(tApply(a,th)):null};
}
function subStr(th){const k=Object.keys(th);return k.length?'{ '+k.map(v=>v+'/'+tStr(tApply(th[v],th))).join(', ')+' }':'{ }';}
/* ---- Chaining (propositional Horn) ---- */
function parseRules(src){return src.split(/\n/).map(l=>l.trim()).filter(Boolean).map(l=>{const m=/^(.*?)(?:->|=>|→)(.*)$/.exec(l);if(!m)throw new Error('Rule needs -> : '+l);
  return {pre:m[1].split(/&|∧|,/).map(s=>s.trim()).filter(Boolean),post:m[2].trim(),src:l};});}
function forwardChain(rules,facts,query){
  const known=new Set(facts),log=[];let fired=true,round=0;
  if(known.has(query)){log.push(`${query} is already a fact.`);return {ok:true,log,known:[...known]};}
  while(fired){fired=false;round++;
    for(const r of rules){
      if(known.has(r.post))continue;
      if(r.pre.every(p=>known.has(p))){known.add(r.post);fired=true;
        log.push(`Pass ${round}: rule [${r.pre.join(' ∧ ')} → ${r.post}] fires (all premises known). Add ${r.post}. Known = {${[...known].join(', ')}}`);
        if(r.post===query){log.push(`Goal ${query} derived. STOP.`);return {ok:true,log,known:[...known]};}}}}
  log.push(`No more rules can fire. ${query} not derived.`);return {ok:false,log,known:[...known]};
}
function backwardChain(rules,facts,query){
  const log=[],fs=new Set(facts);
  function prove(g,stack,d){const pad='  '.repeat(d);
    if(fs.has(g)){log.push(`${pad}${g}: is a known fact ✓`);return true;}
    if(stack.includes(g)){log.push(`${pad}${g}: already being proved (loop), fail this branch`);return false;}
    const rs=rules.filter(r=>r.post===g);
    if(!rs.length){log.push(`${pad}${g}: not a fact and no rule concludes it ✗`);return false;}
    for(const r of rs){log.push(`${pad}${g}: try rule [${r.pre.join(' ∧ ')} → ${g}], new subgoals: ${r.pre.join(', ')}`);
      let all=true;for(const p of r.pre){if(!prove(p,[...stack,g],d+1)){all=false;break;}}
      if(all){log.push(`${pad}${g}: proved ✓ (all subgoals true)`);return true;}}
    log.push(`${pad}${g}: all rules failed ✗`);return false;}
  const ok=prove(query,[],0);return {ok,log};
}
/* ---- Blocks world goal stack planner (STRIPS) ---- */
const ARM='ARMEMPTY';
function bwOps(){return {
  STACK:(x,y)=>({n:`STACK(${x},${y})`,pre:[`CLEAR(${y})`,`HOLDING(${x})`],del:[`CLEAR(${y})`,`HOLDING(${x})`],add:[ARM,`ON(${x},${y})`,`CLEAR(${x})`]}),
  UNSTACK:(x,y)=>({n:`UNSTACK(${x},${y})`,pre:[`ON(${x},${y})`,`CLEAR(${x})`,ARM],del:[`ON(${x},${y})`,`CLEAR(${x})`,ARM],add:[`HOLDING(${x})`,`CLEAR(${y})`]}),
  PICKUP:x=>({n:`PICKUP(${x})`,pre:[`ONTABLE(${x})`,`CLEAR(${x})`,ARM],del:[`ONTABLE(${x})`,`CLEAR(${x})`,ARM],add:[`HOLDING(${x})`]}),
  PUTDOWN:x=>({n:`PUTDOWN(${x})`,pre:[`HOLDING(${x})`],del:[`HOLDING(${x})`],add:[`ONTABLE(${x})`,ARM,`CLEAR(${x})`]})};}
function parseAtoms(s){return (s.match(/ARMEMPTY|[A-Z]+\([A-Za-z0-9, ]*\)/g)||[]).map(a=>a.replace(/\s/g,''));}
function goalStack(initS,goalS,cap=300){
  const O=bwOps();const st=new Set(parseAtoms(initS)),goals=parseAtoms(goalS);
  const stack=[{k:'C',g:goals}];for(let i=goals.length-1;i>=0;i--)stack.push({k:'G',g:goals[i]});
  const plan=[],trace=[];let steps=0;
  const show=()=>stack.slice().reverse().map(x=>x.k==='C'?'['+x.g.join(' ∧ ')+']':x.k==='A'?'⚙ '+x.op.n:x.g);
  const push=(opn)=>{stack.push({k:'A',op:opn});stack.push({k:'C',g:opn.pre});for(let i=opn.pre.length-1;i>=0;i--)stack.push({k:'G',g:opn.pre[i]});};
  const find=(re)=>{for(const a of st){const m=re.exec(a);if(m)return m;}return null;};
  while(stack.length&&steps++<cap){
    const top=stack.pop();let note='';
    if(top.k==='A'){const op=top.op;
      if(!op.pre.every(p=>st.has(p))){note=`Preconditions of ${op.n} no longer hold`;trace.push({note,stack:show(),state:[...st]});return {ok:false,plan,trace,state:[...st],err:note};}
      op.del.forEach(d=>st.delete(d));op.add.forEach(a=>st.add(a));plan.push(op.n);note=`Apply ${op.n}. State updated.`;}
    else if(top.k==='C'){const un=top.g.filter(g=>!st.has(g));
      if(!un.length)note=`Compound goal [${top.g.join(' ∧ ')}] is satisfied. Pop it.`;
      else{stack.push(top);for(let i=un.length-1;i>=0;i--)stack.push({k:'G',g:un[i]});note=`Compound goal not fully true. Push unsatisfied subgoals: ${un.join(', ')}.`;}}
    else{const g=top.g;
      if(st.has(g)){note=`${g} already true. Pop it.`;}
      else{let op=null,m;
        if(m=/^ON\((\w+),(\w+)\)$/.exec(g))op=O.STACK(m[1],m[2]);
        else if(m=/^ONTABLE\((\w+)\)$/.exec(g))op=O.PUTDOWN(m[1]);
        else if(m=/^CLEAR\((\w+)\)$/.exec(g)){const on=find(new RegExp('^ON\\((\\w+),'+m[1]+'\\)$'));if(on)op=O.UNSTACK(on[1],m[1]);}
        else if(m=/^HOLDING\((\w+)\)$/.exec(g)){if(st.has(`ONTABLE(${m[1]})`))op=O.PICKUP(m[1]);else{const on=find(new RegExp('^ON\\('+m[1]+',(\\w+)\\)$'));if(on)op=O.UNSTACK(m[1],on[1]);}}
        else if(g===ARM){const h=find(/^HOLDING\((\w+)\)$/);if(h)op=O.PUTDOWN(h[1]);}
        if(!op){note=`${g} is false and no operator can achieve it.`;trace.push({note,stack:show(),state:[...st]});return {ok:false,plan,trace,state:[...st],err:note};}
        push(op);note=`${g} is false. Choose ${op.n}; push it with its preconditions [${op.pre.join(' ∧ ')}].`;}}
    trace.push({note,stack:show(),state:[...st].sort()});
  }
  const ok=!stack.length&&goals.every(g=>st.has(g));
  return {ok,plan,trace,state:[...st].sort(),err:ok?null:'Step limit reached'};
}
/* ---- Wumpus world ---- */
const WW={wumpus:[1,3],pits:[[3,1],[3,3],[4,4]],gold:[2,3],n:4};
const nb=(x,y)=>[[x+1,y],[x-1,y],[x,y+1],[x,y-1]].filter(([a,b])=>a>=1&&a<=4&&b>=1&&b<=4);
const eq=(a,b)=>a[0]===b[0]&&a[1]===b[1];
function wPercept(x,y,W=WW){const adj=nb(x,y);
  return {B:adj.some(c=>W.pits.some(p=>eq(p,c))),S:adj.some(c=>eq(c,W.wumpus))||eq([x,y],W.wumpus),G:eq([x,y],W.gold)};}
function wInfer(visited){ // visited: Map "x,y" -> percepts
  const key=(x,y)=>x+','+y,out={};
  const cells=[];for(let y=1;y<=4;y++)for(let x=1;x<=4;x++)cells.push([x,y]);
  const vis=(c)=>visited.get(key(...c));
  const pitFree=c=>!!vis(c)||nb(...c).some(n=>vis(n)&&!vis(n).B);
  const wFree=c=>!!vis(c)||nb(...c).some(n=>vis(n)&&!vis(n).S);
  for(const c of cells){const k=key(...c);const o={visited:!!vis(c)};
    o.pitFree=pitFree(c);o.wFree=wFree(c);o.safe=o.pitFree&&o.wFree;
    o.pit=false;o.wumpus=false;
    if(!o.visited){
      for(const n of nb(...c)){const v=vis(n);if(!v)continue;
        if(v.B&&nb(...n).filter(m=>!eq(m,c)).every(pitFree)&&!o.pitFree)o.pit=true;
        if(v.S&&nb(...n).filter(m=>!eq(m,c)).every(wFree)&&!o.wFree)o.wumpus=true;}
      const front=nb(...c).some(n=>vis(n));
      o.pitMaybe=front&&!o.pitFree&&!o.pit&&nb(...c).some(n=>vis(n)&&vis(n).B);
      o.wMaybe=front&&!o.wFree&&!o.wumpus&&nb(...c).some(n=>vis(n)&&vis(n).S);}
    out[k]=o;}
  return out;
}
/* ---- Diagram helper (boxes and labelled arrows) ---- */
function netSVG(nodes,edges,W,H,opt={}){
  const nw=opt.nw||118,nh=opt.nh||34;const N={};nodes.forEach(n=>N[n.id]=n);
  const clip=(a,b)=>{const dx=b.x-a.x,dy=b.y-a.y;const aw=(a.w||nw)/2,ah=(a.h||nh)/2;const t=Math.min(dx?aw/Math.abs(dx):1e9,dy?ah/Math.abs(dy):1e9);return [a.x+dx*t,a.y+dy*t];};
  let s=`<svg class="net" viewBox="0 0 ${W} ${H}" width="${W}" role="img" aria-label="${opt.label||'diagram'}"><defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="currentColor"/></marker></defs>`;
  edges.forEach(([f,t,l,d])=>{const a=N[f],b=N[t];const [x1,y1]=clip(a,b),[x2,y2]=clip(b,a);
    s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" ${d?'stroke-dasharray="5 4"':''} marker-end="url(#ar)"/>`;
    if(l)s+=`<text class="el" x="${(x1+x2)/2}" y="${(y1+y2)/2-4}" text-anchor="middle">${l}</text>`;});
  nodes.forEach(n=>{const w=n.w||nw,h=n.h||nh;s+=`<g class="nd ${n.c||''}"><rect x="${n.x-w/2}" y="${n.y-h/2}" width="${w}" height="${h}" rx="${n.r??4}"/><text x="${n.x}" y="${n.y+4}" text-anchor="middle">${n.t}</text></g>`;});
  return s+'</svg>';
}


const DIAG={
kbagent:()=>netSVG([{id:'env',x:80,y:120,t:'Environment',w:110},{id:'ie',x:330,y:70,t:'Inference engine',w:150},{id:'kb',x:330,y:180,t:'Knowledge base (KB)',w:170,c:'hi'},{id:'act',x:580,y:70,t:'Action',w:100}],
 [['env','ie','percept'],['ie','kb','TELL / ASK'],['ie','act','action']],660,230,{label:'Knowledge-based agent'}),
semnet:()=>netSVG([
 {id:'an',x:330,y:28,t:'Animal'},{id:'sk',x:560,y:28,t:'Skin',w:90,c:'prop'},
 {id:'bd',x:170,y:110,t:'Bird'},{id:'ma',x:490,y:110,t:'Mammal'},{id:'fl',x:40,y:110,t:'Fly',w:70,c:'prop'},
 {id:'pe',x:60,y:195,t:'Penguin',w:100},{id:'ca',x:250,y:195,t:'Canary',w:100},{id:'dg',x:490,y:195,t:'Dog',w:100},
 {id:'tw',x:250,y:275,t:'Tweety',w:100,c:'hi'},{id:'rx',x:490,y:275,t:'Rex',w:100,c:'hi'},{id:'ye',x:390,y:275,t:'Yellow',w:80,c:'prop'}],
 [['bd','an','isa'],['ma','an','isa'],['pe','bd','isa'],['ca','bd','isa'],['dg','ma','isa'],['tw','ca','instance'],['rx','dg','instance'],['an','sk','has'],['bd','fl','can'],['tw','ye','colour',1]],
 640,310,{label:'Semantic network'}),
agent:()=>netSVG([{id:'p',x:60,y:60,t:'Percept',w:90},{id:'s',x:195,y:60,t:'State description',w:130},{id:'g',x:355,y:60,t:'Goal (ASK KB)',w:120},{id:'pl',x:510,y:60,t:'Planner',w:90,c:'hi'},{id:'a',x:640,y:60,t:'Action',w:80}],
 [['p','s',''],['s','g',''],['g','pl','goal'],['pl','a','plan[0]']],700,120,{label:'Simple planning agent'}),
pop:()=>netSVG([{id:'st',x:50,y:100,t:'Start',w:70,c:'hi'},{id:'rs',x:190,y:40,t:'RightSock',w:100},{id:'ls',x:190,y:160,t:'LeftSock',w:100},{id:'rh',x:350,y:40,t:'RightShoe',w:100},{id:'lh',x:350,y:160,t:'LeftShoe',w:100},{id:'fi',x:500,y:100,t:'Finish',w:80,c:'hi'}],
 [['st','rs',''],['st','ls',''],['rs','rh','RightSockOn'],['ls','lh','LeftSockOn'],['rh','fi',''],['lh','fi','']],560,200,{label:'Partial order plan'}),
htn:()=>netSVG([{id:'b',x:330,y:25,t:'Build house (abstract)',w:180,c:'hi'},{id:'p',x:90,y:100,t:'Get permit',w:120},{id:'s',x:330,y:100,t:'Build structure (abstract)',w:190},{id:'f',x:570,y:100,t:'Finish interior',w:130},
 {id:'fo',x:200,y:185,t:'Foundation',w:110},{id:'wa',x:330,y:185,t:'Walls',w:90},{id:'ro',x:450,y:185,t:'Roof',w:80}],
 [['b','p','decompose'],['b','s',''],['b','f',''],['s','fo',''],['s','wa',''],['s','ro','']],660,225,{label:'Hierarchical decomposition'})
};
export {pTokens,pParse,truthTable,entails,tParse,tStr,unifyTerms,parseRules,forwardChain,backwardChain,goalStack,WW,nb,eq,wPercept,wInfer,netSVG,DIAG};
