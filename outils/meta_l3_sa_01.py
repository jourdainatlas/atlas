"""Métadonnées proposées pour la feuille Licence 3, UE Structures algébriques, chapitre 1 (Groupes, anneaux, corps)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 3, 'lois de composition, groupes', ['a-groupe', 'a-sous-groupe'], ['groupe', 'sous-groupe']),
           (4, 4, 'équations dans un groupe', ['a-groupe', 'gs-lagrange'], ['groupe', 'ordre-element']),
           (5, 7, 'sous-groupes', ['a-sous-groupe'], ['sous-groupe', 'sous-groupe-engendre']),
           (8, 9, 'ordre d\'un élément', ['gf-cycliques'], ['ordre-element', 'groupe-cyclique']),
           (10, 12, 'théorème de Lagrange', ['gs-lagrange', 'v-permutations'], ['indice-sous-groupe', 'ordre-element']),
           (13, 16, 'congruences', ['z-zn'], ['anneau-zn', 'inversible']),
           (17, 20, 'anneaux et corps', ['a-anneau', 'a-corps', 'a-fractions'], ['anneau', 'anneau-integre', 'corps', 'sous-anneau'])]
R = [(r'\\Sn\{|\\An\{|permutation|transposition', 'groupe symétrique', ['v-permutations'], ['groupe-symetrique']),
     (r'Fermat|Wilson', 'petit théorème de Fermat', ['gs-lagrange'], []),
     (r'corps des fractions|\\Frac', 'corps des fractions', ['a-fractions'], ['corps-fractions']),
     (r'morphisme', 'morphismes', ['a-morphisme'], ['morphisme-groupes'])]
FOND = ['a-groupe']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
