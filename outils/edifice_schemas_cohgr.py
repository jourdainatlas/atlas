"""Schémas de la théorie « Cohomologie des groupes » (graphe cohgr)."""
import itertools
import math

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema


# ---------------------------------------------------------------- cg-cochaines
@schema('cg-cochaines')
def cg_cochaines():
    # ∂∂F(x0, x1, x2, x3) : le terme qui omet x1 et x2 apparaît deux fois, avec des signes opposés.
    def omet(t, rang):
        return t[:rang] + t[rang + 1:]
    depart = ('x_0', 'x_1', 'x_2', 'x_3')
    # chemin gauche : omettre x2 (rang 2) puis x1 (rang 1)
    g1 = omet(depart, 2)
    g2 = omet(g1, 1)
    # chemin droit : omettre x1 (rang 1) puis x2, descendu au rang 1
    d1 = omet(depart, 1)
    assert d1.index('x_2') == 1
    d2 = omet(d1, 1)
    assert g2 == d2 == ('x_0', 'x_3')
    sg = (-1) ** 2 * (-1) ** 1
    sd = (-1) ** 1 * (-1) ** 1
    assert sg + sd == 0
    ecrit = lambda t: '(' + ', '.join(t) + ')'
    S = Schema(520, 290, 'Les deux chemins qui omettent x_1 et x_2 portent des signes opposés')
    H, G, D, B = (260, 40), (115, 150), (405, 150), (260, 255)
    S.texte(H, ecrit(depart), 't', taille=17)
    S.texte(G, ecrit(g1), 'r', taille=17)
    S.texte(D, ecrit(d1), 'b', taille=17)
    S.texte(B, ecrit(g2), 't', taille=17)
    S.fleche([215, 58], [140, 128], 'r')
    S.fleche([140, 172], [228, 236], 'r')
    S.fleche([305, 58], [380, 128], 'b')
    S.fleche([380, 172], [292, 236], 'b')
    S.texte([150, 82], 'rang 2, signe +', 'r', ancre='end', ui=True)
    S.texte([158, 214], 'rang 1, signe −', 'r', ancre='end', ui=True)
    S.texte([370, 82], 'rang 1, signe −', 'b', ancre='start', ui=True)
    S.texte([362, 214], 'rang 1, signe −', 'b', ancre='start', ui=True)
    S.texte([62, 255], 'produit −', 'r', ui=True)
    S.texte([458, 255], 'produit +', 'b', ui=True)
    return S


# ---------------------------------------------------------------- cg-complements
@schema('cg-complements')
def cg_complements():
    # E = ℤ/4 ⋊ {e, s}, s·a = −a : groupe diédral 𝒟₄. Compléments de A = ℤ/4 × {e}.
    def act(g, a):
        return (-a) % 4 if g else a % 4

    def mul(x, y):
        return ((x[0] + act(x[1], y[0])) % 4, (x[1] + y[1]) % 2)

    E = [(a, g) for a in range(4) for g in range(2)]

    def inv(x):
        return next(y for y in E if mul(x, y) == (0, 0))
    comps = [frozenset([(0, 0), (a, 1)]) for a in range(4)]
    for H in comps:                                            # sous-groupes, A ∩ H = {e}, AH = E
        assert all(mul(x, y) in H for x in H for y in H)
        assert {mul((b, 0), h) for b in range(4) for h in H} == set(E)
    assert len(comps) == 4
    classe = {}
    for H in comps:
        orb = frozenset(frozenset(mul(mul(z, h), inv(z)) for h in H) for z in E)
        classe[H] = orb
    paires = {frozenset(next(iter(set(H) - {(0, 0)}))[0] for H in orb) for orb in classe.values()}
    assert paires == {frozenset({0, 2}), frozenset({1, 3})}         # f(s) pair / impair
    # B¹ : f(s) = s·b − b = −2b
    assert {(-2 * b) % 4 for b in range(4)} == {0, 2}
    # géométrie : (a, s) ↔ r^a s, symétrie d'axe faisant l'angle a·π/4 avec l'axe s (médiane horizontale)
    S = Schema(520, 300, 'Les quatre compléments des rotations dans le groupe diédral et les axes des symétries')
    x0, x1, ytop, pas = 70, 190, 60, 52
    def P(a, g):
        return np.array([x0 if g == 0 else x1, ytop + pas * a])
    for (a, g) in E:
        S.point(P(a, g), 'g', r=3.5)
    for a in range(4):
        S.texte(P(a, 0) - [34, 0], str(a), 'g', taille=15)
    S.texte([x0, 28], 'e', 'g', taille=16)
    S.texte([x1, 28], 's', 'g', taille=16)
    for a in range(4):
        c = 'r' if a % 2 == 0 else 'b'
        p, q = P(0, 0), P(a, 1)
        u = (q - p) / np.linalg.norm(q - p)
        S.ligne(p + 6 * u, q - 6 * u, c, d=(a >= 2))
        S.point(q, c, r=5)
    S.point(P(0, 0), 't', r=5)
    S.texte([130, 278], 'A ⋊ G', 't', taille=16)
    # carré de sommets (±1, ±1) ; axes : angle a·π/4
    C, R = np.array([395.0, 150.0]), 78.0
    som = [C + R * np.array([sx, sy]) for sx, sy in [(1, 1), (-1, 1), (-1, -1), (1, -1)]]
    S.poly(som, 't', ferme=True)
    for a in range(4):
        th = a * math.pi / 4
        u = np.array([math.cos(th), -math.sin(th)])
        L = R * (math.sqrt(2) if a % 2 else 1.0) + 26
        c = 'r' if a % 2 == 0 else 'b'
        S.ligne(C - L * u, C + L * u, c, d=(a >= 2))
        # l'axe d'indice impair passe par deux sommets, celui d'indice pair par deux milieux de côtés
        pts = [C + R * (math.sqrt(2) if a % 2 else 1.0) * u, C - R * (math.sqrt(2) if a % 2 else 1.0) * u]
        if a % 2:
            assert any(np.allclose(pts[0], s_) for s_ in som)
        else:
            assert any(np.allclose(pts[0], (som[k] + som[(k + 1) % 4]) / 2) for k in range(4))
        S.texte(C + (L + 14) * u, f'{a}', c, taille=15)
    S.texte([395, 278], 'axes des symétries (a, s)', 'g', ui=True)
    return S


