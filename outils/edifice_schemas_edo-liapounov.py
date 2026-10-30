"""Schémas du chapitre « Stabilité des équilibres » (graphe edo-liapounov) : équilibre attractif instable,
trajectoires d'un système linéaire stable, mécanisme de la preuve du théorème de Liapounov, ellipses d'une
fonction de Liapounov quadratique, portrait de phase du pendule amorti. Toutes les trajectoires sont
calculées par une formule close ou par intégration numérique (scipy, tolérances 1e-10), jamais estimées."""
import math

import numpy as np
from scipy.integrate import solve_ivp
from edifice_schemas import schema
from edifice_svg import Schema, Repere

TOL = dict(rtol=1e-10, atol=1e-12, dense_output=True)


def _champ_polaire(t, z):
    # r' = r(1 − r), θ' = 1 − cos θ, écrit en coordonnées cartésiennes sur ℝ² privé de 0
    x, y = z
    r = math.hypot(x, y)
    return [x * (1 - r) - y * (1 - x / r), y * (1 - r) + x * (1 - x / r)]


def _polaire_exacte(r0, th0, t):
    # r(t) = 1/(1 + (1/r0 − 1)e^{−t}) ; cot(θ/2) décroît de 1 par unité de temps (θ0 ∈ ]0, 2π[)
    r = 1 / (1 + (1 / r0 - 1) * np.exp(-t))
    c = 1 / math.tan(th0 / 2) - t
    th = 2 * (np.pi / 2 - np.arctan(c))            # arccot à valeurs dans ]0, π[
    return r * np.cos(th), r * np.sin(th)


@schema('ly-equilibres')
def ly_equilibres():
    # Vérification des formules polaires sur le champ cartésien
    for r0, th0 in [(1.0, 0.25), (0.35, 1.3)]:
        s = solve_ivp(_champ_polaire, (0, 40), [r0 * math.cos(th0), r0 * math.sin(th0)], **TOL)
        tt = np.linspace(0, 40, 801)
        xe, ye = _polaire_exacte(r0, th0, tt)
        assert np.allclose(s.sol(tt), [xe, ye], atol=1e-7)
    S = Schema(520, 330, 'Un équilibre attractif mais instable : r′ = r(1 − r), θ′ = 1 − cos θ')
    R = Repere(-1.75, 1.75, -1.12, 1.12, 40, 14, 440, 440 * 2.24 / 3.5)
    a = np.array([1.0, 0.0])
    S.ligne(R(-1.75, 0), R(1.75, 0), 'g')
    S.ligne(R(0, -1.12), R(0, 1.12), 'g')
    S.point(R(0, 0), 'g', r=3.6, creux=True)
    S.texte(R(0, 0) + [-8, 14], '0', 'g', ancre='end', taille=15)
    # boule de rayon δ autour de a
    delta = 0.3
    ech = R(1, 0)[0] - R(0, 0)[0]
    assert abs((R(0, 1)[1] - R(0, 0)[1]) + ech) < 1e-9          # repère orthonormé
    S.cercle(R(*a), delta * ech, 'g', d=True)
    # trajectoire bleue : issue de x sur le cercle, à distance < δ de a
    th0 = 0.25
    x0 = np.array([math.cos(th0), math.sin(th0)])
    assert np.linalg.norm(x0 - a) < delta
    tt = np.concatenate([np.linspace(0, 20, 2000), np.linspace(20, 2000, 1000)[1:]])
    xb, yb = _polaire_exacte(1.0, th0, tt)
    dist = np.hypot(xb - 1, yb)
    assert dist.max() > 1.999 and dist[-1] < 0.01                 # passe à distance 2 de a, puis y revient
    k = np.argmax(dist)
    assert abs(xb[k] + 1) < 1e-3 and abs(yb[k]) < 0.05          # le point le plus éloigné est (−1, 0)
    S.courbe_fleche(R(xb[:1000], yb[:1000]), 'b', l=2.2)
    S.poly(R(xb[999:], yb[999:]), 'b', l=2.2)
    S.point(R(*x0), 'b', r=3.8)
    S.texte(R(*x0) + [10, -10], 'x', 'b', ancre='start', taille=17)
    S.point(R(-1, 0), 'b', r=3.2)
    S.texte(R(-1, 0) + [-10, -14], 'φ_t(x)', 'b', ancre='end', taille=15)
    # trajectoire verte : de l'intérieur, elle s'enroule vers le cercle et rejoint a par en dessous
    r1, th1 = 0.3, 2.2
    tg = np.linspace(0, 300, 4000)
    xg, yg = _polaire_exacte(r1, th1, tg)
    assert np.hypot(xg[-1] - 1, yg[-1]) < 0.01 and np.all(np.diff(np.unwrap(np.arctan2(yg, xg))) >= -1e-12)
    m = np.searchsorted(tg, 5.0)
    S.courbe_fleche(R(xg[:m], yg[:m]), 'v', l=1.8)
    S.poly(R(xg[m - 1:], yg[m - 1:]), 'v', l=1.8)
    S.point(R(xg[0], yg[0]), 'v', r=3.4)
    S.point(R(*a), 'r', r=4.6)
    S.texte(R(*a) + [12, 14], 'a', 'r', ancre='start', taille=17)
    S.texte(R(1.3, -0.26) + [0, 0], 'δ', 'g', ancre='start', taille=16)
    return S


