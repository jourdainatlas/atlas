"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 18 (intégration)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 2, 'fonctions continues par morceaux', ['ri-escalier', 'ri-continues'], ['fonction-escalier', 'continue-par-morceaux']),
    (3, 15, "propriétés de l'intégrale", ['ri-proprietes'], []),
    (16, 31, 'intégrale et primitives', ['ar-tfa'], []),
    (32, 37, 'formules de Taylor', ['de-taylor'], ['polynome-taylor']),
    (38, 45, 'sommes de Riemann', ['ri-sommes'], ['somme-riemann']),
    (46, 47, 'intégrales de Wallis', ['ri-proprietes', 'ar-tfa'], []),
]
R = [
    (r'escalier', 'fonctions en escalier', ['ri-escalier'], ['fonction-escalier']),
    (r'continue par morceaux', 'fonctions continues par morceaux', ['ri-continues'], ['continue-par-morceaux']),
    (r'moyenne|cauchy-schwarz', 'inégalités intégrales', ['ri-moyenne'], []),
    (r'\\int', 'intégrales', ['ri-proprietes'], []),
    (r'primitive|dérivable|\\int_\{[a-z0-9]*\}\^\{x', 'fonctions définies par une intégrale', ['ar-tfa'], []),
    (r'parties|changement de variable', 'calcul intégral', ['ar-tfa'], []),
    (r'taylor', 'formule de Taylor', ['de-taylor'], ['polynome-taylor']),
    (r'riemann|\\frac\{1\}\{n\}\s*\\sum|\\sum_\{k = 1\}\^\{n\}', 'sommes de Riemann', ['ri-sommes'], ['somme-riemann']),
    (r'rectangle|trapèze|valeur approchée', 'calcul approché', ['ri-sommes'], []),
    (r'wallis|stirling', 'intégrales de Wallis', ['ri-proprietes'], []),
    (r'limite|\\lim|tend vers', 'suites d\'intégrales', ['ri-proprietes', 'su-convergence'], []),
    (r'\\ln|logarithme|\\mathrm\{e\}\^', 'logarithme et exponentielle', ['ar-tfa'], []),
    (r'fraction rationnelle|éléments simples', 'intégration des fractions rationnelles', ['a-fractions', 'ar-tfa'], []),
    (r'\\mathbb\{c\}|complexe', 'fonctions à valeurs complexes', ['ri-proprietes'], []),
]
FOND = ['ar-riemann']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