# ---------------------------------------------------------------- cg-schur-zassenhaus
@schema('cg-schur-zassenhaus')
def cg_schur_zassenhaus():
    # Vérification des indices sur deux exemples : G = 𝔄₄ × ℤ/5 (premier cas), G = 𝔄₄, N = V (second cas).
    def compose(p, q):                                           # p ∘ q
        return tuple(p[i] for i in q)

    def pair(p):
        inv = sum(1 for i in range(4) for j in range(i + 1, 4) if p[i] > p[j])
        return inv % 2 == 0
    A4 = [p for p in itertools.permutations(range(4)) if pair(p)]
    e4 = (0, 1, 2, 3)

    def inv4(p):
        return tuple(sorted(range(4), key=lambda i: p[i]))
    G = [(p, k) for p in A4 for k in range(5)]
    mul = lambda x, y: (compose(x[0], y[0]), (x[1] + y[1]) % 5)
    invG = lambda x: (inv4(x[0]), (-x[1]) % 5)
    N = [(p, 0) for p in A4]
    c3 = (1, 2, 0, 3)
    P = [(e4, 0), (c3, 0), (compose(c3, c3), 0)]
    L = [g for g in G if {mul(mul(g, x), invG(g)) for x in P} == set(P)]
    M = [g for g in L if g in N]
    assert len(L) == 15 and len(M) == 3 and len(G) // len(N) == len(L) // len(M) == 5
    assert {mul(n, l) for n in N for l in L} == set(G)                 # Frattini
    V = [p for p in A4 if all(p[p[i]] == i for i in range(4))]
    assert len(V) == 4 and len(A4) // len(V) == 3
    S = Schema(520, 300, 'Les deux cas de la récurrence du théorème de Schur-Zassenhaus')

    def losange(cx, noms, couleurs, etiquettes):
        haut, gauche, droite, bas = (cx, 46), (cx - 78, 136), (cx + 78, 136), (cx, 226)
        pos = [haut, gauche, droite, bas]
        for (a, b), lab, c in zip([(0, 1), (0, 2), (2, 3), (1, 3)], etiquettes, ['r', 'g', 'r', 'g']):
            P_, Q_ = np.array(pos[a], float), np.array(pos[b], float)
            u = (Q_ - P_) / np.linalg.norm(Q_ - P_)
            S.ligne(P_ + 17 * u, Q_ - 17 * u, c)
            if lab:
                m = (P_ + Q_) / 2
                n = np.array([-u[1], u[0]])
                if n[0] * (m[0] - cx) < 0:
                    n = -n
                S.texte(m + 14 * n, lab, c, taille=15)
        for p_, nom, c in zip(pos, noms, couleurs):
            S.texte(p_, nom, c, taille=17)
        return pos
    losange(130, ['G', 'N', 'L', 'M'], ['t', 't', 'b', 'b'], ['m', '', 'm', ''])
    S.texte([130, 272], 'premier cas', 'g', ui=True)
    pos = losange(390, ['G', 'N', 'K', 'Z'], ['t', 't', 'b', 'b'], ['m', '', 'm', ''])
    # H, complément de Z dans K, sous K
    Hpos = np.array([480.0, 226.0])
    K_ = np.array(pos[2], float)
    u = (Hpos - K_) / np.linalg.norm(Hpos - K_)
    S.ligne(K_ + 17 * u, Hpos - 15 * u, 'r', d=True)
    S.texte(Hpos, 'H', 'r', taille=17)
    S.texte([390, 272], 'second cas', 'g', ui=True)
    return S
