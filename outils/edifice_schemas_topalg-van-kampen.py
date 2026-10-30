"""Schémas du chapitre « Théorème de Seifert-van Kampen » (graphe topalg-van-kampen) : découpage d'un lacet
de U ∪ V, grille et escaliers du lemme des factorisations, bouquet de deux cercles et ses ouverts, tore comme
carré recollé avec le petit lacet λ et la rétraction radiale. Positions calculées, propriétés vérifiées par
assert."""
import math

import numpy as np
from matplotlib.path import Path as _Path
from edifice_schemas import schema
from edifice_svg import Schema, bezier, arc


def _dans_ellipse(c, rx, ry, pts):
    pts = np.atleast_2d(pts)
    return ((pts[:, 0] - c[0]) / rx) ** 2 + ((pts[:, 1] - c[1]) / ry) ** 2 < 1 - 1e-9


@schema('vk-engendrement')
def vk_engendrement():
    # Coordonnées mathématiques (y vers le haut), puis passage à l'image.
    cU, cV, rx, ry = np.array([-75.0, 0.0]), np.array([75.0, 0.0]), 122.0, 100.0
    gam = lambda th: np.stack([150 * np.cos(th), 60 * np.sin(th)], -1)       # lacet γ, départ en x0 = γ(π/2)
    bornes = [math.pi / 2, math.pi, 3 * math.pi / 2, 2 * math.pi, 5 * math.pi / 2]
    W = ['U', 'U', 'V', 'V']
    morceaux = [gam(np.linspace(bornes[k], bornes[k + 1], 80)) for k in range(4)]
    for k, m in enumerate(morceaux):                                          # chaque morceau dans son ouvert
        c = cU if W[k] == 'U' else cV
        assert _dans_ellipse(c, rx, ry, m).all()
    x0 = gam(math.pi / 2)
    coupes = [gam(t) for t in bornes[1:4]]
    # α_1 dans U (W1 = W2 = U), α_2 dans U ∩ V (W2 = U, W3 = V), α_3 dans V
    a1 = bezier(x0, [-35, 5], [-105, -5], coupes[0], n=60)
    a2 = np.stack([np.zeros(60), np.linspace(60, -60, 60)], -1)
    a3 = bezier(x0, [35, 5], [105, -5], coupes[2], n=60)
    assert _dans_ellipse(cU, rx, ry, a1).all()
    assert _dans_ellipse(cU, rx, ry, a2).all() and _dans_ellipse(cV, rx, ry, a2).all()
    assert _dans_ellipse(cV, rx, ry, a3).all()
    assert not _dans_ellipse(cV, rx, ry, coupes[0]).any() and not _dans_ellipse(cU, rx, ry, coupes[2]).any()

    S = Schema(520, 300, 'Découpage d’un lacet de U ∪ V en lacets contenus dans U ou dans V')
    o = np.array([260.0, 150.0])
    P = lambda z: o + np.asarray(z, float) * np.array([1.0, -1.0])
    th = np.linspace(0, 2 * math.pi, 160)
    for c, col in ((cU, 'b'), (cV, 'v')):
        S.poly(P(np.stack([c[0] + rx * np.cos(th), c[1] + ry * np.sin(th)], -1)), col, ferme=True, rempli=col)
    for m in morceaux:
        S.poly(P(m), 't', l=2.4)
    for z in coupes:
        S.point(P(z), 'r', r=4)
    for a in (a1, a2, a3):
        S.poly(P(a), 'r', d=True, l=1.6)
    S.point(P(x0), 't', r=4.2)
    S.texte(P(x0) + [-14, -14], 'x_0', ancre='end')
    S.texte(P(cU) + [-100, -88], 'U', 'b')
    S.texte(P(cV) + [100, -88], 'V', 'v')
    S.texte(P(coupes[0]) + [-10, 0], 'γ(s_1)', 'r', ancre='end', taille=15)
    S.texte(P(coupes[1]) + [12, 16], 'γ(s_2)', 'r', ancre='start', taille=15)
    S.texte(P(coupes[2]) + [10, 0], 'γ(s_3)', 'r', ancre='start', taille=15)
    for k, t in enumerate([3 * math.pi / 4, 5 * math.pi / 4, 7 * math.pi / 4, 9 * math.pi / 4]):
        z = gam(t)
        n = z / np.linalg.norm(z)
        S.texte(P(z + 17 * n), f'γ_{k + 1}', taille=15)
    S.texte(P([-78, 22]), 'α_1', 'r', taille=15)
    S.texte(P([12, -6]), 'α_2', 'r', ancre='start', taille=15)
    S.texte(P([78, 22]), 'α_3', 'r', taille=15)
    return S


