"""Schémas des exemples du lexique, théorie alglin (algèbre linéaire, avec le sous-graphe v-det) :
contenu/exemples/alglin.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 400 à 440, hauteur 300 au plus, étiquettes de 17 (mémo de
l'édifice, § 111). Les objets (produits de matrices, images de vecteurs sur le corps à deux éléments, sous-espaces,
permutations) sont calculés, les positions aussi, et ce que dit chaque légende est vérifié par assert.
"""
import itertools
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte, courbe_entre, arc

TAILLE = 17


def _cadre(S, x, y, w, h, c, d=False, l=None):
    S.poly([(x, y), (x + w, y), (x + w, y + h), (x, y + h)], c, d=d, ferme=True, l=l)


def _prod(A, B):
    n, m, q = len(A), len(B), len(B[0])
    return [[sum(A[i][k] * B[k][j] for k in range(m)) for j in range(q)] for i in range(n)]


def _vide_ams(S):
    """Dessine ∅ comme \\varnothing (police KaTeX_AMS), ainsi qu'il est écrit dans le texte des exemples."""
    import re

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


# ---------------------------------------------------------------- produit de deux matrices diagonales par blocs
@schema('lex-matrice-diagonale-blocs-3')
def lex_matrice_diagonale_blocs_3():
    S2 = [[0, 1], [1, 0]]
    A = [[1, 0, 0], [0] + S2[0], [0] + S2[1]]                    # diag((1), S), découpage 1 + 2
    B = [S2[0] + [0], S2[1] + [0], [0, 0, 1]]                    # diag(S, (1)), découpage 2 + 1
    AB = _prod(A, B)
    assert AB == [[0, 1, 0], [0, 0, 1], [1, 0, 0]]
    blocsA, blocsB = [(0, 0), (1, 2)], [(0, 1), (2, 2)]          # (début, fin) des blocs, indices 0..2

    def bloc(i, blocs):
        return next(k for k, (u, v) in enumerate(blocs) if u <= i <= v)

    def hors_blocs(M, blocs):
        return [(i, j) for i in range(3) for j in range(3) if M[i][j] and bloc(i, blocs) != bloc(j, blocs)]
    # A et B sont diagonales par blocs pour leur découpage ; (3, 1) de AB sort des deux découpages
    assert not hors_blocs(A, blocsA) and not hors_blocs(B, blocsB)
    assert (2, 0) in hors_blocs(AB, blocsA) and (2, 0) in hors_blocs(AB, blocsB)
    assert hors_blocs(AB, [(0, 0), (1, 1), (2, 2)])

    W, H = 420, 160
    S = Schema(W, H, 'Produit de deux matrices diagonales par blocs de découpages différents')
    c = 30                                                       # côté d'une case
    g = 3 * c
    sep = (W - 3 * g) / 4                                        # trois grilles régulièrement espacées
    x0s = [sep + k * (g + sep) for k in range(3)]
    y0 = 22
    assert sep > largeur_texte('=', TAILLE) + 8                  # place pour × et =
    for x0, M, blocs, nom in zip(x0s, (A, B, AB), (blocsA, blocsB, None), ('A', 'B', 'AB')):
        for k in range(4):                                       # quadrillage
            S.ligne((x0 + k * c, y0), (x0 + k * c, y0 + g), 'g', l=0.6)
            S.ligne((x0, y0 + k * c), (x0 + g, y0 + k * c), 'g', l=0.6)
        for i in range(3):
            for j in range(3):
                coul = 'r' if (M is AB and (i, j) == (2, 0)) else ('t' if M[i][j] else 'g')
                if M[i][j]:
                    S.rect(x0 + j * c + 3, y0 + i * c + 3, c - 6, c - 6, coul, rempli=coul)
                S.texte((x0 + (j + 0.5) * c, y0 + (i + 0.5) * c), str(M[i][j]), coul, taille=TAILLE)
        if M is A or M is B:                                     # A : bleu, découpage 1 + 2 ; B : vert, 2 + 1
            for u, v in blocs:
                _cadre(S, x0 + u * c, y0 + u * c, (v - u + 1) * c, (v - u + 1) * c, 'b' if M is A else 'v', l=2.2)
        else:                                                    # les deux découpages reportés sur AB
            for (u, v), coul in itertools.chain(((b_, 'b') for b_ in blocsA), ((b_, 'v') for b_ in blocsB)):
                _cadre(S, x0 + u * c, y0 + u * c, (v - u + 1) * c, (v - u + 1) * c, coul, d=True, l=1.6)
        S.texte((x0 + g / 2, y0 + g + 24), nom, 't', taille=TAILLE)
    S.texte(((x0s[0] + g + x0s[1]) / 2, y0 + g / 2), '×', 't', taille=TAILLE)
    S.texte(((x0s[1] + g + x0s[2]) / 2, y0 + g / 2), '=', 't', taille=TAILLE)
    assert x0s[2] + g < W - 10 and y0 + g + 24 + 12 < H
    return S


