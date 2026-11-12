// Commun aux deux activités de la sous-rubrique « Raisonner » (MEMO_atlas_activites.md §144) : niveaux, styles, mémoire du navigateur.
export const NIVEAUX = [['premiere', 'Première'], ['terminale', 'Terminale'], ['expertes', 'Maths expertes'], ['sup', 'Maths Sup']];
export const cssRaison = `
.activites-act .jeu { --activites-jeu: var(--rouge); }
.activites-act .rz-niveaux { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.activites-act .rz-niveaux .chip small { font-size: 11.5px; opacity: .7; margin-left: 3px; }
.activites-act .rz-fait { font: 700 12.5px var(--f-ui); color: var(--tan); border: 1.5px solid var(--tan); border-radius: 999px; padding: 1px 9px; margin-left: 8px; white-space: nowrap; vertical-align: 2px; }
.activites-act a.rz-cours { font: 500 13.5px var(--f-ui); margin-left: 10px; white-space: nowrap; }
`;
// Mémoire : { ordonner: { id: 1 + nombre d'intrus }, erreur: { id: nombre d'essais } }. Rien n'est envoyé.
const CLE = 'atlas-raisonner';
const tout = () => { try { const m = JSON.parse(localStorage.getItem(CLE) || '{}'); return m && typeof m === 'object' ? m : {}; } catch (_) { return {}; } };
export const lireMemoire = quoi => tout()[quoi] || {};
// Garde la meilleure valeur : la plus grande si plusGrand, la plus petite sinon.
export function noterMemoire(quoi, id, valeur, plusGrand = true) { const m = tout(), t = m[quoi] || (m[quoi] = {}); if (!(id in t) || (plusGrand ? valeur > t[id] : valeur < t[id])) t[id] = valeur; try { localStorage.setItem(CLE, JSON.stringify(m)); } catch (_) {} }
