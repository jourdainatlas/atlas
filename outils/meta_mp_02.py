"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 2 (éléments propres et diagonalisation)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 4, 'algèbre linéaire', ['v-somme-directe'], ['somme-directe']),
    (5, 12, 'stables et éléments propres', ['rd-stables', 'v-valeurs-propres'], ['sous-espace-stable', 'valeur-propre', 'vecteur-propre']),
    (13, 16, 'polynôme caractéristique', ['rd-caracteristique'], ['polynome-caracteristique']),
    (17, 42, 'diagonalisation', ['rd-diagonalisable'], ['diagonalisable']),
    (43, 45, 'trigonalisation', ['rd-trigonalisable'], ['endomorphisme-trigonalisable']),
    (46, 51, 'nilpotents', ['rd-nilpotents'], ['endomorphisme-nilpotent']),
    (52, 55, 'synthèse', [], []),
]
R = [
    (r'somme directe|\\oplus|projecteur', 'sommes directes', ['v-somme-directe'], ['somme-directe']),
    (r'blocs?\b', 'matrices par blocs', ['rd-stables'], ['matrice-diagonale-blocs']),
    (r'stable', 'sous-espaces stables', ['rd-stables'], ['sous-espace-stable']),
    (r'valeur propre|valeurs propres|vecteur propre|\\sp\(', 'éléments propres', ['v-valeurs-propres'], ['valeur-propre']),
    (r'\\chi_|polynôme caractéristique', 'polynôme caractéristique', ['rd-caracteristique'], ['polynome-caracteristique']),
    (r'diagonalis', 'diagonalisation', ['rd-diagonalisable'], ['diagonalisable']),
    (r'trigonalis|triangulaire', 'trigonalisation', ['rd-trigonalisable'], ['endomorphisme-trigonalisable']),
    (r'nilpotent', 'nilpotents', ['rd-nilpotents'], ['endomorphisme-nilpotent']),
    (r'\\det|déterminant', 'déterminants', ['v-det-matrice'], []),
    (r'trace|\\trace|\\tr\b', 'trace', ['v-trace'], []),
    (r'puissance|a\^\{k\}|a\^\{n\}|suite', 'puissances d\'une matrice', ['rd-diagonalisable'], []),
]
FOND = ['v-valeurs-propres']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
