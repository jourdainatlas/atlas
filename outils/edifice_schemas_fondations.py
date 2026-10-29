"""Schémas des graphes de fondations (logique, relations, ordres, algèbre, ordinaux, ℤ, ℚ, ℝ)."""
import itertools
from fractions import Fraction as Fr

import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, arc, bezier, blob, courbe_entre


# ---------------------------------------------------------------- outils locaux
def largeur_etiquette(s, taille=17):
    """Largeur approximative d'une étiquette (pour écarter les traits des étiquettes, jamais pour
    placer un objet mathématique)."""
    n = 0.0
    i = 0
    while i < len(s):
        c = s[i]
        if c in '_^':
            if i + 1 < len(s) and s[i + 1] == '{':
                j = s.index('}', i + 2)
                n += 0.72 * (j - i - 2)
                i = j + 1
            else:
                n += 0.72
                i += 2
            continue
        if c in '`\\':
            i += 1
            continue
        n += 0.55 if c in ' ,()[]{}.:′″' else 1.0
        i += 1
    return n * 0.56 * taille


def sortie_boite(p, q, hw, hh):
    """Distance, le long de p → q, à laquelle on sort du rectangle de demi-côtés hw, hh centré en p."""
    d = np.asarray(q, float) - np.asarray(p, float)
    L = np.linalg.norm(d)
    tx = hw / abs(d[0]) if abs(d[0]) > 1e-9 else np.inf
    ty = hh / abs(d[1]) if abs(d[1]) > 1e-9 else np.inf
    return min(tx, ty) * L


def fleche_boites(S, p, q, bp, bq, c='t', d=False, marge=4, l=None):
    """Flèche du centre d'une étiquette (demi-boîte bp) au centre d'une autre (bq)."""
    S.fleche(p, q, c, d=d, retrait_debut=sortie_boite(p, q, *bp) + marge,
             retrait=sortie_boite(q, p, *bq) + marge, l=l)


def ligne_boites(S, p, q, bp, bq, c='t', d=False, marge=4, l=None):
    p, q = np.asarray(p, float), np.asarray(q, float)
    u = (q - p) / np.linalg.norm(q - p)
    S.ligne(p + (sortie_boite(p, q, *bp) + marge) * u, q - (sortie_boite(q, p, *bq) + marge) * u, c, d, l)


def epais(S, p, q, c='t', l=5, d=False):
    """Trait épais : l'épaisseur passe par un style en ligne, car la feuille de style du gabarit
    fixe stroke-width par classe, ce qui l'emporte sur l'attribut stroke-width."""
    cls = f's-{c}' + (' d' if d else '')
    S.el.append(f'<line class="{cls}" style="stroke-width:{l}px" x1="{p[0]:.1f}" y1="{p[1]:.1f}" '
                f'x2="{q[0]:.1f}" y2="{q[1]:.1f}"/>')


def accolade(S, x0, x1, y, h=8, c='g'):
    """Accolade horizontale ouverte vers le haut, sous un segment [x0, x1], pointe vers le bas."""
    m = (x0 + x1) / 2
    d = (f'M{x0:.1f},{y:.1f} Q{x0:.1f},{y + h / 2:.1f} {x0 + h:.1f},{y + h / 2:.1f} '
         f'L{m - h:.1f},{y + h / 2:.1f} Q{m:.1f},{y + h / 2:.1f} {m:.1f},{y + h:.1f} '
         f'Q{m:.1f},{y + h / 2:.1f} {m + h:.1f},{y + h / 2:.1f} L{x1 - h:.1f},{y + h / 2:.1f} '
         f'Q{x1:.1f},{y + h / 2:.1f} {x1:.1f},{y:.1f}')
    S.chemin(d, c)


def capsule(S, p, q, r, c='t', rempli=None, d=False):
    """Contour arrondi (stade) autour du segment [p, q], de rayon r."""
    p, q = np.asarray(p, float), np.asarray(q, float)
    u = (q - p) / np.linalg.norm(q - p)
    t0 = np.arctan2(u[1], u[0])
    pts = np.vstack([arc(q, r, t0 - np.pi / 2, t0 + np.pi / 2, 30), arc(p, r, t0 + np.pi / 2, t0 + 3 * np.pi / 2, 30)])
    S.poly(pts, c, d=d, ferme=True, rempli=rempli)


# ================================================================ log
@schema('l-lecture')
def l_lecture():
    # Terme + × x y S 0 (notation préfixée de x·y + S0), arités de la signature de l'arithmétique.
    mot = ['+', '×', 'x', 'y', 'S', '0']
    arite = {'+': 2, '×': 2, 'S': 1, 'x': 0, 'y': 0, '0': 0}
    poids = [1 - arite[s] for s in mot]                    # 1 - n, et 1 pour variables et constantes
    pref = list(np.cumsum(poids))
    assert poids == [-1, -1, 1, 1, 0, 1]
    assert pref == [-1, -2, -1, 0, 0, 1]
    assert all(p <= 0 for p in pref[:-1]) and pref[-1] == 1     # lemme : préfixes propres ≤ 0, total 1
    # arbre de lecture : chaque nœud est placé au-dessus de son symbole
    enfants = {0: [1, 4], 1: [2, 3], 4: [5]}
    prof = {0: 0, 1: 1, 4: 1, 2: 2, 3: 2, 5: 2}
    # sous-termes : mot[1:4] = × x y et mot[4:6] = S 0 sont de poids 1
    assert sum(poids[1:4]) == 1 and sum(poids[4:6]) == 1

    S = Schema(520, 372, "Arbre du terme + × x y S 0, poids des symboles et poids des préfixes")
    X = [160 + 62 * i for i in range(6)]
    Yn = [30, 78, 126]
    ym = 176                                         # ligne du mot
    for i, ks in enfants.items():
        for k in ks:
            ligne_boites(S, (X[i], Yn[prof[i]]), (X[k], Yn[prof[k]]), (9, 11), (9, 11), 't', marge=2)
    for i in range(6):
        S.texte((X[i], Yn[prof[i]]), mot[i])
        epais(S, (X[i], Yn[prof[i]] + 14), (X[i], ym - 15), 'g', 0.8, d=True)
        S.texte((X[i], ym), mot[i])
    S.texte((X[0] - 72, ym), 'mot', 'g', ancre='end', ui=True)
    # accolades sous les deux sous-termes
    accolade(S, X[1] - 12, X[3] + 12, ym + 14)
    accolade(S, X[4] - 12, X[5] + 12, ym + 14)
    S.texte(((X[1] + X[3]) / 2, ym + 36), 't_1', 'g', taille=15)
    S.texte(((X[4] + X[5]) / 2, ym + 36), 't_2', 'g', taille=15)
    # poids des symboles
    yp = 236
    S.texte((X[0] - 72, yp), 'poids', 'g', ancre='end', ui=True)
    for i in range(6):
        S.texte((X[i], yp), str(poids[i]).replace('-', '−'), taille=15)
    # courbe en escalier des poids des préfixes
    pas = 22
    y1 = 270
    Y = lambda p: y1 + (1 - p) * pas
    S.ligne((X[0] - 34, Y(0)), (X[5] + 36, Y(0)), 'g', d=True)
    for p in (1, 0, -1, -2):
        S.texte((X[0] - 40, Y(p)), str(p).replace('-', '−'), 'g', ancre='end', taille=14)
    S.texte((X[0] - 72, Y(-0.5)), 'préfixes', 'g', ancre='end', ui=True)
    gauche = [X[i] - 31 for i in range(6)]
    droite = [X[i] + 31 for i in range(6)]
    prec = 0
    for i in range(6):
        c = 'r' if i == 5 else 't'
        S.ligne((gauche[i], Y(prec)), (gauche[i], Y(pref[i])), 'g')
        epais(S, (gauche[i], Y(pref[i])), (droite[i], Y(pref[i])), c, 2.4)
        S.point(((gauche[i] + droite[i]) / 2, Y(pref[i])), c, r=3.4)
        prec = pref[i]
    return S


@schema('l-substitution')
def l_substitution():
    # φ = ∃y (y ≠ x) ; φ[y/x] = ∃y (y ≠ y). Positions des symboles : avances approximatives de la
    # police à 20 px (le dessin relie des symboles, il ne mesure rien).
    av = {'∃': 12, 'y': 11, '(': 8, ')': 8, '≠': 16, 'x': 11, ' ': 3}

    def place(x0, mots):
        pos, x = [], x0
        for m in mots:
            w = av[m]
            pos.append(x + w / 2)
            x += w + (3 if m in '∃(' else 0)
        return pos, x

    phi = ['∃', 'y', ' ', '(', 'y', ' ', '≠', ' ', 'x', ')']
    psi = [m if m != 'x' else 'y' for m in phi]
    # contrôle : la substitution remplace l'unique occurrence libre de x, qui est sous ∃y
    assert psi == ['∃', 'y', ' ', '(', 'y', ' ', '≠', ' ', 'y', ')']
    S = Schema(500, 132, 'Capture de la variable y lors de la substitution de y à x dans ∃y (y ≠ x)')
    yb = 64

    def formule(x0, mots, captures):
        pos, fin = place(x0, mots)
        for m, x in zip(mots, pos):
            if m != ' ':
                S.texte((x, yb), m, 'r' if (x == pos[8] and captures) else 't', taille=21)
        q = pos[1]
        cibles = [(pos[4], 't')] + ([(pos[8], 'r')] if captures else [])
        for xc, c in cibles:
            S.poly(courbe_entre((q, yb - 16), (xc, yb - 16), courbure=-0.45), c if c == 'r' else 'g',
                   l=1.6 if c == 'r' else None)
        return pos, fin

    p1, f1 = formule(84, phi, False)
    S.texte((p1[8], yb + 26), 'libre', 'g', ui=True)
    S.fleche((f1 + 30, yb), (f1 + 104, yb), 'g')
    S.texte((f1 + 67, yb - 18), '[y/x]', 'g', taille=16)
    p2, f2 = formule(f1 + 132, psi, True)
    S.texte((p2[8], yb + 26), 'capturée', 'r', ui=True)
    S.texte(((84 + f1) / 2, 118), 'φ', 'g', taille=16)
    S.texte(((f1 + 132 + f2) / 2, 118), 'φ[y/x]', 'g', taille=16)
    return S