@schema('vk-factorisations')
def vk_factorisations():
    N = 4

    def escalier(j, i):
        """Arêtes (paires de sommets entiers) de l'escalier P_{j,i}."""
        ar = [((x, j), (x + 1, j)) for x in range(i)]
        ar.append(((i, j), (i, j - 1)))
        ar += [((x, j - 1), (x + 1, j - 1)) for x in range(i, N)]
        return ar
    A, B = escalier(2, 1), escalier(2, 2)
    R = {((1, 1), (2, 1)), ((1, 2), (2, 2)), ((1, 2), (1, 1)), ((2, 2), (2, 1))}   # côtés de R_{22}
    assert set(A) ^ set(B) == R
    assert len(A) == len(B) == N + 1

    S = Schema(470, 400, 'Grille de l’homotopie et deux escaliers consécutifs')
    L, o = 280.0, np.array([110.0, 335.0])
    P = lambda x, y: o + np.array([x * L / N, -y * L / N])
    p = P(1, 2)
    S.rect(p[0], p[1], L / N, L / N, 'g', rempli='g')
    for k in range(N + 1):
        S.ligne(P(k, 0), P(k, N), 'g')
        S.ligne(P(0, k), P(N, k), 'g')
    S.rect(P(0, N)[0], P(0, N)[1], L, L, 't')
    for ar, col, lw in ((A, 'r', 5.5), (B, 'b', 2.4)):
        pts = [ar[0][0]] + [e[1] for e in ar]
        S.poly(np.array([P(*q) for q in pts]), col, l=lw)
    S.texte(P(1.5, 1.5), 'R_{22}', taille=15)
    S.texte(P(0.5, 2) + [0, -14], 'P_{2,1}', 'r', taille=15)
    S.texte(P(1.5, 2) + [0, -14], 'P_{2,2}', 'b', taille=15)
    S.fleche(P(0, 0), P(N, 0) + [26, 0], 'g')
    S.fleche(P(0, 0), P(0, N) + [0, -26], 'g')
    S.texte(P(N, 0) + [30, 0], 's', 'g', ancre='start')
    S.texte(P(0, N) + [0, -34], 't', 'g')
    S.texte(P(2, 0) + [0, 22], 'f_1 ⋆ ⋯ ⋆ f_k', taille=15)
    S.texte(P(2, N) + [0, -16], 'f′_1 ⋆ ⋯ ⋆ f′_l', taille=15)
    S.texte(P(0, 2) + [-12, 0], 'x_0', 'g', ancre='end', taille=15)
    S.texte(P(N, 2) + [12, 0], 'x_0', 'g', ancre='start', taille=15)
    return S


@schema('vk-bouquet')
def vk_bouquet():
    S = Schema(520, 300, 'Le bouquet de deux cercles et les ouverts U et V')

    def bouquet(o, r, cg='t', cd='t', trou=None, l=2.2):
        cG, cD = o + [-r, 0], o + [r, 0]
        assert abs(np.linalg.norm(cD - cG) - 2 * r) < 1e-9          # tangents en o
        th = np.linspace(0, 2 * math.pi, 200)
        S.poly(arc(cG, r, 0, 2 * math.pi, 200), cg, ferme=True, l=l)
        S.poly(arc(cD, r, 0, 2 * math.pi, 200), cd, ferme=True, l=l)
        q1, q2 = cG + [-r, 0], cD + [r, 0]                          # points p(1/2) des deux cercles
        assert abs(np.linalg.norm(q1 - o) - 2 * r) < 1e-9 and abs(np.linalg.norm(q2 - o) - 2 * r) < 1e-9
        return cG, cD, q1, q2

    # en haut : W, avec les lacets a et b
    o = np.array([260.0, 92.0])
    r = 54.0
    cG, cD, q1, q2 = bouquet(o, r)
    # flèches de parcours (sens direct de l'image : y vers le bas, donc angle décroissant)
    for c, nom, col in ((cG, 'a', 'r'), (cD, 'b', 'b')):
        t0 = -math.pi / 2
        pts = arc(c, r, t0 + 0.35, t0 - 0.35, 20)
        S.courbe_fleche(pts, col, l=2.4)
        S.texte(c + [0, -r - 16], nom, col)
    S.point(o, 't', r=4)
    S.texte(o + [14, 30], 'x_0', ancre='start')
    S.point(q1, 'g', r=3.4)
    S.point(q2, 'g', r=3.4)
    S.texte(q1 + [-10, 0], 'q_1', 'g', ancre='end', taille=15)
    S.texte(q2 + [10, 0], 'q_2', 'g', ancre='start', taille=15)
    S.texte(o + [0, -r - 24], 'W', 'g')

    # en bas : U, V, U ∩ V
    r2 = 30.0
    for k, (nom, col, sans) in enumerate((('U', 'r', ('q2',)), ('V', 'b', ('q1',)), ('U ∩ V', 'v', ('q1', 'q2')))):
        oo = np.array([95.0 + 165 * k, 228.0])
        cG2, cD2, p1, p2 = bouquet(oo, r2, col, col, l=2.2)
        for nm, p in (('q1', p1), ('q2', p2)):
            if nm in sans:
                S.point(p, col, r=4.6, creux=True)
        S.point(oo, col, r=3.4)
        S.texte(oo + [0, r2 + 22], nom, col)
    return S


