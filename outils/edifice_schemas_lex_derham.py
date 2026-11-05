"""Schémas des exemples du lexique, théorie derham (cohomologie de de Rham) : contenu/exemples/derham.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 16 à 17 (mémo de
l'édifice, § 111). Toutes les positions sont calculées (numpy) à partir des formules des exemples, et ce que dit
chaque légende est vérifié par assert : appartenances, inclusions d'arcs dans des boules, intersections, sens de
parcours, étiquettes dans le cadre et sans chevauchement.
"""
import math
import re
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte, arc

W0 = 420
TL = 16
PI = math.pi


# ---------------------------------------------------------------------------------------------- auxiliaires

def _boite(p, s, taille=TL, ancre='middle', roman=False):
    """Boîte (x0, y0, x1, y1) d'une étiquette posée par Schema.texte (base centrale) ; largeur par excès."""
    w = largeur_texte(s, taille, roman)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    return (x0, p[1] - taille * 0.62, x0 + w, p[1] + taille * 0.62)


def _dans_cadre(S, b, marge=2):
    assert b[0] >= marge and b[2] <= S.w - marge and b[1] >= marge and b[3] <= S.h - marge, b


def _disjointes(boites, marge=1):
    for i, a in enumerate(boites):
        for b in boites[i + 1:]:
            assert a[2] + marge <= b[0] or b[2] + marge <= a[0] or a[3] + marge <= b[1] or b[3] + marge <= a[1], (a, b)


def _loin(b, pts, d=2):
    """Aucun point de la courbe pts n'entre dans la boîte b (agrandie de d)."""
    pts = np.asarray(pts, float).reshape(-1, 2)
    x0, y0, x1, y1 = b
    dedans = (pts[:, 0] > x0 - d) & (pts[:, 0] < x1 + d) & (pts[:, 1] > y0 - d) & (pts[:, 1] < y1 + d)
    assert not dedans.any(), b


def _etiq(S, p, s, c='t', taille=TL, ancre='middle', eviter=(), boites=None, roman=False):
    """Pose une étiquette après avoir vérifié qu'elle tient dans le cadre et évite les tracés donnés."""
    b = _boite(p, s, taille, ancre, roman)
    _dans_cadre(S, b)
    for pts in eviter:
        _loin(b, pts)
    if boites is not None:
        boites.append(b)
    S.texte(p, s, c, ancre=ancre, taille=taille, roman=roman)
    return b


def _vide_ams(S):
    """Dessine ∅ comme \\varnothing (police KaTeX_AMS), ainsi qu'il est écrit dans le texte des exemples, au lieu
    du ∅ ovale de KaTeX_Main que choisit edifice_svg (même auxiliaire que dans les lots rel et top)."""
    def coupe(m):
        attrs, txt = m.group(1), m.group(2)
        morceaux = re.split('(∅)', txt)
        out = []
        for k, c in enumerate(morceaux):
            if not c:
                continue
            a = attrs if k == 0 else re.sub(r' dy="[^"]*"', '', attrs)
            if c == '∅':
                a = a.replace('KaTeX_Main', 'KaTeX_AMS')
            out.append(f'<tspan{a}>{c}</tspan>')
        return ''.join(out)
    S.el = [re.sub(r'<tspan( font-family="KaTeX_Main"[^>]*)>([^<]*∅[^<]*)</tspan>', coupe, e) for e in S.el]
    return S


def _repere_egal(xmin, xmax, ymin, ymax, x0, y0, L, H):
    """Repère à échelle égale sur les deux axes, centré dans le rectangle (x0, y0, L, H)."""
    e = min(L / (xmax - xmin), H / (ymax - ymin))
    LL, HH = e * (xmax - xmin), e * (ymax - ymin)
    return Repere(xmin, xmax, ymin, ymax, x0 + (L - LL) / 2, y0 + (H - HH) / 2, LL, HH), e


def _carre(R, a, b, c, d):
    """Sommets (image) du rectangle [a, b] × [c, d]."""
    return np.array([R(a, c), R(b, c), R(b, d), R(a, d)])


def _fleche_milieu(S, pts, c, sens=1):
    """Pointe au milieu d'une courbe échantillonnée, dans le sens de parcours (sens = −1 : à rebours)."""
    pts = np.asarray(pts, float)
    m = len(pts) // 2
    a, b = pts[m - 1], pts[m + 1]
    S.pointe(pts[m] + 4.5 * sens * (b - a) / np.linalg.norm(b - a), sens * (b - a), c, taille=9, largeur=4)


# ================================================================================================== paquet 1

