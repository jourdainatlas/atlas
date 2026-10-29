"""Schémas du graphe ar-topo (topologie de ℝ).

Toute position est calculée ; toute affirmation illustrée est vérifiée par un assert.
"""
import numpy as np
from fractions import Fraction as Fr
from edifice_schemas import schema
from edifice_svg import Schema, Repere


def _intervalle_ouvert(S, R, u, v, h, c, l=2.2):
    """Intervalle ouvert ]u, v[ dessiné à la hauteur h, extrémités creuses."""
    S.ligne(R(u, h), R(v, h), c, l=l)
    S.point(R(u, h), c, r=3.6, creux=True)
    S.point(R(v, h), c, r=3.6, creux=True)


def _graduation(S, R, x, lab, c='t', dy=18, taille=16):
    S.ligne(R(x, 0) + [0, -5], R(x, 0) + [0, 5], 'g')
    S.texte(R(x, 0) + [0, dy], lab, c, taille=taille)


@schema('tr-borel-lebesgue')
def tr_borel_lebesgue():
    a, b = Fr(0), Fr(1)
    bleus = [(Fr(-15, 100), Fr(30, 100)), (Fr(20, 100), Fr(50, 100))]
    c, r = Fr(55, 100), Fr(20, 100)
    rouge = (c - r, c + r)
    gris = [(Fr(70, 100), Fr(90, 100)), (Fr(85, 100), Fr(110, 100))]
    x = Fr(42, 100)
    y = c + r / 2
    # la famille entière recouvre [a, b] (les intervalles se chevauchent de proche en proche)
    tous = sorted(bleus + [rouge] + gris)
    assert tous[0][0] < a and tous[-1][1] > b
    assert all(tous[i + 1][0] < tous[i][1] for i in range(len(tous) - 1))
    # [a, x] est recouvert par les deux ouverts bleus
    assert bleus[0][0] < a and bleus[1][0] < bleus[0][1] and x < bleus[1][1]
    # x est dans E et c - r < x <= c : c - r ne majore pas E
    assert c - r < x <= c
    # [a, y] est recouvert par les bleus et O_k, et y > c
    assert y < c + r and y > c and x > c - r
    assert y < b                                      # on est bien dans le cas c < b, supposé

    S = Schema(520, 250, 'Borel-Lebesgue : les ouverts bleus recouvrent [a, x], O_k prolonge jusqu’à y > c')
    R = Repere(-0.25, 1.2, -0.6, 3.6, 20, 10, 480, 220)
    S.ligne(R(-0.25, 0), R(1.2, 0), 'g')
    S.ligne(R(a, 0), R(b, 0), 't', l=2)
    S.ligne(R(a, 0), R(x, 0), 'b', l=4)
    S.ligne(R(x, 0), R(y, 0), 'r', l=4)
    for (u, v), h in zip(bleus, [1, 2]):
        _intervalle_ouvert(S, R, u, v, h, 'b')
    _intervalle_ouvert(S, R, *rouge, 3, 'r')
    for (u, v), h in zip(gris, [1, 2]):
        _intervalle_ouvert(S, R, u, v, h, 'g', l=1.6)
    S.texte(R(rouge[1], 3) + [10, 0], 'O_k', 'r', ancre='start', taille=16)
    S.texte(R(bleus[0][0], 1) + [-10, 0], 'O_j', 'b', ancre='end', taille=16)
    for xx, lab, col in [(a, 'a', 't'), (x, 'x', 'b'), (c, 'c', 'r'), (y, 'y', 'r'), (b, 'b', 't')]:
        _graduation(S, R, xx, lab, col)
    S.ligne(R(c, 0), R(c, 3), 'g', d=True)
    S.point(R(c, 0), 'r', r=4)
    S.texte(R(0.95, 2.55), 'reste du recouvrement', 'g', ui=True, taille=13)
    return S


