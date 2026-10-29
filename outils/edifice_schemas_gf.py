"""Schémas du graphe gf (groupes finis).

Les treillis de sous-groupes sont calculés : on énumère les sous-groupes engendrés par une ou deux
parties, on vérifie leur nombre, la normalité, et l'on ne trace que les inclusions sans intermédiaire.
"""
import math
from itertools import product
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema


# ------------------------------------------------------------------ petits groupes calculables
def engendre(gens, mul, e):
    H = {e}
    frontiere = [e]
    while frontiere:
        x = frontiere.pop()
        for g in gens:
            y = mul(x, g)
            if y not in H:
                H.add(y); frontiere.append(y)
    return frozenset(H)


def sous_groupes(els, mul, e):
    S = set()
    for a in els:
        for b in els:
            S.add(engendre([a, b], mul, e))
    return S


def inverse(x, els, mul, e):
    return next(y for y in els if mul(x, y) == e)


def distingue(H, els, mul, e):
    return all(mul(mul(g, h), inverse(g, els, mul, e)) in H for g in els for h in H)


def couvertures(S):
    return [(A, B) for A in S for B in S if A < B and not any(A < C < B for C in S)]


def boite(S, centre, texte, c, rempli, l=110, h=30):
    S.rect(centre[0] - l / 2, centre[1] - h / 2, l, h, c, rempli=rempli, rx=7)
    S.texte(centre, texte, c, taille=15)


def treillis(S, sg, pos, noms, ext, distingues):
    for A, B in couvertures(sg):
        S.ligne(pos[A] + [0, -15], pos[B] + [0, 15], 'g')
    for H in sg:
        if H in ext:
            boite(S, pos[H], noms[H], 't', 'g', l=78)
        elif H in distingues:
            boite(S, pos[H], noms[H], 'b', 'b', l=78)
        else:
            boite(S, pos[H], noms[H], 'r', None, l=78)
            S.rect(pos[H][0] - 39, pos[H][1] - 15, 78, 30, 'r', d=True, rx=7)


