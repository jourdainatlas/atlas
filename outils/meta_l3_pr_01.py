"""Métadonnées proposées pour la feuille Licence 3, UE Probabilités, chapitre 1 (Espaces probabilisés)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 4, 'évènements et tribus', ['p-espace', 'm-tribus'], ['tribu', 'tribu-engendree', 'espace-probabilise']),
           (5, 10, 'dénombrement', ['p-espace'], ['probabilite', 'coefficient-binomial']),
           (11, 16, 'probabilités sur un ensemble fini', ['p-espace'], ['probabilite', 'espace-probabilise']),
           (17, 18, 'formule de Poincaré', ['p-espace', 'm-mesures'], ['probabilite'])]
R = [('bor[ée]lien', 'tribu borélienne', ['m-tribus'], ['tribu-borelienne']),
     ('d[ée]rangement', 'dérangements', ['p-espace'], []),
     ('n[ée]gligeable|presque s[uû]r', 'évènement négligeable', ['p-espace'], ['negligeable'])]
FOND = ['p-espace']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
