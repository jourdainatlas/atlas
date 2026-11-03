"""Schémas du chapitre derham-varietes (intégration sur les variétés et formule de Stokes).

Toute position est calculée ; toute affirmation illustrée est vérifiée par un assert.
"""
import math
import numpy as np
import sympy as sp
from edifice_schemas import schema
from edifice_svg import Schema, Repere


# ------------------------------------------------------------------ dv-primitifs
@schema('dv-primitifs')
def dv_primitifs():
    # Coordonnées polaires τ(r, t) = (r cos t, r sin t) sur ]0, ∞[ × ]−π/2, π/2[ ;
    # k(r, t) = (r cos t, t) ne change pas t, h(v, t) = (v, v tan t) ne change que la seconde coordonnée.
    R_, T_, V_ = sp.symbols('r t v', real=True)
    k = sp.Matrix([R_ * sp.cos(T_), T_])
    h = sp.Matrix([V_, V_ * sp.tan(T_)])
    tau = sp.Matrix([R_ * sp.cos(T_), R_ * sp.sin(T_)])
    assert sp.simplify(h.subs(V_, k[0]) - tau) == sp.zeros(2, 1)
    Dt = tau.jacobian([R_, T_])
    assert sp.simplify(Dt[1, 0] - sp.sin(T_)) == 0 and sp.simplify(Dt[0, 0] - sp.cos(T_)) == 0   # M_1, M_2
    dk = sp.simplify(k.jacobian([R_, T_]).det())
    dh = sp.simplify(h.jacobian([V_, T_]).det())
    assert sp.simplify(dk - sp.cos(T_)) == 0 and sp.simplify(dh - V_ / sp.cos(T_) ** 2) == 0
    assert sp.simplify(dk * dh.subs(V_, k[0]) - Dt.det()) == 0 and sp.simplify(Dt.det() - R_) == 0

    kf = lambda r, t: (r * np.cos(t), t)
    hf = lambda v, t: (v, v * np.tan(t))
    rs = [0.5, 0.75, 1.0, 1.25, 1.5]
    ts = [-0.9, -0.45, 0.0, 0.45, 0.9]
    for r in rs:
        for t in ts:
            v, t2 = kf(r, t)
            assert t2 == t                                      # k garde la seconde coordonnée
            x, y = hf(v, t2)
            assert x == v                                       # h garde la première
            assert abs(x - r * math.cos(t)) < 1e-12 and abs(y - r * math.sin(t)) < 1e-12

    top, H = 34, 210
    ech = H / 2.5                     # même échelle verticale pour les trois cadres (unités par px)
    larg = 1.6 * ech                  # largeur d'un cadre : [0, 1.6] en abscisse
    xA, xB, xC = 12, 12 + larg + 46, 12 + 2 * (larg + 46)
    RA = Repere(0.0, 1.6, -1.25, 1.25, xA, top, larg, H)
    RB = Repere(0.0, 1.6, -1.25, 1.25, xB, top, larg, H)
    RC = Repere(0.0, 1.6, -1.25, 1.25, xC, top, larg, H)
    # repères alignés : une même ordonnée est à la même hauteur dans A et B (k ne change pas t)
    assert abs(RA(1, 0.45)[1] - RB(0.3, 0.45)[1]) < 1e-9
    # échelles égales en x et en y dans C (le secteur n'est pas déformé)
    assert abs((RC(1, 0) - RC(0, 0))[0] - (RC(0, 0) - RC(0, 1))[1]) < 1e-9
    W = int(round(xC + larg + 14))
    S = Schema(W, top + H + 34, 'Les coordonnées polaires décomposées en k, qui garde t, puis h, qui garde v')
    n = 80
    tt = np.linspace(-0.9, 0.9, n)
    rr = np.linspace(0.5, 1.5, n)

    def grille(R, F, c='g', l=0.9):
        for r in rs:
            P = np.array([F(r, t) for t in tt]); S.poly(R(P[:, 0], P[:, 1]), c, l=l)
        for t in ts:
            P = np.array([F(r, t) for r in rr]); S.poly(R(P[:, 0], P[:, 1]), c, l=l)

    def cellule(R, F):
        bord = ([(r, 0.45) for r in np.linspace(1.0, 1.25, 20)] + [(1.25, t) for t in np.linspace(0.45, 0.9, 20)]
                + [(r, 0.9) for r in np.linspace(1.25, 1.0, 20)] + [(1.0, t) for t in np.linspace(0.9, 0.45, 20)])
        P = np.array([F(*q) for q in bord]); S.surface(R(P[:, 0], P[:, 1]), 'r')
        S.poly(R(P[:, 0], P[:, 1]), 'r', ferme=True, l=1.8)

    idA = lambda r, t: (r, t)
    kA = lambda r, t: kf(r, t)
    tA = lambda r, t: hf(*kf(r, t))
    for R, F, (nx, ny) in ((RA, idA, ('r', 't')), (RB, kA, ('v', 't')), (RC, tA, ('x', 'y'))):
        S.fleche(R(0, 0), R(1.6, 0) + [6, 0], 'g', l=0.9)
        S.fleche(R(0, -1.25), R(0, 1.25) - [0, 4], 'g', l=0.9)
        S.texte(R(1.6, 0) + [4, 14], nx, 'g', ancre='end', taille=15)
        S.texte(R(0, 1.25) + [10, 4], ny, 'g', ancre='start', taille=15)
        grille(R, F)
        cellule(R, F)
    # flèches entre les cadres
    ya = top + 14
    for x0, x1, nom in ((xA + larg + 4, xB - 6, 'k'), (xB + larg + 4, xC - 6, 'h')):
        S.fleche((x0, ya), (x1, ya), 't', l=1.4)
        S.texte(((x0 + x1) / 2, ya - 12), nom, 't', taille=17)
    S.texte(RA(1.0, -1.25) + [0, 20], 'rectangle', 'g', taille=14, ui=True)
    S.texte(RB(0.9, -1.25) + [0, 20], 'v = r `cos` t', 'g', taille=14)
    S.texte(RC(0.9, -1.25) + [0, 20], 'y = v `tan` t', 'g', taille=14)
    return S


