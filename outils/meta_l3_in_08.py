"""Métadonnées proposées pour la feuille Licence 3, UE Intégration, chapitre 8 (Espaces L^p)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 7, 'inégalités de Hölder et Minkowski', ['lp-holder', 'lp-minkowski', 'lp-young'], ['inegalite-holder', 'inegalite-minkowski']),
           (8, 14, 'les espaces L^p', ['lp-completude', 'lp-inclusions', 'lp-densite'], ['espace-Lp']),
           (15, 20, 'convergences dans L^p', ['lp-completude'], ['espace-Lp']),
           (21, 22, 'compléments sur L^p', ['lp-dual', 'lp-radon-nikodym'], ['espace-Lp'])]
R = [(r'Hilbert|L\^\{?2\}?.*produit scalaire', 'espace de Hilbert', ['f-hilbert'], ['espace-hilbert']),
     (r'Radon|Nikodym|absolument continue', 'théorème de Radon-Nikodym', ['lp-radon-nikodym'], ['absolument-continue', 'derivee-radon-nikodym', 'mesure-densite']),
     (r'dual', 'dualité', ['lp-dual'], ['dual-topologique']),
     (r'Young', 'inégalité de Young', ['lp-young'], []),
     (r'dense|densité', 'densité', ['lp-densite'], [])]
FOND = ['lp-holder']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
