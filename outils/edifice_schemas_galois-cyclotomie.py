"""Schémas du chapitre « Cyclotomie et constructions » (graphe galois-cyclotomie)."""
import math

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


def _ordre(z, n):
    return next(d for d in range(1, n + 1) if abs(z ** d - 1) < 1e-9)


# ---------------------------------------------------------------- gc-cyclotomiques
@schema('gc-cyclotomiques')
def gc_cyclotomiques():
    # Les douze racines de X^12 − 1, écrites avec des racines carrées seulement (aucune trigonométrie).
    r3 = math.sqrt(3)
    racines = [1, -1, 1j, -1j]
    racines += [(s + 1j * t * r3) / 2 for s in (1, -1) for t in (1, -1)]
    racines += [(s * r3 + 1j * t) / 2 for s in (1, -1) for t in (1, -1)]
    racines = [complex(z) for z in racines]
    assert len(racines) == 12
    assert all(abs(z ** 12 - 1) < 1e-12 for z in racines)
    assert all(abs(z - w) > 1e-6 for i, z in enumerate(racines) for w in racines[i + 1:])
    phi = {1: [1, -1], 2: [1, 1], 3: [1, 1, 1], 4: [1, 0, 1], 6: [1, -1, 1], 12: [1, 0, -1, 0, 1]}
    groupes = {d: [z for z in racines if _ordre(z, 12) == d] for d in phi}
    for d, coef in phi.items():
        assert len(groupes[d]) == len(coef) - 1                   # deg Φ_d = φ(d)
        assert all(abs(np.polyval(coef, z)) < 1e-12 for z in groupes[d])
    # les quatre racines primitives sont les sommets d'un rectangle (côtés √3 et 1)
    prim = sorted(groupes[12], key=lambda z: math.atan2(z.imag, z.real))
    cotes = [abs(prim[k] - prim[(k + 1) % 4]) for k in range(4)]
    assert sorted(round(c, 9) for c in cotes) == [1.0, 1.0, round(r3, 9), round(r3, 9)]
    couleur = {1: 't', 2: 't', 3: 'v', 4: 'g', 6: 'b', 12: 'r'}
    S = Schema(520, 300, 'Les douze racines de X^12 − 1 groupées selon leur ordre')
    O, R0 = np.array([140.0, 150.0]), 105.0
    P = lambda z: O + R0 * np.array([z.real, -z.imag])
    S.ligne(O - [R0 + 22, 0], O + [R0 + 22, 0], 'g')
    S.ligne(O - [0, R0 + 22], O + [0, R0 + 22], 'g')
    S.cercle(O, R0, 'g', d=True)
    S.poly([P(z) for z in prim], 'r', ferme=True, d=True)
    for d in phi:
        for z in groupes[d]:
            S.point(P(z), couleur[d], r=5.5 if d == 12 else 4.5)
            u = np.array([z.real, -z.imag])
            if abs(z.real) < 1e-9 or abs(z.imag) < 1e-9:              # sur un axe : étiquette en biais
                u = (u + np.array([-u[1], u[0]])) / math.sqrt(2)
            S.texte(P(z) + 20 * u, str(d), couleur[d], taille=15)
    # tableau : d, Φ_d
    x1, x2, y = 318, 352, 52
    S.texte([x1, y], 'd', 'g', taille=15)
    S.texte([x2, y], 'Φ_d', 'g', ancre='start', taille=15)
    S.ligne([300, y + 15], [512, y + 15], 'g')
    textes = {1: 'X − 1', 2: 'X + 1', 3: 'X^2 + X + 1', 4: 'X^2 + 1', 6: 'X^2 − X + 1', 12: 'X^4 − X^2 + 1'}
    for i, d in enumerate(phi):
        yy = y + 42 + 33 * i
        S.texte([x1, yy], str(d), couleur[d], taille=16)
        S.texte([x2, yy], textes[d], couleur[d], ancre='start', taille=16)
    assert y + 42 + 33 * 5 < 300 - 12
    return S


