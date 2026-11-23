"""Métadonnées proposées pour la feuille Licence 3, UE Structures algébriques, chapitre 5 (Polynômes, irréductibilité)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 5, 'l\'anneau A[X]', ['pol-anneau', 'pol-division', 'pol-racines'], ['anneau-polynomes', 'degre-polynome']),
           (6, 8, 'contenu, lemme de Gauss', ['ac-contenu', 'ac-gauss'], ['contenu-factoriel', 'polynome-primitif-factoriel']),
           (9, 13, 'critères d\'irréductibilité', ['pol-eisenstein', 'pol-racines'], ['polynome-irreductible']),
           (14, 15, 'idéaux de Z[X]', ['a-premier-maximal', 'ac-gauss'], ['ideal-premier', 'ideal-maximal'])]
R = [(r'Eisenstein', 'critère d\'Eisenstein', ['pol-eisenstein'], []),
     (r"P'|d[ée]riv|multiple", 'racines multiples', ['pol-derivee'], ['racine-multiple']),
     (r'Alembert', 'théorème de d\'Alembert-Gauss', ['c-dalembert'], [])]
FOND = ['pol-anneau']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
