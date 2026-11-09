"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 13 (polynômes et fractions rationnelles)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 4, "l'anneau K[X]", ['pol-anneau'], ['anneau-polynomes']),
    (5, 9, 'division euclidienne', ['pol-division'], ['division-euclidienne']),
    (10, 18, 'racines', ['pol-evaluation', 'pol-racines'], []),
    (19, 27, 'dérivation', ['pol-derivee'], ['derivee-formelle']),
    (28, 32, 'arithmétique des polynômes', ['pol-principal'], ['pgcd']),
    (33, 37, 'polynômes irréductibles', ['pol-irreductibles', 'c-dalembert'], ['polynome-irreductible']),
    (38, 39, 'interpolation de Lagrange', ['pol-racines'], []),
    (40, 44, 'fractions rationnelles', ['a-fractions'], ['corps-fractions']),
    (45, 53, 'décomposition en éléments simples', ['a-fractions'], []),
]
R = [
    (r'degré', 'degré', ['pol-anneau'], []),
    (r'division euclidienne|reste', 'division euclidienne', ['pol-division'], []),
    (r'racine', 'racines', ['pol-racines'], []),
    (r'multiplicité|racine (double|triple|multiple)', 'multiplicité', ['pol-derivee'], ['multiplicite-racine']),
    (r'p\'|dérivé|taylor', 'polynôme dérivé', ['pol-derivee'], ['derivee-formelle']),
    (r'coefficients et racines|\\sigma_|somme des racines|produit des racines', 'relations coefficients-racines', ['pol-racines'], []),
    (r'\\wedge|pgcd|bézout|premiers entre eux', 'PGCD et Bézout', ['pol-principal'], ['pgcd']),
    (r'irréductible|factoris', 'factorisation', ['pol-irreductibles'], ['polynome-irreductible']),
    (r'\\mathbb\{c\}\[x\]|d\'alembert', 'polynômes complexes', ['c-dalembert'], []),
    (r'racines? (n-ièmes|\$n\$-ièmes|de l\'unité)|x\^\{n\} - 1', "racines de l'unité", ['cx-exponentielle'], []),
    (r'lagrange|interpol', 'interpolation de Lagrange', ['pol-racines'], []),
    (r'tchebychev|chebyshev', 'polynômes de Tchebychev', ['pol-anneau'], []),
    (r'fraction|éléments simples|pôle', 'fractions rationnelles', ['a-fractions'], ['corps-fractions']),
    (r'\\int|primitive', 'intégration des fractions', ['ar-tfa'], []),
    (r'\\sum', 'sommes', ['n-sommes'], []),
]
FOND = ['pol-anneau']
EXTRA = {55: (['coefficients binomiaux', 'polynômes à coefficients entiers'], ['pol-binome', 'pol-anneau'], ['anneau-polynomes']), 56: (['racines de l\'unité', 'produits de distances'], ['pol-racines', 'cx-exponentielle'], []), 61: (['polynômes positifs', 'sommes de deux carrés'], ['pol-irreductibles', 'c-dalembert'], ['polynome-irreductible']), 66: (['polynômes scindés', 'théorème de Rolle'], ['pol-derivee', 'pol-racines'], ['derivee-formelle'])}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
