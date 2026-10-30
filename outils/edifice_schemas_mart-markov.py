"""Schémas du chapitre « Chaînes de Markov » (graphe mart-markov) : graphe de transition de la chaîne à trois
états prise pour exemple, marches sur des cycles pair et impair, trajectoire de la marche simple sur ℤ²,
probabilité de gain dans la ruine du joueur, fréquences de visite le long d'une trajectoire, convergence de la
loi vers π et borne du couplage. Les lois sont calculées exactement (fractions), les simulations emploient
numpy.random.default_rng avec des graines écrites ici."""
from fractions import Fraction as Fr
import math

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, bezier

# La chaîne d'exemple du nœud mk-transition
Q3 = [[Fr(1, 2), Fr(1, 2), Fr(0)], [Fr(1, 4), Fr(1, 2), Fr(1, 4)], [Fr(0), Fr(1, 3), Fr(2, 3)]]
PI3 = [Fr(2, 9), Fr(4, 9), Fr(1, 3)]


def _produit(lam, Q):
    return [sum(lam[i] * Q[i][j] for i in range(len(lam))) for j in range(len(Q[0]))]


def _matmul(A, B):
    return [_produit(ligne, B) for ligne in A]


def _verifie_q3():
    assert all(sum(l) == 1 for l in Q3)
    assert _produit(PI3, Q3) == PI3 and sum(PI3) == 1


def _tic_x(S, R, x, y, nom, c='g', taille=14, dy=16):
    S.ligne(R(x, y) + [0, -4], R(x, y) + [0, 4], c)
    S.texte(R(x, y) + [0, dy], nom, c, taille=taille)


def _tic_y(S, R, x, y, nom, c='g', taille=14, dx=-8):
    S.ligne(R(x, y) + [-4, 0], R(x, y) + [4, 0], c)
    S.texte(R(x, y) + [dx, 0], nom, c, ancre='end', taille=taille)


@schema('mk-transition')
def mk_transition():
    _verifie_q3()
    Q2 = _matmul(Q3, Q3)
    assert Q2[0][2] == Fr(1, 8) == Q3[0][1] * Q3[1][2]
    # Les chemins de longueur 2 de 1 à 3 : un seul, par 2.
    assert [k for k in range(3) if Q3[0][k] * Q3[k][2] > 0] == [1]
    S = Schema(520, 205, 'Graphe de transition de la chaîne à trois états')
    centres = {0: np.array([90.0, 112.0]), 1: np.array([260.0, 112.0]), 2: np.array([430.0, 112.0])}
    r = 26
    for k, c in centres.items():
        S.cercle(c, r, 't')
        S.texte(c, str(k + 1), 't')
    etiq = lambda q: f'{q.numerator}/{q.denominator}'
    rouge = {(0, 1), (1, 2)}
    for i in range(3):
        for j in range(3):
            q = Q3[i][j]
            if q == 0:
                continue
            if i == j:
                # boucle au-dessus de l'état
                c = centres[i]
                p0 = c + r * np.array([math.cos(-2.1), math.sin(-2.1)])
                p3 = c + r * np.array([math.cos(-1.04), math.sin(-1.04)])
                courbe = bezier(p0, c + [-40, -78], c + [40, -78], p3, n=60)
                S.courbe_fleche(courbe, 'g', l=1.6)
                S.texte(c + [0, -76], etiq(q), 'g', taille=15)
                continue
            a, b = centres[i], centres[j]
            u = (b - a) / np.linalg.norm(b - a)
            n = np.array([u[1], -u[0]])       # au-dessus pour i < j (y vers le bas)
            dec = 9
            p, q_ = a + r * u + dec * n, b - r * u + dec * n
            col = 'r' if (i, j) in rouge else 'g'
            S.fleche(p, q_, col, l=2.2 if col == 'r' else 1.6)
            m = (p + q_) / 2 + 16 * n
            S.texte(m, etiq(q), col, taille=15)
    S.texte((260, 192), 'chemin de longueur 2 de 1 à 3 : Q²(1, 3) = 1/2 · 1/4 = 1/8', 'r', ui=True)
    return S


