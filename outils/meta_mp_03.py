"""Métadonnées proposées pour la feuille Maths Spé – MP, chapitre 3 (polynômes d'endomorphismes et réduction)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 8, 'polynômes d\'un endomorphisme', ['rd-polynomes-endo'], ['polynome-annulateur', 'polynome-minimal-endomorphisme']),
    (9, 15, 'lemme des noyaux', ['rd-noyaux'], []),
    (16, 32, 'annulateurs et réduction', ['rd-diagonalisable', 'rd-polynomes-endo'], ['polynome-annulateur', 'diagonalisable']),
    (33, 40, 'Cayley-Hamilton', ['rd-cayley-hamilton'], []),
    (41, 46, 'sous-espaces caractéristiques', ['rd-caracteristiques'], ['sous-espace-caracteristique']),
    (47, 50, 'synthèse', [], []),
]
R = [
    (r'\\pi_|polynôme minimal', 'polynôme minimal', ['rd-polynomes-endo'], ['polynome-minimal-endomorphisme']),
    (r'annulateur|annule', 'polynômes annulateurs', ['rd-polynomes-endo'], ['polynome-annulateur']),
    (r'\\ker [a-z]\([a-z]\)|décomposition des noyaux|\\ker q|\\ker p', 'lemme des noyaux', ['rd-noyaux'], []),
    (r'diagonalis', 'diagonalisation', ['rd-diagonalisable'], ['diagonalisable']),
    (r'trigonalis|triangulaire', 'trigonalisation', ['rd-trigonalisable'], ['endomorphisme-trigonalisable']),
    (r'cayley|\\chi_', 'Cayley-Hamilton', ['rd-cayley-hamilton'], []),
    (r'caractéristique|n_\{\\lambda\}', 'sous-espaces caractéristiques', ['rd-caracteristiques'], ['sous-espace-caracteristique']),
    (r'nilpotent', 'nilpotents', ['rd-nilpotents'], ['endomorphisme-nilpotent']),
    (r'stable|induit', 'sous-espaces stables', ['rd-stables'], ['sous-espace-stable']),
    (r'commut', 'endomorphismes qui commutent', ['rd-diagonalisable'], []),
    (r'cyclique', 'endomorphismes cycliques', ['rd-polynomes-endo'], []),
    (r'irréductible|\\q\[x\]|\\mathbb\{q\}', 'polynômes irréductibles', ['pol-irreductibles'], []),
    (r'groupe', 'groupes de matrices', ['a-groupe'], []),
]
FOND = ['rd-polynomes-endo']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
