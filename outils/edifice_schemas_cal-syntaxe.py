"""Schémas du chapitre cal-syntaxe (arithmétisation de la syntaxe) : arbre de lecture d'une formule dessiné par
ses facteurs, qui illustre la récurrence de valeurs, et occurrences libres et liées lues sur les positions.
Codage exact de l'atlas : a_0 '=', a_1 '¬', a_2 '→', a_3 '∀', a_4 '0', a_5 'S', a_6 '+', a_7 '×', a_{8+i} = x_i ;
<> = 0 et <k_0, …, k_m> = 2^{<k_0, …, k_{m-1}>} (2 k_m + 1)."""
from edifice_schemas import schema
from edifice_svg import Schema, courbe_entre

NOMS = ['=', '¬', '→', '∀', '0', 'S', '+', '×']


def nom_lettre(k):
    return NOMS[k] if k < 8 else f'x_{k - 8}'


def code(w):
    c = 0
    for k in w:
        c = 2 ** c * (2 * k + 1)
    return c


# ---- lecture par descente récursive, indépendante des relations des fiches
def lire_terme(w, i):
    k = w[i]
    if k == 4 or k >= 8:
        return ('terme', i, i + 1, []), i + 1
    ar = {5: 1, 6: 2, 7: 2}[k]
    fils, j = [], i + 1
    for _ in range(ar):
        a, j = lire_terme(w, j)
        fils.append(a)
    return ('terme', i, j, fils), j


def lire_formule(w, i):
    k = w[i]
    if k == 0:
        a, j = lire_terme(w, i + 1)
        b, j = lire_terme(w, j)
        return ('formule', i, j, [a, b]), j
    if k == 1:
        a, j = lire_formule(w, i + 1)
        return ('formule', i, j, [a]), j
    if k == 2:
        a, j = lire_formule(w, i + 1)
        b, j = lire_formule(w, j)
        return ('formule', i, j, [a, b]), j
    assert k == 3 and w[i + 1] >= 8
    a, j = lire_formule(w, i + 2)
    return ('formule', i, j, [a]), j


def est_terme(w):
    try:
        a, j = lire_terme(w, 0)
        return j == len(w)
    except (IndexError, KeyError):
        return False


def est_formule(w):
    try:
        a, j = lire_formule(w, 0)
        return j == len(w)
    except (IndexError, KeyError, AssertionError):
        return False


def noeuds(a, prof=0):
    yield a, prof
    for b in a[3]:
        yield from noeuds(b, prof + 1)


# φ = → = x0 0 ∀x0 = x0 x1, c'est-à-dire x0 = 0 → ∀x0 (x0 = x1)
PHI = (2, 0, 8, 4, 3, 8, 0, 8, 9)


def fond_mot(S, X, y, w, couleurs=None):
    couleurs = couleurs or {}
    for j, k in enumerate(w):
        S.texte((X[j], y), nom_lettre(k), couleurs.get(j, 't'), taille=19)
        S.texte((X[j], y + 28), str(j), 'g', taille=14)


