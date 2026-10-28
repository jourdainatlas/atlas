"""Schémas du graphe met (espaces métriques et normés).

Contrainte d'ordre : ni l'exponentielle, ni la trigonométrie, ni ℂ ne sont des ancêtres de met. Le
cercle de la distance d₂ est tracé avec numpy (dessin seulement) ; tout point marqué ou étiqueté a des
coordonnées rationnelles, et aucune étiquette n'emploie cos, sin ni π.
"""
from fractions import Fraction as Fr
import math
import numpy as np
import sympy as sp
from edifice_schemas import schema
from edifice_svg import Schema, Repere


# ------------------------------------------------------------------ me-espace
@schema('me-espace')
def me_espace():
    # x = (0, 0), y = (4, 3) : d_∞ = 4, d_2 = 5, d_1 = 7 ; y est sur les trois « sphères » de centre x.
    x, y = (0, 0), (4, 3)
    dinf = max(abs(y[0] - x[0]), abs(y[1] - x[1]))
    d1 = abs(y[0] - x[0]) + abs(y[1] - x[1])
    d2 = sp.sqrt((y[0] - x[0]) ** 2 + (y[1] - x[1]) ** 2)
    assert (dinf, d2, d1) == (4, 5, 7) and dinf <= d2 <= d1 <= 2 * dinf
    # les trois sphères ne s'emboîtent pas : le coin (4, 4) du carré est hors du disque de rayon 5,
    # et le sommet (7, 0) du losange hors du carré ; elles ont en commun le point y.
    assert 4 ** 2 + 4 ** 2 > 25 and 7 > 4
    # étiquettes du coin supérieur gauche : hors du losange et du disque
    for (u, v) in [(-7.2, 7.0), (-4.4, 7.0), (-7.2, 5.4), (-4.4, 5.4)]:
        assert abs(u) + abs(v) > 7 and u * u + v * v > 25
    S = Schema(500, 420, 'Trois distances du plan entre x = (0, 0) et y = (4, 3)')
    R = Repere(-7.6, 7.6, -7.4, 7.4, 30, 18, 400, 390)
    R.axes(S, '', '')
    los = [(7, 0), (0, 7), (-7, 0), (0, -7)]
    car = [(4, 4), (-4, 4), (-4, -4), (4, -4)]
    S.poly(R(*np.array(los, float).T), 'v', ferme=True, l=2)
    S.poly(R(*np.array(car, float).T), 'b', ferme=True, l=2)
    t = np.linspace(0, 2 * math.pi, 361)
    S.poly(R(5 * np.cos(t), 5 * np.sin(t)), 'r', ferme=True, l=2)
    # chemins de x à y : segment (d_2), chemin suivant les axes (d_1), plus long côté (d_∞)
    S.ligne(R(0, 0), R(4, 0), 'v', l=3.4)
    S.ligne(R(4, 0), R(4, 3), 'v', l=3.4)
    S.ligne(R(0, 0), R(4, 3), 'r', l=3.4)
    S.point(R(0, 0), 't', r=4.4)
    S.point(R(4, 3), 't', r=4.8)
    S.texte(R(0, 0) + [-9, 15], 'x', ancre='end', taille=17)
    S.texte(R(4, 3) + [11, -13], 'y', ancre='start', taille=17)
    S.texte(R(2, 0) + [0, 15], '4', 'v', taille=15)
    S.texte(R(4, 1.5) + [9, 0], '3', 'v', ancre='start', taille=15)
    S.texte(R(2, 1.5) + [-8, -10], '5', 'r', ancre='end', taille=15)
    # légende des trois sphères, dans le coin libre
    S.texte(R(-7.3, 7.0), 'd_∞(x, y) = 4', 'b', ancre='start', taille=16)
    S.texte(R(-7.3, 6.2), 'd_2(x, y) = 5', 'r', ancre='start', taille=16)
    S.texte(R(-7.3, 5.4), 'd_1(x, y) = 7', 'v', ancre='start', taille=16)
    return S


