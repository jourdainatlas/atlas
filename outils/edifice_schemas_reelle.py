"""Schémas des graphes analyse-reelle, continuite, anc (analyse complexe) et edo.

Toute position est calculée ; toute affirmation illustrée est vérifiée par un assert.
Ordre d'apparition : dans analyse-reelle et continuite, exemples polynomiaux ou rationnels seulement.
"""
import numpy as np
from fractions import Fraction as Fr
from edifice_schemas import schema
from edifice_svg import Schema, Repere, arc, blob


def _cercle_oriente(S, centre, r, c='t', t0=-0.6, d=False):
    """Cercle (coordonnées image) avec une pointe indiquant le sens direct (anti-horaire à l'écran)."""
    S.cercle(centre, r, c, d)
    p = np.array([centre[0] + r * np.cos(t0), centre[1] - r * np.sin(t0)])
    tangente = np.array([-np.sin(t0), -np.cos(t0)])      # dérivée de (cos t, -sin t)
    S.pointe(p + 5 * tangente, tangente, c)


def _milieu_fleche(S, p, q, c='t', decal=0.0):
    """Petite pointe au milieu du segment [p, q] (sens p → q), éventuellement décalée vers la gauche."""
    p, q = np.asarray(p, float), np.asarray(q, float)
    u = (q - p) / np.linalg.norm(q - p)
    n = np.array([u[1], -u[0]])
    S.pointe((p + q) / 2 + 4 * u + decal * n, u, c, taille=7, largeur=3)


# ---------------------------------------------------------------------------------------------------
# analyse-reelle
# ---------------------------------------------------------------------------------------------------

def _pics(u, N, M=4000):
    """Indices n < N tels que u_n >= u_m pour tout m > n (vérifié jusqu'à M, la suite étant
    monotone par parité au-delà, ce que l'on vérifie aussi)."""
    vals = [u(n) for n in range(M)]
    return [n for n in range(N) if all(vals[n] >= vals[m] for m in range(n + 1, M))]


@schema('ar-bw')
def ar_bw():
    u1 = lambda n: Fr((-1) ** n * n, n + 1) + Fr(2, n + 1)
    u2 = lambda n: Fr((-1) ** n * (n - 3), n + 1)
    N = 16
    # u1 : termes pairs 1 + 1/(n+1) > 1, décroissants ; termes impairs (2 - n)/(n+1) < 1.
    assert all(u1(2 * k) > 1 > u1(2 * k + 1) for k in range(2000))
    assert all(u1(2 * k) > u1(2 * k + 2) for k in range(2000))
    p1 = _pics(u1, N)
    assert p1 == list(range(0, N, 2))                         # une infinité de pics : les pairs
    # u2 : pairs (n-3)/(n+1) croissants < 1 ; impairs n >= 5 négatifs décroissants ; u_1 = 1.
    assert u2(1) == 1 and all(u2(n) < 1 for n in range(2, 4000))
    p2 = _pics(u2, N)
    assert p2 == [1]                                          # un seul pic
    # construction de la preuve : n_0 > tous les pics (on prend n_0 = 2), puis le plus petit m > n_k
    # avec u_m > u_{n_k}
    ext = [2]
    while True:
        n = ext[-1]
        m = next(m for m in range(n + 1, 10 ** 4) if u2(m) > u2(n))
        if m >= N:
            break
        ext.append(m)
    assert ext == [2, 3, 4, 6, 8, 10, 12, 14]
    assert all(u2(ext[i]) < u2(ext[i + 1]) for i in range(len(ext) - 1))

    S = Schema(520, 390, 'Lemme des pics : une infinité de pics, puis un seul pic')
    for k, (u, pics, ymin, ymax, y0, h) in enumerate([
            (u1, p1, -1.0, 2.1, 34, 140), (u2, p2, -1.0, 1.2, 228, 150)]):
        R = Repere(-0.6, 16.4, ymin, ymax, 30, y0, 470, h)
        S.ligne(R(-0.6, 0), R(16.2, 0), 'g')
        S.texte(R(16.2, 0) + [6, 0], 'n', 'g', ancre='start', taille=15)
        for n in range(N):
            S.ligne(R(n, 0) + [0, -3], R(n, 0) + [0, 3], 'g')
        if k == 0:
            for n in pics[:3]:      # u_n majore tous les termes suivants : pointillé vers la droite
                S.ligne(R(n, float(u(n))), R(16.2, float(u(n))), 'g', d=True)
            S.poly(R(np.array(pics, float), np.array([float(u(n)) for n in pics])), 'r', l=1.6)
        else:
            S.ligne(R(1, float(u(1))), R(16.2, float(u(1))), 'g', d=True)
            S.poly(R(np.array(ext, float), np.array([float(u(n)) for n in ext])), 'r', l=1.6)
        for n in range(0 if k == 0 else 1, N):   # en bas, u_0 = -3 sort du cadre et ne joue aucun rôle
            S.point(R(n, float(u(n))), 't', r=3)
        for n in pics:
            S.cercle(R(n, float(u(n))), 7, 'r' if k == 0 else 'g')
        if k == 0:
            S.texte(R(0, float(u(0))) + [0, 24], 'pic', 'r', ui=True)
            S.texte((265, 14), 'une infinité de pics : ils forment une suite décroissante', 'r', ui=True)
            S.texte(R(7, float(u(7))) + [0, 16], 'u_n', taille=15)
        else:
            S.texte(R(1, float(u(1))) + [12, -12], 'seul pic', 'g', ancre='start', ui=True)
            for n, lab in [(2, 'n_0'), (3, 'n_1'), (4, 'n_2'), (6, 'n_3'), (8, 'n_4')]:
                S.texte(R(n, float(u(n))) + [0, 17 if n != 3 else -15] if n < 6 else R(n, float(u(n))) + [0, -15],
                        lab, 'r', taille=15)
            S.texte((265, 208), 'un seul pic : on prend chaque fois le premier terme qui dépasse', 'r', ui=True)
    return S


@schema('ar-deriv')
def ar_deriv():
    fn = lambda x: x * (x - 3) ** 2
    a, b = 0.0, 3.0
    assert fn(a) == fn(b) == 0
    xs = np.linspace(a, b, 30001)
    c = xs[np.argmax(fn(xs))]
    assert abs(c - 1) < 1e-3 and abs(fn(1) - 4) < 1e-12
    c, M = 1.0, 4.0
    assert abs(3 * c ** 2 - 12 * c + 9) < 1e-12                  # f'(1) = 0
    xd, xg = 2.2, 0.35
    td, tg = (fn(xd) - M) / (xd - c), (fn(xg) - M) / (xg - c)
    assert td <= 0 <= tg
    # tous les taux à droite sont <= 0, à gauche >= 0
    assert all((fn(x) - M) / (x - c) <= 0 for x in np.linspace(1.001, 3, 500))
    assert all((fn(x) - M) / (x - c) >= 0 for x in np.linspace(0, 0.999, 500))
    S = Schema(500, 330, 'Rolle : au maximum, taux à droite négatifs, à gauche positifs')
    R = Repere(-0.3, 3.5, -0.7, 4.8, 30, 15, 440, 285)
    S.fleche(R(-0.3, 0), R(3.45, 0), 'g')
    S.texte(R(3.45, 0) + [8, 0], 'x', 'g', ancre='start')
    R.graphe(S, fn, a, b, 't', l=2)
    S.texte(R(2.55, fn(2.55)) + [12, -6], 'f', ancre='start')
    # tangente horizontale
    S.ligne(R(c - 0.75, M), R(c + 0.75, M), 'r', l=2)
    # cordes
    S.ligne(R(c, M), R(xd, fn(xd)), 'b', l=1.6)
    S.ligne(R(c, M), R(xg, fn(xg)), 'v', l=1.6)
    S.point(R(xd, fn(xd)), 'b')
    S.point(R(xg, fn(xg)), 'v')
    S.texte(R((c + xd) / 2, (M + fn(xd)) / 2) + [22, 4], 'taux ⩽ 0', 'b', ancre='start', ui=True)
    S.texte(R((c + xg) / 2, (M + fn(xg)) / 2) + [-22, -8], 'taux ⩾ 0', 'v', ancre='end', ui=True)
    for x, lab in [(a, 'a'), (c, 'c'), (xg, 'x'), (xd, 'x'), (b, 'b')]:
        S.texte(R(x, 0) + [0, 17], lab, 'r' if lab == 'c' else ('t' if lab in 'ab' else ('v' if x < c else 'b')))
    S.ligne(R(c, 0), R(c, M), 'g', d=True)
    S.ligne(R(xg, 0), R(xg, fn(xg)), 'g', d=True)
    S.ligne(R(xd, 0), R(xd, fn(xd)), 'g', d=True)
    S.point(R(c, M), 'r', r=4.2)
    S.texte(R(c, M) + [0, -16], 'M = f(c)', 'r')
    S.texte(R(c - 0.75, M) + [-6, 0], 'f^{′}(c) = 0', 'r', ancre='end')
    return S


@schema('ar-riemann')
def ar_riemann():
    fn = lambda x: 1 + x - x ** 3 / 3
    a, b, n, eps = 0.0, 2.0, 16, 0.4
    xi = np.linspace(a, b, n + 1)
    ecart = 0
    for i in range(n):
        xs = np.linspace(xi[i], xi[i + 1], 2001)
        ecart = max(ecart, np.max(np.abs(fn(xs) - fn(xi[i]))))
    assert ecart < eps and abs(ecart - 0.344) < 1e-3              # phi <= f <= psi sur chaque pas
    S = Schema(500, 330, 'Escaliers phi et psi encadrant f, écart constant 2 epsilon')
    R = Repere(-0.15, 2.3, -0.25, 2.25, 40, 12, 420, 285)
    S.fleche(R(-0.15, 0), R(2.25, 0), 'g')
    S.fleche(R(0, -0.25), R(0, 2.22), 'g')
    for i in range(n):
        p, q, v = xi[i], xi[i + 1], fn(xi[i])
        S.surface([R(p, v - eps), R(q, v - eps), R(q, v + eps), R(p, v + eps)], 'g')
    for sgn, c in [(-1, 'b'), (1, 'v')]:
        pts = []
        for i in range(n):
            v = fn(xi[i]) + sgn * eps
            pts += [R(xi[i], v), R(xi[i + 1], v)]
        S.poly(pts, c, l=1.6)
    R.graphe(S, fn, a, b, 't', l=2)
    for i in range(n):
        S.point(R(xi[i], fn(xi[i])), 't', r=2.2)
    for x, lab in [(a, 'a'), (b, 'b')]:
        S.texte(R(x, 0) + [0, 16], lab)
    for i in (5, 6):
        S.ligne(R(xi[i], 0) + [0, -4], R(xi[i], 0) + [0, 4], 'g')
    S.texte(R(xi[5], 0) + [0, 16], 'x_i', 'g', taille=15)
    S.texte(R(xi[6], 0) + [6, 16], 'x_{i+1}', 'g', taille=15, ancre='start')
    vl = fn(xi[-2])
    S.texte(R(2.0, vl + eps) + [10, 0], 'ψ', 'v', ancre='start')
    S.texte(R(2.0, fn(2.0)) + [10, 2], 'f', ancre='start')
    S.texte(R(xi[1], fn(0) - eps) + [0, 15], 'φ', 'b')
    # échelle 2 epsilon à gauche
    v0 = fn(0)
    S.ligne(R(0, v0 - eps) + [-10, 0], R(0, v0 + eps) + [-10, 0], 'g')
    S.texte(R(0, v0) + [-14, 0], '2ε', 'g', ancre='end')
    return S


# ---------------------------------------------------------------------------------------------------
# continuite
# ---------------------------------------------------------------------------------------------------

@schema('c-point')
def c_point():
    fn = lambda x: x ** 2
    a, eps, dl = 1.0, 0.5, 0.2
    assert dl < np.sqrt(1 + eps) - 1                               # 0,2 < 0,2247
    xs = np.linspace(a - dl, a + dl, 2001)
    assert np.all(np.abs(fn(xs) - fn(a)) < eps)
    S = Schema(480, 340, 'Continuité en a : bande epsilon, bande delta, graphe dans le rectangle')
    R = Repere(-0.15, 1.75, -0.2, 2.6, 40, 15, 400, 290)
    S.fleche(R(-0.15, 0), R(1.72, 0), 'g')
    S.fleche(R(0, -0.2), R(0, 2.57), 'g')
    S.texte(R(1.72, 0) + [8, 0], 'x', 'g', ancre='start')
    # bande horizontale ]f(a)-eps, f(a)+eps[ et bande verticale ]a-delta, a+delta[
    S.surface([R(0, fn(a) - eps), R(1.7, fn(a) - eps), R(1.7, fn(a) + eps), R(0, fn(a) + eps)], 'b')
    S.surface([R(a - dl, 0), R(a + dl, 0), R(a + dl, 2.55), R(a - dl, 2.55)], 'v')
    for y in (fn(a) - eps, fn(a) + eps):
        S.ligne(R(0, y), R(1.7, y), 'b', d=True)
    for x in (a - dl, a + dl):
        S.ligne(R(x, 0), R(x, 2.55), 'v', d=True)
    S.rect(*R(a - dl, fn(a) + eps), *(R(a + dl, fn(a) - eps) - R(a - dl, fn(a) + eps)), 'r', d=False)
    R.graphe(S, fn, 0, 1.6, 't', l=1.6)
    R.graphe(S, fn, a - dl, a + dl, 'r', l=3)
    S.point(R(a, fn(a)), 'r', r=4)
    S.ligne(R(a, 0), R(a, fn(a)), 'g', d=True)
    S.ligne(R(0, fn(a)), R(a, fn(a)), 'g', d=True)
    S.texte(R(a, 0) + [0, 16], 'a')
    S.texte(R(0, fn(a)) + [-8, 0], 'f(a)', ancre='end')
    S.texte(R(1.6, fn(1.6)) + [8, 4], 'f', ancre='start')
    # cotes epsilon et delta
    xe = 1.55
    S.fleche(R(xe, fn(a)), R(xe, fn(a) + eps), 'b')
    S.texte(R(xe, fn(a) + eps / 2) + [8, 0], 'ε', 'b', ancre='start')
    yd = 0.18
    S.fleche(R(a, yd), R(a + dl, yd), 'v')
    S.texte(R(a + dl / 2, yd) + [0, -12], 'δ', 'v')
    return S


