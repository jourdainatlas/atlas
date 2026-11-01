"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 04 (complexes et trigonométrie)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 11, 'trigonométrie', ['cx-pi'], ['pi']),
    (12, 19, 'calcul dans ℂ', ['c-calcul'], ['nombre-complexe', 'module-complexe']),
    (20, 26, 'formules d\'Euler et de Moivre', ['cx-exponentielle'], ['exponentielle']),
    (27, 30, 'forme trigonométrique', ['cx-exponentielle', 'cx-pi'], ['module-complexe']),
    (31, 37, 'équations algébriques', ['c-racines-carrees'], ['nombre-complexe']),
    (38, 45, "racines n-ièmes", ['cx-exponentielle', 'cx-pi'], []),
    (46, 47, 'exponentielle complexe', ['cx-exponentielle'], ['exponentielle']),
    (48, 53, 'géométrie complexe', ['c-calcul', 'cx-exponentielle'], ['module-complexe']),
]
R = [
    (r'\\cos|\\sin|\\tan|trigonométrique', 'trigonométrie', ['cx-pi'], ['pi']),
    (r'formules? d\'addition|\\cos\(a \+ b\)', "formules d'addition", ['cx-exponentielle'], []),
    (r'linéaris', 'linéarisation', ['cx-exponentielle'], []),
    (r'moivre|euler', "formules d'Euler et de Moivre", ['cx-exponentielle'], ['exponentielle']),
    (r'module|\|z\|', 'module', ['c-calcul'], ['module-complexe']),
    (r'conjugu|\\overline\{z', 'conjugué', ['c-calcul'], []),
    (r'inégalité triangulaire', 'inégalité triangulaire', ['c-calcul'], []),
    (r'racines? carrées?|second degré|discriminant', 'équations du second degré', ['c-racines-carrees'], []),
    (r'racines? (n-ièmes|\$n\$-ièmes|cubiques|de l\'unité)|\\mathbb\{u\}_\{', "racines de l'unité", ['cx-exponentielle'], []),
    (r'argument', 'argument', ['cx-pi'], []),
    (r'polyn', 'polynômes', ['z-polynomes'], []),
    (r'similitude|rotation|homothétie|translation', 'similitudes', ['c-calcul'], []),
    (r'alignés|orthogonal|triangle|cercle|équilatéral', 'géométrie complexe', ['c-calcul'], []),
    (r'\\mathbb\{u\}', 'groupe 𝕌', ['c-calcul'], []),
    (r'\\sum|binom', 'sommes trigonométriques', ['n-sommes'], []),
]
FOND = ['c-calcul']
EXTRA = {55: (["racines de l'unité", 'module'], ['c-calcul', 'cx-exponentielle'], ['module-complexe'])}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
