"""Schémas des exemples du lexique, théorie z (entiers relatifs, arithmétique, polynômes) : contenu/exemples/z.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 17 au plus (mémo de
l'édifice, § 111). Positions calculées, et ce que dit la légende vérifié par assert.
"""
from math import comb
from edifice_schemas import schema
from edifice_svg import Schema

N = 16


@schema('lex-relation-pascal-3')
def lex_relation_pascal_3():
    par = [[comb(n, k) % 2 for k in range(n + 1)] for n in range(N)]
    # la parité obéit à la relation de Pascal réduite modulo 2
    assert all(par[n + 1][k + 1] == (par[n][k] + par[n][k + 1]) % 2 for n in range(N - 1) for k in range(n))
    # « les lignes 1, 2, 4 et 8 : seuls les deux coefficients extrêmes sont impairs »
    assert [n for n in range(1, N) if all(par[n][k] == 0 for k in range(1, n))] == [1, 2, 4, 8]
    # « le motif des huit premières lignes se retrouve trois fois dans les seize »
    for m in (4, 8):
        for n in range(m):
            for k in range(n + 1):
                assert par[m + n][k] == par[n][k] == par[m + n][m + k]
                assert par[m + n][n + 1 + k] == 0 if n + 1 + k < m else True
    assert all(v == 1 for v in par[N - 1])                                 # ligne 15 : tout impair
    W, H = 420, 296
    dy, dx = 17.6, 11.6
    x0, y0 = 224.0, 14.0
    S = Schema(W, H, 'Le triangle de Pascal modulo 2, lignes 0 à 15')
    for n in range(N):
        for k in range(n + 1):
            p = (x0 + (2 * k - n) * dx, y0 + n * dy)
            assert 8 < p[0] < W - 8 and 8 < p[1] < H - 6
            S.point(p, 'r' if par[n][k] else 'g', r=4.4 if par[n][k] else 2.6)
    for n in (1, 2, 4, 8):
        p = (x0 - n * dx - 16, y0 + n * dy)
        S.texte(p, str(n), 'g', ancre='end', taille=15)
    return S
