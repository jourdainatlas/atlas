"""Métadonnées proposées pour la feuille de Seconde, chapitre 4 (équations)."""
from meta_commun import types_exercice, appliquer

R = [
    ('résoudre|équation', 'équations', ['ar-corps'], ['corps']),
    ('premier degré|premier membre|second membre', 'équation du premier degré', ['ar-corps'], []),
    ('produit|\\)\\(|=0', 'équation produit', ['z-anneau'], ['anneau-integre']),
    ('quotient|valeurs? interdite|\\\\dfrac\\{', 'équation quotient', ['ar-corps'], []),
    ('x\\^\\{2\\}=|carré', 'équation x² = a', ['c-racine-reelle'], []),
    ('âge|prix|périmètre|rectangle|nombre|euro|programme', 'mise en équation', ['ar-corps'], []),
    ('paramètre|\\bm\\b|selon les valeurs', 'discussion selon un paramètre', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
