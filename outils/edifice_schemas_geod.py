"""Schémas du graphe geod (calcul différentiel, sous-variétés, variétés, formes différentielles).

Contrainte d'ordre : l'exponentielle et la trigonométrie ne sont pas des ancêtres de geod. Les cercles
et l'étoile sont tracés avec numpy (dessin seulement) ; tout point marqué ou étiqueté a des
coordonnées rationnelles, et aucune étiquette n'emploie cos, sin ni π.
"""
from fractions import Fraction as Fr
import math
import numpy as np
import sympy as sp
from edifice_schemas import schema
from edifice_svg import Schema, Repere, arc, blob, courbe_entre


# ------------------------------------------------------------------ outils locaux
def cercle_pts(R, centre=(0.0, 0.0), rayon=1.0, n=240):
    """Cercle tracé dans le repère R (dessin seulement)."""
    t = np.linspace(0, 2 * math.pi, n)
    return R(centre[0] + rayon * np.cos(t), centre[1] + rayon * np.sin(t))


def dans_polygone(p, poly):
    """Point strictement dans un polygone (lancer de rayon)."""
    x, y = p
    dedans = False
    n = len(poly)
    for k in range(n):
        x1, y1 = poly[k]
        x2, y2 = poly[(k + 1) % n]
        if (y1 > y) != (y2 > y):
            xi = x1 + (y - y1) * (x2 - x1) / (y2 - y1)
            if xi > x:
                dedans = not dedans
    return dedans


def morceaux(pts, garde):
    """Découpe une suite de points en morceaux consécutifs où garde est vrai."""
    res, cour = [], []
    for p, g in zip(pts, garde):
        if g:
            cour.append(p)
        elif cour:
            res.append(np.array(cour)); cour = []
    if cour:
        res.append(np.array(cour))
    return [m for m in res if len(m) > 1]


def fleche_milieu(S, p, q, c='t'):
    """Pointe au milieu du segment [p, q], dans le sens de p vers q."""
    p, q = np.asarray(p, float), np.asarray(q, float)
    u = q - p
    S.pointe((p + q) / 2 + 5 * u / np.linalg.norm(u), u, c, taille=11, largeur=5)


# ------------------------------------------------------------------ (23) gd-normes
@schema('gd-normes')
def gd_normes():
    # Dans ℝ², ‖x‖_∞ ⩽ ‖x‖_1 ⩽ 2‖x‖_∞ : B_1(0,1) ⊂ B_∞(0,1) ⊂ B_1(0,2).
    rng = np.random.default_rng(1)
    X = rng.uniform(-2.5, 2.5, size=(20000, 2))
    n1, ninf = np.abs(X).sum(1), np.abs(X).max(1)
    assert np.all(ninf <= n1 + 1e-12) and np.all(n1 <= 2 * ninf + 1e-12)
    assert np.all(ninf[n1 < 1] < 1) and np.all(n1[ninf < 1] < 2)
    S = Schema(500, 412, 'Boules unité des normes 1 et infini dans le plan, emboîtées')
    R = Repere(-2.45, 2.45, -2.3, 2.3, 20, 30, 392, 368)
    R.axes(S, 'x_1', 'x_2')
    los1 = [(1, 0), (0, 1), (-1, 0), (0, -1)]
    los2 = [(2, 0), (0, 2), (-2, 0), (0, -2)]
    car = [(1, 1), (-1, 1), (-1, -1), (1, -1)]
    S.poly(R(*np.array(los2).T), 'g', d=True, ferme=True)
    S.poly(R(*np.array(car).T), 'b', ferme=True, rempli='b')
    S.poly(R(*np.array(los1).T), 'r', ferme=True, rempli='r')
    for v in (1, 2):
        S.texte(R(v, 0) + [6, 14], f'{v}', 'g', ancre='start', taille=14)
        S.texte(R(0, v) + [-7, -11], f'{v}', 'g', ancre='end', taille=14)
    S.ligne(R(0.5, 0.5), R(1.5, 1.42), 'g', l=0.8)
    S.texte(R(1.5, 1.42) + [4, -8], 'B_1(0, 1)', 'r', ancre='start')
    S.texte(R(-1, 1) + [-8, -14], 'B_∞(0, 1)', 'b', ancre='end')
    S.texte(R(1.2, -1.2) + [8, 6], 'B_1(0, 2)', 'g', ancre='start')
    return S