# ------------------------------------------------------------------ me-cauchy
@schema('me-cauchy')
def me_cauchy():
    x = [Fr(1)]
    for _ in range(7):
        x.append(1 + 1 / (1 + x[-1]))
    assert x[:5] == [1, Fr(3, 2), Fr(7, 5), Fr(17, 12), Fr(41, 29)]
    s2 = sp.sqrt(2)
    for n in range(len(x) - 1):
        lo, hi = sorted([x[n], x[n + 1]])
        assert all(lo <= y <= hi for y in x[n:]) and lo < s2 < hi      # critère de Cauchy, encadrement
    assert abs(x[3] - x[2]) == Fr(1, 60)
    a, b = 1.396, 1.4205                         # cadre agrandi
    assert a < x[2] and x[3] < b and all(a < y < b for y in x[2:])
    S = Schema(520, 290, 'Suite de Cauchy de rationnels sans limite rationnelle')
    # droite du haut
    H = Repere(0.92, 1.58, 0, 1, 30, 0, 460, 1)
    yh = 62
    S.ligne((H(0.92, 0)[0], yh), (H(1.58, 0)[0], yh), 'g')
    S.rect(H(a, 0)[0], yh - 13, H(b, 0)[0] - H(a, 0)[0], 26, 'g')
    for k, v in enumerate(x[:3]):
        X = H(float(v), 0)[0]
        S.point((X, yh), 't', r=4)
        S.texte((X + (14 if k == 2 else 0), yh - 26), f'x_{k}', taille=16)
    for v, lab in ((1, '1'), (1.5, '3/2')):
        S.texte((H(v, 0)[0], yh + 24), lab, 'g', taille=14)
    # droite du bas : agrandissement du cadre
    B = Repere(a, b, 0, 1, 30, 0, 460, 1)
    yb = 196
    S.ligne((H(a, 0)[0], yh + 13), (B(a, 0)[0], yb - 52), 'g', d=True)
    S.ligne((H(b, 0)[0], yh + 13), (B(b, 0)[0], yb - 52), 'g', d=True)
    S.rect(B(a, 0)[0], yb - 52, B(b, 0)[0] - B(a, 0)[0], 104, 'g', d=True)
    S.ligne((B(a, 0)[0], yb), (B(b, 0)[0], yb), 'g')
    S.ligne((B(float(x[2]), 0)[0], yb), (B(float(x[3]), 0)[0], yb), 'r', l=5)
    X2 = B(float(s2), 0)[0]
    S.point((X2, yb), 'r', r=7.5, creux=True)
    assert all(abs(B(float(x[k]), 0)[0] - X2) < 2 for k in range(6, 8))   # x_6, x_7 dans l'anneau
    for k in range(2, 8):
        S.point((B(float(x[k]), 0)[0], yb), 't', r=3.6 if k < 6 else 2.4)
    pos = {2: (0, -24), 3: (0, -24), 4: (-4, 26), 5: (4, -24)}
    for k, (dx, dy) in pos.items():
        S.texte((B(float(x[k]), 0)[0] + dx, yb + dy), f'x_{k}', taille=15)
    S.ligne((X2 + 5, yb + 6), (X2 + 40, yb + 34), 'r', l=1)
    S.texte((X2 + 44, yb + 36), '√2', 'r', ancre='start', taille=16)
    S.texte(((B(float(x[2]), 0)[0] + B(float(x[3]), 0)[0]) / 2 - 40, yb + 30), 'longueur 1/60', 'r', ui=True,
            taille=14)
    S.texte((30, 274), 'agrandissement du cadre gris', 'g', ancre='start', ui=True, taille=14)
    return S


# ------------------------------------------------------------------ me-lebesgue
U_LEB = [(Fr(-1, 5), Fr(9, 20)), (Fr(3, 10), Fr(4, 5)), (Fr(31, 50), Fr(6, 5))]


def rho(t):
    """Marge ρ(t) sur K = [0, 1] (distance induite) pour le recouvrement U_LEB."""
    best = Fr(0)
    for a, b in U_LEB:
        g = t - a if a >= 0 else Fr(10)
        d = b - t if b <= 1 else Fr(10)
        best = max(best, min(g, d, Fr(1)))
    return best


@schema('me-lebesgue')
def me_lebesgue():
    ts = [Fr(k, 4000) for k in range(4001)]
    vals = [rho(t) for t in ts]
    m = min(vals)
    assert m == Fr(3, 40) and rho(Fr(3, 8)) == m
    assert all(abs(rho(s) - rho(t)) <= abs(s - t) for s, t in zip(ts, ts[1:]))       # 1-lipschitzienne
    # tout intervalle de longueur < m (traces sur [0, 1]) est dans l'un des ouverts
    pas = Fr(1, 400)
    for k in range(401):
        c = k * pas
        lo, hi = max(Fr(0), c - Fr(37, 1000)), min(Fr(1), c + Fr(37, 1000))
        assert any((a < lo or (a < 0 and lo == 0)) and (hi < b or (b > 1 and hi == 1)) for a, b in U_LEB)
    # sommets de ρ (pour le tracé exact : affine par morceaux)
    som = [Fr(0), Fr(3, 10), Fr(3, 8), Fr(9, 20), Fr(11, 20), Fr(31, 50), Fr(71, 100), Fr(4, 5), Fr(1)]
    for s1, s2 in zip(som, som[1:]):
        mid = (s1 + s2) / 2
        assert rho(mid) == (rho(s1) + rho(s2)) / 2
    S = Schema(520, 330, 'Nombre de Lebesgue d’un recouvrement du segment [0, 1]')
    R = Repere(-0.08, 1.1, -0.3, 0.52, 34, 14, 470, 300)
    S.fleche(R(-0.04, 0), R(1.09, 0), 'g')
    S.fleche(R(0, -0.02), R(0, 0.51), 'g')
    S.texte(R(0, 0.51) + [8, 6], 'ρ', 'r', ancre='start', taille=17)
    # ouverts du recouvrement (traces sur [0, 1]) sous l'axe
    lignes = [(-0.11, 'b'), (-0.2, 'v'), (-0.11, 'b')]
    noms = ['U_1', 'U_2', 'U_3']
    for (a, b), (h, c), nom in zip(U_LEB, lignes, noms):
        a2, b2 = max(a, Fr(0)), min(b, Fr(1))
        S.ligne(R(float(a2), h), R(float(b2), h), c, l=4)
        for v, ouvert in ((a2, a >= 0), (b2, b <= 1)):
            if ouvert:
                S.point(R(float(v), h), c, r=4.2, creux=True)
            else:
                S.point(R(float(v), h), c, r=4.2)
        S.texte(R(float((a2 + b2) / 2), h) + [0, 16 if c == 'b' else 16], nom, c, taille=15)
    # graphe de ρ
    S.poly(R(np.array([float(s) for s in som]), np.array([float(rho(s)) for s in som])), 'r', l=2.6)
    # minimum
    S.ligne(R(0, float(m)), R(1, float(m)), 'g', d=True)
    S.point(R(3 / 8, float(m)), 'r', r=4.6)
    S.texte(R(0, float(m)) + [-8, 0], 'm', 'g', ancre='end', taille=16)
    S.ligne(R(3 / 8, 0), R(3 / 8, float(m)), 'g', d=True)
    for v, lab in ((0, '0'), (3 / 8, '3/8'), (1, '1')):
        S.texte(R(v, 0) + [0, 14], lab, 'g', taille=14)
    S.texte(R(0.55, float(rho(Fr(11, 20)))) + [0, -16], 'pente ±1', 'r', ui=True, taille=14)
    return S