@schema('c-uniforme')
def c_uniforme():
    fn = lambda x: x ** 2
    xs0 = [1.2, 2.2, 3.2]
    S = Schema(500, 380, 'x carré : écarts 1/x de plus en plus petits, écarts des images toujours supérieurs à 2')
    R = Repere(-0.2, 4.0, -0.9, 13.0, 62, 14, 400, 330)
    S.fleche(R(-0.2, 0), R(3.95, 0), 'g')
    S.fleche(R(0, -0.9), R(0, 12.95), 'g')
    S.texte(R(3.95, 0) + [8, 0], 'x', 'g', ancre='start')
    R.graphe(S, fn, 0, 3.6, 't', l=1.6)
    S.texte(R(3.6, fn(3.6)) + [8, 6], 'f', ancre='start')
    for x in xs0:
        y = x + 1 / x
        gap = fn(y) - fn(x)
        assert abs(gap - (2 + 1 / x ** 2)) < 1e-12 and gap > 2
        for t in (x, y):
            S.ligne(R(t, 0), R(t, fn(t)), 'g', d=True)
            S.ligne(R(0, fn(t)), R(t, fn(t)), 'g', d=True)
            S.point(R(t, fn(t)), 'r', r=3)
        S.ligne(R(x, 0), R(y, 0), 'b', l=4)
        S.ligne(R(0, fn(x)), R(0, fn(y)), 'r', l=4)
        S.texte(R((x + y) / 2, 0) + [0, 17], f'{1 / x:.2f}'.replace('.', ','), 'b', taille=14)
        S.texte(R(0, (fn(x) + fn(y)) / 2) + [-8, 0], f'{gap:.2f}'.replace('.', ','), 'r', ancre='end', taille=14)
    # les trois intervalles sont disjoints sur chaque axe
    assert all(xs0[i] + 1 / xs0[i] < xs0[i + 1] for i in range(2))
    assert all(fn(xs0[i] + 1 / xs0[i]) < fn(xs0[i + 1]) for i in range(2))
    S.texte(R(1.2, 0) + [0, 34], 'x', 'b', taille=15)
    S.texte(R(1.2 + 1 / 1.2, 0) + [0, 34], 'x + 1/x', 'b', taille=15)
    return S


@schema('c-monotone')
def c_monotone():
    # J = [0, 2], g(x) = x sur [0, 1], x + 1 sur ]1, 2] ; b = 1, g(b) = 1, l = inf{g(x) : x > 1} = 2.
    g = lambda x: np.where(x <= 1, x, x + 1)
    b = 1.0
    ell = min(g(np.linspace(1 + 1e-9, 2, 1000)))
    assert abs(ell - 2) < 1e-6 and g(np.array(b)) == 1
    img = g(np.linspace(0, 2, 20001))
    assert not np.any((img > 1) & (img < 2))                      # aucune valeur dans ]g(b), l[
    S = Schema(460, 330, 'Fonction croissante avec un saut : son image évite ]g(b), l[')
    R = Repere(-0.6, 2.5, -0.25, 3.3, 30, 15, 400, 290)
    S.fleche(R(-0.2, 0), R(2.45, 0), 'g')
    S.fleche(R(0, -0.25), R(0, 3.27), 'g')
    S.ligne(R(0, 0), R(1, 1), 't', l=2)
    S.ligne(R(1, 2), R(2, 3), 't', l=2)
    S.point(R(1, 1), 't', r=4)
    S.point(R(1, 2), 't', r=4, creux=True)
    S.point(R(2, 3), 't', r=3.5)
    S.ligne(R(b, 0), R(b, 2), 'g', d=True)
    S.ligne(R(0, 1), R(b, 1), 'g', d=True)
    S.ligne(R(0, 2), R(b, 2), 'g', d=True)
    S.ligne(R(0, 3), R(2, 3), 'g', d=True)
    S.ligne(R(2, 0), R(2, 3), 'g', d=True)
    # image sur l'axe des ordonnées
    S.ligne(R(0, 0), R(0, 1), 'b', l=5)
    S.ligne(R(0, 2), R(0, 3), 'b', l=5)
    S.ligne(R(0, 1) + [0, -5], R(0, 2) + [0, 5], 'r', d=True, l=2.5)
    S.texte(R(0, 1) + [-10, 0], 'g(b)', ancre='end')
    S.texte(R(0, 2) + [-10, 0], 'ℓ', ancre='end')
    S.texte(R(0, 1.5) + [-10, 0], 'trou', 'r', ancre='end', ui=True)
    S.texte(R(0, 2.75) + [-10, 0], 'g(J)', 'b', ancre='end')
    S.texte(R(b, 0) + [0, 17], 'b')
    S.texte(R(2, 0) + [0, 17], '2', 'g')
    S.texte(R(0, 0) + [-8, 17], '0', 'g')
    S.texte(R(1.5, 2.5) + [-6, -16], 'g', ancre='end')
    return S


# ---------------------------------------------------------------------------------------------------
# anc (analyse complexe) : les points du plan complexe sont dessinés comme des points de ℝ²
# ---------------------------------------------------------------------------------------------------

@schema('cx-series-entieres')
def cx_series_entieres():
    Rr, r, rho = 3.0, 2.2, 1.5                    # rayon de convergence, (a_n r^n) bornée, |z| = rho
    assert 0 < rho < r < Rr
    k = 56                                        # pixels par unité
    O = np.array([200.0, 200.0])
    P = lambda x, y: O + k * np.array([x, -y])
    S = Schema(520, 400, 'Disques de rayons rho, r et R d’une série entière')
    S.cercle(O, k * rho, 'r', rempli='r')
    S.cercle(O, k * r, 'b', d=True)
    S.cercle(O, k * Rr, 't')
    S.point(O, 't')
    S.texte(O + [8, 14], '0', ancre='start')
    th = np.radians(35)
    z = P(rho * np.cos(th), rho * np.sin(th))
    S.ligne(O, z, 'r')
    S.point(z, 'r', r=4)
    S.texte(z + [8, -10], 'z', 'r', ancre='start')
    S.texte((O + z) / 2 + [-4, -12], 'ρ', 'r', ancre='end')
    th2 = np.radians(150)
    q = P(r * np.cos(th2), r * np.sin(th2))
    S.ligne(O, q, 'b', d=True)
    S.texte((O + q) / 2 + [-4, -14], 'r', 'b')
    th3 = np.radians(190)
    q3 = P(Rr * np.cos(th3), Rr * np.sin(th3))
    S.ligne(O, q3, 't')
    S.texte(O + 0.82 * (q3 - O) + [0, 14], 'R')
    # mentions, avec un trait de rappel
    S.texte(P(0, -rho / 2) + [0, 2], 'convergence absolue', 'r', ui=True)
    S.texte(P(0, -rho / 2) + [0, 18], 'et uniforme', 'r', ui=True)
    pb = P(r * np.cos(np.radians(60)), r * np.sin(np.radians(60)))
    S.ligne(pb, (395, 52), 'g')
    S.texte((400, 52), '(a_n r^n) `bornée`', 'b', ancre='start', taille=15)
    pR = P(Rr * np.cos(np.radians(15)), Rr * np.sin(np.radians(15)))
    S.ligne(pR, (395, 150), 'g')
    S.texte((400, 150), '|z| = R : ?', ancre='start', taille=15)
    S.texte((420, 330), '|z| > R :', ancre='middle', taille=15)
    S.texte((420, 352), 'diverge', ui=True)
    # z est bien à l'intérieur strict de chaque disque, et le point du cercle R est bien sur lui
    assert np.isclose(np.linalg.norm(z - O) / k, rho) and np.isclose(np.linalg.norm(pR - O) / k, Rr)
    return S


def _int_triangle(f, sommets, ng=6):
    """Intégrale de f sur le bord orienté du triangle (Gauss-Legendre, exacte pour un polynôme en
    x, y de degré < 2 ng)."""
    xg, wg = np.polynomial.legendre.leggauss(ng)
    t, w = (xg + 1) / 2, wg / 2
    tot = 0
    for p, q in zip(sommets, sommets[1:] + sommets[:1]):
        tot += np.sum(w * f(p + t * (q - p))) * (q - p)
    return tot


def _quatre(T):
    a, b, c = T
    mab, mbc, mca = (a + b) / 2, (b + c) / 2, (c + a) / 2
    return [[a, mab, mca], [mab, b, mbc], [mca, mbc, c], [mbc, mca, mab]]


def _goursat_suite(f, T, n=14):
    """Triangles emboîtés de la preuve : à chaque étape, le sous-triangle d'intégrale de plus grand
    module, qui vérifie bien |∫ ∂T_{n+1}| ⩾ |∫ ∂T_n| / 4."""
    suite = [T]
    for _ in range(n):
        quatre = _quatre(suite[-1])
        vals = [_int_triangle(f, Q) for Q in quatre]
        tout = _int_triangle(f, suite[-1])
        assert abs(sum(vals) - tout) < 1e-12 + 1e-9 * abs(tout)       # les côtés intérieurs se compensent
        j = int(np.argmax(np.abs(vals)))
        assert abs(vals[j]) >= abs(tout) / 4 * (1 - 1e-12)
        suite.append(quatre[j])
    return suite


@schema('cx-goursat')
def cx_goursat():
    a, b, c = 0j, 4 + 0j, 1 + 3j
    p0 = 2 + 1j
    # f non holomorphe : f(z) = conj(w) - w conj(w)^2 / 16, w = z - p0 ; df/dz̄ = 1 - |w|^2 / 8 > 0 sur T
    f = lambda z: np.conj(z - p0) - (z - p0) * np.conj(z - p0) ** 2 / 16
    T = [a, b, c]
    assert max(abs(v - p0) ** 2 for v in T) < 8
    assert abs(_int_triangle(f, T)) > 1
    suite = _goursat_suite(f, T)
    z0 = sum(suite[-1]) / 3        # T_14 a un diamètre 4 · 2^-14 : z_0 à moins d'un millième de pixel
    for n, Tn in enumerate(suite):        # z_0 appartient à chaque T_n (coordonnées barycentriques)
        A = np.array([[Tn[0].real, Tn[1].real, Tn[2].real], [Tn[0].imag, Tn[1].imag, Tn[2].imag], [1, 1, 1]])
        lam = np.linalg.solve(A, [z0.real, z0.imag, 1])
        assert np.all(lam > -1e-9)
    S = Schema(520, 262, 'Découpage de Goursat et triangles emboîtés')
    k = 57
    O1, O2 = np.array([22.0, 205.0]), np.array([282.0, 205.0])
    P = lambda O, z: O + k * np.array([z.real, -z.imag])
    # panneau gauche : quatre sous-triangles, chacun parcouru dans le sens direct
    S.poly([P(O1, v) for v in _quatre(T)[3]], 'g', ferme=True)
    S.poly([P(O1, v) for v in T], 't', ferme=True, l=1.6)
    for Q in _quatre(T):
        pg = P(O1, sum(Q) / 3)
        for u, v in zip(Q, Q[1:] + Q[:1]):
            pu, pv = P(O1, u), P(O1, v)
            m = (pu + pv) / 2
            dirn = (pg - m) / np.linalg.norm(pg - m)
            e = (pv - pu) / np.linalg.norm(pv - pu)
            S.pointe(m + 7 * dirn + 4 * e, e, 'b', taille=7, largeur=3)
    for v, lab, dd in [(a, 'a', [-4, 16]), (b, 'b', [4, 16]), (c, 'c', [0, -14])]:
        S.texte(P(O1, v) + dd, lab)
    # panneau droit : T_1 ⊃ T_2 ⊃ T_3 ⊃ T_4, et z_0
    S.poly([P(O2, v) for v in T], 'g', ferme=True)
    for n in range(1, 5):
        S.poly([P(O2, v) for v in suite[n]], 'r', ferme=True, rempli='r' if n == 1 else None,
               l=1.6 if n == 1 else 1.1)
    S.point(P(O2, z0), 'r', r=2.6)
    S.texte(P(O2, 0.95 + 1.3j), 'T_1', 'r', taille=15)
    pz = P(O2, z0)
    lab = P(O2, 3.1 + 0.55j)
    S.ligne(pz + (lab - pz) / np.linalg.norm(lab - pz) * 6, lab + [-4, 2], 'g')
    S.texte(lab + [0, 6], 'z_0', 'r', ancre='start', taille=15)
    for v, lab, dd in [(a, 'a', [-4, 16]), (b, 'b', [4, 16]), (c, 'c', [0, -14])]:
        S.texte(P(O2, v) + dd, lab, 'g')
    return S


