"""Schémas des exemples du lexique, théorie nban (théorie analytique des nombres) : contenu/exemples/nban.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées (formules exactes ; ζ par mpmath, comme la légende le dit), et ce que la
légende affirme vérifié par assert. Couleurs (§ 29) : t encre, g gris (axes, référence), r rouge (objet étudié),
b bleu (second objet). Axes, flèches et étiquettes restent dans le cadre.
"""
import math
import numpy as np
import mpmath as mp
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

W = 420
TL = 17


def _dans_cadre(S, p, s, taille=TL, ancre='middle', marge=2):
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


def _etiq(S, p, s, c='t', ancre='middle', taille=TL):
    _dans_cadre(S, p, s, taille, ancre)
    S.texte(p, s, c, ancre=ancre, taille=taille)


def _axes(S, R, nx='x', ny='y', c='g', origine=(0, 0)):
    """Axes du repère, flèches et noms à l'intérieur du rectangle du repère."""
    ox, oy = origine
    S.fleche(R(R.xmin, oy), R(R.xmax, oy), c)
    if nx:
        _etiq(S, R(R.xmax, oy) + [-4, -13], nx, c, ancre='end', taille=16)
    S.fleche(R(ox, R.ymin), R(ox, R.ymax), c)
    if ny:
        _etiq(S, R(ox, R.ymax) + [-9, 7], ny, c, ancre='end', taille=16)


def _simplifie(P, tol=0.7):
    """Ligne brisée allégée : on garde un point dès qu'il est à plus de tol pixels du dernier gardé (et le dernier)."""
    P = np.asarray(P, float)
    if len(P) < 3:
        return P
    garde = [0]
    for i in range(1, len(P) - 1):
        if np.hypot(*(P[i] - P[garde[-1]])) >= tol:
            garde.append(i)
    garde.append(len(P) - 1)
    return P[garde]


def _courbe(S, R, xs, ys, c='t', l=None, d=False):
    """Courbe coupée aux sorties du repère."""
    dedans = np.isfinite(ys) & (ys >= R.ymin) & (ys <= R.ymax)
    morceau = []
    for q, yv, ok in zip(xs, ys, dedans):
        if ok:
            morceau.append((q, yv))
        elif morceau:
            if len(morceau) > 1:
                S.poly(_simplifie(R(*np.array(morceau).T)), c, d, l=l)
            morceau = []
    if len(morceau) > 1:
        S.poly(_simplifie(R(*np.array(morceau).T)), c, d, l=l)


def _grad_x(S, R, v, lab, c='g', dy=16, taille=14):
    S.ligne(R(v, 0) + [0, -3], R(v, 0) + [0, 3], c)
    _etiq(S, R(v, 0) + [0, dy], lab, c, taille=taille)


def _grad_y(S, R, v, lab, c='g', dx=-8, taille=14, ox=0):
    S.ligne(R(ox, v) + [-3, 0], R(ox, v) + [3, 0], c)
    _etiq(S, R(ox, v) + [dx, 0], lab, c, ancre='end' if dx < 0 else 'start', taille=taille)


def _premiers(n):
    return [p for p in range(2, n + 1) if all(p % d for d in range(2, int(p ** 0.5) + 1))]


@schema('lex-fonction-zeta-2')
def lex_fonction_zeta_2():
    Hh = 290
    S = Schema(W, Hh, 'La fonction ζ sur ]0, 1[ et ]1, 4], entre 1/(σ − 1) et 1/(σ − 1) + 1')
    R = Repere(-0.25, 4.2, -4.6, 5.2, 22, 12, 380, 262)
    _axes(S, R, 'σ', '')
    for a, b in ((0.02, 0.985), (1.015, 4.0)):
        xs = np.linspace(a, b, 500)
        bas = 1 / (xs - 1)
        haut = bas + 1
        z = np.array([float(mp.zeta(x)) for x in xs])
        assert np.all(bas <= z + 1e-12) and np.all(z <= haut + 1e-12)           # encadrement de la légende
        if b < 1:
            assert np.all(z < 0)                                                # ζ négative sur ]0, 1[
        _courbe(S, R, xs, bas, 'g', d=True)
        _courbe(S, R, xs, haut, 'g', d=True)
        _courbe(S, R, xs, z, 'r', l=2.6)
    S.ligne(R(1, R.ymin), R(1, R.ymax), 'g', d=True)
    z12 = float(mp.zeta(0.5))
    assert abs(z12 + 1.46) < 0.005 and -2 <= z12 <= -1
    S.point(R(0.5, z12), 'r', r=4.2)
    _etiq(S, R(0.5, z12) + [-8, 22], 'ζ(1/2)', 'r', ancre='end', taille=16)
    for v in (2, 3, 4):
        _grad_x(S, R, v, str(v))
    _etiq(S, R(1, 0) + [11, 15], '1', 'g', taille=14)
    for v, lab in ((1, '1'), (-4, '−4'), (4, '4')):
        _grad_y(S, R, v, lab)
    zr = float(mp.zeta(1.75))
    assert 1 / 0.75 <= zr <= 1 + 1 / 0.75
    _etiq(S, R(1.75, 1 + 1 / 0.75) + [16, -10], 'ζ', 'r', taille=17)
    return S


