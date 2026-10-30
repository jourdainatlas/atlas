"""Schémas du chapitre « Classification des revêtements » (graphe topalg-revetements) : construction des
feuillets U_ξ par les classes de chemins, hélice du revêtement universel ℝ → S¹, revêtement p₃ (z ↦ z³)
dessiné par deux cercles, l'angle étant triplé, feuillets antipodaux de S¹ → ℝP¹, morceau de l'arbre de Cayley du groupe libre F(a, b).
Positions calculées, propriétés vérifiées par assert."""
import math

import numpy as np
from matplotlib.path import Path as _Path
from edifice_schemas import schema
from edifice_svg import Schema, bezier, blob


def _dans(contour, pts):
    return _Path(np.asarray(contour)).contains_points(np.atleast_2d(pts))


def _indice(courbe, c):
    """Indice d'une courbe fermée (échantillonnée) autour du point c."""
    z = (courbe[:, 0] - c[0]) + 1j * (courbe[:, 1] - c[1])
    d = np.angle(np.roll(z, -1) / z)
    return d.sum() / (2 * math.pi)


@schema('rv-construction')
def rv_construction():
    S = Schema(520, 300, 'Les feuillets U_ξ du revêtement construit par les classes de chemins')
    B = blob([260, 150], 235, 128, graine=4, amplitude=0.05, n=200)
    trou_c, trou_r = np.array([250.0, 150.0]), 30.0
    Uc, Urx, Ury = np.array([400.0, 150.0]), 58.0, 74.0
    th = np.linspace(0, 2 * math.pi, 160, endpoint=False)
    U = np.stack([Uc[0] + Urx * np.cos(th), Uc[1] + Ury * np.sin(th)], -1)
    b0 = np.array([80.0, 160.0])
    x = np.array([378.0, 150.0])                                   # extrémité commune γ(1) = γ'(1)
    gam = bezier(b0, [160, 40], [330, 50], x, n=120)                 # au-dessus du trou
    gamp = bezier(b0, [160, 270], [330, 255], x, n=120)              # au-dessous du trou
    cibles = [np.array([425.0, 108.0]), np.array([432.0, 188.0])]
    etas = [bezier(x, [392, 122], [410, 106], cibles[0], n=40), bezier(x, [395, 175], [415, 192], cibles[1], n=40)]
    # vérifications : tout est dans B, le trou est hors de U et des chemins, les η restent dans U
    assert _dans(B, np.vstack([gam, gamp, U])).all()
    assert (np.linalg.norm(U - trou_c, axis=1) > trou_r + 20).all()
    for c in (gam, gamp):
        assert (np.linalg.norm(c - trou_c, axis=1) > trou_r + 8).all()
    for e in etas:
        assert _dans(U, e).all()
    assert _dans(U, x[None]).all() and not _dans(U, b0[None]).any()
    boucle = np.vstack([gam, gamp[::-1]])
    assert abs(abs(_indice(boucle, trou_c)) - 1) < 1e-6              # γ · γ̄′ fait le tour du trou

    S.poly(B, 'g', ferme=True)
    S.cercle(trou_c, trou_r, 'g', rempli='g')
    S.poly(U, 'b', ferme=True, rempli='b')
    S.poly(gam, 't', l=2.2)
    S.poly(gamp, 't', d=True, l=1.8)
    for e in etas:
        S.courbe_fleche(e, 'r', l=2.2)
    S.point(b0, 't', r=4)
    S.point(x, 't', r=4)
    for c in cibles:
        S.point(c, 'r', r=3.4)
    S.texte(b0 + [-12, 0], 'b_0', ancre='end')
    S.texte(gam[60] + [0, -16], 'γ')
    S.texte(gamp[60] + [0, 18], 'γ′')
    S.texte(x + [-14, 0], 'γ(1)', ancre='end', taille=15)
    S.texte(Uc + [0, -Ury - 14], 'U', 'b')
    S.texte(cibles[0] + [10, -6], 'η', 'r', ancre='start')
    S.texte(B[50] + [10, 6], 'B', 'g', ancre='start')
    return S


def _projection(o, ex, ey, ez):
    """Projection oblique : point (X, Y, Z) de l'espace (Z vertical) vers l'image."""
    o, ex, ey, ez = map(lambda v: np.asarray(v, float), (o, ex, ey, ez))
    return lambda P: o + np.asarray(P, float)[..., :1] * ex + np.asarray(P, float)[..., 1:2] * ey \
        + np.asarray(P, float)[..., 2:3] * ez


