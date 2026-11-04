"""Schémas des exemples du lexique, théorie ord (structures d'ordre) : contenu/exemples/ord.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 17 (mémo de
l'édifice, § 111). Diagrammes de Hasse : les relations de couverture sont calculées à partir de l'ordre, les
positions sont fixées par rang, et ce que dit la légende est vérifié par assert.
"""
import itertools
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte

TAILLE = 17


def _nu(s):
    """Texte d'une étiquette sans les marques d'indice, pour en mesurer la largeur (par excès)."""
    return s.replace('_{', '').replace('}', '').replace('_', '')


def _demi(s):
    return largeur_texte(_nu(s), TAILLE) / 2 + 5, 12


def _sortie(p, q, hw, hh):
    d = np.asarray(q, float) - np.asarray(p, float)
    L = np.linalg.norm(d)
    tx = hw / abs(d[0]) if abs(d[0]) > 1e-9 else np.inf
    ty = hh / abs(d[1]) if abs(d[1]) > 1e-9 else np.inf
    return min(tx, ty) * L


def couvertures(P, le):
    """Couples (x, y) tels que y couvre x : x < y sans élément strictement entre les deux."""
    lt = lambda x, y: le(x, y) and x != y
    return [(x, y) for x in P for y in P if lt(x, y) and not any(lt(x, z) and lt(z, y) for z in P)]


def hasse(S, P, le, pos, nom, couleur=None, trait=None, W=420, H=300):
    """Trace le diagramme de Hasse : traits entre boîtes d'étiquettes, puis étiquettes. Vérifie que chaque
    trait monte (l'élément plus grand est plus haut) et que rien ne sort du cadre."""
    couleur = couleur or {}
    trait = trait or {}
    demi = {x: _demi(nom[x]) for x in P}
    for x in P:
        hw, hh = demi[x]
        assert hw < pos[x][0] < W - hw and hh < pos[x][1] < H - hh, (x, pos[x])
    cv = couvertures(P, le)
    for x, y in cv:
        assert pos[y][1] < pos[x][1], (x, y)                 # le plus grand est plus haut
    for x, y in sorted(cv, key=lambda e: trait.get(e, 't') != 't'):   # traits colorés par-dessus
        p, q = np.asarray(pos[x], float), np.asarray(pos[y], float)
        u = (q - p) / np.linalg.norm(q - p)
        S.ligne(p + (_sortie(p, q, *demi[x]) + 3) * u, q - (_sortie(q, p, *demi[y]) + 3) * u, trait.get((x, y), 't'))
    for x in P:
        S.texte(pos[x], nom[x], couleur.get(x, 't'), taille=TAILLE)
    return cv


def parties(E):
    return [frozenset(c) for k in range(len(E) + 1) for c in itertools.combinations(E, k)]


def nom_partie(X):
    return '∅' if not X else '{' + ', '.join(sorted(X)) + '}'


def equivalences(E):
    diag = frozenset((x, x) for x in E)
    hors = [(x, y) for x in E for y in E if x != y]
    res = []
    for k in range(len(hors) + 1):
        for c in itertools.combinations(hors, k):
            R = diag | frozenset(c)
            if all((y, x) in R for (x, y) in R) and all((x, w) in R for (x, y) in R for (z, w) in R if y == z):
                res.append(R)
    return res


@schema('lex-ordre-total-1')
def lex_ordre_total_1():
    C = ['a', 'b']                                   # a < b
    P = [(x, y) for x in C for y in C]
    i = C.index
    prod = lambda p, q: i(p[0]) <= i(q[0]) and i(p[1]) <= i(q[1])
    lex = lambda p, q: i(p[0]) < i(q[0]) or (p[0] == q[0] and i(p[1]) <= i(q[1]))
    assert not prod(('a', 'b'), ('b', 'a')) and not prod(('b', 'a'), ('a', 'b'))     # incomparables (rouge)
    assert all(lex(p, q) or lex(q, p) for p in P for q in P)                            # total
    rang = sorted(P, key=lambda p: sum(lex(q, p) for q in P))
    assert rang == [('a', 'a'), ('a', 'b'), ('b', 'a'), ('b', 'b')]
    nom = {p: f'({p[0]}, {p[1]})' for p in P}
    W, H = 420, 262
    S = Schema(W, H, "Ordre produit et ordre lexicographique sur {a, b} × {a, b}")
    # à gauche, le losange de l'ordre produit (positions par rang : somme des coordonnées)
    xg, yb, dy, dx = 112.0, 232.0, 72.0, 62.0
    pg = {('a', 'a'): (xg, yb), ('a', 'b'): (xg - dx, yb - dy), ('b', 'a'): (xg + dx, yb - dy),
          ('b', 'b'): (xg, yb - 2 * dy)}
    cvp = hasse(S, P, prod, pg, nom, couleur={('a', 'b'): 'r', ('b', 'a'): 'r'})
    assert len(cvp) == 4 and (('a', 'b'), ('b', 'a')) not in cvp
    # les deux couples rouges ne se chevauchent pas
    assert (pg[('b', 'a')][0] - _demi(nom[('b', 'a')])[0]) - (pg[('a', 'b')][0] + _demi(nom[('a', 'b')])[0]) > 20
    # à droite, la chaîne de l'ordre lexicographique, à pas réguliers
    xd = 318.0
    pd = {p: (xd, yb - k * (2 * dy) / 3) for k, p in enumerate(rang)}
    cvl = hasse(S, P, lex, pd, nom)
    assert len(cvl) == 3
    S.texte((xg, 22), 'ordre produit', 'g', ui=True)
    S.texte((xd, 22), 'ordre lexicographique', 'g', ui=True)
    return S


