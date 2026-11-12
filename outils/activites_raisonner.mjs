// Contrôle des pièces de la sous-rubrique « Raisonner » (MEMO_atlas_activites.md §145).
// Usage : node outils/activites_raisonner.mjs
// Démonstrations : toutes les permutations des étapes sont passées à verifier() ; l'ordre écrit doit être accepté, tout intrus refusé,
// toute dépendance doit renvoyer à une étape existante. Les ordres acceptés sont affichés quand il y en a plusieurs, pour relecture.
// Erreurs : chaque raisonnement a exactement une ligne sans justification, et tous ses champs sont remplis.
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const src = join(dirname(fileURLToPath(import.meta.url)), '..', 'activites'), tmp = mkdtempSync(join(tmpdir(), 'raisonner-'));
for (const f of readdirSync(src)) if (f.endsWith('.js')) writeFileSync(join(tmp, f.replace(/\.js$/, '.mjs')), readFileSync(join(src, f), 'utf8').replace(/\.js'/g, ".mjs'"));
const charge = f => import(pathToFileURL(join(tmp, f + '.mjs')).href);
const perms = a => a.length <= 1 ? [a] : a.flatMap((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).map(p => [x, ...p]));
const compte = L => { const c = {}; L.forEach(p => { const k = p.niveau + (p.theme ? '/' + p.theme : ''); c[k] = (c[k] || 0) + 1; }); return JSON.stringify(c); };
let pb = 0; const dit = (...a) => { pb++; console.log('PROBLÈME', ...a); };
const O = await charge('ordonner'), vus = new Set();
for (const P of O.PIECES) { if (vus.has(P.id)) dit('doublon', P.id); vus.add(P.id); const E = P.etapes.map(e => e.id);
  if (P.niveau === 'sup' && !P.theme) dit('thème manquant', P.id);
  for (const e of P.etapes) for (const d in e.dep) if (!E.includes(d)) dit('dépendance inconnue', P.id, e.id, d);
  if (!O.verifier(P, E).ok) dit('ordre écrit refusé', P.id); if (P.intrus.length !== 2) dit('il faut deux intrus', P.id);
  for (const x of P.intrus) if (O.verifier(P, E.concat([x.id])).ok) dit('intrus accepté', P.id);
  const ok = perms(E).filter(L => O.verifier(P, L).ok).map(L => L.join('')); if (ok.length > 1) console.log(P.niveau, P.id, ':', ok.join(' ')); }
console.log('Démonstrations :', O.PIECES.length, compte(O.PIECES));
const R = await charge('erreur'); vus.clear();
for (const P of R.PIECES) { if (vus.has(P.id)) dit('doublon', P.id); vus.add(P.id); if (P.niveau === 'sup' && !P.theme) dit('thème manquant', P.id);
  if (P.lignes.filter(l => !l.ok).length !== 1 || P.lignes[P.faute].ok) dit('une seule ligne fautive attendue', P.id);
  for (const k of ['nom', 'annonce', 'pourquoi', 'retenir', 'indice']) if (!P[k]) dit('champ vide', P.id, k); }
console.log('Erreurs :', R.PIECES.length, compte(R.PIECES)); console.log(pb ? pb + ' problème(s)' : 'Aucun problème.'); process.exit(pb ? 1 : 0);
