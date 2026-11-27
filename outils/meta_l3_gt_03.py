"""Métadonnées proposées pour la feuille Licence 3, UE Géométrie et topologie, chapitre 3 (Constructions d'espaces)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 4, 'topologie quotient', ['t-quotient'], ['topologie-quotient', 'ensemble-quotient']), (5, 10, 'recollements', ['t-quotient', 'cw-recollement'], ['topologie-quotient', 'espaces-homeomorphes'])]
R = [('groupe topologique', 'groupe topologique', ['t-quotient'], []), ('séparé', 'séparation des quotients', ['t-separe'], ['separe'])]
FOND = ['t-quotient']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
