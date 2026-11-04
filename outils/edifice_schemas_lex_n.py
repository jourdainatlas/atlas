"""Schémas des exemples du lexique, théorie n (les entiers naturels) : contenu/exemples/n.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 400 à 440, hauteur 300 au plus, étiquettes de 17
(mémo de l'édifice, § 111). Positions calculées, et ce que dit la légende vérifié par assert.
"""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, bezier, courbe_entre, largeur_texte


def _vn(n):
    """Entier de von Neumann n, comme frozenset."""
    x = frozenset()
    for _ in range(n):
        x = x | frozenset([x])
    return x


def _rogne(pts, centres, r):
    """Retire d'une courbe échantillonnée les points situés à moins de r de l'un des centres."""
    pts = np.asarray(pts, float)
    garde = np.ones(len(pts), bool)
    for c in centres:
        garde &= np.linalg.norm(pts - np.asarray(c, float), axis=1) > r
    return pts[garde]


@schema('lex-ensemble-entiers-naturels-1')
def lex_entiers_1():
    V = [_vn(k) for k in range(4)]
    arcs = {(m, n) for m in range(4) for n in range(4) if V[m] in V[n]}
    assert arcs == {(m, n) for m in range(4) for n in range(4) if m < n}      # une flèche, du premier construit
    assert V[3] == frozenset(V[:3])                                           # 3 = {0, 1, 2}
    rouges = {(m, n) for (m, n) in arcs if n == 3}
    assert rouges == {(0, 3), (1, 3), (2, 3)}

    W, H, taille, r = 420, 236, 17, 17
    xs = [60 + 100 * k for k in range(4)]
    y0 = 124
    P = [np.array([x, y0], float) for x in xs]
    S = Schema(W, H, 'Appartenance entre les entiers 0, 1, 2 et 3')
    # flèches vers 3 au-dessus (emboîtées), les autres au-dessous (emboîtées) : aucun croisement
    # les flèches qui arrivent en 3 visent trois points distincts de son cercle, pour que leurs pointes se séparent
    angle = {0: -100, 1: -135, 2: -170}
    bouts = {}
    for (m, n) in sorted(arcs):
        haut = (n == 3)
        h = 30 * (n - m) * (-1 if haut else 1)
        if haut:
            t = np.radians(angle[m])
            q = P[n] + (r + 3) * np.array([np.cos(t), np.sin(t)])
            p = P[m] + [6, 0]
            mil = (p + q) / 2 + [0, 2 * h]
            pts = _rogne(bezier(p, mil, q, n=120), [P[m]], r + 3)
            bouts[m] = q
        else:
            p, q = P[m] + [6, 0], P[n] - [6, 0]
            mil = (p + q) / 2 + [0, 2 * h]
            pts = _rogne(bezier(p, mil, q, n=120), [P[m], P[n]], r + 3)
        S.courbe_fleche(pts, 'r' if haut else 'g', l=1.6 if haut else None)
    assert min(np.linalg.norm(bouts[i] - bouts[j]) for i in bouts for j in bouts if i < j) > 10
    for k in range(4):
        S.cercle(P[k], r, 't')
        S.texte(P[k], str(k), 't', taille=taille)
    ens = ['∅', '{0}', '{0, 1}', '{0, 1, 2}']
    for k in range(4):
        w = largeur_texte(ens[k], taille)
        assert xs[k] - w / 2 > 0 and xs[k] + w / 2 < W
        S.texte((xs[k], H - 20), ens[k], 'g', taille=taille)
    # le bas des flèches inférieures reste au-dessus de la ligne des ensembles
    assert y0 + 30 * 2 + r < H - 20 - 10          # creux de la flèche 0 → 2, au-dessus des étiquettes
    return S


