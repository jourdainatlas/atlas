"""Schémas des graphes de probabilités (proba) et de martingales (mart).

Ordre d'apparition : dans proba, exp, la loi de Poisson et la loi normale ne paraissent qu'aux nœuds
issus de l'entrée anc (p-poisson-exp, p-normale, p-tcl). Les simulations emploient
numpy.random.default_rng avec des graines écrites ici.
"""
from fractions import Fraction as Fr
from math import comb, factorial
import math
import re
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


def _tic_x(S, R, x, y, nom, c='g', taille=15, dy=17):
    S.ligne(R(x, y) + [0, -4], R(x, y) + [0, 4], c)
    S.texte(R(x, y) + [0, dy], nom, c, taille=taille)


def _tic_y(S, R, x, y, nom, c='g', taille=15, dx=-8):
    S.ligne(R(x, y) + [-4, 0], R(x, y) + [4, 0], c)
    S.texte(R(x, y) + [dx, 0], nom, c, ancre='end', taille=taille)


def _epaisseurs(S):
    """Les épaisseurs l=… de edifice_svg sont des attributs de présentation, que la feuille de style
    (.s-r { stroke-width: 2.2 } …) écrase ; on les convertit en style en ligne pour qu'elles comptent."""
    S.el = [re.sub(r' stroke-width="([0-9.]+)"', r' style="stroke-width:\1"', e) for e in S.el]
    return S


def _binom(n, p, k):
    return comb(n, k) * p ** k * (1 - p) ** (n - k)


# ---------------------------------------------------------------- proba

@schema('p-variables')
def p_variables():
    # À gauche : X = nombre de piles en deux lancers d'une pièce équilibrée, loi binomiale (2, 1/2).
    sauts = {0: Fr(1, 4), 1: Fr(1, 2), 2: Fr(1, 4)}
    assert sum(sauts.values()) == 1 and all(sauts[k] == comb(2, k) * Fr(1, 4) for k in sauts)
    F = lambda x: sum(v for k, v in sauts.items() if k <= x)      # P(X ≤ x)
    assert F(-0.5) == 0 and F(0) == Fr(1, 4) and F(1) == Fr(3, 4) and F(2) == 1
    S = Schema(520, 250, 'Fonction de répartition du nombre de piles en deux lancers, et de la loi uniforme sur [0, 1]')
    # panneau gauche
    R = Repere(-0.9, 2.9, -0.12, 1.12, 34, 26, 220, 170)
    S.fleche(R(-0.9, 0), R(2.9, 0) + [6, 0], 'g')
    S.fleche(R(0, -0.12), R(0, 1.12) + [0, -6], 'g')
    S.texte(R(2.9, 0) + [10, -12], 'x', 'g', ancre='start')
    S.ligne(R(0, 1), R(2.9, 1), 'g', d=True)
    _tic_y(S, R, 0, 1, '1', dx=-8)
    bornes = [-0.9, 0, 1, 2, 2.9]
    for g_, d_ in zip(bornes[:-1], bornes[1:]):
        v = float(F(g_))
        S.ligne(R(g_, v), R(d_, v), 'r', l=2.6)
    for k in (0, 1, 2):
        bas, haut = float(F(k - 0.5)), float(F(k))
        S.ligne(R(k, bas), R(k, haut), 'g', d=True)
        S.point(R(k, bas), 'r', r=4, creux=True)
        S.point(R(k, haut), 'r', r=4.2)
        S.texte(R(k, (bas + haut) / 2) + [7, 0], {0: '1/4', 1: '1/2', 2: '1/4'}[k], 'g', ancre='start', taille=15)
        if k:
            _tic_x(S, R, k, 0, str(k))
    S.texte(R(-0.08, 0) + [0, 17], '0', 'g', ancre='end', taille=15)
    S.texte(R(-0.55, 0.62), 'F_X', 'r')
    S.texte((145, 236), 'deux lancers', ui=True)
    # panneau droit : loi uniforme sur [0, 1], F(x) = x sur [0, 1]
    R = Repere(-0.6, 1.6, -0.12, 1.12, 300, 26, 190, 170)
    S.fleche(R(-0.6, 0), R(1.6, 0) + [6, 0], 'g')
    S.fleche(R(0, -0.12), R(0, 1.12) + [0, -6], 'g')
    S.texte(R(1.6, 0) + [10, -12], 'x', 'g', ancre='start')
    S.ligne(R(0, 1), R(1.6, 1), 'g', d=True)
    _tic_y(S, R, 0, 1, '1', dx=-8)
    S.poly([R(-0.6, 0), R(0, 0), R(1, 1), R(1.6, 1)], 'b', l=2.6)
    S.texte(R(-0.08, 0) + [0, 17], '0', 'g', ancre='end', taille=15)
    _tic_x(S, R, 1, 0, '1')
    S.texte(R(0.62, 0.42) + [8, 0], 'F', 'b', ancre='start')
    S.texte((395, 236), 'loi uniforme sur [0, 1]', ui=True)
    return _epaisseurs(S)


