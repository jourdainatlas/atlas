"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 21 (dénombrement et probabilités)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 22, 'dénombrement', ['n-fini', 'pol-binome'], ['cardinal']),
    (23, 34, 'espaces probabilisés finis', ['p-espace'], ['espace-probabilise', 'probabilite']),
    (35, 54, 'conditionnement et indépendance', ['p-independance'], ['probabilite-conditionnelle', 'independance']),
    (55, 69, 'variables aléatoires', ['p-variables'], ['variable-aleatoire']),
    (70, 80, 'espérance', ['p-esperance'], ['esperance']),
    (81, 94, 'variance et covariance', ['p-esperance'], ['variance', 'covariance']),
    (95, 101, 'inégalités et loi faible', ['p-esperance', 'p-loi-faible'], []),
]
R = [
    (r'\\binom|coefficient binomial|parties à', 'coefficients binomiaux', ['pol-binome'], []),
    (r'\\card|cardinal|combien', 'dénombrement', ['n-fini'], ['cardinal']),
    (r'injecti|surjecti|bijecti|application', 'applications et dénombrement', ['r-injections'], []),
    (r'permutation|anagramme|arrangement', 'permutations', ['v-permutations'], []),
    (r'crible', 'formule du crible', ['n-fini'], []),
    (r'probabilité|\\mathbb\{p\}|\\p\(', 'probabilités', ['p-espace'], ['probabilite']),
    (r'sachant|conditionn|bayes|probabilités totales', 'probabilités conditionnelles', ['p-independance'], ['probabilite-conditionnelle']),
    (r'indépendan', 'indépendance', ['p-independance'], ['independance']),
    (r'variable|loi ', 'variables aléatoires', ['p-variables'], ['variable-aleatoire']),
    (r'binomiale|bernoulli', 'lois de Bernoulli et binomiale', ['p-variables'], []),
    (r'uniforme', 'loi uniforme', ['p-variables'], []),
    (r'espérance|\\mathbb\{e\}|\\e\(', 'espérance', ['p-esperance'], ['esperance']),
    (r'variance|écart type|\\mathbb\{v\}|covariance', 'variance', ['p-esperance'], ['variance']),
    (r'markov|bienaymé|tchebychev', 'inégalités de concentration', ['p-esperance'], []),
    (r'grands nombres|fréquence', 'loi faible des grands nombres', ['p-loi-faible'], []),
    (r'tirage|urne|boule', 'tirages', ['p-espace'], []),
    (r'\bdés?\b|pièce|pile', 'jeux de hasard', ['p-espace'], []),
    (r'graphe|marche|chemin', 'marches aléatoires et graphes', ['p-variables'], []),
]
FOND = ['p-espace']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
