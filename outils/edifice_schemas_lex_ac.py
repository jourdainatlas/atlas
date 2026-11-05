"""Schémas des exemples du lexique, théorie ac (algèbre commutative) : contenu/exemples/ac.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 17 (mémo de
l'édifice, § 111). Les objets (diviseurs, réseaux, noyaux) sont calculés, les positions aussi, et ce que dit
chaque légende est vérifié par assert.
"""
import itertools
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte

TAILLE = 17


# ---------------------------------------------------------------- outils
def _sortie_boite(c, vers, dx, dy):
    """Distance de c au bord du rectangle de demi-côtés (dx, dy) centré en c, dans la direction de « vers »."""
    u = np.asarray(vers, float) - c
    u = u / np.linalg.norm(u)
    return min(dx / abs(u[0]) if abs(u[0]) > 1e-12 else np.inf, dy / abs(u[1]) if abs(u[1]) > 1e-12 else np.inf)


def _hasse(S, pos, nom, couv, W, H, rouge_noeuds=(), rouge_traits=()):
    """Diagramme de Hasse : étiquettes centrées en pos, traits entre bords de boîtes calculés."""
    demi = {k: (largeur_texte(nom[k], TAILLE) / 2 + 5, 12) for k in pos}
    for k in pos:                                            # rien ne sort du cadre
        assert demi[k][0] + 2 < pos[k][0] < W - demi[k][0] - 2, (nom[k], pos[k])
        assert demi[k][1] + 2 < pos[k][1] < H - demi[k][1] - 2, (nom[k], pos[k])
    ks = list(pos)                                           # pas deux étiquettes qui se chevauchent
    for i, a in enumerate(ks):
        for b in ks[i + 1:]:
            assert (abs(pos[a][0] - pos[b][0]) > demi[a][0] + demi[b][0] + 6
                    or abs(pos[a][1] - pos[b][1]) > demi[a][1] + demi[b][1] + 6), (nom[a], nom[b])
    # gris d'abord, rouge par-dessus
    for a, b in sorted(couv, key=lambda c: ((c in rouge_traits), str(c))):
        p, q = np.asarray(pos[a], float), np.asarray(pos[b], float)
        u = (q - p) / np.linalg.norm(q - p)
        coul = 'r' if (a, b) in rouge_traits else 'g'
        S.ligne(p + (_sortie_boite(p, q, *demi[a]) + 2) * u, q - (_sortie_boite(q, p, *demi[b]) + 2) * u, coul,
                l=2.2 if coul == 'r' else None)
    for k in pos:
        S.texte(pos[k], nom[k], 'r' if k in rouge_noeuds else 't', taille=TAILLE)


# ---------------------------------------------------------------- idéaux de Z contenant 12Z
@schema('lex-anneau-noetherien-1')
def lex_anneau_noetherien_1():
    n = 12
    D = [d for d in range(1, n + 1) if n % d == 0]
    assert D == [1, 2, 3, 4, 6, 12]

    def contient(d, e):              # dZ ⊃ eZ  <=>  d | e
        return e % d == 0

    couv = {(e, d) for d in D for e in D                 # trait de eZ (en bas) vers dZ (au-dessus)
            if d != e and contient(d, e) and not any(f not in (d, e) and contient(d, f) and contient(f, e) for f in D)}
    assert couv == {(2, 1), (3, 1), (4, 2), (6, 2), (6, 3), (12, 4), (12, 6)}
    omega = {1: 0, 2: 1, 3: 1, 4: 2, 6: 2, 12: 3}         # nombre de facteurs premiers : hauteur dans le diagramme
    for d in D:
        k = sum(1 for p in (2, 3) for j in range(1, 5) if d % p**j == 0)
        assert omega[d] == k
    chaine = [12, 6, 2, 1]
    assert all(contient(chaine[i + 1], chaine[i]) for i in range(3))
    # longueur maximale : aucune chaîne de D n'a plus de quatre éléments
    plus_longue = max(len(c) for r in range(1, len(D) + 1) for c in itertools.permutations(D, r)
                      if all(contient(c[i + 1], c[i]) and c[i] != c[i + 1] for i in range(len(c) - 1)))
    assert plus_longue == len(chaine)

    W, H = 420, 270
    S = Schema(W, H, 'Les idéaux de ℤ qui contiennent 12ℤ')
    y = {0: 34, 1: 34 + (H - 68) / 3, 2: 34 + 2 * (H - 68) / 3, 3: H - 34}
    expo = {d: (sum(1 for j in (1, 2) if d % 2**j == 0), 1 if d % 3 == 0 else 0) for d in D}   # d = 2^a 3^b
    assert all(2**a * 3**b == d and a + b == omega[d] for d, (a, b) in expo.items())
    x = {d: W / 2 + 20 - 75 * a + 110 * b for d, (a, b) in expo.items()}   # parallélogramme 3 × 2, centré
    pos = {d: (x[d], y[omega[d]]) for d in D}
    nom = {d: ('ℤ' if d == 1 else f'{d}ℤ') for d in D}
    rouges = {(chaine[i], chaine[i + 1]) for i in range(3)}
    assert rouges <= couv
    _hasse(S, pos, nom, couv, W, H, rouge_noeuds=set(chaine), rouge_traits=rouges)
    return S


