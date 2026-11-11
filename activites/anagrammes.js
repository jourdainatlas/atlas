// Exploration « Les anagrammes » (rubrique Activités, MEMO_atlas_activites.md §133).
import { css as cssCommun } from './commun.js';
import { cssFigures, suite, ecrire } from './figures.js';

export const css = cssCommun + cssFigures + `
.activites-act .ag-saisie { display: flex; flex-wrap: wrap; gap: 10px 14px; align-items: center; padding: 14px 16px; }
.activites-act .ag-saisie input[type=text] { font: 600 20px var(--f-mono); letter-spacing: .12em; text-transform: uppercase; padding: 6px 10px; width: min(100%, 15ch); color: var(--encre); background: var(--papier); border: 1px solid var(--encre-3); border-radius: 6px; }
.activites-act .ag-lettres { display: flex; flex-wrap: wrap; gap: 6px; padding: 0 16px 12px; }
.activites-act .ag-lettres span { display: inline-flex; flex-direction: column; align-items: center; min-width: 34px; padding: 4px 6px; border-radius: 6px; border: 1px solid var(--filet); font: 700 20px var(--f-mono); }
.activites-act .ag-lettres span small { font: 500 11px var(--f-ui); color: var(--encre-2); }
.activites-act .ag-lettres span.rep { border-color: var(--sec); color: var(--sec); }
.activites-act .ag-liste { display: flex; flex-wrap: wrap; gap: 4px 12px; padding: 12px 16px; border-top: 1px solid var(--filet); font: 13.5px/1.5 var(--f-mono); max-height: 240px; overflow-y: auto; }
.activites-act .ag-classes { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 8px; padding: 12px 16px; border-top: 1px solid var(--filet); }
.activites-act .ag-classes div { border: 1px solid var(--filet); border-radius: 6px; padding: 6px 8px; font: 13px/1.5 var(--f-mono); }
.activites-act .ag-classes div b { display: block; font-size: 15px; color: var(--mark); }
.activites-act .ag-classes sub { font-size: .82em; color: var(--sec); }
`;
const K = t => '<span class="kx">' + t + '</span>', KD = t => '<span class="kx kxd">' + t + '</span>';

