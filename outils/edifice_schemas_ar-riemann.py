"""Schémas du graphe intérieur ar-riemann (chapitre « Intégrale de Riemann »).

Le schéma « ar-riemann » de ri-continues est dans edifice_schemas_reelle.py. Toute position est
calculée ; toute affirmation illustrée est vérifiée par un assert. Exemples polynomiaux seulement
(ordre d'apparition : ni exponentielle, ni logarithme, ni trigonométrie).
"""
from fractions import Fraction as Fr
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere


def _cubique(x):
    """f(x) = 3/2 + x(x - 9/5)(x - 3)/2, fonction témoin des fiches ri-integrable et ri-sommes."""
    return 1.5 + 0.5 * x * (x - 1.8) * (x - 3)


def _extremums(fn, coeffs_derivee, u, v):
    """Minimum et maximum exacts d'un polynôme sur [u, v] : extrémités et zéros de la dérivée."""
    cand = [u, v] + [r.real for r in np.roots(coeffs_derivee) if abs(r.imag) < 1e-12 and u < r.real < v]
    vals = [fn(t) for t in cand]
    return min(vals), max(vals)


def _axe_x(S, R, x0, x1, nom='x'):
    S.fleche(R(x0, 0), R(x1, 0), 'g')
    S.texte(R(x1, 0) + [8, 0], nom, 'g', ancre='start')


def _graduation(S, R, x, lab, c='t', dy=17, taille=16, ancre='middle', dx=0):
    S.ligne(R(x, 0) + [0, -4], R(x, 0) + [0, 4], 'g')
    S.texte(R(x, 0) + [dx, dy], lab, c, taille=taille, ancre=ancre)


# ---------------------------------------------------------------------------------------------------
# ri-subdivision : raffinement commun
# ---------------------------------------------------------------------------------------------------

@schema('ri-subdivision')
def ri_subdivision():
    s1 = [Fr(0), Fr(1, 2), Fr(1)]
    s2 = [Fr(0), Fr(1, 3), Fr(1)]
    s3 = sorted(set(s1) | set(s2))
    pas = lambda s: max(s[i + 1] - s[i] for i in range(len(s) - 1))
    assert pas(s1) == Fr(1, 2) and pas(s2) == Fr(2, 3) and pas(s3) == Fr(1, 2)
    assert s3 == [0, Fr(1, 3), Fr(1, 2), 1] and pas(s3) == min(pas(s1), pas(s2))
    # chaque intervalle du raffinement est contenu dans un intervalle de chacune
    for s in (s1, s2):
        for i in range(len(s3) - 1):
            assert any(s[j] <= s3[i] and s3[i + 1] <= s[j + 1] for j in range(len(s) - 1))
    noms = {Fr(0): '0', Fr(1, 3): '1/3', Fr(1, 2): '1/2', Fr(1): '1'}
    S = Schema(500, 236, 'Deux subdivisions de [0, 1] et leur raffinement commun ; le pas de chacune en trait épais')
    X = lambda x: 120 + float(x) * 300
    rangs = [(s1, 'σ', 'b', 40), (s2, 'σ^′', 'v', 112), (s3, 'σ ∪ σ^′', 'r', 184)]
    # report des points de sigma et sigma' sur la ligne du raffinement
    for s, _, c, y in rangs[:2]:
        for x in s[1:-1]:
            S.ligne((X(x), y + 32), (X(x), 184 - 8), 'g', d=True)
    for s, nom, c, y in rangs:
        S.ligne((X(0), y), (X(1), y), 't', l=1.4)
        p = pas(s)
        for i in range(len(s) - 1):
            if s[i + 1] - s[i] == p:
                S.ligne((X(s[i]), y), (X(s[i + 1]), y), c, l=4.5)
        for x in s:
            S.ligne((X(x), y - 7), (X(x), y + 7), c, l=2)
            S.texte((X(x), y + 22), noms[x], 't', taille=15)
        S.texte((X(0) - 18, y), nom, c, ancre='end')
        S.texte((X(1) + 18, y), '`pas` ' + str(p.numerator) + '/' + str(p.denominator), c, ancre='start',
                taille=15)
    return S


