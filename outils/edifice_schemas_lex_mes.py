"""Schémas des exemples du lexique, théorie mes (mesure, intégration) : contenu/exemples/mes.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 15 à 17
(mémo de l'édifice, § 111). Positions calculées, et ce que dit la légende vérifié par assert. ∅ est dessiné
barré (\\varnothing), comme dans le texte.
"""
import itertools
import math
import re
from fractions import Fraction as F

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte


def _vide_ams(S):
    """∅ en police KaTeX_AMS (\\varnothing, barré), comme dans le texte des exemples."""
    def coupe(m):
        attrs, txt = m.group(1), m.group(2)
        out = []
        for k, c in enumerate(re.split('(∅)', txt)):
            if not c:
                continue
            a = attrs if k == 0 else re.sub(r' dy="[^"]*"', '', attrs)
            if c == '∅':
                a = a.replace('KaTeX_Main', 'KaTeX_AMS')
            out.append(f'<tspan{a}>{c}</tspan>')
        return ''.join(out)
    S.el = [re.sub(r'<tspan( font-family="KaTeX_Main"[^>]*)>([^<]*∅[^<]*)</tspan>', coupe, e) for e in S.el]
    return S


def _dans_ellipse(p, c, rx, ry):
    return ((p[0] - c[0]) / rx) ** 2 + ((p[1] - c[1]) / ry) ** 2


def _ellipse_exacte(pos, membres, c, rx, ry):
    """L'ellipse (c, rx, ry) entoure exactement les points de « membres », avec de la marge."""
    for x, p in pos.items():
        v = _dans_ellipse(p, c, rx, ry)
        assert (v < 0.75) if x in membres else (v > 1.3), (x, membres, v)


# ------------------------------------------------------------------ demi-droite achevée
@schema('lex-demi-droite-achevee-1')
def lex_demi_droite_achevee_1():
    W, H = 420, 250
    x0, y0, haut = 30, 200, 165          # base des barres, hauteur du terme 1
    larg, pas, saut = 16, 22, 14          # largeur d'une barre, pas, écart supplémentaire entre paquets
    S = Schema(W, H, 'Les termes 1/(n+1) groupés en paquets de 1, 2, 4 et 8 termes')
    xs = {}
    x = x0
    for k in range(4):
        for n in range(2 ** k - 1, 2 ** (k + 1) - 1):
            xs[n] = x
            x += pas
        x += saut
    assert sorted(xs) == list(range(15)) and x - saut - pas + larg < W - 10
    S.ligne((x0 - 8, y0), (W - 12, y0), 'g')
    for k in range(4):
        Ik = [n for n in range(15) if 2 ** k <= n + 1 < 2 ** (k + 1)]
        assert len(Ik) == 2 ** k
        niveau = F(1, 2 ** (k + 1))
        assert all(F(1, n + 1) > niveau for n in Ik)                        # chaque barre dépasse le niveau
        assert sum(F(1, n + 1) for n in Ik) >= F(1, 2)                      # chaque paquet pèse au moins 1/2
        for n in Ik:
            h = haut / (n + 1)
            S.rect(xs[n], y0 - h, larg, h, 'b', rempli='b')
        g, d = xs[Ik[0]] - 4, xs[Ik[-1]] + larg + 4
        S.ligne((g, y0 - haut * float(niveau)), (d, y0 - haut * float(niveau)), 'r', d=True, l=2)
        S.texte(((g + d) / 2, y0 + 22), f'I_{k}', 't', taille=17)
    S.texte((xs[0] + larg / 2, y0 - haut - 14), '1', 'b', taille=15)
    return S


