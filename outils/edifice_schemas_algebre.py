"""Schémas des graphes d'algèbre (algèbre linéaire, Galois, théorie algébrique des nombres, théorie
analytique des nombres, groupes de Lie)."""
import math
from fractions import Fraction as Fr

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, arc, bezier, blob, courbe_entre, f


# ---------------------------------------------------------------- primitives locales

def segment_boite(p, d, boite):
    """Morceau de la droite p + t d contenu dans le rectangle boite = (xmin, xmax, ymin, ymax)."""
    xmin, xmax, ymin, ymax = boite
    p, d = np.asarray(p, float), np.asarray(d, float)
    t0, t1 = -np.inf, np.inf
    for k, (lo, hi) in enumerate([(xmin, xmax), (ymin, ymax)]):
        if abs(d[k]) < 1e-12:
            assert lo <= p[k] <= hi
            continue
        a, b = (lo - p[k]) / d[k], (hi - p[k]) / d[k]
        t0, t1 = max(t0, min(a, b)), min(t1, max(a, b))
    assert t0 < t1
    return p + t0 * d, p + t1 * d


def accolade(S, x, y0, y1, c='g', cote=-1, largeur=9):
    """Accolade verticale de y0 à y1 (coordonnées image), pointe tournée du côté « cote » (-1 : gauche)."""
    m = (y0 + y1) / 2
    w = cote * largeur
    d = (f'M{f(x)},{f(y0)} C{f(x + w / 2)},{f(y0)} {f(x + w / 2)},{f(y0 + 6)} {f(x + w / 2)},{f(y0 + 10)} '
         f'L{f(x + w / 2)},{f(m - 8)} C{f(x + w / 2)},{f(m - 3)} {f(x + w)},{f(m)} {f(x + w)},{f(m)} '
         f'C{f(x + w)},{f(m)} {f(x + w / 2)},{f(m + 3)} {f(x + w / 2)},{f(m + 8)} '
         f'L{f(x + w / 2)},{f(y1 - 10)} C{f(x + w / 2)},{f(y1 - 6)} {f(x + w / 2)},{f(y1)} {f(x)},{f(y1)}')
    S.brut(f'<path class="s-{c}" fill="none" d="{d}"/>')
    return np.array([x + w, m])


def croix_lineaire(A, b):
    return np.linalg.solve(np.asarray(A, float), np.asarray(b, float))


# ================================================================ algèbre linéaire

@schema('v-somme-directe')
def v_somme_directe():
    # F = Vect(0, 1) ; G = Vect(1, 1/2), G' = Vect(1, -1/4) : deux des droites Vect(1, t).
    F = np.array([0, 1])
    tG, tH = Fr(1, 2), Fr(-1, 4)
    x = (Fr(2), Fr(3, 2))
    # x = f + g, f ∈ F, g = λ(1, t) : λ = x_1, f = x_2 - λ t
    def decompose(t):
        lam = x[0]
        return (Fr(0), x[1] - lam * t), (lam, lam * t)
    (f1, g1), (f2, g2) = decompose(tG), decompose(tH)
    assert f1 == (0, Fr(1, 2)) and g1 == (2, 1) and f2 == (0, 2) and g2 == (2, Fr(-1, 2))
    assert (f1[0] + g1[0], f1[1] + g1[1]) == x == (f2[0] + g2[0], f2[1] + g2[1])
    assert f1 != f2                                       # le projeté dépend du supplémentaire
    S = Schema(500, 380, 'Une droite F, deux de ses supplémentaires G et G′, et les deux décompositions de x')
    boite = (-1.05, 3.3, -1.05, 2.75)
    R = Repere(*boite, 30, 18, 440, 345)
    # autres droites Vect(1, t), en gris
    for t in [-0.75, -0.5, 0.0, 0.25, 0.8, 1.25]:
        a, b = segment_boite((0, 0), (1, t), boite)
        S.ligne(R(*a), R(*b), 'g', d=True)
    for t, c, nom in [(tG, 'b', 'G'), (tH, 'v', 'G^′')]:
        a, b = segment_boite((0, 0), (1, float(t)), boite)
        S.ligne(R(*a), R(*b), c, l=1.8)
        S.texte(R(*b) + [-4, -14 if t > 0 else 14], nom, c, ancre='end')
    a, b = segment_boite((0, 0), F, boite)
    S.ligne(R(*a), R(*b), 'r', l=2)
    S.texte(R(*b) + [12, 6], 'F', 'r', ancre='start')
    X = R(*map(float, x))
    for (ff, gg), c in [((f1, g1), 'b'), ((f2, g2), 'v')]:
        P, Q = R(*map(float, ff)), R(*map(float, gg))
        S.ligne(X, P, c, d=True)
        S.ligne(X, Q, c, d=True)
        S.fleche(R(0, 0), P, c, retrait=3)
        S.point(Q, c)
    S.point(R(0, 0))
    S.texte(R(0, 0) + [-8, 14], '0', ancre='end')
    S.point(X, 't', r=4)
    S.texte(X + [10, -10], 'x', ancre='start')
    S.texte(R(*map(float, f1)) + [-10, 0], 'p(x)', 'b', ancre='end')
    S.texte(R(*map(float, f2)) + [-10, 0], 'p^′(x)', 'v', ancre='end')
    S.texte(R(*map(float, g1)) + [10, 12], 'x − p(x)', 'b', ancre='start')
    S.texte(R(*map(float, g2)) + [12, -14], 'x − p^′(x)', 'v', ancre='start')
    return S


