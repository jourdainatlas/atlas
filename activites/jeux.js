// Rubrique Activités, groupe « Casse-têtes » : styles et petits outils communs aux jeux (MEMO_atlas_activites.md, §121).
// Les jeux sont faits d'éléments de page (boutons), pas de dessins : chaque pièce se joue à la souris, au doigt et au clavier.
export { ecrire, fr } from './figures.js';
export const entier = n => isFinite(n) ? Math.round(n).toLocaleString('fr-FR') : '—';
export const cssJeux = `
.activites-act .jeu { margin: 22px 0 26px; background: var(--surface); border: 1px solid var(--filet); border-top: 3px solid var(--activites-jeu); border-radius: 8px; overflow: hidden; }
.activites-act .jeu-plateau { padding: 22px 16px; display: flex; justify-content: center; background: var(--papier); }
.activites-act .jeu-etat { display: flex; flex-wrap: wrap; gap: 6px 22px; padding: 10px 16px; border-top: 1px solid var(--filet); font: 14px/1.4 var(--f-ui); color: var(--encre-2); }
.activites-act .jeu-etat b { font-family: var(--f-mono); font-weight: 600; color: var(--encre); }
.activites-act .jeu-message { padding: 10px 16px; border-top: 1px solid var(--filet); font: 15px/1.45 var(--f-ui); min-height: 44px; }
.activites-act .jeu-message.gagne { color: var(--tan); font-weight: 600; }
.activites-act .jeu-message.bloque { color: var(--sec); }
.activites-act .bar select { font: 14px var(--f-ui); color: var(--encre); background: var(--surface); border: 1px solid var(--encre-3); border-radius: 6px; padding: 4px 6px; }
`;