@schema('lex-pave-2')
def lex_pave_2():
    W, H = W0, 190
    S = Schema(W, H, 'Intersections de deux carrés : un pavé, un point, l’ensemble vide')
    cas = [((0, 2), (1, 3)), ((0, 1), (1, 2)), ((0, 1), (2, 3))]
    largeur = (W - 2 * 10 - 2 * 18) / 3
    boites = []
    for k, (A, B) in enumerate(cas):
        R, e = _repere_egal(-0.35, 3.35, -0.35, 3.35, 10 + k * (largeur + 18), 24, largeur, H - 52)
        lo, hi = max(A[0], B[0]), min(A[1], B[1])
        S.poly(_carre(R, A[0], A[1], A[0], A[1]), 'b', ferme=True)
        S.poly(_carre(R, B[0], B[1], B[0], B[1]), 'v', ferme=True)
        if k == 0:
            assert (lo, hi) == (1, 2)
            S.poly(_carre(R, lo, hi, lo, hi), 'g', ferme=True, rempli='g')
            # (0, 3) n'est dans aucun des deux carrés, alors que (0, 0) et (3, 3) sont dans la réunion
            dans = lambda p, Q: Q[0] <= p[0] <= Q[1] and Q[0] <= p[1] <= Q[1]
            assert not dans((0, 3), A) and not dans((0, 3), B) and dans((0, 0), A) and dans((3, 3), B)
            S.point(R(0, 3), 'r', r=4.2, creux=True)
            S.point(R(0, 0), 't', r=2.6)
            S.point(R(3, 3), 't', r=2.6)
            bord_vert = np.array([R(B[0], B[1]), R(B[1], B[1])])
            boites.append(_etiq(S, R(0, 3) + [2, -15], '(0, 3)', 'r', taille=14, ancre='start',
                                eviter=[np.linspace(*bord_vert, 50), np.linspace(R(B[0], B[0]), R(B[0], B[1]), 50)]))
        elif k == 1:
            assert lo == hi == 1                                  # intersection réduite au point (1, 1)
            S.point(R(1, 1), 'r', r=4.2)
        else:
            assert lo > hi                                        # intersection vide
        cx = R(1.5, 0)[0]
        boites.append(_etiq(S, (cx, H - 12), ['pavé', 'point', '∅'][k], 'g', taille=15, roman=True))
    _disjointes(boites)
    return _vide_ams(S)


@schema('lex-cube-unite-1')
def lex_cube_unite_1():
    W, H = W0, 270
    S = Schema(W, H, 'Le carré unité, boule pour la norme du maximum, et le disque euclidien de même centre')
    R, e = _repere_egal(-0.25, 1.25, -0.12, 1.12, 60, 8, W - 120, H - 16)
    c = np.array([0.5, 0.5])
    # I² est la boule fermée de centre c et de rayon 1/2 pour la norme du maximum
    g = np.linspace(0, 1, 41)
    P = np.array([(a, b) for a in g for b in g])
    assert (np.abs(P - c).max(axis=1) <= 0.5 + 1e-12).all()
    S.poly(_carre(R, 0, 1, 0, 1), 't', ferme=True, rempli='t')
    disque = R(*arc(c, 0.5, 0, 2 * PI, 200).T)
    S.poly(disque, 'b', ferme=True)
    coin = np.array([1.0, 1.0])
    d = np.linalg.norm(coin - c)
    assert abs(d - math.sqrt(2) / 2) < 1e-12 and d > 0.5           # le coin n'est pas dans le disque
    S.ligne(R(*c), R(*coin), 'r', d=True)
    S.point(R(*c), 't')
    S.point(R(*coin), 'r', r=3.8)
    bs = []
    bs.append(_etiq(S, R(*c) + [0, 16], 'c', 't', taille=17))
    bs.append(_etiq(S, R(*coin) + [10, -10], '(1, 1)', 'r', taille=16, ancre='start'))
    bs.append(_etiq(S, R(0, 1) + [-10, -2], 'I^2', 't', taille=17, ancre='end'))
    _disjointes(bs)
    for b in bs[:1]:
        _loin(b, disque, d=1)
    return S