# ------------------------------------------------------------------ (24) gd-differentielle
@schema('gd-differentielle')
def gd_differentielle():
    x, y, t = sp.symbols('x y t', real=True)
    f = x * y / (x**2 + y**2)
    pentes = [Fr(0), Fr(1, 2), Fr(1), Fr(2), None, Fr(-2), Fr(-1), Fr(-1, 2)]
    S = Schema(480, 410, 'Valeurs constantes de xy/(x²+y²) sur les droites passant par l’origine')
    R = Repere(-1.42, 1.42, -1.38, 1.38, 25, 12, 430, 418 * 1 - 32)
    for m in pentes:
        if m is None:
            d, val = np.array([0.0, 1.0]), sp.Integer(0)
            assert sp.simplify(f.subs({x: 0, y: t})) == 0
        else:
            d = np.array([1.0, float(m)]); d /= np.linalg.norm(d)
            val = sp.simplify(f.subs({x: t, y: sp.Rational(m.numerator, m.denominator) * t}))
            assert val == sp.Rational(m.numerator, m.denominator) / (1 + sp.Rational(m.numerator, m.denominator)**2)
        c = 'g' if val == 0 else ('r' if val > 0 else 'b')
        for s in (1, -1):
            S.ligne(R(*(s * 0.07 * d)), R(*(s * 1.0 * d)), c)
            lab = str(val).replace('-', '−')
            S.texte(R(*(s * 1.2 * d)), lab, c, taille=15)
    S.point(R(0, 0), 't', r=4.5, creux=True)
    return S


# ------------------------------------------------------------------ (25) gd-classe-ck
@schema('gd-classe-ck')
def gd_classe_ck():
    # n = 2, a = 0, h = (1, 3/4), r = 5/4 ; points c_j des accroissements finis pour f = x³ + y³.
    h1, h2, r = 1.0, 0.75, 1.25
    assert max(abs(h1), abs(h2)) < r
    f = lambda x, y: x**3 + y**3
    c1 = np.array([h1 / math.sqrt(3), 0.0])           # f(a¹) − f(a⁰) = h_1 ∂_1 f(c_1)
    c2 = np.array([h1, h2 / math.sqrt(3)])            # f(a²) − f(a¹) = h_2 ∂_2 f(c_2)
    assert abs(f(h1, 0) - f(0, 0) - h1 * 3 * c1[0]**2) < 1e-12 and 0 < c1[0] < h1
    assert abs(f(h1, h2) - f(h1, 0) - h2 * 3 * c2[1]**2) < 1e-12 and 0 < c2[1] < h2
    S = Schema(500, 380, 'Chemin parallèle aux axes de a à a + h dans le cube de centre a')
    R = Repere(-1.45, 2.55, -1.4, 1.4, 10, 15, 400 * 1.25, 350)
    R = Repere(-1.4, 2.3, -1.4, 1.4, 10, 15, 488, 350)
    sc = 350 / 2.8
    assert abs(488 / 3.7 - sc) < 7
    S.rect(*R(-r, r), 2 * r * 350 / 2.8, 2 * r * 350 / 2.8, 'g', rempli='g')
    S.texte(R(-r, -r) + [8, -14], 'B_∞(a, r)', 'g', ancre='start', taille=15)
    a0, a1, a2 = np.array([0, 0.0]), np.array([h1, 0]), np.array([h1, h2])
    S.ligne(R(*a0), R(*a2), 'g', d=True)
    S.fleche(R(*a0), R(*a1), 'r', retrait=5)
    S.fleche(R(*a1), R(*a2), 'r', retrait=5)
    for p in (a0, a1, a2):
        S.point(R(*p), 't', r=3.6)
    S.point(R(*c1), 'b', r=4); S.point(R(*c2), 'b', r=4)
    S.texte(R(*c1) + [0, 18], 'c_1', 'b')
    S.texte(R(*c2) + [-10, 0], 'c_2', 'b', ancre='end')
    S.texte(R(*a0) + [-8, 16], 'a = a^{(0)}', ancre='end')
    S.texte(R(*a1) + [8, 16], 'a^{(1)} = a + h_1e_1', ancre='start')
    S.texte(R(*a2) + [10, -10], 'a^{(2)} = a + h', ancre='start')
    return S


