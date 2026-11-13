"""Métadonnées proposées pour la feuille Python – Lycée (initiation à Python)."""
from meta_ma_commun import fabriquer

# Les nœuds de l'édifice rattachés à un exercice de programmation sont les objets mathématiques qu'il
# manipule (division euclidienne, suite récurrente, connecteurs logiques…), pas le langage lui-même.
PARTIES = [
    (1, 4, 'premiers programmes', ['l-syntaxe'], []),
    (5, 10, 'variables et calculs', ['z-division'], ['division-euclidienne']),
    (11, 15, 'tests et conditions', ['l-connecteurs'], []),
    (16, 22, 'boucles', ['n-recdef'], ['suite']),
    (23, 27, 'fonctions', ['r-application'], ['application']),
    (28, 33, 'listes', ['r-familles'], []),
    (34, 38, 'algorithmes classiques', ['z-ordre'], []),
]
R = [
    (r'syntaxerror|message d\'erreur|erreur', 'erreurs', ['l-syntaxe'], []),
    (r'minutes|secondes|`//`|`%`|divisible|\bpairs?\b|\bimpairs?\b|chiffres', 'division euclidienne', ['z-division'], ['division-euclidienne']),
    (r'`(?:and|or|not)`|\bbissextile|`(?:true|false)`', 'connecteurs logiques', ['l-connecteurs'], []),
    (r'suite|u_\{n\+1\}|v_\{n\+1\}|syracuse', 'suites récurrentes', ['n-recdef'], ['suite']),
    (r'\bpremiers?\b(?! terme)|crible|diviseurs', 'nombres premiers', ['z-premiers'], ['nombre-premier']),
    (r'pgcd|euclide|ppcm|irréductible', 'PGCD', ['z-bezout'], ['pgcd']),
    (r'dichotomie|balaie|encadrement', 'résolution approchée', ['c-tvi'], []),
    (r'hasard|random|randint|fréquence|monte-carlo|lancers', 'simulation', ['p-loi-faible'], []),
    (r'\btri\b|\btrie|médiane|maximum|minimum', 'tri et recherche', ['z-ordre'], []),
    (r'césar|décale', 'chiffrement', ['z-zn'], []),
]
FOND = ['l-syntaxe']
EXTRA = {}
_base = fabriquer(R, PARTIES, FOND, EXTRA)
# Correspondances fortuites des motifs (« et ainsi de suite », « premier terme »…) : retirées après relecture.
RETIRER = {2: ['n-recdef', 'suites récurrentes'], 15: ['n-recdef', 'suites récurrentes'],
           35: ['z-ordre'], 36: ['z-ordre'], 38: ['z-ordre'], 41: ['z-premiers', 'nombres premiers'],
           43: ['z-division', 'n-recdef', 'division euclidienne', 'suites récurrentes']}

def meta(numero, titre, enonce, corrige, etoiles):
    r = _base(numero, titre, enonce, corrige, etoiles)
    for k in ('noeuds', 'mots_cles', 'notions'):
        r[k] = [x for x in r[k] if x not in RETIRER.get(numero, [])]
    return r
