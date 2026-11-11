// Casse-tête « Les tours de Hanoï » (rubrique Activités, MEMO_atlas_activites.md §121).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite } from './figures.js';
import { cssJeux, ecrire, entier } from './jeux.js';

export const css = cssCommun + cssFigures + cssJeux + `
.activites-act .hn { display: grid; grid-template-columns: repeat(var(--tours), minmax(0, 1fr)); gap: 8px; width: min(100%, calc(var(--tours) * 190px)); }
.activites-act .hn button.tour { position: relative; display: flex; flex-direction: column-reverse; align-items: center; gap: 3px; height: calc(var(--disques) * 21px + 46px); padding: 0 2px 6px; border-radius: 8px; border: 1px solid transparent; border-bottom: 4px solid var(--encre-3); background: transparent; }
.activites-act .hn button.tour::before { content: ""; position: absolute; left: calc(50% - 3px); bottom: 0; top: 16px; width: 6px; border-radius: 3px 3px 0 0; background: var(--filet); }
.activites-act .hn button.tour { margin-bottom: 20px; }
.activites-act .hn button.tour::after { content: attr(data-role); position: absolute; left: 0; right: 0; bottom: -24px; font: 600 11px var(--f-ui); letter-spacing: .06em; text-transform: uppercase; }
.activites-act .hn button.tour.depart { border-bottom-color: var(--sec); } .activites-act .hn button.tour.depart::after { color: var(--sec); }
.activites-act .hn button.tour.arrivee { border-bottom-color: var(--tan); background: color-mix(in srgb, var(--tan) 12%, transparent); } .activites-act .hn button.tour.arrivee::after { color: var(--tan); }
.activites-act .hn button.tour.arrivee::before { background: color-mix(in srgb, var(--tan) 45%, var(--filet)); }
.activites-act .hn button.tour:hover { background: var(--trame); }
.activites-act .hn button.tour.prise { border-color: var(--activites-jeu); background: var(--surface); }
.activites-act .hn button.tour.conseil { background: var(--hl); }
.activites-act .hn .disque { position: relative; height: 18px; border-radius: 9px; background: var(--activites-jeu); opacity: calc(.45 + .55 * var(--t)); width: calc(18% + 80% * var(--t)); font: 600 11px/18px var(--f-mono); color: var(--surface); text-align: center; }
.activites-act .hn button.tour.prise .disque:last-child { transform: translateY(-12px); outline: 2px solid var(--encre); }
`;

