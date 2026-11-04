"""Schémas des exemples du lexique, théorie alg (structures algébriques) : contenu/exemples/alg.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur 300 au plus, étiquettes de 17 (mémo de
l'édifice, § 111). Les objets (bijections, sous-groupes, idéaux) sont calculés par énumération, les positions
calculées, et ce que dit chaque légende vérifié par assert.
"""
import itertools
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte, courbe_entre

TAILLE = 17


# ---------------------------------------------------------------- outils
def _comp(f, g):
    """f ∘ g, pour des bijections données par des dict."""
    return {x: f[g[x]] for x in g}


def _ech(E, x, y):
    return {z: (y if z == x else x if z == y else z) for z in E}


def _cle(f):
    return tuple(sorted(f.items()))


def _sortie_boite(c, vers, dx, dy):
    """Distance de c au bord du rectangle de demi-côtés (dx, dy) centré en c, dans la direction de « vers »."""
    u = np.asarray(vers, float) - c
    u = u / np.linalg.norm(u)
    return min(dx / abs(u[0]) if abs(u[0]) > 1e-12 else np.inf, dy / abs(u[1]) if abs(u[1]) > 1e-12 else np.inf)


def _couvertures(elts, inclus):
    """Relations de couverture de l'ordre « inclus » sur elts."""
    return {(s, t) for s in elts for t in elts
            if s != t and inclus(s, t) and not any(u not in (s, t) and inclus(s, u) and inclus(u, t) for u in elts)}


def _hasse(S, pos, nom, couv, couleur, W, H):
    """Diagramme de Hasse : étiquettes centrées en pos, traits entre bords de boîtes calculés."""
    demi = {k: (largeur_texte(nom[k], TAILLE) / 2 + 5, 12) for k in pos}
    for k in pos:                                            # rien ne sort du cadre
        assert demi[k][0] + 2 < pos[k][0] < W - demi[k][0] - 2, (nom[k], pos[k])
        assert demi[k][1] + 2 < pos[k][1] < H - demi[k][1] - 2, (nom[k], pos[k])
    ks = list(pos)                                           # pas deux étiquettes qui se chevauchent
    for i, a in enumerate(ks):
        for b in ks[i + 1:]:
            assert (abs(pos[a][0] - pos[b][0]) > demi[a][0] + demi[b][0] + 6
                    or abs(pos[a][1] - pos[b][1]) > demi[a][1] + demi[b][1] + 6), (nom[a], nom[b])
    for a, b in sorted(couv, key=lambda c: (nom[c[0]], nom[c[1]])):
        p, q = np.asarray(pos[a], float), np.asarray(pos[b], float)
        u = (q - p) / np.linalg.norm(q - p)
        S.ligne(p + (_sortie_boite(p, q, *demi[a]) + 2) * u, q - (_sortie_boite(q, p, *demi[b]) + 2) * u, 'g')
    for k in pos:
        S.texte(pos[k], nom[k], couleur.get(k, 't'), taille=TAILLE)