def _demi_cercles(S, proj, Bb):
    """Cercle horizontal en projection : moitié arrière (y < 0) grise et fine, moitié avant à l'encre."""
    devant = Bb[:, 1] >= 0
    k = int(np.argmax(~devant))                                      # recommencer à un point arrière
    Bb, devant = np.roll(Bb, -k, axis=0), np.roll(devant, -k)
    Bb, devant = np.vstack([Bb, Bb[:1]]), np.append(devant, devant[0])
    idx = np.flatnonzero(np.diff(devant.astype(int))) + 1
    for m in np.split(np.arange(len(Bb)), idx):
        fin = min(m[-1] + 2, len(Bb))
        S.poly(proj(Bb[m[0]:fin]), 't' if devant[m[0]] else 'g', l=2.2 if devant[m[0]] else 1.4)


@schema('rv-cercle')
def rv_cercle():
    S = Schema(500, 380, 'L’hélice, revêtement universel du cercle')
    R, pas = 1.0, 0.9                                                # rayon et hauteur d'une spire
    proj = _projection([235, 335], [150, 0], [0, 38], [0, -102])
    base = lambda x: np.stack([R * np.cos(2 * math.pi * x), R * np.sin(2 * math.pi * x), np.zeros_like(x)], -1)
    haut = 0.55
    helice = lambda x: np.stack([R * np.cos(2 * math.pi * x), R * np.sin(2 * math.pi * x), haut + pas * (x + 0.25)], -1)
    xs = np.linspace(-0.25, 2.25, 1201)
    H, Bc = helice(xs), base(xs)
    assert np.allclose(H[:, :2], Bc[:, :2])                          # la projection verticale envoie x sur p(x)
    assert np.allclose(helice(np.array([0.0, 1.0, 2.0]))[:, :2], base(np.array([0.0]))[:, :2])  # fibre de e
    assert np.allclose(helice(xs + 1)[:, 2] - H[:, 2], pas)          # τ₁ : montée d'une spire
    devant = H[:, 1] > 0                                             # y > 0 : moitié avant (vers le bas de l'image)
    idx = np.flatnonzero(np.diff(devant.astype(int))) + 1
    for m in np.split(np.arange(len(xs)), idx):
        fin = min(m[-1] + 2, len(xs))
        S.poly(proj(H[m[0]:fin]), 't' if devant[m[0]] else 'g', l=2.2 if devant[m[0]] else 1.4)
    _demi_cercles(S, proj, base(np.linspace(0, 1, 240, endpoint=False)))
    un = np.linspace(0.0, 1.0, 400)                                  # spire relevée de 0 à 1, en bleu
    S.poly(proj(helice(un)), 'b', l=3.4)
    e3 = base(np.array([0.0]))[0]
    S.ligne(proj(e3), proj(e3 + [0, 0, haut + pas * 2.55]), 'g', d=True)
    for k in range(3):
        P = proj(helice(np.array([float(k)]))[0])
        assert abs(P[0] - proj(e3)[0]) < 1e-9                        # à la verticale de e
        S.point(P, 'r', r=4.2)
        S.texte(P + [14, 0], str(k), 'r', ancre='start')
    S.point(proj(e3), 'r', r=4.2)
    S.texte(proj(e3) + [14, 6], 'e', 'r', ancre='start')
    a0 = proj(np.array([-1.0, 0.0, haut + 0.2])) + [-30, 0]
    S.fleche(a0, proj(np.array([-1.0, 0.0, 0.0])) + [-30, -10], 'g')
    S.texte(a0 + [-10, 40], 'p', 'g', ancre='end')
    t0 = proj(helice(np.array([0.5]))[0]) + [-24, 0]
    t1 = proj(helice(np.array([1.5]))[0]) + [-24, 0]
    S.courbe_fleche(bezier(t0, t0 + [-40, -20], t1 + [-40, 20], t1, n=40), 'b', l=1.6)
    S.texte((t0 + t1) / 2 + [-46, 0], 'τ_1', 'b', ancre='end')
    S.texte(proj(np.array([R * math.cos(-2.2), R * math.sin(-2.2), 0.0])) + [-6, 22], 'S^1', 'g', ancre='end')
    S.texte(proj(helice(np.array([2.25]))[0]) + [14, 2], 'ℝ', 'g', ancre='start')
    return S


