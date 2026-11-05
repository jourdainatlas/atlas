"""Schémas des exemples du lexique, théorie top (structures topologiques) : contenu/exemples/top.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur conseillée pour le panneau du lexique : 400 à 440,
étiquettes de 17 (mémo de l'édifice, § 111). Positions calculées, et ce que la figure affirme vérifié par assert.

La théorie top vient avant ℕ et ℝ : les figures ne représentent que des espaces finis, points posés à la main
et ouverts dessinés comme des contours ; chaque contour est vérifié (il contient exactement les points de la
partie qu'il représente, et deux contours emboîtés ne se coupent pas).
"""
import itertools
import re
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte

TAILLE = 17


def _sortie_boite(c, vers, dx, dy):
    """Distance de c au bord du rectangle de demi-côtés (dx, dy) centré en c, dans la direction de « vers »."""
    u = np.asarray(vers, float) - c
    u = u / np.linalg.norm(u)
    return min(dx / abs(u[0]) if abs(u[0]) > 1e-12 else np.inf, dy / abs(u[1]) if abs(u[1]) > 1e-12 else np.inf)


def _vide_ams(S):
    """Dessine ∅ comme \\varnothing (police KaTeX_AMS), ainsi qu'il est écrit dans le texte des exemples, au lieu
    du ∅ ovale de KaTeX_Main que choisit edifice_svg (même auxiliaire que dans le lot rel)."""
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


@schema('lex-topologie-1')
def lex_topologie_1():
    # Les topologies de X = {a, b}, trouvées par énumération des familles de parties.
    X = frozenset('ab')
    P = [frozenset(c) for k in range(3) for c in itertools.combinations(sorted(X), k)]
    tops = []
    for k in range(len(P) + 1):
        for fam in itertools.combinations(P, k):
            T = set(fam)
            if frozenset() in T and X in T and all(A | B in T and A & B in T for A in T for B in T):
                tops.append(frozenset(T))
    assert len(tops) == 4                                              # « exactement quatre topologies »
    gros = frozenset({frozenset(), X})
    disc = frozenset(P)
    Ta = frozenset({frozenset(), frozenset('a'), X})
    Tb = frozenset({frozenset(), frozenset('b'), X})
    assert set(tops) == {gros, disc, Ta, Tb}
    assert not Ta <= Tb and not Tb <= Ta                               # non comparables
    assert all(gros <= T <= disc for T in tops)                        # entre la grossière et la discrète
    # traits du diagramme : relations de couverture pour l'inclusion
    couv = {(S, T) for S in tops for T in tops
            if S < T and not any(S < U < T for U in tops)}
    assert couv == {(gros, Ta), (gros, Tb), (Ta, disc), (Tb, disc)}

    nom = {gros: '{∅, X}', Ta: '{∅, {a}, X}', Tb: '{∅, {b}, X}', disc: '{∅, {a}, {b}, X}'}
    W, H, taille = 420, 236, 17
    pos = {disc: np.array([W / 2, 34.0]), gros: np.array([W / 2, H - 34.0]),
           Ta: np.array([100.0, H / 2]), Tb: np.array([W - 100.0, H / 2])}
    demi = {T: (largeur_texte(nom[T], taille) / 2 + 6, 13) for T in tops}
    # rien ne sort du cadre, et l'étiquette « non comparables » tient entre les deux topologies du milieu
    for T in tops:
        assert demi[T][0] < pos[T][0] < W - demi[T][0]
    ecart = (pos[Tb][0] - demi[Tb][0]) - (pos[Ta][0] + demi[Ta][0])
    assert ecart > 120, ecart
    S = Schema(W, H, 'Les quatre topologies de {a, b}, rangées par inclusion')
    for A, B in sorted(couv, key=lambda c: (len(c[0]), sorted(map(sorted, c[0])), sorted(map(sorted, c[1])))):
        p, q = pos[A], pos[B]
        u = (q - p) / np.linalg.norm(q - p)
        S.ligne(p + (_sortie_boite(p, q, *demi[A]) + 2) * u, q - (_sortie_boite(q, p, *demi[B]) + 2) * u, 't')
    couleur = {gros: 't', disc: 't', Ta: 'r', Tb: 'r'}
    for T in tops:
        S.texte(pos[T], nom[T], couleur[T], taille=taille)
    S.texte((W / 2, H / 2), 'non comparables', 'r', ui=True)
    S.texte(pos[gros] + [demi[gros][0] + 10, 0], 'grossière', 'g', ancre='start', ui=True)
    S.texte(pos[disc] + [demi[disc][0] + 10, 0], 'discrète', 'g', ancre='start', ui=True)
    return _vide_ams(S)


