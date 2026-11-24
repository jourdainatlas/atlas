"""Métadonnées proposées pour la feuille Licence 3, UE Probabilités, chapitre 7 (Vecteurs aléatoires à densité)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 7, 'densités marginales', ['p-variables', 'm-fubini'], ['densite-probabilite', 'independance']),
           (8, 12, 'changement de variables', ['cv-changement', 'p-independance'], ['densite-probabilite', 'mesure-densite']),
           (13, 16, "sommes et statistiques d'ordre", ['p-independance', 'p-poisson-exp'], ['densite-probabilite', 'independance'])]
R = [('\\\\Gamma\\(', 'loi gamma', ['p-poisson-exp'], []),
     ('Poisson|\\\\loiP', 'loi de Poisson', ['p-poisson-exp'], ['loi-poisson']),
     ('\\\\mathcal\\{N\\}', 'loi normale', ['p-normale'], ['loi-normale']),
     ('Bertrand', 'paradoxe de Bertrand', ['p-variables'], [])]
FOND = ['p-variables']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
