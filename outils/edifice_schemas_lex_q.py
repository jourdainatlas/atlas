"""Schémas des exemples du lexique, théorie q (nombres rationnels) : contenu/exemples/q.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées sur des rationnels exacts, et ce que dit la légende vérifié par assert.
"""
from fractions import Fraction as Fr
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte, courbe_entre

TAILLE = 17


@schema('lex-archimedien-1')
def lex_archimedien_1():
    x, y = Fr(2, 5), Fr(7, 3)
    n = next(k for k in range(1, 100) if k * x > y)
    assert n == 6 and 5 * x < y < 6 * x                     # « les cinq premiers s'arrêtent avant y, le sixième le franchit »
    W, H = 420, 132
    gauche, droite = 26.0, 398.0
    xmin, xmax = Fr(-1, 10), Fr(27, 10)
    X = lambda t: gauche + float((t - xmin) / (xmax - xmin)) * (droite - gauche)
    yl = 84.0                                                # ordonnée de la droite
    S = Schema(W, H, 'Les multiples de 2/5 jusqu’au premier qui dépasse 7/3')
    S.fleche((X(xmin), yl), (X(xmax) + 10, yl), 'g')
    # le seuil y, en pointillé gris, avec son étiquette au-dessus des sauts
    S.ligne((X(y), 30), (X(y), yl + 8), 'g', d=True)
    S.texte((X(y), 18), 'y = 7/3', 'g', taille=TAILLE)
    # les sauts : arcs au-dessus de la droite, le dernier en rouge
    for k in range(n):
        p, q = np.array([X(k * x), yl - 2]), np.array([X((k + 1) * x), yl - 2])
        c = 'r' if k == n - 1 else 't'
        S.courbe_fleche(courbe_entre(p, q, courbure=-0.32), c)
    # graduations et étiquettes des multiples, sous la droite
    noms = ['0', '2/5', '4/5', '6/5', '8/5', '2', '12/5']
    larg = [largeur_texte(s, TAILLE) for s in noms]
    pas = X(x) - X(0)
    assert all((larg[k] + larg[k + 1]) / 2 + 6 < pas for k in range(n))   # les étiquettes ne se touchent pas
    for k in range(n + 1):
        c = 'r' if k == n else 't'
        S.point((X(k * x), yl), c, r=3.4)
        S.texte((X(k * x), yl + 22), noms[k], c, taille=TAILLE)
    assert X(n * x) + larg[n] / 2 < W and X(y) + largeur_texte('y = 7/3', TAILLE) / 2 < W
    return S
