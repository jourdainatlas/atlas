"""Schémas des exemples du lexique, théorie proba (probabilités) : contenu/exemples/proba.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 15 à 17
(mémo de l'édifice, § 111). Positions calculées, et ce que dit la légende vérifié par assert.
"""
import math
from fractions import Fraction as F

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


@schema('lex-loi-variable-1')
def lex_loi_variable_1():
    W, H = 420, 250
    poids = {k: sum(1 for a in range(1, 7) for b in range(1, 7) if a + b == k) for k in range(2, 13)}
    assert all(poids[k] == 6 - abs(k - 7) for k in poids) and sum(poids.values()) == 36
    assert poids[7] == 6 and all(poids[7 - j] == poids[7 + j] for j in range(6))
    R = Repere(1, 13, 0, 6.6, 34, 16, 372, 196)
    S = Schema(W, H, 'La loi de la somme de deux dés')
    S.ligne(R(1.2, 0), R(12.8, 0), 'g')
    for k, p in poids.items():
        a, b = R(k - 0.3, p), R(k + 0.3, 0)
        S.rect(a[0], a[1], b[0] - a[0], b[1] - a[1], 'r' if k == 7 else 'b', rempli='r' if k == 7 else 'b')
        S.texte(R(k, 0) + [0, 18], str(k), 'g', taille=15)
    for p in (1, 6):
        S.ligne(R(1.2, p), R(1.45, p), 'g')
        S.texte(R(1.2, p) + [-6, 0], str(p), 'g', ancre='end', taille=15)
    S.texte(R(7, 6) + [0, -14], '6/36', 'r', taille=15)
    return S


@schema('lex-fonction-repartition-1')
def lex_fonction_repartition_1():
    W, H = 420, 250
    R = Repere(-0.45, 1.5, -0.1, 1.15, 40, 32, 340, 188)
    Fx = lambda x: 0.0 if x < 0.5 else (x if x < 1 else 1.0)
    # contrôle par la mesure : F(x) = λ({ω ∈ [0, 1] : max(ω, 1/2) <= x})
    om = np.linspace(0, 1, 200001)
    for x in (0.2, 0.49, 0.5, 0.7, 0.99, 1.0, 1.3):
        assert abs(np.mean(np.maximum(om, 0.5) <= x) - Fx(x)) < 1e-4
    S = Schema(W, H, 'Fonction de répartition de max(ω, 1/2)')
    R.axes(S)
    S.ligne(R(-0.4, 0), R(0.5, 0), 'r', l=3)
    S.ligne(R(0.5, 0.5), R(1, 1), 'r', l=3)
    S.ligne(R(1, 1), R(1.45, 1), 'r', l=3)
    S.ligne(R(0.5, 0), R(0.5, 0.5), 'g', d=True)
    S.point(R(0.5, 0.5), 'r', r=4.5)
    S.point(R(0.5, 0), 'r', r=4, creux=True)
    S.ligne(R(0, 1), R(1, 1), 'g', d=True)
    S.ligne(R(1, 0), R(1, 1), 'g', d=True)
    S.texte(R(0.5, 0) + [0, 18], '1/2', 'g', taille=15)
    S.texte(R(1, 0) + [0, 18], '1', 'g', taille=15)
    S.texte(R(0, 1) + [-10, 0], '1', 'g', ancre='end', taille=15)
    S.texte(R(0, 0.5) + [-10, 0], '1/2', 'g', ancre='end', taille=15)
    S.ligne(R(0, 0.5), R(0.5, 0.5), 'g', d=True)
    return S


@schema('lex-densite-probabilite-2')
def lex_densite_probabilite_2():
    W, H = 420, 260
    R = Repere(-0.15, 1.25, 0, 3.2, 40, 30, 350, 200)
    f_max = lambda x: 2 * x
    f_carre = lambda x: 1 / (2 * np.sqrt(x))
    # aires 1 (calcul exact) ; la densité rouge dépasse 1 exactement sur ]0, 1/4[
    assert abs(sum(2 * x for x in np.linspace(0, 1, 100001)) / 100001 * 1 - 1) < 1e-3
    assert abs((math.sqrt(1) - math.sqrt(0)) - 1) < 1e-12
    xs = np.linspace(1e-6, 1, 4001)
    assert np.all((f_carre(xs) > 1) == (xs < 0.25))
    S = Schema(W, H, 'Deux densités sur [0, 1]')
    R.axes(S)
    S.ligne(R(0, 1), R(1.2, 1), 'g', d=True)
    x0 = 1 / (4 * 3.1 ** 2)                    # f_carre(x0) = 3.1, haut du cadre
    xr = np.linspace(x0, 1, 600)
    S.surface(np.vstack([R(xr, f_carre(xr)), R(1, 0), R(x0, 0)]), 'r')
    S.poly(R(xr, f_carre(xr)), 'r', l=2.4)
    S.ligne(R(1, 0), R(1, f_carre(1.0)), 'r')
    S.poly(np.vstack([R(np.array([0, 1]), np.array([0, 2])), R(1, 0)]), 'b', ferme=True, rempli='b')
    S.texte(R(1, 0) + [0, 18], '1', 'g', taille=15)
    S.texte(R(0, 1) + [-10, 0], '1', 'g', ancre='end', taille=15)
    S.texte(R(0, 2) + [-10, 0], '2', 'g', ancre='end', taille=15)
    return S


