"""Schémas du chapitre « Surfaces » (graphe edo-surfaces) : sections principales d'une selle, triangle géodésique
sur la sphère unité. Projection parallèle (orthographique) ; les courbes sont calculées par leurs équations, les
angles du triangle par les vecteurs tangents, et son aire par l'intégrale de Gauss-Bonnet, dont l'égalité avec
l'excès angulaire est vérifiée numériquement."""
import math

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema


def vue(elev, azim):
    e, a = math.radians(elev), math.radians(azim)
    vers_obs = np.array([math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e)])
    droite = np.array([-math.sin(a), math.cos(a), 0.0])
    haut = np.cross(vers_obs, droite)

    def proj(P):
        P = np.asarray(P, float)
        return np.stack([P @ droite, P @ haut], axis=-1)

    def prof(P):
        return np.asarray(P, float) @ vers_obs
    return proj, prof


def cadre(points, W, H, marge_x=40, marge_y=30):
    pts = np.vstack(points)
    xmin, ymin = pts.min(axis=0)
    xmax, ymax = pts.max(axis=0)
    ech = min((W - 2 * marge_x) / (xmax - xmin), (H - 2 * marge_y) / (ymax - ymin))
    ox = (W - ech * (xmax - xmin)) / 2 - ech * xmin
    oy = (H - ech * (ymax - ymin)) / 2 + ech * ymax

    def ecran(p2):
        p2 = np.asarray(p2, float)
        return np.stack([ox + ech * p2[..., 0], oy - ech * p2[..., 1]], axis=-1)
    return ecran, ech


@schema('sf-courbures')
def sf_courbures():
    def z(x, y):
        return (x ** 2 - y ** 2) / 2

    # vérifications : courbures des deux sections en 0, position par rapport au plan tangent, K = -1
    for sgn, f in [(1, lambda s: z(s, 0.0)), (-1, lambda s: z(0.0, s))]:
        h = 1e-4
        d1 = (f(h) - f(-h)) / (2 * h)
        d2 = (f(h) - 2 * f(0) + f(-h)) / h ** 2
        assert abs(d2 / (1 + d1 ** 2) ** 1.5 - sgn) < 1e-6
    s = np.linspace(-1, 1, 201)
    assert np.all(z(s, 0) >= 0) and np.all(z(0, s) <= 0)
    huu, hvv, huv = 1.0, -1.0, 0.0
    assert huu * hvv - huv ** 2 == -1                     # K = -1 en 0 (Δ = 1), nœud sf-exemples (iv)

    proj, prof = vue(24, -58)
    c = 1.0
    grille = np.linspace(-c, c, 9)
    t = np.linspace(-c, c, 120)
    courbes = []
    for g in grille:
        courbes.append(np.stack([np.full_like(t, g), t, z(g, t)], axis=-1))
        courbes.append(np.stack([t, np.full_like(t, g), z(t, g)], axis=-1))
    plan = np.array([[-1.25, -1.25, 0], [1.25, -1.25, 0], [1.25, 1.25, 0], [-1.25, 1.25, 0]])
    rouge = np.stack([t, 0 * t, z(t, 0)], axis=-1)
    bleu = np.stack([0 * t, t, z(0, t)], axis=-1)
    Nv = np.array([[0, 0, 0], [0, 0, 0.75]])
    W, H = 500, 330
    ecran, ech = cadre([proj(C) for C in courbes] + [proj(plan), proj(Nv)], W, H, 50, 26)

    S = Schema(W, H, 'Selle z = (x² − y²)/2 : sections principales et plan tangent')
    S.poly(ecran(proj(plan)), 'g', d=True, ferme=True)
    for C in courbes:
        S.poly(ecran(proj(C)), 'g', l=0.8)
    S.poly(ecran(proj(rouge)), 'r', l=2.6)
    S.poly(ecran(proj(bleu)), 'b', l=2.6)
    o = ecran(proj([0, 0, 0]))
    S.fleche(o, ecran(proj(Nv[1])), 't', l=1.8)
    S.texte(ecran(proj(Nv[1])) + [10, 2], 'N', 't', ancre='start', taille=16)
    S.point(o, 't', r=3.6)
    pr = ecran(proj(rouge[0]))
    S.texte(pr + [-6, -12], 'k_1 = 1', 'r', ancre='end', taille=16)
    pb = ecran(proj(bleu[0]))
    S.texte(pb + [-8, 14], 'k_2 = −1', 'b', ancre='end', taille=16)
    coin = ecran(proj(plan[1]))
    S.texte(coin + [6, 12], 'plan tangent', 'g', ancre='start', taille=14, roman=True)
    return S


