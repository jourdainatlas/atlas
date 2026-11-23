"""Métadonnées proposées pour la feuille Licence 3, UE Structures algébriques, chapitre 7 (Extensions de corps)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 5, 'éléments algébriques, degré', ['gs-extensions', 'gs-algebriques'], ['element-algebrique', 'polynome-minimal', 'degre-extension']),
           (6, 9, 'corps de rupture et de décomposition', ['gs-decomposition'], ['corps-rupture', 'corps-decomposition']),
           (10, 11, 'constructions à la règle et au compas', ['gc-wantzel', 'gs-extensions'], ['degre-extension'])]
R = [(r'transcendant|dénombrable', 'nombres transcendants', ['gs-algebriques'], []),
     (r'discriminant', 'discriminant', ['pol-racines'], []),
     (r'Tchebychev|\\cos', 'polynômes de Tchebychev', ['gc-wantzel'], [])]
FOND = ['gs-extensions']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