# ------------------------------------------------------------------ (26) gd-point-fixe
@schema('gd-point-fixe')
def gd_point_fixe():
    phi = lambda x: (x + 2 / x) / 2
    xs = [Fr(1)]
    for _ in range(3):
        xs.append((xs[-1] + 2 / xs[-1]) / 2)
    assert xs[1:] == [Fr(3, 2), Fr(17, 12), Fr(577, 408)]
    g = np.linspace(1, 2, 2001)
    assert np.all((phi(g) >= 1) & (phi(g) <= 2))                     # φ([1, 2]) ⊂ [1, 2]
    assert abs(float(xs[2]) - math.sqrt(2)) < 1 / 400
    S = Schema(480, 400, 'Itération de Héron dans le carré [1, 2]²')
    R = Repere(0.86, 2.1, 0.86, 2.1, 30, 8, 400, 340)
    S.fleche(R(0.86, 0.9), R(2.1, 0.9), 'g')
    S.fleche(R(0.9, 0.86), R(0.9, 2.1), 'g')
    S.poly(R(np.array([1, 2, 2, 1.0]), np.array([1, 1, 2, 2.0])), 'g', ferme=True, rempli='g')
    S.ligne(R(1, 1), R(2, 2), 'g', d=True)
    R.graphe(S, phi, 1, 2, 't', l=2)
    S.texte(R(2, phi(2)) + [6, -14], 'φ', ancre='start')
    S.texte(R(1.82, 1.82) + [-10, -6], 'y = x', 'g', ancre='end', taille=14)
    pts = []
    for k in range(2):
        u, v = float(xs[k]), float(xs[k + 1])
        pts += [(u, u), (u, v)]
    pts.append((float(xs[2]), float(xs[2])))
    P = R(*np.array(pts).T)
    S.poly(P, 'r')
    for k in range(len(P) - 1):
        if np.linalg.norm(P[k + 1] - P[k]) > 30:
            fleche_milieu(S, P[k], P[k + 1], 'r')
    for k, (nom, val) in enumerate([('x_0', '1'), ('x_1', '3/2'), ('x_2', '17/12')]):
        u = float(xs[k])
        S.ligne(R(u, 0.9), R(u, u), 'g', d=True, l=0.8)
        S.point(R(u, 0.9), 'r', r=3.4)
        dx = {0: 0, 1: 10, 2: -10}[k]
        anc = {0: 'middle', 1: 'start', 2: 'end'}[k]
        S.texte(R(u, 0.9) + [dx, 18], nom, 'r', ancre=anc)
        S.texte(R(u, 0.9) + [dx, 40], val, 'r', ancre=anc, taille=14)
    S.texte(R(2, 0.9) + [0, 18], '2')
    S.texte(R(0.9, 2) + [-8, 0], '2', ancre='end')
    S.texte(R(0.9, 1) + [-8, 0], '1', ancre='end')
    return S


# ------------------------------------------------------------------ (27) gd-submersions
@schema('gd-submersions')
def gd_submersions():
    Fq = lambda x, y: x * x + y * y - 1
    # points rationnels du cercle utilisés
    for p in [(Fr(3, 5), Fr(4, 5)), (Fr(-3, 5), Fr(4, 5)), (Fr(4, 5), Fr(3, 5)), (Fr(4, 5), Fr(-3, 5))]:
        assert Fq(*p) == 0
    S = Schema(520, 412, 'Le cercle comme graphe au voisinage de (0, 1) et de (1, 0)')
    R = Repere(-1.35, 2.25, -1.3, 1.45, 15, 26, 504, 385)
    R.axes(S)
    S.poly(cercle_pts(R), 't')
    # boîte bleue près de (0, 1) : ]−1/2, 1/2[ × ]1/2, 6/5[, l'arc y = √(1 − x²)
    S.rect(*R(-0.5, 1.2), 1.0 * 140, 0.7 * 140, 'b', d=True, rempli='b')
    xs = np.linspace(-0.5, 0.5, 121)
    S.poly(R(xs, np.sqrt(1 - xs**2)), 'b', l=3)
    assert np.all((np.sqrt(1 - xs**2) > 0.5) & (np.sqrt(1 - xs**2) < 1.2))
    # boîte verte près de (1, 0) : ]1/2, 6/5[ × ]−4/5, 4/5[, l'arc x = √(1 − y²)
    S.rect(*R(0.5, 0.8), 0.7 * 140, 1.6 * 140, 'v', d=True, rempli='v')
    ys = np.linspace(-0.8, 0.8, 121)
    S.poly(R(np.sqrt(1 - ys**2), ys), 'v', l=3)
    assert np.all((np.sqrt(1 - ys**2) > 0.5) & (np.sqrt(1 - ys**2) < 1.2))
    # une verticale x = 4/5 coupe deux fois le cercle dans la boîte verte
    x0 = Fr(4, 5)
    yy = sp.solve(sp.Eq(sp.Rational(4, 5)**2 + sp.Symbol('y')**2, 1))
    assert sorted(yy) == [sp.Rational(-3, 5), sp.Rational(3, 5)]
    S.ligne(R(0.8, -0.95), R(0.8, 0.95), 'r', d=True)
    for v in (0.6, -0.6):
        S.point(R(0.8, v), 'r', r=4.2)
    S.point(R(0, 1), 't', r=3.8); S.point(R(1, 0), 't', r=3.8)
    S.texte(R(0, 1) + [0, -14], '(0, 1)', taille=15)
    S.texte(R(1, 0) + [8, 14], '(1, 0)', ancre='start', taille=15)
    S.texte(R(-0.5, 1.2) + [0, -14], 'y = √(1 − x^2)', 'b', ancre='start')
    S.texte(R(1.2, 0.35) + [10, 0], 'x = √(1 − y^2)', 'v', ancre='start')
    S.texte(R(0.8, 0.6) + [10, 0], '(4/5, 3/5)', 'r', ancre='start', taille=14)
    S.texte(R(0.8, -0.6) + [10, 0], '(4/5, −3/5)', 'r', ancre='start', taille=14)
    return S


