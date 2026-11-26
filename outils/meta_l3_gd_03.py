"""Métadonnées proposées pour la feuille Licence 3, UE Géométrie différentielle, chapitre 3 (Surfaces : formes fondamentales et courbures)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 5, 'première forme fondamentale', ['sf-premiere-forme', 'sf-aire'], ['surface-parametree', 'aire-surface']),
           (6, 10, 'courbures', ['sf-gauss', 'sf-courbures'], ['courbure-gauss', 'courbure-moyenne', 'courbures-principales']),
           (11, 12, 'courbures', ['sf-courbures', 'sf-gauss'], ['courbure-gauss', 'courbures-principales'])]
R = [('tore|caténoïde', 'tore et caténoïde', ['sf-tore-catenoide'], []),
     ('Weingarten', 'endomorphisme de Weingarten', ['sf-gauss'], ['application-gauss'])]
FOND = ['sf-surfaces']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
