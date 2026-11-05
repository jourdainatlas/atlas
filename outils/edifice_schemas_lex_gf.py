"""Schémas des exemples du lexique, théorie gf (groupes finis) : contenu/exemples/gf.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 400 à 440, hauteur 300 au plus, étiquettes de 17 (mémo de
l'édifice, § 111). Les objets (orbites, sous-groupes, suites) sont calculés par énumération, les positions
calculées, et ce que dit chaque légende vérifié par assert.
"""
import itertools
import re
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte

TAILLE = 17


# ---------------------------------------------------------------- outils
def _vide_ams(S):
    """Dessine ∅ comme \\varnothing (police KaTeX_AMS), ainsi qu'il est écrit dans le texte des exemples, au lieu
    du ∅ ovale de KaTeX_Main que choisit edifice_svg (même auxiliaire que dans les lots rel et top)."""
    def coupe(m):
        attrs, txt = m.group(1), m.group(2)
        morceaux = re.split('(∅)', txt)
        out = []
        for k, c in enumerate(morceaux):
            if not c:
                continue
            a = attrs if k == 0 else re.sub(r' dy="[^"]*"', '', attrs)
            if c == '∅':
                a = a.replace('KaTeX_Main', 'KaTeX_AMS')
            out.append(f'<tspan{a}>{c}</tspan>')
        return ''.join(out)
    S.el = [re.sub(r'<tspan( font-family="KaTeX_Main"[^>]*)>([^<]*∅[^<]*)</tspan>', coupe, e) for e in S.el]
    return S


def _sortie_boite(c, vers, dx, dy):
    """Distance de c au bord du rectangle de demi-côtés (dx, dy) centré en c, dans la direction de « vers »."""
    u = np.asarray(vers, float) - c
    u = u / np.linalg.norm(u)
    return min(dx / abs(u[0]) if abs(u[0]) > 1e-12 else np.inf, dy / abs(u[1]) if abs(u[1]) > 1e-12 else np.inf)


def _couvertures(elts, inclus):
    """Relations de couverture de l'ordre « inclus » sur elts."""
    return {(s, t) for s in elts for t in elts
            if s != t and inclus(s, t) and not any(u not in (s, t) and inclus(s, u) and inclus(u, t) for u in elts)}


def _boites(pos, nom, W, H):
    """Demi-côtés des boîtes des étiquettes ; vérifie qu'elles tiennent dans le cadre et ne se chevauchent pas."""
    demi = {k: (largeur_texte(nom[k], TAILLE) / 2 + 5, 12) for k in pos}
    for k in pos:
        assert demi[k][0] + 2 < pos[k][0] < W - demi[k][0] - 2, (nom[k], pos[k])
        assert demi[k][1] + 2 < pos[k][1] < H - demi[k][1] - 2, (nom[k], pos[k])
    ks = list(pos)
    for i, a in enumerate(ks):
        for b in ks[i + 1:]:
            assert (abs(pos[a][0] - pos[b][0]) > demi[a][0] + demi[b][0] + 6
                    or abs(pos[a][1] - pos[b][1]) > demi[a][1] + demi[b][1] + 6), (nom[a], nom[b])
    return demi


def _trait(S, pos, demi, a, b, c='g', **kw):
    p, q = np.asarray(pos[a], float), np.asarray(pos[b], float)
    u = (q - p) / np.linalg.norm(q - p)
    p2 = p + (_sortie_boite(p, q, *demi[a]) + 2) * u
    q2 = q - (_sortie_boite(q, p, *demi[b]) + 2) * u
    if kw.pop('fleche', False):
        S.fleche(p2, q2, c, **kw)
    else:
        S.ligne(p2, q2, c, **kw)
    return p2, q2


