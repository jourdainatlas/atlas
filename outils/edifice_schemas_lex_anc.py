"""Schémas des exemples du lexique, théorie anc (analyse complexe) : contenu/exemples/anc.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 15 à 17 (mémo de
l'édifice, § 111). Toutes les courbes sont calculées (numpy) à partir de leur paramétrage exact, les repères sont à
échelle égale sur les deux axes quand la figure est dans le plan complexe, et ce que dit chaque légende est vérifié
par assert (indices calculés par intégration numérique, appartenance aux ouverts, images par les applications).
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

W0 = 420
TL = 17


def _boite(p, s, taille=TL, ancre='middle'):
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    return (x0, p[1] - 0.6 * taille, x0 + w, p[1] + 0.6 * taille)


def _etiq(S, p, s, c='t', taille=TL, ancre='middle', eviter=(), boites=None):
    b = _boite(p, s, taille, ancre)
    assert b[0] >= 2 and b[2] <= S.w - 2 and b[1] >= 0 and b[3] <= S.h, (s, b)
    for pts in eviter:
        pts = np.asarray(pts, float)
        dedans = (pts[:, 0] > b[0] - 2) & (pts[:, 0] < b[2] + 2) & (pts[:, 1] > b[1] - 2) & (pts[:, 1] < b[3] + 2)
        assert not dedans.any(), s
    if boites is not None:
        for o in boites:
            assert b[2] + 1 <= o[0] or o[2] + 1 <= b[0] or b[3] + 1 <= o[1] or o[3] + 1 <= b[1], (s, b, o)
        boites.append(b)
    S.texte(p, s, c, ancre=ancre, taille=taille)
    return b


def _repere_egal(xmin, xmax, ymin, ymax, x0, y0, L, H):
    e = min(L / (xmax - xmin), H / (ymax - ymin))
    LL, HH = e * (xmax - xmin), e * (ymax - ymin)
    return Repere(xmin, xmax, ymin, ymax, x0 + (L - LL) / 2, y0 + (H - HH) / 2, LL, HH), e


def _axes(S, R, nx='', ny='', c='g'):
    """Axes du repère, flèches et noms à l'intérieur du rectangle du repère."""
    S.fleche(R(R.xmin, 0), R(R.xmax, 0), c)
    if nx:
        S.texte(R(R.xmax, 0) + [-4, -13], nx, c, ancre='end', taille=17)
    S.fleche(R(0, R.ymin), R(0, R.ymax), c)
    if ny:
        S.texte(R(0, R.ymax) + [-9, 7], ny, c, ancre='end', taille=17)


def _cercle_pts(c, r, n=400, t0=0.0, t1=2 * math.pi):
    t = np.linspace(t0, t1, n)
    return np.stack([c.real + r * np.cos(t), c.imag + r * np.sin(t)], -1)


def _C(R, pts):
    pts = np.asarray(pts)
    if np.iscomplexobj(pts):
        return R(pts.real, pts.imag)
    return R(pts[:, 0], pts[:, 1])


def _fleche_sur(S, R, zs, k, c='t'):
    """Pointe de flèche posée sur une courbe complexe zs, au point d'indice k, dans le sens de parcours."""
    p = R(zs[k].real, zs[k].imag)
    q = R(zs[k + 1].real, zs[k + 1].imag)
    S.pointe(p + 4 * (q - p) / np.linalg.norm(q - p), q - p, c)


def _indice(zs, w):
    """Indice d'un lacet échantillonné finement, par la somme des accroissements de l'argument."""
    d = np.angle((zs[1:] - w) / (zs[:-1] - w))
    return d.sum() / (2 * math.pi)


