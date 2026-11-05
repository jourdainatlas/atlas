"""Schémas des exemples du lexique, théorie geoalg : contenu/exemples/geoalg.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées, et ce que dit la légende vérifié par assert.
"""
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte

W0 = 420


def _etiq(S, p, s, c='t', ancre='middle', taille=17, marge=2):
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)
    S.texte(p, s, c, ancre=ancre, taille=taille)


@schema('lex-ensemble-algebrique-1')
def lex_ensemble_algebrique_1():
    p = 5
    parabole = {(x, x * x % p) for x in range(p)}
    droite = {(x, 0) for x in range(p)}
    reunion = {(a, b) for a in range(p) for b in range(p) if (b * (b - a * a)) % p == 0}
    assert len(parabole) == 5 and len(droite) == 5 and parabole & droite == {(0, 0)}
    assert reunion == parabole | droite and len(reunion) == 9 and p * p - len(reunion) == 16
    S = Schema(W0, 280, 'La parabole et la droite dans (ℤ/5ℤ)²')
    pas = 48
    x0, y0 = (W0 - 4 * pas) / 2 + 10, 280 - 44
    P = lambda a, b: (x0 + a * pas, y0 - b * pas)
    for a in range(p):
        _etiq(S, (P(a, 0)[0], y0 + 26), str(a), 'g', taille=15)
    for b in range(p):
        _etiq(S, (x0 - 26, P(0, b)[1]), str(b), 'g', ancre='end', taille=15)
    _etiq(S, (P(4, 0)[0] + 34, y0 + 26), 'x_1', 'g', taille=15)
    _etiq(S, (x0 - 26, P(0, 4)[1] - 26), 'x_2', 'g', ancre='end', taille=15)
    for a in range(p):
        for b in range(p):
            if (a, b) not in reunion:
                S.point(P(a, b), 'g', r=3)
    for (a, b) in sorted(droite - parabole):
        S.point(P(a, b), 'b', r=5.5)
    for (a, b) in sorted(parabole):
        S.point(P(a, b), 'r', r=5.5)
    S.cercle(P(0, 0), 9.5, 'b')
    return S
