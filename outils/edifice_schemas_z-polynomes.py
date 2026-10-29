"""Schémas du chapitre « Anneaux de polynômes » (graphe z-polynomes) et du lemme sur 𝔖_p du nœud
gs-engendrer-sp (graphe galois)."""
import math
from fractions import Fraction as Fr

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, arc


# ---------------------------------------------------------------- outils locaux

def binom(n, k):
    """Coefficients binomiaux par la seule relation de Pascal, comme au nœud pol-binome."""
    ligne = [1]
    for _ in range(n):
        ligne = [1] + [ligne[i] + ligne[i + 1] for i in range(len(ligne) - 1)] + [1]
    return ligne[k] if 0 <= k <= n else 0


def mul(p, q, mod=None):
    """Produit de polynômes donnés par leurs coefficients (indice = degré)."""
    r = [0] * (len(p) + len(q) - 1)
    for i, a in enumerate(p):
        for j, b in enumerate(q):
            r[i + j] += a * b
    if mod:
        r = [x % mod for x in r]
    return r


def terme(c, k, premier):
    """Écriture d'un terme c X^k pour une étiquette (signe compris, sauf pour le premier terme)."""
    s = '−' if c < 0 else ('' if premier else '+')
    a = abs(c)
    if k == 0:
        corps = str(a)
    else:
        corps = ('' if a == 1 else str(a)) + 'X' + ('' if k == 1 else f'^{k}')
    return (s + ' ' + corps).strip() if not premier or c < 0 else corps


# ---------------------------------------------------------------- pol-anneau

@schema('pol-anneau')
def pol_anneau():
    p, q = 3, 2                       # degrés de P et de Q
    ni, nj = p + 2, q + 2             # on montre une colonne et une ligne nulles de plus
    w, h = 74, 44
    x0, y0 = 66, 46
    S = Schema(470, 290, 'Les produits a_i b_j rangés en tableau ; c_k est la somme de l’antidiagonale i + j = k')

    def centre(i, j):
        return np.array([x0 + (i + 0.5) * w, y0 + (j + 0.5) * h])

    # le coefficient d'indice p + q ne reçoit qu'une case non nulle
    non_nulles = [(i, j) for i in range(ni) for j in range(nj) if i <= p and j <= q]
    assert [(i, j) for (i, j) in non_nulles if i + j == p + q] == [(p, q)]
    assert not [(i, j) for (i, j) in non_nulles if i + j > p + q]
    k_bleu = 3
    for i in range(ni):
        for j in range(nj):
            nul = i > p or j > q
            if (i, j) == (p, q):
                rempli = 'r'
            elif i + j == k_bleu and not nul:
                rempli = 'b'
            elif nul:
                rempli = 'g'
            else:
                rempli = None
            S.rect(x0 + i * w, y0 + j * h, w, h, 'g', rempli=rempli)
            S.texte(centre(i, j), f'a_{i}b_{j}' if not nul else '0', 'g' if nul else 't', taille=15)
    for i in range(ni):
        S.texte([x0 + (i + 0.5) * w, y0 - 18], f'a_{i}', 'g' if i > p else 't', taille=16)
    for j in range(nj):
        S.texte([x0 - 26, y0 + (j + 0.5) * h], f'b_{j}', 'g' if j > q else 't', taille=16)
    # antidiagonales k = 3 (bleue) et k = 5 (rouge) : la droite des centres i + j = k sort du
    # tableau par le bas en i = k + 1/2 − nj ; un trait de rappel la prolonge jusqu'à l'étiquette c_k
    for k, c in [(k_bleu, 'b'), (p + q, 'r')]:
        i_sortie = k + 0.5 - nj
        a = centre(i_sortie, k - i_sortie)
        assert abs(a[1] - (y0 + nj * h)) < 1e-9
        b = centre(i_sortie - 0.45, k - i_sortie + 0.45)
        S.ligne(a, b, c, d=True)
        S.texte(centre(i_sortie - 0.62, k - i_sortie + 0.62), f'c_{k}', c, taille=16)
    return S