# ---------------------------------------------------------------------------------------------------
# ri-escalier : fonction en escalier, valeurs quelconques aux points de la subdivision
# ---------------------------------------------------------------------------------------------------

@schema('ri-escalier')
def ri_escalier():
    xs = [0.0, 1.0, 2.2, 3.0, 4.4, 5.2]
    cs = [1.6, 2.6, 0.9, 2.1, 1.3]
    vx = [0.5, 1.7, 2.6, 3.0, 0.4, 2.5]          # valeurs phi(x_i) aux points de la subdivision
    n = len(cs)
    assert all(xs[i] < xs[i + 1] for i in range(n)) and len(vx) == n + 1
    # les valeurs aux points sont quelconques : une seule prolonge un palier voisin (x_2, palier c_1)
    differentes = [i for i in range(n + 1)
                   if (i == 0 or vx[i] != cs[i - 1]) and (i == n or vx[i] != cs[i])]
    assert differentes == [0, 1, 3, 4, 5] and vx[2] == cs[1]
    S = Schema(500, 270, 'Fonction en escalier : constante sur chaque intervalle ouvert, valeurs quelconques aux points')
    R = Repere(-0.3, 5.75, -0.35, 3.25, 30, 12, 440, 222)
    _axe_x(S, R, -0.3, 5.6)
    S.fleche(R(0, -0.35), R(0, 3.2), 'g')
    for i in range(n):
        p, q, c = xs[i], xs[i + 1], cs[i]
        if i > 0:
            S.ligne(R(p, 0), R(p, 3.0), 'g', d=True)
        S.ligne(R(p, c), R(q, c), 't', l=2.4)
        S.point(R(p, c), 't', r=3.8, creux=True)
        S.point(R(q, c), 't', r=3.8, creux=True)
    S.ligne(R(xs[-1], 0), R(xs[-1], 3.0), 'g', d=True)
    for i in range(n + 1):
        S.point(R(xs[i], vx[i]), 'r', r=4.2)
    for i in range(n + 1):
        lab = {0: 'a', n: 'b'}.get(i, f'x_{i}')
        _graduation(S, R, xs[i], lab, 't', dy=18)
    S.texte(R((xs[1] + xs[2]) / 2, cs[1]) + [0, -16], 'c_1')
    S.texte(R((xs[3] + xs[4]) / 2, cs[3]) + [0, -16], 'c_3')
    S.texte(R(xs[4] + 0.15, vx[4]) + [6, 0], 'φ(x_4)', 'r', ancre='start', taille=15)
    S.texte(R(0, 3.2) + [12, 4], 'φ', ancre='start')
    return S


# ---------------------------------------------------------------------------------------------------
# ri-integrale-escalier : aire algébrique, indépendance de la subdivision adaptée
# ---------------------------------------------------------------------------------------------------

