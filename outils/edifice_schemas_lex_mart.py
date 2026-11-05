"""Schémas des exemples du lexique, théorie mart : contenu/exemples/mart.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées (lois exactes en fractions, trajectoires écrites ici), et ce que la légende
affirme vérifié par assert. Graphes de transition : un cercle par état, une flèche de x vers y quand Q(x, y) > 0,
portant Q(x, y).
"""
import itertools
import math
from fractions import Fraction as Fr

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte, bezier

W0 = 420
TL = 17


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


def _frac(q):
    q = Fr(q)
    return str(q.numerator) if q.denominator == 1 else f'{q.numerator}/{q.denominator}'


def _etat(S, c, nom, r=20, col='t'):
    S.cercle(c, r, col)
    S.texte(c, nom, col, taille=TL)


def _arc_entre(S, a, b, r, col, lab, dec=9, cote=1, dlab=15, taille=17, l=None):
    """Flèche droite de l'état a vers l'état b, décalée de « dec » du côté « cote » (pour les allers-retours)."""
    a, b = np.asarray(a, float), np.asarray(b, float)
    u = (b - a) / np.linalg.norm(b - a)
    n = cote * np.array([u[1], -u[0]])
    p, q = a + r * u + dec * n, b - r * u + dec * n
    S.fleche(p, q, col, l=l)
    if lab:
        _etiq(S, (p + q) / 2 + dlab * n, lab, col, taille=taille)


def _boucle(S, c, r, col, lab, haut=True, taille=17, l=None):
    """Boucle au-dessus (ou au-dessous) de l'état de centre c."""
    c = np.asarray(c, float)
    sg = -1 if haut else 1
    p0 = c + r * np.array([math.cos(-2.1), sg * -math.sin(-2.1)])
    p3 = c + r * np.array([math.cos(-1.04), sg * -math.sin(-1.04)])
    courbe = bezier(p0, c + [-34, sg * 66], c + [34, sg * 66], p3, n=60)
    S.courbe_fleche(courbe, col, l=l)
    _etiq(S, c + [0, sg * 64], lab, col, taille=taille)


def _matmul(A, B):
    return [[sum(A[i][k] * B[k][j] for k in range(len(B))) for j in range(len(B[0]))] for i in range(len(A))]


def _sommes(e):
    s = [0]
    for x in e:
        s.append(s[-1] + x)
    return s


# ---------------------------------------------------------------------------------------------- paquet 1

@schema('lex-matrice-transition-1')
def lex_matrice_transition_1():
    Q = [[Fr(0), Fr(1)], [Fr(1, 2), Fr(1, 2)]]
    assert all(sum(l) == 1 for l in Q)
    Q2 = _matmul(Q, Q)
    # un seul chemin de longueur 2 de 1 à 1, par 2
    assert [k for k in range(2) if Q[0][k] * Q[k][0] > 0] == [1] and Q2[0][0] == Q[0][1] * Q[1][0] == Fr(1, 2)
    S = Schema(W0, 170, 'Graphe de transition d’une chaîne à deux états')
    r = 22
    c1, c2 = np.array([120.0, 108.0]), np.array([300.0, 108.0])
    _etat(S, c1, '1', r)
    _etat(S, c2, '2', r)
    _arc_entre(S, c1, c2, r, 'r', _frac(Q[0][1]), cote=1, l=2.2)       # au-dessus
    _arc_entre(S, c2, c1, r, 'r', _frac(Q[1][0]), cote=1, l=2.2)       # au-dessous (sens inverse)
    _boucle(S, c2, r, 'g', _frac(Q[1][1]))
    return S


