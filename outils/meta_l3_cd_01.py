"""Métadonnées proposées pour la feuille Licence 3, UE calcul différentiel, chapitre 1 (Espaces normés)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 12, 'normes et topologie', ['gd-normes', 'me-topologie'], ['norme', 'boule-ouverte']), (13, 14, 'applications continues', ['me-sequentielle', 't-continue'], []), (15, 15, 'compacité', ['me-compacite-sequentielle'], ['compact']), (16, 19, 'dimension finie', ['gd-equivalence'], ['normes-equivalentes']), (20, 23, 'complétude', ['me-cauchy', 'f-evn'], ['espace-complet', 'banach']), (24, 30, 'applications linéaires continues', ['f-operateurs'], ['norme-subordonnee']), (31, 34, 'normes matricielles', ['f-operateurs'], ['norme-subordonnee']), (35, 35, 'synthèse', [], [])]
R = [('Cauchy|complet', 'complétude', ['me-cauchy'], ['suite-cauchy']), ('compact', 'compacité', ['me-compacite-sequentielle'], ['compact']), ('équivalent', 'normes équivalentes', ['gd-equivalence'], ['normes-equivalentes']), ('Hölder|Young', 'inégalités de Hölder et de Young', ['gd-normes'], []), ('convexe', 'convexité', ['gd-normes'], ['partie-convexe'])]
FOND = ['gd-normes']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
