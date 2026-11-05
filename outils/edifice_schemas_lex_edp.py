"""Schémas des exemples du lexique, théorie edp (distributions et EDP) : contenu/exemples/edp.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées (formules exactes ; intégrales et noyaux par quadrature quand la légende le
dit), et ce que la légende affirme vérifié par assert. Couleurs (§ 29) : t encre, g gris (axes, référence),
r rouge (objet étudié), b bleu (second objet), v vert (troisième). Axes, flèches et étiquettes dans le cadre.
"""
import math
import numpy as np
from scipy import integrate
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

W = 420
TL = 17


# ---------------------------------------------------------------------------------------------- auxiliaires

def _dans_cadre(S, p, s, taille=TL, ancre='middle', marge=2):
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


def _etiq(S, p, s, c='t', ancre='middle', taille=TL):
    _dans_cadre(S, p, s, taille, ancre)
    S.texte(p, s, c, ancre=ancre, taille=taille)


def _axes(S, R, nx='x', ny='y', c='g', origine=(0, 0)):
    """Axes du repère, flèches et noms à l'intérieur du rectangle du repère."""
    ox, oy = origine
    S.fleche(R(R.xmin, oy), R(R.xmax, oy), c)
    if nx:
        _etiq(S, R(R.xmax, oy) + [-4, -13], nx, c, ancre='end', taille=16)
    S.fleche(R(ox, R.ymin), R(ox, R.ymax), c)
    if ny:
        _etiq(S, R(ox, R.ymax) + [-9, 7], ny, c, ancre='end', taille=16)


def _simplifie(P, tol=0.7):
    """Ligne brisée allégée : on garde un point dès qu'il est à plus de tol pixels du dernier gardé (et le dernier)."""
    P = np.asarray(P, float)
    if len(P) < 3:
        return P
    garde = [0]
    for i in range(1, len(P) - 1):
        if np.hypot(*(P[i] - P[garde[-1]])) >= tol:
            garde.append(i)
    garde.append(len(P) - 1)
    return P[garde]


def _courbe(S, R, xs, ys, c='t', l=None, d=False):
    """Courbe coupée aux sorties du repère."""
    ys = np.asarray(ys, float)
    dedans = np.isfinite(ys) & (ys >= R.ymin) & (ys <= R.ymax)
    morceau = []
    for q, yv, ok in zip(xs, ys, dedans):
        if ok:
            morceau.append((q, yv))
        elif morceau:
            if len(morceau) > 1:
                S.poly(_simplifie(R(*np.array(morceau).T)), c, d, l=l)
            morceau = []
    if len(morceau) > 1:
        S.poly(_simplifie(R(*np.array(morceau).T)), c, d, l=l)


def _grad_x(S, R, v, lab, c='g', dy=16, taille=14, oy=0):
    S.ligne(R(v, oy) + [0, -3], R(v, oy) + [0, 3], c)
    if lab:
        _etiq(S, R(v, oy) + [0, dy], lab, c, taille=taille)


def _grad_y(S, R, v, lab, c='g', dx=-8, taille=14, ox=0):
    S.ligne(R(ox, v) + [-3, 0], R(ox, v) + [3, 0], c)
    if lab:
        _etiq(S, R(ox, v) + [dx, 0], lab, c, ancre='end' if dx < 0 else 'start', taille=taille)


def theta(x):
    x = np.asarray(x, float)
    with np.errstate(divide='ignore', over='ignore'):
        return np.where(x > 0, np.exp(-1 / np.where(x > 0, x, 1)), 0.0)


C1 = integrate.quad(lambda x: float(theta(1 - x * x)), -1, 1, epsabs=1e-13)[0]


def rho(x):
    return theta(1 - np.asarray(x, float) ** 2) / C1


def drho(x):
    """ρ′(x) = θ′(1 − x²)(−2x)/c₁, avec θ′(t) = θ(t)/t² pour t > 0."""
    x = np.asarray(x, float)
    t = 1 - x ** 2
    with np.errstate(divide='ignore', invalid='ignore'):
        dt = np.where(t > 0, theta(t) / np.where(t > 0, t, 1) ** 2, 0.0)
    return dt * (-2 * x) / C1


