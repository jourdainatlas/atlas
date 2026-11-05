"""Schémas des exemples du lexique, théorie anf (analyse fonctionnelle) : contenu/exemples/anf.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 16 ou 17
(mémo de l'édifice, § 111). Positions calculées, et ce que dit la légende vérifié par assert.
Couleurs (§ 29) : t encre, g gris (axes, référence), r rouge (objet étudié), b bleu, v vert.
"""
import math
from fractions import Fraction as Fr
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

W = 420


def _repere(xmin, xmax, ymin, ymax, w, h, gauche, haut, egal=False):
    """Repère dans le rectangle (gauche, haut, w, h) ; egal=True : même échelle sur les deux axes."""
    if egal:
        k = min(w / (xmax - xmin), h / (ymax - ymin))
        L, Hh = k * (xmax - xmin), k * (ymax - ymin)
        return Repere(xmin, xmax, ymin, ymax, gauche + (w - L) / 2, haut + (h - Hh) / 2, L, Hh)
    return Repere(xmin, xmax, ymin, ymax, gauche, haut, w, h)


def _marche(S, R, morceaux, c, l=None, raccords=True):
    """Fonction en escalier : (a, b, valeur) par palier ; raccords verticaux en pointillé."""
    for i, (a, b, y) in enumerate(morceaux):
        S.ligne(R(a, y), R(b, y), c, l=l)
        if raccords and i + 1 < len(morceaux):
            a2, b2, y2 = morceaux[i + 1]
            if abs(y2 - y) > 1e-12 and abs(a2 - b) < 1e-12:
                S.ligne(R(b, y), R(b, y2), c, True)


def _rademacher(j, x):
    return (-1.0) ** np.floor(2 ** j * np.asarray(x, float))


# ---------------------------------------------------------------- espace-norme

@schema('lex-espace-norme-1')
def lex_espace_norme_1():
    N = 5
    a = [Fr(1, n + 1) for n in range(12)]
    s = [a[n] if n <= N else Fr(0) for n in range(12)]
    ecarts = [abs(a[n] - s[n]) for n in range(12)]
    assert max(ecarts) == Fr(1, 7) and ecarts.index(Fr(1, 7)) == 6        # écart maximal au rang 6, égal à 1/7
    assert all(a[n] == s[n] for n in range(N + 1)) and all(s[n] == 0 for n in range(N + 1, 12))
    H = 240
    S = Schema(W, H, 'La suite a = (1/(n+1)) et sa tronquée s₅')
    R = _repere(-0.6, 11.8, -0.08, 1.08, 360, 190, 44, 14)
    S.ligne(R(-0.6, 0), R(11.8, 0), 'g')
    S.ligne(R(-0.6, 0), R(-0.6, 1.05), 'g')
    for y, t in [(1, '1'), (Fr(1, 7), '1/7')]:
        S.ligne(R(-0.75, float(y)), R(-0.6, float(y)), 'g')
        S.texte(R(-0.6, float(y)) + [-8, 0], t, 'g', ancre='end', taille=15)
    for n in range(12):
        S.ligne(R(n, 0), R(n, float(a[n])), 'g', l=1.2)
        S.point(R(n, float(a[n])), 'g', r=4.2)
        if n <= N:
            S.point(R(n, float(s[n])), 'r', r=3.2)
        else:
            S.point(R(n, 0), 'r', r=3.2)
    # écart au rang 6
    S.ligne(R(6, 0) + [-7, 0], R(6, float(a[6])) + [-7, 0], 'r', l=2.4)
    S.texte(R(6, float(a[6])) + [0, -18], '1/7', 'r', taille=15)
    for n in (0, 5, 6, 11):
        S.texte(R(n, 0) + [0, 16], str(n), 'g', taille=15)
    S.texte(R(2.2, 0.62), 'a', 'g', ancre='start')
    S.texte(R(2.3, 0.33) + [6, -4], 's_5', 'r', ancre='start')
    return S


# ---------------------------------------------------------------- espace-hilbert

@schema('lex-espace-hilbert-3')
def lex_espace_hilbert_3():
    xs = np.linspace(0, 1, 2001)
    f = xs - 0.5
    fp = np.maximum(f, 0)
    assert np.all((f - fp)[xs >= 0.5] == 0) and np.all(fp[xs <= 0.5] == 0) and np.all((f - fp) * fp == 0)
    assert abs(np.trapezoid((0.5 - xs[xs <= 0.5]) ** 2, xs[xs <= 0.5]) - 1 / 24) < 1e-6
    H = 230
    S = Schema(W, H, 'La fonction x − 1/2 et sa partie positive')
    R = _repere(-0.1, 1.15, -0.62, 0.62, 360, 200, 30, 14, egal=True)
    R.axes(S, 'x', '')
    S.poly(R(xs, f), 'g', l=2)
    S.poly(R(xs, fp), 'r', l=3)
    S.texte(R(0, 0) + [-6, 14], '0', 'g', ancre='end', taille=15)
    S.texte(R(0.5, 0) + [-8, -14], '1/2', 'g', ancre='end', taille=15)
    S.ligne(R(1, -0.03), R(1, 0.03), 'g')
    S.texte(R(1, 0) + [0, 16], '1', 'g', taille=15)
    S.texte(R(0.3, -0.2) + [12, 10], 'f', 'g', ancre='start')
    S.texte(R(0.82, 0.32) + [-10, -12], 'f^+', 'r', ancre='end')
    return S


