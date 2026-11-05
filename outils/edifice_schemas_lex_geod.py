"""Schémas des exemples du lexique, théorie geod : contenu/exemples/geod.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées, et ce que dit la légende vérifié par assert.
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

W0 = 420
TL = 17
PI = math.pi


def _dans_cadre(S, p, s, taille=TL, ancre='middle', marge=2):
    """Vérifie qu'une étiquette tient dans le cadre (largeur calculée sur les polices KaTeX)."""
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


def _etiq(S, p, s, c='t', ancre='middle', taille=TL):
    _dans_cadre(S, p, s, taille, ancre)
    S.texte(p, s, c, ancre=ancre, taille=taille)


def _axes(S, R, nx='x', ny='y', c='g'):
    """Axes passant par l'origine, flèches et noms à l'intérieur du repère."""
    S.fleche(R(R.xmin, 0), R(R.xmax, 0), c)
    if nx:
        _etiq(S, R(R.xmax, 0) + [-4, -13], nx, c, ancre='end', taille=16)
    S.fleche(R(0, R.ymin), R(0, R.ymax), c)
    if ny:
        _etiq(S, R(0, R.ymax) + [-9, 7], ny, c, ancre='end', taille=16)


def _grad_x(S, R, v, lab, c='g', dy=16, taille=14):
    S.ligne(R(v, 0) + [0, -3], R(v, 0) + [0, 3], c)
    if lab:
        _etiq(S, R(v, 0) + [0, dy], lab, c, taille=taille)


def _grad_y(S, R, v, lab, c='g', dx=-8, taille=14):
    S.ligne(R(0, v) + [-3, 0], R(0, v) + [3, 0], c)
    if lab:
        _etiq(S, R(0, v) + [dx, 0], lab, c, ancre='end' if dx < 0 else 'start', taille=taille)


def theta(x):
    return math.exp(-1 / x) if x > 0 else 0.0


def _dans(S, pts):
    pts = np.asarray(pts, float).reshape(-1, 2)
    assert (pts[:, 0] >= 0).all() and (pts[:, 0] <= S.w).all() and (pts[:, 1] >= 0).all() and (pts[:, 1] <= S.h).all()


# ---------------------------------------------------------------------------------------------- formes, de Rham

@schema('lex-cohomologie-de-rham-2')
def lex_cohomologie_de_rham_2():
    S = Schema(W0, 260, 'Sur le demi-plan x > 0, la fonction arctan(y/x) est constante sur les demi-droites')
    ech = 80
    R = Repere(-1.6, 3.6, -1.55, 1.55, (W0 - 5.2 * ech) / 2, 6, 5.2 * ech, 3.1 * ech)
    S.surface([R(0, -1.55), R(3.6, -1.55), R(3.6, 1.55), R(0, 1.55)], 'b')
    _axes(S, R)
    angles = [-PI / 3, -PI / 6, 0, PI / 6, PI / 3]
    noms = {-PI / 3: 'θ = −π/3', PI / 6: 'θ = π/6', PI / 3: 'θ = π/3'}
    for a in angles:
        L = min(2.2 / max(math.cos(a), 1e-9), 1.3 / max(abs(math.sin(a)), 1e-9))
        bout = (L * math.cos(a), L * math.sin(a))
        # sur la demi-droite, arctan(y/x) vaut l'angle a
        for t in np.linspace(0.05, L, 9):
            x, y = t * math.cos(a), t * math.sin(a)
            assert abs(math.atan(y / x) - a) < 1e-12
        S.ligne(R(0.07 * math.cos(a), 0.07 * math.sin(a)), R(*bout), 'b', l=1.8)
        if a in noms:
            _etiq(S, R(*bout) + [8, 0], noms[a], 'b', ancre='start', taille=15)
    S.point(R(0, 0), 'r', r=4, creux=True)
    _etiq(S, R(0, 0) + [-10, 14], '0', 'r', ancre='end', taille=15)
    _etiq(S, R(-0.85, 0.95), 'ℝ^2 ∖ {0}', 't', taille=16)
    _etiq(S, R(2.9, -0.55), 'x > 0', 'b', taille=16)
    return S


