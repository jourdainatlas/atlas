"""Métadonnées proposées pour la feuille Licence 3, UE Probabilités, chapitre 10 (Vecteurs gaussiens)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 6, 'vecteurs gaussiens', ['p-normale', 'fo-caracteristiques'], ['loi-normale', 'covariance']),
           (7, 10, 'calculs gaussiens', ['p-normale'], ['loi-normale', 'fonction-caracteristique']),
           (11, 13, 'échantillons gaussiens', ['p-normale', 'p-independance'], ['loi-normale']),
           (14, 17, 'convergence en loi des vecteurs', ['fo-tcl', 'fo-levy'], ['convergence-loi'])]
R = [('Cochran|khi|\\\\chi', 'loi du khi-deux', ['p-normale'], []),
     ('Student|\\\\mathcal\\{T\\}', 'loi de Student', ['p-normale'], []),
     ('r[ée]gression', 'régression', ['p-esperance'], ['covariance'])]
FOND = ['p-normale']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
