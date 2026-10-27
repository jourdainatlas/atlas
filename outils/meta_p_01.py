"""Métadonnées proposées pour la feuille de Première spécialité, chapitre 1 (second degré)."""
from meta_commun import types_exercice, appliquer

R = [
    ('trinôme|second degré|ax\\^\\{2\\}|x\\^\\{2\\}', 'trinôme du second degré', ['z-polynomes'], ['anneau-polynomes']),
    ('forme canonique|canonique', 'forme canonique', ['z-polynomes'], []),
    ('sommet|parabole|axe de symétrie', 'parabole et sommet', [], []),
    ('variation|maximum|minimum|extremum', 'variations', [], []),
    ('discriminant|\\\\delta', 'discriminant', ['c-racine-reelle'], []),
    ('racine|résoudre|équation', 'équation du second degré', ['c-racine-reelle'], []),
    ('factoris|forme factorisée', 'factorisation', ['z-polynomes'], []),
    ('somme et (le )?produit|somme des racines|produit des racines|s=|p=', 'somme et produit des racines', [], []),
    ('signe|inéquation|tableau de signes', 'signe et inéquations', [], []),
    ('paramètre|\\bm\\b|selon les valeurs', 'paramètre', [], []),
    ('bicarré|x\\^\\{4\\}|changement de variable|en posant', 'changement de variable', [], []),
    ('aire|rectangle|périmètre|vitesse|prix|bénéfice', 'problème concret', ['c-racine-reelle'], []),
    ('entiers? consécutifs|joueurs|piscine|cyclistes|mise en équation', 'mise en équation', ['c-racine-reelle'], ['anneau-polynomes']),
    ('python|algorithme', 'Python', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
