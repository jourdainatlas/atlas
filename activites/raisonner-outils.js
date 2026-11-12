// Écriture compacte des pièces de « Raisonner » (MEMO_atlas_activites.md §145).
// T`texte avec $formule$` : les formules entre dollars deviennent des repères composés par KaTeX ; les barres obliques inverses s'écrivent une seule fois.
export const T = (s, ...v) => String.raw(s, ...v).replace(/\$([^$]+)\$/g, (_, f) => '<span class="kx">' + f.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</span>');
// Démonstration : étapes [texte, dépendances (lettres des étapes requises), ce que l'étape apporte (groupe nominal)], intrus [texte, pourquoi].
export function demo(id, niveau, theme, cours, nom, enonce, etapes, intrus) {
  const L = 'abcdefgh';
  return { id, niveau, theme, cours, nom, enonce, etapes: etapes.map(([t, deps = '', apporte], i) => ({ id: L[i], t,
      dep: Object.fromEntries([...deps].map(d => { const a = etapes[L.indexOf(d)][2]; return [d, a ? `Cette étape s'appuie sur ${a}, qui ne figure pas encore plus haut.` : `Cette étape s'appuie sur une étape qui ne figure pas encore plus haut.`]; })) })),
    intrus: intrus.map(([t, pourquoi], i) => ({ id: 'xy'[i], t, pourquoi })) };
}
// Raisonnement fautif : lignes [texte, pourquoi la ligne est juste] ; la ligne fautive est celle qui n'a pas de justification.
export function faux(id, niveau, theme, cours, nom, annonce, lignes, pourquoi, retenir, indice) {
  return { id, niveau, theme, cours, nom, annonce, faute: lignes.findIndex(l => !l[1]), lignes: lignes.map(([t, ok]) => ok ? { t, ok } : { t }), pourquoi, retenir, indice };
}
