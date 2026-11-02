"""Schémas du graphe intérieur ar-exp (chapitre « Exponentielle et logarithme »).

Toute position est calculée ; toute affirmation illustrée est vérifiée par un assert.
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere

E = math.e


def _aire(fn, a, b, n=200001):
    xs = np.linspace(a, b, n)
    ys = fn(xs)
    return float(np.sum((ys[1:] + ys[:-1]) * np.diff(xs)) / 2)


def _visibles(fn, a, b, ymin, ymax, n=3001):
    """Morceaux du graphe de fn sur [a, b] dont l'ordonnée reste dans [ymin, ymax]."""
    xs = np.linspace(a, b, n)
    ys = fn(xs)
    ok = (ys >= ymin) & (ys <= ymax)
    morceaux, cour = [], []
    for x, y, k in zip(xs, ys, ok):
        if k:
            cour.append((x, y))
        elif cour:
            morceaux.append(np.array(cour)); cour = []
    if cour:
        morceaux.append(np.array(cour))
    return morceaux


@schema('ex-logarithme')
def ex_logarithme():
    h = lambda t: 1 / t
    bandes = [(0.5, 1, 'v'), (1, 2, 'r'), (2, 4, 'b')]
    for a, b, _ in bandes:
        assert abs(_aire(h, a, b) - math.log(2)) < 1e-9          # trois aires égales à ln 2
    assert abs(math.log(2) - 0.6931) < 1e-4
    S = Schema(500, 300, 'Trois bandes de même aire ln 2 sous l’hyperbole 1/t')
    R = Repere(0, 4.7, 0, 2.3, 34, 20, 430, 250)
    for a, b, c in bandes:
        xs = np.linspace(a, b, 200)
        S.surface(np.vstack([R(xs, h(xs)), R(b, 0)[None], R(a, 0)[None]]), c)
        S.ligne(R(a, 0), R(a, h(a)), c)
        S.ligne(R(b, 0), R(b, h(b)), c)
    S.fleche(R(0, 0), R(4.7, 0), 'g'); S.texte(R(4.7, 0) + [4, 14], 't', 'g', ancre='end')
    S.fleche(R(0, 0), R(0, 2.3), 'g')
    t0 = 1 / 2.25
    R.graphe(S, h, t0, 4.55, 't', l=2.2)
    S.texte(R(0.62, h(0.62)) + [10, -6], 'y = 1/t', 't', ancre='start', taille=16)
    for a, lab, c in ((0.5, '1/2', 'v'), (1, '1', 'r'), (2, '2', 'r'), (4, '4', 'b')):
        S.texte(R(a, 0) + [0, 16], lab, 'g' if a in (1, 2) else c, taille=15)
    # étiquettes d'aire, dans les bandes, sous la courbe
    assert h(1) > 0.62 and h(2) > 0.25 + 0.07
    S.texte(R(0.75, 0.62), '`ln` 2', 'v', taille=15)
    S.texte(R(1.5, 0.3), '`ln` 2', 'r', taille=15)
    S.texte(R(3.0, 0.15), '`ln` 2', 'b', taille=15)
    return S


@schema('ex-exponentielle')
def ex_exponentielle():
    lo, hi = -2.2, 3.6
    # tangente à exp en (1, e) : y = e x ; tangente à ln en (e, 1) : y = x / e ; toutes deux passent par 0
    xs = np.linspace(-2.2, 1.28, 20001)
    assert np.all(np.exp(xs) - E * xs >= -1e-12)                     # y = e x sous exp...
    assert abs(math.exp(1) - E * 1) < 1e-15 and abs(math.exp(1) - E) < 1e-15   # ...qu'elle touche en 1, de pente exp'(1) = e
    xs = np.linspace(0.12, 3.6, 20001)
    assert np.all(np.log(xs) - xs / E <= 1e-12)                      # y = x/e au-dessus de ln...
    assert abs(math.log(E) - E / E) < 1e-15                          # ...qu'elle touche en e, de pente ln'(e) = 1/e
    for h in (1e-4, -1e-4):                                          # pentes vérifiées par taux d'accroissement
        assert abs((math.exp(1 + h) - E) / h - E) < 1e-3
        assert abs((math.log(E + h) - 1) / h - 1 / E) < 1e-3
    S = Schema(440, 440, 'Graphes symétriques de exp et ln, tangentes de pentes inverses')
    R = Repere(lo, hi, lo, hi, 20, 20, 400, 400)
    R.axes(S, 'x', 'y')
    S.ligne(R(lo, lo), R(hi, hi), 'g', d=True)
    S.texte(R(3.25, 3.25) + [-6, -14], 'y = x', 'g', ancre='end', taille=15)
    R.graphe(S, np.exp, lo, math.log(hi), 'r', l=2.2)
    R.graphe(S, np.log, math.exp(lo), hi, 'b', l=2.2)
    S.texte(R(-1.6, math.exp(-1.6)) + [0, -16], '`exp`', 'r', taille=16)
    S.texte(R(3.35, math.log(3.35)) + [0, 16], '`ln`', 'b', taille=16)
    # tangentes issues de l'origine
    S.ligne(R(0, 0), R(1.28, 1.28 * E), 'r', d=True)
    S.ligne(R(0, 0), R(1.28 * E, 1.28), 'b', d=True)
    assert 1.28 * E < hi
    S.point(R(1, E), 'r', r=4.2); S.point(R(E, 1), 'b', r=4.2)
    S.texte(R(1, E) + [10, 4], '(1, e)', 'r', ancre='start', taille=15)
    S.texte(R(E, 1) + [6, 18], '(e, 1)', 'b', ancre='start', taille=15)
    S.point(R(0, 1), 'r'); S.point(R(1, 0), 'b')
    S.texte(R(0, 1) + [-8, -10], '1', 'r', ancre='end', taille=15)
    S.texte(R(1, 0) + [0, 16], '1', 'b', taille=15)
    return S


