"""Métadonnées proposées pour la feuille Master « Théorie de Galois » (55 exercices, 7 chapitres)."""
from meta_commun import types_exercice, appliquer

R = [
    (r'groupe', 'groupes', ['a-groupe'], []),
    (r'sous-groupe', 'sous-groupes', ['a-sous-groupe'], []),
    (r'morphisme|isomorph|aut\b|\\aut', 'morphismes de groupes', ['a-morphisme'], []),
    (r'permutation|\\sym|transposition|cycle|signature', 'groupe symétrique', ['a-groupe'], ['groupe-symetrique']),
    (r'distingué|quotient|\\normal', 'sous-groupes distingués et quotients', ['a-distingue', 'a-quotient'], ['sous-groupe-distingue', 'groupe-quotient']),
    (r'conjugaison|orbite|stabilisateur|action|agir', 'actions de groupes', ['a-distingue'], ['action-groupe']),
    (r'sylow|cauchy', 'théorèmes de Sylow', ['a-groupe'], ['sous-groupe-sylow']),
    (r'résoluble|simple|dérivé', 'groupes résolubles', ['gs-radicaux'], ['groupe-resoluble']),
    (r'anneau|idéal', 'anneaux et idéaux', ['a-anneau', 'a-ideal'], []),
    (r'irréductible|eisenstein|gauss', 'irréductibilité', ['z-polynomes'], ['polynome-irreductible']),
    (r'pgcd|division euclidienne|bézout', 'arithmétique des polynômes', ['z-polynomes'], ['anneau-polynomes']),
    (r'polynôme minimal|algébrique', 'polynôme minimal', ['gs-algebriques'], ['polynome-minimal']),
    (r'extension|degré|\[l:', 'extensions de corps', ['gs-extensions'], ['extension-corps']),
    (r'décomposition|rupture', 'corps de décomposition', ['gs-decomposition'], ['corps-decomposition']),
    (r'constructible|règle et au compas|polygone|trisect|duplication', 'constructions à la règle et au compas', ['galois-cyclotomie'], ['point-constructible']),
    (r'séparab|parfait', 'séparabilité', ['gs-separabilite'], ['polynome-separable']),
    (r'normale', 'extensions normales', ['gs-galoisiennes'], []),
    (r'\\fb|corps fini|frobenius', 'corps finis', ['gs-corps-finis'], ['corps-fini']),
    (r'élément primitif', 'élément primitif', ['gs-separabilite'], ['element-primitif']),
    (r'galoisienne|groupe de galois|\\gal', 'groupe de Galois', ['gs-galoisiennes', 'gs-correspondance'], ['extension-galoisienne', 'groupe-galois']),
    (r'intermédiaire|sous-corps|invariants', 'correspondance de Galois', ['gs-correspondance'], []),
    (r'artin|dedekind', "théorème d'Artin", ['gs-artin'], []),
    (r'cyclotomi|\\phi_|zeta|racine primitive|racines de l.unité', 'cyclotomie', ['galois-cyclotomie'], ['polynome-cyclotomique']),
    (r'radicaux|cardan|abel', 'résolubilité par radicaux', ['gs-radicaux', 'gs-abel-ruffini'], ['groupe-resoluble']),
    (r'discriminant|résolvante', 'discriminant et résolvante', ['gs-radicaux'], []),
]

EXTRA = {
    30: (['corps finis', 'théorème de Wilson'], ['gs-corps-finis'], ['corps-fini']),
    40: (['radicaux emboîtés', 'correspondance de Galois'], ['gs-correspondance', 'gs-galoisiennes'], ['extension-galoisienne']),
}

def meta(numero, titre, enonce, corrige, etoiles):
    m, n, l = appliquer(R, (titre or '') + '\n' + enonce)
    em, en, el = EXTRA.get(numero, ([], [], []))
    m += [x for x in em if x not in m]; n += [x for x in en if x not in n]; l += [x for x in el if x not in l]
    return {'types': types_exercice(titre, enonce, corrige, etoiles), 'mots_cles': m, 'noeuds': n, 'notions': l}
