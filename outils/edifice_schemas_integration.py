"""Schémas des graphes d'intégration : analyse fonctionnelle (anf), mesure (mes), Fourier (fourier).

Ordre d'apparition : ni l'exponentielle ni la trigonométrie ne sont des ancêtres de anf et de mes ;
les exemples de ces deux graphes sont polynomiaux ou rationnels (racines carrées permises). Le graphe
fourier dispose de tout (anf, anc, proba).
"""
import math
from fractions import Fraction as Fr

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, arc


# ---------------------------------------------------------------- outils locaux

def decoupe_rect(pts, xmin, xmax, ymin, ymax):
    """Découpe d'un polygone convexe par un rectangle (Sutherland-Hodgman), coordonnées mathématiques."""
    def coupe(poly, dedans, inter):
        res = []
        for i in range(len(poly)):
            p, q = poly[i - 1], poly[i]
            if dedans(q):
                if not dedans(p):
                    res.append(inter(p, q))
                res.append(q)
            elif dedans(p):
                res.append(inter(p, q))
        return res

    def ix(x0):
        return lambda p, q: (x0, p[1] + (q[1] - p[1]) * (x0 - p[0]) / (q[0] - p[0]))

    def iy(y0):
        return lambda p, q: (p[0] + (q[0] - p[0]) * (y0 - p[1]) / (q[1] - p[1]), y0)

    poly = [tuple(p) for p in pts]
    poly = coupe(poly, lambda p: p[0] >= xmin, ix(xmin))
    poly = coupe(poly, lambda p: p[0] <= xmax, ix(xmax))
    poly = coupe(poly, lambda p: p[1] >= ymin, iy(ymin))
    poly = coupe(poly, lambda p: p[1] <= ymax, iy(ymax))
    return np.array(poly)


def marche(S, R, morceaux, c, d=False, l=None):
    """Fonction en escalier : liste de (a, b, valeur), un segment horizontal par palier, et des
    raccords verticaux fins entre paliers consécutifs."""
    for i, (a, b, y) in enumerate(morceaux):
        S.ligne(R(a, y), R(b, y), c, d, l)
        if i + 1 < len(morceaux):
            a2, b2, y2 = morceaux[i + 1]
            if abs(y2 - y) > 1e-12 and abs(a2 - b) < 1e-12:
                S.ligne(R(b, y), R(b, y2), c, True)


# ================================================================ anf

def cross2(u, v):
    return float(u[0] * v[1] - u[1] * v[0])


C_HILB = np.array([(0, 0), (4, 0), (5, 2), (3, 4), (0, 3)], float)


def _verifie_convexe(P):
    n = len(P)
    for i in range(n):
        a, b, c = P[i], P[(i + 1) % n], P[(i + 2) % n]
        assert cross2(b - a, c - b) > 0


@schema('f-hilbert')
def f_hilbert():
    # C polygone convexe, x hors de C ; p = projeté de x sur l'arête x1 + x2 = 7, de (5,2) à (3,4).
    P = C_HILB
    _verifie_convexe(P)
    x = np.array([5.0, 4.0])
    a, b = P[2], P[3]
    t = np.dot(x - a, b - a) / np.dot(b - a, b - a)
    assert 0 < t < 1
    p = a + t * (b - a)
    assert np.allclose(p, (4, 3))
    for y in P:                                           # caractérisation sur les sommets, donc sur C
        assert np.dot(x - p, y - p) <= 1e-12
    d = np.linalg.norm(x - p)
    # p réalise la distance à C : distance aux arêtes (projection sur chaque segment)
    dists = []
    for i in range(len(P)):
        u, v = P[i], P[(i + 1) % len(P)]
        s = np.clip(np.dot(x - u, v - u) / np.dot(v - u, v - u), 0, 1)
        dists.append(np.linalg.norm(x - (u + s * (v - u))))
    assert abs(min(dists) - d) < 1e-12
    y = np.array([4.0, 0.0])
    cosang = np.dot(x - p, y - p) / (d * np.linalg.norm(y - p))
    assert cosang < 0                                     # angle obtus en p

    S = Schema(500, 380, 'Projection de x sur le convexe C et angle obtus en p')
    k = 62
    R = Repere(-0.9, 7.1, -0.7, 5.4, 6, 4, 8.0 * k, 6.1 * k)
    S.poly(R(P[:, 0], P[:, 1]), 't', ferme=True, rempli='g')
    S.texte(R(1.4, 1.6), 'C')
    # cercle de centre x et de rayon d, tangent à C en p
    S.cercle(R(*x), d * k, 'g', d=True)
    # vecteurs x - p (rouge) et y - p (bleu)
    S.fleche(R(*p), R(*x), 'r', retrait=4)
    S.fleche(R(*p), R(*y), 'b', retrait=4)
    # angle en p entre les deux directions (image : y vers le bas)
    u1 = R(*x) - R(*p)
    u2 = R(*y) - R(*p)
    t1, t2 = math.atan2(u1[1], u1[0]), math.atan2(u2[1], u2[0])
    if t2 < t1:
        t2 += 2 * math.pi
    S.poly(arc(R(*p), 24, t1, t2), 'r')
    S.point(R(*p), 'r', r=4)
    S.point(R(*x), 't', r=4)
    S.point(R(*y), 'b', r=4)
    S.texte(R(*p) + [-14, -8], 'p', 'r', ancre='end')
    S.texte(R(*x) + [10, -6], 'x', ancre='start')
    S.texte(R(*y) + [0, 20], 'y', 'b')
    m1 = (R(*p) + R(*x)) / 2
    S.texte(m1 + [12, 10], 'x − p', 'r', ancre='start')
    m2 = (R(*p) + R(*y)) / 2
    S.texte(m2 + [10, 0], 'y − p', 'b', ancre='start')
    return S


@schema('f-hilbert-2')
def f_hilbert_2():
    # Deux points presque minimisants y_n, y_m de C, leur milieu dans C, le parallélogramme construit
    # sur x - y_n et x - y_m : sa diagonale y_n - y_m est petite parce que l'autre diagonale,
    # 2(x - milieu), a une longueur au moins 2d.
    P = C_HILB
    x = np.array([5.0, 4.0])
    p = np.array([4.0, 3.0])
    d2 = 2.0
    yn = np.array([4.75, 2.15])
    ym = np.array([3.2, 3.3])
    q = yn + ym - x
    m = (yn + ym) / 2

    def dans_C(z):
        n = len(P)
        return all(cross2(P[(i + 1) % n] - P[i], z - P[i]) >= -1e-12 for i in range(n))
    assert dans_C(yn) and dans_C(ym) and dans_C(m)
    n2 = lambda z: float(np.dot(z, z))
    assert n2(x - m) >= d2
    gauche = n2(yn - ym)
    droite = 2 * n2(x - yn) + 2 * n2(x - ym) - 4 * n2(x - m)
    assert abs(gauche - droite) < 1e-12                   # identité du parallélogramme
    assert gauche <= 2 * (n2(x - yn) - d2) + 2 * (n2(x - ym) - d2) + 1e-12
    rho = math.sqrt(max(n2(x - yn), n2(x - ym)))           # rayon du disque des presque minimisants
    assert np.linalg.norm(m - p) > 0.25                   # milieu et projeté bien distincts sur la figure

    xmin, xmax, ymin, ymax = 2.3, 7.1, 1.25, 6.0
    k = 80
    S = Schema(500, 392, 'Deux points presque minimisants, leur milieu et le parallélogramme')
    R = Repere(xmin, xmax, ymin, ymax, 70, 8, (xmax - xmin) * k, (ymax - ymin) * k)
    Cc = decoupe_rect(P, xmin, xmax, ymin, ymax)
    S.surface(R(Cc[:, 0], Cc[:, 1]), 'g')
    # contour de C, sauf les côtés portés par le bord de la fenêtre
    bordx, bordy = (xmin, xmax), (ymin, ymax)
    for i in range(len(Cc)):
        u, v = Cc[i - 1], Cc[i]
        if any(abs(u[0] - b) < 1e-9 and abs(v[0] - b) < 1e-9 for b in bordx):
            continue
        if any(abs(u[1] - b) < 1e-9 and abs(v[1] - b) < 1e-9 for b in bordy):
            continue
        S.ligne(R(*u), R(*v), 't')
    S.texte(R(2.6, 3.35), 'C')
    S.cercle(R(*x), math.sqrt(d2) * k, 'g', d=True)
    S.cercle(R(*x), rho * k, 'g')
    # parallélogramme construit sur x - y_n et x - y_m
    S.poly(R(*np.array([x, yn, q, ym]).T), 'g', ferme=True)
    S.ligne(R(*x), R(*q), 'b', d=True)
    S.ligne(R(*yn), R(*ym), 'r')
    S.point(R(*p), 'g', r=3.2)
    S.texte(R(*p) + [10, -10], 'p', 'g', ancre='start')
    for z in (x, q):
        S.point(R(*z), 't', r=3.6)
    S.point(R(*m), 'b', r=4)
    S.point(R(*yn), 'r', r=4)
    S.point(R(*ym), 'r', r=4)
    S.texte(R(*x) + [10, -8], 'x', ancre='start')
    S.texte(R(*yn) + [12, -12], 'y_n', 'r', ancre='start')
    S.texte(R(*ym) + [-10, -10], 'y_m', 'r', ancre='end')
    return S


