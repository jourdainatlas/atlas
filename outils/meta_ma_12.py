"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 12 (arithmétique dans ℤ)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 7, 'divisibilité', ['z-division'], ['division-euclidienne']),
    (8, 12, 'PGCD et Bézout', ['z-bezout'], ['pgcd']),
    (13, 23, 'entiers premiers entre eux', ['z-bezout'], ['pgcd']),
    (24, 35, 'nombres premiers', ['z-premiers'], ['nombre-premier']),
    (36, 51, 'congruences', ['z-zn'], ['congruence']),
]
R = [
    (r'division euclidienne|reste', 'division euclidienne', ['z-division'], ['division-euclidienne']),
    (r'divis|\\mid', 'divisibilité', ['z-division'], []),
    (r'base \$?[0-9b]', 'écriture en base b', ['z-division'], []),
    (r'\\wedge|pgcd|euclide', 'PGCD et algorithme d\'Euclide', ['z-bezout'], ['pgcd']),
    (r'\\vee|ppcm', 'PPCM', ['z-bezout'], []),
    (r'bézout|ax \+ by|premiers entre eux', 'Bézout', ['z-bezout'], []),
    (r'fibonacci', 'suite de Fibonacci', ['n-recurrence'], []),
    (r'premier', 'nombres premiers', ['z-premiers'], ['nombre-premier']),
    (r'valuation|v_\{p\}|facteurs premiers|carré parfait', 'décomposition en facteurs premiers', ['z-premiers'], []),
    (r'irrationnel', 'irrationalité', ['q-irrationnel'], []),
    (r'\\equiv|congru|modulo|\\md', 'congruences', ['z-zn'], ['congruence']),
    (r'fermat', 'petit théorème de Fermat', ['rq-fermat'], []),
    (r'wilson', 'théorème de Wilson', ['rq-wilson'], []),
    (r'chinois|système de congruences', 'lemme chinois', ['ac-chinois'], []),
    (r'\\sigma\(|\\tau\(|diviseurs positifs', 'fonctions arithmétiques', ['z-premiers'], []),
]
FOND = ['z-division']
EXTRA = {59: (['équations diophantiennes', 'décomposition en facteurs premiers'], ['z-premiers'], ['nombre-premier']), 60: (['puissances parfaites', 'entiers premiers entre eux'], ['z-bezout', 'z-premiers'], ['pgcd']), 63: (['suites d\'entiers', 'congruences'], ['z-zn'], ['congruence'])}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