@schema('lex-ensemble-cantor-1')
def lex_ensemble_cantor_1():
    W, H = 420, 200
    x0, L = 30, 360
    X = lambda t: x0 + L * t

    def segments(N):
        segs = [(F(0), F(1))]
        for _ in range(N):
            segs = [s for a, b in segs for s in ((a, a + (b - a) / 3), (b - (b - a) / 3, b))]
        return segs
    q, h = F(1, 4), F(1, 2)
    S = Schema(W, H, 'Les étapes K1, K2, K3 de l’ensemble de Cantor')
    for N, y in ((1, 50), (2, 95), (3, 140)):
        sg = segments(N)
        assert len(sg) == 2 ** N and all(b - a == F(1, 3 ** N) for a, b in sg)
        assert sum(1 for a, b in sg if a <= q <= b) == 1 and all(q not in (a, b) for a, b in sg)   # ¼ intérieur
        assert not any(a <= h <= b for a, b in sg)                                                   # ½ éliminé
        for a, b in sg:
            S.rect(X(float(a)), y - 7, X(float(b)) - X(float(a)), 14, 'b', rempli='b')
        S.texte((X(0) - 6, y), f'K_{N}', 't', ancre='end', taille=15)
    S.ligne((X(0), 175), (X(1), 175), 'g')
    for t, lab in ((0, '0'), (1 / 3, '1/3'), (2 / 3, '2/3'), (1, '1')):
        S.ligne((X(t), 170), (X(t), 180), 'g')
        S.texte((X(t), 192), lab, 'g', taille=14)
    S.ligne((X(0.25), 24), (X(0.25), 160), 'r', d=True)
    S.texte((X(0.25), 14), '1/4', 'r', taille=15)
    S.ligne((X(0.5), 24), (X(0.5), 160), 'v', d=True)
    S.texte((X(0.5), 14), '1/2', 'v', taille=15)
    return S


@schema('lex-convergence-probabilite-1')
def lex_convergence_probabilite_1():
    W, H = 420, 290
    s = [0.0]
    for n in range(1, 40):
        s.append(s[-1] + 1 / n)
    omega = 0.7
    touche = [n for n in range(1, 13) if any(s[n - 1] <= omega + m < s[n] for m in range(5))]
    assert touche == [1, 3, 8]
    x0, L, y0, pas = 60, 330, 20, 19.5
    X = lambda t: x0 + L * t
    S = Schema(W, H, 'Les ensembles A_n de l’intervalle enroulé')
    for n in range(1, 13):
        y = y0 + (n - 1) * pas
        S.ligne((X(0), y), (X(1), y), 'g')
        a, b = s[n - 1], s[n]
        morceaux = []
        m = math.floor(a)
        while m < b:
            g, d = max(a, m) - m, min(b, m + 1) - m
            if d > g:
                morceaux.append((g, d))
            m += 1
        assert abs(sum(d - g for g, d in morceaux) - 1 / n) < 1e-12
        for g, d in morceaux:
            S.rect(X(g), y - 6, X(d) - X(g), 12, 'b', rempli='b')
        S.texte((X(0) - 10, y), str(n), 'g', ancre='end', taille=14)
    S.ligne((X(omega), y0 - 12), (X(omega), y0 + 11 * pas + 12), 'r', l=2)
    yb = y0 + 11 * pas + 30
    S.ligne((X(0), yb), (X(1), yb), 'g')
    for t, lab in ((0, '0'), (omega, '0,7'), (1, '1')):
        S.texte((X(t), yb + 14), lab, 'r' if t == omega else 'g', taille=14)
    return S
