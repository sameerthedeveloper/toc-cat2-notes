/* ===== ENGINES: pure logic (testable) ===== */
const TMS={
 '0n1n':{name:'0ⁿ1ⁿ (n ≥ 0)',start:'q0',final:['q4'],def:'0011',
  t:{'q0,0':['q1','X','R'],'q0,Y':['q3','Y','R'],'q1,0':['q1','0','R'],'q1,Y':['q1','Y','R'],'q1,1':['q2','Y','L'],
     'q2,0':['q2','0','L'],'q2,Y':['q2','Y','L'],'q2,X':['q0','X','R'],'q3,Y':['q3','Y','R'],'q3,_':['q4','_','R'],'q0,_':['q4','_','R']}},
 'anbncn':{name:'aⁿbⁿcⁿ (n ≥ 1)',start:'q0',final:['q5'],def:'aabbcc',
  t:{'q0,a':['q1','X','R'],'q0,Y':['q4','Y','R'],'q1,a':['q1','a','R'],'q1,Y':['q1','Y','R'],'q1,b':['q2','Y','R'],
     'q2,b':['q2','b','R'],'q2,Z':['q2','Z','R'],'q2,c':['q3','Z','L'],
     'q3,a':['q3','a','L'],'q3,b':['q3','b','L'],'q3,Y':['q3','Y','L'],'q3,Z':['q3','Z','L'],'q3,X':['q0','X','R'],
     'q4,Y':['q4','Y','R'],'q4,Z':['q4','Z','R'],'q4,_':['q5','_','R']}},
 'inc':{name:'Binary increment',start:'q0',final:['qf'],def:'1011',
  t:{'q0,0':['q0','0','R'],'q0,1':['q0','1','R'],'q0,_':['q1','_','L'],'q1,1':['q1','0','L'],'q1,0':['qf','1','R'],'q1,_':['qf','1','R']}},
 'add':{name:'Unary addition (1ᵐ01ⁿ → 1ᵐ⁺ⁿ)',start:'q0',final:['qf'],def:'11011',
  t:{'q0,1':['q0','1','R'],'q0,0':['q1','1','R'],'q1,1':['q1','1','R'],'q1,_':['q2','_','L'],'q2,1':['qf','_','R']}}
};
function tmInit(m,input){return {tape:Object.fromEntries([...input].map((c,i)=>[i,c])),head:0,q:m.start,steps:0,status:'ready'};}
function tmStep(m,s){
  if(s.status==='accept'||s.status==='reject')return s;
  if(m.final.includes(s.q)){s.status='accept';return s;}
  const sym=s.tape[s.head]??'_';
  const tr=m.t[s.q+','+sym];
  if(!tr){s.status='reject';return s;}
  s.tape[s.head]=tr[1];s.q=tr[0];s.head+=tr[2]==='R'?1:-1;s.steps++;s.status='running';
  if(m.final.includes(s.q))s.status='accept';
  return s;
}
/* PDA: top of stack = index 0. push string written top-first. */
const PDAS={
 anbn:{name:'aⁿbⁿ (n ≥ 1) — deterministic',start:'q0',Z:'Z',final:['qf'],def:'aabb',
  d:[['q0','a','Z','q0','AZ'],['q0','a','A','q0','AA'],['q0','b','A','q1',''],['q1','b','A','q1',''],['q1','','Z','qf','Z']]},
 wwr:{name:'wwᴿ over {a,b} — nondeterministic',start:'q0',Z:'Z',final:['qf'],def:'abba',
  d:[...['a','b'].flatMap(x=>['Z','a','b'].map(t=>['q0',x,t,'q0',x+t])),
     ...['Z','a','b'].map(t=>['q0','',t,'q1',t]),['q1','a','a','q1',''],['q1','b','b','q1',''],['q1','','Z','qf','Z']]},
 wcwr:{name:'wcwᴿ over {a,b} — deterministic',start:'q0',Z:'Z',final:['q2'],def:'aabcbaa',
  d:[...['a','b'].flatMap(x=>['Z','a','b'].map(t=>['q0',x,t,'q0',x+t])),...['Z','a','b'].map(t=>['q0','c',t,'q1',t]),['q1','a','a','q1',''],['q1','b','b','q1',''],['q1','','Z','q2','Z']]},
 bal:{name:'Balanced ( ) — deterministic',start:'q0',Z:'Z',final:['qf'],def:'(()())',
  d:[['q0','(','Z','q0','XZ'],['q0','(','X','q0','XX'],['q0',')','X','q0',''],['q0','','Z','qf','Z']]}
};
function pdaRun(m,w,limit=4000){
  const start={q:m.start,i:0,st:[m.Z],path:[{q:m.start,rest:w,st:m.Z}]};
  const seen=new Set();const queue=[start];let n=0;
  while(queue.length&&n++<limit){
    const c=queue.shift();
    if(c.i===w.length&&m.final.includes(c.q))return c.path;
    const key=c.q+'|'+c.i+'|'+c.st.join('');
    if(seen.has(key)||c.st.length>w.length+6)continue;seen.add(key);
    if(!c.st.length)continue;
    for(const [q,a,X,p,push] of m.d){
      if(q!==c.q||X!==c.st[0])continue;
      if(a!==''&&w[c.i]!==a)continue;
      const i=c.i+(a===''?0:1);const st=[...push,...c.st.slice(1)];
      queue.push({q:p,i,st,path:[...c.path,{q:p,rest:w.slice(i),st:st.join('')}]});
    }
  }
  return null;
}
/* Pumping-lemma languages */
const PLL={
 anbn:{name:'aⁿbⁿ',w:p=>'a'.repeat(p)+'b'.repeat(p),mem:s=>{const m=/^(a*)(b*)$/.exec(s);return !!m&&m[1].length===m[2].length;}},
 ww:{name:'ww',w:p=>'a'.repeat(p)+'b'+'a'.repeat(p)+'b',mem:s=>s.length%2===0&&s.slice(0,s.length/2)===s.slice(s.length/2)},
 sq:{name:'a^(n²)',w:p=>'a'.repeat(p*p),mem:s=>/^a*$/.test(s)&&Number.isInteger(Math.sqrt(s.length))},
 gt:{name:'0ⁱ1ʲ, i > j',w:p=>'0'.repeat(p+1)+'1'.repeat(p),mem:s=>{const m=/^(0*)(1*)$/.exec(s);return !!m&&m[1].length>m[2].length;}}
};
function plSplits(L,p){
  const w=PLL[L].w(p),out=[];
  for(let s=0;s<p;s++)for(let k=1;s+k<=p;k++){
    const x=w.slice(0,s),y=w.slice(s,s+k),z=w.slice(s+k);let bad=null;
    for(let i=0;i<=5;i++){if(!PLL[L].mem(x+y.repeat(i)+z)){bad=i;break;}}
    out.push({s,k,x,y,z,bad});
  }
  return out;
}
/* Tree layout */
const N=(l,...c)=>({l,c});const Tm=l=>({l,t:1,c:[]});
function treeSVG(root){
  let leaf=0,maxd=0;const W=46,H=54;
  (function pos(n,d){n.d=d;maxd=Math.max(maxd,d);if(!n.c.length){n.x=leaf++*W+W/2;}else{n.c.forEach(c=>pos(c,d+1));n.x=(n.c[0].x+n.c[n.c.length-1].x)/2;}})(root,0);
  const w=Math.max(leaf,1)*W,h=(maxd+1)*H;let lines='',txt='';
  (function draw(n){const y=n.d*H+26;
    n.c.forEach(c=>{lines+=`<line x1="${n.x}" y1="${y+6}" x2="${c.x}" y2="${c.d*H+26-12}"/>`;draw(c)});
    txt+=`<text x="${n.x}" y="${y}" text-anchor="middle" class="${n.t?'t':''}">${n.l}</text>`;})(root);
  return `<svg class="tree" viewBox="0 0 ${w} ${h}" width="${w}" role="img" aria-label="parse tree">${lines}${txt}</svg>`;
}
const TREES={
 anbn:{cap:'Parse tree for aabb with S → aSb | ab',root:()=>N('S',Tm('a'),N('S',Tm('a'),Tm('b')),Tm('b'))},
 ullman:{cap:'Parse tree for aabbaa with S → aAS | a, A → SbA | SS | ba',root:()=>N('S',Tm('a'),N('A',N('S',Tm('a')),Tm('b'),N('A',Tm('b'),Tm('a'))),N('S',Tm('a')))}
};
const AMB=[
 {name:'Tree 1 · + at the root',val:14,lmd:'E ⇒ E+E ⇒ id+E ⇒ id+E*E ⇒ id+id*E ⇒ id+id*id',
  root:()=>N('E',N('E',N('id',Tm('2'))),Tm('+'),N('E',N('E',N('id',Tm('3'))),Tm('*'),N('E',N('id',Tm('4')))))},
 {name:'Tree 2 · * at the root',val:20,lmd:'E ⇒ E*E ⇒ E+E*E ⇒ id+E*E ⇒ id+id*E ⇒ id+id*id',
  root:()=>N('E',N('E',N('E',N('id',Tm('2'))),Tm('+'),N('E',N('id',Tm('3')))),Tm('*'),N('E',N('id',Tm('4'))))}
];


export {TMS,tmInit,tmStep,PDAS,pdaRun,PLL,plSplits,treeSVG,TREES,AMB};
