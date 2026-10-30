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
    S.texte(R(b, fn(b)) + [8, -16], '(b, f(b))', 'b', ancre='end')
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


def _morceaux_visibles(R, fn, a, b, ymin, ymax, n=4001):
    """Morceaux du graphe de fn sur [a, b] compris entre ymin et ymax (coordonnées image)."""
    xs = np.linspace(a, b, n)
    ys = fn(xs)
    dedans = (ys >= ymin) & (ys <= ymax)
    morceaux, cour = [], []
    for x, y, ok in zip(xs, ys, dedans):
        if ok:
            cour.append((x, y))
        elif cour:
            morceaux.append(cour); cour = []
    if cour:
        morceaux.append(cour)
    return [R(np.array([p[0] for p in m]), np.array([p[1] for p in m])) for m in morceaux if len(m) > 1]


def _droite_cadre(x0, y0, p, cadre):
    """Segment de la droite de pente p passant par (x0, y0), découpé par le cadre (xmin, xmax, ymin, ymax)."""
    xmin, xmax, ymin, ymax = cadre
    pts = []
    for x in (xmin, xmax):
        y = y0 + p * (x - x0)
        if ymin - 1e-12 <= y <= ymax + 1e-12:
            pts.append((x, y))
    if p != 0:
        for y in (ymin, ymax):
            x = x0 + (y - y0) / p
            if xmin - 1e-12 <= x <= xmax + 1e-12:
                pts.append((x, y))
    pts = sorted(set((round(x, 12), round(y, 12)) for x, y in pts))
    assert len(pts) == 2
    return pts


@schema('de-derivee')
def de_derivee():
    fn = lambda x: x ** 2
    a = 1.0
    xs = [2.6, 2.0, 1.5, 0.3]
    pentes = {x: (fn(x) - fn(a)) / (x - a) for x in xs}
    for x, p in pentes.items():
        assert abs(p - (x + a)) < 1e-12                      # tau_a(x) = x + a -> 2a = 2
    cadre = (-0.2, 2.9, -0.3, 7.3)
    S = Schema(500, 350, 'Sécantes issues de (a, f(a)) qui tendent vers la tangente')
    R = Repere(-0.25, 3.0, -0.75, 7.4, 22, 22, 430, 290)
    S.fleche(R(-0.25, 0), R(2.97, 0), 'g')
    S.texte(R(2.97, 0) + [8, 0], 'x', 'g', ancre='start')
    S.fleche(R(0, -0.75), R(0, 7.4), 'g')
    R.graphe(S, fn, -0.2, 2.68, 't', l=2.2)
    S.texte(R(-0.12, fn(-0.12)) + [0, -16], 'f')
    sorties = []
    for x in xs:
        p, c = pentes[x], ('b' if x > a else 'v')
        (u0, v0), (u1, v1) = _droite_cadre(a, fn(a), p, cadre)
        S.ligne(R(u0, v0), R(u1, v1), c, l=1.3)
        sorties.append((u1, v1, f'{p:g}'.replace('.', ','), c))
        S.ligne(R(x, 0), R(x, fn(x)), 'g', d=True)
        S.point(R(x, fn(x)), c)
        S.texte(R(x, 0) + [0, 17], 'x', c)
    (u0, v0), (u1, v1) = _droite_cadre(a, fn(a), 2.0, cadre)
    S.ligne(R(u0, v0), R(u1, v1), 'r', l=2.4)
    sorties.append((u1, v1, '2', 'r'))
    S.ligne(R(a, 0), R(a, fn(a)), 'g', d=True)
    S.point(R(a, fn(a)), 'r', r=4.4)
    S.texte(R(a, 0) + [0, 17], 'a', 'r')
    # pentes inscrites à la sortie de chaque droite ; écart vertical d'au moins 20 px
    ys = sorted(R(u, v)[1] for u, v, _, _ in sorties)
    assert min(np.diff(ys)) > 20, ys
    for u, v, txt, c in sorties:
        dec = [6, 0] if u >= cadre[1] - 1e-9 else [0, -12]
        S.texte(R(u, v) + dec, txt, c, ancre='start' if dec[0] else 'middle', taille=16)
    return S