# ---------------------------------------------------------------------------------------------- variétés

@schema('lex-variete-differentiable-3')
def lex_variete_differentiable_3():
    S = Schema(W0, 124, 'La droite à deux origines')
    R = Repere(-3, 3, -1, 1, 20, 10, W0 - 40, 140)
    trou = 0.14
    S.ligne(R(-3, 0), R(-trou, 0), 't', l=1.6)
    S.ligne(R(trou, 0), R(3, 0), 't', l=1.6)
    o0 = R(0, 0)
    o1 = R(0, 0.62)
    eb, ev = 1.7, 1.15         # rayons des voisinages bleu (de π(0, 0)) et vert (de π(0, 1))
    dec = 7
    for (a, b) in [(-eb, -trou), (trou, eb)]:
        S.ligne(R(a, 0) + [0, dec], R(b, 0) + [0, dec], 'b', l=3)
    S.ligne(R(-trou, 0) + [0, dec], o0, 'b', l=3)
    S.ligne(R(trou, 0) + [0, dec], o0, 'b', l=3)
    for (a, b) in [(-ev, -trou), (trou, ev)]:
        S.ligne(R(a, 0) + [0, -dec], R(b, 0) + [0, -dec], 'v', l=3)
    # le voisinage vert contient π(0, 1), qui remplace π(0, 0) au-dessus du trou
    S.ligne(R(-trou, 0) + [0, -dec], o1, 'v', l=3)
    S.ligne(R(trou, 0) + [0, -dec], o1, 'v', l=3)
    S.point(o0, 'r', r=4.5)
    S.point(o1, 'r', r=4.5)
    # les deux voisinages ont en commun les points de 0 < |t| < min(eb, ev)
    assert min(eb, ev) > trou
    _etiq(S, o1 + [0, -20], 'π(0, 1)', 'r', taille=16)
    _etiq(S, o0 + [0, 28], 'π(0, 0)', 'r', taille=16)
    _etiq(S, R(2.6, 0) + [0, -20], 'X', 't', taille=17)
    return S


@schema('lex-sous-variete-3')
def lex_sous_variete_3():
    S = Schema(W0, 290, 'Les courbes x² − y² = c, et la croix pour c = 0')
    ech = 52
    R = Repere(-2.7, 2.7, -2.6, 2.6, (W0 - 5.4 * ech) / 2, 10, 5.4 * ech, 5.2 * ech)
    _axes(S, R)
    traits = []                              # points dessinés, pour vérifier que les étiquettes ne les touchent pas
    ts = np.linspace(-math.asinh(2.0), math.asinh(2.0), 300)
    for sgn in (1, -1):
        X, Y = sgn * np.cosh(ts), np.sinh(ts)
        assert np.allclose(X ** 2 - Y ** 2, 1)
        S.poly(R(X, Y), 'b', l=2)
        traits.append(R(X, Y))
        X, Y = np.sinh(ts), sgn * np.cosh(ts)
        assert np.allclose(X ** 2 - Y ** 2, -1)
        S.poly(R(X, Y), 'v', l=2)
        traits.append(R(X, Y))
    tt = np.linspace(-2.45, 2.45, 200)
    for sgn in (1, -1):
        S.ligne(R(-2.45, -2.45 * sgn), R(2.45, 2.45 * sgn), 'r', l=2)
        traits.append(R(tt, sgn * tt))
    traits.append(R(np.linspace(-2.7, 2.7, 200), 0 * tt))
    traits.append(R(0 * tt, np.linspace(-2.6, 2.6, 200)))
    S.point(R(0, 0), 'r', r=4)
    pts = np.vstack(traits)
    for p, txt, c, anc in [(R(2.45, -2.45) + [8, 0], 'c = 0', 'r', 'start'),
                           (R(1.75, 0.45), 'c = 1', 'b', 'middle'),
                           (R(0.12, 1.75), 'c = −1', 'v', 'start')]:
        w = largeur_texte(txt, 15)
        x0 = {'start': p[0], 'middle': p[0] - w / 2}[anc]
        dedans = (pts[:, 0] > x0 - 3) & (pts[:, 0] < x0 + w + 3) & (abs(pts[:, 1] - p[1]) < 15 * 0.5 + 3)
        assert not dedans.any(), (txt, pts[dedans][:3])
        _etiq(S, p, txt, c, ancre=anc, taille=15)
    return S