@schema('v-quotient')
def v_quotient():
    # F = Vect(2, 1) ; classes x + F = droites y = x/2 + c ; G = Vect(0, 1), G' = Vect(1, -1).
    boite = (-3.2, 3.2, -2.1, 2.1)
    R = Repere(*boite, 25, 36, 450, 296)
    S = Schema(500, 346, 'Les éléments de E/F, droites parallèles à F, et deux supplémentaires G et G′')
    dF = np.array([2.0, 1.0])
    cs = [-1.5, -0.75, 0.75, 1.5]
    for c in cs:
        a, b = segment_boite((0, c), dF, boite)
        S.ligne(R(*a), R(*b), 't' if c == 0.75 else 'g', l=1.6 if c == 0.75 else None)
    a, b = segment_boite((0, 0), dF, boite)
    S.ligne(R(*a), R(*b), 'r', l=2)
    S.texte(R(*b) + [-4, 16], 'F', 'r', ancre='end')
    for d, c, nom, dec in [((0, 1), 'b', 'G', [10, 10]), ((1, -1), 'v', 'G^′', [-16, -4])]:
        a, b = segment_boite((0, 0), d, boite)
        S.ligne(R(*a), R(*b), c, l=1.6)
        S.texte(R(*b) + dec, nom, c, ancre='start' if c == 'b' else 'end')
    for c in [0.0] + cs:
        # intersection de la classe (0, c) + F avec G et avec G' : un point exactement
        for d, col in [((0, 1), 'b'), ((1, -1), 'v')]:
            M = np.array([[dF[0], -d[0]], [dF[1], -d[1]]])
            assert abs(np.linalg.det(M)) > 1e-9                 # F ∩ G = {0} : un seul point
            s, t = croix_lineaire(M, [0 - 0, 0 - c])
            P = np.array([0, c]) + s * dF
            assert np.allclose(P, t * np.array(d, float))
            S.point(R(*P), col, r=3.6)
    a, b = segment_boite((0, 0.75), dF, boite)
    S.texte(R(*b) + [-4, -14], 'x + F = π(x)', ancre='end')
    S.texte(R(0, 0) + [10, 12], '0', ancre='start')
    return S


@schema('v-rang')
def v_rang():
    S = Schema(520, 380, 'Base du noyau complétée en base de E, et images des vecteurs de base dans F')
    cE, cF = np.array([180, 195]), np.array([405, 195])
    S.poly(blob(cE, 92, 168, graine=3, amplitude=0.04), 'g', ferme=True)
    S.poly(blob(cF, 92, 168, graine=5, amplitude=0.04), 'g', ferme=True)
    S.texte(cE + [0, -181], 'E', ancre='middle')
    S.texte(cF + [0, -181], 'F', ancre='middle')
    # noyau
    S.ellipse([cE[0], 112], 58, 72, 'r', rempli='r')
    S.texte([cE[0] + 46, 50], '`Ker` u', 'r', ancre='start', taille=15)
    ys_k = [72, 104, 152]
    noms_k = ['e_1', 'e_2', 'e_k']
    ys_n = [226, 258, 306]
    noms_n = ['e_{k+1}', 'e_{k+2}', 'e_n']
    xE = cE[0] - 4
    for y, nom in zip(ys_k, noms_k):
        S.point([xE, y], 'r')
        S.texte([xE - 10, y], nom, 'r', ancre='end', taille=15)
    S.texte([xE - 22, 130], '⋮', 'r', taille=15)
    for y, nom in zip(ys_n, noms_n):
        S.point([xE, y])
        S.texte([xE - 10, y], nom, ancre='end', taille=15)
    S.texte([xE - 22, 284], '⋮', taille=15)
    # image : 0 et Im u
    zero = np.array([cF[0] - 10, 112])
    S.point(zero, 'r', r=4)
    S.texte(zero + [12, 0], '0', 'r', ancre='start')
    S.ellipse([cF[0] + 2, 266], 62, 72, 'b', rempli='b')
    S.texte([cF[0] + 30, 340], '`Im` u', 'b', ancre='start', taille=15)
    xF = cF[0] - 20
    for y in ys_k:
        S.fleche([xE + 6, y], zero, 'g', retrait=6)
    for y, nom in zip(ys_n, noms_n):
        S.fleche([xE + 6, y], [xF, y], 't', retrait=4)
        S.point([xF, y], 'b')
        S.texte([xF + 8, y], 'u(' + nom + ')', 'b', ancre='start', taille=15)
    S.texte([xF + 30, 284], '⋮', 'b', taille=15)
    S.texte([280, 214], 'u', ancre='middle')
    p = accolade(S, 66, ys_k[0] - 8, ys_k[-1] + 8, 'r')
    S.texte(p + [-6, 0], 'k', 'r', ancre='end')
    p = accolade(S, 66, ys_n[0] - 8, ys_n[-1] + 8, 't')
    S.texte(p + [-6, 0], 'n − k', ancre='end')
    return S


@schema('v-dual')
def v_dual():
    # Bases (e1, e2) et (e1, e2') avec e2' = e1 + e2 : la forme e1* (coordonnée sur e1) change.
    e1, e2, e2p = np.array([1, 0]), np.array([0, 1]), np.array([1, 1])
    def forme(b1, b2):           # première forme de la base duale : x ↦ première coordonnée
        P = np.column_stack([b1, b2]).astype(float)
        return lambda x: np.linalg.solve(P, x)[0]
    phi, psi = forme(e1, e2), forme(e1, e2p)
    assert phi(e1) == 1 and psi(e1) == 1 and phi(e2) == 0 and psi(e2p) == 0
    assert phi(e2p) == 1 and abs(psi(e2) + 1) < 1e-12            # les deux formes diffèrent
    S = Schema(520, 250, 'Lignes de niveau de la première forme duale pour deux bases ayant le même e1')
    boite = (-1.45, 2.45, -0.95, 1.55)
    for k, (b2, nom2, c) in enumerate([(e2, 'e_2', 'b'), (e2p, 'e_2^′', 'v')]):
        R = Repere(*boite, 15 + 258 * k, 30, 232, 232 * 2.5 / 3.9)
        fn = forme(e1, b2)
        for niv in [-1, 0, 1, 2]:
            p0 = niv * e1                                     # point où la forme vaut niv
            assert abs(fn(p0) - niv) < 1e-12 and abs(fn(p0 + b2) - niv) < 1e-12
            a, b = segment_boite(p0, b2, boite)
            S.ligne(R(*a), R(*b), c, d=(niv != 1), l=1.8 if niv == 1 else None)
            S.texte(R(*b) + [0, -11], f'{niv}'.replace('-', '−'), c, taille=15)
        S.fleche(R(0, 0), R(*e1), 'r', l=2)
        S.fleche(R(0, 0), R(*b2), c, l=2)
        S.texte(R(*e1) + [4, 14], 'e_1', 'r', ancre='start')
        S.texte(R(*b2) + [-6, -4], nom2, c, ancre='end')
        S.texte([15 + 258 * k + 116, 222], '`base` (e_1, ' + nom2 + ')', 't', taille=15)
    return S