# ---------------------------------------------------------------- une matrice sans valeur propre sur F2
@schema('lex-valeur-propre-2')
def lex_valeur_propre_2():
    vecs = [(0, 0), (1, 0), (0, 1), (1, 1)]

    def A(v):
        x, y = v
        return (y % 2, (x + y) % 2)
    img = {v: A(v) for v in vecs}
    assert img[(0, 0)] == (0, 0)
    assert img[(1, 0)] == (0, 1) and img[(0, 1)] == (1, 1) and img[(1, 1)] == (1, 0)     # permutés circulairement
    assert all(img[v] != v and img[v] != (0, 0) for v in vecs if v != (0, 0))           # ni fixe ni envoyé sur 0

    W, H = 420, 250
    S = Schema(W, H, 'Une matrice sans valeur propre sur le corps à deux éléments')
    cote = 150
    ox, oy = (W - cote) / 2, 40 + cote                           # (0, 0) en bas à gauche
    P = {v: np.array([ox + cote * v[0], oy - cote * v[1]]) for v in vecs}
    nom = {v: f'({v[0]}, {v[1]})' for v in vecs}
    # le carré, en gris : seuls les quatre sommets sont des vecteurs
    S.poly([P[(0, 0)], P[(1, 0)], P[(1, 1)], P[(0, 1)]], 'g', d=True, ferme=True)
    for v in vecs[1:]:
        q = img[v]
        pts = courbe_entre(P[v], P[q], 0.18 if v != (1, 0) else 0.0, n=40)
        garde = np.array([p for p in pts if np.linalg.norm(p - P[v]) > 9 and np.linalg.norm(p - P[q]) > 9])
        S.courbe_fleche(garde, 'r')
    # boucle du vecteur nul, fixe : un cercle tangent au point, à sa gauche, ouvert près du point
    o = P[(0, 0)]
    rb = 13
    centre = o + np.array([-rb - 2, 0])
    boucle = arc(centre, rb, 0.55, 2 * np.pi - 0.55, n=60)
    S.courbe_fleche(boucle, 'g')
    for v in vecs:
        S.point(P[v], 't' if v != (0, 0) else 'g')
    # étiquettes à l'extérieur du carré, au-dessus ou au-dessous du point
    dec = {(0, 0): (0, 26), (1, 0): (0, 26), (0, 1): (0, -24), (1, 1): (0, -24)}
    for v in vecs:
        p = P[v] + np.array(dec[v])
        assert largeur_texte(nom[v], TAILLE) / 2 + 4 < p[0] < W - largeur_texte(nom[v], TAILLE) / 2 - 4
        assert 12 < p[1] < H - 12
        S.texte(p, nom[v], 't' if v != (0, 0) else 'g', taille=TAILLE)
    assert centre[0] - rb > 4
    return S