@schema('cx-goursat-2')
def cx_goursat_2():
    a, b, c = 0j, 4 + 0j, 1 + 3j
    p = a
    t = 0.28
    b1, c1 = a + t * (b - a), a + t * (c - a)                 # b' sur [a, b], c' sur [a, c]
    pieces = [[a, b1, c1], [b1, b, c], [b1, c, c1]]
    aire = lambda Q: ((Q[1] - Q[0]).conjugate() * (Q[2] - Q[0])).imag / 2
    assert abs(sum(aire(Q) for Q in pieces) - aire([a, b, c])) < 1e-12        # partition de T
    assert all(aire(Q) > 0 for Q in pieces)                                     # même orientation
    # p n'appartient pas aux deux derniers (coordonnées barycentriques)
    def dedans(Q, z):
        A = np.array([[v.real for v in Q], [v.imag for v in Q], [1, 1, 1]])
        return np.all(np.linalg.solve(A, [z.real, z.imag, 1]) >= -1e-12)
    assert dedans(pieces[0], p) and not dedans(pieces[1], p) and not dedans(pieces[2], p)
    S = Schema(480, 290, 'Lemme de Goursat, cas où p est un sommet')
    k = 78
    O = np.array([96.0, 258.0])
    P = lambda z: O + k * np.array([z.real, -z.imag])
    S.poly([P(v) for v in pieces[0]], 'r', ferme=True, rempli='r', l=1.6)
    S.poly([P(v) for v in pieces[1]], 'g', ferme=True)
    S.poly([P(v) for v in pieces[2]], 'g', ferme=True)
    S.poly([P(v) for v in [a, b, c]], 't', ferme=True, l=1.6)
    S.point(P(p), 'r', r=4.2)
    S.texte(P(p) + [-8, 14], 'p = a', 'r', ancre='end')
    S.texte(P(b) + [6, 14], 'b', ancre='start')
    S.texte(P(c) + [0, -14], 'c')
    S.texte(P(b1) + [0, 17], 'b^{′}')
    S.texte(P(c1) + [-10, -4], 'c^{′}', ancre='end')
    S.texte(P((b1 + b + c) / 3), 'ne contient pas p', 'g', ui=True)
    S.texte(P((b1 + c + c1) / 3) + [-16, 0], 'ni celui-ci', 'g', ui=True)
    return S


@schema('cx-cauchy-convexe')
def cx_cauchy_convexe():
    A, B = 3.0, 2.0                                         # U : intérieur de l'ellipse x²/9 + y²/4 = 1
    a, z, zh = -1.9 - 0.5j, 1.0 + 0.9j, 1.9 - 0.3j
    dans = lambda w: (w.real / A) ** 2 + (w.imag / B) ** 2 < 1
    # le triangle est dans U : ses sommets y sont, et U est convexe
    assert dans(a) and dans(z) and dans(zh)
    S = Schema(500, 320, 'Primitive sur un convexe : le triangle a, z, z + h')
    k = 75
    O = np.array([250.0, 165.0])
    P = lambda w: O + k * np.array([w.real, -w.imag])
    S.ellipse(O, k * A, k * B, 't', rempli='g')
    S.surface([P(a), P(z), P(zh)], 'g')
    def seg(p, q, c):
        pp, qq = P(p), P(q)
        S.ligne(pp, qq, c, l=1.8)
        _milieu_fleche(S, pp, qq, c)
    seg(a, z, 'b')
    seg(a, zh, 'v')
    seg(z, zh, 'r')
    for w, lab, dd, c in [(a, 'a', [-10, 4], 't'), (z, 'z', [0, -15], 't'), (zh, 'z + h', [10, 8], 't')]:
        S.point(P(w), c)
        S.texte(P(w) + dd, lab, c, ancre={'a': 'end', 'z': 'middle'}.get(lab, 'start'))
    S.texte(P(-2.0 + 1.15j), 'U')
    S.texte(P((a + z) / 2) + [-14, -14], 'F(z)', 'b', ancre='end')
    S.texte(P((a + zh) / 2) + [6, 22], 'F(z + h)', 'v')
    return S


@schema('cx-formule-cauchy')
def cx_formule_cauchy():
    k = 52
    O = np.array([250.0, 190.0])            # image de c
    r, s = 1.6, 0.55
    U = blob(O, k * 3.1, k * 2.75, graine=4, amplitude=0.07)
    dmin = np.min(np.linalg.norm(U - O, axis=1)) / k
    # distance du centre au bord du polygone (bord échantillonné finement, segments courts)
    pas = np.max(np.linalg.norm(np.diff(np.vstack([U, U[:1]]), axis=0), axis=1)) / k
    assert dmin - pas > r + s                 # D(c, r + s) est bien contenu dans U
    zc = 0.75 + 0.55j                         # z - c
    assert abs(zc) < r
    th = np.radians(-28)
    wc = r * np.exp(1j * th)                  # w - c sur le cercle
    q = zc / wc
    assert np.isclose(abs(q), abs(zc) / r) and abs(q) < 1
    P = lambda w: O + k * np.array([w.real, -w.imag])
    S = Schema(500, 380, 'Formule de Cauchy : cercle C(c, r), disque D(c, r + s) dans U')
    S.poly(U, 't', ferme=True, rempli='g')
    S.cercle(O, k * (r + s), 'b', d=True)
    S.cercle(O, k * r, 'r', rempli='r')
    _cercle_oriente(S, O, k * r, 'r', t0=np.radians(120))
    S.point(O, 't')
    S.texte(O + [-6, 15], 'c', ancre='end')
    S.ligne(O, P(zc), 'g')
    S.ligne(O, P(wc), 'g')
    S.ligne(P(zc), P(wc), 'g', d=True)
    S.point(P(zc), 't', r=3.6)
    S.texte(P(zc) + [0, -14], 'z')
    S.point(P(wc), 'r', r=3.6)
    S.texte(P(wc) + [10, 6], 'w', 'r', ancre='start')
    S.texte(P(r * np.exp(1j * np.radians(200))) + [12, 0], 'C(c, r)', 'r', ancre='start', taille=15)
    pb = P((r + s) * np.exp(1j * np.radians(62)))
    S.texte(pb + [8, -10], 'D(c, r + s)', 'b', ancre='start', taille=15)
    S.texte(O + k * np.array([-2.5, -1.9]), 'U')
    S.texte((250, 362), '|q| = |z − c| / r < 1', taille=15)
    return S


@schema('cx-suites')
def cx_suites():
    qa, qb = Fr(3, 5), Fr(3, 5)                   # q = 3/5 + 3i/5, exactement
    # somme 1/(1 - q) calculée exactement : (1 - q)(10 + 15i)/13 = 1
    la, lb = Fr(10, 13), Fr(15, 13)
    assert (1 - qa) * la + qb * lb == 1 and (1 - qa) * lb - qb * la == 0
    q = complex(qa, qb)
    L = complex(la, lb)
    N = 60
    Ss = np.cumsum(q ** np.arange(N))
    for n in range(N):                            # (1 - q) S_n = 1 - q^{n+1}, et la distance à la somme
        assert abs((1 - q) * Ss[n] - (1 - q ** (n + 1))) < 1e-12
        assert np.isclose(abs(Ss[n] - L), abs(q) ** (n + 1) / abs(1 - q))
    assert abs(q) < 1
    rho3 = abs(q) ** 4 / abs(1 - q)               # cercle passant par S_3, contenant les S_N suivants
    assert np.isclose(abs(Ss[3] - L), rho3) and np.all(np.abs(Ss[4:] - L) < rho3)
    k = 170
    O = np.array([62.0, 360.0])                   # image de 0
    P = lambda z: O + k * np.array([z.real, -z.imag])
    assert P(1.6 + 0j)[0] < 360 and P(1.752j)[1] > 20
    S = Schema(520, 400, 'Sommes partielles de la série géométrique de raison 0,6 + 0,6i')
    S.fleche(P(-0.25 + 0j), P(1.95 + 0j), 'g')
    S.fleche(P(-0.12j), P(2.03j), 'g')
    S.texte(P(0j) + [-8, 14], '0', 'g', ancre='end')
    S.cercle(P(L), k * rho3, 'g', d=True)
    S.poly([P(z) for z in Ss[:45]], 'b', l=1.3)
    for n in range(12):
        S.point(P(Ss[n]), 'b', r=3.4 if n < 4 else 2.4)
    for n, dd, an in [(0, [0, 17], 'middle'), (1, [9, 4], 'start'), (2, [10, 0], 'start'),
                      (3, [6, -14], 'start')]:
        S.texte(P(Ss[n]) + dd, f'S_{n}', 'b', ancre=an)
    S.point(P(L), 'r', r=4.6)
    S.point((392, 250), 'r', r=4.6)                # légende du point rouge, hors de la spirale
    S.texte((404, 250), '= 1 / (1 − q)', 'r', ancre='start', taille=15)
    S.texte(P(1j) + [-8, 0], 'i', 'g', ancre='end')
    S.ligne(P(1j) + [-3, 0], P(1j) + [3, 0], 'g')
    S.ligne(P(1 + 0j) + [0, -3], P(1 + 0j) + [0, 3], 'g')
    S.texte((440, 300), 'q = 0,6 + 0,6i', taille=15)
    S.texte((440, 326), '|q| ≈ 0,85', taille=15)
    return S


def _cos_serie(x, n=40):
    """cos x = Re exp(ix), par la série, comme dans la fiche cx-exponentielle."""
    x = np.asarray(x, float)
    tot, terme = np.zeros_like(x), np.ones_like(x)
    for j in range(n):
        tot += terme
        terme = -terme * x * x / ((2 * j + 1) * (2 * j + 2))
    return tot


@schema('cx-pi')
def cx_pi():
    p4 = lambda x: 1 - x ** 2 / 2 + x ** 4 / 24              # termes k = 0, 1, 2 de la série
    assert p4(Fr(2)) == Fr(-1, 3)
    c2 = float(_cos_serie(2.0))
    assert c2 < -1 / 3 and np.isclose(c2, np.cos(2.0))
    # premier zéro positif, par dichotomie sur la série
    a, b = 0.0, 2.0
    for _ in range(60):
        m = (a + b) / 2
        a, b = (m, b) if _cos_serie(m) > 0 else (a, m)
    z = (a + b) / 2
    assert np.all(_cos_serie(np.linspace(0, z - 1e-9, 4001)) > 0)       # c'est bien le premier
    assert abs(z - np.pi / 2) < 1e-12
    S = Schema(500, 300, 'Graphe de cos sur [0, 2] et son premier zéro')
    R = Repere(-0.25, 2.35, -0.62, 1.22, 34, 14, 420, 252)
    S.fleche(R(-0.25, 0), R(2.32, 0), 'g')
    S.fleche(R(0, -0.62), R(0, 1.2), 'g')
    S.texte(R(2.32, 0) + [10, 0], 'x', 'g', ancre='start')
    R.graphe(S, p4, 0, 2, 'b', d=True)
    R.graphe(S, _cos_serie, 0, 2.2, 'r', l=2.2)
    S.ligne(R(2, 0), R(2, c2), 'g', d=True)
    S.ligne(R(0, -1 / 3), R(2, -1 / 3), 'g', d=True)
    S.point(R(0, 1), 'r', r=3.8)
    S.point(R(z, 0), 'r', r=4.4)
    S.point(R(2, -1 / 3), 'b', r=3.8)
    S.point(R(2, c2), 'r', r=3.8)
    S.texte(R(0, 1) + [-9, 0], '1', ancre='end')
    S.texte(R(0, -1 / 3) + [-9, 0], '−1/3', 'b', ancre='end', taille=15)
    S.texte(R(0, 0) + [-8, 13], '0', 'g', ancre='end')
    S.texte(R(z, 0) + [-8, 17], 'π/2', 'r', ancre='end')
    S.texte(R(1, 0) + [0, 16], '1', 'g')
    S.ligne(R(1, 0) + [0, -3], R(1, 0) + [0, 3], 'g')
    S.texte(R(2, 0) + [0, -14], '2', 'g')
    S.texte(R(0.62, _cos_serie(0.62)) + [12, -10], 'cos', 'r', ancre='start', roman=True)
    S.ligne(R(0.1, -0.52), R(0.3, -0.52), 'b', d=True)
    S.texte(R(0.3, -0.52) + [8, 0], '1 − x^2/2 + x^4/24', 'b', ancre='start', taille=15)
    S.texte(R(2, c2) + [-10, 6], 'cos 2', 'r', ancre='end', taille=15, roman=True)
    return S


