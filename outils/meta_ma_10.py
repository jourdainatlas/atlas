"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 10 (analyse asymptotique)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 12, 'relations de comparaison', ['su-infinies', 'de-limite'], ['negligeable']),
    (13, 26, 'développements limités', ['de-dl1', 'de-taylor'], ['formule-taylor-young']),
    (27, 37, 'étude locale', ['de-dl1', 'de-taylor'], ['formule-taylor-young']),
    (38, 48, 'développements asymptotiques', ['su-infinies', 'ar-suites'], ['suite', 'negligeable']),
]
R = [
    (r'\\sim|équivalent', 'équivalents', ['su-infinies'], []),
    (r'o\\big\(|o\(|négligeab', 'négligeabilité', ['su-infinies'], ['negligeable']),
    (r'développement limité|taylor', 'développements limités', ['de-taylor'], ['formule-taylor-young']),
    (r'\\lim', 'calcul de limites', ['de-limite'], ['limite-fonction']),
    (r'tangente', 'position par rapport à la tangente', ['de-dl1'], []),
    (r'asymptote', 'asymptotes', [], []),
    (r'extremum|minimum local|maximum local|point critique', 'extrema', ['de-extremum'], ['extremum-local']),
    (r'réciproque', 'développement d\'une réciproque', ['de-reciproque'], []),
    (r'u_\{n\+1\} = |x_\{n\+1\} = ', 'suites récurrentes', ['ar-suites'], ['suite']),
    (r'admet une unique solution|s\'annule en un unique', 'suites implicites', ['c-tvi'], []),
    (r'cesàro', 'lemme de Cesàro', ['su-convergence'], []),
    (r'stirling|n!', 'factorielles', [], []),
    (r'\\sum', 'sommes', ['n-sommes'], []),
    (r'python|fractions', 'algorithmique', [], []),
]
FOND = ['de-taylor']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