# ------------------------------------------------------------------ espaces finis dessinés
class Ell:
    """Ellipse (centre, demi-axes) : contour d'une partie finie."""

    def __init__(self, c, rx, ry):
        self.c, self.rx, self.ry = np.asarray(c, float), rx, ry

    def val(self, p):
        p = np.asarray(p, float)
        return ((p[..., 0] - self.c[0]) / self.rx) ** 2 + ((p[..., 1] - self.c[1]) / self.ry) ** 2

    def bord(self, n=240):
        t = np.linspace(0, 2 * np.pi, n, endpoint=False)
        return np.stack([self.c[0] + self.rx * np.cos(t), self.c[1] + self.ry * np.sin(t)], 1)

    def contient(self, p, marge=12):
        """p à l'intérieur, à distance au moins « marge » (en pixels, approchée) du contour."""
        return self.val(p) < (1 - marge / max(self.rx, self.ry)) ** 2 if marge < max(self.rx, self.ry) else False

    def exclut(self, p, marge=12):
        return self.val(p) > (1 + marge / min(self.rx, self.ry)) ** 2


class Rect:
    def __init__(self, x, y, w, h):
        self.x, self.y, self.w, self.h = x, y, w, h

    def contient_pts(self, pts, marge=4):
        pts = np.asarray(pts, float)
        return bool(np.all((pts[:, 0] > self.x + marge) & (pts[:, 0] < self.x + self.w - marge)
                           & (pts[:, 1] > self.y + marge) & (pts[:, 1] < self.y + self.h - marge)))


def _verifie_contour(E, pos, membres, marge=12):
    """Le contour E entoure exactement les points de « membres »."""
    for x, p in pos.items():
        if x in membres:
            assert E.contient(p, marge), (x, membres)
        else:
            assert E.exclut(p, marge), (x, membres)


def _dans(E_int, E_ext, marge=3):
    """Le contour E_int est strictement à l'intérieur du contour E_ext (aucune intersection)."""
    pts = E_int.bord() if isinstance(E_int, Ell) else E_int
    if isinstance(E_ext, Rect):
        return E_ext.contient_pts(pts, marge)
    return bool(np.all(E_ext.val(pts) < 1 - marge / max(E_ext.rx, E_ext.ry)))


def _points(S, pos, couleur=None, decal=(0, 0), taille=TAILLE, etiquette=None, lettres=False):
    """Points de l'espace : un point plein et son nom au-dessous, ou, avec lettres=True (petits panneaux),
    le nom seul, écrit à la place du point."""
    couleur = couleur or {}
    for x, p in pos.items():
        c = couleur.get(x, 't')
        if lettres:
            S.texte(np.asarray(p), (etiquette or {}).get(x, x), c, taille=taille)
            continue
        S.point(p, c, r=3.6)
        S.texte(np.asarray(p) + [0, 18] + decal, (etiquette or {}).get(x, x), c, taille=taille)


def _chaine(cx, cy, k=1.0):
    """Espace X = {a, b, c} et ses ouverts emboîtés {a} ⊂ {a, b} ⊂ X, dessinés autour de (cx, cy) à l'échelle k.
    Rend les positions, le cercle de {a}, l'ellipse de {a, b} et le cadre de X, tous vérifiés."""
    pos = {'a': (cx - 85 * k, cy), 'b': (cx - 5 * k, cy), 'c': (cx + 85 * k, cy)}
    Ea = Ell(pos['a'], 30 * k, 30 * k)
    Eab = Ell((cx - 45 * k, cy), 92 * k, 62 * k)
    R = Rect(cx - 150 * k, cy - 98 * k, 300 * k, 178 * k)
    _verifie_contour(Ea, pos, {'a'}, 10 * k)
    _verifie_contour(Eab, pos, {'a', 'b'}, 10 * k)
    assert _dans(Ea, Eab) and _dans(Eab, R)
    assert R.contient_pts(list(pos.values()), 20 * k)
    return pos, Ea, Eab, R


