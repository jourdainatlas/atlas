"""Métadonnées proposées pour la feuille Licence 3, UE Probabilités, chapitre 2 (Probabilités conditionnelles, indépendance)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 9, 'probabilités conditionnelles', ['p-espace'], ['probabilite-conditionnelle']),
           (10, 13, 'probabilités composées', ['p-espace'], ['probabilite-conditionnelle']),
           (14, 21, 'indépendance', ['p-independance'], ['independance'])]
R = [('Bayes', 'formule de Bayes', ['p-espace'], ['probabilite-conditionnelle']),
     ('probabilit[ée]s totales', 'probabilités totales', ['p-espace'], ['probabilite-conditionnelle']),
     ('ind[ée]pendan', 'indépendance', ['p-independance'], ['independance'])]
FOND = ['p-espace']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