@schema('tr-connexes')
def tr_connexes():
    a, b, c, r = Fr(0), Fr(1), Fr(55, 100), Fr(16, 100)
    y = max(a, c - r / 2)           # cas c ∈ V
    x = min(b, c + r / 2)           # cas c ∈ U
    assert a <= y < c and c - r < y < c + r        # y ∈ [a, c[ ⊂ U et y dans la boule ⊂ V
    assert c < x < c + r and x <= b                 # ]c, x] ⊂ boule ⊂ U, donc x ∈ E et x > c

    S = Schema(520, 300, 'Connexité d’un intervalle : les deux cas c dans V, c dans U')
    for k, h0 in enumerate([30, 170]):
        R = Repere(-0.12, 1.12, -1, 1.6, 20, h0, 480, 100)
        S.ligne(R(-0.12, 0), R(1.12, 0), 'g')
        S.ligne(R(a, 0), R(b, 0), 't', l=1.6)
        # [a, c[ ⊂ U, en bleu
        S.ligne(R(a, 0), R(c, 0), 'b', l=4)
        _intervalle_ouvert(S, R, c - r, c + r, 0.9, 'r')
        S.ligne(R(c, 0), R(c, 0.9), 'g', d=True)
        _graduation(S, R, a, 'a')
        _graduation(S, R, b, 'b', 'v')
        S.point(R(b, 0), 'v', r=3.6)
        S.point(R(a, 0), 'b', r=3.6)
        if k == 0:
            S.point(R(c, 0), 'v', r=4.2)
            _graduation(S, R, c, 'c', 'v')
            S.texte(R(c + r, 0.9) + [10, 0], 'boule ⊂ V', 'r', ancre='start', ui=True, taille=14)
            S.point(R(y, 0), 'r', r=4.2)
            S.texte(R(y, 0) + [0, 18], 'y', 'r', taille=16)
            S.texte(R(-0.12, 1.45), 'si c ∈ V : y serait dans U et dans V', 'g', ancre='start', ui=True, taille=14)
        else:
            S.point(R(c, 0), 'b', r=4.2)
            _graduation(S, R, c, 'c', 'b')
            S.ligne(R(c, 0), R(x, 0), 'b', l=4)
            S.texte(R(c + r, 0.9) + [10, 0], 'boule ⊂ U', 'r', ancre='start', ui=True, taille=14)
            S.point(R(x, 0), 'r', r=4.2)
            S.texte(R(x, 0) + [0, 18], 'x', 'r', taille=16)
            S.texte(R(-0.12, 1.45), 'si c ∈ U : x serait dans E et dépasserait c', 'g', ancre='start', ui=True,
                    taille=14)
        S.texte(R((a + c) / 2, 0) + [0, -14], '[a, c[ ⊂ U', 'b', ui=True, taille=14)
    return S


@schema('tr-ouverts')
def tr_ouverts():
    a, b = Fr(0), Fr(1)
    xs = [Fr(6, 100), Fr(22, 100), Fr(1, 2), Fr(72, 100), Fr(93, 100)]
    rayons = [min(x - a, b - x) for x in xs]
    for x, r in zip(xs, rayons):
        assert r > 0 and a <= x - r and x + r <= b          # la boule est incluse dans ]a, b[
        assert x - r == a or x + r == b                     # elle touche l'extrémité la plus proche
    assert rayons[0] < rayons[1] < rayons[2] > rayons[3] > rayons[4]   # le rayon diminue vers le bord

    S = Schema(520, 260, 'Ouvert ]a, b[ : une boule autour de chaque point, de rayon de plus en plus petit vers le bord')
    R = Repere(-0.12, 1.12, -0.55, 5.6, 20, 10, 480, 240)
    S.ligne(R(-0.12, 0), R(1.12, 0), 'g')
    S.ligne(R(a, 0), R(b, 0), 'r', l=4)
    S.point(R(a, 0), 'r', r=4, creux=True)
    S.point(R(b, 0), 'r', r=4, creux=True)
    _graduation(S, R, a, 'a', 'r')
    _graduation(S, R, b, 'b', 'r')
    hauteurs = [1, 2, 3, 4, 5]
    for x, r, h in zip(xs, rayons, hauteurs):
        _intervalle_ouvert(S, R, x - r, x + r, h, 'b', l=2)
        S.ligne(R(x, 0), R(x, h), 'g', d=True)
        S.point(R(x, h), 'b', r=3.4)
        bord = a if x - r == a else b
        S.ligne(R(bord, 0), R(bord, h), 'g', d=True)
    S.point(R(xs[2], 0), 'b', r=3.6)
    S.texte(R(xs[2], 0) + [0, 18], 'x', 'b', taille=16)
    S.texte(R(xs[2], 3) + [0, -15], 'r = `min`(x − a, b − x)', 'b', taille=15)
    return S