@schema('v-determinant')
def v_determinant():
    mats = [np.array([[2, 1], [1, 3]]), np.array([[1, 2], [2, 1]])]
    dets = [round(np.linalg.det(A)) for A in mats]
    assert dets == [5, -3]
    S = Schema(520, 304, 'Image du carré unité par deux applications linéaires de déterminants 5 et −3')
    boite = (-0.4, 3.4, -0.4, 4.3)
    sc = 60
    for k, A in enumerate(mats):
        R = Repere(*boite, 20 + 262 * k, 14, 3.8 * sc, 4.7 * sc)
        R.axes(S, '', '')
        sq = np.array([[0, 0], [1, 0], [1, 1], [0, 1]])
        im = sq @ A.T
        aire = 0.5 * abs(sum(im[i, 0] * im[(i + 1) % 4, 1] - im[(i + 1) % 4, 0] * im[i, 1] for i in range(4)))
        assert abs(aire - abs(dets[k])) < 1e-12
        S.poly(R(im[:, 0], im[:, 1]), 'r', ferme=True, rempli='r')
        S.poly(R(sq[:, 0], sq[:, 1]), 'g', ferme=True, rempli='g')
        u1, u2 = A[:, 0], A[:, 1]
        S.fleche(R(0, 0), R(*u1), 'r', l=2)
        S.fleche(R(0, 0), R(*u2), 'b', l=2)
        S.texte(R(*u1) + ([10, 6] if k == 0 else [-8, -6]), 'u(e_1)', 'r', ancre='start' if k == 0 else 'end')
        S.texte(R(*u2) + ([-8, -6] if k == 0 else [10, 6]), 'u(e_2)', 'b', ancre='end' if k == 0 else 'start')
        # sens de rotation de u(e1) vers u(e2) : signe du déterminant
        a1, a2 = math.atan2(u1[1], u1[0]), math.atan2(u2[1], u2[0])
        assert (a2 > a1) == (dets[k] > 0)
        pts = np.array([R(1.05 * math.cos(t), 1.05 * math.sin(t)) for t in np.linspace(a1, a2, 30)])
        S.courbe_fleche(pts, 't')
        mil = np.mean(im, axis=0)
        S.texte(R(*mil) + [0, -4] if k == 0 else R(2.0, 3.55), f'`det` u = {dets[k]}'.replace('-', '−'), 't', taille=15)
    return S


# ================================================================ Galois

@schema('gs-correspondance')
def gs_correspondance():
    # L = ℚ(√2, √3), base (1, √2, √3, √6). Un automorphisme est donné par les signes (s2, s3) des images
    # de √2 et √3 ; σ = (-1, +1), τ = (+1, -1). On calcule le corps fixe de chaque sous-groupe d'ordre 2.
    base = ['1', '√2', '√3', '√6']
    def signes(g):
        s2, s3 = g
        return [1, s2, s3, s2 * s3]
    sigma, tau = (-1, 1), (1, -1)
    st = (sigma[0] * tau[0], sigma[1] * tau[1])
    fixe = {nom: [b for b, s in zip(base, signes(g)) if s == 1] for nom, g in
            [('σ', sigma), ('τ', tau), ('στ', st)]}
    assert fixe == {'σ': ['1', '√3'], 'τ': ['1', '√2'], 'στ': ['1', '√6']}
    # les seuls sous-groupes d'ordre 2 de G sont engendrés par σ, τ, στ (trois éléments d'ordre 2)
    G = [(a, b) for a in (1, -1) for b in (1, -1)]
    assert sum(1 for g in G if g != (1, 1)) == 3
    S = Schema(520, 330, 'Treillis des corps intermédiaires de ℚ(√2, √3) et treillis renversé des sous-groupes de G')
    yh, ym, yb = 46, 165, 284
    gauche = {'L': (130, yh), '2': (48, ym), '3': (130, ym), '6': (212, ym), 'Q': (130, yb)}
    droite = {'1': (390, yh), 'τ': (304, ym), 'σ': (390, ym), 'στ': (476, ym), 'G': (390, yb)}
    noms_g = {'L': ('L = ℚ(√2, √3)', 't'), '2': ('ℚ(√2)', 'r'), '3': ('ℚ(√3)', 'b'), '6': ('ℚ(√6)', 'v'),
              'Q': ('ℚ', 't')}
    noms_d = {'1': ('{`id`}', 't'), 'τ': ('{`id`, τ}', 'r'), 'σ': ('{`id`, σ}', 'b'),
              'στ': ('{`id`, στ}', 'v'), 'G': ('G', 't')}
    for pos, noms in [(gauche, noms_g), (droite, noms_d)]:
        cles = list(pos)
        haut, bas = cles[0], cles[-1]
        for m in cles[1:4]:
            for a, b in [(haut, m), (m, bas)]:
                P, Q = np.array(pos[a], float), np.array(pos[b], float)
                u = (Q - P) / np.linalg.norm(Q - P)
                S.ligne(P + u * 16 / abs(u[1]), Q - u * 16 / abs(u[1]), 'g')
        for k, (x, y) in pos.items():
            s, c = noms[k]
            S.texte([x, y], s, c, taille=16)
    # correspondance aux deux extrémités
    for y in (yh, yb):
        S.fleche([222 if y == yh else 160, y], [352 if y == yh else 370, y], 'g', d=True, double=True, retrait=0)
    S.texte([283, yh - 16], 'L^H ↤ H', 'g', taille=15)
    S.texte([130, 318], 'corps', 'g', ui=True)
    S.texte([390, 318], 'sous-groupes', 'g', ui=True)
    return S


