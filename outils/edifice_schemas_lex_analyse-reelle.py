"""Schémas des exemples du lexique, théorie analyse-reelle : contenu/exemples/analyse-reelle.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur conseillée pour le panneau du lexique : 400 à 440,
étiquettes de 17 (mémo de l'édifice, § 111). Positions calculées, et ce que la figure affirme vérifié par assert.
"""
from fractions import Fraction as Fr
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte


@schema('lex-partie-convexe-2')
def lex_partie_convexe_2():
    # A = {(x, y) : xy = 0}, réunion des deux axes ; calculs exacts sur des rationnels.
    dans = lambda p: p[0] * p[1] == 0
    a, b = (Fr(1), Fr(0)), (Fr(0), Fr(1))
    m = tuple((u + v) / 2 for u, v in zip(a, b))
    assert dans(a) and dans(b) and m == (Fr(1, 2), Fr(1, 2)) and not dans(m)   # le milieu sort de A
    # segment [a, b] : seules ses extrémités sont dans A (xy = t(1 − t) ≠ 0 pour 0 < t < 1)
    ts = [Fr(k, 20) for k in range(21)]
    assert [t for t in ts if dans(((1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]))] == [0, 1]
    # étoilée en l'origine : t·p reste dans A pour p dans A et t dans [0, 1]
    pts = [(Fr(x), Fr(0)) for x in (-3, -1, 2)] + [(Fr(0), Fr(y)) for y in (-2, 1, 3)]
    assert all(dans((t * p[0], t * p[1])) for p in pts for t in ts)
    # issus de (1, 0), les segments vers les points de l'autre axe quittent A : pas étoilée en (1, 0)
    assert not dans(((1 - Fr(1, 2)) * a[0], Fr(1, 2) * b[1]))

    W, H = 420, 290
    # même échelle sur les deux axes (le segment de (1, 0) à (0, 1) est à 45°)
    hy = 254; ech = hy / (1.45 - (-1.0)); lx = round(ech * (1.75 - (-1.55)))
    R = Repere(-1.55, 1.75, -1.0, 1.45, (W - lx) // 2, 18, lx, hy)
    assert abs(lx / 3.3 - hy / 2.45) < 0.2 and lx <= W - 20
    S = Schema(W, H, 'La réunion des deux axes : étoilée par rapport à l’origine, non convexe')
    # deux segments issus de l'origine, en bleu large sous le rouge : ils restent dans A
    for p in [(-1.2, 0.0), (0.0, -0.75)]:
        S.ligne(R(0, 0), R(*p), 'b', l=7)
    # la partie A, en rouge (objet étudié), prolongée jusqu'au bord du repère, par-dessus
    S.ligne(R(-1.55, 0), R(1.75, 0), 'r')
    S.ligne(R(0, -1.0), R(0, 1.45), 'r')
    # segment [a, b], en pointillé : il sort de A
    S.ligne(R(*map(float, a)), R(*map(float, b)), 'g', d=True)
    for p in [(-1.2, 0.0), (0.0, -0.75)]:
        S.point(R(*p), 'b')
    S.point(R(*map(float, a)), 't')
    S.point(R(*map(float, b)), 't')
    S.point(R(*map(float, m)), 'r', r=4, creux=True)
    S.point(R(0, 0), 't')
    taille = 16
    S.texte(R(1, 0) + [0, 18], '(1, 0)', taille=taille)
    S.texte(R(0, 1) + [-10, 0], '(0, 1)', ancre='end', taille=taille)
    lm = '(1/2, 1/2)'
    pm = R(0.5, 0.5) + [10, -12]
    assert pm[0] + largeur_texte(lm, taille) < W                     # l'étiquette du milieu tient dans le cadre
    S.texte(pm, lm, 'r', ancre='start', taille=taille)
    S.texte(R(0, 0) + [-10, 16], '0', ancre='end', taille=taille)
    return S


# ---------------------------------------------------------------------------------------------- auxiliaires
import math
import sympy as sp

W0 = 420          # largeur commune des schémas du lot
TL = 16           # taille des étiquettes


def _axe_n(S, R, n0, n1, y, etiquettes=(), c='g'):
    """Axe des indices à la hauteur y (coordonnées de la suite), graduations entières de n0 à n1."""
    S.fleche(R(n0 - 0.6, y), R(n1 + 0.8, y), c)
    S.texte(R(n1 + 0.8, y) + [8, 0], 'n', c, ancre='start', taille=15)
    for m in range(n0, n1 + 1):
        S.ligne(R(m, y) + [0, -3], R(m, y) + [0, 3], c)
    for m in etiquettes:
        S.texte(R(m, y) + [0, 15], str(m), c, taille=13)


def _droite_reelle(S, X, y, a, b, graduations=(), etiquettes=None, c='g', taille=14):
    """Droite réelle horizontale (X : réel -> abscisse de l'image), de a à b, à l'ordonnée y."""
    S.fleche((X(a), y), (X(b) + 10, y), c)
    for g in graduations:
        S.ligne((X(g), y - 4), (X(g), y + 4), c)
    for g, lab in (etiquettes or {}).items():
        S.texte((X(g), y + 17), lab, c, taille=taille)


def _dans_cadre(S, p, s, taille=TL, ancre='middle', marge=2):
    """Vérifie qu'une étiquette tient dans le cadre (largeur calculée sur les polices KaTeX)."""
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


# ---------------------------------------------------------------------------------------------- paquet 1

@schema('lex-inegalite-triangulaire-1')
def lex_inegalite_triangulaire_1():
    xv, yv = 3, -5
    s = xv + yv
    assert abs(s) == 2 and abs(xv) + abs(yv) == 8 and abs(s) < abs(xv) + abs(yv)
    S = Schema(W0, 180, 'Inégalité triangulaire : le trajet de 0 à x puis à x + y est plus long que |x + y|')
    a, b = -6, 4.5
    X = lambda v: 30 + (v - a) / (b - a) * (W0 - 70)
    y0 = 120
    _droite_reelle(S, X, y0, a, b, range(-6, 5), {v: str(v).replace('-', '−') for v in (-5, 0, 3)})
    h1, h2 = 80, 44
    S.fleche((X(0), h1), (X(xv), h1), 'b')
    S.texte(((X(0) + X(xv)) / 2, h1 - 14), 'x = 3', 'b', taille=TL)
    S.fleche((X(xv), h2), (X(s), h2), 'v')
    S.texte(((X(xv) + X(s)) / 2, h2 - 15), 'y = −5', 'v', taille=TL)
    for v, hh in [(0, h1), (xv, h2), (s, h2)]:
        S.ligne((X(v), hh), (X(v), y0), 'g', d=True)
    S.point((X(0), y0), 't')
    S.point((X(s), y0), 'r', r=4.2)
    S.texte((X(s), y0 + 17), '−2', 'r', taille=14)
    S.ligne((X(s), y0 + 34), (X(0), y0 + 34), 'r', l=2.4)
    S.texte(((X(s) + X(0)) / 2, y0 + 48), '|x + y| = 2', 'r', taille=TL)
    _dans_cadre(S, ((X(s) + X(0)) / 2, y0 + 48), '|x + y| = 2')
    return S


@schema('lex-espace-metrique-2')
def lex_espace_metrique_2():
    # carrés {d1 = 1} et {dinf = 1}, vérifiés sur leurs sommets et sur des points de leurs côtés
    d1 = lambda p: abs(p[0]) + abs(p[1])
    dm = lambda p: max(abs(p[0]), abs(p[1]))
    los = [(1, 0), (0, 1), (-1, 0), (0, -1)]
    car = [(1, 1), (-1, 1), (-1, -1), (1, -1)]
    assert all(d1(p) == 1 for p in los) and all(dm(p) == 1 for p in car)
    for cyc, dist in [(los, d1), (car, dm)]:
        for (p, q) in zip(cyc, cyc[1:] + cyc[:1]):
            assert all(dist(((1 - s) * p[0] + s * q[0], (1 - s) * p[1] + s * q[1])) == 1
                       for s in (Fr(1, 3), Fr(1, 2), Fr(4, 5)))
    assert d1((1, 1)) == 2 and dm((1, 1)) == 1
    W, H = W0, 290
    hy = 240
    R = Repere(-1.6, 1.6, -1.6, 1.6, (W - hy) // 2, 32, hy, hy)
    S = Schema(W, H, 'Points à distance 1 de l’origine pour deux distances de ℝ²')
    R.axes(S, 'x', 'y')
    S.poly([R(*p) for p in car], 'b', ferme=True, rempli='b')
    S.poly([R(*p) for p in los], 'r', ferme=True, rempli='r', l=2.2)
    S.point(R(1, 1), 'b', r=4)
    S.texte(R(1, 1) + [10, -12], '(1, 1)', 'b', ancre='start', taille=TL)
    S.texte(R(1, 0) + [6, 14], '1', 'g', ancre='start', taille=14)
    S.texte(R(0, 1) + [10, -14], 'd_1 = 1', 'r', ancre='start', taille=TL)
    S.texte(R(-1, -1) + [-8, 16], 'd_∞ = 1', 'b', ancre='end', taille=TL)
    _dans_cadre(S, R(-1, -1) + [-8, 16], 'd_∞ = 1', ancre='end')
    return S


@schema('lex-suites-adjacentes-1')
def lex_suites_adjacentes_1():
    a, b = Fr(2), Fr(1)
    A, B = [a], [b]
    for _ in range(4):
        a, b = (a + b) / 2, 2 * a * b / (a + b)
        A.append(a); B.append(b)
    assert A[:3] == [2, Fr(3, 2), Fr(17, 12)] and B[:3] == [1, Fr(4, 3), Fr(24, 17)]
    assert A[2] - B[2] == Fr(1, 204)
    assert all(B[j] <= B[j + 1] <= A[j + 1] <= A[j] for j in range(4)) and all(A[j] * B[j] == 2 for j in range(5))
    l = math.sqrt(2)                       # pour placer le point seulement
    assert all(B[j] < l < A[j] for j in range(5))
    S = Schema(W0, 230, 'Moyennes arithmétique et harmonique : segments emboîtés autour de la limite')
    a0, b0 = 0.85, 2.1
    X = lambda v: 70 + (float(v) - a0) / (b0 - a0) * (W0 - 100)
    ys = [44, 94, 144]
    for j, yy in enumerate(ys):
        S.ligne((X(B[j]), yy), (X(A[j]), yy), 't', l=2.2)
        S.point((X(B[j]), yy), 'b', r=4)
        S.point((X(A[j]), yy), 'v', r=4)
        S.texte((X(a0) - 4, yy), f'n = {j}', 'g', ancre='end', taille=14)
    S.texte((X(B[0]), ys[0] - 17), '1', 'b', taille=TL)
    S.texte((X(A[0]), ys[0] - 17), '2', 'v', taille=TL)
    S.texte((X(B[1]), ys[1] - 17), '4/3', 'b', taille=TL)
    S.texte((X(A[1]), ys[1] - 17), '3/2', 'v', taille=TL)
    gb, gv = X(B[2]) - 8, X(A[2]) + 8
    S.texte((gb, ys[2] - 17), '24/17', 'b', ancre='end', taille=TL)
    S.texte((gv, ys[2] - 17), '17/12', 'v', ancre='start', taille=TL)
    assert gb < gv
    yl = 196
    _droite_reelle(S, X, yl, a0, b0 - 0.05, [1, 1.5, 2], {1: '1', 2: '2'})
    S.ligne((X(l), ys[0] + 8), (X(l), yl), 'r', d=True)
    S.point((X(l), yl), 'r', r=4.2)
    S.texte((X(l) + 8, yl + 17), 'ℓ', 'r', ancre='start', taille=17)
    return S


@schema('lex-suite-extraite-2')
def lex_suite_extraite_2():
    u = lambda m: Fr(m) if m % 2 == 0 else Fr(1, m)
    n1 = 12
    assert all(u(2 * j) == 2 * j for j in range(7)) and all(0 < u(2 * j + 1) <= 1 for j in range(6))
    S = Schema(W0, 260, 'Termes pairs vers +∞, termes impairs vers 0')
    R = Repere(-0.8, n1 + 1.4, -0.8, 12.6, 40, 14, W0 - 80, 220)
    _axe_n(S, R, 0, n1, 0, [0, 4, 8, 12])
    S.fleche(R(-0.6, -0.6), R(-0.6, 12.6), 'g')
    for v in (4, 8, 12):
        S.ligne(R(-0.6, v) + [-3, 0], R(-0.6, v) + [3, 0], 'g')
        S.texte(R(-0.6, v) + [-8, 0], str(v), 'g', ancre='end', taille=13)
    for m in range(n1 + 1):
        S.point(R(m, float(u(m))), 'r' if m % 2 == 0 else 'b', r=3.8)
    S.texte(R(8, 8) + [-14, -12], 'u_{2k} = 2k', 'r', ancre='end', taille=TL)
    S.texte(R(7, 1) + [0, -18], 'u_{2k+1} = 1/(2k+1)', 'b', taille=TL)
    _dans_cadre(S, R(7, 1) + [0, -18], 'u_{2k+1} = 1/(2k+1)')
    return S


@schema('lex-suite-monotone-1')
def lex_suite_monotone_1():
    u = lambda m: Fr(m * m, 2 ** m)
    n1 = 12
    assert all((u(m + 1) <= u(m)) == (m >= 3) for m in range(60)) and all(u(m) >= 0 for m in range(60))
    assert u(3) == Fr(9, 8) == max(u(m) for m in range(60))
    assert u(0) < u(1) < u(2) and all(u(m + 1) < u(m) for m in range(3, 60))   # bleus u_0..u_2 croissants, rouges dès u_3
    S = Schema(W0, 230, 'Une suite décroissante à partir du rang 3')
    R = Repere(-0.8, n1 + 1.4, -0.12, 1.25, 52, 14, W0 - 92, 190)
    _axe_n(S, R, 0, n1, 0, [0, 3, 6, 9, 12])
    S.fleche(R(-0.6, -0.05), R(-0.6, 1.25), 'g')
    for v in (1, 9 / 8):
        S.ligne(R(-0.6, v) + [-3, 0], R(-0.6, v) + [3, 0], 'g')
    S.texte(R(-0.6, 1) + [-8, 5], '1', 'g', ancre='end', taille=13)
    S.ligne(R(-0.6, 9 / 8), R(3, 9 / 8), 'g', d=True)
    S.texte(R(-0.6, 9 / 8) + [-8, -5], '9/8', 'g', ancre='end', taille=13)
    S.ligne(R(3, 0), R(3, 9 / 8), 'r', d=True)
    for m in range(n1 + 1):
        S.point(R(m, float(u(m))), 'b' if m < 3 else 'r', r=3.8)
    S.texte(R(3, 9 / 8) + [10, -10], 'u_3', 'r', ancre='start', taille=TL)
    p = R(7, float(u(7))) + [0, -30]
    S.texte(p, 'u_n = n²/2^n', 'r', ancre='start', taille=TL)
    _dans_cadre(S, p, 'u_n = n²/2n', ancre='start')
    return S


@schema('lex-suite-bornee-1')
def lex_suite_bornee_1():
    u = lambda m: (-1) ** m * Fr(m, m + 1)
    n1 = 16
    assert all(-1 < u(m) < 1 for m in range(3000))
    assert all(u(2 * j) >= 0 and u(2 * j + 1) < 0 for j in range(1000))
    S = Schema(W0, 240, 'Une suite bornée et divergente')
    R = Repere(-0.8, n1 + 1.4, -1.25, 1.25, 46, 14, W0 - 86, 200)
    S.rect(*R(-0.6, 1), float(R(n1 + 0.5, 0)[0] - R(-0.6, 0)[0]), float(R(0, -1)[1] - R(0, 1)[1]), 'g', rempli='g')
    for v in (1, -1):
        S.ligne(R(-0.6, v), R(n1 + 0.5, v), 'g', d=True)
    S.texte(R(-0.6, 1) + [-8, 0], '1', 'g', ancre='end', taille=14)
    S.texte(R(-0.6, -1) + [-8, 0], '−1', 'g', ancre='end', taille=14)
    _axe_n(S, R, 0, n1, 0, [4, 8, 12, 16])
    for m in range(n1 + 1):
        S.point(R(m, float(u(m))), 'r' if m % 2 == 0 else 'b', r=3.8)
    return S


@schema('lex-a-partir-certain-rang-2')
def lex_a_partir_certain_rang_2():
    P = lambda m: m * m > 10 * m + 100
    assert [m for m in range(60) if not P(m)] == list(range(17))
    n1 = 24
    S = Schema(W0, 170, 'Vraie à partir d’un certain rang, ou seulement pour une infinité d’entiers')
    x0 = 24
    pas = (W0 - 2 * x0) / n1
    X = lambda m: x0 + m * pas
    lignes = [(54, P, 'r', 'n² > 10n + 100'), (116, lambda m: m % 2 == 0, 'b', 'n `pair`')]
    for yy, Q, c, lab in lignes:
        S.texte((x0 - 6, yy - 24), lab, c, ancre='start', taille=TL)
        for m in range(n1 + 1):
            if Q(m):
                S.point((X(m), yy), c, r=4)
            else:
                S.point((X(m), yy), 'g', r=3.2, creux=True)
    for m in (0, 8, 17, 24):
        S.texte((X(m), 146), str(m), 'g', taille=13)
    S.ligne((X(17) - pas / 2, 40), (X(17) - pas / 2, 130), 'r', d=True)
    return S


@schema('lex-convergence-simple-2')
def lex_convergence_simple_2():
    for x0, N in [(Fr(1, 2), 4), (Fr(9, 10), 22)]:
        r = next(m for m in range(1, 200) if all(x0 ** j < Fr(1, 10) for j in range(m, 400)))
        assert r == N
    W, H = W0, 280
    R = Repere(-0.08, 1.18, -0.1, 1.15, 40, 12, 330, 240)
    S = Schema(W, H, 'Les fonctions x ↦ xⁿ sur [0, 1] et leur limite simple')
    S.fleche(R(-0.05, 0), R(1.15, 0), 'g')
    S.fleche(R(0, -0.05), R(0, 1.13), 'g')
    S.texte(R(1.15, 0) + [10, 0], 'x', 'g', ancre='start', taille=15)
    S.texte(R(1, 0) + [0, 16], '1', 'g', taille=13)
    S.texte(R(0, 1) + [-8, 0], '1', 'g', ancre='end', taille=13)
    S.texte(R(0, 0) + [-8, 13], '0', 'g', ancre='end', taille=13)
    S.ligne(R(1, 0), R(1, 1), 'g', d=True)
    for e in (1, 2, 4, 8, 16, 32):
        xs = np.linspace(0, 1, 300)
        S.poly(R(xs, xs ** e), 't', l=1.1)
    S.texte(R(0.55, 0.55) + [-8, -10], 'n = 1', 't', ancre='end', taille=14)
    S.ligne(R(0, 0), R(1, 0) - [4, 0], 'r', l=2.6)
    S.point(R(1, 0), 'r', r=4, creux=True)
    S.point(R(1, 1), 'r', r=4.2)
    S.texte(R(1, 1) + [10, 0], 'f(1) = 1', 'r', ancre='start', taille=TL)
    _dans_cadre(S, R(1, 1) + [10, 0], 'f(1) = 1', ancre='start')
    return S


@schema('lex-segments-emboites-1')
def lex_segments_emboites_1():
    segs = [(-Fr(1, m + 1), 1 + Fr(1, m + 1)) for m in range(5)]
    assert all(segs[j + 1][0] >= segs[j][0] and segs[j + 1][1] <= segs[j][1] for j in range(4))
    assert all(s[0] <= 0 and s[1] >= 1 for s in segs)
    S = Schema(W0, 250, 'Segments emboîtés dont l’intersection est un segment')
    a0, b0 = -1.15, 2.15
    X = lambda v: 60 + (float(v) - a0) / (b0 - a0) * (W0 - 100)
    for j, (u, v) in enumerate(segs):
        yy = 30 + 30 * j
        S.ligne((X(u), yy), (X(v), yy), 't', l=2)
        S.ligne((X(u), yy - 5), (X(u), yy + 5), 't')
        S.ligne((X(v), yy - 5), (X(v), yy + 5), 't')
        S.texte((X(a0) - 4, yy), f'n = {j}', 'g', ancre='end', taille=13)
    yl = 205
    _droite_reelle(S, X, yl, a0, b0 - 0.05, [-1, 0, 1, 2], {-1: '−1', 0: '0', 1: '1', 2: '2'})
    S.ligne((X(0), yl), (X(1), yl), 'r', l=4)
    for v in (0, 1):
        S.ligne((X(v), 22), (X(v), yl), 'r', d=True)
    return S


# ---------------------------------------------------------------------------------------------- paquet 2

def _axes_xy(S, R, x0, x1, y0, y1, nx='x', ny='y', origine=(0, 0)):
    """Axes gris, flèches au bout, sans graduation."""
    ox, oy = origine
    S.fleche(R(x0, oy), R(x1, oy), 'g')
    S.texte(R(x1, oy) + [10, 0], nx, 'g', ancre='start', taille=15)
    S.fleche(R(ox, y0), R(ox, y1), 'g')
    S.texte(R(ox, y1) + [0, -12], ny, 'g', taille=15)


def _grad_x(S, R, v, lab, y=0, dy=16, taille=13, c='g'):
    S.ligne(R(v, y) + [0, -3], R(v, y) + [0, 3], 'g')
    S.texte(R(v, y) + [0, dy], lab, c, taille=taille)


def _grad_y(S, R, v, lab, x=0, dx=-8, taille=13, c='g'):
    S.ligne(R(x, v) + [-3, 0], R(x, v) + [3, 0], 'g')
    S.texte(R(x, v) + [dx, 0], lab, c, ancre='end', taille=taille)


@schema('lex-continuite-point-1')
def lex_continuite_point_1():
    eps = Fr(1, 2)
    cas = []
    for a, c in [(Fr(1, 2), 'r'), (Fr(1), 'b')]:
        fa = 1 / a
        # plus grand δ : 1/x reste dans ]f(a) - ε, f(a) + ε[ pour |x - a| < δ
        dg = a - 1 / (fa + eps)              # bord gauche : 1/x < f(a) + ε  ⇔  x > 1/(f(a) + ε)
        dd = 1 / (fa - eps) - a              # bord droit : 1/x > f(a) - ε  ⇔  x < 1/(f(a) - ε)
        d = min(dg, dd)
        cas.append((a, fa, d, c))
        xs = [a - d + d * Fr(j, 40) for j in range(1, 80)]
        assert all(abs(1 / xx - fa) < eps for xx in xs)
        # optimal : en a - d (ou a + d), l'écart atteint ε
        assert abs(1 / (a - d) - fa) == eps or abs(1 / (a + d) - fa) == eps
        # la formule de l'exemple donne un δ plus petit, qui convient aussi
        assert min(a / 2, eps * a * a / 2) <= d
    assert [c[2] for c in cas] == [Fr(1, 10), Fr(1, 3)]
    R = Repere(0, 2.3, 0, 3.1, 44, 16, 340, 236)
    S = Schema(W0, 290, 'Continuité de 1/x : la largeur δ dépend du point')
    _axes_xy(S, R, 0, 2.25, 0, 3.05)
    for a, fa, d, c in cas:
        x0, y0 = R(float(a - d), float(fa + eps))
        x1, y1 = R(float(a + d), float(fa - eps))
        S.rect(x0, y0, x1 - x0, y1 - y0, c, rempli=c)
        S.ligne(R(float(a), 0), R(float(a), float(fa)), 'g', d=True)
        S.ligne(R(0, float(fa)), R(float(a), float(fa)), 'g', d=True)
        S.point(R(float(a), float(fa)), c, r=3.8)
    xs = np.linspace(0.34, 2.25, 300)
    S.poly(R(xs, 1 / xs), 't', l=1.6)
    _grad_x(S, R, 0.5, '1/2')
    _grad_x(S, R, 1, '1')
    _grad_x(S, R, 2, '2')
    _grad_y(S, R, 1, '1')
    _grad_y(S, R, 2, '2')
    S.texte(R(0.6, 2.5) + [8, -4], 'δ = 1/10', 'r', ancre='start', taille=TL)
    S.texte(R(1.33, 1.5) + [6, -6], 'δ = 1/3', 'b', ancre='start', taille=TL)
    _dans_cadre(S, R(1.33, 1.5) + [6, -6], 'δ = 1/3', ancre='start')
    return S


@schema('lex-continuite-uniforme-2')
def lex_continuite_uniforme_2():
    ns = [1, 2, 3]
    for m in ns:
        assert Fr(1, m) - Fr(1, m + 1) == Fr(1, m * (m + 1)) and (m + 1) - m == 1
    R = Repere(0, 1.15, 0, 4.6, 44, 16, 330, 230)
    S = Schema(W0, 296, 'La fonction 1/x sur ]0, 1] : des points proches, des images à distance 1')
    _axes_xy(S, R, 0, 1.12, 0, 4.55)
    xs = np.linspace(1 / 4.4, 1, 300)
    S.poly(R(xs, 1 / xs), 't', l=1.6)
    for m in ns:
        u, v = 1 / (m + 1), 1 / m
        for xx in (u, v):
            S.ligne(R(xx, 0), R(xx, 1 / xx), 'g', d=True)
            S.ligne(R(0, 1 / xx), R(xx, 1 / xx), 'g', d=True)
            S.point(R(xx, 1 / xx), 't', r=3)
        o = 7 * m
        S.ligne(R(u, 0) + [0, o], R(v, 0) + [0, o], 'b', l=3)
        for xx in (u, v):
            S.ligne(R(xx, 0) + [0, o - 4], R(xx, 0) + [0, o + 4], 'b')
        S.ligne(R(0, m) + [o, 0], R(0, m + 1) + [o, 0], 'r', l=3)
        for yy in (m, m + 1):
            S.ligne(R(0, yy) + [o - 4, 0], R(0, yy) + [o + 4, 0], 'r')
    for m in (1, 2, 3, 4):
        _grad_y(S, R, m, str(m))
    _grad_x(S, R, 1, '1', dy=34)
    _grad_x(S, R, 0.5, '1/2', dy=34)
    S.texte(R(0.6, 3.5), 'y = 1/x', 't', ancre='start', taille=TL)
    return S


@schema('lex-limite-fonction-2')
def lex_limite_fonction_2():
    assert [math.floor(v) for v in (0, 0.5, 0.99, 1, 1.5, 1.99)] == [0, 0, 0, 1, 1, 1]
    R = Repere(-0.15, 2.35, -0.35, 1.5, 50, 20, 330, 220)
    S = Schema(W0, 280, 'La partie entière près de 1 : deux limites différentes de chaque côté')
    _axes_xy(S, R, -0.1, 2.3, -0.3, 1.45)
    S.ligne(R(0, 0), R(1, 0) - [5, 0], 'b', l=3)
    S.point(R(1, 0), 'b', r=4, creux=True)
    S.ligne(R(1, 1), R(2, 1) - [5, 0], 'r', l=3)
    S.point(R(1, 1), 'r', r=4.4)
    S.point(R(2, 1), 'r', r=4, creux=True)
    S.point(R(0, 0), 'b', r=4)
    S.ligne(R(1, 0), R(1, 1), 'g', d=True)
    _grad_x(S, R, 1, '1', dy=16)
    _grad_x(S, R, 2, '2', dy=16)
    _grad_y(S, R, 1, '1')
    S.texte(R(0.5, 0) + [0, -18], '`limite` 0', 'b', taille=15)
    S.texte(R(1.5, 1) + [0, -18], '`limite` 1', 'r', taille=15)
    _dans_cadre(S, R(1.5, 1) + [0, -18], 'limite 1', taille=15)
    return S


@schema('lex-sphere-unite-1')
def lex_sphere_unite_1():
    pts = []
    for tt, c in [(Fr(1, 2), 'b'), (Fr(2, 3), 'v')]:
        p = ((1 - tt * tt) / (1 + tt * tt), 2 * tt / (1 + tt * tt))
        assert p[0] ** 2 + p[1] ** 2 == 1 and p[1] == tt * (p[0] + 1)
        pts.append((tt, p, c))
    assert pts[0][1] == (Fr(3, 5), Fr(4, 5)) and pts[1][1] == (Fr(5, 13), Fr(12, 13))
    hy = 250
    R = Repere(-1.35, 1.75, -1.25, 1.25, 30, 20, round(hy * 3.1 / 2.5), hy)
    assert abs(R.L / 3.1 - hy / 2.5) < 0.5 and R.x0 + R.L <= W0
    S = Schema(W0, 290, 'Points rationnels du cercle unité')
    _axes_xy(S, R, -1.3, 1.7, -1.2, 1.22)
    th = np.linspace(0, 2 * np.pi, 400)
    S.poly(R(np.cos(th), np.sin(th)), 'r', ferme=True, l=2)
    for tt, p, c in pts:
        S.ligne(R(-1, 0), R(*map(float, p)), c, l=1.8)
        S.point(R(*map(float, p)), c, r=4.2)
    S.point(R(-1, 0), 't', r=4)
    S.texte(R(-1, 0) + [-6, 16], '(−1, 0)', 't', ancre='end', taille=15)
    S.texte(R(0.6, 0.8) + [10, 6], '(3/5, 4/5)', 'b', ancre='start', taille=15)
    S.texte(R(5 / 13, 12 / 13) + [8, -14], '(5/13, 12/13)', 'v', ancre='start', taille=15)
    _dans_cadre(S, R(5 / 13, 12 / 13) + [8, -14], '(5/13, 12/13)', taille=15, ancre='start')
    _dans_cadre(S, R(-1, 0) + [-6, 16], '(−1, 0)', taille=15, ancre='end')
    return S


@schema('lex-topologie-usuelle-3')
def lex_topologie_usuelle_3():
    K = [Fr(1, m) for m in range(1, 41)]
    S = Schema(W0, 170, 'Les points 1/n sont isolés dans K, le point 0 ne l’est pas')
    a0, b0 = -0.22, 1.16
    X = lambda v: 30 + (float(v) - a0) / (b0 - a0) * (W0 - 60)
    y0 = 90
    _droite_reelle(S, X, y0, a0, b0 - 0.03, [0, 1], {0: '0', 1: '1'})
    # intervalles isolants ]1/(n+1) + marge, ...[ pour n = 1..4 : un seul point de K dedans
    for m in range(1, 5):
        g = Fr(1, m) - (Fr(1, m) - Fr(1, m + 1)) * Fr(2, 5)
        d = Fr(1, m) + (Fr(1, m - 1) - Fr(1, m)) * Fr(2, 5) if m > 1 else Fr(11, 10)
        assert [k for k in K if g < k < d] == [Fr(1, m)]
        S.ligne((X(g), y0 - 22), (X(d), y0 - 22), 'b', l=3)
        S.ligne((X(g), y0 - 27), (X(g), y0 - 17), 'b')
        S.ligne((X(d), y0 - 27), (X(d), y0 - 17), 'b')
    r = Fr(3, 20)
    assert sum(1 for k in K if -r < k < r) >= 30          # une infinité, en vérité : tous les 1/n avec n > 1/r
    S.ligne((X(-r), y0 + 30), (X(r), y0 + 30), 'r', l=3)
    S.ligne((X(-r), y0 + 25), (X(-r), y0 + 35), 'r')
    S.ligne((X(r), y0 + 25), (X(r), y0 + 35), 'r')
    for k in K:
        S.point((X(k), y0), 'b', r=3 if k > Fr(1, 6) else 2.2)
    S.point((X(0), y0), 'r', r=3.6)
    for m in (1, 2, 3):
        S.texte((X(Fr(1, m)), y0 - 42), '1' if m == 1 else f'1/{m}', 'b', taille=14)
    return S


@schema('lex-partie-dense-1')
def lex_partie_dense_1():
    a, b = Fr(3, 10), Fr(4, 10)
    lignes = []
    for m in range(1, 5):
        dedans = [Fr(k, 2 ** m) for k in range(0, 2 ** m + 1) if a < Fr(k, 2 ** m) < b]
        lignes.append((m, dedans))
    assert [len(d) for _, d in lignes] == [0, 0, 1, 2] and lignes[2][1] == [Fr(3, 8)] and lignes[3][1] == [Fr(5, 16), Fr(3, 8)]
    assert Fr(1, 2 ** 4) < b - a < Fr(1, 2 ** 3)
    S = Schema(W0, 230, 'Les dyadiques finissent par tomber dans tout intervalle')
    X = lambda v: 70 + float(v) * (W0 - 100)
    S.rect(X(a), 22, X(b) - X(a), 150, 'r', rempli='r')
    for j, (m, dedans) in enumerate(lignes):
        yy = 40 + 38 * j
        S.ligne((X(0), yy), (X(1), yy), 'g')
        S.texte((X(0) - 10, yy), f'n = {m}', 'g', ancre='end', taille=14)
        for k in range(0, 2 ** m + 1):
            v = Fr(k, 2 ** m)
            S.point((X(v), yy), 'r' if v in dedans else 't', r=4 if v in dedans else 3)
    S.texte((X(Fr(3, 8)) + 10, 40 + 38 * 2 - 13), '3/8', 'r', ancre='start', taille=14)
    S.texte((X(Fr(5, 16)) - 8, 40 + 38 * 3 + 16), '5/16', 'r', ancre='end', taille=14)
    yl = 200
    _droite_reelle(S, X, yl, 0, 1.02, [0, a, b, 1], {0: '0', 1: '1'})
    S.texte((X(a) - 4, yl + 17), '0,3', 'r', ancre='end', taille=13)
    S.texte((X(b) + 4, yl + 17), '0,4', 'r', ancre='start', taille=13)
    return S


@schema('lex-partie-etoilee-1')
def lex_partie_etoilee_1():
    dansC = lambda p: not (p[1] == 0 and p[0] <= 0)
    centre = (1, 0)
    cibles = [(-1.2, 0.9), (-1.3, -0.5), (0.55, -1.05), (-0.4, 1.15), (1.3, 0.8)]
    for p in cibles:
        assert dansC(p) and all(dansC(((1 - s) * centre[0] + s * p[0], s * p[1])) for s in np.linspace(0, 1, 201))
    assert not dansC((0, 0)) and dansC((0, 1)) and dansC((0, -1))
    hy = 250
    R = Repere(-1.6, 1.6, -1.25, 1.35, 0, 20, 0, hy)
    L = round(hy * 3.2 / 2.6)
    R = Repere(-1.6, 1.6, -1.25, 1.35, (W0 - L) // 2, 20, L, hy)
    S = Schema(W0, 290, 'Le plan privé d’une demi-droite, étoilé par rapport à (1, 0)')
    _axes_xy(S, R, -1.55, 1.55, -1.2, 1.3)
    S.ligne(R(-1.6, 0), R(0, 0), 'r', l=3.4)
    for p in cibles:
        S.ligne(R(*centre), R(*p), 'b')
        S.point(R(*p), 'b', r=3.4)
    S.ligne(R(0, 1), R(0, -1), 'v', d=True, l=2)
    S.point(R(0, 1), 'v', r=3.8)
    S.point(R(0, -1), 'v', r=3.8)
    S.point(R(0, 0), 'r', r=4.4)
    S.point(R(*centre), 't', r=4.2)
    S.texte(R(*centre) + [6, 16], '(1, 0)', 't', ancre='start', taille=15)
    S.texte(R(0, 1) + [10, -2], '(0, 1)', 'v', ancre='start', taille=15)
    S.texte(R(0, -1) + [-10, 6], '(0, −1)', 'v', ancre='end', taille=15)
    return S


@schema('lex-point-adherent-reel-2')
def lex_point_adherent_reel_2():
    S = Schema(W0, 150, 'Une partie de ℝ, un point adhérent extérieur, un point isolé')
    a0, b0 = -0.6, 4.4
    X = lambda v: 30 + (v - a0) / (b0 - a0) * (W0 - 60)
    y0 = 80
    _droite_reelle(S, X, y0, a0, b0 - 0.1, [0, 1, 2, 3, 4], {0: '0', 1: '1', 2: '2', 3: '3', 4: '4'})
    S.ligne((X(0), y0), (X(1), y0), 'b', l=4)
    S.point((X(1), y0), 'b', r=4.2)
    S.point((X(0), y0), 'r', r=4.2, creux=True)
    S.point((X(3), y0), 'b', r=4.4)
    S.ligne((X(2), y0 - 26), (X(4), y0 - 26), 'v', l=2.4)
    for v in (2, 4):
        S.point((X(v), y0 - 26), 'v', r=4, creux=True)
    return S


# ---------------------------------------------------------------------------------------------- paquets 3 et 4

def _cadre_fonction(S, R, x0, x1, y0, y1, gx=(), gy=(), lx=None, ly=None, nx='x'):
    _axes_xy(S, R, x0, x1, y0, y1, nx=nx)
    for v in gx:
        _grad_x(S, R, v, (lx or {}).get(v, str(v).replace('-', '−')))
    for v in gy:
        _grad_y(S, R, v, (ly or {}).get(v, str(v).replace('-', '−')))


@schema('lex-taux-accroissement-1')
def lex_taux_accroissement_1():
    f = lambda u: u * u
    pente = Fr(f(3) - f(1), 3 - 1)
    assert pente == 4 == 2 * 2                       # corde de 1 à 3 parallèle à la tangente en 2
    R = Repere(-0.4, 3.5, -0.8, 10.5, 50, 16, 340, 250)
    S = Schema(W0, 296, 'Corde de la parabole et tangente parallèle au milieu')
    _cadre_fonction(S, R, -0.3, 3.45, -0.6, 10.4, gx=(1, 2, 3), gy=(1, 4, 9))
    xs = np.linspace(-0.3, 3.2, 300)
    S.poly(R(xs, xs ** 2), 't', l=1.6)
    S.ligne(R(0.6, 1 + 4 * (0.6 - 1)), R(3.3, 1 + 4 * (3.3 - 1)), 'r', l=1.8)
    S.ligne(R(1.05, 4 + 4 * (1.05 - 2)), R(2.95, 4 + 4 * (2.95 - 2)), 'b', l=1.8)
    for p, c in [((1, 1), 'r'), ((3, 9), 'r'), ((2, 4), 'b')]:
        S.point(R(*p), c, r=4)
    S.texte(R(2.95, 7.8) + [8, 0], '`pente` 4', 'b', ancre='start', taille=15)
    _dans_cadre(S, R(2.95, 7.8) + [8, 0], 'pente 4', taille=15, ancre='start')
    return S


@schema('lex-derivees-laterales-3')
def lex_derivees_laterales_3():
    f = lambda u: max(u, u * u)
    assert all(f(Fr(j, 10)) == Fr(j, 10) for j in range(1, 10))
    assert all(f(Fr(-j, 10)) == Fr(j * j, 100) for j in range(1, 10)) and all(f(1 + Fr(j, 10)) == (1 + Fr(j, 10)) ** 2 for j in range(1, 10))
    R = Repere(-1.25, 1.75, -0.45, 2.6, 50, 14, 330, 240)
    S = Schema(W0, 290, 'Le maximum de x et de x² et ses demi-tangentes')
    _cadre_fonction(S, R, -1.2, 1.7, -0.4, 2.55, gx=(1,), gy=(1, 2))
    xs = np.linspace(-1.2, 1.55, 600)
    S.poly(R(xs, np.maximum(xs, xs ** 2)), 't', l=2.6)
    xs2 = np.linspace(0, 1, 100)
    S.poly(R(xs2, xs2 ** 2), 'g', d=True)
    S.ligne(R(-0.4, -0.4), R(0, 0), 'g', d=True)
    S.ligne(R(1, 1), R(1.6, 1.6), 'g', d=True)
    # demi-tangentes : en 0, pente 0 à gauche (bleu), 1 à droite (rouge) ; en 1, pente 1 à gauche, 2 à droite
    S.ligne(R(-0.6, 0), R(0, 0), 'b', l=2.4)
    S.ligne(R(0, 0), R(0.3, 0.3), 'r', l=4)
    S.ligne(R(0.7, 0.7), R(1, 1), 'b', l=4)
    S.ligne(R(1, 1), R(1.45, 1 + 2 * 0.45), 'r', l=2.4)
    S.point(R(0, 0), 't', r=4)
    S.point(R(1, 1), 't', r=4)
    return S


@schema('lex-extremum-local-1')
def lex_extremum_local_1():
    f = lambda u: u ** 3 - 3 * u
    g = np.linspace(-4, 2, 6001)[1:-1]
    assert np.all(f(g) <= 2 + 1e-12) and np.all(f(np.linspace(-2, 4, 6001)[1:-1]) >= -2 - 1e-12)
    assert f(-1) == 2 and f(1) == -2 and f(3) == 18 and f(-3) == -18
    R = Repere(-2.6, 2.75, -4.4, 4.4, 40, 14, 350, 250)
    S = Schema(W0, 296, 'Extremums locaux de x³ − 3x')
    _cadre_fonction(S, R, -2.55, 2.7, -4.3, 4.35, gx=(-1, 1, 2))
    xs = np.linspace(-2.2, 2.2, 400)
    S.poly(R(xs, f(xs)), 't', l=1.8)
    S.ligne(R(-2.4, 2), R(2.4, 2), 'r', d=True)
    S.ligne(R(-2.4, -2), R(2.4, -2), 'b', d=True)
    S.point(R(-1, 2), 'r', r=4.6)
    S.point(R(1, -2), 'b', r=4.6)
    S.texte(R(-1, 2) + [0, -16], '(−1, 2)', 'r', taille=15)
    S.texte(R(1, -2) + [0, 18], '(1, −2)', 'b', taille=15)
    return S


@schema('lex-polynome-taylor-1')
def lex_polynome_taylor_1():
    X_ = sp.Symbol('X_')
    assert sp.expand(X_ ** 3 - (1 + 3 * (X_ - 1) + 3 * (X_ - 1) ** 2) - (X_ - 1) ** 3) == 0
    R = Repere(-0.35, 1.95, -1.2, 6.2, 50, 14, 330, 250)
    S = Schema(W0, 296, 'x³ et ses polynômes de Taylor d’ordre 1 et 2 en 1')
    _cadre_fonction(S, R, -0.3, 1.9, -1.1, 6.1, gx=(1,))
    xs = np.linspace(-0.3, 1.82, 300)
    S.poly(R(xs, xs ** 3), 't', l=2.6)
    xb = np.linspace(0.05, 1.82, 200)
    S.poly(R(xb, 1 + 3 * (xb - 1)), 'b', l=1.6)
    S.poly(R(xs, 1 + 3 * (xs - 1) + 3 * (xs - 1) ** 2), 'v', l=1.6)
    S.point(R(1, 1), 'r', r=4.4)
    S.texte(R(1.5, 2.5) + [8, 14], 'ordre 1', 'b', ancre='start', ui=True, taille=14)
    S.texte(R(1.35, 1 + 3 * 0.35 + 3 * 0.35 ** 2) + [-12, -6], 'ordre 2', 'v', ancre='end', ui=True, taille=14)
    return S


@schema('lex-fonction-escalier-3')
def lex_fonction_escalier_3():
    phi = lambda u: math.floor(2 * u) - 2 * math.floor(u)
    assert [phi(Fr(j, 8)) for j in range(17)] == [0] * 4 + [1] * 4 + [0] * 4 + [1] * 4 + [0]
    R = Repere(-0.15, 2.3, -0.4, 1.45, 50, 20, 330, 200)
    S = Schema(W0, 270, 'Une fonction en escalier à quatre paliers')
    _cadre_fonction(S, R, -0.1, 2.25, -0.3, 1.4, gy=(1,))
    for a, b in [(0, 0.5), (0.5, 1), (1, 1.5), (1.5, 2)]:
        v = phi(Fr(a))
        assert all(phi(a + (b - a) * Fr(j, 10)) == v for j in range(10))
        S.ligne(R(a, v), R(b, v) - [5, 0], 'r', l=3)
        S.point(R(a, v), 'r', r=4)
        S.point(R(b, v), 'r', r=4, creux=True)
    S.point(R(2, 0), 'r', r=4)
    for v, lab in [(0.5, '1/2'), (1, '1'), (1.5, '3/2'), (2, '2')]:
        _grad_x(S, R, v, lab, dy=18)
    return S


def _escaliers_diagonale(S, R, n, inferieur=True, superieur=True, ecart=True):
    for k in range(n):
        a, b = k / n, (k + 1) / n
        if inferieur:
            S.poly([R(a, 0), R(b, 0), R(b, a), R(a, a)], 'b', ferme=True, rempli='b', l=1)
        if ecart:
            S.poly([R(a, a), R(b, a), R(b, b), R(a, b)], 'r', ferme=True, rempli='r', l=1)
        elif superieur:
            pass
        if superieur:
            S.ligne(R(a, b), R(b, b), 'v', l=2.4)
    S.ligne(R(0, 0), R(1, 1), 't', l=1.8)


@schema('lex-riemann-integrable-1')
def lex_riemann_integrable_1():
    n = 5
    phi = sum(Fr(k, n) * Fr(1, n) for k in range(n))
    psi = sum(Fr(k + 1, n) * Fr(1, n) for k in range(n))
    assert (phi, psi, psi - phi) == (Fr(2, 5), Fr(3, 5), Fr(1, 5)) and phi < Fr(1, 2) < psi
    R = Repere(-0.08, 1.18, -0.08, 1.18, 90, 14, 250, 250)
    S = Schema(W0, 290, 'Deux escaliers encadrent la diagonale')
    _cadre_fonction(S, R, -0.05, 1.15, -0.05, 1.15, gx=(1,), gy=(1,))
    _escaliers_diagonale(S, R, n)
    return S


@schema('lex-integrale-escalier-3')
def lex_integrale_escalier_3():
    n = 5
    assert sum(Fr(k, n) * Fr(1, n) for k in range(n)) == Fr(2, 5) == Fr(1, 2) - n * Fr(1, 2 * n * n)
    R = Repere(-0.08, 1.18, -0.08, 1.18, 90, 14, 250, 250)
    S = Schema(W0, 290, 'Un escalier sous la diagonale')
    _cadre_fonction(S, R, -0.05, 1.15, -0.05, 1.15, gx=(1,), gy=(1,))
    _escaliers_diagonale(S, R, n, superieur=False, ecart=False)
    return S


@schema('lex-somme-riemann-1')
def lex_somme_riemann_1():
    n, h = 4, Fr(1, 2)
    droite = sum((k * h) ** 3 * h for k in range(1, n + 1))
    gauche = sum((k * h) ** 3 * h for k in range(n))
    assert (droite, gauche) == (Fr(25, 4), Fr(9, 4)) and gauche < 4 < droite
    R = Repere(-0.15, 2.35, -0.5, 8.6, 50, 14, 330, 250)
    S = Schema(W0, 296, 'Sommes de Riemann de x³ sur [0, 2], pointées à droite et à gauche')
    _cadre_fonction(S, R, -0.1, 2.3, -0.4, 8.5, gx=(1, 2), gy=(1, 8))
    for k in range(n):
        a, b = float(k * h), float((k + 1) * h)
        S.poly([R(a, 0), R(b, 0), R(b, b ** 3), R(a, b ** 3)], 'b', ferme=True, rempli='b', l=1.2)
    for k in range(n):
        a, b = float(k * h), float((k + 1) * h)
        S.poly([R(a, 0), R(b, 0), R(b, a ** 3), R(a, a ** 3)], 'r', ferme=True, rempli='r', l=1.2)
    xs = np.linspace(0, 2.03, 300)
    S.poly(R(xs, xs ** 3), 't', l=2)
    return S


@schema('lex-raffinement-commun-2')
def lex_raffinement_commun_2():
    reg = lambda m: sorted({Fr(k, m) for k in range(m + 1)})
    u = sorted(set(reg(2)) | set(reg(3)))
    assert [b - a for a, b in zip(u, u[1:])] == [Fr(1, 3), Fr(1, 6), Fr(1, 6), Fr(1, 3)]
    assert set(u) < set(reg(6)) and set(reg(6)) - set(u) == {Fr(1, 6), Fr(5, 6)}
    S = Schema(W0, 230, 'Deux subdivisions régulières, leur raffinement commun, et σ_6')
    X = lambda v: 80 + float(v) * (W0 - 110)
    lignes = [('σ_2', reg(2), 'b'), ('σ_3', reg(3), 'v'), ('σ_2 ∪ σ_3', u, 'r'), ('σ_6', reg(6), 't')]
    for j, (lab, pts, c) in enumerate(lignes):
        yy = 34 + 46 * j
        S.ligne((X(0), yy), (X(1), yy), 'g')
        S.texte((X(0) - 12, yy), lab, c, ancre='end', taille=15)
        _dans_cadre(S, (X(0) - 12, yy), 'σ2 ∪ σ3', taille=15, ancre='end')
        for p in pts:
            cc = 'g' if (c == 't' and p not in u) else c
            S.ligne((X(p), yy - 7), (X(p), yy + 7), cc, l=2.4)
    for p, lab in [(0, '0'), (Fr(1, 3), '1/3'), (Fr(1, 2), '1/2'), (Fr(2, 3), '2/3'), (1, '1')]:
        S.texte((X(p), 34 + 46 * 3 + 26), lab, 'g', taille=13)
    return S


# ---------------------------------------------------------------------------------------------- paquet 5

def _rectangles(S, R, f, bornes, pointage, c):
    for a, b in zip(bornes, bornes[1:]):
        v = f(a if pointage == 'g' else b)
        S.poly([R(a, 0), R(b, 0), R(b, v), R(a, v)], c, ferme=True, rempli=c, l=1.1)


@schema('lex-logarithme-3')
def lex_logarithme_3():
    n = 6
    bas = sum(Fr(1, k) for k in range(2, n + 1))
    haut = sum(Fr(1, k) for k in range(1, n))
    assert bas < math.log(n) < haut
    R = Repere(-0.3, 6.7, -0.15, 1.25, 40, 14, 360, 230)
    S = Schema(W0, 280, 'Le logarithme encadré par deux sommes harmoniques')
    _cadre_fonction(S, R, -0.2, 6.6, -0.1, 1.2, gx=(1, 2, 3, 4, 5, 6), gy=(1,), nx='t')
    b = list(range(1, n + 1))
    _rectangles(S, R, lambda u: 1 / u, b, 'g', 'b')
    _rectangles(S, R, lambda u: 1 / u, b, 'd', 'r')
    xs = np.linspace(0.8, 6.5, 300)
    S.poly(R(xs, 1 / xs), 't', l=2)
    S.texte(R(4.6, 1 / 4.6) + [0, -26], 'y = 1/t', 't', ancre='start', taille=TL)
    return S


@schema('lex-exponentielle-2')
def lex_exponentielle_2():
    g = np.linspace(-3, 2, 501)
    assert np.all(np.exp(g) >= 1 + g) and np.sum(np.isclose(np.exp(g), 1 + g, atol=1e-9)) == 1
    R = Repere(-3.1, 2.1, -2.3, 6.2, 50, 14, 330, 250)
    S = Schema(W0, 296, 'L’exponentielle au-dessus de sa tangente en 0')
    _cadre_fonction(S, R, -3.0, 2.05, -2.2, 6.1, gx=(-2, -1, 1))
    xs = np.linspace(-3, 1.8, 300)
    S.poly(R(xs, np.exp(xs)), 'r', l=2)
    xb = np.linspace(-3, 2, 50)
    S.poly(R(xb, 1 + xb), 'b', l=1.6)
    S.point(R(0, 1), 't', r=4)
    S.texte(R(1.65, np.exp(1.65)) + [-10, 0], 'exp', 'r', ancre='end', roman=True, taille=TL)
    S.texte(R(0.9, 0.5), 'y = 1 + x', 'b', ancre='start', taille=TL)
    return S


@schema('lex-nombre-e-1')
def lex_nombre_e_1():
    b = [1 + Fr(k, 4) for k in range(9)]
    s = sum((b_ - a_) / b_ for a_, b_ in zip(b, b[1:]))
    assert s > 1 and abs(float(s) - 1.0199) < 1e-4 and math.e < 3
    R = Repere(-0.2, 3.4, -0.12, 1.2, 40, 14, 360, 230)
    S = Schema(W0, 280, 'Huit rectangles sous l’hyperbole : leur aire dépasse déjà 1 avant 3')
    _cadre_fonction(S, R, -0.1, 3.3, -0.08, 1.15, gx=(1, 2, 3), gy=(1,), nx='t')
    _rectangles(S, R, lambda u: 1 / u, [float(v) for v in b], 'd', 'b')
    xs = np.linspace(0.85, 3.25, 300)
    S.poly(R(xs, 1 / xs), 't', l=2)
    S.ligne(R(math.e, 0), R(math.e, 1 / math.e), 'r', l=2.4)
    S.point(R(math.e, 0), 'r', r=4.2)
    S.texte(R(math.e, 0) + [0, 34], 'e', 'r', taille=17)
    return S


@schema('lex-puissance-reelle-1')
def lex_puissance_reelle_1():
    m = 1 / math.e
    xs = np.linspace(0.005, 2, 2000)
    ys = xs ** xs
    assert abs(xs[np.argmin(ys)] - m) < 2e-3 and abs(ys.min() - math.exp(-1 / math.e)) < 1e-5
    R = Repere(-0.15, 2.25, -0.25, 4.3, 50, 14, 330, 240)
    S = Schema(W0, 290, 'La fonction x ↦ xˣ et son minimum')
    _cadre_fonction(S, R, -0.1, 2.2, -0.2, 4.25, gx=(1, 2), gy=(1, 4))
    S.poly(R(xs, ys), 't', l=2)
    S.ligne(R(m, 0), R(m, math.exp(-1 / math.e)), 'r', d=True)
    S.point(R(m, math.exp(-1 / math.e)), 'r', r=4.4)
    S.point(R(1, 1), 't', r=3.6)
    S.point(R(0, 1), 't', r=3.6, creux=True)
    S.texte(R(m, 0) + [0, 16], '1/e', 'r', taille=14)
    return S


@schema('lex-fonction-convexe-2')
def lex_fonction_convexe_2():
    assert (-1) ** 3 == -1 and ((-2) ** 3 + 0) / 2 == -4
    R = Repere(-2.4, 1.7, -8.8, 4.2, 50, 14, 330, 250)
    S = Schema(W0, 296, 'x³ passe au-dessus d’une de ses cordes')
    _cadre_fonction(S, R, -2.35, 1.65, -8.7, 4.1, gx=(-2, 1), gy=(-4, -8))
    xs = np.linspace(-2.05, 1.6, 300)
    S.poly(R(xs, xs ** 3), 't', l=2)
    S.ligne(R(-2, -8), R(0, 0), 'b', l=1.8)
    S.point(R(-2, -8), 'b', r=4)
    S.point(R(0, 0), 'b', r=4)
    S.ligne(R(-1, -4), R(-1, -1), 'g', d=True)
    S.point(R(-1, -1), 'r', r=4.4)
    S.point(R(-1, -4), 'b', r=3.4, creux=True)
    return S


@schema('lex-classe-cinfini-reelle-3')
def lex_classe_cinfini_reelle_3():
    bosse = lambda u: np.where((u > 0) & (u < 1), np.exp(-1 / np.clip(u * (1 - u), 1e-300, None)), 0.0)
    xs = np.linspace(-0.4, 1.4, 1801)
    ys = bosse(xs)
    assert abs(xs[np.argmax(ys)] - 0.5) < 1e-3 and abs(ys.max() - math.exp(-4)) < 1e-9
    k = 50
    R = Repere(-0.45, 1.5, -0.12, 1.1, 40, 14, 350, 220)
    S = Schema(W0, 270, 'Une bosse indéfiniment dérivable, nulle hors de ]0, 1[')
    _cadre_fonction(S, R, -0.4, 1.45, -0.1, 1.05, gx=(1,))
    _grad_x(S, R, 0.5, '1/2')
    S.poly(R(xs, k * ys), 'r', l=2.2)
    S.ligne(R(0, k * math.exp(-4)), R(0.5, k * math.exp(-4)), 'g', d=True)
    S.texte(R(0, k * math.exp(-4)) + [-8, 0], 'e^{−4}', 'g', ancre='end', taille=14)
    return S


@schema('lex-arc-tangente-1')
def lex_arc_tangente_1():
    xs = np.linspace(0, 2, 400)
    assert np.all(xs - xs ** 3 / 3 <= np.arctan(xs) + 1e-15) and np.all(np.arctan(xs) <= xs + 1e-15)
    R = Repere(-0.15, 2.3, -0.75, 2.2, 50, 14, 330, 240)
    S = Schema(W0, 290, 'L’arc tangente entre x − x³/3 et x')
    _cadre_fonction(S, R, -0.1, 2.25, -0.7, 2.15, gx=(1, 2), gy=(1,))
    S.ligne(R(0, math.pi / 2), R(2.2, math.pi / 2), 'g', d=True)
    S.texte(R(0, math.pi / 2) + [-8, 0], 'π/2', 'g', ancre='end', taille=14)
    S.poly(R(xs, xs), 'b', l=1.6)
    S.poly(R(xs, xs - xs ** 3 / 3), 'v', l=1.6)
    S.poly(R(xs, np.arctan(xs)), 'r', l=2.2)
    S.texte(R(2, np.arctan(2)) + [4, 16], 'arctan', 'r', ancre='end', roman=True, taille=15)
    return S


@schema('lex-pi-1')
def lex_pi_1():
    f = lambda u: 1 / (1 + u * u)
    b = [k / 10 for k in range(11)]
    dro = sum(f(v) for v in b[1:]) / 10
    gau = sum(f(v) for v in b[:-1]) / 10
    assert dro < math.pi / 4 < gau and abs(dro - 0.760) < 1e-3 and abs(gau - 0.810) < 1e-3
    R = Repere(-0.08, 1.2, -0.1, 1.15, 70, 14, 300, 240)
    S = Schema(W0, 290, 'Sommes de Riemann de 1/(1 + t²) sur [0, 1]')
    _cadre_fonction(S, R, -0.05, 1.15, -0.05, 1.12, gx=(1,), nx='t')
    _grad_y(S, R, 1, '1', dx=-10)
    _rectangles(S, R, f, b, 'g', 'b')
    _rectangles(S, R, f, b, 'd', 'r')
    xs = np.linspace(0, 1.08, 200)
    S.poly(R(xs, f(xs)), 't', l=2)
    return S


@schema('lex-fonction-tangente-1')
def lex_fonction_tangente_1():
    ys = np.linspace(0.01, 1.4, 200)
    assert np.all(np.tan(ys) > ys)
    h = math.pi / 2
    R = Repere(-1.9, 1.9, -4.2, 4.2, 70, 14, 280, 260)
    S = Schema(W0, 296, 'La tangente et sa tangente en l’origine')
    _cadre_fonction(S, R, -1.85, 1.85, -4.1, 4.15, gy=(1,))
    for v, lab in [(h, 'π/2'), (-h, '−π/2')]:
        S.ligne(R(v, -4.1), R(v, 4.1), 'g', d=True)
        S.texte(R(v, 0) + [6 if v > 0 else -6, 16], lab, 'g', ancre='start' if v > 0 else 'end', taille=14)
    zs = np.linspace(-1.33, 1.33, 400)
    S.poly(R(zs, np.tan(zs)), 'r', l=2.2)
    S.ligne(R(-1.8, -1.8), R(1.8, 1.8), 'b', l=1.6)
    _grad_x(S, R, math.pi / 4, 'π/4', dy=16)
    S.ligne(R(math.pi / 4, 0), R(math.pi / 4, 1), 'g', d=True)
    S.ligne(R(0, 1), R(math.pi / 4, 1), 'g', d=True)
    S.point(R(math.pi / 4, 1), 'r', r=3.8)
    return S


@schema('lex-cosinus-sinus-2')
def lex_cosinus_sinus_2():
    xs = np.linspace(0, math.pi, 400)
    assert np.all(np.sin(xs[1:]) < xs[1:]) and np.all(np.cos(xs[1:]) > 1 - xs[1:] ** 2 / 2)
    R = Repere(-0.2, 3.5, -1.3, 2.0, 50, 14, 340, 240)
    S = Schema(W0, 290, 'Le sinus sous x, le cosinus au-dessus de 1 − x²/2')
    _cadre_fonction(S, R, -0.1, 3.45, -1.25, 1.95, gy=(1, -1))
    for v, lab in [(math.pi / 2, 'π/2'), (math.pi, 'π')]:
        S.ligne(R(v, 0) + [0, -3], R(v, 0) + [0, 3], 'g')
        S.texte(R(v, 0) + [8, -12], lab, 'g', ancre='start', taille=13)
    xl = np.linspace(0, 1.95, 50)
    S.poly(R(xl, xl), 'r', d=True, l=1.6)
    xp = np.linspace(0, math.sqrt(2 * 2.25), 200)
    S.poly(R(xp, 1 - xp ** 2 / 2), 'b', d=True, l=1.6)
    S.poly(R(xs, np.sin(xs)), 'r', l=2.2)
    S.poly(R(xs, np.cos(xs)), 'b', l=2.2)
    S.texte(R(2.3, math.sin(2.3)) + [6, -10], 'sin', 'r', ancre='start', roman=True, taille=15)
    S.texte(R(2.6, math.cos(2.6)) + [0, 24], 'cos', 'b', roman=True, taille=15)
    return S


@schema('lex-fonction-periodique-3')
def lex_fonction_periodique_3():
    xs = np.linspace(0, 2 * math.pi, 600)
    assert np.allclose(np.sin(xs[:300] + math.pi) ** 2, np.sin(xs[:300]) ** 2)
    assert abs(math.sin(1.5 * math.pi) + 1) < 1e-12
    R = Repere(-0.3, 6.9, -1.35, 1.45, 40, 14, 360, 230)
    S = Schema(W0, 280, 'Le sinus est de période 2π, son carré de période π')
    _cadre_fonction(S, R, -0.2, 6.8, -1.3, 1.4, gy=(1, -1))
    for v, lab, dec, anc in [(math.pi, 'π', [-8, 16], 'end'), (2 * math.pi, '2π', [8, 16], 'start')]:
        S.texte(R(v, 0) + dec, lab, 'g', ancre=anc, taille=13)
        S.ligne(R(v, -1.3), R(v, 1.3), 'g', d=True)
    S.poly(R(xs, np.sin(xs)), 'b', l=2)
    S.poly(R(xs, np.sin(xs) ** 2), 'r', l=2.2)
    return S


# ---------------------------------------------------------------------------------------------- chapitre ar-asymptotique

@schema('lex-au-voisinage-2')
def lex_au_voisinage_2():
    d = Fr(2, 5)
    # dans R, ]-d, d[ contient -d/2 < 0 ; dans ]0, 1], D ∩ ]-d, d[ = ]0, d[ (d <= 1), sans point négatif
    assert -d / 2 < 0 and -d < -d / 2 < d and d <= 1
    S = Schema(W0, 200, 'Voisinages relatifs de 0 dans ℝ et dans ]0, 1]')
    X = lambda v: 70 + (float(v) + 1.1) / 2.4 * (W0 - 110)
    y1, y2 = 62, 150
    _droite_reelle(S, X, y1, -1.1, 1.25, [-1, 0, 1], {-1: '−1', 0: '0', 1: '1'})
    S.ligne((X(-d), y1), (X(d), y1), 'b', l=4)
    S.point((X(-d), y1), 'b', r=4, creux=True)
    S.point((X(d), y1), 'b', r=4, creux=True)
    S.point((X(-d / 2), y1), 'b', r=4)
    S.texte((X(-d / 2), y1 - 17), '−δ/2', 'b', taille=TL)
    S.texte((X(-1.1) - 6, y1), 'ℝ', 'g', ancre='end', taille=TL)
    _droite_reelle(S, X, y2, -1.1, 1.25, [-1, 0, 1], {-1: '−1', 0: '0', 1: '1'})
    S.ligne((X(0), y2), (X(1), y2), 'v', l=2.6)
    S.point((X(0), y2), 'v', r=4, creux=True)
    S.point((X(1), y2), 'v', r=4)
    S.ligne((X(0), y2 - 9), (X(d), y2 - 9), 'r', l=4)
    S.point((X(0), y2 - 9), 'r', r=3.6, creux=True)
    S.point((X(d), y2 - 9), 'r', r=3.6, creux=True)
    S.texte((X(d), y2 - 26), 'δ', 'r', taille=TL)
    S.texte((X(-1.1) - 6, y2), ']0, 1]', 'g', ancre='end', taille=15)
    _dans_cadre(S, (X(-1.1) - 6, y2), ']0, 1]', taille=15, ancre='end')
    return S
