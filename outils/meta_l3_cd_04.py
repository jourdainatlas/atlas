"""Métadonnées proposées pour la feuille Licence 3, UE calcul différentiel, chapitre 4 (Ordre supérieur, Taylor)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 2, 'applications bilinéaires continues', ['f-operateurs'], ['forme-bilineaire']), (3, 7, "différentielles d'ordre supérieur", ['gd-classe-ck'], ['classe-ck']), (8, 14, 'formules de Taylor', ['de-taylor', 'fq-taylor-young'], ['formule-taylor-young']), (15, 15, 'convexité', ['fq-extremums'], ['fonction-convexe']), (16, 16, 'symétrie des dérivées secondes', ['gd-schwarz'], []), (17, 17, "lemme d'Hadamard", ['de-taylor'], []), (18, 19, 'synthèse', [], [])]
R = [('hessienne', 'matrice hessienne', ['fq-taylor-young'], ['matrice-hessienne']), ('Schwarz', 'théorème de Schwarz', ['gd-schwarz'], []), ('Taylor', 'formules de Taylor', ['fq-taylor-young'], ['formule-taylor-young'])]
FOND = ['gd-classe-ck']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