@schema('rv-cercle-2')
def rv_cercle_2():
    S = Schema(500, 420, 'Le revêtement à trois feuillets p₃ du cercle')
    n = 3
    ch, cb, r = np.array([250.0, 120.0]), np.array([250.0, 330.0]), 82.0
    # le point p(x) est dessiné sur un cercle à l'angle 2πx (sens direct, y vers le haut)
    pt = lambda c, x: c + r * np.array([np.cos(2 * math.pi * x), -np.sin(2 * math.pi * x)]).T
    p3 = lambda x: (n * x) % 1
    xs = np.linspace(0, 1, 361)
    S.cercle(ch, r, 't')
    S.cercle(cb, r, 't')
    tiers = np.linspace(0, 1 / n, 200)                               # relèvement de α₁ issu de e
    assert np.allclose(p3(tiers[:-1]), n * tiers[:-1])               # il parcourt toute la base une fois
    S.courbe_fleche(pt(ch, tiers), 'b', l=3.6)
    fib = np.arange(n) / n
    assert np.allclose(p3(fib), 0)                                   # fibre de e : p(k/3)
    for k, x in enumerate(fib):
        S.point(pt(ch, x), 'r', r=4.6)
    y = 0.15
    pre = (y + np.arange(n)) / n
    assert np.allclose(p3(pre), y)                                   # trois antécédents de p(y)
    for x in pre:
        S.point(pt(ch, x), 'v', r=4.0)
    S.point(pt(cb, y), 'v', r=4.0)
    S.point(pt(cb, 0.0), 'r', r=4.6)
    S.texte(pt(ch, 0.0) + [14, 0], 'e', 'r', ancre='start')
    S.texte(pt(ch, 1 / 3) + [-10, -12], 'p(1/3)', 'r', ancre='end', taille=15)
    S.texte(pt(ch, 2 / 3) + [-10, 12], 'p(2/3)', 'r', ancre='end', taille=15)
    S.texte(pt(cb, 0.0) + [14, 0], 'e', 'r', ancre='start')
    S.texte(pt(cb, y) + [12, -8], 'p(x)', 'v', ancre='start', taille=15)
    S.fleche(ch + [r + 46, 40], cb + [r + 46, -40], 'g')
    S.texte((ch + cb) / 2 + [r + 58, 0], 'p_3', 'g', ancre='start')
    S.texte(ch + [-r - 16, 0], 'S^1', ancre='end')
    S.texte(cb + [-r - 16, 0], 'S^1', ancre='end')
    return S


@schema('rv-projectif')
def rv_projectif():
    S = Schema(460, 330, 'Les deux feuillets antipodaux de S¹ au-dessus de q(U_x)')
    c, r = np.array([230.0, 165.0]), 120.0
    x = np.array([math.cos(math.radians(35)), math.sin(math.radians(35))])     # coordonnées mathématiques
    P = lambda v: c + r * np.array([v[0], -v[1]])
    phi0 = math.atan2(x[1], x[0])
    marge = 0.06
    tU = np.linspace(phi0 - math.pi / 2 + marge, phi0 + math.pi / 2 - marge, 120)
    ptsU = np.stack([np.cos(tU), np.sin(tU)], -1)
    assert (ptsU @ x > 0).all() and ((-ptsU) @ x < 0).all()           # U_x et U_{−x} = −U_x disjoints
    S.cercle(c, r, 'g')
    S.poly(np.array([P(v) for v in ptsU]), 'r', l=4)
    S.poly(np.array([P(-v) for v in ptsU]), 'b', l=4)
    # extrémités exclues (points creux) : ⟨x, y⟩ = 0
    for s in (-1, 1):
        v = np.array([math.cos(phi0 + s * math.pi / 2), math.sin(phi0 + s * math.pi / 2)])
        assert abs(v @ x) < 1e-12
        S.point(P(v), 'g', r=4, creux=True)
    S.ligne(P(1.18 * x), P(-1.18 * x), 'g', d=True)
    S.point(c, 'g', r=2.6)
    S.point(P(x), 'r', r=4.2)
    S.point(P(-x), 'b', r=4.2)
    S.texte(P(1.16 * x) + [8, -6], 'x', 'r', ancre='start')
    S.texte(P(-1.16 * x) + [-8, 6], '−x', 'b', ancre='end')
    y = np.array([math.cos(phi0 + 0.9), math.sin(phi0 + 0.9)])
    assert y @ x > 0
    S.point(P(y), 't', r=3.6)
    S.point(P(-y), 't', r=3.6)
    S.ligne(P(y), P(-y), 'g', d=True)
    S.texte(P(1.12 * y) + [-4, -4], 'y', ancre='end')
    S.texte(P(-1.12 * y) + [4, 6], '−y', ancre='start')
    S.texte(P(np.array([math.cos(phi0 - 0.6), math.sin(phi0 - 0.6)]) * 1.2) + [6, 0], 'U_x', 'r', ancre='start')
    S.texte(P(-np.array([math.cos(phi0 - 0.6), math.sin(phi0 - 0.6)]) * 1.2) + [-6, 0], 'U_{−x}', 'b', ancre='end')
    return S