@schema('p-loi-faible')
def p_loi_faible():
    x, d = Fr(3, 10), Fr(15, 100)
    S = Schema(520, 410, 'Poids binomiaux de B_n f(x) pour x = 0,3 et n = 10, 100 ; fenêtre [x − δ, x + δ]')
    hauts = {10: (16, 150), 100: (222, 150)}
    for n, (y0, H) in hauts.items():
        poids = [comb(n, k) * x ** k * (1 - x) ** (n - k) for k in range(n + 1)]
        assert sum(poids) == 1
        dehors = sum(p for k, p in enumerate(poids) if abs(Fr(k, n) - x) >= d)
        borne = x * (1 - x) / (n * d * d)                 # Bienaymé-Tchebychev, σ² = x(1 − x)
        assert dehors <= borne <= Fr(1, 4) / (n * d * d)
        val = {10: ('0,300', '0,933'), 100: ('0,0015', '0,0933')}[n]
        assert abs(float(dehors) - float(val[0].replace(',', '.'))) < 5e-4 * (1 if n == 10 else 0.1)
        assert abs(float(borne) - float(val[1].replace(',', '.'))) < 5e-4
        pmax = float(max(poids))
        R = Repere(-0.04, 1.04, 0, pmax * 1.1, 30, y0, 460, H)
        S.rect(*R(float(x - d), pmax * 1.1), float(2 * d) / 1.08 * 460, H, 'g', d=True, rempli='g')
        S.ligne(R(-0.04, 0), R(1.04, 0), 'g')
        lw = 4 if n == 10 else 2.4
        for k, p in enumerate(poids):
            dans = abs(Fr(k, n) - x) < d
            if p > 0:
                S.ligne(R(k / n, 0), R(k / n, float(p)), 'b' if dans else 'r', l=lw)
        for t, nom in [(0, '0'), (1, '1')]:
            _tic_x(S, R, t, 0, nom)
        _tic_x(S, R, float(x), 0, 'x', c='t')
        S.texte(R(float(x - d), 0) + [0, 17], 'x − δ', 'g', taille=15, ancre='end')
        S.texte(R(float(x + d), 0) + [0, 17], 'x + δ', 'g', taille=15, ancre='start')
        S.texte(R(0.58, pmax * 0.95), f'n = {n}', ancre='start')
        S.texte(R(0.58, pmax * 0.62), f'`hors fenêtre :` {val[0]}', 'r', ancre='start', taille=15)
        S.texte(R(0.58, pmax * 0.34), f'`borne` x(1 − x)/(nδ^2) = {val[1]}', 'g', ancre='start', taille=15)
    return _epaisseurs(S)


def _bernstein(fn, n, xs):
    k = np.arange(n + 1)
    c = np.array([comb(n, int(j)) for j in k], float)
    xs = np.asarray(xs, float)[:, None]
    return (c * fn(k / n) * xs ** k * (1 - xs) ** (n - k)).sum(axis=1)