def _dessine_ell(S, E, c='t', d=False, rempli=None):
    S.ellipse(E.c, E.rx, E.ry, c, d=d, rempli=rempli)


def _dessine_rect(S, R, c='t', d=False, rempli=None):
    S.rect(R.x, R.y, R.w, R.h, c, d=d, rempli=rempli, rx=14)


@schema('lex-ouvert-1')
def lex_ouvert_1():
    W, H = 420, 210
    pos, Ea, Eab, R = _chaine(W / 2, H / 2 + 12)
    T = [frozenset(), frozenset('a'), frozenset('ab'), frozenset('abc')]
    # légende : {b} n'est pas ouvert, {a, c} non plus (donc {b} non fermé)
    assert frozenset('b') not in T and frozenset('ac') not in T
    S = Schema(W, H, 'Les ouverts emboîtés de la topologie {∅, {a}, {a, b}, X}')
    _dessine_rect(S, R, 'r')
    _dessine_ell(S, Eab, 'r', rempli='r')
    _dessine_ell(S, Ea, 'r', rempli='r')
    _points(S, pos)
    # étiquettes des contours : au-dessus de chacun, dans l'anneau qui le sépare du suivant
    ya = Ea.c[1] - Ea.ry - 11
    assert Eab.val((Ea.c[0], ya - 9)) < 1 and ya + 9 < Ea.c[1] - Ea.ry      # tient entre {a} et {a, b}
    S.texte((Ea.c[0], ya), '{a}', 'r')
    yab = Eab.c[1] - Eab.ry - 11
    assert R.y + 4 < yab - 9
    S.texte((Eab.c[0], yab), '{a, b}', 'r')
    S.texte((R.x + R.w - 18, R.y + 18), 'X', 'r')
    return S


@schema('lex-voisinage-2')
def lex_voisinage_2():
    W, H = 420, 210
    pos, Ea, V, R = _chaine(W / 2, H / 2 + 12)
    # légende : le seul ouvert qui contient b est X (topologie {∅, {a}, X})
    T = [frozenset(), frozenset('a'), frozenset('abc')]
    assert [U for U in T if 'b' in U] == [frozenset('abc')] and not frozenset('abc') <= frozenset('ab')
    S = Schema(W, H, 'La partie V = {a, b} est un voisinage de a, pas de b')
    _dessine_rect(S, R, 't')
    _dessine_ell(S, V, 'b', d=True)
    _dessine_ell(S, Ea, 'r', rempli='r')
    _points(S, pos)
    ya = Ea.c[1] - Ea.ry - 11
    assert V.val((Ea.c[0], ya - 9)) < 1 and ya + 9 < Ea.c[1] - Ea.ry      # {a} tient entre les deux contours
    S.texte((V.c[0] + 10, V.c[1] - V.ry - 11), 'V', 'b')
    S.texte((Ea.c[0], ya), '{a}', 'r')
    S.texte((R.x + R.w - 18, R.y + 18), 'X', 't')
    return S


@schema('lex-adherence-1')
def lex_adherence_1():
    W, H = 420, 210
    pos, Ea, Eab, R = _chaine(W / 2, H / 2 + 12)
    A = Ell(((pos['b'][0] + pos['c'][0]) / 2, pos['b'][1]), 72, 34)
    _verifie_contour(A, pos, {'b', 'c'}, 10)
    assert _dans(A, R)
    # légende : fermés ∅, {c}, {b, c}, X ; adhérence de {b} = {b, c}
    X = frozenset('abc')
    T = [frozenset(), frozenset('a'), frozenset('ab'), X]
    Fs = [X - U for U in T]
    adh = frozenset.intersection(*[F for F in Fs if 'b' in F])
    assert adh == frozenset('bc')
    assert [U for U in T if 'c' in U] == [X] and not (frozenset('a') & frozenset('b'))
    S = Schema(W, H, "L'adhérence de {b} est {b, c}")
    _dessine_ell(S, A, 'b', rempli='b')
    _dessine_rect(S, R, 'g')
    _dessine_ell(S, Eab, 'g')
    _dessine_ell(S, Ea, 'g')
    _points(S, pos, {'b': 'b', 'c': 'b'})
    S.texte((R.x + R.w - 18, R.y + 18), 'X', 'g')
    return S


