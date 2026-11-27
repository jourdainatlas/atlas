"""Schémas du chapitre « Classification des surfaces compactes » (graphe hom-surfaces) : structure standard à six
côtés sur le carré et mot abca⁻¹b⁻¹c⁻¹, mots aabb et aba⁻¹b, coins de la surface de genre 2 recollés en un disque,
découpage le long du diamètre, opération de la paire tordue. Positions calculées à partir du paramétrage γ du bord
du carré Q = [−1, 1]², propriétés vérifiées par assert (classes de sommets, cycle des coins, recollements)."""
import math

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema


# ------------------------------------------------------------------ combinatoire et paramétrage du bord
def gamma(t):
    """Bord du carré, de période 8, depuis (−1, −1) dans le sens direct (fiche sc-polygones)."""
    t = t % 8
    if t <= 2:
        return np.array([-1 + t, -1.0])
    if t <= 4:
        return np.array([1.0, t - 3])
    if t <= 6:
        return np.array([5 - t, 1.0])
    return np.array([-1.0, 7 - t])


def lam(n, i, s):
    """Structure standard λⁿᵢ(s), 1 ≤ i ≤ n."""
    return gamma(8 * (i - 1) / n + 4 * (1 + s) / n)


def lettres(mot):
    """'a b a- b' -> [('a', 1), ('b', 1), ('a', -1), ('b', 1)]"""
    out = []
    for t in mot.split():
        out.append((t[:-1], -1) if t.endswith('-') else (t, 1))
    return out


def classes(w):
    """Classes de sommets ; le sommet i (0 ≤ i < n) est l'extrémité du côté i (côtés numérotés 1..n, le côté i
    allant du sommet i − 1 au sommet i)."""
    n = len(w)
    par = list(range(n))

    def tr(x):
        while par[x] != x:
            x = par[x]
        return x
    occ = {}
    for i, (b, e) in enumerate(w, start=1):
        occ.setdefault(b, []).append(i)
    for b, (i, j) in occ.items():
        oi, fi = ((i - 1) % n, i % n) if w[i - 1][1] == 1 else (i % n, (i - 1) % n)
        oj, fj = ((j - 1) % n, j % n) if w[j - 1][1] == 1 else (j % n, (j - 1) % n)
        par[tr(oi)] = tr(oj)
        par[tr(fi)] = tr(fj)
    cl = {}
    for v in range(n):
        cl.setdefault(tr(v), []).append(v)
    return list(cl.values())


def cycle_coins(w):
    """Cycle des coins (fiche sc-surface, (i)) : liste ordonnée des sommets d'une classe, pour un mot à une
    seule classe. Rayon (i, σ) ; coin du sommet v : rayons (v, 1) et (v + 1, −1) ; τ(i, σ) = (j, εᵢεⱼσ)."""
    n = len(w)
    occ = {}
    for i, (b, e) in enumerate(w, start=1):
        occ.setdefault(b, []).append(i)
    def tau(i, s):
        b, e = w[i - 1]
        j = [k for k in occ[b] if k != i][0]
        return (j, e * w[j - 1][1] * s)
    def coin(r):
        i, s = r
        return i % n if s == 1 else (i - 1) % n
    def autre(r):
        v = coin(r)
        a, b = ((v if v else n), 1), (v + 1 if v + 1 <= n else 1, -1)
        return b if r == a else a
    v0 = 0
    r = (n, 1)                         # rayon sortant du coin du sommet 0 (= sommet n)
    ordre = [v0]
    while True:
        r2 = tau(*r)
        v = coin(r2)
        if v == v0:
            break
        ordre.append(v)
        r = autre(r2)
    return ordre


def _unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


COUL = {'a': 'r', 'b': 'b', 'c': 'v'}