export const html = `
<header class="col">
  <p class="eyebrow">Casse-tête · Terminale, Maths Sup</p>
  <h3>Les tours de Hanoï</h3>
  <p class="lede">Une pile de disques à transporter d'une tour à une autre, un disque à la fois, sans jamais poser un disque sur un plus petit. Combien de coups faut-il, au minimum ? Jouez d'abord, la récurrence vient ensuite.</p>
</header>

<div class="jeu">
  <div class="bar top">
    <label>Tours <select id="hn-p"><option selected>3</option><option>4</option><option>5</option></select></label>
    <label>Disques <select id="hn-n"><option>1</option><option>2</option><option>3</option><option selected>4</option><option>5</option><option>6</option><option>7</option><option>8</option></select></label>
    <button type="button" class="primary" id="hn-debut">Recommencer</button>
    <button type="button" id="hn-conseil">Un coup</button>
    <button type="button" id="hn-auto">Montrer une solution</button>
  </div>
  <div class="jeu-plateau"><div class="hn" id="hn-plateau" role="group" aria-label="Les tours. Choisissez la tour de départ d'un disque, puis sa tour d'arrivée."></div></div>
  <div class="jeu-etat"><span>Coups joués : <b id="hn-coups">0</b></span><span id="hn-min"></span><span id="hn-reste"></span></div>
  <div class="jeu-message" id="hn-message" aria-live="polite"></div>
</div>

<section>
  <div class="col">
    <h4><span class="n">1</span>Jouer</h4>
    <p>Cliquez sur une tour pour saisir le disque du dessus, puis sur la tour où le poser. Il s'agit d'amener toute la pile de la tour de départ, dont le socle est orange, sur la tour d'arrivée, en vert. Commencez avec trois tours et trois ou quatre disques, comptez vos coups, puis recommencez en cherchant à en jouer moins.</p>
    <p>La page connaît toutes les positions du jeu : elle indique le nombre minimal de coups depuis le départ et depuis la position où vous êtes, et « Un coup » joue l'un des meilleurs.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Trois tours : <span class=kx>2^{n} - 1</span> coups</h4>
    <p>Notons <span class=kx>T(n)</span> le nombre minimal de coups pour déplacer <span class=kx>n</span> disques avec trois tours. Pour <span class=kx>n = 1</span>, 2, 3, 4, le jeu donne 1, 3, 7, 15.</p>
    <p><b>On peut le faire en <span class=kx>2T(n - 1) + 1</span> coups.</b> On transporte les <span class=kx>n - 1</span> petits disques sur la tour du milieu, on porte le grand disque sur la dernière tour, puis on ramène les <span class=kx>n - 1</span> petits disques par-dessus.</p>
    <p><b>On ne peut pas faire mieux.</b> Le grand disque doit bouger. Au moment de son premier déplacement, rien ne le recouvre et la tour où il va est vide : les <span class=kx>n - 1</span> autres disques sont donc tous empilés sur la troisième tour, ce qui a demandé au moins <span class=kx>T(n - 1)</span> coups. Après son dernier déplacement, il est sur la tour d'arrivée et les <span class=kx>n - 1</span> autres, de nouveau empilés ailleurs, doivent encore y être amenés : au moins <span class=kx>T(n - 1)</span> coups de plus.</p>
    <div class="def"><p><span class="kx">T(n) = 2\\,T(n-1) + 1</span> et <span class="kx">T(1) = 1</span>, donc, par récurrence,</p><span class="kx kxd">T(n) = 2^n - 1.</span></div>
    <p>En effet, si <span class=kx>T(n - 1) = 2^{n - 1} - 1</span>, alors <span class=kx>T(n) = 2(2^{n - 1} - 1) + 1 = 2^{n} - 1</span>. Avec huit disques, il faut déjà 255 coups.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Une tour de plus change tout</h4>
    <p>Passez à quatre tours. Les minimums tombent à 1, 3, 5, 9, 13, 17, 25, 33 pour un à huit disques : la tour supplémentaire sert de garage. Mais le raisonnement précédent ne tient plus, car les petits disques peuvent se répartir sur deux tours, et l'on ne connaît plus de formule aussi simple.</p>
    <p>Une stratégie naturelle, proposée en 1941 par J. S. Frame et B. M. Stewart, consiste à garer d'abord les <span class=kx>k</span> plus petits disques sur une tour, à transporter les autres avec les tours qui restent, puis à ramener les <span class=kx>k</span> petits, en choisissant le meilleur <span class=kx>k</span>. Qu'elle soit la meilleure possible avec quatre tours n'a été démontré qu'en 2014, par Thierry Bousch ; avec cinq tours ou plus, la question est toujours ouverte. Les nombres affichés ici ne dépendent pas de cette conjecture : pour huit disques au plus, la page parcourt toutes les positions.</p>
  </div>
</section>
` + suite(
  "Confondre « j'ai trouvé une solution en <span class=kx>2^{n} - 1</span> coups » et « <span class=kx>2^{n} - 1</span> est le minimum ». Exhiber une stratégie ne donne qu'une majoration ; il faut un second raisonnement, celui du grand disque, pour montrer qu'aucune autre ne fait mieux. C'est exactement ce second raisonnement qui manque dès qu'il y a plus de quatre tours.",
  "Le raisonnement par récurrence est introduit en Terminale, dans le chapitre <a href=\"#cours/t-01\">Suites numériques</a> ; l'édifice l'établit à la fiche <a href=\"#n.n-recurrence\">Principe de récurrence</a>. Le jeu a été inventé par Édouard Lucas en 1883. Pour quatre tours : Thierry Bousch, « La quatrième tour de Hanoï », <i>Bulletin of the Belgian Mathematical Society – Simon Stevin</i>, vol. 21, n° 5 (2014), p. 895-912.",
  "Une position est la donnée de la tour de chaque disque : il y en a <span class=kx>p^{n}</span> pour <span class=kx>p</span> tours et <span class=kx>n</span> disques, au plus 390 625 ici. La page les parcourt toutes en largeur à partir de la position finale, ce qui donne le nombre minimal exact de coups depuis chacune. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let p = 3, n = 4, pos = [], coups = 0, prise = -1, conseil = [-1, -1], msg = '', minuterie = null, vivant = true;
  const tables = new Map();
  // pos[k] : tour du disque k (0 = le plus petit). Code : Σ pos[k]·p^k.
  const code = a => { let x = 0; for (let k = n - 1; k >= 0; k--) x = x * p + a[k]; return x; };
  const sommets = a => { const s = new Array(p).fill(-1); for (let k = n - 1; k >= 0; k--) s[a[k]] = k; return s; };   // plus petit disque de chaque tour
  function table() {
    const cle = p + '/' + n; if (tables.has(cle)) return tables.get(cle);
    const total = Math.pow(p, n), D = new Uint16Array(total).fill(65535), a = new Array(n).fill(p - 1);
    let file = [code(a)]; D[file[0]] = 0;
    const puiss = Array.from({ length: n }, (_, k) => Math.pow(p, k));
    while (file.length) { const suiv = [];
      for (const c of file) { let x = c; for (let k = 0; k < n; k++) { a[k] = x % p; x = (x - a[k]) / p; }
        const s = sommets(a), d = D[c];
        for (let i = 0; i < p; i++) { if (s[i] < 0) continue; for (let j = 0; j < p; j++) { if (j === i || (s[j] >= 0 && s[j] < s[i])) continue;
          const c2 = c + (j - i) * puiss[s[i]]; if (D[c2] === 65535) { D[c2] = d + 1; suiv.push(c2); } } } }
      file = suiv; }
    tables.set(cle, D); return D;
  }
  const fini = () => pos.every(x => x === p - 1);
  function deplacer(i, j) { const s = sommets(pos); if (s[i] < 0 || (s[j] >= 0 && s[j] < s[i])) return false; pos[s[i]] = j; coups++; return true; }
  function meilleur() { const D = table(), d = D[code(pos)], s = sommets(pos);
    for (let i = 0; i < p; i++) { if (s[i] < 0) continue; for (let j = 0; j < p; j++) { if (j === i || (s[j] >= 0 && s[j] < s[i])) continue;
      const b = pos.slice(); b[s[i]] = j; if (D[code(b)] === d - 1) return [i, j]; } }
    return null; }
  function arreter() { if (minuterie) { clearInterval(minuterie); minuterie = null; } }
  function debut() { arreter(); pos = new Array(n).fill(0); coups = 0; prise = -1; conseil = [-1, -1]; msg = ''; }
  function rendre() {
    if (!vivant) return;
    const P = q('#hn-plateau'); P.style.setProperty('--tours', p); P.style.setProperty('--disques', n);
    if (P.children.length !== p) { P.innerHTML = ''; for (let i = 0; i < p; i++) { const b = document.createElement('button'); b.type = 'button'; b.className = 'tour'; b.dataset.i = i; P.append(b); } }
    [...P.children].forEach((b, i) => {
      const ds = []; for (let k = n - 1; k >= 0; k--) if (pos[k] === i) ds.push(k);   // du bas vers le haut
      b.className = 'tour' + (i === 0 ? ' depart' : i === p - 1 ? ' arrivee' : '') + (i === prise ? ' prise' : '') + (conseil.includes(i) ? ' conseil' : '');
      b.dataset.role = i === 0 ? 'départ' : i === p - 1 ? 'arrivée' : '';
      b.innerHTML = ds.map(k => `<span class="disque" style="--t:${n > 1 ? k / (n - 1) : 1}">${k + 1}</span>`).join('');
      b.setAttribute('aria-label', `Tour ${i + 1}${i === 0 ? ' (départ)' : i === p - 1 ? ' (arrivée)' : ''} : ${ds.length ? 'disques ' + ds.map(k => k + 1).join(', ') + ' (du bas vers le haut)' : 'vide'}`);
    });
    const D = table(), dep = D[code(new Array(n).fill(0))], reste = D[code(pos)], gagne = fini();
    ecrire(q('#hn-coups'), entier(coups));
    ecrire(q('#hn-min'), `Minimum depuis le départ : ${entier(dep)}`);
    ecrire(q('#hn-reste'), gagne ? '' : `Au mieux, il reste ${entier(reste)} coup${reste > 1 ? 's' : ''}.`);
    const m = q('#hn-message'); m.className = 'jeu-message' + (gagne ? ' gagne' : msg ? ' bloque' : '');
    ecrire(m, gagne ? (coups === dep ? `Réussi en ${entier(coups)} coups : c'est le minimum.` : `Réussi en ${entier(coups)} coups ; le minimum est ${entier(dep)}.`)
      : msg || (prise >= 0 ? `Disque ${sommets(pos)[prise] + 1} saisi : choisissez la tour où le poser.` : `But : amener tous les disques sur la tour d'arrivée, la tour ${p}, en vert. Choisissez la tour dont vous voulez déplacer le disque du dessus.`));
    q('#hn-conseil').disabled = gagne; q('#hn-auto').disabled = gagne && !minuterie;
    ecrire(q('#hn-auto'), minuterie ? 'Arrêter' : 'Montrer une solution');
  }
  function regler() { arreter(); p = +q('#hn-p').value; n = +q('#hn-n').value; debut(); rendre(); }
  q('#hn-p').addEventListener('change', regler); q('#hn-n').addEventListener('change', regler);
  q('#hn-debut').addEventListener('click', () => { debut(); rendre(); });
  const unCoup = () => { const c = meilleur(); if (!c) return false; deplacer(c[0], c[1]); conseil = c; prise = -1; msg = ''; return true; };
  q('#hn-conseil').addEventListener('click', () => { arreter(); unCoup(); rendre(); });
  q('#hn-auto').addEventListener('click', () => {
    if (minuterie) { arreter(); rendre(); return; }
    minuterie = setInterval(() => { if (!vivant || !unCoup() || fini()) arreter(); rendre(); }, 420); rendre();
  });
  q('#hn-plateau').addEventListener('click', e => {
    const b = e.target.closest('button.tour'); if (!b || fini()) return; arreter();
    const i = +b.dataset.i, s = sommets(pos); conseil = [-1, -1]; msg = '';
    if (prise < 0) { if (s[i] >= 0) prise = i; else msg = 'Cette tour est vide : il n\'y a pas de disque à saisir.'; }
    else if (i === prise) prise = -1;
    else if (deplacer(prise, i)) prise = -1;
    else { msg = `Coup interdit : le disque ${s[prise] + 1} ne peut pas être posé sur le disque ${s[i] + 1}, plus petit que lui.`; prise = -1; }
    rendre();
  });
  debut(); rendre();
  return () => { vivant = false; arreter(); };
}