@schema('p-loi-faible-2')
def p_loi_faible_2():
    fn = lambda t: np.abs(t - 0.5)
    e10 = sum(Fr(comb(10, k), 2 ** 10) * abs(Fr(k, 10) - Fr(1, 2)) for k in range(11))
    e100 = sum(Fr(comb(100, k), 2 ** 100) * abs(Fr(k, 100) - Fr(1, 2)) for k in range(101))
    assert round(float(e10), 3) == 0.123 and round(float(e100), 3) == 0.040
    assert abs(_bernstein(fn, 10, [0.5])[0] - float(e10)) < 1e-12
    S = Schema(520, 320, 'f(x) = |x − 1/2| et ses polynômes de Bernstein B_10 f et B_100 f')
    R = Repere(-0.05, 1.08, -0.04, 0.56, 40, 18, 450, 260)
    S.fleche(R(-0.05, 0), R(1.08, 0) + [6, 0], 'g')
    S.fleche(R(0, -0.04), R(0, 0.56) + [0, -6], 'g')
    for t, nom in [(0.5, '1/2'), (1, '1')]:
        _tic_x(S, R, t, 0, nom)
    _tic_y(S, R, 0, 0.5, '1/2')
    xs = np.linspace(0, 1, 401)
    S.poly(R(xs, fn(xs)), 't', l=2)
    S.poly(R(xs, _bernstein(fn, 10, xs)), 'b')
    S.poly(R(xs, _bernstein(fn, 100, xs)), 'v')
    # écarts en 1/2, lus par des repères horizontaux sous la branche gauche de f
    for e, nom in [(float(e10), '0,123'), (float(e100), '0,040')]:
        assert e < 0.5 - 0.3                         # le repère passe sous f sur [0, 0,3]
        S.ligne(R(0.3, e), R(0.5, e), 'g', d=True, l=1)
        S.ligne(R(0.5, 0), R(0.5, e), 'r', l=2.6)
        S.point(R(0.5, e), 'r', r=3.6)
        S.texte(R(0.3, e) + [-6, 0], nom, 'r', ancre='end', taille=15)
    S.texte(R(0.92, 0.42) + [10, 8], 'f', ancre='start')
    x10 = 0.7
    S.texte(R(x10, _bernstein(fn, 10, [x10])[0]) + [-12, -12], 'B_{10}f', 'b', ancre='end')
    x100 = 0.82
    S.texte(R(x100, _bernstein(fn, 100, [x100])[0]) + [10, 12], 'B_{100}f', 'v', ancre='start')
    return _epaisseurs(S)


@schema('p-convergences')
def p_convergences():
    # n = 2^j + i, 0 ≤ i < 2^j, X_n = indicatrice de [i 2^-j, (i+1) 2^-j[ (preuve (iv)).
    def intervalle(n):
        j = n.bit_length() - 1
        i = n - 2 ** j
        assert 0 <= i < 2 ** j
        return Fr(i, 2 ** j), Fr(i + 1, 2 ** j)
    om = Fr(7, 10)
    rencontres = [n for n in range(1, 16) if intervalle(n)[0] <= om < intervalle(n)[1]]
    assert rencontres == [1, 3, 6, 13]
    S = Schema(500, 390, 'Machine à écrire : intervalles où X_n = 1 pour n = 1 à 15')
    x0, L = 70, 400
    X = lambda t: x0 + float(t) * L
    Y = lambda n: 40 + (n - 1) * 20.5
    S.texte((44, Y(1) - 24), 'n', 'g', taille=15)
    for n in range(1, 16):
        a, b = intervalle(n)
        sous = n in (1, 2, 4, 8)
        S.ligne((X(0), Y(n)), (X(1), Y(n)), 'g', l=0.6)
        S.ligne((X(a), Y(n)), (X(b), Y(n)), 'r' if sous else 't', l=6)
        S.texte((44, Y(n)), str(n), 'r' if sous else 'g', taille=15)
    yb = Y(15) + 22
    S.ligne((X(0), yb), (X(1), yb), 'g')
    for t, nom in [(0, '0'), (Fr(1, 2), '1/2'), (1, '1')]:
        S.ligne((X(t), yb - 4), (X(t), yb + 4), 'g')
        S.texte((X(t), yb + 17), nom, 'g', taille=15)
    S.ligne((X(om), Y(1) - 14), (X(om), yb), 'b', d=True)
    S.texte((X(om), yb + 17), 'ω', 'b')
    for n in rencontres:
        S.point((X(om), Y(n)), 'b', r=4.4)
    return _epaisseurs(S)