@schema('lex-matrice-transition-3')
def lex_matrice_transition_3():
    N = 4
    Q = {}
    Q[(0, 1)] = Fr(1)
    for x in range(1, N + 1):
        Q[(x, x - 1)] = Fr(1, 2)
        Q[(x, x + 1)] = Fr(1, 2)
    for x in range(N + 1):
        assert sum(v for (a, b), v in Q.items() if a == x) == 1
    S = Schema(W0, 150, 'Marche sur ℕ réfléchie en 0')
    r = 17
    pas = 80
    xs = [30 + pas * k for k in range(N + 1)]
    y = 78
    for k, x in enumerate(xs):
        _etat(S, (x, y), str(k), r)
    for (a, b), v in Q.items():
        if b > N:
            # flèche vers les états suivants, non dessinés
            p = np.array([xs[a] + r, y - 7])
            S.fleche(p, p + [22, 0], 'g')
            continue
        cote = 1 if b > a else 1
        _arc_entre(S, (xs[a], y), (xs[b], y), r, 'g', _frac(v), dec=7, cote=cote, dlab=13, taille=17)
    _etiq(S, (xs[-1] + r + 38, y + 7), '…', 'g')
    return S


@schema('lex-martingale-3')
def lex_martingale_3():
    def M(pre):
        suites = [pre + rr for rr in itertools.product((1, -1), repeat=3 - len(pre))]
        return Fr(sum(1 for e in suites if sum(e) > 0), len(suites))
    for k in range(3):
        for pre in itertools.product((1, -1), repeat=k):
            assert M(pre) == (M(pre + (1,)) + M(pre + (-1,))) / 2
    S = Schema(W0, 296, 'Arbre des valeurs de la martingale M_n = E[X | F_n]')
    X = [40, 150, 262, 374]
    feuilles = list(itertools.product((1, -1), repeat=3))
    yf = {f: 24 + 35 * i for i, f in enumerate(feuilles)}

    def y(pre):
        return float(np.mean([yf[f] for f in feuilles if f[:len(pre)] == pre]))
    taille = 16
    for k in range(4):
        for pre in itertools.product((1, -1), repeat=k):
            v = M(pre)
            lab = _frac(v)
            col = ('r' if v == 1 else 't') if k == 3 else 't'
            _etiq(S, (X[k], y(pre)), lab, col, taille=taille)
            if k < 3:
                w0 = largeur_texte(lab, taille) / 2 + 6
                for sgn in (1, -1):
                    fils = pre + (sgn,)
                    w1 = largeur_texte(_frac(M(fils)), taille) / 2 + 6
                    S.ligne((X[k] + w0, y(pre)), (X[k + 1] - w1, y(fils)), 'g')
    for k in range(4):
        _etiq(S, (X[k], 286), f'M_{k}', 'g', taille=17)
    return S


@schema('lex-temps-arret-1')
def lex_temps_arret_1():
    e = (1, -1, -1, 1, 1, 1, -1, 1, 1, -1)
    s = _sommes(e)
    T = next(n for n, v in enumerate(s) if v == 2)
    assert T == 6 and all(v < 2 for v in s[:T])
    W, H = W0, 230
    R = Repere(-0.9, 10.9, -1.8, 3.6, 14, 12, W - 26, H - 30)
    S = Schema(W, H, 'Premier instant où la marche atteint 2')
    _axes(S, R, 'n', 'S_n')
    S.ligne(R(0, 2), R(10.5, 2), 'g', d=True)
    _grad_y(S, R, 2, '2')
    _grad_y(S, R, -1, '−1')
    for k in (2, 4, 8, 10):
        _grad_x(S, R, k, str(k))
    pts = np.array([[k, v] for k, v in enumerate(s)], float)
    S.poly(R(pts[T:, 0], pts[T:, 1]), 'g', l=1.8)
    S.poly(R(pts[:T + 1, 0], pts[:T + 1, 1]), 'r', l=2.4)
    for k in range(T + 1):
        S.point(R(k, s[k]), 'r', r=3)
    S.ligne(R(T, 0), R(T, 2), 'r', d=True)
    _etiq(S, R(T, 0) + [0, 17], 'T = 6', 'r', taille=17)
    return S


