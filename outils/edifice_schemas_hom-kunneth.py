"""Schémas du chapitre « Formule de Künneth » (graphe hom-kunneth) : cône d'un chemin dans un convexe, carré
Δ1 × Δ1 découpé par le battage, recouvrement du cercle pour Mayer-Vietoris, cocycle partie entière, et tore
triangulé avec le support des cocycles α1, α2 et de leur produit cup. Positions calculées, propriétés
vérifiées par assert."""
import math
from math import floor

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, arc


def _unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


@schema('ku-cone')
def ku_cone():
    S = Schema(480, 320, 'Cône d’un chemin σ de sommet b dans un convexe Q')
    # convexe Q : ellipse (convexe), coordonnées écran
    c, rx, ry = np.array([240.0, 165.0]), 205.0, 135.0
    K = np.stack([c[0] + rx * np.cos(np.linspace(0, 2 * math.pi, 200)),
                  c[1] + ry * np.sin(np.linspace(0, 2 * math.pi, 200))], -1)
    dans_K = lambda p: ((p[0] - c[0]) / rx) ** 2 + ((p[1] - c[1]) / ry) ** 2 <= 1 + 1e-9
    S.poly(K, 'g', ferme=True)
    S.texte(c + [rx * 0.80, -ry * 0.78], 'Q', 'g', taille=17)
    b = np.array([150.0, 85.0])
    # chemin σ : courbe de Bézier cubique, du point A au point B
    t = np.linspace(0, 1, 120)[:, None]
    P0, P1, P2, P3 = map(np.array, ([95.0, 240.0], [190.0, 300.0], [300.0, 120.0], [385.0, 215.0]))
    sig = (1 - t) ** 3 * P0 + 3 * (1 - t) ** 2 * t * P1 + 3 * (1 - t) * t ** 2 * P2 + t ** 3 * P3
    assert all(dans_K(p) for p in sig) and dans_K(b)
    # le cône balaie les segments [b, σ(s)] : ils restent dans K (convexité, vérifiée sur un échantillon)
    for p in sig[::12]:
        for lam in np.linspace(0, 1, 11):
            assert dans_K((1 - lam) * b + lam * p)
    S.surface(np.vstack([b, sig]), 'g')
    for p in sig[6::12]:
        S.ligne(b, p, 'g', l=1.0)
    S.ligne(b, sig[0], 'b', l=2.6)
    S.ligne(b, sig[-1], 'b', l=2.6)
    S.courbe_fleche(sig, 'r', l=3.2)
    S.point(b, 't', r=4.5)
    S.texte(b + [0, -18], 'b', taille=17)
    S.point(sig[0], 'r', r=4)
    S.point(sig[-1], 'r', r=4)
    S.texte(sig[0] + [-12, 16], 'σ(e_0)', 'r', ancre='end', taille=15)
    S.texte(sig[-1] + [10, 18], 'σ(e_1)', 'r', ancre='start', taille=15)
    S.texte(sig[78] + [20, 4], 'σ', 'r', ancre='start', taille=18)
    S.texte((b + sig[0]) / 2 + [-16, 0], 'b · σ(e_0)', 'b', ancre='end', taille=15)
    S.texte((b + sig[-1]) / 2 + [8, -16], 'b · σ(e_1)', 'b', ancre='start', taille=15)
    return S


