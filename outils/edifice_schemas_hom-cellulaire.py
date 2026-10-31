"""Schémas du chapitre « Homologie cellulaire » (graphe hom-cellulaire) : collerette d'une cellule et
déformation radiale (homologie d'un attachement), tore comme carré recollé, surface de genre 2 comme
octogone recollé selon a₁b₁a₁⁻¹b₁⁻¹a₂b₂a₂⁻¹b₂⁻¹, cellules de ℝP² (bord parcouru deux fois dans le même
sens). Positions calculées, propriétés vérifiées par assert."""
import math

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, arc


def _unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


def _image(c, R):
    """Coordonnées mathématiques (y vers le haut) vers l'image (y vers le bas)."""
    return lambda z, r=1.0: np.asarray(c, float) + R * r * np.array([z[0], -z[1]], float)


@schema('cw-cellules-relatives')
def cw_cellules_relatives():
    S = Schema(480, 320, 'Collerette d’une cellule et déformation radiale sur le bord')
    c, R = np.array([200.0, 160.0]), 130.0
    D = _image(c, R)
    # couronne K = {1/2 ≤ ‖z‖ ≤ 1} : anneau rempli (deux cercles de sens opposés)
    S.brut(f'<path class="f-b" d="M {c[0] + R:.2f} {c[1]:.2f} A {R} {R} 0 1 0 {c[0] - R:.2f} {c[1]:.2f} '
           f'A {R} {R} 0 1 0 {c[0] + R:.2f} {c[1]:.2f} Z M {c[0] + R / 2:.2f} {c[1]:.2f} '
           f'A {R / 2} {R / 2} 0 1 1 {c[0] - R / 2:.2f} {c[1]:.2f} A {R / 2} {R / 2} 0 1 1 '
           f'{c[0] + R / 2:.2f} {c[1]:.2f} Z"/>')
    S.cercle(c, R / 2, 'g', d=True)
    # trajectoires de H(z, t) = (1 − t) z + t z/‖z‖ depuis des points de la couronne
    for k in range(10):
        ang = math.radians(18 + 36 * k)
        u = np.array([math.cos(ang), math.sin(ang)])
        z0 = 0.56 * u
        ts = np.linspace(0, 1, 40)
        traj = np.array([(1 - t) * z0 + t * z0 / np.linalg.norm(z0) for t in ts])
        nr = np.linalg.norm(traj, axis=1)
        assert np.all(nr >= 0.56 - 1e-12) and np.all(nr <= 1 + 1e-12)      # reste dans la couronne
        assert np.all(np.diff(nr) > 0) and abs(nr[-1] - 1) < 1e-12          # monte jusqu'au bord
        assert np.allclose(traj / nr[:, None], u)                            # le long du rayon
        S.courbe_fleche([D(z) for z in traj[:-3]], 't', l=1.7)
    S.brut(f'<circle class="s-r" style="stroke-width:3.4" cx="{c[0]:.2f}" cy="{c[1]:.2f}" r="{R}"/>')
    S.point(c, 'g', r=3)
    S.texte(c + [0, 22], '‖z‖ < 1/2', 'g', taille=15, roman=True)
    p = D(np.array([math.cos(math.radians(40)), math.sin(math.radians(40))]), 1.08)
    S.texte(p + [6, -6], 'S^{n−1} → Y', 'r', ancre='start', taille=17)
    q = D(np.array([math.cos(math.radians(-38)), math.sin(math.radians(-38))]), 1.12)
    S.texte(q + [6, 8], 'K', 'b', ancre='start', taille=18)
    S.texte(np.array([420.0, 160.0]), 'D^n', 't', taille=18)
    return S


def _torus_word():
    """Bord du carré C = [0, 1]², parcouru dans le sens direct depuis (0, 0) ; P(1, v) = P(0, v) et
    P(u, 1) = P(u, 0). Renvoie la liste (cellule, signe)."""
    cotes = [((0, 0), (1, 0)), ((1, 0), (1, 1)), ((1, 1), (0, 1)), ((0, 1), (0, 0))]
    mot = []
    for p, q in cotes:
        p, q = np.array(p, float), np.array(q, float)
        d = q - p
        if d[1] == 0:          # côté horizontal : cellule a, paramétrée par u croissant
            mot.append(('a', int(np.sign(d[0]))))
        else:                  # côté vertical : cellule b, paramétrée par v croissant
            mot.append(('b', int(np.sign(d[1]))))
    return mot


@schema('cw-surfaces')
def cw_surfaces():
    mot = _torus_word()
    assert mot == [('a', 1), ('b', 1), ('a', -1), ('b', -1)]
    assert sum(e for l, e in mot if l == 'a') == 0 and sum(e for l, e in mot if l == 'b') == 0
    S = Schema(440, 310, 'Le tore comme carré dont on recolle les côtés opposés')
    o, L = np.array([120.0, 260.0]), 200.0
    P = lambda u, v: o + L * np.array([u, -v])
    coins = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)]
    S.surface(coins, 'v')
    for (u0, v0), (u1, v1), col in [((0, 0), (1, 0), 'r'), ((0, 1), (1, 1), 'r'),
                                    ((0, 0), (0, 1), 'b'), ((1, 0), (1, 1), 'b')]:
        p, q = P(u0, v0), P(u1, v1)
        S.ligne(p, q, col, l=3)
        m = (p + q) / 2
        S.pointe(m + 9 * _unit(q - p), q - p, col, taille=13, largeur=6)
    for p in coins:
        S.point(p, 't', r=5)
    S.texte(P(0.5, 0) + [0, 24], 'a', 'r', taille=19)
    S.texte(P(0.5, 1) + [0, -22], 'a', 'r', taille=19)
    S.texte(P(0, 0.5) + [-22, 0], 'b', 'b', taille=19)
    S.texte(P(1, 0.5) + [22, 0], 'b', 'b', taille=19)
    S.texte(P(0, 0) + [-18, 18], 'x_0', taille=16)
    # sens de parcours du bord : petite flèche circulaire au centre, sens direct
    t = np.linspace(math.radians(-60), math.radians(240), 60)
    cen = P(0.5, 0.5)
    S.courbe_fleche(np.stack([cen[0] + 34 * np.cos(t), cen[1] - 34 * np.sin(t)], -1), 'v', l=1.8)
    S.texte(cen, 'c', 'v', taille=19)
    return S


