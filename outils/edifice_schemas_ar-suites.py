"""Schémas du graphe ar-suites (suites réelles et limites).

Toute position est calculée ; toute affirmation illustrée est vérifiée par un assert.
Ordre d'apparition : ni exponentielle, ni logarithme, ni π dans les étiquettes ; les limites qui
s'expriment ainsi (π²/6, la limite de la série harmonique alternée) ne servent qu'à placer un point
et ne sont désignées que par une lettre.
"""
import math
from fractions import Fraction as Fr
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


def _axe_n(S, R, n0, n1, y, graduations, etiquettes=()):
    """Axe des indices à la hauteur y (en coordonnées de la suite), graduations entières."""
    S.fleche(R(n0 - 0.6, y), R(n1 + 0.7, y), 'g')
    S.texte(R(n1 + 0.7, y) + [8, 0], 'n', 'g', ancre='start', taille=15)
    for n in graduations:
        S.ligne(R(n, y) + [0, -3], R(n, y) + [0, 3], 'g')
    for n in etiquettes:
        S.texte(R(n, y) + [0, 15], str(n), 'g', taille=13)


def _rang(n_eps):
    """Plus petit N tel que la condition n_eps(n) soit vraie pour tout n >= N (testé jusqu'à 5000)."""
    vrai = [n_eps(n) for n in range(5000)]
    N = max(n for n in range(5000) if not vrai[n]) + 1 if not all(vrai) else 0
    assert all(vrai[N:])
    return N


@schema('su-convergence')
def su_convergence():
    u = lambda n: Fr(n + 1, 2 * n + 3)
    l = Fr(1, 2)
    assert all(abs(u(n) - l) == Fr(1, 4 * n + 6) for n in range(3000))
    e1, e2 = Fr(1, 10), Fr(1, 30)
    N1 = _rang(lambda n: abs(u(n) - l) < e1)
    N2 = _rang(lambda n: abs(u(n) - l) < e2)
    assert (N1, N2) == (2, 7)
    assert abs(u(N1 - 1) - l) >= e1 and abs(u(N2 - 1) - l) >= e2      # rangs optimaux
    # la remarque : pour ε = 10^-3, le rang est 249
    assert _rang(lambda n: abs(u(n) - l) < Fr(1, 1000)) == 249
    n1 = 16

    S = Schema(520, 330, 'Convergence : deux bandes autour de la limite, et le rang à partir duquel la suite y reste')
    R = Repere(-0.8, n1 + 1.5, 0.29, 0.64, 46, 12, 440, 280)
    y0 = 0.3
    S.rect(*R(-0.6, float(l + e1)), float(R(n1 + 0.5, 0)[0] - R(-0.6, 0)[0]),
           float(R(0, float(l - e1))[1] - R(0, float(l + e1))[1]), 'b', rempli='b')
    S.rect(*R(-0.6, float(l + e2)), float(R(n1 + 0.5, 0)[0] - R(-0.6, 0)[0]),
           float(R(0, float(l - e2))[1] - R(0, float(l + e2))[1]), 'r', rempli='r')
    S.ligne(R(-0.6, float(l)), R(n1 + 0.5, float(l)), 'g', d=True)
    S.texte(R(-0.6, float(l)) + [-8, 0], 'ℓ', ancre='end')
    _axe_n(S, R, 0, n1, y0, range(n1 + 1), [0, 5, 10, 15])
    for N, c, lab in [(N1, 'b', 'N_1'), (N2, 'r', 'N_2')]:
        S.ligne(R(N, y0), R(N, 0.62), c, d=True)
        S.texte(R(N, 0.62) + [0, -2], lab, c, base='auto', taille=16)
    S.texte(R(11.5, float(l + e1)) + [0, 14], 'ε_1 = 1/10', 'b', taille=16)
    S.texte(R(11.5, float(l + e2)) + [0, -10], 'ε_2 = 1/30', 'r', taille=16)
    for n in range(n1 + 1):
        c = 't' if n < N1 else ('b' if n < N2 else 'r')
        S.point(R(n, float(u(n))), c, r=3.4)
    S.texte(R(0, float(u(0))) + [12, 4], 'u_0', ancre='start', taille=15)
    return S


