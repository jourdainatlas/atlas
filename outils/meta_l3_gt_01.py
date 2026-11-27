"""Métadonnées proposées pour la feuille Licence 3, UE Géométrie et topologie, chapitre 1 (Espaces topologiques)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 6, 'topologies et bases', ['t-espace', 't-base'], ['espace-topologique', 'base-topologie', 'ouvert']), (7, 10, 'intérieur et adhérence', ['t-adherence', 't-voisinages', 't-induite'], ['interieur', 'adherence', 'ferme']), (11, 12, 'continuité et produits', ['t-continue', 't-produit'], ['continuite', 'topologie-produit'])]
R = [('séparé', 'séparation', ['t-separe'], ['separe']), ('métrisable|distance', 'topologie métrique', ['t-espace'], [])]
FOND = ['t-espace']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
