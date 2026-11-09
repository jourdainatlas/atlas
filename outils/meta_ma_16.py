"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 16 (matrices)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 7, 'calcul matriciel', ['v-matrices'], ['matrice', 'espace-matrices']),
    (8, 17, 'matrices carrées', ['v-matrices'], ['matrice']),
    (18, 29, 'matrice d\'une application linéaire', ['v-matrices'], ['matrice']),
    (30, 45, 'changements de bases', ['v-matrices', 'v-rang'], ['matrice-passage']),
    (46, 53, 'opérations élémentaires et systèmes', ['v-rang'], ['rang-matrice']),
]
R = [
    (r'transpos|\^\{\\top\}|\\tra', 'transposée', ['v-matrices'], ['matrice-transposee']),
    (r'inversible|inverse|\\gl|a\^\{-1\}', 'matrices inversibles', ['v-matrices'], ['matrice-inversible', 'groupe-lineaire']),
    (r'nilpotent', 'matrices nilpotentes', ['v-matrices'], []),
    (r'diagonale', 'matrices diagonales', ['v-matrices'], ['matrice-diagonale']),
    (r'triangulaire', 'matrices triangulaires', ['v-matrices'], ['matrice-triangulaire']),
    (r'symétrique|antisymétrique', 'matrices symétriques', ['v-matrices'], []),
    (r'commut', 'commutant', ['v-matrices'], []),
    (r'puissance|a\^\{n\}|a\^\{k\}|m\^\{n\}', 'puissances de matrices', ['v-matrices', 'pol-binome'], []),
    (r'binôme', 'formule du binôme', ['pol-binome'], []),
    (r'\\rg|rang', 'rang', ['v-rang'], ['rang-matrice']),
    (r'passage|changement de base', 'changement de base', ['v-matrices'], ['matrice-passage']),
    (r'équivalente', 'matrices équivalentes', ['v-rang'], ['matrices-equivalentes']),
    (r'semblable', 'matrices semblables', ['v-matrices'], ['matrices-semblables']),
    (r'\\tr\b|\\operatorname\{tr\}|trace', 'trace', ['v-trace'], ['trace']),
    (r'système|pivot|gauss|échelonn', 'systèmes linéaires', ['v-rang'], []),
    (r'projecteur|symétrie', 'projecteurs et symétries', ['v-somme-directe'], []),
    (r'polynôme|\\mathbb\{[kr]\}_\{n\}\[x\]', 'espaces de polynômes', ['pol-anneau'], []),
    (r'suite', 'suites récurrentes linéaires', ['v-matrices'], []),
    (r'forme linéaire|hyperplan', 'formes linéaires', ['v-dual'], ['forme-lineaire']),
    (r'permutation|\\sigma', 'matrices de permutation', ['a-groupe', 'v-matrices'], []),
    (r'sous-groupe|groupe fini', 'groupes de matrices', ['a-sous-groupe'], ['groupe-lineaire']),
]
FOND = ['v-matrices']
EXTRA = {
    60: (['annulateur d\'un endomorphisme', 'dimension'], ['v-rang', 'v-dimension'], []),
    65: (['problème de Dirichlet discret', 'matrices harmoniques'], ['v-rang', 'v-dimension'], []),
    66: (['entiers et parité', 'lemme fondamental'], ['v-echange'], []),
    67: (['théorème de Graham et Pollak', 'graphes'], ['v-rang'], ['rang-matrice']),
    70: (['équations fonctionnelles', 'déterminant'], ['v-matrices', 'v-det-matrice'], ['matrice-inversible']),
    71: (['matrices à coefficients entiers', 'monoïde libre'], ['v-matrices', 'a-monoide'], []),
}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
