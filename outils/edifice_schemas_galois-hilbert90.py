"""Schémas du chapitre « Théorème 90 de Hilbert et théorie de Kummer » (graphe galois-hilbert90)."""
from fractions import Fraction as Fr

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


# ---------------------------------------------------------------- h90-pythagore
@schema('h90-pythagore')
def h90_pythagore():
    m, n = 2, 1
    t = Fr(n, m)
    u, v = (1 - t * t) / (1 + t * t), 2 * t / (1 + t * t)
    assert (u, v) == (Fr(3, 5), Fr(4, 5)) and u * u + v * v == 1
    assert (u, v) == (Fr(m * m - n * n, m * m + n * n), Fr(2 * m * n, m * m + n * n))
    y = complex(m, n)
    assert abs(y / y.conjugate() - complex(u, v)) < 1e-12              # x = y / σ(y)
    assert v == t * (u + 1)                                             # sur la droite de pente t issue de (−1, 0)
    R = Repere(-1.5, 1.6, -1.4, 1.4, 20, 20, 260 * 3.1 / 2.8, 260)
    ech = R(1, 0)[0] - R(0, 0)[0]
    assert abs(ech + (R(0, 1)[1] - R(0, 0)[1])) < 1e-9                 # même échelle sur les deux axes
    S = Schema(520, 300, 'La droite de pente 1/2 issue de (−1, 0) recoupe le cercle en (3/5, 4/5)')
    S.fleche(R(-1.5, 0), R(1.6, 0), 'g')
    S.fleche(R(0, -1.4), R(0, 1.4), 'g')
    S.cercle(R(0, 0), ech, 't')
    a, b = -1.45, 1.35
    S.ligne(R(a, float(t) * (a + 1)), R(b, float(t) * (b + 1)), 'b')
    S.point(R(-1, 0), 't', r=4.5)
    S.point(R(0, float(t)), 'b', r=4.5)
    S.point(R(float(u), float(v)), 'r', r=5.5)
    S.ligne(R(float(u), 0), R(float(u), float(v)), 'g', d=True)
    S.texte(R(-1, 0) + [-8, -16], '(−1, 0)', 't', ancre='end', taille=15)
    S.texte(R(0, float(t)) + [-8, -16], '(0, 1/2)', 'b', ancre='end', taille=15)
    S.texte(R(float(u), float(v)) + [16, -20], '(3/5, 4/5)', 'r', ancre='start', taille=16)
    S.texte(R(float(u), 0) + [0, 18], '3/5', 'g', taille=15)
    # légende à droite : y = 2 + i, x = y/σ(y)
    xl = 372
    S.texte([xl, 70], 'y = 2 + i', 'b', ancre='start', taille=16)
    S.texte([xl, 110], 'x = y/σ(y)', 'r', ancre='start', taille=16)
    S.texte([xl, 150], '= (3 + 4i)/5', 'r', ancre='start', taille=16)
    S.texte([xl, 200], '3^2 + 4^2 = 5^2', 't', ancre='start', taille=16)
    assert 3 ** 2 + 4 ** 2 == 5 ** 2
    return S
