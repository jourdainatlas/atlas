"""Métadonnées proposées pour la feuille Licence 3, UE Probabilités, chapitre 5 (Vecteurs aléatoires discrets, covariance)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 6, 'lois conjointes et marginales', ['p-variables'], ['loi-variable']),
           (7, 12, 'lois conditionnelles', ['p-independance', 'p-variables'], ['independance', 'probabilite-conditionnelle']),
           (13, 20, 'covariance', ['p-esperance'], ['covariance', 'variance']),
           (21, 22, '', ['p-esperance', 'p-independance'], ['covariance'])]
R = [('Poisson|\\\\loiP', 'loi de Poisson', ['p-poisson-exp'], ['loi-poisson']),
     ('r[ée]gression|corr[ée]lation', 'corrélation', ['p-esperance'], ['covariance'])]
FOND = ['p-variables']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