@schema('f-baire')
def f_baire():
    # Plan euclidien (complet), V disque ouvert, U_n complémentaire de la droite L_n (ouvert dense).
    # Boules fermées emboîtées, selon la preuve : B̄(x_0, r_0) ⊂ V ∩ U_0 avec 0 < r_0 <= 1, puis
    # B̄(x_{n+1}, r_{n+1}) ⊂ B(x_n, r_n) ∩ U_{n+1} avec 0 < r_{n+1} <= 2^{-n-1}.
    cV, rV = np.array([0.0, 0.0]), 1.5
    def unit(deg):
        return np.array([math.cos(math.radians(deg)), math.sin(math.radians(deg))])
    # L_n = {z : <nu_n, z> = c_n} ; chaque L_{n+1} est placée à une distance donnée du centre x_n,
    # et x_{n+1} est pris de l'autre côté, sur la normale.
    angles = [80, 10, 135, 30]
    nus = [unit(a) for a in angles]
    L = [(nus[0], 0.85)]
    centres = [np.array([0.0, -0.35])]
    decal = [None, None, (0.15, 0.12), (0.08, 0.07)]   # (distance de L_{n} à x_{n-1}, recul de x_n)
    L.append((nus[1], 0.15))
    centres.append(np.array([-0.4, -0.5]))
    for n in (2, 3):
        a, b = decal[n]
        xp = centres[n - 1]
        L.append((nus[n], float(np.dot(nus[n], xp)) + a))
        centres.append(xp - b * nus[n])
    facteur = 0.9
    boules = []
    for n, xn in enumerate(centres):
        nu, c = L[n]
        dl = abs(np.dot(nu, xn) - c)
        if n == 0:
            borne = min(1.0, rV - np.linalg.norm(xn - cV), dl)
        else:
            xp, rp = boules[-1]
            borne = min(2.0 ** (-n), rp - np.linalg.norm(xn - xp), dl)
        assert borne > 0
        boules.append((xn, facteur * borne))
    # vérification des contraintes exactes de la preuve
    x0, r0 = boules[0]
    assert 0 < r0 <= 1 and np.linalg.norm(x0 - cV) + r0 < rV          # B̄_0 ⊂ V
    for n, (xn, rn) in enumerate(boules):
        nu, c = L[n]
        assert abs(np.dot(nu, xn) - c) > rn                # B̄_n ⊂ U_n : évite L_n
        assert 0 < rn <= 2.0 ** (-n)
        if n:
            xp, rp = boules[n - 1]
            assert np.linalg.norm(xn - xp) + rn < rp      # B̄_n ⊂ B(x_{n-1}, r_{n-1}) (ouverte)
            assert abs(np.dot(nu, xp) - c) < rp           # L_n coupe la boule précédente
        assert abs(c) < rV                                 # L_n coupe V

    S = Schema(520, 372, 'Boules fermées emboîtées évitant les droites successives')
    k = 100
    R = Repere(-1.6, 1.6, -1.6, 1.6, 18, 26, 3.2 * k, 3.2 * k)
    S.cercle(R(*cV), rV * k, 'b', rempli='b')
    S.texte(R(*(1.5 * unit(-40))) + [12, 12], 'V', 'b', ancre='start')
    cote = [-1, 1, -1, 1]                     # extrémité de la corde qui porte l'étiquette
    for n, (nu, c) in enumerate(L):
        pied = c * nu
        h = math.sqrt(rV ** 2 - c ** 2)
        tdir = np.array([-nu[1], nu[0]])
        a, b = pied - (h + 0.06) * tdir, pied + (h + 0.06) * tdir
        S.ligne(R(*a), R(*b), 'g', d=True)
        bout = pied + cote[n] * (h + 0.06) * tdir
        u = bout / np.linalg.norm(bout)
        S.texte(R(*bout) + 16 * np.array([u[0], -u[1]]), f'L_{n}', 'g')
    for n, (xn, rn) in enumerate(boules):
        S.cercle(R(*xn), rn * k, 'r', rempli='r' if n == 3 else None)
        S.point(R(*xn), 'r', r=2.6 if n < 2 else 1.8)
    S.texte(R(*boules[0][0]) + [8, -14], 'x_0', 'r', ancre='start')
    S.texte(R(*boules[1][0]) + [-8, -16], 'x_1', 'r', ancre='end')
    # médaillon : agrandissement autour de x_2
    x2, r2 = boules[2]
    zoom = 3.0
    rm = 76
    centre_med = np.array([430.0, 190.0])
    S.cercle(R(*x2), r2 * k + 4, 'g')
    dirm = centre_med - R(*x2)
    dirm = dirm / np.linalg.norm(dirm)
    S.ligne(R(*x2) + (r2 * k + 4) * dirm, centre_med - rm * dirm, 'g')
    S.cercle(centre_med, rm, 'g')
    Z = lambda z: centre_med + zoom * k * np.array([z[0] - x2[0], -(z[1] - x2[1])])
    rmm = rm / (zoom * k)                     # rayon du médaillon en coordonnées mathématiques
    for n in (2, 3):
        nu, c = L[n]
        tdir = np.array([-nu[1], nu[0]])
        pied = x2 + (c - np.dot(nu, x2)) * nu
        h2 = rmm ** 2 - np.dot(pied - x2, pied - x2)
        if h2 > 0:                            # la droite traverse le médaillon
            hz = math.sqrt(h2)
            S.ligne(Z(pied - hz * tdir), Z(pied + hz * tdir), 'g', d=True)
    nu, c = L[3]
    tdir = np.array([-nu[1], nu[0]])
    pied = x2 + (c - np.dot(nu, x2)) * nu
    hz = math.sqrt(rmm ** 2 - np.dot(pied - x2, pied - x2))
    S.texte(Z(pied - hz * tdir) + [12, 10], 'L_3', 'g', ancre='start')
    S.cercle(Z(x2), r2 * k * zoom, 'r')
    x3, r3 = boules[3]
    S.cercle(Z(x3), r3 * k * zoom, 'r', rempli='r')
    S.point(Z(x2), 'r', r=2.6)
    S.point(Z(x3), 'r', r=2.6)
    S.texte(Z(x2) + [8, -10], 'x_2', 'r', ancre='start')
    S.texte(Z(x3) + [-6, 14], 'x_3', 'r', ancre='end')
    return S


@schema('f-exemples')
def f_exemples():
    # f_n vaut 0 sur [0, 1/2 - 1/n], 1 sur [1/2, 1], affine entre les deux ; limite L¹ : 1_{[1/2, 1]}.
    ns = [3, 4, 6, 12]
    def fn(n, x):
        a = Fr(1, 2) - Fr(1, n)
        return np.clip((np.asarray(x, float) - float(a)) / (1.0 / n), 0, 1)
    # ∫|f_n - f_m| = |1/n - 1/m| / 2 (deux triangles de même hauteur 1)
    xs = np.linspace(0, 1, 200001)
    aire = np.trapezoid(np.abs(fn(3, xs) - fn(6, xs)), xs)
    assert abs(aire - float(Fr(1, 2) * (Fr(1, 3) - Fr(1, 6)))) < 1e-8      # = 1/12
    S = Schema(500, 300, 'Rampes f_n et leur limite, indicatrice de [1/2, 1]')
    R = Repere(-0.06, 1.12, -0.18, 1.2, 26, 10, 440, 270)
    R.axes(S, 'x', '')
    # aire entre f_3 et f_6
    a3, a6 = 0.5 - 1 / 3, 0.5 - 1 / 6
    S.surface(np.vstack([R(a3, 0), R(a6, 0), R(0.5, 1)]), 'b')
    for n in ns:
        S.poly(R(np.array([0, 0.5 - 1 / n, 0.5, 1]), np.array([0, 0, 1, 1])), 'b', l=1.4)
    S.texte(R(0.5 - 1 / 3 + 0.5 / 3, 0.5) + [-12, 0], 'f_3', 'b', ancre='end')
    S.texte(R(0.5 - 1 / 12 + 0.5 / 12, 0.5) + [10, 0], 'f_{12}', 'b', ancre='start')
    # limite
    S.ligne(R(0, 0), R(0.5, 0), 'r', l=3)
    S.ligne(R(0.5, 1), R(1, 1), 'r', l=3)
    S.point(R(0.5, 0), 'r', r=4.2, creux=True)
    S.point(R(0.5, 1), 'r', r=4.2)
    S.texte(R(0.78, 1) + [0, -16], '1_{[1/2, 1]}', 'r')
    centre_aire = (R(a3, 0) + R(a6, 0) + R(0.5, 1)) / 3
    pos = R(0.12, 0.3)
    S.ligne(pos + [6, 4], centre_aire, 'g')
    S.texte(pos + [0, -2], '1/12', 'b', ancre='end', taille=15)
    for xv, s in [(0, '0'), (0.5, '1/2'), (1, '1')]:
        S.ligne(R(xv, 0) + [0, -4], R(xv, 0) + [0, 4], 'g')
        S.texte(R(xv, 0) + [0, 20], s, 'g', taille=15)
    S.ligne(R(1, 0), R(1, 1), 'g', d=True)
    S.texte(R(0, 1) + [-8, 0], '1', 'g', ancre='end', taille=15)
    S.ligne(R(0, 1) + [-3, 0], R(0, 1) + [3, 0], 'g')
    return S


def _haar(j, k, x):
    """h_{j,k}(x) = 2^{j/2} (1 sur la première moitié de I_{j,k}, -1 sur la seconde), x dans [0, 1[."""
    x = np.asarray(x, float)
    a, m, b = k / 2 ** j, (k + 0.5) / 2 ** j, (k + 1) / 2 ** j
    return 2 ** (j / 2) * (((a <= x) & (x < m)).astype(float) - ((m <= x) & (x < b)).astype(float))


@schema('f-haar')
def f_haar():
    # Trois rangées : h_{0,0} ; h_{1,0}, h_{1,1} ; h_{2,k}. Bande rouge : I_{2,1} = [1/4, 1/2[, support de h_{2,1}.
    # Vérifications exactes sur la grille de pas 1/64 (les fonctions y sont constantes par morceaux).
    N = 64
    milieux = (np.arange(N) + 0.5) / N
    fam = [(j, k) for j in range(4) for k in range(2 ** j)]
    for a in fam:
        for b in fam:
            ps = np.sum(_haar(*a, milieux) * _haar(*b, milieux)) / N
            assert abs(ps - (1.0 if a == b else 0.0)) < 1e-12
        assert abs(np.sum(_haar(*a, milieux)) / N) < 1e-12           # orthogonale à la constante 1
    dans = milieux[(milieux >= 0.25) & (milieux < 0.5)]
    assert np.all(_haar(0, 0, dans) == 1) and np.allclose(_haar(1, 0, dans), -math.sqrt(2))
    S = Schema(520, 430, 'Les fonctions de Haar des rangs 0, 1 et 2')
    rangs = [(0, 1.0), (1, math.sqrt(2)), (2, 2.0)]
    hauteur, haut = 118, 14
    Rs = [Repere(-0.04, 1.1, -2.25, 2.25, 70, haut + i * (hauteur + 12), 420, hauteur) for i in range(3)]
    # bande du support de h_{2,1}
    y_haut, y_bas = Rs[0](0, 2.25)[1], Rs[2](0, -2.25)[1]
    S.surface(np.array([Rs[0](0.25, 0)[0], y_haut, Rs[0](0.5, 0)[0], y_haut,
                        Rs[0](0.5, 0)[0], y_bas, Rs[0](0.25, 0)[0], y_bas]).reshape(4, 2), 'r')
    for (j, v), R in zip(rangs, Rs):
        S.ligne(R(0, 0), R(1.06, 0), 'g')
        for xv in (0.25, 0.5, 0.75, 1.0):
            S.ligne(R(xv, -2.1), R(xv, 2.1), 'g', d=True)
        for k in range(2 ** j):
            a, m, b = k / 2 ** j, (k + 0.5) / 2 ** j, (k + 1) / 2 ** j
            c = 'r' if (j, k) == (2, 1) else ('t' if j == 0 else ('b' if j == 1 else 'g'))
            marche(S, R, [(a, m, v), (m, b, -v)], c, l=2.4 if c != 'g' else 1.4)
            S.ligne(R(a, 0), R(a, v), c, d=True)
            S.ligne(R(b, -v), R(b, 0), c, d=True)
        S.texte(R(-0.04, 0) + [-6, 0], f'h_{{{j},·}}' if j else 'h_{0,0}', 'g' if j == 2 else ('b' if j == 1 else 't'),
                ancre='end', taille=16)
        lab = {0: '1', 1: '2^{1/2}', 2: '2'}[j]
        S.texte(R(1.0, v) + [10, 0], lab, 'g', ancre='start', taille=14)
    S.texte(Rs[2](0.375, 2.0) + [0, -12], 'h_{2,1}', 'r', taille=16)
    for xv, s in [(0, '0'), (0.25, '1/4'), (0.5, '1/2'), (0.75, '3/4'), (1, '1')]:
        S.texte(Rs[2](xv, -2.25) + [0, 14], s, 'g', taille=14)
    return S


@schema('f-haar-2')
def f_haar_2():
    # f(x) = x ; S_j f = moyenne de f sur chaque I_{j,k}, soit (k + 1/2) 2^{-j} ; ‖f - S_j f‖² = 4^{-j}/12.
    # S_j f est aussi la somme partielle 1/2 + Σ_{i<j} Σ_k ⟨f, h_{i,k}⟩ h_{i,k}, avec ⟨f, h_{i,k}⟩ = -2^{-3i/2}/4.
    xs = (np.arange(4096) + 0.5) / 4096
    for j in range(5):
        moy = (np.floor(xs * 2 ** j) + 0.5) / 2 ** j
        som = 0.5 + sum(-2 ** (-1.5 * i) / 4 * _haar(i, k, xs) for i in range(j) for k in range(2 ** i))
        assert np.allclose(moy, som)
        k = np.arange(2 ** j)
        err = sum(float(Fr(1, 12) * Fr(1, 2 ** j) ** 3) for _ in k)   # ∫ sur I_{j,k} de (x - milieu)² = δ³/12
        assert abs(err - 1 / (12 * 4 ** j)) < 1e-15
        assert abs(np.mean((xs - moy) ** 2) - 1 / (12 * 4 ** j)) < 1e-6
    S = Schema(500, 400, 'Sommes partielles de la série de Haar de f(x) = x')
    R = Repere(-0.06, 1.16, -0.12, 1.12, 40, 10, 430, 360)
    R.axes(S, 'x', '')
    for j, c, d in [(1, 'g', True), (2, 'v', False), (3, 'b', False)]:
        P = [(k / 2 ** j, (k + 1) / 2 ** j, (k + 0.5) / 2 ** j) for k in range(2 ** j)]
        marche(S, R, P, c, d=d, l=None if d else 2)
    R.graphe(S, lambda x: x, 0, 1, 'r', l=2.2)
    S.texte(R(1, 1) + [12, -8], 'f', 'r', ancre='start')
    S.texte(R(1, 0.9375) + [12, 4], 'S_3 f', 'b', ancre='start', taille=15)
    S.texte(R(1, 0.875) + [12, 10], 'S_2 f', 'v', ancre='start', taille=15)
    S.texte(R(0.1, 0.25) + [0, -14], 'S_1 f', 'g', taille=15)
    for xv, s in [(0, '0'), (0.5, '1/2'), (1, '1')]:
        S.ligne(R(xv, 0) + [0, -4], R(xv, 0) + [0, 4], 'g')
        S.texte(R(xv, 0) + [0, 18], s, 'g', taille=15)
    for yv, s in [(0.25, '1/4'), (0.75, '3/4')]:
        S.ligne(R(0, yv) + [-3, 0], R(0, yv) + [3, 0], 'g')
        S.texte(R(0, yv) + [-7, 0], s, 'g', ancre='end', taille=14)
    return S