@schema('cx-pi-2')
def cx_pi_2():
    # les quatre arcs i^m exp(ir), 0 <= r < π/2, et les signes qu'examine la preuve de (ii)
    rs = np.linspace(0, np.pi / 2, 2001)[:-1]
    e = np.exp(1j * rs)
    assert np.all(e.real > 0) and np.all(e.imag >= 0)                 # cos r > 0, sin r ⩾ 0
    assert np.all((1j * e).real <= 0)                                 # m = 1 : partie réelle ⩽ 0
    assert np.all((-e).real < 0)                                      # m = 2 : partie réelle < 0
    assert np.all((-1j * e).imag < 0)                                 # m = 3 : partie imaginaire < 0
    assert np.isclose(e[0], 1) and abs(e[-1] - 1j) < 1e-3             # arc rouge : de 1 (inclus) vers i
    assert abs(-1j * e[-1] - 1) < 1e-3 and np.all(-1j * e != 1)       # arc m = 3 : s'approche de 1
    k = 128
    O = np.array([250.0, 172.0])
    P = lambda z: O + k * np.array([z.real, -z.imag])
    S = Schema(500, 344, 'Les quatre arcs i^m exp(ir) du cercle unité')
    S.fleche(P(-1.42 + 0j), P(1.48 + 0j), 'g')
    S.fleche(P(-1.3j), P(1.3j), 'g')
    cols = ['r', 'b', 'b', 'b']
    for m in range(4):
        arcpts = [P(1j ** m * np.exp(1j * r)) for r in np.linspace(0, np.pi / 2, 90)]
        S.poly(arcpts[:-1], cols[m], l=3.2 if m == 0 else 1.8)
    for m in range(4):
        S.point(P(1j ** m), cols[m], r=4.4)
    for m, (lab, dd, an) in enumerate([('1', [8, 14], 'start'), ('i', [10, -12], 'start'),
                                       ('−1', [-8, 14], 'end'), ('−i', [-10, 12], 'end')]):
        S.texte(P(1j ** m) + dd, lab, cols[m], ancre=an)
    r0 = 0.62
    w0 = np.exp(1j * r0)
    S.ligne(O, P(w0), 'g')
    S.point(P(w0), 'r', r=3.6)
    S.texte(P(w0) + [10, -8], '`exp`(ir)', 'r', ancre='start', taille=16)
    for m in range(4):
        p = P(1.27 * 1j ** m * np.exp(1j * (np.pi / 4)))
        S.texte(p, f'm = {m}', cols[m], taille=15)
    S.texte(O + [8, 14], '0', 'g', ancre='start')
    return S


@schema('cx-integrale-chemin')
def cx_integrale_chemin():
    r = 1.0
    c = 0j
    gam = lambda t: c + r * np.exp(1j * t)
    ts = [0.5, 2.35, 4.25]
    h = 1e-6
    for t in ts:
        der = (gam(t + h) - gam(t - h)) / (2 * h)                    # vitesse, par différence finie
        assert abs(der - 1j * (gam(t) - c)) < 1e-8                   # γ′ = i (γ − c)
        assert np.isclose(abs(der), r)
    k = 110
    O = np.array([250.0, 172.0])
    P = lambda z: O + k * np.array([z.real, -z.imag])
    pts = [P(gam(t)) for t in ts] + [P(gam(t) + 1j * (gam(t) - c)) for t in ts]
    xs, ys = [p[0] for p in pts], [p[1] for p in pts]
    assert min(xs) > 25 and max(xs) < 495 and min(ys) > 15 and max(ys) < 335
    S = Schema(520, 345, 'Rayon et vitesse sur le cercle C(c, r)')
    S.cercle(O, k * r, 't')
    S.point(O, 't')
    S.texte(O + [12, 10], 'c', ancre='start')
    for j, t in enumerate(ts):
        g = gam(t)
        v = 1j * (g - c)
        S.fleche(O, P(g), 'b', retrait=4)
        S.fleche(P(g), P(g + v), 'r', l=1.8)
        u1 = np.array([(c - g).real, -(c - g).imag]) / abs(g - c)   # vers le centre (image)
        u2 = np.array([v.real, -v.imag]) / abs(v)
        q0 = P(g)
        S.poly([q0 + 11 * u1, q0 + 11 * u1 + 11 * u2, q0 + 11 * u2], 'g')
        S.point(P(g), 't', r=3.4)
    g, v = gam(ts[0]), 1j * gam(ts[0])
    S.texte(P(g) + [12, 12], 'γ(t)', ancre='start')
    S.texte(P(g + 0.62 * v) + [12, 0], 'γ^{′}(t)', 'r', ancre='start')
    S.texte(P(0.5 * gam(ts[2])) + [12, 6], 'γ(t) − c', 'b', ancre='start', taille=15)
    S.texte(P(r * np.exp(1j * 5.4)) + [14, 12], 'C(c, r)', ancre='start', taille=15)
    return S


@schema('cx-zeros-isoles')
def cx_zeros_isoles():
    fz = lambda z: np.exp(2j * np.pi / z) - 1
    assert np.isclose(fz(2.0 + 0j), -2)                               # f n'est pas nulle
    K = 14
    zeros = [1 / n for n in range(1, K + 1)] + [-1 / n for n in range(1, K + 1)]
    for a in zeros:
        assert abs(fz(complex(a))) < 1e-9
    # disques isolants : rayon moitié de la distance au zéro voisin ; f ne s'y annule qu'au centre
    rng = np.random.default_rng(0)
    disques = []
    for n in (1, 2, 3):
        rho = 1 / (2 * n * (n + 1))
        for a in (1 / n, -1 / n):
            ang = rng.uniform(0, 2 * np.pi, 4000)
            rad = rho * np.sqrt(rng.uniform(0, 1, 4000))
            z = a + rad * np.exp(1j * ang)
            z = z[rad > 1e-9]
            # |f(z)| / |z - a| reste minoré (au premier ordre 2π n² |z − a|) : pas d'autre zéro
            assert np.min(np.abs(fz(z)) / np.abs(z - a)) > 1.0
            disques.append((a, rho))
    # entre deux zéros consécutifs du segment réel ]0, 1], f ne s'annule pas
    for n in range(1, K):
        x = np.linspace(1 / (n + 1), 1 / n, 2003)[1:-1]
        assert np.min(np.abs(fz(x + 0j))) > 1e-6
    k = 200
    O = np.array([260.0, 132.0])
    P = lambda x, y=0.0: O + k * np.array([x, -y])
    S = Schema(520, 250, 'Zéros de exp(2iπ/z) − 1 sur ℂ privé de 0')
    S.fleche(P(-1.17), P(1.17), 'g')
    S.fleche(P(0, -0.5), P(0, 0.55), 'g')
    for a, rho in disques:
        S.cercle(P(a), k * rho, 'b', d=True, rempli='b')
    for a in zeros:
        if k * min(abs(a - b) for b in zeros if b != a) > 1.8:
            S.point(P(a), 'r', r=3.2 if abs(a) > 0.2 else 2.0)
    S.point(P(0), 'g', r=4.2, creux=True)
    for n in (1, 2, 3):
        dy = {1: 26, 2: 26, 3: -24}[n]
        S.texte(P(1 / n) + [0, dy], '1' if n == 1 else f'1/{n}', 'r', taille=15)
        S.texte(P(-1 / n) + [0, dy], '−1' if n == 1 else f'−1/{n}', 'r', taille=15)
    S.texte(P(0) + [8, 26], '0 ∉ U', ancre='start', taille=16)
    S.texte((40, 222), 'U = ℂ ∖ {0}', ancre='start', taille=16)
    return S


# ---------------------------------------------------------------------------------------------------
# anc-residus (chapitre « Théorème des résidus »)
# ---------------------------------------------------------------------------------------------------

def _indice(g, dg, t, w):
    """Indice numérique (1/2iπ) ∫ γ′/(γ − w) par la méthode des trapèzes (γ échantillonné sur t)."""
    return np.trapezoid(dg / (g - w), t) / (2j * np.pi)


def _enroulement(w):
    """Nombre de tours autour de 0 d'une courbe fermée échantillonnée (argument déroulé)."""
    a = np.unwrap(np.angle(w))
    return (a[-1] - a[0]) / (2 * np.pi)


def _pointes_courbe(S, pts, indices, c='t'):
    """Pointes de flèche posées sur une courbe échantillonnée (coordonnées image), aux indices donnés."""
    for i in indices:
        S.pointe(pts[i + 1] + 0.0, pts[i + 2] - pts[i], c, taille=8, largeur=3.5)


def _anneau(S, O, r_int, r_ext, c):
    """Couronne remplie (règle pair-impair), coordonnées image."""
    def cerc(r):
        x0, x1, y = f'{O[0] + r:.2f}', f'{O[0] - r:.2f}', f'{O[1]:.2f}'
        return f'M {x0} {y} A {r:.2f} {r:.2f} 0 1 0 {x1} {y} A {r:.2f} {r:.2f} 0 1 0 {x0} {y} Z '
    S.brut(f'<path class="f-{c}" fill-rule="evenodd" d="{cerc(r_ext)}{cerc(r_int)}"/>')


@schema('rs-indice')
def rs_indice():
    t = np.linspace(0, 2 * np.pi, 6001)
    g = (0.5 + np.cos(t)) * np.exp(1j * t)
    dg = (-np.sin(t) + 1j * (0.5 + np.cos(t))) * np.exp(1j * t)      # dérivée exacte
    points = [(0.25, 'r', 2), (1.0, 'b', 1), (-0.45, 'g', 0)]
    for w, _, n in points:
        assert abs(_indice(g, dg, t, w) - n) < 1e-6
        assert np.min(np.abs(g - w)) > 0.15                        # le point est loin de l'image
    k = 165
    O = np.array([125.0, 165.0])
    P = lambda z: O + k * np.array([np.real(z), -np.imag(z)])
    pts = np.array([P(z) for z in g])
    assert pts[:, 0].min() > 20 and pts[:, 0].max() < 380 and pts[:, 1].min() > 10 and pts[:, 1].max() < 320
    S = Schema(500, 330, 'Le limaçon (1/2 + cos t) exp(it) et ses indices 2, 1, 0')
    S.fleche(P(-0.7), P(1.68), 'g')
    S.fleche(P(-1.05j), P(1.08j), 'g')
    S.poly(pts, 't', l=1.8)
    n = len(t) - 1
    _pointes_courbe(S, pts, [int(n * s) for s in (0.12, 0.30, 0.5, 0.70, 0.88)], 't')
    for w, c, ind in points:
        S.point(P(w), c, r=4.2)
    S.texte(P(0.25) + [0, 18], 'w_2', 'r', taille=15)
    S.texte(P(1.0) + [0, -16], 'w_1', 'b', taille=15)
    S.texte(P(-0.45) + [0, -16], 'w_0', 'g', taille=15)
    for (x, y), s, c in [((392, 40), '`Ind`(w_2) = 2', 'r'), ((392, 72), '`Ind`(w_1) = 1', 'b'),
                         ((392, 104), '`Ind`(w_0) = 0', 'g')]:
        S.texte((x, y), s, c, ancre='start', taille=15)
    S.texte(P(-0.12 + 0.56j), 'γ^{*}', ancre='end')
    return S


