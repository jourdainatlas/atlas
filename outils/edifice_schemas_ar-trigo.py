"""Schémas du graphe intérieur ar-trigo (chapitre « Fonctions trigonométriques »).

Toute position est calculée ; toute affirmation illustrée est vérifiée par un assert.
Les fonctions trigonométriques sont calculées ici à partir de leur construction dans le chapitre
(arc tangente, puis c = 1/sqrt(1 + tan^2), s = tan · c, puis recollement f(x + π) = −f(x)),
et comparées à numpy.
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, arc

PI = math.pi


def _arctan_integrale(x, n=4001):
    """arctan x = intégrale de 0 à x de dt/(1 + t²), par la méthode de Simpson."""
    t = np.linspace(0.0, x, n)
    g = 1.0 / (1.0 + t ** 2)
    h = x / (n - 1)
    return h / 3 * (g[0] + g[-1] + 4 * g[1:-1:2].sum() + 2 * g[2:-1:2].sum())


def _c(y):
    return 1.0 / np.sqrt(1.0 + np.tan(y) ** 2)


def _s(y):
    return np.tan(y) * _c(y)


def _cbar(y):
    """Prolongement continu de c à [−π/2, π/2]."""
    y = np.asarray(y, float)
    out = np.zeros_like(y)
    dedans = np.abs(y) < PI / 2
    out[dedans] = _c(y[dedans])
    return out


def _sbar(y):
    y = np.asarray(y, float)
    out = np.sign(y)
    dedans = np.abs(y) < PI / 2
    out[dedans] = _s(y[dedans])
    return out


def _k(x):
    """Plus grand entier k tel que kπ − π/2 ⩽ x."""
    return np.floor((np.asarray(x, float) + PI / 2) / PI)


def _cos_recolle(x):
    k = _k(x)
    return (-1.0) ** k * _cbar(np.asarray(x, float) - k * PI)


def _sin_recolle(x):
    k = _k(x)
    return (-1.0) ** k * _sbar(np.asarray(x, float) - k * PI)


@schema('tg-arctan')
def tg_arctan():
    # arc tangente par l'intégrale, comparée à numpy
    for x in (-5.0, -1.0, 0.5, 1.0, 3.0, 6.0):
        assert abs(_arctan_integrale(x) - math.atan(x)) < 1e-10
    h = lambda x: np.arctan(x) + 1 / x
    xs = np.linspace(1, 6, 600)
    assert np.all(np.diff(h(xs)) < 0)                      # h décroît sur [1, +∞[
    assert np.all(h(xs) > np.arctan(xs))                   # arctan < h
    assert np.all(np.arctan(xs) < PI / 2) and PI / 2 < h(1.0) < 2
    assert abs(h(1.0) - (1 + PI / 4)) < 1e-12
    S = Schema(520, 300, 'Arc tangente, majorée par 2, et son asymptote π/2')
    R = Repere(-6.2, 6.4, -2.2, 2.35, 62, 14, 430, 262)
    S.fleche(R(-6.2, 0), R(6.4, 0), 'g')
    S.texte(R(6.4, 0) + [8, 0], 'x', 'g', ancre='start')
    S.fleche(R(0, -2.2), R(0, 2.35), 'g')
    for y0, txt in ((PI / 2, 'π/2'), (-PI / 2, '−π/2')):
        S.ligne(R(-6.2, y0), R(6.4, y0), 'g', d=True)
    S.texte(R(-6.2, PI / 2) + [-6, 0], 'π/2', 'g', ancre='end', taille=16)
    S.texte(R(-6.2, -PI / 2) + [-6, 0], '−π/2', 'g', ancre='end', taille=16)
    S.ligne(R(0, 2), R(6.4, 2), 'g', d=True)
    S.texte(R(0, 2) + [-8, 0], '2', 'g', ancre='end', taille=16)
    R.graphe(S, np.arctan, -6.2, 6.4, 'r', l=2.4)
    S.texte(R(-4.6, math.atan(-4.6)) + [0, 18], 'arctan', 'r', ui=True, taille=16)
    R.graphe(S, h, 1, 6.4, 'b', l=1.8)
    S.point(R(1, h(1.0)), 'b', r=4)
    S.point(R(1, math.atan(1)), 'r', r=4)
    S.ligne(R(1, 0), R(1, h(1.0)), 'g', d=True)
    S.texte(R(1, 0) + [0, 17], '1', 'g', taille=16)
    S.texte(R(4.6, h(4.6)) + [0, -16], 'h', 'b')
    return S


@schema('tg-tangente')
def tg_tangente():
    ys = np.linspace(-PI / 2 + 1e-6, PI / 2 - 1e-6, 2001)
    assert np.allclose(_c(ys), np.cos(ys), atol=1e-9) and np.allclose(_s(ys), np.sin(ys), atol=1e-9)
    assert np.all(_c(ys) > 0) and np.allclose(_c(ys) ** 2 + _s(ys) ** 2, 1)
    # limites aux bords : c → 0, s → ±1
    assert _c(PI / 2 - 1e-6) < 1e-5 and abs(_s(PI / 2 - 1e-6) - 1) < 1e-10
    assert _c(-PI / 2 + 1e-6) < 1e-5 and abs(_s(-PI / 2 + 1e-6) + 1) < 1e-10
    S = Schema(500, 320, 'Tangente, c et s sur ]−π/2, π/2['
               )
    ymax = 2.6
    R = Repere(-2.05, 2.15, -ymax, ymax, 40, 10, 420, 290)
    S.fleche(R(-2.05, 0), R(2.15, 0), 'g')
    S.texte(R(2.15, 0) + [8, 0], 'y', 'g', ancre='start')
    S.fleche(R(0, -ymax), R(0, ymax), 'g')
    for a in (-PI / 2, PI / 2):
        S.ligne(R(a, -ymax), R(a, ymax), 'g', d=True)
    S.texte(R(PI / 2, 0) + [12, 16], 'π/2', 'g', ancre='start', taille=16)
    S.texte(R(-PI / 2, 0) + [-10, 16], '−π/2', 'g', ancre='end', taille=16)
    yb = math.atan(ymax)
    assert abs(math.tan(yb) - ymax) < 1e-12
    R.graphe(S, np.tan, -yb, yb, 't', l=1.8)
    S.texte(R(yb, ymax) + [-10, 4], 'tan', 't', ancre='end', ui=True, taille=16)
    R.graphe(S, _c, -PI / 2 + 1e-4, PI / 2 - 1e-4, 'r', l=2.4)
    R.graphe(S, _s, -PI / 2 + 1e-4, PI / 2 - 1e-4, 'b', l=2.2)
    for a, sv in ((PI / 2, 1.0), (-PI / 2, -1.0)):
        S.point(R(a, 0), 'r', r=4.2, creux=True)
        S.point(R(a, sv), 'b', r=4.2, creux=True)
    S.texte(R(0, 1) + [0, -14], 'c', 'r')
    S.texte(R(-0.75, _s(-0.75)) + [-4, 18], 's', 'b', ancre='start')
    return S


@schema('tg-prolongement')
def tg_prolongement():
    xs = np.linspace(-3 * PI / 2, 5 * PI / 2, 4001)
    assert np.allclose(_cos_recolle(xs), np.cos(xs), atol=1e-9)
    assert np.allclose(_sin_recolle(xs), np.sin(xs), atol=1e-9)
    assert np.allclose(_cos_recolle(xs + PI), -_cos_recolle(xs), atol=1e-9)
    jonctions = [PI / 2 + m * PI for m in (-2, -1, 0, 1)]
    for a in jonctions:
        m = round((a - PI / 2) / PI)          # a est l'extrémité droite de J_m, gauche de J_{m+1}
        gauche = lambda x: (-1) ** m * _cbar(np.array([x - m * PI]))[0]
        droite = lambda x: (-1) ** (m + 1) * _cbar(np.array([x - (m + 1) * PI]))[0]
        assert abs(gauche(a)) < 1e-12 and abs(droite(a)) < 1e-12
        e = 1e-6
        pg, pd = (gauche(a) - gauche(a - e)) / e, (droite(a + e) - droite(a)) / e
        assert abs(pg - pd) < 1e-5 and abs(pg + math.sin(a)) < 1e-5      # pente −sin a des deux côtés
    S = Schema(530, 260, 'Recollement de cos par f(x + π) = −f(x)')
    R = Repere(-3 * PI / 2 - 0.15, 5 * PI / 2 + 0.35, -1.35, 1.35, 15, 14, 495, 220)
    S.fleche(R(-3 * PI / 2 - 0.15, 0), R(5 * PI / 2 + 0.35, 0), 'g')
    S.texte(R(5 * PI / 2 + 0.35, 0) + [6, 0], 'x', 'g', ancre='start')
    S.fleche(R(0, -1.35), R(0, 1.35), 'g')
    couleurs = {-1: 'v', 0: 'r', 1: 'b', 2: 'v'}
    for m, c in couleurs.items():
        a, b = m * PI - PI / 2, m * PI + PI / 2
        fn = lambda x, m=m: (-1.0) ** m * _cbar(x - m * PI)
        R.graphe(S, fn, a, b, c, l=2.4 if m == 0 else 2.0)
    for a in jonctions:
        S.ligne(R(a, -1.25), R(a, 1.25), 'g', d=True)
        S.point(R(a, 0), 't', r=3.6)
    a = PI / 2
    assert abs(-math.sin(a) + 1) < 1e-12
    S.ligne(R(a - 0.75, 0.75), R(a + 0.75, -0.75), 'g', l=1.4)
    for a, txt in ((-PI / 2, '−π/2'), (PI / 2, 'π/2'), (3 * PI / 2, '3π/2')):
        S.texte(R(a, 0) + [12 if a > 0 else -12, 17], txt, 'g', ancre='start' if a > 0 else 'end', taille=16)
    S.texte(R(0, 1) + [26, -12], 'c̄', 'r', ancre='start')
    S.texte(R(PI, -1) + [0, 16], '−c̄(x − π)', 'b', taille=16)
    return S


@schema('tg-cercle')
def tg_cercle():
    y = 0.62
    u, v = math.cos(y), math.sin(y)
    assert abs(u * u + v * v - 1) < 1e-12 and u > 0
    assert abs(math.atan(v / u) - y) < 1e-12                       # l'antécédent est arctan(v/u)
    T = (1.0, v / u)
    assert abs(T[1] * u - v * T[0]) < 1e-12                        # O, (u, v), (1, v/u) alignés
    assert abs(math.cos(y + PI) + u) < 1e-12 and abs(math.sin(y + PI) + v) < 1e-12
    S = Schema(480, 330, 'Le point (u, v) du cercle, de paramètre arctan(v/u)')
    R = Repere(-1.55, 1.75, -1.3, 1.3, 50, 15, 380, 300)
    O = R(0, 0)
    S.fleche(R(-1.55, 0), R(1.75, 0), 'g')
    S.fleche(R(0, -1.3), R(0, 1.3), 'g')
    ts = np.linspace(0, 2 * PI, 361)
    S.poly(R(np.cos(ts), np.sin(ts)), 't', l=1.8)
    S.ligne(R(1, -1.25), R(1, 1.25), 'g')
    # demi-droite issue de O jusqu'à la tangente x = 1, et le point opposé
    S.ligne(R(-u, -v), R(*T), 'g', d=True)
    ta = np.linspace(0, y, 60)
    S.poly(R(np.cos(ta), np.sin(ta)), 'r', l=3.2)
    ta2 = np.linspace(0, y, 40)
    S.poly(R(0.28 * np.cos(ta2), 0.28 * np.sin(ta2)), 'r', l=1.4)
    S.texte(R(0.4 * math.cos(y / 2), 0.4 * math.sin(y / 2)), 'y', 'r', taille=16)
    S.point(R(u, v), 'r', r=4.4)
    S.texte(R(u, v) + [-14, -10], '(u, v)', 'r', ancre='end')
    S.point(R(*T), 'b', r=4.2)
    S.texte(R(*T) + [10, 0], '(1, v/u)', 'b', ancre='start')
    S.point(R(-u, -v), 'v', r=4.2)
    S.texte(R(-u, -v) + [-8, 16], '(−u, −v)', 'v', ancre='end')
    S.point(R(1, 0), 't', r=3.4)
    S.texte(R(1, 0) + [10, 14], '1', 't', ancre='start', taille=16)
    S.texte(O + [-10, 14], 'O', 'g', ancre='end', taille=16)
    return S