# ---------------------------------------------------------------------------------------------- paquet 3

@schema('lex-support-fonction-3')
def lex_support_fonction_3():
    Hh = 200
    S = Schema(W, Hh, 'Les fonctions θ(x) et θ(−x), de supports [0, +∞[ et ]−∞, 0]')
    R = Repere(-6.3, 6.3, -0.34, 1.0, 14, 10, 392, 182)
    _axes(S, R, 'x', '')
    xs = np.linspace(-6.2, 6.2, 1200)
    f, g = theta(xs), theta(-xs)
    assert np.all(f * g == 0) and np.all(f[xs > 0] > 0) and np.all(g[xs < 0] > 0)
    _courbe(S, R, xs, f, 'r', l=2.6)
    _courbe(S, R, xs, g, 'b', l=2.6)
    # supports, sous l'axe : [0, +∞[ en rouge, ]−∞, 0] en bleu
    yb = R(0, 0)[1] + 9
    S.ligne((R(0, 0)[0], yb), (R(6.2, 0)[0], yb), 'r', l=3)
    S.ligne((R(-6.2, 0)[0], yb + 7), (R(0, 0)[0], yb + 7), 'b', l=3)
    S.point(R(0, 0), 't', r=3.6)
    _etiq(S, R(0, 0) + [12, 34], '0', 'g', ancre='start', taille=15)
    _etiq(S, R(4.2, float(theta(4.2))) + [0, -16], 'θ(x)', 'r', taille=16)
    _etiq(S, R(-4.2, float(theta(4.2))) + [0, -16], 'θ(−x)', 'b', taille=16)
    return S


@schema('lex-fonction-test-2')
def lex_fonction_test_2():
    Hh = 296
    S = Schema(W, Hh, 'Les fonctions ψ_k et leurs dérivées')
    xs = np.linspace(-1.15, 1.15, 2301)
    sup1 = np.max(np.abs(drho(xs)))
    R1 = Repere(-1.25, 1.25, -0.08, 0.95, 30, 8, 370, 118)
    R2 = Repere(-1.25, 1.25, -2.05, 2.05, 30, 150, 370, 140)
    _axes(S, R1, 'x', '')
    _axes(S, R2, 'x', '')
    couleurs = {1: 'g', 2: 'b', 4: 'r'}
    for k, c in couleurs.items():
        psi = rho(k * xs) / k
        dpsi = drho(k * xs)
        assert abs(np.max(psi) - rho(0) / k) < 1e-6                          # s'aplatissent
        assert abs(np.max(np.abs(dpsi)) - sup1) < 2e-2 * sup1                # amplitude constante
        _courbe(S, R1, xs, psi, c, l=2.2)
        _courbe(S, R2, xs, dpsi, c, l=2.0)
    _etiq(S, R1(-1.25, 0.86) + [6, 0], 'ψ_k', 't', ancre='start', taille=16)
    _etiq(S, R2(-1.25, 1.8) + [6, 0], 'ψ_k′', 't', ancre='start', taille=16)
    for R in (R1, R2):
        for v in (-1, 1):
            _grad_x(S, R, v, '')
    _etiq(S, R2(1, 0) + [0, -14], '1', 'g', taille=14)
    _etiq(S, R2(-1, 0) + [0, 15], '−1', 'g', taille=14)
    return S


@schema('lex-noyau-regularisant-1')
def lex_noyau_regularisant_1():
    Hh = 250
    S = Schema(W, Hh, 'Les noyaux ρ_ε pour ε = 1, 1/2 et 1/4')
    R = Repere(-1.3, 1.3, -0.25, 3.6, 30, 10, 370, 220)
    _axes(S, R, 'x', '')
    for e, c in ((1.0, 'g'), (0.5, 'b'), (0.25, 'r')):
        xs = np.linspace(-1.2, 1.2, 2400)
        y = rho(xs / e) / e
        aire = integrate.quad(lambda x: float(rho(x / e) / e), -e, e, epsabs=1e-12)[0]
        assert abs(aire - 1) < 1e-8
        assert np.all(y[np.abs(xs) > e] == 0)
        assert abs(rho(0) / e - {1.0: 0.83, 0.5: 1.66, 0.25: 3.31}[e]) < 0.005
        _courbe(S, R, xs, y, c, l=2.3)
    for v, lab in ((-1, '−1'), (-0.5, ''), (-0.25, ''), (0.25, ''), (0.5, ''), (1, '1')):
        _grad_x(S, R, v, lab)
    _etiq(S, R(0.5, 0) + [0, 16], '1/2', 'g', taille=14)
    return S