@schema('lex-carte-1')
def lex_carte_1():
    S = Schema(W0, 220, 'La carte (x, y) ↦ x sur le demi-cercle supérieur')
    ech = 120
    R = Repere(-1.6, 1.6, -0.5, 1.15, (W0 - 3.2 * ech) / 2, 12, 3.2 * ech, 1.65 * ech)
    S.fleche(R(-1.6, 0), R(1.6, 0), 'g')
    tt = np.linspace(0, PI, 200)
    S.poly(R(np.cos(tt), np.sin(tt)), 'r', l=2.4)
    for a0, a1 in [(PI, PI + PI / 7), (2 * PI - PI / 7, 2 * PI)]:
        tb = np.linspace(a0, a1, 40)
        S.poly(R(np.cos(tb), np.sin(tb)), 'g', d=True)
    S.ligne(R(-1, 0) + [5, 0], R(1, 0) + [-5, 0], 'b', l=3.2)
    for x in (-1, 1):
        S.point(R(x, 0), 'g', r=4, creux=True)
    for x in (-0.75, -0.25, 0.35, 0.8):
        yv = math.sqrt(1 - x * x)
        assert abs(x * x + yv * yv - 1) < 1e-12 and yv > 0
        S.ligne(R(x, yv), R(x, 0), 'g', d=True)
        S.point(R(x, yv), 'r')
        S.point(R(x, 0), 'b')
    _etiq(S, R(-0.72, 0.92) + [-12, 0], 'U', 'r', ancre='end')
    _etiq(S, R(0, 0) + [0, 20], ']−1, 1[', 'b', taille=16)
    _etiq(S, R(1, 0) + [10, 18], '(1, 0)', 'g', ancre='start', taille=14)
    _etiq(S, R(-1, 0) + [-10, 18], '(−1, 0)', 'g', ancre='end', taille=14)
    return S


# ---------------------------------------------------------------------------------------------- partitions de l'unité

@schema('lex-fonction-plateau-1')
def lex_fonction_plateau_1():
    S = Schema(W0, 210, 'La fonction plateau θ(1 − y²)')
    R = Repere(-2.1, 2.1, -0.06, 0.44, 22, 12, W0 - 44, 180)
    _axes(S, R, 'y', '')
    psi = lambda y: theta(1 - y * y)
    assert abs(psi(0) - math.exp(-1)) < 1e-15 and psi(1) == 0 and psi(-1) == 0 and psi(1.5) == 0
    assert all(psi(y) > 0 for y in np.linspace(-0.999, 0.999, 101))
    assert all(psi(y) <= psi(0) for y in np.linspace(-1, 1, 201))
    ys = np.linspace(-1, 1, 400)
    S.poly(R(ys, [psi(y) for y in ys]), 'r', l=2.4)
    S.ligne(R(-2.0, 0), R(-1, 0), 'g', l=2.4)
    S.ligne(R(1, 0), R(2.0, 0), 'g', l=2.4)
    for v, lab in [(-1, '−1'), (1, '1')]:
        _grad_x(S, R, v, lab, dy=17, taille=15)
    S.ligne(R(0, math.exp(-1)), R(0.55, math.exp(-1)), 'g', d=True)
    _etiq(S, R(0.55, math.exp(-1)) + [6, 0], 'e^{−1}', 'r', ancre='start', taille=15)
    return S