@schema('lex-temps-arret-2')
def lex_temps_arret_2():
    debut = (1, -1)
    cont = list(itertools.product((1, -1), repeat=2))

    def L(e):
        s = _sommes(e)
        return max(n for n in range(5) if s[n] == 0)
    couleurs = {c: ('b' if L(debut + c) == 4 else 'r') for c in cont}
    assert sorted(L(debut + c) for c in cont) == [2, 2, 4, 4]
    W, H = W0, 250
    R = Repere(-0.7, 5.3, -2.6, 2.6, 14, 14, W - 30, H - 34)
    S = Schema(W, H, 'Le dernier passage en 0 avant l’instant 4 dépend de l’avenir')
    _axes(S, R, 'n', 'S_n')
    for k in (1, 2, 3, 4):
        _grad_x(S, R, k, str(k), dy=-14 if k == 2 else 16) if k != 4 else _grad_x(S, R, k, '4', dy=17)
    for v in (-2, 2):
        _grad_y(S, R, v, '−2' if v < 0 else '2')
    S.poly(R([0, 1, 2], [0, 1, 0]), 't', l=2.4)
    # derniers segments : décalés perpendiculairement quand deux trajectoires les partagent
    segs = {}
    for c in cont:
        s = _sommes(debut + c)
        for k in (2, 3):
            segs.setdefault(((k, s[k]), (k + 1, s[k + 1])), []).append(couleurs[c])
    for (a, b), cols in segs.items():
        pa, pb = R(*a), R(*b)
        u = (pb - pa) / np.linalg.norm(pb - pa)
        n = np.array([-u[1], u[0]])
        for i, col in enumerate(sorted(cols)):
            dec = (i - (len(cols) - 1) / 2) * 4.5
            S.ligne(pa + dec * n, pb + dec * n, col, l=2.2)
    for c in cont:
        s = _sommes(debut + c)
        S.point(R(4, s[4]), couleurs[c], r=4.5)
    S.point(R(2, 0), 't', r=4.5)
    _etiq(S, R(4, 2) + [10, 0], 'L = 2', 'r', ancre='start', taille=17)
    _etiq(S, R(4, -2) + [10, 0], 'L = 2', 'r', ancre='start', taille=17)
    _etiq(S, R(4, 0) + [10, -14], 'L = 4', 'b', ancre='start', taille=17)
    return S


@schema('lex-filtration-1')
def lex_filtration_1():
    elts = list(itertools.product((1, -1), repeat=3))
    nom = lambda w: ''.join('+' if x > 0 else '−' for x in w)
    W, H = W0, 262
    x0, pas = 66, 46
    xs = [x0 + pas * i for i in range(8)]
    assert xs[-1] + pas / 2 <= W - 4
    S = Schema(W, H, 'Atomes des tribus F_0, F_1, F_2 et F_3')
    for i, w in enumerate(elts):
        _etiq(S, (xs[i], 22), nom(w), 't', taille=17)
    for n in range(4):
        y = 68 + 56 * n
        _etiq(S, (8, y), f'ℱ_{n}', 'g', ancre='start', taille=17)
        atomes = {}
        for i, w in enumerate(elts):
            atomes.setdefault(w[:n], []).append(i)
        assert len(atomes) == 2 ** n and all(len(v) == 2 ** (3 - n) for v in atomes.values())
        if n < 3:
            # chaque atome de F_n est réunion de deux atomes de F_{n+1}
            for pre, idx in atomes.items():
                assert sorted(idx) == sorted([i for i, w in enumerate(elts) if w[:n + 1] in (pre + (1,), pre + (-1,))])
        for pre, idx in atomes.items():
            a, b = xs[min(idx)] - pas / 2 + 3, xs[max(idx)] + pas / 2 - 3
            S.rect(a, y - 17, b - a, 34, 'r' if n == 3 else 'b', rempli='r' if n == 3 else 'b', rx=8)
            for i in idx:
                S.point((xs[i], y), 'r' if n == 3 else 'b', r=3.2)
    return S