def sigma(t):
    t = np.asarray(t, float)
    a, b = theta(t), theta(1 - t)
    return a / (a + b)


def dsigma(t):
    """σ′ = (θ′(t)θ(1 − t) + θ(t)θ′(1 − t)) / (θ(t) + θ(1 − t))², θ′(s) = θ(s)/s² pour s > 0."""
    t = np.asarray(t, float)
    def dth(s):
        with np.errstate(divide='ignore', invalid='ignore'):
            return np.where(s > 0, theta(s) / np.where(s > 0, s, 1) ** 2, 0.0)
    a, b = theta(t), theta(1 - t)
    return (dth(t) * b + a * dth(1 - t)) / (a + b) ** 2


# ---------------------------------------------------------------------------------------------- paquet 4

@schema('lex-masse-dirac-2')
def lex_masse_dirac_2():
    Hh = 230
    S = Schema(W, Hh, 'Les fonctions k 1_{]0, 1/k]} pour k = 1, 2 et 4')
    R = Repere(-0.45, 1.35, -0.4, 4.6, 40, 10, 360, 200)
    _axes(S, R, 'x', '')
    for k, c in ((1, 'g'), (2, 'b'), (4, 'r')):
        assert abs(k * (1 / k) - 1) < 1e-15                                # aire 1
        S.poly(R(np.array([0, 0, 1 / k, 1 / k]), np.array([0, k, k, 0])), c, l=2.4)
        S.ligne(R(1 / k, 0), R(1.3, 0), c, l=2.4)
        S.ligne(R(-0.42, 0), R(0, 0), c, l=2.4)
        _grad_y(S, R, k, str(k))
    for v, lab in ((0.25, '1/4'), (0.5, '1/2'), (1, '1')):
        _grad_x(S, R, v, lab)
    return S


@schema('lex-valeur-principale-2')
def lex_valeur_principale_2():
    Hh = 290
    e = 0.2
    assert abs(math.log(2 * e) - math.log(e) - math.log(2)) < 1e-15        # aire de la bande rouge
    S = Schema(W, Hh, 'Le graphe de 1/x, les bandes qui se compensent et la bande retirée en plus')
    R = Repere(-1.15, 1.15, -6.0, 6.0, 26, 12, 370, 266)
    _axes(S, R, 'x', '')
    def bande(a, b, c):
        xs = np.linspace(a, b, 120)
        ys = np.clip(1 / xs, R.ymin, R.ymax)
        pts = np.concatenate([R(xs, ys), R(np.array([b, a]), np.array([0.0, 0.0]))])
        S.poly(pts, c, ferme=True, rempli=c, l=0.8)
    bande(-1, -e, 'b')
    bande(e, 1, 'b')
    bande(e, 2 * e, 'r')
    # symétrie des deux bandes bleues : ∫_{−1}^{−ε} + ∫_ε^1 = 0 ; ici on montre [2ε, 1] et [−1, −ε] :
    # la bande [ε, 2ε] complète la compensation, ce que dit la légende
    for a, b in ((1 / 6.0, 1.12), (-1.12, -1 / 6.0)):
        xs = np.linspace(a, b, 400)
        S.poly(R(xs, 1 / xs), 't', l=2.2)
    for v, lab in ((-1, '−1'), (1, '1')):
        _grad_x(S, R, v, lab, dy=16 if v > 0 else -14)
    _grad_x(S, R, e, '', dy=16)
    _grad_x(S, R, 2 * e, '', dy=16)
    _grad_x(S, R, -e, '', dy=16)
    _etiq(S, R(e, 0) + [-2, 15], 'ε', 'g', taille=14)
    _etiq(S, R(2 * e, 0) + [4, 15], '2ε', 'g', taille=14)
    _etiq(S, R(-e, 0) + [0, -14], '−ε', 'g', taille=14)
    return S