A_LIN = np.array([[-0.5, 4.0], [-1.0, -0.5]])


def _sol_lin(t, y0):
    # e^{tA} = e^{−t/2} [[cos 2t, 2 sin 2t], [−½ sin 2t, cos 2t]]
    t = np.asarray(t, float)
    c, s = np.cos(2 * t), np.sin(2 * t)
    e = np.exp(-t / 2)
    return np.stack([e * (c * y0[0] + 2 * s * y0[1]), e * (-0.5 * s * y0[0] + c * y0[1])])


def _verifie_lin():
    from scipy.linalg import expm
    for t in (0.3, 0.62, 1.7, 4.0):
        for y0 in ([0, 1], [1, 0]):
            assert np.allclose(expm(t * A_LIN) @ y0, _sol_lin(t, y0))


@schema('ly-lineaire')
def ly_lineaire():
    _verifie_lin()
    ev = np.linalg.eigvals(A_LIN)
    assert np.allclose(sorted(ev.imag), [-2, 2]) and np.allclose(ev.real, -0.5)
    tt = np.linspace(0, 9, 3000)
    rouge = _sol_lin(tt, [0, 1])
    bleu = _sol_lin(tt, [1, 0])
    nr, nb = np.hypot(*rouge), np.hypot(*bleu)
    k = np.argmax(nr)
    assert abs(nr[k] - 1.4077) < 1e-3 and abs(tt[k] - 0.62) < 0.01     # sortie du disque unité
    assert nb.max() <= 1 + 1e-12                                       # la solution bleue y reste
    S = Schema(500, 330, 'Deux solutions de y′ = Ay, valeurs propres −1/2 ± 2i, issues du cercle unité')
    R = Repere(-1.65, 1.65, -1.1, 1.3, 40, 12, 420, 420 * 2.4 / 3.3)
    ech = R(1, 0)[0] - R(0, 0)[0]
    assert abs((R(0, 1)[1] - R(0, 0)[1]) + ech) < 1e-9
    S.fleche(R(-1.65, 0), R(1.65, 0), 'g')
    S.fleche(R(0, -1.1), R(0, 1.3), 'g')
    S.texte(R(1.65, 0) + [4, 14], 'y_1', 'g', ancre='end', taille=15)
    S.texte(R(0, 1.3) + [8, 8], 'y_2', 'g', ancre='start', taille=15)
    S.cercle(R(0, 0), ech, 'g', d=True)
    m = 260
    S.courbe_fleche(R(*bleu[:, :m]), 'b', l=1.8)
    S.poly(R(*bleu[:, m - 1:]), 'b', l=1.8)
    S.courbe_fleche(R(*rouge[:, :120]), 'r', l=2.2)
    S.poly(R(*rouge[:, 119:]), 'r', l=2.2)
    S.point(R(0, 1), 'r', r=3.8)
    S.texte(R(0, 1) + [-10, -12], '(0, 1)', 'r', ancre='end', taille=15)
    S.point(R(1, 0), 'b', r=3.8)
    S.texte(R(1, 0) + [8, 16], '(1, 0)', 'b', ancre='start', taille=15)
    p = rouge[:, k]
    S.ligne(R(0, 0), R(*p), 'r', d=True)
    S.point(R(*p), 'r', r=3.4)
    S.texte(R(*p) + [10, 2], '1,41', 'r', ancre='start', taille=15)
    return S


P_LIN = np.array([[11, 3], [3, 41]]) / 17


