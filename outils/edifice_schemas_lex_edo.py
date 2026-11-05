"""Schémas des exemples du lexique, théorie edo : contenu/exemples/edo.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées (formules exactes, ou intégration numérique quand la légende le dit), et ce
que la figure affirme vérifié par assert.
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte, arc

W0 = 420
TL = 17
PI = math.pi


# ---------------------------------------------------------------------------------------------- auxiliaires

def _dans_cadre(S, p, s, taille=TL, ancre='middle', marge=2):
    """Vérifie qu'une étiquette tient dans le cadre (largeur calculée sur les polices KaTeX)."""
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


def _etiq(S, p, s, c='t', ancre='middle', taille=TL):
    _dans_cadre(S, p, s, taille, ancre)
    S.texte(p, s, c, ancre=ancre, taille=taille)


def _axes(S, R, nx='x', ny='y', c='g', origine=(0, 0)):
    """Axes du repère, flèches et noms à l'intérieur du rectangle du repère (rien ne sort du cadre)."""
    ox, oy = origine
    S.fleche(R(R.xmin, oy), R(R.xmax, oy), c)
    if nx:
        S.texte(R(R.xmax, oy) + [-4, -13], nx, c, ancre='end', taille=16)
    S.fleche(R(ox, R.ymin), R(ox, R.ymax), c)
    if ny:
        S.texte(R(ox, R.ymax) + [-9, 7], ny, c, ancre='end', taille=16)


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


def _param(S, R, pts, c='t', l=None, d=False):
    pts = np.asarray(pts, float)
    S.poly(R(pts[:, 0], pts[:, 1]), c, d, l=l)


def _graduation_x(S, R, v, lab, c='g', dy=16, taille=14):
    S.ligne(R(v, 0) + [0, -3], R(v, 0) + [0, 3], c)
    if lab:
        S.texte(R(v, 0) + [0, dy], lab, c, taille=taille)


def _graduation_y(S, R, v, lab, c='g', dx=-8, taille=14):
    S.ligne(R(0, v) + [-3, 0], R(0, v) + [3, 0], c)
    if lab:
        S.texte(R(0, v) + [dx, 0], lab, c, ancre='end' if dx < 0 else 'start', taille=taille)


def _fleche_sur(S, R, p, q, c):
    """Petite pointe en p, dirigée de p vers q (coordonnées mathématiques)."""
    a, b = R(*p), R(*q)
    S.pointe(a, b - a, c, taille=9, largeur=4)


def _rk4(f, y0, t0, t1, n):
    """Intégration numérique (Runge-Kutta d'ordre 4), pas constant ; renvoie les points."""
    h = (t1 - t0) / n
    y = np.array(y0, float)
    out = [y.copy()]
    tt = t0
    for _ in range(n):
        k1 = f(tt, y); k2 = f(tt + h / 2, y + h / 2 * k1); k3 = f(tt + h / 2, y + h / 2 * k2); k4 = f(tt + h, y + h * k3)
        y = y + h / 6 * (k1 + 2 * k2 + 2 * k3 + k4)
        tt += h
        out.append(y.copy())
    return np.array(out)


# ---------------------------------------------------------------------------------------------- paquet 1 : edo

@schema('lex-flot-2')
def lex_flot_2():
    p1 = lambda q: 1 / (1 - q)            # courbe issue de 1
    p2 = lambda q: 2 / (1 - 2 * q)        # courbe issue de 2
    assert abs(p1(0.5) - 2) < 1e-12 and all(abs(p2(q) - p1(q + 0.5)) < 1e-12 for q in np.linspace(-1, 0.4, 15))
    S = Schema(W0, 280, 'Le flot de y′ = y² : la courbe issue de 2 explose à l’instant 1/2')
    R = Repere(-1.3, 1.5, -0.4, 6.3, 34, 32, W0 - 74, 226)
    _axes(S, R, 't', 'y')
    S.ligne(R(0.5, -0.4), R(0.5, 6.3), 'b', d=True)
    S.ligne(R(1, -0.4), R(1, 6.3), 'r', d=True)
    _courbe(S, R, p1, -1.3, 0.999, 'r', l=2.2)
    _courbe(S, R, p2, -1.3, 0.4999, 'b', l=2.2)
    _graduation_x(S, R, -1, '−1', dy=17)
    for v, lab in [(0.5, '1/2'), (1, '1')]:
        _graduation_x(S, R, v, '')
        S.texte(R(v, 0) + [14, 17], lab, 'g', taille=14)
    _graduation_y(S, R, 2, '2', dx=-10)
    S.ligne(R(0, 2), R(0.5, 2), 'g', d=True)
    S.point(R(0, 1), 'r')
    S.point(R(0, 2), 'b')
    S.point(R(0.5, 2), 'r', r=4)
    _etiq(S, R(1.03, 5.2) + [8, 0], 'φ_t(1)', 'r', 'start')
    _etiq(S, R(0.38, 5.6) + [-14, 0], 'φ_t(2)', 'b', 'end')
    return S


@schema('lex-flot-3')
def lex_flot_3():
    L2 = math.log(2)
    phi = lambda T, p: (math.exp(T) * p[0], math.exp(-T) * p[1])
    car = [(0, 0), (1, 0), (1, 1), (0, 1)]
    r1 = [phi(L2, p) for p in car]
    r2 = [phi(2 * L2, p) for p in car]
    assert all(abs(a - b) < 1e-12 for p, q in zip(r1, [(0, 0), (2, 0), (2, 0.5), (0, 0.5)]) for a, b in zip(p, q))
    assert all(abs(a - b) < 1e-12 for p, q in zip(r2, [(0, 0), (4, 0), (4, 0.25), (0, 0.25)]) for a, b in zip(p, q))
    assert all(abs(p[0] * p[1] - 1) < 1e-12 for p in (r1[2], r2[2]))   # le coin reste sur ab = 1 ; aire 1
    S = Schema(W0, 205, 'Le flot de (a, −b) : le carré unité devient des rectangles d’aire 1')
    ech = 82
    R = Repere(-0.15, 4.55, -0.15, 1.6, 28, 30, ech * 4.7, ech * 1.75)
    assert R.L <= W0 - 30
    _axes(S, R, 'a', 'b')
    for cst in (0.25, 1, 2):
        _courbe(S, R, lambda q, c0=cst: c0 / q, 0.05, 4.55, 'g')
    S.poly([R(*p) for p in car], 'b', ferme=True, rempli='b', l=2)
    S.poly([R(*p) for p in r1], 'r', ferme=True, rempli='r', l=2)
    S.poly([R(*p) for p in r2], 'v', ferme=True, rempli='v', l=2)
    for v, lab in [(1, '1'), (2, '2'), (4, '4')]:
        _graduation_x(S, R, v, lab, dy=17)
    _graduation_y(S, R, 1, '1')
    S.texte(R(2.6, 1 / 2.6) + [6, -14], 'ab = 1', 'g', ancre='start', taille=15)
    return S


@schema('lex-domaine-flot-1')
def lex_domaine_flot_1():
    # D = {(t, x) : |t + arctan x| < π/2}
    dans = lambda T, X: abs(T + math.atan(X)) < PI / 2
    assert dans(PI / 4, 0.99) and not dans(PI / 4, 1.0) and dans(-PI / 4, -0.99) and not dans(-PI / 4, -1.0)
    assert not any(dans(T, X) for T in (PI, -PI, 3.5) for X in np.linspace(-50, 50, 201))
    S = Schema(W0, 290, 'Le domaine du flot de 1 + y²')
    R = Repere(-3.9, 3.9, -4.2, 4.2, 26, 30, W0 - 60, 248)
    # bande remplie : pour chaque t, x entre tan(−π/2 − t) et tan(π/2 − t), coupé au repère
    ts = np.linspace(-PI + 1e-3, PI - 1e-3, 500)
    bas = [max(R.ymin, math.tan(-PI / 2 - q)) if q < 0 else R.ymin for q in ts]
    haut = [min(R.ymax, math.tan(PI / 2 - q)) if q > 0 else R.ymax for q in ts]
    bas = [min(v, R.ymax) for v in bas]
    haut = [max(v, R.ymin) for v in haut]
    S.surface([R(q, v) for q, v in zip(ts, bas)] + [R(q, v) for q, v in zip(ts[::-1], haut[::-1])], 'b')
    _axes(S, R, 't', 'x')
    _courbe(S, R, lambda q: math.tan(-PI / 2 - q), -PI + 1e-4, -1e-4, 'r', l=2.2)
    _courbe(S, R, lambda q: math.tan(PI / 2 - q), 1e-4, PI - 1e-4, 'r', l=2.2)
    for v, lab in [(-PI, '−π'), (PI, 'π')]:
        _graduation_x(S, R, v, lab, dy=-14)
    # D_{π/4} = ]−∞, 1[, en bleu ; D_{−π/4} = ]−1, +∞[, en vert
    S.ligne(R(PI / 4, -4.2), R(PI / 4, 1), 'b', l=3.2)
    S.point(R(PI / 4, 1), 'b', r=4, creux=True)
    S.ligne(R(-PI / 4, -1), R(-PI / 4, 4.2), 'v', l=3.2)
    S.point(R(-PI / 4, -1), 'v', r=4, creux=True)
    _etiq(S, R(PI / 4, -2.6) + [8, 0], 'D_{π/4}', 'b', 'start')
    _etiq(S, R(-PI / 4, -1) + [-8, 14], 'D_{−π/4}', 'v', 'end')
    return S


