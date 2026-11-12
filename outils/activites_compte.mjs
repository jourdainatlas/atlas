// Rubrique Activités (MEMO_atlas_activites.md §141) : fabrique la banque de tirages du « Compte est bon ».
// Usage : node outils/activites_compte.mjs 480 > banque.json   (une seconde par tirage environ ; graine fixe, résultat reproductible)
// Tirage : six nombres, dont un ou deux (rarement trois) parmi 25, 50, 75, 100, les autres parmi 1 à 12 (chacun deux fois au plus), 15 et 20.
// Pour chaque tirage, toutes les suites d'opérations sont énumérées (résultats entiers strictement positifs ; opérations inutiles
// écartées : fois 1, divisé par 1, a − b = b, a ÷ b = b). Chaque calcul est ramené à une forme normale : sommes et produits aplatis,
// opérandes triés. Deux solutions sont identiques quand elles ont la même forme normale.
// Niveaux : 1 = minimum de 3 ou 4 opérations, au moins trois formes ; 2 = minimum 5, au moins trois formes ; 3 = minimum 5, une seule forme.
let graine = 20261112; const rnd = () => (graine = (graine * 1103515245 + 12345) % 2147483648) / 2147483648;
const GRANDS = [25, 50, 75, 100], PETITS = [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 15, 20];
export function tirage() { const u = rnd(), k = u < 0.55 ? 1 : u < 0.92 ? 2 : 3, g = GRANDS.slice(), p = PETITS.slice(), r = [];
  for (let i = 0; i < k; i++) r.push(g.splice(Math.floor(rnd() * g.length), 1)[0]); while (r.length < 6) r.push(p.splice(Math.floor(rnd() * p.length), 1)[0]);
  return r.sort((a, b) => a - b); }
const feuille = v => ({ v, t: 0, key: String(v), n: 0 });
function somme(a, b, moins) { const pa = a.t === 1 ? a.pos : [a.key], na = a.t === 1 ? a.neg : [], pb = b.t === 1 ? b.pos : [b.key], nb = b.t === 1 ? b.neg : [];
  const pos = pa.concat(moins ? nb : pb).sort(), neg = na.concat(moins ? pb : nb).sort();
  return { v: moins ? a.v - b.v : a.v + b.v, t: 1, pos, neg, key: '(' + pos.join('+') + (neg.length ? '-' + neg.join('-') : '') + ')', n: a.n + b.n + 1 }; }
function produit(a, b, div) { const pa = a.t === 2 ? a.pos : [a.key], na = a.t === 2 ? a.neg : [], pb = b.t === 2 ? b.pos : [b.key], nb = b.t === 2 ? b.neg : [];
  const pos = pa.concat(div ? nb : pb).sort(), neg = na.concat(div ? pb : nb).sort();
  return { v: div ? a.v / b.v : a.v * b.v, t: 2, pos, neg, key: '[' + pos.join('*') + (neg.length ? '/' + neg.join('/') : '') + ']', n: a.n + b.n + 1 }; }
// Rend Map but → { formes : ensemble plafonné des formes normales, min : nombre minimal d'opérations }.
export function analyser(plaques, plafond = 4) { const R = new Map();
  const noter = x => { if (x.v < 101 || x.v > 999) return; let e = R.get(x.v); if (!e) R.set(x.v, e = { formes: new Set(), min: 9 }); if (x.n < e.min) e.min = x.n; if (e.formes.size < plafond) e.formes.add(x.key); };
  const rec = L => { const n = L.length;
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let a = L[i], b = L[j]; if (a.v < b.v) { const t = a; a = b; b = t; }
      const reste = []; for (let k = 0; k < n; k++) if (k !== i && k !== j) reste.push(L[k]);
      const C = [somme(a, b, false)]; if (b.v !== 1) C.push(produit(a, b, false)); if (a.v > b.v && a.v - b.v !== b.v) C.push(somme(a, b, true)); if (b.v !== 1 && a.v % b.v === 0 && a.v / b.v !== b.v) C.push(produit(a, b, true));
      for (const c of C) { noter(c); if (reste.length) { reste.push(c); rec(reste); reste.pop(); } } } };
  rec(plaques.map(feuille)); return R; }
if (process.argv[1] && process.argv[1].endsWith('activites_compte.mjs')) { const N = +process.argv[2] || 10, B = [[], [], []], choix = a => a[Math.floor(rnd() * a.length)], vus = new Set();
  for (let k = 0; k < N; k++) { const p = tirage(); if (vus.has(p.join('.'))) continue; vus.add(p.join('.')); const R = analyser(p), c = [[], [], []];
    for (const [v, e] of R) { if (e.min === 5 && e.formes.size === 1) c[2].push(v); else if ((e.min === 3 || e.min === 4) && e.formes.size >= 3) c[0].push(v); else if (e.min === 5 && e.formes.size >= 3) c[1].push(v); }
    for (let n = 0; n < 3; n++) if (c[n].length) { const v = choix(c[n]); B[n].push(p.join('.') + ':' + v + ':' + R.get(v).min); }
    if (k % 40 === 0) process.stderr.write(k + ' ' + B.map(b => b.length).join(',') + '\n'); }
  console.log(JSON.stringify(B)); }
