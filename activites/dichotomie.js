// Exploration « Valeurs intermédiaires et dichotomie » (rubrique Activités, MEMO_atlas_activites.md §126).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, scene, toile, vue, grille, trait, courbe, etiquette, pastille, ecrire, fr } from './figures.js';

export const css = cssCommun + cssFigures;

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Continuité</p>
  <h3>Valeurs intermédiaires et dichotomie</h3>
  <p class="lede">Une fonction continue qui est négative en un point et positive en un autre s'annule quelque part entre les deux. Ce théorème ne dit pas où. La dichotomie le dit, aussi précisément que l'on veut : elle coupe l'intervalle en deux et garde la moitié où le signe change.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Couper en deux, garder la bonne moitié</h4>
    <p>Choisissez une équation : <span class="chips" id="dc-fn"></span></p>
    <p>La fonction change de signe entre les deux bornes de l'intervalle de départ. On calcule son signe au milieu <i>m</i>. S'il est celui de la borne de gauche, la solution est à droite de <i>m</i>, et l'on remplace la borne de gauche par <i>m</i> ; sinon, on remplace la borne de droite. Avancez étape par étape.</p>
  </div>
  <div class="fig">
    <div class="split">
      <canvas id="dc-fig" class="moyen" aria-label="Courbe de la fonction, intervalle de départ et intervalle obtenu après n étapes de dichotomie"></canvas>
      <div class="side">
        <h5>Les intervalles</h5>
        <table id="dc-tab" aria-label="Intervalles successifs de la dichotomie"><thead><tr><th><i>n</i></th><th>intervalle</th><th>longueur</th></tr></thead><tbody></tbody></table>
        <p class="verdict" id="dc-verdict" aria-live="polite"></p>
      </div>
    </div>
    <div class="reglages">
      <label for="dc-n">étapes <i>n</i></label><input type="range" id="dc-n" min="0" max="30" step="1" value="0"><output id="dc-nv"></output>
    </div>
    <div class="bar"><button type="button" class="primary" id="dc-plus">Une étape de plus</button><button type="button" id="dc-zero">Recommencer</button><label><input type="checkbox" id="dc-zoom"> cadrer sur l'intervalle courant</label></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>La précision se compte</h4>
    <p>À chaque étape, la longueur de l'intervalle est divisée par 2. Après <i>n</i> étapes, la solution est enfermée dans un intervalle de longueur (<i>b</i> − <i>a</i>)/2<sup><i>n</i></sup> : dix étapes divisent l'incertitude par 1 024, vingt étapes par plus d'un million. C'est lent comparé à d'autres méthodes, mais c'est sûr, et l'on sait d'avance combien d'étapes il faudra.</p>
    <p class="def">Théorème des valeurs intermédiaires. Si <i>f</i> est continue sur [<i>a</i> ; <i>b</i>] et si <i>f</i>(<i>a</i>) et <i>f</i>(<i>b</i>) sont de signes contraires, alors il existe au moins un réel <i>c</i> de ]<i>a</i> ; <i>b</i>[ tel que <i>f</i>(<i>c</i>) = 0.</p>
    <p>La dichotomie en est même une démonstration : les bornes de gauche forment une suite croissante, celles de droite une suite décroissante, leur écart tend vers 0, elles ont donc une limite commune <i>c</i>, et la continuité de <i>f</i> force <i>f</i>(<i>c</i>) à être à la fois négatif ou nul et positif ou nul.</p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Sans continuité, la méthode ment</h4>
    <p>Choisissez la dernière fonction, 1/(<i>x</i> − 1,3), sur [1 ; 2]. Elle est négative en 1 et positive en 2, et la dichotomie se déroule sans protester : les intervalles se resserrent autour de 1,3. Mais 1,3 n'est pas une solution : la fonction n'y est pas définie, elle saute de valeurs très négatives à des valeurs très positives sans jamais s'annuler.</p>
  </div>
</section>
` + suite(
  "Appliquer le théorème, ou la méthode, sans vérifier la continuité. Un changement de signe ne prouve l'existence d'une solution que pour une fonction continue sur tout l'intervalle : 1/(<i>x</i> − 1,3) change de signe entre 1 et 2 et ne s'annule nulle part. L'autre oubli : le théorème donne <em>au moins</em> une solution ; pour affirmer qu'il n'y en a qu'une, il faut un argument de plus, en général la stricte monotonie.",
  "Le chapitre de Terminale <a href=\"#cours/t-03\">Fonctions numériques</a> énonce le théorème et son corollaire pour les fonctions strictement monotones, et celui de Maths Sup <a href=\"#cours/ma-08\">Limites et continuité</a> le démontre. Dans l'édifice : <a href=\"#continuite.c-tvi\">Théorème des valeurs intermédiaires</a>.",
  "Les bornes sont obtenues en prenant des milieux successifs à partir de bornes entières : ce sont des nombres que la machine représente exactement, jusqu'aux trente étapes proposées. Seul le signe de la fonction au milieu est calculé en valeur approchée. Les affichages sont arrondis à 10⁻⁹ au plus. Rien n'est enregistré ni envoyé.");

const FN = [
  { nom: 'x³ − 2x − 5 = 0', f: x => x * x * x - 2 * x - 5, a: 2, b: 3, y: [-2.5, 17], continu: true },
  { nom: 'cos x = x', f: x => Math.cos(x) - x, a: 0, b: 1, y: [-0.7, 1.2], continu: true },
  { nom: 'x² = 2', f: x => x * x - 2, a: 1, b: 2, y: [-1.4, 2.4], continu: true },
  { nom: '1/(x − 1,3) = 0', f: x => 1 / (x - 1.3), a: 1, b: 2, y: [-9, 9], continu: false, pole: 1.3 },
];

export function monter(racine) {
  const q = s => racine.querySelector(s);
  const E = { fn: 0, n: 0, zoom: false };
  FN.forEach((F, i) => { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = F.nom;
    b.addEventListener('click', () => { E.fn = i; E.n = 0; S.planifier(); }); q('#dc-fn').append(b); });
  q('#dc-n').addEventListener('input', e => { E.n = +e.target.value; S.planifier(); });
  q('#dc-plus').addEventListener('click', () => { if (E.n < 30) E.n++; S.planifier(); });
  q('#dc-zero').addEventListener('click', () => { E.n = 0; S.planifier(); });
  q('#dc-zoom').addEventListener('change', e => { E.zoom = e.target.checked; S.planifier(); });
  function rendre(C) {
    const F = FN[E.fn], f = F.f, suiteI = [[F.a, F.b]]; let a = F.a, b = F.b; const sa = Math.sign(f(a));
    for (let i = 0; i < E.n; i++) { const m = (a + b) / 2; if (Math.sign(f(m)) === sa) a = m; else b = m; suiteI.push([a, b]); }
    const { ctx, w, h } = toile(q('#dc-fig')), L = F.b - F.a;
    let v;
    if (E.zoom && E.n > 0) { const l = b - a, c = (a + b) / 2; let lo = Infinity, hi = -Infinity; for (let i = 0; i <= 40; i++) { const y = f(c - l + 2 * l * i / 40); if (isFinite(y) && Math.abs(y) < 1e6) { lo = Math.min(lo, y); hi = Math.max(hi, y); } }
      if (!(hi > lo)) { lo = -1; hi = 1; } const mg = (hi - lo) * 0.15 || 1; v = vue(w, h, c - l, c + l, Math.min(lo, 0) - mg, Math.max(hi, 0) + mg); }
    else v = vue(w, h, F.a - 0.12 * L, F.b + 0.12 * L, F.y[0], F.y[1]);
    grille(ctx, v, C, false, E.zoom && E.n > 8);
    ctx.globalAlpha = .18; ctx.fillStyle = C.vert; ctx.fillRect(v.X(a), 0, Math.max(2, v.X(b) - v.X(a)), h); ctx.globalAlpha = 1;
    ctx.strokeStyle = C.vert; ctx.lineWidth = 2; trait(ctx, v.X(a), 0, v.X(a), h); trait(ctx, v.X(b), 0, v.X(b), h);
    courbe(ctx, v, f, C.encre, 2.6, null, F.pole !== undefined ? [F.pole] : []);
    const m = (a + b) / 2, fm = f(m); if (isFinite(fm)) pastille(ctx, v.X(m), Math.max(-20, Math.min(h + 20, v.Y(fm))), C.orange, 5);
    etiquette(ctx, C, 'm', v.X(m), 12, C.orange, 'center', 12);
    racine.querySelectorAll('#dc-fn .chip').forEach((bt, i) => bt.setAttribute('aria-pressed', String(i === E.fn)));
    if (+q('#dc-n').value !== E.n) q('#dc-n').value = E.n; ecrire(q('#dc-nv'), String(E.n));
    if (q('#dc-zoom').checked !== E.zoom) q('#dc-zoom').checked = E.zoom;
    const dec = n => Math.min(9, Math.max(2, Math.ceil(n * 0.302) + 1));
    const deb = Math.max(0, E.n - 6); let lignes = '';
    for (let i = deb; i <= E.n; i++) { const [u, t] = suiteI[i], d = dec(i); lignes += `<tr${i === E.n ? ' class="now"' : ''}><td>${i}</td><td>[${fr(u, d)} ; ${fr(t, d)}]</td><td>${i === 0 ? fr(t - u, 0) : '1/2' + (i > 1 ? '<sup>' + i + '</sup>' : '') + (L !== 1 ? ' × ' + L : '')}</td></tr>`; }
    ecrire(q('#dc-tab').tBodies[0], lignes, true);
    const d = dec(E.n);
    ecrire(q('#dc-verdict'), F.continu
      ? `Après ${E.n} étape${E.n > 1 ? 's' : ''}, une solution est comprise entre ${fr(a, d)} et ${fr(b, d)} : elle est connue à ${(b - a).toExponential(1).replace('.', ',').replace('e-', ' × 10⁻').replace(/⁻(\d+)$/, (_, k) => '⁻' + [...k].map(c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[+c]).join('')).replace('e+0', '')} près.`
      : `Après ${E.n} étape${E.n > 1 ? 's' : ''}, l'intervalle est [${fr(a, d)} ; ${fr(b, d)}] : il se resserre autour de 1,3, où la fonction n'est pas définie. Il n'y a aucune solution ; la méthode n'a rien remarqué, parce que la fonction n'est pas continue sur [1 ; 2].`);
  }
  const S = scene(racine, rendre);
  return S.arreter;
}
