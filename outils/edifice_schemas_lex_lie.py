"""Schémas des exemples du lexique, théorie lie (groupes de Lie) : contenu/exemples/lie.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées (matrices appliquées exactement), et ce que dit la légende vérifié par
assert. Couleurs (§ 29) : t encre, g gris (axes, référence), r rouge (objet étudié), b bleu, v vert.
"""
import math
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

W = 420
TL = 17


def _dans_cadre(S, p, s, taille=TL, ancre='middle', marge=2):
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)


def _etiq(S, p, s, c='t', ancre='middle', taille=TL):
    _dans_cadre(S, p, s, taille, ancre)
    S.texte(p, s, c, ancre=ancre, taille=taille)


def _aire(P):
    """Aire orientée du triangle P (positive si P[0], P[1], P[2] tournent dans le sens direct)."""
    (x1, y1), (x2, y2), (x3, y3) = P
    return ((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) / 2


@schema('lex-crochet-matrices-3')
def lex_crochet_matrices_3():
    s = 0.35
    x0 = np.array([1.0, 1.0])
    E = np.array([[0., 1.], [0., 0.]])
    F = np.array([[0., 0.], [1., 0.]])
    Hm = E @ F - F @ E
    pas = [(np.eye(2) - s * F, 'e^{−sF}'), (np.eye(2) - s * E, 'e^{−sE}'), (np.eye(2) + s * F, 'e^{sF}'), (np.eye(2) + s * E, 'e^{sE}')]
    pts = [x0]
    for M, _ in pas:
        pts.append(M @ pts[-1])
    g = (np.eye(2) + s * E) @ (np.eye(2) + s * F) @ (np.eye(2) - s * E) @ (np.eye(2) - s * F)
    assert np.allclose(pts[-1], g @ x0)
    for k in range(4):                                             # E horizontal, F vertical
        dx, dy = pts[k + 1] - pts[k]
        assert (abs(dy) < 1e-12) if k % 2 else (abs(dx) < 1e-12)
    ecart = pts[-1] - x0
    approx = s ** 2 * Hm @ x0
    assert np.linalg.norm(ecart - approx) < 0.5 * np.linalg.norm(approx)          # « proche », écart d'ordre s³
    assert np.linalg.norm(ecart - approx) <= 2 * s ** 3 * np.linalg.norm(x0)
    Hh = 280
    S = Schema(W, Hh, 'Le chemin de la boucle des quatre exponentielles')
    xs = [p[0] for p in pts] + [x0[0] + approx[0]]
    ys = [p[1] for p in pts] + [x0[1] + approx[1]]
    xmin, xmax, ymin, ymax = min(xs) - 0.08, max(xs) + 0.14, min(ys) - 0.06, max(ys) + 0.06
    k = min(330 / (xmax - xmin), 240 / (ymax - ymin))
    L, Hr = k * (xmax - xmin), k * (ymax - ymin)
    Rp = Repere(xmin, xmax, ymin, ymax, (W - L) / 2, (Hh - Hr) / 2, L, Hr)
    for j, (_, nomm) in enumerate(pas):
        a, b = pts[j], pts[j + 1]
        S.fleche(Rp(*a), Rp(*b), 't', retrait=5, retrait_debut=5, l=2)
        m = (Rp(*a) + Rp(*b)) / 2
        if j % 2 == 0:                                          # segment vertical : étiquette à gauche ou à droite
            q = m + ([-10, 0] if j == 0 else [-10, 0])
            _etiq(S, q, nomm, 'g', ancre='end', taille=17)
        else:
            q = m + [0, 16 if j == 1 else -14]
            _etiq(S, q, nomm, 'g', taille=17)
    S.fleche(Rp(*x0), Rp(*(x0 + approx)), 'g', d=True, l=1.6)
    S.fleche(Rp(*x0), Rp(*pts[-1]), 'r', l=2.6)
    S.point(Rp(*x0), 't', r=4)
    _etiq(S, Rp(*x0) + [12, -14], 'x_0', 't', ancre='start')
    _etiq(S, Rp(*(x0 + approx)) + [10, 10], 's^2Hx_0', 'g', ancre='start', taille=17)
    return S
