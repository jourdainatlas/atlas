// Contrôle des pièces de la sous-rubrique « Raisonner » (MEMO_atlas_activites.md §145).
// Usage : node outils/activites_raisonner.mjs
// Démonstrations : toutes les permutations des étapes sont passées à verifier() ; l'ordre écrit doit être accepté, tout intrus refusé,
// toute dépendance doit renvoyer à une étape existante. Les ordres acceptés sont affichés quand il y en a plusieurs, pour relecture.
// Erreurs : chaque raisonnement a exactement une ligne sans justification, et tous ses champs sont remplis.
import { mkdtempSync, readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
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
console.log('Erreurs :', R.PIECES.length, compte(R.PIECES));
// Implications et contre-exemples (§151) : identifiants uniques, thème en Maths Sup, une seule bonne réponse parmi quatre, justifications présentes.
const I = await charge('implication'); vus.clear();
for (const P of I.PIECES) { if (vus.has(P.id)) dit('doublon', P.id); vus.add(P.id); if (P.niveau === 'sup' && !P.theme) dit('thème manquant', P.id); if (!P.nom || !P.cadre || !P.A || !P.B || !P.d.t || !P.r.t || !'dgen'.includes(P.rep)) dit('implication incomplète', P.id); }
console.log('Implications :', I.PIECES.length, compte(I.PIECES));
const C = await charge('contre-exemple'); vus.clear();
for (const P of C.PIECES) { if (vus.has(P.id)) dit('doublon', P.id); vus.add(P.id); if (P.niveau === 'sup' && !P.theme) dit('thème manquant', P.id); if (P.choix.length !== 4 || P.choix.filter(c => c.bon).length !== 1 || P.choix.some(c => !c.t || !c.pourquoi) || !P.retenir) dit('contre-exemple mal formé', P.id); }
console.log('Contre-exemples :', C.PIECES.length, compte(C.PIECES));
// Dix calculs : chaque fabrique donne quatre réponses distinctes, sans valeur indéfinie, et de quoi faire une série de dix.
const S = await charge('serie-calculs'); let nq = 0;
for (const niv in S.FAMILLES) { for (const [id, , g] of S.FAMILLES[niv]) { for (let i = 0; i < 500; i++) { const x = g(); if (!x) continue; nq++; if (x.choix.length !== 4 || new Set(x.choix).size !== 4 || x.bon < 0 || x.bon > 3 || /NaN|undefined|Infinity|null/.test(x.q + x.choix.join(''))) dit('calcul mal formé', niv, id, x.q); } if (S.serie(niv, id).length !== 10) dit('série incomplète', niv, id); } if (S.serie(niv, 'melange').length !== 10) dit('mélange incomplet', niv); }
console.log('Dix calculs :', Object.values(S.FAMILLES).reduce((a, f) => a + f.length, 0), 'familles,', nq, 'calculs essayés'); // Registre des relectures (§156) : toute pièce et toute fabrique doit avoir été relue par un agent indépendant dans son état actuel.
// L'empreinte est celle du contenu : une pièce modifiée redevient « à relire ». Après relecture et corrections : node outils/activites_raisonner.mjs --relu
const REG = join(dirname(fileURLToPath(import.meta.url)), 'activites_relectures.json'), h = x => createHash('sha256').update(x).digest('hex').slice(0, 12);
const etat = { ordonner: {}, erreur: {}, implication: {}, 'contre-exemple': {}, serie: {} };
for (const [k, M] of [['ordonner', O], ['erreur', R], ['implication', I], ['contre-exemple', C]]) for (const P of M.PIECES) etat[k][P.id] = h(JSON.stringify(P));
for (const niv in S.FAMILLES) for (const [id, , g] of S.FAMILLES[niv]) etat.serie[niv + '/' + id] = h(g.toString());
if (process.argv.includes('--relu')) { writeFileSync(REG, JSON.stringify(etat, null, 1) + '\n'); console.log('Registre des relectures mis à jour :', Object.values(etat).reduce((a, e) => a + Object.keys(e).length, 0), 'entrées.'); }
else { const reg = existsSync(REG) ? JSON.parse(readFileSync(REG, 'utf8')) : {}, aRelire = [];
  for (const k in etat) for (const id in etat[k]) if (!reg[k] || reg[k][id] !== etat[k][id]) aRelire.push(k + ' : ' + id + (reg[k] && reg[k][id] ? ' (modifiée)' : ' (nouvelle)'));
  if (aRelire.length) { pb += aRelire.length; console.log('À FAIRE RELIRE PAR UN AGENT INDÉPENDANT avant publication (' + aRelire.length + ') :'); aRelire.forEach(x => console.log('  ' + x)); console.log('Puis, corrections faites : node outils/activites_raisonner.mjs --relu'); } }
console.log(pb ? pb + ' problème(s)' : 'Aucun problème.'); process.exit(pb ? 1 : 0);