def _cote(S, P, n, i, lettre, e, couleur, etiquette, decal=22, taille=17):
    """Dessine le côté i de la structure standard à n côtés, l'étiquette et la flèche du sens de la lettre."""
    s = np.linspace(-1, 1, 81)
    pts = np.array([P(lam(n, i, x)) for x in s])
    S.poly(pts, couleur, l=3)
    # point de la flèche : le plus loin possible des coins du carré (entiers pairs du paramètre t)
    def dist_coin(x):
        t = 8 * (i - 1) / n + 4 * (1 + x) / n
        return min(abs(t - 2 * k) for k in range(-1, 6))
    s0 = max([0.0, -0.4, 0.4, -0.6, 0.6], key=lambda x: (round(dist_coin(x), 6), -abs(x)))
    assert dist_coin(s0) > 0.3
    m = P(lam(n, i, s0))
    d = P(lam(n, i, s0 + 0.05)) - P(lam(n, i, s0 - 0.05))
    d = d if e == 1 else -d
    S.pointe(m + 8 * _unit(d), d, couleur, taille=12, largeur=5.5)
    # normale sortante : le côté est sur le bord du carré, le centre est P(0, 0)
    out = _unit(m - P(np.zeros(2)))
    S.texte(m + decal * out, etiquette, couleur, taille=taille)


# ------------------------------------------------------------------ sc-polygones
@schema('sc-polygones')
def sc_polygones():
    w = lettres('a b c a- b- c-')
    n = len(w)
    assert all(sum(1 for b, _ in w if b == x) == 2 for x in 'abc')
    # la structure standard : sommets γ(8i/6), arcs de même longueur, recouvrement du bord
    for i in range(1, n + 1):
        assert np.allclose(lam(n, i, 1), gamma(8 * i / n)) and np.allclose(lam(n, i, -1), gamma(8 * (i - 1) / n))
        assert np.allclose(lam(n, i, 1), lam(n, i % n + 1, -1))
    # λ⁴ᵍ coïncide avec les arcs de cw-exemples (g = 2) : affine entre sommets
    for i in range(1, 9):
        assert np.allclose(lam(8, i, 0), (lam(8, i, -1) + lam(8, i, 1)) / 2)
    cl = classes(w)
    assert sorted(map(sorted, cl)) == [[0, 2, 4], [1, 3, 5]]
    S = Schema(440, 340, 'Structure standard à six côtés et mot abca⁻¹b⁻¹c⁻¹')
    c, L = np.array([220.0, 170.0]), 115.0
    P = lambda y: c + L * np.array([y[0], -y[1]])
    S.poly([P(y) for y in ([-1, -1], [1, -1], [1, 1], [-1, 1])], 'g', ferme=True, rempli='v', l=1)
    noms = ['a', 'b', 'c', 'a^{−1}', 'b^{−1}', 'c^{−1}']
    for i, (b, e) in enumerate(w, start=1):
        _cote(S, P, n, i, b, e, COUL[b], noms[i - 1])
    for i in range(n):
        v = P(gamma(8 * i / n))
        S.point(v, 't', r=5)
        out = _unit(v - c)
        S.texte(v + 20 * out, f'v_{i}', taille=15)
    return S


# ------------------------------------------------------------------ sc-cellulaire
@schema('sc-cellulaire')
def sc_cellulaire():
    w1 = lettres('a a b b')
    w2 = lettres('a b a- b')
    assert len(classes(w1)) == 1 and len(classes(w2)) == 1
    # la bouteille de Klein : a dans les deux sens, b deux fois dans le même sens
    assert [e for b, e in w2 if b == 'a'] == [1, -1] and [e for b, e in w2 if b == 'b'] == [1, 1]
    S = Schema(500, 270, 'Les mots aabb et aba⁻¹b')
    for k, (w, cx, titre) in enumerate([(w1, 125.0, 'N_2'), (w2, 375.0, 'K')]):
        c, L = np.array([cx, 125.0]), 80.0
        P = lambda y, c=c: c + L * np.array([y[0], -y[1]])
        S.poly([P(y) for y in ([-1, -1], [1, -1], [1, 1], [-1, 1])], 'g', ferme=True, rempli='v', l=1)
        for i, (b, e) in enumerate(w, start=1):
            nom = b + ('^{−1}' if e == -1 else '')
            _cote(S, P, 4, i, b, e, COUL[b], nom, decal=20)
        for i in range(4):
            S.point(P(gamma(2 * i)), 't', r=5)
        S.texte(c + [0, 125], titre, taille=18)
    return S