@schema('gs-abel-ruffini')
def gs_abel_ruffini():
    P = np.poly1d([1, 0, 0, 0, -4, 2])
    rac = np.roots(P.coeffs)
    reelles = np.sort(rac[np.abs(rac.imag) < 1e-9].real)
    cplx = rac[np.abs(rac.imag) > 1e-9]
    assert len(reelles) == 3 and len(cplx) == 2
    assert np.allclose(reelles, [-1.5185, 0.5085, 1.2436], atol=1e-4)
    assert abs(cplx[0] - np.conj(cplx[1])) < 1e-9
    cpt = (4 / 5) ** 0.25
    assert abs(np.polyval(np.polyder(P.coeffs), cpt)) < 1e-12
    assert [P(-2), P(0), P(1), P(2)] == [-22, 2, -1, 26]
    S = Schema(520, 300, 'Graphe de X⁵ − 4X + 2 et ses cinq racines complexes, échangées par la conjugaison')
    # graphe
    R = Repere(-1.68, 1.6, -4.2, 5.8, 14, 22, 232, 256)
    R.axes(S, 'x', '')
    xs = np.linspace(-1.655, 1.565, 400)
    S.poly(R(xs, P(xs)), 't', l=2)
    for c in (-cpt, cpt):
        S.ligne(R(c, 0), R(c, P(c)), 'g', d=True)
    for r in reelles:
        S.point(R(r, 0), 'b', r=4.2)
    S.texte(R(-cpt, 0) + [0, 15], '−c', 'g', taille=15)
    S.texte(R(cpt, 0) + [0, -14], 'c', 'g', taille=15)
    S.texte(R(1.05, P(1.5)) + [0, 0], 'P', ancre='end')
    # plan complexe
    Rc = Repere(-1.8, 1.6, -1.75, 1.75, 282, 22, 230, 236.6)
    Rc.axes(S, '', '')
    for r in reelles:
        S.point(Rc(r, 0), 'b', r=4.2)
    z1 = cplx[np.argmax(cplx.imag)]
    A, B = Rc(z1.real, z1.imag), Rc(z1.real, -z1.imag)
    pts = courbe_entre(A + [-6, 8], B + [-6, -8], courbure=0.35)
    S.courbe_fleche(pts, 'r')
    S.pointe(pts[0], pts[0] - pts[1], 'r')
    S.point(A, 'r', r=4.2)
    S.point(B, 'r', r=4.2)
    S.texte(A + [10, 0], 'z', 'r', ancre='start')
    S.texte(B + [10, 0], 'z̄', 'r', ancre='start')
    xg = pts[:, 0].min()
    S.texte([xg - 8, Rc(0, 0)[1] - 16], 'conjugaison', 'r', ui=True, ancre='end', taille=13)
    return S


# ================================================================ théorie algébrique des nombres

@schema('an-gauss')
def an_gauss():
    # α = 7 + 5i, β = 2 + i : α/β = (19 + 3i)/5, q = 4 + i, r = α − βq = −i.
    al, be = complex(7, 5), complex(2, 1)
    num = al * be.conjugate()
    Nb = int((be * be.conjugate()).real)
    x, y = Fr(int(num.real), Nb), Fr(int(num.imag), Nb)
    assert (x, y) == (Fr(19, 5), Fr(3, 5))
    m, n = round(x), round(y)
    assert (m, n) == (4, 1) and abs(x - m) <= Fr(1, 2) and abs(y - n) <= Fr(1, 2)
    q = complex(m, n)
    r = al - be * q
    assert r == -1j and abs(r) ** 2 == 1 < Nb
    assert (x - m) ** 2 + (y - n) ** 2 == Fr(1, 5) < 1
    S = Schema(500, 304, 'Le quotient α/β dans le réseau ℤ[i], le carré de côté 1 centré en q et le disque unité autour de q')
    R = Repere(1.45, 5.75, -0.45, 2.35, 25, 14, 430, 280)
    S.ligne(R(1.45, 0), R(5.75, 0), 'g')
    S.cercle(R(m, n), 100, 'g', d=True)
    S.rect(*R(m - 0.5, n + 0.5), 100, 100, 'r', rempli='r')
    for a in range(2, 6):
        for b in range(0, 3):
            S.point(R(a, b), 'g', r=3.4)
    for a in range(2, 6):
        S.texte(R(a, 0) + [0, 17], str(a), 'g', taille=15)
    S.texte(R(2, 1) + [-10, 0], 'i', 'g', ancre='end', taille=15)
    S.texte(R(2, 2) + [-10, 0], '2i', 'g', ancre='end', taille=15)
    S.point(R(m, n), 't', r=4.2)
    S.texte(R(m, n) + [10, -13], 'q = 4 + i', ancre='start')
    P = R(float(x), float(y))
    S.ligne(P, R(m, n), 'r')
    S.point(P, 'r', r=4.2)
    S.texte(P + [12, -2], 'α/β', 'r', ancre='start')
    S.texte(R(5.04, 0.36), 'N(z − q) < 1', 'g', ancre='start', taille=15)
    return S


@schema('an-gauss-2')
def an_gauss_2():
    pts13 = [(a, b) for a in range(-4, 5) for b in range(-4, 5) if a * a + b * b == 13]
    pts7 = [(a, b) for a in range(-4, 5) for b in range(-4, 5) if a * a + b * b == 7]
    assert len(pts13) == 8 and pts7 == []
    S = Schema(500, 380, 'Le cercle de rayon √13 passe par huit points de ℤ[i], celui de rayon √7 par aucun')
    k = 41
    R = Repere(-4.4, 4.4, -4.4, 4.4, 70, 10, 8.8 * k, 8.8 * k)
    S.ligne(R(-4.4, 0), R(4.4, 0), 'g')
    S.ligne(R(0, -4.4), R(0, 4.4), 'g')
    for a in range(-4, 5):
        for b in range(-4, 5):
            S.point(R(a, b), 'g', r=2.6)
    S.cercle(R(0, 0), math.sqrt(7) * k, 'b', d=True)
    S.cercle(R(0, 0), math.sqrt(13) * k, 'r')
    for p in pts13:
        S.point(R(*p), 'r', r=4.4)
    S.texte(R(2, 3) + [8, -10], '2 + 3i', 'r', ancre='start', taille=15)
    S.texte(R(3, 2) + [10, 4], '3 + 2i', 'r', ancre='start', taille=15)
    S.texte(R(-3.5, -3.5), '|z|^2 = 13', 'r', taille=15)
    S.texte(R(1.0, -1.5), '|z|^2 = 7', 'b', taille=15)
    return S