@schema('lex-fonction-tchebychev-3')
def lex_fonction_tchebychev_3():
    Hh = 280
    S = Schema(W, Hh, 'La fonction θ sur [1, 100], sous les droites y = x et y = x ln 4')
    R = Repere(-6, 112, -9, 150, 34, 12, 370, 248)
    _axes(S, R, 'x', '')
    P = _premiers(100)
    sauts = [1.0] + [float(p) for p in P] + [100.0]
    th = 0.0
    xs, ys = [], []
    for i in range(len(sauts) - 1):
        a, b = sauts[i], sauts[i + 1]
        if i > 0:
            th += math.log(P[i - 1])
        xs += [a, b]
        ys += [th, th]
        assert th < a and th <= a * math.log(4)                       # légende : θ(x) < x sur [2, 100]
    S.poly(R(np.array(xs), np.array(ys)), 'r', l=2.4)
    x = np.array([0.0, 100.0])
    S.poly(R(x, x * math.log(4)), 'b', l=2)
    S.poly(R(x, x), 'g', d=True, l=1.6)
    for v in (50, 100):
        _grad_x(S, R, v, str(v))
    for v in (50, 100):
        _grad_y(S, R, v, str(v))
    _etiq(S, R(88, 88 * math.log(4)) + [-12, 0], 'x `ln` 4', 'b', ancre='end', taille=16)
    _etiq(S, R(100, 100) + [-4, -16], 'x', 'g', ancre='end', taille=16)
    _etiq(S, R(100, th) + [-4, 16], 'θ', 'r', ancre='end', taille=17)
    return S


@schema('lex-continue-par-morceaux-2')
def lex_continue_par_morceaux_2():
    Hh = 220
    S = Schema(W, Hh, 'La fonction sin(1/t) sur ]0, 1]')
    R = Repere(-0.06, 1.08, -1.3, 1.3, 26, 14, 376, 190)
    _axes(S, R, 't', '')
    umax = 120.0
    u = np.linspace(1.0, umax, 24000)                  # u = 1/t, pas fin en u : oscillations résolues
    t = 1 / u
    S.poly(_simplifie(R(t, np.sin(u)), 1.0), 'r', l=1.1)
    # sur ]0, 1/120], plus de six oscillations par pixel : bande pleine, entre −1 et 1
    a, b = R(0, 1), R(1 / umax, -1)
    assert (1 / umax) * 376 / 1.14 < 4                                  # la bande fait moins de 4 px de large
    S.rect(a[0], a[1], b[0] - a[0], b[1] - a[1], 'r', rempli='r')
    # légende : valeurs 1 et −1 en des points qui tendent vers 0
    for k in range(4):
        assert abs(math.sin(math.pi / 2 + 2 * k * math.pi) - 1) < 1e-12
    for v, lab in ((1, '1'), (-1, '−1')):
        S.ligne(R(0, v) + [-3, 0], R(0, v) + [3, 0], 'g')
        _etiq(S, R(0, v) + [-8, 0], lab, 'g', ancre='end', taille=14)
    _grad_x(S, R, 1, '1')
    S.ligne(R(0, 1), R(1.0, 1), 'g', d=True)
    S.ligne(R(0, -1), R(1.0, -1), 'g', d=True)
    return S


@schema('lex-integrale-convergente-3')
def lex_integrale_convergente_3():
    Hh = 200
    S = Schema(W, Hh, 'Des pics de hauteur 1 de plus en plus étroits')
    R = Repere(0.6, 7.6, -0.18, 1.32, 26, 12, 380, 170)
    _axes(S, R, 'x', '', origine=(0.6, 0))
    xs, ys = [1.0], [0.0]
    aires = []
    for k in range(2, 8):
        e = 1 / k ** 2
        xs += [k - e, k, k + e]
        ys += [0, 1, 0]
        aires.append(e)
        assert k + e < (k + 1) - 1 / (k + 1) ** 2                       # pics disjoints
    xs.append(7.5)
    ys.append(0)
    assert abs(sum(aires[:3]) - (1 / 4 + 1 / 9 + 1 / 16)) < 1e-12
    S.poly(R(np.array(xs), np.array(ys)), 'r', l=2.2)
    for k in range(1, 8):
        _grad_x(S, R, k, str(k))
    S.ligne(R(0.6, 1) + [-3, 0], R(0.6, 1) + [3, 0], 'g')
    _etiq(S, R(0.6, 1) + [8, 0], '1', 'g', ancre='start', taille=14)
    S.ligne(R(1.6, 1), R(7.5, 1), 'g', d=True)
    return S
