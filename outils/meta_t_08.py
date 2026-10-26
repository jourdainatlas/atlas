"""Métadonnées proposées pour la feuille Terminale, chapitre 8 (équations différentielles)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'y\'|équation différentielle|courbes? intégrales?|n\'|\\theta\'|v\'|c\'', 'équation différentielle', ['ed-cauchy-lipschitz'], ['equation-differentielle']),
    (r'y\'\s*=\s*-?[0-9,{}\\.a-z]*\s*y\s*\$|y\'=ay\b|y\'=-?\d*y\$|forme \$y\'=ay\$', "équation y' = ay", ['cx-exponentielle'], ['exponentielle']),
    (r'y\'\s*=\s*-?[^$]*y\s*[+-]\s*\d|ay\+b|y\'=ay\+b', "équation y' = ay + b", [], []),
    (r'vérifier que[^.]*solution|est solution|sont solutions', 'vérifier une solution', [], []),
    (r'condition initiale|y\(0\)|y\(1\)|unique solution|solution vérifiant', 'condition initiale', ['ed-cauchy-lipschitz'], []),
    (r'équilibre|solution constante', "valeur d'équilibre", [], []),
    (r'courbes? intégrales?', 'courbes intégrales', [], []),
    (r'radioacti|demi-vie|carbone|isotope|iode|césium', 'radioactivité', ['ed-cauchy-lipschitz'], ['equation-differentielle']),
    (r'température|newton|four|plat', 'loi de refroidissement', [], []),
    (r'bactéries|population', 'croissance de population', [], []),
    (r'parachut|vitesse limite', 'chute avec frottements', [], []),
    (r'médicament|perfusion|concentration', 'pharmacocinétique', [], []),
    (r'\\lim', 'limite', [], []),
    (r'sens de variation|tableau de variations', 'tableau de variations', [], []),
    (r'solution particulière|second membre', 'solution particulière', [], []),
    (r'u_\{?n|suite', 'suites', ['ar-suites'], ['suite']),
    (r'euler', "méthode d'Euler", [], []),
    (r'logistique', 'équation logistique', [], []),
    (r'graphique|courbe', 'lecture graphique', [], []),
]

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
