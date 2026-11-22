"""Métadonnées proposées pour la feuille Licence 3, UE Intégration, chapitre 6 (Changement de variables)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 4, 'changement de variables en dimension 1', ['cv-changement'], ['diffeomorphisme']),
           (5, 13, 'changement de variables dans le plan et l\'espace', ['cv-changement', 'cv-polaires'], ['jacobien', 'matrice-jacobienne', 'diffeomorphisme']),
           (14, 18, 'coordonnées sphériques, fonctions radiales', ['cv-changement', 'cv-polaires'], ['jacobien']),
           (19, 24, 'intégrales eulériennes', ['cv-changement', 'cv-gaussienne'], ['jacobien'])]
R = [(r'gaussienne|e\^\{-x\^\{?2|e\^\{-\\|x\\\|\^\{?2', 'intégrale de Gauss', ['cv-gaussienne'], []),
     (r'polaires', 'coordonnées polaires', ['cv-polaires'], []),
     (r'n[ée]gligeable|Sard', 'ensembles négligeables', ['m-lebesgue'], ['negligeable']),
     (r'\\Gamma|\\mathrm\{B\}|Beta|bêta', 'fonctions Gamma et Bêta', ['cv-gaussienne'], [])]
FOND = ['cv-changement']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
