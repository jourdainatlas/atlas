"""Schémas des exemples du lexique, théorie analyse-reelle : contenu/exemples/analyse-reelle.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur conseillée pour le panneau du lexique : 400 à 440,
étiquettes de 17 (mémo de l'édifice, § 111). Positions calculées, et ce que la figure affirme vérifié par assert.
"""
from fractions import Fraction as Fr
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte


@schema('lex-partie-convexe-2')
def lex_partie_convexe_2():
    # A = {(x, y) : xy = 0}, réunion des deux axes ; calculs exacts sur des rationnels.
    dans = lambda p: p[0] * p[1] == 0
    a, b = (Fr(1), Fr(0)), (Fr(0), Fr(1))
    m = tuple((u + v) / 2 for u, v in zip(a, b))
    assert dans(a) and dans(b) and m == (Fr(1, 2), Fr(1, 2)) and not dans(m)   # le milieu sort de A
    # segment [a, b] : seules ses extrémités sont dans A (xy = t(1 − t) ≠ 0 pour 0 < t < 1)
    ts = [Fr(k, 20) for k in range(21)]
    assert [t for t in ts if dans(((1 - t) * a[0] + t * b[0], (1 - t) * a[1] + t * b[1]))] == [0, 1]
    # étoilée en l'origine : t·p reste dans A pour p dans A et t dans [0, 1]
    pts = [(Fr(x), Fr(0)) for x in (-3, -1, 2)] + [(Fr(0), Fr(y)) for y in (-2, 1, 3)]
    assert all(dans((t * p[0], t * p[1])) for p in pts for t in ts)
    # issus de (1, 0), les segments vers les points de l'autre axe quittent A : pas étoilée en (1, 0)
    assert not dans(((1 - Fr(1, 2)) * a[0], Fr(1, 2) * b[1]))

    W, H = 420, 290
    R = Repere(-1.55, 1.75, -1.0, 1.45, 20, 18, 380, 254)
    S = Schema(W, H, 'La réunion des deux axes : étoilée par rapport à l’origine, non convexe')
    # la partie A, en rouge (objet étudié), prolongée jusqu'au bord du repère
    S.ligne(R(-1.55, 0), R(1.75, 0), 'r')
    S.ligne(R(0, -1.0), R(0, 1.45), 'r')
    # segment [a, b], en pointillé : il sort de A
    S.ligne(R(*map(float, a)), R(*map(float, b)), 'g', d=True)
    # deux segments issus de l'origine, en bleu : ils restent sur les axes
    for p in [(-1.2, 0.0), (0.0, -0.75)]:
        S.ligne(R(0, 0), R(*p), 'b')
        S.point(R(*p), 'b')
    S.point(R(*map(float, a)), 't')
    S.point(R(*map(float, b)), 't')
    S.point(R(*map(float, m)), 'r', r=4, creux=True)
    S.point(R(0, 0), 't')
    taille = 16
    S.texte(R(1, 0) + [0, 18], '(1, 0)', taille=taille)
    S.texte(R(0, 1) + [-10, 0], '(0, 1)', ancre='end', taille=taille)
    lm = '(1/2, 1/2)'
    pm = R(0.5, 0.5) + [10, -12]
    assert pm[0] + largeur_texte(lm, taille) < W                     # l'étiquette du milieu tient dans le cadre
    S.texte(pm, lm, 'r', ancre='start', taille=taille)
    S.texte(R(0, 0) + [-10, 16], '0', ancre='end', taille=taille)
    return S