@schema('an-quadratiques')
def an_quadratiques():
    j = complex(-0.5, math.sqrt(3) / 2)
    assert abs(j ** 3 - 1) < 1e-12 and abs(j * j + j + 1) < 1e-12
    S = Schema(520, 290, 'Les réseaux ℤ[i], carré, et ℤ[j], hexagonal, avec leurs points de module 1')
    k = 52
    for col, (w, nom, nw) in enumerate([(1j, 'ℤ[i]', 'i'), (j, 'ℤ[j]', 'j')]):
        R = Repere(-2.3, 2.3, -2.3, 2.3, 18 + 262 * col, 10, 4.6 * k, 4.6 * k)
        S.ligne(R(-2.3, 0), R(2.3, 0), 'g')
        S.ligne(R(0, -2.3), R(0, 2.3), 'g')
        maille = [0, 1, 1 + w, w]
        S.poly(R([z.real for z in maille], [z.imag for z in maille]), 'b', ferme=True, rempli='b')
        S.cercle(R(0, 0), k, 'g', d=True)
        unites = []
        for a in range(-5, 6):
            for b in range(-5, 6):
                z = a + b * w
                if abs(z.real) <= 2.25 and abs(z.imag) <= 2.25:
                    if abs(abs(z) - 1) < 1e-9:
                        unites.append(z)
                    else:
                        S.point(R(z.real, z.imag), 't', r=2.8)
        assert len(unites) == (4 if col == 0 else 6)
        for z in unites:
            S.point(R(z.real, z.imag), 'r', r=4.4)
        S.texte(R(1, 0) + [8, 12], '1', 'r', ancre='start', taille=15)
        S.texte(R(w.real, w.imag) + [-8, -10], nw, 'r', ancre='end', taille=15)
        S.texte([18 + 262 * col + 2.3 * k, 278], nom)
    return S


@schema('an-unites')
def an_unites():
    s2 = math.sqrt(2)
    pts = []
    for k in range(4):                       # (1 + √2)^k = x + y√2, calcul exact dans ℤ[√2]
        x, y = 1, 0
        for _ in range(k):
            x, y = x + 2 * y, x + y
        pts.append((x, y))
    assert pts == [(1, 0), (1, 1), (3, 2), (7, 5)]
    assert [x * x - 2 * y * y for x, y in pts] == [1, -1, 1, -1]
    S = Schema(500, 370, 'Hyperboles x² − 2y² = 1 et −1 et puissances de 1 + √2 qui passent de l’une à l’autre')
    R = Repere(-0.3, 4.3, -0.3, 3.2, 20, 8, 460, 350)
    R.axes(S, 'x', 'y')
    xs = np.linspace(1, 4.3, 300)
    S.poly(R(xs, np.sqrt((xs ** 2 - 1) / 2)), 'b', l=1.8)
    xs = np.linspace(0, 4.3, 300)
    S.poly(R(xs, np.sqrt((xs ** 2 + 1) / 2)), 'v', l=1.8)
    S.ligne(R(0, 0), R(4.3, 4.3 / s2), 'g', d=True)
    S.texte(R(4.25, 1.2), 'x^2 − 2y^2 = 1', 'b', ancre='end', taille=15)
    S.texte(R(0.12, 1.95), 'x^2 − 2y^2 = −1', 'v', ancre='start', taille=15)
    noms = ['1', '1 + √2', '3 + 2√2']
    dec = [([12, -10], 'start'), ([-12, -12], 'end'), ([12, 12], 'start')]
    for (x, y), nom, (d, an) in zip(pts[:3], noms, dec):
        assert x * x - 2 * y * y in (1, -1)
        S.point(R(x, y), 'r', r=4.6)
        S.texte(R(x, y) + d, nom, 'r', ancre=an, taille=15)
    for (a, b), cb in zip(zip(pts[:2], pts[1:3]), (-0.3, 0.04)):
        c = courbe_entre(R(*a), R(*b), courbure=cb)
        S.courbe_fleche(c[5:-5], 'r', d=True)
    S.texte(R(2.15, 1.0), '× (1 + √2)', 'r', ancre='start', taille=15)
    return S


# ================================================================ théorie analytique des nombres

def _crible(N):
    s = np.ones(N + 1, bool)
    s[:2] = False
    for p in range(2, int(N ** 0.5) + 1):
        if s[p]:
            s[p * p::p] = False
    return s


@schema('nb-sommation')
def nb_sommation():
    # a_n = 1 si n est premier, φ(t) = t, x = 12. Dans le plan (φ, A) : le rectangle [0, φ(x)] × [0, A(x)]
    # se partage en bandes horizontales [0, φ(p_k)] × [k − 1, k] (aires a_p φ(p)) et en la région sous
    # l'escalier de A pour φ ∈ [φ(1), φ(x)] (aire ∫_1^x A φ').
    x = 12
    prem = [n for n in range(1, x + 1) if _crible(x)[n]]
    assert prem == [2, 3, 5, 7, 11]
    A = lambda t: sum(1 for p in prem if p <= t)
    somme = sum(prem)
    # ∫_1^x A(t) φ'(t) dt, φ' = 1, A constante par morceaux : calcul exact
    bornes = [1] + prem + [x]
    integ = sum(A(a) * (b - a) for a, b in zip(bornes[:-1], bornes[1:]))
    assert (somme, integ, A(x) * x) == (28, 32, 60) and A(x) * x == somme + integ
    # partage exact : bande k = [0, p_k] × [k − 1, k] ; un point (t, y) avec k − 1 ≤ y < k est sous
    # l'escalier ssi A(t) ≥ k ssi t ≥ p_k
    for k, p in enumerate(prem, 1):
        assert A(p - 0.5) < k <= A(p)
    S = Schema(520, 336, 'Sommation d’Abel pour la somme des nombres premiers inférieurs à 12')
    R = Repere(-0.3, 13.4, -0.35, 5.9, 34, 30, 450, 270)
    R.axes(S, 't', 'A')
    for k, p in enumerate(prem, 1):
        S.rect(*R(0, k), p * R.L / (R.xmax - R.xmin), R.H / (R.ymax - R.ymin), 'r', rempli='r')
        S.texte(R(p / 2, k - 0.5), str(p), 'r', taille=14)
    # région sous l'escalier
    contour = [(1, 0)]
    for k, p in enumerate(prem, 1):
        contour += [(p, k - 1), (p, k)]
    contour += [(x, A(x)), (x, 0)]
    S.poly(R(*np.array(contour, float).T), 'b', ferme=True, rempli='b')
    S.poly(R([0, x, x, 0], [A(x), A(x), 0, 0]), 't', ferme=True, l=1.6)
    for t in [1] + prem:
        S.texte(R(t, 0) + [0, 16], str(t), 'g', taille=14)
    S.texte(R(x, 0) + [0, 16], 'x', 'g', taille=15)
    for k in range(1, 6):
        S.texte(R(0, k) + [-8, 0], str(k), 'g', ancre='end', taille=14)
    S.texte(R(9.2, 1.3), '∫_1^x Aφ^′ = 32', 'b', taille=15)
    S.texte(R(4.2, 5.5), 'A(x)φ(x) = 60 = 28 + 32', ancre='middle', taille=15)
    return S