# ================================================================ mes

@schema('m-lebesgue')
def m_lebesgue():
    # K_0 = [0, 1], K_{n+1} : on retire le tiers central ouvert de chaque segment de K_n.
    K = [[(Fr(0), Fr(1))]]
    for _ in range(4):
        nouv = []
        for a, b in K[-1]:
            t = (b - a) / 3
            nouv += [(a, a + t), (b - t, b)]
        K.append(nouv)
    for n, Kn in enumerate(K):
        assert len(Kn) == 2 ** n and all(b - a == Fr(1, 3 ** n) for a, b in Kn)
        assert sum(b - a for a, b in Kn) == Fr(2, 3) ** n
    S = Schema(500, 270, 'Les cinq premières étapes de l’ensemble de Cantor')
    x0, L = 50, 300
    for n, Kn in enumerate(K):
        y = 30 + n * 52
        S.texte((x0 - 14, y), f'K_{n}', ancre='end')
        for a, b in Kn:
            S.ligne((x0 + float(a) * L, y), (x0 + float(b) * L, y), 'r', l=7)
        mes = Fr(2, 3) ** n
        s = '1' if n == 0 else f'{mes.numerator}/{mes.denominator}'
        S.texte((x0 + L + 26, y), 'λ(K_' + str(n) + ') = ' + s, ancre='start')
    for xv, s in [(0, '0'), (1, '1')]:
        S.texte((x0 + xv * L, 30 + 4 * 52 + 26), s, 'g', taille=15)
    return S


@schema('m-etagees')
def m_etagees():
    # f(x) = 1/2 + 3x - x² sur [0, 3] ; s_1 et s_2 selon la formule de la fiche :
    # s_n = k 2^{-n} sur {k 2^{-n} <= f < (k+1) 2^{-n}} pour k < n 2^n, et n sur {f >= n}.
    f = lambda x: 0.5 + 3 * x - x * x
    def antecedents(c):
        """Les deux solutions de f(x) = c dans [0, 3] (c entre 1/2 et 11/4)."""
        r = math.sqrt(9 - 4 * (c - 0.5))
        return (3 - r) / 2, (3 + r) / 2
    def s(n, x):
        v = f(x)
        if v >= n:
            return float(n)
        return math.floor(v * 2 ** n) / 2 ** n
    def paliers(n):
        # niveaux franchis par f : les k 2^{-n} entre 1/2 et min(n, max f), coupures aux antécédents
        niveaux = sorted({j / 2 ** n for j in range(0, n * 2 ** n + 1)
                          if 0.5 < j / 2 ** n <= min(n, 2.75)})
        coupes = sorted({0.0, 3.0} | {a for c in niveaux for a in antecedents(c)})
        res = []
        for a, b in zip(coupes, coupes[1:]):
            res.append((a, b, s(n, (a + b) / 2)))
        return res
    P1, P2 = paliers(1), paliers(2)
    xs = np.linspace(0, 3, 3001)
    for x in xs:                                          # 0 <= s_1 <= s_2 <= f
        assert 0 <= s(1, x) <= s(2, x) <= f(x) + 1e-12
    for a, b, v in P1 + P2:                                # paliers bien constants
        pass
    assert max(v for _, _, v in P1) == 1 and max(v for _, _, v in P2) == 2   # troncatures à n
    # ensemble {3/2 <= f < 7/4} (n = 2, k = 6) : [(3-√5)/2, 1/2[ ∪ ]5/2, (3+√5)/2]
    g1, g2 = antecedents(1.5)
    h1, h2 = antecedents(1.75)
    assert abs(h1 - 0.5) < 1e-12 and abs(h2 - 2.5) < 1e-12
    assert abs(g1 - (3 - math.sqrt(5)) / 2) < 1e-12
    for x in xs:
        dedans = 1.5 <= f(x) < 1.75
        assert dedans == ((g1 <= x < h1) or (h2 < x <= g2)) or abs(x - h1) < 1e-9 or abs(x - h2) < 1e-9

    S = Schema(520, 360, 'Fonctions étagées s_1 et s_2 sous le graphe de f')
    R = Repere(-0.3, 3.45, -0.32, 3.0, 40, 6, 450, 330)
    R.axes(S, 'x', '')
    # bande des valeurs [3/2, 7/4[ et son image réciproque
    S.surface(np.vstack([R(-0.3, 1.5), R(3.2, 1.5), R(3.2, 1.75), R(-0.3, 1.75)]), 'r')
    for a, b in [(g1, h1), (h2, g2)]:
        S.ligne(R(a, 0), R(b, 0), 'r', l=5)
        S.ligne(R(a, 0), R(a, f(a)), 'r', d=True)
        S.ligne(R(b, 0), R(b, f(b)), 'r', d=True)
    S.point(R(h1, 0), 'r', r=3.6, creux=True)
    S.point(R(h2, 0), 'r', r=3.6, creux=True)
    S.point(R(g1, 0), 'r', r=3.6)
    S.point(R(g2, 0), 'r', r=3.6)
    marche(S, R, P1, 'v')
    marche(S, R, P2, 'b')
    R.graphe(S, f, 0, 3, 't', l=2)
    # graduations des valeurs
    for v, sv in [(0.5, '1/2'), (1, '1'), (1.5, '3/2'), (1.75, '7/4'), (2, '2')]:
        S.ligne(R(0, v) + [-3, 0], R(0, v) + [3, 0], 'g')
        S.texte(R(0, v) + [-7, 0], sv, 'r' if v in (1.5, 1.75) else 'g', ancre='end', taille=14)
    S.texte(R(3, 0) + [0, 18], '3', 'g', taille=15)
    S.texte(R(1.5, 2.75) + [0, -14], 'f')
    S.texte(R(1.5, 2.0) + [0, 14], 's_2', 'b')
    S.texte(R(1.5, 1.0) + [0, 14], 's_1', 'v')
    return S


@schema('m-riemann')
def m_riemann():
    # f(x) = 1 + x - x³/3 sur [0, 2] ; φ_n et ψ_n : inf et sup de f sur l'intérieur des 2^n segments.
    F = lambda x: 1 + x - x ** 3 / 3                       # fonctionne sur les fractions
    def bornes(a, b):
        vals = [F(a), F(b)]
        if a < 1 < b:
            vals.append(F(Fr(1)))                          # maximum de f en 1 (f' = 1 - x²)
        return min(vals), max(vals)
    def phipsi(n):
        pts = [Fr(2 * k, 2 ** n) for k in range(2 ** n + 1)]
        return [(a, b) + bornes(a, b) for a, b in zip(pts, pts[1:])]
    E2, E3 = phipsi(2), phipsi(3)
    xs = np.linspace(0, 2, 4001)
    def ev(E, j, x):
        for a, b, m, M in E:
            if a <= x <= b:
                return (float(m), float(M))[j]
    for x in xs[1:-1]:
        if abs(x * 4 - round(x * 4)) < 1e-9:
            continue
        p2, p3, q3, q2 = ev(E2, 0, x), ev(E3, 0, x), ev(E3, 1, x), ev(E2, 1, x)
        fx = 1 + x - x ** 3 / 3
        assert p2 <= p3 <= fx + 1e-12 and fx <= q3 + 1e-12 and q3 <= q2
    ecart2 = sum((M - m) * (b - a) for a, b, m, M in E2)
    ecart3 = sum((M - m) * (b - a) for a, b, m, M in E3)
    assert ecart3 < ecart2
    S = Schema(500, 340, 'Fonctions en escalier dyadiques encadrant f')
    R = Repere(-0.12, 2.3, -0.12, 1.95, 40, 8, 430, 300)
    R.axes(S, 'x', '')
    for a, b, m, M in E3:
        a, b, m, M = map(float, (a, b, m, M))
        S.surface(np.vstack([R(a, m), R(b, m), R(b, M), R(a, M)]), 'b')
    marche(S, R, [(float(a), float(b), float(m)) for a, b, m, M in E2], 'g', d=True)
    marche(S, R, [(float(a), float(b), float(M)) for a, b, m, M in E2], 'g', d=True)
    marche(S, R, [(float(a), float(b), float(M)) for a, b, m, M in E3], 'b')
    marche(S, R, [(float(a), float(b), float(m)) for a, b, m, M in E3], 'b')
    R.graphe(S, lambda x: 1 + x - x ** 3 / 3, 0, 2, 'r', l=2.2)
    for k in range(9):
        xv = k / 4
        S.ligne(R(xv, 0) + [0, -3], R(xv, 0) + [0, 3], 'g')
    for xv, s in [(0, '0'), (1, '1'), (2, '2')]:
        S.texte(R(xv, 0) + [0, 18], s, 'g', taille=15)
    S.texte(R(1, F(Fr(1))) + [0, -18], 'f', 'r')
    S.texte(R(2, float(E3[-1][3])) + [16, 0], 'ψ_3', 'b', ancre='start')
    S.texte(R(2, float(E3[-1][2])) + [16, 0], 'φ_3', 'b', ancre='start')
    S.texte(R(2, float(E2[-1][3])) + [16, 0], 'ψ_2', 'g', ancre='start')
    S.texte(R(0.25, float(E2[0][2])) + [0, 14], 'φ_2', 'g')
    return S


@schema('m-convergence-dominee')
def m_convergence_dominee():
    # f_n = n 1_{]0, 1/n]} ; sup_n f_n(x) = ⌊1/x⌋ sur ]0, 1] ; ⌊t⌋ >= t/2 pour t >= 1.
    ns = [1, 2, 3, 5]
    xs = np.linspace(1e-4, 1, 20001)
    sup = np.array([max(n for n in range(1, 10001) if n * x <= 1) for x in xs[::50]])
    assert np.all(sup == np.floor(1 / xs[::50] + 1e-12))
    assert np.all(np.floor(1 / xs + 1e-12) >= 1 / (2 * xs) - 1e-12)
    ymax = 6.6
    S = Schema(500, 380, 'Les fonctions f_n, leur enveloppe et la minorante 1/(2x)')
    R = Repere(-0.08, 1.2, -0.45, ymax + 0.35, 40, 8, 430, 350)
    R.axes(S, 'x', '')
    # enveloppe ⌊1/x⌋ : palier k sur ]1/(k+1), 1/k], tronquée en haut
    morceaux = []
    for k in range(1, 7):
        morceaux.append((1 / (k + 1), 1 / k, k))
    morceaux = morceaux[::-1]
    S.surface(np.vstack([R(1 / 7, 0)] + [p for a, b, k in morceaux for p in (R(a, k), R(b, k))] + [R(1, 0)]), 'r')
    for n in ns:
        S.poly(R(np.array([0, 0, 1 / n, 1 / n]), np.array([0, n, n, 0])), 'b', l=1.3)
    marche(S, R, morceaux, 'r')
    S.ligne(R(1 / 7, 6), R(1 / 7, ymax), 'r', d=True)
    S.pointe(R(1 / 7, ymax) + [0, -2], (0, -1), 'r')
    for n in ns:
        S.point(R(1 / n, n), 'b', r=3.4)
    for n in ns:
        S.texte(R(1 / n, n) + [8, -12], f'f_{n}', 'b', ancre='start', taille=15)
    # 1/(2x)
    xc = np.linspace(1 / (2 * ymax), 1.0, 400)
    S.poly(R(xc, 1 / (2 * xc)), 'v', l=2)
    S.texte(R(0.8, 0.625) + [0, 22], '1/(2x)', 'v', taille=15)
    S.ligne(R(0.68, 2.2) + [0, 4], R(0.74, 1.0), 'g')
    S.texte(R(0.68, 2.2) + [-4, -8], '`sup` f_n', 'r', ancre='start')
    for xv, s in [(0, '0'), (1 / 3, '1/3'), (0.5, '1/2'), (1, '1')]:
        S.texte(R(xv, 0) + [0, 19], s, 'g', taille=14)
    for yv in range(1, 7):
        S.ligne(R(0, yv) + [-3, 0], R(0, yv) + [3, 0], 'g')
        S.texte(R(0, yv) + [-8, 0], str(yv), 'g', ancre='end', taille=14)
    return S


