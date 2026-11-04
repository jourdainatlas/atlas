"""Schémas des exemples du lexique, théorie log (logique du premier ordre) : contenu/exemples/log.yaml.

Noms lex-<id>-<k> (k : numéro de l'exemple). Largeur 400 à 440, hauteur 300 au plus, étiquettes de 17
(mémo de l'édifice, § 111). Positions calculées, et ce que dit la légende vérifié par assert.
"""
import numpy as np
from edifice_schemas import schema
from edifice_svg import Schema, courbe_entre, largeur_texte

# ---------------------------------------------------------------- syntaxe préfixée (contrôles)
ARITE_F = {'0': 0, 'S': 1, '+': 2, '×': 2}
ARITE_R = {'=': 2}
VARS = {'x', 'y', 'x₀', 'x₁'}


def _fin_terme(w, i):
    if i >= len(w):
        return None
    if w[i] in VARS:
        return i + 1
    if w[i] in ARITE_F:
        j = i + 1
        for _ in range(ARITE_F[w[i]]):
            j = _fin_terme(w, j)
            if j is None:
                return None
        return j
    return None


def _fin_formule(w, i):
    if i >= len(w):
        return None
    s = w[i]
    if s in ARITE_R:
        j = i + 1
        for _ in range(ARITE_R[s]):
            j = _fin_terme(w, j)
            if j is None:
                return None
        return j
    if s == '¬':
        return _fin_formule(w, i + 1)
    if s == '→':
        j = _fin_formule(w, i + 1)
        return None if j is None else _fin_formule(w, j)
    if s.startswith('∀'):
        return _fin_formule(w, i + 1)
    return None


def _lieur(w, k):
    """Indice du quantificateur qui lie l'occurrence de variable en k, ou None si elle est libre."""
    lieur = None
    for i in range(k):
        if w[i] == '∀' + w[k]:
            j = _fin_formule(w, i + 1)
            if j is not None and k < j:
                lieur = i                       # le plus intérieur l'emporte
    return lieur


def _ligne_entre(S, p, q, rp, rq, c='g', l=None):
    p, q = np.asarray(p, float), np.asarray(q, float)
    u = (q - p) / np.linalg.norm(q - p)
    S.ligne(p + rp * u, q - rq * u, c, l=l)


@schema('lex-variable-libre-1')
def lex_variable_libre_1():
    w = ['→', '=', 'x', 'y', '∀x', '=', 'x', 'y']             # x = y → ∀x (x = y)
    assert _fin_formule(w, 0) == len(w)
    occ = [(k, w[k], _lieur(w, k)) for k in range(len(w)) if w[k] in VARS]
    assert [(s, l) for _, s, l in occ] == [('x', None), ('y', None), ('x', 4), ('y', None)]
    libres = [k for k, _, l in occ if l is None]
    liees = [(k, l) for k, _, l in occ if l is not None]
    assert len(liees) == 1 and {w[k] for k in libres} == {'x', 'y'}
    assert 'x' in {w[k] for k in libres} and w[liees[0][0]] == 'x'   # x dans les deux catégories

    W, H, taille = 420, 132, 22
    ecart = 30
    larg = [largeur_texte(s, taille) for s in w]
    total = sum(larg) + ecart * (len(w) - 1)
    x = (W - total) / 2
    assert x > 10
    cx = []
    for lw in larg:
        cx.append(x + lw / 2)
        x += lw + ecart
    yb = 66
    # étiquettes « libre » et « liée » : elles ne se chevauchent pas d'une occurrence à la voisine
    marques = sorted(k for k in range(len(w)) if w[k] in VARS)
    for a, b in zip(marques, marques[1:]):
        assert cx[b] - cx[a] > 40, (a, b, cx[b] - cx[a])
    S = Schema(W, H, 'Occurrences libres et liées dans x = y → ∀x (x = y)')
    for (k, l) in liees:
        a = np.array([cx[l] + 4, yb - 16])
        b = np.array([cx[k], yb - 16])
        S.poly(courbe_entre(a, b, courbure=-0.45), 'r', l=1.6)
    for k, s in enumerate(w):
        c = 't'
        if k in libres:
            c = 'b'
        if any(k == kk for kk, _ in liees) or any(k == l for _, l in liees):
            c = 'r'
        S.texte((cx[k], yb), s, c, taille=taille)
    for k in libres:
        S.texte((cx[k], yb + 32), 'libre', 'b', ui=True)
    for (k, _) in liees:
        S.texte((cx[k], yb + 32), 'liée', 'r', ui=True)
    return S


