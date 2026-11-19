"""Métadonnées proposées pour la feuille Licence 3, UE calcul différentiel, chapitre 3 (Inversion locale, fonctions implicites)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 1, 'méthode de Newton', ['gd-inversion-locale'], []), (2, 10, 'inversion locale', ['gd-inversion-locale'], ['diffeomorphisme']), (11, 16, 'inversion globale', ['gd-inversion-locale'], ['diffeomorphisme']), (17, 26, 'fonctions implicites', ['gd-submersions'], []), (27, 32, 'sous-variétés et hyperplan tangent', ['gd-sous-varietes', 'gd-tangent-sm'], ['espace-tangent-sv']), (33, 33, 'synthèse', [], [])]
R = [('implicite', 'fonctions implicites', ['gd-submersions'], []), ('tangent', 'espace tangent', ['gd-tangent-sm'], ['espace-tangent']), ('sous-variété', 'sous-variétés', ['gd-sous-varietes'], ['espace-tangent-sv']), ('difféomorphisme', 'difféomorphismes', ['gd-inversion-locale'], ['diffeomorphisme'])]
FOND = ['gd-inversion-locale']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
