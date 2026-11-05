"""Schémas des exemples du lexique, théorie cdiff : contenu/exemples/cdiff.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 400 à 440, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées (formules exactes, sympy pour les points critiques, contourpy pour les
lignes de niveau, dont chaque point est vérifié sur la fonction), et ce que dit la légende vérifié par assert.
Axes, flèches et étiquettes restent dans le cadre (assert sur la largeur calculée des étiquettes).
"""
import math
import numpy as np
import sympy as sp
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

W0 = 420
TL = 17
PI = math.pi


# ---------------------------------------------------------------------------------------------- auxiliaires

def _dans_cadre(S, p, s, taille=TL, ancre='middle', marge=2):
    """Vérifie qu'une étiquette tient dans le cadre (largeur calculée sur les polices KaTeX)."""
    w = largeur_texte(s.replace('_', '').replace('^', '').replace('{', '').replace('}', '').replace('`', ''), taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


def _etiq(S, p, s, c='t', ancre='middle', taille=TL):
    _dans_cadre(S, p, s, taille, ancre)
    S.texte(p, s, c, ancre=ancre, taille=taille)


def _axes(S, R, nx='x', ny='y', c='g', origine=(0, 0), taille=17):
    """Axes du repère, flèches et noms à l'intérieur du rectangle du repère (rien ne sort du cadre)."""
    ox, oy = origine
    S.fleche(R(R.xmin, oy), R(R.xmax, oy), c)
    if nx:
        p = R(R.xmax, oy) + [-4, -13]
        _dans_cadre(S, p, nx, taille, 'end')
        S.texte(p, nx, c, ancre='end', taille=taille)
    S.fleche(R(ox, R.ymin), R(ox, R.ymax), c)
    if ny:
        p = R(ox, R.ymax) + [-9, 7]
        _dans_cadre(S, p, ny, taille, 'end')
        S.texte(p, ny, c, ancre='end', taille=taille)


def _courbe(S, R, fn, a, b, c='t', n=600, l=None, d=False):
    """Graphe de fn sur [a, b], coupé aux sorties du repère (morceaux successifs)."""
    xs = np.linspace(a, b, n)
    with np.errstate(all='ignore'):
        ys = np.array([fn(q) for q in xs], float)
    dedans = np.isfinite(ys) & (ys >= R.ymin) & (ys <= R.ymax)
    morceau = []
    for q, yv, ok in zip(xs, ys, dedans):
        if ok:
            morceau.append((q, yv))
        elif morceau:
            if len(morceau) > 1:
                S.poly(R(*np.array(morceau).T), c, d, l=l)
            morceau = []
    if len(morceau) > 1:
        S.poly(R(*np.array(morceau).T), c, d, l=l)


def _graduation_x(S, R, v, lab, c='g', dy=16, taille=17):
    S.ligne(R(v, 0) + [0, -3], R(v, 0) + [0, 3], c)
    if lab:
        S.texte(R(v, 0) + [0, dy], lab, c, taille=taille)


def _graduation_y(S, R, v, lab, c='g', dx=-8, taille=17):
    S.ligne(R(0, v) + [-3, 0], R(0, v) + [3, 0], c)
    if lab:
        S.texte(R(0, v) + [dx, 0], lab, c, ancre='end' if dx < 0 else 'start', taille=taille)


def _niveaux(fn, boite, niveaux, n=601):
    """Lignes de niveau calculées par contourpy ; chaque point est vérifié sur la fonction."""
    import contourpy
    xmin, xmax, ymin, ymax = boite
    X, Y = np.meshgrid(np.linspace(xmin, xmax, n), np.linspace(ymin, ymax, n))
    Z = fn(X, Y)
    gen = contourpy.contour_generator(X, Y, Z)
    tol = 0.02 * max(1.0, float(np.max(np.abs([c for c in niveaux]))))
    out = {}
    for c in niveaux:
        L = [l for l in gen.lines(c) if len(l) >= 3]
        for l in L:
            assert np.allclose(fn(l[:, 0], l[:, 1]), c, atol=tol), c
        out[c] = L
    return out


def _ferme(l):
    return np.allclose(l[0], l[-1])


def _rayon_boite(R, theta):
    """Distance de l'origine au bord du rectangle du repère, dans la direction theta."""
    c, s = math.cos(theta), math.sin(theta)
    ts = []
    for v, lo, hi in ((c, R.xmin, R.xmax), (s, R.ymin, R.ymax)):
        if abs(v) > 1e-12:
            ts.append((hi if v > 0 else lo) / v)
    return min(ts)


# ---------------------------------------------------------------------------------------------- paquet 1

@schema('lex-derivee-partielle-1')
def lex_derivee_partielle_1():
    t = sp.symbols('t', real=True)
    g1, g2 = t**2 + 3, 1 + 3 * t**2                      # f(t, 1) et f(1, t) pour f = x² + 3y²
    assert g1.subs(t, 1) == 4 and g2.subs(t, 1) == 4
    assert sp.diff(g1, t).subs(t, 1) == 2 and sp.diff(g2, t).subs(t, 1) == 6
    S = Schema(W0, 270, 'Les deux fonctions partielles de x² + 3y² en (1, 1) et leurs tangentes')
    R = Repere(-0.25, 1.95, -0.6, 10.2, 30, 16, 360, 236)
    _axes(S, R, 't', '')
    f1 = sp.lambdify(t, g1); f2 = sp.lambdify(t, g2)
    _courbe(S, R, f1, -0.25, 1.95, 'r', l=2.2)
    _courbe(S, R, f2, -0.25, 1.95, 'b', l=2.2)
    _courbe(S, R, lambda q: 4 + 2 * (q - 1), 0.15, 1.85, 'r', d=True, l=1.4)
    _courbe(S, R, lambda q: 4 + 6 * (q - 1), 0.4, 1.95, 'b', d=True, l=1.4)
    S.ligne(R(1, 0), R(1, 4), 'g', d=True)
    S.ligne(R(0, 4), R(1, 4), 'g', d=True)
    _graduation_x(S, R, 1, '1', dy=17)
    _graduation_y(S, R, 4, '4', dx=-8)
    S.point(R(1, 4), 't', r=4)
    _etiq(S, R(1.93, f1(1.93)) + [0, -16], 'f(t, 1)', 'r', 'end')
    _etiq(S, R(1.62, f2(1.62)) + [-8, -2], 'f(1, t)', 'b', 'end')
    _etiq(S, R(0.3, 4 + 2 * (0.3 - 1)) + [4, 17], '`pente` 2', 'r', 'start', taille=17)
    _etiq(S, R(0.4, 4 + 6 * (0.4 - 1)) + [-6, 4], '`pente` 6', 'b', 'end', taille=17)
    return S


@schema('lex-derivee-partielle-3')
def lex_derivee_partielle_3():
    r0, th0 = 1.5, PI / 6
    P = np.array([r0 * math.cos(th0), r0 * math.sin(th0)])
    d1 = np.array([math.cos(th0), math.sin(th0)])
    d2 = np.array([-r0 * math.sin(th0), r0 * math.cos(th0)])
    assert abs(np.linalg.norm(d1) - 1) < 1e-12 and abs(np.linalg.norm(d2) - r0) < 1e-12 and abs(d1 @ d2) < 1e-12
    S = Schema(W0, 268, 'Coordonnées polaires : les deux dérivées partielles de P en (3/2, π/6)')
    ech = 84
    R = Repere(-2.35, 2.4, -0.42, 2.55, (W0 - ech * 4.75) / 2, 10, ech * 4.75, ech * 2.97)
    for rr in (0.5, 1.0, 1.5, 2.0):
        a = math.asin(min(1, 0.4 / rr))
        th = np.linspace(-a, PI + a, 200)
        S.poly(R(rr * np.cos(th), rr * np.sin(th)), 'g', l=1.6 if rr == r0 else 0.9)
    for k in range(7):
        th = k * PI / 6
        rb = min(2.25, _rayon_boite(R, th) - 0.05)
        S.ligne(R(0, 0), R(rb * math.cos(th), rb * math.sin(th)), 'g', d=True)
    _axes(S, R, '', '')
    S.fleche(R(*P), R(*(P + d1)), 'r', l=2.4)
    S.fleche(R(*P), R(*(P + d2)), 'b', l=2.4)
    S.point(R(*P), 't', r=4)
    _etiq(S, R(*(P + d1)) + [-4, 22], '∂_1P', 'r')
    _etiq(S, R(*(P + d2)) + [-8, 2], '∂_2P', 'b', 'end')
    _etiq(S, R(*P) + [12, 12], 'P', 't', 'start')
    return S


@schema('lex-classe-ck-1')
def lex_classe_ck_1():
    f = lambda q: np.where(q == 0, 0.0, q**2 * np.sin(1 / np.where(q == 0, 1, q)))
    fp = lambda q: 2 * q * math.sin(1 / q) - math.cos(1 / q)
    for k in range(1, 40):
        assert abs(fp(1 / (2 * k * PI)) + 1) < 1e-9 and abs(fp(1 / ((2 * k + 1) * PI)) - 1) < 1e-9
    xs = np.linspace(-0.3, 0.3, 20001)
    assert np.all(np.abs(f(xs)) <= xs**2 + 1e-15)
    S = Schema(W0, 250, 'Le graphe de x² sin(1/x) entre les paraboles ±x²')
    R = Repere(-0.32, 0.32, -0.1, 0.1, 22, 14, 376, 222)
    _axes(S, R, 'x', 'y')
    _courbe(S, R, lambda q: q**2, -0.32, 0.32, 'g', d=True, l=1.2)
    _courbe(S, R, lambda q: -q**2, -0.32, 0.32, 'g', d=True, l=1.2)
    S.poly(R(xs, f(xs)), 'r', l=1.6)
    _etiq(S, R(0.27, 0.088) + [-8, 0], 'y = x^2', 'g', 'end', taille=17)
    _etiq(S, R(-0.27, -0.088) + [8, 0], 'y = −x^2', 'g', 'start', taille=17)
    return S


@schema('lex-diffeomorphisme-3')
def lex_diffeomorphisme_3():
    E = lambda x, y: (np.exp(x) * np.cos(y), np.exp(x) * np.sin(y))
    Einv = lambda u, v: (0.5 * np.log(u**2 + v**2), np.arctan(v / u))
    xg = np.linspace(-1.3, 0.8, 9); yg = np.linspace(-1.5, 1.5, 9)
    X, Y = np.meshgrid(xg, yg)
    U, V = E(X, Y)
    assert np.all(U > 0)
    A, B = Einv(U, V)
    assert np.allclose(A, X) and np.allclose(B, Y)
    verts = [-1.0, -0.5, 0.0, 0.5]
    horiz = [-1.2, -0.6, 0.0, 0.6, 1.2]
    x0, x1 = -1.3, 0.8
    # les verticales sont envoyées sur des demi-cercles de rayon e^x, les horizontales sur des rayons d'angle y
    for c in verts:
        uu, vv = E(c, np.linspace(-1.5, 1.5, 7))
        assert np.allclose(np.hypot(uu, vv), math.exp(c))
    S = Schema(W0, 290, 'La bande ℝ × ]−π/2, π/2[ et son image par E, le demi-plan u > 0')
    hp = PI / 2
    eg = 62
    RL = Repere(-1.45, 0.95, -1.85, 1.85, 18, 26, eg * 2.4, eg * 3.7)
    eh = 0.84 * eg * 3.7 / 5.0
    RR = Repere(-0.3, 2.55, -2.5, 2.5, W0 - 14 - eh * 2.85, 26 + (eg * 3.7 - eh * 5.0) / 2, eh * 2.85, eh * 5.0)
    assert RL.x0 + RL.L + 40 < RR.x0
    # bande : bords en pointillé
    for s in (-1, 1):
        S.ligne(RL(-1.45, s * hp), RL(0.95, s * hp), 'g', d=True)
    _axes(S, RL, 'x', 'y')
    _axes(S, RR, 'u', 'v')
    for c in verts:
        S.ligne(RL(c, -hp), RL(c, hp), 'b', l=1.5)
        th = np.linspace(-hp, hp, 120)
        S.poly(RR(math.exp(c) * np.cos(th), math.exp(c) * np.sin(th)), 'b', l=1.5)
    for c in horiz:
        S.ligne(RL(x0, c), RL(x1, c), 'r', l=1.5)
        S.ligne(RR(math.exp(x0) * math.cos(c), math.exp(x0) * math.sin(c)),
                RR(math.exp(x1) * math.cos(c), math.exp(x1) * math.sin(c)), 'r', l=1.5)
    S.point(RR(0, 0), 't', r=4, creux=True)
    _etiq(S, RL(0.95, hp) + [-2, -12], 'π/2', 'g', 'end', taille=17)
    _etiq(S, RL(0.95, -hp) + [-2, 13], '−π/2', 'g', 'end', taille=17)
    m = (RL.x0 + RL.L + RR.x0) / 2
    S.fleche((m - 16, 150), (m + 16, 150), 't')
    _etiq(S, (m, 132), 'E', 't')
    return S


@schema('lex-point-critique-2')
def lex_point_critique_2():
    x, y = sp.symbols('x y', real=True)
    f = x**3 - 3 * x * y**2
    crit = sp.solve([sp.diff(f, x), sp.diff(f, y)], [x, y], dict=True)
    assert all(s[x] == 0 and s[y] == 0 for s in crit)
    assert sp.expand(x * (x - sp.sqrt(3) * y) * (x + sp.sqrt(3) * y) - f) == 0
    fn = sp.lambdify((x, y), f, 'numpy')
    # signe sur les secteurs : f(r cos θ, r sin θ) = r³ cos 3θ, positif pour |θ| < π/6
    for k in range(6):
        th = k * PI / 3
        assert (fn(math.cos(th), math.sin(th)) > 0) == (k % 2 == 0)
    S = Schema(W0, 290, 'Les six secteurs où x³ − 3xy² change de signe autour de son point critique')
    ech = 118
    R = Repere(-1.15, 1.15, -1.15, 1.15, (W0 - ech * 2.3) / 2, 12, ech * 2.3, ech * 2.3)
    for k in range(6):
        a0, a1 = -PI / 6 + k * PI / 3, PI / 6 + k * PI / 3
        th = np.linspace(a0, a1, 80)
        rb = np.array([_rayon_boite(R, q) for q in th])
        pts = [R(0, 0)] + [R(r * math.cos(q), r * math.sin(q)) for r, q in zip(rb, th)]
        S.surface(pts, 'r' if k % 2 == 0 else 'b')
    for th in (PI / 6, PI / 2, 5 * PI / 6):
        a = _rayon_boite(R, th)
        S.ligne(R(-a * math.cos(th), -a * math.sin(th)), R(a * math.cos(th), a * math.sin(th)), 'g', l=1.2)
    L = _niveaux(fn, (-1.15, 1.15, -1.15, 1.15), [0.5, -0.5])
    for c, cl in ((0.5, 'r'), (-0.5, 'b')):
        assert len(L[c]) == 3
        for l in L[c]:
            S.poly(R(l[:, 0], l[:, 1]), cl, l=1.6)
    S.point(R(0, 0), 't', r=4)
    _etiq(S, R(0.95, 0) + [0, -2], '+', 'r')
    _etiq(S, R(-0.95, 0) + [0, -2], '−', 'b')
    return S


@schema('lex-point-critique-3')
def lex_point_critique_3():
    x, y = sp.symbols('x y', real=True)
    f = x**4 + y**4 - 4 * x * y
    crit = sp.solve([sp.diff(f, x), sp.diff(f, y)], [x, y], dict=True)
    reels = {(s[x], s[y]) for s in crit if s[x].is_real and s[y].is_real}
    assert reels == {(0, 0), (1, 1), (-1, -1)}
    assert f.subs({x: 1, y: 1}) == -2 and f.subs({x: -1, y: -1}) == -2
    assert sp.expand(x**4 + y**4 - 2 * x**2 * y**2 - (x**2 - y**2)**2) == 0
    fn = sp.lambdify((x, y), f, 'numpy')
    boite = (-1.9, 1.9, -1.9, 1.9)
    niv = [-1.5, -1.0, -0.5, 0.0, 1.0, 3.0]
    L = _niveaux(fn, boite, niv, n=801)
    for c in (-1.5, -1.0, -0.5):
        centres = sorted(tuple(np.round(l.mean(0))) for l in L[c])
        assert len(L[c]) == 2 and all(_ferme(l) for l in L[c]) and centres == [(-1.0, -1.0), (1.0, 1.0)], c
    S = Schema(W0, 290, 'Lignes de niveau de x⁴ + y⁴ − 4xy : deux minima et un point critique à l’origine')
    ech = 70
    R = Repere(*boite, (W0 - ech * 3.8) / 2, 12, ech * 3.8, ech * 3.8)
    _axes(S, R, 'x', 'y')
    for c in niv:
        cl = 'b' if c < 0 else ('t' if c == 0 else 'r')
        for l in L[c]:
            S.poly(R(l[:, 0], l[:, 1]), cl, l=2.0 if c == 0 else 1.3)
    for p in ((0, 0), (1, 1), (-1, -1)):
        S.point(R(*p), 't', r=4)
    return S


# ---------------------------------------------------------------------------------------------- paquet 2

@schema('lex-extremum-local-rn-1')
def lex_extremum_local_rn_1():
    x, y = sp.symbols('x y', real=True)
    f = x**2 + y**2 * (1 - x)**3
    crit = sp.solve([sp.diff(f, x), sp.diff(f, y)], [x, y], dict=True)
    assert {(s[x], s[y]) for s in crit if s[x].is_real and s[y].is_real} == {(0, 0)}
    fn = sp.lambdify((x, y), f, 'numpy')
    boite = (-1.6, 4.4, -3.1, 3.1)
    L = _niveaux(fn, boite, [0.25, 0.5], n=901)
    for c in (0.25, 0.5):
        fermees = [l for l in L[c] if _ferme(l)]
        assert len(fermees) == 1 and np.linalg.norm(fermees[0].mean(0)) < 0.6, c      # autour de l'origine
        autres = [l for l in L[c] if not _ferme(l)]
        assert len(autres) == 2 and all((l[:, 0] > 1).all() for l in autres), c        # dans x > 1
    # région f < 0 : x > 1 et |y| > x/(x − 1)^{3/2}
    gx = np.linspace(-1.6, 4.4, 241); gy = np.linspace(-3.1, 3.1, 241)
    X, Y = np.meshgrid(gx, gy)
    neg = fn(X, Y) < 0
    assert np.all(X[neg] > 1) and neg[(gy > 0)[:, None] & np.ones_like(neg)].any() and neg[(gy < 0)[:, None] & np.ones_like(neg)].any()
    S = Schema(W0, 290, 'Lignes de niveau de x² + y²(1 − x)³ et région où la fonction est négative')
    ech = 44
    R = Repere(*boite, (W0 - ech * 6.0) / 2, 8, ech * 6.0, ech * 6.2)
    xs = np.linspace(1.0 + 1e-6, 4.4, 400)
    bord = xs / (xs - 1) ** 1.5
    g = bord < 3.1
    for sg in (1, -1):
        haut = np.full(g.sum(), 3.1 * sg)
        S.surface(np.vstack([R(xs[g], sg * bord[g]), R(xs[g][::-1], haut[::-1])]), 'b')
        S.poly(R(xs[g], sg * bord[g]), 'b', l=1.4)
    _axes(S, R, 'x', 'y')
    S.ligne(R(1, -3.1), R(1, 3.1), 'g', d=True)
    S.ligne(R(1, 0) + [0, -3], R(1, 0) + [0, 3], 'g')
    S.texte(R(1, 0) + [9, 15], '1', 'g', taille=17)
    for c in (0.25, 0.5):
        for l in L[c]:
            S.poly(R(l[:, 0], l[:, 1]), 'r', d=not _ferme(l), l=1.6)
    S.point(R(0, 0), 't', r=4)
    _etiq(S, R(3.0, 2.6), 'f < 0', 'b', taille=17)
    _etiq(S, R(3.0, -2.6), 'f < 0', 'b', taille=17)
    return S


# ---------------------------------------------------------------------------------------------- paquet 3

def _ellipse(S, R, a, b, c='t', d=False, l=None, n=240):
    th = np.linspace(0, 2 * PI, n)
    S.poly(R(a * np.cos(th), b * np.sin(th)), c, d, l=l)


def _segment_dans(R, p, u):
    """Plus grand segment de la droite p + t u contenu dans le rectangle du repère."""
    ts = []
    for k, (lo, hi) in enumerate(((R.xmin, R.xmax), (R.ymin, R.ymax))):
        if abs(u[k]) > 1e-12:
            ts += [(lo - p[k]) / u[k], (hi - p[k]) / u[k]]
    ts = sorted(ts)
    t0, t1 = ts[1], ts[2]
    return np.array(p) + t0 * np.array(u), np.array(p) + t1 * np.array(u)


@schema('lex-gradient-1')
def lex_gradient_1():
    a = np.array([1.0, 0.5])
    gr = np.array([2 * a[0], 8 * a[1]])
    tg = np.array([-2.0, 1.0])
    assert np.allclose(gr, [2, 4]) and abs(gr @ tg) < 1e-12 and abs(a[0]**2 + 4 * a[1]**2 - 2) < 1e-12
    # le gradient pointe vers les niveaux croissants
    assert (a + 0.01 * gr)[0]**2 + 4 * (a + 0.01 * gr)[1]**2 > 2
    S = Schema(W0, 262, 'Lignes de niveau de x² + 4y² et gradient en (1, 1/2)')
    ech = 84
    R = Repere(-2.3, 2.4, -1.2, 1.75, (W0 - ech * 4.7) / 2, 8, ech * 4.7, ech * 2.95)
    _axes(S, R, 'x', 'y')
    for c in (1, 2, 4):
        _ellipse(S, R, math.sqrt(c), math.sqrt(c) / 2, 'r' if c == 2 else 'g', l=1.8 if c == 2 else 1.1)
    p, q = a - 0.75 * tg, a + 0.55 * tg
    S.ligne(R(*p), R(*q), 'g', d=True, l=1.3)
    S.fleche(R(*a), R(*(a + gr / 4)), 'b', l=2.4)
    S.point(R(*a), 't', r=4)
    _etiq(S, R(*(a + gr / 4)) + [10, 4], '∇f(a)', 'b', 'start')
    _etiq(S, R(*a) + [-10, 14], 'a', 't', 'end')
    return S


@schema('lex-lagrangien-1')
def lex_lagrangien_1():
    rho = math.sqrt(2)
    # x + y = c rencontre le cercle ssi |c| <= 2 (distance |c|/√2 au centre), tangente ssi |c| = 2
    for c in (-3, -2, -1, 0, 1, 2, 3):
        dist = abs(c) / math.sqrt(2)
        assert (dist < rho - 1e-12) == (abs(c) < 2) and (abs(dist - rho) < 1e-12) == (abs(c) == 2)
    S = Schema(W0, 286, 'Lignes de niveau de x + y et cercle x² + y² = 2')
    ech = 59
    R = Repere(-2.35, 2.35, -2.35, 2.35, (W0 - ech * 4.7) / 2, 4, ech * 4.7, ech * 4.7)
    _axes(S, R, 'x', '')
    _etiq(S, R(0, R.ymax) + [9, 7], 'y', 'g', 'start', taille=17)
    _ellipse(S, R, rho, rho, 'b', l=2.0)
    for c in (-3, -1, 0, 1, 3):
        p, q = _segment_dans(R, (c / 2, c / 2), (1, -1))
        S.ligne(R(*p), R(*q), 'g', d=True, l=1.1)
    for c in (-2, 2):
        p, q = _segment_dans(R, (c / 2, c / 2), (1, -1))
        S.ligne(R(*p), R(*q), 'r', l=1.8)
    for p in ((1, 1), (-1, -1)):
        S.point(R(*p), 't', r=4)
    _etiq(S, R(1, 1) + [10, -12], '(1, 1)', 't', 'start', taille=17)
    _etiq(S, R(-1, -1) + [-10, 14], '(−1, −1)', 't', 'end', taille=17)
    return S


@schema('lex-forme-definie-sous-espace-1')
def lex_forme_definie_sous_espace_1():
    q = lambda P: P[0]**2 - P[1]**2
    assert q((1, 0)) > 0 and q((2, 1)) > 0 and q((1, 1)) == 0 and q((1, -1)) == 0
    S = Schema(W0, 262, 'Les droites sur lesquelles x₁² − x₂² est définie positive ou négative')
    ech = 84
    X0, X1, Y0, Y1 = -2.35, 2.35, -1.45, 1.45
    R = Repere(X0, X1, Y0, Y1, (W0 - ech * 4.7) / 2, 8, ech * 4.7, ech * 2.9)
    assert Y1 < X1 and Y0 == -Y1
    for sg in (1, -1):
        # |x₂| < |x₁| : secteurs de droite et de gauche, bornés par les diagonales puis par le cadre
        S.surface([R(0, 0), R(sg * Y1, Y1), R(sg * X1, Y1), R(sg * X1, Y0), R(sg * Y1, Y0)], 'r')
        # |x₂| > |x₁| : secteurs du haut et du bas
        S.surface([R(0, 0), R(Y1, sg * Y1), R(-Y1, sg * Y1)], 'b')
    pts = np.random.default_rng(1).uniform([X0, Y0], [X1, Y1], size=(2000, 2))
    assert all((abs(p[1]) < abs(p[0])) == (q(p) > 0) for p in pts)
    for sg in (1, -1):
        S.ligne(R(-Y1, -sg * Y1), R(Y1, sg * Y1), 'g', d=True, l=1.3)
    _axes(S, R, 'x_1', 'x_2')
    S.ligne(R(X0, 0), R(X1, 0), 't', l=1.6)
    p, q2 = _segment_dans(R, (0, 0), (2, 1))
    S.ligne(R(*p), R(*q2), 't', l=1.6)
    S.point(R(1, 0), 't', r=4)
    S.point(R(2, 1), 't', r=4)
    _etiq(S, R(1, 0) + [0, 16], '(1, 0)', 't', taille=17)
    _etiq(S, R(2, 1) + [0, 18], '(2, 1)', 't', taille=17)
    return S


@schema('lex-vecteur-tangent-niveau-2')
def lex_vecteur_tangent_niveau_2():
    c = lambda t: np.array([t**2, t**3])
    cp = lambda t: np.array([2 * t, 3 * t**2])
    ts = (-1.0, -0.5, 0.5, 1.0)
    assert all(abs(c(t)[0]**3 - c(t)[1]**2) < 1e-12 for t in np.linspace(-1.3, 1.3, 27))
    long = [np.linalg.norm(cp(t)) for t in ts]
    assert long[1] < long[0] and long[2] < long[3] and np.allclose(cp(0), 0)
    S = Schema(W0, 290, 'La courbe à pointe x³ = y² et les vitesses de t ↦ (t², t³)')
    ech = 70
    R = Repere(-0.6, 2.15, -2.0, 2.0, (W0 - ech * 2.75) / 2, 6, ech * 2.75, ech * 4.0)
    _axes(S, R, 'x', 'y')
    tt = np.linspace(-1.26, 1.26, 400)
    S.poly(R(tt**2, tt**3), 'r', l=1.2)
    for t in ts:
        S.fleche(R(*c(t)), R(*(c(t) + cp(t) / 4)), 'b', l=3.4)
        S.point(R(*c(t)), 'b', r=3.2)
    S.point(R(0, 0), 't', r=4)
    return S


@schema('lex-espace-tangent-niveau-1')
def lex_espace_tangent_niveau_1():
    a = np.array([math.sqrt(2), math.sqrt(2) / 2])
    gr = np.array([a[0] / 2, 2 * a[1]])
    vit = np.array([-math.sqrt(2), math.sqrt(2) / 2])
    d = np.array([-2.0, 1.0])
    assert abs(a[0]**2 / 4 + a[1]**2 - 1) < 1e-12 and abs(gr @ d) < 1e-12
    assert abs(vit[0] * d[1] - vit[1] * d[0]) < 1e-12           # vitesse portée par la tangente
    S = Schema(W0, 284, 'L’ellipse x²/4 + y² = 1, sa tangente en a, le vecteur des dérivées partielles et une vitesse')
    ech = 76
    R = Repere(-2.4, 2.6, -1.3, 2.35, (W0 - ech * 5.0) / 2, 6, ech * 5.0, ech * 3.65)
    _axes(S, R, 'x', 'y')
    _ellipse(S, R, 2, 1, 'r', l=2.0)
    p, q = a - 0.42 * d, a + 0.95 * d
    assert R.xmin < q[0] < p[0] < 2.35 and R.ymin < p[1] < q[1] < R.ymax
    S.ligne(R(*p), R(*q), 'g', d=True, l=1.3)
    S.fleche(R(*a), R(*(a + gr)), 'b', l=2.4)
    S.fleche(R(*a), R(*(a + vit)), 'v', l=2.4)
    S.point(R(*a), 't', r=4)
    _etiq(S, R(*a) + [-12, 14], 'a', 't', 'end')
    _etiq(S, R(*(a + vit)) + [-8, 18], 'γ′(0)', 'v', 'end')
    return S


# ---------------------------------------------------------------------------------------------- paquet 4

@schema('lex-vecteur-isotrope-1')
def lex_vecteur_isotrope_1():
    q = lambda X, Y: 2 * X**2 + X * Y - Y**2
    assert all(abs(q(t, 2 * t)) < 1e-12 and abs(q(t, -t)) < 1e-12 for t in np.linspace(-2, 2, 9))
    S = Schema(W0, 262, 'Le cône isotrope de 2x² + xy − y² : les droites y = 2x et y = −x')
    ech = 84
    X0, X1, Y0, Y1 = -2.35, 2.35, -1.45, 1.45
    R = Repere(X0, X1, Y0, Y1, (W0 - ech * 4.7) / 2, 8, ech * 4.7, ech * 2.9)
    # régions : signe de q, rempli par cellules de la grille regroupées en polygones de secteurs
    angles = sorted([math.atan2(2, 1), math.atan2(-2, -1), math.atan2(-1, 1), math.atan2(1, -1)])
    bornes = angles + [angles[0] + 2 * PI]
    for a0, a1 in zip(bornes[:-1], bornes[1:]):
        m = (a0 + a1) / 2
        cl = 'r' if q(math.cos(m), math.sin(m)) > 0 else 'b'
        th = np.linspace(a0, a1, 90)
        rb = np.array([_rayon_boite(R, w) for w in th])
        S.surface([R(0, 0)] + [R(r * math.cos(w), r * math.sin(w)) for r, w in zip(rb, th)], cl)
    _axes(S, R, 'x', 'y')
    for d in ((1, 2), (1, -1)):
        p, q2 = _segment_dans(R, (0, 0), d)
        S.ligne(R(*p), R(*q2), 'r', l=2.0)
    _etiq(S, R(0.62, 1.24) + [10, 0], 'y = 2x', 'r', 'start', taille=17)
    _etiq(S, R(-1.3, 1.3) + [-8, -2], 'y = −x', 'r', 'end', taille=17)
    _etiq(S, R(1.7, 0.7), 'q > 0', 'r', taille=17)
    _etiq(S, R(0.62, -1.15), 'q < 0', 'b', taille=17)
    assert q(1.7, 0.7) > 0 and q(0.62, -1.15) < 0
    return S


@schema('lex-point-col-1')
def lex_point_col_1():
    x, y = sp.symbols('x y', real=True)
    f = x**2 + 3 * x * y + y**2
    assert sp.hessian(f, (x, y)).det() == -5
    fn = sp.lambdify((x, y), f, 'numpy')
    boite = (-2.3, 2.3, -1.6, 1.6)
    niv = [0.5, 2.0, -0.5, -2.0]
    L = _niveaux(fn, boite, niv, n=701)
    S = Schema(W0, 280, 'Lignes de niveau de x² + 3xy + y² autour du col (0, 0)')
    ech = 83
    R = Repere(*boite, (W0 - ech * 4.6) / 2, 6, ech * 4.6, ech * 3.2)
    _axes(S, R, 'x', 'y')
    for c in niv:
        for l in L[c]:
            S.poly(R(l[:, 0], l[:, 1]), 'r' if c > 0 else 'b', l=1.5)
    racines = [(-3 + math.sqrt(5)) / 2, (-3 - math.sqrt(5)) / 2]      # f(m, 1) = 0
    for m in racines:
        assert abs(fn(m, 1.0)) < 1e-12
        p, q2 = _segment_dans(R, (0, 0), (m, 1))
        S.ligne(R(*p), R(*q2), 'g', d=True, l=1.2)
    p, q2 = _segment_dans(R, (0, 0), (1, -1))
    S.ligne(R(*p), R(*q2), 'v', l=1.6)
    ts = np.linspace(-1.5, 1.5, 61)
    assert all(fn(t, 0) > 0 and fn(0, t) > 0 and fn(t, -t) < 0 for t in ts if abs(t) > 1e-9)
    S.point(R(0, 0), 't', r=4)
    return S


@schema('lex-point-col-3')
def lex_point_col_3():
    x, y = sp.symbols('x y', real=True)
    f = (x**2 - 1)**2 + y**2
    crit = sp.solve([sp.diff(f, x), sp.diff(f, y)], [x, y], dict=True)
    assert {(s[x], s[y]) for s in crit} == {(0, 0), (1, 0), (-1, 0)}
    fn = sp.lambdify((x, y), f, 'numpy')
    boite = (-1.85, 1.85, -1.9, 1.9)
    niv = [0.25, 0.5, 1.0, 2.0, 3.0]
    L = _niveaux(fn, boite, niv, n=801)
    for c in (0.25, 0.5):
        cs = sorted(round(float(l.mean(0)[0])) for l in L[c])
        assert len(L[c]) == 2 and all(_ferme(l) for l in L[c]) and cs == [-1, 1], c
    for c in (2.0, 3.0):
        assert len(L[c]) == 1 and _ferme(L[c][0]) and abs(L[c][0].mean(0)).max() < 0.1, c
    assert any(np.min(np.linalg.norm(l, axis=1)) < 0.02 for l in L[1.0])       # le niveau 1 passe par 0
    S = Schema(W0, 290, 'Lignes de niveau de (x² − 1)² + y² : deux minima et un col')
    ech = 73
    R = Repere(*boite, (W0 - ech * 3.7) / 2, 6, ech * 3.7, ech * 3.8)
    _axes(S, R, 'x', 'y')
    for c in niv:
        cl = 'b' if c < 1 else ('t' if c == 1 else 'r')
        for l in L[c]:
            S.poly(R(l[:, 0], l[:, 1]), cl, l=2.0 if c == 1 else 1.3)
    for p in ((-1, 0), (1, 0), (0, 0)):
        S.point(R(*p), 't', r=4)
    return S


@schema('lex-extremum-lie-2')
def lex_extremum_lie_2():
    phi = lambda t: t**3 - 3 * t
    assert abs(phi(-1) - 2) < 1e-12 and abs(phi(2) - 2) < 1e-12 and abs(phi(1) + 2) < 1e-12 and abs(phi(-2) + 2) < 1e-12
    xs = np.linspace(-2.3, 2.3, 901)
    assert all(phi(t) <= 2 + 1e-12 for t in xs if t < 2) and all(phi(t) >= -2 - 1e-12 for t in xs if t > -2)
    S = Schema(W0, 290, 'La courbe y = x³ − 3x, maximum lié en (−1, 2) et minimum lié en (1, −2)')
    R = Repere(-2.35, 2.35, -3.4, 3.4, 26, 6, W0 - 52, 278)
    _axes(S, R, 'x', 'y')
    for c in (2, -2):
        S.ligne(R(-2.35, c), R(2.35, c), 'g', d=True, l=1.2)
    _courbe(S, R, phi, -2.35, 2.35, 'r', l=2.2)
    for p in ((-1, 2), (1, -2)):
        S.point(R(*p), 't', r=4.2)
    for p in ((2, 2), (-2, -2)):
        S.point(R(*p), 'g', r=3.6, creux=True)
    _etiq(S, R(-1, 2) + [0, -16], '(−1, 2)', 't', taille=17)
    _etiq(S, R(1, -2) + [0, 18], '(1, −2)', 't', taille=17)
    return S


@schema('lex-ensemble-niveau-2')
def lex_ensemble_niveau_2():
    x, y = sp.symbols('x y', real=True)
    g = y**2 - x**3 + x
    crit = sp.solve([sp.diff(g, x), sp.diff(g, y)], [x, y], dict=True)
    pts = [(float(s[x]), float(s[y])) for s in crit]
    assert len(pts) == 2 and all(abs(float(g.subs({x: s[x], y: s[y]}))) > 0.3 for s in crit)
    fn = sp.lambdify((x, y), g, 'numpy')
    boite = (-1.6, 2.6, -2.6, 2.6)
    L = _niveaux(fn, boite, [0.0], n=1001)[0.0]
    fermees = [l for l in L if _ferme(l)]
    ouvertes = [l for l in L if not _ferme(l)]
    assert len(fermees) == 1 and (fermees[0][:, 0] >= -1 - 1e-3).all() and (fermees[0][:, 0] <= 1e-3).all()
    assert len(ouvertes) == 1 and (ouvertes[0][:, 0] >= 1 - 1e-3).all()
    S = Schema(W0, 290, 'Le niveau 0 de y² − x³ + x : une courbe fermée et une branche infinie')
    ech = 55
    R = Repere(*boite, (W0 - ech * 4.2) / 2, 6, ech * 4.2, ech * 5.2)
    _axes(S, R, 'x', 'y')
    S.ligne(R(-1, 0), R(0, 0), 'b', l=4)
    S.ligne(R(1, 0), R(2.45, 0), 'b', l=4)
    for l in L:
        S.poly(R(l[:, 0], l[:, 1]), 'r', l=2.0)
    for p in pts:
        S.point(R(*p), 't', r=3.6, creux=True)
    _etiq(S, R(-1, 0) + [-4, 16], '−1', 'g', 'end', taille=17)
    _etiq(S, R(1, 0) + [10, 16], '1', 'g', 'start', taille=17)
    return S


@schema('lex-orthogonalite-forme-bilineaire-1')
def lex_orthogonalite_forme_bilineaire_1():
    v = np.array([1.0, 1.0]) / math.sqrt(3)
    w = np.array([2.0, -1.0]) / math.sqrt(6)
    b = lambda p, q: p[0] * q[0] + 2 * p[1] * q[1]
    assert abs(b(v, v) - 1) < 1e-12 and abs(b(w, w) - 1) < 1e-12 and abs(b(v, w)) < 1e-12 and abs(v @ w) > 0.2
    S = Schema(W0, 250, 'L’ellipse x₁² + 2x₂² = 1 et deux vecteurs orthogonaux pour b')
    ech = 150
    R = Repere(-1.25, 1.35, -0.8, 0.8, (W0 - ech * 2.6) / 2, 5, ech * 2.6, ech * 1.6)
    _axes(S, R, 'x_1', 'x_2')
    _ellipse(S, R, 1, 1 / math.sqrt(2), 'r', l=2.0)
    p, q = v - 0.25 * w, v + 0.62 * w
    S.ligne(R(*p), R(*q), 'g', d=True, l=1.3)
    S.fleche(R(0, 0), R(*v), 'b', l=2.4)
    S.fleche(R(0, 0), R(*w), 'v', l=2.4)
    S.point(R(*v), 'b', r=3.4)
    _etiq(S, R(*v) + [-12, 2], 'v/\\√3', 'b', 'end')
    return S