@schema('lex-derivee-distribution-2')
def lex_derivee_distribution_2():
    Hh = 290
    S = Schema(W, Hh, 'La partie entière et sa dérivée, somme de masses de Dirac')
    R1 = Repere(-2.6, 3.6, -2.6, 3.4, 30, 6, 372, 160)
    R2 = Repere(-2.6, 3.6, -0.25, 1.35, 30, 186, 372, 96)
    _axes(S, R1, 'x', '')
    _axes(S, R2, 'x', '')
    for k in range(-3, 4):
        a, b = max(k, -2.55), min(k + 1, 3.55)
        if a >= b:
            continue
        S.ligne(R1(a, k), R1(b, k), 't', l=2.4)
        if k >= -2:
            S.point(R1(k, k), 't', r=3.4)
        if b == k + 1 and k + 1 <= 3:
            S.point(R1(k + 1, k), 't', r=3.4, creux=True)
    for k in range(-2, 4):
        assert math.floor(k) - math.floor(k - 0.5) == 1                    # saut de hauteur 1
        S.fleche(R2(k, 0), R2(k, 1), 'r', l=2.4)
    for k in (-2, -1, 1, 2, 3):
        _grad_x(S, R2, k, str(k).replace('-', '−'), dy=16)
    _grad_y(S, R2, 1, '1', ox=-2.6, dx=-6)
    return S


@schema('lex-fonction-heaviside-2')
def lex_fonction_heaviside_2():
    Hh = 296
    S = Schema(W, Hh, 'Les marches σ(x/ε) et leurs dérivées')
    R1 = Repere(-0.6, 1.4, -0.15, 1.2, 30, 6, 372, 104)
    R2 = Repere(-0.6, 1.4, -1.8, 9.2, 30, 126, 372, 162)
    _axes(S, R1, 'x', '')
    _axes(S, R2, 'x', '')
    xs = np.linspace(-0.58, 1.38, 3000)
    for e, c in ((1.0, 'g'), (0.5, 'b'), (0.25, 'r')):
        y = sigma(xs / e)
        d = dsigma(xs / e) / e
        aire = integrate.quad(lambda x: float(dsigma(x / e) / e), 0, e, epsabs=1e-12)[0]
        assert abs(aire - 1) < 1e-8 and np.all(d >= -1e-12)
        assert np.all(d[(xs < 0) | (xs > e)] == 0)
        _courbe(S, R1, xs, y, c, l=2.2)
        _courbe(S, R2, xs, d, c, l=2.0)
    S.ligne(R1(0, 1), R1(1.38, 1), 'g', d=True)
    _grad_y(S, R1, 1, '1')
    for R in (R1, R2):
        _grad_x(S, R, 1, '1')
    return S


@schema('lex-solution-elementaire-2')
def lex_solution_elementaire_2():
    Hh = 250
    S = Schema(W, Hh, 'La fonction ρ et la solution u = E * ρ de u″ = ρ')
    R = Repere(-2.2, 2.6, -0.25, 2.3, 30, 10, 372, 222)
    _axes(S, R, 'x', '')
    xs = np.linspace(-2.15, 2.25, 900)
    def u(x):
        if x <= -1:
            return 0.0
        return integrate.quad(lambda z: (x - z) * float(rho(z)), -1, min(x, 1.0), epsabs=1e-12)[0]
    us = np.array([u(x) for x in xs])
    assert np.all(np.abs(us[xs <= -1]) < 1e-12) and np.all(np.abs(us[xs >= 1] - xs[xs >= 1]) < 1e-8)
    S.poly(R(np.array([-0.25, 1.0]), np.array([-0.25, 1.0])), 'g', d=True, l=1.4)
    _courbe(S, R, xs, rho(xs), 'g', l=2.0)
    _courbe(S, R, xs, us, 'r', l=2.6)
    for v, lab in ((-1, '−1'), (1, '1'), (2, '2')):
        _grad_x(S, R, v, lab)
    _grad_y(S, R, 1, '1')
    _etiq(S, R(1.6, u(1.6)) + [12, 10], 'u', 'r', ancre='start')
    _etiq(S, R(-0.55, float(rho(-0.55))) + [-12, 0], 'ρ', 'g', ancre='end')
    return S


