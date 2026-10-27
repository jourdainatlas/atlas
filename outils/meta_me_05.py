"""Métadonnées proposées pour la feuille Maths expertes, chapitre 5 (géométrie complexe)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'affixe|placer|représenter', 'affixe et représentation', ['c-calcul'], ['nombre-complexe']),
    (r'module|\|z', 'module', ['c-calcul'], ['module-complexe']),
    (r'argument|\\arg', 'argument', ['cx-pi'], []),
    (r'trigonométrique|\\cos|\\sin', 'forme trigonométrique', ['cx-pi'], ['pi']),
    (r'exponentielle|e\^\{i', 'forme exponentielle', ['cx-exponentielle'], ['exponentielle']),
    (r'addition|duplication|\\tan|\\cos\\left\(\\dfrac\{7', 'formules de trigonométrie', ['cx-pi'], []),
    (r'moivre', 'formule de Moivre', ['cx-exponentielle'], []),
    (r'euler|linéaris', "formules d'Euler", ['cx-exponentielle'], []),
    (r'distance|ensemble des points|ab=', 'distances et ensembles de points', ['c-calcul'], []),
    (r'racine \$?n|racines? n-ièmes|unité', "racines de l'unité", ['cx-exponentielle'], []),
    (r'somme', 'sommes trigonométriques', [], []),
    (r'polyn', 'polynômes', [], []),
    (r'carré|équilatéral|triangle', 'nature de figures', [], []),
]

# Compléments pour les exercices que les règles ne reconnaissent pas : numéro → (mots-clés, nœuds, notions).
EXTRA = {35: (["racines de l'unité"], ['cx-exponentielle'], []), 37: (["racines de l'unité"], ['cx-exponentielle'], [])}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
