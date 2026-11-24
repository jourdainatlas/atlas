"""Métadonnées proposées pour la feuille Licence 3, UE Probabilités, chapitre 3 (Variables aléatoires discrètes)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 4, 'espérance et variance', ['p-variables', 'p-esperance'], ['variable-aleatoire', 'esperance', 'variance']),
           (5, 10, 'loi géométrique', ['p-variables', 'p-independance'], ['variable-aleatoire', 'loi-variable']),
           (11, 18, 'variables indépendantes', ['p-independance', 'p-variables'], ['independance', 'variable-aleatoire'])]
R = [('Poisson|\\\\loiP', 'loi de Poisson', ['p-poisson-exp'], ['loi-poisson']),
     ('binomial|\\\\loiB\\(n', 'loi binomiale', ['p-variables'], ['loi-variable']),
     ('Var\\b|variance', 'variance', ['p-esperance'], ['variance'])]
FOND = ['p-variables']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