# ================================================================ cal-sx-formules
@schema('cal-sx-formules')
def cal_sx_formules():
    w = PHI
    arbre, fin = lire_formule(w, 0)
    assert fin == len(w) and est_formule(w)
    liste = list(noeuds(arbre))
    # chaque nœud est un facteur propre de son parent : intervalle strictement contenu
    for a, _ in liste:
        for b in a[3]:
            assert a[1] <= b[1] and b[2] <= a[2] and (b[2] - b[1]) < (a[2] - a[1])
    # codes exacts des petits facteurs, et inégalité stricte vérifiée quand le parent est calculable
    codes = {}
    for a, _ in liste:
        u = w[a[1]:a[2]]
        if len(u) <= 3:
            codes[a[1], a[2]] = code(u)
    assert codes[2, 3] == 17 and codes[3, 4] == 9 and codes[8, 9] == 19 and codes[7, 8] == 17
    assert codes[1, 4] == 2 ** 34 * 9 == 154618822656 and codes[6, 9] == 2 ** 34 * 19
    for a, _ in liste:
        for b in a[3]:
            if (a[1], a[2]) in codes:
                assert codes[b[1], b[2]] < codes[a[1], a[2]]
    # découpage de la racine : le seul j tel que w[1:j] et w[j:] soient des formules est 4
    coupes = [j for j in range(2, len(w)) if est_formule(w[1:j]) and est_formule(w[j:])]
    assert coupes == [4]
    # sous-formule du bloc ∀x0 : elle commence en 6 (deux lettres après ∀)
    assert w[4] == 3 and w[5] == 8 and est_formule(w[6:9])

    W, H = 520, 300
    S = Schema(W, H, 'Arbre de lecture de → = x0 0 ∀x0 = x0 x1 dessiné par ses facteurs')
    dx = 50
    x0 = (W - dx * (len(w) - 1)) / 2
    X = [x0 + dx * j for j in range(len(w))]
    ytop, gap = 46, 46
    Y = lambda p: ytop + gap * p
    ymot = Y(3) + 46
    fond_mot(S, X, ymot, w)
    etiq = {(2, 3): '17', (3, 4): '9', (7, 8): '17', (8, 9): '19',
            (1, 4): '2^{34}·9', (6, 9): '2^{34}·19'}
    for (i, j), e in etiq.items():
        assert e.replace('2^{34}·', '') == str(codes[i, j] // (2 ** 34 if j - i == 3 else 1))
    for a, p in liste:
        nat, i, j, fils = a
        c = 'r' if p == 0 else ('b' if nat == 'terme' else 't')
        xa, xb = X[i] - dx / 2 + 4, X[j - 1] + dx / 2 - 4
        S.ligne((xa, Y(p)), (xb, Y(p)), c, l=3.2)
        for b in fils:
            xm = (X[b[1]] + X[b[2] - 1]) / 2
            S.ligne((xm, Y(p) + 4), (xm, Y(p + 1) - 4), 'g', d=True)
        if (i, j) in etiq:                  # à droite du trait qui arrive du parent, au milieu du facteur
            S.texte(((X[i] + X[j - 1]) / 2 + 7, Y(p) - 14), etiq[i, j], c, ancre='start', taille=14)
    # coupe de la racine, en rouge, entre les positions 3 et 4
    xc = (X[3] + X[4]) / 2
    S.ligne((xc, Y(0) - 10), (xc, ymot - 16), 'r', d=True)
    S.texte((xc + 6, Y(0) - 16), 'j = 4', 'r', ancre='start', taille=15)
    S.texte((X[0] - dx / 2 + 4, Y(0) - 16), '`racine`', 'r', ancre='start', taille=15)
    return S


# ================================================================ cal-sx-libres
@schema('cal-sx-libres')
def cal_sx_libres():
    w = PHI
    assert est_formule(w)
    n = len(w)
    pos_var = [j for j in range(n) if w[j] >= 8 and (j == 0 or w[j - 1] != 3)]

    def liee(j):
        return any(w[i] == 3 and w[i + 1] == w[j] and i + 2 <= j < l and est_formule(w[i + 2:l])
                   for i in range(j) for l in range(n + 1))
    libres = [j for j in pos_var if not liee(j)]
    assert pos_var == [2, 7, 8] and libres == [2, 8]
    # le témoin de la liaison de la position 7 : i = 4, l = 9, et c'est le seul
    temoins = [(i, l) for i in range(7) for l in range(n + 1)
               if w[i] == 3 and w[i + 1] == w[7] and i + 2 <= 7 < l and est_formule(w[i + 2:l])]
    assert temoins == [(4, 9)]
    # pour la position 8 (x1), le seul quantificateur est ∀x0 : pas de témoin
    assert not liee(8) and w[5] != w[8]
    # variables libres par la récurrence usuelle : {x0, x1}
    assert sorted({w[j] for j in libres}) == [8, 9]

    W, H = 520, 200
    S = Schema(W, H, 'Occurrences libres et liées de → = x0 0 ∀x0 = x0 x1 lues sur les positions')
    dx = 50
    x0 = (W - dx * (n - 1)) / 2
    X = [x0 + dx * j for j in range(n)]
    ymot = 92
    coul = {2: 'r', 8: 'r', 7: 'b', 5: 'g', 4: 'g'}
    fond_mot(S, X, ymot, w, coul)
    # bloc ∀x0 encadré
    S.rect(X[4] - dx / 2 + 6, ymot - 17, 2 * dx - 12, 34, 'g', rx=8)
    # arc de liaison du bloc à l'occurrence 7
    S.poly(courbe_entre((X[5], ymot - 20), (X[7], ymot - 20), courbure=-0.5), 'b', l=1.6)
    # portée : de i + 2 = 6 à l′ − 1 = 8
    ya = ymot + 46
    S.ligne((X[6] - dx / 2 + 6, ya), (X[8] + dx / 2 - 6, ya), 'b', l=2.4)
    S.texte(((X[6] + X[8]) / 2, ya + 18), '`portée de` ∀x_0', 'b', taille=15)
    S.texte(((X[6] + X[8]) / 2, ya + 40), 'i + 2 = 6 ⩽ j < l′ = 9', 'g', taille=14)
    for j, lab, c in [(2, 'libre', 'r'), (8, 'libre', 'r'), (7, 'liée', 'b')]:
        S.texte((X[j], ymot - 46 if j != 7 else ymot - 62), lab, c, ui=True)
    S.texte((X[4] + dx / 2, ymot - 34), 'bloc', 'g', ui=True)
    return S