@schema('lex-primitive-forme-2')
def lex_primitive_forme_2():
    W, H = W0, 270
    S = Schema(W, H, 'Une primitive locale de la forme angle sur une boule qui évite l’origine')
    R, e = _repere_egal(-1.35, 2.35, -1.3, 1.3, 10, 8, W - 20, H - 16)
    S.fleche(R(-1.35, 0), R(2.35, 0), 'g')
    S.fleche(R(0, -1.3), R(0, 1.3), 'g')
    # B = ]0, 2[ × ]−1, 1[ ne contient pas l'origine (bord gauche x = 0)
    S.poly(_carre(R, 0, 2, -1, 1), 'b', ferme=True, rempli='b')
    for k in range(-5, 6):
        a = k * PI / 14
        # le rayon d'angle a sort de B en x = 2 ou en |y| = 1
        L = min(2 / math.cos(a), 1 / abs(math.sin(a)) if k else np.inf)
        q = (L * math.cos(a), L * math.sin(a))
        assert 0 < q[0] <= 2 + 1e-12 and abs(q[1]) <= 1 + 1e-12
        mil = (0.5 * q[0], 0.5 * q[1])
        assert abs(math.atan2(mil[1], mil[0]) - a) < 1e-12           # arctan(y/x) constante (= a) sur le segment
        S.ligne(R(0, 0), R(*q), 'g')
    S.point(R(0, 0), 't', r=3.6, creux=True)
    bs = [_etiq(S, R(0, 0) + [-10, 13], '0', 't', ancre='end'),
          _etiq(S, R(2, 0.8) + [7, 0], 'B', 'b', taille=17, ancre='start')]
    _disjointes(bs)
    return S


@schema('lex-subdivision-adaptee-chemin-1')
def lex_subdivision_adaptee_chemin_1():
    W, H = W0, 290
    S = Schema(W, H, 'Le cercle découpé en huit arcs, chacun dans une boule qui évite l’origine')
    R, e = _repere_egal(-1.62, 1.62, -1.62, 1.62, 10, 8, W - 20, H - 16)
    sym = [lambda X, Y: (X, Y), lambda X, Y: (Y, X), lambda X, Y: (-Y, X), lambda X, Y: (-X, Y),
           lambda X, Y: (-X, -Y), lambda X, Y: (-Y, -X), lambda X, Y: (Y, -X), lambda X, Y: (X, -Y)]
    p0, r0 = (1.0, 0.25), 0.5
    arc0 = arc((0, 0), 1, 0, PI / 4, 200)
    for k, T in enumerate(sym):
        c = np.array(T(*p0))
        assert np.abs(c).max() - r0 > 0                               # l'origine n'est pas dans la boule
        im = np.array([T(*q) for q in arc0])
        assert (np.abs(im - c).max(axis=1) < r0).all()                # l'arc image tient dans la boule
        S.poly(_carre(R, c[0] - r0, c[0] + r0, c[1] - r0, c[1] + r0), 'b' if k == 0 else 'g', ferme=True,
               rempli='b' if k == 0 else None)
    S.poly(R(*arc((0, 0), 1, 0, 2 * PI, 400).T), 'r', ferme=True)
    for k in range(8):
        S.point(R(math.cos(k * PI / 4), math.sin(k * PI / 4)), 'r', r=3.6)
    S.point(R(0, 0), 't', r=3.2, creux=True)
    _etiq(S, R(0, 0) + [0, 14], '0', 't', taille=15)
    return S


def _quart(s_, t_, R=None):
    X = (1 + s_) * np.cos(PI * t_ / 2)
    Y = (1 + s_) * np.sin(PI * t_ / 2)
    return np.stack([X, Y], -1) if R is None else R(X, Y)


@schema('lex-face-cube-1')
def lex_face_cube_1():
    W, H = W0, 280
    S = Schema(W, H, 'Le quart de couronne et les quatre faces du cube')
    R, e = _repere_egal(-0.75, 2.5, -0.25, 2.3, 10, 8, W - 20, H - 16)
    tt = np.linspace(0, 1, 200)
    region = np.vstack([_quart(0 * tt, tt, R), _quart(0 * tt + 1, tt[::-1], R)])
    S.surface(region, 'g')
    S.fleche(R(-0.2, 0), R(2.45, 0), 'g')
    S.fleche(R(0, -0.2), R(0, 2.25), 'g')
    faces = {'c_{1,0}': (_quart(0 * tt, tt), 'b'), 'c_{1,1}': (_quart(0 * tt + 1, tt), 'b'),
             'c_{2,0}': (_quart(tt, 0 * tt), 'r'), 'c_{2,1}': (_quart(tt, 0 * tt + 1), 'r')}
    # formules des faces (premier exemple)
    assert np.allclose(faces['c_{2,1}'][0], np.stack([0 * tt, 1 + tt], -1), atol=1e-12)
    assert np.allclose(faces['c_{2,0}'][0], np.stack([1 + tt, 0 * tt], -1))
    bs = []
    tous = []
    for nom, (pts, c) in faces.items():
        P = R(*pts.T)
        tous.append(P)
        S.poly(P, c, l=2.2)
        _fleche_milieu(S, P, c)
    pos = {'c_{1,0}': (R(*_quart(0, 0.5)) + [-24, -2], 'end'), 'c_{1,1}': (R(*_quart(1, 0.5)) + [16, -14], 'start'),
           'c_{2,0}': (R(1.5, 0) + [0, 17], 'middle'), 'c_{2,1}': (R(0, 1.5) + [-10, 0], 'end')}
    for nom, (p, a) in pos.items():
        bs.append(_etiq(S, p, nom, faces[nom][1], taille=17, ancre=a, eviter=tous))
    _disjointes(bs)
    return S