@schema('p-poisson-exp')
def p_poisson_exp():
    lam = 2.0
    ks = range(9)
    lois = [('B(10 ; 0,2)', 'v', [_binom(10, 0.2, k) for k in ks]),
            ('B(100 ; 0,02)', 'b', [_binom(100, 0.02, k) for k in ks]),
            ('`Poisson` (2)', 'r', [math.exp(-lam) * lam ** k / factorial(k) for k in ks])]
    # valeurs citées par la remarque (n = 100, λ = 2)
    assert [round(v, 4) for v in lois[1][2][:4]] == [0.1326, 0.2707, 0.2734, 0.1823]
    assert [round(v, 4) for v in lois[2][2][:4]] == [0.1353, 0.2707, 0.2707, 0.1804]
    S = Schema(520, 316, 'Lois binomiales B(10 ; 0,2), B(100 ; 0,02) et loi de Poisson de paramètre 2, pour k = 0 à 8')
    R = Repere(-0.6, 8.6, 0, 0.33, 50, 20, 450, 240)
    S.ligne(R(-0.6, 0), R(8.6, 0), 'g')
    S.fleche(R(-0.6, 0), R(-0.6, 0.33) + [0, -6], 'g')
    for v in (0.1, 0.2, 0.3):
        _tic_y(S, R, -0.6, v, f'{v:.1f}'.replace('.', ','))
        S.ligne(R(-0.6, v), R(8.6, v), 'g', l=0.4)
    for k in ks:
        S.texte(R(k, 0) + [0, 17], str(k), 'g', taille=15)
        for j, (_, c, val) in enumerate(lois):
            xk = k + (j - 1) * 0.24
            S.ligne(R(xk, 0), R(xk, val[k]), c, l=5)
    for j, (nom, c, _) in enumerate(lois):
        p = R(5.4, 0.282 - j * 0.03)
        S.ligne(p, p + [18, 0], c, l=5)
        S.texte(p + [26, 0], nom, c, ancre='start', taille=15)
    S.texte(R(8.6, 0) + [8, 17], 'k', 'g', ancre='start')
    return _epaisseurs(S)


@schema('p-normale')
def p_normale():
    dens = lambda m, s2: (lambda x: np.exp(-(x - m) ** 2 / (2 * s2)) / np.sqrt(2 * np.pi * s2))
    lois = [(0, 1, 'r', '𝒩(0, 1)'), (0, 4, 'b', '𝒩(0, 4)'), (2, 0.25, 'v', '𝒩(2, 1/4)')]
    sommets = {nom: 1 / math.sqrt(2 * math.pi * s2) for m, s2, c, nom in lois}
    assert abs(sommets['𝒩(2, 1/4)'] - 0.7979) < 1e-4 and abs(sommets['𝒩(0, 4)'] - 0.1995) < 1e-4
    S = Schema(520, 300, 'Densités des lois normales N(0, 1), N(0, 4) et N(2, 1/4)')
    R = Repere(-5.2, 5.2, 0, 0.86, 50, 16, 440, 246)
    S.fleche(R(-5.2, 0), R(5.2, 0) + [6, 0], 'g')
    S.fleche(R(-5.2, 0), R(-5.2, 0.86) + [0, -6], 'g')
    S.texte(R(5.2, 0) + [10, -12], 'x', 'g', ancre='start')
    for t in (-4, -2, 0, 2, 4):
        _tic_x(S, R, t, 0, str(t).replace('-', '−'))
    for v in (0.2, 0.4, 0.6, 0.8):
        _tic_y(S, R, -5.2, v, f'{v:.1f}'.replace('.', ','))
    for m, s2, c, nom in lois:
        R.graphe(S, dens(m, s2), c=c, n=500, l=2.2)
    S.texte(R(-1.15, dens(0, 1)(-1.15)) + [-8, -6], '𝒩(0, 1)', 'r', ancre='end', taille=16)
    S.texte(R(-3.4, dens(0, 4)(-3.4)) + [-4, -16], '𝒩(0, 4)', 'b', ancre='middle', taille=16)
    S.texte(R(2.42, dens(2, .25)(2.42)) + [8, -6], '𝒩(2, 1/4)', 'v', ancre='start', taille=16)
    return _epaisseurs(S)


