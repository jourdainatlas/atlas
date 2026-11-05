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
