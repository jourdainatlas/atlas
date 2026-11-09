"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 05 (fonctions usuelles)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 9, 'généralités sur les fonctions', ['de-monotonie'], []),
    (10, 20, 'dérivation', ['de-operations'], ['derivable']),
    (21, 28, 'exponentielle et logarithme', ['cx-exponentielle', 'nb-logarithme'], ['exponentielle', 'logarithme']),
    (29, 33, 'puissances et croissances comparées', ['nb-logarithme'], ['puissance-reelle']),
    (34, 41, 'fonctions circulaires réciproques', ['de-reciproque', 'c-bijection'], []),
    (42, 47, 'fonctions hyperboliques', ['cx-exponentielle'], ['exponentielle']),
    (48, 49, 'fonctions à valeurs complexes', ['de-operations', 'cx-exponentielle'], ['derivable']),
]
R = [
    (r'pair|impair|périodi', 'parité et périodicité', [], []),
    (r'bornée|majorée|minorée', 'fonctions bornées', [], []),
    (r'variations|monoton|croissante|décroissante', 'variations', ['de-monotonie'], []),
    (r'dérivée|dérivable|f\'', 'dérivation', ['de-operations'], ['derivable']),
    (r'composée|\\circ', 'dérivée d\'une composée', ['de-composee'], []),
    (r'dérivées? successives|dérivée \$n|f\^\{\(n\)\}|leibniz', 'dérivées successives', ['de-taylor'], ['derivee-successive']),
    (r'asymptote|branche', 'asymptotes', [], []),
    (r'bijection|réciproque', 'bijection réciproque', ['c-bijection', 'de-reciproque'], []),
    (r'\\exp|\\mathrm\{e\}\^', 'exponentielle', ['cx-exponentielle'], ['exponentielle']),
    (r'\\ln|logarithme|\\log', 'logarithme', ['nb-logarithme'], ['logarithme']),
    (r'x\^\{\\alpha\}|puissance', 'puissances réelles', ['nb-logarithme'], ['puissance-reelle']),
    (r'croissances comparées|\\lim', 'limites', ['de-limite'], ['limite-fonction']),
    (r'arcsin|arccos|arctan', 'fonctions circulaires réciproques', ['de-reciproque'], []),
    (r'\\ch|\\sh|\\th|cosh|sinh|tanh|hyperboli', 'fonctions hyperboliques', ['cx-exponentielle'], []),
    (r'inégalité|\\leqslant', 'inégalités', ['de-monotonie'], []),
    (r'équation fonctionnelle|toutes les fonctions', 'équations fonctionnelles', [], []),
]
FOND = ['de-operations']
EXTRA = {42: (['équations hyperboliques'], ['de-derivee', 'de-operations'], []), 44: (['formule de Moivre hyperbolique'], ['de-derivee', 'de-operations'], [])}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