# =========================================================================================== convergence uniforme
@schema('lex-convergence-uniforme-1')
def lex_convergence_uniforme_1():
    ns = [1, 2, 4, 8, 16, 32]
    xs = np.linspace(0, 1, 801)
    for n in ns:
        assert abs((xs[xs <= 0.5] ** n).max() - 0.5 ** n) < 1e-12        # sous 2^-n sur [0, 1/2]
        assert abs(xs[-1] ** n - 1) < 1e-12                                # remonte jusqu'à 1
    W, H = W0, 260
    R = Repere(-0.06, 1.08, -0.1, 1.12, 30, 10, W - 50, H - 26)
    S = Schema(W, H, 'Les fonctions x puissance n sur [0, 1]')
    _axes(S, R, 'x', '')
    S.surface(np.vstack([R(0, 0), R(0.5, 0), R(0.5, 0.5), R(0, 0.5)]), 'b')
    for n in ns:
        S.poly(R(xs, xs ** n), 'r' if n == 32 else 'g')
    S.poly(R(xs[xs <= 0.5], xs[xs <= 0.5] ** 32), 'b', l=3)
    S.ligne(R(1, 0) + [0, -3], R(1, 0) + [0, 3], 'g')
    S.ligne(R(1, 0), R(1, 1), 'g', d=True)
    S.ligne(R(0, 1), R(1, 1), 'g', d=True)
    _etiq(S, R(1, 0) + [0, 14], '1', 'g', taille=17)
    _etiq(S, R(0.5, 0) + [0, 14], '1/2', 'b', taille=17)
    _etiq(S, R(0, 1) + [-8, 0], '1', 'g', taille=17, ancre='end')
    _etiq(S, R(0.42, 0.56), 'x', 'g', taille=17)
    _etiq(S, R(0.89, 0.2), 'x^{32}', 'r', taille=17, ancre='end')
    return S


# ================================================================================================ série entière
@schema('lex-serie-entiere-2')
def lex_serie_entiere_2():
    # la série Σ (-1)^n z^{2n} converge pour |z| < 1 : terme général de module |z|^{2n}
    for zz in [0.9, 0.5j, 0.6 + 0.7j]:
        s = sum((-1) ** n * zz ** (2 * n) for n in range(4000))
        assert abs(s - 1 / (1 + zz ** 2)) < 1e-9
    assert abs(abs(1j) - 1) < 1e-15
    W, H = W0, 280
    R, e = _repere_egal(-1.75, 1.75, -1.4, 1.4, 10, 8, W - 20, H - 16)
    S = Schema(W, H, 'Disque de convergence de la série de 1/(1 + z²)')
    S.cercle(R(0, 0), e, 'r', rempli='r')
    _axes(S, R, '', '')
    S.ligne(R(-1, 0), R(1, 0), 'b', l=3.5)
    for v in (1, -1):
        S.point(R(0, v), 't', r=4)
        S.point(R(v, 0), 'b', creux=True, r=3.5)
    bx = []
    _etiq(S, R(0, 1) + [12, -12], 'i', ancre='start', boites=bx)
    _etiq(S, R(0, -1) + [12, 12], '−i', ancre='start', boites=bx)
    _etiq(S, R(1, 0) + [6, 14], '1', 'b', taille=17, ancre='start', boites=bx)
    _etiq(S, R(-1, 0) + [-6, 14], '−1', 'b', taille=17, ancre='end', boites=bx)
    _etiq(S, R(0.95, 0.95) + [6, 0], '|z| = 1', 'r', taille=17, ancre='start', boites=bx)
    return S


# ======================================================================================== intégrale curviligne
@schema('lex-integrale-curviligne-1')
def lex_integrale_curviligne_1():
    t = np.linspace(0, 1, 200001)
    seg = np.trapezoid(np.conj(t * (1 + 1j)) * (1 + 1j), t)
    pol = np.trapezoid(t + 0j, t) + np.trapezoid(np.conj(1 + 1j * t) * 1j, t)
    assert abs(seg - 1) < 1e-9 and abs(pol - (1 + 1j)) < 1e-9
    W, H = W0, 270
    R, e = _repere_egal(-0.35, 1.6, -0.25, 1.3, 10, 8, W - 20, H - 16)
    S = Schema(W, H, 'Deux chemins de 0 à 1 + i')
    _axes(S, R, '', '')
    S.ligne(R(0, 0), R(1, 1), 'r', l=2.5)
    S.ligne(R(0, 0), R(1, 0), 'b', l=2.5)
    S.ligne(R(1, 0), R(1, 1), 'b', l=2.5)
    for p, q, c in [((0, 0), (1, 1), 'r'), ((0, 0), (1, 0), 'b'), ((1, 0), (1, 1), 'b')]:
        m = (np.array(p) + np.array(q)) / 2
        a, b = R(*p), R(*q)
        S.pointe(R(*m) + 5 * (b - a) / np.linalg.norm(b - a), b - a, c)
    for z_ in [(0, 0), (1, 0), (1, 1)]:
        S.point(R(*z_), 't')
    bx = []
    _etiq(S, R(0, 0) + [-8, 14], '0', ancre='end', boites=bx)
    _etiq(S, R(1, 0) + [10, 14], '1', ancre='start', boites=bx)
    _etiq(S, R(1, 1) + [10, -8], '1 + i', ancre='start', boites=bx)
    _etiq(S, R(0.36, 0.62), '∫ = 1', 'r', taille=17, ancre='end', boites=bx)
    _etiq(S, R(1.06, 0.45), '∫ = 1 + i', 'b', taille=17, ancre='start', boites=bx)
    return S


