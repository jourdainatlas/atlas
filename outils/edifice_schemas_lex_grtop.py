"""Schémas des exemples du lexique, théorie grtop (groupes topologiques) : contenu/exemples/grtop.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 420, hauteur au plus 300, étiquettes de 17 (mémo de
l'édifice, § 111). La théorie grtop ne repose que sur alg, top, rel, zf et log : les figures représentent des
groupes finis munis de topologies finies, points posés à la main et ouverts dessinés comme des contours ; ce
que dit la légende (appartenances, continuité) est recalculé par énumération et vérifié par assert, et chaque
contour entoure exactement les points de la partie qu'il représente. ∅ est dessiné barré, comme dans le texte.
"""
import itertools
import re
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte

W = 420
TL = 17


def _vide_ams(S):
    """Dessine ∅ comme \\varnothing (police KaTeX_AMS), ainsi qu'il est écrit dans le texte des exemples
    (même auxiliaire que dans les lots rel et top)."""
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


def _dans_cadre(S, p, s, taille=TL, ancre='middle', marge=2):
    w = largeur_texte(s, taille)
    x0 = {'start': p[0], 'middle': p[0] - w / 2, 'end': p[0] - w}[ancre]
    assert x0 >= marge and x0 + w <= S.w - marge and taille / 2 <= p[1] <= S.h - taille / 2, (s, x0, w, p)
    return x0, x0 + w


def _etiq(S, p, s, c='t', ancre='middle', taille=TL):
    _dans_cadre(S, p, s, taille, ancre)
    S.texte(p, s, c, ancre=ancre, taille=taille)


class Ell:
    def __init__(self, c, rx, ry):
        self.c, self.rx, self.ry = np.asarray(c, float), rx, ry

    def val(self, p):
        p = np.asarray(p, float)
        return ((p[..., 0] - self.c[0]) / self.rx) ** 2 + ((p[..., 1] - self.c[1]) / self.ry) ** 2


def parties(E):
    E = sorted(E)
    return [frozenset(c) for k in range(len(E) + 1) for c in itertools.combinations(E, k)]


def nom(X):
    return '∅' if not X else '{' + ', '.join(sorted(X)) + '}'


@schema('lex-groupe-topologique-1')
def lex_groupe_topologique_1():
    G = parties('ab')
    H = [X for X in G if 'b' not in X]
    Hp = [X for X in G if 'b' in X]
    T = [frozenset(), frozenset(H), frozenset(Hp), frozenset(G)]
    # légende : les ouverts sont les réunions de blocs ; ∅ et {a} sont dans le même bloc, que tout ouvert
    # contenant ∅ contient
    assert all(frozenset(H) <= U for U in T if frozenset() in U)
    assert frozenset('a') in H
    Hh = 170
    S = Schema(W, Hh, 'Les quatre éléments de P({a, b}) et les deux blocs H et H′')
    yc = 100
    pos = {frozenset(): (72, yc), frozenset('a'): (152, yc), frozenset('b'): (268, yc), frozenset('ab'): (352, yc)}
    EH = Ell((112, yc - 4), 82, 46)
    EHp = Ell((310, yc - 4), 90, 46)
    for X, p in pos.items():
        q = np.array(p) + [0, 8]                       # centre approximatif du groupe point + étiquette
        if X in H:
            assert EH.val(q) < 0.7 and EHp.val(q) > 1.3
        else:
            assert EHp.val(q) < 0.7 and EH.val(q) > 1.3
    assert EH.c[0] + EH.rx < EHp.c[0] - EHp.rx                       # contours disjoints
    assert EHp.c[0] + EHp.rx < W - 2 and EH.c[0] - EH.rx > 2
    S.ellipse(EH.c, EH.rx, EH.ry, 'b', rempli='b')
    S.ellipse(EHp.c, EHp.rx, EHp.ry, 'v', rempli='v')
    for X, p in pos.items():
        S.point(p, 't', r=3.6)
        _etiq(S, np.array(p) + [0, 20], nom(X), 't')
    _etiq(S, (EH.c[0], EH.c[1] - EH.ry - 14), 'H', 'b')
    _etiq(S, (EHp.c[0], EHp.c[1] - EHp.ry - 14), 'H′', 'v')
    return _vide_ams(S)


@schema('lex-groupe-topologique-2')
def lex_groupe_topologique_2():
    vide, E = frozenset(), frozenset('a')
    G = [vide, E]
    T = [frozenset(), frozenset({E}), frozenset(G)]
    pre = {(X, Y) for X in G for Y in G if X ^ Y == E}
    assert pre == {(vide, E), (E, vide)}
    # plus petit ouvert du produit contenant (∅, E) : intersection des pavés U × V qui le contiennent
    paves = [frozenset((x, y) for x in U for y in V) for U in T for V in T]
    cont = [P for P in paves if (vide, E) in P]
    pp = frozenset.intersection(*cont)
    assert pp == {(vide, E), (E, E)} and (E ^ E) == vide
    Hh = 250
    S = Schema(W, Hh, 'Le produit G × G et l’image réciproque de {E}')
    xs = {vide: 160, E: 300}
    ys = {vide: 190, E: 92}
    # cadre bleu autour de la rangée Y = E
    x0, y0, w, h = 118, 58, 270, 70
    S.rect(x0, y0, w, h, 'b', rempli='b', rx=16)
    for X in G:
        for Y in G:
            p = (xs[X], ys[Y])
            dedans = x0 + 6 < p[0] < x0 + w - 6 and y0 + 6 < p[1] < y0 + h - 6
            assert dedans == ((X, Y) in pp)
            c = 'r' if (X, Y) in pre else 't'
            S.point(p, c, r=4.2)
            s = '(' + nom(X) + ', ' + ('E' if Y else '∅') + ')'
            s = s.replace('{a}', 'E')
            _etiq(S, (p[0] + 12, p[1] - 15), s, c, ancre='start')
            if (X, Y) in pp:
                a, b = _dans_cadre(S, (p[0] + 12, p[1] - 15), s, ancre='start')
                assert b < x0 + w - 3 and p[1] - 15 - 9 > y0
    # coordonnées : abscisse X (première), ordonnée Y (seconde)
    ybas = 232
    S.ligne((120, ybas - 14), (390, ybas - 14), 'g')
    S.ligne((112, 40), (112, ybas - 14), 'g')
    for X in G:
        _etiq(S, (xs[X], ybas), 'E' if X else '∅', 'g')
    for Y in G:
        _etiq(S, (96, ys[Y]), 'E' if Y else '∅', 'g', ancre='end')
    _etiq(S, (400, ybas), 'X', 'g', ancre='end')
    _etiq(S, (96, 40), 'Y', 'g', ancre='end')
    return _vide_ams(S)
