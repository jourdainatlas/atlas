// Commun aux deux activités de la sous-rubrique « Raisonner » (MEMO_atlas_activites.md §144) : niveaux, styles, mémoire du navigateur.
export const NIVEAUX = [['premiere', 'Première'], ['terminale', 'Terminale'], ['expertes', 'Maths expertes'], ['sup', 'Maths Sup']];
export const THEMES = [['fondements', 'Fondements'], ['algebre', 'Algèbre'], ['lineaire', 'Algèbre linéaire'], ['analyse', 'Analyse'], ['probabilites', 'Probabilités']];
export const cssRaison = `
.activites-act .jeu { --activites-jeu: var(--rouge); }
.activites-act .rz-niveaux { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.activites-act .bar.top { flex-direction: column; align-items: flex-start; gap: 8px; }
.activites-act .rz-niveaux[hidden] { display: none; }
.activites-act .rz-niveaux .rz-nom { font: 600 12.5px var(--f-ui); letter-spacing: .04em; text-transform: uppercase; color: var(--encre-3); margin-right: 2px; }
.activites-act label.rz-choix { display: flex; align-items: center; gap: 8px; flex: 1 1 320px; min-width: 0; max-width: 100%; }
.activites-act label.rz-choix select { flex: 1 1 auto; min-width: 0; width: 100%; max-width: 100%; text-overflow: ellipsis; }
@media (max-width: 640px) { .activites-act label.rz-choix { flex: 1 1 100%; flex-direction: column; align-items: stretch; gap: 4px; } }
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

// Filtres communs (§145) : niveau, puis thème pour Maths Sup. Rend les pièces visibles, les deux rangées de puces et les options de la liste, groupées.
export function filtrer(PIECES, niveau, theme) { return PIECES.filter(p => (niveau === 'tous' || p.niveau === niveau || (p.aussi || []).includes(niveau)) && (niveau !== 'sup' || theme === 'tous' || p.theme === theme)); }
export function pucesNiveaux(PIECES, niveau) { return [['tous', 'Tous']].concat(NIVEAUX).filter(([id]) => id === 'tous' || PIECES.some(p => p.niveau === id)).map(([id, nom]) => `<button type="button" class="chip" data-n="${id}" aria-pressed="${id === niveau}">${nom} <small>${id === 'tous' ? PIECES.length : PIECES.filter(p => p.niveau === id || (p.aussi || []).includes(id)).length}</small></button>`).join(''); }
export function pucesThemes(PIECES, theme) { const S = PIECES.filter(p => p.niveau === 'sup'); return '<span class="rz-nom">Maths Sup</span>' + [['tous', 'Tout']].concat(THEMES).filter(([id]) => id === 'tous' || S.some(p => p.theme === id)).map(([id, nom]) => `<button type="button" class="chip" data-t="${id}" aria-pressed="${id === theme}">${nom} <small>${id === 'tous' ? S.length : S.filter(p => p.theme === id).length}</small></button>`).join(''); }
export function options(V, niveau, theme, M) { const o = p => `<option value="${p.id}">${M[p.id] ? '✓ ' : ''}${p.nom}</option>`, g = (nom, L) => L.length ? `<optgroup label="${nom}">${L.map(o).join('')}</optgroup>` : '';
  if (niveau === 'tous') return NIVEAUX.map(([id, nom]) => g(nom, V.filter(p => p.niveau === id))).join('');
  if (niveau === 'sup' && theme === 'tous') return THEMES.map(([id, nom]) => g(nom, V.filter(p => p.theme === id))).join('');
  return V.map(o).join(''); }