@schema('lex-cylindre-trajectoires-1')
def lex_cylindre_trajectoires_1():
    W, H = W0, 296
    X = [44, 168, 322]
    feuilles = list(itertools.product((0, 1), repeat=3))
    yf = {f: 26 + 35 * i for i, f in enumerate(feuilles)}

    def y(pre):
        return float(np.mean([yf[f] for f in feuilles if f[:len(pre)] == pre]))
    nom = lambda pre: 'C(' + ', '.join(map(str, pre)) + ')'
    rouge = lambda pre: pre[:2] == (0, 1)
    S = Schema(W, H, 'Arbre des cylindres sur {0, 1}')
    taille = 16
    for k in (1, 2, 3):
        for pre in itertools.product((0, 1), repeat=k):
            col = 'r' if rouge(pre) else 't'
            _etiq(S, (X[k - 1], y(pre)), nom(pre), col, taille=taille)
            if k < 3:
                w0 = largeur_texte(nom(pre), taille) / 2 + 5
                for c in (0, 1):
                    f = pre + (c,)
                    w1 = largeur_texte(nom(f), taille) / 2 + 5
                    S.ligne((X[k - 1] + w0, y(pre)), (X[k] - w1, y(f)), 'r' if rouge(f) else 'g')
    # contrôle : les cylindres rouges sont exactement ceux du sous-arbre de (0, 1)
    suites = list(itertools.product((0, 1), repeat=4))
    A = {w for w in suites if w[:2] == (0, 1)}
    for k in (1, 2, 3):
        for pre in itertools.product((0, 1), repeat=k):
            B = {w for w in suites if w[:k] == pre}
            assert (B <= A) == (rouge(pre) and k >= 2)
            assert (B <= A) or (A <= B) or not (A & B)
    return S


@schema('lex-temps-retour-3')
def lex_temps_retour_3():
    a, b = Fr(3, 10), Fr(1, 10)
    nmax = 40
    surv = [Fr(1)] + [a * (1 - b) ** (n - 1) for n in range(1, nmax + 1)]
    # somme des P(T > n) : 1 + a/b = 4 (série géométrique)
    assert abs(float(sum(surv)) + float(a * (1 - b) ** nmax / b) - 4) < 1e-12
    W, H = W0, 240
    R = Repere(-1.5, nmax + 2.5, -0.06, 1.12, 30, 12, W - 44, H - 34)
    S = Schema(W, H, 'Fonction de survie du temps de retour')
    # aire sous l'escalier
    pts = []
    for n in range(nmax + 1):
        pts += [(n, float(surv[n])), (n + 1, float(surv[n]))]
    S.surface(R(*np.array([(0, 0)] + pts + [(nmax + 1, 0)]).T), 'r')
    S.poly(R(*np.array(pts).T), 'r', l=2)
    _axes(S, R, 'n', '')
    S.fleche(R(0, -0.06), R(0, 1.12), 'g')
    for v, lab in [(1, '1'), (0.3, '0,3')]:
        _grad_y(S, R, v, lab)
    for k in (1, 10, 20, 30, 40):
        _grad_x(S, R, k, str(k))
    _etiq(S, R(14, 0.55), 'P_1(T_1 > n)', 'r', ancre='start', taille=17)
    _etiq(S, R(14, 0.38), '`aire` = E_1[T_1] = 4', 'r', ancre='start', taille=17)
    return S


# ---------------------------------------------------------------------------------------------- paquet 2

def _loi_arretee(n, niveau=1):
    dist, absorbe = {0: Fr(1)}, Fr(0)
    for _ in range(n):
        nd = {}
        for x, p in dist.items():
            for e in (1, -1):
                y = x + e
                if y == niveau:
                    absorbe += p / 2
                else:
                    nd[y] = nd.get(y, 0) + p / 2
        dist = nd
    return absorbe, dist


@schema('lex-martingale-arretee-3')
def lex_martingale_arretee_3():
    ab, dist = _loi_arretee(10)
    assert ab == Fr(193, 256) and ab + sum(x * p for x, p in dist.items()) == 0
    assert sorted(dist) == [-10, -8, -6, -4, -2, 0]
    W, H = W0, 230
    R = Repere(-11.4, 2.0, -0.05, 0.84, 14, 12, W - 26, H - 34)
    S = Schema(W, H, 'Loi de la marche arrêtée au premier passage en 1, à l’instant 10')
    _axes(S, R, '', '', origine=(-11, 0))
    larg = 0.7
    for x, p in list(dist.items()) + [(1, ab)]:
        col = 'r' if x == 1 else 'b'
        S.rect(*R(x - larg / 2, float(p)), (R(x + larg / 2, 0) - R(x - larg / 2, 0))[0],
               (R(0, 0) - R(0, float(p)))[1], col, rempli=col)
    for x in (-10, -8, -6, -4, -2, 0, 1):
        _grad_x(S, R, x, '−' + str(-x) if x < 0 else str(x), dy=15)
    _grad_y(S, R, 0.25, '0,25', x0=-11, dx=8)
    _etiq(S, R(1, float(ab)) + [0, -13], '193/256', 'r', taille=17)
    # moyenne conditionnelle hors de {T ≤ 10}, marquée en pointillé
    m = float(sum(x * p for x, p in dist.items()) / (1 - ab))
    assert abs(m + 3.0635) < 1e-3
    S.ligne(R(m, 0), R(m, 0.3), 'b', d=True)
    _etiq(S, R(m, 0.3) + [0, -12], '≈ −3,06', 'b', taille=17)
    return S