@schema('tr-adherence')
def tr_adherence():
    # A = [1/10, 7/20] ∪ {1/2} ∪ ]31/50, 9/10[ ; sa borne supérieure 9/10 n'est pas dans A
    seg1, isole, seg2 = (Fr(1, 10), Fr(7, 20)), Fr(1, 2), (Fr(31, 50), Fr(9, 10))
    dans_A = lambda t: seg1[0] <= t <= seg1[1] or t == isole or seg2[0] < t < seg2[1]
    s = seg2[1]
    assert not dans_A(s) and all(not dans_A(s + Fr(k, 1000)) for k in range(1, 200))   # s majore A
    assert all(dans_A(s - Fr(1, k)) for k in range(4, 1000))                             # et c'est le plus petit
    cas = [(Fr(1, 5), Fr(3, 4)), (Fr(7, 100), Fr(22, 25))]       # (r, a) avec a ∈ A ∩ ]s - r, s]
    for r, pa in cas:
        assert dans_A(pa) and s - r < pa <= s

    S = Schema(520, 230, 'La borne supérieure s de A est adhérente : chaque boule de centre s contient un point de A')
    R = Repere(-0.02, 1.2, -0.75, 2.75, 20, 10, 480, 210)
    S.ligne(R(-0.02, 0), R(1.2, 0), 'g')
    S.ligne(R(seg1[0], 0), R(seg1[1], 0), 'r', l=4)
    S.point(R(seg1[0], 0), 'r', r=3.6)
    S.point(R(seg1[1], 0), 'r', r=3.6)
    S.point(R(isole, 0), 'r', r=4)
    S.ligne(R(seg2[0], 0), R(seg2[1], 0), 'r', l=4)
    S.point(R(seg2[0], 0), 'r', r=3.6, creux=True)
    S.point(R(s, 0), 'r', r=4.2, creux=True)
    S.texte(R((seg1[0] + seg1[1]) / 2, 0) + [0, -16], 'A', 'r', taille=17)
    S.texte(R(s, 0) + [0, 20], 's = `sup` A', 'r', taille=16)
    for k, ((r, pa), h) in enumerate(zip(cas, [2, 1])):
        _intervalle_ouvert(S, R, s - r, s + r, h, 'b', l=2)
        S.ligne(R(pa, 0), R(pa, h), 'g', d=True)
        S.point(R(pa, h), 'b', r=4)
        S.point(R(pa, 0), 'b', r=4)
        S.texte(R(pa, h) + [0, -16], 'a' if k == 0 else 'a^{′}', 'b', taille=16)
    S.ligne(R(s, 0), R(s, 2), 'g', d=True)
    S.texte(R(s - cas[0][0], 2) + [-10, 0], 's − r', 'b', ancre='end', taille=16)
    return S


