"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 02 (applications et relations)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 4, 'applications', ['r-produit'], ['application']),
    (5, 9, 'image directe et image réciproque', ['r-images'], ['image-directe', 'image-reciproque']),
    (10, 11, 'composition', ['r-composition'], []),
    (12, 26, 'injections, surjections, bijections', ['r-injections'], ['injection', 'surjection', 'bijection']),
    (27, 29, 'relations binaires', ['r-equivalence'], ['relation']),
    (30, 34, "relations d'équivalence", ['r-equivalence'], ['relation-equivalence']),
    (35, 40, "relations d'ordre", ['od-ordre'], ['relation-ordre']),
]
R = [
    (r'indicatrice|\\mathbf\{1\}_', 'fonctions indicatrices', ['zf-parties'], []),
    (r'image directe|image réciproque|\^\{-1\}\(|\^\{-1\}\\big\(', 'images directes et réciproques', ['r-images'], ['image-directe', 'image-reciproque']),
    (r'\\circ|compos', 'composition', ['r-composition'], []),
    (r'injecti', 'injectivité', ['r-injections'], ['injection']),
    (r'surjecti', 'surjectivité', ['r-injections'], ['surjection']),
    (r'bijecti', 'bijections', ['r-injections'], ['bijection']),
    (r'réciproque|inverse à gauche|inverse à droite|rétraction|section', 'bijection réciproque', ['r-inverses'], []),
    (r'fini|cardinal|éléments', 'ensembles finis', ['n-fini'], ['ensemble-fini']),
    (r'infini|\\mathcal\{p\}\(e\)|cantor|bernstein', 'équipotence', ['r-equipotence'], []),
    (r'bernstein', 'théorème de Cantor-Bernstein', ['r-bernstein'], []),
    (r'équivalence|classes?', "relations d'équivalence", ['r-equivalence'], ['relation-equivalence']),
    (r'congru|modulo|\\equiv', 'congruences', ['z-zn'], []),
    (r'ordre|\\preccurlyeq|\\leqslant', "relations d'ordre", ['od-ordre'], ['relation-ordre']),
    (r'majorant|borne supérieure|plus grand élément', 'majorants et borne supérieure', ['od-majorants'], ['majorant', 'borne-superieure']),
    (r'croissante pour l\'inclusion|point fixe', 'point fixe', ['od-tarski'], []),
]
FOND = ['r-injections']
EXTRA = {44: (['applications multiplicatives', 'récurrence'], ['r-injections', 'n-recurrence'], ['application'])}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
