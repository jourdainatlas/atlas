"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 14 (espaces probabilisés et variables aléatoires discrètes)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 3, 'ensembles dénombrables', ['q-denombrable'], ['denombrable']),
    (4, 9, 'espaces probabilisés', ['p-espace', 'm-tribus'], ['espace-probabilise', 'tribu']),
    (10, 21, 'conditionnement et indépendance', ['p-independance'], ['probabilite-conditionnelle', 'independance']),
    (22, 24, 'espaces probabilisés discrets', ['p-espace'], ['espace-probabilise']),
    (25, 30, 'variables aléatoires discrètes', ['p-variables'], ['variable-aleatoire', 'loi-variable']),
    (31, 33, 'variables aléatoires indépendantes', ['p-variables', 'p-independance'], ['independance']),
    (34, 41, 'lois usuelles', ['p-variables', 'p-poisson-exp'], ['loi-variable']),
    (42, 46, 'synthèse', [], []),
]
R = [
    (r'Poisson', 'loi de Poisson', ['p-poisson-exp'], ['loi-poisson']),
    (r'Borel-Cantelli|limsup', 'lemme de Borel-Cantelli', ['p-borel-cantelli'], []),
    (r'Bayes|probabilités totales', 'formule de Bayes', ['p-independance'], ['probabilite-conditionnelle']),
    (r'tribu', 'tribus', ['m-tribus'], ['tribu']),
    (r'dénombrable', 'ensembles dénombrables', ['q-denombrable'], ['denombrable']),
]
FOND = ['p-variables', 'p-espace']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