@schema('m-produit')
def m_produit():
    # E = {0 <= x <= 1, x² <= y <= x} ; E_x = [x², x], E^y = [y, √y] ; aire 1/6 des deux façons.
    import sympy as sp
    X, Y = sp.symbols('x y', nonnegative=True)
    assert sp.integrate(X - X ** 2, (X, 0, 1)) == sp.Rational(1, 6)
    assert sp.integrate(sp.sqrt(Y) - Y, (Y, 0, 1)) == sp.Rational(1, 6)
    x0, y0 = 0.62, 0.3
    S = Schema(500, 380, 'Sections verticale et horizontale d’une partie du plan')
    k = 320
    R = Repere(-0.08, 1.15, -0.08, 1.07, 44, 8, 1.23 * k, 1.15 * k)
    R.axes(S, 'x', 'y')
    t = np.linspace(0, 1, 300)
    bord = np.vstack([R(t, t ** 2), R(t[::-1], t[::-1])])
    S.poly(bord, 't', ferme=True, rempli='g')
    S.texte(R(0.5, 0.41) + [-6, 0], 'E')
    S.texte(R(0.9, 0.9) + [-14, -4], 'y = x', 'g', ancre='end', taille=15)
    S.texte(R(0.95, 0.9025) + [10, 12], 'y = x^2', 'g', ancre='start', taille=15)
    # section verticale E_x en rouge, reportée sur l'axe des y
    S.ligne(R(x0, x0 ** 2), R(x0, x0), 'r', l=3.5)
    S.ligne(R(x0, 0), R(x0, x0 ** 2), 'r', d=True)
    S.texte(R(x0, 0) + [0, 18], 'x', 'r')
    S.texte(R(x0, (x0 + x0 ** 2) / 2) + [10, 0], 'E_x', 'r', ancre='start')
    # section horizontale E^y en bleu
    S.ligne(R(y0, y0), R(math.sqrt(y0), y0), 'b', l=3.5)
    S.ligne(R(0, y0), R(y0, y0), 'b', d=True)
    S.texte(R(0, y0) + [-8, 0], 'y', 'b', ancre='end')
    S.texte(R((y0 + math.sqrt(y0)) / 2, y0) + [0, 16], 'E^y', 'b')
    S.texte(R(1, 0) + [0, 18], '1', 'g', taille=15)
    S.texte(R(0, 1) + [-8, 0], '1', 'g', ancre='end', taille=15)
    S.texte((460, 200), '`aire`(E) = 1/6', ancre='end')
    return S


@schema('m-mesurables')
def m_mesurables():
    # f_n(x) = max(0, 1 - n|x|), continues ; limite simple 1_{0} : f_n(0) = 1, et f_n(x) = 0 dès que n|x| >= 1.
    fn = lambda n, x: np.maximum(0.0, 1 - n * np.abs(np.asarray(x, float)))
    ns = [1, 2, 4, 8]
    for n in ns:
        assert fn(n, 0.0) == 1 and fn(n, 1 / n) == 0 and fn(n, -1 / n) == 0
    xs = np.linspace(-1.2, 1.2, 2401)
    for x in xs:
        if abs(x) > 1e-12:                                  # au-delà du rang ⌈1/|x|⌉, f_n(x) = 0
            N = math.ceil(1 / abs(x)) + 1
            assert all(fn(n, x) == 0 for n in range(N, N + 50))
        for n in range(1, 40):                              # suite décroissante en chaque point
            assert fn(n + 1, x) <= fn(n, x) + 1e-15
    S = Schema(500, 270, 'Fonctions continues en tente et leur limite simple, discontinue en 0')
    R = Repere(-1.25, 1.35, -0.18, 1.18, 20, 16, 460, 230)
    R.axes(S, 'x', '')
    for n in ns:
        S.poly(R(np.array([-1.25, -1 / n, 0, 1 / n, 1.25]), np.array([0, 0, 1, 0, 0])), 'b', l=1.4)
    # limite : 0 hors de 0, 1 en 0
    S.ligne(R(-1.25, 0), R(-0.012, 0), 'r', l=3)
    S.ligne(R(0.012, 0), R(1.25, 0), 'r', l=3)
    S.point(R(0, 0), 'r', r=4.2, creux=True)
    S.point(R(0, 1), 'r', r=4.6)
    S.texte(R(0, 1) + [12, -4], '1', 'r', ancre='start')
    for n, hy in ((1, 0.7), (2, 0.5), (4, 0.3)):            # étiquettes étagées sur les branches gauches
        S.texte(R(-(1 - hy) / n, hy) + [-9, -2], f'f_{n}', 'b', ancre='end', taille=15)
    p8 = R(0.7 / 8, 0.3)                                   # point de f_8 (branche droite, hauteur 0,3)
    assert abs(fn(8, 0.7 / 8) - 0.3) < 1e-12
    S.ligne(R(0.55, 0.62) + [-4, 6], p8, 'g')
    S.texte(R(0.55, 0.62) + [0, -2], 'f_8', 'b', ancre='start', taille=15)
    for xv, s in [(-1, '−1'), (-0.5, '−1/2'), (0.5, '1/2'), (1, '1')]:
        S.ligne(R(xv, 0) + [0, -3], R(xv, 0) + [0, 3], 'g')
        S.texte(R(xv, 0) + [0, 18], s, 'g', taille=14)
    return S


@schema('m-integrale')
def m_integrale():
    # Mesure de comptage μ sur X = {0, …, 7}, f(k) donné ; a = 3 : {f >= 3} = {1, 2, 4, 5},
    # a 1_{f >= a} <= f point par point, et Markov : μ({f >= 3}) = 4 <= (1/3) ∫ f dμ = 19/3.
    vals = [1, 3, 4, 2, 5, 3, 1, 0]
    a = 3
    A = [k for k, v in enumerate(vals) if v >= a]
    assert A == [1, 2, 4, 5]
    assert all(a * (k in A) <= v for k, v in enumerate(vals))
    integrale = sum(vals)                                  # ∫ f dμ pour la mesure de comptage
    assert integrale == 19 and len(A) == 4 and Fr(len(A)) <= Fr(integrale, a)
    assert a * len(A) == 12 and 12 <= 19                   # aire rouge sous l'aire grise (barres de largeur 1)
    assert [k for k in A if vals[k] == a] == [1, 5]          # là, la barre rouge recouvre la grise
    S = Schema(500, 300, 'Markov pour la mesure de comptage : les barres rouges sous les barres grises')
    R = Repere(-0.7, 8.0, -0.6, 5.6, 40, 8, 420, 270)
    R.axes(S, 'k', '', origine=(-0.7, 0))
    w = 0.5                                                # barres jointives de largeur 1 : aire = hauteur
    for k, v in enumerate(vals):
        if v:
            S.poly(R(np.array([k - w, k - w, k + w, k + w]), np.array([0, v, v, 0])), 't', ferme=True, rempli='g')
        if k in A:
            S.poly(R(np.array([k - w, k - w, k + w, k + w]), np.array([0, a, a, 0])), 'r', ferme=True, rempli='r')
            S.point(R(k, 0), 'r', r=4)
        S.texte(R(k, 0) + [0, 18], str(k), 'g', taille=14)
    S.ligne(R(-0.7, a), R(7.6, a), 'g', d=True)
    for yv in range(1, 6):
        S.ligne(R(-0.7, yv) + [0, 0], R(-0.7, yv) + [6, 0], 'g')
        S.texte(R(-0.7, yv) + [-6, 0], str(yv), 'g', ancre='end', taille=14)
    S.texte(R(7.6, a) + [0, -14], 'a = 3', 'g', ancre='end', taille=14)
    S.texte(R(6.6, 4.9), '∫ f dμ = 19', 't', ancre='middle', taille=15)
    S.texte(R(6.6, 4.1), 'μ(\\{f ⩾ 3\\}) = 4', 'r', ancre='middle', taille=15)
    return S


@schema('m-beppo-levi')
def m_beppo_levi():
    # X = ]0, 2], f(x) = 1 + x(2 - x) ; s = 3/2 sur [α, β] = {f >= 3/2}, 1 ailleurs ; c = 3/4 ;
    # f_n = f (1 - (1 - x/2)^n), croissante en n, de limite f sur ]0, 2] ; E_n = {f_n >= c s}.
    f = lambda x: 1 + x * (2 - x)
    al, be = 1 - 2 ** -0.5, 1 + 2 ** -0.5
    assert abs(f(al) - 1.5) < 1e-12 and abs(f(be) - 1.5) < 1e-12
    s = lambda x: np.where((x >= al) & (x <= be), 1.5, 1.0)
    c = 0.75
    fn = lambda n, x: f(x) * (1 - (1 - x / 2) ** n)
    xs = np.linspace(1e-6, 2, 400001)
    assert np.all(s(xs) <= f(xs) + 1e-12)                   # s étagée, s <= f
    for n in range(1, 12):
        assert np.all(fn(n, xs) <= fn(n + 1, xs) + 1e-12)   # (f_n) croissante
    assert np.max(f(xs[xs > 0.3]) - fn(200, xs[xs > 0.3])) < 1e-12          # f_n → f (convergence simple)

    def morceaux(n):
        """Composantes de E_n = {f_n >= c s}, extrémités affinées par dichotomie."""
        g = lambda x: fn(n, x) - c * float(s(np.array(x)))
        E = fn(n, xs) >= c * s(xs)
        coupes = np.where(np.diff(E.astype(int)) != 0)[0]
        bords = []
        for i in coupes:
            u, v = xs[i], xs[i + 1]
            if u < al <= v:                                 # saut de s : l'extrémité est α
                bords.append(al)
                continue
            for _ in range(60):
                m = (u + v) / 2
                (u, v) = (m, v) if (g(m) >= 0) == bool(E[i]) else (u, m)
            bords.append((u + v) / 2)
        assert not E[0] and E[-1]
        pts = bords + [2.0]
        return [(pts[k], pts[k + 1]) for k in range(0, len(pts), 2)]
    E2, E6 = morceaux(2), morceaux(6)
    assert len(E2) == 1 and len(E6) == 2                  # E_6 a deux morceaux
    assert E6[0][0] < E2[0][0] and E6[1][0] < E2[0][0]    # E_2 ⊂ E_6
    assert abs(E6[0][1] - al) < 1e-12                     # le trou de E_6 commence au saut de c s en α
    # minoration de la preuve : ∫ f_n >= c ∫_{E_n} s
    for n, E in ((2, E2), (6, E6)):
        msk = np.zeros_like(xs, bool)
        for u, v in E:
            msk |= (xs >= u) & (xs <= v)
        assert np.trapezoid(fn(n, xs), xs) >= np.trapezoid(c * s(xs) * msk, xs)
    S = Schema(520, 380, 'Une fonction étagée réduite cs et les ensembles croissants E_n')
    R = Repere(-0.12, 2.3, -0.62, 2.18, 40, 8, 450, 350)
    R.axes(S, 'x', '')
    marche(S, R, [(0, al, 1.0), (al, be, 1.5), (be, 2, 1.0)], 'v', l=2)
    marche(S, R, [(0, al, c), (al, be, 1.5 * c), (be, 2, c)], 'v', d=True)
    R.graphe(S, lambda x: fn(2, x), 0, 2, 'b', l=1.6)
    R.graphe(S, lambda x: fn(6, x), 0, 2, 'b', l=1.6)
    R.graphe(S, f, 0, 2, 't', l=2.2)
    for n, E, y in ((2, E2, -0.24), (6, E6, -0.46)):
        for u, v in E:
            S.ligne(R(u, y), R(v, y), 'r', l=5)
            S.ligne(R(u, 0), R(u, y), 'r', d=True)
        S.texte(R(2, y) + [10, 0], f'E_{n}', 'r', ancre='start', taille=15)
    S.texte(R(1, 2) + [0, -14], 'f', ancre='middle')
    S.texte(R(1.0, 1.5) + [0, 14], 's', 'v')
    S.texte(R(1.0, 1.125) + [0, 14], 'cs', 'v', taille=15)
    S.texte(R(0.55, fn(2, 0.55)) + [12, 10], 'f_2', 'b', ancre='start', taille=15)
    S.texte(R(0.75, fn(6, 0.75)) + [14, 14], 'f_6', 'b', ancre='start', taille=15)
    for xv, sv in [(1, '1'), (2, '2')]:
        S.ligne(R(xv, 0) + [0, -3], R(xv, 0) + [0, 3], 'g')
        S.texte(R(xv, 0) + [10, 12], sv, 'g', taille=14)
    for yv, sv in [(c, '3/4'), (1, None), (1.5 * c, '9/8'), (1.5, '3/2'), (2, '2')]:
        S.ligne(R(0, yv) + [-3, 0], R(0, yv) + [3, 0], 'g')
        if sv:                                             # « 1 » omis : il toucherait « 9/8 »
            S.texte(R(0, yv) + [-7, 0], sv, 'g', ancre='end', taille=14)
    return S