# ---------------------------------------------------------------- pol-division

@schema('pol-division')
def pol_division():
    P = [3, -1, 0, 2, 1]              # X⁴ + 2X³ − X + 3, indice = degré
    B = [1, 1, 1]                     # X² + X + 1, unitaire
    # algorithme de la preuve : on tue le terme dominant
    R = P[:]
    lignes, quotient = [], {}
    while len(R) - 1 >= len(B) - 1 and any(R):
        dR = max(k for k, c in enumerate(R) if c)
        if dR < len(B) - 1:
            break
        c = R[dR]                     # B unitaire : pas d'inverse à prendre
        e = dR - (len(B) - 1)
        quotient[e] = c
        m = [0] * e + [c * b for b in B]
        lignes.append(('m', {k: v for k, v in enumerate(m) if v}))
        R = [(R[k] if k < len(R) else 0) - (m[k] if k < len(m) else 0) for k in range(max(len(R), len(m)))]
        while len(R) > 1 and R[-1] == 0:
            R.pop()
        lignes.append(('r', {k: v for k, v in enumerate(R) if v}))
    Q = [quotient.get(k, 0) for k in range(max(quotient) + 1)]
    assert Q == [-2, 1, 1] and R == [5]
    prod = mul(B, Q)
    assert [prod[k] + (R[k] if k < len(R) else 0) for k in range(len(prod))] == P

    S = Schema(474, 285, 'Division posée de X⁴ + 2X³ − X + 3 par X² + X + 1')
    col = {k: 34 + (4 - k) * 56 for k in range(5)}        # une colonne par degré
    dy, ytop = 36, 34
    xbar = 316

    def ecrire(coeffs, y, c, prem=True):
        degs = sorted(coeffs, reverse=True)
        for n, k in enumerate(degs):
            S.texte([col[k], y], terme(coeffs[k], k, n == 0 and prem), c, taille=16)

    ecrire({k: v for k, v in enumerate(P) if v}, ytop, 't')
    y = ytop
    for typ, coeffs in lignes:
        y += dy
        if typ == 'm':
            ecrire({k: -v for k, v in coeffs.items()}, y, 'b')
            xs = [col[k] for k in coeffs]
            S.ligne([min(xs) - 30, y + dy / 2], [max(xs) + 30, y + dy / 2], 'g')
        else:
            dernier = (typ, coeffs) == lignes[-1]
            ecrire(coeffs, y, 'r' if dernier else 't')
    # potence
    S.ligne([xbar, ytop - 18], [xbar, ytop + 2.6 * dy], 't')
    S.ligne([xbar, ytop + dy / 2], [xbar + 154, ytop + dy / 2], 't')
    S.texte([xbar + 77, ytop], 'X^2 + X + 1', 't', taille=16)
    S.texte([xbar + 77, ytop + dy], 'X^2 + X − 2', 'b', taille=16)
    S.texte([xbar + 77, ytop + 2 * dy + 4], 'quotient', 'b', ui=True, taille=13)
    S.texte([col[0] + 26, y], 'reste', 'r', ui=True, ancre='start', taille=13)
    return S


# ---------------------------------------------------------------- pol-racines