@schema('lex-bord-cubique-2')
def lex_bord_cubique_2():
    W, H = W0, 280
    S = Schema(W, H, 'Le bord du quart de couronne, avec les signes de ses faces')
    R, e = _repere_egal(-0.75, 2.75, -0.25, 2.3, 10, 8, W - 20, H - 16)
    tt = np.linspace(0, 1, 200)
    region = np.vstack([_quart(0 * tt, tt, R), _quart(0 * tt + 1, tt[::-1], R)])
    S.surface(region, 'g')
    signe = {(1, 0): -1, (1, 1): 1, (2, 0): 1, (2, 1): -1}
    assert all(signe[(i, eps)] == (-1) ** (i + eps) for (i, eps) in signe)
    faces = {(1, 0): _quart(0 * tt, tt), (1, 1): _quart(0 * tt + 1, tt), (2, 0): _quart(tt, 0 * tt),
             (2, 1): _quart(tt, 0 * tt + 1)}
    # parcours du bord : chaque face, prise dans le sens de son signe ; l'extrémité de l'une est l'origine de la suivante
    ordre = [(2, 0), (1, 1), (2, 1), (1, 0)]
    chaine = [faces[k] if signe[k] > 0 else faces[k][::-1] for k in ordre]
    for a, b in zip(chaine, chaine[1:] + chaine[:1]):
        assert np.allclose(a[-1], b[0], atol=1e-12)
    # sens direct : aire signée du contour positive
    poly = np.vstack(chaine)
    aire = 0.5 * np.sum(poly[:, 0] * np.roll(poly[:, 1], -1) - np.roll(poly[:, 0], -1) * poly[:, 1])
    assert aire > 0 and abs(aire - 3 * PI / 4) < 1e-3
    tous = []
    for k in ordre:
        P = R(*faces[k].T)
        tous.append(P)
        S.poly(P, 'r', l=2.2)
        _fleche_milieu(S, P, 'r', sens=signe[k])
    for q in [(1, 0), (2, 0), (0, 2), (0, 1)]:
        S.point(R(*q), 't', r=3.2)
    bs = []
    pos = {(1, 0): (R(*_quart(0, 0.5)) + [-24, -2], 'end', '−c_{1,0}'),
           (1, 1): (R(*_quart(1, 0.5)) + [16, -14], 'start', '+c_{1,1}'),
           (2, 0): (R(1.5, 0) + [0, 17], 'middle', '+c_{2,0}'),
           (2, 1): (R(0, 1.5) + [-10, 0], 'end', '−c_{2,1}')}
    for k, (p, a, s_) in pos.items():
        bs.append(_etiq(S, p, s_, 'r', taille=17, ancre=a, eviter=tous))
    _disjointes(bs)
    return S


# ================================================================================================== paquet 2

def _axes(S, R, nx='x', ny='y', c='g', origine=(0, 0), taille=15):
    """Axes du repère, flèches et noms à l'intérieur du rectangle du repère (rien ne sort du cadre)."""
    ox, oy = origine
    S.fleche(R(R.xmin, oy), R(R.xmax, oy), c)
    if nx:
        _etiq(S, R(R.xmax, oy) + [-4, -12], nx, c, taille=taille, ancre='end')
    S.fleche(R(ox, R.ymin), R(ox, R.ymax), c)
    if ny:
        _etiq(S, R(ox, R.ymax) + [-9, 7], ny, c, taille=taille, ancre='end')


