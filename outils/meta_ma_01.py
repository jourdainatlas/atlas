"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 01 (logique et ensembles)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 3, 'connecteurs et tables de vérité', ['l-connecteurs', 'l-tautologies'], ['connecteur']),
    (4, 10, 'quantificateurs', ['l-syntaxe'], ['quantificateur']),
    (11, 27, 'modes de raisonnement', ['l-connecteurs'], []),
    (28, 41, 'ensembles', ['zf-operations'], ['ensemble']),
]
R = [
    (r'table de vérité|tautolog|\\uparrow|toujours vraie', 'tautologies', ['l-tautologies'], ['tautologie']),
    (r'négation', 'négation', ['l-tautologies'], []),
    (r'contraposée|contraposition', 'contraposition', ['l-connecteurs'], []),
    (r'absurde|irrationnel', "raisonnement par l'absurde", [], []),
    (r'contre-exemple', 'contre-exemple', [], []),
    (r'analyse-synthèse|déterminer toutes les fonctions|on cherche toutes les fonctions', 'analyse-synthèse', [], []),
    (r'récurrence|fibonacci|hanoï|pour tout \$n \\in \\mathbb\{n\}|pour tout entier \$n \\geqslant', 'récurrence', ['n-recurrence'], []),
    (r'\\forall|\\exists', 'quantificateurs', ['l-syntaxe'], ['quantificateur']),
    (r'divisible|pair|premier', 'divisibilité', ['z-division'], []),
    (r'suite', 'suites', ['ar-suites'], ['suite']),
    (r'\\subset|inclus', 'inclusion', ['zf-ext'], ['ensemble']),
    (r'\\cap|\\cup|complémentaire|\\setminus|\\overline\{a', 'opérations sur les parties', ['zf-operations'], []),
    (r'\\bigcup|\\bigcap', "réunion et intersection d'une famille", ['r-familles'], ['famille']),
    (r'\\mathcal\{p\}|parties de', 'ensemble des parties', ['zf-parties'], ['ensemble-parties']),
    (r'\\times|produit cartésien|couple', 'produit cartésien', ['r-produit'], ['produit-cartesien']),
    (r'partition|partage', 'partitions', ['r-equivalence'], ['partition']),
    (r'extension|compréhension', 'description des ensembles', ['zf-sep'], []),
    (r'tiroir', 'principe des tiroirs', ['n-fini'], []),
]
FOND = ['l-connecteurs', 'zf-operations']
EXTRA = {47: (['écriture en base r', 'récurrence'], ['n-recurrence'], [])}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