@schema('lex-valuation-structure-1')
def lex_valuation_structure_1():
    # terme × + x₀ S 0 x₁, sous s(x₀) = 2, s(x₁) = 3, dans ℕ
    w = ['×', '+', 'x₀', 'S', '0', 'x₁']
    assert _fin_terme(w, 0) == len(w)
    s = {'x₀': 2, 'x₁': 3}
    op = {'0': lambda: 0, 'S': lambda a: a + 1, '+': lambda a, b: a + b, '×': lambda a, b: a * b}
    noeuds, aretes = [], []

    def lit(i, parent):
        k = len(noeuds)
        noeuds.append([w[i], None])
        if parent is not None:
            aretes.append((parent, k))
        if w[i] in VARS:
            noeuds[k][1] = s[w[i]]
            return i + 1, noeuds[k][1]
        j, args = i + 1, []
        for _ in range(ARITE_F[w[i]]):
            j, v = lit(j, k)
            args.append(v)
        noeuds[k][1] = op[w[i]](*args)
        return j, noeuds[k][1]

    fin, valeur = lit(0, None)
    assert fin == len(w) and valeur == 9
    assert [v for _, v in noeuds] == [9, 3, 2, 1, 0, 3]
    W, H, taille = 420, 268, 17
    P = [np.array(p, float) for p in [(210, 36), (130, 114), (80, 192), (180, 192), (180, 248), (290, 114)]]
    assert [lab for lab, _ in noeuds] == ['×', '+', 'x₀', 'S', '0', 'x₁']
    S = Schema(W, H, 'Valeur du terme (x₀ + S(0)) × x₁ sous s(x₀) = 2, s(x₁) = 3')
    for a, b in aretes:
        _ligne_entre(S, P[a], P[b], 14, 14)
    for k, (lab, v) in enumerate(noeuds):
        S.texte(P[k], lab.replace('₀', '_0').replace('₁', '_1'), 't', taille=taille)
        S.texte(P[k] + [20, -2], str(v), 'r', ancre='start', taille=taille)
        assert P[k][0] + 20 + largeur_texte(str(v), taille) < W
    return S


@schema('lex-sous-formule-1')
def lex_sous_formule_1():
    w = ['→', '¬', '=', 'x', '0', '∀y', '=', 'x', 'y']
    assert _fin_formule(w, 0) == len(w)
    sf = {tuple(w[i:j]) for i in range(len(w)) for j in range(i + 1, len(w) + 1) if _fin_formule(w[i:j], 0) == j - i}
    assert len(sf) == 5
    # arbre : (mot, notation usuelle, parent)
    arbre = [(tuple(w), '¬(x = 0) → ∀y (x = y)', None),
             (('¬', '=', 'x', '0'), '¬(x = 0)', 0),
             (('∀y', '=', 'x', 'y'), '∀y (x = y)', 0),
             (('=', 'x', '0'), 'x = 0', 1),
             (('=', 'x', 'y'), 'x = y', 2)]
    assert {a for a, _, _ in arbre} == sf
    feuilles = [k for k in range(5) if all(p != k for _, _, p in arbre)]
    assert feuilles == [3, 4] and all(arbre[k][0][0] == '=' for k in feuilles)    # atomiques
    W, H, taille = 420, 214, 17
    P = [np.array(p, float) for p in [(210, 34), (110, 110), (310, 110), (110, 186), (310, 186)]]
    S = Schema(W, H, 'Arbre des sous-formules de ¬(x = 0) → ∀y (x = y)')
    for k, (_, lab, p) in enumerate(arbre):
        if p is not None:
            _ligne_entre(S, P[p], P[k], 14, 14, 'g')
    for k, (_, lab, p) in enumerate(arbre):
        c = 'r' if k == 0 else ('b' if k in feuilles else 't')
        lw = largeur_texte(lab, taille)
        assert P[k][0] - lw / 2 > 4 and P[k][0] + lw / 2 < W - 4
        S.texte(P[k], lab, c, taille=taille)
    return S


