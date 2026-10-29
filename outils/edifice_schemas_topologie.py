"""Schémas des graphes c, top, topalg, hom, grtop et geoalg (complexes, topologie générale, topologie
algébrique, homologie, groupes topologiques, géométrie algébrique)."""
from fractions import Fraction as Fr
import math
import numpy as np
from matplotlib.path import Path as _Path
from edifice_schemas import schema
from edifice_svg import Schema, Repere, blob, bezier, courbe_entre, arc


# ---------------------------------------------------------------- primitives locales
def dedans(poly, pts):
    """Appartenance (stricte, à 1e-9 près) de points à un polygone."""
    return _Path(np.asarray(poly, float)).contains_points(np.atleast_2d(pts), radius=-1e-9)


def dist_poly(poly, p):
    """Distance d'un point au contour d'un polygone (échantillonné finement)."""
    poly = np.asarray(poly, float)
    q = np.vstack([poly, poly[:1]])
    best = np.inf
    for a, b in zip(q[:-1], q[1:]):
        ab = b - a
        t = np.clip(np.dot(p - a, ab) / np.dot(ab, ab), 0, 1)
        best = min(best, np.linalg.norm(p - (a + t * ab)))
    return best


def dans_ellipse(c, rx, ry, pts):
    pts = np.atleast_2d(pts)
    return ((pts[:, 0] - c[0]) / rx) ** 2 + ((pts[:, 1] - c[1]) / ry) ** 2 < 1


def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


# ---------------------------------------------------------------- c : nombres complexes
@schema('c-calcul')
def c_calcul():
    z, w = complex(1, 2), complex(3, 1)
    s, zb = z + w, z.conjugate()
    assert s == complex(4, 3) and zb == complex(1, -2)
    assert abs(abs(z - w) - math.sqrt(5)) < 1e-12               # d(z, w) = |z − w| = √5
    assert abs(s) <= abs(z) + abs(w)                             # inégalité triangulaire (iv)
    S = Schema(500, 390, 'Plan complexe : z, w, z + w, conjugué de z, distance |z − w|')
    u = 52
    R = Repere(-1.3, 6.4, -2.75, 3.85, 34, 20, 7.7 * u, 6.6 * u)
    P = lambda c: R(c.real, c.imag)
    # axes
    S.fleche(R(-1.2, 0), R(5.6, 0), 'g')
    S.texte(R(5.6, 0) + [8, 0], '`Re`', 'g', ancre='start')
    S.fleche(R(0, -2.6), R(0, 3.8), 'g')
    S.texte(R(0, 3.8) + [-10, 4], '`Im`', 'g', ancre='end')
    for k in range(1, 5):
        S.ligne(R(k, 0) + [0, -4], R(k, 0) + [0, 4], 'g')
        S.texte(R(k, 0) + [0, 15], str(k), 'g', taille=14)
    for k in (-2, -1, 1, 2, 3):
        S.ligne(R(0, k) + [-4, 0], R(0, k) + [4, 0], 'g')
        S.texte(R(0, k) + [-8, 0], str(k) if k > 0 else '−' + str(-k), 'g', ancre='end', taille=14)
    O = P(0)
    # parallélogramme
    S.ligne(P(z), P(s), 'g', d=True)
    S.ligne(P(w), P(s), 'g', d=True)
    S.ligne(O, P(z), 't')
    S.ligne(O, P(w), 't')
    S.ligne(O, P(s), 'b')
    S.ligne(P(z), P(w), 'r')
    # symétrie
    S.ligne(P(z), P(zb), 'g', d=True)
    # points
    for c, col in [(z, 't'), (w, 't'), (s, 'b'), (zb, 'g')]:
        S.point(P(c), col)
    S.texte(P(z) + [-8, -10], 'z', ancre='end')
    S.texte(P(w) + [10, 8], 'w', ancre='start')
    S.texte(P(s) + [8, -10], 'z + w', 'b', ancre='start')
    S.texte(P(zb) + [10, 6], 'z̄', 'g', ancre='start')
    S.texte(O + [-8, 14], '0', ancre='end')
    # étiquettes des segments, décalées perpendiculairement
    def etiq(a, b, txt, c, cote, d=16):
        a, b = P(a), P(b)
        m = (a + b) / 2
        n = unit([-(b - a)[1], (b - a)[0]]) * cote
        S.texte(m + d * n, txt, c)
    etiq(z, w, '|z − w|', 'r', 1, 26)
    a, b = P(0), P(s)
    m = a + 0.66 * (b - a)
    S.texte(m + 22 * unit([-(b - a)[1], (b - a)[0]]), '|z + w|', 'b')
    return S


# ---------------------------------------------------------------- top : topologie générale
@schema('t-adherence')
def t_adherence():
    S = Schema(500, 330, 'Adhérence : un point du bord rencontre A, un point extérieur a un voisinage disjoint')
    S.rect(20, 20, 460, 290, 'g', rx=6)
    S.texte([42, 44], 'X')
    c = np.array([210.0, 165.0])
    A = blob(c, 135, 100, graine=4, amplitude=0.07, n=240)
    S.surface(A, 'r')
    # bord : plein (points de A) sur une partie, pointillé (points de Ā hors de A) sur le reste
    k0, k1 = 30, 110
    S.poly(A[k0:k1 + 1], 'r', d=True)
    S.poly(np.vstack([A[k1:], A[:k0 + 1]]), 'r')
    S.texte(c + [-20, 0], 'A', 'r')
    # x sur le bord pointillé, voisinage V qui rencontre A
    x = A[70]
    rV = 34
    S.cercle(x, rV, 'b', rempli='b')
    assert dedans(A, x + 0.5 * rV * unit(c - x))[0]          # V rencontre A
    assert not dedans(A, x + 0.5 * rV * unit(x - c))[0]      # … sans y être inclus
    S.point(x, 'r', r=4)
    S.texte(x + [10, 16], 'x', 'r', ancre='start')
    S.texte(x + [-0.7 * rV - 4, 0.7 * rV + 8], 'V', 'b', ancre='end')
    # y hors de Ā, voisinage W disjoint de A
    y = np.array([420.0, 120.0])
    rW = 30
    assert not dedans(A, y)[0] and dist_poly(A, y) > rW + 8
    S.cercle(y, rW, 'v', rempli='v')
    S.point(y, 't', r=3.6)
    S.texte(y + [9, -9], 'y', ancre='start')
    S.texte(y + [0, rW + 16], 'W', 'v')
    return S


@schema('t-separe')
def t_separe():
    S = Schema(470, 400, 'Diagonale de X × X et cylindre U × V qui l’évite')
    o = np.array([78.0, 352.0])
    L = 300.0
    P = lambda a, b: o + [a * L, -b * L]           # coordonnées abstraites dans [0, 1]²
    S.rect(o[0], o[1] - L, L, L, 't')
    S.texte(P(0.5, 0) + [0, 36], 'X', 't')
    S.texte(P(0, 0.8) + [-30, 0], 'X', 't')
    S.texte(P(1, 1) + [10, -14], 'X × X', 't', ancre='start')
    S.ligne(P(0, 0), P(1, 1), 'r')
    S.texte(P(0.86, 0.86) + [-14, -10], 'Δ', 'r', ancre='end')
    x, y = 0.72, 0.30
    U, V = (0.58, 0.86), (0.14, 0.47)
    assert U[0] < x < U[1] and V[0] < y < V[1]
    assert V[1] < U[0]                                   # U ∩ V = ∅
    # U × V ne rencontre pas Δ : aucun t avec t ∈ U et t ∈ V
    ts = np.linspace(0, 1, 10001)
    assert not np.any((ts > U[0]) & (ts < U[1]) & (ts > V[0]) & (ts < V[1]))
    p0, p1 = P(U[0], V[1]), P(U[1], V[0])
    S.rect(p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1], 'b', rempli='b')
    S.texte(P((U[0] + U[1]) / 2, V[1]) + [0, -14], 'U × V', 'b')
    # projections
    S.ligne(P(U[0], 0), P(U[1], 0), 'b', l=5)
    S.ligne(P(0, V[0]), P(0, V[1]), 'v', l=5)
    S.ligne(P(U[0], 0), P(U[0], V[0]), 'g', d=True)
    S.ligne(P(U[1], 0), P(U[1], V[0]), 'g', d=True)
    S.ligne(P(0, V[0]), P(U[0], V[0]), 'g', d=True)
    S.ligne(P(0, V[1]), P(U[0], V[1]), 'g', d=True)
    S.texte(P(U[0], 0) + [6, 18], 'U', 'b', ancre='start')
    S.texte(P(0, V[1]) + [-12, 8], 'V', 'v', ancre='end')
    S.point(P(x, 0), 'b'); S.texte(P(x, 0) + [0, 18], 'x', 'b')
    S.point(P(0, y), 'v'); S.texte(P(0, y) + [-12, 0], 'y', 'v', ancre='end')
    S.point(P(x, y), 'r', r=4)
    S.texte(P(x, y) + [8, 12], '(x, y)', 'r', ancre='start')
    return S