# ---------------------------------------------------------------------------------------------- paquet 5

@schema('lex-propriete-moyenne-2')
def lex_propriete_moyenne_2():
    Hh = 220
    S = Schema(W, Hh, 'La moyenne de u sur le disque de rayon r, en fonction de r')
    R = Repere(-0.08, 1.32, -0.42, 0.2, 40, 12, 360, 186)
    _axes(S, R, 'r', '')
    rs = np.linspace(0, 1.25, 600)
    m = rs ** 2 * (1 - rs ** 2) / 2
    # vérification par quadrature en polaires de la formule de la légende
    for r in (0.4, 0.8, 1.0, 1.2):
        num = integrate.quad(lambda s: (s ** 2 - 1.5 * s ** 4) * 2 * s, 0, r)[0] / r ** 2
        assert abs(num - r ** 2 * (1 - r ** 2) / 2) < 1e-12
    zeros = rs[1:][np.abs(m[1:]) < 1e-12]
    assert np.all(m[(rs > 0) & (rs < 1)] > 0) and np.all(m[rs > 1] < 0)        # nulle au seul r = 1 de ]0, 1]
    _courbe(S, R, rs, m, 'r', l=2.6)
    S.point(R(1, 0), 'r', r=4)
    _grad_x(S, R, 1, '1', dy=-14)
    _grad_x(S, R, 0.5, '1/2', dy=16)
    _grad_y(S, R, 0.125, '1/8')
    return S


@schema('lex-probleme-dirichlet-2')
def lex_probleme_dirichlet_2():
    Hh = 200
    S = Schema(W, Hh, 'Les deux solutions 1 et 1/r sur r ≥ 1')
    R = Repere(-0.2, 6.3, -0.12, 1.3, 30, 12, 372, 170)
    _axes(S, R, 'r', '')
    rs = np.linspace(1, 6.1, 400)
    S.poly(R(rs, np.ones_like(rs)), 'b', l=2.6)
    S.poly(R(rs, 1 / rs), 'r', l=2.6)
    S.ligne(R(1, 0), R(1, 1), 'g', d=True)
    S.point(R(1, 1), 't', r=4)
    assert abs(1 / rs[0] - 1) < 1e-15 and np.all(np.diff(1 / rs) < 0)
    _grad_x(S, R, 1, '1')
    _grad_y(S, R, 1, '1')
    _etiq(S, R(5.6, 1) + [0, -14], '1', 'b', taille=16)
    _etiq(S, R(5.6, 1 / 5.6) + [0, -14], '1/r', 'r', taille=16)
    return S


@schema('lex-noyau-poisson-1')
def lex_noyau_poisson_1():
    Hh = 240
    S = Schema(W, Hh, 'Le noyau de Poisson pour r = 0,3, 0,6 et 0,85')
    R = Repere(-3.5, 3.5, -0.9, 13.2, 22, 8, 390, 212)
    _axes(S, R, 't', '')
    ts = np.linspace(-math.pi, math.pi, 1201)
    for r, c, m in ((0.3, 'g', 1.86), (0.6, 'b', 4.0), (0.85, 'r', 12.3)):
        P = (1 - r ** 2) / (1 - 2 * r * np.cos(ts) + r ** 2)
        moy = integrate.quad(lambda t: (1 - r ** 2) / (1 - 2 * r * math.cos(t) + r ** 2), -math.pi, math.pi)[0]
        assert abs(moy / (2 * math.pi) - 1) < 1e-10
        assert abs(P.max() - (1 + r) / (1 - r)) < 1e-9 and abs((1 + r) / (1 - r) - m) < 0.05
        _courbe(S, R, ts, P, c, l=2.3)
    for v, lab in ((-math.pi, '−π'), (math.pi, 'π')):
        _grad_x(S, R, v, lab)
    return S