@schema('lex-domaine-flot-2')
def lex_domaine_flot_2():
    T = 2
    bleu, vert = (-1.0, 0.0), (-1.0, 0.55)
    # le point bleu atteint l'origine au temps 1 < 2 ; le vert n'en approche pas à moins de 0,55
    assert abs(bleu[0] + 1) < 1e-12 and 1 < T
    assert min(math.hypot(vert[0] + q, vert[1]) for q in np.linspace(0, T, 4001)) >= 0.55 - 1e-9
    S = Schema(W0, 192, 'Le domaine D_2 du champ (1, 0) sur le plan privé de l’origine')
    ech = 72
    R = Repere(-2.8, 2.8, -0.9, 1.35, (W0 - ech * 5.6) / 2, 14, ech * 5.6, ech * 2.25)
    _axes(S, R, '', '')
    S.ligne(R(-2, 0), R(0, 0), 'r', l=3.4)
    S.point(R(-2, 0), 'r', r=4)
    S.point(R(0, 0), 't', r=4.2, creux=True)
    S.fleche(R(*bleu) + [0, -9], R(0, 0) + [-6, -9], 'b', d=True)
    S.point(R(*bleu), 'b', r=4.2)
    S.fleche(R(*vert), R(vert[0] + T, vert[1]), 'v', retrait=5)
    S.point(R(*vert), 'v', r=4.2)
    S.point(R(vert[0] + T, vert[1]), 'v', r=4.2, creux=True)
    for v, lab in [(-2, '−2'), (-1, '−1'), (1, '1'), (2, '2')]:
        _graduation_x(S, R, v, lab, dy=17)
    _etiq(S, R(0, 0) + [10, -14], '0', 't', 'start')
    return S


@schema('lex-solution-maximale-1')
def lex_solution_maximale_1():
    sols = [(0.0, 'r'), (1.0, 'b'), (-1.0, 'v')]
    for y0, _ in sols:
        a = math.atan(y0)
        assert abs((PI / 2 - a) - (-PI / 2 - a) - PI) < 1e-12
    S = Schema(W0, 292, 'Solutions maximales de y′ = 1 + y²')
    R = Repere(-2.75, 2.75, -4.3, 4.3, 22, 30, W0 - 52, 250)
    _axes(S, R, 't', 'y')
    for y0, c in sols:
        a = math.atan(y0)
        g, d = -PI / 2 - a, PI / 2 - a
        for e in (g, d):
            S.ligne(R(e, -4.3), R(e, 4.3), c, d=True)
        _courbe(S, R, lambda q, a0=a: math.tan(q + a0), g + 1e-4, d - 1e-4, c, l=2.2)
        S.point(R(0, y0), c, r=3.8)
    for v, lab in [(-PI / 2, '−π/2'), (PI / 2, 'π/2')]:
        _graduation_x(S, R, v, '')
    _etiq(S, R(PI / 2, 0) + [6, 16], 'π/2', 'r', 'start', taille=15)
    _etiq(S, R(-PI / 2, 0) + [-6, -16], '−π/2', 'r', 'end', taille=15)
    return S


@schema('lex-solution-maximale-2')
def lex_solution_maximale_2():
    cs = [(1, 'r'), (2, 'b'), (4, 'v')]
    for c0, _ in cs:
        assert all(abs(-q / math.sqrt(c0 - q * q) - (-q / math.sqrt(c0 - q * q))) < 1e-12 for q in (0.1, 0.5))
        assert abs(math.sqrt(c0 - (math.sqrt(c0) - 1e-9)**2)) < 1e-3
    S = Schema(W0, 220, 'Solutions maximales de y′ = −t/y sur le demi-plan y > 0')
    ech = 76
    R = Repere(-2.55, 2.55, -0.3, 2.35, (W0 - ech * 5.1) / 2, 10, ech * 5.1, ech * 2.65)
    S.surface([R(-2.55, 0), R(2.55, 0), R(2.55, 2.35), R(-2.55, 2.35)], 'b')
    _axes(S, R, 't', 'y')
    for c0, col in cs:
        rr = math.sqrt(c0)
        _param(S, R, [(rr * math.cos(q), rr * math.sin(q)) for q in np.linspace(0, PI, 200)], col, l=2.2)
        for e in (-rr, rr):
            S.point(R(e, 0), col, r=4, creux=True)
    for v, lab in [(-2, '−2'), (-1, '−1'), (1, '1'), (2, '2')]:
        _graduation_x(S, R, v, lab, dy=17)
    _etiq(S, R(-2.45, 2.15), 'Ω', 'b', 'start')
    return S


@schema('lex-solution-maximale-3')
def lex_solution_maximale_3():
    sol = lambda tau: (lambda q: 0.0 if q <= tau else (q - tau)**3)
    for tau in (1, 2):
        f = sol(tau)
        assert f(0) == 0 and all(abs(3 * (q - tau)**2 * (q > tau) - 3 * abs(f(q))**(2 / 3)) < 1e-9 for q in np.linspace(-2, 4, 61))
    S = Schema(W0, 274, 'Une infinité de solutions maximales de y′ = 3|y|^{2/3} passent par l’origine')
    R = Repere(-1.6, 3.6, -3.4, 3.4, 26, 30, W0 - 60, 232)
    _axes(S, R, 't', 'y')
    S.ligne(R(-1.6, 0), R(3.6, 0), 'b', l=3.4)
    _courbe(S, R, lambda q: q**3, -1.6, 3.6, 'r', l=2.2)
    for tau in (1, 2):
        _courbe(S, R, lambda q, t0=tau: (q - t0)**3, tau, 3.6, 'v', l=2.2)
        _graduation_x(S, R, tau, str(tau), dy=17)
    S.point(R(0, 0), 't', r=3.8)
    _etiq(S, R(1.2, 2.9) + [-10, 0], 't^3', 'r', 'end')
    return S


@schema('lex-solution-edo-1')
def lex_solution_edo_1():
    assert all(abs(2 * abs(q) - 2 * math.sqrt(abs(q * abs(q)))) < 1e-12 for q in np.linspace(-2, 2, 41))
    S = Schema(W0, 260, 'La solution t|t| et sa dérivée 2|t|')
    R = Repere(-1.75, 1.75, -2.6, 3.6, 40, 14, W0 - 80, 230)
    _axes(S, R, 't', '')
    _courbe(S, R, lambda q: 2 * abs(q), -1.75, 1.75, 'b', l=2.2)
    _courbe(S, R, lambda q: q * abs(q), -1.75, 1.75, 'r', l=2.2)
    for v, lab in [(-1, '−1'), (1, '1')]:
        _graduation_x(S, R, v, lab, dy=17)
    _etiq(S, R(1.12, 2.24) + [-8, 0], 'y′ = 2|t|', 'b', 'end')
    _etiq(S, R(1.12, 1.254) + [10, 14], 'y = t|t|', 'r', 'start')
    return S


@schema('lex-solution-edo-2')
def lex_solution_edo_2():
    f = lambda q: 1 / (1 - q)
    assert f(0) == 1 and f(2) == -1
    S = Schema(W0, 274, 'Deux solutions de y′ = y², de part et d’autre de t = 1')
    R = Repere(-2.3, 4.3, -4.3, 4.3, 26, 30, W0 - 60, 232)
    _axes(S, R, 't', 'y')
    S.ligne(R(1, -4.3), R(1, 4.3), 'g', d=True)
    _courbe(S, R, f, -2.3, 1 - 1e-4, 'r', l=2.2)
    _courbe(S, R, f, 1 + 1e-4, 4.3, 'b', l=2.2)
    S.point(R(0, 1), 'r', r=4)
    S.point(R(2, -1), 'b', r=4)
    _etiq(S, R(0, 1) + [-8, -12], '(0, 1)', 'r', 'end')
    _etiq(S, R(2, -1) + [6, 16], '(2, −1)', 'b', 'start')
    _graduation_x(S, R, 1, '')
    S.texte(R(1, 0) + [10, -13], '1', 'g', taille=14)
    return S