# ---------------------------------------------------------------- groupe symétrique de {a, b, c}
@schema('lex-groupe-symetrique-1')
def lex_groupe_symetrique_1():
    E = 'abc'
    idE = {x: x for x in E}
    tab, tbc, tac = _ech(E, 'a', 'b'), _ech(E, 'b', 'c'), _ech(E, 'a', 'c')
    rho = _comp(tab, tbc)
    rho2 = _comp(rho, rho)
    assert (rho['a'], rho['b'], rho['c']) == ('b', 'c', 'a')
    assert _cle(rho2) == _cle(_comp(tbc, tab))
    haut = [(idE, '`id`'), (tab, 'τ_{ab}'), (tbc, 'τ_{bc}'), (tac, 'τ_{ac}')]
    bas = [(rho, 'ρ'), (rho2, 'ρ∘ρ')]
    toutes = {_cle(dict(zip(E, p))) for p in itertools.permutations(E)}
    assert {_cle(f) for f, _ in haut + bas} == toutes and len(haut + bas) == 6      # les six bijections
    assert all(any(f[x] == x for x in E) for f, _ in haut)                         # en haut : un point fixé
    assert all(all(f[x] != x for x in E) for f, _ in bas)                          # en bas : aucun

    W, H = 420, 298
    S = Schema(W, H, 'Les six bijections de {a, b, c}')
    r = 30                                           # rayon du cercle des trois sommets
    angle = {'a': -np.pi / 2, 'b': np.pi / 2 + np.pi / 3, 'c': np.pi / 2 - np.pi / 3}
    pas = W / 4
    dx, haut_c, bas_c = pas / 2 - 3.5, r + 30, r + 46   # cadre : demi-largeur, au-dessus et au-dessous du centre
    cadres = []

    def case(f, nom, cx, cy, coul):
        cadres.append((cx - dx, cy - haut_c, cx + dx, cy + bas_c))
        S.rect(cx - dx, cy - haut_c, 2 * dx, haut_c + bas_c, 'g', rx=6)
        P = {x: np.array([cx + r * np.cos(angle[x]), cy + r * np.sin(angle[x])]) for x in E}
        # les étiquettes des points et le nom tiennent dans le cadre
        for x in E:
            q = P[x] + 15 * (P[x] - sum(P.values()) / 3) / np.linalg.norm(P[x] - sum(P.values()) / 3)
            assert cx - dx + 3 < q[0] - 6 and q[0] + 6 < cx + dx - 3 and cy - haut_c + 3 < q[1] - 9
        assert largeur_texte(nom.replace('_', '').replace('{', '').replace('}', '').replace('`', ''), TAILLE) / 2 < dx - 4
        assert cy + r + 30 + 9 < cy + bas_c
        g = sum(P.values()) / 3
        for x in E:
            if f[x] != x:                            # une flèche de x vers son image, et seulement alors
                # bombé vers l'extérieur pour une bijection qui ne fixe aucun point ; pour un échange, les deux
                # flèches, de sens opposés, se placent d'elles-mêmes de part et d'autre de la corde
                pts = courbe_entre(P[x], P[f[x]], 0.22, n=40)
                if all(f[y] != y for y in E) and np.linalg.norm(pts[20] - g) < np.linalg.norm((P[x] + P[f[x]]) / 2 - g):
                    pts = courbe_entre(P[x], P[f[x]], -0.22, n=40)
                garde = [p for p in pts if np.linalg.norm(p - P[x]) > 7 and np.linalg.norm(p - P[f[x]]) > 7]
                S.courbe_fleche(np.array(garde), coul)
        for x in E:
            S.point(P[x], 't')
            u = (P[x] - g) / np.linalg.norm(P[x] - g)
            S.texte(P[x] + 15 * u, x, 't', taille=TAILLE)
        S.texte((cx, cy + r + 30), nom, coul if coul != 'g' else 't', taille=TAILLE)
        return P

    y1 = haut_c + 4
    y2 = y1 + haut_c + bas_c + 10
    for k, (f, nom) in enumerate(haut):
        case(f, nom, pas * (k + 0.5), y1, 'g' if f is idE else 'r')
    for k, (f, nom) in enumerate(bas):
        case(f, nom, W / 2 + (k - 0.5) * 2 * pas * 0.75, y2, 'b')
    # les six cadres tiennent dans la figure et ne se touchent pas : chaque bijection est lue dans le sien
    assert all(0 < x0 and x1 < W and 0 < t0 and t1 < H for x0, t0, x1, t1 in cadres)
    assert all(a[2] < b[0] or b[2] < a[0] or a[3] < b[1] or b[3] < a[1]
               for i, a in enumerate(cadres) for b in cadres[i + 1:])
    return S


# ---------------------------------------------------------------- sous-groupes de S({a, b, c})
@schema('lex-sous-groupe-engendre-2')
def lex_sous_groupe_engendre_2():
    E = 'abc'
    G = [dict(zip(E, p)) for p in itertools.permutations(E)]
    cle = {_cle(f): f for f in G}
    idE = _cle({x: x for x in E})

    def engendre(S0):
        Hs = {idE} | set(S0)
        while True:
            H2 = Hs | {_cle(_comp(cle[x], cle[y])) for x in Hs for y in Hs}
            if H2 == Hs:
                return frozenset(Hs)
            Hs = H2

    sg = {engendre(set(S0)) for k in range(3) for S0 in itertools.combinations(cle, k)}
    tab, tbc, tac = (_cle(_ech(E, *p)) for p in ('ab', 'bc', 'ac'))
    rho = _cle(_comp(cle[tab], cle[tbc]))
    Gt = frozenset(cle)
    T = {frozenset({idE}): '{`id`}', engendre({tab}): '⟨τ_{ab}⟩', engendre({tbc}): '⟨τ_{bc}⟩',
         engendre({tac}): '⟨τ_{ac}⟩', engendre({rho}): '⟨ρ⟩', Gt: '𝔖(E)'}
    assert set(T) == sg and len(sg) == 6                                    # « les six sous-groupes »
    rouges = [engendre({tab}), engendre({tbc})]
    assert [Hh for Hh in sg if rouges[0] <= Hh and rouges[1] <= Hh] == [Gt]  # seul le groupe entier les contient
    assert engendre({tab, tbc}) == Gt
    couv = _couvertures(list(sg), lambda s, t: s <= t)

    W, H = 420, 246
    y0, y1, y2 = 34, H / 2, H - 34
    pos = {Gt: (W / 2, y0), frozenset({idE}): (W / 2, y2),
           engendre({tab}): (70, y1), engendre({tbc}): (170, y1), engendre({tac}): (270, y1),
           engendre({rho}): (360, y1)}
    S = Schema(W, H, 'Les six sous-groupes du groupe symétrique de {a, b, c}')
    _hasse(S, pos, T, couv, {rouges[0]: 'r', rouges[1]: 'r'}, W, H)
    return S


