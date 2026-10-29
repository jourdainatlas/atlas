"""Schémas du graphe ac (algèbre commutative).

Chaque figure calcule ce qu'elle montre : exposants du sous-anneau K[X², X³], idéaux de coefficients
dominants de (4, 2X, X²), bijection chinoise de ℤ/12ℤ, points du spectre de ℤ vus par deux localisés.
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema


# ------------------------------------------------------------------ ac-divisibilite
@schema('ac-divisibilite')
def ac_divisibilite():
    # exposants des monômes de A = {P : coefficient de X nul} : 0 et les entiers >= 2
    expo = [k for k in range(0, 9) if k != 1]
    # 6 = 2+2+2 = 3+3, et les seules écritures de 6 en parts irréductibles (2 et 3, qui ne sont pas
    # sommes de deux exposants non nuls de A)
    irr = [k for k in expo if k > 0 and not any(a > 0 and b > 0 and a + b == k for a in expo for b in expo)]
    assert irr == [2, 3]
    S = Schema(520, 190, 'Exposants des monômes de K[X², X³] et deux factorisations de X⁶')
    x0, pas, y = 40, 56, 100
    S.ligne([x0 - 14, y], [x0 + 8 * pas + 14, y], 'g')
    for k in range(0, 9):
        p = np.array([x0 + k * pas, y])
        if k == 1:
            S.point(p, 'g', r=5, creux=True)
        else:
            S.point(p, 'r' if k == 6 else 't', r=4.2)
        S.texte(p + [0, 24], str(k), 'g' if k == 1 else 't', taille=15)
    # arcs : bleu au-dessus (pas de 2), rouge au-dessous (pas de 3)
    def arc(a, b, c, haut):
        pa, pb = np.array([x0 + a * pas, y]), np.array([x0 + b * pas, y])
        m = (pa + pb) / 2
        r = (b - a) * pas / 2
        t = np.linspace(math.pi - 0.18, 0.18, 40)
        sg = -1 if haut else 1
        pts = np.stack([m[0] + r * np.cos(t), y + sg * 0.55 * r * np.sin(t)], axis=1)
        S.courbe_fleche(pts, c)
    for a in (0, 2, 4):
        arc(a, a + 2, 'b', True)
    for a in (0, 3):
        arc(a, a + 3, 'r', False)
    assert 2 + 2 + 2 == 6 == 3 + 3
    S.texte([x0 + 2 * pas, 30], '2 + 2 + 2', 'b', taille=15)
    S.texte([x0 + 3 * pas, 178], '3 + 3', 'r', taille=15)
    return S


# ------------------------------------------------------------------ ac-hilbert
@schema('ac-hilbert')
def ac_hilbert():
    # I = (4, 2X, X^2) dans Z[X] : on calcule L_d par un balayage des combinaisons 4U + 2XV + X^2 W
    import itertools
    def produit(P, Q):
        R = [0] * (len(P) + len(Q) - 1)
        for i, a in enumerate(P):
            for j, b in enumerate(Q):
                R[i + j] += a * b
        return R
    gens = [[4], [0, 2], [0, 0, 1]]
    L = {d: set() for d in range(6)}
    rng = range(-2, 3)
    for U in itertools.product(rng, repeat=2):
        for V in itertools.product(rng, repeat=2):
            for W in itertools.product(rng, repeat=4):
                F = [0] * 7
                for g, H in zip(gens, (U, V, W)):
                    for k, c in enumerate(produit(g, list(H))):
                        F[k] += c
                while F and F[-1] == 0:
                    F.pop()
                if F and len(F) - 1 < 6:
                    L[len(F) - 1].add(abs(F[-1]))
    # générateur positif de chaque L_d (pgcd des coefficients dominants trouvés)
    gen = {d: math.gcd(*L[d]) for d in L}
    assert gen == {0: 4, 1: 2, 2: 1, 3: 1, 4: 1, 5: 1}
    S = Schema(520, 250, 'Idéaux de coefficients dominants de (4, 2X, X²)')
    x0, y0, l, h = 70, 200, 52, 36
    S.ligne([x0 - 12, y0], [x0 + 6 * (l + 18), y0], 'g')
    noms = {0: '4', 1: '2X', 2: 'X^2'}
    for d in range(6):
        x = x0 + d * (l + 18)
        v = gen[d]
        c = 'r' if d in noms else 'g'
        S.rect(x, y0 - v * h, l, v * h, c, rempli=c)
        S.texte([x + l / 2, y0 + 18], str(d), 't', taille=15)
        S.texte([x + l / 2, y0 - v * h - 14], noms.get(d, ''), 'r', taille=15)
    S.ligne([x0 - 12, y0], [x0 - 12, y0 - 4 * h], 'g')
    for v in (1, 2, 4):
        S.ligne([x0 - 16, y0 - v * h], [x0 - 12, y0 - v * h], 'g')
        S.texte([x0 - 20, y0 - v * h], str(v), 'g', ancre='end', taille=13, ui=True)
    xN = x0 + 2 * (l + 18) + l + 9
    S.ligne([xN, y0 + 6], [xN, 40], 'g', d=True)
    S.texte([xN + 6, 36], 'N = 2', 'g', ancre='start', taille=15)
    S.texte([x0 + 3 * (l + 18), y0 + 40], 'degré d', 'g', taille=13, ui=True)
    return S


# ------------------------------------------------------------------ ac-chinois
@schema('ac-chinois')
def ac_chinois():
    m, n = 3, 4
    cases = {(k % m, k % n): k for k in range(m * n)}
    assert len(cases) == m * n                      # bijection de Z/12 sur Z/3 x Z/4
    assert cases[(2, 3)] == 11 and (-1) % 12 == 11
    S = Schema(460, 250, 'La bijection chinoise de ℤ/12ℤ sur ℤ/3ℤ × ℤ/4ℤ')
    x0, y0, c = 110, 40, 62
    centre = lambda a, b: np.array([x0 + b * c + c / 2, y0 + a * c + c / 2])
    for (a, b), k in cases.items():
        rouge = (a, b) == (2, 3)
        S.rect(x0 + b * c, y0 + a * c, c, c, 'r' if rouge else 'g', rempli='r' if rouge else None)
        S.texte(centre(a, b), str(k), 'r' if rouge else 't', taille=17)
    for k in range(m * n - 1):
        a, b = k % m, k % n
        a2, b2 = (k + 1) % m, (k + 1) % n
        if a2 == a + 1 and b2 == b + 1:            # pas de retour au bord : flèche diagonale
            p, q = centre(a, b), centre(a2, b2)
            u = (q - p) / np.linalg.norm(q - p)
            S.fleche(p + 14 * u, q - 14 * u, 'b')
    for a in range(m):
        S.texte([x0 - 16, y0 + a * c + c / 2], str(a), 'g', ancre='end', taille=15)
    for b in range(n):
        S.texte([x0 + b * c + c / 2, y0 - 14], str(b), 'g', taille=15)
    S.texte([x0 - 50, y0 + 1.5 * c], 'mod 3', 'g', ancre='end', taille=13, ui=True)
    S.texte([x0 + 2 * c, y0 + 3 * c + 22], 'mod 4', 'g', taille=13, ui=True)
    return S


# ------------------------------------------------------------------ ac-localisation
@schema('ac-localisation')
def ac_localisation():
    premiers = [2, 3, 5, 7, 11, 13]
    # idéaux premiers de Z_(3) : ceux qui ne rencontrent pas Z \ 3Z, c'est-à-dire contenus dans 3Z
    def rencontre(p, S):                # p = 0 pour l'idéal nul ; S donnée par un prédicat
        return p != 0 and any(S(k) for k in range(p, 200, p))
    S3 = lambda k: k % 3 != 0
    S6 = lambda k: k != 0 and all(q in (2, 3) for q in facteurs(k))
    def facteurs(k):
        out, q = [], 2
        while k > 1:
            while k % q == 0:
                out.append(q); k //= q
            q += 1
        return out
    vus3 = [p for p in [0] + premiers if not rencontre(p, S3)]
    vus6 = [p for p in [0] + premiers if not rencontre(p, S6)]
    assert vus3 == [0, 3] and vus6 == [0, 5, 7, 11, 13]
    S = Schema(540, 230, 'Les idéaux premiers de ℤ et ceux que gardent ℤ₍₃₎ et ℤ[1/6]')
    x0, pas = 150, 54
    lignes = [('ℤ', None, 'b'), ('ℤ_{(3)}', vus3, 'b'), ('ℤ[1/6]', vus6, 'r')]
    for i, (nom, vus, coul) in enumerate(lignes):
        y = 50 + i * 65
        S.texte([x0 - 40, y], nom, 't', ancre='end', taille=16)
        S.ligne([x0 - 20, y], [x0 + 6 * pas + 40, y], 'g', d=True)
        for j, p in enumerate([0] + premiers):
            q = np.array([x0 + j * pas, y])
            garde = vus is None or p in vus
            c = 't' if vus is None else (coul if garde else 'g')
            S.point(q, c, r=5 if garde else 4, creux=not garde)
            if vus is not None and not garde and coul == 'r':
                S.ligne(q + [-7, -7], q + [7, 7], 'g'); S.ligne(q + [-7, 7], q + [7, -7], 'g')
            if i == 0:
                S.texte(q + [0, -20], '{0}' if p == 0 else f'{p}ℤ', 't', taille=14)
        S.texte([x0 + 6 * pas + 54, y], '…', 'g', taille=16, ui=True)
    return S