@schema('lex-equation-autonome-1')
def lex_equation_autonome_1():
    lg = lambda q: 1 / (1 + math.exp(-q))
    assert abs(lg(0) - 0.5) < 1e-15
    S = Schema(W0, 214, 'Solutions de l’équation logistique, translatées les unes des autres')
    R = Repere(-7.2, 7.2, -0.18, 1.22, 26, 30, W0 - 60, 166)
    _axes(S, R, 't', '')
    for cst in (0, 1):
        S.ligne(R(-7.2, cst), R(7.2, cst), 'v', l=2.6)
    for sh in (2, -2):
        _courbe(S, R, lambda q, s0=sh: lg(q + s0), -7.2, 7.2, 'b', l=2)
    _courbe(S, R, lg, -7.2, 7.2, 'r', l=2.4)
    S.point(R(0, 0.5), 'r', r=3.8)
    S.ligne(R(-2, 0.5), R(2, 0.5), 'g', d=True)
    _graduation_x(S, R, -2, '−2', dy=17)
    _graduation_x(S, R, 2, '2', dy=17)
    S.texte(R(0, 1) + [-8, -12], '1', 'g', ancre='end', taille=14)
    return S


@schema('lex-courbe-integrale-1')
def lex_courbe_integrale_1():
    S = Schema(W0, 288, 'Courbes intégrales du champ (−b, a) : des cercles')
    ech = 70
    R = Repere(-1.85, 1.85, -1.85, 1.85, (W0 - ech * 3.7) / 2, 22, ech * 3.7, ech * 3.7)
    _axes(S, R, '', '')
    k = 0.42
    for rr in (0.6, 1.2, 1.7):
        _param(S, R, [(rr * math.cos(q), rr * math.sin(q)) for q in np.linspace(0, 2 * PI, 240)], 'b', l=1.8)
        for j in range(6):
            q = j * PI / 3 + 0.35
            p = np.array([rr * math.cos(q), rr * math.sin(q)])
            X = np.array([-p[1], p[0]])
            assert abs(X @ p) < 1e-12 and abs(np.linalg.norm(X) - rr) < 1e-12   # tangent, de norme le rayon
            S.fleche(R(*p), R(*(p + k * X)), 'r')
    S.point(R(0, 0), 't', r=3.8)
    return S


@schema('lex-courbe-integrale-2')
def lex_courbe_integrale_2():
    S = Schema(W0, 280, 'Courbes intégrales du champ (a, −b)')
    ech = 66
    R = Repere(-2.05, 2.05, -2.05, 2.05, (W0 - ech * 4.1) / 2, 4, ech * 4.1, ech * 4.1)
    for cst in (0.25, 1):
        for sa in (1, -1):
            for sb in (1, -1):
                # branche a b = sa sb cst dans le quadrant (sa, sb), parcourue a ↦ a e^t
                pts = [(sa * q, sb * cst / q) for q in np.geomspace(cst / 2.05, 2.05, 160)]
                assert all(abs(p[0] * p[1] - sa * sb * cst) < 1e-12 for p in pts)
                _param(S, R, pts, 'b', l=1.8)
                m = pts[80]
                nxt = (m[0] * math.exp(0.05), m[1] * math.exp(-0.05))
                _fleche_sur(S, R, nxt, (nxt[0] + (nxt[0] - m[0]), nxt[1] + (nxt[1] - m[1])), 'b')
    for (p, q) in [((0, 0), (2.05, 0)), ((0, 0), (-2.05, 0))]:
        S.ligne(R(*p), R(*q), 'r', l=2.2)
        _fleche_sur(S, R, (q[0] * 0.6, 0), (q[0], 0), 'r')
    for (p, q) in [((0, 2.05), (0, 0)), ((0, -2.05), (0, 0))]:
        S.ligne(R(*p), R(*q), 'r', l=2.2)
        _fleche_sur(S, R, (0, p[1] * 0.4), (0, 0), 'r')
    S.point(R(0, 0), 't', r=4)
    return S


@schema('lex-courbe-integrale-variete-3')
def lex_courbe_integrale_variete_3():
    g = lambda q: np.array([(q * q - 1) / (q * q + 1), -2 * q / (q * q + 1)])
    X = lambda p: (1 - p[0]) * np.array([-p[1], p[0]])
    for q in np.linspace(-5, 5, 41):
        dg = (g(q + 1e-6) - g(q - 1e-6)) / 2e-6
        assert np.allclose(dg, X(g(q)), atol=1e-6) and abs(np.linalg.norm(g(q)) - 1) < 1e-12
    assert np.allclose(g(-1), [0, 1]) and np.allclose(g(0), [-1, 0])
    S = Schema(W0, 280, 'Une courbe intégrale sur le cercle, qui tend vers (1, 0) aux deux bouts')
    ech = 104
    R = Repere(-1.62, 1.62, -1.3, 1.3, (W0 - ech * 3.24) / 2, 6, ech * 3.24, ech * 2.6)
    _axes(S, R, '', '')
    _param(S, R, [g(q) for q in np.linspace(-60, 60, 1200)], 'b', l=2.4)
    k = 0.32
    for j in range(12):
        q = j * PI / 6 + PI / 12
        p = np.array([math.cos(q), math.sin(q)])
        if np.linalg.norm(X(p)) > 0.08:
            S.fleche(R(*p), R(*(p + k * X(p))), 'r')
    S.point(R(1, 0), 'r', r=4.4)
    S.point(R(-1, 0), 'b', r=4)
    S.point(R(0, 1), 'b', r=4)
    _etiq(S, R(1, 0) + [10, 15], '(1, 0)', 'r', 'start')
    _etiq(S, R(-1, 0) + [-10, 15], 'γ(0)', 'b', 'end')
    _etiq(S, R(0, 1) + [10, -14], 'γ(−1)', 'b', 'start')
    return S


@schema('lex-systeme-lineaire-edo-1')
def lex_systeme_lineaire_edo_1():
    fs = [(lambda q: q * q, 'r'), (lambda q: 1 / q, 'b'), (lambda q: q * q - 1 / q, 'v')]
    S = Schema(W0, 264, 'Solutions de t²u′′ = 2u sur ]0, +∞[')
    R = Repere(-0.25, 3.25, -3.3, 9.6, 40, 30, W0 - 80, 220)
    _axes(S, R, 't', 'u')
    for f, c in fs:
        assert all(abs(q * q * (f(q + 1e-4) - 2 * f(q) + f(q - 1e-4)) / 1e-8 - 2 * f(q)) < 1e-3 * (1 + abs(f(q))) for q in (0.5, 1, 2))
        _courbe(S, R, f, 0.02, 3.25, c, l=2.2)
    for v in (1, 2, 3):
        _graduation_x(S, R, v, str(v), dy=17)
    _etiq(S, R(3.0, 9.0) + [-12, 0], 't^2', 'r', 'end')
    _etiq(S, R(0.16, 6.25) + [10, 0], '1/t', 'b', 'start')
    _etiq(S, R(2.2, 2.2**2 - 1 / 2.2) + [8, 12], 't^2 − 1/t', 'v', 'start')
    return S


@schema('lex-systeme-lineaire-edo-3')
def lex_systeme_lineaire_edo_3():
    per = lambda q: (math.cos(q) + math.sin(q)) / 2
    sols = [(lambda q: per(q) + 1.5 * math.exp(-q)), (lambda q: per(q) - 2 * math.exp(-q))]
    assert abs(sols[0](0) - 2) < 1e-12 and abs(sols[1](0) + 1.5) < 1e-12
    S = Schema(W0, 220, 'Solutions de y′ = −y + cos t')
    R = Repere(-0.4, 10.2, -1.7, 2.2, 34, 30, W0 - 64, 180)
    _axes(S, R, '', '')
    for f in sols:
        _courbe(S, R, f, 0, 10.2, 'b', l=2)
    _courbe(S, R, per, -0.4, 10.2, 'r', l=2.4)
    S.point(R(0, 2), 'b', r=3.8)
    S.point(R(0, -1.5), 'b', r=3.8)
    _graduation_y(S, R, 2, '2')
    _graduation_y(S, R, -1.5, '−1,5')
    for v in (5, 10):
        _graduation_x(S, R, v, str(v), dy=-14)
    return S


# ---------------------------------------------------------------------------------------------- paquet 2 : edo-changement