@schema('t-produit-fini')
def t_produit_fini():
    S = Schema(500, 390, 'Lemme du tube dans K × L')
    o = np.array([70.0, 290.0])
    LK, LL = 380.0, 250.0
    P = lambda a, b: o + [a * LK, -b * LL]
    x = 0.42
    Uk = [(0.30, 0.62), (0.36, 0.55), (0.24, 0.50)]
    Vk = [(-0.03, 0.42), (0.32, 0.74), (0.66, 1.03)]
    cls = ['b', 'v', 'b']
    assert all(a < x < b for a, b in Uk)
    U = (max(a for a, _ in Uk), min(b for _, b in Uk))
    assert U == (0.36, 0.50) and U[0] < x < U[1]
    # les V_k recouvrent L, et le tube U × L est dans la réunion des U_k × V_k
    ys = np.linspace(0, 1, 2001)
    us = np.linspace(U[0] + 1e-6, U[1] - 1e-6, 301)
    for yy in ys:
        assert any(a < yy < b for a, b in Vk) or yy in (0, 1) and any(a <= yy <= b for a, b in Vk)
        assert all(any(Uk[k][0] < uu < Uk[k][1] and Vk[k][0] <= yy <= Vk[k][1] for k in range(3)) for uu in us[::30])
    # tube
    t0, t1 = P(U[0], 1), P(U[1], 0)
    S.rect(t0[0], t0[1], t1[0] - t0[0], t1[1] - t0[1], 'r', d=False, rempli='r')
    S.rect(o[0], o[1] - LL, LK, LL, 't')
    # rectangles U_k × V_k (rognés au dessin de K × L)
    for k, ((a, b), (c, d)) in enumerate(zip(Uk, Vk)):
        c2, d2 = max(c, -0.03), min(d, 1.03)
        p0, p1 = P(a, d2), P(b, c2)
        S.rect(p0[0], p0[1], p1[0] - p0[0], p1[1] - p0[1], 'b', rempli=None)
        S.texte(P(b, (max(c, 0) + min(d, 1)) / 2) + [8, 0], f'U_{k + 1} × V_{k + 1}', 'b', ancre='start', taille=15)
    # fibre
    S.ligne(P(x, 0), P(x, 1), 'r', l=3)
    S.texte(P(x, 1) + [0, -32], '{x} × L', 'r')
    # axes K et L
    S.texte(P(1, 0) + [10, 0], 'K', ancre='start')
    S.texte(P(0, 1) + [-12, 0], 'L', ancre='end')
    S.point(P(x, 0), 'r', r=4)
    S.texte(P(x, 0) + [-8, -13], 'x', 'r', ancre='end')
    # projections U_k et U sous K
    for k, (a, b) in enumerate(Uk):
        yb = 20 + 16 * k
        S.ligne(P(a, 0) + [0, yb], P(b, 0) + [0, yb], 'b', l=3)
        S.texte(P(b, 0) + [8, yb], f'U_{k + 1}', 'b', ancre='start', taille=14)
    yb = 20 + 16 * 3 + 4
    S.ligne(P(U[0], 0) + [0, yb], P(U[1], 0) + [0, yb], 'r', l=5)
    S.texte(P(U[1], 0) + [8, yb], 'U = U_1 ∩ U_2 ∩ U_3', 'r', ancre='start', taille=15)
    S.texte(P(U[0], 0.55) + [-8, 0], 'U × L', 'r', ancre='end', taille=15)
    return S


@schema('t-quotient')
def t_quotient():
    S = Schema(440, 390, 'Tore : carré dont les côtés opposés sont identifiés')
    o = np.array([70.0, 330.0])
    L = 290.0
    P = lambda a, b: o + [a * L, -b * L]
    # voisinages : demi-disques en q et q′, quarts de disque aux coins
    h, rq, rc = 0.55, 0.15, 0.13
    th = np.linspace(-np.pi / 2, np.pi / 2, 60)
    demi_g = np.array([P(rq * np.cos(t), h + rq * np.sin(t)) for t in th])
    demi_d = np.array([P(1 - rq * np.cos(t), h + rq * np.sin(t)) for t in th])
    S.poly(np.vstack([demi_g, [P(0, h - rq)]]), 'r', ferme=True, rempli='r')
    S.poly(np.vstack([demi_d, [P(1, h - rq)]]), 'r', ferme=True, rempli='r')
    for (cx, cy) in [(0, 0), (1, 0), (0, 1), (1, 1)]:
        sx, sy = (1 if cx == 0 else -1), (1 if cy == 0 else -1)
        q = np.linspace(0, np.pi / 2, 30)
        pts = np.array([P(cx + sx * rc * np.cos(t), cy + sy * rc * np.sin(t)) for t in q])
        S.poly(np.vstack([[P(cx, cy)], pts]), 'b', ferme=True, rempli='b')
    S.rect(o[0], o[1] - L, L, L, 't')
    # flèches d'identification : simples à gauche et à droite, doubles en bas et en haut
    for a in (0, 1):
        m = P(a, 0.25)
        S.pointe(m, [0, -1], 't', taille=11, largeur=5)
    for b in (0, 1):
        m = P(0.52, b)
        S.pointe(m, [1, 0], 't', taille=11, largeur=5)
        S.pointe(m + [-9, 0], [1, 0], 't', taille=11, largeur=5)
    # points q, q′ (même hauteur : identifiés)
    S.point(P(0, h), 'r', r=4)
    S.point(P(1, h), 'r', r=4)
    S.texte(P(0, h) + [-10, 0], 'q', 'r', ancre='end')
    S.texte(P(1, h) + [10, 0], 'q′', 'r', ancre='start')
    for (cx, cy), dxy in zip([(0, 0), (1, 0), (0, 1), (1, 1)], [(-10, 14), (10, 14), (-10, -12), (10, -12)]):
        S.point(P(cx, cy), 'b', r=3.6)
    S.texte(P(0.5, 0.5), 'X', 'g')
    return S


# ---------------------------------------------------------------- topalg : topologie algébrique
def _carre_unite(S, o, L, ls='s', lt='t', graduer=True):
    """Carré I × I de côté L, coin inférieur gauche o ; renvoie P(s, t) -> image."""
    P = lambda s, t: np.asarray(o, float) + [s * L, -t * L]
    S.fleche(P(0, 0), P(1, 0) + [26, 0], 'g')
    S.fleche(P(0, 0), P(0, 1) + [0, -26], 'g')
    S.texte(P(1, 0) + [30, 0], ls, 'g', ancre='start')
    S.texte(P(0, 1) + [0, -34], lt, 'g')
    if graduer:
        S.texte(P(0, 0) + [-10, 14], '0', 'g', ancre='end', taille=14)
        S.texte(P(1, 0) + [0, 16], '1', 'g', taille=14)
        S.texte(P(0, 1) + [-10, 0], '1', 'g', ancre='end', taille=14)
    return P