@schema('rs-couronne')
def rs_couronne():
    r1, rho1, rho2, r2, N = 1.0, 1.2, 2.2, 2.6, 8
    assert rho1 * np.cos(np.pi / N) > r1
    th0, th1 = 0.0, 2 * np.pi / N
    phi = (th0 + th1) / 2
    re_k = lambda w: np.real(w * np.exp(-1j * phi))
    # le secteur fermé (bord compris) est dans V_k, et V_k est dans la couronne
    rr, tt = np.meshgrid(np.linspace(rho1, rho2, 60), np.linspace(th0, th1, 60))
    sect = rr * np.exp(1j * tt)
    assert np.all(np.abs(sect) < r2) and np.all(re_k(sect) > r1)
    xx, yy = np.meshgrid(np.linspace(-3, 3, 301), np.linspace(-3, 3, 301))
    ww = xx + 1j * yy
    dansV = (np.abs(ww) < r2) & (re_k(ww) > r1)
    assert np.all(np.abs(ww[dansV]) > r1)
    k = 58
    O = np.array([175.0, 172.0])
    P = lambda z: O + k * np.array([np.real(z), -np.imag(z)])
    S = Schema(440, 345, 'Couronne découpée en secteurs, chacun dans un ouvert convexe V_k')
    _anneau(S, O, k * r1, k * r2, 'g')
    S.cercle(O, k * r1, 'g')
    S.cercle(O, k * r2, 'g')
    # V_k : segment du disque de rayon r2 au-delà de la tangente au cercle r1 au point d'angle φ
    al = np.arccos(r1 / r2)
    corde = [np.exp(1j * phi) * (r1 - 1j * np.sqrt(r2 ** 2 - r1 ** 2))]
    arcV = [r2 * np.exp(1j * s) for s in np.linspace(phi - al, phi + al, 80)]
    poly = np.array([P(z) for z in corde + arcV])
    S.poly(poly, 'b', ferme=True, rempli='b')
    tg = np.exp(1j * phi) * r1
    S.point(P(tg), 'b', r=3)
    # rayons, cercles ρ1, ρ2
    for j in range(N):
        e = np.exp(2j * np.pi * j / N)
        S.ligne(P(rho1 * e), P(rho2 * e), 'g')
    S.cercle(O, k * rho1, 't')
    S.cercle(O, k * rho2, 't')
    # secteur k = 0 en rouge, bord orienté
    arc_ext = np.array([P(rho2 * np.exp(1j * s)) for s in np.linspace(th0, th1, 40)])
    arc_int = np.array([P(rho1 * np.exp(1j * s)) for s in np.linspace(th0, th1, 40)])
    S.poly(arc_ext, 'r', l=2.4)
    S.poly(arc_int, 'r', l=2.4)
    S.ligne(P(rho1), P(rho2), 'r', l=2.4)
    S.ligne(P(rho1 * np.exp(1j * th1)), P(rho2 * np.exp(1j * th1)), 'r', l=2.4)
    S.point(O, 't')
    S.texte(O + [8, 14], 'c', ancre='start')
    S.texte(P(2.8 * np.exp(2.4j)), 'A', 'g')
    S.texte(P(2.75 * np.exp(1j * 0.55)) + [6, -4], 'V_k', 'b', ancre='start')
    S.texte(P(0.62 * np.exp(1j * 3.5)), 'r_1', 'g', taille=15)
    S.ligne(O, P(r1 * np.exp(1j * 3.9)), 'g')
    S.texte(P(2.4 * np.exp(1j * 2.75)), 'ρ_2', taille=15)
    S.texte(P(rho1 * np.exp(1j * 4.3)) + [10, 14], 'ρ_1', ancre='start', taille=15)
    S.texte((360, 315), 'N = 8', ancre='start', taille=15)
    return S


@schema('rs-laurent')
def rs_laurent():
    f_ = lambda z: 1 / ((z - 1) * (z - 2))
    th = np.linspace(0, 2 * np.pi, 4001)[:-1]
    def coef(n, rho):
        w = rho * np.exp(1j * th)
        return np.mean(f_(w) * w ** (-n))
    # trois couronnes, trois développements
    for n in range(-4, 5):
        a_int = (1 - 2.0 ** (-n - 1)) if n >= 0 else 0.0
        a_mil = -2.0 ** (-n - 1) if n >= 0 else -1.0
        a_ext = 0.0 if n >= 0 else 2.0 ** (-n - 1) - 1
        assert abs(coef(n, 0.6) - a_int) < 1e-9
        assert abs(coef(n, 1.5) - a_mil) < 1e-9
        assert abs(coef(n, 3.0) - a_ext) < 1e-9
    k = 66
    O = np.array([190.0, 165.0])
    P = lambda z: O + k * np.array([np.real(z), -np.imag(z)])
    S = Schema(500, 330, 'Les trois couronnes de 1/((z − 1)(z − 2)) centrées en 0')
    _anneau(S, O, k * 1, k * 2, 'b')
    S.fleche(P(-2.6), P(3.9), 'g')
    S.fleche(P(-2.35j), P(2.4j), 'g')
    S.cercle(O, k * 1, 'g', d=True)
    S.cercle(O, k * 2, 'g', d=True)
    S.cercle(O, k * 1.5, 't')
    _cercle_oriente(S, O, k * 1.5, 't', t0=np.radians(130))
    for z, s in [(1, '1'), (2, '2')]:
        S.point(P(z), 'r', r=4.2)
        S.texte(P(z) + [8, 15], s, 'r', ancre='start')
    S.texte(O + [-8, 14], '0', ancre='end')
    S.texte(P(-0.45 + 0.42j), '|z| < 1', taille=14)
    S.ligne(P(1.75 * np.exp(1j * 2.4)), (64, 40), 'g')
    S.texte((70, 28), '1 < |z| < 2', 'b', ancre='middle', taille=14)
    S.texte((430, 52), '|z| > 2', taille=14)
    S.texte(P(1.5 * np.exp(1j * 1.15)) + [10, -6], 'C(0, 3/2)', ancre='start', taille=14)
    return S


@schema('rs-casorati')
def rs_casorati():
    w = 1 + 1j
    x0 = np.log(np.sqrt(2))
    zeta = x0 + 1j * np.pi / 4
    assert abs(np.exp(zeta) - w) < 1e-12
    ks = [k for k in range(-60, 61)]
    zk = {k: 1 / (zeta + 2j * k * np.pi) for k in ks}
    ctr, ray = 1 / (2 * x0), 1 / (2 * x0)
    for k, z in zk.items():
        assert abs(np.exp(1 / z) - w) < 1e-9                       # exp(1/z_k) = w
        assert abs(abs(z - ctr) - ray) < 1e-9                       # sur le cercle image de Re u = x0
        assert (abs(z) < 0.1) == (abs(k) >= 2)                      # dans le disque bleu ⇔ |k| ≥ 2
    k = 850
    O = np.array([170.0, 175.0])
    P = lambda z: O + k * np.array([np.real(z), -np.imag(z)])
    S = Schema(500, 350, 'Points où exp(1/z) vaut 1 + i, accumulés en 0')
    S.fleche(P(-0.17), P(0.34), 'g')
    S.cercle(O, k * 0.1, 'b', rempli='b')
    # arc du cercle porteur, dans la fenêtre
    s = np.linspace(-1, 1, 400)
    arcz = ctr + ray * np.exp(1j * (np.pi + 0.14 * s))
    S.poly(np.array([P(z) for z in arcz]), 'g', d=True)
    for kk, z in zk.items():
        p = P(z)
        if 0 < p[1] < 350 and abs(kk) >= 1:
            S.point(p, 'r', r=3.6 if abs(kk) < 4 else (2.6 if abs(kk) < 10 else 1.6))
    S.point(O, 't', r=4, creux=True)
    S.texte(O + [-10, 16], '0', ancre='end')
    for kk, dx, dy in [(1, 14, 2), (-1, 14, 2), (2, 14, 2), (-2, 14, 2)]:
        S.texte(P(zk[kk]) + [dx, dy], f'z_{{−{-kk}}}' if kk < 0 else f'z_{kk}', 'r', ancre='start', taille=14)
    S.texte(P(0.075 - 0.072j) + [8, 10], '|z| < 0,1', 'b', ancre='start', taille=14)
    return S


@schema('rs-argument')
def rs_argument():
    fz = lambda z: z ** 2 * (z - 0.5) / (z + 0.5)
    t = np.linspace(0, 2 * np.pi, 4001)
    g = np.exp(1j * t)
    img = fz(g)
    assert abs(_enroulement(img) - 2) < 1e-9
    assert np.min(np.abs(img)) > 0.3
    S = Schema(520, 290, 'Le cercle unité et son image par z²(z − 1/2)/(z + 1/2)')
    k1 = 95
    O1 = np.array([115.0, 145.0])
    P1 = lambda z: O1 + k1 * np.array([np.real(z), -np.imag(z)])
    k2 = 64
    O2 = np.array([300.0, 145.0])
    P2 = lambda z: O2 + k2 * np.array([np.real(z), -np.imag(z)])
    imgp = np.array([P2(z) for z in img])
    assert imgp[:, 0].min() > 240 and imgp[:, 0].max() < 515 and imgp[:, 1].min() > 30 and imgp[:, 1].max() < 260
    # à gauche
    S.fleche(P1(-1.15), P1(1.2), 'g')
    S.fleche(P1(-1.2j), P1(1.25j), 'g')
    S.cercle(O1, k1, 't')
    S.point(P1(0), 'r', r=4.4)
    S.texte(P1(0) + [-7, 15], '0', 'r', ancre='end', taille=14)
    S.point(P1(0.5), 'r', r=4.4)
    S.point(P1(-0.5), 'b', r=4.6, creux=True)
    S.texte(P1(0.5) + [0, -15], '1/2', 'r', taille=14)
    S.texte(P1(-0.5) + [0, -15], '−1/2', 'b', taille=14)
    S.texte(P1(np.exp(2.4j)) + [-6, -10], 'γ', ancre='end')
    # à droite
    S.fleche(P2(-1.0), P2(3.25), 'g')
    S.fleche(P2(-1.62j), P2(1.62j), 'g')
    S.poly(imgp, 't', l=1.6)
    S.point(P2(0), 'g', r=3.6)
    S.texte(P2(0) + [-8, 14], '0', 'g', ancre='end', taille=14)
    S.texte(P2(2.2 + 1.3j), 'f ∘ γ', ancre='start')
    # points correspondants numérotés
    n = len(t) - 1
    for j, s in enumerate((0.06, 0.31, 0.56, 0.81), start=1):
        i = int(n * s)
        S.pointe(np.array(P1(g[i + 1])), np.array(P1(g[i + 2])) - np.array(P1(g[i])), 't', taille=8, largeur=3.5)
        S.pointe(imgp[i + 1], imgp[i + 2] - imgp[i], 't', taille=8, largeur=3.5)
        u = np.array([np.cos(t[i]), -np.sin(t[i])])
        S.texte(np.array(P1(g[i])) + 15 * u, str(j), 'g', taille=13)
        v = imgp[i] - O2
        v = v / np.linalg.norm(v)
        S.texte(imgp[i] + 13 * v, str(j), 'g', taille=13)
    return S


@schema('rs-rouche')
def rs_rouche():
    racines = np.roots([1, 0, 0, 0, -5, 1])
    mod = np.abs(racines)
    assert np.sum(mod < 1) == 1 and np.sum((mod > 1) & (mod < 2)) == 4
    assert np.sum(np.abs(racines.imag) < 1e-12) == 3
    th = np.linspace(0, 2 * np.pi, 20001)
    e = np.exp(1j * th)
    assert np.max(np.abs(e ** 5 + 1)) <= 2 + 1e-12 and np.max(np.abs(1 - 10 * e)) <= 11 + 1e-12
    k = 72
    O = np.array([200.0, 165.0])
    P = lambda z: O + k * np.array([np.real(z), -np.imag(z)])
    S = Schema(420, 330, 'Racines de z⁵ − 5z + 1 : une dans le disque unité, quatre dans la couronne')
    _anneau(S, O, k * 1, k * 2, 'b')
    S.fleche(P(-2.45), P(2.6), 'g')
    S.fleche(P(-2.25j), P(2.3j), 'g')
    S.cercle(O, k, 't')
    S.cercle(O, 2 * k, 't')
    for z in racines:
        S.point(P(z), 'r' if abs(z) < 1 else 'b', r=4.6)
    S.texte(P(1) + [6, 14], '1', ancre='start', taille=14)
    S.texte(P(2) + [6, 14], '2', ancre='start', taille=14)
    S.texte(P(2.0 * np.exp(0.75j)) + [10, -8], '|z| = 2', ancre='start', taille=14)
    S.texte(P(np.exp(2.35j)) + [-4, -12], '|z| = 1', ancre='end', taille=14)
    return S


@schema('rs-rouche-2')
def rs_rouche_2():
    th = np.linspace(0, 2 * np.pi, 6001)
    Pz = lambda z: z ** 5 - 5 * z + 1
    z1, z2 = np.exp(1j * th), 2 * np.exp(1j * th)
    h1, h2 = Pz(z1) / (-5 * z1), Pz(z2) / z2 ** 5
    assert np.max(np.abs(h1 - 1)) <= 0.4 + 1e-12 and np.max(np.abs(h2 - 1)) <= 11 / 32 + 1e-12
    assert abs(_enroulement(h1)) < 1e-9 and abs(_enroulement(h2)) < 1e-9
    k = 150
    O = np.array([95.0, 165.0])
    P = lambda z: O + k * np.array([np.real(z), -np.imag(z)])
    S = Schema(440, 330, 'Les quotients g/f restent dans le disque D(1, 1)')
    S.fleche(P(-0.4), P(2.25), 'g')
    S.fleche(P(-1.05j), P(1.05j), 'g')
    S.cercle(P(1), k, 'g', d=True)
    S.cercle(P(1), 0.4 * k, 'r', d=True)
    S.cercle(P(1), 11 / 32 * k, 'b', d=True)
    S.poly(np.array([P(z) for z in h1]), 'r', l=1.6)
    S.poly(np.array([P(z) for z in h2]), 'b', l=1.6)
    S.point(P(0), 't', r=4)
    S.texte(P(0) + [-8, 15], '0', ancre='end', taille=14)
    S.point(P(1), 't', r=3)
    S.texte(P(1 + 1.02 * np.exp(0.8j)) + [6, -6], 'D(1, 1)', 'g', ancre='start', taille=14)
    return S