@schema('ku-eilenberg-zilber')
def ku_eilenberg_zilber():
    S = Schema(480, 330, 'Le carré Δ1 × Δ1 découpé en deux triangles par le battage')
    o, L = np.array([140.0, 280.0]), 220.0
    P = lambda x, y: o + L * np.array([x, -y])
    v0, v1, w0, w1 = P(0, 0), P(1, 0), P(0, 1), P(1, 1)
    # chemins de battage (1, 1) : (0,0)→(1,0)→(1,1) et (0,0)→(0,1)→(1,1)
    chemins = [[(0, 0), (1, 0), (1, 1)], [(0, 0), (0, 1), (1, 1)]]
    signes = []
    for ch in chemins:
        pas = [(ch[k + 1][0] - ch[k][0], ch[k + 1][1] - ch[k][1]) for k in range(2)]
        mu = [k for k in range(2) if pas[k] == (1, 0)]
        nu = [k for k in range(2) if pas[k] == (0, 1)]
        perm = mu + nu
        inv = sum(1 for i in range(2) for j in range(i + 1, 2) if perm[i] > perm[j])
        signes.append((-1) ** inv)
    assert signes == [1, -1]
    # bord de EZ(ι1 ⊗ ι1) : la diagonale v0→w1 apparaît avec les coefficients +1 (face δ1 du premier, signe −)
    # et −1·(−1) : on vérifie qu'elle disparaît
    def faces(s):
        return [(s[:i] + s[i + 1:], (-1) ** i) for i in range(3)]
    bord = {}
    for ch, e in zip(chemins, signes):
        for f_, c_ in faces(tuple(ch)):
            bord[f_] = bord.get(f_, 0) + e * c_
    bord = {k: v for k, v in bord.items() if v}
    assert ((0, 0), (1, 1)) not in bord and len(bord) == 4
    S.surface([v0, v1, w1], 'r')
    S.surface([v0, w0, w1], 'b')
    S.ligne(v0, w1, 'g', d=True, l=1.6)
    for p, q, cl in [(v0, v1, 'r'), (v1, w1, 'r'), (v0, w0, 'b'), (w0, w1, 'b')]:
        m = (p + q) / 2
        S.ligne(p, q, cl, l=3)
        S.pointe(m + 8 * _unit(q - p), q - p, cl, taille=11, largeur=5)
    for p, lab, d in [(v0, 'v_0', [-14, 14]), (v1, 'v_1', [14, 14]), (w0, 'w_0', [-14, -12]), (w1, 'w_1', [14, -12])]:
        S.point(p, 't', r=4)
        S.texte(p + d, lab, taille=16)
    S.texte(o + L * np.array([0.68, -0.30]), '+', 'r', taille=26)
    S.texte(o + L * np.array([0.30, -0.70]), '−', 'b', taille=26)
    S.texte(o + [L / 2, 30], 'Δ_1 × {e_0}', 'g', taille=15)
    S.texte(o + [L + 20, -L / 2], '{e_1} × Δ_1', 'g', ancre='start', taille=15)
    return S


@schema('ku-produit-cercle')
def ku_produit_cercle():
    S = Schema(480, 340, 'Recouvrement du cercle ℝ/ℤ par U et V, et la fonction g_1')
    c, R = np.array([240.0, 170.0]), 112.0
    ang = lambda x: 2 * math.pi * x            # point p(x) dessiné à l'angle 2πx
    pt = lambda x, r=1.0: c + R * r * np.array([math.cos(ang(x)), -math.sin(ang(x))])
    eps = 0.012
    # U = p(]−1/2, 1/2[), V = p(]0, 1[), J1 = p(]0, 1/2[), J2 = p(]1/2, 1[)
    def arcpts(x0, x1, r):
        xs = np.linspace(x0, x1, 120)
        return np.array([pt(x, r) for x in xs])
    # vérifie les intersections sur une grille de réels de [0, 1[
    xs = np.linspace(0, 1, 1000, endpoint=False) + 0.0005
    dansU = lambda x: (x % 1) < 0.5 or (x % 1) > 0.5          # tout sauf 1/2
    dansV = lambda x: (x % 1) != 0
    J1 = lambda x: 0 < (x % 1) < 0.5
    J2 = lambda x: 0.5 < (x % 1) < 1
    assert all((dansU(x) and dansV(x)) == (J1(x) or J2(x)) for x in xs)
    assert not any(J1(x) and J2(x) for x in xs)
    S.poly(arcpts(-0.5 + eps, 0.5 - eps, 1.20), 'b', l=3.2)
    S.poly(arcpts(eps, 1 - eps, 1.36), 'v', l=3.2)
    S.poly(arcpts(0, 1, 1.0), 'g', l=1.6)
    S.poly(arcpts(eps, 0.5 - eps, 1.0), 'r', l=4)
    S.point(pt(0.5, 1.20), 'b', r=5, creux=True)
    S.point(pt(0.0, 1.36), 'v', r=5, creux=True)
    S.point(pt(0.0), 't', r=4)
    S.point(pt(0.5), 't', r=4)
    S.texte(pt(0.0) + [-18, 0], 'p(0)', ancre='end', taille=15)
    S.texte(pt(0.5) + [18, 0], 'p(1/2)', ancre='start', taille=15)
    S.texte(pt(0.62, 1.32), 'U', 'b', taille=18)
    S.texte(pt(0.86, 1.52), 'V', 'v', taille=18)
    S.texte(pt(0.25, 0.70), 'J_1', 'r', taille=17)
    S.texte(pt(0.75, 0.70), 'J_2', 'g', taille=17)
    S.texte(pt(0.25, 0.45) + [0, 4], 'g_1 = 1', 'r', taille=15)
    S.texte(pt(0.75, 0.45) + [0, 4], 'g_1 = 0', 'g', taille=15)
    return S


