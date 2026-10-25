"""Métadonnées proposées pour la feuille Terminale, chapitre 5 (exponentielle et logarithme)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'\\mathrm\{e\}\^|exponentielle|\\exp', 'exponentielle', ['cx-exponentielle'], ['exponentielle']),
    (r'\\ln|logarithme', 'logarithme', ['nb-logarithme'], ['logarithme']),
    (r'simplifier', 'propriétés algébriques', [], []),
    (r'résoudre[^.]*équation|équations suivantes', 'équation', [], []),
    (r'inéquation', 'inéquation', [], []),
    (r'condition d\'existence|ensemble de définition', 'ensemble de définition', [], []),
    (r'on posera \$x|changement de variable|posera \$x', 'changement de variable', [], []),
    (r'dérivée|dérivable|f\'\(x\)|g\'\(x\)', 'dérivée', ['ar-deriv'], ['derivable']),
    (r'tableau de variations|sens de variation', 'tableau de variations', [], []),
    (r'\\lim', 'limite', [], []),
    (r'croissances comparées', 'croissances comparées', [], []),
    (r'forme indéterminée|indéterminée', 'forme indéterminée', [], []),
    (r'asymptote', 'asymptote', [], []),
    (r'tangente', 'tangente', ['ar-deriv'], []),
    (r'exactement (deux|une) solutions?|nombre de solutions|admet une unique', 'théorème des valeurs intermédiaires', ['c-tvi'], []),
    (r'plus petit entier|seuil|au bout de combien', 'seuil', [], []),
    (r'suite|u_\{?n', 'suite', ['ar-suites'], ['suite']),
    (r'récurrence', 'récurrence', ['n-recurrence'], []),
    (r'\\log\b|décibel|ph ', 'logarithme décimal', [], []),
    (r'2\^\{?x|a\^\{?x|3\^\{?-?2?x|0\{,\}5\^\{?x|x\^\{?a', 'fonction puissance', ['nb-logarithme'], []),
    (r'intérêts|capital|taux', 'intérêts composés', [], []),
    (r'demi-vie|médicament|bactéries|population', 'modélisation', [], []),
    (r'operatorname\{ch\}|hyperbolique', 'fonctions hyperboliques', [], []),
    (r'inégalité|montrer que[^.]*\\leqslant|majorer', 'inégalité', [], []),
    (r'```python|python', 'Python', [], []),
]

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, enonce)
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