# ------------------------------------------------------------------ tribu engendrée
@schema('lex-tribu-engendree-1')
def lex_tribu_engendree_1():
    W, H = 420, 230
    y = 112
    pos = {1: np.array([62.0, y]), 2: np.array([150.0, y]), 3: np.array([238.0, y]),
           4: np.array([318.0, y]), 5: np.array([372.0, y])}
    S = Schema(W, H, 'Les atomes de la tribu engendrée par {1, 2} et {2, 3}')
    eb = (np.array([106.0, y - 6]), 82, 56)
    ev = (np.array([194.0, y + 6]), 82, 56)
    _ellipse_exacte(pos, {1, 2}, *eb)
    _ellipse_exacte(pos, {2, 3}, *ev)
    atomes = [({1}, pos[1], 20, 20), ({2}, pos[2], 20, 20), ({3}, pos[3], 20, 20),
              ({4, 5}, (pos[4] + pos[5]) / 2, 52, 26)]
    for m, c, rx, ry in atomes:
        _ellipse_exacte(pos, m, c, rx, ry)
    # les atomes sont bien ceux de σ(C) : énumération
    X = frozenset(range(1, 6))
    T = {frozenset(), X, frozenset({1, 2}), frozenset({2, 3})}
    while True:
        N = T | {X - A for A in T} | {A | B for A in T for B in T}
        if N == T:
            break
        T = N
    at = {frozenset.intersection(*[A for A in T if x in A]) for x in X}
    assert at == {frozenset(m) for m, *_ in atomes} and len(T) == 16
    S.ellipse(eb[0], eb[1], eb[2], 'b', rempli='b')
    S.ellipse(ev[0], ev[1], ev[2], 'v', rempli='v')
    for m, c, rx, ry in atomes:
        S.ellipse(c, rx, ry, 'r', d=True)
    for x, p in pos.items():
        S.point(p, 't', r=4)
        S.texte(p + [0, 34 if x in (1, 2, 3) else 42], str(x), 't', taille=17)
    S.texte(eb[0] + [-40, -eb[2] - 14], '{1, 2}', 'b', taille=16)
    S.texte(ev[0] + [40, ev[2] + 16], '{2, 3}', 'v', taille=16)
    # les étiquettes 1, 2, 3 tombent sous les atomes rouges et à l'intérieur des grandes ellipses
    for x in (1, 2, 3):
        q = pos[x] + [0, 34]
        assert np.hypot(*(q - pos[x])) > 20 + 6
    return S


# ------------------------------------------------------------------ espace mesurable
@schema('lex-espace-mesurable-1')
def lex_espace_mesurable_1():
    X = frozenset({1, 2, 3})
    P = [frozenset(c) for k in range(4) for c in itertools.combinations(sorted(X), k)]
    tribus = []
    for k in range(len(P) + 1):
        for T in itertools.combinations(P, k):
            T = set(T)
            if X in T and all(X - A in T for A in T) and all(A | B in T for A in T for B in T):
                tribus.append(frozenset(T))
    assert len(tribus) == 5
    atomes = {T: sorted((sorted(a) for a in {frozenset.intersection(*[A for A in T if x in A]) for x in X}),
                        key=lambda a: a[0]) for T in tribus}
    bas = next(T for T in tribus if len(T) == 2)
    haut = next(T for T in tribus if len(T) == 8)
    mil = sorted((T for T in tribus if len(T) == 4), key=lambda T: next(a[0] for a in atomes[T] if len(a) == 1))
    assert [next(a[0] for a in atomes[T] if len(a) == 1) for T in mil] == [1, 2, 3]
    couv = {(A, B) for A in tribus for B in tribus if A < B and not any(A < C < B for C in tribus)}
    assert couv == {(bas, T) for T in mil} | {(T, haut) for T in mil}
    W, H = 420, 270
    centre = {bas: np.array([210.0, 230]), haut: np.array([210.0, 40])}
    for T, x in zip(mil, (80, 210, 340)):
        centre[T] = np.array([float(x), 135])
    S = Schema(W, H, 'Les cinq tribus de {1, 2, 3}, rangées par inclusion')
    # les trois points en triangle : chaque paire est contiguë, et un atome à deux points est une capsule
    rel = {1: np.array([-24.0, 9]), 2: np.array([0.0, -13]), 3: np.array([24.0, 9])}
    lab = {1: np.array([-16.0, 10]), 2: np.array([0.0, -17]), 3: np.array([16.0, 10])}
    r = 11

    def capsule(p, q):
        u = (q - p) / np.linalg.norm(q - p)
        n = np.array([-u[1], u[0]])
        a = math.atan2(u[1], u[0])
        t1 = np.linspace(a + math.pi / 2, a + 3 * math.pi / 2, 20)
        t2 = np.linspace(a - math.pi / 2, a + math.pi / 2, 20)
        return np.vstack([p + r * np.stack([np.cos(t1), np.sin(t1)], 1), q + r * np.stack([np.cos(t2), np.sin(t2)], 1)])

    for T in tribus:
        c = centre[T]
        pts = {i: c + rel[i] for i in (1, 2, 3)}
        for a in atomes[T]:
            if len(a) == 1:
                S.cercle(pts[a[0]], r, 'b', rempli='b')
            elif len(a) == 2:
                S.poly(capsule(pts[a[0]], pts[a[1]]), 'b', ferme=True, rempli='b')
            else:
                assert all(_dans_ellipse(p, c + [0, 1], 38, 27) < 0.75 for p in pts.values())
                S.ellipse(c + [0, 1], 38, 27, 'b', rempli='b')
        for i, p in pts.items():
            S.point(p, 't', r=3.4)
            S.texte(p + lab[i], str(i), 't', taille=13)
    for A, B in couv:
        p, q = centre[A], centre[B]
        S.ligne(p + [0, -48 if A == bas else -38], q + [0, 30], 'g')
    return S