@schema('pol-racines')
def pol_racines():
    S = Schema(520, 290, 'Les classes de ℤ/7ℤ et de ℤ/8ℤ dont le carré vaut 1')
    rayon = 92
    for n, cx in [(7, 130), (8, 390)]:
        racines = [x for x in range(n) if (x * x - 1) % n == 0]
        if n == 7:
            assert racines == [1, 6]
        else:
            assert racines == [1, 3, 5, 7]
            assert (3 - 1) * (3 + 1) % 8 == 0 and (3 - 1) % 8 and (3 + 1) % 8
        centre = np.array([cx, 160])
        S.cercle(centre, rayon, 'g')
        pos = {}
        for x in range(n):
            t = -math.pi / 2 + 2 * math.pi * x / n           # 0 en haut, sens des aiguilles d'une montre
            pos[x] = centre + rayon * np.array([math.cos(t), math.sin(t)])
            S.texte(centre + (rayon + 18) * np.array([math.cos(t), math.sin(t)]), str(x),
                    'r' if x in racines else 'g', taille=16)
        for x in racines:
            if x != 1:
                S.fleche(pos[x], pos[1], 'r', retrait=7, retrait_debut=6)
        for x in range(n):
            S.point(pos[x], 'r' if x in racines else 'g', r=5 if x in racines else 3.4)
        S.texte([cx, 30], 'ℤ/' + str(n) + 'ℤ', 't', taille=17)
    return S


# ---------------------------------------------------------------- pol-binome

@schema('pol-binome')
def pol_binome():
    N = 7
    premiers = [2, 3, 5, 7]
    for n in range(N + 1):
        for k in range(n + 1):
            assert binom(n, k) == math.comb(n, k)
    for p in premiers:
        assert all(binom(p, k) % p == 0 for k in range(1, p))
    bleus = {(n, k) for n in (4, 6) for k in range(1, n) if binom(n, k) % n}
    assert bleus == {(4, 2), (6, 2), (6, 3), (6, 4)}
    dx, dy = 56, 36
    S = Schema(500, 300, 'Triangle de Pascal, lignes 0 à 7')
    cx, y0 = 268, 30
    for n in range(N + 1):
        y = y0 + n * dy
        S.texte([30, y], str(n), 'g', taille=15)
        for k in range(n + 1):
            x = cx + (k - n / 2) * dx
            if n in premiers and 0 < k < n:
                c = 'r'
            elif (n, k) in bleus:
                c = 'b'
            else:
                c = 't'
            S.texte([x, y], str(binom(n, k)), c, taille=16)
    S.texte([30, y0 - 22], 'n', 'g', taille=15)
    return S


# ---------------------------------------------------------------- pol-eisenstein

@schema('pol-eisenstein')
def pol_eisenstein():
    # Exemple numérique de ce que la preuve exclut : A et B se réduisent modulo 2 à X^r et X^s ;
    # le produit vérifie toutes les hypothèses d'Eisenstein sauf p² ∤ a_0.
    p = 2
    A = [2, 2, 1]                     # X² + 2X + 2, r = 2
    B = [2, 0, 2, 1]                  # X³ + 2X² + 2, s = 3
    P = mul(A, B)
    r, s, n = len(A) - 1, len(B) - 1, len(P) - 1
    assert all(c % p == 0 for c in A[:-1]) and A[-1] % p
    assert all(c % p == 0 for c in B[:-1]) and B[-1] % p
    assert all(c % p == 0 for c in P[:-1]) and P[-1] % p
    assert P[0] == A[0] * B[0] and P[0] % (p * p) == 0
    w, h = 62, 40
    x0 = 84
    S = Schema(500, 296, 'Coefficients de A, B et P = AB rangés par degré ; en rouge, les multiples de p')
    rangs = [('A', 'b', r, 36), ('B', 'c', s, 106), ('P', 'a', n, 214)]
    coins = {}
    for nom, lettre, deg, y in rangs:
        S.texte([x0 - 58, y + h / 2], nom, 't', taille=17)
        for k in range(deg + 1):
            mult = k < deg
            S.rect(x0 + k * w, y, w, h, 'r' if mult else 't', rempli='r' if mult else None)
            S.texte([x0 + (k + 0.5) * w, y + h / 2], f'{lettre}_{k}', 'r' if mult else 't', taille=16)
        coins[nom] = (x0 + 0.5 * w, y, y + h)
    # a_0 = b_0 c_0 : flèches depuis b_0 (par la gauche) et c_0 vers a_0
    xa, ya, _ = coins['P']
    xb, _, yb = coins['B']
    S.fleche([xb, yb], [xa, ya], 'r', retrait=3, retrait_debut=3)
    xg = x0 + 4
    S.chemin(f'M{x0:.1f},{36 + h / 2:.1f} C{xg - 30:.1f},{36 + h / 2:.1f} {xg - 30:.1f},{ya - 20:.1f} {x0 + 8:.1f},{ya - 4:.1f}', 'r')
    S.pointe([x0 + 10, ya - 2], [1, 0.9], 'r')
    S.texte([x0 + (n + 1) * w - 4, 214 + h + 26], 'a_0 = b_0c_0 `multiple de` p^2', 'r', ancre='end', taille=16)
    S.texte([x0 + (r + 1) * w + 10, 36 + h / 2], '`modulo` p : A ≡ αX^2', 'g', ancre='start', taille=15)
    S.texte([x0 + (s + 1) * w + 10, 106 + h / 2], 'B ≡ βX^3', 'g', ancre='start', taille=15)
    return S