# ------------------------------------------------------------------ (28) gd-sous-varietes
@schema('gd-sous-varietes')
def gd_sous_varietes():
    # M : y = g(x) = x²/2 près de a = (0, 0), U = disque unité, Φ(x, y) = (x, y − g(x)),
    # difféomorphisme de ℝ² de réciproque (u, v) ↦ (u, v + g(u)).
    g = lambda x: x * x / 2
    Phi = lambda x, y: (x, y - g(x))
    Psi = lambda u, v: (u, v + g(u))
    ts = np.linspace(-2, 2, 7)
    for u in ts:
        for v in ts:
            assert np.allclose(Phi(*Psi(u, v)), (u, v))
    S = Schema(530, 292, 'Redressement d’une courbe par un difféomorphisme')
    k = 270 / 2.75
    L = Repere(-1.12, 1.3, -1.58, 1.17, 8, 14, 2.42 * k, 270)
    D = Repere(-1.12, 1.62, -1.58, 1.17, 8 + 2.42 * k + 8, 14, 2.74 * k, 270)
    # gauche : U, courbes de niveau de y − g(x), M
    S.poly(cercle_pts(L), 'g', rempli='g')
    xs = np.linspace(-1.2, 1.2, 600)
    for c in (-0.6, -0.3, 0.3, 0.6, 0.0):
        ys = g(xs) + c
        for m in morceaux(np.stack([xs, ys], 1), xs**2 + ys**2 < 1):
            S.poly(L(*m.T), 'r' if c == 0 else 'g', l=None if c == 0 else 0.9)
    S.point(L(0, 0), 'r', r=4)
    S.texte(L(0, 0) + [0, 18], 'a', 'r')
    S.texte(L(0.95, g(0.95)) + [6, -6], 'M', 'r', ancre='start')
    S.texte(L(-0.72, -0.72) + [-6, 10], 'U', 'g', ancre='end')
    # droite : Φ(U), droites v = c, ℝ × {0}
    t = np.linspace(0, 2 * math.pi, 400)
    bx, by = np.cos(t), np.sin(t)
    S.poly(D(*np.array(Phi(bx, by))), 'g', rempli='g')
    S.ligne(D(-1.12, 0), D(1.6, 0), 'g', d=True)
    us = np.linspace(-1.2, 1.2, 600)
    for c in (-0.6, -0.3, 0.3, 0.6, 0.0):
        X, Y = Psi(us, np.full_like(us, c))
        for m in morceaux(np.stack([us, np.full_like(us, c)], 1), X**2 + Y**2 < 1):
            S.poly(D(*m.T), 'r' if c == 0 else 'g', l=None if c == 0 else 0.9)
    S.point(D(0, 0), 'r', r=4)
    S.texte(D(0, 0) + [0, 18], 'Φ(a)', 'r')
    S.texte(D(1.6, 0) + [0, -14], 'ℝ × {0}', 'g', ancre='end', taille=15)
    S.texte(D(1.0, -1.0) + [8, 0], 'Φ(U)', 'g', ancre='start')
    # flèche Φ
    p, q = L(0.8, 0.95), D(-0.75, 0.95)
    arcp = courbe_entre(p, q, -0.3)
    S.courbe_fleche(arcp, 't')
    S.texte(arcp[len(arcp) // 2] + [0, -12], 'Φ')
    return S


# ------------------------------------------------------------------ (29) gd-tangent-sm
@schema('gd-tangent-sm')
def gd_tangent_sm():
    a = np.array([Fr(3, 5), Fr(4, 5)])
    assert a[0]**2 + a[1]**2 == 1
    # γ(t) = R(t/3) a, avec R(s) = [[1 − s², −2s], [2s, 1 − s²]]/(1 + s²), rotation rationnelle
    def rot(s):
        return np.array([[1 - s * s, -2 * s], [2 * s, 1 - s * s]]) / (1 + s * s)
    gam = lambda t: rot(t / 3) @ a.astype(float)
    v = np.array([Fr(-8, 15), Fr(6, 15)])                       # γ'(0) = (2/3)(−a_2, a_1)
    hnum = 1e-6
    assert np.allclose((gam(hnum) - gam(-hnum)) / (2 * hnum), v.astype(float))
    assert a[0] * v[0] + a[1] * v[1] == 0                       # v ∈ T_aS¹ = {h : Σ a_i h_i = 0}
    for t in np.linspace(-1, 1, 9):
        assert abs(np.sum(gam(t)**2) - 1) < 1e-12
    af, vf = a.astype(float), v.astype(float)
    u = np.array([4, -3]) / 5.0
    S = Schema(500, 386, 'Espace tangent au cercle en a : droite vectorielle et tangente affine')
    R = Repere(-1.75, 1.95, -1.45, 1.75, 15, 12, 470, 405 - 25)
    S.poly(cercle_pts(R), 't')
    S.texte(R(-0.72, -0.72) + [-6, 8], 'S^1', ancre='end')
    # T_aS¹ (droite vectorielle) et a + T_aS¹ (tangente affine)
    S.ligne(R(*(-1.85 * u)), R(*(1.75 * u)), 'r')
    S.texte(R(*(1.62 * u)) + [8, -12], 'T_aS^1', 'r', ancre='start')
    S.ligne(R(*(af - 1.4 * u)), R(*(af + 1.1 * u)), 'g', d=True)
    S.texte(R(*(af - 1.4 * u)) + [-4, -12], 'a + T_aS^1', 'g', ancre='end', taille=15)
    # normale a
    S.fleche(R(0, 0), R(*af), 'g', retrait=4)
    # courbe γ et vitesse
    tt = np.linspace(-1.1, 1.1, 80)
    S.poly(R(*np.array([gam(t) for t in tt]).T), 'b', l=3.2)
    S.fleche(R(*af), R(*(af + vf)), 'b')
    S.texte(R(*(af + vf)) + [6, -16], 'γ^′(0)', 'b', ancre='start')
    S.fleche(R(0, 0), R(*vf), 'r')
    S.texte(R(*vf) + [-8, 2], 'γ^′(0)', 'r', ancre='end', taille=15)
    S.texte(R(*gam(1.1)) + [10, 10], 'γ', 'b', ancre='start')
    S.point(R(*af), 't', r=3.8)
    S.texte(R(*af) + [12, 6], 'a', ancre='start')
    S.point(R(0, 0), 't', r=3.4)
    S.texte(R(0, 0) + [-8, 14], '0', ancre='end')
    return S


# ------------------------------------------------------------------ (30) gd-varietes
def _ellipse_pts(c, rx, ry, n=360):
    t = np.linspace(0, 2 * math.pi, n, endpoint=False)
    return np.stack([c[0] + rx * np.cos(t), c[1] + ry * np.sin(t)], 1)


def _dans_ellipse(p, c, rx, ry):
    p = np.atleast_2d(p)
    return ((p[:, 0] - c[0]) / rx)**2 + ((p[:, 1] - c[1]) / ry)**2 < 1


@schema('gd-varietes')
def gd_varietes():
    S = Schema(520, 410, 'Deux cartes d’une variété et leur changement de carte')
    # M (coordonnées image), U et V ellipses qui se chevauchent
    M = blob((260, 100), 205, 86, graine=3, amplitude=0.05)
    cU, rU = np.array([205.0, 95]), (78, 52)
    cV, rV = np.array([315.0, 92]), (80, 50)
    EU, EV = _ellipse_pts(cU, *rU), _ellipse_pts(cV, *rV)
    assert all(dans_polygone(p, M) for p in np.vstack([EU, EV]))   # U, V ⊂ M
    # bord de U ∩ V (convexe) : arcs de chaque ellipse contenus dans l'autre, triés par angle
    bord = np.vstack([EU[_dans_ellipse(EU, cV, *rV)], EV[_dans_ellipse(EV, cU, *rU)]])
    m = bord.mean(0)
    bord = bord[np.argsort(np.arctan2(bord[:, 1] - m[1], bord[:, 0] - m[0]))]
    assert len(bord) > 40
    S.poly(M, 't', ferme=True)
    S.poly(EU, 'b', ferme=True, rempli='b')
    S.poly(EV, 'v', ferme=True, rempli='v')
    S.surface(bord, 'r')
    S.poly(bord, 'r', ferme=True, l=1.4)
    S.texte((105, 42), 'M')
    S.texte(cU + [-50, 0], 'U', 'b')
    S.texte(cV + [50, 0], 'V', 'v')
    # fenêtres de ℝ^n
    WL, WR = (20, 250, 200, 140), (300, 250, 200, 140)
    for (x, y, w, h) in (WL, WR):
        S.rect(x, y, w, h, 'g')
        S.texte((x + w - 8, y + h - 14), 'ℝ^n', 'g', ancre='end', taille=15)
    # φ : similitude ; ψ : similitude suivie d'une flexion (u, v) ↦ (u, v + k u²)
    def phi(P):
        P = np.atleast_2d(P)
        return (P - cU) * 0.95 + [WL[0] + 92, WL[1] + 62]
    def psi(P):
        P = np.atleast_2d(P)
        Q = (P - cV) * [0.85, 0.9]
        return np.stack([Q[:, 0] + WR[0] + 108, Q[:, 1] - 0.006 * Q[:, 0]**2 + WR[1] + 72], 1)
    for img, E, c, W in ((phi, EU, 'b', WL), (psi, EV, 'v', WR)):
        P = img(E)
        x, y, w, h = W
        assert P[:, 0].min() > x and P[:, 0].max() < x + w and P[:, 1].min() > y and P[:, 1].max() < y + h
        S.poly(P, c, ferme=True)
        S.surface(img(bord), 'r')
        S.poly(img(bord), 'r', ferme=True, l=1.4)
    S.texte(phi(cU)[0] + [-48, -6], 'φ(U)', 'b', taille=15)
    S.texte(psi(cV)[0] + [52, -2], 'ψ(V)', 'v', taille=15)
    # flèches φ, ψ, ψ∘φ⁻¹
    for p, q, cb, nom, c, dx in [((150, 140), (100, 262), 0.25, 'φ', 'b', -18),
                                 ((370, 140), (420, 262), -0.25, 'ψ', 'v', 18)]:
        A = courbe_entre(p, q, cb)
        S.courbe_fleche(A, c)
        S.texte(A[len(A) // 2] + [dx, 0], nom, c)
    pl, pr = phi(bord).mean(0), psi(bord).mean(0)
    A = courbe_entre(pl + [30, -20], pr + [-30, -20], 0.22)
    S.courbe_fleche(A, 'r')
    S.texte(A[len(A) // 2] + [0, -14], 'ψ ∘ φ^{−1}', 'r')
    return S


# ------------------------------------------------------------------ (31) gd-exemples-varietes
@schema('gd-exemples-varietes')
def gd_varietes_2():
    x = (Fr(3, 5), Fr(4, 5))
    assert x[0]**2 + x[1]**2 == 1
    sp_ = x[0] / (1 - x[1])          # σ_+(x), projection depuis N = (0, 1)
    sm = x[0] / (1 + x[1])           # σ_−(x), projection depuis S = (0, −1)
    assert sp_ == 3 and sm == Fr(1, 3)
    # σ_+(x) est l'intersection de la droite (N x) avec l'axe ; de même pour σ_−
    for P, z in [((0, 1), sp_), ((0, -1), sm)]:
        t = Fr(-P[1], x[1] - P[1])
        assert P[0] + t * (x[0] - P[0]) == z
    assert sm == sp_ / sp_**2        # σ_− ∘ σ_+^{-1}(z) = z/‖z‖²
    # σ_+^{-1}(3) = (2·3, 9 − 1)/(9 + 1) = x
    assert (Fr(6, 10), Fr(8, 10)) == x
    xf = np.array([0.6, 0.8])
    S = Schema(520, 300, 'Projections stéréographiques depuis les deux pôles')
    R = Repere(-1.35, 3.55, -1.25, 1.42, 12, 14, 500, 272)
    S.ligne(R(-1.35, 0), R(3.5, 0), 'g', l=0.9)
    S.texte(R(3.5, 0) + [-2, -12], 'ℝ', 'g', ancre='end', taille=15)
    S.poly(cercle_pts(R), 't')
    S.ligne(R(0, 1), R(3, 0), 'r')
    S.ligne(R(0, -1), R(1 / 3, 0), 'b')
    S.ligne(R(1 / 3, 0), R(0.6, 0.8), 'b', d=True)
    S.point(R(0, 1), 'r', r=4); S.texte(R(0, 1) + [-10, -8], 'N', 'r', ancre='end')
    S.point(R(0, -1), 'b', r=4); S.texte(R(0, -1) + [-10, 8], 'S', 'b', ancre='end')
    S.point(R(*xf), 't', r=4); S.texte(R(*xf) + [6, -14], 'x = (3/5, 4/5)', ancre='start', taille=15)
    S.point(R(3, 0), 'r', r=4); S.texte(R(3, 0) + [0, 20], 'σ_+(x) = 3', 'r')
    S.point(R(1 / 3, 0), 'b', r=4)
    S.ligne(R(1 / 3, 0) + [3, 4], R(1.08, -0.42) + [-4, -4], 'g', l=0.8)
    S.texte(R(1.08, -0.42) + [0, 6], 'σ_−(x) = 1/3', 'b', ancre='start')
    S.point(R(0, 0), 'g', r=2.6); S.texte(R(0, 0) + [-8, 14], '0', 'g', ancre='end', taille=14)
    return S


# ------------------------------------------------------------------ (32) gd-fibre-tangent
@schema('gd-fibre-tangent')
def gd_fibre_tangent():
    P = [(1, 0), (-1, 0), (0, 1), (0, -1)]
    P += [(sx * Fr(3, 5), sy * Fr(4, 5)) for sx in (1, -1) for sy in (1, -1)]
    P += [(sx * Fr(4, 5), sy * Fr(3, 5)) for sx in (1, -1) for sy in (1, -1)]
    assert len(set(P)) == 12
    S = Schema(480, 400, 'Champ de vecteurs tangent au cercle ne s’annulant pas')
    R = Repere(-1.6, 1.6, -1.6, 1.6, 8, 10, 380, 380)
    S.ligne(R(-1.55, 0), R(1.55, 0), 'g', l=0.8)
    S.ligne(R(0, -1.55), R(0, 1.55), 'g', l=0.8)
    S.poly(cercle_pts(R), 't')
    for (x, y) in P:
        X = (-y, x)
        assert x * x + y * y == 1 and x * X[0] + y * X[1] == 0 and X[0]**2 + X[1]**2 == 1
        p = np.array([float(x), float(y)])
        q = p + 0.4 * np.array([float(X[0]), float(X[1])])
        S.fleche(R(*p), R(*q), 'r')
        S.point(R(*p), 't', r=2.8)
    S.texte(R(-0.75, -0.75) + [-14, 14], 'S^1', ancre='end')
    S.texte(R(1, 0) + [10, 14], '(1, 0)', ancre='start', taille=14)
    S.texte(R(1, 0.4) + [8, -2], 'X(1, 0) = (0, 1)', 'r', ancre='start', taille=14)
    return S


# ------------------------------------------------------------------ (33) gd-schwarz
@schema('gd-schwarz')
def gd_schwarz():
    # Exemple : f(x, y) = xy(x − y)² + xy, a = 0, s = 1, e_i = e_x, e_j = e_y.
    x, y, c, cp = sp.symbols('x y c cp', real=True)
    f = x * y * (x - y)**2 + x * y
    D = f.subs({x: 1, y: 1}) - f.subs({x: 1, y: 0}) - f.subs({x: 0, y: 1}) + f.subs({x: 0, y: 0})
    fx, fy, fxy = sp.diff(f, x), sp.diff(f, y), sp.diff(f, x, y)
    assert sp.simplify(fxy - sp.diff(f, y, x)) == 0
    # premier chemin : c puis c'
    c0 = [r for r in sp.solve(sp.Eq(fx.subs({x: c, y: 1}) - fx.subs({x: c, y: 0}), D), c) if 0 < r < 1]
    assert c0 == [sp.Rational(1, 3)]
    cps = sorted(float(r) for r in sp.solve(sp.Eq(fxy.subs({x: c0[0], y: cp}), D), cp) if 0 < r < 1)
    P = np.array([1 / 3, cps[-1]])
    # second chemin, rôles de i et j échangés : d' puis d
    d0 = [r for r in sp.solve(sp.Eq(fy.subs({x: 1, y: c}) - fy.subs({x: 0, y: c}), D), c) if 0 < r < 1]
    assert d0 == [sp.Rational(1, 3)]
    ds = sorted(float(r) for r in sp.solve(sp.Eq(fxy.subs({x: c, y: d0[0]}), D), c) if 0 < r < 1)
    Q = np.array([ds[-1], 1 / 3])
    for Z in (P, Q):
        assert abs(float(fxy.subs({x: Z[0], y: Z[1]})) - float(D)) < 1e-9
    S = Schema(520, 285, 'Le carré de côté s et les deux points des accroissements finis')
    R = Repere(-0.9, 1.9, -0.22, 1.18, 0, 12, 520, 260)
    S.rect(*R(0, 1), 260 / 1.4, 260 / 1.4, 't', rempli='g')
    coins = [((0, 0), '+', 'a', (-10, 14), 'end'), ((1, 1), '+', 'a + se_i + se_j', (10, -14), 'start'),
             ((1, 0), '−', 'a + se_i', (10, 14), 'start'), ((0, 1), '−', 'a + se_j', (-10, -14), 'end')]
    for (p, sg, nom, dd, anc) in coins:
        S.point(R(*p), 't', r=4)
        S.texte(R(*p) + dd, nom, ancre=anc)
        cs = 'r' if sg == '+' else 'b'
        S.texte(R(*p) + [(-1 if anc == 'end' else 1) * 2 + (12 if anc == 'start' else -12) * -1, (-1 if dd[1] > 0 else 1) * 16],
                sg, 'g', taille=17)
    S.point(R(*P), 'r', r=4.4)
    S.point(R(*Q), 'b', r=4.4)
    S.texte(R(*P) + [10, -2], '∂_j∂_if', 'r', ancre='start', taille=15)
    S.texte(R(*Q) + [0, 20], '∂_i∂_jf', 'b', taille=15)
    S.texte(R(0.5, 0) + [0, 18], 's', 'g', taille=15)
    S.texte(R(0, 0.5) + [-10, 0], 's', 'g', ancre='end', taille=15)
    return S


# ------------------------------------------------------------------ (34) gd-integrale-curviligne
@schema('gd-integrale-curviligne')
def gd_integrale_curviligne():
    x, y, t = sp.symbols('x y t', real=True)
    cotes = [((1, t), 'right'), ((-t, 1), 'top'), ((-1, -t), 'left'), ((t, -1), 'bottom')]
    for (gx, gy), _ in cotes:
        # ω(γ'(t)) = (x y' − y x')/(x² + y²) = 1/(1 + t²) sur chaque côté, t ∈ [−1, 1]
        w = (gx * sp.diff(gy, t) - gy * sp.diff(gx, t)) / (gx**2 + gy**2)
        assert sp.simplify(w - 1 / (1 + t**2)) == 0
        g0 = (gx.subs(t, -1) if hasattr(gx, 'subs') else gx, gy.subs(t, -1) if hasattr(gy, 'subs') else gy)
    S = Schema(500, 380, 'Bord du carré [−1, 1]² parcouru dans le sens direct autour de l’origine exclue')
    R = Repere(-2.05, 2.05, -1.62, 1.62, 0, 12, 500 * 1.0, 356)
    sc = 356 / 3.24
    S.ligne(R(-1.6, 0), R(1.6, 0), 'g', l=0.8)
    S.ligne(R(0, -1.5), R(0, 1.5), 'g', l=0.8)
    C = [(1, -1), (1, 1), (-1, 1), (-1, -1)]
    S.poly(R(*np.array(C).T), 'r', ferme=True)
    for k in range(4):
        p, q = R(*C[k]), R(*C[(k + 1) % 4])
        fleche_milieu(S, p, q, 'r')
        S.point(p, 'r', r=3)
    S.point(R(0, 0), 't', r=4.5, creux=True)
    S.texte(R(0, 0) + [8, 16], 'exclu', 'g', ancre='start', ui=True)
    S.texte(R(1, 0.45) + [10, 0], '(1, t)', 'r', ancre='start', taille=15)
    S.texte(R(-0.45, 1) + [0, -14], '(−t, 1)', 'r', taille=15)
    S.texte(R(-1, -0.45) + [-10, 0], '(−1, −t)', 'r', ancre='end', taille=15)
    S.texte(R(0.45, -1) + [0, 16], '(t, −1)', 'r', taille=15)
    for (p, s) in [((1, -1), '(1, −1)'), ((1, 1), '(1, 1)'), ((-1, 1), '(−1, 1)'), ((-1, -1), '(−1, −1)')]:
        S.texte(R(*p) + [10 * np.sign(p[0]), 14 * -np.sign(p[1])], s, 'g', ancre='start' if p[0] > 0 else 'end', taille=14)
    return S


# ------------------------------------------------------------------ (35) gd-poincare
@schema('gd-poincare')
def gd_poincare():
    # étoile à cinq branches (rayons 1 et 0,42), étoilée par rapport à 0 mais non convexe
    ang = math.pi / 2 + np.arange(10) * math.pi / 5
    rr = np.where(np.arange(10) % 2 == 0, 1.0, 0.42)
    E = np.stack([rr * np.cos(ang), rr * np.sin(ang)], 1)
    xs = [0.86 * E[0], 0.8 * E[2], 0.75 * E[8]]            # trois points de U
    tt = np.linspace(0, 1, 201)
    for p in xs:
        assert all(dans_polygone(s * p, E) for s in tt)      # [0, x] ⊂ U
    # non convexe : le segment entre deux pointes voisines sort de U
    p1, p2 = 0.9 * E[4], 0.9 * E[6]
    assert dans_polygone(p1, E) and dans_polygone(p2, E)
    assert not all(dans_polygone((1 - s) * p1 + s * p2, E) for s in tt)
    # étoilé par rapport à 0 : vérification sur une grille
    G = np.stack(np.meshgrid(np.linspace(-1, 1, 41), np.linspace(-1, 1, 41)), -1).reshape(-1, 2)
    for p in G:
        if dans_polygone(p, E):
            assert all(dans_polygone(s * p, E) for s in tt[1:])
    S = Schema(460, 400, 'Ouvert étoilé non convexe et segments issus de l’origine')
    R = Repere(-1.25, 1.25, -1.05, 1.18, 15, 10, 430, 384)
    S.poly(R(*E.T), 'b', ferme=True, rempli='b')
    S.texte(R(*E[8]) + [-14, 26], 'U', 'b', ancre='end')
    S.ligne(R(*p1), R(*p2), 'g', d=True)
    S.point(R(*p1), 'g', r=3); S.point(R(*p2), 'g', r=3)
    for k, p in enumerate(xs):
        S.ligne(R(0, 0), R(*p), 'r')
        S.point(R(*p), 'r', r=3.8)
    t0 = 0.55
    S.point(R(*(t0 * xs[1])), 'r', r=3.8)
    S.texte(R(*xs[1]) + [2, -16], 'x', 'r')
    S.texte(R(*(t0 * xs[1])) + [2, -16], 'tx', 'r')
    S.point(R(0, 0), 't', r=4)
    S.texte(R(0, 0) + [10, 16], '0', ancre='start')
    return S
