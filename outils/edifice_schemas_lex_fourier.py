"""Schémas des exemples du lexique, théorie fourier : contenu/exemples/fourier.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). Courbes tracées par leurs formules exactes, et ce que la légende affirme vérifié par assert.
"""
import math

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

W0 = 420
TL = 17


def _dans_cadre(S, p, s, taille=TL, ancre='middle', marge=2):
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


def _etiq(S, p, s, c='t', ancre='middle', taille=TL):
    _dans_cadre(S, p, s, taille, ancre)
    S.texte(p, s, c, ancre=ancre, taille=taille)


def _axes(S, R, nx='x', ny='y', c='g', origine=(0, 0)):
    ox, oy = origine
    S.fleche(R(R.xmin, oy), R(R.xmax, oy), c)
    if nx:
        _etiq(S, R(R.xmax, oy) + [-4, -16], nx, c, ancre='end', taille=17)
    S.fleche(R(ox, R.ymin), R(ox, R.ymax), c)
    if ny:
        _etiq(S, R(ox, R.ymax) + [9, 7], ny, c, ancre='start', taille=17)


def _grad_x(S, R, v, lab, c='g', dy=16, taille=17, y0=0):
    S.ligne(R(v, y0) + [0, -3], R(v, y0) + [0, 3], c)
    if lab:
        _etiq(S, R(v, y0) + [0, dy], lab, c, taille=taille)


def _grad_y(S, R, v, lab, c='g', dx=-8, taille=17, x0=0):
    S.ligne(R(x0, v) + [-3, 0], R(x0, v) + [3, 0], c)
    if lab:
        _etiq(S, R(x0, v) + [dx, 0], lab, c, ancre='end' if dx < 0 else 'start', taille=taille)


def _courbe(S, R, fn, a, b, c='t', n=800, l=None, d=False):
    xs = np.linspace(a, b, n)
    ys = np.array([fn(q) for q in xs], float)
    S.poly(R(xs, ys), c, d, l=l)


@schema('lex-transformee-fourier-1')
def lex_transformee_fourier_1():
    fh = lambda u: 2.0 if u == 0 else 2 * math.sin(u) / u
    xs = np.linspace(-20, 20, 4001)
    assert all(abs(fh(u)) <= 2 / abs(u) + 1e-12 for u in xs if u != 0)
    W, H = W0, 220
    R = Repere(-20.5, 20.8, -0.75, 2.35, 12, 14, W - 24, H - 28)
    S = Schema(W, H, 'Transformée de Fourier de l’indicatrice de [−1, 1]')
    _axes(S, R, '', '')
    _etiq(S, R(R.xmax, 0) + [-4, -30], 'ξ', 'g', ancre='end', taille=17)
    for sg in (1, -1):
        for cote in (1, -1):
            a = 1.2 if sg > 0 else -20
            b = 20 if sg > 0 else -1.2
            g = lambda u: cote * 2 / abs(u)
            us = np.linspace(a, b, 400)
            pts = [(u, g(u)) for u in us if R.ymin <= g(u) <= 1.6]
            S.poly(R(*np.array(pts).T), 'g', d=True)
    _courbe(S, R, fh, -20, 20, 'r', l=2)
    _grad_y(S, R, 2, '')
    _etiq(S, R(0, 2) + [-12, 0], '2', 'g', ancre='end', taille=17)
    for k in (-3, -2, -1, 1, 2, 3):
        _grad_x(S, R, k * 2 * math.pi, '')
        _etiq(S, R(k * 2 * math.pi, -0.62), f'{2 * k}π' if k > 0 else f'−{-2 * k}π', 'g', taille=17)
    return S


@schema('lex-fonction-caracteristique-3')
def lex_fonction_caracteristique_3():
    g = lambda u: math.exp(-u * u / 2)
    ecarts = []
    for n in (1, 4, 16):
        ecarts.append(max(abs(math.cos(u / math.sqrt(n)) ** n - g(u)) for u in np.linspace(0, 4, 801)))
    assert ecarts[0] > ecarts[1] > ecarts[2]
    W, H = W0, 230
    R = Repere(-0.35, 4.3, -1.12, 1.12, 26, 12, W - 40, H - 26)
    S = Schema(W, H, 'Fonctions caractéristiques de S_n/√n et gaussienne')
    _axes(S, R, 't', '')
    _grad_y(S, R, 1, '1')
    _grad_y(S, R, -0.5, '−0,5')
    for k in (1, 2, 3, 4):
        _grad_x(S, R, k, '')
        if k != 3:
            _etiq(S, R(k, -1.04), str(k), 'g', taille=17)
        else:
            _etiq(S, R(k, 0) + [0, -14], '3', 'g', taille=17)
    _courbe(S, R, g, 0, 4, 'g', d=True, l=2)
    for n, c in ((1, 'b'), (4, 'v'), (16, 'r')):
        _courbe(S, R, lambda u: math.cos(u / math.sqrt(n)) ** n, 0, 4, c, l=1.8)
    _etiq(S, R(2.45, math.cos(2.45)) + [12, 2], 'n = 1', 'b', ancre='start', taille=17)
    return S