# ---------------------------------------------------------------- orbites de {id, τab} sur 𝒫({a, b, c})
@schema('lex-orbite-1')
def lex_orbite_1():
    E = 'abc'
    P = [frozenset(c) for k in range(4) for c in itertools.combinations(E, k)]
    tab = {'a': 'b', 'b': 'a', 'c': 'c'}
    img = lambda A: frozenset(tab[x] for x in A)
    orbites = {frozenset({A, img(A)}) for A in P}
    assert len(orbites) == 6                                             # « six orbites » (texte)
    fixes = [A for A in P if img(A) == A]
    paires = [o for o in orbites if len(o) == 2]
    assert set(fixes) == {frozenset(), frozenset('c'), frozenset('ab'), frozenset(E)}   # les quatre en rouge
    assert len(paires) == 2                                              # deux doubles flèches bleues

    nom = {A: ('∅' if not A else '{a, b, c}' if len(A) == 3 else '{' + ', '.join(sorted(A)) + '}') for A in P}
    W, H = 420, 262
    ys = {0: H - 26, 1: H - 26 - 70, 2: H - 26 - 140, 3: 26}
    # deux parties d'une même orbite côte à côte, sans autre étiquette entre elles
    xs = {frozenset(): 210, frozenset('a'): 90, frozenset('b'): 210, frozenset('c'): 330,
          frozenset('ac'): 90, frozenset('bc'): 210, frozenset('ab'): 330, frozenset(E): 210}
    pos = {A: (xs[A], ys[len(A)]) for A in P}
    for o in paires:
        A, B = sorted(o, key=lambda X: xs[X])
        assert pos[A][1] == pos[B][1]
        assert not any(pos[C][1] == pos[A][1] and xs[A] < xs[C] < xs[B] for C in P)
    demi = _boites(pos, nom, W, H)
    couv = _couvertures(P, lambda s, t: s <= t)
    assert len(couv) == 12                                               # les douze arêtes du cube

    S = Schema(W, H, 'Orbites du sous-groupe {id, τab} sur les parties de {a, b, c}')
    for A, B in sorted(couv, key=lambda c: (nom[c[0]], nom[c[1]])):
        _trait(S, pos, demi, A, B, 'g')
    for o in sorted(paires, key=lambda o: min(len(X) for X in o)):
        A, B = sorted(o, key=lambda X: xs[X])
        _trait(S, pos, demi, A, B, 'b', fleche=True, double=True)
    for A in P:
        S.texte(pos[A], nom[A], 'r' if A in fixes else 'b', taille=TAILLE)
    return _vide_ams(S)


# ---------------------------------------------------------------- partitions de 4 et groupes abéliens d'ordre 16
def _partitions(a, m=None):
    m = a if m is None else m
    if a == 0:
        yield ()
        return
    for k in range(min(a, m), 0, -1):
        for r in _partitions(a - k, k):
            yield (k,) + r