@schema('mk-classes')
def mk_classes():
    S = Schema(520, 250, 'Marches sur des cycles à 6 et à 5 états')
    for m, cx in [(6, 135), (5, 385)]:
        c = np.array([cx, 118.0])
        R0 = 82
        pts = [c + R0 * np.array([math.cos(-math.pi / 2 + 2 * math.pi * k / m),
                                  math.sin(-math.pi / 2 + 2 * math.pi * k / m)]) for k in range(m)]
        if m % 2 == 0:
            couleurs = ['r' if k % 2 == 0 else 'b' for k in range(m)]
            # chaque arête relie deux couleurs différentes
            assert all(couleurs[k] != couleurs[(k + 1) % m] for k in range(m))
        else:
            # aucune 2-coloration propre du cycle impair : on les essaie toutes
            import itertools
            assert not any(all(c[k] != c[(k + 1) % m] for k in range(m))
                           for c in itertools.product((0, 1), repeat=m))
            couleurs = ['t'] * m
        for k in range(m):
            a, b = pts[k], pts[(k + 1) % m]
            u = (b - a) / np.linalg.norm(b - a)
            col = 'r' if m % 2 else 'g'
            if m % 2:
                S.fleche(a + 13 * u, b - 13 * u, col, l=2)
            else:
                S.ligne(a + 13 * u, b - 13 * u, col, l=1.6)
        for k in range(m):
            S.cercle(pts[k], 12, couleurs[k], rempli=None if couleurs[k] == 't' else couleurs[k])
            S.texte(pts[k], str(k), couleurs[k], taille=14)
        S.texte((cx, 232), f'm = {m} : période {2 if m % 2 == 0 else 1}', ui=True)
    return S


def _marche_plan(graine=5, n=5000):
    rng = np.random.default_rng(graine)
    d = rng.integers(0, 4, n)
    pas = np.array([[1, 0], [-1, 0], [0, 1], [0, -1]])[d]
    return np.vstack([[0, 0], np.cumsum(pas, 0)])


@schema('mk-polya')
def mk_polya():
    P = _marche_plan()
    retours = np.nonzero((P == 0).all(1))[0][1:]
    dist = np.hypot(P[:, 0], P[:, 1])
    # légende : au pas 2549, à plus de 80 unités de l'origine à vol d'oiseau (113 sur le réseau)
    assert int(dist.argmax()) == 2549 and 80 < dist.max() < 81 and np.abs(P).sum(1).max() == 113
    assert retours[-2] < 2549 < retours[-1]
    assert len(retours) == 6 and retours[-1] == 4324
    x0, x1 = P[:, 0].min(), P[:, 0].max()
    y0, y1 = P[:, 1].min(), P[:, 1].max()
    assert (x0, x1, y0, y1) == (-15, 60, -60, 12)
    S = Schema(520, 470, 'Trajectoire de 5000 pas de la marche simple sur ℤ²')
    L = 430
    ech = L / max(x1 - x0, y1 - y0)
    R = Repere(x0 - 2, x0 - 2 + 440 / ech, y0 - 2, y0 - 2 + 440 / ech, 40, 14, 440, 440)
    S.poly(R(P[:, 0], P[:, 1]), 'r', l=0.8)
    S.point(R(0, 0), 'b', r=5.5)
    S.texte(R(0, 0) + [-10, -14], '0', 'b', ancre='end')
    S.point(R(*P[-1]), 't', r=4.5)
    S.texte(R(*P[-1]) + [10, 0], 'X', 't', ancre='start')
    S.texte(R(*P[-1]) + [24, 6], '5000', 't', ancre='start', taille=11)
    # échelle : un segment de 10 pas
    a = R(x1 - 10, y0) + [0, 0]
    b = R(x1, y0)
    S.ligne(a, b, 'g', l=1.6)
    S.texte((a + b) / 2 + [0, 14], '10 pas', 'g', ui=True)
    S.texte((40, 460), f'{len(retours)} retours en 0, le dernier au pas {retours[-1]}', 'b', ancre='start', ui=True)
    return S