@schema('lex-modele-termes-clos-2')
def lex_modele_termes_clos_2():
    # modèle {0, 1, 2}, S : 0 ↦ 1 ↦ 2 ↦ 1 ; classe de S^n 0 = valeur de S^n 0 dans ce modèle
    Sm = {0: 1, 1: 2, 2: 1}

    def val(n):
        x = 0
        for _ in range(n):
            x = Sm[x]
        return x
    classes = {}
    for n in range(12):
        classes.setdefault(val(n), []).append(n)
    assert classes == {0: [0], 1: [1, 3, 5, 7, 9, 11], 2: [2, 4, 6, 8, 10]}
    assert val(3) == val(1) and Sm[2] == 1                                  # S³0 = S0 referme la boucle

    def nom(n):
        return '0' if n == 0 else ('S0' if n == 1 else f'S^{n}0')
    lignes = {0: ['[0]', '0'], 1: ['[S0]', 'S0, S^30, …'], 2: ['[S^20]', 'S^20, S^40, …']}
    assert lignes[1][1].startswith(nom(1)) and nom(3) in lignes[1][1] and nom(2) in lignes[2][1]
    W, H, taille = 420, 206, 17
    larg = {k: max(largeur_texte(t.replace('^', ''), taille) for t in lignes[k]) + 20 for k in range(3)}
    marge = 6
    gap = (W - 2 * marge - sum(larg.values())) / 2
    assert gap > 44, gap                                   # place pour la flèche et son étiquette S
    xg = marge
    C = {}
    for k in range(3):
        C[k] = np.array([xg + larg[k] / 2, 70.0])
        xg += larg[k] + gap
    hb = 64
    S = Schema(W, H, 'Le modèle des termes clos : trois classes, et S qui revient de la troisième à la deuxième')
    for k in range(3):
        x, y = C[k][0] - larg[k] / 2, C[k][1] - hb / 2
        assert x > 2 and x + larg[k] < W - 2
        S.rect(x, y, larg[k], hb, 'g', rx=8)
        S.texte(C[k] + [0, -14], lignes[k][0], 't', taille=taille)
        S.texte(C[k] + [0, 14], lignes[k][1], 'g', taille=taille)
    # flèches S : [0] → [S0], [S0] → [S²0] en haut ; [S²0] → [S0] en rouge, par-dessous
    y_h = C[0][1] - hb / 2 - 4
    for a, b in [(0, 1), (1, 2)]:
        p = np.array([C[a][0] + larg[a] / 2 + 2, C[a][1]])
        q = np.array([C[b][0] - larg[b] / 2 - 2, C[b][1]])
        S.fleche(p, q, 't')
        S.texte(((p + q) / 2) + [0, -14], 'S', 't', taille=taille)
    p = np.array([C[2][0], C[2][1] + hb / 2 + 2])
    q = np.array([C[1][0], C[1][1] + hb / 2 + 2])
    pts = courbe_entre(p, q, courbure=-0.45, n=120)
    assert pts[:, 1].max() < H - 10
    S.courbe_fleche(pts, 'r', l=1.6)
    S.texte(((p + q) / 2) + [0, 0.45 * np.linalg.norm(q - p) / 2 + 22], 'S', 'r', taille=taille)
    return S
