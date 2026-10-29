"""Schémas du graphe derham (théorème de de Rham en degré 1)."""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


def _theta(x):
    x = np.asarray(x, float)
    return np.where(x > 0, np.exp(-1 / np.where(x > 0, x, 1)), 0.0)


@schema('dr-plateau')
def dr_plateau():
    # à gauche θ(x) = e^{-1/x} (x > 0), 0 sinon ; point d'inflexion en 1/2 (P_2(u) = u³(u − 2)).
    # à droite ψ_{0,1}(t) = θ(1 − t²) : > 0 sur ]−1, 1[, nulle ailleurs, maximum θ(1) en 0.
    d2 = lambda x: (x ** -4 - 2 * x ** -3) * np.exp(-1 / x)
    assert abs(d2(0.5)) < 1e-12 and d2(0.4) > 0 and d2(0.6) < 0
    assert _theta(-0.5) == 0 and _theta(0) == 0 and abs(_theta(1) - 0.36788) < 1e-5
    ts = np.linspace(-1.6, 1.6, 641)
    ps = _theta(1 - ts ** 2)
    assert np.all(ps[np.abs(ts) >= 1] == 0) and np.all(ps[np.abs(ts) < 1] > 0)
    assert abs(ps.max() - _theta(1)) < 1e-12 and ts[ps.argmax()] == 0
    S = Schema(520, 230, 'La fonction θ, plate en 0, et la fonction plateau θ(1 − t²)')
    R = Repere(-1.0, 3.0, -0.08, 0.8, 24, 18, 250, 180)
    S.fleche(R(-1.0, 0), R(3.0, 0), 'g'); S.texte(R(3.0, 0) + [6, 12], 'x', 'g', ancre='start')
    S.fleche(R(0, -0.08), R(0, 0.8), 'g')
    S.ligne(R(-1.0, 0), R(0, 0), 't', l=2.2)
    R.graphe(S, _theta, 0, 3.0, 't', l=2.2)
    S.point(R(0.5, float(_theta(0.5))), 'r', r=4.2)
    S.ligne(R(0.5, 0), R(0.5, float(_theta(0.5))), 'r', d=True)
    S.texte(R(0.5, 0) + [0, 16], '1/2', 'r', taille=15)
    S.texte(R(2.3, float(_theta(2.3))) + [0, -16], 'θ', 't', taille=17)
    S.texte(R(0, 0) + [-6, 14], '0', 'g', ancre='end', taille=15)
    Q = Repere(-1.6, 1.6, -0.08, 0.8, 300, 18, 200, 180)
    S.fleche(Q(-1.6, 0), Q(1.6, 0), 'g'); S.texte(Q(1.6, 0) + [6, 12], 't', 'g', ancre='start')
    S.fleche(Q(0, -0.08), Q(0, 0.8), 'g')
    S.poly(Q(ts, ps), 'b', l=2.2)
    S.surface(np.vstack([Q(ts[np.abs(ts) <= 1], ps[np.abs(ts) <= 1])]), 'b')
    for s_ in (-1, 1):
        S.texte(Q(s_, 0) + [0, 15], '−1' if s_ < 0 else '1', 'b', taille=15)
    S.texte(Q(0, float(_theta(1))) + [10, -14], 'ψ', 'b', ancre='start', taille=17)
    return S