# ------------------------------------------------------------------ sc-surface
@schema('sc-surface')
def sc_surface():
    w = lettres('a b a- b- c d c- d-')
    n = len(w)
    assert len(classes(w)) == 1
    cyc = cycle_coins(w)
    assert sorted(cyc) == list(range(n))            # un seul cycle, qui passe par les huit coins
    rang = {v: m for m, v in enumerate(cyc)}
    S = Schema(520, 300, 'Les huit coins de la surface de genre 2 recollés en un disque')
    # octogone : sommets γ(i) envoyés radialement sur le cercle (angles 225° + 45° i)
    c, R = np.array([135.0, 150.0]), 105.0
    ang = [math.degrees(math.atan2(*gamma(i)[::-1])) % 360 for i in range(n)]
    assert np.allclose(ang, [(225 + 45 * i) % 360 for i in range(n)])
    V = [c + R * np.array([math.cos(math.radians(a)), -math.sin(math.radians(a))]) for a in ang]
    S.poly(V, 'g', ferme=True, rempli='v', l=1)
    r = 34.0
    for v in range(n):
        p, q = V[(v - 1) % n], V[(v + 1) % n]
        u1, u2 = _unit(p - V[v]), _unit(q - V[v])
        a1, a2 = math.atan2(u1[1], u1[0]), math.atan2(u2[1], u2[0])
        # secteur intérieur (angle 135°) entre les deux côtés issus du sommet
        da = (a2 - a1) % (2 * math.pi)
        if da > math.pi:
            a1, a2, da = a2, a1, 2 * math.pi - da
        assert abs(math.degrees(da) - 135) < 1e-6
        arc = [V[v] + r * np.array([math.cos(a1 + t * da), math.sin(a1 + t * da)]) for t in np.linspace(0, 1, 30)]
        col = 'r' if rang[v] % 2 == 0 else 'b'
        S.surface([V[v]] + arc, col)
        S.poly([V[v]] + arc + [V[v]], col, l=1.2)
        S.texte(V[v] + 1.45 * r * _unit((u1 + u2)), str(rang[v] + 1), col, taille=14)
    noms = ['a_1', 'b_1', 'a_1^{−1}', 'b_1^{−1}', 'a_2', 'b_2', 'a_2^{−1}', 'b_2^{−1}']
    for i in range(1, n + 1):
        m = (V[i - 1] + V[i % n]) / 2
        S.texte(m + 22 * _unit(m - c), noms[i - 1], 't', taille=15)
    # disque : huit secteurs dans l'ordre du cycle
    C, Rd = np.array([400.0, 150.0]), 100.0
    for m in range(n):
        t0, t1 = 90 - 45 * m, 90 - 45 * (m + 1)
        arc = [C + Rd * np.array([math.cos(math.radians(t)), -math.sin(math.radians(t))])
               for t in np.linspace(t0, t1, 30)]
        col = 'r' if m % 2 == 0 else 'b'
        S.surface([C] + arc, col)
        S.poly([C] + arc + [C], col, l=1.2)
        mid = math.radians((t0 + t1) / 2)
        S.texte(C + 0.68 * Rd * np.array([math.cos(mid), -math.sin(mid)]), str(m + 1), col, taille=14)
    S.point(C, 't', r=4.5)
    S.texte(C + [12, -12], 'x', taille=17, ancre='start')
    S.fleche(np.array([262.0, 150.0]), np.array([288.0, 150.0]), 'g')
    return S


