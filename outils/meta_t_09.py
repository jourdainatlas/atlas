"""Métadonnées proposées pour la feuille Terminale, chapitre 9 (fonctions trigonométriques)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'\\cos|\\sin|cosinus|sinus|trigonom', 'cosinus et sinus', ['cx-pi'], ['pi']),
    (r'cercle trigonométrique|valeur exacte|valeurs remarquables', 'valeurs remarquables', [], []),
    (r'périod', 'périodicité', ['cx-pi'], []),
    (r'paire|impaire|parité', 'parité', [], []),
    (r'graphiquement|courbe|tracer|lire', 'lecture graphique', [], []),
    (r'dérivée|dérivable|f\'\(x\)|g\'\(x\)|h\'\(t\)', 'dérivée', ['ar-deriv'], ['derivable']),
    (r'compos|\\sin\(\d*x|\\cos\(\d+x|\\cos\(2x', 'fonction composée', [], ['composee']),
    (r'tangente', 'tangente', ['ar-deriv'], []),
    (r'\\lim', 'limite', [], []),
    (r'primitive', 'primitive', ['ar-tfa'], []),
    (r'\\int', 'intégrale', ['ar-riemann'], []),
    (r'tableau de variations|sens de variation|tableau de signes|signe', 'étude de signe et de variations', [], []),
    (r'équation|inéquation|résoudre', 'équations trigonométriques', [], []),
    (r'marée|port|pendule|hauteur d\'eau', 'modélisation', [], []),
    (r'cos\^\{?2\}?|\\sin\^\{?2\}?|sin\(2x\)\s*=|duplication', 'formules trigonométriques', [], []),
    (r'wallis|viète|radicaux', 'suites et produits', ['ar-suites'], []),
    (r'inégalité|\\leqslant x', 'inégalité', [], []),
    (r'y\'|f\'\(x\)\+3f', 'équation différentielle', ['ed-cauchy-lipschitz'], []),
]

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