@schema('tr-adherence-2')
def tr_adherence_2():
    N = 30
    A = [Fr(1, n) for n in range(1, N + 1)]
    r0 = Fr(3, 20)                                    # boule centrée en 0
    dedans = [q for q in A if abs(q) < r0]
    assert dedans and all(Fr(1, n) < r0 for n in range(7, 10 ** 4)) and Fr(1, 6) > r0   # n >= 7
    x = Fr(5, 12)                                     # entre 1/3 et 1/2
    rx = min(x - Fr(1, 3), Fr(1, 2) - x)
    assert rx > 0 and all(abs(Fr(1, n) - x) >= rx for n in range(1, 10 ** 4))     # la boule évite A

    S = Schema(520, 200, 'A = {1/n} : 0 est adhérent, un point entre deux termes ne l’est pas')
    R = Repere(-0.2, 1.12, -0.9, 2.4, 20, 10, 480, 180)
    S.ligne(R(-0.2, 0), R(1.12, 0), 'g')
    _intervalle_ouvert(S, R, -r0, r0, 1.4, 'b', l=2)
    S.ligne(R(0, 0), R(0, 1.4), 'g', d=True)
    _intervalle_ouvert(S, R, x - rx, x + rx, 1.4, 'v', l=2)
    S.ligne(R(x, 0), R(x, 1.4), 'g', d=True)
    for q in A:
        S.point(R(q, 0), 'b' if q < r0 else 't', r=2.6 if q < Fr(1, 8) else 3.4)
    S.point(R(0, 0), 'r', r=4.2, creux=True)
    S.point(R(x, 0), 'v', r=3.6)
    S.texte(R(0, 0) + [0, 20], '0', 'r', taille=16)
    for n in (1, 2, 3):
        S.texte(R(Fr(1, n), 0) + [0, 20], '1' if n == 1 else f'1/{n}', taille=15)
    S.texte(R(x, 0) + [9, -13], 'x', 'v', ancre='start', taille=16)
    S.texte(R(0, 1.4) + [0, -18], 'contient les 1/n, n ⩾ 7', 'b', ancre='start', ui=True, taille=14)
    S.texte(R(x + rx, 1.4) + [10, 0], 'évite A', 'v', ancre='start', ui=True, taille=14)
    return S


@schema('tr-sequentielle')
def tr_sequentielle():
    x = Fr(0)
    A = [(-1) ** k * Fr(3, 2 * k) for k in range(2, 25)]
    assert x not in A and all(abs(q - x) > 0 for q in A)
    choix = {1: Fr(3, 4), 2: Fr(-3, 10), 3: Fr(1, 4), 4: Fr(-1, 6), 5: Fr(3, 20)}
    for n, an in choix.items():
        boule = [q for q in A if abs(q - x) < Fr(1, n)]
        assert an in boule and len(boule) >= 2            # plusieurs candidats : il faut choisir
    S = Schema(520, 300, 'Réciproque : un point a_n choisi dans chaque boule de rayon 1/n')
    R = Repere(-1.12, 1.12, -0.7, 5.6, 20, 12, 480, 280)
    S.ligne(R(-1.12, 0), R(1.12, 0), 'g')
    for q in A:
        S.point(R(q, 0), 't', r=2.6)
    for n, an in choix.items():
        h = n
        _intervalle_ouvert(S, R, x - Fr(1, n), x + Fr(1, n), h, 'b', l=2)
        S.ligne(R(an, 0), R(an, h), 'o', d=True)
        S.point(R(an, h), 'o', r=4.2)
        S.texte(R(an, h) + [0, -15], f'a_{n}', 'o', taille=16)
    S.ligne(R(x, 0), R(x, 5), 'g', d=True)
    S.point(R(x, 0), 'r', r=4.2, creux=True)
    S.texte(R(x, 0) + [0, 20], 'x', 'r', taille=16)
    S.texte(R(-1, 0) + [0, 20], 'x − 1', 'b', taille=15)
    S.texte(R(1, 0) + [0, 20], 'x + 1', 'b', taille=15)
    S.texte(R(Fr(-1, 2), 0) + [0, -18], 'A', taille=17)
    return S