@schema('m-fatou')
def m_fatou():
    # À gauche f_n = 1_{]n, n+1]} (la bosse glisse), à droite f_n = n 1_{]0, 1/n]} (elle s'écrase) :
    # ∫ f_n = 1 pour tout n, limite simple nulle en tout point.
    gl = lambda n, x: ((x > n) & (x <= n + 1)).astype(float)
    ec = lambda n, x: n * ((x > 0) & (x <= 1 / n)).astype(float)
    xs = np.linspace(-1, 6, 70001)
    pas = xs[1] - xs[0]
    for n in range(1, 6):
        assert abs(gl(n, xs).sum() * pas - 1) < 2e-3 and abs(ec(n, xs).sum() * pas - 1) < 2e-3
    for x in np.linspace(-1, 6, 701):
        N = 2 + math.ceil(abs(x)) + (math.ceil(1 / x) if x > 0 else 0)
        assert all(gl(n, np.array(x)) == 0 and ec(n, np.array(x)) == 0 for n in range(N, N + 30))
    S = Schema(520, 300, 'Deux suites d’intégrale 1 de limite nulle : la bosse glisse, la bosse s’écrase')
    # panneau de gauche
    R = Repere(-0.25, 4.6, -0.3, 1.45, 18, 30, 250, 230)
    R.axes(S, 'x', '')
    for n in range(4):                                     # f_0 plein, les suivantes en contour pointillé
        cadre = R(np.array([n, n, n + 1, n + 1]), np.array([0, 1, 1, 0]))
        if n:                                              # retrait de 3 px : les bords voisins ne se confondent pas
            cadre = cadre + np.array([[3, 0], [3, 0], [-3, 0], [-3, 0]])
        S.poly(cadre, 'b', d=n > 0, ferme=True, rempli='b' if n == 0 else None)
        S.texte(R(n + 0.5, 1) + [0, -14], f'f_{n}', 'b', taille=15)
        S.texte(R(n + 0.5, 0.5), '1', 'b', taille=14)
        S.texte(R(n, 0) + [-6 if n == 0 else 0, 16], str(n), 'g', ancre='end' if n == 0 else 'middle', taille=14)
    S.texte(R(4, 0) + [0, 16], '4', 'g', taille=14)
    S.fleche(R(0.5, 1.32), R(3.6, 1.32), 'g')
    S.ligne(R(-0.25, 0), R(4.45, 0), 'r', l=3)
    # panneau de droite
    Q = Repere(-0.12, 1.25, -0.3, 4.7, 300, 30, 190, 230)
    Q.axes(S, 'x', '')
    for n in (4, 2, 1):
        S.poly(Q(np.array([0, 0, 1 / n, 1 / n]), np.array([0, n, n, 0])), 'b', ferme=True, rempli='b')
        S.texte(Q(1 / n, n) + [8, -10], f'f_{n}', 'b', ancre='start', taille=15)
    for xv, sv in [(0.25, '1/4'), (0.5, '1/2'), (1, '1')]:
        S.texte(Q(xv, 0) + [0, 16], sv, 'g', taille=14)
    S.ligne(Q(-0.12, 0), Q(1.12, 0), 'r', l=3)
    S.texte((150, 286), 'f_n → 0, ∫ f_n = 1', 'r', taille=15)
    S.texte((395, 286), 'f_n → 0, ∫ f_n = 1', 'r', taille=15)
    return S


@schema('m-fubini')
def m_fubini():
    # a_{mn} = 1 si m = n, -1 si m = n + 1, 0 sinon (m indice de ligne, n de colonne).
    a = lambda m, n: 1 if m == n else (-1 if m == n + 1 else 0)
    N = 400                                                 # chaque ligne et chaque colonne n'a que deux termes non nuls
    lignes = [sum(a(m, n) for n in range(N)) for m in range(N - 1)]
    colonnes = [sum(a(m, n) for m in range(N)) for n in range(N - 1)]
    assert lignes[0] == 1 and all(v == 0 for v in lignes[1:])
    assert all(v == 0 for v in colonnes)
    assert sum(lignes) == 1 and sum(colonnes) == 0
    assert sum(abs(a(m, n)) for m in range(N) for n in range(N)) == 2 * N - 1   # croît sans borne
    M, K = 6, 6                                             # lignes 0..5, colonnes 0..5 affichées
    S = Schema(500, 446, 'Une famille double dont les deux sommes itérées diffèrent')
    x0, y0, h = 92, 58, 46
    S.texte((x0 + K * h / 2, 18), 'n', 'g')
    S.texte((40, y0 + M * h / 2), 'm', 'g')
    for n in range(K):
        S.texte((x0 + (n + 0.5) * h, 40), str(n), 'g', taille=14)
    for m in range(M):
        S.texte((x0 - 14, y0 + (m + 0.5) * h), str(m), 'g', ancre='end', taille=14)
    S.rect(x0, y0, K * h, M * h, 'g')
    for m in range(M):
        for n in range(K):
            v = a(m, n)
            p = (x0 + (n + 0.5) * h, y0 + (m + 0.5) * h)
            if v == 1:
                S.texte(p, '1', 'r')
            elif v == -1:
                S.texte(p, '−1', 'b')
            else:
                S.texte(p, '0', 'g', taille=14)
    S.texte((x0 + K * h + 18, y0 + M * h / 2), '⋯', 'g')
    for n in range(K):
        S.texte((x0 + (n + 0.5) * h, y0 + M * h + 14), '⋮', 'g', taille=14)
    # sommes des lignes (à droite) et des colonnes (en bas)
    xs_ = x0 + K * h + 74
    S.texte((xs_, 40), 'Σ_n', 't', taille=16)
    for m in range(M):
        S.texte((xs_, y0 + (m + 0.5) * h), str(lignes[m]), 'r' if lignes[m] else 'g', taille=15)
    ys_ = y0 + M * h + 46
    S.texte((x0 - 14, ys_), 'Σ_m', 't', ancre='end', taille=16)
    for n in range(K):
        S.texte((x0 + (n + 0.5) * h, ys_), str(colonnes[n]), 'g', taille=15)
    S.ligne((xs_ - 20, y0), (xs_ - 20, y0 + M * h), 'g')
    S.ligne((x0, ys_ - 20), (x0 + K * h, ys_ - 20), 'g')
    S.texte((140, ys_ + 46), 'Σ_m Σ_n a_{mn} = 1', 'r', taille=16)
    S.texte((370, ys_ + 46), 'Σ_n Σ_m a_{mn} = 0', 'b', taille=16)
    return S


# ================================================================ fourier

@schema('fo-fejer')
def fo_fejer():
    N = 8
    D = lambda t, n: 1 + 2 * sum(np.cos(k * t) for k in range(1, n + 1))
    Fj = lambda t: sum(D(t, k) for k in range(N + 1)) / (N + 1)
    t = np.linspace(-math.pi, math.pi, 4001)
    tz = t[np.abs(np.sin(t / 2)) > 1e-9]
    assert np.allclose(D(tz, N), np.sin((N + 0.5) * tz) / np.sin(tz / 2))
    assert np.allclose(Fj(tz), (np.sin((N + 1) * tz / 2) / np.sin(tz / 2)) ** 2 / (N + 1))
    assert np.all(Fj(t) >= -1e-12)
    assert abs(D(0.0, N) - 17) < 1e-12 and abs(Fj(0.0) - 9) < 1e-12
    delta = math.pi / 4
    zone = np.abs(t) >= delta
    borne = 1 / ((N + 1) * math.sin(delta / 2) ** 2)
    assert Fj(t[zone]).max() <= borne + 1e-12
    assert abs(borne - 0.7587) < 1e-4                    # valeur citée dans la légende
    dmin = D(t, N).min()
    S = Schema(520, 380, 'Noyaux de Dirichlet et de Fejér pour N = 8')
    R = Repere(-3.45, 3.75, -5.0, 18.6, 26, 6, 462, 360)
    for s in (-1, 1):
        a, b = (delta, math.pi) if s > 0 else (-math.pi, -delta)
        S.surface(np.vstack([R(a, -4.7), R(b, -4.7), R(b, 18.0), R(a, 18.0)]), 'g')
    R.axes(S, 't', '')
    S.poly(R(t, D(t, N)), 'b', l=1.6)
    S.poly(R(t, Fj(t)), 'r', l=2.2)
    for xv, s in [(-math.pi, '−π'), (-delta, '−δ'), (delta, 'δ'), (math.pi, 'π')]:
        S.ligne(R(xv, 0) + [0, -3], R(xv, 0) + [0, 3], 'g')
    for xv, s in [(-math.pi, '−π'), (math.pi, 'π')]:
        S.texte(R(xv, -4.7) + [0, -10], s, 'g', taille=15)
    for xv, s in [(-delta, '−δ'), (delta, 'δ')]:
        S.texte(R(xv, 17.4), s, 'g', taille=15)
    S.texte(R(0, 17) + [10, 0], '17', 'b', ancre='start', taille=14)
    S.texte(R(0, 9) + [12, 0], '9', 'r', ancre='start', taille=14)
    S.texte(R(0.42, 12.5), 'D_8', 'b', ancre='start')
    S.texte(R(0.55, 5.5), 'F_8', 'r', ancre='start')
    S.texte(R(-2.0, 13.5), '|t| ⩾ δ', 'g')
    assert dmin > -4.7
    return S


@schema('fo-dirichlet')
def fo_dirichlet():
    # f(x) = x sur ]-π, π[, prolongée par périodicité ; S_N f = 2 Σ_{n<=N} (-1)^{n+1} sin(nx)/n.
    def Sn(x, N):
        return 2 * sum((-1) ** (n + 1) * np.sin(n * x) / n for n in range(1, N + 1))
    pi = math.pi
    assert abs(Sn(np.array([pi]), 20)[0]) < 1e-12 and abs(Sn(np.array([-pi]), 3)[0]) < 1e-12
    xs = np.linspace(-pi, pi, 20001)
    gibbs = Sn(xs, 20).max()
    assert gibbs > pi + 0.4                                # dépassement de Gibbs net (3,553 > π)
    # coefficients : b_n = (1/π) ∫ x sin(nx) dx = 2(-1)^{n+1}/n (vérification numérique)
    for n in (1, 2, 3):
        bn = np.trapezoid(xs * np.sin(n * xs), xs) / pi
        assert abs(bn - 2 * (-1) ** (n + 1) / n) < 1e-6
    S = Schema(520, 330, 'Dents de scie et sommes partielles S_3 et S_20')
    R = Repere(-2 * pi - 0.2, 2 * pi + 0.6, -3.95, 3.95, 20, 6, 466, 318)
    R.axes(S, 'x', '')
    X = np.linspace(-2 * pi, 2 * pi, 6001)
    S.poly(R(X, Sn(X, 3)), 'v', l=1.6)
    S.poly(R(X, Sn(X, 20)), 'b', l=1.6)
    for c in (-2 * pi, 0, 2 * pi):
        a, b = max(c - pi, -2 * pi), min(c + pi, 2 * pi)
        S.ligne(R(a, a - c), R(b, b - c), 't', l=2)
    for c in (-pi, pi):
        S.ligne(R(c, -pi), R(c, pi), 'g', d=True)
        S.point(R(c, pi), 't', r=3.8, creux=True)
        S.point(R(c, -pi), 't', r=3.8, creux=True)
        S.point(R(c, 0), 'r', r=4.4)
    for xv, s in [(-pi, '−π'), (pi, 'π')]:
        S.texte(R(xv, 0) + [14, 16], s, 'g', ancre='start', taille=15)
    S.texte(R(2 * pi, 0) + [0, 18], '2π', 'g', taille=15)
    S.texte(R(-2 * pi, 0) + [-4, 18], '−2π', 'g', taille=15)
    S.ligne(R(0.45, 2.3) + [4, 6], R(1.2, 1.2), 'g')
    S.texte(R(0.45, 2.3) + [0, -4], 'f', ancre='end')
    S.texte(R(-2.0, -3.1), 'S_3f', 'v', ancre='start')
    S.texte(R(2.45, 3.25), 'S_{20}f', 'b', ancre='end')
    return S