@schema('su-encadrement')
def su_encadrement():
    u = lambda n: 1 - Fr(1, n + 1)
    v = lambda n: 1 + Fr(2, n + 2)
    w = lambda n: 1 + (-1) ** n * Fr(1, 2) / (n + 1)
    assert all(u(n) <= w(n) <= v(n) for n in range(3000))
    eps = Fr(1, 5)
    N1 = _rang(lambda n: u(n) > 1 - eps)
    N2 = _rang(lambda n: v(n) < 1 + eps)
    assert (N1, N2) == (5, 9)
    assert all(abs(w(n) - 1) < eps for n in range(max(N1, N2), 3000))
    # w entre dans la bande dès n = 2, avant le rang garanti max(N1, N2)
    assert abs(w(1) - 1) >= eps and all(abs(w(n) - 1) < eps for n in range(2, 3000))
    n1 = 16

    S = Schema(520, 340, 'Encadrement : u monte, v descend, w est prise entre les deux')
    R = Repere(-0.8, n1 + 1.5, -0.12, 2.1, 46, 12, 440, 292)
    y0 = -0.05
    S.rect(*R(-0.6, float(1 + eps)), float(R(n1 + 0.5, 0)[0] - R(-0.6, 0)[0]),
           float(R(0, float(1 - eps))[1] - R(0, float(1 + eps))[1]), 'g', rempli='g')
    S.ligne(R(-0.6, 1), R(n1 + 0.5, 1), 'g', d=True)
    S.texte(R(-0.6, 1) + [-8, 0], 'ℓ', ancre='end')
    S.texte(R(-0.6, float(1 + eps)) + [-8, 0], 'ℓ+ε', 'g', ancre='end', taille=14)
    S.texte(R(-0.6, float(1 - eps)) + [-8, 0], 'ℓ−ε', 'g', ancre='end', taille=14)
    _axe_n(S, R, 0, n1, y0, range(n1 + 1), [0, 5, 10, 15])
    for N, c, lab in [(N1, 'b', 'N_1'), (N2, 'v', 'N_2')]:
        S.ligne(R(N, y0), R(N, 2.02), c, d=True)
        S.texte(R(N, 2.02) + [0, -2], lab, c, base='auto', taille=16)
    ns = np.arange(n1 + 1)
    for s, c in [(u, 'b'), (v, 'v'), (w, 'r')]:
        S.poly(R(ns, [float(s(n)) for n in ns]), c, l=0.8)
        for n in ns:
            S.point(R(n, float(s(n))), c, r=3.2 if c != 'r' else 3.6)
    S.texte(R(1, float(u(1))) + [10, 8], 'u_n', 'b', ancre='start', taille=16)
    S.texte(R(2, float(v(2))) + [8, -10], 'v_n', 'v', ancre='start', taille=16)
    S.texte(R(0, float(w(0))) + [12, 0], 'w_n', 'r', ancre='start', taille=16)
    return S


@schema('su-extraites')
def su_extraites():
    u = lambda n: (-1) ** n + Fr(1, n + 1)
    # termes pairs 1 + 1/(2k+1) décroissants vers 1, impairs -1 + 1/(2k+2) décroissants vers -1
    assert all(u(2 * k) - 1 == Fr(1, 2 * k + 1) and u(2 * k + 1) + 1 == Fr(1, 2 * k + 2) for k in range(2000))
    assert all(u(2 * k) > 1 and -1 < u(2 * k + 1) < 0 for k in range(1, 2000))
    n1 = 17

    S = Schema(520, 300, 'Suites extraites : les termes pairs tendent vers 1, les impairs vers −1')
    R = Repere(-0.8, n1 + 1.5, -1.25, 2.15, 46, 12, 440, 270)
    S.ligne(R(-0.6, 1), R(n1 + 0.5, 1), 'r', d=True)
    S.ligne(R(-0.6, -1), R(n1 + 0.5, -1), 'b', d=True)
    S.texte(R(-0.6, 1) + [-8, 0], '1', 'r', ancre='end')
    S.texte(R(-0.6, -1) + [-8, 0], '−1', 'b', ancre='end')
    _axe_n(S, R, 0, n1, 0, range(n1 + 1), [5, 10, 15])
    S.texte(R(0, 0) + [-8, 13], '0', 'g', ancre='end', taille=13)
    for n in range(n1 + 1):
        S.point(R(n, float(u(n))), 'r' if n % 2 == 0 else 'b', r=3.6)
    S.texte(R(0, float(u(0))) + [12, 0], 'u_0', 'r', ancre='start', taille=15)
    S.texte(R(11, 1.5), 'u_{2k} → 1', 'r', taille=16)
    S.texte(R(11, -0.5), 'u_{2k+1} → −1', 'b', taille=16)
    return S


