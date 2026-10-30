"""Schémas du chapitre « Courbes » (graphe edo-courbes) : repère de Frenet de l'hélice circulaire.
Projection parallèle (orthographique) d'une vue de biais ; toutes les positions sont calculées à partir des
formules exactes, et les invariants affirmés par la légende (κ = 16/17, τ = 4/17, N horizontal dirigé vers l'axe,
orthonormalité directe du repère) sont vérifiés numériquement."""
import math

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema


def vue(elev, azim):
    """Projection orthographique : renvoie (proj, prof) ; proj(P) donne les coordonnées d'écran (x vers la
    droite, y vers le haut), prof(P) la profondeur (positive vers l'observateur)."""
    e, a = math.radians(elev), math.radians(azim)
    vers_obs = np.array([math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e)])
    droite = np.array([-math.sin(a), math.cos(a), 0.0])
    haut = np.cross(vers_obs, droite)
    assert abs(np.dot(haut, [0, 0, 1])) > 0.5           # l'axe vertical reste vertical à l'écran

    def proj(P):
        P = np.asarray(P, float)
        return np.stack([P @ droite, P @ haut], axis=-1)

    def prof(P):
        return np.asarray(P, float) @ vers_obs
    return proj, prof


@schema('cb-helice')
def cb_helice():
    a, b = 1.0, 0.25
    w = math.hypot(a, b)

    def gam(t):
        return np.stack([a * np.cos(t), a * np.sin(t), b * t], axis=-1)

    def frenet(t):
        T = np.array([-a * math.sin(t), a * math.cos(t), b]) / w
        N = np.array([-math.cos(t), -math.sin(t), 0.0])
        B = np.array([b * math.sin(t), -b * math.cos(t), a]) / w
        return T, N, B

    # vérifications : invariants par différences finies, repère orthonormé direct, N horizontal vers l'axe
    hh = 1e-3
    for t in [0.3, 2.0, 5.1]:
        d1 = (gam(t + hh) - gam(t - hh)) / (2 * hh)
        d2 = (gam(t + hh) - 2 * gam(t) + gam(t - hh)) / hh ** 2
        d3 = (gam(t + 2 * hh) - 2 * gam(t + hh) + 2 * gam(t - hh) - gam(t - 2 * hh)) / (2 * hh ** 3)
        c = np.cross(d1, d2)
        kap = np.linalg.norm(c) / np.linalg.norm(d1) ** 3
        tau = np.linalg.det(np.array([d1, d2, d3])) / np.dot(c, c)
        assert abs(kap - 16 / 17) < 1e-5 and abs(tau - 4 / 17) < 1e-4
        T, N, B = frenet(t)
        M = np.array([T, N, B])
        assert np.allclose(M @ M.T, np.eye(3)) and abs(np.linalg.det(M) - 1) < 1e-12
        assert np.allclose(np.cross(T, N), B) and abs(N[2]) < 1e-15
        P = gam(t)
        assert np.allclose(P[:2] + N[:2], 0)              # P + N est sur l'axe (a = 1)
        assert np.allclose(d1 / np.linalg.norm(d1), T, atol=1e-6)

    proj, prof = vue(24, -62)
    t0, t1 = -2.9, 2 * math.pi + 1.2
    tt = np.linspace(t0, t1, 1600)
    pts = gam(tt)
    xy = proj(pts)
    # cadrage : la courbe, l'axe et les flèches tiennent dans l'image
    temps = [-1.75, -0.35 + 2 * math.pi]
    L = 0.9
    tous = [xy]
    for t in temps:
        P = gam(t)
        for V in frenet(t):
            tous.append(proj(P + L * V)[None, :])
    tous.append(proj(np.array([[0, 0, b * t0 - 0.3], [0, 0, b * t1 + 0.3]])))
    tous = np.vstack(tous)
    xmin, ymin = tous.min(axis=0)
    xmax, ymax = tous.max(axis=0)
    W, H = 500, 440
    ech = min((W - 90) / (xmax - xmin), (H - 50) / (ymax - ymin))
    ox = (W - ech * (xmax - xmin)) / 2 - ech * xmin
    oy = (H - ech * (ymax - ymin)) / 2 + ech * ymax

    def ecran(p2):
        p2 = np.asarray(p2, float)
        return np.stack([ox + ech * p2[..., 0], oy - ech * p2[..., 1]], axis=-1)

    S = Schema(W, H, "Hélice circulaire et son repère de Frenet en deux points")
    # axe, en pointillé
    S.ligne(ecran(proj([0, 0, b * t0 - 0.3])), ecran(proj([0, 0, b * t1 + 0.3])), 'g', d=True)
    # hélice : la partie située derrière l'axe (profondeur négative) en gris, l'avant à l'encre
    devant = prof(pts) - prof(np.stack([np.zeros_like(tt), np.zeros_like(tt), b * tt], axis=-1)) >= 0
    debut = 0
    for k in range(1, len(tt) + 1):
        if k == len(tt) or devant[k] != devant[debut]:
            seg = ecran(xy[debut:min(k + 1, len(tt))])
            S.poly(seg, 't' if devant[debut] else 'g', l=None if devant[debut] else 1.2)
            debut = k
    # repères de Frenet
    for t in temps:
        P = gam(t)
        T, N, B = frenet(t)
        p0 = ecran(proj(P))
        for V, c, nom in [(T, 'r', 'T'), (N, 'b', 'N'), (B, 'v', 'B')]:
            q = ecran(proj(P + L * V))
            assert np.linalg.norm(q - p0) > 14            # aucune flèche n'est réduite à un point
            S.fleche(p0, q, c, l=2)
            u = (q - p0) / np.linalg.norm(q - p0)
            S.texte(q + 13 * u, nom, c, taille=16)
        assert prof(np.array([math.cos(t), math.sin(t), 0.0])) > 0      # point situé devant l'axe
        S.point(p0, 't', r=3.4)
    S.texte(ecran(proj([0, 0, b * t1 + 0.3])) + [10, 6], 'z', 'g', ancre='start', taille=15)
    return S
