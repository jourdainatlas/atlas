"""Schémas du graphe intérieur ar-asymptotique (chapitre « Comparaison asymptotique et développements limités »).

Toute position est calculée ; tout ce que dit la légende est vérifié par un assert.
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte


def _axes(S, R, x0, x1, y0, y1, nx='x', ny='y'):
    S.fleche(R(x0, 0), R(x1, 0), 'g')
    S.texte(R(x1, 0) + [9, 0], nx, 'g', ancre='start', taille=15)
    _dans(S, R(x1, 0) + [9, 0], nx, 15, 'start')
    S.fleche(R(0, y0), R(0, y1), 'g')
    S.texte(R(0, y1) + [0, -11], ny, 'g', taille=15)
    _dans(S, R(0, y1) + [0, -11], ny, 15, 'middle')


def _dans(S, p, s, taille=16, ancre='middle'):
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert 2 <= x0 and x0 + w <= S.w - 2 and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


@schema('as-comparaison')
def as_comparaison():
    # x^2 <= eps |x|  <=>  |x| <= eps : le graphe est dans le secteur exactement sur [-eps, eps]
    for eps in (0.5, 0.25):
        xs = np.linspace(-1, 1, 4001)
        dedans = xs ** 2 <= eps * np.abs(xs) + 1e-15
        assert np.all(dedans == (np.abs(xs) <= eps + 1e-12))
    S = Schema(500, 320, 'x² est négligeable devant x en 0 : secteurs |y| ≤ ε|x|')
    R = Repere(-0.92, 0.92, -0.42, 0.62, 40, 20, 420, 280)
    _axes(S, R, -0.92, 0.9, -0.42, 0.6)
    X = 0.84
    # secteurs : ε = 1/2 (bleu), ε = 1/4 (vert)
    for eps, c in [(0.5, 'b'), (0.25, 'v')]:
        S.surface([R(0, 0), R(X, eps * X), R(X, -eps * X)], c)
        S.surface([R(0, 0), R(-X, eps * X), R(-X, -eps * X)], c)
        for sx in (1, -1):
            for sy in (1, -1):
                S.ligne(R(0, 0), R(sx * X, sy * eps * X), c, l=1.3)
    # graphe de x^2, en rouge, et les points où il sort des secteurs
    xs = np.linspace(-0.76, 0.76, 400)
    S.poly(R(xs, xs ** 2), 'r', l=2.4)
    for eps, c in [(0.5, 'b'), (0.25, 'v')]:
        for sx in (1, -1):
            S.point(R(sx * eps, eps * eps), c, r=4)
            S.ligne(R(sx * eps, 0), R(sx * eps, eps * eps), 'g', d=True)
    S.texte(R(0.5, 0) + [0, 17], '1/2', 'b', taille=15)
    S.texte(R(-0.5, 0) + [0, 17], '−1/2', 'b', taille=15)
    S.texte(R(0.25, 0) + [0, 35], '1/4', 'v', taille=15)
    S.texte(R(-0.25, 0) + [0, 35], '−1/4', 'v', taille=15)
    p = R(-0.62, 0.52) + [8, 0]
    assert 0.62 ** 2 < 0.52 - 0.1 and 0.5 * 0.62 < 0.52 - 0.15      # à droite de la branche gauche, au-dessus du secteur
    S.texte(p, 'x^2', 'r', ancre='start', taille=17)
    _dans(S, p, 'x2', 17, 'start')
    q = R(X, 0.5 * X) + [0, -14]
    S.texte(q, 'ε = 1/2', 'b', ancre='end', taille=15)
    _dans(S, q, 'ε = 1/2', 15, 'end')
    q = R(X, -0.25 * X) + [0, 16]
    S.texte(q, 'ε = 1/4', 'v', ancre='end', taille=15)
    _dans(S, q, 'ε = 1/4', 15, 'end')
    return S


@schema('as-dl')
def as_dl():
    f = lambda x: x ** 3 * np.sin(1 / x)
    df = lambda x: 3 * x ** 2 * np.sin(1 / x) - x * np.cos(1 / x)
    xk = [1 / (2 * k * math.pi) for k in range(1, 6)]
    yk = [1 / ((2 * k + 1) * math.pi) for k in range(1, 6)]
    for x in xk:
        assert abs(df(x) / x + 1) < 1e-9          # f'(x_k)/x_k = -1
    for y in yk:
        assert abs(df(y) / y - 1) < 1e-9          # f'(y_k)/y_k = 1
    g = np.concatenate([np.linspace(-0.4, -1e-4, 20000), np.linspace(1e-4, 0.4, 20000)])
    assert np.all(np.abs(f(g)) <= np.abs(g) ** 3 + 1e-15)
    S = Schema(520, 270, 'x³ sin(1/x) : développement nul à l’ordre 2, dérivée non dérivable en 0')
    # à gauche : f entre ±|x|^3
    A = 0.4
    R = Repere(-A, A, -0.07, 0.07, 18, 22, 222, 220)
    _axes(S, R, -A, A, -0.07, 0.07)
    xs = np.linspace(-A, A, 600)
    S.poly(R(xs, np.abs(xs) ** 3), 'b', l=1.5)
    S.poly(R(xs, -np.abs(xs) ** 3), 'b', l=1.5)
    xx = np.concatenate([-np.geomspace(A, 2e-3, 3000), np.geomspace(2e-3, A, 3000)])
    S.poly(R(xx, f(xx)), 't', l=1.6)
    p = R(0.17, 0.045)
    assert 0.17 ** 3 < 0.03 and (0.17 + 0.06) ** 3 < 0.03      # l'étiquette reste loin de la courbe bleue
    S.texte(p, '|x|^3', 'b', taille=15)
    S.texte(R(-0.34, -0.06) + [0, 0], 'f', 't', taille=17)
    # à droite : f' entre les droites ±x, points x_k (pente -1) et y_k (pente 1)
    B = 0.2
    R = Repere(-B, B, -0.23, 0.23, 282, 22, 206, 220)
    _axes(S, R, -B, B, -0.23, 0.23)
    S.ligne(R(-B, -B), R(B, B), 'v', l=1.4)
    S.ligne(R(-B, B), R(B, -B), 'v', l=1.4)
    xx = np.concatenate([-np.geomspace(B, 3e-3, 4000), np.geomspace(3e-3, B, 4000)])
    S.poly(R(xx, df(xx)), 't', l=1.4)
    for x in xk[:3]:
        S.point(R(x, df(x)), 'r', r=3.6)
    for y in yk[:3]:
        S.point(R(y, df(y)), 'r', r=3.6)
    S.texte(R(0.16, 0.16) + [-6, -12], 'y = x', 'v', ancre='end', taille=15)
    assert 0.05 < 0.2 - 0.1                                     # l'étiquette est loin des droites ±x
    S.texte(R(-0.05, -0.2) + [-4, 0], 'f′', 't', ancre='end', taille=17)
    return S


@schema('as-etude-locale')
def as_etude_locale():
    xs = np.linspace(-1.5, 1.5, 3001)
    nz = xs[np.abs(xs) > 1e-9]
    assert np.all(np.cos(nz) < 1)                                  # sous la tangente y = 1
    assert np.all((np.sin(nz) - nz) * np.sign(nz) < 0)             # sin x - x < 0 à droite, > 0 à gauche
    pos = np.linspace(0.05, 0.3, 50)
    assert np.all(np.abs((np.cos(pos) - 1) / (-pos ** 2 / 2) - 1) < 0.01)
    S = Schema(520, 270, 'Le cosinus sous sa tangente, le sinus qui traverse la sienne')
    R = Repere(-1.6, 1.6, -0.25, 1.35, 15, 20, 225, 225)
    _axes(S, R, -1.6, 1.6, -0.25, 1.33)
    S.ligne(R(-1.5, 1), R(1.5, 1), 'b', l=1.6)
    S.poly(R(xs, np.cos(xs)), 'r', l=2.2)
    S.poly(R(xs, 1 - xs ** 2 / 2), 'v', d=True, l=1.4)
    S.point(R(0, 1), 'r', r=4)
    S.texte(R(1.5, 1) + [0, -12], 'y = 1', 'b', ancre='end', taille=15)
    S.texte(R(1.2, math.cos(1.2)) + [10, 4], 'cos', 'r', ancre='start', taille=15, roman=True)
    R = Repere(-1.6, 1.6, -1.5, 1.5, 280, 20, 208, 225)
    _axes(S, R, -1.6, 1.6, -1.5, 1.48)
    S.ligne(R(-1.45, -1.45), R(1.45, 1.45), 'b', l=1.6)
    S.poly(R(xs, np.sin(xs)), 'r', l=2.2)
    S.point(R(0, 0), 'r', r=4)
    S.texte(R(1.3, 1.3) + [-6, -12], 'y = x', 'b', ancre='end', taille=15)
    S.texte(R(1.45, math.sin(1.45)) + [0, 18], 'sin', 'r', ancre='middle', taille=15, roman=True)
    return S


@schema('as-series')
def as_series():
    N = 16
    H = np.cumsum(1 / np.arange(1, N + 1))
    n = np.arange(1, N + 1)
    u = H - np.log(n)
    v = H - np.log(n + 1)
    g = 0.5772156649015329
    assert np.all(np.diff(u) < 0) and np.all(np.diff(v) > 0) and np.all(v < g) and np.all(g < u)
    assert np.allclose(u - v, np.log(1 + 1 / n))
    assert abs(u[0] - 1) < 1e-15 and abs(v[0] - (1 - math.log(2))) < 1e-15
    S = Schema(500, 300, 'H_n − ln n décroît et H_n − ln(n+1) croît vers γ')
    R = Repere(0, N + 1, 0.25, 1.05, 50, 20, 410, 240)
    S.fleche(R(0, 0.25), R(N + 1, 0.25), 'g')
    S.texte(R(N + 1, 0.25) + [8, 0], 'n', 'g', ancre='start', taille=15)
    S.fleche(R(0, 0.25), R(0, 1.05), 'g')
    for m in (1, 4, 8, 12, 16):
        S.ligne(R(m, 0.25) + [0, -3], R(m, 0.25) + [0, 3], 'g')
        S.texte(R(m, 0.25) + [0, 15], str(m), 'g', taille=13)
    for yv, lab in [(0.3, '0,3'), (0.5, '0,5'), (1.0, '1')]:
        S.ligne(R(0, yv) + [-3, 0], R(0, yv) + [3, 0], 'g')
        S.texte(R(0, yv) + [-8, 0], lab, 'g', ancre='end', taille=13)
    S.ligne(R(0.3, g), R(N + 0.6, g), 'g', d=True)
    S.texte(R(0.4, g) + [0, -13], 'γ', 'g', ancre='start', taille=17)
    for k in range(N):
        S.ligne(R(n[k], v[k]), R(n[k], u[k]), 'g', l=0.8)
        S.point(R(n[k], u[k]), 'r', r=3.6)
        S.point(R(n[k], v[k]), 'b', r=3.6)
    p = R(2, u[1]) + [10, -6]
    S.texte(p, 'H_n − `ln` n', 'r', ancre='start', taille=15)
    q = R(3, v[2]) + [10, 14]
    S.texte(q, 'H_n − `ln`(n+1)', 'b', ancre='start', taille=15)
    return S
