// Exploration « Les nombres de Catalan » (rubrique Activités, MEMO_atlas_activites.md §131).
import { css as cssCommun, bac } from './commun.js';
import { cssFigures, suite, scene, toile, trait, etiquette, pastille, ecrire } from './figures.js';

export const css = cssCommun + cssFigures + `
.activites-act .ca-gal { display: flex; flex-wrap: wrap; gap: 6px; padding: 12px 16px; border-top: 1px solid var(--filet); }
.activites-act .ca-gal button { padding: 3px; border: 1px solid var(--filet); border-radius: 6px; background: var(--surface); cursor: pointer; line-height: 0; }
.activites-act .ca-gal button[aria-pressed="true"] { border-color: var(--sec); box-shadow: 0 0 0 2px color-mix(in srgb, var(--sec) 35%, transparent); }
.activites-act .ca-gal svg { width: 58px; height: 30px; fill: none; stroke: var(--encre); stroke-width: 1.6; stroke-linejoin: round; }
`;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Dénombrement</p>
  <h3>Les nombres de Catalan</h3>
  <p class="lede">1, 2, 5, 14, 42, 132… Ces nombres comptent les façons d'écrire des parenthèses correctement, les profils de montagne qui ne passent jamais sous le niveau de la mer, et bien d'autres choses. Leur formule se démontre par un tour de passe-passe géométrique : une symétrie.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Des montagnes et des parenthèses</h4>
    <p>Un chemin part du niveau 0, fait ${K('n')} pas montants et ${K('n')} pas descendants, et revient donc au niveau 0. C'est un <b>chemin de Dyck</b> s'il ne passe jamais sous le niveau 0. En lisant « ( » pour un pas montant et « ) » pour un pas descendant, on obtient exactement les écritures correctes de ${K('n')} paires de parenthèses. Tracez un chemin avec les boutons, ou avec les flèches ↑ et ↓ du clavier (← efface un pas).</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="ca-fig" class="moyen" aria-label="Chemin tracé pas à pas, montant ou descendant, entre le départ et l'arrivée au niveau 0"></canvas>
      <div class="side">
        <h5>Le chemin</h5>
        <p class="verdict" id="ca-mot" style="font-family:var(--f-mono);font-size:1.05rem;letter-spacing:.08em;overflow-wrap:anywhere" aria-live="polite"></p>
        <p class="verdict" id="ca-verdict" aria-live="polite"></p>
        <dl class="lectures" aria-live="polite">
          <dt>chemins de Dyck</dt><dd id="ca-cn"></dd>
          <dt>chemins quelconques</dt><dd id="ca-tous"></dd>
          <dt>chemins qui passent sous 0</dt><dd id="ca-mauvais"></dd>
        </dl>
      </div>
    </div>
    <div class="reglages">
      <label for="ca-n">paires <i>n</i></label><input type="range" id="ca-n" min="1" max="8" step="1" value="4"><output id="ca-nv"></output>
    </div>
    <div class="bar"><button type="button" class="primary" id="ca-h">↗ Monter</button><button type="button" class="primary" id="ca-b">↘ Descendre</button><button type="button" id="ca-r">Effacer un pas</button><button type="button" id="ca-e">Recommencer</button><button type="button" id="ca-a">Au hasard</button><label><input type="checkbox" id="ca-libre"> autoriser à passer sous 0</label></div>
    <div class="ca-gal" id="ca-gal" role="group" aria-label="Tous les chemins de Dyck pour ce nombre de paires"></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Compter par une symétrie</h4>
    <p>Les chemins quelconques de ${K('n')} montées et ${K('n')} descentes sont au nombre de ${K('\\binom{2n}{n}')} : on choisit la place des montées. Il faut en retirer les mauvais, ceux qui passent sous 0. Cochez « autoriser à passer sous 0 » et tracez-en un.</p>
    <p>Un mauvais chemin touche le niveau −1. À partir du premier instant où il le touche, remplaçons chaque montée par une descente et inversement : la suite du chemin est remplacée par son symétrique par rapport à la droite de niveau −1, tracé en <b style="color:var(--semi)">violet</b>. Le chemin initial finissait au niveau 0 ; le chemin transformé finit au niveau −2. Il a donc ${K('n-1')} montées et ${K('n+1')} descentes.</p>
    <p>Cette transformation est une bijection entre les mauvais chemins et <em>tous</em> les chemins de ${K('n-1')} montées et ${K('n+1')} descentes : un tel chemin finit en −2, il touche donc forcément −1, et la même symétrie, appliquée à partir du premier contact, redonne le chemin de départ. Il y a donc ${K('\\binom{2n}{n+1}')} mauvais chemins.</p>
    <div class="def"><p>Le nombre de chemins de Dyck de longueur ${K('2n')} est le nombre de Catalan</p>${KD('C_n = \\binom{2n}{n} - \\binom{2n}{n+1} = \\frac{1}{n+1}\\binom{2n}{n}.')}</div>
    <p>La seconde égalité est un calcul : ${K('\\binom{2n}{n+1} = \\dfrac{n}{n+1}\\binom{2n}{n}')}.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Une récurrence, par le premier retour</h4>
    <p>Un chemin de Dyck non vide commence par monter, et revient au niveau 0 une première fois. Entre les deux, il dessine un chemin de Dyck surélevé d'un cran ; après, un autre chemin de Dyck. Si le premier a ${K('k')} paires, le second en a ${K('n-k')}, d'où</p>
    <div class="def">${KD('C_{n+1} = \\sum_{k=0}^{n} C_k\\,C_{n-k}, \\qquad C_0 = 1.')}</div>
    <p id="ca-rec" aria-live="polite"></p>
    <p>C'est cette récurrence qui explique que les mêmes nombres comptent tant d'objets : les triangulations d'un polygone, les arbres binaires, les façons de parenthéser un produit. Chacun se découpe en deux objets plus petits de même nature.</p>
  </div>
