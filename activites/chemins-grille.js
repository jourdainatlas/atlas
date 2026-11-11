// Exploration « Chemins sur une grille » (rubrique Activités, MEMO_atlas_activites.md §124).
import { css as cssCommun, bac } from './commun.js';
import { cssFigures, suite, scene, toile, trait, etiquette, pastille, glisser, ecrire, borne } from './figures.js';

export const css = cssCommun + cssFigures;
const entier = n => Math.round(n).toLocaleString('fr-FR');

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Dénombrement</p>
  <h3>Chemins sur une grille</h3>
  <p class="lede">Pour aller du coin en bas à gauche au coin en haut à droite d'un quadrillage, on n'a le droit d'avancer que vers la droite ou vers le haut. Combien y a-t-il de chemins ? Compter ces chemins, c'est redécouvrir les coefficients binomiaux et le triangle de Pascal.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Tracer un chemin</h4>
    <p>Réglez la taille de la grille, puis tracez un chemin avec les boutons « → » et « ↑ », ou avec les flèches du clavier (la flèche vers la gauche retire le dernier pas). Chaque chemin s'écrit comme un mot : la suite de ses pas. Essayez-en plusieurs, et comparez leurs mots.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="cg-fig" class="moyen" aria-label="Quadrillage avec, en chaque nœud, le nombre de chemins qui y mènent, et le chemin tracé"></canvas>
      <div class="side">
        <h5>Votre chemin</h5>
        <p class="verdict" id="cg-mot" aria-live="polite" style="font-family:var(--f-mono);overflow-wrap:anywhere"></p>
        <div class="chips"><button type="button" id="cg-d" aria-label="Un pas vers la droite">→</button><button type="button" id="cg-h" aria-label="Un pas vers le haut">↑</button><button type="button" id="cg-r">Reculer</button><button type="button" id="cg-e">Effacer</button><button type="button" id="cg-a">Au hasard</button></div>
        <h5 style="margin-top:8px">Le nœud choisi</h5>
        <dl class="lectures" aria-live="polite"><dt>position</dt><dd id="cg-pos"></dd><dt>chemins</dt><dd id="cg-nb"></dd><dt>somme</dt><dd id="cg-som"></dd></dl>
      </div>
    </div>
    <div class="reglages">
      <label for="cg-n">pas vers la droite, <i>n</i></label><input type="range" id="cg-n" min="1" max="8" step="1" value="4"><output id="cg-nv"></output>
      <label for="cg-p">pas vers le haut, <i>p</i></label><input type="range" id="cg-p" min="1" max="8" step="1" value="3"><output id="cg-pv"></output>
      <label for="cg-i">nœud choisi : colonne</label><input type="range" id="cg-i" min="0" max="4" step="1" value="2"><output id="cg-iv"></output>
      <label for="cg-j">nœud choisi : ligne</label><input type="range" id="cg-j" min="0" max="3" step="1" value="2"><output id="cg-jv"></output>
    </div>
    <div class="bar"><label><input type="checkbox" id="cg-nombres" checked> afficher le nombre de chemins en chaque nœud</label></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Un chemin est un mot</h4>
    <p>Tout chemin fait exactement <span class=kx>n</span> pas vers la droite et <span class=kx>p</span> pas vers le haut : son mot a <span class=kx>n + p</span> lettres, dont <span class=kx>n</span> lettres « → ». Réciproquement, tout mot de ce type décrit un chemin, et un seul. Compter les chemins revient donc à choisir, parmi les <span class=kx>n + p</span> positions du mot, les <span class=kx>n</span> positions des lettres « → ».</p>
    <div class="def"><p>Le nombre de chemins est le nombre de parties à <span class="kx">n</span> éléments d'un ensemble à <span class="kx">n + p</span> éléments, le coefficient binomial</p><span class="kx kxd">\\binom{n+p}{n} = \\frac{(n+p)!}{n!\\,p!}.</span></div>
    <p id="cg-total" aria-live="polite"></p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>La relation de Pascal</h4>
    <p>Choisissez un nœud, sur la figure ou avec les deux curseurs. Pour y arriver, le dernier pas vient soit de la gauche, soit du dessous : les chemins qui y mènent se partagent en deux familles, sans chemin commun. Le nombre inscrit en un nœud est donc la <b>somme</b> des nombres de ses deux voisins, à gauche et au-dessous.</p>
    <p>C'est la relation de Pascal : « <span class=kx>i</span> parmi <span class=kx>i + j</span> » est la somme de « <span class=kx>i - 1</span> parmi <span class=kx>i + j - 1</span> » et de « <span class=kx>i</span> parmi <span class=kx>i + j - 1</span> ». Penchez la tête d'un huitième de tour : les nombres de la grille, lus diagonale par diagonale, sont les lignes du triangle de Pascal.</p>
  </div>
