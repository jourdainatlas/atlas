"""Schémas des exemples du lexique, théorie ordin (ordinaux, cardinaux) : contenu/exemples/ordin.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 17 (mémo de
l'édifice, § 111). Les ensembles héréditairement finis sont codés par des frozenset, et les appartenances
dessinées sont calculées ; ce que dit la légende est vérifié par assert.
"""
import itertools
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte

TAILLE = 17
fs = frozenset


def _demi(s):
    return largeur_texte(s, TAILLE) / 2 + 6, 13


def _sortie(p, q, hw, hh):
    d = np.asarray(q, float) - np.asarray(p, float)
    L = np.linalg.norm(d)
    tx = hw / abs(d[0]) if abs(d[0]) > 1e-9 else np.inf
    ty = hh / abs(d[1]) if abs(d[1]) > 1e-9 else np.inf
    return min(tx, ty) * L


def _entre_boites(p, q, bp, bq, marge=3):
    p, q = np.asarray(p, float), np.asarray(q, float)
    u = (q - p) / np.linalg.norm(q - p)
    return p + (_sortie(p, q, *bp) + marge) * u, q - (_sortie(q, p, *bq) + marge) * u


@schema('lex-ordinal-2')
def lex_ordinal_2():
    V0 = fs()
    V1 = fs({V0})
    S1 = fs({V1})
    x = fs({V0, V1, S1})
    assert all(y <= x for y in x)                                     # x est transitif
    el = [V0, V1, S1]
    appart = [(z, y) for z in el for y in el if z in y]
    assert appart == [(V0, V1), (V1, S1)]                              # les deux flèches tracées
    assert V0 in V1 and V1 in S1 and V0 not in S1                       # ∈ non transitive sur x
    nom = {V0: '∅', V1: '{∅}', S1: '{{∅}}'}
    W, H = 420, 214
    pos = {V0: (70.0, 170.0), V1: (210.0, 50.0), S1: (350.0, 170.0)}
    demi = {e: _demi(nom[e]) for e in el}
    for e in el:
        assert demi[e][0] < pos[e][0] < W - demi[e][0] and demi[e][1] < pos[e][1] < H - demi[e][1]
    S = Schema(W, H, "L'appartenance sur l'ensemble transitif {∅, {∅}, {{∅}}} n'est pas transitive")
    for z, y in appart:
        p, q = _entre_boites(pos[z], pos[y], demi[z], demi[y], 4)
        S.fleche(p, q, 't')
    p, q = _entre_boites(pos[V0], pos[S1], demi[V0], demi[S1], 6)
    S.fleche(p, q, 'r', d=True)
    S.texte(((p[0] + q[0]) / 2, p[1] + 22), 'absente', 'r', ui=True)
    for e in el:
        S.texte(pos[e], nom[e], 't', taille=TAILLE)
    return S


@schema('lex-filtre-2')
def lex_filtre_2():
    X = ('a', 'b', 'c')
    P = [fs(c) for k in range(4) for c in itertools.combinations(X, k)]
    fam = [B for B in P if B & fs('ab')]
    assert len(fam) == 6                                               # « les six parties »
    assert fs('a') in fam and fs('b') in fam and fs('a') & fs('b') == fs() and fs() not in fam
    assert all(B in fam for A in fam for B in P if A <= B)             # stable par passage au plus grand
    nom = {B: '∅' if not B else '{' + ', '.join(sorted(B)) + '}' for B in P}
    xs = {('a',): 90, ('b',): 210, ('c',): 330, ('a', 'b'): 90, ('a', 'c'): 210, ('b', 'c'): 330}
    ys = {0: 270, 1: 186, 2: 102, 3: 22}
    pos = {B: (xs.get(tuple(sorted(B)), 210), ys[len(B)]) for B in P}
    W, H = 420, 292
    demi = {B: _demi(nom[B]) for B in P}
    S = Schema(W, H, "Les parties de {a, b, c} qui rencontrent {a, b} : ce n'est pas un filtre")
    cv = [(A, B) for A in P for B in P if A < B and len(B) == len(A) + 1]
    assert len(cv) == 12
    for A, B in cv:
        assert pos[B][1] < pos[A][1]
        p, q = _entre_boites(pos[A], pos[B], demi[A], demi[B])
        S.ligne(p, q, 'g')
    couleur = {B: 'b' for B in fam}
    couleur[fs('a')] = couleur[fs('b')] = 'r'
    couleur[fs()] = 'g'
    for B in P:
        hw, hh = demi[B]
        assert hw < pos[B][0] < W - hw and hh < pos[B][1] < H - hh
        S.texte(pos[B], nom[B], couleur.get(B, 't'), taille=TAILLE)
    return S