@schema('lex-homotopie-lisse-2')
def lex_homotopie_lisse_2():
    W, H = W0, 260
    S = Schema(W, H, 'Trajectoires de l’homotopie affine vers le point a, dont l’une passe par l’origine')
    R, e = _repere_egal(-1.45, 1.45, -1.25, 1.25, 10, 8, W - 20, H - 16)
    S.poly(R(*arc((0, 0), 1, 0, 2 * PI, 300).T), 'g', ferme=True, d=True)
    a = np.array([1.0, 0.0])
    T = np.linspace(0, 1, 101)[:, None]
    for k in range(8):
        x = np.array([math.cos(k * PI / 4), math.sin(k * PI / 4)])
        traj = (1 - T) * x + T * a
        dmin = np.linalg.norm(traj, axis=1).min()
        if k == 4:
            assert dmin < 1e-12 and np.allclose(traj[np.argmin(np.linalg.norm(traj, axis=1))], 0)   # passe par 0
            S.poly(R(*traj.T), 'r', l=2.2)
            S.pointe(R(*traj[70]), R(*traj[71]) - R(*traj[69]), 'r', taille=9, largeur=4)
        elif k:
            assert dmin > 0.3                                                                     # les autres évitent 0
            S.poly(R(*traj.T), 'b')
            S.pointe(R(*traj[55]), R(*traj[56]) - R(*traj[54]), 'b', taille=8, largeur=3.5)
        S.point(R(*x), 'b' if k != 4 else 'r', r=3)
    S.point(R(*a), 't', r=4)
    S.point(R(0, 0), 't', r=3.6, creux=True)
    bs = [_etiq(S, R(*a) + [12, 0], 'a', 't', taille=17, ancre='start'),
          _etiq(S, R(0, 0) + [0, -15], '0', 't', taille=15),
          _etiq(S, R(-1, 0) + [-10, 0], '(−1, 0)', 'r', taille=15, ancre='end')]
    _disjointes(bs)
    return S


@schema('lex-nulle-pres-1')
def lex_nulle_pres_1():
    W, H = W0, 220
    S = Schema(W, H, 'La fonction θ, nulle sur P sans l’être près de P, et θ(x − 1), nulle près de P')
    R = Repere(-2.2, 3.3, -0.15, 0.8, 12, 10, W - 24, H - 36)
    th = lambda q: np.where(q > 0, np.exp(-1 / np.where(q > 0, q, 1)), 0.0)
    xs = np.linspace(-2.2, 3.3, 1101)
    S.ligne(R(-2.2, 0) + [0, 7], R(0, 0) + [0, 7], 'g', l=5)       # la demi-droite P, tracée sous l'axe
    _axes(S, R, 'x', None)
    f0, f1 = th(xs), th(xs - 1)
    assert (f0[xs <= 0] == 0).all() and (f0[xs > 0.01] > 0).all()
    assert (f1[xs < 1] == 0).all()
    S.poly(R(xs, f0), 'b', l=2.2)
    S.poly(R(xs, f1), 'r', l=2.2)
    for v, lab, dx in ((0, '0', 9), (1, '1', 0)):
        S.ligne(R(v, 0) + [0, -3], R(v, 0) + [0, 3], 'g')
        _etiq(S, R(v, 0) + [dx, 16], lab, 'g', taille=14)
    courbes = [R(xs, f0), R(xs, f1)]
    bs = [_etiq(S, R(-1.1, 0) + [0, 22], 'P', 'g', taille=17),
          _etiq(S, R(1.2, float(th(np.array([1.2]))[0])) + [-12, -10], 'θ', 'b', taille=17, ancre='end', eviter=courbes),
          _etiq(S, R(2.4, float(th(np.array([1.4]))[0])) + [10, 16], 'θ(x − 1)', 'r', taille=15, ancre='start',
                eviter=courbes)]
    _disjointes(bs)
    return S


@schema('lex-forme-angle-solide-3')
def lex_forme_angle_solide_3():
    W, H = W0, 220
    S = Schema(W, H, 'Le bord d’un carré qui entoure l’origine et celui d’un carré qui ne l’entoure pas')
    R, e = _repere_egal(-1.5, 4.5, -1.45, 1.45, 10, 8, W - 20, H - 16)
    S.fleche(R(-1.5, 0), R(4.5, 0), 'g')
    S.fleche(R(0, -1.45), R(0, 1.45), 'g')
    for (a, b, c, d), col in (((-1, 1, -1, 1), 'r'), ((2, 4, -1, 1), 'b')):
        coins = [(a, c), (b, c), (b, d), (a, d)]
        S.poly(np.array([R(*q) for q in coins]), col, ferme=True, l=2.2)
        for p, q in zip(coins, coins[1:] + coins[:1]):
            m = R((p[0] + q[0]) / 2, (p[1] + q[1]) / 2)
            S.pointe(m + 4.5 * (R(*q) - R(*p)) / np.linalg.norm(R(*q) - R(*p)), R(*q) - R(*p), col, taille=9, largeur=4)
    assert not (2 <= 0 <= 4) and (-1 <= 0 <= 1)                     # seul le premier carré entoure l'origine
    S.point(R(0, 0), 't', r=3.6, creux=True)
    bs = [_etiq(S, R(0, 0) + [-9, 14], '0', 't', taille=15, ancre='end'),
          _etiq(S, R(-1, 1) + [4, -14], '2π', 'r', taille=17, ancre='start'),
          _etiq(S, R(4, 1) + [-4, -14], '0', 'b', taille=17, ancre='end')]
    _disjointes(bs)
    return S