@schema('lex-nombre-montees-1')
def lex_nombre_montees_1():
    M = [0, 3, -1, 2, 1, -2, 4, -1, 1]
    a, b = 0, 2
    sig, tau = [0, 2, 5, 7], [1, 3, 6]
    # contrôle des instants de la légende, recalculés
    t, s_l, t_l = 0, [], []
    while True:
        s = next((k for k in range(t, 9) if M[k] <= a), None)
        if s is None:
            break
        s_l.append(s)
        u = next((k for k in range(s + 1, 9) if M[k] >= b), None)
        if u is None:
            break
        t_l.append(u)
        t = u
    assert s_l == sig and t_l == tau
    W, H = W0, 250
    R = Repere(-0.7, 8.8, -3.5, 4.7, 14, 12, W - 26, H - 30)
    S = Schema(W, H, 'Montées de 0 à 2 d’une suite')
    for j, s in enumerate(sig):
        fin = tau[j] if j < len(tau) else 8
        col = 'r' if j < len(tau) else 'b'
        S.surface(R(np.array([s, fin, fin, s]), np.array([-2.6, -2.6, 4.5, 4.5])), col)
    _axes(S, R, 'k', 'M_k')
    for v, lab in [(a, ''), (b, 'b = 2')]:
        S.ligne(R(0, v), R(8.6, v), 'g', d=True)
    _grad_y(S, R, 2, '2')
    _grad_y(S, R, -2, '−2')
    for k in (2, 4, 6, 8):
        _grad_x(S, R, k, '')
        _etiq(S, R(k, -3.05), str(k), 'g', taille=17)
    S.poly(R(np.arange(9), M), 't', l=2)
    for k in range(9):
        S.point(R(k, M[k]), 't', r=3)
    return S


@schema('lex-chaine-jusqu-instant-3')
def lex_chaine_jusqu_instant_3():
    Q = [[Fr(1, 2), Fr(1, 2), Fr(0)], [Fr(1, 4), Fr(1, 2), Fr(1, 4)], [Fr(0), Fr(1, 3), Fr(2, 3)]]
    chemins = [(x1, x2) for x1 in range(3) for x2 in range(3) if Q[0][x1] * Q[x1][x2] > 0]
    assert len(chemins) == 5 and sum(Q[0][x1] * Q[x1][x2] for x1, x2 in chemins) == 1
    W, H = W0, 250
    S = Schema(W, H, 'Arbre des chemins de longueur 2 issus de 1')
    yf = {c: 26 + 49 * i for i, c in enumerate(chemins)}
    premiers = sorted({c[0] for c in chemins})
    y1 = {x1: float(np.mean([yf[c] for c in chemins if c[0] == x1])) for x1 in premiers}
    y0 = float(np.mean(list(y1.values())))
    X = [40, 170, 290]
    r = 16
    _etat(S, (X[0], y0), '1', r)
    for x1 in premiers:
        a, bb = np.array([X[0], y0]), np.array([X[1], y1[x1]])
        u = (bb - a) / np.linalg.norm(bb - a)
        S.ligne(a + r * u, bb - r * u, 'g')
        nn = np.array([u[1], -u[0]])
        if nn[1] > 0:
            nn = -nn
        if x1 != premiers[0]:
            nn = -nn
        _etiq(S, (a + bb) / 2 + 16 * nn, _frac(Q[0][x1]), 'g', taille=17)
        _etat(S, (X[1], y1[x1]), str(x1 + 1), r)
    for c in chemins:
        a, bb = np.array([X[1], y1[c[0]]]), np.array([X[2], yf[c]])
        u = (bb - a) / np.linalg.norm(bb - a)
        S.ligne(a + r * u, bb - r * u, 'g')
        nrm = np.array([u[1], -u[0]])
        if nrm[1] > 0:
            nrm = -nrm                      # normale vers le haut
        if u[1] > 0.05:
            nrm = -nrm                      # arête descendante : étiquette dessous
        m = a + 0.7 * (bb - a) + 14 * nrm
        _etiq(S, m, _frac(Q[c[0]][c[1]]), 'g', taille=17)
        _etat(S, (X[2], yf[c]), str(c[1] + 1), r)
        _etiq(S, (X[2] + r + 12, yf[c]), _frac(Q[0][c[0]] * Q[c[0]][c[1]]), 'r', ancre='start', taille=17)
    return S


