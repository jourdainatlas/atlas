"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 15 (dimension finie et rang)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 14, 'espaces de dimension finie', ['v-dimension'], ['espace-dimension-finie', 'dimension']),
    (15, 25, 'sous-espaces et dimension', ['v-dimension'], ['dimension']),
    (26, 43, 'théorème du rang', ['v-rang'], ['rang']),
    (44, 47, 'hyperplans et systèmes', ['v-dual', 'v-rang'], ['forme-lineaire']),
]
R = [
    (r'dimension', 'dimension', ['v-dimension'], ['dimension']),
    (r'libre|liée', 'familles libres', ['v-echange'], []),
    (r'base incomplète|compléter|base', 'bases', ['v-bases-existence'], ['base-vectorielle', 'theoreme-base-incomplete']),
    (r'\\rg|rang', 'rang', ['v-rang'], ['rang']),
    (r'supplémentaire|\\oplus|somme directe', 'supplémentaires', ['v-dimension', 'v-somme-directe'], ['supplementaire']),
    (r'grassmann|\\cap', 'formule de Grassmann', ['v-dimension'], []),
    (r'noyau|\\ker|image|\\img|\\imf', 'noyau et image', ['v-rang'], ['noyau']),
    (r'injecti|surjecti|bijecti|isomorphisme|\\gl', 'isomorphismes', ['v-rang'], ['isomorphisme']),
    (r'hyperplan|forme linéaire|\^\{\*\}', 'hyperplans', ['v-dual'], ['forme-lineaire']),
    (r'système', 'systèmes linéaires', ['v-rang'], []),
    (r'nilpotent', 'endomorphismes nilpotents', ['v-applications'], []),
    (r'projecteur|symétrie', 'projecteurs et symétries', ['v-somme-directe'], []),
    (r'polynôme|\\mathbb\{[kcr]\}_\{n\}\[x\]|\\mathbb\{[kcr]\}\[x\]', 'espaces de polynômes', ['pol-anneau'], []),
    (r'lagrange|interpol', 'interpolation de Lagrange', ['pol-racines'], []),
    (r'suite|récurren', 'suites récurrentes linéaires', ['v-espace'], []),
    (r'équation différentielle|y\'\'', 'équations différentielles linéaires', ['ed-lineaires'], []),
]
FOND = ['v-dimension']
EXTRA = {
    50: (['espaces de fonctions', 'fonctions monotones'], ['v-dimension', 'v-libre'], ['dimension']),
    51: (['combinatoire', 'lemme fondamental'], ['v-echange', 'v-dimension'], ['dimension']),
    54: (['nombres algébriques', 'extensions de corps'], ['v-dimension'], ['dimension']),
    55: (['pavages', 'dimension sur Q'], ['v-dimension', 'v-dual'], ['dimension']),
    58: (['dimension infinie', 'familles non dénombrables'], ['v-dimension', 'v-libre'], ['dimension']),
}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