@schema('lex-integration-cochaines-3')
def lex_integration_cochaines_3():
    W, H = W0, 280
    S = Schema(W, H, 'Le triangle et son bord orienté, avec les intégrales de x dy sur les côtés')
    R, e = _repere_egal(-0.9, 2.9, -0.45, 3.35, 10, 8, W - 20, H - 16)
    p0, p1, p2 = np.array([0., 0.]), np.array([2., 0.]), np.array([1., 3.])
    seg = lambda p, q: 0.5 * (p[0] + q[0]) * (q[1] - p[1])          # ∫ x dy de p à q
    # bord [p1, p2] − [p0, p2] + [p0, p1] : parcours p0 → p1 → p2 → p0
    vals = [seg(p0, p1), seg(p1, p2), seg(p2, p0)]
    assert vals == [0.0, 4.5, -1.5] and abs(sum(vals) - 3) < 1e-12
    aire = 0.5 * ((p1 - p0)[0] * (p2 - p0)[1] - (p1 - p0)[1] * (p2 - p0)[0])
    assert aire == 3.0
    S.poly(np.array([R(*p0), R(*p1), R(*p2)]), 'r', ferme=True, rempli='r', l=2.2)
    for p, q in ((p0, p1), (p1, p2), (p2, p0)):
        A, B = R(*p), R(*q)
        m = (A + B) / 2
        S.pointe(m + 4.5 * (B - A) / np.linalg.norm(B - A), B - A, 'r', taille=9, largeur=4)
    bs = []
    for p, lab, dec, anc in ((p0, 'p_0', [-8, 12], 'end'), (p1, 'p_1', [8, 12], 'start'), (p2, 'p_2', [0, -14], 'middle')):
        S.point(R(*p), 't', r=3.2)
        bs.append(_etiq(S, R(*p) + dec, lab, 't', taille=17, ancre=anc))
    bord = np.vstack([np.linspace(R(*p), R(*q), 60) for p, q in ((p0, p1), (p1, p2), (p2, p0))])
    bs.append(_etiq(S, R(1, 0) + [0, 16], '0', 'r', taille=16, eviter=[bord]))
    bs.append(_etiq(S, R(1.5, 1.5) + [14, 0], '9/2', 'r', taille=16, ancre='start', eviter=[bord]))
    bs.append(_etiq(S, R(0.5, 1.5) + [-14, 0], '−3/2', 'r', taille=16, ancre='end', eviter=[bord]))
    _disjointes(bs)
    return S


@schema('lex-nerf-recouvrement-2')
def lex_nerf_recouvrement_2():
    W, H = W0, 220
    S = Schema(W, H, 'Trois cubes deux à deux sécants ont un point commun ; trois bandes convexes, pas toujours')
    # à gauche : trois carrés ]a, b[ × ]c, d[
    Rg, e = _repere_egal(-0.2, 3.4, -0.2, 3.4, 8, 10, W / 2 - 16, H - 20)
    car = [(0.0, 2.0, 0.0, 2.0), (1.2, 3.2, 0.4, 2.4), (0.6, 2.6, 1.3, 3.3)]
    for i in range(3):
        for j in range(3):
            A, B = car[i], car[j]
            assert max(A[0], B[0]) < min(A[1], B[1]) and max(A[2], B[2]) < min(A[3], B[3])
    lo = (max(c[0] for c in car), min(c[1] for c in car), max(c[2] for c in car), min(c[3] for c in car))
    assert lo[0] < lo[1] and lo[2] < lo[3]                          # intersection commune non vide
    S.poly(_carre(Rg, *lo), 'g', ferme=True, rempli='g')
    for c, col in zip(car, ('b', 'v', 't')):
        S.poly(_carre(Rg, *c), col, ferme=True)
    # à droite : trois bandes fermées de demi-largeur 1/5 le long des côtés d'un triangle équilatéral de côté 2
    Rd, e2 = _repere_egal(-1.45, 1.6, -1.45, 1.45, W / 2 + 8, 10, W / 2 - 16, H - 20)
    R3 = 2 / math.sqrt(3)
    V = [np.array([R3 * math.cos(a), R3 * math.sin(a)]) for a in (0.0, 2 * PI / 3, 4 * PI / 3)]
    assert all(abs(np.linalg.norm(V[i] - V[j]) - 2) < 1e-12 for i in range(3) for j in range(i))
    g = np.mean(V, axis=0)
    h = 0.2
    bandes = []
    for i in range(3):
        A, B = V[(i + 1) % 3], V[(i + 2) % 3]
        u = (B - A) / np.linalg.norm(B - A)
        nrm = np.array([-u[1], u[0]])
        bandes.append((A, B, u, nrm))
        S.poly(np.array([Rd(*q) for q in (A + h * nrm, B + h * nrm, B - h * nrm, A - h * nrm)]), ('b', 'v', 't')[i], ferme=True)

    def dans(x, k):
        A, B, u, nrm = bandes[k]
        t_ = (x - A) @ u
        return (t_ >= -1e-12) & (t_ <= 2 + 1e-12) & (np.abs((x - A) @ nrm) <= h + 1e-12)
    grille = np.stack(np.meshgrid(np.linspace(-1.6, 1.6, 641), np.linspace(-1.6, 1.6, 641)), -1).reshape(-1, 2)
    assert not (dans(grille, 0) & dans(grille, 1) & dans(grille, 2)).any()          # aucun point commun
    for k in range(3):
        assert all(dans(V[k][None], i)[0] for i in range(3) if i != k)              # deux à deux : au sommet
        S.point(Rd(*V[k]), 'g', r=3.6)
    assert all(not dans(g[None], k)[0] for k in range(3)) and np.linalg.norm(g) < 1e-12
    S.point(Rd(*g), 'r', r=3.8)
    return S