@schema('lex-variable-valeurs-denombrable-1')
def lex_variable_valeurs_denombrable_1():
    W, H = W0, 120
    S = Schema(W, H, 'Les événements {X = k} dans [0, 1[')
    x0, x1 = 16, W - 16
    X = lambda t: x0 + (x1 - x0) * t
    y = 56
    cols = ['r', 'b', 'v', 'r', 'b', 'v', 'r']
    for k in range(1, 8):
        a, b = Fr(1, 2 ** k), Fr(1, 2 ** (k - 1))
        assert b - a == Fr(1, 2 ** k)
        S.rect(X(float(a)), y - 14, X(float(b)) - X(float(a)), 28, cols[k - 1], rempli=cols[k - 1])
        if k <= 4:
            _etiq(S, ((X(float(a)) + X(float(b))) / 2, y), str(k), cols[k - 1], taille=17)
    S.ligne((x0, y + 22), (x1, y + 22), 'g')
    for t, lab in [(0, '0'), (0.125, '1/8'), (0.25, '1/4'), (0.5, '1/2'), (1, '1')]:
        S.ligne((X(t), y + 18), (X(t), y + 26), 'g')
        _etiq(S, (X(t), y + 42), lab, 'g', taille=17)
    _etiq(S, (X(0.75), y - 30), '`valeur de` X', 'g', taille=17)
    return S


@schema('lex-etat-aperiodique-2')
def lex_etat_aperiodique_2():
    Q = [[Fr(0), Fr(1), Fr(0)], [Fr(1, 2), Fr(0), Fr(1, 2)], [Fr(1), Fr(0), Fr(0)]]
    assert all(sum(l) == 1 for l in Q) and all(Q[x][x] == 0 for x in range(3))
    W, H = W0, 196
    S = Schema(W, H, 'Un état apériodique sans boucle')
    c = {0: np.array([110.0, 140.0]), 1: np.array([300.0, 140.0]), 2: np.array([205.0, 40.0])}
    r = 22
    for k, p in c.items():
        _etat(S, p, str(k + 1), r)
    _arc_entre(S, c[0], c[1], r, 't', _frac(Q[0][1]), cote=-1, dec=8)       # 1 → 2, dessous
    _arc_entre(S, c[1], c[0], r, 'b', _frac(Q[1][0]), cote=-1, dec=8)       # 2 → 1, dessus... côté opposé
    _arc_entre(S, c[1], c[2], r, 'r', _frac(Q[1][2]), cote=1, dec=0, dlab=16)
    _arc_entre(S, c[2], c[0], r, 'r', _frac(Q[2][0]), cote=1, dec=0, dlab=16)
    return S