@schema('lex-base-topologie-2')
def lex_base_topologie_2():
    W, H = 420, 200
    cy = H / 2
    pos = {'a': (110, cy), 'b': (210, cy), 'c': (310, cy)}
    B1 = Ell((160, cy), 92, 60)
    B2 = Ell((260, cy), 92, 60)
    _verifie_contour(B1, pos, {'a', 'b'}, 10)
    _verifie_contour(B2, pos, {'b', 'c'}, 10)
    # légende : aucune réunion d'éléments de B ne se réduit à {b}
    B = [frozenset('ab'), frozenset('bc')]
    reun = {frozenset().union(*c) for k in range(3) for c in itertools.combinations(B, k)}
    assert frozenset('b') not in reun and B[0] & B[1] == frozenset('b')
    assert B1.c[0] - B1.rx > 0 and B2.c[0] + B2.rx < W
    S = Schema(W, H, 'Les parties {a, b} et {b, c} se chevauchent en b')
    _dessine_ell(S, B1, 'b', rempli='b')
    _dessine_ell(S, B2, 'v', rempli='v')
    _points(S, pos, {'b': 'r'})
    S.texte((B1.c[0] - 40, cy - B1.ry - 12), '{a, b}', 'b')
    S.texte((B2.c[0] + 40, cy - B2.ry - 12), '{b, c}', 'v')
    return S


def _intersection_convexes(E1, E2):
    """Polygone de l'intersection de deux ellipses (convexe) : points des deux bords intérieurs à l'autre,
    triés par angle autour de leur barycentre."""
    p1, p2 = E1.bord(720), E2.bord(720)
    pts = np.vstack([p1[E2.val(p1) <= 1], p2[E1.val(p2) <= 1]])
    g = pts.mean(0)
    ang = np.arctan2(pts[:, 1] - g[1], pts[:, 0] - g[0])
    return pts[np.argsort(ang)]


@schema('lex-topologie-induite-1')
def lex_topologie_induite_1():
    W, H = 420, 210
    pos, Ea, Eab, R = _chaine(W / 2, H / 2 + 12)
    A = Ell(((pos['b'][0] + pos['c'][0]) / 2, pos['b'][1]), 72, 34)
    _verifie_contour(A, pos, {'b', 'c'}, 10)
    trace = _intersection_convexes(A, Eab)
    # la région rouge contient b et ni a ni c
    from matplotlib.path import Path
    chemin = Path(trace)
    assert chemin.contains_point(pos['b']) and not chemin.contains_point(pos['a']) and not chemin.contains_point(pos['c'])
    X = frozenset('abc')
    T = [frozenset(), frozenset('a'), frozenset('ab'), X]
    assert {U & frozenset('bc') for U in T} == {frozenset(), frozenset('b'), frozenset('bc')}
    assert frozenset('b') not in T
    S = Schema(W, H, 'La topologie induite sur A = {b, c}')
    _dessine_rect(S, R, 'g')
    _dessine_ell(S, Eab, 'g')
    _dessine_ell(S, Ea, 'g')
    S.surface(trace, 'r')
    _dessine_ell(S, A, 'b')
    _points(S, pos, {'b': 'r'})
    S.texte((A.c[0] + 34, A.c[1] - A.ry - 12), 'A', 'b')
    S.texte((Eab.c[0] - 30, Eab.c[1] - Eab.ry - 11), '{a, b}', 'g')
    S.texte((R.x + R.w - 18, R.y + 18), 'X', 'g')
    return S