# ---------------------------------------------------------------- sous-groupes et sous-modules de P({a, b})
@schema('lex-sous-module-1')
def lex_sous_module_1():
    E = frozenset('ab')
    P = [frozenset(c) for k in range(3) for c in itertools.combinations('ab', k)]
    sg = [frozenset(Hh) for k in range(1, 5) for Hh in itertools.combinations(P, k)
          if frozenset() in Hh and all(x ^ y in Hh for x in Hh for y in Hh)]
    sm = [Hh for Hh in sg if all(A & x in Hh for A in P for x in Hh)]
    O, A_, B_ = frozenset(), frozenset('a'), frozenset('b')
    nom = {frozenset({O}): '{∅}', frozenset({O, A_}): '{∅, {a}}', frozenset({O, E}): '{∅, {a, b}}',
           frozenset({O, B_}): '{∅, {b}}', frozenset(P): '𝒫(E)'}
    assert set(nom) == set(sg) and len(sg) == 5                             # « les cinq sous-groupes »
    rouge = frozenset({O, E})
    assert set(sg) - set(sm) == {rouge} and A_ & E == A_ and A_ not in rouge  # le rouge n'est pas un sous-module
    couv = _couvertures(sg, lambda s, t: s <= t)

    W, H = 420, 200
    pos = {frozenset(P): (W / 2, 32), frozenset({O}): (W / 2, H - 32),
           frozenset({O, A_}): (80, H / 2), rouge: (W / 2, H / 2), frozenset({O, B_}): (W - 80, H / 2)}
    S = Schema(W, H, 'Sous-groupes et sous-modules de P({a, b})')
    _hasse(S, pos, nom, couv, {rouge: 'r'}, W, H)
    return S


# ---------------------------------------------------------------- idéaux de P({a, b, c})
@schema('lex-ideal-maximal-2')
def lex_ideal_maximal_2():
    E = 'abc'
    P = [frozenset(c) for k in range(4) for c in itertools.combinations(E, k)]
    PF = lambda F: frozenset(X for X in P if X <= F)
    ideaux = [frozenset(I) for k in range(1, len(P) + 1) for I in itertools.combinations(P, k)
              if frozenset() in I and all(x ^ y in I for x in I for y in I) and all(A & x in I for A in P for x in I)]
    assert set(ideaux) == {PF(F) for F in P} and len(ideaux) == 8           # « les huit idéaux »
    A = frozenset(P)
    propres = [I for I in ideaux if I != A]
    maxi = {I for I in propres if not any(I < J for J in propres)}
    assert maxi == {PF(frozenset(E) - {x}) for x in E}                     # trois maximaux, juste sous A
    nul = PF(frozenset())
    assert nul not in maxi and nul < PF(frozenset('a')) < PF(frozenset('ab')) < A
    couv = _couvertures(ideaux, lambda s, t: s <= t)
    assert all(J == A for I, J in couv if I in maxi)                       # au-dessus d'un maximal : l'anneau

    def nom(F):
        if not F:
            return '{∅}'
        if len(F) == 3:
            return '𝒫(E)'
        return '𝒫({' + ', '.join(sorted(F)) + '})'

    W, H = 420, 286
    ys = [H - 30, H - 30 - (H - 60) / 3, 30 + (H - 60) / 3, 30]
    xs = [80, W / 2, W - 80]
    niveau = {1: ['a', 'b', 'c'], 2: ['ab', 'ac', 'bc']}
    pos = {nul: (W / 2, ys[0]), A: (W / 2, ys[3])}
    for k in (1, 2):
        for x, F in zip(xs, niveau[k]):
            pos[PF(frozenset(F))] = (x, ys[k])
    noms = {PF(F): nom(F) for F in P}
    S = Schema(W, H, 'Les idéaux de P({a, b, c}), rangés par inclusion')
    _hasse(S, pos, noms, couv, {I: 'r' for I in maxi}, W, H)
    return S