@schema('lex-partition-unite-1')
def lex_partition_unite_1():
    S = Schema(W0, 250, 'Une partition de l’unité subordonnée à deux demi-droites')
    R = Repere(-2.1, 2.1, -0.42, 1.2, 22, 12, W0 - 44, 220)
    _axes(S, R, 'x', '')
    D = lambda x: theta(x + 0.5) + theta(0.5 - x)
    c1 = lambda x: theta(0.5 - x) / D(x)
    c2 = lambda x: theta(x + 0.5) / D(x)
    xs = np.linspace(-2.0, 2.0, 801)
    assert all(D(x) > 0 for x in xs) and all(abs(c1(x) + c2(x) - 1) < 1e-14 for x in xs)
    assert all(c1(x) == 1 for x in xs if x <= -0.5) and all(c2(x) == 1 for x in xs if x >= 0.5)
    assert abs(c1(0) - 0.5) < 1e-15
    S.poly(R(xs, [c1(x) for x in xs]), 'b', l=2.4)
    S.poly(R(xs, [c2(x) for x in xs]), 'r', l=2.4)
    _grad_y(S, R, 1, '1')
    for v, lab in [(-1, '−1'), (-0.5, '−1/2'), (0.5, '1/2'), (1, '1')]:
        _grad_x(S, R, v, lab, dy=15, taille=13)
    for v in (-0.5, 0.5):
        S.ligne(R(v, 0), R(v, 1), 'g', d=True)
    # les ouverts U₁ = ]−∞, 1[ et U₂ = ]−1, +∞[, sous l'axe
    yb, yr = -0.24, -0.34
    S.ligne(R(-2.0, yb), R(1, yb) + [-4, 0], 'b', l=2)
    S.point(R(1, yb), 'b', r=3.5, creux=True)
    S.ligne(R(-1, yr) + [4, 0], R(2.0, yr), 'r', l=2)
    S.point(R(-1, yr), 'r', r=3.5, creux=True)
    _etiq(S, R(-1.75, yb) + [0, -11], 'U_1', 'b', taille=15)
    _etiq(S, R(1.75, yr) + [0, -11], 'U_2', 'r', taille=15)
    _etiq(S, R(-1.6, 1) + [0, -14], 'χ_1', 'b')
    _etiq(S, R(1.6, 1) + [0, -14], 'χ_2', 'r')
    return S


@schema('lex-localement-fini-2')
def lex_localement_fini_2():
    S = Schema(W0, 220, 'Des bosses qui s’accumulent en 0')
    R = Repere(-0.09, 1.07, -0.12, 1.22, 22, 10, W0 - 40, 190)
    _axes(S, R, 'x', '')
    K = 14
    for k in range(1, K + 1):
        a, b = 1 / (k + 1), 1 / k
        c, r = (a + b) / 2, (b - a) / 2
        # b_k = θ(r² − (x − c)²)/θ(r²), écrit sous forme exponentielle pour éviter le dépassement inférieur
        bk = lambda x, c=c, r=r: math.exp(1 / (r * r) - 1 / (r * r - (x - c) ** 2)) if abs(x - c) < r else 0.0
        assert abs(bk(c) - 1) < 1e-14 and bk(a) == 0 and bk(b) == 0
        xs = np.linspace(a, b, 161)   # nombre impair : le milieu c_k est échantillonné
        ys = [bk(x) for x in xs]
        assert max(ys) <= 1 + 1e-14
        S.poly(R(xs, ys), 'b', l=1.6 if k < 8 else 1.0)
    S.point(R(0, 0), 'r', r=4)
    _grad_y(S, R, 1, '1')
    for v, lab in [(0.5, '1/2'), (1, '1')]:
        _grad_x(S, R, v, lab, dy=15, taille=13)
    _etiq(S, R(0, 0) + [-6, 15], '0', 'r', ancre='end', taille=14)
    _etiq(S, R(0.72, 1) + [16, -6], 'b_1', 'b', ancre='start', taille=15)
    return S


