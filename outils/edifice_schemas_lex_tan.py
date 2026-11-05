"""Schémas des exemples du lexique, théorie tan : contenu/exemples/tan.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées, et ce que dit la légende vérifié par assert.
"""
import math
from fractions import Fraction as Fr
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

W0 = 420
TL = 17


def _etiq(S, p, s, c='t', ancre='middle', taille=TL, marge=2):
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)
    S.texte(p, s, c, ancre=ancre, taille=taille)


@schema('lex-entiers-gauss-1')
def lex_entiers_gauss_1():
    alpha, beta = complex(7, 2), complex(2, -1)
    quo = alpha / beta
    assert abs(quo - complex(12 / 5, 11 / 5)) < 1e-12
    q = complex(round(quo.real), round(quo.imag))
    assert q == complex(2, 2) and abs(quo - q) <= math.sqrt(2) / 2
    assert abs(alpha - beta * q - 1) < 1e-12          # reste 1, de norme 1 < 5
    S = Schema(W0, 290, 'Division euclidienne dans ℤ[i] : arrondir le quotient')
    ech = 76
    R = Repere(-0.4, 3.6, -0.3, 3.4, (W0 - 4.0 * ech) / 2, 6, 4.0 * ech, 3.7 * ech)
    S.fleche(R(-0.4, 0), R(3.6, 0), 'g')
    S.fleche(R(0, -0.3), R(0, 3.4), 'g')
    for a in range(0, 4):
        for b in range(0, 4):
            S.point(R(a, b), 'g', r=2.6)
    # carré du réseau qui contient le quotient, et ses demi-diagonales
    assert 2 <= quo.real <= 3 and 2 <= quo.imag <= 3
    S.poly([R(2, 2), R(3, 2), R(3, 3), R(2, 3)], 'g', ferme=True)
    S.ligne(R(2, 2), R(3, 3), 'g', d=True)
    S.ligne(R(3, 2), R(2, 3), 'g', d=True)
    S.ligne(R(quo.real, quo.imag), R(2, 2), 'b', l=1.6)
    S.point(R(quo.real, quo.imag), 'r', r=4)
    S.point(R(2, 2), 'b', r=4.5)
    # traits et points dessinés, pour vérifier que les étiquettes ne les touchent pas
    u = np.linspace(0, 1, 120)
    segs = [((2, 2), (3, 3)), ((3, 2), (2, 3)), ((2, 2), (3, 2)), ((3, 2), (3, 3)), ((3, 3), (2, 3)), ((2, 3), (2, 2))]
    pts = [R(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u) for a, b in segs]
    pts.append(np.array([R(a, b) for a in range(4) for b in range(4)]))
    pts = np.vstack(pts)
    pa = R(3, quo.imag) + [12, 0]
    S.ligne(R(quo.real, quo.imag) + [5, 0], pa + [-4, 0], 'r', d=True)
    for p, txt, c, anc in [(pa, 'α/β', 'r', 'start'), (R(2, 2) + [0, 21], 'q = 2 + 2i', 'b', 'middle')]:
        w = largeur_texte(txt, 16)
        x0 = {'start': p[0], 'middle': p[0] - w / 2}[anc]
        dedans = (pts[:, 0] > x0 - 3) & (pts[:, 0] < x0 + w + 3) & (abs(pts[:, 1] - p[1]) < 8 + 4)
        assert not dedans.any(), (txt, pts[dedans][:3])
        _etiq(S, p, txt, c, ancre=anc, taille=16)
    for a in range(1, 4):
        _etiq(S, R(a, 0) + [0, 16], str(a), 'g', taille=14)
    for b in (1, 2, 3):
        _etiq(S, R(0, b) + [-10, 0], 'i' if b == 1 else f'{b}i', 'g', ancre='end', taille=14)
    return S


@schema('lex-entiers-gauss-3')
def lex_entiers_gauss_3():
    r5 = math.sqrt(5)
    x = (0.5, 0.5 * r5)                               # (1 + √−5)/2, figuré par (1/2, √5/2)
    sommets = [(0, 0), (1, 0), (0, r5), (1, r5)]
    d2 = [Fr(1, 4) + Fr(5, 4)] * 4
    assert all(abs((x[0] - a) ** 2 + (x[1] - b) ** 2 - float(v)) < 1e-12 for (a, b), v in zip(sommets, d2))
    assert float(d2[0]) == 1.5 and math.sqrt(1.5) > 1
    # les autres points du réseau sont plus loin
    assert min((x[0] - a) ** 2 + (x[1] - b * r5) ** 2 for a in range(-3, 4) for b in range(-2, 3)) - 1.5 < 1e-12
    S = Schema(W0, 290, 'Dans ℤ[√−5], le centre d’une maille est trop loin des sommets')
    ech = 52
    R = Repere(-1.4, 2.4, -0.45, 4.85, (W0 - 3.8 * ech) / 2, 4, 3.8 * ech, 5.3 * ech)
    S.fleche(R(-1.4, 0), R(2.4, 0), 'g')
    S.fleche(R(0, -0.45), R(0, 4.85), 'g')
    for a in (-1, 0, 1, 2):
        for b in (0, 1, 2):
            if b * r5 <= 4.5:
                S.point(R(a, b * r5), 'g', r=2.6)
    S.poly([R(0, 0), R(1, 0), R(1, r5), R(0, r5)], 'g', ferme=True)
    for (a, b) in sommets:
        S.ligne(R(*x), R(a, b), 'b', d=True)
        S.point(R(a, b), 'b', r=4)
    S.point(R(*x), 'r', r=4.5)
    _etiq(S, R(1, x[1]) + [10, 0], '(1 + √−5)/2', 'r', ancre='start', taille=15)
    S.ligne(R(*x) + [6, 0], R(1, x[1]) + [6, 0], 'r', d=True)
    _etiq(S, R(1, 0) + [6, 15], '1', 'g', ancre='start', taille=14)
    _etiq(S, R(0, r5) + [-8, 0], '√−5', 'g', ancre='end', taille=14)
    return S