@schema('ex-croissances')
def ex_croissances():
    cs = {1: 'r', 2: 'b', 3: 'v'}
    xs = np.linspace(0, 12, 120001)
    for a in cs:
        ys = xs ** a * np.exp(-xs)
        i = int(np.argmax(ys))
        assert abs(xs[i] - a) < 1e-3 and abs(ys[i] - (a / E) ** a) < 1e-9
        assert ys[-1] < 0.02                                   # déjà petite en x = 12
    assert abs((1 / E) - 0.368) < 1e-3 and abs((2 / E) ** 2 - 0.541) < 1e-3 and abs((3 / E) ** 3 - 1.344) < 1e-3
    S = Schema(520, 280, 'Les fonctions x^a e^{-x} pour a = 1, 2, 3 : maximum en x = a, puis décroissance vers 0')
    R = Repere(0, 12.5, 0, 1.55, 34, 20, 450, 220)
    S.fleche(R(0, 0), R(12.5, 0), 'g'); S.texte(R(12.5, 0) + [4, 14], 'x', 'g', ancre='end')
    S.fleche(R(0, 0), R(0, 1.55), 'g')
    for a, c in cs.items():
        fn = lambda x, a=a: x ** a * np.exp(-x)
        R.graphe(S, fn, 0, 12, c, l=2.2, n=600)
        m = (a / E) ** a
        S.ligne(R(a, 0), R(a, m), c, d=True)
        S.point(R(a, m), c, r=4)
        S.texte(R(a, 0) + [0, 16], str(a), c, taille=15)
    S.texte(R(1, 1 / E) + [-10, -14], 'x e^{−x}', 'r', ancre='end', taille=15)
    S.texte(R(2, (2 / E) ** 2) + [10, -12], 'x^2 e^{−x}', 'b', ancre='start', taille=15)
    S.texte(R(3, (3 / E) ** 3) + [10, -10], 'x^3 e^{−x}', 'v', ancre='start', taille=15)
    return S


@schema('ex-serie')
def ex_serie():
    lo, hi, ymin, ymax = -3.0, 2.1, -2.3, 8.4
    Sn = lambda n: (lambda x: sum(x ** k / math.factorial(k) for k in range(n + 1)))
    neg = np.linspace(-3, -1e-3, 2000); pos = np.linspace(1e-3, 2.1, 2000)
    for n in (1, 2, 3):
        assert np.all(Sn(n)(pos) < np.exp(pos))                     # sous exp pour x > 0
    assert np.all(Sn(1)(neg) < np.exp(neg)) and np.all(Sn(3)(neg) < np.exp(neg))
    assert np.all(Sn(2)(neg) > np.exp(neg))                         # S_2 au-dessus pour x < 0
    assert math.exp(hi) < ymax
    S = Schema(500, 340, 'L’exponentielle et ses polynômes de Taylor S_1, S_2, S_3')
    R = Repere(lo, hi + 0.25, ymin, ymax, 30, 14, 440, 310)
    S.fleche(R(lo, 0), R(hi + 0.25, 0), 'g'); S.texte(R(hi + 0.25, 0) + [4, 14], 'x', 'g', ancre='end')
    S.fleche(R(0, ymin), R(0, ymax), 'g')
    styles = {1: ('g', True), 2: ('g', False), 3: ('t', False)}
    for n, (c, d) in styles.items():
        for m in _visibles(Sn(n), lo, hi, ymin, ymax):
            S.poly(R(m[:, 0], m[:, 1]), c, d=d, l=1.6)
    R.graphe(S, np.exp, lo, hi, 'r', l=2.4)
    S.texte(R(hi, math.exp(hi)) + [-8, 2], '`exp`', 'r', ancre='end', taille=16)
    for n in (1, 2, 3):
        y = Sn(n)(hi)
        S.texte(R(hi, y) + [8, 0], f'S_{n}', 't' if n == 3 else 'g', ancre='start', taille=15)
    assert abs(Sn(1)(hi) - 3.1) < 1e-12 and abs(Sn(2)(hi) - 5.305) < 1e-9
    S.texte(R(-3, Sn(2)(-3)) + [8, -4], 'S_2', 'g', ancre='start', taille=15)
    S.texte(R(0, 0) + [-6, 14], '0', 'g', ancre='end', taille=15)
    return S