def _pave(S, R, a, b, c, ouverts=('g', 'b')):
    """Pavé ]a0, b0] × ]a1, b1] : côtés fermés (droit d, haut h) en trait plein, côtés ouverts (gauche g, bas b)
    en pointillé."""
    (x0, y0), (x1, y1) = a, b
    S.surface([R(x0, y0), R(x1, y0), R(x1, y1), R(x0, y1)], c)
    cotes = {'g': ((x0, y0), (x0, y1)), 'b': ((x0, y0), (x1, y0)), 'd': ((x1, y0), (x1, y1)), 'h': ((x0, y1), (x1, y1))}
    for k_, (p, q) in cotes.items():
        S.ligne(R(*p), R(*q), c, d=k_ in ouverts, l=2.2)


@schema('lex-pave-semi-ouvert-2')
def lex_pave_semi_ouvert_2():
    rouge, bleu = ((1, 0), (2, 2)), ((0, 1), (1, 2))
    aire = lambda P: (P[1][0] - P[0][0]) * (P[1][1] - P[0][1])
    assert aire(rouge) == 2 and aire(bleu) == 1 and aire(rouge) + aire(bleu) == 4 - 1
    S = Schema(W0, 250, 'Le carré ]0, 2]² privé de ]0, 1]², découpé en deux pavés')
    ech = 92
    R = Repere(-0.3, 2.45, -0.3, 2.25, (W0 - ech * 2.75) / 2, 8, ech * 2.75, ech * 2.55)
    _axes(S, R, '', '')
    _pave(S, R, (0, 0), (1, 1), 'g')
    _pave(S, R, *rouge, 'r')
    _pave(S, R, *bleu, 'b')
    for v in (1, 2):
        _graduation_x(S, R, v, str(v), dy=17)
        _graduation_y(S, R, v, str(v))
    return S


@schema('lex-cube-dyadique-1')
def lex_cube_dyadique_1():
    from fractions import Fraction as Fr
    q = Fr(1, 3)
    niv = []
    for k in range(5):
        m = math.ceil(q * 2**k) - 1
        a, b = Fr(m, 2**k), Fr(m + 1, 2**k)
        assert a < q <= b
        niv.append((a, b))
    assert niv[4] == (Fr(5, 16), Fr(3, 8))
    S = Schema(W0, 250, 'Les cubes dyadiques de niveaux 0 à 4 qui contiennent 1/3')
    X = lambda v: 34 + float(v) * (W0 - 64)
    for k, (a, b) in enumerate(niv):
        yk = 22 + 38 * k
        if k:
            pa, pb = niv[k - 1]
            mil = (pa + pb) / 2
            autre = (mil, pb) if a == pa else (pa, mil)
            S.ligne((X(autre[0]), yk), (X(autre[1]), yk), 'g', l=3)
        S.ligne((X(a), yk), (X(b), yk), 'r', l=4)
        S.point((X(a), yk), 'r', r=4, creux=True)
        S.point((X(b), yk), 'r', r=4)
        S.texte((8, yk), str(k), 'g', ancre='start', taille=14)
    yb = 22 + 38 * 5
    S.fleche((X(0) - 6, yb), (X(1) + 14, yb), 'g')
    S.ligne((X(q), 10), (X(q), yb), 'g', d=True)
    for v, lab in [(0, '0'), (Fr(1, 2), '1/2'), (1, '1')]:
        S.ligne((X(v), yb - 3), (X(v), yb + 3), 'g')
        S.texte((X(v), yb + 17), lab, 'g', taille=15)
    S.texte((X(q), yb + 17), '1/3', 'r', taille=15)
    return S


@schema('lex-cube-dyadique-2')
def lex_cube_dyadique_2():
    from fractions import Fraction as Fr
    cubes = []
    for k in range(2, 8):
        cubes += [(k, Fr(1, 2**k), Fr(2, 2**k)), (k, 1 - Fr(2, 2**k), 1 - Fr(1, 2**k))]
    assert all(0 < a and b < 1 for _, a, b in cubes)
    assert sum(b - a for _, a, b in cubes) == 1 - 2 * Fr(1, 2**7)
    S = Schema(W0, 110, 'La décomposition de ]0, 1[ en cubes dyadiques')
    X = lambda v: 30 + float(v) * (W0 - 60)
    y0 = 50
    S.fleche((X(0) - 14, y0), (X(1) + 18, y0), 'g')
    for k, a, b in cubes:
        c = 'r' if k % 2 == 0 else 'b'
        S.ligne((X(a), y0), (X(b), y0), c, l=6)
        S.ligne((X(b), y0 - 8), (X(b), y0 + 8), c)
        if k <= 4:
            S.texte(((X(a) + X(b)) / 2, y0 - 19), str(k), c, taille=14)
    for v in (0, 1):
        S.point((X(v), y0), 't', r=4.2, creux=True)
        S.texte((X(v), y0 + 23), str(v), 'g', taille=15)
    S.texte((X(0.5), y0 + 23), '1/2', 'g', taille=15)
    return S


@schema('lex-matrices-elementaires-reelles-3')
def lex_matrices_elementaires_reelles_3():
    th = PI / 4
    tg, sn = math.tan(th / 2), math.sin(th)
    T12 = np.array([[1, -tg], [0, 1]]); T21 = np.array([[1, 0], [sn, 1]])
    Rt = np.array([[math.cos(th), -math.sin(th)], [math.sin(th), math.cos(th)]])
    assert np.allclose(T12 @ T21 @ T12, Rt)
    car = np.array([(0, 0), (1, 0), (1, 1), (0, 1)], float)
    e1 = car @ T12.T
    e2 = e1 @ T21.T
    e3 = e2 @ T12.T
    assert np.allclose(e3, car @ Rt.T)
    aire = lambda P: 0.5 * abs(sum(P[i][0] * P[(i + 1) % 4][1] - P[(i + 1) % 4][0] * P[i][1] for i in range(4)))
    assert all(abs(aire(P) - 1) < 1e-12 for P in (e1, e2, e3))
    S = Schema(W0, 270, 'Une rotation d’un huitième de tour, produit de trois transvections')
    ech = 140
    R = Repere(-1.05, 1.15, -0.15, 1.6, (W0 - ech * 2.2) / 2, 14, ech * 2.2, ech * 1.75)
    _axes(S, R, '', '')
    for P, c in [(car, 'g'), (e1, 'b'), (e2, 'v'), (e3, 'r')]:
        S.poly([R(*p) for p in P], c, ferme=True, rempli=c if c != 'g' else None, l=2.4 if c == 'r' else 1.8)
    S.point(R(0, 0), 't')
    return S


@schema('lex-jacobien-2')
def lex_jacobien_2():
    phi = lambda p: (p[0], p[1] + p[0]**2)
    assert all(abs((phi((q, 1))[1] - phi((q, 0))[1]) - 1) < 1e-15 for q in np.linspace(0, 1, 11))
    S = Schema(W0, 250, 'Le carré unité et son image par (x, y) ↦ (x, y + x²)')
    ech = 104
    R = Repere(-0.3, 1.45, -0.15, 2.2, (W0 - ech * 1.75) / 2, 6, ech * 1.75, ech * 2.2)
    _axes(S, R, '', '')
    S.poly([R(0, 0), R(1, 0), R(1, 1), R(0, 1)], 'b', ferme=True, rempli='b', l=1.8)
    qs = np.linspace(0, 1, 100)
    bord = [R(q, q * q) for q in qs] + [R(q, q * q + 1) for q in qs[::-1]]
    S.poly(bord, 'r', ferme=True, rempli='r', l=2.2)
    xm = 0.75
    assert abs(xm**2 - 9 / 16) < 1e-15
    S.ligne(R(xm, xm**2), R(xm, xm**2 + 1), 'r', l=4.5)
    S.ligne(R(xm, 0), R(xm, 1), 'b', d=True, l=2.6)
    S.fleche(R(xm + 0.09, 0.5), R(xm + 0.09, 0.5 + xm**2), 'g', l=1.4)
    _graduation_x(S, R, 1, '1', dy=17)
    _graduation_y(S, R, 1, '1')
    _graduation_y(S, R, 2, '2')
    return S


# ---------------------------------------------------------------------------------------------- paquet 3 : edo-liapounov