@schema('dr-cocycle')
def dr_cocycle():
    # U = R² ∖ {0}, δ(p) = min(1, ‖p‖∞) ; cubes k = 0 : centres dans (1/16)Z², rayon 1/8,
    # condition 1/4 ≤ δ(p) ≤ 2. Anneau ‖p‖∞ = 6/16, pas 3/16.
    from fractions import Fraction as Fr
    h = Fr(3, 16); c = Fr(6, 16); r = Fr(1, 8)
    def dans_I(p):
        dl = min(Fr(1), max(abs(p[0]), abs(p[1])))
        return Fr(1, 4) <= dl <= 2 and all((16 * q).denominator == 1 for q in p)
    haut = [(c, 0), (c, h), (c, c), (h, c), (0, c), (-h, c), (-c, c), (-c, h)]
    bas = [(c, 0), (c, -h), (c, -c), (h, -c), (0, -c), (-h, -c), (-c, -c), (-c, -h), (-c, 0)]
    tous = set(haut) | set(bas)
    assert len(tous) == 16 and all(dans_I(p) for p in tous)
    for ch in (haut, bas):
        for a, b in zip(ch, ch[1:]):
            assert max(abs(a[0] - b[0]), abs(a[1] - b[1])) < 2 * r        # cubes voisins sécants
    pi_, pj = haut[-1], bas[-1]
    x = (-c + Fr(1, 16), Fr(3, 32))
    for p in (pi_, pj):
        assert max(abs(x[0] - p[0]), abs(x[1] - p[1])) < r                 # x ∈ B_i ∩ B_j
    for p in tous:
        assert max(abs(p[0]), abs(p[1])) - r > 0                           # aucun cube ne contient 0
    # indice du lacet : chaîne haute, [p_i, x], [x, p_j], chaîne basse à rebours
    lacet = [np.array(q, float) for q in haut + [x] + bas[::-1]]
    tour = sum(np.arctan2(u[0] * v[1] - u[1] * v[0], u @ v) for u, v in zip(lacet, lacet[1:]))
    assert abs(tour / (2 * np.pi) - 1) < 1e-12
    S = Schema(480, 440, 'Deux chaînes de cubes autour de l’origine et le lacet qui définit a_ij')
    e = 380.0
    P = lambda q: np.array([240 + float(q[0]) * e, 220 - float(q[1]) * e])
    rr = float(r) * e
    for q in sorted(tous):
        if q in ((c, 0), pi_, pj):
            continue
        S.rect(P(q)[0] - rr, P(q)[1] - rr, 2 * rr, 2 * rr, 'g')
    S.rect(P((c, 0))[0] - rr, P((c, 0))[1] - rr, 2 * rr, 2 * rr, 't', rempli='g')
    S.rect(P(pi_)[0] - rr, P(pi_)[1] - rr, 2 * rr, 2 * rr, 'b', rempli='b')
    S.rect(P(pj)[0] - rr, P(pj)[1] - rr, 2 * rr, 2 * rr, 'v', rempli='v')
    S.poly([P(q) for q in haut], 'b', l=2.2)
    S.poly([P(q) for q in bas], 'v', l=2.2)
    for ch, col in ((haut, 'b'), (bas, 'v')):
        for q in ch:
            S.point(P(q), col, r=3.2)
    S.ligne(P(pi_), P(x), 'r', l=2.4)
    S.ligne(P(pj), P(x), 'r', l=2.4)
    S.point(P(x), 'r', r=4.6)
    S.texte(P(x) + [12, 0], 'x', 'r', ancre='start')
    S.point(P((0, 0)), 'g', r=4.5, creux=True)
    S.texte(P((0, 0)) + [0, 18], '0', 'g')
    S.texte(P((c, 0)) + [12, 16], 'p_b', 't', ancre='start')
    S.texte(P(pi_) + [-rr - 6, -rr + 4], 'B_i', 'b', ancre='end')
    S.texte(P(pj) + [-rr - 6, rr - 4], 'B_j', 'v', ancre='end')
    return S


@schema('dr-homotopie')
def dr_homotopie():
    # carré [0, 1]² découpé en N × N petits carrés ; segments intérieurs en gris, bord en rouge ;
    # un petit carré mis en évidence avec son orientation directe.
    N = 4
    S = Schema(420, 300, 'Découpage du carré : les segments intérieurs se compensent, il reste le bord')
    x0, y0, c = 60, 30, 240
    P = lambda u, v: np.array([x0 + u * c, y0 + (1 - v) * c])
    for k in range(1, N):
        S.ligne(P(k / N, 0), P(k / N, 1), 'g')
        S.ligne(P(0, k / N), P(1, k / N), 'g')
    bord = [P(0, 0), P(1, 0), P(1, 1), P(0, 1)]
    S.poly(bord, 'r', ferme=True, l=2.4)
    # flèches d'orientation du bord
    S.pointe(P(0.5, 0), (1, 0), 'r', taille=11, largeur=5)
    S.pointe(P(1, 0.5), (0, -1), 'r', taille=11, largeur=5)
    S.pointe(P(0.5, 1), (-1, 0), 'r', taille=11, largeur=5)
    S.pointe(P(0, 0.5), (0, 1), 'r', taille=11, largeur=5)
    # un petit carré Q_{23}, parcouru dans le sens direct
    j, k = 2, 3
    a, b = (j - 1) / N, (k - 1) / N
    q = [P(a, b), P(a + 1 / N, b), P(a + 1 / N, b + 1 / N), P(a, b + 1 / N)]
    S.poly(q, 'b', ferme=True, rempli='b', l=1.8)
    m = 0.5 / N
    S.pointe(P(a + m, b), (1, 0), 'b', taille=9, largeur=4)
    S.pointe(P(a + 1 / N, b + m), (0, -1), 'b', taille=9, largeur=4)
    S.pointe(P(a + m, b + 1 / N), (-1, 0), 'b', taille=9, largeur=4)
    S.pointe(P(a, b + m), (0, 1), 'b', taille=9, largeur=4)
    S.texte(P(a + m, b + m), 'Q', 'b', taille=16)
    S.texte(P(0.5, 0) + [0, 22], 'β', 'r', taille=17)
    S.texte(P(1, 0.5) + [16, 0], 'ρ', 'r', ancre='start', taille=17)
    S.texte(P(0.5, 1) + [0, -16], 'θ', 'r', taille=17)
    S.texte(P(0, 0.5) + [-16, 0], 'λ', 'r', ancre='end', taille=17)
    S.texte(P(1, 1) + [56, 30], 'H', 't', taille=17)
    S.fleche(P(1, 1) + [24, 40], P(1, 1) + [96, 40], 't', l=1.4)
    S.texte(P(1, 1) + [64, 64], 'vers U', 't', ui=True, taille=13)
    return S


