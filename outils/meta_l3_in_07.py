"""Métadonnées proposées pour la feuille Licence 3, UE Intégration, chapitre 7 (Produits de mesures, Fubini)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 9, 'tribu produit, mesure produit', ['m-produit'], ['tribu-produit', 'pave-mesurable', 'section-partie-produit', 'mesure-produit', 'mesure-sigma-finie']),
           (10, 17, 'calculs d\'intégrales et de volumes', ['m-fubini'], ['integrale-iteree']),
           (18, 25, 'applications de Fubini', ['m-fubini'], ['integrale-iteree'])]
R = [(r'\\sigma\s*-?\s*fini|sigma-fini', 'mesures σ-finies', ['m-produit'], ['mesure-sigma-finie']),
     (r'gaussienne|e\^\{-x\^\{?2', 'intégrale de Gauss', ['cv-gaussienne'], []),
     (r'section', 'sections', ['m-produit'], ['section-partie-produit']),
     (r'volume', 'calcul de volumes', ['m-fubini'], [])]
FOND = ['m-fubini']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