@schema('p-tcl')
def p_tcl():
    import sympy as sp
    u = sp.symbols('u')
    hs = 1 - 35 * u**4 + 84 * u**5 - 70 * u**6 + 20 * u**7
    for j in range(4):
        assert sp.diff(hs, u, j).subs(u, 1) == 0 and sp.diff(hs, u, j).subs(u, 0) == (1 if j == 0 else 0)
    assert sp.factor(sp.diff(hs, u)) == 140 * u**3 * (u - 1)**3          # décroissante sur [0, 1]
    h = sp.lambdify(u, hs, 'numpy')
    x, eps = 0.0, 1.0
    fe = lambda y: np.where(y <= x, 1.0, np.where(y >= x + eps, 0.0, h(np.clip((y - x) / eps, 0, 1))))
    ys = np.linspace(-1.2, 2.4, 721)
    assert np.all(((ys <= x) <= fe(ys) + 1e-12) & (fe(ys) <= (ys <= x + eps) + 1e-12))
    S = Schema(500, 250, 'Les indicatrices de ]−∞, x] et ]−∞, x + ε] encadrent la fonction régulière f_ε')
    R = Repere(-1.3, 2.5, -0.12, 1.2, 30, 16, 440, 200)
    S.surface([R(x, 0), R(x + eps, 0), R(x + eps, 1), R(x, 1)], 'g')
    S.fleche(R(-1.3, 0), R(2.5, 0) + [6, 0], 'g')
    S.texte(R(2.5, 0) + [10, -12], 'y', 'g', ancre='start')
    S.ligne(R(-1.3, 1), R(x, 1), 'b', l=2)
    S.ligne(R(x, 1), R(x, 0), 'b', d=True)
    S.point(R(x, 1), 'b', r=4.2)
    S.point(R(x, 0), 'b', r=4, creux=True)
    S.ligne(R(x, 1), R(x + eps, 1), 'v', l=2)
    S.ligne(R(x + eps, 1), R(x + eps, 0), 'v', d=True)
    S.point(R(x + eps, 1), 'v', r=4.2)
    S.point(R(x + eps, 0), 'v', r=4, creux=True)
    S.ligne(R(x + eps, 0), R(2.5, 0), 'v', l=2)
    xs = np.linspace(-1.3, 2.4, 600)
    S.poly(R(xs, fe(xs)), 'r', l=2.4)
    S.point(R(x, 0), 'b', r=4, creux=True)
    S.texte(R(x, 0) + [0, 18], 'x', 'b')
    S.texte(R(x + eps, 0) + [0, 18], 'x + ε', 'v')
    S.texte(R(-1.3, 1) + [-6, 0], '1', 'g', ancre='end', taille=15)
    S.texte(R(-0.65, 1) + [0, -16], '1_{y ≤ x}', 'b', taille=16)
    S.texte(R(1.5, 1) + [0, -16], '1_{y ≤ x + ε}', 'v', taille=16, ancre='start')
    S.texte(R(0.62, float(fe(np.array(0.62)))) + [10, -4], 'f_ε', 'r', ancre='start')
    return _epaisseurs(S)


# ---------------------------------------------------------------- mart

@schema('mt-conditionnelle')
def mt_conditionnelle():
    # Ω = [0, 1[ muni de la mesure de Lebesgue, X(ω) = ω², partition [0, 1/2[, [1/2, 3/4[, [3/4, 1[.
    bornes = [Fr(0), Fr(1, 2), Fr(3, 4), Fr(1)]
    moy = [(b ** 3 - a ** 3) / 3 / (b - a) for a, b in zip(bornes, bornes[1:])]
    assert moy == [Fr(1, 12), Fr(19, 48), Fr(37, 48)]
    S = Schema(500, 320, 'X(ω) = ω² sur [0, 1[ et son espérance conditionnelle sachant une partition en trois intervalles')
    R = Repere(-0.04, 1.08, -0.05, 1.08, 40, 16, 440, 260)
    S.fleche(R(-0.04, 0), R(1.08, 0) + [6, 0], 'g')
    S.fleche(R(0, -0.05), R(0, 1.08) + [0, -6], 'g')
    S.texte(R(1.08, 0) + [10, -12], 'ω', 'g', ancre='start')
    noms = ['1/12', '19/48', '37/48']
    for i, (a, b) in enumerate(zip(bornes, bornes[1:])):
        a_, b_, m = float(a), float(b), float(moy[i])
        r = math.sqrt(m)                                   # ω² = m au point r de ]a, b[
        assert a_ < r < b_
        haut = np.linspace(r, b_, 80)
        bas = np.linspace(a_, r, 80)
        # aires égales de part et d'autre du palier
        A1 = m * (r - a_) - (r ** 3 - a_ ** 3) / 3
        A2 = (b_ ** 3 - r ** 3) / 3 - m * (b_ - r)
        assert abs(A1 - A2) < 1e-12
        S.surface(np.vstack([R(bas, bas ** 2), R(bas[::-1], np.full(80, m))]), 'b')
        S.surface(np.vstack([R(haut, haut ** 2), R(haut[::-1], np.full(80, m))]), 'b')
        S.ligne(R(a_, m), R(b_, m), 'r', l=3)
        S.texte(R(a_, m) + [8, -14], noms[i], 'r', ancre='start', taille=15)
        if i:
            S.ligne(R(a_, 0), R(a_, 1.02), 'g', d=True)
        S.texte(R((a_ + b_) / 2, 0) + [0, 18], f'B_{i + 1}', 'g', taille=16)
    S.ligne(R(1, 0), R(1, 1.02), 'g', d=True)
    S.texte(R(1, 0) + [6, 18], '1', 'g', taille=15, ancre='start')
    xs = np.linspace(0, 1, 300)
    S.poly(R(xs, xs ** 2), 't', l=2)
    S.texte(R(0.45, 0.2025) + [-8, -12], 'X', ancre='end')
    S.texte(R(0.2, 0.62), 'E[X | 𝒢]', 'r')
    S.ligne(R(0.22, 0.56), R(0.4, float(moy[0])) + [0, -4], 'g', l=0.8)
    return _epaisseurs(S)