@schema('lex-equilibre-stable-2')
def lex_equilibre_stable_2():
    d = 0.7
    courbe = lambda a, b, q: (a * math.cos(2 * q) + b / 2 * math.sin(2 * q), -2 * a * math.sin(2 * q) + b * math.cos(2 * q))
    pr = [courbe(d, 0, q) for q in np.linspace(0, PI, 300)]
    assert max(math.hypot(*p) for p in pr) <= 2 * d + 1e-12 and abs(max(math.hypot(*p) for p in pr) - 2 * d) < 1e-4
    assert np.allclose(courbe(d, 0, PI / 4), (0, -2 * d))
    S = Schema(W0, 290, 'Les ellipses du champ (y, −4x) : δ = ε/2 convient')
    ech = 76
    R = Repere(-1.75, 1.75, -1.75, 1.75, (W0 - ech * 3.5) / 2, 22, ech * 3.5, ech * 3.5)
    _axes(S, R, 'x', 'y')
    for c0 in (0.35, 0.52):
        _param(S, R, [(c0 * math.cos(q), 2 * c0 * math.sin(q)) for q in np.linspace(0, 2 * PI, 200)], 'b', l=1.6)
    _param(S, R, [(d * math.cos(q), d * math.sin(q)) for q in np.linspace(0, 2 * PI, 200)], 'g', d=True)
    _param(S, R, [(2 * d * math.cos(q), 2 * d * math.sin(q)) for q in np.linspace(0, 2 * PI, 200)], 'g')
    _param(S, R, [(d * math.cos(q), 2 * d * math.sin(q)) for q in np.linspace(0, 2 * PI, 200)], 'r', l=2.4)
    _fleche_sur(S, R, courbe(d, 0, 0.42), courbe(d, 0, 0.47), 'r')
    S.point(R(d, 0), 'r', r=4)
    S.point(R(0, -2 * d), 'r', r=4)
    _etiq(S, R(d, 0) + [8, -12], '(δ, 0)', 'r', 'start')
    _etiq(S, R(0, -2 * d) + [12, 12], '(0, −2δ)', 'r', 'start')
    return S


@schema('lex-asymptotiquement-stable-2')
def lex_asymptotiquement_stable_2():
    S = Schema(W0, 290, 'Spirales du champ (−x + y, −x − y) vers l’origine')
    ech = 62
    R = Repere(-2.15, 2.15, -2.15, 2.15, (W0 - ech * 4.3) / 2, 22, ech * 4.3, ech * 4.3)
    _axes(S, R, '', '')
    _param(S, R, [(2 * math.cos(q), 2 * math.sin(q)) for q in np.linspace(0, 2 * PI, 200)], 'g', d=True)
    for k in range(3):
        a0 = PI / 2 + 2 * PI * k / 3
        p = lambda q: (2 * math.exp(-q) * math.cos(a0 - q), 2 * math.exp(-q) * math.sin(a0 - q))
        # e^{-t} R_{-t} : vérification par différence finie que c'est une courbe intégrale
        for q in (0.3, 1.2):
            dp = (np.array(p(q + 1e-6)) - np.array(p(q - 1e-6))) / 2e-6
            X = np.array([-p(q)[0] + p(q)[1], -p(q)[0] - p(q)[1]])
            assert np.allclose(dp, X, atol=1e-6)
        assert abs(math.hypot(*p(1)) - 2 / math.e) < 1e-12
        _param(S, R, [p(q) for q in np.linspace(0, 7, 500)], 'b', l=2)
        _fleche_sur(S, R, p(0.9), p(0.95), 'b')
        S.point(R(*p(0)), 'b', r=3.8)
    S.point(R(0, 0), 'r', r=4.2)
    return S


@schema('lex-equilibre-instable-3')
def lex_equilibre_instable_3():
    sol = lambda t0, q: 2 * math.atan2(1, 1 / math.tan(t0 / 2) - q) if t0 > 0 else None
    # θ(t) = 2 arccot(cot(θ0/2) − t), arccot à valeurs dans ]0, π[ (via atan2), pour θ0 ∈ ]0, 2π[
    for t0 in (0.3, PI, 5.5):
        th = lambda q: 2 * math.atan2(1, 1 / math.tan(t0 / 2) - q)
        assert abs(th(0) - t0) < 1e-12
        for q in (-3, 0.5, 4):
            dth = (th(q + 1e-6) - th(q - 1e-6)) / 2e-6
            assert abs(dth - (1 - math.cos(th(q)))) < 1e-6
    neg = lambda q: -2 * math.atan2(1, 1 / math.tan(0.3 / 2) + q)   # issue de −0,3 : symétrique, θ(t) = −θ_{0,3}(−t)
    assert abs(neg(0) + 0.3) < 1e-12
    assert abs((neg(1e-6) - neg(-1e-6)) / 2e-6 - (1 - math.cos(neg(0)))) < 1e-6
    S = Schema(W0, 280, 'Solutions de θ′ = 1 − cos θ : l’équilibre 0 est instable')
    R = Repere(-6.5, 12.5, -1.3, 6.9, 34, 26, W0 - 64, 236)
    _axes(S, R, 't', 'θ')
    for e in (0, 2 * PI):
        S.ligne(R(-6.5, e), R(12.5, e), 'v', l=2.4)
    for t0 in (0.3, PI, 5.5):
        _courbe(S, R, lambda q, a0=t0: 2 * math.atan2(1, 1 / math.tan(a0 / 2) - q), -6.5, 12.5, 'r', l=2)
        S.point(R(0, t0), 'r', r=3.6)
    _courbe(S, R, neg, -6.5, 12.5, 'b', l=2)
    S.point(R(0, -0.3), 'b', r=3.6)
    S.texte(R(0, 2 * PI) + [8, -13], '2π', 'v', ancre='start', taille=15)
    _graduation_y(S, R, PI, 'π')
    return S


@schema('lex-equilibre-attractif-3')
def lex_equilibre_attractif_3():
    S = Schema(W0, 270, 'Le nœud du champ (−x, −2y)')
    ech = 92
    R = Repere(-2.05, 2.05, -1.35, 1.35, (W0 - ech * 4.1) / 2, 10, ech * 4.1, ech * 2.7)
    for (a0, b0) in [(2, 1.2), (2, 0.5), (2, -0.5), (2, -1.2), (-2, 1.2), (-2, 0.5), (-2, -0.5), (-2, -1.2),
                     (0.9, 1.35), (-0.9, 1.35), (0.9, -1.35), (-0.9, -1.35)]:
        p = lambda q: (a0 * math.exp(-q), b0 * math.exp(-2 * q))
        assert abs(p(1)[1] * a0**2 - b0 * p(1)[0]**2) < 1e-12        # sur la parabole y = (b/a²) x²
        _param(S, R, [p(q) for q in np.linspace(0, 6, 300)], 'b', l=1.7)
        _fleche_sur(S, R, p(0.5), p(0.55), 'b')
    for p0 in [(2.05, 0), (-2.05, 0), (0, 1.35), (0, -1.35)]:
        S.ligne(R(*p0), R(0, 0), 'r', l=2.2)
        _fleche_sur(S, R, (p0[0] * 0.5, p0[1] * 0.5), (0, 0), 'r')
    S.point(R(0, 0), 't', r=4)
    return S


@schema('lex-fonction-liapounov-2')
def lex_fonction_liapounov_2():
    f = lambda q, p: np.array([-p[0] + 4 * p[1], -p[0] - p[1]])
    tr = _rk4(f, [1.9, 0.0], 0, 5, 2000)
    V1 = tr[:, 0]**2 + 4 * tr[:, 1]**2
    V0 = tr[:, 0]**2 + tr[:, 1]**2
    assert np.all(np.diff(V1) < 0)                    # traverse les ellipses vers l'intérieur
    assert np.any(np.diff(V0) > 0)                    # ressort de certains cercles
    S = Schema(W0, 250, 'Une fonction de Liapounov, et une fonction qui n’en est pas une')
    ech = 100
    R = Repere(-2.0, 2.0, -1.15, 1.15, (W0 - ech * 4.0) / 2, 5, ech * 4.0, ech * 2.3)
    _axes(S, R, 'x', 'y')
    for c0 in (0.5, 1.0):
        _param(S, R, [(c0 * math.cos(q), c0 * math.sin(q)) for q in np.linspace(0, 2 * PI, 200)], 'g', l=1.2)
    for c0 in (0.5, 1.0, 1.5, 1.9):
        _param(S, R, [(c0 * math.cos(q), c0 / 2 * math.sin(q)) for q in np.linspace(0, 2 * PI, 200)], 'b', l=1.6)
    _param(S, R, tr, 'r', l=2.4)
    _fleche_sur(S, R, tr[60], tr[70], 'r')
    S.point(R(*tr[0]), 'r', r=4)
    return S


