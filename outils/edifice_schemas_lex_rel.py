"""Schémas des exemples du lexique, théorie rel (relations, fonctions) : contenu/exemples/rel.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 400 à 440, hauteur 300 au plus, étiquettes de 17
(mémo de l'édifice, § 111). Positions calculées, et ce que la légende affirme vérifié par assert.
"""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, largeur_texte, courbe_entre

F = frozenset
V = F()


def S_(*x):
    return F(x)


def _dans_ellipse(p, c, rx, ry, marge=0.0):
    return ((p[0] - c[0]) / (rx - marge)) ** 2 + ((p[1] - c[1]) / (ry - marge)) ** 2 < 1


def _enveloppe(points, r, n=24):
    """Contour convexe des disques de rayon r centrés aux points (bloc d'une partition)."""
    t = np.linspace(0, 2 * np.pi, n, endpoint=False)
    pts = np.array([(x + r * np.cos(a), y + r * np.sin(a)) for x, y in points for a in t])
    pts = sorted(map(tuple, pts))

    def croix(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])
    bas, haut = [], []
    for p in pts:
        while len(bas) >= 2 and croix(bas[-2], bas[-1], p) <= 0:
            bas.pop()
        bas.append(p)
    for p in reversed(pts):
        while len(haut) >= 2 and croix(haut[-2], haut[-1], p) <= 0:
            haut.pop()
        haut.append(p)
    return np.array(bas[:-1] + haut[:-1])


def _vide_ams(S):
    """Dessine ∅ comme \\varnothing (police KaTeX_AMS), ainsi qu'il est écrit dans le texte des exemples, au lieu
    du ∅ ovale de KaTeX_Main que choisit edifice_svg."""
    import re
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


@schema('lex-relation-1')
def lex_relation_1():
    A, B = ['a', 'b'], ['c', 'd', 'e']
    R = {('a', 'c'), ('a', 'd')}
    assert sum(1 for x, y in R if x == 'a') == 2 and sum(1 for x, y in R if x == 'b') == 0   # légende
    W, H = 420, 196
    x0, dx, y0, dy = 170, 80, 92, 64
    pos = {(x, y): (x0 + dx * j, y0 + dy * i) for i, x in enumerate(A) for j, y in enumerate(B)}
    assert max(p[0] for p in pos.values()) + 40 < W and max(p[1] for p in pos.values()) + 30 < H
    S = Schema(W, H, 'Les six couples de A × B, et la relation R en rouge')
    for i, x in enumerate(A):
        S.ligne((x0 - 24, y0 + dy * i), (x0 + dx * 2 + 24, y0 + dy * i), 'g', d=True)
        S.texte((x0 - 44, y0 + dy * i), x, ancre='end')
    for j, y in enumerate(B):
        S.ligne((x0 + dx * j, y0 - 26), (x0 + dx * j, y0 + dy + 26), 'g', d=True)
        S.texte((x0 + dx * j, y0 - 46), y)
    S.texte((x0 - 112, y0 + dy / 2), 'A', 'g', ancre='end')
    S.texte((x0 + dx, 18), 'B', 'g')
    for p, q in pos.items():
        if p in R:
            S.point(q, 'r', r=6)
        else:
            S.point(q, 'g', r=4.2, creux=True)
    S.texte((x0 + dx * 2 + 40, y0), 'R', 'r', ancre='start')
    return S