# ------------------------------------------------------------------ fonction borélienne
@schema('lex-fonction-borelienne-1')
def lex_fonction_borelienne_1():
    W, H = 420, 270
    R = Repere(-1.4, 4.4, -1.6, 3.7, 26, 30, 352, 222)
    a = 1.5
    xs = np.linspace(-1, 3.999, 20001)
    assert np.all((np.floor(xs) > a) == (xs >= 2))                       # {⌊x⌋ > 1,5} = [2, +∞[
    S = Schema(W, H, 'Graphe de la partie entière et ensemble {⌊x⌋ > 1,5}')
    R.axes(S)
    S.ligne(R(-1.3, a), R(4.3, a), 'g', d=True)
    S.texte(R(-1.3, a) + [0, -12], 'a', 'g', ancre='start', taille=16)
    for k in range(-1, 4):
        S.ligne(R(k, k), R(k + 1, k), 'b', l=2.4)
        S.point(R(k, k), 'b', r=3.8)
        S.point(R(k + 1, k), 'b', r=3.8, creux=True)
    S.ligne(R(2, 0), R(4.25, 0), 'r', l=4)
    S.point(R(2, 0), 'r', r=4.5)
    for k in (1, 2, 3):
        S.texte(R(k, 0) + [0, 18], str(k), 'g', taille=15)
    S.texte(R(0, 0) + [-10, 16], '0', 'g', taille=15)
    return S


# ------------------------------------------------------------------ mesure de Lebesgue
@schema('lex-mesure-lebesgue-2')
def lex_mesure_lebesgue_2():
    W, H = 420, 110
    R = Repere(-0.3, 6.3, 0, 1, 18, 20, 384, 60)
    iv = [(n, n + 2.0 ** -n) for n in range(6)]
    assert all(iv[i][1] <= iv[i + 1][0] for i in range(5))
    assert abs(sum(b - a for a, b in iv) - (2 - 2.0 ** -5)) < 1e-12
    S = Schema(W, H, 'Les intervalles [n, n + 2^-n[ pour n de 0 à 5')
    y = 0.5
    S.ligne(R(-0.25, y), R(6.25, y), 'g')
    for n in range(7):
        S.ligne(R(n, y) + [0, -6], R(n, y) + [0, 6], 'g')
        S.texte(R(n, y) + [0, 24], str(n), 'g', taille=15)
    for n, (a, b) in enumerate(iv):
        c = 'r' if n % 2 == 0 else 'b'
        p, q = R(a, y), R(b, y)
        S.rect(p[0], p[1] - 16, q[0] - p[0], 16, c, rempli=c)
    return S