# ---------------------------------------------------------------- base-hilbertienne

@schema('lex-base-hilbertienne-1')
def lex_base_hilbertienne_1():
    mil = (np.arange(64) + 0.5) / 64
    r1, r2 = _rademacher(1, mil), _rademacher(2, mil)
    p = r1 * r2
    assert np.all(p[(mil < 0.25) | (mil >= 0.75)] == 1) and np.all(p[(mil >= 0.25) & (mil < 0.75)] == -1)
    for moitie in (mil < 0.5, mil >= 0.5):
        assert np.sum(p[moitie]) == 0                       # autant de chaque signe sur chaque moitié
    assert np.mean(p) == 0 and np.mean(p * r1) == 0 and np.mean(p * r2) == 0
    H = 300
    S = Schema(W, H, 'Les fonctions r₁, r₂ et leur produit')
    h, haut, gauche, larg = 70, 12, 66, 300
    rangs = [('r_1', r1, 'b', 1), ('r_2', r2, 'v', 2), ('r_1r_2', p, 'r', None)]
    for i, (nom, _, c, j) in enumerate(rangs):
        R = Repere(0, 1, -1.3, 1.3, gauche, haut + i * (h + 26), larg, h)
        S.ligne(R(0, 0), R(1.04, 0), 'g')
        for xv in (0.25, 0.5, 0.75, 1.0):
            S.ligne(R(xv, -1.2), R(xv, 1.2), 'g', d=True)
        if j is not None:
            m = [(k / 2 ** j, (k + 1) / 2 ** j, (-1) ** k) for k in range(2 ** j)]
        else:
            m = [(0, .25, 1), (.25, .75, -1), (.75, 1, 1)]
        _marche(S, R, m, c, l=2.6)
        S.texte(R(0, 0) + [-12, 0], nom, c, ancre='end', taille=16)
        if i == 0:
            S.texte(R(1, 1) + [12, 0], '1', 'g', ancre='start', taille=14)
            S.texte(R(1, -1) + [12, 0], '−1', 'g', ancre='start', taille=14)
    R = Repere(0, 1, -1.3, 1.3, gauche, haut + 2 * (h + 26), larg, h)
    assert gauche + 1.04 * larg + 12 + largeur_texte('−1', 14) <= W
    for xv, s in [(0, '0'), (0.25, '1/4'), (0.5, '1/2'), (0.75, '3/4'), (1, '1')]:
        S.texte(R(xv, -1.3) + [0, 12], s, 'g', taille=14)
    assert haut + 3 * h + 2 * 26 + 24 <= H
    return S


# ---------------------------------------------------------------- operateur-autoadjoint

@schema('lex-operateur-autoadjoint-1')
def lex_operateur_autoadjoint_1():
    t = math.radians(128)
    x = np.array([math.cos(t), math.sin(t)])
    q = np.array([x[0], 0.0])
    p = np.array([x[0] - x[1], 0.0])
    assert abs(np.linalg.norm(x) - 1) < 1e-12 and np.linalg.norm(p) > 1 and np.linalg.norm(q) <= 1
    assert abs(np.dot(x - q, [1, 0])) < 1e-12 and abs((x - p)[0] * 1 - (x - p)[1] * 1) < 1e-12   # directions de projection
    assert abs(max(abs(u - v) for u, v in [(1 / math.sqrt(2), -1 / math.sqrt(2))]) - math.sqrt(2)) < 1e-12
    H = 300
    S = Schema(W, H, 'Projection perpendiculaire et projection oblique sur une droite')
    R = _repere(-1.75, 1.35, -1.08, 1.25, 400, 284, 10, 8, egal=True)
    S.ligne(R(-1.75, 0), R(1.35, 0), 'g')
    S.ligne(R(0, -1.08), R(0, 1.25), 'g')
    th = np.linspace(0, 2 * np.pi, 241)
    S.poly(R(np.cos(th), np.sin(th)), 'g', ferme=True)
    S.ligne(R(-1, -1), R(1.2, 1.2), 'g', d=True)              # la droite R(1, 1)
    S.ligne(R(*x), R(*q), 'b', l=2)
    S.ligne(R(*x), R(*p), 'r', d=True, l=2)
    S.point(R(*x), 't', r=4)
    S.point(R(*q), 'b', r=4.2)
    S.point(R(*p), 'r', r=4.2)
    S.texte(R(*x) + [-10, -12], 'x', 't', ancre='end')
    S.texte(R(*q) + [6, 18], 'q(x)', 'b', ancre='start', taille=16)
    S.texte(R(*p) + [0, 20], 'p(x)', 'r', taille=16)
    S.texte(R(1.2, 1.2) + [-6, 4], 'ℝ(1, 1)', 'g', ancre='end', taille=15)
    S.texte(R(1, 0) + [8, 14], '1', 'g', ancre='start', taille=15)
    return S