@schema('lex-relation-transitive-1')
def lex_relation_transitive_1():
    E1 = [V, S_(V), S_(S_(V))]
    E2 = [V, S_(V), S_(V, S_(V))]
    noms1 = ['∅', '{∅}', '{{∅}}']
    noms2 = ['∅', '{∅}', '{∅, {∅}}']
    W, H, taille = 420, 250, 17
    S = Schema(W, H, 'La relation x ∈ y sur deux ensembles à trois éléments')
    for k, (E, noms) in enumerate([(E1, noms1), (E2, noms2)]):
        cx = 105 + 210 * k
        P = [np.array([cx - 62, 186.0]), np.array([cx, 74.0]), np.array([cx + 62, 186.0])]
        fl = [(i, j) for i in range(3) for j in range(3) if E[i] in E[j]]
        trans = all((i, l) in fl for i, j in fl for jj, l in fl if j == jj)
        if k == 0:
            assert fl == [(0, 1), (1, 2)] and not trans          # « la flèche qui fermerait le triangle manque »
        else:
            assert fl == [(0, 1), (0, 2), (1, 2)] and trans      # « les trois flèches sont présentes »
        for i, j in fl:
            S.fleche(P[i], P[j], 't', retrait=9, retrait_debut=9)
        if k == 0:
            S.ligne(P[0] + 9 * (P[2] - P[0]) / np.linalg.norm(P[2] - P[0]),
                    P[2] - 9 * (P[2] - P[0]) / np.linalg.norm(P[2] - P[0]), 'r', d=True)
        for i in range(3):
            S.point(P[i], 't', r=4.2)
        # étiquettes : sous les points du bas, au-dessus du point du haut, sans sortir du cadre
        for i, (p, nm) in enumerate(zip(P, noms)):
            w = largeur_texte(nm, taille)
            q = p + ([0, 28] if i != 1 else [0, -26])
            assert q[0] - w / 2 > 210 * k + 4 and q[0] + w / 2 < 210 * (k + 1) - 4, nm
            S.texte(q, nm, taille=taille)
        S.texte((cx, 20), 'E_' + str(k + 1), 'g')
    S.ligne((210, 40), (210, H - 16), 'g', l=0.6)
    return _vide_ams(S)


@schema('lex-image-directe-1')
def lex_image_directe_1():
    f = {'a': 'd', 'b': 'd', 'c': 'e'}
    xa, xb = 130, 310
    ya = {'a': 70, 'c': 150, 'b': 230}
    yb = {'d': 110, 'e': 190}
    X, X2 = {'a', 'c'}, {'b', 'c'}
    cX, cX2, rx, ry = (xa, 110), (xa, 190), 44, 74
    for x in 'abc':
        p = (xa, ya[x])
        assert _dans_ellipse(p, cX, rx, ry, 10) == (x in X)
        assert _dans_ellipse(p, cX2, rx, ry, 10) == (x in X2)
    assert X & X2 == {'c'} and f['a'] == f['b'] == 'd'
    assert {f[x] for x in X} & {f[x] for x in X2} == {'d', 'e'} and {f[x] for x in X & X2} == {'e'}
    W, H = 420, 290
    S = Schema(W, H, "Les parties X et X′ de A et leurs images par f")
    S.ellipse(cX, rx, ry, 'b', rempli='b')
    S.ellipse(cX2, rx, ry, 'v', rempli='v')
    S.texte((xa - rx - 12, cX[1] - 34), 'X', 'b', ancre='end')
    S.texte((xa - rx - 12, cX2[1] + 34), 'X′', 'v', ancre='end')
    S.texte((xa, 18), 'A', 'g')
    S.texte((xb, 18), 'B', 'g')
    for x in 'abc':
        S.fleche((xa, ya[x]), (xb, yb[f[x]]), 'r' if x in 'ab' else 't', retrait=8, retrait_debut=7)
    for x in 'abc':
        S.point((xa, ya[x]), 't', r=4)
        S.texte((xa - 14, ya[x]), x, ancre='end')
    for y in 'de':
        S.point((xb, yb[y]), 'r' if y == 'd' else 't', r=4.6)
        S.texte((xb + 14, yb[y]), y, 'r' if y == 'd' else 't', ancre='start')
    return S