@schema('ta-homotopie')
def ta_homotopie():
    S = Schema(540, 290, 'Homotopie H de γ à δ à extrémités fixes')
    L = 170
    P = _carre_unite(S, (52, 225), L)
    ts = [1 / 3, 2 / 3]
    for t in ts:
        S.ligne(P(0, t), P(1, t), 'r', l=1.3)
    S.ligne(P(0, 0), P(1, 0), 'b', l=2.6)
    S.ligne(P(0, 1), P(1, 1), 'v', l=2.6)
    S.ligne(P(0, 0), P(0, 1), 'g', l=2.6)
    S.ligne(P(1, 0), P(1, 1), 'g', l=2.6)
    S.texte(P(0.5, 0) + [0, 18], 'γ', 'b')
    S.texte(P(0.5, 1) + [0, -14], 'δ', 'v')
    S.texte(P(1, 0.5) + [10, 0], 'y', 'g', ancre='start')
    S.texte(P(0, 0.5) + [-10, 0], 'x', 'g', ancre='end')
    # flèche H
    a, b = P(1, 0.5) + [34, 0], P(1, 0.5) + [92, 0]
    S.fleche(a, b, 't')
    S.texte((a + b) / 2 + [0, -14], 'H')
    # espace X et chemins
    cX = np.array([418.0, 135.0])
    X = blob(cX, 105, 112, graine=3, amplitude=0.05)
    S.poly(X, 'g', ferme=True)
    S.texte(cX + [-92, -86], 'X', 'g')
    x, y = np.array([340.0, 150.0]), np.array([498.0, 128.0])
    gam = bezier(x, [370, 250], [470, 230], y, n=80)
    dlt = bezier(x, [360, 40], [460, 20], y, n=80)
    H = lambda t: (1 - t) * gam + t * dlt
    for t in [0, *ts, 1]:
        assert dedans(X, H(t)[1:-1]).all()              # les chemins restent dans X
    for t in ts:
        S.poly(H(t), 'r', l=1.3)
    S.poly(gam, 'b', l=2.4)
    S.poly(dlt, 'v', l=2.4)
    S.point(x); S.point(y)
    S.texte(x + [-9, 0], 'x', ancre='end')
    S.texte(y + [9, 0], 'y', ancre='start')
    S.texte(gam[40] + [0, 18], 'γ', 'b')
    S.texte(dlt[40] + [0, -14], 'δ', 'v')
    return S


def _phi_assoc(s):
    s = Fr(s)
    if s <= Fr(1, 4):
        return 2 * s
    if s <= Fr(1, 2):
        return s + Fr(1, 4)
    return (s + 1) / 2


@schema('ta-groupe-fondamental')
def ta_groupe_fondamental():
    # (γ·δ)·ε parcourt γ, δ, ε sur [0,1/4], [1/4,1/2], [1/2,1] ; γ·(δ·ε) sur [0,1/2], [1/2,3/4], [3/4,1].
    def lhs(s):            # (morceau, paramètre local) de (γ·δ)·ε au temps s
        s = Fr(s)
        return ('γ', 4 * s) if s <= Fr(1, 4) else ('δ', 4 * s - 1) if s <= Fr(1, 2) else ('ε', 2 * s - 1)

    def rhs(u):            # de γ·(δ·ε) au temps u
        u = Fr(u)
        return ('γ', 2 * u) if u <= Fr(1, 2) else ('δ', 4 * u - 2) if u <= Fr(3, 4) else ('ε', 4 * u - 3)
    for k in range(0, 97):
        s = Fr(k, 96)
        a, b = lhs(s), rhs(_phi_assoc(s))
        assert a == b or a[1] == 1 and b[1] == 0 or a[1] == 0 and b[1] == 1, (s, a, b)
    # homotopie du reparamétrage : H(s, t) = (γ·(δ·ε))(u), u = (1 − t) φ(s) + t s
    U = lambda s, t: (1 - t) * float(_phi_assoc(s)) + t * s

    def front(niv, t):     # s tel que u(s, t) = niv (u croît strictement en s)
        lo, hi = 0.0, 1.0
        for _ in range(60):
            m = (lo + hi) / 2
            lo, hi = (m, hi) if U(m, t) < niv else (lo, m)
        return lo
    tt = np.linspace(0, 1, 81)
    f1 = np.array([front(0.5, t) for t in tt])
    f2 = np.array([front(0.75, t) for t in tt])
    assert np.allclose(f1, 0.25 + tt / 4, atol=1e-9)                     # frontière droite
    assert np.allclose(f2, (1 + 2 * tt) / (2 + 2 * tt), atol=1e-9)       # frontière courbe
    assert abs(f2[40] - (0.5 + 0.5 / 4)) > 0.03                          # … qui n'est pas s = 1/2 + t/4
    S = Schema(500, 380, 'Homotopie de (γ·δ)·ε à γ·(δ·ε)')
    L = 270
    P = _carre_unite(S, (110, 320), L, graduer=False)
    c1 = np.array([P(s, t) for s, t in zip(f1, tt)])
    c2 = np.array([P(s, t) for s, t in zip(f2, tt)])
    S.surface(np.vstack([[P(0, 0)], c1, [P(0, 1)]]), 'b')
    S.surface(np.vstack([c1, c2[::-1]]), 'v')
    S.surface(np.vstack([c2, [P(1, 1), P(1, 0)]]), 'g')
    S.rect(P(0, 1)[0], P(0, 1)[1], L, L, 't')
    S.poly(c1, 'r'); S.poly(c2, 'r')
    S.texte(P(0.17, 0.5), 'γ', 'b')
    S.texte(P(0.48, 0.5), 'δ', 'v')
    S.texte(P(0.80, 0.5), 'ε', 't')
    for s, lab in [(0, '0'), (0.25, '1/4'), (0.5, '1/2'), (1, '1')]:
        S.ligne(P(s, 0), P(s, 0) + [0, 5], 'g')
        S.texte(P(s, 0) + [0, 17], lab, 'g', taille=14)
    for s, lab in [(0.5, '1/2'), (0.75, '3/4')]:
        S.texte(P(s, 1) + [0, -12], lab, 'g', taille=14)
    S.texte(P(1, 1) + [-2, -12], '1', 'g', taille=14)
    S.texte(P(0, 0) + [-12, 0], 't = 0', 'g', ancre='end', taille=15)
    S.texte(P(0, 1) + [-12, 0], 't = 1', 'g', ancre='end', taille=15)
    S.texte(P(0.5, 0) + [0, 42], '(γ · δ) · ε', 't')
    S.texte(P(0.5, 1) + [0, -36], 'γ · (δ · ε)', 't')
    return S