@schema('ly-equation')
def ly_equation():
    _verifie_lin()
    assert np.allclose(A_LIN.T @ P_LIN + P_LIN @ A_LIN, -np.eye(2))
    V = lambda y: np.einsum('i...,ij,j...->...', y, P_LIN, y)
    tt = np.linspace(0, 9, 3000)
    rouge = _sol_lin(tt, [0, 1])
    vr = V(rouge)
    assert np.all(np.diff(vr) < 0)                                   # V décroît dès l'instant 0
    assert abs(vr[0] - 41 / 17) < 1e-12
    S = Schema(500, 330, 'Ellipses de niveau de V(y) = ᵗyPy et une solution qui les traverse vers l’intérieur')
    R = Repere(-2.05, 2.05, -1.12, 1.3, 20, 12, 470, 470 * 2.42 / 4.1)
    ech = R(1, 0)[0] - R(0, 0)[0]
    assert abs((R(0, 1)[1] - R(0, 0)[1]) + ech) < 1e-9
    S.fleche(R(-2.05, 0), R(2.05, 0), 'g')
    S.fleche(R(0, -1.12), R(0, 1.3), 'g')
    S.texte(R(2.05, 0) + [-2, -14], 'y_1', 'g', ancre='end', taille=15)
    S.texte(R(0, 1.3) + [8, 8], 'y_2', 'g', ancre='start', taille=15)
    S.cercle(R(0, 0), ech, 'g', d=True)
    th = np.linspace(0, 2 * np.pi, 400)
    u = np.stack([np.cos(th), np.sin(th)])
    for c, coul in [(41 / 17, 'b'), (1.2, 'g'), (0.6, 'g'), (0.25, 'g')]:
        ell = u * np.sqrt(c / V(u))                                  # V(ell) = c exactement
        assert np.allclose(V(ell), c)
        S.poly(R(*ell), coul, ferme=True, l=1.6 if coul == 'b' else None)
        # chaque ellipse est franchie une seule fois par la solution
        assert np.sum(np.diff(np.sign(vr - c)) != 0) <= 1
    S.courbe_fleche(R(*rouge[:, :120]), 'r', l=2.2)
    S.poly(R(*rouge[:, 119:]), 'r', l=2.2)
    S.point(R(0, 1), 'r', r=3.8)
    S.texte(R(0, 1) + [-10, -12], '(0, 1)', 'r', ancre='end', taille=15)
    ell = u * np.sqrt((41 / 17) / V(u))
    assert np.max(np.abs(ell[0])) < 2.0 and np.max(np.abs(ell[1])) < 1.1      # dans le cadre
    j = np.argmin(ell[1])
    S.texte(R(*ell[:, j]) + [40, 16], 'V = 41/17', 'b', ancre='start', taille=15)
    return S


@schema('ly-liapounov')
def ly_liapounov():
    # x′ = −y − x³, y′ = x − y³ ; V = x² + y², dV = −2(x⁴ + y⁴) ; norme ‖·‖∞, r = 1
    F = lambda t, z: [-z[1] - z[0] ** 3, z[0] - z[1] ** 3]
    r = 1.0
    bord = np.linspace(-r, r, 2001)
    carre = np.concatenate([np.stack([bord, np.full_like(bord, s)]) for s in (-r, r)]
                           + [np.stack([np.full_like(bord, s), bord]) for s in (-r, r)], axis=1)
    m = np.min(carre[0] ** 2 + carre[1] ** 2)
    assert abs(m - r ** 2) < 1e-12                                  # minimum de V sur la sphère : r²
    delta = r / math.sqrt(2)                                         # B∞(0, δ) ⊂ {V < m}
    assert 2 * delta ** 2 <= m + 1e-12
    x0 = np.array([0.68, 0.66])
    assert np.max(np.abs(x0)) < delta
    s = solve_ivp(F, (0, 14), x0, **TOL)
    tt = np.linspace(0, 14, 3000)
    z = s.sol(tt)
    v = z[0] ** 2 + z[1] ** 2
    assert np.all(np.diff(v) < 0) and np.max(np.abs(z)) < r       # reste dans la boule B∞(0, r)
    S = Schema(500, 330, 'Mécanisme de la preuve : la trajectoire ne peut pas franchir le niveau V = m')
    R = Repere(-1.3, 1.3, -1.12, 1.12, 90, 14, 330, 330 * 2.24 / 2.6)
    ech = R(1, 0)[0] - R(0, 0)[0]
    assert abs((R(0, 1)[1] - R(0, 0)[1]) + ech) < 1e-9
    S.ligne(R(-1.3, 0), R(1.3, 0), 'g')
    S.ligne(R(0, -1.12), R(0, 1.12), 'g')
    c0 = R(-r, r)
    S.rect(c0[0], c0[1], 2 * r * ech, 2 * r * ech, 't')
    S.cercle(R(0, 0), math.sqrt(m) * ech, 'r', d=True)
    c1 = R(-delta, delta)
    S.rect(c1[0], c1[1], 2 * delta * ech, 2 * delta * ech, 'b')
    S.courbe_fleche(R(*z[:, :500]), 'v', l=2.0)
    S.poly(R(*z[:, 499:]), 'v', l=2.0)
    S.point(R(*x0), 'v', r=3.6)
    S.texte(R(*x0) + [-6, 18], 'x', 'v', ancre='end', taille=17)
    S.point(R(0, 0), 't', r=3.6)
    S.texte(R(0, 0) + [-8, 16], 'a', 't', ancre='end', taille=17)
    S.texte(R(r, -r) + [8, -10], 'S(a, r)', 't', ancre='start', taille=15)
    S.texte(R(math.cos(-0.5), math.sin(-0.5)) + [10, 14], 'V = m', 'r', ancre='start', taille=15)
    S.texte(R(delta, delta) + [8, -10], 'B(a, δ)', 'b', ancre='start', taille=15)
    return S