# ---------------------------------------------------------------- espace-L1

@schema('lex-espace-L1-2')
def lex_espace_L1_2():
    x0 = 0.3
    rangees = []
    for j in range(4):
        iv = [(k / 2 ** j, (k + 1) / 2 ** j) for k in range(2 ** j)]
        assert iv[0][0] == 0 and iv[-1][1] == 1 and all(iv[i][1] == iv[i + 1][0] for i in range(len(iv) - 1))
        assert sum(1 for a, b in iv if a <= x0 < b) == 1        # un seul intervalle par rangée contient 0,3
        rangees.append(iv)
    H = 230
    S = Schema(W, H, 'La machine à écrire : f₁ à f₁₅')
    gauche, larg, haut, pas = 92, 300, 18, 44
    R = Repere(0, 1, 0, 1, gauche, 0, larg, 1)
    for j, iv in enumerate(rangees):
        y = haut + j * pas
        for k, (a, b) in enumerate(iv):
            xa, xb = R(a, 0)[0], R(b, 0)[0]
            dedans = a <= x0 < b
            S.rect(xa + 1.5, y, xb - xa - 3, 22, 'r' if dedans else 'b', rempli='r' if dedans else 'b', rx=2)
        n0, n1 = 2 ** j, 2 ** (j + 1) - 1
        lab = f'f_{n0}' if n0 == n1 else f'f_{{{n0}}}…f_{{{n1}}}' if n0 >= 10 else f'f_{n0}…f_{{{n1}}}' if n1 >= 10 else f'f_{n0}…f_{n1}'
        S.texte([gauche - 10, y + 11], lab, 'g', ancre='end', taille=15)
    yb = haut + 4 * pas
    S.ligne(R(0, 0) * [1, 0] + [0, yb], R(1, 0) * [1, 0] + [0, yb], 'g')
    for xv, s in [(0, '0'), (0.5, '1/2'), (1, '1')]:
        S.texte([R(xv, 0)[0], yb + 16], s, 'g', taille=15)
    xr = R(x0, 0)[0]
    S.ligne([xr, haut - 8], [xr, yb + 4], 'r', l=2)
    S.texte([xr, yb + 16], 'x', 'r', taille=16)
    assert yb + 28 <= H
    return S


# ---------------------------------------------------------------- espace-L2

@schema('lex-espace-L2-3')
def lex_espace_L2_3():
    fam = [(1, 'g'), (4, 'b'), (16, 'r')]
    for n, _ in fam:
        assert Fr(n) * Fr(1, n) == 1                       # ∫ f_n² = n · (1/n)
    H = 290
    S = Schema(W, H, 'Les fonctions √n 1]0,1/n] pour n = 1, 4, 16')
    R = _repere(-0.06, 1.1, -0.25, 4.4, 350, 262, 30, 10)
    R.axes(S, 'x', '')
    for n, c in fam:
        h, b = math.sqrt(n), 1 / n
        S.poly(R([0, 0, b, b], [0, h, h, 0]), c, l=2.4, rempli=c)
    S.texte(R(0, 0) + [-6, 14], '0', 'g', ancre='end', taille=15)
    for y in (1, 2, 4):
        S.texte(R(0, y) + [-8, 0], str(y), 'g', ancre='end', taille=15)
    S.texte(R(1, 0) + [0, 16], '1', 'g', taille=15)
    S.texte(R(0.25, 0) + [0, 16], '1/4', 'g', taille=15)
    S.texte(R(0.6, 1) + [0, -14], 'f_1', 'g')
    S.texte(R(0.25, 2) + [14, -2], 'f_4', 'b', ancre='start')
    S.texte(R(1 / 16, 4) + [14, 0], 'f_{16}', 'r', ancre='start')
    return S


# ---------------------------------------------------------------- famille-orthonormee