@schema('ta-revetement')
def ta_revetement():
    S = Schema(520, 412, 'Relèvement d’un chemin morceau par morceau')
    # chemin γ de B, dessiné comme graphe d'une fonction x -> y (coordonnées image)
    x0, x1, yB = 80.0, 460.0, 340.0
    g = lambda x: yB + 16 * np.sin((x - x0) / 75.0)
    m = 4
    sk = np.linspace(x0, x1, m + 1)                   # γ(s_k)
    # ouverts U_k : ellipses contenant chaque morceau γ([s_k, s_{k+1}])
    Us = []
    for k in range(m):
        xs = np.linspace(sk[k], sk[k + 1], 200)
        cx, cy = (sk[k] + sk[k + 1]) / 2, float(np.mean(g(xs)))
        rx, ry = (sk[k + 1] - sk[k]) / 2 + 20, 25
        assert dans_ellipse((cx, cy), rx, ry, np.stack([xs, g(xs)], 1)).all()
        Us.append((cx, cy, rx, ry))
    # E dessiné au-dessus : un point (x, y) au-dessus de (x, y') ; feuillets = copies cisaillées des U_k
    H0, c, D = 178.0, 0.1, 62.0
    lev = lambda x, j: H0 + c * (x - x0) + j * D       # décalage vertical du feuillet j
    th = np.linspace(0, 2 * np.pi, 120)
    for j in (1, 0, -1):
        for k, (cx, cy, rx, ry) in enumerate(Us):
            ex, ey = cx + rx * np.cos(th), cy + ry * np.sin(th)
            pts = np.stack([ex, ey - lev(ex, j)], 1)
            if j == 0:
                S.poly(pts, 'r', ferme=True, rempli='r', l=1.2)
            else:
                S.poly(pts, 'g', d=True, ferme=True)
    # deux feuillets de niveaux différents au-dessus d'un même U_k sont disjoints
    for (cx, cy, rx, ry) in Us:
        assert D > 2 * ry          # à abscisse fixée, le cisaillement décale les niveaux de la même quantité
    for k, (cx, cy, rx, ry) in enumerate(Us):
        ex, ey = cx + rx * np.cos(th), cy + ry * np.sin(th)
        S.poly(np.stack([ex, ey], 1), 'b', ferme=True, rempli='b', l=1.2)
    xs = np.linspace(x0, x1, 300)
    S.poly(np.stack([xs, g(xs)], 1), 't', l=2.4)
    lift = np.stack([xs, g(xs) - lev(xs, 0)], 1)
    S.poly(lift, 'r', l=2.6)
    for k in range(m + 1):
        S.point([sk[k], g(sk[k])], 't', r=3.4)
        S.point([sk[k], g(sk[k]) - lev(sk[k], 0)], 'r', r=3.4)
    e = np.array([x0, g(x0) - lev(x0, 0)])
    S.texte(e + [-4, -18], 'e', 'r', ancre='end')
    S.texte([x1 + 30, g(x1)], 'γ', ancre='start')
    S.texte(lift[-1] + [30, 0], 'γ̃', 'r', ancre='start')
    for k, (cx, cy, rx, ry) in enumerate(Us):
        S.texte([cx, cy + ry + 15], f'U_{k}', 'b', taille=15)
    cx, cy, rx, ry = Us[2]
    S.texte([cx + 18, cy - lev(cx, 0) + 0.62 * ry], 'V_2', 'r', taille=15)
    # projection p
    a = np.array([28.0, 177.0]); b = np.array([28.0, 307.0])
    S.fleche(a, b, 't')
    S.texte((a + b) / 2 + [10, 0], 'p', ancre='start')
    S.texte([28, 157], 'E')
    S.texte([28, 330], 'B')
    return S


@schema('ta-revetement-2')
def ta_revetement_2():
    S = Schema(460, 390, 'Relèvement d’une homotopie carré par carré')
    n, L = 4, 280
    P = _carre_unite(S, (90, 330), L, graduer=True)
    q = L / n
    j0, k0 = 2, 1                                    # carré courant : colonne 2, rangée 1
    ordre = [(j, k) for k in range(n) for j in range(n)]
    faits = ordre[:ordre.index((j0, k0))]
    for (j, k) in faits:
        p = P(j / n, (k + 1) / n)
        S.rect(p[0], p[1], q, q, 'g', rempli='g', rx=0)
    p = P(j0 / n, (k0 + 1) / n)
    S.rect(p[0], p[1], q, q, 'r', rempli='r')
    # partie du bord de Q déjà traitée : côté gauche et côté inférieur
    bord = set()
    for (j, k) in faits:
        for a, b in [((j, k), (j + 1, k)), ((j, k + 1), (j + 1, k + 1)), ((j, k), (j, k + 1)), ((j + 1, k), (j + 1, k + 1))]:
            bord.add((a, b))
    cotesQ = {'gauche': ((j0, k0), (j0, k0 + 1)), 'bas': ((j0, k0), (j0 + 1, k0)),
              'droite': ((j0 + 1, k0), (j0 + 1, k0 + 1)), 'haut': ((j0, k0 + 1), (j0 + 1, k0 + 1))}
    assert cotesQ['gauche'] in bord and cotesQ['bas'] in bord
    assert cotesQ['droite'] not in bord and cotesQ['haut'] not in bord
    for i in range(n + 1):
        S.ligne(P(i / n, 0), P(i / n, 1), 'g')
        S.ligne(P(0, i / n), P(1, i / n), 'g')
    S.rect(P(0, 1)[0], P(0, 1)[1], L, L, 't')
    for nom in ('gauche', 'bas'):
        (a, b), (c, d) = cotesQ[nom]
        S.ligne(P(a / n, b / n), P(c / n, d / n), 'r', l=4)
    S.texte(P((j0 + 0.5) / n, (k0 + 0.5) / n), 'Q', 'r')
    # numéros d'ordre des carrés faits
    for idx, (j, k) in enumerate(faits):
        S.texte(P((j + 0.5) / n, (k + 0.5) / n), str(idx + 1), 'g', taille=15)
    S.point(P(0, 0), 'r', r=4)
    return S


@schema('ta-cercle')
def ta_cercle():
    S = Schema(520, 410, 'Revêtement p de ℝ sur le cercle : intervalles J + k et ouvert U = p(J)')
    x = Fr(3, 10)
    J = (x - Fr(1, 2), x + Fr(1, 2))
    assert J == (Fr(-1, 5), Fr(4, 5)) and J[1] - J[0] == 1
    R = Repere(-1.55, 2.55, 0, 1, 30, 40, 460, 1)
    yl = 70.0
    X = lambda t: np.array([R(t, 0)[0], yl])
    S.fleche(X(-1.55), X(2.55) + [6, 0], 'g')
    S.texte(X(2.55) + [12, 0], 'ℝ', 'g', ancre='start')
    for k in range(-1, 3):
        S.ligne(X(k) + [0, -5], X(k) + [0, 5], 'g')
        S.texte(X(k) + [0, -16], str(k) if k >= 0 else '−1', 'g', taille=14)
    # intervalles J + k, deux à deux disjoints (ouverts adjacents)
    ints = [(J[0] + k, J[1] + k, k) for k in (-1, 0, 1)]
    for (a, b, _), (a2, _, _) in zip(ints, ints[1:]):
        assert b <= a2
    for a, b, k in ints:
        c = 'r' if k == 0 else 'b'
        S.ligne(X(a) + [4, 0], X(b) + [-4, 0], c, l=4.5)
        S.point(X(a), c, r=4, creux=True); S.point(X(b), c, r=4, creux=True)
        S.point(X(x + k), c, r=3.6)
        lab = {-1: 'J − 1', 0: 'J', 1: 'J + 1'}[k]
        S.texte(X((a + b) / 2) + [0, 24], lab, c)
    S.texte(X(x) + [0, -16], 'x', 'r')
    # cercle : p(t) dessiné à l'angle 2πt (simple dessin, sans étiquette trigonométrique)
    C, r = np.array([260.0, 300.0]), 82.0
    pc = lambda t: C + r * np.array([math.cos(2 * math.pi * float(t)), -math.sin(2 * math.pi * float(t))])
    trou = J[1]                                       # p(x + 1/2), seul point du cercle hors de U
    assert (J[0] - trou) % 1 == 0
    ts = np.linspace(float(J[0]), float(J[1]), 200)[3:-3]
    S.cercle(C, r, 'g')
    S.poly(np.array([pc(t) for t in ts]), 'r', l=4)
    S.point(pc(trou), 'r', r=4.2, creux=True)
    S.point(pc(x), 'r', r=4)
    S.texte(pc(x) + 18 * unit(pc(x) - C), 'p(x)', 'r', ancre='start')
    S.texte(C + [r + 16, 50], 'U = p(J)', 'r', ancre='start')
    S.texte(C + [-r - 12, 30], 'S^1', 'g', ancre='end')
    # p
    a, b = np.array([C[0] - 150, 120.0]), np.array([C[0] - 150, 250.0])
    S.fleche(a, b, 't')
    S.texte((a + b) / 2 + [-10, 0], 'p', ancre='end')
    return S