@schema('ex-convexite')
def ex_convexite():
    t = 1.0
    corde = lambda x: (1 - x) / 2 * math.exp(-t) + (1 + x) / 2 * math.exp(t)
    xs = np.linspace(-1, 1, 2001)
    assert np.all(np.exp(t * xs) <= corde(xs) + 1e-15)
    ch, eh = math.cosh(t), math.exp(t * t / 2)
    assert abs(corde(0) - ch) < 1e-15 and 1 < ch < eh
    assert abs(ch - 1.543) < 1e-3 and abs(eh - 1.649) < 1e-3
    S = Schema(480, 320, 'La corde de exp entre −1 et 1, et sa hauteur cosh 1 au milieu')
    R = Repere(-1.7, 1.7, 0, 3.3, 30, 16, 420, 280)
    S.fleche(R(-1.7, 0), R(1.7, 0), 'g'); S.texte(R(1.7, 0) + [4, 14], 'x', 'g', ancre='end')
    S.fleche(R(0, 0), R(0, 3.3), 'g')
    R.graphe(S, np.exp, -1.7, math.log(3.2), 'r', l=2.2)
    S.ligne(R(-1, math.exp(-1)), R(1, E), 'b', l=2)
    S.point(R(-1, math.exp(-1)), 'b'); S.point(R(1, E), 'b')
    S.ligne(R(-1, 0), R(-1, math.exp(-1)), 'g', d=True); S.ligne(R(1, 0), R(1, E), 'g', d=True)
    S.texte(R(-1, 0) + [0, 16], '−1', 'g', taille=15); S.texte(R(1, 0) + [0, 16], '1', 'g', taille=15)
    S.point(R(0, 1), 'r', r=3.6)
    S.point(R(0, ch), 'b', r=4)
    S.point(R(0, eh), 'v', r=4)
    S.texte(R(0, ch) + [12, 16], '`cosh` 1', 'b', ancre='start', taille=15)
    S.texte(R(0, eh) + [-12, -8], 'e^{1/2}', 'v', ancre='end', taille=15)
    S.texte(R(0, 1) + [10, 12], '1', 'r', ancre='start', taille=15)
    S.texte(R(1.3, math.exp(1.3)) + [-10, -4], '`exp`', 'r', ancre='end', taille=16)
    return S


@schema('ex-plateau')
def ex_plateau():
    th = lambda x: np.where(x > 0, np.exp(-1 / np.where(x > 0, x, 1)), 0.0)
    d1 = lambda x: np.where(x > 0, th(x) / np.where(x > 0, x, 1) ** 2, 0.0)
    d2 = lambda x: np.where(x > 0, (np.where(x > 0, x, 1) ** -4 - 2 * np.where(x > 0, x, 1) ** -3) * th(x), 0.0)
    xs = np.linspace(1e-3, 3, 300001)
    assert abs(xs[np.argmax(d1(xs))] - 0.5) < 1e-4 and abs(d1(0.5) - 4 * math.exp(-2)) < 1e-12
    assert abs(d2(0.5)) < 1e-12 and d2(0.49) > 0 and d2(0.51) < 0
    i2 = int(np.argmax(d2(xs))); j2 = int(np.argmin(d2(xs)))
    assert abs(xs[i2] - (3 - math.sqrt(3)) / 6) < 1e-4 and abs(xs[j2] - (3 + math.sqrt(3)) / 6) < 1e-4
    ymax = 2.75
    assert d2(xs).max() < ymax and d2(xs).min() > -0.5
    S = Schema(520, 330, 'La fonction θ et ses deux premières dérivées, toutes nulles en 0')
    R = Repere(-0.7, 3.1, -0.55, ymax, 30, 14, 450, 290)
    S.fleche(R(-0.7, 0), R(3.1, 0), 'g'); S.texte(R(3.1, 0) + [4, 14], 'x', 'g', ancre='end')
    S.fleche(R(0, -0.55), R(0, ymax), 'g')
    S.ligne(R(0.5, -0.5), R(0.5, 1.0), 'g', d=True)
    for fn, c in ((d2, 'v'), (d1, 'b'), (th, 'r')):
        S.ligne(R(-0.7, 0), R(0, 0), c, l=2)
        R.graphe(S, fn, 1e-4, 3.0, c, l=2.2, n=3000)
    S.point(R(0.5, float(th(0.5))), 'r', r=4.4)
    S.point(R(0.5, float(d1(0.5))), 'b', r=3.4)
    S.point(R(0.5, 0), 'v', r=3.4)
    S.texte(R(0.5, -0.5) + [0, 10], '1/2', 'g', taille=15)
    S.texte(R(2.6, float(th(2.6))) + [0, -14], 'θ', 'r', taille=17)
    S.texte(R(1.4, float(d1(1.4))) + [6, -12], 'θ′', 'b', ancre='start', taille=17)
    S.texte(R((3 - math.sqrt(3)) / 6, float(d2((3 - math.sqrt(3)) / 6))) + [12, 4], 'θ″', 'v', ancre='start', taille=17)
    return S
