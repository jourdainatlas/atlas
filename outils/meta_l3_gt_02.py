"""Métadonnées proposées pour la feuille Licence 3, UE Géométrie et topologie, chapitre 2 (Connexité et compacité)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 8, 'connexité', ['t-connexe', 't-connexe-prop', 'tr-connexes'], ['connexe', 'connexe-par-arcs', 'composante-connexe-par-arcs']), (9, 13, 'compacité', ['t-compact', 't-compact-prop', 't-bij-compact'], ['compact'])]
R = [('localement connexe', 'connexité locale', ['t-connexe-prop'], ['localement-connexe-par-arcs'])]
FOND = ['t-connexe']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