# ---------------------------------------------------------------- hom : homologie singulière
def _face(i, t):
    """δ_i : insère un 0 en position i."""
    return tuple(t[:i]) + (0,) + tuple(t[i:])


def _bord(chaine):
    """Bord d'une combinaison {simplexe (tuple de sommets): coefficient}."""
    res = {}
    for s, c in chaine.items():
        for i in range(len(s)):
            f_ = s[:i] + s[i + 1:]
            res[f_] = res.get(f_, 0) + (-1) ** i * c
    return {k: v for k, v in res.items() if v}


@schema('h-singuliere')
def h_singuliere():
    # images des sommets de Δ_1 par δ_i : (1,0) ↦ sommet de départ, (0,1) ↦ sommet d'arrivée
    aretes = []
    for i in range(3):
        dep, arr = _face(i, (1, 0)), _face(i, (0, 1))
        aretes.append((i, dep.index(1), arr.index(1), (-1) ** i))
    assert aretes == [(0, 1, 2, 1), (1, 0, 2, -1), (2, 0, 1, 1)]
    S = Schema(470, 330, 'Simplexe Δ_2 et ses trois faces orientées, avec les signes du bord')
    c, Rr = np.array([235.0, 185.0]), 150.0
    E = [c + Rr * np.array([math.cos(a), -math.sin(a)]) for a in (math.radians(210), math.radians(330), math.radians(90))]
    E = [np.array([e[0], e[1]]) for e in E]
    S.surface(E, 'r')
    for i, a, b, sg in aretes:
        p, q = E[a], E[b]
        S.ligne(p, q, 'r')
        m = (p + q) / 2
        S.pointe(m + 6 * unit(q - p), q - p, 'r', taille=12, largeur=5)
        n = unit([(q - p)[1], -(q - p)[0]])
        if np.dot(n, m - c) < 0:
            n = -n
        lab = ('+ ' if sg > 0 else '− ') + f'σ ∘ δ_{i}'
        an = 'middle' if abs(n[0]) < 0.3 else 'start' if n[0] > 0 else 'end'
        S.texte(m + (24 if an == 'middle' else 18) * n, lab, 'r', ancre=an, taille=16)
    for k, (dx, dy, an) in enumerate([(-10, 10, 'end'), (10, 10, 'start'), (0, -16, 'middle')]):
        S.point(E[k], 't', r=3.6)
        S.texte(E[k] + [dx, dy], f'e_{k}', ancre=an)
    S.texte(c + [0, 22], 'Δ_2', 'g')
    return S


@schema('h-homotopie')
def h_homotopie():
    # n = 1 : Pσ = [v0, w0, w1] − [v0, v1, w1]
    P = {('v0', 'w0', 'w1'): 1, ('v0', 'v1', 'w1'): -1}
    attendu = {('w0', 'w1'): 1, ('v0', 'v1'): -1,          # g∘σ − f∘σ
               ('v1', 'w1'): -1, ('v0', 'w0'): 1}          # − P(∂σ), ∂σ = σ(e1) − σ(e0)
    assert _bord(P) == attendu                              # la diagonale [v0, w1] se compense
    S = Schema(480, 340, 'Opérateur prisme pour n = 1')
    o, L, H = np.array([150.0, 280.0]), 200.0, 200.0
    v0, v1, w0, w1 = o, o + [L, 0], o + [0, -H], o + [L, -H]
    S.surface([v0, w0, w1], 'r')
    S.surface([v0, v1, w1], 'b')
    S.ligne(v0, w1, 'g', d=True)
    S.ligne(v0, v1, 't'); S.ligne(w0, w1, 't')
    S.ligne(v0, w0, 'g', l=2); S.ligne(v1, w1, 'g', l=2)
    for p, q in [(v0, v1), (w0, w1), (v0, w0), (v1, w1)]:
        S.pointe((p + q) / 2 + 6 * unit(q - p), q - p, 't' if p[1] == q[1] else 'g', taille=11, largeur=5)
    S.texte((v0 + w0 + w1) / 3, '+', 'r', taille=34)
    S.texte((v0 + v1 + w1) / 3, '−', 'b', taille=34)
    S.texte((v0 + v1) / 2 + [0, 22], 'f ∘ σ')
    S.texte((w0 + w1) / 2 + [0, -18], 'g ∘ σ')
    S.texte((v0 + w0) / 2 + [-12, 0], 'P(σ ∘ δ_1)', 'g', ancre='end', taille=16)
    S.texte((v1 + w1) / 2 + [12, 0], 'P(σ ∘ δ_0)', 'g', ancre='start', taille=16)
    for p, lab, d, an in [(v0, 'v_0', [-8, 14], 'end'), (v1, 'v_1', [8, 14], 'start'),
                          (w0, 'w_0', [-8, -12], 'end'), (w1, 'w_1', [8, -12], 'start')]:
        S.point(p, 't', r=3.4)
        S.texte(p + d, lab, ancre=an)
    return S


@schema('h-subdivision')
def h_subdivision():
    # formules de la fiche : Sλ = b_λ · S(∂λ), avec S[∅] = [∅] ; coordonnées barycentriques exactes
    from fractions import Fraction as Fr
    def ajoute(a, b, c=1):
        r = dict(a)
        for k, v in b.items():
            r[k] = r.get(k, 0) + c * v
        return {k: v for k, v in r.items() if v}
    def bord(ch):
        r = {}
        for sm, c in ch.items():
            for i in range(len(sm)):
                r = ajoute(r, {sm[:i] + sm[i + 1:]: (-1) ** i * c})
        return r
    def bary(sm):
        return tuple(sum(v[k] for v in sm) / len(sm) for k in range(3))
    def Sd(ch):
        r = {}
        for sm, c in ch.items():
            if len(sm) == 0:
                r = ajoute(r, {(): c}); continue
            b = bary(sm)
            r = ajoute(r, {(b,) + t: v for t, v in Sd(bord({sm: 1})).items()}, c)
        return r
    e = tuple(tuple(Fr(int(i == j)) for j in range(3)) for i in range(3))
    S1 = Sd({e: 1}); S2 = Sd(S1)
    dinf = lambda x, y: max(abs(a - b) for a, b in zip(x, y))
    diam = lambda sm: max(dinf(a, b) for a in sm for b in sm)
    assert len(S1) == 6 and len(S2) == 36
    assert max(map(diam, S1)) == Fr(2, 3) and max(map(diam, S2)) == Fr(7, 18) <= Fr(4, 9)
    assert set(S1.values()) == {1, -1}
    S = Schema(540, 250, 'Première et deuxième subdivisions barycentriques du triangle')
    def plan(o, t):
        A, B, C = o + np.array([-110.0, 85]), o + np.array([110.0, 85]), o + np.array([0.0, -105])
        return float(t[0]) * A + float(t[1]) * B + float(t[2]) * C
    for o, ch in ((np.array([140.0, 130]), S1), (np.array([400.0, 130]), S2)):
        for sm, c in ch.items():
            pts = [plan(o, t) for t in sm]
            S.poly(pts, 'b' if c > 0 else 'g', ferme=True, rempli='b' if c > 0 else None, l=1.2)
        A, B, C = plan(o, e[0]), plan(o, e[1]), plan(o, e[2])
        S.poly([A, B, C], 't', ferme=True, l=1.8)
        S.point(plan(o, bary(e)), 'r', r=4.2)
    S.texte([140, 238], 'S ι_2', 't', taille=16)
    S.texte([400, 238], 'S^2 ι_2', 't', taille=16)
    return S