@schema('lex-fibre-application-1')
def lex_fibre_application_1():
    f = {'a': 'd', 'b': 'd', 'c': 'e'}
    xb = {'d': 120, 'e': 240, 'k': 350}
    yB, W, H = 236, 420, 280
    pa = {'a': (96, 70), 'b': (144, 120), 'c': (240, 95)}
    fibres = {y: [x for x in f if f[x] == y] for y in xb}
    assert fibres == {'d': ['a', 'b'], 'e': ['c'], 'k': []}                 # légende : fibre au-dessus de k vide
    boites = {'d': (66, 40, 108, 112), 'e': (210, 52, 60, 86), 'k': (322, 52, 56, 86)}
    for y, (x0, y0, w, h) in boites.items():
        assert all(x0 + 10 < pa[x][0] < x0 + w - 10 and y0 + 10 < pa[x][1] < y0 + h - 10 for x in fibres[y])
        assert abs(x0 + w / 2 - xb[y]) < 1e-9                                 # boîte centrée au-dessus de son point
    S = Schema(W, H, "Les fibres d'une application au-dessus de chaque point de B")
    for y, (x0, y0, w, h) in boites.items():
        if fibres[y]:
            S.rect(x0, y0, w, h, 'b', rempli='b', rx=14)
        else:
            S.rect(x0, y0, w, h, 'g', d=True, rx=14)
            S.texte((x0 + w / 2, y0 + h / 2), '∅', 'g')
    S.ligne((40, yB), (390, yB), 'g')
    S.texte((24, yB), 'B', 'g')
    S.texte((24, 96), 'A', 'g')
    for x, p in pa.items():
        S.fleche(p, (xb[f[x]], yB), 'g', retrait=7, retrait_debut=7, l=1.1)
    for x, p in pa.items():
        S.point(p, 't', r=4)
        S.texte((p[0] - 12, p[1]), x, ancre='end')
    for y, xx in xb.items():
        S.point((xx, yB), 'r' if y == 'k' else 't', r=4.6)
        S.texte((xx, yB + 26), y, 'r' if y == 'k' else 't')
    return _vide_ams(S)


@schema('lex-composee-1')
def lex_composee_1():
    ca = {'a': 'a', 'b': 'a'}
    s = {'a': 'b', 'b': 'a'}
    lignes = [('s ∘ c_a', [ca, s]), ('c_a ∘ s', [s, ca])]
    noms = [['c_a', 's'], ['s', 'c_a']]
    finals = []
    for nom, (f1, f2) in lignes:
        finals.append({x: f2[f1[x]] for x in 'ab'})
    assert set(finals[0].values()) == {'b'} and set(finals[1].values()) == {'a'}   # légende
    W, H = 420, 270
    xs = [150, 255, 360]
    S = Schema(W, H, 'Les composées s ∘ c_a et c_a ∘ s sur {a, b}')
    for k, ((nom, fs), nf) in enumerate(zip(lignes, noms)):
        ya = {'a': 60 + 130 * k, 'b': 110 + 130 * k}
        S.texte((14, (ya['a'] + ya['b']) / 2), nom, 'r', ancre='start')
        assert largeur_texte(nom.replace('_', ''), 17) + 14 < xs[0] - 40
        for c in range(2):
            for x in 'ab':
                S.fleche((xs[c], ya[x]), (xs[c + 1], ya[fs[c][x]]), 'g', retrait=7, retrait_debut=7, l=1.1)
            S.texte(((xs[c] + xs[c + 1]) / 2, ya['a'] - 26), nf[c], 'g')
        for c in range(3):
            for x in 'ab':
                fin = c == 2 and x in finals[k].values()
                S.point((xs[c], ya[x]), 'r' if fin else 't', r=4.6 if fin else 4)
        for x in 'ab':
            S.texte((xs[0] - 14, ya[x]), x, ancre='end')
            S.texte((xs[2] + 14, ya[x]), x, 'r' if x in finals[k].values() else 't', ancre='start')
    S.ligne((14, 135), (W - 14, 135), 'g', l=0.6)
    return S


