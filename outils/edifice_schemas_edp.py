"""Schémas des graphes edp (distributions) et edp-laplace (équations de Laplace et de la chaleur)."""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


def _theta(x):
    x = np.asarray(x, float)
    return np.where(x > 0, np.exp(-1 / np.where(x > 0, x, 1)), 0.0)


def _noyau_1d():
    """ρ(x) = θ(1 − x²)/c₁ sur ℝ et sa primitive F (F(−1) = 0, F(1) = 1), sur une grille fine."""
    xs = np.linspace(-1, 1, 200001)
    r = _theta(1 - xs ** 2)
    c1 = np.trapezoid(r, xs)
    rho = r / c1
    F = np.concatenate([[0.0], np.cumsum((rho[1:] + rho[:-1]) / 2 * np.diff(xs))])
    return xs, rho, F, c1


@schema('ds-regularisation')
def ds_regularisation():
    # f = 1_[−1,1] ; (f * ρ_ε)(x) = ∫_{x−1}^{x+1} ρ_ε = Φ((x+1)/ε) − Φ((x−1)/ε), Φ primitive de ρ.
    xs, rho, F, c1 = _noyau_1d()
    assert abs(c1 - 0.44399) < 1e-4 and abs(F[-1] - 1) < 1e-9
    Phi = lambda s: np.interp(s, xs, F, left=0.0, right=1.0)
    reg = lambda x, e: Phi((x + 1) / e) - Phi((x - 1) / e)
    X = np.linspace(-2, 2, 4001)
    eps = [(0.6, 'b'), (0.3, 'v'), (0.1, 'r')]
    for e, _ in eps:
        y = reg(X, e)
        assert np.all(y >= -1e-12) and np.all(y <= 1 + 1e-12)
        assert np.allclose(y[np.abs(X) <= 1 - e], 1, atol=1e-9)
        assert np.allclose(y[np.abs(X) >= 1 + e], 0, atol=1e-9)
        assert abs(reg(np.array([1.0]), e)[0] - 0.5) < 1e-6 and abs(reg(np.array([-1.0]), e)[0] - 0.5) < 1e-6
        k = np.linspace(-e, e, 20001)                                  # ∫ ρ_ε = 1
        assert abs(np.trapezoid(np.interp(k / e, xs, rho) / e, k) - 1) < 1e-6
    S = Schema(520, 400, 'Régularisation de l’indicatrice de [−1, 1] par les noyaux ρ_ε')
    R = Repere(-2.1, 2.1, -0.12, 1.2, 30, 10, 460, 220)
    S.fleche(R(-2.1, 0), R(2.1, 0), 'g'); S.texte(R(2.1, 0) + [8, 12], 'x', 'g', ancre='start')
    S.fleche(R(0, -0.12), R(0, 1.2), 'g')
    S.poly([R(-2.1, 0), R(-1, 0), R(-1, 1), R(1, 1), R(1, 0), R(2.1, 0)], 'g', l=3.0)
    for e, c in eps:
        S.poly(R(X, reg(X, e)), c, l=1.9)
    for s in (-1, 1):
        S.point(R(s, 0.5), 't', r=3.2)
        S.texte(R(s, 0) + [0, 16], '−1' if s < 0 else '1', 'g', taille=15)
    S.texte(R(0, 1) + [-8, -12], '1', 'g', ancre='end', taille=15)
    S.texte(R(1, 0.5) + [10, 0], '1/2', 't', ancre='start', taille=14)
    # noyaux
    Q = Repere(-0.75, 0.75, -0.6, 8.9, 150, 255, 220, 130)
    S.fleche(Q(-0.75, 0), Q(0.75, 0), 'g')
    for e, c in eps:
        k = np.linspace(-e, e, 801)
        S.poly(Q(k, np.interp(k / e, xs, rho) / e), c, l=1.7)
    pics = [float(np.interp(0, xs, rho)) / e for e, _ in eps]
    assert abs(pics[2] - 8.2856) < 1e-3
    S.texte(Q(0.1, pics[2]) + [8, 6], 'ρ_{0,1}', 'r', ancre='start', taille=15)
    S.texte(Q(0.3, pics[1] / 2) + [10, 0], 'ρ_{0,3}', 'v', ancre='start', taille=15)
    S.texte(Q(-0.6, pics[0] / 2) + [-8, -6], 'ρ_{0,6}', 'b', ancre='end', taille=15)
    return S