export const html = `
<header class="col">
  <p class="eyebrow">Terminale, Maths Sup · Dénombrement</p>
  <h3>Les anagrammes</h3>
  <p class="lede">Combien de mots, ayant un sens ou non, peut-on écrire avec les lettres de MATHS ? Et avec celles d'ANANAS ? Tant que les lettres sont toutes différentes, la réponse est une factorielle. Dès qu'une lettre se répète, on compte trop, et il faut savoir exactement de combien.</p>
</header>

<section>
  <div class="col">
    <h4><span class="n">1</span>Un mot, ses lettres, ses anagrammes</h4>
    <p>Écrivez un mot de douze lettres au plus, ou choisissez un exemple. La page compte ses lettres, signale en orange celles qui se répètent, calcule le nombre d'anagrammes et en dresse la liste quand elle n'est pas trop longue.</p>
  </div>
  <div class="fig">
    <div class="ag-saisie"><label for="ag-mot">Mot</label><input type="text" id="ag-mot" maxlength="12" value="ANANAS" autocomplete="off" spellcheck="false"><span class="chips" id="ag-ex"></span><button type="button" id="ag-mel">Une anagramme au hasard</button><b id="ag-hasard" style="font:600 18px var(--f-mono);letter-spacing:.1em" aria-live="polite"></b></div>
    <div class="ag-lettres" id="ag-lettres" aria-label="Lettres du mot et nombre d'occurrences"></div>
    <p class="verdict" id="ag-calcul" aria-live="polite" style="padding:0 16px 12px;margin:0"></p>
    <div class="ag-liste" id="ag-liste" aria-label="Liste des anagrammes"></div>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">2</span>Compter trop, puis corriger</h4>
    <p>Rendons provisoirement les lettres toutes différentes, en numérotant celles qui se répètent : A₁, A₂, A₃. Un mot de ${K('n')} lettres numérotées a ${K('n!')} rangements. Effaçons maintenant les numéros : plusieurs rangements donnent le même mot. Combien exactement ? Autant qu'il y a de façons de permuter entre elles les lettres identiques sans changer le mot : ${K('m!')} pour une lettre présente ${K('m')} fois, et le produit de ces factorielles s'il y a plusieurs lettres répétées.</p>
    <div class="def"><p>Un mot de ${K('n')} lettres, dont les lettres distinctes apparaissent ${K('m_1, m_2, \\dots, m_k')} fois, a</p>${KD('\\frac{n!}{m_1!\\,m_2!\\cdots m_k!}')}<p>anagrammes, lui-même compris.</p></div>
    <p>C'est le principe des bergers : pour compter les moutons, on compte les pattes et l'on divise par quatre, à condition que chaque mouton ait bien le même nombre de pattes. Ici, chaque mot provient du même nombre de rangements numérotés. La figure ci-dessous le montre sur un mot court : chaque case est un mot, et contient tous les rangements numérotés qui le donnent.</p>
  </div>
  <div class="fig">
    <div class="ag-saisie"><span>Mot court : <span class="chips" id="ag-court"></span></span></div>
    <div class="ag-classes" id="ag-classes"></div>
    <p class="verdict" id="ag-classes-bilan" aria-live="polite" style="padding:0 16px 12px;margin:0"></p>
  </div>
</section>

<section>
  <div class="col">
    <h4><span class="n">3</span>Le lien avec les coefficients binomiaux</h4>
    <p>Un mot fait de ${K('p')} lettres A et de ${K('n - p')} lettres B a ${K('\\dfrac{n!}{p!\\,(n-p)!} = \\dbinom{n}{p}')} anagrammes : c'est choisir, parmi les ${K('n')} places, les ${K('p')} qui recevront un A. La formule des anagrammes généralise donc les coefficients binomiaux à plus de deux lettres ; on parle de coefficients multinomiaux. Essayez AABBB : dix anagrammes, comme ${K('\\dbinom52')}.</p>
  </div>
</section>
` + suite(
  "Diviser par le nombre de répétitions au lieu de sa factorielle. Pour ELEVE, cinq lettres dont trois E, la réponse n'est pas 5!/3 = 40 mais 5!/3! = 20 : les trois E numérotés peuvent être rangés entre eux de 3! = 6 façons, et non de 3. L'autre erreur est d'oublier une des lettres répétées : ANANAS a trois A <em>et</em> deux N, donc 6!/(3! × 2!) = 60 anagrammes, et non 120.",
  "Le chapitre de Terminale <a href=\"#cours/t-07\">Dénombrement</a> compte les permutations et les combinaisons ; l'exploration <a href=\"#activites/chemins-grille\">Chemins sur une grille</a> traite le cas de deux lettres. Dans l'édifice : <a href=\"#v-det.v-permutations\">Groupe symétrique et signature</a> pour les permutations, et <a href=\"#z-polynomes.pol-binome\">la formule du binôme</a> pour les coefficients binomiaux.",
  "Le nombre d'anagrammes est calculé en entiers exacts (au plus 12! = 479 001 600). La liste complète est produite par énumération, sans doublon, quand elle compte au plus 360 mots ; au-delà, seuls les 120 premiers dans l'ordre alphabétique sont affichés. Les accents sont retirés et seules les lettres sont gardées. Rien n'est enregistré ni envoyé.");

const fact = n => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
const ent = x => x.toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ');
const propre = t => t.normalize('NFD').replace(/[^A-Za-z]/g, '').toUpperCase().slice(0, 12);
const compter = m => { const c = new Map(); for (const l of m) c.set(l, (c.get(l) || 0) + 1); return [...c].sort((a, b) => a[0] < b[0] ? -1 : 1); };
// anagrammes distinctes dans l'ordre alphabétique, au plus max
function lister(m, max) { const C = compter(m), n = m.length, o = [], cur = [];
  (function f() { if (o.length >= max) return; if (cur.length === n) { o.push(cur.join('')); return; } for (const e of C) if (e[1] > 0) { e[1]--; cur.push(e[0]); f(); cur.pop(); e[1]++; if (o.length >= max) return; } })(); return o; }

