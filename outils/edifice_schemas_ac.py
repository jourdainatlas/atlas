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


# ------------------------------------------------------------------ ac-reduction (réduction des endomorphismes)
def _jordan(blocs):
    """Matrice diagonale par blocs de Jordan J_k(λ), blocs = [(k, λ), …]."""
    n = sum(k for k, _ in blocs)
    M = np.zeros((n, n))
    i = 0
    for k, l in blocs:
        for a in range(k):
            M[i + a, i + a] = l
            if a + 1 < k:
                M[i + a, i + a + 1] = 1
        i += k
    return M


def _dim_noyau(M):
    return M.shape[0] - np.linalg.matrix_rank(M)


@schema('rd-jordan-nilpotent')
def rd_jordan_nilpotent():
    tailles = [3, 2, 2, 1]
    N = _jordan([(k, 0) for k in tailles])
    n = N.shape[0]
    dims = [_dim_noyau(np.linalg.matrix_power(N, j)) for j in range(0, 4)]
    assert dims == [0, 4, 7, 8]
    lignes = [dims[j] - dims[j - 1] for j in (1, 2, 3)]
    assert lignes == [sum(1 for k in tailles if k >= j) for j in (1, 2, 3)] == [4, 3, 1]
    S = Schema(480, 320, 'Chaînes de Jordan d’un nilpotent de blocs 3, 2, 2, 1')
    x0, pas, yb, dy = 150, 74, 214, 72
    pos = lambda b, j: np.array([x0 + b * pas, yb - (j - 1) * dy])
    for b, k in enumerate(tailles):
        for j in range(1, k + 1):
            S.point(pos(b, j), 'r' if j == k else 't', r=5.5)
        for j in range(k, 1, -1):
            S.fleche(pos(b, j), pos(b, j - 1), 'g', retrait=10, retrait_debut=10)
        S.fleche(pos(b, 1), pos(b, 1) + [0, 44], 'g', retrait=6, retrait_debut=10)
        S.texte(pos(b, 1) + [0, 56], '0', 'g', taille=15)
        S.texte(pos(b, 1) + [0, 90], f'J_{k}', 't', taille=16)
    for j in (1, 2, 3):
        y = yb - (j - 1) * dy
        S.texte([x0 - 56, y], f'W_{j}', 't', ancre='end', taille=16)
        S.texte([x0 + 3 * pas + 52, y], str(lignes[j - 1]), 'g', ancre='start', taille=15)
    S.texte([x0 + 3 * pas + 46, yb - 2 * dy - 40], 'points', 'g', ancre='start', taille=13, ui=True)
    S.texte([x0 + 1.5 * pas, 24], 'u fait descendre d’une ligne', 'g', taille=13, ui=True)
    return S


@schema('rd-caracteristiques')
def rd_caracteristiques():
    M = _jordan([(3, 2), (1, 2), (2, 5)])
    n = M.shape[0]
    I = np.eye(n)
    suites = {}
    for l, jmax in ((2, 4), (5, 3)):
        suites[l] = [_dim_noyau(np.linalg.matrix_power(M - l * I, j)) for j in range(1, jmax + 1)]
    assert suites == {2: [2, 3, 4, 4], 5: [1, 2, 2]}
    # r : exposant dans le polynôme minimal (premier j où la suite cesse de croître), m : palier
    r = {l: next(j for j in range(1, len(s)) if s[j] == s[j - 1]) for l, s in suites.items()}
    m = {l: s[-1] for l, s in suites.items()}
    assert r == {2: 3, 5: 2} and m == {2: 4, 5: 2}
    S = Schema(520, 270, 'Dimensions des noyaux de (u − λ)^j')
    h, w, gap, y0 = 36, 34, 12, 214
    for (l, c, xg) in ((2, 'r', 50), (5, 'b', 320)):
        s = suites[l]
        for j, d in enumerate(s, start=1):
            x = xg + (j - 1) * (w + gap)
            S.rect(x, y0 - d * h, w, d * h, c, rempli=c)
            S.texte([x + w / 2, y0 + 18], str(j), 'g', taille=14)
        xr = xg + (r[l] - 1) * (w + gap) + w / 2      # milieu de la colonne d'indice r
        S.ligne([xr, y0 - m[l] * h - 8], [xr, y0], 'g', d=True)
        S.texte([xr, y0 + 46], f'r = {r[l]}', 'g', taille=14)
        xa, xb = xg - 10, xg + len(s) * (w + gap) - gap + 10
        S.ligne([xa, y0 - m[l] * h], [xb, y0 - m[l] * h], 'g', d=True)
        S.texte([xb + 6, y0 - m[l] * h], f'm = {m[l]}', 'g', ancre='start', taille=14)
        S.ligne([xa, y0], [xb, y0], 'g')
        S.texte([xg + (len(s) * (w + gap) - gap) / 2, 26], f'λ = {l}', c, taille=16)
    return S


@schema('rd-jordan')
def rd_jordan():
    blocs = [(3, 2), (1, 2), (2, 5)]
    M = _jordan(blocs)
    n = M.shape[0]
    I = np.eye(n)
    assert [_dim_noyau(np.linalg.matrix_power(M - 2 * I, j)) for j in (1, 2, 3)] == [2, 3, 4]
    assert [_dim_noyau(np.linalg.matrix_power(M - 5 * I, j)) for j in (1, 2)] == [1, 2]
    # les 1 sont exactement sur la surdiagonale à l'intérieur des blocs
    debuts = np.cumsum([0] + [k for k, _ in blocs])[:-1]
    uns = {(i, j) for i in range(n) for j in range(n) if i != j and M[i, j] != 0}
    attendus = {(d + a, d + a + 1) for d, (k, _) in zip(debuts, blocs) for a in range(k - 1)}
    assert uns == attendus
    S = Schema(480, 300, 'Forme de Jordan diag(J₃(2), J₁(2), J₂(5))')
    c, x0, y0 = 42, 70, 22
    S.rect(x0, y0, n * c, n * c, 'g')
    couleur = {2: 'r', 5: 'b'}
    for d, (k, l) in zip(debuts, blocs):
        S.rect(x0 + d * c, y0 + d * c, k * c, k * c, couleur[l], rempli=couleur[l])
        S.texte([x0 + n * c + 16, y0 + (d + k / 2) * c], f'J_{k}({l})', couleur[l], ancre='start', taille=16)
    for i in range(n):
        for j in range(n):
            if M[i, j] == 0:
                continue
            p = [x0 + (j + 0.5) * c, y0 + (i + 0.5) * c]
            if i == j:
                S.texte(p, str(int(M[i, j])), couleur[int(M[i, j])], taille=17)
            else:
                S.texte(p, '1', 'g', taille=16)
    return S