@schema('mt-conditionnelle-2')
def mt_conditionnelle_2():
    # L²(𝒢) ⊂ L²(ℋ) : une droite D dans un plan P de ℝ³ ; X hors du plan.
    X = np.array([1.7, 1.3, 2.5])
    u = np.array([1.0, -0.35, 0.0]); u /= np.linalg.norm(u)      # direction de L²(𝒢), dans z = 0
    pH = np.array([X[0], X[1], 0.0])                              # projection sur le plan z = 0
    pG = (pH @ u) * u
    assert np.allclose(pG, (X @ u) * u)                           # emboîtement
    assert abs((X - pH) @ np.array([1, 0, 0])) < 1e-12 and abs((pH - pG) @ u) < 1e-12
    assert abs((X - pH) @ np.array([0, 1, 0])) < 1e-12 and abs((X - pG) @ u) < 1e-12
    th = math.radians(38)
    M = np.array([[1.0, math.cos(th) * 0.75, 0.0], [0.0, math.sin(th) * 0.75, -1.0]])
    plan = [(-1.1, -1.0, 0), (2.4, -1.0, 0), (2.4, 1.7, 0), (-1.1, 1.7, 0)]
    boite = np.array([M @ np.asarray(v, float) for v in plan + [tuple(X)]])
    lo, hi = boite.min(axis=0), boite.max(axis=0)
    k = min(430 / (hi[0] - lo[0]), 300 / (hi[1] - lo[1]))       # marges pour les étiquettes
    o = np.array([45, 24]) - k * lo
    P = lambda v: o + k * (M @ np.asarray(v, float))
    S = Schema(520, 24 + k * (hi[1] - lo[1]) + 16, 'Projections orthogonales successives sur L²(ℋ) puis sur L²(𝒢)')
    S.poly([P(p) for p in plan], 'g', ferme=True, rempli='g')
    S.ligne(P(-1.05 * u), P(2.2 * u), "b", l=2)
    S.fleche(P((0, 0, 0)), P(X), 't', l=2)
    S.ligne(P(X), P(pH), 'g', d=True)
    S.ligne(P(pH), P(pG), 'g', d=True)
    S.ligne(P(X), P(pG), 'r', d=True)
    def angle(c, a, b, s=0.2):
        a = (a - c) / np.linalg.norm(a - c) * s
        b = (b - c) / np.linalg.norm(b - c) * s
        S.poly([P(c + a), P(c + a + b), P(c + b)], 'g', l=1)
    angle(pH, X, pG)
    angle(pG, pH, np.zeros(3))
    S.point(P((0, 0, 0)), 't')
    S.point(P(X), 't', r=3.6)
    S.point(P(pH), 'b', r=4)
    S.point(P(pG), 'r', r=4.4)
    S.texte(P(X) + [10, -4], 'X', ancre='start')
    S.texte(P(pH) + [12, -14], 'E[X | ℋ]', 'b', ancre='start', taille=16)
    S.texte(P(pG) + [-6, 26], 'E[X | 𝒢]', 'r', ancre='end', taille=16)
    S.texte(P((0, 0, 0)) + [-2, -16], '0', ancre='end', taille=15)
    S.texte(P((-1.1, -1.0, 0)) + [34, 16], 'L^2(ℋ)', 'g', ancre='start', taille=16)
    S.texte(P(-1.05 * u) + [-2, 18], 'L^2(𝒢)', 'b', ancre='start', taille=16)
    return _epaisseurs(S)