@schema('l-tautologies')
def l_tautologies():
    # Formule → φ → ψ φ, c'est-à-dire φ → (ψ → φ). On cherche une valuation qui donne 0 à la racine :
    # la table de → n'a qu'une ligne de valeur 0, (1, 0), ce qui impose les valeurs en descendant.
    imp = lambda a, b: 0 if (a, b) == (1, 0) else 1
    assert [(a, b) for a in (0, 1) for b in (0, 1) if imp(a, b) == 0] == [(1, 0)]
    assert all(imp(f, imp(p, f)) == 1 for f in (0, 1) for p in (0, 1))       # tautologie
    # nœuds : (étiquette, parent) ; valeurs imposées par la recherche d'un 0 à la racine
    noeuds = {'r': ('→', None), 'a': ('φ', 'r'), 'b': ('→', 'r'), 'c': ('ψ', 'b'), 'd': ('φ', 'b')}
    impose = {'r': 0}
    for x in ('r', 'b'):                                   # nœuds → de valeur 0, dans l'ordre de lecture
        g, d = [k for k, (_, par) in noeuds.items() if par == x]
        impose[g], impose[d] = 1, 0                        # seule ligne de valeur 0
    assert impose == {'r': 0, 'a': 1, 'b': 0, 'c': 1, 'd': 0}
    assert impose['a'] != impose['d']                      # les deux occurrences de φ : conflit

    S = Schema(500, 250, "Recherche d'une valuation qui annule φ → (ψ → φ) : les deux occurrences de φ se contredisent")
    P = {'r': (210, 40), 'a': (120, 120), 'b': (300, 120), 'c': (240, 200), 'd': (360, 200)}
    # recentrage : de la gauche de l'étiquette φ de gauche au bord du cercle de valeur de droite
    gauche = min(x for x, _ in P.values()) - 7
    droite = max(x for x, _ in P.values()) + 28.5 + 11
    dx = 250 - (gauche + droite) / 2
    P = {k: np.array(v, float) + [dx, 0] for k, v in P.items()}
    assert abs((gauche + dx) + (droite + dx) - 500) < 1e-9
    for k, (_, par) in noeuds.items():
        if par:
            ligne_boites(S, P[par], P[k], (10, 12), (10, 12), 'g', marge=2)
    for k, (lab, _) in noeuds.items():
        c = 'r' if k in ('a', 'd') else 't'
        S.texte(P[k], lab, c, taille=17)
        S.texte(P[k] + [24, -2], str(impose[k]), c, ancre='start', taille=15)
        S.cercle(P[k] + [28.5, -2], 11, c if c == 'r' else 'g')
    S.texte((250, 240), '`mot` : → φ → ψ φ', 'g', taille=15)
    return S


# ================================================================ rel
def sagittal(S, cx, cy, A, B, f, rouge_fl=(), rouge_pt=(), titre=''):
    """Diagramme sagittal : A et B listes de noms, f dictionnaire A → B."""
    xa, xb = cx - 62, cx + 62
    dy = 34
    ya = {a: cy + (i - (len(A) - 1) / 2) * dy for i, a in enumerate(A)}
    yb = {b: cy + (i - (len(B) - 1) / 2) * dy for i, b in enumerate(B)}
    S.ellipse((xa, cy), 30, 64, 'g')
    S.ellipse((xb, cy), 30, 64, 'g')
    S.texte((xa, cy - 80), 'A', 'g', taille=15)
    S.texte((xb, cy - 80), 'B', 'g', taille=15)
    for a in A:
        S.point((xa + 6, ya[a]))
        S.texte((xa - 4, ya[a]), a, ancre='end', taille=15)
    for b in B:
        S.point((xb - 6, yb[b]))
        S.texte((xb + 4, yb[b]), b, ancre='start', taille=15)
        if b in rouge_pt:
            S.cercle((xb - 6, yb[b]), 8, 'r')
    for a, b in f.items():
        S.fleche((xa + 6, ya[a]), (xb - 6, yb[b]), 'r' if a in rouge_fl else 't', retrait=5, retrait_debut=5)
    S.texte((cx, cy + 86), titre, 'g', ui=True)