@schema('h-petites-chaines')
def h_petites_chaines():
    S = Schema(500, 300, 'Subdivision d’un simplexe trop grand en morceaux contenus dans U ou dans V')
    cU, cV, rx, ry = np.array([175.0, 150.0]), np.array([325.0, 150.0]), 125.0, 112.0
    sig = bezier([80, 180], [300, 60], [480, 260], [330, 230], n=401)
    inU = dans_ellipse(cU, rx, ry, sig)
    inV = dans_ellipse(cV, rx, ry, sig)
    assert not inU.all() and not inV.all()                  # σ n'est ni dans U ni dans V

    def decoupe(m):
        bornes = [round(k * 400 / m) for k in range(m + 1)]
        return [(a, b) for a, b in zip(bornes, bornes[1:])]

    def lieu(a, b):
        return 'b' if inU[a:b + 1].all() else 'v' if inV[a:b + 1].all() else None
    assert any(lieu(a, b) is None for a, b in decoupe(2))     # une subdivision ne suffit pas
    morceaux = decoupe(4)
    cols = [lieu(a, b) for a, b in morceaux]
    assert None not in cols                                  # deux subdivisions suffisent
    # m(σ) selon la fiche : toute fenêtre de paramètres de longueur 1/2^k est dans U ou dans V
    def P(k):
        L = round(400 / 2 ** k)
        return all(lieu(i, i + L) is not None for i in range(0, 401 - L))
    m = next(k for k in range(12) if P(k))
    assert m == 3
    S.ellipse(cU, rx, ry, 'b', rempli='b')
    S.ellipse(cV, rx, ry, 'v', rempli='v')
    S.texte(cU + [-rx + 22, -ry + 18], 'U', 'b')
    S.texte(cV + [rx - 22, -ry + 18], 'V', 'v')
    for (a, b), c in zip(morceaux, cols):
        S.poly(sig[a:b + 1], c, l=4.2)
    for a, _ in morceaux[1:]:
        S.point(sig[a], 't', r=3.6)
    S.point(sig[0], 't', r=3.6); S.point(sig[-1], 't', r=3.6)
    S.texte(sig[0] + [-8, 6], 'σ', 'r', ancre='end')
    return S


@schema('h-spheres')
def h_spheres():
    S = Schema(480, 340, 'Recouvrement du cercle par U et V ; U ∩ V se rétracte sur S^0')
    C, R0 = np.array([240.0, 172.0]), 112.0
    img = lambda x: C + R0 * np.array([x[0], -x[1]])
    N, Sud = np.array([0.0, 1.0]), np.array([0.0, -1.0])
    eps = math.radians(9)
    th = lambda a, b: np.linspace(a, b, 120)
    pt = lambda t, r=1.0: C + R0 * r * np.stack([np.cos(t), -np.sin(t)], -1)
    # U = S¹ ∖ {N} (arc extérieur), V = S¹ ∖ {S} (arc intérieur)
    S.poly(pt(th(math.pi / 2 + eps, 2 * math.pi + math.pi / 2 - eps), 1.13), 'b')
    S.poly(pt(th(-math.pi / 2 + eps, 3 * math.pi / 2 - eps), 0.87), 'v')
    S.texte(pt(math.radians(225), 1.13) + [-10, 10], 'U', 'b', ancre='end')
    S.texte(pt(math.radians(140), 0.87) + [14, 10], 'V', 'v', ancre='start')
    # U ∩ V : deux arcs ouverts
    S.poly(pt(th(-math.pi / 2 + eps, math.pi / 2 - eps)), 'r', l=3.2)
    S.poly(pt(th(math.pi / 2 + eps, 3 * math.pi / 2 - eps)), 'r', l=3.2)
    # rétraction par F(x, t) = (x_1, (1 − t) x_2) / ‖…‖ : on suit quelques points
    for a in (60, 120, 240, 300):
        x = np.array([math.cos(math.radians(a)), math.sin(math.radians(a))])
        ts = np.linspace(0, 0.85, 40)
        chem = np.array([[x[0], (1 - t) * x[1]] / np.hypot(x[0], (1 - t) * x[1]) for t in ts])
        assert np.allclose(np.hypot(chem[:, 0], chem[:, 1]), 1)
        fin = np.array([x[0], 0]) / abs(x[0])
        assert np.allclose(fin, [np.sign(x[0]), 0])        # r(x) = (signe de x_1, 0)
    for a in (45, 135, 225, 315):                          # pointes vers S^0 sur U ∩ V
        p = np.array([math.cos(math.radians(a)), math.sin(math.radians(a))])
        tang = np.array([0.0, -np.sign(p[1])]) - np.dot([0.0, -np.sign(p[1])], p) * p
        S.pointe(img(p), [tang[0], -tang[1]], 'r', taille=13, largeur=6)
    for p in (N, Sud):
        S.point(img(p), 'g', r=4.4, creux=True)
    S.texte(img(N) + [0, -16], 'N', 'g')
    S.texte(img(Sud) + [0, 18], 'S', 'g')
    for p, an, dx in [((1, 0), 'start', 12), ((-1, 0), 'end', -12)]:
        S.point(img(p), 't', r=4.4)
        S.texte(img(p) + [dx, 0], '', ancre=an)
    S.texte(img((1, 0)) + [14, 0], 'S^0', ancre='start')
    S.texte(img((-1, 0)) + [-14, 0], 'S^0', ancre='end')
    S.texte(C + [0, 0], 'U ∩ V', 'r')
    return S


@schema('h-applications')
def h_applications():
    x, fx = np.array([0.3, 0.2]), np.array([-0.2, -0.1])
    u = x - fx
    xu, uu, xx = x @ u, u @ u, x @ x
    t = (-xu + math.sqrt(xu ** 2 + uu * (1 - xx))) / uu
    r = x + t * u
    assert abs(np.linalg.norm(r) - 1) < 1e-12 and t > 0
    assert np.allclose(r, [0.8485, 0.5291], atol=5e-5)
    S = Schema(440, 330, 'Construction de la rétraction r à partir de f sans point fixe')
    Rp = Repere(-1.25, 1.25, -1.15, 1.15, 70, 15, 300, 300 * 2.3 / 2.5)
    C = Rp(0, 0); rr = Rp(1, 0)[0] - C[0]
    S.cercle(C, rr, 't', rempli='g')
    S.texte(Rp(-0.72, -0.86) + [-14, 10], 'D^n', 'g', ancre='end')
    S.ligne(Rp(*fx), Rp(*x), 'g', d=True)
    S.ligne(Rp(*x), Rp(*r), 'r')
    S.pointe(Rp(*(x + 0.55 * t * u)), Rp(*u) - C, 'r', taille=11, largeur=5)
    S.point(Rp(*fx), 'b', r=4); S.texte(Rp(*fx) + [-8, 12], 'f(x)', 'b', ancre='end')
    S.point(Rp(*x), 't', r=4); S.texte(Rp(*x) + [4, 18], 'x', ancre='start')
    S.point(Rp(*r), 'r', r=4.4); S.texte(Rp(*r) + [10, -8], 'r(x)', 'r', ancre='start')
    S.texte(Rp(1, 0) + [10, 30], 'S^{n−1}', ancre='start')
    return S


