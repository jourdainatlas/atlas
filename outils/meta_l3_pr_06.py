"""Métadonnées proposées pour la feuille Licence 3, UE Probabilités, chapitre 6 (Séries génératrices et fonctions caractéristiques)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 5, 'séries génératrices', ['p-esperance', 'p-independance'], ['esperance', 'loi-variable']),
           (6, 11, 'fonctions caractéristiques', ['fo-caracteristiques'], ['fonction-caracteristique']),
           (12, 12, 'théorème abélien', ['p-esperance'], ['esperance'])]
R = [('Poisson|\\\\loiP', 'loi de Poisson', ['p-poisson-exp'], ['loi-poisson']),
     ('Cauchy', 'loi de Cauchy', ['fo-caracteristiques'], []),
     ('Cantor', 'loi de Cantor', ['p-cantor'], ['loi-cantor']),
     ('\\\\mathcal\\{N\\}', 'loi normale', ['p-normale'], ['loi-normale'])]
FOND = ['p-esperance']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
