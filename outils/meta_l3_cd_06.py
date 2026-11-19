"""Métadonnées proposées pour la feuille Licence 3, UE calcul différentiel, chapitre 6 (Équations différentielles : existence)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 8, 'résolution explicite', ['ed-lineaires'], ['equation-differentielle', 'solution-edo']), (9, 17, "équations d'ordre supérieur, systèmes linéaires", ['ed-lineaires'], ['systeme-lineaire-edo', 'exponentielle-matrice']), (18, 21, 'existence et unicité', ['ed-cauchy-lipschitz', 'ed-peano', 'ed-gronwall'], ['localement-lipschitzienne']), (22, 26, 'solutions maximales, théorème des bouts', ['ed-maximales', 'ed-compacts'], ['solution-maximale']), (27, 30, 'études qualitatives', ['ed-maximales', 'ed-cauchy-lipschitz'], ['solution-maximale']), (31, 33, 'équations linéaires à coefficients périodiques', ['ed-lineaires'], ['systeme-lineaire-edo'])]
R = [('Gronwall', 'lemme de Gronwall', ['ed-gronwall'], []), ('Peano|Ascoli|équicontinu', 'théorème de Peano', ['ed-peano', 'fc-ascoli'], ['equicontinue-uniforme']), ('lipschitz', 'condition de Lipschitz', ['ed-cauchy-lipschitz'], ['localement-lipschitzienne']), ('exponentielle de matrice|e\\^\\{tA\\}|\\\\exp\\(tA\\)', 'exponentielle de matrice', ['ed-lineaires'], ['exponentielle-matrice'])]
FOND = ['ed-cauchy-lipschitz']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