# ---------------------------------------------------------------------------------------------- champs, orientation

@schema('lex-champ-vecteurs-2')
def lex_champ_vecteurs_2():
    S = Schema(W0, 280, 'Un choix discontinu de vecteurs tangents au cercle')
    ech = 92
    R = Repere(-1.55, 1.55, -1.45, 1.45, (W0 - 3.1 * ech) / 2, 6, 3.1 * ech, 2.9 * ech)
    tt = np.linspace(0, 2 * PI, 300)
    S.poly(R(np.cos(tt), np.sin(tt)), 't', l=1.4)
    for k in range(12):
        a = k * PI / 6
        x, y = math.cos(a), math.sin(a)
        if abs(y) < 1e-12:
            y = 0.0
        Y = (-y, x) if y >= 0 else (y, -x)
        assert abs(Y[0] * x + Y[1] * y) < 1e-12 and abs(math.hypot(*Y) - 1) < 1e-12
        c = 'r' if y == 0 else ('b' if y > 0 else 'v')
        p, q = R(x, y), R(x + 0.4 * Y[0], y + 0.4 * Y[1])
        _dans(S, [p, q])
        S.fleche(p, q, c, l=1.8)
        S.point(p, c, r=3)
    # en (1, 0) et (−1, 0), les vecteurs voisins du demi-cercle inférieur pointent en sens contraire
    a = -PI / 6
    assert (math.sin(a), -math.cos(a))[1] < 0
    _etiq(S, R(1, 0) + [10, 0], '(1, 0)', 'r', ancre='start', taille=15)
    _etiq(S, R(-1, 0) + [-10, 0], '(−1, 0)', 'r', ancre='end', taille=15)
    return S


@schema('lex-meme-orientation-1')
def lex_meme_orientation_1():
    S = Schema(W0, 260, 'Deux bases qui partagent leur premier vecteur')
    ech = 82
    R = Repere(-1.55, 1.85, -1.35, 1.45, (W0 - 3.4 * ech) / 2, 10, 3.4 * ech, 2.8 * ech)
    O = R(0, 0)
    u, v, w = (1, 1), (-1, 1), (1, -1)
    assert u[0] * v[1] - u[1] * v[0] == 2 and u[0] * w[1] - u[1] * w[0] == -2
    S.fleche(O, R(1, 0), 'g', l=1.6)
    S.fleche(O, R(0, 1), 'g', l=1.6)
    S.fleche(O, R(*u), 't', l=2.2)
    S.fleche(O, R(*v), 'b', l=2.2)
    S.fleche(O, R(*w), 'r', l=2.2)
    _etiq(S, R(1, 0) + [6, 12], 'e_1', 'g', ancre='start', taille=15)
    _etiq(S, R(0, 1) + [-8, -8], 'e_2', 'g', ancre='end', taille=15)
    _etiq(S, R(*u) + [10, -4], 'u', 't', ancre='start')
    _etiq(S, R(*v) + [-10, -4], 'v', 'b', ancre='end')
    _etiq(S, R(*w) + [10, 4], 'w', 'r', ancre='start')
    # arcs fléchés de u vers v (sens de e₁ vers e₂) et de u vers w (sens contraire), rayon 0,55
    rr = 0.55
    for c, a0, a1 in [('b', PI / 4, 3 * PI / 4), ('r', PI / 4, -PI / 4)]:
        ts = np.linspace(a0, a1, 40)
        pts = R(rr * np.cos(ts), rr * np.sin(ts))
        S.courbe_fleche(pts, c)
    ts = np.linspace(0.12, PI / 2 - 0.12, 30)
    S.courbe_fleche(R(0.32 * np.cos(ts), 0.32 * np.sin(ts)), 'g')
    return S