# ---------------------------------------------------------------- dérivation sur les polynômes de degré <= 3
@schema('lex-indice-nilpotence-3')
def lex_indice_nilpotence_3():
    corps = [('F', None), ('ℤ/3ℤ', 3), ('ℤ/2ℤ', 2)]
    mon = ['X^3', 'X^2', 'X', '1']                    # X^m, m = 3, 2, 1, 0
    W, H = 420, 250
    S = Schema(W, H, 'Indice de nilpotence de la dérivation selon le corps')
    x0 = 92
    pas = (W - 24 - x0) / 3
    xs = [x0 + k * pas for k in range(4)]
    ys = [56 + 72 * i for i in range(3)]
    assert ys[-1] + 30 < H
    attendu = {None: 4, 3: 3, 2: 2}
    for i, (nomk, p) in enumerate(corps):
        y = ys[i]
        coef = [m if p is None else m % p for m in (3, 2, 1)]          # D(X^m) = m X^(m-1)
        # longueurs des chaînes de flèches non nulles, et indice = plus longue + 1
        chaines, cur, debut = [], 0, 0
        for k, c in enumerate(coef):
            if c != 0:
                cur += 1
            else:
                if cur:
                    chaines.append((debut, cur))
                cur, debut = 0, k + 1
        if cur:
            chaines.append((debut, cur))
        Lmax = max(l for _, l in chaines)
        # contrôle direct : D^r = 0 pour r = Lmax + 1, et pas avant
        def Dk(m, r):
            c = 1
            for j in range(r):
                c *= (m - j)
            return 0 if m - r < 0 else (c if p is None else c % p)
        indice = min(r for r in range(0, 5) if all(Dk(m, r) == 0 for m in range(4)))
        assert indice == Lmax + 1 == attendu[p], (nomk, indice, Lmax)
        rouges = {k for d, l in chaines if l == Lmax for k in range(d, d + l)}
        S.texte((24, y), nomk, 't', ancre='start', taille=TAILLE)
        assert 24 + largeur_texte(nomk, TAILLE) < xs[0] - largeur_texte('X^3', TAILLE) / 2 - 8
        for k, mname in enumerate(mon):
            S.texte((xs[k], y), mname, 't', taille=TAILLE)
        for k, c in enumerate(coef):
            g = xs[k] + largeur_texte(mon[k], TAILLE) / 2 + 6
            d = xs[k + 1] - largeur_texte(mon[k + 1], TAILLE) / 2 - 6
            assert d - g > 30
            coul = 'g' if c == 0 else ('r' if k in rouges else 't')
            S.fleche((g, y), (d, y), coul, d=(c == 0))
            S.texte(((g + d) / 2, y - 16), str(c), coul, taille=TAILLE)
    return S