@schema('fo-inversion')
def fo_inversion():
    # f = 1_{[-1, 1]} ; f * G_ε(x) = ∫_{-1}^{1} G_ε(x - y) dy = (erf((x+1)/(ε√2)) - erf((x-1)/(ε√2)))/2.
    def conv(x, eps):
        return np.array([(math.erf((u + 1) / (eps * math.sqrt(2))) - math.erf((u - 1) / (eps * math.sqrt(2)))) / 2
                         for u in np.atleast_1d(x)])
    # contrôle par quadrature directe avec G_ε(x) = exp(-x²/(2ε²)) / (ε√(2π))
    G = lambda x, e: np.exp(-x ** 2 / (2 * e * e)) / (e * math.sqrt(2 * math.pi))
    ys = np.linspace(-1, 1, 40001)
    for eps in (0.5, 0.2, 0.05):
        for x0 in (-1.3, 0.0, 0.7, 1.0):
            assert abs(np.trapezoid(G(x0 - ys, eps), ys) - conv(x0, eps)[0]) < 1e-6
        assert abs(conv(1.0, eps)[0] - 0.5) < 1e-4       # en ±1, la valeur reste à 1e-4 près de 1/2
        assert abs(conv(-1.0, eps)[0] - 0.5) < 1e-4
    S = Schema(520, 300, 'Indicatrice de [-1, 1] et ses régularisées f * G_ε')
    R = Repere(-2.6, 2.75, -0.2, 1.28, 20, 10, 490, 270)
    R.axes(S, 'x', '')
    X = np.linspace(-2.5, 2.5, 1201)
    for eps, c in [(0.5, 'v'), (0.2, 'b'), (0.05, 'r')]:
        S.poly(R(X, conv(X, eps)), c, l=1.8)
    S.ligne(R(-2.5, 0), R(-1, 0), 't', l=2.4)
    S.ligne(R(1, 0), R(2.5, 0), 't', l=2.4)
    S.ligne(R(-1, 1), R(1, 1), 't', l=2.4)
    for c in (-1, 1):
        S.point(R(c, 1), 't', r=3.8)
        S.point(R(c, 0), 't', r=3.8, creux=True)
        S.point(R(c, 0.5), 'r', r=3.6)
    S.ligne(R(0, 0.5) + [-3, 0], R(0, 0.5) + [3, 0], 'g')
    S.texte(R(0, 0.5) + [10, 0], '1/2', 'g', ancre='start', taille=14)
    S.texte(R(-1, 1) + [-12, 0], '1', 'g', ancre='end', taille=14)
    for xv, s in [(-1, '−1'), (1, '1')]:
        S.texte(R(xv, 0) + [0, 19], s, 'g', taille=15)
    S.texte(R(-1.75, conv(-1.75, 0.5)[0]) + [-6, -14], 'ε = 0,5', 'v', ancre='end', taille=15)
    S.ligne(R(1.8, 0.4) + [-4, 4], R(1.17, conv(1.17, 0.2)[0]), 'g')
    S.texte(R(1.8, 0.4) + [0, -6], 'ε = 0,2', 'b', ancre='start', taille=15)
    S.texte(R(1.04, 1.0) + [8, -12], 'ε = 0,05', 'r', ancre='start', taille=15)
    S.texte(R(-0.5, 1.0) + [0, -14], 'f', ancre='middle')
    return S


@schema('fo-levy')
def fo_levy():
    # F_n(x) = ⌊nx⌋/n sur [0, 1] (loi uniforme sur {k/n}), F(x) = x ; écart au plus 1/n
    def Fn(n, x):
        return min(max(math.floor(n * x + 1e-12), 0), n) / n
    for n in (4, 12):
        xs = np.linspace(0, 1, 2001)
        assert max(abs(Fn(n, x) - x) for x in xs) <= 1 / n + 1e-9
    # convergence des fonctions caractéristiques : sommes de Riemann de e^{itx}
    for t in (1.0, 5.0):
        lim = (complex(math.cos(t), math.sin(t)) - 1) / complex(0, t)
        ecarts = [abs(sum(complex(math.cos(t * k / n), math.sin(t * k / n)) for k in range(1, n + 1)) / n - lim)
                  for n in (10, 100, 1000)]
        assert ecarts[0] > ecarts[1] > ecarts[2] and ecarts[2] < 1e-2
    S = Schema(480, 300, 'Fonctions de répartition des lois uniformes discrètes et de la loi uniforme')
    R = Repere(-0.08, 1.12, -0.06, 1.1, 40, 14, 420, 260)
    R.axes(S, 'x', '')
    S.ligne(R(0, 0), R(1, 1), 'g', l=1.6)
    for n, c in ((4, 'b'), (12, 'r')):
        for k in range(n):
            S.ligne(R(k / n, k / n), R((k + 1) / n, k / n), c, l=2)
            S.point(R(k / n, k / n), c, r=2.8)
        S.point(R(1, 1), c, r=2.8)
    S.ligne(R(1, 1), R(1.1, 1), 't', l=1.4)
    for v in (1,):
        S.texte(R(v, 0) + [0, 18], '1', 'g', taille=14)
        S.texte(R(0, v) + [-10, 0], '1', 'g', ancre='end', taille=14)
    S.texte(R(0.62, 0.45) + [10, 8], 'n = 4', 'b', ancre='start', taille=15)
    S.texte(R(0.35, 0.40) + [-10, -6], 'n = 12', 'r', ancre='end', taille=15)
    return S


@schema('fo-troncature')
def fo_troncature():
    # noyau k(y) = 2(1 - sin y / y) : positif, et au moins 1 pour |y| >= 2
    def k(y):
        y = np.asarray(y, float)
        out = np.zeros_like(y)
        nz = np.abs(y) > 1e-12
        out[nz] = 2 * (1 - np.sin(y[nz]) / y[nz])
        return out
    ys = np.linspace(-14, 14, 28001)
    assert k(ys).min() >= -1e-12
    assert k(ys[np.abs(ys) >= 2]).min() >= 1
    assert abs(k(np.array([2.0]))[0] - (2 - math.sin(2))) < 1e-12 and 2 - math.sin(2) > 1.09
    # vérification de l'identité (1/u) ∫_{-u}^{u} (1 - cos(tx)) dt = k(ux) en quelques points
    for u, x in ((1.0, 0.7), (0.5, 3.0), (2.0, -1.3)):
        t = np.linspace(-u, u, 200001)
        val = np.trapezoid(1 - np.cos(t * x), t) / u
        assert abs(val - k(np.array([u * x]))[0]) < 1e-8
    S = Schema(500, 250, 'Le noyau de l’inégalité de troncature et l’indicatrice qu’il majore')
    R = Repere(-14, 14, -0.15, 2.6, 30, 20, 430, 200)
    R.axes(S, 'y', '')
    # indicatrice de {|y| >= 2}, en bleu
    S.ligne(R(-14, 1), R(-2, 1), 'b', l=2)
    S.ligne(R(2, 1), R(14, 1), 'b', l=2)
    S.ligne(R(-2, 0), R(2, 0), 'b', l=2)
    S.ligne(R(-2, 0), R(-2, 1), 'b', d=True)
    S.ligne(R(2, 0), R(2, 1), 'b', d=True)
    S.point(R(-2, 1), 'b', r=3)
    S.point(R(2, 1), 'b', r=3)
    R.graphe(S, k, -14, 14, 'r', n=1400, l=2)
    for v in (-2, 2):
        S.texte(R(v, 0) + [0, 16], str(v).replace('-', '−'), 'g', taille=14)
    S.texte(R(0, 1) + [-8, 0], '1', 'g', ancre='end', taille=14)
    S.ligne(R(-0.25, 2), R(0.25, 2), 'g')
    S.texte(R(0, 2) + [-8, 0], '2', 'g', ancre='end', taille=14)
    S.texte(R(10.4, 2.15) + [0, -14], 'k(y)', 'r', taille=16)
    S.texte(R(-9, 1) + [0, 16], '1_{|y| ⩾ 2}', 'b', taille=16)
    return S


@schema('fo-helly')
def fo_helly():
    # extractions emboîtées (exemple) : chaque ligne retire de la précédente les positions m ≡ (j mod 3) + 1 (mod 4)
    N, J, NMAX = 400, 6, 30
    lignes, prec = [], list(range(N))
    for j in range(J):
        cur = [prec[m] for m in range(len(prec)) if m % 4 != (j % 3) + 1]
        lignes.append(cur)
        prec = cur
    diag = [lignes[k][k] for k in range(J)]
    assert diag == [0, 2, 4, 10, 16, 26]
    assert all(a < b for a, b in zip(diag, diag[1:]))
    for j in range(1, J):
        assert set(lignes[j]) <= set(lignes[j - 1])
    for j in range(J):
        assert all(diag[k] in lignes[j] for k in range(j, J))
    S = Schema(500, 250, 'Extraction diagonale : lignes emboîtées et terme diagonal')
    x0, dx, y0, dy = 62, 14, 34, 34
    for n in range(NMAX + 1):
        if n % 5 == 0:
            S.texte((x0 + n * dx, 14), str(n), 'g', taille=13)
    for j in range(J):
        y = y0 + j * dy
        S.texte((x0 - 18, y), f'ψ_{j}', 't', ancre='end', taille=16)
        S.ligne((x0 - 6, y), (x0 + NMAX * dx + 6, y), 'g', d=True)
        for n in lignes[j]:
            if n > NMAX:
                break
            if n == diag[j]:
                S.point((x0 + n * dx, y), 'r', r=5)
            else:
                S.point((x0 + n * dx, y), 't', r=3)
    pts = [(x0 + diag[k] * dx, y0 + k * dy) for k in range(J)]
    S.poly(pts, 'r', l=1.4)
    return S


@schema('fo-levy-complet')
def fo_levy_complet():
    # φ_n(t) = Π_{k≤n} cos(t/k) et sa limite (10^5 facteurs)
    ks = np.arange(1, 100001)

    def phi_n(n, t):
        t = np.atleast_1d(np.asarray(t, float))
        return np.prod(np.cos(t[:, None] / ks[None, :n]), axis=1)

    def phi(t):
        t = np.atleast_1d(np.asarray(t, float))
        return np.array([np.prod(np.cos(s / ks)) for s in t])
    assert abs(phi([1.0])[0] - 0.38854) < 1e-4 and abs(phi([0.5])[0] - 0.80926) < 1e-4
    tt = np.linspace(-1, 1, 201)
    assert (phi(tt) >= 1 - tt ** 2 - 1e-12).all() and (phi(tt) <= 1 + 1e-12).all()
    S = Schema(500, 280, 'Fonctions caractéristiques de sommes aléatoires et leur limite')
    R = Repere(-6, 6, -1.08, 1.12, 30, 14, 440, 240)
    R.axes(S, 't', '')
    R.graphe(S, lambda t: 1 - t ** 2, -1.2, 1.2, 'g', n=200)
    R.graphe(S, lambda t: phi_n(1, t), -6, 6, 'v', n=600, l=1.6)
    R.graphe(S, lambda t: phi_n(3, t), -6, 6, 'b', n=600, l=1.6)
    R.graphe(S, phi, -6, 6, 'r', n=600, l=2.2)
    S.ligne(R(-0.12, 1), R(0.12, 1), 'g')
    S.texte(R(0, 1) + [-8, -10], '1', 'g', ancre='end', taille=14)
    for v in (-1, 1):
        S.ligne(R(v, -0.03), R(v, 0.03), 'g')
        S.texte(R(v, 0) + [10 * v, 15], str(v).replace('-', '−'), 'g', taille=14)
    S.texte(R(3.6, phi([3.6])[0]) + [0, -14], 'φ', 'r', taille=17)
    S.texte(R(5.0, math.cos(5.0)) + [-10, 0], 'n = 1', 'v', ancre='end', taille=15)
    S.texte(R(-5.6, phi_n(3, [-5.6])[0]) + [10, -4], 'n = 3', 'b', ancre='start', taille=15)
    return S