@schema('mk-ruine')
def mk_ruine():
    N = 10
    def h(x, p):
        q = 1 - p
        if p == Fr(1, 2):
            return Fr(x, N)
        r = q / p
        return (1 - r ** x) / (1 - r ** N)
    # vérification par le système harmonique h(y) = p h(y+1) + q h(y-1)
    for p in (Fr(1, 2), Fr(9, 20)):
        for y in range(1, N):
            assert h(y, p) == p * h(y + 1, p) + (1 - p) * h(y - 1, p)
        assert h(0, p) == 0 and h(N, p) == 1
    assert h(3, Fr(1, 2)) == Fr(3, 10) and round(float(h(3, Fr(9, 20))), 3) == 0.128
    S = Schema(520, 300, 'Probabilité d’atteindre N = 10 avant 0 selon la fortune initiale')
    R = Repere(-0.5, 10.8, -0.05, 1.08, 50, 16, 440, 240)
    S.fleche(R(-0.5, 0), R(10.8, 0) + [6, 0], 'g')
    S.fleche(R(0, -0.05), R(0, 1.08) + [0, -6], 'g')
    S.texte(R(10.8, 0) + [10, -12], 'x', 'g', ancre='start')
    for x in range(1, 11):
        _tic_x(S, R, x, 0, str(x))
    for v in (0.5, 1):
        _tic_y(S, R, 0, v, f'{v:g}'.replace('.', ','))
    S.ligne(R(0, 1), R(10, 1), 'g', d=True)
    xs = list(range(0, 11))
    for p, c in [(Fr(1, 2), 'b'), (Fr(9, 20), 'r')]:
        pts = R(np.array(xs, float), np.array([float(h(x, p)) for x in xs]))
        S.poly(pts, c, l=1.8)
        for pt in pts:
            S.point(pt, c, r=3.6)
    S.ligne(R(3, 0), R(3, 0.3), 'g', d=True)
    S.texte(R(3, 0.3) + [-8, -12], '0,3', 'b', ancre='end', taille=14)
    S.texte(R(3, float(h(3, Fr(9, 20)))) + [10, 8], '0,128', 'r', ancre='start', taille=14)
    S.texte(R(6.3, 0.72), 'p = 1/2', 'b', ancre='end', taille=15)
    S.texte(R(7.2, 0.25), 'p = 0,45', 'r', ancre='start', taille=15)
    return S


def _simule_q3(n, graine=7, depart=0):
    # Construction de mk-existence : X_{k+1} = f(X_k, U_{k+1}), f par les sommes cumulées des lignes.
    rng = np.random.default_rng(graine)
    U = rng.random(n)
    cum = np.cumsum(np.array(Q3, float), 1)
    X = np.empty(n, int)
    x = depart
    for k in range(n):
        X[k] = x
        x = int(np.searchsorted(cum[x], U[k]))   # plus petit indice tel que U ≤ somme cumulée
    return X