@schema('ri-integrale-escalier')
def ri_integrale_escalier():
    phi = lambda x: 2 if x < 1 else -1
    I = lambda s: sum(phi((s[i] + s[i + 1]) / 2) * (s[i + 1] - s[i]) for i in range(len(s) - 1))
    s1 = [Fr(0), Fr(1), Fr(3)]
    s2 = [Fr(0), Fr(1, 2), Fr(1), Fr(2), Fr(3)]
    assert I(s1) == 0 and I(s2) == 0
    morceaux = [phi((s2[i] + s2[i + 1]) / 2) * (s2[i + 1] - s2[i]) for i in range(4)]
    assert morceaux == [1, 1, -1, -1]
    S = Schema(500, 290, 'Intégrale d’une fonction en escalier : aire au-dessus de l’axe moins aire au-dessous')
    R = Repere(-0.35, 3.5, -1.45, 2.55, 40, 12, 420, 250)
    _axe_x(S, R, -0.35, 3.4)
    S.fleche(R(0, -1.45), R(0, 2.5), 'g')
    S.rect(*R(0, 2), *(R(1, 0) - R(0, 2)), 'b', rempli='b')
    S.rect(*R(1, 0), *(R(3, -1) - R(1, 0)), 'r', rempli='r')
    # subdivision plus fine : les rectangles se coupent sans que la somme change
    for x in (Fr(1, 2), Fr(2)):
        S.ligne(R(x, 0), R(x, phi(x)), 'g', d=True)
    for i in range(4):
        m = (s2[i] + s2[i + 1]) / 2
        v = morceaux[i]
        S.texte(R(m, phi(m) / 2), ('+' if v > 0 else '−') + str(abs(v)), 'b' if v > 0 else 'r', taille=16)
    # le graphe de phi par-dessus
    S.ligne(R(0, 2), R(1, 2), 't', l=2.6)
    S.ligne(R(1, -1), R(3, -1), 't', l=2.6)
    S.point(R(0, 2), 't', r=3.8)
    S.point(R(1, 2), 't', r=3.8, creux=True)
    S.point(R(1, -1), 't', r=3.8)
    S.point(R(3, -1), 't', r=3.8)
    for x, lab in [(0, '0'), (Fr(1, 2), '1/2'), (1, '1'), (2, '2'), (3, '3')]:
        dy = -15 if x >= 1 else 17
        S.ligne(R(x, 0) + [0, -4], R(x, 0) + [0, 4], 'g')
        S.texte(R(x, 0) + [-9 if x == 0 else (11 if x == 1 else 0), dy], lab, taille=15)
    S.texte(R(0, 2) + [-8, 0], '2', ancre='end', taille=15)
    S.texte(R(0, -1) + [-8, 0], '−1', ancre='end', taille=15)
    S.ligne(R(0, -1) + [-4, 0], R(0, -1) + [4, 0], 'g')
    S.texte(R(Fr(1, 4), 2) + [0, -16], 'φ')
    return S


# ---------------------------------------------------------------------------------------------------
# ri-integrable : intégrales inférieure et supérieure, encadrement par deux escaliers
# ---------------------------------------------------------------------------------------------------

@schema('ri-integrable')
def ri_integrable():
    fn = _cubique
    der = [1.5, -4.8, 2.7]                         # f'(x) = (3x^2 - 9.6x + 5.4) / 2
    xg = np.linspace(0, 3, 30001)
    assert np.allclose(np.gradient(fn(xg), xg)[1:-1], np.polyval(der, xg)[1:-1], atol=1e-6)
    xs = [0.0, 0.5, 1.2, 1.7, 2.3, 2.75, 3.0]
    n = len(xs) - 1
    bas, haut = [], []
    for i in range(n):
        m, M = _extremums(fn, der, xs[i], xs[i + 1])
        t = np.linspace(xs[i], xs[i + 1], 4001)
        assert np.all(fn(t) >= m - 1e-12) and np.all(fn(t) <= M + 1e-12)
        bas.append(m), haut.append(M)
    Iphi = sum(bas[i] * (xs[i + 1] - xs[i]) for i in range(n))
    Ipsi = sum(haut[i] * (xs[i + 1] - xs[i]) for i in range(n))
    # intégrale de f (polynôme) pour situer I^- = I^+ entre les deux
    If = 1.5 * 3 + 0.5 * (3 ** 4 / 4 - 4.8 * 3 ** 3 / 3 + 5.4 * 3 ** 2 / 2)
    assert Iphi < If < Ipsi
    assert abs(Iphi - 4.49) < 0.005 and abs(Ipsi - 5.77) < 0.005 and abs(If - 207 / 40) < 1e-12
    S = Schema(500, 320, 'Escalier phi sous f, escalier psi au-dessus ; entre les deux, l’écart des intégrales')
    R = Repere(-0.2, 3.35, -0.25, 2.85, 36, 10, 430, 282)
    _axe_x(S, R, -0.2, 3.3)
    S.fleche(R(0, -0.25), R(0, 2.8), 'g')
    for i in range(n):
        p, q = xs[i], xs[i + 1]
        S.surface([R(p, bas[i]), R(q, bas[i]), R(q, haut[i]), R(p, haut[i])], 'r')
    for vals, c in [(bas, 'b'), (haut, 'v')]:
        for i in range(n):
            S.ligne(R(xs[i], vals[i]), R(xs[i + 1], vals[i]), c, l=2)
    R.graphe(S, fn, 0, 3, 't', l=2)
    for i in range(n + 1):
        S.point(R(xs[i], fn(xs[i])), 't', r=2.6)
        S.ligne(R(xs[i], 0) + [0, -4], R(xs[i], 0) + [0, 4], 'g')
    S.texte(R(0, 0) + [0, 17], 'a', taille=16)
    S.texte(R(3, 0) + [0, 17], 'b', taille=16)
    S.texte(R(3, fn(3)) + [10, 0], 'f', ancre='start')
    S.texte(R((xs[1] + xs[2]) / 2, haut[1]) + [0, -15], 'ψ', 'v')
    S.texte(R((xs[3] + xs[4]) / 2, bas[3]) + [0, 16], 'φ', 'b')
    return S