@schema('r-injections')
def r_injections():
    cas = [
        (['a', 'a^′'], ['b', 'b^′', 'b^{′′}'], {'a': 'b', 'a^′': 'b^′'}, 'injective, non surjective'),
        (['a', 'a^′', 'a^{′′}'], ['b', 'b^′'], {'a': 'b', 'a^′': 'b^′', 'a^{′′}': 'b^′'}, 'surjective, non injective'),
        (['a', 'a^′', 'a^{′′}'], ['b', 'b^′', 'b^{′′}'], {'a': 'b', 'a^′': 'b^{′′}', 'a^{′′}': 'b^′'}, 'bijective'),
        (['a', 'a^′', 'a^{′′}'], ['b', 'b^′', 'b^{′′}'], {'a': 'b', 'a^′': 'b', 'a^{′′}': 'b^′'}, 'ni injective ni surjective'),
    ]
    attendu = [(True, False), (False, True), (True, True), (False, False)]
    S = Schema(520, 400, "Quatre diagrammes sagittaux : injection, surjection, bijection, ni l'une ni l'autre")
    for k, ((A, B, f, t), (inj, sur)) in enumerate(zip(cas, attendu)):
        assert (len(set(f.values())) == len(A)) == inj and (set(f.values()) == set(B)) == sur
        sans = [b for b in B if b not in f.values()]                     # sans antécédent
        doubles = [a for a in A if list(f.values()).count(f[a]) > 1]     # flèches convergentes
        cx, cy = 130 + 260 * (k % 2), 100 + 196 * (k // 2)
        sagittal(S, cx, cy, A, B, f, rouge_fl=doubles, rouge_pt=sans, titre=t)
    return S


@schema('r-equivalence')
def r_equivalence():
    cx, cy, rx, ry = 140, 196, 112, 160
    # deux lignes de partage ondulées, y = h_k(x)
    h = [lambda x: 140 + 10 * np.sin((x - 30) / 38), lambda x: 236 - 9 * np.sin((x - 10) / 33)]
    xs = np.linspace(cx - rx, cx + rx, 401)
    e_haut = cy - ry * np.sqrt(np.clip(1 - ((xs - cx) / rx) ** 2, 0, 1))
    e_bas = cy + ry * np.sqrt(np.clip(1 - ((xs - cx) / rx) ** 2, 0, 1))
    bornes = [(-np.inf * np.ones_like(xs), h[0](xs)), (h[0](xs), h[1](xs)), (h[1](xs), np.inf * np.ones_like(xs))]
    couleurs = ['b', 'r', 'v']
    pts = [[(110, 92), (172, 76), (150, 118)],
           [(100, 206), (186, 174)],
           [(92, 262), (146, 282), (200, 300), (124, 322)]]
    assert [len(p) for p in pts] == [3, 2, 4]

    def cellule(x, y):
        ex = (x - cx) ** 2 / rx ** 2 + (y - cy) ** 2 / ry ** 2 < 0.85
        k = 0 if y < h[0](x) - 10 else (1 if h[0](x) + 10 < y < h[1](x) - 10 else (2 if y > h[1](x) + 10 else -1))
        return k if ex else -1
    for k, P in enumerate(pts):
        assert all(cellule(*p) == k for p in P)           # chaque point est bien à l'intérieur de sa cellule
    S = Schema(520, 372, "Partition de E en trois classes et application canonique sur E/∼")
    for k, (lo, hi) in enumerate(bornes):
        top, bot = np.maximum(e_haut, lo), np.minimum(e_bas, hi)
        ok = top < bot
        poly = np.vstack([np.stack([xs[ok], top[ok]], 1), np.stack([xs[ok], bot[ok]], 1)[::-1]])
        S.surface(poly, couleurs[k])
    for k in range(2):
        hk = h[k](xs)
        ok = (hk > e_haut) & (hk < e_bas)
        S.poly(np.stack([xs[ok], hk[ok]], 1), 'g')
    S.ellipse((cx, cy), rx, ry, 't')
    S.texte((cx - rx + 4, cy - ry + 14), 'E', ancre='end')
    xq = 420
    yq = [100, 190, 284]
    S.texte((xq, 40), 'E/∼')
    for k, P in enumerate(pts):
        for p in P:
            S.point(p, 't')
            S.fleche(p, (xq, yq[k]), 'g', retrait=7, retrait_debut=6, l=0.9)
        S.point((xq, yq[k]), couleurs[k], r=4.6)
    S.texte((pts[1][0][0] - 10, pts[1][0][1] - 2), 'x', 'r', ancre='end')
    S.texte((pts[1][1][0] - 4, pts[1][1][1] - 18), 'y', 'r', ancre='start')
    S.texte((xq + 12, yq[1]), 'π(x) = π(y)', 'r', ancre='start', taille=15)
    S.texte((300, 80), 'π', 'g')
    return S


@schema('r-cantor')
def r_cantor():
    A = ['a', 'b', 'c', 'd']
    f = {'a': {'a', 'c'}, 'b': {'a', 'c', 'd'}, 'c': {'b', 'c'}, 'd': set()}
    D = {x for x in A if x not in f[x]}
    assert D == {'b', 'd'}
    assert all(D != f[x] for x in A)                       # D n'est l'image d'aucun élément
    assert all((x in D) != (x in f[x]) for x in A)         # il diffère de f(x) au moins en x
    S = Schema(500, 362, "Tableau d'appartenance de x à f(y), diagonale et partie D")
    w, hgt = 58, 44
    x0, y0 = 170, 62
    cx = {x: x0 + w * i + w / 2 for i, x in enumerate(A)}
    for x in A:
        S.texte((cx[x], y0 - 22), x)
    rang = {y: y0 + hgt * i + hgt / 2 for i, y in enumerate(A)}
    yD = y0 + hgt * 4 + 24 + hgt / 2
    for y in A:
        S.texte((x0 - 14, rang[y]), f'f({y})', ancre='end')
    S.texte((x0 - 14, yD), 'D', 'r', ancre='end')
    S.rect(x0, y0, 4 * w, 4 * hgt, 'g')
    for i in range(1, 4):
        epais(S, (x0 + i * w, y0), (x0 + i * w, y0 + 4 * hgt), 'g', 0.6)
        epais(S, (x0, y0 + i * hgt), (x0 + 4 * w, y0 + i * hgt), 'g', 0.6)
    for y in A:
        for x in A:
            c = 't'
            if x in f[y]:
                S.point((cx[x], rang[y]), c, r=6)
            else:
                S.point((cx[x], rang[y]), 'g', r=6, creux=True)
        S.rect(cx[y] - w / 2 + 3, rang[y] - hgt / 2 + 3, w - 6, hgt - 6, 'r', rx=6)
    S.rect(x0, yD - hgt / 2, 4 * w, hgt, 'r', rempli='r')
    for x in A:
        if x in D:
            S.point((cx[x], yD), 'r', r=6)
        else:
            S.point((cx[x], yD), 'r', r=6, creux=True)
    S.texte((x0 + 4 * w + 14, y0 + 2 * hgt), 'diagonale', 'r', ancre='start', ui=True)
    S.texte((x0 + 4 * w + 14, y0 + 2 * hgt + 17), 'encadrée', 'r', ancre='start', ui=True)
    S.texte((x0 + 4 * w + 14, yD - 8), 'diagonale', 'r', ancre='start', ui=True)
    S.texte((x0 + 4 * w + 14, yD + 9), 'inversée', 'r', ancre='start', ui=True)
    S.texte((250, 346), 'échantillon : A est un ensemble quelconque', 'g', ui=True)
    return S


@schema('r-bernstein')
def r_bernstein():
    # X_0 et f(X_0) en haut, A ∖ X_0 et B ∖ f(X_0) en bas ; g envoie B ∖ f(X_0) sur A ∖ X_0
    # (égalité A ∖ X_0 = g(B ∖ f(X_0)) de la preuve) : autant de points de chaque côté en bas.
    haut_A = [(170, 70), (180, 112), (166, 150)]
    haut_B = [(342, 82), (352, 126), (340, 160)]
    bas_A = [(176, 232), (166, 272), (180, 308)]
    bas_B = [(340, 224), (352, 264), (342, 304)]
    assert len(haut_A) == len(haut_B) and len(bas_A) == len(bas_B)
    f = list(zip(haut_A, haut_B))
    g = list(zip(bas_B, [bas_A[1], bas_A[2], bas_A[0]]))
    assert sorted(q for _, q in g) == sorted(bas_A)          # g : B ∖ f(X_0) → A ∖ X_0 est surjective
    S = Schema(520, 360, "Bijection h de Cantor-Bernstein : f sur X_0, réciproque de g ailleurs")
    yc = 192
    S.rect(130, 40, 90, 300, 't', rx=16)
    S.rect(300, 40, 90, 300, 't', rx=16)
    S.ligne((130, yc), (220, yc), 'g', d=True)
    S.ligne((300, yc), (390, yc), 'g', d=True)
    S.texte((175, 24), 'A')
    S.texte((345, 24), 'B')
    S.texte((122, 116), 'X_0', ancre='end')
    S.texte((122, 270), 'A ∖ X_0', ancre='end')
    S.texte((398, 116), 'f(X_0)', ancre='start')
    S.texte((398, 270), 'B ∖ f(X_0)', ancre='start')
    for p in haut_A + haut_B + bas_A + bas_B:
        S.point(p)
    for p, q in f:
        S.fleche(p, q, 'b', retrait=6, retrait_debut=6)
    for p, q in g:
        S.fleche(p, q, 'v', retrait=6, retrait_debut=6)
    S.texte((260, 52), 'h = f', 'b', taille=16)
    S.texte((260, 330), 'h = g^{−1}', 'v', taille=16)
    return S


@schema('r-choix')
def r_choix():
    # fibres f^{-1}({b}) de cardinaux variés ; un point choisi par fibre (indice dans « choix »)
    yc = 128
    fibres = [(140, [(130, 98), (150, 128), (132, 158)]),
              (262, [(270, 112), (252, 146)]),
              (384, [(376, 88), (394, 114), (374, 140), (392, 166)])]
    noms = ['b', 'b^′', 'b^{′′}']
    choix = [1, 0, 3]
    yB = 290
    S = Schema(520, 330, "Fibres d'une surjection f et section s choisie dans chaque fibre")
    S.rect(70, 52, 380, 150, 'g', rx=20)
    S.texte((60, 64), 'A', ancre='end')
    S.ligne((70, yB), (450, yB), 'g')
    S.texte((60, yB), 'B', ancre='end')
    for (x, P), nom, k in zip(fibres, noms, choix):
        assert 0 <= k < len(P)
        ry = max(abs(p[1] - yc) for p in P) + 18
        assert all((p[0] - x) ** 2 / 26 ** 2 + (p[1] - yc) ** 2 / ry ** 2 < 0.8 for p in P)   # points dans la fibre
        S.ellipse((x, yc), 32, ry, 't')
        for i, p in enumerate(P):
            S.point(p, 'o' if i == k else 't', r=5 if i == k else 3.2)
        S.fleche((x - 12, yc + ry + 3), (x - 3, yB - 5), 'g')
        S.point((x, yB))
        S.texte((x, yB + 20), nom)
        q = np.array(P[k], float)
        S.courbe_fleche(bezier((x + 4, yB - 5), (x + 46, yB - 50), (q[0] + 52, q[1] + 40), q + [6, 5]), 'o')
    S.texte((140 - 22, 250), 'f', 'g', ancre='end')
    S.texte((140 + 46, 250), 's', 'o', ancre='start')
    S.texte((140, 34), 'f^{−1}(\\{b\\})', 'g', taille=15)
    S.point((300, 34), 'o', r=5)
    S.texte((312, 34), 'C : un point par fibre', 'o', ancre='start', ui=True)
    return S


# ================================================================ ord
def parties(E):
    return [frozenset(c) for k in range(len(E) + 1) for c in itertools.combinations(E, k)]


def nom_partie(X, E, tout='E'):
    if not X:
        return '∅'
    if X == frozenset(E):
        return tout
    return '{' + ', '.join(sorted(X)) + '}'


POS_HASSE = {(): (260, 318), ('a',): (130, 228), ('b',): (260, 228), ('c',): (390, 228),
             ('a', 'b'): (130, 138), ('a', 'c'): (260, 138), ('b', 'c'): (390, 138), ('a', 'b', 'c'): (260, 48)}


def hasse(S, E, couleur, pointille, boite=(26, 12), tout='E'):
    P = parties(E)
    pos = {X: np.array(POS_HASSE[tuple(sorted(X))], float) for X in P}
    for X in P:
        for Y in P:
            if X < Y and len(Y) == len(X) + 1:
                d = X in pointille or Y in pointille
                ligne_boites(S, pos[X], pos[Y], boite, boite, 'g' if d else 't', d=d)
    for X in P:
        S.texte(pos[X], nom_partie(X, E, tout), couleur.get(X, 't'))
    return pos


@schema('od-majorants')
def od_majorants():
    E = ('a', 'b', 'c')
    P = parties(E)
    pE = frozenset(E)
    Q = [X for X in P if X != pE]                       # parties différentes de E
    maxi = [X for X in Q if not any(X < Y for Y in Q)]
    assert sorted(map(sorted, maxi)) == [['a', 'b'], ['a', 'c'], ['b', 'c']]
    assert all(X == pE - {a} for X, a in zip(sorted(maxi, key=sorted), ['c', 'b', 'a']))
    assert not any(all(Y <= X for Y in Q) for X in Q)   # aucun plus grand élément
    S = Schema(520, 344, "Ordre d'inclusion sur les parties de {a, b, c} différentes de E")
    couleur = {X: 'r' for X in maxi}
    couleur[pE] = 'g'
    pos = hasse(S, E, couleur, [pE])
    S.texte(pos[pE] + [-14, 0], '{a, b, c} =', 'g', ancre='end', taille=15)
    S.texte(pos[pE] + [44, 0], 'exclu', 'g', ancre='start', ui=True)
    S.texte((452, 138), 'maximaux', 'r', ancre='start', ui=True)
    return S


@schema('od-tarski')
def od_tarski():
    E = ('a', 'b', 'c')                 # l'ensemble A de la légende ; le treillis est 𝒫(A)
    P = parties(E)
    Ua, Ub = frozenset('a'), frozenset('b')
    phi = {X: Ua | (X & Ub) for X in P}
    assert all(phi[X] <= phi[Y] for X in P for Y in P if X <= Y)         # croissante
    fixes = [X for X in P if phi[X] == X]
    Sx = [X for X in P if X <= phi[X]]
    s = frozenset().union(*Sx)
    assert sorted(map(sorted, fixes)) == [['a'], ['a', 'b']]
    assert sorted(map(sorted, Sx)) == [[], ['a'], ['a', 'b'], ['b']]
    assert s == frozenset('ab') and phi[s] == s and all(X <= s for X in fixes)
    S = Schema(520, 356, "Point fixe de Knaster-Tarski pour φ(X) = {a} ∪ (X ∩ {b})")
    pos = {X: np.array(POS_HASSE[tuple(sorted(X))], float) for X in P}
    # zone S
    nuage = np.vstack([arc(pos[X], 32, 0, 2 * np.pi, 48) for X in Sx])
    S.poly(enveloppe(nuage), 'b', d=True, ferme=True, rempli='b')
    couleur = {X: ('r' if X == s else 't') for X in P}
    hasse(S, E, couleur, [], tout='A')
    # flèches de φ (bleu) sur les parties non fixes
    for X in P:
        if phi[X] != X:
            p, q = pos[X], pos[phi[X]]
            k = 0.18 if p[0] >= q[0] else -0.18
            if X == frozenset('b'):
                k = -0.2
            if X == frozenset('c'):
                k = -0.16
            pts = courbe_entre(p, q, k)
            d0 = sortie_boite(p, q, 26, 12) + 4
            d1 = sortie_boite(q, p, 26, 12) + 4
            Ls = np.r_[0, np.cumsum(np.linalg.norm(np.diff(pts, axis=0), axis=1))]
            ok = (Ls > d0) & (Ls < Ls[-1] - d1)
            S.courbe_fleche(pts[ok], 'v', l=1.4)
    for X in fixes:
        S.ellipse(pos[X], 36, 20, 'r' if X == s else 't')
    S.texte((128, 298), 'S', 'b', taille=18)
    S.texte(pos[s] + [-42, 0], 's', 'r', ancre='end')
    S.texte((470, 318), 'φ', 'v', ancre='start')
    S.fleche((430, 318), (464, 318), 'v')
    return S


@schema('od-coupures')
def od_coupures():
    S = Schema(500, 170, "Les parties ]←, x[ et ]←, x] de E")
    xg, xd, xx = 50, 450, 260
    for y, ferme in [(56, False), (132, True)]:
        S.fleche((xg, y), (xd, y), 'g')
        S.texte((xd + 10, y), 'E', 'g', ancre='start')
        c = 'g' if ferme else 'r'
        epais(S, (xg, y), (xx - (0 if ferme else 6), y), c, 5)
        S.point((xx, y), c, r=5.5, creux=not ferme)
        S.texte((xx, y + 22), 'x', c)
        S.texte((150, y - 20), ']←, x]' if ferme else ']←, x[', c)
    S.texte((xx + 24, 132 - 20), 'a un plus grand élément : exclu', 'g', ancre='start', ui=True)
    S.texte((xx + 24, 56 - 20), 'coupure', 'r', ancre='start', ui=True)
    return S


# ================================================================ alg
def enveloppe(pts):
    """Enveloppe convexe (parcours de Graham-Andrew), dans l'ordre."""
    P = sorted(map(tuple, np.round(pts, 3)))
    def tour(seq):
        h = []
        for p in seq:
            while len(h) >= 2 and ((h[-1][0] - h[-2][0]) * (p[1] - h[-2][1])
                                   - (h[-1][1] - h[-2][1]) * (p[0] - h[-2][0])) <= 0:
                h.pop()
            h.append(p)
        return h
    return np.array(tour(P)[:-1] + tour(P[::-1])[:-1])


def compose(f, g):
    return {x: f[g[x]] for x in g}            # (f ∘ g)(x) = f(g(x))


@schema('a-distingue')
def a_distingue():
    E = 'abc'
    idt = {x: x for x in E}
    tab = {'a': 'b', 'b': 'a', 'c': 'c'}
    tbc = {'a': 'a', 'b': 'c', 'c': 'b'}
    tac = {'a': 'c', 'b': 'b', 'c': 'a'}
    s1, s2 = compose(tab, tbc), compose(tbc, tab)
    nom = {'id': idt, 'τ_{ab}': tab, 'τ_{bc}': tbc, 'τ_{ac}': tac, 'τ_{ab}∘τ_{bc}': s1, 'τ_{bc}∘τ_{ab}': s2}
    key = lambda p: tuple(p[x] for x in E)
    inv = {key(v): k for k, v in nom.items()}
    assert len(inv) == 6                                   # les six bijections de {a, b, c}
    H = [idt, tab]
    gauche = lambda x: frozenset(inv[key(compose(x, h))] for h in H)
    droite = lambda x: frozenset(inv[key(compose(h, x))] for h in H)
    assert gauche(tbc) == {'τ_{bc}', 'τ_{bc}∘τ_{ab}'} and gauche(tac) == {'τ_{ac}', 'τ_{ab}∘τ_{bc}'}
    assert droite(tbc) == {'τ_{bc}', 'τ_{ab}∘τ_{bc}'} and droite(tac) == {'τ_{ac}', 'τ_{bc}∘τ_{ab}'}
    assert gauche(idt) == droite(idt) and gauche(tbc) != droite(tbc)
    assert key(compose(tbc, compose(tab, tbc))) == key(tac)              # remarque de la fiche
    S = Schema(520, 330, "Classes à gauche et à droite de H = {id, τ_ab} dans 𝔖({a, b, c})")
    for k, (cote, cl) in enumerate([('gauche', gauche), ('droite', droite)]):
        x0 = 135 + 250 * k
        S.texte((x0, 22), f'classes à {cote}', 'g', ui=True)
        # H en haut
        S.texte((x0 - 45, 72), '`id`')
        S.texte((x0 + 45, 72), 'τ_{ab}')
        capsule(S, (x0 - 45, 72), (x0 + 45, 72), 22, 'g')
        S.texte((x0, 108), 'H', 'g', taille=15)
        for j, t in enumerate([tbc, tac]):
            xc = x0 + (2 * j - 1) * 55
            cls = cl(t)
            nt = inv[key(t)]
            autre = next(iter(cls - {nt}))
            diff = cls != gauche(t) or cls != droite(t)
            S.texte((xc, 162), nt)
            S.texte((xc, 222), autre, 'r' if diff else 't', taille=15)
            capsule(S, (xc, 162), (xc, 222), 40, 'r' if diff else 'g')
            nomc = (nt + 'H') if k == 0 else ('H' + nt)
            S.texte((xc, 286), nomc, 'g', taille=15)
    S.ligne((260, 40), (260, 300), 'g', d=True)
    return S


@schema('a-transversal')
def a_transversal():
    cols = ['C', 'D', 'K']
    lignes = ['e', 'h', 'k']
    X = [210, 310, 410]
    Y = [94, 164, 234]
    S = Schema(500, 300, "Groupe G découpé en classes à gauche ; transversale T choisie dans chacune")
    S.rect(160, 56, 300, 216, 't', rx=10)
    for i in (1, 2):
        S.ligne((160 + 100 * i, 56), (160 + 100 * i, 272), 'g')
    S.texte((150, 40), 'G', ancre='end')
    for x, c in zip(X, cols):
        S.texte((x, 40), c)
    for y, l in zip(Y, lignes):
        S.texte((120, y), l, 'g', ancre='end')
    S.ligne((136, Y[0] - 10), (136, Y[2] + 10), 'g')
    S.texte((92, (Y[0] + Y[2]) / 2), 'H', 'g', ancre='end')
    S.surface([(162, Y[0] - 22), (458, Y[0] - 22), (458, Y[0] + 22), (162, Y[0] + 22)], 'o')
    for i, x in enumerate(X):
        for j, y in enumerate(Y):
            c = 'o' if j == 0 else ('r' if (i, j) == (0, 1) else 't')
            S.point((x - 22, y), c, r=4.5 if c != 't' else 3.4)
        S.texte((x - 12, Y[0]), 't_' + cols[i], 'o', ancre='start', taille=16)
    S.texte((X[0] - 12, Y[1]), 't_C h', 'r', ancre='start', taille=16)
    S.texte((X[1] - 12, Y[1]), 't_D h', ancre='start', taille=16)
    S.texte((X[0] - 12, Y[2]), 't_C k', ancre='start', taille=16)
    S.texte((476, Y[0]), 'T', 'o', ancre='start')
    S.texte((310, 290), 'groupe dessiné fini', 'g', ui=True)
    return S


def _s3():
    """Les six bijections de {a, b, c}, nommées comme dans les fiches, et leur composition."""
    E = 'abc'
    idt = {x: x for x in E}
    tab = {'a': 'b', 'b': 'a', 'c': 'c'}
    tbc = {'a': 'a', 'b': 'c', 'c': 'b'}
    tac = {'a': 'c', 'b': 'b', 'c': 'a'}
    nom = {'id': idt, 'τ_{ab}': tab, 'τ_{bc}': tbc, 'τ_{ac}': tac,
           'τ_{ab}∘τ_{bc}': compose(tab, tbc), 'τ_{bc}∘τ_{ab}': compose(tbc, tab)}
    key = lambda p: tuple(p[x] for x in E)
    inv = {key(v): k for k, v in nom.items()}
    assert len(inv) == 6
    mul = lambda x, y: inv[key(compose(nom[x], nom[y]))]
    return list(nom), mul


def _est_sous_groupe(H, G, mul):
    inv = {x: next(y for y in G if mul(x, y) == 'id') for x in G}
    return 'id' in H and all(mul(x, inv[y]) in H for x in H for y in H), inv


@schema('a-quotient')
def a_quotient():
    G, mul = _s3()
    A3 = ['id', 'τ_{ab}∘τ_{bc}', 'τ_{bc}∘τ_{ab}']
    H2 = ['id', 'τ_{ab}']
    y = 'τ_{bc}'
    S = Schema(540, 330, "Produits xτ_bc pour x dans H : une seule classe si H est distingué, deux sinon")
    panneaux = [(A3, [['id', 'τ_{ab}∘τ_{bc}', 'τ_{bc}∘τ_{ab}'], ['τ_{bc}', 'τ_{ab}', 'τ_{ac}']],
                 ['H', 'τ_{bc}H'], [65, 168], 'H distingué', 'une classe'),
                (H2, [['id', 'τ_{ab}'], ['τ_{bc}', 'τ_{bc}∘τ_{ab}'], ['τ_{ac}', 'τ_{ab}∘τ_{bc}']],
                 ['H', 'τ_{bc}H', 'τ_{ac}H'], [303, 397, 491], 'H non distingué', 'deux classes')]
    for k, (H, cols, noms, X, titre, bilan) in enumerate(panneaux):
        ok, inv = _est_sous_groupe(H, G, mul)
        assert ok
        distingue = all(mul(mul(g, h), inv[g]) in H for g in G for h in H)
        assert distingue == (k == 0)
        if k == 0:
            # justification de la légende : classes à gauche et à droite = H et son complémentaire
            gauches = {frozenset(mul(x, h) for h in H) for x in G}
            droites = {frozenset(mul(h, x) for h in H) for x in G}
            assert gauches == droites == {frozenset(H), frozenset(set(G) - set(H))}
        # les colonnes dessinées sont exactement les classes à gauche xH, et leur premier élément les nomme
        assert sorted(map(sorted, cols)) == sorted(map(sorted, {frozenset(mul(x, h) for h in H) for x in G}))
        assert all(set(c) == {mul(c[0], h) for h in H} for c in cols)
        assert [n.replace('H', '') or 'id' for n in noms] == [c[0] for c in cols]
        produits = {mul(x, y) for x in H}                          # l'ensemble Hτ_bc
        touchees = [j for j, c in enumerate(cols) if produits & set(c)]
        assert len(touchees) == (1 if k == 0 else 2)
        if k == 1:
            # la remarque : x = id et x′ = τ_ab sont dans la même classe H, mais xτ_bc et x′τ_bc non
            assert mul('id', y) in cols[1] and mul('τ_{ab}', y) in cols[2]
        Y = [92, 150, 208][:len(cols[0])]
        for j, (c, xc) in enumerate(zip(cols, X)):
            for e, yy in zip(c, Y):
                coul = 'b' if j == 0 else ('r' if e in produits else 't')
                S.texte((xc, yy), e.replace('id', '`id`').replace('∘', ' ∘ '), coul, taille=15)
            capsule(S, (xc, Y[0]), (xc, Y[-1]), 42, 'r' if j in touchees else 'g')
            S.texte((xc, Y[-1] + 68), noms[j], 'g', taille=15)
        xm = (X[0] + X[-1]) / 2
        S.texte((xm, 24), titre, 'g', ui=True)
        S.texte((xm, 314), bilan, 'r', ui=True)
    S.ligne((240, 40), (240, 300), 'g', d=True)
    return S


@schema('a-isomorphisme')
def a_isomorphisme():
    G, mul = _s3()
    H = ['id', 'τ_{ab}∘τ_{bc}', 'τ_{bc}∘τ_{ab}']
    T = ['τ_{ab}', 'τ_{bc}', 'τ_{ac}']
    fn = {x: ('id' if x in H else 'τ_{ab}') for x in G}
    # f est un morphisme de 𝔖({a, b, c}) dans lui-même, de noyau H et d'image {id, τ_ab}
    assert all(fn[mul(x, y)] == mul(fn[x], fn[y]) for x in G for y in G)
    assert [x for x in G if fn[x] == 'id'] == H and sorted(set(fn.values())) == ['id', 'τ_{ab}']
    ok, _ = _est_sous_groupe(H, G, mul)
    assert ok and set(T) == {mul('τ_{ab}', h) for h in H}          # la seconde ligne est τ_ab H
    # f est constante sur chaque classe, et deux classes distinctes ont des images distinctes
    assert len({fn[x] for x in H}) == 1 and len({fn[x] for x in T}) == 1 and fn[H[0]] != fn[T[0]]
    # justification de la légende : xH = G ∖ H pour x ∉ H, donc xy ∈ H ⟺ (x ∈ H ⟺ y ∈ H), et τ_ab² = id
    assert all({mul(x, h) for h in H} == set(T) for x in T)
    assert all((mul(x, y) in H) == ((x in H) == (y in H)) for x in G for y in G)
    assert mul('τ_{ab}', 'τ_{ab}') == 'id'
    S = Schema(540, 300, "Le morphisme f, constant sur les classes de son noyau, et son image")
    X = [52, 140, 228]
    Ys = [96, 206]
    for lig, yy, coul in ((H, Ys[0], 'b'), (T, Ys[1], 't')):
        for e, xx in zip(lig, X):
            S.texte((xx, yy), e.replace('id', '`id`').replace('∘', ' ∘ '), coul, taille=15)
        capsule(S, (X[0], yy), (X[-1], yy), 40, 'g')
    S.texte((X[1], Ys[0] + 52), 'H = `Ker` f', 'b', taille=15)
    S.texte((X[1], Ys[1] + 52), 'τ_{ab}H', 'g', taille=15)
    S.texte((X[1], 30), 'G', 'g', taille=16)
    # G′ : les six éléments ; Im f = {id, τ_ab} en rouge
    P = {'id': (398, 96), 'τ_{ab}': (398, 151), 'τ_{ab}∘τ_{bc}': (398, 206),
         'τ_{bc}∘τ_{ab}': (486, 96), 'τ_{bc}': (486, 151), 'τ_{ac}': (486, 206)}
    assert sorted(P) == sorted(G)
    S.rect(350, 58, 182, 186, 'g', rx=12)
    S.texte((486, 30), 'G′', 'g', taille=16)
    for e, p in P.items():
        S.texte(p, e.replace('id', '`id`').replace('∘', ' ∘ '), 'r' if e in fn.values() else 'g', taille=15)
    capsule(S, (398, 96), (398, 151), 22, 'r')
    S.texte((398, 30), '`Im` f', 'r', taille=15)
    S.ligne((398, 44), (398, 72), 'r')
    for lig, yy in ((H, Ys[0]), (T, Ys[1])):
        cible = np.array(P[fn[lig[0]]], float)
        S.fleche((X[-1] + 50, yy), cible - [26, 0], 'r', l=1.6)
    S.texte((318, 84), 'f', 'r', taille=16)
    S.texte((318, 166), 'f', 'r', taille=16)
    return S


# ================================================================ ordin
@schema('o-transitif')
def o_transitif():
    # x = {∅, {∅}} et x = {{∅}} : on trace z → y lorsque z ∈ y, pour z, y parmi ∅, {∅} et x
    vide, un = frozenset(), frozenset([frozenset()])
    cas = [(frozenset([vide, un]), '{∅, {∅}}'), (frozenset([un]), '{{∅}}')]
    S = Schema(520, 270, "Graphes de l'appartenance : un ensemble transitif et un ensemble qui ne l'est pas")
    for k, (x, nom) in enumerate(cas):
        transitif = all(z in x for y in x for z in y)
        assert transitif == (k == 0)
        assert vide in un and un in x                       # les deux flèches tracées en trait plein
        assert (vide in x) == transitif                     # la flèche directe ∅ → x
        x0 = 130 + 260 * k
        p0, p1, p2 = np.array([x0 - 72, 206.]), np.array([x0 + 72, 206.]), np.array([x0, 86.])
        b0, b1, b2 = (9, 12), (18, 12), (largeur_etiquette(nom) / 2 + 2, 12)
        S.texte(p0, '∅')
        S.texte(p1, '{∅}')
        S.texte(p2, nom, 't' if transitif else 'r')
        fleche_boites(S, p0, p1, b0, b1)
        fleche_boites(S, p1, p2, b1, b2)
        fleche_boites(S, p0, p2, b0, b2, 't' if transitif else 'r', d=not transitif)
        if not transitif:
            S.texte((x0 - 64, 136), 'manque', 'r', ancre='end', ui=True)
        S.texte((x0, 252), 'transitif' if transitif else 'non transitif', 'g', ui=True)
    S.texte((260, 30), 'z → y `signifie` z ∈ y', 'g', taille=15)
    return S


@schema('o-ultrafiltre')
def o_ultrafiltre():
    # Filtres sur X = {a, b, c} : on les énumère tous, on vérifie que chacun est ℱ_S = {B : S ⊂ B}
    # pour une partie S non vide, et que les maximaux sont les trois filtres principaux.
    X = frozenset('abc')
    P = [frozenset(s) for k in range(4) for s in itertools.combinations('abc', k)]

    def est_filtre(F):
        return (X in F and frozenset() not in F and all(a & b in F for a in F for b in F)
                and all(b in F for a in F for b in P if a <= b))
    familles = itertools.chain.from_iterable(itertools.combinations(P, k) for k in range(len(P) + 1))
    filtres = [frozenset(F) for F in familles if est_filtre(frozenset(F))]
    assert len(filtres) == 7
    gen = {F: frozenset.intersection(*F) for F in filtres}
    assert all(F == frozenset(b for b in P if gen[F] <= b) for F in filtres)
    maximaux = [F for F in filtres if not any(F < G for G in filtres)]
    assert sorted(len(gen[F]) for F in maximaux) == [1, 1, 1]
    # caractérisation (i) : maximal ⇔ contient A ou son complémentaire, pour toute partie A
    assert all((F in maximaux) == all(a in F or X - a in F for a in P) for F in filtres)

    S = Schema(520, 274, 'Les sept filtres sur {a, b, c}, ordonnés par inclusion ; les maximaux sont principaux')
    yy = {3: 250.0, 2: 150.0, 1: 50.0}
    pos = {}
    for k in (1, 2, 3):
        rang = sorted((F for F in filtres if len(gen[F]) == k), key=lambda F: sorted(gen[F]))
        for j, F in enumerate(rang):
            pos[F] = np.array([260.0 + (j - (len(rang) - 1) / 2) * 165.0, yy[k]])
    lab = {F: 'ℱ_{' + ''.join(sorted(gen[F])) + '}' for F in filtres}
    boite = {F: (largeur_etiquette(lab[F]) / 2 + 6, 14) for F in filtres}
    for F in filtres:
        for G in filtres:
            # trait de F vers G quand G couvre F (F ⊊ G sans filtre strictement entre les deux)
            if F < G and not any(F < H < G for H in filtres):
                assert gen[G] < gen[F]
                ligne_boites(S, pos[F], pos[G], boite[F], boite[G], 'g')
    for F in filtres:
        c = 'r' if F in maximaux else 't'
        S.texte(pos[F], lab[F], c, taille=17)
    S.texte((260, 16), 'ultrafiltres (principaux)', 'r', ui=True, taille=13)
    return S


@schema('o-representation')
def o_representation():
    # Trois bons ordres sur l'ensemble des entiers, donnés par une clé : x précède y si cle(x) < cle(y).
    K = 60                                               # troncature pour les vérifications
    ordres = [('usuel', lambda m: (0, m)),
              ('0 renvoyé à la fin', lambda m: (1 if m == 0 else 0, m)),
              ('pairs, puis impairs', lambda m: (m % 2, m))]
    rangs = []
    for nom, cle in ordres:
        L = sorted(range(K), key=cle)

        # prédécesseur immédiat de x : le plus grand élément qui le précède, s'il existe ; calculé sur la
        # troncature, puis on vérifie qu'aucun entier de K à 3K ne s'intercale (sinon, il n'y en a pas)
        def pred(x):
            av = [y for y in range(K) if cle(y) < cle(x)]
            if not av:
                return None
            m = max(av, key=cle)
            return m if all(not (cle(m) < cle(z) < cle(x)) for z in range(K, 3 * K)) else 'aucun'
        limites = [x for x in range(K // 2) if pred(x) == 'aucun']
        rangs.append((L, limites))
    # éléments, autres que le premier, sans prédécesseur immédiat (en rouge) : aucun, 0, puis 1
    assert rangs[0][1] == [] and rangs[1][1] == [0] and rangs[2][1] == [1]
    # le deuxième ordre a un plus grand élément (0), les deux autres non
    cle1 = ordres[1][1]
    assert all(cle1(m) < cle1(0) for m in range(1, 3 * K))
    assert all(any(ordres[j][1](z) > ordres[j][1](x) for z in range(3 * K)) for j in (0, 2) for x in range(K))

    S = Schema(520, 300, "Trois bons ordres sur les entiers : types différents sur un même ensemble")
    xg, r = 60, 0.74
    pos = lambda k, x0, L: x0 + L * (1 - r ** k)          # k-ième élément d'une suite croissante sans fin
    ys = [60, 150, 240]
    nb = 9
    for j, (y, (nom, cle), (L, lim)) in enumerate(zip(ys, ordres, rangs)):
        S.texte((xg - 6, y - 26), nom, 'g', ancre='start', ui=True)
        S.ligne((xg - 8, y), (500, y), 'g', l=0.8)
        if j == 0:
            blocs = [(xg, 400, L[:nb])]
        elif j == 1:
            blocs = [(xg, 330, L[:nb])]
        else:
            blocs = [(xg, 190, [m for m in L if m % 2 == 0][:nb]), (xg + 230, 190, [m for m in L if m % 2][:nb])]
        for x0, Lb, elems in blocs:
            for k, m in enumerate(elems):
                x = pos(k, x0, Lb)
                c = 'r' if m in lim else 't'
                S.point((x, y), c, r=4.4 if c == 'r' else 3.4)
                if k < 4:
                    S.texte((x, y + 20), str(m), c, taille=15)
            S.texte((x0 + Lb + 6, y + 20), '⋯', 'g', ancre='end', taille=15)
        if j == 1:
            assert L[-1] == 0
            x = 330 + xg + 40
            S.point((x, y), 'r', r=4.4)
            S.texte((x, y + 20), '0', 'r', taille=15)
        S.texte((508, y - 26), ['`type` ω', '`type` ω + 1', ''][j], 'g', ancre='end', taille=15)
    S.texte((508, ys[2] - 26), 'deux suites', 'g', ancre='end', ui=True)
    return S


@schema('o-zorn')
def o_zorn():
    # Ensemble ordonné fini dessiné par niveaux ; l'ordre est la clôture transitive des relations données.
    elems = ['c1', 'c2', 'c3', 'y', 'z', 'm1', 'm2', 'w']
    couv = [('c1', 'c2'), ('c2', 'c3'), ('c2', 'y'), ('c1', 'z'),
            ('c3', 'm1'), ('c3', 'm2'), ('m1', 'w'), ('y', 'w')]
    inf = set(couv)
    while True:
        plus = {(a, d) for a, b in inf for c, d in inf if b == c} - inf
        if not plus:
            break
        inf |= plus
    lt = lambda a, b: (a, b) in inf
    assert not any(lt(a, a) for a in elems)                          # ordre strict
    C = ['c1', 'c2', 'c3']                                           # la chaîne F[α]
    chaine = lambda X: all(lt(a, b) or lt(b, a) or a == b for a in X for b in X)
    assert chaine(C)
    Smaj = [x for x in elems if all(lt(c, x) for c in C)]            # majorants stricts de F[α]
    assert Smaj == ['m1', 'm2', 'w']
    assert lt('c2', 'y') and not lt('c3', 'y') and lt('c1', 'z') and not lt('c2', 'z')   # y, z : non
    choisi = 'm1'                                                    # F(α) = c(S(F[α]))
    assert choisi in Smaj and chaine(C + [choisi])                   # F[α^+] est encore une chaîne
    hasse = [(a, b) for a, b in inf if not any(lt(a, c) and lt(c, b) for c in elems)]
    assert sorted(hasse) == sorted(couv)                             # traits = relations de couverture
    P = {'c1': (230, 296), 'c2': (230, 226), 'c3': (230, 156), 'y': (110, 156), 'z': (350, 226),
         'm1': (170, 86), 'm2': (300, 86), 'w': (120, 26)}
    P = {k: np.array(v, float) + [0, 12] for k, v in P.items()}
    assert all(P[a][1] > P[b][1] for a, b in hasse)                  # chaque trait monte
    S = Schema(520, 336, "Une étape de la preuve de Zorn : chaîne, majorants stricts et élément choisi")
    nuage = np.vstack([arc(P[x], 22, 0, 2 * np.pi, 40) for x in Smaj])
    S.poly(enveloppe(nuage), 'b', d=True, ferme=True, rempli='b')
    capsule(S, P['c1'], P['c3'], 20, 'r', rempli='r')
    for a, b in sorted(hasse):
        ligne_boites(S, P[a], P[b], (6, 6), (6, 6), 'r' if a in C and b in C else 'g', marge=1)
    for x in elems:
        c = 'r' if x in C else ('o' if x == choisi else ('b' if x in Smaj else 't'))
        S.point(P[x], c, r=5.2 if c in 'ro' else 3.8)
    S.texte(P['c2'] + [-30, 0], 'F[α]', 'r', ancre='end')
    S.texte(P['m1'] + [16, -4], 'F(α)', 'o', ancre='start', taille=16)   # dans la zone bleue
    S.texte(P['m2'] + [36, 0], 'S(F[α])', 'b', ancre='start')
    return S


# ================================================================ n
@schema('n-recdef')
def n_recdef():
    # E = {a, b, c, d}, g : a ↦ b, b ↦ c, c ↦ d, d ↦ b. Approximations h_n de domaine S(n) = {0, …, n},
    # construites comme dans la preuve : h_0 = {(0, a)}, h_{n+1} = h_n ∪ {(n+1, g(h_n(n)))}.
    E = ['a', 'b', 'c', 'd']
    g = {'a': 'b', 'b': 'c', 'c': 'd', 'd': 'b'}
    N = 6                                               # on dessine le graphe sur 0, …, 5
    h = [{0: 'a'}]
    for n in range(N - 1):
        h.append({**h[-1], n + 1: g[h[-1][n]]})
    for n, hn in enumerate(h):
        assert set(hn) == set(range(n + 1))                                   # domaine S(n)
        assert hn[0] == 'a' and all(hn[m + 1] == g[hn[m]] for m in range(n))  # approximation
    for n in range(N):                                   # deux approximations coïncident sur leurs domaines
        for k in range(N):
            assert all(h[n][m] == h[k][m] for m in set(h[n]) & set(h[k]))
    graphe = set().union(*(hn.items() for hn in h))       # réunion des graphes
    assert len({m for m, _ in graphe}) == len(graphe)     # c'est une application
    f = dict(graphe)
    assert f == h[-1] and [f[m] for m in range(N)] == ['a', 'b', 'c', 'd', 'b', 'c']
    assert f[1] == f[4]                                   # f n'est pas injective (légende)

    S = Schema(520, 356, "Graphe de f construit par approximations successives h_n de domaine S(n)")
    x0, dx = 132, 64
    X = [x0 + dx * m for m in range(N)]
    yE = {e: 46 + 44 * i for i, e in enumerate(E)}
    ybas = yE['d'] + 34
    # axes : ω horizontalement, E verticalement
    S.ligne((x0 - 30, ybas), (X[-1] + 22, ybas), 'g')
    S.texte((X[-1] + 30, ybas), '⋯', 'g', ancre='start')
    S.texte((X[-1] + 42, ybas + 18), 'ω', 'g', taille=15)
    for m in range(N):
        S.ligne((X[m], ybas - 4), (X[m], ybas + 4), 'g')
        S.texte((X[m], ybas + 18), str(m), 'g', taille=15)
    for e in E:
        S.ligne((x0 - 30, yE[e]), (X[-1] + 26, yE[e]), 'g', d=True, l=0.7)
        S.texte((x0 - 40, yE[e]), e, ancre='end')
    S.texte((x0 - 64, yE['b'] + 22), 'E', 'g', ancre='end')
    # flèches de g entre points consécutifs du graphe
    for m in range(N - 1):
        p, q = np.array([X[m], yE[f[m]]]), np.array([X[m + 1], yE[f[m + 1]]])
        S.fleche(p, q, 'g', retrait=8, retrait_debut=8, l=1)
    S.texte(((X[0] + X[1]) / 2 + 12, (yE['a'] + yE['b']) / 2 - 8), 'g', 'g', ancre='start', taille=15)
    for m in range(N):
        S.point((X[m], yE[f[m]]), 'r', r=4.6)
    # approximations h_0, …, h_4 : barres emboîtées sous l'axe, le point ajouté en rouge
    y0, pas = ybas + 46, 18
    for n in range(N - 1):
        y = y0 + pas * n
        if n:
            epais(S, (X[0], y), (X[n], y), 't', 2.2)
        for m in range(n + 1):
            S.point((X[m], y), 'r' if m == n else 't', r=3.6 if m == n else 2.8)
        S.texte((X[0] - 22, y), f'h_{n}', 'g', ancre='end', taille=15)
    S.texte((X[N - 2] + 34, y0 + pas * (N - 2)), '⋯', 'g', ancre='start')
    return S


@schema('n-fini')
def n_fini():
    # Construction de la preuve de (i), appliquée à une injection f : p + 1 → n + 1 (ici p = 3, n = 4) :
    # si f(k) = n avec k < p, on pose g(j) = f(j) pour j ≠ k et g(k) = f(p) ; g : p → n est injective.
    p, n = 3, 4
    f = {0: 0, 1: 4, 2: 3, 3: 2}
    assert set(f) == set(range(p + 1)) and set(f.values()) <= set(range(n + 1))
    assert len(set(f.values())) == len(f)                                  # f injective
    k = next(j for j in range(p) if f[j] == n)
    gg = {j: (f[p] if j == k else f[j]) for j in range(p)}
    assert k == 1 and f[p] != n
    assert set(gg.values()) <= set(range(n)) and len(set(gg.values())) == p  # g : p → n injective

    S = Schema(520, 300, "Construction de g : on réoriente vers f(p) la flèche qui atteignait n")
    dy, ytop = 44, 70

    def panneau(cx, dom, cod, fl, titre, coul):
        xa, xb = cx - 66, cx + 66
        Ya = {j: ytop + dy * j for j in range(dom)}
        Yb = {j: ytop + dy * j for j in range(cod)}
        S.rect(xa - 26, ytop - 24, 52, dy * (dom - 1) + 48, 'g', rx=20)
        S.rect(xb - 26, ytop - 24, 52, dy * (cod - 1) + 48, 'g', rx=20)
        for j in range(dom):
            S.point((xa, Ya[j]))
            S.texte((xa - 12, Ya[j]), str(j), ancre='end', taille=15)
        for j in range(cod):
            S.point((xb, Yb[j]))
            S.texte((xb + 12, Yb[j]), str(j), ancre='start', taille=15)
        for j, v in fl.items():
            S.fleche((xa, Ya[j]), (xb, Yb[v]), coul.get(j, 't'), retrait=6, retrait_debut=6)
        S.texte((cx, ytop + dy * (max(dom, cod) - 1) + 44), titre, 'g', taille=16)
        return xa, xb, Ya, Yb

    xa, xb, Ya, Yb = panneau(130, p + 1, n + 1, f, 'f : p + 1 → n + 1', {k: 'r', p: 'b'})
    S.texte((xa - 40, Ya[k]), 'k', 'r', ancre='end', taille=15)
    S.texte((xa - 40, Ya[p]), 'p', 'b', ancre='end', taille=15)
    S.texte((xb + 32, Yb[n]), 'n', 'r', ancre='start', taille=15)
    xa, xb, Ya, Yb = panneau(390, p, n + 1, gg, 'g : p → n', {k: 'b'})
    S.texte((xa - 40, Ya[k]), 'k', 'b', ancre='end', taille=15)
    S.point((xb, Yb[n]), 'g', r=6, creux=True)          # n n'est plus atteint : g est à valeurs dans n
    S.texte((xb + 32, Yb[n]), 'n', 'g', ancre='start', taille=15)
    S.fleche((236, 150), (292, 150), 'g')
    return S


# ================================================================ z
@schema('z-construction')
def z_construction():
    n = 4
    s = 58
    ox, oy = 130, 300
    P = lambda a, b: np.array([ox + a * s, oy - b * s], float)
    S = Schema(520, 360, "Classes de ℕ × ℕ pour (a, b) ∼ (c, d) ⟺ a + d = b + c")
    S.fleche(P(-0.3, 0), P(n + 0.6, 0), 'g')
    S.fleche(P(0, -0.3), P(0, n + 0.6), 'g')
    S.texte(P(n + 0.6, 0) + [10, 0], 'a', 'g', ancre='start')
    S.texte(P(0, n + 0.6) + [0, -12], 'b', 'g')
    for a in range(n + 1):
        S.texte(P(a, 0) + [0, 20], str(a), 'g', taille=14)
        S.texte(P(0, a) + [-16, 0], str(a), 'g', taille=14, ancre='end')
    for k in range(-n, n + 1):
        cl = [(a, b) for a in range(n + 1) for b in range(n + 1) if a + 0 == b + k]   # (a, b) ∼ (k, 0) ou (0, -k)
        rep = (k, 0) if k >= 0 else (0, -k)
        assert rep in cl and all(a + rep[1] == b + rep[0] for a, b in cl)
        p, q = P(*cl[0]), P(*cl[-1])
        u = (q - p) / np.linalg.norm(q - p) if len(cl) > 1 else np.array([1, -1]) / np.sqrt(2)
        epais(S, p - 10 * u, q + 18 * u, 'g', 1)
        lab = str(k).replace('-', '−')
        S.texte(q + 32 * u, lab, 'r' if k else 't', taille=15)
        for a, b in cl:
            S.point(P(a, b), 'r' if (a, b) == rep else 't', r=4.6 if (a, b) == rep else 3)
    return S


@schema('z-division')
def z_division():
    a, b = -7, 3
    q, r = divmod(a, b)
    assert (q, r) == (-3, 2) and a == b * q + r and 0 <= r < b
    qm, rm = -2, a - b * (-2)
    assert rm == -1
    S = Schema(520, 186, "Division euclidienne de −7 par 3 sur la droite des entiers")
    X = lambda t: 60 + (t + 10) * 36
    y = 100
    S.fleche((X(-10.6), y), (X(1.6), y), 'g')
    for t in range(-10, 2):
        S.ligne((X(t), y - 5), (X(t), y + 5), 'g')
        S.texte((X(t), y + 22), str(t).replace('-', '−'), 'b' if t % b == 0 else 'g', taille=14)
        if t % b == 0:
            S.point((X(t), y), 'b', r=4.2)
    S.point((X(a), y), 'r', r=5)
    # bon quotient : 3·(−3) = −9, puis + 2
    S.courbe_fleche(courbe_entre((X(b * q), y - 6), (X(a), y - 6), -0.45), 'r')
    S.texte(((X(b * q) + X(a)) / 2, y - 44), '+ 2', 'r', taille=15)
    # mauvais quotient : 3·(−2) = −6, puis −1
    S.courbe_fleche(courbe_entre((X(b * qm), y - 6), (X(a), y - 6), 0.6), 'g', d=True)
    m = (X(b * qm) + X(a)) / 2
    S.texte((m, y - 44), '− 1', 'g', taille=15)
    S.ligne((m - 16, y - 36), (m + 16, y - 52), 'g')
    S.texte((X(-8.3), y + 62), '−7 = 3 · (−3) + 2', 'r', taille=16)
    S.texte((X(-3.6), y + 62), '−7 = 3 · (−2) − 1', 'g', taille=16)
    S.ligne((X(-3.6) - 66, y + 70), (X(-3.6) + 66, y + 54), 'g')
    return S


# ================================================================ q
@schema('q-irrationnel')
def q_irrationnel():
    s1, h1 = Fr(7, 5), None
    h1 = min(Fr(1), (2 - s1 ** 2) / (2 * (2 * s1 + 1)))
    assert s1 ** 2 < 2 and h1 == Fr(1, 190) and s1 + h1 == Fr(267, 190) and (s1 + h1) ** 2 < 2
    s2 = Fr(3, 2)
    h2 = (s2 ** 2 - 2) / (2 * s2)
    assert s2 ** 2 > 2 and h2 == Fr(1, 12) and s2 - h2 == Fr(17, 12) and (s2 - h2) ** 2 > 2
    assert s2 - h2 == (s2 + 2 / s2) / 2                    # étape de Héron
    r2 = 2 ** 0.5                                          # position du trou, pour le dessin seulement
    S = Schema(520, 290, "Coupure {x ≤ 0 ou x² < 2} de ℚ et améliorations de candidats")
    # droite rationnelle
    X = lambda t: 50 + (t + 1) * 140
    y = 60
    S.fleche((X(-1.1), y), (X(2.2), y), 'g')
    S.texte((X(2.2) + 10, y), 'ℚ', 'g', ancre='start')
    for t in (-1, 0, 1, 2):
        S.ligne((X(t), y - 5), (X(t), y + 5), 'g')
        S.texte((X(t), y - 20), str(t).replace('-', '−'), 'g', taille=14)
    epais(S, (X(-1.1), y), (X(r2) - 5, y), 'r', 5)
    S.point((X(r2), y), 'r', r=5, creux=True)
    # zoom : échelle linéaire sur [a0, a1], puis axe interrompu jusqu'à 3/2
    a0, a1 = 1.3955, 1.4205
    assert a0 < s1 < s1 + h1 < r2 < s2 - h2 < a1 < s2
    Z = lambda t: 50 + (t - a0) / (a1 - a0) * 360
    z32 = 470
    yz = 196
    S.rect(X(1.39), y - 9, X(1.51) - X(1.39), 18, 'g')
    S.poly([(X(1.39), y + 10), (Z(a0), yz - 62)], 'g', d=True)
    S.poly([(X(1.51), y + 10), (z32 + 20, yz - 62)], 'g', d=True)
    S.ligne((Z(a0), yz), (Z(a1), yz), 'g')
    S.ligne((Z(a1) + 22, yz), (z32 + 20, yz), 'g')
    for dx in (4, 14):                                     # marque d'interruption de l'axe
        S.ligne((Z(a1) + dx - 4, yz + 7), (Z(a1) + dx + 4, yz - 7), 'g')
    epais(S, (Z(a0), yz), (Z(r2) - 5, yz), 'r', 5)
    S.point((Z(r2), yz), 'r', r=5, creux=True)
    pts = [(Z(s1), '7/5', 'r'), (Z(s1 + h1), '267/190', 'r'), (Z(s2 - h2), '17/12', 'b'), (z32, '3/2', 'b')]
    for xv, lab, c in pts:
        epais(S, (xv, yz - 8), (xv, yz + 8), c, 2.2)
        S.texte((xv, yz + 26), lab, c, taille=15)
    S.courbe_fleche(courbe_entre((Z(s1), yz - 10), (Z(s1 + h1), yz - 10), -0.4), 'r')
    S.texte(((Z(s1) + Z(s1 + h1)) / 2, yz - 46), '+ 1/190', 'r', taille=14)
    S.courbe_fleche(courbe_entre((z32, yz - 10), (Z(s2 - h2), yz - 10), 0.22), 'b')
    S.texte(((z32 + Z(s2 - h2)) / 2, yz - 40), '− 1/12', 'b', taille=14)
    S.texte(((Z(a0) + Z(r2)) / 2, 262), 'dans A', 'r', ui=True)
    S.texte(((Z(s2 - h2) + z32) / 2, 262), 'majorants de A', 'b', ui=True)
    return S


@schema('q-construction')
def q_construction():
    A, B = 4, 3
    s = 46
    ox, oy = 250, 196
    P = lambda a, b: np.array([ox + a * s, oy - b * s], float)
    classes = [Fr(0), Fr(1, 2), Fr(-1), Fr(2)]
    S = Schema(520, 392, "Classes de ℤ × (ℤ ∖ {0}) : points entiers des droites par l'origine")
    S.fleche(P(-A - 0.5, 0), P(A + 0.6, 0), 'g', d=True)
    S.fleche(P(0, -B - 0.5), P(0, B + 0.6), 'g')
    S.texte(P(A + 0.6, 0) + [10, 0], 'a', 'g', ancre='start')
    S.texte(P(0, B + 0.6) + [-12, 4], 'b', 'g', ancre='end')
    S.texte(P(-A - 0.5, 0) + [0, 16], 'b = 0 exclu', 'g', ancre='start', ui=True)
    for k, x in enumerate(classes):
        pts = [(a, b) for a in range(-A, A + 1) for b in range(-B, B + 1) if b and Fr(a, b) == x]
        assert all(a * x.denominator == b * x.numerator for a, b in pts)        # (a, b) ∼ (p, q)
        rep = (x.numerator, x.denominator)
        assert rep in pts and rep[1] >= 1                       # écriture irréductible, b ≥ 1
        d = np.array([x.numerator, x.denominator], float)
        d /= np.linalg.norm(d)
        tmax = min(A / abs(d[0]) if d[0] else 99, B / abs(d[1])) + 0.35
        epais(S, P(*(-tmax * d)), P(*(tmax * d)), 'g', 1)
        lab = f'{x.numerator}/{x.denominator}'.replace('-', '−')
        e = P(*(tmax * d)) + 16 * np.array([d[0], -d[1]]) + ([14, 0] if x == 0 else [0, 0])
        S.texte(e, lab, 'r', taille=14)
    for a in range(-A, A + 1):
        for b in range(-B, B + 1):
            if b == 0:
                continue
            x = Fr(a, b)
            if x in classes:
                rep = (x.numerator, x.denominator) == (a, b)
                S.point(P(a, b), 'r' if rep else 't', r=4.6 if rep else 3.2)
            else:
                S.point(P(a, b), 'g', r=1.8)
    S.point(P(0, 0), 'g', r=4, creux=True)
    return S


# ================================================================ r
@schema('rr-definition')
def rr_definition():
    c0, eps, bord, u = 0.0, 1.0, 3.62, 5.4
    k = next(j for j in range(1, 100) if c0 + j * eps >= bord)        # plus petit k avec c0 + kε ∉ C
    assert k == 4 and c0 + (k - 1) * eps < bord <= c0 + k * eps
    X = lambda t: 40 + (t + 1.2) * 56
    y = 84
    S = Schema(520, 140, "Sauts de longueur ε depuis c_0 jusqu'à sortir de la coupure C")
    S.fleche((X(-1.2), y), (X(6.2), y), 'g')
    S.texte((X(6.2) + 10, y), 'ℚ', 'g', ancre='start')
    epais(S, (X(-1.2), y), (X(bord), y), 'b', 5)
    S.texte((X(-0.6), y + 22), 'C', 'b')
    for j in range(k + 1):
        t = c0 + j * eps
        c = 'r' if j >= k - 1 else 't'
        S.point((X(t), y), c, r=4.2)
        if j < k:
            cc = 'r' if j == k - 1 else 'g'
            S.courbe_fleche(courbe_entre((X(t) + 3, y - 6), (X(t + eps) - 3, y - 6), -0.45), cc)
    S.texte(((X(0) + X(1)) / 2, y - 44), 'ε', 'g', taille=16)
    S.texte(((X(k - 1) + X(k)) / 2, y - 44), 'ε', 'r', taille=16)
    S.texte((X(c0), y + 24), 'c_0', taille=16)
    S.texte((X(c0 + (k - 1) * eps), y + 24), 'x', 'r', taille=16)
    S.texte((X(c0 + k * eps) + 6, y + 24), 'x + ε ∉ C', 'r', taille=16, ancre='start')
    S.point((X(u), y), 'g', r=3.6)
    S.texte((X(u), y - 22), 'u', 'g', taille=16)
    return S


@schema('rr-addition')
def rr_addition():
    q = 1.5
    X = lambda t: 260 + t * 80
    S = Schema(520, 250, "C = q*, ensemble {−x : x ∉ C} et opposé −C")
    lignes = [(52, 'C = q^*'), (130, '\\{−x : x ∉ C\\}'), (208, '−C')]
    for y, lab in lignes:
        S.fleche((X(-3.0), y), (X(3.0), y), 'g')
        S.ligne((X(0), y - 5), (X(0), y + 5), 'g')
        S.texte((X(0), y + 22), '0', 'g', taille=14)
    # C = q* : ]←, q[, et son complémentaire [q, →[
    y = 52
    epais(S, (X(-3.0), y), (X(q) - 6, y), 'b', 5)
    epais(S, (X(q) + 6, y), (X(2.9), y), 'g', 3, d=True)
    S.point((X(q), y), 'b', r=5, creux=True)
    S.texte((X(q), y + 22), 'q', 'b', taille=15)
    S.texte((X(-3.0), y - 20), 'C = q^*', 'b', ancre='start', taille=16)
    S.texte((X(2.2), y - 18), 'x ∉ C', 'g', taille=15)
    # {−x : x ∉ C} = ]←, −q]
    y = 130
    epais(S, (X(-3.0), y), (X(-q), y), 'g', 5)
    S.point((X(-q), y), 'g', r=5.5)
    S.texte((X(-q), y + 22), '−q', 'g', taille=15)
    S.texte((X(-3.0), y - 20), '\\{−x : x ∉ C\\} = ]←, −q]', 'g', ancre='start', taille=16)
    S.texte((X(0) + 24, y - 18), 'a un plus grand élément', 'g', ancre='start', ui=True)
    # −C = ]←, −q[
    y = 208
    epais(S, (X(-3.0), y), (X(-q) - 6, y), 'r', 5)
    S.point((X(-q), y), 'r', r=5, creux=True)
    S.texte((X(-q), y + 22), '−q', 'r', taille=15)
    S.texte((X(-3.0), y - 20), '−C = ]←, −q[', 'r', ancre='start', taille=16)
    # vérification exacte sur des rationnels : −C = {x : ∃ r > 0, −x − r ∉ C} = ]←, −q[ pour C = q*
    qq = Fr(3, 2)
    for x in [Fr(-2), Fr(-3, 2) - Fr(1, 1000), Fr(-3, 2), Fr(0)]:
        dans = any(-x - Fr(1, m) >= qq for m in range(1, 5000))
        assert dans == (x < -qq)
    return S