# ------------------------------------------------------------------ écriture canonique
@schema('lex-ecriture-canonique-1')
def lex_ecriture_canonique_1():
    W, H = 420, 290
    xs = np.linspace(-1, 4, 5001)
    s = ((xs >= 0) & (xs <= 2)).astype(int) + ((xs >= 1) & (xs <= 3)).astype(int)
    assert np.all(s[(xs >= 0) & (xs < 1)] == 1) and np.all(s[(xs >= 1) & (xs <= 2)] == 2)
    assert np.all(s[(xs > 2) & (xs <= 3)] == 1) and np.all(s[(xs < 0) | (xs > 3)] == 0)
    S = Schema(W, H, 'Les indicatrices de [0, 2] et [1, 3] et leur somme')
    X = lambda x: 40 + (x + 0.6) * 340 / 4.2          # abscisses de -0.6 à 3.6
    # en haut : deux lignes de base, une par indicatrice
    for (a, b), y0, c, nom in [((0, 2), 52, 'b', '𝟏_{[0, 2]}'), ((1, 3), 104, 'v', '𝟏_{[1, 3]}')]:
        S.ligne((X(-0.6), y0), (X(3.6), y0), 'g')
        S.rect(X(a), y0 - 26, X(b) - X(a), 26, c, rempli=c)
    # en bas : la somme, en paliers
    y0, u = 260, 44
    S.ligne((X(-0.6), y0), (X(3.6), y0), 'g')
    pal = [(-0.6, 0, 0), (0, 1, 1), (1, 2, 2), (2, 3, 1), (3, 3.6, 0)]
    for a, b, v in pal:
        S.ligne((X(a), y0 - u * v), (X(b), y0 - u * v), 'r', l=3)
    # valeurs aux points de saut : s(0) = 1, s(1) = 2, s(2) = 2, s(3) = 1
    for x, v, creux in [(0, 1, False), (0, 0, True), (1, 2, False), (1, 1, True), (2, 2, False), (2, 1, True),
                        (3, 1, False), (3, 0, True)]:
        S.point((X(x), y0 - u * v), 'r', r=4, creux=creux)
    for k in range(4):
        S.texte((X(k), y0 + 18), str(k), 'g', taille=15)
    for v in (1, 2):
        S.texte((X(-0.6) - 6, y0 - u * v), str(v), 'g', ancre='end', taille=15)
    S.texte((X(3.6) + 4, y0 - u * 0.5), 's', 'r', ancre='start', taille=17)
    return S


# ------------------------------------------------------------------ produits
@schema('lex-tribu-produit-1')
def lex_tribu_produit_1():
    W, H = 420, 250
    P = {('a', 'a'): (170, 170), ('b', 'a'): (290, 170), ('a', 'b'): (170, 70), ('b', 'b'): (290, 70)}
    # pavés de {a, b}² : 10 parties distinctes ; la diagonale n'en est pas un
    E = ['a', 'b']
    sous = [frozenset(), frozenset('a'), frozenset('b'), frozenset('ab')]
    paves = {frozenset((x, y) for x in A for y in B) for A in sous for B in sous}
    D = frozenset({('a', 'a'), ('b', 'b')})
    assert len(paves) == 10 and D not in paves and frozenset({('a', 'a')}) in paves
    S = Schema(W, H, 'Pavés et diagonale de {a, b}²')
    S.rect(170 - 30, 70 - 30, 60, 160, 'b', rempli='b', rx=26)            # {a} × X : la colonne x = a
    for p in ((170, 170), (290, 70)):
        S.cercle(p, 20, 'r', rempli='r')
    S.ligne((170, 170), (290, 70), 'r', d=True)
    for (x, y), p in P.items():
        S.point(p, 't', r=4.2)
    for x, cx in (('a', 170), ('b', 290)):
        S.texte((cx, 224), x, 'g', taille=17)
    for y, cy in (('a', 170), ('b', 70)):
        S.texte((112, cy), y, 'g', taille=17)
    S.texte((170, 22), '{a} × X', 'b', taille=16)
    return S


@schema('lex-tribu-produit-3')
def lex_tribu_produit_3():
    W, H = 420, 290
    R = Repere(0, 2, 0, 2, 90, 12, 244, 244)
    # contrôle : un point hors de la diagonale sort des carrés à partir d'un certain rang
    for x, y in [(0.3, 0.32), (1.0, 0.99), (0.0, 1.9)]:
        n = 0
        while math.floor(x * 2 ** n) == math.floor(y * 2 ** n):
            n += 1
        assert n < 20
    S = Schema(W, H, 'Carrés dyadiques recouvrant la diagonale de [0, 2[²')
    S.rect(*R(0, 2), 244, 244, 'g')
    for n, c in ((0, 'g'), (1, 'b'), (2, 'v')):
        h = 2.0 ** -n
        for k in range(int(2 / h)):
            p = R(k * h, (k + 1) * h)
            S.rect(p[0], p[1], 244 * h / 2, 244 * h / 2, c, rempli=None if n == 0 else c, d=(n == 0))
    S.ligne(R(0, 0), R(2, 2), 'r', l=2.6)
    S.texte(R(0, 0) + [-10, 12], '0', 'g', ancre='end', taille=15)
    S.texte(R(1, 0) + [0, 14], '1', 'g', taille=15)
    S.texte(R(0, 1) + [-10, 0], '1', 'g', ancre='end', taille=15)
    S.texte(R(2, 0) + [0, 14], '2', 'g', taille=15)
    S.texte(R(0, 2) + [-10, 0], '2', 'g', ancre='end', taille=15)
    return S


