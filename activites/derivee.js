// Activité « La pente en un point » (rubrique Activités, MEMO_atlas_activites.md).
// Le texte (html) est mis à la charte du site. Le code des figures, entre les deux repères ci-dessous, est
// celui du prototype de l'auteur ; y ont changé les messages (vouvoiement), les comparaisons de la limite d'une
// suite et, dans l'atelier, l'outil Intersection ajouté à l'interface (MEMO_atlas_activites.md, §118).
import { bac, css as cssCommun } from './commun.js';

export const css = cssCommun + `
.activites-act #cv1 { aspect-ratio: 16/10; } .activites-act #cvz { aspect-ratio: 16/9; cursor: default; }
.activites-act #cv3t, .activites-act #cv4t { aspect-ratio: 16/6.4; }
.activites-act #cv3b, .activites-act #cv4b { aspect-ratio: 16/5.6; border-top: 1px dashed var(--filet); }
@media (max-width: 560px) { .activites-act #cv1 { aspect-ratio: 1/1; } .activites-act #cvz { aspect-ratio: 4/3; } .activites-act #cv3t, .activites-act #cv4t, .activites-act #cv3b, .activites-act #cv4b { aspect-ratio: 16/9; } }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Première · Dérivation</p>
  <h3>La pente en un point</h3>
  <p class="lede">Une droite a une pente. Une courbe en a une différente à chaque point. Sur cette page vous allez la mesurer vous-même : attrapez les points, faites glisser les nombres surlignés, comme <span class="scrub" data-var="a" tabindex="0" role="slider" aria-label="abscisse de A">1,00</span>.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Deux points, une sécante</h4>
    <p>Prenez la courbe de <i>f</i>(<i>x</i>) = <span class="chips" data-chips></span>. Placez A à l'abscisse <i>a</i> = <span class="scrub" data-var="a" tabindex="0" role="slider" aria-label="abscisse de A"></span> et écartez B de <i>h</i> = <span class="scrub" data-var="h" tabindex="0" role="slider" aria-label="écart h"></span>.</p>
    <p>La droite (AB) est une <b class="c-sec">sécante</b>. Entre A et B la courbe varie de <span class="live c-mark" data-live="dy"></span> pendant qu'on avance de <span class="live c-mark" data-live="h"></span>. La pente de la sécante vaut donc <span class="live c-sec" data-live="slope"></span>.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="cv1" aria-label="Courbe de f, points A et B déplaçables, sécante (AB)"></canvas>
      <div class="side">
        <h5>Le calcul</h5>
        <div class="readout">
          <span class="frac"><span>f(a+h) − f(a)</span><span>h</span></span>
          <span>=</span>
          <span class="frac"><span data-live="num"></span><span data-live="den"></span></span>
          <span>=</span>
          <b data-live="slope4"></b>
        </div>
        <h5 style="margin-top:8px">Quand h rétrécit, en a = <span data-live="a"></span></h5>
        <table id="tab" aria-label="Taux d'accroissement pour des h de plus en plus petits">
          <thead><tr><th>|h|</th><th>à droite</th><th>à gauche</th></tr></thead>
          <tbody></tbody>
        </table>
        <p class="verdict" id="verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="bar">
      <button class="primary" id="b-go">Faire tendre h vers 0</button>
      <button id="b-2">h ÷ 2</button>
      <button id="b-10">h ÷ 10</button>
      <button id="b-neg">Passer de l'autre côté</button>
      <button id="b-1">Remettre h = 1</button>
      <label><input type="checkbox" id="c-tan"> montrer la tangente</label>
    </div>
  </div>
  <div class="col">
    <p>Ce quotient s'appelle le <b>taux d'accroissement</b> de <i>f</i> entre <i>a</i> et <i>a</i> + <i>h</i>. Il mesure une pente moyenne, sur tout l'intervalle.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Rapprocher B de A</h4>
    <p>Remontez à la figure et appuyez sur « Faire tendre h vers 0 ». La sécante pivote autour de A puis se stabilise. Le tableau fait la même expérience avec des nombres : il calcule le quotient pour des <i>h</i> de plus en plus petits, à droite de A et à gauche.</p>
    <p>Exactement en <i>h</i> = 0, le calcul n'a plus de sens : on divise 0 par 0. Faites glisser B sur A pour le voir. La pente en A n'est donc pas une valeur du quotient. C'est sa <b>limite</b>, le nombre dont il s'approche.</p>
    <p>Cette limite n'existe pas toujours. Changez de fonction : <span class="chips" data-chips></span>. Avec |x|, placez A en 0 et comparez les deux colonnes du tableau.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Zoomer jusqu'à voir une droite</h4>
    <p>Voici la même idée sans calcul. Grossissez la courbe autour de A, qui reste au centre de la fenêtre.</p>
  </div>
  <div class="fig">
    <div class="bar top">
      <label>Grossissement <input type="range" id="zoom" min="0" max="3" step="0.01" value="0"></label>
      <span class="live" data-live="zoom"></span>
    </div>
    <canvas id="cvz" aria-label="Vue grossie de la courbe autour de A"></canvas>
  </div>
  <div class="col">
    <p>La fenêtre mesure <span class="live" data-live="zw"></span> de large. <span id="zoomtext"></span></p>
    <p>Une fonction <b>dérivable</b> en <i>a</i> est une fonction dont la courbe, vue d'assez près, ressemble à une droite. Cette droite est la <b class="c-tan">tangente</b> et sa pente est le <b>nombre dérivé</b> <i>f</i> ′(<i>a</i>).</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">4</span>Une pente par point</h4>
    <p>Chaque abscisse a maintenant son nombre dérivé. Faites glisser A le long de la courbe. Le cadre du bas reporte, au-dessus de la même abscisse, la pente de la tangente. Point par point, une nouvelle courbe se dessine : celle de la <b>fonction dérivée</b> <i>f</i> ′.</p>
    <p>Avant de balayer toute la largeur, essayez de prévoir : où la trace coupera-t-elle l'axe ? Où sera-t-elle la plus haute ?</p>
  </div>
  <div class="fig">
    <div class="bar top">
      <span class="chips" data-chips></span>
      <button class="primary" id="b-sweep">Balayer</button>
      <button id="b-clear">Effacer la trace</button>
    </div>
    <div class="cap"><span>courbe de f, tangente en A</span><span data-live="d3"></span></div>
    <canvas id="cv3t" aria-label="Courbe de f avec sa tangente en A"></canvas>
    <div class="cap"><span>pente de la tangente, reportée en a</span><span></span></div>
    <canvas id="cv3b" aria-label="Trace de la fonction dérivée"></canvas>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">5</span>À vous : dessinez la dérivée</h4>
    <p>Voici une courbe sans formule. Dans le cadre du bas, dessinez à la souris ou au doigt l'allure de sa dérivée, d'un bord à l'autre. Puis comparez.</p>
  </div>
  <div class="fig">
    <div class="cap"><span>courbe <span data-live="ski"></span> sur 4</span><span></span></div>
    <canvas id="cv4t" aria-label="Courbe mystère"></canvas>
    <div class="cap"><span>votre dessin de f ′</span><span></span></div>
    <canvas id="cv4b" class="draw" aria-label="Zone de dessin pour la dérivée"></canvas>
    <div class="feedback" id="skfb" aria-live="polite">Astuce : repérez d'abord les sommets et les creux. La tangente y est horizontale.</div>
    <div class="bar">
      <button class="primary" id="b-cmp">Comparer</button>
      <button id="b-era">Effacer mon dessin</button>
      <button id="b-next">Courbe suivante</button>
    </div>
  </div>
</section>

<div class="suite col">
  <h4>Le piège le plus courant</h4>
  <p>Le nombre dérivé n'est pas la valeur du taux d'accroissement « en <i>h</i> = 0 » : cette valeur n'existe pas. C'est une limite, et elle peut ne pas exister, comme pour |<i>x</i>| en 0, où les taux à droite valent tous 1 et les taux à gauche tous −1.</p>
  <h4>Où lire la démonstration</h4>
  <p>Le chapitre de Première <a href="#cours/p-04">Dérivation</a> pose la définition et les règles de calcul. Dans l'édifice, la fiche <a href="#ar-deriv.de-derivee">Dérivabilité en un point</a> donne la définition par la limite du taux d'accroissement, et la fiche <a href="#ar-deriv.de-monotonie">Signe de la dérivée et monotonie</a> démontre le lien entre le signe de <i>f</i> ′ et le sens de variation, que le dernier défi fait pressentir.</p>
  <h4>Ce que la page calcule</h4>
  <p>Les pentes affichées sont calculées avec la formule exacte de la dérivée de chacune des quatre fonctions ; le tableau, lui, montre de vrais taux d'accroissement. Rien n'est enregistré ni envoyé.</p>
</div>`;

