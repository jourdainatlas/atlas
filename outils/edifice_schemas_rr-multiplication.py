"""Schémas du graphe rr-multiplication (produit des coupures de Dedekind, ℝ corps ordonné).

Toute position est calculée ; toute affirmation illustrée est vérifiée par un assert, sur des
rationnels exacts (fractions) lorsqu'il s'agit d'appartenance à une coupure.
"""
import math
from fractions import Fraction as Fr

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, courbe_entre


def _epais(S, p, q, c='t', l=5, d=False):
    """Trait épais (style en ligne : la feuille du gabarit fixe stroke-width par classe)."""
    cls = f's-{c}' + (' d' if d else '')
    S.el.append(f'<line class="{cls}" style="stroke-width:{l}px" x1="{p[0]:.1f}" y1="{p[1]:.1f}" '
                f'x2="{q[0]:.1f}" y2="{q[1]:.1f}"/>')


def _gamma(x):
    """La coupure Γ = {x ∈ ℚ : x ⩽ 0 ou x² < 2}."""
    return x <= 0 or x * x < 2


# ================================================================ rm-positives
@schema('rm-positives')
def rm_positives():
    z = Fr(1)
    c, d = Fr(6, 5), Fr(13, 10)
    # (c, d) ∈ Γ₊ × Γ₊, cd > z, et le point (c, z/c) est dans Γ₊ × Γ₊, sur l'hyperbole, sous (c, d)
    assert _gamma(c) and _gamma(d) and c >= 0 and d >= 0
    assert c * d > z
    w = z / c
    assert 0 <= w < d and _gamma(w) and c * w == z
    s2 = math.sqrt(2)

    S = Schema(500, 400, 'Produit de deux coupures positives : z < cd entraîne z = c · (z/c)')
    R = Repere(-0.16, 1.82, -0.14, 1.78, 44, 36, 410, 336)
    # rectangle Γ₊ × Γ₊ = [0, √2[², ouvert en haut et à droite
    coins = [R(0, 0), R(s2, 0), R(s2, s2), R(0, s2)]
    S.surface(coins, 'b')
    S.ligne(R(s2, 0), R(s2, s2), 'b', d=True)
    S.ligne(R(0, s2), R(s2, s2), 'b', d=True)
    R.axes(S, nx='c', ny='d')
    for t, lab in [(s2, '√2')]:
        S.ligne(R(t, 0) + [0, -5], R(t, 0) + [0, 5], 'g')
        S.texte(R(t, 0) + [0, 20], lab, 'b', taille=16)
        S.ligne(R(0, t) + [-5, 0], R(0, t) + [5, 0], 'g')
        S.texte(R(0, t) + [-10, 0], lab, 'b', ancre='end', taille=16)
    S.texte(R(0.0, 0) + [-10, 16], '0', 'g', taille=15)
    S.texte(R(0.30, 1.22), 'Γ_+ × Γ_+', 'b', ancre='start', taille=17)
    # hyperbole xy = z
    xs = np.linspace(float(z) / 1.70, 1.74, 300)
    S.poly(R(xs, float(z) / xs), 'r', l=2.2)
    S.texte(R(float(z) / 1.70, 1.70) + [12, 0], 'cd = z', 'r', ancre='start', taille=16)
    # verticale c, points (c, d) et (c, z/c)
    S.ligne(R(float(c), 0), R(float(c), float(d)), 'g', d=True)
    S.ligne(R(0, float(w)), R(float(c), float(w)), 'g', d=True)
    S.point(R(float(c), float(d)), 't', r=4.6)
    S.texte(R(float(c), float(d)) + [-10, -12], '(c, d)', 't', ancre='end', taille=16)
    S.point(R(float(c), float(w)), 'r', r=5)
    S.texte(R(float(c), float(w)) + [-10, 20], '(c, z/c)', 'r', ancre='end', taille=16)
    S.ligne(R(float(c), 0) + [0, -5], R(float(c), 0) + [0, 5], 'g')
    S.texte(R(float(c), 0) + [0, 20], 'c', taille=16)
    S.ligne(R(0, float(w)) + [-5, 0], R(0, float(w)) + [5, 0], 'g')
    S.texte(R(0, float(w)) + [-10, 0], 'z/c', 'r', ancre='end', taille=16)
    return S