@schema('nb-newman')
def nb_newman():
    R_, m = 2.0, 0.8                          # rayon R et minimum m de la distance au complémentaire de W
    delta = min(m, R_) / 2
    th1 = math.acos(-delta / R_)
    assert math.pi / 2 < th1 < math.pi and abs(R_ * math.cos(th1) + delta) < 1e-12
    # C = arc θ ∈ [−θ1, θ1] puis segment sur Re z = −δ ; on vérifie C ⊂ U = {|z| < R + 1, Re z > −m}
    arcC = np.array([[R_ * math.cos(t), R_ * math.sin(t)] for t in np.linspace(-th1, th1, 200)])
    seg = np.array([[-delta, y] for y in np.linspace(R_ * math.sin(th1), -R_ * math.sin(th1), 50)])
    Cz = np.vstack([arcC, seg])
    assert np.all(np.hypot(Cz[:, 0], Cz[:, 1]) < R_ + 1) and np.all(Cz[:, 0] > -m)
    k = 56
    S = Schema(520, 392, 'Contour de Newman : arc de rayon R coupé par la droite Re z = −δ, dans l’ouvert U')
    Rp = Repere(-3.6, 3.75, -3.3, 3.3, 30, 15, 7.35 * k, 6.6 * k)
    # U : disque de rayon R + 1 coupé par Re z > −m
    tu = math.acos(-m / (R_ + 1))
    bordU = [(3 * math.cos(t), 3 * math.sin(t)) for t in np.linspace(-tu, tu, 200)]
    S.poly(Rp(*np.array(bordU).T), 'g', ferme=True, rempli='g', d=True)
    S.ligne(Rp(-3.6, 0), Rp(3.75, 0), 'g')
    S.ligne(Rp(0, -3.3), Rp(0, 3.3), 'g')
    # demi-cercle gauche C'_-
    S.poly(Rp(*arc((0, 0), R_, math.pi / 2, 3 * math.pi / 2).T), 'b', d=True, l=1.8)
    # contour C, orienté
    S.poly(Rp(*Cz.T), 'r', ferme=True, l=2.2)
    for t in (-0.9, 0.9):
        p, q = Rp(R_ * math.cos(t), R_ * math.sin(t)), Rp(R_ * math.cos(t + 0.05), R_ * math.sin(t + 0.05))
        S.pointe(q, q - p, 'r', taille=11, largeur=5)
    p, q = Rp(-delta, 0.1), Rp(-delta, -0.1)
    S.pointe(q, q - p, 'r', taille=11, largeur=5)
    S.point(Rp(0, 0), 't')
    S.texte(Rp(0, 0) + [7, -12], '0', ancre='start', taille=15)
    S.texte(Rp(R_, 0) + [8, 13], 'R', ancre='start', taille=15)
    S.texte(Rp(R_ + 1, 0) + [6, 13], 'R + 1', 'g', ancre='start', taille=15)
    S.point(Rp(-delta, 0), 'r', r=3)
    S.texte(Rp(-delta, 0) + [5, 15], '−δ', 'r', ancre='start', taille=15)
    S.point(Rp(-m, 0), 'g', r=3)
    S.texte(Rp(-m, 0) + [-6, -12], '−m', 'g', ancre='end', taille=15)
    S.texte(Rp(R_ * 0.72, R_ * 0.72) + [14, -12], 'C_+', 'r', ancre='start')
    S.texte(Rp(-delta, 1.0) + [8, 0], 'C_−', 'r', ancre='start')
    S.texte(Rp(-R_ * 0.71, R_ * 0.71) + [-10, -10], 'C^′_−', 'b', ancre='end')
    S.texte(Rp(2.2, 2.55), 'U', 'g', taille=17)
    return S


@schema('nb-tnp')
def nb_tnp():
    N = 10 ** 6
    s = _crible(N)
    n = np.arange(N + 1)
    th = np.cumsum(np.where(s, np.log(np.maximum(n, 1)), 0.0))
    pi = np.cumsum(s)
    assert pi[N] == 78498
    assert round(pi[1000] * math.log(1000) / 1000, 3) == 1.161
    assert round(pi[N] * math.log(N) / N, 3) == 1.084 and round(th[N] / N, 3) == 0.998
    # θ(x)/x < 1 sur [10, 10^6] (maximum aux entiers, θ étant constante sur [n, n + 1[) ; π(x) ln x / x > 1
    # pour x ≥ 17 (minimum sur [n, n + 1[ atteint en n + 1, ln x / x décroissant), mais pas pour x = 16
    assert (th[10:] / n[10:]).max() < 1
    assert np.all(pi[17:N] * np.log(n[18:N + 1]) / n[18:N + 1] > 1) and pi[16] * math.log(17) / 17 < 1
    # échantillonnage : chaque entier jusqu'à 3000 (avec la valeur juste avant l'entier suivant, θ et π
    # étant constantes sur [n, n + 1[), puis une grille géométrique d'entiers
    xs, yt, yp = [], [], []
    for v in range(10, 3000):
        for xx in (v, v + 1 - 1e-9):
            xs.append(xx); yt.append(th[v] / xx); yp.append(pi[v] * math.log(xx) / xx)
    for v in np.unique(np.geomspace(3000, N, 1500).astype(int)):
        xs.append(v); yt.append(th[v] / v); yp.append(pi[v] * math.log(v) / v)
    lx = np.log10(xs)
    S = Schema(520, 330, 'Les rapports θ(x)/x et π(x) ln x / x pour x de 10 à un million, en échelle logarithmique')
    R = Repere(0.85, 6.25, 0.45, 1.3, 44, 14, 450, 270)
    for e in range(1, 7):
        S.ligne(R(e, 0.45), R(e, 1.3), 'g', d=True)
        S.texte(R(e, 0.45) + [0, 16], f'10^{e}', 'g', taille=14)
    for yv in (0.6, 0.8, 1.0, 1.2):
        S.texte(R(0.85, yv) + [-6, 0], f'{yv:.1f}'.replace('.', ','), 'g', ancre='end', taille=14)
    S.ligne(R(0.85, 1.0), R(6.25, 1.0), 'g', l=1.4)
    S.ligne(R(0.85, 0.45), R(6.25, 0.45), 'g')
    S.poly(R(lx, yp), 'r', l=1.4)
    S.poly(R(lx, yt), 'b', l=1.4)
    for e in (3, 6):
        v = 10 ** e
        S.point(R(e, pi[v] * math.log(v) / v), 'r', r=3.8)
    S.point(R(6, th[N] / N), 'b', r=3.8)
    S.texte(R(3, pi[1000] * math.log(1000) / 1000) + [0, 22], '1,161', 'r', taille=14)
    S.texte(R(6, pi[N] * math.log(N) / N) + [-6, -15], '1,084', 'r', ancre='end', taille=14)
    S.texte(R(6, th[N] / N) + [-6, 14], '0,998', 'b', ancre='end', taille=14)
    S.texte(R(3.9, 1.24), 'π(x) `ln` x / x', 'r', ancre='start', taille=15)
    S.texte(R(2.6, 0.72), 'θ(x) / x', 'b', ancre='start', taille=15)
    return S


