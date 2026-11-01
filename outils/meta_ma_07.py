"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 07 (nombres réels et suites)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 7, 'borne supérieure', ['od-sup-propriete', 'ar-corps'], ['borne-superieure']),
    (8, 16, 'limites de suites', ['su-convergence', 'su-operations'], ['suite', 'limite-suite']),
    (17, 24, 'suites monotones et adjacentes', ['su-monotone', 'su-adjacentes'], ['suites-adjacentes']),
    (25, 31, 'suites extraites', ['su-extraites', 'ar-bw'], ['suite-extraite']),
    (32, 37, 'suites particulières', ['ar-suites'], ['suite']),
    (38, 44, 'suites récurrentes', ['ar-suites', 'su-monotone'], ['suite']),
]
R = [
    (r'borne supérieure|borne inférieure|\\sup|\\inf', 'bornes supérieure et inférieure', ['od-sup-propriete'], ['borne-superieure']),
    (r'majorant|majorée|minorée', 'majorants', ['od-majorants'], ['majorant']),
    (r'archim|partie entière|\\lfloor', "partie entière et propriété d'Archimède", ['ar-archimede'], ['archimedien']),
    (r'dense|densité|rationnels|irrationnel', 'densité', ['tr-dense'], ['partie-dense']),
    (r'valeur absolue|\|x', 'valeur absolue', ['ar-corps'], []),
    (r'converge|limite|\\lim', 'limites de suites', ['su-convergence'], ['limite-suite']),
    (r'\+\\infty|diverge', 'limites infinies', ['su-infinies'], ['limite-infinie']),
    (r'encadrement|gendarmes', "théorème d'encadrement", ['su-encadrement'], []),
    (r'monotone|croissante|décroissante', 'suites monotones', ['su-monotone'], []),
    (r'adjacentes', 'suites adjacentes', ['su-adjacentes'], ['suites-adjacentes']),
    (r'extraite|u_\{2n\}|u_\{\\varphi', 'suites extraites', ['su-extraites'], ['suite-extraite']),
    (r'bolzano|valeur d\'adhérence', 'Bolzano-Weierstrass', ['ar-bw'], []),
    (r'cauchy', 'suites de Cauchy', ['ar-cauchy'], ['suite-cauchy']),
    (r'arithmético|géométrique', 'suites arithmético-géométriques', ['ar-suites'], []),
    (r'u_\{n\+2\}|ordre 2|récurrente linéaire', 'récurrence linéaire d\'ordre 2', ['ar-suites'], []),
    (r'u_\{n\+1\} = f|u_\{n\+1\} = \\', 'suites récurrentes', ['ar-suites'], []),
    (r'césaro|moyenne', 'moyennes de Césaro', ['su-convergence'], []),
    (r'complexe', 'suites complexes', ['cx-suites'], []),
    (r'\\sum|série', 'sommes', ['n-sommes'], []),
]
FOND = ['ar-suites']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
