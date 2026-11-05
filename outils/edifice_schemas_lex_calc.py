"""Schémas des exemples du lexique, théorie calc (calculabilité) : contenu/exemples/calc.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 15 à 17 (mémo de
l'édifice, § 111). Le programme est exécuté par le modèle exact de la machine à registres, et ce que dit chaque
légende est vérifié par assert ; les étiquettes sont placées d'après leur largeur calculée sur les polices KaTeX.
"""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, bezier, largeur_texte

W0 = 420


def _executer(prog, x, pas_max=10000):
    r = {i + 1: v for i, v in enumerate(x)}
    l, t, vues = 0, 0, set()
    while l < len(prog):
        etat = (l, tuple(sorted((i, v) for i, v in r.items() if v)))
        assert etat not in vues, 'boucle'
        vues.add(etat)
        ins = prog[l]
        if ins[0] == 'INC':
            r[ins[1]] = r.get(ins[1], 0) + 1
            l += 1
        elif r.get(ins[1], 0) > 0:
            r[ins[1]] -= 1
            l += 1
        else:
            l = ins[2]
        t += 1
        assert t < pas_max
    return r.get(0, 0), t, r


def _dans_cadre(S, p, s, taille, ancre='middle', roman=False, marge=2):
    w = largeur_texte(s, taille, roman=roman)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w)
    return (x0, p[1] - 0.6 * taille, x0 + w, p[1] + 0.6 * taille)


def _nom(ins):
    return f'`INC`({ins[1]})' if ins[0] == 'INC' else f'`DEC`({ins[1]}, {ins[2]})'


DOUBLE = [('DEC', 1, 4), ('INC', 0), ('INC', 0), ('DEC', 2, 0)]


@schema('lex-programme-machine-1')
def lex_programme_machine_1():
    for x in range(10):
        res, t, r = _executer(DOUBLE, (x,))
        assert res == 2 * x and t == 4 * x + 1 and r.get(2, 0) == 0     # double, R_2 toujours nul
    W, H = W0, 286
    S = Schema(W, H, 'Programme du double sur une machine à registres')
    xc, y0, dy = 214, 26, 58
    bw, bh = 150, 32
    ys = [y0 + dy * k for k in range(5)]
    assert ys[-1] + bh / 2 <= H - 4
    for k, ins in enumerate(DOUBLE):
        S.rect(xc - bw / 2, ys[k] - bh / 2, bw, bh, 't', rx=6)
        S.texte((xc - bw / 2 + 10, ys[k]), f'I_{k}', 'g', ancre='start', taille=17)
        S.texte((xc + 12, ys[k]), _nom(ins), taille=17)
    S.rect(xc - bw / 2, ys[4] - bh / 2, bw, bh, 'r', rx=16)
    S.texte((xc, ys[4]), 'arrêt', 'r', taille=17, roman=True)
    # instruction suivante (INC, ou registre non nul) : gris, vers le bas
    for k in (0, 1, 2):
        S.fleche((xc, ys[k] + bh / 2), (xc, ys[k + 1] - bh / 2), 'g', retrait=1)
    b1 = _dans_cadre(S, (xc + 8, (ys[0] + ys[1]) / 2), 'R_1 > 0', 14, 'start')
    S.texte((xc + 8, (ys[0] + ys[1]) / 2), 'R_1 > 0', 'g', ancre='start', taille=17)
    # saut de I_0 vers l'arrêt quand R_1 est vide : rouge, à droite
    assert DOUBLE[0] == ('DEC', 1, 4) and len(DOUBLE) == 4
    xd = xc + bw / 2
    p, q = np.array([xd, ys[0] + 4.0]), np.array([xd, ys[4] - 4.0])
    bombe = 70
    S.courbe_fleche(bezier(p, p + [bombe, 0], q + [bombe, 0], q), 'r')
    lab = 'R_1 = 0'
    pl = (xd + 0.75 * bombe + 8, (ys[0] + ys[4]) / 2)
    _dans_cadre(S, pl, lab, 15, 'start')
    S.texte(pl, lab, 'r', ancre='start', taille=17)
    # saut inconditionnel de I_3 vers I_0 (R_2 nul) : rouge pointillé, à gauche
    assert DOUBLE[3] == ('DEC', 2, 0)
    xg = xc - bw / 2
    p, q = np.array([xg, ys[3]]), np.array([xg, ys[0]])
    bombe = 64
    S.courbe_fleche(bezier(p, p - [bombe, 0], q - [bombe, 0], q), 'r', d=True)
    lab = 'R_2 = 0'
    pl = (xg - 0.75 * bombe - 8, (ys[0] + ys[3]) / 2)
    _dans_cadre(S, pl, lab, 15, 'end')
    S.texte(pl, lab, 'r', ancre='end', taille=17)
    assert b1[0] > xc
    return S


def _code(mot):
    A = {'+': 6, 'x_0': 8, '0': 4}
    c = 0
    for m in mot:
        c = 2 ** c * (2 * A[m] + 1)
    return c


@schema('lex-facteur-mot-1')
def lex_facteur_mot_1():
    w = ['+', 'x_0', '0']
    fact = [(i, j) for i in range(3) for j in range(i + 1, 4)]
    assert len(fact) == 6
    mots = {tuple(w[i:j]) for i, j in fact}
    assert ('+', '0') not in mots                                         # + 0 n'est pas un facteur
    assert all(_code(w[i:j]) <= _code(w) for i, j in fact)
    W, H = W0, 214
    S = Schema(W, H, 'Les facteurs non vides du mot + x0 0')
    cell, x0 = 104, 54
    yl = H - 30                                                            # lettres
    xs = [x0 + cell * (k + 0.5) for k in range(3)]
    for k, m in enumerate(w):
        S.texte((xs[k], yl), m, taille=19)
        S.texte((xs[k], yl + 22), str(k), 'g', taille=17)
    # niveaux : longueur 1 en bas, 3 en haut ; les traits de même longueur se décalent pour ne pas se chevaucher
    niveaux = {1: [yl - 34], 2: [yl - 70, yl - 92], 3: [yl - 128]}
    couleurs = {1: 'g', 2: 'b', 3: 'r'}
    traits = []
    for i, j in fact:
        L = j - i
        y = niveaux[L][i] if L == 2 else niveaux[L][0]
        a, b = x0 + cell * i + 8, x0 + cell * j - 8
        S.ligne((a, y), (b, y), couleurs[L], l=4)
        S.ligne((a, y - 6), (a, y + 6), couleurs[L])
        S.ligne((b, y - 6), (b, y + 6), couleurs[L])
        traits.append((i, j, y))
    # deux traits de même hauteur ne se chevauchent pas
    for u in range(len(traits)):
        for v in range(u + 1, len(traits)):
            (i1, j1, y1), (i2, j2, y2) = traits[u], traits[v]
            if y1 == y2:
                assert j1 <= i2 or j2 <= i1
    # seul le trait du mot entier couvre à la fois les rangs 0 et 2
    assert [(i, j) for i, j, _ in traits if i <= 0 and j >= 3] == [(0, 3)]
    assert min(y for _, _, y in traits) >= 20
    return S