@schema('lex-partition-1')
def lex_partition_1():
    import itertools

    def partitions(E):
        if not E:
            yield []
            return
        x, reste = E[0], E[1:]
        for p in partitions(reste):
            yield [[x]] + p
            for k in range(len(p)):
                yield p[:k] + [[x] + p[k]] + p[k + 1:]
    Ps = list(partitions(['a', 'b', 'c']))
    assert len(Ps) == 5                                                    # « les cinq partitions »
    ordre = sorted(Ps, key=lambda p: (-len(p), sorted(map(sorted, p))))
    W, H, r = 420, 290, 17
    rel = {'a': np.array([0.0, -30]), 'b': np.array([-32.0, 30]), 'c': np.array([32.0, 30])}
    centres = [(70, 80), (210, 80), (350, 80), (140, 214), (280, 214)]
    S = Schema(W, H, 'Les cinq partitions de {a, b, c}')
    def couleur(bloc):                       # règle dite dans la légende
        return 'r' if 'a' in bloc else ('b' if 'b' in bloc else 'v')
    assert all(len({couleur(q) for q in p}) == len(p) for p in Ps)       # deux parties, deux couleurs
    g = np.array([0.0, 10])                  # centre de gravité du triangle a, b, c (relatif)
    for p, c in zip(ordre, centres):
        c = np.array(c, float)
        envs = []
        for bloc in p:
            env = _enveloppe([c + rel[x] for x in bloc], r)
            assert env[:, 0].min() > c[0] - 70 and env[:, 0].max() < c[0] + 70
            assert env[:, 1].min() > c[1] - 66 and env[:, 1].max() < c[1] + 66
            envs.append(env)
            S.poly(env, couleur(bloc), ferme=True, rempli=couleur(bloc), l=1.2)
        for x in 'abc':
            S.point(c + rel[x], 't', r=3.6)
        for x in 'abc':
            u = (rel[x] - g) / np.linalg.norm(rel[x] - g)
            q = c + rel[x] + (r + 13) * u
            w, h = largeur_texte(x, 17), 12
            # la lettre reste à 4 px au moins de tout contour, et dans le cadre
            for env in envs:
                dx = np.maximum(np.abs(env[:, 0] - q[0]) - w / 2, 0)
                dy = np.maximum(np.abs(env[:, 1] - q[1]) - h / 2, 0)
                assert np.hypot(dx, dy).min() >= 4, (p, x)
            assert w / 2 + 2 < q[0] < W - w / 2 - 2 and h / 2 < q[1] < H - h / 2
            S.texte(q, x, taille=17)
    # les blocs de partitions distinctes ne se chevauchent pas
    for c1, c2 in itertools.combinations(centres, 2):
        assert abs(c1[0] - c2[0]) >= 140 or abs(c1[1] - c2[1]) >= 134
    return S


@schema('lex-section-application-1')
def lex_section_application_1():
    g = {'a': 'd', 'b': 'd', 'c': 'e'}
    sections = [{'d': 'a', 'e': 'c'}, {'d': 'b', 'e': 'c'}]
    assert all(g[s[y]] == y for s in sections for y in 'de')              # ce sont des sections
    assert {s['d'] for s in sections} == {'a', 'b'} and {s['e'] for s in sections} == {'c'}
    W, H, yB = 420, 280, 236
    pa = {'a': np.array([100.0, 70]), 'b': np.array([180.0, 70]), 'c': np.array([310.0, 70])}
    pb = {'d': np.array([140.0, yB]), 'e': np.array([310.0, yB])}
    S = Schema(W, H, "Une surjection g et ses deux sections")
    S.ligne((40, yB), (390, yB), 'g')
    S.texte((24, yB), 'B', 'g')
    S.texte((24, 70), 'A', 'g')
    for x, p in pa.items():
        S.fleche(p, pb[g[x]], 'g', retrait=7, retrait_debut=7, l=1.1)
    # sections : arcs qui remontent, bombés vers l'extérieur
    S.courbe_fleche(courbe_entre(pb['d'] + [-8, -6], pa['a'] + [-8, 8], -0.32), 'r')
    S.courbe_fleche(courbe_entre(pb['d'] + [8, -6], pa['b'] + [8, 8], 0.32), 'b')
    S.courbe_fleche(courbe_entre(pb['e'] + [8, -6], pa['c'] + [8, 8], 0.22), 't')
    for x, p in pa.items():
        S.point(p, 't', r=4)
        S.texte(p + [0, -22], x)
    for y, p in pb.items():
        S.point(p, 't', r=4.6)
        S.texte(p + [0, 26], y)
    return S
