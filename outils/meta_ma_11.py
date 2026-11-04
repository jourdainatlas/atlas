"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 11 (structures algébriques)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 7, 'lois de composition interne', ['a-loi', 'a-monoide'], ['loi-composition']),
    (8, 33, 'groupes', ['a-groupe'], ['groupe']),
    (34, 45, 'anneaux et corps', ['a-anneau'], ['anneau']),
]
R = [
    (r'associativ|commutativ|loi', 'lois de composition', ['a-loi'], ['loi-composition']),
    (r'neutre', 'élément neutre', ['a-monoide'], ['element-neutre']),
    (r'inversible|symétrique|inverse', 'éléments inversibles', ['a-monoide'], ['inversible']),
    (r'stable', 'parties stables', ['a-loi'], ['partie-stable']),
    (r'sous-groupe', 'sous-groupes', ['a-sous-groupe'], ['sous-groupe']),
    (r'permutation|\\mathfrak\{s\}|\\sg', 'groupe symétrique', ['a-groupe', 'v-det'], ['groupe-symetrique']),
    (r'morphisme', 'morphismes', ['a-morphisme'], ['morphisme-groupes']),
    (r'noyau|\\ker', 'noyau', ['a-morphisme'], ['noyau']),
    (r'isomorph', 'isomorphismes', ['a-morphisme'], ['isomorphisme']),
    (r'ordre d|cyclique|engendré', 'ordre et groupes cycliques', ['gf-cycliques'], []),
    (r'lagrange|cardinal d\'un sous-groupe', 'théorème de Lagrange', ['gs-lagrange'], []),
    (r'abélien|commutatif', 'groupes abéliens', ['a-groupe'], ['groupe-abelien']),
    (r'anneau', 'anneaux', ['a-anneau'], ['anneau']),
    (r'intègre|diviseur de zéro', 'anneaux intègres', ['a-anneau'], ['anneau-integre']),
    (r'corps', 'corps', ['a-corps'], ['corps']),
    (r'sous-anneau', 'sous-anneaux', ['a-morph-anneau'], ['sous-anneau']),
    (r'morphisme d\'anneaux', "morphismes d'anneaux", ['a-morph-anneau'], ['morphisme-anneaux']),
    (r'nilpotent|idempotent', 'éléments nilpotents', ['a-anneau'], []),
    (r'idéal', 'idéaux', ['a-ideal'], ['ideal']),
    (r'\\mathbb\{z\}/|modulo|z/n', 'ℤ/nℤ', ['z-zn'], ['anneau-zn']),
    (r'binôme', 'formule du binôme', ['pol-binome'], []),
]
FOND = ['a-groupe']
EXTRA = {51: (['groupes finis', 'principe des tiroirs'], ['a-groupe'], ['groupe'])}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