# ---------------------------------------------------------------- grtop : groupes topologiques
@schema('gt-sous-groupes')
def gt_sous_groupes():
    S = Schema(500, 300, 'Un sous-groupe ouvert H et ses classes à gauche gH')
    x0, x1, y0, y1 = 20.0, 480.0, 30.0, 270.0
    ys = np.linspace(y0, y1, 60)
    nb = 5
    bords = [x0 + (x1 - x0) * k / nb for k in range(nb + 1)]
    courbe = lambda k: np.stack([bords[k] + (9 * np.sin((ys - y0) / 38 + 1.3 * k) if 0 < k < nb else 0 * ys), ys], 1)
    bandes = [np.vstack([courbe(k), courbe(k + 1)[::-1]]) for k in range(nb)]
    iH, i1 = 1, 3
    for k, b in enumerate(bandes):
        S.surface(b, 'r' if k == iH else 'b')
    for k in range(1, nb):
        S.poly(courbe(k), 'g')
    S.rect(x0, y0, x1 - x0, y1 - y0, 't')
    e = np.array([(bords[iH] + bords[iH + 1]) / 2, 175.0])
    g1 = e + [(i1 - iH) * (x1 - x0) / nb, 0]
    rV = 24
    assert dedans(bandes[iH], arc(e, rV, 0, 2 * np.pi, 40)).all()
    assert dedans(bandes[i1], arc(g1, rV, 0, 2 * np.pi, 40)).all()
    S.cercle(e, rV, 'r', rempli='r')
    S.cercle(g1, rV, 'b', rempli='b')
    S.point(e, 'r', r=4); S.point(g1, 'b', r=4)
    S.texte(e + [0, 14], 'e', 'r')
    S.texte(g1 + [0, 14], 'g_1', 'b')
    S.texte(e + [rV + 6, -rV], 'V', 'r', ancre='start', taille=15)
    S.texte(g1 + [rV + 6, -rV], 'g_1V', 'b', ancre='start', taille=15)
    S.texte([e[0], y0 + 30], 'H', 'r')
    S.texte([g1[0], y0 + 30], 'g_1H', 'b')
    for k in (0, 2, 4):
        S.texte([(bords[k] + bords[k + 1]) / 2, y0 + 30], f'g_{ {0: 2, 2: 3, 4: 4}[k] }H'.replace(' ', ''), 'b', taille=15)
    a, b = e + [rV + 10, 50], g1 + [-rV - 10, 50]
    S.courbe_fleche(courbe_entre(a, b, 0.18), 't')
    S.texte((a + b) / 2 + [0, 34], 'x ↦ g_1x', taille=15)
    S.texte([x1 - 8, y1 + 16], 'G', ancre='end')
    return S


# ---------------------------------------------------------------- geoalg : géométrie algébrique
def _premiers(n):
    import sympy
    return list(sympy.primerange(2, n))


def _spec_z(S, ouvert=None):
    ps = _premiers(14)
    assert ps == [2, 3, 5, 7, 11, 13]
    xs = [60 + 62 * k for k in range(len(ps))]
    yl = 190.0
    pts = {p: np.array([x, yl]) for p, x in zip(ps, xs)}
    gen = np.array([250.0, 85.0])
    if ouvert is not None:
        dans = {p: (ouvert % p != 0) for p in ps}             # 6 ∉ pℤ ⇔ p ∤ 6
        assert [p for p in ps if not dans[p]] == [2, 3]
        assert ouvert != 0                                     # 6 ∉ (0) : (0) ∈ D(6)
        # région teintée : du milieu entre 3ℤ et 5ℤ jusqu'au bord droit, englobant (0)
        xa = (pts[3][0] + 2 * pts[5][0]) / 3 - 6
        reg = np.array([[xa - 8, yl + 52], [xa, yl - 30], [gen[0] - 70, gen[1] - 6], [gen[0] - 30, gen[1] - 40],
                        [gen[0] + 60, gen[1] - 40], [430, yl - 60], [490, yl - 30], [490, yl + 52]], float)
        for _ in range(4):                                     # lissage de Chaikin
            q = np.roll(reg, -1, axis=0)
            reg = np.vstack([np.stack([0.75 * reg + 0.25 * q, 0.25 * reg + 0.75 * q], 1).reshape(-1, 2)])
        S.poly(reg, 'r', ferme=True, rempli='r')
        assert dedans(reg, gen)[0]
        for p in ps:
            assert dedans(reg, pts[p])[0] == dans[p]
        S.texte([470, gen[1] + 10], 'D(6)', 'r', ancre='end')
    for p in ps:
        barre = ouvert is not None and ouvert % p == 0
        S.point(pts[p], 'g' if barre else 't', r=4.4)
        S.texte(pts[p] + [0, 26], f'{p}ℤ', 'g' if barre else 't')
        if barre:
            S.ligne(pts[p] + [-18, 14], pts[p] + [18, 38], 'g')
    S.texte([xs[-1] + 52, yl + 26], '…')
    S.point(gen, 'r' if ouvert is not None else 't', r=5)
    S.texte(gen + [0, -20], '(0)', 'r' if ouvert is not None else 't')
    return pts, gen


@schema('ga-spectre')
def ga_spectre():
    S = Schema(500, 250, 'Le spectre de ℤ')
    _spec_z(S)
    return S


@schema('ga-points')
def ga_points():
    S = Schema(500, 262, 'L’ouvert D(6) de Spec ℤ contient le point générique')
    _spec_z(S, ouvert=6)
    return S


@schema('ga-zeros')
def ga_zeros():
    import sympy as sp
    X1, X2 = sp.symbols('X1 X2')
    sol = sp.solve([X1 ** 2 + X2 ** 2 - 1, X2 - (X1 + 1) / 2], [X1, X2], dict=True)
    sol = sorted((s_[X1], s_[X2]) for s_ in sol)
    assert sol == [(-1, 0), (sp.Rational(3, 5), sp.Rational(4, 5))]
    S = Schema(530, 260, 'Un cercle coupe une droite en deux points ; la sinusoïde coupe l’axe une infinité de fois')
    # à gauche : cercle et droite
    Rg = Repere(-1.6, 1.6, -1.45, 1.45, 15, 30, 200, 200 * 2.9 / 3.2)
    S.fleche(Rg(-1.55, 0), Rg(1.55, 0), 'g'); S.fleche(Rg(0, -1.12), Rg(0, 1.4), 'g')
    th = np.linspace(0, 2 * np.pi, 200)
    S.poly(Rg(np.cos(th), np.sin(th)), 'r', ferme=True)
    xs = np.array([-1.55, 1.55])
    S.ligne(Rg(xs[0], (xs[0] + 1) / 2), Rg(xs[1], (xs[1] + 1) / 2), 'b')
    for a, b in sol:
        S.point(Rg(float(a), float(b)), 't', r=4.4)
    S.texte(Rg(0, -1) + [0, 34], 'Z(X_1^2 + X_2^2 − 1)', 'r', taille=15)
    # à droite : y = sin x et l'axe y = 0
    Rd = Repere(-0.4, 10.2, -1.4, 1.4, 255, 30, 260, 200 * 2.8 / 2.9)
    S.fleche(Rd(-0.4, 0), Rd(10.2, 0), 'g')
    S.fleche(Rd(0, -1.3), Rd(0, 1.35), 'g')
    Rd.graphe(S, np.sin, -0.3, 10.0, 'r')
    zs = [k * math.pi for k in range(4)]
    assert all(abs(math.sin(z)) < 1e-12 for z in zs)
    for z in zs:
        S.point(Rd(z, 0), 't', r=4.4)
    S.texte(Rd(10.2, 0) + [-4, 16], '…', ancre='end')
    S.texte(Rd(1.6, 1) + [0, -14], 'y = `sin` x', 'r', taille=15)
    S.texte(Rd(7.85, 0) + [0, 18], 'y = 0', 'g', taille=15)
    return S


