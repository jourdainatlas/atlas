"""Schémas du chapitre « Représentation conforme » (graphe anc-conforme) : lemme de Schwarz (cercles et leurs images),
application de Cayley (image d'une grille du demi-plan), plongement de Koebe par une racine carrée (plan fendu),
pas de Koebe sur le disque fendu. Toutes les courbes sont des images calculées point par point ; les cercles
annoncés dans les légendes sont vérifiés par assert."""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema


def phi(a, z):
    """Automorphisme du disque z ↦ (z − a)/(1 − ā z)."""
    return (z - a) / (1 - np.conj(a) * z)


def _repere(O, k):
    return lambda z: O + k * np.array([np.real(z), -np.imag(z)])


@schema('cf-schwarz')
def cf_schwarz():
    f = lambda z: z / (2 - z)
    t = np.linspace(0, 2 * np.pi, 4001)
    # f, injective, envoie 𝔻 dans 𝔻 (|2 − z| > 1 > |z|) et fixe 0 ; image d'un cercle |z| = r : un cercle
    zz = 0.999 * np.exp(1j * t)
    assert np.max(np.abs(f(zz))) < 1 and f(0) == 0
    for r in (0.3, 0.6, 0.9):          # cercle de diamètre [f(−r), f(r)]
        img = f(r * np.exp(1j * t)); a_, b_ = f(-r), f(r)
        assert np.max(np.abs(np.abs(img - (a_ + b_) / 2) - (b_ - a_) / 2)) < 1e-12
    assert abs((f(1e-7) - f(0)) / 1e-7 - 0.5) < 1e-6                    # f'(0) = 1/2
    k = 165
    O = np.array([205.0, 190.0])
    P = _repere(O, k)
    S = Schema(470, 380, 'Lemme de Schwarz : les cercles centrés en 0 et leurs images')
    S.fleche(P(-1.18), P(1.2), 'g')
    S.fleche(P(-1.12j), P(1.15j), 'g')
    S.cercle(O, k, 't')
    for r in (0.3, 0.6, 0.9):
        img = f(r * np.exp(1j * t))
        assert np.max(np.abs(img)) < r                                   # |f(z)| < |z| sur le cercle
        S.cercle(O, k * r, 'g', d=True)
        S.poly(np.array([P(z) for z in img]), 'r', l=1.8)
    S.point(O, 't', r=3.4)
    S.texte(O + [-9, 14], '0', ancre='end', taille=15)
    S.texte(P(1) + [8, 14], '1', ancre='start', taille=15)
    S.texte(P(np.exp(0.55j)) + [12, -2], '|z| = 1', ancre='start', taille=14)
    return S


