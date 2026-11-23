"""Métadonnées proposées pour la feuille Licence 3, UE Structures algébriques, chapitre 4 (Modules, anneaux noethériens)."""
from meta_ma_commun import fabriquer

PARTIES = [(1, 1, 'anneaux et modules noethériens', ['ac-noetheriens', 'a-module'], ['anneau-noetherien', 'module']),
           (2, 6, 'anneaux noethériens', ['ac-noetheriens'], ['anneau-noetherien', 'ideal-type-fini']),
           (7, 9, 'modules noethériens', ['a-module', 'ac-noetheriens'], ['module', 'sous-module', 'module-type-fini']),
           (10, 10, 'anneaux noethériens', ['ac-noetheriens'], ['anneau-noetherien'])]
R = [(r'Hilbert', 'théorème de Hilbert', ['ac-hilbert'], []),
     (r'Zorn', 'lemme de Zorn', ['o-zorn'], []),
     (r'premier', 'idéaux premiers', ['a-premier-maximal'], ['ideal-premier'])]
FOND = ['ac-noetheriens']
EXTRA = {}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
