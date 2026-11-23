"""Métadonnées proposées pour la feuille Licence 3, UE Structures algébriques, chapitre 2 (Idéaux, anneaux quotients)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 3, 'idéaux', ['a-ideal'], ['ideal', 'ideal-principal']),
           (4, 8, 'anneaux quotients', ['a-anneau-quotient'], ['ideal']),
           (9, 10, 'idéaux premiers et maximaux', ['a-premier-maximal'], ['ideal-premier', 'ideal-maximal']),
           (11, 15, 'lemme chinois', ['ac-chinois'], ['anneau-produit'])]
R = [(r'nilpotent|radical|\\sqrt\{I\}|\\sqrt\{\\gen', 'radical, nilradical', ['ga-nilradical'], ['nilradical', 'radical-ideal']),
     (r'Zorn', 'lemme de Zorn', ['o-zorn'], []),
     (r'premier|maximal', 'idéaux premiers et maximaux', ['a-premier-maximal'], ['ideal-premier', 'ideal-maximal'])]
FOND = ['a-ideal']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