# ================================================================ groupes de Lie

def _enroulement(alpha, tours):
    """Segments de la courbe s ↦ (s mod 1, α s mod 1), s ∈ [0, tours], coupés aux recollements."""
    coupes = {0.0, float(tours)}
    coupes |= {float(k) for k in range(1, tours)}
    coupes |= {k / alpha for k in range(1, int(alpha * tours) + 1) if k / alpha < tours}
    cs = sorted(coupes)
    segs = []
    for a, b in zip(cs[:-1], cs[1:]):
        if b - a < 1e-12:
            continue
        m = (a + b) / 2
        ka, kb = math.floor(m), math.floor(alpha * m)
        segs.append(((a - ka, alpha * a - kb), (b - ka, alpha * b - kb)))
    return segs


@schema('li-cartan')
def li_cartan():
    S = Schema(520, 300, 'Le tore comme carré aux côtés identifiés : enroulement de pente 2/3, fermé, et de pente √2, dense')
    cote = 206
    exemples = [(2 / 3, 3, 'α = 2/3'), (math.sqrt(2), 12, 'α = √2')]
    for col, (alpha, tours, nom) in enumerate(exemples):
        x0, y0 = 40 + 262 * col, 22
        segs = _enroulement(alpha, tours)
        for (p, q) in segs:
            assert -1e-9 <= min(p + q) and max(p + q) <= 1 + 1e-9
        if col == 0:
            # α = 2/3 : la courbe revient au point de départ après 3 tours : sous-groupe fermé
            assert abs(alpha * tours - round(alpha * tours)) < 1e-12
        else:
            # α = √2 : les passages par le bord vertical sont 12 points distincts, et de plus en plus serrés
            hs = sorted((k * alpha) % 1 for k in range(tours))
            assert min(np.diff(hs)) > 1e-3 and len(set(np.round(hs, 9))) == tours
        P = lambda u, v: np.array([x0 + u * cote, y0 + (1 - v) * cote])
        S.rect(x0, y0, cote, cote, 'g', rempli='g')
        for (p, q) in segs:
            S.ligne(P(*p), P(*q), 'r', l=1.5)
        # identification des côtés : une flèche sur les côtés horizontaux, deux sur les verticaux
        for v in (0, 1):
            S.pointe(P(0.55, v), (1, 0), 't', taille=10, largeur=5)
        for u in (0, 1):
            S.pointe(P(u, 0.53), (0, -1), 't', taille=10, largeur=5)
            S.pointe(P(u, 0.6), (0, -1), 't', taille=10, largeur=5)
        S.texte(P(0, 0) + [0, 16], '0', 'g', taille=14)
        S.texte(P(1, 0) + [0, 16], '2π', 'g', taille=14)
        S.texte(P(0, 1) + [-8, 0], '2π', 'g', ancre='end', taille=14)
        S.texte(P(0.5, 0) + [0, 18], 't', 'g', taille=15)
        S.texte(P(0, 0.5) + [-8, 0], 'αt', 'g', ancre='end', taille=15)
        S.texte(P(0.5, 0) + [0, 46], nom, 'r')
    return S


@schema('li-petits')
def li_petits():
    # t = 3, δ = 0,6, pas s = 0,45 < δ : m = ⌊t/s⌋ = 6, ms = 2,7 dans la zone |u − t| ≤ δ.
    t, delta, s = Fr(3), Fr(3, 5), Fr(9, 20)
    m = math.floor(t / s)
    assert s < delta and m == 6 and m * s == Fr(27, 10) and abs(m * s - t) <= delta
    assert t - s < m * s <= t
    # aucun des multiples précédents n'est dans la zone : 5s = 2,25 < 2,4
    assert all(abs(k * s - t) > delta for k in range(m))
    S = Schema(560, 170, 'Les multiples kY avancent par pas de longueur s < δ : l’un tombe dans la zone interdite')
    R = Repere(-0.25, 4.1, -1, 1, 20, 10, 520, 150)
    y0 = 0
    # zone interdite |u − t| ≤ δ, en rouge
    S.surface([R(float(t - delta), -0.35), R(float(t + delta), -0.35), R(float(t + delta), 0.35), R(float(t - delta), 0.35)], 'r')
    S.fleche(R(0, y0), R(4.0, y0), 'g', l=1.6)
    S.texte(R(4.0, y0) + [4, -16], 'Z′', 'g', ancre='end', taille=16)
    for k in range(0, m + 1):
        u = float(k * s)
        c = 'r' if k == m else 'b'
        S.point(R(u, y0), c, r=5 if k == m else 3.6)
    S.texte(R(0, y0) + [0, 22], '0', 'g', taille=15)
    S.texte(R(float(s), y0) + [0, -18], 'Y', 'b', taille=15)
    S.texte(R(float(2 * s), y0) + [0, -18], '2Y', 'b', taille=15)
    S.texte(R(float(m * s), y0) + [0, -20], '6Y', 'r', taille=16)
    S.ligne(R(float(t), -0.35), R(float(t), 0.35), 'r', d=True)
    for u, nom in ((t - delta, 't − δ'), (t, 't = 3'), (t + delta, 't + δ')):
        S.texte(R(float(u), -0.35) + [0, 16], nom, 'r', taille=14)
    # le pas s, entre 0 et Y
    S.fleche(R(0, -0.62), R(float(s), -0.62), 'b', l=1.2, double=True)
    S.texte(R(float(s) / 2, -0.62) + [0, 16], 's', 'b', taille=15)
    return S