# ============================================================================================= indice : le huit
@schema('lex-indice-lacet-1')
def lex_indice_lacet_1():
    t1 = np.linspace(0, 2 * math.pi, 4001)
    g1 = 1 - np.exp(1j * t1)
    g2 = -1 + np.exp(-1j * t1)                      # t ∈ [2π, 4π] : exp(-it) = exp(-i(t - 2π))
    huit = np.concatenate([g1, g2[1:]])
    assert abs(huit[0]) < 1e-12 and abs(huit[-1]) < 1e-12 and abs(g1[-1]) < 1e-12
    assert abs(_indice(huit, 1) - 1) < 1e-6 and abs(_indice(huit, -1) + 1) < 1e-6
    assert abs(_indice(huit, 2.6)) < 1e-6
    W, H = W0, 230
    R, e = _repere_egal(-2.2, 3.4, -1.25, 1.25, 4, 8, W - 8, H - 16)
    S = Schema(W, H, 'Le huit formé de deux cercles parcourus en sens opposés')
    S.ligne(R(R.xmin, 0), R(R.xmax, 0), 'g', d=True)
    S.poly(_C(R, g1), 't', l=2)
    S.poly(_C(R, g2), 't', l=2)
    for zs in (g1, g2):
        for k in (900, 3000):
            _fleche_sur(S, R, zs, k)
    S.point(R(1, 0), 'r', r=4)
    S.point(R(-1, 0), 'b', r=4)
    S.point(R(2.6, 0), 'g', r=4)
    S.point(R(0, 0), 't', r=3)
    bx = []
    _etiq(S, R(1, 0) + [0, -16], '1', 'r', boites=bx)
    _etiq(S, R(-1, 0) + [0, -16], '−1', 'b', boites=bx)
    _etiq(S, R(1, 0) + [0, 17], '`Ind` = 1', 'r', taille=17, boites=bx)
    _etiq(S, R(-1, 0) + [0, 17], '`Ind` = −1', 'b', taille=17, boites=bx)
    _etiq(S, R(2.6, 0) + [6, -18], '`Ind` = 0', 'g', taille=17, ancre='middle', boites=bx)
    return S


# ============================================================================================ biholomorphe : z²
@schema('lex-biholomorphe-1')
def lex_biholomorphe_1():
    rs = [0.5, 1.0, 1.35]
    ths = [math.pi / 8, math.pi / 4, 3 * math.pi / 8]
    cols = ['r', 'b', 'v']
    # images : quarts de cercle → demi-cercles de rayon r², rayons d'angle θ → rayons d'angle 2θ
    for r in rs:
        th = np.linspace(0.001, math.pi / 2 - 0.001, 50)
        im = (r * np.exp(1j * th)) ** 2
        assert np.allclose(abs(im), r * r) and (im.imag > 0).all()
    for th in ths:
        im = (np.linspace(0.01, 1.4, 20) * np.exp(1j * th)) ** 2
        assert np.allclose(np.angle(im), 2 * th)
    W, H = W0, 200
    S = Schema(W, H, 'Le carré envoie le quart de plan sur le demi-plan supérieur')
    RA, ea = _repere_egal(-0.15, 1.55, -0.15, 1.55, 8, 12, 150, 176)
    RB, eb = _repere_egal(-2.0, 2.0, -0.15, 1.95, 214, 12, 200, 176)
    for R in (RA, RB):
        _axes(S, R)
    for r, c in zip(rs, cols):
        S.poly(_C(RA, r * np.exp(1j * np.linspace(0, math.pi / 2, 80))), c)
        S.poly(_C(RB, r * r * np.exp(1j * np.linspace(0, math.pi, 120))), c)
    for th in ths:
        z1 = 1.5 * np.exp(1j * th)
        S.ligne(RA(0, 0), RA(z1.real, z1.imag), 'g')
        z2 = 1.9 * np.exp(2j * th)
        S.ligne(RB(0, 0), RB(z2.real, z2.imag), 'g')
    S.fleche((168, 92), (206, 92), 't')
    _etiq(S, RA(1.25, 1.35), 'Q', 't')
    _etiq(S, RB(-1.7, 1.75), 'ℍ', 't')
    _etiq(S, (187, 76), 'z^2', taille=17)
    return S


