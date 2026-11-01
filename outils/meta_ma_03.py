"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 03 (calcul algébrique)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 8, 'sommes et produits', ['n-sommes'], []),
    (9, 16, 'sommes télescopiques', ['n-sommes'], []),
    (17, 24, 'sommes doubles', ['n-sommes'], []),
    (25, 37, 'coefficients binomiaux', ['n-sommes', 'n-fini'], ['coefficient-binomial']),
    (38, 42, 'systèmes linéaires', ['v-rang', 'alglin'], []),
]
R = [
    (r'changement d\'indice', "changement d'indice", ['n-sommes'], []),
    (r'télescop', 'télescopage', ['n-sommes'], []),
    (r'géométrique|x\^\{k\}|q\^\{k\}', 'somme géométrique', ['n-sommes'], []),
    (r'\\prod', 'produits', ['n-sommes'], []),
    (r'\\sum_\{(1 \\leqslant|0 \\leqslant)[^}]*\\leqslant', 'sommes doubles', ['n-sommes'], []),
    (r'binom|coefficients binomiaux', 'coefficients binomiaux', ['n-fini'], ['coefficient-binomial']),
    (r'binôme|\(a \+ b\)\^\{n\}|\(1 \+ x\)\^\{n\}', 'formule du binôme', ['n-sommes'], ['coefficient-binomial']),
    (r'récurrence', 'récurrence', ['n-recurrence'], []),
    (r'factorielle|!', 'factorielle', ['n-sommes'], []),
    (r'parties à|dénombr|combien', 'dénombrement', ['n-fini'], ['ensemble-fini']),
    (r'système|pivot|inconnues', 'systèmes linéaires', ['v-rang', 'alglin'], []),
    (r'\\cos|\\sin|\\mathrm\{e\}\^\{\\mathrm\{i\}', 'sommes trigonométriques', ['cx-exponentielle'], []),
]
FOND = ['n-sommes']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
