"""Schémas du chapitre « Produit cup » (graphe hom-cup) : faces avant et arrière d'un simplexe de dimension 3,
relèvement positif d'un chemin de ℝP¹ dans le cercle, rétraction de ℝP² privé d'un point sur ℝP¹ vue dans
l'hémisphère supérieur. Positions calculées, propriétés vérifiées par assert."""
import math

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema


def _unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


def _positif(x):
    """Première coordonnée non nulle strictement positive (fiche cup-transfert)."""
    for c in x:
        if abs(c) > 1e-12:
            return c > 0
    raise ValueError('point nul')


@schema('cup-produit')
def cup_produit():
    k, l = 1, 2
    avant, arriere = set(range(0, k + 1)), set(range(k, k + l + 1))
    assert avant & arriere == {k}                                    # un seul sommet commun
    aretes = [(i, j) for i in range(4) for j in range(i + 1, 4)]
    hors = [e for e in aretes if not (set(e) <= avant or set(e) <= arriere)]
    assert hors == [(0, 2), (0, 3)]                                  # arêtes qui n'interviennent pas
    S = Schema(480, 310, 'Face avant et face arrière d’un simplexe de dimension 3 pour k = 1, l = 2')
    E = [np.array(p, float) for p in [(85, 225), (225, 275), (410, 215), (250, 55)]]
    S.surface([E[1], E[2], E[3]], 'b')
    for i, j in hors:
        S.ligne(E[i], E[j], 'g', d=(i, j) == (0, 2))
    for i, j in [(1, 2), (2, 3), (1, 3)]:
        S.ligne(E[i], E[j], 'b', l=2.6)
    S.ligne(E[0], E[1], 'r', l=4)
    m = (E[0] + E[1]) / 2
    S.pointe(m + 7 * _unit(E[1] - E[0]), E[1] - E[0], 'r', taille=12, largeur=5)
    S.texte(m + [-18, 26], 'φ', 'r', taille=19)
    S.texte((E[1] + E[2] + E[3]) / 3 + [8, 6], 'ψ', 'b', taille=19)
    for p, lab, d, an in [(E[0], 'e_0', [-10, 4], 'end'), (E[1], 'e_1', [0, 20], 'middle'),
                          (E[2], 'e_2', [10, 4], 'start'), (E[3], 'e_3', [0, -16], 'middle')]:
        S.point(p, 'r' if lab == 'e_1' else 't', r=4.2 if lab == 'e_1' else 3.6)
        S.texte(p + d, lab, ancre=an)
    return S


@schema('cup-transfert')
def cup_transfert():
    S = Schema(480, 340, 'Points positifs du cercle et relèvement positif d’un chemin de ℝP¹')
    c, R = np.array([240.0, 170.0]), 112.0
    P = lambda v, r=1.0: c + R * r * np.array([v[0], -v[1]])
    eps = 0.05
    droite = np.linspace(-math.pi / 2 + eps, math.pi / 2 - eps, 160)
    gauche = droite + math.pi
    pts_d = np.stack([np.cos(droite), np.sin(droite)], -1)
    assert all(_positif(v) for v in pts_d) and not any(_positif(-v) for v in pts_d)
    S.poly([P(v) for v in pts_d], 'r', l=3.4)
    S.poly([P(v) for v in np.stack([np.cos(gauche), np.sin(gauche)], -1)], 'b', l=3.4)
    haut, bas = np.array([0.0, 1.0]), np.array([0.0, -1.0])
    assert _positif(haut) and not _positif(bas)
    S.point(P(haut), 'r', r=5)
    S.point(P(bas), 'b', r=5)
    S.texte(P(haut) + [0, 22], '(0, 1)', 'r', taille=15)
    S.texte(P(bas) + [0, -22], '(0, −1)', 'b', taille=15)
    # γ⁺ : de l'angle 55° à l'angle 135°, tracé un peu à l'extérieur ; a∘γ⁺ : l'arc opposé
    t0, t1 = math.radians(55), math.radians(135)
    ts = np.linspace(t0, t1, 120)
    gam = np.stack([np.cos(ts), np.sin(ts)], -1)
    assert _positif(gam[0]) and not _positif(gam[-1])                # γ⁺ part positif, finit non positif
    assert not _positif(-gam[0]) and _positif(-gam[-1])               # son opposé fait l'inverse
    S.courbe_fleche([P(v, 1.17) for v in gam], 't', l=2.4)
    S.courbe_fleche([P(-v, 1.17) for v in gam], 't', d=True, l=2.0)
    S.point(P(gam[0], 1.17), 't', r=3.4)
    S.point(P(-gam[0], 1.17), 't', r=3.4)
    S.texte(P(np.array([math.cos(math.radians(62)), math.sin(math.radians(62))]), 1.36), 'γ^+', taille=17)
    S.texte(P(-np.array([math.cos(math.radians(62)), math.sin(math.radians(62))]), 1.36) + [-14, 0],
            'a ∘ γ^+', taille=16)
    S.ligne(c + [-R - 22, 0], c + [R + 22, 0], 'g', d=True)
    S.ligne(c + [0, -R + 34], c + [0, R - 34], 'g', d=True)
    S.texte(c + [R + 28, 0], 'x_1', 'g', ancre='start', taille=15)
    return S


@schema('cup-projectif-dimension')
def cup_projectif_dimension():
    S = Schema(480, 330, 'Rétraction de ℝP² privé d’un point sur ℝP¹, vue dans l’hémisphère supérieur')
    c, R = np.array([240.0, 165.0]), 125.0
    D = lambda z: c + R * np.array([z[0], -z[1]])
    S.cercle(c, R, 'v', rempli='v')
    S.cercle(c, R, 'g', d=True)
    # trajectoires de H : x = (z, h), h = √(1 − ‖z‖²) ; H(x, t) = (z, (1 − t)h)/‖…‖, de projection radiale
    for ang in range(0, 360, 30):
        u = np.array([math.cos(math.radians(ang + 15)), math.sin(math.radians(ang + 15))])
        z0 = 0.3 * u
        h = math.sqrt(1 - z0 @ z0)
        traj = []
        for t in np.linspace(0, 0.97, 60):
            v = np.array([*z0, (1 - t) * h])
            v /= np.linalg.norm(v)
            traj.append(v[:2])
        traj = np.array(traj)
        assert np.allclose(traj / np.linalg.norm(traj, axis=1)[:, None], u)    # reste sur le rayon
        assert np.all(np.diff(np.linalg.norm(traj, axis=1)) > 0)               # s'éloigne du centre
        S.courbe_fleche([D(z) for z in traj], 't', l=1.6)
    S.point(c, 'r', r=5.5, creux=True)
    S.texte(c + [0, 22], 'q(N)', 'r', taille=15)
    w = np.array([math.cos(math.radians(40)), math.sin(math.radians(40))])
    for s in (1, -1):
        S.point(D(s * w), 'b', r=5)
    S.ligne(D(1.12 * w), D(1.25 * w), 'b')
    S.ligne(D(-1.12 * w), D(-1.25 * w), 'b')
    S.texte(D(1.33 * w), 'z', 'b', taille=16)
    S.texte(D(-1.33 * w), '−z', 'b', taille=16)
    S.texte(c + [R * 0.72, R * 0.86], 'B ≅ V', 'v', ancre='start', taille=16)
    S.texte(c + [-R - 12, -R * 0.62], 'ℝP^1', 'g', ancre='end', taille=16)
    return S
