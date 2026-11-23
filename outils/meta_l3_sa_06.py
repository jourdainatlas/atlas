"""Métadonnées proposées pour la feuille Licence 3, UE Structures algébriques, chapitre 6 (Polynômes symétriques, résultant)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 5, 'polynômes symétriques', ['pol-anneau', 'pol-racines'], ['racine-polynome', 'polynome-scinde']),
           (6, 8, 'discriminant', ['pol-racines', 'pol-derivee'], ['racine-multiple']),
           (9, 10, 'résultant, élimination', ['v-det-matrice', 'pol-racines'], ['racine-polynome'])]
R = [(r'\\An\{|alterné|\\Sn\{', 'groupe symétrique', ['v-permutations'], ['groupe-alterne']),
     (r'Newton', 'sommes de Newton', ['pol-racines'], [])]
FOND = ['pol-racines']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