# ================================================================================================== paquet 3

def _theta(q):
    q = np.asarray(q, float)
    return np.where(q > 0, np.exp(-1 / np.where(q > 0, q, 1)), 0.0)


@schema('lex-support-forme-1')
def lex_support_forme_1():
    W, H = W0, 190
    S = Schema(W, H, 'Le coefficient θ(1 − x²) et son support [−1, 1]')
    R = Repere(-2.2, 2.2, -0.12, 0.45, 12, 10, W - 24, H - 40)
    xs = np.linspace(-2.2, 2.2, 1101)
    co = _theta(1 - xs ** 2)
    assert (co[np.abs(xs) >= 1] == 0).all() and (co[np.abs(xs) < 0.98] > 0).all()
    S.ligne(R(-1, 0) + [0, 8], R(1, 0) + [0, 8], 'r', l=4)          # le support [−1, 1], sous l'axe
    S.point(R(-1, 0) + [0, 8], 'r', r=3.4)
    S.point(R(1, 0) + [0, 8], 'r', r=3.4)
    _axes(S, R, 'x', None)
    S.poly(R(xs, co), 'b', l=2.2)
    for v in (-1, 1):
        S.point(R(v, 0), 'g', r=3.6, creux=True)                    # extrémités de ]−1, 1[, exclues
        _etiq(S, R(v, 0) + [0, 24], '−1' if v < 0 else '1', 'g', taille=14)
    mx = float(_theta(np.array([1.0]))[0])
    assert abs(mx - math.exp(-1)) < 1e-12
    _etiq(S, R(0.55, float(_theta(np.array([1 - 0.55 ** 2]))[0])) + [12, -10], 'θ(1 − x^2)', 'b', taille=15, ancre='start',
          eviter=[R(xs, co)])
    return S


@schema('lex-extension-par-zero-1')
def lex_extension_par_zero_1():
    W, H = W0, 210
    S = Schema(W, H, 'Le prolongement par zéro d’une bosse, lisse, et celui de dx, discontinu')
    R = Repere(-0.45, 1.45, -0.12, 1.25, 12, 10, W - 24, H - 34)
    _axes(S, R, 'x', None)
    xs = np.linspace(-0.45, 1.45, 1201)
    psi = _theta(1 - 16 * (xs - 0.5) ** 2)
    assert (psi[np.abs(xs - 0.5) >= 0.25] == 0).all() and (psi[np.abs(xs - 0.5) < 0.24] > 0).all()
    k = 1
    # le coefficient de l'extension de dx : 1 sur ]0, 1[, 0 ailleurs
    S.poly(R(xs, k * psi), 'b', l=2.2)
    S.ligne(R(-0.45, 0), R(0, 0), 'r', l=2.2)
    S.ligne(R(0, 1), R(1, 1), 'r', l=2.2)
    S.ligne(R(1, 0), R(1.45, 0), 'r', l=2.2)
    S.point(R(0, 1), 'r', r=3.4, creux=True)
    S.point(R(1, 1), 'r', r=3.4, creux=True)
    S.point(R(0, 0), 'r', r=3.4)                                    # valeurs en 0 et en 1 : nulles
    S.point(R(1, 0), 'r', r=3.4)
    for v in (0, 1):
        S.ligne(R(v, 0) + [0, -3], R(v, 0) + [0, 3], 'g')
        _etiq(S, R(v, 0) + [0, 16], str(v), 'g', taille=14)
    return S