@schema('dr-chaines')
def dr_chaines():
    # H(s, t) = (1 − s, s(1 − t), st) : carré → triangle Δ₂ ; images des côtés.
    def H(s, t):
        return np.array([1 - s, s * (1 - t), s * t])
    for s_ in np.linspace(0, 1, 11):
        for t_ in np.linspace(0, 1, 11):
            v = H(s_, t_)
            assert min(v) >= -1e-12 and abs(sum(v) - 1) < 1e-12
    assert np.allclose(H(0.3, 0), [0.7, 0.3, 0]) and np.allclose(H(1, 0.4), [0, 0.6, 0.4])
    assert np.allclose(H(0.3, 1), [0.7, 0, 0.3]) and np.allclose(H(0, 0.5), [1, 0, 0])
    S = Schema(590, 270, 'Le carré envoyé sur le triangle Δ₂ par (s, t) ↦ (1 − s, s(1 − t), st)')
    x0, y0, c = 70, 40, 170
    P = lambda u, v: np.array([x0 + u * c, y0 + (1 - v) * c])
    cols = {'b': 'v', 'd': 'b', 'h': 'r', 'g': 'o'}
    S.ligne(P(0, 0), P(1, 0), cols['b'], l=3); S.pointe(P(0.55, 0), (1, 0), cols['b'], taille=10, largeur=5)
    S.ligne(P(1, 0), P(1, 1), cols['d'], l=3); S.pointe(P(1, 0.55), (0, -1), cols['d'], taille=10, largeur=5)
    S.ligne(P(0, 1), P(1, 1), cols['h'], l=3); S.pointe(P(0.55, 1), (1, 0), cols['h'], taille=10, largeur=5)
    S.ligne(P(0, 0), P(0, 1), cols['g'], l=3)
    S.texte(P(0.5, 0) + [0, 20], 't = 0', cols['b'], taille=14)
    S.texte(P(1, 0.5) + [10, 0], 's = 1', cols['d'], ancre='start', taille=14)
    S.texte(P(0.5, 1) + [0, -16], 't = 1', cols['h'], taille=14)
    S.texte(P(0, 0.5) + [-10, 0], 's = 0', cols['g'], ancre='end', taille=14)
    # triangle : e0 en bas à gauche, e1 en bas à droite, e2 en haut
    X0, Y0, C = 350, 40, 200
    E = {0: np.array([X0, Y0 + C * 0.85]), 1: np.array([X0 + C, Y0 + C * 0.85]), 2: np.array([X0 + C / 2, Y0])}
    def T(v):
        return v[0] * E[0] + v[1] * E[1] + v[2] * E[2]
    S.ligne(T(H(0, 0)), T(H(1, 0)), cols['b'], l=3); S.pointe((E[0] + E[1]) / 2 + [8, 0], (1, 0), cols['b'], taille=10, largeur=5)
    S.ligne(T(H(1, 0)), T(H(1, 1)), cols['d'], l=3)
    u = (E[2] - E[1]) / np.linalg.norm(E[2] - E[1]); S.pointe((E[1] + E[2]) / 2 + 8 * u, u, cols['d'], taille=10, largeur=5)
    S.ligne(T(H(0, 1)), T(H(1, 1)), cols['h'], l=3)
    w = (E[2] - E[0]) / np.linalg.norm(E[2] - E[0]); S.pointe((E[0] + E[2]) / 2 + 8 * w, w, cols['h'], taille=10, largeur=5)
    S.point(E[0], cols['g'], r=6)
    for i, d in ((0, [-12, 14]), (1, [12, 14]), (2, [0, -16])):
        S.texte(E[i] + d, f'e_{i}', 't', ancre='end' if i == 0 else ('start' if i == 1 else 'middle'), taille=16)
    S.fleche(P(1, 0.5) + [62, 0], [X0 - 16, Y0 + C * 0.45], 't', l=1.4)
    S.texte([(P(1, 0.5)[0] + 62 + X0 - 16) / 2, Y0 + C * 0.45 - 16], 'H', 't', taille=16)
    return S