@schema('su-monotone')
def su_monotone():
    n1 = 20
    u = [None, Fr(1)]
    for n in range(2, 4001):
        u.append(u[-1] + Fr(1, n * n))
    s = math.pi ** 2 / 6          # valeur de la limite, pour placer le point seulement
    # majoration télescopique de la remarque, et encadrement 1/(n+1) < s - u_n < 1/n
    assert all(u[n] <= 2 - Fr(1, n) for n in range(1, 400))
    assert all(1 / (n + 1) < s - float(u[n]) < 1 / n for n in range(1, 4001))
    assert s < 2
    eps = 0.15
    N = next(n for n in range(1, 4001) if float(u[n]) > s - eps)
    assert N == 7 and s - float(u[N - 1]) > eps + 0.003 and s - float(u[N]) < eps - 0.01
    assert all(float(u[n]) <= s for n in range(1, 4001))

    S = Schema(520, 320, 'Limite monotone : la suite croissante passe au-dessus de s − ε et reste sous s')
    R = Repere(0.2, n1 + 1.5, 0.9, 2.1, 46, 12, 440, 272)
    y0 = 0.93
    S.rect(*R(0.4, s), float(R(n1 + 0.5, 0)[0] - R(0.4, 0)[0]), float(R(0, s - eps)[1] - R(0, s)[1]),
           'r', rempli='r')
    S.ligne(R(0.4, 2), R(n1 + 0.5, 2), 'g', d=True)
    S.texte(R(0.4, 2) + [-8, 0], '2', 'g', ancre='end')
    S.texte(R(n1 + 0.5, 2) + [0, -14], 'un majorant', 'g', ancre='end', ui=True, taille=14)
    S.ligne(R(0.4, s), R(n1 + 0.5, s), 'r', l=1.6)
    S.texte(R(0.4, s) + [-8, 0], 's', 'r', ancre='end')
    S.texte(R(0.4, s - eps) + [-8, 0], 's−ε', 'r', ancre='end', taille=14)
    S.texte(R(n1 + 0.5, s) + [0, -14], 's = `sup` u_n', 'r', ancre='end', taille=16)
    _axe_n(S, R, 1, n1, y0, range(1, n1 + 1), [1, 5, 10, 15, 20])
    S.ligne(R(N, y0), R(N, float(u[N])), 'r', d=True)
    for n in range(1, n1 + 1):
        S.point(R(n, float(u[n])), 't' if n < N else 'r', r=3.4)
    S.cercle(R(N, float(u[N])), 7, 'r')
    S.texte(R(N, float(u[N])) + [-4, -20], 'u_N', 'r', taille=16)
    return S