@schema('ku-cercle')
def ku_cercle():
    S = Schema(480, 300, 'Relèvement d’un chemin du cercle et cocycle partie entière')
    x0, x1 = 0.6, 2.3
    assert floor(x1) - floor(x0) == 2
    # droite réelle en haut
    gauche, unite, y_r = 40.0, 120.0, 70.0
    X = lambda x: gauche + unite * (x + 0.25)
    assert X(-0.2) > 20 and X(2.8) + 12 + 20 < 480      # droite et étiquette « ℝ » dans le cadre
    S.ligne([X(-0.2), y_r], [X(2.8), y_r], 'g')
    for k in range(0, 3):
        S.ligne([X(k), y_r - 7], [X(k), y_r + 7], 'g')
        S.texte([X(k), y_r + 22], str(k), 'b', taille=15)
    S.texte([X(2.8) + 12, y_r], 'ℝ', 'g', ancre='start', taille=17)
    # relèvement : légère ondulation verticale pour la lisibilité, monotone en x
    ts = np.linspace(0, 1, 150)
    xt = x0 + (x1 - x0) * (3 * ts ** 2 - 2 * ts ** 3)
    assert np.all(np.diff(xt) >= 0)
    lift = np.stack([X(xt), y_r - 22 * np.sin(math.pi * ts)], -1)
    S.courbe_fleche(lift, 'r', l=3)
    S.point(lift[0], 'r', r=4)
    S.texte(lift[0] + [-6, 18], '0,6', 'r', taille=14)
    S.texte(lift[-1] + [10, 18], '2,3', 'r', ancre='start', taille=14)
    # γ̃ : lettre et tilde dessiné (le caractère combinant est mal placé par les polices)
    gx, gy = X(1.45), y_r - 40
    S.texte([gx, gy], 'γ', 'r', taille=17)
    ts_t = np.linspace(0, 1, 30)
    S.poly(np.stack([gx - 5 + 10 * ts_t, gy - 9 - 1.6 * np.sin(2 * math.pi * ts_t)], -1), 'r', l=1.4)
    for k in (1, 2):
        assert x0 < k < x1
        S.point([X(k), y_r], 'b', r=4.5)
    # cercle en bas, projection
    c, R = np.array([240.0, 210.0]), 58.0
    pt = lambda x, r=1.0: c + R * r * np.array([math.cos(2 * math.pi * x), -math.sin(2 * math.pi * x)])
    S.cercle(c, R, 'g')
    xs = np.linspace(x0, x1, 200)
    S.courbe_fleche([pt(x, 1.0 + 0.10 * (x - x0)) for x in xs], 'r', l=2.6)
    S.point(pt(0.0), 'b', r=5)
    S.texte(pt(0.0) + [14, 0], 'p(0)', 'b', ancre='start', taille=15)
    S.texte(c + [-R - 26, 0], 'γ', 'r', ancre='end', taille=17)
    S.fleche([X(2.8) - 20, y_r + 34], c + [R * 0.9, -R * 0.9], 'g', retrait=6)
    assert X(2.8) + 20 < 480                               # étiquette « p » dans le cadre
    S.texte([X(2.8) - 6, y_r + 64], 'p', 'g', ancre='start', taille=16)
    return S