@schema('cf-automorphismes')
def cf_automorphismes():
    C = lambda z: (z - 1j) / (z + 1j)
    cs = [0.5, 1.0, 2.0]
    ts = [-1.0, 0.0, 1.0]
    # images des droites horizontales : cercles de centre c/(1+c), de rayon 1/(1+c), tangents en 1
    x = np.tan(np.linspace(-1.5605, 1.5605, 3001)) * 1.0
    for c in cs:
        img = C(x + 1j * c)
        assert np.max(np.abs(np.abs(img - c / (1 + c)) - 1 / (1 + c))) < 1e-12
        assert np.max(np.abs(img)) < 1
    # images des verticales : arcs de cercles passant par 1, orthogonaux au cercle unité
    for t in ts:
        y = np.tan(np.linspace(1e-4, 1.5695, 3001))
        img = C(t + 1j * y)
        assert np.max(np.abs(img)) < 1 and abs(abs(C(t)) - 1) < 1e-12
        if t != 0:
            # cercle par 1 et C(t), centre sur la tangente en 1 : centre 1 + i·m, rayon |m|, orthogonal au cercle unité
            w0 = C(t)
            m = (abs(w0 - 1) ** 2) / (2 * np.imag(w0 - 1) * 1.0)
            ctr = 1 + 1j * m
            assert np.max(np.abs(np.abs(img - ctr) - abs(m))) < 1e-9
            assert abs(abs(ctr) ** 2 - (1 + m ** 2)) < 1e-12                 # orthogonalité : |ctr|² = 1 + r²
    # angles droits conservés aux points d'intersection
    for c in cs:
        for t in ts:
            z, h = t + 1j * c, 1e-6
            u, v = C(z + h) - C(z), C(z + 1j * h) - C(z)
            assert abs(np.real(u * np.conj(v))) < 1e-9 * abs(u) * abs(v) + 1e-15
    assert abs(C(1j)) < 1e-15
    S = Schema(540, 300, 'Application de Cayley : une grille du demi-plan et son image dans le disque')
    # demi-plan
    k1, O1 = 52.0, np.array([128.0, 238.0])
    P1 = _repere(O1, k1)
    S.surface([P1(-2.2), P1(2.2), P1(2.2 + 3.6j), P1(-2.2 + 3.6j)], 'g')
    S.fleche(P1(-2.25), P1(2.3), 'g')
    S.fleche(P1(-0.6j), P1(3.75j), 'g')
    for c in cs:
        S.ligne(P1(-2.2 + 1j * c), P1(2.2 + 1j * c), 'b', l=1.6)
    for t in ts:
        S.ligne(P1(t), P1(t + 3.6j), 'r', l=1.6)
    S.point(P1(1j), 't', r=3.8)
    S.texte(P1(1j) + [-8, -11], 'i', ancre='end', taille=15)
    S.texte(P1(0) + [-6, 14], '0', ancre='end', taille=14)
    S.texte(P1(1) + [0, 15], '1', taille=14)
    S.texte(P1(-1) + [0, 15], '−1', taille=14)
    # flèche C
    S.fleche(np.array([262.0, 135.0]), np.array([312.0, 135.0]), 't')
    S.texte(np.array([287.0, 118.0]), 'C', taille=17)
    # disque
    k2, O2 = 105.0, np.array([428.0, 140.0])
    P2 = _repere(O2, k2)
    S.cercle(O2, k2, 't')
    S.fleche(P2(-1.13), P2(1.17), 'g')
    S.fleche(P2(-1.12j), P2(1.15j), 'g')
    for c in cs:
        S.cercle(P2(c / (1 + c)), k2 / (1 + c), 'b')
    for t in ts:
        y = np.tan(np.linspace(1e-4, 1.5695, 800))
        S.poly(np.array([P2(z) for z in C(t + 1j * y)]), 'r', l=1.6)
    S.point(O2, 't', r=3.8)
    S.texte(O2 + [-8, 15], '0', ancre='end', taille=14)
    S.point(P2(1), 't', r=3.2)
    S.texte(P2(1) + [-6, 17], '1', ancre='end', taille=14)
    return S


@schema('cf-plongement')
def cf_plongement():
    s = np.sqrt(2) - 1
    h0 = lambda z: np.sqrt(z + 1 + 0j)                    # racine principale de z + 1, holomorphe hors de ]−∞, −1]
    assert abs(h0(1) - np.sqrt(2)) < 1e-15
    # échantillon de Ω = ℂ ∖ ]−∞, 0] (points au-dessus et au-dessous de la fente compris)
    X, Y = np.meshgrid(np.linspace(-6, 6, 601), np.linspace(-6, 6, 601))
    Z = (X + 1j * Y).ravel()
    Z = Z[~((np.abs(np.imag(Z)) < 1e-12) & (np.real(Z) <= 0))]
    Z = np.concatenate([Z, -np.linspace(0, 6, 400) + 1e-9j, -np.linspace(0, 6, 400) - 1e-9j])
    W = h0(Z)
    assert np.min(np.real(W)) >= 0 and np.min(np.abs(W + np.sqrt(2))) >= s - 1e-6   # D(−√2, s) évité
    # D(√2, s) est dans le demi-plan Re w > 0 privé de ]0, 1] : distance de √2 à {Re ≤ 0} ∪ [0, 1]
    assert abs(min(np.sqrt(2), np.sqrt(2) - 1) - s) < 1e-15
    S = Schema(540, 270, 'Plongement de Koebe : la racine carrée sépare h₀(Ω) et −h₀(Ω)')
    k1, O1 = 44.0, np.array([128.0, 135.0])
    P1 = _repere(O1, k1)
    S.surface([P1(-2.6 - 2.6j), P1(2.6 - 2.6j), P1(2.6 + 2.6j), P1(-2.6 + 2.6j)], 'g')
    S.fleche(P1(-2.7), P1(2.75), 'g')
    S.fleche(P1(-2.7j), P1(2.75j), 'g')
    S.ligne(P1(-2.6), P1(0), 'r', l=2.8)
    S.point(P1(1), 't', r=3.6)
    S.texte(P1(1) + [0, -13], 'a', taille=15)
    S.point(P1(-1), 'r', r=3.6)
    S.texte(P1(-1) + [0, -13], 'b', 'r', taille=15)
    S.texte(P1(1.6 + 1.9j), 'Ω', taille=17)
    S.fleche(np.array([258.0, 135.0]), np.array([300.0, 135.0]), 't')
    S.texte(np.array([279.0, 118.0]), 'h_0', taille=16)
    k2, O2 = 44.0, np.array([418.0, 135.0])
    P2 = _repere(O2, k2)
    S.surface([P2(0 - 2.6j), P2(2.6 - 2.6j), P2(2.6 + 2.6j), P2(0 + 2.6j)], 'b')
    S.fleche(P2(-2.6), P2(2.65), 'g')
    S.fleche(P2(-2.7j), P2(2.75j), 'g')
    S.ligne(P2(-2.6j), P2(2.6j), 'b', d=True)
    S.ligne(P2(0), P2(1), 't', l=2.6)
    S.cercle(P2(np.sqrt(2)), k2 * s, 'b')
    S.cercle(P2(-np.sqrt(2)), k2 * s, 'r', d=True)
    S.point(P2(np.sqrt(2)), 'b', r=3.4)
    S.point(P2(-np.sqrt(2)), 'r', r=3.4)
    S.texte(P2(np.sqrt(2)) + [0, -27], 'h_0(a)', 'b', taille=15)
    S.texte(P2(-np.sqrt(2)) + [0, -27], '−h_0(a)', 'r', taille=15)
    S.texte(P2(1) + [-6, 17], '1', ancre='end', taille=14)
    S.texte(P2(1.5 + 1.9j), 'h_0(Ω)', 'b', taille=16)
    return S


