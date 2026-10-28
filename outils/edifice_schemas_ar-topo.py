"""Schémas du graphe ar-topo (topologie de ℝ).

Toute position est calculée ; toute affirmation illustrée est vérifiée par un assert.
"""
from fractions import Fraction as Fr
from edifice_schemas import schema
from edifice_svg import Schema, Repere


def _intervalle_ouvert(S, R, u, v, h, c, l=2.2):
    """Intervalle ouvert ]u, v[ dessiné à la hauteur h, extrémités creuses."""
    S.ligne(R(u, h), R(v, h), c, l=l)
    S.point(R(u, h), c, r=3.6, creux=True)
    S.point(R(v, h), c, r=3.6, creux=True)


def _graduation(S, R, x, lab, c='t', dy=18, taille=16):
    S.ligne(R(x, 0) + [0, -5], R(x, 0) + [0, 5], 'g')
    S.texte(R(x, 0) + [0, dy], lab, c, taille=taille)


@schema('tr-borel-lebesgue')
def tr_borel_lebesgue():
    a, b = Fr(0), Fr(1)
    bleus = [(Fr(-15, 100), Fr(30, 100)), (Fr(20, 100), Fr(50, 100))]
    c, r = Fr(55, 100), Fr(20, 100)
    rouge = (c - r, c + r)
    gris = [(Fr(70, 100), Fr(90, 100)), (Fr(85, 100), Fr(110, 100))]
    x = Fr(42, 100)
    y = c + r / 2
    # la famille entière recouvre [a, b] (les intervalles se chevauchent de proche en proche)
    tous = sorted(bleus + [rouge] + gris)
    assert tous[0][0] < a and tous[-1][1] > b
    assert all(tous[i + 1][0] < tous[i][1] for i in range(len(tous) - 1))
    # [a, x] est recouvert par les deux ouverts bleus
    assert bleus[0][0] < a and bleus[1][0] < bleus[0][1] and x < bleus[1][1]
    # x est dans E et c - r < x <= c : c - r ne majore pas E
    assert c - r < x <= c
    # [a, y] est recouvert par les bleus et O_k, et y > c
    assert y < c + r and y > c and x > c - r
    assert y < b                                      # on est bien dans le cas c < b, supposé

    S = Schema(520, 250, 'Borel-Lebesgue : les ouverts bleus recouvrent [a, x], O_k prolonge jusqu’à y > c')
    R = Repere(-0.25, 1.2, -0.6, 3.6, 20, 10, 480, 220)
    S.ligne(R(-0.25, 0), R(1.2, 0), 'g')
    S.ligne(R(a, 0), R(b, 0), 't', l=2)
    S.ligne(R(a, 0), R(x, 0), 'b', l=4)
    S.ligne(R(x, 0), R(y, 0), 'r', l=4)
    for (u, v), h in zip(bleus, [1, 2]):
        _intervalle_ouvert(S, R, u, v, h, 'b')
    _intervalle_ouvert(S, R, *rouge, 3, 'r')
    for (u, v), h in zip(gris, [1, 2]):
        _intervalle_ouvert(S, R, u, v, h, 'g', l=1.6)
    S.texte(R(rouge[1], 3) + [10, 0], 'O_k', 'r', ancre='start', taille=16)
    S.texte(R(bleus[0][0], 1) + [-10, 0], 'O_j', 'b', ancre='end', taille=16)
    for xx, lab, col in [(a, 'a', 't'), (x, 'x', 'b'), (c, 'c', 'r'), (y, 'y', 'r'), (b, 'b', 't')]:
        _graduation(S, R, xx, lab, col)
    S.ligne(R(c, 0), R(c, 3), 'g', d=True)
    S.point(R(c, 0), 'r', r=4)
    S.texte(R(0.95, 2.55), 'reste du recouvrement', 'g', ui=True, taille=13)
    return S


@schema('tr-connexes')
def tr_connexes():
    a, b, c, r = Fr(0), Fr(1), Fr(55, 100), Fr(16, 100)
    y = max(a, c - r / 2)           # cas c ∈ V
    x = min(b, c + r / 2)           # cas c ∈ U
    assert a <= y < c and c - r < y < c + r        # y ∈ [a, c[ ⊂ U et y dans la boule ⊂ V
    assert c < x < c + r and x <= b                 # ]c, x] ⊂ boule ⊂ U, donc x ∈ E et x > c

    S = Schema(520, 300, 'Connexité d’un intervalle : les deux cas c dans V, c dans U')
    for k, h0 in enumerate([30, 170]):
        R = Repere(-0.12, 1.12, -1, 1.6, 20, h0, 480, 100)
        S.ligne(R(-0.12, 0), R(1.12, 0), 'g')
        S.ligne(R(a, 0), R(b, 0), 't', l=1.6)
        # [a, c[ ⊂ U, en bleu
        S.ligne(R(a, 0), R(c, 0), 'b', l=4)
        _intervalle_ouvert(S, R, c - r, c + r, 0.9, 'r')
        S.ligne(R(c, 0), R(c, 0.9), 'g', d=True)
        _graduation(S, R, a, 'a')
        _graduation(S, R, b, 'b', 'v')
        S.point(R(b, 0), 'v', r=3.6)
        S.point(R(a, 0), 'b', r=3.6)
        if k == 0:
            S.point(R(c, 0), 'v', r=4.2)
            _graduation(S, R, c, 'c', 'v')
            S.texte(R(c + r, 0.9) + [10, 0], 'boule ⊂ V', 'r', ancre='start', ui=True, taille=14)
            S.point(R(y, 0), 'r', r=4.2)
            S.texte(R(y, 0) + [0, 18], 'y', 'r', taille=16)
            S.texte(R(-0.12, 1.45), 'si c ∈ V : y serait dans U et dans V', 'g', ancre='start', ui=True, taille=14)
        else:
            S.point(R(c, 0), 'b', r=4.2)
            _graduation(S, R, c, 'c', 'b')
            S.ligne(R(c, 0), R(x, 0), 'b', l=4)
            S.texte(R(c + r, 0.9) + [10, 0], 'boule ⊂ U', 'r', ancre='start', ui=True, taille=14)
            S.point(R(x, 0), 'r', r=4.2)
            S.texte(R(x, 0) + [0, 18], 'x', 'r', taille=16)
            S.texte(R(-0.12, 1.45), 'si c ∈ U : x serait dans E et dépasserait c', 'g', ancre='start', ui=True,
                    taille=14)
        S.texte(R((a + c) / 2, 0) + [0, -14], 'E ⊂ U', 'b', ui=True, taille=14)
    return S