@schema('lex-choix-dependant-1')
def lex_choix_dependant_1():
    R = {(0, 1), (0, 2), (1, 2), (2, 0), (2, 1)}
    assert all(any((x, y) in R for y in range(3)) for x in range(3))       # chaque point a une flèche sortante
    x, suite = 0, [0]
    for _ in range(6):
        x = min(y for y in range(3) if (x, y) in R)
        suite.append(x)
    assert suite == [0, 1, 2, 0, 1, 2, 0]
    retenues = {(suite[i], suite[i + 1]) for i in range(6)}
    assert retenues == {(0, 1), (1, 2), (2, 0)} and retenues < R

    W, H, taille, r = 420, 262, 17, 17
    P = {0: np.array([110.0, 196.0]), 1: np.array([210.0, 46.0]), 2: np.array([310.0, 196.0])}
    S = Schema(W, H, 'Relation R sur {0, 1, 2} et suite donnée par la règle du plus petit élément')
    for (a, b) in sorted(R):
        double = (b, a) in R
        pts = courbe_entre(P[a], P[b], courbure=0.18 if double else 0.0, n=120)
        pts = _rogne(pts, [P[a], P[b]], r + 3)
        rouge = (a, b) in retenues
        S.courbe_fleche(pts, 'r' if rouge else 'g', l=1.6 if rouge else None)
    for k in range(3):
        S.cercle(P[k], r, 't')
        S.texte(P[k], str(k), 't', taille=taille)
    S.texte((W / 2, H - 16), '0, 1, 2, 0, 1, 2, …', 'r', taille=taille)
    return S


@schema('lex-denombrable-3')
def lex_denombrable_3():
    def T(k):
        t = 0
        for j in range(k):
            t += j + 1
        return t
    N = 4
    c = {(m, n): T(m + n) + n for m in range(N + 1) for n in range(N + 1) if m + n <= N}
    assert sorted(c.values()) == list(range(T(N + 1)))                    # chaque numéro une seule fois
    for s in range(N + 1):
        diag = [c[(s - n, n)] for n in range(s + 1)]
        assert diag == list(range(T(s), T(s) + s + 1))                       # numéros consécutifs
        if s < N:
            assert c[(s + 1, 0)] == c[(0, s)] + 1                            # pas de saut entre diagonales
    assert [c[(3 - n, n)] for n in range(4)] == [6, 7, 8, 9]                 # diagonale rouge

    W, H, taille = 420, 296, 17
    x0, y0, pas_x, pas_y = 96, 246, 66, 50
    pos = lambda m, n: np.array([x0 + pas_x * m, y0 - pas_y * n], float)
    assert pos(N, 0)[0] + 30 < W and pos(0, N)[1] - 20 > 0
    S = Schema(W, H, 'Numérotation des couples d\'entiers diagonale par diagonale')
    # axes
    S.fleche((x0 - 30, y0 + 26), (pos(N, 0)[0] + 40, y0 + 26), 'g')
    S.fleche((x0 - 30, y0 + 26), (x0 - 30, pos(0, N)[1] - 18), 'g')
    S.texte((pos(N, 0)[0] + 40, y0 + 44), 'm', 'g', taille=taille)
    S.texte((x0 - 48, pos(0, N)[1] - 14), 'n', 'g', taille=taille)
    for m in range(N + 1):
        S.texte((pos(m, 0)[0], y0 + 44), str(m), 'g', taille=15)
    for n in range(N + 1):
        S.texte((x0 - 48, pos(0, n)[1]), str(n), 'g', taille=15)
    # sur chaque diagonale, une flèche d'un couple au suivant dans l'ordre des numéros
    for s in range(1, N + 1):
        for n in range(s):
            a, b = pos(s - n, n), pos(s - n - 1, n + 1)
            assert c[(s - n - 1, n + 1)] == c[(s - n, n)] + 1
            u = (b - a) / np.linalg.norm(b - a)
            S.fleche(a + 14 * u, b - 14 * u, 'r' if s == 3 else 'g', l=1.6 if s == 3 else None)
    for (m, n), k in c.items():
        S.cercle(pos(m, n), 13, 'r' if m + n == 3 else 'g')
        S.texte(pos(m, n), str(k), 'r' if m + n == 3 else 't', taille=taille)
    return S