@schema('lex-convergence-loi-1')
def lex_convergence_loi_1():
    W, H = W0, 200
    R = Repere(-0.75, 1.35, -0.12, 1.25, 16, 12, W - 30, H - 30)
    S = Schema(W, H, 'Fonctions de répartition de 1/n et de 0')
    _axes(S, R, 'x', '')
    _grad_y(S, R, 1, '1', x0=0, dx=-8)
    for n, dec in ((1, 0.0), (2, 0.0), (4, 0.0)):
        a = 1 / n
        assert a > 0      # F_{1/n}(0) = 0
        S.ligne(R(-0.75, 0) + [0, -1.5], R(a, 0) + [0, -1.5], 'b', l=2)
        S.ligne(R(a, 1), R(1.3, 1), 'b', l=2)
        S.point(R(a, 1), 'b', r=3.5)
        S.point(R(a, 0), 'b', r=3.5, creux=True)
        _grad_x(S, R, a, ['', '1', '1/2', '', '1/4'][n], dy=16)
    S.ligne(R(0, 1), R(1.3, 1) + [0, 0], 'r', l=1.2)
    S.ligne(R(-0.75, 0), R(0, 0), 'r', l=1.2)
    S.point(R(0, 1), 'r', r=4)
    S.point(R(0, 0), 'r', r=4, creux=True)
    return S


@schema('lex-fonction-escalier-droite-1')
def lex_fonction_escalier_droite_1():
    paliers = [(0, 0.5, 1), (0.5, 1, 3), (1, 2, 2)]
    assert sum((b - a) * v for a, b, v in paliers) == 4
    W, H = W0, 200
    R = Repere(-0.6, 2.7, -0.35, 3.6, 16, 12, W - 30, H - 26)
    S = Schema(W, H, 'Une fonction en escalier sur ℝ')
    for a, b, v in paliers:
        S.surface(R(np.array([a, b, b, a]), np.array([0, 0, v, v])), 'r')
    _axes(S, R, 'x', '')
    for a, b, v in paliers:
        S.ligne(R(a, v), R(b, v), 'r', l=2.4)
    S.ligne(R(-0.6, 0) + [0, -1], R(0, 0) + [0, -1], 'r', l=2.4)
    S.ligne(R(2, 0) + [0, -1], R(2.6, 0) + [0, -1], 'r', l=2.4)
    for v in (1, 2, 3):
        _grad_y(S, R, v, str(v))
    for xv, lab in ((0.5, '1/2'), (1, '1'), (2, '2')):
        _grad_x(S, R, xv, lab)
    return S


@schema('lex-fonction-escalier-droite-3')
def lex_fonction_escalier_droite_3():
    h, n = 0.5, 5
    f = lambda u: math.exp(-abs(u))
    marches = [(k * h, (k + 1) * h, math.exp(-(k + 1) * h)) for k in range(int(n / h))]
    err = 2 - 2 * sum((b - a) * v for a, b, v in marches)
    assert abs(err - 0.4689) < 1e-3 and all(v <= f(b) + 1e-12 for a, b, v in marches)
    W, H = W0, 210
    R = Repere(-6.3, 6.5, -0.1, 1.18, 12, 12, W - 24, H - 26)
    S = Schema(W, H, 'Approximation de e^{−|x|} par une fonction en escalier')
    xs = np.linspace(-6.2, 6.2, 1241)
    s_ = lambda u: next((v for a, b, v in marches if a <= abs(u) < b), 0.0)
    haut = [f(u) for u in xs]
    bas = [s_(u) for u in xs]
    S.surface(np.vstack([R(xs, np.array(haut)), R(xs[::-1], np.array(bas[::-1]))]), 'r')
    _axes(S, R, 'x', '')
    _courbe(S, R, f, -6.2, 6.2, 'g', l=1.6)
    for sg in (1, -1):
        for a, b, v in marches:
            S.ligne(R(sg * a, v), R(sg * b, v), 'r', l=2)
    _grad_y(S, R, 1, '1')
    for xv in (-5, 5):
        _grad_x(S, R, xv, '−5' if xv < 0 else '5')
    return S
