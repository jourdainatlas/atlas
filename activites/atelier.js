// Activité « Atelier de construction » (rubrique Activités, MEMO_atlas_activites.md).
// Le texte (html) est mis à la charte du site. Le code des figures, entre les deux repères ci-dessous, est
// celui du prototype de l'auteur ; y ont changé les messages (vouvoiement), les comparaisons de la limite d'une
// suite et, dans l'atelier, l'outil Intersection ajouté à l'interface (MEMO_atlas_activites.md, §118).
import { bac, css as cssCommun } from './commun.js';

export const css = cssCommun + `
.activites-act .bench { display: grid; grid-template-columns: 330px minmax(0, 1fr); gap: 18px; align-items: start; margin-top: 24px; }
@media (max-width: 900px) { .activites-act .bench { grid-template-columns: 1fr; } }
.activites-act .sheet { background: var(--surface); border: 1px solid var(--filet); border-radius: 8px; margin-top: 0; }
.activites-act aside.sheet { padding: 14px 16px 16px; display: flex; flex-direction: column; gap: 14px; font-size: 16px; line-height: 1.5; }
.activites-act .defis { display: flex; flex-direction: column; gap: 4px; margin: 0; padding: 0; list-style: none; }
.activites-act .defis button { width: 100%; display: flex; justify-content: space-between; align-items: center; gap: 8px; text-align: left; font: 500 14.5px var(--f-ui); color: var(--encre); background: transparent; border: 1px solid transparent; border-radius: 6px; padding: 4px 9px; cursor: pointer; }
.activites-act .defis button:hover { background: var(--trame); }
.activites-act .defis button[aria-current="true"] { border-color: var(--encre-3); background: var(--papier); }
.activites-act .defis .grp { font: 500 11.5px var(--f-ui); letter-spacing: .07em; text-transform: uppercase; color: var(--encre-3); padding: 8px 9px 2px; }
.activites-act .defis .grp:first-child { padding-top: 0; }
.activites-act .pill { font-size: 11px; font-weight: 600; letter-spacing: .04em; padding: 1px 8px; border-radius: 999px; border: 1px solid var(--filet); color: var(--encre-3); white-space: nowrap; }
.activites-act .pill.done { border-color: var(--ok); color: var(--ok); }
.activites-act .enonce { border: 0; padding: 0; margin: 0; background: none; border-radius: 0; }
.activites-act .enonce h4 { font-size: 20px; margin: 0 0 6px; }
.activites-act .enonce p { margin: 0 0 8px; }
.activites-act details { font-size: 15px; color: var(--encre-2); }
.activites-act summary { cursor: pointer; font: 13.5px var(--f-ui); color: var(--encre); }
.activites-act .actions { display: flex; flex-wrap: wrap; gap: 8px; }
.activites-act .btn { padding: 6px 14px; font-size: 14.5px; }
.activites-act .verdict { border-left: 4px solid var(--filet); padding: 8px 10px; background: var(--papier); border-radius: 0 6px 6px 0; min-height: 60px; font-size: 15px; }
.activites-act .verdict.ok { border-left-color: var(--ok); }
.activites-act .verdict.ko { border-left-color: var(--free); }
.activites-act .verdict b { display: block; margin-bottom: 2px; }
.activites-act .verdict.ok b { color: var(--ok); }
.activites-act .verdict.ko b { color: var(--free); }
.activites-act .stage { display: flex; flex-direction: column; overflow: hidden; }
.activites-act .tools { display: flex; flex-wrap: wrap; gap: 2px; padding: 8px 6px; border-bottom: 1px solid var(--filet); }
.activites-act .tools .sep { flex: 1 1 12px; }
.activites-act .tool { display: flex; flex-direction: column; align-items: center; gap: 1px; min-width: 44px; font: 500 11px var(--f-ui); color: var(--encre); background: transparent; border: 1px solid transparent; border-radius: 6px; padding: 5px 4px 4px; cursor: pointer; }
.activites-act .tool svg { width: 24px; height: 24px; fill: none; stroke: currentColor; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round; }
.activites-act .tool svg .f { fill: currentColor; stroke: none; }
.activites-act .tool:hover { background: var(--trame); }
.activites-act .tool[aria-pressed="true"] { background: var(--encre); color: var(--surface); }
.activites-act #board { display: block; width: 100%; height: clamp(400px, 66vh, 680px); touch-action: none; cursor: crosshair; }
.activites-act .status { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 6px 18px; padding: 8px 12px; border-top: 1px solid var(--filet); font: 13.5px var(--f-ui); }
.activites-act .legend { display: flex; flex-wrap: wrap; gap: 4px 14px; color: var(--encre-2); }
.activites-act .legend span { display: inline-flex; align-items: center; gap: 5px; }
.activites-act .legend i { width: 11px; height: 11px; border-radius: 50%; display: inline-block; border: 2px solid var(--encre); }
.activites-act .legend i.l1 { background: var(--free); border-color: var(--free); }
.activites-act .legend i.l2 { background: var(--semi); border-color: var(--semi); }
.activites-act .legend i.l3 { background: var(--surface); }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Collège, lycée · Géométrie plane</p>
  <h3>Atelier de construction</h3>
  <p class="lede">Un <b>dessin</b> a l'air juste. Une <b>figure</b> reste juste quand on déplace ses points. Ici, seules les figures comptent.</p>
</header>

<div class="bench">
  <aside class="sheet">
    <ul class="defis" id="defis"></ul>
    <div class="enonce">
      <h4 id="ch-title"></h4>
      <p id="ch-text"></p>
      <details id="ch-hintbox"><summary>Un indice</summary><p id="ch-hint" style="margin:6px 0 0"></p></details>
    </div>
    <div class="actions">
      <button class="btn primary" id="b-check">Vérifier ma figure</button>
      <button class="btn" id="b-shake">Secouer</button>
    </div>
    <div class="verdict" id="verdict" aria-live="polite"></div>
  </aside>
  <section class="sheet stage">
    <div class="tools" id="tools" role="toolbar" aria-label="Outils de construction"></div>
    <canvas id="board" aria-label="Planche de construction géométrique"></canvas>
    <div class="status">
      <span id="hint"></span>
      <span class="legend"><span><i class="l1"></i>point libre</span><span><i class="l2"></i>lié à une ligne</span><span><i class="l3"></i>construit</span></span>
    </div>
  </section>
</div>

<div class="suite col">
  <h4>Le piège le plus courant</h4>
  <p>Placer un point « à l'œil » au bon endroit ne construit rien : dès qu'un point libre bouge, la propriété se perd. Une construction ne vaut que si chaque point est défini par les précédents (milieu, intersection, perpendiculaire), jamais posé à vue.</p>
  <h4>Où lire la démonstration</h4>
  <p>Pourquoi le pentagone régulier se construit-il à la règle et au compas, et pas l'heptagone ? Dans l'édifice, la fiche <a href="#galois-cyclotomie.gc-constructibles">Points constructibles et constructions élémentaires</a> définit précisément ce qu'on a le droit de faire, et la fiche <a href="#galois-cyclotomie.gc-gauss-wantzel">Polygones réguliers constructibles</a> dit exactement quels polygones sont accessibles.</p>
  <h4>Ce que la page calcule</h4>
  <p>« Vérifier » déplace quarante fois les points libres au hasard et contrôle que la propriété demandée tient à chaque fois ; en cas d'échec, l'atelier rejoue un contre-exemple. C'est un test, pas une démonstration : il ne remplace pas la preuve que votre construction est juste. Seule la liste des défis réussis est gardée, dans ce navigateur.</p>
</div>`;

