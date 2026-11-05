"""Schémas des exemples du lexique, théorie r (nombres réels) : contenu/exemples/r.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 17 (mémo de
l'édifice, § 111). Positions calculées (fractions exactes), et ce que dit la légende vérifié par assert.
"""
from fractions import Fraction as Fr
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, Repere, largeur_texte

TAILLE = 17


@schema('lex-suite-cauchy-2')
def lex_suite_cauchy_2():
    H = [Fr(0)]
    for n in range(1, 25):
        H.append(H[-1] + Fr(1, n))
    pas = [H[n + 1] - H[n] for n in range(1, 24)]
    assert all(pas[k + 1] < pas[k] for k in range(len(pas) - 1))           # « pas de plus en plus courts »
    assert H[12] - H[6] > Fr(1, 2) and H[24] - H[12] > Fr(1, 2)            # « dépassent chacune 1/2 »
    W, Ht = 420, 262
    R = Repere(0, 26.5, 0, 4.1, 44, 36, 344, 196)
    S = Schema(W, Ht, 'Les sommes harmoniques H_n pour n ≤ 24')
    R.axes(S, nx='n', ny='H_n')
    # graduations en ordonnée : 1, 2, 3
    for v in (1, 2, 3):
        S.ligne(R(0, v) - [4, 0], R(0, v), 'g')
        S.texte(R(0, v) - [10, 0], str(v), 'g', ancre='end', taille=15)
    # paliers en pointillé et flèches rouges
    for a, b in ((6, 12), (12, 24)):
        S.ligne(R(a, float(H[a])), R(b, float(H[a])), 'g', d=True)
        p, q = R(b, float(H[a])), R(b, float(H[b]))
        assert p[1] - q[1] > 0.5 * R.H / 4.1 - 1e-9                       # la flèche dépasse 1/2 à l'échelle
        S.fleche(p, q, 'r', retrait=5, retrait_debut=2, double=True)
    for n in range(1, 25):
        S.point(R(n, float(H[n])), 't', r=2.8)
    # abscisses 6, 12, 24
    for n in (6, 12, 24):
        S.ligne(R(n, 0), R(n, 0) + [0, 4], 'g')
        S.texte(R(n, 0) + [0, 16], str(n), 'g', taille=15)
    # étiquettes des deux écarts, à gauche des flèches
    for a, b in ((6, 12), (12, 24)):
        m = (float(H[a]) + float(H[b])) / 2
        p = R(b, m) + [8, 0]
        assert p[0] + largeur_texte('> 1/2', 15) < W                     # l'étiquette tient à droite de la flèche
        # aucun point (n, H_n) n'est dans la boîte de l'étiquette
        assert all(not (p[0] - 3 < R(n, float(H[n]))[0] < p[0] + largeur_texte('> 1/2', 15) + 3
                        and abs(R(n, float(H[n]))[1] - p[1]) < 12) for n in range(1, 25))
        S.texte(p, '> 1/2', 'r', ancre='start', taille=15)
    return S


@schema('lex-partie-entiere-1')
def lex_partie_entiere_1():
    fl = lambda q: q.numerator // q.denominator
    assert fl(Fr(7, 3)) == 2 and fl(Fr(-7, 3)) == -3                       # marches 2 et −3
    W, Ht = 420, 288
    R = Repere(-3.35, 3.55, -3.6, 3.0, 20, 30, 366, 246)
    S = Schema(W, Ht, 'Le graphe de la partie entière sur [−3, 3[')
    R.axes(S, nx='x', ny='y')
    for v in (-3, -2, -1, 1, 2, 3):
        S.ligne(R(v, 0), R(v, 0) + [0, 4], 'g')
        S.texte(R(v, 0) + [0, 17], str(v).replace('-', '−'), 'g', taille=15)
    # verticales pointillées en 7/3 et −7/3 (sous les marches)
    for t, k in ((Fr(7, 3), 2), (Fr(-7, 3), -3)):
        S.ligne(R(float(t), 0), R(float(t), k), 'r', d=True)
    # marches [k, k + 1[ à la hauteur k
    for k in range(-3, 3):
        a, b = R(k, k), R(k + 1, k)
        S.ligne(a, b - [4.2, 0], 't')
        S.point(a, 't', r=3.6)
        S.point(b, 't', r=3.6, creux=True)
    for t, k in ((Fr(7, 3), 2), (Fr(-7, 3), -3)):
        S.point(R(float(t), k), 'r', r=3.6)
    # 7/3 au-dessus de l'axe, à droite de sa verticale : sous l'axe, il toucherait les graduations 2 et 3
    p73 = R(7 / 3, 0) + [5, -14]
    assert p73[0] + largeur_texte('7/3', TAILLE) < R(3, 0)[0] + 12 and p73[1] < R(0, 0)[1] and p73[1] > R(0, 1)[1] + 10
    S.texte(p73, '7/3', 'r', ancre='start', taille=TAILLE)
    S.texte(R(-7 / 3, 0) + [0, -14], '−7/3', 'r', taille=TAILLE)
    S.texte(R(0, 2) + [-8, 0], '2', 'r', ancre='end', taille=TAILLE)
    S.texte(R(0, -3) + [8, 0], '−3', 'r', ancre='start', taille=TAILLE)
    # rien ne touche la marche qui passe sur l'étiquette : la marche −3 va de −3 à −2, l'étiquette « −7/3 » est
    # au-dessus de l'axe, loin de la hauteur −3
    assert R(-7 / 3, 0)[1] - 14 < R(0, -1)[1]
    return S