# ===================================================================================== partie convexe : couronne
@schema('lex-partie-convexe-complexe-2')
def lex_partie_convexe_complexe_2():
    assert not (1 < abs(0) < 3)                                  # le milieu 0 de [-2, 2] est hors de la couronne
    c2 = 2 * np.exp(1j * np.linspace(0, 2 * math.pi, 400))
    assert ((abs(c2) > 1) & (abs(c2) < 3)).all()
    W, H = W0, 280
    R, e = _repere_egal(-3.3, 3.3, -3.15, 3.15, 10, 8, W - 20, H - 16)
    S = Schema(W, H, 'L’ouvert 1 < |z| < 3 n’est pas convexe')
    ext = _C(R, _cercle_pts(0j, 3, 300))
    inte = _C(R, _cercle_pts(0j, 1, 200))[::-1]
    S.brut('<path class="f-g" fill-rule="evenodd" d="M' + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in ext) + ' Z M'
           + ' L'.join(f'{x:.1f},{y:.1f}' for x, y in inte) + ' Z"/>')
    S.poly(ext, 'g', ferme=True)
    S.poly(inte, 'g', ferme=True, d=True)
    S.poly(_C(R, _cercle_pts(0j, 2, 300)), 'b')
    S.ligne(R(-2, 0), R(2, 0), 'r', l=2.5)
    for v in (-2, 2):
        S.point(R(v, 0), 'r')
    S.point(R(0, 0), 'r', creux=True, r=4)
    bx = []
    _etiq(S, R(2, 0) + [10, 13], '2', 'r', ancre='start', boites=bx)
    _etiq(S, R(-2, 0) + [-10, 13], '−2', 'r', ancre='end', boites=bx)
    _etiq(S, R(0, 0) + [0, 17], '0', 'r', boites=bx)
    _etiq(S, R(0, 2) + [0, -13], 'C(0, 2)', 'b', taille=17, boites=bx)
    return S


# ============================================================================== chemin C¹ par morceaux : carré
@schema('lex-chemin-c1-morceaux-1')
def lex_chemin_c1_morceaux_1():
    coins = [0, 1, 1 + 1j, 1j]
    # dérivées à gauche et à droite aux coins : 1 puis i, i puis -1, -1 puis -i, -i puis 1
    dg = [(coins[k] - coins[k - 1]) for k in range(4)]
    dd = [(coins[(k + 1) % 4] - coins[k]) for k in range(4)]
    assert all(abs(a - b) > 1 for a, b in zip(dg, dd))
    W, H = W0, 250
    R, e = _repere_egal(-0.55, 1.55, -0.3, 1.3, 10, 8, W - 20, H - 16)
    S = Schema(W, H, 'Le bord du carré, chemin de classe C¹ par morceaux')
    _axes(S, R)
    for k in range(4):
        a, b = coins[k], coins[(k + 1) % 4]
        S.ligne(R(a.real, a.imag), R(b.real, b.imag), 't', l=2)
        m = (a + b) / 2
        pa, pb = R(a.real, a.imag), R(b.real, b.imag)
        S.pointe(R(m.real, m.imag) + 5 * (pb - pa) / np.linalg.norm(pb - pa), pb - pa, 't')
    for z_ in coins:
        S.point(R(z_.real, z_.imag), 'r', r=4)
    bx = []
    _etiq(S, R(0, 0) + [-10, 15], '0', ancre='end', boites=bx)
    _etiq(S, R(1, 0) + [10, 15], '1', ancre='start', boites=bx)
    _etiq(S, R(1, 1) + [10, -10], '1 + i', ancre='start', boites=bx)
    _etiq(S, R(0, 1) + [-10, -10], 'i', ancre='end', boites=bx)
    return S


