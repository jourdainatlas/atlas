"""Métadonnées proposées pour la feuille Licence 3, UE Géométrie différentielle, chapitre 1 (Courbes de R^n)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 6, 'arcs paramétrés', ['cb-courbes', 'cb-abscisse'], ['courbe-parametree', 'courbe-reguliere', 'longueur-courbe']),
           (7, 12, 'courbure', ['cb-courbure-plane', 'cb-planes'], ['courbure-courbe', 'parametree-longueur']),
           (13, 17, 'courbes gauches', ['cb-frenet'], ['repere-frenet', 'torsion-courbe', 'courbe-bireguliere']),
           (18, 20, 'courbes planes fermées', ['cb-planes', 'cb-fondamental'], ['courbure-courbe'])]
R = [('hélice', 'hélice', ['cb-helice'], []),
     ('équations? intrinsèques?', 'équation intrinsèque', ['cb-fondamental'], []),
     ('cercle osculateur', 'cercle osculateur', ['cb-courbure-plane'], ['courbure-courbe'])]
FOND = ['cb-courbes']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
