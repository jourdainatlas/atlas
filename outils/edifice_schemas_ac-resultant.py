"""Schémas du chapitre « Résultant et élimination » (graphe ac-resultant)."""
import math

import numpy as np
import sympy as sp
from edifice_schemas import schema
from edifice_svg import Repere, Schema


# ---------------------------------------------------------------- res-elimination
@schema('res-elimination')
def res_elimination():
    # Résultant en y du cercle x² + y² − 5 et de l'hyperbole xy − 2, calculé par sympy, puis ses racines.
    x, y = sp.symbols('x y')
    R = sp.expand(sp.resultant(x**2 + y**2 - 5, x*y - 2, y))
    assert R == x**4 - 5*x**2 + 4
    racines = sorted(int(r) for r in sp.solve(R, x))
    assert racines == [-2, -1, 1, 2]
    points = [(a, sp.Rational(2, a)) for a in racines]
    for a, b in points:                       # ce sont bien des points communs
        assert a**2 + b**2 == 5 and a * b == 2
    S = Schema(480, 330, 'Le cercle x² + y² = 5, l’hyperbole xy = 2 et les racines du résultant')
    L = 2.95
    Rp = Repere(-L, L, -2.7, 2.7, 40, 14, 400, 290)
    Rp.axes(S)
    # cercle de rayon √5
    t = np.linspace(0, 2 * math.pi, 400)
    r5 = math.sqrt(5)
    S.poly(Rp(r5 * np.cos(t), r5 * np.sin(t)), 'b', ferme=True, l=2)
    # hyperbole xy = 2, deux branches, coupées au cadre
    for sg in (1, -1):
        xs = np.linspace(sg * 2 / 2.7, sg * L, 300)
        S.poly(Rp(xs, 2 / xs), 'v', l=2)
    for a, b in points:
        a, b = float(a), float(b)
        S.ligne(Rp(a, b), Rp(a, 0), 'g', d=True)
        S.point(Rp(a, 0), 'b', r=4)
        S.point(Rp(a, b), 'r', r=4.6)
    for a in racines:
        dy = 17 if a > 0 else -17
        S.texte(Rp(a, 0) + [0, dy], str(a).replace('-', '−'), 'b', taille=15)
    S.texte(Rp(-1.9, 1.75) + [-6, -8], 'x^2 + y^2 = 5', 'b', ancre='end', taille=15)
    S.texte(Rp(2.45, 2 / 2.45) + [6, -16], 'xy = 2', 'v', ancre='start', taille=15)
    return S