@schema('lex-partition-entier-1')
def lex_partition_entier_1():
    parts = list(_partitions(4))
    assert parts == [(4,), (3, 1), (2, 2), (2, 1, 1), (1, 1, 1, 1)]           # « les cinq partitions »
    for part in parts:
        ordres = [2 ** k for k in part]
        G = list(itertools.product(*[range(o) for o in ordres]))
        G2 = [x for x in G if all(2 * a % o == 0 for a, o in zip(x, ordres))]
        G4 = {tuple(4 * a % o for a, o in zip(x, ordres)) for x in G}
        assert len(G2) == 2 ** len(part)                                     # 2^r, r rangées
        assert len(G4) == 2 ** sum(max(k - 2, 0) for k in part)              # cases au-delà de la 2e colonne

    def nom(part):
        from collections import Counter
        morceaux = []
        for k, m in sorted(Counter(part).items(), reverse=True):
            base = f'ℤ/{2 ** k}'
            morceaux.append(base if m == 1 else f'(ℤ/{2 ** k})^{m}' if k == 1 else ' × '.join([base] * m))
        return ' × '.join(morceaux)

    noms = [nom(p) for p in parts]
    assert noms == ['ℤ/16', 'ℤ/8 × ℤ/2', 'ℤ/4 × ℤ/4', 'ℤ/4 × (ℤ/2)^2', '(ℤ/2)^4']

    W, H = 420, 234
    c = 15                                                                 # côté d'une case
    slots = [(70, 18), (210, 18), (350, 18), (140, 130), (280, 130)]       # coin haut du diagramme, centre en x
    S = Schema(W, H, 'Les cinq partitions de 4 et les groupes abéliens d\'ordre 16')
    for (cx, y0), part, nm in zip(slots, parts, noms):
        x0 = cx - 2 * c                                                    # quatre colonnes au plus, centrées
        for i, k in enumerate(part):
            for j in range(k):
                coul = 'r' if j >= 2 else 'b'
                S.rect(x0 + j * c, y0 + i * c, c, c, coul, rempli=coul)
        S.ligne((x0 + 2 * c, y0 - 4), (x0 + 2 * c, y0 + 4 * c + 4), 'g', d=True)
        ly = y0 + 4 * c + 22
        w = largeur_texte(nm.replace('^', ''), TAILLE)
        assert cx - w / 2 > 2 and cx + w / 2 < W - 2, nm
        S.texte((cx, ly), nm, 't', taille=TAILLE)
        assert ly + 12 < H
    # les étiquettes d'une même rangée ne se chevauchent pas
    for a, b in ((0, 1), (1, 2), (3, 4)):
        wa = largeur_texte(noms[a].replace('^', ''), TAILLE)
        wb = largeur_texte(noms[b].replace('^', ''), TAILLE)
        assert slots[a][0] + wa / 2 + 6 < slots[b][0] - wb / 2, (noms[a], noms[b])
    return S


# ---------------------------------------------------------------- les six suites de composition de ℤ/30ℤ
@schema('lex-theoreme-jordan-holder-1')
def lex_theoreme_jordan_holder_1():
    n = 30
    divs = [d for d in range(1, n + 1) if n % d == 0]
    # sous-groupes de ℤ/30ℤ, calculés par fermeture ; un par diviseur, celui d'ordre d engendré par 30/d
    sg = set()
    for g in range(n):
        sg.add(frozenset(k * g % n for k in range(n)))
    assert sorted(len(H) for H in sg) == divs                            # « les huit sous-groupes »
    C = {len(H): H for H in sg}
    for d in divs:
        assert C[d] == frozenset(k * (n // d) % n for k in range(n))
    nom = {d: ('ℤ/30' if d == n else '{0}' if d == 1 else f'⟨{n // d}⟩') for d in divs}
    couleur = {2: 'r', 3: 'b', 5: 'v'}
    # traits : C_d ⊂ C_{d'} avec d'/d premier (quotient simple, abélien d'ordre premier)
    traits = [(dp, d) for dp in divs for d in divs if dp % d == 0 and dp // d in couleur]
    assert len(traits) == 12
    assert all(C[d] < C[dp] for dp, d in traits)

    def chemins(d):
        return [[d]] if d == 1 else [[d] + c for dp, dd in traits if dp == d for c in chemins(dd)]

    ch = chemins(n)
    assert len(ch) == 6                                                  # « six chemins »
    for c in ch:                                                         # « un trait de chaque couleur »
        assert sorted(couleur[a // b] for a, b in zip(c, c[1:])) == ['b', 'r', 'v']
    assert {tuple(a // b for a, b in zip(c, c[1:])) for c in ch} == set(itertools.permutations((2, 3, 5)))

    W, H = 420, 274
    ys = {30: 26, 15: 100, 10: 100, 6: 100, 5: 174, 3: 174, 2: 174, 1: H - 26}
    xs = {30: 210, 15: 90, 10: 210, 6: 330, 5: 90, 3: 210, 2: 330, 1: 210}
    pos = {d: (xs[d], ys[d]) for d in divs}
    demi = _boites(pos, nom, W, H)
    S = Schema(W, H, 'Les six suites de composition de ℤ/30ℤ')
    for dp, d in sorted(traits):
        _trait(S, pos, demi, dp, d, couleur[dp // d])
    for d in divs:
        S.texte(pos[d], nom[d], 't', taille=TAILLE)
    return S