@schema('gs-lagrange')
def gs_lagrange():
    # ℤ/12ℤ en cadran ; classes k + H, H = {0, 4, 8} : quatre triangles équilatéraux disjoints.
    H = {0, 4, 8}
    classes = [sorted((k + h) % 12 for h in H) for k in range(4)]
    assert sorted(x for c in classes for x in c) == list(range(12))
    S = Schema(340, 330, 'Les quatre classes de H = {0, 4, 8} dans ℤ/12ℤ')
    O, R0 = np.array([170.0, 165.0]), 120.0
    P = lambda k: O + R0 * np.array([math.sin(2 * math.pi * k / 12), -math.cos(2 * math.pi * k / 12)])
    # les trois sommets d'une classe sont à 120° les uns des autres : triangle équilatéral
    for c in classes:
        d = [np.linalg.norm(P(c[i]) - P(c[(i + 1) % 3])) for i in range(3)]
        assert max(d) - min(d) < 1e-9
    S.cercle(O, R0, 'g', d=True)
    couleurs = ['r', 'b', 'v', 'o']
    for c, coul in zip(classes, couleurs):
        S.poly([P(k) for k in c], coul, ferme=True, l=2)
        for k in c:
            S.point(P(k), coul, r=5)
    for k in range(12):
        u = (P(k) - O) / R0
        S.texte(P(k) + 20 * u, str(k), couleurs[k % 4], taille=15)
    return S


@schema('v-comatrice')
def v_comatrice():
    import sympy as sp
    A = sp.Matrix([[2, 1, 0], [1, 3, 1], [0, 1, 4]])
    i0, j0 = 1, 0                      # ligne 2, colonne 1 (indices à partir de 0)
    mineur = A.minor_submatrix(i0, j0)
    assert mineur == sp.Matrix([[1, 0], [1, 4]]) and mineur.det() == 4 and A.cofactor(i0, j0) == -4
    S = Schema(520, 230, 'Cofacteur C₂₁ : on barre la ligne 2 et la colonne 1, puis on lit le signe sur le damier')
    pas, x0, y0 = 52, 50, 40
    C = lambda i, j: np.array([x0 + j * pas, y0 + i * pas])
    for i in range(3):
        for j in range(3):
            barre = (i == i0 or j == j0)
            S.texte(C(i, j), str(A[i, j]), 'g' if barre else 'r', taille=20)
    S.ligne(C(i0, 0) + [-22, 0], C(i0, 2) + [22, 0], 'g', l=2)
    S.ligne(C(0, j0) + [0, -22], C(2, j0) + [0, 22], 'g', l=2)
    S.texte(C(3, 1) + [0, -8], 'A', 't', taille=18)
    # mineur
    S.texte([250, y0 + pas], '⟶', 'g', taille=20)
    S.texte([305, y0 + pas / 2 - 4], '1', 'r', taille=18); S.texte([345, y0 + pas / 2 - 4], '0', 'r', taille=18)
    S.texte([305, y0 + 3 * pas / 2 - 4], '1', 'r', taille=18); S.texte([345, y0 + 3 * pas / 2 - 4], '4', 'r', taille=18)
    S.texte([325, y0 + 2 * pas + 14], 'Δ₂₁ = 4', 'r', taille=16)
    # damier des signes
    for i in range(3):
        for j in range(3):
            sg = '+' if (i + j) % 2 == 0 else '−'
            c = 'b' if (i, j) == (i0, j0) else 'g'
            S.texte([420 + j * 30, y0 + 20 + i * 30], sg, c, taille=19 if (i, j) == (i0, j0) else 16)
    S.texte([450, y0 + 2 * pas + 14], 'C₂₁ = −4', 'b', taille=16)
    return S


@schema('v-valeurs-propres')
def v_valeurs_propres():
    A = np.array([[2.0, 1.0], [1.0, 2.0]])
    w, V = np.linalg.eigh(A)
    assert np.allclose(w, [1, 3])
    s2 = math.sqrt(2)
    v3, v1 = np.array([1, 1]) / s2, np.array([1, -1]) / s2
    assert np.allclose(A @ v3, 3 * v3) and np.allclose(A @ v1, v1)
    S = Schema(420, 380, 'Le cercle unité, son image par A, et les deux droites propres')
    R = Repere(-3.0, 3.0, -2.6, 2.6, 20, 14, 380, 330)
    R.axes(S, '', '')
    t = np.linspace(0, 2 * math.pi, 241)
    cer = np.stack([np.cos(t), np.sin(t)])
    ell = A @ cer
    S.poly(R(cer[0], cer[1]), 'g', ferme=True, d=True)
    S.poly(R(ell[0], ell[1]), 't', ferme=True, l=1.6)
    for v, c in ((v3, 'r'), (v1, 'b')):
        S.ligne(R(*(-2.6 * v)), R(*(2.6 * v)), c, d=True)
    S.fleche(R(0, 0), R(*v3), 'r', l=2); S.fleche(R(0, 0), R(*(A @ v3)), 'r', l=3)
    S.fleche(R(0, 0), R(*v1), 'b', l=3)
    e1 = np.array([1.0, 0.0])
    S.fleche(R(0, 0), R(*e1), 'v', l=2); S.fleche(R(0, 0), R(*(A @ e1)), 'v', l=2)
    S.texte(R(*(A @ v3)) + [10, -8], 'Av = 3v', 'r', ancre='start', taille=15)
    S.texte(R(*v1) + [10, 12], 'Av = v', 'b', ancre='start', taille=15)
    S.texte(R(*(A @ e1)) + [8, 12], 'A(1, 0)', 'v', ancre='start', taille=14)
    return S
