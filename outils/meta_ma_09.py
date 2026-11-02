"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 09 (dérivabilité et convexité)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 10, 'dérivabilité en un point', ['de-derivee', 'de-operations'], ['derivable']),
    (11, 26, 'Rolle et accroissements finis', ['de-rolle', 'de-taf', 'de-iaf'], ['derivable']),
    (27, 32, 'fonctions de classe Cᵏ', ['de-taylor'], ['classe-ck', 'derivee-successive']),
    (33, 34, 'fonctions à valeurs complexes', ['de-operations'], ['derivable']),
    (35, 46, 'fonctions convexes', ['de-monotonie', 'de-taf'], []),
]
R = [
    (r'dérivable en|nombre dérivé|taux d\'accroissement', 'dérivabilité en un point', ['de-derivee'], ['derivable']),
    (r'tangente', 'tangente', ['de-dl1'], []),
    (r'réciproque', 'dérivée d\'une réciproque', ['de-reciproque'], []),
    (r'extremum|maximum|minimum', 'extrema', ['de-extremum'], ['extremum-local']),
    (r'rolle', 'théorème de Rolle', ['de-rolle'], []),
    (r'accroissements finis', 'accroissements finis', ['de-taf', 'de-iaf'], []),
    (r'lipschitz|contractante', 'fonctions lipschitziennes', ['de-iaf'], ['contractante']),
    (r'monoton|croissante|décroissante', 'dérivée et monotonie', ['de-monotonie'], []),
    (r'u_\{n\+1\} = |récurrente', 'suites récurrentes', ['de-iaf', 'ar-suites'], ['suite']),
    (r'limite de la dérivée|prolong', 'limite de la dérivée', ['de-taf'], []),
    (r'leibniz|\^\{\(n\)\}|dérivées? successives|\\mathcal\{c\}\^\{', 'dérivées successives', ['de-taylor'], ['derivee-successive', 'classe-ck']),
    (r'convexe|concave|jensen', 'convexité', ['de-monotonie'], []),
    (r'inflexion', "points d'inflexion", [], []),
    (r'inégalité', 'inégalités', ['de-monotonie'], []),
    (r'polyn|racines', 'racines de polynômes', ['de-rolle'], []),
    (r'équation fonctionnelle|toutes les fonctions', 'équations fonctionnelles', [], []),
]
FOND = ['ar-deriv']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