@schema('lex-propriete-topologique-1')
def lex_propriete_topologique_1():
    W, H = 420, 190
    k = 0.62
    cy = H / 2 + 12
    pos1, Ea1, Eab1, R1 = _chaine(105, cy, k)
    # T2 : {a} et {b, c}, contours disjoints
    cx2 = 315
    pos2 = {'a': (cx2 - 85 * k, cy), 'b': (cx2 - 5 * k, cy), 'c': (cx2 + 85 * k, cy)}
    Ea2 = Ell(pos2['a'], 30 * k, 30 * k)
    Ebc2 = Ell(((pos2['b'][0] + pos2['c'][0]) / 2, cy), 66 * k, 34 * k)
    R2 = Rect(cx2 - 150 * k, R1.y, 300 * k, R1.h)
    _verifie_contour(Ea2, pos2, {'a'}, 6)
    _verifie_contour(Ebc2, pos2, {'b', 'c'}, 6)
    assert _dans(Ea2, R2) and _dans(Ebc2, R2)
    assert np.all(Ebc2.val(Ea2.bord()) > 1) and np.all(Ea2.val(Ebc2.bord()) > 1)       # disjoints
    assert R1.x + R1.w < R2.x - 10 and R1.x > 4 and R2.x + R2.w < W - 4
    X = frozenset('abc')
    T1 = [frozenset(), frozenset('a'), frozenset('ab'), X]
    T2 = [frozenset(), frozenset('a'), frozenset('bc'), X]
    assert all(U & V for U in T1 for V in T1 if U and V)                     # deux ouverts non vides se rencontrent
    assert [U for U in T1 if X - U in T1] == [frozenset(), X]                # aucun complémentaire ouvert, sauf X (et ∅)
    assert frozenset('a') in T2 and X - frozenset('a') in T2
    S = Schema(W, H, 'Les topologies T1 (emboîtée) et T2 (partition)')
    for R, Ea, E2, pos, c in [(R1, Ea1, Eab1, pos1, 't'), (R2, Ea2, Ebc2, pos2, 'r')]:
        _dessine_rect(S, R, 't')
        _dessine_ell(S, E2, c, rempli=c)
        _dessine_ell(S, Ea, c, rempli=c)
        _points(S, pos, taille=16, lettres=True)
    S.texte((R1.x + R1.w / 2, R1.y - 14), '𝒯_1', 't')
    S.texte((R2.x + R2.w / 2, R2.y - 14), '𝒯_2', 'r')
    return S


@schema('lex-espaces-homeomorphes-1')
def lex_espaces_homeomorphes_1():
    W, H = 420, 220
    xl, xr, ya, yb = 110, 310, 75, 165
    L = {'a': np.array([xl, ya]), 'b': np.array([xl, yb])}
    Rr = {'a': np.array([xr, ya]), 'b': np.array([xr, yb])}
    Cl = Ell(L['a'], 28, 28)
    Cr = Ell(Rr['b'], 28, 28)
    _verifie_contour(Cl, L, {'a'}, 10)
    _verifie_contour(Cr, Rr, {'b'}, 10)
    sigma = {'a': 'b', 'b': 'a'}
    # légende : l'ouvert de gauche est l'ensemble des points envoyés dans l'ouvert de droite
    assert {x for x in 'ab' if sigma[x] == 'b'} == {'a'}
    S = Schema(W, H, "L'échange σ de a et b, homéomorphisme entre les deux topologies")
    for (cx, Ct) in [(xl, Cl), (xr, Cr)]:
        S.rect(cx - 52, 30, 104, 180, 't', rx=14)
        _dessine_ell(S, Ct, 'r', rempli='r')
    for x in 'ab':
        p, q = L[x], Rr[sigma[x]]
        S.fleche(p, q, 't', retrait=34 if sigma[x] == 'b' else 10, retrait_debut=34 if x == 'a' else 10)
    for pos in (L, Rr):
        for x, p in pos.items():
            S.point(p, 't', r=3.6)
            S.texte(p + [-18 if pos is L else 18, 0], x, 't')
    # σ au croisement des deux flèches
    m = (L['a'] + Rr['b'] + L['b'] + Rr['a']) / 4
    S.texte(m + [0, -16], 'σ', 't')
    S.texte((xl, 16), '{a}', 'r')
    S.texte((xr, 16), '{b}', 'r')
    return S


def _grille_produit(W, H):
    xs = {'a': 165, 'b': 285}
    ys = {'a': H - 80, 'b': 78}
    pos = {(x, y): np.array([xs[x], ys[y]]) for x in 'ab' for y in 'ab'}
    return xs, ys, pos