@schema('mk-ergodique')
def mk_ergodique():
    _verifie_q3()
    n = 100000
    X = _simule_q3(n)
    assert X[0] == 0
    ks = np.unique(np.round(np.logspace(0, 5, 400)).astype(int))
    freq = {y: np.cumsum(X == y)[ks - 1] / ks for y in range(3)}
    fin = [freq[y][-1] for y in range(3)]
    assert all(abs(fin[y] - float(PI3[y])) < 0.01 for y in range(3))
    S = Schema(520, 300, 'Fréquences de visite le long d’une trajectoire de la chaîne à trois états')
    R = Repere(0, 5, 0, 1.02, 50, 14, 440, 240)
    S.fleche(R(0, 0), R(5, 0) + [8, 0], 'g')
    S.fleche(R(0, 0), R(0, 1.02) + [0, -6], 'g')
    S.texte(R(5, 0) + [12, -12], 'n', 'g', ancre='start')
    for e in range(0, 6):
        _tic_x(S, R, e, 0, '1' if e == 0 else ('10' if e == 1 else f'10^{e}'))
    for v in (0.5, 1):
        _tic_y(S, R, 0, v, f'{v:g}'.replace('.', ','))
    for y, c in zip(range(3), 'rbv'):
        S.ligne(R(0, float(PI3[y])), R(5, float(PI3[y])), c, d=True)
        S.poly(R(np.log10(ks), freq[y]), c, l=1.6)
    S.texte(R(5, float(PI3[0])) + [4, 10], '2/9', 'r', ancre='end', taille=14)
    S.texte(R(5, float(PI3[1])) + [4, -12], '4/9', 'b', ancre='end', taille=14)
    S.texte(R(5, float(PI3[2])) + [4, -12], '1/3', 'v', ancre='end', taille=14)
    return S


@schema('mk-couplage')
def mk_couplage():
    _verifie_q3()
    Q2 = _matmul(Q3, Q3)
    delta = min(min(l) for l in Q2)
    assert delta == Fr(1, 12) == Q2[2][0]
    lois = [[Fr(1), Fr(0), Fr(0)]]
    for _ in range(30):
        lois.append(_produit(lois[-1], Q3))
    ecart = [sum(abs(l[y] - PI3[y]) for y in range(3)) for l in lois]
    borne = [2 * (1 - delta) ** (n // 2) for n in range(31)]
    assert all(e <= b for e, b in zip(ecart, borne))
    assert round(float(ecart[10]), 4) == 0.0068 and round(float(borne[10]), 2) == 1.29
    S = Schema(520, 268, 'Convergence de la loi de X_n vers π, et borne du couplage')
    # panneau gauche
    R = Repere(0, 12.5, 0, 1.05, 40, 16, 200, 220)
    S.fleche(R(0, 0), R(12.5, 0) + [6, 0], 'g')
    S.fleche(R(0, 0), R(0, 1.05) + [0, -6], 'g')
    S.texte(R(12.5, 0) + [8, -12], 'n', 'g', ancre='start')
    for x in (5, 10):
        _tic_x(S, R, x, 0, str(x))
    for v in (0.5, 1):
        _tic_y(S, R, 0, v, f'{v:g}'.replace('.', ','))
    ns = np.arange(13)
    for y, c in zip(range(3), 'rbv'):
        S.ligne(R(0, float(PI3[y])), R(12.5, float(PI3[y])), c, d=True)
        vals = [float(lois[n][y]) for n in ns]
        pts = R(ns.astype(float), np.array(vals))
        S.poly(pts, c, l=1.6)
        for pt in pts:
            S.point(pt, c, r=2.8)
    # panneau droit : échelle logarithmique
    R2 = Repere(0, 31, -8, 0.6, 300, 16, 200, 220)
    S.fleche(R2(0, -8), R2(31, -8) + [6, 0], 'g')
    S.fleche(R2(0, -8), R2(0, 0.6) + [0, -6], 'g')
    S.texte(R2(31, -8) + [8, -12], 'n', 'g', ancre='start')
    for x in (10, 20, 30):
        _tic_x(S, R2, x, -8, str(x))
    for e in (0, -2, -4, -6, -8):
        _tic_y(S, R2, 0, e, '1' if e == 0 else f'10^{e}'.replace('-', '−'))
    nn = np.arange(31, dtype=float)
    S.poly(R2(nn, np.log10([float(b) for b in borne])), 'g', l=1.8)
    S.poly(R2(nn, np.log10([float(e) for e in ecart])), 'r', l=1.8)
    S.texte(R2(22, math.log10(float(borne[22]))) + [0, 16], 'borne', 'g', ui=True)
    S.texte(R2(9, math.log10(float(ecart[9]))) + [8, 0], 'écart', 'r', ancre='start', ui=True)
    return S