export function monter() {
  const { window, MutationObserver, ResizeObserver, demonter } = bac();
/* ======== début du code du prototype ======== */
(function(){
'use strict';
//<engine>
const REFS=['a','b','o','o1','o2','p','l','c'];
const BAD={ok:false};
function evalAll(objs){const G=new Map();for(const o of objs)G.set(o.id,evalOne(o,G));return G;}
function evalOne(o,G){
  const g=id=>G.get(id);
  if(o.t==='pt'){
    if(o.k==='free') return {t:'pt',x:o.x,y:o.y,ok:true};
    if(o.k==='mid'){const a=g(o.a),b=g(o.b);if(!a||!b||!a.ok||!b.ok)return BAD;return {t:'pt',x:(a.x+b.x)/2,y:(a.y+b.y)/2,ok:true};}
    if(o.k==='on'){const h=g(o.o);if(!h||!h.ok)return BAD;
      if(h.t==='ci')return {t:'pt',x:h.x+h.r*Math.cos(o.u),y:h.y+h.r*Math.sin(o.u),ok:true};
      let u=o.u;if(h.seg)u=Math.max(0,Math.min(1,u));return {t:'pt',x:h.x+u*h.dx,y:h.y+u*h.dy,ok:true};}
    if(o.k==='int'){const P=inter(g(o.o1),g(o.o2)),p=P[o.i];return p?{t:'pt',x:p.x,y:p.y,ok:true}:BAD;}
  }
  if(o.t==='ln'){
    if(o.k==='seg'||o.k==='line'){const a=g(o.a),b=g(o.b);if(!a||!b||!a.ok||!b.ok)return BAD;
      const dx=b.x-a.x,dy=b.y-a.y;if(Math.hypot(dx,dy)<1e-9)return BAD;return {t:'ln',x:a.x,y:a.y,dx,dy,seg:o.k==='seg',ok:true};}
    const p=g(o.p),l=g(o.l);if(!p||!l||!p.ok||!l.ok)return BAD;
    const n=Math.hypot(l.dx,l.dy),ux=l.dx/n,uy=l.dy/n;
    return o.k==='par'?{t:'ln',x:p.x,y:p.y,dx:ux,dy:uy,seg:false,ok:true}:{t:'ln',x:p.x,y:p.y,dx:-uy,dy:ux,seg:false,ok:true};
  }
  if(o.t==='ci'){const c=g(o.c),p=g(o.p);if(!c||!p||!c.ok||!p.ok)return BAD;const r=Math.hypot(p.x-c.x,p.y-c.y);if(r<1e-9)return BAD;return {t:'ci',x:c.x,y:c.y,r,ok:true};}
  return BAD;
}
function inter(A,B){
  if(!A||!B||!A.ok||!B.ok)return [null,null];
  if(A.t==='ci'&&B.t==='ln')return inter(B,A);
  const E=1e-9;
  if(A.t==='ln'&&B.t==='ln'){
    const den=A.dx*B.dy-A.dy*B.dx;
    if(Math.abs(den)<1e-12*Math.hypot(A.dx,A.dy)*Math.hypot(B.dx,B.dy))return [null,null];
    const s=((B.x-A.x)*B.dy-(B.y-A.y)*B.dx)/den,u=((B.x-A.x)*A.dy-(B.y-A.y)*A.dx)/den;
    if(A.seg&&(s<-E||s>1+E))return [null,null];
    if(B.seg&&(u<-E||u>1+E))return [null,null];
    return [{x:A.x+s*A.dx,y:A.y+s*A.dy},null];
  }
  if(A.t==='ln'&&B.t==='ci'){
    const fx=A.x-B.x,fy=A.y-B.y,a=A.dx*A.dx+A.dy*A.dy,b=2*(fx*A.dx+fy*A.dy),c=fx*fx+fy*fy-B.r*B.r;
    let disc=b*b-4*a*c;if(disc<0){if(disc>-1e-7*a*B.r*B.r)disc=0;else return [null,null];}
    const q=Math.sqrt(disc),ts=[(-b-q)/(2*a),(-b+q)/(2*a)];
    return ts.map(t=>(A.seg&&(t<-E||t>1+E))?null:{x:A.x+t*A.dx,y:A.y+t*A.dy});
  }
  if(A.t==='ci'&&B.t==='ci'){
    const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy);if(d<1e-9)return [null,null];
    const a=(A.r*A.r-B.r*B.r+d*d)/(2*d);let h2=A.r*A.r-a*a;
    if(h2<0){if(h2>-1e-7*A.r*A.r)h2=0;else return [null,null];}
    const h=Math.sqrt(h2),ux=dx/d,uy=dy/d,bx=A.x+a*ux,by=A.y+a*uy;
    return [{x:bx-h*uy,y:by+h*ux},{x:bx+h*uy,y:by-h*ux}];
  }
  return [null,null];
}
const dist=(p,q)=>Math.hypot(p.x-q.x,p.y-q.y);
function distCurve(g,w){
  if(g.t==='ci')return Math.abs(Math.hypot(w.x-g.x,w.y-g.y)-g.r);
  let u=((w.x-g.x)*g.dx+(w.y-g.y)*g.dy)/(g.dx*g.dx+g.dy*g.dy);if(g.seg)u=Math.max(0,Math.min(1,u));
  return Math.hypot(w.x-g.x-u*g.dx,w.y-g.y-u*g.dy);
}
function paramOn(g,w){
  if(g.t==='ci')return Math.atan2(w.y-g.y,w.x-g.x);
  let u=((w.x-g.x)*g.dx+(w.y-g.y)*g.dy)/(g.dx*g.dx+g.dy*g.dy);if(g.seg)u=Math.max(0,Math.min(1,u));return u;
}
function hostKind(o,objs){const h=objs.find(x=>x.id===o.o);if(!h)return 'unit';if(h.t==='ci')return 'ci';return h.k==='seg'?'seg':h.k==='line'?'line':'unit';}
function isParam(o,userOnly){return o.t==='pt'&&((o.k==='free'&&!o.lock)||o.k==='on')&&!(userOnly&&o.given);}
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function perturbed(base,rng,userOnly){
  const c=JSON.parse(JSON.stringify(base));
  for(const o of c){ if(!isParam(o,userOnly))continue;
    if(o.k==='free'){o.x+=(rng()*2-1)*90;o.y+=(rng()*2-1)*90;}
    else{const k=hostKind(o,c);
      if(k==='ci')o.u+=(rng()*2-1)*2.5;else if(k==='seg')o.u=0.05+0.9*rng();else if(k==='line')o.u+=(rng()*2-1)*0.8;else o.u+=(rng()*2-1)*120;}
  }
  return c;
}
/* predicates: ps = array of {x,y}; tol relative */
function isEqui(ps,tol){const d=[dist(ps[0],ps[1]),dist(ps[1],ps[2]),dist(ps[2],ps[0])],s=(d[0]+d[1]+d[2])/3;return s>5&&d.every(x=>Math.abs(x-s)<tol*s);}
function isSquare(ps,tol){const d=[0,1,2,3].map(i=>dist(ps[i],ps[(i+1)%4])),s=(d[0]+d[1]+d[2]+d[3])/4;
  return s>5&&d.every(x=>Math.abs(x-s)<tol*s)&&Math.abs(dist(ps[0],ps[2])-dist(ps[1],ps[3]))<tol*s;}
function isPara(ps,tol,loose){const s=Math.max(dist(ps[0],ps[1]),dist(ps[1],ps[2]));if(s<=5)return false;
  const ex=ps[0].x+ps[2].x-ps[1].x-ps[3].x,ey=ps[0].y+ps[2].y-ps[1].y-ps[3].y;
  const area=Math.abs((ps[1].x-ps[0].x)*(ps[3].y-ps[0].y)-(ps[1].y-ps[0].y)*(ps[3].x-ps[0].x));
  return Math.hypot(ex,ey)<tol*s&&area>(loose?0.05:1e-4)*s*s;}
function combos(ids,k){const out=[];(function rec(st,acc){if(acc.length===k){out.push(acc.slice());return;}for(let i=st;i<ids.length;i++){acc.push(ids[i]);rec(i+1,acc);acc.pop();}})(0,[]);return out;}
function cyc(c){return [[c[0],c[1],c[2],c[3]],[c[0],c[1],c[3],c[2]],[c[0],c[2],c[1],c[3]]];}
const LOOSE=0.04,STRICT=1e-6;
function distLine(p,l){return Math.abs((p.x-l.x)*l.dy-(p.y-l.y)*l.dx)/Math.hypot(l.dx,l.dy);}
const CH=[
 {id:'equi',title:'Triangle équilatéral',shape:'un triangle équilatéral',
  text:'Construisez trois points qui forment un triangle équilatéral, quelle que soit la position des points libres.',
  hint:'Deux cercles de même rayon se coupent à égale distance de leurs deux centres.',
  init:()=>[],
  cands:(ids,G)=>combos(ids,3).filter(c=>isEqui(c.map(i=>G.get(i)),LOOSE)),
  strict:ps=>isEqui(ps,STRICT)},
 {id:'carre',title:'Carré',shape:'un carré',
  text:'Construisez quatre points qui forment un carré. Il doit rester un carré quand on déplace n\'importe quel point libre.',
  hint:'Un angle droit s\'obtient avec une perpendiculaire, une longueur se reporte avec un cercle.',
  init:()=>[],
  cands:(ids,G)=>{const r=[];for(const c of combos(ids,4))for(const o of cyc(c))if(isSquare(o.map(i=>G.get(i)),LOOSE))r.push(o);return r;},
  strict:ps=>isSquare(ps,STRICT)},
 {id:'para',title:'Parallélogramme',shape:'un parallélogramme',
  text:'Construisez quatre points qui forment un parallélogramme. Combien de sommets pouvez-vous choisir librement ?',
  hint:'Trois sommets libres suffisent. Le quatrième se trouve au croisement de deux parallèles.',
  init:()=>[],
  cands:(ids,G)=>{const r=[];for(const c of combos(ids,4))for(const o of cyc(c))if(isPara(o.map(i=>G.get(i)),LOOSE,true))r.push(o);return r;},
  strict:ps=>isPara(ps,STRICT,false)},
 {id:'circ',title:'Centre du cercle circonscrit',shape:'un point à égale distance de A, B et C',
  text:'Le triangle ABC est donné. Construisez un point situé à la même distance de A, de B et de C, puis déformez le triangle pour vérifier.',
  hint:'Les points à égale distance de A et de B forment la médiatrice de [AB] : la perpendiculaire passant par son milieu.',
  init:()=>[
   {id:1,t:'pt',k:'free',x:-170,y:110,name:'A',given:true},{id:2,t:'pt',k:'free',x:190,y:130,name:'B',given:true},{id:3,t:'pt',k:'free',x:30,y:-150,name:'C',given:true},
   {id:4,t:'ln',k:'seg',a:1,b:2,given:true},{id:5,t:'ln',k:'seg',a:2,b:3,given:true},{id:6,t:'ln',k:'seg',a:3,b:1,given:true}],
  cands:(ids,G)=>ids.filter(i=>i>6).filter(i=>{const p=G.get(i),d=[1,2,3].map(k=>dist(p,G.get(k))),s=(d[0]+d[1]+d[2])/3;return d.every(x=>Math.abs(x-s)<LOOSE*s);}).map(i=>[i]),
  strict:(ps,G)=>{const d=[1,2,3].map(k=>dist(ps[0],G.get(k))),s=(d[0]+d[1]+d[2])/3;return s>1&&d.every(x=>Math.abs(x-s)<STRICT*s);}},
 {id:'parab',title:'Parabole',shape:'un point à égale distance de F et de la droite d',
  text:'La droite d et le point F sont donnés. Construisez un point M qui reste toujours aussi loin de F que de d, et qui se déplace quand vous bougez un point de d. Activez sa trace pour voir la courbe qu\'il décrit.',
  hint:'Posez H sur d. M est sur la perpendiculaire à d passant par H, et à égale distance de F et de H.',
  userOnlyShake:true,
  init:()=>[
   {id:1,t:'pt',k:'free',x:-340,y:150,name:'',lock:true,given:true},{id:2,t:'pt',k:'free',x:340,y:150,name:'',lock:true,given:true},
   {id:3,t:'ln',k:'line',a:1,b:2,given:true,label:'d'},{id:4,t:'pt',k:'free',x:0,y:30,name:'F',given:true}],
  cands:(ids,G)=>ids.filter(i=>i>4).filter(i=>{const p=G.get(i),a=dist(p,G.get(4)),b=distLine(p,G.get(3));return Math.abs(a-b)<LOOSE*a+2;}).map(i=>[i]),
  strict:(ps,G)=>{const a=dist(ps[0],G.get(4)),b=distLine(ps[0],G.get(3));return Math.abs(a-b)<STRICT*(a+1);},
  mustMove:true},
 {id:'libre',title:'Atelier libre',shape:'',free:true,
  text:'Aucune consigne. Construisez ce que vous voulez, puis secouez la figure pour voir ce qui tient.',
  hint:'',init:()=>[]}
];

function isRegular(ps,tol){const k=ps.length;let cx=0,cy=0;ps.forEach(p=>{cx+=p.x;cy+=p.y;});const c={x:cx/k,y:cy/k};
  const s=dist(ps[0],ps[1]);if(!(s>5))return false;const R=s/(2*Math.sin(Math.PI/k));
  for(let i=0;i<k;i++){if(Math.abs(dist(ps[i],ps[(i+1)%k])-s)>tol*s)return false;if(Math.abs(dist(ps[i],c)-R)>tol*s)return false;}
  return true;}
function regCands(k){return (ids,G)=>{const out=[],seen=new Set(),th=2*Math.PI/k;
  for(const i of ids)for(const j of ids){if(i===j)continue;const p=G.get(i),q=G.get(j),s=dist(p,q);if(s<5)continue;
    const h=s/(2*Math.tan(Math.PI/k)),ux=(q.x-p.x)/s,uy=(q.y-p.y)/s,c={x:(p.x+q.x)/2-uy*h,y:(p.y+q.y)/2+ux*h};
    const a0=Math.atan2(p.y-c.y,p.x-c.x),a1=Math.atan2(q.y-c.y,q.x-c.x);let d=a1-a0;while(d>Math.PI)d-=2*Math.PI;while(d<-Math.PI)d+=2*Math.PI;
    const sg=d>0?1:-1,R=dist(p,c),c2=[i,j];let ok=true;
    for(let m=2;m<k&&ok;m++){const x=c.x+R*Math.cos(a0+sg*m*th),y=c.y+R*Math.sin(a0+sg*m*th);
      const f=ids.find(t=>!c2.includes(t)&&Math.hypot(G.get(t).x-x,G.get(t).y-y)<LOOSE*s);if(f===undefined)ok=false;else c2.push(f);}
    if(ok){const key=c2.slice().sort((a,b)=>a-b).join();if(!seen.has(key)){seen.add(key);out.push(c2);}}}
  return out;};}
function tangOk(T,G,tol){const O=G.get(1),P=G.get(4),ci=G.get(3);if(!ci.ok)return false;const r=ci.r,tp=dist(T,P);
  return tp>5&&Math.abs(dist(T,O)-r)<tol*r&&Math.abs((T.x-O.x)*(T.x-P.x)+(T.y-O.y)*(T.y-P.y))<tol*r*tp;}
function inOk(p,G,tol){const A=G.get(1),B=G.get(2),C=G.get(3),L=[4,5,6].map(k=>G.get(k));if(L.some(l=>!l.ok))return false;
  const d=L.map(l=>distLine(p,l)),s=(d[0]+d[1]+d[2])/3;if(!(s>3)||!d.every(x=>Math.abs(x-s)<tol*s))return false;
  const cr=(a,b)=>(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x),z=[cr(A,B),cr(B,C),cr(C,A)];return z.every(v=>v>0)||z.every(v=>v<0);}
function ellOk(M,G,tol){const ci=G.get(3);return ci.ok&&Math.abs(dist(M,G.get(1))+dist(M,G.get(4))-ci.r)<tol*ci.r;}
CH.splice(CH.length-1,0,
 {id:'hexa',title:'Hexagone régulier',shape:'un hexagone régulier',
  text:'Construisez six points qui forment un hexagone régulier.',
  hint:'Le côté d\'un hexagone régulier est égal au rayon de son cercle circonscrit.',
  init:()=>[],cands:regCands(6),strict:ps=>isRegular(ps,STRICT)},
 {id:'tang',title:'Tangente issue d\'un point',shape:'le point de contact d\'une tangente issue de P',
  text:'Le cercle de centre O et le point P sont donnés. Construisez un point T du cercle tel que la droite (PT) soit tangente au cercle.',
  hint:'La tangente en T est perpendiculaire au rayon [OT] : le triangle OTP est rectangle en T. Où se trouvent tous les points qui voient [OP] sous un angle droit ?',
  init:()=>[{id:1,t:'pt',k:'free',x:-110,y:20,name:'O',given:true},{id:2,t:'pt',k:'free',x:0,y:20,name:'R',given:true},
   {id:3,t:'ci',c:1,p:2,given:true},{id:4,t:'pt',k:'free',x:230,y:-50,name:'P',given:true}],
  cands:(ids,G)=>ids.filter(i=>i>4&&tangOk(G.get(i),G,LOOSE)).map(i=>[i]),
  strict:(ps,G)=>tangOk(ps[0],G,STRICT)},
 {id:'inscrit',title:'Centre du cercle inscrit',shape:'un point intérieur à égale distance des trois côtés',
  text:'Le triangle ABC est donné. Construisez le centre de son cercle inscrit : le point intérieur situé à la même distance des trois côtés. Il n\'y a pas d\'outil bissectrice, à vous de la fabriquer.',
  hint:'Un cercle de centre A coupe les deux côtés issus de A en deux points. La bissectrice passe par A et par leur milieu.',
  init:()=>[
   {id:1,t:'pt',k:'free',x:-200,y:130,name:'A',given:true},{id:2,t:'pt',k:'free',x:210,y:140,name:'B',given:true},{id:3,t:'pt',k:'free',x:40,y:-170,name:'C',given:true},
   {id:4,t:'ln',k:'seg',a:1,b:2,given:true},{id:5,t:'ln',k:'seg',a:2,b:3,given:true},{id:6,t:'ln',k:'seg',a:3,b:1,given:true}],
  cands:(ids,G)=>ids.filter(i=>i>6&&inOk(G.get(i),G,LOOSE)).map(i=>[i]),
  strict:(ps,G)=>inOk(ps[0],G,STRICT)},
 {id:'ellipse',title:'Ellipse',shape:'un point dont la somme des distances à F et à G vaut le rayon',
  text:'Le cercle de centre F et le point G sont donnés. Construisez un point M tel que MF + MG reste égal au rayon du cercle, et qui se déplace quand vous bougez un point du cercle. Activez sa trace pour voir la courbe.',
  hint:'Posez P sur le cercle. Cherchez M sur le rayon [FP], à égale distance de P et de G : alors MF + MG = MF + MP = FP.',
  userOnlyShake:true,mustMove:true,
  init:()=>[{id:1,t:'pt',k:'free',x:-70,y:0,name:'F',lock:true,given:true},{id:2,t:'pt',k:'free',x:190,y:0,name:'',lock:true,given:true},
   {id:3,t:'ci',c:1,p:2,given:true},{id:4,t:'pt',k:'free',x:60,y:20,name:'G',given:true}],
  cands:(ids,G)=>ids.filter(i=>i>4&&ellOk(G.get(i),G,LOOSE)).map(i=>[i]),
  strict:(ps,G)=>ellOk(ps[0],G,STRICT)},
 {id:'penta',title:'Pentagone régulier',shape:'un pentagone régulier',
  text:'Construisez cinq points qui forment un pentagone régulier. C\'est la construction la plus longue de l\'atelier.',
  hint:'Dans un cercle de centre O, tracez deux diamètres perpendiculaires [AA′] et [BB′]. Soit I le milieu de [OB′]. Le cercle de centre I passant par A recoupe [OB] en P. La longueur AP est le côté du pentagone inscrit dans le cercle.',
  init:()=>[],cands:regCands(5),strict:ps=>isRegular(ps,STRICT)}
);
const ORDER=['equi','carre','para','hexa','circ','tang','inscrit','penta','parab','ellipse','libre'];
CH.sort((a,b)=>ORDER.indexOf(a.id)-ORDER.indexOf(b.id));
const LVL={equi:'Pour démarrer',hexa:'Constructions classiques',inscrit:'Plus difficile',parab:'Lieux de points',libre:'Sans consigne'};
function runCheck(ch,base,seed){
  const G0=evalAll(base),ids=base.filter(o=>o.t==='pt'&&G0.get(o.id).ok&&!(o.lock)).map(o=>o.id).slice(0,40);
  const cands=ch.cands(ids,G0);
  if(!cands.length)return {status:'none'};
  const rng=mulberry(seed||12345),trials=[];
  for(let i=0;i<40;i++){const objs=perturbed(base,rng,false);trials.push({objs,G:evalAll(objs)});}
  let fail=null,undef=false,stat=false;
  for(const c of cands){
    let defined=0,bad=null;
    for(const tr of trials){const ps=c.map(id=>tr.G.get(id));if(ps.some(p=>!p.ok))continue;defined++;if(!ch.strict(ps,tr.G)){bad=tr;break;}}
    if(bad){if(!fail)fail={cand:c,objs:bad.objs};continue;}
    if(defined<12){undef=true;continue;}
    if(ch.mustMove){let x0=1e9,x1=-1e9,y0=1e9,y1=-1e9;
      for(let i=0;i<14;i++){const p=evalAll(perturbed(base,rng,true)).get(c[0]);if(!p.ok)continue;x0=Math.min(x0,p.x);x1=Math.max(x1,p.x);y0=Math.min(y0,p.y);y1=Math.max(y1,p.y);}
      if(!(Math.hypot(x1-x0,y1-y0)>15)){stat=true;continue;}}
    return {status:'ok',cand:c};
  }
  if(fail)return {status:'fragile',cand:fail.cand,objs:fail.objs};
  if(stat)return {status:'static'};
  return {status:undef?'undef':'none'};
}
//</engine>
if(typeof module!=='undefined'&&typeof document==='undefined'){module.exports={evalAll,inter,runCheck,CH,perturbed,mulberry};return;}

/* ================= interface ================= */
const $=id=>document.getElementById(id);
const cv=$('board'),ctx=cv.getContext('2d');
const st={cur:0,objs:[],nid:1,undo:[],saved:{},done:{},flash:null};
let booted=false,G=new Map(),tool='move',pend={pts:[],ln:null},cursor=null,hover=null,snap=null,dragging=null,anim=false,W=600,H=400,C={};
const traces=new Map();
const TOOLS=[
 ['move','Déplacer','<path class="f" d="M6 3l12 8-5.2 1.1L15.5 18l-2.3 1-2.6-5.8L6 17z"/>'],
 ['point','Point','<circle class="f" cx="12" cy="12" r="3.5"/>'],
 ['inter','Intersection','<path d="M3 18L21 8M6 4l10 17"/><circle class="f" cx="11.5" cy="13.3" r="2.9"/>'],
 ['seg','Segment','<path d="M5 19L19 5"/><circle class="f" cx="5" cy="19" r="2.3"/><circle class="f" cx="19" cy="5" r="2.3"/>'],
 ['line','Droite','<path d="M2 22L22 2"/><circle class="f" cx="8" cy="16" r="2.1"/><circle class="f" cx="16" cy="8" r="2.1"/>'],
 ['circle','Cercle','<circle cx="12" cy="12" r="8.5"/><circle class="f" cx="12" cy="12" r="1.8"/>'],
 ['mid','Milieu','<path d="M4 18L20 6"/><circle cx="4" cy="18" r="2"/><circle cx="20" cy="6" r="2"/><circle class="f" cx="12" cy="12" r="2.6"/>'],
 ['perp','Perpendiculaire','<path d="M3 19h18M12 19V3M12 15h4v4"/>'],
 ['par','Parallèle','<path d="M3 17L15 5M9 20L21 8"/>'],
 ['trace','Trace','<circle class="f" cx="4" cy="18" r="1.4"/><circle class="f" cx="8" cy="12.5" r="1.4"/><circle class="f" cx="13" cy="9" r="1.4"/><circle class="f" cx="19" cy="7" r="2.6"/>'],
 ['del','Effacer','<path d="M6 6l12 12M18 6L6 18"/>']
];
const HINTS={
 move:['Attrapez un point plein et déplacez-le. Les points creux suivent la construction.'],
 point:['Cliquez pour poser un point. Sur une ligne il y reste accroché, à un croisement il devient l\'intersection.'],
 inter:['Intersection : cliquez sur un croisement, ou sur une première ligne (droite, segment ou cercle).','Intersection : cliquez sur la seconde ligne. Tous leurs points communs sont créés.'],
 seg:['Segment : cliquez sur la première extrémité.','Segment : cliquez sur la seconde extrémité.'],
 line:['Droite : cliquez sur un premier point.','Droite : cliquez sur un second point.'],
 circle:['Cercle : cliquez sur le centre.','Cercle : cliquez sur un point par lequel il passe.'],
 mid:['Milieu : cliquez sur un premier point.','Milieu : cliquez sur le second point.'],
 perp:['Perpendiculaire : cliquez sur un point et sur une droite ou un segment, dans l\'ordre que vous voulez.','Perpendiculaire : il manque encore un point ou une ligne.'],
 par:['Parallèle : cliquez sur un point et sur une droite ou un segment, dans l\'ordre que vous voulez.','Parallèle : il manque encore un point ou une ligne.'],
 trace:['Trace : cliquez sur un point pour qu\'il laisse une trace quand la figure bouge. Recliquez pour l\'arrêter.'],
 del:['Effacer : cliquez sur un objet. Tout ce qui en dépend disparaît aussi.']
};

function readTheme(){const cs=getComputedStyle(document.documentElement),g=n=>cs.getPropertyValue(n).trim();
  C={sheet:g('--sheet'),ink:g('--ink'),soft:g('--ink-soft'),rule:g('--rule'),ruleS:g('--rule-strong'),free:g('--free'),semi:g('--semi'),ok:g('--ok'),hl:g('--hl'),fd:g('--font-display')};}
function resize(){const dpr=window.devicePixelRatio||1,r=cv.getBoundingClientRect();W=Math.max(100,r.width);H=Math.max(100,r.height);
  const w=Math.round(W*dpr),h=Math.round(H*dpr);if(cv.width!==w||cv.height!==h){cv.width=w;cv.height=h;}ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
const sx=x=>x+W/2,sy=y=>y+H/2;
function toW(e){const r=cv.getBoundingClientRect();return {x:e.clientX-r.left-W/2,y:e.clientY-r.top-H/2};}
const obj=id=>st.objs.find(o=>o.id===id);

/* ----- état / historique ----- */
function pushUndo(){st.undo.push(JSON.stringify({objs:st.objs,nid:st.nid}));if(st.undo.length>120)st.undo.shift();}
function undo(){if(anim||!st.undo.length)return;const s=JSON.parse(st.undo.pop());st.objs=s.objs;st.nid=s.nid;resetPend();st.flash=null;traces.clear();refresh();}
function resetPend(){pend={pts:[],ln:null};}
function nextName(){const used=new Set(st.objs.filter(o=>o.t==='pt').map(o=>o.name));
  for(let k=0;;k++){const L=String.fromCharCode(65+k%26)+(k>=26?Math.floor(k/26):'');if(!used.has(L))return L;}}
function add(o){o.id=st.nid++;if(o.t==='pt')o.name=nextName();st.objs.push(o);st.flash=null;return o.id;}
function removeWithDeps(id){const gone=new Set([id]);let ch=true;
  while(ch){ch=false;for(const o of st.objs){if(gone.has(o.id))continue;if(REFS.some(k=>gone.has(o[k]))){gone.add(o.id);ch=true;}}}
  st.objs=st.objs.filter(o=>!gone.has(o.id));gone.forEach(i=>traces.delete(i));}
function loadChallenge(i,fresh){
  if(booted) st.saved[CH[st.cur].id]={objs:st.objs,nid:st.nid};
  booted=true;
  st.cur=i;const ch=CH[i],sv=fresh?null:st.saved[ch.id];
  if(sv){st.objs=JSON.parse(JSON.stringify(sv.objs));st.nid=sv.nid;}
  else{st.objs=ch.init();const k=Math.min(1,W/760);st.objs.forEach(o=>{if(o.t==='pt'){o.x*=k;o.y*=k;}});st.nid=st.objs.reduce((m,o)=>Math.max(m,o.id),0)+1;}
  st.undo=[];st.flash=null;traces.clear();resetPend();
  $('ch-title').textContent=ch.title;$('ch-text').textContent=ch.text;$('ch-hint').textContent=ch.hint;
  $('ch-hintbox').hidden=!ch.hint;$('ch-hintbox').open=false;$('b-check').hidden=!!ch.free;
  setVerdict('',ch.free?'Rien à vérifier ici. Le bouton « Secouer » déplace tous les points libres.':'Quand votre construction est prête, vérifiez-la. Vous pouvez aussi la secouer pour la tester vous-même.');
  renderList();refresh();
}
function renderList(){const ul=$('defis');ul.innerHTML='';
  CH.forEach((ch,i)=>{if(LVL[ch.id]){const g=document.createElement('li');g.className='grp';g.textContent=LVL[ch.id];ul.appendChild(g);}
    const li=document.createElement('li'),b=document.createElement('button');b.type='button';
    b.setAttribute('aria-current',String(i===st.cur));
    const s=document.createElement('span');s.textContent=ch.title;b.appendChild(s);
    if(!ch.free){const p=document.createElement('span');p.className='pill'+(st.done[ch.id]?' done':'');p.textContent=st.done[ch.id]?'réussi':'à faire';b.appendChild(p);}
    b.addEventListener('click',()=>{if(!anim&&i!==st.cur)loadChallenge(i);});li.appendChild(b);ul.appendChild(li);});}
function setVerdict(kind,html,head){const v=$('verdict');v.className='verdict'+(kind?' '+kind:'');v.innerHTML=(head?'<b>'+head+'</b>':'')+html;}
function saveDone(){try{localStorage.setItem('atelier-construction-done',JSON.stringify(st.done));}catch(_){}}

/* ----- détection ----- */
function hitPoint(w,r){let best=null,bd=r||16;for(const o of st.objs){if(o.t!=='pt')continue;const g=G.get(o.id);if(!g||!g.ok)continue;const d=dist(g,w);if(d<bd){bd=d;best=o;}}return best;}
function nearCurves(w,r){const out=[];for(const o of st.objs){if(o.t==='pt')continue;const g=G.get(o.id);if(!g||!g.ok)continue;const d=distCurve(g,w);if(d<r)out.push({o,g,d});}return out.sort((a,b)=>a.d-b.d);}
function makePoint(w){
  const near=nearCurves(w,10);
  if(near.length>=2){let best=null,bd=16;
    for(let i=0;i<near.length;i++)for(let j=i+1;j<near.length;j++){
      const A=near[i],B=near[j],P=inter(A.g,B.g);
      P.forEach((p,k)=>{if(!p)return;const d=dist(p,w);if(d<bd){bd=d;best={o1:A.o.id,o2:B.o.id,i:k,p};}});}
    if(best){const ex=hitPoint(best.p,3);if(ex)return ex.id;return add({t:'pt',k:'int',o1:best.o1,o2:best.o2,i:best.i});}}
  if(near.length>=1)return add({t:'pt',k:'on',o:near[0].o.id,u:paramOn(near[0].g,w)});
  return add({t:'pt',k:'free',x:w.x,y:w.y});
}
/* Outil Intersection (ajout du 11 nov. 2026) : croisement de deux lignes le plus proche du pointeur, s'il y en a un à portée.
   Avec (10,16), c'est exactement le choix de makePoint : l'aperçu de l'outil Point montre donc ce que le clic créera. */
function snapInter(w,r,lim){const near=nearCurves(w,r);let best=null,bd=lim;
  for(let i=0;i<near.length;i++)for(let j=i+1;j<near.length;j++){const A=near[i],B=near[j],P=inter(A.g,B.g);
    P.forEach((p,k)=>{if(!p)return;const d=dist(p,w);if(d<bd){bd=d;best={o1:A.o.id,o2:B.o.id,i:k,p};}});}
  return best;}
function addInter(o1,o2,i,p){const ex=hitPoint(p,3);if(ex)return ex.id;return add({t:'pt',k:'int',o1,o2,i});}
function pointAt(w){const h=hitPoint(w);return h?h.id:makePoint(w);}
function exists(pred){return st.objs.some(pred);}
function click(w){
  if(tool==='point'){const h=hitPoint(w);if(!h)makePoint(w);return;}
  if(tool==='inter'){
    const s=snapInter(w,12,18);
    if(s&&!pend.ln){addInter(s.o1,s.o2,s.i,s.p);return;}
    const hc=(nearCurves(w,12)[0]||{}).o;if(!hc)return;
    if(!pend.ln){pend.ln=hc.id;return;}
    if(hc.id===pend.ln){resetPend();return;}
    inter(G.get(pend.ln),G.get(hc.id)).forEach((p,k)=>{if(p)addInter(pend.ln,hc.id,k,p);});
    resetPend();return;
  }
  if(tool==='trace'){const h=hitPoint(w);if(h){h.trace=!h.trace;if(!h.trace)traces.delete(h.id);}return;}
  if(tool==='del'){const h=hitPoint(w)||(nearCurves(w,10)[0]||{}).o;if(h&&!h.given){removeWithDeps(h.id);st.flash=null;}return;}
  if(tool==='seg'||tool==='line'||tool==='circle'||tool==='mid'){
    const id=pointAt(w);
    if(pend.pts.length===0){pend.pts=[id];return;}
    const a=pend.pts[0];if(a===id)return;
    if(tool==='seg'&&!exists(o=>o.t==='ln'&&o.k==='seg'&&((o.a===a&&o.b===id)||(o.a===id&&o.b===a))))add({t:'ln',k:'seg',a,b:id});
    if(tool==='line')add({t:'ln',k:'line',a,b:id});
    if(tool==='circle')add({t:'ci',c:a,p:id});
    if(tool==='mid')add({t:'pt',k:'mid',a,b:id});
    resetPend();return;
  }
  if(tool==='perp'||tool==='par'){
    const hp=hitPoint(w),hc=(nearCurves(w,10).filter(n=>n.o.t==='ln')[0]||{}).o;
    if(hp&&!pend.pts.length)pend.pts=[hp.id];
    else if(hc&&!pend.ln)pend.ln=hc.id;
    else if(!pend.pts.length&&!hc){pend.pts=[makePoint(w)];}
    else if(hp)pend.pts=[hp.id];
    if(pend.pts.length&&pend.ln){add({t:'ln',k:tool,p:pend.pts[0],l:pend.ln});resetPend();}
  }
}

/* ----- dessin ----- */
function strokeGeom(g){
  if(g.t==='ci'){ctx.beginPath();ctx.arc(sx(g.x),sy(g.y),g.r,0,Math.PI*2);ctx.stroke();return;}
  ctx.beginPath();
  if(g.seg){ctx.moveTo(sx(g.x),sy(g.y));ctx.lineTo(sx(g.x+g.dx),sy(g.y+g.dy));}
  else{const n=Math.hypot(g.dx,g.dy),ux=g.dx/n*4000,uy=g.dy/n*4000;ctx.moveTo(sx(g.x-ux),sy(g.y-uy));ctx.lineTo(sx(g.x+ux),sy(g.y+uy));}
  ctx.stroke();
}
function draw(){
  ctx.clearRect(0,0,W,H);ctx.lineCap='round';ctx.lineJoin='round';ctx.setLineDash([]);
  // petits carreaux
  ctx.lineWidth=1;ctx.strokeStyle=C.rule;const q=25;
  for(let x=(W/2)%q;x<W;x+=q){ctx.beginPath();ctx.moveTo(Math.round(x)+.5,0);ctx.lineTo(Math.round(x)+.5,H);ctx.stroke();}
  for(let y=(H/2)%q;y<H;y+=q){ctx.beginPath();ctx.moveTo(0,Math.round(y)+.5);ctx.lineTo(W,Math.round(y)+.5);ctx.stroke();}
  // surbrillance du résultat
  if(st.flash){const ps=st.flash.ids.map(i=>G.get(i)).filter(p=>p&&p.ok);const col=st.flash.ok?C.ok:C.free;
    if(ps.length>=3){ctx.beginPath();ps.forEach((p,i)=>i?ctx.lineTo(sx(p.x),sy(p.y)):ctx.moveTo(sx(p.x),sy(p.y)));ctx.closePath();
      ctx.globalAlpha=.16;ctx.fillStyle=col;ctx.fill();ctx.globalAlpha=1;ctx.strokeStyle=col;ctx.lineWidth=4;ctx.stroke();}
    else ps.forEach(p=>{ctx.strokeStyle=col;ctx.lineWidth=4;ctx.beginPath();ctx.arc(sx(p.x),sy(p.y),15,0,7);ctx.stroke();});}
  // lignes et cercles
  for(const o of st.objs){if(o.t==='pt')continue;const g=G.get(o.id);if(!g||!g.ok)continue;
    const sel=pend.ln===o.id,hov=(hover&&hover.id===o.id)||(snap&&(snap.o1===o.id||snap.o2===o.id));
    if(sel||hov){ctx.strokeStyle=C.hl;ctx.lineWidth=8;strokeGeom(g);}
    ctx.strokeStyle=o.given?C.soft:C.ink;ctx.lineWidth=o.given?2.6:(o.k==='seg'?2.2:1.5);strokeGeom(g);
    if(o.label){ctx.font='italic 700 16px '+C.fd;ctx.fillStyle=C.soft;ctx.textAlign='left';ctx.textBaseline='bottom';ctx.fillText(o.label,sx(g.x+0.3*g.dx),sy(g.y+0.3*g.dy)-6);}}
  // aperçu
  if(cursor&&pend.pts.length===1&&(tool==='seg'||tool==='line'||tool==='circle'||tool==='mid')){const a=G.get(pend.pts[0]);
    if(a&&a.ok){ctx.strokeStyle=C.soft;ctx.lineWidth=1.5;ctx.setLineDash([5,5]);ctx.beginPath();
      if(tool==='circle')ctx.arc(sx(a.x),sy(a.y),dist(a,cursor),0,7);else{ctx.moveTo(sx(a.x),sy(a.y));ctx.lineTo(sx(cursor.x),sy(cursor.y));}
      ctx.stroke();ctx.setLineDash([]);}}
  // traces
  traces.forEach(arr=>{ctx.fillStyle=C.ok;for(const p of arr){ctx.beginPath();ctx.arc(sx(p.x),sy(p.y),2,0,7);ctx.fill();}});
  // points
  for(const o of st.objs){if(o.t!=='pt')continue;const g=G.get(o.id);if(!g||!g.ok)continue;const X=sx(g.x),Y=sy(g.y);
    const sel=pend.pts.includes(o.id),hov=hover&&hover.id===o.id;
    if(sel||hov){ctx.fillStyle=C.hl;ctx.beginPath();ctx.arc(X,Y,14,0,7);ctx.fill();}
    if(o.lock){ctx.strokeStyle=C.soft;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(X-4,Y-4);ctx.lineTo(X+4,Y+4);ctx.moveTo(X-4,Y+4);ctx.lineTo(X+4,Y-4);ctx.stroke();}
    else if(o.k==='free'){ctx.fillStyle=C.free;ctx.beginPath();ctx.arc(X,Y,7,0,7);ctx.fill();}
    else if(o.k==='on'){ctx.fillStyle=C.semi;ctx.beginPath();ctx.arc(X,Y,6.5,0,7);ctx.fill();}
    else{ctx.fillStyle=C.sheet;ctx.strokeStyle=C.ink;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X,Y,5,0,7);ctx.fill();ctx.stroke();}
    if(o.trace){ctx.strokeStyle=C.ok;ctx.lineWidth=2;ctx.beginPath();ctx.arc(X,Y,10.5,0,7);ctx.stroke();}
    if(o.name){ctx.font='700 15px '+C.fd;ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.lineWidth=4;ctx.strokeStyle=C.sheet;ctx.strokeText(o.name,X+10,Y-9);ctx.fillStyle=C.ink;ctx.fillText(o.name,X+10,Y-9);}}
  // aperçu du point d'intersection qui serait créé
  if(snap){const X=sx(snap.p.x),Y=sy(snap.p.y);ctx.strokeStyle=C.ok;ctx.lineWidth=2.5;ctx.beginPath();ctx.arc(X,Y,10,0,7);ctx.stroke();ctx.fillStyle=C.ok;ctx.beginPath();ctx.arc(X,Y,3.5,0,7);ctx.fill();}
}
function refresh(){
  G=evalAll(st.objs);
  for(const o of st.objs){if(o.t==='pt'&&o.trace){const g=G.get(o.id);if(g.ok){let a=traces.get(o.id);if(!a){a=[];traces.set(o.id,a);}
    const l=a[a.length-1];if(!l||dist(l,g)>1.5){a.push({x:g.x,y:g.y});if(a.length>5000)a.shift();}}}}
  draw();updateUI();
}
function updateUI(){
  document.querySelectorAll('.tool[data-tool]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.tool===tool)));
  const hs=HINTS[tool],step=(tool==='perp'||tool==='par'||tool==='inter')?((pend.pts.length||pend.ln)?1:0):Math.min(pend.pts.length,hs.length-1);
  $('hint').textContent=hs[Math.min(step,hs.length-1)];
  $('t-undo').disabled=!st.undo.length;
  cv.style.cursor=tool==='move'?(dragging?'grabbing':(hover&&hover.t==='pt'?'grab':'default')):'crosshair';
}
function setTool(t){if(anim)return;tool=t;resetPend();hover=null;snap=null;refresh();}

/* ----- animations : secouer, contre-exemple ----- */
function getParams(objs,userOnly){return objs.filter(o=>isParam(o,userOnly)).map(o=>({id:o.id,x:o.x,y:o.y,u:o.u,k:o.k,hk:o.k==='on'?hostKind(o,objs):null,
  f:[Math.random()*6.28,Math.random()*6.28,0.8+Math.random()*0.7,1.1+Math.random()*0.9]}));}
function runAnim(dur,apply,done){
  anim=true;const backup=JSON.stringify(st.objs),t0=performance.now();setBusy(true);
  (function frame(now){const t=(now-t0)/dur;
    if(t>=1){st.objs=JSON.parse(backup);anim=false;setBusy(false);refresh();if(done)done();return;}
    apply(t);refresh();requestAnimationFrame(frame);})(t0);
}
function setBusy(b){$('b-check').disabled=b;$('b-shake').disabled=b;}
function shake(){
  if(anim)return;const ch=CH[st.cur],ps=getParams(st.objs,!!ch.userOnlyShake);
  if(!ps.length){setVerdict('', 'Il n\'y a encore aucun point libre à déplacer.');return;}
  resetPend();
  runAnim(4200,t=>{const env=Math.sin(Math.PI*t);
    for(const p of ps){const o=obj(p.id);const s1=Math.sin(6.283*p.f[2]*t+p.f[0]),s2=Math.sin(6.283*p.f[3]*t+p.f[1]);
      if(p.k==='free'){o.x=p.x+env*75*s1;o.y=p.y+env*75*s2;}
      else{const amp=p.hk==='ci'?1.3:p.hk==='seg'?0.35:p.hk==='line'?0.45:110;o.u=p.u+env*amp*s1;}}});
}
function playCounter(target,done){
  const from=getParams(st.objs,false),to=new Map(target.map(o=>[o.id,o]));
  runAnim(3200,t=>{const s=Math.min(1,1.5*Math.sin(Math.PI*t));
    for(const p of from){const o=obj(p.id),q=to.get(p.id);if(!q)continue;
      if(p.k==='free'){o.x=p.x+(q.x-p.x)*s;o.y=p.y+(q.y-p.y)*s;}else o.u=p.u+(q.u-p.u)*s;}},done);
}
function names(ids){return ids.map(i=>(obj(i)||{}).name||'?').join(', ');}
function check(){
  if(anim)return;const ch=CH[st.cur];resetPend();
  const r=runCheck(ch,st.objs,(Math.random()*1e9)|0);
  if(r.status==='ok'){
    st.flash={ids:r.cand,ok:true};st.done[ch.id]=true;saveDone();renderList();
    const libres=st.objs.filter(o=>o.t==='pt'&&!o.lock&&(o.k==='free'||o.k==='on')).map(o=>o.name);
    const lies=st.objs.filter(o=>o.t==='pt'&&(o.k==='int'||o.k==='mid')).map(o=>o.name);
    setVerdict('ok','La propriété a tenu pendant 40 déplacements au hasard des points libres. Avec '+names(r.cand)+', vous avez '+ch.shape+' par construction.'
      +' Points que l\'on peut bouger : '+(libres.join(', ')||'aucun')+'. Points entièrement déterminés : '+(lies.join(', ')||'aucun')+'.','C\'est une figure.');
    refresh();return;
  }
  if(r.status==='fragile'){
    st.flash={ids:r.cand,ok:false};
    setVerdict('ko','À l\'œil, '+names(r.cand)+' donne bien '+ch.shape+'. Regardez la planche : voici ce qui arrive quand les points libres bougent. Une propriété placée à vue ne résiste pas, il faut la construire.','Pour l\'instant, c\'est un dessin.');
    playCounter(r.objs);return;
  }
  st.flash=null;
  if(r.status==='static')setVerdict('ko','Votre point est bien placé, mais il ne bouge pas quand on déplace vos points. Il faut un point qui parcourt toute une courbe.','Le point reste immobile.');
  else if(r.status==='undef')setVerdict('ko','Votre construction disparaît trop souvent quand on déplace les points : certaines intersections cessent d\'exister.','Construction instable.');
  else setVerdict('ko','Je ne vois pas encore '+ch.shape+' parmi vos points.','Pas encore.');
  refresh();
}

/* ----- événements ----- */
cv.addEventListener('pointerdown',e=>{
  if(anim)return;const w=toW(e);cursor=w;
  if(tool==='move'){const h=hitPoint(w,22);
    if(h&&!h.lock&&(h.k==='free'||h.k==='on')){pushUndo();const g=G.get(h.id);dragging={id:h.id,ox:g.x-w.x,oy:g.y-w.y};try{cv.setPointerCapture(e.pointerId);}catch(_){}
      if(st.flash&&!st.flash.ok)st.flash=null;}
    refresh();return;}
  const before=JSON.stringify({objs:st.objs,nid:st.nid});snap=null;click(w);
  if(JSON.stringify({objs:st.objs,nid:st.nid})!==before){st.undo.push(before);if(st.undo.length>120)st.undo.shift();}
  refresh();
});
cv.addEventListener('pointermove',e=>{
  if(anim)return;const w=toW(e);cursor=w;
  if(dragging){const o=obj(dragging.id);if(!o){dragging=null;return;}
    if(o.k==='free'){o.x=w.x+dragging.ox;o.y=w.y+dragging.oy;}
    else{const g=G.get(o.o);if(g&&g.ok)o.u=paramOn(g,w);}
    refresh();return;}
  const hp=hitPoint(w);
  hover=hp||(tool==='move'||tool==='trace'?null:((nearCurves(w,10)[0]||{}).o||null));
  snap=hp?null:tool==='point'?snapInter(w,10,16):tool==='inter'&&!pend.ln?snapInter(w,12,18):null;
  draw();updateUI();
});
const endDrag=()=>{if(dragging){dragging=null;refresh();}};
cv.addEventListener('pointerup',endDrag);cv.addEventListener('pointercancel',endDrag);
cv.addEventListener('pointerleave',()=>{if(!dragging){cursor=null;hover=null;snap=null;draw();}});

const tb=$('tools');
TOOLS.forEach(([id,label,svg])=>{const b=document.createElement('button');b.type='button';b.className='tool';b.dataset.tool=id;
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+svg+'</svg><span>'+label+'</span>';b.addEventListener('click',()=>setTool(id));tb.appendChild(b);});
const sep=document.createElement('span');sep.className='sep';tb.appendChild(sep);
[['t-undo','Annuler','<path d="M8 8h7a4.5 4.5 0 010 9H9M8 8l3.5-3.5M8 8l3.5 3.5"/>',undo],
 ['t-reset','Tout effacer','<path d="M5 7h14M9 7V4h6v3M7 7l1 13h8l1-13"/>',()=>{if(anim)return;pushUndo();const u=st.undo;loadChallenge(st.cur,true);st.undo=u;refresh();}]
].forEach(([id,label,svg,fn])=>{const b=document.createElement('button');b.type='button';b.className='tool';b.id=id;
  b.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true">'+svg+'</svg><span>'+label+'</span>';b.addEventListener('click',fn);tb.appendChild(b);});
$('b-check').addEventListener('click',check);
$('b-shake').addEventListener('click',shake);
window.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key==='z'){undo();e.preventDefault();}if(e.key==='Escape'){resetPend();refresh();}});

/* ----- démarrage ----- */
function start(data){
  try{const d=JSON.parse(localStorage.getItem('atelier-construction-done')||'{}');if(d&&typeof d==='object')st.done=d;}catch(_){}
  if(data&&data.saved&&typeof data.saved==='object'){st.saved=data.saved;if(data.done)st.done=data.done;}
  readTheme();
  const i=data&&typeof data.cur==='number'?Math.max(0,Math.min(CH.length-1,data.cur|0)):0;
  st.objs=[];resize();loadChallenge(i);
}
const hot=window.claude&&window.claude.hot;
if(hot&&hot.snapshot)hot.snapshot(()=>{const saved=Object.assign({},st.saved);saved[CH[st.cur].id]={objs:st.objs,nid:st.nid};return {cur:st.cur,saved,done:st.done};});
if(hot&&hot.ready)hot.ready(start);else start((hot&&hot.data)||{});
const retheme=()=>{readTheme();draw();};
if(window.matchMedia)window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',retheme);
new MutationObserver(retheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
if(window.ResizeObserver)new ResizeObserver(resize).observe(cv);else window.addEventListener('resize',resize);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(draw);
})();
/* ======== fin du code du prototype ======== */
  return demonter;
}
