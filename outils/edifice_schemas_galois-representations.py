"""Schémas du chapitre « Représentations des groupes finis » (graphe galois-representations)."""
import math
from itertools import product

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


# ---------------------------------------------------------------- rp-maschke
@schema('rp-maschke')
def rp_maschke():
    p = 3
    pts = list(product(range(p), repeat=2))
    cis = lambda x, y: ((x + y) % p, y)            # image de (x, y) par la matrice (1 1 ; 0 1)
    def droite(v):
        return frozenset(((k * v[0]) % p, (k * v[1]) % p) for k in range(p))
    droites = {'y = 0': droite((1, 0)), 'x = 0': droite((0, 1)), 'y = x': droite((1, 1)), 'y = 2x': droite((1, 2))}
    assert len(set(droites.values())) == 4
    image = lambda D: frozenset(cis(*q) for q in D)
    # la droite y = 0 est la seule stable ; les trois autres tournent
    assert image(droites['y = 0']) == droites['y = 0']
    assert image(droites['x = 0']) == droites['y = x']
    assert image(droites['y = x']) == droites['y = 2x']
    assert image(droites['y = 2x']) == droites['x = 0']
    # toute droite passant par 0 est l'une des quatre
    toutes = {droite(v) for v in pts if v != (0, 0)}
    assert toutes == set(droites.values())

    S = Schema(520, 290, 'Droites de (Z/3Z)² et la transvection (x, y) ↦ (x + y, y)')
    pas = 22

    def vignette(centre, D, c):
        cx, cy = centre
        for (x, y) in pts:
            q = (cx + (x - 1) * pas, cy - (y - 1) * pas)
            if (x, y) in D:
                S.point(q, c, r=5)
            else:
                S.point(q, 'g', r=2.4)
        S.rect(cx - 1.75 * pas, cy - 1.75 * pas, 3.5 * pas, 3.5 * pas, 'g', rx=6)

    # vignette rouge, à gauche, avec une boucle
    cr = (95, 118)
    vignette(cr, droites['y = 0'], 'r')
    S.texte((cr[0], cr[1] + 62), 'y = 0', 'r')
    t = np.linspace(0.15 * math.pi, 0.85 * math.pi, 40)
    boucle = np.stack([cr[0] + 30 * np.cos(t), cr[1] - 1.75 * pas - 4 - 26 * np.sin(t)], axis=1)[::-1]
    S.courbe_fleche(boucle, 'r')
    S.texte((cr[0], 22), 'fixée', 'r', ui=True, taille=14)

    # trois vignettes bleues aux sommets d'un triangle, flèches dans l'ordre de l'image
    centres = {'x = 0': (300, 80), 'y = x': (455, 80), 'y = 2x': (377, 205)}
    for nom, c in centres.items():
        vignette(c, droites[nom], 'b')
    S.texte((300, 80 - 58), 'x = 0', 'b')
    S.texte((455, 80 - 58), 'y = x', 'b')
    S.texte((377 + 0, 205 + 60), 'y = 2x', 'b')
    ordre = ['x = 0', 'y = x', 'y = 2x', 'x = 0']
    for a, b in zip(ordre, ordre[1:]):
        P, Q = np.array(centres[a], float), np.array(centres[b], float)
        u = (Q - P) / np.linalg.norm(Q - P)
        S.fleche(P + 46 * u, Q - 46 * u, 'b', l=1.6)
    S.texte((110, 262), '(x, y) ↦ (x + y, y)', 't', taille=15)
    return S


