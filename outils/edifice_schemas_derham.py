"""Schémas du graphe derham (théorème de de Rham en degré 1)."""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema


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
