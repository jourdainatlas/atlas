"""Métadonnées proposées pour la feuille Licence 3, UE Probabilités, chapitre 9 (Lois des grands nombres, théorème central limite)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 9, 'lois des grands nombres', ['p-loi-faible', 'p-loi-forte'], ['convergence-presque-sure', 'convergence-probabilite']),
           (10, 17, 'théorème central limite', ['p-tcl'], ['convergence-loi', 'loi-normale']),
           (18, 23, 'statistique asymptotique', ['p-tcl', 'p-loi-forte'], ['convergence-loi']),
           (24, 26, 'démonstration du TCL', ['fo-tcl', 'fo-caracteristiques'], ['fonction-caracteristique', 'convergence-loi']),
           (27, 29, 'modes de convergence', ['p-convergences'], ['convergence-loi'])]
R = [('Borel-Cantelli', 'lemme de Borel-Cantelli', ['p-borel-cantelli'], []),
     ('Poisson|\\\\loiP', 'loi de Poisson', ['p-poisson-exp'], ['loi-poisson']),
     ('confiance', 'intervalle de confiance', ['p-tcl'], [])]
FOND = ['p-tcl']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
