"""Métadonnées proposées pour la feuille Licence 3, UE Probabilités, chapitre 4 (Variables aléatoires réelles, variables à densité)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 3, 'fonction de répartition', ['p-variables'], ['fonction-repartition', 'loi-variable']),
           (4, 11, 'lois usuelles', ['p-variables', 'p-esperance'], ['densite-probabilite', 'esperance']),
           (12, 15, 'simulation', ['p-variables'], ['densite-probabilite', 'fonction-repartition']),
           (16, 18, 'minimum et maximum', ['p-variables', 'p-independance'], ['fonction-repartition', 'independance'])]
R = [('exponentielle|\\\\mathcal\\{E\\}', 'loi exponentielle', ['p-poisson-exp'], ['densite-probabilite']),
     ('normale|\\\\mathcal\\{N\\}|gaussienne', 'loi normale', ['p-normale'], ['loi-normale'])]
FOND = ['p-variables']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