@schema('lex-famille-orthonormee-1')
def lex_famille_orthonormee_1():
    G = np.array([[2, 1], [1, 1]])
    ps = lambda u, v: float(np.array(u) @ G @ np.array(v))
    e1, e2 = np.array([1, 0]), np.array([0, 1])
    f = e1 - e2
    assert ps(e2, e2) == 1 and ps(f, f) == 1 and ps(e2, f) == 0 and ps(e1, e1) == 2
    # ellipse ⟨x, x⟩ = 1 : x = G^{-1/2} (cos t, sin t)
    w, V = np.linalg.eigh(G)
    th = np.linspace(0, 2 * np.pi, 361)
    P = (V @ np.diag(1 / np.sqrt(w)) @ V.T @ np.vstack([np.cos(th), np.sin(th)])).T
    assert np.allclose([ps(p, p) for p in P], 1)
    H = 290
    S = Schema(W, H, 'Le cercle unité d’un produit scalaire de ℝ²')
    R = _repere(-1.6, 1.6, -1.6, 1.6, 400, 274, 10, 8, egal=True)
    S.ligne(R(-1.6, 0), R(1.6, 0), 'g')
    S.ligne(R(0, -1.6), R(0, 1.6), 'g')
    S.poly(R(P[:, 0], P[:, 1]), 'b', ferme=True, rempli='b', l=2)
    S.fleche(R(0, 0), R(*e1), 'v', l=2.4)
    S.fleche(R(0, 0), R(*e2), 'r', l=2.4)
    S.fleche(R(0, 0), R(*f), 'r', l=2.4)
    S.texte(R(*e1) + [10, -14], 'e_1', 'v', ancre='start')
    S.texte(R(*e2) + [12, -4], 'e_2', 'r', ancre='start')
    S.texte(R(*f) + [12, 10], 'e_1 − e_2', 'r', ancre='start')
    return S


@schema('lex-famille-orthonormee-3')
def lex_famille_orthonormee_3():
    mil = (np.arange(256) + 0.5) / 256
    for i in (1, 2, 3):
        assert np.mean(_rademacher(i, mil) ** 2) == 1
        for j in (1, 2, 3):
            if i < j:
                assert np.mean(_rademacher(i, mil) * _rademacher(j, mil)) == 0
    # sur chaque palier de r_1, r_2 vaut 1 et −1 sur des longueurs égales
    for m in (mil < 0.5, mil >= 0.5):
        assert np.sum(_rademacher(2, mil[m])) == 0
    H = 280
    S = Schema(W, H, 'Les fonctions de Rademacher r₁, r₂, r₃')
    h, haut, gauche, larg = 64, 12, 60, 330
    cs = {1: 'b', 2: 'v', 3: 'r'}
    for i, j in enumerate((1, 2, 3)):
        R = Repere(0, 1, -1.3, 1.3, gauche, haut + i * (h + 24), larg, h)
        S.ligne(R(0, 0), R(1.04, 0), 'g')
        for xv in (0.5, 1.0):
            S.ligne(R(xv, -1.2), R(xv, 1.2), 'g', d=True)
        m = [(k / 2 ** j, (k + 1) / 2 ** j, (-1) ** k) for k in range(2 ** j)]
        _marche(S, R, m, cs[j], l=2.6)
        S.texte(R(0, 0) + [-12, 0], f'r_{j}', cs[j], ancre='end', taille=16)
    R = Repere(0, 1, -1.3, 1.3, gauche, haut + 2 * (h + 24), larg, h)
    for xv, s in [(0, '0'), (0.5, '1/2'), (1, '1')]:
        S.texte(R(xv, -1.3) + [0, 12], s, 'g', taille=14)
    assert haut + 3 * h + 2 * 24 + 22 <= H
    return S


# ---------------------------------------------------------------- orthogonal-partie

@schema('lex-orthogonal-partie-2')
def lex_orthogonal_partie_2():
    t = Fr(1, 3)
    H = 230
    S = Schema(W, H, 'Le point 1/3 et les intervalles dyadiques qui le contiennent')
    gauche, larg, haut, pas = 60, 340, 16, 42
    R = Repere(0, 1, 0, 1, gauche, 0, larg, 1)
    for i, j in enumerate((1, 2, 3, 4)):
        y = haut + i * pas
        for k in range(2 ** j):
            a, b = Fr(k, 2 ** j), Fr(k + 1, 2 ** j)
            dedans = a <= t < b
            if dedans:
                assert a < t < b and (t - a) > 0 and (b - t) > 0     # 1/3 intérieur : déborde des deux côtés
            xa, xb = R(float(a), 0)[0], R(float(b), 0)[0]
            S.rect(xa + 1.5, y, xb - xa - 3, 20, 'b' if dedans else 'g', rempli='b' if dedans else None, rx=2)
        S.texte([gauche - 10, y + 10], f'j = {j}', 'g', ancre='end', taille=15)
    yb = haut + 4 * pas
    S.ligne([R(0, 0)[0], yb], [R(1, 0)[0], yb], 'g')
    for xv, s_ in [(0, '0'), (0.5, '1/2'), (1, '1')]:
        S.texte([R(xv, 0)[0], yb + 16], s_, 'g', taille=15)
    xr = R(float(t), 0)[0]
    S.ligne([xr, haut - 8], [xr, yb + 4], 'r', l=2)
    S.texte([xr, yb + 16], '1/3', 'r', taille=15)
    assert yb + 28 <= H
    return S


