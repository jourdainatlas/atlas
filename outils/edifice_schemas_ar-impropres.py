"""Schémas du graphe intérieur ar-impropres (chapitre « Intégrales généralisées »).

Toute position est calculée ; tout ce que dit la légende est vérifié par un assert (aires par quadrature
numérique ou par la formule exacte de la fiche).
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte


def _dans(S, p, s, taille=16, ancre='middle', roman=False):
    w = largeur_texte(s, taille, roman)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert 2 <= x0 and x0 + w <= S.w - 2 and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


def _etiq(S, p, s, c='t', ancre='middle', taille=16, roman=False):
    _dans(S, p, s, taille, ancre, roman)
    S.texte(p, s, c, ancre=ancre, taille=taille, roman=roman)


def _quad(f, a, b, n=200001):
    x = np.linspace(a, b, n)
    y = f(x)
    return float(np.sum((y[1:] + y[:-1]) / 2 * np.diff(x)))


def _axes(S, R, nx='t', ny=''):
    S.fleche(R(R.xmin, 0), R(R.xmax, 0), 'g')
    _etiq(S, R(R.xmax, 0) + [-4, 13], nx, 'g', ancre='end', taille=15)
    S.fleche(R(0 if R.xmin <= 0 else R.xmin, R.ymin), R(0 if R.xmin <= 0 else R.xmin, R.ymax), 'g')


@schema('ig-references')
def ig_references():
    # Valeurs de (i) et (ii) : ∫_1^∞ t^-2 = 1, ∫_0^1 t^-1/2 = 2 ; vérifiées par quadrature (avec la queue exacte).
    X = 60.0
    assert abs(_quad(lambda t: t ** -2.0, 1, X) + 1 / X - 1) < 1e-6
    assert abs(_quad(lambda s: 2 * np.ones_like(s), 0, 1) - 2) < 1e-12     # ∫_0^1 t^-1/2 = ∫_0^1 2 ds (t = s²)
    assert abs(_quad(lambda s: 2 * s * s ** -1.0 + 0 * s, 1e-9, 1) - 2) < 1e-6
    # ∫ 1/t diverge des deux côtés : ln X et -ln ε non bornés
    assert math.log(1e6) > 13 and -math.log(1e-6) > 13
    # 1/t est au-dessus de t^-2 sur ]1, ∞[ et au-dessous de t^-1/2 sur ]0, 1[
    tt = np.linspace(1.001, 8, 500)
    assert np.all(1 / tt > tt ** -2.0)
    ss = np.linspace(0.001, 0.999, 500)
    assert np.all(1 / ss > ss ** -0.5)

    S = Schema(520, 290, 'Aires sous t^(−2) sur [1, +∞[ et sous t^(−1/2) sur ]0, 1] : finies ; sous 1/t : infinies')
    # panneau gauche : [1, 7]
    RG = Repere(0, 7.2, -0.12, 1.5, 22, 34, 226, 220)
    _axes(S, RG)
    t = np.linspace(1, 7, 600)
    S.surface(np.vstack([RG(t, t ** -2.0), RG(t[::-1], 0 * t)]), 'r')
    S.poly(RG(t, t ** -2.0), 'r', l=2.2)
    t2 = np.linspace(0.68, 7, 600)
    S.poly(RG(t2, 1 / t2), 'b', l=1.8)
    S.ligne(RG(1, 0), RG(1, 1), 'g', d=True)
    _etiq(S, RG(1, 0) + [0, 15], '1', 'g', taille=14)
    _etiq(S, RG(0, 1) + [-6, 0], '1', 'g', ancre='end', taille=14)
    S.ligne(RG(0, 1) + [-3, 0], RG(0, 1) + [3, 0], 'g')
    p = RG(4.6, 1 / 4.6) + [0, -14]
    assert 1 / 4.6 > 4.6 ** -2 + 0.1
    _etiq(S, p, '1/t', 'b', taille=16)
    q = RG(2.4, 2.4 ** -2.0) + [26, 4]
    _etiq(S, q, 't^{−2}', 'r', ancre='start', taille=16)
    _etiq(S, RG(1.55, 0.16), '1', 'r', taille=15)
    _etiq(S, (RG(3.6, 0)[0], 16), 'sur [1, +∞[', 'g', taille=14, roman=True)
    # panneau droit : ]0, 1]
    RD = Repere(0, 1.25, -0.4, 5.2, 284, 34, 190, 220)
    _axes(S, RD)
    s = np.linspace(1 / 5.2 ** 2, 1, 600)
    S.surface(np.vstack([RD(s, s ** -0.5), RD(s[::-1], 0 * s), RD([s[0]], [0])]), 'r')
    S.poly(RD(s, s ** -0.5), 'r', l=2.2)
    s2 = np.linspace(1 / 5.2, 1.2, 600)
    S.poly(RD(s2, 1 / s2), 'b', l=1.8)
    S.ligne(RD(1, 0), RD(1, 1), 'g', d=True)
    _etiq(S, RD(1, 0) + [0, 15], '1', 'g', taille=14)
    p = RD(0.42, 1 / 0.42) + [10, -6]
    assert 1 / 0.42 > 0.42 ** -0.5 + 0.6
    _etiq(S, p, '1/t', 'b', ancre='start', taille=16)
    q = RD(1, 1) + [7, 21]
    assert 1 / 1.1 > 0.6                      # la courbe bleue passe au-dessus de l'étiquette, à droite de t = 1
    _etiq(S, q, 't^{−1/2}', 'r', ancre='start', taille=16)
    _etiq(S, RD(0.55, 0.55), '2', 'r', taille=15)
    _etiq(S, (RD(0.62, 0)[0], 16), 'sur ]0, 1]', 'g', taille=14, roman=True)
    return S


@schema('ig-absolue')
def ig_absolue():
    # aires des arches a_k = ∫_{kπ}^{(k+1)π} |sin t|/t, décroissantes, 2/((k+1)π) <= a_k <= 2/(kπ)
    ak = [_quad(lambda u: np.abs(np.sin(u)) / u, k * math.pi, (k + 1) * math.pi) for k in range(1, 30)]
    assert all(ak[i] > ak[i + 1] for i in range(len(ak) - 1))
    for k, v in enumerate(ak, 1):
        assert 2 / ((k + 1) * math.pi) <= v <= 2 / (k * math.pi)
    a0 = _quad(lambda u: np.sinc(u / math.pi), 0, math.pi)                # première arche, depuis 0
    assert a0 > ak[0]
    # sin t/t reste entre -1/t et 1/t
    tt = np.linspace(0.5, 20, 4000)
    assert np.all(np.abs(np.sin(tt) / tt) <= 1 / tt + 1e-15)
    N = 6
    S = Schema(520, 250, 'sin t / t : arches d’aires décroissantes, de signes alternés')
    R = Repere(0, N * math.pi + 0.6, -0.36, 1.08, 20, 16, 470, 214)
    S.fleche(R(0, 0), R(N * math.pi + 0.6, 0), 'g')
    _etiq(S, R(N * math.pi + 0.6, 0) + [-4, 14], 't', 'g', ancre='end', taille=15)
    S.fleche(R(0, -0.36), R(0, 1.08), 'g')
    for k in range(N):
        t = np.linspace(k * math.pi, (k + 1) * math.pi, 200)
        y = np.sinc(t / math.pi)
        c = 'r' if k % 2 == 0 else 'b'
        S.surface(np.vstack([R(t, y), R(t[::-1], 0 * t)]), c)
    t = np.linspace(0, N * math.pi, 1500)
    S.poly(R(t, np.sinc(t / math.pi)), 't', l=1.8)
    t1 = np.linspace(1 / 1.0, N * math.pi, 800)
    S.poly(R(t1, 1 / t1), 'g', d=True, l=1.2)
    t2 = np.linspace(1 / 0.36, N * math.pi, 800)
    S.poly(R(t2, -1 / t2), 'g', d=True, l=1.2)
    for k in range(1, N + 1):
        S.ligne(R(k * math.pi, 0) + [0, -3], R(k * math.pi, 0) + [0, 3], 'g')
    _etiq(S, R(math.pi, 0) + [-9, 12], 'π', 'g', taille=14)             # sous l'axe, à gauche : hors des arches
    _etiq(S, R(2 * math.pi, 0) + [-13, -11], '2π', 'g', taille=14)      # au-dessus, à gauche : hors des arches
    _etiq(S, R(0, 1) + [-6, 0], '1', 'g', ancre='end', taille=14)
    _etiq(S, R(3.4, 1 / 3.4) + [14, -10], '1/t', 'g', ancre='start', taille=15)
    _etiq(S, R(4.3 * math.pi, -1 / (4.3 * math.pi)) + [0, 18], '−1/t', 'g', taille=15)
    assert np.sinc(1.45) < -0.2 and np.sinc(2.5) > 0.12                  # creux de la 1re arche bleue, sommet de la 2e rouge
    _etiq(S, R(1.45 * math.pi, -0.1), 'a_1', 'b', taille=14)
    _etiq(S, R(2.5 * math.pi, 0.052), 'a_2', 'r', taille=13)
    return S


@schema('ig-series')
def ig_series():
    N = 7
    f = lambda t: 1 / t
    n = np.arange(1, N)
    # (i) : f(n+1) <= ∫_n^{n+1} f <= f(n) ; encadrement de l'intégrale
    I = math.log(N)
    assert sum(f(k + 1) for k in n) <= I <= sum(f(k) for k in n)
    # aire rouge = Σ (f(n) - ∫_n^{n+1} f) = w_N - f(N) ; la région rouge de [n, n+1] est dans le rectangle de base 1
    # et de hauteur f(n) - f(n+1) : glissées dans [1, 2], elles tiennent dans une colonne de hauteur f(1) - f(N)
    rouge = sum(f(k) - math.log((k + 1) / k) for k in n)
    wN = sum(f(k) for k in range(1, N + 1)) - math.log(N)
    assert abs(rouge - (wN - f(N))) < 1e-12 and rouge <= f(1) - f(N)
    for k in n:
        assert 0 <= f(k) - math.log((k + 1) / k) <= f(k) - f(k + 1)
    S = Schema(520, 270, 'Rectangles au-dessus et au-dessous de 1/t : comparaison série-intégrale')
    R = Repere(0, N + 0.7, -0.08, 1.12, 34, 16, 460, 222)
    for k in n:
        S.rect(*R(k, f(k)), R(k + 1, 0)[0] - R(k, 0)[0], R(k, 0)[1] - R(k, f(k))[1], 'b')
    t = np.linspace(1, N, 400)
    for k in n:
        tk = np.linspace(k, k + 1, 80)
        S.surface(np.vstack([R(tk, f(tk)), R([k + 1, k], [f(k), f(k)])]), 'r')
    for k in n:
        S.rect(*R(k, f(k + 1)), R(k + 1, 0)[0] - R(k, 0)[0], R(k, 0)[1] - R(k, f(k + 1))[1], 'v', rempli='v')
    S.fleche(R(0, 0), R(N + 0.7, 0), 'g')
    S.fleche(R(0, -0.08), R(0, 1.12), 'g')
    t = np.linspace(0.9, N + 0.5, 400)
    S.poly(R(t, f(t)), 't', l=2.2)
    for k in range(1, N + 1):
        S.ligne(R(k, 0) + [0, -3], R(k, 0) + [0, 3], 'g')
        _etiq(S, R(k, 0) + [0, 15], str(k), 'g', taille=14)
    _etiq(S, R(0, 1) + [-6, 0], '1', 'g', ancre='end', taille=14)
    S.ligne(R(0, 1) + [-3, 0], R(0, 1) + [3, 0], 'g')
    _etiq(S, R(N + 0.5, f(N + 0.5)) + [0, -16], '1/t', 't', ancre='end', taille=16)
    _etiq(S, R(N + 0.7, 0) + [-4, -12], 't', 'g', ancre='end', taille=15)
    return S


@schema('ig-mises-en-garde')
def ig_mises_en_garde():
    K = 5
    h = {k: k ** -3 for k in range(2, K + 1)}
    for k in range(2, 200):
        assert k ** -3 <= 1 / 8 and k + k ** -3 < k + 0.5 < (k + 1) - (k + 1) ** -3      # pics disjoints
        assert k - k ** 4 * 0.5 < 0                                                       # nulle aux bords de [k ± 1/2]
    aires = {k: k * h[k] for k in h}                                                      # base 2h, hauteur k : aire k·h
    for k in h:
        assert abs(aires[k] - 1 / k ** 2) < 1e-15
    assert abs(sum(1 / k ** 2 for k in range(2, 10 ** 6)) - 0.645) < 1e-3
    S = Schema(520, 280, 'Pics de hauteur k et d’aire 1/k² : intégrale convergente, fonction non bornée')
    R = Repere(0, 5.65, -0.3, 5.5, 40, 12, 456, 236)
    S.fleche(R(0, 0), R(5.65, 0), 'g')
    _etiq(S, R(5.65, 0) + [-4, -12], 't', 'g', ancre='end', taille=15)
    S.fleche(R(0, -0.3), R(0, 5.5), 'g')
    xs, ys = [0.0], [0.0]
    for k in range(2, K + 1):
        xs += [k - h[k], k, k + h[k]]
        ys += [0, k, 0]
    xs.append(5.6)
    ys.append(0)
    S.poly(R(np.array(xs), np.array(ys)), 'r', l=2.0)
    for k in range(1, K + 1):
        S.ligne(R(k, 0) + [0, -3], R(k, 0) + [0, 3], 'g')
        _etiq(S, R(k, 0) + [0, 15], str(k), 'g', taille=14)
        if k >= 2:
            S.ligne(R(0, k) + [-3, 0], R(0, k) + [3, 0], 'g')
            _etiq(S, R(0, k) + [-7, 0], str(k), 'g', ancre='end', taille=14)
    for k in range(2, K + 1):
        _etiq(S, R(k, k) + [10, 2], f'1/{k * k}', 'r', ancre='start', taille=14)
    return S
