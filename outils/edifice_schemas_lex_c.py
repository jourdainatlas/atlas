"""Schémas des exemples du lexique, théorie c (nombres complexes) : contenu/exemples/c.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 17 (mémo de
l'édifice, § 111). Même échelle sur les deux axes ; ce que dit la légende vérifié par assert.
"""
import numpy as np
import sympy as sp
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

TAILLE = 17


@schema('lex-module-complexe-1')
def lex_module_complexe_1():
    z = 2 + sp.I
    w = sp.expand(z ** 2)
    assert w == 3 + 4 * sp.I                                               # le carré de 2 + i
    assert sp.Abs(z) == sp.sqrt(5) and sp.Abs(w) == 5 == sp.Abs(z) ** 2    # longueurs √5 et 5
    assert 3 ** 2 + 4 ** 2 == 5 ** 2                                       # triangle rectangle de côtés 3 et 4
    W, H = 420, 292
    ech = 56.0
    xmin, xmax, ymin, ymax = -0.6, 4.7, -0.55, 4.45
    lx, ly = ech * (xmax - xmin), ech * (ymax - ymin)
    R = Repere(xmin, xmax, ymin, ymax, (W - lx) / 2, (H - ly) / 2, lx, ly)
    assert abs(R.L / (xmax - xmin) - R.H / (ymax - ymin)) < 1e-9 and lx <= W and ly <= H
    S = Schema(W, H, 'Les points 2 + i et 3 + 4i, à distances √5 et 5 de 0')
    R.axes(S, nx='', ny='')
    # triangle rectangle en pointillé : 0 → 3 → 3 + 4i
    S.ligne(R(0, 0), R(3, 0), 'g', d=True)
    S.ligne(R(3, 0), R(3, 4), 'g', d=True)
    c = R(3, 0)
    S.poly([c + [-9, 0], c + [-9, -9], c + [0, -9]], 'g')                # angle droit
    S.ligne(R(0, 0), R(3, 4), 'r')
    S.ligne(R(0, 0), R(2, 1), 'b')
    S.point(R(0, 0), 't')
    S.point(R(2, 1), 'b')
    S.point(R(3, 4), 'r')
    S.texte(R(2, 1) + [10, 6], '2 + i', 'b', ancre='start', taille=TAILLE)
    S.texte(R(3, 4) + [10, 0], '3 + 4i', 'r', ancre='start', taille=TAILLE)
    S.texte(R(0, 0) + [-8, 12], '0', ancre='end', taille=TAILLE)
    S.texte(R(1.5, 0) + [0, 16], '3', 'g', taille=TAILLE)
    S.texte(R(3, 2) + [10, 0], '4', 'g', ancre='start', taille=TAILLE)
    assert R(3, 4)[0] + 10 + largeur_texte('3 + 4i', TAILLE) < W
    return S