@schema('de-derivee-2')
def de_derivee_2():
    tau = lambda x: np.abs(x) / x
    xs = np.concatenate([np.linspace(-1.3, -1e-6, 200), np.linspace(1e-6, 1.3, 200)])
    assert np.all(tau(xs[xs > 0]) == 1) and np.all(tau(xs[xs < 0]) == -1)
    S = Schema(520, 250, 'Valeur absolue : taux 1 à droite, -1 à gauche, pas de limite en 0')
    # à gauche : le graphe de |x|
    R = Repere(-1.4, 1.4, -0.35, 1.45, 30, 20, 210, 200)
    S.fleche(R(-1.4, 0), R(1.38, 0), 'g')
    S.fleche(R(0, -0.35), R(0, 1.45), 'g')
    S.texte(R(1.38, 0) + [8, 0], 'x', 'g', ancre='start')
    S.poly(R(np.array([0, 1.25]), np.array([0, 1.25])), 'b', l=2.2)
    S.poly(R(np.array([0, -1.25]), np.array([0, 1.25])), 'v', l=2.2)
    S.point(R(0, 0), 'r', r=4.2)
    S.texte(R(0.75, 0.75) + [12, 10], 'pente 1', 'b', ancre='start', ui=True, taille=17)
    S.texte(R(-0.75, 0.75) + [-12, 10], 'pente −1', 'v', ancre='end', ui=True, taille=17)
    S.texte(R(0, 1.45) + [14, 6], '|x|', ancre='start')
    # à droite : le taux d'accroissement en 0, non défini en 0
    R = Repere(-1.4, 1.4, -1.45, 1.45, 285, 20, 210, 200)
    S.fleche(R(-1.4, 0), R(1.38, 0), 'g')
    S.fleche(R(0, -1.45), R(0, 1.45), 'g')
    S.texte(R(1.38, 0) + [8, 0], 'x', 'g', ancre='start')
    S.ligne(R(0, 1), R(1.25, 1), 'b', l=2.2)
    S.ligne(R(-1.25, -1), R(0, -1), 'v', l=2.2)
    S.point(R(0, 1), 'b', r=4, creux=True)
    S.point(R(0, -1), 'v', r=4, creux=True)
    S.texte(R(0.68, 1) + [0, 18], 'f^{′}_d(0) = 1', 'b')
    S.texte(R(-0.68, -1) + [0, -17], 'f^{′}_g(0) = −1', 'v')
    S.texte(R(0, 1.45) + [14, 6], 'τ_0', ancre='start')
    return S


@schema('de-reciproque')
def de_reciproque():
    fn = lambda x: x ** 3
    inv = np.cbrt
    a = 2 / np.sqrt(3)
    b = fn(a)
    assert abs(3 * a ** 2 - 4) < 1e-12 and abs(b - 8 / (3 * np.sqrt(3))) < 1e-12   # f'(a) = 4
    # pente de f^{-1} en b : taux d'accroissement numérique -> 1/4
    h = 1e-6
    assert abs((inv(b + h) - inv(b - h)) / (2 * h) - 0.25) < 1e-6
    # en 0, le taux de la racine cubique, y^{-2/3}, n'est pas borné
    assert inv(1e-9) / 1e-9 > 1e5
    S = Schema(500, 410, 'x cube et racine cubique, symétriques par rapport à y = x')
    R = Repere(-2, 2, -2, 2, 70, 15, 380, 380)
    S.fleche(R(-2, 0), R(1.98, 0), 'g')
    S.fleche(R(0, -2), R(0, 1.98), 'g')
    S.texte(R(1.98, 0) + [6, 14], 'x', 'g', ancre='start')
    S.ligne(R(-1.9, -1.9), R(1.9, 1.9), 'g', d=True)
    S.texte(R(1.9, 1.9) + [-4, -12], 'y = x', 'g', ancre='end')
    c = 2 ** (1 / 3) * 0.995
    R.graphe(S, fn, -c, c, 'b', l=2)
    xs = np.linspace(-1.95, 1.95, 600)
    S.poly(R(xs, inv(xs)), 'v', l=2)
    S.texte(R(-1.12, fn(-1.12)) + [12, 0], 'f', 'b', ancre='start')
    S.texte(R(-1.85, inv(-1.85)) + [0, -16], 'f^{−1}', 'v', ancre='middle')
    # tangentes en A = (a, b) et en A' = (b, a), de même longueur, symétriques
    L = 0.5
    for (p, q, pente) in [((a, b), None, 4.0), ((b, a), None, 0.25)]:
        u = np.array([1.0, pente]) / np.hypot(1, pente)
        S.ligne(R(*(np.array(p) - L * u)), R(*(np.array(p) + L * u)), 'r', l=2)
    S.ligne(R(a, b), R(b, a), 'g', d=True)
    assert abs((a + b) / 2 - (b + a) / 2) < 1e-15            # milieu sur la bissectrice
    S.point(R(a, b), 'b', r=4)
    S.point(R(b, a), 'v', r=4)
    S.texte(R(a, b) + [-12, 2], 'pente 4', 'r', ancre='end', ui=True)
    S.texte(R(b + 0.45, a + 0.45 / 4) + [0, 30], 'pente 1/4', 'r', ancre='middle', ui=True)
    # en 0 : tangente horizontale pour f, verticale pour f^{-1}
    S.ligne(R(-0.55, 0), R(0.55, 0), 'r', l=2.4)
    S.ligne(R(0, -0.55), R(0, 0.55), 'r', l=2.4)
    S.point(R(0, 0), 'r', r=4.2)
    return S


