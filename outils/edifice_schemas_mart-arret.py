"""Schémas du chapitre « Théorème d'arrêt et uniforme intégrabilité » (graphe mart-arret) : martingale arrêtée à la
sortie d'un intervalle, et contre-exemple de la marche simple arrêtée à son premier passage en 1. Les simulations
emploient numpy.random.default_rng avec des graines écrites ici ; la loi exacte de la marche arrêtée est calculée
en fractions."""
from fractions import Fraction as Fr
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
    S.el = [re.sub(r' stroke-width="([0-9.]+)"', r' style="stroke-width:\1"', e) for e in S.el]
    return S


def _marches(graine, m, n):
    rng = np.random.default_rng(graine)
    e = rng.choice([-1, 1], size=(m, n))
    return np.concatenate([np.zeros((m, 1), int), np.cumsum(e, axis=1)], axis=1)


def _loi_arretee(n):
    """Loi exacte de S_{T ∧ n}, T premier passage en 1 de la marche simple symétrique issue de 0."""
    loi = {0: Fr(1)}
    for _ in range(n):
        nv = {}
        for s, p in loi.items():
            if s == 1:
                nv[1] = nv.get(1, 0) + p
                continue
            for t in (s - 1, s + 1):
                nv[t] = nv.get(t, 0) + p / 2
        loi = nv
    return loi


@schema('mu-arret')
def mu_arret():
    n, a, b = 60, -4, 3
    M = _marches(101, 1, n)[0]
    T = int(np.nonzero((M >= b) | (M <= a))[0][0])
    assert T == 31 and M[T] == b and np.all((M[:T] > a) & (M[:T] < b))
    MT = np.array([M[min(T, k)] for k in range(n + 1)])
    # la martingale arrêtée suit M jusqu'à T, puis reste constante ; la trajectoire repasse ensuite sous 0
    assert np.all(MT[:T + 1] == M[:T + 1]) and np.all(MT[T:] == b) and M[T:].min() <= -1
    lo, hi = -6, 6
    assert M.min() >= lo and M.max() <= hi
    S = Schema(520, 300, 'Marche simple, temps de sortie T de ]a, b[ et martingale arrêtée')
    R = Repere(-1, 63, lo - 0.5, hi + 0.5, 40, 18, 450, 250)
    S.fleche(R(-1, 0), R(63, 0) + [6, 0], 'g')
    S.texte(R(63, 0) + [10, -12], 'n', 'g', ancre='start')
    S.ligne(R(0, lo - 0.5), R(0, hi + 0.5), 'g')
    for v, nom in [(b, '3'), (a, '−4')]:
        S.ligne(R(0, v), R(62, v), 'g', d=True)
        S.texte(R(0, v) + [-8, 0], nom, 'g', ancre='end')
    ks = np.arange(n + 1)
    S.poly(R(ks[T:], M[T:]), 'g', l=1.2)
    S.poly(R(ks, MT), 'r', l=2.2)
    S.ligne(R(T, M[T]), R(T, 0), 'r', d=True)
    S.point(R(T, M[T]), 'r', r=4.6)
    S.texte(R(T, 0) + [0, 16], 'T', 'r')
    S.texte(R(48, b) + [0, -16], 'M_{T∧n}', 'r')
    pic = T + int(np.argmax(M[T:T + 6]))
    assert M[pic] == 5
    S.texte(R(pic, M[pic]) + [12, -4], 'M_n', 'g', ancre='start')
    _tic_x(S, R, n, 0, str(n), dy=-16)
    S.texte(R(0, 0) + [-8, 0], '0', 'g', ancre='end', taille=15)
    return _epaisseurs(S)


@schema('mu-arret-doob')
def mu_arret_doob():
    m, n = 8, 200
    S_ = _marches(184, m, n)
    T = [int(np.nonzero(s == 1)[0][0]) if (s == 1).any() else None for s in S_]
    atteint = [i for i in range(m) if T[i] is not None]
    route = [i for i in range(m) if T[i] is None]
    assert len(atteint) == 6 and len(route) == 2
    assert sorted(T[i] for i in atteint) == [1, 3, 3, 7, 47, 163]
    arr = np.array([[s[min(T[i], k)] if T[i] is not None else s[k] for k in range(n + 1)] for i, s in enumerate(S_)])
    assert all(arr[i, -1] <= -12 for i in route) and arr.min() >= -24 and arr.max() == 1
    # loi exacte : moyenne nulle à chaque instant, et P(T ≤ 200) proche de 1
    for k in range(n + 1):
        loi_k = _loi_arretee(k)
        assert sum(s * p for s, p in loi_k.items()) == 0 and max(loi_k) <= 1 and sum(loi_k.values()) == 1
    loi = _loi_arretee(n)
    assert 0.94 < float(loi[1]) < 0.95
    lo, hi = -25, 2
    S = Schema(520, 300, 'Huit trajectoires de la marche simple arrêtée au premier passage en 1')
    R = Repere(0, n + 6, lo, hi, 44, 18, 440, 245)
    S.ligne(R(0, lo), R(n + 6, lo), 'g')
    S.texte(R(n + 6, lo) + [8, -12], 'n', 'g', ancre='start')
    S.ligne(R(0, lo), R(0, hi), 'g')
    S.ligne(R(0, 0), R(n + 6, 0), 'g', l=0.6)
    S.ligne(R(0, 1), R(n + 6, 1), 'g', d=True)
    for v, nom in [(1, '1'), (-10, '−10'), (-20, '−20')]:
        _tic_y(S, R, 0, v, nom)
    for k in (50, 100, 150, 200):
        _tic_x(S, R, k, lo, str(k))
    ks = np.arange(n + 1)
    for i in route:
        S.poly(R(ks, arr[i]), 'b', l=1.4)
        S.point(R(n, arr[i, -1]), 'b', r=3.4)
    for i in atteint:
        S.poly(R(ks, arr[i]), 'r', l=1.6)
        S.point(R(T[i], 1), 'r', r=3.4)
    S.texte(R(n, 1) + [0, -14], 'S_{T∧n}', 'r', ancre='end')
    return _epaisseurs(S)