@schema('lex-bord-variete-2')
def lex_bord_variete_2():
    W, H = W0, 220
    S = Schema(W, H, 'Le demi-disque, son bord et sa frontière dans le plan')
    R, e = _repere_egal(-1.45, 1.45, -0.3, 1.2, 10, 8, W - 20, H - 16)
    S.fleche(R(-1.45, 0), R(1.45, 0), 'g')
    arc_ = arc((0, 0), 1, 0, PI, 200)
    S.surface(np.vstack([R(*arc_.T), [R(-1, 0)], [R(1, 0)]]), 'g')
    S.poly(R(*arc_.T), 'g', d=True, l=1.6)
    # M = {x ∈ ℍ² : |x| < 1} : son bord est ]−1, 1[ × {0}, sa frontière ajoute l'arc et les extrémités
    pts = np.random.default_rng(1).uniform(-1.2, 1.2, (20000, 2))
    dansM = (pts[:, 1] >= 0) & (np.linalg.norm(pts, axis=1) < 1)
    assert not (dansM & (np.linalg.norm(pts, axis=1) >= 1)).any()
    S.ligne(R(-1, 0), R(1, 0), 'r', l=2.6)
    S.point(R(-1, 0), 'r', r=3.6, creux=True)
    S.point(R(1, 0), 'r', r=3.6, creux=True)
    bs = [_etiq(S, R(0, 0.45), 'M', 't', taille=17),
          _etiq(S, R(0.3, 0) + [0, 16], '∂M', 'r', taille=17),
          _etiq(S, R(math.cos(PI / 5), math.sin(PI / 5)) + [12, -6], '|x| = 1', 'g', taille=15, ancre='start',
                eviter=[R(*arc_.T)])]
    _disjointes(bs)
    return S


@schema('lex-orientation-induite-2')
def lex_orientation_induite_2():
    W, H = W0, 290
    S = Schema(W, H, 'Les deux cercles du bord, orientés en sens contraires par l’orientation induite')
    R, e = _repere_egal(-2.55, 2.55, -2.3, 2.3, 10, 8, W - 20, H - 16)
    ext, intr = arc((0, 0), 2, 0, 2 * PI, 300), arc((0, 0), 1, 0, 2 * PI, 300)
    S.surface(np.vstack([R(*ext.T), R(*intr[::-1].T)]), 'g')
    S.poly(R(*ext.T), 'r', ferme=True, l=2.2)
    S.poly(R(*intr.T), 'b', ferme=True, l=2.2)
    # sens de parcours : extérieur trigonométrique, intérieur horaire (cartes induites −x1 et x1 croissantes, n = 2)
    for a in (PI / 2, 3 * PI / 2):
        p = 2 * np.array([math.cos(a), math.sin(a)])
        v = np.array([-math.sin(a), math.cos(a)])                   # quart de tour direct de la normale sortante p/2
        S.pointe(R(*(p + 0.12 * v)), R(*(p + v)) - R(*p), 'r', taille=10, largeur=4.5)
        q = np.array([math.cos(a), math.sin(a)])
        w = np.array([math.sin(a), -math.cos(a)])                   # normale sortante −q, tournée d'un quart de tour
        S.pointe(R(*(q + 0.12 * w)), R(*(q + w)) - R(*q), 'b', taille=10, largeur=4.5)
    # deux points, normale sortante et vecteur tangent direct
    a = PI / 4
    for rad, nu_sgn, col in ((2, 1, 'r'), (1, -1, 'b')):
        p = rad * np.array([math.cos(a), math.sin(a)])
        nu = nu_sgn * np.array([math.cos(a), math.sin(a)])
        v = np.array([-nu[1], nu[0]])
        assert abs(np.linalg.det(np.array([nu, v]).T) - 1) < 1e-12           # (ν, v) directe
        if rad == 2:
            assert np.linalg.norm(p + 0.1 * nu) > 2                            # ν sort de A
        else:
            assert np.linalg.norm(p + 0.1 * nu) < 1
        S.fleche(R(*p), R(*(p + 0.6 * nu)), 'v')
        S.fleche(R(*p), R(*(p + (1.0 if rad == 2 else 0.6) * v)), col, l=2.2)
        S.point(R(*p), 't', r=2.8)
    # sens : l'extérieur est parcouru dans le sens direct, l'intérieur dans le sens contraire
    assert math.cos(1.0) * math.cos(1.0) - math.sin(1.0) * (-math.sin(1.0)) > 0          # det(p, v) > 0 : sens direct
    bs = [_etiq(S, R(-1.55, -1.55) + [-6, 0], 'A', 't', taille=17, ancre='end')]
    _disjointes(bs)
    return S
