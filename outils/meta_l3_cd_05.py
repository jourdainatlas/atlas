"""Métadonnées proposées pour la feuille Licence 3, UE calcul différentiel, chapitre 5 (Extrema)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 6, 'points critiques', ['fq-points-critiques', 'fq-extremums'], ['point-critique', 'extremum-local-rn']), (7, 9, 'extrema sur un compact', ['fq-points-critiques', 'me-compacite-sequentielle'], ['extremum-local-rn']), (10, 11, 'formes quadratiques', ['fq-extremums', 'f-spectral-fini'], ['matrice-hessienne']), (12, 17, 'extrema liés', ['cdiff-lagrange'], ['extremum-lie'])]
R = [('Lagrange|sphère|contrainte', 'multiplicateurs de Lagrange', ['cdiff-lagrange'], ['extremum-lie']), ('hessienne|rt - s', 'matrice hessienne', ['fq-extremums'], ['matrice-hessienne']), ('vecteur propre|symétrique', 'matrices symétriques', ['f-spectral-fini'], [])]
FOND = ['fq-points-critiques']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