@schema('lex-ensemble-omega-limite-2')
def lex_ensemble_omega_limite_2():
    rad = lambda r0, q: r0 * math.exp(q) / (1 - r0 + r0 * math.exp(q))
    for r0 in (0.2, 2):
        assert abs(rad(r0, 30) - 1) < 1e-9
        for q in (0.3, 2):
            dr = (rad(r0, q + 1e-6) - rad(r0, q - 1e-6)) / 2e-6
            assert abs(dr - rad(r0, q) * (1 - rad(r0, q))) < 1e-6
    S = Schema(W0, 290, 'Le cercle unité, ensemble ω-limite')
    ech = 62
    R = Repere(-2.15, 2.15, -2.15, 2.15, (W0 - ech * 4.3) / 2, 22, ech * 4.3, ech * 4.3)
    _axes(S, R, 'x', 'y')
    for r0, a0 in ((0.2, 0.0), (2.0, PI)):
        pts = [(rad(r0, q) * math.cos(a0 + q), rad(r0, q) * math.sin(a0 + q)) for q in np.linspace(0, 16, 1600)]
        _param(S, R, pts, 'b', l=1.8)
        S.point(R(*pts[0]), 'b', r=3.8)
        _fleche_sur(S, R, pts[100], pts[110], 'b')
    _param(S, R, [(math.cos(q), math.sin(q)) for q in np.linspace(0, 2 * PI, 300)], 'r', l=2.6)
    return S


# ---------------------------------------------------------------------------------------------- paquet 4 : edo-courbes

def _repere_egal(xmin, xmax, ymin, ymax, W=W0, H=280, marge=14, haut=22):
    """Repère à échelle égale sur les deux axes, centré horizontalement, tenant dans W × H."""
    ech = min((W - 2 * marge) / (xmax - xmin), (H - haut - marge) / (ymax - ymin))
    L, Hh = ech * (xmax - xmin), ech * (ymax - ymin)
    return Repere(xmin, xmax, ymin, ymax, (W - L) / 2, haut, L, Hh), ech


@schema('lex-courbe-parametree-2')
def lex_courbe_parametree_2():
    g = lambda q: (q**3, abs(q)**3)
    dg = lambda q: (3 * q * q, 3 * q * abs(q))
    assert all(abs(g(q)[1] - abs(g(q)[0])) < 1e-12 for q in np.linspace(-1.2, 1.2, 25)) and dg(0) == (0, 0)
    R, ech = _repere_egal(-1.45, 1.45, -0.15, 1.5, H=250)
    S = Schema(W0, 250, 'La courbe (t³, |t|³) : une image anguleuse, une vitesse nulle au coin')
    _axes(S, R, 'x', 'y')
    _param(S, R, [g(q) for q in np.linspace(-1.12, 1.12, 400)], 'r', l=2.4)
    k = 0.13
    for q in (-1, -0.5, 0.5, 1):
        p = np.array(g(q)); v = np.array(dg(q))
        S.fleche(R(*p), R(*(p + k * v)), 'b', l=3)
        S.point(R(*p), 'r', r=3.4)
    S.point(R(0, 0), 'r', r=4)
    return S


@schema('lex-courbe-reguliere-1')
def lex_courbe_reguliere_1():
    cy = lambda q: (q - math.sin(q), 1 - math.cos(q))
    v = lambda q: (1 - math.cos(q), math.sin(q))
    assert math.hypot(*v(0)) == 0 and abs(math.hypot(*v(2 * PI))) < 1e-12
    assert all(abs(math.hypot(*v(q)) - 2 * abs(math.sin(q / 2))) < 1e-12 for q in np.linspace(0, 7, 30))
    R, ech = _repere_egal(-0.4, 2 * PI + 0.4, -0.25, 2.45, H=210)
    S = Schema(W0, 210, 'Une arche de cycloïde entre deux rebroussements')
    _axes(S, R, '', '')
    _param(S, R, [cy(q) for q in np.linspace(-0.4, 2 * PI + 0.4, 400)], 'r', l=2.4)
    q0 = 2 * PI / 3
    _param(S, R, [(q0 + math.cos(a), 1 + math.sin(a)) for a in np.linspace(0, 2 * PI, 160)], 'g', l=1.4)
    S.point(R(q0, 1), 'g', r=2.8)
    S.ligne(R(q0, 1), R(*cy(q0)), 'g', d=True)
    p = np.array(cy(q0))
    S.fleche(R(*p), R(*(p + 0.55 * np.array(v(q0)))), 'b')
    S.point(R(*p), 'r', r=4)
    for e in (0, 2 * PI):
        S.point(R(e, 0), 'r', r=4.2, creux=True)
    return S


@schema('lex-courbe-reguliere-3')
def lex_courbe_reguliere_3():
    g = lambda q: (q * q - 1, q * (q * q - 1))
    dg = lambda q: (2 * q, 3 * q * q - 1)
    assert g(1) == (0, 0) == g(-1) and dg(1) == (2, 2) and dg(-1) == (-2, 2)
    R, ech = _repere_egal(-1.3, 1.3, -1.45, 1.45, H=260)
    S = Schema(W0, 250, 'Une courbe régulière qui repasse par l’origine')
    _axes(S, R, 'x', 'y')
    _param(S, R, [g(q) for q in np.linspace(-1.4, 1.4, 400)], 'r', l=2.4)
    for q in (1, -1):
        S.fleche(R(0, 0), R(*(0.3 * np.array(dg(q)))), 'b')
    S.point(R(0, 0), 'r', r=4)
    _etiq(S, R(0.6, 0.6) + [8, 0], 'γ′(1)', 'b', 'start', taille=15)
    _etiq(S, R(-0.6, 0.6) + [-8, 0], 'γ′(−1)', 'b', 'end', taille=15)
    return S


@schema('lex-longueur-courbe-1')
def lex_longueur_courbe_1():
    L = math.sqrt(5) / 2 + math.log(2 + math.sqrt(5)) / 4
    assert 1.478 < L < 1.479 and L > math.sqrt(2)
    R, ech = _repere_egal(-0.2, 1.35, -0.15, 1.2, H=240)
    S = Schema(W0, 240, 'Un arc de parabole et sa corde')
    _axes(S, R, 'x', 'y')
    S.ligne(R(0, 0), R(1, 1), 'b', l=2.2)
    _param(S, R, [(q, q * q) for q in np.linspace(0, 1, 200)], 'r', l=2.6)
    S.point(R(0, 0), 't'); S.point(R(1, 1), 't')
    _graduation_x(S, R, 1, '1', dy=17)
    _graduation_y(S, R, 1, '1')
    return S


@schema('lex-abscisse-curviligne-2')
def lex_abscisse_curviligne_2():
    g = lambda q: (math.exp(-q) * math.cos(q), math.exp(-q) * math.sin(q))
    pts = [g(q) for q in np.linspace(0, 30, 6000)]
    lg = sum(math.dist(p, q) for p, q in zip(pts, pts[1:]))
    assert abs(lg - math.sqrt(2)) < 1e-4
    R, ech = _repere_egal(-0.5, 1.12, -0.42, 0.62, H=250)
    S = Schema(W0, 250, 'Une spirale de longueur finie √2')
    _axes(S, R, '', '')
    S.ligne(R(0, 0), R(1, 0), 'b', l=3)
    _param(S, R, pts, 'r', l=2.2)
    _fleche_sur(S, R, g(1.0), g(1.05), 'r')
    S.point(R(1, 0), 'r', r=4)
    S.point(R(0, 0), 't', r=3.6, creux=True)
    _etiq(S, R(1, 0) + [0, 18], '(1, 0)', 'r')
    return S


@schema('lex-courbure-courbe-1')
def lex_courbure_courbe_1():
    k0 = 2 / (1 + 0)**1.5
    assert k0 == 2
    # le cercle de centre (0, 1/2) et de rayon 1/2 a un contact d'ordre 2 : x² + (y − 1/2)² = 1/4 donne y = x² + x⁴ + …
    yc = lambda q: 0.5 - math.sqrt(0.25 - q * q)
    assert all(abs(yc(q) - q * q) < 2 * q**4 + 1e-15 for q in np.linspace(-0.2, 0.2, 21))
    R, ech = _repere_egal(-1.45, 1.45, -0.2, 1.8, H=260)
    S = Schema(W0, 260, 'La parabole et son cercle osculateur au sommet')
    _axes(S, R, 'x', 'y')
    _param(S, R, [(q * q * 0 + q, q * q) for q in np.linspace(-1.33, 1.33, 300)], 'r', l=2.4)
    _param(S, R, [(0.5 * math.cos(a), 0.5 + 0.5 * math.sin(a)) for a in np.linspace(0, 2 * PI, 200)], 'b', l=2)
    S.point(R(0, 0.5), 'b', r=3.2)
    S.point(R(0, 0), 'r', r=3.8)
    _etiq(S, R(0, 0.5) + [0, 17], '(0, 1/2)', 'b', taille=15)
    return S


