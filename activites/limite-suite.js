// Activité « La limite d'une suite » (rubrique Activités, MEMO_atlas_activites.md).
// Le texte (html) est mis à la charte du site. Le code des figures, entre les deux repères ci-dessous, est
// celui du prototype de l'auteur ; y ont changé les messages (vouvoiement), les comparaisons de la limite d'une
// suite et, dans l'atelier, l'outil Intersection ajouté à l'interface (MEMO_atlas_activites.md, §118).
import { bac, css as cssCommun } from './commun.js';

export const css = cssCommun + `
.activites-act #cv1 { aspect-ratio: 16/7; touch-action: pan-y; } .activites-act #cv2 { aspect-ratio: 16/10; } .activites-act #cv3 { aspect-ratio: 16/7; cursor: default; }
@media (max-width: 560px) { .activites-act #cv1, .activites-act #cv3 { aspect-ratio: 4/3; } .activites-act #cv2 { aspect-ratio: 1/1; } }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Terminale · Limite d'une suite</p>
  <h3>La limite d'une suite</h3>
  <p class="lede">« Les termes se rapprochent de 2 » : la phrase est vague. Cette page la remplace par un jeu précis, celui de la bande et du rang. Attrapez la bande, faites glisser les nombres surlignés, comme <span class="scrub" data-var="e" tabindex="0" role="slider" aria-label="tolérance epsilon"></span>.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Des termes qui se tassent</h4>
    <p>Voici les <span class="scrub" data-var="n1" tabindex="0" role="slider" aria-label="nombre de termes affichés"></span> premiers termes de la suite <i>u<sub>n</sub></i> = <span class="chips" data-chips></span>. Chaque point est un terme : son rang <i>n</i> se lit en bas, sa valeur à gauche.</p>
    <p>Affichez de plus en plus de termes. Vers quel nombre semblent-ils aller ? S'en approchent-ils tous de la même façon ?</p>
  </div>
  <div class="fig">
    <div class="cap"><span>termes de la suite</span><span data-live="hov"></span></div>
    <canvas id="cv1" aria-label="Nuage des premiers termes de la suite"></canvas>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Une bande pour trancher</h4>
    <p>Proposez une limite <i>ℓ</i> = <span class="scrub" data-var="l" tabindex="0" role="slider" aria-label="limite proposée"></span> et une tolérance <i>ε</i> = <span class="scrub" data-var="e" tabindex="0" role="slider" aria-label="tolérance epsilon"></span>. Elles dessinent une <b class="c-tan">bande</b> entre <i>ℓ</i> − <i>ε</i> et <i>ℓ</i> + <i>ε</i>. Les termes dans la bande sont en vert, les autres en <b class="c-sec">orange</b>.</p>
    <p><span id="bandtext"></span></p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="cv2" class="draw" aria-label="Termes de la suite et bande de tolérance déplaçable"></canvas>
      <div class="side">
        <h5>Avec ℓ = <span data-live="l"></span></h5>
        <table id="tab" aria-label="Rang à partir duquel les termes restent dans la bande, selon epsilon">
          <thead><tr><th>ε</th><th>rang N</th></tr></thead>
          <tbody></tbody>
        </table>
        <p class="verdict" id="verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="bar">
      <button class="primary" id="b-frame">Recadrer sur la bande</button>
      <button id="b-all">Vue d'ensemble</button>
      <button id="b-e2">ε ÷ 2</button>
      <button id="b-e10">ε ÷ 10</button>
      <button id="b-e1">Remettre ε = 0,5</button>
      <label><span class="scrub" data-var="vn" tabindex="0" role="slider" aria-label="nombre de termes dans le cadre"></span> termes dans le cadre</label>
    </div>
  </div>
  <div class="col">
    <p>Sur la figure, faites glisser la ligne centrale pour changer <i>ℓ</i> et un bord de la bande pour changer <i>ε</i>. Essayez une mauvaise limite, par exemple 2,3 : la bande large fait illusion, la bande fine ne pardonne pas.</p>
    <p>Le tableau montre aussi que le rang <i>N</i> <b>dépend de <i>ε</i></b>. Quand la tolérance est divisée par 10, de combien le rang grandit-il ? Comparez les suites entre elles : c'est leur vitesse de convergence.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Le jeu du rang</h4>
    <p>On affirme que la suite converge vers <span class="live c-tan" data-live="gl"></span>. Un adversaire choisit une tolérance. À vous de répondre par un rang à partir duquel plus aucun terme ne sort de la bande. Si vous pensez qu'aucun rang ne convient, dites-le : c'est aussi une réponse.</p>
  </div>
  <div class="fig">
    <div class="bar top">
      <span class="chips" data-chips></span>
      <span>manche <span data-live="ground"></span> sur 3</span>
      <span class="live c-mark" data-live="ge"></span>
    </div>
    <canvas id="cv3" aria-label="Plateau du jeu : bande imposée et rang proposé"></canvas>
    <div class="feedback" id="gfb" aria-live="polite"></div>
    <div class="bar">
      <label for="gN">Mon rang N = <input type="number" id="gN" min="1" max="20000" step="1" value="10"></label>
      <button class="primary" id="b-prop">Je propose ce rang</button>
      <button id="b-none">Aucun rang ne convient</button>
      <button id="b-next">Manche suivante</button>
    </div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">4</span>La définition, mot pour mot</h4>
    <p>Gagner une manche ne suffit pas. Converger, c'est pouvoir gagner <em>toutes</em> les manches, quelle que soit la tolérance choisie par l'adversaire.</p>
    <p class="def">La suite (<i>u<sub>n</sub></i>) converge vers <i>ℓ</i> si, <span class="c-mark">pour tout <i>ε</i> &gt; 0</span>, <span class="c-sec">il existe un rang <i>N</i></span> tel que <span class="c-tan">pour tout <i>n</i> ≥ <i>N</i>, |<i>u<sub>n</sub></i> − <i>ℓ</i>| &lt; <i>ε</i></span>.</p>
    <p><span class="c-mark"><b>Pour tout ε</b></span> : l'adversaire choisit la bande, aussi fine qu'il veut. <span class="c-sec"><b>Il existe N</b></span> : vous répondez par un rang, qui peut dépendre de ε. <span class="c-tan"><b>Pour tout n ≥ N</b></span> : à partir de ce rang, aucun terme ne ressort.</p>
    <p>Et pour montrer qu'une suite ne converge pas vers <i>ℓ</i> ? Il suffit d'une seule bande pour laquelle aucun rang ne convient. Rejouez avec la dernière suite de la liste.</p>
  </div>
</section>

<div class="suite col">
  <h4>Le piège le plus courant</h4>
  <p>L'ordre des mots compte : le rang <i>N</i> est choisi <em>après</em> ε et dépend de lui. Trois bandes gagnées ne prouvent rien, car la définition exige une réponse pour toutes les tolérances ; à l'inverse, une seule bande sans rang possible suffit à réfuter la convergence vers <i>ℓ</i>.</p>
  <h4>Où lire la démonstration</h4>
  <p>Le chapitre de Terminale <a href="#cours/t-01">Suites numériques</a> énonce cette définition et ses conséquences. Dans l'édifice, la fiche <a href="#ar-suites.su-convergence">Suite convergente, limite</a> la reprend, et la fiche <a href="#ar-suites.su-bornee">Unicité de la limite</a> démontre qu'une suite ne peut pas avoir deux limites, ce que la bande fine fait voir quand on propose 2,3.</p>
  <h4>Ce que la page calcule</h4>
  <p>Les rangs affichés sont les plus petits possibles. Une majoration connue de |<i>u<sub>n</sub></i> − <i>ℓ</i>| donne un rang qui convient, puis la page redescend terme à terme ; pour savoir si un terme est dans la bande, elle compare des nombres entiers (en millièmes), ce qui évite les erreurs d'arrondi quand un terme tombe exactement sur le bord. Seule la suite en sin(<i>n</i>) est comparée en valeurs approchées. Rien n'est enregistré ni envoyé.</p>
</div>`;

