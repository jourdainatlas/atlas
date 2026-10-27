"""Métadonnées proposées pour la feuille Maths expertes, chapitre 2 (nombres complexes)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'algébrique|partie réelle|partie imaginaire', 'forme algébrique', ['c-calcul'], ['nombre-complexe']),
    (r'conjugu|\\overline', 'conjugué', ['c-calcul'], []),
    (r'imaginaire pur|réel', 'réel ou imaginaire pur', ['c-calcul'], []),
    (r'résoudre|équation', 'équations dans ℂ', ['c-construction'], ['ensemble-complexes']),
    (r'second degré|discriminant|z\^\{2\}|z\^2', 'équation du second degré', ['c-racines-carrees'], []),
    (r'racine carrée|racines carrées', 'racines carrées complexes', ['c-racines-carrees'], []),
    (r'polyn|z\^\{3\}|z\^\{4\}|racine évidente|solution évidente|factoris', 'polynômes', ['z-polynomes', 'c-dalembert'], ['anneau-polynomes']),
    (r'système', 'systèmes', [], []),
    (r'binôme|binomia', 'binôme de Newton', [], []),
    (r'i\^\{|puissance', 'puissances de i', ['c-calcul'], []),
    (r'racines? (n-ièmes|quatrièmes|cubiques)|z\^\{5\}=1|z\^\{3\}-1|\bj\b', "racines de l'unité", ['cx-exponentielle'], []),
    (r'bombelli|cardan', 'formule de Cardan', [], []),
    (r'conjugaison|automorph|application de', 'conjugaison', ['c-automorphismes'], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {26: ([], ['c-calcul'], ['nombre-complexe'])}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