@schema('fo-tcl')
def fo_tcl():
    # Student à 3 degrés de liberté réduite : g(t) = (1 + |t|) e^{-|t|} ; g(t/√n)^n → e^{-t²/2}
    def g(t):
        a = np.abs(np.asarray(t, float))
        return (1 + a) * np.exp(-a)

    def gn(n, t):
        return g(np.asarray(t, float) / math.sqrt(n)) ** n
    # écarts annoncés en t = 1
    e100 = gn(100, 1.0) - math.exp(-0.5)
    assert abs(e100 - 0.0191) < 5e-4 and abs(math.exp(-0.5) / 30 - 0.0202) < 1e-4
    r100 = math.cos(0.1) ** 100
    assert abs(r100 - 0.6060) < 1e-4 and abs((math.exp(-0.5) - r100) - math.exp(-0.5) / 1200) < 1e-5
    # la densité h(x) = 2/(π(1+x²)²) a pour fonction caractéristique g (vérification numérique)
    xs = np.linspace(-400, 400, 800001)
    h = 2 / (math.pi * (1 + xs ** 2) ** 2)
    for t in (0.3, 1.0, 2.5):
        assert abs(np.trapezoid(h * np.cos(t * xs), xs) - g(t)) < 1e-6
    # l'écart à e^{-t²/2} décroît avec n
    ts = np.linspace(-4, 4, 801)
    ecarts = [np.max(np.abs(gn(n, ts) - np.exp(-ts ** 2 / 2))) for n in (1, 10, 100)]
    assert ecarts[0] > ecarts[1] > ecarts[2]
    S = Schema(500, 250, 'Fonctions caractéristiques de sommes normalisées de variables de Student')
    R = Repere(-4.2, 4.2, -0.08, 1.12, 30, 18, 440, 200)
    R.axes(S, 't', '')
    R.graphe(S, lambda t: np.exp(-t ** 2 / 2), -4.2, 4.2, 'r', n=500, l=2.2)
    R.graphe(S, lambda t: gn(1, t), -4.2, 4.2, 'v', n=500, l=1.6)
    R.graphe(S, lambda t: gn(10, t), -4.2, 4.2, 'b', n=500, l=1.6)
    S.ligne(R(-0.1, 1), R(0.1, 1), 'g')
    S.texte(R(0, 1) + [-8, -10], '1', 'g', ancre='end', taille=14)
    S.texte(R(2.6, float(gn(1, 2.6))) + [10, -12], 'n = 1', 'v', ancre='start', taille=15)
    S.texte(R(-1.9, float(gn(10, -1.9))) + [-12, -10], 'n = 10', 'b', ancre='end', taille=15)
    S.texte(R(1.25, math.exp(-1.25 ** 2 / 2)) + [-6, 4], 'e^{−t²/2}', 'r', ancre='end', taille=15)
    return S


# ================================================================ anf : théorème spectral

@schema('f-spectral-fini')
def f_spectral_fini():
    # A = (5 2 ; 2 2) : valeurs propres 6 et 1, vecteurs propres (2, 1)/√5 et (1, -2)/√5.
    A = np.array([[5.0, 2.0], [2.0, 2.0]])
    s5 = math.sqrt(5)
    v6, v1 = np.array([2.0, 1.0]) / s5, np.array([1.0, -2.0]) / s5
    assert np.allclose(A @ v6, 6 * v6) and np.allclose(A @ v1, v1) and abs(v6 @ v1) < 1e-15
    q = lambda x: x @ A @ x
    t = np.linspace(0, 2 * math.pi, 3601)
    cer = np.stack([np.cos(t), np.sin(t)], axis=1)
    qs = np.einsum('ij,jk,ik->i', cer, A, cer)
    assert abs(q(v6) - 6) < 1e-12 and abs(q(v1) - 1) < 1e-12
    assert qs.max() <= 6 + 1e-12 and qs.min() >= 1 - 1e-12                  # extremums sur le cercle
    assert abs(qs.max() - 6) < 1e-4 and abs(qs.min() - 1) < 1e-4
    assert np.linalg.norm(cer[qs.argmax()] - v6) < 1e-2 or np.linalg.norm(cer[qs.argmax()] + v6) < 1e-2
    assert np.linalg.norm(cer[qs.argmin()] - v1) < 1e-2 or np.linalg.norm(cer[qs.argmin()] + v1) < 1e-2
    # lignes de niveau q = c : x = (√(c/6) cos θ) v6 + (√c sin θ) v1
    def niveau(c):
        return np.outer(np.sqrt(c / 6) * np.cos(t), v6) + np.outer(np.sqrt(c) * np.sin(t), v1)
    e1, e6 = niveau(1.0), niveau(6.0)
    assert np.allclose(np.einsum('ij,jk,ik->i', e1, A, e1), 1) and np.allclose(np.einsum('ij,jk,ik->i', e6, A, e6), 6)
    assert np.linalg.norm(e1, axis=1).max() <= 1 + 1e-9                     # q = 1 à l'intérieur du cercle
    assert np.linalg.norm(e6, axis=1).min() >= 1 - 1e-9                     # q = 6 à l'extérieur
    xg = np.array([-0.8, 0.6])                                                # sur le cercle
    assert abs(xg @ xg - 1) < 1e-12
    assert np.allclose(A @ xg, [-2.8, -0.4]) and abs(cross2(xg, A @ xg)) > 1  # Ax non colinéaire à x

    S = Schema(500, 470, 'Le cercle unité entre deux lignes de niveau de la forme quadratique')
    R = Repere(-2.75, 2.75, -2.55, 2.6, 5, 5, 490, 458)
    k = R(1, 0)[0] - R(0, 0)[0]
    R.axes(S, '', '')
    S.poly(R(e6[:, 0], e6[:, 1]), 'r', ferme=True, l=1.6)
    S.poly(R(e1[:, 0], e1[:, 1]), 'b', ferme=True, l=1.6)
    S.cercle(R(0, 0), k, 't', rempli=None)
    L = 0.75                                                                  # longueur des flèches (direction de Ax)
    for x, c in ((v6, 'r'), (-v6, 'r'), (v1, 'b'), (-v1, 'b')):
        d = A @ x
        S.fleche(R(*x), R(*(x + L * d / np.linalg.norm(d))), c, l=2)
        S.point(R(*x), c, r=4.4)
    d = A @ xg
    S.ligne(R(*xg), R(*(xg + L * xg)), 'v', d=True)                        # direction radiale, en pointillé
    S.fleche(R(*xg), R(*(xg + L * d / np.linalg.norm(d))), 'v', l=2)
    S.point(R(*xg), 'v', r=4.4)
    S.texte(R(*(v6 + L * v6)) + [8, -10], 'Ax = 6x', 'r', ancre='start', taille=15)
    S.texte(R(*(v1 + L * v1)) + [-10, 12], 'Ax = x', 'b', ancre='end', taille=15)
    S.texte(R(*(xg + L * d / np.linalg.norm(d))) + [-6, 16], 'Ax', 'v', ancre='end', taille=15)
    S.texte(R(*xg) + [10, 16], 'x', 'v', ancre='start', taille=15)
    S.texte(R(-1.55, 1.85), '⟨Ax, x⟩ = 6', 'r', ancre='end', taille=15)
    # étiquette de q = 1, reliée à un point de l'ellipse bleue par un trait fin
    th = 0.9
    pe = math.sqrt(1 / 6) * math.cos(th) * v6 + math.sin(th) * v1
    assert abs(q(pe) - 1) < 1e-12 and np.linalg.norm(pe) < 1
    lab = np.array([1.32, -0.35])
    assert q(lab - [0.08, 0]) > 6                                             # étiquette hors de l'ellipse rouge
    S.ligne(R(*pe), R(*lab) + [-4, 0], 'b', l=0.8)
    S.texte(R(*lab), '⟨Ax, x⟩ = 1', 'b', ancre='start', taille=15)
    return S


# ================================================================ anf-lp et anf-riesz-markov (30 oct. 2026)

@schema('lp-young')
def lp_young():
    # p = 3, q = 3/2, a = b = 3/2 ; courbe y = x^{p-1} = x^2, soit x = y^{q-1} = sqrt(y).
    p, q, a, b = 3.0, 1.5, 1.5, 1.5
    assert abs(1 / p + 1 / q - 1) < 1e-15
    xs = np.linspace(0, a, 2001)
    ys = np.linspace(0, b, 2001)
    aire_b = np.trapezoid(xs ** (p - 1), xs)                  # a^p / p
    aire_v = np.trapezoid(ys ** (q - 1), ys)                  # b^q / q
    assert abs(aire_b - a ** p / p) < 1e-5 and abs(aire_v - b ** q / q) < 1e-4
    assert abs(a ** p / p - 9 / 8) < 1e-12 and abs(b ** q / q - math.sqrt(1.5)) < 1e-12
    x1 = math.sqrt(b)                                         # la courbe sort du rectangle par le haut
    xr = np.linspace(x1, a, 801)
    exces = np.trapezoid(xr ** 2 - b, xr)
    assert abs(exces - (a ** p / p + b ** q / q - a * b)) < 1e-5 and abs(exces - 0.0997) < 1e-3
    assert a ** p != b ** q                                   # hors du cas d'égalité

    S = Schema(500, 380, 'Inégalité de Young : deux aires recouvrent le rectangle')
    R = Repere(-0.12, 1.95, -0.12, 2.45, 34, 12, 420, 340)
    # région bleue : sous la courbe, de 0 à a (partie dans le rectangle) ; rouge : partie au-dessus de b
    xb = np.linspace(0, x1, 400)
    S.surface(np.vstack([R(xb, xb ** 2), R(a, b), R(a, 0), R(0, 0)]), 'b')
    S.surface(np.vstack([R(xr, xr ** 2), R(a, b), R(x1, b)]), 'r')
    # région verte : à gauche de la courbe, de 0 à b
    S.surface(np.vstack([R(xb, xb ** 2), R(0, b), R(0, 0)]), 'v')
    S.rect(*R(0, b), *(R(a, 0) - R(0, b)), 't')
    R.graphe(S, lambda x: x ** 2, 0, 1.56, 't', l=2)
    R.axes(S, 'x', 'y')
    S.texte(R(1.56, 1.56 ** 2) + [10, 6], 'y = x^2', 't', ancre='start', taille=16)
    S.texte(R(a, 0) + [0, 18], 'a', 't')
    S.texte(R(0, b) + [-12, 0], 'b', 't', ancre='end')
    S.ligne(R(a, 0) + [0, 4], R(a, 0) + [0, -4], 't')
    S.texte(R(1.0, 0.33), 'a^3/3', 'b', taille=16)
    S.texte(R(0.33, 1.05), 'b^{3/2}/(3/2)', 'v', ancre='start', taille=16)
    pr = R(1.42, 2.04)
    S.ligne(R(1.36, 1.68), pr + [-4, 8], 'r', l=0.8)
    S.texte(pr + [0, -8], 'excès ≈ 0,100', 'r', ancre='start', taille=15, ui=True)
    S.texte(R(0.75, b) + [0, -14], 'ab = 9/4', 't', taille=15)
    return S


