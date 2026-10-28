"""Schémas du graphe intérieur ar-deriv (chapitre « Dérivabilité »).

Toute position est calculée ; toute affirmation illustrée est vérifiée par un assert.
Exemples polynomiaux seulement (ordre d'apparition).
"""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


@schema('de-taf')
def de_taf():
    fn = lambda x: x * (x - 3) ** 2
    dfn = lambda x: 3 * x ** 2 - 12 * x + 9
    a, b = 0.0, 4.0
    pente = (fn(b) - fn(a)) / (b - a)
    assert fn(a) == 0 and fn(b) == 4 and pente == 1
    cs = [2 - 2 / np.sqrt(3), 2 + 2 / np.sqrt(3)]
    for c in cs:
        assert abs(dfn(c) - pente) < 1e-12 and a < c < b
    assert abs(cs[0] - 0.845) < 1e-3 and abs(cs[1] - 3.155) < 1e-3
    assert dfn(2) == -3                                   # le milieu ne convient pas
    S = Schema(500, 330, 'Accroissements finis : tangentes parallèles à la corde')
    R = Repere(-0.3, 4.5, -1.6, 5.4, 30, 15, 440, 290)
    S.fleche(R(-0.3, 0), R(4.45, 0), 'g')
    S.texte(R(4.45, 0) + [8, 0], 'x', 'g', ancre='start')
    R.graphe(S, fn, a, b, 't', l=2)
    S.texte(R(3.75, fn(3.75)) + [14, 4], 'f', ancre='start')
    # corde
    S.ligne(R(a, fn(a)), R(b, fn(b)), 'b', l=1.8)
    S.point(R(a, fn(a)), 'b')
    S.point(R(b, fn(b)), 'b')
    S.texte(R(b, fn(b)) + [10, -10], '(b, f(b))', 'b', ancre='start')
    # tangentes parallèles, de demi-longueur 0,55 en abscisse
    for c in cs:
        y = fn(c)
        S.ligne(R(c - 0.55, y - 0.55 * pente), R(c + 0.55, y + 0.55 * pente), 'r', l=2)
        S.ligne(R(c, 0), R(c, y), 'g', d=True)
        S.point(R(c, y), 'r', r=4.2)
    S.texte(R(cs[0], 0) + [0, 17], 'c_1', 'r')
    S.texte(R(cs[1], 0) + [0, 17], 'c_2', 'r')
    S.texte(R(a, 0) + [-4, 17], 'a', 't')
    S.texte(R(b, 0) + [0, 17], 'b', 't')
    # étiquette au-dessus de la corde, là où le graphe est loin en dessous
    assert all(fn(x) < 1.6 for x in np.linspace(2.2, 3.0, 50))
    S.texte(R(3.0, 3.0) + [-12, -16], 'pente 1', 'b', ancre='end', ui=True)
    return S