# ---------------------------------------------------------------- gc-constructibles
@schema('gc-constructibles')
def gc_constructibles():
    a, b = complex(-1, 0), complex(1, 0)
    r = abs(b - a)
    up = a + (0.5 + 0.5j * math.sqrt(3)) * (b - a)
    um = a + (0.5 - 0.5j * math.sqrt(3)) * (b - a)
    m = (a + b) / 2
    s = 2 * b - a
    for u in (up, um):
        assert abs(abs(u - a) - r) < 1e-12 and abs(abs(u - b) - r) < 1e-12
    assert abs(m) < 1e-12 and abs((up + um) / 2 - m) < 1e-12          # m sur la médiatrice et sur (ab)
    assert abs(abs(s - b) - r) < 1e-12 and abs(s.imag) < 1e-12          # 2b − a sur le cercle de centre b
    hr = 500 * 4.2 / 7.05                                               # même échelle sur les deux axes
    R = Repere(-3.3, 3.75, -2.1, 2.1, 10, (300 - hr) / 2, 500, hr)
    S = Schema(520, 300, 'Symétrique, triangles équilatéraux et milieu à la règle et au compas')
    c = lambda z: R(z.real, z.imag)
    rayon = R(r, 0)[0] - R(0, 0)[0]
    S.cercle(c(a), rayon, 'g')
    S.cercle(c(b), rayon, 'b')
    S.ligne(R(-3.3, 0), R(3.75, 0), 't')
    S.ligne(c(up) + [0, -12], c(um) + [0, 12], 'r', d=True)
    for z, nom, col, dec in [(a, 'a', 't', (-12, 18)), (b, 'b', 't', (12, 18)), (m, 'm', 'r', (12, 18)),
                             (s, '2b − a', 'b', (0, 20)), (up, 'u_+', 'r', (16, -12)), (um, 'u_−', 'r', (16, 14))]:
        S.point(c(z), col, r=4.5)
        S.texte(c(z) + dec, nom, col, taille=16)
    return S


# ---------------------------------------------------------------- gc-corps-constructibles
@schema('gc-corps-constructibles')
def gc_corps_constructibles():
    x, y = 1.6, 1.25
    # droite par 1 et iy, parallèle par x : (x − s) + i s y coupe iℝ en s = x
    s = x
    pied = complex(x - s, s * y)
    assert abs(pied - 1j * x * y) < 1e-12 and abs(x * y - 2) < 1e-12
    r = 3.0
    c, rho = (r - 1) / 2, (r + 1) / 2
    hauteur = math.sqrt(rho ** 2 - c ** 2)
    assert abs(hauteur - math.sqrt(r)) < 1e-12
    S = Schema(520, 300, 'Produit par Thalès et racine carrée par le cercle de diamètre [−1, r]')
    # panneau gauche
    hg = 225 * 2.7 / 2.4                                                # même échelle sur les deux axes
    G = Repere(-0.35, 2.05, -0.35, 2.35, 18, 18 + (255 - hg) / 2, 225, hg)
    S.fleche(G(-0.35, 0), G(2.05, 0), 'g')
    S.fleche(G(0, -0.35), G(0, 2.35), 'g')
    S.ligne(G(1, 0), G(0, y), 'g')
    S.ligne(G(x, 0), G(0, x * y), 'r')
    for (px, py), nom, col, dec in [((1, 0), '1', 't', (0, 18)), ((x, 0), 'x', 't', (0, 18)),
                                    ((0, y), 'iy', 't', (-18, 0)), ((0, x * y), 'ixy', 'r', (-24, 0)),
                                    ((0, 0), '0', 'g', (-12, 14))]:
        S.point(G(px, py), col, r=4.5 if col != 'g' else 3)
        S.texte(G(px, py) + dec, nom, col, taille=16)
    # panneau droit
    hd = 225 * 4.4 / 4.85
    D = Repere(-1.45, 3.4, -2.2, 2.2, 285, 18 + (255 - hd) / 2, 225, hd)
    S.fleche(D(-1.45, 0), D(3.4, 0), 'g')
    S.fleche(D(0, -2.2), D(0, 2.2), 'g')
    ech = D(1, 0)[0] - D(0, 0)[0]
    assert abs(ech - (D(0, 1)[1] - D(0, 0)[1]) * -1) < 1e-9                # même échelle sur les deux axes
    S.cercle(D(c, 0), rho * ech, 'b')
    S.ligne(D(0, hauteur), D(0, -hauteur), 'r', l=2.2)
    for (px, py), nom, col, dec in [((-1, 0), '−1', 't', (-16, 16)), ((r, 0), 'r', 't', (10, 16)),
                                    ((c, 0), 'c', 'b', (0, 16)), ((0, hauteur), 'i√r', 'r', (-22, -10)),
                                    ((0, -hauteur), '−i√r', 'r', (-28, 10))]:
        S.point(D(px, py), col, r=4.5)
        S.texte(D(px, py) + dec, nom, col, taille=16)
    return S