@schema('vk-tore')
def vk_tore():
    c = np.array([0.5, 0.5])
    linf = lambda z: np.abs(np.asarray(z) - c).max(-1)
    r = lambda z: c + (np.asarray(z) - c) / (2 * linf(z))

    def lam(s):
        if s <= .25: return np.array([.25 + 2 * s, .25])
        if s <= .5: return np.array([.75, 2 * s - .25])
        if s <= .75: return np.array([1.75 - 2 * s, .75])
        return np.array([.25, 2.25 - 2 * s])

    def bord(s):
        if s <= .25: return np.array([4 * s, 0.0])
        if s <= .5: return np.array([1.0, 4 * s - 1])
        if s <= .75: return np.array([3 - 4 * s, 1.0])
        return np.array([0.0, 4 - 4 * s])
    ss = np.linspace(0, 1, 401)
    for s in ss:
        assert abs(linf(lam(s)) - .25) < 1e-12
        assert np.allclose(r(lam(s)), bord(s))                  # r ∘ λ = bord de C, parcouru a, b, ā, b̄
    x0 = lam(0)
    rho = lambda z, t: c + (1 + t * (1 / (2 * linf(z)) - 1)) * (z - c)
    for t in np.linspace(0, 1, 11):
        assert np.allclose(rho(x0, t), [(1 - t) / 4, (1 - t) / 4])   # δ(t)

    S = Schema(470, 400, 'Le tore comme carré recollé, le petit lacet λ et la rétraction radiale')
    L, o = 270.0, np.array([110.0, 340.0])
    P = lambda z: o + np.array([z[0] * L, -z[1] * L])
    # rayons de la rétraction : de c vers le bord, à travers des points de ∂C′
    for s in np.linspace(0, 1, 17)[:-1] + 1 / 64:
        z = lam(s)
        S.ligne(P(c + 0.12 * (z - c) / linf(z)), P(r(z)), 'g', d=True)
    # côtés du carré, avec les flèches d'identification
    S.ligne(P([0, 0]), P([1, 0]), 't', l=2.2)
    S.ligne(P([0, 1]), P([1, 1]), 't', l=2.2)
    S.ligne(P([0, 0]), P([0, 1]), 't', l=2.2)
    S.ligne(P([1, 0]), P([1, 1]), 't', l=2.2)
    for y in (0, 1):
        S.pointe(P([0.56, y]), [1, 0], 't', taille=11, largeur=5)
        S.texte(P([0.5, y]) + [0, 20 if y == 0 else -18], 'a')
    for x in (0, 1):
        for dy in (0.0, 0.05):
            S.pointe(P([x, 0.53 + dy]), [0, -1], 't', taille=11, largeur=5)
        S.texte(P([x, 0.5]) + [-18 if x == 0 else 18, 0], 'b')
    # petit lacet λ
    pts = np.array([P(lam(s)) for s in ss])
    S.poly(pts, 'r', l=2.6)
    S.pointe(P(lam(0.14)), [1, 0], 'r', taille=10, largeur=4.5)
    S.texte(P(lam(0.125)) + [0, 18], 'λ', 'r')
    # chemin δ
    S.poly(np.array([P(rho(x0, t)) for t in np.linspace(0, 1, 30)]), 'b', l=2.6)
    S.point(P(x0), 'r', r=4)
    S.texte(P(x0) + [12, -10], 'x_0', 'r', ancre='start', taille=15)
    S.texte(P([0.125, 0.125]) + [-10, -10], 'δ', 'b', ancre='end', taille=16)
    S.point(P([0, 0]), 't', r=4)
    S.texte(P([0, 0]) + [-10, 16], '(e, e)', ancre='end', taille=15)
    S.point(P(c), 'g', r=4.2, creux=True)
    S.texte(P(c) + [12, -10], 'q', 'g', ancre='start', taille=15)
    S.texte(P([1, 1]) + [12, -12], 'C', 'g', ancre='start')
    return S