@schema('tr-sphere')
def tr_sphere():
    t = np.linspace(0, 2 * np.pi, 241)
    cx, cy = np.cos(t), np.sin(t)
    assert np.allclose(cx ** 2 + cy ** 2, 1) and np.all(np.abs(cx) <= 1) and np.all(np.abs(cy) <= 1)   # S¹ ⊂ P
    S0 = [Fr(-1), Fr(1)]
    assert all(z * z == 1 for z in S0)
    U, V = (Fr(-2), Fr(0)), (Fr(0), Fr(2))
    assert U[0] < -1 < U[1] <= V[0] < 1 < V[1]           # chaque ouvert capte un point, et ils sont disjoints

    S = Schema(520, 260, 'S¹ dans le carré [-1, 1]², et S⁰ coupé par deux ouverts disjoints')
    # à gauche : le plan, le carré P et le cercle
    R = Repere(-1.45, 1.45, -1.45, 1.45, 12, 18, 224, 224)
    R.axes(S, '', '')
    P = [R(-1, -1), R(1, -1), R(1, 1), R(-1, 1)]
    S.poly(P, 'g', ferme=True, rempli='g')
    S.poly(R(cx, cy), 'r', l=2.4)
    for v in (-1, 1):
        S.texte(R(v, 0) + [(-6 if v < 0 else 6), 13], '−1' if v < 0 else '1', 'g', ancre='end' if v < 0 else 'start',
                taille=15)
    u = (np.sqrt(3) / 2, 1 / 2)                         # point du cercle d'où part le renvoi de l'étiquette
    assert abs(u[0] ** 2 + u[1] ** 2 - 1) < 1e-12
    S.ligne(R(*u), R(1, 0.62) + [10, 0], 'r')
    S.texte(R(1, 0.62) + [13, 0], 'S^1', 'r', ancre='start', taille=17)
    S.texte(R(1, -1) + [8, 2], 'P', 'g', ancre='start', taille=17)
    # à droite : la droite réelle et S⁰
    Q = Repere(-2.6, 2.6, -0.8, 2.4, 262, 40, 248, 180)
    S.ligne(Q(-2.6, 0), Q(2.6, 0), 'g')
    _intervalle_ouvert(S, Q, *U, 1, 'b', l=2)
    _intervalle_ouvert(S, Q, *V, 1.8, 'v', l=2)
    for z in S0:
        S.point(Q(z, 0), 'r', r=4.6)
        S.ligne(Q(z, 0), Q(z, 1 if z < 0 else 1.8), 'g', d=True)
    for z, lab in [(-2, '−2'), (-1, '−1'), (0, '0'), (1, '1'), (2, '2')]:
        S.ligne(Q(z, 0) + [0, -4], Q(z, 0) + [0, 4], 'g')
        S.texte(Q(z, 0) + [0, 18], lab, 'r' if abs(z) == 1 else 'g', taille=15)
    S.texte(Q(0, 0) + [0, 42], 'S^0 = {−1, 1}', 'r', taille=16)
    return S