@schema('lp-minkowski')
def lp_minkowski():
    t = np.linspace(0, 2 * math.pi, 1441)
    c, s = np.cos(t), np.sin(t)
    def boule(p):
        # |x|^p + |y|^p = 1 paramétrée par x = sgn(c)|c|^{2/p}, y = sgn(s)|s|^{2/p}
        return np.stack([np.sign(c) * np.abs(c) ** (2 / p), np.sign(s) * np.abs(s) ** (2 / p)], axis=1)
    bords = {1: boule(1), 2: boule(2), 4: boule(4)}
    for p, P in bords.items():
        assert np.allclose(np.abs(P[:, 0]) ** p + np.abs(P[:, 1]) ** p, 1)
    # convexité : tout milieu de deux points du bord est dans la boule (p ⩾ 1)
    rng = np.random.default_rng(0)
    for p, P in bords.items():
        i, j = rng.integers(0, len(P), 400), rng.integers(0, len(P), 400)
        m = (P[i] + P[j]) / 2
        assert np.all(np.abs(m[:, 0]) ** p + np.abs(m[:, 1]) ** p <= 1 + 1e-12)
    # p = 1/2 : sqrt|x| + sqrt|y| = 1, par x = u^2, y = (1-u)^2 dans le premier quadrant
    u = np.linspace(0, 1, 301)
    q1 = np.stack([u ** 2, (1 - u) ** 2], axis=1)
    assert np.allclose(np.sqrt(q1[:, 0]) + np.sqrt(q1[:, 1]), 1)
    assert math.sqrt(0.5) + math.sqrt(0.5) > 1                     # milieu de (1,0) et (0,1) hors de la « boule »
    demi = np.vstack([q1, q1[::-1] * [1, -1], q1 * [-1, -1], q1[::-1] * [-1, 1]])
    assert np.max(np.linalg.norm(np.diff(demi, axis=0), axis=1)) < 0.02          # courbe sans saut

    S = Schema(500, 430, 'Boules unités des normes p dans le plan')
    R = Repere(-1.45, 1.45, -1.3, 1.3, 40, 40, 420, 376)
    R.axes(S, 'x_1', 'x_2')
    S.poly(R(demi[:, 0], demi[:, 1]), 't', d=True, ferme=True, l=1.3)
    S.poly(R(bords[1][:, 0], bords[1][:, 1]), 'v', ferme=True, l=1.8)
    S.poly(R(bords[2][:, 0], bords[2][:, 1]), 'b', ferme=True, l=1.8)
    S.poly(R(bords[4][:, 0], bords[4][:, 1]), 'g', ferme=True, l=1.6)
    S.rect(*R(-1, 1), *(R(1, -1) - R(-1, 1)), 'r', rempli=None)
    S.point(R(0.5, 0.5), 't', r=3.6)
    S.ligne(R(1, 0), R(0, 1), 't', d=True)
    S.point(R(1, 0), 't', r=3.2)
    S.point(R(0, 1), 't', r=3.2)
    # étiquette hors du carré p = ∞, reliée au milieu par un trait fin (elle chevauchait le cercle bleu)
    lab = np.array([1.06, 0.62])
    assert lab[0] > 1                                                         # à droite du carré
    S.ligne(R(0.5, 0.5) + [4, -1], R(*lab) + [-3, 0], 't', l=0.8)
    S.texte(R(*lab), '(1/2, 1/2)', 't', ancre='start', taille=15)
    S.texte(R(-1, 1) + [-6, -12], 'p = ∞', 'r', ancre='end', taille=15, roman=False)
    S.texte(R(-0.5, -0.5) + [-14, 14], 'p = 1', 'v', ancre='end', taille=15)
    S.texte(R(-0.71, 0.71) + [-14, -6], 'p = 2', 'b', ancre='end', taille=15)
    k4 = 2 ** (-1 / 4)
    S.texte(R(k4, -k4) + [12, 10], 'p = 4', 'g', ancre='start', taille=15)
    S.texte(R(0.25, -0.25) + [6, 14], 'p = 1/2', 't', ancre='start', taille=15)
    return S


@schema('lp-radon-nikodym')
def lp_radon_nikodym():
    # X = min(U, 1/2) : F(x) = 0 (x < 0), x (0 ⩽ x < 1/2), 1 (x ⩾ 1/2) ; F_a = min(max(x,0),1/2), F_s = (1/2)1_{x ⩾ 1/2}
    Fa = lambda x: np.clip(x, 0, 0.5)
    Fs = lambda x: 0.5 * (np.asarray(x) >= 0.5)
    F = lambda x: np.where(np.asarray(x) < 0, 0.0, np.where(np.asarray(x) < 0.5, x, 1.0))
    xs = np.linspace(-0.3, 1.3, 3201)
    assert np.allclose(F(xs), Fa(xs) + Fs(xs))
    assert abs(F(0.5) - F(0.5 - 1e-12) - 0.5) < 1e-9                       # saut 1/2 = ν({1/2})

    S = Schema(500, 330, 'Fonction de répartition d’une loi mixte et sa décomposition')
    R = Repere(-0.3, 1.3, -0.1, 1.15, 30, 14, 430, 286)
    R.axes(S, 'x', '')
    # F en trait plein (encre)
    S.poly(R([-0.3, 0, 0.5], [0, 0, 0.5]), 't', l=3)
    S.poly(R([0.5, 1.3], [1, 1]), 't', l=3)
    S.point(R(0.5, 0.5), 't', r=4, creux=True)
    S.point(R(0.5, 1), 't', r=4)
    # F_a en bleu
    S.poly(R([-0.3, 0, 0.5, 1.3], [0, 0, 0.5, 0.5]) + [0, 7], 'b', l=1.8)
    # F_s en rouge
    S.poly(R([-0.3, 0.5], [0, 0]) + [0, 3], 'r', l=1.8)
    S.poly(R([0.5, 1.3], [0.5, 0.5]) + [0, -6], 'r', l=1.8)
    S.point(R(0.5, 0) + [0, 3], 'r', r=3.6, creux=True)
    S.point(R(0.5, 0.5) + [0, -6], 'r', r=3.6)
    S.ligne(R(0.5, 0.5), R(0.5, 1), 'g', d=True)
    S.texte(R(0.95, 1) + [0, -16], 'F', 't')
    S.texte(R(1.05, 0.5) + [0, 22], 'F_a', 'b')
    S.texte(R(1.05, 0.5) + [0, -24], 'F_s', 'r')
    for xv, lab in [(0, '0'), (0.5, '1/2'), (1, '1')]:
        S.ligne(R(xv, 0) + [0, -4], R(xv, 0) + [0, 4], 'g')
        S.texte(R(xv, 0) + [0, 20], lab, 'g', taille=15)
    for yv, lab in [(0.5, '1/2'), (1, '1')]:
        S.ligne(R(0, yv) + [-4, 0], R(0, yv) + [4, 0], 'g')
        S.texte(R(0, yv) + [-8, 0], lab, 'g', ancre='end', taille=15)
    S.ligne(R(0, 1), R(0.5, 1), 'g', d=True)
    return S


@schema('mk-urysohn')
def mk_urysohn():
    U = [(0.1, 0.45), (0.3, 0.7), (0.55, 0.9)]
    F = (0.2, 0.8)
    def g(i, x):
        a, b = U[i]
        return np.clip(np.minimum(x - a, b - x), 0, None)          # distance au complémentaire de ]a, b[ dans [0, 1]
    xs = np.linspace(0, 1, 4001)
    G = sum(g(i, xs) for i in range(3))
    surF = (xs >= F[0] - 1e-12) & (xs <= F[1] + 1e-12)
    delta = G[surF].min()
    assert abs(delta - 0.1) < 1e-9
    assert abs(G[np.argmin(np.abs(xs - 0.2))] - 0.1) < 1e-9 and abs(G[np.argmin(np.abs(xs - 0.8))] - 0.1) < 1e-9
    H = [g(i, xs) / np.maximum(G, delta) for i in range(3)]
    somme = sum(H)
    assert np.allclose(somme[surF], 1) and somme.max() <= 1 + 1e-12
    for i, (a, b) in enumerate(U):
        assert np.all(H[i][(xs <= a) | (xs >= b)] == 0)
    S = Schema(500, 330, 'Partition de l’unité sur un fermé recouvert par trois ouverts')
    R = Repere(-0.04, 1.08, -0.42, 1.12, 26, 10, 440, 300)
    R.axes(S, 'x', '')
    for Hi, c in zip(H, ['b', 'v', 'g']):
        S.poly(R(xs, Hi), c, l=1.8)
    S.poly(R(xs, somme), 'r', l=2.6)
    # le fermé F et les ouverts, sous l'axe
    S.ligne(R(F[0], -0.1), R(F[1], -0.1), 'r', l=5)
    S.texte(R(F[1], -0.1) + [10, 0], 'F', 'r', ancre='start')
    for (a, b), c, y, nom in zip(U, ['b', 'v', 'g'], [-0.22, -0.3, -0.22], ['U_1', 'U_2', 'U_3']):
        S.ligne(R(a, y), R(b, y), c, l=2.4)
        S.point(R(a, y), c, r=3.4, creux=True)
        S.point(R(b, y), c, r=3.4, creux=True)
        if nom == 'U_2':
            S.texte(R((a + b) / 2, y) + [0, 15], nom, c, taille=15)
        elif nom == 'U_1':
            S.texte(R(a, y) + [-9, 0], nom, c, ancre='end', taille=15)
        else:
            S.texte(R(b, y) + [9, 0], nom, c, ancre='start', taille=15)
    for xv, lab in [(0, '0'), (1, '1')]:
        S.ligne(R(xv, 0) + [0, -4], R(xv, 0) + [0, 4], 'g')
        S.texte(R(xv, 0) + [-2, 16], lab, 'g', taille=15)
    S.ligne(R(0, 1) + [-4, 0], R(0, 1) + [4, 0], 'g')
    S.texte(R(0, 1) + [-8, 0], '1', 'g', ancre='end', taille=15)
    S.texte(R(0.5, 1) + [0, -16], 'h_1 + h_2 + h_3', 'r', taille=15)
    assert abs(H[0][np.argmin(np.abs(xs - 0.25))] - 1) < 1e-9 and H[1][np.argmin(np.abs(xs - 0.25))] == 0
    assert abs(H[2][np.argmin(np.abs(xs - 0.75))] - 1) < 1e-9 and H[1][np.argmin(np.abs(xs - 0.75))] == 0
    S.texte(R(0.245, 0.8), 'h_1', 'b', taille=15)
    S.texte(R(0.5, 0.82), 'h_2', 'v', taille=15)
    S.texte(R(0.755, 0.8), 'h_3', 'g', taille=15)
    return S


@schema('mk-riesz-markov')
def mk_riesz_markov():
    n = 4
    f = lambda x: 16 * x ** 2 * (1 - x) ** 2
    xs = np.linspace(0, 1, 4001)
    fx = f(xs)
    assert abs(fx.max() - 1) < 1e-9
    fk = [np.clip(n * fx - (k - 1), 0, 1) for k in range(1, n + 1)]
    assert np.allclose(sum(fk) / n, fx)
    # U_k = {f > (k-1)/n} = ]u_k, 1 - u_k[, F_k = {f ⩾ k/n} = [v_k, 1 - v_k] ; f = c ⇔ x(1-x) = sqrt(c)/4
    def pied(c):
        return (1 - math.sqrt(1 - math.sqrt(c))) / 2            # plus petite racine de x(1 - x) = sqrt(c)/4
    for c in [0.25, 0.5, 0.75, 1.0]:
        assert abs(f(pied(c)) - c) < 1e-12
    u = [pied((k - 1) / n) for k in range(1, n + 1)]
    v = [pied(k / n) for k in range(1, n + 1)]
    for k in range(n):
        assert u[k] <= v[k]                                      # F_k ⊂ U_k
        if k + 1 < n:
            assert v[k] <= u[k + 1]                              # U_{k+1} ⊂ F_k
    S = Schema(500, 400, 'Découpage d’une fonction en tranches horizontales')
    R = Repere(-0.06, 1.1, -0.62, 1.1, 30, 8, 430, 372)
    cols = ['v', 'g', 'v', 'g']                                   # tranches : vert et gris (le bleu est pour les U_k)
    for k in range(n):
        bas, haut = k / n, (k + 1) / n
        m = fx > bas
        x0, x1 = u[k], 1 - u[k]
        xx = np.linspace(x0, x1, 800)
        yy = np.clip(f(xx), bas, haut)
        S.surface(np.vstack([R(xx, yy), R(x1, bas), R(x0, bas)]), cols[k])
        S.ligne(R(0, haut), R(1, haut), 'g', d=True)
        S.texte(R(0, haut) + [-8, 0], f'{k + 1}/4', 'g', ancre='end', taille=14)
    R.graphe(S, f, 0, 1, 't', l=2)
    R.axes(S, 'x', '')
    for k in range(n):
        y = -0.12 - 0.12 * k
        S.ligne(R(u[k], y), R(1 - u[k], y), 'b', l=2.4)
        S.point(R(u[k], y), 'b', r=3.2, creux=True)
        S.point(R(1 - u[k], y), 'b', r=3.2, creux=True)
        if v[k] < 1 - v[k]:
            S.ligne(R(v[k], y), R(1 - v[k], y), 'r', l=5)
        else:
            S.point(R(0.5, y), 'r', r=4)
        S.texte(R(1 - u[k], y) + [12, 0], f'U_{k + 1}', 'b', ancre='start', taille=14)
        S.texte(R(u[k], y) + [-10, 0], f'F_{k + 1}', 'r', ancre='end', taille=14)
    S.texte(R(0.5, 1) + [26, -6], 'f', 't', ancre='start')
    return S