@schema('lex-courbure-courbe-3')
def lex_courbure_courbe_3():
    kap = lambda q: 6 * q / (1 + 9 * q**4)**1.5
    assert kap(-0.5) < 0 < kap(0.5) and kap(0) == 0
    S = Schema(W0, 260, 'La courbe y = x³ et sa courbure')
    R = Repere(-1.4, 1.4, -2.2, 2.2, 30, 26, W0 - 60, 222)
    _axes(S, R, 'x', '')
    _courbe(S, R, kap, -1.4, 1.4, 'b', l=2)
    _courbe(S, R, lambda q: q**3, -1.4, 1.4, 'r', l=2.4)
    S.point(R(0, 0), 't', r=3.6)
    xm = 0.3 ** 0.25 * 0.9
    _etiq(S, R(1.05, 1.16) + [10, 0], 'y = x^3', 'r', 'start', taille=15)
    _etiq(S, R(0.42, kap(0.42)) + [8, -14], 'κ', 'b', 'start')
    return S


@schema('lex-repere-frenet-2')
def lex_repere_frenet_2():
    S = Schema(W0, 220, 'Le repère de Frenet d’un cercle dans les deux sens de parcours')
    rr = 70
    for cx, sens in ((105, 1), (315, -1)):
        cy = 116
        S.cercle((cx, cy), rr, 'g')
        a = PI / 4
        p = np.array([cx + rr * math.cos(a), cy - rr * math.sin(a)])
        # vecteurs mathématiques (y vers le haut), puis passage à l'image
        T = np.array([-math.sin(a), math.cos(a)]) * sens
        N = np.array([-T[1], T[0]])
        img = lambda w_: np.array([w_[0], -w_[1]])
        S.fleche(p, p + 46 * img(T), 'r', l=2.2)
        S.fleche(p, p + 46 * img(N), 'b', l=2.2)
        S.point(p, 't', r=3.6)
        S.point((cx, cy), 'g', r=2.6)
        # sens de parcours, flèche sur le cercle
        b = -PI / 2
        q = np.array([cx + rr * math.cos(b), cy - rr * math.sin(b)])
        tq = np.array([-math.sin(b), math.cos(b)]) * sens
        S.pointe(q, img(tq), 'g')
        assert (np.dot(N, np.array([math.cos(a), math.sin(a)])) < 0) == (sens == 1)   # N vers le centre ssi sens direct
    _etiq(S, (105, 206), 'κ = 1/R', 'g', taille=15)
    _etiq(S, (315, 206), 'κ = −1/R', 'g', taille=15)
    return S


@schema('lex-deplacement-plan-2')
def lex_deplacement_plan_2():
    arc = [(q, q * q / 2) for q in np.linspace(0, 1.6, 120)]
    kap = lambda P: [((P[i + 1][0] - P[i - 1][0]) * (P[i + 1][1] - 2 * P[i][1] + P[i - 1][1]) -
                      (P[i + 1][1] - P[i - 1][1]) * (P[i + 1][0] - 2 * P[i][0] + P[i - 1][0])) for i in range(1, len(P) - 1)]
    phi = PI / 3; c = np.array([2.9, -0.45])
    Rm = np.array([[math.cos(phi), -math.sin(phi)], [math.sin(phi), math.cos(phi)]])
    bleu = [tuple(Rm @ np.array(p) + c) for p in arc]
    vert = [(p[0], -p[1]) for p in arc]
    assert all(k_ > 0 for k_ in kap(arc)) and all(k_ > 0 for k_ in kap(bleu)) and all(k_ < 0 for k_ in kap(vert))
    R, ech = _repere_egal(-0.3, 3.4, -1.45, 1.8, H=270)
    S = Schema(W0, 270, 'Un déplacement conserve la courbure, une symétrie la change de signe')
    _axes(S, R, '', '')
    for P, col in ((arc, 'r'), (bleu, 'b'), (vert, 'v')):
        _param(S, R, P, col, l=2.4)
        _fleche_sur(S, R, P[-6], P[-1], col)
    return S


@schema('lex-torsion-courbe-2')
def lex_torsion_courbe_2():
    b = 0.25
    V = _Vue(-15, 16)
    h1 = lambda q: np.array([math.cos(q), math.sin(q), b * q])
    h2 = lambda q: np.array([math.cos(q), math.sin(q), -b * q])
    tau = lambda bb: bb / (1 + bb * bb)
    assert tau(b) > 0 > tau(-b)
    devant = lambda p: p[0] * V.d[0] + p[1] * V.d[1]            # côté visible du cylindre portant les deux courbes
    R, ech = _repere_egal(-1.6, 1.6, -2.3, 2.3, H=290, haut=8)
    S = Schema(W0, 290, 'Une hélice et son image dans un miroir horizontal')
    _param(S, R, [V((0, 0, -2.3)), V((0, 0, 2.3))], 'g', l=1.2, d=True)
    qs = np.linspace(0, 2.6 * PI, 600)
    for h, col in ((h1, 'r'), (h2, 'b')):
        pts = [h(q) for q in qs]
        _trace3(S, R, V, pts, col, l=2.2, devant=devant)
        _fleche_sur(S, R, V(pts[-5]), V(pts[-1]), col)
    return S


# ---------------------------------------------------------------------------------------------- paquet 5 : edo-surfaces

class _Vue:
    """Projection orthogonale de ℝ³ sur le plan de l'écran, vue depuis la direction d (azimut, élévation)."""

    def __init__(self, az, el):
        a, e = math.radians(az), math.radians(el)
        self.d = np.array([math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e)])
        self.ex = np.array([-math.sin(a), math.cos(a), 0.0])
        self.ey = np.array([-math.sin(e) * math.cos(a), -math.sin(e) * math.sin(a), math.cos(e)])
        assert abs(self.d @ self.ex) < 1e-12 and abs(self.d @ self.ey) < 1e-12

    def __call__(self, p):
        p = np.asarray(p, float)
        return (float(p @ self.ex), float(p @ self.ey))


def _trace3(S, R, V, pts, c, l=None, devant=None):
    """Trace une courbe de l'espace ; si devant (fonction des points) est donné, les parties où devant < 0 sont en
    pointillé."""
    pts = [np.asarray(p, float) for p in pts]
    if devant is None:
        _param(S, R, [V(p) for p in pts], c, l=l)
        return
    morceau, signe = [], None
    for p in pts:
        sg = devant(p) >= 0
        if signe is None or sg == signe:
            morceau.append(p)
        else:
            morceau.append(p)
            _param(S, R, [V(q) for q in morceau], c, l=l, d=not signe)
            morceau = [p]
        signe = sg
    if len(morceau) > 1:
        _param(S, R, [V(q) for q in morceau], c, l=l, d=not signe)


@schema('lex-surface-parametree-2')
def lex_surface_parametree_2():
    V = _Vue(-60, 24)
    x = lambda u, v: np.array([v * math.cos(u), v * math.sin(u), v])
    xu = lambda u, v: np.array([-v * math.sin(u), v * math.cos(u), 0])
    xv = lambda u, v: np.array([math.cos(u), math.sin(u), 1])
    assert np.allclose(np.cross(xu(0.4, 0.7), xv(0.4, 0.7)), [0.7 * math.cos(0.4), 0.7 * math.sin(0.4), -0.7])
    assert np.allclose(xu(1.0, 0), 0)
    R, ech = _repere_egal(-1.35, 1.35, -0.62, 1.42, H=260, haut=8)
    S = Schema(W0, 192, 'Le cône (v cos u, v sin u, v) et son sommet, où le paramétrage n’est pas régulier')
    for v in (0.25, 0.5, 0.75, 1.0):
        _trace3(S, R, V, [x(u, v) for u in np.linspace(0, 2 * PI, 160)], 'g', l=1.3)
    for k in range(12):
        u = k * PI / 6
        _trace3(S, R, V, [x(u, 0), x(u, 1)], 'b', l=1.5)
    u0, v0 = 0.5, 0.75
    p = x(u0, v0)
    S.fleche(R(*V(p)), R(*V(p + 0.9 * xu(u0, v0))), 'r', l=2.2)
    S.fleche(R(*V(p)), R(*V(p + 0.32 * xv(u0, v0))), 'v', l=2.2)
    S.point(R(*V(p)), 't', r=3.6)
    S.point(R(*V(x(0, 0))), 't', r=4.2, creux=True)
    return S