# ------------------------------------------------------------------ sc-decoupage
@schema('sc-decoupage')
def sc_decoupage():
    Am_inv = lambda y: np.array([y[0], 2 * y[1] + 1])     # A₋⁻¹ : Q⁻ → Q
    Ap_inv = lambda y: np.array([y[0], 2 * y[1] - 1])     # A₊⁻¹ : Q⁺ → Q
    # l'arc inférieur γ([−1, 3]) va sur les côtés gauche, inférieur, droit ; le diamètre sur le côté supérieur
    for t in np.linspace(-1, 3, 41):
        y = Am_inv(gamma(t))
        assert abs(max(abs(y[0]), abs(y[1])) - 1) < 1e-12            # sur le bord de Q
        assert y[1] < 1 or abs(y[0]) == 1                              # pas à l'intérieur du côté supérieur
    for s in np.linspace(-1, 1, 11):
        assert np.allclose(Am_inv(np.array([-s, 0.0])), [-s, 1]) and np.allclose(Ap_inv(np.array([-s, 0.0])), [-s, -1])
    S = Schema(520, 300, 'Découpage le long du diamètre')
    # polygone uv : u sur l'arc inférieur (bleu), v sur l'arc supérieur (vert), c = diamètre (rouge)
    c0, L0 = np.array([120.0, 150.0]), 92.0
    P = lambda y: c0 + L0 * np.array([y[0], -y[1]])
    S.poly([P(y) for y in ([-1, -1], [1, -1], [1, 1], [-1, 1])], 'g', ferme=True, rempli='v', l=1)
    S.poly([P(gamma(t)) for t in np.linspace(-1, 3, 81)], 'b', l=3)
    S.poly([P(gamma(t)) for t in np.linspace(3, 7, 81)], 'v', l=3)
    S.ligne(P([1, 0]), P([-1, 0]), 'r', d=True, l=2.4)
    S.pointe(P([-0.1, 0]), [-1, 0], 'r', taille=12, largeur=5.5)
    S.texte(P([0, 0]) + [0, -14], 'c', 'r', taille=18)
    S.texte(P([0, -1]) + [0, 22], 'u', 'b', taille=18)
    S.texte(P([0, 1]) + [0, -22], 'v', 'v', taille=18)
    for y in ([-1, 0], [1, 0]):
        S.point(P(y), 't', r=4.5)
    S.fleche(np.array([235.0, 150.0]), np.array([285.0, 150.0]), 'g')
    # morceaux : uc (en bas) et vc⁻¹ (en haut)
    for (cy, arc, coul, lettre, cote_c, sens, lab) in [
            (232.0, (-2, 4), 'b', 'u', ([1, 1], [-1, 1]), [-1, 0], 'c'),
            (68.0, (2, 8), 'v', 'v', ([-1, -1], [1, -1]), [-1, 0], 'c^{−1}')]:
        c1, L1 = np.array([400.0, cy]), 56.0
        Q1 = lambda y, c1=c1: c1 + L1 * np.array([y[0], -y[1]])
        S.poly([Q1(y) for y in ([-1, -1], [1, -1], [1, 1], [-1, 1])], 'g', ferme=True, rempli='v', l=1)
        S.poly([Q1(gamma(t)) for t in np.linspace(arc[0], arc[1], 81)], coul, l=3)
        S.ligne(Q1(cote_c[0]), Q1(cote_c[1]), 'r', l=3)
        m = (Q1(cote_c[0]) + Q1(cote_c[1])) / 2
        S.pointe(m + [-8, 0], sens, 'r', taille=12, largeur=5.5)
        S.texte(np.array([c1[0] + L1 + 14, m[1]]), lab, 'r', taille=16, ancre='start')
        S.texte(c1 + [-L1 - 18, 0], lettre, coul, taille=18)
    return S