@schema('de-extremum')
def de_extremum():
    g = lambda x: x / (1 + x ** 2)
    dg = lambda x: (1 - x ** 2) / (1 + x ** 2) ** 2
    assert dg(1) == 0 and dg(-1) == 0 and g(1) == 0.5 and g(-1) == -0.5
    xs = np.linspace(-6, 6, 4001)
    assert np.all(g(xs) <= 0.5 + 1e-15) and np.all(g(xs) >= -0.5 - 1e-15)
    S = Schema(520, 270, 'Extrema de x/(1+x²) et point critique sans extremum de x³')
    # à gauche
    R = Repere(-3.3, 3.3, -0.75, 0.8, 15, 25, 230, 210)
    S.fleche(R(-3.3, 0), R(3.25, 0), 'g')
    S.fleche(R(0, -0.75), R(0, 0.8), 'g')
    R.graphe(S, g, -3.2, 3.2, 't', l=2)
    for x0 in (1, -1):
        S.ligne(R(x0 - 0.8, g(x0)), R(x0 + 0.8, g(x0)), 'r', l=2)
        S.point(R(x0, g(x0)), 'r', r=4)
    S.texte(R(1, 0.5) + [0, -14], 'max', 'r', ui=True, taille=17)
    S.texte(R(-1, -0.5) + [0, 16], 'min', 'r', ui=True, taille=17)
    S.texte(R(2.6, g(2.6)) + [0, -14], 'f', ancre='middle')
    # à droite : x^3
    h = lambda x: x ** 3
    xd, xg = 1.1, -0.8
    td, tg = h(xd) / xd, h(xg) / xg
    assert td > 0 and tg > 0                                      # taux > 0 des deux côtés
    assert h(-0.01) < 0 < h(0.01)                                 # pas d'extremum en 0
    R = Repere(-1.35, 1.35, -1.75, 1.75, 280, 15, 225, 230)
    S.fleche(R(-1.35, 0), R(1.32, 0), 'g')
    S.fleche(R(0, -1.75), R(0, 1.75), 'g')
    R.graphe(S, h, -1.2, 1.2, 't', l=2)
    S.ligne(R(-0.75, 0), R(0.75, 0), 'r', l=2.4)
    S.ligne(R(0, 0), R(xd, h(xd)), 'b', l=1.5)
    S.ligne(R(0, 0), R(xg, h(xg)), 'v', l=1.5)
    S.point(R(xd, h(xd)), 'b')
    S.point(R(xg, h(xg)), 'v')
    S.point(R(0, 0), 'r', r=4.2)
    S.texte(R(xd, h(xd)) + [-10, -10], 'taux > 0', 'b', ancre='end', ui=True, taille=17)
    S.texte(R(xg, h(xg)) + [12, 8], 'taux > 0', 'v', ancre='start', ui=True, taille=17)
    S.texte(R(1.2, h(1.2)) + [10, 8], 'x^3', ancre='start')
    return S