# ---------------------------------------------------------------------------------------------------
# ri-monotones : l'écart total se télescope
# ---------------------------------------------------------------------------------------------------

@schema('ri-monotones')
def ri_monotones():
    n = 5
    h = Fr(1, n)
    xk = [k * h for k in range(n + 1)]
    fn = lambda x: x * x
    ecarts = [(fn(xk[k + 1]) - fn(xk[k])) * h for k in range(n)]
    assert sum(ecarts) == h * (fn(1) - fn(0)) == Fr(1, 5)
    # les rectangles d'écart, glissés horizontalement, s'empilent sans trou ni chevauchement
    hauteurs = [(fn(xk[k]), fn(xk[k + 1])) for k in range(n)]
    assert all(hauteurs[k][1] == hauteurs[k + 1][0] for k in range(n - 1))
    assert hauteurs[0][0] == fn(0) and hauteurs[-1][1] == fn(1)
    xc = Fr(11, 10)                                 # colonne d'empilement [11/10, 13/10]
    S = Schema(500, 340, 'Fonction croissante : les rectangles d’écart, glissés à droite, forment une colonne')
    R = Repere(-0.08, 1.45, -0.08, 1.12, 30, 14, 360, 290)
    _axe_x(S, R, -0.08, 1.42)
    S.fleche(R(0, -0.08), R(0, 1.1), 'g')
    for k in range(n):
        p, q = xk[k], xk[k + 1]
        lo, hi = fn(p), fn(q)
        S.rect(*R(p, hi), *(R(q, lo) - R(p, hi)), 'r', rempli='r')
        S.rect(*R(xc, hi), *(R(xc + h, lo) - R(xc, hi)), 'r', rempli='r')
        S.ligne(R(q, hi) + [3, 0], R(xc, hi) + [-3, 0], 'g', d=True)
    for k in range(n):
        S.ligne(R(xk[k], fn(xk[k])), R(xk[k + 1], fn(xk[k])), 'b', l=2)
        S.ligne(R(xk[k], fn(xk[k + 1])), R(xk[k + 1], fn(xk[k + 1])), 'v', l=2)
    R.graphe(S, lambda x: x * x, 0, 1, 't', l=2)
    for k in range(n + 1):
        S.ligne(R(xk[k], 0) + [0, -4], R(xk[k], 0) + [0, 4], 'g')
    S.texte(R(0, 0) + [0, 17], 'a', taille=16)
    S.texte(R(1, 0) + [0, 17], 'b', taille=16)
    S.texte(R(xk[3], 0) + [0, 17], 'x_k', 'g', taille=15)
    S.texte(R(xk[4], 0) + [0, 17], 'x_{k+1}', 'g', taille=15)
    # cotes de la colonne : largeur h, hauteur f(b) - f(a)
    S.fleche(R(xc, 0) + [0, 12], R(xc + h, 0) + [0, 12], 'g', double=True)
    S.texte(R(xc + h / 2, 0) + [0, 28], 'h', 'g', taille=16)
    S.fleche(R(xc + h, 0) + [12, 0], R(xc + h, 1) + [12, 0], 'g', double=True)
    S.texte(R(xc + h, Fr(1, 2)) + [18, 0], 'f(b) − f(a)', 'r', ancre='start', taille=15)
    S.texte(R(Fr(3, 5), fn(Fr(3, 5))) + [-12, -36], 'ψ_n', 'v', ancre='end', taille=16)
    S.texte(R(Fr(7, 10), fn(Fr(3, 5))) + [6, 15], 'φ_n', 'b', ancre='start', taille=16)
    return S


# ---------------------------------------------------------------------------------------------------
# ri-moyenne : valeur moyenne atteinte en deux points
# ---------------------------------------------------------------------------------------------------