@schema('rs-demi-cercle')
def rs_demi_cercle():
    R = 2.0
    s = np.linspace(-R, R, 2001)
    u = np.linspace(0, np.pi, 3001)
    seg, arc_h = s + 0j, R * np.exp(1j * u)
    # indice de γ_R en i et en −i, par les deux morceaux
    for w, n in [(1j, 1), (-1j, 0)]:
        I = np.trapezoid(1 / (seg - w), s) + np.trapezoid(1j * arc_h / (arc_h - w), u)
        assert abs(I / (2j * np.pi) - n) < 1e-6
    arc_b = R * np.exp(1j * np.linspace(np.pi, 2 * np.pi, 400))
    assert np.max(arc_b.imag) < 1 and np.max(seg.imag) < 1              # sous la droite Im z = 1
    k = 85
    O = np.array([250.0, 205.0])
    P = lambda z: O + k * np.array([np.real(z), -np.imag(z)])
    S = Schema(500, 400, 'Le demi-cercle γ_R pour R = 2, autour du pôle i')
    S.fleche(P(-2.7), P(2.75), 'g')
    S.fleche(P(-2.25j), P(2.3j), 'g')
    S.ligne(P(-2.6 + 1j), P(2.6 + 1j), 'g', d=True)
    S.texte(P(2.6 + 1j) + [-2, -12], '`Im` z = 1', 'g', ancre='end', taille=14)
    S.poly(np.array([P(z) for z in arc_b]), 'b', d=True)
    S.ligne(P(-R), P(R), 'r', l=2.2)
    pts = np.array([P(z) for z in arc_h])
    S.poly(pts, 'r', l=2.2)
    _milieu_fleche(S, P(-R), P(0), 'r')
    _milieu_fleche(S, P(0), P(R), 'r')
    for fr in (0.25, 0.75):
        i = int(fr * (len(u) - 1))
        S.pointe(pts[i + 6], pts[i + 12] - pts[i], 'r', taille=8, largeur=3.5)
    S.point(P(1j), 'r', r=4.4)
    S.texte(P(1j) + [10, 14], 'i', 'r', ancre='start')
    S.point(P(-1j), 'g', r=4.4)
    S.texte(P(-1j) + [10, 12], '−i', 'g', ancre='start')
    S.texte(P(-R) + [-16, 16], '−R', taille=15)
    S.texte(P(R) + [14, 16], 'R', taille=15)
    S.texte(P(R * np.exp(2.25j)) + [-12, -10], 'γ_R', 'r', ancre='end')
    return S


# ---------------------------------------------------------------------------------------------------
# edo
# ---------------------------------------------------------------------------------------------------

@schema('ed-cauchy-lipschitz')
def ed_cauchy_lipschitz():
    t0, y0, a, r = 0.0, 1.0, 1.0, 1.0
    F = lambda t, y: y ** 2
    ys = np.linspace(y0 - r, y0 + r, 2001)
    M = float(np.max(F(0, ys)))
    assert M == 4.0
    h = min(a, r / M)
    assert h == 0.25
    sol = lambda t: 1 / (1 - t)
    ts = np.linspace(t0 - h, t0 + h, 2001)
    assert np.all(np.abs(sol(ts) - y0) <= M * np.abs(ts - t0) + 1e-12)           # dans le cône
    assert np.all(np.abs(sol(ts) - y0) <= r)                                     # dans le cylindre
    S = Schema(500, 330, 'Cylindre de sécurité, cône de pente M et solution sur [t0 - h, t0 + h]')
    R = Repere(-1.35, 1.45, -0.45, 2.75, 30, 12, 440, 290)
    S.fleche(R(-1.35, 0), R(1.42, 0), 'g')
    S.fleche(R(0, -0.45), R(0, 2.72), 'g')
    S.texte(R(1.42, 0) + [8, 0], 't', 'g', ancre='start')
    S.texte(R(0, 2.72) + [12, 4], 'y', 'g', ancre='start')
    S.rect(*R(t0 - a, y0 + r), *(R(t0 + a, y0 - r) - R(t0 - a, y0 + r)), 'g', rempli='g')
    S.texte(R(t0 - a, y0 + r) + [10, 16], 'C', 'g', ancre='start')
    # cône |y - y0| <= M |t - t0| limité à |t - t0| <= h : il touche le bord du cylindre en t0 ± h
    for sg in (-1, 1):
        S.surface([R(t0, y0), R(t0 + sg * h, y0 + r), R(t0 + sg * h, y0 - r)], 'b')
        S.ligne(R(t0 - sg * h, y0 - r), R(t0 + sg * h, y0 + r), 'b')
        S.ligne(R(t0 + sg * h, 0), R(t0 + sg * h, y0 + r), 'g', d=True)
    ext = np.linspace(-1.0, 0.62, 300)
    S.poly(R(ext, sol(ext)), 'g', d=True)
    S.poly(R(ts, sol(ts)), 'r', l=2.4)
    S.point(R(t0, y0), 'r', r=4)
    S.texte(R(t0, y0) + [-10, -12], '(t_0, y_0)', 'r', ancre='end', taille=15)
    S.texte(R(0.62, sol(0.62)) + [8, 0], 'y = 1/(1 − t)', 'g', ancre='start', taille=15)
    S.texte(R(t0 + h, y0 + r) + [6, -12], '`pente` M', 'b', ancre='start', taille=15)
    for t, lab in [(t0 - a, 't_0 − a'), (t0 + a, 't_0 + a')]:
        S.texte(R(t, 0) + [0, 17], lab, taille=15)
    S.texte(R(t0 - h, 0) + [-6, 17], 't_0 − h', 'b', ancre='end', taille=15)
    S.texte(R(t0 + h, 0) + [6, 17], 't_0 + h', 'b', ancre='start', taille=15)
    S.texte(R(t0 - a, y0 + r) + [-6, 0], 'y_0 + r', ancre='end', taille=15)
    S.texte(R(t0 - a, y0 - r) + [-6, -8], 'y_0 − r', ancre='end', taille=15)
    return S


@schema('ed-cauchy-lipschitz-2')
def ed_cauchy_lipschitz_2():
    # y' = 2 sqrt|y|, y(0) = 0 : y = 0, y = t², et y_tau = 0 sur [0, tau], (t - tau)² au-delà
    taus = [0.0, 0.8, 1.6, 2.4]
    sol = lambda tau, t: np.where(t <= tau, 0.0, (t - tau) ** 2)
    der = lambda tau, t: np.where(t <= tau, 0.0, 2 * (t - tau))
    ts = np.linspace(0, 3.4, 3401)
    for tau in taus:
        assert np.allclose(der(tau, ts), 2 * np.sqrt(np.abs(sol(tau, ts))))     # l'équation
        e = 1e-6                                                                # raccord C¹ en tau
        assert abs((sol(tau, tau + e) - sol(tau, tau)) / e) < 1e-5 and der(tau, tau) == 0
    S = Schema(500, 300, 'Solutions de y′ = 2 racine de |y| issues de l’origine')
    R = Repere(-0.3, 3.6, -0.5, 4.4, 40, 12, 420, 255)
    S.fleche(R(-0.3, 0), R(3.55, 0), 'g')
    S.fleche(R(0, -0.5), R(0, 4.35), 'g')
    S.texte(R(3.55, 0) + [8, 0], 't', 'g', ancre='start')
    S.texte(R(0, 4.35) + [12, 4], 'y', 'g', ancre='start')
    for tau in taus[1:]:
        tt = np.linspace(tau, min(3.5, tau + 2.0), 200)
        S.poly(R(tt, (tt - tau) ** 2), 't', l=1.4)
        S.point(R(tau, 0), 't', r=3)
    tt = np.linspace(0, 2.0, 200)
    S.poly(R(tt, tt ** 2), 'r', l=2.2)
    S.ligne(R(0, 0), R(3.5, 0), 'b', l=2.6)
    S.point(R(0, 0), 'r', r=4)
    S.texte(R(2.0, 4.0) + [-8, 0], 'y = t^2', 'r', ancre='end', taille=15)
    S.texte(R(3.1, 0) + [0, 16], 'y = 0', 'b', taille=15)
    for tau, lab in [(0.8, 'τ_1'), (1.6, 'τ_2'), (2.4, 'τ_3')]:
        S.texte(R(tau, 0) + [0, 17], lab, taille=15)
    S.texte(R(0, 0) + [-8, 14], '0', ancre='end')
    return S


@schema('ed-maximales')
def ed_maximales():
    sol = lambda t: 1 / (1 - t)
    ts = np.linspace(-1.25, 1 - 1 / 6.3, 800)
    import sympy as sp
    t = sp.symbols('t')
    assert sp.simplify(sp.diff(1 / (1 - t), t) - (1 / (1 - t)) ** 2) == 0      # y' = y², y(0) = 1
    assert np.all(np.diff(sol(ts)) > 0)       # croissante : une fois sortie de [0, R], elle n'y revient pas
    S = Schema(500, 320, 'Explosion de y = 1/(1 - t) en t = 1')
    R = Repere(-1.35, 1.5, -0.45, 6.6, 30, 10, 430, 270)
    S.fleche(R(-1.35, 0), R(1.47, 0), 'g')
    S.fleche(R(0, -0.45), R(0, 6.55), 'g')
    S.texte(R(1.47, 0) + [8, 0], 't', 'g', ancre='start')
    S.texte(R(0, 6.55) + [-12, 4], 'y', 'g', ancre='end')
    S.ligne(R(1, -0.3), R(1, 6.5), 'g', d=True)
    S.texte(R(1, 0) + [8, 17], '1', ancre='start')
    for Rv, lab in [(2, '1/2'), (5, '4/5')]:
        tR = 1 - 1 / Rv
        assert np.isclose(sol(tR), Rv)
        S.ligne(R(-1.35, Rv), R(1.45, Rv), 'b', d=True)
        S.ligne(R(tR, 0), R(tR, Rv), 'g', d=True)
        S.point(R(tR, Rv), 'b', r=3.6)
        S.texte(R(tR, 0) + [0, 17], lab, 'b', taille=14)
        S.texte(R(1.45, Rv) + [0, -11], f'R = {Rv}', 'b', ancre='end', taille=15)
    S.poly(R(ts, sol(ts)), 'r', l=2.2)
    S.point(R(0, 1), 'r', r=4)
    S.texte(R(0, 1) + [-10, -12], '(0, 1)', 'r', ancre='end', taille=15)
    S.texte(R(-0.85, sol(-0.85)) + [0, -18], 'y = 1/(1 − t)', 'r', taille=15)
    return S


@schema('ed-domaine-flot')
def ed_domaine_flot():
    # y' = y² : phi_t(x) = x / (1 - t x), défini tant que t x < 1 ; D = {t x < 1}
    import sympy as sp
    t, x = sp.symbols('t x', real=True)
    phi = x / (1 - t * x)
    assert sp.simplify(sp.diff(phi, t) - phi ** 2) == 0 and phi.subs(t, 0) == x
    p12 = phi.subs(t, sp.Rational(1, 2))
    assert sp.simplify(p12 - 2 * x / (2 - x)) == 0
    assert sp.limit(p12, x, -sp.oo) == -2 and sp.limit(p12, x, 2, '-') == sp.oo     # D_{1/2} -> ]-2, +inf[
    assert sp.simplify(sp.diff(p12, x)) == sp.simplify(4 / (2 - x) ** 2)              # strictement croissante
    assert sp.simplify(phi.subs(t, -sp.Rational(1, 2)).subs(x, p12) - x) == 0         # réciproque phi_{-1/2}
    tmin, tmax, xmin, xmax = -2.4, 2.4, -3.3, 3.3
    S = Schema(500, 340, 'Domaine du flot de y′ = y², région t x < 1')
    R = Repere(tmin, tmax, xmin, xmax, 30, 12, 440, 300)
    # région exclue t x >= 1, dans le cadre
    for sg in (1, -1):
        ts = sg * np.linspace(1 / xmax, tmax, 300)
        bord = [(tt, 1 / tt) for tt in ts]
        assert np.allclose([a * b for a, b in bord], 1)
        pts = bord + [(sg * tmax, sg * xmax), (sg / xmax, sg * xmax)]
        S.surface(R(*np.array(pts).T), 'g')
    S.fleche(R(tmin, 0), R(tmax + 0.05, 0), 'g')
    S.fleche(R(0, xmin), R(0, xmax + 0.05), 'g')
    S.texte(R(tmax, 0) + [10, 14], 't', 'g', ancre='start')
    S.texte(R(0, xmax) + [12, 6], 'x', 'g', ancre='start')
    for sg in (1, -1):
        ts = sg * np.linspace(1 / xmax, tmax, 300)
        S.poly(R(ts, 1 / ts), 'r', l=2.2)
    # tranches D_{1/2} = ]-inf, 2[ et D_{-1/2} = ]-2, +inf[
    S.ligne(R(0.5, xmin), R(0.5, 2), 'b', l=4)
    S.point(R(0.5, 2), 'b', r=4.2, creux=True)
    S.ligne(R(-0.5, -2), R(-0.5, xmax), 'v', l=4)
    S.point(R(-0.5, -2), 'v', r=4.2, creux=True)
    S.texte(R(0.5, -1.7) + [10, 0], 'D_{1/2}', 'b', ancre='start', taille=16)
    S.texte(R(-0.5, 1.7) + [-10, 0], 'D_{−1/2}', 'v', ancre='end', taille=16)
    S.texte(R(0.5, 0) + [8, 16], '1/2', 'b', ancre='start', taille=14)
    S.texte(R(-0.5, 0) + [-8, -14], '−1/2', 'v', ancre='end', taille=14)
    S.texte(R(0.5, 2) + [10, 0], '2', 'b', ancre='start', taille=14)
    S.texte(R(-0.5, -2) + [-10, 0], '−2', 'v', ancre='end', taille=14)
    S.texte(R(1.7, 1 / 1.7) + [8, 14], 't x = 1', 'r', ancre='start', taille=15)
    S.texte(R(1.5, -1.9), 'D', taille=18)
    S.texte(R(-1.5, 1.9), 'D', taille=18)
    return S