@schema('rv-bouquet')
def rv_bouquet():
    S = Schema(500, 470, 'Un morceau de l’arbre de Cayley du groupe libre F(a, b)')
    pas = {'a': np.array([1.0, 0.0]), 'A': np.array([-1.0, 0.0]), 'b': np.array([0.0, 1.0]), 'B': np.array([0.0, -1.0])}
    inv = {'a': 'A', 'A': 'a', 'b': 'B', 'B': 'b'}
    L, prof = 112.0, 3
    mots = ['']
    for k in range(prof):
        mots += [w + x for w in mots if len(w) == k for x in 'aAbB' if not (w and w[-1] == inv[x])]
    pos = {'': np.zeros(2)}
    for w in mots[1:]:
        pos[w] = pos[w[:-1]] + pas[w[-1]] * L / 2 ** (len(w) - 1)
    assert len(mots) == 1 + 4 + 12 + 36
    P = np.array([pos[w] for w in mots])
    dmin = min(np.linalg.norm(P[i] - P[j]) for i in range(len(P)) for j in range(i))
    assert dmin > 13.9                                                # sommets distincts et séparés
    aretes = [(w[:-1], w) for w in mots[1:]]

    def coupe(p1, p2, q1, q2):
        d = lambda a, b, c: (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])
        return d(p1, p2, q1) * d(p1, p2, q2) < -1e-9 and d(q1, q2, p1) * d(q1, q2, p2) < -1e-9

    def chevauche(p1, p2, q1, q2):
        """Segments alignés qui se recouvrent sur plus d'un point."""
        u = p2 - p1
        if abs(u[0] * (q2 - q1)[1] - u[1] * (q2 - q1)[0]) > 1e-9:
            return False
        if abs(u[0] * (q1 - p1)[1] - u[1] * (q1 - p1)[0]) > 1e-9:
            return False
        t = sorted([((q1 - p1) @ u) / (u @ u), ((q2 - p1) @ u) / (u @ u)])
        return min(1, t[1]) - max(0, t[0]) > 1e-9

    for i, (a1, a2) in enumerate(aretes):
        for b1, b2 in aretes[:i]:
            p1, p2, q1, q2 = pos[a1], pos[a2], pos[b1], pos[b2]
            assert not coupe(p1, p2, q1, q2) and not chevauche(p1, p2, q1, q2)   # l'arbre ne se recoupe pas
    o = np.array([250.0, 235.0])
    img = lambda v: o + np.array([v[0], -v[1]])
    for a1, a2 in sorted(aretes, key=lambda e: (len(e[1]), e[1])):
        col = 'r' if a2[-1] in 'aA' else 'b'
        S.ligne(img(pos[a1]), img(pos[a2]), col, l=2.6 if len(a2) == 1 else (2.0 if len(a2) == 2 else 1.5))
    for w in mots:
        S.point(img(pos[w]), 't', r=4.2 if not w else (3.4 if len(w) < 3 else 2.4))
    noms = {'': '1', 'a': 'a', 'A': 'a^{−1}', 'b': 'b', 'B': 'b^{−1}', 'ab': 'ab', 'ba': 'ba'}
    dec = {'': [12, -12], 'a': [8, -12], 'A': [-8, -12], 'b': [12, -8], 'B': [12, 8], 'ab': [8, -14], 'ba': [8, 12]}
    for w, s in noms.items():
        ancre = 'end' if dec[w][0] < 0 else 'start'
        S.texte(img(pos[w]) + dec[w], s, ancre=ancre, taille=15)
    return S
