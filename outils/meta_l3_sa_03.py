"""Métadonnées proposées pour la feuille Licence 3, UE Structures algébriques, chapitre 3 (Anneaux factoriels et principaux)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 3, 'éléments irréductibles et premiers', ['ac-divisibilite', 'ac-factoriels'], ['element-irreductible', 'element-premier']),
           (4, 6, 'PGCD, PPCM et idéaux', ['ac-factoriels', 'ac-principaux'], ['pgcd-anneau', 'premiers-entre-eux']),
           (7, 11, 'anneaux principaux et euclidiens', ['ac-principaux'], ['anneau-principal', 'anneau-euclidien'])]
R = [(r'euclidien|stathme|norme', 'anneaux euclidiens', ['ac-principaux'], ['anneau-euclidien', 'stathme']),
     (r'B[ée]zout', 'relation de Bézout', ['z-bezout'], []),
     (r'factoriel', 'anneaux factoriels', ['ac-factoriels'], ['anneau-factoriel'])]
FOND = ['ac-divisibilite']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