@schema('lex-courbures-principales-1')
def lex_courbures_principales_1():
    k = lambda q: math.cos(q)**2 - math.sin(q)**2
    assert abs(k(PI / 4)) < 1e-12 and abs(k(3 * PI / 4)) < 1e-12 and k(0) == 1 and abs(k(PI / 2) + 1) < 1e-12
    S = Schema(W0, 210, 'La courbure normale de la selle à l’origine, selon la direction')
    R = Repere(-0.25, PI + 0.35, -1.3, 1.3, 84, 22, W0 - 120, 166)
    _axes(S, R, 'θ', '')
    for v in (1, -1):
        S.ligne(R(0, v), R(PI, v), 'g', d=True)
    _graduation_y(S, R, 1, 'k_1 = 1')
    _graduation_y(S, R, -1, 'k_2 = −1')
    _courbe(S, R, k, 0, PI, 'r', l=2.4)
    for v, lab, dx, dy in [(PI / 4, 'π/4', -16, 17), (PI / 2, 'π/2', 0, -14), (3 * PI / 4, '3π/4', 20, 17), (PI, 'π', 0, 17)]:
        _graduation_x(S, R, v, '')
        S.texte(R(v, 0) + [dx, dy], lab, 'g', taille=14)
    for v in (PI / 4, 3 * PI / 4):
        S.point(R(v, 0), 'b', r=4.2)
    return S


@schema('lex-courbure-gauss-1')
def lex_courbure_gauss_1():
    Rr, rr = 2.0, 2 / 3
    V = _Vue(-55, 32)
    x = lambda u, v: np.array([(Rr + rr * math.cos(u)) * math.cos(v), (Rr + rr * math.cos(u)) * math.sin(v), rr * math.sin(u)])
    N = lambda u, v: -np.array([math.cos(u) * math.cos(v), math.cos(u) * math.sin(v), math.sin(u)])
    K = lambda u: math.cos(u) / (rr * (Rr + rr * math.cos(u)))
    R, ech = _repere_egal(-2.85, 2.85, -1.75, 1.75, H=270, haut=12)
    S = Schema(W0, 270, 'Le tore : courbure de Gauss positive dehors, négative dedans')

    def face(uv_pts, c, l):
        """Ne trace que les parties tournées vers l'observateur (normale extérieure −N vers lui)."""
        morceau = []
        for (u, v) in uv_pts:
            if -(N(u, v) @ V.d) >= 0:
                morceau.append(x(u, v))
            else:
                if len(morceau) > 1:
                    _trace3(S, R, V, morceau, c, l=l)
                morceau = []
        if len(morceau) > 1:
            _trace3(S, R, V, morceau, c, l=l)

    for j in range(12):
        v = j * PI / 6
        face([(u, v) for u in np.linspace(-PI, PI, 200)], 'g', 1.0)
    vs = np.linspace(0, 2 * PI, 300)
    for j in range(10):
        u = -PI + j * 2 * PI / 10
        assert (K(u) > 0) == (math.cos(u) > 0) and abs(math.cos(u)) > 1e-9
        face([(u, v) for v in vs], 'r' if K(u) > 0 else 'b', 1.8)
    for u in (PI / 2, -PI / 2):
        assert abs(K(u)) < 1e-12
        face([(u, v) for v in vs], 'v', 2.6)
    return S


@schema('lex-geodesique-3')
def lex_geodesique_3():
    b = 0.3
    V = _Vue(-25, 18)
    hel = lambda q: np.array([math.cos(q), math.sin(q), b * q])
    acc = lambda q: np.array([-math.cos(q), -math.sin(q), 0])
    assert all(abs(acc(q) @ np.array([-math.sin(q), math.cos(q), 0])) < 1e-12 for q in np.linspace(0, 6, 13))
    assert 2 * PI * math.sqrt(1 + b * b) > 2 * PI * b
    devant = lambda p: p[0] * V.d[0] + p[1] * V.d[1]          # face visible du cylindre : normale (x, y, 0)
    R, ech = _repere_egal(-1.4, 1.4, -0.55, 2.35, H=280, haut=6)
    S = Schema(W0, 280, 'Deux géodésiques du cylindre entre les mêmes points')
    for z in (0, b * PI, 2 * PI * b):
        _trace3(S, R, V, [(math.cos(q), math.sin(q), z) for q in np.linspace(0, 2 * PI, 200)], 'g', l=1.3, devant=devant)
    for q in (V_ := math.atan2(V.ex[1], V.ex[0]), V_ + PI):
        _trace3(S, R, V, [(math.cos(q), math.sin(q), -0.15), (math.cos(q), math.sin(q), 2 * PI * b + 0.15)], 'g', l=1.0)
    _trace3(S, R, V, [hel(q) for q in np.linspace(0, 2 * PI, 400)], 'r', l=2.4, devant=devant)
    _trace3(S, R, V, [(1, 0, 0), (1, 0, 2 * PI * b)], 'b', l=2.4, devant=devant)
    for p in ((1, 0, 0), (1, 0, 2 * PI * b)):
        S.point(R(*V(p)), 't', r=4)
    return S


@schema('lex-triangle-geodesique-1')
def lex_triangle_geodesique_1():
    V = _Vue(40, 28)
    sommets = [np.array(e, float) for e in ((1, 0, 0), (0, 1, 0), (0, 0, 1))]
    # angles droits : les tangentes des deux côtés en chaque sommet sont orthogonales
    for i in range(3):
        a, b_, c_ = sommets[i], sommets[(i + 1) % 3], sommets[(i + 2) % 3]
        t1, t2 = b_ - (b_ @ a) * a, c_ - (c_ @ a) * a
        assert abs(t1 @ t2) < 1e-12
    devant = lambda p: np.asarray(p) @ V.d
    R, ech = _repere_egal(-1.2, 1.2, -1.15, 1.15, H=270, haut=10)
    S = Schema(W0, 270, 'Le triangle géodésique d’un huitième de sphère')
    S.cercle(R(0, 0), ech * 1.0, 'g')
    arcs = []
    for (i, j) in ((0, 1), (1, 2), (2, 0)):
        a, b_ = sommets[i], sommets[j]
        arcs.append([math.cos(q) * a + math.sin(q) * b_ for q in np.linspace(0, PI / 2, 80)])
    for (i, j) in ((0, 1), (1, 2), (2, 0)):
        a, b_ = sommets[i], sommets[j]
        _trace3(S, R, V, [math.cos(q) * a + math.sin(q) * b_ for q in np.linspace(PI / 2, 2 * PI, 300)], 'g', l=1.2, devant=devant)
    for A in arcs:
        assert all(devant(p) > 0 for p in A)                   # le triangle est entièrement visible
        _trace3(S, R, V, A, 'r', l=2.6)
    for i in range(3):
        a, b_, c_ = sommets[i], sommets[(i + 1) % 3], sommets[(i + 2) % 3]
        k = 0.13
        q1, q2 = a + k * b_, a + k * c_
        q3 = a + k * b_ + k * c_
        _trace3(S, R, V, [q1, q3, q2], 'b', l=1.8)
        S.point(R(*V(a)), 'r', r=3.6)
    return S


@schema('lex-longueur-riemannienne-1')
def lex_longueur_riemannienne_1():
    h0 = 0.1
    Lh = 1 / h0
    Lr = 2 * math.log(1 / h0) + 1
    assert Lh == 10 and Lr < 5.61
    S = Schema(W0, 240, 'Dans le demi-plan de Poincaré, le chemin le plus court passe par le haut')
    R, ech = _repere_egal(-0.35, 1.38, -0.08, 1.2, H=240, haut=28)
    S.fleche(R(-0.35, 0), R(1.35, 0) + [8, 0], 'g')
    S.texte(R(1.35, 0) + [14, 0], 'u', 'g', ancre='start')
    S.fleche(R(0, 0), R(0, 1.2) - [0, 8], 'g')
    S.texte(R(0, 1.2) - [0, 16], 'v', 'g')
    for v in (0.25, 0.5, 0.75, 1.0):
        S.fleche(R(1.1, v), R(1.1 + 0.2 * v, v), 'g', l=1.4)
    S.ligne(R(0, h0), R(1, h0), 'b', l=2.6)
    _param(S, R, [(0, h0), (0, 1), (1, 1), (1, h0)], 'r', l=2.4)
    for p in ((0, h0), (1, h0)):
        S.point(R(*p), 't', r=4)
    _graduation_x(S, R, 1, '1', dy=17)
    _graduation_y(S, R, 1, '1')
    S.texte(R(0, h0) + [-10, 0], '1/10', 'g', ancre='end', taille=14)
    return S