# ---------------------------------------------------------------- gc-heptadecagone
_PERIODES = {0: [1, 4, 13, 16], 2: [2, 8, 9, 15], 1: [3, 5, 12, 14], 3: [6, 7, 10, 11]}


def _verifie_periodes():
    g = [pow(3, k, 17) for k in range(16)]
    assert sorted(g) == list(range(1, 17))
    for j in range(4):
        assert sorted(g[j::4]) == _PERIODES[j]
    for j, ex in _PERIODES.items():                                     # chaque période est stable par k ↦ −k
        assert sorted((-k) % 17 for k in ex) == ex


@schema('gc-heptadecagone')
def gc_heptadecagone():
    _verifie_periodes()
    z = np.exp(2j * np.pi * np.arange(17) / 17)
    y = {j: sum(z[k] for k in ex) for j, ex in _PERIODES.items()}
    assert all(abs(v.imag) < 1e-12 for v in y.values())
    x0 = (z[1] + z[16]).real
    assert abs(x0 - 2 * math.cos(2 * math.pi / 17)) < 1e-12 and abs(x0 - 1.8649) < 1e-3
    eta0 = y[0] + y[2]
    assert abs(eta0 - (-1 + math.sqrt(17)) / 2) < 1e-12
    couleur = {0: 'r', 2: 'b', 1: 'v', 3: 'g'}
    de = {k: j for j, ex in _PERIODES.items() for k in ex}
    S = Schema(520, 300, 'L’heptadécagone et les quatre périodes de Gauss de quatre termes')
    O, R0 = np.array([190.0, 150.0]), 118.0
    P = lambda w: O + R0 * np.array([w.real, -w.imag])
    S.ligne(O - [R0 + 22, 0], O + [2.05 * R0 + 26, 0], 'g')
    S.cercle(O, R0, 'g', d=True)
    S.poly([P(w) for w in z], 't', ferme=True)
    X0 = complex(x0, 0)
    assert abs(abs(X0 - z[1]) - 1) < 1e-12 and abs(abs(X0 - z[16]) - 1) < 1e-12   # losange 0, ζ, x_0, ζ^16
    for w in (z[1], z[16]):
        S.ligne(O, P(w), 'r', d=True)
        S.ligne(P(w), P(X0), 'r', d=True)
    for k in range(17):
        c = 't' if k == 0 else couleur[de[k]]
        S.point(P(z[k]), c, r=5)
        u = np.array([z[k].real, -z[k].imag])
        if k == 0:                                   # ζ^0 = 1 : étiquette au-dessus, hors de l'axe
            S.texte(P(z[k]) + [14, -14], 'ζ^0', c, taille=14)
        else:
            S.texte(P(z[k]) + 19 * u, str(k), c, taille=14)
    S.point(P(complex(x0, 0)), 'r', r=5)
    S.texte(P(complex(x0, 0)) + [0, -16], 'x_0', 'r', taille=16)
    # légende des couleurs
    xl, yl = 432, 20
    for i, (j, nom) in enumerate([(0, 'y_0'), (2, 'y_2'), (1, 'y_1'), (3, 'y_3')]):
        S.point([xl, yl + 24 * i], couleur[j], r=5)
        S.texte([xl + 14, yl + 24 * i], nom, couleur[j], ancre='start', taille=16)
    S.point([xl, yl + 96], 't', r=5)
    S.texte([xl + 14, yl + 96], 'ζ^0 = 1', 't', ancre='start', taille=16)
    assert P(complex(x0, 0))[0] < 520 - 20
    return S