def _octogone_angles():
    """Points de subdivision du bord de Q = [−1, 1]² pour g = 2 (coins et milieux), depuis (−1, −1) dans le
    sens direct, envoyés radialement sur le cercle : leurs angles, en degrés."""
    w = [(-1, -1), (0, -1), (1, -1), (1, 0), (1, 1), (0, 1), (-1, 1), (-1, 0)]
    return [math.degrees(math.atan2(y, x)) % 360 for x, y in w]


@schema('cw-surfaces-2')
def cw_surfaces_2():
    angs = _octogone_angles()
    assert np.allclose(angs, [(225 + 45 * i) % 360 for i in range(8)])     # octogone régulier
    mot = [('a_1', 1), ('b_1', 1), ('a_1', -1), ('b_1', -1), ('a_2', 1), ('b_2', 1), ('a_2', -1), ('b_2', -1)]
    for lettre in {l for l, _ in mot}:
        sg = [e for l, e in mot if l == lettre]
        assert sorted(sg) == [-1, 1]                                       # deux fois, sens opposés
    S = Schema(460, 360, 'La surface de genre 2 comme octogone recollé')
    c, R = np.array([230.0, 180.0]), 135.0
    D = _image(c, R)
    V = [D(np.array([math.cos(math.radians(a)), math.sin(math.radians(a))])) for a in angs]
    S.surface(V, 'v')
    for i, (lettre, e) in enumerate(mot):
        p, q = V[i], V[(i + 1) % 8]
        col = 'r' if lettre[0] == 'a' else 'b'
        S.ligne(p, q, col, l=3)
        m = (p + q) / 2
        dirn = (q - p) if e == 1 else (p - q)
        S.pointe(m + 9 * _unit(dirn), dirn, col, taille=13, largeur=6)
        out = _unit(m - c)
        S.texte(m + 24 * out, lettre, col, taille=18)
    for p in V:
        S.point(p, 't', r=4.6)
    t = np.linspace(math.radians(-60), math.radians(240), 60)
    S.courbe_fleche(np.stack([c[0] + 36 * np.cos(t), c[1] - 36 * np.sin(t)], -1), 'v', l=1.8)
    return S


@schema('cw-projectifs')
def cw_projectifs():
    S = Schema(460, 330, 'Les cellules de ℝP², vues dans l’hémisphère supérieur')
    c, R = np.array([230.0, 165.0]), 120.0
    D = _image(c, R)
    # arc supérieur : la cellule Ψ₁(s) = q(s, √(1 − s²)), s de −1 à 1 ; arc inférieur : z = (s', −√…)
    s = np.linspace(-1, 1, 201)
    haut = np.stack([s, np.sqrt(1 - s ** 2)], -1)
    bas = -haut                       # z ↦ −z envoie l'arc supérieur sur l'arc inférieur, s ↦ −s
    assert np.allclose(bas[:, 1], -np.sqrt(1 - s ** 2))
    # sens : quand s croît, le point de l'arc supérieur va de (−1, 0) à (1, 0) en passant par (0, 1) ;
    # son antipode va de (1, 0) à (−1, 0) en passant par (0, −1) : les deux tournent dans le sens horaire
    def horaire(pts):
        v = np.diff(pts, axis=0)
        return np.all(pts[:-1, 0] * v[:, 1] - pts[:-1, 1] * v[:, 0] < 1e-12)
    assert horaire(haut) and horaire(bas)
    S.cercle(c, R, 'v', rempli='v')
    S.poly([D(z) for z in haut], 'r', l=3.4)
    S.poly([D(z) for z in bas], 'r', d=True, l=3.0)
    # pointes au milieu des deux arcs, dans le sens horaire
    S.pointe(D(np.array([0.0, 1.0])) + [8, 0], [1, 0], 'r', taille=13, largeur=6)
    S.pointe(D(np.array([0.0, -1.0])) + [-8, 0], [-1, 0], 'r', taille=13, largeur=6)
    for x in (-1, 1):
        S.point(D(np.array([x, 0.0])), 't', r=5)
    S.texte(D(np.array([1.0, 0.0])) + [12, 0], 'x_0', ancre='start', taille=16)
    S.texte(D(np.array([-1.0, 0.0])) + [-12, 0], 'x_0', ancre='end', taille=16)
    S.texte(D(np.array([0.0, 1.0])) + [0, -20], 'e^1', 'r', taille=18)
    S.texte(D(np.array([0.0, -1.0])) + [0, 22], 'e^1', 'r', taille=18)
    # une paire de points identifiés
    a = math.radians(35)
    z = np.array([math.cos(a), math.sin(a)])
    S.ligne(D(z), D(-z), 'g', d=True)
    S.point(D(z), 'b', r=4.6)
    S.point(D(-z), 'b', r=4.6)
    S.texte(D(z, 1.14) + [4, 0], 'z', 'b', ancre='start', taille=16)
    S.texte(D(-z, 1.14) + [-4, 0], '−z', 'b', ancre='end', taille=16)
    S.texte(c + [34, 48], 'e^2', 'v', taille=18)
    return S