@schema('lex-classe-fermee-1')
def lex_classe_fermee_1():
    W, H = W0, 170
    S = Schema(W, H, 'Classes de la ruine du joueur sur {0, 1, 2, 3}')
    xs = [44, 160, 260, 376]
    y = 96
    r = 18
    # classes entourées
    S.rect(xs[0] - 34, y - 86, 68, 130, 'r', rempli='r', rx=14)
    S.rect(xs[3] - 34, y - 86, 68, 130, 'r', rempli='r', rx=14)
    S.rect(xs[1] - 34, y - 86, xs[2] - xs[1] + 68, 130, 'b', rempli='b', rx=14)
    for k, x in enumerate(xs):
        _etat(S, (x, y), str(k), r)
    _boucle(S, (xs[0], y), r, 'g', '1', taille=17)
    _boucle(S, (xs[3], y), r, 'g', '1', taille=17)
    _arc_entre(S, (xs[1], y), (xs[0], y), r, 'g', '1/2', dec=0, cote=1, dlab=12, taille=17)
    _arc_entre(S, (xs[2], y), (xs[3], y), r, 'g', '1/2', dec=0, cote=-1, dlab=12, taille=17)
    _arc_entre(S, (xs[1], y), (xs[2], y), r, 'g', '1/2', dec=7, cote=1, dlab=12, taille=17)
    _arc_entre(S, (xs[2], y), (xs[1], y), r, 'g', '1/2', dec=7, cote=1, dlab=12, taille=17)
    return S


# ---------------------------------------------------------------------------------------------- paquet 3

@schema('lex-periode-etat-2')
def lex_periode_etat_2():
    # 1 → 2 → 3 → 4 → 1 (rouge) et 1 → 5 → … → 9 → 1 (bleu)
    Q = [[Fr(0)] * 9 for _ in range(9)]
    Q[0][1] = Q[0][4] = Fr(1, 2)
    for a, b in [(1, 2), (2, 3), (3, 0), (4, 5), (5, 6), (6, 7), (7, 8), (8, 0)]:
        Q[a][b] = Fr(1)
    R = []
    P = [[Fr(int(i == j)) for j in range(9)] for i in range(9)]
    for n in range(1, 25):
        P = _matmul(P, Q)
        if P[0][0] > 0:
            R.append(n)
    assert R == list(range(4, 25, 2)) and math.gcd(*R) == 2
    W, H = W0, 250
    S = Schema(W, H, 'Deux circuits de longueurs 4 et 6 issus de l’état 1')
    c1 = np.array([210.0, 125.0])
    r = 16
    # circuit de longueur 4 à gauche (carré), de longueur 6 à droite (hexagone)
    g = [c1 + 78 * np.array([math.cos(t), math.sin(t)]) - [78, 0] for t in (0, math.pi / 2, math.pi, -math.pi / 2)]
    g = [c1 + np.array([-62, 62]), c1 + np.array([-124, 0]), c1 + np.array([-62, -62])]
    gauche = [c1] + g                                         # états 1, 2, 3, 4
    d = [c1 + 92 * np.array([math.cos(t), math.sin(t)]) + [92, 0] for t in np.linspace(math.pi, -math.pi, 7)[1:-1]]
    droite = [c1] + d                                          # états 1, 5, 6, 7, 8, 9
    pos = {0: c1, 1: g[0], 2: g[1], 3: g[2], 4: d[0], 5: d[1], 6: d[2], 7: d[3], 8: d[4]}
    for a in range(9):
        for b in range(9):
            if Q[a][b] > 0:
                col = 'r' if a in (0, 1, 2, 3) and b in (1, 2, 3, 0) else 'b'
                if (a, b) == (0, 4):
                    col = 'b'
                u = (pos[b] - pos[a]) / np.linalg.norm(pos[b] - pos[a])
                S.fleche(pos[a] + r * u, pos[b] - r * u, col, l=1.8)
    for k, p in pos.items():
        _etat(S, p, str(k + 1), r)
    for p in list(pos.values()):
        _dans_cadre(S, p + [0, r], '0', taille=2)
    _etiq(S, (c1[0] - 62, c1[1] + 4), '4', 'r', taille=17)
    _etiq(S, (c1[0] + 92, c1[1] + 4), '6', 'b', taille=17)
    return S