@schema('ed-variationnelle')
def ed_variationnelle():
    # X(y1, y2) = (1, y1²) : flot exact, équation variationnelle le long de la courbe issue de 0
    import sympy as sp
    t, y1, y2, s, h1, h2 = sp.symbols('t y1 y2 s h1 h2', real=True)
    P = sp.Matrix([y1 + t, y2 + ((y1 + t) ** 3 - y1 ** 3) / 3])
    assert sp.simplify(P.diff(t) - sp.Matrix([1, P[0] ** 2])) == sp.zeros(2, 1)       # c'est le flot
    assert P.subs(t, 0) == sp.Matrix([y1, y2])
    Z = sp.Matrix([[1, 0], [s ** 2, 1]])
    A = sp.Matrix([[0, 0], [2 * s, 0]])                                                # dX(phi_s(0)), phi_s(0) = (s, s³/3)
    assert P.subs({y1: 0, y2: 0, t: s}) == sp.Matrix([s, s ** 3 / 3])
    assert sp.simplify(Z.diff(s) - A * Z) == sp.zeros(2, 2) and Z.subs(s, 0) == sp.eye(2)
    assert sp.simplify(P.jacobian([y1, y2]).subs({y1: 0, y2: 0, t: s}) - Z) == sp.zeros(2, 2)
    reste = sp.simplify(P.subs({y1: h1, y2: h2, t: 1}) - P.subs({y1: 0, y2: 0, t: 1}) - Z.subs(s, 1) * sp.Matrix([h1, h2]))
    assert reste == sp.Matrix([0, h1 ** 2])
    ech = 150
    xmin, xmax, ymin, ymax = -0.75, 1.95, -0.7, 1.45
    S = Schema(500, 30 + ech * (ymax - ymin), 'Image d’un petit cercle par le flot et par sa différentielle')
    R = Repere(xmin, xmax, ymin, ymax, 40, 12, ech * (xmax - xmin), ech * (ymax - ymin))
    th = np.linspace(0, 2 * np.pi, 400)
    H = 0.5 * np.array([np.cos(th), np.sin(th)])
    exacte = np.array([H[0] + 1, H[1] + ((H[0] + 1) ** 3 - H[0] ** 3) / 3])
    lin = np.array([1 + H[0], 1 / 3 + H[0] + H[1]])
    assert np.allclose(exacte - lin, [0 * H[0], H[0] ** 2]) and np.max(H[0] ** 2) <= 0.25 + 1e-12
    assert exacte[1].max() < ymax - 0.1 and lin[1].min() > ymin and exacte[0].max() < xmax
    S.fleche(R(xmin, 0), R(xmax, 0), 'g')
    S.fleche(R(0, ymin), R(0, ymax), 'g')
    S.texte(R(xmax, 0) + [-4, 16], 'y_1', 'g', ancre='end')
    S.texte(R(0, ymax) + [10, 8], 'y_2', 'g', ancre='start')
    S.poly(R(*H), 'g', ferme=True, l=1.8)
    ss = np.linspace(0, 1, 100)
    S.courbe_fleche(R(ss, ss ** 3 / 3), 'v', l=1.8)
    S.poly(R(*lin), 'b', ferme=True, l=2)
    S.poly(R(*exacte), 'r', ferme=True, l=2.2)
    # h = (1/2, 0) : écart vertical h1² = 1/4
    pe, pl = np.array([1.5, 1 / 3 + 0.5 + 0.25]), np.array([1.5, 1 / 3 + 0.5])
    assert np.isclose(pe[1] - pl[1], 0.25)
    S.ligne(R(*pl), R(*pe), 't', d=True)
    S.point(R(*pe), 'r', r=3.6)
    S.point(R(*pl), 'b', r=3.6)
    S.texte(R(1.5, (pe[1] + pl[1]) / 2) + [10, 0], 'h_1^2', ancre='start', taille=15)
    S.point(R(0.5, 0), 'g', r=3.4)
    S.texte(R(0.5, 0) + [8, 14], 'h', 'g', ancre='start', taille=15)
    S.point(R(0, 0), 't', r=3.4)
    S.texte(R(0, 0) + [-8, 14], '0', ancre='end', taille=15)
    S.point(R(1, 1 / 3), 't', r=3.4)
    S.texte(R(1, 1 / 3) + [-8, -12], 'φ_1(0)', ancre='end', taille=15)
    return S


# ---------------------------------------------------------------------------------------------------
# edo-changement (changement de variables, chapitre du graphe edo)
# ---------------------------------------------------------------------------------------------------