# ------------------------------------------------------------------ dv-orientation-bord
@schema('dv-orientation-bord')
def dv_orientation_bord():
    # Disque D ; carte φ(x, y) = (−x, 1 − x² − y²) sur D ∩ {y > 0}, directe (jacobien 2y > 0),
    # à valeurs dans ℍ² = {u₂ ≥ 0}. Au point p = (cos π/3, sin π/3) : dφ(ν) = (−1/2, −2), dφ(v) = (√3/2, 0).
    x, y = sp.symbols('x y', real=True)
    phi = sp.Matrix([-x, 1 - x ** 2 - y ** 2])
    J = phi.jacobian([x, y])
    assert sp.simplify(J.det() - 2 * y) == 0
    a = sp.pi / 3
    p = {x: sp.cos(a), y: sp.sin(a)}
    nu = J.subs(p) * sp.Matrix([sp.cos(a), sp.sin(a)])
    tg = J.subs(p) * sp.Matrix([-sp.sin(a), sp.cos(a)])
    assert sp.simplify(nu - sp.Matrix([-sp.Rational(1, 2), -2])) == sp.zeros(2, 1)
    assert sp.simplify(tg - sp.Matrix([sp.sqrt(3) / 2, 0])) == sp.zeros(2, 1)
    # normale sortante d'abord : det(ν, v) > 0 dans ℝ², et det(−e₂, e₁) = 1 dans ℍ² (n = 2 pair)
    assert sp.Matrix([[math.cos(math.pi / 3), -math.sin(math.pi / 3)],
                      [math.sin(math.pi / 3), math.cos(math.pi / 3)]]).det() > 0
    assert sp.Matrix([[0, 1], [-1, 0]]).det() == 1
    # le cercle va sur u₂ = 0, le diamètre y → 0⁺ sur la parabole u₂ = 1 − u₁²
    for s in np.linspace(0.05, math.pi - 0.05, 9):
        u = phi.subs({x: math.cos(s), y: math.sin(s)})
        assert abs(float(u[1])) < 1e-12 and abs(float(u[0]) + math.cos(s)) < 1e-12
    for s in np.linspace(-0.9, 0.9, 7):
        u = phi.subs({x: s, y: 0})
        assert abs(float(u[1]) - (1 - float(u[0]) ** 2)) < 1e-12

    S = Schema(520, 270, 'Carte directe du disque au bord, normale sortante et orientation induite')
    top, H = 24, 220
    RD = Repere(-1.3, 1.3, -1.3, 1.3, 10, top, H, H)
    RH = Repere(-1.35, 1.35, -0.85, 1.25, 280, top, 230, 230 * 2.1 / 2.7)
    assert abs((RH(1, 0) - RH(0, 0))[0] - (RH(0, 0) - RH(0, 1))[1]) < 1e-9
    # disque : demi-disque supérieur en léger (domaine de la carte), cercle orienté en rouge
    th = np.linspace(0, math.pi, 120)
    demi = np.vstack([np.stack([np.cos(th), np.sin(th)], -1), [[-1, 0], [1, 0]]])
    S.surface(RD(demi[:, 0], demi[:, 1]), 'b')
    tt = np.linspace(0, 2 * math.pi, 361)
    S.poly(RD(np.cos(tt), np.sin(tt)), 'r', ferme=True, l=2.2)
    for s in (math.pi * 0.95, math.pi * 1.5, math.pi * 1.98):
        q = RD(math.cos(s), math.sin(s)); d = RD(math.cos(s + 0.01), math.sin(s + 0.01)) - q
        S.pointe(q, d, 'r', taille=11, largeur=5)
    S.ligne(RD(-1, 0), RD(1, 0), 'g', d=True, l=0.9)
    P = np.array([math.cos(math.pi / 3), math.sin(math.pi / 3)])
    S.point(RD(*P), 't', r=4)
    S.fleche(RD(*P), RD(*(1.45 * P)), 'r', l=2)
    S.texte(RD(*(1.45 * P)) + [12, -2], 'ν', 'r', ancre='start', taille=17)
    T = np.array([-P[1], P[0]])
    S.fleche(RD(*P), RD(*(P + 0.55 * T)), 'b', l=2)
    S.texte(RD(*(P + 0.55 * T)) + [-4, -12], 'v', 'b', ancre='end', taille=17)
    S.texte(RD(0, -0.35), 'D', 't', taille=18)
    S.texte(RD(*P) + [-14, 10], 'p', 't', taille=16)
    # ℍ² : image de la carte, sous la parabole
    S.fleche(RH(-1.35, 0), RH(1.35, 0) + [6, 0], 'g', l=0.9)
    S.fleche(RH(0, -0.85), RH(0, 1.25) - [0, 4], 'g', l=0.9)
    S.texte(RH(1.35, 0) + [2, 16], 'u_1', 'g', ancre='end', taille=15)
    S.texte(RH(0, 1.25) + [10, 4], 'u_2', 'g', ancre='start', taille=15)
    uu = np.linspace(-1, 1, 121)
    reg = np.vstack([np.stack([uu, 1 - uu ** 2], -1), [[1, 0], [-1, 0]]])
    S.surface(RH(reg[:, 0], reg[:, 1]), 'b')
    S.poly(RH(uu, 1 - uu ** 2), 'g', d=True, l=1)
    S.ligne(RH(-1, 0), RH(1, 0), 'r', l=2.6)
    S.pointe(RH(0.75, 0), (1, 0), 'r', taille=11, largeur=5)
    q = np.array([-0.5, 0.0])
    S.point(RH(*q), 't', r=4)
    dn = np.array([-0.5, -2.0]); dn = 0.7 * dn / np.linalg.norm(dn)
    S.fleche(RH(*q), RH(*(q + dn)), 'r', l=2)
    S.texte(RH(*(q + dn)) + [-8, 6], 'dφ(ν)', 'r', ancre='end', taille=15)
    S.fleche(RH(*q), RH(*(q + np.array([0.6, 0]))), 'b', l=2)
    S.texte(RH(*(q + np.array([0.6, 0]))) + [4, -14], 'dφ(v)', 'b', ancre='start', taille=15)
    S.texte(RH(0.15, 0.45), 'φ(U)', 't', taille=16)
    S.texte(RH(1.05, 1.0), 'ℍ^2', 't', taille=17)
    # flèche de la carte
    S.fleche(RD(1.3, 0.75), RH(-1.25, 0.95), 't', l=1.2)
    S.texte((RD(1.3, 0.75) + RH(-1.25, 0.95)) / 2 + [0, -12], 'φ', 't', taille=17)
    return S