# ------------------------------------------------------------------ sc-operations
@schema('sc-operations')
def sc_operations():
    # aXaY sur le carré (structure à quatre côtés) : a en bas (→), X à droite (↑), a en haut (←), Y à gauche (↓).
    w = [('a', 1), ('X', 1), ('a', 1), ('Y', 1)]
    # la corde c joint l'origine de X (sommet 1) à l'origine de Y (sommet 3)
    v1, v3 = gamma(2), gamma(6)
    assert np.allclose(v1, [1, -1]) and np.allclose(v3, [-1, 1])
    # résultat du calcul de la fiche : c c X Y⁻¹
    def inv(p):
        return [(b, -e) for b, e in reversed(p)]
    X, Y = [('X', 1)], [('Y', 1)]
    rot = X + [('a', 1)] + Y + [('a', 1)]
    m1 = X + [('a', 1), ('c', 1)]
    m2 = [('c', -1)] + Y + [('a', 1)]
    U = [('c', 1)] + X                              # rotation de m1 : c X a
    m2i = inv(m2)                                   # a⁻¹ Y⁻¹ c
    assert m2i[0] == ('a', -1)
    V = m2i[1:]
    res = U + V                                     # c X Y⁻¹ c
    assert res == [('c', 1), ('X', 1), ('Y', -1), ('c', 1)]
    S = Schema(520, 260, 'Opération de la paire tordue')
    c0, L0 = np.array([105.0, 125.0]), 75.0
    P = lambda y: c0 + L0 * np.array([y[0], -y[1]])
    S.poly([P(y) for y in ([-1, -1], [1, -1], [1, 1], [-1, 1])], 'g', ferme=True, rempli='v', l=1)
    S.ligne(P([-1, -1]), P([1, -1]), 'r', l=3)
    S.pointe(P([0.1, -1]), [1, 0], 'r', taille=12, largeur=5.5)
    S.ligne(P([1, 1]), P([-1, 1]), 'r', l=3)
    S.pointe(P([-0.1, 1]), [-1, 0], 'r', taille=12, largeur=5.5)
    S.ligne(P([1, -1]), P([1, 1]), 'b', l=3)
    S.ligne(P([-1, 1]), P([-1, -1]), 'v', l=3)
    S.texte(P([0, -1]) + [0, 20], 'a', 'r', taille=18)
    S.texte(P([0, 1]) + [0, -20], 'a', 'r', taille=18)
    S.texte(P([1, 0]) + [18, 0], 'X', 'b', taille=18)
    S.texte(P([-1, 0]) + [-18, 0], 'Y', 'v', taille=18)
    # c va de l'extrémité de u = Xa (sommet 3) à son origine (sommet 1)
    S.ligne(P(v3), P(v1), 't', d=True, l=2)
    mid = (P(v1) + P(v3)) / 2
    S.pointe(mid + 8 * _unit(P(v1) - P(v3)), P(v1) - P(v3), 't', taille=12, largeur=5.5)
    S.texte(mid + [12, 10], 'c', taille=18, ancre='start')
    S.fleche(np.array([222.0, 125.0]), np.array([270.0, 125.0]), 'g')
    # résultat : quadrilatère c c X Y⁻¹ (côtés dans l'ordre, sens direct depuis le coin inférieur gauche)
    c1, L1 = np.array([415.0, 125.0]), 75.0
    Q1 = lambda y: c1 + L1 * np.array([y[0], -y[1]])
    S.poly([Q1(y) for y in ([-1, -1], [1, -1], [1, 1], [-1, 1])], 'g', ferme=True, rempli='v', l=1)
    S.ligne(Q1([-1, -1]), Q1([1, -1]), 't', l=3)
    S.pointe(Q1([0.1, -1]), [1, 0], 't', taille=12, largeur=5.5)
    S.ligne(Q1([1, -1]), Q1([1, 1]), 't', l=3)
    S.pointe(Q1([1, 0.1]), [0, -1], 't', taille=12, largeur=5.5)
    S.ligne(Q1([1, 1]), Q1([-1, 1]), 'b', l=3)
    S.ligne(Q1([-1, 1]), Q1([-1, -1]), 'v', l=3)
    S.texte(Q1([0, -1]) + [0, 20], 'c', taille=18)
    S.texte(Q1([1, 0]) + [18, 0], 'c', taille=18)
    S.texte(Q1([0, 1]) + [0, -20], 'X', 'b', taille=18)
    S.texte(Q1([-1, 0]) + [-12, 0], 'Y^{\u2009−1}', 'v', taille=18, ancre='end')
    return S
