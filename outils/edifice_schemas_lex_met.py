"""Schémas des exemples du lexique, théorie met (espaces métriques et normés) : contenu/exemples/met.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 16 ou 17
(mémo de l'édifice, § 111). Repères à échelle égale sur les deux axes ; positions calculées, et ce que dit la
légende vérifié par assert.
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte


def _repere(xmin, xmax, ymin, ymax, W, H, marge=28):
    """Repère à échelle égale, centré dans le cadre W × H."""
    k = min((W - 2 * marge) / (xmax - xmin), (H - 2 * marge) / (ymax - ymin))
    L, Hh = k * (xmax - xmin), k * (ymax - ymin)
    return Repere(xmin, xmax, ymin, ymax, (W - L) / 2, (H - Hh) / 2, L, Hh), k


def _carre(R, c, r):
    return R(np.array([c[0] - r, c[0] + r, c[0] + r, c[0] - r]), np.array([c[1] - r, c[1] - r, c[1] + r, c[1] + r]))


def _losange(R, c, r):
    return R(np.array([c[0] + r, c[0], c[0] - r, c[0]]), np.array([c[1], c[1] + r, c[1], c[1] - r]))


def _axes(S, R, xmin, xmax, ymin, ymax):
    S.ligne(R(xmin, 0), R(xmax, 0), 'g')
    S.ligne(R(0, ymin), R(0, ymax), 'g')


@schema('lex-boule-fermee-1')
def lex_boule_fermee_1():
    W, H = 420, 300
    R, k = _repere(-1.5, 1.5, -1.25, 1.25, W, H, 20)
    p = np.array([0.8, 0.6])
    assert abs(max(abs(p)) - 0.8) < 1e-12 and abs(np.hypot(*p) - 1) < 1e-12 and abs(sum(abs(p)) - 1.4) < 1e-12
    S = Schema(W, H, 'Boules fermées de rayon 1 de d∞, d₂ et d₁ dans le plan')
    _axes(S, R, -1.45, 1.45, -1.2, 1.2)
    S.poly(_carre(R, (0, 0), 1), 'b', ferme=True, rempli='b')
    t = np.linspace(0, 2 * np.pi, 241)
    S.poly(R(np.cos(t), np.sin(t)), 'r', ferme=True, rempli='r')
    S.poly(_losange(R, (0, 0), 1), 'v', ferme=True, rempli='v')
    S.point(R(*p), 't', r=4)
    S.texte(R(*p) + [14, -10], 'p', 't', ancre='start')
    S.texte(R(1, 0) + [10, 14], '1', 'g', ancre='start')
    return S


@schema('lex-boule-ouverte-2')
def lex_boule_ouverte_2():
    W, H = 420, 300
    R, k = _repere(-1.25, 1.25, -1.15, 1.15, W, H, 16)
    # inclusions vérifiées sur un échantillon dense, et sommets sur les contours
    P = np.random.default_rng(0).uniform(-1.2, 1.2, (100000, 2))
    dinf, d2, d1 = np.max(abs(P), 1), np.hypot(P[:, 0], P[:, 1]), np.sum(abs(P), 1)
    assert np.all(d1[dinf < .5] < 1) and np.all(d2[d1 < 1] < 1) and np.all(dinf[d2 < 1] < 1)
    assert abs(sum(abs(np.array([.5, .5]))) - 1) < 1e-12 and abs(np.hypot(1, 0) - 1) < 1e-12
    S = Schema(W, H, 'Boules ouvertes emboîtées de centre 0')
    _axes(S, R, -1.2, 1.2, -1.1, 1.1)
    S.poly(_carre(R, (0, 0), 1), 'b', ferme=True, rempli='b')
    t = np.linspace(0, 2 * np.pi, 241)
    S.poly(R(np.cos(t), np.sin(t)), 'r', ferme=True, rempli='r')
    S.poly(_losange(R, (0, 0), 1), 'v', ferme=True, rempli='v')
    S.poly(_carre(R, (0, 0), .5), 'b', d=True, ferme=True)
    for txt, pt, c in [('1', (1, 0), 'g'), ('½', (.5, 0), 'g')]:
        S.texte(R(*pt) + [7, 13], txt, c, ancre='start', taille=15)
    return S


@schema('lex-diametre-1')
def lex_diametre_1():
    W, H = 420, 260
    R, k = _repere(-0.35, 1.35, -0.2, 1.25, W, H, 18)
    C = np.array([[0, 0], [1, 0], [0, 1], [1, 1]])
    D = C[:, None] - C[None]
    assert np.max(np.max(abs(D), 2)) == 1 and abs(np.max(np.hypot(D[..., 0], D[..., 1])) - math.sqrt(2)) < 1e-12
    assert np.max(np.sum(abs(D), 2)) == 2
    S = Schema(W, H, 'Le carré [0, 1]² et ses trois diamètres')
    S.poly(_carre(R, (.5, .5), .5), 'g', ferme=True)
    S.poly(R(np.array([0, 1, 1]), np.array([0, 0, 1])), 'v', l=3)
    S.ligne(R(0, 0), R(1, 1), 'r', l=2.5)
    for q in C:
        S.point(R(*q), 't', r=3.6)
    S.texte(R(0, 0) + [-10, 16], '(0, 0)', 't', ancre='end', taille=16)
    S.texte(R(1, 1) + [10, -12], '(1, 1)', 't', ancre='start', taille=16)
    S.texte(R(.42, .58) + [-10, -6], '√2', 'r', ancre='end', taille=16)
    S.texte(R(.5, 0) + [0, 18], '1', 'v', taille=16)
    S.texte(R(1, .5) + [12, 0], '1', 'v', ancre='start', taille=16)
    return S


@schema('lex-normes-equivalentes-3')
def lex_normes_equivalentes_3():
    W, H = 420, 300
    R, k = _repere(-2.3, 2.3, -2.3, 2.3, W, H, 12)
    N = lambda v: max(abs(v[0]), abs(v[0] + v[1]))
    par = np.array([[1, 0], [1, -2], [-1, 0], [-1, 2]])
    assert all(abs(N(v) - 1) < 1e-12 for v in par)
    assert abs(N((.5, .5)) - 1) < 1e-12 and abs(N((-.5, -.5)) - 1) < 1e-12 and N((.5, -.5)) < 1
    assert max(abs(np.array([1, -2]))) == 2
    S = Schema(W, H, 'La boule unité de N entre deux boules de la norme infinie')
    S.poly(_carre(R, (0, 0), 2), 'b', d=True, ferme=True)
    S.poly(R(par[:, 0], par[:, 1]), 'r', ferme=True, rempli='r')
    S.poly(_carre(R, (0, 0), .5), 'b', ferme=True, rempli='b')
    # étiquettes dans le grand carré, hors du parallélogramme : à gauche de (1, −2), à droite de (−1, 2)
    S.texte(R(1, -2) + [5, -14], '(1, −2)', 'r', ancre='start', taille=14)
    S.texte(R(-1, 2) + [-5, 14], '(−1, 2)', 'r', ancre='end', taille=14)
    assert R(1, -2)[0] + 5 + largeur_texte('(1, −2)', 14) < R(2, 0)[0] - 3
    assert R(-1, 2)[0] - 5 - largeur_texte('(−1, 2)', 14) > R(-2, 0)[0] + 3
    return S


@schema('lex-norme-2')
def lex_norme_2():
    W, H = 420, 290
    R, k = _repere(-1.3, 1.3, -1.15, 1.15, W, H, 14)
    t = np.linspace(0, np.pi / 2, 121)
    q = np.stack([np.cos(t) ** 4, np.sin(t) ** 4], 1)
    assert np.allclose(np.sqrt(q[:, 0]) + np.sqrt(q[:, 1]), 1)
    assert np.all(q.sum(1) <= 1 + 1e-12)                                    # dans le losange
    bord = np.vstack([q, q[::-1] * [-1, 1], q * [-1, -1], q[::-1] * [1, -1]])
    m = np.array([.5, .5])
    assert (math.sqrt(.5) + math.sqrt(.5)) ** 2 > 1.99
    S = Schema(W, H, 'La partie N ≤ 1, non convexe')
    _axes(S, R, -1.25, 1.25, -1.1, 1.1)
    S.poly(_losange(R, (0, 0), 1), 'g', ferme=True)
    S.poly(R(bord[:, 0], bord[:, 1]), 'r', ferme=True, rempli='r')
    S.point(R(*m), 'b', r=4)
    S.texte(R(*m) + [12, -10], '(½, ½)', 'b', ancre='start', taille=15)
    S.texte(R(1, 0) + [8, 15], '(1, 0)', 't', ancre='start', taille=15)
    S.texte(R(0, 1) + [10, -6], '(0, 1)', 't', ancre='start', taille=15)
    return S


@schema('lex-contractante-2')
def lex_contractante_2():
    W, H = 420, 290
    R, k = _repere(-1.2, 4.2, -0.3, 4.4, W, H, 14)
    phi = lambda x: np.sqrt(1 + x ** 2)
    xs = np.linspace(-1.2, 4.1, 300)
    assert np.all(phi(xs) > xs)                                            # au-dessus de la diagonale
    it = [0.0]
    for _ in range(6):
        it.append(float(phi(it[-1])))
    assert all(abs(it[m] - math.sqrt(m)) < 1e-12 for m in range(7))       # x_m = √m, sans limite
    S = Schema(W, H, 'Le graphe de √(1 + x²) reste au-dessus de la diagonale')
    _axes(S, R, -1.2, 4.2, -0.3, 4.4)
    S.ligne(R(-0.3, -0.3), R(4.2, 4.2), 'g', d=True)
    S.poly(R(xs, phi(xs)), 'r', l=2.2)
    pts = [R(0, 0)]
    for m in range(6):
        pts.append(R(it[m], it[m + 1]))
        pts.append(R(it[m + 1], it[m + 1]))
    S.poly(np.array(pts), 'b')
    for m in range(5):
        S.point(R(it[m], 0), 'b', r=3)
    S.texte(R(0, 0) + [-10, -12], '0', 'g', ancre='end', taille=15)
    S.texte(R(4.0, phi(4.0)) + [-6, -14], 'φ', 'r', ancre='end')
    return S


@schema('lex-vecteurs-orthogonaux-1')
def lex_vecteurs_orthogonaux_1():
    W, H = 420, 280
    R, k = _repere(-1.6, 2.6, -0.4, 3.3, W, H, 14)
    x, y = np.array([2, 1]), np.array([-1, 2])
    assert x @ y == 0 and (x + y) @ (x + y) == x @ x + y @ y == 10
    S = Schema(W, H, 'Deux vecteurs orthogonaux et leur somme')
    o = R(0, 0)
    S.fleche(R(*x), R(*(x + y)), 'b', d=True)
    S.fleche(o, R(*(x + y)), 'v')
    S.fleche(o, R(*x), 'r')
    S.fleche(o, R(*y), 'b')
    # marque d'angle droit en 0, carré de côté 0,25 dans les directions de x et y
    ux, uy = x / np.linalg.norm(x) * .17, y / np.linalg.norm(y) * .17
    S.poly(np.array([R(*ux), R(*(ux + uy)), R(*uy)]), 't')
    S.texte(R(*x) + [14, 8], 'x', 'r', ancre='start')
    S.texte(R(*y) + [-12, -6], 'y', 'b', ancre='end')
    S.texte(R(*(x + y)) + [10, -8], 'x + y', 'v', ancre='start')
    S.texte(o + [-8, 14], '0', 't', ancre='end')
    return S


@schema('lex-partie-convexe-ev-2')
def lex_partie_convexe_ev_2():
    W, H = 420, 190
    R, k = _repere(-1.3, 4.3, -1.3, 1.3, W, H, 14)
    m = np.array([1.5, 0])
    assert max(abs(m - [0, 0])) > 1 and max(abs(m - [3, 0])) > 1
    S = Schema(W, H, 'Deux boules convexes dont la réunion ne l’est pas')
    for c in ((0, 0), (3, 0)):
        S.poly(_carre(R, c, 1), 'b', ferme=True, rempli='b')
        S.point(R(*c), 't', r=3.4)
    S.ligne(R(0, 0), R(3, 0), 'g')
    S.point(R(*m), 'r', r=4.2)
    S.texte(R(*m) + [0, -16], '(3/2, 0)', 'r', taille=15)
    S.texte(R(0, 0) + [0, 18], '(0, 0)', 't', taille=15)
    S.texte(R(3, 0) + [0, 18], '(3, 0)', 't', taille=15)
    return S


@schema('lex-distance-induite-2')
def lex_distance_induite_2():
    W, H = 420, 280
    R, k = _repere(-1.35, 1.35, -1.2, 1.2, W, H, 12)
    x, y = np.array([1.0, 0]), np.array([-1.0, 0])
    th = math.radians(62)
    z = np.array([math.cos(th), math.sin(th)])
    assert abs(np.sum((z - x) ** 2) + np.sum((z - y) ** 2) - 4) < 1e-12
    S = Schema(W, H, 'Le cercle unité et la distance induite par d₂')
    t = np.linspace(0, 2 * np.pi, 241)
    S.poly(R(np.cos(t), np.sin(t)), 't', ferme=True)
    S.ligne(R(*x), R(*y), 'g', d=True)
    S.ligne(R(*x), R(*z), 'r', l=2.2)
    S.ligne(R(*z), R(*y), 'r', l=2.2)
    for q, nm, dx in ((x, 'x', 14), (y, 'y', -14), (z, 'z', 0)):
        S.point(R(*q), 't', r=3.8)
        S.texte(R(*q) + ([dx, 0] if nm != 'z' else [0, -16]), nm, 't', ancre='start' if dx > 0 else ('end' if dx < 0 else 'middle'))
    S.point(R(0, 0), 'g', r=4, creux=True)
    S.texte(R(0, 0) + [0, 18], '0', 'g')
    return S


@schema('lex-distance-induite-3')
def lex_distance_induite_3():
    W, H = 420, 250
    R, k = _repere(-0.5, 1.5, -0.68, 1.05, W, H, 10)
    p, q, s = np.array([0, 0]), np.array([1, 0]), np.array([.5, math.sqrt(3) / 2])
    m = (p + q) / 2
    r = 0.6
    assert np.linalg.norm(p - m) < r and np.linalg.norm(q - m) < r and np.linalg.norm(s - m) > r
    S = Schema(W, H, 'Une boule centrée hors de A coupe A selon {p, q}')
    t = np.linspace(0, 2 * np.pi, 241)
    S.poly(R(m[0] + r * np.cos(t), m[1] + r * np.sin(t)), 'r', ferme=True, rempli='r')
    S.poly(np.array([R(*p), R(*q), R(*s)]), 'g', ferme=True, d=True)
    for v, nm, off in ((p, 'p', [-28, 0]), (q, 'q', [28, 0]), (s, 's', [0, -16])):
        S.point(R(*v), 't', r=3.8)
        S.texte(R(*v) + off, nm, 't', ancre='end' if off[0] < 0 else ('start' if off[0] > 0 else 'middle'))
    S.point(R(*m), 'r', r=3)
    S.texte(R(*m) + [0, 16], 'm', 'r')
    return S


def _segment01(S, x0, x1, y):
    S.ligne((x0, y), (x1, y), 'g', l=4)


@schema('lex-epsilon-reseau-1')
def lex_epsilon_reseau_1():
    W, H = 420, 180
    x0, x1 = 60, 360
    X = lambda t: x0 + (x1 - x0) * t
    cs, e = [1 / 6, 1 / 2, 5 / 6], 1 / 4
    grille = np.linspace(0, 1, 2001)
    assert all(any(abs(g - c) < e for c in cs) for g in grille)
    ys = [70, 52, 70]
    S = Schema(W, H, 'Trois boules de rayon 1/4 recouvrent [0, 1]')
    yseg = 112
    _segment01(S, X(0), X(1), yseg)
    for c, yb in zip(cs, ys):
        a, b = X(max(c - e, -0.12)), X(c + e)
        S.rect(X(c - e), yb - 9, X(c + e) - X(c - e), 18, 'b', rempli='b', rx=9)
        S.ligne((X(c), yb + 9), (X(c), yseg), 'g', d=True)
        S.point((X(c), yseg), 'r', r=4)
    assert X(cs[0] - e) > 4 and X(cs[2] + e) < W - 4
    for t, txt in ((0, '0'), (1, '1')):
        S.ligne((X(t), yseg - 6), (X(t), yseg + 6), 'g')
        S.texte((X(t), yseg + 22), txt, 'g', taille=16)
    for c, txt in zip(cs, ('1/6', '1/2', '5/6')):
        S.texte((X(c), yseg + 22), txt, 'r', taille=16)
    return S


@schema('lex-nombre-lebesgue-1')
def lex_nombre_lebesgue_1():
    W, H = 420, 170
    x0, x1 = 50, 370
    X = lambda t: x0 + (x1 - x0) * t
    yseg = 100
    # [1/3, 2/3] ⊄ U1 = [0, 2/3[ et ⊄ U2 = ]1/3, 1]
    assert not (2 / 3 < 2 / 3) and not (1 / 3 > 1 / 3)
    S = Schema(W, H, 'Le recouvrement de [0, 1] par [0, 2/3[ et ]1/3, 1]')
    S.rect(X(0), 34, X(2 / 3) - X(0), 16, 'b', rempli='b', rx=4)
    S.rect(X(1 / 3), 58, X(1) - X(1 / 3), 16, 'v', rempli='v', rx=4)
    S.point((X(2 / 3), 42), 'b', r=4, creux=True)
    S.point((X(1 / 3), 66), 'v', r=4, creux=True)
    _segment01(S, X(0), X(1), yseg)
    S.ligne((X(1 / 3), yseg), (X(2 / 3), yseg), 'r', l=5)
    S.point((X(1 / 3), yseg), 'r', r=5)
    S.point((X(2 / 3), yseg), 'r', r=5)
    for t, txt, c in ((0, '0', 'g'), (1 / 3, '1/3', 'r'), (2 / 3, '2/3', 'r'), (1, '1', 'g')):
        S.texte((X(t), yseg + 24), txt, c, taille=16)
    S.texte((X(0) - 10, 42), 'U_1', 'b', ancre='end', taille=16)
    S.texte((X(1) + 10, 66), 'U_2', 'v', ancre='start', taille=16)
    return S


# ---------------------------------------------------------------- termes venus du chapitre met-euclidien (27 nov. 2026)
# Schémas déplacés avec leurs termes (famille orthonormée, projection orthogonale, distance à une partie : anf ;
# groupe orthogonal : lie ; même orientation : geod ; déplacement du plan : edo). Les auxiliaires de dessin restent
# dans leurs modules d'origine et sont importés ici sous un autre nom.
from fractions import Fraction as Fr
from edifice_schemas_lex_anf import _repere as _repere_anf, _marche, _rademacher
from edifice_schemas_lex_lie import _etiq as _etiq_lie, _aire
from edifice_schemas_lex_geod import _etiq as _etiq_geod
from edifice_schemas_lex_edo import _repere_egal, _axes as _axes_edo, _param, _fleche_sur
PI = math.pi
W = 420


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
    R = _repere_anf(-1.6, 1.6, -1.6, 1.6, 400, 274, 10, 8, egal=True)
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


@schema('lex-projection-orthogonale-2')
def lex_projection_orthogonale_2():
    xs = np.linspace(0, 1, 20001)
    e = xs ** 2 - xs + 1 / 6
    assert abs(np.trapezoid(e, xs)) < 1e-9 and abs(np.trapezoid(e * xs, xs)) < 1e-9     # écart ⊥ 1 et ⊥ x
    r = np.roots([1, -1, 1 / 6])
    assert np.allclose(sorted(r), [0.5 - math.sqrt(1 / 12), 0.5 + math.sqrt(1 / 12)])     # symétriques / 1/2
    H = 280
    S = Schema(W, H, 'La parabole x² et sa projection x − 1/6 sur les fonctions affines')
    R = _repere_anf(-0.08, 1.12, -0.25, 1.05, 380, 250, 24, 12, egal=True)
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
    R = _repere_anf(-2.2, 3, -0.15, 1.75, 366, 236, 44, 12)
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


@schema('lex-groupe-orthogonal-1')
def lex_groupe_orthogonal_1():
    t = math.pi / 3
    R = np.array([[math.cos(t), -math.sin(t)], [math.sin(t), math.cos(t)]])
    phi = math.pi / 6
    Sm = np.array([[math.cos(2 * phi), math.sin(2 * phi)], [math.sin(2 * phi), -math.cos(2 * phi)]])
    for M in (R, Sm):
        assert np.allclose(M.T @ M, np.eye(2))
    assert abs(np.linalg.det(R) - 1) < 1e-12 and abs(np.linalg.det(Sm) + 1) < 1e-12
    axe = np.array([math.cos(phi), math.sin(phi)])
    assert np.allclose(Sm @ axe, axe)                               # l'axe de S est la droite d'angle π/6
    P = np.array([[0.5, -0.55], [1.0, -0.55], [0.5, -0.2]])
    PR, PS = P @ R.T, P @ Sm.T
    assert _aire(P) > 0 and _aire(PR) > 0 and _aire(PS) < 0        # légende : sens conservé, puis inversé
    Hh = 290
    S = Schema(W, Hh, 'Un triangle et ses images par une rotation et par une symétrie')
    k = 270 / 2.12
    Rp = Repere(-0.62, 1.28, -0.78, 1.34, (W - 1.9 * k) / 2, 10, 1.9 * k, 2.12 * k)
    # même échelle sur les deux axes
    ex = Rp.L / (Rp.xmax - Rp.xmin)
    ey = Rp.H / (Rp.ymax - Rp.ymin)
    assert abs(ex - ey) < 1e-9, (ex, ey)
    S.ligne(Rp(-0.62, 0), Rp(1.25, 0), 'g')
    S.ligne(Rp(0, -0.75), Rp(0, 1.2), 'g')
    d0, d1 = -0.55, 1.35
    S.ligne(Rp(*(d0 * axe)), Rp(*(d1 * axe)), 'g', d=True)
    S.point(Rp(0, 0), 'g', r=3)
    for Q, c in ((P, 'g'), (PR, 'b'), (PS, 'v')):
        S.poly(Rp(Q[:, 0], Q[:, 1]), c, ferme=True, rempli=c if c != 'g' else None, l=2.2)
        g = Q.mean(axis=0)
        for k, v in enumerate(Q):
            u = v - g
            u = u / np.linalg.norm(u)
            q = Rp(*v) + 15 * np.array([u[0], -u[1]])
            _etiq_lie(S, q, str(k + 1), c, taille=17)
    # noms des matrices près des images
    gR, gS = PR.mean(axis=0), PS.mean(axis=0)
    _etiq_lie(S, Rp(*gR) + [62, 6], 'R', 'b')
    _etiq_lie(S, Rp(*gS) + [-58, 4], 'S', 'v')
    assert Rp(1.28, 0)[0] <= W - 2 and Rp(0, -0.78)[1] <= Hh - 2
    return S


@schema('lex-meme-orientation-1')
def lex_meme_orientation_1():
    S = Schema(W, 260, 'Deux bases qui partagent leur premier vecteur')
    ech = 82
    R = Repere(-1.55, 1.85, -1.35, 1.45, (W - 3.4 * ech) / 2, 10, 3.4 * ech, 2.8 * ech)
    O = R(0, 0)
    u, v, w = (1, 1), (-1, 1), (1, -1)
    assert u[0] * v[1] - u[1] * v[0] == 2 and u[0] * w[1] - u[1] * w[0] == -2
    S.fleche(O, R(1, 0), 'g', l=1.6)
    S.fleche(O, R(0, 1), 'g', l=1.6)
    S.fleche(O, R(*u), 't', l=2.2)
    S.fleche(O, R(*v), 'b', l=2.2)
    S.fleche(O, R(*w), 'r', l=2.2)
    _etiq_geod(S, R(1, 0) + [6, 12], 'e_1', 'g', ancre='start', taille=15)
    _etiq_geod(S, R(0, 1) + [-8, -8], 'e_2', 'g', ancre='end', taille=15)
    _etiq_geod(S, R(*u) + [10, -4], 'u', 't', ancre='start')
    _etiq_geod(S, R(*v) + [-10, -4], 'v', 'b', ancre='end')
    _etiq_geod(S, R(*w) + [10, 4], 'w', 'r', ancre='start')
    # arcs fléchés de u vers v (sens de e₁ vers e₂) et de u vers w (sens contraire), rayon 0,55
    rr = 0.55
    for c, a0, a1 in [('b', PI / 4, 3 * PI / 4), ('r', PI / 4, -PI / 4)]:
        ts = np.linspace(a0, a1, 40)
        pts = R(rr * np.cos(ts), rr * np.sin(ts))
        S.courbe_fleche(pts, c)
    ts = np.linspace(0.12, PI / 2 - 0.12, 30)
    S.courbe_fleche(R(0.32 * np.cos(ts), 0.32 * np.sin(ts)), 'g')
    return S


@schema('lex-deplacement-plan-2')
def lex_deplacement_plan_2():
    arc = [(q, q * q / 2) for q in np.linspace(0, 1.6, 120)]
    kap = lambda P: [((P[i + 1][0] - P[i - 1][0]) * (P[i + 1][1] - 2 * P[i][1] + P[i - 1][1]) -
                      (P[i + 1][1] - P[i - 1][1]) * (P[i + 1][0] - 2 * P[i][0] + P[i - 1][0])) for i in range(1, len(P) - 1)]
    phi = PI / 3; c = np.array([2.9, -0.45])
    Rm = np.array([[math.cos(phi), -math.sin(phi)], [math.sin(phi), math.cos(phi)]])
    bleu = [tuple(Rm @ np.array(p) + c) for p in arc]
    vert = [(p[0], -p[1]) for p in arc]
    assert all(k_ > 0 for k_ in kap(arc)) and all(k_ > 0 for k_ in kap(bleu)) and all(k_ < 0 for k_ in kap(vert))
    R, ech = _repere_egal(-0.3, 3.4, -1.45, 1.8, H=270)
    S = Schema(W, 270, 'Une parabole, son image par un déplacement et par une symétrie')
    _axes_edo(S, R, '', '')
    for P, col in ((arc, 'r'), (bleu, 'b'), (vert, 'v')):
        _param(S, R, P, col, l=2.4)
        _fleche_sur(S, R, P[-6], P[-1], col)
    return S