@schema('lex-pave-mesurable-1')
def lex_pave_mesurable_1():
    W, H = 420, 270
    x0, y0, L, Hh = 70, 20, 300, 220           # X × Y dessiné comme un rectangle ; A, B intervalles
    A = (110, 140)                               # en abscisse, dans [0, 300]
    B = (70, 100)                                # en ordonnée : [70, 170] dans [0, 220], compté vers le haut
    X = lambda u: x0 + u
    Y = lambda v: y0 + Hh - v
    S = Schema(W, H, 'Le complémentaire d’un pavé en deux pavés disjoints')
    # A^c × Y : deux bandes verticales
    for a, b in ((0, A[0]), (A[0] + A[1], L)):
        S.rect(X(a), Y(Hh), b - a, Hh, 'b', rempli='b')
    # A × B^c : deux morceaux
    for a, b in ((0, B[0]), (B[0] + B[1], Hh)):
        S.rect(X(A[0]), Y(b), A[1], b - a, 'v', rempli='v')
    S.rect(X(A[0]), Y(B[0] + B[1]), A[1], B[1], 'r', rempli='r')
    # contrôle : les trois morceaux partitionnent le rectangle (aires)
    assert 0 < A[0] and A[0] + A[1] < L and 0 < B[0] and B[0] + B[1] < Hh
    assert (L - A[1]) * Hh + A[1] * (Hh - B[1]) + A[1] * B[1] == L * Hh
    S.ligne((X(A[0]), Y(0) + 8), (X(A[0] + A[1]), Y(0) + 8), 'r', l=2)
    S.texte((X(A[0] + A[1] / 2), Y(0) + 22), 'A', 'r', taille=17)
    S.ligne((X(0) - 8, Y(B[0])), (X(0) - 8, Y(B[0] + B[1])), 'r', l=2)
    S.texte((X(0) - 20, Y(B[0] + B[1] / 2)), 'B', 'r', taille=17)
    S.texte((X(A[0] + A[1] / 2), Y(B[0] + B[1] / 2)), 'A × B', 't', taille=16)
    S.texte((X(L) + 16, Y(0) + 4), 'X', 'g', ancre='start', taille=17)
    S.texte((X(0), Y(Hh) - 12), 'Y', 'g', taille=17)
    assert X(L) + 16 + 14 < W and Y(Hh) - 12 > 6
    return S


@schema('lex-section-partie-produit-1')
def lex_section_partie_produit_1():
    W, H = 420, 270
    E = {(m, n) for m in range(4) for n in range(4) if m + n <= 3}
    assert len(E) == 10
    assert {n for (m, n) in E if m == 1} == {0, 1, 2} and {m for (m, n) in E if n == 2} == {0, 1}
    assert sum(len({n for (m, n) in E if m == k}) for k in range(4)) == sum(len({m for (m, n) in E if n == k}) for k in range(4)) == 10
    pas = 54
    P = lambda m, n: np.array([120 + m * pas, 222 - n * pas])
    S = Schema(W, H, 'Une partie de {0, 1, 2, 3}² et deux de ses sections')
    c = P(1, 1)
    S.rect(P(1, 0)[0] - 18, P(1, 2)[1] - 18, 36, 2 * pas + 36, 'b', rempli='b', rx=18)
    S.rect(P(0, 2)[0] - 18, P(0, 2)[1] - 18, pas + 36, 36, 'v', rempli='v', rx=18)
    for m in range(4):
        for n in range(4):
            if (m, n) in E:
                S.point(P(m, n), 't', r=4.6)
            else:
                S.point(P(m, n), 'g', r=3, creux=True)
    for k in range(4):
        S.texte(P(k, 0) + [0, 26], str(k), 'g', taille=15)
        S.texte(P(0, k) + [-34, 0], str(k), 'g', taille=15)
    S.texte(P(3, 0) + [36, 26], 'm', 'g', taille=16)
    S.texte(P(0, 3) + [-34, -32], 'n', 'g', taille=16)
    return S