# ================================================================ rm-inverse
@schema('rm-inverse')
def rm_inverse():
    q = Fr(2)
    C = lambda x: x < q                                  # C = 2*

    def sans_r(x):                                     # {x > 0 : 1/x ∉ C} ∪ {x ⩽ 0}
        return x <= 0 or not C(1 / x)

    def inverse(x):                                    # C⁻¹, r parcourant 1 + 1/m
        return x <= 0 or any(not C(1 / ((1 + Fr(1, m)) * x)) for m in range(1, 3000))
    demi = Fr(1, 2)
    for x in [Fr(-1), Fr(0), Fr(1, 4), demi - Fr(1, 1000), demi, demi + Fr(1, 1000), Fr(1)]:
        assert sans_r(x) == (x <= demi)                 # ]←, 1/2] : 1/2 en est le plus grand élément
        assert inverse(x) == (x < demi)                 # C⁻¹ = (1/2)*
    # flèches x ↦ 1/x, du complémentaire de C vers ]0, 1/2]
    images = [(Fr(2), Fr(1, 2)), (Fr(5, 2), Fr(2, 5)), (Fr(3), Fr(1, 3))]
    for u, v in images:
        assert not C(u) and v == 1 / u and sans_r(v)

    X = lambda t: 34 + (float(t) + 0.7) * 104
    S = Schema(520, 300, 'Inverse de C = 2* : sans le facteur r, 1/2 serait un plus grand élément')
    lignes = [56, 160, 252]
    for y in lignes:
        S.fleche((X(-0.7), y), (X(3.6), y), 'g')
        S.ligne((X(0), y - 5), (X(0), y + 5), 'g')
        S.texte((X(0), y + 22), '0', 'g', taille=16)
    # C = 2*
    y = lignes[0]
    _epais(S, (X(-0.7), y), (X(q) - 6, y), 'b', 5)
    _epais(S, (X(q) + 6, y), (X(3.5), y), 'g', 3, d=True)
    S.point((X(q), y), 'b', r=5, creux=True)
    S.texte((X(q), y - 22), '2', 'b', taille=17)
    S.texte((X(-0.7), y - 22), 'C = 2^*', 'b', ancre='start', taille=17)
    S.texte((X(3.0), y - 20), 'x ∉ C', 'g', taille=17)
    # {x > 0 : 1/x ∉ C} = ]0, 1/2]
    y = lignes[1]
    _epais(S, (X(-0.7), y), (X(demi), y), 'g', 5)
    S.point((X(demi), y), 'g', r=5.5)
    S.texte((X(demi), y + 22), '1/2', 'g', taille=17)
    S.texte((X(1.0), y - 13), 'plus grand élément 1/2', 'g', ancre='start', ui=True, taille=14)
    S.texte((X(1.0), y + 15), 'sans le facteur r', 'g', ancre='start', ui=True, taille=14)
    for u, v in images:
        S.courbe_fleche(courbe_entre((X(u), lignes[0] + 8), (X(v), y - 9), 0.12), 'g')
    S.texte((X(0.15), (lignes[0] + y) / 2 + 4), 'x ↦ 1/x', 'g', taille=17)
    # C⁻¹ = (1/2)*
    y = lignes[2]
    _epais(S, (X(-0.7), y), (X(demi) - 6, y), 'r', 5)
    S.point((X(demi), y), 'r', r=5, creux=True)
    S.texte((X(demi), y + 22), '1/2', 'r', taille=17)
    S.texte((X(-0.7), y - 22), 'C^{−1} = (1/2)^*', 'r', ancre='start', taille=17)
    return S


# ================================================================ rm-corps
@schema('rm-corps')
def rm_corps():
    # en haut : D = 3, E = −1 ; en bas : D = 1, E = −3 (des coupures rationnelles, lues sur l'ordre)
    D1, E1 = Fr(3), Fr(-1)
    G, F1 = D1 + E1, -E1
    assert D1 >= 0 and E1 < 0 and G >= 0 and D1 == G + F1
    D2, E2 = Fr(1), Fr(-3)
    H, F2 = -(D2 + E2), -E2
    assert D2 >= 0 and E2 < 0 and D2 + E2 < 0 and H >= 0 and F2 == H + D2

    X = lambda t: 260 + float(t) * 62
    S = Schema(520, 270, 'Distributivité, cas mixte : D = G + F, ou F = H + D')
    for y0, D, E in [(78, D1, E1), (214, D2, E2)]:
        S.fleche((X(-3.9), y0), (X(3.9), y0), 'g')
        for t, lab, c in [(E, 'E', 'g'), (0, '0', 'g'), (D, 'D', 'v')]:
            S.ligne((X(t), y0 - 5), (X(t), y0 + 5), 'g')
            S.texte((X(t), y0 + 22), lab, c, taille=17)
        S.point((X(D + E), y0), 'r', r=4.6)
    S.texte((X(D1 + E1), 78 + 22), 'G = D + E', 'r', taille=17)
    S.texte((X(D2 + E2), 214 + 22), 'D + E', 'r', taille=17)
    # haut : [0, D] = [0, G] ∪ [G, D], de longueurs G et F
    y = 78
    _epais(S, (X(0), y - 16), (X(G), y - 16), 'r', 4)
    _epais(S, (X(G), y - 16), (X(D1), y - 16), 'b', 4)
    S.texte(((X(0) + X(G)) / 2, y - 34), 'G', 'r', taille=18)
    S.texte(((X(G) + X(D1)) / 2, y - 34), 'F', 'b', taille=18)
    _epais(S, (X(E1), y - 16), (X(0), y - 16), 'b', 2, d=True)
    S.texte(((X(E1) + X(0)) / 2, y - 34), 'F', 'b', taille=18)
    # bas : [E, 0] = [E, D + E] ∪ [D + E, 0], de longueurs D et H
    y = 214
    _epais(S, (X(E2), y - 16), (X(D2 + E2), y - 16), 'v', 4)
    _epais(S, (X(D2 + E2), y - 16), (X(0), y - 16), 'r', 4)
    S.texte(((X(E2) + X(D2 + E2)) / 2, y - 34), 'D', 'v', taille=18)
    S.texte(((X(D2 + E2) + X(0)) / 2, y - 34), 'H', 'r', taille=18)
    _epais(S, (X(0), y - 16), (X(D2), y - 16), 'v', 2, d=True)
    S.texte(((X(0) + X(D2)) / 2, y - 34), 'D', 'v', taille=18)
    return S
