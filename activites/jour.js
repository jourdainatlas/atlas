// Parcours du jour (MEMO_atlas_activites.md §151) : date à Paris, niveau choisi, étapes faites, et passage d'une étape du parcours à l'activité.
export const NIVEAUX_PARCOURS = [['seconde', 'Seconde'], ['premiere', 'Première'], ['terminale', 'Terminale'], ['expertes', 'Terminale + Maths expertes'], ['sup', 'Maths Sup']];
// La classe « Terminale + Maths expertes » puise dans les pièces des deux niveaux.
const NIVEAUX_DE = { seconde: ['seconde'], premiere: ['premiere'], terminale: ['terminale'], expertes: ['terminale', 'expertes'], sup: ['sup'] };
// Numéro du jour à Paris, compté depuis le 1er janvier 2026 (même convention que « Le compte est bon »).
export function aujourdhui() { const s = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()), [y, m, d] = s.split('-').map(Number);
  return { n: Math.round((Date.UTC(y, m - 1, d) - Date.UTC(2026, 0, 1)) / 864e5), texte: new Intl.DateTimeFormat('fr-FR', { timeZone: 'Europe/Paris', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()) }; }
const CLE = 'atlas-parcours', PASSAGE = 'atlas-parcours-ouvrir';
// Mémoire : { niveau, jour, faits: { étape: true } } ; les étapes faites sont oubliées le lendemain, le niveau est gardé.
export function lireParcours() { let m = null; try { m = JSON.parse(localStorage.getItem(CLE) || 'null'); } catch (_) {} const j = aujourdhui().n;
  if (!m || typeof m !== 'object') m = {}; if (m.jour !== j || !m.faits) { m.jour = j; m.faits = {}; } if (!NIVEAUX_PARCOURS.some(([id]) => id === m.niveau)) m.niveau = ''; return m; }
export function ecrireParcours(m) { try { localStorage.setItem(CLE, JSON.stringify(m)); } catch (_) {} }
// Pièce du jour d'une banque, pour un niveau : la même pour tous les visiteurs. Le décalage évite que toutes les activités avancent du même pas.
const DECALAGE = { ordonner: 0, erreur: 7, 'contre-exemple': 13, implication: 19 };
export function pieceDuJour(PIECES, niveau, activite) { const N = NIVEAUX_DE[niveau] || [niveau], L = PIECES.filter(p => N.includes(p.niveau)); if (!L.length) return null; const k = aujourdhui().n + (DECALAGE[activite] || 0); return L[((k % L.length) + L.length) % L.length]; }
// Le parcours dépose une demande avant d'ouvrir une activité ; l'activité la lit une fois en se montant.
export function demander(activite, niveau) { try { sessionStorage.setItem(PASSAGE, JSON.stringify({ activite, niveau, jour: aujourdhui().n })); } catch (_) {} }
export function demande(activite) { try { const d = JSON.parse(sessionStorage.getItem(PASSAGE) || 'null'); if (d && d.activite === activite && d.jour === aujourdhui().n) { sessionStorage.removeItem(PASSAGE); return d; } } catch (_) {} return null; }
// Une activité signale qu'une étape est faite ; cela ne compte que si un niveau a été choisi dans le parcours.
export function valider(activite, niveau) { const m = lireParcours(); if (!m.niveau || (niveau && niveau !== m.niveau)) return false; if (!m.faits[activite]) { m.faits[activite] = true; ecrireParcours(m); } return true; }
// Pour les quatre activités à pièces : la pièce réussie est-elle celle du jour, au niveau du parcours ?
export function validerPiece(activite, PIECES, P) { const m = lireParcours(); if (!m.niveau || pieceDuJour(PIECES, m.niveau, activite) !== P) return false; return valider(activite); }
export const lienParcours = ' <a class="rz-cours" href="#activites/parcours">Revenir au parcours du jour</a>';
// Étape suivante du parcours (§164) : après une étape réussie, l'activité propose d'ouvrir directement la prochaine étape
// qui reste à faire, dans l'ordre du parcours (en repartant du début après la dernière), sans repasser par sa page.
const SUITE = [['compte-est-bon', 'Le compte est bon'], ['serie', 'Dix calculs'], ['ordonner', 'La démonstration du jour'], ['erreur', 'L\'erreur du jour'], ['contre-exemple', 'Le contre-exemple du jour'], ['implication', 'Nécessaire ou suffisant ?']];
const NIV_COMPTE = { seconde: 0, premiere: 0, terminale: 1, expertes: 1, sup: 1 };
// « Le compte est bon » tient sa propre mémoire du jour : { jour, faits: { niveau: opérations } }.
export function compteFait(n) { try { const m = JSON.parse(localStorage.getItem('atlas-compte-est-bon') || 'null'); return !!(m && m.jour === aujourdhui().n && m.faits && (NIV_COMPTE[n] in m.faits)); } catch (_) { return false; } }
export function etapeSuivante(courante) { const M = lireParcours(); if (!M.niveau) return null; const fait = id => id === courante || (id === 'compte-est-bon' ? compteFait(M.niveau) : !!M.faits[id]), k = SUITE.findIndex(e => e[0] === courante);
  for (let i = 1; i < SUITE.length; i++) { const e = SUITE[(k + i) % SUITE.length]; if (!fait(e[0])) return e; } return null; }
export function suiteParcours(courante) { const e = etapeSuivante(courante); return (e ? ` <a class="pc-suite" href="#activites/${e[0]}" data-suite="${e[0]}">Étape suivante : ${e[1]} <span aria-hidden="true">→</span></a>` : ' <b class="pc-fini">Parcours du jour terminé.</b>') + lienParcours; }
// Le lien « Étape suivante » dépose la demande (classe et pièce du jour) avant que l'activité suivante ne se monte.
if (typeof document !== 'undefined' && !document.documentElement.dataset.atlasSuite) { document.documentElement.dataset.atlasSuite = '1';
  document.addEventListener('click', e => { const a = e.target.closest && e.target.closest('a[data-suite]'); if (a) demander(a.dataset.suite, lireParcours().niveau); }, true); }