@schema('ly-pendule')
def ly_pendule():
    k = 0.4
    F = lambda t, z: [z[1], -math.sin(z[0]) - k * z[1]]
    E = lambda th, v: v ** 2 / 2 + 1 - np.cos(th)
    S = Schema(520, 320, 'Portrait de phase du pendule amorti, k = 0,4, et lignes de niveau de l’énergie')
    R = Repere(-3.75, 3.75, -2.5, 2.5, 34, 14, 450, 280)
    S.fleche(R(-3.75, 0), R(3.75, 0), 'g')
    S.fleche(R(0, -2.5), R(0, 2.5), 'g')
    S.texte(R(3.75, 0) + [2, 16], 'θ', 'g', ancre='end', taille=16)
    S.texte(R(0, 2.5) + [8, 6], 'v', 'g', ancre='start', taille=16)
    # lignes de niveau, exactes : v = ±√(2(c − 1 + cos θ))
    for c in (0.5, 1.0, 1.5):
        th_max = math.acos(1 - c)
        th = np.linspace(-th_max, th_max, 400)
        v = np.sqrt(np.maximum(2 * (c - 1 + np.cos(th)), 0))
        courbe = np.concatenate([np.stack([th, v]), np.stack([th[::-1], -v[::-1]])], axis=1)
        assert np.allclose(E(*courbe), c, atol=1e-9)
        S.poly(R(*courbe), 'g', ferme=True)
    th = np.linspace(-math.pi, math.pi, 400)
    sep = 2 * np.cos(th / 2)                                        # niveau E = 2, par (±π, 0)
    assert np.allclose(E(th, sep), 2)
    S.poly(R(th, sep), 't', d=True)
    S.poly(R(th, -sep), 't', d=True)
    for c in (2.8,):
        v = np.sqrt(2 * (c - 1 + np.cos(np.linspace(-3.75, 3.75, 400))))
        S.poly(R(np.linspace(-3.75, 3.75, 400), v), 'g')
        S.poly(R(np.linspace(-3.75, 3.75, 400), -v), 'g')
    # trajectoires amorties, l'énergie décroît strictement entre les instants où v = 0
    for x0, coul in [((-2.6, 0.0), 'r'), ((0.0, 2.2), 'b')]:
        assert E(*x0) < 2.5
        s = solve_ivp(F, (0, 45), x0, **TOL)
        tt = np.linspace(0, 45, 9000)
        z = s.sol(tt)
        e = E(*z)
        assert np.all(np.diff(e) <= 1e-12) and e[-1] < 1e-5           # Ė = −k v² ⩽ 0, convergence vers 0
        assert np.all(np.abs(z[0]) < math.pi)                         # reste dans ]−π, π[ × ℝ
        S.courbe_fleche(R(*z[:, :420]), coul, l=2.0)
        S.poly(R(*z[:, 419:]), coul, l=2.0)
        S.point(R(*x0), coul, r=3.6)
    assert E(-2.6, 0) < 2 and E(0, 2.2) > 2                          # la bleue part au-dessus du niveau 2
    for s_ in (-1, 1):
        S.point(R(s_ * math.pi, 0), 't', r=4.2, creux=True)
        S.texte(R(s_ * math.pi, 0) + [0, 18], '−π' if s_ < 0 else 'π', 't', taille=15)
    S.point(R(0, 0), 'r', r=4.2)
    S.texte(R(0, 0) + [-8, 16], '0', 'r', ancre='end', taille=15)
    S.texte(R(-2.6, 0) + [-6, -14], 'x', 'r', ancre='end', taille=16)
    S.texte(R(1.9, 2 * math.cos(0.95)) + [6, -12], 'E = 2', 't', ancre='start', taille=15)
    return S