def _axes_produit(S, xs, ys, H):
    for x in 'ab':
        S.texte((xs[x], H - 24), x, 'g')
    for y in 'ab':
        S.texte((80, ys[y]), y, 'g')
    S.ligne((100, H - 42), (350, H - 42), 'g')
    S.ligne((100, H - 42), (100, 40), 'g')


def _etiquettes_points(S, pos, couleur):
    for (x, y), p in pos.items():
        c = couleur.get((x, y), 't')
        S.point(p, c, r=4)
        S.texte(p + [0, -24], f'({x}, {y})', c, taille=16)


@schema('lex-separe-3')
def lex_separe_3():
    W, H = 420, 280
    xs, ys, pos = _grille_produit(W, H)
    S_ = ['a', 'b']
    TS = [frozenset(), frozenset('a'), frozenset('ab')]
    cyl = {frozenset((x, y) for x in U for y in V) for U in TS for V in TS}
    ouv = {frozenset().union(*c) for k in range(len(cyl) + 1) for c in itertools.combinations(list(cyl), k)}
    Delta = {('a', 'a'), ('b', 'b')}
    bande = frozenset({('a', 'a'), ('b', 'a')})                      # S × {a}
    assert bande in cyl and all(bande <= U for U in ouv if ('b', 'a') in U)
    assert ('a', 'a') in bande and ('a', 'a') in Delta
    assert frozenset({('a', 'b'), ('b', 'a')}) not in ouv
    S = Schema(W, H, 'La diagonale de S × S, où S = {a, b} porte la topologie {∅, {a}, S}')
    _axes_produit(S, xs, ys, H)
    S.rect(xs['a'] - 48, ys['a'] - 46, xs['b'] - xs['a'] + 96, 66, 'b', rempli='b', rx=16)
    _etiquettes_points(S, pos, {('a', 'a'): 'r', ('b', 'b'): 'r'})
    S.texte((xs['b'] + 54, ys['b'] - 12), 'Δ', 'r', ancre='start')
    S.texte((xs['b'] + 54, ys['a'] - 13), 'S × {a}', 'b', ancre='start', taille=16)
    assert xs['b'] + 54 + largeur_texte('S × {a}', 16) < W - 2
    return _vide_ams(S)


@schema('lex-cylindre-ouvert-1')
def lex_cylindre_ouvert_1():
    W, H = 420, 280
    xs, ys, pos = _grille_produit(W, H)
    TS = [frozenset(), frozenset('a'), frozenset('ab')]
    cyl = {frozenset((x, y) for x in U for y in V) for U in TS for V in TS}
    col = frozenset({('a', 'a'), ('a', 'b')})            # {a} × S
    lig = frozenset({('a', 'a'), ('b', 'a')})            # S × {a}
    assert col in cyl and lig in cyl and (col | lig) not in cyl and ('b', 'b') not in col | lig
    assert all(('b', 'b') in C for C in cyl if ('a', 'b') in C and ('b', 'a') in C)
    S = Schema(W, H, 'Les cylindres {a} × S et S × {a}, et leur réunion')
    _axes_produit(S, xs, ys, H)
    S.rect(xs['a'] - 42, ys['b'] - 46, 84, ys['a'] - ys['b'] + 74, 'b', rempli='b', rx=16)
    S.rect(xs['a'] - 54, ys['a'] - 46, xs['b'] - xs['a'] + 108, 66, 'v', rempli='v', rx=16)
    assert ys['a'] + 28 < H - 42 and ys['b'] - 46 > 26
    _etiquettes_points(S, pos, {('b', 'b'): 'r'})
    S.texte((xs['a'], ys['b'] - 60), '{a} × S', 'b', taille=16)
    S.texte((xs['b'] + 60, ys['a'] - 13), 'S × {a}', 'v', ancre='start', taille=16)
    assert xs['b'] + 60 + largeur_texte('S × {a}', 16) < W - 2
    return S