@schema('ri-moyenne')
def ri_moyenne():
    fn = lambda x: x * (1 - x)
    moy = Fr(1, 6)
    assert Fr(1, 2) - Fr(1, 3) == moy                               # intégrale de x - x^2 sur [0, 1]
    cs = [0.5 - np.sqrt(3) / 6, 0.5 + np.sqrt(3) / 6]
    for c in cs:
        assert abs(fn(c) - 1 / 6) < 1e-15 and 0 < c < 1
    # aires de part et d'autre du niveau 1/6 égales (compensation)
    t = np.linspace(0, 1, 200001)
    au_dessus = np.trapezoid(np.maximum(fn(t) - 1 / 6, 0), t)
    au_dessous = np.trapezoid(np.maximum(1 / 6 - fn(t), 0), t)
    assert abs(au_dessus - au_dessous) < 1e-8 and abs(au_dessus - np.sqrt(3) / 54) < 1e-8
    S = Schema(500, 300, 'Valeur moyenne de x(1 - x) sur [0, 1] : rectangle de même aire, atteinte en deux points')
    R = Repere(-0.08, 1.2, -0.03, 0.29, 50, 14, 400, 250)
    _axe_x(S, R, -0.08, 1.15)
    S.fleche(R(0, -0.03), R(0, 0.285), 'g')
    m = float(moy)
    # parties du graphe au-dessus du niveau (bleu) et creux sous le niveau (gris)
    t1 = np.linspace(cs[0], cs[1], 200)
    S.surface(np.vstack([R(t1, fn(t1)), R(t1[::-1], np.full_like(t1, m))]), 'b')
    for u, v in [(0, cs[0]), (cs[1], 1)]:
        tt = np.linspace(u, v, 120)
        S.surface(np.vstack([R(tt, fn(tt)), R(tt[::-1], np.full_like(tt, m))]), 'g')
    S.ligne(R(0, m), R(1, m), 'r', l=2)
    S.ligne(R(1, 0), R(1, m), 'r', d=True)
    R.graphe(S, fn, 0, 1, 't', l=2)
    for c, lab in zip(cs, ['c_1', 'c_2']):
        S.ligne(R(c, 0), R(c, m), 'g', d=True)
        S.point(R(c, m), 'r', r=4.2)
        S.ligne(R(c, 0) + [0, -4], R(c, 0) + [0, 4], 'g')
        S.texte(R(c, 0) + [0, 17], lab, 'r', taille=16)
    S.texte(R(0, 0) + [0, 17], '0', taille=15)
    S.texte(R(1, 0) + [0, 17], '1', taille=15)
    S.texte(R(0, m) + [-8, 0], '1/6', 'r', ancre='end', taille=15)
    S.texte(R(0, 0.25) + [-8, 0], '1/4', 'g', ancre='end', taille=15)
    S.ligne(R(0, 0.25) + [-4, 0], R(0, 0.25) + [4, 0], 'g')
    S.texte(R(0.5, 0.25) + [0, -14], 'f', taille=17)
    return S


# ---------------------------------------------------------------------------------------------------
# ri-sommes : somme de Riemann pointée ; indices mauvais de la preuve (i)
# ---------------------------------------------------------------------------------------------------