@schema('ds-derivation')
def ds_derivation():
    # |x|, sa dérivée sgn (saut 2 en 0), puis sgn' = 2δ (flèche de hauteur 2).
    S = Schema(520, 420, 'La valeur absolue, sa dérivée sgn et la dérivée de sgn, égale à 2δ')
    xs = np.linspace(-1.6, 1.6, 321)
    # dérivées au sens des distributions, testées sur φ(x) = e^{−x²}(1 + x + x³) par quadrature :
    # −∫|x| φ' = ∫ sgn φ   et   −∫ sgn φ' = 2 φ(0)  (hauteur 2 de la flèche).
    t = np.linspace(-12, 12, 480001)
    phi = np.exp(-t ** 2) * (1 + t + t ** 3)
    dphi = np.gradient(phi, t)
    assert abs(-np.trapezoid(np.abs(t) * dphi, t) - np.trapezoid(np.sign(t) * phi, t)) < 1e-6
    hauteur = -np.trapezoid(np.sign(t) * dphi, t) / phi[t.size // 2]
    assert abs(hauteur - 2) < 1e-6
    haut = [(10, 1.7, -0.25), (150, 1.25, -1.25), (290, 2.4, -0.3)]
    reps = []
    for y0, ymax, ymin in haut:
        R = Repere(-1.8, 1.8, ymin, ymax, 70, y0, 400, 110)
        S.fleche(R(-1.8, 0), R(1.8, 0), 'g'); S.texte(R(1.8, 0) + [8, 12], 'x', 'g', ancre='start')
        S.fleche(R(0, ymin), R(0, ymax), 'g')
        reps.append(R)
    R1, R2, R3 = reps
    S.poly(R1(xs, np.abs(xs)), 't', l=2.2)
    S.texte(R1(-1.6, 1.6) + [-8, 0], '|x|', 't', ancre='end')
    S.poly(R2(np.array([-1.6, 0]), np.array([-1, -1])), 'b', l=2.2)
    S.poly(R2(np.array([0, 1.6]), np.array([1, 1])), 'b', l=2.2)
    S.point(R2(0, -1), 'b', r=3.6, creux=True); S.point(R2(0, 1), 'b', r=3.6, creux=True)
    S.point(R2(0, 0), 'b', r=3.4)
    S.texte(R2(-1.6, -1) + [-8, 0], 'sgn', 'b', ancre='end', roman=True)
    S.texte(R2(0, 1) + [-10, -2], '1', 'g', ancre='end', taille=15)
    S.texte(R2(0, -1) + [10, 2], '−1', 'g', ancre='start', taille=15)
    S.ligne(R3(-1.6, 0), R3(1.6, 0), 'v', l=2.2)
    S.fleche(R3(0, 0), R3(0, hauteur), 'r', l=2.4)
    S.ligne(R3(0, 2) + [-6, 0], R3(0, 2) + [6, 0], 'g')
    S.texte(R3(0, 2) + [-10, 0], '2', 'g', ancre='end', taille=15)
    S.texte(R3(0, 2) + [12, 4], '2δ', 'r', ancre='start')
    S.texte(R3(-1.6, 0) + [-6, -16], 'sgn′', 'v', ancre='start', roman=True)
    return S


@schema('ha-boule')
def ha_boule():
    # Disque unité ; section verticale en y' = 0,45 : ]−a, a[, a = √(1 − y'²), extrémités sur le cercle.
    yp = 0.45
    a = math.sqrt(1 - yp ** 2)
    assert abs(yp ** 2 + a ** 2 - 1) < 1e-12 and abs(a - 0.8930) < 1e-4
    S = Schema(480, 340, 'Section verticale du disque unité : les extrémités sont sur le cercle')
    # repère orthonormé : même échelle en x et en y
    ech = 316 / 2.45
    R = Repere(-1.45, -1.45 + 400 / ech, -1.2, 1.25, 40, 12, 400, 316)
    S.fleche(R(-1.35, 0), R(1.45, 0), 'g'); S.texte(R(1.45, 0) + [8, 12], 'y′', 'g', ancre='start')
    S.fleche(R(0, -1.15), R(0, 1.2), 'g'); S.texte(R(0, 1.2) + [10, 6], 's', 'g', ancre='start')
    t = np.linspace(0, 2 * math.pi, 361)
    S.poly(R(np.cos(t), np.sin(t)), 't', ferme=True, rempli='g', l=2.0)
    for z in (-0.75, -0.3, 0.8):
        b = math.sqrt(1 - z ** 2)
        S.ligne(R(z, -b), R(z, b), 'g', d=True)
    S.ligne(R(yp, -a), R(yp, a), 'r', l=2.6)
    S.point(R(yp, a), 'r', r=4.4); S.point(R(yp, -a), 'r', r=4.4)
    S.texte(R(yp, a) + [10, -8], '(y′, a)', 'r', ancre='start', taille=15)
    S.texte(R(yp, -a) + [10, 10], '(y′, −a)', 'r', ancre='start', taille=15)
    S.ligne(R(yp, 0) + [0, -3], R(yp, 0) + [0, 3], 'g')
    S.texte(R(yp, 0) + [8, 14], 'y′', 'r', ancre='start', taille=15)
    S.texte(R(-0.72, 0.72) + [-10, -6], 'S', 't', ancre='end')
    S.texte(R(-0.45, -0.3), 'B', 't')
    return S


@schema('ha-moyenne')
def ha_moyenne():
    # u = x² − y², disque de centre c = (0,6 ; 0,3), rayon 1 ; moyenne = u(c) = 0,27.
    cx, cy = 0.6, 0.3
    u = lambda x, y: x ** 2 - y ** 2
    # vérification de la moyenne par quadrature en coordonnées polaires
    rr = np.linspace(0, 1, 801)[:, None]; tt = np.linspace(-math.pi, math.pi, 1601)[None, :]
    for Rd in (0.5, 1.0):
        X = cx + Rd * rr * np.cos(tt); Y = cy + Rd * rr * np.sin(tt)
        I = np.trapezoid(np.trapezoid(u(X, Y) * rr, tt[0], axis=1), rr[:, 0]) / math.pi
        J = np.trapezoid(np.trapezoid((X ** 2 + Y ** 2) * rr, tt[0], axis=1), rr[:, 0]) / math.pi
        assert abs(I - 0.27) < 1e-5 and abs(J - (0.45 + Rd ** 2 / 2)) < 1e-5
    S = Schema(520, 290, 'Propriété de la moyenne pour x² − y², sous-harmonicité de x² + y²')
    e = 112.0
    P = lambda x, y: np.stack([20 + (np.asarray(x) - (cx - 1.08)) * e, 18 + ((cy + 1.08) - np.asarray(y)) * e], axis=-1)
    tc = np.linspace(0, 2 * math.pi, 361)
    S.poly(P(cx + np.cos(tc), cy + np.sin(tc)), 'b', ferme=True, rempli='b', l=2.0)
    dans = lambda x, y: (x - cx) ** 2 + (y - cy) ** 2 <= 1 + 1e-12
    def trace(xs, ys):
        m = dans(xs, ys)
        debut = None
        for i in range(len(xs) + 1):
            if i < len(xs) and m[i]:
                debut = i if debut is None else debut
            elif debut is not None:
                if i - debut > 1:
                    S.poly(P(xs[debut:i], ys[debut:i]), 'g')
                debut = None
    s = np.linspace(-1.6, 1.6, 1601)
    for c in (0.3, 0.9, 1.5, 2.1):
        for sg in (-1, 1):
            trace(sg * np.sqrt(c + s ** 2), s)
    for c in (0.3, 0.9):
        for sg in (-1, 1):
            trace(s, sg * np.sqrt(c + s ** 2))
    for sg in (-1, 1):
        trace(s, sg * s)
    S.point(P(cx, cy), 'r', r=4.6)
    S.texte(P(cx, cy) + [10, -10], 'u = 0,27', 'r', ancre='start', taille=15)
    # moyenne en fonction du rayon
    G = Repere(0, 1.3, 0, 1.35, 300, 18, 190, 236)
    S.fleche(G(0, 0), G(1.3, 0), 'g'); S.texte(G(1.3, 0) + [6, 14], 'R', 'g', ancre='start')
    S.fleche(G(0, 0), G(0, 1.35), 'g')
    Rs = np.linspace(0, 1.25, 200)
    S.poly(G(Rs, 0.27 + 0 * Rs), 'r', l=2.2)
    S.poly(G(Rs, 0.45 + Rs ** 2 / 2), 'b', l=2.2)
    S.texte(G(0, 0.27) + [-6, 0], '0,27', 'r', ancre='end', taille=14)
    S.texte(G(0, 0.45) + [-6, 0], '0,45', 'b', ancre='end', taille=14)
    S.texte(G(1.25, 0.27) + [0, -14], 'x² − y²', 'r', ancre='end', taille=15)
    S.texte(G(0.95, 0.45 + 0.95 ** 2 / 2) + [-8, -12], 'x² + y²', 'b', ancre='end', taille=15)
    return S


@schema('ch-noyau')
def ch_noyau():
    G = lambda t, x: np.exp(-x ** 2 / (4 * t)) / np.sqrt(4 * math.pi * t)
    X = np.linspace(-4, 4, 8001)
    cas = [(0.05, 'r'), (0.25, 'b'), (1.0, 'v')]
    pics = []
    for t, _ in cas:
        Xl = np.linspace(-20, 20, 40001)
        assert abs(np.trapezoid(G(t, Xl), Xl) - 1) < 1e-6
        d2 = (X ** 2 / (4 * t * t) - 1 / (2 * t)) * G(t, X)
        xi = math.sqrt(2 * t)
        assert abs((xi ** 2 / (4 * t * t) - 1 / (2 * t))) < 1e-12
        assert np.all(d2[np.abs(X) < xi - 1e-3] < 0) and np.all(d2[np.abs(X) > xi + 1e-3] > 0)
        pics.append(G(t, 0.0))
    assert [round(p, 2) for p in pics] == [1.26, 0.56, 0.28]
    S = Schema(520, 300, 'Le noyau de la chaleur aux instants 0,05, 0,25 et 1')
    R = Repere(-4.2, 4.2, -0.08, 1.38, 20, 10, 476, 270)
    S.fleche(R(-4.2, 0), R(4.2, 0), 'g'); S.texte(R(4.2, 0) + [-4, 16], 'x', 'g', ancre='end')
    S.fleche(R(0, -0.08), R(0, 1.38), 'g')
    for (t, c), p in zip(cas, pics):
        S.poly(R(X, G(t, X)), c, l=2.1)
        xi = math.sqrt(2 * t)
        for s in (-1, 1):
            S.point(R(s * xi, G(t, xi)), c, r=3.6)
    S.texte(R(0, pics[0]) + [14, 2], 't = 0,05', 'r', ancre='start', taille=15)
    S.texte(R(0.75, pics[1]) + [6, -8], 't = 0,25', 'b', ancre='start', taille=15)
    S.texte(R(2.1, G(1.0, 2.1)) + [6, -14], 't = 1', 'v', ancre='start', taille=15)
    for x in (-2, 2):
        S.ligne(R(x, 0) + [0, -3], R(x, 0) + [0, 3], 'g')
        S.texte(R(x, 0) + [0, 16], '−2' if x < 0 else '2', 'g', taille=14)
    return S


@schema('ch-maximum')
def ch_maximum():
    S = Schema(480, 290, 'Le bord parabolique du rectangle [0, T] × [a, b]')
    x0, y0, L, H = 90, 52, 320, 186
    bas_g, bas_d = np.array([x0, y0 + H]), np.array([x0 + L, y0 + H])
    haut_g, haut_d = np.array([x0, y0]), np.array([x0 + L, y0])
    assert bas_g[1] > haut_g[1]                       # le temps croît vers le haut de la figure
    S.rect(x0, y0, L, H, 'g', rempli='g')
    S.fleche(bas_g, bas_g + [0, -H - 30], 'g')
    S.texte(bas_g + [0, -H - 42], 't', 'g')
    S.fleche(bas_d, bas_d + [40, 0], 'g')
    S.texte(bas_d + [50, 0], 'x', 'g', ancre='start')
    S.ligne(haut_g, haut_d, 'g', d=True, l=2.0)
    gamma = [haut_g, bas_g, bas_d, haut_d]
    # Γ = côté t = 0 et côtés x = a, x = b ; le côté t = T (y = y0) n'en fait pas partie
    cotes = list(zip(gamma, gamma[1:]))
    assert len(cotes) == 3 and all(p[1] > y0 or q[1] > y0 for p, q in cotes)
    assert not any(p[1] == y0 and q[1] == y0 for p, q in cotes)
    assert any(p[1] == y0 + H and q[1] == y0 + H for p, q in cotes)
    S.poly(gamma, 'r', l=3.0)
    S.texte(bas_g + [0, 18], 'a', 'g'); S.texte(bas_d + [0, 18], 'b', 'g')
    S.texte(bas_g + [-12, 0], '0', 'g', ancre='end'); S.texte(haut_g + [-12, 0], 'T', 'g', ancre='end')
    S.texte((bas_g + bas_d) / 2 + [0, 18], 'u(0, x) donné', 'r', ui=True, taille=13)
    S.texte(bas_g + [-14, -H / 2], 'Γ', 'r', ancre='end')
    S.texte(bas_d + [14, -H / 2], 'Γ', 'r', ancre='start')
    S.texte((haut_g + haut_d) / 2 + [0, -14], 'hors de Γ', 'g', ui=True, taille=13)
    S.texte((bas_g + haut_d) / 2, 'Q', 't')
    return S