# ------------------------------------------------------------------ me-topologie
@schema('me-topologie')
def me_topologie():
    # d_2 dans le plan ; distances rationnelles choisies pour que t soit exact.
    a, r = (Fr(0), Fr(0)), Fr(3)
    b, s = (Fr(18, 5), Fr(1, 5)), Fr(5, 2)
    x = (Fr(12, 5), Fr(7, 10))
    dax2 = (x[0] - a[0]) ** 2 + (x[1] - a[1]) ** 2
    dbx2 = (x[0] - b[0]) ** 2 + (x[1] - b[1]) ** 2
    assert dax2 == Fr(5, 2) ** 2 and dbx2 == Fr(13, 10) ** 2
    dax, dbx = Fr(5, 2), Fr(13, 10)
    t = min(r - dax, s - dbx)
    assert t == Fr(1, 2) and dax < r and dbx < s
    # vérification numérique : B(x, t) ⊂ B(a, r) ∩ B(b, s)
    rng = np.random.default_rng(3)
    P = rng.uniform(-1, 1, size=(20000, 2))
    P = P[np.hypot(P[:, 0], P[:, 1]) < 1] * float(t) + np.array([float(x[0]), float(x[1])])
    assert np.all(np.hypot(P[:, 0] - float(a[0]), P[:, 1] - float(a[1])) < float(r))
    assert np.all(np.hypot(P[:, 0] - float(b[0]), P[:, 1] - float(b[1])) < float(s))
    S = Schema(500, 330, 'Une boule centrée en un point de l’intersection de deux boules y est contenue')
    R = Repere(-3.4, 6.5, -3.2, 3.4, 10, 8, 480, 316)
    th = np.linspace(0, 2 * math.pi, 241)

    def disque(c, rr, coul, **k):
        S.poly(R(float(c[0]) + float(rr) * np.cos(th), float(c[1]) + float(rr) * np.sin(th)), coul, ferme=True, **k)

    disque(a, r, 'b', l=2)
    disque(b, s, 'v', l=2)
    disque(x, t, 'r', rempli='r', l=2)
    for c, nom, coul, dx in ((a, 'a', 'b', -12), (b, 'b', 'v', 12)):
        S.point(R(float(c[0]), float(c[1])), coul, r=4)
        S.texte(R(float(c[0]), float(c[1])) + [dx, 14], nom, coul, ancre='end' if dx < 0 else 'start', taille=17)
    S.point(R(float(x[0]), float(x[1])), 't', r=4)
    S.texte(R(float(x[0]), float(x[1])) + [0, -16], 'x', taille=17)
    # rayon de a vers le point de contact, prolongé jusqu'au bord de B(a, r)
    u = (x[0] / dax, x[1] / dax)
    contact = (float(u[0] * r), float(u[1] * r))
    S.ligne(R(0, 0), R(*contact), 'g', d=True)
    S.texte(R(-3.3, 3.1), 'B(a, 3)', 'b', ancre='start', taille=16)
    S.texte(R(6.45, 3.0), 'B(b, 5/2)', 'v', ancre='end', taille=16)
    S.ligne(R(float(x[0]) + 0.3, float(x[1]) - 0.4), R(3.0, -2.15), 'r', l=1)
    S.texte(R(3.0, -2.15) + [0, 14], 'B(x, t)', 'r', taille=16)
    return S