# ---------------------------------------------------------------- sous-espaces de F2², supplémentaires d'une droite
@schema('lex-supplementaire-1')
def lex_supplementaire_1():
    vecs = [(0, 0), (1, 0), (0, 1), (1, 1)]

    def add(u, v):
        return ((u[0] + v[0]) % 2, (u[1] + v[1]) % 2)
    parts = [frozenset(c) for k in range(1, 5) for c in itertools.combinations(vecs, k)]
    sev = [P for P in parts if (0, 0) in P and all(add(u, v) in P for u in P for v in P)]
    zero, D = frozenset({(0, 0)}), frozenset({(0, 0), (1, 0)})
    G1, G2, plan = frozenset({(0, 0), (0, 1)}), frozenset({(0, 0), (1, 1)}), frozenset(vecs)
    assert set(sev) == {zero, D, G1, G2, plan} and len(sev) == 5                 # les cinq sous-espaces

    def somme(F, G):
        return frozenset(add(u, v) for u in F for v in G)
    supp = [G for G in sev if (D & G) == zero and somme(D, G) == plan]
    assert set(supp) == {G1, G2}                                                 # deux supplémentaires
    assert all([Hh for Hh in sev if D <= Hh and G <= Hh] == [plan] for G in supp)  # seul majorant commun : le plan

    W, H = 420, 210
    S = Schema(W, H, 'Les sous-espaces du plan sur le corps à deux éléments')
    nom = {zero: '{0}', D: 'D = {0, (1, 0)}', G1: '{0, (0, 1)}', G2: '{0, (1, 1)}', plan: 'K^2'}
    larg = {k: largeur_texte(v.replace('_', '').replace('^', ''), TAILLE) for k, v in nom.items()}
    y = {zero: H - 28, D: H / 2, G1: H / 2, G2: H / 2, plan: 28}
    x = {zero: W / 2, plan: W / 2, D: W / 6 + 6, G1: W / 2, G2: 5 * W / 6 - 6}
    # les étiquettes du milieu ne se chevauchent pas et restent dans le cadre
    assert x[D] - larg[D] / 2 > 4 and x[G2] + larg[G2] / 2 < W - 4
    assert x[D] + larg[D] / 2 + 8 < x[G1] - larg[G1] / 2 and x[G1] + larg[G1] / 2 + 8 < x[G2] - larg[G2] / 2
    demi_h = 12
    couv = [(zero, L) for L in (D, G1, G2)] + [(L, plan) for L in (D, G1, G2)]
    for a_, b_ in couv:
        p, q = np.array([x[a_], y[a_]]), np.array([x[b_], y[b_]])
        u = (q - p) / np.linalg.norm(q - p)
        S.ligne(p + (demi_h + 4) / abs(u[1]) * u, q - (demi_h + 4) / abs(u[1]) * u, 'g')
    coul = {D: 'r', G1: 'b', G2: 'b'}
    for k in nom:
        S.texte((x[k], y[k]), nom[k], coul.get(k, 't'), taille=TAILLE)
    return S


# ---------------------------------------------------------------- paires inversées et croisements
@schema('lex-signature-permutation-2')
def lex_signature_permutation_2():
    perms = [((2, 3, 4, 1), 'σ'), ((2, 1, 4, 3), '(1 2)(3 4)')]

    def inversees(s):
        return [(i, j) for i in range(1, 5) for j in range(i + 1, 5) if s[i - 1] > s[j - 1]]
    assert inversees(perms[0][0]) == [(1, 4), (2, 4), (3, 4)] and inversees(perms[1][0]) == [(1, 2), (3, 4)]

    W, H = 420, 210
    S = Schema(W, H, 'Paires inversées et croisements')
    ytop, ybas, pas = 40, 150, 38
    centres = [W / 4, 3 * W / 4]

    def inter(p1, p2, q1, q2):
        """point d'intersection des segments ouverts [p1, p2] et [q1, q2], ou None"""
        p1, p2, q1, q2 = (np.asarray(v, float) for v in (p1, p2, q1, q2))
        r, s_ = p2 - p1, q2 - q1
        den = r[0] * s_[1] - r[1] * s_[0]
        if abs(den) < 1e-12:
            return None
        t = ((q1 - p1)[0] * s_[1] - (q1 - p1)[1] * s_[0]) / den
        u = ((q1 - p1)[0] * r[1] - (q1 - p1)[1] * r[0]) / den
        return p1 + t * r if 0 < t < 1 and 0 < u < 1 else None

    for (s, nom), cx in zip(perms, centres):
        X = {i: cx + (i - 2.5) * pas for i in range(1, 5)}
        seg = {i: ((X[i], ytop), (X[s[i - 1]], ybas)) for i in range(1, 5)}
        croix = {(i, j): inter(*seg[i], *seg[j]) for i in range(1, 5) for j in range(i + 1, 5)}
        # deux segments se croisent exactement quand la paire est inversée
        assert sorted(k for k, v in croix.items() if v is not None) == inversees(s)
        pts = [v for v in croix.values() if v is not None]
        assert all(np.linalg.norm(p - q) > 6 for k, p in enumerate(pts) for q in pts[k + 1:])   # croisements distincts
        for i in range(1, 5):
            S.ligne(seg[i][0], seg[i][1], 'b')
        for p in pts:
            S.point(p, 'r', r=4)
        for i in range(1, 5):
            S.point((X[i], ytop), 't')
            S.point((X[i], ybas), 't')
            S.texte((X[i], ytop - 18), str(i), 't', taille=TAILLE)
            S.texte((X[i], ybas + 18), str(i), 't', taille=TAILLE)
        assert X[1] - 10 > 0 and X[4] + 10 < W
        S.texte((cx, ybas + 46), nom, 't', taille=TAILLE)
        assert largeur_texte(nom, TAILLE) / 2 < W / 4 - 6 and ybas + 46 + 12 < H
    return S