# ---------------------------------------------------------------- base adaptée à L = Z(2,2) + Z(0,6)
@schema('lex-base-adaptee-1')
def lex_base_adaptee_1():
    f1, f2 = np.array([1, 1]), np.array([0, 1])
    y1, y2 = np.array([2, 2]), np.array([0, 6])
    assert (2 * f1 == y1).all() and (6 * f2 == y2).all()
    assert round(abs(np.linalg.det(np.column_stack([f1, f2])))) == 1          # base de Z^2
    xs, ys = range(-2, 7), range(-2, 8)

    def dansL(p):                       # p = a y1 + b y2, a, b entiers
        a = p[0] / 2
        if a != int(a):
            return False
        b = (p[1] - 2 * a) / 6
        return b == int(b)

    # L = Z(2,2) + Z(0,6) : abscisse paire et ordonnée congrue à l'abscisse modulo 6
    for x in xs:
        for y in ys:
            assert dansL((x, y)) == (x % 2 == 0 and (y - x) % 6 == 0)
    assert not dansL((2, 0))                                             # la base canonique n'est pas adaptée
    # légende : les points de L sont sur les droites parallèles à f2 passant par les multiples de 2 f1,
    # de six en six sur chacune
    droites = [a for a in range(-1, 4)]                                  # passant par a·(2 f1) = (2a, 2a)
    for x in xs:
        pts = sorted(y for y in ys if dansL((x, y)))
        if x % 2:
            assert not pts
        else:
            assert x // 2 in droites and dansL((x, x)) and all(q - p == 6 for p, q in zip(pts, pts[1:]))
    W, H, pas = 420, 298, 27
    ox, oy = 150, H - 16 - 2 * pas                                       # pixel de l'origine
    P = lambda v: np.array([ox + pas * v[0], oy - pas * v[1]])
    assert P((min(xs), max(ys)))[1] > 8 and P((min(xs), 0))[0] > 60 and P((max(xs), min(ys)))[0] < W - 8
    assert P((0, min(ys)))[1] < H - 8
    S = Schema(W, H, 'Une base adaptée au sous-module L de ℤ²')
    for a in droites:                                                    # droites x = 2a, en pointillé
        S.ligne(P((2 * a, min(ys) - 0.4)), P((2 * a, max(ys) + 0.4)), 'g', d=True)
    for x in xs:
        for y in ys:
            if dansL((x, y)):
                S.point(P((x, y)), 'r', r=4.2)
            else:
                S.point(P((x, y)), 'g', r=2.2)
    O = P((0, 0))
    S.fleche(O, P(y1), 'r', retrait=5, l=2.2)
    S.fleche(O, P(y2), 'r', retrait=5, l=2.2)
    S.fleche(O, P(f1), 'b', retrait=3, l=2.2)
    S.fleche(O, P(f2), 'b', retrait=3, l=2.2)
    # étiquettes, à droite des pointes, sans chevauchement avec les points du réseau voisins
    etiq = [(P(f1) + np.array([14, 10]), 'f_1', 'b'), (P(f2) + np.array([-pas / 2, -pas / 2]), 'f_2', 'b'),
            (P(y1) + np.array([pas / 2 + 3, -pas / 2]), '2f_1', 'r'), (P(y2) + np.array([pas / 2 + 3, -pas / 2]), '6f_2', 'r')]
    for p, s, c in etiq:
        w = largeur_texte(s.replace('_', ''), TAILLE)
        assert 4 < p[0] - w / 2 and p[0] + w / 2 < W - 4
        # l'étiquette ne recouvre aucun point du réseau (demi-hauteur 9, marge 3)
        for x in xs:
            for y in ys:
                q = P((x, y))
                assert not (abs(q[0] - p[0]) < w / 2 + 3 and abs(q[1] - p[1]) < 9 + 3), (s, x, y)
        S.texte(p, s, c, taille=TAILLE)
    return S