# ---------------------------------------------------------------- rp-caracteres
@schema('rp-caracteres')
def rp_caracteres():
    A = np.array([[0.0, -1.0], [1.0, -1.0]])
    A2 = A @ A
    assert np.allclose(A2 @ A, np.eye(2)) and not np.allclose(A, np.eye(2))
    H = np.eye(2) + A.T @ A + A2.T @ A2
    assert np.allclose(H, [[4, -2], [-2, 4]])
    assert np.allclose(A.T @ H @ A, H)                 # A conserve la forme
    x = np.array([1.0, 0.0])
    orbite = [x, A @ x, A2 @ x]
    assert np.allclose(orbite[1], [0, 1]) and np.allclose(orbite[2], [-1, -1])
    c = x @ H @ x
    assert all(abs(y @ H @ y - c) < 1e-12 for y in orbite) and abs(c - 4) < 1e-12
    assert abs(np.linalg.norm(orbite[2]) - 1) > 0.3      # A²x n'est pas sur le cercle unité
    assert not np.allclose(A.T @ A, np.eye(2))          # A n'est pas orthogonale

    S = Schema(500, 360, 'Ellipse invariante par une matrice d’ordre 3')
    R = Repere(-1.75, 1.75, -1.45, 1.45, 50, 20, 400, 330)
    R.axes(S, '', '')
    t = np.linspace(0, 2 * math.pi, 361)
    S.poly(R(np.cos(t), np.sin(t)), 'g', ferme=True, d=True)
    # ellipse {y : yHy = 4} : y = 2 H^{-1/2} (cos t, sin t)
    w, V = np.linalg.eigh(H)
    Hm = V @ np.diag(1 / np.sqrt(w)) @ V.T
    ell = 2 * Hm @ np.stack([np.cos(t), np.sin(t)])
    assert np.allclose(np.einsum('in,ij,jn->n', ell, H, ell), 4)
    S.poly(R(ell[0], ell[1]), 'r', ferme=True, l=1.8)
    # arcs de l'ellipse parcourus par A, de x à Ax, de Ax à A²x, de A²x à x
    ang = [math.atan2(*(np.linalg.solve(2 * Hm, y))[::-1]) for y in orbite]
    for k in range(3):
        a0, a1 = ang[k], ang[(k + 1) % 3]
        while a1 <= a0: a1 += 2 * math.pi
        s = np.linspace(a0 + 0.12, a1 - 0.12, 60)
        arcpts = 0.86 * 2 * Hm @ np.stack([np.cos(s), np.sin(s)])
        S.courbe_fleche(R(arcpts[0], arcpts[1]), 'b')
    noms = ['x', 'Ax', 'A^2x']
    dec = [(12, 16), (12, -12), (-14, 16)]
    for y, n, d in zip(orbite, noms, dec):
        S.point(R(*y), 'r', r=4.5)
        S.texte(R(*y) + np.array(d), n, 'r', ancre='start' if d[0] > 0 else 'end', taille=16)
    return S


# ---------------------------------------------------------------- rp-s3
@schema('rp-s3')
def rp_s3():
    e = np.eye(3)
    u = np.array([1, -1, 0]) / math.sqrt(2)
    v = np.array([1, 1, -2]) / math.sqrt(6)
    assert abs(u @ v) < 1e-12 and abs(u @ u - 1) < 1e-12 and abs(v @ v - 1) < 1e-12
    proj = [e[i] - np.ones(3) / 3 for i in range(3)]
    P = [np.array([q @ u, q @ v]) for q in proj]
    # matrices, dans la base (u, v), de la transposition (1 2) et du 3-cycle (1 2 3)
    def matrice(sigma):
        M = np.zeros((3, 3))
        for i in range(3): M[sigma[i], i] = 1
        B = np.stack([u, v], axis=1)
        return B.T @ M @ B
    T = matrice([1, 0, 2]); C = matrice([1, 2, 0])
    assert abs(np.trace(T)) < 1e-12 and abs(np.linalg.det(T) + 1) < 1e-12
    assert abs(np.trace(C) + 1) < 1e-12 and abs(np.linalg.det(C) - 1) < 1e-12
    assert np.allclose(C.T @ C, np.eye(2)) and np.allclose(T.T @ T, np.eye(2))
    assert np.allclose(C @ P[0], P[1]) and np.allclose(C @ P[1], P[2]) and np.allclose(C @ P[2], P[0])
    assert np.allclose(T @ P[0], P[1]) and np.allclose(T @ P[2], P[2])
    assert abs(P[2][0]) < 1e-12                       # l'axe de (1 2) est la droite u = 0
    for i in range(3):
        for j in range(i):
            assert abs(np.linalg.norm(P[i] - P[j]) - math.sqrt(2)) < 1e-12   # équilatéral, de côté √2

    S = Schema(460, 380, 'Le plan x + y + z = 0 et le triangle des projections')
    R = Repere(-1.05, 1.05, -1.0, 0.85, 30, 20, 400, 340)
    S.poly([R(*q) for q in P], 't', ferme=True, l=1.6)
    S.ligne(R(0, -0.95), R(0, 0.8), 'b', d=True, l=1.6)
    S.texte(R(0, 0.8) + np.array([8, -4]), '(1 2)', 'b', ancre='start', roman=True, taille=16)
    # flèches de rotation p1 → p2 → p3 → p1, sur un cercle de rayon 0.42
    ang = [math.atan2(q[1], q[0]) for q in P]
    for k in range(3):
        a0, a1 = ang[k], ang[(k + 1) % 3]
        while a1 <= a0: a1 += 2 * math.pi
        s = np.linspace(a0 + 0.25, a1 - 0.25, 50)
        S.courbe_fleche(R(0.42 * np.cos(s), 0.42 * np.sin(s)), 'r')
    S.texte(R(0.0, 0.0), '(1 2 3)', 'r', roman=True, taille=15)
    dec = [(12, -10), (-12, -10), (0, 22)]
    for k, (q, d) in enumerate(zip(P, dec)):
        S.point(R(*q), 't', r=4.5)
        S.texte(R(*q) + np.array(d), f'p_{k + 1}', 't', ancre='start' if d[0] > 0 else ('end' if d[0] < 0 else 'middle'))
    return S