@schema('ri-sommes')
def ri_sommes():
    fn = _cubique
    xs = [0.0, 0.45, 1.05, 1.8, 2.35, 3.0]
    xi = [0.3, 0.6, 1.6, 2.2, 2.55]
    n = len(xs) - 1
    assert all(xs[i] <= xi[i] <= xs[i + 1] for i in range(n))
    assert all(fn(x) > 0 for x in xi)
    Sr = sum(fn(xi[i]) * (xs[i + 1] - xs[i]) for i in range(n))
    If = 207 / 40                                   # intégrale exacte de f sur [0, 3] (sympy)
    assert abs(Sr - 4.99) < 0.005 and abs(Sr - If) < 0.2
    S = Schema(500, 320, 'Somme de Riemann : rectangles de hauteur f(xi_i), xi_i pris dans chaque intervalle')
    R = Repere(-0.2, 3.35, -0.25, 2.85, 36, 10, 430, 270)
    _axe_x(S, R, -0.2, 3.3)
    S.fleche(R(0, -0.25), R(0, 2.8), 'g')
    for i in range(n):
        p, q, v = xs[i], xs[i + 1], fn(xi[i])
        S.rect(*R(p, v), *(R(q, 0) - R(p, v)), 'b', rempli='b')
    R.graphe(S, fn, 0, 3, 't', l=2)
    for i in range(n):
        S.ligne(R(xi[i], 0), R(xi[i], fn(xi[i])), 'r', d=True)
        S.point(R(xi[i], fn(xi[i])), 'r', r=4.2)
        S.point(R(xi[i], 0), 'r', r=3.4)
    S.texte(R(0, 0) + [0, 18], 'a', taille=16)
    S.texte(R(3, 0) + [0, 18], 'b', taille=16)
    S.texte(R(xs[2], 0) + [-3, 18], 'x_i', 'b', taille=15, ancre='end')
    S.texte(R(xs[3], 0) + [3, 18], 'x_{i+1}', 'b', taille=15, ancre='start')
    S.texte(R(xi[2], 0) + [0, 38], 'ξ_i', 'r', taille=16)
    S.texte(R(xi[2], fn(xi[2])) + [0, -16], 'f(ξ_i)', 'r', taille=15)
    S.texte(R(3, fn(3)) + [10, -4], 'f', ancre='start')
    return S


@schema('ri-sommes-2')
def ri_sommes_2():
    a, b = Fr(0), Fr(10)
    ys = [a, Fr(37, 10), Fr(6), b]                  # sigma_0 : y_0 = a, y_1, y_2, y_3 = b (p = 3)
    p = len(ys) - 1
    xs = [Fr(0), Fr(6, 10), Fr(13, 10), Fr(19, 10), Fr(25, 10), Fr(32, 10), Fr(40, 10), Fr(46, 10),
          Fr(53, 10), Fr(6), Fr(66, 10), Fr(73, 10), Fr(80, 10), Fr(87, 10), Fr(94, 10), Fr(10)]
    delta = Fr(9, 10)
    assert xs[0] == a and xs[-1] == b and all(xs[i] < xs[i + 1] for i in range(len(xs) - 1))
    assert max(xs[i + 1] - xs[i] for i in range(len(xs) - 1)) < delta
    mauvais = [i for i in range(len(xs) - 1) if any(xs[i] <= y <= xs[i + 1] for y in ys)]
    assert len(mauvais) <= 2 * (p + 1)
    # y_2 est un point de sigma : il est dans deux segments mauvais ; y_1 n'en touche qu'un
    assert ys[2] in xs and sum(xs[i] <= ys[2] <= xs[i + 1] for i in range(len(xs) - 1)) == 2
    assert sum(xs[i] <= ys[1] <= xs[i + 1] for i in range(len(xs) - 1)) == 1
    assert mauvais == [0, 5, 8, 9, 14]
    long_mauvais = sum(xs[i + 1] - xs[i] for i in mauvais)
    assert long_mauvais < 2 * (p + 1) * delta
    S = Schema(520, 128, 'Indices mauvais : segments de sigma qui contiennent un point de sigma_0')
    X = lambda x: 40 + float(x) * 44
    y0 = 78
    for i in range(len(xs) - 1):
        bad = i in mauvais
        S.ligne((X(xs[i]), y0), (X(xs[i + 1]), y0), 'r' if bad else 't', l=5 if bad else 1.6)
    for x in xs:
        S.ligne((X(x), y0 - 6), (X(x), y0 + 6), 't', l=1.4)
    for j, y in enumerate(ys):
        S.ligne((X(y), y0 - 30), (X(y), y0 + 6), 'b', l=2)
        S.texte((X(y), y0 - 42), f'y_{j}', 'b', taille=16)
    S.texte((X(a), y0 + 24), 'a', taille=16)
    S.texte((X(b), y0 + 24), 'b', taille=16)
    i0 = 2
    S.texte(((X(xs[i0]) + X(xs[i0 + 1])) / 2, y0 + 26), '`bon`', 't', taille=15)
    S.texte(((X(xs[5]) + X(xs[6])) / 2, y0 + 26), '`mauvais`', 'r', taille=15)
    return S