@schema('ku-tore')
def ku_tore():
    N = 4
    S = Schema(480, 400, 'Tore triangulé : supports des cocycles α1, α2 et de leur produit cup')
    o, L = np.array([110.0, 350.0]), 300.0
    P = lambda x, y: o + L * np.array([x, -y])
    # triangulation : sommets (i, j) mod N, carrés coupés par la diagonale (i, j) → (i + 1, j + 1)
    ordre = lambda v: N * v[0] + v[1]
    def pas(u, v, k):
        return {0: 0, 1: 1, N - 1: -1}[(v[k] - u[k]) % N]
    def alpha(k, u, v):                       # cocycle partie entière de la coordonnée k, arête u → v
        x0 = u[k] / N
        return floor(x0 + pas(u, v, k) / N) - floor(x0)
    aretes, triangles = set(), set()
    for i in range(N):
        for j in range(N):
            a, b, c, d = (i, j), (i + 1, j), (i, j + 1), (i + 1, j + 1)
            for t in [(a, b, d), (a, c, d)]:
                tm = tuple(sorted([(p[0] % N, p[1] % N) for p in t], key=ordre))
                triangles.add(tm)
                for x, y in [(0, 1), (0, 2), (1, 2)]:
                    aretes.add((tm[x], tm[y]))
    assert len(triangles) == 2 * N * N and len(aretes) == 3 * N * N
    support = [t for t in triangles if alpha(0, t[0], t[1]) * alpha(1, t[1], t[2]) != 0]
    assert support == [((0, 0), (N - 1, 0), (N - 1, N - 1))]
    # valeur sur le cycle fondamental : chaque triangle est orienté par le signe du déterminant de ses
    # arêtes relevées ; la somme Σ orient(t) · (α1 ⌣ α2)(t) vaut 1, comme l'affirme la légende
    def orient(t):
        u, v, w = t
        du, dw = (pas(u, v, 0), pas(u, v, 1)), (pas(u, w, 0), pas(u, w, 1))
        return du[0] * dw[1] - du[1] * dw[0]
    assert all(abs(orient(t)) == 1 for t in triangles)
    valeur = sum(orient(t) * alpha(0, t[0], t[1]) * alpha(1, t[1], t[2]) for t in triangles)
    assert valeur == 1
    rouge ={e for e in aretes if alpha(0, *e)}
    bleu = {e for e in aretes if alpha(1, *e)}
    # une arête de α1 non nulle traverse la droite x = 0 (dernière colonne) ; de même pour α2 (dernière rangée)
    assert all({e[0][0], e[1][0]} == {0, N - 1} for e in rouge)
    assert all({e[0][1], e[1][1]} == {0, N - 1} for e in bleu)

    def dessin(u, v):
        """Segment de l'arête u → v dans le carré, relevé avec u dans [0, N[ puis ramené dans [0, N]² ;
        renvoie la liste de ses copies visibles (une arête du bord apparaît deux fois)."""
        du, dv = pas(u, v, 0), pas(u, v, 1)
        a = np.array(u, float); b = a + [du, dv]
        out = []
        for sx in (-N, 0, N):
            for sy in (-N, 0, N):
                p, q = a + [sx, sy], b + [sx, sy]
                if min(p[0], q[0]) >= 0 and max(p[0], q[0]) <= N and min(p[1], q[1]) >= 0 and max(p[1], q[1]) <= N:
                    out.append((p / N, q / N))
        return out

    # triangle grisé : relevé dans le carré
    (ta, tb, tc), = support
    tri = [np.array([N - 1, N - 1]), np.array([N - 1, N]), np.array([N, N])]
    assert {(int(p[0]) % N, int(p[1]) % N) for p in tri} == {ta, tb, tc}
    S.surface([P(*(p / N)) for p in tri], 'g')
    for e in sorted(aretes):
        for p, q in dessin(*e):
            S.ligne(P(*p), P(*q), 'g', l=1.0)
    for ens, cl in [(rouge, 'r'), (bleu, 'b')]:
        for e in sorted(ens):
            for p, q in dessin(*e):
                S.ligne(P(*p), P(*q), cl, l=3)
    # côtés identifiés
    for p, q in [((0, 0), (1, 0)), ((0, 1), (1, 1))]:
        S.pointe(P(0.5, p[1]) + [7, 0], [1, 0], 't', taille=11, largeur=5)
    for p, q in [((0, 0), (0, 1)), ((1, 0), (1, 1))]:
        S.pointe(P(p[0], 0.5) + [0, -7], [0, -1], 't', taille=11, largeur=5)
        S.pointe(P(p[0], 0.5) + [0, -17], [0, -1], 't', taille=11, largeur=5)
    S.rect(o[0], o[1] - L, L, L, 't')
    # cercles générateurs : horizontal y = 1/2 + 1/8, vertical x = 1/2 + 1/8 (dans l'intérieur, en vert)
    S.fleche(P(0, 0.375), P(1, 0.375), 'v', l=3.4)
    S.fleche(P(0.375, 0), P(0.375, 1), 'v', l=3.4)
    S.texte(P(0.10, 0.375) + [0, -14], 'S^1 × {pt}', 'v', ancre='start', taille=14)
    S.texte(P(0.375, 0.08) + [8, 0], '{pt} × S^1', 'v', ancre='start', taille=14)
    S.texte(P(1, 0.12) + [12, 0], 'α_1 ≠ 0', 'r', ancre='start', taille=15)
    S.texte(P(0.62, 1) + [0, -16], 'α_2 ≠ 0', 'b', taille=15)
    return S