@schema('lex-borne-superieure-1')
def lex_borne_superieure_1():
    E = ('a', 'b', 'c')
    EQ = equivalences(E)
    assert len(EQ) == 5                                              # « les cinq relations d'équivalence »
    D = frozenset((x, x) for x in E)
    R = {k: D | {(k[0], k[1]), (k[1], k[0])} for k in ('ab', 'ac', 'bc')}
    EE = frozenset((x, y) for x in E for y in E)
    assert set(EQ) == {D, EE, *R.values()}
    le = lambda X, Y: X <= Y
    maj = [M for M in EQ if R['ab'] <= M and R['bc'] <= M]
    assert maj == [EE]                                               # un seul majorant, donc la borne sup
    assert R['ab'] | R['bc'] < EE                                    # qui contient strictement la réunion
    nom = {D: 'Δ', EE: 'E × E', R['ab']: 'R_{ab}', R['ac']: 'R_{ac}', R['bc']: 'R_{bc}'}
    W, H = 420, 250
    pos = {D: (210, 222), R['ab']: (90, 125), R['ac']: (210, 125), R['bc']: (330, 125), EE: (210, 28)}
    S = Schema(W, H, "Les relations d'équivalence sur {a, b, c} ; borne supérieure de deux d'entre elles")
    cv = hasse(S, EQ, le, pos, nom, couleur={R['ab']: 'b', R['bc']: 'b', EE: 'r'},
               trait={(R['ab'], EE): 'r', (R['bc'], EE): 'r'})
    assert len(cv) == 6
    return S


@schema('lex-borne-superieure-3')
def lex_borne_superieure_3():
    f = frozenset
    G = [f(), f('a'), f('b'), f('abc'), f('abd')]
    le = lambda X, Y: X <= Y
    maj = [M for M in G if f('a') <= M and f('b') <= M]
    assert set(maj) == {f('abc'), f('abd')}
    assert not (f('abc') <= f('abd') or f('abd') <= f('abc'))     # aucun au-dessous de l'autre
    cv = couvertures(G, le)
    assert all((x, M) in cv for x in (f('a'), f('b')) for M in maj)  # chacun relié aux deux
    nom = {X: nom_partie(X) for X in G}
    W, H = 420, 236
    pos = {f(): (210, 208), f('a'): (120, 118), f('b'): (300, 118), f('abc'): (120, 28), f('abd'): (300, 28)}
    S = Schema(W, H, "Deux majorants incomparables : pas de borne supérieure")
    hasse(S, G, le, pos, nom, couleur={f('abc'): 'b', f('abd'): 'b'})
    return S


@schema('lex-chaine-1')
def lex_chaine_1():
    E = ('a', 'b', 'c')
    P = parties(E)
    f = frozenset
    ch = [f(), f('b'), f('bc'), f('abc')]
    assert all(X <= Y or Y <= X for X in ch for Y in ch)                  # chaîne
    autres = [X for X in P if X not in ch]
    comp = lambda X, Y: X <= Y or Y <= X
    assert all(any(not comp(X, Y) for Y in ch) for X in autres)          # chaque noire incomparable à une rouge
    le = lambda X, Y: X <= Y
    xs = {('a',): 90, ('b',): 210, ('c',): 330, ('a', 'b'): 90, ('a', 'c'): 210, ('b', 'c'): 330}
    ys = {0: 270, 1: 186, 2: 102, 3: 22}
    pos = {X: (xs.get(tuple(sorted(X)), 210), ys[len(X)]) for X in P}
    nom = {X: nom_partie(X) for X in P}
    W, H = 420, 292
    S = Schema(W, H, "Une chaîne maximale dans les parties de {a, b, c}")
    tr = {(ch[k], ch[k + 1]): 'r' for k in range(3)}
    cv = hasse(S, P, le, pos, nom, couleur={X: 'r' for X in ch}, trait=tr)
    assert all(e in cv for e in tr)                                     # la chaîne monte par couvertures
    assert all(len(Y) == len(X) + 1 for X, Y in cv)                     # un point de plus à chaque trait
    return S