# ---------------------------------------------------------------- exposants-conjugues

@schema('lex-exposants-conjugues-1')
def lex_exposants_conjugues_1():
    conj = lambda p: p / (p - 1)
    for p in (Fr(3, 2), Fr(4, 3), Fr(3), Fr(2)):
        assert conj(conj(p)) == p
    assert conj(Fr(3, 2)) == 3 and conj(Fr(2)) == 2
    H = 300
    S = Schema(W, H, 'La conjugaison des exposants q = p/(p − 1)')
    R = _repere(0.6, 6.2, 0.6, 6.2, 380, 238, 24, 32, egal=True)
    R.axes(S, 'p', 'q', origine=(0.6, 0.6))
    S.ligne(R(0.6, 0.6), R(6, 6), 'g')
    S.ligne(R(1, 0.6), R(1, 6.2), 'g', d=True)
    S.ligne(R(0.6, 1), R(6.2, 1), 'g', d=True)
    ps = np.linspace(1 + 1 / 5.2, 6.2, 400)
    S.poly(R(ps, ps / (ps - 1)), 'r', l=2.4)
    S.point(R(2, 2), 'r', r=4)
    S.texte(R(2, 2) + [-8, 14], '(2, 2)', 'r', ancre='end', taille=15)
    for a, b in ((1.5, 3), (3, 1.5)):
        S.point(R(a, b), 'b', r=4.2)
    S.texte(R(1.5, 3) + [10, -4], '(3/2, 3)', 'b', ancre='start', taille=15)
    S.texte(R(3, 1.5) + [8, -14], '(3, 3/2)', 'b', ancre='start', taille=15)
    S.texte(R(1, 0.6) + [0, 14], '1', 'g', taille=15)
    S.texte(R(0.6, 1) + [-8, 0], '1', 'g', ancre='end', taille=15)
    return S


# ---------------------------------------------------------------- projection-orthogonale

@schema('lex-projection-orthogonale-2')
def lex_projection_orthogonale_2():
    xs = np.linspace(0, 1, 20001)
    e = xs ** 2 - xs + 1 / 6
    assert abs(np.trapezoid(e, xs)) < 1e-9 and abs(np.trapezoid(e * xs, xs)) < 1e-9     # écart ⊥ 1 et ⊥ x
    r = np.roots([1, -1, 1 / 6])
    assert np.allclose(sorted(r), [0.5 - math.sqrt(1 / 12), 0.5 + math.sqrt(1 / 12)])     # symétriques / 1/2
    H = 280
    S = Schema(W, H, 'La parabole x² et sa projection x − 1/6 sur les fonctions affines')
    R = _repere(-0.08, 1.12, -0.25, 1.05, 380, 250, 24, 12, egal=True)
    R.axes(S, 'x', '')
    S.poly(R(xs, xs ** 2), 'g', l=2.2)
    S.poly(R(xs, xs - 1 / 6), 'r', l=2.4)
    for z in sorted(r):
        S.point(R(z, z ** 2), 'r', r=3.6)
    S.texte(R(0, 0) + [-6, 14], '0', 'g', ancre='end', taille=15)
    S.ligne(R(1, -0.02), R(1, 0.02), 'g')
    S.texte(R(1, 0) + [0, 16], '1', 'g', taille=15)
    S.texte(R(0.93, 0.93 ** 2) + [-12, -12], 'x^2', 'g', ancre='end')
    S.texte(R(0.95, 0.95 - 1 / 6) + [8, 10], 'x − 1/6', 'r', ancre='start', taille=16)
    assert R(0.95, 0)[0] + 8 + largeur_texte('x − 1/6', 16) <= W
    return S


# ---------------------------------------------------------------- convergence-uniforme-compact

