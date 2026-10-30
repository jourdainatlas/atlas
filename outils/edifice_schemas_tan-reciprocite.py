"""Schémas du chapitre « Réciprocité quadratique » (graphe tan-reciprocite) : appariement de Wilson
modulo 13, lemme de Gauss pour (5/13), rectangle de points de réseau d'Eisenstein pour p = 7, q = 11."""
import math

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


@schema('rq-wilson')
def rq_wilson():
    p = 13
    inv = {x: pow(x, -1, p) for x in range(1, p)}
    fixes = [x for x in range(1, p) if inv[x] == x]
    assert fixes == [1, p - 1]
    paires = sorted({tuple(sorted((x, inv[x]))) for x in range(1, p) if inv[x] != x})
    assert paires == [(2, 7), (3, 9), (4, 10), (5, 8), (6, 11)]
    assert all(a * b % p == 1 for a, b in paires)
    prod = 1
    for x in range(1, p):
        prod = prod * x % p
    assert prod == p - 1                     # (p − 1)! ≡ −1
    S = Schema(520, 330, 'Les douze classes non nulles modulo 13 sur un cercle, chacune reliée à son inverse')
    c, rayon = np.array([166.0, 165.0]), 128.0

    def pos(x, r=rayon):
        t = math.pi / 2 - 2 * math.pi * (x - 1) / (p - 1)
        return c + r * np.array([math.cos(t), -math.sin(t)])

    S.cercle(c, rayon, 'g', d=True)
    for a, b in paires:
        S.ligne(pos(a), pos(b), 'b')
    for x in range(1, p):
        rouge = x in fixes
        S.point(pos(x), 'r' if rouge else 'b', r=5 if rouge else 4.2)
        S.texte(pos(x, rayon + 21), str(x), 'r' if rouge else 't', taille=16)
    x0 = 342
    S.texte((x0, 62), 'x · x^{−1} ≡ 1', 't', ancre='start', taille=16)
    for k, (a, b) in enumerate(paires):
        S.texte((x0, 100 + 27 * k), f'{a} · {b} = {a * b}', 'b', ancre='start', taille=16)
    S.texte((x0, 100 + 27 * 5 + 14), '1 et 12 ≡ −1 :', 'r', ancre='start', taille=16, roman=True)
    S.texte((x0, 100 + 27 * 6 + 14), 'leurs propres inverses', 'r', ancre='start', taille=15, roman=True)
    return S


@schema('rq-lemme-gauss')
def rq_lemme_gauss():
    p, a = 13, 5
    P = (p - 1) // 2
    r = []
    for k in range(1, P + 1):
        t = a * k % p
        r.append(t if t <= P else t - p)
    assert r == [5, -3, 2, -6, -1, 4]
    assert sorted(abs(x) for x in r) == list(range(1, P + 1))
    mu = sum(x < 0 for x in r)
    assert mu == 3 and pow(a, P, p) == p - 1          # (5/13) = (−1)^3 = −1
    S = Schema(520, 250, 'Les restes de 5k modulo 13 ramenés entre −6 et 6, pour k de 1 à 6, et leur repli sur 1, …, 6')
    R = Repere(-6.6, 6.6, -1, 1, 20, 40, 480, 190)
    S.ligne(R(-6.6, 0), R(6.6, 0), 'g')
    S.ligne(R(0, -0.08), R(0, 0.08), 'g')
    for j in range(-P, P + 1):
        S.point(R(j, 0), 'g', r=2.6)
        S.texte(R(j, 0) + [0, -18], str(j).replace('-', '−'), 'g', taille=15)
    for k, x in enumerate(r, start=1):
        col = 'r' if x < 0 else 'b'
        S.point(R(x, 0), col, r=5)
        S.texte(R(x, 0) + [0, -48], f'{a * k}', col, taille=15)
        if x < 0:                           # repli de r_k sur |r_k|, au-dessous de l'axe
            m, rr = R(0, 0), abs(R(x, 0)[0] - R(0, 0)[0])
            ts = np.linspace(math.pi, 2 * math.pi, 60)
            pts = np.stack([m[0] + rr * np.cos(ts), m[1] - 0.42 * rr * np.sin(ts)], axis=-1)
            S.courbe_fleche(pts, 'r', d=True)
            S.point(R(-x, 0), 'r', r=5, creux=True)
    occupes = sorted([x for x in r if x > 0] + [-x for x in r if x < 0])
    assert occupes == list(range(1, P + 1))
    S.texte(R(-6.4, 0) + [0, -84], '5k `pour` k = 1, …, 6', 't', ancre='start', taille=15)
    S.texte(R(6.4, -0.86), 'μ = 3', 'r', ancre='end', taille=16)
    return S


@schema('rq-reciprocite')
def rq_reciprocite():
    p, q = 7, 11
    P, Q = (p - 1) // 2, (q - 1) // 2
    pts = [(x, y) for x in range(1, P + 1) for y in range(1, Q + 1)]
    assert not any(q * x == p * y for x, y in pts)
    dessous = [(x, y) for x, y in pts if p * y < q * x]
    dessus = [(x, y) for x, y in pts if p * y > q * x]
    colonnes = [q * x // p for x in range(1, P + 1)]
    lignes = [p * y // q for y in range(1, Q + 1)]
    assert colonnes == [1, 3, 4] and lignes == [0, 1, 1, 2, 3]
    assert len(dessous) == sum(colonnes) == 8 and len(dessus) == sum(lignes) == 7
    assert len(pts) == P * Q == 15
    # (7/11) = −1, (11/7) = (4/7) = 1 : produit −1 = (−1)^{PQ}
    assert pow(7, Q, q) == q - 1 and pow(11, P, p) == 1 and (P * Q) % 2 == 1
    S = Schema(500, 420, 'Les quinze points du rectangle 3 × 5, séparés par la droite 7y = 11x')
    k = 54
    R = Repere(0, 3.9, 0, 5.9, 70, 40, 3.9 * k, 5.9 * k)
    R.axes(S)
    S.rect(*R(0.5, 5.5), 3 * k, 5 * k, 'g', d=True)
    xmax = 5.9 * p / q
    S.ligne(R(0, 0), R(xmax, 5.9), 'r')
    for x in range(1, P + 1):
        S.texte(R(x, 0) + [0, 18], str(x), 'g', taille=15)
    for y in range(1, Q + 1):
        S.texte(R(0, y) + [-12, 0], str(y), 'g', ancre='end', taille=15)
    for (x, y) in dessous:
        S.point(R(x, y), 'r', r=4.5)
    for (x, y) in dessus:
        S.point(R(x, y), 'b', r=4.5)
    S.texte(R(xmax, 5.9) + [8, 10], '7y = 11x', 'r', ancre='start', taille=15)
    x0 = 318
    S.texte((x0, 172), 'sous la droite :', 'r', ancre='start', taille=15, roman=True)
    S.texte((x0, 198), '1 + 3 + 4 = 8', 'r', ancre='start', taille=16)
    S.texte((x0, 244), 'au-dessus :', 'b', ancre='start', taille=15, roman=True)
    S.texte((x0, 270), '0 + 1 + 1 + 2 + 3 = 7', 'b', ancre='start', taille=16)
    S.texte((x0, 316), '8 + 7 = 15 = 3 · 5', 't', ancre='start', taille=16)
    return S