@schema('lex-etat-recurrent-2')
def lex_etat_recurrent_2():
    W, H = W0, 196
    S = Schema(W, H, 'Chaîne d’échappement sur ℕ')
    n = 5
    pas = 72
    xs = [34 + pas * k for k in range(n)]
    y = 80
    r = 17
    for k, x in enumerate(xs):
        _etat(S, (x, y), str(k), r)
    for k in range(n):
        if k + 1 < n:
            _arc_entre(S, (xs[k], y), (xs[k + 1], y), r, 't', f'p_{k}', dec=0, dlab=13, taille=17)
        else:
            S.fleche((xs[k] + r, y), (xs[k] + r + 26, y), 't')
            _etiq(S, (xs[k] + r + 40, y + 5), '…', 'g')
    # retours vers 0 : arcs sous la rangée
    for k in range(1, n):
        p0 = np.array([xs[k], y + r])
        p3 = np.array([xs[0] + 6, y + r])
        haut = 30 + 16 * k
        courbe = bezier(p0, p0 + [0, haut], p3 + [12, haut], p3, n=80)
        S.courbe_fleche(courbe, 'g', l=1.3)
    _boucle(S, (xs[0], y), r, 'g', '1 − p_0', haut=True, taille=17)
    _etiq(S, (xs[2] + 30, y + 98), '`retours vers` 0 `:` 1 − p_x', 'g', taille=17)
    return S


@schema('lex-esperance-conditionnelle-2')
def lex_esperance_conditionnelle_2():
    for s in range(2, 13):
        cases = [(a, b) for a in range(1, 7) for b in range(1, 7) if a + b == s]
        assert Fr(sum(a for a, b in cases), len(cases)) == Fr(s, 2)
    W, H = W0, 290
    pas = 38
    x0, y0 = 100, 20
    S = Schema(W, H, 'Les atomes de σ(D₁ + D₂) et la moyenne de D₁ sur chacun')
    X = lambda d1: x0 + pas * (d1 - 1)
    Y = lambda d2: y0 + pas * (6 - d2)
    for s in range(2, 13):
        cases = [(a, s - a) for a in range(1, 7) if 1 <= s - a <= 6]
        a0, a1 = cases[0], cases[-1]
        col = 'b' if s == 8 else 'g'
        S.ligne((X(a0[0]), Y(a0[1])), (X(a1[0]), Y(a1[1])), col, l=2.6 if s == 8 else 1.2)
        m = Fr(s, 2)
        S.point((X(float(m)), Y(s - float(m))), 'r', r=4)
    for a in range(1, 7):
        for b in range(1, 7):
            S.point((X(a), Y(b)), 'b' if a + b == 8 else 't', r=3.2)
    for s in range(2, 13):
        m = s / 2
        S.point((X(m), Y(s - m)), 'r', r=6, creux=True)
    for k in range(1, 7):
        _etiq(S, (X(k), Y(1) + 26), str(k), 'g', taille=17)
        _etiq(S, (X(1) - 22, Y(k)), str(k), 'g', taille=17)
    _etiq(S, (X(3.5), Y(1) + 48), 'D_1', 'g', taille=17)
    _etiq(S, (X(1) - 50, Y(3.5)), 'D_2', 'g', taille=17)
    return S


@schema('lex-martingale-fermee-2')
def lex_martingale_fermee_2():
    rng = np.random.default_rng(7)
    e = rng.choice([1, -1], size=(6, 200))
    M = np.hstack([np.ones((6, 1)), np.cumprod(1 + e / 2, axis=1)])
    assert (M[:, -1] < 1e-3).all()
    L = np.log10(M)
    pente = 0.5 * math.log10(0.75)
    ymin, ymax = -18.2, 2.2
    assert L.min() > ymin and L.max() < ymax
    W, H = W0, 260
    R = Repere(-12, 212, ymin, ymax, 76, 12, W - 90, H - 30)
    S = Schema(W, H, 'Six trajectoires de la martingale produit, en échelle logarithmique')
    _axes(S, R, 'n', '', origine=(0, 0))
    _grad_y(S, R, 0, '')
    _etiq(S, R(0, 0) + [-10, -12], '1', 'g', ancre='end', taille=17)
    for v, lab in [(-5, '10^{−5}'), (-10, '10^{−10}'), (-15, '10^{−15}')]:
        _grad_y(S, R, v, lab, dx=-8)
    for k in (50, 100, 150):
        _grad_x(S, R, k, str(k), dy=-13)
    S.ligne(R(0, 0), R(200, 200 * pente), 'g', d=True)
    for i in range(6):
        S.poly(R(np.arange(201), L[i]), 'r', l=1.3)
    return S