@schema('lex-convergence-uniforme-compact-2')
def lex_convergence_uniforme_compact_2():
    xs = np.linspace(0, 1, 4001)
    fam = [(2, 'g'), (5, 'b'), (20, 'r')]
    for n, _ in fam:
        fn = n * xs * (1 - xs) ** n
        assert n * (1 / (2 * n)) * (1 - 1 / (2 * n)) ** n >= 0.25          # f_n(1/(2n)) ≥ 1/4
        m = fn.max()
        assert 0.25 <= m <= 1 / math.e + 1e-9 and abs(xs[fn.argmax()] - 1 / (n + 1)) < 1e-3
    hs = [n / (n + 1) * (n / (n + 1)) ** n for n, _ in fam]
    assert hs == sorted(hs) and all(0.25 <= h < 1 / math.e for h in hs)
    H = 250
    S = Schema(W, H, 'Les bosses n x (1 − x)ⁿ pour n = 2, 5, 20')
    R = _repere(-0.04, 1.08, -0.04, 0.46, 380, 210, 28, 14)
    R.axes(S, 'x', '')
    S.ligne(R(0, 0.25), R(1, 0.25), 'g', d=True)
    S.texte(R(1, 0.25) + [6, 0], '1/4', 'g', ancre='start', taille=15)
    for n, c in fam:
        S.poly(R(xs, n * xs * (1 - xs) ** n), c, l=2.2)
    S.texte(R(0, 0) + [-6, 12], '0', 'g', ancre='end', taille=15)
    S.texte(R(1, 0) + [0, 14], '1', 'g', taille=15)
    S.texte(R(1 / 3, 2 * (1 / 3) * (2 / 3) ** 2) + [14, -8], 'f_2', 'g', ancre='start')
    S.texte(R(1 / 6, 5 / 6 * (5 / 6) ** 5) + [20, -10], 'f_5', 'b', ancre='start')
    S.texte(R(1 / 21, 20 / 21 * (20 / 21) ** 20) + [-4, -14], 'f_{20}', 'r', ancre='middle')
    return S


# ---------------------------------------------------------------- quotient-rayleigh

@schema('lex-quotient-rayleigh-2')
def lex_quotient_rayleigh_2():
    B = np.array([[1, 1], [0, 1]])
    ts = np.linspace(0, 2 * np.pi, 3601)
    Rq = np.array([np.dot(B @ [math.cos(t), math.sin(t)], [math.cos(t), math.sin(t)]) for t in ts])
    assert abs(ts[Rq.argmax()] - math.pi / 4) < 1e-3 or abs(ts[Rq.argmax()] - 5 * math.pi / 4) < 1e-3
    x = np.array([1, 1]) / math.sqrt(2)
    Bx = B @ x
    assert abs(Bx[0] * x[1] - Bx[1] * x[0]) > 0.1                           # Bx non colinéaire à x
    assert np.allclose(B @ [1, 0], [1, 0])
    H = 290
    S = Schema(W, H, 'Le quotient de Rayleigh d’une matrice non symétrique')
    R = _repere(-1.25, 1.75, -1.2, 1.35, 400, 274, 10, 8, egal=True)
    S.ligne(R(-1.25, 0), R(1.75, 0), 'g')
    S.ligne(R(0, -1.2), R(0, 1.35), 'g')
    th = np.linspace(0, 2 * np.pi, 241)
    S.poly(R(np.cos(th), np.sin(th)), 'g', ferme=True)
    S.ligne(R(0, 0), R(*(1.3 * x)), 'g', d=True)
    S.fleche(R(*x), R(*(x + Bx * 0.5)), 'r', l=2.4)
    S.fleche(R(1, 0), R(1.5, 0), 'b', l=2.4)
    S.point(R(*x), 't', r=4)
    S.point(R(1, 0), 't', r=4)
    S.texte(R(*x) + [-12, -6], 'x', 't', ancre='end')
    S.texte(R(*(x + Bx * 0.5)) + [8, -4], 'Bx', 'r', ancre='start', taille=16)
    S.texte(R(1.5, 0) + [-4, 18], 'B(1, 0)', 'b', ancre='middle', taille=15)
    return S


# ---------------------------------------------------------------- identite-parallelogramme

@schema('lex-identite-parallelogramme-3')
def lex_identite_parallelogramme_3():
    a, b, x = np.array([0., 0]), np.array([4., 0]), np.array([1., 3])
    m = (a + b) / 2
    n2 = lambda v: float(v @ v)
    assert n2(x - a) == 10 and n2(x - b) == 18 and n2(a - b) == 16 and n2(x - m) == 10
    assert n2(x - m) == (n2(x - a) + n2(x - b)) / 2 - n2(a - b) / 4
    H = 250
    S = Schema(W, H, 'Une médiane et l’identité du parallélogramme')
    R = _repere(-0.6, 4.6, -0.7, 3.4, 400, 230, 10, 10, egal=True)
    S.poly(R(np.array([a[0], b[0], x[0]]), np.array([a[1], b[1], x[1]])), 'g', ferme=True, rempli='g', l=2)
    S.ligne(R(*x), R(*m), 'r', l=2.6)
    for P, lab, dec, anc in [(a, 'a', [-10, 14], 'end'), (b, 'b', [10, 14], 'start'), (x, 'x', [0, -16], 'middle'),
                             (m, 'm', [0, 20], 'middle')]:
        S.point(R(*P), 'r' if lab == 'm' else 't', r=4)
        S.texte(R(*P) + dec, lab, 'r' if lab == 'm' else 't', ancre=anc)
    S.texte((R(*a) + R(*x)) / 2 + [-14, 0], '√10', 'g', ancre='end', taille=15)
    S.texte((R(*b) + R(*x)) / 2 + [14, -4], '√18', 'g', ancre='start', taille=15)
    S.texte((R(*x) + R(*m)) / 2 + [10, 0], '√10', 'r', ancre='start', taille=15)
    return S


