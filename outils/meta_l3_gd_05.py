"""Métadonnées proposées pour la feuille Licence 3, UE Géométrie différentielle, chapitre 5 (Formes différentielles)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 3, 'algèbre extérieure', ['v-formes-alternees', 'v-algebre-exterieure'], ['forme-alternee', 'produit-exterieur']),
           (4, 7, 'différentielle extérieure', ['gd-formes'], ['forme-differentielle', 'differentielle-exterieure']),
           (8, 10, 'lemme de Poincaré', ['gd-poincare'], ['forme-fermee', 'forme-exacte', 'partie-etoilee']),
           (11, 16, 'intégrales curvilignes', ['gd-integrale-curviligne'], ['forme-fermee', 'forme-exacte', 'homotopie-chemins'])]
R = [('d\'Alembert', 'théorème de d\'Alembert-Gauss', ['c-dalembert'], []),
     ('homotop', 'homotopie', ['ta-homotopie'], ['homotopie-chemins'])]
FOND = ['gd-formes']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