def _marche(graine=12, n=60):
    rng = np.random.default_rng(graine)
    e = rng.choice([-1, 1], size=n)
    return np.concatenate([[0], np.cumsum(e)])


def _proba_max(n, a):
    """P(max_{k ≤ n} |S_k| ≥ a) pour la marche simple symétrique, calcul exact."""
    loi = {0: Fr(1)}
    atteint = Fr(0)
    for _ in range(n):
        nv = {}
        for s, p in loi.items():
            for t in (s - 1, s + 1):
                if abs(t) >= a:
                    atteint += p / 2
                else:
                    nv[t] = nv.get(t, 0) + p / 2
        loi = nv
    return atteint


@schema('mt-doob')
def mt_doob():
    n, a = 60, 8
    M = _marche(12, n)
    T = int(np.nonzero(np.abs(M) >= a)[0][0])
    assert T == 32 and M[T] == -a and abs(M[-1]) < a and np.all(np.abs(M[:T]) < a)
    p = _proba_max(n, a)
    assert round(float(p), 3) == 0.608 and p <= Fr(n, a * a) == Fr(15, 16)   # 0,608 ≤ 0,9375
    S = Schema(520, 300, 'Marche aléatoire simple, niveaux ±a et premier instant T où |M_k| ≥ a')
    R = Repere(-1, 63, -11, 11, 40, 18, 450, 250)
    S.fleche(R(-1, 0), R(63, 0) + [6, 0], 'g')
    S.texte(R(63, 0) + [10, -12], 'k', 'g', ancre='start')
    S.ligne(R(0, -11), R(0, 11), 'g')
    for s, nom in [(a, 'a'), (-a, '−a')]:
        S.ligne(R(0, s), R(62, s), 'g', d=True)
        S.texte(R(0, s) + [-8, 0], nom, 'g', ancre='end')
    ks = np.arange(n + 1)
    S.poly(R(ks[T:], M[T:]), 'g', l=1.2)
    S.poly(R(ks[:T + 1], M[:T + 1]), 't', l=2)
    S.ligne(R(T, M[T]), R(T, 0), 'r', d=True)
    S.point(R(T, M[T]), 'r', r=4.6)
    S.texte(R(T, 0) + [10, -12], 'T', 'r', ancre='start')
    S.texte(R(T, M[T]) + [10, 14], 'M_T', 'r', ancre='start')
    _tic_x(S, R, n, 0, str(n), dy=-16)
    S.texte(R(0, 0) + [-8, 0], '0', 'g', ancre='end', taille=15)
    S.texte(R(4, M[4]) + [0, -18], 'M_k')
    return _epaisseurs(S)


@schema('mt-applications')
def mt_applications():
    # Urne de Pólya selon la fiche : tirage n + 1 rouge si U_{n+1} ≤ X_n, X_n = R_n/(n + 2), R_0 = 1.
    N = 500
    rng = np.random.default_rng(2024)
    U = rng.random((6, N))
    traj = []
    for j in range(6):
        Rn = 1
        X = [Fr(1, 2)]
        for n in range(N):
            if U[j, n] <= X[-1]:
                Rn += 1
            X.append(Fr(Rn, n + 3))
        traj.append(np.array([float(v) for v in X]))
    fins = sorted(t[-1] for t in traj)
    assert fins[-1] - fins[0] > 0.5                     # limites nettement différentes
    S = Schema(520, 300, "Six trajectoires de la proportion de boules rouges dans l'urne de Pólya")
    lg = lambda n: np.log10(np.asarray(n, float) + 1)
    R = Repere(0, lg(N), 0, 1, 50, 18, 440, 240)
    S.ligne(R(0, 0), R(lg(N), 0), 'g')
    S.ligne(R(0, 0), R(0, 1), 'g')
    for v, nom in [(0, '0'), (0.5, '1/2'), (1, '1')]:
        _tic_y(S, R, 0, v, nom)
    S.ligne(R(0, 1), R(lg(N), 1), 'g', l=0.5)
    for n in (1, 10, 100, 500):
        _tic_x(S, R, lg(n), 0, str(n))
    S.texte(R(0, 0) + [0, 17], '0', 'g', taille=15)
    S.texte(R(lg(N), 0) + [8, 34], 'n', 'g', ancre='end')
    ns = np.arange(N + 1)
    for t in traj:
        S.poly(R(lg(ns), t), 'r', l=1.4)
        S.point(R(lg(N), t[-1]), 'r', r=3.4)
    S.texte(R(0.35, 0.93), 'X_n', 'r', ancre='end')
    return _epaisseurs(S)


