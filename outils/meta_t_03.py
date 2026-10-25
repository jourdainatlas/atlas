"""Métadonnées proposées pour la feuille Terminale, chapitre 3 (limites, dérivation, convexité, continuité)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'forme indéterminée|f\.i\.|indéterminée', 'forme indéterminée', [], []),
    (r'\\lim_\{x ?\\to ?[+-]\\infty|en \+?\$?\+\\infty|en l\'infini|en \$\+\\infty|en \$-\\infty', "limite en l'infini", [], []),
    (r'\\lim_\{x ?\\to ?-?[0-9]|\\lim_\{\\substack|en \$-?[0-9]', 'limite en un réel', ['c-point'], ['continuite-point']),
    (r'asymptote', 'asymptote', [], []),
    (r'gendarmes', 'théorème des gendarmes', [], []),
    (r'comparaison|minor|major', 'théorème de comparaison', [], []),
    (r'conjugu', 'quantité conjuguée', [], []),
    (r'dérivée|dérivable|f\'\(x\)|f\'', 'dérivée', ['ar-deriv'], ['derivable']),
    (r'compos|\\circ', 'fonction composée', [], ['composee']),
    (r'tangente', 'tangente', ['ar-deriv'], []),
    (r'tableau de variations|tkztab|sens de variation|variations', 'tableau de variations', [], []),
    (r'convexe|concave|convexité', 'convexité', [], []),
    (r'inflexion', "point d'inflexion", [], []),
    (r'f\'\'|dérivée seconde', 'dérivée seconde', ['ar-deriv'], []),
    (r'continu', 'continuité', ['continuite'], ['continuite']),
    (r'valeurs intermédiaires|t\.v\.i|tvi|unique solution|admet une unique|exactement une solution', 'théorème des valeurs intermédiaires', ['c-tvi'], []),
    (r'bijection', 'théorème de la bijection', ['c-tvi'], ['bijection']),
    (r'dichotomie', 'dichotomie', ['c-tvi'], []),
    (r'balayage|encadrement d\'amplitude|valeur approchée|à 10\^', 'valeur approchée', [], []),
    (r'```python|python', 'Python', [], []),
    (r'\\exp|e\^\{|e\^x|exponentielle', 'exponentielle', ['cx-exponentielle'], ['exponentielle']),
    (r'\\ln|logarithme', 'logarithme', [], ['logarithme']),
    (r'\\sqrt', 'racine carrée', [], []),
    (r'polynôme|trinôme', 'polynôme', [], []),
    (r'partie entière|\\lfloor', 'partie entière', [], []),
    (r'fonction auxiliaire|on pose \$g|soit \$g', 'fonction auxiliaire', [], []),
    (r'suite', 'suite', ['ar-suites'], ['suite']),
]

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, enonce + '\n' + corrige)
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