export function monter() {
  const { window, MutationObserver, ResizeObserver, demonter } = bac();
/* ======== début du code du prototype ======== */
(function(){
'use strict';
const $=id=>document.getElementById(id);
let C={};
function readTheme(){
  const cs=getComputedStyle(document.documentElement), g=n=>cs.getPropertyValue(n).trim();
  C={sheet:g('--sheet'),ink:g('--ink'),soft:g('--ink-soft'),rule:g('--rule'),ruleS:g('--rule-strong'),
     sec:g('--sec'),tan:g('--tan'),mark:g('--mark'),fd:g('--font-display')};
}
function fr(v,d){
  if(!isFinite(v)) return '—';
  if(Math.abs(v)<0.5*Math.pow(10,-d)) v=0;
  return v.toLocaleString('fr-FR',{minimumFractionDigits:d,maximumFractionDigits:d}).replace('-','−');
}
function frh(h){const m=Math.abs(h);return fr(h,m>=0.1||m===0?2:m>=0.01?3:4);}
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ---------- canvas helpers ---------- */
function setup(cv){
  const dpr=window.devicePixelRatio||1, r=cv.getBoundingClientRect();
  const w=Math.max(60,r.width), h=Math.max(60,r.height);
  const W=Math.round(w*dpr), H=Math.round(h*dpr);
  if(cv.width!==W||cv.height!==H){cv.width=W;cv.height=H;}
  const ctx=cv.getContext('2d'); ctx.setTransform(dpr,0,0,dpr,0,0); ctx.clearRect(0,0,w,h);
  ctx.lineJoin='round'; ctx.lineCap='round';
  return {ctx,w,h};
}
function view(w,h,x0,x1,y0,y1){
  return {w,h,x0,x1,y0,y1,
    X:x=>(x-x0)/(x1-x0)*w, Y:y=>h-(y-y0)/(y1-y0)*h,
    ix:px=>x0+px/w*(x1-x0), iy:py=>y0+(h-py)/h*(y1-y0)};
}
function eqView(w,h,cx,cy,hw){const hh=hw*h/w;return view(w,h,cx-hw,cx+hw,cy-hh,cy+hh);}
function niceStep(span,target){
  const raw=span/target, p=Math.pow(10,Math.floor(Math.log10(raw))), m=raw/p;
  return (m<1.5?1:m<3.5?2:m<7.5?5:10)*p;
}
function seg(ctx,x1,y1,x2,y2){ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function grid(ctx,v,eq){
  const sx=niceStep(v.x1-v.x0,8);
  const sy=eq?sx:niceStep(v.y1-v.y0,Math.max(3,Math.round(8*v.h/v.w*1.4)));
  ctx.lineWidth=1; ctx.setLineDash([]);
  ctx.strokeStyle=C.rule;
  const q=sy/4;
  for(let k=Math.ceil(v.y0/q);k*q<=v.y1;k++){const Y=Math.round(v.Y(k*q))+.5;seg(ctx,0,Y,v.w,Y);}
  ctx.strokeStyle=C.ruleS;
  for(let k=Math.ceil(v.x0/sx);k*sx<=v.x1;k++){const X=Math.round(v.X(k*sx))+.5;seg(ctx,X,0,X,v.h);}
  for(let k=Math.ceil(v.y0/sy);k*sy<=v.y1;k++){const Y=Math.round(v.Y(k*sy))+.5;seg(ctx,0,Y,v.w,Y);}
  ctx.strokeStyle=C.soft; ctx.lineWidth=1.5;
  if(v.y0<=0&&v.y1>=0){const Y=v.Y(0);seg(ctx,0,Y,v.w,Y);}
  if(v.x0<=0&&v.x1>=0){const X=v.X(0);seg(ctx,X,0,X,v.h);}
  ctx.fillStyle=C.soft; ctx.font='500 11px '+C.fd;
  const dx=Math.max(0,-Math.floor(Math.log10(sx)+1e-9)), dy=Math.max(0,-Math.floor(Math.log10(sy)+1e-9));
  const ly=clamp(v.Y(0)+14,12,v.h-5), lx=clamp(v.X(0)-6,34,v.w-4);
  ctx.textAlign='center'; ctx.textBaseline='alphabetic';
  for(let k=Math.ceil(v.x0/sx);k*sx<=v.x1;k++){ if(k===0) continue; const X=v.X(k*sx); if(X<16||X>v.w-16) continue; ctx.fillText(fr(k*sx,dx),X,ly); }
  ctx.textAlign='right'; ctx.textBaseline='middle';
  for(let k=Math.ceil(v.y0/sy);k*sy<=v.y1;k++){ if(k===0) continue; const Y=v.Y(k*sy); if(Y<10||Y>v.h-10) continue; ctx.fillText(fr(k*sy,dy),lx,Y); }
}
function curve(ctx,v,f,color,lw,dash){
  ctx.strokeStyle=color; ctx.lineWidth=lw; ctx.setLineDash(dash||[]);
  let n=Math.ceil(v.w/1.5); if(n%2) n++;
  ctx.beginPath(); let pen=false;
  for(let i=0;i<=n;i++){
    const x=v.x0+(v.x1-v.x0)*i/n, y=f(x);
    if(!isFinite(y)){pen=false;continue;}
    const X=v.X(x), Y=clamp(v.Y(y),-4000,v.h+4000);
    if(pen) ctx.lineTo(X,Y); else {ctx.moveTo(X,Y);pen=true;}
  }
  ctx.stroke(); ctx.setLineDash([]);
}
function lineSlope(ctx,v,x,y,m,color,lw,dash){
  ctx.strokeStyle=color; ctx.lineWidth=lw; ctx.setLineDash(dash||[]);
  seg(ctx,v.X(v.x0),v.Y(y+m*(v.x0-x)),v.X(v.x1),v.Y(y+m*(v.x1-x)));
  ctx.setLineDash([]);
}
function label(ctx,txt,X,Y,color,align,size){
  ctx.font='700 '+(size||13)+'px '+C.fd; ctx.textAlign=align||'center'; ctx.textBaseline='middle';
  ctx.lineWidth=4; ctx.strokeStyle=C.sheet; ctx.strokeText(txt,X,Y);
  ctx.fillStyle=color; ctx.fillText(txt,X,Y);
}
function handle(ctx,X,Y,color,name,below){
  ctx.globalAlpha=.18; ctx.fillStyle=color; ctx.beginPath(); ctx.arc(X,Y,15,0,7); ctx.fill(); ctx.globalAlpha=1;
  ctx.fillStyle=C.sheet; ctx.strokeStyle=color; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(X,Y,6.5,0,7); ctx.fill(); ctx.stroke();
  if(name) label(ctx,name,X-14,Y+(below?18:-18),color,'center',15);
}
function dot(ctx,X,Y,color,r){ctx.fillStyle=color;ctx.beginPath();ctx.arc(X,Y,r||4,0,7);ctx.fill();}

/* Comparaisons exactes (correction du 11 nov. 2026, accord de l'auteur). ℓ et ε sont des décimaux à trois chiffres au plus ; les tests
   « u_n est-il dans ]ℓ−ε ; ℓ+ε[ ? » se font donc en millièmes entiers (l, e), sans passer par 2 + 1/n − ℓ, que les flottants arrondissent
   (2 + 1/100 − 2 < 0,01 en machine, alors que |u_100 − 2| = 0,01). ins(n,l,e) : u_n est strictement dans la bande.
   side : signe constant de u_n − L quand la suite reste d'un seul côté de sa limite (0 sinon). */
const SQ=[
  {label:'2 + (−1)ⁿ/n',       u:n=>2+(n%2?-1:1)/n,                 L:2, env:n=>1/n, side:0,
   ins:(n,l,e)=>Math.abs(n*(2000-l)+(n%2?-1000:1000))<e*n},
  {label:'(3n − 2)/(n + 1)',  u:n=>(3*n-2)/(n+1),                  L:3, env:n=>5/(n+1), side:-1,
   ins:(n,l,e)=>Math.abs(1000*(3*n-2)-l*(n+1))<e*(n+1)},
  {label:'2 + 1,6 × 0,8ⁿ',    u:n=>2+1.6*Math.pow(0.8,n),          L:2, env:n=>1.6*Math.pow(0.8,n), side:1,
   ins:(n,l,e)=>{const v=n===1?1280:n===2?1024:1600*Math.pow(0.8,n),D=2000-l;return (e+D>=0||v>-(e+D))&&v<e-D;}},
  {label:'2 + 1,5 sin(n)/√n', u:n=>2+1.5*Math.sin(n)/Math.sqrt(n), L:2, env:n=>1.5/Math.sqrt(n), side:0,
   ins:(n,l,e)=>Math.abs(1500*Math.sin(n)/Math.sqrt(n)+2000-l)<e},
  {label:'2 + (−1)ⁿ',         u:n=>2+(n%2?-1:1),                   L:null,
   ins:(n,l,e)=>Math.abs((n%2?1000:3000)-l)<e}
];
const NCAP=20000;
const S={q:0,n1:40,l:2,e:0.5,hov:null,v:{n:60,yc:2,yh:2},
         g:{round:0,answered:false,mark:null,N:10,wins:0,over:false}};
let V1=null,V2=null,pending=false;
const int=n=>isFinite(n)?Math.round(n).toLocaleString('fr-FR'):'aucun';
const fe=e=>fr(e,e>=0.1&&Math.abs(e*100-Math.round(e*100))<1e-9?2:3);

const mil=x=>Math.round(x*1000);
function inBand(q,n,l,e){return q.ins(n,mil(l),mil(e));}
/* rang minimal N tel que tous les termes n >= N sont dans ]l-e ; l+e[ ; Infinity s'il n'y en a pas */
function rankFor(q,l,e){
  if(q.L===null) return (inBand(q,1,l,e)&&inBand(q,2,l,e))?1:Infinity;
  const E=mil(e), D=Math.abs(mil(l)-1000*q.L);
  if(E<D) return Infinity;                       /* L hors de la bande fermée : tous les termes finissent dehors */
  if(E===D){                                     /* L sur le bord : seuls les termes situés du côté de ℓ peuvent entrer */
    if(!q.side||q.side!==Math.sign(l-q.L)) return Infinity;
    let k=1; while(!inBand(q,k,l,e)) k++; return k;   /* suite monotone : une fois entrée, elle reste */
  }
  const m=(E-D)/1000;
  let hi=1; while(q.env(hi)>=m&&hi<1e9) hi*=2;
  let lo=Math.max(1,Math.floor(hi/2));
  while(lo<hi){const mid=Math.floor((lo+hi)/2); if(q.env(mid)<m) hi=mid; else lo=mid+1;}
  let n=hi-1; while(n>=1&&inBand(q,n,l,e)) n--;
  return n+1;
}
function firstOutside(q,l,e,from){ for(let n=from;n<from+3000000;n++) if(!inBand(q,n,l,e)) return n; return null; }
function gameL(){const q=SQ[S.q];return q.L===null?2:q.L;}
function gameE(){return (SQ[S.q].L===null?[1.5,0.5,0.1]:[0.5,0.1,0.02])[Math.min(2,S.g.round)];}

function gridN(ctx,v){
  const sx=Math.max(1,niceStep(v.x1-v.x0,8)), sy=niceStep(v.y1-v.y0,6), q=sy/4;
  ctx.lineWidth=1; ctx.setLineDash([]); ctx.strokeStyle=C.rule;
  for(let k=Math.ceil(v.y0/q);k*q<=v.y1;k++){const Y=Math.round(v.Y(k*q))+.5;seg(ctx,0,Y,v.w,Y);}
  ctx.strokeStyle=C.ruleS;
  for(let k=1;k*sx<=v.x1;k++){const X=Math.round(v.X(k*sx))+.5;seg(ctx,X,0,X,v.h);}
  for(let k=Math.ceil(v.y0/sy);k*sy<=v.y1;k++){const Y=Math.round(v.Y(k*sy))+.5;seg(ctx,0,Y,v.w,Y);}
  ctx.strokeStyle=C.soft; ctx.lineWidth=1.5; seg(ctx,v.X(0),0,v.X(0),v.h);
  if(v.y0<=0&&v.y1>=0) seg(ctx,0,v.Y(0),v.w,v.Y(0));
  ctx.fillStyle=C.soft; ctx.font='500 11px '+C.fd; ctx.textAlign='center'; ctx.textBaseline='alphabetic';
  for(let k=1;k*sx<=v.x1;k++){const X=v.X(k*sx); if(X>v.w-14) continue; ctx.fillText(int(k*sx),X,v.h-5);}
  const dy=Math.max(0,-Math.floor(Math.log10(sy)+1e-9)); ctx.textAlign='right'; ctx.textBaseline='middle';
  for(let k=Math.ceil(v.y0/sy);k*sy<=v.y1;k++){const Y=v.Y(k*sy); if(Y<10||Y>v.h-16) continue; ctx.fillText(fr(k*sy,dy),v.X(0)-5,Y);}
}
function drawSeq(id,vw,o){
  const {ctx,w,h}=setup($(id)), q=SQ[S.q];
  const pad=Math.max(vw.n*0.075,vw.n*46/w);
  const v=view(w,h,-pad,vw.n*1.03+0.6,vw.yc-vw.yh,vw.yc+vw.yh);
  gridN(ctx,v);
  if(o.band){
    const yT=v.Y(o.l+o.e), yB=v.Y(o.l-o.e);
    ctx.globalAlpha=.15; ctx.fillStyle=C.tan; ctx.fillRect(0,yT,w,yB-yT); ctx.globalAlpha=1;
    ctx.strokeStyle=C.tan; ctx.lineWidth=1.5; ctx.setLineDash([6,5]); seg(ctx,0,yT,w,yT); seg(ctx,0,yB,w,yB);
    ctx.setLineDash([]); ctx.lineWidth=2; seg(ctx,0,v.Y(o.l),w,v.Y(o.l));
  }
  if(o.N!==undefined&&isFinite(o.N)&&o.N-0.5<=v.x1){
    const X=v.X(o.N-0.5); ctx.strokeStyle=C.mark; ctx.lineWidth=2.5; seg(ctx,X,0,X,h);
    const right=X<w-110; label(ctx,'N = '+int(o.N),X+(right?7:-7),13,C.mark,right?'left':'right',13);
  }
  const nM=Math.min(Math.floor(v.x1),NCAP+700), r=clamp(w/vw.n*0.3,1.1,4.6);
  for(let n=1;n<=nM;n++){
    const y=q.u(n), Y=v.Y(y); if(Y<-6||Y>h+6) continue;
    ctx.fillStyle=!o.band?C.ink:(inBand(q,n,o.l,o.e)?C.tan:C.sec);
    const X=v.X(n);
    if(r<1.7) ctx.fillRect(X-r,Y-r,2*r,2*r); else {ctx.beginPath();ctx.arc(X,Y,r,0,7);ctx.fill();}
  }
  if(o.mark){ const y=q.u(o.mark), X=v.X(o.mark), Y=clamp(v.Y(y),8,h-8);
    ctx.strokeStyle=o.markColor||C.sec; ctx.lineWidth=3; ctx.beginPath(); ctx.arc(X,Y,11,0,7); ctx.stroke();
    const right=X<w-120; label(ctx,'u'+int(o.mark)+' = '+fr(y,3),X+(right?16:-16),Y+(Y<30?16:-16),o.markColor||C.sec,right?'left':'right',13); }
  if(o.grips){
    label(ctx,'ℓ = '+fr(o.l,2),w-10,v.Y(o.l)-11,C.tan,'right',13);
    if(v.Y(o.l-o.e)-v.Y(o.l+o.e)>52){ label(ctx,'ℓ + ε',w-10,v.Y(o.l+o.e)+11,C.tan,'right',12); label(ctx,'ℓ − ε',w-10,v.Y(o.l-o.e)-11,C.tan,'right',12); }
  }
  return v;
}
function render(){
  pending=false; const q=SQ[S.q];
  V1=drawSeq('cv1',{n:S.n1,yc:2,yh:2.1},{mark:S.hov,markColor:C.ink});
  const N=rankFor(q,S.l,S.e); S.N=N;
  V2=drawSeq('cv2',S.v,{band:true,l:S.l,e:S.e,N,grips:true});
  const gl=gameL(), ge=gameE(), g=S.g, gN=clamp(Math.round(+$('gN').value||1),1,NCAP); g.N=gN;
  const span=Math.max(gN,g.mark||0);
  drawSeq('cv3',{n:clamp(Math.ceil(span*1.6),30,NCAP),yc:gl,yh:clamp(ge*4,0.08,2.2)},{band:true,l:gl,e:ge,N:gN,mark:g.mark,grips:true});
  updateText();
}
function schedule(){ if(!pending){pending=true;requestAnimationFrame(render);} }

function updateText(){
  const q=SQ[S.q], N=S.N, g=S.g;
  const L={ l:fr(S.l,2), gl:'ℓ = '+fr(gameL(),0), ge:'ε = '+fe(gameE()), ground:String(Math.min(3,g.round+1)),
    hov:S.hov?'u'+int(S.hov)+' = '+fr(q.u(S.hov),4):'survolez un point pour lire sa valeur' };
  document.querySelectorAll('[data-live]').forEach(e=>{const t=L[e.dataset.live]; if(t!==undefined&&e.textContent!==t) e.textContent=t;});
  const SV={n1:int(S.n1),l:fr(S.l,2),e:fe(S.e),vn:int(S.v.n)};
  document.querySelectorAll('.scrub').forEach(e=>{const t=SV[e.dataset.var]; if(e.textContent!==t) e.textContent=t;});
  let bt;
  if(isFinite(N)){
    bt=N===1?'Ici tous les termes sont dans la bande, dès le premier.':'À partir du rang N = '+int(N)+', tous les termes restent dans la bande. Avant ce rang, certains en sortent encore.';
    if(N-0.5>S.v.n*1.03+0.6) bt+=' Ce rang est hors du cadre : affichez plus de termes ou recadrez.';
  } else bt='Aucun rang ne convient : aussi loin qu\'on aille, il reste des termes hors de la bande.';
  if($('bandtext').textContent!==bt) $('bandtext').textContent=bt;
  const es=[1,0.5,0.1,0.05,0.01]; let rows='', near=0, best=1e9;
  es.forEach((x,i)=>{const d=Math.abs(Math.log(x/S.e)); if(d<best){best=d;near=i;}});
  es.forEach((x,i)=>{rows+='<tr'+(i===near?' class="now"':'')+'><td>'+fe(x)+'</td><td>'+int(rankFor(q,S.l,x))+'</td></tr>';});
  const tb=$('tab').tBodies[0]; if(tb.innerHTML!==rows) tb.innerHTML=rows;
  let vt;
  if(q.L===null){ const m=Math.max(Math.abs(1-S.l),Math.abs(3-S.l));
    vt='Cette suite saute sans fin entre 1 et 3. Dès que ε ≤ '+fr(m,2)+', aucun rang ne convient, et c\'est pareil pour n\'importe quel ℓ : elle n\'a pas de limite.'; }
  else if(Math.abs(S.l-q.L)<1e-9) vt='Avec ℓ = '+fr(S.l,2)+', un rang existe pour chaque ε, aussi petit soit-il : la suite converge vers '+fr(S.l,0)+'.';
  else vt='Avec ℓ = '+fr(S.l,2)+', dès que ε < '+fr(Math.abs(S.l-q.L),2)+' la bande laisse échapper une infinité de termes. '+fr(S.l,2)+' n\'est pas la limite.';
  if($('verdict').textContent!==vt) $('verdict').textContent=vt;
  document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(+c.dataset.q===S.q)));
  $('b-prop').disabled=g.answered||g.over; $('b-none').disabled=g.answered||g.over;
  $('b-next').hidden=!g.answered; $('b-next').textContent=g.over?'Rejouer':'Manche suivante';
}

/* ---------- jeu ---------- */
function gMsg(html){$('gfb').innerHTML=html;}
function gIntro(){gMsg('L\'adversaire choisit ε = '+fe(gameE())+'. Réglez votre rang N (le trait se déplace sur la figure), puis répondez.');}
function gReset(){S.g={round:0,answered:false,mark:null,N:10,wins:0,over:false};$('gN').value=10;gIntro();}
function gAnswer(none){
  const g=S.g; if(g.answered||g.over) return;
  const q=SQ[S.q], l=gameL(), e=gameE(), Nmin=rankFor(q,l,e), N=g.N; let win, t;
  if(none){
    if(!isFinite(Nmin)){ win=true; const k=firstOutside(q,l,e,Math.max(N,50)); g.mark=k&&k<=NCAP?k:null;
      t='<strong>Gagné.</strong> Quel que soit le rang choisi, un terme ressort plus loin'+(k?', par exemple u'+int(k)+' = '+fr(q.u(k),3):'')+'. Avec cette bande, l\'affirmation tombe.'; }
    else{ win=false; $('gN').value=Math.min(Nmin,NCAP);
      t='<strong class="c-sec">Perdu.</strong> Un rang convient : à partir de N = '+int(Nmin)+', tous les termes restent dans la bande.'; }
  }else{
    if(N>=Nmin){ win=true; t='<strong>Gagné.</strong> À partir du rang '+int(N)+', plus aucun terme ne sort de la bande.'+(N>Nmin?' Le plus petit rang possible était '+int(Nmin)+'.':' C\'est même le plus petit rang possible.'); }
    else{ win=false; const k=firstOutside(q,l,e,N); g.mark=k&&k<=NCAP?k:null;
      t='<strong class="c-sec">Perdu.</strong> '+(k?'Le terme u'+int(k)+' = '+fr(q.u(k),3)+' sort de la bande, alors que '+int(k)+' ≥ '+int(N)+'.':'Des termes sortent encore de la bande après ce rang.')
        +(isFinite(Nmin)?'':' Avec cette bande, aucun rang ne pouvait convenir.'); }
  }
  if(win) g.wins++; g.answered=true;
  if(g.round>=2){ g.over=true;
    t+=' <br>Bilan : '+g.wins+' manche'+(g.wins>1?'s':'')+' sur 3. '+(q.L===null
      ?'Une seule bande sans rang possible suffit : la suite ne converge pas vers 2.'
      :'Trois bandes ne prouvent rien : converger, c\'est pouvoir répondre à toutes les bandes, même mille fois plus fines.'); }
  gMsg(t); schedule();
}
$('b-prop').addEventListener('click',()=>gAnswer(false));
$('b-none').addEventListener('click',()=>gAnswer(true));
$('b-next').addEventListener('click',()=>{ const g=S.g; if(g.over){gReset();} else {g.round++;g.answered=false;g.mark=null;gIntro();} schedule(); });
$('gN').addEventListener('input',()=>{ if(!S.g.answered) S.g.mark=null; schedule(); });

/* ---------- interactions ---------- */
function pos(e){const r=e.currentTarget.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
function setQ(i){ if(i===S.q) return; S.q=i; S.l=2; S.e=0.5; S.hov=null; S.v={n:60,yc:2,yh:2}; gReset(); schedule(); }
const setL=x=>{S.l=clamp(Math.round(x*20)/20,0.5,3.5);schedule();};
const setE=x=>{S.e=clamp(Math.round(x*1000)/1000,0.005,2);schedule();};
$('cv1').addEventListener('pointermove',e=>{ if(!V1) return; const p=pos(e); const n=Math.round(V1.ix(p.x)); S.hov=n>=1&&n<=S.n1*1.03+0.6?n:null; schedule(); });
$('cv1').addEventListener('pointerleave',()=>{S.hov=null;schedule();});
$('cv1').style.cursor='crosshair';
(function(){ const cv=$('cv2'); let grab=null;
  cv.style.cursor='ns-resize';
  cv.addEventListener('pointerdown',e=>{ if(!V2) return; const p=pos(e);
    const dl=Math.abs(p.y-V2.Y(S.l)), de=Math.min(Math.abs(p.y-V2.Y(S.l+S.e)),Math.abs(p.y-V2.Y(S.l-S.e)));
    grab=dl<=de?'l':'e'; try{cv.setPointerCapture(e.pointerId);}catch(_){} e.preventDefault(); move(p); });
  function move(p){ const y=V2.iy(p.y); if(grab==='l') setL(y); else if(grab==='e') setE(Math.round(Math.abs(y-S.l)/0.005)*0.005); }
  cv.addEventListener('pointermove',e=>{ if(grab) move(pos(e)); });
  const end=()=>{grab=null;}; cv.addEventListener('pointerup',end); cv.addEventListener('pointercancel',end);
})();
const SCR={
  n1:{get:()=>S.n1,set:v=>{S.n1=clamp(Math.round(v),10,3000);},rate:v=>Math.max(0.3,v/50),key:v=>Math.max(1,Math.round(v/10))},
  vn:{get:()=>S.v.n,set:v=>{S.v.n=clamp(Math.round(v),10,NCAP);},rate:v=>Math.max(0.3,v/50),key:v=>Math.max(1,Math.round(v/10))},
  l:{get:()=>S.l,set:v=>{S.l=clamp(Math.round(v*20)/20,0.5,3.5);},rate:()=>0.01,key:()=>0.05},
  e:{get:()=>S.e,set:v=>{S.e=clamp(Math.round(v*1000)/1000,0.005,2);},rate:v=>Math.max(0.0005,v/60),key:v=>v>0.1?0.05:0.005}
};
document.querySelectorAll('.scrub').forEach(el=>{
  const c=SCR[el.dataset.var]; let on=false,x0=0,v0=0;
  el.addEventListener('pointerdown',e=>{on=true;x0=e.clientX;v0=c.get();try{el.setPointerCapture(e.pointerId);}catch(_){} e.preventDefault();});
  el.addEventListener('pointermove',e=>{ if(!on) return; c.set(v0+(e.clientX-x0)*c.rate(v0)); schedule(); });
  const end=()=>{on=false;}; el.addEventListener('pointerup',end); el.addEventListener('pointercancel',end);
  el.addEventListener('keydown',e=>{ const v=c.get(), k=c.key(v);
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){c.set(v+k);schedule();e.preventDefault();}
    if(e.key==='ArrowLeft'||e.key==='ArrowDown'){c.set(v-k);schedule();e.preventDefault();} });
});
document.querySelectorAll('[data-chips]').forEach(box=>{
  SQ.forEach((f,i)=>{const b=document.createElement('button'); b.className='chip'; b.type='button'; b.dataset.q=i; b.textContent=f.label;
    b.addEventListener('click',()=>setQ(i)); box.appendChild(b);});
});
$('b-frame').addEventListener('click',()=>{ const N=S.N; S.v={n:isFinite(N)?clamp(Math.ceil(N*2.2),30,NCAP):Math.max(S.v.n,200),yc:S.l,yh:clamp(S.e*4,0.02,2.5)}; schedule(); });
$('b-all').addEventListener('click',()=>{S.v={n:60,yc:2,yh:2};schedule();});
$('b-e2').addEventListener('click',()=>setE(S.e/2));
$('b-e10').addEventListener('click',()=>setE(S.e/10));
$('b-e1').addEventListener('click',()=>setE(0.5));

/* ---------- démarrage ---------- */
function start(saved){
  if(saved&&typeof saved.q==='number'){ S.q=clamp(saved.q|0,0,SQ.length-1); S.l=+saved.l||2; S.e=+saved.e||0.5; S.n1=+saved.n1||40; if(saved.v) S.v=saved.v; }
  readTheme(); gIntro(); render();
}
const hot=window.claude&&window.claude.hot;
if(hot&&hot.snapshot) hot.snapshot(()=>({q:S.q,l:S.l,e:S.e,n1:S.n1,v:S.v}));
if(hot&&hot.ready) hot.ready(start); else start((hot&&hot.data)||{});
const retheme=()=>{readTheme();schedule();};
if(window.matchMedia) window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',retheme);
new MutationObserver(retheme).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
if(window.ResizeObserver) new ResizeObserver(schedule).observe(document.querySelector('.page')); else window.addEventListener('resize',schedule);
if(document.fonts&&document.fonts.ready) document.fonts.ready.then(retheme);
})();
/* ======== fin du code du prototype ======== */
  return demonter;
}
