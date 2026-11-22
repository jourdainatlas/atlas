"""Métadonnées proposées pour la feuille Licence 3, UE Intégration, chapitre 2 (La mesure de Lebesgue sur R^n)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 6, 'mesure de Lebesgue', ['m-lebesgue'], ['mesure-lebesgue', 'mesure-lebesgue-rn']),
           (7, 8, 'négligeables, presque partout', ['m-lebesgue'], ['negligeable', 'presque-partout', 'mesure-complete']),
           (9, 10, 'Cantor et Vitali', ['m-vitali'], ['ensemble-cantor']),
           (11, 14, 'unicité et régularité', ['m-regularite', 'm-lebesgue'], ['mesure-reguliere']),
           (15, 16, 'Carathéodory', ['m-caratheodory'], ['mesure-exterieure'])]
R = [(r'Cantor', 'ensemble de Cantor', ['m-vitali'], ['ensemble-cantor']),
     (r'axiome du choix|Vitali', 'ensemble de Vitali', ['m-vitali'], []),
     (r'mesure extérieure|\\lambda\^\{\*\}', 'mesure extérieure', ['m-caratheodory'], ['mesure-exterieure']),
     (r'négligeable|p\.p\.', 'parties négligeables', ['m-lebesgue'], ['negligeable'])]
FOND = ['m-lebesgue']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