</section>
` + suite(
  "Croire qu'il suffit d'avoir autant de parenthèses ouvrantes que fermantes. « ) ( » en a une de chaque, et ce n'est pas une écriture correcte : il faut en plus qu'à chaque instant de la lecture, on ait ouvert au moins autant de parenthèses qu'on en a fermé. Pour deux paires, il y a 6 mots de deux « ( » et deux « ) », et seulement 2 écritures correctes : « ( ( ) ) » et « ( ) ( ) ».",
  "Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> établit les coefficients binomiaux utilisés ici, et l'exploration <a href=\"#activites/chemins-grille\">Chemins sur une grille</a> les fait retrouver. Dans l'édifice : <a href=\"#rel.r-injections\">Injections, surjections, bijections</a>, puisque toute la démonstration repose sur une bijection.",
  "Les nombres de Catalan sont calculés par la récurrence, en entiers exacts, et comparés à la formule. La page énumère tous les chemins de Dyck jusqu'à quatre paires (14 chemins) pour la galerie ; « Au hasard » tire un chemin uniformément parmi les chemins de Dyck. Rien n'est enregistré ni envoyé.");

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { n: 4, mot: [], libre: false };   // mot : suite de +1 et −1
  const Cat = [1]; for (let m = 0; m < 9; m++) { let s = 0; for (let k = 0; k <= m; k++) s += Cat[k] * Cat[m - k]; Cat.push(s); }
  const bin = (a, b) => { if (b < 0 || b > a) return 0; let r = 1; for (let i = 1; i <= b; i++) r = r * (a - b + i) / i; return Math.round(r); };
  const ent = x => x.toLocaleString('fr-FR').replace(/[  ]/g, ' ');
  const niveau = () => E.mot.reduce((a, b) => a + b, 0), montees = () => E.mot.filter(x => x > 0).length;
  const peut = d => { const up = montees(), dn = E.mot.length - up; if (d > 0) return up < E.n; return dn < E.n && (E.libre || niveau() > 0); };
  const tous = n => { const o = []; (function f(m, h, u) { if (m.length === 2 * n) { o.push(m); return; } if (u < n) f(m.concat(1), h + 1, u + 1); if (h > 0) f(m.concat(-1), h - 1, u); })([], 0, 0); return o; };
  q('#ca-n').addEventListener('input', e => { E.n = +e.target.value; E.mot = []; S.planifier(); });
  q('#ca-h').addEventListener('click', () => { if (peut(1)) E.mot.push(1); S.planifier(); });
  q('#ca-b').addEventListener('click', () => { if (peut(-1)) E.mot.push(-1); S.planifier(); });
  q('#ca-r').addEventListener('click', () => { E.mot.pop(); S.planifier(); });
  q('#ca-e').addEventListener('click', () => { E.mot = []; S.planifier(); });
  q('#ca-libre').addEventListener('change', e => { E.libre = e.target.checked; if (!E.libre) { let h = 0, k = 0; for (; k < E.mot.length; k++) { h += E.mot[k]; if (h < 0) break; } E.mot = E.mot.slice(0, k); } S.planifier(); });
  q('#ca-a').addEventListener('click', () => {   // tirage uniforme : à chaque pas, proportionnellement au nombre de fins possibles
    const n = E.n, fin = (h, r) => { /* nombre de façons de finir en r pas depuis la hauteur h sans passer sous 0 */ if (h < 0 || h > r || (r - h) % 2) return 0; const u = (r - h) / 2; return bin(r, u) - bin(r, u - 1); };
    E.mot = []; let h = 0; for (let r = 2 * n; r > 0; r--) { const a = fin(h + 1, r - 1), b = fin(h - 1, r - 1); if (Math.random() * (a + b) < a) { E.mot.push(1); h++; } else { E.mot.push(-1); h--; } } S.planifier(); });
  q('#ca-gal').addEventListener('click', e => { const b = e.target.closest('button[data-m]'); if (!b) return; E.mot = b.dataset.m.split('').map(c => c === '(' ? 1 : -1); S.planifier(); });
  function rendre(C) {
    let H = [0], contact = -1; E.mot.forEach((d, k) => { H.push(H[k] + d); if (contact < 0 && H[k + 1] === -1) contact = k + 1; });
    const creux = Math.min(...H, ...(contact >= 0 ? H.slice(contact).map(y => -2 - y) : [0]));   // point le plus bas, chemin et symétrique
    const n = E.n, { ctx, w, h } = toile(q('#ca-fig')), mg = 30, bas = E.libre ? Math.max(2, -creux) + 0.4 : 0.6, pas = Math.min((w - 2 * mg) / (2 * n), (h - 2 * mg) / (n + bas));
    const x0 = (w - 2 * n * pas) / 2, y0 = mg + n * pas + (h - 2 * mg - (n + bas) * pas) / 2, X = i => x0 + i * pas, Y = j => y0 - j * pas;
    ctx.strokeStyle = C.filet; ctx.lineWidth = 1; for (let i = 0; i <= 2 * n; i++) trait(ctx, X(i), Y(n), X(i), Y(-bas)); for (let j = E.libre ? -Math.floor(bas) : 0; j <= n; j++) trait(ctx, X(0), Y(j), X(2 * n), Y(j));
    ctx.strokeStyle = C.filetFort; ctx.lineWidth = 2; trait(ctx, X(0), Y(0), X(2 * n), Y(0));
    if (E.libre) { ctx.strokeStyle = C.violet; ctx.lineWidth = 1.2; ctx.setLineDash([5, 4]); trait(ctx, X(0), Y(-1), X(2 * n), Y(-1)); ctx.setLineDash([]); etiquette(ctx, C, 'niveau −1', X(2 * n) - 2, Y(-1) + 11, C.violet, 'right', 11); }
    if (contact >= 0) { ctx.strokeStyle = C.violet; ctx.lineWidth = 3; ctx.setLineDash([7, 5]); ctx.beginPath(); ctx.moveTo(X(contact), Y(-1)); for (let k = contact + 1; k < H.length; k++) ctx.lineTo(X(k), Y(-2 - H[k])); ctx.stroke(); ctx.setLineDash([]); pastille(ctx, X(H.length - 1), Y(-2 - H[H.length - 1]), C.violet, 5); pastille(ctx, X(contact), Y(-1), C.violet, 5); }
    ctx.strokeStyle = C.orange; ctx.lineWidth = 4; ctx.beginPath(); H.forEach((y, k) => k ? ctx.lineTo(X(k), Y(y)) : ctx.moveTo(X(k), Y(y))); ctx.stroke();
    pastille(ctx, X(H.length - 1), Y(H[H.length - 1]), C.orange, 6);
    etiquette(ctx, C, 'départ', X(0), Y(0) + 16, C.doux, 'left', 11); etiquette(ctx, C, 'arrivée', X(2 * n), Y(0) + 16, C.doux, 'right', 11);
    if (+q('#ca-n').value !== n) q('#ca-n').value = n; ecrire(q('#ca-nv'), String(n));
    q('#ca-h').disabled = !peut(1); q('#ca-b').disabled = !peut(-1); q('#ca-r').disabled = !E.mot.length; if (q('#ca-libre').checked !== E.libre) q('#ca-libre').checked = E.libre;
    const fini = E.mot.length === 2 * n, texte = E.mot.map(d => d > 0 ? '(' : ')').join('');
    ecrire(q('#ca-mot'), texte || '(aucun pas)');
    ecrire(q('#ca-verdict'), !fini ? (contact >= 0 ? 'Le chemin est passé sous 0 : ce n\'est plus un chemin de Dyck. En violet, son transformé par la symétrie.' : `Encore ${2 * n - E.mot.length} pas. Niveau actuel : ${H[H.length - 1]}.`)
      : contact >= 0 ? 'Mauvais chemin : il passe sous 0. Son transformé, en violet, finit au niveau −2.' : 'C\'est un chemin de Dyck, et le mot est une écriture correcte de parenthèses.');
    ecrire(q('#ca-cn'), `C${[...String(n)].map(c => '₀₁₂₃₄₅₆₇₈₉'[+c]).join('')} = ${ent(Cat[n]).replace(/ /g, ' ')}`); ecrire(q('#ca-tous'), ent(bin(2 * n, n))); ecrire(q('#ca-mauvais'), ent(bin(2 * n, n + 1)).replace(/ /g, ' '));
    const G = q('#ca-gal'), cle = n <= 4 ? String(n) : '';
    if (G.dataset.n !== cle) { G.dataset.n = cle; G.innerHTML = n <= 4 ? tous(n).map(m => { let y = 0, d = 'M2 ' + (28).toFixed(0); const px = 54 / (2 * n), py = Math.min(px, 24 / n); m.forEach((s, k) => { y += s; d += `L${(2 + (k + 1) * px).toFixed(1)} ${(28 - y * py).toFixed(1)}`; }); const t = m.map(s => s > 0 ? '(' : ')').join('');
      return `<button type="button" data-m="${t}" aria-label="Chemin ${t.split('').join(' ')}"><svg viewBox="0 0 58 30" aria-hidden="true"><path d="${d}"/></svg></button>`; }).join('') : `<span style="font:13px/1.4 var(--f-ui);color:var(--encre-2)">Il y a ${ent(Cat[n])} chemins de Dyck pour ${n} paires : la galerie n'est affichée que jusqu'à 4 paires.</span>`; }
    G.querySelectorAll('button[data-m]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === texte)));
    ecrire(q('#ca-rec'), `Pour n = ${n} : C${'₀₁₂₃₄₅₆₇₈₉'[n]} = ` + Array.from({ length: n }, (_, k) => `${Cat[k]} × ${Cat[n - 1 - k]}`).join(' + ') + ` = ${ent(Cat[n])}.`);
  }
  const S = scene(racine, rendre);
  const { window: fenetre, demonter } = bac();
  fenetre.addEventListener('keydown', e => {
    if (e.altKey || e.ctrlKey || e.metaKey || !/^(ArrowDown|ArrowUp|ArrowLeft|Backspace)$/.test(e.key)) return;
    if (e.target && e.target.closest && e.target.closest('input, select, textarea, [contenteditable], [role="slider"]')) return;
    const r = q('#ca-fig').getBoundingClientRect(); if (r.bottom < 60 || r.top > innerHeight - 40) return;
    e.preventDefault(); q(e.key === 'ArrowUp' ? '#ca-h' : e.key === 'ArrowDown' ? '#ca-b' : '#ca-r').click();
  });
  return () => { demonter(); S.arreter(); };
}