export function monter() {
  const { window, MutationObserver, ResizeObserver, demonter } = bac();
/* ======== début du code du prototype ======== */
(function(){
'use strict';
const $=id=>document.getElementById(id);
const FN=[
  {label:'x²',      f:x=>x*x,           d:x=>2*x,          cy:1.3, yr:[-0.8,4.8], dr:[-5.2,5.2]},
  {label:'x³/3 − x',f:x=>x*x*x/3-x,     d:x=>x*x-1,        cy:0,   yr:[-2.6,2.6], dr:[-1.8,4.4]},
  {label:'sin x',   f:Math.sin,         d:Math.cos,        cy:0,   yr:[-1.7,1.7], dr:[-1.7,1.7]},
  {label:'|x|',     f:Math.abs,         d:x=>x>0?1:x<0?-1:NaN, cy:1.2, yr:[-0.6,3.6], dr:[-1.8,1.8]}
];
const SK=[
  {f:x=>x*x/2-1,              d:x=>x},
  {f:x=>1.5*Math.sin(x),      d:x=>1.5*Math.cos(x)},
  {f:x=>x*x*x/3-x,            d:x=>x*x-1},
  {f:x=>2.2*Math.exp(-x*x/2)-0.8, d:x=>-2.2*x*Math.exp(-x*x/2)}
];
const XR=3.2, NB=241, SN=121, SKX=3, SKY=3;
const S={fn:0,a:1,h:1,tan:false,zoom:0,trail:new Array(NB).fill(false),
         sk:{i:0,user:new Array(SN).fill(null),revealed:false,probe:null}};
let C={}, V1=null, V3=null, V4t=null, V4b=null, pending=false, anim=null, sweep=null;

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

/* ---------- figure 1 : sécante ---------- */
function drawFig1(){
  const {ctx,w,h}=setup($('cv1')), fn=FN[S.fn], v=eqView(w,h,0,fn.cy,XR); V1=v;
  grid(ctx,v,true);
  curve(ctx,v,fn.f,C.ink,2.6);
  const a=S.a, hh=S.h, ya=fn.f(a), b=a+hh, yb=fn.f(b), d=fn.d(a);
  if(S.tan&&isFinite(d)) lineSlope(ctx,v,a,ya,d,C.tan,2,[7,6]);
  if(hh!==0){
    const m=(yb-ya)/hh;
    lineSlope(ctx,v,a,ya,m,C.sec,2.2);
    ctx.strokeStyle=C.mark; ctx.lineWidth=3;
    ctx.beginPath(); ctx.moveTo(v.X(a),v.Y(ya)); ctx.lineTo(v.X(b),v.Y(ya)); ctx.lineTo(v.X(b),v.Y(yb)); ctx.stroke();
    if(Math.abs(v.X(b)-v.X(a))>46){
      label(ctx,'h = '+frh(hh),(v.X(a)+v.X(b))/2,v.Y(ya)+(yb>=ya?15:-15),C.mark);
    }
    if(Math.abs(v.Y(yb)-v.Y(ya))>22){
      label(ctx,'Δy = '+fr(yb-ya,2),v.X(b)+(hh>0?8:-8),(v.Y(ya)+v.Y(yb))/2,C.mark,hh>0?'left':'right');
    }
    handle(ctx,v.X(a),v.Y(ya),C.ink,'A',yb>ya===hh>0?false:true);
    handle(ctx,v.X(b),v.Y(yb),C.sec,'B',false);
  }else{
    handle(ctx,v.X(a),v.Y(ya),C.sec,'',false);
    label(ctx,'A = B : 0 ÷ 0',v.X(a),v.Y(ya)-26,C.sec,'center',14);
  }
}

/* ---------- figure 2 : zoom ---------- */
function drawZoom(){
  const {ctx,w,h}=setup($('cvz')), fn=FN[S.fn], z=Math.pow(10,S.zoom);
  const a=S.a, ya=fn.f(a), d=fn.d(a), v=eqView(w,h,a,ya,XR/z);
  grid(ctx,v,true);
  if(S.tan&&isFinite(d)) lineSlope(ctx,v,a,ya,d,C.tan,2,[7,6]);
  curve(ctx,v,fn.f,C.ink,2.8);
  handle(ctx,v.X(a),v.Y(ya),C.ink,'A',false);
  let dev=NaN;
  if(isFinite(d)){
    dev=0; const sc=h/(v.y1-v.y0);
    for(let i=0;i<=200;i++){const x=v.x0+(v.x1-v.x0)*i/200; dev=Math.max(dev,Math.abs(fn.f(x)-(ya+d*(x-a)))*sc);}
  }
  S.dev=dev; S.zw=2*XR/z;
}

/* ---------- figure 3 : trace de f' ---------- */
function drawTrace(){
  const fn=FN[S.fn], a=S.a, ya=fn.f(a), d=fn.d(a);
  { const {ctx,w,h}=setup($('cv3t')), v=view(w,h,-XR,XR,fn.yr[0],fn.yr[1]); V3=v;
    grid(ctx,v,false);
    ctx.strokeStyle=C.soft; ctx.lineWidth=1; ctx.setLineDash([3,4]); seg(ctx,v.X(a),0,v.X(a),h); ctx.setLineDash([]);
    curve(ctx,v,fn.f,C.ink,2.6);
    if(isFinite(d)){
      const sx=w/(2*XR), sy=h/(fn.yr[1]-fn.yr[0]); let ux=sx, uy=-d*sy; const n=Math.hypot(ux,uy); ux/=n; uy/=n;
      ctx.strokeStyle=C.tan; ctx.lineWidth=3; seg(ctx,v.X(a)-ux*80,v.Y(ya)-uy*80,v.X(a)+ux*80,v.Y(ya)+uy*80);
      ctx.strokeStyle=C.mark; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(v.X(a),v.Y(ya)); ctx.lineTo(v.X(a+1),v.Y(ya)); ctx.lineTo(v.X(a+1),v.Y(ya+d)); ctx.stroke();
      label(ctx,'1',v.X(a+.5),v.Y(ya)+(d>=0?12:-12),C.mark,'center',12);
      if(Math.abs(d*sy)>16) label(ctx,fr(d,2),v.X(a+1)+7,v.Y(ya+d/2),C.mark,'left',12);
    }
    handle(ctx,v.X(a),v.Y(ya),C.ink,'A',false);
  }
  { const {ctx,w,h}=setup($('cv3b')), v=view(w,h,-XR,XR,fn.dr[0],fn.dr[1]);
    grid(ctx,v,false);
    ctx.strokeStyle=C.soft; ctx.lineWidth=1; ctx.setLineDash([3,4]); seg(ctx,v.X(a),0,v.X(a),h); ctx.setLineDash([]);
    for(let i=0;i<NB;i++){ if(!S.trail[i]) continue; const x=-XR+2*XR*i/(NB-1), y=fn.d(x); if(isFinite(y)) dot(ctx,v.X(x),v.Y(y),C.tan,2); }
    if(isFinite(d)){
      ctx.strokeStyle=C.mark; ctx.lineWidth=3; seg(ctx,v.X(a),v.Y(0),v.X(a),v.Y(d));
      dot(ctx,v.X(a),v.Y(d),C.tan,6);
      label(ctx,fr(d,2),v.X(a)+12,v.Y(d)+(d>=0?-10:10),C.tan,'left',13);
    }else{
      label(ctx,'pas de pente ici',v.X(a)+10,v.Y(0)-14,C.sec,'left',13);
    }
  }
}
function markTrail(from,to){
  const idx=x=>Math.round((x+XR)/(2*XR)*(NB-1));
  let i0=idx(Math.min(from,to)), i1=idx(Math.max(from,to));
  for(let i=clamp(i0,0,NB-1);i<=clamp(i1,0,NB-1);i++) S.trail[i]=true;
}

/* ---------- figure 4 : dessiner la dérivée ---------- */
function drawSketch(){
  const k=SK[S.sk.i];
  { const {ctx,w,h}=setup($('cv4t')), v=view(w,h,-SKX,SKX,-SKY,SKY); V4t=v;
    grid(ctx,v,false); curve(ctx,v,k.f,C.ink,2.8);
    if(S.sk.revealed&&S.sk.probe!==null){
      const x=S.sk.probe, y=k.f(x), d=k.d(x), sx=w/(2*SKX), sy=h/(2*SKY);
      let ux=sx, uy=-d*sy; const n=Math.hypot(ux,uy); ux/=n; uy/=n;
      ctx.strokeStyle=C.tan; ctx.lineWidth=3; seg(ctx,v.X(x)-ux*70,v.Y(y)-uy*70,v.X(x)+ux*70,v.Y(y)+uy*70);
      dot(ctx,v.X(x),v.Y(y),C.ink,5); label(ctx,'pente '+fr(d,2),v.X(x),v.Y(y)-20,C.tan,'center',13);
    }
  }
  { const {ctx,w,h}=setup($('cv4b')), v=view(w,h,-SKX,SKX,-SKY,SKY); V4b=v;
    grid(ctx,v,false);
    ctx.strokeStyle=C.sec; ctx.lineWidth=3; ctx.beginPath(); let pen=false, any=false;
    for(let i=0;i<SN;i++){ const u=S.sk.user[i]; if(u===null){pen=false;continue;} any=true;
      const X=v.X(-SKX+2*SKX*i/(SN-1)), Y=v.Y(u); if(pen) ctx.lineTo(X,Y); else {ctx.moveTo(X,Y);pen=true;} }
    ctx.stroke();
    if(!any) label(ctx,'dessinez ici',w/2,h*0.25,C.soft,'center',14);
    if(S.sk.revealed){
      curve(ctx,v,k.d,C.tan,3);
      if(S.sk.probe!==null){ const x=S.sk.probe; dot(ctx,v.X(x),v.Y(k.d(x)),C.tan,6); }
    }
  }
}
function compare(){
  const k=SK[S.sk.i], U=S.sk.user; let n=0, sOk=0, sN=0, err=0;
  for(let i=0;i<SN;i++){ if(U[i]===null) continue; n++; const x=-SKX+2*SKX*i/(SN-1), d=k.d(x);
    err+=Math.abs(U[i]-d); if(Math.abs(d)>0.25){sN++; if(Math.sign(U[i])===Math.sign(d)&&Math.abs(U[i])>0.05) sOk++;} }
  const fb=$('skfb');
  if(n<SN*0.6){ fb.textContent='Votre dessin doit couvrir presque toute la largeur du cadre avant de comparer.'; return; }
  let zN=0, zOk=0;
  for(let i=1;i<SN;i++){ const x0=-SKX+2*SKX*(i-1)/(SN-1), x1=-SKX+2*SKX*i/(SN-1);
    if(k.d(x0)*k.d(x1)<=0&&k.d(x0)!==k.d(x1)){ zN++; const u=U[i]!==null?U[i]:U[i-1]; if(u!==null&&Math.abs(u)<0.5) zOk++; if(k.d(x1)===0) i++; } }
  const mae=err/n, pct=sN?Math.round(100*sOk/sN):100;
  const head=mae<0.4?'Très proche.':mae<0.9?'Bonne allure.':'À reprendre.';
  let t='<strong>'+head+'</strong> Signe correct sur '+pct+' % de la largeur.';
  if(pct<80) t+=' Rappel : là où la courbe monte, sa dérivée est positive ; là où elle descend, négative.';
  if(zN) t+=' Tangentes horizontales repérées par un passage à zéro : '+zOk+' sur '+zN+'.';
  t+=' Écart moyen avec la vraie dérivée (en vert) : '+fr(mae,2)+'. Promenez le pointeur sur la courbe du haut pour vérifier point par point.';
  fb.innerHTML=t; S.sk.revealed=true; schedule();
}

/* ---------- texte lié ---------- */
function updateText(){
  const fn=FN[S.fn], a=S.a, h=S.h, ya=fn.f(a), yb=fn.f(a+h), dy=yb-ya, m=h!==0?dy/h:NaN, d=fn.d(a);
  const L={
    a:fr(a,2), h:'h = '+frh(h), dy:'Δy = '+fr(dy,Math.abs(h)<0.1?4:2),
    slope:h!==0?fr(m,3):'0 ÷ 0, indéfini', slope4:h!==0?fr(m,4):'indéfini',
    num:h!==0?fr(yb,4)+' − '+fr(ya,4):'0', den:frh(h),
    zoom:'×'+fr(Math.pow(10,S.zoom),S.zoom<1?1:0),
    zw:S.zw!==undefined?fr(S.zw,S.zw>=1?1:S.zw>=0.1?2:S.zw>=0.01?3:4):'',
    d3:isFinite(d)?'en a = '+fr(a,2)+', pente '+fr(d,2):'en a = '+fr(a,2)+', pas de pente',
    ski:String(S.sk.i+1)
  };
  document.querySelectorAll('[data-live]').forEach(e=>{const t=L[e.dataset.live]; if(t!==undefined&&e.textContent!==t) e.textContent=t;});
  document.querySelectorAll('.scrub').forEach(e=>{const k=e.dataset.var, t=k==='a'?fr(a,2):frh(h); if(e.textContent!==t) e.textContent=t; e.setAttribute('aria-valuenow',k==='a'?a:h);});
  // tableau
  const hs=[1,0.1,0.01,0.001,0.0001]; let rows='';
  const ah=Math.abs(h); let near=-1, best=1e9;
  hs.forEach((x,i)=>{const e=Math.abs(Math.log10(x)-Math.log10(ah||1e-9)); if(e<best){best=e;near=i;}});
  hs.forEach((x,i)=>{ const r=(fn.f(a+x)-ya)/x, l=(fn.f(a-x)-ya)/(-x);
    rows+='<tr'+(i===near&&ah>0?' class="now"':'')+'><td>'+fr(x,i)+'</td><td>'+fr(r,4)+'</td><td>'+fr(l,4)+'</td></tr>'; });
  const tb=$('tab').tBodies[0]; if(tb.innerHTML!==rows) tb.innerHTML=rows;
  const r=(fn.f(a+1e-6)-ya)/1e-6, l=(fn.f(a-1e-6)-ya)/(-1e-6);
  const vt=Math.abs(r-l)<1e-3
    ?'Les deux colonnes s\'approchent du même nombre : f ′('+fr(a,2)+') = '+fr((r+l)/2,3)+'.'
    :'À droite on s\'approche de '+fr(r,2)+', à gauche de '+fr(l,2)+'. Pas de pente commune : f n\'est pas dérivable en '+fr(a,2)+'.';
  if($('verdict').textContent!==vt) $('verdict').textContent=vt;
  let zt;
  if(!isFinite(d)) zt='En ce point la courbe garde son coin à toutes les échelles : aucune droite ne lui ressemble, il n\'y a pas de tangente.';
  else if(S.dev<1) zt='À cette échelle, la courbe s\'écarte de sa tangente de moins d\'un pixel : à l\'écran, c\'est une droite.';
  else zt='Dans cette fenêtre, la courbe s\'écarte de sa tangente d\'au plus '+fr(S.dev,0)+' px. Grossissez encore.';
  if($('zoomtext').textContent!==zt) $('zoomtext').textContent=zt;
  document.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',String(+c.dataset.fn===S.fn)));
  if($('c-tan').checked!==S.tan) $('c-tan').checked=S.tan;
}
function render(){ pending=false; drawFig1(); drawZoom(); drawTrace(); drawSketch(); updateText(); }
function schedule(){ if(!pending){pending=true;requestAnimationFrame(render);} }

/* ---------- état ---------- */
function snapA(x){const s=Math.round(x*2)/2; return Math.abs(x-s)<0.04?s:x;}
function setA(x,trace){
  const na=clamp(x,-2.9,2.9);
  if(trace) markTrail(S.a,na);
  S.a=na; S.h=clamp(S.h,-3.1-S.a,3.1-S.a); schedule();
}
function setH(x){ S.h=clamp(x,Math.max(-2.5,-3.1-S.a),Math.min(2.5,3.1-S.a)); schedule(); }
function setFn(i){ if(i===S.fn) return; S.fn=i; S.trail.fill(false); stopAnims(); schedule(); }
function stopAnims(){ if(anim){cancelAnimationFrame(anim);anim=null;} if(sweep){cancelAnimationFrame(sweep);sweep=null;} }

/* ---------- interactions ---------- */
function pos(e){const r=e.currentTarget.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top};}
function drag(cv,fn){
  let on=false;
  cv.addEventListener('pointerdown',e=>{on=true;try{cv.setPointerCapture(e.pointerId);}catch(_){}
    cv.style.cursor='grabbing'; fn(pos(e),'down');});
  cv.addEventListener('pointermove',e=>{fn(pos(e),on?'move':'hover');});
  const end=e=>{if(on){on=false;cv.style.cursor='';fn(pos(e),'up');}};
  cv.addEventListener('pointerup',end); cv.addEventListener('pointercancel',end);
  cv.addEventListener('pointerleave',e=>{if(!on) fn(pos(e),'leave');});
}
let grab1='B';
drag($('cv1'),(p,ph)=>{
  if(!V1||ph==='hover'||ph==='leave'||ph==='up') return;
  const fn=FN[S.fn], v=V1;
  if(ph==='down'){
    stopAnims();
    const dA=Math.hypot(p.x-v.X(S.a),p.y-v.Y(fn.f(S.a))), dB=Math.hypot(p.x-v.X(S.a+S.h),p.y-v.Y(fn.f(S.a+S.h)));
    grab1=dB<=dA+4?'B':'A';
  }
  const x=v.ix(p.x);
  if(grab1==='A') setA(snapA(x));
  else { let h=x-S.a; if(Math.abs(h)<0.025) h=0; setH(h); }
});
drag($('cv3t'),(p,ph)=>{ if(!V3||ph==='hover'||ph==='leave'||ph==='up') return; stopAnims(); if(ph==='down') S.a=clamp(V3.ix(p.x),-2.9,2.9); setA(snapA(V3.ix(p.x)),true); });
drag($('cv3b'),(p,ph)=>{ if(!V3||ph==='hover'||ph==='leave'||ph==='up') return; stopAnims(); if(ph==='down') S.a=clamp(V3.ix(p.x),-2.9,2.9); setA(V3.ix(p.x),true); });
drag($('cv4t'),(p,ph)=>{ if(!V4t||!S.sk.revealed) return; if(ph==='leave'){S.sk.probe=null;} else S.sk.probe=clamp(V4t.ix(p.x),-SKX,SKX); schedule(); });
let lastSk=null;
drag($('cv4b'),(p,ph)=>{
  if(!V4b) return;
  if(ph==='hover'||ph==='leave') return;
  if(ph==='up'){lastSk=null;return;}
  if(S.sk.revealed){S.sk.revealed=false;S.sk.probe=null;$('skfb').textContent='Vous modifiez votre dessin. Comparez à nouveau quand vous êtes prêt.';}
  const bi=clamp(Math.round((V4b.ix(p.x)+SKX)/(2*SKX)*(SN-1)),0,SN-1), y=clamp(V4b.iy(p.y),-SKY,SKY);
  if(ph==='down'||!lastSk){S.sk.user[bi]=y;}
  else{ const a=lastSk.i,b=bi, lo=Math.min(a,b), hi=Math.max(a,b);
    for(let i=lo;i<=hi;i++){const t=hi===lo?1:(i-a)/(b-a); S.sk.user[i]=lastSk.y+(y-lastSk.y)*t;} }
  lastSk={i:bi,y}; schedule();
});

document.querySelectorAll('.scrub').forEach(el=>{
  const k=el.dataset.var; let on=false, x0=0, v0=0;
  el.setAttribute('aria-valuemin',k==='a'?-2.9:-2.5); el.setAttribute('aria-valuemax',k==='a'?2.9:2.5);
  const set=v=>{stopAnims(); if(k==='a') setA(v); else setH(v);};
  el.addEventListener('pointerdown',e=>{on=true;x0=e.clientX;v0=S[k];try{el.setPointerCapture(e.pointerId);}catch(_){} e.preventDefault();});
  el.addEventListener('pointermove',e=>{ if(!on) return; set(Math.round((v0+(e.clientX-x0)*0.01)*100)/100); });
  const end=()=>{on=false;}; el.addEventListener('pointerup',end); el.addEventListener('pointercancel',end);
  el.addEventListener('keydown',e=>{ const st=e.shiftKey?0.1:0.01;
    if(e.key==='ArrowRight'||e.key==='ArrowUp'){set(Math.round((S[k]+st)*100)/100);e.preventDefault();}
    if(e.key==='ArrowLeft'||e.key==='ArrowDown'){set(Math.round((S[k]-st)*100)/100);e.preventDefault();} });
});
document.querySelectorAll('[data-chips]').forEach(box=>{
  FN.forEach((f,i)=>{const b=document.createElement('button'); b.className='chip'; b.type='button'; b.dataset.fn=i; b.textContent=f.label;
    b.addEventListener('click',()=>setFn(i)); box.appendChild(b);});
});
const reduced=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
$('b-go').addEventListener('click',()=>{
  stopAnims(); if(S.h===0||Math.abs(S.h)<=0.0005) S.h=clamp(1,-3.1-S.a,3.1-S.a)||-1;
  if(reduced){S.h=Math.sign(S.h)*0.0005;schedule();return;}
  const step=()=>{ S.h*=0.95; if(Math.abs(S.h)<0.0005){S.h=Math.sign(S.h)*0.0005;anim=null;} else anim=requestAnimationFrame(step); schedule(); };
  anim=requestAnimationFrame(step);
});
function scaleH(k){stopAnims(); let h=S.h===0?1:S.h/k; if(Math.abs(h)<0.0001) h=Math.sign(h)*0.0001; setH(h);}
$('b-2').addEventListener('click',()=>scaleH(2));
$('b-10').addEventListener('click',()=>scaleH(10));
$('b-neg').addEventListener('click',()=>{stopAnims();setH(S.h===0?-1:-S.h);});
$('b-1').addEventListener('click',()=>{stopAnims();setH(1);});
$('c-tan').addEventListener('change',e=>{S.tan=e.target.checked;schedule();});
$('zoom').addEventListener('input',e=>{S.zoom=+e.target.value;schedule();});
$('b-clear').addEventListener('click',()=>{stopAnims();S.trail.fill(false);schedule();});
$('b-sweep').addEventListener('click',()=>{
  stopAnims(); if(reduced){S.trail.fill(true);schedule();return;}
  S.a=-2.9; const t0=performance.now();
  const step=now=>{ const t=Math.min(1,(now-t0)/5000); setA(-2.9+5.8*t,true); sweep=t<1?requestAnimationFrame(step):null; };
  sweep=requestAnimationFrame(step);
});
$('b-cmp').addEventListener('click',compare);
function resetSketch(msg){S.sk.user.fill(null);S.sk.revealed=false;S.sk.probe=null;$('skfb').textContent=msg;schedule();}
$('b-era').addEventListener('click',()=>resetSketch('Cadre effacé. Repérez les sommets et les creux : la tangente y est horizontale.'));
$('b-next').addEventListener('click',()=>{S.sk.i=(S.sk.i+1)%SK.length;resetSketch('Nouvelle courbe. Où monte-t-elle ? Où descend-elle ?');});

/* ---------- démarrage ---------- */
function start(saved){
  if(saved&&typeof saved.fn==='number'){ S.fn=clamp(saved.fn|0,0,FN.length-1); S.a=+saved.a||0; S.h=+saved.h||0; S.zoom=+saved.zoom||0; S.tan=!!saved.tan; S.sk.i=clamp(saved.ski|0,0,SK.length-1); $('zoom').value=S.zoom; }
  readTheme(); render();
}
const hot=window.claude&&window.claude.hot;
if(hot&&hot.snapshot) hot.snapshot(()=>({fn:S.fn,a:S.a,h:S.h,zoom:S.zoom,tan:S.tan,ski:S.sk.i}));
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