# ---------------------------------------------------------------- interpole-deux-points

@schema('lex-interpole-deux-points-1')
def lex_interpole_deux_points_1():
    xs = np.linspace(0, 1, 2001)
    f = np.abs(xs - 0.5)
    e = f - 0.25
    assert abs(np.max(np.abs(e)) - 0.25) < 1e-12
    assert e[0] == 0.25 and e[-1] == 0.25 and abs(e[1000] + 0.25) < 1e-12
    assert np.allclose(np.maximum(0.5 - xs, xs - 0.5), f)
    H = 230
    S = Schema(W, H, 'La valeur absolue et la meilleure fonction affine')
    R = _repere(-0.1, 1.12, -0.58, 0.62, 380, 210, 24, 10, egal=True)
    R.axes(S, 't', '')
    S.poly(R(xs, 0.5 - xs), 'g', d=True)
    S.poly(R(xs, xs - 0.5), 'g', d=True)
    S.poly(R(xs, f), 'r', l=2.6)
    S.ligne(R(0, 0.25), R(1, 0.25), 'b', l=2.4)
    for t0 in (0, 0.5, 1):
        S.ligne(R(t0, 0.25), R(t0, abs(t0 - 0.5)), 'b', d=True)
    S.texte(R(0, 0.25) + [-8, 0], '1/4', 'b', ancre='end', taille=15)
    S.texte(R(0, 0) + [-6, 14], '0', 'g', ancre='end', taille=15)
    S.texte(R(0.5, 0) + [0, 34], '1/2', 'g', taille=15)
    S.texte(R(1, 0) + [0, 16], '1', 'g', taille=15)
    return S


# ---------------------------------------------------------------- systeme-haar

@schema('lex-systeme-haar-3')
def lex_systeme_haar_3():
    t3 = Fr(1, 3)
    def Sj(j):
        k = int(t3 * 2 ** j)
        a, b = Fr(k, 2 ** j), Fr(k + 1, 2 ** j)
        m = (t3 - a) * 2 ** j
        return a, b, m
    for j in range(1, 12):
        a, b, m = Sj(j)
        assert m == (Fr(1, 3) if j % 2 == 0 else Fr(2, 3)) and min(m, 1 - m) >= Fr(1, 3)
    H = 220
    S = Schema(W, H, 'Sommes partielles de Haar de l’indicatrice de [0, 1/3[')
    R = _repere(-0.04, 1.08, -0.15, 1.15, 380, 190, 30, 12)
    R.axes(S, 'x', '')
    S.ligne(R(0, 1), R(1 / 3, 1), 'g', l=4)
    S.ligne(R(1 / 3, 0), R(1, 0), 'g', l=4)
    for j, c, dy in ((2, 'b', 0.012), (3, 'r', -0.012)):
        a, b, m = Sj(j)
        _marche(S, R, [(0, float(a), 1 + dy), (float(a), float(b), float(m)), (float(b), 1, dy)], c, l=2.2)
    S.ligne(R(1 / 3, -0.05), R(1 / 3, 1.1), 'g', d=True)
    S.texte(R(1 / 3, 0) + [0, 18], '1/3', 'g', taille=15)
    S.texte(R(1, 0) + [0, 18], '1', 'g', taille=15)
    S.texte(R(0, 1) + [-8, 0], '1', 'g', ancre='end', taille=15)
    S.texte(R(0.25, 2 / 3) + [-8, 0], 'S_3f', 'r', ancre='end', taille=16)
    S.texte(R(0.45, 1 / 3) + [8, -12], 'S_2f', 'b', ancre='start', taille=16)
    return S


# ---------------------------------------------------------------- polynomes-bernstein

def _bernstein(vals, xs):
    n = len(vals) - 1
    return sum(vals[k] * math.comb(n, k) * xs ** k * (1 - xs) ** (n - k) for k in range(n + 1))