# ---------------------------------------------------------------- gs-engendrer-sp (lemme)

def compose(*perms):
    """Composée de permutations de {1..n} (dictionnaires), appliquées de droite à gauche."""
    def f(x):
        for s in reversed(perms):
            x = s.get(x, x)
        return x
    return f


def transpo(a, b):
    return {a: b, b: a}


@schema('gs-engendrer-sp')
def gs_abel_ruffini_2():
    p = 5
    rho = {j: j % p + 1 for j in range(1, p + 1)}
    rho_inv = {v: k for k, v in rho.items()}
    tau = transpo(1, 2)
    # ρ^j τ ρ^{-j} = (1+j 2+j)
    for j in range(p):
        conj = tau
        for _ in range(j):
            conj = {x: compose(rho, conj, rho_inv)(x) for x in range(1, p + 1)}
        a, b = 1 + j, 2 + j
        a, b = (a - 1) % p + 1, (b - 1) % p + 1
        assert all(conj.get(x, x) == transpo(a, b).get(x, x) for x in range(1, p + 1))
    # (2 3)(1 2)(2 3) = (1 3)
    g = compose(transpo(2, 3), transpo(1, 2), transpo(2, 3))
    assert all(g(x) == transpo(1, 3).get(x, x) for x in range(1, p + 1))
    S = Schema(400, 305, 'Pentagone des transpositions de 𝔖₅ : un côté rouge, ses tournés en bleu, les diagonales en vert')
    centre = np.array([200, 168])
    R = 118
    pos = {}
    for k in range(1, p + 1):
        t = -math.pi / 2 + 2 * math.pi * (k - 1) / p
        pos[k] = centre + R * np.array([math.cos(t), math.sin(t)])
    for a in range(1, p + 1):
        for b in range(a + 1, p + 1):
            cote = (b - a) % p in (1, p - 1)
            if not cote:
                S.ligne(pos[a], pos[b], 'v', d=True)
    for a in range(1, p + 1):
        b = a % p + 1
        if {a, b} == {1, 2}:
            S.ligne(pos[a], pos[b], 'r', l=4)
        else:
            S.ligne(pos[a], pos[b], 'b', l=2.4)
    for k in range(1, p + 1):
        S.point(pos[k], 't', r=4.5)
        u = (pos[k] - centre) / R
        S.texte(pos[k] + 20 * u, str(k), 't', taille=17)
    # rotation ρ au centre
    pts = arc(centre, 30, -math.pi / 2 + 0.35, -math.pi / 2 + 2 * math.pi - 0.6, 60)
    S.courbe_fleche(pts, 'g')
    S.texte(centre, 'ρ', 'g', taille=17)
    m = (pos[1] + pos[2]) / 2
    u = (m - centre) / np.linalg.norm(m - centre)
    S.texte(m + 18 * u, 'τ', 'r', taille=17)
    return S