@schema('mt-applications-2')
def mt_applications_2():
    N = 200
    rng = np.random.default_rng(7)
    eps = rng.choice([-1, 1], size=(4, N))
    k = np.arange(1, N + 1)
    sommes = np.cumsum(eps / k, axis=1)
    alt = np.cumsum((-1.0) ** (k + 1) / k)
    assert abs(alt[-1] - math.log(2)) < 1 / N
    fins = np.sort(sommes[:, -1])
    assert np.min(np.diff(fins)) > 0.1                 # quatre limites distinctes
    lo = min(sommes.min(), alt.min(), -1.6)
    hi = max(sommes.max(), alt.max(), 1.6)
    S = Schema(520, 300, 'Sommes partielles de quatre séries harmoniques à signes aléatoires et de la série alternée')
    R = Repere(0, N + 4, lo - 0.15, hi + 0.1, 50, 16, 440, 250)
    bas = lo - 0.15
    S.ligne(R(0, bas), R(N + 4, bas), 'g')
    S.texte(R(N + 4, bas) + [8, 17], 'n', 'g', ancre='start')
    S.ligne(R(0, bas), R(0, hi + 0.1), 'g')
    S.ligne(R(0, 0), R(N + 4, 0), 'g', l=0.6)
    for v in (-1, 0, 1):
        _tic_y(S, R, 0, v, str(v).replace('-', '−'))
    for n in (1, 50, 100, 150, 200):
        _tic_x(S, R, n, bas, str(n))
    xs = np.concatenate([[0], k])
    for s in sommes:
        S.poly(R(xs, np.concatenate([[0], s])), 'r', l=1.5)
    S.poly(R(xs, np.concatenate([[0], alt])), 't', d=True, l=1.6)
    return _epaisseurs(S)


@schema('p-suites-iid')
def p_suites_iid():
    # d_k va à U_m, où 2^m est la plus grande puissance de 2 qui divise k (k = 2^m (2j + 1)).
    def v2(k):
        m = 0
        while k % 2 == 0:
            k //= 2; m += 1
        return m
    K = 24
    groupes = {}
    for k in range(1, K + 1):
        groupes.setdefault(v2(k), []).append(k)
    assert groupes[0] == list(range(1, 25, 2)) and groupes[1] == [2, 6, 10, 14, 18, 22] and groupes[2] == [4, 12, 20]
    assert groupes[3] == [8, 24] and groupes[4] == [16]
    couleurs = {0: 'r', 1: 'b', 2: 'v', 3: 'o', 4: 't'}
    S = Schema(560, 156, 'Répartition des chiffres binaires d_k entre les variables U_m')
    pas, x0, y0 = 21.5, 26, 40
    for k in range(1, K + 1):
        c = couleurs[v2(k)]
        x = x0 + (k - 1) * pas
        S.rect(x - 9, y0 - 12, 18, 24, c, rempli=c, rx=3)
        S.texte([x, y0 + 26], str(k), 'g', taille=11, ui=True)
    S.texte([x0 + K * pas, y0], '…', 'g', taille=16)
    S.texte([x0 - 4, y0 + 46], 'indice k', 'g', ancre='start', taille=12, ui=True)
    for i, (m, c) in enumerate(couleurs.items()):
        x = 40 + i * 104
        S.rect(x - 8, 132 - 8, 16, 16, c, rempli=c, rx=3)
        S.texte([x + 14, 132], f'U_{m}', c, ancre='start', taille=15)
    return S
