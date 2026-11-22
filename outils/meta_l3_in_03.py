"""Métadonnées proposées pour la feuille Licence 3, UE Intégration, chapitre 3 (Intégrale des fonctions positives)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 9, 'fonctions mesurables', ['m-mesurables'], ['fonction-mesurable', 'fonction-borelienne']),
           (10, 25, 'intégrale des fonctions positives', ['m-integrale', 'm-beppo-levi'], ['integrale-lebesgue'])]
R = [(r'étagée', 'fonctions étagées', ['m-etagees'], ['fonction-etagee']),
     (r'Fatou|\\liminf', 'lemme de Fatou', ['m-fatou'], []),
     (r'convergence monotone|Beppo', 'convergence monotone', ['m-beppo-levi'], []),
     (r'densité', 'mesures à densité', ['m-integrale'], ['mesure-densite']),
     (r'mesure image|T_\{\*\}', 'mesure image', ['m-integrale'], [])]
FOND = ['m-integrale']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