export function monter(racine) {
  const q = s => racine.querySelector(s);
  let mot = 'ANANAS', court = 'ANA', hasard = '', vivant = true;
  for (const ex of ['MATHS', 'ANANAS', 'ELEVE', 'BANANE', 'AABBB', 'MISSISSIPPI']) { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = ex; b.addEventListener('click', () => { mot = ex; hasard = ''; q('#ag-mot').value = ex; rendre(); }); q('#ag-ex').append(b); }
  for (const ex of ['ANA', 'ETE', 'OTTO', 'ELLE', 'NON', 'ABC']) { const b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = ex; b.dataset.m = ex; b.addEventListener('click', () => { court = ex; rendre(); }); q('#ag-court').append(b); }
  q('#ag-mot').addEventListener('input', e => { mot = propre(e.target.value); hasard = ''; rendre(); });
  q('#ag-mel').addEventListener('click', () => { const a = mot.split(''); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } hasard = a.join(''); rendre(); });
  function rendre() {
    if (!vivant) return;
    const C = compter(mot), n = mot.length, den = C.reduce((p, [, m]) => p * fact(m), 1), nb = n ? fact(n) / den : 0, rep = C.filter(([, m]) => m > 1);
    ecrire(q('#ag-lettres'), C.map(([l, m]) => `<span${m > 1 ? ' class="rep"' : ''}>${l}<small>× ${m}</small></span>`).join(''), true);
    ecrire(q('#ag-hasard'), hasard);
    ecrire(q('#ag-calcul'), !n ? 'Écrivez un mot.' : rep.length ? `${n} lettres, dont ${rep.map(([l, m]) => `${m} ${l}`).join(', ')} : ${n}! / ${rep.length > 1 ? '(' : ''}${rep.map(([, m]) => m + '!').join(' × ')}${rep.length > 1 ? ')' : ''} = ${ent(fact(n))} / ${ent(den)} = ${ent(nb)} anagrammes.` : `${n} lettre${n > 1 ? 's' : ''} toutes différentes : ${n}! = ${ent(nb)} anagramme${nb > 1 ? 's' : ''}.`);
    const L = n ? lister(mot, nb <= 360 ? 360 : 120) : [];
    ecrire(q('#ag-liste'), L.map(x => `<span>${x === mot ? '<b>' + x + '</b>' : x}</span>`).join('') + (nb > L.length ? `<span>… et ${ent(nb - L.length)} autres.</span>` : ''), true);
    // classes de rangements numérotés pour le mot court
    racine.querySelectorAll('#ag-court .chip').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === court)));
    const k = court.length, vus = new Map(), ind = '₁₂₃₄', num = []; { const c = {}; for (const l of court) { c[l] = (c[l] || 0) + 1; num.push(c[l]); } }
    const multi = l => court.split('').filter(x => x === l).length > 1;
    (function perm(a, reste) { if (!reste.length) { const w = a.map(i => court[i]).join(''); if (!vus.has(w)) vus.set(w, []); vus.get(w).push(a.map(i => court[i] + (multi(court[i]) ? `<sub>${ind[num[i] - 1]}</sub>` : '')).join('')); return; } reste.forEach((i, p) => perm(a.concat(i), reste.slice(0, p).concat(reste.slice(p + 1)))); })([], [...Array(k).keys()]);
    const cl = [...vus].sort((a, b) => a[0] < b[0] ? -1 : 1);
    ecrire(q('#ag-classes'), cl.map(([w, r]) => `<div><b>${w}</b>${r.join(' · ')}</div>`).join(''), true);
    ecrire(q('#ag-classes-bilan'), `${court} : ${fact(k)} rangements numérotés, répartis en ${cl.length} case${cl.length > 1 ? 's' : ''} de ${cl[0][1].length} rangement${cl[0][1].length > 1 ? 's' : ''} chacune. Donc ${fact(k)} / ${cl[0][1].length} = ${cl.length} anagramme${cl.length > 1 ? 's' : ''}.`);
  }
  rendre();
  return () => { vivant = false; };
}