@schema('su-adjacentes')
def su_adjacentes():
    M = 4001
    S_ = [Fr(0)]
    for k in range(1, 400):
        S_.append(S_[-1] + Fr((-1) ** (k + 1), k))
    Sf = [0.0]
    for k in range(1, M + 2):
        Sf.append(Sf[-1] + (-1) ** (k + 1) / k)
    l = math.log(2)               # valeur de la limite, pour placer la droite seulement
    # (S_2n) croissante, (S_2n+1) décroissante, écart 1/(2n+1), et S_2n < ℓ < S_2n+1
    assert all(S_[2 * n + 2] > S_[2 * n] and S_[2 * n + 3] < S_[2 * n + 1] for n in range(190))
    assert all(S_[2 * n + 1] - S_[2 * n] == Fr(1, 2 * n + 1) for n in range(190))
    assert all(Sf[2 * n] < l < Sf[2 * n + 1] for n in range(1, M // 2))
    assert abs(Sf[100] - 0.6882) < 5e-5 and abs(Sf[101] - 0.6981) < 5e-5
    n1 = 20

    Sc = Schema(520, 310, 'Suites adjacentes : sommes partielles paires croissantes, impaires décroissantes')
    R = Repere(0.2, n1 + 1.5, 0.42, 1.06, 46, 12, 440, 262)
    y0 = 0.45
    Sc.ligne(R(0.4, l), R(n1 + 0.5, l), 'g', d=True)
    Sc.texte(R(0.4, l) + [-8, 0], 'ℓ', ancre='end')
    _axe_n(Sc, R, 1, n1, y0, range(1, n1 + 1), [1, 5, 10, 15, 20])
    Sc.poly(R(np.arange(1, n1 + 1), [float(S_[n]) for n in range(1, n1 + 1)]), 'g', l=0.8)
    pa = [n for n in range(2, n1 + 1, 2)]
    im = [n for n in range(1, n1 + 1, 2)]
    Sc.poly(R(np.array(pa, float), [float(S_[n]) for n in pa]), 'b', l=1.6)
    Sc.poly(R(np.array(im, float), [float(S_[n]) for n in im]), 'r', l=1.6)
    for n in range(1, n1 + 1):
        Sc.point(R(n, float(S_[n])), 'r' if n % 2 else 'b', r=3.6)
    Sc.texte(R(9, float(S_[9])) + [0, -18], 'S_{2n+1}', 'r', taille=16)
    Sc.texte(R(6, float(S_[6])) + [0, 20], 'S_{2n}', 'b', taille=16)
    return Sc


@schema('su-segments')
def su_segments():
    a, b = Fr(1), Fr(2)
    segs = [(a, b)]
    for _ in range(6):
        m = (a + b) / 2
        if m * m <= 2:
            a = m
        else:
            b = m
        segs.append((a, b))
    # emboîtés, longueur 1/2^n, et a_n^2 <= 2 < b_n^2 : le point commun ℓ vérifie ℓ^2 = 2
    assert all(s[0] <= t[0] <= t[1] <= s[1] for s, t in zip(segs, segs[1:]))
    assert all(t[1] - t[0] == Fr(1, 2 ** n) for n, t in enumerate(segs))
    assert all(t[0] ** 2 <= 2 < t[1] ** 2 for t in segs)
    assert segs[-1] == (Fr(45, 32), Fr(91, 64))
    l = math.sqrt(2)
    assert all(t[0] <= l <= t[1] for t in segs)

    S = Schema(520, 330, 'Segments emboîtés : la dichotomie qui encadre le réel de carré 2')
    R = Repere(0.93, 2.06, -0.9, len(segs) - 0.4, 70, 12, 430, 300)
    for k, (u, v) in enumerate(segs):
        y = len(segs) - 1 - k
        if k:
            pu, pv = segs[k - 1]
            # moitié écartée, en gris
            if u == pu:
                S.ligne(R(float(v), y), R(float(pv), y), 'g', d=True)
            else:
                S.ligne(R(float(pu), y), R(float(u), y), 'g', d=True)
        S.ligne(R(float(u), y), R(float(v), y), 't', l=3)
        for x in (u, v):
            S.ligne(R(float(x), y) + [0, -6], R(float(x), y) + [0, 6], 't', l=1.6)
        S.texte(R(0.93, y) + [-6, 0], f'[a_{k}, b_{k}]', ancre='end', taille=15)
    S.ligne(R(l, -0.55), R(l, len(segs) - 0.6), 'r', d=True)
    S.fleche(R(0.95, -0.55), R(2.04, -0.55), 'g')
    for x, lab in [(1, '1'), (1.25, '1,25'), (1.5, '1,5'), (1.75, '1,75'), (2, '2')]:
        S.ligne(R(x, -0.55) + [0, -4], R(x, -0.55) + [0, 4], 'g')
        S.texte(R(x, -0.55) + [0, 15], lab, 'g', taille=13)
    S.point(R(l, -0.55), 'r', r=4)
    S.texte(R(l, -0.55) + [8, -12], 'ℓ', 'r', ancre='start')
    return S