# ------------------------------------------------------------------ gf-cycliques
@schema('gf-cycliques')
def gf_cycliques():
    n = 12
    els = list(range(n))
    mul = lambda a, b: (a + b) % n
    sg = sous_groupes(els, mul, 0)
    assert len(sg) == 6 and sorted(len(H) for H in sg) == [1, 2, 3, 4, 6, 12]
    par_ordre = {len(H): H for H in sg}
    for d, H in par_ordre.items():
        assert H == engendre([n // d], mul, 0)
    S = Schema(440, 300, 'Les six sous-groupes de ℤ/12ℤ, un par diviseur de 12')
    pos = {par_ordre[12]: np.array([220., 34]), par_ordre[6]: np.array([130., 108]), par_ordre[4]: np.array([310., 108]),
           par_ordre[3]: np.array([130., 182]), par_ordre[2]: np.array([310., 182]), par_ordre[1]: np.array([220., 258])}
    noms = {par_ordre[d]: (f'⟨{n // d}⟩' if d not in (1, 12) else ('{0}' if d == 1 else 'ℤ/12ℤ')) for d in par_ordre}
    for A, B in couvertures(sg):
        S.ligne(pos[A] + [0, -15], pos[B] + [0, 15], 'g')
    for d, H in par_ordre.items():
        boite(S, pos[H], noms[H], 'b', 'b', l=86)
        S.texte(pos[H] + ([62, 0] if pos[H][0] > 220 else [-62, 0]), f'ordre {d}', 'g',
                ancre='start' if pos[H][0] > 220 else 'end', taille=13, ui=True)
    return S


# ------------------------------------------------------------------ gf-actions
@schema('gf-actions')
def gf_actions():
    # carré de sommets 1..4 (sens direct) ; isométries = 4 rotations + 4 symétries
    S = Schema(560, 250, 'Orbite et stabilisateur du sommet 1 pour les isométries du carré')
    c = 70
    def sommets(o):
        return {1: o + [c, -c], 2: o + [-c, -c], 3: o + [-c, c], 4: o + [c, c]}
    # vérification : orbite de 1 = 4 sommets, stabilisateur = 2 éléments
    rot = lambda k: {v: (v - 1 + k) % 4 + 1 for v in range(1, 5)}
    sym = lambda k: {v: (k - v) % 4 + 1 for v in range(1, 5)}
    G = [rot(k) for k in range(4)] + [sym(k) for k in range(4)]
    assert len({tuple(sorted(g.items())) for g in G}) == 8
    assert {g[1] for g in G} == {1, 2, 3, 4} and sum(1 for g in G if g[1] == 1) == 2
    stab = [g for g in G if g[1] == 1]
    assert any(g[3] == 3 and g[2] == 4 for g in stab)     # la symétrie d'axe la diagonale 1–3
    oG, oD = np.array([130., 125]), np.array([420., 125])
    for o, nom in ((oG, 'orbite de 1'), (oD, 'stabilisateur de 1')):
        P = sommets(o)
        S.poly([P[1], P[2], P[3], P[4]], 't', ferme=True, rempli='g')
        for v, p in P.items():
            S.point(p, 'b' if v == 1 else 't', r=5 if v == 1 else 3.6)
            u = (p - o) / np.linalg.norm(p - o)
            S.texte(p + [17 * np.sign(u[0]), 0], str(v), 'b' if v == 1 else 't', taille=15)
        S.texte(o + [0, c + 36], nom, 'g', taille=14, ui=True)
    P = sommets(oG)
    for v in (2, 3, 4):
        a = math.atan2(-(P[1] - oG)[1], (P[1] - oG)[0]); b = math.atan2(-(P[v] - oG)[1], (P[v] - oG)[0])
        if b < a: b += 2 * math.pi
        r = 0.55 * c * math.sqrt(2) * (0.55 + 0.18 * v)
        t = np.linspace(a + 0.15, b - 0.15, 40)
        pts = np.stack([oG[0] + r * np.cos(t), oG[1] - r * np.sin(t)], axis=1)
        S.courbe_fleche(pts, 'b')
    P = sommets(oD)
    S.ligne(P[1] + (P[1] - oD) * 0.1, P[3] + (P[3] - oD) * 0.1, 'r', d=True, l=2)
    return S


# ------------------------------------------------------------------ gf-diedraux
@schema('gf-diedraux')
def gf_diedraux():
    S = Schema(560, 270, 'Le pentagone et l’hexagone réguliers et leurs axes de symétrie')
    for col, n in enumerate((5, 6)):
        o = np.array([140. + 280 * col, 135]); R = 95
        V = [o + R * np.array([math.sin(2 * math.pi * k / n), -math.cos(2 * math.pi * k / n)]) for k in range(n)]
        # axes : par chaque sommet et le centre ; pour n pair, aussi par les milieux de côtés
        axes = []
        for k in range(n):
            d = (V[k] - o) / R
            axes.append(d)
            if n % 2 == 0:
                m = (V[k] + V[(k + 1) % n]) / 2 - o
                axes.append(m / np.linalg.norm(m))
        uniq = []
        for d in axes:
            if not any(abs(abs(np.dot(d, e)) - 1) < 1e-9 for e in uniq):
                uniq.append(d)
        assert len(uniq) == n
        if n % 2:
            # pour n impair, chaque axe passe par un sommet et par le milieu du côté opposé
            for k in range(n):
                m = (V[(k + (n // 2)) % n] + V[(k + (n // 2) + 1) % n]) / 2 - o
                assert abs(abs(np.dot((V[k] - o) / R, m / np.linalg.norm(m))) - 1) < 1e-9
        S.poly(V, 't', ferme=True, rempli='g', l=1.8)
        for d in uniq:
            S.ligne(o - 1.18 * R * d, o + 1.18 * R * d, 'o', d=True)
        for p in V:
            S.point(p, 't', r=3.4)
        t = np.linspace(-0.2, 2 * math.pi / n - 0.2, 30)
        pts = np.stack([o[0] + 30 * np.sin(t), o[1] - 30 * np.cos(t)], axis=1)
        S.courbe_fleche(pts, 'b')
        S.texte(o + [14, -2], 'r', 'b', ancre='start', taille=15)
        S.texte(o + [0, R + 30], f'𝒟_{n}', 't', taille=16)
    return S


# ------------------------------------------------------------------ gf-ordre-8
@schema('gf-ordre-8')
def gf_ordre_8():
    # D4 = Z/4 ⋊ Z/2 : éléments (m, b) ; Q8 = unités de Hamilton (signe, lettre)
    D = [(m, b) for m in range(4) for b in range(2)]
    dmul = lambda x, y: ((x[0] + (-1) ** x[1] * y[0]) % 4, (x[1] + y[1]) % 2)
    sgD = sous_groupes(D, dmul, (0, 0))
    assert len(sgD) == 10
    L = ['1', 'i', 'j', 'k']
    tab = {('1', x): (1, x) for x in L}
    tab.update({(x, '1'): (1, x) for x in L})
    tab.update({('i', 'i'): (-1, '1'), ('j', 'j'): (-1, '1'), ('k', 'k'): (-1, '1'), ('i', 'j'): (1, 'k'), ('j', 'i'): (-1, 'k'),
                ('j', 'k'): (1, 'i'), ('k', 'j'): (-1, 'i'), ('k', 'i'): (1, 'j'), ('i', 'k'): (-1, 'j')})
    Q = [(s, x) for s in (1, -1) for x in L]
    qmul = lambda a, b: (a[0] * b[0] * tab[(a[1], b[1])][0], tab[(a[1], b[1])][1])
    sgQ = sous_groupes(Q, qmul, (1, '1'))
    assert len(sgQ) == 6
    distD = {H for H in sgD if distingue(H, D, dmul, (0, 0))}
    distQ = {H for H in sgQ if distingue(H, Q, qmul, (1, '1'))}
    assert len(distD) == 6 and distQ == sgQ          # D4 : 4 sous-groupes non distingués ; Q8 : aucun
    S = Schema(710, 330, 'Treillis des sous-groupes de 𝒟₄ (à gauche) et de 𝒬₈ (à droite)')
    e = (0, 0); r = (1, 0); s_ = (0, 1)
    nomD = {}
    def gD(*g): return engendre(list(g), dmul, e)
    rs = lambda m: (m, 1)
    H = {'D4': frozenset(D), 'r': gD(r), 'V1': gD((2, 0), rs(0)), 'V2': gD((2, 0), rs(1)), 'r2': gD((2, 0)),
         's': gD(rs(0)), 'r2s': gD(rs(2)), 'rs': gD(rs(1)), 'r3s': gD(rs(3)), 'e': frozenset([e])}
    assert set(H.values()) == sgD
    noms = {'D4': '𝒟_4', 'r': '⟨r⟩', 'V1': '⟨r^2, s⟩', 'V2': '⟨r^2, rs⟩', 'r2': '⟨r^2⟩', 's': '⟨s⟩',
            'r2s': '⟨r^2s⟩', 'rs': '⟨rs⟩', 'r3s': '⟨r^3s⟩', 'e': '{e}'}
    xs = {'D4': 213, 'V1': 113, 'r': 213, 'V2': 313, 's': 45, 'r2s': 129, 'r2': 213, 'rs': 297, 'r3s': 381, 'e': 213}
    ys = {8: 30, 4: 110, 2: 190, 1: 280}
    pos = {H[k]: np.array([float(xs[k]), float(ys[len(H[k])])]) for k in H}
    # les boîtes (largeur 78) de même ordre ne se chevauchent pas et restent dans le cadre
    for o in ys:
        xo = sorted(p[0] for K, p in pos.items() if len(K) == o)
        assert all(b - a >= 82 for a, b in zip(xo, xo[1:])) and xo[0] - 39 >= 4
    nomsD = {H[k]: noms[k] for k in H}
    treillis(S, sgD, pos, nomsD, {H['D4'], H['e']}, distD)
    # Q8
    def gQ(*g): return engendre(list(g), qmul, (1, '1'))
    K = {'Q8': frozenset(Q), 'i': gQ((1, 'i')), 'j': gQ((1, 'j')), 'k': gQ((1, 'k')), '-1': gQ((-1, '1')), 'e': frozenset([(1, '1')])}
    assert set(K.values()) == sgQ
    nq = {'Q8': '𝒬_8', 'i': '⟨i⟩', 'j': '⟨j⟩', 'k': '⟨k⟩', '-1': '{±1}', 'e': '{1}'}
    xq = {'Q8': 580, 'i': 496, 'j': 580, 'k': 664, '-1': 580, 'e': 580}
    assert 664 + 39 <= 706
    yq = {8: 30, 4: 110, 2: 190, 1: 280}
    posQ = {K[k]: np.array([float(xq[k]), float(yq[len(K[k])])]) for k in K}
    nomsQ = {K[k]: nq[k] for k in K}
    treillis(S, sgQ, posQ, nomsQ, {K['Q8'], K['e']}, distQ)
    return S


# ------------------------------------------------------------------ gf-petits-ordres
@schema('gf-petits-ordres')
def gf_petits_ordres():
    nombre = {1: 1, 2: 1, 3: 1, 4: 2, 5: 1, 6: 2, 7: 1, 8: 5, 9: 2, 10: 2, 11: 1, 12: 5}
    assert sum(nombre.values()) == 24
    premiers = {2, 3, 5, 7, 11}
    S = Schema(520, 250, 'Nombre de groupes d’ordre n, pour n de 1 à 12')
    x0, y0, l, hu = 50, 210, 34, 34
    S.ligne([x0 - 10, y0], [x0 + 12 * (l + 4) + 6, y0], 'g')
    for k in range(0, 6):
        y = y0 - k * hu
        S.ligne([x0 - 14, y], [x0 - 10, y], 'g')
        S.texte([x0 - 18, y], str(k), 'g', ancre='end', taille=12, ui=True)
    for n, v in nombre.items():
        x = x0 + (n - 1) * (l + 4)
        c = 'g' if n in premiers or n == 1 else ('r' if v == 5 else 'b')
        S.rect(x, y0 - v * hu, l, v * hu, c, rempli=c)
        S.texte([x + l / 2, y0 + 16], str(n), 't', taille=13, ui=True)
        S.texte([x + l / 2, y0 - v * hu - 10], str(v), c, taille=13, ui=True)
    S.texte([x0 + 6 * (l + 4), y0 + 36], 'ordre n', 'g', taille=13, ui=True)
    return S


# ------------------------------------------------------------------ gf-multiplicatif
@schema('gf-multiplicatif')
def gf_multiplicatif():
    # (ℤ/13ℤ)^× en cadran : la classe 2^k à l'heure k ; ordres, sous-groupes d'ordres 3 et 4, comptes φ(d).
    q, m, g = 13, 12, 2
    val = [pow(g, k, q) for k in range(m)]
    assert sorted(val) == list(range(1, q))                     # 2 est une racine primitive modulo 13
    ordre = lambda x: next(d for d in range(1, m + 1) if pow(x, d, q) == 1)
    assert all(ordre(val[k]) == m // math.gcd(m, k) for k in range(m))
    phi = lambda d: sum(1 for j in range(1, d + 1) if math.gcd(j, d) == 1)
    diviseurs = [d for d in range(1, m + 1) if m % d == 0]
    par_ordre = {d: sorted(x for x in range(1, q) if ordre(x) == d) for d in diviseurs}
    assert all(len(par_ordre[d]) == phi(d) for d in diviseurs) and sum(phi(d) for d in diviseurs) == m
    assert par_ordre[12] == [2, 6, 7, 11]
    tri = [0, 4, 8]; car = [0, 3, 6, 9]
    assert sorted(val[k] for k in tri) == sorted(x for x in range(1, q) if pow(x, 3, q) == 1) == [1, 3, 9]
    assert sorted(val[k] for k in car) == sorted(x for x in range(1, q) if pow(x, 4, q) == 1) == [1, 5, 8, 12]
    S = Schema(520, 320, 'Les puissances de 2 modulo 13 sur un cadran, et le nombre d’éléments de chaque ordre')
    O, R0 = np.array([160.0, 162.0]), 112.0
    P = lambda k: O + R0 * np.array([math.sin(2 * math.pi * k / m), -math.cos(2 * math.pi * k / m)])
    S.cercle(O, R0, 'g', d=True)
    S.poly([P(k) for k in tri], 'b', ferme=True, l=2)
    S.poly([P(k) for k in car], 'v', ferme=True, l=2)
    for k in range(m):
        gen = math.gcd(k, m) == 1
        c = 'r' if gen else ('t' if k == 0 else ('b' if k in tri else ('v' if k in car else 't')))
        S.point(P(k), c, r=5 if gen else 4)
        u = (P(k) - O) / R0
        S.texte(P(k) + 22 * u, str(val[k]), c, taille=16)
        S.texte(P(k) - 19 * u, str(k), 'g', taille=11, ui=True)
    # tableau : ordre d, éléments, nombre = φ(d)
    x1, x2, x3, y = 330, 380, 490, 50
    S.texte([x1, y], 'ordre', 'g', taille=13, ui=True)
    S.texte([x2, y], 'éléments', 'g', ancre='start', taille=13, ui=True)
    S.texte([x3, y], 'φ(d)', 'g', taille=13, ui=True)
    S.ligne([308, y + 14], [512, y + 14], 'g')
    for i, d in enumerate(diviseurs):
        yy = y + 38 + 32 * i
        c = 'r' if d == m else ('b' if d == 3 else ('v' if d == 4 else 't'))
        S.texte([x1, yy], str(d), c, taille=15)
        S.texte([x2, yy], ', '.join(map(str, par_ordre[d])), c, ancre='start', taille=15)
        S.texte([x3, yy], str(phi(d)), c, taille=15)
    yy = y + 38 + 32 * len(diviseurs) - 12
    S.ligne([308, yy], [512, yy], 'g')
    S.texte([x2, yy + 20], 'total', 'g', ancre='start', taille=13, ui=True)
    S.texte([x3, yy + 20], str(m), 't', taille=15)
    assert yy + 20 < 320 - 8
    return S


# ------------------------------------------------------------------ gf-pq-non-abelien
@schema('gf-pq-non-abelien')
def gf_pq_non_abelien():
    # ℤ/7ℤ en heptagone ; multiplications par 2 et par 4 = 2² : 0 fixe, deux orbites {1, 2, 4} et {3, 6, 5}.
    q = 7
    orb = lambda a: {frozenset(pow(a, j, q) * n % q for j in range(3)) for n in range(1, q)}
    assert pow(2, 3, q) == 1 and pow(4, 3, q) == 1 and 4 == pow(2, 2, q)
    assert orb(2) == orb(4) == {frozenset({1, 2, 4}), frozenset({3, 5, 6})}
    assert all((4 * n) % q == (2 * (2 * n)) % q for n in range(q))
    assert pow(2, -1, q) == 4                                   # ×4 est la réciproque de ×2 : sens inverse
    S = Schema(520, 270, 'Les multiplications par 2 et par 4 sur ℤ/7ℤ')
    R0 = 82.0
    for col, a in enumerate((2, 4)):
        O = np.array([130.0 + 260 * col, 122.0])
        P = lambda n: O + R0 * np.array([math.sin(2 * math.pi * n / q), -math.cos(2 * math.pi * n / q)])
        S.poly([P(n) for n in range(q)], 'g', ferme=True, d=True)
        for n in range(1, q):
            c = 'r' if n in (1, 2, 4) else 'b'
            S.fleche(P(n), P(a * n % q), c, retrait=9, retrait_debut=9, l=1.8)
        for n in range(q):
            c = 't' if n == 0 else ('r' if n in (1, 2, 4) else 'b')
            S.point(P(n), c, r=4.5)
            u = (P(n) - O) / R0
            S.texte(P(n) + 20 * u, str(n), c, taille=16)
        S.texte(O + [0, R0 + 48], f'x ↦ {a}x', 't', taille=16)
    return S