@schema('lex-polynomes-bernstein-3')
def lex_polynomes_bernstein_3():
    xs = np.linspace(0, 1, 4001)
    fam = [(4, 'v'), (16, 'b'), (64, 'r')]
    courbes = {}
    for n, _ in fam:
        B = _bernstein([1.0 if k / n >= 0.5 else 0.0 for k in range(n + 1)], xs)
        assert abs(B[0]) < 1e-12 and abs(B[-1] - 1) < 1e-12 and B.min() >= -1e-12 and B.max() <= 1 + 1e-12
        f = (xs >= 0.5).astype(float)
        assert np.max(np.abs(B - f)) >= 0.5 - 1e-3          # la valeur 1/2 est prise : écart ≥ 1/2
        courbes[n] = B
    H = 240
    S = Schema(W, H, 'Polynômes de Bernstein d’une fonction en escalier')
    R = _repere(-0.04, 1.08, -0.1, 1.12, 380, 206, 28, 12)
    R.axes(S, 'x', '')
    S.ligne(R(0, 0), R(0.5, 0), 'g', l=4)
    S.ligne(R(0.5, 1), R(1, 1), 'g', l=4)
    S.ligne(R(0, 0.5), R(1, 0.5), 'g', d=True)
    for n, c in fam:
        S.poly(R(xs, courbes[n]), c, l=2)
    S.texte(R(0, 0.5) + [-8, 0], '1/2', 'g', ancre='end', taille=15)
    S.texte(R(0, 1) + [-8, 0], '1', 'g', ancre='end', taille=15)
    S.texte(R(0.5, 0) + [0, 16], '1/2', 'g', taille=15)
    S.texte(R(1, 0) + [0, 16], '1', 'g', taille=15)
    S.texte(R(0.2, 0.3) + [0, 0], 'B_4f', 'v', taille=16)
    S.texte(R(0.6, 0.6) + [10, 0], 'B_{16}f', 'b', ancre='start', taille=16)
    S.texte(R(0.47, 0.8) + [-14, 0], 'B_{64}f', 'r', ancre='end', taille=16)
    return S


# ---------------------------------------------------------------- distance-partie

@schema('lex-distance-partie-3')
def lex_distance_partie_3():
    xs = np.linspace(-2, 3, 5001)
    dF = np.maximum(0, np.maximum(-xs, xs - 1))                  # distance à F = [0, 1]
    dC = np.maximum(0, np.minimum(xs + 1, 2 - xs))               # distance au complémentaire de ]-1, 2[
    assert np.all(dF + dC > 0)
    f = dC / (dC + dF)
    assert np.all(f[(xs >= 0) & (xs <= 1)] == 1) and np.all(f[(xs <= -1) | (xs >= 2)] == 0)
    m = (xs > -1) & (xs < 0)
    assert np.allclose(f[m], xs[m] + 1)
    m = (xs > 1) & (xs < 2)
    assert np.allclose(f[m], 2 - xs[m])
    assert abs(dC.max() - 1.5) < 1e-9 and abs(xs[dC.argmax()] - 0.5) < 1e-3     # tente de sommet 3/2 en 1/2
    H = 270
    S = Schema(W, H, 'Une fonction d’Urysohn sur ℝ')
    R = _repere(-2.2, 3, -0.15, 1.75, 366, 236, 44, 12)
    S.ligne(R(-2.2, 0), R(3, 0), 'g')
    S.ligne(R(-2.2, -0.1), R(-2.2, 1.7), 'g')
    for yv, t_ in [(1, '1'), (1.5, '3/2')]:
        S.ligne(R(-2.2, yv) + [-4, 0], R(-2.2, yv), 'g')
        S.texte(R(-2.2, yv) + [-8, 0], t_, 'g', ancre='end', taille=15)
    S.ligne(R(-2.2, 1), R(3, 1), 'g', d=True)
    mk = dF <= 1.7
    S.poly(R(xs[mk & (xs < 0.5)], dF[mk & (xs < 0.5)]), 'b', l=1.8)
    S.poly(R(xs[mk & (xs > 0.5)], dF[mk & (xs > 0.5)]), 'b', l=1.8)
    S.poly(R(xs, dC), 'v', l=4.5)
    S.poly(R(xs, f), 'r', l=2.4)
    for xv, t_ in [(-1, '−1'), (0, '0'), (1, '1'), (2, '2')]:
        S.ligne(R(xv, -0.03), R(xv, 0.03), 'g')
        S.texte(R(xv, 0) + [0, 16], t_, 'g', taille=15)
    S.texte(R(0.5, 1) + [0, 14], 'f', 'r')
    S.texte(R(2.4, 1.6) + [-8, 0], 'd(x, F)', 'b', ancre='end', taille=15)
    S.texte(R(0.5, 1.5) + [0, -14], 'd(x, ℝ ∖ U)', 'v', taille=15)
    return S