# ---------------------------------------------------------------- puissances d'une matrice strictement triangulaire
@schema('lex-matrice-triangulaire-2')
def lex_matrice_triangulaire_2():
    N = [[0, 1, 0], [0, 0, 1], [0, 0, 0]]
    N2 = _prod(N, N)
    N3 = _prod(N2, N)
    assert N2 == [[0, 0, 1], [0, 0, 0], [0, 0, 0]] and N3 == [[0] * 3] * 3
    # zone autorisée de N^k : coefficients (i, j) avec j - i >= k ; les non nuls y sont, et y restent
    for k, M in ((1, N), (2, N2), (3, N3)):
        assert all(M[i][j] == 0 for i in range(3) for j in range(3) if j - i < k)

    W, H = 420, 170
    S = Schema(W, H, 'Puissances d’une matrice strictement triangulaire supérieure')
    c = 30
    g = 3 * c
    sep = (W - 3 * g) / 4
    x0s = [sep + k * (g + sep) for k in range(3)]
    y0 = 22
    for k, (x0, M, nom) in enumerate(zip(x0s, (N, N2, N3), ('N', 'N^2', 'N^3')), start=1):
        # zone où un coefficient peut être non nul, j − i ≥ k, en rouge léger
        for i in range(3):
            for j in range(3):
                if j - i >= k:
                    S.rect(x0 + j * c, y0 + i * c, c, c, 'r', rempli='r')
        for t in range(4):
            S.ligne((x0 + t * c, y0), (x0 + t * c, y0 + g), 'g', l=0.6)
            S.ligne((x0, y0 + t * c), (x0 + g, y0 + t * c), 'g', l=0.6)
        for i in range(3):
            for j in range(3):
                S.texte((x0 + (j + 0.5) * c, y0 + (i + 0.5) * c), str(M[i][j]), 't' if M[i][j] else 'g', taille=TAILLE)
        S.texte((x0 + g / 2, y0 + g + 26), nom, 't', taille=TAILLE)
        assert largeur_texte('N3', TAILLE) < g
    assert x0s[2] + g < W - 10 and y0 + g + 26 + 14 < H
    return S


# ---------------------------------------------------------------- composée de deux 3-cycles, de droite à gauche
@schema('lex-trois-cycle-2')
def lex_trois_cycle_2():
    def cyc(*cy):
        s = {i: i for i in range(1, 5)}
        for k, i in enumerate(cy):
            s[i] = cy[(k + 1) % len(cy)]
        return s
    tau, sigma = cyc(2, 3, 4), cyc(1, 2, 3)              # on applique d'abord τ = (2 3 4), puis σ = (1 2 3)
    st = {i: sigma[tau[i]] for i in range(1, 5)}
    assert st == {1: 2, 2: 1, 3: 4, 4: 3}                 # (1 2)(3 4)
    assert tau[1] == 1 and sigma[1] == 2 and tau[2] == 3 and sigma[3] == 1     # chemins lus dans le texte
    assert tau[3] == 4 and sigma[4] == 4 and tau[4] == 2 and sigma[2] == 3

    W, H = 420, 250
    S = Schema(W, H, 'Composée de deux 3-cycles')
    ys = [36, 125, 214]
    pas = 68
    x_g = 140                                             # rangées à droite de la colonne des noms
    X = {i: x_g + (i - 1) * pas + 30 for i in range(1, 5)}
    coul = {1: 'r', 2: 'b', 3: 'v', 4: 't'}
    for i in range(1, 5):
        m, f = tau[i], st[i]
        S.ligne((X[i], ys[0]), (X[m], ys[1]), coul[i], l=2)
        S.ligne((X[m], ys[1]), (X[f], ys[2]), coul[i], l=2)
    for yv in ys:
        for i in range(1, 5):
            S.point((X[i], yv), 't')
    for i in range(1, 5):
        S.texte((X[i], ys[0] - 18), str(i), 't', taille=TAILLE)
        S.texte((X[i], ys[2] + 18), str(i), 't', taille=TAILLE)
    # noms des étapes, à gauche, à mi-hauteur de chaque étage
    for (ya, yb), nom in zip(((ys[0], ys[1]), (ys[1], ys[2])), ('(2 3 4)', '(1 2 3)')):
        lt = largeur_texte(nom, TAILLE)
        S.texte((x_g - lt / 2, (ya + yb) / 2), nom, 'g', taille=TAILLE)
        assert x_g - lt > 4 and x_g + 20 < X[1]           # le nom ne touche ni le bord ni la première colonne
    assert X[4] + 10 < W and ys[2] + 18 + 10 < H
    return S