@schema('cf-koebe')
def cf_koebe():
    r, w, c = 0.25, -0.25, 0.5
    g = lambda z: phi(c, np.sqrt(phi(w, z) + 0j))
    # g est holomorphe sur le disque fendu, g(0) = 0, g'(0) = 5/4 (donc λ = 1)
    assert abs(g(0)) < 1e-15 and abs((g(1e-7) - g(-1e-7)) / 2e-7 - 1.25) < 1e-6
    # le bord de la fente (deux bords) va sur l'arc du cercle de centre −5/4, de rayon 3/4
    xs = np.linspace(0.2501, 0.9999, 2000)
    for e in (1e-12, -1e-12):
        arcimg = g(-xs + 1j * e)
        assert np.max(np.abs(np.abs(arcimg + 1.25) - 0.75)) < 1e-5
    # l'image de Ω évite la lunule 𝔻 ∩ D(−5/4, 3/4) ; le point le plus proche de 0 est −1/2
    X, Y = np.meshgrid(np.linspace(-1, 1, 801), np.linspace(-1, 1, 801))
    Z = (X + 1j * Y).ravel()
    Z = Z[(np.abs(Z) < 0.999) & ~((np.abs(np.imag(Z)) < 1e-12) & (np.real(Z) <= -0.25))]
    G = g(Z)
    assert np.min(np.abs(G + 1.25)) > 0.75 - 1e-9 and np.max(np.abs(G)) < 1
    u = np.linspace(-1, 1, 4001)
    lun = phi(c, 1j * u)
    assert abs(np.min(np.abs(lun)) - 0.5) < 1e-6
    S = Schema(540, 270, 'Un pas de Koebe sur le disque fendu')
    k = 105.0
    O1, O2 = np.array([128.0, 135.0]), np.array([412.0, 135.0])
    P1, P2 = _repere(O1, k), _repere(O2, k)
    S.cercle(O1, k, 't')
    S.ligne(P1(-1), P1(-0.25), 'r', l=3)
    S.cercle(O1, k * r, 'g', d=True)
    S.point(P1(-0.25), 'r', r=3.6)
    S.texte(P1(-0.25) + [-6, 18], 'w_f', 'r', ancre='end', taille=15)
    S.point(O1, 't', r=3.4)
    S.texte(O1 + [8, -12], '0', ancre='start', taille=14)
    S.texte(P1(0.45 + 0.55j), 'Ω', taille=17)
    S.fleche(np.array([250.0, 135.0]), np.array([292.0, 135.0]), 't')
    S.texte(np.array([271.0, 116.0]), 'K(f)', taille=15)
    # lunule : arc intérieur (image de l'axe imaginaire) puis arc du cercle unité (image du demi-cercle gauche)
    th = np.linspace(np.pi / 2, 3 * np.pi / 2, 600)
    ext = phi(c, np.exp(1j * th))
    assert np.max(np.abs(np.abs(ext) - 1)) < 1e-12
    bord = np.concatenate([lun, ext])
    S.poly(np.array([P2(z) for z in bord]), 'g', ferme=True, rempli='g')
    S.poly(np.array([P2(z) for z in lun]), 'r', l=2.2)
    S.cercle(O2, k, 't')
    S.cercle(O2, k * 0.5, 'g', d=True)
    S.point(P2(-0.5), 'r', r=3.6)
    S.texte(P2(-0.5) + [8, 15], '−1/2', 'r', ancre='start', taille=14)
    S.point(O2, 't', r=3.4)
    S.texte(O2 + [8, -12], '0', ancre='start', taille=14)
    return S