@schema('tr-tychonov')
def tr_tychonov():
    # Produit X_1 × X_2 (ici le carré [0, 1]²), point limite x = (x_1, x_2), voisinages U_1, U_2,
    # bandes p_1^{-1}(U_1), p_2^{-1}(U_2), cylindre U_1 × U_2, et un élément A de l'ultrafiltre.
    x1, x2 = 0.56, 0.47
    U1, U2 = (0.43, 0.70), (0.31, 0.63)
    assert U1[0] < x1 < U1[1] and U2[0] < x2 < U2[1]
    S = Schema(520, 380, 'Un cylindre ouvert autour de x est l’intersection de deux bandes, chacune dans 𝒱')
    R = Repere(0, 1, 0, 1, 92, 40, 330, 270)
    coin = lambda u, v: (R(u[0], v[1]), R(u[1], v[0]))
    # bande verticale p_1^{-1}(U_1) (bleu) et bande horizontale p_2^{-1}(U_2) (vert)
    # cylindre U_1 × U_2 (rouge) : on vérifie sur une grille qu'un point y est si et seulement s'il est
    # dans les deux bandes, et que le dessin (bandes remplies hors du cylindre) couvre chaque point une fois
    cyl = (U1, U2)
    g = np.linspace(0.005, 0.995, 199)
    for u in g:
        for v in g:
            dans_b, dans_v = U1[0] < u < U1[1], U2[0] < v < U2[1]
            dans_c = cyl[0][0] < u < cyl[0][1] and cyl[1][0] < v < cyl[1][1]
            assert dans_c == (dans_b and dans_v)
    # remplissages disjoints : bande bleue au-dessus et au-dessous du cylindre, verte à gauche et à droite
    for u, v, c in [(U1, (U2[1], 1), 'b'), (U1, (0, U2[0]), 'b'), ((0, U1[0]), U2, 'v'), ((U1[1], 1), U2, 'v'),
                    (U1, U2, 'r')]:
        (a, b) = coin(u, v)
        S.surface([a, (b[0], a[1]), b, (a[0], b[1])], c)
    for u, v, c in [(U1, (0, 1), 'b'), ((0, 1), U2, 'v'), (U1, U2, 'r')]:
        (a, b) = coin(u, v)
        S.rect(a[0], a[1], b[0] - a[0], b[1] - a[1], c)
    S.rect(R(0, 1)[0], R(0, 1)[1], R(1, 0)[0] - R(0, 1)[0], R(1, 0)[1] - R(0, 1)[1], 't')
    # un élément A de l'ultrafiltre, qui rencontre le cylindre (le cylindre est dans 𝒱)
    from edifice_svg import blob
    A = blob((0.36, 0.66), 0.17, 0.15, graine=3, amplitude=0.1)
    dedans = [(U1[0] < u < U1[1]) and (U2[0] < v < U2[1]) for u, v in A]
    assert any(dedans) and not all(dedans)
    assert A[:, 0].min() > 0.02 and A[:, 0].max() < 0.98 and A[:, 1].min() > 0.02 and A[:, 1].max() < 0.98
    S.poly(R(A[:, 0], A[:, 1]), 't', ferme=True, l=1.8)
    S.texte(R(0.24, 0.84), 'A', 't')
    # le point x et ses coordonnées
    S.point(R(x1, x2), 'r', r=4.4)
    S.texte(R(x1, x2) + [10, -10], 'x', 'r', ancre='start')
    for (u, v), lab, c, y in [(U1, 'U_1', 'b', 26)]:
        S.ligne(R(u, 0) + [0, y], R(v, 0) + [0, y], c, l=3.2)
        S.texte(R(v, 0) + [8, y], lab, c, ancre='start', taille=16)
    S.point(R(x1, 0) + [0, 26], 'r', r=3.6)
    S.texte(R(x1, 0) + [0, 46], 'x_1', 'r', taille=16)
    S.ligne(R(1, U2[0]) + [26, 0], R(1, U2[1]) + [26, 0], 'v', l=3.2)
    S.texte(R(1, U2[1]) + [26, -14], 'U_2', 'v', taille=16)
    S.point(R(1, x2) + [26, 0], 'r', r=3.6)
    S.texte(R(1, x2) + [38, 0], 'x_2', 'r', ancre='start', taille=16)
    # noms des bandes
    S.texte(R((U1[0] + U1[1]) / 2, 1) + [0, -14], 'p_1^{−1}(U_1)', 'b', taille=15)
    S.texte(R(0, (U2[0] + U2[1]) / 2) + [-8, 0], 'p_2^{−1}(U_2)', 'v', ancre='end', taille=15)
    S.texte(R(1, 0) + [0, 46], 'X_1', 'g', ancre='end')
    S.texte(R(0, 1) + [-8, 4], 'X_2', 'g', ancre='end')
    return S
