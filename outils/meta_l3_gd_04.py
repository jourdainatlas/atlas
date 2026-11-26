"""Métadonnées proposées pour la feuille Licence 3, UE Géométrie différentielle, chapitre 4 (Géodésiques et Theorema egregium)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 5, 'géodésiques', ['sf-geodesiques', 'sf-christoffel'], ['geodesique', 'symboles-christoffel']),
           (6, 7, 'relation de Clairaut', ['sf-geodesiques', 'sf-christoffel'], ['geodesique']),
           (8, 9, 'plus courts chemins', ['sf-exponentielle', 'sf-minimisation'], ['geodesique']),
           (10, 13, 'Theorema egregium', ['sf-egregium'], ['courbure-gauss', 'surfaces-isometriques'])]
R = [('polaires géodésiques', 'coordonnées polaires géodésiques', ['sf-polaires'], ['coordonnees-polaires-geodesiques']),
     ('Bertrand', 'Bertrand-Diguet-Puiseux', ['sf-polaires'], [])]
FOND = ['sf-geodesiques']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