@schema('gc-heptadecagone-2')
def gc_heptadecagone_2():
    _verifie_periodes()
    g = [pow(3, k, 17) for k in range(16)]
    sg = {16: sorted(g), 8: sorted(g[::2]), 4: sorted(g[::4]), 2: sorted(g[::8]), 1: [1]}
    assert sg[8] == [1, 2, 4, 8, 9, 13, 15, 16] and sg[4] == [1, 4, 13, 16] and sg[2] == [1, 16]
    for a, b in [(16, 8), (8, 4), (4, 2), (2, 1)]:
        assert set(sg[b]) <= set(sg[a]) and len(sg[a]) == 2 * len(sg[b])
    # coefficients des équations, vérifiés numériquement pour ζ = e^{2iπ/17}
    z = np.exp(2j * np.pi * np.arange(17) / 17)
    per = lambda ex: sum(z[k] for k in ex)
    eta0, y0, y1, x0 = per(sg[8]), per(_PERIODES[0]), per(_PERIODES[1]), z[1] + z[16]
    assert abs(eta0 ** 2 + eta0 - 4) < 1e-12 and abs(y0 ** 2 - eta0 * y0 - 1) < 1e-12
    assert abs(x0 ** 2 - y0 * x0 + y1) < 1e-12 and abs(z[1] ** 2 - x0 * z[1] + 1) < 1e-12
    S = Schema(520, 330, 'Sous-groupes de (Z/17Z)^× et corps fixes : la tour quadratique de l’heptadécagone')
    lignes = [(1, '{1}', 'ℚ(ζ)'), (2, '{1, 16}', 'ℚ(x_0)'), (4, '{1, 4, 13, 16}', 'ℚ(y_0)'),
              (8, '{1, 2, 4, 8, 9, 13, 15, 16}', 'ℚ(η_0)'), (16, '(ℤ/17ℤ)^×', 'ℚ')]
    eqs = ['ζ^2 − x_0ζ + 1 = 0', 'x^2 − y_0x + y_1 = 0', 'y^2 − η_0y − 1 = 0', 'η^2 + η − 4 = 0']
    xg, xc, xe, y0p, pas = 118, 318, 352, 30, 61
    ys = [y0p + pas * i for i in range(5)]
    for (o, grp, corps), yy in zip(lignes, ys):
        S.texte([xg, yy], grp, 'b', taille=15)
        S.texte([xc, yy], corps, 'r', taille=16)
        S.fleche([xg + 108, yy], [xc - 38, yy], 'g', d=True, double=True)
    for i in range(4):
        S.ligne([xc, ys[i] + 15], [xc, ys[i + 1] - 15], 'r')
        S.texte([xe, (ys[i] + ys[i + 1]) / 2], eqs[i], 't', ancre='start', taille=15)
        S.texte([xc - 12, (ys[i] + ys[i + 1]) / 2], '2', 'g', taille=13)
    S.texte([xg, 318], 'sous-groupes', 'g', ui=True)
    S.texte([xc, 318], 'corps fixes', 'g', ui=True)
    assert ys[-1] + 20 < 318 - 10
    return S