@schema('lex-equation-chaleur-1')
def lex_equation_chaleur_1():
    Hh = 230
    S = Schema(W, Hh, 'La solution de donnée cos x + cos 3x aux instants 0, 0,1 et 0,4')
    R = Repere(-3.45, 3.45, -2.3, 2.3, 26, 10, 380, 210)
    _axes(S, R, 'x', '')
    xs = np.linspace(-math.pi, math.pi, 900)
    for t, c in ((0.0, 'g'), (0.1, 'b'), (0.4, 'r')):
        u = math.exp(-t) * np.cos(xs) + math.exp(-9 * t) * np.cos(3 * xs)
        _courbe(S, R, xs, u, c, l=2.2)
    # légende : la composante rapide décroît neuf fois plus vite
    assert abs(math.log(math.exp(-9 * 0.4)) / math.log(math.exp(-0.4)) - 9) < 1e-12
    for v, lab in ((-math.pi, '−π'), (math.pi, 'π')):
        _grad_x(S, R, v, lab, dy=16)
    return S


@schema('lex-noyau-chaleur-1')
def lex_noyau_chaleur_1():
    Hh = 220
    S = Schema(W, Hh, 'La température t ↦ G(t, x) en x = 1 et en x = 2')
    R = Repere(-0.25, 6.4, -0.03, 0.29, 52, 10, 356, 192)
    _axes(S, R, 't', '')
    ts = np.linspace(1e-3, 6.2, 3000)
    for x, c in ((1.0, 'r'), (2.0, 'b')):
        g = np.exp(-x ** 2 / (4 * ts)) / np.sqrt(4 * np.pi * ts)
        tmax = x ** 2 / 2
        vmax = 1 / (x * math.sqrt(2 * math.pi * math.e))
        assert abs(ts[np.argmax(g)] - tmax) < 5e-3 and abs(g.max() - vmax) < 1e-6
        _courbe(S, R, ts, g, c, l=2.4)
        S.point(R(tmax, vmax), c, r=4)
        S.ligne(R(tmax, 0), R(tmax, vmax), 'g', d=True)
    _grad_x(S, R, 0.5, '1/2')
    _grad_x(S, R, 2, '2')
    _grad_y(S, R, 0.242, '0,242')
    _grad_y(S, R, 0.121, '0,121')
    return S


@schema('lex-boule-fermee-ouvert-1')
def lex_boule_fermee_ouvert_1():
    Hh = 260
    S = Schema(W, Hh, 'Le plan privé de l’origine, une boule fermée et un segment')
    k = 70.0
    R = Repere(-2.85, 2.85, -1.7, 1.85, (W - 5.7 * k) / 2, 6, 5.7 * k, 3.55 * k)
    p = np.array([1.2, 0.8])
    r = 0.75
    assert r < np.linalg.norm(p)                                       # la boule ne contient pas 0
    t = np.linspace(0, 2 * np.pi, 240)
    bord = p + r * np.stack([np.cos(t), np.sin(t)], 1)
    assert np.min(np.linalg.norm(bord, axis=1)) > 0.1
    S.ligne(R(-2.8, 0), R(2.8, 0), 'g')
    S.ligne(R(0, -1.65), R(0, 1.8), 'g')
    S.poly(R(bord[:, 0], bord[:, 1]), 'b', ferme=True, rempli='b', l=2.2)
    # segment de p à −p, qui passe par 0
    S.ligne(R(*p), R(*(-p)), 'r', l=2.4)
    S.point(R(*p), 't', r=3.8)
    S.point(R(*(-p)), 't', r=3.8)
    S.point(R(0, 0), 'g', r=5, creux=True)
    _etiq(S, R(*p) + [10, -12], 'p', 't', ancre='start')
    _etiq(S, R(*(-p)) + [-10, 12], '−p', 't', ancre='end')
    _etiq(S, R(0, 0) + [-10, -14], '0', 'g', ancre='end', taille=15)
    return S