# =============================================================================== série complexe : spirale carrée
@schema('lex-serie-complexe-1')
def lex_serie_complexe_1():
    q = 0.5j
    Ssum = np.cumsum([q ** n for n in range(14)])
    lim = 1 / (1 - q)
    assert abs(lim - (0.8 + 0.4j)) < 1e-15
    pas = np.diff(Ssum)
    assert np.allclose(pas[1:] / pas[:-1], q)                     # quart de tour et moitié de longueur
    W, H = W0, 260
    R, e = _repere_egal(-0.2, 1.35, -0.12, 0.72, 10, 10, W - 20, H - 20)
    S = Schema(W, H, 'Sommes partielles de la série géométrique de raison i/2')
    _axes(S, R)
    pts = np.concatenate([[0], Ssum])
    S.poly(_C(R, pts[1:]), 't', l=1.8)
    S.ligne(R(0, 0), R(1, 0), 't', l=1.8)
    for k in range(1, 6):
        S.point(R(Ssum[k - 1].real, Ssum[k - 1].imag), 't', r=3)
    S.point(R(lim.real, lim.imag), 'r', r=4)
    bx = []
    _etiq(S, R(1, 0) + [0, 15], 'S_0 = 1', taille=17, boites=bx)
    _etiq(S, R(Ssum[1].real, Ssum[1].imag) + [10, -6], 'S_1', taille=17, ancre='start', boites=bx)
    _etiq(S, R(Ssum[2].real, Ssum[2].imag) + [-10, -6], 'S_2', taille=17, ancre='end', boites=bx)
    _etiq(S, R(Ssum[3].real, Ssum[3].imag) + [-10, 8], 'S_3', taille=17, ancre='end', boites=bx)
    pl = R(0.6, 0.2)
    S.ligne(R(lim.real, lim.imag), pl + [4, 0], 'r', d=True)
    _etiq(S, pl, '(4 + 2i)/5', 'r', taille=17, ancre='end', boites=bx)
    return S


# ================================================================================================ disque fendu
@schema('lex-bord-ouvert-complexe-2')
def lex_bord_ouvert_complexe_2():
    for x_ in [0, 0.5, 0.99]:
        for n in [200, 2000]:
            z_ = x_ + 1j / n
            assert abs(z_) < 1 and not (z_.imag == 0 and 0 <= z_.real < 1)
    W, H = W0, 260
    R, e = _repere_egal(-1.2, 1.2, -1.15, 1.15, 10, 8, W - 20, H - 16)
    S = Schema(W, H, 'Le disque fendu et son bord')
    S.cercle(R(0, 0), e, 'r', rempli='g')
    S.ligne(R(0, 0), R(1, 0), 'r', l=3)
    S.point(R(0, 0), 'r', r=4)
    for k in range(5):
        xk = 0.15 + 0.18 * k
        for s in (1, -1):
            S.point(R(xk, 0.12 * s), 'g', r=2.2)
            S.fleche(R(xk, 0.12 * s), R(xk, 0.035 * s), 'g')
    bx = []
    _etiq(S, R(0, 0) + [-8, 0], '0', 'r', ancre='end', boites=bx)
    _etiq(S, R(1, 0) + [8, 0], '1', 'r', ancre='start', boites=bx)
    _etiq(S, R(-0.45, 0.25), 'U', taille=17, boites=bx)
    return S


# =================================================================================================== couronnes
@schema('lex-couronne-2')
def lex_couronne_2():
    f = lambda u: 1 / (u * (u - 2))
    for rho, att in [(1, -1j * math.pi), (3, 0)]:
        t = np.linspace(0, 2 * math.pi, 200001)
        zz = rho * np.exp(1j * t)
        v = np.trapezoid(f(zz) * 1j * zz, t)
        assert abs(v - att) < 1e-7
    W, H = W0, 280
    R, e = _repere_egal(-3.6, 3.6, -3.35, 3.35, 10, 8, W - 20, H - 16)
    S = Schema(W, H, 'Les deux couronnes de centre 0 où 1/(z(z − 2)) est holomorphe')
    S.rect(R.x0, R.y0, R.L, R.H, 'g', rempli='b')
    S.cercle(R(0, 0), 2 * e, 't', rempli=None)
    S.brut(f'<circle class="f-r" cx="{R(0, 0)[0]:.1f}" cy="{R(0, 0)[1]:.1f}" r="{2 * e:.1f}"/>')
    S.cercle(R(0, 0), e, 'r', d=True)
    S.cercle(R(0, 0), 3 * e, 'b', d=True)
    S.point(R(0, 0), 't', creux=True, r=4)
    S.point(R(2, 0), 't', creux=True, r=4)
    bx = []
    _etiq(S, R(0, 0) + [0, 16], '0', boites=bx)
    _etiq(S, R(2, 0) + [12, 13], '2', ancre='start', boites=bx)
    _etiq(S, R(0, 1) + [0, -12], '∫ = −iπ', 'r', taille=17, boites=bx)
    _etiq(S, R(0, 3) + [0, 13], '∫ = 0', 'b', taille=17, boites=bx)
    return S
