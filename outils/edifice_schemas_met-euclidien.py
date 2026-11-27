"""Schémas du chapitre met-euclidien (espaces euclidiens et groupe orthogonal) et du lemme de Sard (edo-changement).

Chaque figure calcule ses positions et vérifie par assert ce que dit sa légende. Largeur 460 à 540, étiquettes 15
à 17, repères à échelle égale sur les deux axes. Couleurs (mémo de l'édifice, § 29) : t encre, g gris (axes,
constructions), r rouge (objet étudié), b bleu (second objet), v vert.
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte


def _egal(xmin, xmax, ymin, ymax, W, H, marge=16, haut=None):
    """Repère à échelle égale, centré dans le cadre W × H (ou calé en haut à « haut »)."""
    k = min((W - 2 * marge) / (xmax - xmin), (H - 2 * marge) / (ymax - ymin))
    L, Hh = k * (xmax - xmin), k * (ymax - ymin)
    y0 = (H - Hh) / 2 if haut is None else haut
    return Repere(xmin, xmax, ymin, ymax, (W - L) / 2, y0, L, Hh)


def _dans(S, p, s, taille=17, ancre='middle', marge=2):
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


def _etiq(S, p, s, c='t', ancre='middle', taille=17):
    _dans(S, p, s, taille, ancre)
    S.texte(p, s, c, ancre=ancre, taille=taille)


# ---------------------------------------------------------------- eu-gram-schmidt
@schema('eu-gram-schmidt')
def eu_gram_schmidt():
    v1, v2 = np.array([3.0, 4.0]), np.array([1.0, 2.0])
    e1 = v1 / np.linalg.norm(v1)
    c = v2 @ e1
    p = c * e1
    w2 = v2 - p
    e2 = w2 / np.linalg.norm(w2)
    assert abs(c - 11 / 5) < 1e-12 and np.allclose(e1, [0.6, 0.8]) and np.allclose(e2, [-0.8, 0.6])
    assert np.allclose(w2, [-0.32, 0.24]) and abs(np.linalg.norm(w2) - 0.4) < 1e-12
    assert abs(w2 @ e1) < 1e-12 and np.allclose(p + w2, v2) and v2 @ e2 > 0
    # angle de e₁ à e₂ : un quart de tour
    a1, a2 = math.atan2(e1[1], e1[0]), math.atan2(e2[1], e2[0])
    assert abs((a2 - a1) - math.pi / 2) < 1e-12
    W, H = 480, 330
    S = Schema(W, H, 'Le procédé de Gram-Schmidt dans le plan')
    R = _egal(-1.25, 3.6, -0.3, 4.3, W, H, marge=14)
    S.ligne(R(-1.2, 0), R(3.5, 0), 'g')
    S.ligne(R(0, -0.25), R(0, 4.25), 'g')
    t = np.linspace(a1, a2, 60)
    S.poly(R(np.cos(t), np.sin(t)), 'g', d=True)
    # angle droit entre e₁ et e₂
    q = 0.16
    S.poly(R(*np.array([q * e1, q * (e1 + e2), q * e2]).T), 'b')
    S.fleche(R(0, 0), R(*v1), 'g', l=1.8)
    S.fleche(R(0, 0), R(*v2), 'g', l=1.8)
    S.ligne(R(*p), R(*v2), 'r', d=True, l=1.8)
    S.point(R(*p), 'r', r=3.6)
    S.fleche(R(0, 0), R(*e1), 'b', l=2.6)
    S.fleche(R(0, 0), R(*e2), 'b', l=2.2)
    S.fleche(R(0, 0), R(*w2), 'r', l=4.2)               # par-dessus e₂, colinéaire et plus court
    _etiq(S, R(*v1) + [12, 4], 'v_1', 'g', ancre='start')
    _etiq(S, R(*v2) + [10, -6], 'v_2', 'g', ancre='start')
    _etiq(S, R(*e1) + [14, 8], 'e_1', 'b', ancre='start')
    _etiq(S, R(*e2) + [-8, -10], 'e_2', 'b', ancre='end')
    _etiq(S, R(*w2) + [-10, 12], 'w_2', 'r', ancre='end')
    _etiq(S, R(*p) + [14, 10], '(11/5) e_1', 'r', ancre='start', taille=15)
    return S


# ---------------------------------------------------------------- eu-reflexions
@schema('eu-reflexions')
def eu_reflexions():
    b, c = np.array([3.0, 4.0]), np.array([5.0, 0.0])
    a = (b - c) / np.linalg.norm(b - c)
    s = lambda x: x - 2 * (x @ a) * a
    assert abs(np.linalg.norm(b) - np.linalg.norm(c)) < 1e-12
    assert np.allclose(s(b), c) and np.allclose(s(c), b)
    m = (b + c) / 2
    assert np.allclose(s(m), m) and abs(m @ a) < 1e-12           # le milieu est sur H, fixé
    h = np.array([-a[1], a[0]])                                  # direction de H, orientée vers le milieu
    h = h if h @ m > 0 else -h
    assert abs(abs(h @ m) - np.linalg.norm(m)) < 1e-12          # H passe par 0 et par le milieu
    W, H = 480, 320
    S = Schema(W, H, 'Une réflexion échange deux vecteurs de même norme')
    R = _egal(-1.6, 7.4, -1.4, 5.6, W, H, marge=12)
    S.ligne(R(-1.5, 0), R(7.0, 0), 'g')
    S.ligne(R(0, -1.3), R(0, 5.5), 'g')
    t = np.linspace(-0.25, 1.25, 120)
    S.poly(R(5 * np.cos(t), 5 * np.sin(t)), 'g', d=True)
    d0, d1 = -0.55, 7.2
    S.ligne(R(*(d0 * h)), R(*(d1 * h)), 'b', l=2.2)
    S.ligne(R(*b), R(*c), 'g', d=True)
    S.fleche(R(0, 0), R(*b), 'r', l=2.4)
    S.fleche(R(0, 0), R(*c), 'r', l=2.4)
    S.point(R(*m), 'b', r=4)
    _etiq(S, R(*b) + [-14, -4], 'b', 'r', ancre='end')
    _etiq(S, R(*c) + [8, 14], 'c', 'r', ancre='start')
    _etiq(S, R(*m) + [-12, -16], '(b + c)/2', 'b', ancre='end', taille=15)
    _etiq(S, R(*(d1 * h)) + [-4, 16], 'H', 'b', ancre='end')
    _etiq(S, R(0, 0) + [-8, 14], '0', 'g', ancre='end', taille=15)
    return S


# ---------------------------------------------------------------- eu-o2
def _rot(t):
    return np.array([[math.cos(t), -math.sin(t)], [math.sin(t), math.cos(t)]])


def _S(t):
    return np.array([[math.cos(t), math.sin(t)], [math.sin(t), -math.cos(t)]])


@schema('eu-o2')
def eu_o2():
    beta, alpha = math.pi / 12, math.pi / 4
    x = np.array([math.cos(-math.pi / 3), math.sin(-math.pi / 3)])
    y = _S(2 * beta) @ x
    z = _S(2 * alpha) @ y
    assert np.allclose(z, _rot(math.pi / 3) @ x) and np.allclose(_S(2 * alpha) @ _S(2 * beta), _rot(2 * (alpha - beta)))
    assert np.allclose([np.linalg.norm(x), np.linalg.norm(y), np.linalg.norm(z)], 1)
    # les axes sont d'angles π/12 et π/4 ; la réflexion S_{2β} fixe la droite d'angle β
    for ang in (beta, alpha):
        u = np.array([math.cos(ang), math.sin(ang)])
        assert np.allclose(_S(2 * ang) @ u, u)
    assert np.allclose(y, [0, 1]) and np.allclose(z, [1, 0])
    W, H = 480, 330
    S = Schema(W, H, 'Deux réflexions composent une rotation d’angle double')
    R = _egal(-1.35, 1.75, -1.25, 1.45, W, H, marge=12)
    S.ligne(R(-1.3, 0), R(1.6, 0), 'g')
    S.ligne(R(0, -1.2), R(0, 1.4), 'g')
    t = np.linspace(0, 2 * math.pi, 300)
    S.poly(R(np.cos(t), np.sin(t)), 'g', d=True, ferme=True)
    for ang, c, nom in ((beta, 'g', 'D_β'), (alpha, 'b', 'D_α')):
        u = np.array([math.cos(ang), math.sin(ang)])
        S.ligne(R(*(-1.15 * u)), R(*(1.6 * u)), c, l=2.2)
        _etiq(S, R(*(1.6 * u)) + [8, 0], nom, c, ancre='start')
    S.ligne(R(*x), R(*y), 'g', d=True)
    S.ligne(R(*y), R(*z), 'b', d=True)
    # arc de rotation, de x à z, rayon 0,55
    ts = np.linspace(-math.pi / 3, 0, 40)
    S.courbe_fleche(R(0.55 * np.cos(ts), 0.55 * np.sin(ts)), 'r')
    _etiq(S, R(0.62 * math.cos(-math.pi / 6), 0.62 * math.sin(-math.pi / 6)) + [14, 6], 'π/3', 'r', ancre='start', taille=15)
    S.point(R(*x), 'r', r=4.6)
    S.point(R(*y), 'g', r=4.2)
    S.point(R(*z), 'r', r=4.6)
    _etiq(S, R(*x) + [10, 12], 'x', 'r', ancre='start')
    _etiq(S, R(*y) + [-10, -12], 's_β(x)', 'g', ancre='end', taille=16)
    _etiq(S, R(*z) + [8, 16], 's_α(s_β(x))', 'r', ancre='start', taille=16)
    return S


# ---------------------------------------------------------------- eu-so3
@schema('eu-so3')
def eu_so3():
    A = np.array([[2, -1, 2], [2, 2, -1], [-1, 2, 2]]) / 3
    assert np.allclose(A.T @ A, np.eye(3)) and abs(np.linalg.det(A) - 1) < 1e-12
    e1 = np.ones(3) / math.sqrt(3)
    x = np.array([1, -1, 0]) / math.sqrt(2)
    Ax = A @ x
    f3 = np.cross(e1, x)
    assert np.allclose(A @ e1, e1) and abs(Ax @ e1) < 1e-12
    assert abs(Ax @ x - 0.5) < 1e-12 and abs(np.linalg.det(np.column_stack([e1, x, Ax])) - math.sqrt(3) / 2) < 1e-12
    assert np.allclose(Ax, 0.5 * x + math.sqrt(3) / 2 * f3)     # rotation d'angle π/3 dans le sens direct autour de e₁
    # coordonnées (a, b, c) dans la base orthonormée directe (x, f₃, e₁), puis vue oblique
    psi, eps = math.radians(-20), math.radians(32)

    def vue(a, b, c):
        X = a * math.cos(psi) - b * math.sin(psi)
        Y = c * math.cos(eps) + (a * math.sin(psi) + b * math.cos(psi)) * math.sin(eps)
        return X, Y

    def prof(a, b):                                             # > 0 : devant le plan de l'axe
        return -(a * math.sin(psi) + b * math.cos(psi))

    W, H = 480, 320
    S = Schema(W, H, 'Une rotation de l’espace, son axe et son angle')
    R = _egal(-1.55, 1.75, -1.0, 1.75, W, H, marge=12)
    t = np.linspace(0, 2 * math.pi, 361)
    a, b = np.cos(t), np.sin(t)
    P = np.array([vue(ai, bi, 0) for ai, bi in zip(a, b)])
    devant = np.array([prof(ai, bi) >= 0 for ai, bi in zip(a, b)])
    # moitié arrière en pointillé, moitié avant en trait plein
    for masque, d in ((~devant, True), (devant, False)):
        idx = np.where(masque)[0]
        coupes = np.split(idx, np.where(np.diff(idx) != 1)[0] + 1)
        for cps in coupes:
            if len(cps) > 1:
                S.poly(R(P[cps, 0], P[cps, 1]), 'g', d=d, l=1.6)
    # axe : partie basse (derrière le disque) en pointillé, partie haute pleine
    S.ligne(R(*vue(0, 0, -0.95)), R(*vue(0, 0, 0)), 'b', d=True, l=1.8)
    S.ligne(R(*vue(0, 0, 0)), R(*vue(0, 0, 1.55)), 'b', l=1.8)
    S.fleche(R(*vue(0, 0, 0)), R(*vue(0, 0, 1.0)), 'b', l=2.6)
    _etiq(S, R(*vue(0, 0, 1.0)) + [12, 4], 'e_1', 'b', ancre='start')
    S.texte(R(*vue(0, 0, 1.55)) + [10, 8], 'axe', 'b', ancre='start', taille=15, ui=True)
    # x = (1, 0, 0) et Ax = (cos π/3, sin π/3, 0) dans la base (x, f₃, e₁)
    pa = (1.0, 0.0)
    pb = (math.cos(math.pi / 3), math.sin(math.pi / 3))
    S.fleche(R(*vue(0, 0, 0)), R(*vue(*pa, 0)), 'r', l=2.4)
    S.fleche(R(*vue(0, 0, 0)), R(*vue(*pb, 0)), 'r', l=2.4)
    ts = np.linspace(0, math.pi / 3, 40)
    arcp = np.array([vue(0.55 * math.cos(s), 0.55 * math.sin(s), 0) for s in ts])
    S.courbe_fleche(R(arcp[:, 0], arcp[:, 1]), 'r')
    m = vue(0.62 * math.cos(math.pi / 6), 0.62 * math.sin(math.pi / 6), 0)
    _etiq(S, R(*m) + [12, 2], 'π/3', 'r', ancre='start', taille=15)
    _etiq(S, R(*vue(*pa, 0)) + [12, 8], 'x', 'r', ancre='start')
    _etiq(S, R(*vue(*pb, 0)) + [10, -10], 'Ax', 'r', ancre='start')
    S.point(R(*vue(0, 0, 0)), 't', r=3.2)
    return S


# ---------------------------------------------------------------- cv-sard
@schema('cv-sard')
def cv_sard():
    h = 0.4
    f = lambda x, y: (x, y ** 3 + x * y)
    jac = lambda x, y: 3 * y ** 2 + x
    assert abs(jac(-3 * 0.2 ** 2, 0.2)) < 1e-12                        # parabole des points critiques x = −3y²
    # image exacte du carré : pour chaque u, l'intervalle {y³ + u y : |y| ≤ h}
    us = np.linspace(-h, h, 801)

    def bornes(u):
        ys = [-h, h] + ([-math.sqrt(-u / 3), math.sqrt(-u / 3)] if u < 0 and math.sqrt(-u / 3) <= h else [])
        vs = [y ** 3 + u * y for y in ys]
        return min(vs), max(vs)

    lo = np.array([bornes(u)[0] for u in us])
    hi = np.array([bornes(u)[1] for u in us])
    # contrôle par échantillonnage
    g = np.linspace(-h, h, 201)
    for u in us[::40]:
        v = g ** 3 + u * g
        assert v.min() >= bornes(u)[0] - 1e-12 and v.max() <= bornes(u)[1] + 1e-12
    e = h ** 2 + h ** 3
    assert np.all(hi <= e + 1e-12) and np.all(lo >= -e - 1e-12)   # dans la bande d'épaisseur 2(h² + h³)
    assert abs(e - 0.224) < 1e-12
    tc = math.sqrt(h / 3)                                       # points critiques du carré : |y| ≤ √(h/3)
    W, H = 540, 270
    S = Schema(W, H, 'Lemme de Sard : l’image d’un petit carré près d’un point critique')
    k = 230 / 1.1
    RL = Repere(-0.55, 0.55, -0.55, 0.55, 18, 20, 1.1 * k, 1.1 * k)
    RR = Repere(-0.55, 0.55, -0.55, 0.55, W - 18 - 1.1 * k, 20, 1.1 * k, 1.1 * k)
    for Rp in (RL, RR):
        S.ligne(Rp(-0.55, 0), Rp(0.55, 0), 'g')
        S.ligne(Rp(0, -0.55), Rp(0, 0.55), 'g')
    car = np.array([[-h, -h], [h, -h], [h, h], [-h, h]])
    S.poly(RL(car[:, 0], car[:, 1]), 'r', ferme=True, rempli='r', l=2)
    ys = np.linspace(-tc, tc, 80)
    S.poly(RL(-3 * ys ** 2, ys), 'b', l=2.4)
    # image
    contour = np.vstack([np.column_stack([us, hi]), np.column_stack([us[::-1], lo[::-1]])])
    S.poly(RR(contour[:, 0], contour[:, 1]), 'r', ferme=True, rempli='r', l=2)
    for yv in (e, -e):
        S.ligne(RR(-0.52, yv), RR(0.52, yv), 'g', d=True)
    ts = np.linspace(-tc, tc, 80)
    S.poly(RR(-3 * ts ** 2, -2 * ts ** 3), 'b', l=2.4)
    # flèche f entre les panneaux
    xa, xb = RL(0.55, 0)[0] + 6, RR(-0.55, 0)[0] - 6
    S.fleche((xa, RL(0, 0)[1] - 34), (xb, RL(0, 0)[1] - 34), 't', l=1.6)
    _etiq(S, ((xa + xb) / 2, RL(0, 0)[1] - 50), 'f', 't')
    _etiq(S, RL(h, h) + [-2, -12], '[−h, h]²', 'r', ancre='end', taille=15)
    _etiq(S, RL(-0.2, -0.5), 'x = −3y²', 'b', ancre='middle', taille=15)
    _etiq(S, RR(0.52, e) + [0, -12], 'v = h² + h³', 'g', ancre='end', taille=15)
    _etiq(S, RR(0.52, -e) + [0, 12], 'v = −(h² + h³)', 'g', ancre='end', taille=15)
    # le contour de l'image est dans la bande ; la cuspidale est dans l'image
    for t in np.linspace(-tc, tc, 21):
        u, v = -3 * t ** 2, -2 * t ** 3
        lo_u, hi_u = bornes(u)
        assert lo_u - 1e-12 <= v <= hi_u + 1e-12
    return S