@schema('de-iaf')
def de_iaf():
    fn = lambda x: x ** 3 / 3
    a, b, m, M = 1.0, 2.0, 1.0, 4.0
    xs = np.linspace(a, b, 2001)[1:]
    assert np.all(m <= xs ** 2) and np.all(xs ** 2 <= M)         # m <= f' <= M sur [1, 2]
    assert np.all(fn(a) + m * (xs - a) < fn(xs)) and np.all(fn(xs) < fn(a) + M * (xs - a))
    assert abs(fn(b) - fn(a) - 7 / 3) < 1e-12
    S = Schema(500, 340, 'Graphe dans le secteur des pentes m et M')
    R = Repere(0.7, 2.4, -0.45, 4.75, 30, 28, 420, 280)
    S.fleche(R(0.7, 0), R(2.38, 0), 'g')
    S.texte(R(2.38, 0) + [8, 0], 'x', 'g', ancre='start')
    A = (a, fn(a))
    S.surface([R(*A), R(b, fn(a) + M), R(b, fn(a) + m)], 'g')
    S.ligne(R(*A), R(2.15, fn(a) + M * 1.15), 'b', l=1.6)
    S.ligne(R(*A), R(2.15, fn(a) + m * 1.15), 'v', l=1.6)
    R.graphe(S, fn, 0.8, 2.12, 't', l=2.2)
    S.ligne(R(b, 0), R(b, fn(a) + M), 'g', d=True)
    S.ligne(R(a, 0), R(*A), 'g', d=True)
    S.ligne(R(b, fn(a) + m), R(b, fn(a) + M), 'r', l=3)
    S.point(R(b, fn(b)), 'r', r=4.4)
    S.point(R(*A), 't', r=4)
    S.texte(R(b, fn(b)) + [10, 0], 'f(b)', 'r', ancre='start')
    S.texte(R(2.15, fn(a) + M * 1.15) + [-8, 0], 'pente M', 'b', ancre='end', ui=True)
    S.texte(R(2.15, fn(a) + m * 1.15) + [0, 16], 'pente m', 'v', ancre='middle', ui=True)
    S.texte(R(0.9, fn(0.9)) + [0, -16], 'f')
    S.texte(R(a, 0) + [0, 17], 'a')
    S.texte(R(b, 0) + [0, 17], 'b')
    return S


@schema('de-taylor')
def de_taylor():
    from fractions import Fraction as Fr
    fn = lambda x: 1 / (1 + x)
    T = lambda n: (lambda x: sum((-x) ** k for k in range(n + 1)))
    # formule f^(k)(0)/k! = (-1)^k : les polynômes de Taylor en 0 sont les sommes partielles
    assert [T(n)(2) for n in (1, 2, 3)] == [-1, 3, -5] and abs(fn(2) - 1 / 3) < 1e-15
    assert T(2)(Fr(1, 2)) == Fr(3, 4) and Fr(1, 1) / (1 + Fr(1, 2)) == Fr(2, 3)
    for n in (1, 2, 3):                                           # f - T_n = (-x)^{n+1}/(1+x)
        for x in (Fr(-1, 2), Fr(1, 3), Fr(2)):
            assert Fr(1) / (1 + x) - T(n)(x) == (-x) ** (n + 1) / (1 + x)
    ymin, ymax = -2.1, 3.3
    S = Schema(500, 350, 'Polynômes de Taylor de 1/(1+x) en 0 : bons près de 0, divergents en 2')
    R = Repere(-0.75, 2.45, -2.3, 3.5, 30, 15, 420, 300)
    S.fleche(R(-0.75, 0), R(2.42, 0), 'g')
    S.fleche(R(0, -2.3), R(0, 3.5), 'g')
    S.texte(R(2.42, 0) + [8, 0], 'x', 'g', ancre='start')
    S.ligne(R(2, ymin), R(2, ymax), 'g', d=True)
    for n, c in [(1, 'b'), (2, 'r'), (3, 'v')]:
        for m in _morceaux_visibles(R, T(n), -0.65, 2.3, ymin, ymax):
            S.poly(m, c, l=1.7)
    for m in _morceaux_visibles(R, fn, -0.65, 2.3, ymin, ymax):
        S.poly(m, 't', l=2.4)
    S.point(R(2, fn(2)), 't', r=4.2)
    S.point(R(2, -1), 'b')
    S.point(R(2, 3), 'r')
    S.texte(R(2.3, fn(2.3)) + [0, -14], 'f', ancre='middle')
    S.texte(R(2.3, T(1)(2.3)) + [0, 16], 'T_1', 'b')
    S.texte(R(2, 3) + [-10, -4], 'T_2', 'r', ancre='end')
    x3 = np.roots([-1, 1, -1, 1 - ymin]).real[np.abs(np.roots([-1, 1, -1, 1 - ymin]).imag) < 1e-9][0]
    assert abs(T(3)(x3) - ymin) < 1e-9
    S.texte(R(x3, ymin) + [-10, 0], 'T_3', 'v', ancre='end')
    S.texte(R(0, 0) + [-8, 14], '0', 'g', ancre='end')
    S.texte(R(2, 0) + [8, 14], '2', 'g', ancre='start')
    return S