@schema('c-racines-carrees')
def c_racines_carrees():
    a, b = -5, -12
    mod = math.isqrt(a * a + b * b)
    assert mod * mod == a * a + b * b == 169
    eps = 1 if b >= 0 else -1
    x2, y2 = Fr(mod + a, 2), Fr(mod - a, 2)
    assert (x2, y2) == (4, 9)
    w = complex(math.isqrt(int(x2)), eps * math.isqrt(int(y2)))
    z, faux = complex(a, b), complex(2, 3)
    assert w == complex(2, -3) and w * w == z and (-w) * (-w) == z
    assert faux * faux == complex(-5, 12) == z.conjugate()
    S = Schema(480, 410, 'Racines carrées de −5 − 12i et rôle du signe ε')
    u = 14.5
    R = Repere(-14, 17, -13.4, 13.4, 15, 12, 31 * u, 26.8 * u)
    P = lambda c: R(c.real, c.imag)
    # demi-plan Re ≥ 0, où la formule place w
    S.surface([R(0, -13.4), R(0, 13.4), R(9, 13.4), R(9, -13.4)], 'b')
    S.texte(R(9, 13.4) + [-6, 14], '`Re` ⩾ 0', 'b', ancre='end', taille=15)
    S.fleche(R(-8, 0), R(9, 0) + [8, 0], 'g')
    S.fleche(R(0, -13.4), R(0, 13.4) + [0, -2], 'g')
    S.texte(R(9, 0) + [14, 0], '`Re`', 'g', ancre='start', taille=15)
    S.texte(R(0, 13.4) + [-8, 8], '`Im`', 'g', ancre='end', taille=15)
    for k in (-5, 5):
        S.ligne(R(k, 0) + [0, -4], R(k, 0) + [0, 4], 'g')
    S.texte(R(-5, 0) + [0, 15], '−5', 'g', taille=13)
    S.texte(R(5, 0) + [0, 15], '5', 'g', taille=13)
    for k in (-10, 10):
        S.ligne(R(0, k) + [-4, 0], R(0, k) + [4, 0], 'g')
        S.texte(R(0, k) + [8, 0], str(k) if k > 0 else '−10', 'g', ancre='start', taille=13)
    # flèches « carré »
    S.courbe_fleche(courbe_entre(P(w) + [-4, 6], P(z) + [6, -4], -0.35), 'g', d=True)
    S.courbe_fleche(courbe_entre(P(faux) + [-4, -6], P(z.conjugate()) + [6, 4], 0.35), 'g', d=True)
    S.point(P(z), 'r', r=4.4)
    S.texte(P(z) + [-10, 0], 'z = −5 − 12i', 'r', ancre='end')
    S.point(P(w), 'r', r=4.4)
    S.texte(P(w) + [10, 4], 'w = 2 − 3i', 'r', ancre='start')
    S.point(P(-w), 'b', r=4)
    S.texte(P(-w) + [-10, 0], '−w', 'b', ancre='end')
    S.point(P(faux), 'g', r=4)
    S.texte(P(faux) + [10, -4], '2 + 3i', 'g', ancre='start')
    S.point(P(z.conjugate()), 'g', r=4)
    S.texte(P(z.conjugate()) + [-10, 0], '−5 + 12i = z̄', 'g', ancre='end')
    return S


@schema('ga-lemme-zariski')
def ga_lemme_zariski():
    # Tour K ⊂ F ⊂ L ; à gauche le cas algébrique (dimensions finies composées), à droite le cas
    # transcendant (F = A, contradiction). Disposition calculée : trois étages équidistants.
    S = Schema(600, 300, 'Lemme de Zariski : la tour K ⊂ F ⊂ L, cas algébrique et cas transcendant')
    xg, xd = 150, 380
    yL, yF, yK = 44, 150, 256
    assert yF - yL == yK - yF
    for xc, c in ((xg, 'b'), (xd, 'r')):
        for yy, nom in ((yL, 'L'), (yF, 'F'), (yK, 'K')):
            S.cercle([xc, yy], 19, c, rempli=c)
            S.texte([xc, yy], nom, c, taille=19)
        S.ligne([xc, yL + 19], [xc, yF - 19], c, l=1.8)
        S.ligne([xc, yF + 19], [xc, yK - 19], c, l=1.8, d=(c == 'r'))
    S.texte([xg, 14], 'x algébrique', 'b', ui=True, taille=14)
    S.texte([xd, 14], 'x transcendant', 'r', ui=True, taille=14)
    # annotations des étages
    S.texte([xg - 28, (yL + yF) / 2], 'dim finie', 'b', ancre='end', ui=True, taille=13)
    S.texte([xg - 28, (yL + yF) / 2 + 17], '(récurrence)', 'b', ancre='end', ui=True, taille=13)
    S.texte([xg - 28, (yF + yK) / 2], 'F = K[x]', 'b', ancre='end', taille=15)
    S.texte([xg - 28, (yF + yK) / 2 + 19], 'dim ≤ deg Q', 'b', ancre='end', ui=True, taille=13)
    S.texte([xd + 28, (yL + yF) / 2], 'dim finie', 'r', ancre='start', ui=True, taille=13)
    S.texte([xd + 28, (yL + yF) / 2 + 17], '(récurrence)', 'r', ancre='start', ui=True, taille=13)
    S.texte([xd + 28, (yF + yK) / 2 - 10], 'F = A,', 'r', ancre='start', taille=15)
    S.texte([xd + 80, (yF + yK) / 2 - 10], 'mais', 'r', ancre='start', ui=True, taille=13)
    S.texte([xd + 28, (yF + yK) / 2 + 14], '1/(1 + x f(x)) ∉ A', 'r', ancre='start', taille=15)
    S.texte([(xg + xd) / 2, (yF + yK) / 2 - 9], '⟹ L de dim', 't', ui=True, taille=13)
    S.texte([(xg + xd) / 2, (yF + yK) / 2 + 9], 'finie sur K', 't', ui=True, taille=13)
    return S


@schema('ta-revetement-0')
def ta_revetement_0():
    # p : ]0, 3/2[ → ℝ/ℤ, t ↦ classe de t ; voisinage U = p(]−ε, ε[) de p(0), ε = 0,15.
    eps = 0.15
    a, b = 0.0, 1.5
    morceaux = [(a, a + eps), (1 - eps, 1 + eps)]
    # les points de ]0, 3/2[ dont la classe est dans ]−ε, ε[ modulo 1 sont exactement ces deux morceaux
    ts = np.linspace(0.001, 1.499, 3000)
    dedans = [t for t in ts if min(t % 1, 1 - t % 1) < eps]
    assert all(any(u < t < v for u, v in morceaux) for t in dedans)
    S = Schema(560, 300, 'La restriction de ℝ → ℝ/ℤ à ]0, 3/2[ n’est pas un revêtement')
    X = lambda t: 50 + t * 300
    yl = 60
    S.ligne([X(a), yl], [X(b), yl], 'g', l=2)
    S.cercle([X(a), yl], 5, 'g', rempli=None); S.cercle([X(b), yl], 5, 'g', rempli=None)
    S.ligne([X(morceaux[0][0]), yl], [X(morceaux[0][1]), yl], 'r', l=6)
    S.ligne([X(morceaux[1][0]), yl], [X(morceaux[1][1]), yl], 'b', l=6)
    for t, nom in ((0, '0'), (1, '1'), (1.5, '3/2')):
        S.texte([X(t), yl + 24], nom, 'g', taille=15)
    S.texte([X(0.07), yl - 20], ']0, ε[', 'r', taille=15)
    S.texte([X(1), yl - 20], ']1 − ε, 1 + ε[', 'b', taille=15)
    # cercle ℝ/ℤ : l'angle 2πt, compté à partir du point p(0) à droite
    O, R0 = np.array([420.0, 190.0]), 72.0
    P = lambda t: O + R0 * np.array([math.cos(2 * math.pi * t), -math.sin(2 * math.pi * t)])
    S.cercle(O, R0, 'g')
    S.poly(np.array([P(t) for t in np.linspace(-eps, eps, 60)]), 'b', l=6)
    S.poly(np.array([P(t) for t in np.linspace(0, eps, 40)]), 'r', l=3)
    S.point(P(0), 't', r=4)
    S.texte(P(0) + [14, 0], 'p(0)', 't', ancre='start', taille=15)
    S.texte(O + [0, R0 + 22], 'ℝ/ℤ', 'g', taille=16)
    S.texte(P(-eps) + [16, 12], 'U', 'b', ancre='start', taille=16)
    S.fleche([X(0.75), yl + 40], [O[0] - R0 - 20, O[1] - 30], 'g', retrait=4)
    S.texte([X(0.55), yl + 92], 'p', 'g', taille=17)
    return S
