"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 14 (espaces vectoriels et applications linéaires)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 4, 'espaces vectoriels', ['v-espace'], ['espace-vectoriel']),
    (5, 13, 'sous-espaces vectoriels', ['v-espace'], ['sous-espace-vectoriel']),
    (14, 25, 'familles de vecteurs', ['v-libre'], ['famille-libre']),
    (26, 35, 'somme de sous-espaces', ['v-somme-directe'], ['somme-directe']),
    (36, 52, 'applications linéaires', ['v-applications'], ['application-lineaire']),
    (53, 63, 'projecteurs et symétries', ['v-somme-directe', 'v-applications'], ['projecteur']),
    (64, 66, 'formes linéaires et hyperplans', ['v-dual'], ['forme-lineaire']),
    (67, 69, 'sous-espaces affines', ['v-espace', 'v-applications'], []),
]
R = [
    (r'sous-espace', 'sous-espaces vectoriels', ['v-espace'], ['sous-espace-vectoriel']),
    (r'combinaison linéaire|\\vect|engendr', 'sous-espace engendré', ['v-combinaisons'], ['combinaison-lineaire']),
    (r'génératrice', 'familles génératrices', ['v-libre'], ['famille-generatrice']),
    (r'libre|liée', 'familles libres', ['v-libre'], ['famille-libre']),
    (r'base', 'bases', ['v-libre'], ['base-vectorielle']),
    (r'supplémentaire|somme directe|\\oplus', 'sommes directes', ['v-somme-directe'], ['supplementaire', 'somme-directe']),
    (r'linéaire|endomorphisme', 'applications linéaires', ['v-applications'], ['application-lineaire']),
    (r'noyau|\\ker|image|\\img', 'noyau et image', ['v-applications'], ['noyau']),
    (r'projecteur|projection', 'projecteurs', ['v-somme-directe'], ['projecteur']),
    (r'symétrie', 'symétries', ['v-somme-directe'], []),
    (r'nilpotent', 'endomorphismes nilpotents', ['v-applications'], []),
    (r'\\gl|automorphisme|isomorphisme', 'isomorphismes', ['v-applications'], ['groupe-lineaire']),
    (r'forme linéaire|hyperplan', 'formes linéaires', ['v-dual'], ['forme-lineaire']),
    (r'affine', 'sous-espaces affines', ['v-espace'], []),
    (r'polynôme|\\mathbb\{k\}\[x\]', 'espaces de polynômes', ['pol-anneau'], []),
    (r'suite|fonction', 'espaces de fonctions et de suites', ['v-espace'], []),
    (r'équation différentielle|y\'', 'équations linéaires', ['ed-lineaires'], []),
]
FOND = ['v-espace']
EXTRA = {73: (['noyaux itérés', 'endomorphismes qui commutent'], ['v-applications'], ['noyau'])}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
