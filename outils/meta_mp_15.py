"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 15 (espérance, variance et fonctions génératrices)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 15, 'espérance', ['p-esperance'], ['esperance']),
    (16, 22, 'variance et covariance', ['p-esperance'], ['variance', 'covariance']),
    (23, 30, 'inégalités et loi faible', ['p-esperance', 'p-loi-faible'], []),
    (31, 40, 'fonctions génératrices', ['p-variables', 'cx-series-entieres'], []),
    (41, 46, 'synthèse', [], []),
]
R = [
    (r'\\E\(|espérance', 'espérance', ['p-esperance'], ['esperance']),
    (r'\\V\(|variance|écart type', 'variance', ['p-esperance'], ['variance']),
    (r'covariance|\\Cov', 'covariance', ['p-esperance'], ['covariance']),
    (r'Markov|Bienaym|Tchebych', 'inégalités probabilistes', ['p-esperance'], []),
    (r'grands nombres', 'loi faible des grands nombres', ['p-loi-faible'], []),
    (r'G_\{?[A-Z]|génératrice', 'fonction génératrice', ['p-variables', 'cx-series-entieres'], []),
    (r'Poisson|\\Poiss', 'loi de Poisson', ['p-poisson-exp'], ['loi-poisson']),
    (r'géométrique|\\Geom', 'loi géométrique', ['p-variables'], []),
    (r'binomiale|\\Bin', 'loi binomiale', ['p-variables'], []),
    (r'indépendan', 'indépendance', ['p-independance'], ['independance']),
]
FOND = ['p-esperance']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