@schema('lex-continuite-1')
def lex_continuite_1():
    W, H = 420, 230
    TS = [frozenset(), frozenset('a'), frozenset('ab')]
    apps = [('identité', {'a': 'a', 'b': 'b'}), ('constante', {'a': 'a', 'b': 'a'}),
            ('constante', {'a': 'b', 'b': 'b'}), ('échange', {'a': 'b', 'b': 'a'})]
    for k, (_, f) in enumerate(apps):
        pre = frozenset(x for x in 'ab' if f[x] == 'a')
        assert (pre in TS) == (k < 3)                        # trois continues, l'échange non
    ya, yb = 70, 150
    S = Schema(W, H, 'Les quatre applications de S dans S')
    larg = W / 4
    for k, (nom, f) in enumerate(apps):
        x0 = k * larg
        xl, xr = x0 + 24, x0 + larg - 24
        c = 'r' if k == 3 else 't'
        for xc in (xl, xr):
            S.cercle((xc, ya), 15, 'g')
        for x, y in (('a', ya), ('b', yb)):
            S.point((xl, y), 'r' if (k == 3 and x == 'b') else 't', r=3.4)
            S.point((xr, y), 't', r=3.4)
        for x in 'ab':
            p = np.array([xl, ya if x == 'a' else yb])
            q = np.array([xr, ya if f[x] == 'a' else yb])
            S.fleche(p, q, c, retrait=8, retrait_debut=6)
        S.texte((xl - 2, ya - 28), 'a', 't', taille=16)
        S.texte((xl - 2, yb + 22), 'b', 'r' if k == 3 else 't', taille=16)
        S.texte((xr + 2, ya - 28), 'a', 't', taille=16)
        S.texte((xr + 2, yb + 22), 'b', 't', taille=16)
        assert largeur_texte(nom, 13, roman=True) < larg - 8
        S.texte((x0 + larg / 2, H - 22), nom, c, ui=True)
        if k:
            S.ligne((x0, 30), (x0, H - 44), 'g', d=True)
    return S


@schema('lex-topologie-quotient-2')
def lex_topologie_quotient_2():
    W, H = 420, 290
    k = 0.6
    cy = H / 2
    pos, Ea, Eab, R = _chaine(100, cy, k)
    X = frozenset('abc')
    T = [frozenset(), frozenset('a'), frozenset('ab'), X]

    def quotient(classes):
        TQ = set()
        for r in range(len(classes) + 1):
            for V in itertools.combinations(classes, r):
                pre = frozenset().union(*V) if V else frozenset()
                if pre in T:
                    TQ.add(frozenset(V))
        return TQ
    al, be = frozenset('a'), frozenset('bc')
    ga, de = frozenset('ac'), frozenset('b')
    assert quotient([al, be]) == {frozenset(), frozenset([al]), frozenset([al, be])}
    assert quotient([ga, de]) == {frozenset(), frozenset([ga, de])}
    S = Schema(W, H, 'Deux quotients de X = {a, b, c}')
    _dessine_rect(S, R, 't')
    _dessine_ell(S, Eab, 't')
    _dessine_ell(S, Ea, 't')
    _points(S, pos, taille=16, lettres=True)
    S.texte((R.x + R.w / 2, R.y - 14), 'X', 't')
    # quotients à droite
    xq, ylig = (300, 370), {'haut': 70, 'bas': 222}
    for cle, noms in (('haut', ('α', 'β')), ('bas', ('γ', 'δ'))):
        y = ylig[cle]
        Rq = Rect(xq[0] - 34, y - 36, xq[1] - xq[0] + 68, 72)
        assert Rq.x > R.x + R.w + 40 and Rq.x + Rq.w < W - 2 and Rq.y > 2 and Rq.y + Rq.h < H - 2
        _dessine_rect(S, Rq, 't')
        if cle == 'haut':
            S.cercle((xq[0], y), 17, 'r', rempli='r')
        for xx, nm in zip(xq, noms):
            c = 'r' if nm == 'α' else 't'
            S.point((xx, y), c, r=3.6)
            S.texte((xx, y + 24), nm, c, taille=16)
        dep = np.array([R.x + R.w + 6, cy + (-20 if cle == 'haut' else 20)])
        arr = np.array([Rq.x - 6, y])
        S.fleche(dep, arr, 'g')
        mil = (dep + arr) / 2
        u = (arr - dep) / np.linalg.norm(arr - dep)
        nrm = np.array([u[1], -u[0]]) if cle == 'haut' else np.array([-u[1], u[0]])   # côté extérieur
        S.texte(mil + 24 * nrm, 'b ∼ c' if cle == 'haut' else 'a ∼ c', 'g', taille=15)
    return S