@schema('sf-gauss-bonnet')
def sf_gauss_bonnet():
    alpha = math.radians(60)
    rho0, rho1 = math.radians(70), math.radians(50)
    p = np.array([0.0, 0.0, 1.0])

    def pt(r, th):
        return np.array([math.sin(r) * math.cos(th), math.sin(r) * math.sin(th), math.cos(r)])

    def Xr(P):
        r = math.acos(max(-1.0, min(1.0, P[2])))
        th = math.atan2(P[1], P[0])
        return np.array([math.cos(r) * math.cos(th), math.cos(r) * math.sin(th), -math.sin(r)])

    q1, q2 = pt(rho0, 0.0), pt(rho1, alpha)
    om = math.acos(q1 @ q2)                                # longueur ℓ de l'arc de grand cercle
    w = (q2 - (q1 @ q2) * q1) / math.sin(om)             # vitesse initiale unitaire de c

    def c(s):
        return np.cos(s)[:, None] * q1 + np.sin(s)[:, None] * w

    ss = np.linspace(0, om, 20001)
    C = c(ss)
    r = np.arccos(np.clip(C[:, 2], -1, 1))
    th = np.arctan2(C[:, 1], C[:, 0])
    assert np.all(np.diff(th) > 0) and abs(th[0]) < 1e-12 and abs(th[-1] - alpha) < 1e-9   # θ' > 0
    assert np.all(r > 0) and np.all(r < math.pi)
    # angles
    b1 = math.acos(np.clip(-Xr(q1) @ w, -1, 1))
    cpl = -math.sin(om) * q1 + math.cos(om) * w           # c'(ℓ)
    b2 = math.acos(np.clip(-Xr(q2) @ (-cpl), -1, 1))
    exces = alpha + b1 + b2 - math.pi
    # intégrale de Gauss-Bonnet : ∫ (1 − cos ρ(θ)) dθ = ∫ (1 − cos r(s)) θ'(s) ds (trapèzes, pas fin)
    f = 1 - np.cos(r)
    aire = float(np.sum((f[1:] + f[:-1]) / 2 * np.diff(th)))
    assert abs(aire - exces) < 1e-7, (aire, exces)
    # formule de L'Huilier comme contrôle indépendant
    a_, b_, c_ = om, rho0, rho1
    s_ = (a_ + b_ + c_) / 2
    E = 4 * math.atan(math.sqrt(math.tan(s_ / 2) * math.tan((s_ - a_) / 2) * math.tan((s_ - b_) / 2)
                                * math.tan((s_ - c_) / 2)))
    assert abs(E - exces) < 1e-10
    # valeurs annoncées par la légende
    assert round(math.degrees(b1), 1) == 54.5 and round(math.degrees(b2), 1) == 92.8, (math.degrees(b1), math.degrees(b2))
    assert round(math.degrees(exces), 1) == 27.3 and round(exces, 3) == 0.477, (math.degrees(exces), exces)

    proj, prof = vue(28, -22)
    W, H = 460, 400
    phi = np.linspace(0, 2 * math.pi, 721)
    cercle_app = None
    # contour apparent de la sphère : grand cercle orthogonal à la direction d'observation
    e, a = math.radians(28), math.radians(-22)
    vobs = np.array([math.cos(e) * math.cos(a), math.cos(e) * math.sin(a), math.sin(e)])
    u1 = np.cross(vobs, [0, 0, 1.0]); u1 /= np.linalg.norm(u1)
    u2 = np.cross(vobs, u1)
    cercle_app = np.cos(phi)[:, None] * u1 + np.sin(phi)[:, None] * u2
    ecran, ech = cadre([proj(cercle_app)], W, H, 40, 22)

    S = Schema(W, H, 'Triangle géodésique sur la sphère unité')
    S.poly(ecran(proj(cercle_app)), 't', ferme=True, l=1.4)
    eq = np.stack([np.cos(phi), np.sin(phi), 0 * phi], axis=-1)
    dev = prof(eq) >= 0
    for masque, d in [(dev, False), (~dev, True)]:
        idx = np.where(masque)[0]
        # découpe en morceaux contigus
        morceaux = np.split(idx, np.where(np.diff(idx) != 1)[0] + 1)
        for m in morceaux:
            if len(m) > 1:
                S.poly(ecran(proj(eq[m])), 'g', d=d, l=1)
    # côtés radiaux (méridiens) et côté opposé
    rr0 = np.linspace(0, rho0, 200)
    rr1 = np.linspace(0, rho1, 200)
    m0 = np.array([pt(x, 0.0) for x in rr0])
    m1 = np.array([pt(x, alpha) for x in rr1])
    for P in (m0, m1, C):
        assert np.all(prof(P) > 0)                          # le triangle est entièrement visible
    contour = np.vstack([m0, C[::40], m1[::-1]])
    S.surface(ecran(proj(contour)), 'r')
    for P in (m0, m1, C[::20]):
        S.poly(ecran(proj(P)), 'r', l=2.2)
    # arcs d'angles, dans le plan tangent en chaque sommet
    def arc_angle(V, d1, d2, rayon=0.13):
        d1 = d1 / np.linalg.norm(d1)
        perp = d2 - (d2 @ d1) * d1
        perp /= np.linalg.norm(perp)
        ang = math.acos(np.clip(d1 @ (d2 / np.linalg.norm(d2)), -1, 1))
        tt = np.linspace(0, ang, 40)
        P = V + rayon * (np.cos(tt)[:, None] * d1 + np.sin(tt)[:, None] * perp)
        P /= np.linalg.norm(P, axis=1)[:, None]            # ramené sur la sphère
        S.poly(ecran(proj(P)), 'b', l=1.6)
        return P[len(P) // 2], ang
    _, aa = arc_angle(p, np.array([1.0, 0, 0]), np.array([math.cos(alpha), math.sin(alpha), 0]))
    assert abs(aa - alpha) < 1e-12
    _, a1 = arc_angle(q1, -Xr(q1), w)
    _, a2 = arc_angle(q2, -Xr(q2), -cpl)
    assert abs(a1 - b1) < 1e-12 and abs(a2 - b2) < 1e-12
    for V, nom, dx, dy, anc in [(p, 'p', 0, -16, 'middle'), (q1, 'q_1', -10, 12, 'end'), (q2, 'q_2', 10, 10, 'start')]:
        S.point(ecran(proj(V)), 't', r=3.6)
        S.texte(ecran(proj(V)) + [dx, dy], nom, 't', ancre=anc, taille=17)
    # étiquettes des angles : à l'intérieur, sur la bissectrice
    def etiquette(V, d1, d2, nom, dist=0.25):
        d1 = d1 / np.linalg.norm(d1); d2 = d2 / np.linalg.norm(d2)
        bis = d1 + d2; bis /= np.linalg.norm(bis)
        P = V + dist * bis; P /= np.linalg.norm(P)
        S.texte(ecran(proj(P)), nom, 'b', taille=16)
    etiquette(p, np.array([1.0, 0, 0]), np.array([math.cos(alpha), math.sin(alpha), 0]), 'α', 0.24)
    etiquette(q1, -Xr(q1), w, 'β_1', 0.26)
    etiquette(q2, -Xr(q2), -cpl, 'β_2', 0.26)
    return S