</section>
` + suite(
  "Multiplier au lieu d'additionner, ou compter les nœuds au lieu des pas. Sur une grille de 4 pas vers la droite et 3 pas vers le haut, il n'y a ni 4 × 3 = 12 chemins, ni 5 × 4 = 20, mais « 4 parmi 7 », c'est-à-dire 35. On additionne les nombres des deux voisins parce que les deux familles de chemins sont disjointes ; on multiplierait si l'on enchaînait deux choix indépendants.",
  "Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> définit les combinaisons et démontre la relation de Pascal. Dans l'édifice, voir la fiche <a href=\"#z-polynomes.pol-binome\">Binôme de Newton et coefficients binomiaux</a> : développer <span class=kx>(a + b)^{n + p}</span>, c'est précisément compter les mots formés de <span class=kx>n</span> lettres <span class=kx>a</span> et de <span class=kx>p</span> lettres <span class=kx>b</span>.",
  "Les nombres de la grille sont calculés par additions successives à partir des bords, où ils valent 1 ; ce sont des entiers exacts (au plus 12 870, pour <span class=kx>n = p = 8</span>). Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { n: 4, p: 3, i: 2, j: 2, mot: [], nombres: true };   // mot : suite de 0 (droite) et 1 (haut)
  let G = null;
  const compte = () => { const T = []; for (let j = 0; j <= E.p; j++) { T.push([]); for (let i = 0; i <= E.n; i++) T[j].push(i === 0 || j === 0 ? 1 : T[j][i - 1] + T[j - 1][i]); } return T; };
  const fait = () => [E.mot.filter(x => x === 0).length, E.mot.filter(x => x === 1).length];
  const regler = () => { E.i = borne(E.i, 0, E.n); E.j = borne(E.j, 0, E.p); let a = 0, b = 0; E.mot = E.mot.filter(x => x === 0 ? ++a <= E.n : ++b <= E.p); };
  q('#cg-n').addEventListener('input', e => { E.n = +e.target.value; regler(); S.planifier(); });
  q('#cg-p').addEventListener('input', e => { E.p = +e.target.value; regler(); S.planifier(); });
  q('#cg-i').addEventListener('input', e => { E.i = +e.target.value; S.planifier(); });
  q('#cg-j').addEventListener('input', e => { E.j = +e.target.value; S.planifier(); });
  q('#cg-nombres').addEventListener('change', e => { E.nombres = e.target.checked; S.planifier(); });
  q('#cg-d').addEventListener('click', () => { if (fait()[0] < E.n) E.mot.push(0); S.planifier(); });
  q('#cg-h').addEventListener('click', () => { if (fait()[1] < E.p) E.mot.push(1); S.planifier(); });
  q('#cg-r').addEventListener('click', () => { E.mot.pop(); S.planifier(); });
  q('#cg-e').addEventListener('click', () => { E.mot = []; S.planifier(); });
  q('#cg-a').addEventListener('click', () => {   // chemin tiré uniformément : à chaque pas, proportionnellement au nombre de chemins restants
    const T = compte(); E.mot = []; let a = E.n, b = E.p;
    while (a > 0 || b > 0) { const d = a > 0 ? T[b][a - 1] : 0, h = b > 0 ? T[b - 1][a] : 0; if (Math.random() * (d + h) < d) { E.mot.push(0); a--; } else { E.mot.push(1); b--; } }
    S.planifier();
  });

  function rendre(C) {
    const { n, p } = E, T = compte(), { ctx, w, h } = toile(q('#cg-fig'));
    const m = 34, pasx = (w - 2 * m) / n, pasy = (h - 2 * m) / p, X = i => m + i * pasx, Y = j => h - m - j * pasy; G = { X, Y, pasx, pasy, m, h };
    ctx.strokeStyle = C.filetFort; ctx.lineWidth = 1.5;
    for (let i = 0; i <= n; i++) trait(ctx, X(i), Y(0), X(i), Y(p)); for (let j = 0; j <= p; j++) trait(ctx, X(0), Y(j), X(n), Y(j));
    // les deux arêtes qui mènent au nœud choisi
    ctx.strokeStyle = C.vert; ctx.lineWidth = 4;
    if (E.i > 0) trait(ctx, X(E.i - 1), Y(E.j), X(E.i), Y(E.j)); if (E.j > 0) trait(ctx, X(E.i), Y(E.j - 1), X(E.i), Y(E.j));
    // le chemin tracé
    ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X(0), Y(0)); let a = 0, b = 0;
    for (const x of E.mot) { if (x === 0) a++; else b++; ctx.lineTo(X(a), Y(b)); } ctx.stroke();
    const petit = Math.min(pasx, pasy) < 44;
    for (let j = 0; j <= p; j++) for (let i = 0; i <= n; i++) { const sel = i === E.i && j === E.j;
      pastille(ctx, X(i), Y(j), sel ? C.vert : C.doux, sel ? 6 : 3);
      if (E.nombres) etiquette(ctx, C, entier(T[j][i]), X(i) + 5, Y(j) - 11, sel ? C.vert : C.encre, 'left', petit ? 10 : 12); }
    pastille(ctx, X(a), Y(b), C.orange, 6);
    etiquette(ctx, C, 'départ', X(0), Y(0) + 17, C.doux, 'center', 11); etiquette(ctx, C, 'arrivée', X(n), Y(p) - (E.nombres ? 26 : 16), C.doux, 'center', 11);
    // textes
    for (const [id, v, max] of [['#cg-n', n], ['#cg-p', p], ['#cg-i', E.i, n], ['#cg-j', E.j, p]]) { const r = q(id); if (max !== undefined) r.max = max; if (+r.value !== v) r.value = v; ecrire(q(id + 'v'), String(v)); }
    const [fa, fb] = fait(), fini = fa === n && fb === p;
    ecrire(q('#cg-mot'), (E.mot.length ? E.mot.map(x => x ? '↑' : '→').join(' ') : '(aucun pas)') + (fini ? ' : arrivé, en ' + (n + p) + ' pas.' : ''));
    q('#cg-d').disabled = fa >= n; q('#cg-h').disabled = fb >= p; q('#cg-r').disabled = !E.mot.length;
    ecrire(q('#cg-pos'), `${E.i} pas à droite, ${E.j} en haut`);
    ecrire(q('#cg-nb'), `${E.i} parmi ${E.i + E.j} = ${entier(T[E.j][E.i])}`);
    ecrire(q('#cg-som'), E.i > 0 && E.j > 0 ? `${entier(T[E.j][E.i - 1])} + ${entier(T[E.j - 1][E.i])} = ${entier(T[E.j][E.i])}` : 'nœud du bord : un seul chemin');
    ecrire(q('#cg-total'), `Ici, n = ${n} et p = ${p} : les mots ont ${n + p} lettres dont ${n} lettres « → », et il y a ${entier(T[p][n])} chemins.`);
  }
  const S = scene(racine, rendre);
  glisser(q('#cg-fig'), pt => { if (!G) return; E.i = borne(Math.round((pt.x - G.m) / G.pasx), 0, E.n); E.j = borne(Math.round((G.h - G.m - pt.y) / G.pasy), 0, E.p); S.planifier(); });
  // Flèches du clavier : → et ↑ ajoutent un pas, ← (ou la touche d'effacement) retire le dernier. Écoutées sur la fenêtre
  // quand la figure est à l'écran, sauf dans un champ ou un curseur, où les flèches gardent leur rôle habituel.
  const { window: fenetre, demonter } = bac();
  fenetre.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || !/^(ArrowRight|ArrowUp|ArrowLeft|Backspace)$/.test(e.key)) return;
    if (e.target && e.target.closest && e.target.closest('input, select, textarea, [contenteditable], [role="slider"]')) return;
    const r = q('#cg-fig').getBoundingClientRect(); if (r.bottom < 60 || r.top > innerHeight - 40) return;
    e.preventDefault();
    q(e.key === 'ArrowRight' ? '#cg-d' : e.key === 'ArrowUp' ? '#cg-h' : '#cg-r').click();
  });
  return () => { demonter(); S.arreter(); };
}
