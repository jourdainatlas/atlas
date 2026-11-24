"""Métadonnées proposées pour la feuille Licence 3, UE Probabilités, chapitre 8 (Convergence de variables aléatoires)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 2, 'inégalités', ['p-esperance'], ['esperance', 'variance']),
           (3, 7, 'lemme de Borel-Cantelli', ['p-borel-cantelli'], ['convergence-presque-sure']),
           (8, 13, 'modes de convergence', ['p-convergences'], ['convergence-presque-sure', 'convergence-probabilite', 'convergence-moyenne']),
           (14, 21, 'convergence en loi', ['p-convergences', 'fo-loi-esperances'], ['convergence-loi'])]
R = [('Markov|Tchebychev', 'inégalité de Bienaymé-Tchebychev', ['p-esperance'], []),
     ('Bernstein|Weierstrass', 'polynômes de Bernstein', ['p-loi-faible'], []),
     ('Slutsky', 'lemme de Slutsky', ['p-convergences'], ['convergence-loi']),
     ('\\\\varphi_|fonction caract', 'fonctions caractéristiques', ['fo-caracteristiques', 'fo-levy'], ['fonction-caracteristique'])]
FOND = ['p-convergences']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
