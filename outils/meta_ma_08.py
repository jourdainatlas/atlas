"""Métadonnées proposées pour la feuille Maths Sup – MPSI, chapitre 08 (limites et continuité)."""
from meta_ma_commun import fabriquer

PARTIES = [
    (1, 12, "limite d'une fonction", ['de-limite'], ['limite-fonction']),
    (13, 22, 'continuité en un point', ['continuite'], ['continuite-point']),
    (23, 41, 'fonctions continues sur un intervalle', ['c-tvi'], ['continuite']),
    (42, 47, 'continuité uniforme', ['c-heine'], ['continuite-uniforme']),
    (48, 49, 'fonctions à valeurs complexes', ['continuite'], ['continuite']),
]
R = [
    (r'\\lim|limite', 'limites', ['de-limite'], ['limite-fonction']),
    (r'à gauche|à droite|0\^\{[+-]\}', 'limites à gauche et à droite', ['de-limite'], []),
    (r'caractérisation séquentielle|suite \(x_\{n\}\)|f\(x_\{n\}\)|f\(u_\{n\}\)', 'caractérisation séquentielle', ['de-limite', 'su-convergence'], []),
    (r'prolong', 'prolongement par continuité', ['continuite'], ['continuite-point']),
    (r'continue en|continuité en', 'continuité en un point', ['continuite'], ['continuite-point']),
    (r'partie entière|\\lfloor|indicatrice|\\mathbf\{1\}_\{\\mathbb\{q\}\}', 'fonctions discontinues', ['continuite'], []),
    (r'valeurs intermédiaires|s\'annule|point fixe|racine|f\(x\) = x', 'valeurs intermédiaires', ['c-tvi'], []),
    (r'bornée|atteint|maximum|minimum|segment', 'bornes atteintes', ['c-bornes'], []),
    (r'monotone|croissante|décroissante', 'fonctions monotones', ['c-monotone'], []),
    (r'bijection|réciproque|injective', 'bijection continue', ['c-bijection'], []),
    (r'lipschitz|contractante', 'fonctions lipschitziennes', ['c-heine'], ['contractante']),
    (r'uniformément continue|continuité uniforme|heine', 'continuité uniforme', ['c-heine'], ['continuite-uniforme']),
    (r'équation fonctionnelle|toutes les fonctions|f\(x \+ y\)', 'équations fonctionnelles', ['continuite'], []),
    (r'dense|\\mathbb\{q\}|rationnels', 'densité', ['tr-dense'], ['partie-dense']),
    (r'périodique', 'fonctions périodiques', [], []),
    (r'polyn', 'polynômes', ['c-tvi'], []),
]
FOND = ['continuite']
EXTRA = {53: (['valeurs intermédiaires', 'surjectivité'], ['c-tvi', 'c-bornes'], ['continuite'])}
meta = fabriquer(R, PARTIES, FOND, EXTRA)