@schema('cv-dyadiques')
def cv_dyadiques():
    # U = disque unité ouvert ; cubes de Q(U) des niveaux 1 à 5 (aucun cube de niveau 0 n'a son adhérence dans U)
    from fractions import Fraction as Fq
    import itertools

    def adherence_dans_U(k, m):
        s = Fq(1, 2 ** k)
        return all(x * x + y * y < 1 for x in (m[0] * s, (m[0] + 1) * s) for y in (m[1] * s, (m[1] + 1) * s))

    K = 5
    niveaux = {}
    for k in range(0, K + 1):
        N = 2 ** k
        niveaux[k] = [m for m in itertools.product(range(-N, N), repeat=2)
                      if adherence_dans_U(k, m) and (k == 0 or not adherence_dans_U(k - 1, (m[0] // 2, m[1] // 2)))]
    assert [len(niveaux[k]) for k in range(K + 1)] == [0, 4, 16, 36, 76, 152]
    # deux à deux disjoints : chaque cube de niveau 5 est dans au plus un cube retenu
    for m in itertools.product(range(-32, 32), repeat=2):
        n = sum(1 for k in range(1, K + 1) if (m[0] >> (K - k), m[1] >> (K - k)) in set(niveaux[k]))
        assert n <= 1
    aire = sum(Fq(len(niveaux[k]), 4 ** k) for k in range(1, K + 1))
    assert aire == Fq(385, 128)          # 3,0078125, contre π pour le disque
    ech = 150
    S = Schema(500, 2 * ech + 30, 'Décomposition du disque unité ouvert en cubes dyadiques maximaux')
    R = Repere(-1.05, 1.05, -1.05, 1.05, 250 - 1.05 * ech, 15, 2.1 * ech, 2.1 * ech)
    th = np.linspace(0, 2 * np.pi, 400)
    S.poly(R(np.cos(th), np.sin(th)), 'g', ferme=True, rempli='g')
    couleurs = {1: 'r', 2: 'b', 3: 'v', 4: 'r', 5: 'b'}
    for k in range(1, K + 1):
        s = 1 / 2 ** k
        for m in niveaux[k]:
            p = R(m[0] * s, (m[1] + 1) * s)
            S.rect(p[0], p[1], s * ech, s * ech, 't', rempli=couleurs[k])
    S.poly(R(np.cos(th), np.sin(th)), 't', ferme=True, d=True)
    S.texte(R(0.25, 0.25), '1', taille=16)
    S.texte(R(0.625, 0.125), '2', taille=15)
    S.texte(R(0.78, 0.78) + [16, -14], 'U', taille=17)
    return S


@schema('cv-lineaire')
def cv_lineaire():
    # transvection T(x) = (x_1, x_2 + s x_1), s = 1/2 : les sections verticales de T(]0,1]²) sont de longueur 1
    import sympy as sp
    s = sp.Rational(1, 2)
    T = sp.Matrix([[1, 0], [s, 1]])
    assert T.det() == 1
    x1, y = sp.symbols('x1 y', real=True)
    # (x1, y) ∈ T(Q) ⟺ 0 < x1 ≤ 1 et 0 < y − s x1 ≤ 1 : section ]s x1, s x1 + 1]
    aire = sp.integrate(sp.integrate(1, (y, s * x1, s * x1 + 1)), (x1, 0, 1))
    assert aire == 1
    ech = 170
    S = Schema(500, 316, 'Image du carré unité par une transvection : sections verticales de longueur 1')
    R = Repere(-0.25, 1.45, -0.2, 1.62, 100, 30, 1.7 * ech, 1.82 * ech * 0.85)
    R.axes(S, 'x_1', 'x_2')
    carre = np.array([[0, 0], [1, 0], [1, 1], [0, 1]], float)
    im = carre @ np.array(T, dtype=float).T
    assert np.allclose(im, [[0, 0], [1, 0.5], [1, 1.5], [0, 1]])
    S.poly(R(*carre.T), 'g', ferme=True, rempli='g')
    S.poly(R(*im.T), 'b', ferme=True, rempli='b', l=2)
    for a in (0.25, 0.5, 0.75):
        bas, haut = float(s) * a, float(s) * a + 1
        assert np.isclose(haut - bas, 1)
        S.ligne(R(a, bas), R(a, haut), 'r', l=2.6)
        S.point(R(a, haut), 'r', r=3.4)
        S.point(R(a, bas), 'r', r=3.4, creux=True)
    S.texte(R(0.5, 1.25) + [0, -16], 'T(Q)', 'b', taille=16)
    S.texte(R(0.12, 0.5), 'Q', 'g', taille=16)
    S.texte(R(1, 0.5) + [10, 0], '(1, 1/2)', 'b', ancre='start', taille=14)
    S.texte(R(1, 1.5) + [10, 0], '(1, 3/2)', 'b', ancre='start', taille=14)
    return S


@schema('cv-cube')
def cv_cube():
    # φ(x, y) = (x − y²/2, y + x²/3), cube C(c, r) avec c = (1/2, 1/2), r = 1/4, L = dφ(c)
    import sympy as sp
    import itertools
    x, y = sp.symbols('x y', real=True)
    F = sp.Matrix([x - y ** 2 / 2, y + x ** 2 / 3])
    D = F.jacobian([x, y])
    c = (sp.Rational(1, 2), sp.Rational(1, 2))
    r = sp.Rational(1, 4)
    Lm = D.subs({x: c[0], y: c[1]})
    assert Lm == sp.Matrix([[1, -sp.Rational(1, 2)], [sp.Rational(1, 3), 1]]) and Lm.det() == sp.Rational(7, 6)
    M = Lm.inv() * D - sp.eye(2)
    # les coefficients de M sont affines en (x, y) : chaque somme de lignes |.| est convexe, son maximum
    # sur le carré est atteint en un sommet ; η est donc calculé exactement
    eta = max(max(sum(abs(M.subs({x: c[0] + a * r, y: c[1] + b * r})[i, j]) for j in range(2)) for i in range(2))
              for a, b in itertools.product((-1, 1), repeat=2))
    assert eta == sp.Rational(2, 7)
    phi = sp.lambdify((x, y), F, 'numpy')
    L = np.array(Lm, dtype=float)
    Li = np.linalg.inv(L)
    cf, rf, ef = 0.5, 0.25, float(eta)
    pc = np.array(phi(cf, cf), dtype=float).ravel()
    # bord du carré, parcouru
    t = np.linspace(0, 1, 200)
    cotes = [np.array([cf - rf + 2 * rf * t, cf - rf + 0 * t]), np.array([cf + rf + 0 * t, cf - rf + 2 * rf * t]),
             np.array([cf + rf - 2 * rf * t, cf + rf + 0 * t]), np.array([cf - rf + 0 * t, cf + rf - 2 * rf * t])]
    bord = np.hstack(cotes)
    img = np.array(phi(bord[0], bord[1]), dtype=float).reshape(2, -1)
    # ce que la figure affirme : (1 − η) r ≤ ‖L⁻¹(φ(x) − φ(c))‖∞ ≤ (1 + η) r sur le bord du carré
    nrm = np.max(np.abs(Li @ (img - pc[:, None])), axis=0)
    assert nrm.max() <= (1 + ef) * rf + 1e-12 and nrm.min() >= (1 - ef) * rf - 1e-12

    def para(k):
        sq = np.array([[-1, -1], [1, -1], [1, 1], [-1, 1]], float) * k * rf
        return (sq @ L.T) + pc

    ech = 300
    S = Schema(520, 290, 'Image d’un petit cube et parallélogrammes dφ(c)(C), agrandi et réduit')
    # panneau de gauche : le carré
    RG = Repere(0.15, 0.85, 0.15, 0.85, 14, 40, 0.7 * ech * 0.8, 0.7 * ech * 0.8)
    sq = np.array([[cf - rf, cf - rf], [cf + rf, cf - rf], [cf + rf, cf + rf], [cf - rf, cf + rf]])
    S.poly(RG(*sq.T), 't', ferme=True, rempli='g', l=1.8)
    S.point(RG(cf, cf), 't', r=3.4)
    S.texte(RG(cf, cf) + [0, 16], 'c', taille=16)
    S.texte(RG(cf, cf + rf) + [0, -14], 'C(c, r)', taille=15)
    # flèche φ
    S.fleche([196, 145], [250, 145], 't')
    S.texte([223, 130], 'φ', taille=17)
    # panneau de droite : les images
    tous = np.hstack([para(1 + ef).T, img])
    xmin, xmax = tous[0].min() - 0.03, tous[0].max() + 0.03
    ymin, ymax = tous[1].min() - 0.03, tous[1].max() + 0.03
    sc = min(250 / (ymax - ymin), 250 / (xmax - xmin))
    RD = Repere(xmin, xmax, ymin, ymax, 262, 20 + (250 - sc * (ymax - ymin)) / 2, sc * (xmax - xmin), sc * (ymax - ymin))
    assert 262 + sc * (xmax - xmin) < 516
    S.poly(RD(*para(1 + ef).T), 'b', ferme=True, d=True)
    S.poly(RD(*para(1 - ef).T), 'v', ferme=True, d=True, l=1.8)
    S.poly(RD(*img), 'r', ferme=True, rempli='r', l=2.2)
    S.poly(RD(*para(1).T), 'b', ferme=True, l=1.8)
    S.point(RD(*pc), 't', r=3.4)
    S.texte(RD(*pc) + [0, 16], 'φ(c)', taille=15)
    S.texte(RD(*para(1 + ef)[2]) + [6, -4], '1 + η', 'b', ancre='start', taille=14)
    S.texte(RD(*(pc + 0.55 * (para(1 - ef)[3] - pc))), '1 − η', 'v', taille=14)
    return S


@schema('cv-polaires')
def cv_polaires():
    # P(r, θ) = (r cos θ, r sin θ) ; la cellule [1, 3/2] × [π/4, π/2] a pour image un secteur d'aire 5π/32
    import sympy as sp
    rr, tt = sp.symbols('r theta', positive=True)
    Pm = sp.Matrix([rr * sp.cos(tt), rr * sp.sin(tt)])
    assert sp.simplify(Pm.jacobian([rr, tt]).det()) == rr
    r0, r1, t0, t1 = 1, sp.Rational(3, 2), sp.pi / 4, sp.pi / 2
    aire_cellule = (r1 - r0) * (t1 - t0)
    aire_secteur = sp.integrate(sp.integrate(rr, (rr, r0, r1)), (tt, t0, t1))
    assert aire_cellule == sp.pi / 8 and aire_secteur == 5 * sp.pi / 32
    assert sp.simplify(aire_secteur / aire_cellule - (r0 + r1) / 2) == 0
    H = 300
    S = Schema(520, H + 50, 'Coordonnées polaires : une cellule du plan (r, θ) et son image')
    RG = Repere(0, 2.25, -np.pi, np.pi, 34, 36, 128, H)
    sc = H / 4.6
    RD = Repere(-2.3, 2.3, -2.3, 2.3, 210, 36, 4.6 * sc, H)
    # gauche : bande U, grille
    for k in range(-3, 4):
        S.ligne(RG(0, k * np.pi / 4), RG(2.1, k * np.pi / 4), 'g')
    for rv in (0.5, 1, 1.5, 2):
        S.ligne(RG(rv, -np.pi), RG(rv, np.pi), 'g')
    S.ligne(RG(0, -np.pi), RG(2.1, -np.pi), 'g', d=True)
    S.ligne(RG(0, np.pi), RG(2.1, np.pi), 'g', d=True)
    S.fleche(RG(0, -np.pi - 0.05), RG(0, np.pi + 0.35), 'g')
    S.fleche(RG(0, 0), RG(2.25, 0), 'g')
    S.texte(RG(2.25, 0) + [-2, 14], 'r', 'g', ancre='end')
    S.texte(RG(0, np.pi + 0.35) + [10, 2], 'θ', 'g', ancre='start')
    S.texte(RG(0, np.pi) + [-6, 4], 'π', 'g', ancre='end', taille=14)
    S.texte(RG(0, -np.pi) + [-6, 0], '−π', 'g', ancre='end', taille=14)
    cell = np.array([[1, np.pi / 4], [1.5, np.pi / 4], [1.5, np.pi / 2], [1, np.pi / 2]])
    S.poly(RG(*cell.T), 'r', ferme=True, rempli='r', l=2)
    # droite : cercles et rayons, demi-droite exclue D
    th = np.linspace(-np.pi, np.pi, 300)
    for rv in (0.5, 1, 1.5, 2):
        S.poly(RD(rv * np.cos(th), rv * np.sin(th)), 'g')
    for k in range(-3, 4):
        S.ligne(RD(0, 0), RD(2 * np.cos(k * np.pi / 4), 2 * np.sin(k * np.pi / 4)), 'g')
    S.ligne(RD(-2.3, 0), RD(0, 0), 't', d=True, l=2.2)
    S.point(RD(0, 0), 't', r=3.6, creux=True)
    S.texte(RD(-1.55, 0) + [0, 15], 'D', taille=16)
    ts = np.linspace(np.pi / 4, np.pi / 2, 60)
    sect = np.vstack([np.array([1.5 * np.cos(ts), 1.5 * np.sin(ts)]).T,
                      np.array([np.cos(ts[::-1]), np.sin(ts[::-1])]).T])
    S.poly(RD(*sect.T), 'r', ferme=True, rempli='r', l=2)
    S.fleche([168, 174], [200, 174], 't')
    S.texte([184, 158], 'P', taille=16)
    return S


@schema('cv-liouville')
def cv_liouville():
    # X(y) = (1, y_1²), de divergence nulle ; flot φ_t(y) = (y_1 + t, y_2 + ((y_1 + t)³ − y_1³)/3)
    import sympy as sp
    t, y1, y2, a = sp.symbols('t y1 y2 a', real=True)
    P = sp.Matrix([y1 + t, y2 + ((y1 + t) ** 3 - y1 ** 3) / 3])
    assert sp.simplify(P.diff(t) - sp.Matrix([1, P[0] ** 2])) == sp.zeros(2, 1)
    assert sp.diff(1, y1) + sp.diff(y1 ** 2, y2) == 0
    assert sp.simplify(P.jacobian([y1, y2]).det()) == 1
    # aire exacte de φ_t(disque de rayon 1/2) par la formule de Green appliquée au bord paramétré
    for tv in (sp.Rational(1, 2), 1):
        X = sp.cos(a) / 2 + tv
        Y = sp.sin(a) / 2 + ((sp.cos(a) / 2 + tv) ** 3 - (sp.cos(a) / 2) ** 3) / 3
        aire = sp.integrate(sp.expand(X * sp.diff(Y, a) - Y * sp.diff(X, a)) / 2, (a, 0, 2 * sp.pi))
        assert sp.simplify(aire - sp.pi / 4) == 0
    ech = 150
    xmin, xmax, ymin, ymax = -0.75, 1.75, -0.65, 1.3
    S = Schema(500, 24 + ech * (ymax - ymin), 'Un disque emporté par un flot de divergence nulle garde son aire')
    R = Repere(xmin, xmax, ymin, ymax, 70, 12, ech * (xmax - xmin), ech * (ymax - ymin))
    S.fleche(R(xmin, 0), R(xmax, 0), 'g')
    S.fleche(R(0, ymin), R(0, ymax), 'g')
    S.texte(R(xmax, 0) + [-4, 16], 'y_1', 'g', ancre='end')
    S.texte(R(0, ymax) + [10, 8], 'y_2', 'g', ancre='start')
    th = np.linspace(0, 2 * np.pi, 400)
    Hc = 0.5 * np.array([np.cos(th), np.sin(th)])
    for tv, cl in ((0, 'g'), (0.5, 'b'), (1, 'r')):
        im = np.array([Hc[0] + tv, Hc[1] + ((Hc[0] + tv) ** 3 - Hc[0] ** 3) / 3])
        assert im[0].max() < xmax and im[1].max() < ymax - 0.05 and im[1].min() > ymin
        # aire par la formule du lacet polygonal (contrôle numérique de la valeur exacte π/4)
        ap = 0.5 * np.sum(im[0][:-1] * im[1][1:] - im[0][1:] * im[1][:-1])
        assert abs(ap - np.pi / 4) < 1e-3
        S.poly(R(*im), cl, ferme=True, rempli=cl, l=2)
    ss = np.linspace(0, 1, 100)
    S.courbe_fleche(R(ss, ss ** 3 / 3), 'v', l=1.8)
    S.texte(R(-0.36, 0.36) + [-6, -6], 'Δ', 'g', ancre='end', taille=16)
    S.texte(R(0.5 - 0.42, 0.5 / 3 + 0.5) + [-6, -4], 'φ_{1/2}(Δ)', 'b', ancre='end', taille=15)
    S.texte(R(1.5, 1.08) + [8, 0], 'φ_1(Δ)', 'r', ancre='start', taille=15)
    return S


@schema('ed-peano')
def ed_peano():
    # y' = 1 - y², (t0, y0) = (0, 0), a = r = 1 : M = 1, h = 1 ; solution th t = (1 - e^{-2t})/(1 + e^{-2t})
    F = lambda t, y: 1 - y ** 2
    t0, y0, a, r = 0.0, 0.0, 1.0, 1.0
    yy = np.linspace(-1, 1, 2001)
    M = float(np.max(np.abs(F(0, yy))))
    assert M == 1.0
    h = min(a, r / M)
    assert h == 1.0
    sol = lambda t: (1 - np.exp(-2 * t)) / (1 + np.exp(-2 * t))
    ts = np.linspace(-h, h, 2001)
    assert np.allclose(np.gradient(sol(ts), ts)[5:-5], F(ts, sol(ts))[5:-5], atol=1e-5)

    def euler(N):
        noeuds = [t0 + k * h / N for k in range(-N, N + 1)]
        val = {0: y0}
        for k in range(N):                          # vers la droite
            val[k + 1] = val[k] + (h / N) * F(noeuds[N + k], val[k])
        for k in range(0, -N, -1):                  # vers la gauche
            val[k - 1] = val[k] - (h / N) * F(noeuds[N + k], val[k])
        return np.array(noeuds), np.array([val[k] for k in range(-N, N + 1)])

    S = Schema(500, 330, 'Polygones d’Euler dans le cône de pente M')
    R = Repere(-1.15, 1.25, -1.15, 1.15, 30, 12, 430, 300)
    S.fleche(R(-1.15, 0), R(1.22, 0), 'g')
    S.fleche(R(0, -1.15), R(0, 1.13), 'g')
    S.texte(R(1.22, 0) + [8, 0], 't', 'g', ancre='start')
    S.texte(R(0, 1.13) + [12, 4], 'y', 'g', ancre='start')
    S.rect(*R(t0 - a, y0 + r), *(R(t0 + a, y0 - r) - R(t0 - a, y0 + r)), 'g', rempli='g')
    S.texte(R(t0 - a, y0 + r) + [10, 16], 'C', 'g', ancre='start')
    for sg in (-1, 1):
        S.ligne(R(t0, y0), R(t0 + sg * h, y0 + M * h), 'g', d=True)
        S.ligne(R(t0, y0), R(t0 + sg * h, y0 - M * h), 'g', d=True)
    for N, c in [(2, 'b'), (4, 'v'), (16, 't')]:
        tk, yk = euler(N)
        assert np.all(np.abs(yk - y0) <= M * np.abs(tk - t0) + 1e-12)          # dans le cône
        assert np.all(np.abs(np.diff(yk)) <= M * h / N + 1e-12)                # M-lipschitzien
        S.poly(R(tk, yk), c, l=1.8, d=(N == 16))
        for p in zip(tk, yk):
            if N < 16:
                S.point(R(*p), c, r=2.6)
    e2 = np.abs(euler(2)[1] - sol(euler(2)[0])).max()
    e16 = np.abs(euler(16)[1] - sol(euler(16)[0])).max()
    assert e16 < e2 / 4                                                         # ils se rapprochent
    S.poly(R(ts, sol(ts)), 'r', l=2.4)
    S.point(R(t0, y0), 'r', r=4)
    t2, y2 = euler(2)
    S.texte(R(t2[-1], y2[-1]) + [8, -4], 'y_2', 'b', ancre='start', taille=14)
    S.texte(R(1, sol(1.0)) + [8, 8], 'y', 'r', ancre='start', taille=15)
    S.texte(R(t0 + h, 0) + [6, 17], 't_0 + h', 'g', ancre='start', taille=14)
    S.texte(R(t0 - h, 0) + [-6, 17], 't_0 − h', 'g', ancre='end', taille=14)
    S.texte(R(0.55, 0.55) + [-6, -10], '`pente` M', 'g', ancre='end', taille=14)
    return S
